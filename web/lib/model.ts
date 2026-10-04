// Client-side re-implementation of the formulas in docs/data-contract.md.
// Strategy: compute a RAW scenario from first principles, compute the RAW base case, and scale
// the data file's headline numbers by raw(scenario)/raw(base). At base sliders the output therefore
// equals the Python model's numbers exactly; moving a slider shows physically-motivated relative change.
import type { FuelKey, Ring, Site2Data } from "./types";

// ---- constants from the data contract (model physics, not site data) ----
export const ETA = 0.5; // fraction of Carnot
export const APPROACH_K = 3; // heat exchanger approach, each side
export const LIFETIME_YR = 30;
export const COP_MIN = 2; // same clip as the Python model: COP in [2, 6]
export const COP_MAX = 6;
export const DIRECT_PUMP_FRACTION = 0.02; // pumping power when heat is used directly, no lift
export const CAPTURE_TEMP_C = { air: 30, liquid: 50 } as const;
// Default sink temperatures if a ring does not carry sink_temp_C (assumption, documented in docs/frontend-notes.md).
export const DEFAULT_SINK_C: Record<string, number> = { onsite: 45, corridor: 55, town: 65 };
// Share of displaced fuel, used only to blend emission factors for ring-level CO2 (assumption).
export const FUEL_MIX: Partial<Record<FuelKey, number>> = { propane: 0.55, heating_oil: 0.25, natural_gas: 0.2 };
const FALLBACK_EF: Record<FuelKey, number> = { propane: 210, heating_oil: 252, natural_gas: 181, electric_resistance: 0, air_source_hp: 0 };
const FALLBACK_EFF: Record<FuelKey, number> = { propane: 0.85, heating_oil: 0.82, natural_gas: 0.85, electric_resistance: 1, air_source_hp: 2.8 };
const FALLBACK_GRID = 110.1;
const SUPPLY_USABLE = 0.95; // share of captured heat that can actually be drawn

export type Cooling = "air" | "liquid";

export interface Params {
  elecPrice: number; // $/MWh
  cooling: Cooling;
  uptakePct: number; // corridor homes sign-up, %
  discountPct: number; // %
  loadMW: number; // IT load
  includeTown: boolean;
}

const K = 273.15;

/** cop = eta * T_sink_K / (T_sink_K - T_source_K + 2*approach), clipped to [COP_MIN, COP_MAX] like the Python model. */
export function cop(tSinkC: number, tSourceC: number, eta = ETA, approach = APPROACH_K): number {
  const sink = tSinkC + K;
  const src = tSourceC + K;
  const denom = sink - src + 2 * approach;
  if (denom <= 0) return COP_MAX;
  return Math.max(COP_MIN, Math.min(COP_MAX, (eta * sink) / denom));
}

/** True when the source is warm enough to feed the user directly with no heat pump lift. */
export function isDirect(tSinkC: number, tSourceC: number, approach = APPROACH_K): boolean {
  return tSourceC - approach >= tSinkC;
}

export function crf(rate: number, n = LIFETIME_YR): number {
  if (rate === 0) return 1 / n;
  const g = Math.pow(1 + rate, n);
  return (rate * g) / (g - 1);
}

export function hpElec(heatMWh: number, copValue: number): number {
  return heatMWh / copValue;
}

/** lcoh = (capex*crf(r,30) + opex_fixed + elec_price*hp_elec) / heat_delivered. capex/opex in $, result $/MWh. */
export function lcoh(capexUsd: number, opexUsdYr: number, elecPrice: number, hpElecMWh: number, heatMWh: number, rate: number): number {
  if (heatMWh <= 0) return Infinity;
  return (capexUsd * crf(rate) + opexUsdYr + elecPrice * hpElecMWh) / heatMWh;
}

export function householdSavings(heatMWhYr: number, incumbentUsdMWh: number, tariffUsdMWh: number): number {
  return heatMWhYr * (incumbentUsdMWh - tariffUsdMWh);
}

/** co2 (t) = fossil_MWh * EF_fuel(kg/MWh_th)/eff - hp_elec_MWh * EF_grid(kg/MWh), converted to tonnes. */
export function co2Avoided(fossilMWh: number, efKgPerMWh: number, eff: number, hpElecMWh: number, gridKgPerMWh: number): number {
  return (fossilMWh * (efKgPerMWh / eff) - hpElecMWh * gridKgPerMWh) / 1000;
}

// ---------------------------------------------------------------------------------------------
/** Industrial (central heat pump + pumping) electricity price, $/MWh. Read from the data file; never hardcoded. */
export function baseElecPrice(d: Site2Data): number {
  const e = d.finance.elec_price_usd_mwh as unknown;
  if (typeof e === "number") return e;
  if (e && typeof e === "object") {
    const o = e as Record<string, number>;
    if (typeof o.industrial === "number") return o.industrial;
  }
  const k = d.extras?.electricity_rates_usd_kwh?.central_hp_and_pumping_industrial;
  return typeof k === "number" ? k * 1000 : 108;
}

export function baseParams(d: Site2Data): Params {
  return {
    elecPrice: baseElecPrice(d),
    cooling: d.supply.capture_temp_C >= 40 ? "liquid" : "air",
    uptakePct: 100,
    discountPct: d.assumptions?.discount_rate_base_pct ?? 4,
    loadMW: d.supply.it_load_MW,
    includeTown: false, // data-file totals cover Phases 1-2; the town ring is reported separately
  };
}

interface Raw {
  availMWh: number;
  deliveredMWh: number;
  hpElecMWh: number;
  avgCop: number;
  lcoh: number;
  co2: number;
  supplyLimited: boolean;
  byRing: { id: string; demandMWh: number; cop: number; direct: boolean }[];
}

function ringDemandFactor(r: Ring, p: Params): number {
  if (r.id === "corridor") return p.uptakePct / 100;
  if (r.id === "town") return p.includeTown ? 1 : 0;
  return 1;
}

function raw(d: Site2Data, p: Params, baseElecRaw?: number): Raw {
  const T = CAPTURE_TEMP_C[p.cooling];
  const availMWh = p.loadMW * 8760 * d.supply.load_factor * d.supply.capture_fraction;
  let rings = d.rings.map((r) => {
    const sink = r.sink_temp_C ?? DEFAULT_SINK_C[r.id] ?? r.supply_temp_C;
    const direct = isDirect(sink, T);
    const c = direct ? 1 / DIRECT_PUMP_FRACTION : cop(sink, T);
    const demand = r.annual_MWh * ringDemandFactor(r, p);
    return { r, demand, cop: c, direct };
  });
  const drawn = (xs: typeof rings) => xs.reduce((s, x) => s + x.demand - x.demand / x.cop, 0);
  let supplyLimited = false;
  const cap = availMWh * SUPPLY_USABLE;
  const dr = drawn(rings);
  if (dr > cap && dr > 0) {
    supplyLimited = true;
    const f = cap / dr;
    rings = rings.map((x) => ({ ...x, demand: x.demand * f }));
  }
  const delivered = rings.reduce((s, x) => s + x.demand, 0);
  const elec = rings.reduce((s, x) => s + x.demand / x.cop, 0);
  const avgCop = elec > 0 ? delivered / elec : COP_MAX;

  // Capex scales with the pipe km of included rings (55%) and with connected peak load (45%).
  const totPipe = d.rings.reduce((s, r) => s + r.pipe_km, 0) || 1;
  const totPeak = d.rings.reduce((s, r) => s + r.peak_MW, 0) || 1;
  const incPipe = d.rings.reduce((s, r) => s + (ringDemandFactor(r, p) > 0 ? r.pipe_km : 0), 0);
  const incPeak = d.rings.reduce((s, r) => s + r.peak_MW * ringDemandFactor(r, p), 0);
  const scale = 0.55 * (incPipe / totPipe) + 0.45 * (incPeak / totPeak);
  // opex_musd_yr already contains electricity. Split it: non-electric opex (scaled with the network) plus
  // electricity re-priced at the slider value, so electricity is counted exactly once.
  const elecFileMWh = d.totals.hp_elec_MWh * (elec / (baseElecRaw ?? (elec || 1)));
  const opexOther = Math.max(0, d.finance.opex_musd_yr * 1e6 - baseElecPrice(d) * d.totals.hp_elec_MWh);
  const l = lcoh(d.finance.capex_musd.total * 1e6 * scale, opexOther * scale, p.elecPrice, elecFileMWh, delivered, p.discountPct / 100);

  const ef = d.assumptions?.ef_kg_per_MWh_th ?? {};
  const eff = d.assumptions?.fuel_efficiency ?? {};
  const grid = d.assumptions?.grid_kg_per_MWh ?? FALLBACK_GRID;
  let efBlend = 0;
  let wsum = 0;
  (Object.keys(FUEL_MIX) as FuelKey[]).forEach((f) => {
    const w = FUEL_MIX[f] ?? 0;
    efBlend += w * (ef[f] ?? FALLBACK_EF[f]) / (eff[f] ?? FALLBACK_EFF[f]);
    wsum += w;
  });
  const fossilShare = d.totals.heat_delivered_MWh > 0 ? Math.min(1, d.impact.fossil_displaced_MWh / d.totals.heat_delivered_MWh) : 0.8;
  const co2 = (delivered * fossilShare * efBlend / wsum - elec * grid) / 1000;

  return {
    availMWh, deliveredMWh: delivered, hpElecMWh: elec, avgCop, lcoh: l, co2, supplyLimited,
    byRing: rings.map((x) => ({ id: x.r.id, demandMWh: x.demand, cop: x.cop, direct: x.direct })),
  };
}

export interface Scenario {
  heatAvailableGWh: number;
  heatDeliveredMWh: number;
  sharePct: number;
  surplusGWh: number;
  hpElecMWh: number;
  avgCop: number;
  lcohUsdMWh: number;
  tariffUsdMWh: number;
  householdSavingsPropane: number;
  householdSavingsOil: number;
  marginUsdMWh: number; // tariff minus LCOH at the scenario's discount rate
  co2TYr: number;
  supplyLimited: boolean;
  homesServed: number;
  byRing: { id: string; demandMWh: number; cop: number; direct: boolean }[];
}

function rate(s: number, b: number): number {
  return b > 0 && Number.isFinite(s) ? s / b : 1;
}

/** Discount rates (%) at which the Python model publishes exact LCOH values. */
export const LCOH_ANCHOR_PCT = [4, 7, 10] as const;

/**
 * Python-model LCOH at discount rate `pct`, all other inputs at base. Exact at 4/7/10 %, linear between
 * the published anchors. Uses the with-town anchors when the town ring is included and the file has them.
 * Returns null outside [4, 10] or when anchors are missing.
 */
export function anchoredLcoh(d: Site2Data, pct: number, town = false): number | null {
  const src = town ? d.extras?.with_town?.lcoh_usd_mwh : d.finance.lcoh_usd_mwh;
  const v = [src?.coop_4pct, src?.utility_7pct, src?.private_10pct];
  if (v.some((x) => typeof x !== "number")) return null;
  const [r0, r1, r2] = LCOH_ANCHOR_PCT;
  if (pct < r0 || pct > r2) return null;
  const [a, b, c] = v as number[];
  return pct <= r1 ? a + ((pct - r0) / (r1 - r0)) * (b - a) : b + ((pct - r1) / (r2 - r1)) * (c - b);
}

export function scenario(d: Site2Data, p: Params): Scenario {
  const b = raw(d, baseParams(d));
  const s = raw(d, p, b.hpElecMWh);
  // LCOH: anchor to the Python model's published 4/7/10 % values (interpolated between them), then apply the
  // client model's relative change for the other sliders against a reference at the same discount rate.
  const town = p.includeTown && anchoredLcoh(d, 4, true) !== null;
  const refPct = Math.min(LCOH_ANCHOR_PCT[2], Math.max(LCOH_ANCHOR_PCT[0], p.discountPct));
  const anchor = anchoredLcoh(d, refPct, town);
  const ref = raw(d, { ...baseParams(d), discountPct: refPct, includeTown: town }, b.hpElecMWh);
  const lcohV = anchor !== null ? anchor * rate(s.lcoh, ref.lcoh) : d.finance.lcoh_usd_mwh.coop_4pct * rate(s.lcoh, b.lcoh);
  const deliveredMWh = d.totals.heat_delivered_MWh * rate(s.deliveredMWh, b.deliveredMWh);
  const availGWh = d.supply.heat_available_GWh * rate(s.availMWh, b.availMWh);
  const tariff = d.finance.tariff_usd_mwh; // policy-set (0.8x propane), does not move with cost
  const hh = d.finance.household.typical_MWh_yr;
  const corridor = d.rings.find((r) => r.id === "corridor");
  return {
    heatAvailableGWh: availGWh,
    heatDeliveredMWh: deliveredMWh,
    sharePct: (deliveredMWh / (availGWh * 1000)) * 100,
    surplusGWh: availGWh - deliveredMWh / 1000,
    hpElecMWh: d.totals.hp_elec_MWh * rate(s.hpElecMWh, b.hpElecMWh),
    avgCop: d.totals.avg_cop * rate(s.avgCop, b.avgCop),
    lcohUsdMWh: lcohV,
    tariffUsdMWh: tariff,
    householdSavingsPropane: householdSavings(hh, d.finance.incumbent_usd_mwh.propane, tariff),
    householdSavingsOil: householdSavings(hh, d.finance.incumbent_usd_mwh.heating_oil, tariff),
    marginUsdMWh: tariff - lcohV,
    co2TYr: d.impact.co2_avoided_t_yr * rate(s.co2, b.co2),
    supplyLimited: s.supplyLimited,
    homesServed: Math.round((corridor?.homes ?? d.impact.homes_served) * (p.uptakePct / 100)),
    byRing: s.byRing,
  };
}

// ---- household calculator (story step 7) ----
export const HOME_SIZES = [
  { id: "small", label: "Small", detail: "about 1,200 sq ft", factor: 0.7 },
  { id: "typical", label: "Typical", detail: "about 1,800 sq ft", factor: 1 },
  { id: "large", label: "Large", detail: "about 2,800 sq ft", factor: 1.5 },
] as const;

export const FUEL_LABEL: Record<FuelKey, string> = {
  propane: "Propane",
  heating_oil: "Heating oil",
  natural_gas: "Natural gas",
  electric_resistance: "Electric baseboard",
  air_source_hp: "Air-source heat pump",
};

export interface HouseholdResult {
  heatMWh: number;
  incumbentCost: number;
  coopCost: number;
  savingsUsd: number;
  co2KgSaved: number;
}

export function household(d: Site2Data, fuel: FuelKey, factor: number): HouseholdResult {
  const mwh = d.finance.household.typical_MWh_yr * factor;
  const inc = d.finance.incumbent_usd_mwh[fuel];
  const tariff = d.finance.tariff_usd_mwh;
  const given = fuel === "propane" ? d.finance.household.savings_vs_propane_usd * factor : fuel === "heating_oil" ? d.finance.household.savings_vs_oil_usd * factor : undefined;
  const ef = d.assumptions?.ef_kg_per_MWh_th?.[fuel] ?? FALLBACK_EF[fuel];
  const eff = d.assumptions?.fuel_efficiency?.[fuel] ?? FALLBACK_EFF[fuel];
  const grid = d.assumptions?.grid_kg_per_MWh ?? FALLBACK_GRID;
  const electric = fuel === "electric_resistance" || fuel === "air_source_hp";
  const oldKg = mwh * ((electric ? grid : ef) / eff);
  const newKg = (mwh / d.totals.avg_cop) * grid;
  return { heatMWh: mwh, incumbentCost: mwh * inc, coopCost: mwh * tariff, savingsUsd: given ?? householdSavings(mwh, inc, tariff), co2KgSaved: oldKg - newKg };
}

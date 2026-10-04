// Client-side recompute of LCOH for the Explore sliders, from the model's per-ring building blocks.
// Formulas follow docs/data-contract.md. The Python model remains the source of truth.
import { site } from "./data";

const ex = site.explore;

export type Inputs = {
  elecCommercial: number; // $/kWh
  elecResidential: number; // $/kWh
  liquidCooling: boolean;
  homes: number;
  discountRate: number;
  dcLoadMW: number;
  phase2Grant: number; // capex grant share, corridor only
};

export const DEFAULTS: Inputs = {
  elecCommercial: ex.elec_commercial_usd_per_kWh,
  elecResidential: ex.elec_residential_usd_per_kWh,
  liquidCooling: true,
  homes: ex.homes,
  discountRate: 0.04, // co-op / municipal rate, the gate case
  dcLoadMW: ex.supply.it_load_MW,
  phase2Grant: 0,
};

export const crf = (r: number, n: number) => (r * (1 + r) ** n) / ((1 + r) ** n - 1);

export function cop(source: number, sink: number) {
  const hp = ex.heat_pump;
  const c = (hp.eta_carnot * (sink + 273.15)) / (sink - source + 2 * hp.approach_K);
  return Math.min(Math.max(c, hp.cop_min), hp.cop_max);
}

type RingCost = { annual: number; heat: number; capex: number };

function ringCost(id: "onsite" | "corridor" | "town", i: Inputs): RingCost {
  const r = ex.rings[id];
  const scale = r.per_home ? i.homes / ex.homes : 1;
  let capex = r.capex_usd * scale;
  let hpElec = r.hp_elec_MWh * scale;
  const elecPrice = (r.elec_tariff === "residential" ? i.elecResidential : i.elecCommercial) * 1000;

  if (!i.liquidCooling && id === "onsite") {
    // Air-cooled heat (~30 °C) cannot feed 45 °C greenhouse loops directly: add a heat pump.
    const c = cop(ex.air_cooled_capture_C, ex.onsite_supply_C);
    hpElec += r.heat_MWh / c;
    capex += r.peak_MW * 1000 * ex.central_hp_usd_per_kW * ex.markup;
  }
  if (!i.liquidCooling && id === "town") {
    const sink = ringSink("town");
    hpElec *= cop(50, sink) / cop(ex.air_cooled_capture_C, sink);
  }
  const grant = id === "corridor" ? i.phase2Grant : 0;
  const annual =
    capex * (1 - grant) * crf(i.discountRate, ex.years) +
    capex * r.om_frac +
    hpElec * elecPrice +
    r.pump_elec_MWh * scale * i.elecCommercial * 1000 +
    r.backup_MWh * scale * r.backup_usd_mwh;
  return { annual, heat: r.heat_MWh * scale, capex };
}

function ringSink(id: string) {
  const r = site.rings.find((x) => x.id === id)!;
  return r.supply_temp_C as number;
}

export function compute(i: Inputs) {
  const onsite = ringCost("onsite", i);
  const corridor = ringCost("corridor", i);
  const town = ringCost("town", i);
  const lcoh = (...rs: RingCost[]) => rs.reduce((a, r) => a + r.annual, 0) / rs.reduce((a, r) => a + r.heat, 0);
  const lf = site.supply.load_factor;
  const availableMWh = i.dcLoadMW * lf * ex.supply.capture_fraction * (8760 - ex.outage_hours);
  const used = onsite.heat + corridor.heat;
  return {
    onsite: lcoh(onsite),
    corridor: lcoh(corridor),
    town: lcoh(town),
    phase12: lcoh(onsite, corridor),
    capex12: onsite.capex + corridor.capex * (1 - i.phase2Grant),
    availableMWh,
    shareUsed: used / availableMWh,
    usedMWh: used,
  };
}

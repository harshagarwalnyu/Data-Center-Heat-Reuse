"use client";
import { useEffect, useState, type ReactNode } from "react";
import type { Site2Data } from "@/lib/types";
import { BASE_PATH, PUBLIC_URL } from "@/lib/config";
import { dec, int } from "@/lib/format";
import { APPROACH_K, COP_MAX, COP_MIN, ETA, cop, crf } from "@/lib/model";
import { Term } from "./Tooltip";

// Values that live only in config files (not in site2.json). Each is cited to its file on the step that uses it.
const AVAILABILITY = 0.99; // config/engineering.yaml supply.capture_availability
const HOURS = 8760;
const PROPANE = { usdGal: 3.1, kwhGal: 26.8, eff: 0.85 }; // config/finance.yaml prices + eff
const TARIFF_SHARE = 0.8; // config/finance.yaml tariff.discount_vs_propane = 0.20
const LIFE = { pipe: 30, tank: 30, equip: 20 } as const; // config/finance.yaml life_years
const KG_CAR = 4.29; // t CO2e per car-year, config/impact.yaml kg_co2_per_car_yr 4290 (EPA)
const RATES = [0.04, 0.07, 0.1] as const;

/** Same rule as life_class() in src/heatreuse/finance.py. */
const lifeClass = (item: string): keyof typeof LIFE => {
  const t = item.toLowerCase();
  return t.includes("pipe") || t.includes("lateral") ? "pipe" : t.includes("tank") ? "tank" : "equip";
};

interface McStats { P10: number; P50: number; P90: number }
interface Detail { monte_carlo: { n_draws: number; stats: { lcoh_blended_7pct: McStats } } }

const usd = (n: number, d = 1) => `$${dec(n, d)}`;
const cfg = (path: string) => ({ label: path, href: `${PUBLIC_URL}/blob/main/${path}` });

type Src = { label: string; href?: string };

function Chip({ s }: { s: Src }) {
  const cls = "chip text-[1rem] py-1 px-3 no-underline";
  return s.href ? (
    <a className={cls} href={s.href} target="_blank" rel="noreferrer" style={{ color: "var(--teal-text)" }}>{s.label} <span aria-hidden>↗</span></a>
  ) : (
    <span className={cls}>{s.label}</span>
  );
}

function Row({ label, value, src }: { label: ReactNode; value: ReactNode; src?: Src[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-2.5 border-t border-line first:border-t-0">
      <div className="min-w-0 flex-1 basis-[14rem]">
        <span className="text-ink2">{label}</span>{" "}
        <b className={typeof value === "string" && value.length > 28 ? "num" : "num whitespace-nowrap"}>{value}</b>
      </div>
      {src && src.length > 0 && <div className="flex flex-wrap gap-1.5">{src.map((s) => <Chip key={s.label} s={s} />)}</div>}
    </div>
  );
}

function Step({ n, title, stat, unit, formula, children, check, tone }: { n: number; title: string; stat: string; unit: string; formula: ReactNode; children: ReactNode; check: ReactNode; tone: string }) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-x-3 sm:gap-x-5">
      <div className="flex flex-col items-center" aria-hidden>
        <span className="grid place-items-center w-11 h-11 rounded-full font-bold serif text-[1.25rem] text-bg" style={{ background: "var(--brown)" }}>{n}</span>
        <span className="flex-1 w-0.5 mt-2 bg-line" />
      </div>
      <div className="pb-10 min-w-0">
        <h3 className="t-h3 m-0">{title}</h3>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-3">
          <span className="t-stat num" style={{ fontSize: "clamp(2.25rem, 1.6rem + 2.4vw, 3.25rem)" }}>{stat}</span>
          <span className="text-ink2">{unit}</span>
        </div>
        <p className="num m-0 mt-3">{formula}</p>
        <div className="card mt-4 px-4 sm:px-5 py-2">{children}</div>
        <p className="m-0 mt-3 rounded-2xl px-4 py-3 text-ink" style={{ background: tone }}>
          <b>Checks out:</b> <span className="num">{check}</span>
        </p>
      </div>
    </li>
  );
}

export function MathSteps({ d }: { d: Site2Data }) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [sink, setSink] = useState(55);
  const [src, setSrc] = useState(d.supply.capture_temp_C);

  useEffect(() => {
    const ac = new AbortController();
    fetch(`${BASE_PATH}/data/analysis_detail.json`, { cache: "no-cache", signal: ac.signal })
      .then((r) => (r.ok ? (r.json() as Promise<Detail>) : null))
      .then((j) => j && setDetail(j))
      .catch(() => {});
    return () => ac.abort();
  }, []);

  const S = d.supply, T = d.totals, f = d.finance, im = d.impact, cba = d.extras?.cba;
  const ring = (id: string) => d.rings.find((r) => r.id === id);
  const on = ring("onsite"), co = ring("corridor");
  const source = (id: string, label: string): Src => {
    const s = d.sources.find((x) => x.id === id);
    if (!s || !s.url) return { label };
    return { label, href: /^https?:/.test(s.url) ? s.url : `${PUBLIC_URL}/blob/main/${s.url}` };
  };

  // 1. heat available
  const prod = (S.it_load_MW * S.load_factor * S.capture_fraction * AVAILABILITY * HOURS) / 1000;
  // 2. share used
  const used = (on?.annual_MWh ?? 0) + (co?.annual_MWh ?? 0);
  const share = (T.heat_delivered_MWh / (S.heat_available_GWh * 1000)) * 100;
  // 3. propane
  const propane = (PROPANE.usdGal / PROPANE.kwhGal / PROPANE.eff) * 1000;
  // 4. tariff and saving
  const tariff = TARIFF_SHARE * f.incumbent_usd_mwh.propane;
  const hh = f.household.typical_MWh_yr;
  // 5. COP
  const c = cop(sink, src);
  const raw = (ETA * (sink + 273.15)) / Math.max(1e-6, sink - src + 2 * APPROACH_K);
  // 6. LCOH rebuilt from capex lines with the model's asset lives
  const lines = f.capex_musd.lines;
  const hard = lines.filter((l) => !/^(soft|contingency)/i.test(l.item));
  const hardSum = hard.reduce((a, l) => a + l.musd, 0);
  const markup = f.capex_musd.total / hardSum;
  const cls = { pipe: 0, tank: 0, equip: 0 };
  for (const l of hard) cls[lifeClass(l.item)] += l.musd * markup;
  const lcoh = (r: number) => (cls.pipe * crf(r, LIFE.pipe) + cls.tank * crf(r, LIFE.tank) + cls.equip * crf(r, LIFE.equip) + f.opex_musd_yr) * 1e6 / T.heat_delivered_MWh;
  const lcohSimple7 = (f.capex_musd.total * crf(0.07, 30) + f.opex_musd_yr) * 1e6 / T.heat_delivered_MWh;
  const lcOn = on?.lcoh_usd_mwh_7pct ?? d.extras?.ring_lcoh_usd_mwh?.onsite ?? 0;
  const lcCo = co?.lcoh_usd_mwh_7pct ?? d.extras?.ring_lcoh_usd_mwh?.corridor ?? 0;
  const blend = ((lcOn * (on?.annual_MWh ?? 0)) + (lcCo * (co?.annual_MWh ?? 0))) / used;
  // 7. funding gap
  const gap = cba?.whole_project_gap_musd ?? 0;
  const corr = cba?.corridor_gap_musd ?? 0;
  const ann = gap * crf(0.07, 30);
  const build = cba?.dc_capex_musd ?? 0;
  // 8. CO2
  const cars = im.co2_avoided_t_yr / KG_CAR;
  const mc = detail?.monte_carlo;

  const tone = "var(--sage)";
  return (
    <ol className="list-none m-0 p-0" aria-label="How every number checks out">
      <Step n={1} title="How much heat the data center gives off" stat={int(S.heat_available_GWh)} unit="GWh of heat per year" tone={tone}
        formula="IT load × load factor × share captured × uptime × hours in a year"
        check={<>{int(S.it_load_MW)} × {S.load_factor} × {S.capture_fraction} × {AVAILABILITY} × {int(HOURS)} h = {dec(prod, 0)} GWh. The model runs hour by hour, so its {dec(S.heat_available_GWh, 1)} GWh is "about" this.</>}>
        <Row label="IT load" value={`${int(S.it_load_MW)} MW`} src={[source("ver_proj", "project facts"), cfg("config/engineering.yaml")]} />
        <Row label="Load factor" value={String(S.load_factor)} src={[cfg("config/engineering.yaml")]} />
        <Row label="Share of heat captured" value={`${dec(S.capture_fraction * 100, 0)}%`} src={[source("rii", "RII study"), source("ocp", "OCP")]} />
        <Row label="Uptime of the capture loop" value={String(AVAILABILITY)} src={[cfg("config/engineering.yaml")]} />
      </Step>

      <Step n={2} title="How much of that heat we actually use" stat={`${dec(share, 1)}%`} unit="of the available heat" tone={tone}
        formula="heat delivered ÷ heat available"
        check={<>{int(on?.annual_MWh ?? 0)} + {int(co?.annual_MWh ?? 0)} = {int(used)} MWh. {int(used)} ÷ {int(S.heat_available_GWh * 1000)} MWh = {dec(share, 1)}%.</>}>
        <Row label="On-site campus (greenhouse, fish, rec center)" value={`${int(on?.annual_MWh ?? 0)} MWh`} src={[source("rii", "RII benchmark"), source("notes", "model notes")]} />
        <Row label={`Corridor homes (${int(co?.homes ?? 0)} homes)`} value={`${int(co?.annual_MWh ?? 0)} MWh`} src={[source("tmy", "TMYx weather"), source("f2", "fact base")]} />
        <Row label="Heat available (step 1)" value={`${int(S.heat_available_GWh * 1000)} MWh`} />
      </Step>

      <Step n={3} title="What the same heat costs from propane" stat={usd(f.incumbent_usd_mwh.propane)} unit="per MWh of heat" tone={tone}
        formula="price per gallon ÷ kWh of energy per gallon ÷ furnace efficiency × 1,000"
        check={<>{usd(PROPANE.usdGal, 2)} ÷ {PROPANE.kwhGal} ÷ {PROPANE.eff} × 1,000 = {usd(propane)} per MWh (file says {usd(f.incumbent_usd_mwh.propane)}).</>}>
        <Row label="Propane price" value={`${usd(PROPANE.usdGal, 2)} per gallon`} src={[source("nyserda_prop", "NYSERDA"), cfg("config/finance.yaml")]} />
        <Row label="Energy in a gallon" value={`${PROPANE.kwhGal} kWh`} src={[cfg("config/finance.yaml")]} />
        <Row label="Furnace efficiency" value={`${PROPANE.eff * 100}%`} src={[cfg("config/finance.yaml")]} />
      </Step>

      <Step n={4} title="Our price and what a home saves" stat={usd(f.household.savings_vs_propane_usd, 0)} unit="saved per home per year" tone={tone}
        formula="our price = 0.8 × propane price. saving = home use × (propane price − our price)"
        check={<>{TARIFF_SHARE} × {dec(f.incumbent_usd_mwh.propane, 1)} = {usd(tariff)}. {hh} MWh × ({dec(f.incumbent_usd_mwh.propane, 1)} − {dec(tariff, 1)}) = {usd(hh * (f.incumbent_usd_mwh.propane - tariff), 0)}; the file keeps unrounded prices and says {usd(f.household.savings_vs_propane_usd, 0)}.</>}>
        <Row label="Propane price (step 3)" value={`${usd(f.incumbent_usd_mwh.propane)} per MWh`} />
        <Row label="Our price is set at" value="80% of propane" src={[cfg("config/finance.yaml")]} />
        <Row label="Typical home heat use" value={`${hh} MWh per year`} src={[source("f2", "fact base"), source("tmy", "TMYx weather")]} />
      </Step>

      <Step n={5} title="How well the heat pump works" stat={dec(T.avg_cop, 2)} unit="average COP (heat out per unit of power in)" tone={tone}
        formula={<>COP = {ETA} × T<sub>sink</sub> ÷ (T<sub>sink</sub> − T<sub>source</sub> + 2 × {APPROACH_K} K), kept between {COP_MIN} and {COP_MAX}</>}
        check={<>At {sink} °C delivery from a {src} °C source the formula gives {dec(c, 2)}{Math.abs(raw - c) > 0.005 && <> (unclipped {dec(raw, 2)})</>}. The yearly average across the heat pumps is {dec(T.avg_cop, 2)}.</>}>
        <Row label={<>Half of the ideal (<Term tip="The best any heat pump could do between two temperatures. Real ones reach about half.">Carnot</Term>) limit</>} value={String(ETA)} src={[source("dig", "organizer digest"), source("t5", "Topic 5 deck")]} />
        <Row label="Temperature gap added by each heat exchanger" value={`${APPROACH_K} K`} src={[cfg("config/engineering.yaml")]} />
        <Row label="Allowed range" value={`${COP_MIN} to ${COP_MAX}`} src={[source("dig", "organizer digest")]} />
        <div className="grid gap-1 py-3 border-t border-line">
          <label className="grid gap-0.5">Try it: delivery temperature <b className="num">{sink} °C</b>
            <input type="range" min={35} max={75} value={sink} onChange={(e) => setSink(+e.target.value)} />
          </label>
          <label className="grid gap-0.5">Heat source (data center return) <b className="num">{src} °C</b>
            <input type="range" min={20} max={60} value={src} onChange={(e) => setSrc(+e.target.value)} />
          </label>
          <div className="num font-bold" style={{ color: "var(--teal-text)" }}>COP {dec(c, 2)}</div>
          <div className="text-ink2 text-caption">Hotter source, smaller lift, higher COP. That is why liquid cooling matters.</div>
        </div>
      </Step>

      <Step n={6} title="What it costs to make a MWh of heat" stat={usd(f.lcoh_usd_mwh.utility_7pct)} unit="per MWh at 7% (LCOH)" tone={tone}
        formula={<><Term tip="Levelized cost of heat: the cost of one delivered MWh, with the build cost spread over the equipment's life.">LCOH</Term> = (capex × <Term tip="Capital recovery factor: the share of the up-front cost charged each year over the equipment life, at a given cost of money.">CRF</Term> + yearly operating cost) ÷ MWh delivered</>}
        check={<>Pipe and tank last {LIFE.pipe} years, equipment {LIFE.equip}. Rebuilt from the capex lines: {usd(lcoh(0.04))} / {usd(lcoh(0.07))} / {usd(lcoh(0.1))} at 4 / 7 / 10%, file says {usd(f.lcoh_usd_mwh.coop_4pct)} / {usd(f.lcoh_usd_mwh.utility_7pct)} / {usd(f.lcoh_usd_mwh.private_10pct)}. If everything lasted 30 years it would be {usd(lcohSimple7)} (too low).</>}>
        <Row label="Capex (build cost)" value={`$${dec(f.capex_musd.total, 2)}M`} src={[cfg("config/finance.yaml"), source("mit", "MIT OCW")]} />
        <Row label="Operating cost" value={`$${dec(f.opex_musd_yr, 2)}M per year`} src={[cfg("config/finance.yaml")]} />
        <Row label="Heat delivered" value={`${int(T.heat_delivered_MWh)} MWh`} />
        <Row label={`CRF at 7%, ${LIFE.pipe} years (pipe, tank)`} value={dec(crf(0.07, LIFE.pipe), 4)} />
        <Row label={`CRF at 7%, ${LIFE.equip} years (equipment)`} value={dec(crf(0.07, LIFE.equip), 4)} />
        <Row label="On-site ring" value={`${usd(lcOn)} per MWh`} />
        <Row label="Corridor ring" value={`${usd(lcCo)} per MWh`} />
        <Row label="Blended (weighted by heat)" value={`${usd(blend)} per MWh`} />
      </Step>

      <Step n={7} title="The funding gap" stat={`$${dec(gap, 2)}M`} unit="gap in today's money, whole project" tone={tone}
        formula="corridor gap − on-site surplus = whole-project gap. share of a data center build = gap ÷ build cost"
        check={<>−${dec(corr, 2)}M + ${dec(corr - gap, 1)}M = −${dec(gap, 2)}M. Spread over 30 years at 7% that is ${dec(ann, 3)}M a year. ${dec(gap, 2)}M ÷ ${int(build)}M = {dec((gap / build) * 100, 2)}% of the build.</>}>
        <Row label="Corridor on its own" value={`−$${dec(corr, 2)}M`} />
        <Row label="On-site surplus (pays part of the corridor)" value={`+$${dec(corr - gap, 1)}M`} />
        <Row label="Data center build cost (our assumption)" value={`$${int(build)}M`} src={[source("tt", "Turner & Townsend"), cfg("config/finance.yaml")]} />
      </Step>

      <Step n={8} title="Carbon we avoid" stat={int(im.co2_avoided_t_yr)} unit="tonnes of CO₂ per year" tone={tone}
        formula="CO₂ from the fuel we replace − CO₂ from the power and backup fuel we add. Cars = tonnes ÷ tonnes per car"
        check={<>{int(im.co2_avoided_t_yr)} ÷ {KG_CAR} t per car = {int(cars)} cars (file says {int(im.co2_cars_equiv)}).</>}>
        <Row label="Fossil heat displaced" value={`${int(im.fossil_displaced_MWh)} MWh`} src={[source("epa_ef", "EPA factors"), source("ver_ef", "price check")]} />
        <Row label="Grid power added for heat pumps" value={`${int(T.hp_elec_MWh)} MWh`} src={[source("egrid", "eGRID")]} />
        <Row label="CO₂ per car per year" value={`${KG_CAR} t`} src={[cfg("config/impact.yaml")]} />
      </Step>

      <Step n={9} title="How sure are we" stat={mc ? usd(mc.stats.lcoh_blended_7pct.P50) : "..."} unit="per MWh, middle of 500 runs" tone={tone}
        formula="re-run the whole model with random inputs, then read the 10th, 50th and 90th percentile of the cost of heat"
        check={mc ? <>{int(mc.n_draws)} full runs: P10 {usd(mc.stats.lcoh_blended_7pct.P10)}, P50 {usd(mc.stats.lcoh_blended_7pct.P50)}, P90 {usd(mc.stats.lcoh_blended_7pct.P90)} per MWh. Propane is {usd(f.incumbent_usd_mwh.propane)}.</> : <>Loading the Monte Carlo file...</>}>
        <Row label="Inputs varied" value="capture share, pipe cost, uptake, heat pump cost, power price, propane price, discount rate" src={[cfg("outputs/analysis_detail.json")]} />
        <Row label="Biggest driver" value="discount rate" />
      </Step>
    </ol>
  );
}

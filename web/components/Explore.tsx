"use client";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppData } from "@/lib/types";
import { baseParams, CAPTURE_TEMP_C, DEFAULT_SINK_C, LCOH_ANCHOR_PCT, scenario, type Cooling, type Params } from "@/lib/model";
import { dec, int, tonnesToTons, usd } from "@/lib/format";
import { NavBar, ringText, ringShort } from "./ui";
import { LcohBars, lcohTitle } from "./viz/Charts";
import { Tween } from "./Tween";
import { Info, TipKey } from "./Tooltip";
import { Swash } from "./look/Paper";
import { CarsRow, PriceBars, ThermoPair } from "./HowFigures";
import { CloudIcon, DropIcon, FanIcon, FlameIcon, FlowStrip, HomeDollarIcon, HouseIcon, PassMark, RingGlyph, ShareRing, TagIcon, ThermoIcon } from "./ExploreFigures";

function Slider({ id, label, value, min, max, step, unit, onChange, fmt }: { id: string; label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void; fmt?: (v: number) => string }) {
  return (
    <div>
      <label htmlFor={id} className="flex justify-between font-bold text-body">
        <span>{label}</span>
        <span className="num text-teal-text">{fmt ? fmt(value) : value}<span className="font-semibold text-ink2 ml-1 text-caption">{unit}</span></span>
      </label>
      <input id={id} type="range" className="rng" style={{ ["--fill" as string]: `${((value - min) / (max - min)) * 100}%` }} min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function Kpi({ label, num, fmt, instant, unit, delta, good, before, badge, tip, icon, fig }: { icon?: ReactNode; fig?: ReactNode; label: string; num: number; fmt: (n: number) => string; instant: boolean; unit: string; delta?: string; good?: boolean | null; before?: string; badge?: string; tip?: ReactNode }) {
  return (
    <div className="card p-4 relative flex flex-col" style={badge ? { borderColor: "var(--ember)", borderWidth: 2 } : undefined}>
      {icon && <span aria-hidden className="absolute top-3 right-3 grid place-items-center w-[44px] h-[44px] rounded-xl" style={{ background: "var(--surface2, var(--surface))" }}>{icon}</span>}
      <div className="text-caption text-ink2 flex flex-wrap items-center gap-x-2 gap-y-1 pr-12"><span>{label}{tip && <>&nbsp;<Info tip={tip} /></>}</span>{badge && <span className="chip !py-1 !px-2 !text-caption" style={{ background: "var(--ember-text)", borderColor: "var(--ember-text)", color: "#fff" }}>{badge}</span>}</div>
      <div className="t-stat num mt-1 flex flex-wrap items-baseline gap-x-3">
        {before && <s className="text-ink2 font-semibold" style={{ fontSize: "0.6em", textDecorationThickness: "3px", textDecorationColor: "var(--ember)" }} aria-label={`was ${before}`}>{before}</s>}
        <span style={badge ? { color: "var(--ember-text)" } : undefined}><Tween value={num} format={fmt} instant={instant} /><span className="unit">{unit}</span></span>
      </div>
      {delta && <div className="num text-caption mt-1 font-semibold" style={{ color: good === null || good === undefined ? "var(--ink2)" : good ? "var(--good)" : "var(--ember-text)" }}>{delta}</div>}
      {fig && <div className="mt-3 pt-3 border-t border-line">{fig}</div>}
    </div>
  );
}

export function Explore({ data }: { data: AppData }) {
  const d = data.site2;
  // Explore opens at 7% cost of money (utility finance), matching the model's published 7% LCOH exactly.
  const base = useMemo(() => ({ ...baseParams(d), discountPct: LCOH_ANCHOR_PCT[1] }), [d]);
  const [p, setP] = useState<Params>(base);
  // Numbers follow a slider instantly while it is being dragged or keyed; presets, toggles and reset ease over 250 ms.
  const [live, setLive] = useState(false);
  useEffect(() => {
    if (!live) return;
    const end = () => setLive(false);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    window.addEventListener("keyup", end);
    return () => { window.removeEventListener("pointerup", end); window.removeEventListener("pointercancel", end); window.removeEventListener("keyup", end); };
  }, [live]);
  const startLive = (e: { target: EventTarget }) => { if ((e.target as HTMLElement).matches?.('input[type="range"]')) setLive(true); };
  const s = scenario(d, p);
  const b = scenario(d, base);
  const set = <K extends keyof Params>(k: K, v: Params[K]) => setP((x) => ({ ...x, [k]: v }));
  const dl = (cur: number, ref: number, d0: number, unit: string, lowerBetter: boolean) => {
    const diff = cur - ref;
    if (Math.abs(diff) < 0.5 * 10 ** -d0) return { t: "same as base case", g: null as boolean | null };
    return { t: `${diff > 0 ? "+" : "-"}${dec(Math.abs(diff), d0)} ${unit} vs base`.replace("  ", " "), g: (lowerBetter ? diff < 0 : diff > 0) as boolean | null };
  };
  const cmp = (c: Cooling) => (c === "air" ? "Air-cooled (86 °F)" : "Liquid-cooled (122 °F)");
  const lc = dl(s.lcohUsdMWh, b.lcohUsdMWh, 0, "$/MWh", true);
  // Town ring on: show the jump against the same settings without it (both come from the model's with_town anchors).
  const noTown = p.includeTown ? scenario(d, { ...p, includeTown: false }) : null;
  const hh = dl(s.householdSavingsPropane, b.householdSavingsPropane, 0, "$", false);
  const co = dl(tonnesToTons(s.co2TYr), tonnesToTons(b.co2TYr), 0, "tons", false);
  const propane = d.finance.incumbent_usd_mwh.propane;
  const noHeat = !Number.isFinite(s.heatAvailableGWh) || s.heatAvailableGWh <= 0;
  // Plain-language notes for extreme settings, so no card shows NaN, Infinity or a share above 100%.
  const notes: string[] = [];
  if (noHeat) notes.push("No heat is produced at this data center size, so there is nothing to deliver. Raise the IT load.");
  else if (s.supplyLimited) notes.push("At this data center size the captured heat is the limit: users get less than they ask for.");
  if (p.uptakePct <= 0) notes.push("No homes sign up, so the corridor ring delivers no heat. Raise the share of homes.");
  if (!noHeat && s.lcohUsdMWh > propane) notes.push(`At these settings heat costs $${int(s.lcohUsdMWh)} per MWh to make, more than propane's $${int(propane)} per MWh. Try a larger data center or a lower cost of money.`);
  const shareText = noHeat || !Number.isFinite(s.sharePct) ? "no heat is produced" : s.sharePct > 100 ? "all of the heat is used; demand is higher than supply" : `${dec(s.sharePct, 1)}% of what is produced`;
  const cp = dl(s.avgCop, b.avgCop, 1, "", false);
  // Live inputs for the little figures: source temperature follows the cooling toggle, delivery temperature is the corridor loop's.
  const corridor = d.rings.find((r) => r.id === "corridor");
  const srcC = CAPTURE_TEMP_C[p.cooling];
  const sinkC = corridor?.sink_temp_C ?? DEFAULT_SINK_C.corridor ?? corridor?.supply_temp_C ?? 55;
  const carsBase = d.impact.co2_cars_equiv;
  const carsNow = b.co2TYr > 0 && s.co2TYr > 0 ? carsBase * (s.co2TYr / b.co2TYr) : 0;
  // One car icon = a round number of cars, chosen so the row never runs past 10 icons.
  const perCar = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000].find((v) => carsNow / v <= 10) ?? 10000;
  const ringPass = (id: string) => { const r = d.rings.find((x) => x.id === id); return r?.passes_gate ?? (r?.lcoh_usd_mwh_7pct !== undefined ? r.lcoh_usd_mwh_7pct <= s.tariffUsdMWh : id !== "town"); };
  return (
    <div className="min-h-dvh flex flex-col">
      <NavBar active="/explore/" />
      <main className="flex-1 px-[clamp(1.25rem,3vw,3rem)] py-6 max-w-[1600px] w-full mx-auto">
        <div className="relative isolate">
          <Swash color="var(--sky)" className="-z-10 left-[-6%] top-[-30%] w-[min(560px,90%)] opacity-70" />
          <p className="kicker m-0 mb-2">Explore mode</p>
          <h1 className="t-h1 m-0 max-w-[30ch]">Change the assumptions and watch the answer move</h1>
          <FlowStrip producedGWh={s.heatAvailableGWh} deliveredGWh={s.heatDeliveredMWh / 1000} sharePct={s.sharePct} />
        </div>
        <div className="grid gap-6 mt-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <section className="card p-6 grid gap-6 content-start" aria-label="Assumptions" onPointerDownCapture={startLive} onKeyDownCapture={startLive}>
            <div className="group-label">Energy</div>
            <Slider id="load" label="Data center IT load" value={p.loadMW} min={5} max={400} step={5} unit="MW" onChange={(v) => set("loadMW", v)} />
            <div>
              <div className="font-bold text-body mb-2" id="cool-l">Data center cooling type</div>
              <div role="radiogroup" aria-labelledby="cool-l" className="flex gap-2 flex-wrap">
                {(["air", "liquid"] as Cooling[]).map((c) => <button key={c} role="radio" aria-checked={p.cooling === c} className="btn" onClick={() => set("cooling", c)}>{c === "air" ? <FanIcon /> : <DropIcon />}{cmp(c)}</button>)}
              </div>
            </div>
            <div className="group-label">Customers</div>
            <Slider id="uptake" label="Share of the signed corridor homes" value={p.uptakePct} min={10} max={100} step={5} unit="%" onChange={(v) => set("uptakePct", v)} />
            <label className="flex items-center gap-3 font-semibold text-body min-h-[44px]">
              <input type="checkbox" className="w-6 h-6" style={{ accentColor: "var(--teal)" }} checked={p.includeTown} onChange={(e) => set("includeTown", e.target.checked)} />
              Add the town-center ring (Phase 3; fails the cost test today)
            </label>
            <div className="group-label">Money</div>
            <Slider id="price" label="Electricity price for heat pumps" value={p.elecPrice} min={60} max={300} step={5} unit="$/MWh" onChange={(v) => set("elecPrice", v)} />
            <Slider id="disc" label="Cost of money (discount rate)" value={p.discountPct} min={1} max={12} step={0.5} unit="%" onChange={(v) => set("discountPct", v)} fmt={(v) => dec(v, 1)} />
            <button className="btn" onClick={() => setP(base)}>Reset to the base case</button>
          </section>

          <section aria-label="Results" aria-live="polite" className="grid gap-4 content-start">
            {notes.map((n) => <div key={n} role="note" className="card p-3 font-semibold" style={{ background: "var(--warn-bg)", borderColor: "var(--amber)" }}>{n}</div>)}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Kpi icon={<FlameIcon />} label="Heat the data center produces" tip={<>What the data center gives off in a year at its IT load, about {int(d.supply.heat_available_GWh)} GWh at the base case. <TipKey k="supply.heat_available_GWh" /></>} num={s.heatAvailableGWh} fmt={int} instant={live} unit="GWh/yr" delta={`${dec(s.surplusGWh, 0)} GWh/yr left over`} />
              <Kpi icon={<HouseIcon />} fig={<div className="flex items-center gap-3"><ShareRing pct={s.sharePct} /><span className="text-caption text-ink2">{noHeat ? "No heat to share." : s.sharePct > 100 ? "Every unit produced is used." : "of the heat produced reaches users; the rest still goes to the air."}</span></div>} label="Heat delivered to Lansing" tip={<>The heat the on-site and corridor rings' users need in a year (the town ring is off by default). At the base case this is {int(d.totals.heat_delivered_MWh / 1000)} GWh. <TipKey k="totals.heat_delivered_MWh" /></>} num={s.heatDeliveredMWh / 1000} fmt={int} instant={live} unit="GWh/yr" delta={shareText} />
              <Kpi icon={<ThermoIcon />} fig={<ThermoPair src={srcC} sink={sinkC} cop={s.avgCop} />} label="Average heat pump COP" tip={<>Units of heat a heat pump delivers per unit of electricity. At the base case this is {dec(d.totals.avg_cop, 1)}. <TipKey k="totals.avg_cop" /></>} num={s.avgCop} fmt={(n) => dec(n, 1)} instant={live} unit="" delta={cp.t} good={cp.g} />
              <Kpi icon={<TagIcon />} label="Cost to make heat" tip={<>Capex times the capital recovery factor, plus operating cost, divided by heat delivered. Base case: ${int(d.finance.lcoh_usd_mwh.utility_7pct)} per MWh. <TipKey k="finance.lcoh_usd_mwh.utility_7pct" /></>} num={s.lcohUsdMWh} fmt={(n) => `$${int(n)}`} instant={live} unit="per MWh" delta={noTown ? `${Math.round(s.lcohUsdMWh) >= Math.round(noTown.lcohUsdMWh) ? "+" : "-"}$${Math.abs(Math.round(s.lcohUsdMWh) - Math.round(noTown.lcohUsdMWh))} per MWh from adding the town ring` : lc.t} good={noTown ? false : lc.g} before={noTown ? `$${int(noTown.lcohUsdMWh)}` : undefined} badge={noTown && d.extras?.with_town?.town_ring_lcoh_usd_mwh !== undefined ? `town ring alone: $${int(d.extras.with_town.town_ring_lcoh_usd_mwh)} per MWh` : undefined} />
              <Kpi icon={<HomeDollarIcon />} fig={<PriceBars propane={propane} ours={s.tariffUsdMWh} saving={s.householdSavingsPropane} />} label="Saving for a propane home" tip={<>Heat price fixed at {dec(d.finance.tariff_usd_mwh / propane, 1)} times propane's price, applied to a typical home's {int(d.finance.household.typical_MWh_yr)} MWh a year. Base case: {usd(d.finance.household.savings_vs_propane_usd)} a year. <TipKey k="finance.household.savings_vs_propane_usd" /></>} num={s.householdSavingsPropane} fmt={usd} instant={live} unit="per year" delta={hh.g === null ? `unchanged: heat price fixed at ${int((s.tariffUsdMWh / d.finance.incumbent_usd_mwh.propane) * 100)}% of propane` : hh.t} good={hh.g} />
              <Kpi icon={<CloudIcon />} fig={<CarsRow cars={carsNow} per={perCar} tonnes={Math.max(0, s.co2TYr)} />} label="CO₂ avoided" tip={<>Emissions of the fossil fuel displaced, minus the emissions of the electricity and backup fuel used. Base case: {int(tonnesToTons(d.impact.co2_avoided_t_yr))} tons a year. <TipKey k="impact.co2_avoided_t_yr" /></>} num={tonnesToTons(s.co2TYr)} fmt={int} instant={live} unit="tons/yr" delta={co.t} good={co.g} />
            </div>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
              <div className="card p-4 min-h-[400px] flex flex-col"><h2 className="m-0 mb-1 text-h3">{lcohTitle(d, s.lcohUsdMWh)}</h2><div className="flex-1 min-h-0"><LcohBars d={d} lcohOverride={s.lcohUsdMWh} onPickRate={(pct) => set("discountPct", pct)} activePct={p.discountPct} /></div></div>
              <div className="card p-4">
                <h2 className="m-0 mb-2 text-h3">By ring</h2>
                <table className="w-full text-caption">
                  <thead><tr className="text-left text-ink2"><th className="pb-1 font-semibold">Ring and cost test</th><th className="pb-1 font-semibold num text-right">GWh/yr</th><th className="pb-1 pl-4 font-semibold text-right">Share of heat</th></tr></thead>
                  <tbody>
                    {s.byRing.map((r) => (
                      <tr key={r.id} className="border-t border-line"><td className="py-2 font-semibold"><span className="flex items-center gap-2"><RingGlyph id={r.id} /><span className="grid"><span style={{ color: ringText(r.id) }}>{ringShort(r.id)}</span><PassMark pass={ringPass(r.id)} /></span></span></td><td className="num text-right">{dec(r.demandMWh / 1000, 1)}</td><td className="num text-right">{r.demandMWh > 0 ? `${dec((r.demandMWh / Math.max(1, s.byRing.reduce((a, x) => a + x.demandMWh, 0))) * 100, 0)}%` : "off"}</td></tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-caption text-ink2 mb-0 mt-2">Heat pumps use {p.cooling === "air" ? 86 : 122} °F source heat; COP is clipped to 2 to 6 like the hourly model. Results are scaled from the full hourly model, so the base case matches it exactly.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

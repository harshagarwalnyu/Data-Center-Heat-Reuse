"use client";
import { useMemo, useState } from "react";
import type { AppData } from "@/lib/types";
import { baseParams, scenario, type Cooling, type Params } from "@/lib/model";
import { dec, int, usd } from "@/lib/format";
import { NavBar, ringText, ringShort } from "./ui";
import { LcohBars } from "./viz/Charts";

function Slider({ id, label, value, min, max, step, unit, onChange, fmt }: { id: string; label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void; fmt?: (v: number) => string }) {
  return (
    <div>
      <label htmlFor={id} className="flex justify-between font-bold text-[1.125rem]">
        <span>{label}</span>
        <span className="num text-teal-text">{fmt ? fmt(value) : value}<span className="font-semibold text-ink2 ml-1 text-[1rem]">{unit}</span></span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function Kpi({ label, value, unit, delta, good }: { label: string; value: string; unit: string; delta?: string; good?: boolean | null }) {
  return (
    <div className="card p-4">
      <div className="text-[1.0625rem] text-ink2">{label}</div>
      <div className="serif num font-bold leading-none mt-1" style={{ fontSize: "clamp(2rem,3.2vw,3rem)" }}>{value}<span className="unit">{unit}</span></div>
      {delta && <div className="num text-[1rem] mt-1 font-semibold" style={{ color: good === null || good === undefined ? "var(--ink2)" : good ? "var(--good)" : "var(--ember-text)" }}>{delta}</div>}
    </div>
  );
}

export function Explore({ data }: { data: AppData }) {
  const d = data.site2;
  const base = useMemo(() => baseParams(d), [d]);
  const [p, setP] = useState<Params>(base);
  const s = scenario(d, p);
  const b = scenario(d, base);
  const set = <K extends keyof Params>(k: K, v: Params[K]) => setP((x) => ({ ...x, [k]: v }));
  const dl = (cur: number, ref: number, d0: number, unit: string, lowerBetter: boolean) => {
    const diff = cur - ref;
    if (Math.abs(diff) < 0.5 * 10 ** -d0) return { t: "same as base case", g: null as boolean | null };
    return { t: `${diff > 0 ? "+" : "-"}${dec(Math.abs(diff), d0)} ${unit} vs base`.replace("  ", " "), g: (lowerBetter ? diff < 0 : diff > 0) as boolean | null };
  };
  const cmp = (c: Cooling) => (c === "air" ? "Air-cooled (30 °C)" : "Liquid-cooled (50 °C)");
  const lc = dl(s.lcohUsdMWh, b.lcohUsdMWh, 0, "$/MWh", true);
  const hh = dl(s.householdSavingsPropane, b.householdSavingsPropane, 0, "$", false);
  const co = dl(s.co2TYr, b.co2TYr, 0, "t", false);
  const cp = dl(s.avgCop, b.avgCop, 1, "", false);
  return (
    <div className="min-h-dvh flex flex-col">
      <NavBar active="/explore/" />
      <main className="flex-1 px-[clamp(1.25rem,3vw,3rem)] py-6 max-w-[1600px] w-full mx-auto">
        <p className="kicker m-0 mb-2">Explore mode</p>
        <h1 className="headline m-0 !text-[clamp(2rem,3vw,3rem)] max-w-[30ch]">Change the assumptions and watch the answer move</h1>
        <div className="grid gap-6 mt-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <section className="card p-5 grid gap-5 content-start" aria-label="Assumptions">
            <Slider id="price" label="Electricity price for heat pumps" value={p.elecPrice} min={60} max={300} step={5} unit="$/MWh" onChange={(v) => set("elecPrice", v)} />
            <div>
              <div className="font-bold text-[1.125rem] mb-2" id="cool-l">Data center cooling type</div>
              <div role="radiogroup" aria-labelledby="cool-l" className="flex gap-2 flex-wrap">
                {(["air", "liquid"] as Cooling[]).map((c) => <button key={c} role="radio" aria-checked={p.cooling === c} className="btn" onClick={() => set("cooling", c)}>{cmp(c)}</button>)}
              </div>
            </div>
            <Slider id="uptake" label="Home sign-up along the corridor" value={p.uptakePct} min={10} max={100} step={5} unit="%" onChange={(v) => set("uptakePct", v)} />
            <Slider id="disc" label="Cost of money (discount rate)" value={p.discountPct} min={1} max={12} step={0.5} unit="%" onChange={(v) => set("discountPct", v)} fmt={(v) => dec(v, 1)} />
            <Slider id="load" label="Data center IT load" value={p.loadMW} min={30} max={400} step={10} unit="MW" onChange={(v) => set("loadMW", v)} />
            <label className="flex items-center gap-3 font-semibold text-[1.125rem] min-h-[44px]">
              <input type="checkbox" className="w-6 h-6" style={{ accentColor: "var(--teal)" }} checked={p.includeTown} onChange={(e) => set("includeTown", e.target.checked)} />
              Build the town-center ring (Phase 3)
            </label>
            <button className="btn" onClick={() => setP(base)}>Reset to the base case</button>
          </section>

          <section aria-label="Results" aria-live="polite" className="grid gap-4 content-start">
            {s.supplyLimited && <div className="card p-3 font-semibold" style={{ background: "var(--warn-bg)", borderColor: "var(--amber)" }}>At this data center size the captured heat is the limit: users get less than they ask for.</div>}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <Kpi label="Heat the data center produces" value={int(s.heatAvailableGWh)} unit="GWh/yr" delta={`${dec(s.surplusGWh, 0)} GWh/yr left over`} />
              <Kpi label="Heat delivered to Lansing" value={int(s.heatDeliveredMWh / 1000)} unit="GWh/yr" delta={`${dec(s.sharePct, 1)}% of what is produced`} />
              <Kpi label="Average heat pump COP" value={dec(s.avgCop, 1)} unit="" delta={cp.t} good={cp.g} />
              <Kpi label="Cost to make heat" value={`$${int(s.lcohUsdMWh)}`} unit="per MWh" delta={lc.t} good={lc.g} />
              <Kpi label="Saving for a propane home" value={usd(s.householdSavingsPropane)} unit="per year" delta={hh.t} good={hh.g} />
              <Kpi label="CO₂ avoided" value={int(s.co2TYr)} unit="t/yr" delta={co.t} good={co.g} />
            </div>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
              <div className="card p-4 min-h-[400px] flex flex-col"><h2 className="m-0 mb-1 text-[1.375rem]">Cost of heat vs what Lansing pays today</h2><div className="flex-1 min-h-0"><LcohBars d={d} lcohOverride={s.lcohUsdMWh} /></div></div>
              <div className="card p-4">
                <h2 className="m-0 mb-2 text-[1.375rem]">By ring</h2>
                <table className="w-full text-[1.0625rem]">
                  <thead><tr className="text-left text-ink2"><th className="pb-1 font-semibold">Ring</th><th className="pb-1 font-semibold num text-right">GWh/yr</th><th className="pb-1 font-semibold text-right">COP</th></tr></thead>
                  <tbody>
                    {s.byRing.map((r) => (
                      <tr key={r.id} className="border-t border-line"><td className="py-1.5 font-semibold" style={{ color: ringText(r.id) }}>{ringShort(r.id)}</td><td className="num text-right">{dec(r.demandMWh / 1000, 1)}</td><td className="num text-right">{r.direct ? "direct" : dec(r.cop, 1)}</td></tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[1rem] text-ink2 mb-0 mt-2">Each ring&rsquo;s COP uses {p.cooling === "air" ? 30 : 50} °C source heat. Results are scaled from the full hourly model, so the base case matches it exactly.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

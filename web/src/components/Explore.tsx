"use client";

import { useMemo, useState } from "react";
import { site } from "@/lib/data";
import { compute, DEFAULTS, type Inputs } from "@/lib/explore";
import { gwh, musd, num, pct, perMWh } from "@/lib/fmt";
import { HBars, Tornado } from "./charts";
import { Stat, Status } from "./ui";

const tariff = site.finance.tariff_usd_mwh;
const propane = site.finance.incumbent_usd_mwh.propane;
const DRIVER_LABEL: Record<string, string> = {
  homes_uptake: "Homes connected (±50%)",
  discount_rate: "Discount rate (3-7%)",
  pipe_cost: "Pipe cost (±30%)",
  elec_price: "Electricity price (±30%)",
  hp_efficiency: "Heat pump efficiency",
  dc_load_factor: "Data center load (60-90%)",
};

function Slider(props: {
  label: string; value: number; min: number; max: number; step: number; fmt: (v: number) => string; onChange: (v: number) => void; hint?: string;
}) {
  const id = props.label.replace(/\W+/g, "-");
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="font-semibold">{props.label}</label>
        <output htmlFor={id} className="tnum text-lg">{props.fmt(props.value)}</output>
      </div>
      <input
        id={id} type="range" min={props.min} max={props.max} step={props.step} value={props.value}
        onChange={(e) => props.onChange(parseFloat(e.target.value))}
        className="mt-2 w-full accent-[var(--s1)]"
      />
      {props.hint && <p className="mt-1 text-sm text-ink-2">{props.hint}</p>}
    </div>
  );
}

export default function Explore() {
  const [inp, setInp] = useState<Inputs>(DEFAULTS);
  const set = <K extends keyof Inputs>(k: K) => (v: Inputs[K]) => setInp((x) => ({ ...x, [k]: v }));
  const out = useMemo(() => compute(inp), [inp]);
  const base = useMemo(() => compute(DEFAULTS), []);
  const corridorPasses = out.corridor <= tariff;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:py-10">
      <h1 className="text-3xl font-semibold lg:text-5xl">What moves the answer?</h1>
      <p className="mt-3 max-w-3xl text-lg text-ink-2">
        Move the sliders. Costs recompute from the model&apos;s per-ring numbers, using the formulas in the data contract. The full 8,760-hour model
        reruns in Python; this page is the fast approximation.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
        <section aria-label="Inputs" className="space-y-6 rounded-lg border border-line bg-surface p-5">
          <fieldset>
            <legend className="font-semibold">Data center cooling</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[true, false].map((v) => (
                <label key={String(v)} className={`cursor-pointer rounded-lg border px-3 py-2 text-center ${inp.liquidCooling === v ? "border-[var(--s1)] font-semibold" : "border-line"}`}>
                  <input type="radio" name="cooling" className="sr-only" checked={inp.liquidCooling === v} onChange={() => set("liquidCooling")(v)} />
                  {v ? "Liquid (50 °C)" : "Air (30 °C)"}
                </label>
              ))}
            </div>
          </fieldset>
          <Slider label="Homes on the loop" value={inp.homes} min={100} max={1200} step={50} fmt={(v) => num(v)} onChange={set("homes")}
            hint="Costs scale per home; more homes don't make each one cheaper." />
          <Slider label="Phase 2 capex grants" value={inp.phase2Grant} min={0} max={0.8} step={0.05} fmt={(v) => pct(v)} onChange={set("phase2Grant")}
            hint="Federal ITC is 30% if the network qualifies (unconfirmed); NYSEG Non-Pipe Alternatives on top." />
          <Slider label="Discount rate" value={inp.discountRate} min={0.02} max={0.1} step={0.005} fmt={(v) => pct(v, 1)} onChange={set("discountRate")}
            hint="4% municipal / co-op, 7% utility, 10% private." />
          <Slider label="Commercial electricity" value={inp.elecCommercial} min={0.06} max={0.24} step={0.01} fmt={(v) => `$${v.toFixed(2)}/kWh`} onChange={(v) =>
            setInp((x) => ({ ...x, elecCommercial: v, elecResidential: DEFAULTS.elecResidential * (v / DEFAULTS.elecCommercial) }))}
            hint="Residential rate moves in proportion." />
          <Slider label="Data center IT load" value={inp.dcLoadMW} min={50} max={400} step={10} fmt={(v) => `${num(v)} MW`} onChange={set("dcLoadMW")}
            hint="150 MW is Phase 1; 300-400 MW is the full build-out." />
          <button onClick={() => setInp(DEFAULTS)} className="rounded-lg border border-line px-4 py-2">Reset to base case</button>
        </section>

        <section aria-label="Results" aria-live="polite" className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <Stat compact label="Phase 1 campus" value={perMWh(out.onsite)} sub={`base ${perMWh(base.onsite)}`} />
            <Stat compact label="Phase 2 homes" value={perMWh(out.corridor)} sub={`tariff ${perMWh(tariff)}`} />
            <Stat compact label="Phase 1 + 2 together" value={perMWh(out.phase12)} sub={`capex ${musd(out.capex12 / 1e6)}`} />
            <Stat compact label="Heat available" value={gwh(out.availableMWh)} sub="per year" />
            <Stat compact label="Share used, Phases 1 + 2" value={pct(out.shareUsed, 1)} />
            <Stat compact label="Town center" value={perMWh(out.town)} sub={`vs ${perMWh(site.finance.incumbent_usd_mwh.natural_gas)} gas`} />
          </div>
          <p className="text-lg">
            <Status pass={corridorPasses}>{corridorPasses ? "Phase 2 passes its gate" : "Phase 2 does not pass yet"}</Status>{" "}
            <span className="text-ink-2">
              (homes at {perMWh(out.corridor)} vs a {perMWh(tariff)} tariff, which is {pct(tariff / propane)} of propane).
            </span>
          </p>
          <HBars
            title="Cost of heat by ring, $/MWh"
            unit="$/MWh"
            max={260}
            rows={[
              { label: "Phase 1 campus", value: out.onsite, valueLabel: perMWh(out.onsite), color: "var(--s1)", marker: { value: tariff, label: "tariff" } },
              { label: "Phase 2 homes", value: out.corridor, valueLabel: perMWh(out.corridor), color: "var(--s2)", marker: { value: tariff, label: "tariff" } },
              { label: "Phase 3 town center", value: out.town, valueLabel: perMWh(out.town), color: "var(--s3)", marker: { value: site.finance.incumbent_usd_mwh.natural_gas, label: "gas" } },
            ]}
          />
          <Tornado
            title="From the full model: what moves Phase 1 + 2 cost most"
            base={site.finance.tornado[0].base}
            rows={site.finance.tornado.map((t) => ({ driver: t.driver, low: t.low, high: t.high, label: DRIVER_LABEL[t.driver] ?? t.driver }))}
          />
          <p className="text-ink-2">
            Data center load barely moves any cost: there is already far more heat than Lansing can use. Demand and build cost decide the answer.
          </p>
        </section>
      </div>
    </div>
  );
}

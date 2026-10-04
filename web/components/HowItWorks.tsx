"use client";
import { useState } from "react";
import type { AppData } from "@/lib/types";
import { dec, int } from "@/lib/format";
import { COP_MAX, COP_MIN, ETA, APPROACH_K, LIFETIME_YR, cop, crf } from "@/lib/model";
import Link from "next/link";
import { NavBar } from "./ui";
import { Term } from "./Tooltip";

const HOURS = 8760;

function Box({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="card p-4 grid gap-1 content-start">
      <div className="kicker">{n}</div>
      <h3 className="m-0 text-h3 serif">{title}</h3>
      <div className="text-caption leading-snug text-ink2">{children}</div>
    </div>
  );
}

export function HowItWorks({ data }: { data: AppData }) {
  const d = data.site2, f = d.finance, T = d.totals;
  const [sink, setSink] = useState(55);
  const [src, setSrc] = useState(d.supply.capture_temp_C);
  const c = cop(sink, src);
  const raw = (ETA * (sink + 273.15)) / Math.max(1e-6, sink - src + 2 * APPROACH_K);
  const r4 = crf(0.04), r7 = crf(0.07);
  return (
    <div className="min-h-dvh flex flex-col">
      <NavBar active="/how/" />
      <main className="flex-1 px-[clamp(1.25rem,3vw,3rem)] py-6 max-w-[1500px] w-full mx-auto">
        <p className="kicker m-0 mb-2">How it works</p>
        <h1 className="t-h1 m-0 max-w-[30ch]">Every number here comes from an hour-by-hour model you can rerun</h1>

        <section aria-label="Pipeline" className="grid gap-3 mt-6 md:grid-cols-2 xl:grid-cols-4">
          <Box n="1 · Weather and demand" title="Real weather, every hour">Typical-year weather drives heating demand for each user in each of {int(HOURS)} hours of the year.</Box>
          <Box n="2 · Supply" title="Data center heat">{int(d.supply.it_load_MW)} MW IT load × {dec(d.supply.load_factor * 100, 0)}% load factor × {dec(d.supply.capture_fraction * 100, 0)}% captured at {d.supply.capture_temp_C} °C = <b className="num text-ink">{int(d.supply.heat_available_GWh)} GWh/yr</b> available.</Box>
          <Box n="3 · Dispatch" title="Storage and backup, hour by hour">Each hour: draw from supply, charge or discharge the {int(T.storage_m3)} m³ tank, fire backup boilers if needed. Result: <b className="num text-ink">{int(T.heat_delivered_MWh)} MWh</b> delivered, {int(T.backup_MWh)} MWh from backup, {int(T.unmet_hours)} unmet hours (backup is sized to 100% of peak).</Box>
          <Box n="4 · Finance" title="Cost of heat, then the app">Capital recovery factor × capex + operating cost, divided by delivered heat. Results are written to JSON that this app reads; nothing on screen is typed in by hand.</Box>
        </section>

        <div className="grid gap-6 mt-6 lg:grid-cols-2">
          <section className="card p-6" aria-label="COP calculator">
            <h2 className="m-0 text-h2 serif">Heat pump efficiency (<Term tip="Coefficient of performance: units of heat a heat pump delivers for each unit of electricity it uses. Higher is better.">COP</Term>), live</h2>
            <p className="num m-0 mt-2 text-body">COP = {ETA} × T<sub>sink</sub> / (T<sub>sink</sub> − T<sub>source</sub> + 2 × {APPROACH_K} K), clipped to {COP_MIN} to {COP_MAX}</p>
            <div className="grid gap-3 mt-3 text-body">
              <label className="grid gap-1">Sink (delivery) temperature: <b className="num">{sink} °C</b>
                <input type="range" min={35} max={75} value={sink} onChange={(e) => setSink(+e.target.value)} />
              </label>
              <label className="grid gap-1">Source (data center return): <b className="num">{src} °C</b>
                <input type="range" min={20} max={60} value={src} onChange={(e) => setSrc(+e.target.value)} />
              </label>
              <div className="num text-h2 font-bold" style={{ color: "var(--teal-text)" }}>COP {dec(c, 2)}{Math.abs(raw - c) > 0.005 && <span className="text-ink2 text-caption font-semibold"> (unclipped {dec(raw, 2)})</span>}</div>
              <div className="text-ink2 text-caption">The {COP_MIN} to {COP_MAX} clip matches the organizer range and the Python model, so browser and model agree. Hotter source, smaller lift, higher COP: that is why liquid cooling matters.</div>
            </div>
          </section>

          <section className="card p-6" aria-label="Finance">
            <h2 className="m-0 text-h2 serif">Cost of heat</h2>
            <p className="num m-0 mt-2 text-body"><Term tip="Levelized cost of heat: the cost of producing one MWh of delivered heat, with capital cost spread over the equipment's life.">LCOH</Term> = (capex × CRF + opex) / delivered MWh</p>
            <ul className="m-0 mt-2 pl-6 grid gap-1 text-body">
              <li><Term tip="Capital recovery factor: the share of the up-front cost charged each year over the equipment life, at a given cost of money.">CRF</Term> = r(1+r)<sup>n</sup> / ((1+r)<sup>n</sup> − 1), n = {LIFETIME_YR} yr: <span className="num">{dec(r4, 4)}</span> at 4%, <span className="num">{dec(r7, 4)}</span> at 7%.</li>
              <li>Capex ${dec(f.capex_musd.total, 1)}M, opex ${dec(f.opex_musd_yr, 2)}M per year, {int(T.heat_delivered_MWh)} MWh delivered.</li>
              <li>Result: <b className="num">${dec(f.lcoh_usd_mwh.coop_4pct, 0)}</b> at 4% (community finance), <b className="num">${dec(f.lcoh_usd_mwh.utility_7pct, 0)}</b> at 7%, <b className="num">${dec(f.lcoh_usd_mwh.private_10pct, 0)}</b> at 10% per MWh.</li>
              <li>Tariff is set by policy at 0.8× propane (${dec(f.tariff_usd_mwh, 0)} per MWh), not by cost, so households save at any discount rate; the gap is a funding question.</li>
            </ul>
            <p className="m-0 mt-3 text-ink2 text-caption">The Explore page recomputes this in your browser with the same formulas and scales the file&rsquo;s results, so base sliders match the model exactly.</p>
          </section>
        </div>

        <div className="grid gap-6 mt-6 lg:grid-cols-2">
          <section className="card p-6" aria-label="Tests">
            <h2 className="m-0 text-h2 serif">Tests (verified 2026-10-04)</h2>
            <ul className="m-0 mt-2 pl-6 grid gap-1 text-body">
              <li>Python tests covering energy balance, storage bounds, COP, CRF, finance, backup sizing. Run <code>uv run pytest</code>.</li>
              <li>Web tests covering COP and clip, CRF, LCOH, household savings, scenario scaling reproduces the data file. Run <code>bun run test</code> in <code>web/</code>.</li>
              <li>Python output JSON is the same JSON this app loads.</li>
            </ul>
            <h3 className="m-0 mt-4 text-h3 serif">Honest limits</h3>
            <ul className="m-0 mt-1 pl-6 grid gap-1 text-caption text-ink2">
              <li>One 30-year life for all equipment; heat pumps and boilers usually last 15 to 20 years.</li>
              <li>Capture fraction is an assumption (range 0.40 to 0.85); cost of heat is insensitive to it because supply far exceeds demand.</li>
              <li>Map geometry is approximate; the town ring is conditional.</li>
            </ul>
          </section>
          <section className="card p-6" aria-label="Sources">
            <h2 className="m-0 text-h2 serif">Sources</h2>
            <p className="m-0 mt-2 text-body">Every input with its value, unit, source and confidence: <Link prefetch={false} href="/sources/" className="underline font-semibold">Data &amp; sources</Link>.</p>
            <ul className="m-0 mt-2 pl-6 grid gap-2 text-caption leading-snug">
              {d.sources.map((s) => (
                <li key={s.id}>{s.label.length > 150 ? s.label.slice(0, 147) + "…" : s.label}{s.url && <> <a href={s.url} target="_blank" rel="noreferrer" className="underline">link</a></>}</li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

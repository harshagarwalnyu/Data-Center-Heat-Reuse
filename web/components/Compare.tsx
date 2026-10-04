"use client";
import { useState } from "react";
import type { AppData } from "@/lib/types";
import { dec, int } from "@/lib/format";
import { NavBar } from "./ui";

export function Compare({ data }: { data: AppData }) {
  const [site, setSite] = useState<1 | 2>(2);
  const a = data.site2, b = data.site1;
  const rows: { k: string; unit: string; v2: string; v1: string; better: "2" | "1" | "-" }[] = [
    { k: "Data center IT load", unit: "MW", v2: int(a.supply.it_load_MW), v1: int(b.supply.it_load_MW), better: "-" },
    { k: "Heat capture temperature", unit: "°C", v2: int(a.supply.capture_temp_C), v1: int(b.supply.capture_temp_C), better: a.supply.capture_temp_C >= b.supply.capture_temp_C ? "2" : "1" },
    { k: "Heat available", unit: "GWh/yr", v2: int(a.supply.heat_available_GWh), v1: int(b.supply.heat_available_GWh), better: a.supply.heat_available_GWh >= b.supply.heat_available_GWh ? "2" : "1" },
    { k: "Average heat pump COP", unit: "", v2: dec(a.totals.avg_cop, 1), v1: dec(b.totals.avg_cop, 1), better: a.totals.avg_cop >= b.totals.avg_cop ? "2" : "1" },
    { k: "Cost of heat (community finance)", unit: "$/MWh", v2: int(a.finance.lcoh_usd_mwh.coop_4pct), v1: int(b.finance.lcoh_usd_mwh.coop_4pct), better: a.finance.lcoh_usd_mwh.coop_4pct <= b.finance.lcoh_usd_mwh.coop_4pct ? "2" : "1" },
    { k: "CO₂ avoided", unit: "t/yr", v2: int(a.impact.co2_avoided_t_yr), v1: int(b.impact.co2_avoided_t_yr), better: a.impact.co2_avoided_t_yr >= b.impact.co2_avoided_t_yr ? "2" : "1" },
  ];
  const sel = site === 2 ? a : b;
  return (
    <div className="min-h-dvh flex flex-col">
      <NavBar active="/compare/" />
      <main className="flex-1 px-[clamp(1.25rem,3vw,3rem)] py-6 max-w-[1500px] w-full mx-auto">
        <p className="kicker m-0 mb-2">Why this site</p>
        <h1 className="headline m-0 !text-[clamp(2rem,3.2vw,3.25rem)] max-w-[28ch]">Lansing wins: hotter heat, a cleaner grid, and a community that needs an answer</h1>
        <div role="radiogroup" aria-label="Choose a site" className="flex gap-2 mt-5 flex-wrap">
          <button role="radio" aria-checked={site === 2} className="btn" onClick={() => setSite(2)}>Site 2 · Lansing, NY (our proposal)</button>
          <button role="radio" aria-checked={site === 1} className="btn" onClick={() => setSite(1)}>Site 1 · 111 8th Ave, New York</button>
        </div>
        <div className="grid gap-6 mt-5 lg:grid-cols-2">
          <section className="card p-5" aria-live="polite">
            <h2 className="m-0 text-[1.5rem]">{sel.meta.site}</h2>
            {site === 2 ? (
              <ul className="mt-3 pl-5 text-[1.125rem] leading-snug grid gap-2">
                <li>New-build campus: we can specify direct liquid cooling, which returns heat at {a.supply.capture_temp_C} °C.</li>
                <li>Cleaner upstate grid, so heat pumps save more carbon.</li>
                <li>A live town fight and a gas moratorium make heat reuse a real answer, not an add-on.</li>
                <li>Unused acreage lets us bring users to the heat.</li>
              </ul>
            ) : (
              <ul className="mt-3 pl-5 text-[1.125rem] leading-snug grid gap-2">
                {(b.why_not_chosen ?? []).map((w) => (<li key={w.point}><b>{w.point}.</b> {w.detail}</li>))}
              </ul>
            )}
          </section>
          <section className="card p-5 overflow-x-auto">
            <table className="w-full text-[1.125rem]">
              <thead><tr className="text-left text-ink2"><th className="pb-2">Measure</th><th className="pb-2 text-right">Site 2 Lansing</th><th className="pb-2 text-right">Site 1 NYC</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.k} className="border-t border-line">
                    <td className="py-2 pr-3">{r.k} <span className="text-ink2 text-[1rem]">{r.unit}</span></td>
                    <td className="num text-right font-bold" style={r.better === "2" ? { color: "var(--teal-text)" } : undefined}>{r.v2}{r.better === "2" && <span aria-label="better"> ✓</span>}</td>
                    <td className="num text-right font-bold" style={r.better === "1" ? { color: "var(--teal-text)" } : undefined}>{r.v1}{r.better === "1" && <span aria-label="better"> ✓</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[1rem] text-ink2 mb-0 mt-3">A check mark shows the better value on that row.</p>
          </section>
        </div>
      </main>
    </div>
  );
}

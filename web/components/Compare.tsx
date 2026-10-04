"use client";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { AppData } from "@/lib/types";
import { cToF, dec, int, tonnesToTons } from "@/lib/format";
import { NavBar } from "./ui";
import { Term } from "./Tooltip";
import { Swash } from "./look/Paper";
import { CloudIcon, FlameIcon, HouseIcon, ShareRing, TagIcon, ThermoIcon } from "./ExploreFigures";
import { CityVignette, IconDisc, LansingVignette, PairBars, Scoreboard, WinCheck } from "./CompareFigures";

type Row = { k: ReactNode; unit: string; v2: string; v1: string; n2: number; n1: number; better: "2" | "1" | "-"; low?: boolean };

export function Compare({ data }: { data: AppData }) {
  const [site, setSite] = useState<1 | 2>(2);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const a = data.site2, b = data.site1;
  const copA = a.cop_compare[a.cop_compare.length - 1]?.cop ?? a.totals.avg_cop;
  const copB = b.cop_compare?.[0]?.cop ?? b.totals.avg_cop;
  const rows: Row[] = [
    { k: "Data center IT load", unit: "MW", v2: int(a.supply.it_load_MW), v1: int(b.supply.it_load_MW), n2: a.supply.it_load_MW, n1: b.supply.it_load_MW, better: "-" },
    { k: "Heat capture temperature", unit: "°F", v2: int(cToF(a.supply.capture_temp_C)), v1: int(cToF(b.supply.capture_temp_C)), n2: cToF(a.supply.capture_temp_C), n1: cToF(b.supply.capture_temp_C), better: a.supply.capture_temp_C >= b.supply.capture_temp_C ? "2" : "1" },
    { k: "Heat available", unit: "GWh/yr", v2: int(a.supply.heat_available_GWh), v1: int(b.supply.heat_available_GWh), n2: a.supply.heat_available_GWh, n1: b.supply.heat_available_GWh, better: a.supply.heat_available_GWh >= b.supply.heat_available_GWh ? "2" : "1" },
    { k: <>Heat pump <Term tip="Coefficient of performance: units of heat a heat pump delivers for each unit of electricity it uses. Higher is better.">COP</Term> at capture temperature (capped at 6)</>, unit: "", v2: dec(copA, 1), v1: dec(copB, 1), n2: copA, n1: copB, better: copA >= copB ? "2" : "1" },
    { k: "Cost of heat (community finance)", unit: "$/MWh", v2: int(a.finance.lcoh_usd_mwh.coop_4pct), v1: int(b.finance.lcoh_usd_mwh.coop_4pct), n2: a.finance.lcoh_usd_mwh.coop_4pct, n1: b.finance.lcoh_usd_mwh.coop_4pct, low: true, better: a.finance.lcoh_usd_mwh.coop_4pct <= b.finance.lcoh_usd_mwh.coop_4pct ? "2" : "1" },
    { k: "CO₂ avoided", unit: "tons/yr", v2: int(tonnesToTons(a.impact.co2_avoided_t_yr)), v1: int(tonnesToTons(b.impact.co2_avoided_t_yr)), n2: tonnesToTons(a.impact.co2_avoided_t_yr), n1: tonnesToTons(b.impact.co2_avoided_t_yr), better: a.impact.co2_avoided_t_yr >= b.impact.co2_avoided_t_yr ? "2" : "1" },
  ];
  const sel = site === 2 ? a : b;
  const s1pts = typeof b.why_not_chosen === "string" ? b.why_not_chosen.split(/\(\d\)\s*/).filter(Boolean).map((t) => t.trim()).filter((t) => !/LCOH|CO2 benefit/i.test(t)) : [];
  const gen: string[] = [
    `Cost of heat is $${int(b.finance.lcoh_usd_mwh.coop_4pct)} per MWh at Site 1 versus $${int(a.finance.lcoh_usd_mwh.coop_4pct)} at Lansing under community finance.`,
    b.impact.co2_avoided_t_yr > a.impact.co2_avoided_t_yr ? `Site 1 avoids slightly more CO₂ in total (${int(tonnesToTons(b.impact.co2_avoided_t_yr))} versus ${int(tonnesToTons(a.impact.co2_avoided_t_yr))} tons per year); the Lansing edge is delivered heat, cost and a decision that is live now.` : `Lansing avoids more CO₂ (${int(tonnesToTons(a.impact.co2_avoided_t_yr))} versus ${int(tonnesToTons(b.impact.co2_avoided_t_yr))} tons per year).`,
  ];

  const scored = rows.filter((r) => r.better !== "-");
  const wins2 = scored.filter((r) => r.better === "2").length;
  const tF = (d: { supply: { capture_temp_C: number } }) => int(cToF(d.supply.capture_temp_C));
  const pills = rows.filter((r) => r.better === "2").slice(0, 3);
  const pillText = (r: Row) => r.unit === "°F" ? `${r.v2} °F heat` : r.unit === "$/MWh" ? `$${r.v2} per MWh heat` : r.unit === "GWh/yr" ? `${r.v2} GWh of heat a year` : r.unit === "tons/yr" ? `${r.v2} tons CO₂ a year` : `Heat pump COP ${r.v2}`;
  const sites = [
    { id: 2 as const, d: a, name: "Site 2 · Lansing, NY", tag: "our proposal", fig: <LansingVignette /> },
    { id: 1 as const, d: b, name: "Site 1 · New York City", tag: "111 8th Ave", fig: <CityVignette /> },
  ];
  const onKey = (e: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const next = site === 2 ? 1 : 2;
    setSite(next);
    refs.current[sites.findIndex((s) => s.id === next)]?.focus();
  };
  const stat = (icon: ReactNode, v: string, l: string) => (
    <div className="flex items-center gap-3">
      <span className="shrink-0">{icon}</span>
      <div className="min-w-0"><div className="num font-bold text-h3 leading-none">{v}</div><div className="text-caption text-ink2 mt-1">{l}</div></div>
    </div>
  );
  const why = [
    { icon: <ThermoIcon />, bg: "var(--peach)", big: `${tF(a)} °F`, t: "Hotter heat", s: `Lansing returns heat at ${tF(a)} °F, against ${tF(b)} °F in New York City.` },
    { icon: <CloudIcon />, bg: "var(--sky)", big: `COP ${dec(copA, 1)}`, t: "A cleaner grid", s: `Upstate power is cleaner, and each unit of electricity moves more heat (COP ${dec(copA, 1)} versus ${dec(copB, 1)}).` },
    { icon: <HouseIcon />, bg: "var(--sage)", big: `${int(a.impact.homes_served)} homes`, t: "A community that needs an answer", s: `A live town fight, with about ${int(a.impact.homes_served)} homes and a farm that can use the heat.` },
  ];

  return (
    <div className="min-h-dvh flex flex-col">
      <NavBar active="/compare/" />
      <main className="relative z-40 flex-1 px-4 sm:px-[clamp(1.25rem,3vw,3rem)] pt-8 pb-16 max-w-[1500px] w-full mx-auto">
        <div className="relative isolate grid gap-6 md:grid-cols-[1.1fr_1fr] md:items-center">
          <Swash color="var(--butter)" className="-z-10 left-[-8%] top-[-18%] w-[78%] opacity-80" />
          <div>
            <p className="kicker m-0 mb-2">Why this site</p>
            <h1 className="t-h1 m-0 max-w-[28ch]">Lansing wins: hotter heat, a cleaner grid, and a community that needs an answer</h1>
            <ul className="list-none m-0 mt-5 p-0 flex flex-wrap gap-2" aria-label="Lansing headline numbers">
              {pills.map((r, i) => <li key={i} className="num font-bold text-body rounded-full border-[1.5px] border-brown px-3 py-1" style={{ background: "var(--surface)", color: "var(--teal-text)" }}>{pillText(r)}</li>)}
            </ul>
          </div>
          <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 max-w-[460px] mx-auto w-full">
            <div className="flex-1 min-w-0"><LansingVignette /><p className="m-0 mt-1 text-caption font-semibold text-center">Lansing</p></div>
            <span aria-hidden className="grid place-items-center w-11 h-11 rounded-full border-[1.5px] border-brown font-serif italic font-bold text-body shrink-0 -mt-5" style={{ background: "var(--butter)", color: "var(--ember-text)" }}>vs</span>
            <div className="flex-1 min-w-0"><CityVignette /><p className="m-0 mt-1 text-caption font-semibold text-center">New York City</p></div>
          </div>
        </div>
        <div role="radiogroup" aria-label="Choose a site" onKeyDown={onKey} className="grid gap-3 mt-8 sm:grid-cols-2">
          {sites.map((s, i) => (
            <button key={s.id} ref={(el) => { refs.current[i] = el; }} role="radio" aria-checked={site === s.id} tabIndex={site === s.id ? 0 : -1} onClick={() => setSite(s.id)}
              className="card p-3 flex items-center gap-3 text-left cursor-pointer" style={site === s.id ? { borderColor: "var(--teal)", boxShadow: "0 0 0 2px var(--teal)" } : undefined}>
              <span className="w-[96px] sm:w-[120px] shrink-0">{s.fig}</span>
              <span className="min-w-0">
                <span className="block font-bold text-body">{s.name}</span>
                <span className="block text-caption text-ink2">{s.tag}: {int(s.d.supply.it_load_MW)} MW campus, {tF(s.d)} °F heat</span>
              </span>
            </button>
          ))}
        </div>
        <div className="grid gap-6 mt-6 lg:grid-cols-2">
          <section className="card p-6" aria-live="polite">
            <h2 className="m-0 text-h2">{sel.meta.site}</h2>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              {stat(<ThermoIcon />, `${tF(sel)} °F`, "heat capture temperature")}
              {stat(<FlameIcon />, `${int(sel.supply.heat_available_GWh)} GWh`, "heat available a year")}
              {stat(<TagIcon />, `$${int(sel.finance.lcoh_usd_mwh.coop_4pct)}`, "per MWh, community finance")}
              {stat(<CloudIcon />, int(tonnesToTons(sel.impact.co2_avoided_t_yr)), "tons CO₂ avoided a year")}
              {stat(<HouseIcon />, int(sel.impact.homes_served), "homes served")}
              <div className="flex items-center gap-3">
                <ShareRing pct={sel.totals.share_of_available_pct} />
                <div className="text-caption text-ink2">of available heat is delivered</div>
              </div>
            </div>
            {site === 2 ? (
              <ul className="mt-5 pl-6 text-body leading-snug grid gap-2">
                <li>New-build campus: we can specify direct liquid cooling, which returns heat at {int(cToF(a.supply.capture_temp_C))} °F.</li>
                <li>Cleaner upstate grid, so heat pumps save more carbon.</li>
                <li>A live town fight and a town under a NYSEG gas-connection moratorium (since February 2015; current status unverified) make heat reuse a real answer, not an add-on.</li>
                <li>Unused acreage lets us bring users to the heat.</li>
              </ul>
            ) : (
              <ul className="mt-5 pl-6 text-body leading-snug grid gap-2">
                {typeof b.why_not_chosen === "string" ? [...s1pts, ...gen].map((t, i) => <li key={i}>{t}</li>) : (b.why_not_chosen ?? []).map((w) => (<li key={w.point}><b>{w.point}.</b> {w.detail}</li>))}
              </ul>
            )}
          </section>
          <section className="card p-6 overflow-x-auto">
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <Scoreboard wins={wins2} total={scored.length} site1={scored.length - wins2} />
              <p className="m-0 font-serif text-h3 font-medium">Lansing wins {wins2} of {scored.length}</p>
            </div>
            <table className="w-full text-body">
              <thead><tr className="text-left text-ink2"><th className="pb-2">Measure</th><th className="pb-2 text-right">Site 2 Lansing</th><th className="pb-2 text-right">Site 1 NYC</th></tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-line align-top">
                    <td className="py-2 pr-3">{r.k} <span className="text-ink2 text-caption">{r.unit}</span>
                      <PairBars v2={r.n2} v1={r.n1} win={r.better} label={`${r.better === "-" ? "Neither site wins" : r.better === "2" ? "Lansing wins" : "Site 1 wins"} this row: Lansing ${r.v2}, Site 1 ${r.v1}${r.low ? ", lower is better" : ""}.`} />
                    </td>
                    <td className="num text-right font-bold py-2" style={r.better === "2" ? { color: "var(--teal-text)" } : undefined}>{r.v2}{r.better === "2" && <> <WinCheck /><span className="sr-only"> better</span></>}</td>
                    <td className="num text-right font-bold py-2" style={r.better === "1" ? { color: "var(--teal-text)" } : undefined}>{r.v1}{r.better === "1" && <> <WinCheck /><span className="sr-only"> better</span></>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-caption text-ink2 mb-0 mt-3">A check mark and a teal bar show the better value on that row; the top bar is Lansing and the bottom bar is Site 1, on the same scale. Site 1 totals include its central town-ring heat pump; Lansing totals cover Phases 1-2 only, so the COP row compares like-for-like capture temperatures.</p>
          </section>
        </div>
        <h2 className="t-h2 m-0 mt-12">Why Lansing</h2>
        <ul className="list-none m-0 mt-5 p-0 grid gap-4 md:grid-cols-3">
          {why.map((w) => (
            <li key={w.t} className="card p-5 flex items-start gap-4">
              <IconDisc bg={w.bg}>{w.icon}</IconDisc>
              <div className="min-w-0">
                <div className="num font-bold text-h3 leading-none" style={{ color: "var(--teal-text)" }}>{w.big}</div>
                <div className="font-bold text-body mt-1">{w.t}</div>
                <p className="m-0 mt-1 text-caption text-ink2">{w.s}</p>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

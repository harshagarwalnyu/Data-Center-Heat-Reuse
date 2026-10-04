"use client";
import type { AppData } from "@/lib/types";
import { cToF, dec, haToAcres, int, tonnesToTons, usd } from "@/lib/format";
import { NavBar, ringColor, ringShort } from "./ui";
import { LCOH_ANCHOR_PCT } from "@/lib/model";
import { RingMapSvg } from "./viz/RingMap";
import { QrCode } from "./viz/Misc";
import { BASE_PATH, CREDITS, PUBLIC_URL, PROJECT_TAGLINE, PROJECT_TITLE } from "@/lib/config";

export function PrintSheet({ data }: { data: AppData }) {
  const d = data.site2, f = d.finance;
  const homes = d.rings.find((r) => r.id === "corridor")?.homes ?? d.impact.homes_served;
  const demand = d.totals.heat_delivered_MWh;
  const ha = d.extras?.greenhouse_check?.area_ha;
  const cbaPct = d.extras?.cba?.headline_as_pct_of_dc_capex ?? d.extras?.cba?.as_pct_of_dc_capex;
  const bars = [
    { n: `Our cost of heat (${LCOH_ANCHOR_PCT[1]}% financing)`, v: f.lcoh_usd_mwh.utility_7pct, c: "var(--teal)" },
    { n: `Our price to homes (${dec(f.tariff_usd_mwh / f.incumbent_usd_mwh.propane, 1)} × propane)`, v: f.tariff_usd_mwh, c: "var(--teal)" },
    { n: "Propane", v: f.incumbent_usd_mwh.propane, c: "var(--ember)" },
    { n: "Heating oil", v: f.incumbent_usd_mwh.heating_oil, c: "var(--ember)" },
  ];
  const mx = Math.max(...bars.map((b) => b.v));
  const nums: [string, string, string][] = [
    [int(d.supply.heat_available_GWh), "GWh/yr heat produced", "var(--ember-text)"],
    [`${dec((d.supply.heat_available_GWh * 1000) / demand, 1)}×`, "more than Lansing can use", "var(--ember-text)"],
    [usd(f.household.savings_vs_propane_usd), "saved per propane home per year", "var(--teal-text)"],
    [int(tonnesToTons(d.impact.co2_avoided_t_yr)), "tons CO₂ avoided per year", "var(--teal-text)"],
  ];
  return (
    <div className="bg-surface2 min-h-dvh print:bg-white print:min-h-0">
      <NavBar active="/print/" extra={<><a className="btn no-underline" href={`${BASE_PATH}/one-pager.pdf`} download>Download PDF</a><button className="btn" onClick={() => window.print()}>Print</button></>} />
      <div className="py-6 print:py-0 flex justify-center overflow-x-auto no-print-pad">
        <article className="letter sheet-light shadow-xl p-[0.4in] flex flex-col gap-2 overflow-hidden shrink-0" style={{ fontSize: "11pt", lineHeight: 1.35 }}>
          <header>
            <div className="flex items-center justify-between">
              <div className="serif font-bold tracking-widest uppercase text-ember-text" style={{ fontSize: "10pt" }}>{PROJECT_TITLE} · {PROJECT_TAGLINE}, Lansing NY</div>
              {data.placeholder && <span className="chip" style={{ fontSize: "9pt" }}>Illustrative data</span>}
            </div>
            <h1 className="serif font-bold m-0 mt-1" style={{ fontSize: "23pt", lineHeight: 1.08 }}>A data center&rsquo;s heat could warm a {ha ? `${int(haToAcres(ha))}-acre ` : ""}year-round farm and {int(homes)} homes</h1>
            <p className="m-0 mt-1 text-ink2" style={{ fontSize: "12pt" }}>Heat from the data center feeds a community-owned utility. Cooling never depends on it. Lansing could say yes, with conditions.</p>
          </header>
          <section className="grid grid-cols-4 gap-2" aria-label="Headline numbers">
            {nums.map(([v, l, c]) => (
              <div key={l} className="border border-line rounded-lg p-2">
                <div className="serif num font-bold leading-none" style={{ fontSize: "22pt", color: c }}>{v}</div>
                <div style={{ fontSize: "10pt" }} className="text-ink2 mt-1">{l}</div>
              </div>
            ))}
          </section>
          <section className="grid grid-cols-[1.25fr_1fr] gap-3 min-h-0 flex-1">
            <div className="flex flex-col min-h-0">
              <h2 className="serif m-0 mb-1" style={{ fontSize: "13pt" }}>Three rings, built in phases</h2>
              <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-line"><RingMapSvg offtakers={data.offtakers} townPipeKm={d.rings.find((r) => r.id === "town")?.pipe_km} /></div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="serif m-0" style={{ fontSize: "13pt" }}>The rings</h2>
              {d.rings.map((r) => (
                <div key={r.id} className="border-l-4 pl-2" style={{ borderColor: ringColor(r.id) }}>
                  <div className="font-bold" style={{ fontSize: "11pt" }}>Phase {r.phase}: {ringShort(r.id)}{r.conditional ? " (fails the cost test today)" : ""}</div>
                  <div className="num text-ink2" style={{ fontSize: "10pt" }}>{int(r.annual_MWh / 1000)} GWh/yr · {int(cToF(r.supply_temp_C))} °F{r.homes ? ` · ${int(r.homes)} homes` : ""}</div>
                </div>
              ))}
              <h2 className="serif m-0 mt-1" style={{ fontSize: "13pt" }}>Cost of heat, $ per MWh</h2>
              {bars.map((b) => (
                <div key={b.n}>
                  <div className="flex justify-between" style={{ fontSize: "10pt" }}><span>{b.n}</span><b className="num">${int(b.v)}</b></div>
                  <div className="h-3 rounded" style={{ width: `${(b.v / mx) * 100}%`, background: b.c }} />
                </div>
              ))}
              {(() => { const on = d.rings.find((r) => r.id === "onsite")?.lcoh_usd_mwh_7pct, co = d.rings.find((r) => r.id === "corridor")?.lcoh_usd_mwh_7pct; return on !== undefined && co !== undefined ? <p className="m-0 text-ink2" style={{ fontSize: "10pt" }}>The cost is an average: the farm campus costs ${int(on)}, the homes ${int(co)}. The benefit agreement covers the gap.</p> : null; })()}
              <p className="m-0 text-ink2" style={{ fontSize: "10pt" }}>Safeguard: dry coolers keep 100% heat-rejection backup; {int(d.totals.unmet_hours)} unmet hours modelled.</p>
            </div>
          </section>
          <footer className="flex items-center gap-4 border-t border-line pt-2">
            <QrCode url={PUBLIC_URL} size={84} hideCaption />
            <div>
              <div className="font-bold" style={{ fontSize: "12pt" }}>The ask</div>
              <div style={{ fontSize: "10.5pt" }} className="text-ink2">Make a binding Community Benefit and Heat Supply Agreement (about {dec(cbaPct ?? 0, 1)}% of the data-center build) a condition of any approval, plus a proposed $150k a year for computer science in Lansing&apos;s public schools. About {int(d.impact.jobs)} jobs and {int(tonnesToTons(d.impact.local_food_t_yr))} tons of local food a year (estimates). Code and model: {PUBLIC_URL}</div>
            </div>
          </footer>
          <div className="text-ink2" style={{ fontSize: "8.5pt" }}>{CREDITS}</div>
        </article>
      </div>
    </div>
  );
}

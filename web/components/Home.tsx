"use client";
import Link from "next/link";
import type { AppData } from "@/lib/types";
import { dec, int, usd } from "@/lib/format";
import { CREDITS, PUBLIC_URL } from "@/lib/config";
import { NavBar, RingDot, ringText } from "./ui";
import { RingMap } from "./viz/RingMap";

const DECK_PDF = `${PUBLIC_URL}/blob/main/docs/deck/Thermal-Commons-Heat-for-Lansing.pdf`;

/** Landing page: one answer, the three rings, the map, and the two things to do next. Every number is read from site2.json. */
export function Home({ data }: { data: AppData }) {
  const d = data.site2;
  const f = d.finance;
  const ex = d.extras;
  const lcoh7 = f.lcoh_usd_mwh.utility_7pct;
  const propane = f.incumbent_usd_mwh.propane;
  const saving = f.household.savings_vs_propane_usd;
  const cbaPct = ex?.cba?.headline_as_pct_of_dc_capex ?? ex?.cba?.as_pct_of_dc_capex;
  const ring = (id: string) => d.rings.find((r) => r.id === id);
  const ringL = (id: "onsite" | "corridor" | "town") => ring(id)?.lcoh_usd_mwh_7pct ?? ex?.ring_lcoh_usd_mwh?.[id];
  const on = ring("onsite"), co = ring("corridor"), tw = ring("town");
  const townLcoh = ex?.with_town?.town_ring_lcoh_usd_mwh ?? ringL("town");
  const rings = [
    on && { id: "onsite", title: "Ring 1 · On-site farm campus", verdict: "Build first", tone: "var(--good)", lines: [`${dec(on.annual_MWh / 1000, 1)} GWh of heat a year`, ringL("onsite") !== undefined ? `$${int(ringL("onsite") as number)} per MWh at 7%` : null] },
    co && { id: "corridor", title: "Ring 2 · Corridor homes", verdict: "Build where homes sign up, with benefit-agreement funds", tone: "var(--teal-text)", lines: [`${int(co.homes ?? d.impact.homes_served)} homes · ${dec(co.annual_MWh / 1000, 1)} GWh a year`, ringL("corridor") !== undefined ? `$${int(ringL("corridor") as number)} per MWh at 7% on its own` : null] },
    tw && { id: "town", title: "Ring 3 · Town center", verdict: townLcoh !== undefined && townLcoh > propane ? "Fails the cost test: not built" : "Only if it passes the cost test", tone: "var(--ember-text)", lines: [townLcoh !== undefined ? `$${int(townLcoh)} per MWh vs $${int(propane)} for propane` : null, `${dec(tw.pipe_km, 0)} km of pipe`] },
  ].filter(Boolean) as { id: string; title: string; verdict: string; tone: string; lines: (string | null)[] }[];

  return (
    <div className="min-h-dvh flex flex-col">
      <NavBar active="/" />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-[clamp(1rem,3vw,3rem)] py-[clamp(1.5rem,4vh,3rem)] grid gap-[clamp(2rem,5vh,3.5rem)]">
        <section aria-labelledby="home-h" className="grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
          <div>
            <p className="kicker m-0 mb-3">Data-center heat for Lansing, NY</p>
            <h1 id="home-h" className="t-h1 m-0">
              The town can say yes on its own terms: heat at <span className="num text-teal-text">${int(lcoh7)}</span> per MWh, against <span className="num text-ember-text">${int(propane)}</span> for propane
            </h1>
          </div>
          <ul className="list-none m-0 p-0 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <li className="card p-4"><div className="t-stat num text-teal-text">{usd(saving)}<span className="unit">a year</span></div><div className="t-caption">saved by a typical propane home; community heat is priced at <span className="num">${int(f.tariff_usd_mwh)}</span> per MWh</div></li>
            {cbaPct !== undefined && <li className="card p-4"><div className="t-stat num text-ink">{dec(cbaPct, 1)}%<span className="unit">of the data center&apos;s cost</span></div><div className="t-caption">a Community Benefit Agreement of this size would fund the home program</div></li>}
          </ul>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link prefetch={false} href="/explore/" className="btn btn-primary no-underline">Try the model &rarr;</Link>
          <Link prefetch={false} href="/compare/" className="btn no-underline">Compare the sites</Link>
        </div>

        <section aria-labelledby="rings-h" className="grid gap-4">
          <h2 id="rings-h" className="t-h2 m-0 section-rule">Three rings, built only where the numbers pass</h2>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-stretch">
            <ol className="list-none m-0 p-0 grid gap-3 content-start">
              {rings.map((r) => (
                <li key={r.id} className="card p-4">
                  <h3 className="t-h3 m-0" style={{ color: ringText(r.id) }}><RingDot ring={r.id} />{r.title}</h3>
                  <p className="m-0 mt-1 font-bold" style={{ color: r.tone }}>{r.verdict}</p>
                  <p className="m-0 t-caption num">{r.lines.filter(Boolean).join(" · ")}</p>
                </li>
              ))}
            </ol>
            <div className="card overflow-hidden h-[clamp(280px,46vh,480px)] p-0">
              <RingMap offtakers={data.offtakers} townPipeKm={tw?.pipe_km} />
            </div>
          </div>
        </section>

        <section aria-labelledby="know-h" className="grid gap-4">
          <h2 id="know-h" className="t-h2 m-0 section-rule">How we know</h2>
          <ul className="list-none m-0 p-0 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <li><Link prefetch={false} href="/how/" className="card link-card p-4 h-full no-underline text-ink"><span className="t-h3">How it works</span><span className="t-caption">An hourly model of a full weather year, and the formulas behind it</span></Link></li>
            <li><Link prefetch={false} href="/sources/" className="card link-card p-4 h-full no-underline text-ink"><span className="t-h3">Sources</span><span className="t-caption">Every input with its value, unit, source and confidence</span></Link></li>
            <li><a href={PUBLIC_URL} target="_blank" rel="noreferrer" className="card link-card p-4 h-full no-underline text-ink"><span className="t-h3">Code on GitHub &#8599;</span><span className="t-caption">The model, the tests and this site</span></a></li>
            <li><a href={DECK_PDF} target="_blank" rel="noreferrer" className="card link-card p-4 h-full no-underline text-ink"><span className="t-h3">Slide deck (PDF) &#8599;</span><span className="t-caption">The slides we present to the judges</span></a></li>
          </ul>
        </section>

        <footer className="t-caption border-t border-line pt-4">{CREDITS}</footer>
      </main>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { AppData } from "@/lib/types";
import { dec, int, usd } from "@/lib/format";
import { CREDITS, PUBLIC_URL } from "@/lib/config";
import { NavBar, ringText } from "./ui";
import { StoryMap, STORY_ASPECT } from "./viz/StoryMap";
import { Fish, House, NoFlame, Odometer, Pop, Rise, ScrollReveal, Tomato } from "./HomeParts";

const DECK_PDF = `${PUBLIC_URL}/blob/main/docs/deck/Thermal-Commons-Heat-for-Lansing.pdf`;
const SECTION = "py-[clamp(4rem,14dvh,9rem)]";
const BIG = { fontSize: "clamp(2.1rem, 1rem + 4.4vw, 4.75rem)", textWrap: "balance" } as const;

interface Step { id: "onsite" | "corridor" | "town"; eyebrow: string; title: string; line: string | null; icons: ReactNode }

function Caption({ step, index, on, setActive }: { step: Step; index: number; on: boolean; setActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inBand = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => { if (inBand) setActive(index); }, [inBand, index, setActive]);
  return (
    <div ref={ref} data-on={on} className="py-10 lg:min-h-[70dvh] lg:flex lg:items-center transition-opacity duration-300 lg:data-[on=false]:opacity-70">
      <Rise>
        <div className="flex items-center gap-3 mb-3 min-h-9">
          <p className="kicker m-0" style={{ color: ringText(step.id) }}>{step.eyebrow}</p>
          {step.icons}
        </div>
        <h3 className="serif font-bold m-0 text-ink leading-[1.15]" style={{ fontSize: "clamp(1.6rem, 1.1rem + 1.6vw, 2.5rem)", textWrap: "balance" }}>{step.title}</h3>
        {step.line && <p className="t-caption num mt-3 mb-0">{step.line}</p>}
      </Rise>
    </div>
  );
}

/** Apple-style sticky scene: the map stays pinned while three captions scroll past and each ring pops in. Stacked, unpinned on small screens. */
function RingsStory({ data, steps, townBuilt }: { data: AppData; steps: Step[]; townBuilt: boolean }) {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [reached, setReached] = useState(0);
  const [stacked, setStacked] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapIn = useInView(mapRef, { once: true, amount: 0.5 });
  useEffect(() => {
    const q = window.matchMedia("(min-width: 1024px)");
    const set = () => setStacked(!q.matches);
    set();
    q.addEventListener("change", set);
    return () => q.removeEventListener("change", set);
  }, []);
  useEffect(() => { setReached((r) => Math.max(r, active)); }, [active]);
  const n = stacked ? (mapIn ? 3 : 0) : mapIn ? Math.max(1, reached + 1) : 0;
  return (
    <div className="grid gap-x-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="order-last lg:order-first">
        {steps.map((s, i) => <Caption key={s.id} step={s} index={i} on={active === i} setActive={setActive} />)}
      </div>
      <div className="order-first lg:order-last lg:sticky lg:self-start" style={{ top: "calc((100dvh - min(72dvh, 620px)) / 2)" }}>
        <div ref={mapRef} className="card overflow-hidden w-full lg:w-auto lg:h-[min(72dvh,620px)] lg:ml-auto" style={{ aspectRatio: STORY_ASPECT }}>
          <StoryMap offtakers={data.offtakers} n={n} still={reduce} stagger={stacked} townBuilt={townBuilt} />
        </div>
      </div>
    </div>
  );
}

/** Landing page as a scroll story. Every number is read from site2.json. */
export function Home({ data }: { data: AppData }) {
  const reduce = useReducedMotion();
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
  const per = (id: "onsite" | "corridor" | "town", tail: string) => (ringL(id) !== undefined ? `$${int(ringL(id) as number)} per MWh ${tail}` : null);

  const steps = [
    on && { id: "onsite", eyebrow: "On-site farm campus", title: "Build first", line: [`${dec(on.annual_MWh / 1000, 1)} GWh of heat a year`, per("onsite", "at 7%")].filter(Boolean).join(" · "), icons: <span className="inline-flex gap-1.5"><Pop><Tomato /></Pop><Pop delay={0.1}><Fish /></Pop></span> },
    co && { id: "corridor", eyebrow: "Corridor homes", title: "Build where homes sign up, with benefit-agreement funds", line: [`${int(co.homes ?? d.impact.homes_served)} homes · ${dec(co.annual_MWh / 1000, 1)} GWh a year`, per("corridor", "at 7% on its own")].filter(Boolean).join(" · "), icons: <Pop><House /></Pop> },
    tw && { id: "town", eyebrow: "Town center", title: townLcoh !== undefined && townLcoh > propane ? "Fails the cost test: not built" : "Only if it passes the cost test", line: [townLcoh !== undefined ? `$${int(townLcoh)} per MWh vs $${int(propane)} for propane` : null, `${dec(tw.pipe_km, 0)} km of pipe`].filter(Boolean).join(" · "), icons: null },
  ].filter(Boolean) as Step[];

  const stats: { value: ReactNode; caption: string; icon?: ReactNode }[] = [
    { value: <Odometer value={usd(saving)} />, caption: "a year saved by a propane home", icon: <Pop><NoFlame /></Pop> },
    { value: <><Odometer value={usd(lcoh7)} /> <span className="text-ink2 text-[0.5em] font-normal">vs</span> <Odometer value={usd(propane)} /></>, caption: "per MWh, our heat against propane" },
    { value: <Odometer value={int(d.impact.co2_avoided_t_yr)} />, caption: "tonnes of CO2 avoided a year" },
    ...(cbaPct !== undefined ? [{ value: <Odometer value={`${dec(cbaPct, 1)}%`} />, caption: "of the data center's cost would fund the home program" }] : []),
  ];

  return (
    <div className="min-h-dvh flex flex-col">
      <NavBar active="/" />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-[clamp(1rem,3vw,3rem)]">
        <section aria-labelledby="home-h" className="min-h-[calc(100dvh-6.5rem)] flex flex-col justify-center relative pb-16">
          <Rise>
            <p className="kicker m-0 mb-5">Data-center heat for Lansing, NY</p>
            <h1 id="home-h" className="serif font-bold m-0 text-ink leading-[1.05] max-w-[18ch]" style={BIG}>
              <span className="num text-ember-text">{int(d.supply.heat_available_GWh)} GWh</span> of heat a year goes into the air.
            </h1>
          </Rise>
          <motion.svg aria-hidden width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--ink2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute bottom-6 left-0"
            animate={reduce ? undefined : { y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </section>

        <section className={SECTION} aria-label="Why this matters">
          <ScrollReveal text="The town board is drafting a ban. We found the terms that let it say yes." />
        </section>

        <section className={`${SECTION} !pt-0`} aria-label="The numbers">
          <ul className="list-none m-0 p-0 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 border-t-2 border-line pt-10">
            {stats.map((s, i) => (
              <li key={i} className="relative">
                <div className="serif font-bold text-ink leading-none" style={{ fontSize: "clamp(2.25rem, 1.2rem + 2.6vw, 3.5rem)" }}>{s.value}</div>
                <p className="t-caption mt-3 mb-0">{s.caption}</p>
                {s.icon && <span className="absolute top-0 right-0">{s.icon}</span>}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="rings-h" className={`${SECTION} !pb-0`}>
          <Rise>
            <p className="kicker m-0 mb-4">Three rings</p>
            <h2 id="rings-h" className="serif font-bold m-0 text-ink leading-[1.1] max-w-[20ch]" style={BIG}>Built only where the numbers pass.</h2>
          </Rise>
          <div className="mt-10 lg:mt-4"><RingsStory data={data} steps={steps} townBuilt={townLcoh !== undefined && townLcoh <= propane} /></div>
        </section>

        <section className={`${SECTION} text-center`} aria-labelledby="close-h">
          <Rise>
            <h2 id="close-h" className="serif font-bold m-0 text-ink leading-[1.1]" style={BIG}>Don&apos;t ban it. Set the terms.</h2>
            <div className="flex flex-wrap gap-3 justify-center mt-10">
              <Link prefetch={false} href="/explore/" className="btn btn-primary no-underline">Try the model &rarr;</Link>
              <Link prefetch={false} href="/compare/" className="btn no-underline">Compare the sites</Link>
            </div>
          </Rise>
        </section>

        <section aria-labelledby="know-h" className="pb-10">
          <h2 id="know-h" className="kicker m-0 mb-3">How we know</h2>
          <ul className="list-none m-0 p-0 flex flex-wrap gap-x-8 gap-y-2 text-body font-semibold">
            <li><Link prefetch={false} href="/how/" className="text-ink">How it works</Link></li>
            <li><Link prefetch={false} href="/sources/" className="text-ink">Sources</Link></li>
            <li><a href={PUBLIC_URL} target="_blank" rel="noreferrer" className="text-ink">Code on GitHub &#8599;</a></li>
            <li><a href={DECK_PDF} target="_blank" rel="noreferrer" className="text-ink">Slide deck (PDF) &#8599;</a></li>
          </ul>
        </section>

        <footer className="t-caption border-t border-line pt-4 pb-6">{CREDITS}</footer>
      </main>
    </div>
  );
}

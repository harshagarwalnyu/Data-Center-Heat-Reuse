"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { AppData } from "@/lib/types";
import { dec, int, usd } from "@/lib/format";
import { CREDITS, PUBLIC_URL } from "@/lib/config";
import { LCOH_ANCHOR_PCT } from "@/lib/model";
import { NavBar, ringColor, ringText } from "./ui";
import { StoryMap, STORY_ASPECT, type DcTip, type RingId, type RingTip } from "./viz/StoryMap";
import { Info, TipKey } from "./Tooltip";
import { Fish, House, NoFlame, Odometer, Pop, Rise, ScrollReveal, Tomato } from "./HomeParts";

const DECK_PDF = `${PUBLIC_URL}/blob/main/docs/deck/Thermal-Commons-Heat-for-Lansing.pdf`;
const SECTION = "py-[clamp(4rem,14dvh,9rem)]";
const BIG = { fontSize: "clamp(2.1rem, 1rem + 4.4vw, 4.75rem)", textWrap: "balance" } as const;

interface Step { id: RingId; eyebrow: string; title: string; line: string | null; detail: string | null; icons: ReactNode }

function Caption({ step, index, on, picked, setActive }: { step: Step; index: number; on: boolean; picked: boolean; setActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inBand = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => { if (inBand) setActive(index); }, [inBand, index, setActive]);
  return (
    <div ref={ref} id={`cap-${step.id}`} data-on={on || picked} className="py-10 lg:min-h-[70dvh] lg:flex lg:items-center transition-opacity duration-300 lg:data-[on=false]:opacity-70">
      <Rise>
       <div className="border-l-4 pl-4 -ml-5 transition-colors duration-300" style={{ borderColor: picked ? ringColor(step.id) : "transparent" }}>
        <div className="flex items-center gap-3 mb-3 min-h-9">
          <p className="kicker m-0" style={{ color: ringText(step.id) }}>{step.eyebrow}</p>
          {step.icons}
        </div>
        <h3 className="serif font-bold m-0 text-ink leading-[1.15]" style={{ fontSize: "clamp(1.6rem, 1.1rem + 1.6vw, 2.5rem)", textWrap: "balance" }}>{step.title}</h3>
        {step.line && <p className="t-caption num mt-3 mb-0">{step.line}</p>}
        {picked && step.detail && <p className="t-caption num mt-1 mb-0 text-ink2">{step.detail}</p>}
       </div>
      </Rise>
    </div>
  );
}

/** Apple-style sticky scene: the map stays pinned while three captions scroll past and each ring pops in. Stacked, unpinned on small screens. */
function RingsStory({ data, steps, townBuilt, ringTips, dc }: { data: AppData; steps: Step[]; townBuilt: boolean; ringTips: RingTip[]; dc: DcTip }) {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [reached, setReached] = useState(0);
  const [stacked, setStacked] = useState(false);
  const [picked, setPicked] = useState<RingId | null>(null);
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
  // Pin a ring: on the wide layout the caption scrolls to the middle of the screen; stacked on a phone it expands in place.
  const pick = (id: RingId | null) => {
    setPicked(id);
    if (id && !stacked) document.getElementById(`cap-${id}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };
  const n = stacked ? (mapIn ? 3 : 0) : mapIn ? Math.max(1, reached + 1) : 0;
  return (
    <div className="grid gap-x-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="order-last lg:order-first">
        {steps.map((s, i) => <Caption key={s.id} step={s} index={i} on={active === i} picked={picked === s.id} setActive={setActive} />)}
      </div>
      <div className="order-first lg:order-last lg:sticky lg:self-start" style={{ top: "calc((100dvh - min(72dvh, 620px)) / 2)" }}>
        <div ref={mapRef} className="card overflow-hidden w-full lg:w-auto lg:h-[min(72dvh,620px)] lg:ml-auto" style={{ aspectRatio: STORY_ASPECT }}>
          <StoryMap offtakers={data.offtakers} n={n} still={reduce} stagger={stacked} townBuilt={townBuilt} rings={ringTips} dc={dc} selected={picked} onSelect={pick} />
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

  const detail = (r: NonNullable<typeof on>) => `${dec(r.peak_MW, 1)} MW peak · ${int(r.supply_temp_C)} °C supply`;
  const verdicts: Record<RingId, string> = {
    onsite: "Build first",
    corridor: "Build with benefit-agreement funds",
    town: townLcoh !== undefined && townLcoh > propane ? "Fails the cost test: not built" : "Only if it passes the cost test",
  };
  const ringTips: RingTip[] = d.rings.filter((r) => r.id in verdicts).map((r) => ({
    id: r.id, name: r.name, gwh: dec(r.annual_MWh / 1000, 1),
    lcoh: (r.id === "town" ? townLcoh : ringL(r.id)) !== undefined ? `$${int((r.id === "town" ? townLcoh : ringL(r.id)) as number)}` : null,
    verdict: verdicts[r.id], pipeKm: dec(r.pipe_km, r.pipe_km < 10 ? 1 : 0),
  }));
  const dc: DcTip = { itLoadMW: int(d.supply.it_load_MW), heatGWh: int(d.supply.heat_available_GWh) };

  const steps = [
    on && { id: "onsite", eyebrow: "On-site farm campus", title: "Build first", line: [`${dec(on.annual_MWh / 1000, 1)} GWh of heat a year`, per("onsite", "at 7%")].filter(Boolean).join(" · "), detail: detail(on), icons: <span className="inline-flex gap-1.5"><Pop><Tomato /></Pop><Pop delay={0.1}><Fish /></Pop></span> },
    co && { id: "corridor", eyebrow: "Corridor homes", title: "Build where homes sign up, with benefit-agreement funds", line: [`${int(co.homes ?? d.impact.homes_served)} homes · ${dec(co.annual_MWh / 1000, 1)} GWh a year`, per("corridor", "at 7% on its own")].filter(Boolean).join(" · "), detail: detail(co), icons: <Pop><House /></Pop> },
    tw && { id: "town", eyebrow: "Town center", title: townLcoh !== undefined && townLcoh > propane ? "Fails the cost test: not built" : "Only if it passes the cost test", line: [townLcoh !== undefined ? `$${int(townLcoh)} per MWh vs $${int(propane)} for propane` : null, `${dec(tw.pipe_km, 0)} km of pipe`].filter(Boolean).join(" · "), detail: detail(tw), icons: null },
  ].filter(Boolean) as Step[];

  const stats: { value: ReactNode; caption: string; icon?: ReactNode; tip?: ReactNode }[] = [
    { value: <Odometer value={usd(saving)} />, caption: "a year saved by a propane home", icon: <Pop><NoFlame /></Pop>,
      tip: <>Our tariff is fixed at {dec(f.tariff_usd_mwh / propane, 1)} times propane&apos;s price per MWh, applied to a typical home&apos;s {int(f.household.typical_MWh_yr)} MWh of heat a year.<TipKey k="finance.household.savings_vs_propane_usd" /></> },
    { value: <><Odometer value={usd(lcoh7)} /> <span className="text-ink2 text-[0.5em] font-normal">vs</span> <Odometer value={usd(propane)} /></>, caption: "per MWh, our heat against propane",
      tip: <>Our cost is capex times the capital recovery factor, plus operating cost, divided by the heat delivered, at {int(LCOH_ANCHOR_PCT[1])}% utility finance. Propane is what heat costs today.<TipKey k="finance.lcoh_usd_mwh.utility_7pct vs finance.incumbent_usd_mwh.propane" /></> },
    { value: <Odometer value={int(d.impact.co2_avoided_t_yr)} />, caption: "tonnes of CO2 avoided a year",
      tip: <>The emissions of the fossil fuel our heat displaces, minus the emissions of the electricity and backup fuel the system itself uses.<TipKey k="impact.co2_avoided_t_yr" /></> },
    ...(cbaPct !== undefined ? [{ value: <Odometer value={`${dec(cbaPct, 1)}%`} />, caption: "of the data center's cost would fund the home program",
      tip: <>The whole-project funding gap (phases 1 and 2, present value at {int(LCOH_ANCHOR_PCT[1])}%), as a share of the data center&apos;s capex{ex?.cba?.dc_capex_musd !== undefined ? <>, assumed at ${int(ex.cba.dc_capex_musd)}M</> : null}.<TipKey k={ex?.cba?.headline_as_pct_of_dc_capex !== undefined ? "extras.cba.headline_as_pct_of_dc_capex" : "extras.cba.as_pct_of_dc_capex"} /></> }] : []),
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
                <p className="t-caption mt-3 mb-0">{s.caption}{s.tip && <> <Info tip={s.tip} /></>}</p>
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
          <div className="mt-10 lg:mt-4"><RingsStory data={data} steps={steps} townBuilt={townLcoh !== undefined && townLcoh <= propane} ringTips={ringTips} dc={dc} /></div>
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

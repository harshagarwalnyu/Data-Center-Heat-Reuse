"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "framer-motion";
import { useStill } from "@/lib/motion";
import type { AppData } from "@/lib/types";
import { dec, int, usd } from "@/lib/format";
import { BASE_PATH, CREDITS, PUBLIC_URL } from "@/lib/config";
import { LCOH_ANCHOR_PCT } from "@/lib/model";
import { NavBar, ringColor, ringText } from "./ui";
import { StoryMap, STORY_ASPECT, type DcTip, type RingId, type RingTip } from "./viz/StoryMap";
import { Info, TipKey } from "./Tooltip";
import { Fish, House, NoFlame, Odometer, Pop, Rise, Tomato } from "./HomeParts";
import { HeroScene } from "./look/HeroScene";
import { Faq, TornEdge, TownHallCollage, type QA } from "./look/Paper";
import { Bento } from "./look/Bento";

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
  const reduce = useStill();
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
        <div className="relative w-full lg:w-auto lg:h-[min(72dvh,620px)] lg:ml-auto" style={{ aspectRatio: STORY_ASPECT }}>
          <svg aria-hidden focusable="false" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute -inset-3 sm:-inset-4 w-[calc(100%+1.5rem)] sm:w-[calc(100%+2rem)] h-[calc(100%+1.5rem)] sm:h-[calc(100%+2rem)] drop-shadow-[0_14px_24px_rgba(59,42,30,0.18)]">
            <path fill="#fffdf8" d="M1 2 L12 0.6 L25 1.8 L40 0.4 L55 1.6 L70 0.5 L86 1.7 L99 0.8 L99.4 14 L98.6 30 L99.6 46 L98.8 62 L99.5 78 L98.7 99 L84 99.6 L68 98.6 L52 99.5 L36 98.7 L20 99.6 L1.2 98.8 L0.5 82 L1.4 66 L0.4 50 L1.3 34 L0.5 18 Z" />
          </svg>
          <span aria-hidden className="absolute -top-5 left-8 w-24 h-7 rotate-[-6deg] bg-[#efe2c4]/90 shadow-sm z-10" />
          <span aria-hidden className="absolute -bottom-5 right-10 w-24 h-7 rotate-[5deg] bg-[#efe2c4]/90 shadow-sm z-10" />
          <div ref={mapRef} className="relative overflow-hidden rounded-[14px] w-full h-full">
            <StoryMap offtakers={data.offtakers} n={n} still={reduce} stagger={stacked} townBuilt={townBuilt} rings={ringTips} dc={dc} selected={picked} onSelect={pick} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Landing page as a scroll story. Every number is read from site2.json. */
export function Home({ data }: { data: AppData }) {
  const reduce = useStill();
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
    { value: <><Odometer value={usd(lcoh7)} /> <span className="text-ink2 text-[max(18px,0.5em)] font-normal">vs</span> <Odometer value={usd(propane)} /></>, caption: "per MWh, our heat against propane",
      tip: <>Our cost is capex times the capital recovery factor, plus operating cost, divided by the heat delivered, at {int(LCOH_ANCHOR_PCT[1])}% utility finance. Propane is what heat costs today.<TipKey k="finance.lcoh_usd_mwh.utility_7pct vs finance.incumbent_usd_mwh.propane" /></> },
    { value: <Odometer value={int(d.impact.co2_avoided_t_yr)} />, caption: "tonnes of CO2 avoided a year",
      tip: <>The emissions of the fossil fuel our heat displaces, minus the emissions of the electricity and backup fuel the system itself uses.<TipKey k="impact.co2_avoided_t_yr" /></> },
    ...(cbaPct !== undefined ? [{ value: <Odometer value={`${dec(cbaPct, 1)}%`} />, caption: "of the data center's cost would fund the home program",
      tip: <>The whole-project funding gap (phases 1 and 2, present value at {int(LCOH_ANCHOR_PCT[1])}%), as a share of the data center&apos;s capex{ex?.cba?.dc_capex_musd !== undefined ? <>, assumed at ${int(ex.cba.dc_capex_musd)}M</> : null}.<TipKey k={ex?.cba?.headline_as_pct_of_dc_capex !== undefined ? "extras.cba.headline_as_pct_of_dc_capex" : "extras.cba.as_pct_of_dc_capex"} /></> }] : []),
  ];

  const heroStats = stats.slice(0, 3);
  const cbaStat = stats[3];
  const backupPct = (d.totals.backup_MWh / d.totals.heat_delivered_MWh) * 100;
  const ex10 = f.dc_exit;
  const corridorL = ringL("corridor");
  const gap = ex?.cba?.headline_gap_musd ?? ex?.cba?.whole_project_gap_musd;
  const faq: QA[] = [
    { q: "Is Lansing banning data centers?",
      a: <>Not yet. On 29 September 2026 the Town Board directed its attorney to draft a local law prohibiting data centers. There has been no vote on the ban itself. Our answer is a set of terms the town can sign instead.</> },
    { q: "Does taking the heat put the servers at risk?",
      a: <>Not by design. Under our proposed heat supply agreement, cooling always wins: the data center keeps its own dry coolers, our heat exchanger is a sidestream, and a fault on our side falls back to those fans. Backup boilers carry <span className="num">{int(d.totals.backup_MWh)}</span> MWh a year, about <span className="num">{dec(backupPct, 1)}%</span> of the heat we deliver.</> },
    { q: "What if the data center leaves?",
      a: <>We modelled an exit in year <span className="num">{int(ex10.year)}</span>: <span className="num">${dec(ex10.stranded_musd, 1)}</span> million of capital stranded{ex10.replacement_source_musd !== undefined ? <> and <span className="num">${dec(ex10.replacement_source_musd, 1)}</span> million for a replacement heat source</> : null}. The pipes and the building heat pumps stay; only the central source changes.</> },
    { q: "Why would a home connect?",
      a: <>The tariff is fixed at <span className="num">{dec(f.tariff_usd_mwh / propane, 1)}</span> times propane&apos;s price per MWh. A typical home using <span className="num">{int(f.household.typical_MWh_yr)}</span> MWh a year saves <span className="num">{usd(saving)}</span> against propane and <span className="num">{usd(f.household.savings_vs_oil_usd)}</span> against heating oil. A household that can install its own air-source heat pump can pay less, and we say so.</> },
    { q: "Why does the corridor need benefit-agreement money?",
      a: <>Homes are spread out, so the corridor ring costs {corridorL !== undefined ? <><span className="num">${int(corridorL)}</span> per MWh at 7% on its own</> : "more"}, against <span className="num">${int(propane)}</span> for propane. The on-site farm campus makes a surplus; the remaining whole-project gap{gap !== undefined ? <> of <span className="num">${dec(gap, 2)}</span> million</> : null} is what the community benefit agreement would fund.</> },
    { q: "How much of the waste heat do you actually use?",
      a: <>About <span className="num">{dec(d.totals.share_of_available_pct, 1)}%</span> of the <span className="num">{int(d.supply.heat_available_GWh)}</span> GWh available, or <span className="num">{dec(d.totals.heat_delivered_MWh / 1000, 1)}</span> GWh a year. We only build rings that pass the cost test, so the rest still goes to the air.</> },
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-bg">
      <main className="flex-1 w-full">
        {/* 1. Hero: painted golden-hour lake */}
        <section aria-labelledby="home-h" className="relative overflow-hidden min-h-[max(100dvh,640px)] flex flex-col">
          <HeroScene />
          <NavBar active="/" overlay />
          <div className="relative z-10 flex-1 flex flex-col items-center text-center px-5 pt-[9.5rem] md:pt-[clamp(6rem,13dvh,8.5rem)] pb-10">
            <div aria-hidden className="hero-glow absolute left-1/2 -translate-x-1/2 top-[8%] w-[min(980px,120vw)] h-[62%] -z-10" />
            <Rise>
              <p className="kicker m-0 mb-4 !text-[#4a3527]">Heat for Lansing, NY</p>
              <h1 id="home-h" className="m-0 text-ink leading-[1.04] max-w-[16ch] mx-auto" style={{ fontSize: "clamp(2.6rem, 1.3rem + 3.6vw, 4.4rem)", textWrap: "balance" }}>
                <span className="num">{int(d.supply.heat_available_GWh)} GWh</span> of heat a year goes into the air.
              </h1>
              <p className="m-0 mt-5 text-ink mx-auto max-w-[40ch]" style={{ fontSize: "clamp(1.2rem, 1rem + 0.5vw, 1.45rem)" }}>We found the terms that let Lansing say yes.</p>
              <Link prefetch={false} href="/explore/" className="btn btn-primary no-underline mt-7 !px-7 !min-h-[52px]">Try the model</Link>
            </Rise>
            <ul className="list-none m-0 p-0 mt-10 md:mt-12 grid gap-x-6 gap-y-3 sm:grid-cols-3 items-end w-full max-w-[940px]">
              {heroStats.map((s, i) => (
                <li key={i} className="stat-glass rounded-2xl px-4 py-2.5 sm:py-3">
                  <div className="relative flex items-center justify-center gap-2">
                    {i === 1 && <Laurel />}
                    <div className="serif text-ink leading-none whitespace-nowrap" style={{ fontSize: "clamp(1.8rem, 1.1rem + 1.4vw, 2.4rem)" }}>{s.value}</div>
                    {i === 1 && <Laurel flip />}
                  </div>
                  <p className="m-0 mt-2 text-ink text-caption leading-snug">{s.caption}{s.tip && <> <Info tip={s.tip} /></>}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2. The problem, on chocolate brown */}
        <TornEdge fill="#3b2a1e" seed={5} className="-mt-[20px] sm:-mt-[28px] relative z-10" />
        <section aria-labelledby="problem-h" className="brown-section">
          <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,3rem)] py-[clamp(4rem,12dvh,8rem)] grid gap-10 lg:grid-cols-2 items-center">
            <Rise className="order-2 lg:order-1"><TownHallCollage className="w-full max-w-[520px] mx-auto block" /></Rise>
            <Rise className="order-1 lg:order-2">
              <p className="kicker m-0 mb-4">The problem</p>
              <h2 id="problem-h" className="m-0 leading-[1.08] text-[#fdf6ea]" style={{ fontSize: "clamp(2.1rem, 1.2rem + 2.6vw, 3.4rem)", textWrap: "balance" }}>Lansing directed its attorney to draft a data-center ban.</h2>
              <p className="m-0 mt-6 text-[#efe2cf] max-w-[46ch]" style={{ fontSize: "var(--text-lead)" }}>Lansing&apos;s board has moved toward a ban. Terms are the alternative: who owns the pipe, who pays for the gap, and what happens if the data center leaves.</p>
              {cbaStat && (
                <p className="m-0 mt-6 text-[#efe2cf] text-body">
                  <span className="serif text-[#fdf6ea]" style={{ fontSize: "1.6rem" }}>{cbaStat.value}</span> {cbaStat.caption}
                </p>
              )}
              <Link prefetch={false} href="/how/" className="inline-flex items-center gap-2 mt-8 font-bold text-[#fdf6ea] no-underline hover:underline min-h-[44px]">See how the terms work <span aria-hidden>&rarr;</span></Link>
            </Rise>
          </div>
        </section>
        <TornEdge fill="#3b2a1e" seed={11} flip className="relative z-10" />

        {/* Demo video: loads only when played */}
        <section aria-labelledby="demo-h" className="max-w-[1100px] mx-auto px-[clamp(1rem,3vw,3rem)] pt-[clamp(4rem,12dvh,8rem)]">
          <Rise className="text-center">
            <p className="kicker m-0 mb-3">See it in 77 seconds</p>
            <h2 id="demo-h" className="t-h2 m-0 mb-6">A quick tour of the model</h2>
          </Rise>
          <video className="w-full rounded-2xl shadow-lg" controls preload="none" playsInline poster={`${BASE_PATH}/video/explainer-poster.jpg`} aria-label="Demo video with narration and subtitles">
            <source src={`${BASE_PATH}/video/explainer.mp4`} type="video/mp4" />
          </video>
        </section>

        {/* 3. The rings */}
        <section aria-labelledby="rings-h" className="max-w-[1400px] mx-auto px-[clamp(1rem,3vw,3rem)] pt-[clamp(4rem,12dvh,8rem)]">
          <Rise className="text-center">
            <p className="kicker m-0 mb-4">Three rings</p>
            <h2 id="rings-h" className="m-0 text-ink leading-[1.08] mx-auto max-w-[20ch]" style={{ fontSize: "clamp(2.1rem, 1.2rem + 2.6vw, 3.4rem)", textWrap: "balance" }}>Built only where the numbers pass.</h2>
          </Rise>
          <div className="mt-10 lg:mt-4"><RingsStory data={data} steps={steps} townBuilt={townLcoh !== undefined && townLcoh <= propane} ringTips={ringTips} dc={dc} /></div>
        </section>

        {/* 4. Bento */}
        <section aria-labelledby="bento-h" className="max-w-[1240px] mx-auto px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,12dvh,8rem)]">
          <Rise className="text-center mb-12">
            <p className="kicker m-0 mb-4">Features</p>
            <h2 id="bento-h" className="m-0 text-ink leading-[1.08]" style={{ fontSize: "clamp(2.1rem, 1.2rem + 2.6vw, 3.4rem)" }}>What you can do here</h2>
            <p className="lede m-0 mt-4 mx-auto max-w-[44ch]">Every number on this site comes from the model&apos;s output files. Try it, check it, take it apart.</p>
          </Rise>
          <Bento data={data} />
        </section>

        {/* 5. FAQ on graph paper */}
        <TornEdge fill="#f4f6f7" seed={21} />
        <section aria-labelledby="faq-h" className="graph-paper">
          <div className="max-w-[860px] mx-auto px-[clamp(1.25rem,4vw,3rem)] py-[clamp(4rem,12dvh,7rem)]">
            <Rise className="text-center mb-10">
              <h2 id="faq-h" className="m-0 text-ink" style={{ fontSize: "clamp(2.1rem, 1.2rem + 2.6vw, 3.4rem)" }}>FAQ</h2>
              <p className="lede m-0 mt-3">A few things a town board asks first.</p>
            </Rise>
            <Faq items={faq} />
            <div className="card mt-14 p-[clamp(1.25rem,3vw,2rem)] flex flex-col sm:flex-row gap-5 sm:items-center justify-between !border-transparent">
              <div>
                <h2 className="m-0 text-ink" style={{ fontSize: "clamp(1.6rem, 1.2rem + 1vw, 2.1rem)" }}>Don&apos;t ban it. Set the terms.</h2>
                <p className="m-0 mt-2 text-ink2">Still have questions? Run the numbers yourself, or read every source we used.</p>
              </div>
              <Link prefetch={false} href="/explore/" className="btn btn-primary no-underline shrink-0">Try the model</Link>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <footer className="bg-bg border-t border-line/70">
        <div className="max-w-[1240px] mx-auto px-[clamp(1.25rem,4vw,3rem)] py-10 grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="serif m-0 text-ink" style={{ fontSize: "1.8rem" }}>Thermal Commons</p>
            <p className="m-0 mt-2 text-ink2 max-w-[48ch]">A community heat utility for Lansing, NY, built from a data center&apos;s waste heat.</p>
          </div>
          <nav aria-label="Footer">
            <ul className="list-none m-0 p-0 grid grid-cols-2 gap-x-6 gap-y-2 font-semibold">
              <li><Link prefetch={false} href="/how/" className="text-ink">How it works</Link></li>
              <li><Link prefetch={false} href="/sources/" className="text-ink">Sources</Link></li>
              <li><a href={PUBLIC_URL} target="_blank" rel="noreferrer" className="text-ink">Code on GitHub &#8599;</a></li>
              <li><a href={DECK_PDF} target="_blank" rel="noreferrer" className="text-ink">Slide deck (PDF) &#8599;</a></li>
            </ul>
          </nav>
          <p className="t-caption m-0 md:col-span-2 border-t border-line/70 pt-4">{CREDITS}</p>
        </div>
      </footer>
    </div>
  );
}

/** Laurel sprig that flanks the middle hero stat. Decorative. */
function Laurel({ flip = false }: { flip?: boolean }) {
  return (
    <svg aria-hidden focusable="false" width="22" height="46" viewBox="0 0 22 46" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M17 44 C6 36 4 20 12 4" stroke="#3b2a1e" strokeWidth="2" fill="none" strokeLinecap="round" />
      {[8, 16, 24, 32].map((y, i) => <ellipse key={y} cx={i < 2 ? 8 + i : 6} cy={y} rx="5" ry="2.6" fill="#3b2a1e" transform={`rotate(${-40 + i * 8} ${i < 2 ? 8 + i : 6} ${y})`} />)}
      {[12, 20, 28].map((y) => <ellipse key={`r${y}`} cx="15" cy={y} rx="4.5" ry="2.2" fill="#3b2a1e" transform={`rotate(40 15 ${y})`} />)}
    </svg>
  );
}

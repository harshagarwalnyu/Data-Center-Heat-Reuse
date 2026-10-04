"use client";
import type { ReactNode } from "react";
import { dec } from "@/lib/format";
import { ExchangerIcon, FarmHomesIcon, RackIcon } from "./HowFigures";

/* Small inline-SVG pieces for the Explore page. The big figures (ThermoPair, PriceBars, CarsRow) are reused from HowFigures. */

const INK = "var(--ink)", LINE = "var(--brown)", PAPER = "var(--surface)", EMBER = "var(--ember)", TEAL = "var(--teal)";
const W = 2;

const Ico = ({ size = 32, children }: { size?: number; children: ReactNode }) => (
  <svg aria-hidden focusable="false" width={size} height={size} viewBox="0 0 64 64" className="shrink-0">{children}</svg>
);

/* ---------- KPI corner icons ---------- */

export const FlameIcon = () => (
  <Ico><path d="M32 6 C34 18 48 24 48 40 C48 52 40 58 32 58 C24 58 16 52 16 40 C16 32 22 28 24 20 C28 24 28 28 29 30 C32 24 30 14 32 6 Z" fill="var(--peach)" stroke={LINE} strokeWidth={W} strokeLinejoin="round" /><path d="M32 58 C27 58 24 54 24 49 C24 43 30 41 32 34 C35 40 40 43 40 49 C40 54 37 58 32 58 Z" fill={EMBER} stroke={LINE} strokeWidth={1.6} strokeLinejoin="round" /></Ico>
);
export const HouseIcon = () => (
  <Ico><path d="M8 32 L32 10 L56 32 V54 H8 Z" fill="var(--sage)" stroke={LINE} strokeWidth={W} strokeLinejoin="round" /><rect x="26" y="36" width="12" height="18" rx="2" fill={PAPER} stroke={LINE} strokeWidth={1.6} /><path d="M44 8 V20" stroke={LINE} strokeWidth={W} strokeLinecap="round" /></Ico>
);
export const ThermoIcon = () => (
  <Ico><rect x="25" y="6" width="14" height="38" rx="7" fill={PAPER} stroke={LINE} strokeWidth={W} /><circle cx="32" cy="48" r="10" fill={EMBER} stroke={LINE} strokeWidth={W} /><rect x="29.5" y="22" width="5" height="26" rx="2.5" fill={EMBER} /><path d="M44 14 H52 M44 24 H50 M44 34 H52" stroke={LINE} strokeWidth={1.8} strokeLinecap="round" /></Ico>
);
export const TagIcon = () => (
  <Ico><path d="M8 8 H32 L58 34 L34 58 L8 32 Z" fill="var(--butter)" stroke={LINE} strokeWidth={W} strokeLinejoin="round" /><circle cx="20" cy="20" r="4" fill={PAPER} stroke={LINE} strokeWidth={1.6} /><path d="M30 38 L38 30" stroke={EMBER} strokeWidth={3} strokeLinecap="round" /></Ico>
);
export const HomeDollarIcon = () => (
  <Ico><path d="M6 30 L28 10 L50 30 V52 H6 Z" fill="var(--peach)" stroke={LINE} strokeWidth={W} strokeLinejoin="round" /><circle cx="46" cy="44" r="14" fill="var(--butter)" stroke={LINE} strokeWidth={W} /><path d="M50 39 C48 36 42 37 42 41 C42 45 50 44 50 48 C50 52 44 52 42 49 M46 34 V56" stroke={LINE} strokeWidth={2} fill="none" strokeLinecap="round" /></Ico>
);
export const CloudIcon = () => (
  <Ico><path d="M18 46 C8 46 6 32 16 30 C16 18 34 14 38 26 C50 22 58 36 48 46 Z" fill="var(--sky)" stroke={LINE} strokeWidth={W} strokeLinejoin="round" /><path d="M24 54 C28 50 34 56 40 52" stroke={TEAL} strokeWidth={3} fill="none" strokeLinecap="round" /></Ico>
);

/* ---------- cooling-type button icons ---------- */

export const FanIcon = () => (
  <Ico size={22}><circle cx="32" cy="32" r="5" fill={PAPER} stroke="currentColor" strokeWidth={4} />{[0, 90, 180, 270].map((a) => <path key={a} transform={`rotate(${a} 32 32)`} d="M32 26 C30 12 42 6 46 14 C48 20 40 26 34 27 Z" fill="none" stroke="currentColor" strokeWidth={4} strokeLinejoin="round" />)}</Ico>
);
export const DropIcon = () => (
  <Ico size={22}><path d="M32 6 C44 22 52 30 52 42 C52 53 43 60 32 60 C21 60 12 53 12 42 C12 30 20 22 32 6 Z" fill="none" stroke="currentColor" strokeWidth={5} strokeLinejoin="round" /></Ico>
);

/* ---------- live flow strip: servers -> exchanger -> farm and homes ---------- */

/** Arrow whose thickness is a number: `weight` 0..1 maps to 2..12 units. */
function FlowArrow({ weight, color = EMBER }: { weight: number; color?: string }) {
  const sw = 2 + Math.max(0, Math.min(1, weight)) * 10;
  const head = 6 + sw * 1.2;
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 80 36" className="block w-full h-9 min-w-[36px]">
      <path d={`M2 18 C22 10 40 26 ${78 - head} 18`} stroke={color} strokeWidth={sw} fill="none" strokeLinecap="round" style={{ transition: "stroke-width 0.25s ease-out" }} />
      <path d={`M${78 - head} ${18 - head * 0.7} L78 18 L${78 - head} ${18 + head * 0.7}`} stroke={color} strokeWidth={Math.max(3, sw * 0.6)} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FlowStrip({ producedGWh, deliveredGWh, sharePct }: { producedGWh: number; deliveredGWh: number; sharePct: number }) {
  const has = Number.isFinite(sharePct) && producedGWh > 0;
  const share = has ? sharePct : 0;
  const label = has
    ? `Live flow: the data center makes ${dec(producedGWh, 0)} GWh of heat a year, the exchanger passes ${dec(deliveredGWh, 0)} GWh to the farm and homes, ${dec(Math.min(share, 100), 1)} percent of it.`
    : "Live flow: the data center makes no heat at this size, so nothing reaches the farm and homes.";
  const node = (icon: ReactNode, text: string) => (
    <div className="grid justify-items-center gap-1 text-center w-[84px] sm:w-[104px] shrink-0">
      <span className="grid place-items-center w-[64px] h-[64px] rounded-2xl border-[1.5px] border-brown" style={{ background: PAPER }}>{icon}</span>
      <span className="text-caption font-semibold leading-tight">{text}</span>
    </div>
  );
  return (
    <div role="img" aria-label={label} className="mt-5 max-w-[640px]">
      <div aria-hidden className="flex items-start gap-1 sm:gap-2">
        {node(<RackIcon />, "Servers")}
        <div className="flex-1 min-w-0 pt-[14px]"><FlowArrow weight={0.35} /></div>
        {node(<ExchangerIcon />, "Heat exchanger")}
        <div className="flex-1 min-w-0 pt-[14px]"><FlowArrow weight={Math.min(share, 100) / 100} /><div className="num text-caption font-bold text-center" style={{ color: "var(--ember-text)" }}>{has ? `${dec(Math.min(share, 100), 0)}% used` : "none"}</div></div>
        {node(<FarmHomesIcon />, "Farm and homes")}
      </div>
    </div>
  );
}

/* ---------- heat delivered: share ring ---------- */

export function ShareRing({ pct }: { pct: number }) {
  const p = Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 0;
  const r = 28, c = 2 * Math.PI * r;
  return (
    <svg role="img" aria-label={`${dec(p, 1)} percent of the heat produced is delivered; the rest still goes to the air.`} viewBox="0 0 72 72" width="72" height="72" className="block shrink-0">
      <circle cx="36" cy="36" r={r} fill="none" stroke="var(--line)" strokeWidth="9" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={EMBER} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(c * p) / 100} ${c}`} transform="rotate(-90 36 36)" style={{ transition: "stroke-dasharray 0.25s ease-out" }} />
      <text x="36" y="42" textAnchor="middle" fontSize="16" fontWeight="700" fill={INK}>{dec(p, 0)}%</text>
    </svg>
  );
}

/* ---------- By ring ---------- */

const RING_FILL: Record<string, string> = { onsite: "var(--sage)", corridor: "var(--peach)", town: "var(--sky)" };

/** Little ring glyph: concentric loop in the ring's pastel. Decorative. */
export function RingGlyph({ id }: { id: string }) {
  const rr = id === "onsite" ? 5 : id === "corridor" ? 9 : 13;
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 32 32" width="28" height="28" className="shrink-0">
      <circle cx="16" cy="16" r="14" fill={RING_FILL[id] ?? "var(--sky)"} stroke={LINE} strokeWidth={1.6} />
      <circle cx="16" cy="16" r={rr} fill="none" stroke={LINE} strokeWidth={1.6} strokeDasharray={id === "town" ? "3 3" : undefined} />
      <circle cx="16" cy="16" r="2.4" fill={EMBER} />
    </svg>
  );
}

/** Pass or fail mark for the cost test. Shape and word, not colour alone. */
export function PassMark({ pass }: { pass: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-bold" style={{ color: pass ? "var(--good)" : "var(--ember-text)" }}>
      <svg aria-hidden focusable="false" viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="10.5" fill={pass ? "var(--sage)" : "var(--peach)"} stroke={LINE} strokeWidth={1.6} />
        {pass ? <path d="M7 12.5 L10.5 16 L17 8.5" stroke="currentColor" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M8 8 L16 16 M16 8 L8 16" stroke="currentColor" strokeWidth={2.6} fill="none" strokeLinecap="round" />}
      </svg>
      {pass ? "Passes" : "Fails"}
    </span>
  );
}

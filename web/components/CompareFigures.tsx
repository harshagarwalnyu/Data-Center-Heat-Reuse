"use client";
import type { ReactNode } from "react";
import { useStill } from "@/lib/motion";

/* Inline-SVG pieces for the Compare page. No text inside the SVGs: every label is HTML so type stays readable at any card width.
   Colours are CSS variables so dark mode follows the site. Icons are reused from HowFigures and ExploreFigures. */

const LINE = "var(--brown)", PAPER = "var(--surface)", EMBER = "var(--ember)", TEAL = "var(--teal)";
const W = 2;

/* ---------- site vignettes (viewBox 200 x 140, decorative) ---------- */

/** Site 2: new-build campus on the lake, the old coal-plant stacks beside it. */
export function LansingVignette() {
  const still = useStill();
  const puff = (cx: number, dur: number) => (
    <ellipse cx={cx} cy={30} rx={9} ry={6} fill="var(--line)" opacity={0.85}>
      {!still && <animate attributeName="cy" values="34;14;34" dur={`${dur}s`} repeatCount="indefinite" />}
    </ellipse>
  );
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 200 140" className="block w-full h-auto">
      <rect x="2" y="2" width="196" height="136" rx="16" fill="var(--sky)" stroke={LINE} strokeWidth={W} />
      <path d="M2 92 Q40 66 80 86 T198 76 V124 Q198 138 184 138 H16 Q2 138 2 124 Z" fill="var(--sage)" stroke={LINE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M2 112 Q50 100 100 112 T198 108 V124 Q198 138 184 138 H16 Q2 138 2 124 Z" fill="var(--lake)" stroke={LINE} strokeWidth={W} strokeLinejoin="round" />
      <path d="M26 122 q8 -5 16 0 M120 126 q8 -5 16 0" stroke={PAPER} strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* old coal plant: block and two stacks */}
      <rect x="22" y="62" width="44" height="34" rx="3" fill="var(--cream)" stroke={LINE} strokeWidth={W} />
      <rect x="28" y="36" width="9" height="28" fill="var(--cream)" stroke={LINE} strokeWidth={W} />
      <rect x="48" y="42" width="9" height="22" fill="var(--cream)" stroke={LINE} strokeWidth={W} />
      <path d="M28 44 H37 M48 50 H57" stroke={LINE} strokeWidth={1.6} />
      {puff(33, 5)}
      <ellipse cx="55" cy="30" rx="7" ry="5" fill="var(--line)" opacity={0.7} />
      {/* new campus */}
      <rect x="92" y="64" width="64" height="34" rx="4" fill={PAPER} stroke={LINE} strokeWidth={W} />
      {[100, 116, 132].map((x) => <g key={x}><rect x={x} y={72} width={10} height={16} rx={2} fill="var(--peach)" stroke={LINE} strokeWidth={1.2} /><circle cx={x + 5} cy={80} r={1.6} fill={EMBER} /></g>)}
      <path d="M124 62 V50 M124 50 h-8" stroke={EMBER} strokeWidth={3} strokeLinecap="round" fill="none" />
      {/* greenhouse */}
      <path d="M164 98 V86 Q176 70 188 86 V98 Z" fill="var(--butter)" stroke={LINE} strokeWidth={1.8} />
      <circle cx="170" cy="22" r="9" fill="var(--butter)" stroke={LINE} strokeWidth={1.6} />
    </svg>
  );
}

/** Site 1: rooftop data center in a city block. */
export function CityVignette() {
  const win = (x: number, y: number) => <rect key={`${x}-${y}`} x={x} y={y} width={5} height={7} rx={1} fill={PAPER} stroke={LINE} strokeWidth={1} />;
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 200 140" className="block w-full h-auto">
      <rect x="2" y="2" width="196" height="136" rx="16" fill="var(--sky)" stroke={LINE} strokeWidth={W} />
      <rect x="14" y="52" width="38" height="78" fill="var(--cream)" stroke={LINE} strokeWidth={W} />
      <rect x="60" y="24" width="52" height="106" fill="var(--peach)" stroke={LINE} strokeWidth={W} />
      <rect x="120" y="44" width="34" height="86" fill="var(--butter)" stroke={LINE} strokeWidth={W} />
      <rect x="160" y="70" width="28" height="60" fill="var(--sage)" stroke={LINE} strokeWidth={W} />
      {[20, 34].flatMap((x) => [60, 74, 88, 102].map((y) => win(x, y)))}
      {[68, 82, 96].flatMap((x) => [34, 50, 66, 82, 98].map((y) => win(x, y)))}
      {[126, 140].flatMap((x) => [52, 68, 84, 100].map((y) => win(x, y)))}
      <rect x="76" y="14" width="20" height="10" rx="2" fill={PAPER} stroke={LINE} strokeWidth={1.6} />
      <circle cx="82" cy="19" r="1.5" fill={EMBER} /><circle cx="90" cy="19" r="1.5" fill={TEAL} />
      <path d="M2 130 H198" stroke={LINE} strokeWidth={W} />
      <path d="M10 130 V138 M190 130 V138" stroke={LINE} strokeWidth={W} />
    </svg>
  );
}

/* ---------- row bars ---------- */

/** Paired bars for one row: Site 2 on top, Site 1 below, same scale (the larger value fills the track). The winner is teal. */
export function PairBars({ v2, v1, win, label }: { v2: number; v1: number; win: "1" | "2" | "-"; label: string }) {
  const top = Math.max(v2, v1, 1e-9);
  const p = (v: number) => `${Math.max(4, (v / top) * 100)}%`;
  const fill = (who: "1" | "2") => (win === who ? TEAL : win === "-" ? "var(--line)" : "var(--butter)");
  return (
    <svg role="img" aria-label={label} focusable="false" width="100%" height="26" className="block mt-1.5 max-w-[260px]">
      <rect x="0" y="1" width={p(v2)} height="10" rx="5" fill={fill("2")} stroke={LINE} strokeWidth={1.4} />
      <rect x="0" y="15" width={p(v1)} height="10" rx="5" fill={fill("1")} stroke={LINE} strokeWidth={1.4} />
    </svg>
  );
}

/** Small teal check in a pastel disc. Decorative; the winner is also named in text. */
export const WinCheck = ({ size = 18 }: { size?: number }) => (
  <svg aria-hidden focusable="false" viewBox="0 0 24 24" width={size} height={size} className="inline-block align-[-3px] shrink-0">
    <circle cx="12" cy="12" r="10.5" fill="var(--sage)" stroke={LINE} strokeWidth={1.6} />
    <path d="M7 12.5 L10.5 16 L17 8.5" stroke="var(--good)" strokeWidth={2.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Scoreboard: one dot per scored row, teal where Lansing wins, outlined where Site 1 wins. */
export function Scoreboard({ wins, total, site1 }: { wins: number; total: number; site1: number }) {
  return (
    <svg role="img" aria-label={`Lansing wins ${wins} of ${total} rows; Site 1 wins ${site1}.`} focusable="false" viewBox={`0 0 ${total * 22} 20`} width={total * 22} height="20" className="block shrink-0">
      {Array.from({ length: total }, (_, i) => {
        const w = i < wins;
        return <circle key={i} cx={10 + i * 22} cy={10} r={8} fill={w ? TEAL : PAPER} stroke={LINE} strokeWidth={1.8} />;
      })}
    </svg>
  );
}

/** Wrapper that gives an icon a pastel disc, for the closing row. */
export const IconDisc = ({ bg, children }: { bg: string; children: ReactNode }) => (
  <span className="grid place-items-center w-[72px] h-[72px] rounded-full border-[1.5px] border-brown shrink-0" style={{ background: bg }}>{children}</span>
);

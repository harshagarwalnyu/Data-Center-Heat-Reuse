"use client";
import { useId, useState, type ReactNode } from "react";

/** Deterministic jagged line so server and client render the same torn edge. */
function tornPath(seed: number, w = 1600, h = 36, step = 14) {
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let d = `M0 ${h} L0 ${h * 0.55}`;
  for (let x = step; x <= w; x += step) d += ` L${x} ${(h * 0.3 + rnd() * h * 0.45).toFixed(1)}`;
  return `${d} L${w} ${h} Z`;
}

/** Torn-paper edge: the `fill` colour tears up into whatever sits above it. Decorative. */
export function TornEdge({ fill, seed = 7, flip = false, className = "" }: { fill: string; seed?: number; flip?: boolean; className?: string }) {
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 1600 36" preserveAspectRatio="none" className={`block w-full h-[22px] sm:h-[30px] ${className}`} style={flip ? { transform: "scaleY(-1)" } : undefined}>
      <path d={tornPath(seed + 3)} fill="rgba(59,42,30,0.12)" transform="translate(0 -3)" />
      <path d={tornPath(seed)} fill={fill} />
    </svg>
  );
}

/** Painted brush swash that sits behind a bento mock. */
export function Swash({ color, className = "", seed = 3 }: { color: string; className?: string; seed?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 400 200" className={`absolute pointer-events-none ${className}`}>
      <defs>
        <filter id={`sw${id}`} x="-10%" y="-30%" width="120%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.4" numOctaves="3" seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale="26" />
        </filter>
      </defs>
      <g filter={`url(#sw${id})`} fill={color}>
        <path d="M30 120 C80 40 180 60 230 70 C300 84 350 40 380 60 C360 110 290 120 230 130 C160 142 90 170 30 120 Z" />
        <path d="M60 160 C140 130 240 150 340 120 C320 160 220 180 140 182 C100 184 70 176 60 160 Z" opacity="0.7" />
      </g>
    </svg>
  );
}

/** Small cut-out star and leaf sprites for collages. */
export const Star = ({ x, y, s = 1, c = "#d9a63a" }: { x: number; y: number; s?: number; c?: string }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} fill={c} stroke="#fffaf0" strokeWidth="2.5" strokeLinejoin="round"
    d="M0 -18 L5 -6 L18 -5 L8 3 L11 16 L0 9 L-11 16 L-8 3 L-18 -5 L-5 -6 Z" />
);
export const Leaf = ({ x, y, r = 0, s = 1, c = "#7f9a3e" }: { x: number; y: number; r?: number; s?: number; c?: string }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M0 0 C10 -18 34 -22 46 -8 C34 6 12 8 0 0 Z" fill={c} stroke="#fffaf0" strokeWidth="2" />
    <path d="M2 -1 C16 -8 30 -10 44 -8" stroke="#4f6a24" strokeWidth="1.5" fill="none" />
  </g>
);

/** Collage for the problem section: a cut-out town-hall facade on a torn scrap of a lake map, with stars and leaves. */
export function TownHallCollage({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 520 480" className={className}>
      <defs>
        <filter id="tear" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="11" />
          <feDisplacementMap in="SourceGraphic" scale="12" />
        </filter>
        <filter id="drop" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity="0.35" />
        </filter>
        <pattern id="contours" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M0 20 C20 10 40 30 80 18 M0 44 C24 34 46 56 80 42 M0 68 C22 60 50 78 80 66" stroke="#b39b78" strokeWidth="1.2" fill="none" />
        </pattern>
        <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf3e2" />
          <stop offset="1" stopColor="#e4d3b4" />
        </linearGradient>
      </defs>

      {/* torn map scrap */}
      <g filter="url(#drop)" transform="rotate(-6 250 250)">
        <path filter="url(#tear)" d="M60 120 L430 90 L460 380 L90 420 Z" fill="#efe2c4" />
        <path filter="url(#tear)" d="M60 120 L430 90 L460 380 L90 420 Z" fill="url(#contours)" opacity="0.8" />
        <path d="M250 96 C236 160 262 220 244 280 C230 330 252 370 240 414 L282 412 C290 360 276 320 290 270 C306 210 280 150 292 94 Z" fill="#a9c6d3" stroke="#7e9fae" strokeWidth="2" />
        <circle cx="318" cy="240" r="7" fill="#c4572a" stroke="#fffaf0" strokeWidth="3" />
      </g>

      {/* green paper scrap */}
      <path filter="url(#tear)" d="M300 300 L480 280 L500 430 L330 450 Z" fill="#c9cf8f" transform="rotate(8 400 360)" />

      {/* cut-out town-hall facade */}
      <g filter="url(#drop)" transform="translate(110 130) rotate(2)">
        <g filter="url(#tear)">
          <path d="M-14 104 L130 22 L274 104 Z" fill="#fffaf0" />
          <rect x="-14" y="100" width="288" height="210" fill="#fffaf0" />
        </g>
        <path d="M0 100 L130 30 L260 100 Z" fill="url(#stone)" stroke="#a48c6c" strokeWidth="2" />
        <circle cx="130" cy="74" r="16" fill="#fffaf0" stroke="#7a5a44" strokeWidth="2.5" />
        <path d="M130 64 L130 74 L138 79" stroke="#3b2a1e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="0" y="100" width="260" height="16" fill="#d9c7a6" />
        <rect x="6" y="116" width="248" height="150" fill="url(#stone)" />
        {[24, 74, 124, 174, 224].map((x) => (
          <g key={x}>
            <rect x={x} y="122" width="14" height="140" fill="#fbf4e6" stroke="#b9a382" strokeWidth="1.5" />
            <rect x={x - 3} y="118" width="20" height="6" fill="#cdb894" />
          </g>
        ))}
        <path d="M110 262 L110 200 Q130 180 150 200 L150 262 Z" fill="#6b4630" />
        {[48, 98, 160, 198].map((x) => <rect key={x} x={x} y="150" width="16" height="30" fill="#8aa1ad" opacity="0.8" />)}
        <rect x="-4" y="262" width="268" height="12" fill="#cdb894" />
        <rect x="-12" y="274" width="284" height="12" fill="#bfa982" />
      </g>

      <Star x={88} y={96} s={1.2} />
      <Star x={460} y={150} s={0.9} />
      <Star x={430} y={70} s={0.6} c="#e8c06a" />
      <Leaf x={40} y={330} r={-30} s={1.2} />
      <Leaf x={58} y={360} r={10} s={0.9} c="#91a94b" />
      <Leaf x={420} y={440} r={-160} s={1.1} />
    </svg>
  );
}

export interface QA { q: string; a: ReactNode }

/** Plus/close accordion. Each question is a real button with aria-expanded and aria-controls. */
export function Faq({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId().replace(/:/g, "");
  return (
    <ul className="list-none m-0 p-0">
      {items.map((it, i) => {
        const on = open === i;
        return (
          <li key={i} className="border-b border-line/80">
            <h3 className="m-0 font-sans" style={{ fontFamily: "var(--font-sans)", letterSpacing: 0 }}>
              <button type="button" className="faq-q" aria-expanded={on} aria-controls={`${base}-${i}`} id={`${base}-q${i}`} onClick={() => setOpen(on ? null : i)}>
                <span>{it.q}</span>
                <svg className="faq-icon" aria-hidden width="22" height="22" viewBox="0 0 22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 3v16M3 11h16" /></svg>
              </button>
            </h3>
            <div id={`${base}-${i}`} role="region" aria-labelledby={`${base}-q${i}`} hidden={!on} className="pb-5 pr-10 text-ink2 max-w-[62ch]">
              {it.a}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

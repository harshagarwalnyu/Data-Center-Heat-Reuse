"use client";
import { useId, type ReactNode } from "react";
import { useStill } from "@/lib/motion";
import { dec, int } from "@/lib/format";

/* Inline-SVG figures for the How it works page. Colours are CSS variables so dark mode follows the site.
   Step figures use a 300-wide viewBox with 16-unit text so type stays near 14px on a 375px phone. */

const INK = "var(--ink)", INK2 = "var(--ink2)", LINE = "var(--brown)", PAPER = "var(--surface)", EMBER = "var(--ember)", TEAL = "var(--teal)";
const W = 2; // outline weight, matches the Bento diagram

const Tx = ({ x, y, size = 16, anchor = "start", weight = 600, fill = INK, children }: { x: number; y: number; size?: number; anchor?: "start" | "middle" | "end"; weight?: number; fill?: string; children: ReactNode }) => (
  <text x={x} y={y} fontSize={size} fontWeight={weight} textAnchor={anchor} fill={fill}>{children}</text>
);

function Fig({ label, w, h, max = 300, children }: { label: string; w: number; h: number; max?: number; children: ReactNode }) {
  return (
    <svg role="img" aria-label={label} viewBox={`0 0 ${w} ${h}`} className="block w-full h-auto mx-auto" style={{ maxWidth: max }}>
      {children}
    </svg>
  );
}

/** Orange arrowhead marker, id made unique per figure. */
const ArrowDef = ({ id }: { id: string }) => (
  <defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={EMBER} /></marker></defs>
);
const useMid = () => useId().replace(/:/g, "");

/* ---------- hero ---------- */

export function HeroHeat({ captureC, onsiteC, corridorC, homes }: { captureC: number; onsiteC?: number; corridorC?: number; homes: number }) {
  const id = "ha" + useMid();
  const label = `Heat flows from the servers, warm at ${captureC} degrees C, through a plate heat exchanger to the farm campus${onsiteC != null ? ` at ${onsiteC} degrees C` : ""} and to ${int(homes)} homes${corridorC != null ? ` on a ${corridorC} degrees C loop` : ""}. A tank sits beside the exchanger.`;
  const arrow = { stroke: EMBER, strokeWidth: 4, fill: "none", strokeLinecap: "round" as const, markerEnd: `url(#${id})` };
  return (
    <Fig label={label} w={400} h={240} max={460}>
      <ArrowDef id={id} />
      <g aria-hidden>
        <rect x="4" y="70" width="80" height="60" rx="12" fill={PAPER} stroke={LINE} strokeWidth={W} />
        <circle cx="18" cy="82" r="3" fill={EMBER} /><circle cx="28" cy="82" r="3" fill={TEAL} />
        <Tx x={44} y={113} size={17} weight={700} anchor="middle">Servers</Tx>
        <rect x="135" y="55" width="110" height="70" rx="12" fill="var(--butter)" stroke={LINE} strokeWidth={W} />
        <Tx x={190} y={86} size={17} weight={700} anchor="middle">Plate</Tx>
        <Tx x={190} y={106} size={17} weight={700} anchor="middle">exchanger</Tx>
        <path d="M86 82 C100 70 112 70 133 84" {...arrow} />
        <path d="M134 106 C112 118 100 118 86 108" stroke={TEAL} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="2 7" />
        <Tx x={110} y={62} size={17} weight={700} anchor="middle" fill="var(--ember-text)">{captureC} °C</Tx>
        {/* tank */}
        <path d="M190 128 V158" stroke={EMBER} strokeWidth={3} strokeDasharray="4 5" strokeLinecap="round" />
        <path d="M168 168 V212 Q168 220 190 220 Q212 220 212 212 V168" fill="var(--lake)" stroke={LINE} strokeWidth={W} />
        <ellipse cx="190" cy="168" rx="22" ry="8" fill={PAPER} stroke={LINE} strokeWidth={W} />
        <Tx x={222} y={200} size={17} weight={700}>Tank</Tx>
        {/* farm: greenhouse and fish */}
        <path d="M296 56 V36 Q340 2 384 36 V56 Z" fill="var(--sage)" stroke={LINE} strokeWidth={W} />
        <ellipse cx="338" cy="43" rx="14" ry="7" fill={TEAL} /><path d="M350 43 l9 -7 v14z" fill={TEAL} /><circle cx="330" cy="41" r="1.8" fill={PAPER} />
        <Tx x={340} y={78} size={17} weight={700} anchor="middle">Farm</Tx>
        <path d="M246 76 C270 62 280 56 294 56" {...arrow} />
        {/* homes */}
        <path d="M300 168 V148 L340 118 L380 148 V168 Z" fill="var(--peach)" stroke={LINE} strokeWidth={W} />
        <rect x="333" y="144" width="14" height="24" rx="2" fill={PAPER} stroke={LINE} strokeWidth={1.5} />
        <Tx x={340} y={194} size={17} weight={700} anchor="middle">Homes</Tx>
        <path d="M246 108 C270 140 280 152 296 154" {...arrow} />
      </g>
    </Fig>
  );
}

/* ---------- small step-card icons (64 box) ---------- */

const Ico = ({ children }: { children: ReactNode }) => (
  <svg aria-hidden focusable="false" width="56" height="56" viewBox="0 0 64 64">{children}</svg>
);

export const RackIcon = () => (
  <Ico>
    <rect x="10" y="8" width="28" height="48" rx="5" fill={PAPER} stroke={LINE} strokeWidth={W} />
    {[14, 28, 42].map((y) => (<g key={y}><rect x="15" y={y} width="18" height="8" rx="2" fill="var(--peach)" stroke={LINE} strokeWidth={1.2} /><circle cx="29" cy={y + 4} r="1.6" fill={EMBER} /></g>))}
    <path d="M44 20 C58 26 58 42 44 48" stroke={EMBER} strokeWidth={3.5} fill="none" strokeLinecap="round" />
    <path d="M42 41 L44 49 L51 45 Z" fill={EMBER} />
  </Ico>
);
export const ExchangerIcon = () => (
  <Ico>
    <rect x="16" y="12" width="34" height="40" rx="6" fill={PAPER} stroke={LINE} strokeWidth={W} />
    {[24, 33, 42].map((x) => <path key={x} d={`M${x} 17 V47`} stroke={LINE} strokeWidth={1.8} strokeLinecap="round" />)}
    <path d="M3 22 H14" stroke={EMBER} strokeWidth={3.5} strokeLinecap="round" /><path d="M11 17 L17 22 L11 27 Z" fill={EMBER} />
    <path d="M61 42 H52" stroke={TEAL} strokeWidth={3.5} strokeLinecap="round" strokeDasharray="1 5" />
  </Ico>
);
export const FarmHomesIcon = () => (
  <Ico>
    <path d="M4 40 V28 Q16 12 28 28 V40 Z" fill={PAPER} stroke={LINE} strokeWidth={W} />
    <ellipse cx="16" cy="34" rx="6" ry="3" fill={TEAL} />
    <path d="M34 40 V32 L47 20 L60 32 V40 Z" fill="var(--peach)" stroke={LINE} strokeWidth={W} />
    <path d="M2 44 H62" stroke={LINE} strokeWidth={W} strokeLinecap="round" />
    <path d="M22 52 C30 58 38 58 44 52" stroke={EMBER} strokeWidth={3} fill="none" strokeLinecap="round" />
  </Ico>
);
export const TankFlameIcon = () => (
  <Ico>
    <path d="M8 18 V50 Q8 58 24 58 Q40 58 40 50 V18" fill="var(--lake)" stroke={LINE} strokeWidth={W} />
    <ellipse cx="24" cy="18" rx="16" ry="6" fill={PAPER} stroke={LINE} strokeWidth={W} />
    <path d="M44 52 C42 44 50 40 50 32 C54 36 58 42 56 50 C56 56 46 58 44 52 Z" fill={EMBER} stroke={LINE} strokeWidth={1.6} strokeLinejoin="round" />
  </Ico>
);

/** Hand-drawn orange arrow between step cards. */
export const DrawnArrow = () => (
  <svg aria-hidden focusable="false" width="34" height="34" viewBox="0 0 34 34" className="mx-auto block">
    <path d="M17 3 C12 11 22 17 17 27" stroke={EMBER} strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M9 21 L17 30 L25 21" stroke={EMBER} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- math step figures ---------- */

/** Step 1: factor chips funnel into one heat block. */
export function HeatChain({ factors, result }: { factors: string[]; result: string }) {
  const cw = (s: string) => Math.round(s.length * 9.3 + 18);
  const rows: { s: string; x: number; w: number }[][] = [[]];
  let cx = 0;
  for (const s of factors) {
    const w = cw(s);
    if (cx + w > 300 && rows[rows.length - 1].length) { rows.push([]); cx = 0; }
    rows[rows.length - 1].push({ s, x: cx, w });
    cx += w + 8;
  }
  const shift = (r: { x: number; w: number }[]) => (300 - (r[r.length - 1].x + r[r.length - 1].w)) / 2;
  const h = rows.length * 36;
  return (
    <Fig label={`Heat available: ${factors.join(", ")} shrink into ${result}.`} w={300} h={h + 74}>
      <g aria-hidden>
        {rows.map((r, i) => (
          <g key={i} transform={`translate(${shift(r)} ${i * 36 + 2})`}>
            {r.map((c, j) => (
              <g key={j}><rect x={c.x} y={0} width={c.w} height={30} rx={15} fill={j === 0 && i === 0 ? "var(--peach)" : "var(--butter)"} stroke={LINE} strokeWidth={1.6} />
                <Tx x={c.x + c.w / 2} y={21} anchor="middle" weight={700}>{c.s}</Tx></g>
            ))}
          </g>
        ))}
        <path d={`M20 ${h + 4} L280 ${h + 4} L236 ${h + 26} L64 ${h + 26} Z`} fill="var(--peach)" opacity={0.7} />
        <rect x="10" y={h + 28} width="280" height="40" rx="12" fill="var(--peach)" stroke={LINE} strokeWidth={W} />
        <Tx x={150} y={h + 54} anchor="middle" weight={700}>{result}</Tx>
      </g>
    </Fig>
  );
}

/** Step 2: 100-cell waffle with the used share filled. */
export function Waffle({ pct }: { pct: number }) {
  const cell = 12, pitch = 14.5;
  const full = Math.floor(pct), part = pct - full;
  return (
    <Fig label={`${dec(pct, 1)} percent of the available heat is used; ${dec(100 - pct, 1)} percent still goes to the air.`} w={300} h={148}>
      <g aria-hidden>
        {Array.from({ length: 100 }, (_, i) => {
          const x = (i % 10) * pitch + 2, y = Math.floor(i / 10) * pitch + 2;
          return (
            <g key={i}>
              <rect x={x} y={y} width={cell} height={cell} rx={2.5} fill="var(--line)" />
              {i < full && <rect x={x} y={y} width={cell} height={cell} rx={2.5} fill={EMBER} />}
              {i === full && part > 0 && <rect x={x} y={y} width={cell * part} height={cell} rx={2.5} fill={EMBER} />}
            </g>
          );
        })}
        <rect x="162" y="14" width="14" height="14" rx="3" fill={EMBER} />
        <Tx x={182} y={27} weight={700}>{dec(pct, 1)}% used</Tx>
        <rect x="162" y="62" width="14" height="14" rx="3" fill="var(--line)" />
        <Tx x={182} y={75} weight={700}>{dec(100 - pct, 1)}%</Tx>
        <Tx x={182} y={95} fill={INK2}>still goes</Tx>
        <Tx x={182} y={115} fill={INK2}>to the air</Tx>
      </g>
    </Fig>
  );
}

/** Step 4: propane vs our price, saving gap highlighted. */
export function PriceBars({ propane, ours, saving }: { propane: number; ours: number; saving: number }) {
  const full = 280, w2 = full * (ours / propane);
  const hid = "hatch" + useMid();
  return (
    <Fig label={`Propane heat costs $${dec(propane, 1)} per MWh. Our price is $${dec(ours, 1)}. A typical home saves $${int(saving)} a year.`} w={300} h={142}>
      <defs><pattern id={hid} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="var(--peach)" /><path d="M0 0 V7" stroke={EMBER} strokeWidth="3" /></pattern></defs>
      <g aria-hidden>
        <Tx x={0} y={18} weight={700}>Propane ${dec(propane, 1)}</Tx>
        <rect x="0" y="26" width={full} height="24" rx="6" fill="var(--lake)" stroke={LINE} strokeWidth={1.6} />
        <Tx x={0} y={78} weight={700}>Our price ${dec(ours, 1)}</Tx>
        <rect x="0" y="86" width={w2} height="24" rx="6" fill="var(--sage)" stroke={LINE} strokeWidth={1.6} />
        <rect x={w2} y="86" width={full - w2} height="24" rx="4" fill={`url(#${hid})`} stroke={EMBER} strokeWidth={1.6} strokeDasharray="4 3" />
        <Tx x={0} y={134} weight={700} fill="var(--ember-text)">Home saves ${int(saving)} a year</Tx>
      </g>
    </Fig>
  );
}

/** Step 5: source vs delivery temperature, reacts to the sliders. */
export function ThermoPair({ src, sink, cop }: { src: number; sink: number; cop: number }) {
  const still = useStill();
  const id = "ha" + useMid();
  const y = (t: number) => 120 - 110 * (Math.max(0, Math.min(80, t)) / 80);
  const lift = sink - src;
  const tr = still ? undefined : "all 0.25s ease-out";
  const tube = (cx: number, t: number, color: string) => (
    <g>
      <rect x={cx - 8} y={10} width={16} height={116} rx={8} fill={PAPER} stroke={LINE} strokeWidth={W} />
      <rect x={cx - 5} y={y(t)} width={10} height={130 - y(t)} rx={3} fill={color} style={{ transition: tr }} />
      <circle cx={cx} cy={134} r={13} fill={color} stroke={LINE} strokeWidth={W} />
    </g>
  );
  const ax = 205, y1 = y(src), y2 = y(sink);
  return (
    <Fig label={`Heat pump lift: source ${src} degrees C, delivery ${sink} degrees C, a lift of ${lift} degrees and a COP of ${dec(cop, 2)}.`} w={300} h={196}>
      <ArrowDef id={id} />
      <g aria-hidden>
        {tube(50, src, TEAL)}
        {tube(130, sink, EMBER)}
        <path d={`M62 ${y1} H${ax + 8}`} stroke={TEAL} strokeWidth={1.6} strokeDasharray="3 4" style={{ transition: tr }} />
        <path d={`M142 ${y2} H${ax + 8}`} stroke={EMBER} strokeWidth={1.6} strokeDasharray="3 4" style={{ transition: tr }} />
        {lift > 4 && <path d={`M${ax} ${y1} V${y2 + 8}`} stroke={EMBER} strokeWidth={4} strokeLinecap="round" markerEnd={`url(#${id})`} style={{ transition: tr }} />}
        <Tx x={ax + 16} y={(y1 + y2) / 2 - 2} weight={700}>{lift > 4 ? "lift" : "no lift"}</Tx>
        {lift > 4 && <Tx x={ax + 16} y={(y1 + y2) / 2 + 18} weight={700} fill="var(--ember-text)">{lift} °C</Tx>}
        <Tx x={50} y={170} anchor="middle" fill={INK2}>Source</Tx><Tx x={50} y={188} anchor="middle" weight={700}>{src} °C</Tx>
        <Tx x={130} y={170} anchor="middle" fill={INK2}>Delivery</Tx><Tx x={130} y={188} anchor="middle" weight={700}>{sink} °C</Tx>
      </g>
    </Fig>
  );
}

/** Step 6: farm vs homes vs blended cost of heat against propane. */
export function LcohBars({ farm, homes, blend, propane }: { farm: number; homes: number; blend: number; propane: number }) {
  const base = 168, top = Math.max(farm, homes, blend, propane), k = 130 / top, yy = (v: number) => base - v * k;
  const bars = [{ l: "Farm campus", v: farm, c: "var(--sage)" }, { l: "Homes", v: homes, c: "var(--peach)" }, { l: "Blended", v: blend, c: "var(--butter)" }];
  return (
    <Fig label={`Cost of heat per MWh at 7 percent: farm campus $${int(farm)}, homes $${int(homes)}, blended $${int(blend)}. Propane is $${int(propane)}.`} w={300} h={200}>
      <g aria-hidden>
        <path d={`M0 ${base} H300`} stroke={LINE} strokeWidth={W} strokeLinecap="round" />
        {bars.map((b, i) => (
          <g key={b.l}>
            <rect x={18 + i * 100} y={yy(b.v)} width={64} height={b.v * k} rx={6} fill={b.c} stroke={LINE} strokeWidth={1.6} />
            <Tx x={50 + i * 100} y={Math.abs(yy(b.v) - yy(propane)) < 22 ? yy(b.v) + 20 : yy(b.v) - 6} anchor="middle" weight={700}>${int(b.v)}</Tx>
            <Tx x={50 + i * 100} y={192} anchor="middle" fill={INK2}>{b.l}</Tx>
          </g>
        ))}
        <path d={`M0 ${yy(propane)} H300`} stroke={EMBER} strokeWidth={2.5} strokeDasharray="6 5" strokeLinecap="round" />
        <Tx x={2} y={yy(propane) - 6} weight={700} fill="var(--ember-text)">propane ${int(propane)}</Tx>
      </g>
    </Fig>
  );
}

/** Step 7: mini waterfall, corridor gap + on-site surplus = whole-project gap (all in $M, gap values negative). */
export function GapWaterfall({ corridor, surplus, gap }: { corridor: number; surplus: number; gap: number }) {
  const zero = 34, k = 120 / Math.max(corridor, 1e-6), m = (v: number) => `${v < 0 ? "−" : "+"}$${dec(Math.abs(v), 1)}M`;
  const c = corridor * k, s = surplus * k, g = gap * k;
  return (
    <Fig label={`Funding gap in millions: corridor homes ${m(-corridor)}, farm surplus ${m(surplus)}, whole-project gap ${m(-gap)}.`} w={300} h={204}>
      <g aria-hidden>
        <path d={`M0 ${zero} H300`} stroke={LINE} strokeWidth={1.4} strokeDasharray="4 4" />
        <rect x={18} y={zero} width={64} height={c} rx={6} fill="var(--peach)" stroke={LINE} strokeWidth={1.6} />
        <Tx x={50} y={zero - 8} anchor="middle" weight={700}>{m(-corridor)}</Tx>
        <rect x={118} y={zero + c - s} width={64} height={s} rx={6} fill="var(--sage)" stroke={LINE} strokeWidth={1.6} />
        <Tx x={150} y={zero + c + 20} anchor="middle" weight={700}>{m(surplus)}</Tx>
        <rect x={218} y={zero} width={64} height={g} rx={6} fill="var(--butter)" stroke={LINE} strokeWidth={W} />
        <Tx x={250} y={zero - 8} anchor="middle" weight={700} fill="var(--ember-text)">{m(-gap)}</Tx>
        <path d={`M82 ${zero + c} H118 M182 ${zero + c - s} H218`} stroke={LINE} strokeWidth={1.2} strokeDasharray="2 3" />
        <Tx x={50} y={196} anchor="middle" fill={INK2}>Homes</Tx>
        <Tx x={150} y={196} anchor="middle" fill={INK2}>Farm</Tx>
        <Tx x={250} y={196} anchor="middle" fill={INK2}>Gap</Tx>
      </g>
    </Fig>
  );
}

/** Step 8: a row of little cars, each worth `per` cars. */
export function CarsRow({ cars, per = 250, tonnes }: { cars: number; per?: number; tonnes: number }) {
  const n = cars / per, full = Math.floor(n), part = n - full, count = Math.ceil(n);
  const cid = "cp" + useMid();
  const car = (x: number, clip?: string) => (
    <g transform={`translate(${x} 4)`} clipPath={clip}>
      <path d="M1 12 L3 5 Q4 2 8 2 H16 Q20 2 21 5 L23 12 V15 H1 Z" fill={EMBER} stroke={LINE} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M6 5 H11 V9 H5 Z M13 5 H17 L19 9 H13 Z" fill={PAPER} />
      <circle cx="7" cy="15" r="2.8" fill={LINE} /><circle cx="18" cy="15" r="2.8" fill={LINE} />
    </g>
  );
  return (
    <Fig label={`${int(tonnes)} tonnes of CO2 avoided a year is about ${int(cars)} cars off the road. Each car icon stands for ${int(per)} cars.`} w={300} h={86}>
      <g aria-hidden>
        <defs><clipPath id={cid}><rect x="0" y="0" width={24 * part} height="24" /></clipPath></defs>
        {Array.from({ length: count }, (_, i) => (i < full ? <g key={i}>{car(i * 27)}</g> : <g key={i} transform={`translate(${i * 27} 0)`}>{car(0, `url(#${cid})`)}</g>))}
        <Tx x={0} y={52} fill={INK2}>Each car icon = {int(per)} cars</Tx>
        <Tx x={0} y={74} weight={700}>{int(cars)} cars’ worth of CO₂ a year</Tx>
      </g>
    </Fig>
  );
}

/** Step 9: P10 to P90 range with the P50 marker and propane to the right. */
export function RangeBar({ p10, p50, p90, propane, runs }: { p10: number; p50: number; p90: number; propane: number; runs: number }) {
  const lo = Math.floor(p10 - 22), hi = Math.ceil(Math.max(p90, propane) + 8);
  const x = (t: number) => 12 + (276 * (t - lo)) / (hi - lo);
  return (
    <Fig label={`Cost of heat per MWh over ${runs} runs: P10 $${dec(p10, 1)}, P50 $${dec(p50, 1)}, P90 $${dec(p90, 1)}. Propane is $${dec(propane, 1)}, to the right of the whole range.`} w={300} h={116}>
      <g aria-hidden>
        <path d="M12 60 H288" stroke={LINE} strokeWidth={1.4} strokeLinecap="round" />
        <rect x={x(p10)} y={46} width={x(p90) - x(p10)} height={28} rx={8} fill="var(--sage)" stroke={LINE} strokeWidth={W} />
        <path d={`M${x(p50)} 40 V80`} stroke={LINE} strokeWidth={4} strokeLinecap="round" />
        <Tx x={x(p50)} y={30} anchor="middle" weight={700}>P50 ${dec(p50, 1)}</Tx>
        <Tx x={x(p10) + 4} y={102} anchor="end" fill={INK2}>P10 ${dec(p10, 1)}</Tx>
        <Tx x={x(p90) - 4} y={102} anchor="start" fill={INK2}>P90 ${dec(p90, 1)}</Tx>
        <path d={`M${x(propane)} 36 V84`} stroke={EMBER} strokeWidth={3} strokeDasharray="6 4" strokeLinecap="round" />
        <Tx x={288} y={30} anchor="end" weight={700} fill="var(--ember-text)">propane ${dec(propane, 1)}</Tx>
      </g>
    </Fig>
  );
}

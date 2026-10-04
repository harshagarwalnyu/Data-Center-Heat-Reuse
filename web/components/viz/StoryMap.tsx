"use client";
import { motion } from "framer-motion";
import type { Offtaker } from "@/lib/types";
import { BOUNDS, LAKE, ONSITE_R_KM, PLANT, ROUTE, TOWN, TOWN_R_KM, makeProjector, type LonLat } from "@/lib/geo";
import { ringColor } from "../ui";

export const STORY_ASPECT = (() => { const { width, height } = makeProjector(900); return width / height; })();
const W = 900;
const spring = { type: "spring", stiffness: 260, damping: 15 } as const;

/**
 * The ring map as a pure-SVG scene that builds up ring by ring.
 * `n` = how many rings are shown (0 to 3). With `still` (reduced motion) everything renders at its final state with no motion.
 * `stagger` spaces the three rings out when the section is stacked on a phone and nothing pins.
 */
export function StoryMap({ offtakers: all, n, still, stagger }: { offtakers: Offtaker[]; n: number; still: boolean; stagger: boolean }) {
  const offtakers = all.filter((o) => o.lon >= BOUNDS[0][0] && o.lon <= BOUNDS[1][0] && o.lat >= BOUNDS[0][1] && o.lat <= BOUNDS[1][1]);
  const { project, height: H, pxPerKm } = makeProjector(W);
  const line = (pts: LonLat[]) => pts.map((p, i) => `${i ? "L" : "M"}${project(p)[0].toFixed(1)},${project(p)[1].toFixed(1)}`).join(" ");
  const lake = line(LAKE) + " Z";
  const corridorPts = ROUTE.slice(0, 4);
  const townPts = ROUTE.slice(3);
  const [px, py] = project(PLANT);
  const [tx, ty] = project(TOWN);
  const shown = (i: number) => (still ? true : n > i);
  const delay = (i: number) => (still || !stagger ? 0 : i * 0.45);
  const draw = (on: boolean, i: number) => ({
    strokeDasharray: 1,
    strokeDashoffset: on ? 0 : 1,
    transition: still ? "none" : `stroke-dashoffset 0.9s ease-out ${delay(i) + 0.15}s`,
  });
  const pop = (i: number) => ({
    initial: still ? false : { scale: 0, opacity: 0 },
    animate: shown(i) ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 },
    transition: still ? { duration: 0 } : { ...spring, delay: delay(i) },
    style: { transformBox: "fill-box" as const, transformOrigin: "center" as const },
  });
  const label = (text: string, at: LonLat, dx: number, dy: number, i: number | null) => {
    const [x, y] = project(at);
    const on = i === null || shown(i);
    return (
      <g key={text} transform={`translate(${x + dx},${y + dy})`} style={{ opacity: on ? 1 : 0, transition: still ? "none" : `opacity .4s ease-out ${i === null ? 0 : delay(i) + 0.3}s` }}>
        <rect x={-10} y={-30} width={text.length * 17 + 22} height={42} rx={10} fill="var(--bg)" opacity="0.92" />
        <text fontSize="30" fontWeight="700" fill="var(--ink)">{text}</text>
      </g>
    );
  };
  const dots = (ring: string, i: number) =>
    offtakers.filter((o) => o.ring === ring).map((o, k) => {
      const [x, y] = project([o.lon, o.lat]);
      return (
        <motion.circle key={o.id} cx={x} cy={y} r="10" fill="var(--bg)" stroke={ringColor(ring)} strokeWidth="5"
          initial={still ? false : { scale: 0 }} animate={{ scale: shown(i) ? 1 : 0 }}
          transition={still ? { duration: 0 } : { ...spring, delay: delay(i) + 0.25 + k * 0.04 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}><title>{o.name}</title></motion.circle>
      );
    });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Schematic map: the data center on Cayuga Lake's east shore, an on-site campus ring, a corridor of homes along the road, and the town center ring to the south-east, which is not built." className="w-full h-full block" style={{ background: "var(--surface2)" }}>
      <path d={lake} fill="var(--teal)" opacity="0.22" />
      <text x={60} y={H * 0.45} fontSize="34" fill="var(--teal-text)" fontStyle="italic" fontWeight="600">Cayuga Lake</text>

      <motion.g {...pop(0)}>
        <circle cx={px} cy={py} r={ONSITE_R_KM * pxPerKm} fill="var(--ember)" opacity="0.28" />
        <circle cx={px} cy={py} r={ONSITE_R_KM * pxPerKm} fill="none" stroke="var(--ember)" strokeWidth="3" />
      </motion.g>
      {dots("onsite", 0)}

      <path d={line(corridorPts)} stroke="var(--teal)" strokeWidth={ONSITE_R_KM * pxPerKm * 0.9} strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: shown(1) ? 0.28 : 0, transition: still ? "none" : `opacity .6s ease-out ${delay(1) + 0.4}s` }} />
      <path d={line(corridorPts)} pathLength={1} stroke="var(--teal)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" style={draw(shown(1), 1)} />
      {dots("corridor", 1)}

      <path d={line(townPts)} pathLength={1} stroke="var(--violet)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" style={draw(shown(2), 2)} />
      <motion.g {...pop(2)}>
        <circle cx={tx} cy={ty} r={TOWN_R_KM * pxPerKm} fill="var(--violet)" opacity="0.25" />
        <circle cx={tx} cy={ty} r={TOWN_R_KM * pxPerKm} fill="none" stroke="var(--violet)" strokeWidth="3" strokeDasharray="10 7" />
      </motion.g>
      {dots("town", 2)}

      <path d={`M${px},${py - 12} l11,19 h-22 z`} fill="var(--navy)" />
      {label("Data center", PLANT, -120, -44, null)}
      {label("Corridor homes", [-76.59, 42.592], -40, -34, 1)}
      {label("Town center", TOWN, -110, 100, 2)}

      <motion.g
        initial={still ? false : { scale: 2.2, rotate: -26, opacity: 0 }}
        animate={shown(2) ? { scale: 1, rotate: -9, opacity: 1 } : { scale: 2.2, rotate: -26, opacity: 0 }}
        transition={still ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 11, delay: delay(2) + 0.6 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <g transform={`translate(${tx},${ty})`}>
          <rect x={-128} y={-34} width={256} height={68} rx={10} fill="var(--bg)" stroke="var(--ember-text)" strokeWidth="6" />
          <text textAnchor="middle" y={13} fontSize="40" fontWeight="800" letterSpacing="5" fill="var(--ember-text)">NOT BUILT</text>
        </g>
      </motion.g>

      <g transform={`translate(40,${H - 30})`}>
        <line x1="0" x2={5 * pxPerKm} y1="0" y2="0" stroke="var(--ink)" strokeWidth="3" />
        <text x={5 * pxPerKm + 8} y="8" fontSize="26" fill="var(--ink)">5 km</text>
      </g>
    </svg>
  );
}

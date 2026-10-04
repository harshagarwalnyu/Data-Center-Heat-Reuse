"use client";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import type { Offtaker } from "@/lib/types";
import { BOUNDS, LAKE, ONSITE_R_KM, PLANT, ROUTE, TOWN, TOWN_R_KM, makeProjector, type LonLat } from "@/lib/geo";
import { HOME_VIEW, MAX_ZOOM, MIN_ZOOM, clampView, panBy, wheelFactor, zoomAt, type Box, type View } from "@/lib/interact";
import { dec, int } from "@/lib/format";
import { ringColor } from "../ui";
import { TipCard } from "../Tooltip";

export const STORY_ASPECT = (() => { const { width, height } = makeProjector(900); return width / height; })();
const W = 900;
const spring = { type: "spring", stiffness: 260, damping: 15 } as const;
const TIP_ID = "ring-map-tip";
const DRAG_PX = 5;

export type RingId = "onsite" | "corridor" | "town";
/** Everything a ring tooltip shows, already formatted by the caller from site2.json. */
export interface RingTip { id: RingId; name: string; gwh: string; lcoh: string | null; verdict: string; pipeKm: string }
export interface DcTip { itLoadMW: string; heatGWh: string }

const demand = (mwh: number) => (mwh >= 1000 ? `${dec(mwh / 1000, 1)} GWh` : `${int(mwh)} MWh`);
const typeLabel = (t: string) => t.replace(/_/g, " ");

/**
 * The ring map as a pure-SVG scene that builds up ring by ring.
 * `n` = how many rings are shown (0 to 3). With `still` (reduced motion) everything renders at its final state with no motion.
 * `stagger` spaces the three rings out when the section is stacked on a phone and nothing pins.
 * Interactive: hover or focus for details, click a ring to pin it (`selected`), drag to pan, Ctrl or Cmd + wheel to zoom.
 */
export function StoryMap({ offtakers: all, n, still, stagger, townBuilt = false, rings, dc, selected = null, onSelect }: {
  offtakers: Offtaker[]; n: number; still: boolean; stagger: boolean; townBuilt?: boolean;
  rings: RingTip[]; dc: DcTip | null; selected?: RingId | null; onSelect?: (id: RingId | null) => void;
}) {
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
      <g key={text} pointerEvents="none" transform={`translate(${x + dx},${y + dy})`} style={{ opacity: on ? 1 : 0, transition: still ? "none" : `opacity .4s ease-out ${i === null ? 0 : delay(i) + 0.3}s` }}>
        <rect x={-10} y={-30} width={text.length * 17 + 22} height={42} rx={10} fill="var(--bg)" opacity="0.92" />
        <text fontSize="30" fontWeight="700" fill="var(--ink)">{text}</text>
      </g>
    );
  };

  // ---- interaction state ----
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 600, h: 600 / STORY_ASPECT });
  const [view, setView] = useState<View>(HOME_VIEW);
  const viewRef = useRef<View>(HOME_VIEW);
  const [hover, setHover] = useState<{ key: string; anchor: Box; node: ReactNode } | null>(null);
  const [dragging, setDragging] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const drag = useRef<{ id: number; sx: number; sy: number; lx: number; ly: number; active: boolean; touch: boolean } | null>(null);
  const moved = useRef(false);

  const apply = useCallback((v: View) => { const c = clampView(v, W, H); viewRef.current = c; setView(c); }, [H]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth || 600, h: el.clientHeight || 600 / STORY_ASPECT });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // Ctrl/Cmd + wheel (and trackpad pinch) zooms the map; a plain wheel still scrolls the page.
    const wheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const r = el.getBoundingClientRect();
      const v = viewRef.current;
      const next = clampView(zoomAt(v, v.k * wheelFactor(e.deltaY), ((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H, W, H), W, H);
      // At min or max zoom the gesture is left to the browser (page zoom).
      if (next.k === v.k && next.x === v.x && next.y === v.y) return;
      e.preventDefault();
      apply(next);
    };
    // Two fingers belong to the map (pinch / pan); one finger keeps scrolling the page.
    const touch = (e: TouchEvent) => { if (e.touches.length >= 2) e.preventDefault(); };
    el.addEventListener("wheel", wheel, { passive: false });
    el.addEventListener("touchmove", touch, { passive: false });
    return () => { ro.disconnect(); el.removeEventListener("wheel", wheel); el.removeEventListener("touchmove", touch); };
  }, [apply, H]);

  useEffect(() => {
    if (!hover && !selected) return;
    const esc = (e: KeyboardEvent | globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setHover(null);
      if (selected) onSelect?.(null);
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [hover, selected, onSelect]);

  // viewBox point to container pixels, under the current view
  const toLocal = (pt: [number, number]): Box => ({ x: ((pt[0] * view.k + view.x) / W) * size.w, y: ((pt[1] * view.k + view.y) / H) * size.h, w: 0, h: 0 });
  const eventBox = (e: RPointerEvent) => { const r = box.current!.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, w: 0, h: 0 }; };
  const bandW = ONSITE_R_KM * pxPerKm * 0.9;
  const unitPx = (size.w / W) * view.k; // screen pixels per viewBox unit
  const hitR = (r: number) => Math.max(r, 13 / unitPx); // every target is at least ~26px across

  const ringNode = (id: RingId) => {
    const r = rings.find((x) => x.id === id);
    if (!r) return null;
    return (
      <>
        <b>{r.name}</b>
        <div className="num">{r.gwh} GWh a year{r.lcoh ? ` · ${r.lcoh} per MWh at 7%` : ""}</div>
        <div className="num">{r.pipeKm} km of pipe</div>
        <div style={{ marginTop: 4, fontWeight: 700, color: id === "town" ? "var(--ember-text)" : id === "onsite" ? "var(--teal-text)" : "var(--ink)" }}>{r.verdict}</div>
      </>
    );
  };
  // Where a pinned or focused ring's tooltip hangs: the ring's top edge and its height, so a flipped tip clears the whole ring.
  const ringAt: Record<RingId, { x: number; y: number; h: number }> = {
    onsite: { x: px, y: py - ONSITE_R_KM * pxPerKm, h: 2 * ONSITE_R_KM * pxPerKm },
    corridor: { x: project(ROUTE[2])[0], y: project(ROUTE[2])[1] - bandW / 2, h: bandW },
    town: { x: tx, y: ty - TOWN_R_KM * pxPerKm, h: 2 * TOWN_R_KM * pxPerKm },
  };
  const ringBox = (id: RingId): Box => { const a = ringAt[id]; const t = toLocal([a.x, a.y]); return { ...t, h: (a.h / H) * view.k * size.h }; };
  const ringAria = (id: RingId) => {
    const r = rings.find((x) => x.id === id);
    return r ? `${r.name}: ${r.gwh} GWh a year${r.lcoh ? `, ${r.lcoh} per MWh at 7%` : ""}, ${r.verdict}, ${r.pipeKm} km of pipe` : id;
  };
  const show = (key: string, anchor: Box, node: ReactNode) => setHover({ key, anchor, node });
  const hide = (key: string) => setHover((h) => (h?.key === key ? null : h));
  const stopTouch = useRef(false);

  const ringHit = (id: RingId, i: number) => ({
    role: "button" as const,
    tabIndex: shown(i) ? 0 : -1,
    "aria-label": ringAria(id),
    "aria-pressed": selected === id,
    "aria-describedby": hover?.key === id || (!hover && selected === id) ? TIP_ID : undefined,
    pointerEvents: shown(i) ? ("auto" as const) : ("none" as const),
    style: { cursor: "pointer" },
    onPointerEnter: (e: RPointerEvent) => { if (e.pointerType === "mouse" && !dragging) show(id, eventBox(e), ringNode(id)); },
    onPointerLeave: () => hide(id),
    onFocus: () => { if (!stopTouch.current) show(id, ringBox(id), ringNode(id)); },
    onBlur: () => hide(id),
    onPointerDown: (e: RPointerEvent) => { stopTouch.current = e.pointerType !== "mouse"; },
    onClick: () => { if (moved.current) return; setHover(null); onSelect?.(selected === id ? null : id); },
    onKeyDown: (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onSelect?.(selected === id ? null : id); } },
  });
  const on = (id: RingId) => hover?.key === id || selected === id;

  const dotNodes = (o: Offtaker) => (<><b>{o.name}</b><div className="num">{typeLabel(o.type)} · {demand(o.annual_MWh)} of heat a year</div></>);
  const dots = (ring: string, i: number) =>
    offtakers.filter((o) => o.ring === ring).map((o, k) => {
      const [x, y] = project([o.lon, o.lat]);
      const live = hover?.key === o.id;
      return (
        <g key={o.id} role="img" tabIndex={-1} aria-label={`${o.name}, ${typeLabel(o.type)}, ${demand(o.annual_MWh)} of heat a year`} aria-describedby={live ? TIP_ID : undefined}
          pointerEvents={shown(i) ? "auto" : "none"} style={{ cursor: "default" }}
          onPointerEnter={(e) => { if (e.pointerType === "mouse" && !dragging) show(o.id, toLocal([x, y - 12]), dotNodes(o)); }} onPointerLeave={() => hide(o.id)}
          onFocus={() => show(o.id, toLocal([x, y - 12]), dotNodes(o))} onBlur={() => hide(o.id)}>
          <circle cx={x} cy={y} r={hitR(10)} fill="transparent" />
          <motion.circle cx={x} cy={y} r={live ? 13 : 10} fill="var(--bg)" stroke={ringColor(ring)} strokeWidth={live ? 7 : 5}
            initial={still ? false : { scale: 0 }} animate={{ scale: shown(i) ? 1 : 0 }}
            transition={still ? { duration: 0 } : { ...spring, delay: delay(i) + 0.25 + k * 0.04 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        </g>
      );
    });

  // ---- pointer drag (mouse and one-finger horizontal) and two-finger pinch ----
  const down = (e: RPointerEvent<SVGSVGElement>) => {
    moved.current = false;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, lx: e.clientX, ly: e.clientY, active: false, touch: e.pointerType !== "mouse" };
    else drag.current = null;
  };
  const move = (e: RPointerEvent<SVGSVGElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    // A mouse released outside the map never fired pointerup here; drop the stale press.
    if (e.pointerType === "mouse" && e.buttons === 0) { pointers.current.delete(e.pointerId); if (drag.current?.id === e.pointerId) drag.current = null; return; }
    const cur = { x: e.clientX, y: e.clientY };
    const r = box.current!.getBoundingClientRect();
    const ux = W / r.width;
    if (pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const d0 = Math.hypot(a.x - b.x, a.y - b.y);
      pointers.current.set(e.pointerId, cur);
      const [c, d] = [...pointers.current.values()];
      const d1 = Math.hypot(c.x - d.x, c.y - d.y);
      const m0 = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, m1 = { x: (c.x + d.x) / 2, y: (c.y + d.y) / 2 };
      let v = viewRef.current;
      if (d0 > 0) v = zoomAt(v, v.k * (d1 / d0), (m1.x - r.left) * ux, (m1.y - r.top) * ux, W, H);
      apply(panBy(v, (m1.x - m0.x) * ux, (m1.y - m0.y) * ux, W, H));
      moved.current = true;
      setHover(null);
      return;
    }
    pointers.current.set(e.pointerId, cur);
    const g = drag.current;
    if (!g || g.id !== e.pointerId) return;
    if (!g.active) {
      const tx0 = Math.abs(e.clientX - g.sx), ty0 = Math.abs(e.clientY - g.sy);
      if (Math.hypot(tx0, ty0) < DRAG_PX || viewRef.current.k <= MIN_ZOOM) return;
      // On touch only a clearly horizontal drag pans; a vertical swipe is the page's.
      if (g.touch && tx0 < ty0 * 1.2) return;
      g.active = true;
      moved.current = true;
      setDragging(true);
      setHover(null);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    apply(panBy(viewRef.current, (e.clientX - g.lx) * ux, (e.clientY - g.ly) * ux, W, H));
    g.lx = e.clientX; g.ly = e.clientY;
  };
  const up = (e: RPointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    if (drag.current?.id === e.pointerId) drag.current = null;
    if (pointers.current.size === 0) setDragging(false);
  };

  const zoomBy = (f: number) => apply(zoomAt(viewRef.current, viewRef.current.k * f, W / 2, H / 2, W, H));
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = 60;
    const v = viewRef.current;
    const k = e.key;
    if (k === "ArrowLeft") apply(panBy(v, step, 0, W, H));
    else if (k === "ArrowRight") apply(panBy(v, -step, 0, W, H));
    else if (k === "ArrowUp") apply(panBy(v, 0, step, W, H));
    else if (k === "ArrowDown") apply(panBy(v, 0, -step, W, H));
    else if (k === "+" || k === "=") zoomBy(1.4);
    else if (k === "-" || k === "_") zoomBy(1 / 1.4);
    else if (k === "0") apply(HOME_VIEW);
    else return;
    e.preventDefault();
  };

  const shownTip = hover ?? (selected ? { key: selected, anchor: ringBox(selected), node: ringNode(selected) } : null);
  const atHome = view.k === 1 && view.x === 0 && view.y === 0;

  return (
    <div ref={box} className="relative w-full h-full overflow-hidden" tabIndex={0} role="group" aria-label="Interactive ring map. Arrow keys pan, plus and minus zoom, Escape clears the pinned ring." onKeyDown={key}>
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`Schematic map: the data center on Cayuga Lake's east shore, an on-site campus ring, a corridor of homes along the road, and the town center ring to the south-east${townBuilt ? "." : ", which is not built."}`}
        className="w-full h-full block select-none" style={{ background: "var(--surface2)", touchAction: "pan-y", cursor: dragging ? "grabbing" : view.k > 1 ? "grab" : "default" }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
          <path d={lake} fill="var(--teal)" opacity="0.22" />
          <text x={60} y={H * 0.45} fontSize="34" fill="var(--teal-text)" fontStyle="italic" fontWeight="600">Cayuga Lake</text>

          <g {...ringHit("onsite", 0)}>
            <motion.g {...pop(0)}>
              <circle cx={px} cy={py} r={ONSITE_R_KM * pxPerKm} fill="var(--ember)" opacity={on("onsite") ? 0.42 : 0.28} />
              <circle cx={px} cy={py} r={ONSITE_R_KM * pxPerKm} fill="none" stroke="var(--ember)" strokeWidth={on("onsite") ? 6 : 3} />
              {selected === "onsite" && <circle cx={px} cy={py} r={ONSITE_R_KM * pxPerKm + 12} fill="none" stroke="var(--ink)" strokeWidth="4" strokeDasharray="14 9" />}
            </motion.g>
            <circle cx={px} cy={py} r={ONSITE_R_KM * pxPerKm} fill="transparent" />
          </g>
          {dots("onsite", 0)}

          <g {...ringHit("corridor", 1)}>
            {selected === "corridor" && <path d={line(corridorPts)} stroke="var(--ink)" strokeWidth={bandW + 18} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.2" />}
            <path d={line(corridorPts)} stroke="var(--teal)" strokeWidth={bandW} strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: shown(1) ? (on("corridor") ? 0.42 : 0.28) : 0, transition: still ? "none" : `opacity .6s ease-out ${delay(1) + 0.4}s` }} />
            <path d={line(corridorPts)} pathLength={1} stroke="var(--teal)" strokeWidth={on("corridor") ? 7 : 4} strokeLinecap="round" strokeLinejoin="round" fill="none" style={draw(shown(1), 1)} />
            <path d={line(corridorPts)} stroke="transparent" strokeWidth={bandW} strokeLinecap="round" strokeLinejoin="round" fill="none" pointerEvents={shown(1) ? "stroke" : "none"} />
          </g>
          {dots("corridor", 1)}

          <g {...ringHit("town", 2)}>
            <path d={line(townPts)} pathLength={1} stroke="var(--violet)" strokeWidth={on("town") ? 7 : 4} strokeLinecap="round" strokeLinejoin="round" fill="none" style={draw(shown(2), 2)} />
            <motion.g {...pop(2)}>
              <circle cx={tx} cy={ty} r={TOWN_R_KM * pxPerKm} fill="var(--violet)" opacity={on("town") ? 0.4 : 0.25} />
              <circle cx={tx} cy={ty} r={TOWN_R_KM * pxPerKm} fill="none" stroke="var(--violet)" strokeWidth={on("town") ? 6 : 3} strokeDasharray="10 7" />
              {selected === "town" && <circle cx={tx} cy={ty} r={TOWN_R_KM * pxPerKm + 12} fill="none" stroke="var(--ink)" strokeWidth="4" strokeDasharray="14 9" />}
            </motion.g>
            <circle cx={tx} cy={ty} r={TOWN_R_KM * pxPerKm} fill="transparent" />
          </g>
          {dots("town", 2)}

          <g role="img" tabIndex={0} aria-label={dc ? `Data center: ${dc.itLoadMW} MW IT load, ${dc.heatGWh} GWh of heat available a year` : "Data center"} aria-describedby={hover?.key === "dc" ? TIP_ID : undefined}
            onPointerEnter={(e) => { if (dc && e.pointerType === "mouse" && !dragging) show("dc", toLocal([px, py - 14]), dcNode(dc)); }} onPointerLeave={() => hide("dc")}
            onFocus={() => dc && show("dc", toLocal([px, py - 14]), dcNode(dc))} onBlur={() => hide("dc")}>
            <circle cx={px} cy={py} r={hitR(18)} fill="transparent" />
            <path d={`M${px},${py - 12} l11,19 h-22 z`} fill="var(--navy)" stroke={hover?.key === "dc" ? "var(--ink)" : "none"} strokeWidth="4" />
          </g>
          {label("Data center", PLANT, -120, -44, null)}
          {label("Corridor homes", [-76.59, 42.592], -40, -34, 1)}
          {label("Town center", TOWN, -110, 100, 2)}

          {!townBuilt && <motion.g
            pointerEvents="none"
            initial={still ? false : { scale: 2.2, rotate: -26, opacity: 0 }}
            animate={shown(2) ? { scale: 1, rotate: -9, opacity: 1 } : { scale: 2.2, rotate: -26, opacity: 0 }}
            transition={still ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 11, delay: delay(2) + 0.6 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <g transform={`translate(${tx},${ty})`}>
              <rect x={-128} y={-34} width={256} height={68} rx={10} fill="var(--bg)" stroke="var(--ember-text)" strokeWidth="6" />
              <text textAnchor="middle" y={13} fontSize="40" fontWeight="800" letterSpacing="5" fill="var(--ember-text)">NOT BUILT</text>
            </g>
          </motion.g>}

          <g transform={`translate(40,${H - 30})`} pointerEvents="none">
            <line x1="0" x2={5 * pxPerKm} y1="0" y2="0" stroke="var(--ink)" strokeWidth="3" />
            <text x={5 * pxPerKm + 8} y="8" fontSize="26" fill="var(--ink)">5 km</text>
          </g>
        </g>
      </svg>

      <div className="absolute right-2 bottom-2 flex gap-1.5">
        <button type="button" className="map-btn" aria-label="Zoom in" title="Zoom in. Ctrl or Cmd + scroll, or pinch, also zooms; drag to pan." disabled={view.k >= MAX_ZOOM} onClick={() => zoomBy(1.5)}>+</button>
        <button type="button" className="map-btn" aria-label="Zoom out" disabled={view.k <= MIN_ZOOM} onClick={() => zoomBy(1 / 1.5)}>&minus;</button>
        <button type="button" className="map-btn !w-auto px-2.5 !text-[.9rem]" aria-label="Reset the map view" disabled={atHome} onClick={() => apply(HOME_VIEW)}>Reset</button>
      </div>

      {shownTip && !dragging && <TipCard id={TIP_ID} anchor={shownTip.anchor} bounds={size}>{shownTip.node}</TipCard>}
    </div>
  );

  function dcNode(d: DcTip) {
    return (<><b>Data center</b><div className="num">{d.itLoadMW} MW IT load</div><div className="num">{d.heatGWh} GWh of heat available a year</div></>);
  }
}

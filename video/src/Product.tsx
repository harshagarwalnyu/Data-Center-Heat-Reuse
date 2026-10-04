import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, D, SANS, tnum, prog, Scene } from "./lib";
import { Sfx } from "./kit";
import { cue, PRODUCT_VO, LEAD } from "./timeline";
import manifest from "../public/captures/manifest.json";

// ---- geometry: capture space is 1920x1080 CSS px (screenshots are @2x) ----
const FW = 1560, CH = 46, VH = 832; // frame width, chrome bar, content height
const FX = 180, FY = 46; // frame position on the 1920x1080 canvas
const S = FW / 1920;
const SHOT = (n: string) => staticFile(`captures/${n}.jpg`);

type Cam = { x: number; y: number; z: number };
type Seg = { from: number; shot: string; cam: Cam };
type Pt = { f: number; x: number; y: number };

const [P0, P1, P2] = PRODUCT_VO;
const c = (line: number, phrase: string, base: number, off = 0) => cue(line, phrase, base) + off;

const steps = manifest.slider.steps; // 7% ... 4%, x in capture px
const sy = manifest.slider.y;
const BAR = { x: 1050, y: 798 };

// frames (local to the product scene)
const T = {
  ring1: c(2, "A farm campus", P0, -10),
  ring2: c(2, "Then five hundred", P0, -10),
  ring3: c(2, "The town center", P0, -12),
  stats: c(3, "Every number", P1, -6),
  explore: c(3, "Drag", P1, -18),
  drag: c(3, "At four percent", P1, -14),
  dragEnd: c(3, "At four percent", P1, 52),
  bar: c(4, "Click a bar", P2, 4),
  compare: c(4, "compare this site", P2, -6),
};
export const PRODUCT_TIMES = T;

const SEGS: Seg[] = [
  { from: 0, shot: "hero", cam: { x: 960, y: 520, z: 1 } },
  { from: T.ring1, shot: "ring-1", cam: { x: 1275, y: 520, z: 1.7 } },
  { from: T.ring2, shot: "ring-2", cam: { x: 1275, y: 520, z: 1.7 } },
  { from: T.ring3, shot: "ring-3", cam: { x: 1275, y: 540, z: 1.75 } },
  { from: T.stats, shot: "stats", cam: { x: 960, y: 500, z: 1.45 } },
  { from: T.explore, shot: "explore", cam: { x: 760, y: 560, z: 1.55 } },
  { from: T.bar - 30, shot: "explore-end", cam: { x: 1000, y: 700, z: 1.5 } },
  { from: T.bar + 2, shot: "explore-bar", cam: { x: 1000, y: 700, z: 1.5 } },
  { from: T.compare, shot: "compare", cam: { x: 960, y: 520, z: 1.12 } },
];

// cursor waypoints (capture coords); quadratic-bezier glide between them
const CUR: Pt[] = [
  { f: 0, x: 1650, y: 250 },
  { f: 70, x: 1150, y: 560 },
  { f: T.ring1 + 22, x: 1102, y: 436 },
  { f: T.ring2 - 14, x: 1106, y: 440 },
  { f: T.ring2 + 22, x: 1277, y: 492 },
  { f: T.ring3 - 8, x: 1281, y: 494 },
  { f: T.ring3 + 24, x: 1500, y: 632 },
  { f: T.stats - 12, x: 1506, y: 636 },
  { f: T.stats + 34, x: 600, y: 480 },
  { f: T.stats + 80, x: 1300, y: 480 },
  { f: T.explore + 36, x: steps[0].x - 2, y: sy },
  { f: T.drag - 8, x: steps[0].x - 2, y: sy },
  { f: T.dragEnd, x: steps[steps.length - 1].x, y: sy },
  { f: T.bar - 8, x: BAR.x, y: BAR.y },
  { f: T.bar + 40, x: BAR.x + 30, y: BAR.y + 10 },
  { f: T.compare + 30, x: 1100, y: 300 },
];
const CLICKS = [T.drag - 6, T.dragEnd + 6, T.bar];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const cursorAt = (f: number) => {
  if (f <= CUR[0].f) return CUR[0];
  for (let i = 0; i < CUR.length - 1; i++) {
    const A = CUR[i], B = CUR[i + 1];
    if (f <= B.f) {
      const t = Easing.inOut(Easing.cubic)((f - A.f) / (B.f - A.f));
      const dx = B.x - A.x, dy = B.y - A.y;
      const cx = (A.x + B.x) / 2 - dy * 0.16, cy = (A.y + B.y) / 2 + dx * 0.16; // bezier bow
      const u = 1 - t;
      return { x: u * u * A.x + 2 * u * t * cx + t * t * B.x, y: u * u * A.y + 2 * u * t * cy + t * t * B.y };
    }
  }
  return CUR[CUR.length - 1];
};

const camAt = (f: number): Cam => {
  let k = 0;
  SEGS.forEach((s, i) => { if (f >= s.from) k = i; });
  const cur = SEGS[k];
  const prev = SEGS[Math.max(0, k - 1)];
  const t = k === 0 ? 1 : prog(f, cur.from, 30);
  const drift = 1 + 0.035 * Math.min(1, (f - cur.from) / 150);
  let x = lerp(prev.cam.x, cur.cam.x, t), y = lerp(prev.cam.y, cur.cam.y, t);
  const z = lerp(prev.cam.z, cur.cam.z, t) * drift;
  const vw = FW / (S * z), vh = VH / (S * z);
  x = Math.min(1920 - vw / 2, Math.max(vw / 2, x));
  y = Math.min(1080 - vh / 2, Math.max(vh / 2, y));
  return { x, y, z };
};

// capture px -> canvas px (inside frame content), given a camera
const toScreen = (p: { x: number; y: number }, cam: Cam) => ({
  x: (p.x - cam.x) * S * cam.z + FW / 2,
  y: (p.y - cam.y) * S * cam.z + VH / 2,
});

const Pointer: React.FC<{ x: number; y: number; scale?: number; o?: number }> = ({ x, y, scale = 1, o = 1 }) => (
  <svg width={64} height={64} viewBox="0 0 64 64" style={{ position: "absolute", left: x - 8, top: y - 6, opacity: o, transform: `scale(${scale})`, transformOrigin: "8px 6px", filter: "drop-shadow(0 6px 8px rgba(43,29,20,0.35))" }}>
    <path d="M8 6 L8 48 L19 38 L27 56 L36 52 L28 35 L43 35 Z" fill={C.ink} stroke="#fff" strokeWidth={3.5} strokeLinejoin="round" />
  </svg>
);

const Callout: React.FC<{ at: number; x: number; y: number; color: string; text: string; sub?: string; dx?: number; dy?: number; sfx?: boolean; dur?: number }> = ({ at, x, y, color, text, sub, dx = 40, dy = -90, sfx = true, dur = 140 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 11, stiffness: 150, mass: 0.7 } });
  if (f < at - 1) return null;
  const hold = f > at + dur ? prog(f, at + dur, 14) : 0;
  return (
    <>
      <div style={{ position: "absolute", left: x + dx, top: y + dy, transform: `translateX(${(1 - p) * 120}px) scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 1.4) * (1 - hold), transformOrigin: "left center", background: "#fff", borderRadius: 22, padding: "14px 26px", boxShadow: "0 18px 40px rgba(43,29,20,0.22), 0 0 0 2px " + color, fontFamily: SANS, ...tnum }}>
        <div style={{ fontSize: 44, fontWeight: 700, color, lineHeight: 1.1 }}>{text}</div>
        {sub && <div style={{ fontSize: 40, fontWeight: 500, color: C.ink, marginTop: 4, lineHeight: 1.15 }}>{sub}</div>}
      </div>
      {sfx && <Sfx at={at} name="whoosh-s" vol={0.2} rate={1.05} />}
    </>
  );
};

export const Product: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = camAt(f);

  // entrance: 3D tilt settling flat
  const e = spring({ frame: f - 2, fps, config: { damping: 18, stiffness: 70, mass: 1 } });
  const tilt = `perspective(2200px) rotateY(${(1 - e) * -16}deg) rotateX(${(1 - e) * 9}deg) translateY(${(1 - e) * 90}px) scale(${0.9 + 0.1 * e})`;

  // which screenshot(s): crossfade at boundaries; slider shot picked by drag progress
  let k = 0;
  SEGS.forEach((s, i) => { if (f >= s.from) k = i; });
  const curX = cursorAt(f).x; // slider state follows the cursor so the thumb and the overlay line up
  const stepIdx = steps.reduce((bi, st, i) => (Math.abs(st.x - curX) < Math.abs(steps[bi].x - curX) ? i : bi), 0);
  const resolve = (n: string) => (n === "explore" ? `explore-${stepIdx}` : n);
  const cur = SEGS[k], prev = SEGS[Math.max(0, k - 1)];
  const fade = k === 0 ? 1 : prog(f, cur.from, 12);

  const cp = cursorAt(f);
  const sc = toScreen(cp, cam);
  const trail = [3, 6, 9, 12, 15].map((d) => toScreen(cursorAt(Math.max(0, f - d)), camAt(Math.max(0, f - d))));
  const speed = Math.hypot(sc.x - trail[0].x, sc.y - trail[0].y);
  const cursorO = interpolate(f, [30, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const sPt = (x: number, y: number) => toScreen({ x, y }, cam);
  const stamp = sPt(1503, 629);
  const sinceStamp = f - T.ring3 - 24;
  const punch = sinceStamp > 0 ? Math.max(0, Math.sin(Math.min(1, sinceStamp / 14) * Math.PI)) * 0.03 * Math.exp(-sinceStamp / 20) * 6 : 0;

  return (
    <Scene>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${30 + Math.sin(f / 90) * 6}% 20%, #fff, ${C.bg} 55%, #f6efe4 100%)` }} />
      <div style={{ position: "absolute", left: FX, top: FY, width: FW, height: CH + VH, transform: tilt, transformOrigin: "50% 60%" }}>
        {/* soft floating shadow */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 22, boxShadow: "0 50px 100px -20px rgba(43,29,20,0.30), 0 18px 36px rgba(43,29,20,0.12)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 22, overflow: "hidden", background: "#fff", border: "1px solid #e4dccf" }}>
          <div style={{ height: CH, background: "#f4efe8", display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: "1px solid #e4dccf" }}>
            {["#ee6a5f", "#f5be4f", "#61c554"].map((cc) => <div key={cc} style={{ width: 14, height: 14, borderRadius: 7, background: cc }} />)}
            <div style={{ marginLeft: 24, height: 26, width: 520, borderRadius: 13, background: "#fff", border: "1px solid #e4dccf" }} />
          </div>
          <div style={{ position: "absolute", top: CH, left: 0, width: FW, height: VH, overflow: "hidden" }}>
            {/* page layer(s) under the camera */}
            {[{ n: prev.shot, o: k === 0 ? 0 : 1 - fade }, { n: cur.shot, o: fade }].map((l, i) => l.o > 0.001 && (
              <Img key={i} src={SHOT(resolve(l.n))} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: l.o, transformOrigin: "0 0", transform: `translate(${FW / 2 - cam.x * S * cam.z * (1 + punch)}px, ${VH / 2 - cam.y * S * cam.z * (1 + punch)}px) scale(${S * cam.z * (1 + punch)})` }} />
            ))}
            {/* ring ripple at on-site / town marker */}
            {f > T.ring3 + 24 && f < T.ring3 + 70 && (
              <div style={{ position: "absolute", left: stamp.x - 10, top: stamp.y - 10, width: 20, height: 20, borderRadius: "50%", border: `4px solid ${C.violet}`, opacity: 1 - (f - T.ring3 - 24) / 46, transform: `translate(-50%,-50%) scale(${1 + (f - T.ring3 - 24) * 0.45})` }} />
            )}
            {/* cursor trail + cursor */}
            {trail.map((t, i) => speed > 6 && <div key={i} style={{ position: "absolute", left: t.x - 10, top: t.y - 10, width: 20 - i * 2.5, height: 20 - i * 2.5, borderRadius: "50%", background: C.ember, opacity: (0.35 - i * 0.06) * cursorO }} />)}
            {CLICKS.map((cf, i) => {
              const t = f - cf;
              if (t < 0 || t > 26) return null;
              const cs = toScreen(cursorAt(cf), camAt(cf));
              return <div key={i} style={{ position: "absolute", left: cs.x - 4, top: cs.y - 4, width: 8, height: 8, borderRadius: "50%", border: `5px solid ${C.teal}`, opacity: 1 - t / 26, transform: `translate(-50%,-50%) scale(${1 + t * 0.35})` }} />;
            })}
            <Pointer x={sc.x} y={sc.y} scale={1.25 - 0.12 * CLICKS.reduce((a, cf) => a + (f >= cf && f < cf + 6 ? 1 : 0), 0)} o={cursorO} />

            {/* callouts */}
            <Callout at={T.ring1 + 26} x={sPt(1102, 432).x} y={sPt(1102, 432).y} color={C.teal} text={`$${Math.round(D.onsite.lcoh_usd_mwh_7pct)} per MWh`} sub="build first" dx={70} dy={-150} />
            <Callout at={T.ring2 + 26} x={sPt(1277, 492).x} y={sPt(1277, 492).y} color={C.ember} text={`${D.corridor.homes} homes`} sub="along the corridor" dx={40} dy={90} dur={50} />
            <Callout at={T.ring3 + 30} x={stamp.x} y={stamp.y} color={C.violet} text="Fails the cost test" sub={`$${Math.round(D.townLcoh)} vs $${Math.round(D.propane)} propane`} dx={-760} dy={-140} />
            <Callout at={T.stats + 30} x={sPt(960, 480).x} y={sPt(960, 480).y} color={C.teal} text="Live from the model" dx={-260} dy={-170} />
            <Callout at={T.dragEnd - 6} x={sPt(560, 520).x} y={sPt(560, 520).y} color={C.ember} text={`$${Math.round(D.lcoh7)} → $${Math.round(D.lcoh4)}`} sub="with co-op finance" dx={-430} dy={-190} />
            <Callout at={T.bar + 12} x={sPt(BAR.x, BAR.y).x} y={sPt(BAR.x, BAR.y).y} color={C.teal} text="Click any bar" sub="see what drives it" dx={300} dy={200} />
            <Callout at={T.compare + 14} x={sPt(960, 300).x} y={sPt(960, 300).y} color={C.violet} text="Two sites, side by side" dx={-330} dy={-60} />
          </div>
        </div>
      </div>
      {/* SFX synced to the visuals */}
      <Sfx at={2} name="whoosh-b" vol={0.28} />
      {CLICKS.map((cf, i) => <Sfx key={i} at={cf} name={`click-${(i * 3 + 1) % 8}`} vol={0.34} rate={0.9} len={10} />)}
      <Sfx at={T.ring1} name="whoosh-s" vol={0.16} />
      <Sfx at={T.ring2} name="whoosh-s" vol={0.16} rate={1.08} />
      <Sfx at={T.ring3 + 24} name="thud" vol={0.55} len={60} />
      <Sfx at={T.ring3 + 24} name="pop" vol={0.2} />
      <Sfx at={T.stats} name="whoosh-s" vol={0.16} />
      <Sfx at={T.explore} name="whoosh-b" vol={0.18} rate={1.05} />
      {Array.from({ length: Math.max(0, Math.floor((T.dragEnd - T.drag) / 8)) }, (_, j) => <Sfx key={j} at={T.drag + j * 8} name={`tick-${j % 4}`} vol={0.1} len={6} />)}
      <Sfx at={T.compare} name="whoosh-a" vol={0.22} />
    </Scene>
  );
};

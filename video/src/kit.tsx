import React from "react";
import { Audio, Sequence, staticFile, useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { C, SERIF, SANS, tnum, prog, ease } from "./lib";
import { CPF, typeFrames } from "./timeline";

// ---------- sound ----------
/** One-shot SFX synced to a local frame. Volumes are ~-10 dB under the voice (voice = 1.0). */
export const Sfx: React.FC<{ at: number; name: string; vol?: number; rate?: number; len?: number }> = ({ at, name, vol = 0.3, rate = 1, len = 70 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={len} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} playbackRate={rate} />
  </Sequence>
);
const hash = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** Soft keyboard clicks for a typed run: slight random pitch + volume per key, every `step` keys. */
export const KeyClicks: React.FC<{ n: number; at: number; cpf?: number; step?: number; vol?: number; seed?: number }> = ({ n, at, cpf = CPF, step = 2, vol = 0.16, seed = 0 }) => (
  <>
    {Array.from({ length: Math.ceil(n / step) }, (_, j) => {
      const k = j * step;
      const h = hash(k + seed * 31);
      return <Sfx key={j} at={at + k * cpf} name={`click-${Math.floor(h * 8) % 8}`} vol={vol * (0.6 + 0.8 * hash(k + 9 + seed))} rate={0.94 + 0.12 * hash(k + 5)} len={8} />;
    })}
  </>
);
export const RollTicks: React.FC<{ at: number; dur?: number; vol?: number }> = ({ at, dur = 60, vol = 0.05 }) => (
  <>
    {Array.from({ length: Math.floor(dur / 4) }, (_, j) => (
      <Sfx key={j} at={at + j * 4} name={`tick-${j % 4}`} vol={vol * (1.4 - j / (dur / 4))} len={6} />
    ))}
  </>
);

// ---------- typed text ----------
export const Typed: React.FC<{
  text: string; at: number; size: number; color?: string; font?: "serif" | "sans"; cpf?: number;
  clicks?: boolean; caret?: boolean; style?: React.CSSProperties; seed?: number; weight?: number;
}> = ({ text, at, size, color = C.ink, font = "serif", cpf = CPF, clicks = true, caret = true, style, seed = 0, weight = 500 }) => {
  const f = useCurrentFrame();
  const chars = typeFrames(text, at, cpf);
  const shown = chars.filter((c) => f >= c.f).length;
  const done = shown >= text.length;
  return (
    <div style={{ fontFamily: font === "serif" ? SERIF : SANS, fontSize: size, lineHeight: 1.1, color, fontWeight: weight, letterSpacing: font === "serif" ? -1.2 : 0, ...tnum, ...style }}>
      {chars.map((c, i) => (
        <span key={i} style={{ opacity: f >= c.f ? 1 : 0 }}>{c.ch}</span>
      ))}
      {caret && f >= at - 6 && (!done || Math.floor(f / 15) % 2 === 0 || f < at + text.length * cpf + 30) && (
        <span style={{ display: "inline-block", width: size * 0.06, height: size * 0.82, background: C.ember, marginLeft: size * 0.08, verticalAlign: "-0.06em", opacity: done && f > at + text.length * cpf + 40 ? 0 : 1 }} />
      )}
      {clicks && <KeyClicks n={text.replace(/ /g, "").length} at={at} cpf={cpf * (text.length / text.replace(/ /g, "").length)} seed={seed} />}
    </div>
  );
};

// ---------- rolling number (odometer) with tick texture ----------
export const Roll: React.FC<{ text: string; at: number; size: number; color: string; dur?: number; ticks?: boolean; font?: "serif" | "sans" }> = ({ text, at, size, color, dur = 60, ticks = true, font = "serif" }) => {
  const f = useCurrentFrame();
  const h = size * 1.12;
  return (
    <div style={{ display: "flex", fontFamily: font === "serif" ? SERIF : SANS, fontSize: size, lineHeight: `${h}px`, color, fontWeight: 500, ...tnum, opacity: f < at ? 0 : 1 }}>
      {text.split("").map((ch, i) => {
        if (!/\d/.test(ch)) return <div key={i} style={{ height: h }}>{ch}</div>;
        const target = Number(ch);
        const p = prog(f, at + i * 4, dur);
        const pos = (target + 10 * (1 + (i % 2))) * p;
        const y = p >= 1 ? target : pos % 10;
        return (
          <div key={i} style={{ height: h, overflow: "hidden", width: size * 0.58, WebkitMaskImage: "linear-gradient(transparent 0, #000 18%, #000 82%, transparent 100%)", maskImage: "linear-gradient(transparent 0, #000 18%, #000 82%, transparent 100%)" }}>
            <div style={{ transform: `translateY(${-y * h}px)` }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, k) => (
                <div key={k} style={{ height: h, textAlign: "center" }}>{n}</div>
              ))}
            </div>
          </div>
        );
      })}
      {ticks && <RollTicks at={at} dur={dur} />}
    </div>
  );
};

// ---------- subtle motion-blur streak for fast moves ----------
export const Streak: React.FC<{ x: number; y: number; len: number; at: number; angle?: number; color?: string }> = ({ x, y, len, at, angle = 0, color = C.ember }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 14);
  const o = Math.sin(Math.PI * p) * 0.55;
  return <div style={{ position: "absolute", left: x, top: y, width: len * p + 40, height: 4, borderRadius: 4, background: `linear-gradient(90deg, transparent, ${color})`, opacity: o, transform: `rotate(${angle}deg)`, transformOrigin: "left center" }} />;
};

// ---------- ripples (rings expanding outward) ----------
export const Ripples: React.FC<{ cx: number; cy: number; color: string; at?: number; count?: number; period?: number; maxR?: number; width?: number }> = ({ cx, cy, color, at = 0, count = 3, period = 70, maxR = 260, width = 3 }) => {
  const f = useCurrentFrame() - at;
  if (f < 0) return null;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const t = ((f - i * (period / count)) % period + period) % period / period;
        const live = f - i * (period / count) >= 0;
        return live ? <circle key={i} cx={cx} cy={cy} r={maxR * ease(t)} fill="none" stroke={color} strokeWidth={width} opacity={(1 - t) * 0.5} /> : null;
      })}
    </>
  );
};

// ---------- burned-in subtitles ----------
export const Subtitle: React.FC<{ line: string; at: number; dur: number; bottom?: number }> = ({ line, at, dur, bottom = 44 }) => {
  const f = useCurrentFrame();
  const sents = line.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [line];
  const total = sents.reduce((a, s) => a + s.length, 0);
  let acc = 0;
  const win = sents.map((s) => {
    const s0 = at + (dur * acc) / total;
    acc += s.length;
    return { s, s0, s1: at + (dur * acc) / total };
  });
  const cur = win.find((w) => f >= w.s0 - 1 && f < w.s1 + 2);
  if (!cur) return null;
  const isLast = cur === win[win.length - 1];
  const o = Math.min(prog(f, cur.s0, 6), isLast ? interpolate(f, [cur.s1 - 4, cur.s1 + 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: bottom, pointerEvents: "none" }}>
      <div style={{ opacity: o, fontFamily: SANS, fontSize: 38, lineHeight: 1.25, fontWeight: 500, color: "#fff", background: "rgba(43,29,20,0.78)", padding: "10px 28px", borderRadius: 14, maxWidth: 1500, textAlign: "center" }}>{cur.s}</div>
    </AbsoluteFill>
  );
};

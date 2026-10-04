import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, D, SERIF, SANS, tnum, prog, Scene, DataCenter } from "./lib";
import { Sfx, Typed, Roll, Ripples, Streak } from "./kit";
import { LEAD, VO, cue, TAIL } from "./timeline";

const hash = (i: number) => {
  const x = Math.sin(i * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

// ======================= 1. HOOK =======================
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const dcX = 150, dcY = 560, dcW = 560, dcH = 330;
  const num = String(Math.round(D.heatGWh));
  const numAt = cue(0, "seven hundred") - 8;
  const typeAt = cue(0, "heat leave");
  return (
    <Scene>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fdfdfc" />
            <stop offset="1" stopColor="#fbeee0" />
          </linearGradient>
          <radialGradient id="puff">
            <stop offset="0" stopColor={C.ember} stopOpacity="0.55" />
            <stop offset="1" stopColor={C.ember} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="shim" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={C.ember} stopOpacity="0.7" />
            <stop offset="1" stopColor={C.ember} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#sky)" />
        {/* parallax: far and near hills drift at different speeds */}
        <path d={`M-100 760 Q300 ${650 - f * 0.1} 700 740 T1500 720 T2100 760 V1080 H-100Z`} fill={C.sand} />
        <path d={`M-100 840 Q400 ${760 - f * 0.25} 900 830 T1800 810 T2200 850 V1080 H-100Z`} fill={C.sand2} />
        <rect x={0} y={890} width={1920} height={190} fill="#e0d3c0" />
        <DataCenter x={dcX} y={dcY} w={dcW} h={dcH} color={C.ink} />
        {Array.from({ length: 9 }, (_, i) => {
          const x0 = dcX + 50 + (i * (dcW - 100)) / 8;
          const period = 110 + hash(i) * 50;
          const t = ((f + hash(i + 3) * period) % period) / period;
          const y = dcY - t * 430;
          const o = Math.sin(Math.PI * t) * 0.75 * prog(f, 6 + i * 3, 20);
          const path = Array.from({ length: 9 }, (_, k) => `${k ? "L" : "M"}${x0 + Math.sin(k * 1.1 + f * 0.09 + i) * 14} ${y - k * 20}`).join(" ");
          return <path key={i} d={path} stroke="url(#shim)" strokeWidth={4} strokeLinecap="round" fill="none" opacity={o} />;
        })}
        {Array.from({ length: 46 }, (_, i) => {
          const period = 130 + hash(i + 40) * 120;
          const t = ((f * (0.8 + hash(i + 7) * 0.7) + hash(i + 11) * period) % period) / period;
          const x = dcX + 30 + hash(i) * (dcW - 60) + Math.sin(t * 6 + i) * 30 + t * 120;
          const y = dcY - 10 - t * (520 + hash(i + 2) * 200);
          const r = 8 + hash(i + 5) * 22;
          return <circle key={i} cx={x} cy={y} r={r * (0.6 + t)} fill="url(#puff)" opacity={Math.sin(Math.PI * t) * 0.9 * prog(f, 4, 30)} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 900, top: 250 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <Roll text={num} at={numAt} size={250} color={C.ember} dur={56} />
          <div style={{ fontFamily: SERIF, fontSize: 96, color: C.ember, opacity: prog(f, numAt + 40, 20), ...tnum }}>GWh</div>
        </div>
        <div style={{ marginTop: 8 }}>
          <Typed text="of heat a year goes into the air." at={typeAt} size={74} />
        </div>
      </div>
      <Sfx at={4} name="whoosh-s" vol={0.22} />
      <Streak x={dcX + 200} y={dcY - 60} len={420} at={4} angle={-62} />
    </Scene>
  );
};

// ======================= 2. PROBLEM =======================
const Lake: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig();
  const pin = spring({ frame: f - 40, fps, config: { damping: 9, stiffness: 150, mass: 0.7 } });
  const drift = f * 0.15;
  return (
    <svg width={760} height={900} viewBox="0 0 760 900" style={{ position: "absolute", right: 90, top: 90, transform: `translateY(${-drift}px)` }}>
      <rect x={0} y={0} width={760} height={900} rx={32} fill={C.sand} />
      <path d="M520 0 C500 120 470 200 455 330 C440 450 430 560 405 660 C395 740 380 820 360 900 L440 900 C455 800 480 720 495 640 C520 520 540 420 550 310 C562 200 580 100 590 0Z" fill="#c9dde4" />
      <path d="M0 120 Q200 60 360 130 T760 90" stroke={C.sand2} strokeWidth={3} fill="none" />
      <path d="M0 640 Q180 600 300 680 T760 700" stroke={C.sand2} strokeWidth={3} fill="none" />
      <text x={640} y={470} fontFamily={SANS} fontSize={40} fill="#4d7585" fontWeight={500} transform="rotate(90 640 470)" opacity={prog(f, 20, 20)}>Cayuga Lake</text>
      <g transform={`translate(440 330) scale(${pin})`}>
        <Ripples cx={0} cy={0} color={C.ember} at={50} maxR={110} period={80} />
        <path d="M0 0 C-30 -40 -34 -60 -34 -76 A34 34 0 1 1 34 -76 C34 -60 30 -40 0 0Z" fill={C.ember} />
        <circle cx={0} cy={-76} r={12} fill={C.bg} />
      </g>
      <text x={60} y={340} fontFamily={SANS} fontSize={44} fill={C.ink} fontWeight={600} opacity={prog(f, 50, 20)}>Lansing, NY</text>
    </svg>
  );
};
export const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const subAt = cue(1, "Free heat");
  const sp = prog(f, subAt, 22);
  return (
    <Scene>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 20% 30%, #fff, ${C.bg})` }} />
      <div style={{ position: "absolute", left: 110, top: 250, width: 900 }}>
        <Typed text="Lansing directed its attorney to draft a data-center ban." at={LEAD + 2} size={84} cpf={1.2} seed={2} />
        <div style={{ marginTop: 40, fontFamily: SANS, fontSize: 46, color: C.mute, opacity: sp, transform: `translateY(${(1 - sp) * 20}px)` }}>Free heat alone is not enough to earn a yes.</div>
      </div>
      <Lake f={f} />
      <Sfx at={40} name="pop" vol={0.25} />
      <Sfx at={LEAD + VO[1] + TAIL - 16} name="whoosh-a" vol={0.3} />
    </Scene>
  );
};

// ======================= 4. RESULT =======================
export const Result: React.FC = () => {
  const f = useCurrentFrame();
  const a = cue(5, "seven hundred") - 10;
  const b = cue(5, "over eleven") - 10;
  const card = (at: number, big: string, label: string, color: string, x: number) => {
    const p = prog(f, at - 10, 30);
    return (
      <div style={{ position: "absolute", left: x, top: 230, width: 760, height: 560, borderRadius: 36, background: C.sand, opacity: p, transform: `translateY(${(1 - p) * 60}px)`, overflow: "hidden" }}>
        <svg width={760} height={560} style={{ position: "absolute" }}>
          <Ripples cx={380} cy={280} color={color} at={at} maxR={330} period={90} width={2} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Roll text={big} at={at} size={190} color={color} dur={60} />
          <div style={{ fontFamily: SANS, fontSize: 44, color: C.ink, fontWeight: 500, textAlign: "center", lineHeight: 1.2, maxWidth: 600, opacity: prog(f, at + 40, 20) }}>{label}</div>
        </div>
      </div>
    );
  };
  return (
    <Scene>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #fff, ${C.bg})` }} />
      {card(a, `$${fmt(D.savings)}`, "saved a year by each propane home", C.ember, 130)}
      {card(b, fmt(D.co2), "tonnes of CO₂ avoided a year", C.teal, 1030)}
      <Sfx at={a - 12} name="whoosh-s" vol={0.22} />
      <Sfx at={b - 12} name="whoosh-s" vol={0.22} rate={1.1} />
      <Sfx at={b + 66} name="chime" vol={0.12} len={80} />
    </Scene>
  );
};

// ======================= 5. CTA =======================
export const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const pct = D.pctCapex.toFixed(1);
  const t1 = cue(6, "Don't ban") - 4;
  const t2 = cue(6, "Set the") - 4;
  const urlAt = LEAD + VO[6] + 4;
  const url = "harshagarwalnyu.github.io/Data-Center-Heat-Reuse";
  const endAt = urlAt + Math.round(url.length * 1.2) + 24;
  const endP = prog(f, endAt, 30);
  return (
    <Scene>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #fff, ${C.bg})` }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <Ripples cx={960} cy={470} color={C.ember} at={t1} maxR={700} period={150} width={1.5} count={2} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 12, opacity: prog(f, LEAD, 20) }}>
          <Roll text={pct} at={LEAD + 4} size={120} color={C.ember} dur={50} />
          <div style={{ fontFamily: SERIF, fontSize: 100, color: C.ember }}>%</div>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 44, color: C.mute, opacity: prog(f, LEAD + 30, 20) }}>of the data center&apos;s cost closes the funding gap</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center" }}>
        <Typed text="Don't ban it." at={t1} size={150} seed={5} caret={f < t2} />
        <Typed text="Set the terms." at={t2} size={150} color={C.ember} seed={9} style={{ marginTop: 6 }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 735, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ fontFamily: SANS, fontSize: 42, color: C.mute, opacity: f > urlAt - 8 ? 1 : 0 }}>Explore the model</div>
        <div style={{ background: C.sand, padding: "14px 36px", borderRadius: 18, border: `2px solid ${C.sand2}`, opacity: f > urlAt - 4 ? 1 : 0 }}>
          <Typed text={url} at={urlAt} size={52} font="sans" cpf={1.2} seed={14} caret={false} />
        </div>
        <div style={{ opacity: endP, transform: `translateY(${(1 - endP) * 20}px)`, fontFamily: SERIF, fontSize: 56, color: C.ink }}>
          Thermal Commons <span style={{ color: C.ember }}>&middot;</span> Heat for Lansing
        </div>
      </div>
      <Sfx at={endAt} name="chime" vol={0.14} len={90} />
    </Scene>
  );
};

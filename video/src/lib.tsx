import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import raw from "./site2.json";

// ---- data (all numbers come from outputs/site2.json via scripts/sync-data.mjs) ----
type Ring = { id: string; annual_MWh: number; lcoh_usd_mwh_7pct: number; pipe_km: number; homes?: number };
const ring = (id: string) => (raw.rings as Ring[]).find((r) => r.id === id)!;
export const D = {
  heatGWh: raw.supply.heat_available_GWh,
  onsite: ring("onsite"),
  corridor: ring("corridor"),
  town: ring("town"),
  lcoh4: raw.finance.lcoh_usd_mwh.coop_4pct,
  lcoh7: raw.finance.lcoh_usd_mwh.utility_7pct,
  propane: raw.finance.incumbent_usd_mwh.propane,
  savings: raw.finance.household.savings_vs_propane_usd,
  co2: raw.impact.co2_avoided_t_yr,
  pctCapex: raw.extras.cba.headline_as_pct_of_dc_capex,
  townLcoh: raw.extras.with_town.town_ring_lcoh_usd_mwh,
};

// ---- style ----
export const C = {
  bg: "#fdfdfc", ink: "#2b1d14", ember: "#c2410c", emberText: "#9a3412",
  teal: "#0b8ca6", tealText: "#0a5a6b", violet: "#7c4dcc", violetText: "#5b34a8",
  mute: "#6b5848", line: "#e8e1d8", sand: "#f3ece2", sand2: "#eadfd0",
};
export const SERIF = '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif';
export const SANS = '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif';
export const tnum: React.CSSProperties = { fontVariantNumeric: "tabular-nums lining-nums" };

export const ease = Easing.bezier(0.05, 0.7, 0.1, 1);
export const prog = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const usePop = (start: number, cfg = { damping: 11, stiffness: 160, mass: 0.7 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - start, fps, config: cfg });
};

export const Scene: React.FC<{ children: React.ReactNode; dur?: number }> = ({ children }) => (
  <AbsoluteFill style={{ background: C.bg }}>{children}</AbsoluteFill>
);

export const Reveal: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number }> = ({ at, children, style, dy = 36 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 26);
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style }}>{children}</div>;
};

export const Statement: React.FC<{ size?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ size = 96, color = C.ink, style, children }) => (
  <div style={{ fontFamily: SERIF, fontSize: size, lineHeight: 1.08, color, letterSpacing: -1.5, fontWeight: 500, ...style }}>{children}</div>
);
export const Label: React.FC<{ size?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ size = 44, color = C.mute, style, children }) => (
  <div style={{ fontFamily: SANS, fontSize: size, lineHeight: 1.2, color, fontWeight: 500, ...tnum, ...style }}>{children}</div>
);

// ---- shapes ----
export const DataCenter: React.FC<{ x: number; y: number; w?: number; h?: number; color?: string }> = ({ x, y, w = 520, h = 300, color = C.ink }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={w} height={h} rx={10} fill={color} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={36} y={40 + i * 62} width={w - 72} height={26} rx={6} fill="#ffffff" opacity={0.14} />
    ))}
    {[0, 1, 2, 3].map((i) => (
      <circle key={i} cx={w - 60} cy={53 + i * 62} r={6} fill={C.ember} />
    ))}
  </g>
);
export const House: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = C.ember }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 0 L0 -28 L30 0 L22 0 L22 26 L-22 26 L-22 0 Z" fill={color} />
    <rect x={-6} y={8} width={12} height={18} fill={C.bg} />
  </g>
);

// ---- odometer ----
export const Odometer: React.FC<{ text: string; at: number; size: number; color: string }> = ({ text, at, size, color }) => {
  const f = useCurrentFrame();
  const h = size * 1.1;
  return (
    <div style={{ display: "flex", fontFamily: SERIF, fontSize: size, lineHeight: `${h}px`, color, fontWeight: 500, ...tnum }}>
      {text.split("").map((ch, i) => {
        if (!/\d/.test(ch)) return <div key={i} style={{ height: h }}>{ch}</div>;
        const target = Number(ch);
        const p = prog(f, at + i * 4, 60);
        const pos = (target + 10) * p; // spin through one full wheel
        return (
          <div key={i} style={{ height: h, overflow: "hidden", width: size * 0.56 }}>
            <div style={{ transform: `translateY(${-(pos % 10 === 0 && p >= 1 ? target : pos % 10) * h}px)` }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, k) => (
                <div key={k} style={{ height: h, textAlign: "center" }}>{n}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

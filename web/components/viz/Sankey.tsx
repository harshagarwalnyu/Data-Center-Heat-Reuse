"use client";
import type { Site2Data } from "@/lib/types";
import { dec } from "@/lib/format";
import { ringColor, ringShort } from "../ui";

const H = 8760;

function ribbon(x0: number, y0: number, x1: number, y1: number, w: number) {
  const mx = (x0 + x1) / 2;
  return `M${x0},${y0} C${mx},${y0} ${mx},${y1} ${x1},${y1} L${x1},${y1 + w} C${mx},${y1 + w} ${mx},${y0 + w} ${x0},${y0 + w} Z`;
}
function center(x0: number, y0: number, x1: number, y1: number, w: number) {
  const mx = (x0 + x1) / 2;
  return `M${x0},${y0 + w / 2} C${mx},${y0 + w / 2} ${mx},${y1 + w / 2} ${x1},${y1 + w / 2}`;
}

export function Sankey({ d }: { d: Site2Data }) {
  const it = d.supply.it_load_MW * d.supply.load_factor; // avg MW electric into IT = avg MW heat
  const cap = d.supply.heat_available_MW_avg;
  const unc = Math.max(0, it - cap);
  const del = d.totals.heat_delivered_MWh / H;
  const hpe = d.totals.hp_elec_MWh / H;
  const drawn = del - hpe;
  const unused = cap - drawn;
  const s = 2.3;
  const NW = 24;
  const X = [0, 250, 500, 700];
  const top = 46;

  const itH = it * s;
  const capH = cap * s;
  const uncY = top + capH + 28;
  const uncH = unc * s;
  const hpY = top;
  const hpH = del * s;
  const drawnH = drawn * s;
  const unusedH = unused * s;
  const dryY = top + 190;
  const dryH = (unc + unused) * s;

  // user slots
  const rings = d.rings.filter((r) => !r.conditional);
  const slot = 50;
  let hpOff = 0;
  const userLinks = rings.map((r, i) => {
    const mw = r.annual_MWh / H;
    const h = Math.max(mw * s, 4);
    const y1 = top + i * slot + (slot - h) / 2 - 8;
    const y0 = hpY + hpOff;
    hpOff += (mw / del) * hpH;
    return { r, mw, h, y0, y1, w0: (mw / del) * hpH };
  });

  const C = { heat: "var(--ember)", cool: "var(--ink2)", elec: "var(--amber)" };
  const flows: { path: string; ctr: string; color: string; op: number }[] = [
    { path: ribbon(X[0] + NW, top, X[1], top, capH), ctr: center(X[0] + NW, top, X[1], top, capH), color: C.heat, op: 0.5 },
    { path: ribbon(X[0] + NW, top + capH, X[1], uncY, uncH), ctr: center(X[0] + NW, top + capH, X[1], uncY, uncH), color: C.cool, op: 0.28 },
    { path: ribbon(X[1] + NW, top, X[2], hpY, drawnH), ctr: center(X[1] + NW, top, X[2], hpY, drawnH), color: C.heat, op: 0.6 },
    { path: ribbon(X[1] + NW, top + drawnH, X[3], dryY, unusedH), ctr: center(X[1] + NW, top + drawnH, X[3], dryY, unusedH), color: C.cool, op: 0.28 },
    { path: ribbon(X[1] + NW, uncY, X[3], dryY + unusedH, uncH), ctr: center(X[1] + NW, uncY, X[3], dryY + unusedH, uncH), color: C.cool, op: 0.28 },
  ];

  return (
    <svg viewBox="0 0 1000 520" role="img" className="w-full h-full block" aria-label={`Heat flow: ${dec(it, 0)} megawatts of IT power become heat. ${dec(cap, 0)} megawatts are captured. About ${dec(del, 1)} megawatts reach users through heat pumps. The rest goes to dry coolers, which can reject 100 percent of heat on their own.`}>
      {/* ribbons */}
      {flows.map((f, i) => (
        <g key={i}>
          <path d={f.path} fill={f.color} opacity={f.op} />
          <path d={f.ctr} className="flow-anim" stroke="var(--bg)" strokeWidth="2.5" fill="none" opacity="0.8" />
        </g>
      ))}
      {userLinks.map((u, i) => (
        <g key={u.r.id}>
          <path d={ribbon(X[2] + NW, u.y0, X[3], u.y1, Math.max(u.h, 4))} fill={ringColor(u.r.id)} opacity="0.65" />
          <path d={center(X[2] + NW, u.y0, X[3], u.y1, Math.max(u.h, 4))} className="flow-anim" stroke="var(--bg)" strokeWidth="2" fill="none" opacity="0.85" />
          <rect x={X[3]} y={u.y1} width={NW} height={Math.max(u.h, 6)} rx="3" fill={ringColor(u.r.id)} />
          <text x={X[3] + NW + 12} y={u.y1 + 9} fontSize="25" fontWeight="700" fill="var(--ink)">{ringShort(u.r.id)}</text>
          <text x={X[3] + NW + 12} y={u.y1 + 31} fontSize="22" fill="var(--ink2)" className="num">{dec(u.mw, 1)} MW avg</text>
          {i === 99 && null}
        </g>
      ))}
      {/* nodes */}
      <rect x={X[0]} y={top} width={NW} height={itH} rx="4" fill="var(--navy)" />
      <rect x={X[1]} y={top} width={NW} height={capH} rx="4" fill="var(--ember)" />
      <rect x={X[1]} y={uncY} width={NW} height={uncH} rx="4" fill="var(--ink2)" />
      <rect x={X[2]} y={hpY} width={NW} height={hpH - hpe * s} rx="3" fill="var(--ember)" />
      <rect x={X[2]} y={hpY + hpH - hpe * s} width={NW} height={Math.max(hpe * s, 3)} rx="3" fill="var(--amber)" />
      <rect x={X[3]} y={dryY} width={NW} height={dryH} rx="4" fill="var(--ink2)" />

      {/* labels */}
      <text x={X[0]} y={top - 24} fontSize="25" fontWeight="700" fill="var(--ink)">IT power in</text>
      <text x={X[0]} y={top - 4} fontSize="22" fill="var(--ink2)" className="num">{dec(it, 0)} MW avg</text>
      <text x={X[1]} y={top - 24} fontSize="25" fontWeight="700" fill="var(--ember-text)">Heat captured</text>
      <text x={X[1]} y={top - 4} fontSize="22" fill="var(--ink2)" className="num">{dec(cap, 0)} MW at {d.supply.capture_temp_C} °C</text>
      <text x={X[1] + NW + 10} y={uncY + uncH / 2 + 6} fontSize="22" fill="var(--ink2)" className="num">{dec(unc, 0)} MW not captured</text>
      <text x={X[2]} y={top - 24} fontSize="25" fontWeight="700" fill="var(--ember-text)">Heat pumps</text>
      <text x={X[2]} y={top - 4} fontSize="22" fill="var(--ink2)" className="num">{dec(del, 1)} MW delivered</text>
      <text x={X[2] - 8} y={hpY + hpH + 26} fontSize="21" fill="var(--ink2)" textAnchor="start" className="num">
        <tspan fill="var(--ember-text)" fontWeight="700">■</tspan> incl. {dec(hpe, 1)} MW grid power
      </text>

      {/* cooling safeguard */}
      <rect x={X[3] - 14} y={dryY - 14} width={288} height={dryH + 28} rx="14" fill="none" stroke="var(--teal)" strokeWidth="3" strokeDasharray="9 7" />
      <text x={X[3] + NW + 12} y={dryY + 14} fontSize="25" fontWeight="700" fill="var(--teal-text)">Dry coolers</text>
      <text x={X[3] + NW + 12} y={dryY + 40} fontSize="22" fill="var(--ink)">Always on. Can reject</text>
      <text x={X[3] + NW + 12} y={dryY + 62} fontSize="22" fill="var(--ink)">100% of the heat alone.</text>
      <text x={X[3] + NW + 12} y={dryY + 94} fontSize="22" fill="var(--ink2)" className="num">{dec(unc + unused, 0)} MW avg here</text>
      <text x={X[3] + NW + 12} y={dryY + 116} fontSize="22" fill="var(--ink2)">(heat users take the rest)</text>
    </svg>
  );
}

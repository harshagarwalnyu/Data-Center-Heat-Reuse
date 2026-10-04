"use client";

// Hand-built SVG charts following the dataviz skill: thin marks, hairline grid, one axis,
// legend for 2+ series, selective direct labels, hover/focus tooltips, and a table twin.
import { useId, useState } from "react";
import { num } from "@/lib/fmt";
import type { WeekRow } from "@/lib/data";

const W = 720;

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * p;
}

function ticks(max: number, count = 4) {
  return Array.from({ length: count + 1 }, (_, i) => (max / count) * i);
}

export function Legend({ items }: { items: { label: string; color: string; kind?: "line" | "rect" | "band" }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-2">
          {it.kind === "line" ? (
            <span className="inline-block h-[3px] w-5 rounded" style={{ background: it.color }} />
          ) : (
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ background: it.color, border: it.kind === "band" ? "1px solid var(--axis)" : undefined }}
            />
          )}
          {it.label}
        </li>
      ))}
    </ul>
  );
}

export function TableToggle({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <details className="mt-2 text-sm text-ink-2 no-print">
      <summary className="cursor-pointer select-none">Show as table</summary>
      <div className="mt-2 max-h-72 overflow-auto rounded border border-line">
        <table className="w-full text-left tnum">
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 bg-surface">
            <tr>
              {head.map((h) => (
                <th key={h} className="px-3 py-1.5 font-semibold text-ink">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-line">
                {r.map((c, j) => (
                  <td key={j} className="px-3 py-1">
                    {typeof c === "number" ? num(c, 2) : c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function Tip({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  const left = x > W * 0.62;
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 rounded-md border border-line bg-surface px-3 py-2 text-sm shadow-lg"
      style={{
        left: `${(x / W) * 100}%`,
        top: y,
        transform: `translate(${left ? "calc(-100% - 12px)" : "12px"}, 0)`,
        minWidth: 180,
      }}
    >
      {children}
    </div>
  );
}

function TipRow({ color, label, value }: { color?: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 text-ink-2">
        {color && <span className="inline-block h-[3px] w-3 rounded" style={{ background: color }} />}
        {label}
      </span>
      <strong className="tnum text-ink">{value}</strong>
    </div>
  );
}

/** A week of hourly dispatch: demand and backup (MW) on one axis, storage (MWh) as its own small chart. */
export function WeekChart({ rows, title }: { rows: WeekRow[]; title: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const id = useId();
  const H = 260, H2 = 110, padL = 48, padR = 16, padT = 22, padB = 30;
  const pw = W - padL - padR;
  const yMax = niceMax(Math.max(...rows.map((r) => r.demand_MW)) * 1.05);
  const sMax = niceMax(Math.max(...rows.map((r) => r.storage_MWh), 1));
  const x = (h: number) => padL + (h / (rows.length - 1)) * pw;
  const y = (v: number) => padT + (1 - v / yMax) * (H - padT - padB);
  const ys = (v: number) => 8 + (1 - v / sMax) * (H2 - 8 - 22);
  const path = (f: (r: WeekRow) => number, yy: (v: number) => number) =>
    rows.map((r, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${yy(f(r)).toFixed(1)}`).join("");
  const area = (f: (r: WeekRow) => number) => `${path(f, y)}L${x(rows.length - 1)},${y(0)}L${x(0)},${y(0)}Z`;

  // Contiguous outage bands.
  const bands: [number, number][] = [];
  rows.forEach((r, i) => {
    if (r.dc_available_MW === 0) {
      const last = bands[bands.length - 1];
      if (last && last[1] === i - 1) last[1] = i;
      else bands.push([i, i]);
    }
  });

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    const h = Math.round(((px - padL) / pw) * (rows.length - 1));
    setHover(h >= 0 && h < rows.length ? h : null);
  };
  const r = hover !== null ? rows[hover] : null;

  return (
    <figure className="w-full">
      <figcaption className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-base font-semibold">{title}</span>
        <Legend
          items={[
            { label: "Heat demand", color: "var(--s1)", kind: "line" },
            { label: "Backup boiler", color: "var(--s2)", kind: "rect" },
            { label: "DC heat offline", color: "var(--band)", kind: "band" },
          ]}
        />
      </figcaption>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H + H2}`}
          className="w-full touch-none select-none"
          role="img"
          aria-labelledby={`${id}-d`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") setHover((h) => Math.min((h ?? -1) + 1, rows.length - 1));
            if (e.key === "ArrowLeft") setHover((h) => Math.max((h ?? 1) - 1, 0));
          }}
        >
          <desc id={`${id}-d`}>{title}. Hourly heat demand and backup boiler output in MW, with storage level below.</desc>
          {bands.map(([a, b]) => (
            <g key={a}>
              <rect x={x(a)} y={padT} width={Math.max(x(b) - x(a), 2)} height={H - padT - padB + H2} fill="var(--band)" />
              <text x={x(a) + 6} y={padT + 14} fontSize={12} fill="var(--ink-2)">
                DC heat offline {b - a + 1} h
              </text>
            </g>
          ))}
          {ticks(yMax).map((t) => (
            <g key={t}>
              <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke={t === 0 ? "var(--axis)" : "var(--grid)"} />
              <text x={padL - 8} y={y(t) + 4} fontSize={12} textAnchor="end" fill="var(--muted)" className="tnum">
                {num(t, yMax < 5 ? 1 : 0)}
              </text>
            </g>
          ))}
          {Array.from({ length: 8 }, (_, d) => (
            <g key={d}>
              <line x1={x(Math.min(d * 24, rows.length - 1))} x2={x(Math.min(d * 24, rows.length - 1))} y1={y(0)} y2={y(0) + 5} stroke="var(--axis)" />
              {d < 7 && (
                <text x={x(d * 24 + 12)} y={H - padB + 18} fontSize={12} textAnchor="middle" fill="var(--muted)">
                  Day {d + 1}
                </text>
              )}
            </g>
          ))}
          <path d={area((r) => r.backup_MW)} fill="var(--wash-2)" />
          <path d={path((r) => r.backup_MW, y)} fill="none" stroke="var(--s2)" strokeWidth={2} strokeLinejoin="round" />
          <path d={path((r) => r.demand_MW, y)} fill="none" stroke="var(--s1)" strokeWidth={2} strokeLinejoin="round" />

          {/* Storage small multiple: its own axis (MWh), never sharing the MW scale. */}
          <g transform={`translate(0, ${H})`}>
            <line x1={padL} x2={W - padR} y1={ys(0)} y2={ys(0)} stroke="var(--axis)" />
            <text x={padL - 8} y={ys(sMax) + 4} fontSize={12} textAnchor="end" fill="var(--muted)" className="tnum">
              {num(sMax)}
            </text>
            <text x={padL - 8} y={ys(0) + 4} fontSize={12} textAnchor="end" fill="var(--muted)">
              0
            </text>
            <path d={path((r) => r.storage_MWh, ys)} fill="none" stroke="var(--s3)" strokeWidth={2} />
            <text x={W - padR} y={ys(sMax) + 4} fontSize={12} textAnchor="end" fill="var(--ink-2)">
              Storage tank, MWh
            </text>
          </g>
          {r && (
            <g>
              <line x1={x(hover!)} x2={x(hover!)} y1={padT} y2={H + H2 - 22} stroke="var(--ink-2)" strokeWidth={1} />
              <circle cx={x(hover!)} cy={y(r.demand_MW)} r={4} fill="var(--s1)" stroke="var(--surface)" strokeWidth={2} />
            </g>
          )}
        </svg>
        {r && (
          <Tip x={x(hover!)} y={20}>
            <div className="mb-1 text-ink-2">
              Day {Math.floor(hover! / 24) + 1}, {String(hover! % 24).padStart(2, "0")}:00 · {num(r.outdoor_C, 0)} °C
            </div>
            <TipRow color="var(--s1)" label="Demand" value={`${num(r.demand_MW, 1)} MW`} />
            <TipRow color="var(--s2)" label="Backup" value={`${num(r.backup_MW, 1)} MW`} />
            <TipRow color="var(--s3)" label="Storage" value={`${num(r.storage_MWh, 0)} MWh`} />
            <TipRow label="DC heat offered" value={`${num(r.dc_available_MW, 0)} MW`} />
          </Tip>
        )}
      </div>
      <TableToggle
        caption={title}
        head={["Hour", "Outdoor °C", "Demand MW", "Backup MW", "Storage MWh", "DC heat MW"]}
        rows={rows.map((r) => [r.h, r.outdoor_C, r.demand_MW, r.backup_MW, r.storage_MWh, r.dc_available_MW])}
      />
    </figure>
  );
}

export type BarRow = {
  label: string;
  value: number;
  color?: string;
  valueLabel: string;
  note?: string;
  marker?: { value: number; label: string };
};

/** Horizontal bars, one baseline, value at the tip, optional per-row reference marker. */
export function HBars({ rows, unit, title, max }: { rows: BarRow[]; unit: string; title: string; max?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const rowH = 80, padL = 0, padR = 130, bar = 22;
  const H = rows.length * rowH + 8;
  const vMax = max ?? niceMax(Math.max(...rows.map((r) => Math.max(r.value, r.marker?.value ?? 0))) * 1.02);
  const xs = (v: number) => padL + (Math.min(v, vMax) / vMax) * (W - padL - padR);
  return (
    <figure className="w-full">
      <figcaption className="mb-2 text-base font-semibold">{title}</figcaption>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${title} (${unit})`}>
          {rows.map((r, i) => {
            const y0 = i * rowH + 26;
            const w = Math.max(xs(r.value) - padL, 3);
            const clipped = r.value > vMax;
            return (
              <g
                key={r.label}
                tabIndex={0}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                style={{ outline: "none" }}
              >
                <rect x={0} y={i * rowH} width={W} height={rowH} fill="transparent" />
                <text x={padL} y={y0 - 8} fontSize={15} fill="var(--ink)">
                  {r.label}
                  {r.note && (
                    <tspan fill="var(--ink-2)" fontSize={13}>
                      {"  "}
                      {r.note}
                    </tspan>
                  )}
                </text>
                <path
                  d={`M${padL},${y0} h${w - 4} a4,4 0 0 1 4,4 v${bar - 8} a4,4 0 0 1 -4,4 h-${w - 4} Z`}
                  fill={r.color ?? "var(--s1)"}
                  opacity={hover === null || hover === i ? 1 : 0.55}
                />
                <text
                  x={padL + w + 8 + (r.marker && xs(r.marker.value) >= padL + w - 2 && xs(r.marker.value) < padL + w + 90 ? xs(r.marker.value) - (padL + w) + 4 : 0)}
                  y={y0 + bar / 2 + 5} fontSize={15} fontWeight={600} fill="var(--ink)" className="tnum">
                  {r.valueLabel}
                  {clipped ? " →" : ""}
                </text>
                {r.marker && (
                  <g>
                    <line x1={xs(r.marker.value)} x2={xs(r.marker.value)} y1={y0 - 4} y2={y0 + bar + 4} stroke="var(--ink)" strokeWidth={2} />
                    <text x={xs(r.marker.value)} y={y0 + bar + 20} fontSize={13} textAnchor="middle" fill="var(--ink-2)">
                      {r.marker.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        {hover !== null && (
          <Tip x={Math.min(xs(rows[hover].value), W * 0.6)} y={hover * rowH + 40}>
            <div className="mb-1 text-ink-2">{rows[hover].label}</div>
            <TipRow color={rows[hover].color ?? "var(--s1)"} label="Value" value={rows[hover].valueLabel} />
            {rows[hover].marker && <TipRow label={rows[hover].marker!.label} value={`${num(rows[hover].marker!.value)} ${unit}`} />}
          </Tip>
        )}
      </div>
      <TableToggle
        caption={title}
        head={["Item", `Value (${unit})`, "Reference"]}
        rows={rows.map((r) => [r.label, r.valueLabel, r.marker ? `${r.marker.label}: ${num(r.marker.value)}` : ""])}
      />
    </figure>
  );
}

/** Monthly columns: recovered heat and backup stacked with a 2px surface gap. */
export function MonthlyColumns({ rows }: { rows: { month: number; delivered_MWh: number; backup_MWh: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const H = 260, padL = 48, padR = 8, padT = 12, padB = 28;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const yMax = niceMax(Math.max(...rows.map((r) => r.delivered_MWh + r.backup_MWh)));
  const band = (W - padL - padR) / 12;
  const bw = Math.min(24, band * 0.6);
  const y = (v: number) => padT + (1 - v / yMax) * (H - padT - padB);
  return (
    <figure className="w-full">
      <figcaption className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-base font-semibold">Heat delivered each month, MWh</span>
        <Legend
          items={[
            { label: "Recovered DC heat", color: "var(--s1)" },
            { label: "Backup boiler", color: "var(--s2)" },
          ]}
        />
      </figcaption>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Monthly heat delivered, MWh">
          {ticks(yMax).map((t) => (
            <g key={t}>
              <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke={t === 0 ? "var(--axis)" : "var(--grid)"} />
              <text x={padL - 8} y={y(t) + 4} fontSize={12} textAnchor="end" fill="var(--muted)" className="tnum">
                {num(t)}
              </text>
            </g>
          ))}
          {rows.map((r, i) => {
            const cx = padL + band * i + band / 2;
            const top = y(r.delivered_MWh);
            const bTop = y(r.delivered_MWh + r.backup_MWh);
            const h1 = y(0) - top;
            return (
              <g
                key={r.month}
                tabIndex={0}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                style={{ outline: "none" }}
              >
                <rect x={cx - band / 2} y={padT} width={band} height={H - padT - padB} fill="transparent" />
                {r.backup_MWh > 0 ? (
                  <>
                    <rect x={cx - bw / 2} y={top} width={bw} height={h1} fill="var(--s1)" />
                    {top - 2 - bTop >= 5 ? (
                      <path
                        d={`M${cx - bw / 2},${top - 2} V${bTop + 4} a4,4 0 0 1 4,-4 h${bw - 8} a4,4 0 0 1 4,4 V${top - 2} Z`}
                        fill="var(--s2)"
                      />
                    ) : (
                      <rect x={cx - bw / 2} y={top - 2 - Math.max(top - 2 - bTop, 2)} width={bw} height={Math.max(top - 2 - bTop, 2)} fill="var(--s2)" />
                    )}
                  </>
                ) : (
                  <path d={`M${cx - bw / 2},${y(0)} V${top + 4} a4,4 0 0 1 4,-4 h${bw - 8} a4,4 0 0 1 4,4 V${y(0)} Z`} fill="var(--s1)" />
                )}
                <text x={cx} y={H - 8} fontSize={12} textAnchor="middle" fill="var(--muted)">
                  {months[i]}
                </text>
              </g>
            );
          })}
        </svg>
        {hover !== null && (
          <Tip x={padL + band * hover + band / 2} y={20}>
            <div className="mb-1 text-ink-2">{months[hover]}</div>
            <TipRow color="var(--s1)" label="Recovered" value={`${num(rows[hover].delivered_MWh)} MWh`} />
            <TipRow color="var(--s2)" label="Backup" value={`${num(rows[hover].backup_MWh)} MWh`} />
          </Tip>
        )}
      </div>
      <TableToggle
        caption="Monthly heat delivered"
        head={["Month", "Recovered MWh", "Backup MWh"]}
        rows={rows.map((r, i) => [months[i], r.delivered_MWh, r.backup_MWh])}
      />
    </figure>
  );
}

/** Tornado: low-high range per driver around the base value. */
export function Tornado({ rows, base, title }: { rows: { driver: string; low: number; high: number; label: string }[]; base: number; title: string }) {
  const rowH = 44, padL = 210, padR = 70;
  const H = rows.length * rowH + 30;
  const lo = Math.min(...rows.map((r) => r.low)), hi = Math.max(...rows.map((r) => r.high));
  const span = Math.max(hi - base, base - lo) * 1.1 || 1;
  const xs = (v: number) => padL + ((v - (base - span)) / (2 * span)) * (W - padL - padR);
  return (
    <figure className="w-full">
      <figcaption className="mb-2 text-base font-semibold">{title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={title}>
        <line x1={xs(base)} x2={xs(base)} y1={0} y2={H - 24} stroke="var(--ink-2)" />
        <text x={xs(base)} y={H - 6} fontSize={12} textAnchor="middle" fill="var(--ink-2)" className="tnum">
          base ${num(base)}/MWh
        </text>
        {rows.map((r, i) => {
          const y0 = i * rowH + 10;
          const x0 = xs(r.low), x1 = xs(r.high);
          return (
            <g key={r.driver}>
              <text x={padL - 12} y={y0 + 16} fontSize={14} textAnchor="end" fill="var(--ink)">
                {r.label}
              </text>
              <rect x={x0} y={y0 + 2} width={Math.max(x1 - x0, 2)} height={20} rx={4} fill="var(--s1)" />
              <text x={x0 - 6} y={y0 + 17} fontSize={12} textAnchor="end" fill="var(--ink-2)" className="tnum">
                ${num(r.low)}
              </text>
              <text x={x1 + 6} y={y0 + 17} fontSize={12} fill="var(--ink-2)" className="tnum">
                ${num(r.high)}
              </text>
            </g>
          );
        })}
      </svg>
      <TableToggle
        caption={title}
        head={["Driver", "Low $/MWh", "High $/MWh"]}
        rows={rows.map((r) => [r.label, r.low, r.high])}
      />
    </figure>
  );
}

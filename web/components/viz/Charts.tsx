"use client";
import { useId, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, LabelList, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Site2Data } from "@/lib/types";
import { MONTHS, dec, int } from "@/lib/format";
import { FUEL_LABEL } from "@/lib/model";

const tip = { contentStyle: { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 10, fontSize: 17, color: "var(--ink)" }, labelStyle: { color: "var(--ink)", fontWeight: 700 }, itemStyle: { color: "var(--ink)" } };
const axisTick = { fill: "var(--ink2)", fontSize: 17 };
/** Outdoor axis from finite readings only, padded 2 C; falls back to auto when a week has none. */
const outdoorDomain = (rows: { outdoor_C: number }[]): [number, number] | ["auto", "auto"] => {
  const t = rows.map((r) => r.outdoor_C).filter(Number.isFinite);
  return t.length ? [Math.floor(Math.min(...t)) - 2, Math.ceil(Math.max(...t)) + 2] : ["auto", "auto"];
};
const axisLine = { stroke: "var(--line)" };

export function Legend({ items }: { items: { color: string; label: string; dashed?: boolean; hatch?: boolean }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-caption text-ink list-none p-0 m-0">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          <span aria-hidden className={i.hatch ? "inline-block w-5 h-3 rounded-sm hatch-swatch" : "inline-block w-5 h-1.5 rounded"} style={i.hatch ? undefined : { background: i.dashed ? "transparent" : i.color, borderTop: i.dashed ? `3px dashed ${i.color}` : undefined }} />
          {i.label}
        </li>
      ))}
    </ul>
  );
}

export function MonthlyChart({ d }: { d: Site2Data }) {
  const rows = d.monthly.map((m) => ({
    name: MONTHS[m.month - 1],
    supply: m.supply_MWh / 1000,
    delivered: m.delivered_MWh / 1000,
    backup: m.backup_MWh / 1000,
    demand: m.demand_MWh / 1000,
  }));
  return (
    <div className="flex flex-col h-full min-h-0">
      <Legend items={[{ color: "var(--amber)", label: "Heat the data center produces" }, { color: "var(--ember)", label: "Heat the network delivers" }, { color: "var(--ink2)", label: "Backup fuel" }]} />
      <div className="flex-1 min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} margin={{ top: 14, right: 12, left: 6, bottom: 4 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 4" />
            <XAxis dataKey="name" tick={axisTick} axisLine={axisLine} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} width={80} unit=" GWh" />
            <Tooltip {...tip} formatter={(v) => `${dec(Number(v), 1)} GWh`} />
            <Area isAnimationActive={false} type="monotone" dataKey="supply" name="Heat the data center produces" stroke="var(--amber)" strokeWidth={3} fill="var(--amber)" fillOpacity={0.22} />
            <Bar isAnimationActive={false} dataKey="delivered" stackId="a" name="Heat the network delivers" fill="var(--ember)" radius={[0, 0, 0, 0]} maxBarSize={34}>
              <LabelList dataKey="delivered" content={(p) => {
                const v = Number(p.value ?? 0);
                const x = Number(p.x ?? 0) + Number(p.width ?? 0) / 2;
                const y = Number(p.y ?? 0) - 8;
                return <text x={x} y={y} textAnchor="middle" fontSize={17} fontWeight={700} fill="var(--ember-text)" stroke="var(--bg)" strokeWidth={4} paintOrder="stroke" className="num">{dec(v, 1)}</text>;
              }} />
            </Bar>
            <Bar isAnimationActive={false} dataKey="backup" stackId="a" name="Backup fuel" fill="var(--ink2)" radius={[4, 4, 0, 0]} maxBarSize={34} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const DAY = (h: number) => `Day ${Math.floor(h / 24) + 1}`;

export function WeekChart({ d, initial = "winter" }: { d: Site2Data; initial?: "winter" | "summer" }) {
  const [wk, setWk] = useState<"winter" | "summer">(initial);
  const rows = d.weeks?.[wk];
  const buttons = (
    <div role="group" aria-label="Choose week" className="flex gap-2">
      <button className="btn" aria-pressed={wk === "winter"} onClick={() => setWk("winter")}>Cold winter week</button>
      <button className="btn" aria-pressed={wk === "summer"} onClick={() => setWk("summer")}>Summer week</button>
    </div>
  );
  if (!rows?.length) return <div className="flex flex-col gap-3">{buttons}<p className="text-caption text-ink2 m-0">No hourly data for this week in the current data file.</p></div>;
  const peak = rows.reduce((m, r) => (r.backup_MW > m.backup_MW ? r : m), rows[0]);
  const showPeak = peak && peak.backup_MW >= 0.05;
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center gap-3 flex-wrap">
        {buttons}
        <Legend items={[{ color: "var(--ember)", label: "Heat delivered" }, { color: "var(--ink2)", label: showPeak ? `Backup (peak ${dec(peak.backup_MW, 1)} MW)` : "Backup" }]} />
      </div>
      <div className="flex-1 min-h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ top: 14, right: 12, left: 6, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 4" />
            <XAxis dataKey="h" type="number" domain={[0, 167]} ticks={[0, 24, 48, 72, 96, 120, 144]} tickFormatter={DAY} tick={axisTick} axisLine={axisLine} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} width={80} unit=" MW" />
            <Tooltip {...tip} labelFormatter={(h) => `${DAY(Number(h))}, hour ${Number(h) % 24}`} formatter={(v) => `${dec(Number(v), 1)} MW`} />
            <Area isAnimationActive={false} type="monotone" dataKey="delivered_MW" stackId="1" name="Heat delivered" stroke="var(--ember)" strokeWidth={2} fill="var(--ember)" fillOpacity={0.75} />
            <Area isAnimationActive={false} type="monotone" dataKey="backup_MW" stackId="1" name="Backup" stroke="var(--ink2)" strokeWidth={2} fill="var(--ink2)" fillOpacity={0.85} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="h-[60px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ top: 4, right: 12, left: 6, bottom: 0 }}>
            <XAxis dataKey="h" type="number" domain={[0, 167]} hide />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} width={80} unit=" °C" domain={outdoorDomain(rows)} tickCount={3} />
            <ReferenceLine y={0} stroke="var(--line)" />
            <Tooltip {...tip} labelFormatter={(h) => `${DAY(Number(h))}, hour ${Number(h) % 24}`} formatter={(v) => `${dec(Number(v), 1)} °C`} />
            <Area isAnimationActive={false} type="monotone" dataKey="outdoor_C" name="Outdoor" stroke="var(--teal)" strokeWidth={2.5} fill="var(--teal)" fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-caption text-ink2 m-0">Outdoor temperature (°C) for the same week.</p>
    </div>
  );
}

/** Insight title for the cost chart. Every clause is checked against the data, so it can never overclaim (the live bar included). */
export function lcohTitle(d: Site2Data, live?: number): string {
  const f = d.finance;
  const rivals = [f.incumbent_usd_mwh.propane, f.incumbent_usd_mwh.heating_oil, f.incumbent_usd_mwh.electric_resistance];
  const cheapest = Math.min(...rivals);
  const worst = Math.max(f.lcoh_usd_mwh.coop_4pct, f.lcoh_usd_mwh.utility_7pct, f.lcoh_usd_mwh.private_10pct, live ?? 0);
  if (worst < cheapest) return "Recovered heat costs less than propane, oil and electric heat";
  if (live !== undefined) return `At your settings heat costs $${int(live)} per MWh, against $${int(f.incumbent_usd_mwh.propane)} for propane`;
  return "Recovered heat can undercut propane, oil and electric heat";
}

/** Horizontal bars of cost per MWh of delivered heat: ours (3 ownership models) vs what Lansing pays today. */
export function LcohBars({ d, lcohOverride }: { d: Site2Data; lcohOverride?: number }) {
  const f = d.finance;
  // The three ownership bars stay fixed at the model's published values; Explore's live result is its own bar.
  const ours = [
    ...(lcohOverride !== undefined ? [{ name: "Your settings", v: lcohOverride, kind: "live" }] : []),
    { name: "Community co-op (4% finance)", v: f.lcoh_usd_mwh.coop_4pct, kind: "ours" },
    { name: "Utility (7%)", v: f.lcoh_usd_mwh.utility_7pct, kind: "ours" },
    { name: "Private (10%)", v: f.lcoh_usd_mwh.private_10pct, kind: "ours" },
  ];
  const inc = (["natural_gas", "propane", "heating_oil", "electric_resistance"] as const).map((k) => ({
    name: FUEL_LABEL[k] + (k === "natural_gas" ? " (no new hookups)" : ""),
    v: f.incumbent_usd_mwh[k],
    kind: k === "natural_gas" ? "gas" : "inc",
  }));
  const rows = [...ours, ...inc];
  const hid = useId().replace(/:/g, "");
  // Hatched fill for what Lansing pays today, so the two groups differ by pattern as well as colour.
  const color = (k: string) => (k === "live" ? "var(--ink)" : k === "ours" ? "var(--teal)" : k === "gas" ? `url(#${hid}-gas)` : `url(#${hid}-inc)`);
  const stroke = (k: string) => (k === "gas" ? "var(--ink2)" : k === "inc" ? "var(--ember)" : "none");
  return (
    <div className="flex flex-col h-full min-h-0">
      <Legend items={[{ color: "var(--teal)", label: "Recovered heat, cost to produce" }, { color: "var(--ember)", label: "What Lansing pays today", hatch: true }]} />
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 10, right: 70, left: 6, bottom: 4 }}>
            <defs>
              {([["inc", "var(--ember)"], ["gas", "var(--ink2)"]] as const).map(([k, c]) => (
                <pattern key={k} id={`${hid}-${k}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="8" height="8" fill={c} fillOpacity={0.16} />
                  <rect width="3.5" height="8" fill={c} />
                </pattern>
              ))}
            </defs>
            <CartesianGrid horizontal={false} strokeDasharray="3 4" />
            <XAxis type="number" tick={axisTick} axisLine={axisLine} tickLine={false} unit="" domain={[0, "dataMax + 20"]} tickFormatter={(v) => `$${v}`} />
            <YAxis type="category" dataKey="name" width={236} tick={{ fill: "var(--ink)", fontSize: 16 }} axisLine={false} tickLine={false} />
            <Tooltip {...tip} formatter={(v) => `$${int(Number(v))} per MWh of heat`} />
            <Bar isAnimationActive={false} dataKey="v" radius={[0, 6, 6, 0]} barSize={26}>
              {rows.map((r) => <Cell key={r.name} fill={color(r.kind)} stroke={stroke(r.kind)} strokeWidth={1.5} />)}
              <LabelList dataKey="v" position="right" formatter={(v) => `$${int(Number(v))}`} fill="var(--ink)" fontSize={17} fontWeight={700} className="num" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-caption text-ink2 m-0">US dollars per MWh of heat delivered to the building (1 MWh = 1,000 kWh).</p>
    </div>
  );
}

/** Tornado of LCOH sensitivity. */
export function Tornado({ d }: { d: Site2Data }) {
  const base = d.finance.lcoh_usd_mwh.coop_4pct;
  const rows = d.finance.tornado.map((t) => ({ name: t.driver, low: t.low - base, high: t.high - base, lo: t.low, hi: t.high })).sort((a, b) => b.hi - b.lo - (a.hi - a.lo));
  return (
    <div className="h-full min-h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" stackOffset="sign" margin={{ top: 6, right: 40, left: 6, bottom: 4 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 4" />
          <XAxis type="number" tick={axisTick} axisLine={axisLine} tickLine={false} tickFormatter={(v) => `${v > 0 ? "+" : ""}$${v}`} />
          <YAxis type="category" dataKey="name" width={220} tick={{ fill: "var(--ink)", fontSize: 16 }} axisLine={false} tickLine={false} />
          <ReferenceLine x={0} stroke="var(--ink)" />
          <Tooltip {...tip} formatter={(v) => `${Number(v) > 0 ? "+" : ""}$${dec(Number(v), 0)} per MWh vs base`} />
          <Bar isAnimationActive={false} dataKey="low" stackId="s" fill="var(--teal)" name="Low case" />
          <Bar isAnimationActive={false} dataKey="high" stackId="s" fill="var(--ember)" name="High case" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const RING_NAME: Record<string, string> = { onsite: "On-site farm campus", corridor: "Corridor homes", town: "Town center" };
const RING_COLOR: Record<string, string> = { onsite: "var(--teal)", corridor: "var(--ember)", town: "var(--violet)", ashp: "var(--ink2)" };

/** Cost of heat by ring (7% finance) against what propane costs today. */
export function RingLcoh({ d, ringL }: { d: Site2Data; ringL: Partial<Record<string, number>> }) {
  const propane = d.finance.incumbent_usd_mwh.propane;
  /** Verdict derived from the data, never fixed per ring: below propane pays for itself; failing the gate is not built. */
  const verdict = (r: { id: string; v: number }) => {
    if (r.id === "ashp") return "the honest alternative";
    if (r.v < propane) return "pays for itself";
    const ring = d.rings.find((x) => x.id === r.id);
    return ring?.passes_gate === false ? "not built" : "needs a benefit fund";
  };
  const rows: { id: string; name: string; v: number }[] = (["onsite", "corridor", "town"] as const).filter((k) => ringL[k] !== undefined).map((k) => ({ id: k, name: RING_NAME[k], v: ringL[k] as number }));
  rows.push({ id: "ashp", name: "Air-source heat pump per home", v: d.finance.incumbent_usd_mwh.air_source_hp });
  const below = rows.filter((r) => r.id !== "ashp" && r.v < propane);
  const max = Math.max(propane * 1.4, ...rows.map((r) => r.v)) * 1.3;
  return (
    <div className="flex flex-col h-full min-h-0">
      <p className="m-0 font-bold text-body">{below.length === 1 ? `Only the ${RING_NAME[below[0].id].toLowerCase()} undercuts propane's $${int(propane)} per MWh` : "Cost to make heat, by ring"} <span className="font-semibold text-ink2">($ per MWh, 7% finance)</span></p>
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 26, right: 30, left: 6, bottom: 4 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 4" />
            <XAxis type="number" domain={[0, Math.ceil(max / 100) * 100]} tick={axisTick} axisLine={axisLine} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <YAxis type="category" dataKey="name" width={210} tick={{ fill: "var(--ink)", fontSize: 16 }} axisLine={false} tickLine={false} />
            <Tooltip {...tip} formatter={(v) => `$${int(Number(v))} per MWh`} />
            <ReferenceLine x={propane} stroke="var(--ember)" strokeWidth={2.5} strokeDasharray="6 4" label={{ value: `Propane today $${int(propane)}`, position: "top", fill: "var(--ember-text)", fontSize: 15, fontWeight: 700 }} />
            <Bar isAnimationActive={false} dataKey="v" barSize={34} radius={[0, 6, 6, 0]}>
              {rows.map((r) => <Cell key={r.id} fill={RING_COLOR[r.id]} />)}
              <LabelList dataKey="v" position="right" content={(p) => {
                const i = Number(p.index ?? 0);
                const r = rows[i];
                if (!r) return null;
                const x = Number(p.x ?? 0) + Number(p.width ?? 0) + 8;
                const y = Number(p.y ?? 0) + Number(p.height ?? 0) / 2;
                return <text x={x} y={y} dominantBaseline="middle" fontSize={16} fill="var(--ink)"><tspan fontWeight={700}>${int(r.v)}</tspan><tspan fill="var(--ink2)"> {verdict(r)}</tspan></text>;
              }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

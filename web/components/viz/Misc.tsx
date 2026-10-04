"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { motion, useReducedMotion } from "framer-motion";
import type { AppData, FuelKey, Site2Data } from "@/lib/types";
import { cop, FUEL_LABEL, HOME_SIZES, household, isDirect, CAPTURE_TEMP_C } from "@/lib/model";
import { dec, int, usd } from "@/lib/format";
import { ringColor, ringShort, ringText } from "../ui";

export function QrCode({ url, size = 160, label, hideCaption }: { url: string; size?: number; label?: string; hideCaption?: boolean }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    let live = true;
    QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#000000", light: "#ffffff" } })
      .then((s) => live && setSvg(s))
      .catch(() => live && setSvg(""));
    return () => { live = false; };
  }, [url]);
  return (
    <figure className="m-0 inline-flex flex-col items-center gap-1">
      <div style={{ width: size, height: size, background: "#fff", borderRadius: 8, padding: 4 }} role="img" aria-label={label ?? `QR code linking to ${url}`} dangerouslySetInnerHTML={{ __html: svg }} />
      {!hideCaption && <figcaption className="text-[1rem] text-ink2 break-all text-center" style={{ maxWidth: size + 40 }}>{url}</figcaption>}
    </figure>
  );
}

/** Supply vs demand, drawn as two proportional bars. */
export function RatioBars({ d }: { d: Site2Data }) {
  const calm = useReducedMotion();
  const availMWh = d.supply.heat_available_GWh * 1000;
  const demand = d.totals.heat_delivered_MWh;
  const ratio = availMWh / demand;
  const pct = d.totals.share_of_available_pct;
  const used = d.rings.filter((r) => !r.conditional);
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-end gap-4 flex-wrap">
        <div className="serif font-bold num leading-none text-ember-text" style={{ fontSize: "clamp(4rem,9vw,8rem)" }}>{dec(ratio, 1)}&times;</div>
        <div className="text-[1.375rem] text-ink2 pb-3 max-w-[16ch] leading-tight">more heat than the network uses</div>
      </div>
      <div>
        <div className="flex justify-between text-[1.125rem] mb-1.5"><b>Heat the data center produces</b><span className="num">{int(d.supply.heat_available_GWh)} GWh per year</span></div>
        <motion.div className="h-14 rounded-xl origin-left" style={{ background: "var(--amber)" }} initial={calm ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: "easeOut" }} aria-hidden />
      </div>
      <div>
        <div className="flex justify-between text-[1.125rem] mb-1.5"><b>Heat the network uses ({dec(pct, 1)}%)</b><span className="num">{dec(demand / 1000, 0)} GWh per year</span></div>
        <div className="flex h-14 rounded-xl overflow-hidden" style={{ width: `${pct}%`, minWidth: 90, gap: 2 }} aria-hidden>
          {used.map((r) => (
            <motion.div key={r.id} style={{ flex: r.annual_MWh, background: ringColor(r.id) }} initial={calm ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }} className="origin-left" />
          ))}
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 mt-2 list-none p-0 text-[1.0625rem]">
          {used.map((r) => (
            <li key={r.id}><span aria-hidden className="inline-block w-3.5 h-3.5 rounded-sm mr-2 align-middle" style={{ background: ringColor(r.id) }} />{ringShort(r.id)} <span className="num text-ink2">{dec(r.annual_MWh / 1000, 1)} GWh</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Temperature ladder: what each user needs vs what the data center can hand over. */
export function TempLadder({ data }: { data: AppData }) {
  const d = data.site2;
  const rows = data.offtakers.filter((o) => o.ring !== "none").sort((a, b) => a.supply_temp_C - b.supply_temp_C);
  const Tliq = d.supply.capture_temp_C;
  const Tair = CAPTURE_TEMP_C.air;
  const x0 = 360, x1 = 960, tMin = 10, tMax = 80, rowH = 38, top = 74;
  const X = (t: number) => x0 + ((t - tMin) / (tMax - tMin)) * (x1 - x0);
  const H = top + rows.length * rowH + 50;
  return (
    <svg viewBox={`0 0 1000 ${H}`} className="w-full h-full block" role="img" aria-label="Temperature ladder: users on the left, the temperature each needs on the horizontal axis, and where air-cooled and liquid-cooled data center heat arrive.">
      <rect x={X(tMin)} y={top - 10} width={X(Tliq) - X(tMin)} height={rows.length * rowH + 14} fill="var(--teal)" opacity="0.14" />
      <rect x={X(Tliq)} y={top - 10} width={x1 - X(Tliq)} height={rows.length * rowH + 14} fill="var(--ember)" opacity="0.12" />
      {[20, 30, 40, 50, 60, 70, 80].map((t) => (
        <g key={t}>
          <line x1={X(t)} x2={X(t)} y1={top - 10} y2={top + rows.length * rowH + 4} stroke="var(--line)" />
          <text x={X(t)} y={top + rows.length * rowH + 30} fontSize="17" fill="var(--ink2)" textAnchor="middle" className="num">{t} °C</text>
        </g>
      ))}
      <line x1={X(Tair)} x2={X(Tair)} y1={top - 18} y2={top + rows.length * rowH + 4} stroke="var(--ink2)" strokeWidth="3" strokeDasharray="6 5" />
      <line x1={X(Tliq)} x2={X(Tliq)} y1={top - 18} y2={top + rows.length * rowH + 4} stroke="var(--ember)" strokeWidth="4" />
      <text x={X(Tair) - 6} y={top - 30} fontSize="18" fontWeight="700" fill="var(--ink)" textAnchor="end">Air-cooled: {Tair} °C</text>
      <text x={X(Tliq) + 8} y={top - 30} fontSize="18" fontWeight="700" fill="var(--ember-text)">Liquid-cooled: {Tliq} °C</text>
      <text x={x0 - 12} y={top - 30} fontSize="17" fill="var(--teal-text)" textAnchor="end" fontWeight="700">Direct heat</text>
      <text x={x1} y={top - 52} fontSize="17" fill="var(--ember-text)" textAnchor="end" fontWeight="700">Heat pump boost</text>
      {rows.map((o, i) => {
        const y = top + i * rowH + rowH / 2 - 6;
        const direct = isDirect(o.supply_temp_C, Tliq);
        const c = cop(o.supply_temp_C, Tliq);
        return (
          <g key={o.id}>
            <text x={x0 - 14} y={y + 6} fontSize="18" fontWeight="600" fill="var(--ink)" textAnchor="end">{o.name.length > 30 ? o.name.slice(0, 29).replace(/[ /,]+$/, "") + "…" : o.name}</text>
            <line x1={X(tMin)} x2={X(o.supply_temp_C)} y1={y} y2={y} stroke={ringColor(o.ring)} strokeWidth="3" opacity="0.5" />
            <circle cx={X(o.supply_temp_C)} cy={y} r="9" fill={ringColor(o.ring)} stroke="var(--bg)" strokeWidth="3" />
            <text x={X(o.supply_temp_C) + (o.supply_temp_C > 60 ? -16 : 16)} textAnchor={o.supply_temp_C > 60 ? "end" : "start"} y={y + 6} fontSize="17" fill="var(--ink)" className="num" fontWeight="700" stroke="var(--bg)" strokeWidth="4" paintOrder="stroke">
              {o.supply_temp_C} °C <tspan fill="var(--ink2)" fontWeight="500">{direct ? "direct" : c >= 8 ? "small boost" : `boost, COP ${dec(c, 1)}`}</tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const FUELS: FuelKey[] = ["propane", "heating_oil", "natural_gas", "electric_resistance"];

export function HouseholdCalc({ d }: { d: Site2Data }) {
  const [fuel, setFuel] = useState<FuelKey>("propane");
  const [size, setSize] = useState<(typeof HOME_SIZES)[number]["id"]>("typical");
  const f = (HOME_SIZES.find((s) => s.id === size) ?? HOME_SIZES[0]).factor;
  const r = household(d, fuel, f);
  const saves = r.savingsUsd >= 0;
  const maxBar = Math.max(r.incumbentCost, r.coopCost);
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-center w-full">
      <div>
        <p className="kicker m-0 mb-3">Step 7 · Your household</p>
        <h1 className="headline m-0">
          {saves ? <>A {size === "typical" ? "typical" : size} {FUEL_LABEL[fuel].toLowerCase()} home saves about <span className="text-teal-text num">{usd(r.savingsUsd)}</span> a year</> : <>Gas is already cheap; this heat is for homes the gas pipe cannot reach</>}
        </h1>
        <div className="mt-6 grid gap-4">
          <div>
            <div className="font-bold mb-2" id="fuel-label">What do you heat with today?</div>
            <div role="radiogroup" aria-labelledby="fuel-label" className="flex flex-wrap gap-2">
              {FUELS.map((k) => (
                <button key={k} role="radio" aria-checked={fuel === k} className="btn" onClick={() => setFuel(k)}>{FUEL_LABEL[k]}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="font-bold mb-2" id="size-label">How big is the home?</div>
            <div role="radiogroup" aria-labelledby="size-label" className="flex flex-wrap gap-2">
              {HOME_SIZES.map((s) => (
                <button key={s.id} role="radio" aria-checked={size === s.id} className="btn" onClick={() => setSize(s.id)}>{s.label} <span className="font-normal opacity-80 text-[1rem]">{s.detail}</span></button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="card p-6 grid gap-5" aria-live="polite">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="serif num font-bold leading-none" style={{ fontSize: "clamp(2.5rem,4.6vw,4.5rem)", color: saves ? "var(--teal-text)" : "var(--ember-text)" }}>{saves ? usd(r.savingsUsd) : `-${usd(-r.savingsUsd)}`}<span className="unit">per year</span></div>
            <div className="text-ink2">{saves ? "saved on heating" : "vs today (extra cost)"}</div>
          </div>
          <div>
            <div className="serif num font-bold leading-none text-ink" style={{ fontSize: "clamp(2.5rem,4.6vw,4.5rem)" }}>{dec(Math.abs(r.co2KgSaved) / 1000, 1)}<span className="unit">t</span></div>
            <div className="text-ink2">tonnes of CO₂ {r.co2KgSaved >= 0 ? "avoided" : "added"} per year</div>
          </div>
        </div>
        <div className="grid gap-3">
          {[{ l: `${FUEL_LABEL[fuel]} today`, v: r.incumbentCost, c: "var(--ember)" }, { l: "Community heat", v: r.coopCost, c: "var(--teal)" }].map((b) => (
            <div key={b.l}>
              <div className="flex justify-between text-[1.0625rem]"><span>{b.l}</span><b className="num">{usd(b.v)} per year</b></div>
              <div className="h-7 rounded-md" style={{ width: `${(b.v / maxBar) * 100}%`, background: b.c, transition: "width .4s" }} aria-hidden />
            </div>
          ))}
        </div>
        <p className="m-0 text-[1rem] text-ink2 num">Home uses {dec(r.heatMWh, 1)} MWh of heat per year. Community heat is priced at ${int(d.finance.tariff_usd_mwh)} per MWh; low-income tariff ${int(d.finance.low_income_tariff_usd_mwh)} per MWh.</p>
      </div>
    </div>
  );
}

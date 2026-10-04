"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import type { AppData, InputRow } from "@/lib/types";
import { BASE_PATH } from "@/lib/config";
import { int, usd } from "@/lib/format";
import { Swash } from "./Paper";

function Card({ href, bg, swash, title, text, mock, className = "" }: { href: string; bg: string; swash: string; title: string; text: string; mock: ReactNode; className?: string }) {
  return (
    <Link prefetch={false} href={href} className={`bento no-underline text-ink flex flex-col justify-between p-[clamp(1.25rem,3vw,2.5rem)] min-h-[420px] ${className}`} style={{ background: bg }}>
      <div className="relative flex-1 flex items-center justify-center py-6">
        <Swash color={swash} className="w-[88%] max-w-[440px] -z-10 opacity-90" />
        <div aria-hidden className="relative w-full max-w-[340px]">{mock}</div>
      </div>
      <div>
        <h3 className="m-0 text-ink leading-tight" style={{ fontSize: "clamp(1.6rem, 1.2rem + 1vw, 2.1rem)" }}>{title} <span aria-hidden className="font-sans text-[0.7em]">&rarr;</span></h3>
        <p className="m-0 mt-2 text-ink2 max-w-[44ch]">{text}</p>
      </div>
    </Link>
  );
}

const Bar = ({ label, pct, color, value }: { label: string; pct: number; color: string; value: string }) => (
  <div className="mt-3">
    <div className="flex justify-between text-[1rem] font-semibold"><span>{label}</span><span className="num">{value}</span></div>
    <div className="h-2.5 rounded-full bg-[#efe8dc] mt-1.5 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.max(4, Math.min(100, pct))}%`, background: color }} /></div>
  </div>
);

export function Bento({ data }: { data: AppData }) {
  const d = data.site2;
  const f = d.finance;
  const propane = f.incumbent_usd_mwh.propane;
  const lcoh = f.lcoh_usd_mwh.utility_7pct;
  const coopA = d.finance.lcoh_usd_mwh.coop_4pct, coopB = data.site1.finance.lcoh_usd_mwh.coop_4pct;
  const top = Math.max(coopA, coopB);
  const [rows, setRows] = useState<InputRow[] | null>(null);
  useEffect(() => {
    const ac = new AbortController();
    fetch(`${BASE_PATH}/data/input_register.json`, { cache: "no-cache", signal: ac.signal })
      .then((r) => (r.ok ? (r.json() as Promise<InputRow[]>) : null)).then((j) => j && setRows(j)).catch(() => {});
    return () => ac.abort();
  }, []);
  const n = rows?.length ?? 0;
  const count = (k: InputRow["confidence"]) => rows?.filter((r) => (k === "unverified" ? !["sourced", "assumption"].includes(r.confidence) : r.confidence === k)).length ?? 0;
  const tariffPct = Math.round((f.tariff_usd_mwh / propane) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <Card className="lg:col-span-7" href="/explore/" bg="var(--sage)" swash="#f6f8e6" title="Explore the model" text="Move the price, the finance and the cooling, and watch the bill, the cost of heat and the carbon change live."
        mock={
          <div className="mock p-5">
            <p className="m-0 text-[0.9rem] font-bold tracking-[0.12em] uppercase text-[#6b5a4b]">Price of heat</p>
            <div className="relative h-2.5 rounded-full bg-[#ece6d6] mt-4">
              <div className="absolute inset-y-0 left-0 rounded-full bg-[#3b2a1e]" style={{ width: `${tariffPct}%` }} />
              <div className="absolute -top-[7px] w-6 h-6 rounded-full bg-white border-2 border-[#3b2a1e] shadow" style={{ left: `calc(${tariffPct}% - 12px)` }} />
            </div>
            <p className="m-0 mt-3 text-[1rem] text-[#5a4637]"><span className="num font-bold">{tariffPct}%</span> of propane&apos;s price</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-[#f3f6e4] p-3"><div className="text-[0.95rem] text-[#5a4637]">Home saves</div><div className="serif num text-[1.6rem] leading-none mt-1">{usd(f.household.savings_vs_propane_usd)}</div></div>
              <div className="rounded-xl bg-[#fdf5df] p-3"><div className="text-[0.95rem] text-[#5a4637]">Cost per MWh</div><div className="serif num text-[1.6rem] leading-none mt-1">{usd(lcoh)}</div></div>
            </div>
          </div>
        } />
      <Card className="lg:col-span-5" href="/compare/" bg="var(--butter)" swash="#fbe7a6" title="Compare the sites" text="Lansing against the Manhattan site, side by side on heat, cost and carbon."
        mock={
          <div className="mock p-5">
            <p className="m-0 text-[0.9rem] font-bold tracking-[0.12em] uppercase text-[#6b5a4b]">Cost of heat, community finance</p>
            {[{ l: "Lansing", v: coopA, c: "#2a8a84" }, { l: "Site 1", v: coopB, c: "#c4572a" }].map((b) => (
              <div key={b.l} className="mt-4">
                <div className="flex justify-between text-[1rem] font-semibold"><span>{b.l}</span><span className="num">${int(b.v)}/MWh</span></div>
                <div className="h-6 rounded-lg mt-1.5" style={{ width: `${(b.v / top) * 100}%`, background: b.c }} />
              </div>
            ))}
          </div>
        } />
      <Card className="lg:col-span-5" href="/sources/" bg="var(--peach)" swash="#f6c1aa" title="See every source" text="Every input the model uses, with its value, unit, source and how sure we are."
        mock={
          <div className="mock p-5">
            <p className="m-0 text-[0.9rem] font-bold tracking-[0.12em] uppercase text-[#6b5a4b]">Input register</p>
            <p className="serif m-0 text-[1.5rem] mt-1"><span className="num">{n ? int(n) : "..."}</span> inputs</p>
            <Bar label="Sourced" value={int(count("sourced"))} pct={n ? (count("sourced") / n) * 100 : 0} color="#c4572a" />
            <Bar label="Assumption" value={int(count("assumption"))} pct={n ? (count("assumption") / n) * 100 : 0} color="#d9a07e" />
            <Bar label="Unverified" value={int(count("unverified"))} pct={n ? (count("unverified") / n) * 100 : 0} color="#8a6f5c" />
          </div>
        } />
      <Card className="lg:col-span-7" href="/how/" bg="var(--sky)" swash="#bfd4d8" title="How the heat moves" text="From the server loop through a heat pump to the greenhouse, the fish farm and the homes on the corridor."
        mock={
          <svg viewBox="0 0 340 170" className="w-full">
            <defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#c4572a" /></marker></defs>
            <rect x="8" y="58" width="78" height="56" rx="12" fill="#fffefb" stroke="#3b2a1e" strokeWidth="2" />
            <text x="47" y="92" textAnchor="middle" fontSize="15" fontWeight="700" fill="#2b1d14">Servers</text>
            <circle cx="170" cy="86" r="38" fill="#fffefb" stroke="#3b2a1e" strokeWidth="2" />
            <text x="170" y="82" textAnchor="middle" fontSize="14" fontWeight="700" fill="#2b1d14">Heat</text><text x="170" y="98" textAnchor="middle" fontSize="14" fontWeight="700" fill="#2b1d14">pump</text>
            <path d="M88 74 C106 60 118 62 130 72" stroke="#c4572a" strokeWidth="4" fill="none" markerEnd="url(#arr)" strokeLinecap="round" />
            <path d="M132 100 C118 110 104 108 90 98" stroke="#2a8a84" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="2 7" />
            <path d="M206 70 C230 40 250 36 270 40" stroke="#c4572a" strokeWidth="4" fill="none" markerEnd="url(#arr)" strokeLinecap="round" />
            <path d="M206 102 C232 132 250 136 270 132" stroke="#c4572a" strokeWidth="4" fill="none" markerEnd="url(#arr)" strokeLinecap="round" />
            <path d="M276 52 L276 30 Q300 12 324 30 L324 52 Z" fill="#e8f2ee" stroke="#3b2a1e" strokeWidth="2" />
            <text x="300" y="70" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2b1d14">Greenhouse</text>
            <path d="M278 146 L278 126 L300 108 L322 126 L322 146 Z" fill="#fbe1d6" stroke="#3b2a1e" strokeWidth="2" />
            <text x="300" y="164" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2b1d14">Homes</text>
          </svg>
        } />
    </div>
  );
}

const fs=require("fs");
function edit(f,R){let s=fs.readFileSync(f,"utf8");for(const [a,b] of R){if(!s.includes(a)){console.log("MISSING",f,a.slice(0,60));continue;}s=s.split(a).join(b);}fs.writeFileSync(f,s);}
edit("lib/model.ts",[
["export const COP_MAX = 8;","export const COP_MIN = 2; // same clip as the Python model: COP in [2, 6]\nexport const COP_MAX = 6;"],
["  if (denom <= 0) return COP_MAX;\n  return Math.min(COP_MAX, (eta * sink) / denom);","  if (denom <= 0) return COP_MAX;\n  return Math.max(COP_MIN, Math.min(COP_MAX, (eta * sink) / denom));"],
["/** cop = eta * T_sink_K / (T_sink_K - T_source_K + 2*approach). Capped at COP_MAX. */","/** cop = eta * T_sink_K / (T_sink_K - T_source_K + 2*approach), clipped to [COP_MIN, COP_MAX] like the Python model. */"],
["export function baseParams(d: Site2Data): Params {\n  return {\n    elecPrice: d.finance.elec_price_usd_mwh ?? 140,",
"/** Industrial (central heat pump + pumping) electricity price, $/MWh. Read from the data file; never hardcoded. */\nexport function baseElecPrice(d: Site2Data): number {\n  const e = d.finance.elec_price_usd_mwh as unknown;\n  if (typeof e === \"number\") return e;\n  if (e && typeof e === \"object\") {\n    const o = e as Record<string, number>;\n    if (typeof o.industrial === \"number\") return o.industrial;\n  }\n  const k = d.extras?.electricity_rates_usd_kwh?.central_hp_and_pumping_industrial;\n  return typeof k === \"number\" ? k * 1000 : 108;\n}\n\nexport function baseParams(d: Site2Data): Params {\n  return {\n    elecPrice: baseElecPrice(d),"],
["  const l = lcoh(d.finance.capex_musd.total * 1e6 * scale, d.finance.opex_musd_yr * 1e6 * scale, p.elecPrice, elec, delivered, p.discountPct / 100);",
"  // opex_musd_yr already contains electricity at the base price, so only the price DELTA is added (no double count).\n  const l = lcoh(d.finance.capex_musd.total * 1e6 * scale, d.finance.opex_musd_yr * 1e6 * scale, p.elecPrice - baseElecPrice(d), elec, delivered, p.discountPct / 100);"],
["  const tariff = d.finance.tariff_usd_mwh * rate(s.lcoh, b.lcoh);","  const tariff = d.finance.tariff_usd_mwh; // policy-set (0.8x propane), does not move with cost"],
["  householdSavingsOil: number;\n  co2TYr","  householdSavingsOil: number;\n  marginUsdMWh: number; // tariff minus LCOH at the scenario's discount rate\n  co2TYr"],
["    co2TYr: d.impact.co2_avoided_t_yr * rate(s.co2, b.co2),","    marginUsdMWh: tariff - lcohV,\n    co2TYr: d.impact.co2_avoided_t_yr * rate(s.co2, b.co2),"],
]);
let t=fs.readFileSync("lib/types.ts","utf8");
t=t.replace("elec_price_usd_mwh?: number;","elec_price_usd_mwh?: number | { industrial: number; residential: number };");
fs.writeFileSync("lib/types.ts",t);
edit("lib/model.test.ts",[["expect(cop(53, 50)).toBe(8);","expect(cop(53, 50)).toBe(6);\n    expect(cop(40, 60)).toBeGreaterThanOrEqual(2);"]]);
edit("components/Explore.tsx",[
['<th className="pb-1 font-semibold text-right">COP</th>','<th className="pb-1 font-semibold text-right">Share of heat</th>'],
['<td className="num text-right">{r.direct ? "direct" : dec(r.cop, 1)}</td>','<td className="num text-right">{r.demandMWh > 0 ? `${dec((r.demandMWh / Math.max(1, s.byRing.reduce((a, x) => a + x.demandMWh, 0))) * 100, 0)}%` : "off"}</td>'],
['Each ring&rsquo;s COP uses {p.cooling === "air" ? 30 : 50} °C source heat. Results','Heat pumps use {p.cooling === "air" ? 30 : 50} °C source heat; COP is clipped to 2 to 6 like the hourly model. Results'],
]);
edit("components/story/steps.tsx",[
["const storageMWh = (d.totals.storage_m3 * 1.163 * 40) / 1000; // water: 1.163 kWh/m3/K, 40 K swing","const storageMWh = (d.totals.storage_m3 * 1.163 * 20) / 1000; // water: 1.163 kWh/m3/K, 20 K swing (model config)"],
["{cba.per_year_musd !== undefined && <>, <span className=\"num\">${dec(cba.per_year_musd, 2)}M</span> a year over 30 years</>}","{cba.per_year_annuitized_7pct_musd !== undefined && <>, <span className=\"num\">${dec(cba.per_year_annuitized_7pct_musd, 2)}M</span> a year (annuitized at 7% over 30 years)</>}"],
]);

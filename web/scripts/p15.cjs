const fs=require("fs");
function edit(f,R){let s=fs.readFileSync(f,"utf8");for(const [a,b] of R){if(!s.includes(a)){console.log("MISSING",f,a.slice(0,60));continue;}s=s.split(a).join(b);}fs.writeFileSync(f,s);}
edit("lib/model.ts",[
["function raw(d: Site2Data, p: Params): Raw {","function raw(d: Site2Data, p: Params, baseElecRaw?: number): Raw {"],
["  // opex_musd_yr already contains electricity at the base price, so only the price DELTA is added (no double count).\n  const l = lcoh(d.finance.capex_musd.total * 1e6 * scale, d.finance.opex_musd_yr * 1e6 * scale, p.elecPrice - baseElecPrice(d), elec, delivered, p.discountPct / 100);",
"  // opex_musd_yr already contains electricity. Split it: non-electric opex (scaled with the network) plus\n  // electricity re-priced at the slider value, so electricity is counted exactly once.\n  const elecFileMWh = d.totals.hp_elec_MWh * (elec / (baseElecRaw ?? (elec || 1)));\n  const opexOther = Math.max(0, d.finance.opex_musd_yr * 1e6 - baseElecPrice(d) * d.totals.hp_elec_MWh);\n  const l = lcoh(d.finance.capex_musd.total * 1e6 * scale, opexOther * scale, p.elecPrice, elecFileMWh, delivered, p.discountPct / 100);"],
["  const s = raw(d, p);\n","  const s = raw(d, p, b.hpElecMWh);\n"],
]);

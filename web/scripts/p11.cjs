const fs = require("fs");
function edit(f, pairs) {
  let s = fs.readFileSync(f, "utf8");
  for (const [a, b] of pairs) {
    if (!s.includes(a)) { console.log("MISSING in", f, ":", a.slice(0, 70)); continue; }
    s = s.split(a).join(b);
  }
  fs.writeFileSync(f, s);
}
edit("lib/model.ts", [
  ["    householdSavingsPropane: householdSavings(hh, d.finance.incumbent_usd_mwh.propane, tariff),\n    householdSavingsOil: householdSavings(hh, d.finance.incumbent_usd_mwh.heating_oil, tariff),",
   "    householdSavingsPropane: d.finance.household.savings_vs_propane_usd * rate(householdSavings(hh, d.finance.incumbent_usd_mwh.propane, tariff), householdSavings(hh, d.finance.incumbent_usd_mwh.propane, d.finance.tariff_usd_mwh)),\n    householdSavingsOil: d.finance.household.savings_vs_oil_usd * rate(householdSavings(hh, d.finance.incumbent_usd_mwh.heating_oil, tariff), householdSavings(hh, d.finance.incumbent_usd_mwh.heating_oil, d.finance.tariff_usd_mwh)),"],
]);
edit("components/Explore.tsx", [
  ['<th className="pb-1 font-semibold text-right">COP</th>', '<th className="pb-1 font-semibold text-right">Share</th>'],
  ['<td className="num text-right">{r.direct ? "direct" : dec(r.cop, 1)}</td>', '<td className="num text-right">{r.demandMWh > 0 ? `${dec((r.demandMWh / Math.max(1, s.byRing.reduce((a, x) => a + x.demandMWh, 0))) * 100, 0)}%` : "off"}</td>'],
  ["Each ring&rsquo;s COP uses {p.cooling === \"air\" ? 30 : 50} °C source heat. Results are scaled", "Heat pump source temperature: {p.cooling === \"air\" ? 30 : 50} °C. Results are scaled"],
]);
edit("components/PrintSheet.tsx", [
  ["  const demand = d.rings.reduce((s, r) => s + r.annual_MWh, 0);", "  const demand = d.totals.heat_delivered_MWh;\n  const ha = d.extras?.greenhouse_check?.area_ha;"],
  ["One data center could heat {int(homes)} homes and a year-round farm", "A data center&rsquo;s heat could warm a {ha ? `${int(ha)}-hectare ` : \"\"}year-round farm campus and {int(homes)} homes"],
  ["p-[0.5in] flex flex-col gap-3", "p-[0.4in] flex flex-col gap-2"],
  ["style={{ fontSize: \"25pt\", lineHeight: 1.08 }}", "style={{ fontSize: \"23pt\", lineHeight: 1.08 }}"],
  ["<QrCode url={PUBLIC_URL} size={96} />", "<QrCode url={PUBLIC_URL} size={90} hideCaption />"],
  ["scan for the live model.</div>", "scan for the live model: {PUBLIC_URL}</div>"],
  ["{ n: \"Our heat (community)\"", "{ n: \"Our heat (community-owned)\""],
]);

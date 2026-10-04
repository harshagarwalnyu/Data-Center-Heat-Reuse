// Copies outputs/site2.json into video/src/site2.json and verifies every key the video reads.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "../../outputs/site2.json");
const d = JSON.parse(readFileSync(src, "utf8"));
const need = (p) => {
  const v = p.split(".").reduce((o, k) => (o == null ? o : o[k]), d);
  if (v === undefined || v === null) throw new Error("site2.json missing key: " + p);
};
[
  "supply.heat_available_GWh",
  "finance.lcoh_usd_mwh.coop_4pct",
  "finance.lcoh_usd_mwh.utility_7pct",
  "finance.lcoh_usd_mwh.private_10pct",
  "finance.incumbent_usd_mwh.propane",
  "finance.household.savings_vs_propane_usd",
  "impact.co2_avoided_t_yr",
  "extras.cba.headline_as_pct_of_dc_capex",
  "extras.with_town.town_ring_lcoh_usd_mwh",
].forEach(need);
for (const id of ["onsite", "corridor", "town"]) {
  const r = d.rings.find((x) => x.id === id);
  if (!r) throw new Error("ring missing: " + id);
  for (const k of ["annual_MWh", "lcoh_usd_mwh_7pct", "pipe_km"]) if (r[k] == null) throw new Error(`ring ${id}.${k} missing`);
}
if (d.rings.find((x) => x.id === "corridor").homes == null) throw new Error("corridor.homes missing");
writeFileSync(resolve(here, "../src/site2.json"), JSON.stringify(d));
console.log("site2.json synced, keys verified");

// Writes ILLUSTRATIVE placeholder data in the docs/data-contract.md shape.
// Will not overwrite a real (placeholder !== true) file produced by the Python model.
import fs from "node:fs";
import path from "node:path";
const dir = path.resolve("public/data");
fs.mkdirSync(dir, { recursive: true });
const safeWrite = (name, obj) => {
  const f = path.join(dir, name);
  if (fs.existsSync(f)) {
    try {
      const cur = JSON.parse(fs.readFileSync(f, "utf8"));
      if (cur && (Array.isArray(cur) || cur.placeholder !== true)) {
        console.log("skip real", name);
        return;
      }
    } catch {}
  }
  fs.writeFileSync(f, JSON.stringify(obj, null, 1));
  console.log("wrote", name);
};
const r = (x, d = 0) => Math.round(x * 10 ** d) / 10 ** d;

// ---- Site 2
const IT = 150, LF = 0.8, CAP = 0.75;
const availMWh = IT * 8760 * LF * CAP; // 788,400
const rings = [
  { id: "onsite", name: "On-site agri & community campus", phase: 1, users: ["greenhouse", "aquaculture", "rec center + pool"], annual_MWh: 62000, peak_MW: 14, supply_temp_C: 45, sink_temp_C: 45, pipe_km: 0.5 },
  { id: "corridor", name: "Corridor homes & farms (ambient loop)", phase: 2, homes: 2000, annual_MWh: 36000, peak_MW: 13, supply_temp_C: 20, sink_temp_C: 55, pipe_km: 9 },
  { id: "town", name: "Town center: school campus + town buildings", phase: 3, annual_MWh: 26000, peak_MW: 9, supply_temp_C: 60, sink_temp_C: 60, pipe_km: 11, conditional: true },
];
const delivered = rings.reduce((s, x) => s + x.annual_MWh, 0);
const avgCop = 4.6;
const hpElec = delivered / avgCop;
const monthW = [1.75, 1.55, 1.3, 0.95, 0.6, 0.42, 0.36, 0.38, 0.55, 0.9, 1.3, 1.65];
const sw = monthW.reduce((a, b) => a + b, 0);
const monthly = monthW.map((w, i) => {
  const d = (delivered * w) / sw;
  const back = i === 0 || i === 1 || i === 11 ? d * 0.035 : 0;
  return { month: i + 1, supply_MWh: r(availMWh / 12), demand_MWh: r(d), delivered_MWh: r(d - back), backup_MWh: r(back) };
});
const week = (winter) =>
  Array.from({ length: 168 }, (_, h) => {
    const hod = h % 24, day = Math.floor(h / 24);
    const outdoor = winter
      ? -6 + 5 * Math.sin(((hod - 9) / 24) * 2 * Math.PI) + (day === 2 ? -6 : 0) + day * 0.8
      : 20 + 6 * Math.sin(((hod - 9) / 24) * 2 * Math.PI);
    const morning = Math.exp(-((hod - 7) ** 2) / 8) * 0.25, eve = Math.exp(-((hod - 19) ** 2) / 10) * 0.2;
    const demand = winter ? (22 + (0 - outdoor) * 0.55) * (0.78 + morning + eve) : 7.5 * (0.85 + morning * 0.5);
    const cap = winter ? 34 : 12;
    const deliveredMW = Math.min(demand, cap);
    const storage = winter ? 1200 + 800 * Math.sin((h / 24) * 2 * Math.PI) : 900 + 500 * Math.sin((h / 24) * 2 * Math.PI);
    return { h, demand_MW: r(demand, 2), delivered_MW: r(deliveredMW, 2), storage_MWh: r(storage), backup_MW: r(Math.max(0, demand - deliveredMW), 2), outdoor_C: r(outdoor, 1) };
  });
const site2 = {
  placeholder: true,
  meta: { site: "Lake Hawkeye, Lansing NY", generated: "2026-10-03", scenario: "base" },
  supply: { it_load_MW: IT, load_factor: LF, capture_fraction: CAP, capture_temp_C: 50, heat_available_GWh: r(availMWh / 1000), heat_available_MW_avg: r(availMWh / 8760, 1) },
  rings,
  totals: { heat_delivered_MWh: delivered, share_of_available_pct: r((delivered / availMWh) * 100, 1), hp_elec_MWh: r(hpElec), backup_MWh: r(monthly.reduce((s, m) => s + m.backup_MWh, 0)), unmet_hours: 0, avg_cop: avgCop, storage_m3: 6000 },
  monthly,
  weeks: { winter: week(true), summer: week(false) },
  cop_compare: [{ source: "Air-cooled (30 °C)", cop: 3.7 }, { source: "Liquid-cooled (50 °C)", cop: 5.4 }],
  finance: {
    capex_musd: {
      total: 68,
      lines: [
        { item: "Heat exchangers + side-stream loop", musd: 6, source: "placeholder" },
        { item: "Heat pumps (central + building)", musd: 19, source: "placeholder" },
        { item: "Pipe network (on-site, corridor, main)", musd: 27, source: "placeholder" },
        { item: "Thermal storage tanks", musd: 4, source: "placeholder" },
        { item: "Backup boilers + controls", musd: 5, source: "placeholder" },
        { item: "Soft costs + contingency", musd: 7, source: "placeholder" },
      ],
    },
    opex_musd_yr: 1.6,
    elec_price_usd_mwh: 140,
    lcoh_usd_mwh: { coop_4pct: 77, utility_7pct: 89, private_10pct: 103 },
    incumbent_usd_mwh: { propane: 125, heating_oil: 156, natural_gas: 64, electric_resistance: 245, air_source_hp: 70 },
    tariff_usd_mwh: 100,
    low_income_tariff_usd_mwh: 75,
    household: { typical_MWh_yr: 18, savings_vs_propane_usd: 450, savings_vs_oil_usd: 1008 },
    tornado: [
      { driver: "Electricity price (±30%)", low: 68, high: 86 },
      { driver: "Pipe cost (±30%)", low: 70, high: 85 },
      { driver: "Heat pump COP (±1)", low: 71, high: 85 },
      { driver: "Uptake (60%–100%)", low: 77, high: 93 },
      { driver: "Discount rate (2%–8%)", low: 71, high: 91 },
    ],
    dc_exit: { year: 10, stranded_musd: 9, fallback: "Step-in rights, a decommissioning reserve, and a lake-source heat pump keep the network running." },
  },
  impact: {
    co2_avoided_t_yr: 24500, co2_cars_equiv: 5300, homes_served: 2000, fossil_displaced_MWh: 98000, erf: 0.1,
    water: { note: "Dry coolers stay the primary rejection path; a covenant keeps the 1 MGD lake permit unused for cooling.", fan_energy_saved_MWh: 4200 },
    jobs: 85, local_food_t_yr: 900,
  },
  assumptions: {
    ef_kg_per_MWh_th: { propane: 210, heating_oil: 252, natural_gas: 181, electric_resistance: 0, air_source_hp: 0 },
    fuel_efficiency: { propane: 0.85, heating_oil: 0.82, natural_gas: 0.85, electric_resistance: 1, air_source_hp: 2.8 },
    grid_kg_per_MWh: 110.1,
    discount_rate_base_pct: 4,
  },
  value_by_stakeholder: [
    { who: "Residents", value: "Lower, stable heating bills", metric: "about $450 to $1,000 saved per home per year" },
    { who: "Town of Lansing", value: "A yes with conditions, plus new tax base", metric: "binding Community Benefit + Heat Supply Agreement" },
    { who: "Data center", value: "A social license to operate", metric: "100% cooling backup untouched" },
    { who: "Farms & school", value: "Cheap year-round heat", metric: "45 °C greenhouse heat at near-zero lift" },
  ],
  hdr_scorecard: [
    { lens: "Health", petal: "Human health", claim: "Oil and propane burners leave homes; fresh local food year-round", metric: "homes served" },
    { lens: "Community", petal: "Community", claim: "Heat priced below propane with a low-income tier; jobs on the campus", metric: "jobs created" },
    { lens: "Ecology", petal: "Air", claim: "Fewer combustion burners; quiet dry coolers protect a 41.9 dB baseline", metric: "fossil heat displaced" },
    { lens: "Ecology", petal: "Carbon", claim: "Fossil heat replaced by recovered heat", metric: "t CO2 avoided per year" },
    { lens: "Ecology", petal: "Water", claim: "Closed-loop dry cooling; covenant keeps the 1 MGD lake permit unused for cooling", metric: "no consumptive draw" },
    { lens: "Ecology", petal: "Biodiversity", claim: "Heat-fed greenhouses ease pressure on open farmland, the top local threat", metric: "local food t/yr" },
    { lens: "Ecology", petal: "Nutrients", claim: "Closed-loop aquaponics keeps phosphorus out of Cayuga Lake", metric: "closed loop" },
  ],
  sources: [
    { id: "nyserda", label: "NYSERDA weekly heating fuel prices", url: "https://www.nyserda.ny.gov/Researchers-and-Policymakers/Energy-Prices/Heating-Fuels" },
    { id: "egrid", label: "EPA eGRID2023 (NYUP)", url: "https://www.epa.gov/egrid" },
    { id: "ithaca", label: "Ithaca Voice: Lansing board data center ban", url: "https://ithacavoice.org/2026/09/lansing-board-data-center-ban/" },
  ],
};
safeWrite("site2.json", site2);

// ---- Site 1
const s1avail = 35 * 8760 * 0.8 * 0.5;
safeWrite("site1.json", {
  placeholder: true,
  meta: { site: "111 8th Ave, New York NY", generated: "2026-10-03", scenario: "base" },
  supply: { it_load_MW: 35, load_factor: 0.8, capture_fraction: 0.5, capture_temp_C: 32, heat_available_GWh: r(s1avail / 1000), heat_available_MW_avg: r(s1avail / 8760, 1) },
  totals: { heat_delivered_MWh: 60000, share_of_available_pct: r((60000 / s1avail) * 100, 1), hp_elec_MWh: 20000, backup_MWh: 4000, unmet_hours: 0, avg_cop: 3.0, storage_m3: 800 },
  finance: { lcoh_usd_mwh: { coop_4pct: 128, utility_7pct: 146, private_10pct: 167 }, incumbent_usd_mwh: { natural_gas: 70, electric_resistance: 300 } },
  impact: { co2_avoided_t_yr: 8000, co2_cars_equiv: 1700, homes_served: 3000, fossil_displaced_MWh: 40000 },
  why_not_chosen: [
    { point: "Low-grade heat", detail: "Air-cooled condenser water leaves at 29 to 35 °C, so every building needs its own booster heat pump." },
    { point: "Duplicates a live project", detail: "Con Edison is already building a data-center heat network pilot for Fulton Houses, one block away." },
    { point: "Dirtier grid", detail: "The NYC grid emits about 3.5x more CO2 per kWh than upstate, so heat pumps save less carbon." },
    { point: "No community fight", detail: "Nothing forces a trade, so heat reuse would be optional, not the deciding answer." },
  ],
});

// ---- offtakers
const mk = (id, name, type, lat, lon, dist, mwh, pk, t, fuel, score, ring) => ({ id, name, type, lat, lon, dist_km: dist, annual_MWh: mwh, peak_MW: pk, supply_temp_C: t, fuel, score, ring });
safeWrite("offtakers.json", {
  placeholder: true,
  offtakers: [
    mk("gh", "On-site greenhouse", "greenhouse", 42.6045, -76.631, 0.3, 40000, 8, 40, "none (new)", 0.95, "onsite"),
    mk("aq", "On-site aquaculture", "aquaculture", 42.6015, -76.635, 0.4, 14000, 3, 30, "none (new)", 0.9, "onsite"),
    mk("rec", "Community rec center + pool", "recreation", 42.603, -76.63, 0.5, 8000, 3, 45, "none (new)", 0.85, "onsite"),
    mk("mck", "McKissick Farms", "greenhouse", 42.592, -76.538, 7.9, 6000, 2, 45, "propane", 0.7, "corridor"),
    mk("woods", "Woodsedge Apartments", "senior housing", 42.567, -76.53, 9.3, 3000, 1, 55, "propane", 0.75, "corridor"),
    mk("hall", "Town Hall + Library", "civic", 42.566, -76.532, 9.2, 1800, 0.8, 60, "propane", 0.6, "town"),
    mk("school", "Lansing school campus", "school", 42.5457, -76.5186, 11.3, 15000, 5.5, 60, "natural gas", 0.65, "town"),
    mk("cargill", "Cargill salt mine buildings", "industrial", 42.5325, -76.5258, 10.5, 9000, 2.7, 60, "oil", 0.5, "town"),
  ],
});

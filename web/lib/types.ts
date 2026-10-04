// Shapes mirror docs/data-contract.md. Optional fields are tolerated (the Python model may omit them).
export type FuelKey = "propane" | "heating_oil" | "natural_gas" | "electric_resistance" | "air_source_hp";

export interface Ring {
  id: "onsite" | "corridor" | "town";
  name: string;
  phase: number;
  users?: string[];
  homes?: number;
  annual_MWh: number;
  peak_MW: number;
  supply_temp_C: number;
  /** Optional: temperature the heat must reach at the user. Falls back to model defaults. */
  sink_temp_C?: number;
  pipe_km: number;
  conditional?: boolean;
  lcoh_usd_mwh_7pct?: number;
  passes_gate?: boolean;
  direct_heat_exchange?: boolean;
  linear_heat_density_MWh_per_m?: number;
}

export interface Totals {
  heat_delivered_MWh: number;
  share_of_available_pct: number;
  hp_elec_MWh: number;
  backup_MWh: number;
  unmet_hours: number;
  avg_cop: number;
  storage_m3: number;
}

export interface MonthRow {
  month: number;
  supply_MWh: number;
  demand_MWh: number;
  delivered_MWh: number;
  backup_MWh: number;
}

export interface HourRow {
  h: number;
  demand_MW: number;
  delivered_MW: number;
  storage_MWh: number;
  backup_MW: number;
  outdoor_C: number;
}

export interface Site2Data {
  placeholder?: boolean;
  meta: { site: string; generated: string; scenario: string };
  supply: {
    it_load_MW: number;
    load_factor: number;
    capture_fraction: number;
    capture_temp_C: number;
    heat_available_GWh: number;
    heat_available_MW_avg: number;
  };
  rings: Ring[];
  totals: Totals;
  monthly: MonthRow[];
  weeks: { winter: HourRow[]; summer: HourRow[] };
  cop_compare: { source: string; cop: number }[];
  finance: {
    capex_musd: { total: number; lines: { item: string; musd: number; source: string }[] };
    opex_musd_yr: number;
    elec_price_usd_mwh?: number | { industrial: number; residential: number };
    lcoh_usd_mwh: { coop_4pct: number; utility_7pct: number; private_10pct: number };
    incumbent_usd_mwh: Record<FuelKey, number>;
    tariff_usd_mwh: number;
    low_income_tariff_usd_mwh: number;
    household: { typical_MWh_yr: number; savings_vs_propane_usd: number; savings_vs_oil_usd: number };
    tornado: { driver: string; low: number; high: number }[];
    dc_exit: { year: number; stranded_musd: number; fallback: string; replacement_source_musd?: number; corridor_cost_uplift_usd_mwh?: number };
  };
  extras?: Extras;
  impact: {
    co2_avoided_t_yr: number;
    co2_cars_equiv: number;
    homes_served: number;
    fossil_displaced_MWh: number;
    erf: number;
    ere?: number;
    water: { note: string; fan_energy_saved_MWh: number };
    jobs: number;
    local_food_t_yr: number;
  };
  assumptions?: {
    ef_kg_per_MWh_th?: Partial<Record<FuelKey, number>>;
    fuel_efficiency?: Partial<Record<FuelKey, number>>;
    grid_kg_per_MWh?: number;
    discount_rate_base_pct?: number;
  };
  value_by_stakeholder: { who: string; value: string; metric: string }[];
  hdr_scorecard: { lens: "Community" | "Ecology" | "Health"; petal: string; claim: string; metric: string }[];
  sources: { id: string; label: string; url: string }[];
}

export interface Extras {
  ring_lcoh_usd_mwh?: Partial<Record<"onsite" | "corridor" | "town", number>>;
  funding?: { npv7_musd?: number; funding_gap_musd?: number; funding_gap_incentive_scenario_if_qualifies_musd?: number; revenue_musd_yr?: number; note?: string };
  with_town?: { totals?: Partial<Site2Data["totals"]>; lcoh_usd_mwh?: Partial<Site2Data["finance"]["lcoh_usd_mwh"]>; capex_musd?: number; town_ring_lcoh_usd_mwh?: number; verdict?: string };
  greenhouse_check?: { peak_MW?: number; area_ha?: number };
  linear_heat_density_corridor_MWh_per_m?: number;
  cba?: { headline_gap_musd?: number; headline_annuitized_7pct_musd_per_yr?: number; headline_as_pct_of_dc_capex?: number; corridor_gap_musd?: number; per_year_musd?: number; per_year_annuitized_7pct_musd?: number; as_pct_of_dc_capex?: number; dc_capex_musd?: number; whole_project_gap_musd?: number; breakeven_homes_if_cba_pays_pipe?: Record<string, unknown> };
  air_source_hp_seasonal_cop?: number;
  electricity_rates_usd_kwh?: Partial<Record<string, number>>;
  lcoh_incentive_scenario_if_qualifies_usd_mwh?: number;
}

export interface Site1Data {
  placeholder?: boolean;
  meta: { site: string; generated: string; scenario: string };
  supply: Site2Data["supply"];
  totals: Totals;
  finance: { lcoh_usd_mwh: Site2Data["finance"]["lcoh_usd_mwh"]; incumbent_usd_mwh?: Partial<Record<FuelKey, number>> };
  impact: { co2_avoided_t_yr: number; co2_cars_equiv: number; homes_served: number; fossil_displaced_MWh: number };
  cop_compare?: { source: string; cop: number }[];
  why_not_chosen?: string | { point: string; detail: string }[];
}

export interface Offtaker {
  id: string;
  name: string;
  type: string;
  lat: number;
  lon: number;
  dist_km: number;
  annual_MWh: number;
  peak_MW: number;
  supply_temp_C: number;
  fuel: string;
  score: number;
  ring: "onsite" | "corridor" | "town" | string;
}

export interface AppData {
  site2: Site2Data;
  site1: Site1Data;
  offtakers: Offtaker[];
  placeholder: boolean;
}

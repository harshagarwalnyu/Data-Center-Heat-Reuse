# Data contract: Python model → web app

The Python model writes these files; `scripts/export_web_data.py` copies them into `web/public/data/`. The web app reads ONLY these. Every number object carries `value`, `unit`, and `source` ("model", a URL, or a resources/text file + page) so the UI can show provenance on click.

## `site2.json` (Lake Hawkeye, committed proposal)
```jsonc
{
  "meta": { "site": "Lake Hawkeye, Lansing NY", "generated": "ISO date", "scenario": "base" },
  "supply": {
    "it_load_MW": 150, "load_factor": 0.8, "capture_fraction": 0.75,
    "capture_temp_C": 50, "heat_available_GWh": 0,          // annual recoverable heat
    "heat_available_MW_avg": 0
  },
  "rings": [   // three-ring concept
    { "id": "onsite", "name": "On-site agri & community campus", "phase": 1,
      "users": ["greenhouse", "aquaculture", "rec center + pool"],
      "annual_MWh": 0, "peak_MW": 0, "supply_temp_C": 45, "pipe_km": 0.5 },
    { "id": "corridor", "name": "Corridor homes & farms (ambient loop)", "phase": 2,
      "homes": 0, "annual_MWh": 0, "peak_MW": 0, "supply_temp_C": 20, "pipe_km": 0 },
    { "id": "town", "name": "Town center: school campus + town buildings", "phase": 3,
      "annual_MWh": 0, "peak_MW": 0, "supply_temp_C": 70, "pipe_km": 0, "conditional": true }
  ],
  "totals": {
    "heat_delivered_MWh": 0, "share_of_available_pct": 0, "hp_elec_MWh": 0,
    "backup_MWh": 0, "unmet_hours": 0, "avg_cop": 0, "storage_m3": 0
  },
  "monthly": [ { "month": 1, "supply_MWh": 0, "demand_MWh": 0, "delivered_MWh": 0, "backup_MWh": 0 } ],
  "weeks": {   // hourly samples for charts (168 rows each)
    "winter": [ { "h": 0, "demand_MW": 0, "delivered_MW": 0, "storage_MWh": 0, "backup_MW": 0, "outdoor_C": 0 } ],
    "summer": [ ]
  },
  "cop_compare": [ { "source": "Air-cooled (30 °C)", "cop": 0 }, { "source": "Liquid-cooled (50 °C)", "cop": 0 } ],
  "finance": {
    "capex_musd": { "total": 0, "lines": [ { "item": "", "musd": 0, "source": "" } ] },
    "opex_musd_yr": 0,
    "lcoh_usd_mwh": { "coop_4pct": 0, "utility_7pct": 0, "private_10pct": 0 },
    "incumbent_usd_mwh": { "propane": 0, "heating_oil": 0, "natural_gas": 0, "electric_resistance": 0, "air_source_hp": 0 },
    "tariff_usd_mwh": 0, "low_income_tariff_usd_mwh": 0,
    "household": { "typical_MWh_yr": 0, "savings_vs_propane_usd": 0, "savings_vs_oil_usd": 0 },
    "tornado": [ { "driver": "", "low": 0, "high": 0 } ],
    "dc_exit": { "year": 10, "stranded_musd": 0, "fallback": "" }
  },
  "impact": {
    "co2_avoided_t_yr": 0, "co2_cars_equiv": 0, "homes_served": 0,
    "fossil_displaced_MWh": 0, "erf": 0,
    "water": { "note": "", "fan_energy_saved_MWh": 0 },
    "jobs": 0, "local_food_t_yr": 0
  },
  "value_by_stakeholder": [ { "who": "Residents", "value": "", "metric": "" } ],
  "hdr_scorecard": [ { "lens": "Community|Ecology|Health", "petal": "", "claim": "", "metric": "" } ],
  "sources": [ { "id": "", "label": "", "url": "" } ]
}
```

## `site1.json` (111 8th Ave, comparison toggle)
Same shape, fewer fields (supply, totals, finance.lcoh, impact headline, and `why_not_chosen`).

## `offtakers.json`
`[ { "id", "name", "type", "lat", "lon", "dist_km", "annual_MWh", "peak_MW", "supply_temp_C", "fuel", "score", "ring" } ]`

## Formulas the app re-implements client-side (Explore sliders)
- `cop = eta * T_sink_K / (T_sink_K - T_source_K + 2*approach)`, eta = 0.5, approach = 3 K
- `hp_elec = heat_delivered / cop`; DC heat drawn = `heat_delivered - hp_elec`
- `lcoh = (capex * crf(r, 30) + opex_fixed + elec_price * hp_elec) / heat_delivered`, `crf = r(1+r)^n / ((1+r)^n - 1)`
- `household_savings = MWh_yr * (incumbent_usd_mwh - tariff_usd_mwh)`
- `co2 = fossil_MWh * EF_fuel / eff - hp_elec * EF_grid`

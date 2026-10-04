# Model notes: assumption log (quant model, lane C30/model)

Started 2026-10-03. Every config input has a source (URL or resources/text file) or `ASSUMPTION: reason`. Organizer docs outrank web sources.

## Source discrepancies found
- Town hall / library / school coordinates: facts-site2.md lists Town Hall at 42.566,-76.532 (5.7 mi). research/offtakers.md OSM Nominatim geocodes put Town Hall/Library near 42.5377,-76.5031 (13 km) and Lansing schools at 10.4-10.6 km. Model uses Nominatim (geocoded) distances; school ~10.5 km, town hall ~13 km; this matches the "6-7 mi" brief for the school.

## Run record (v1, 2026-10-04)
Command: `uv run python -m heatreuse.run` -> outputs/{site2,site1,offtakers}.json + outputs/charts/*.png; `uv run python scripts/export_web_data.py`; `uv run pytest` (13 pass).
Weather: real TMYx EPW (Ithaca Tompkins Rgnl AP 725155, 2009-2023, climate.onebuilding.org), HDD65F = 6,646 (facts-site2 says ~7,000: TMYx 2009-2023 is warmer than the long-term normal, so heating loads are slightly LOW). Site 1 uses Central Park TMYx 725053. Cached in data/processed/weather_*.csv.

## Method decisions
- Supply = IT x LF x capture_fraction x availability mask (99% capture availability, seeded outages mean 22 h). Heat available 778 GWh/yr (88.8 MW avg).
- Corridor ring: ambient loop at 18 C, utility-owned building HPs (heat-as-a-service). LCOH and tariff are ALL-IN (include building HP capex + electricity). Pipe is sized for POTENTIAL homes = signed / uptake (0.70), 25 m trench/home + 3 km trunk = 20.9 km. Linear heat density 0.65 MWh/m/yr, below the PLAN gate of 1.5.
- Onsite ring: direct HX at 45 C (DLC 50 C capture minus 2 x 3 K approach), no HP. Greenhouse physics: U_eff 3.5 W/m2K x floor area x (18.5 C - Tout); peak 12.5 MW at -17 C, matches RII "10 ha ~ 10 MW / ~1 MWth per ha". 310 kWh/m2/yr.
- Town ring: central HP, weather-compensated 55-65 C sink (organizer 4G 50-60 C; 70 C sensitivity moot because COP clips at the 6.0 organizer cap in both cases), 14 km pipe at 15 W/m = 1.84 GWh/yr loss vs 3.58 GWh delivered. Reported separately (conditional); NOT in totals/finance. LCOH $754/MWh fails gate.
- Storage: source-side tank (50/30 C, dT 20 K), 6 h of peak DC draw = 5,558 m3 (129 MWh). Heat-capture outages are the only thing it protects against; supply is 15x demand. Backup boilers sized 100% of peak, unmet hours = 0.
- ERF = reused DC heat / IT energy (HDR deck p17-18), 4.6%. ERE = (PUE x IT - reuse)/IT.
- Cost split rule OCP p7-8: DC + host split extraction (interface) cost; host pays HP/storage. In model all capex sits with the heat utility; the DC's share appears as the funding gap it could cover via Community Benefit Agreement.
- CBS checks: HP plant $/kW (700) ~ EUR 6M/10 MW (1.08 x 0.6M = $650/kW) consistent. Town ring distance 14 km vs CBS "poor > 2 km": consistent with failing gate.

## Corrections applied from research/verification.md and coordinator
Propane base $3.10/gal (NYSERDA Central 2025-26 range 2.74-3.46; low sensitivity 2.85 in extras.scenarios); oil $5.186 Central monthly average; propane EF 62.87 kg/MMBtu (0.2145 kg/kWh); no federal credit in base, 30% incentive case labelled "if structured to qualify (counsel needed)" (waste-heat network likely not eligible, verification 9d-i); phase 1 = 150 MW IT (news), full build = 320 MW critical IT (TeraWulf filing, ops ~2029); gas moratorium Feb 2015; COP clipped [2,6]; hot loop 65 C base.

## Headline findings (CURRENT v3)

Source: `outputs/site2.json` (meta.generated 2026-10-04, scenario base, scope phases 1-2). Figures below are that file's rounded fields. Model output, so there is no web URL; read the file rather than this paragraph if they diverge. Superseded headline figures are under History.

- Heat delivered (phases 1-2) 50,576 MWh/yr (50.6 GWh) = 6.5% of available 777.6 GWh (`totals.heat_delivered_MWh` 50576.0, `totals.share_of_available_pct` 6.5, `supply.heat_available_GWh` 777.6; IT 150 MW, load factor 0.8, capture 0.75). Delivered heat stays 50.576 GWh and LCOH at 7% stays 106.069 when capture is 0.40, 0.75, or 0.85, and in the 320 MW full-build case (`extras.scenarios`). Tornado driver "Data-center IT load (MW)" is flat: low 106.1, high 106.1, base 106.1 (inputs 320 MW and 75 MW).
- Resilience: `totals.unmet_hours` is 0. Of the top 1% of hours (88 h), DC heat covers 95.3% of peak and backup covers 4.7%; backup is 0.73% of annual customer heat (`peak_share_dc_pct`, `peak_share_backup_pct`, `backup_share_annual_pct`). HP electricity 2,843 MWh; backup 373 MWh; average COP 4.71; storage 5,558 m3.
- Blended LCOH at 7% is $106.1/MWh (`finance.lcoh_usd_mwh.utility_7pct`). Coop 4% $89.5/MWh; private 10% $124.6/MWh. Incumbents: propane $136.1, heating oil $155.8, air-source heat pump $96.9, natural gas $64.2, electric resistance $245.0. On-site ring $40.6/MWh (37,076 MWh/yr, direct heat exchange, 45 C). Corridor ring $285.8/MWh (500 homes, 13,500 MWh/yr, linear heat density 0.65 MWh/m/yr), above the air-source heat pump. Town ring is conditional and outside totals/finance: $734.2/MWh, `passes_gate` false, 3,577 MWh/yr.
- Tariff $108.9/MWh (`finance.tariff_usd_mwh`; `tariff_rule` "0.8 x propane, fixed"). Low-income tariff $88.5/MWh. Capex $38.76 M; opex $1.94 M/yr. Whole-project (phases 1-2) PV funding gap at 7% is $26.01 M (`extras.cba.headline_gap_musd`, same as `extras.funding.funding_gap_musd`), 1.73% of the $1,500 M DC capex benchmark; annuitized $2.096 M/yr. Corridor stand-alone gap $30.32 M; the file's reconciliation is corridor $30.3 M minus on-site surplus $4.3 M = whole-project $26.0 M. Incentive case, labelled only if it qualifies: LCOH $85.8/MWh and gap $13.28 M (`extras.lcoh_incentive_scenario_if_qualifies_usd_mwh`, `extras.funding.funding_gap_incentive_scenario_if_qualifies_musd`).
- Current break-even (`extras.cba.breakeven_homes_if_cba_pays_pipe`): pipe and laterals paid, corridor LCOH at 2,000 homes $179.6 vs blend tariff $104.8, `min_homes` null. Pipe plus half the building heat pumps: $135.8 at 2,000 homes, `min_homes` null. Pipe plus all building heat pumps: `min_homes` 50, ring LCOH $103.3 vs blend tariff $104.8.
- Household: 27 MWh/yr; $735/yr vs propane; $1,266/yr vs oil (`finance.household` savings_vs_propane_usd 735.0, savings_vs_oil_usd 1266.0). Low-income stakeholder metric in the same file: $1,286/yr vs propane.
- CO2 avoided 11,408 t/yr; 2,659 car-equivalents; fossil displaced 52,016 MWh (`impact.co2_avoided_t_yr`, `co2_cars_equiv`, `fossil_displaced_MWh`). Marginal-grid case 10,670 t/yr (`extras.co2_avoided_marginal_grid_t_yr`; also the climate stakeholder string "11408 t/yr (10670 with marginal grid)"). ERF 0.0462. Fan energy saved 970 MWh/yr. Water note in `impact.water`: no lake-water savings are claimed. Jobs 126; greenhouse 10 ha; local food 5,500 t/yr; fish 1,500 t/yr.

## History

Superseded headline values. The v2 changes and v3 changes sections below are unchanged. v2 headline figures are copied here as the archive.

### v1 (previous Headline findings text)
- Heat delivered (phases 1-2) 50.6 GWh/yr = 6.5% of available 778 GWh. Supply never binds: recovery 0.40/0.75/0.85 and 320 MW IT all give identical LCOH. DC load is the tornado's flattest bar.
- Blended LCOH (7%) $102/MWh vs propane $136, oil $156, ASHP $97, gas $64. But blended is dominated by the cheap on-site ring ($40/MWh). The CORRIDOR ring alone is $274/MWh (capex ~$50k per home all-in, in line with MIT OCW ~$50k/residence for networked systems) and is WORSE than an air-source heat pump ($97). With the 20% propane discount tariff ($109/MWh) the project has a funding gap of $23.6 M NPV (7%); a 30% incentive, if it could be structured to qualify, cuts it to $12 M. The corridor case works only as a Community Benefit-funded program or at higher density.
- Household: 27 MWh/yr; saves $735/yr vs propane, $1,266 vs oil at the 20% tariff.
- CO2 avoided 11,456 t/yr (10,5xx t with marginal grid factor), ~2,490 cars.

### v2 (headline figures from the v2 changes section)
- CBA: corridor-ring gap $28.1 M PV (1.9% of DC capex, ~$0.94 M/yr straight-line over 30 yr); whole phases 1-2 gap $22.3 M (1.5%).
- Break-even: even if CBA pays all loop pipe and laterals, corridor LCOH stays $166 at 2,000 homes vs blended tariff $105. Pipe + half the HPs still $128; pipe + all HPs breaks even (from 50 homes).

## ASSUMPTIONs that most affect results (flagged in config)
building_hp_usd 16,000; loop_pipe_usd_m 450 and frontage 25 m/home; uptake 0.70; elec price 0.245 retail for everything (an industrial-rate 0.12 gives LCOH $93); greenhouse U_eff, area and tariff $50/MWh; central HP COP at the 6.0 cap (optimistic); capture_fraction 0.75; mix of displaced fuels; backup sized 100% of peak.

## Gaps
Site 1 inputs (loads, Manhattan unit costs, gas $2.20/therm) are rough; Site 1 LCOH $292 vs steam $119 should be treated as indicative. offtakers.json loads for non-modeled candidates are ASSUMPTIONS (floor area x intensity), data/processed/offtakers.csv from the data lane was header-only and not merged. No hourly diversity or ground-temperature loop model; tank thermal stratification ignored; no seasonal storage; hourly demand has no stochastic weather years.

## v2 changes (2026-10-04)
- Electricity split: central HP + pumping at NY industrial average $0.108/kWh (EIA EPM Table 5.6.A, July 2026 10.81 c/kWh; NYSEG SC-7 tariff not checked); corridor building HPs at residential $0.245. Tornado scales both.
- CBA: DC capex benchmark $10M/MW IT (Turner & Townsend Data Centre Construction Cost Index 2025, US$6.6-13.3/W; midpoint ASSUMED) x 150 MW = $1.5B. Corridor-ring gap $28.1M PV (1.9% of DC capex, ~$0.94M/yr straight-line over 30 yr); whole phases 1-2 gap $22.3M (1.5%).
- Break-even: even if CBA pays all loop pipe and laterals, corridor LCOH stays $166 at 2,000 homes vs blended tariff $105. Needs building-HP funding too: pipe + half the HPs still $128; pipe + all HPs breaks even (from 50 homes). So the binding cost is the $16k in-home HP, not the pipe.

## v3 changes (code-review-pr2 batch, 2026-10-04)
- Capex annualised by asset life class (config finance.life_years: pipe 30, tank 30, equipment 20 yr); NPV uses life-class equivalent annual cost x 30-yr annuity.
- CBA: one headline number = whole-project (phases 1-2) PV gap at 7%; corridor stand-alone gap is a memo; annuitized $/yr headline, straight-line labelled undiscounted.
- Site 1 rationale generated from outputs (CO2/MWh higher at Site 1; LCOH multiple of steam).
- unmet_hours is 0 by construction; totals now carry peak_share_dc_pct / peak_share_backup_pct (top 1% hours) and backup_share_annual_pct; tests can fail (capacity_share 0.2, capture 0.05).
- Tornado uptake holds potential homes fixed and scales customers; tariff-scenario margin uses realised blended revenue.
- Town ring direct-HX logic when capture - 2*approach >= sink; scenarios.capture_65C_town added.
- finance.elec_price_usd_mwh and tariff_rule added to site2.json and site1.json.

- v3.1: corridor mix renormalised Census 26/8/24/4 (config/impact.yaml); counterfactual covers all customer heat so backup hours are credited; car factor 4.29 t (EPA calculator); report strings use %.0f. CO2 11,408 t, 2,659 cars, fossil 52,016 MWh.

## Lane status

### Done
- Headline findings rewritten as CURRENT v3 from `outputs/site2.json` (generated 2026-10-04): delivered heat 50,576 MWh (6.5% of 777.6 GWh), LCOH at 7% $106.1/MWh, on-site $40.6, corridor $285.8, town $734.2 (fails gate), tariff $108.9, whole-project gap $26.01 M, household $735 / $1,266, CO2 11,408 t and 2,659 cars.
- Previous headline block kept verbatim under History (v1). v2 gap and break-even figures copied under History (v2).
- Spot-check: the same headline fields in `web/public/data/site2.json` match (utility LCOH 106.1, gap 26.01, CO2 11,408, cars 2,659, ring LCOHs 40.6 / 285.8 / 734.2, heat delivered 50,576).

### Missing
- Model was not re-run. Headlines are a read of the existing JSON.
- Full file diff of `web/public/data/site2.json` vs `outputs/site2.json` was not done. Only the headline fields above were compared.
- Method decisions, ASSUMPTIONS, Gaps, and the v2/v3 changelog sections were left as written. They still contain older figures (town-ring LCOH $754 in Method decisions; corridor LCOH $274 and gap $23.6 M only in History; v2 changelog still says gap $22.3 M / $28.1 M and break-even LCOH $166).

### Open questions
- Quote the Headline findings (CURRENT v3) block, not Method decisions or the v2 changelog, when a slide needs LCOH, the funding gap, or CO2.
- Whether the $4.3 M on-site surplus is a stored number or only the reconciliation sentence. The JSON has the sentence; there is no separate surplus field.

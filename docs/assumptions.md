# Assumptions and inputs

Every key model input, with value, unit, source and our confidence in it. Values are read from `config/*.yaml`; if a config value changes, the YAML wins. The full assumption log with reasoning is `research/model-notes.md`; primary-source corrections that override older files are in `research/verification.md`.

**Confidence scale.** High: taken from a primary source or an organizer document. Medium: a published benchmark applied to our case, or a range with a defensible midpoint. Low: our own estimate with no direct source. Rows marked **ASSUMPTION** are ours and are tagged `[A]` in the YAML.

**What matters most.** Sensitivity results ([results.md](results.md)) show that building heat-pump cost, pipe length per home, discount rate and uptake drive the corridor result. Rows that move the answer are marked with a star.

## Site and supply (`config/engineering.yaml`)

| Input | Value | Unit | Source | Confidence |
|---|---|---|---|---|
| Site coordinates | 42.6025, -76.6360 | deg | `research/offtakers.md` (GEM wiki, OSM) | High |
| Weather | Ithaca Tompkins Rgnl AP 725155, TMYx 2009-2023 | hourly dry bulb, deg C | Climate.OneBuilding, https://climate.onebuilding.org | High (typical year; no extreme-year stress test) |
| IT load, phase 1 | 150 | MW | News reports of phase 1; `research/verification.md` row 3a | Medium |
| IT load, full build | 320 (400 gross) | MW critical IT | TeraWulf filing, `research/verification.md` row 3a; operations about 2029 | Medium |
| Load factor | 0.80 | fraction | PLAN.md section 1 (range 0.7 to 0.9). **ASSUMPTION** | Medium |
| Capture fraction * | 0.75 (cases 0.40 and 0.85) | fraction of IT power | **ASSUMPTION.** Low case from RII 33-42 percent of power; high case from the organizer deck "up to 85% recoverable" | Low to Medium |
| Capture temperature | 50 | deg C | RII Virginia p10 (DLC 45-55); OCP Heat Reuse 101 p6 (45-65) | Medium (depends on the chosen cooling design, see [cooling-integration.md](cooling-integration.md)) |
| Air-cooled capture temperature (comparison) | 30 | deg C | RII (30-40); OCP (27-28 return) | Medium |
| Capture availability | 0.99, mean outage 22 h | fraction, h | **ASSUMPTION** | Low |
| Diurnal IT swing | +/-3 | percent | **ASSUMPTION** | Low |
| PUE (used only for ERE) | 1.2 | ratio | **ASSUMPTION** liquid-cooled new build | Medium |

## Heat pumps and storage

| Input | Value | Unit | Source | Confidence |
|---|---|---|---|---|
| Heat pump efficiency eta * | 0.5 | fraction of Carnot | Task specification; Topic 5 deck (COP 2-5 typical, 2.95 at 75 deg C) | Medium (tornado range 0.4 to 0.6) |
| Heat exchanger approach | 3 | K per exchanger | Task specification | Medium |
| COP clip | [2, 6] | dimensionless | Organizer ranges, `research/digest-organizer.md` section 2.3 | High |
| Corridor loop temperature | 18 | deg C | Task specification (building heat pump source 15-20 deg C) | Medium |
| Corridor sink curve | 35 to 55 deg C, slope 0.6, ref 15 deg C | deg C | **ASSUMPTION** weather-compensated heating curve | Medium |
| DHW temperature | 55 | deg C | Standard practice | Medium |
| Town hot loop | 55 to 65 deg C base, 70 deg C sensitivity | deg C | Organizer deck (4G networks 50-60 deg C); AG p12-14 | Medium |
| Air-source heat pump comparator | eta 0.4, 40 deg C sink, 5 K approach, clip [1.3, 6] | | **ASSUMPTION** | Low to Medium |
| Storage size | 6 h of peak draw (5,558 m3 in base) | h | Task specification | Medium |
| Storage delta T | 20 | K | **ASSUMPTION** 50/30 deg C store | Medium |
| Storage loss | 1 | percent per day | **ASSUMPTION** | Medium |
| Backup boiler | 100 percent of peak, 0.9 efficiency | fraction, ratio | **ASSUMPTION**; N+1 not modeled | Medium |
| Pumping electricity | 1.5 | percent of delivered heat | **ASSUMPTION** | Low |

## Demand

| Input | Value | Unit | Source | Confidence |
|---|---|---|---|---|
| Greenhouse area | 10 | ha | Task brief; RII (10 ha about 10 MW) | High (as a scenario) |
| Greenhouse U_eff * | 3.5 | W per m2 per K | **ASSUMPTION**, calibrated to the RII benchmark; model peak is higher than the benchmark (`extras.greenhouse_check`) | Low |
| Greenhouse setpoint | 18.5 | deg C | **ASSUMPTION** (day 20, night 17) | Medium |
| Tomato yield | 40 | kg per m2 per year | **ASSUMPTION** high-tech, no supplemental lighting | Low to Medium |
| Aquaculture | 1,500 t/yr, 3.0 kWh/kg | t, kWh per kg | **ASSUMPTION** | Low |
| Recreation and pool | 600 MWh/yr pool; 4,000 m2 at 140 kWh/m2 | | **ASSUMPTION**; Deep Green UK pool 222 MWh/yr as a precedent (`research/case-studies.md`) | Low |
| Corridor homes (signed) | 500 | homes | Task brief | Medium |
| Uptake * | 0.70 | share of homes along the route | **ASSUMPTION**; tornado range 0.45 to 0.90 | Low |
| Demand per home | 27 (23.5 space, 3.5 DHW) | MWh/yr | **ASSUMPTION** | Medium |
| Trench frontage * | 25 | m per potential home | **ASSUMPTION** quarter-acre hamlet lots | Low |
| Corridor trunk | 3.0 | km | **ASSUMPTION** | Low |
| Town trunk and spur | 11.0 + 3.0 | km | Task brief (6-7 miles); OSM school distance 10.4-10.6 km | Medium |
| School load | 18,700 m2 at 110 kWh/m2 | | **ASSUMPTION**; 1,118 students (NCES via `research/offtakers.md`) | Low |
| Other town loads | 140 + 180 + 1,200 | MWh/yr | **ASSUMPTION** from floor areas | Low |
| Candidate offtaker loads (non-modeled) | see `config/offtakers.yaml` | MWh/yr | **ASSUMPTION** floor area x intensity; Cargill mine load unverified | Low |

## Finance (`config/finance.yaml`)

| Input | Value | Unit | Source | Confidence |
|---|---|---|---|---|
| Analysis horizon | 30 | years | Convention | High |
| Asset lives | pipe 30, tank 30, equipment 20 | years | **ASSUMPTION** (pipe conservative against 40-50) | Medium |
| Discount rates * | 4, 7, 10 | percent | Co-op, utility, private; 7 percent headline | Medium |
| Residential electricity | 0.245 | USD per kWh | `research/facts-site2.md` section 4 (NYSEG, EnergySage), verified 2026-10-03 | Medium |
| Industrial electricity (central equipment, pumping) | 0.108 | USD per kWh | EIA Electric Power Monthly Table 5.6.A, NY industrial, July 2026, https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a. NYSEG SC-7 tariff not checked | Medium |
| Propane price | 3.10 (season range 2.74-3.46) | USD per gal | NYSERDA Central NY, https://www.nyserda.ny.gov/Energy-Prices/Home-Heating-Oil/Average-Home-Heating-Oil-Prices; `research/verification.md` | High |
| Heating oil price | 5.186 | USD per gal | NYSERDA Central NY monthly average | High |
| Natural gas | 1.60 | USD per therm | `research/facts-site2.md` section 4 (not used by rural customers: no gas, moratorium since 2015) | Medium |
| Fuel energy content | propane 26.8, oil 40.6 | kWh per gal | 91,452 and 138,500 BTU per gal | High |
| Appliance efficiency | propane 0.85, oil 0.82, gas 0.85 | ratio | **ASSUMPTION** | Medium |
| DC interface * | 120 | USD per kW peak | **ASSUMPTION**; OCP p7-8 cost split | Low |
| Tank | 300 | USD per m3 | **ASSUMPTION**; Danish pit stores 33-38 EUR per m3 are a floor (iea-shc.org) | Low |
| On-site pipe | 900 | USD per m | **ASSUMPTION** | Low |
| Corridor loop pipe * | 450 | USD per m | **ASSUMPTION**; MIT OCW 2025 RES.ENV-007 lecture 7: circulation about one third of about 50,000 USD per residence, https://ocw.mit.edu/courses/res-env-007-geothermal-energy-networks-transforming-our-thermal-energy-system-january-iap-2025/ | Low to Medium |
| Building heat pump * | 16,000 | USD per home | **ASSUMPTION**; same MIT OCW source (in-home about one third) | Low to Medium |
| Service lateral | 2,500 | USD per home | **ASSUMPTION** | Low |
| Town trunk pipe | 1,100 | USD per m | **ASSUMPTION**; CBS white paper p13 (connection cost 3 to 50 percent of capex with distance) | Low |
| Central heat pump | 700 | USD per kW | **ASSUMPTION**; CBS p17, p19: 10 MW plant about EUR 6M | Medium |
| Substations, plant, backup | 100, 40, 120 | USD per kW | **ASSUMPTION** | Low |
| Soft costs, contingency | 15, 20 | percent of subtotal | **ASSUMPTION** | Medium |
| O&M | 1.5 percent of capex; 150 + 120 per home; 400,000 per year program | | **ASSUMPTION** | Low |
| Heat purchase price | 0 | USD per MWh | **ASSUMPTION**; Deep Green gives heat free | Medium (a negotiated term, see [ownership-deal.md](ownership-deal.md)) |
| Tariff discount to propane | 20 (low-income 35 on 20 percent of customers) | percent | PLAN.md section 4.3 example; low-income tier **ASSUMPTION** | Medium |
| On-site tariff | 50 | USD per MWh | **ASSUMPTION** about 40 percent of propane-equivalent | Low |
| Federal ITC | 0 in base; 30 percent as an incentive scenario | percent | Waste-heat network probably not eligible, `research/verification.md` 9d-i. "If structured to qualify; counsel needed" | Low |
| DC exit year; replacement source | 10; 2,000 USD per kW | year; USD | **ASSUMPTION** | Low |
| DC capex benchmark (CBA ratio only) | 10 | USD million per MW IT | Turner & Townsend Data Centre Construction Cost Index 2025 (US$6.6-13.3 per W), https://reports.turnerandtownsend.com/data-centre-construction-cost-index-2025/; midpoint assumed | Medium |

## Impact (`config/impact.yaml`)

| Input | Value | Unit | Source | Confidence |
|---|---|---|---|---|
| Grid emission factor | 0.1101 | kg CO2 per kWh | EPA eGRID2023 NYUP 242.8 lb per MWh, https://www.epa.gov/egrid | High |
| Marginal grid factor (sensitivity) | 0.315 | kg CO2 per kWh | NYISO Zone C range 0.28-0.35, midpoint | Medium |
| Propane | 0.2145 | kg CO2 per kWh | EPA GHG Emission Factors Hub, liquid propane 62.87 kg per MMBtu; corrected per `research/verification.md` 10d | High |
| Heating oil, natural gas | 0.2520, 0.1810 | kg CO2 per kWh | EPA GHG Emission Factors Hub | High |
| Displaced fuel mix, corridor * | propane 45, oil 15, electric 35, other 5 | percent | **ASSUMPTION** from Census B25040 non-gas shares | Medium |
| Displaced fuel mix, on-site | propane 100 | percent | **ASSUMPTION** no piped gas near the plant | Medium |
| Car emissions | 4,600 | kg CO2 per car per year | EPA 4.6 t per year | High |
| Fan energy avoided | 0.02 | kWh per kWh heat reused | **ASSUMPTION** | Low |
| Jobs | RII Table 2 interpolation; aquaculture 40 t per job; 12 recreation; 8 network | FTE-equivalent | RII Virginia Table 2; others **ASSUMPTION** | Low |

## Site 1 inputs (`config/site1.yaml`)

| Input | Value | Source | Confidence |
|---|---|---|---|
| IT load | 30 MW | `research/facts-site1.md` (22-28 MW named tenants, 30-40 assumed) | Low |
| Capture | 0.55 of IT power at 32 deg C | **ASSUMPTION** legacy cooling; condenser return 29-35 deg C per facts-site1 | Low |
| Customers | 2,056 NYCHA apartments (Fulton plus Elliott-Chelsea) | `research/facts-site1.md` | Medium |
| Con Edison steam | 118.7 USD per MWh | 41.53 USD per Mlb (Con Edison 10-K via facts-site1) converted at 1.194 MMBtu per Mlb | Medium |
| Manhattan pipe costs | loop 3,500, on-site 4,500, trunk 5,000 USD per m | **ASSUMPTION** 4 to 8 times rural | Low |
| Grid factor | 0.3927 kg CO2 per kWh | eGRID NYCW 865.7 lb per MWh | High |
| Electricity | 0.25 residential, 0.20 large commercial | **ASSUMPTION** Con Edison | Low |

Site 1 inputs are rougher than Site 2 inputs and its results should be read as indicative.

## Known weak points

These are the inputs we would replace first with a quote or a measurement.

1. **Building heat-pump cost (16,000 USD) and loop pipe cost per metre.** Both rest on one lecture-note benchmark, not a contractor quote. They set the corridor LCOH.
2. **Corridor uptake and frontage.** The pipe is sized to all potential homes (signed / 0.70) at 25 m of trench each. No survey of actual lots, road geometry or sign-up exists.
3. **Greenhouse load and tariff.** U_eff and the 50 USD per MWh tariff are our estimates. No grower has signed a letter of intent (see R10 in [risk-matrix.md](risk-matrix.md)). The greenhouse alone is about 62 percent of delivered MWh (31,416 of 50,576 MWh, `outputs/offtakers.json` and `outputs/site2.json`).
4. **Capture fraction and capture temperature.** Neither TeraWulf nor its cooling vendor has published a heat-recovery design. The model is insensitive to the fraction because supply exceeds demand by about 15 times, but it is sensitive to temperature if the facility is air-cooled.
5. **Heat price of zero.** A negotiated term, not a fact. If TeraWulf charged for heat, LCOH rises by the same amount per MWh.
6. **Weather.** One typical meteorological year, which understates cold extremes and sizing risk.
7. **Hardcoded fuel mixes.** The displaced-fuel mix drives the CO2 result and is an assumption from census shares, not a household survey.
8. **Legal.** Whether a New York town can own and charge for a thermal utility is unverified (`docs/ownership-deal.md`, section 2).

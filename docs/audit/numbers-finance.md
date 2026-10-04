# Finance numbers audit — Site 2 (Lake Hawkeye)

Audit of `web/public/data/site2.json` finance against `config/finance.yaml` and `research/verification.md`. A fresh `model.full` on 2026-10-04 reproduced the published finance block. `web/public/data/site2.json` and `outputs/site2.json` have identical `finance` objects.

Base case is phases 1–2 at 150 MW IT (town ring excluded from `finance`). Life is 30 years. No federal credit in the base LCOH.

## Verdict

| Item | Verdict | Fix |
|---|---|---|
| Capex lines vs unit costs in `finance.yaml` | **OK** | Displayed lines sum to $38.77M; `total` is $38.76M (rounding). |
| DC interface 50/50 (`cost_split`) | **WRONG** | Host LCOH at 7% is **$96.9/MWh** once half the interface is removed before soft costs and contingency. Published $100.2/MWh charges the host for 100%. |
| LCOH at 4% / 7% / 10% (CRF) | **OK** | None. Unrounded values 82.75 / 100.19 / 119.72. |
| Ring LCOH (7%) | **OK** | Lead with on-site **$37.5** and corridor **$272.3**. Blended $100.2 is the MWh-weighted average. |
| Incumbent $/MWh | **OK** | Point the oil citation at the monthly NYSERDA page. |
| Tariff dollars | **OK** | Corridor cost recovery is **−$163/MWh** (tariff $108.9 minus corridor LCOH $272.3). `margin_vs_lcoh7` is tariff minus the blend. |
| Household $735 / $1,266 | **OK** | Stakeholder line “Extra 35%” should read “35% off the propane-equivalent” ($88.5/MWh, **$1,286/yr**). |
| Tornado | **OK** | None. Flat DC-load bar is the surplus-heat result. |
| DC exit dollars | **OK** vs the code | State the two assumptions the yaml does not list: straight-line stranding, and replacement COP 4.5. |
| Federal credit in the base | **OK** (left out) | $81.7 is a 30% haircut on gross capex. verification.md 9d-i says a waste-heat network is not geothermal-heat-pump property. |

`research/model-notes.md` still says blended LCOH about $102/MWh and a $23.6M gap. The JSON and this rerun are **$100.19/MWh** and **$22.32M**. Use the JSON.

## Method

\[
\mathrm{CRF}(r,n)=\frac{r(1+r)^n}{(1+r)^n-1}
\]

| Rate | Life | CRF |
|---|---|---:|
| 4% | 30 | 0.05783010 |
| 7% | 30 | 0.08058640 |
| 10% | 30 | 0.10607925 |
| 7% | 20 | 0.09439293 |

LCOH = (capex × CRF + fixed opex + variable opex) / delivered MWh. The 7%, 30-year CRF matches `tests/test_model.py` (`0.0805864`). Annuity factor at 7% for 30 years is 12.40904.

Delivered heat in the base finance case is **50,575.755 MWh** (on-site 37,075.755 + corridor 13,500).

## Capex lines

Unit costs are the `[A]` assumptions in `config/finance.yaml`. This lane checked the arithmetic. Catalogue prices (NREL, Danish Energy Agency) were not re-quoted.

Soft costs (15%) and contingency (20%) are each applied to the direct subtotal. They are not stacked on each other. Multiplier = 1.35.

| Line | Driver | Hand $ | JSON $M | Verdict |
|---|---|---:|---:|---|
| DC-side interface | peak source 21.547 MW × $120/kW | 2,585,624 | 2.59 | OK |
| Tank | 5,558.09 m³ × $300/m³ | 1,667,427 | 1.67 | OK |
| On-site pipe | 0.5 km × $900/m | 450,000 | 0.45 | OK |
| On-site substations | peak 16.365 MW × $100/kW | 1,636,488 | 1.64 | OK |
| Corridor loop | 20.857 km × $450/m | 9,385,714 | 9.39 | OK |
| Building heat pumps | 500 × $16,000 | 8,000,000 | 8.00 | OK |
| Laterals + meters | 500 × $2,500 | 1,250,000 | 1.25 | OK |
| Pumps | peak flow 23.340 MW × $40/kW | 933,606 | 0.93 | OK |
| Backup boilers | same 23.340 MW × $120/kW | 2,800,818 | 2.80 | OK |
| Soft costs | 15% × direct $28,709,678 | 4,306,452 | 4.31 | OK |
| Contingency | 20% × direct $28,709,678 | 5,741,936 | 5.74 | OK |
| **Total** | × 1.35 | **38,758,066** | **38.76** | OK |

Pipe length = 3.0 km trunk + (500 / 0.70 uptake) × 25 m = **20.857 km**, shown as 20.9 km. Connected heat pumps stay 500. Uptake changes how much pipe is built for those 500 homes.

Sum of the rounded JSON lines is **$38.77M**. The unrounded total rounds to **$38.76M**. Residual about $10,000.

**Allocation — WRONG.** `finance.yaml` `cost_split.dc_interface` is `{dc: 0.5, host: 0.5}`. The line is tagged `dc50/host50`. The evaluator sums every line into host capex and never reads `cost_split`.

OCP’s heat-reuse note says extraction cost “should be split by data center and heat host,” and storage plus temperature lift sit with the host (organizer text, pages 7–8): `resources/text/20230623_Data_Centers_HeatReuse_101_3.2.docx.txt`. The note does not state 50%. The 50% ratio is the yaml assumption.

Fix, if the published LCOH is the host’s cost: halve the interface inside the direct subtotal, then recompute soft costs and contingency.

- Host capex reduction = 0.5 × $2,585,624 × 1.35 = **$1,745,296**
- O&M falls with capex at 1.5%
- 7% LCOH falls by $3.30/MWh, from 100.189 to **$96.89** (publish **$96.9**)
- 7% funding gap falls from $22.32M to **$20.25M** NPV

Gross system cost stays $38.76M if the table is “who builds what,” with a host column beside it. Tank, pumps, backup, pipe, and building heat pumps stay on the host. That matches the OCP split between extraction and transformation.

Town ring is outside this total. With the town included, capex is **$64.34M** (`extras.with_town`). Town directs from the same unit costs: 14.0 km × $1,100/m = $15.40M pipe; central heat pump $2.221M; town substations $0.296M. Pipe share of town-ring capex **0.820** → JSON 0.82. **OK.**

## LCOH at three rates

| | 4% | 7% | 10% |
|---|---:|---:|---:|
| Annual capital | $2,241,383 | $3,123,373 | $4,111,426 |
| Fixed opex | $1,116,371 | $1,116,371 | $1,116,371 |
| Variable opex | $827,385 | $827,385 | $827,385 |
| ÷ 50,575.755 MWh | **82.750** | **100.189** | **119.725** |
| JSON | 82.7 | 100.2 | 119.7 |
| Verdict | OK | OK | OK |

Fixed opex = 1.5% × $38,758,066 ($581,371) + 500 × ($150 + $120) ($135,000) + $400,000 program. Variable opex is corridor heat-pump electricity at $245/MWh, pumping at 1.5% of delivered heat and $108/MWh, backup propane at $3.10/gal and 90% boiler efficiency, and a $0 heat-purchase price.

Ring rebuild at 7% (same CRF):

| Ring | Capex | Fixed | Variable | MWh | LCOH | JSON |
|---|---:|---:|---:|---:|---:|---:|
| On-site | 10,557,724 | 445,518 | 95,323 | 37,075.755 | 37.535 | 37.5 |
| Corridor | 28,200,342 | 670,853 | 732,062 | 13,500 | 272.258 | 272.3 |
| Blend | 38,758,066 | 1,116,371 | 827,385 | 50,575.755 | 100.189 | 100.2 |

On-site is 73% of the megawatt-hours and is direct heat exchange, so it pulls the blend down. Corridor LCOH **$272/MWh** sits above propane **$136**, oil **$156**, and air-source electricity **$97**.

With the town ring included, the same function returns 113.630 / 140.666 / 170.953, published as **113.6 / 140.7 / 171.0**. Town-ring LCOH is **717.591**, published as **717.6**. **OK.** At 7% the with-town blend ($140.7) is above propane ($136.1). The town gate fails. The failure uses the ring LCOH, which is the right test.

The 65°C and 70°C town LCOHs are the same number (717.5909668478384) because both lifts clip at `cop_max` 6. Unclipped eta × Carnot from a 50°C source is about 8.05 at 65°C and 6.60 at 70°C. The published pair is what this model produces. It is a weak 70°C test until the cap is lifted.

Base LCOH uses full capex. The separate incentive figure **$81.66** (JSON **81.7**) equals the 7% LCOH after 30% of gross capex is removed from the capital charge only. Difference $18.53/MWh = 0.30 × $3,123,373 / 50,575.755 MWh. See Federal credit.

## Incumbent fuel $/MWh

Delivered $/MWh = (price per unit) / (kWh per unit) / efficiency × 1000. Inputs: propane $3.10/gal, 26.8 kWh/gal, eff 0.85; oil $5.186/gal, 40.6 kWh/gal, eff 0.82; gas $1.60/therm, 29.307 kWh/therm, eff 0.85; residential electricity $0.245/kWh.

| Fuel | Hand $/MWh | JSON | Verdict |
|---|---:|---:|---|
| Propane | 3.10 / 26.8 / 0.85 × 1000 = **136.084** | 136.1 | OK |
| Heating oil | 5.186 / 40.6 / 0.82 × 1000 = **155.773** | 155.8 | OK |
| Natural gas | 1.60 / 29.307 / 0.85 × 1000 = **64.228** | 64.2 | OK |
| Electric resistance | 0.245 × 1000 = **245.0** | 245.0 | OK |
| Air-source heat pump | 245 / 2.52814 = **96.909** | 96.9 | OK |

Seasonal COP 2.52814 is the hourly air-source result (`extras` prints 2.53). The $96.9 figure is electricity only. It includes no air-source heat pump capital. Propane and oil figures are fuel divided by appliance efficiency. They include no furnace capital. Household bill comparisons below use that same boundary.

Oil **$5.186/gal** is the Central monthly average in verification.md row 7a (verified 2026-10-03): https://www.nyserda.ny.gov/Energy-Prices/Home-Heating-Oil/Monthly-Average-Home-Heating-Oil-Prices. Statewide weekly oil on 9/21/2026 was $6.271 (same row). The JSON source `nyserda_prop` points at the weekly page `https://www.nyserda.ny.gov/Energy-Prices/Home-Heating-Oil/Average-Home-Heating-Oil-Prices`. **WRONG citation URL. The $/MWh math is OK.**

Propane base **$3.10/gal** is the instructed base (midpoint of the stated $2.74–$3.46 season band). verification.md row 7b does not contain that band. It records statewide propane **$3.120** on 9/21/2026 and **$3.116** on 9/14/2026, and says the Central dashboard value was unreadable (verified 2026-10-03): https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/EDPPP/Energy-Prices/Weekly-Report/WeeklyEnergyandFuelsReport_20260925.pdf. The band is **[unverified]** against verification.md. `finance.yaml` comments attribute the band to that file.

At statewide $3.120/gal the same formula gives **$136.96/MWh**. Household savings at a 20% discount would be about **$5/yr** higher than $735. The $3.10 base is slightly under that weekly print.

Season ends, same efficiency (not in the JSON):

| Propane | Delivered $/MWh | 20% tariff | Savings at 27 MWh |
|---|---:|---:|---:|
| $2.74/gal | 120.28 | 96.22 | $649 |
| $2.85/gal (in `extras`) | 125.110 | 100.088 | $675.59 |
| $3.10/gal base | 136.084 | 108.867 | $734.86 |
| $3.46/gal | 151.89 | 121.51 | $820 |

The $2.85 row matches `extras.scenarios.propane_2.85_low_sensitivity` (propane 125.11, tariff 100.09, savings 675.59, LCOH 100.111). At $2.74 the 20% tariff ($96.22) is below the published 7% LCOH ($100.19). At $2.85 it is level with LCOH ($100.11).

Gas at $64.2/MWh is below blended LCOH. verification.md row 6a: the NYSEG moratorium in the Town of Lansing dates from **2015** (verified 2026-10-03): https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BE068C615-B8EE-4CB9-AF92-3153A49BE4E4%7D. Row 6c-update still lists Lansing as vulnerable on the 7/14/2025 gas long-term plan. A 2026 confirmation is **[unverified]** in that file.

Residential $0.245/kWh is cited from `research/facts-site2.md` (EnergySage). verification.md does not re-check it. Industrial $0.108/kWh is the yaml’s rounding of EIA’s 10.81 ¢/kWh (July 2026): https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a. The 0.01 ¢ gap changes pumping cost by well under $0.02/MWh.

## Tariff

`discount_vs_propane` 0.20 → 0.80 × 136.084 = **108.867**. JSON **108.9**. **OK.**

`low_income_discount` 0.35 is applied to the propane reference: 0.65 × 136.084 = **88.455**. JSON **88.5**. **OK.** It is parallel to the 20% discount, not added on top of it. A stacked 55% discount would be $61.24/MWh.

Blended corridor price, 20% of homes on the low-income tier: 0.80 × 108.867 + 0.20 × 88.455 = **104.785**. JSON breakeven `blend_tariff` **104.8**. **OK.** The 20% share is an `[A]` assumption in the yaml. The site pack says there is no disadvantaged-community designation to measure it against (see HDR).

On-site heat is a flat **$50/MWh**. That is above on-site LCOH ($37.5) and below propane ($136). The stakeholder line “$50/MWh vs propane $136/MWh” matches.

Tariff scenarios:

| Multiple | Hand tariff | JSON | Hand minus LCOH 100.189 | JSON `margin_vs_lcoh7` |
|---|---:|---:|---:|---:|
| 0.85 | 115.671 | 115.67 | 15.48 | 15.48 |
| 0.80 | 108.867 | 108.87 | 8.68 | 8.68 |
| 0.75 | 102.063 | 102.06 | 1.87 | 1.87 |

Those margins match the formula (corridor tariff minus blended LCOH). **Arithmetic OK.**

Corridor recovery is a different subtraction: 108.867 − 272.258 = **−$163.4/MWh**. At the blended corridor price of $104.79 the corridor covers its operating cost and has about **$11,700/yr** left. Present value of that surplus is about $0.14M. Corridor capex is $28.20M. Corridor NPV gap is **$28.06M**, which matches `extras.cba.corridor_gap_musd`. The tariff repays operations. The pipe and the building heat pumps are the unpaid capital.

System cash: revenue **$3,268,384/yr** (JSON 3.27) against opex **$1,943,756** (JSON 1.94). NPV at 7% = (revenue − opex) × 12.40904 − $38,758,066 = **−$22,320,698** (JSON funding gap **22.32**). Average collected price is $64.62/MWh because most heat is the $50 on-site tariff.

`extras.cba.per_year_musd` 0.935 is the $28.06M gap divided by 30. The annuitized figure **$2.261M/yr** (gap × CRF 0.0805864) is the annual capital number. The cash shortfall on the corridor is about $0 of operations plus unpaid capital.

## Household savings

Typical use **27 MWh/yr** from `engineering.yaml` (`corridor.mwh_per_home`, assumption: 23.5 space + 3.5 DHW). JSON `household.typical_MWh_yr` = 27. **OK.**

| Comparison | Hand | JSON | Verdict |
|---|---:|---:|---|
| vs propane, standard tariff | 27 × (136.084 − 108.867) = **734.86** | 735 | OK |
| vs oil, standard tariff | 27 × (155.773 − 108.867) = **1,266.45** | 1266 | OK |
| vs propane, low-income tariff | 27 × (136.084 − 88.455) = **1,286.00** | stakeholder “$1286/yr” | OK |
| scenario 0.85 / 0.80 / 0.75 | 551.15 / 734.86 / 918.57 | 551.14 / 734.86 / 918.57 | OK |

The low-income dollar is a 35% discount off propane. The stakeholder phrase “Extra 35% tier discount” reads as a further 35 points on top of 20%. **Wording WRONG. Dollar OK.** Fix the phrase to “35% off the propane-equivalent ($88.5/MWh).”

Against air-source electricity the standard tariff costs 27 × (108.867 − 96.909) = **$323/yr more** in energy. The JSON household block reports propane and oil only, which is the right pair for homes that heat with those fuels. Savings include no federal credit.

## Tornado

Re-ran `model.tornado` on the same weather. JSON values are the run rounded to 0.1. Order is largest swing first. **All six rows OK.**

| Driver | Low input | High input | Hand low | Hand high | JSON |
|---|---:|---:|---:|---:|---|
| Discount rate | 0.04 | 0.10 | 82.750 | 119.725 | 82.7 / 119.7 |
| Pipe cost | 0.7× | 1.4× | 92.660 | 110.227 | 92.7 / 110.2 |
| Uptake | 0.90 | 0.45 | 95.606 | 111.646 | 95.6 / 111.6 |
| Electricity (both rates scaled) | $0.14/kWh | $0.32/kWh | 93.591 | 104.901 | 93.6 / 104.9 |
| Heat-pump eta | 0.60 | 0.40 | 98.343 | 103.386 | 98.3 / 103.4 |
| Data-center IT load | 320 MW | 75 MW | 100.189 | 100.189 | 100.2 / 100.2 |

Inputs match `finance.yaml` `tornado`. For uptake, electricity, eta, and IT load, the input that lowers LCOH is stored on `low_input`. Higher uptake shortens the loop because potential homes = 500 / uptake, so 0.90 is the cheap case and 0.45 is the dear case. Connected homes stay 500.

Pipe multipliers also scale `trunk_usd_m`. The base case has no town pipe, so that term is idle. The swing is the on-site pipe plus the 20.9 km loop.

IT load from 75 MW to 320 MW leaves LCOH unchanged. Delivered heat is 50.6 GWh. At 75 MW, available heat is still on the order of half of 778 GWh. Interface capex follows demand peak, not IT nameplate. The flat bar is the surplus-heat result.

## Data-center exit

| Field | Hand | JSON | Verdict |
|---|---:|---:|---|
| Year | 10 | 10 | OK |
| Stranded | $5,705,586 | 5.71 | OK |
| Replacement source | $10,348,967 | 10.35 | OK |
| Corridor uplift | $93.217/MWh | 93.2 | OK |

Stranded = (interface + tank + on-site pipe + on-site substations) × 1.35 × (1 − 10/30). Direct sum of those four lines is $6,339,539 × 1.35 × 2/3 = $5,705,586. This is a straight-line remaining-life fraction (20 years left out of 30). It is not a CRF write-off of remaining principal.

Replacement = corridor source peak 5.174 MW × $2,000/kW. The $2,000/kW is `dc_exit.replacement_source_usd_kw`. The plant is sized for the corridor loop, which matches the fallback text (on-site users go back to propane-equivalent or electric; the loop and the building heat pumps stay).

Uplift = (replacement × CRF(7%, 20) + annual corridor source heat / 4.5 × $108/MWh) / 13,500 MWh.

- CRF(7%, 20) = 0.094393
- Capital charge = $10,348,967 × 0.094393 = $976,878
- Source heat = 11,731.5 MWh; at COP 4.5 and $108/MWh → $281,556
- (976,878 + 281,556) / 13,500 = **$93.22/MWh**

**The dollars match the code.** Two assumptions are not in `finance.yaml`: the straight-line 20/30 stranding, and the replacement COP of **4.5** hardcoded in `finance.py`. A winter air-source plant feeding a ~20°C loop can sit below COP 4.5, which would raise the $93 uplift. Mark COP 4.5 as **ASSUMPTION**.

## Federal credit

Base LCOH, base NPV (−$22.32M), and household savings leave the credit out. **OK.**

`incentives.itc_pct` is 0.30 and is applied only in `lcoh_itc7` and `npv7_itc`. JSON stores those as `lcoh_incentive_scenario_if_qualifies_usd_mwh` **81.7** and `funding_gap_incentive_scenario_if_qualifies_musd` **10.69** (hand 81.662 and 10.693). The funding note already says the credit is not assumed.

verification.md row 9d-i (verified 2026-10-03): a waste-heat network is not geothermal heat pump property, because the source has to be ground, groundwater, or other underground fluid. https://www.govinfo.gov/content/pkg/FR-2024-12-12/html/2024-28190.htm. Row 9h: any credit is on eligible basis, not on whole capex (pipe, buildings, land, interconnection sit outside). The $81.7 figure applies 30% to all $38.76M. Keep it as a mechanical upper bound with the counsel label. The base story uses $100.2 (or $96.9 if the host split is fixed) and the $22.32M gap ($20.25M after the split).

## HDR read

Community: **$735/yr** is the bill delta for a 27 MWh propane house at a 20% discount. Oil is **$1,266/yr**. The corridor exists as a covenant if someone funds about **$28.1M** NPV, because the tariff covers operations and the $28.2M corridor capital is unpaid. That is the binding heat-reuse condition, in the same numbers as the finance block.

The Lake Hawkeye site pack, page 24, says: “There are also no disadvantaged communities nearby.” (`resources/text/2026_10_01_Hackathon_NYU_-_Suburban_Site_-_Lake_Hawkeye.txt`). The 20% low-income share and the 35% tier are yaml assumptions. They are a tariff design, not a counted disadvantaged-community share.

Health / air: the household case is propane and oil displaced in a town under the NYSEG moratorium (verification.md 6a, from 2015). Gas at $64/MWh stays cheaper than this LCOH for customers who already have service.

## Fixes

1. Apply `cost_split.dc_interface` before soft costs and contingency. Publish host 7% LCOH **$96.9/MWh** and host gap **$20.25M**, and keep gross capex at **$38.76M**.
2. Quote corridor LCOH **$272/MWh** and town LCOH **$718/MWh** next to any blended $100. Add corridor margin **−$163/MWh** beside `margin_vs_lcoh7`.
3. Point the $5.186 oil citation at https://www.nyserda.ny.gov/Energy-Prices/Home-Heating-Oil/Monthly-Average-Home-Heating-Oil-Prices.
4. Change “Extra 35% tier discount” to “35% off the propane-equivalent ($88.5/MWh, $1,286/yr).”
5. Leave the federal credit out of the base. If the $81.7 case stays, label it a 30% haircut on gross capex that verification.md 9d-i and 9h do not support for this network.
6. Replace the stale $102 / $23.6M lines in `research/model-notes.md` with $100.2 and $22.32M (or $96.9 and $20.25M after fix 1). This lane does not edit that file.
7. Optional: show capex lines to $0.01M so they sum to the $38.76M total. Optional: print the $2.74 and $3.46 propane cases next to the $2.85 case. Optional: name the DC-exit COP 4.5 in `finance.yaml`.

## Lane status

- Done: capex rebuild from yaml unit costs; CRF hand check at 4%, 7%, and 10% for the blend and both base rings; incumbent, tariff, household, and scenario arithmetic; tornado rerun; DC-exit rebuild; town-ring LCOH and the 65°C/70°C clip; proof that base LCOH excludes the 30% credit; confirmation that the web JSON matches `outputs/site2.json`.
- Missing: no re-quote of pipe, tank, or heat-pump unit costs against NREL or the Danish Energy Agency (they stay `[A]`). Central weekly propane and oil were not re-read from the NYSERDA dashboard (verification.md 7a/7b already marks Central propane unreadable). Unclipped 70°C LCOH was not computed (that needs a higher `cop_max`; this lane is read-only). No census count of low-income homes along the corridor.
- Open questions: publish host-share LCOH ($96.9) or keep gross LCOH ($100.2) and show the DC share only as a funding source? Is replacement COP 4.5 the exit case to defend? Is the assumed 20% low-income share the share the tariff should use, given the site pack’s “no disadvantaged communities nearby”?

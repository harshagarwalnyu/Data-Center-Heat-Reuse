# Regenerative scorecard — Thermal Commons (Site 2, Lake Hawkeye)

Team: Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev.
Proposal: Thermal Commons co-op. Site: Lake Hawkeye / TeraWulf, former Cayuga coal plant, Lansing, NY. Comparison site in the app: 111 8th Ave, New York City (Site 1).

This is the audit table for HDR’s seven regenerative domains, the four judging lenses, and the five supply–demand matching axes. Each row is one claim: metric, value, source, and where a judge can see it in the app.

## How to read this scorecard

Three frames, not one. Do not collapse them.

| Frame | What it is | Source |
| --- | --- | --- |
| HDR spectrum (3) | Community, Ecology, Health. Degenerative → regenerative. | Organizer site pack, `resources/text/2026_10_01_Hackathon_NYU_-_Suburban_Site_-_Lake_Hawkeye.txt` pp. 2–5 |
| HDR domains (7) | Human health, community, air, carbon, water, biodiversity, nutrients. | Same pack, p. 5 |
| Judging lenses (4) | Technical; Economic + delivery; Environmental; Social + regenerative. | `PLAN.md` lines 9–15, from the challenge brief |
| Matching axes (5) | Temperature, capacity, timing, seasonality, continuity. | `PLAN.md` line 7; `research/digest-organizer.md` |

The app’s Impact screen (`hdr_scorecard` in `web/public/data/site2.json`) uses the words Community / Ecology / Health. Those are HDR’s three spectrum names, not the four judging lenses. Story step 10 draws each card’s **claim** and the four headline tiles (CO2, homes, jobs, food). It does not draw the `metric` strings stored next to those claims. Several tonne and gallon figures below are in the JSON only (`site2.json` v3.1: CO2 11,408 t, 2,659 cars, 52,016 MWh fossil displaced).

**Which number wins.** `research/verification.md` overrides older fact files, including price and permit claims in `research/facts-site2.md`. `site2.json` v3.1 already carries the audited impact figures (`docs/audit/numbers-impact.md`, 2026-10-04), so the app and this scorecard agree.

Model figures are outputs of `web/public/data/site2.json` (`meta.generated` 2026-10-04). They are calculations, not field measurements. External facts carry a URL and `(verified 2026-10-03)`. Anything not checked is `[unverified]`. Design choices are marked ASSUMPTION.

Base case in the model: **150 MW IT**, load factor 0.8, capture fraction 0.75, capture temperature 50 °C, heat available **777.6 GWh/yr** (88.8 MW average). Totals cover Phases 1–2 only (on-site + corridor). The town ring is reported separately and **fails its cost gate**. A full-build sensitivity at 320 MW critical IT does not add heat customers: delivered heat stays 50.6 GWh and the share of available heat falls to about 3.0% (`extras.scenarios.dc_320MW_full_build`).

Capacity context, verified separately from the model: TeraWulf’s Q2 2026 release states approximately **400 MW gross / 320 MW critical IT**, operations not contemplated until about 2029. The project website’s “~150 MW phase 1” has an unstated basis. The Aug 2025 figure of 138 MW expected in H2 2026 is stale. https://www.sec.gov/Archives/edgar/data/1083301/000108330126000162/a_wulfearningsreleaseq22026.htm ; https://investors.terawulf.com/news-events/press-releases/detail/113/terawulf-secures-long-term-ground-lease-at-cayuga-site-to-expand-high-performance-computing-infrastructure ; https://lakehawkeyedata.com (verification.md rows 3a, 3b) (verified 2026-10-03). The scorecard uses the 150 MW model as the phase-1 case and does not treat 400 MW as today’s load.

## 1. HDR regenerative domains (7)

Place facts below are from the Lake Hawkeye site pack (organizer text; no public URL). Proposal metrics are from the model or from the impact audit.

### 1.1 Human health

| Claim | Metric | Value | Source | Where in app |
| --- | --- | --- | --- | --- |
| Place: mental-health burden at the site is low on the pack’s percentile scale | Census percentile | 27th | Site pack p. 14 | Not shown as a number. Story step 10 (“10 · Impact”) says equity means older residents and propane/oil households, and that there is no designated disadvantaged community |
| Place: asthma near average; heart disease and stroke not elevated at the site | Census percentiles | Asthma 51st; heart disease 42nd; stroke 34th | Site pack pp. 33–35 | Not shown |
| Place: cancer is high across the lake, not established as a site rate | Census note | “very high just across the lake,” communities in the 90th percentile; pack links that pattern to an older population | Site pack p. 36 and p. 39 | Not shown. Do not claim the project changes a cancer rate |
| Replacing propane and oil combustion is the health mechanism on offer | Fossil fuel displaced | **52,016 MWh/yr** (`impact.fossil_displaced_MWh`, v3.1, Census fuel-mix corrected) | App: `impact.fossil_displaced_MWh` and `hdr_scorecard` Human Health `metric`. Audit: `docs/audit/numbers-impact.md`. Factors: EPA GHG Hub 2025, propane 5.72 kg CO2/gal and oil 10.21 kg CO2/gal, verification.md 10d/10e, https://www.epa.gov/system/files/documents/2025-01/ghg-emission-factors-hub-2025.pdf (verified 2026-10-03) | Story step 10 Human Health card shows the claim only (“Replaces propane/oil combustion in homes”). The MWh figure is in the JSON and is not drawn on that card |
| The health effect is fewer combustion appliances, not a counted clinic outcome | Homes on the corridor scenario | 500 is a **scenario signup**, not the town’s housing stock. Propane + oil is about 34/62 of corridor energy, on the order of **275 of those 500** homes. The other modeled homes are electric or “other.” On-site boilers avoided are a separate propane assumption | `docs/audit/numbers-impact.md` § HDR lens map; Census B25040 shares in `research/facts-site2.md`, https://data.census.gov/table/ACSDT5Y2023.B25040 (verified 2026-10-03) | Story step 10 tile says “500 homes on recovered heat.” The Air card claim is “Fewer combustion appliances in homes”; the JSON metric “500 homes” is not drawn on the card. Household screen is step 7 |
| Indoor-air or hospital outcome from less propane/oil | — | `[unverified]` | No health study in the organizer pack or the model | — |

### 1.2 Community

| Claim | Metric | Value | Source | Where in app |
| --- | --- | --- | --- | --- |
| No designated disadvantaged community nearby | EJ note on the pack | “There are also no disadvantaged communities nearby.” | Site pack p. 24 | Story step 10, “Lansing context” card |
| Poverty and minority percentiles are below the national midpoint; the 65+ share is slightly above | Census percentiles | Minority 24th; below poverty 28th; age 65+ 56th | Site pack pp. 37–39 | Not shown as percentiles. Do not convert these into an equity percentage |
| The town is moving to draft a data-center ban. The proposal is the condition under which Lansing could say yes | Board action | Special meeting 2026-09-29; attorney directed to draft a prohibition. No vote on the ban itself | https://www.fingerlakes1.com/2026/10/02/lansing-moves-toward-data-center-ban-as-terawulf-debate-reaches-turning-point/ ; https://607newsnow.com/news/258852-town-of-lansing-moving-forward-with-drafting-a-data-center-ban/ (verification.md 1a) (verified 2026-10-03) | Story step 1 (“1 · Lansing today”) and step 11 (“11 · The ask”) |
| Speaker count “36 of 38 opposed” | Headcount | Single source (607 News Now). Ithaca Voice says only two speakers opposed the ban, one a TeraWulf VP. Sustainable Finger Lakes: about 40 speakers. Do not treat 36/38 as settled | verification.md 1b (verified 2026-10-03) | Not in the current step-1 tiles |
| Legal budget | Dollars | $500,000 in **next year’s proposed budget** for legal costs. Not an existing reserve | https://ithacavoice.org/2026/09/lansing-board-data-center-ban/ (verification.md 1c) (verified 2026-10-03) | Story step 1 tile |
| Affordability hook: new gas service has been blocked for years | Moratorium | NYSEG invoked a moratorium in the Town of Lansing in **2015** (not 2014). Still listed as vulnerable as of the 2025 gas long-term plan (filed 2025-07-14). **2026 status [unverified]** | PSC Case 20-G-0131 order, https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BE068C615-B8EE-4CB9-AF92-3153A49BE4E4%7D ; 2025 update https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7B30700A98-0000-CE30-9B40-1D15BBA44B68%7D (verification.md 6a, 6c-update) (verified 2026-10-03) | Story step 1 tile “2015” |
| A propane household on the co-op tariff saves money versus delivered fuel | Annual bill delta at 27 MWh | **$735/yr vs propane; $1,266/yr vs oil.** Tariff $108.9/MWh is 20% under the model’s propane-equivalent $136.1/MWh. Oil equivalent $155.8/MWh. Natural gas equivalent **$64.2/MWh is cheaper than the tariff** — gas customers would not save | `site2.json` `finance.household`, `finance.tariff_usd_mwh`, `finance.incumbent_usd_mwh`. Arithmetic checked OK in `docs/audit/numbers-finance.md`. Price basis: model uses propane $3.10/gal and Central oil $5.186/gal monthly, labeled from https://www.nyserda.ny.gov/Energy-Prices/Home-Heating-Oil/Average-Home-Heating-Oil-Prices . verification.md 7a–7b: $5.186 is a monthly average, not a late-September weekly; Central weekly propane was not readable; statewide propane on 2026-09-21 was $3.120 (verified 2026-10-03) | Story step 7 (“7 · Your household”); also step 1 propane $/MWh tile; `/print` |
| Low-income tier | Tariff and annual delta | $88.5/MWh, about **$1,286/yr** under propane at 27 MWh. This is **35% off the propane-equivalent**, not an extra 35 points stacked on the 20% discount. The share of homes on this tier is an assumption. It is not a disadvantaged-community count | `docs/audit/numbers-finance.md`; `site2.json` `low_income_tariff_usd_mwh` and `value_by_stakeholder` | Stakeholder string in the JSON. The “extra 35%” wording in that string is wrong; the dollar is right |
| Local jobs | Headcount | **126 jobs** on the on-site campus, a **scenario assumption** (RII-benchmarked, optimistic versus the interpolated 69 greenhouse positions, about 8 FTE, from RII Table 2 for a 10 ha house). Aquaculture 37.5, recreation 12, and network 8 are **ASSUMPTION** and `[unverified]` as payroll. Do not add HDR’s data-center staffing to this | RII Table 2, `resources/text/Colocating-Data-Centers_Greenhouses-RII-Virginia.txt` p. 23; method in `docs/audit/numbers-impact.md` and `docs/audit/code-review-pr2.md`. `docs/greenhouse-anchor.md` recommends a **4 ha** first house and about **40 positions** at 10 acres (RII’s own 10-acre row: 6.5 FTE + 35 part-time). The model’s 10 ha is a larger scenario than that recommendation | Story step 10 jobs tile (126). Say “scenario assumption”, not 126 full-time jobs |
| Local food | Tonnes per year | **5,500 t/yr** (`impact.local_food_t_yr`) is a **scenario assumption**, RII-benchmarked and optimistic versus a more conservative 4,000 t produce (40 kg/m², no supplemental lighting) plus 1,500 t fish. Both yields are ASSUMPTION. RII does not publish 40 kg/m² | `docs/audit/numbers-impact.md` § Food; `impact.local_food_t_yr` 5500 and `impact.fish_t_yr` 1500 | Story step 10 “t food/yr” tile. The Nutrients card shows the claim text only. Its JSON metric (“5500 t/yr fish + produce”) is not drawn, and it is not a nutrient mass |
| Binding ask | Agreement | Community Benefit Agreement plus Heat Supply Agreement as a condition of approval. Modeled whole-project funding gap about **$26.0 million** (corridor stand-alone **$30.3 million**); CBA about **1.7%** of an assumed data-center capex of $10 million per MW × 150 MW = $1,500 million (Turner & Townsend 2025 band $6.6–13.3/W; $10/W is the midpoint **ASSUMPTION**) | `site2.json` `extras.cba`; https://reports.turnerandtownsend.com/data-centre-construction-cost-index-2025/ (cited in the JSON sources) | Story step 8 (“8 · Who pays, who owns”) and step 11 |

### 1.3 Air

| Claim | Metric | Value | Source | Where in app |
| --- | --- | --- | --- | --- |
| Outdoor air at the site is already good | Days worse than “Good” on the pack’s nearby monitors | 0% on the 10-year average and 0% on the 5-year average | Site pack pp. 28–29 | Not shown |
| Ozone and fine particles are low on the pack’s percentiles | Percentile | Ozone 20th; PM2.5 4th | Site pack pp. 31–32 | Not shown |
| A statewide air-quality death figure is not a Lansing site impact | Deaths and cost | Pack: air-quality issues cause over 1,900 deaths and cost New York $5.6 billion. That is a **state** line on the slide. Do not assign it to this project | Site pack p. 30 | Not shown |
| Project air claim that is actually supported | Combustion avoided | Same fuel displacement as human health: **use 52,016 MWh/yr**, not “500 homes leave combustion.” No tons of PM2.5 or NOx are calculated | `docs/audit/numbers-impact.md` | Story step 10 Air card shows the claim only. The 500-home metric is in JSON and is easy to over-read against the “500 homes” tile, which means homes on the network |
| Dry-cooler noise versus a quiet baseline | Sustained sound | Pack: **41.9 dB** at the site vs **40.6 dB** at the ecological baseline (Taughannock Falls State Park). Fan coolers are TeraWulf’s rejection path. This proposal does not remove them. A noise increment from added fans or from greenhouses is `[unverified]` | Site pack pp. 10, 13 | Not shown. Story step 4 says dry coolers keep working |
| Backup combustion | Hours and fuel | Model: **0 unmet hours**, backup **373 MWh/yr** (about 0.7% of 50,576 MWh delivered), boilers sized to 100% of phase 1–2 peak. Backup is propane in the carbon method. It is a small new combustion source, disclosed, not zero | `site2.json` `totals`; `docs/audit/numbers-supply.md` | Story step 6 Continuity pill; step 9 (“9 · What if the data center leaves?”) |

### 1.4 Carbon

| Claim | Metric | Value | Source | Where in app |
| --- | --- | --- | --- | --- |
| Net CO2 avoided, phases 1–2, 150 MW IT case | t CO2/yr | **11,408 t CO2/yr** (marginal-grid case 10,670), v3.1 model with the corrected corridor fuel mix and the backup credit | `docs/audit/numbers-impact.md`. Grid factor OK: eGRID2023 NYUP **242.8 lb CO2e/MWh** → 0.1101 kg/kWh, https://www.epa.gov/egrid (verification.md 10a) (verified 2026-10-03) | Story step 10 CO2 tile. Explore mode recomputes from the same published model |
| Passenger-vehicle equivalent | Vehicles / year | **2,659** (`impact.co2_cars_equiv`): the EPA equivalencies calculator factor of **4.29 t CO2e/vehicle-year** applied to 11,408 t | https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references (audit checked 2026-10-04) | Story step 10 “cars off the road” |
| Marginal-grid sensitivity | t/yr | Published stakeholder string “10,717 with marginal grid.” Audit: **10,670** if the two carbon fixes are applied and the 0.315 kg/kWh factor is kept. **That factor is `[unverified]`** (a midpoint cited only to nyiso.com, not confirmed in verification.md). Do not lead with it | `docs/audit/numbers-impact.md` | Not a primary tile. Buried in `value_by_stakeholder` |
| Energy reuse factor (HDR’s own metric) | ERF = reuse energy / IT energy | **0.0462 (4.6%)**. IT = 150 MW × 0.8 × 8,760 h = 1,051,200 MWh. Reuse drawn on the data-center side ≈ 48,515 MWh. **OK — do not “fix” this.** It is small because customers are small, not because the formula failed | HDR deck definition, `resources/text/NYU_BAC_Hackathon_HDR_Waste_Heat_Reuse_2026.1002.txt` pp. 17–18, via `research/digest-organizer.md`; check in `docs/audit/numbers-impact.md` | Story step 10 context card |
| Energy reuse effectiveness | ERE = (facility energy − reuse) / IT energy | **1.154**, from an **ASSUMPTION PUE of 1.2** (liquid-cooled new build). ERF does not use PUE. ERE does. Say so | Same HDR definition; `docs/audit/numbers-impact.md` | Story step 10 context card |
| Full build does not raise these carbon or ERF headlines | Sensitivity | At 320 MW IT, delivered heat stays 50.6 GWh. ERF would fall by about 150/320 if customers do not grow. Do not print 4.6% next to a 400 MW story | `site2.json` `extras.scenarios.dc_320MW_full_build`; audit note | Explore slider for IT load. Tornado: IT load does not move the 7% LCOH ($106.1 at 75 MW and at 320 MW) because demand, not supply, binds |
| Sequester more carbon in materials than emitted | Embodied CO2 | **Gap.** No materials balance | HDR action list, site pack p. 5. Not in the model | — |
| Capture fraction is a range, not a point | Share of IT power recovered as heat | Base 0.75 → 777.6 GWh available. Low 0.40 → 415 GWh. High 0.85 → 881 GWh. **Delivered heat and LCOH do not change** across that range in the published scenarios, because demand is the constraint | `site2.json` `supply` and `extras.scenarios.recovery_*`. Organizer range 0.4–0.85 is the planning band in `PLAN.md` line 52 | Explore, if the capture control is exposed; otherwise only in the JSON |

### 1.5 Water

| Claim | Metric | Value | Source | Where in app |
| --- | --- | --- | --- | --- |
| Place: water stress, drought, and groundwater decline are low–medium | Pack risk class | Low–medium on all three | Site pack pp. 15–17 | Not shown |
| Place: a runoff path to the lake exists | Direct-discharge percentile | 44th percentile nationally; pack says runoff from the site does reach Cayuga Lake | Site pack p. 18 | Not shown as a percentile. Nutrients story depends on not adding to that path |
| Cooling design does not use the lake as the heat sink | Developer description | Sealed closed loop, “food-grade, non-toxic glycol” (**type not specified** — do not say propylene), air-cooled dry coolers, no draw from or discharge to the lake. This is a **developer claim**. Makeup and domestic water are not addressed. Fluid **renewal** every 7–15 years, not a top-off | https://lakehawkeyedata.com/closed-loop-cooling (verification.md 4a, 4b, 4c) (verified 2026-10-03) | Story step 4 Sankey and lede. Water card on step 10 |
| Lake-water savings from heat reuse | gal/yr claimed | **0.** Heat reuse does not save Cayuga Lake water 1:1. It can only cut fan electricity and the heat those fans would reject to air | `site2.json` `impact.water.note`; `docs/audit/numbers-impact.md` | Story step 10 Water card shows “Closed-loop dry cooling stays; no lake-water claim.” “0 gal/yr” is the JSON metric, not text on the card |
| Fan electricity avoided | MWh/yr | **970.** This is an **ASSUMPTION**: 0.02 kWh fan per kWh heat reused, not a TeraWulf measurement | `impact.water.fan_energy_saved_MWh`; audit | In `impact.water` and the Water `metric` string in JSON. Not drawn on the Water card |
| DEC withdrawal | Permit | Cayuga Operating Company LLC, up to **1,008,000 gallons per day**, letter 2026-04-13, effective through 2031-04-30, ID 7-5032-00019/00024, source Cayuga Lake. Article 15 withdrawal, not SPDES. Uses in the text: **system maintenance, sump pumping, and dust control** | https://dec.ny.gov/sites/default/files/2026-04/cayugaoperatingwwpermit.pdf (verification.md 5a–5c) (verified 2026-10-03) | Step 11 ask says “keep the lake permit unused for cooling.” Tighten that: the renewal is **already** limited to those uses. A covenant should stop a later modification from turning it into cooling makeup. Heat reuse does not retire the permit |
| County objections | What they targeted | Tompkins County Res. 2026-3 (2026-01-20, 14–1) and Seneca County Res. 63-26 asked DEC for a new review of a **pending modification** for data-center use. DEC then renewed the limited-use permit. Not the same application | https://tompkinscountyny.iqm2.com/Citizens/Detail_LegiFile.aspx?ID=13804&MeetingID=4213 ; https://www.fltimes.com/news/seneca-county-board-of-supervisors-to-dec-reject-terawulfs-modified-permit-request/article_cce901b6-e44d-41b6-ae0c-e0f9bf79e1d7.html (verification.md 5d–5f) (verified 2026-10-03) | Not in the app |
| Flood and future rain | Place risk | Pack: site does not appear on the FEMA flood layer, but the maps “drop off” and need more investigation. Precipitation **+3 inches within 10 years**. No project stormwater volume is calculated | Site pack pp. 20–21 | Not shown. **Gap** |
| Site water-use effectiveness (WUE) | L/kWh | `[unverified]` for this design. HDR deck cites an industry average site-WUE of 1.8 L/kWh; that is not a Lake Hawkeye measurement | `research/digest-organizer.md` on HDR deck p. 15 | Not shown |

### 1.6 Biodiversity

| Claim | Metric | Value | Source | Where in app |
| --- | --- | --- | --- | --- |
| Cumulative biodiversity risk at the site is not scored as severe; agriculture is the greatest threat the pack names | Pack maps | “Cumulative is not much of a threat.” “Agriculture is the greatest threat to Biodiversity.” | Site pack pp. 11–12 | Not shown as a map. Biodiversity card is a design claim, not this map |
| Build the growing area on already-disturbed industrial ground | Siting rule | ASSUMPTION, and the one that matches the pack: a new greenhouse on intact habitat would cut against the agriculture finding. The 183-acre, 80-year ground lease to Lake Hawkeye LLC is confirmed. A 434-acre site and “~250 unleased acres” are **`[unverified]`** — do not state them | Lease: https://www.sec.gov/Archives/edgar/data/1083301/000110465925078086/tm2523008d1_8k.htm (verification.md 3c) (verified 2026-10-03). Acreage remainder: verification.md 3d. Design rule: `docs/greenhouse-anchor.md` | Story step 3 map (“proposed campus on adjacent land”) |
| Greenhouse area in the model | Hectares | **10 ha** in `impact.greenhouse_ha`. That is a scenario input. `docs/greenhouse-anchor.md` recommends **4 ha (about 10 acres)** as phase 1, with a pilot trout system and one indoor pool, and treats 10 ha as a later phase. RII security note: greenhouse up to about 0.6 miles from the hall; that distance fits on the industrial property and does not justify a town-center pipe | `site2.json`; `docs/greenhouse-anchor.md`; RII extract | Story step 3 headline uses the model hectares. The Biodiversity card shows “Brownfield reuse; heat to controlled-environment agriculture.” “10 ha” is the JSON metric, not text on the card |
| Species, habitat acres restored, or soil-contamination status | — | **Gap.** Pack action list includes re-establish biodiversity, avoid soil contamination, and species at risk. No species list and no restoration acreage are in the model | Site pack p. 5 | Biodiversity card does not invent a species count. Keep it that way |
| Noise baseline (also an ecology constraint on fan coolers) | dB | 41.9 vs 40.6, as in Air | Site pack p. 13 | Not shown |

### 1.7 Nutrients

| Claim | Metric | Value | Source | Where in app |
| --- | --- | --- | --- | --- |
| Cayuga Lake is impaired for phosphorus | Impairment and TMDL | Two impaired waters downstream (the lake and an inlet). EPA-approved phosphorus TMDL: **30% reduction** from the watershed recommended. Nonpoint sources, including agricultural and developed-land runoff, are more than 90%. Agriculture was the largest contributor. DEC counted about 39,000 lb phosphorus/year already removed by existing grants. Southern segment 0705-0040 listed impaired for total phosphorus (303(d) year 2002) | Site pack p. 19. DEC release https://dec.ny.gov/news/press-releases/2024/9/dec-announces-epa-approved-pollution-prevention-plan-for-cayuga-lake-watershed and PWL https://extapps.dec.ny.gov/data/WQP/PWL/0705-0040.html (`docs/greenhouse-anchor.md`) (verified 2026-10-03) | Story step 10 notes and Nutrients card. The spoken line should stay “do not add phosphorus,” not “clean the lake” |
| Closed loop is the design intent | Discharge | Covenant language that matches the facts: no process discharge from the fish system or the greenhouse fertilizer loop to the lake or to a ditch that reaches it; solids leave under a nutrient plan. This is **“do not add a new phosphorus source.”** It is not a TMDL credit unless DEC says so | `docs/greenhouse-anchor.md` § 8 | Nutrients card |
| Food tonnes are not nutrient tonnes | Mass of P or N kept out of the lake | **`[unverified]`.** The JSON metric “5,500 t/yr fish + produce” is yield, and the yields themselves are assumptions. No phosphorus or nitrogen mass is calculated. The on-screen card does not print that tonne figure; the food tile does, as “t food/yr” | `docs/audit/numbers-impact.md` | Story step 10 food tile and Nutrients JSON metric. Do not read either as nutrient mass |

## 2. Judging lenses (4)

From `PLAN.md`: Technical; Economic + delivery; Environmental; Social + regenerative.

| Lens | Claim | Metric | Value | Source | Where in app | Gap |
| --- | --- | --- | --- | --- | --- | --- |
| Technical | Heat is taken as a side-stream. Cooling does not depend on customers | Architecture | Plate heat exchanger on the sealed loop; dry coolers remain the rejection path. On-site users at **45 °C** with direct exchange (`direct_heat_exchange: true`). Corridor ambient loop **20 °C** plus building heat pumps (COP **4.71**). Town, if built, **65 °C** central loop, COP shown at the **6.0 cap** | `site2.json` `rings`, `cop_compare`. Organizer COP bound 2–6 in `PLAN.md` line 52. OCP direct-liquid return 45–65 °C, `resources/text/20230623_Data_Centers_HeatReuse_101_3.2.docx.txt` | Story steps 4 and 5 | Liquid-cooled COP of 6.0 sits on the organizer ceiling. Treat it as capped, not as a measured machine |
| Technical | Reliability of cooling and of heat are both specified | Unmet hours; backup; storage | **0 unmet hours.** Backup **373 MWh/yr**. Storage **5,558 m³** (about 6 h of peak in the capex line). If the data center leaves in year 10: stranded exposure **$5.71 million**, replacement source **$10.35 million**, corridor heat about **$93/MWh** more expensive; pipes and building heat pumps stay | `site2.json` `totals`, `finance.dc_exit` | Story steps 6 and 9 | “0 unmet hours” is because backup is sized to 100% of peak, including 120 hours when supply is modeled as zero (`docs/audit/numbers-supply.md`). Say that |
| Economic + delivery | Who owns what, and what heat costs | Capex, LCOH, tariff | Phases 1–2 capex **$38.76 million**. LCOH: co-op 4% **$89.5/MWh**, utility 7% **$106.1/MWh**, private 10% **$124.6/MWh**. Tariff **$108.9/MWh**. Opex **$1.94 million/yr**. Many capex lines are ASSUMPTION $/kW | `site2.json` `finance` | Story step 8; `/explore` | Several direct-cost lines are assumptions (JSON `source` fields). Federal credits are **out of the base case** (verification.md 9d: waste-heat networks likely not IRC 48 geothermal; JSON source `ver_itc`) |
| Economic + delivery | On-site heat is the cheap product. The town main is not | Ring LCOH at 7% | On-site **$40.6/MWh** (0.5 km). Corridor **$285.8/MWh** (20.9 km, linear heat density **0.65 MWh per metre per year**). Town **$734.2/MWh**, 14.0 km, pipe loss **1,840 MWh/yr**, `passes_gate: false`. A 70 °C town sensitivity does not change that LCOH in the published scenario | `site2.json` `rings` and `extras.scenarios.town_hot_loop`. CBS distance grade “poor” above 2 km, `resources/text/CBS_Data_center_white_paper_DISTRICT_HEATING.txt` via `research/digest-organizer.md` | Story step 3 ring cards; step 8 ring chart | PLAN’s density gate starts near 1.5 MWh/m/yr. The modeled corridor is **0.65** and is still inside the phase 1–2 totals. That is a design tension, not a passed gate. Town annual loss is about 34% of heat sent, above CBS’s 0.5–1.5%/km design-flow band when read as an annual figure (`docs/audit/numbers-demand.md`) |
| Economic + delivery | The covenant has a price | Funding gap | Corridor stand-alone gap about **$30.32 million** (about **$1.01 million/yr** straight-line over 30 years; **$2.44 million/yr** annuitized at 7%). Whole-project gap **$26.01 million** (**$2.10 million/yr** annuitized). As a share of assumed data-center capex: **1.73%** (whole project, the headline) | `site2.json` `extras.cba`; `docs/audit/numbers-finance.md` | Story steps 8 and 11 | $1,500 million data-center capex is $10/W × 150 MW, a midpoint assumption inside the Turner & Townsend band, not a TeraWulf budget |
| Environmental | Carbon, efficiency, resources | See domains | Use **11,408 t CO2/yr**, ERF **0.0462**, ERE **1.154** (PUE assumed), water **0 gal/yr**, fan **970 MWh/yr** (assumed). Nutrients: no mass. Biodiversity: siting rule, not a restored-acre count | Section 1 | Story step 10 | App tiles match v3.1 (11,408 t, 2,659 cars; 126 jobs and 5,500 t food are labelled scenario assumptions) |
| Social + regenerative | Stakeholder value without an EJ overclaim | Bill savings, jobs, acceptance | $735 / $1,266 per 27 MWh home; low-income tier $1,286 vs propane; jobs as in §1.2; no DAC (pack p. 24); older-resident percentile 56th. Public acceptance is the 2026-09-29 draft-ban direction, not a poll result | Sections 1.1–1.2 | Steps 1, 7, 10, 11 | 36/38 is contested. 2026 moratorium status `[unverified]`. Low-income participation rate is an assumption |

## 3. Matching axes (5)

Phases 1–2 unless noted. Derived ratios use only fields in `site2.json` `monthly` and `supply` / `totals`.

| Axis | Claim | Metric | Value | Source | Where in app | Gap |
| --- | --- | --- | --- | --- | --- | --- |
| Temperature | Liquid-loop heat can serve the on-site campus without a lift, and buildings with a modest lift | °C and COP | Capture **50 °C**. On-site supply **45 °C**, direct exchange (the 5 K drop is two approach penalties in the model notes). Corridor **20 °C** ambient, building-HP COP **4.71**. Town **65 °C**, central COP **6.0** (capped). Air-cooled comparison COP **4.73** from 30 °C. Organizer 4th-generation target band cited in the plan is **55–65 °C**; 70 °C is a sensitivity and does not change the published town LCOH | `site2.json`; `docs/audit/numbers-supply.md`; RII water-cooled 45–55 °C in `docs/greenhouse-anchor.md`; `PLAN.md` line 52 | Story step 5 temperature ladder; step 6 pill 1 | 50 °C is an input inside the 45–55 °C band, not a TeraWulf datasheet. If the plant is pitched as AI/HPC liquid (RII 55–70 °C), show 55 °C as a sensitivity. Coldest-day greenhouse design near 75 °C is in RII; 45 °C direct use is **not** a full design-day cover. RII: 45–50 °C “will normally cover 70 to 90%” of greenhouse power, and trials need repeating (`docs/greenhouse-anchor.md`) |
| Capacity | Supply is much larger than the customers we can honestly sign | GWh and ratio | Available **777.6 GWh/yr**. Delivered **50,576 MWh (50.6 GWh)**, **6.5%** of available, about **15×** on annual energy (777.6 / 50.576). On-site **37,076 MWh**, peak **16.36 MW**. Corridor **13,500 MWh**, 500 homes, peak **6.84 MW**. Town **3,577 MWh**, peak **2.96 MW**, excluded from the 50.6 GWh | `site2.json` `supply`, `totals`, `rings` | Story step 2 ratio bars; step 6 pill 2 | 500 homes and 10 ha are scenario sizes. Town 3,577 MWh uses assumed floor areas and intensities (`docs/audit/numbers-demand.md`). RII’s “~2 acres of greenhouse per data-center MW” is a different ratio (673 acres / 326 MW in the Virginia literature line) and would wildly oversize this town. Do not use it as the Lansing plan |
| Timing | Daily peaks are smoothed; the network is not a real-time slave of IT load | Storage vs peak | Tank **5,558 m³**. Winter-week series in the JSON shows storage holding about **129 MWh** in the sample hours. Story derives hours of peak from 5,558 m³ × 1.163 kWh/m³/K × 40 K. Backup covers the hours the tank and the data center do not | `site2.json` `totals.storage_m3`, `weeks.winter`; formula in `web/components/story/steps.tsx` | Story step 6 pill 3 and winter week chart; step 9 “first hours” | The 40 K swing is in the story component, not a separate measured test. January backup is **149 MWh** and April backup is **224 MWh** (`monthly`) — those are the hours storage does not cover |
| Seasonality | Summer load collapses; the on-site campus is the base load that remains | Monthly demand | January demand **8,954 MWh**. Lowest month is July **735 MWh**, about **8%** of January (735 / 8,954). Tightest supply/demand month is January: 65,250 / 8,954 ≈ **7.3×**, which is the minimum the story prints. August demand (901 MWh) is above July. Greenhouse, aquaculture, and pool are what keep a summer floor; they are a weak summer sink, and dry coolers still reject the rest | `site2.json` `monthly`; `docs/greenhouse-anchor.md` | Story step 6 pills and monthly chart | Do not claim the greenhouse absorbs the campus in July. July supply in the file is **66,960 MWh** against **735 MWh** demand |
| Continuity | Heat continues if the data center dips or leaves; cooling continues if the network fails | Unmet hours, contract, exit | **0 unmet hours** with backup at 100% of peak. Heat Supply Agreement term aligned to the plan’s **10-year** horizon because data centers rarely contract longer, plus renewals and step-in (`PLAN.md` line 52). Year-10 exit costs in §2. Cooling independence in §2 Technical | `site2.json` `finance.dc_exit`; `PLAN.md` | Story steps 6 and 9 | Step-in to an air-source or borehole plant, and the decommissioning bond, are design terms in the JSON fallback string. They are not executed agreements. `[unverified]` as legal instruments |

Town-center distance, the reason continuity and capacity are not solved by a school pipe: straight-line estimates in `research/facts-site2.md` from published addresses — school campus **7.0 mi** (https://www.lansingschools.org), town hall and library **5.7 mi** (https://www.lansingtownny.gov , https://www.lansinglibrary.org) (addresses verified 2026-10-03). The mile figures are calculated, not a surveyed route; the fact file says road distance is roughly 15–25% longer. The model uses **14.0 km** of town pipe. That main fails the cost gate.

## 4. Crosswalk — domains × lenses × axes

| Domain | Spectrum (pack) | Judging lens it mainly serves | Matching axis it depends on | One sentence a judge can check |
| --- | --- | --- | --- | --- |
| Human health | Health | Social + regenerative | Temperature (combustion replaced only where heat is usable) | Health claim is displaced propane/oil (**52,016 MWh/yr** to use), not a medical outcome |
| Community | Community | Social + regenerative, and Economic + delivery | Capacity (only the heat we can sell) | No DAC. Value is the 2015 gas moratorium, **$735/yr** on a 27 MWh propane home, and a covenant priced near **$28 million** for the corridor |
| Air | Health | Environmental | Continuity (backup boilers are a small new source) | Outdoor air is already “Good.” Project claim is less in-home combustion, plus disclosed backup of **373 MWh/yr** |
| Carbon | Ecology | Environmental | Capacity (ERF stays ~4.6% because demand is ~6.5% of supply) | **11,408 t CO2/yr** to use; ERF **0.0462** is the honest efficiency number |
| Water | Ecology | Environmental | None of the five axes create a lake-water credit | **0 gal/yr** claimed. Permit is 1.008 MGD and already limited to maintenance, sump, and dust control |
| Biodiversity | Ecology | Environmental, Social + regenerative | Temperature (45 °C direct use is why the campus sits on site) | Agriculture is the pack’s top threat. Grow on the industrial pad. **10 ha** is the model; **4 ha** is the phase-1 recommendation |
| Nutrients | Ecology | Environmental | Seasonality (year-round fish and crop loop, not a summer dump) | Phosphorus TMDL is 30%. Design is no new discharge. Nutrient mass `[unverified]` |

Climate resilience sits across Technical and Environmental and is not its own domain: the pack says about **+3 °F by 2050** and up to **69 days above 90 °F** versus **19 today** (p. 26), and about **+12 °F by 2080** (p. 27). That matters for dry-cooler capacity on hotter days. It is on the Story step 10 context card. It is not a modeled derate. Tornado risk on the pack is “1st percentile” nationally (p. 22). Social vulnerability is described as able to bounce back (p. 23) — another reason not to invent an EJ story.

## 5. What this proposal is (and the covenant frame)

The Thermal Commons co-op is the ownership vehicle: it owns pipes and heat pumps; the data center sells heat and keeps cooling independent (Story step 8). The political fact is the Town Board’s 2026-09-29 direction to draft a ban (verification.md 1a). The proposal is the condition that could make a project acceptable: a binding Community Benefit Agreement and Heat Supply Agreement, not a sustainability add-on (`PLAN.md` reality-check table).

Three rings, in the order the economics allow:

1. **On-site (phase 1, in the totals).** Greenhouse, aquaculture, and a rec center with pool. Supply 45 °C, 0.5 km, LCOH $40.6/MWh. This is the product that beats propane.
2. **Corridor (phase 2, in the totals).** 500 homes on a 20 °C ambient loop, 20.9 km, LCOH $285.8/MWh, linear density 0.65 MWh/m/yr. The household tariff only works if the funding gap (about $30 million stand-alone, $26 million for the whole project) is covered by the benefit agreement, grants, or cheaper capital. Density is below the plan’s own 1.5 MWh/m/yr screen.
3. **Town center (phase 3, not in the totals).** School and town buildings, about 5.7–7.0 miles straight-line, 14 km in the model, LCOH $734.2/MWh, `passes_gate: false`. Build only with grant funding or a larger anchor. The published scenario names Cargill as an example and does not show a passed case.

Precedent, and only as precedent: Deep Green’s 24 MW proposal with the Board of Water & Light was in **Lansing, Michigan**, announced 2025-11-05, and **withdrawn 2026-04-06**. It is not this site. https://www.lbwl.com/community/newsroom/2025-11-05-deep-green-proposes-120-million-sustainable-data-center-investment ; https://www.wkar.org/michigans-data-center-divide/2026-04-06/proposed-data-center-wont-move-forward-in-lansing-as-deep-green-withdraws (verification.md row 12) (verified 2026-10-03). Story step 1 uses it that way.

New York Executive Order 62 (2026-07-14) pauses certain DEC data-center permits of 50 MW and above until a final generic EIS. Whether it covers Lake Hawkeye is **`[unverified]`**. Do not say the project is stopped by the order. Local approvals are outside the order’s text. https://www.governor.ny.gov/executive-order/no-62-establishing-temporary-moratorium-data-centers-new-york-while-state-develops (verification.md 2a, 2b) (verified 2026-10-03).

## 6. Gaps and non-claims

- Do not say heat reuse saves Cayuga Lake water 1:1. Claim **0 gal/yr**. Glycol type is “food-grade, non-toxic,” not documented as propylene.
- Do not say the 1.008 MGD permit is a cooling right the project is voluntarily giving up. The April 2026 renewal is already limited to maintenance, sump pumping, and dust control. The covenant is: do not modify it into cooling makeup.
- Do not use 400 MW as the current load. Model base is 150 MW IT. The filing is ~400 MW gross / ~320 MW critical IT, operations about 2029. The website’s 150 MW phase-1 split has an unstated basis.
- Do not say “~250 unleased acres” or “434 acres.” The confirmed land fact is an **183-acre, 80-year** lease. Remainder ownership is `[unverified]`.
- Do not say there is a designated disadvantaged community, and do not invent an equity percentage from the 28th poverty percentile.
- Say **126 jobs** and **5,500 t of food** only as labelled scenario assumptions (RII-benchmarked, optimistic versus 69 positions / 4,000 t). The app and this scorecard agree on **11,408 t CO2**, **2,659 cars**, and **52,016 MWh**.
- Do not treat 5,500 t of food as phosphorus kept out of the lake.
- Do not claim a materials carbon sink, a species benefit, a stormwater design volume, a WUE, or a noise reduction. Those HDR action-list items are open.
- Do not mix Lansing, Michigan with Lansing, New York.
- Do not claim the town-center main pays. It fails. Corridor density also fails the plan’s 1.5 MWh/m/yr screen even though the model includes it.
- Moratorium **in force in 2026** is `[unverified]` (confirmed through the 2025-07-14 filing). Speaker count 36/38 is single-source and contested.
- Marginal-grid carbon factor 0.315 kg/kWh is `[unverified]`.
- Embodied carbon, nutrient mass (kg P or N), aquaculture jobs per tonne, recreation headcount, fan kWh per kWh rejected, and a surveyed (not straight-line) pipe route are `[unverified]`.

## Lane status

### Done

- File created and filled for HDR’s seven domains, the three spectrum names, the four judging lenses, and the five matching axes.
- Every proposal metric is tied to `web/public/data/site2.json` and to the screen that shows it (Story steps 1–11, plus Explore, Compare, and Print where relevant).
- Place facts taken from the Lake Hawkeye organizer pack (percentiles, phosphorus, no disadvantaged community, climate, air, noise).
- Permit, cooling description, moratorium year, capacity filing, Deep Green (Michigan), EO 62, and the $500k budget line taken from `research/verification.md` with URLs.
- Impact tiles reconciled to `docs/audit/numbers-impact.md`: CO2 11,408 t, cars 2,659, fossil 52,016 MWh, jobs 126 and food 5,500 t as labelled scenario assumptions (optimistic versus 69 positions / 4,000 t), water 0 gal/yr, ERF 0.0462 left as-is.
- Town-center distances cited as straight-line estimates from `research/facts-site2.md` (school 7.0 mi, town hall/library 5.7 mi) and matched to the model’s failed 14 km / $734.2/MWh gate.
- App/JSON conflicts called out so a judge is not handed two different CO2 or jobs numbers.

### Missing

- Jobs (126) and food (5,500 t) in `site2.json` are scenario assumptions, not audited outcomes.
- No re-run of the Python model in this pass. Corrected CO2, cars, and fossil MWh are cited from `docs/audit/numbers-impact.md`, not recomputed here.
- No surveyed route length for the town main (only straight-line miles plus the model’s 14.0 km).
- No kg of phosphorus or nitrogen, no WUE, no embodied carbon, no species list, no stormwater cubic feet.
- HDR tool-input figures sometimes quoted elsewhere (about 46 acres and 50 data-center FTE) are **not in the text extract** of the site pack (page 9 is a title in the extract). They are not used above.
- Site 1 is the comparison in `/compare`. This scorecard does not restate Site 1’s carbon or steam numbers.
- 2026 status of the NYSEG moratorium, and whether EO 62 covers this project, remain open in verification.md.

### Open questions

- Is phase-1 growing area **4 ha** (greenhouse-anchor recommendation, ~40 RII positions at 10 acres) or **10 ha** (the model)? The scorecard reports both and does not pick a payroll.
- Should the corridor stay inside the headline totals while its linear density is 0.65 MWh/m/yr, below the 1.5 screen in `PLAN.md`?
- Is the low-income tier’s assumed participation rate something the town wants on a slide, given the pack’s “no disadvantaged communities nearby”?

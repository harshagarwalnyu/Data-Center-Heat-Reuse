# Environmental red team — Thermal Commons (Site 2, Lake Hawkeye / Lansing NY)

Skeptic lens: greenwashing a data center, grid emissions, water, embodied carbon of pipes, rebound.

Judging map: HDR regenerative design — Community, Ecology, Health; human health, community, air, carbon, water, biodiversity, nutrients (`resources/text/2026_10_01_Hackathon_NYU_-_Suburban_Site_-_Lake_Hawkeye.txt`, p. 5) (verified 2026-10-03). Grundfos water lens: water and energy as one system, and data centers that “rely on water to stay cool” (`resources/text/Every_Drop_Counts_-_Grundfos_Water_Scarcity_Paper_2026_Web_(1).txt`) (verified 2026-10-03).

Scope: model base is 150 MW IT, load factor 0.8, capture fraction 0.75, 777.6 GWh/yr heat available (`web/public/data/site2.json` `supply`, generated 2026-10-04). TeraWulf’s 5 August 2026 release is about 400 MW gross / about 320 MW critical IT, operations about 2029, with no phase-1 split in that filing (https://www.sec.gov/Archives/edgar/data/1083301/000108330126000162/a_wulfearningsreleaseq22026.htm , verification.md row 3a) (verified 2026-10-03). The ~150 MW phase-1 figure is the project website, basis unstated (https://lakehawkeyedata.com , row 3a) (verified 2026-10-03). Site 1 (111 8th Ave) is the comparison only. Team: Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev. Vehicle: Thermal Commons co-op.

The site pack states there are no designated disadvantaged communities nearby (Lake Hawkeye pack, p. 24) (verified 2026-10-03). This memo does not dress carbon or water as an equity claim.

## How to read this

Each attack has the claim a skeptic will punish, the evidence, a severity (High / Medium / Low), and the sentence to put in the deck. Model figures are from `web/public/data/site2.json` (generated 2026-10-04) and the reproduction in `docs/audit/numbers-impact.md`. They are calculations, not measurements. External facts carry a URL and “(verified 2026-10-03)” unless the audit dated a later check. Gaps are `[unverified]`. Assumptions are marked ASSUMPTION.

## 1. Greenwashing the data center

**Severity: High.**

**Claim at risk.** “Waste-heat reuse makes Lake Hawkeye a low-carbon / regenerative data center.” HDR’s own test on pack p. 5 is to eliminate greenhouse-gas emissions, and to sequester more carbon in materials than the rest of the materials emit (verified 2026-10-03). The proposal does neither.

**Evidence.**

- Energy reuse factor in the model is **0.0462** (`site2.json` `impact.erf`). HDR’s definition is reuse energy divided by IT energy (`resources/text/NYU_BAC_Hackathon_HDR_Waste_Heat_Reuse_2026.1002.txt`, pp. 17–18) (verified 2026-10-03). The audit’s numerator is 48,514.5 MWh of data-center-side heat actually supplied; IT energy is 150 MW × 0.8 × 8,760 h = **1,051,200 MWh**; 48,514.5 / 1,051,200 = 0.04615 (`docs/audit/numbers-impact.md`). HDR’s worked example reuses 200 kWh out of 1,000 kWh IT (20%). Ours is 4.6%.
- Phases 1–2 deliver **50,576 MWh** against **777.6 GWh** available: **6.5%** of the heat (`site2.json` `totals.share_of_available_pct`). July demand is 735 MWh against 66,960 MWh of supply that month (1.1%). January delivered is 8,804 MWh against 65,250 MWh of supply (13.5%). The dry coolers still reject the rest, all year, and almost all of it in summer.
- Published carbon is **11,408 t CO2/yr** (`site2.json` `impact.co2_avoided_t_yr`), after the audit’s mix and backup corrections (`docs/audit/numbers-impact.md`). Cars equivalent in the same file is **2,659**, using 4.29 t CO2e per vehicle-year (https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references , checked in that audit 2026-10-04).
- ASSUMPTION, arithmetic from those inputs: 1,051,200 MWh × 242.8 lb CO2e/MWh (eGRID2023 NYUP total-output CO2e, https://www.epa.gov/egrid/summary-data and https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.pdf , verification.md row 10a) (verified 2026-10-03) is about **115,800 t CO2e/yr** for the IT electricity alone. 11,408 / 115,800 is about **10%**. Facility overhead is extra. PUE 1.2 is an assumption in `config/engineering.yaml` and is what produces ERE **1.154**; it is not a measured PUE (`docs/audit/numbers-impact.md`). A power-purchase contract for this site is `[unverified]`. The pack says the site “will get a mix of energy from various point sources” and that nearby plant emission rates are not listed (p. 24) (verified 2026-10-03).
- `research/facts-site2.md` still contains an “88% to 91%” carbon-cut line built on 61.46 kg CO2/MMBtu. Verification row 10d corrects liquid propane to **62.87 kg CO2/MMBtu** and **5.72 kg CO2/gal** (https://www.govinfo.gov/content/pkg/CFR-2020-title40-vol23/xml/CFR-2020-title40-vol23-part98-subpartC-appC.xml ; Hub 2025 https://www.epa.gov/system/files/documents/2025-01/ghg-emission-factors-hub-2025.pdf) (verified 2026-10-03). A per-unit rate against a propane boiler is also a different claim from the project total. Leave that sentence out of the talk.

**Fix (say this).** “We reuse 4.6% of IT energy and about 6.5% of the heat the plant rejects. That avoids 11,408 tonnes a year of fuel CO2 on the upstate average grid, after heat-pump electricity. It is about a tenth of the IT load’s grid carbon. We are not net zero, and we have no materials balance. ERE 1.154 uses an assumed PUE of 1.2.”

## 2. Grid emissions and the "waste heat is free carbon" fallacy

**Severity: High** on the ledger; **Medium** on the factor choice.

**Claim at risk.** “Waste heat is carbon-free, so every megawatt-hour delivered is pure avoidance.” Heat at the fence is a byproduct of electricity the grid already emitted. The only new avoidance is fuel the customers stop burning, minus the electricity the heat pumps, pumps, and backup add.

**Evidence.**

- Method matches PLAN.md §4.4: displaced fuel × emission factor, minus heat-pump electricity × grid factor. Grid factor in the model is **0.1101 kg/kWh**, which is 242.8 lb/MWh × 0.45359237 / 1000 (`docs/audit/numbers-impact.md`). Fuels are CO2; the grid term is CO2e. Propane CH4 + N2O is about 0.4% of the CO2 factor (verification.md row 10d) (verified 2026-10-03). That gap is small. Say “tonnes CO2” for the fuel term and “CO2e” for the grid term.
- In the pre-fix build the audit reproduced, gross displacement was 11,943 t: **9,287 t from on-site loads treated as 100% propane**, plus a corridor term. Added emissions were 487 t (heat-pump and pumping electricity, plus backup propane). Net 11,455.81 t, which the file used to print as 11,456. Two corrections produce the current **11,408 t**: the corridor mix is renormalized to Census non-gas shares (propane 26/62, oil 8/62, electric 24/62), which removes about 135 t, and backup hours get the fuel those hours would have burned anyway, which adds about 88 t (`docs/audit/numbers-impact.md`). Census shares: https://data.census.gov/table/ACSDT5Y2023.B25040 (verified 2026-10-03), as recorded in `research/facts-site2.md`. Household shares are not energy-weighted. The electric bin is “baseboard plus a growing heat pump share”; the resistance-versus-heat-pump split is `[unverified]`. The electric credit (571 t in the corrected corridor term) is an upper bound.
- Boiler efficiencies (propane 0.85, oil 0.82) are model assumptions in `config/finance.yaml`, not EPA factors.
- Marginal-grid sensitivity in the file is **10,670 t/yr** (`site2.json` `extras.co2_avoided_marginal_grid_t_yr` and the Climate stakeholder line). The 0.315 kg/kWh factor is the midpoint of a 0.28–0.35 range cited only to https://www.nyiso.com. Verification.md does not confirm it. **[unverified].** eGRID2023 non-baseload NYUP is not in verification.md. Do not swap in the equivalencies-calculator’s eGRID2022 non-baseload figure.
- Site 1 avoids more CO2 per megawatt-hour delivered. The model’s own comparison is **0.365 t/MWh at 111 8th Ave versus 0.226 t/MWh at Lake Hawkeye**, because Con Edison steam is a fossil incumbent (`web/public/data/site1.json` `why_not_chosen`, generated 2026-10-04). Site 1 published total is 11,888 t/yr (`site1.json` `impact.co2_avoided_t_yr`). NYCW is 865.7 lb CO2e/MWh against NYUP 242.8 (verification.md row 10a) (verified 2026-10-03). Choosing Lansing is a cost and leverage choice. Carbon per unit of heat favors Manhattan. Say that before a judge does.
- Organizer guide: heat recovery improves ERF and can worsen PUE (`resources/text/DATA_HEAT_-_Sector_Couling_Data_Centeres_and_District_Energy_-_Market_Development_Guide_and_Appendicies_-_3MAR26.txt`, footnote 26, immediately before the page-65 break) (verified 2026-10-03). Report ERF and PUE as separate lines.

**Fix (say this).** “11,408 tonnes is displaced propane and oil, plus an upper-bound credit for electric heat, minus our heat-pump electricity on the 2023 upstate average grid. The 10,670-tonne marginal case uses an unverified 0.315 kg/kWh factor, so the slide leads with 11,408. Manhattan avoids more carbon per megawatt-hour of heat. We still pick Lansing because the heat has to be cheap enough to beat propane, and because a heat contract can be a condition of the local approval.”

## 3. Water: closed loop vs. the 1.008 MGD permit

**Severity: High** if the deck implies lake water is saved. **Low** if the deck already says 0 gallons. The current JSON note is the Low version. Keep it, and tighten one sentence.

**Claim at risk.** “Heat reuse saves Cayuga Lake water,” or “we are retiring a 1.008 million-gallon-a-day cooling permit.”

**Evidence.**

- Developer claim, not an independent measurement: a sealed loop, “food-grade, non-toxic glycol” (chemistry not named — do not say propylene), air-cooled dry coolers, no draw from or discharge to the lake (https://lakehawkeyedata.com/closed-loop-cooling , verification.md row 4a) (verified 2026-10-03). “Zero thermal discharge” means no discharge to the lake; the heat still goes to air (row 4c) (verified 2026-10-03). Fluid **renewal** every 7–15 years is developer marketing (row 4b) (verified 2026-10-03). Makeup water and domestic water are outside that claim (row 4a).
- DEC renewed a water-withdrawal permit (Article 15, Title 15, not SPDES) for **Cayuga Operating Company LLC**: up to **1,008,000 gallons per day**, source Cayuga Lake, letter 2026-04-13, effective 2026-04-13, expires 2031-04-30, ID 7-5032-00019/00024 (https://dec.ny.gov/sites/default/files/2026-04/cayugaoperatingwwpermit.pdf , rows 5a–5b) (verified 2026-10-03). Uses in the permit text: **system maintenance, sump pumping, and dust control** (row 5c) (verified 2026-10-03). The text limits uses. It does not, by its wording, forbid evaporative cooling by name (verification.md correction note). Emergency fire pumps are exempt and not counted (row 5c).
- County objections targeted a **different** application: a pending 2021 modification for data-center use. DEC then issued this renewal at the same volume with the limited uses (row 5f) (verified 2026-10-03). Tompkins County Resolution 2026-3 (2026-01-20, 14–1) asked DEC to require a new application with project-appropriate review (https://tompkinscountyny.iqm2.com/Citizens/Detail_LegiFile.aspx?ID=13804&MeetingID=4213 , row 5d) (verified 2026-10-03).
- The model’s water block already says lake-water savings are not claimed, and it prints **0 gal/yr** plus **970 MWh/yr** of fan electricity (`site2.json` `impact.water`). 970 MWh = 48,514.5 × 0.02. The 0.02 kWh fan per kWh heat is an assumption in `config/impact.yaml`, not a TeraWulf measurement (`docs/audit/numbers-impact.md`). ASSUMPTION: 970 MWh × 0.1101 kg/kWh is about 107 t CO2e, which is noise next to 11,408 t. Winter is when heat demand is highest and when a lake-cooling plant would already withdraw less. July is when reuse is smallest. Heat reuse is the wrong tool for a summer cooling-water peak, and this design’s summer heat sink is air.
- The weak sentence still in the JSON note is that a covenant “keeps the 1.008 MGD permit unused for cooling.” The renewal is already limited to those three uses. Heat reuse does not retire it. The covenant’s job is to stop a **later modification** that would turn the withdrawal into cooling makeup.
- HDR’s deck puts “Closed-Loop Zero Evaporation” and “Data Center Heat Export” on the zero-water end of the cooling spectrum, and lists “Off-site Power Plant Indirect Water Use” as its own row (`resources/text/NYU_BAC_Hackathon_HDR_Waste_Heat_Reuse_2026.1002.txt`, p. 55) (verified 2026-10-03). Keep dry coolers, heat export, and power-plant water as three lines.
- Organizer deck, p. 53: traditional evaporative cooling “0.4–0.6 Gallons/kWh” and, in the same extract, “0.4–0.6 L/kWh for standard commercial,” sourced to https://www.watercalculator.org/footprint/data-centers-water-use/ ; and “2 Gallons/kWh” as average US power-generation consumptive use, withdrawal about 12 gal/kWh (`resources/text/NYU_BAC_Hackathon_HDR_Waste_Heat_Reuse_2026.1002.txt`) (verified 2026-10-03). The gallons-versus-litres clash is in the extract. Those figures are industry or US averages. They are not a Lake Hawkeye inventory. Applying 2 gal/kWh to 1,051,200 MWh would invent a site water total. Do not.
- Pack water risk at this place is low–medium for stress, drought, and groundwater decline (pp. 15–17) (verified 2026-10-03). Grundfos’s paper is a national scarcity argument (about 60% of US land and half the population in medium-to-high stress; data centers “rely on water to stay cool”). A scarcity story for Lansing contradicts the pack. The Grundfos sentence that fits is the one they already wrote: data-center cooling and power-plant cooling are both water, and they are not the same withdrawal.
- Direct discharge to water is in the 44th percentile, and runoff from the site reaches Cayuga Lake (pack p. 18). The lake and an inlet are impaired for phosphorus (p. 19). FEMA flood maps “drop off” (p. 20). Precipitation is shown as a 3-inch increase within 10 years (p. 21) (verified 2026-10-03). No project stormwater volume is in the model. `[unverified]` cubic feet.
- **0 gal does not cover new water uses the heat enables.** RII’s Dutch greenhouse example reports recycled irrigation at **4 L/kg of tomato** (`resources/text/Colocating-Data-Centers_Greenhouses-RII-Virginia.txt`) (verified 2026-10-03). That is not a Lake Hawkeye measurement. ASSUMPTION: 4,000 t of produce (itself an assumed 40 kg/m²; see §6) at 4 L/kg is 16 million litres, about **4.2 million gallons/year**. Aquaculture makeup is `[unverified]`. The cooling claim stays 0 gal. The food claim needs its own water line.

**Fix (say this).** “Lake-water savings claimed: zero gallons. TeraWulf’s dry coolers are a developer claim, and they are the water design. The April 2026 permit already limits 1,008,000 gallons a day to maintenance, sump pumping, and dust control. The covenant locks that limit so a modification cannot turn it into cooling makeup. Greenhouse irrigation and fish-system makeup are separate and not yet metered. Stormwater under a wetter decade is undesigned. Fan electricity avoided is 970 megawatt-hours a year at an assumed 2% fan factor.”

## 4. Embodied carbon of pipes and the town-center main

**Severity: High** for building the town main. **Medium** for the corridor, because the kilograms are `[unverified]`. **Low** for the 0.5 km on-site loop.

**Claim at risk.** “The network is a climate asset,” including a 14 km town-center main, with no materials balance. HDR p. 5 asks the project to sequester more carbon in materials than the rest of the materials emit (verified 2026-10-03). Pack p. 25 is an image in the text extract. Any tonne figure read off that chart is `[unverified]`.

**Evidence.** No embodied-carbon factor (kg CO2e per metre of HDPE or pre-insulated steel, or per cubic metre of tank steel) is in `site2.json`, `config/`, or verification.md. A lifecycle total would be invented. What the model does show:

| Ring | Pipe | Heat | What the model says |
|---|---|---|---|
| On-site | 0.5 km | 37,076 MWh/yr at 45 °C | LCOH $40.6/MWh. Direct heat exchange. |
| Corridor | 20.9 km | 13,500 MWh/yr at 20 °C | LCOH $285.8/MWh. Linear heat density **0.65 MWh per metre per year**. |
| Town center | 14.0 km at 65 °C | 3,577 MWh/yr | LCOH **$734.2/MWh**. `passes_gate`: false. Pipe loss **1,840 MWh/yr**. Pipe is **82%** of that ring’s capex (`extras.with_town.town_pipe_share_of_ring_capex`). |

Sources: `site2.json` `rings` and `extras.with_town`. Propane-equivalent reference in the same file is **$136.1/MWh**. The town main is several times the incumbent on operating economics and still loses 1,840 MWh/yr in the trench. CBS’s organizer paper treats connections beyond about 2 km as a poor cost share (`site2.json` `extras.cbs_checks`: “>2 km rated poor”; town ring is 14 km). That is a cost finding used here only as a reason the embodied carbon would be spent on a pipe the gate already rejects.

The hot-water tank is **5,558 m³** (`site2.json` `totals.storage_m3`). Its steel is in the same uncounted materials bucket.

Corridor density of 0.65 MWh/m/yr means a lot of plastic per unit of heat. Without a sourced factor, the payback in years is `[unverified]`. The honest status is: materials test failed, town main rejected, corridor materials open.

**Fix (say this).** “We do not build the 14 km town main. It fails the cost gate, the pipe is most of that ring’s capital, and it loses 1,840 megawatt-hours a year before anyone counts the steel. On-site pipe is 0.5 km. The 20.9 km corridor is uninsulated HDPE, and we have no embodied-carbon number for it. HDR’s materials test is unmet.”

## 5. Rebound: heat reuse as a permit for more load

**Severity: High** for social-license rebound and for the induced-load carbon credit. **Medium** for the build-out math. **Low** for classic efficiency rebound, whose size is `[unverified]`.

**Claim at risk.** The Thermal Commons co-op is the condition under which Lansing could accept the data center (PLAN.md; town action below). If the heat contract is what lets the megawatts exist, the carbon books have to show the data center, not only the offset. A second rebound sits inside the 11,408 t: new greenhouses and fish tanks are credited as if they would have burned propane anyway.

**Evidence.**

1. **Social license.** On 2026-09-29 the Lansing Town Board directed its attorney to draft a local law banning data centers; 36 of 38 speakers opposed; a $500k legal reserve is reported (https://ithacavoice.org/2026/09/lansing-board-data-center-ban/ ; https://www.fingerlakes1.com/2026/10/02/lansing-moves-toward-data-center-ban-as-terawulf-debate-reaches-turning-point/ ; https://607newsnow.com/news/258852-town-of-lansing-moving-forward-with-drafting-a-data-center-ban/) (verified 2026-10-03, as recorded in PLAN.md and the task reality check). ASSUMPTION from §1: phase-1 IT electricity is about 115,800 t CO2e/yr on the NYUP average factor, against 11,408 t avoided. If the town would have stopped the project, the heat contract’s net is on the order of **+100,000 t/yr** before facility overhead and before any renewable contract. A renewable contract would change that sign. None is in the repo. `[unverified]`.
2. **Induced on-site load.** `config/impact.yaml` sets `mix_onsite` to 100% propane, marked as an assumption (no gas at the plant). The audit left that credit in place: **9,287 t** of the old 11,943 t gross, and the mix fix does not remove it (`docs/audit/numbers-impact.md`). The on-site ring is a greenhouse, aquaculture, and a rec pool (`site2.json` `rings.onsite`) — new loads, 37,076 MWh/yr. If they are built only because heat is cheap, the counterfactual is no greenhouse, and that slice of “avoided” CO2 is activity the project created. The corridor homes are the real displacement: existing propane and oil under a gas moratorium that NYSEG invoked in the Town of Lansing in **2015** (https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BE068C615-B8EE-4CB9-AF92-3153A49BE4E4%7D , PSC Case 20-G-0131, verification.md row 6a) (verified 2026-10-03). Status of the moratorium in 2026 is unverified past the 14 July 2025 gas-plan update (row 6c-update).
3. **Build-out.** The published 320 MW case keeps delivered heat at 50.6 GWh and cuts the share of available heat to **3.0%** (`site2.json` `extras.scenarios.dc_320MW_full_build.share_of_available_pct`). ASSUMPTION: if the ERF numerator stays 48,514.5 MWh and IT scales with 320/150, ERF falls from 0.0462 to about **0.022**. That ratio is not a field in the JSON. Printing 4.6% next to a 400 MW story is the rebound a judge will do in their head.
4. **Metric conflict.** Heat recovery can worsen PUE while improving ERF (DATA_HEAT footnote 26, cited in §2) (verified 2026-10-03). Chasing a prettier PUE by refusing a heat tap is its own rebound. The covenant should require ERF reporting from a meter, and should leave cooling in TeraWulf’s control so the heat tap cannot be blamed for a hot server hall.
5. **Classic rebound.** A tariff at 0.8× propane ($108.87/MWh in `site2.json` `extras.tariff_scenarios`) can expand heated floor area or greenhouse hectares. No elasticity is in the model. Magnitude `[unverified]`.

**Fix (say this).** “The carbon line is a displacement credit, and it sits beside the data center’s grid load, which we do not have a power contract for. About four-fifths of the gross credit treats a new greenhouse and fish system as propane that would have been burned anyway. We will label that slice as conditional. The homes are the solid part: they already burn propane and oil because gas service has been frozen since 2015. ERF of 4.6% is the 150 MW IT case. At the 320 MW filing it gets worse unless new customers are signed. The heat contract caps offtake at signed loads.”

Executive Order 62 (14 July 2026) pauses certain DEC permits for new or expanded data centers at or above 50 MW until a final generic environmental impact statement (https://www.governor.ny.gov/executive-order/no-62-establishing-temporary-moratorium-data-centers-new-york-while-state-develops , verification.md row 2a) (verified 2026-10-03). Whether it covers Lake Hawkeye is unverifiable (row 2b). Do not claim the order already stops the project, and do not claim heat reuse satisfies it.

## 6. Ecology, biodiversity, nutrients, and the coal-plant shoreline

**Severity: Medium**, rising to **High** if any fish-system or fertilizer flow can reach the lake.

**Claim at risk.** The scorecard pairs “5,500 t/yr fish + produce” with nutrients, and “10 ha greenhouse on former coal site” with biodiversity (`site2.json` `hdr_scorecard`). Tonnes of food are not tonnes of phosphorus kept out of the lake. A greenhouse is the land use the pack names as the main biodiversity threat.

**Evidence.**

- Pack: cumulative biodiversity threat “not much”; **agriculture is the greatest threat** (pp. 11–12) (verified 2026-10-03). Noise at the site is 41.9 dB against 40.6 dB at Taughannock Falls State Park (p. 13; baseline named p. 10) (verified 2026-10-03). A measured project delta is `[unverified]`. Dry coolers still run in summer, when reuse is smallest, so heat reuse is a weak noise strategy.
- Lease is **183 acres**, 80 years, lessee Lake Hawkeye LLC (https://www.sec.gov/Archives/edgar/data/1083301/000110465925078086/tm2523008d1_8k.htm , verification.md row 3c) (verified 2026-10-03). A 434-acre site and “~250 other acres” are unverifiable (row 3d). 10 ha is 24.7 acres, so it fits inside 183 acres as a geometry. Whether the soils can take a greenhouse is `[unverified]`. Pack p. 5 includes “avoid soil contamination.” No soil result is in the model.
- Food tonnes are an identity, not a measurement: 10 ha × 40 kg/m² = 4,000 t produce, plus 1,500 t fish = 5,500 (`docs/audit/numbers-impact.md`). The 40 kg/m² yield is marked an assumption in `config/engineering.yaml`. RII does not give that yield. Fish tonnes are an assumption. Both `[unverified]`.
- Phosphorus: the pack says the lake is impaired for phosphorus (p. 19) (verified 2026-10-03). Kilograms of phosphorus or nitrogen the project keeps out of the lake are `[unverified]`. A closed aquaponic loop is a design intent. It becomes a High failure if process water reaches the lake or a ditch that reaches it. DEC’s TMDL recommendation is a watershed fact in the proposal docs; this memo does not treat the greenhouse as a TMDL credit. No DEC letter says so. `[unverified]` as a credit.
- Coal-unit retirement in 2019 is a secondary source only (Global Energy Monitor, verification.md row 9f-ii). Do not hang a “we replaced coal” carbon story on that date. The grid carbon is the NYUP factor in §1. Energy-community tax status for tract 36109002300 is unverifiable against the Treasury list (row 9f-ii).

**Fix (say this).** “Biodiversity: we reuse the leased industrial shore, and we add agriculture, which this pack calls the main threat, so the greenhouse stays inside the 183-acre lease and does not take new field. Nutrients: closed loop, no process discharge to Cayuga Lake. We do not have a phosphorus mass, and 5,500 tonnes of food is an assumption, not a nutrient credit. Noise stays a measurement we have not made; the baseline in the pack is 41.9 decibels.”

## 7. Air, health, and what heat reuse does not clean up

**Severity: Low** for local air, if the claim stays small. **Medium** if “500 homes” is read as 500 combustion sources removed.

**Claim at risk.** The air petal says “fewer combustion appliances in homes” and prints **500 homes** (`site2.json` `hdr_scorecard`). The pack’s air slides are already “Good”: 0% of days worse than Good on both the 10-year and 5-year windows (pp. 28–29) (verified 2026-10-03). Ozone is in the 20th percentile and PM2.5 in the 4th (pp. 31–32) (verified 2026-10-03). A statewide line of over 1,900 deaths and $5.6 billion (p. 30) is not a site total.

**Evidence.**

- Corridor mix after the Census renormalization is about 42% propane, 13% oil, 39% electric, 6% other (`config/impact.yaml` `mix_corridor`). Electric homes do not get a combustion-air benefit. “500 homes” over-counts the air effect. A combustion count would be roughly the propane-plus-oil share. An exact count of appliances is `[unverified]` because the model uses household shares, not an appliance inventory.
- Backup is **373 MWh/yr**, 0.73% of annual heat (`site2.json` `totals`). Unmet hours are 0 because backup boilers are sized to 100% of peak (same file, `unmet_note`). That is a small new combustion source at the plant fence, in a place whose air is already Good. Disclose it. It is not the health story.
- The health story that matches the pack is indoor and neighborhood combustion displaced in propane and oil houses, plus the moratorium (2015, row 6a). Mental-health and disease percentiles in the pack (mental health 27th, p. 14) are context. They are not outcomes this project measured.
- Deep Green’s 24 MW project with Board of Water & Light is **Lansing, Michigan**. Announced 5 November 2025, withdrawn 6 April 2026 (https://www.lbwl.com/community/newsroom/2025-11-05-deep-green-proposes-120-million-sustainable-data-center-investment ; https://www.wkar.org/michigans-data-center-divide/2026-04-06/proposed-data-center-wont-move-forward-in-lansing-as-deep-green-withdraws , verification.md row 12) (verified 2026-10-03). It is a withdrawn precedent. It is not this site, and it is not operating proof that heat reuse cleans a lake.

**Fix (say this).** “Local air is already Good. The air benefit is fewer propane and oil burners in the houses we actually connect, plus 373 megawatt-hours a year of backup combustion we add at the plant. We will not say 500 homes.”

## 8. What survives the skeptic (do not overcorrect)

These points are strong if they stay narrow.

1. **The carbon method is the right shape.** Displaced fuel minus heat-pump electricity, on eGRID2023 NYUP 242.8 lb CO2e/MWh (row 10a) (verified 2026-10-03), with liquid propane at 62.87 kg CO2/MMBtu (row 10d) (verified 2026-10-03). Publish **11,408 t/yr**, **2,659** vehicles, ERF **0.0462**, and fossil fuel displaced **52,016 MWh/yr** (`site2.json` `impact`, aligned with `docs/audit/numbers-impact.md`). Lead with the average-grid tonne. Park 10,670 t as a sensitivity with the factor marked unverified.
2. **The water sentence can be zero and still be the honest one.** Developer dry coolers, permit already limited, covenant against a later cooling modification, 0 gal claimed. Grundfos hears a real water action: lock the withdrawal, and design the fish and fertilizer loops so they cannot reach a phosphorus-impaired lake.
3. **On-site 0.5 km at 45 °C is the ecology-and-carbon layout that survives.** Users come to the heat. The town main fails. Say the failure out loud; it is evidence the team ran the test.
4. **The comparison with 111 8th Ave is a credibility asset.** Site 1 has the higher carbon intensity of displacement and the higher ERF (0.1343 in `site1.json`). Lansing wins on cost against propane and on the chance to write heat reuse into an approval. Judges who think the team hid a carbon loss will trust the team who shows it.
5. **Binding covenant, three environmental clauses:** (a) metered heat and a published annual ERF, with cooling remaining TeraWulf’s so the tap cannot compromise the hall; (b) the 1,008,000 gpd withdrawal stays limited to maintenance, sump pumping, and dust control; (c) no process discharge from greenhouse or aquaculture to Cayuga Lake or to a ditch that reaches it. Post-occupancy measurement is an HDR service line on pack p. 6 (verified 2026-10-03). Those three numbers — megawatt-hours delivered, ERF, and a yes/no on process discharge — are the monitoring the skeptic will accept.

## Lane status

**Done**

- Greenwashing test against HDR p. 5 (eliminate greenhouse gases; materials sequestration) and against the model’s own ERF, share of heat, and 11,408 t.
- Grid ledger: NYUP factor, fuel factors, Site 1 per-megawatt-hour comparison, marginal factor left unverified, PUE/ERF conflict from the organizer guide.
- Water: developer cooling claim, DEC permit uses and dates, county objection pointed at a different application, 0 gal claim, fan-factor assumption, Grundfos scarcity versus the pack’s low–medium stress, irrigation not included in 0 gal.
- Pipes: town main rejected on the model’s own gate, loss, and pipe share of capex; embodied kilograms marked missing.
- Rebound: social-license sign flip, induced propane credit on new on-site loads, ERF dilution at 320 MW, cheap-heat expansion left unquantified.
- Ecology, nutrients, air: pack pages cited; food tonnes and phosphorus mass not treated as measurements.

**Missing**

- A sourced embodied-carbon factor for HDPE, pre-insulated steel, and tank steel, and therefore any payback year for the 20.9 km corridor.
- A site stormwater volume, a soil-contamination result, a species list, a measured decibel delta, and a diesel-generator inventory.
- TeraWulf’s power contract, so the ~115,800 t IT figure remains an average-grid illustration, not the project’s purchased electricity.
- A NYISO Zone C or eGRID2023 non-baseload factor. The 0.315 kg/kWh case stays `[unverified]`.
- Glycol chemistry and a spill volume. Verification row 4a leaves the fluid as “food-grade, non-toxic,” not propylene.
- Makeup, domestic, greenhouse-irrigation, and aquaculture-makeup water for this design. The 4.2 million gallon illustration is an assumption on top of RII’s Dutch 4 L/kg and the model’s assumed yield.
- An energy-weighted fuel split, and the share of Census “electricity” homes that already have heat pumps.
- Confirmation that Executive Order 62 applies to this application (row 2b).
- 2026 status of the NYSEG Lansing gas moratorium past the 14 July 2025 plan update.

**Open questions**

- If the town would have banned the data center, do the judges want the carbon slide to show +115,800 t of IT electricity beside −11,408 t of heat displacement, or only the displacement?
- Will the team label the on-site 9,287 t propane credit as conditional on those businesses existing anyway, and quote a homes-only figure once someone splits heat-pump electricity by ring?
- Is the covenant allowed to forbid a future modification of permit 7-5032-00019/00024, given the holder is Cayuga Operating Company LLC rather than the co-op?
- Should the 10 ha greenhouse be sized down until a phosphorus and irrigation balance exists, or is “no discharge” enough for this round?

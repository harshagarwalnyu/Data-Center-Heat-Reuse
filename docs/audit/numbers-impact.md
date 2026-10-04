# Audit: Site 2 impact numbers (`web/public/data/site2.json`)

Lane C44. Scope: CO2 t/yr, cars equivalent, ERF, jobs, food, water note.
Compared with EPA combustion factors (propane 5.72 kg/gal, oil 10.21 kg/gal), eGRID NYUP, and `research/digest-organizer.md` (RII jobs).
Organizer text in `resources/text/` outranks web sources. `research/verification.md` overrides older files. A fresh in-memory run of the current model (2026-10-04, no files written) reproduces the JSON before rounding.

Audit status: **applied in v3.1** (mix renormalised, backup credit, 4.29 t/vehicle, %d truncation).

Status: **OK** = published figure matches the cited source and the model’s own inputs, within rounding. **WRONG** = it contradicts a verified source, its own cited mix, or a complete counterfactual. **GAP** = cannot verify.

## Verdicts

| Item | Published | Verdict | Put this in the JSON instead |
|---|---:|---|---|
| `impact.co2_avoided_t_yr` | 11,456 | **WRONG** | **11,408** t CO2/yr |
| `impact.co2_cars_equiv` | 2,490 | **WRONG** | **2,659** gasoline passenger vehicles / year |
| `impact.fossil_displaced_MWh` | 52,842 | **WRONG** | **52,016** MWh fuel / yr |
| `extras.co2_avoided_marginal_grid_t_yr` | 10,718 | **GAP** (arithmetic OK; factor unverified) | **10,670** if the 0.315 kg/kWh assumption is kept; label it [unverified] |
| `impact.erf` | 0.0462 (4.6%) | **OK** | keep 0.0462 |
| `impact.ere` | 1.154 | **OK** (formula); PUE 1.2 is an assumption | keep 1.154 and say PUE is assumed |
| `impact.jobs` | 126 | **WRONG** as an unqualified job count | **69** greenhouse positions from RII (about **8 FTE**); aquaculture 37.5, rec 12, network 8 are assumptions |
| `impact.local_food_t_yr` | 5,500 | **WRONG** as a sourced food total | keep the split only if labeled: **4,000 t produce (assumption)** + **1,500 t fish (assumption)** |
| `impact.water` | note + 970 MWh fans; scorecard “0 gal/yr” | **OK** on the no-lake-water claim | rewrite one sentence (below). 970 MWh is an assumed 2% fan factor |
| Scorecard / stakeholder strings | 11,455 t; 10,717 t; 52,841 MWh | **WRONG** | they truncate the model floats; use the rounded fields |

The emission factors themselves are in the model correctly. The 11,456 t figure is `round(11,455.81)`. It is the wrong total because the corridor fuel mix does not match the Census shares the config cites, and backup hours are charged as new emissions with no credit for the fuel those hours would have burned anyway.

## Site 2 impact block (as published)

From `web/public/data/site2.json` `impact` (file `meta.generated` = 2026-10-04). Phases 1–2 only; the town ring is excluded.

- `co2_avoided_t_yr` 11456.0
- `co2_cars_equiv` 2490.0
- `fossil_displaced_MWh` 52842.0
- `erf` 0.0462
- `ere` 1.154
- `jobs` 126.0
- `local_food_t_yr` 5500.0
- `fish_t_yr` 1500
- `greenhouse_ha` 10
- `homes_served` 500
- `water.note`: closed-loop dry cooling is TeraWulf’s design; heat reuse does not save lake water 1:1; covenant can keep the 1.008 MGD permit unused for cooling; no lake-water savings claimed
- `water.fan_energy_saved_MWh` 970.0
- Climate string: “11455 t/yr (10717 with marginal grid)”
- Carbon petal: “11455 t CO2/yr avoided”
- Health petal: “52841 MWh/yr fossil fuel displaced”
- Air petal: “500 homes”
- Nutrients petal: “5500 t/yr fish + produce”
- Town metric: “126 jobs, 5500 t/yr food”

Unrounded model (same code that writes this JSON): CO2 11,455.81 t; marginal 10,717.75 t; cars 2,490.39; fossil 52,841.94 MWh; ERF 0.0461515; ERE 1.15385; jobs 126.15 (greenhouse 68.65); food 5,500.00; fan 970.29 MWh.

## CO2 t/yr

**WRONG. Publish 11,408 t CO2/yr, not 11,456.**

### Factors — OK

Liquid propane and distillate oil in the model match `research/verification.md` rows 10d and 10e (verified 2026-10-03), not the stale propane row in `research/facts-site2.md` section 7.

| Fuel | EPA factor | Model `config/impact.yaml` | Check |
|---|---|---|---|
| Propane | 62.87 kg CO2/MMBtu; HHV 0.091 MMBtu/gal; **5.72 kg CO2/gal** | 0.2145 kg/kWh fuel | 5.72 / (0.091 × 293.071 kWh/MMBtu) = **0.2145**. OK |
| Distillate oil | 73.96 kg CO2/MMBtu; HHV 0.138 MMBtu/gal; **10.21 kg CO2/gal** | 0.2520 kg/kWh fuel | 10.21 / (0.138 × 293.071) = **0.2524**. Model is 0.16% low. On the corrected oil term that is under 1 t. OK for a rounded total |
| eGRID NYUP | **242.8 lb CO2e/MWh** total output (eGRID2023 Rev 2) | 0.1101 kg/kWh | 242.8 × 0.45359237 / 1000 = **0.11013**. OK |

Sources: EPA GHG Emission Factors Hub 2025 and 40 CFR 98 Table C-1, as read in verification.md 10d/10e (https://www.epa.gov/system/files/documents/2025-01/ghg-emission-factors-hub-2025.pdf ; https://www.govinfo.gov/content/pkg/CFR-2020-title40-vol23/xml/CFR-2020-title40-vol23-part98-subpartC-appC.xml) (verified 2026-10-03). eGRID: verification.md 10a, NYUP CO2 242.1 / CO2e 242.8 lb/MWh (https://www.epa.gov/egrid/summary-data ; https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.pdf) (verified 2026-10-03).

`facts-site2.md` still prints propane as 61.46 kg/MMBtu (5.75 kg/gal). That is gaseous propane, not delivered LP. The model does **not** use it. Using 61.46 would have cut the propane term by about 2%, roughly 230 t. The correction is already in the run. Do not “fix” 0.2145 back to 0.210.

Fuels are CO2. The grid term is CO2e. The gap is the CH4/N2O slice. Verification.md 10d gives propane CH4 3.0 g and N2O 0.60 g per MMBtu, about 0.4% of the CO2 factor. Leaving fuels as CO2 matches the JSON label “t CO2”. No change.

Boiler efficiencies used to turn delivered heat into fuel: propane 0.85, oil 0.82 (`config/finance.yaml`). Those efficiencies are model assumptions, not EPA factors.

### What the 11,456 t is

Net = displaced − added.

Served heat (customer MWh met by data-center heat, backup excluded): on-site 36,801.77; corridor 13,400.56.

Displaced, as coded (on-site 100% propane; corridor 45% propane / 15% oil / 35% electric / 5% ignored):

- On-site propane fuel 43,296 MWh → 9,287 t
- Corridor propane fuel 7,094 MWh → 1,522 t
- Corridor oil fuel 2,451 MWh → 618 t
- Corridor electric heat 4,690 MWh × 0.1101 kg/kWh → 516 t (this treats electric heat as resistance, COP 1)
- Gross displaced 11,943 t

Added:

- Heat-pump electricity served 2,843 MWh + pumping 759 MWh = 3,602 MWh × 0.1101 → 397 t
- Backup fuel 422 MWh propane (gate shortfall 380 MWh / 0.90 efficiency) → 91 t
- Added 487 t

Net 11,943 − 487 = **11,455.81 → published 11,456**. The subtraction shape matches PLAN.md section 4.4 (displaced fuel × factor minus heat-pump electricity × grid factor). Two inputs to that shape are wrong.

### Fix 1 — corridor mix is not the Census mix it cites

`config/impact.yaml` says the corridor mix is Census B25040 non-gas shares (26/8/24/4). Town occupied-unit shares in `research/facts-site2.md` (https://data.census.gov/table/ACSDT5Y2023.B25040) (verified 2026-10-03):

- Utility gas ~38%
- Bottled/LP propane ~26%
- Electricity ~24%
- Fuel oil / kerosene ~8%
- Wood and other ~4%

Non-gas sums to 62%. Renormalized energy shares, dropping gas because the corridor is the moratorium case:

- Propane 26/62 = **0.419**
- Oil 8/62 = **0.129**
- Electric 24/62 = **0.387**
- Other 4/62 = **0.065** (still ignored; that is conservative)

The file uses 0.45 / 0.15 / 0.35 / 0.05. Those weights are not 26/8/24/4. They overweight propane and oil.

Recomputed corridor displacement at the cited shares: propane 1,418 t, oil 531 t, electric 571 t. That is **135 t less** than the coded corridor term. Fossil fuel (boiler input, not heat) becomes 43,296 + 6,611 + 2,109 = **52,016 MWh**, not 52,842.

On-site stays 100% propane. That is an assumption (new greenhouse, aquaculture, and pool load with no gas service), not a Census household share. Leave it.

Household counts are not the same thing as energy shares (oil homes burn more per home than electric homes). No energy-weighted split is in the repo. Until one is sourced, use the renormalized household shares the comment already claims.

### Fix 2 — backup hours are missing their counterfactual

Unserved customer heat is 274 MWh on-site + 99 MWh corridor = 373 MWh (the JSON `backup_MWh`). The code counts backup propane emissions and does **not** count the propane, oil, or electric those same hours would have used in the counterfactual. Backup hours are treated as if the alternative were zero carbon.

Credit for that unserved heat, at the corrected mix and the same boiler efficiencies: **88 t**. Project backup emissions stay in the “added” term, so the net backup effect is only the efficiency and fuel-mix difference, which is what a counterfactual requires.

### Corrected net

11,455.81 − 135.3 (mix) + 87.8 (backup credit) = **11,408 t CO2/yr**.

Marginal-grid sensitivity, same two fixes, still using the assumed 0.315 kg/kWh on heat-pump and pump electricity: **10,670 t/yr**. The 0.315 factor is the midpoint of a 0.28–0.35 range in `facts-site2.md` cited only to https://www.nyiso.com. Verification.md does not confirm it. **[unverified].** Do not replace it with the equivalencies-calculator eGRID2022 NYUP non-baseload rate (920.1 lb CO2/MWh). That table is eGRID2022; verification.md 10a says eGRID2023 is the edition to use, and it does not publish a non-baseload NYUP number here.

Electric heat is still counted as resistance. `facts-site2.md` says the Census “electricity” bin is baseboard plus a growing heat-pump share. The resistance-versus-heat-pump split is **[unverified]**. The 571 t electric credit is an upper bound. Do not invent a split.

### Strings that truncate

`value_by_stakeholder` Climate and the Carbon petal print 11,455 and 10,717. The Health petal prints 52,841. Python `%d` truncates 11,455.81, 10,717.75, and 52,841.94. The `impact` fields use `round` and are 11,456 / 10,718 / 52,842. After the fixes above, point all three strings at **11,408 t**, **10,670 t (marginal, factor unverified)**, and **52,016 MWh**.

## Cars equivalent

**WRONG. Publish 2,659, not 2,490.**

2,490 is only this identity: 11,455.81 t × 1,000 / 4,600 kg = 2,490.39, and `config/impact.yaml` comments “EPA 4.6 t/yr passenger vehicle.” That 4.6 t figure is the rounded tailpipe-CO2 headline on EPA’s Green Vehicle page (about 22.2 mpg, about 11,500 miles/year, 8,887 g CO2/gal). https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle (verified 2026-10-04).

The EPA tool that defines “equivalent to X gasoline-powered passenger vehicles driven for one year” is the Greenhouse Gas Equivalencies Calculator. Its current factor is **4.29 metric tons CO2e per vehicle-year**:

8.89×10⁻³ t CO2/gal × 10,917 miles × 1/22.8 mpg × 1/0.994 = 4.29 t CO2e/vehicle/year.

https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references (verified 2026-10-04). Inputs are FHWA 2022 (22.8 mpg, 10,917 VMT) and a 0.994 CO2-to-CO2e ratio. The calculator’s own eGRID table on that page is still eGRID2022. Use the calculator for the car factor only. Keep eGRID2023 NYUP 242.8 for the inventory (verification.md 10a).

11,408 t / 4.29 t = **2,659 vehicles**.

If the team keeps the Green Vehicle 4.6 t headline on purpose, the corrected CO2 implies **2,480** vehicles, and the caption must cite that page and say tailpipe CO2, not the equivalencies calculator. The published 2,490 matches neither the corrected tonnes nor the calculator.

## ERF

**OK. Keep 0.0462.**

HDR deck, organizer extract `resources/text/NYU_BAC_Hackathon_HDR_Waste_Heat_Reuse_2026.1002.txt` pages 17–18 (and `research/digest-organizer.md` section on HDR metrics):

- ERF = Reuse energy (kWh) / IT energy (kWh)
- ERE = (Total facility energy − Reuse energy) / IT energy
- Worked example: IT 1,000 kWh, facility 1,300 kWh (PUE 1.3), reuse 200 kWh → ERE 1.1

Model:

- IT = 150 MW × 0.8 × 8,760 h = **1,051,200 MWh** (phase 1, 150 MW IT; verification.md 3a, https://www.sec.gov/Archives/edgar/data/1083301/000108330126000162/a_wulfearningsreleaseq22026.htm and https://lakehawkeyedata.com — phase-1 ~150 MW is the website figure; full build is ~320 MW critical IT) (verified 2026-10-03)
- Reuse = DC-side draw actually supplied = 48,514.5 MWh (`demand.py`: `S` is DC-side draw; dispatch `S × f` is the part met by the data center or by tank discharge of data-center heat)
- ERF = 48,514.5 / 1,051,200 = **0.04615 → 0.0462**
- ERE = (1.2 × IT − 48,514.5) / IT = **1.1538 → 1.154**

PUE 1.2 is an assumption in `config/engineering.yaml` (“liquid-cooled new build”). ERF does not use PUE. ERE does. Say so.

4.6% is small because demand is small. Phases 1–2 deliver 50.6 GWh against 778 GWh available (`site2.json` `supply` and `totals`: 6.5% of available heat). That matches the organizer warning in `research/digest-organizer.md`: a greenhouse does not take a 50 MW plant’s heat (“from the 50, we only use 10”), and ERF must be reuse/IT, not a claim that the plant’s heat is used. Do not scale ERF up in the narrative.

Stakeholder line “ERF 4.6%” matches 0.0462. Fan energy 970 MWh = 48,514.5 × 0.02. The 0.02 kWh fan per kWh rejected is an assumption in `config/impact.yaml`, not an EPA or TeraWulf measurement. Keep 970 only with that label.

Full-build IT of 320 MW would cut ERF by about 150/320 if the heat customers stay the same (`extras.scenarios.dc_320MW_full_build` keeps delivered heat at 50.6 GWh). The impact block is the 150 MW case. That is the right base. Do not print 4.6% next to a 400 MW story without saying the denominator is 150 MW IT.

## Jobs

**WRONG as “126 jobs.”**

RII Table 2, `resources/text/Colocating-Data-Centers_Greenhouses-RII-Virginia.txt` PDF page 23, summarized in `research/digest-organizer.md`:

| Facility | FTE | Part-time / seasonal | All jobs |
|---|---:|---:|---:|
| 10 acres (estimated) | 6.5 | 35 | 41.5 |
| 65 acres (estimated) | 13 | 130 | 143 |
| 65 acres (Oasthouse reported) | 43 | — | 271 |

10 ha × 2.471 = **24.71 acres**. The code interpolates linearly between the 10-acre and 65-acre estimate columns:

- FTE = 6.5 + (14.71/55) × (13 − 6.5) = **8.2**
- Part-time = 35 + (14.71/55) × (130 − 35) = **60.4**
- All greenhouse jobs = **68.6 → 69**

That interpolation is a fair reading of Table 2 (jobs per acre fall as the range grows; RII also says a 10-acre house is “40+” jobs, page 22). It is not a table cell. RII’s reported Oasthouse column is much higher (271 vs 143 estimated) and is not what the model uses. Stay with the estimate column. Call them positions, not FTE. About **8 of the 69 are FTE**.

The other 57.5 jobs are not in RII:

- Aquaculture 1,500 t / 40 t per job = **37.5**. The 40 t/job divisor is marked assumption in `config/impact.yaml`. No organizer source. **[unverified]**
- Recreation **12**. Assumption. **[unverified]**
- Network operators **8**. Assumption. **[unverified]**

126.15 = 68.65 + 37.5 + 12 + 8, then rounded to 126. The addition is correct. The label is not. `research/digest-organizer.md` says HDR’s Lake Hawkeye tool already holds **50 FTE** for the data center, and jobs in this proposal should be pitched as incremental greenhouse / food / recreation jobs, not data-center jobs. The JSON does not add those 50. Good. Do not let “126 jobs” be read as data-center employment or as 126 full-time jobs.

**Fix the town metric** to: “69 greenhouse positions (RII Table 2, ~8 FTE); aquaculture, pool, and network staff are separate assumptions (37.5 / 12 / 8), not RII and not data-center jobs.”

## Food

**WRONG as a verified 5,500 t/yr.**

`local_food_t_yr` = greenhouse area × yield + fish:

10 ha × 10,000 m²/ha × 40 kg/m² / 1,000 + 1,500 t = 4,000 + 1,500 = **5,500 exactly**.

The 40 kg/m² yield is an assumption in `config/engineering.yaml` (“high-tech tomato, no supplemental lighting, NY winter”). RII discusses CO2 enrichment lifting yields 18–100% and a water productivity of 4 L/kg of tomato. It does not give 40 kg/m². **[unverified]**

`fish_t_yr` 1,500 is an assumption in the same file. **[unverified]**

**Fix:** stop printing “5500 t/yr food” as a measured or RII result. If the number stays on the slide, label it “4,000 t/yr produce at an assumed 40 kg/m², plus 1,500 t/yr fish, both assumptions.”

The Nutrients petal uses “5500 t/yr fish + produce” as if tonnes of food were tonnes of nutrients kept out of Cayuga Lake. They are not. No phosphorus or nitrogen mass is calculated. For that petal, say closed-loop aquaponics is the design intent and the nutrient mass is **[unverified]**. Do not use 5,500 t as the nutrient metric.

## Water note

**OK on the claim that matters. Rewrite one sentence.**

Published note (abridged): closed-loop dry cooling is TeraWulf’s own design; heat reuse does not save lake water 1:1; reuse shaves fan electricity and winter rejection load; a covenant can keep the 1.008 MGD permit unused for cooling; no lake-water savings are claimed. Scorecard: “0 gal/yr claimed; 970 MWh/yr fan energy saved.”

Checked against verification.md:

- Cooling: developer states a sealed closed-loop system with air-cooled dry coolers and no draw from or discharge to the lake. Glycol is “food-grade, non-toxic,” not specified as propylene. https://lakehawkeyedata.com/closed-loop-cooling (verification.md 4a) (verified 2026-10-03). The note does not say propylene and does not claim consumptive-water savings. That matches the reality check.
- Permit: DEC renewal, holder **Cayuga Operating Company LLC**, up to **1,008,000 gallons per day**, effective 2026-04-13, expires 2031-04-30, ID 7-5032-00019/00024, source Cayuga Lake. Uses in the permit text: **system maintenance, sump pumping, and dust control**. https://dec.ny.gov/sites/default/files/2026-04/cayugaoperatingwwpermit.pdf (verification.md 5a, 5c) (verified 2026-10-03).

“0 gal/yr claimed” is the right number. Do not add a gallons-saved figure.

The weak sentence is “a covenant can keep the 1.008 MGD permit unused for cooling.” The renewal is already limited to maintenance, sump pumping, and dust control. Heat reuse does not retire it, and the permit is not a cooling authorization the project is choosing not to use. Verification.md 5f: county objections targeted a different, pending modification; DEC then renewed the limited-use permit.

**Replacement note:**

> TeraWulf’s stated design is a sealed closed-loop dry-cooler system; that is a developer claim, and heat reuse does not save Cayuga Lake water 1:1. Reuse only cuts fan electricity and the heat those fans would reject. The April 2026 DEC withdrawal (Cayuga Operating Company LLC, 1,008,000 gpd) is already limited to maintenance, sump pumping, and dust control. A covenant should lock that limit so a later modification cannot turn the withdrawal into cooling makeup. Lake-water savings claimed: 0 gal/yr. Fan electricity avoided: 970 MWh/yr at an assumed 0.02 kWh fan per kWh heat reused, not a measured site figure.

## HDR lens map

Site pack, `resources/text/2026_10_01_Hackathon_NYU_-_Suburban_Site_-_Lake_Hawkeye.txt`: “There are also no disadvantaged communities nearby.” Do not hang Community or Health on an equity or disadvantaged-community claim. The affordability hook is the gas moratorium and propane/oil, which is a different point and is not re-audited here.

| Lens | Petal | Published metric | Audit |
|---|---|---|---|
| Community | Community | $735/yr per home | Outside this lane’s arithmetic. Do not cite a DAC. |
| Community | Human health | 52,841 MWh/yr fossil displaced | **WRONG** figure. Use **52,016 MWh/yr** fuel displaced after the Census mix fix. |
| Ecology | Carbon | 11,455 t CO2/yr | **WRONG.** Use **11,408 t CO2/yr**. Grid factor NYUP 242.8 lb CO2e/MWh is the right one. |
| Ecology | Nutrients | 5,500 t/yr fish + produce | **WRONG** metric. Food mass is not nutrient mass. Nutrient capture **[unverified]**. |
| Ecology | Water | 0 gal/yr; 970 MWh fans | **OK** on 0 gal. Fan MWh is an assumption. Use the replacement note. |
| Ecology | Biodiversity | 10 ha greenhouse on the former coal site | Area is a scenario input (10 ha), consistent with RII’s ~1 MWth/ha benchmark as a sizing check, not as proof of a biodiversity outcome. Do not add acreage claims beyond the model. |
| Health | Air | 500 homes | **WRONG** if read as 500 homes leaving combustion. Under the corrected mix, propane + oil is 34/62 of corridor energy, about **275 of the 500** modeled homes. The other modeled homes are electric or “other.” On-site boilers avoided are a separate propane assumption, not 500 more homes. |

## Fix list

1. Corridor mix in the impact calculation: propane 0.419, oil 0.129, electric 0.387, other 0.065 (26/62, 8/62, 24/62, 4/62). Drop the 0.45/0.15/0.35/0.05 weights.
2. Credit counterfactual emissions on backup hours (same mix and boiler efficiencies). Leave backup fuel in the project-emissions term.
3. Set `co2_avoided_t_yr` to **11408**, `fossil_displaced_MWh` to **52016**, `co2_cars_equiv` to **2659** using 4.29 t CO2e/vehicle-year. Cite https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references . If 4.6 t is kept, set cars to **2480** and cite the Green Vehicle page instead.
4. Set the marginal sensitivity to **10670** and mark 0.315 kg/kWh [unverified], or drop the marginal number from the slide.
5. Replace truncated strings (11455, 10717, 52841) with the corrected rounded values. Do not use `%d` on the raw floats.
6. Jobs: publish **69** RII greenhouse positions (~8 FTE). Keep 37.5 / 12 / 8 only as labeled assumptions. Do not say “126 jobs” alone.
7. Food: publish **4,000 t produce (assumed 40 kg/m²)** + **1,500 t fish (assumed)**, not “5500 t/yr” as a fact. Remove 5,500 t from the Nutrients petal.
8. Replace the water note with the paragraph in the Water section. Keep **0 gal/yr**.
9. Do not change ERF **0.0462**, ERE **1.154**, propane **0.2145 kg/kWh**, oil **0.252 kg/kWh** (or 0.2524 if a one-line cleanup is cheap), or NYUP **0.1101 kg/kWh**.

## Lane status

### Done

- Read `site2.json` impact, stakeholder, and scorecard figures and reproduced them from the current model (11,455.81 t, 2,490.39 cars, ERF 0.04615, 126.15 jobs, 5,500 t food, 970.29 MWh fans).
- Checked propane 5.72 kg/gal and oil 10.21 kg/gal against verification.md 10d/10e and the model’s kg/kWh factors. Both are in the model. The stale 61.46 kg/MMBtu figure is not.
- Checked eGRID NYUP 242.8 lb CO2e/MWh → 0.1101 kg/kWh. Match.
- Checked ERF and ERE against the HDR deck definitions (reuse/IT and (facility − reuse)/IT). Match.
- Checked greenhouse jobs against RII Table 2. The 69-job interpolation is real; the jump to 126 is not RII.
- Checked food 5,500 t = 4,000 + 1,500. Arithmetic holds; both inputs are assumptions.
- Checked the water note against the DEC 1.008 MGD permit and the dry-cooling developer claim. The 0 gal/yr claim is right.
- Checked the EPA car factor. 4.6 t is a different EPA page than the equivalencies calculator’s 4.29 t CO2e.

### Missing

- No edit to `web/public/data/site2.json`, `config/impact.yaml`, or `src/heatreuse/`. This lane only writes this file. The fixes above are for the model lane.
- eGRID2023 NYUP non-baseload rate is not in `research/verification.md`. Marginal 0.315 kg/kWh stays [unverified].
- Census “electricity” share that is already a heat pump versus resistance: not in the repo.
- A sourced tomato yield (kg/m²) and a sourced aquaculture jobs-per-tonne: not in organizer text or verification.md.
- A sourced dry-cooler fan kWh per kWh rejected: the 0.02 factor is an assumption.
- Energy-weighted (not household-weighted) fuel shares for Lansing: not in the repo. The fix uses household shares renormalized, which is what the config comment already claims.

### Open questions

- Should the slide keep the Green Vehicle “about 4.6 t CO2” headline (then 2,480 cars on the corrected tonnes) or switch to the equivalencies calculator (2,659)? This audit uses the calculator, because that is the EPA definition of passenger-vehicle equivalents.
- Should aquaculture, recreation, and network jobs stay on the slide as clearly marked assumptions, or should the only jobs number be the RII greenhouse figure (69 positions, ~8 FTE)?
- Should the marginal-grid case stay once a real NYISO Zone C or eGRID2023 non-baseload factor is sourced, or should the carbon slide show only the 11,408 t average-grid result?

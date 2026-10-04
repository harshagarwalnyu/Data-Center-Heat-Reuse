# Re-verification report (Task C)

Date: 2026-10-04. Recompute script: `docs/reverify_check.py` (reads config/*.yaml and outputs/*.json, 60+ checks, nothing over 1% off). Web checks done 2026-10-04.

## Bottom line

- Every headline number matches the model JSON and the arithmetic behind it. No number is off by more than 1%. The one 0.4% gap (777.6 GWh in the JSON vs 780.5 from the simple product 150 x 0.8 x 0.75 x 0.99 x 8760) is the hourly model (diurnal swing, seeded outage mask), not an error.
- Three text errors need fixing before judging: the web "Honest limits" line claims one 30-year life for all equipment (the model uses 30/30/20), the judge drill says 48 tests (there are 50 Python tests), and one script row pairs the annuitized $2.096M/yr with 1.73% (1.73% is the PV gap over build cost; $2.096M/yr is 0.14% of $1,500M).
- Sources: most are VERIFIED. Weak points are the propane base price ($3.10 is our pick inside a verified $2.74-3.46 range), the Turner & Townsend "6.6-13.3" band (13.3 confirmed, 6.6 not found in the 2025 index), the Census B25040 shares and the MIT OCW $50k/home figure (could not be read).

## Numbers that check out

| Number | Where | How checked |
|---|---|---|
| 777.6 GWh (88.8 MW avg) | site2.supply | Product 780.5 GWh, 0.37% apart (hourly effects); monthly supply sums to 777.6 |
| 50,576 MWh = 37,076 + 13,500; 6.5% | site2.totals, rings | Sum exact; 50,576 / 777,600 = 6.50%; monthly demand sums to 50,577 |
| Propane $136.1/MWh | finance.incumbent | 3.10 / 26.8 / 0.85 x 1000 = 136.08 |
| Tariff $108.9, low-income $88.5 | finance | 0.8 x and 0.65 x 136.08 |
| $735/yr per household (oil $1,266) | finance.household | 27 x (136.08 - 108.87) = 734.9 |
| Oil $155.8, gas $64.2 | finance.incumbent | Same formula from config |
| Capex $38.76M and all 11 lines | finance.capex_musd | Lines sum to 38.77; soft 15% and contingency 20% of 28.71 subtotal; pipe, HP, lateral, tank lines re-multiplied |
| LCOH 89.5 / 106.1 / 124.6 | finance.lcoh | Rebuilt with pipe 30, tank 30, equipment 20 yr and shared lines split by energy share: 89.4 / 106.0 / 124.5. Ring opex implied by ring LCOHs sums to 1.94M |
| Ring LCOH 40.6 / 285.8 / town 734.2 | rings, extras | Ring capex 10.56 / 28.20 reproduced within 0.06%; sum of ring opex = 1.94M |
| Gap $26.01M = 30.32 - 4.3 | extras.funding, cba | 30.32 - 4.30 = 26.02 |
| Annuitized $2.096M/yr | extras.cba | 26.01 x CRF(7%,30) = 2.096 |
| 1.73% of $1,500M | cba | 26.01 / 1500 = 1.734% (this is the PV gap, see Problem 3) |
| 11,408 t CO2, 2,659 cars | impact | 11,408 / 4.29 = 2,659; ring CO2 9,230 + 2,179 = 11,409. Emission factors: 62.87 / 73.96 / 53.06 kg/MMBtu / 293.07 = 0.2145 / 0.2524 / 0.1810; 242.8 lb/MWh = 0.1101 kg/kWh |
| COP avg 4.71, clip 2-6 | totals | Formula re-derived (0.5 x Carnot, 3 K per exchanger); spot COPs 5.1 / 5.9 / 3.6 / 6.0; corridor 13,500 / 4.71 = 2,866 vs hp_elec 2,843 (0.8%). Hourly average itself needs weather, not re-derivable here |
| MC P10/P50/P90 98.1 / 106.8 / 114.7 | analysis_detail | Matches stats; P50 within 0.7% of deterministic 106.1; headline_check block matches site2 on all 6 keys |
| Tornado ranges | finance.tornado | Base inside every low/high pair; IT-MW swing is exactly zero by design (docs say "does not matter", fine) |
| Hydraulics 0.74% | hydraulics.phases_1_2 | 374.59 / 50,576 = 0.0074 |
| Year-10 exit 5.71 / 10.35 / 93.2 | finance.dc_exit | Keys present and quoted correctly everywhere found |
| $150k school fund | judge-drill, term-sheet, Home.tsx, PrintSheet.tsx | Labelled proposal everywhere; 150k / 1,118 = $134; 7% of $2.1M; 0.01% of $1.5B all correct |
| Key names | all three JSON files | `extras.cba.headline_as_pct_of_dc_capex`, `headline_annuitized_7pct_musd_per_yr`, `dc_capex_musd`, `finance.household.savings_vs_propane_usd` etc. exist |

## Problems found (ranked)

1. **web/components/HowItWorks.tsx:82** says "One 30-year life for all equipment; heat pumps and boilers usually last 15 to 20 years." Wrong: `src/heatreuse/finance.py` `life_class` and `config/finance.yaml` line 3 use pipe 30, tank 30, equipment 20 (docs/methodology.md:140 and judge-drill.md:67 say so correctly). Fix: "Pipe and tank 30-year life, equipment 20 years (the model replaces equipment through the shorter-life CRF); real heat-pump and boiler life is 15 to 20 years." Related: `web/lib/model.ts:10,61-64` (explainer LCOH) uses one 30-year CRF; fed the model totals it gives 100.1, not 106.1. Label the explainer as simplified, and docs/frontend-notes.md:29 "30-yr life" should say "explainer only".
2. **docs/judge-drill.md:287** says "48 automated tests". `pytest --collect-only` collects 50 Python tests (plus 42 `it`/`test` cases in web/lib). docs/presentation-script.md:139 already says 50. Fix: "50 Python tests and 42 web tests", or the single figure the script uses.
3. **docs/presentation-script.md:40** (and the same pairing at line 176, docs/term-sheet.md:126-127 as adjacent rows): "annuitized 2.096 million dollars/yr; 1.73%". 1.73% = PV gap 26.01 / 1,500 (JSON key `whole_project_as_pct_of_dc_capex`). The annual payment is 2.096 / 1,500 = 0.14%. Fix: write "gap 26.01M PV = 1.73% of build cost; paid as 2.096M/yr it is 0.14% of build cost a year". docs/judge-drill.md:116-125 and 437 are correct (they divide $26M by $1.5B). Home.tsx:131 and PrintSheet.tsx:78 show the 1.7% as "of the data center's cost", which is a lifetime PV share; acceptable, but do not call it per year.
4. **docs/proposal.md:263** says "17.5% construction contingency"; config is 20% (5.74 = 20% of 28.71). Fix to 20%. Same table lists soft cost and contingency at 20 yr; the model spreads them pro rata over the 30/30/20 mix.
5. **Propane base $3.10/gal** (config/finance.yaml): NYSERDA Central monthly values for 2025-26 are 2.741-3.460 and average 3.02; the latest is 2.849. $3.10 is within range but 2.6% above the mean (it matches statewide $3.12 of 9/21/2026). Impact if 3.02: propane $132.6/MWh, household saving about $716, not $735. Config itself says the NYSERDA dashboard was not re-read. Keep $735 but say "about $720-735" or cite the range.
6. **ERF 0.0462** (src/heatreuse/impact.py:50) divides reuse by IT energy, not total facility energy (PUE 1.2 gives about 0.039). Standard ERF uses total energy. Still far below EnEfG 10%, so the conclusion in docs/evidence.md:61 stands; change the wording or the divisor.
7. **Buffa comparison caveat** (docs/evidence.md:19, judge-drill.md:178): Buffa's SCOP includes pumping energy and in places design values; our 4.71 excludes pumping (1.5% share modelled separately). Add "before pumping".

## Sources

| Source | Claim | Status |
|---|---|---|
| EIA EPM Table 5.6.A | NY industrial 10.81 c/kWh, July 2026 | VERIFIED: row fetched, https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a (column pairing read by summarizer; 10.06 for July 2025) |
| EPA GHG Equivalencies | 4.29 t CO2e per car-yr (22.8 mpg, 10,917 mi) | VERIFIED: https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references |
| eGRID2023 NYUP | 242.8 lb CO2e/MWh | VERIFIED: search result plus team check in research/verification.md row 10a |
| EPA Hub / 40 CFR 98 | 62.87, 73.96, 53.06 kg/MMBtu | PARTLY: arithmetic reproduced to config; values from research/verification.md rows 10c-e, not re-fetched |
| NYSERDA propane Central | 2.74-3.46, base 3.10 | PARTLY: range and 2.849 latest confirmed by search; 3.10 is our pick (Problem 5) |
| Turner & Townsend 2025 | US$6.6-13.3/W, ~$10 midpoint | PARTLY: 13.3 (Silicon Valley) and US mid-tier 9.5-9.9 confirmed at reports.turnerandtownsend.com; 6.6 is a Mumbai figure from the 2024 index per one search, not found in 2025. Max global is 15.2 (Tokyo). $10 midpoint is an assumption either way |
| RII Virginia greenhouse study | 33-42% to heat, 45-55 C, 2 acres/MW, Table 2 jobs 6.5 FTE + 35 P-TE (10 ac), 13 + 130 (65 ac) | VERIFIED: resources/text/Colocating-Data-Centers_Greenhouses-RII-Virginia.txt lines 332-333, 1059, 716-736 |
| OCP heat reuse | extraction costs split DC/host, transformation by host | VERIFIED: resources/text/20230623_Data_Centers_HeatReuse_101_3.2.docx.txt lines 164-165, 180; 27-28 C air return confirmed via research/digest-organizer.md |
| Topic 5 slides | up to 85% recoverable, COP 2-5, COP 2.95 | VERIFIED: resources/text/Topic_5_-_Heat_reuse,_Connecting_DC_to_DE_systems_v5.txt lines 209, 518, 815 |
| Buffa 2019 | SCOP 3-5, 17 of 24 at 4 or above; LHPDD avg 1.5 kW/m, 9 of 16 below 1.2 | VERIFIED: NYSERDA-hosted PDF text, section 3.2.7 and LHPDD paragraph (caveat Problem 7) |
| EnEfG | ERF 10/15/20% from Jul 2026/27/28, 300 kW | VERIFIED: search (White & Case, Cundall) |
| EU EED | Art. 26(6) waste heat above 1 MW; reporting at 500 kW | VERIFIED: search (note reporting is Art. 12 in evidence.md, Art. 26 in some guides; wording unified citing "Art. 12 and 26" is fine) |
| Odense (Meta, Fjernvarme Fyn) | 45 MW, 215,000 MWh, 70-75 C, >12,000 homes | VERIFIED: https://ramboll.com/largest-danish-heat-pump-installation; local DATA_HEAT guide lists the case |
| Kajaani (Loiste) | 30 MW, 12 MW May 2026, 18 MW 2027 | VERIFIED: https://www.caverion.com/newsroom/releases/2026/caverion-to-deliver-a-30-megawatt-heat-pump-plant-in-kajaani-finland--waste-heat-from-data-centers-will-be-utilized-in-the-areas-district-heating-network/ |
| Stockholm precedent | data-center heat to DH | VERIFIED qualitatively: CBS white paper lines 579, 738, DATA_HEAT guide; no numbers claimed |
| EPFL CO2 network | (cited in brief) | NOT FOUND in the repo docs or web text; nothing to check |
| Census ACS B25040 | propane 26 / oil 8 / electric 24 / other 4 / gas 38 | UNVERIFIED: API needs a key, data.census.gov page unreadable; internally consistent (sums to 100) |
| MIT OCW res-env-007 | ~$50k per residence, ~1/3 circulation, ~1/3 in-home | UNVERIFIED: course and lecture 7-3 exist (ocw.mit.edu), PDF text not readable by the fetcher |
| NYSEG Lansing gas moratorium Feb 2015 | invoked Feb 2015 | VERIFIED for 2015 (PSC Case 20-G-0131 order of 5/12/2022 and search); 2026 status UNVERIFIED and correctly labelled so in Compare.tsx:44 and steps.tsx:91 |
| Lansing Town Board 29 Sept 2026 | attorney directed to draft ban | VERIFIED: https://ithacavoice.org/2026/09/lansing-board-data-center-ban/ ; "36 of 38" is single-source (607 News Now) and is hedged in the script |

## What we could not verify

- Census B25040 Lansing heating-fuel shares (needs API key).
- MIT OCW $50k per residence and the one-third splits (PDF not readable here).
- Turner & Townsend lower bound 6.6 in the 2025 index.
- Average COP 4.71 hourly value (needs the TMYx weather file; formula and bounds checked only).
- Whether the NYSEG moratorium is in force on 2026-10-04.
- NYSERDA Central weekly/dashboard propane value for the survey week (dashboard is interactive).
- External claims that rest on prior team verification only (EPA Hub factors, PSL/UTENJA statute rows) were not re-fetched.

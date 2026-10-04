# Judge Q&A — Thermal Commons (Site 2, Lake Hawkeye)

Live judging is a 5-minute presentation plus a demo. HDR and Grundfos engineers will press the machinery. Twenty-nine answers below. Each number is a key in `outputs/site2.json` (generated 2026-10-04) unless the source line names a doc section or a `research/verification.md` row. Claims we could not verify are marked `[unverified]`. Design choices are marked **PROPOSAL** or **ASSUMPTION**.

Team: Thermal Commons (Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev). The community heat co-op is the Thermal Commons co-op. Site 2 is Lake Hawkeye / TeraWulf at the former Cayuga plant, Lansing, New York. Site 1 (111 Eighth Avenue) is the comparison. Deep Green with Board of Water & Light is Lansing, Michigan, and it was withdrawn (verification.md row 12).

## If they only ask five things

1. The corridor loses money on its own: ring LCOH **$285.8/MWh** against propane **$136.1/MWh**. The on-site campus at **$40.6/MWh** is the part that works. Whole-project gap **$26.01 million** PV.
2. The posted tariff **$108.9/MWh** is above the file’s air-source heat pump cost of **$96.9/MWh**. We beat propane and oil. We do not beat a household ASHP on the bill.
3. **50 °C** capture is a covenant assumption. The published plant is rear-door chilled water to dry coolers. `cop_compare` is **4.73** from 30 °C and **6.0** from 50 °C, and 6.0 is the model ceiling.
4. Heat reuse claims **0 gallons** of lake water. Fan energy saved is **970 MWh/yr**. Base case includes **$0** federal ITC.
5. The Town Board directed counsel to draft a ban. It has not voted one. The ask is a recorded heat-supply and community-benefit covenant as a condition of approval.

## Questions

### 1. What COP are you actually running, and is 6.0 a real machine?

Phases 1–2 average COP is **4.71** (`totals.avg_cop`), which is the corridor building heat pump (`rings[corridor].building_hp_cop` 4.71) lifting a **20 °C** loop. `cop_compare` is **4.73** for an air-cooled 30 °C source and **6.0** for a liquid-cooled 50 °C source. The 6.0 is the model clip: the hourly formula is 0.5 × Carnot with a 6 K approach, bounded at 2–6, and the uncapped 50 °C into 60 °C screen is about 10.4 (`docs/proposal/02-heat-source.md`, Temperature and Air vs liquid COP). On-site heat at 45 °C is direct exchange, so that ring has no compressor COP (`rings[onsite].direct_heat_exchange` true). Say “capped at 6,” and point at Topic 5’s typical band of 2–5 and the CBS heat-reuse range of 3–6 in that same section.

**Source:** `outputs/site2.json` `totals.avg_cop`, `cop_compare`, `rings`. Formula: `docs/proposal/02-heat-source.md` § Air vs liquid COP.

### 2. TeraWulf has not published a 50 °C loop. Why is that the base case?

The model capture temperature is **50 °C** (`supply.capture_temp_C`). That is an **ASSUMPTION**: a covenant requiring warm direct-to-chip facility water, inside the organizer 45–65 °C direct-liquid band. The plant as published is chilled water through rear-door exchangers, then a condenser glycol loop to air-cooled dry coolers, and it does not publish a temperature (`docs/cooling-integration.md` §3–4; verification.md row 4a). The conservative screen for that published plant is **30 °C**, which is the air column in `cop_compare` (COP 4.73). If the covenant fails and the plant stays rear-door, on-site 45 °C users need a heat pump and the direct-exchange campus is no longer free of compressors.

**Source:** `supply.capture_temp_C`, `cop_compare`. Plant description: `docs/cooling-integration.md` §§3–4; `research/verification.md` row 4a, https://lakehawkeyedata.com/closed-loop-cooling (verified 2026-10-03).

### 3. Walk the three temperatures. Who can take this heat?

On-site supply is **45 °C** over **0.5 km**, direct exchange, **37,076 MWh/yr** (`rings[onsite]`). The corridor is a **20 °C** ambient loop over **20.9 km** to **500** homes, **13,500 MWh/yr**, and each house heat pump does the lift (`rings[corridor]`). The town center wants **65 °C** over **14.0 km**, central heat pump COP **6.0**, **3,577 MWh/yr**, and `passes_gate` is false (`rings[town]`). Users are supposed to come to the heat. The town main is reported separately and is conditional (`meta.scope`).

**Source:** `outputs/site2.json` `rings`, `meta.scope`.

### 4. What happens to the servers if we take the heat, or if our pump trips?

Cooling stays on TeraWulf’s dry coolers. The co-op plate is a sidestream. The HSA is written so a heat-side fault fails back to those fans, and a heat outage is not a data-center default (`docs/ownership-deal.md` §3, cooling-always-wins; `docs/methodology.md` design rule). Developer pages state N+1 and valved isolation on their own loop (`docs/cooling-integration.md` §3). The model does not simulate valve travel time. What it does simulate is backup heat: **373 MWh/yr**, **0.73%** of annual energy, and **4.7%** of the top **88** winter hours (`totals.backup_MWh`, `backup_share_annual_pct`, `peak_share_backup_pct`, `peak_hours_counted`). Data-center heat covers **95.3%** of that peak slice (`peak_share_dc_pct`).

**Source:** `totals.peak_share_*`, `totals.backup_*`. Contract rule: `docs/ownership-deal.md` §3 (**PROPOSAL**). Plant redundancy: `docs/cooling-integration.md` §3, https://lakehawkeyedata.com/closed-loop-cooling (verified 2026-10-03).

### 5. You show zero unmet hours. Is the system that reliable?

`totals.unmet_hours` is **0** by construction. The file says so: backup boilers are sized to 100% of peak, so the zero is not a reliability result (`totals.unmet_note`). The resilience numbers are the backup shares above, plus storage of **5,558 m³** (`totals.storage_m3`; the capex line calls that tank “6 h of peak”). A sampled winter hour in `weeks.winter` shows demand near **15–16 MW**, `backup_MW` **0**, and `storage_MWh` **129.28**. We have not audited every hour of that series in this sheet. If the sidestream is offline for a long cold stretch, the boilers carry the peak and the customers still get heat; the carbon and the fuel bill move onto propane.

**Source:** `totals.unmet_hours`, `totals.unmet_note`, `totals.storage_m3`, `finance.capex_musd.lines` (tank), `weeks.winter`.

### 6. What if the data center leaves in year 10?

`finance.dc_exit` is year **10**: stranded capital **$5.71 million**, a replacement source **$10.35 million**, and a corridor cost uplift of **$93.2/MWh**. The fallback written in that object is a Heat Supply Agreement with step-in rights and a decommissioning bond: the loop pipe and the building heat pumps stay, the central source swaps to air-source or borehole plant, boilers cover the gap, and the greenhouse and aquaculture revert to propane-equivalent or electric. **PROPOSAL** term: 10-year initial HSA, 24 months’ notice, obligation runs with the 80-year ground lease (`docs/ownership-deal.md` §3). The dollar size of the letter of credit in that term sheet is still `[unverified]` against the $5.71 million model figure; use the JSON, and say counsel has to match the bond to it. Changing IT load does not fix this: the tornado holds LCOH at **$106.1/MWh** at both **75 MW** and **320 MW** (`finance.tornado`, driver “Data-center IT load”), because demand is the constraint.

**Source:** `finance.dc_exit`, `finance.tornado`. Lease term: `research/verification.md` row 3c, https://www.sec.gov/Archives/edgar/data/1083301/000110465925078086/tm2523008d1_8k.htm (verified 2026-10-03). Term sheet: `docs/ownership-deal.md` §3.

### 7. What glycol is in the pipe, and does our water touch it?

TeraWulf’s closed-loop page describes a sealed loop of “food-grade, non-toxic glycol,” rejected by dry coolers, with no draw from or discharge to Cayuga Lake (verification.md row 4a). That page does not name propylene. The project FAQ, as quoted in `docs/cooling-integration.md` §3, says food-grade non-toxic propylene glycol at **30–35%** by weight. Those two readings disagree; say so, and do not pick one chemistry on stage. **PROPOSAL:** a gasketed plate on the hot condenser pipe, upstream of the fans, so hall water and community water stay on their own sides (`docs/proposal/02-heat-source.md` § Capture point). Freeze point of a 30–35% blend is `[unverified]`. Fluid renewal every 7–15 years is a developer claim (verification.md row 4b), not an independent test. A spill path to a phosphorus-impaired lake is a containment problem, not a heat-reuse benefit.

**Source:** `research/verification.md` rows 4a–4b, https://lakehawkeyedata.com/closed-loop-cooling (verified 2026-10-03). FAQ quote: `docs/cooling-integration.md` §3, https://www.lakehawkeyedata.com/faq (verified 2026-10-03). Interface: `docs/proposal/02-heat-source.md` § Capture point.

### 8. Legionella. Your on-site loop is 45 °C and the houses make hot water from a 20 °C street loop.

We do not have a legionella control model, an ASHRAE 188 program, or a stored domestic-hot-water setpoint in `site2.json`. Say that first. The street pipe we would defend is the corridor at **20 °C** (`rings[corridor].supply_temp_C`), which is an ambient loop, not a hot-water main. Domestic hot water is made in the building. The proposal text puts that building condenser at **45 °C** (`docs/proposal.md` §4.2), which is exactly where a stored hot-water tank needs a sanitary design. Grundfos’s 2018 district-energy guide says hot-water production needs sanitary precautions “to avoid for example legionella,” and that the leaflet does not treat the topic (`resources/text/district-energy-application-guide-district-energy-2018-master-en.txt`, Hot water production). The town loop at **65 °C** could support a hot primary, and that ring fails the cost gate. iGRID’s “reduced risk of legionella” line is a bypass-product claim, not our design (`resources/text/iGRID_Playbook.txt`).

**Source:** `rings[corridor].supply_temp_C`, `rings[onsite].supply_temp_C`, `rings[town].supply_temp_C`. Gap: no legionella key in `site2.json`. Guide: Grundfos district-energy application guide, 2018, hot-water section (organizer text in `resources/text/`).

### 9. Where do the pipe losses go, and why does the town main fail?

Only the town ring carries a loss term: **1,840 MWh** (`rings[town].pipe_loss_MWh`) against **3,577 MWh** delivered, on **14.0 km**, LCOH **$734.2/MWh**, `passes_gate` false. Adding it raises project capex from **$38.76 million** to **$64.34 million** and 7% LCOH from **$106.1** to **$147.3/MWh** (`extras.with_town`). The file’s verdict is that this main is dearer than propane and should be built only with grant funding or a larger anchor. CBS checks in the file rate distance above **2 km** as poor; the town run is **14 km** (`extras.cbs_checks`). The corridor object has **no** `pipe_loss_MWh` key. Do not invent a corridor loss percentage. Its problem is density, next question.

**Source:** `rings[town]`, `extras.with_town`, `extras.cbs_checks`, `finance.lcoh_usd_mwh.utility_7pct`, `finance.capex_musd.total`.

### 10. Why does the corridor lose money?

Corridor LCOH at 7% is **$285.8/MWh** (`rings[corridor].lcoh_usd_mwh_7pct` and `extras.ring_lcoh_usd_mwh.corridor`). Propane is **$136.1/MWh**. Linear heat density is **0.65 MWh per metre** (`rings[corridor].linear_heat_density_MWh_per_m`). The expensive lines are **$9.39 million** of ambient-loop pipe and **$8.0 million** of building heat pumps (`finance.capex_musd.lines`). Stand-alone corridor gap is **$30.32 million** PV. The on-site ring at **$40.6/MWh** throws off a surplus, and the reconciliation is explicit: corridor gap minus that surplus equals the whole-project gap of **$26.01 million** (`extras.cba.reconciliation`). Quote **$26.01 million**. The corridor-only figure applies if the on-site customers are not there.

**Source:** `rings[corridor]`, `extras.ring_lcoh_usd_mwh`, `finance.incumbent_usd_mwh.propane`, `finance.capex_musd.lines`, `extras.cba`.

### 11. An air-source heat pump is about $97/MWh. Your tariff is $108.9. Why connect?

The file prices a stand-alone air-source heat pump at **$96.9/MWh** (`finance.incumbent_usd_mwh.air_source_hp`) with seasonal COP **2.53** (`extras.air_source_hp_seasonal_cop`). The tariff is **$108.9/MWh**, rule “0.8 × propane, fixed” (`finance.tariff_usd_mwh`, `finance.tariff_rule`). A household that can buy and site its own ASHP pays less per megawatt-hour than our posted bill. What the bill does beat is propane at **$136.1** and heating oil at **$155.8**: **$735/yr** and **$1,266/yr** on a **27 MWh** home (`finance.household`). Blended co-op LCOH at 4% is **$89.5/MWh**, which is under the ASHP figure, but that is our cost, not the customer’s price. The co-op also capitalizes the **$8.0 million** of building heat pumps (500 units), so the household is not writing that check. Say the comparison out loud. Do not claim the tariff undercuts an ASHP.

**Source:** `finance.incumbent_usd_mwh`, `extras.air_source_hp_seasonal_cop`, `finance.tariff_usd_mwh`, `finance.tariff_rule`, `finance.lcoh_usd_mwh.coop_4pct`, `finance.household`, `finance.capex_musd.lines`.

### 12. Your 7% LCOH is $106 and the tariff is $109. Why is there still a $26 million hole?

Sticker tariff **$108.9/MWh** sits just above utility LCOH **$106.1/MWh**, and co-op LCOH at 4% is **$89.5**. Private capital at 10% is **$124.6**, which the tariff does not cover (`finance.lcoh_usd_mwh`). The cash that actually arrives is lower than the sticker: at the 0.8 propane case, realised revenue is **$64.62/MWh** and the margin versus 7% LCOH is **−$41.45/MWh**, NPV **−$26.01 million** (`extras.tariff_scenarios`, `multiple_of_ref` 0.8). Annual revenue in the file is **$3.27 million** (`extras.funding.revenue_musd_yr`). The gap is the on-site wholesale price, which the stakeholder card states as **$50/MWh** against propane **$136** (`value_by_stakeholder`, Growers), blended with a 20% low-income tier at **$88.5/MWh** (`finance.low_income_tariff_usd_mwh`). Opex is **$1.94 million/yr**. Electricity in the LCOH is industrial **$108/MWh** for central plant and residential **$245/MWh** for house heat pumps (`finance.elec_price_usd_mwh`).

**Source:** `finance.lcoh_usd_mwh`, `finance.tariff_usd_mwh`, `finance.low_income_tariff_usd_mwh`, `finance.opex_musd_yr`, `finance.elec_price_usd_mwh`, `extras.tariff_scenarios`, `extras.funding`, `value_by_stakeholder`.

### 13. Why isn’t this a 30% or 50% ITC project?

The base case takes **$0** of federal credit. `extras.funding.note` says a waste-heat network ITC is not assumed, and it points at verification.md row 9d-i. Treasury’s final regulations require geothermal heat pump property to use the ground, groundwater, or other underground fluids; Treasury declined to add recovered waste heat (https://www.govinfo.gov/content/pkg/FR-2024-12-12/html/2024-28190.htm, verified 2026-10-03). Section 48(c)(5) waste-energy recovery is electricity from waste heat, not a heat network (row 9d-ii). If some ground-coupled assets did qualify, the file’s upside is LCOH **$85.8/MWh** and a gap of **$13.28 million** instead of **$26.01 million** (`extras.lcoh_incentive_scenario_if_qualifies_usd_mwh`, `extras.funding.funding_gap_incentive_scenario_if_qualifies_musd`). That upside is counsel’s problem. Direct pay under section 6417 covers governments and rural electric cooperatives, not a heat co-op automatically (row 9e). An energy-community adder for this tract is `[unverified]` (row 9f-ii). Do not say 40–50% of the **$38.76 million**.

**Source:** `extras.funding`, `extras.lcoh_incentive_scenario_if_qualifies_usd_mwh`, `finance.capex_musd.total`. Law: `research/verification.md` rows 9d-i, 9d-ii, 9e, 9h.

### 14. Can you form this co-op under New York law?

**PROPOSAL:** a member-owned Thermal Commons co-op, with a concession operator, and a town-chartered utility as the fallback if the co-op cannot be formed (`docs/ownership-deal.md` §2). The statute is not confirmed. Verification row 11a: Public Service Law 66-t lets the PSC exempt small thermal networks that utilities do not own, and it does not itself authorize municipal ownership (https://www.nysenate.gov/legislation/laws/PBS/66-T, verified 2026-10-03). Row 11c: a nonprofit-cooperative carve-out exists in the steam definition when steam is produced solely for members; whether hot water fits is unverified. Row 11d: Town Law 190 lists no heating district. Row 11b: a municipality selling steam to non-municipal customers needs a PSC certificate; hot-water networks are not literally steam. Say we need a co-op and municipal-law opinion before anyone signs, and that the agreements can be assigned to a town entity or to NYSEG under 66-t if that opinion is no.

**Source:** `docs/ownership-deal.md` §2. `research/verification.md` rows 11a–11d (verified 2026-10-03).

### 15. Who signs the CBA, and who actually holds the water permit?

**PROPOSAL**, from the term sheet, not from a signed document. The Heat Supply Agreement parties are Lake Hawkeye LLC, Cayuga Operating Company LLC, and the Thermal Commons co-op (`docs/ownership-deal.md` §3). The landlord is on that page because the withdrawal permit is in the landlord’s name, not TeraWulf’s (verification.md row 5a: Cayuga Operating Company LLC, permit 7-5032-00019/00024, effective 2026-04-13, expires 2031-04-30, https://dec.ny.gov/sites/default/files/2026-04/cayugaoperatingwwpermit.pdf, verified 2026-10-03). The Community Benefit Agreement in that term sheet is between the Town of Lansing and TeraWulf / Lake Hawkeye LLC, with the co-op as third-party beneficiary (`docs/ownership-deal.md` §4). `docs/proposal.md` §8.3 also names Tompkins County and TeraWulf Inc. Use the term-sheet parties on stage, and say the county is not yet a required signatory. The town cannot revoke a DEC permit; the remedy in the term sheet is contract default and step-in.

**Source:** `docs/ownership-deal.md` §§3–4. Permit holder: `research/verification.md` row 5a.

### 16. The Town Board is banning data centers. Why would they take this?

On 29 September 2026 the Town Board directed its attorney to draft a local law prohibiting data centers. It did not vote the ban (verification.md row 1a, https://www.fingerlakes1.com/2026/10/02/lansing-moves-toward-data-center-ban-as-terawulf-debate-reaches-turning-point/ and https://607newsnow.com/news/258852-town-of-lansing-moving-forward-with-drafting-a-data-center-ban/, verified 2026-10-03). Half a million dollars is set aside in next year’s proposed budget for legal costs, not an existing reserve (row 1c, https://ithacavoice.org/2026/09/lansing-board-data-center-ban/, verified 2026-10-03). We do not use a “36 of 38 speakers” count; row 1b says that figure is single-source and other coverage differs. The proposal is the condition that could make a project acceptable: approval only with a recorded Heat Supply Agreement and Community Benefit Agreement. Whether Executive Order 62 covers this site is unverifiable (row 2b). Do not claim the state moratorium already stops Lake Hawkeye.

**Source:** `research/verification.md` rows 1a, 1b, 1c, 2b. Ask: `docs/proposal/01-site-selection.md` § The covenant.

### 17. How many gallons of Cayuga Lake does heat reuse save?

Zero gallons are claimed. `impact.water.note` says closed-loop dry cooling is TeraWulf’s own design, heat reuse does not save lake water 1:1, and no lake-water savings are claimed. The quantified water-adjacent result is **970 MWh/yr** of fan energy (`impact.water.fan_energy_saved_MWh`). The DEC renewal authorizes up to **1,008,000 gallons per day** for system maintenance, sump pumping, and dust control (verification.md rows 5a and 5c). The water covenant is a promise not to turn that permit into cooling water (`docs/ownership-deal.md` §3). It is not a measured saving. HDR water score in the file is “0 gal/yr claimed; 970 MWh/yr fan energy saved” (`hdr_scorecard`, Water).

**Source:** `impact.water`, `hdr_scorecard`. Permit: `research/verification.md` rows 5a, 5c (verified 2026-10-03).

### 18. 11,408 tonnes of CO2 on a clean grid. Which factors, and what if the grid is the marginal plant?

`impact.co2_avoided_t_yr` is **11,408** (model v3.1). The marginal-grid case in the file is **10,670 t/yr** (`extras.co2_avoided_marginal_grid_t_yr`). Cars equivalent is **2,659** at the EPA 4.29 t per car (`impact.co2_cars_equiv`). Fossil fuel displaced is **52,016 MWh** (`impact.fossil_displaced_MWh`). Emission factors stored on the file’s source list: propane **62.87**, oil **73.96**, gas **53.06 kg CO2/MMBtu**, and eGRID NYUP **242.8 lb CO2e/MWh** versus NYCW **865.7** (`sources` ids `epa_ef` and `egrid`). Those match verification rows 10a, 10c, 10d, and 10e (https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.pdf and the 2025 GHG Emission Factors Hub, verified 2026-10-03). ERF is **0.0462** and ERE is **1.154** (`impact.erf`, `impact.ere`). Most of the heat is still rejected at the fans. Say that.

**Source:** `impact.co2_avoided_t_yr`, `impact.erf`, `impact.ere`, `impact.fossil_displaced_MWh`, `extras.co2_avoided_marginal_grid_t_yr`, `sources`. Factors: `research/verification.md` rows 10a, 10c, 10d, 10e.

### 19. You use 6.5% of the waste heat. Is this reuse or a rounding error?

Available heat at the 150 MW base is **777.6 GWh/yr**, **88.8 MW** average, from IT load **150 MW**, load factor **0.8**, capture fraction **0.75** (`supply`). Phases 1–2 deliver **50,576 MWh**, which is **6.5%** of that (`totals.heat_delivered_MWh`, `totals.share_of_available_pct`). At a 320 MW build-out the same delivery is **3.05%** of available heat and 7% LCOH does not change (`extras.scenarios.dc_320MW_full_build`). Dropping capture to 0.40 cuts available heat to **414.7 GWh** and leaves delivered energy and LCOH at the same values (`extras.scenarios.recovery_low_0.40`). Supply is not the scarce input. The scarce inputs are customers near the fence and a temperature the campus can use without a long hot main. The 150 MW figure is the project website’s phase-1 scale; TeraWulf’s Q2 2026 release is about 400 MW gross / 320 MW critical IT, operations about 2029, and it does not split out 150 MW (verification.md rows 3a and 3b).

**Source:** `supply`, `totals.share_of_available_pct`, `extras.scenarios`. Filing: `research/verification.md` rows 3a–3b, https://www.sec.gov/Archives/edgar/data/1083301/000108330126000162/a_wulfearningsreleaseq22026.htm (verified 2026-10-03).

### 20. Why Site 2 and not 111 Eighth Avenue?

This sheet does not quote Site 1 model numbers; they live in `site1.json`, and the instruction for these answers is Site 2’s file. The choice is in `docs/proposal/01-site-selection.md` § Honest comparison. Site 2 is a proposed plant where a heat covenant can be a condition of approval, on a town whose new gas service has been frozen since 2015 (verification.md row 6a), with the first loads on a **0.5 km** pipe at **$40.6/MWh**. Site 1 is a commissioned carrier hotel. The urban site pack puts social vulnerability at the 79th percentile beside a disadvantaged community; the Lake Hawkeye pack says there are no disadvantaged communities nearby. Chelsea is the sharper equity site. Lansing is where the politics are a live yes-or-no on the project. Deep Green’s 24 MW heat-reuse proposal is Lansing, Michigan, announced November 2025 and withdrawn 6 April 2026 (verification.md row 12). It is a precedent for a utility taking data-center heat, and it is also a precedent for a project that did not survive local process.

**Source:** `rings[onsite].lcoh_usd_mwh_7pct`, `rings[onsite].pipe_km`. Comparison write-up: `docs/proposal/01-site-selection.md`. Ban and moratorium and Deep Green: `research/verification.md` rows 1a, 6a, 12.

### 21. The site pack says there is no disadvantaged community. Where is the equity case?

Do not call this an environmental-justice project. The Lake Hawkeye pack states there are no designated disadvantaged communities nearby (`docs/proposal/01-site-selection.md` § HDR lenses, pack p. 24). The community case in the model is the heating bill where new gas is not available: **$735/yr** versus propane for a standard home, and the stakeholder card’s **$1,286/yr** versus propane on the low-income tier (`finance.household.savings_vs_propane_usd`, `value_by_stakeholder`). The low-income tariff is **$88.5/MWh** (`finance.low_income_tariff_usd_mwh`). NYSEG invoked the Lansing moratorium in **February 2015** for capacity and low design-day pressure (verification.md row 6a, PSC order 12 May 2022, https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BE068C615-B8EE-4CB9-AF92-3153A49BE4E4%7D, verified 2026-10-03). A July 2025 gas plan still lists Lansing below 50% of MAOP (row 6c-update). Whether the moratorium still binds in October 2026 is `[unverified]`. Natural gas in the model is **$64.2/MWh** (`finance.incumbent_usd_mwh.natural_gas`), cheaper than our LCOH, and it is the fuel new customers cannot take.

**Source:** `finance.household`, `finance.low_income_tariff_usd_mwh`, `finance.incumbent_usd_mwh.natural_gas`, `hdr_scorecard`. DAC line: `docs/proposal/01-site-selection.md`. Moratorium: `research/verification.md` rows 6a, 6c-update.

### 22. Gas is the cheap fuel in your own table. Why not wait?

Because the comparison that matches the town is propane **$136.1/MWh** and oil **$155.8/MWh**, not gas at **$64.2**. Electric resistance is **$245/MWh** (`finance.incumbent_usd_mwh`). The moratorium history is row 6a, and a 2026 confirmation is still open (question 21). Phase 1 does not need a town-wide pipe to matter: the on-site campus is **37,076 MWh** at **$40.6/MWh**, against the growers’ card of **$50/MWh** versus propane **$136**. That ring is the one a CFO and a town board can both look at without the corridor’s subsidy. The corridor is the expansion that needs the Community Benefit payment.

**Source:** `finance.incumbent_usd_mwh`, `rings[onsite]`, `value_by_stakeholder`. Moratorium status: `research/verification.md` row 6a and the 2026 gap in row 6c.

### 23. The gap is 1.73% of a $1.5 billion campus. Will a CFO believe either number?

The whole-project funding gap is **$26.01 million** PV at 7% over 30 years, annuitized at **$2.096 million per year** (`extras.cba.headline_gap_musd`, `headline_annuitized_7pct_musd_per_yr`). The file sets data-center capex at **$1,500 million** and the gap at **1.73%** of that (`extras.cba.dc_capex_musd`, `headline_as_pct_of_dc_capex`). The basis string is an **ASSUMPTION**: $10 million per MW IT times 150 MW, the midpoint of Turner & Townsend’s 2025 US range of $6.6–13.3 per watt (`extras.cba.dc_capex_basis`, source id `tt`). Move the campus cost inside that range and the percentage moves; the **$26.01 million** does not, because it is the heat project’s own NPV (`extras.funding.npv7_musd` −26.01). What TeraWulf gets inside the model, besides a permit conversation, is **970 MWh/yr** of fan electricity and an ERF of **0.0462**. The file does not store a dollar value for those fans. A CFO signs if the covenant is the condition of the land use, the heat is priced at about zero at the plate (`docs/ownership-deal.md` §3), and the bond is capped at the year-10 exit numbers in question 6. Social-license prose will not close it.

**Source:** `extras.cba`, `extras.funding.npv7_musd`, `impact.water.fan_energy_saved_MWh`, `impact.erf`. Campus-cost index cited in `sources` id `tt`.

### 24. If the CBA pays for the pipe and not the heat pumps, does the corridor clear?

No. `extras.cba.breakeven_homes_if_cba_pays_pipe` says pipe alone is not enough. If the CBA pays pipe and laterals, corridor LCOH at 2,000 homes is still **$179.6/MWh** against a blended tariff of **$104.8**. Pipe plus half the building heat pumps is **$135.8** at 2,000 homes. Pipe plus all building heat pumps reaches LCOH **$103.3/MWh** and a minimum of **50** homes (`min_homes` 50). The finding string in that object: the building heat pumps have to be funded as well, by the CBA, NYSEG’s non-pipe program, or NYSERDA Clean Heat, before an 0.8× propane tariff covers cost. Those 500 units are **$8.0 million** of the **$38.76 million** (`finance.capex_musd`). The unit price is an assumption inside the line-item source, not a bid.

**Source:** `extras.cba.breakeven_homes_if_cba_pays_pipe`, `finance.capex_musd`.

### 25. Jobs, food, ERF, ten hectares. What will you not defend if we push?

Defend as model outputs, not as signed contracts. `impact` reports **126** jobs, **5,500 t/yr** local food, **1,500 t/yr** fish, and **10 ha** of greenhouse, headline “A year-round 10-hectare farm and 500 homes.” The source note points at RII’s Virginia colocation paper for jobs and a ~1 MWth/ha benchmark (`sources` id `rii`; `extras.greenhouse_check` peak **14.88 MW** on **10 ha**). `docs/proposal/03-users.md` lane status: no named grower, co-op, or pool operator, and food processing has no model load. Acreage beyond the **183-acre** lease is unverifiable (verification.md row 3d); do not say “250 acres.” ERF **0.0462** means about 4.6% of the facility energy is reused. HDR scorecard rows for nutrients and biodiversity rest on that unsigned campus (`hdr_scorecard`). The number we will defend without a tenant is the cost gate: build the **$40.6/MWh** campus only when a grower signs, and leave the **$734/MWh** town main on the shelf.

**Source:** `impact`, `extras.greenhouse_check`, `hdr_scorecard`, `rings[onsite].lcoh_usd_mwh_7pct`, `rings[town]`. Lease acres: `research/verification.md` row 3c versus row 3d. No offtaker LOI: `docs/proposal/03-users.md` § Lane status.

### 26. What is the embodied carbon of the build, and when does it pay back?

It is a screening estimate, not an LCA. We take 21.4 km of pipe (`rings[onsite].pipe_km` plus `rings[corridor].pipe_km`), 500 heat pumps, one plate exchanger skid and a 5,558 m3 tank (`totals.storage_m3`), and apply generic per-unit factors that we label as assumptions with low and high values. The result is about 1,700 to 6,300 t CO2e. Against `impact.co2_avoided_t_yr` of **11,408 t/yr** (already net of heat pump and pumping electricity), payback is about **0.15 to 0.55 years**. The soft spot is not the embodied side. It is that the 11,408 counts phases 1 and 2 fully built. Refrigerant leakage, building works and end-of-life are not modeled.

**Source:** `docs/council-gaps.md` section 1 (factors and arithmetic). `impact.co2_avoided_t_yr`, `totals.storage_m3`, `rings[].pipe_km`.

### 27. Does heat reuse improve your water use effectiveness (WUE)?

No change is claimed. WUE is water used on site per unit of IT energy. The published design is a sealed closed-loop glycol system with air-cooled dry coolers and no lake draw (verification.md row 4a, a developer claim), so there is no evaporative water for heat reuse to save. `impact.water.note` says no lake-water savings are claimed, so we claim **0 gallons**. The measured benefit is **970 MWh/yr** of fan energy (`impact.water.fan_energy_saved_MWh`). We do not say "no consumptive water", because make-up and domestic water are not addressed. The aquaponics loop is a design intent to keep nutrients in the building. It has no numbers.

**Source:** `impact.water`, `docs/council-gaps.md` section 2. Permit: `research/verification.md` rows 4a, 5a, 5c.

### 28. Who is liable if it breaks?

Under our proposed terms, the cooling-priority clause keeps the data center safe: TeraWulf may curtail heat at any time without penalty, a hard-wired bypass fails safe to the dry coolers, and no heat-side event is a data-center default or claim. On the heat side the co-op carries the risk for the network it owns, covers shortfalls with storage then backup boilers sized to 100% of peak (`totals.backup_share_annual_pct` **0.73%**; `totals.unmet_hours` is 0 only by construction), and would hold liability and property insurance. We have no premium or limit. If TeraWulf leaves, a funded reserve is proposed, with `finance.dc_exit.stranded_musd` **$5.71M** as the starting reference. The Town is a counterparty and one board seat, not the operator or guarantor.

**Source:** `docs/term-sheet.md` 2.3, 2.4, 2.6; `docs/council-gaps.md` section 5. The Town's authority to attach these conditions is not verified (G0.5).

### 29. How do you keep pumping energy and delta-T under control?

`outputs/hydraulics.json` computes variable-speed pumping for phases 1 and 2 at **374.59 MWh/yr**, an implied share of **0.74%** against the flat 1.5% in the base model (`phases_1_2.implied_pump_share`). That hides a corridor under-count: the 5 K ambient loop computes at **1.40 times** its flat share (`rings.corridor.computed_vs_flat_ratio`), and constant-speed pumping would be 27.3% of corridor heat. The fix is variable speed and a delta-T drift clause: monthly delta-T reporting, and a corrective-action trigger if return temperature rises past a margin (the margin is a blank until we have measured data). Losing 1 K of the corridor's 5 K is a 25% flow increase. Screening hydraulics only, not design.

**Source:** `outputs/hydraulics.json` (`phases_1_2`, `rings.<id>.annual`), `docs/hydraulics.md`, `docs/council-gaps.md` section 7.

## Rubric

This sheet serves Presentation (the value and the workings in the same answer) and Technology (COP clip, hourly backup shares, LCOH versus realised revenue). It does not change the app, so it does not put Execution at risk. Theme is the covenant: waste heat as the condition for community value, with the water and equity claims kept inside what the file and the site pack support.

## Lane status

### Done

- `docs/judge-qa.md` holds 29 questions with 2–3 sentence answers.
- Engineering: COP and the 6.0 clip, 30 °C versus 50 °C, the three supply temperatures, curtailment and backup shares, the unmet-hours caveat, year-10 exit, glycol disagreement, legionella gap, town pipe loss.
- Economics: corridor LCOH $285.8, ASHP at $96.9 versus tariff $108.9, LCOH versus realised revenue, ITC excluded with the upside case labeled as upside, pipe-versus-heat-pump breakeven, $26.01 million gap.
- Delivery: co-op statute rows 11a–11d, HSA/CBA signatories, Town Board draft ban without the 36/38 count.
- Environment: 0 gallons claimed, 970 MWh fan energy, CO2 11,408 / marginal 10,670 and the EPA factors.
- Site choice: Site 2 covenant and moratorium versus Site 1 equity, with Site 1 model numbers left in `site1.json`. Deep Green kept in Michigan.

### Missing

- A legionella setpoint, storage temperature, or ASHRAE 188 sequence. The answer is the gap.
- A measured Lake Hawkeye loop temperature. 50 °C remains a covenant assumption.
- A New York opinion on co-op formation, PSC jurisdiction, and patronage.
- October 2026 confirmation that the gas moratorium still binds (last primary in the verification file is the 14 July 2025 plan).
- A bond calculation that ties `finance.dc_exit.stranded_musd` (5.71) to the letter-of-credit formula in the term sheet.
- Signed offtakers for the 10 ha greenhouse, the fish load, and the 500 homes.
- Central-region weekly propane in $/gal. The model’s propane price is the $136.1/MWh incumbent, and verification row 7b left a Central gallon price unverified.
- Any Site 1 dollar or megawatt figure inside this sheet, on purpose.

### Open questions

- Uptake tornado row: input share 0.9 maps to LCOH 111.7 and share 0.45 maps to LCOH 97.7 (`finance.tornado`). That sign is surprising for a fixed pipe. Do not quote it until someone checks the model.
- Speak the `impact.co2_avoided_t_yr` (11,408) and `extras.co2_avoided_marginal_grid_t_yr` (10,670) keys if any card rounds differently.
- `docs/proposal.md` §8.3 names Tompkins County as a CBA party and talks about permit revocation. The term sheet in `docs/ownership-deal.md` §§3–4 does not. Speak the term sheet.
- Whether a 30–35% propylene blend is the operating fluid (FAQ quote versus closed-loop page). Leave it as a disagreement.
- Energy-community status of the tract (verification.md row 9f-ii). The ITC upside in the JSON is not a base-case claim.

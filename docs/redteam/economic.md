# Economic red team — utility CFO

Attack on capex, levelized cost of heat (LCOH), tariff margin, uptake, financing, and stranded assets for the Thermal Commons co-op at Lake Hawkeye (Site 2, Lansing, NY). Site 1 (111 8th Avenue, New York City) is the comparison only. Working team: Harsh Agarwal, Linson Lee, Philip Matchev.

Severity scale: **Critical** (kills the investment case or creates a covenant the town cannot enforce), **High** (materially changes payback or bankability), **Medium** (manageable with a design change), **Low** (disclosure item).

Each finding: claim, evidence, severity, fix. Model dollars are from `web/public/data/site2.json` (`meta.generated` 2026-10-04). They are model outputs, not metered bills. External facts carry a URL and "(verified 2026-10-03)" when `research/verification.md` checked them. If a number is not in those sources it is marked [unverified]. Organizer text in `resources/text/` outranks web sources. `research/verification.md` overrides older research files. Where `docs/audit/numbers-finance.md` disagrees with the JSON on disk, the JSON wins; the disagreement is finding E0.

## Scope and CFO frame

**Verdict.** I would not finance phases 1–2 as one utility. The book collects **$64.62/MWh** and the 7% LCOH is **$106.1/MWh**. The published margin on that pair is **−$41.45/MWh**. Net present value at 7% is **−$26.01 million** (`finance`, `extras.tariff_scenarios` at 0.80 × propane, `extras.funding`). The residential price on the slide, **$108.9/MWh**, sits about **$2.8/MWh** above the blended LCOH. ASSUMPTION: 108.9 − 106.1 = 2.8, using the rounded JSON fields. That gap is a posted tariff against an average cost. It is not cash collected. Most of the megawatt-hours are sold much cheaper than $108.9.

What I would tell the board:

- The on-site ring (greenhouse, aquaculture, recreation) is the only ring whose 7% LCOH, **$40.6/MWh**, is under the model’s propane-equivalent of **$136.1/MWh**. Pipe is 0.5 km. Direct heat exchange.
- The corridor (500 homes, 20.9 km, **$285.8/MWh**, 0.65 MWh per metre per year) is above propane, above oil (**$155.8**), and above the model’s air-source heat pump energy cost (**$96.9**).
- The town-center ring (14.0 km, **$734.2/MWh**) has `passes_gate: false`. It is not in the $38.76 million capex or the $106.1 LCOH. Adding it raises capex to **$64.34 million** and 7% LCOH to **$147.3/MWh** (`extras.with_town`).
- The on-site surplus that the file uses to shrink the gap is **$4.3 million** present value. The corridor standing alone is a **$30.32 million** gap. Whole-project gap **$26.01 million** = corridor gap minus that surplus (`extras.cba.reconciliation`). A $4.3 million surplus does not carry a $30 million residential gap.
- Supply is not the scarce input. Delivered heat is **50,576 MWh**, **6.5%** of **777.6 GWh** available. Recovery fraction 0.40 / 0.75 / 0.85 and a 320 MW IT case all print the same 7% LCOH, **$106.07** (`extras.scenarios`). The tornado’s data-center load bar is flat at **$106.1** from 75 MW to 320 MW. A bigger campus does not repair this P&L.

HDR read, stated as money rather than as a petal. Community value that survives a credit committee is heat sold on the lease to users who come to the plant, priced off a cost the co-op can collect. A residential discount that the co-op cannot earn is a transfer, and the site pack says there are no designated disadvantaged communities nearby (`resources/text/2026_10_01_Hackathon_NYU_-_Suburban_Site_-_Lake_Hawkeye.txt`, the sentence “There are also no disadvantaged communities nearby.”). Do not book equity, lake-water savings, or a town-wide bill cut as revenue.

## Capex attack

**E1. Almost half the capital is the product that fails its own cost test.** Severity: **Critical**.

Phases 1–2 capex is **$38.76 million**. The lines (`finance.capex_musd.lines`):

| Line | $ million | Source tag in the JSON |
|---|---:|---|
| DC-side sidestream interface | 2.59 | ASSUMPTION $/kW; OCP split cited |
| Hot-water tank, 5,558 m³ | 1.67 | ASSUMPTION $/m³; Danish pit 33–38 EUR/m³ cited as the floor |
| On-site pipe, 0.5 km | 0.45 | ASSUMPTION |
| On-site substations | 1.64 | ASSUMPTION $/kW |
| Corridor ambient loop, 20.9 km | 9.39 | ASSUMPTION; MIT OCW ~$50k/residence cited |
| Building heat pumps, 500 | 8.00 | ASSUMPTION; MIT in-home share cited |
| Service laterals + meters | 1.25 | ASSUMPTION |
| Circulation pumps + plant | 0.93 | ASSUMPTION $/kW |
| Backup boilers, 100% of peak | 2.80 | ASSUMPTION $/kW |
| Soft costs | 4.31 | ASSUMPTION % |
| Contingency | 5.74 | ASSUMPTION % |

ASSUMPTION (sum of the three corridor customer lines as printed): 9.39 + 8.00 + 1.25 = **$18.64 million**, about **48%** of the $38.76 million total, before any share of soft costs and contingency. Those three lines exist to serve a ring at **$285.8/MWh**. `docs/audit/numbers-finance.md` rebuilt the same dollar lines from unit costs (interface about $120/kW on a 21.5 MW source peak, tank $300/m³, on-site pipe $900/m, corridor pipe $450/m, heat pumps $16,000, laterals $2,500, pumps $40/kW, boilers $120/kW, soft costs 15% of direct, contingency 20% of direct, multiplier 1.35, not stacked). That audit’s **LCOH and gap are a prior run** (see E0). Its unit-cost arithmetic still matches the capex lines on disk. I did not re-open `config/finance.yaml` in this pass.

Fix: drop the corridor and the town main from the capital plan the co-op borrows against. Keep a sources-and-uses that contains only interface, tank, on-site pipe, on-site substations, a right-sized backup, and the soft costs on that smaller direct total. Do not “allocate” the 20.9 km loop as a community benefit inside the same mortgage.

**E2. Unit costs are assumptions, and the one external floor the file cites is far under the tank line.** Severity: **Medium**.

Every capex `source` string is an ASSUMPTION. The tank note points at Danish pit stores of 33–38 EUR/m³ (the JSON names iea-shc.org; this pass did not re-fetch that page) and then books **$1.67 million** for 5,558 m³. ASSUMPTION: 1.67e6 / 5,558 ≈ **$300/m³**, the same unit cost the finance audit used. That is several times the cited floor. The tank is 6 hours of network storage in a system whose supply is about 15 times demand (`research/model-notes.md`: supply does not bind). It is an outage buffer, not a seasonal arbitrage asset.

The corridor’s all-in order of magnitude is not the problem. Model notes put the loop near the MIT OCW figure of about $50,000 per residence, with about one-third in the home (`https://ocw.mit.edu/courses/res-env-007-geothermal-energy-networks-transforming-our-thermal-energy-system-january-iap-2025/mitres_env_007_lec07_3.pdf`, cited in the JSON). A cost that matches a published networked-geothermal benchmark and still loses to propane is a product failure, not a missing contingency line.

Local calibration, the other way: NYSEG/RG&E’s Ithaca thermal-energy pilot is **$35.45 million** of estimated initial development cost and **$52.48 million** across stages 1–5, on one city block (verification.md row 8-cost, NYSEG/RG&E report 13 March 2026, https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7B8025E89C-0000-C94C-BD5F-051864C357DC%7D) (verified 2026-10-03). A $38.76 million rural network is in that band. It is not a small pilot that 20% contingency makes safe. Ithaca is a different system (groundwater wells). Use it as a cost-growth warning, not as a unit-cost quote.

Fix: re-quote pipe, tank, and heat pumps from a catalogue (NREL or the Danish Energy Agency technology catalogue) before anyone calls $38.76 million a budget. Until then, label every line ASSUMPTION on the slide. For the tank, either justify a buried tank at ~$300/m³ against the 33–38 EUR/m³ floor or resize the line.

**E3. Backup capital is sized for a fuel that delivers under 1% of annual heat.** Severity: **Medium**.

Backup boilers are **$2.80 million**, sized to 100% of peak. Annual backup is **373 MWh**, **0.73%** of delivered heat. Unmet hours are 0 because the boilers are sized that way (`totals.unmet_note`). ASSUMPTION: 2.80e6 / 373 ≈ **$7,500 of direct capital per annual backup megawatt-hour**, before soft costs. That can be the right reliability covenant. It is not free, and “zero unmet hours” is not an operating result.

Fix: show the $2.80 million as the price of the continuity promise. Do not add a second full-peak plant “for the town” on top.

**E4. The host is modeled as paying the data center’s half of the interface.** Severity: **Low** on dollars, **High** on the contract story.

OCP’s organizer note: extraction cost “should be split by data center and heat host”; storage and temperature lift sit with the host (`resources/text/20230623_Data_Centers_HeatReuse_101_3.2.docx.txt`, the heat-host cost paragraph). The note does not set the split at 50%. The finance audit found the evaluator sums the full **$2.59 million** interface into host capex anyway. Halving it, on that prior run, moved 7% LCOH by about **$3.3/MWh** and the gap by about **$2 million**. I did not recompute that haircut on the live $106.1 LCOH. The live file’s own rule string still says the host pays upgrading, storage, and heat pumps (`extras.cost_split_rule`).

Fix: two columns, gross build versus host debt. The data center’s extraction share is a covenant payment, not a rounding item inside co-op LCOH. Even a clean split does not make $285.8/MWh corridor heat bankable.

## LCOH attack

**E0. The repo has two finance books. Quote the JSON, not the audit.** Severity: **High** for the submission, **Critical** if a slide mixes them.

`docs/audit/numbers-finance.md` hand-checked an earlier `model.full` and published blended LCOH **$82.7 / $100.2 / $119.7**, ring LCOH **$37.5 / $272.3**, town **$717.6**, funding gap **$22.32 million**, and a tariff-minus-blend margin of about **+$8.68/MWh** at the 0.80 propane multiple. `research/model-notes.md` still has an older sentence at about **$102/MWh** and a **$23.6 million** gap.

The file on disk now (`web/public/data/site2.json`, generated 2026-10-04):

| Item | Live JSON |
|---|---:|
| LCOH, co-op 4% / utility 7% / private 10% | 89.5 / 106.1 / 124.6 |
| Ring LCOH at 7%, on-site / corridor / town | 40.6 / 285.8 / 734.2 |
| Whole-project gap at 7% | 26.01 |
| Corridor stand-alone gap | 30.32 |
| Realised revenue | 64.62 |
| `margin_vs_lcoh7` at 0.80 × propane | −41.45 |
| Capex, phases 1–2 | 38.76 (unchanged versus the audit) |

Capex lines match. The annualization and the margin definition do not. Model notes say capex is now annualized by asset life (pipe and tank 30 years, equipment 20 years). I did not re-run the code, so that sentence is the notes’ account of the move from ~$100 to $106, not a second calculation by this lane.

Fix: one footnote on every economic slide: “`site2.json` generated 2026-10-04.” Delete $100.2, $102, +$8.68, and $22.3 million from the speaking script.

**E5. Blended $106/MWh is a weighted average pulled down by cheap megawatt-hours.** Severity: **Critical**.

On-site delivery **37,076 MWh** at **$40.6/MWh**. Corridor **13,500 MWh** at **$285.8/MWh**. Total **50,576 MWh**. ASSUMPTION: 37,076 / 50,576 = **73%** of delivered heat is the cheap ring. A lender who underwrites “$106 versus propane at $136” is underwriting a blend that only exists if both rings are built and the cheap ring stays full. `extras.with_town` shows what happens when the dear ring is allowed in: 7% LCOH **$147.3**, above propane.

The same blend loses to two incumbents the slide should show beside propane:

- Air-source heat pump **$96.9/MWh** (electricity only, seasonal COP about 2.53 in `extras`). The finance audit’s boundary still applies: this figure has no heat-pump capital, and the propane figure has no furnace capital.
- Natural gas **$64.2/MWh**. About **38%** of occupied town homes already heat with utility gas, about **26%** with propane, about **8%** with fuel oil (ACS B25040, https://data.census.gov/table/ACSDT5Y2023.B25040, as recorded in `research/facts-site2.md`) (verified 2026-10-03).

Fix: lead with three LCOHs, never the blend, in this order: on-site $40.6 (build), corridor $285.8 (do not trench), town $734.2 (gate failed). Put gas at $64.2 and the air-source energy cost at $96.9 on the same chart as propane at $136.1.

**E6. Discount rate is the widest tornado bar, and cheaper money does not close a revenue hole.** Severity: **High**.

Tornado, base **$106.1** (`finance.tornado`):

| Driver | Printed low | Printed high | Inputs as stored |
|---|---:|---:|---|
| Discount rate | 89.5 | 124.6 | 4% to 10% |
| Pipe cost | 98.5 | 116.1 | 0.7× to 1.4× |
| Uptake | 111.7 | 97.7 | 0.90 and 0.45 (see E9; the words “low” and “high” are not in LCOH order) |
| Electricity, both rates scaled | 99.5 | 110.8 | $0.14/kWh and $0.32/kWh |
| Heat-pump efficiency | 104.2 | 109.2 | eta 0.60 and 0.40 |
| Data-center IT load | 106.1 | 106.1 | 320 MW and 75 MW |

At a co-op 4% the LCOH is still **$89.5/MWh**. Collected revenue in the base tariff case is **$64.62/MWh**. ASSUMPTION: 89.5 − 64.62 ≈ **$25/MWh** still uncovered at the cheap cost of capital. The JSON does not publish a 4% NPV. I will not invent one. Directionally, municipal money makes the loss smaller and does not create a surplus against a $65 collected price.

Electricity is second-order. Moving the central plant from the industrial **$0.108/kWh** to the residential **$0.245/kWh** prints LCOH **$108.12** (`extras.scenarios.central_at_residential_rate`), about two dollars above the base. Model notes say the industrial figure is EIA’s New York industrial average for July 2026, 10.81 ¢/kWh, and that the NYSEG SC-7 tariff was not checked (https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a, cited in the JSON). A wrong NYSEG rate is a disclosure item. It is not why the corridor fails.

Fix: stop selling “a co-op at 4% makes this work.” Show collected $/MWh against LCOH at 4%, 7%, and 10%. The 10% private case is **$124.6/MWh**, above the posted residential tariff.

**E7. Site 1 is the control, and it fails the same test more clearly.** Severity: **Low** (choice of site), useful so judges do not think Lansing’s blend is a general result.

`web/public/data/site1.json`: capex **$72.01 million**, 7% LCOH **$304.9/MWh**, tariff **$95/MWh**, steam incumbent **$118.7/MWh**. The file’s own why-not text says Manhattan heat is about 2.6 times the steam price. Site 2’s blended optics look better. The bankable contrast is Site 2’s on-site ring at $40.6, not the $106 blend. Site 1’s ring LCOHs are $181 / $331 / $270. None of them is a utility I would finance either.

## Tariff margin

**E8. The thin margin is the wrong subtraction. Cash margin is largely negative.** Severity: **Critical**.

Tariff rule in the file: **“0.8 x propane, fixed.”** Propane-equivalent **$136.1/MWh** (model: $3.10/gal, 26.8 kWh/gal, boiler efficiency 0.85, per the finance audit’s rebuild). 0.8 × 136.1 = **$108.9/MWh** as published. Low-income tier **$88.5/MWh**, which is 35% off the propane-equivalent, not an extra 35 points on top of the 20% (`docs/audit/numbers-finance.md` on the tariff formula; the dollar is still $88.5 in the live JSON). The stakeholder string that says “Extra 35% tier discount” overstates the design. The 20% low-income share of homes is an assumption in that audit. The site pack does not give a disadvantaged-community count to pin it to.

Live tariff scenarios (`extras.tariff_scenarios`):

| Multiple of propane | Posted tariff $/MWh | Realised revenue $/MWh | Margin vs 7% LCOH | NPV at 7%, $ million | Household “savings” vs propane |
|---:|---:|---:|---:|---:|---:|
| 0.85 | 115.67 | 66.08 | −39.99 | −25.1 | $551 |
| 0.80 (base) | 108.87 | 64.62 | −41.45 | −26.01 | $735 |
| 0.75 | 102.06 | 63.17 | −42.90 | −26.92 | $919 |

Raising the posted discount (0.75) makes the household story prettier and the NPV worse. Cutting the discount to 15% (0.85) still leaves **−$40/MWh** and **−$25 million**. There is no price in this table that a propane household would call a bargain and a lender would call a cover.

Why realised revenue is $64.62 when the residential tariff is $109: the finance audit computed annual revenue of about **$3.27 million**, which the live `extras.funding.revenue_musd_yr` still prints, because on-site heat is illustrated at **$50/MWh** (`value_by_stakeholder`: “$50/MWh vs propane $136/MWh”). That $50 is a text field, not a tariff schedule with a signature block. ASSUMPTION, carried from the audit and still consistent with $3.27 million / 50,576 MWh ≈ $65: roughly three-quarters of the energy is priced near $50 and the corridor is priced near $105 after the low-income blend. The $108.9 number never hits the income statement as an average.

Operating cash looks survivable and is not. Opex is **$1.94 million per year**. ASSUMPTION: 3.27 − 1.94 = **$1.33 million** of cash after operations, before capital. The file’s annuitized whole-project gap at 7% is **$2.096 million per year** (`extras.cba.headline_annuitized_7pct_musd_per_yr`). Capital service on the unfunded present value is larger than the operating surplus. The straight-line **$0.867 million per year** is labeled in the JSON as undiscounted and too small. Do not brief that one.

The $735 household figure is a fuel-only delta: 27 MWh × (136.1 − 108.9). It is not co-op income. ASSUMPTION on the model’s own prices: 27 × (108.9 − 96.9) ≈ **$324 a year more** than the air-source energy cost in the same file. The building heat pumps are **$8.0 million** for 500 homes, **$16,000** each. The JSON finding on breakeven says those pumps have to be funded by someone else (NYSEG non-pipe program, NYSERDA, or the community-benefit agreement) before an 0.8× propane tariff covers cost (`extras.cba.breakeven_homes_if_cba_pays_pipe.finding`). The household “saving” and the co-op’s unpaid pump capital are the same dollars seen from two sides.

Propane-price sensitivity already flips the thin posted margin. At a **$2.85/gal** case the file prints propane **$125.11/MWh**, tariff **$100.09/MWh**, 7% LCOH **$105.99**, household savings **$676** (`extras.scenarios.propane_2.85_low_sensitivity`). ASSUMPTION: 100.09 − 105.99 ≈ **−$6/MWh**. The posted tariff no longer clears even the blended LCOH. Verification row 7b: statewide propane on 21 September 2026 was **$3.120/gal** (14 September **$3.116**); the Central dashboard gallon was unreadable; $2.849 is not the statewide print (https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/EDPPP/Energy-Prices/Weekly-Report/WeeklyEnergyandFuelsReport_20260925.pdf) (verified 2026-10-03). The model’s $3.10 base is an instructed midpoint. Row 7a: oil **$5.186/gal** is a Central monthly average, not a late-September weekly; statewide weekly oil on 21 September 2026 was **$6.271** (https://www.nyserda.ny.gov/Energy-Prices/Home-Heating-Oil/Monthly-Average-Home-Heating-Oil-Prices) (verified 2026-10-03). A pegged tariff inherits that price basis. A fixed 0.8× rule with no collar is a margin leak when the gallon falls, and a political leak when it rises.

Fix, as the rate order:

1. Publish one price list: on-site $/MWh, corridor $/MWh, low-income $/MWh, and the realised average. Kill any sentence that says the $109 tariff covers the $106 cost.
2. Do not offer corridor service. If a later cluster clears the density gate, its tariff has to cover that cluster’s own LCOH, with building heat pumps in the cost stack, tested against the air-source alternative as well as propane.
3. Index whatever on-site price you do sign, with a floor at on-site LCOH plus a stated margin. A propane multiple alone is not a cost-of-service rate.
4. Say, in the household calculator, that $735 is a propane-fuel comparison for a 27 MWh home, that gas at $64 is cheaper, and that an air-source heat pump’s energy cost in this model is about $97.

## Uptake risk

**E9. Signing more corridor homes makes the blended cost worse, on the numbers in the file.** Severity: **Critical**.

The uptake tornado stores input **0.90** next to LCOH **$111.7** and input **0.45** next to LCOH **$97.7**, around a base of **$106.1**. The field called `low` (111.7) is higher than the field called `high` (97.7). A chart that reads “low” as “low cost” will brief this bar backwards. Model notes say this tornado holds potential homes fixed and scales customers. I did not re-run it. The published pairs are what a lender will see: a higher signed share prints a higher blended LCOH.

That direction is what a value-destroying product looks like. Corridor heat at $286/MWh, pulled into a blend with on-site heat at $41/MWh, raises the average as the corridor grows. The older finance audit described the opposite mechanism (higher uptake shortens the loop, homes held at 500, and 0.90 was the cheap case). That description matches the audit’s old tornado, not this JSON. Do not reconcile them in the booth. Re-run, then label the axis “LCOH at 90% signed share” and “LCOH at 45% signed share.”

The breakeven block is harsher than the tornado, and it does not depend on the axis labels (`extras.cba.breakeven_homes_if_cba_pays_pipe`):

| If the benefit agreement pays… | Result in the file |
|---|---|
| Pipe and laterals only | No minimum home count found. At 2,000 homes, ring LCOH still **$179.6** versus blended tariff **$104.8** |
| Pipe plus half the building heat pumps | At 2,000 homes, ring LCOH **$135.8**, still above $104.8 |
| Pipe and all building heat pumps | Breaks even from **50 homes**, ring LCOH **$103.3** |

Four times as many homes do not save the corridor. Paying for the pipe does not either. The binding check is who buys the $16,000 heat pump. Density in the base case is **0.65 MWh per metre per year**. The plan’s own screen starts near **1.5** (`PLAN.md`). CBS rates distance beyond 2 km as a poor connection: connection cost share rises from 3% to 50% of capex between 50 m and 4 km (`resources/text/CBS_Data_center_white_paper_DISTRICT_HEATING.txt`, as summarized in `research/digest-organizer.md`). The corridor is 20.9 km. The town main is 14.0 km, and pipe is **82%** of that ring’s capital (`extras.with_town.town_pipe_share_of_ring_capex`).

Pipe is sized for potential homes = signed / uptake. Model notes and the finance audit use uptake **0.70**, so the trench is longer than the 500 signed connections: 3 km trunk + (500 / 0.70) × 25 m = **20.9 km**. ASSUMPTION: about **30%** of the frontage is unsold on day one by the way the pipe was sized. Those metres are a stranded asset inside the base case, not only in a shutdown case.

Fix: no trench until a cluster is signed at a linear density that clears 1.5 MWh/m/yr and at a ring LCOH at or below the competitive alternative (propane and air-source). Customer contribution or a third-party grant pays the building heat pump in cash at conversion. The co-op does not warehouse unsigned frontage.

**E10. Phase-1 revenue is one unsigned campus.** Severity: **Critical**.

`web/public/data/offtakers.json`: on-site greenhouse **31,416 MWh/yr** (peak 11.22 MW in that file), aquaculture **4,500**, recreation **1,160**. The ring total is **37,076 MWh**. ASSUMPTION: 31,416 / 50,576 = **62%** of all delivered heat in phases 1–2 is one 10-hectare greenhouse that does not exist as a signed tenant. `extras.greenhouse_check` prints a greenhouse peak of **14.88 MW** against the offtaker file’s **11.22 MW**. I did not reconcile the two peaks. Do not size a substation off a slide.

The $4.3 million on-site surplus is the only reason the whole-project gap is $26 million rather than $30 million. If the grower does not sign, that surplus is gone and the corridor gap is the project. Food processing is in the concept and has **no MWh line** in `site2.json` (`docs/proposal/12-implementation-timeline.md`). Do not put it in revenue.

Land: the ground lease is **183 acres, 80 years, no renewal rights**, lessee Lake Hawkeye LLC, lessor Cayuga Operating Company LLC, with $100 purchase options from year 50 (verification.md row 3c, SEC 8-K https://www.sec.gov/Archives/edgar/data/1083301/000110465925078086/tm2523008d1_8k.htm) (verified 2026-10-03). A ~250-acre unleased remainder and a 434-acre site total are **[unverified]** (row 3d). Ithaca Voice’s account is that the 2016 purchase was the plant and the surrounding 183 acres (https://ithacavoice.org/2025/09/environmentalists-sound-alarm-as-plan-to-convert-cayuga-power-plant-to-data-center-advances/) (verified 2026-10-03). The greenhouse has to sit on land the lease actually controls, or the co-op needs its own real estate. That control is not shown.

RII’s ~1 MWth per hectare is a Virginia colocation benchmark cited inside the JSON (`resources/text/Colocating-Data-Centers_Greenhouses-RII-Virginia.txt`). It is not a Lansing offtake.

Fix: take-or-pay heat contract with a named grower, minimum annual MWh, credit support, curtailment rules, and a propane backup price, before any co-op debt. Minimum volume at least the greenhouse line you are capitalizing. No speculative food-processing megawatt-hours in the pro forma.

## Financing

**E11. The $26 million gap is not a source of funds.** Severity: **Critical**.

`extras.funding`: NPV at 7% **−$26.01 million**, same figure as the funding gap. The note already says grants, a data-center community-benefit contribution, or cheap capital must cover it so tariffs can stay under incumbents, and that a federal investment tax credit is not assumed. Good. Several ways of “filling” it do not survive a credit committee.

- **Percent of campus.** The file divides $26.01 million by an assumed **$1,500 million** campus and prints **1.73%**. The campus is **$10 million per MW × 150 MW**. The $10/W figure is the midpoint ASSUMPTION inside Turner & Townsend’s 2025 band of **$6.6–13.3 per watt** (https://reports.turnerandtownsend.com/data-centre-construction-cost-index-2025/, cited in the JSON; this lane did not re-read the index). A percent of an unbuilt, contested campus is not cash. TeraWulf’s Q2 2026 release: about **400 MW gross / 320 MW critical IT**, operations not contemplated until about **2029** (verification.md rows 3a and 3b, https://www.sec.gov/Archives/edgar/data/1083301/000108330126000162/a_wulfearningsreleaseq22026.htm) (verified 2026-10-03). The ~150 MW phase-1 figure is the project website; the latest filing has no phase-1 split (row 3a). No filing in this repo commits TeraWulf or Lake Hawkeye LLC to a $26 million heat payment. That commitment is **[unverified]**.
- **The town.** On 29 September 2026 the Town Board directed its attorney to draft a local law banning data centers. The $500,000 figure is money set aside in **next year’s proposed budget** for legal costs, not an existing litigation reserve (verification.md rows 1a and 1c, https://ithacavoice.org/2026/09/lansing-board-data-center-ban/) (verified 2026-10-03). A town assembling a legal budget to stop the project is not the residual financier of the project’s heat network. The 36-of-38 speaker count is single-source (row 1b, https://607newsnow.com/news/258852-town-of-lansing-moving-forward-with-drafting-a-data-center-ban/).
- **NYSEG’s existing program.** The Lansing non-pipe-alternative portfolio is five projects, **$9.0 million**, about 49.3 MCFH, with **$1,503,440** spent by 31 March 2024 (verification.md row 6d) (verified 2026-10-03). The corridor gap alone is **$30.32 million**, on the order of three times that whole portfolio. ASSUMPTION: 30.32 / 9.0 ≈ 3.4. The moratorium was invoked in **2015**, not 2014 (row 6a, PSC Case 20-G-0131, https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BE068C615-B8EE-4CB9-AF92-3153A49BE4E4%7D) (verified 2026-10-03). A 14 July 2025 gas plan still lists Lansing below 50% of MAOP (row 6c-update, https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7B30700A98-0000-CE30-9B40-1D15BBA44B68%7D) (verified 2026-10-03). Whether the moratorium is in force on 4 October 2026 is **[unverified]**. The affordability fact is real for propane and oil households. The utility already has a program aimed at it, and this corridor is not a cheaper version of that program.
- **Federal credit.** Waste-heat networks are not geothermal heat pump property. The statute and the December 2024 final regulations require the ground, groundwater, or other underground fluids as the source; Treasury declined to add recovered waste heat (verification.md row 9d-i, https://www.govinfo.gov/content/pkg/FR-2024-12-12/html/2024-28190.htm) (verified 2026-10-03). Property that generates electricity from waste heat is a different credit and is not a heat network (row 9d-ii). Do not claim 40–50% of total capex (row 9h). The live sensitivity `lcoh_incentive_scenario_if_qualifies_usd_mwh` **$85.8** and gap **$13.28 million** is a mechanical haircut. It is not a source. Direct pay under section 6417 is real for states, political subdivisions, tax-exempt entities, and rural electric cooperatives (row 9e, https://www.law.cornell.edu/uscode/text/26/6417) (verified 2026-10-03). A newly named thermal co-op is not automatically one of those entities. Whether Thermal Commons qualifies is **[unverified]**. Energy-community status for the tract is **[unverified]** (row 9f-ii). Construction-start deadlines step down before 2035 (row 9b); a project tied to a 2029 data-center date is inside the window only if counsel agrees the property qualifies at all.
- **Legal form.** A New York statute for a municipal heat co-op or thermal authority is **[unverified]** (verification.md open item 11a–e; also flagged in `docs/proposal/00-executive-summary.md`). Without a rate-setting entity that can collect a tariff and pledge revenue, the “co-op at 4%” case is a discount rate with no obligor.

CBS, on district-heating operators: the market is regulated, operated on thin margins, and reliant on subsidies; data-center operators are not accustomed to long-term service in that market (`resources/text/CBS_Data_center_white_paper_DISTRICT_HEATING.txt`, commercial considerations). That is the industry this tariff is trying to enter. Our thin posted margin ($2.8/MWh) is thinner than a regulated operator should accept, and the collected margin is negative.

Fix: sources and uses for an on-site-only project, with a cash covenant from the applicant escrowed at financial close of the heat assets, forfeited if metered heat is not delivered. No town full-faith-and-credit. No tax-increment pledge. No ITC line. No “1.7% of the campus” until the campus has a notice to proceed and the dollars are in the escrow agreement. Debt tenor matched to a heat contract that is actually signed, not to a 30-year pipe life.

**E12. Tenor mismatch is the financing barrier the organizer guide already names.** Severity: **High**.

DATA HEAT: many data centers have a 10-year planning horizon and often will not contract longer than 10 years or guarantee waste-heat availability; offtakers will not invest, and financing is harder, when quantity, quality, or duration is uncertain (`resources/text/DATA_HEAT_-_Sector_Couling_Data_Centeres_and_District_Energy_-_Market_Development_Guide_and_Appendicies_-_3MAR26.txt`, insurance-schemes section). The model’s pipe life is 30 years and the exit case is year 10. A lender amortizing 30-year pipe against a 10-year waste-heat promise is taking the renewal risk the data center has already refused. Public guarantees transfer that risk to the town. They do not remove it. The same guide says so.

Entitlement risk sits in front of tenor. Executive Order 62 (14 July 2026) holds some DEC data-center permits in abeyance for projects at or above 50 MW until a final generic environmental impact statement (https://www.governor.ny.gov/executive-order/no-62-establishing-temporary-moratorium-data-centers-new-york-while-state-develops) (verified 2026-10-03). Whether Lake Hawkeye is inside that hold is **[unverified]** (verification.md row 2b). Local law is a separate track and is moving toward a ban. Heat capex spent before a lawful entitlement is a pre-COD stranded asset: no heat, no offtake, no recovery fraction to argue about.

Fix: the proposal’s own gate — no heat-side notice to proceed before a site approval the town treats as final, with the benefit agreement attached — is the correct credit condition. Add: escrow and the replacement bond (E13) are conditions precedent, not covenants tested in year 10.

## Stranded assets

**E13. The published $5.71 million stranding figure is the floor, and only if someone else builds a new source.** Severity: **High**.

`finance.dc_exit`, year **10**: stranded **$5.71 million**, replacement source **$10.35 million**, corridor heat **+$93.2/MWh**. Fallback text: pipes and building heat pumps stay; the central source becomes an air-source or borehole plant; backup boilers cover the gap; on-site users go back to propane-equivalent or electric heat.

The finance audit rebuilt $5.71 million as straight-line remaining life on the interface, tank, on-site pipe, and on-site substations only: those direct lines × 1.35 × (20/30). Corridor pipe is outside that bucket because the story says the pipe stays. Staying has a price: the **$10.35 million** replacement, which that audit sized off a corridor source peak at **$2,000/kW**, with replacement COP **4.5** hardcoded rather than written as a yaml input. Mark COP 4.5 as ASSUMPTION. A winter air-source plant can do worse, and the $93 uplift would rise. I did not recompute the uplift on the live file; the live JSON still prints $5.71 / $10.35 / $93.2, so the dollars were carried forward even where LCOH moved.

What $5.71 million does not include, on that definition: corridor pipe **$9.39 million**, building heat pumps **$8.00 million**, laterals **$1.25 million**, before soft costs and contingency. If the replacement is never built, those assets are the next stranded bucket. ASSUMPTION: the exposure the town should bond is at least the replacement (**$10.35 million**) plus the source write-off (**$5.71 million**), about **$16 million**, posted by the applicant at close. I am not publishing a depreciated book value for the corridor pipe; the audit’s 20/30 method was for the source assets only.

On-site users “revert to propane” in the exit text. The greenhouse that is 62% of the book does not have a second source inside the $10.35 million, because that plant was sized for the corridor. The campus either keeps a propane system it was supposed to retire, or it shuts. Both are offtaker risks the heat price has to pay for up front (curtailment and backup fuel), not in year 10.

Pre-COD stranding is worse than year-10 stranding. If the ban is adopted, or the campus slips past the date greenhouses were capitalized for, there is no 10-year life to depreciate. Recovery is scrap. The lease has no renewal rights after 80 years (row 3c). Eighty years covers a 30-year model. It does not cover a project that never reaches commercial operation, and the $100 year-50 purchase option belongs to the data-center lessee, not to the co-op.

Fix: applicant bond, escrowed, equal to the replacement source, callable by the town if metered supply stops. No household conversion in the base case, so the bond is not a reason to build the corridor. It is a reason the on-site campus needs a propane or electric backup the grower pays for in the offtake. Step-in rights without a funded replacement are a clause, not collateral.

**E14. Building the town main is the stranded asset the gate already caught.** Severity: **High** if anyone overrides the gate.

Town ring: **3,577 MWh**, peak **2.96 MW**, **14.0 km**, pipe loss **1,840 MWh**, 7% LCOH **$734.2**, `passes_gate: false`. With the town included, capex **$64.34 million**. A 65°C versus 70°C sensitivity does not repair it (`extras.scenarios.town_hot_loop` prints **$734.2** in both cases). The file’s verdict: build only with grant funding or a larger anchor. The Cargill mine is named as an example and is not a passed case. Candidate town buildings are about 5–7 miles from the plant (`PLAN.md`, pointing at `research/facts-site2.md`). Distance is the cost.

Fix: write the failed gate into the covenant. A later study can reopen it. The 2026 capital plan cannot.

## Cross-cuts (covenant, equity, HDR lenses)

Judges from HDR and Grundfos will score community, ecology, and health, including human health, air, carbon, water, biodiversity, and nutrients. The economic test of those claims:

| Lens | What the money actually supports | What to stop saying |
|---|---|---|
| Community | A binding condition: on-site heat, metered, with an escrowed benefit payment and a replacement bond. Household propane and oil are the expensive fuels (model $136 and $156 per MWh). About 34% of occupied homes are on those two fuels (26% + 8%, ACS B25040). | “$735 a year for Lansing.” That delta is a 27 MWh propane house on a tariff the co-op does not earn. Gas customers (about 38%) are cheaper on the model’s $64/MWh. The corridor that would reach homes costs $286/MWh. |
| Human health / air | Combustion avoided at a signed on-site campus, if the offtake replaces propane boilers that would otherwise have been built. | “500 homes off combustion appliances.” Those homes are not connected in a bankable case. The low-income tariff at $88.5 has no eligibility list tied to a disadvantaged community. |
| Equity | The pack is the constraint: no designated disadvantaged communities nearby (Lake Hawkeye site pack, the sentence quoted above). Poverty and minority ranks in the pack are not a DAC designation. | An equity premium, a 20% low-income adoption assumption, or a comparison that treats this site as the environmental-justice case. Site 1 is the stronger equity comparison on the site-selection work; it is the weaker cost case. |
| Carbon | Real only on megawatt-hours you deliver. Delivered heat does not rise when IT load rises to 320 MW, so a larger campus does not improve this P&L or this ERF story. | Funding a negative-NPV corridor because the carbon total looks larger. |
| Water | TeraWulf’s closed loop and dry coolers are the water design. DEC renewed a withdrawal of up to **1,008,000 gallons per day** for Cayuga Operating Company LLC, effective 13 April 2026 through 30 April 2031 (verification.md row 5a, https://dec.ny.gov/sites/default/files/2026-04/cayugaoperatingwwpermit.pdf) (verified 2026-10-03). | Any dollar of “lake water saved” in the benefits case. The JSON already refuses a 1:1 claim. Heat reuse is not a consumptive-water credit. |
| Biodiversity / nutrients | A greenhouse on the former coal parcel can be a land-use story if the acreage is inside the 183-acre lease and the tenant is real. | Food tonnes and job counts as collateral. They are not pledged revenue. |

Deep Green’s 24 MW project with Board of Water & Light is in Lansing, Michigan (`PLAN.md`). It is a precedent for the sentence “heat reuse has been contracted elsewhere.” It is not a comparable for this tariff, this gap, or this town.

The covenant that matches the numbers: the town’s draft ban stays the default. A project may proceed only if (1) phase-1 heat assets are limited to users on the leased parcel, (2) the applicant escrows the community-benefit cash that covers the on-site host capital the tariff does not, (3) a take-or-pay grower is signed, (4) a replacement bond is posted, (5) the 20.9 km loop and the 14 km town main are prohibited unless a later study shows that ring’s own LCOH at or below the competitive fuel, and (6) no lake-water credit and no investment-tax-credit assumption are in the findings statement.

## Severity register

| ID | Attack | Severity | Fix in one line |
|---|---|---|---|
| E0 | Two finance books ($100.2 / +$8.68 / $22.3M in the audit versus $106.1 / −$41.45 / $26.01M in the JSON) | High | Cite only `site2.json` generated 2026-10-04 |
| E1 | ~$18.6M of capex is the corridor that costs $286/MWh | Critical | Borrow only against the on-site ring |
| E2 | Capex unit costs are assumptions; tank ~$300/m³ versus a 33–38 EUR/m³ floor | Medium | Re-quote or label ASSUMPTION; Ithaca’s $35–52M is the local cost-growth warning |
| E3 | $2.8M of boilers for 373 MWh/yr (0.73%) | Medium | Show it as the price of “zero unmet hours” |
| E4 | Host capex includes the data center’s share of the interface | Low dollars / High contract | Two-column sources and uses; OCP split is qualitative, not a 50% statute |
| E5 | Blended $106 hides $40.6 and $285.8; loses to gas $64 and air-source energy $97 | Critical | Three ring prices; never one blend |
| E6 | 4% LCOH still $89.5 against $65 collected; IT load does not move LCOH | High | Cheap capital is not a revenue strategy |
| E7 | Site 1 LCOH $305 versus steam $119 | Low | Use Site 1 to justify the site choice, not to bless the Lansing blend |
| E8 | Posted margin ~$2.8/MWh; collected margin −$41.45/MWh; NPV −$26M at every tariff in the table | Critical | One price list; stop saying $109 covers $106 |
| E9 | Higher corridor uptake prints a higher blended LCOH; 2,000 homes still fail unless pumps are gifted | Critical | No trench below 1.5 MWh/m/yr and a passing ring LCOH |
| E10 | ~62% of delivered heat is an unsigned 10 ha greenhouse; surplus land beyond 183 acres unverified | Critical | Take-or-pay before debt |
| E11 | Gap filled by % of an unbuilt campus, ITC, the town, or a $9M NYSEG program | Critical | Escrowed applicant cash; no ITC; no town guarantee |
| E12 | 10-year data-center horizon versus 30-year pipe; ban and EO 62 in front of close | High | No heat debt before entitlement; tenor matched to the contract |
| E13 | $5.71M stranding excludes corridor pipe and pumps unless $10.35M replacement is built | High | Applicant bond at close; COP 4.5 is an assumption |
| E14 | Town ring $734/MWh, gate already false, capex would go to $64M | High | Covenant prohibits the main |

## Lane status

**Done**

- Read `PLAN.md`, `research/verification.md`, `research/model-notes.md`, `research/facts-site2.md` (fuel-mix and price rows), `research/digest-organizer.md` (contract and CBS notes), live `web/public/data/site2.json` finance and extras, `web/public/data/site1.json` finance header, `web/public/data/offtakers.json` on-site loads, `docs/audit/numbers-finance.md`, and the organizer passages in the OCP heat-reuse note, the CBS white paper (thin margins), the DATA HEAT guide (10-year contracting), and the Lake Hawkeye site pack (no disadvantaged communities nearby).
- Wrote the CFO attacks on capex composition, LCOH blending, the thin posted margin versus collected revenue, uptake, financing sources, and stranding, each with a severity and a fix.
- Flagged the book split between the finance audit and the live JSON so the booth does not quote $100.2 or a positive $8.68 margin.

**Missing**

- This lane did not re-run the model. The uptake tornado’s reversed “low”/“high” labels are reported as published, not re-derived.
- No fresh catalogue quotes for pipe, tank, or heat-pump unit costs. NREL and the Danish Energy Agency technology catalogue were not opened in this pass. The 33–38 EUR/m³ floor is the JSON’s citation, not a page this lane re-fetched.
- NYSEG SC-7 was not tariff-checked. Central weekly propane and Central weekly oil remain unreadable, as verification.md already says.
- Turner & Townsend’s $6.6–13.3/W band was not re-read from the index. The $10/W midpoint stays an ASSUMPTION.
- No evidence in the repo that TeraWulf or Lake Hawkeye LLC has offered $26 million, or any other sum, for heat.
- Replacement COP 4.5 was not re-derived from `src/` (read-only constraint; the finance audit already names it as hardcoded).
- Greenhouse peak 11.22 MW versus 14.88 MW was not reconciled.

**Open questions**

- After a fresh model run, does 90% uptake still print $111.7 and 45% print $97.7, and which input does the code actually vary (pipe length, or customer count)?
- What on-site-only capex and on-site-only NPV does the same code produce if corridor lines are removed, rather than the $4.3 million surplus inferred from the blend?
- Who is the obligor if New York has no thermal-utility statute the co-op can use? Counsel item, still [unverified].
- Does any slice of a ground-loop backup (not the waste-heat network) qualify for section 48, and is census tract 36109002300 on the energy-community list? Both are [unverified] in verification.md. Neither belongs in base sources and uses.
- Is EO 62 holding Lake Hawkeye’s permits, and is the gas moratorium still in force on 4 October 2026? Both [unverified]. Either one changes when, or whether, heat debt can close.
- Is there a creditworthy grower, and is the 10-hectare footprint inside the 183-acre lease? Both open. Without them, phase 1 is a merchant campus on paper.

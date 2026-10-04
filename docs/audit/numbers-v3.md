# Numbers audit v3 — judge-facing figures vs site2.json

Audit date: 2026-10-04. Owner: `docs/audit/numbers-v3.md` only.
Model files checked: `web/public/data/site2.json` and `outputs/site2.json` (both `meta.generated` = 2026-10-04). Headline fields below are the same in both files. The app reads `web/public/data/`. A full byte-diff of the two JSON files was not run.
Compare-page Site 1 figures are from `web/public/data/site1.json` (`meta.generated` = 2026-10-04).
Formatter (`web/lib/format.ts`): `int` = `Math.round`; `dec(n, d)` = `toLocaleString` with `maximumFractionDigits: d`; `usd` = `Math.round` then a dollar sign.

On-screen values below are what those formatters emit from the bound JSON fields. This pass did not open a browser, so pixel rendering is unverified. The Explore 7% and 10% KPI figures were obtained by running the same formula as `scenario()` in `web/lib/model.ts`.

## Method

For each judge-facing number: where it appears, value shown, `site2.json` value, MATCH or MISMATCH.
MATCH (rounded) means the shown digits are `int` / `dec` of the JSON field and do not change the story.
MISMATCH means a judge can see a different number than the current JSON field.
[unverified] if it is not in the model JSON and was not re-checked against a source in this pass.

## site2.json baseline

Phases 1–2 unless noted. Town ring is `conditional: true`, `passes_gate: false`, and is excluded from `totals`.

| Field | Value |
| --- | --- |
| `supply.it_load_MW` | 150 |
| `supply.load_factor` | 0.8 |
| `supply.capture_temp_C` | 50 |
| `supply.heat_available_GWh` | 777.6 |
| `supply.heat_available_MW_avg` | 88.8 |
| `rings[onsite].annual_MWh` / `peak_MW` / `pipe_km` / `lcoh_usd_mwh_7pct` | 37,076 / 16.36 / 0.5 / 40.6 |
| `rings[corridor].homes` / `annual_MWh` / `peak_MW` / `pipe_km` / `lcoh_usd_mwh_7pct` | 500 / 13,500 / 6.84 / 20.9 / 285.8 |
| `rings[town].annual_MWh` / `peak_MW` / `pipe_km` / `lcoh_usd_mwh_7pct` / `pipe_loss_MWh` | 3,577 / 2.96 / 14.0 / 734.2 / 1,840 |
| `totals.heat_delivered_MWh` | 50,576 (= 50.576 GWh) |
| `totals.share_of_available_pct` | 6.5 |
| `totals.hp_elec_MWh` / `backup_MWh` / `unmet_hours` / `avg_cop` / `storage_m3` | 2,843 / 373 / 0 / 4.71 / 5,558 |
| `finance.capex_musd.total` / `opex_musd_yr` | 38.76 / 1.94 |
| `finance.lcoh_usd_mwh` 4% / 7% / 10% | 89.5 / 106.1 / 124.6 |
| `finance.incumbent_usd_mwh` propane / oil / gas / resistance / ASHP | 136.1 / 155.8 / 64.2 / 245.0 / 96.9 |
| `finance.tariff_usd_mwh` / `low_income_tariff_usd_mwh` | 108.9 / 88.5 |
| `finance.household` 27 MWh, vs propane / vs oil | 735.0 / 1,266.0 |
| `extras.funding.funding_gap_musd` | 26.01 |
| `extras.cba.headline_annuitized_7pct_musd_per_yr` | 2.096 |
| `extras.cba.headline_as_pct_of_dc_capex` | 1.73 |
| `extras.cba.dc_capex_musd` | 1,500 (basis string: $10M/MW × 150 MW, midpoint assumption) |
| `extras.cba.as_pct_of_dc_capex` | 2.02 (corridor-only; not the headline) |
| `impact.co2_avoided_t_yr` | 11,408 |
| `impact.co2_cars_equiv` | 2,659 |
| `extras.co2_avoided_marginal_grid_t_yr` | 10,670 |
| `impact.fossil_displaced_MWh` | 52,016 |
| `impact.homes_served` / `jobs` / `local_food_t_yr` / `fish_t_yr` / `greenhouse_ha` | 500 / 126 / 5,500 / 1,500 / 10 |
| `impact.erf` / `ere` | 0.0462 / 1.154 |
| `impact.water.fan_energy_saved_MWh` | 970 |
| `finance.dc_exit` stranded / replacement / corridor uplift | 5.71 / 10.35 / 93.2 |

`cop_compare`: air-cooled 4.73, liquid-cooled 6.0. That 6.0 is a design COP, not `totals.avg_cop` 4.71.

## Deck figures named in the task

Named deck list, checked against current JSON and against `docs/presentation-script.md` (lines 36, 157, 210), which still prints the old carbon tonne. The `.pptx` binary was not opened.

| Deck figure | JSON | App (formatter) | Docs a judge may also hold | Verdict |
| --- | --- | --- | --- | --- |
| $106/MWh | `finance.lcoh_usd_mwh.utility_7pct` = 106.1 | `LcohBars` Utility (7%) label: `int(106.1)` = **$106**. How-it-works `dec(106.1, 0)` = **$106**. Explore KPI is not this field: at a 7% slider it scales the 4% file value and shows **$108** (107.884). | README, results, proposal: **106.1**. Video spoken line: "106 dollars". | MATCH (rounded) on the 7% bar and in the written 106.1. MISMATCH on the Explore KPI at 7% ($108). |
| $41 / $286 / $734 | 40.6 / 285.8 / 734.2 | Story step 8 `RingLcoh` uses `int`: **$41 / $286 / $734**. Prose on the same step: `dec(40.6, 0)` = **$41**. | README, results, proposal: **40.6 / 285.8 / 734.2**. Video spoken: "40 dollars" for ring 1 and "734 dollars" for ring 3. | MATCH (rounded) for the deck triple vs `int()`. MISMATCH: video says **$40**, the screen says **$41**. |
| 1.7% of data-center capex | `headline_as_pct_of_dc_capex` = 1.73 | Story steps 8 and 11 and `/print`: `dec(1.73, 1)` = **1.7%**. Code uses the headline field, not `as_pct_of_dc_capex` 2.02. | README and results table: **1.73%**. Results prose also says "about 1.7 percent". Proposal: **1.73%**. Video spoken: "under two percent". | MATCH (rounded) for 1.7% vs 1.73. Exact docs MATCH 1.73. |
| 50.6 GWh | 50,576 MWh = 50.576 GWh | How-it-works: `int(50576)` = **50,576 MWh** (MATCH). Story capacity pill and `RatioBars`: `dec(50.576, 0)` = **51 GWh**. Explore "Heat delivered": `int(50.576)` = **51 GWh**. | README and results: **50,576 MWh**. Proposal: **50.6 GWh** and 50,576.0 MWh. | MATCH for 50.6 as one-decimal GWh and for 50,576 MWh. MISMATCH: story and Explore show **51 GWh**. |
| 11,456 t | `impact.co2_avoided_t_yr` = **11,408** | Story step 10, Compare, Explore, `/print`: `int(11408)` = **11,408**. Cars tile: `int(2659)` = **2,659**. | README: **11,408** MATCH. results.md table and Site 1 comparison: **11,456** MISMATCH. proposal.md lead number **11,408**, but three times adds "the raw model file prints 11,456" — that parenthetical is now false. video-script spoken line: **11,456**. presentation-script.md: **11,456**. | MISMATCH. The live app and the JSON say 11,408. The deck script, the video script, and `docs/results.md` still say 11,456. |
| $735/yr | `finance.household.savings_vs_propane_usd` = 735.0 | `/print` and the household card (propane) use the stored field: **$735**. Explore KPI recomputes `27 * (136.1 - 108.9)` = 734.4 and `usd()` shows **$734**. | README, results, proposal, video: **$735**. | MATCH for print, household card, and the written docs. MISMATCH on Explore (**$734**). |
| 778 GWh available | 777.6 | `int(777.6)` = **778** on story `RatioBars`, Explore, Compare, `/print`. | README, results, proposal: **777.6**. Video spoken **778**, stage direction **777.6**. | MATCH (rounded) for 778. Exact docs MATCH 777.6. |
| 500 homes | `rings[corridor].homes` = 500 and `impact.homes_served` = 500 | Story, print, impact tile: **500**. | README intro, results, proposal, video: **500**. | MATCH |
| 126 jobs | `impact.jobs` = 126.0 | Story impact tile and print footer: **126**. | proposal, video: **126**. results table: **126**. | MATCH. Proposal labels jobs as an assumption, not a guaranteed outcome. The JSON field itself is a plain number. |
| 5,500 t food | `impact.local_food_t_yr` = 5500.0 | Story tile and print: **5,500**. | proposal, video, results: **5,500**. | MATCH. Same assumption caveat as jobs. |
| 1,500 t fish | `impact.fish_t_yr` = 1500 | Not rendered on the impact tiles or the print sheet. Scorecard cards render `claim`, not `metric`. | proposal: **1,500 t/yr** fish, separate from 5,500 t produce. | MATCH where the proposal states it. Absent on the app, so a judge who only watches the app never sees 1,500 t fish. |

Latent string inside `hdr_scorecard` Nutrients `metric`: `"5500 t/yr fish + produce"`. That adds fish into the 5,500 t food figure. The impact screen does not print `metric`, so this is not currently on screen. If a later edit renders `metric`, it becomes a judge-facing MISMATCH with `fish_t_yr` 1,500 plus `local_food_t_yr` 5,500.

## README.md

Headline table (lines 21–36) against current JSON:

| Shown | JSON | Verdict |
| --- | --- | --- |
| 777.6 GWh/yr available | 777.6 | MATCH |
| 50,576 MWh/yr delivered, 6.5% of available | 50,576 and 6.5 | MATCH |
| On-site LCOH 40.6; corridor 285.8 | 40.6 / 285.8 | MATCH |
| Blended 89.5 / 106.1 / 124.6 | same | MATCH |
| Propane / oil 136.1 / 155.8 | same | MATCH |
| Tariff 108.9 | 108.9 | MATCH |
| Household savings 735 | 735.0 | MATCH |
| Capex 38.76 million USD | 38.76 | MATCH |
| Gap 26.0 million, about 2.1 million/yr | 26.01 and 2.096 | MATCH (rounded) |
| Gap 1.73% of 1.5 billion USD | 1.73 and `dc_capex_musd` 1500 | MATCH |
| CO2 11,408 t | 11,408 | MATCH |
| ERF 0.046 | 0.0462 | MATCH (rounded to three decimals, same as the app's `dec(erf, 3)`) |
| COP 4.71; unmet hours 0 | 4.71 / 0 | MATCH |
| "500 corridor homes", "about 15 times" | 500 homes; 777,600 / 50,576 = 15.37× | MATCH |

README does not state 126 jobs, 5,500 t food, 1,500 t fish, or $41 / $286 / $734. It points screenshots at `web/screenshots/` and says they may show an earlier model run. Those PNGs were not re-opened here. `docs/audit/ux-walkthrough.md` describes captures that still show 11,456 t. If those PNGs were not regenerated, the README gallery contradicts the table above it.

## docs/results.md

Base-case table and ring table match the JSON on heat, LCOH, tariff, savings, jobs, food, capex share, and the three ring LCOHs (40.6 / 285.8 / 734.2).

MISMATCH vs current `site2.json`:

| Shown in results.md | JSON now | Verdict |
| --- | --- | --- |
| CO2 avoided **11,456** t (and **10,718** marginal) | 11,408 and `extras.co2_avoided_marginal_grid_t_yr` **10,670** | MISMATCH. The citation path `impact.co2_avoided_t_yr` is right; the printed value is stale. |
| Fossil fuel displaced **52,842** MWh | **52,016** | MISMATCH |
| Site 1 vs Site 2 CO2 **11,456** vs **11,502** | Site 2 **11,408**. Site 1 `impact.co2_avoided_t_yr` **11,888** | MISMATCH on both columns |
| CO2 per MWh "0.353 versus 0.227" | 11,408 / 50,576 = **0.226**; 11,888 / 32,595 = **0.365**. `site1.json` `why_not_chosen` already says 0.365 vs 0.226 | MISMATCH |

MATCH (rounded) on that same Site 1 table, so it should not be rewritten by accident: heat available 107.0, delivered 32,595, customers 2,056, avg COP 5.23, capex 72.01, LCOH 7% 304.9, steam 118.7, share 30.5 vs JSON 30.47, ERF 0.134 vs 0.1343.

"About 1.7 percent" in the funding prose is the one-decimal form of 1.73. The table on the same page says 1.73. Both are consistent with the JSON.

## docs/proposal.md

MATCH to `site2.json` (exact or one-decimal rounding) for the engineering and finance block a judge will quote: 150 MW, 0.80 load factor, 777.6 GWh, 88.8 MW average, ring energies 37,076 / 13,500 / 3,577 MWh, LCOH $40.6 / $285.8 / $734.2, pipe loss 1,840 MWh and 51.4% (1,840 / 3,577 = 51.4%), 50,576 MWh and 50.6 GWh, 6.5%, capex $38.76M, opex $1.94M, LCOH $89.5 / $106.1 / $124.6, propane $136.1, oil $155.8, resistance $245, tariff $108.9, low-income $88.5, savings $735 and $1,266, gap $26.01M, annuity $2.096M, 1.73% of $1.50B, 500 homes, 126 jobs, 5,500 t produce, 1,500 t fish, storage 5,558 m3 and 129.28 MWh, backup 373 MWh and 0.73%, fan energy 970 MWh, COP 4.71, corridor density 0.65.

MISMATCH or stale parenthetical:

| Shown | JSON | Verdict |
| --- | --- | --- |
| "audited figure; the raw model file prints **11,456**" (lines 29, 339, 346, 425) | file prints **11,408** | MISMATCH. The 11,408 lead number matches. The "raw file prints 11,456" clause does not. |
| Human-health / carbon narrative **52,842** MWh fossil | **52,016** | MISMATCH |
| Marginal grid **10,718** t and **2,490** cars | 10,670 t and `co2_cars_equiv` **2,659** | MISMATCH |
| Low-income save **$1,286/yr** | no numeric field; stakeholder string says `$1286/yr`. Product of the rounded rates: 27 × (136.1 − 88.5) = **1,285.2** | MATCH to the JSON string. $1 off the product of the published rounded rates. |

Greenhouse 31,076 + aquaculture 4,500 + pool 1,500 = 37,076, which matches `rings[onsite].annual_MWh`. Those three splits are not separate fields in `site2.json`. The sum is checked; the split itself is not a JSON field.

## docs/video-script.md

Spoken line vs what the route actually renders from current JSON:

| Time | Spoken | Screen from current code + JSON | Verdict |
| --- | --- | --- | --- |
| 0:15 | **778** GWh | Story ratio graphic `int(777.6)` = **778**. Stage direction also says show **777.6**. | MATCH (rounded). Stage direction is the exact field. |
| 0:40 | Ring 1 **37** GWh at **40** dollars; **500** homes | Plan cards: `dec(37.076, 1)` = **37.1 GWh**, and step 8 shows **$41**. 500 homes MATCH. | MISMATCH on **$40** (screen is $41; JSON is 40.6). 37 GWh is a fair rounding of 37.1. |
| 1:10 | **734** dollars, **51** percent loss | RingLcoh **$734**. Loss 1,840 / 3,577 = 51.4%, spoken as 51. Stage direction quotes **$734.2** and **1,840 MWh**, which match the JSON. | MATCH (rounded) |
| 1:35 | **89** dollars at 4%, **106** at 7%, **26** million gap, **2.1** million/yr, under two percent | Default Explore discount is 4% (`discount_rate_base_pct` is absent, so `baseParams` uses 4). KPI `int(89.5)` = **$90**, not $89. At 7% the KPI scales to **107.884 → $108**, while the chart's separate "Utility (7%)" bar stays **$106**. Gap `dec(26.01, 1)` = **$26.0M**. Annuity `dec(2.096, 2)` = **$2.10M**. Capex share **1.7%**. | MISMATCH: spoken 89 vs screen $90; spoken 106 vs KPI $108. The 7% bar on the chart is $106. Gap and 1.7% MATCH (rounded). |
| 2:05 | **126** jobs, **5,500** t food, **11,456** t carbon, **735** dollars | `/print` and step 10 show **126**, **5,500**, **11,408**, **$735**. | MISMATCH on carbon only. The line sends the camera to a screen that says 11,408. |

The 1:35 stage direction says to show a tornado chart on `/explore`. `Tornado` in `web/components/viz/Charts.tsx` is not mounted by any page. The IT-load slider is on the page; a tornado chart is not.

`/compare` does not host the HDR scorecard. Step 10 on `/` does. The script's "show the HDR 7-domain scorecard on `/compare`" does not match the component map.

## web/components and web/app

`web/app/**` has no hardcoded model figures (credits only in `web/app/layout.tsx`). Figures come from JSON through `web/components/**` and `web/lib/model.ts`.

### What the app shows at the base case

| Surface | Shown | JSON | Verdict |
| --- | --- | --- | --- |
| Story step 2, Explore, Compare, print | **778** GWh available | 777.6 | MATCH (rounded) |
| Story capacity pill, RatioBars, Explore delivered | **51** GWh | 50.576 GWh | MISMATCH vs 50.6 / 50,576 |
| How-it-works delivered | **50,576** MWh | 50,576 | MATCH |
| Print ring energies `int(MWh/1000)` | **37 / 14 / 4** GWh | 37.076 / 13.5 / 3.577 | MISMATCH on corridor **14** (13.5 rounds to 14) and town **4** (3.6). On-site 37 is fair. |
| Story plan cards `dec(MWh/1000, 1)` | **37.1 / 13.5 / 3.6** GWh | 37.076 / 13.5 / 3.577 | MATCH (rounded) |
| Story peaks `dec(peak, 0)` | **16 / 7 / 3** MW | 16.36 / 6.84 / 2.96 | MATCH (rounded), easy to over-quote |
| RingLcoh | **$41 / $286 / $734** | 40.6 / 285.8 / 734.2 | MATCH (rounded) |
| LcohBars labels | co-op **$90**, utility **$106**, private **$125**, propane **$136**, oil **$156**, gas **$64**, baseboard **$245** | 89.5 / 106.1 / 124.6 / 136.1 / 155.8 / 64.2 / 245.0 | MATCH (rounded). $90 and $125 are the ones that look like different inputs. |
| Explore KPI cost, reset | **$90** per MWh | 4% file value 89.5, not the 7% 106.1 | MATCH to the 4% field. Not the deck's $106. |
| Explore KPI cost, discount slider at 7% | **$108** | utility_7pct 106.1 | MISMATCH. Client flat 30-year CRF ratio times 89.5. The Utility bar beside it still says $106. |
| Explore KPI cost, discount slider at 10% | **$128** | private_10pct 124.6 | MISMATCH vs the file. The Private bar still says $125. |
| Explore propane saving | **$734** | stored 735.0; formula 734.4 | MISMATCH vs the stored field and the deck |
| Print and household propane | **$735** | 735.0 | MATCH |
| Impact, Compare, print CO2 | **11,408** t and **2,659** cars | 11,408 and 2,659 | MATCH |
| Compare heat available | **778** vs **107** | 777.6 vs site1 107.0 | MATCH (rounded) |
| Compare community-finance cost | **$90** vs **$257** | 89.5 vs site1 `coop_4pct` 257.0 | MATCH (rounded) |
| Compare CO2 | **11,408** vs **11,888** | site2 11,408, site1 11,888 | MATCH. Do not quote results.md's 11,456 vs 11,502. |
| Compare capture COP | **6.0** vs **5.1** | liquid 6.0; site1 condenser-loop 5.13 | MATCH (rounded). This is not `totals.avg_cop` 4.71 vs 5.23. |
| Story step 8 capex | **$39M** via `int(38.76)` | 38.76 | MISMATCH. How-it-works `dec(38.76, 1)` = **$38.8M**, which matches the proposal's rounding. |
| CBA line | **1.7%** and **$2.10M**/yr | 1.73 and 2.096 | MATCH (rounded) |
| Gap callout | **$26.0M** | 26.01 | MATCH (rounded) |
| Homes / jobs / food tiles | **500 / 126 / 5,500** | 500 / 126 / 5500 | MATCH |
| Fish | not shown | 1,500 | Absent, not a contradiction |
| Sankey averages | IT **120** MW, captured **89** MW, delivered **5.8** MW | 150×0.8 = 120; `heat_available_MW_avg` 88.8; 50,576/8,760 = 5.77 | MATCH (rounded). 89 MW is 88.8 rounded. |

Hardcoded story copy that is not a `site2.json` field: "Sept 29" / "$500,000" legal reserve and moratorium year "2015" (the task's 2026-10-03 reality check states these; they are not model outputs). "Up to 69 days above 90 °F by 2050 (19 today)" is hardcoded in step 10 and is [unverified] in this pass.

## Cross-check table

| Figure | Shown to a judge | site2.json | Verdict | Where |
| --- | --- | --- | --- | --- |
| Blended LCOH at 7% | $106 on the utility bar; 106.1 in README, results, proposal; **$108** on the Explore KPI at a 7% slider | 106.1 | MATCH (rounded) except Explore KPI | `LcohBars`; `docs/results.md`; `web/lib/model.ts` `scenario()` |
| Ring LCOH | $41 / $286 / $734 on screen; 40.6 / 285.8 / 734.2 in docs; video says $40 for ring 1 | 40.6 / 285.8 / 734.2 | MATCH (rounded) except video "$40" | `RingLcoh`; `docs/video-script.md` |
| Capex share | 1.7% on screen; 1.73% in README, results, proposal | 1.73 | MATCH (rounded) | story steps 8 and 11; `/print` |
| Delivered heat | 50,576 MWh and 50.6 GWh in docs; **51 GWh** on story and Explore | 50,576 MWh | MISMATCH on the GWh pills | `steps.tsx`, `Misc.tsx` `RatioBars`, `Explore.tsx` |
| CO2 | **11,408** on the app and in README and the proposal lead; **11,456** in results, the video, and the deck script | 11,408 | MISMATCH in results, video, deck script | `docs/results.md`, `docs/video-script.md`, `docs/presentation-script.md` |
| Cars | 2,659 on the app; proposal still says 2,490 | 2,659 | MISMATCH in the proposal narrative | `docs/proposal.md` line 346 |
| Marginal CO2 | 10,718 in results and proposal | 10,670 | MISMATCH | same files; not rendered in the app |
| Fossil displaced | 52,842 in results and proposal | 52,016 | MISMATCH | same files; not an impact tile |
| Propane household save | $735 print / docs; **$734** Explore | 735.0 | MISMATCH on Explore only | `scenario()` vs `finance.household` |
| Heat available | 778 on screen; 777.6 in docs | 777.6 | MATCH (rounded) | formatters |
| Homes / jobs / food | 500 / 126 / 5,500 | 500 / 126 / 5500 | MATCH | app and docs |
| Fish | 1,500 in the proposal and the deck list; not on the app | 1,500 | MATCH in the proposal; absent in the app | `docs/proposal.md` |
| Print ring GWh | 37 / **14** / **4** | 37.076 / 13.5 / 3.577 | MISMATCH on 14 and 4 | `PrintSheet.tsx` |
| Story capex | **$39M** | 38.76 | MISMATCH | `steps.tsx` step 8 |
| 4% LCOH on screen | **$90** | 89.5 | MATCH (rounded). Video says 89. | `LcohBars`, Explore KPI, Compare |
| Site 1 CO2 next to Site 2 | app 11,888 vs 11,408; results 11,502 vs 11,456 | site2 11,408; site1 11,888 | App MATCH. results.md MISMATCH | `Compare.tsx`, `docs/results.md` |

## Mismatches that can cost Execution

A judge who watches the app, then reads the video or `docs/results.md`, hears two carbon inventories.

1. **Carbon tonne.** Say **11,408**. The app, README, and the proposal's lead sentence already do. `docs/results.md`, `docs/video-script.md`, and `docs/presentation-script.md` still say **11,456**. The proposal's "raw model prints 11,456" clause is stale: both JSON files print 11,408. Same family of stale numbers: fossil **52,842 → 52,016**, marginal **10,718 → 10,670**, cars **2,490 → 2,659**, Site 1 CO2 **11,502 → 11,888**.
2. **Do not say 51 GWh.** Delivered heat is **50,576 MWh (50.6 GWh)**. Story and Explore round 50.576 to **51**. The print sheet rounds the corridor to **14 GWh** (it is 13.5) and the town ring to **4 GWh** (it is 3.6).
3. **$106 is the 7% file value. The Explore KPI at 7% shows $108.** The chart bar labeled Utility (7%) stays $106. At 4% the screen shows **$90**, not 89. Ring 1 on screen is **$41**, not the video's $40.
4. **$735 on the print sheet, $734 on Explore.** The stored field is 735. Explore recomputes 27 × (136.1 − 108.9) = 734.4.
5. **Step 8 shows $39M capex.** The file is **$38.76M** (how-it-works shows $38.8M).

Safe to say out loud, because the screen and the file agree once rounding is acknowledged: **500 homes, 126 jobs, 5,500 t food, 1.7% (the file is 1.73%), 778 GWh available (the file is 777.6), town ring $734, gap about $26 million and about $2.1 million a year.** 1,500 t fish is in the JSON and the proposal; it is not on the app tiles.

## Lane status

- Done: `docs/audit/numbers-v3.md` created and filled. Headline fields compared in `outputs/site2.json` and `web/public/data/site2.json` (same values, generated 2026-10-04). Judge-facing bindings checked in `web/components/**`, `web/app/**`, `web/lib/format.ts`, `web/lib/model.ts`, `README.md`, `docs/results.md`, `docs/proposal.md`, `docs/video-script.md`. Named deck figures checked against those surfaces and against `docs/presentation-script.md`. Explore 7%/10% KPI and the $734 recomputation were executed from the client formula (107.884 → $108; 128.478 → $128; 734.4 → $734).
- Missing: no browser pass, so pixel layout is unverified. No byte-diff of the two `site2.json` files. The `.pptx` / PDF were not opened. Screenshot PNGs were not re-read; an older walkthrough still describes 11,456 t on those captures. Greenhouse / aquaculture / pool MWh split is not a `site2.json` field (only the 37,076 sum is). The "69 days above 90 °F" line was not sourced in this pass.
- Open questions: Were `web/screenshots/` regenerated after `co2_avoided_t_yr` moved from 11,456 to 11,408? Does the spoken deck still say eleven thousand four hundred fifty-six, as `docs/presentation-script.md` line 36 does? If yes, that single sentence contradicts the app the judges are looking at.

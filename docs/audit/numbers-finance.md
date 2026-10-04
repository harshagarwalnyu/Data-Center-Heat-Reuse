# Finance numbers audit — Site 2 (Lake Hawkeye)

Audit of `web/public/data/site2.json` finance fields against `config/finance.yaml` and `research/verification.md`. Hand-check of levelized cost of heat (LCOH) uses the capital recovery factor (CRF).

Scope: capex lines, LCOH at three discount rates, incumbent $/MWh, tariff, household savings, tornado, data-center exit. Base case is 150 MW phase 1. No federal tax credit in the base case.

Checked: 2026-10-04. Source-of-truth precedence: `research/verification.md` overrides older files. Organizer text in `resources/text/` outranks web sources.

## Method

CRF at discount rate \(r\) and life \(n\) years:

\[
\mathrm{CRF} = \frac{r(1+r)^n}{(1+r)^n - 1}
\]

When \(r = 0\), CRF = \(1/n\).

Annual capital charge = capex × CRF. LCOH ($/MWh) = (annual capital + annual opex) / annual heat delivered (MWh), unless the model states a different formula. Each line below is marked OK or WRONG after the hand check.

## Incumbent fuel $/MWh

Hand formula (same as `src/heatreuse/finance.py` `incumbents`): delivered $/MWh = (price per unit) / (kWh per unit) / appliance efficiency × 1000. Inputs from `config/finance.yaml`: propane $3.10/gal, 26.8 kWh/gal, eff 0.85; oil $5.186/gal, 40.6 kWh/gal, eff 0.82; gas $1.60/therm, 29.307 kWh/therm, eff 0.85; residential electricity $0.245/kWh.

| Fuel | Hand $/MWh | `site2.json` `finance.incumbent_usd_mwh` | Verdict |
|---|---:|---:|---|
| Propane | 3.10 / 26.8 / 0.85 × 1000 = **136.084** | 136.1 | OK (rounded to 0.1) |
| Heating oil | 5.186 / 40.6 / 0.82 × 1000 = **155.773** | 155.8 | OK |
| Natural gas | 1.60 / 29.307 / 0.85 × 1000 = **64.228** | 64.2 | OK |
| Electric resistance | 0.245 × 1000 = **245.0** | 245.0 | OK |
| Air-source heat pump | 245 / seasonal COP. JSON `extras.air_source_hp_seasonal_cop` = 2.53 → 245/2.53 = 96.84; 245/2.528 ≈ 96.91 | 96.9 | OK if seasonal COP is ~2.528 (model hourly). Energy-only; no ASHP capital. |

Propane base **$3.10/gal** matches the coordinator base (midpoint of the stated season band $2.74–$3.46). Oil **$5.186/gal** matches verification.md row 7a (Central monthly average, not a late-September weekly print) (verified 2026-10-03) https://www.nyserda.ny.gov/Energy-Prices/Home-Heating-Oil/Monthly-Average-Home-Heating-Oil-Prices.

The JSON source `nyserda_prop` points at the weekly page `https://www.nyserda.ny.gov/Energy-Prices/Home-Heating-Oil/Average-Home-Heating-Oil-Prices`. That is the wrong page for the $5.186 figure. **WRONG citation URL; the $/MWh number is OK.**

Season band is not published as incumbent cases. At the same efficiency: $2.74/gal → **120.28 $/MWh**; $3.46/gal → **151.94 $/MWh**. `extras.scenarios.propane_2.85_low_sensitivity` uses $2.85/gal → 125.11 $/MWh (2.85/26.8/0.85×1000 = 125.110), tariff 100.09, household savings 675.59. Those three fields match the formula. The $2.74 and $3.46 ends are not in the JSON.

verification.md row 7b does **not** confirm a Central propane price. It records statewide propane **$3.120** (9/21/2026) and **$3.116** (9/14/2026), and says the Central dashboard value was unreadable (verified 2026-10-03) https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/EDPPP/Energy-Prices/Weekly-Report/WeeklyEnergyandFuelsReport_20260925.pdf. The $2.74–$3.46 band is **not in verification.md**. `finance.yaml` comments cite that file for the band. Treat $3.10 as the instructed base, and the band as **[unverified]** against verification.md. $3.10 is 2.0 cents/gal under the verified statewide weekly print ($3.120).

Gas at $64.2/MWh is cheaper than blended LCOH. It is a price comparison only. verification.md row 6a: NYSEG moratorium in the Town of Lansing dates from **2015** (not 2014), still listed as vulnerable as of the 7/14/2025 gas LTP (row 6c-update); 2026 status [unverified] in that file (verified 2026-10-03) https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BE068C615-B8EE-4CB9-AF92-3153A49BE4E4%7D.

## Tariff

`discount_vs_propane` = 0.20, so tariff = 0.80 × 136.084 = **108.867**. JSON `tariff_usd_mwh` **108.9**. OK.

`low_income_discount` = 0.35 applied to the propane reference, not stacked on the 20% discount: 0.65 × 136.084 = **88.455**. JSON `low_income_tariff_usd_mwh` **88.5**. OK.

Blended corridor price (20% of homes on the low-income tier): 0.80 × 108.867 + 0.20 × 88.455 = **104.785**. JSON `extras.cba` breakeven `blend_tariff` **104.8**. OK.

On-site tariff is a flat **$50/MWh** (`onsite_tariff_usd_mwh`), not the 20% propane discount. Stakeholder line "$50/MWh vs propane $136/MWh" matches.

Tariff scenarios (`tariff_scenarios_discount` 0.15 / 0.20 / 0.25):

| Multiple | Hand tariff | JSON | Hand margin vs LCOH 100.1889 | JSON margin |
|---|---:|---:|---:|---:|
| 0.85 | 115.671 | 115.67 | 15.482 | 15.48 |
| 0.80 | 108.867 | 108.87 | 8.678 | 8.68 |
| 0.75 | 102.063 | 102.06 | 1.874 | 1.87 |

Margins match **blended** 7% LCOH, not the corridor-ring LCOH ($272.3). See LCOH section for why that margin does not mean the corridor covers its cost.

## Household savings

Typical use **27 MWh/yr** (`engineering.yaml` `corridor.mwh_per_home`, ASSUMPTION: 23.5 space + 3.5 DHW). JSON `household.typical_MWh_yr` = 27. OK.

Savings vs propane = 27 × (136.084 − 108.867) = **734.86** → JSON **735**. OK.

Savings vs oil = 27 × (155.773 − 108.867) = **1266.47** → JSON **1266**. OK.

Scenario household savings: 551.15 / 734.86 / 918.57 vs JSON 551.14 / 734.86 / 918.57. OK (0.01 rounding on the 0.85 case).

Low-income cash savings = 27 × (136.084 − 88.455) = **1286**. Stakeholder metric "$1286/yr vs propane" matches. The phrase "Extra 35% tier discount" does **not** match a stack (20% + 35%). A stack would be 0.45 × propane = $61.24/MWh and about **$2,021/yr**. The dollars are the parallel 35%-off-propane tariff. **Dollar OK; the word "Extra" overstates the tier.**

No federal credit enters these bills. Base household figures are pre-credit. OK.

## Tornado

Pending.

## Data-center exit

Pending.

## Fixes

Pending.

## Lane status

- Done: file created; audit in progress.
- Missing: all checks.
- Open questions: none yet.

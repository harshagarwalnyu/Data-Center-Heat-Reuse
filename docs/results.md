# Results

Base case for Site 2, Lake Hawkeye, Lansing NY: phases 1 and 2 (on-site campus plus corridor homes). The town-center ring is reported separately because it fails its gate. Every figure is quoted from `outputs/site2.json` (and `outputs/site1.json`, `outputs/offtakers.json`) as generated 2026-10-04. If the model is rerun, refresh from those files. Derivations are in [methodology.md](methodology.md); inputs are in [assumptions.md](assumptions.md).

## Summary

1. There is far more heat than anyone can use. The base case makes 777.6 GWh/yr available and the reuse system takes 6.5 percent of it. Heat supply is not the constraint on this project; **distance and density** are.
2. The **on-site campus is cheap**: heat at the fence costs 40.6 USD/MWh (7 percent), against 136.1 USD/MWh for propane.
3. The **corridor is uneconomic standalone**: 285.8 USD/MWh at 7 percent, against 104.8 USD/MWh blended tariff revenue and 96.9 USD/MWh for each home simply installing an air-source heat pump. We do not claim otherwise.
4. The honest answer is a **funding answer**: the whole project has a present-value gap of 26.0 million USD at 7 percent over 30 years, about 2.1 million USD per year annuitized, which is 1.73 percent of a 1.5 billion USD data-center capex benchmark. The proposal, owned by a community thermal co-op, is conditional on a binding Community Benefit Agreement that closes that gap, and on staging so that nothing is trenched before it does.

## Base-case headline numbers (outputs/site2.json)

| Metric | Value | Unit | JSON path |
|---|---|---|---|
| Heat available at capture point | 777.6 | GWh/yr | `supply.heat_available_GWh` |
| Average available power | 88.8 | MW | `supply.heat_available_MW_avg` |
| Heat delivered, phases 1-2 | 50,576 | MWh/yr | `totals.heat_delivered_MWh` |
| Share of available heat used | 6.5 | percent | `totals.share_of_available_pct` |
| Heat-pump electricity | 2,843 | MWh/yr | `totals.hp_elec_MWh` |
| Backup boiler heat | 373 | MWh/yr (0.73 percent of annual heat) | `totals.backup_MWh` |
| Share of peak-hour heat from data center | 95.3 | percent (top 88 hours) | `totals.peak_share_dc_pct` |
| Average heat-pump COP (corridor) | 4.71 | dimensionless | `totals.avg_cop` |
| Storage | 5,558 | m3 (6 h of peak) | `totals.storage_m3` |
| Capex | 38.76 | million USD | `finance.capex_musd.total` |
| Operating cost | 1.94 | million USD/yr | `finance.opex_musd_yr` |
| Revenue | 3.27 | million USD/yr | `extras.funding.revenue_musd_yr` |
| LCOH at 4 / 7 / 10 percent | 89.5 / 106.1 / 124.6 | USD/MWh delivered | `finance.lcoh_usd_mwh` |
| Tariff (0.8 x propane equivalent) | 108.9 | USD/MWh | `finance.tariff_usd_mwh` |
| Low-income tariff (0.65 x propane equivalent) | 88.5 | USD/MWh | `finance.low_income_tariff_usd_mwh` |
| Whole-project funding gap, 7 percent, 30 years | 26.01 | million USD (PV) | `extras.cba.headline_gap_musd` |
| Same, annuitized | 2.096 | million USD/yr | `extras.cba.headline_annuitized_7pct_musd_per_yr` |
| Gap as share of data-center capex benchmark | 1.73 | percent of 1,500 million USD | `extras.cba.headline_as_pct_of_dc_capex` |
| Household savings vs propane / oil (27 MWh/yr home) | 735 / 1,266 | USD/yr | `finance.household` |
| CO2 avoided | 11,408 | t CO2/yr (10,670 with marginal grid) | `impact.co2_avoided_t_yr` |
| Fossil fuel displaced | 52,016 | MWh/yr | `impact.fossil_displaced_MWh` |
| Energy reuse factor, ERF | 0.0462 | ratio | `impact.erf` |
| Energy reuse effectiveness, ERE | 1.154 | ratio (PUE 1.2) | `impact.ere` |
| Jobs / local food | 126 / 5,500 | modeled jobs (positions, not FTE-equivalent) / t per year | `impact.jobs`, `impact.local_food_t_yr` |

Blended LCOH is a MWh-weighted average dominated by the cheap on-site ring. Quote the ring figures below alongside it.

## Ring by ring

| Ring | Annual heat (MWh) | Peak (MW) | Pipe (km) | Supply temp (deg C) | LCOH at 7 percent (USD/MWh) | Status |
|---|---|---|---|---|---|---|
| 1. On-site campus (greenhouse, aquaculture, rec center and pool) | 37,076 | 16.36 | 0.5 | 45, direct heat exchange | 40.6 | Build, conditional on anchor letters of intent |
| 2. Corridor homes (500 homes, ambient loop, building heat pumps) | 13,500 | 6.84 | 20.9 | 20 loop | 285.8 | Funding-dependent; sign-up clusters first |
| 3. Town center (school campus, town buildings) | 3,577 | 2.96 | 14.0 | 65 | 734.2 | Fails gate; not in base totals |

Source: `rings` and `extras.ring_lcoh_usd_mwh` in `outputs/site2.json`.

- Linear heat density of the corridor is 0.65 MWh per metre of pipe per year (`extras.linear_heat_density_corridor_MWh_per_m`), below the 1.5 threshold we use as a gate.
- Town ring: pipe is 82 percent of the ring capex (`extras.with_town.town_pipe_share_of_ring_capex`) and the main is 14 km against a "poor" threshold of 2 km in the CBS white paper (p13, p19). If the data center captured at 65 deg C instead of 50 deg C the stream could feed the loop directly in 71 percent of hours, and LCOH only falls to 721.3 USD/MWh (`extras.scenarios.capture_65C_town`). Pipe length, not temperature, is the problem. With the town ring added, blended LCOH is 147.3 USD/MWh and capex 64.34 million USD (`extras.with_town`).

## Against the incumbents

| Heat source | USD/MWh, delivered at appliance efficiency | Note |
|---|---|---|
| Natural gas | 64.2 | Moratorium on new connections began February 2015; its 2026 status and current availability in rural Lansing are unverified |
| Air-source heat pump, seasonal COP 2.53 | 96.9 | Each home pays for its own equipment |
| Propane | 136.1 | 3.10 USD/gal |
| Heating oil | 155.8 | 5.186 USD/gal |
| Electric resistance | 245.0 | 0.245 USD/kWh |
| **Thermal Commons, on-site ring** | **40.6** | LCOH, 7 percent |
| **Thermal Commons, blended phases 1-2** | **106.1** | LCOH, 7 percent |
| **Thermal Commons, corridor ring** | **285.8** | LCOH, 7 percent |

On pure cost the corridor loses to a home air-source heat pump. The case for it is not that it is cheaper; it is that households without gas pay propane and oil volatility, that the heat is shared infrastructure rather than 500 separate retrofits, and that a data center seeking social license can pay for it. That case belongs to the Community Benefit Agreement ([ownership-deal.md](ownership-deal.md)), not to the unit economics.

## Why the corridor is uneconomic, and what closes it

Break-even scan (`extras.cba.breakeven_homes_if_cba_pays_pipe`, corridor LCOH versus the 104.8 USD/MWh blended tariff, 50 to 2,000 homes):

| Who pays what | Corridor LCOH at 2,000 homes unless noted (USD/MWh) | Break-even homes |
|---|---|---|
| Co-op pays everything (base) | 285.8 at 500 homes (ring LCOH) | not scanned |
| Community Benefit pays loop pipe and laterals | 179.6 | none up to 2,000 |
| Pays pipe, laterals and half of building heat pumps | 135.8 | none up to 2,000 |
| Pays pipe, laterals and all building heat pumps | 103.3 (at 50 homes, the break-even point, not 2,000) | 50 homes |

The binding cost is the roughly 16,000 USD in-home heat pump, not the trench. Paying for pipe alone, however large the network grows, does not close the gap. Tariff level is not the lever either: moving the tariff from 0.85 to 0.75 times propane changes the whole-project NPV only from -25.1 to -26.9 million USD (`extras.tariff_scenarios`), because the corridor shortfall is set by cost, not by price.

### The funding answer

| Item | Value | Basis |
|---|---|---|
| Whole-project PV gap (headline) | 26.01 million USD | NPV at 7 percent, 30 years, separate asset lives |
| Corridor stand-alone gap | 30.32 million USD | Memo figure; the on-site surplus of 4.3 million USD cross-subsidizes the corridor |
| Annuitized | 2.096 million USD/yr | `extras.cba` |
| Straight-line, undiscounted | 0.867 million USD/yr | Understates the true annual cost; do not quote alone |
| As share of data-center capex benchmark | 1.73 percent | 1,500 million USD = 10 million USD/MW x 150 MW (Turner & Townsend 2025, midpoint assumed) |
| With 30 percent ITC (hypothetical incentive sensitivity) | 13.28 million USD | Hypothetical only; not assumed in the base. A waste-heat network does not qualify as geothermal heat pump property under IRC 48 (research/verification.md 9d-i); other credit categories remain unverified |

The gap is what a funding stack must cover so that tariffs stay below incumbent fuels. Candidate sources, none of them committed: a Community Benefit Agreement contribution from the data center, state programs (NYSERDA clean-heat funding, a utility non-pipes alternative), and low-cost municipal capital. The 4 percent co-op LCOH of 89.5 USD/MWh against 124.6 USD/MWh at 10 percent shows how much the cost of capital alone is worth. The owner we propose is a community thermal co-op; the structure, the municipal-utility alternative and the term sheets are in [ownership-deal.md](ownership-deal.md). We present the gap as the price of a license to operate, about 1.7 percent of the data-center's own capital, not as a business that pays for itself.

## Sensitivity (tornado)

Blended LCOH at 7 percent, base 106.1 USD/MWh, one driver at a time (`finance.tornado`, `model.py:tornado`):

| Driver | Low case | High case | LCOH range (USD/MWh) |
|---|---|---|---|
| Discount rate | 4 percent | 10 percent | 89.5 to 124.6 |
| Pipe cost | 0.7 x base | 1.4 x base | 98.5 to 116.1 |
| Corridor uptake | 0.45 | 0.90 | 97.7 to 111.7 |
| Electricity price (both rates scaled) | 0.14 USD/kWh | 0.32 USD/kWh | 99.5 to 110.8 |
| Heat pump efficiency | 0.6 of Carnot | 0.4 of Carnot | 104.2 to 109.2 |
| Data-center IT load | 320 MW | 75 MW | 106.1 to 106.1 (no effect) |

Reading it:

- The discount rate is the largest bar, which is why ownership and cost of capital matter as much as engineering.
- The IT-load bar is flat because heat is oversupplied by about 15 times. Recovery fractions of 0.40, 0.75 and 0.85, and a 320 MW full build, all give the same LCOH (`extras.scenarios`). The size of the data center changes how much heat is wasted, not what the system costs.
- Uptake raises blended LCOH at higher sign-up because the metric is a weighted average and more corridor customers shift the mix toward the dearer ring. The ring-level corridor LCOH and the break-even scan are the better lens for density.
- The tornado covers six drivers. It does not cover building heat-pump cost, loop cost per metre, or frontage per home; those are the real uncertainties and are listed in [assumptions.md](assumptions.md).

Other scenarios (`extras.scenarios`): central heat pump and pumping at the residential rate gives 108.1 USD/MWh; propane at 2.85 USD/gal (a scenario assumption, not a Central NY market price) gives a propane-equivalent of 125.1 USD/MWh and still leaves households 675.6 USD/yr better off at the 0.8 tariff.

## Uncertainty

The tornado moves one input at a time. A seeded Monte Carlo (500 draws, seed 20261004, full 8,760-hour model per draw) moves seven uncertain inputs together: capture fraction, electricity price, building heat-pump cost, loop pipe cost, uptake, discount rate and propane price (triangular around the config base, uniform for the 4-10% discount rate). At 7 percent, blended LCOH is 98.1 / 106.8 / 114.7 USD/MWh (P10 / P50 / P90) against the 106.1 headline, the corridor ring is 264 / 290 / 327, the whole-project funding gap is 21.3 / 26.4 / 31.7 USD M and CO2 avoided is 10,938 / 11,396 / 11,775 t/yr. Blended LCOH stays below the propane-equivalent price in 100 percent of draws at 7 percent and 98.6 percent with the discount rate also uncertain. The discount rate drives most of the spread. Method, input ranges, monthly and seasonal detail, per-ring breakdown and load-duration statistics: [analysis-detail.md](analysis-detail.md) (`outputs/analysis_detail.json`). A bottom-up pumping check against the flat 1.5 percent pump share is in [hydraulics.md](hydraulics.md).

## What if the data center leaves (year 10)

`finance.dc_exit`: 5.71 million USD of data-center-specific capex stranded (straight-line), 10.35 million USD to replace the heat source for the corridor, and a corridor cost increase of 93.2 USD/MWh. The loop pipe and building heat pumps remain usable with an air-source or borehole plant, and backup boilers cover the transition. The Heat Supply Agreement asks for step-in rights, 24 months notice and a decommissioning bond (see [ownership-deal.md](ownership-deal.md) and [risk-matrix.md](risk-matrix.md), R04 and R08). On-site users revert to propane-equivalent or electric.

## Site 1 versus Site 2

Site 1 is 111 8th Ave, Manhattan, a legacy carrier hotel (outputs/site1.json, comparison only). Site 1 inputs are rougher than Site 2 inputs, and its base scope includes its town-center ring, so it is not scope-for-scope identical to the Site 2 base. Read it as indicative.

| Metric | Site 2 Lake Hawkeye | Site 1 111 8th Ave | Unit |
|---|---|---|---|
| IT load | 150 | 30 | MW |
| Capture temperature | 50 | 32 | deg C |
| Heat available | 777.6 | 107.0 | GWh/yr |
| Heat delivered | 50,576 | 32,595 | MWh/yr |
| Share of available heat used | 6.5 | 30.5 | percent |
| Customers | 500 homes | 2,056 apartments | |
| Average COP | 4.71 | 5.23 | |
| Capex | 38.76 | 72.01 | million USD |
| LCOH at 7 percent | 106.1 | 304.9 | USD/MWh |
| Incumbent reference | propane 136.1 | Con Ed steam 118.7 | USD/MWh |
| LCOH relative to incumbent | 0.78 x | 2.6 x | |
| CO2 avoided | 11,408 | 11,888 | t CO2/yr |
| ERF | 0.046 | 0.134 | |

Why we chose Site 2 (`site1.json` `why_not_chosen`, `research/site-selection.md`): Manhattan LCOH is 2.6 times the steam incumbent; Site 1 avoids slightly more CO2 per MWh delivered (0.365 versus 0.226 t/MWh) because steam is a fossil incumbent, so carbon does not decide it; legacy air-side cooling limits capture to about 32 deg C; Con Edison's pilot at 85 10th Ave already targets the same NYCHA buildings; and Lansing is a new build where liquid cooling can be specified from day one and where a heat agreement can change a live local decision. Site 1 has the higher ERF and the denser load, and it wins on density. It loses on cost and on the leverage to act.

## Limitations

- **Single typical year.** TMYx weather; no extreme-cold year, no outage-year Monte Carlo. Backup energy depends on one seeded outage realization.
- **Cost inputs are ours.** Most unit costs are tagged assumptions; building heat-pump and loop costs rest on a single published benchmark. A contractor quote would move the corridor number more than any other input.
- **No signed customers.** No grower, school or household has committed; the on-site load, which is 73 percent of delivered heat, is a design, not a contract.
- **Heat price of zero.** A term we propose, not one TeraWulf has accepted.
- **Simplified hydraulics.** No pipe network hydraulics, ground-temperature loop model, tank stratification or seasonal storage; pipe losses are constant W/m.
- **COP at the cap.** The central heat pump for the town ring runs at the 6.0 cap in the base, which is optimistic. The ring fails regardless.
- **Unmet hours are zero by construction** because backup is sized at 100 percent of peak. Use the peak-share and backup-share metrics to judge resilience.
- **Legal and regulatory.** Whether New York law supports a community thermal co-op for heat (formation statute, PSC jurisdiction, patronage and tax treatment) or a town-owned utility, the status of the Town Board's data-center ban draft, and eligibility of other credit categories are unverified or open. A waste-heat network is verified as ineligible for the geothermal heat pump credit (research/verification.md 9d-i). See [risk-matrix.md](risk-matrix.md).
- **Site 1 is indicative only.**

## What we would do next

1. Get contractor quotes for 500 building heat pumps and for pre-insulated pipe in rural trench; replace the two largest single-source assumptions.
2. Survey the corridor: actual lot frontage, road geometry and sign-up clusters, to replace the 25 m per home rule and the 0.70 uptake.
3. Obtain letters of intent from at least two anchor offtakers (greenhouse operator and the school district or recreation operator) and re-price the on-site tariff against them.
4. Ask TeraWulf for its cooling design and capture temperature, and test the sidestream interface against the cooling-always-wins principle with its engineers.
5. Run a multi-year weather and outage Monte Carlo and a hydraulic model, with Grundfos pump and heat-exchanger selection, for the on-site loop.
6. Draft the Community Benefit Agreement and Heat Supply Agreement terms with co-op and municipal counsel, confirm that the community thermal co-op is legally feasible in New York and keep the town-owned utility as the fallback ([ownership-deal.md](ownership-deal.md), section 2); price the funding stack against the 26.0 million USD gap.
7. Stage the build as the schedule in [proposal/12-implementation-timeline.md](proposal/12-implementation-timeline.md) states: on-site first, corridor in sign-up clusters only after a funding gate, town center not before a much larger anchor load exists (for example the salt mine, load unverified).

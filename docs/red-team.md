# Red-team pass on the numbers (2026-10-04)

Method: `uv run python -m heatreuse.verify` swings every `[assumption]` and `[unverified]` input in `assumptions.yaml` one at a time (x0.7 / x1.3, or +/-3 K for temperatures) and records gate flips and headline moves. Full table: `outputs/verify_report.md`.

## Headline result

**No single input moved +/-30% flips any ring's gate.** Ring 1 passes with a 5x margin; Ring 3 fails by about 9x. Ring 2 (homes) needs its cost of heat cut by more than half, which no one input does on its own. The conclusions survive input error; the exact numbers do not, so slides quote them as rounded figures.

## Inputs that move a headline number by more than 10%

| Input | Status | Effect | Action |
|---|---|---|---|
| `rings.corridor.home_annual_MWh` (24) | assumption | corridor LCOH +31% at 17 MWh | Check against ACS / NYSERDA rural home heating use. Bigger homes make the corridor cheaper per MWh. |
| `finance.household_MWh_yr` (24) | assumption | household savings +/-29% | Same source as above; the $750/yr figure scales with it. |
| `rings.onsite.users.greenhouse.area_ha` (12) | unverified | CO2 and jobs scale with it | Depends on the land question below. |
| `finance.unit_costs.pipe_insulated_usd_per_m` | assumption | town LCOH | Changed, see below. Town still fails. |
| `rings.town.buildings.school_campus.annual_MWh` | unverified | town LCOH | Town fails either way. |
| `finance.unit_costs.pipe_ambient_usd_per_m` | assumption | corridor LCOH +/-10% | Changed, see below. |
| `finance.discount_rates.coop_4pct` | assumption | town LCOH +10% | Presented as three financing cases already. |

## Changes made

| Change | Why | Effect |
|---|---|---|
| Pre-insulated pipe $1,500 → $1,300/m | Model sat above the $200-400/ft ($656-1,312/m) range cited in research/site-selection.md | Ring 1 $17.9 → $17.0/MWh; Ring 3 $623 → $551/MWh |
| Ambient HDPE pipe $500 → $650/m | Below the same cited range; now at its bottom | Ring 2 $194 → $210/MWh |
| Phase 2 slide wording is now computed from the gate path | With the pipe fix, the last step lands at $94.10 vs a $93.75 tariff and no longer passes | Slide now says: grants plus a cheaper build bring heat below propane for every home; funding the full 25% discount is the last step to prove |
| PLAN.md and docs/ownership-deal.md: "~1 TWh" | That is heat produced. Recoverable heat is ~781 GWh/yr (75% liquid capture) | Fan-energy formula in ownership-deal now points to the recoverable base |
| Tagged all 43 previously untagged inputs | They were invisible to the swing test (fuel prices, household MWh, fuel mix, sizing) | 81 inputs now swung |

## Checked and left as is

- **Greenhouse heat, ~220 kWh/m2/yr.** Probably low for upstate NY, but no source reachable from this environment to replace it. Low is conservative: it understates heat sold and CO2 avoided, not cost.
- **About $50,700 per corridor home all-in.** Plausible for networked heat-pump pilots; it is the reason Ring 2 is gated, and the slide says so.
- **Liquid-cooling COP 8.05 clipped to 6.** Organizer bound; both values are in site2.json.

## Still open (needs a person or network access)

1. **Land.** "~250 unleased acres" has no source in the repo. facts-site2 has a 183-acre lease; the HDR tool uses ~46 acres. The 12 ha (30 acre) campus needs confirming.
2. **Ban article date.** PLAN.md cites FingerLakes1 2026-10-02; facts-site2 cites a 2026-10-01 URL with a different slug. Open both and keep the one that resolves.
3. **Weather.** Synthetic year (3,830 HDD18 vs ~3,900 for Ithaca). Drop a TMY CSV into `data/raw/tmy_ithaca.csv` to replace it.
4. **ITC eligibility** for a waste-heat network (ownership-deal.md note). The Phase 2 path assumes 30%.

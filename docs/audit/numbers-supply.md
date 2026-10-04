# Site 2 supply numbers audit

Lane C41. File owned: `docs/audit/numbers-supply.md`.

Scope: `web/public/data/site2.json` supply block, the supply-linked totals (heat delivered, share of available, heat-pump electricity, COP), and the recovery / 320 MW scenarios. Checked against `config/engineering.yaml`, `config/impact.yaml` (ERF/ERE only), `research/verification.md`, `research/digest-organizer.md`, and `research/model-notes.md`.

## Method

Recomputed 2026-10-04 from the repo, read-only. No files under `web/`, `src/`, `config/`, or `outputs/` were edited.

Hourly heat (same formulas as `src/heatreuse/supply.py` and `src/heatreuse/heatpump.py`):

- IT(h) = min(150 MW × 0.80 × (1 + 0.03 × sin(2π(hour-of-day − 14)/24)), 150 MW)
- Heat(h) = IT(h) × 0.75 × outage mask
- Outage mask: availability target 0.99, seed 7, exponential draws, mean 22 h, minimum 2 h, whole outages added until lost hours ≥ 87.6 (`config/engineering.yaml`)
- COP = 0.50 × T_sink_K / (T_sink_K − T_source_K + 2 × 3 K), then clipped to [2, 6]
- Year length 8,760 h (non-leap). Weather for COP weights: `data/processed/weather_site2.csv` (TMYx Ithaca, dry-bulb −24.0 °C to 33.3 °C). Annual supply does not depend on weather.

Napkin identities used below:

- IT energy = 150 × 0.80 × 8,760 / 1,000 = **1,051.2 GWh/yr**
- Captured heat before outages = 1,051.2 × 0.75 = **788.4 GWh/yr** (average **90.0 MW**)
- Same product × 0.99 = **780.5 GWh/yr** (88.9 MW)

External facts below are taken from `research/verification.md` rows that already carry `(verified 2026-10-03)`. They were not re-fetched in this pass. Organizer figures are from `research/digest-organizer.md` citing `resources/text/` extracts; those extracts are not public URLs.

## Inventory of supply fields

`site2.json` → `supply`:

| Field | Published |
| --- | --- |
| it_load_MW | 150 |
| load_factor | 0.8 |
| capture_fraction | 0.75 |
| capture_temp_C | 50 |
| heat_available_GWh | 777.6 |
| heat_available_MW_avg | 88.8 |

Not in the supply block, but they change the GWh result: `diurnal_amp` 0.03, `capture_availability` 0.99, `outage_mean_h` 22, `outage_seed` 7, `pue` 1.2 (ERE only). All from `config/engineering.yaml`.

Supply-linked totals in the same file: `totals` (phases 1–2), `rings[].building_hp_cop` / `central_hp_cop`, `cop_compare`, `extras.cop_design_60C_sink`, `extras.scenarios` heat rows, `impact.erf` / `impact.ere`.

## Line-by-line audit

| Field | Value in site2.json | Recomputed | Source | Verdict | Fix |
| --- | --- | --- | --- | --- | --- |
| it_load_MW | 150 | 150 (config). Filing critical IT is 320 MW for the full project, not this field | `config/engineering.yaml` `supply.it_load_mw`. Filing: "approximately 400 MW of gross capacity, or approximately 320 MW of critical IT load" — https://www.sec.gov/Archives/edgar/data/1083301/000108330126000162/a_wulfearningsreleaseq22026.htm (verified 2026-10-03). Website phase-1 ~150 MW, basis unstated: `research/verification.md` row 3a, site named https://lakehawkeyedata.com (verified 2026-10-03) | OK as the phase-1 scenario the config and the 2026-10-03 reality check both specify | Footnote every public use: "150 MW is the website phase-1 figure; gross vs critical IT is unstated. SEC full-project figure is ~320 MW critical IT / ~400 MW gross, ops ~2029. 138 MW (Aug 2025 PR) is stale." Do not relabel 150 as the filing. |
| load_factor | 0.8 | 0.8. Diurnal ±3% averages to exactly 1 over full days, and the cap never binds (IT stays 116.4–123.6 MW). Annual mean IT = 120.0 MW. IT energy = 1,051,200 MWh exactly | `config/engineering.yaml` cites PLAN.md band 0.7–0.9. No TeraWulf operating load factor in `research/verification.md` | OK as an ASSUMPTION inside 0.7–0.9. The 0.8 operating factor is [unverified] as a measured Lake Hawkeye statistic | Keep 0.8. Say it is a planning factor, not a filing statistic. It is not the 320/400 = 0.80 IT-to-gross ratio. |
| capture_fraction | 0.75 | 0.75 | `config/engineering.yaml`: ASSUMPTION. Band used in the model: 0.40 and 0.85. Organizer: up to 85% recoverable (`research/digest-organizer.md` §2 / opening deck s7–8, T5 s11; no public URL in the digest). RII: 33–42% of consumed power as liquid-loop waste heat (same digest, RII p10 and p33). PLAN.md DLC screen ~0.7–0.8 | OK as the labeled ASSUMPTION (midpoint of 0.7–0.8). It is not a measured capture rate | Keep the point 0.75 only next to the range already in `extras.scenarios` (0.40 / 0.75 / 0.85). Digest item 5b asks for that range on the headline, not only in extras. |
| capture_temp_C | 50 | 50 (input, not a calculated output) | `config/engineering.yaml`: RII water-cooled 45–55 °C; OCP/HDR direct-liquid return 45–65 °C (`research/digest-organizer.md`). RII AI/HPC direct liquid is 55–70 °C (same digest). On-site customer temperature in the JSON is 45 °C = 50 − 2 × 3 K approach (`research/model-notes.md`) | OK inside the 45–55 °C water-cooled band | If the pitch calls the plant AI/HPC liquid, show 55 °C as a sensitivity. It does not change the town COP (already capped; see below). It does change the direct-use margin above 45 °C. |
| heat_available_GWh | 777.6 | Full formula: **777.614362101839 GWh**, which rounds to 777.6. Unrounded twin in `extras.scenarios.recovery_base_0.75` is that same float. Napkin without outages: **788.4**. Napkin at a flat 99%: **780.5** | Model output from `config/engineering.yaml`. `research/model-notes.md` rounds the same run to "778 GWh" | OK vs the model. A calculator using only the three printed factors gets 788.4 and will look 10.8 GWh high | Publish the haircut beside the headline: seeded outage year, seed 7, **120 h** lost (target was 87.6 h / ~88 h), energy kept = 98.63% of 788.4. Optional cleanup: replace the random mask with a flat 0.99 so the headline is 780.5 GWh and matches the YAML comment. |
| heat_available_MW_avg | 88.8 | 777,614.362 MWh / 8,760 h = **88.769 MW**, rounds to 88.8. Pre-outage average is 90.0 MW | Same run | OK | Same footnote as the GWh row. 88.8 is not 150 × 0.8 × 0.75. |
| Monthly supply_MWh (sum) | 777,614 MWh after integer rounding of each month | Unrounded months sum to 777,614.362 MWh. Full months at 90 MW would be 31-day 66,960 / 30-day 64,800 / February 60,480. Shortfalls: Jan 19 h, Apr 74 h, Sep 15 h, Nov 12 h. Other months match 90 MW × hours exactly | Same mask. April JSON 58,138 = round(58,137.95). November JSON 63,736 = round(63,736.41) | OK | Label those four dips as capture outages, not weather. Supply does not vary with outdoor temperature. |
| extras recovery_low_0.40 heat_available_GWh | 414.7276597876475 | 777.614362101839 × 0.40/0.75 = **414.7276597876475** | Same mask, capture scaled | OK | None. |
| extras recovery_high_0.85 heat_available_GWh | 881.2962770487509 | 777.614362101839 × 0.85/0.75 = **881.2962770487509** (last digit is float noise at 1e-13) | Organizer "up to 85% recoverable" is the scenario label, not a measured rate (`research/digest-organizer.md`) | OK | None. |
| extras dc_320MW_full_build heat_available_GWh | 1,658.91063915059 | 777.614362101839 × 320/150 = **1,658.91063915059**. Share 3.0487% = 50.576 GWh / 1,658.911 GWh | SEC critical IT ~320 MW, not 400 MW gross and not the website-only 300 MW (`research/verification.md` rows 3a, 3b, verified 2026-10-03) | OK | Keep 320 as the full-build IT case. Do not put 400 MW through this formula as if it were IT (that would be 2,073.6 GWh). |
| totals.heat_delivered_MWh | 50,576 | 37,075.755 on-site + 13,500 corridor = **50,575.755**, rounds to 50,576. Town 3,577 is excluded, matching `meta.scope` | Model demand at the configured anchors. This audit did not re-derive greenhouse/home physics; the sum identity was checked | OK as arithmetic | None for the sum. 50,576 MWh is customer heat, not DC heat drawn (next row). |
| totals.share_of_available_pct | 6.5 | 100 × 50,575.755 / 777,614.362 = **6.504%**, rounds to 6.50, JSON prints 6.5. With town: 54,152.755 / 777,614.362 = **6.964%** → JSON `with_town` 6.96 | Definition in `src/heatreuse/report.py`: customer delivered ÷ capture | OK for that definition | Do not read 6.5% as the fraction of DC heat used. DC-side draw of served heat is **48,514 MWh = 6.24%** of capture. HDR ERF is **4.62%** of IT energy (below). |
| impact.erf | 0.0462 | Reuse 48,514.50 MWh / IT 1,051,200 MWh = **0.0461515**, rounds to 0.0462. Stakeholder line "ERF 4.6%" is that figure to one decimal (4.615% → 4.6%) | HDR definition ERF = reuse / IT (`research/digest-organizer.md` on HDR deck p17–18). PUE 1.2 is an ASSUMPTION in `config/engineering.yaml` | OK | Quote 4.6% of IT, and separately ~6.2% of captured heat. They are different denominators. |
| impact.ere | 1.154 | (IT × 1.2 − 48,514.50) / IT = 1.2 − 0.0461515 = **1.15385**, rounds to 1.154 | Same HDR definition. PUE 1.2 is [unverified] for this plant (ASSUMPTION, "liquid-cooled new build") | OK given PUE 1.2 | Keep the PUE labeled as an assumption. ERE moves 0.1 if PUE moves 0.1. |
| impact water vs this heat | Fan energy saved 970 MWh. Note says no lake-water savings | 48,514.50 MWh × 0.02 kWh fan / kWh heat = **970.29 MWh**, rounds to 970. The 0.02 factor is an ASSUMPTION in `config/impact.yaml` | Closed loop is a developer claim, not a water-savings result of this heat total: https://lakehawkeyedata.com/closed-loop-cooling (verified 2026-10-03). DEC withdrawal permit is a different fact and is not converted here | OK. Heat GWh is not a lake-water volume | Do not multiply 777.6 GWh by any gal/kWh factor and call it water saved. |
| cop_compare liquid, cop_design liquid, town central_hp_cop | 6.0, 6.0, 6.0 | Uncapped screen at 60 °C sink from 50 °C source: 0.5 × 333.15 / 16 = **10.41**, clipped to 6.0. At 55 °C sink: **14.92**. At 65 °C sink: **8.05**. Town COP is **6.0 in every hour**, including −24 °C (sink hits the 65 °C cap, raw COP still 8.05) | `config/engineering.yaml` `hp.cop_max` 6.0. Organizer: CBS heat-reuse COP 3.0–6.0; T5 typical 2–5 (`research/digest-organizer.md` §2.3) | OK vs the configured cap. The 6.0 is the ceiling, not the Carnot result | Label "capped at 6.0". If a slide shows one liquid COP, say the uncapped screen is about 8–15 over the 55–65 °C curve and the model refuses to go above the organizer top of the range. T5's "2–5 typical" would clip one point lower; the file follows the CBS top (6), which the config comment states. |
| cop_design air at 60 °C from 30 °C | 4.63 | 0.5 × 333.15 / (333.15 − 303.15 + 6) = 0.5 × 333.15 / 36 = **4.627**, rounds to 4.63. Not clipped | Same formula. Air capture 30 °C is `config/engineering.yaml` `air_capture_temp_c` (legacy air band 27–40 °C in the digest) | OK | None. |
| cop_compare air 4.73 | 4.73 | Load-weighted COP of the **town** heating curve (sink 55–65 °C) with source fixed at 30 °C: **4.730**, rounds to 4.73 | `src/heatreuse/model.py` `cop_compare` | OK vs code | Label the sink. This is not the corridor building-HP COP and not the air-source incumbent (2.53). |
| rings.corridor.building_hp_cop and totals.avg_cop | 4.71 and 4.71 | Gross corridor COP = 13,500 / 2,864.75 = **4.712**. Dispatch-weighted (served heat ÷ served electricity) = 13,400.56 / 2,843.44 = **4.713**. Both round to 4.71. They match because phases 1–2 have no central HP: on-site is direct exchange (electricity 0) and the town ring is outside `totals` | Corridor source is the 18 °C ambient loop, not the 50 °C capture temperature (`config/engineering.yaml`). DHW sink 55 °C from 18 °C: raw COP **3.82**. Space heat at a 44 °C sink: **4.96**. At a 35 °C sink the raw COP is **6.70** and clips to 6 | OK | Call `avg_cop` "corridor heat-pump COP". On-site heat has no compressor, so a campus-wide COP is not 4.71. |
| extras.with_town.totals.avg_cop | 5.02 | (corridor served heat + town heat including pipe loss) / HP electricity = **5.022**, rounds to 5.02. Town electricity = (3,577 + 1,839.6) / 6.0 = **902.8 MWh** | Same cap | OK | None, once 6.0 is labeled as capped. The blend moves up only because the town piece sits on the cap. |
| totals.hp_elec_MWh | 2,843 | Corridor HP electricity served **2,843.44 MWh**, rounds to 2,843. Gross corridor HP electricity before backup is 2,864.75. With town: **3,741.93** → JSON 3,742 | Model | OK | None. |
| totals.backup_MWh / unmet_hours | 373 and 0 | Backup **373.42 MWh**, rounds to 373. With town **382.60** → 383. `unmet_hours` 0 is required by `backup.capacity_share: 1.0` (backup sized to peak), not by supply covering every hour | `config/engineering.yaml` | OK | Say the 373 MWh is the outage residue. Supply is zero for 120 h. January (19 h, high demand) backup 149 MWh; April (74 h) backup 224 MWh; September (15 h) and November (12 h) backup 0 because the 129 MWh tank covers them. |
| rings.town.central_hp_cop | 6.0 | See liquid COP row. Pipe loss 1,839.6 MWh rounds to the JSON 1,840 | 14 km × 15 W/m × 8,760 h = 1,839.6 MWh (`trunk_km` 11 + `spur_km` 3, loss 15 W/m) | OK | None on the loss arithmetic. Economics of the 14 km main are outside this lane. |
| totals.storage_m3 | 5,558 | Week series holds 129.28 MWh. Volume = 129.28 × 1,000 / (1.163 kWh/m³/K × 20 K) = **5,558 m³** | `config/engineering.yaml` storage: 6 h of peak, ΔT 20 K. 1.163 is the constant in `src/heatreuse/dispatch.py` | OK | None. |

## Physics check

**Annual energy.** First law: server heat equals IT electricity, 1,051.2 GWh/yr at 150 MW × 0.8. The model then keeps 75% (liquid-loop capture; the other 25% stays air-side or uncaptured) and drops a seeded 120 h when the sidestream is offline. Result 777.6 GWh. That is the right order for the assumption set. It is not the PLAN.md slogan "~1 TWh/yr heat at 80% load". That slogan is the IT energy (1.05 TWh) at capture fraction 1.0. Captured heat at 0.75 is 0.78 TWh. Use 777.6 GWh in the deck, or say "about 0.8 TWh captured, about 1.05 TWh of IT electricity."

**Why 777.6 is below 780.5.** `capture_availability: 0.99` is a minimum lost-hour target (87.6 h). The loop commits whole exponential outages, so this seed lands on 120 h (19 + 74 + 15 + 12). Energy removed is 10.79 GWh, which is 1.37% of 788.4, not 1%. One long April outage (74 h, about exp(−74/22) ≈ 3.5% tail of the configured mean) is doing most of it. Across the capture range 0.40–0.85 the available heat moves from 415 to 881 GWh, so a 11 GWh outage detail does not change any conclusion. It does break a napkin check.

**Diurnal term.** ±3% does not change the annual total. Peak IT 123.6 MW is under the 150 MW nameplate, so the `min()` cap is idle.

**Supply versus demand.** Phases 1–2 deliver 50.6 GWh against 778 GWh available (**about 15×** on energy). At capture 0.40 the floor is still about 46 MW in a non-outage hour, against an on-site peak near 16 MW in the winter week series. Annual supply does not bind at 0.40, 0.75, 0.85, or 320 MW: delivered GWh and LCOH in those scenarios are identical (50.576 GWh). What does bind is the outage mask. Those hours are why backup is 373 MWh and why unmet hours can still be 0.

**COP.** The approach term matches PLAN.md (η × Carnot with exchanger approach added on both sides, η = 0.5, 3 K per exchanger). For a 50 °C source and a 55–65 °C sink the lift is 5–15 K plus 6 K of approach, so the uncapped screen stays above 8 and the published liquid COP is entirely the cap at 6. That cap is the CBS top of the organizer range (3–6), not a field measurement. Corridor COPs near 4.7 are real outputs of the formula from an 18 °C loop up to roughly 35–55 °C space heat and 55 °C domestic hot water. Comparing 4.71 (water-to-water from an 18 °C loop) with 4.73 (30 °C air capture lifted onto the town curve) is a coincidence of rounding, not the same machine.

**ERF.** HDR ERF uses IT energy in the denominator, so 4.6% is consistent with delivering ~50 GWh to users while the IT load is 1,051 GWh. It will look "too small" next to a 75% capture fraction. Capture is how much could be taken; ERF is how much the rings actually take. Both can be true. Water stays out of this conversion: the closed loop is the developer's cooling design (https://lakehawkeyedata.com/closed-loop-cooling, verified 2026-10-03), and this heat total does not save the withdrawal permit 1:1.

**HDR lenses this supply block can support.** Ecology / carbon: ERF 4.6% and ERE 1.154, with PUE stated as an assumption. Ecology / water: fan electricity avoided ~970 MWh under an assumed 0.02 kWh/kWh; no gallon claim. Health / air and community show up only on the demand side (whose combustion is displaced), not in the supply GWh. Do not stretch the supply total into an equity or disadvantaged-community claim; the Lake Hawkeye pack says no designated disadvantaged communities nearby (`research/digest-organizer.md` gap note on the site pack).

## Cross-file mismatches

- **PLAN.md "~1 TWh/yr heat at 80% load"** for 150 MW is IT electricity at full conversion (1.051 TWh), not captured heat. `site2.json` is the defensible figure (777.6 GWh at capture 0.75).
- **`research/model-notes.md` "778 GWh" and "88.8 MW avg"** — the MW matches; the GWh is rounded from 777.6. Prefer 777.6, or say 778 only as a one-significant-digit round. The notes' "supply never binds" is true for annual energy and false for the 120 outage hours (backup 373 MWh).
- **`research/facts-site2.md` still says phase 1 ~138–150 MW and total 300–400 MW IT.** `research/verification.md` rows 3a/3b (verified 2026-10-03) supersede that: 138 MW is stale, 300 MW is website-only, filing is ~400 MW gross / ~320 MW critical IT. The JSON full-build case already uses 320. Good.
- **Deep Green 24 MW** is Lansing, Michigan, and was withdrawn (`research/verification.md` row 12, verified 2026-10-03). It is not a supply input to these GWh figures. No mix-up found in `site2.json` supply.
- **Liquid COP 6.0 vs an uncapped screen of ~10** is a clip, recorded in `research/model-notes.md`, and invisible in the JSON field name.

## Lane status

**Done**

- Headings created first, then filled after the recompute.
- Every `supply` field recomputed from `config/engineering.yaml` and the supply formulas.
- Monthly supply tied to four seeded outages (120 h) rather than weather.
- Recovery 0.40 / 0.75 / 0.85 and 320 MW cases match to the published floats.
- COP design points hand-checked; town COP confirmed clipped to 6.0 in every hour of the TMYx year; corridor and average COP 4.71 confirmed.
- ERF 0.0462, ERE 1.154, and fan 970 MWh confirmed against IT energy 1,051,200 MWh and reuse 48,514 MWh.
- Share 6.5% confirmed as delivered/available, and distinguished from DC-draw share 6.24% and ERF 4.6%.

**Missing**

- SEC release and lakehawkeyedata.com were not re-opened on 2026-10-04. Capacity statements rest on `research/verification.md` (verified 2026-10-03).
- Clock hours of the four outages were not listed, only the monthly lost-hour counts from the mask (Jan 19, Apr 74, Sep 15, Nov 12).
- `air_source_hp_seasonal_cop` 2.53 was not recomputed (different η, sink, and approach; not a DC supply input).
- Greenhouse and corridor demand physics were not re-derived; only their published annual MWh were added and checked against delivered totals.
- RII 33–42% and "up to 85% recoverable" were not re-read from a public URL; they are cited from `research/digest-organizer.md` and the organizer text extracts.

**Open questions**

- If the website "~150 MW" is gross in the same sense as the filing's 400 MW gross, phase-1 critical IT at 320/400 would be **120 MW**, captured heat **622 GWh**, average **71.0 MW**. ASSUMPTION: that ratio applies to a figure whose basis verification.md calls unstated. Do not switch the base case without a source that says 150 MW is gross.
- Whether the deck should print the flat-99% headline (780.5 GWh) instead of the seeded year (777.6 GWh). Conclusions do not move.
- Whether liquid COP should be shown as a range under the cap (T5 typical top 5 vs CBS top 6) rather than the single capped point 6.0.

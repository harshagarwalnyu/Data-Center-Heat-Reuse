# Demand-side number audit — Site 2 (Lake Hawkeye)

Lane C42. Audits `web/public/data/site2.json` rings, monthly series, and weeks against `research/digest-organizer.md` (RII ~1 MWth/ha), `research/facts-site2.md`, Ithaca climate, and `research/verification.md` (overrides older files). Organizer extracts in `resources/text/` outrank web sources.

Scope: greenhouse MWh/ha, homes MWh/yr, domestic hot water (DHW), peaks, seasonality shape.

Columns: **value** | **expected range** | **source** | **verdict** | **fix**.

Verdicts: OK = within expected range and consistent with cited sources. WRONG = contradicts a verified source or is internally inconsistent. GAP = cannot verify; left as [unverified] or ASSUMPTION.

Weather math below was recomputed this session from `data/processed/weather_site2.csv` (8,760 hours, `dry_bulb_C`) using the formulas in `src/heatreuse/demand.py` and the inputs in `config/engineering.yaml`. Those files were read, not edited. The hourly file is the TMYx named in `site2.json` `meta.weather`.

## Sources read

- `PLAN.md` (three rings; 150 MW base; town ring conditional; gas-moratorium affordability hook).
- `web/public/data/site2.json`: `rings`, `monthly`, `weeks`, `extras.greenhouse_check`, `finance.household`.
- `config/engineering.yaml` (demand inputs that generate those series).
- `src/heatreuse/demand.py`, `src/heatreuse/report.py` (how peaks, months, and weeks are exported).
- `research/digest-organizer.md` §3 (RII) and CBS summer/winter and pipe-loss lines.
- `resources/text/Colocating-Data-Centers_Greenhouses-RII-Virginia.txt` (quotes re-read in the extract).
- `resources/text/CBS_Data_center_white_paper_DISTRICT_HEATING.txt` (summer share; 0.5–1.5%/km).
- `research/facts-site2.md` §5 climate; `research/model-notes.md` (HDD 6,646; “310 kWh/m2”; “peak 12.5 MW”).
- `research/verification.md`: no row corrects HDD, station id, or these demand intensities.

## How to read the rings

`meta.scope` says Phases 1–2 are in the totals; the town ring is separate. Check: on-site 37,076 + corridor 13,500 = **50,576 MWh** = `totals.heat_delivered_MWh`. Town 3,577 is not in that sum. Monthly demand sums to **50,577 MWh** (1 MWh rounding). Delivered 50,203 + backup 373 = 50,576. Internal add-up is OK.

On-site 37,076 is not all greenhouse. It reconciles exactly to the config formulas:

| Piece | MWh/yr | Formula |
|---|---:|---|
| Greenhouse | 31,416 | 3.5 W/m²K × 10 ha × degree-hours base 18.5 °C, summed on the TMYx |
| Aquaculture | 4,500 | 1,500 t/yr × 3.0 kWh/kg |
| Rec pool + building | 1,160 | 600 MWh pool + 4,000 m² × 140 kWh/m² |
| Sum | 37,076 | matches `rings[onsite].annual_MWh` |

Dividing 37,076 by 10 ha (3,708 MWh/ha) overstates the greenhouse. Use 3,142 MWh/ha.

## Rings

### Greenhouse intensity (the RII check)

RII expert quote, re-read in the organizer extract: “If you put a 10-hectare greenhouse next to it, then we need 10 megawatts.” Same page: a 326 MW Virginia center “could heat 673 acres … about 2 acres/MW.” (`resources/text/Colocating-Data-Centers_Greenhouses-RII-Virginia.txt`; `research/digest-organizer.md` §3, checked against the text dump 2026-10-03). That is a **peak capacity** rule of thumb (~1 MWth/ha), not an annual MWh figure, and it is a Virginia interview quote, not an Ithaca design-day calculation.

| Item | Value | Expected range | Source | Verdict | Fix |
|---|---|---|---|---|---|
| Greenhouse area | 10 ha (`extras.greenhouse_check.area_ha`) | Phase-1 campus, not the full RII land take. 2 acres/MW × 150 MW ≈ 300 acres ≈ 121 ha, which the digest says is winter-peak sizing and must not be claimed as year-round absorption of 150 MW | digest-organizer.md §3; PLAN.md on-site ring | OK as a chosen 10 ha campus. Do not rescale the JSON to 121 ha in this audit | Keep 10 ha. State it is ~0.16 acre per DC MW, ~8% of the 2 acre/MW rule |
| Peak at ASHRAE 99.6% dry-bulb | **12.53 MW = 1.25 MWth/ha** at −17.3 °C (0.8 °F). At −17 °C: 12.43 MW | ~1.0 MWth/ha (0.8–1.2 as a band around the quote). Model-notes say “peak 12.5 MW at −17 °C … matches RII 10 ha ~ 10 MW” | facts-site2.md §5 design temp (verified 2026-10-03), https://www.nrcc.cornell.edu is the HDD source; design temp cited there as ASHRAE 169-2021 station 725270. U and setpoint: `engineering.yaml` ASSUMPTION | WRONG versus the benchmark the notes claim to match. 1.25 is 25% above 1.0. The note “matches” is false | Set `u_eff_w_m2k` to **2.79** so 10 ha hits 10 MW at −17.3 °C: U = 10e6 / (1e5 × (18.5 − (−17.3))). Then say “Ithaca design-day, calibrated to the RII quote,” or keep 3.5 and stop saying it matches 1 MWth/ha |
| Peak published in JSON | **14.88 MW = 1.49 MWth/ha** (`extras.greenhouse_check.peak_MW` 14.88; on-site ring peak 16.36) | Same ~1.0 MWth/ha quote. Design practice uses 99% or 99.6%, not the single coldest TMYx hour | `site2.json`; weather min **−24.0 °C** at hour 1086 (February) in `weather_site2.csv`. Q = 0.35 × (18.5 − T) MW | WRONG as an RII match, and it is the wrong peak to quote as “design.” 14.88/10 = 1.49, 49% above the quote. It is 19% above the 12.53 MW design-day load. Model-notes 12.5 MW is the −17 °C figure, not this export | Report two peaks: design-day 12.5 MW (or 10.0 after the U fix) and TMYx extreme 14.9 MW labeled as a single hour at −24 °C, not the sizing peak |
| Annual greenhouse energy | **31,416 MWh/yr = 3,142 MWh/ha/yr = 314 kWh/m²/yr** | No annual MWh/ha in RII. With U = 3.5 held fixed, the TMYx produces this number (degree-hours base 18.5 °C = 89,759 K·h). Model-notes “310 kWh/m²/yr” is the same result rounded. A U band 2.5–4.5 W/m²K would span ~2,200–4,000 MWh/ha [U band is ASSUMPTION; no greenhouse U source in the repo] | Computed from `weather_site2.csv` + `demand.py`. Notes: `research/model-notes.md` | OK internally (314 vs notes 310). Not independently verified against a published NY greenhouse benchmark [unverified]. If U is cut to 2.79 to hit 1 MWth/ha, annual falls to ~2,510 MWh/ha (251 kWh/m²) | Either cite 314 kWh/m² as the output of U = 3.5, or rescale with the U fix. Do not quote 310 and 1.0 MWth/ha as if both are true |
| On-site ring peak 16.36 MW | Greenhouse 14.88 + aquaculture 1.14 + rec 0.35 at the −24 °C hour = **16.36 MW** | Ring peak is the sum of users, not the RII greenhouse number | `demand.py` `onsite()`; `rings[0].peak_MW` | OK as a sum. WRONG if compared directly to “10 MW per 10 ha” | Quote `greenhouse_check`, not the ring peak, against RII |

U = 3.5 W/m²K is tagged ASSUMPTION in `engineering.yaml` (“calibrated so peak ~ 12 MW”). There is no external U citation in the repo [unverified]. Screened commercial greenhouses are often discussed in a roughly 2–6 W/m²K band; that band was not confirmed from a source this session, so it is not used as a pass/fail limit.

### Homes (corridor)

| Item | Value | Expected range | Source | Verdict | Fix |
|---|---|---|---|---|---|
| Connected homes | 500 | Task input, not a measured Lansing signup | `engineering.yaml` `corridor.homes`; `rings[1].homes` | OK as a scenario count | Label as signed homes, not town housing stock |
| Annual heat | **13,500 MWh = 27.0 MWh/home/yr** (23.5 space + 3.5 DHW) | No RECS/ResStock figure in facts-site2 or verification.md [unverified externally]. Implied envelope: 23.5 MWh / 70,619 K·h (base 15.5 °C) = **333 W/K**. A 200–500 W/K rural house on this weather file would use ~14–35 MWh space heat. 23.5 sits inside that physics band (ASSUMPTION) | `engineering.yaml` comment “[A] 23.5 space + 3.5 DHW”; arithmetic 500 × 27 = 13,500 exact | OK internally and inside a wide envelope band. The 27 MWh figure itself is ASSUMPTION, not a Lansing metered load | Keep 27 until a ResStock Zone 5A run exists. Do not present it as Census or EIA |
| Corridor peak | **6.84 MW = 13.7 kW/home** at the −24 °C hour. Full-load hours 13,500 / 6.84 = **1,974 h** | At the cited 99.6% temperature (−17.3 °C), the same shape gives ~5.46 MW space + up to ~0.30 MW DHW ≈ **11–12 kW/home**, not 13.7. Older Zone 5 houses often design in a broad ~8–20 kW band [that band is ASSUMPTION, not metered here] | Recomputed from `demand.py` `corridor()` on `weather_site2.csv`. JSON `peak_MW` 6.84 | OK as the TMYx extreme. High by ~15% if used as the ASHRAE design peak | Publish design-day peak at −17.3 °C separately from the −24 °C hour, same fix as the greenhouse |
| “Homes & farms” name vs 13,500 | 13,500 contains **homes only** | Offtaker file lists McKissick 2,500, Dutch Harvest 300, Myers Park 250 MWh, not added | `config/offtakers.yaml` vs `rings[1].name` | WRONG label. The MWh are correct for 500 homes and do not include farms | Rename to “corridor homes” or add the farm loads and recompute LHD |
| Linear heat density | **0.65 MWh/m/yr** (13,500 / (20.9 km × 1,000) = 0.646) | PLAN gate ~1.5 MWh/m/yr. Pipe length 20.9 km = 3 km trunk + (500 / 0.70) × 25 m, i.e. sized for **714** potential homes while heat is only the 500 signed | `rings[1]`; `model-notes.md`; PLAN.md | OK arithmetic. Correctly **below** the 1.5 gate. Density is diluted because the denominator uses unsigned homes | State “0.65 on the uptake-sized pipe; still under 1.5 even on signed frontage only (~0.87)” |

### Town ring (not in monthly or weeks)

| Item | Value | Expected range | Source | Verdict | Fix |
|---|---|---|---|---|---|
| Annual | **3,577 MWh** | 18,700 m² × 110 kWh/m² = 2,057 school + 140 + 180 + 1,200 = 3,577 exact | `engineering.yaml` `town`. 110 kWh/m² and the three “others” are ASSUMPTION. Town Hall boiler size 220,000 Btu/h is in `research/offtakers.md` (verified 2026-10-03); 140 MWh implies ~2,170 h on a 64.5 kW boiler, which is plausible, not a bill | OK internally. School and Woodsedge intensities [unverified] against CBECS | Keep the sum only if the slide says “assumption, floor area × intensity” |
| Peak | **2.96 MW**, full-load hours **1,208 h** | More peaky than the homes (1,974 h) because `demand.py` applies a school occupancy schedule (1.0 on weekday 06–17, else 0.45) and a July–August ×0.1 factor to the **entire** town total, including Woodsedge | `rings[2].peak_MW`; `demand.py` `town()` | OK as the code’s output. The shape is WRONG for senior housing and the library, which are not schools | Split Woodsedge onto a residential shape. Do not use 2.96 MW as a diversified building peak until that split exists |
| Pipe loss | **1,840 MWh/yr** on 14.0 km | 14,000 m × 15 W/m × 8,760 h = 1,840 MWh. CBS: a well-insulated 70–80 °C line loses **0.5–1.5% per km** (`CBS_Data_center_white_paper_DISTRICT_HEATING.txt`, digest-organizer.md; organizer extract, checked 2026-10-03) | JSON `pipe_loss_MWh` 1840 | Loss watts are OK vs the formula. At the 2.96 MW peak, 0.21 MW loss is **0.51%/km** (inside CBS, read as design-flow loss). Over the year, 1,840 / (3,577 + 1,840) = **34% of heat sent, 2.4%/km**, above 1.5%/km, because 15 W/m runs all summer on a load factor of 0.14 | Report both. Do not cite CBS 0.5–1.5%/km for the annual 51% loss-to-delivered ratio (1,840/3,577) |

### DHW

DHW is not its own field in `rings`, `monthly`, or `weeks`. It is implied by inputs that reproduce the annuals exactly.

| Item | Value | Expected range | Source | Verdict | Fix |
|---|---|---|---|---|---|
| Corridor DHW | **3.5 MWh/home/yr = 1,750 MWh** (13% of 27; 3.5% of the 50,576 MWh Phase 1–2 total) | Config comment: “~250 L/day, 45 K rise.” Sensible heat: 0.25 m³ × 45 K × 1.163 kWh/m³/K × 365 = **4.78 MWh**, not 3.5. 3.5 MWh matches ~183 L/day at 45 K, or 250 L/day at ~33 K. A loose delivered band of ~2.5–5 MWh/home is ASSUMPTION; no EIA water-heating row in the fact file [unverified] | `engineering.yaml` `dhw_mwh_per_home` | Magnitude can stay as ASSUMPTION. The comment’s 250 L × 45 K basis is WRONG (27% low) | Change the comment to the volume that equals 3.5 MWh, or set DHW to 4.8 MWh and rebuild corridor annual to 500 × 28.3 = 14,150 |
| Corridor DHW shape | Sine, amplitude ±50%, peak at hour 09, trough at hour 21 (`demand.py`) | Morning/evening DHW is the usual shape. This sine peaks once, mid-morning, not morning and evening | Code comment says “morning/evening-ish” | WRONG versus its own comment. Small in the week plot: winter diurnal swing is 2.72 MW on a 14.8 MW mean, and most of that is outdoor temperature (correlation −0.999), not DHW (~0.2 MW swing) | Use a two-peak profile if the story shows “DHW.” Do not claim the week chart demonstrates DHW timing |
| Rec DHW | 15% of building heat = 0.15 × 560 = **84 MWh/yr**, flat | Share is ASSUMPTION | `engineering.yaml` `rec.dhw_share` | OK as a labeled assumption. Too small to see in the weeks | No numeric change required for the hackathon total |
| Town DHW | **10% flat = 358 MWh/yr** (no morning peak) | Organizer Site 2 list calls out domestic hot water as its own match axis (digest-organizer.md, R1) | `town.dhw_share` 0.10 | Share is ASSUMPTION. A flat annual smear hides the DHW peak the brief asks to show | Give town DHW the same diurnal shape as corridor, at least for the school weekday |
| Summer evidence DHW exists | Summer-week minimum demand **0.538 MW** | Baseload floor at the DHW trough: aquaculture constant 0.360 + pool 0.069 + rec DHW 0.010 + corridor DHW trough 0.100 = **0.538 MW** | `weeks.summer` minimum vs `demand.py` | OK. The floor is real and matches the formula. It is aquaculture + pool + DHW, not DHW alone | Label the summer floor as “process + DHW,” not “domestic hot water” |

## Monthly

Series is on-site + corridor only (town excluded). Per-day demand follows the TMYx, coldest in January.

| Month | Demand MWh | MWh/day | Supply MWh | Backup MWh | Greenhouse MWh (computed) |
|---:|---:|---:|---:|---:|---:|
| 1 | 8,954 | 288.8 | 65,250 | 149 | 5,746 |
| 2 | 7,457 | 266.3 | 60,480 | 0 | 4,784 |
| 3 | 6,610 | 213.2 | 66,960 | 0 | 4,226 |
| 4 | 4,360 | 145.3 | 58,138 | 224 | 2,766 |
| 5 | 2,096 | 67.6 | 66,960 | 0 | 1,226 |
| 6 | 1,126 | 37.5 | 64,800 | 0 | 536 |
| 7 | 735 | 23.7 | 66,960 | 0 | 224 |
| 8 | 901 | 29.1 | 66,960 | 0 | 360 |
| 9 | 1,453 | 48.4 | 63,450 | 0 | 788 |
| 10 | 3,097 | 99.9 | 66,960 | 0 | 1,926 |
| 11 | 6,166 | 205.5 | 63,736 | 0 | 3,946 |
| 12 | 7,622 | 245.9 | 66,960 | 0 | 4,888 |

| Item | Value | Expected range | Source | Verdict | Fix |
|---|---|---|---|---|---|
| July / January | **8.2%** (735 / 8,954) | CBS: summer is 5% of winter in Helsinki, 20% in London/Madrid, up to 30% where DHW is on the network (`CBS_...txt`; digest-organizer.md). Ithaca HDD is in the cold group | `site2.json` monthly | OK. Colder than the London 20% case, a bit above Helsinki 5% because aquaculture, pool, DHW, and an 18.5 °C greenhouse setpoint still draw in July | No change. Say “July is 8% of January,” not “5% like Helsinki” |
| JJA / DJF | **11.5%** (2,762 / 24,033) | Same CBS band, using three-month blocks rather than one month | monthly sums | OK for a cold-climate mix with a non-heating floor | Same wording |
| August > July | 901 vs 735 (+23% per day) | TMYx August is cooler than July: mean 19.4 °C vs 21.9 °C, min 8.9 °C vs 10.0 °C. Greenhouse August 360 vs July 224 | `weather_site2.csv` | OK. It is the weather file, not a month-length bug | Do not “smooth” August down |
| January backup 149, April backup 224 | Backup is not a demand spike. April supply 58,138 vs 30 × 24 × 90 = 64,800 (capture shortfall). January supply is also short of 66,960 | Outage model (`capture_availability`), not the load shape | monthly supply vs 150 × 0.8 × 0.75 = 90 MW flat | OK for demand. Do not read April backup as a heating peak | Leave demand; attribute backup to the supply outage |
| Greenhouse share of January | 5,746 / 8,954 = **64%** | RII: greenhouse load is large and highly variable; a flat data center cannot be matched by one greenhouse (digest §3) | computed GH vs monthly | OK and supports the organizer mismatch point | Keep aquaculture/pool in the story so summer is not described as greenhouse-only |
| July greenhouse | 224 MWh, **3.9%** of January greenhouse | Digest: greenhouse demand is “near zero in summer” | computed | OK for the greenhouse slice. Total July demand is not near zero (baseload) | Split the sentence: greenhouse collapses in July; the campus does not |
| Annual vs long-term HDD | This file’s HDD65°F (hourly method) = **6,646 °F·day** (3,692 °C·day × 1.8). CDD65°F hourly = **655** | facts-site2.md §5: long-term normal HDD **6,990–7,120**, CDD **450–520** (verified 2026-10-03), https://www.nrcc.cornell.edu . Model-notes already say TMYx 2009–2023 is warmer than ~7,000 so heating loads are slightly low | `weather_site2.csv` vs facts-site2.md | OK if the slide cites the TMYx. Annual heating-shaped MWh are about **5–7% low** versus the long-term normal in facts-site2 (6,990/6,646 − 1 = 5.2%; 7,120/6,646 − 1 = 7.1%). CDD in the file is higher than the cited normal, which does not raise winter peaks | Footnote the 5–7% low bias. Do not quote “7,000 HDD” as the climate this JSON used |
| Station id | JSON / model: Tompkins Regional AP **725155**. facts-site2: WMO **725270** and a onebuilding URL with that id | Same airport described two ways [unverified whether 725270 and 725155 are the same record] | facts-site2.md §5 (verified 2026-10-03) vs `site2.json` meta | GAP, not a failed energy total. The 6,646 figure is the file that was actually run | One station id on the slide |

Supply side, for the match story only: January demand is 8,954 / 65,250 = 14% of that month’s captured heat; July is 1.1%. Annual Phase 1–2 demand is 6.5% of 777.6 GWh available. That is a capacity finding, not a demand-formula error. OK against PLAN (“supply still ≫ local demand”).

## Weeks

`report.py` picks the 168 hours whose **week-mean** outdoor temperature is the lowest (winter) or highest (summer). It does not pick the week that contains the annual minimum hour.

| Item | Value | Expected range | Source | Verdict | Fix |
|---|---|---|---|---|---|
| Winter week (coldest mean) | n = 168. Demand min 11.62 / mean **14.81** / max **21.34 MW**. Outdoor min **−20.6 °C** / mean −8.68 / max −2.8 °C. Correlation demand vs T = **−0.999** | A heating load should fall as temperature rises, almost linearly, in a cold week with little cooling | `weeks.winter` | OK shape | None for the correlation |
| Winter week vs annual peak | Week max **21.3 MW**. Coincident Phase 1–2 peak at −24 °C = 16.36 + 6.84 = **23.2 MW**. The −24 °C hour is in February and is **not** in this week (week minimum is −20.6 °C) | The chart a judge reads as “the winter peak” | `weeks.winter` vs ring peaks | WRONG if the week is captioned as the annual peak. It is ~8% low (21.3/23.2) | Caption: “coldest week by average temperature, not the peak hour.” Or select the week that contains hour 1086 |
| Summer week | Demand min **0.538** / mean **0.778** / max 2.54 MW. Outdoor min 14.0 / mean 23.6 / max 33.3 °C. Correlation **−0.56**. Backup 0 | Summer mean / winter mean = 0.778 / 14.81 = **5.3%**, inside the Helsinki 5% example. Max 2.54 MW is greenhouse + homes when the week hits 14 °C, which is below the 18.5 °C greenhouse setpoint and the 15.5 °C home balance point | `weeks.summer`; CBS 5/20/30% | OK | Say the summer peak in this week is a cool night, not a DHW spike |
| Summer diurnal | Hours 02–05 average ~1.2 MW; evening ~0.55 MW; amplitude 0.77 MW | DHW sine only moves corridor DHW by ~0.2 MW. The larger night bump is the greenhouse (setpoint 18.5 °C, summer-week minimum 14 °C) | week averages by hour-of-day | OK physically. Easy to misread as DHW | Annotate night heat as greenhouse setpoint, not domestic hot water |
| Winter backup | 9 hours, **149 MWh**, equal to January’s monthly backup | Same outage falling inside this cold week | weeks vs monthly | OK | Do not treat those 9 hours as unmet demand from an undersized pipe |
| Storage trace | Not scored. Early winter hours sit at 129.28 MWh while demand is ~15 MW | Supply average is ~89–90 MW, so a 15 MW week does not need the tank | `weeks.winter` | OK that the tank stays full. Not evidence the tank is unused in the −24 °C hour, because that hour is outside the week | No demand fix |

## Cross-checks (intensity, homes, DHW, peaks, seasonality)

1. **Greenhouse MWth/ha is the failed check.** Design-day 1.25 and TMYx-extreme 1.49 against RII ~1.0. Annual 3,142 MWh/ha is the consistent partner of U = 3.5, not an independent measurement. Model-notes “matches RII” should not be repeated.
2. **Homes 27 MWh/yr and corridor 13,500 MWh are internally exact** and inside a wide W/K band. They are still ASSUMPTION. The ring title “homes & farms” is false for this total.
3. **DHW 3.5 MWh/home does not match the 250 L × 45 K comment (4.8 MWh).** On the week charts DHW is a small ripple under greenhouse weather response. Summer minimum 0.538 MW does confirm the baseload term.
4. **Peaks in the JSON are the −24 °C TMYx hour**, colder than the −17.3 °C 99.6% design temperature in facts-site2. Using them as design peaks overstates greenhouse load by ~19% and home peak kW by ~15% relative to that design day.
5. **Seasonality shape is right for Ithaca’s TMYx:** January highest, July lowest, August above July because August is cooler in this file, July/January 8%, summer-week/winter-week 5%. Heating loads are ~5–7% low versus the long-term HDD normal in facts-site2. The winter week is not the peak week.

## Lane status

- Done: rings (on-site split, greenhouse MWh/ha and MWth/ha, homes 27 MWh, corridor peak kW, LHD, town annual/peak/loss), DHW physics vs the config comment, monthly add-up and July/January and JJA/DJF shape, August>July vs the TMYx, winter/summer week stats, peak-hour vs coldest-week mismatch, HDD 6,646 vs facts-site2 6,990–7,120.
- Missing: no external check of 27 MWh/home or 3.5 MWh DHW against EIA RECS or ResStock [unverified]. No published NY greenhouse kWh/m² source in the repo [unverified]. Greenhouse U = 3.5 W/m²K has no citation. School 110 kWh/m² and Woodsedge 1,200 MWh not checked against bills. Did not re-open the NRCC HDD page or the ASHRAE viewer this session; those figures are used as stamped in facts-site2.md. Station 725155 vs 725270 not resolved. Food processing, named in PLAN.md’s on-site ring, has no load in `site2.json`.
- Open questions: Should design peak be the ASHRAE 99.6% hour (−17.3 °C → 1.25 MWth/ha at current U) or the RII quote (1.0 MWth/ha, which needs U ≈ 2.79)? Should the winter-week picker be changed so the chart includes −24 °C? Is 725270 the same series as the 725155 file that was run? Should corridor farms (McKissick and others) be added, which would raise 13,500 MWh and the 0.65 MWh/m density?

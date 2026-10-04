# Technical red team — hostile Grundfos hydraulics review

Reviewer stance: hostile Grundfos hydraulics engineer, looking only at temperatures, delta-T, pumping, pipe size, heat-pump size, and storage for the Thermal Commons co-op at Lake Hawkeye (Site 2, Lansing NY). Site 1 (111 8th Ave) is not reviewed here.

Severity: **Critical** (a judge who checks the arithmetic will throw out a headline), **High** (the design works only under an unstated assumption), **Medium** (real, and bounded), **Low** (edge case).

Numbers below are either printed by the model (`web/public/data/site2.json`, generated 2026-10-04; `config/engineering.yaml`; `config/finance.yaml`) or recomputed from those inputs and labeled **ASSUMPTION**. Recomputed figures are screens, not a pump or pipe selection. No catalog curve was run.

## Sources read

- `PLAN.md` (brief, 150 MW base, dry coolers, town-center distance, gas moratorium)
- `research/verification.md` (cooling claim, moratorium, load)
- `research/model-notes.md` (how the rings were built)
- `web/public/data/site2.json` (the numbers a judge will see)
- `config/engineering.yaml`, `config/finance.yaml`
- `docs/cooling-integration.md` (capture point, COP tables, fouling trip)
- `src/heatreuse/demand.py`, `heatpump.py`, `dispatch.py`, `finance.py` (read only)
- Organizer text: Grundfos district-energy guide 2018, Topic 5 heat-reuse deck, Heat Reuse 101, Lake Hawkeye site pack

## What the model actually computes

The hourly engine tracks megawatts. It does not track flow, velocity, head, or tank temperature.

| Quantity | Where it is set | Hydraulic content |
|---|---|---|
| Capture temperature | `supply.capture_temp_c: 50`, one number for every hour | No dry-cooler setpoint, no outdoor-air dependence |
| On-site delivery | `demand.py` sets heat-pump electricity to zero and COP to infinity | No test that 50 °C can make 45 °C |
| Corridor | Building heat pumps see a fixed 18 °C source | No loop delta-T, no trunk diameter |
| Town | Central heat pump, 14.0 km, reported and then excluded | Heat loss is modeled; friction head is not |
| Pumps | `network.pump_share: 0.015` times customer heat | Not Q × H / efficiency |
| Pump dollars | `pump_plant_usd_kw: 40` times peak thermal MW | Thermal kilowatts, not motor kilowatts |
| Storage | 6 h × peak source draw, water at 1.163 kWh/m³/K, delta-T 20 K | Energy bin. Temperature of that energy is not a state variable |
| Pipe | Kilometres and a W/m heat-loss factor | No DN, no velocity |

Printed base case (phases 1–2; town excluded), `site2.json`:

- IT 150 MW, load factor 0.8, capture fraction 0.75, capture 50 °C, heat available 777.6 GWh/yr (88.8 MW average).
- On-site: 37,076 MWh/yr, peak 16.36 MW, supply 45 °C, 0.5 km, `direct_heat_exchange: true`, LCOH $40.6/MWh.
- Corridor: 500 homes, 13,500 MWh/yr, peak 6.84 MW, supply 20 °C, 20.9 km, building-HP COP 4.71, LCOH $285.8/MWh, linear heat density 0.65 MWh/m.
- Town (conditional): 3,577 MWh/yr, peak 2.96 MW, supply 65 °C, 14.0 km, pipe loss 1,840 MWh/yr, central HP COP 6.0, LCOH $734.2/MWh, `passes_gate: false`.
- Totals: heat delivered 50,576 MWh, heat-pump electricity 2,843 MWh, backup 373 MWh, average COP 4.71, storage 5,558 m³. Unmet hours are 0 because backup boilers are sized to 100% of peak.

## A1 — On-site 45 °C “direct” fails the model’s own approach test

**Severity: Critical.**

**Evidence.**

`research/model-notes.md` states the on-site ring is “direct HX at 45 C (DLC 50 C capture minus 2 x 3 K approach).” 50 − 2×3 = **44 °C**. The setpoint printed in `site2.json` is **45 °C**. The note’s own subtraction does not clear the setpoint.

`src/heatreuse/demand.py` uses that two-approach test for the town ring only:

`direct = (capture_temp_c - 2 * approach_k) >= sink`

With `approach_k: 3`, a 45 °C sink fails (44 ≥ 45 is false). The on-site function never runs the test. It sets heat-pump electricity to an array of zeros.

The budget still buys customer substations: `substation_usd_kw: 100` times the on-site peak is the $1.64M line “On-site customer substations” in `site2.json`. A substation is a second plate. Two plates are exactly the 2×3 K the town test uses. One plate at the fence (the cooling note’s “direct” rule, source − 3 K) would leave about 47 °C, a 2 K margin over 45 °C. The capex line is the second plate, and that margin is gone.

`docs/cooling-integration.md` already separates the two plants:

- Published TeraWulf plant: rear-door chilled water, then 30–35% propylene glycol to dry coolers. Loop temperature is not published. Organizer bands for that architecture are about 27–28 °C (Heat Reuse 101) and about 25–35 °C (Topic 5). The cooling note’s conservative column is **30 °C**.
- 50 °C is a covenant case (warm direct-to-chip, ASHRAE W40/W45), not the cooling page as written.

Developer cooling claims, cited in that note (verified 2026-10-03): https://www.lakehawkeyedata.com/closed-loop-cooling and https://www.lakehawkeyedata.com/faq. `research/verification.md` row 4a confirms the sealed loop and dry coolers; it records the glycol as “food-grade, non-toxic” and does not treat the propylene percentage as proven on the closed-loop page. The FAQ percentage is the cooling note’s reading of the FAQ. Treat 30–35% propylene glycol as a developer statement, not as a measured viscosity.

Fouling closes the remaining gap. The cooling note’s trip assumption is “3 K over clean.” Clean approach 3 K, trip at 6 K. 50 − 6 = 44 °C, which is the same miss. A 45 °C direct promise dies at the fouling setpoint the cooling note already proposes.

On-site pipe loss does not save this. 0.5 km at 15 W/m is 7.5 kW (`engineering.yaml`). Against the flow in A2, that is a few hundredths of a kelvin. The miss is the plates, not the trench.

Rec-center domestic hot water sits inside the same zero-electricity ring. Corridor DHW is an explicit 55 °C sink with a heat pump (`corridor.dhw_temp_c: 55`). On-site supply is 45 °C. Rec DHW is 15% of 4,000 m² × 140 kWh/m² = **84 MWh/yr**, plus whatever showers the pool adds (pool heat itself, 600 MWh/yr, can be mixed down). Any storage or code temperature above 45 °C for that DHW is **[unverified]** here. The model delivers it with no booster.

**Fix.** Run the town direct-test on the on-site ring, and count every plate the capex buys. Publish two columns: published plant at 30 °C (heat pump required for a 45 °C coil) and covenant plant at 50 °C. For the covenant column, set the coil setpoint to 40 °C so one fouled plate still works, or raise the captured return until `capture − 2×approach ≥ setpoint`. Put a small booster only on rec DHW. Stop printing `direct_heat_exchange: true` until that inequality holds.

## A2 — Delta-T is defined for the tank and nowhere else

**Severity: High.**

**Evidence.**

The only delta-T in `engineering.yaml` is `storage.delta_t_k: 20` (comment: 50/30 °C source-side store). Distribution delta-T is absent. `corridor.loop_temp_c: 18` and `supply_temp_c: 20` are both source labels. They are not a 2 K supply/return pair, and they must not be read as one. A reader who does that will invent an absurd flow. The code never computes flow at all.

Grundfos district-energy application guide (2018), `resources/text/district-energy-application-guide-district-energy-2018-master-en.txt` (verified 2026-10-03): contemporary district heating is illustrated at about 75/35 °C, low-temperature systems at 60/30 °C or 55/25 °C. The same chapter states that delta-T drives pipe size and, through the affinity laws, pump power (halving flow is shown cutting power to about 12.5% at half speed). The model’s pump electricity does not change if delta-T changes.

**ASSUMPTION screens**, using the code constant `KWH_PER_M3_K = 1.163` in `dispatch.py` (water) and the printed peaks. Velocity 1.5 m/s is a screen, not a Grundfos limit (**[unverified]** as a vendor rule).

| Stream | Heat the pipe must carry | Delta-T used | Flow | Internal diameter at 1.5 m/s |
|---|---|---|---|---|
| On-site peak 16.36 MW | 16.36 MW (customer peak; pipe loss 0.0075 MW) | 20 K (the tank’s delta-T, applied here only as a screen) | 703 m³/h (0.195 m³/s) | 0.41 m |
| Same peak | same | 10 K (tighter coil; not in the config) | 1,410 m³/h | 0.58 m |
| Corridor source at the printed peak | 6.84 MW customer at the design COP in A5 (3.82) leaves about 5.2 MW on the water plus 0.13 MW pipe loss | 8 K screen | 560 m³/h (0.15 m³/s) on the trunk | 0.36 m |
| Same corridor trunk | same | 5 K screen | 0.25 m³/s | 0.46 m |

Glycol correction on the data-center side of the plate is **[unverified]**. Specific heat and viscosity of 30–35% propylene glycol are not in the repo. The utility-side tank constant 1.163 is a water constant. It does not size the slipstream pump, which `docs/cooling-integration.md` assigns to TeraWulf and which this model omits.

**Fix.** Print one design delta-T per ring (on-site coil, corridor trunk, town main) and the resulting m³/h. Keep 20 K on the tank only if A6’s temperature cutoff still holds. Add a glycol note on the primary side of the plate: utility water and condenser glycol are different fluids (`docs/cooling-integration.md` already says this) and they need different pump curves.

## A3 — Pumping is a 1.5% opex factor on thermal kilowatts

**Severity: Critical** for a Grundfos reviewer. The energy balance can still close. The pump is not designed.

**Evidence.**

`engineering.yaml`: `pump_share: 0.015`, comment “circulation electricity as share of delivered heat.” `finance.py` applies it as `pump = pump_share * customer_MWh` and prices the electricity at the industrial rate. On 50,576 MWh delivered that is **759 MWh/yr**. It is not inside `totals.hp_elec_MWh` (2,843). Headline COP 4.71 does not include it.

Capex line “Circulation pumps + plant” is $0.93M. The formula is `G.max() * 1000 * pump_plant_usd_kw` with `pump_plant_usd_kw: 40`. That multiplies **peak heat** (customer plus pipe loss) by $40/kW. It is not motor kW, head, or a duty point. There is no NPSH, no VFD, no spare pump, and no viscosity correction.

Topic 5 (`resources/text/Topic_5_-_Heat_reuse,_Connecting_DC_to_DE_systems_v5.txt`, verified 2026-10-03) treats hydraulics as part of the heat-pump plant: the UK campus example on that deck uses shunt pumps and a booster to hit supply temperature, and it quotes pump efficiency of 86% on that project. This model has no shunt, no booster, and no efficiency.

Affinity, same Grundfos guide: power moves with the cube of speed, and speed moves with flow. Halving delta-T doubles flow. In a pipe that was not upsized, power goes up by about eight times. `pump_share` stays 0.015 in every scenario, including the IT-load tornado (75 MW and 320 MW both leave LCOH at $106.1/MWh because demand, not supply, binds). The pump factor is equally blind.

**ASSUMPTION friction screen** for the town main only, to show what a head looks like. Friction factor 0.02, internal diameter equal to the nominal bore, supply plus return = 28 km, heat about 3.2 MW (2.96 MW peak + 0.21 MW from 14 km × 15 W/m). These are screens.

| Nominal bore | Delta-T | Velocity | Friction head, supply + return |
|---|---|---|---|
| DN200 | 30 K (the 70/40 comment in `engineering.yaml` under town loss) | about 0.8 m/s | about 90 m |
| DN150 | 30 K | about 1.4 m/s | about 390 m |

A 90 m main is a transmission pump with a duty point. A 390 m main is the wrong diameter. Neither duty point exists in the model. The town ring is already outside the base case (`passes_gate: false`). The base-case pumps have the same hole at a shorter length: on-site head on 0.5 km is small once the pipe is actually DN400-class; the corridor trunk (3.0 km in the config, plus laterals) is where an undersized bore would dominate the 759 MWh.

**Fix.** Replace `pump_share` with one duty point per loop: flow from A2, friction plus static head, wire-to-water efficiency, motor kW, and N+1. Price `pump_plant` on motor kW. Keep the 1.5% figure only as a checked result. For the town main, do not spend the effort: the gate already fails. If a grant revives it, the DN150–200 comment in `finance.yaml` (`trunk_usd_m` note) has to be re-run at the real delta-T before anyone buys pumps.

## A4 — Pipe length is real; pipe diameter is a comment

**Severity: High** on the on-site campus pipe and the corridor trunk. **High** on the town main, and already decided by the economic gate.

**Evidence.**

- On-site: 0.5 km at `onsite_pipe_usd_m: 900` → $0.45M, “ASSUMPTION pre-insulated rural pipe.” A2 says the peak wants roughly a 0.4 m bore at 20 K or a 0.6 m bore at 10 K. Whether $900/m buys that bore is **[unverified]**. The model cannot say, because it has no DN.
- Corridor: `trunk_km: 3.0` plus `homes/uptake * 25 m` = 500/0.70 × 25 m + 3 km = **20.9 km**, matching `site2.json`. Unit price `loop_pipe_usd_m: 450` on every metre, trunk and frontage alike. Linear heat density 13,500 MWh / 20,900 m = **0.65 MWh/m**, matching the JSON, and below the 1.5 MWh/m gate in `PLAN.md`. Laterals at 13.7 kW per home are small pipes. The 3 km trunk is not. One unit price hides that split. CBS, as already used in `site2.json` `extras.cbs_checks`: connection cost share rises from 3% to 50% between 50 m and 4 km, and distance above 2 km is rated poor. The corridor trunk is 3 km. The town main is 14 km.
- Town: `trunk_km: 11` + `spur_km: 3` = 14 km. Loss 15 W/m × 14,000 m × 8,760 h = **1,840 MWh**, matching `pipe_loss_MWh`. The loss factor’s own comment says “DN100-150 … 70/40 C” while `finance.yaml` prices `trunk_usd_m` as “DN150-200.” Two different diameters, neither calculated. Heat loss being right does not mean the bore is right. A3 is the head check those comments skipped.
- On-site heat loss at 15 W/m is the right order for a short run. It is not a diameter.

**Fix.** Three pipe classes, three prices: on-site transmission bore from A2, corridor trunk versus 25 m laterals, town left failed. Publish DN, velocity, and head next to kilometres. Until that table exists, the $0.45M and $9.39M pipe lines are allowances, not a network.

## A5 — Heat pumps are an electricity calculator clipped at COP 6

**Severity: High.** The town COP of 6.0 is the clip, sitting on a 50 °C source the published plant has not earned.

**Evidence.**

`heatpump.py`:

`COP = clip(0.5 × T_sink_K / (T_sink_K − T_source_K + 2×approach), 2, 6)`

`cop_max: 6.0` matches the organizer band cited in `engineering.yaml` (digest and Topic 5). Topic 5 speaker notes say **COP 2–5 typical** (verified 2026-10-03, same file). The realized campus point on that deck is evaporator 25–16 °C, condenser 60–75 °C, **COP about 2.95**, supply up to 75 °C. `docs/cooling-integration.md` tells the hourly model to cap planning COP at 5 and to use the extra approach when the heat pump sits downstream of the demarcation plate. The code caps at 6 and adds 2×approach once.

Worked from that function (approach 3 K, eta 0.5):

| Duty | Sink | Source | Unclipped COP | What the code stores |
|---|---|---|---|---|
| Corridor space, outdoor −20 °C (weather curve hits its 55 °C cap; `space_sink` slope 0.6, t_ref 15) | 55 °C | 18 °C loop | **3.82** | 3.82 |
| Corridor DHW | 55 °C | 18 °C | **3.82** | 3.82 |
| Corridor, mild hour (curve near 35–38 °C) | ~38 °C | 18 °C | ~6.0 | clipped at 6 |
| Town, cold hour (sink curve clips at 65 °C) | 65 °C | 50 °C capture | **8.1** | **6.0** |
| Town, same sink, published-plant source | 65 °C | 30 °C | **4.1** | 4.1 |
| On-site, if 30 °C had to make 45 °C | 45 °C | 30 °C | 7.6 | clipped at 6, and today the code uses 0 electricity instead |

`site2.json` `building_hp_cop: 4.71` and `totals.avg_cop: 4.71` are annual heat divided by annual compressor electricity. They are not the design-point COP. At the cold hour the same function is about **3.8**, not 4.7. Delivered heat in the simulator does not fall when COP falls: electricity is `demand / COP`, and capacity is unlimited. No nameplate kW, no source-side flow per house, no capacity derate at high lift.

500 homes × $16,000 = the $8.0M line. Peak 6.84 MW / 500 = **13.7 kW** average at the coincident peak. That is a size class, not a selected water-to-water unit. Performance at 18 °C source and 55 °C sink is **[unverified]** against a Grundfos (or any) catalog.

Town central heat pump is excluded from base totals. When the scenario is turned on, `central_hp_cop: 6.0` is the ceiling, and `model-notes.md` already says the 70 °C sensitivity is moot because both cases clip. `extras.scenarios.capture_65C_town` shows the unclipped behavior only after capture is raised to 65 °C (average COP about 11.5 before any honest cap). Do not quote 6.0 as a machine COP.

On-site at a real 30 °C source, using the cap of 6 as an upper bound on efficiency: 37,076 MWh / 6 ≈ **6,200 MWh/yr** of compressor electricity that the base case sets to zero. At COP 5 (the cooling note’s planning cap) it is about 7,400 MWh/yr. On-site LCOH $40.6/MWh is the direct-heat number.

`cop_compare` in the JSON (air-cooled 30 °C → COP 4.73, liquid 50 °C → COP 6.0) is this same function at a 60 °C sink (`model.py`). The liquid bar is the clip.

**Fix.** Size every heat pump at the design outdoor hour (corridor: about 3.8, not 4.71). State nameplate kWth and the source flow. Cap the reported COP at 5 wherever the cooling note does, and label 6.0 as “clipped, not selected” if the cap stays. Give the on-site ring a heat pump in the 30 °C column. Keep the town heat pump out of the base case.

## A6 — The 5,558 m³ tank books 20 K that a 45 °C user cannot use

**Severity: Critical** if on-site heat is direct. **High** as an outage story even after a heat pump is added.

**Evidence.**

`dispatch.py`: capacity = `hours_of_peak (6) × peak source draw`. Volume = capacity × 1000 / (1.163 × 20). Printed results: **5,558 m³** and winter-week state of charge pinned at **129.28 MWh**. Check: 5,558 × 1.163 × 20 / 1000 = **129.3 MWh**. The arithmetic matches. Peak source draw is 129.28 / 6 ≈ **21.5 MW**, which also matches the $2.59M interface line at $120 per thermal kW (21.5 MW × $120/kW ≈ $2.6M).

`model-notes.md`: “tank thermal stratification ignored.” Discharge subtracts megawatt-hours. It does not cool a top temperature.

**ASSUMPTION, same water constant.** A direct plate into a 45 °C coil with 3 K approach needs source water at or above 48 °C. A tank that starts at 50 °C and is mixed (the code has no layers) has **2 K** of usable drop, not 20 K.

5,558 × 1.163 × 2 / 1000 = **12.9 MWh** usable for direct 45 °C service, against **129 MWh** booked. The other 18 K is real energy only for a load that can accept water sliding toward 30 °C (the corridor’s 18 °C loop) or for a heat pump that lifts it. The dispatch has one pool for every ring, so it will serve the greenhouse from energy that is no longer hot enough.

The winter week in `site2.json` shows how the tank is actually used:

- Hours 0–76: storage stays at 129.28 MWh while demand moves between about 12 and 16 MW. Supply exceeds demand, the tank is full, and it does not cycle.
- Hours 77–86: it drains to empty across roughly 10 hours at about 13 MW.
- Hours 87–95: delivered heat is 0 and backup carries the full demand (about 11–19 MW) while outdoor air is still about −6 to −18 °C.
- Hours 96–99: recharge in steps of about 32 MWh per hour, which is `cap / charge_hours` with `charge_hours: 4` (129 / 4 ≈ 32 MW). That limit is an assumption. No heat-exchanger UA and no diffuser are behind it.

`outage_mean_h: 22` in `engineering.yaml`. Six hours of the 21.5 MW peak is about ten hours at the 13 MW load in that trace, and then backup. `model-notes.md` already says capture outages are the only thing the tank protects against, and that supply is about 15× demand. The week shows the protection running out inside the outage. `unmet_hours: 0` because `backup.capacity_share: 1.0`. Continuity is the boilers, not the tank.

Summer week: storage stays at 129.28 MWh for all 168 hours. Standing loss is `loss_per_day: 0.01`. A full tank sheds about 1.3 MWh/day. Summer demand in that week is often under 1 MW while average supply is 88.8 MW, so the loss is easy to replace and the steel does no shifting. Seasonal storage is not claimed (`model-notes.md`: none). Do not let a slide imply it.

The cost line calls it a “hot-water tank” at $300/m³ and cites Danish pit stores at 33–38 EUR/m³ as a floor (the JSON source string; the EUR figure was not re-fetched in this lane). 5,558 m³ is a large atmospheric tank or a small pit. Which one, and how it is stratified, is unspecified. IDEA’s organizer extract on data-center thermal storage (`resources/text/IDEA_-_Thermal_Energy_Storage_for_Data_Centers_CB_and_I.txt`) is about chilled-water ton-hour tanks, not a 50/30 °C heating store. It does not validate this volume.

**Fix.** Track top temperature. Book only the kilowatt-hours above the direct-use cutoff, or add a discharge heat pump and its electricity. State next to the 5,558 m³: outage buffer, mixed-tank equivalent about 13 MWh at 45 °C direct, full 129 MWh only if a heat pump or the 18 °C loop can take the cold end. Say that a 22 h mean outage is covered by backup after the tank empties. Specify tank versus pit and a charge diffuser before calling 32 MW a charge rate.

## A7 — One plate, a constant 50 °C, and a sidestream the energy model does not contain

**Severity: High** as a continuity and temperature-control gap. Cooling reliability itself is in `docs/cooling-integration.md` and is not re-litigated here.

**Evidence.**

Grundfos guide, gasketed plates “Max capacity 30-50 MW”; brazed plates “max capacity ~ 2 MW” (same 2018 file, verified 2026-10-03). Peak source draw is about 21.5 MW (A6). One gasketed frame can carry the phase-1 offtake. A brazed pack at ~2 MW cannot. The capex title says “plate HX, isolation, N+1, controls.” The hourly model has one energy stream and no second plate. N+1 is a word on the cost line. `backup.capacity_share` is boilers, and the comment in `engineering.yaml` says “N+1 not modeled.”

Capture is 50 °C in every hour, including winter-week hours at about −20 °C and summer-week hours at about 33 °C (`site2.json` `weeks`). Dry coolers track outdoor air unless a leaving-temperature setpoint holds them up. No such setpoint is in the model. `docs/cooling-integration.md` already marks the summer temperature the fans can hold as **[unverified]**, and it quotes the HDR site pack’s future heat (“up to 69 days above 90 degrees” versus 19 today; unit unlabeled in the pack) plus ASHRAE’s note that some sites do not suit dry coolers at W45/W+. January still has 65,250 MWh of supply against 8,954 MWh of demand, so the 149 MWh of January backup and the 224 MWh of April backup are the availability mask (`capture_availability: 0.99`), not a cold-snap capacity miss. A bigger heat pump does not fix those hours.

The cooling note’s layout (slipstream upstream of the fans, fail-closed, utility does not pump glycol) is the right Grundfos picture: indirect connection so a pressure event on one side stays there. The energy model does not represent that slipstream, so it cannot show fan power returning when the valve shuts, or header temperature falling when the fans run hard in January.

**Fix.** Keep the cooling note’s sidestream as the covenant drawing. In the model, add a winter floor and a summer ceiling on capture temperature, or label 50 °C as constant by assumption in every chart title. Count plates: one gasketed duty frame inside 30–50 MW, plus a spare if the cost line says N+1, and no brazed frame at this duty. Leave dry coolers at 100% with the export valve shut (already the cooling note’s rule).

## What survives

These points stay standing after the attacks above. They are the ones worth saying to HDR and Grundfos.

- Users on the acreage, and a town main only if it passes. The town ring fails on the model’s own gate: 14 km, 1,840 MWh/yr of pipe loss against 3,577 MWh delivered, central COP printed at the 6.0 clip, LCOH $734/MWh, `passes_gate: false`. CBS distance above 2 km, already cited in the JSON, points the same way. A3’s head screen says a DN150–200 main at that length was never a circulation pump. Leave it failed.
- The offtake, not the 150 MW, sizes the pipes and the heat pumps. Average available heat is 88.8 MW; delivered heat is 50.6 GWh/yr, about 6.5% of what is available. A 300–400 MW build-out does not resize this network unless new users show up. The tornado already shows LCOH unchanged at 75 MW and 320 MW IT. Say that, so nobody sizes a DN for 400 MW of heat.
- Dry coolers remain the heat sink. Heat reuse is a metered sidestream. That is the cooling note’s design, and it matches an indirect plate the way the Grundfos guide draws one. The lake is not the cooling circuit. Do not convert pump kilowatt-hours or exported megawatts into gallons. The site pack states there are no disadvantaged communities nearby (`resources/text/2026_10_01_Hackathon_NYU_-_Suburban_Site_-_Lake_Hawkeye.txt`, verified 2026-10-03). This review does not turn a pipe into an equity claim.
- HDR lenses this hardware can actually touch, once A1 is fixed: Community — heat that arrives at a temperature the greenhouse can use, under a covenant the town can test; Health and air — propane and oil displaced only in buildings that are really connected, with backup boilers admitted as combustion; carbon — compressor electricity included when the source is 30 °C; water — closed-loop dry cooling stays the water commitment. Biodiversity and nutrients are the greenhouse and the fish loop, not the pump curve.
- The corridor ambient loop is the architecture that matches a **30 °C** rear-door plant (building heat pumps lift 18 °C water). It fights a **50 °C** covenant plant, because the model then throws the grade away and buys 500 heat pumps. Pick one story.

## Lane status

**Done**

- Attacks A1–A7 written with severity, evidence, and a fix: temperature and the two-approach test, missing distribution delta-T, pump factor versus head, pipe length versus diameter, heat-pump COP clip and design point, storage grade and the winter-week outage, plate capacity and the constant 50 °C.
- Cross-checked `site2.json` peaks, COP, storage volume, pipe-loss megawatt-hours, and capex lines against `engineering.yaml`, `finance.yaml`, and `demand.py` / `heatpump.py` / `dispatch.py` / `finance.py`.
- Organizer hydraulics used: Grundfos 2018 temperatures, delta-T and affinity, gasketed versus brazed capacity; Topic 5 COP 2–5 and the 2.95 campus point; site-pack sentence on disadvantaged communities.
- Town main left failed, consistent with `passes_gate: false`.

**Missing**

- A vendor pump curve, NPSH, and glycol viscosity for 30–35% propylene glycol. Not in the repo. Marked **[unverified]**.
- A measured Lake Hawkeye condenser temperature and dry-cooler model. The cooling note already lists both as missing. This lane did not find them either.
- A catalog water-to-water heat pump at 18 °C source and 55 °C sink, and a rec-center DHW storage temperature required by code.
- A real pipe price at DN400–DN600 versus the $900/m on-site allowance.
- Re-fetch of the Danish pit-store 33–38 EUR/m³ figure (it is a string on the cost line, not a page opened here).
- Summer dry-cooler leaving temperature at the HDR future hot day. Still **[unverified]**, as in the cooling note.

**Open questions**

- Which plant is the vote: published rear-door at ~30 °C, or a covenant W40/W45 return at ~50 °C? A1 and A5 flip with that answer. The base JSON currently assumes the covenant temperature and the published-plant simplicity (no on-site heat pump) at the same time.
- Is on-site `supply_temp_C: 45` upstream or downstream of the customer substation the budget buys? Downstream, the two-approach test fails. Upstream, the substation dollars need a different explanation.
- Will storage be asked to serve the 45 °C coils, the 18 °C loop, or both? One mixed tank cannot do both at the booked 20 K.
- `research/model-notes.md` still says town LCOH about $754/MWh and a 12.5 MW greenhouse peak at −17 °C. `site2.json` says $734.2/MWh, town, and `extras.greenhouse_check.peak_MW` 14.88. This lane did not edit those files. Quote the JSON if the two disagree.

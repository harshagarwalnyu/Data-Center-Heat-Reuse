# Council gaps: closing the expert-panel findings

> **Draft for discussion; not legal advice.** Every term below is a **PROPOSAL** by team Thermal Commons. Nothing here has been offered to or agreed with TeraWulf, the Town of Lansing, or any customer. A lawyer licensed in New York must review it before anyone relies on it.

An expert review panel found seven gaps. This file closes each one, or says plainly that it cannot. It adds no new facts. Positions on ownership, tariffs and permit conditions come from [term-sheet.md](term-sheet.md) and [ownership-deal.md](ownership-deal.md). Risk scores stay in [risk-matrix.md](risk-matrix.md). Facts and their limits are in [../research/verification.md](../research/verification.md).

**How to read the numbers.**
- Model numbers carry the key they come from, in `outputs/site2.json` (plain key paths), `outputs/hydraulics.json` (prefixed `hyd.`) or `outputs/analysis_detail.json` (prefixed `ad.`).
- Anything not in those files is labelled **ASSUMPTION** with a low/high range, or **not modeled**.
- The base case is a 150 MW data center (`supply.it_load_MW`), which is our assumption. The corridor and town numbers are model outputs, not quotes or bids.

---

## 1. Embodied carbon (screening estimate)

**Gap:** the 11,408 t/yr CO2 headline counts avoided operating emissions only. It says nothing about the carbon locked into the pipe, heat pumps, exchanger and tank we would build.

**Label: screening estimate.** This is a ranged back-of-envelope, not a life-cycle assessment. Every per-unit factor is an **ASSUMPTION**, our own generic range for that kind of equipment (a materials-and-construction factor type, such as steel, plastic pipe and trenching). We cite no study. A real number needs an LCA by a qualified practitioner using product data.

### 1.1 Quantities (from the model)

| Item | Quantity | Key |
|---|---|---|
| Pipe route, on-site | 0.5 km | `rings[onsite].pipe_km`, `hyd.rings.onsite.pipe_km` |
| Pipe route, corridor | 20.9 km | `rings[corridor].pipe_km` |
| Pipe route used here | 21.4 km (phases 1 and 2 only; the 14.0 km town main fails its gate and is excluded) | sum of the two keys above; `rings[town].passes_gate` = false |
| Building heat pumps | 500 units | `finance.capex_musd.lines` ("Building heat pumps (500 units)"), `impact.homes_served` |
| Plate heat exchanger and DC-side interface | 1 interface skid with N+1 plate exchangers | `finance.capex_musd.lines` ("DC-side sidestream interface") |
| Source-side hot-water tank | 5,558 m3 | `totals.storage_m3` |

### 1.2 Per-unit factors (all ASSUMPTION, low and high)

| Item | Low | High | Basis (type only) |
|---|---|---|---|
| Installed pipe, per route-metre (supply and return, insulation, trench and backfill) | 50 kg CO2e/m | 150 kg CO2e/m | ASSUMPTION: generic range for pre-insulated plastic and steel pipe plus excavation |
| Building heat pump, per unit (manufacture only, no refrigerant leakage, no operation) | 0.5 t CO2e | 1.5 t CO2e | ASSUMPTION: generic range for residential and small commercial heat pumps |
| Plate heat exchanger and skid, total | 20 t CO2e | 80 t CO2e | ASSUMPTION: stainless plates and steel frame, N+1 |
| Tank, steel mass per m3 of volume | 25 kg/m3 | 60 kg/m3 | ASSUMPTION: large insulated atmospheric tank |
| Tank, carbon per tonne of steel | 1.5 t CO2e/t | 2.5 t CO2e/t | ASSUMPTION: generic range for fabricated structural steel |
| Allowance for items not itemized (substations, laterals, pumps, boilers, trenching to buildings) | 10% | 30% | ASSUMPTION: not modeled in detail |

### 1.3 Result

| Item | Low (t CO2e) | High (t CO2e) | Arithmetic |
|---|---|---|---|
| Pipe | 1,070 | 3,210 | 21.4 km x 50 or 150 kg/m |
| Heat pumps | 250 | 750 | 500 x 0.5 or 1.5 t |
| Plate HX and skid | 20 | 80 | stated directly |
| Tank | 208 | 834 | 5,558 m3 x 25 or 60 kg/m3 x 1.5 or 2.5 t/t |
| **Subtotal** | **1,548** | **4,874** | |
| **With allowance** | **about 1,700** | **about 6,300** | low x 1.10, high x 1.30 |

### 1.4 Carbon payback

`impact.co2_avoided_t_yr` = 11,408 t/yr. Per `docs/methodology.md` (CO2_avoided formula), that figure is already net of heat pump and pumping electricity and of backup fuel, so there is no double count.

| Case | Payback |
|---|---|
| Low embodied (1,700 t) over 11,408 t/yr | about 0.15 years (under 2 months) |
| High embodied (6,300 t) over 11,408 t/yr | about 0.55 years (under 7 months) |
| Same range on the marginal-grid case, `extras.co2_avoided_marginal_grid_t_yr` = 10,670 t/yr | about 0.16 to 0.59 years |

**What to say.** Even at the high end the build pays back its carbon in well under a year, if the 11,408 t/yr is real. That condition is the weak point, not the embodied side: the figure counts phases 1 and 2 fully built and assumes the fuel mix in the model (`docs/methodology.md`). If the corridor stops at the Gate 6 test (`term-sheet.md` section 7), the avoided CO2 falls and the pipe share of embodied carbon falls with it. We have not modeled that split.

**Not modeled:** refrigerant leakage over the life of the heat pumps, greenhouse and building construction, pipe replacement, end-of-life, and the town main.

---

## 2. Water (WUE) framing

**Gap:** a reviewer asked whether heat reuse changes the data center's water-use effectiveness (WUE).

**What WUE means.** WUE is annual site water use in litres per kWh of IT energy. Most of it is usually water used to reject heat, for example by evaporative cooling. The definition is the industry's, not from `research/verification.md` [unverified].

**Our position: no change is claimed.**
1. The published design is a sealed closed-loop glycol system with air-cooled dry coolers and no draw from or discharge to the lake (`research/verification.md` row 4a). That is a developer claim, not an independent finding. Make-up and domestic water are not addressed there.
2. A dry-cooled design has no evaporative cooling water in the published description, so heat reuse has none to save unless adiabatic or mist assist is added, which the proposed covenant would forbid. Sending some heat to customers instead of the dry coolers does not retire any gallons.
3. The model says so itself: `impact.water.note` ("heat reuse does not save lake water 1:1 ... No lake-water savings are claimed"). We claim **0 gallons**.
4. The quantified water-adjacent result is fan energy: `impact.water.fan_energy_saved_MWh` = 970 MWh/yr. That is electricity, not water.
5. The DEC permit allows up to 1,008,000 gallons per day, held by Cayuga Operating Company LLC, effective 13 April 2026, expiring 30 April 2031, with uses limited to maintenance, sump pumping and dust control (`research/verification.md` rows 5a, 5c). The covenant in `term-sheet.md` section 4 item 2 is a promise not to turn that permit into cooling water. It is a promise, not a saving.

**What we do not say.** We do not say "no consumptive water". Make-up and domestic water are unaddressed (row 4a). We do not publish a WUE number because we have no measured water or IT-energy data from the site.

**Aquaponics and greenhouse loop: design intent only.** The on-site loop is intended to keep nutrients inside the building: fish water feeds the plants, and plants clean the water, rather than discharging nutrient-rich water to the lake. This is a design intent. We give no flow, nutrient or gallon figures for it. The model carries fish and food output (`impact.fish_t_yr` = 1,500, `impact.local_food_t_yr` = 5,500), which are demand-side sizing figures, not water results. A nutrient and discharge plan is open work (section 4).

---

## 3. Governance charter box

All of this restates `term-sheet.md` section 6 and `ownership-deal.md` (governance rows), except where marked **NEW PROPOSAL**. It is a summary box for judges and the Town, not a charter text.

| Item | Position | Source |
|---|---|---|
| Owner | The Thermal Commons co-op. Legal form is **open** (counsel). | `term-sheet.md` section 6 |
| Members | Heat users who connect: on-site anchors, households, growers, the school district. Membership is tied to buying heat. | `term-sheet.md` section 6 |
| Votes | One member, one vote. Anchors get no extra votes for being large. | `term-sheet.md` section 6 |
| Board seats | Elected by members, plus **one seat appointed by the Town**. Total board size `[N]` is open. | `term-sheet.md` section 6 |
| TeraWulf | A **non-voting** seat. No vote on tariffs, board elections or the 0.8 rule. | `term-sheet.md` section 6 |
| Cooling | The cooling-priority clause is not subject to a board vote. | `term-sheet.md` 2.3 |
| Tariff rule | 0.8 times propane, never above propane. Surplus above cost goes back to members by heat bought. | `finance.tariff_rule`, `term-sheet.md` section 6 |
| Public meters | A co-op-owned heat meter at the interface reading flow and temperature. | `term-sheet.md` section 4 item 1 |
| Public dashboard | Monthly data to the Town and online: heat delivered, supply temperature, hours on backup, curtailments. **NEW PROPOSAL:** add monthly delta-T and pumping kWh per MWh delivered (section 7). | `term-sheet.md` section 4 item 1 |
| Annual report | Annual public meeting and annual statement. The co-op gives a signed annual heat statement (`ownership-deal.md` calls the heat-network operator "utility"). | `term-sheet.md` section 6; `ownership-deal.md` (reporting row) |
| Conflict of interest | **NEW PROPOSAL** (not in the term sheet). See below. | n/a |

**Conflict-of-interest rule (NEW PROPOSAL, for counsel).**
1. No director or officer may be an employee, contractor or agent of TeraWulf, the landlord, or the O&M contractor, while serving.
2. Any director with a personal or business interest in a matter discloses it before the vote and does not vote on it.
3. The Town-appointed director does not vote on any matter where the Town is acting as regulator or enforcer against the co-op. They may vote on all other matters.
4. Contracts above `[amount]` between the co-op and any director or related party need approval of the other directors and are published.
5. The disclosure register is public and listed in the annual statement.

The Town seat's recusal in item 3 matters because the Town is both permit authority and a board member. Whether that dual role is lawful and how recusal should work is a question for counsel (section 6).

---

## 4. Lake and noise protections (proposed permit conditions)

All are **proposals**. Whether the Town can attach each one is untested (section 6). Numbers appear only where a source supports them.

### 4.1 Lake

| Condition | Form | Numeric support |
|---|---|---|
| No cooling use of the lake withdrawal | TeraWulf and the landlord covenant not to use any part of the DEC permit for process, evaporative or mist cooling, and not to seek a new or expanded withdrawal for cooling, for the life of the lease. | Permit 1,008,000 gpd, uses limited to maintenance, sump pumping and dust control, expires 30 April 2031 (`research/verification.md` rows 5a, 5c). The landlord must sign because it holds the permit (rows 3c, 5a). |
| The lake is not a heat sink | The HSA states the lake is not a cooling fallback. | `docs/risk-matrix.md` (correction note: the lake is NOT a fallback heat sink; the permit is not for continuous cooling) |
| No discharge to the lake | No discharge of coolant, greenhouse or aquaculture water to the lake or surface water without the separate permit that applies. Which permit applies is for counsel and DEC to say. | none |
| Coolant containment | Leak detection and containment on the glycol loop and the exchanger skid, with a spill report to the Town within `[N]` hours. The glycol type is not settled in our sources (`docs/judge-qa.md` Q7; `research/verification.md` row 4a). | none |
| Nutrient plan | A nutrient and effluent plan for the aquaponics and greenhouse loop, approved before heat is delivered. The intent is that nutrients stay in the building (section 2). The lake's nutrient status is a stated concern in `hdr_scorecard` (Nutrients). | none; we model no nutrient flows |
| Monitoring and reporting | Independent monitoring, an annual public report, and a covenant audit before the 2031 permit renewal. | `term-sheet.md` section 4 item 2 |
| Remedy | Breach is a CBA default and triggers co-op step-in on the site exchanger. | `term-sheet.md` section 4 item 2 and 2.4 |

### 4.2 Noise

We found no verified local noise standard (`term-sheet.md` section 4 item 3), so there is **no decibel number here**.

| Condition | Form |
|---|---|
| Limit on heat-extraction and pumping equipment | A dBA limit at the receiving property line, set from the Town's own noise code by the Town's acoustic consultant. Value `[limit]`. |
| Dry-cooler noise | Outside the HSA. Handled in the CBA, with the same property-line method. |
| Baseline | Measure ambient noise at the property line before construction, so the limit is tested against a baseline. |
| Monitoring | Third-party measurement at commissioning and after any equipment change, with results public. |
| Remedy | Stop-work or curtailment of the noisy equipment until fixed. A heat-side noise stop must fail safe to the dry coolers and never touch data-center cooling (`term-sheet.md` 2.3). |

---

## 5. Liability stack: who bears which risk

Nothing here is an insurance quote or legal allocation. It maps the proposed positions to who pays when something breaks. Rows on the Town's and customers' liability, and on who bears pump or exchanger faults, are **NEW PROPOSAL** (not in the term sheet) and need counsel. Model reference points: backup boilers sized to 100% of peak (`totals.unmet_note`); backup covers 4.7% of peak (`totals.peak_share_backup_pct`) and 0.73% of annual heat (`totals.backup_share_annual_pct`); `totals.unmet_hours` = 0 is zero by construction.

| Risk | Heat supplier (TeraWulf) | Co-op | Town | Customers |
|---|---|---|---|---|
| Heat curtailed or lost (data-center trip, tenant change, maintenance) | Free to curtail without penalty or liability under the cooling-priority clause. Gives notice `[N]` minutes where feasible. | Bears supply risk to its members. Covers the gap with storage (`totals.storage_m3` = 5,558), then backup boilers, within the limits above. | None. | Keep their existing propane or oil system as a third layer. Vulnerable customers are shed last. |
| Data-center cooling harmed by heat side | Protected: a heat-side fault is not a default, SLA breach or claim. Hard-wired bypass fails safe to the dry coolers. | Bears cost of its own pump trip or exchanger fault. | None. | None. |
| Heat-side equipment failure, burst pipe, injury, property damage | Liable for its own site-side equipment and the cooling loop. | Liable for pipe, substations and the network it owns. Carries liability and property insurance (see below). | Not liable for co-op operations. Town must not be the operator of last resort unless the fallback is triggered. | Liable for building-side equipment. Co-op meters and laterals up to the property line `[to be set by counsel]`. |
| Data center leaves in year 10 | Funds the decommissioning reserve (letter of credit or escrow). | Receives step-in rights and the reserve. | Holds the CBA, which runs with the lease (the HSA is an exhibit). | Move to backup heat, then the year-10 fallback. |
| Cost of that exit | Reserve size is **open**. Starting reference `finance.dc_exit.stranded_musd` = 5.71. | Meets the uplift from the reserve and transition fund, not from members. | None. | Tariff multiple does not rise because the source changed. |
| Water covenant breach | Default under the CBA. Step-in on the exchanger. | Gains step-in. | Enforces the CBA. | None. |
| Tariff and price risk | None. | Cost-based tariff, 0.8 times propane. | None. | Pay at most propane price. |

Source for the allocation rows: `term-sheet.md` 2.3 (cooling priority), 2.4 (step-in), 2.6 (exit), section 5 (consumer protections); `risk-matrix.md` heat-continuity cascade.

**Insurance.** The sources do not give a premium, a limit or a carrier. The DATA HEAT guide's "Insurance schemes" section (p. 34) gave us no insurance examples (`docs/risk-matrix.md` source S6). Proposed forms only:
- **Co-op:** general liability, property and boiler-and-machinery cover, in amounts `[set by an insurance broker]`, with the Town and TeraWulf as additional insureds on the network.
- **TeraWulf:** keeps its own data-center cover. **NEW PROPOSAL:** the HSA would require a waiver of subrogation for heat-side events, consistent with "no claim" under the cooling-priority clause.
- **Directors and officers** cover for the co-op board, because it holds a Town-appointed seat.
- **Reserve:** the letter of credit or escrow in `term-sheet.md` 2.6 is the only dollar protection we have a model number for (`finance.dc_exit.stranded_musd` = 5.71, `finance.dc_exit.replacement_source_musd` = 10.35).

**Backup boilers.** Capex line "Backup boilers (100% of peak)" = $2.80M (`finance.capex_musd.lines`). They are the co-op's asset and the co-op's duty. The risk matrix prefers electric boilers or heat pumps on stored heat, and delivered fuel only for rare emergencies, because piped gas is not assumed near the plant (`docs/risk-matrix.md` R22).

**Plain answer to "who is liable if it breaks?"** On the heat side, the co-op, up to the limit of its insurance and reserve. On the data-center side, TeraWulf, and the heat side can never be the cause of a data-center claim. The Town is a counterparty and one board seat, not an operator or guarantor, unless the fallback in `term-sheet.md` section 6 is used and a town-chartered entity takes over the agreements.

---

## 6. Legal-authority gate (G0.5)

**We did not verify the Town's legal authority to attach any of these conditions.** `term-sheet.md` section 4 and 8.1 item 2 say the same: we cite no legal authority and none is assumed. The related legal facts we did check are limited and mostly negative:
- Utility thermal network law (PSL 66-t) authorizes gas and electric corporations, not municipalities (`research/verification.md` row 11a).
- A municipality selling steam to non-municipal customers needs a PSC certificate; whether that covers hot water is **unconfirmed** (row 11b).
- Town Law section 190 appears not to list a heating district; row 11d rates this unconfirmed (likely no), based on a paraphrase rather than the statute text.
- Executive Order 62 coverage of Lake Hawkeye is unverified (row 2b).

**New gate, G0.5 (NEW PROPOSAL, not in the term sheet): counsel opinion on the Town's authority.** It sits between G0 (Town choice, 31 March 2027) and G2 (legal form memo, 30 June 2027) in `term-sheet.md` section 7, and turns `term-sheet.md` 8.1 item 2 into a pass-or-fail gate.

| Item | Position |
|---|---|
| Question | Can the Town of Lansing, under New York law, attach each condition in section 4 of the term sheet and sections 4 and 5 here, as a condition of approval? Can it take one board seat and enforce a CBA? |
| Who | A New York lawyer retained by the Town or jointly. Not us. |
| Pass | A written opinion, per condition: authorized, authorized with changes, or not authorized. |
| Fail | Conditions that are not authorized are dropped or moved to a voluntary CBA signed by TeraWulf. The pitch that rests on them is restated. |
| Rule | **No reliance before the opinion.** No design spend, no co-op assets, no public claim that the Town "will require" a condition. |
| Date | Target `[open]`; no later than the G2 memo date. A date is not a pass. |

Related items already on the counsel list (`term-sheet.md` 8.1): co-op legal form, the water covenant binding the permit holder, enforceability against assignees, tax.

---

## 7. Pumps and delta-T monitoring

Source: `outputs/hydraulics.json`, status "SCREENING, not design" (`hyd.meta.status`). Detail in [hydraulics.md](hydraulics.md).

### 7.1 Per-ring results

| Ring | Delta-T (K) | Flow (m3/h) | Head (m) | Constant-speed (MWh/yr) | Variable-speed (MWh/yr) | Flat 1.5% (MWh/yr) | Computed / flat |
|---|---|---|---|---|---|---|---|
| `onsite` | 20 | 709.04 | 16.17 | 417.97 | 91.76 | 556.14 | 0.165 |
| `corridor` | 5 | 1,178.59 | 85.4 | 3,685.35 | 282.83 | 202.5 | 1.3967 |
| `town` (gated, not built) | 30 | 85.99 | 284.68 | 886.84 | 25.13 | 53.66 | 0.4684 |

Keys: `hyd.rings.<id>.delta_T_K`, `.design_flow_m3_h`, `.head_m`, `.annual.constant_speed_MWh`, `.annual.variable_speed_end_pressure_MWh`, `.flat_pump_share_MWh`, `.computed_vs_flat_ratio`. Delta-T values are ASSUMPTION design intents (`hyd.assumptions.delta_T`), 45/25 C on-site, 20/15 C corridor, 65/35 C town.

### 7.2 What it means

- **Variable speed wins by a wide margin.** Constant-speed pumping would be 1.13% of heat on-site and 27.3% of heat in the corridor (`hyd.rings.onsite.pumping_pct_of_heat_constant_speed`, `hyd.rings.corridor.pumping_pct_of_heat_constant_speed`). Variable speed is 0.25% and 2.10% (`..._variable_speed`). Average flow is a fraction of design flow, because full-load-equivalent hours are 2,266 (on-site) and 1,973 (corridor) of 8,760 (`hyd.rings.<id>.annual.full_load_equivalent_hours`).
- **The model's flat 1.5% is too high overall and too low for the corridor.** For phases 1 and 2, computed variable-speed pumping is 374.59 MWh/yr, an implied share of 0.74% of the 50,576 MWh delivered (`hyd.phases_1_2.pumping_variable_speed_MWh`, `.implied_pump_share`, `.heat_MWh`), against the flat 1.5% (`.flat_pump_share`).
- **Corridor under-count.** The 5 K ambient loop needs 4.0 times the flow per MW of the 20 K campus loop (`docs/hydraulics.md`). Computed variable-speed pumping there is 1.40 times the flat share (`hyd.rings.corridor.computed_vs_flat_ratio`). The flat percentage hides this because the on-site ring is far below it. Building-side circulators are not in this count.
- **Cost effect is small.** Pump share of 0.5%, 1.5%, 3% and 6% moves blended LCOH at 7% from $104.99 to $106.07 to $107.69 to $110.93/MWh (`hyd.pump_share_sweep.rows`). Re-running at the implied 0.74% share gives $105.25/MWh (`hyd.phases_1_2.lcoh_blended_7pct_at_implied_share`) against $106.07 base.
- **Limits.** Single critical path per ring, no network solver, no elevation, constant pump efficiency (0.7) and drive efficiency (0.93) (`hyd.assumptions`). The affinity-law figures (`variable_speed_affinity_MWh`: 24.24, 174.5, 18.4) are a lower bound.

### 7.3 Delta-T drift clause (PROPOSAL for the HSA and customer service terms)

**Why.** Flow rises as delta-T falls, and pump power rises about as the cube of flow. On the 5 K corridor loop, losing 1 K of delta-T is a 25% flow increase and roughly 95% more pump power (`docs/hydraulics.md`, Grundfos angle). A drifting return temperature is also a sign that building heat pumps or valves are mis-set, and it cuts the heat the exchanger can take.

**Clause form.**
1. **Reporting.** The co-op reports monthly, per ring: average supply and return temperature, average delta-T, delta-T at peak-flow hours, flow, and pumping kWh per MWh of heat delivered. Published on the public dashboard (section 3).
2. **Baseline.** The design-intent delta-T (45/25, 20/15, 65/35 C) and the model's hourly flows and heads are the commissioning baseline. After a first-year measured baseline, the parties may reset it by agreement.
3. **Trigger.** If the monthly return temperature on a ring exceeds the baseline by more than `[X]` K for `[N]` consecutive months, or the seasonal average delta-T falls more than `[X]` K below baseline, corrective action is required. Candidate starting value for the corridor: `[1]` K, because 1 K is a 25% flow increase on a 5 K loop. This is a proposal for the engineer to confirm, not a measured threshold.
4. **Corrective action.** The co-op files a written plan within `[30]` days: substation tuning, valve or control replacement, or customer-side fixes. The operator may apply a pumping surcharge to the customers whose return temperature is the cause, set by the board and published. The plan and results appear in the annual statement.
5. **No effect on cooling.** The clause never changes the data-center interface. The data center's return limits stay in the cooling-priority clause (`term-sheet.md` 2.3).
6. **Wider delta-T on the data-center side.** A lower return from the loop widens delta-T, cuts flow and lets the DC-side exchanger recover more heat (`docs/hydraulics.md`). Reported, not guaranteed.

Open: `[X]`, `[N]` and the surcharge are blanks for the parties and an engineer. We have no measured return temperatures to calibrate them.

---

## Summary of what remains open

| Gap | Status |
|---|---|
| Embodied carbon | Screening estimate only: about 1,700 to 6,300 t CO2e, payback about 0.15 to 0.55 years. No LCA. |
| WUE | No change claimed. No site water or IT-energy data. Aquaponics nutrient plan not designed. |
| Governance | Consistent with the term sheet. Conflict-of-interest rule is new and needs counsel. Board size `[N]` open. |
| Lake and noise | Forms only. No dBA number, no discharge permit identified. |
| Liability | Allocation proposed. No insurance limits, premiums or carriers. |
| Legal authority | **Not verified.** G0.5 gate proposed. |
| Delta-T | Thresholds blank until measured data exist. Screening hydraulics only. |

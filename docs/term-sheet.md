# Term sheet: Community Benefit Agreement and Heat Supply Agreement (Site 2, Lansing NY)

> **Draft for discussion; not legal advice.** Every term below is a **PROPOSAL** by team Thermal Commons. Nothing here has been offered to, or agreed with, TeraWulf, the Town of Lansing, or any customer. No contract exists. A lawyer licensed in New York must review it before anyone relies on it.

This turns the pitch, "Don't ban it. Set the terms.", into terms the Town could attach and the parties could sign. It sits on top of [ownership-deal.md](ownership-deal.md) (who owns what) and [proposal/12-implementation-timeline.md](proposal/12-implementation-timeline.md) (when). Facts and their limits are in [../research/verification.md](../research/verification.md). Risks are in [risk-matrix.md](risk-matrix.md). Likely questions are in [judge-qa.md](judge-qa.md).

**How to read the numbers.** Every model number carries the key it comes from in `outputs/site2.json` (paths like `finance.tariff_usd_mwh`; `extras.*` and `totals.*` are top-level objects in that file). They are model outputs from our 8,760-hour run, not quotes or bids. The base case assumes a 150 MW data center (`supply.it_load_MW`), which is our assumption; TeraWulf's filing gives about 400 MW gross and no phase split (`research/verification.md` row 3a). Numbers that are not in `site2.json` are marked as sourced facts with their verification row, or left as `[blank]` for the parties to fill. We add no new facts.

---

## 1. Parties and roles

| Party | Role | Notes |
|---|---|---|
| **TeraWulf** (Lake Hawkeye LLC, the lessee, and its landlord Cayuga Operating Company LLC) | **Heat supplier.** Provides heat at the cooling-loop interface. Signs the Heat Supply Agreement (HSA) and the Community Benefit Agreement (CBA). | The landlord must also sign the water covenant in section 4, because it holds the DEC withdrawal permit (`research/verification.md` rows 3c, 5a). |
| **Thermal Commons co-op** | **Owner and operator of the heat network.** Buys heat under the HSA, sells heat to members under the tariff, holds backup boilers and storage. Third-party beneficiary of the CBA. | Proposed legal form. Whether New York law allows a heat co-op, and whether a sale to households triggers Public Service Commission jurisdiction, is **unverified** (`research/verification.md` rows 11a to 11d). Fallback: a town-chartered entity takes the same agreements (`ownership-deal.md` section 2). |
| **Town of Lansing** | **Permit authority and CBA counterparty.** Attaches the terms as conditions of approval, holds one seat on the co-op board, can enforce the CBA. | The Town Board directed its attorney to draft a data-center ban on 29 September 2026; no ban is enacted (`research/verification.md` row 1a). This term sheet is the alternative to that draft, not a prediction of the Board's vote. |
| **Anchor customers** | **First heat users and co-op members:** the 10 ha greenhouse, aquaculture, and the community recreation center and pool. Later, any household that actually connects. | Model users: `rings[onsite].users`. No customer has signed anything. Anchors sign heat-purchase contracts with the co-op before their own foundations are poured, so backup heat is their obligation when the data center curtails (timeline, 2028). |

---

## 2. Heat Supply Agreement (HSA) terms

Parties: TeraWulf (with the landlord) as supplier, the co-op as buyer.

### 2.1 Quantity, temperature and availability

The data center is the source, and demand is the constraint. The HSA promises **availability, not volume**. TeraWulf does not owe heat it cannot export, and there is no take-or-pay against it.

| Term | Proposed position | Model basis |
|---|---|---|
| Capture temperature | Heat offered at the cooling-loop interface at about 50 C, through a plate heat exchanger in parallel with the dry coolers. | `supply.capture_temp_C` = 50 |
| Network supply temperature, on-site ring | About 45 C, direct exchange. | `rings[onsite].supply_temp_C` = 45; `rings[onsite].direct_heat_exchange` = true |
| Interface capacity | Sized to the Phase 1 on-site peak, not to the data center's total heat. | `rings[onsite].peak_MW` = 16.36 MW, against `supply.heat_available_MW_avg` = 88.8 MW average available |
| Annual heat | Delivered heat is a forecast, not a guarantee. | `totals.heat_delivered_MWh` = 50,576 MWh/yr, out of `supply.heat_available_GWh` = 777.6 GWh/yr |
| Minimum availability | TeraWulf makes available at least `[X]` MW at no less than `[T]` C for at least `[Y]`% of hours, scaled to the computing load actually energized, not to nameplate. Excludes curtailment events under 2.3. | `[X]`, `[T]`, `[Y]` are **open**. Data-center supply and return temperatures are not yet known (open item 8.2). |
| Who covers the gap | The co-op holds backup boilers and storage. On the model's base case the data center covers 95.3% of peak and backup 4.7%, and backup is 0.73% of annual heat. | `totals.peak_share_dc_pct`, `totals.peak_share_backup_pct`, `totals.backup_share_annual_pct`, `totals.backup_MWh` = 373, `totals.storage_m3` = 5,558 |

Read the reliability numbers with care: `totals.unmet_hours` = 0 only because backup is sized to 100% of peak. It is not evidence that the data center never trips (`totals.unmet_note`).

### 2.2 Price

Two prices, kept apart.

**(a) Heat price at the fence (TeraWulf to co-op): zero, or nominal cost.** Proposed: $0 per kWh of heat. The co-op pays only the metered incremental costs it causes (pumping and exchanger maintenance). Reopener: if the co-op's realized margin ever exceeds a cap set in the contract, a share goes back to TeraWulf. Reasoning: the data center's own saving from selling heat is small, and a price mostly buys friction (`ownership-deal.md` section 3). This is a proposed term, not an agreed one.

**(b) Tariff (co-op to customers): 0.8 times propane, fixed.**

| Item | Value | Key |
|---|---|---|
| Tariff rule | 0.8 x propane, fixed | `finance.tariff_rule` |
| Propane reference, same basis | $136.1/MWh | `finance.incumbent_usd_mwh.propane` |
| Resulting tariff | $108.9/MWh | `finance.tariff_usd_mwh` |
| Blended cost of heat, phases 1 and 2, at 7% | $106.1/MWh | `finance.lcoh_usd_mwh.utility_7pct` |
| On-site ring cost of heat, at 7% | $40.6/MWh | `rings[onsite].lcoh_usd_mwh_7pct` |
| Typical household saving versus propane, 27 MWh/yr home | $735/yr | `finance.household.savings_vs_propane_usd`, `finance.household.typical_MWh_yr` |

"Fixed" means the 0.8 multiple does not move. What it multiplies, meaning the propane reference and how often it is reset, is **open** (item 8.4). The propane price is a model input, not a verified local price (`research/verification.md` rows 7a, 7b), so the dollar tariff is illustrative until that is settled. Tariff revenue alone does not pay back the network at this tariff (`extras.funding.funding_gap_musd` = $26.01M); a funding contribution closes the gap, see section 3.

### 2.3 Cooling-priority clause: the data center's cooling always wins

- The HSA is **subordinate** to data-center cooling. The heat connection is a sidestream. Dry coolers can reject 100% of the design heat if the co-op takes nothing.
- A heat-side load, pump trip or exchanger fault must **fail safe to the dry coolers**.
- No data-center temperature setpoint changes to serve heat.
- No heat-side event is a data-center default, an SLA breach, or grounds for a claim.
- TeraWulf may curtail heat at any time, without penalty or liability, using a hard-wired closed-loop bypass. Notice is `[N]` minutes where feasible, and zero where cooling is at risk.
- TeraWulf may add cooling capacity without the co-op's consent.
- If a new tenant changes its coolant temperature, TeraWulf gives `[12]` months' notice and bears the cost of keeping the interface at the agreed `[T]`.

Basis: `docs/proposal/02-heat-source.md` and `docs/cooling-integration.md`. The 12-month notice is a proposal.

### 2.4 Step-in rights

If TeraWulf stops running the heat interface, breaches the water covenant, or the computing use ends:

1. The co-op may **step in** to operate the site-side exchanger skid, or buy it at depreciated value (first refusal).
2. The HSA and CBA **run with the ground lease** and bind any assignee or new tenant. The lease is 80 years, per the SEC filing (`research/verification.md` row 3c).
3. Customers are moved to backup heat, then to the year-10 fallback in 2.6.

### 2.5 Notice period and exit

| Term | Proposed position |
|---|---|
| Initial term | 10 years from commercial operation of the heat interface, then automatic 5-year renewals. |
| Why 10 | Data centers often will not guarantee heat beyond about 10 years (DATA HEAT appendix A p.34, quoted in the timeline). A 10-year term is a market fact; the renewal pattern is our proposal. |
| TeraWulf exit | `[24]` months' written notice of cessation, with a funded wind-down (2.6). The 24 months is a proposal, not a legal requirement. |
| Co-op exit | `[12]` months' notice, in return for returning the site-side skid in working order. |
| Cure | Cure periods and escalation to an independent engineer before any step-in. Liquidated payments to the co-op for HSA breach, not for curtailment. |

### 2.6 The year-10 exit case

The question we expect: what if the data center leaves in year 10? The model answers with these numbers (all under `finance.dc_exit`):

| Item | Value | Key |
|---|---|---|
| Year of exit | 10 | `finance.dc_exit.year` |
| Stranded capital | $5.71M | `finance.dc_exit.stranded_musd` |
| Replacement heat source (air-source or borehole plant) | $10.35M | `finance.dc_exit.replacement_source_musd` |
| Corridor cost uplift after the swap | $93.2/MWh | `finance.dc_exit.corridor_cost_uplift_usd_mwh` |

What happens, in the words of the model's fallback (`finance.dc_exit.fallback`): the loop pipe and building heat pumps stay, the central source swaps to an air-source or borehole plant, backup boilers cover the hours until the swap, and the on-site greenhouse and aquaculture revert to propane-equivalent or electric heat.

**Proposed protection:** a letter of credit or escrow funded by TeraWulf, with this formula:

`Reserve = stranded unrecovered capex of shared assets + removal cost of site-side equipment + transition-heat fund for connected customers for [N] heating seasons`

The model's $5.71M stranded figure is the starting reference for the first term. Whether the reserve should also cover the $10.35M replacement source is a negotiating question we do not settle here. The three terms have not been added up, and the dollar size of the reserve is **open** (item 8.3). Counsel and an engineer must match it to the model.

**Who pays the uplift.** The $93.2/MWh uplift is a cost, not a tariff change. Proposal: the 0.8 multiple does not rise because the source changed. The uplift is met from the reserve and the transition fund, not from members. The model does not say how long it can be met.

The point for the Town: the exit does not strand households with a broken system, because the pipe and heat pumps stay and the source is replaceable.

---

## 3. Community Benefit Agreement (CBA)

Parties: the Town and TeraWulf (with the landlord), recorded against the ground lease, with the co-op as third-party beneficiary. It survives assignment. The Town can enforce it. The HSA is an exhibit.

### 3.1 The annual contribution

TeraWulf contributes the funding gap that keeps tariffs under propane. This is an **assumption-based estimate**, not a negotiated figure and not a bid.

| Item | Value | Key |
|---|---|---|
| Whole-project funding gap, present value (7%, 30 years) | $26.01M | `extras.cba.headline_gap_musd` |
| **Same gap as a level annual payment** | **$2.096M per year** (about $2.1M) | `extras.cba.headline_annuitized_7pct_musd_per_yr` |
| As a share of an assumed data-center capital cost | 1.73% | `extras.cba.headline_as_pct_of_dc_capex` |
| That assumed capital cost (10 $M per MW x 150 MW; an assumption, midpoint of a published cost range) | $1,500M | `extras.cba.dc_capex_musd`, `extras.cba.dc_capex_basis` |
| Corridor alone, if on-site customers are not served (memo figure) | $30.32M | `extras.cba.corridor_standalone_gap_musd` |

Rules for reading it:

- **Use the annuitized figure.** The undiscounted straight-line figure ($0.867M/yr, `extras.cba.straight_line_undiscounted_per_year_musd`) understates the cost (`extras.cba.straight_line_note`).
- The on-site ring earns a surplus that offsets the corridor, which is why the whole-project gap is below the corridor-only gap (`extras.cba.reconciliation`).
- The 1.73% depends on the $1.5B capital assumption. If that number moves, the percentage moves. It is a talking scale, not a negotiated payment.
- The figure assumes phases 1 and 2 are both built. If the corridor stops at the Gate 6 test (section 7), the contribution is re-sized. `site2.json` has no number for that case.
- **Pipe alone is not enough.** Paying only for pipe does not bring tariffs to 0.8 x propane. The building heat pumps must also be funded, by this CBA, NYSERDA or the utility's non-pipes program (`extras.cba.breakeven_homes_if_cba_pays_pipe.finding`).
- The base case assumes no federal tax credit (`extras.funding.note`).

**Proposed mechanics:** paid annually to the co-op's network fund, with public reporting of how it was used. The payment term and any indexing are open (item 8.1).

### 3.2 Other CBA terms

| Term | Proposed position |
|---|---|
| Heat commitment | The HSA is an exhibit. Failure to build or maintain the heat interface by `[date]` triggers the permit-condition remedies in section 4. |
| Local anchors | Heat to the on-site greenhouse, aquaculture and recreation users at the on-site cost of heat, with their own backup heat. Priority hiring from Lansing for network and campus jobs. The jobs count is **unverified** and not stated here. |
| Land | Buffer land for a community agriculture and energy park on long lease at nominal rent. Acreage is **open**; the lease is about 183 acres (`research/verification.md` row 3c) and total site acreage beyond that is unverified (row 3d). |
| Reporting | Annual public statement: heat delivered, supply temperature, hours curtailed, backup fuel burned, and whether any of the water permit was used for cooling. |
| Remedies | Cure periods, then liquidated payments, then permit-condition remedies and co-op step-in. |

---

## 4. Permit conditions the Town could attach

All of these are **proposals** for the Town and its attorney to consider. We cite no legal authority for the Town's power to impose them. Whether the Town may attach each one under New York law, and how, is a question for counsel (section 8).

1. **Metering and public dashboard.**
   - A co-op-owned heat meter at the interface, reading flow and temperature.
   - Monthly heat data shared with the Town and published on a public dashboard.
   - Reported items: heat delivered, supply temperature, hours on backup, curtailments.
   - BTU-meter billing is standard in district energy (`ownership-deal.md` section 3).

2. **Covenant against using the lake withdrawal for cooling (proposed).**
   - TeraWulf and the landlord covenant not to use any part of the DEC withdrawal permit for process, evaporative or mist cooling, and not to seek a new or expanded withdrawal for cooling, for the life of the lease.
   - The permit allows up to 1,008,000 gallons per day, with uses limited to maintenance, sump pumping and dust control. It is held by Cayuga Operating Company LLC, effective 13 April 2026, expires 30 April 2031 (`research/verification.md` rows 5a, 5c).
   - TeraWulf publicly describes a sealed closed-loop cooling system with air-cooled dry coolers and no draw from the lake. That is a developer claim, not an independent finding (rows 4a, 4c).
   - **This is a promise, not a saving.** Heat reuse does not retire the permit and does not save lake water. We claim no gallons saved.
   - Breach means CBA default and co-op step-in on the site exchanger. Independent monitoring, with an annual public report and a covenant audit before the 2031 renewal.

3. **Noise.**
   - Heat-extraction and pumping equipment must not raise noise above `[limit]` at the receiving property line, set from the Town's own noise code.
   - Dry-cooler noise is outside the HSA and handled in the CBA.
   - Third-party monitoring and a stop-work remedy.
   - We found no verified local noise standard, so there is no number here.

4. **Decommissioning reserve.**
   - The letter of credit or escrow from section 2.6, funded before heat operation starts.
   - Released on a schedule tied to the co-op's debt paydown.
   - Sized by the formula in 2.6, and sized in dollars only after counsel and an engineer review it.

5. **Heat obligation runs with the land.** The HSA and CBA are recorded against the ground lease and bind assignees, so a change of tenant cannot walk away from them.

---

## 5. Low-income tariff and consumer protections

| Term | Proposed position | Key or source |
|---|---|---|
| Low-income tier | Qualifying households pay a lower tariff. Model value: $88.5/MWh against the standard $108.9/MWh. | `finance.low_income_tariff_usd_mwh`, `finance.tariff_usd_mwh` |
| Who qualifies | Income threshold `[open]`, linked to existing assistance eligibility. | Eligibility link is unverified |
| Size of the tier | The model assumes 20% of connected households are on the low-income tier. | `extras.cba.note` |
| Why a tier | Rural energy burden. **Not** an environmental-justice claim: the site pack says no designated disadvantaged community is nearby. | Timeline, "Where the calendar actually starts" |
| Price ceiling | The tariff is 0.8 times propane and never above propane. | `finance.tariff_rule` |
| Bill cap | Low-income households' bills capped at their prior 12-month heating spend. | Proposal |
| No winter disconnection | No disconnection for non-payment in winter for low-income members. | Proposal |
| Connection cost | Capped, financeable over `[N]` years on the tariff, waived for low-income members. No up-front barrier. | Proposal; amount `[open]` |
| Keep your old system | Customers may keep their existing propane or oil system as backup. Network heat is a supplement, not the only source. | `docs/risk-matrix.md` heat-continuity cascade, step 4 |
| Disclosure | Plain-language bill showing heat used, tariff, propane comparison and any curtailment. | Proposal |
| Priority in a shortage | When heat falls short, vulnerable customers are shed last. | `docs/risk-matrix.md` heat-continuity cascade |
| Dispute path | Independent reviewer, then the member-elected board. Whether the Public Service Commission has a role is **unverified**. | `research/verification.md` rows 11a to 11d |

The model's household saving ($735/yr, `finance.household.savings_vs_propane_usd`) is for a typical home that burns propane today. A household on natural gas would not save at this tariff, because gas is cheaper (`finance.incumbent_usd_mwh.natural_gas` = $64.2/MWh). We do not target gas customers.

---

## 6. Governance

| Item | Proposed position |
|---|---|
| Owner | The Thermal Commons co-op, a community thermal co-op. Legal form is **open** (section 8). |
| Members | Heat users who connect: on-site anchors, households, growers and the school district. Membership is tied to buying heat. |
| Votes | One member, one vote. Anchors do not get extra votes for being large. |
| Board | Elected by the members, **plus one seat appointed by the Town.** Total board size `[N]` is open. |
| TeraWulf | A **non-voting** seat. TeraWulf has no vote on tariffs, board elections or the 0.8 rule. |
| Cooling | The cooling-priority clause (2.3) is not subject to a board vote. |
| Money | Cost-based, non-profit pricing. Surplus above cost goes back to members in proportion to heat bought (patronage). Windfall reopener from 2.2. |
| Transparency | Annual public meeting. Public dashboard and annual statement (section 4). |
| Operations | Hire O&M expertise under a concession-style contract. Ownership stays with members (`ownership-deal.md` section 2). |
| Fallback | If a co-op cannot be formed or financed, a town-chartered entity takes the same agreements and the co-op becomes a member association. |

---

## 7. Timeline and decision gates

Consistent with [proposal/12-implementation-timeline.md](proposal/12-implementation-timeline.md). This is a condition-of-approval schedule, not a construction forecast. Dates other than TeraWulf's "operations approximately 2029" and the 30 April 2031 permit expiry are working assumptions. Every gate is pass or fail, and a later phase cannot start because time has passed.

| Gate | Target | What it decides for this term sheet |
|---|---|---|
| **G0** Town choice | 31 March 2027 | Board narrows or tables a ban and agrees to negotiate a binding covenant. If a ban is enacted and final, **stop**: no design spend, no co-op assets. |
| **G2** Legal form | Counsel memo by 30 June 2027 | A vehicle that can own pipe, sign the HSA and bill members. |
| **G3** CBA and HSA signed | 30 September 2027 | Terms in sections 2 to 6 executed and recorded. Term sheet only, no construction. |
| **G1** Lawful data-center approval | 31 March 2028, only if G0 passed | Approval the Town recognizes as lawful, with this CBA and HSA attached as conditions. No heat construction before it. |
| **G4** Scope freeze | With G3 | On-site users only: greenhouse, aquaculture, recreation. No 14 km main added on the way. |
| **G5** Heat with first energized IT | About the second half of 2029 | Minimum-availability schedule in force. If the data center slips, the heat users slip with it. |
| **G6** Corridor clusters | Go or no-go by 31 March 2031 | A signed cluster passes the density screen, costs no more than propane, and has funded building heat pumps. The full corridor fails today. |
| **G7** Town-center main | Re-test by 30 June 2032 | Failed on current numbers (`rings[town].passes_gate` = false; `rings[town].lcoh_usd_mwh_7pct` = $734.2/MWh; `rings[town].pipe_km` = 14.0). **No construction in this window.** |

Also on the calendar: a covenant audit by 31 January 2031, before the water permit expires on 30 April 2031, and a public mid-term review by 30 June 2032. With the 10-year term counted from heat operation in about 2029, the initial term would run to about 2039, so 2032 is a review, not an expiry.

The Town ring is refused, not forgotten: it costs $734.2/MWh against propane at $136.1/MWh (`rings[town].lcoh_usd_mwh_7pct`, `finance.incumbent_usd_mwh.propane`), and this term sheet does not commit anyone to build it.

---

## 8. Open items and what needs counsel

### 8.1 Needs counsel (a New York lawyer)

1. **Legal form of the co-op.** Which statute it would form under, whether it can own pipe and sell heat, how patronage and tax work, and whether selling heat to households brings Public Service Commission jurisdiction. Unverified (`research/verification.md` rows 11a to 11e).
2. **The Town's power to attach each condition in section 4.** We have cited no authority and none is assumed.
3. **Whether a town can form or run a thermal utility** (the fallback). Town Law section 190 does not list a heating district (row 11d).
4. **Enforceability of the CBA and HSA** against assignees, including recording against the ground lease and the landlord's signature.
5. **Whether the water covenant can bind the permit holder** and how it interacts with the permit renewal in 2031.
6. **Executive Order 62.** Whether it covers Lake Hawkeye is unverified (`research/verification.md` row 2b). We do not claim it helps or hurts.
7. **Tax.** Whether a heat co-op can use direct-pay credits, and whether a waste-heat network qualifies for any federal credit. The base case assumes none (`extras.funding.note`).

### 8.2 Needs TeraWulf or engineering data

- Data-center supply and return temperatures, and the cooling-plant design-lock date, to set `[X]`, `[T]`, `[Y]` and `[N]`.
- A month-level operations date inside "approximately 2029".
- Whether any DEC application was complete before 14 July 2026.

### 8.3 Open numbers (blanks left on purpose)

- Decommissioning reserve in dollars, and whether it also covers the replacement source ($10.35M, `finance.dc_exit.replacement_source_musd`).
- CBA payment term and indexing, and the cap and share in the windfall reopener.
- Noise limit, connection-fee level, income threshold, co-op board size, and notice lengths `[12]`, `[24]`.

### 8.4 Open modeling and fact questions

- **What "fixed" refers to** in the 0.8 x propane rule: the multiple only, or the propane reference too, and how often it resets.
- **The propane price** behind $136.1/MWh is a model input and not a verified local price (`research/verification.md` rows 7a, 7b). Every dollar tariff and saving above moves with it.
- **The 20% low-income share** is a model assumption (`extras.cba.note`), not a survey.
- **The 150 MW base case** is our assumption. TeraWulf states about 400 MW gross, 320 MW critical IT, with no phase split (row 3a). The model's heat cost does not change across 75 to 320 MW because demand is the constraint (`finance.tornado`, "Data-center IT load").
- **Where the exit numbers live.** The brief called them extras. In the file they are under `finance.dc_exit`, not under `extras`.
- **Phase 1 only CO2.** The headline `impact.co2_avoided_t_yr` = 11,408 t/yr counts phases 1 and 2 fully built. Until Gate 6 passes, do not quote it as the Phase 1 result (timeline, HDR table).
- **Food processing** is in the concept but has no load in `site2.json`.
- **Acreage conflict** between sources (item 3.2, Land).
- **No customer has signed.** Demand for the on-site ring is modeled, not contracted.

### 8.5 What this document does not do

It does not claim TeraWulf will agree, the Town will adopt these conditions, or the co-op can be legally formed as described. It does not claim heat reuse saves lake water. It does not claim the corridor or the town center should be built. Those two rings fail our own cost test or are gated.

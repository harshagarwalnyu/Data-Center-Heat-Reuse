# Ownership and Deal Structure (Site 2, Lansing NY, "Lake Hawkeye")

Lane output, 2026-10-03. Legend: **FACT** = sourced, tagged `(verified 2026-10-03)`. **PROPOSAL** = our design choice, not a fact. **ASSUMPTION** = our input. `[unverified]` = could not confirm; do not quote on stage.
Paths like `DATA_HEAT p.34` mean `resources/text/DATA_HEAT_-_Sector_Couling_...3MAR26.txt`, "Appendix A" = the policy-framework appendix inside that file (printed page numbers), "App B slide N" = the Task 1 slide deck inside the same file. `facts-site2` = `research/facts-site2.md`.

Context (FACT): Town Board directed its attorney to draft a data-center ban on 2026-09-29, and $500,000 is proposed in next year's budget for legal costs, not an existing reserve (`research/verification.md` rows 1a, 1c, verified 2026-10-03). The project website describes phase 1 as ~150 MW (developer's plan, basis unstated); TeraWulf's filing says about 400 MW gross / 320 MW critical IT with no phase split (row 3a). We use 150 MW as our modeled base-case ASSUMPTION: 150 MW x 8,760 h x 0.8 = 1,051,200 MWh of electricity, which is an assumption-derived figure, not a verified one. The deal is the pitch: "conditions under which Lansing could say yes."

---

## 1. Ownership model comparison

| | **A. TeraWulf-owned** | **B. NYSEG utility thermal network (UTENJA)** | **C. Community thermal co-op (alternative: municipal thermal utility)** | **D. Third-party concession (ESCO/DBFOM)** |
|---|---|---|---|---|
| Who funds capex | TeraWulf balance sheet (ITC if taxable: 6% base, 30% only with prevailing wage or under 1 MW, conditional, see s5) | NYSEG; recovered from ratepayers if PSC approves (rate base) | Public/co-op debt + grants + direct-pay ITC (only if entity is an "applicable entity", see note 3) | Concessionaire equity/debt; repaid by tariff + availability payment from town or TeraWulf (PROPOSAL) |
| Who earns | TeraWulf (heat sales; or gives free as goodwill) | NYSEG regulated return | Members/town; Danish-style non-profit, cost-based price (note 2) | Concessionaire margin over term |
| Heat-supply risk (DC exits, curtails) | TeraWulf holds it, but it is also the party whose uptime is the priority | Spread to ratepayers/PSC process | Held by the utility; needs reserve + backup boilers | Concessionaire, priced into the fee |
| Construction/demand risk (uptake) | TeraWulf | Ratepayers (pilot-scale); PSC staged review | Town/members; weakest balance sheet | Concessionaire or town, by contract |
| Political trust in Lansing | **Lowest** (it is the party under ban threat) | Medium (NYSEG is unloved, see facts-site2: gas moratorium since February 2015; its 2026 status is unverified, `research/verification.md` rows 6a, 6c) | **Highest** (community control, answers the ban) | Medium (private again) |
| Regulatory fit | No utility status needed for on-site ring; selling to households may trigger PSC jurisdiction [unverified] | Native: UTENJA lets gas and electric utilities develop, own, operate thermal energy | Muni systems exist in NY; UTENJA/PSC guidance covers IOUs and LIPA, not munis [unverified for Lansing authority] | Depends on town contract law [unverified] |
| Speed | Fastest | Slowest (staged PSC review) | Medium | Medium |

Precedents and sources (all `(verified 2026-10-03)` unless marked):

1. **A.** Deep Green: DC owner supplies and installs the boiler, pays the electricity, gives heat free (DCD 2023, https://www.datacenterdynamics.com/en/news/uk-data-center-startup-offers-to-heat-britains-swimming-pools-with-waste-heat/ via research/case-studies.md). Scale is a 28 kW pool, not a 150 MW town; precedent for price, not for network ownership.
2. **B.** UTENJA: S9422 (2022) lets gas and electric utilities "develop, own, operate" thermal energy (DATA_HEAT App B slide 59, p.141). Utilities proposed 13 pilots, DPS approved ten to engineering (same slide). NYSEG Ithaca pilot: 27 residential + 8 non-residential + 1 church building (3/2026 NYSEG/RG&E report, `research/verification.md` row 8-bldg); Stage 2 is filed and awaiting DPS with no later stage begun in that report (row 8-status); $35.45M is the initial pilot development cost and $52.48M the forecast for Stages 1-5 (row 8-cost). Earlier figures (https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BD0C5F097-0000-CD58-8606-053FB4284E6A%7D&DocTitle=2025-07-09+NYSEG+Ithaca+UTEN+Pilot+Stage+2+Filing+-+PUBLIC+%2822-M-0429%29; the 7/2025 filing counts differ and the $13.5M "first proposed" figure is unsupported per row 8-cost). Cost growth and staging delay are the lesson; no overrun multiple is claimed. UTEN pilots can use data-center heat (DATA_HEAT App B slide 28 area, p.114-115).
3. **C.** Denmark: cooperative or municipal ownership for most district-heating companies (DATA_HEAT Appendix A p.26); 323 co-ops, ~34% of heat sold in 2019, price cannot exceed cost of production (non-profit principle) (https://danskfjernvarme.dk/english/english/the-danish-model and https://www.sciencedirect.com/science/article/pii/S1364032122000466, search summaries). Markham District Energy is municipally owned and takes heat from Equinix TR5 (DATA_HEAT App B slide 27, p.109; https://blog.equinix.com/blog/2025/04/24/the-hidden-benefit-of-data-centers-warming-communities-not-just-servers/). Jamestown NY BPU runs a municipal district-heating division, 72 customers (https://www.jamestownnybpu.gov/351/Reliable-Power and https://www.nyserda.ny.gov/About/Publications/Featured-Case-Studies/City-of-Jamestown, search summaries).
4. **D.** Paris Climespace runs under a concession (district cooling, 215 MW, ~570 customers) (iGRID_Playbook p.51). CBS white paper: heat-network operators best placed as developers, third-party ESCOs "a close second" (CBS_Data_center_white_paper p.20). No NY waste-heat concession precedent found [unverified].

Notes:
- (2) Sourcing for the Danish cost-based rule is a search summary; the DATA HEAT file confirms the cooperative/municipal ownership and that a surplus-heat price cap was removed in early 2025 (Appendix A p.15).
- (3) Section 6417 direct pay: applicable entities are tax-exempt orgs, state/local governments, and **rural electric cooperatives** (https://www.federalregister.gov/documents/2023/06/21/2023-12798/section-6417-elective-payment-of-applicable-credits, search summary). A heat co-op is **not** automatically eligible; a town or town-created public entity is. This favors municipal over co-op on federal credit alone; we accept that cost, see section 2.
- Cross-model fact: DATA_HEAT says supply-side risk is the main barrier; many DCs plan on a 10-year horizon and will not guarantee heat longer (Appendix A p.34).

## 2. Recommendation

**PROPOSAL (decided by the team, 2026-10-04): Model C, structured as a community thermal co-op, with a concession-style O&M contract (borrowing from D) and NYSEG as a later Phase 3 partner option.** The municipal (town-chartered) thermal utility was the alternative we considered and is kept as the fallback. Reasoning:

1. **Community control.** Households, growers and the school district hold membership and elect the board, with one Town-appointed seat. Heat that members own and price at cost is the one concession that cannot be read as TeraWulf PR, and it does not depend on a Town Board that is currently drafting a ban to also become a utility operator. Model A fails this test; it is the opposite of the ask.
2. **A direct answer to the ban politics.** The ask to the town is not "approve the data center and trust us" but "make approval conditional on a recorded Community Benefit Agreement and Heat Supply Agreement with a community-owned counterparty". A co-op is that counterparty without asking a skeptical Town Board to take on debt, staff or liability, which a municipal utility would.
3. **Member patronage returns.** A co-op returns surplus to members in proportion to heat bought (patronage), consistent with cost-based, non-profit pricing (the Danish pattern, precedent 3: 323 co-ops, about 34 percent of heat sold in 2019). Any windfall above the tariff rule flows back to members, not to a third party.
4. **Risk fit.** The DC cannot promise more than 10 years (Appendix A p.34), so the long-lived assets (pipes, community side) must sit with a patient owner whose members have a long-term stake, while TeraWulf owns only a replaceable heat-extraction skid. The HSA step-in right and decommissioning bond protect the co-op.
5. **Why not the municipal utility (the alternative).** It has real advantages: local governments are applicable entities for Section 6417 direct pay, and it carries public-debt access and sovereign-style trust (note 3). We still prefer the co-op because it puts control with the people who pay the bills, keeps the heat business out of Town Board politics, and avoids loading a small town's balance sheet with the weakest-credit part of the project. Cost of the choice: a bare co-op may not qualify for direct pay, so the base case assumes no federal credit anyway (`finance.incentives`), and the co-op can ask the town to hold the tax-exempt financing or the interface assets if counsel confirms a structure. **Fallback:** if a co-op cannot be formed or financed, the same agreements can be assigned to a town-chartered utility.
6. **Why not B.** UTENJA is the cleanest ratepayer-protection regime and gives NYSEG capital, but pilots are slow and staged, the Ithaca pilot carries $35.45M initial development cost and a $52.48M Stages 1-5 forecast (`research/verification.md` row 8-cost), NYSEG is the utility behind the Lansing gas moratorium, and a 150 MW source against a ~4,450-household town (facts-site2 s2) is not its pilot shape. Keep as a Phase 3 partner (town-center main).
7. **Why not D alone.** A concessionaire needs a creditworthy off-taker; the co-op, not the concessionaire, is the entity the public trusts. Hire the O&M expertise (the co-op does not have it) via concession, keep ownership with members.

**[unverified] New York co-op law for thermal networks.** We have not confirmed which New York statute a thermal co-op would be formed under (for example the Cooperative Corporations Law versus a not-for-profit corporation), whether selling heat to households triggers Public Service Commission jurisdiction, or how patronage returns and tax treatment would work for a heat co-op. What is sourced (`research/verification.md` rows 11a-11d, verified 2026-10-03): Public Service Law section 66-t tells the PSC to exempt small-scale thermal networks not owned by utilities, Town Law section 190 does not list a heating district, and a nonprofit-cooperative carve-out exists in the PSL steam definition where steam is produced solely for members, but whether hot-water service fits it is unverified. The Danish and rural-electric-co-op precedents are not New York law. Needs a co-op and municipal-law check before the pitch states the structure as feasible. The same question for a town-owned utility is also unverified.

---

## 3. Term sheet: Heat Supply Agreement (HSA) between TeraWulf/Lake Hawkeye LLC and the Thermal Utility (the community thermal co-op)

All bullets are **PROPOSAL** unless a source is attached. Bracketed values are placeholders to fill from the engineering model.

| Term | Proposed position | Basis |
|---|---|---|
| Parties | Lake Hawkeye LLC, **Cayuga Operating Company LLC (landlord, holds the water permit)**, the Thermal Utility. | Permit holder is the landlord, not TeraWulf (facts-site2 s1, cornellsun.com 2026-04-16, verified 2026-10-03). |
| Heat price | **Near-zero.** $0/kWh_th for waste heat. Utility pays only metered incremental costs it causes (pumping, HX maintenance). Windfall reopener: if the utility's realized margin exceeds a set cap, a share can be shared back. | Deep Green gives heat free (DCD). DATA_HEAT App B slide 46: no-cost heat near term, may change on windfall. DC benefit is small anyway (<5% OPEX, p.21), so a price mostly buys friction. |
| Term | Initial **10 years**, then automatic 5-year renewals unless DC gives 24 months notice with a funded wind-down (see decommissioning). | CBS p.20: ten-year contracts with exit clauses are the trend; Appendix A p.34: DCs resist longer guarantees. Ground lease is 80 years (facts-site2 s1). |
| Minimum delivery | **Availability, not volume:** make available at least [X MW_th] at [>= T deg C supply] for [>= Y%] of hours, excluding curtailment events. No take-or-pay on TeraWulf for heat it cannot export. | X, T, Y [unverified]; DC supply/return temperatures are an open question in facts-site2 (Open Questions #2). |
| Curtailment | TeraWulf may curtail any time, no penalty, no liability, by a hard-wired closed-loop bypass. Notice target: [N minutes] where feasible; zero where cooling is at risk. Utility must hold backup heat (electric/propane boiler + storage) for its own customers. | Utility bears supply risk; PLAN.md hard constraint. |
| **Cooling-always-wins** | The HSA is subordinate to DC cooling. Heat-side load, pump trip, or HX fault must **fail safe to the dry coolers**; no DC temperature setpoint is changed to serve heat; no heat-side event is a DC default or SLA breach. DC may add cooling capacity without consent. | PLAN.md: "sidestream only." DATA_HEAT App B slide 50: DCs treat uptime as paramount, will decline projects that add risk. |
| Tenant change / DC exit / step-in | (a) Heat obligation and CBA run with the ground lease and bind any assignee or new tenant. (b) 24 months notice of cessation, with the utility holding a **first-refusal / step-in right** to buy or operate the site-side HX skid at depreciated value. (c) If an AI/HPC tenant changes its coolant temperature, TeraWulf must give 12 months notice and bear the cost of keeping the interface at or above agreed [T]. | DATA_HEAT Appendix A p.34 (closures/relocations are the main supply risk). |
| Decommissioning reserve | Letter of credit or escrow funded by TeraWulf, sized by formula: `Reserve = stranded unrecovered capex of shared assets + removal cost of site-side equipment + transition-heat fund for connected customers for [N] heating seasons`. Amount [unverified]; not yet computable. Release schedule tied to utility debt amortization. | Our design; the loop is shared infrastructure with a short-lived source. |
| Water covenant | TeraWulf and landlord covenant **not to use any part of the 1,008,000 gal/day DEC withdrawal for process or evaporative cooling or misting**, and not to seek a new/expanded withdrawal for cooling, for the life of the lease. Breach = CBA default + utility step-in rights on the site HX. | Permit figure 1,008,000 gal/day, renewed April 2026, limited to maintenance, sump pumping, dust control (facts-site2 s1, https://cornellsun.com/2026/04/16/dec-renews-water-permit-cayuga-power-plant/, verified 2026-10-03); local skepticism about summer misting (facts-site2 s1). Note: heat reuse does **not** save lake water; the covenant is a promise, not a saving (facts-site2 s8.1). |
| Noise | Heat-extraction and pumping equipment must not raise levels above [limit set from Lansing noise code at the receiving property line]. Dry-cooler noise is outside the HSA, handled in the CBA. Number [unverified]; no verified local noise standard found. | |
| Metering and data | Utility-owned BTU meter at the interface; monthly kWh_th and temperature data shared with the town. | iGRID_Playbook p.5: BTU-meter billing is standard in district energy. |
| Reporting | TeraWulf may count exported heat in its ERF/ESG disclosure; utility must give a signed annual heat statement. | See s6. |

## 4. Term sheet: Community Benefit Agreement (CBA) between the Town and TeraWulf/Lake Hawkeye LLC, with utility as third-party beneficiary

All **PROPOSAL**.

| Term | Proposed position |
|---|---|
| Binding form | Contract recorded against the ground lease; enforceable by the Town; conditions TeraWulf's site approvals. Survives assignment. |
| Heat commitment | HSA (s3) is an exhibit. Failure to build or maintain the heat interface by [date] triggers permit-condition remedies. |
| Connection fee vs tariff | **Connection fee**: cap at [low flat amount], financed on-tariff over [N years] so no up-front barrier. **Tariff**: fixed capacity charge + volumetric $/kWh_th, cost-based, non-profit, reviewed annually. Price test: delivered cost must sit below propane (facts-site2 s4: propane $0.125/kWh_th, oil $0.156 delivered, verified 2026-10-03). Do not target gas customers ($0.064/kWh_th). Precedent for protection: NYSEG Ithaca proposes billing on existing gas/electric use and refunding the thermal fee if it exceeds protection limits (Stage 2 filing above, search summary, [unverified detail]). |
| Low-income tier | Households at or under [income threshold; link to HEAP/EmPower eligibility, [unverified]] get a lower fixed charge and a bill cap equal to their prior 12-month heating spend; no winter disconnection. Rationale is rural energy burden, **not** EJ status: no designated disadvantaged community near the site (site pack p.24, facts-site2 s2, verified 2026-10-03); town poverty rate 13.4% (facts-site2 s2). Senior priority: Woodsedge Apartments (facts-site2 s3). |
| Local anchors | Free or discounted heat to greenhouse/aquaculture on-site ring; priority hiring from Lansing for utility and ring-1 jobs (50+ job claim in research/site-selection.md is **[unverified]**, not repeated here). |
| Water | Water covenant as in HSA (s3). Independent monitoring and annual public report. |
| Noise | Property-line limit set by Town code [unverified]; third-party monitoring; stop-work remedy. |
| Land | Dedicate [acres] of buffer land to a community agri/energy park on long lease at nominal rent. The acreage is unsettled: PLAN.md says ~250 unleased acres; facts-site2 says a 183-acre leased site [conflict, resolve before pitch]. |
| Governance | Member-elected board with one Town-appointed seat; TeraWulf gets a non-voting seat; annual public meeting. Danish-style cost transparency (precedent 3). |
| Dispute and remedies | Escalation to independent engineer; liquidated payments to the utility fund for HSA breach (not for curtailment); cure periods. |

## 5. Revenue and connection model (Model C, PROPOSAL)

Price inputs: NYSEG rates are verified; the propane ($0.125/kWh_th) and heating-oil ($0.156/kWh_th) inputs and every tariff and break-even figure derived from them are UNVERIFIED and illustrative (the cited $2.849/gal propane is unsupported for Central NY, and $5.186/gal oil is a Central monthly average, not a late-September weekly price; `research/verification.md` rows 7a, 7b; the model base is propane $3.10/gal); COP values are facts-site2 **ASSUMPTIONS**; the tariff level is our **ASSUMPTION**.

| Stream | Payer to utility | Formula / level | Status |
|---|---|---|---|
| Heat purchase from TeraWulf | Utility pays TeraWulf | `$0` (near-zero) | PROPOSAL |
| Residential/commercial heat tariff (volumetric) | Customer | `Tariff = k x propane delivered`; with `k = 0.75`, tariff = 0.75 x $0.125 = **$0.094/kWh_th** | k is ASSUMPTION; $0.125 is illustrative and unverified |
| Utility electricity cost for heat pump lift | Utility | `$0.245 / COP`: **$0.070** at COP 3.5, **$0.054** at COP 4.5 per kWh_th | NYSEG rate FACT; COP ASSUMPTION |
| Gross margin before capex/O&M | | `0.094 - 0.070 = $0.024` to `0.094 - 0.054 = $0.040` per kWh_th ($24 to $40 per MWh_th) | arithmetic on above; thin, so grants matter; ITC is upside only |
| Capacity (fixed) charge | Customer | `$/kW_th contracted/yr` set to recover [x%] of debt service | level [unverified] |
| Connection fee | Customer, financeable | `Fee = trench + HX per household, minus grants/ITC` ; low-income waiver | level [unverified]; rural trenching $200 to $400 per ft in research/site-selection.md (not independently checked) |
| Anchor contract (greenhouse/aquaculture) | Operator | Low heat price per kWh_th plus minimum annual take; soaks summer surplus | PROPOSAL; demand [unverified] |
| Federal ITC (Section 48, geothermal heat pump property) | Treasury, via direct pay only if the owner is an applicable entity (town-owned yes; co-op [unverified]) | 6% base, multiplied by five (30%) only with prevailing wage and apprenticeship or a project under 1 MW; Energy Community +10 points is conditional and the site designation is unverified; applies only to eligible basis; waste-heat networks do not automatically qualify as geothermal heat-pump property | see note |
| State grants | NYSERDA | PON 5614 large-scale thermal; FlexTech up to 50% of studies; NYSEG NPA program for Lansing (facts-site2 s6, s2) | amounts [unverified] |
| TeraWulf contribution | TeraWulf | Capital contribution for site-side skid and a seed decommissioning reserve | amount [unverified] |

Note on ITC: post-2025 law keeps Section 48 for geothermal heat pump property (6% base, x5 = 30% with prevailing wage and apprenticeship or under 1 MW) for construction beginning before 2033, stepping down to 5.2% base (2033) and 4.4% base (2034), with nothing for construction beginning in 2035 or later (`research/verification.md` row 9b; https://www.eidebailly.com/insights/alerts/2025/obbb-energy-credits, search summary, verified 2026-10-03). **Whether a waste-heat-sourced heat-pump network, not a ground-source loop, qualifies as "geothermal heat pump property" is [unverified]**; see https://walker-blue.com/can-district-and-campus-geothermal-projects-qualify-for-the-federal-itc/ for the open question. Treat ITC as upside, not base case, until tax counsel confirms. facts-site2 s6 lists it as active without this caveat.

Break-even condition for customers (arithmetic, not a claim): tariff must sit below propane $0.125 and oil $0.156 per kWh_th delivered (facts-site2 s4) after any customer-side equipment cost. Annual household heat demand H is **[unverified]**; savings per household = `H x (0.125 - tariff)` for a propane household.

## 6. Quantified value to TeraWulf

Honest headline: **direct cost savings are small; the value is permit survival.** DATA_HEAT: avoided CAPEX from heat reuse is "<<5%" of DC CAPEX (p.20) and OPEX savings are typically <5% at ~15% heat reuse, with a <25% theoretical bookend (p.21; App B slide 49, citing a 2025 EU study, average EU reuse ~15%). In some free-cooling cases total cooling power can even rise (p.21).

| Value channel | Formula | Inputs and status |
|---|---|---|
| **Permit / social-license risk** | `Value = (P_approve with deal - P_approve without) x NPV of project` | Both probabilities and NPV **[unverified]**; do not state a dollar figure. Evidence of the risk is **FACT**: ban draft and $500,000 proposed for next year's legal budget (not a reserve); Article 78 suit allowed to proceed April 2026; Tompkins County Jan 2026 resolution (facts-site2 s1, verified 2026-10-03). DATA_HEAT p.22: without heat reuse, "the project may not happen at all" where social license is the issue. |
| **Fan / dry-cooler energy saved** | `E_saved = Q_exp x f_fan`, `Q_exp = s x 1,051,200 MWh_th`; `Savings$ = E_saved x P_elec` | 1,051,200 MWh is FACT-derived (PLAN.md). Every 1% exported (s = 0.01) is 10,512 MWh_th. `f_fan` (fan kWh per kWh_th rejected), `s`, and TeraWulf's power price are **[unverified]**. Offset by pumping power and HX O&M. Reference only: CBS says a 10 MW DC can save >1M EUR/yr cooling cost in its European case (p.20); do not scale linearly to 150 MW. |
| **ESG / ERF reporting** | `ERF = E_reused / E_total_DC` (Green Grid metric; definition not in repo, **[unverified]**). With export share s: `ERF ~ s x (heat captured / total energy)` | EU requires ERF reporting for DCs over 500 kW (EED 2023/1791; DATA_HEAT Appendix A p.20-21). Investors and tenants use ERF to compare sites (p.21). ESG-linked loans can tie margin to ERF (Appendix A p.30). Caveat: heat recovery can worsen PUE (Appendix A p.21, fn 26). US requirement: none found, voluntary [unverified]. |
| **Tenant attraction** | qualitative | DC interests include tenant attraction and retention and enhanced environmental performance (DATA_HEAT p.19). No $ value. |
| **Cost to TeraWulf (offset)** | Site-side HX skid + controls + decommissioning reserve + covenant compliance | All **[unverified]** until engineering model. |
| **Bitcoin-heat perception** | risk | DATA_HEAT App B slide 51: heat from HPC viewed negatively when it is bitcoin mining. TeraWulf is pivoting to AI/HPC (facts-site2 s1). Keep the HSA tied to HPC/AI workload language. |

## Lane status

**Done:** four-model comparison with sources; one recommendation (community thermal co-op, concession-style O&M, NYSEG as a Phase 3 partner; municipal utility as the fallback); HSA and CBA term sheets; revenue table with traceable inputs; TeraWulf value table.

**[unverified] / weak sourcing (do not present as fact):**
- NYSEG Ithaca pilot cost ($35.45M initial pilot development, $52.48M Stages 1-5 forecast), Danish co-op share (323 co-ops, 34%), Jamestown 72 customers, Section 48 phase-down dates, Section 6417 eligibility: taken from web-search summaries; the primary PDFs/pages were not opened (one NYSEG page fetch timed out).
- Whether NY law supports a community thermal co-op (formation statute, PSC jurisdiction, patronage and tax treatment); whether a NY town can legally form and charge for a thermal utility; whether PSC jurisdiction would attach to any sale to households.
- Whether a waste-heat heat-pump network qualifies for Section 48; the Energy Community adder on that network.
- All dollar values for TeraWulf (approval probability, project NPV, fan-energy ratio, power price, export share), decommissioning reserve size, connection fee, capacity charge, grant amounts.
- Noise limit and minimum-delivery numbers (X, T, Y); DC supply/return temperatures (open question in facts-site2).
- Jobs claim (50+) from research/site-selection.md; trenching $/ft; Green Grid ERF definition.

**Gaps and conflicts:** acreage conflict (PLAN.md ~250 unleased acres vs 183-acre lease in facts-site2); the DEC permit is held by Cayuga Operating Company LLC, so the landlord must sign the water covenant; the 10-year DC horizon vs a 25-year price-index pledge floated in research/site-selection.md (we use 10-year initial term plus renewals); no NY waste-heat concession precedent found for Model D; the web-search tool's UTENJA/PSC detail on third-party heat sources and cost recovery was not found.

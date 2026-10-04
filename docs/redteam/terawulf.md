# Red team: TeraWulf CFO — why sign the HSA / CBA?

**Role.** CFO of TeraWulf Inc. (Nasdaq: WULF). The proposed contracts are a Heat Supply Agreement (HSA) and a Community Benefit Agreement (CBA) with the Thermal Commons co-op at Lake Hawkeye, the former Cayuga coal plant in Lansing, Tompkins County, New York. Team: Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev.

**Question.** Why would we sign? What do we gain and what do we give up? Which terms block a signature? What is the version a CFO can recommend to the board?

**How to read this.** The term sheet in `docs/ownership-deal.md` is a PROPOSAL. Dollar figures from `web/public/data/site2.json` (generated 2026-10-04) are MODEL outputs; most capex lines in that file are marked ASSUMPTION. `research/verification.md` overrides older fact sheets. Claims below carry a source. Anything this memo could not confirm is `[unverified]`.

**Verdict, up front.** I would sign a short, conditional, subsidiary-level covenant: a sidestream flange that fails safe to the dry coolers, heat at zero commodity price, a 10-year term that expires unless we opt in, and a host payment capped at the site interface. I would not sign the term sheet as written. The political value is real. The $26 million corridor check, the 80-year water option, the automatic renewal, and a step-in on the cooling loop are not the price of that politics.

## 1. What we are being asked to sign

Two contracts, both PROPOSAL in `docs/ownership-deal.md` sections 3 and 4. The counterparty on the heat side is the Thermal Commons co-op (called the Thermal Utility in that file). The town is the CBA party, with the co-op as third-party beneficiary.

**HSA (Lake Hawkeye LLC + landlord + co-op)**

| Term as drafted | What it does to us |
|---|---|
| Parties include Cayuga Operating Company LLC | The water permit sits with the landlord, so the parent company's signature is not enough. |
| Heat price $0/kWh_th; co-op pays metered pumping and HX maintenance | We give away a stream we currently throw into the air. |
| 10 years, then automatic 5-year renewals unless we give 24 months' notice and fund a wind-down | Default is "still on," not "over." |
| Availability floor: at least [X] MW_th at [T] °C for [Y]% of hours. X, T, Y are blank. | A second uptime metric, with the numbers not set. |
| Curtail any time, no damages, hard-wired bypass; co-op holds its own backup | This is the clause that makes a signature possible. |
| Cooling-always-wins: heat-side fault fails safe to the dry coolers; no setpoint change; no heat event is a tenant SLA breach; we may add cooling without consent | Same. Keep it. |
| Obligation runs with the ground lease and binds assignees | Encumbers the 80-year lease and any sale. |
| Co-op step-in to buy or operate the site heat-exchanger skid at depreciated value | Puts a third party on our cooling loop. |
| If a tenant changes coolant temperature, we pay to hold the interface at the agreed T, on 12 months' notice | Contradicts cooling-always-wins. |
| Letter of credit sized to stranded shared-asset capex + skid removal + transition heat for connected customers. Amount blank in the term sheet. | Can become a guarantee of the co-op's pipe debt. |
| Water covenant: no use of the 1,008,000 gal/day permit for process or evaporative cooling, and no new cooling withdrawal, for the life of the lease. Breach = CBA default + step-in on the exchanger. | An 80-year option kill, with a cooling remedy. |
| Aggregated heat statement so we may report ERF | Acceptable if it stays aggregated. |

**CBA (Town + Lake Hawkeye LLC, recorded on the lease)**

| Term as drafted | What it does to us |
|---|---|
| Recorded; conditions site approvals; survives assignment | Our land-use right depends on a contract with a co-op that may not yet exist. |
| Failure to build the interface by a date triggers permit remedies | A calendar default while operations are not contemplated until about 2029. |
| Tariff must sit under propane; low-income tier; free or discounted heat to on-site anchors | The price promise is the co-op's. If the gap is ours, it becomes our subsidy. |
| Dedicate buffer acres at nominal rent | Acreage outside the 183-acre lease is not ours to give. |
| Town appoints the co-op board; we get a non-voting seat | We can be invoiced by a board we do not control. |
| Liquidated payments for HSA breach, not for curtailment | Acceptable only with a dollar cap and a cure period. |

The model's own funding ask, which the term sheet leaves blank, is in `site2.json` `extras.cba`: whole-project present-value gap **$26.01 million** at 7% over 30 years, annuitized **$2.096 million per year**. Headline basis in that file: **1.73%** of an assumed **$1,500 million** campus. The corridor alone is a **$30.32 million** gap; the file subtracts an on-site surplus of about **$4.3 million** to reach $26.01 million. A parallel field, `as_pct_of_dc_capex`, prints **2.02%**. Quote **1.73% and $2.096 million per year**. The 2% slide figure is the corridor percentage, not the headline the file tells the team to use.

Capex basis for that percentage: "$10 million per MW IT × 150 MW." Turner & Townsend's 2025 index band is cited in the JSON as **US$6.6–13.3 per W**. The $10/W midpoint is an **ASSUMPTION** (`site2.json` `extras.cba.dc_capex_basis`; https://reports.turnerandtownsend.com/data-centre-construction-cost-index-2025/, cited there). It is not a TeraWulf budget.

## 2. What TeraWulf actually is (balance-sheet facts)

These are the facts a signature has to sit on. Older "400 MW heats the town" and "138 MW in 2026" lines are stale.

| Fact | Figure | Source |
|---|---|---|
| Lessee | Lake Hawkeye LLC, a TeraWulf subsidiary. Not the public parent, unless we choose to guarantee. | SEC 8-K, https://www.sec.gov/Archives/edgar/data/1083301/000110465925078086/tm2523008d1_8k.htm (verified 2026-10-03; `research/verification.md` row 3c) |
| Lease | 183 acres, 80 years, no renewal rights, $100 purchase options from year 50. Lessor: Cayuga Operating Company LLC. Lessor's parent, Riesling Power LLC, is owned by TeraWulf's CEO, Paul Prager. | Same 8-K (verified 2026-10-03, row 3c) |
| Land outside that lease | `[unverified]`. A 434-acre / ~250-acre remainder is not established. Ithaca Voice (2025) describes Riesling's purchase as the plant and the surrounding 183 acres. | https://ithacavoice.org/2025/09/environmentalists-sound-alarm-as-plan-to-convert-cayuga-power-plant-to-data-center-advances/ (verified 2026-10-03, row 3d) |
| Capacity we have told investors | About **400 MW gross**, about **320 MW critical IT**. Operations **not contemplated until about 2029**. | Q2 2026 earnings release, 5 Aug 2026, https://www.sec.gov/Archives/edgar/data/1083301/000108330126000162/a_wulfearningsreleaseq22026.htm (verified 2026-10-03, rows 3a, 3b) |
| "150 MW phase 1" | Website figure, three buildings, basis unstated. August 2025 press release of 138 MW expected in H2 2026 is stale. The model uses 150 MW IT as a base case. It is not the filing. | https://investors.terawulf.com/news-events/press-releases/detail/113/terawulf-secures-long-term-ground-lease-at-cayuga-site-to-expand-high-performance-computing-infrastructure (verified 2026-10-03, row 3a); `site2.json` `supply.it_load_MW` = 150 |
| Cooling | Developer states a fully sealed closed loop, food-grade non-toxic glycol, air-cooled dry coolers, no draw from or discharge to Cayuga Lake. The page does not name propylene glycol. Fluid renewal every 7–15 years is a developer statement. Make-up and domestic water are not addressed. | https://lakehawkeyedata.com/closed-loop-cooling (verified 2026-10-03, rows 4a, 4b, 4c) |
| Water permit | Cayuga Operating Company LLC. Up to **1,008,000 gal/day** from Cayuga Lake. Effective **13 April 2026**, expires **30 April 2031**. Permit ID 7-5032-00019/00024. Uses: system maintenance, sump pumping, and dust control. Article 15 Title 15 withdrawal permit, not SPDES. Emergency fire pumps are exempt under 6 NYCRR 601.9 and are not part of that volume. The permit limits uses. It does not, in the words checked, forbid evaporative cooling by name. | https://dec.ny.gov/sites/default/files/2026-04/cayugaoperatingwwpermit.pdf (verified 2026-10-03, rows 5a, 5b, 5c) |
| Heat-reuse plan today | No public heat-reuse design. Rejection path in the developer materials is the dry coolers. | https://lakehawkeyedata.com/closed-loop-cooling (verified 2026-10-03, row 4a). "No announced reuse plan" is the reading in `research/facts-site2.md`; the cooling page itself does not describe a reuse project. |
| Town politics | On **29 September 2026** the Town Board directed its attorney to draft a local law prohibiting data centers. That was not a vote adopting the ban. **$500,000** is in **next year's proposed budget** for legal costs, not an existing reserve. Speaker counts conflict (one outlet: 36 of 38 opposed; Ithaca Voice: two speakers against the ban). Do not quote 36/38 as settled. | https://www.fingerlakes1.com/2026/10/02/lansing-moves-toward-data-center-ban-as-terawulf-debate-reaches-turning-point/ ; https://607newsnow.com/news/258852-town-of-lansing-moving-forward-with-drafting-a-data-center-ban/ ; https://ithacavoice.org/2026/09/lansing-board-data-center-ban/ (verified 2026-10-03, rows 1a, 1b, 1c) |
| County | Tompkins County Resolution 2026-3, adopted 20 January 2026, 14–1, asks DEC for a new application with project-appropriate review. The counties' objection was aimed at an earlier modification application. DEC then issued the renewal above, limited uses, same volume. | https://tompkinscountyny.iqm2.com/Citizens/Detail_LegiFile.aspx?ID=13804&MeetingID=4213 (verified 2026-10-03, rows 5d, 5f) |
| State pause | Executive Order 62 (14 July 2026) holds certain DEC data-center permits of at least 50 MW in abeyance. Whether it covers Lake Hawkeye is `[unverified]`. | https://www.governor.ny.gov/executive-order/no-62-establishing-temporary-moratorium-data-centers-new-york-while-state-develops (verified 2026-10-03, rows 2a, 2b) |
| Equity geography | Hackathon site pack: no disadvantaged communities nearby. Do not sell this CBA as an environmental-justice instrument. | `resources/text/2026_10_01_Hackathon_NYU_-_Suburban_Site_-_Lake_Hawkeye.txt` (verified 2026-10-03) |
| Affordability hook | NYSEG invoked a natural-gas moratorium in the Town of Lansing in **February 2015** (PSC Case 20-G-0131). Cause: capacity / low design-day pressure. Still described as a low-pressure area in NYSEG's gas plan filed 14 July 2025. Status in 2026 is `[unverified]`. | https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BE068C615-B8EE-4CB9-AF92-3153A49BE4E4%7D (verified 2026-10-03, rows 6a, 6b, 6c-update) |
| Co-op as a legal person | Whether New York law lets a heat co-op form, borrow, and sell hot water without a PSC certificate is `[unverified]` (`research/verification.md` rows 11c, 11d, listed as open). Town Law §190 has no heating district. | https://www.nysenate.gov/legislation/laws/TWN/190 (verified 2026-10-03, cited in `docs/research/competitor-teams.md`) |

**Model picture of the heat, not a filing** (`site2.json`, generated 2026-10-04):

- Base: 150 MW IT, load factor 0.8, capture 0.75 at 50 °C → **777.6 GWh/year** available, **88.8 MW** average.
- Phases 1–2 deliver **50,576 MWh/year**, **6.5%** of available heat. At the filing's 320 MW critical IT, the same delivery is **3.0%** of available heat (`extras.scenarios.dc_320MW_full_build.share_of_available_pct` = 3.05). More IT load does not create customers.
- On-site ring (greenhouse, aquaculture, recreation): **37,076 MWh/year** at 45 °C, 0.5 km, levelized cost **$40.6/MWh**.
- Corridor, 500 homes, 20.9 km, 20 °C: **$285.8/MWh**, 0.65 MWh per metre per year.
- Town-center main, 14 km, 65 °C: **$734.2/MWh**, 1,840 MWh/year pipe loss, `passes_gate: false`.
- Propane reference **$136.1/MWh**. Tariff used for the gap: **$108.9/MWh** (0.8 × propane).
- Reported ERF **0.0462** (4.6% of the model's IT energy) and fan energy avoided **970 MWh/year**, at the 150 MW base.
- Year-10 exit: stranded **$5.71 million**, replacement source **$10.35 million**, corridor cost uplift **$93.2/MWh**.
- DC-side sidestream interface: **$2.59 million**, source tag ASSUMPTION.
- Whole network capex in the model: **$38.76 million**, of which the corridor pipe is $9.39 million and 500 building heat pumps are $8.0 million. Those lines are ASSUMPTION.

**Arithmetic on those model outputs, not a TeraWulf account.**

- Fan energy at the model's industrial rate of $108/MWh: 970 × 108 = **$104,760 per year**.
- That is about **5%** of the $2.096 million annual gap payment (104,760 / 2,096,000).
- The skid at $2.59 million is **0.17%** of the assumed $1,500 million campus (2.59 / 1,500).
- The $26.01 million gap is **1.73%** of that same assumed campus, and it buys a corridor the price test fails: $285.8/MWh against propane at $136.1/MWh. The town main, at $734.2/MWh, is a separate and worse pipe.

Direct operating savings are noise next to a 320 MW IT campus. Organizer guidance says the same thing in general: avoided capex from heat reuse is on the order of much less than 5% of data-center capex, and at a typical European reuse share of about 15% the operating saving is on the order of less than 5% of annual operating cost (`resources/text/DATA_HEAT_-_Sector_Couling_Data_Centeres_and_District_Energy_-_Market_Development_Guide_and_Appendicies_-_3MAR26.txt`, main text p. 20 and p. 22, Appendix B slides 49–50). Our modeled reuse share is 6.5% of available heat, below that European average, so the European "<5% of opex" bookend is already an upper reference, not our case.

## 3. Why a CFO would sign (gains)

The only gain that can move the parent-company valuation is permission to build. Everything else is small, and should be described as small so we do not create a disclosure problem.

**1. The town is writing a prohibition, and heat is the condition that makes a yes discussable.**

On 29 September 2026 the board told its lawyer to draft a ban and put $500,000 for legal costs into next year's proposed budget (sources in section 2). The DATA HEAT guide states the CFO's actual reason in one sentence: avoided costs are small, and heat reuse can still matter because it helps a project gain social license, and without that the project may not happen at all (same DATA HEAT file, p. 22). Our filing already tells investors that operations are not contemplated until about 2029. A multi-year local fight sits on the critical path in front of that date.

**ASSUMPTION.** A recorded covenant offered as the condition of an approval is worth more to us than an unsigned sustainability chapter, because the board has already moved past informal reassurance. Reasoning: the 29 September 2026 direction is to draft a prohibition, not to negotiate a benefits menu. The dollar value of the change in approval probability is `[unverified]`. Do not multiply a made-up probability by a made-up project NPV.

**2. The heat is already waste, at a temperature we are not selling to anyone else.**

Commodity price of $0/kWh_th matches the physics and the market. We reject the loop to air today (developer cooling page, section 2). There is no named thermal customer (`docs/proposal/03-users.md`). DATA HEAT's operator view: data centers will not do this for the avoided cost alone; time to market and uptime dominate (Appendix B, slide 50). Giving the heat away is rational. Charging for it would add a negotiation and would not fund the corridor.

**3. We do not have to own the pipes.**

The co-op owns distribution, heat pumps, storage, and backup. We own a replaceable skid. That keeps the model's **$38.76 million** network off our balance sheet. The on-site ring, at **$40.6/MWh** against propane at **$136.1/MWh**, is the only ring that clears a cost test without our cash. Users come to the fence. That is the design a CFO can live with, because it does not ask us to be a rural utility.

**4. Cooling-always-wins is already our design.**

A hard-wired bypass to the dry coolers, no setpoint change, curtailment without damages, and backup heat owned by the co-op: those clauses protect the tenant SLA. RII's operator interviews, as used in this repo, say data centers reject any tie that threatens reliability and want a heat exchanger with unmixed fluids and a bypass (`docs/research/competitor-teams.md`, citing the RII greenhouse paper in `resources/text/`). The organizer heat-reuse primer puts storage, temperature lift, and backup on the heat host (`resources/text/20230623_Data_Centers_HeatReuse_101_3.2.docx.txt`). I will sign that split. I will not sign a design in which the greenhouse is part of the cooling plant.

**5. A 10-year term matches how we already plan.**

DATA HEAT Appendix A, p. 34: many data centers have a 10-year planning horizon and often will not contract longer than 10 years or guarantee waste-heat availability. Our ground lease is 80 years (row 3c). The mismatch is the point. We can offer a decade of heat from whatever IT is actually running. We cannot offer an 80-year thermal utility.

**6. A small, honest ERF number is a tenant-marketing asset, not a US legal requirement.**

The model reports ERF of 4.6% at the 150 MW base. EU Energy Efficiency Directive reporting of ERF for data centers over 500 kW is described in DATA HEAT Appendix A, pp. 20–21. That directive does not govern a site in Lansing. US ERF reporting is voluntary here `[unverified]` as a federal mandate; none was found in the verification file. ESG-linked loan margin tied to ERF is a European note in that guide, not a WULF credit agreement in this repo `[unverified]`.

The HPC pivot is the narrative reason to want the metric. DATA HEAT Appendix B, slide 51, notes that heat from HPC can be viewed negatively when the workload is bitcoin mining. `research/facts-site2.md` describes a pivot toward enterprise HPC/AI hosting (https://www.datacenters.com, verified 2026-10-03 in that file). A metered 4.6% is something we can say. A claim that the campus heats the town is something we must not say: 93.5% of modeled available heat still goes to the fans at the 150 MW base, and about 97% at 320 MW if delivery stays 50,576 MWh.

Heat recovery can also worsen PUE (DATA HEAT Appendix A, p. 21). The fix is already in the price clause: pumping sits on the co-op's meter. Our PUE boundary stays at the dry coolers.

**7. The water story we can sign is a promise to keep the permit's existing uses, and it is cheap because it matches the permit we already have.**

Through 30 April 2031 the permitted uses are maintenance, sump pumping, and dust control, held by the landlord (rows 5a, 5c). Codifying "we will not repurpose this renewal for cooling" does not give up a right the current permit grants. It does **not** save 1,008,000 gal/day. The developer's operating design already rejects heat to air. Judges and residents will check that. A false gallon claim is a disclosure and a political liability. A true use-limitation is a one-page covenant.

**8. Precedent we should not lean on.**

Deep Green's 24 MW proposal with the Board of Water & Light was in **Lansing, Michigan**, announced 5 November 2025, and **withdrawn 6 April 2026**. It is not this town, and it is not a completed project. https://www.lbwl.com/community/newsroom/2025-11-05-deep-green-proposes-120-million-sustainable-data-center-investment ; https://www.wkar.org/michigans-data-center-divide/2026-04-06/proposed-data-center-wont-move-forward-in-lansing-as-deep-green-withdraws (verified 2026-10-03, row 12). A UK pool project at 28 kW is a price anecdote, not a campus comp (`docs/ownership-deal.md`). I will not justify our signature by pointing at a withdrawn rezoning.

## 4. What we lose (costs, risk, option value)

**Cash, if we accept the model's gap as our CBA.** $26.01 million present value, about $2.1 million a year for 30 years, against a heat contract the industry standard limits to about 10 years. The gap exists because the corridor is inside phases 1–2. The file's own reconciliation: corridor stand-alone gap $30.32 million, minus on-site surplus about $4.3 million, equals $26.01 million. The on-site ring does not need that check. The 20.9 km home loop does. The 14 km town main is worse and already fails its gate. Paying 1.73% of an assumed campus cost to subsidize a pipe at $285.8/MWh, while fan savings are about $0.1 million a year, is a donation with a community label.

**Duration and security.** A 30-year annuity secured by a 10-year heat promise leaves us paying after we are allowed to leave. Year-10 exit in the model strands $5.71 million and needs a $10.35 million replacement source. If the reserve formula includes "stranded unrecovered capex of shared assets," that replacement becomes our letter of credit. Letters of credit consume bank capacity. Existing debt covenants of Lake Hawkeye LLC or the parent are `[unverified]`. **ASSUMPTION:** we will not know whether an LC is even permitted until counsel reads the credit documents. Reasoning: the lease is in a subsidiary (row 3c); project-level liens and reserved amounts are usually restricted. The restriction itself is not in this repo.

**The 80-year lease as collateral.** "Runs with the ground lease and binds any assignee" clouds title on the asset a buyer or a hyperscale tenant would underwrite. The lease has no renewal rights and a $100 purchase option from year 50 (row 3c). A covenant that survives assignment, and that is still in force if we exercise the option and take the fee, is no longer a heat contract. It is a land restriction. Sale value of that encumbrance is `[unverified]`. The direction of the effect is not: buyers pay less for land that comes with a town veto and a third-party step-in.

**Related-party landlord.** Riesling Power LLC, owned by the CEO, sits above the lessor (row 3c). A CBA recorded on that lease, and any nominal-rent sublease of pad space to the co-op, is a transaction with an entity on the CEO's side of the line. **ASSUMPTION:** the audit committee would have to approve it, and a "nominal" rent is the wrong number for that approval. Reasoning: the ownership fact is verified; the specific SEC item and the arm's-length rent are `[unverified]`. Inventing a related-party discount is how this becomes an accounting footnote we do not want.

**Cooling option at full build.** The Q2 2026 release states ~400 MW gross / ~320 MW critical IT and a 2029 horizon. It does not publish a dry-cooler design temperature or a statement that dry coolers are sufficient on the peak summer hour at that scale `[unverified]`. The marketing page states dry coolers and no lake draw. **ASSUMPTION:** the right to file a future withdrawal application, or to add adiabatic assist, has option value at 320 MW IT even though today's story is dry coolers. Reasoning: permit row 5c limits the *current* renewal; it does not award us a permanent cooling technology. An 80-year promise never to seek a cooling withdrawal spends that option on a heat contract that takes 6.5% of the heat (3% at full IT). Dollar value of the option: `[unverified]`.

**Temperature control.** The draft says that if an HPC tenant changes coolant temperature, we pay to hold the interface at the agreed T. Our revenue contracts are with the tenants. Coolant temperature is part of how those halls are sold. Supply and return temperatures for this design are an open item (`docs/ownership-deal.md`; facts-site2 open question 2). A community floor on temperature is a covenant against our customers.

**Time to market.** DATA HEAT slide 50: the priority for a new data center is time to market, and extra complexity is read as delay risk. Operations are already ~2029 (row 3b). A date-certain interface, with permit revocation as the remedy, can slip commercial operation for a greenhouse tenant who is not signed. No named grower, co-op, or pool operator is in `docs/proposal/03-users.md`.

**Counterparty risk.** We would be conditioning land-use approval on the Thermal Commons co-op. Formation, PSC jurisdiction, and patronage tax treatment are `[unverified]` (verification rows 11c–11d). If the co-op cannot sign, borrow, or take title, we are in breach of a condition we do not control. Elective pay under IRC §6417 is confirmed for tax-exempt entities, governments, and rural electric cooperatives, not automatically for a heat co-op (row 9e, https://www.law.cornell.edu/uscode/text/26/6417, verified 2026-10-03). A waste-heat network is not IRC §48 geothermal heat-pump property on the verification file's reading (rows 9d-i, 9h). Federal credit is upside for someone else's eligible basis, not our signing reason, and not a reason to parent-fund their capex.

**Disclosure and overclaim.** Three claims we must not repeat in an ESG report or a tenant deck, because they fail against our own sources:

- Heat reuse saves the 1,008,000 gal/day. It does not. The gallons are a permit limit for maintenance, sump pumping, and dust control.
- This is an environmental-justice project. The site pack says no designated disadvantaged communities nearby.
- The campus heat is used. The model uses 6.5% at the base and about 3% at the filing capacity.

**PUE, security, and people on site.** A step-in that lets the co-op operate the skid is access to the glycol loop. Even at depreciated book value, that is a security, insurance, and cybersecurity issue. Cost of that access is `[unverified]`. It is still a reason to keep the exchanger outside the hall and the valves in our procedure.

**Noise and jobs, if they migrate into this contract.** Dry-cooler noise is a site-permit issue. Folding it into the HSA lets a heat dispute become a stop-work on the campus. A jobs warranty is the same shape. The model prints 126 jobs and 5,500 t/year of food (`site2.json` `impact`). `docs/proposal/03-users.md` says the RII staffing benchmark is not a Lansing payroll. I will not sign a headcount covenant.

**What we do not lose, and should not pretend to lose.** We do not lose a water-savings credit, because we should not book one. We do not lose a heat-sales business, because the honest price is zero. We do not lose the dry coolers. They stay the rejection path.

## 5. Dealbreakers

Ranked. The first four block a signature even if every other clause is friendly. The rest are fixes we can trade.

**1. An open funding obligation for the corridor or the town main.**

The number to refuse is the **$26.01 million** whole-project gap and the **$2.096 million per year** annuity, and any clause that lets a town-appointed board expand the network and invoice the shortfall back to us. The town main at **$734.2/MWh** is already outside the gate. The corridor at **$285.8/MWh** is inside the gap. Both fail propane at **$136.1/MWh** without someone else's money. That someone will not be the parent company.

**2. A water covenant that outlives the permit and uses the heat exchanger as the remedy.**

Refuse: "life of the lease" (80 years), "will not seek any future cooling withdrawal," and "breach triggers step-in on the site exchanger." Also refuse any drafting that catches the exempt fire pumps (6 NYCRR 601.9, row 5c). The permit expires 30 April 2031. Match the covenant to that date and to the stated uses (maintenance, sump pumping, dust control). Renewal of the promise is a decision at the next permit, not an 80-year forfeiture.

**3. Any term that touches tenant SLAs, coolant setpoints, or who may stand next to the loop.**

Delete the clause that we pay to hold interface temperature if a tenant changes coolant. Delete co-op operation of equipment inside the security perimeter. A heat-side fault is not a default under our customer contracts. Cooling-always-wins stays. The temperature-maintenance clause in the current draft contradicts it. Both cannot be in the signed copy.

**4. The obligation is effective before we have an approval, a legal counterparty, and a notice to proceed.**

The board has directed a draft ban. It has not offered a vote in exchange for a check. Money or a recorded restriction that is due at signing, before a final non-appealable approval that incorporates this covenant, is a donation. A date-certain interface with permit revocation as the penalty, while operations are ~2029 and Executive Order 62's coverage is `[unverified]`, is the same problem on the schedule.

**5. Automatic 5-year renewals, and "binds every assignee" with no sale election.**

The 10-year initial term is acceptable. Automatic renewal reverses it. A buyer must be able to assume the HSA or terminate it by funding the capped wind-down. We will not let a community heat contract become a condition of every future financing or sale of Lake Hawkeye LLC for the rest of an 80-year lease.

**6. Parent guarantee, or a reserve sized to the co-op's unrecovered network.**

Obligor is Lake Hawkeye LLC. No TeraWulf Inc. guarantee. The letter of credit covers removal of our skid and, only if we exit early, a capped transition payment for customers actually connected to the on-site ring. It does not cover the $9.39 million corridor pipe, the $8.0 million of building heat pumps, the $10.35 million replacement plant, or the co-op's debt. Those model figures are ASSUMPTION-based and they are the co-op's.

**7. Land we do not lease, at a rent the audit committee cannot defend.**

No dedication of acres beyond the 183-acre lease. Remainder acreage is `[unverified]` (row 3d). Any pad sublease inside the lease needs the landlord's consent. Rent is an arm's-length number, documented, because the landlord's parent is CEO-owned. "Nominal" is a dealbreaker.

**8. A minimum megawatt, temperature, and availability percentage.**

X, T, and Y are blank because we have not published a supply temperature `[unverified]`. Filling them in with the organizer's 55–65 °C target, or with the model's 50 °C, would invent a specification the filing does not contain. Availability is whatever the operating IT load produces at the coolant temperature the hall is actually running. No take-or-pay. No hourly percentage. Curtailment unlimited, including with no notice when cooling is at risk.

**9. Jobs, noise stop-work, tenant-level data, and DAC language.**

No headcount covenant. Dry-cooler noise stays in the site approval, not in the HSA. Meter data is monthly MWh_th and supply temperature, aggregated. No rack, tenant, or workload data. No representation that the site is a disadvantaged community. The affordability sentence we can sign is about propane and oil under a gas moratorium that began in 2015, with 2026 status still `[unverified]`.

**10. Treating Deep Green Lansing, Michigan, or a federal ITC, as consideration.**

We will not take a covenant whose economics "close" only if a credit that verification rows 9d-i and 9h say is unlikely for a waste-heat network actually arrives. Base case in the model already excludes it. Good. Keep it excluded in the contract too. If a ground-source portion later qualifies, that upside belongs to the asset owner who placed it in service, under tax counsel. It is not a reason for us to enlarge the host payment.

## 6. Fixes that make the signature rational

This is the paper I would take to the board. Six pages. Subsidiary obligor. Conditional. Capped.

**A. Readiness, not a heat utility.** During construction of the first hall, Lake Hawkeye LLC installs isolation valves, a bypass to the dry coolers, and a flange for a plate exchanger **outside the security perimeter**, on the warm glycol header. Fluids do not mix. The hall energizes on the dry coolers whether or not the co-op has customers. Export starts when the co-op is ready, and it never becomes the cooling path. This is the Noord-Holland shape cited in `docs/research/competitor-teams.md`: be technically ready, including if nobody is connected yet. It is a flange and a bypass, not a completed town network. Cost reference: the model's **$2.59 million** interface, ASSUMPTION, to be replaced by a bid before we escrow it.

**B. Price.** $0 per MWh_th for the heat. The co-op pays metered incremental electricity and a defined maintenance fee for the exchanger. Our PUE meter does not see that pump. A windfall share back to us is optional; I do not need it at a zero price.

**C. Term.** Ten years from commercial operation of the first building the interface serves, not from signing. Renewal is our option, five years, notice 24 months before expiry. Silence means the contract ends. Early exit: 24 months' notice plus the capped reserve in F.

**D. Cooling supremacy, written as an engineering rule.** Any heat-side fault fails safe to the dry coolers. We may add cooling capacity, change vendors, or change coolant temperature without consent and without paying the co-op to chase a temperature. The co-op owns lift, storage, and backup. The model already sizes backup boilers for 100% of peak and shows backup at **0.73%** of annual heat (`site2.json` `totals`). That backup is their asset and their tariff, not our SLA.

**E. Condition precedent, so we are not paying for a vote we have not received.** Our obligations start only when all of these are true: a final, non-appealable local approval that names this HSA/CBA as a condition; a counterparty that New York counsel confirms can own the pipes and sell heat (today `[unverified]`); co-op financing with **no recourse** to TeraWulf Inc. or Lake Hawkeye LLC; and our notice to proceed on the first IT building. If the town adopts the prohibition, or if the co-op cannot be formed, both contracts expire and any escrowed host payment returns. Remedy after we are in service, for a real failure to maintain the flange and bypass: liquidated damages capped at the interface cost, with a cure period. Not permit revocation. Not a shutdown.

**F. Money, one cap, on-site only.** We fund the site interface, bid out, cap agreed before signing, reference **$2.59 million** until the bid. We do not fund the **$26.01 million** gap, the corridor, the town main, building heat pumps, or the year-10 replacement plant. Host payment beyond the interface: a single community amount the board can explain, due at the condition precedent in E, capped in the agreement, and not indexed to co-op overruns. **ASSUMPTION:** a cap on the order of the interface itself is the amount that still looks like insurance rather than a second business. Reasoning: fan savings are about $0.1 million a year, so a multi-million annual annuity never pays back on energy; the payment is political, and political payments need a ceiling. The right ceiling in dollars, other than "not $26 million," is a board decision `[unverified]`.

If the town wants the 500-home corridor, the payers are members, NYSEG's Lansing non-pipe-alternative program (portfolio **$9.0 million** as of the Q1 2024 report, row 6d), and NYSERDA. Not our cash sweep.

**G. Reserve.** Letter of credit from Lake Hawkeye LLC, no parent guarantee, sized to: removal of the skid, plus a transition-heat amount only if we terminate before year 10, only for on-site customers then connected, and only for a stated number of heating seasons. Release as the term runs. The model's full year-10 bill ($5.71 million stranded + $10.35 million replacement) is disclosed to the co-op so they can reserve it themselves. It is not our debt.

**H. Water, a separate short covenant with the landlord.** Cayuga Operating Company LLC and Lake Hawkeye LLC agree that, through **30 April 2031**, the 1,008,000 gal/day renewal will be used for system maintenance, sump pumping, and dust control. That matches the permit. It does not promise a gallon saved. It does not cover fire pumps. It does not bar a future application, which would be a new political act at the next renewal. Breach is a payment to the town's benefit fund, capped, after cure. It is not a right to enter the cooling plant. Extending the promise past 2031 requires a new signature. Because the landlord is CEO-affiliated, this signature goes through the audit committee with the lease amendment.

**I. Land.** No acres outside the 183. Inside it, a defined pad for greenhouse, aquaculture, and recreation, subleased only with landlord consent, at a documented rent, for a term that does not exceed the HSA. The pad does not reduce the acreage the IT buildings need. How much of the 183 is surplus after the halls is `[unverified]`.

**J. Governance and speech.** Town seat on the co-op board. We have a non-voting observer. Scope that increases our payment or changes the interface requires our consent. Annual public number: metered MWh_th and average supply temperature. We may report that as ERF. The sentence in our sustainability materials is the metered number. At the model base that is about **4.6%**, and the share of available heat falls if IT grows and customers do not. We do not claim lake-water savings, a disadvantaged-community status, or that the town is heated by the campus.

**K. What this does to HDR's lenses, in language we can defend.**

| Lens | What the signed version actually does |
|---|---|
| Community | A binding condition of approval, and on-site heat at a modeled $40.6/MWh. Household propane savings of $735 a year on a 27 MWh home (`site2.json` `finance.household`) apply only if a home is connected and someone other than us has funded the corridor. We do not promise that connection. |
| Human health / air | On-site food and recreation displace propane and oil at the fence. The town-wide combustion claim waits on a pipe that fails its cost gate. |
| Water | The covenant tracks the existing permit uses through 30 April 2031. Zero gallons claimed as saved. Dry coolers stay. |
| Carbon | Report metered export only. 11,456 t/year in `site2.json` `impact.co2_avoided_t_yr` is a model output for the connected loads, not a WULF Scope inventory we are ready to book. `docs/proposal/00-executive-summary.md` already flags a lower publishable figure. We do not put the model's tonne number in the contract. |
| Biodiversity / nutrients | On-site growing on already-industrial ground, closed loop, no phosphorus-discharge claim unless DEC says so. No acreage promise beyond a surveyed pad inside the lease. |
| Health of the deal | The campus can be built without depending on the co-op for cooling. That is the reliability condition under which any of the other lenses survive. |

## 7. CFO verdict

I recommend that the board authorize negotiation, and I recommend that the board refuse the draft in `docs/ownership-deal.md` until sections A–J are the document.

**We gain** a recorded answer to a board that has told its attorney to draft a ban: heat we already discard, offered at a zero price, through hardware that cannot take the hall down, for ten years, at a cost on the order of the site interface rather than a thirty-year annuity of about $2.1 million. That is the social-license purchase DATA HEAT describes, priced like insurance.

**We lose, if we sign the draft,** the option to cool the full ~320 MW IT campus the way the tenant requires, a clean title on an 80-year related-party lease, bank capacity for a letter of credit sized to someone else's pipes, and about $26 million that exists only because a 20.9 km residential loop is still inside the "project." We also lose the right to tell investors a simple story, because the draft mixes a real permit limitation with a water-savings implication, and a 6.5% reuse share with a town-heating implication.

**The signature line.** Lake Hawkeye LLC will sell a sidestream, keep the dry coolers in charge, fund the flange and a capped host payment when an approval that contains this covenant is final, and keep the parent's balance sheet out of the co-op's debt. TeraWulf Inc. will not guarantee it. Cayuga Operating Company LLC will sign a water-use promise that copies the permit through 30 April 2031 and stops there. The Thermal Commons co-op will own every pipe, every heat pump, and every backup boiler, and will build the corridor only when its own capital can stand a tariff under propane without a further invoice to us.

If the town's price for a yes is the uncapped draft, the answer is no. A covenant that makes the campus unfinanceable is not a path to community heat. It is a way to own neither the data center nor the network.

## Sources

Verified 2026-10-03 unless noted. Model figures are from `web/public/data/site2.json` generated 2026-10-04 and are not filings.

- TeraWulf Q2 2026 earnings release (400 MW gross / 320 MW critical IT; operations ~2029): https://www.sec.gov/Archives/edgar/data/1083301/000108330126000162/a_wulfearningsreleaseq22026.htm
- Ground lease 8-K (183 acres, 80 years, Lake Hawkeye LLC, Cayuga Operating Company LLC): https://www.sec.gov/Archives/edgar/data/1083301/000110465925078086/tm2523008d1_8k.htm
- August 2025 ground-lease press release (138 MW figure, now stale): https://investors.terawulf.com/news-events/press-releases/detail/113/terawulf-secures-long-term-ground-lease-at-cayuga-site-to-expand-high-performance-computing-infrastructure
- Closed-loop cooling page (developer claim): https://lakehawkeyedata.com/closed-loop-cooling
- DEC water-withdrawal permit PDF: https://dec.ny.gov/sites/default/files/2026-04/cayugaoperatingwwpermit.pdf
- Town ban direction: https://www.fingerlakes1.com/2026/10/02/lansing-moves-toward-data-center-ban-as-terawulf-debate-reaches-turning-point/ ; https://607newsnow.com/news/258852-town-of-lansing-moving-forward-with-drafting-a-data-center-ban/ ; https://ithacavoice.org/2026/09/lansing-board-data-center-ban/
- Tompkins County Resolution 2026-3: https://tompkinscountyny.iqm2.com/Citizens/Detail_LegiFile.aspx?ID=13804&MeetingID=4213
- Executive Order 62: https://www.governor.ny.gov/executive-order/no-62-establishing-temporary-moratorium-data-centers-new-york-while-state-develops
- PSC order on the Lansing moratorium (Case 20-G-0131): https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BE068C615-B8EE-4CB9-AF92-3153A49BE4E4%7D
- Ithaca Voice on the 183-acre purchase description: https://ithacavoice.org/2025/09/environmentalists-sound-alarm-as-plan-to-convert-cayuga-power-plant-to-data-center-advances/
- Deep Green, Lansing, Michigan, announced and withdrawn: https://www.lbwl.com/community/newsroom/2025-11-05-deep-green-proposes-120-million-sustainable-data-center-investment ; https://www.wkar.org/michigans-data-center-divide/2026-04-06/proposed-data-center-wont-move-forward-in-lansing-as-deep-green-withdraws
- IRC §6417 applicable entities: https://www.law.cornell.edu/uscode/text/26/6417
- Town Law §190: https://www.nysenate.gov/legislation/laws/TWN/190
- Turner & Townsend 2025 data-centre cost index (band cited by the model): https://reports.turnerandtownsend.com/data-centre-construction-cost-index-2025/
- DATA HEAT guide (pp. 20–22, Appendix A p. 34, Appendix B slides 49–51), organizer text: `resources/text/DATA_HEAT_-_Sector_Couling_Data_Centeres_and_District_Energy_-_Market_Development_Guide_and_Appendicies_-_3MAR26.txt`
- Site pack, no disadvantaged communities nearby: `resources/text/2026_10_01_Hackathon_NYU_-_Suburban_Site_-_Lake_Hawkeye.txt`
- Term sheet being red-teamed: `docs/ownership-deal.md` (PROPOSAL)
- Verification overrides: `research/verification.md`

## Lane status

**Done**

- Read the HSA and CBA term sheet, the model funding gap, and the verification overrides, and wrote the CFO position against them.
- Separated what is cheap to give (zero-price sidestream, fail-safe bypass, 10-year term, permit-faithful water language, flange-scale capex) from what blocks a signature (corridor gap, 80-year water option, automatic renewal, step-in, parent-level money, land we do not control).
- Reconciled the two CBA percentages in `site2.json` (1.73% headline versus 2.02% corridor) so the team quotes one number and the CFO refuses that number as an obligation.
- Mapped the signable version onto HDR's community, health, water, carbon, and nutrient lenses without a disadvantaged-community claim and without a lake-gallon claim.
- Flagged Deep Green as Lansing, Michigan, and as withdrawn.

**Missing**

- TeraWulf project NPV, approval probabilities, credit-agreement restrictions, and the parent's actual capex per watt. Not in the repo. No dollar "value of social license" is stated.
- A bid for the sidestream skid. $2.59 million is an ASSUMPTION in the model.
- The real coolant supply and return temperatures. Still open. No availability floor was invented to fill X, T, Y.
- Article 78 status. `research/facts-site2.md` cites a Cornell Sun story that the suit may proceed; `research/verification.md` does not confirm it, and other Cornell Sun URLs in that file were 404. Treated as `[unverified]` and not used.
- 2026 status of the NYSEG moratorium, Executive Order 62's application to this project, acreage outside the 183, and whether a New York heat co-op can legally sign. All left open.
- Independent check of the 970 MWh/year fan figure. Used as a model output. The implied fan ratio (kWh electric per kWh_th) is not re-derived here.

**Open questions**

- Will the board trade a prohibition for a covenant at all, or only draft the ban? The CFO structure assumes we pay only inside a final approval. If the town will not write that condition, there is nothing to sign.
- Is the obligor willing to be Lake Hawkeye LLC with a hard cap and no parent guarantee? If lenders require a parent guarantee, this memo's signature version has to be renegotiated, not quietly expanded.
- How much of the 183 acres is left after the IT buildings? The pad sublease is only real if a survey shows surplus land.
- Does the CEO-affiliated landlord actually sign the water covenant through the audit committee? Without that signature the permit holder is outside the deal.
- If counsel later finds the co-op cannot sell heat, does the team switch the counterparty to a town or municipal utility before submission? The CFO can sign with whichever entity can take title. The CFO cannot sign with a placeholder.

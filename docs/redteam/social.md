# Social red team — opposed Lansing resident and Town Board

Red-team of Thermal Commons (Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev) heard as (1) an opposed resident of Lansing, New York, and (2) a Town Board member whose attorney has been told to draft a data-center prohibition. Site: Lake Hawkeye / former Cayuga plant. Comparison site: 111 8th Avenue, New York City. Question: why a heat-reuse offer does not change their mind, and what would.

Severity: **Critical** (this sentence loses the room or HDR’s community lens), **High** (a board member can keep the ban draft moving), **Medium** (fix the sentence before the pitch).

Voices below are a rehearsal, built from the documented record. They are not quotations from a named person. No speaker is invented.

## How to read this

- Voice sections are the opposition. Findings are what the team should change.
- `research/verification.md` overrides older research files. Model dollars and megawatt-hours are `web/public/data/site2.json` (generated 2026-10-04), labeled as model output.
- Organizer text outranks the web. The Lake Hawkeye pack says there are no designated disadvantaged communities nearby. This file does not claim an equity win on that basis.
- ASSUMPTION marks arithmetic or a judgment on top of sourced numbers. `[unverified]` marks a gap.

## Sources checked

- `PLAN.md` reality-check table and three-ring concept.
- `research/verification.md` (rows 1a–1c, 2a–2b, 3a–3d, 4a–4c, 5a–5d, 6a, 6c-update, 6d, 7b, 8-cost, 11a–11d, 12).
- `resources/text/2026_10_01_Hackathon_NYU_-_Suburban_Site_-_Lake_Hawkeye.txt` (HDR lenses and place profile).
- `resources/text/NYU_Hackathon_Data_Center_Heat_Reuse_Challenge_R1.txt` (community acceptance is a required lens).
- `resources/text/DATA_HEAT_-_Sector_Couling_Data_Centeres_and_District_Energy_-_Market_Development_Guide_and_Appendicies_-_3MAR26.txt` (social license; opposition drivers).
- `resources/text/CBS_Data_center_white_paper_DISTRICT_HEATING.txt` Figure 9 extract (`>2km` placed with Poor).
- `resources/text/Colocating-Data-Centers_Greenhouses-RII-Virginia.txt` Table 2 (10-acre staffing).
- `web/public/data/site2.json` rings, finance, impact, January and July months.
- `docs/proposal/00-executive-summary.md`, `docs/proposal/01-site-selection.md`, `docs/proposal/03-users.md`.

## Voice 1 — Opposed Lansing resident

I live in the town that just filled a meeting to tell the board to stop this. On 29 September 2026 the board told its attorney to draft a prohibition. It did not vote the ban that night. One outlet said 36 of 38 speakers were opposed; the Ithaca Voice counted the room differently and said only two people spoke against the ban, one of them a TeraWulf vice president (`research/verification.md` rows 1a, 1b) (verified 2026-10-03). If you walk in quoting 36 of 38, I hear that you were not in the room.

What I asked for is no data center on this lake. Heat does not retire that ask. A greenhouse, a fish barn, and a pool on the plant site are a second industrial use. They are not my furnace. The school campus is about 10.6 km out and the library about 13 km (`docs/proposal/03-users.md`, citing `offtakers.json`). Your own town main is 14 km, about $734 per MWh, and it fails (`site2.json` ring `town`). The CBS extract puts distance above 2 km in the poor band (Figure 9, `resources/text/CBS_Data_center_white_paper_DISTRICT_HEATING.txt`). You are offering “community heat” that does not reach the buildings this town actually uses.

The bill you printed does not survive your own spreadsheet. The tariff is $108.9 per MWh, $735 a year against propane for a 27 MWh home (`site2.json` `finance.household`). The same file prices an air-source heat pump at $96.9 per MWh. ASSUMPTION (subtraction on those two model prices): (96.9 − 108.9) × 27 = about **$324 a year more** on your heat than on a heat pump I could own. Natural gas in that file is $64.2 per MWh, and about 38% of occupied town homes already heat with utility gas (`research/facts-site2.md`, ACS B25040, https://data.census.gov/table/ACSDT5Y2023.B25040) (verified 2026-10-03). Your price loses to utility gas, which about 38% of town homes already use, and it loses to the air-source heat pump printed in your own file.

The corridor that is supposed to serve 500 homes costs $285.8 per MWh at a 7% discount, on 20.9 km, at 0.65 MWh per metre per year (`site2.json` ring `corridor`). Propane in the same file is $136.1. The plan’s own screen started near 1.5 MWh per metre per year (`PLAN.md` §1.2). ASSUMPTION: 0.65 is under that screen, so those 500 homes should not be in the headline. About 4,450 occupied households are in the town (`research/facts-site2.md`, ACS B25002, https://data.census.gov/table/ACSDT5Y2023.B25002) (verified 2026-10-03). Five hundred is a model, not a sign-up list. About 26% propane and 8% oil is a real fuel mix (`facts-site2.md`, B25040) (verified 2026-10-03). It is not a customer list on that pipe.

You will say the lake is safe because the cooling loop is closed. That page is the developer’s (`https://lakehawkeyedata.com/closed-loop-cooling`) (verified 2026-10-03, row 4a). It does not mention make-up or domestic water. DEC’s 13 April 2026 renewal allows up to 1,008,000 gallons a day, held by Cayuga Operating Company LLC, for maintenance, sump pumping, and dust control, through 30 April 2031 (`https://dec.ny.gov/sites/default/files/2026-04/cayugaoperatingwwpermit.pdf`) (verified 2026-10-03, rows 5a, 5c). Tompkins County, on 20 January 2026, asked DEC for a new application and a project-appropriate review, 14–1 (`https://tompkinscountyny.iqm2.com/Citizens/Detail_LegiFile.aspx?ID=13804&MeetingID=4213`) (verified 2026-10-03, row 5d). A covenant that repeats the permit is not a new promise. And your model refuses the gallon-for-gallon claim: heat reuse does not save lake water 1:1 (`site2.json` `impact.water.note`). Good. Then do not let a slide imply it.

July demand in the model is 735 MWh against 66,960 MWh of supply. January demand is 8,954 MWh against 65,250 MWh (`site2.json` `monthly`, months 7 and 1). Phases 1–2 deliver 50,576 MWh, 6.5% of 777.6 GWh available (`site2.json` `totals.share_of_available_pct`). The fans still reject almost all of the heat, including in summer, which is when I am outside. The site pack’s noise figure is a baseline, 41.9 dB versus 40.6 at Taughannock, not a prediction of dry-cooler noise (`Lake Hawkeye` pack, p. 13). Heat reuse does not answer noise, light, construction, or the electric bill for a campus the August 2026 release puts at about 400 MW gross and about 320 MW critical IT, with operations not contemplated until about 2029 (`https://www.sec.gov/Archives/edgar/data/1083301/000108330126000162/a_wulfearningsreleaseq22026.htm`) (verified 2026-10-03, rows 3a, 3b). Your model uses 150 MW. The website’s ~150 MW phase 1 has no stated basis (row 3a). I will not treat a smaller slide as the project.

Jobs and food are how I will know you are selling. The model prints 126 jobs, 5,500 t of food, and 1,500 t of fish (`site2.json` `impact`). The greenhouse note this team wrote opens at about 4 ha and says there is no named grower (`docs/proposal/03-users.md`). RII’s own 10-acre row is 6.5 full-time and 35 part-time, 41.5 jobs all-in, not 126 (`resources/text/Colocating-Data-Centers_Greenhouses-RII-Virginia.txt`, Table 2). Acres beyond the 183-acre, 80-year lease are `[unverified]` (row 3d). The landlord’s parent, Riesling Power LLC, is owned by TeraWulf’s CEO (row 3c, 8-K `https://www.sec.gov/Archives/edgar/data/1083301/000110465925078086/tm2523008d1_8k.htm`) (verified 2026-10-03). A “community campus” on that lease is still his ground until a tenant signs.

I am not a disadvantaged-community statistic for your scorecard. The pack says no designated disadvantaged communities are nearby (p. 24). Poverty is the 28th percentile, minority population the 24th, age 65+ the 56th (pp. 37–39). FEMA’s social-vulnerability note in the pack says people here can avoid or bounce back from a disaster (p. 23). Across the lake, cancer is in the 90th percentile (p. 36). Heat in a greenhouse does not touch that. Air here already shows 0% of days worse than Good on the pack’s 5- and 10-year averages (pp. 28–29), and PM2.5 is the 4th percentile (p. 32). Do not tell me you are cleaning my air.

If the data center leaves in year 10, your model strands $5.7 million and needs $10.4 million to replace the source, and the corridor price jumps $93.2 per MWh (`site2.json` `finance.dc_exit`). I would have pulled a propane tank for a 10-year deal with a company the town is trying to prohibit. That is the opposite of security.

Deep Green’s heat-reuse data center was in Lansing, Michigan. It was withdrawn on 6 April 2026 (`https://www.wkar.org/michigans-data-center-divide/2026-04-06/proposed-data-center-wont-move-forward-in-lansing-as-deep-green-withdraws`) (verified 2026-10-03, row 12). Say “Michigan” or do not say it. I will hear “Lansing” as us.

## Voice 2 — Town Board member drafting the ban

Counsel has been directed to draft a local law because the room told us to. Finger Lakes 1’s account is that we “directed [our] attorney to write a resolution to ban data centers” (`https://www.fingerlakes1.com/2026/10/02/lansing-moves-toward-data-center-ban-as-terawulf-debate-reaches-turning-point/`) (verified 2026-10-03, row 1a). There was no vote on the ban itself. Next year’s **proposed** budget sets aside $500,000 for legal costs (`https://ithacavoice.org/2026/09/lansing-board-data-center-ban/`, “setting aside half a million dollars in next year’s budget”) (verified 2026-10-03, row 1c). That is not an existing reserve, and it is not a budget line for a heat co-op. A student term sheet does not unwind a drafting instruction.

I can vote for conditions. I cannot vote for a slogan. “Thermal Commons co-op” has no statute I can hand the attorney. Public Service Law 66-t authorizes gas and electric corporations to do thermal networks and tells the PSC it may exempt small networks that utilities do not own (`https://www.nysenate.gov/legislation/laws/PBS/66-T`) (verified 2026-10-03, row 11a). Town Law 190’s district list has no heating district (`https://www.nysenate.gov/legislation/laws/TWN/190`) (verified 2026-10-03, row 11d). A municipality selling steam to non-municipal customers needs a PSC certificate; whether that section covers hot water is unconfirmed (row 11b). The executive summary already marks a New York heat-co-op statute `[unverified]`. If the town is the obligor, I will not introduce it. The Ithaca thermal pilot — one city block, not this town — has estimated initial development costs of $35.45 million and, as of the 13 March 2026 status report, had not started Stage 3 (`research/verification.md` rows 8-cost, 8-status) (verified 2026-10-03). I have watched a thermal network in this county get expensive before anyone received heat.

The pipe I could defend is the one that fails. Town hall and the schools are the loads a board can point to. Your model leaves them on the shelf: $734 per MWh, 1,840 MWh a year of pipe loss, `passes_gate: false`. Phase 1 is a grower, a fish operation, and a pool who do not exist yet, on 0.5 km, at $40.6 per MWh (`site2.json` ring `onsite`). That can be a condition if a tenant signs. It is not a reason to stop drafting.

The $26 million gap in the executive summary is 1.7% of an **assumed** $1,500 million campus (`docs/proposal/00-executive-summary.md`). TeraWulf has not signed it in any source this file checked. DATA HEAT says operators care about heat recovery because it helps a social license and ESG disclosure (`resources/text/DATA_HEAT_...3MAR26.txt`, Appendix A, social-license paragraphs and the ESG text box). The same guide’s opposition slide lists water, power, noise, visual impact, infrastructure, green space, and property value — not “absence of a greenhouse.” Social license in the literature is a reason the **company** might agree. It is not a reason **I** must.

Executive Order 62 (14 July 2026) pauses some DEC data-center permits at 50 MW and above until a final GEIS. Whether it covers Lake Hawkeye is `[unverified]` (rows 2a, 2b). I will not let a pitch tell the public the state has already stopped this project. Local zoning is still ours. The order’s title is about a benefits blueprint for localities (`https://www.governor.ny.gov/executive-order/no-62-establishing-temporary-moratorium-data-centers-new-york-while-state-develops`) (verified 2026-10-03). A benefits blueprint is a place to put meters and a bond. It is not a heat tariff.

What I would actually move is narrower than what you are pitching. Keep drafting the prohibition. Write a narrow exception that is void unless, before a building permit: the cooling design stays a sidestream the IT load does not need; the 1.008 MGD permit stays on the uses DEC already wrote, with meters the town can read; a named offtaker has signed on the 183 acres; a bond covers source replacement if the operator leaves; and the town is not the utility of last resort unless counsel says the statute allows it. Do not name the school, the library, or town hall as customers. Your model says that main fails. Do not print 126 jobs. Do not print $735 as what a Lansing household saves.

## Why heat reuse does not change their mind

Heat is a side product. The fight is whether the campus is allowed.

The documented local sequence is a drafting instruction, a proposed legal budget, a county demand for a new water review, and a developer cooling claim residents have not accepted (rows 1a, 1c, 5d, 4a). DATA HEAT’s national list of why people organize — water, power, noise, visual impact, infrastructure, green space, property value — matches that sequence (`DATA_HEAT` Appendix B, “Key Drivers of Community Resistance”). A 45 °C loop to an unsigned greenhouse answers none of those lines.

The offer also fails as a household bargain, which is the only social hook that is real here. The NYSEG moratorium was invoked in 2015, not 2014, and a 14 July 2025 gas plan still lists Lansing below 50 percent of MAOP (rows 6a, 6c-update) (verified 2026-10-03). Status in 2026 is `[unverified]`. Propane and oil are about 34% of occupied homes (26% and 8%, B25040). The model then shows those homes are the expensive customers: corridor levelized cost $285.8 per MWh against propane $136.1, and the printed tariff $108.9 loses to the printed air-source heat pump at $96.9. The cheap heat ($40.6 per MWh) sits on the lease, for users who must come to the plant. That is a business park. Residents hear it as a favor to the applicant.

HDR’s own card for this place blocks the equity shortcut: no disadvantaged communities nearby; low poverty percentile; social vulnerability described as able to bounce back. Leading with “community value” in the environmental-justice sense tells both the resident and the judge that the site pack was not read. `docs/proposal/01-site-selection.md` already says Chelsea (Site 1) is the stronger equity site. The Lansing sentence that survives is the one that file uses: a covenant can be the condition of an approval, gas service has been frozen since 2015, and the first customers have to stand on the lease.

## What would change their mind

Nothing in this repo makes the opposition want the data center. DATA HEAT’s hope that heat “can enhance the perceived benefits and local acceptance” is an interviewee suggestion in a policy guide, and the Michigan project that tried a version of it was withdrawn (row 12). Treat acceptance as unearned.

What can move a **vote**, and what a resident can hear without feeling managed:

1. **The ban draft stays the default.** The heat deal is a condition precedent inside the local law, void if the conditions are missed. It is not a reason to stop the attorney’s draft. Say that in the first minute. `PLAN.md` already frames the pitch as “the conditions under which Lansing could say yes.” The voices above accept that frame and reject every softer one.

2. **Conditions they can enforce without trusting TeraWulf.** Recorded: sidestream only, IT cooling never depends on the offtaker (`PLAN.md` hard constraint); 1.008 MGD stayed on maintenance, sump pumping, and dust control, metered, published; third-party beneficiaries a town attorney can live with. The watershed groups’ support is not claimed. `docs/stakeholders.md` says their pages, as fetched 2026-10-03, do not mention heat reuse. An Article 78 is reported in `research/facts-site2.md` (Cornell Sun, 22 April 2026). `verification.md` did not open that URL (correction note on facts-site2 L32). This lane marks the suit `[unverified]`.

3. **No household offer until a cluster clears its own price.** Publish the failed gates: corridor $285.8 per MWh and 0.65 MWh per metre; town main $734 per MWh and `passes_gate: false`. A home is eligible only when its own levelized cost beats both propane and the model’s air-source heat pump ($96.9), and only after the year-10 replacement ($10.4 million in the model) is bonded. Until then the spoken savings number is zero, not $735.

4. **Jobs stay at zero until a grower signs.** If a first house is quoted, use RII Table 2 for 10 acres (6.5 FTE + 35 part-time) and the 4 ha opening in `docs/proposal/03-users.md`, on the 183 leased acres only. Do not add aquaculture, recreation, and network headcount the audits already flag as assumptions.

5. **The town is not the co-op unless counsel writes the path.** Utility, bonded third party, or a small-network exemption under 66-t. Jamestown’s municipal district heat is a city utility precedent (`verification.md` row 11f), not a town-board shortcut. The $500,000 proposed legal line is for the prohibition fight. Do not imply the co-op replaces it.

6. **Process, because HDR asks for it.** The site pack’s community test includes “equity of access to the design process” (pack p. 5). A covenant drafted in public, with the board’s attorney holding the pen, is the version that matches the lens. A co-op announced at the town is the version that fails it.

TeraWulf’s signature is not in this repo. Say that. A board member can respect a condition the applicant has not accepted. A resident cannot respect a benefit that depends on a signature you imply you have.

## Findings

| ID | What they hear | Why it does not move them | Severity | Fix — say this |
|---|---|---|---|---|
| S1 | “Heat reuse is the community benefit that answers the fight.” | The ask on 29 Sept 2026 was a prohibition draft, not a tariff (row 1a). DATA HEAT’s opposition drivers are water, power, noise, visual impact, infrastructure, green space, property value. | Critical | “Heat does not replace a ban. It is a condition that keeps a prohibition in force unless the pipes, meters, and bond are real.” |
| S2 | “The town set aside $500,000 and 36 of 38 people, so we designed the off-ramp.” | $500,000 is next year’s **proposed** budget for legal costs, not a reserve and not a program budget (row 1c). 36/38 is one outlet; Ithaca Voice said two speakers opposed the ban (row 1b). | Critical | “The board directed a draft. It has not voted. We will not quote a speaker ratio.” |
| S3 | “Your home saves $735 a year.” | Tariff $108.9/MWh vs propane $136.1 gives that $735 on 27 MWh (`site2.json`). The same file’s air-source heat pump is $96.9. ASSUMPTION: about $324/year **worse** than that heat pump. Corridor LCOH is $285.8, density 0.65 MWh/m, under the plan’s ~1.5 screen. The $2.849/gal propane figure did not survive row 7b; statewide propane on 21 Sept 2026 was $3.120. Central weekly gallons are `[unverified]`. | Critical | Drop $735 from the spoken pitch. “No home is offered service. The corridor fails its own cost test.” |
| S4 | “Schools, town hall, and the library are anchors.” | Town ring: 14 km, $734/MWh, 1,840 MWh losses, gate failed. Geocoded school ~10.6 km, library ~13 km (`03-users.md`). CBS extract: `>2km` with Poor. | Critical | “Town buildings are not customers. The main stays on the shelf.” |
| S5 | “We reuse the waste heat.” | 50,576 MWh delivered is 6.5% of 777.6 GWh. July demand 735 MWh vs supply 66,960. Fans still do the summer. Fan energy saved is a model 970 MWh (`impact.water`), small next to supply. | Critical | “About 6.5% of captured heat has a user. The dry coolers stay. Summer does not get quieter because of this.” |
| S6 | “The covenant saves Cayuga Lake.” | Permit already limits uses to maintenance, sump pumping, and dust control (row 5c). Developer closed-loop page is a claim (row 4a). Model note: no 1:1 lake-water savings. County asked for a new review (row 5d). | High | “Heat reuse saves no lake gallons. The covenant is meters and a recorded limit on the permit that already exists, enforceable by the town.” |
| S7 | “A community campus on the unused acres.” | 183 acres, 80-year lease, landlord parent owned by the CEO (row 3c). Further acreage `[unverified]` (row 3d). No named grower (`03-users.md`). | High | “Phase 1 is only on the leased 183 acres, and only after a grower signs. Until then the campus is a drawing.” |
| S8 | “126 jobs and 5,500 tonnes of food.” | Model fields, not a payroll. RII Table 2 at 10 acres: 6.5 FTE and 35 part-time. Design note opens near 4 ha. Audits already reject 126 as a full-time count (`docs/proposal/13-regenerative-scorecard.md`). | Critical | “Jobs are zero until a tenant signs. A 10-acre house, if one is built, is RII’s 6.5 plus 35 part-time, not 126.” |
| S9 | “The Thermal Commons co-op will own it.” | 66-t is a utility statute; Town Law 190 has no heat district (rows 11a, 11d). Ithaca pilot $35.45M for one block, Stage 3 not started (rows 8-cost, 8-status). | High | “Counsel picks the owner. The town is not the utility unless the statute says so. The co-op name is a proposal, not a district.” |
| S10 | “Equity for a burdened community, and a low-income tier.” | Pack p. 24: no disadvantaged communities nearby. Poverty 28th, minority 24th, age 65+ 56th. Model low-income tariff $88.5/MWh has no verified eligibility list. Site 1 is the stronger equity comparison (`01-site-selection.md`: social vulnerability 79th, a disadvantaged community nearby). | Critical for HDR | “We do not call Lansing a disadvantaged community. The narrower fact is propane and oil in a gas-constrained town, and those homes are not connected in this model.” |
| S11 | “Lansing has done heat reuse” / Deep Green. | Deep Green, 24 MW, Board of Water & Light, is Lansing, **Michigan**, withdrawn 6 April 2026 (row 12). | Critical | Omit it, or say “Michigan, and it was withdrawn.” |
| S12 | “If they leave, the co-op continues.” | Year-10 exit: $5.71M stranded, $10.35M replacement, corridor +$93.2/MWh (`finance.dc_exit`). Who posts the bond is unsigned. | High | “No household converts, and the town signs nothing, until that replacement is bonded by the applicant.” |
| S13 | “This solves the gas moratorium.” | Moratorium invoked 2015; still listed 14 July 2025; 2026 status `[unverified]` (rows 6a, 6c-update). NPA portfolio: five projects, $9.0M, as of Q1 2024 (row 6d). Gas in the model is $64.2/MWh, cheaper than the tariff, and ~38% of homes are already on utility gas. | High | “The moratorium is why propane homes matter. It is not a promise that this network heats them. NYSEG’s non-pipe program is the program already aimed at that constraint.” |
| S14 | “150 MW phase 1, soon.” | Model base is 150 MW IT (`site2.json` `supply`). Filing: ~400 MW gross / ~320 MW critical IT, operations ~2029; no phase split (rows 3a, 3b). Website ~150 MW is unstated basis. | High | Speak both numbers. “The model is 150 MW so the pipe math stays honest. The application the town is looking at is the 2026 release, about 400 MW gross, about 2029.” |
| S15 | “$26 million is only 1.7% of the campus, so they will pay.” | The $1,500 million campus is an ASSUMPTION at $10/W (`00-executive-summary.md`). No TeraWulf acceptance is in the sources checked. Value printed for the data center is social license, ERF 0.0462, and 970 MWh of fan energy (`site2.json`). | High | “The gap is unfunded until the applicant signs. We do not imply they have.” |
| S16 | “Cleaner air and better health.” | Pack: 0% of days worse than Good; PM2.5 4th percentile; ozone 20th. Cancer in the 90th percentile is across the lake (p. 36), and this design does not treat it. | Medium | “We do not claim a local air-quality transformation. Combustion avoided is a carbon account, audited at 11,408 t/yr, not a health outcome.” |
| S17 | “The community co-designed this.” | HDR pack p. 5 asks for equity of access to the design process. Opposition pages fetched for `docs/stakeholders.md` do not discuss heat reuse. This team is not a Lansing hearing. | High for HDR Community | “The pen sits with the town attorney. We are showing the tests a hearing can adopt. We are not claiming the town asked for this co-op.” |

### Cross-subsidy check (ASSUMPTION)

If the 13,500 MWh corridor paid the $108.9 tariff while its own levelized cost stayed $285.8, the gap would be 13,500 × (285.8 − 108.9) = 13,500 × 176.9 ≈ **$2.39 million per year**. The on-site ring’s levelized cost is $40.6. The JSON stakeholder line that offers growers “$50/MWh” is a text field (`value_by_stakeholder`), not a signed rate. A thin on-site margin cannot carry a $2.39 million residential gap. The blended co-op cost of $89.5 per MWh at 4% (`finance.lcoh_usd_mwh.coop_4pct`) only describes a world where the megawatt-hours pay one price. The pitch currently tells growers they get cheap heat and households they save $735. Those two sentences cannot both be true. Severity: **Critical**. Fix: one price list, and no residential price until the corridor stands on its own.

### HDR map (social only)

| HDR item | What the pack asks | What this red team allows on a slide |
|---|---|---|
| Community (lens) | Better serve community; equity of access to the design process (pack p. 5) | A condition-precedent covenant the town attorney can draft. No claim that residents asked for it. |
| Health (lens) | Conditions that improve human health; connections to nature (pack p. 5) | Do not claim asthma, cancer, or air-day improvements. Age 65+ at the 56th percentile is a reason to avoid a bad retrofit, not a reason to call the town vulnerable. |
| Human health / air | Local baselines are already good (pp. 28–34) | Carbon number only, and only the audited 11,408 t/yr. |
| Community (domain) | No disadvantaged communities nearby (p. 24); poverty 28th; minority 24th | Rural fuel constraint (propane/oil share), stated as unserved by this model. |
| Water / nutrients | Phosphorus-impaired Cayuga Lake (p. 19); low-medium water stress (pp. 15–17) | No lake-gallon credit. Nutrients only if a closed-loop grower exists; no mass is claimed in the executive summary. |

## Lane status

### Done

- Resident voice and Town Board voice, tied to verification rows, the site pack, DATA HEAT’s opposition drivers, and `site2.json`.
- Seventeen findings with severity and a sentence to say instead.
- The $735 versus air-source-heat-pump comparison and the corridor cross-subsidy, both marked ASSUMPTION on model prices.
- HDR community and health limits, including the instruction not to claim disadvantaged-community status.
- Deep Green kept in Michigan and marked withdrawn.
- Household offer, town main, jobs, and co-op ownership treated as failed or unsigned.

### Missing

- This lane did not re-fetch Ithaca Voice, Finger Lakes 1, or 607 News Now. Speaker color and the $500,000 line are as `verification.md` recorded them on 2026-10-03.
- The CBS “poor” reading is from the text extract of Figure 9 (`>2km` beside the Poor label). The PDF figure was not re-opened.
- Article 78 status: `[unverified]` here because verification did not open the 22 April 2026 Cornell Sun URL.
- No named resident, grower, pool operator, or TeraWulf signature. Voices are synthesized. They are not interviews.
- Central New York weekly propane and heating-oil gallons remain `[unverified]` (rows 7a, 7b), so this file does not recompute $735 from a new gallon price.
- Whether the NYSEG moratorium is still in force on 2026-10-04 is `[unverified]` (row 6c).
- Executive Order 62’s coverage of this project is `[unverified]` (row 2b).
- Eligibility rules for the model’s $88.5 low-income tariff are `[unverified]`.
- Noise from the proposed dry coolers, in decibels at a property line, is `[unverified]`. The pack’s 41.9 dB figure is a baseline map.

### Open questions

- Will counsel accept a prohibition-plus-voidable-exception, or does any exception read as a political retreat in that room?
- Who can be a third-party beneficiary without pretending the watershed groups support the campus?
- Is there a signed cluster anywhere above the plan’s ~1.5 MWh per metre screen? The model’s corridor is 0.65.
- Does TeraWulf post the model’s $10.4 million replacement, or does the condition die there?
- First glass at 4 ha or the model’s 10 ha, and which staffing table is allowed on stage if the answer is “none until a tenant”?

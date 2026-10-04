# Competitor teams — anticipated approaches and differentiation

Thermal Commons (Harsh Agarwal, Linson Lee, Philip Matchev). Working site: Lake Hawkeye / TeraWulf, former Cayuga coal plant, Lansing, NY. Comparison site: 111 8th Avenue, New York City. The proposed community heat co-op is the Thermal Commons co-op.

This note anticipates what other student teams will pitch if they follow the organizer brief, is currently an outline: the differentiator and weakness sections are placeholders to be filled. No other team's submission was available. Every "typical approach" below is **ANTICIPATED** from the challenge text, the opening slides, and the HDR site packs. It is not an observation of a named team.

Organizer extracts in `resources/text/` outrank web sources. `research/verification.md` overrides older research files when they conflict. Numbers in `web/public/data/site1.json` and `site2.json` are **MODEL** outputs (generated 2026-10-04), not field measurements. External facts carry a URL and `(verified 2026-10-03)`. Anything this lane could not confirm is `[unverified]`.

## How to read this

- **Typical approach:** what a competent team will pitch if it answers the brief's own prompts.
- **Our difference:** what Thermal Commons puts on the table, in one sentence a judge can repeat.
- **We look weaker when:** the honest gap a judge can score against us.

## What almost every team will converge on

The challenge asks every team to pick one site and show temperature, capacity, timing, seasonality, and continuity; cooling reliability; heat continuity; quantified value; and shared cost, risk, and ownership (`resources/text/NYU_Hackathon_Data_Center_Heat_Reuse_Challenge_R1.txt`, organizer text, verified 2026-10-03).

The opening deck then tells them what "good" looks like for each site (`resources/text/NYU_Data_Center_Heat_Reuse_Hackathon_Deck_Challenge_and_Workshop-_opening_slides.txt`, slide 11, organizer text, verified 2026-10-03):

| | 111 8th Avenue | Lake Hawkeye |
|---|---|---|
| Users the deck names | "Dense, diverse local demand" | "Nearby homes and community facilities" |
| Design focus | "Match heat supply to users. Define upgrades and interfaces." | "Plan heat pumps and a new network for hot water and space heating." |
| Tradeoff | "Use local demand while protecting data-center cooling reliability." | "Build a feasible network with affordability and community acceptance." |

HDR scores regenerative design on Community, Ecology, and Health, and on seven domains: human health, community, air, carbon, water, biodiversity, nutrients (both site packs, p. 4–5, organizer text, verified 2026-10-03). Teams that map a slide to each domain will look complete even when the engineering is thin. Teams that maximize Energy Reuse Factor (ERF) will look greener than a proposal that refuses to build an uneconomic pipe.

## Site 1 — 111 8th Avenue (commissioned carrier hotel, Chelsea)

### Typical approaches other teams will pitch

**S1. Feed Con Edison steam.** The building sits inside the world's largest commercial steam system, coverage to 96th Street on the West Side, distribution steam at 350–413 °F (`research/facts-site1.md`, citing https://www.coned.com/, verified 2026-10-03). The brief's urban prompt is "existing building-energy infrastructure." A steam-injection story is the first idea in the room. It fails the temperature match: our comparison model captures about 32 °C from legacy air-side cooling (MODEL, `web/public/data/site1.json`). Lifting that to steam temperatures is a different machine than a 4th-generation hot-water network.

**S2. Serve NYCHA Fulton and Elliott-Chelsea, and call it the equity project.** Fulton Houses: 945 apartments, about 2,175 residents, ~0.1 mi (`research/facts-site1.md`, citing https://en.wikipedia.org/wiki/Fulton_Houses, verified 2026-10-03). Elliott-Chelsea: 1,015 apartments (`research/facts-site1.md`, citing https://en.wikipedia.org/wiki/Elliott-Chelsea_Houses, verified 2026-10-03). HDR's own pack puts social vulnerability at the 79th percentile, and the block to the west worse on poverty, minority population, ozone, and PM2.5 (urban site pack pp. 23, 31–32, 37–38, organizer text, verified 2026-10-03). This is the strongest Community / Health / Air story available in the two packs. Many Site 1 teams will lead with it, and they will be right about the need.

**S3. Heat Google's own campus.** Google (Alphabet) owns 111 8th Avenue, bought in 2010, and Chelsea Market at 75 9th Avenue (`research/facts-site1.md`, citing https://en.wikipedia.org/wiki/111_Eighth_Avenue and https://en.wikipedia.org/wiki/Chelsea_Market, verified 2026-10-03). A landlord heating its own food hall and offices is easy to draw and weak on "community value."

**S4. Treat the carrier hotel as one thermal plant.** Named third-party IT capacity is on the order of 22 MW (Digital Realty up to ~18 MW, Crown Castle 2 MW, Equinix 1 MW, DataBank about 1 MW). Google's own IT load is unknown. A 30–40 MW building total is an **ASSUMPTION** in `research/facts-site1.md` (verified 2026-10-03). The comparison model uses 30 MW IT, 0.75 load factor, 0.55 capture fraction (MODEL, `site1.json`). A team that says "the data center" has not named a counterparty who controls the condenser water.

**S5. Lead with Local Law 97 and a carbon tonne.** Carbon intensity favors displacing Con Ed steam over displacing upstate propane, in our own model: Site 1 avoids more CO2 per MWh delivered (0.353 vs 0.227 t/MWh) and posts a higher ERF (0.134 vs 0.046) (MODEL, `site1.json` `why_not_chosen` and `impact`; `site2.json` `impact`). Absolute tonnes are almost the same (11,888 t/yr vs 11,408 t/yr) because Site 1 delivers less heat into a dirtier incumbent. A carbon-first Site 1 deck can beat us on the environmental lens without solving cost.

**S6. Claim Con Edison's Chelsea thermal pilot is the thing to copy, or the thing we are duplicating.** `research/facts-site1.md` asserts a Utility Thermal Energy Network pilot taking heat from a data center at 85 10th Avenue to NYCHA Fulton Houses, citing https://www.coned.com/ and https://missiongeo.org/ (verified 2026-10-03 in that file). `research/verification.md` has no row for it. `docs/audit/copy-vs-facts.md` treats the claim as `[unverified]`. Use it only as a hypothesis: if the pilot is real, a second network from 111 8th Avenue competes with the utility for the same buildings. Do not say it is confirmed.

**What a strong Site 1 team still has to solve, and most will skip:** multi-tenant consent, street franchise, and a cost that clears steam. Our comparison model puts utility-discount LCOH at $304.9/MWh against a steam incumbent of $118.7/MWh (MODEL, `site1.json`). Capex in that run is $72.01 million. A 0.8×-propane tariff rule in the same file ($95/MWh) does not cover that cost.

## Site 2 — Lake Hawkeye / TeraWulf, Lansing NY (working site)

### Typical approaches other teams will pitch

**L1. A town hot-water main to the school, town hall, library, and houses.** This is the deck's design focus in one line: "Plan heat pumps and a new network for hot water and space heating," with users named as "nearby homes and community facilities" (opening slides, slide 11, organizer text, verified 2026-10-03). The challenge text repeats domestic hot water, building heating, and community facilities (`NYU_Hackathon_Data_Center_Heat_Reuse_Challenge_R1.txt`, organizer text, verified 2026-10-03). It is the modal pitch. Candidate town-center anchors are roughly 5–7 miles from the plant (project reality check in `PLAN.md`, pointing at `research/facts-site2.md`, verified 2026-10-03 as a project constraint). CBS Figure 9 puts distance above 2 km in the poor band (`resources/text/CBS_Data_center_white_paper_DISTRICT_HEATING.txt`, organizer text, verified 2026-10-03). Our model sends the town ring 14.0 km, loses 1,840 MWh in the pipe, and gets an LCOH of $734.2/MWh at a 7% discount. `passes_gate` is false (MODEL, `site2.json` ring `town`).

**L2. "400 MW heats the town."** TeraWulf's Q2 2026 release states approximately 400 MW gross, or approximately 320 MW critical IT, with operations not contemplated until about 2029 (https://www.sec.gov/Archives/edgar/data/1083301/000108330126000162/a_wulfearningsreleaseq22026.htm, verified 2026-10-03, `research/verification.md` row 3b). The August 2025 ground-lease release's 138 MW "ready in 2026" figure is stale. The project website's ~150 MW phase 1 has no stated basis (`research/verification.md` row 3a, verified 2026-10-03). Teams that quote only 400 MW and then size a town network to it will overstate useful heat by the ratio of supply to signed demand. Our base case is 150 MW IT, 0.8 load factor, 0.75 capture, 50 °C, 777.6 GWh/yr available, of which phases 1–2 deliver 50,576 MWh, **6.5%** of available heat (MODEL, `site2.json`).

**L3. Lake water saved gallon for gallon.** The developer describes a sealed closed loop, "food-grade, non-toxic glycol" (the page does not say propylene), air-cooled dry coolers, and no draw from or discharge to the lake (https://lakehawkeyedata.com/closed-loop-cooling, verified 2026-10-03, `research/verification.md` row 4a). That is a developer claim. Separately, DEC renewed a withdrawal of up to 1,008,000 gallons per day for Cayuga Operating Company LLC, effective 2026-04-13, limited to system maintenance, sump pumping, and dust control (https://dec.ny.gov/sites/default/files/2026-04/cayugaoperatingwwpermit.pdf, verified 2026-10-03, rows 5a and 5c). Teams will merge those two facts into "heat reuse saves the lake." Heat reuse does not retire that permit and is not a 1:1 water saving. The model states the same limit (`site2.json` `impact.water.note`).

**L4. Deep Green in "Lansing" as the local precedent.** Deep Green's 24 MW proposal with the Board of Water & Light is in Lansing, **Michigan**: announced 2025-11-05, more than $120 million, heat into the downtown hot-water system, about $1.1 million a year in gas savings, and the rezoning application was withdrawn on 2026-04-06 (https://www.lbwl.com/community/newsroom/2025-11-05-deep-green-proposes-120-million-sustainable-data-center-investment and https://www.wkar.org/michigans-data-center-divide/2026-04-06/proposed-data-center-wont-move-forward-in-lansing-as-deep-green-withdraws, verified 2026-10-03, `research/verification.md` row 12). Teams that do not check the state will cite a withdrawn project in the wrong city as proof.

**L5. An environmental-justice frame copied from Site 1.** HDR's Lake Hawkeye pack says there are no designated disadvantaged communities nearby (suburban site pack p. 24, organizer text, verified 2026-10-03). Social vulnerability on the same pack is described as a population that can avoid or bounce back from a disaster (p. 23). Poverty is the 28th percentile and age 65+ is the 56th (pp. 37–39). A deck that calls Lansing a disadvantaged community contradicts the judge's own slide.

**L6. Hand the network to NYSEG under UTENJA and stop.** Public Service Law §66-t (Laws of 2022, Ch. 375) lets gas and electric corporations develop thermal energy networks and tells the PSC to exempt small non-utility networks (https://www.nysenate.gov/legislation/laws/PBS/66-T, verified 2026-10-03, `research/verification.md` row 11a). That is a real statute, so this pitch looks "deliverable." The Ithaca pilot, the nearest lived example, is one city block, still awaiting DPS after Stage 2, with estimated initial development cost of $35.45 million and no Stage 3 started as of the 2026-03-13 status report (https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7B8025E89C-0000-C94C-BD5F-051864C357DC%7D, verified 2026-10-03, rows 8-cost and 8-status). It is also the utility that invoked the Lansing gas moratorium (see L7).

**L7. A generic "cheaper than gas" affordability line.** NYSEG invoked a moratorium in the Town of Lansing in 2015, on capacity and low design-day pressure (PSC Case 20-G-0131 order, 2022-05-12, https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BE068C615-B8EE-4CB9-AF92-3153A49BE4E4%7D, verified 2026-10-03, row 6a). The July 2025 gas long-term plan still lists Lansing as vulnerable, operating below 50 percent of MAOP (https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7B30700A98-0000-CE30-9B40-1D15BBA44B68%7D, verified 2026-10-03, row 6c-update). Status in 2026 is `[unverified]`. The incumbent that matters is propane and oil, and only for customers who can actually be connected at a cost that beats those fuels. Teams who compare to natural gas ($64.2/MWh in the model) will claim a win the moratorium says new customers cannot take, and they will lose to gas on price (MODEL, `site2.json` `incumbent_usd_mwh.natural_gas`).

**L8. A greenhouse sized to the campus, or Agriport cited as a working data-center tomato pipe.** RII's own interviewee: a 10-hectare house needs about 10 MW, so a 50 MW hall still has 40 MW left (`docs/greenhouse-anchor.md`, citing Resource Innovation Institute, *Colocating Data Centers & Greenhouses*, June 2025, p. 7, https://resourceinnovation.org/wp-content/uploads/2026/02/Colocating-Data-Centers_Greenhouses-RII-Virginia.pdf, verified 2026-10-03). The same file records that Agriport's glasshouse heat is not data-center heat, and that residual heat there "is not yet used." QScale's Lévis greenhouse had not been built as of a 2026-02-09 report (same file). Teams who show a campus-scale greenhouse or a Dutch tomato photo are ahead of the projects they are citing.

**L9. A 40–50% federal tax credit on the whole network.** Waste-heat district networks are not geothermal heat pump property under IRC §48. Treasury declined to add recovered waste heat. Elective pay under §6417 covers tax-exempt entities, governments, and rural electric cooperatives, not a heat co-op automatically (`research/verification.md` rows 9d-i and 9e, verified 2026-10-03). Safe claim, from that file: upside only, on eligible basis, subject to tax counsel. Teams who put "50% ITC" in the base case will have a prettier NPV and a false one.

**L10. "Unmet hours = 0" as the reliability slide.** Our model sets unmet hours to 0 because backup boilers are sized to 100% of peak. The file says to read backup share instead: 0.73% of annual energy, 4.7% of peak hours (MODEL, `site2.json` `totals`). Any team can print unmet = 0 the same way. It is not evidence.

## Ten differentiators

Each item is something a brief-following team is unlikely to lead with. Model figures are ours. They differentiate the pitch only if we show the gate, the share, and the caveat in the same breath.

### 1. The product is a binding condition of approval

On 2026-09-29 the Lansing Town Board directed its attorney to draft a local law prohibiting data centers. That was not a vote on the ban itself (https://www.fingerlakes1.com/2026/10/02/lansing-moves-toward-data-center-ban-as-terawulf-debate-reaches-turning-point/ and https://607newsnow.com/news/258852-town-of-lansing-moving-forward-with-drafting-a-data-center-ban/, verified 2026-10-03, `research/verification.md` row 1a). Ithaca Voice reports half a million dollars set aside in next year's proposed budget for legal costs, not an existing reserve (https://ithacavoice.org/2026/09/lansing-board-data-center-ban/, verified 2026-10-03, row 1c). "36 of 38 speakers opposed" appears in 607 News Now only; cite it as that outlet's count or drop it (row 1b).

Thermal Commons asks the town to condition any approval on a recorded Community Benefit Agreement and a Heat Supply Agreement with a community-owned counterparty (`docs/ownership-deal.md`, PROPOSAL). A sustainability chapter appended to TeraWulf's application does not answer a board that has already told its lawyer to draft a ban.

### 2. Users come to the heat; the town main is a test that fails

Three rings, in `PLAN.md` and in the model:

| Ring | What it is | Pipe | LCOH at 7% | Gate |
|---|---|---:|---:|---|
| On-site, phase 1 | Greenhouse, aquaculture, rec center and pool. Direct heat exchange, 45 °C supply | 0.5 km | $40.6/MWh | Built first |
| Corridor, phase 2 | 500 homes and farms on an ambient loop, building heat pumps | 20.9 km | $285.8/MWh | Density-gated |
| Town center, phase 3 | School campus and town buildings, 65 °C | 14.0 km | $734.2/MWh | `passes_gate: false` |

Source: MODEL, `web/public/data/site2.json`, generated 2026-10-04. CBS Figure 9 marks distance above 2 km as poor (organizer text, verified 2026-10-03). The deck tells teams to plan the town network. We price it and leave it unbuilt until it beats propane and oil. That is the difference a judge can see in one table.

### 3. We publish the fraction of heat that is actually used

Base supply is 150 MW IT × 0.8 × 0.75 capture = 90 MW thermal output before the availability mask; the 8,760-hour model reports 88.8 MW average and 777.6 GWh/yr available, 50 °C capture (MODEL, `site2.json` `supply`). Delivered heat in phases 1–2 is 50,576 MWh, 6.5% of available. ERF is 0.046. The tornado on IT load is flat: 75 MW and 320 MW both leave blended LCOH at $106.1/MWh, because demand is the constraint (MODEL, `site2.json` `finance.tornado`). A 400 MW headline does not change the customer bill. Saying so is the differentiation. Hiding the 6.5% is how we would look like everyone else.

Company program, kept separate from the base case: ~400 MW gross / ~320 MW critical IT, operations ~2029 (SEC release above, verified 2026-10-03). The 150 MW phase-1 figure is the website number with unstated basis (`research/verification.md` row 3a).

### 4. The water offer is a covenant, and the regenerative hook is phosphorus

Dry coolers stay the rejection path. The Heat Supply Agreement subordinates heat export to cooling: a heat-side fault fails safe to the dry coolers, and no data-center setpoint moves to serve the town (`docs/ownership-deal.md`, PROPOSAL, aligned with `PLAN.md`). The water term is a promise by TeraWulf and the landlord not to use the 1,008,000 gal/day permit for process or evaporative cooling, and not to seek a new cooling withdrawal. It is a promise. It is not a calculated gallon saved (permit URL above, verified 2026-10-03).

HDR's pack says Cayuga Lake and an inlet downstream are impaired, and the lake is impaired with phosphorus (suburban site pack p. 19, organizer text, verified 2026-10-03). Agriculture is the greatest biodiversity threat (p. 12). Direct discharge to water is the 44th percentile, with runoff toward the lake (p. 18). Water stress, drought, and groundwater decline are all low-medium (pp. 15–17). The regenerative move that matches those pages is a closed nutrient loop on already-disturbed industrial ground, sited so new farmland is not the answer to an agricultural biodiversity threat. A lake-water bar chart does not match those pages.

### 5. Affordability is priced against propane and oil, with a household number and a ring that does not clear

Moratorium: invoked 2015, still a vulnerable low-pressure area as of the 2025-07-14 long-term plan (URLs in L7, verified 2026-10-03). 2026 status `[unverified]`.

Model incumbents, phases 1–2 blended, 7% discount (`site2.json`):

| | $/MWh |
|---|---:|
| Blended LCOH, utility 7% | 106.1 |
| Co-op 4% | 89.5 |
| Private 10% | 124.6 |
| Propane | 136.1 |
| Heating oil | 155.8 |
| Natural gas | 64.2 |
| Air-source heat pump | 96.9 |
| Tariff rule, 0.8 × propane | 108.9 |
| Low-income tariff | 88.5 |

A 27 MWh/yr home saves $735 against propane and $1,266 against oil at that tariff (MODEL, `site2.json` `finance.household`). Those dollar figures move if the fuel-price inputs move. Central propane at $2.849/gal was not confirmable; statewide posted propane on 2026-09-21 was $3.120/gal (`research/verification.md` row 7b, https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/EDPPP/Energy-Prices/Weekly-Report/WeeklyEnergyandFuelsReport_20260925.pdf, verified 2026-10-03).

The differentiation is the split, not the blend. On-site heat at $40.6/MWh carries the average. The corridor alone is $285.8/MWh and does not beat propane. See "Where we look weaker."

### 6. The counterparty is the Thermal Commons co-op, with a 10-year heat contract and a step-in

`docs/ownership-deal.md` compares four owners and recommends a community thermal co-op (Model C), with an O&M concession for skills the co-op does not have, and NYSEG only as a later option for a town main. Members are households, growers, and the school district, with a town seat. Price is cost-based. TeraWulf owns a replaceable heat-extraction skid, not the pipes.

Contract shape, all PROPOSAL in that file, matched to organizer guidance: initial term 10 years, then 5-year renewals, because data centers often will not guarantee heat longer than about 10 years (DATA HEAT appendix, summarized in `research/digest-organizer.md` from `resources/text/DATA_HEAT_-_Sector_Couling_Data_Centeres_and_District_Energy_-_Market_Development_Guide_and_Appendicies_-_3MAR26.txt`, organizer text, verified 2026-10-03). Curtailment is free and immediate when cooling is at risk. Exit has 24 months' notice, a step-in on the site heat exchanger, and a decommissioning reserve. The model prices a year-10 exit at $5.71 million stranded and $10.35 million to replace the source, with a corridor cost uplift of $93.2/MWh (MODEL, `site2.json` `finance.dc_exit`). Those dollars inherit the capex assumptions in the same file (most lines marked ASSUMPTION).

Danish co-ops are the pattern for cost-based heat, not New York authority (`docs/ownership-deal.md`). Whether a New York heat co-op can be formed, and whether selling hot water needs a PSC certificate, is `[unverified]` (`research/verification.md` rows 11c and 11d). Town Law §190 lists no heating district (https://www.nysenate.gov/legislation/laws/TWN/190, verified 2026-10-03).

### 7. Cooling reliability is a contract clause, and backup is on the town's side of the exchanger

RII's operator interviews: data centers reject any tie that threatens "five nines," and the interface is a heat exchanger in its own substation, fluids unmixed, with a bypass (`docs/greenhouse-anchor.md`, RII pp. 7 and 38, URL above, verified 2026-10-03). The organizer heat-reuse primer puts storage, temperature lift, and backup on the heat host (`resources/text/20230623_Data_Centers_HeatReuse_101_3.2.docx.txt`, cited in `docs/greenhouse-anchor.md`, verified 2026-10-03). Our HSA copies that split. Teams who show the data center depending on the greenhouse for cooling, or who offer the town heat with no boiler, fail the brief's own reliability test. We pass it by refusing both.

### 8. Site choice is a scored concession, and we give Site 1 the categories it wins

`site1.json` `why_not_chosen` (MODEL, generated 2026-10-04) states the comparison in the form a judge can attack:

1. Cost: Manhattan LCOH $305/MWh vs steam $119/MWh. Lansing blended phases 1–2 at $106/MWh vs propane-equivalent $136/MWh.
2. Carbon: Site 1 avoids more CO2 per MWh (0.353 vs 0.227). Carbon alone does not pick Lansing.
3. Source temperature: ~32 °C air-side capture and COP about 5.1, against liquid cooling at 50 °C and COP 6.0 on the Lansing ladder. A commissioned carrier hotel cannot be redesigned as a liquid-cooled hall. TeraWulf's proposed hall can, because it is not built (developer cooling page above; capture temperatures are MODEL).
4. Leverage: Lansing has a live local decision. 111 8th Avenue is already commissioned.

Giving away carbon intensity and ERF is the differentiation. A team that hides those two numbers will be asked for them.

### 9. The regenerative scorecard uses HDR's indicators, including the ones that cut against us

| HDR domain | What the Lake Hawkeye pack actually says | What we claim |
|---|---|---|
| Community | No designated disadvantaged communities nearby (p. 24). Age 65+ at the 56th percentile (p. 39). Poverty 28th (p. 38). | Rural energy burden and older residents. No EJ designation. |
| Human health | Mental health 27th; asthma 51st; heart disease 42nd; stroke 34th (pp. 14, 33–35). Cancer "90th percentile" is described for communities across the lake (p. 36). | We do not claim a health transformation. A pool and lower heating bills are the measurable pieces. |
| Air | Ozone 20th percentile, PM2.5 4th, zero days worse than Good in the pack's windows (pp. 28–32). | Replacing propane and oil combustion in connected buildings. Fan-cooler noise sits on a 41.9 dB baseline vs 40.6 dB at Taughannock Falls (p. 13). |
| Carbon | Lifecycle chart is image-only in the extract (~24k t in 2030, approximate, p. 25). | Model: 11,408 t CO2/yr avoided in the connected case, method in the model, not a pack figure. |
| Water | Stress low-medium. Permit exists. Closed loop is the developer's design. | Covenant to keep the permit off cooling. No gallon-for-gallon claim. |
| Biodiversity | Agriculture is the greatest threat (p. 12). | Controlled-environment production on industrial ground. New farmland is the wrong mitigation. |
| Nutrients | Lake impaired with phosphorus (p. 19). | Closed-loop growing so nutrients are not a new runoff path. Quantified capture is not in the site pack; treat tonnes as MODEL (`local_food_t_yr` 5500, `fish_t_yr` 1500) until a mass balance is shown. |

Pack pages: `resources/text/2026_10_01_Hackathon_NYU_-_Suburban_Site_-_Lake_Hawkeye.txt`, organizer text, verified 2026-10-03.

### 10. Precedents are used as warnings, with the city and the status attached

- Deep Green / Board of Water & Light, Lansing, Michigan, 24 MW: withdrawn 2026-04-06 (URLs in L4). Lesson: a heat customer and a political permit are both required, and a heat story did not save that application. It is not a Lansing, NY project.
- Deep Green UK pools: heat given free, at a scale of tens of kilowatts, not a town network (`docs/ownership-deal.md`, citing Data Center Dynamics via `research/case-studies.md`). Precedent for a near-zero heat price. Not a precedent for ownership of miles of pipe.
- Agriport and QScale: land-use and permitting examples whose greenhouse heat delivery is not operating (see L8 and `docs/greenhouse-anchor.md`).
- Ithaca UTEN: the in-county utility pilot is one block, slow, and expensive (L6). It is a reason to keep NYSEG out of phase 1, and a reason to respect how hard a thermal network is.
- Noord-Holland's rule that a data center must make waste heat available if asked, and must be technically ready even if nobody asks during permitting (`docs/greenhouse-anchor.md`, https://www.noord-holland.nl/bestanden/pdf/Richtlijn%20vestigingsvoorwaarden%20engelse%20vertaling.pdf, verified 2026-10-03). That is the shape of our covenant: an obligation to be ready, written into the approval, whether or not the town main is ever built.

## Where we look weaker

Be ready to say these out loud. A judge who has sat through ten town-heating decks will reach for them.

**1. We refuse the brief's picture of Site 2.** Slide 11 tells teams to plan heat pumps and a new network for hot water and space heating, for nearby homes and community facilities. Our town ring fails its own gate, and the corridor fails propane on a standalone LCOH ($285.8 vs $136.1/MWh). A literal reading of the prompt makes the other team look more responsive. Our answer has to be one sentence: the most suitable users are the ones who can sit on the industrial parcel, and the homes are a second phase that only proceeds where the pipe pays. If we open with the town hall, we have joined the modal pitch and then contradicted our own model.

**2. The blended LCOH hides a ring that does not work.** $106/MWh beats propane only because on-site heat at $40.6/MWh is in the average. Corridor linear heat density in the model is 0.65 MWh per metre (`site2.json` ring `corridor`). `PLAN.md` set a screening gate near 1.5 MWh per metre per year. The corridor is below that gate. Questions to expect: "What does a house pay if the greenhouse is late?" and "Why is the tariff $109 if the corridor costs $286?" The honest answer is that the tariff is a blended price and the corridor should not be built at 500 scattered homes on 20.9 km. If the pitch still shows 500 homes as phase 2 without the density gate on screen, we look like we did not read our own JSON.

**3. ERF and percent-reused will lose a beauty contest.** ERF 0.046 and 6.5% of available heat, against Site 1's ERF 0.134 and 30% of a much smaller supply (MODEL, both JSON files). HDR's deck teaches ERE and ERF with a worked example that reuses 200 kWh of 1,000 kWh IT (ERE 1.1; `research/digest-organizer.md` on the HDR deck, organizer text, verified 2026-10-03). Our ERE is 1.154 (MODEL, `site2.json`). A team that forces more heat into a long pipe posts a prettier ERF and a worse bill. We win only if the judge stays for the cost slide.

**4. Site 1 wins equity, air burden, and carbon per megawatt-hour.** HDR drew a disadvantaged community next to Site 1 and drew none next to Lake Hawkeye (urban pack p. 24; suburban pack p. 24). West-block poverty, PM2.5, and social vulnerability are the disparity story in the materials the judges handed out. Our leverage argument (a ban draft, a new build, a fuel moratorium) is real. It is a different kind of community value. If the room rewards disparity, we lose the social lens to a careful NYCHA proposal. Do not borrow their adjectives.

**5. Carbon tonnes do not separate us.** 11,408 t/yr versus 11,888 t/yr (MODEL). Similar absolutes, worse intensity. A Site 1 team can say they abate more carbon per unit of heat and almost the same tonnes with a smaller, already-built source.

**6. The 150 MW base can be called stale in one sentence.** The latest company figure in verification is ~400 MW gross / ~320 MW critical IT, no phase split, operations ~2029 (row 3a–3b). The 138 MW / second-half-2026 line is stale. The 150 MW phase 1 is a website figure with unstated basis. We are aligned with the user's reality check and with the model. We are one press-release paragraph away from looking out of date unless the slide says: base case is the first phase the website describes; the SEC program is the build-out; LCOH does not move with IT load because demand is capped.

**7. The land under the "campus" is not shown.** Verification row 3d: 183 acres leased for 80 years is confirmed (SEC 8-K, https://www.sec.gov/Archives/edgar/data/1083301/000110465925078086/tm2523008d1_8k.htm, verified 2026-10-03). A 434-acre site and "~250 unleased acres" are `[unverified]`. Ithaca Voice (2025) says the buyer acquired the plant and the surrounding 183 acres (https://ithacavoice.org/2025/09/environmentalists-sound-alarm-as-plan-to-convert-cayuga-power-plant-to-data-center-advances/, verified 2026-10-03). `docs/greenhouse-anchor.md` treats a ~4 hectare house on already-disturbed ground inside the lease as an **ASSUMPTION**. The model headline says a 10-hectare farm (`site2.json` `impact.greenhouse_ha` and `headline`). Those two sizes are not the same project. A team that sticks to the 183-acre lease and a single greenhouse size will look tighter than we do if both numbers reach the judges.

**8. Jobs and food tonnes are ahead of the greenhouse note.** RII's table for a 10-acre house is about 6.5 skilled full-time-equivalent staff plus about 35 part-time-equivalent seasonal workers (`docs/greenhouse-anchor.md`, RII Table 2, verified 2026-10-03). The model reports 126 jobs, 5,500 t/yr local food, and 1,500 t/yr fish (MODEL, `site2.json`). This lane did not find the derivation. Until it is tied to the greenhouse file, treat 126 / 5,500 / 1,500 as `[unverified]` for the stage. Quoting them next to a 4-hectare design is how we get caught.

**9. The co-op is the right politics and the unfinished law.** UTENJA is a statute. A town heating district is not in Town Law §190. A heat co-op is not automatically an elective-pay entity (`research/verification.md` rows 9e, 11a, 11d). Jamestown's municipal district heat is a real New York precedent (https://www.jamestownnybpu.gov/260/District-Heat, verified 2026-10-03, row 11f), and it is a municipal utility, which is the structure we did not pick. A team that says "NYSEG builds it under §66-t" has a cleaner legal sentence. We have a cleaner political sentence, and we should say the legal form is counsel work, with the town-chartered utility as the fallback already written in `docs/ownership-deal.md`.

**10. Summer heat still goes to the fans, and the moratorium's 2026 status is soft.** Ithaca heating degree days, base 65 °F, put June–August at 164 HDD, 2.3% of the year (Northeast Regional Climate Center, https://www.nrcc.cornell.edu/wxstation/ithaca/normal.html, cited in `docs/greenhouse-anchor.md`, verified 2026-10-03). Model June: supply 64,800 MWh, demand 1,126 MWh (`site2.json` `monthly`). RII says absorption dehumidification typically wants 65–90 °C; our capture is 50 °C (`docs/greenhouse-anchor.md`; MODEL `capture_temp_C`). We cannot honestly sell summer cooling from this heat. Teams who draw an absorption chiller will look more "regenerative" and will be wrong on temperature. Say the dry coolers are the summer plan.

The gas moratorium is confirmed in 2015 and still described as a low-pressure problem in a July 2025 utility plan. A 2026 order that it remains in force was not found (`research/verification.md` rows 6a, 6c, 6c-update). If it has lapsed, the affordability story becomes "propane and oil are what many houses use," which is still the right price comparison, and it loses the "you cannot get gas" line. Check once before the pitch. `[unverified]` for calendar 2026.

**11. Heat reuse does not answer the ban.** Speakers can oppose scale, noise on a 41.9 dB baseline, trust, and the water permit even after a perfect heat contract. The covenant is the condition that makes a yes discussable. It is not evidence that the town will say yes. Executive Order 62 (2026-07-14) pauses certain DEC data-center permits at or above 50 MW; whether it covers this project is `[unverified]` (`research/verification.md` rows 2a and 2b, https://www.governor.ny.gov/executive-order/no-62-establishing-temporary-moratorium-data-centers-new-york-while-state-develops, verified 2026-10-03). Do not claim the state moratorium as either a shield or a deadline.

**12. Several headline prices are model assumptions.** Capex lines in `site2.json` are marked ASSUMPTION ($38.76 million phases 1–2). Propane at $136.1/MWh should be reconciled with the weekly NYSERDA statewide figure before anyone says "$735 a year" as a fact. Steam at $118.7/MWh on Site 1 is a model conversion; the fact sheet's steam figure is $41.53 per thousand pounds in `research/facts-site1.md` (verified 2026-10-03 there). This lane did not re-derive either conversion.

## If a judge asks "so what do you do that they don't?"

Say this, and stop:

Thermal Commons is the condition Lansing would write into an approval: a community-owned heat co-op, a side-stream off a closed glycol loop that never becomes the data center's cooling, an on-site food and recreation campus that is the only ring cheap enough to build first, and a town pipe we priced and will not build unless it beats propane. We do not claim the lake water, we do not claim an environmental-justice community the site pack says is not there, and we do not claim the campus uses all of its available heat. Phases 1–2 deliver about 6.5% of it.

## Sources checked

Organizer text (verified 2026-10-03 as extracts):

- `resources/text/NYU_Hackathon_Data_Center_Heat_Reuse_Challenge_R1.txt`
- `resources/text/NYU_Data_Center_Heat_Reuse_Hackathon_Deck_Challenge_and_Workshop-_opening_slides.txt` (slide 11)
- `resources/text/2026_10_01_Hackathon_NYU_-_Suburban_Site_-_Lake_Hawkeye.txt`
- `resources/text/2026_10_01_Hackathon_NYU_-_Urban_Site_-_111_8th_Ave.txt`
- `resources/text/CBS_Data_center_white_paper_DISTRICT_HEATING.txt` (Figure 9, distance)
- `resources/text/DATA_HEAT_-_Sector_Couling_Data_Centeres_and_District_Energy_-_Market_Development_Guide_and_Appendicies_-_3MAR26.txt` via `research/digest-organizer.md` (10-year contracting horizon)

Verification and model:

- `research/verification.md` (overrides older fact files)
- `web/public/data/site2.json`, `web/public/data/site1.json` (MODEL, generated 2026-10-04)
- `PLAN.md` reality-check table
- `docs/ownership-deal.md`, `docs/greenhouse-anchor.md`, `research/facts-site1.md`, `research/digest-organizer.md`, `docs/audit/copy-vs-facts.md`

Primary URLs used above are repeated next to the claims. The date tag on those external facts is `(verified 2026-10-03)` because that is the verification file's date. This lane did not re-fetch them on 2026-10-04.

## Lane status

### Done

- Anticipated Site 1 pitches: steam, NYCHA equity, Google campus self-use, carrier-hotel-as-one-plant, carbon/LL97 lead, and the Chelsea UTEN hypothesis marked unverified.
- Anticipated Site 2 pitches: town main, 400 MW town heating, 1:1 lake water, Deep Green in the wrong city, EJ overclaim, UTENJA-only ownership, gas-price comparison, campus-scale greenhouse, inflated ITC, fake unmet-hours.
- Ten differentiators, each tied to the covenant, the three-ring gate, the 6.5% reuse share, the water covenant, propane/oil, the Thermal Commons co-op, cooling-always-wins, the Site 1 concession, HDR's own indicators, and precedents with status and city.
- Weakness list a judge can actually use, including the corridor LCOH, ERF, equity optics, carbon intensity, stale-looking megawatts, unverified acreage, greenhouse size conflict (4 ha note vs 10 ha model), jobs/food tonnes, co-op law, summer rejection, and the ban that heat reuse does not by itself answer.

### Missing

- No observation of real competing submissions. The hackathon is the same weekend. This file is a forecast from the brief, not a scout of other teams.
- Chelsea UTEN at 85 10th Avenue is asserted in `research/facts-site1.md` and absent from `research/verification.md`. Left as `[unverified]`.
- 2026 status of the Lansing gas moratorium. Last primary in the verification file is the 2025-07-14 long-term plan.
- Whether any unleased acreage outside the 183-acre lease exists and who controls it (`research/verification.md` row 3d).
- Reconciliation of greenhouse size and jobs: `docs/greenhouse-anchor.md` (~4 ha, RII ~40 jobs at 10 acres) versus `site2.json` (10 ha, 126 jobs, 5,500 t food, 1,500 t fish). Not resolved here because those files are not this lane's to edit.
- Central-region propane price that would lock the $136.1/MWh incumbent. Statewide weekly figure is in verification row 7b; Central dashboard value was unreadable.
- Enabling statute for a New York thermal co-op (rows 11c–11d).
- This lane did not re-open primary PDFs on 2026-10-04. Facts stand on the 2026-10-03 verification pass.

### Open questions

- Will judges score ERF and "homes served" harder than a failed town-pipe gate? If yes, the corridor and the town ring need to be visually subordinate to the on-site campus, or a Site 1 team wins on the metric HDR taught them.
- Is the on-stage greenhouse 4 hectares or 10? The differentiation collapses if the two numbers both appear.
- Does the pitch quote 150 MW, 320 MW critical IT, or both, in that order? Quoting only 150 MW is attackable. Quoting only 400 MW joins the modal overclaim.
- If the gas moratorium has ended, what sentence replaces "you cannot get a gas hookup"?
- Is the Thermal Commons co-op the entity we defend on stage, with the town utility as fallback, or will counsel invert that before submission? The legal weakness is real either way; the political weakness of "NYSEG owns it" is also real.

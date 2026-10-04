# Thermal Commons — 5-minute live presentation script

**Speakers:** Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev.
**Deck:** 9 slides, then a 60-second live demo. Spoken deck target: about 650 words. Demo is extra.
**Clicker:** Harsh holds it and advances on each "click" cue and handoff word. Nobody else touches the remote.
**Screen for the demo:** Harsh runs `/explore/` on this laptop at 5:00. Story mode stays on the ask slide until then.

This script is the Presentation row (value and workings), the Innovation row (a permit condition, not a brochure), and the Theme row (a Lansing bill and a covenant). It does not change the app, so it does not put Execution at risk.

Numbers in the spoken lines are the v3 model in `outputs/site2.json` (generated 2026-10-04), phases 1–2 only. The town ring is reported and then refused. External facts follow `research/verification.md`.

## Timing map

| Clock | Who | Slide | Spoken job |
| --- | --- | --- | --- |
| 0:00–0:22 | Harsh Agarwal | 1 Cover | Name the team and the decision |
| 0:22–1:00 | Harsh Agarwal | 2 Problem | Why a heat promise will not win the vote |
| 1:00–1:42 | Harsh Agarwal | 3 Our answer | Three conditions of approval |
| 1:42–2:18 | Linson Lee | 4 Rings | Right tool at every density |
| 2:18–2:58 | Linson Lee | 5 How it works | What the hourly model actually does |
| 2:58–3:38 | Aryaman Bhaskar | 6 Results | The five headline figures |
| 3:38–4:18 | Aryaman Bhaskar | 7 Honest funding | The gap, and whose budget it is not |
| 4:18–4:42 | Philip Matchev | 8 What Lansing gets | The bill, the farm, the limit on equity |
| 4:42–5:00 | Philip Matchev | 9 The ask | Approval only with the covenant |
| 5:00–6:00 | Harsh Agarwal | Demo | Explore, one slider |

Pace: about 130 words a minute. If you are long at 4:20, Philip drops slide 8 to its last sentence and goes straight to the ask.

## Glance card (say these; the file is more precise)

| Say | File (`outputs/site2.json`) | Do not say |
| --- | --- | --- |
| One hundred six dollars per megawatt-hour at seven percent | `finance.lcoh_usd_mwh.utility_7pct` = 106.1 | Ninety dollars. That is the four-percent co-op case (89.5), and it is what Explore shows before you move the slider. |
| Forty dollars and sixty cents / two hundred eighty-six / seven hundred thirty-four | Ring LCOH at 7%: 40.6 / 285.8 / 734.2 | That the town ring is in the blend. `passes_gate` is false. |
| Fifty-point-six gigawatt-hours | `totals.heat_delivered_MWh` = 50,576 | That this is most of the waste heat. Captured heat is 777.6 GWh. Share used is 6.5%. |
| Eleven thousand four hundred eight tonnes | `impact.co2_avoided_t_yr` = 11,408 | A lake-water credit. The file claims 0 gallons. |
| Seven hundred thirty-five dollars a year | `finance.household.savings_vs_propane_usd` = 735, on 27 MWh | That this is profit. The tariff is policy: 0.8 × propane. |
| About one-point-seven percent, about two-point-one million dollars a year | Gap 26.01 million dollars PV; annuitized 2.096 million dollars/yr; 1.73% of an **ASSUMPTION** 1,500 million dollar campus | "TeraWulf's budget." Ten dollars per watt is a midpoint assumption. |

## Script

Spoken words are the paragraphs. Bracketed lines are stage directions.

### 0:00 — Slide 1, Cover — Harsh Agarwal

[Title up: Thermal Commons. Lake Hawkeye, Lansing, New York. Harsh clicks nothing until he finishes.]

We are Thermal Commons. Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev. Lake Hawkeye is a proposed data center on the old Cayuga coal plant in Lansing, New York. The Town Board has told its attorney to draft a ban. We are here with the conditions under which Lansing could say yes.

[Harsh keeps going. Click to slide 2.]

### 0:22 — Slide 2, Problem — Harsh Agarwal

On September twenty-ninth the Town Board directed its attorney to draft a data-center ban, and put half a million dollars for legal costs in next year's proposed budget. NYSEG's moratorium on new gas connections here began in twenty fifteen, so many homes burn propane or oil. In our model that propane heat costs about one hundred thirty-six dollars a megawatt-hour. A promise of free heat will not carry this vote. Deep Green offered heat to Lansing, Michigan, then withdrew in April. Different town. The offer has to be binding.

[Harsh keeps going. Click to slide 3.]

### 1:00 — Slide 3, Our answer — Harsh Agarwal

Three conditions, written into the approval. First, a Heat Supply Agreement. The data center sells the heat. If it leaves, the Thermal Commons co-op keeps the pipes, with step-in rights and a backup source. Second, cooling never depends on us. A side-stream exchanger sits on their sealed glycol loop. The dry coolers stay in charge. Third, no lake-water credit. They already reject that heat to the air. The state's withdrawal permit is for maintenance, not for cooling. Reuse does not save Cayuga Lake one gallon for one gallon.

[Harsh: "Linson." Click to slide 4.]

### 1:42 — Slide 4, Rings — Linson Lee

Density picks the tool. On site: a greenhouse, a fish farm, and a pool. Half a kilometer of pipe. Forty dollars and sixty cents a megawatt-hour. Down the road: five hundred homes, each with a heat pump. Two hundred eighty-six dollars. The town center, fourteen kilometers out: seven hundred thirty-four dollars. It fails, so we do not build it. The other site in this brief, one hundred eleven Eighth Avenue in Manhattan, already has users next door. Lansing does not. The users come to the heat.

[Linson keeps going. Click to slide 5.]

### 2:18 — Slide 5, How it works — Linson Lee

How we know. One hundred fifty megawatts, eighty percent load. We capture about three quarters of that power as fifty-degree heat, then run every hour of a typical Ithaca year. Phases one and two only. A tank covers the day. Backup boilers cover the peak: under one percent of the year's heat. The data center's coolers never wait on us. Delivered heat is fifty-point-six gigawatt-hours. That is six and a half percent of the seven hundred seventy-eight gigawatt-hours we can capture. The scarce thing is a signed customer.

[Linson: "Aryaman." Click to slide 6.]

### 2:58 — Slide 6, Results — Aryaman Bhaskar

Phases one and two, seven percent cost of money. Blended cost to make the heat: one hundred six dollars per megawatt-hour. The town pipe is not in that number. It failed. A typical home, twenty-seven megawatt-hours a year, saves about seven hundred thirty-five dollars against propane, because the tariff is set at eighty percent of propane, about one hundred nine dollars. It is not set at our cost. Carbon: eleven thousand four hundred eight tonnes a year, on the upstate grid, after the heat-pump electricity.

[Aryaman keeps going. Click to slide 7.]

### 3:38 — Slide 7, The honest funding part — Aryaman Bhaskar

Selling below propane leaves a twenty-six-million-dollar gap. Present value, seven percent, thirty years. The on-site ring earns a surplus and still does not close it. The check is about two-point-one million dollars a year. Against an assumed one-point-five-billion-dollar campus — ten dollars a watt times one hundred fifty megawatts — that is about one-point-seven percent. That campus figure is a published midpoint, not TeraWulf's budget. Federal tax credits are not in the base case. No signature on that sum, no trench down the road.

[Aryaman: "Philip." Click to slide 8.]

### 4:18 — Slide 8, What Lansing gets — Philip Matchev

A propane bill about seven hundred thirty-five dollars lower. A farm and a pool on the heat, so July still has a customer. Fewer furnaces in houses. The site pack is plain: no disadvantaged community next door. We will not borrow an equity label the place does not have. What the town can enforce is the covenant.

[Philip keeps going. Click to slide 9.]

### 4:42 — Slide 9, The ask — Philip Matchev

The ask: approval only if the Thermal Commons co-op, the heat contract, and that one-point-seven percent are conditions of the permit. Harsh, the model.

## If a judge interrupts

Stop the sentence. Answer in two or three sentences from this card. Then say "Back to the slide" and pick up the next unspoken line. Do not restart. If the clock is past 4:30, skip to the ask and the demo.

**"Does this save the lake?"** No. TeraWulf's published design is a sealed loop and dry coolers, heat to the air, no draw from the lake in operation. That is their claim, on lakehawkeyedata.com. DEC renewed a withdrawal permit of 1,008,000 gallons a day on April 13, 2026, held by Cayuga Operating Company, for maintenance, sump pumping, and dust control. Heat reuse is not that permit. We claim zero gallons saved.

**"Thirty-six of thirty-eight speakers?"** Say it only if asked. 607 News Now reported 36 of 38 opposed. The Ithaca Voice counted the room differently: two speakers against the ban. We do not hang the vote on that count. The confirmed act is the September 29 direction to draft a ban. The half million dollars is in next year's proposed budget, not cash already in a reserve.

**"Isn't this the Lansing project that already failed?"** That was Lansing, Michigan. Deep Green, 24 megawatts, heat offered to the Board of Water and Light, withdrawn April 6, 2026. Precedent for why a voluntary offer dies. It is not this site.

**"Why not the school?"** Fourteen kilometers of pipe in the model. Levelized cost 734 dollars a megawatt-hour. It fails against propane. Build it only with outside money, or not at all. The school campus distance of several miles is the planning reason; 14.0 km is the model input.

**"What if TeraWulf leaves?"** The agreement is the point. At a year-10 exit the file shows about 5.7 million dollars stranded and about 10.4 million dollars to replace the source. Corridor heat gets dearer by about 93 dollars a megawatt-hour. Pipes and building heat pumps stay. Boilers cover the gap until a new source is in. Cooling of the servers was never ours to lose.

**"One hundred fifty, or four hundred?"** The model base is 150 megawatts, the figure on the project website for a first phase. The basis for that split is unstated. TeraWulf's August 2026 filing is about 400 megawatts gross, about 320 megawatts critical IT, operations about 2029. A larger plant adds heat we still cannot sell. In the file, moving IT load from 75 to 320 megawatts leaves the blended cost at 106 dollars.

**"Is the gas moratorium still on?"** NYSEG invoked it in the Town of Lansing in 2015. Filings still describe the constraint as of July 14, 2025. Whether it is in force on this day in 2026 is [unverified]. The affordability fact we use is the modeled propane price, not a live tariff from NYSEG.

**"One-point-seven percent of what?"** Of an assumption: 10 million dollars per megawatt times 150 megawatts equals 1,500 million dollars. Turner and Townsend's 2025 index spans 6.6 to 13.3 dollars per watt. Ten dollars is the midpoint we chose. It is not a TeraWulf disclosure. The corridor alone is a larger gap, about 30 million dollars. We quote the whole project, 26 million, because the on-site surplus is part of the deal.

**"Where is the equity?"** The Lake Hawkeye site pack says there are no disadvantaged communities nearby. Older houses on propane and oil are the burden we can defend. A low-income tariff of 88.50 dollars a megawatt-hour is in the model. We do not call this an environmental-justice project.

**"Walk me through the workings."** Go to the demo. If they want method instead of a slider: 8,760 hours, Ithaca airport typical weather, capture 50 degrees Celsius, heat-pump efficiency clipped between 2 and 6, backup boilers sized to the peak so unmet hours are zero by construction. Read the backup share, 0.73 percent of annual heat, not the zero.

**"Grundfos / the pumps?"** Distribution pumps move the loop. Homes on the corridor lift the last step with their own heat pumps, modeled COP about 4.7. We have not specified a manufacturer. Do not invent a product number.

**"Phosphorus and the lake?"** Closed-loop fish and greenhouse production is a design intent so nutrients stay in the building. Do not quote a tonnes-of-phosphorus removal. The file's 5,500 tonnes is a food-output figure. Lake impairment status was not re-checked in this lane: [unverified] if a judge presses for the regulatory label.

## Live demo handoff (60 seconds)

**Who:** Harsh Agarwal, on this laptop. Philip stays at the side and does not talk over him.
**When:** the instant Philip says "Harsh, the model."
**Screen:** the app's **Explore** page (`/explore/`). Headline on that page: "Change the assumptions and watch the answer move."
**Before you walk:** load Explore, press **Reset to the base case**, and do not touch anything else. Cooling should already read **Liquid-cooled (50 °C)**. The town-ring checkbox stays off.

**0:00–0:08.** Point at the left card, not the chart.

> Explore uses the same file as the slides. This is the base case. Cost to make heat is about ninety dollars. That is the four-percent co-op case, eighty-nine fifty in the file.

**0:08–0:25.** Put a hand on the slider whose label is **Cost of money (discount rate)**. It starts at **4.0%**. Drag it to **7.0%** and stop. Do not touch electricity, uptake, or IT load.

> I am moving only cost of money, from four percent to seven. Watch cost to make heat.

**0:25–0:45.** The card will step up. In rehearsal the browser math lands near **108 dollars**, because this page starts at the four-percent result and rescales. The frozen hourly model is **106.1**. Say the file number out loud so a rounding difference does not become a second story.

> Our hourly model, the number on the slide, is one hundred six dollars at seven percent. This page may print about one hundred eight. Same direction: dearer money, dearer heat. Now the saving for a propane home.

**0:45–1:00.** Point at **Saving for a propane home**. It should still read **$735 per year**, with "same as base case" underneath. The tariff does not follow the slider.

> Still seven hundred thirty-five dollars. The tariff is eighty percent of propane. It does not follow the cost of money. That stuck saving is why the funding gap exists. Questions on the workings, we stay on this screen.

**If you overshoot the slider:** press **Reset to the base case**, then move only cost of money again. Say "Resetting so you see one change."

**Only if a judge asks for the failure case, and only after the minute:** check **Add the town-center ring (Phase 3; fails the cost test today)**. The cost card jumps. Uncheck it before you sit down. Do not do this inside the sixty seconds unless they ask.

**If Explore will not load:** Harsh reads the glance card from the ask slide. Do not invent a live number from memory beyond that card.

## Sources

Model figures (blended 106.1 dollars/MWh at 7 percent; rings 40.6 / 285.8 / 734.2; 50,576 MWh delivered; 777.6 GWh captured; 6.5 percent share; 11,408 t CO2; 735 dollars/yr; tariff 108.9; propane 136.1; gap 26.01 million dollars; 2.096 million dollars/yr; 1.73 percent; campus 1,500 million dollars as an assumption; year-10 exit 5.71 / 10.35 million dollars and +93.2 dollars/MWh; backup share 0.73 percent; 500 corridor homes; town pipe 14.0 km; town gate false). Source: `outputs/site2.json`, generated 2026-10-04. Not an external measurement.

Campus denominator. **ASSUMPTION:** 10 dollars per watt, the midpoint of a published band, times 150 MW. Turner & Townsend Data Centre Construction Cost Index 2025, band 6.6–13.3 dollars per watt: https://reports.turnerandtownsend.com/data-centre-construction-cost-index-2025/ (cited from the model file). The 1.73 percent is arithmetic on that assumption, not a TeraWulf filing.

Town Board directed counsel to draft a ban, special meeting 2026-09-29. No vote on the ban itself. https://www.fingerlakes1.com/2026/10/02/lansing-moves-toward-data-center-ban-as-terawulf-debate-reaches-turning-point/ (verified 2026-10-03). https://607newsnow.com/news/258852-town-of-lansing-moving-forward-with-drafting-a-data-center-ban/ (verified 2026-10-03).

Half a million dollars: next year's proposed budget for legal costs, not an existing reserve. https://ithacavoice.org/2026/09/lansing-board-data-center-ban/ (verified 2026-10-03). Quote in verification: "setting aside half a million dollars in next year's budget."

36 of 38 speakers: single source, 607 News Now, same URL. Ithaca Voice counted two speakers against the ban. Use only if asked. (verified 2026-10-03, verdict CORRECTED in `research/verification.md`).

Gas moratorium invoked 2015, Town of Lansing. PSC Case 20-G-0131 order, May 12, 2022: https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BE068C615-B8EE-4CB9-AF92-3153A49BE4E4%7D (verified 2026-10-03). Still listed as a constraint as of the July 14, 2025 gas long-term plan update: https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7B30700A98-0000-CE30-9B40-1D15BBA44B68%7D (verified 2026-10-03). Status on 2026-10-04: [unverified].

Closed loop, dry coolers, no lake draw in operation: developer claim. https://lakehawkeyedata.com/closed-loop-cooling (verified 2026-10-03). Glycol is described there as food-grade and non-toxic. The page does not say propylene. Do not add that word.

DEC withdrawal 1,008,000 gallons/day, Cayuga Operating Company LLC, letter April 13, 2026, uses limited to maintenance, sump pumping, and dust control. https://dec.ny.gov/sites/default/files/2026-04/cayugaoperatingwwpermit.pdf (verified 2026-10-03).

Deep Green, Lansing, Michigan, not New York. Announced November 5, 2025; withdrawn April 6, 2026. https://www.lbwl.com/community/newsroom/2025-11-05-deep-green-proposes-120-million-sustainable-data-center-investment and https://www.wkar.org/michigans-data-center-divide/2026-04-06/proposed-data-center-wont-move-forward-in-lansing-as-deep-green-withdraws (verified 2026-10-03).

Capacity. Project site language of about 150 MW for phase 1 has an unstated basis. TeraWulf Q2 2026 release, August 5, 2026: about 400 MW gross, about 320 MW critical IT. https://www.sec.gov/Archives/edgar/data/1083301/000108330126000162/a_wulfearningsreleaseq22026.htm (verified 2026-10-03).

No designated disadvantaged community nearby. Organizer site pack, page 24: `resources/text/2026_10_01_Hackathon_NYU_-_Suburban_Site_-_Lake_Hawkeye.txt`.

111 Eighth Avenue is the other site in the organizer pack: `resources/text/2026_10_01_Hackathon_NYU_-_Urban_Site_-_111_8th_Ave.txt`. "Carrier hotel" is the brief's label in `PLAN.md`. This script says "the other site in this brief" and does not add a street-level claim.

Federal credits excluded from the base case: `outputs/site2.json` `extras.funding.note`, pointing at `research/verification.md` section 9d-i.

Explore slider label "Cost of money (discount rate)", base 4 percent, KPI labels, and town-ring checkbox: `web/components/Explore.tsx` and `web/lib/model.ts`. The on-screen seven-percent integer is a rescale of the four-percent headline (rehearsal estimate about 108 dollars). Quote 106 from the file.

## Word count

Spoken deck paragraphs only, counted from this file (hyphenated numbers such as "twenty-ninth" count as one word). Demo lines are separate.

| Speaker | Words | Slot |
| --- | ---: | --- |
| Harsh, cover | 47 | 0:00–0:22 |
| Harsh, problem | 89 | 0:22–1:00 |
| Harsh, conditions | 88 | 1:00–1:42 |
| Linson, rings | 86 | 1:42–2:18 |
| Linson, how it works | 88 | 2:18–2:58 |
| Aryaman, results | 85 | 2:58–3:38 |
| Aryaman, funding | 82 | 3:38–4:18 |
| Philip, what Lansing gets | 57 | 4:18–4:42 |
| Philip, the ask | 24 | 4:42–5:00 |
| **Deck total** | **646** | about 5:00 at 130 words/minute |

Harsh's problem slide and Linson's rings slide run a few seconds long at that pace. If the clock is behind at 4:18, Philip says only the propane bill, the site-pack sentence, and the covenant. Demo quotations are 124 words, inside the extra minute.

## Lane status

**Done**

- `docs/presentation-script.md` only. No other file edited. No commit.
- Nine-slide script, four speakers, timing marks, glance card, interrupt card, 60-second Explore handoff.
- Headline figures taken from `outputs/site2.json`: 106.1, 40.6 / 285.8 / 734.2, 50.6 GWh, 11,408 t, 735 dollars/yr, about 1.7 percent and about 2.10 million dollars/yr.
- Water, Michigan, equity, town-ring failure, and the campus-cost assumption are said out loud so a judge cannot catch them later.
- Explore behavior checked against `web/lib/model.ts`: the slider starts at 4 percent (about 90 dollars on screen) and rescales; household saving stays 735 because the tariff is fixed. Rehearsal note tells Harsh to expect about 108 dollars on the card and to say 106 from the file.

**Missing**

- A live click-through of Explore in a browser was not run in this lane. The 108-dollar rehearsal figure is from the client formula, not from a watched screen. Harsh should reset the page once before the session and confirm the integer.
- Slide artwork is not this file. If the deck still prints 2.0 percent or 2.44 million dollars a year, those are the corridor framing. This script quotes the whole-project 1.73 percent and 2.10 million dollars. Make the deck match before you present.
- Spoken deck is 646 words as counted from the nine paragraphs. It will drift the moment anyone ad-libs.

**Open questions**

- Public URL for the demo machine was not set here. Use whatever is already loaded offline if the network fails.
- 2026 status of the NYSEG moratorium is still [unverified] past the July 14, 2025 filing.
- Whether judges will see Story mode or Explore first is a stage choice. This script demos Explore only.
- Phosphorus impairment of Cayuga Lake is [unverified] in this lane. Leave it out unless asked, and then label it as design intent.

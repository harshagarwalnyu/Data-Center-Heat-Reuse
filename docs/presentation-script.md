# Thermal Commons: 5-minute live presentation script

**Speakers:** Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev.
**Deck:** 9 slides (`docs/deck/Thermal-Commons-Heat-for-Lansing.pdf`), then a 40-second live demo. Spoken deck target: about 520 words, so the whole thing fits in 5 minutes with room to breathe.
**Clicker:** Harsh holds it and advances on each "click" cue and handoff word. Nobody else touches the remote.
**Screen for the demo:** Harsh runs `/explore/` on this laptop the moment Philip says "Harsh, the model." Story mode stays closed.

The script opens cold with the ban and the 778 GWh, makes one number the hero ($735 a year off a propane bill), and ends on three beats: sign first, 1.7% of the build, the bill cut. It does not change the app.

Numbers in the spoken lines are the v3 model in `outputs/site2.json` (generated 2026-10-04), phases 1-2 only. The town ring is reported and then refused. External facts follow `research/verification.md`.

## Timing map

| Clock | Who | Slide | Spoken job |
| --- | --- | --- | --- |
| 0:00-0:20 | Harsh Agarwal | 1 Cover | Cold open: the ban, 778 GWh into the air |
| 0:20-0:55 | Harsh Agarwal | 2 Problem | Why a heat promise will not win the vote |
| 0:55-1:25 | Harsh Agarwal | 3 Our answer | Don't ban it. Set the terms. |
| 1:25-2:05 | Linson Lee | 4 Rings | Right tool at every density |
| 2:05-2:40 | Linson Lee | 5 How it works | The schematic: bypass, three loops |
| 2:40-3:15 | Aryaman Bhaskar | 6 Results | $735 a year, then the supporting numbers |
| 3:15-3:50 | Aryaman Bhaskar | 7 Honest funding | The gap, and what covers it |
| 3:50-4:25 | Philip Matchev | 8 What Lansing gets | Homes, ERF, scenario estimates |
| 4:25-5:00 | Philip Matchev | 9 The ask | Three beats, then "Harsh, the model." |
| 5:00-5:40 | Harsh Agarwal | Demo | Town ring tick, then the 7% to 4% slider |

Pace: about 130 words a minute. If you are long at 3:50, Philip drops slide 8 to its last sentence and goes straight to the ask.

## Glance card (say these; the file is more precise)

| Say | File (`outputs/site2.json`) | Do not say |
| --- | --- | --- |
| Seven hundred thirty-five dollars a year | `finance.household.savings_vs_propane_usd` = 735, on 27 MWh | That this is profit. The tariff is policy: 0.8 x propane. |
| Seven hundred seventy-eight gigawatt-hours | Captured heat 777.6 GWh | That we use it all. Share used is 6.5%. |
| One hundred six dollars per megawatt-hour at seven percent | `finance.lcoh_usd_mwh.utility_7pct` = 106.1 | Ninety dollars. That is the four-percent co-op case (89.5), and it is what Explore shows after you slide cost of money from 7% to 4%. |
| Forty-one / two hundred eighty-six / seven hundred thirty-four | Ring LCOH at 7%: 40.6 / 285.8 / 734.2 | That the town ring is in the blend. `passes_gate` is false. |
| Fifty-point-six gigawatt-hours; six and a half percent | `totals.heat_delivered_MWh` = 50,576 | That this is most of the waste heat. |
| Eleven thousand four hundred eight tonnes | `impact.co2_avoided_t_yr` = 11,408 | A lake-water credit. The file claims 0 gallons. |
| Four-point-six percent energy reuse factor | `impact.erf` = 0.0462 | That it is supply-limited. It is demand-limited. |
| About one-point-seven percent of the build | Gap 26.01 million dollars PV = 1.73% of an **ASSUMPTION** 1,500 million dollar campus; paid as 2.096 million dollars/yr (0.14% of the build a year) | "TeraWulf's budget." Ten dollars per watt is a midpoint assumption. |
| Jobs and food | 126 jobs, 5,500 t food, 1,500 t fish | Anything but "scenario estimate". |

## Script

Spoken words are the paragraphs. Bracketed lines are stage directions.

### 0:00, Slide 1, Cover (cold open): Harsh Agarwal

[Slide up: "778 GWh a year goes into the air." Harsh says the first line before anything else.]

Lansing's Town Board just told its attorney to draft a ban on this data center. Meanwhile, 778 gigawatt-hours of heat a year goes into the air. We are Thermal Commons: Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev. We found the conditions under which Lansing should say yes.

[Click to slide 2.]

### 0:20, Slide 2, Problem: Harsh Agarwal

Lake Hawkeye is a proposed data center on the old Cayuga coal plant. NYSEG has barred new gas connections here since 2015, so many homes burn propane or oil. Free heat has not been enough before: Deep Green offered it to Lansing, Michigan, and withdrew in April. A promise will not carry this vote. The offer has to be binding.

[Click to slide 3.]

### 0:55, Slide 3, Our answer: Harsh Agarwal

Don't ban it. Set the terms. Three conditions, written into the approval. A Community Benefit Agreement and a Heat Supply Agreement, with step-in rights if the data center leaves. A co-op that owns the pipes, so the town controls the heat. And public proof: an open dashboard, every month. Cooling never depends on us, and we claim no lake water saved.

[Harsh: "Linson." Click to slide 4.]

### 1:25, Slide 4, Rings: Linson Lee

[Point at the map, not the cards.]

Density picks the tool. Ring one, on site: a greenhouse, a fish farm and a pool, forty-one dollars a megawatt-hour. Ring two, down the road: five hundred homes with building heat pumps, two hundred eighty-six dollars. Ring three, the town center, fourteen kilometers out: seven hundred thirty-four dollars. It fails our own test, so we do not build it.

[Click to slide 5.]

### 2:05, Slide 5, How it works: Linson Lee

[Trace the schematic left to right with a finger.]

A side-stream plate exchanger sits on their sealed glycol loop. If cooling ever needs it, a bypass sends everything to the dry coolers: cooling always wins. Forty-five-degree heat goes straight to the farm. A twenty-degree ambient loop reaches five hundred homes, each with its own heat pump. A storage tank on the source side rides through cold snaps. The dashed hot main to the town center is modeled, and it fails. Variable-speed pumps move every loop, and our pump screening checks the energy they use. We run every one of the 8,760 hours of an Ithaca year.

[Linson: "Aryaman." Click to slide 6.]

### 2:40, Slide 6, Results: Aryaman Bhaskar

[Hand on the big number.]

Here is the number that matters. A typical propane home saves seven hundred thirty-five dollars a year, because the tariff is eighty percent of propane. The system delivers fifty-point-six gigawatt-hours at a blended one hundred six dollars a megawatt-hour, and avoids eleven thousand four hundred eight tonnes of carbon dioxide a year. That is six and a half percent of the heat we can capture. The scarce thing is a signed customer.

[Click to slide 7.]

### 3:15, Slide 7, The honest funding part: Aryaman Bhaskar

The honest part. Selling below propane leaves a twenty-six-million-dollar gap. The Community Benefit Agreement covers it with about one-point-seven percent of the build. That is an estimate on an assumed one-and-a-half-billion-dollar campus, not a disclosed budget. Federal tax credits are not in the base case. No signature, no trench.

[Aryaman: "Philip." Click to slide 8.]

### 3:50, Slide 8, What Lansing gets: Philip Matchev

Five hundred homes off propane and oil, a farm and a pool, and an energy reuse factor of four-point-six percent, limited by demand, not supply. Jobs and food are scenario estimates. We claim no lake water saved. And one more term we propose in the benefit agreement: one hundred fifty thousand dollars a year for computer science in Lansing's three public schools, on top of the heat money. Warm homes now, and the next generation of thinkers after them.

[Click to slide 9.]

### 4:25, Slide 9, The ask: Philip Matchev

Our ask, in three beats. One: sign the agreements before site approval. No one has signed yet. Two: about one-point-seven percent of the build, an estimate. Three: a seven-hundred-thirty-five-dollar cut to a propane bill. Don't ban it. Set the terms. Harsh, the model.

## If a judge interrupts

Stop the sentence. Answer in two or three sentences from this card. Then say "Back to the slide" and pick up the next unspoken line. Do not restart. If the clock is past 4:15, skip to the ask and the demo.

**"Does this save the lake?"** No. TeraWulf's published design is a sealed loop and dry coolers, heat to the air, no draw from the lake in operation. That is their claim, on lakehawkeyedata.com. DEC renewed a withdrawal permit of 1,008,000 gallons a day on April 13, 2026, held by Cayuga Operating Company, for maintenance, sump pumping, and dust control. Heat reuse is not that permit. We claim zero gallons saved.

**"Thirty-six of thirty-eight speakers?"** Say it only if asked. 607 News Now reported 36 of 38 opposed. The Ithaca Voice counted the room differently: two speakers against the ban. We do not hang the vote on that count. The confirmed act is the September 29 direction to draft a ban. The half million dollars is in next year's proposed budget, not cash already in a reserve.

**"Isn't this the Lansing project that already failed?"** That was Lansing, Michigan. Deep Green, 24 megawatts, heat offered to the Board of Water and Light, withdrawn April 6, 2026. Precedent for why a voluntary offer dies. It is not this site.

**"Why not the school?"** Fourteen kilometers of pipe in the model. Levelized cost 734 dollars a megawatt-hour. It fails against propane. Build it only with outside money, or not at all. The school campus distance of several miles is the planning reason; 14.0 km is the model input.

**"What if TeraWulf leaves?"** The agreement is the point. At a year-10 exit the file shows about 5.7 million dollars stranded and about 10.4 million dollars to replace the source. Corridor heat gets dearer by about 93 dollars a megawatt-hour. Pipes and building heat pumps stay. Boilers cover the gap until a new source is in. Cooling of the servers was never ours to lose.

**"One hundred fifty, or four hundred?"** The model base is 150 megawatts, the figure on the project website for a first phase. The basis for that split is unstated. TeraWulf's August 2026 filing is about 400 megawatts gross, about 320 megawatts critical IT, operations about 2029. A larger plant adds heat we still cannot sell. In the file, moving IT load from 75 to 320 megawatts leaves the blended cost at 106 dollars.

**"Is the gas moratorium still on?"** NYSEG invoked it in the Town of Lansing in 2015. Filings still describe the constraint as of July 14, 2025. Whether it is in force on this day in 2026 is [unverified]. The affordability fact we use is the modeled propane price, not a live tariff from NYSEG.

**"One-point-seven percent of what?"** Of an assumption: 10 million dollars per megawatt times 150 megawatts equals 1,500 million dollars. Turner and Townsend's 2025 index spans 6.6 to 13.3 dollars per watt. Ten dollars is the midpoint we chose. It is not a TeraWulf disclosure. The corridor alone is a larger gap, about 30 million dollars. We quote the whole project, 26 million, because the on-site surplus is part of the deal.

**"Who has signed?"** No one. No letter of intent, no signed offtaker, no household sign-up. The ask is that the agreements are signed before site approval, and that the approval says so. We do not name signatories we do not have.

**"Where is the equity?"** The Lake Hawkeye site pack says there are no disadvantaged communities nearby. Older houses on propane and oil are the burden we can defend. A low-income tariff of 88.50 dollars a megawatt-hour is in the model. We do not call this an environmental-justice project.

**"Jobs and food?"** Scenario estimates from a published greenhouse co-location study, not measurements. 126 jobs, 5,500 tonnes of food, 1,500 tonnes of fish. We would not put them in a contract.

**"Walk me through the workings."** Go to the demo. If they want method instead of a slider: 8,760 hours, Ithaca airport typical weather, capture 50 degrees Celsius, heat-pump efficiency clipped between 2 and 6, backup boilers sized to the peak so unmet hours are zero by construction. Read the backup share, 0.73 percent of annual heat, not the zero.

**"Grundfos / the pumps?"** We screened every loop: flow from heat and delta-T, pipe size, Darcy-Weisbach head, pump energy at variable versus constant speed (`outputs/hydraulics.json`, `docs/hydraulics.md`). Variable speed cuts pumping energy several-fold. Across phases one and two the computed pumping is about 0.74 percent of heat, under our flat 1.5 percent allowance; the corridor's 5-kelvin ambient loop is the exception, about 1.4 times its allowance, and the doc says so. Sweeping the allowance from 0.5 to 6 percent moves the blended cost by about minus 1 to plus 5 dollars. Screening, not a design. We have not specified a manufacturer. Do not invent a product number.

**"What is the range?"** Five hundred Monte Carlo runs of the full hourly model (`outputs/analysis_detail.json`). Blended cost at seven percent: 80 percent range about 98 to 115 dollars, median about 107, against propane at 136. Below propane in every run at seven percent. The discount rate drives most of the spread.

**"Did you use AI?"** Yes, as a coding and research assistant. The model itself is deterministic Python: 8,760 hours, 50 tests and a verify step in CI, and every number on screen traces to `outputs/site2.json`. Every fact we cite is checked against a source in `research/verification.md`. We made the calls ourselves, including refusing the town ring.

**"Phosphorus and the lake?"** Closed-loop fish and greenhouse production is a design intent so nutrients stay in the building. Do not quote a tonnes-of-phosphorus removal. The file's 5,500 tonnes is a food-output figure. Lake impairment status was not re-checked: [unverified] if a judge presses for the regulatory label.

## Live demo handoff (40 seconds)

**Who:** Harsh Agarwal, on this laptop. Philip stays at the side and does not talk over him.
**When:** the instant Philip says "Harsh, the model."
**Screen:** the app's **Explore** page (`/explore/`).
**Before you walk:** load Explore, press **Reset to the base case**, and touch nothing else. Cooling should read **Liquid-cooled (50 °C)**. The town-ring checkbox stays off. The cost-of-money slider sits at **7.0%** and the cost card reads **$106**.

**0:00-0:05.** Point at the cost card.

> Same file as the slides. This is the base case.

**0:05-0:20. The wow beat.** Tick **Add the town-center ring (Phase 3; fails the cost test today)**. The blended cost jumps and the badge says it fails.

> Add the town-center ring. Watch the cost jump. The badge says it fails. That is why we refuse to build it. Now off.

Untick it. The cost returns.

**0:20-0:35.** Drag **Cost of money (discount rate)** from **7.0%** down to **4.0%** and stop. Do not touch electricity, uptake, or IT load.

> That is the utility case, one hundred six. Finance it as a co-op at four percent and it drops to ninety. Who owns it changes the bill.

**0:35-0:40.** Point at **Saving for a propane home**, which stays at **$735 per year**.

> Still seven hundred thirty-five. Questions on the workings, we stay here.

**Rehearse once before 1PM and read the number the page actually shows at 7%.** The frozen hourly model is 106.1. If the page prints a different integer, say "our hourly model, the slide number, is one hundred six" and move on. Do not open a second story about rounding.

**If you overshoot the slider:** press **Reset to the base case**, then move only cost of money again. Say "Resetting so you see one change."

**If Explore will not load:** Harsh reads the glance card from the ask slide. Do not invent a live number from memory beyond that card. Fallback screenshots: `web/screenshots/`.

## Sources

Model figures (blended 106.1 dollars/MWh at 7 percent; rings 40.6 / 285.8 / 734.2; 50,576 MWh delivered; 777.6 GWh captured; 6.5 percent share; ERF 0.0462; 11,408 t CO2; 735 dollars/yr; tariff 108.9; propane 136.1; gap 26.01 million dollars; 2.096 million dollars/yr; 1.73 percent; campus 1,500 million dollars as an assumption; year-10 exit 5.71 / 10.35 million dollars and +93.2 dollars/MWh; backup share 0.73 percent; 500 corridor homes; town pipe 14.0 km; town gate false). Source: `outputs/site2.json`, generated 2026-10-04. Not an external measurement.

Jobs (126), local food (5,500 t) and fish (1,500 t) are scenario estimates in `outputs/site2.json` `impact`, not measurements.

Campus denominator. **ASSUMPTION:** 10 dollars per watt, the midpoint of a published band, times 150 MW. Turner & Townsend Data Centre Construction Cost Index 2025, band 6.6-13.3 dollars per watt: https://reports.turnerandtownsend.com/data-centre-construction-cost-index-2025/ (cited from the model file). The 1.73 percent is arithmetic on that assumption, not a TeraWulf filing.

Town Board directed counsel to draft a ban, special meeting 2026-09-29. No vote on the ban itself. https://www.fingerlakes1.com/2026/10/02/lansing-moves-toward-data-center-ban-as-terawulf-debate-reaches-turning-point/ (verified 2026-10-03). https://607newsnow.com/news/258852-town-of-lansing-moving-forward-with-drafting-a-data-center-ban/ (verified 2026-10-03).

Half a million dollars: next year's proposed budget for legal costs, not an existing reserve. https://ithacavoice.org/2026/09/lansing-board-data-center-ban/ (verified 2026-10-03).

36 of 38 speakers: single source, 607 News Now, same URL. Ithaca Voice counted two speakers against the ban. Use only if asked (verified 2026-10-03, verdict CORRECTED in `research/verification.md`).

Gas moratorium invoked 2015, Town of Lansing. PSC Case 20-G-0131 order, May 12, 2022: https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BE068C615-B8EE-4CB9-AF92-3153A49BE4E4%7D (verified 2026-10-03). Still listed as a constraint as of the July 14, 2025 gas long-term plan update: https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7B30700A98-0000-CE30-9B40-1D15BBA44B68%7D (verified 2026-10-03). Status on 2026-10-04: [unverified].

Closed loop, dry coolers, no lake draw in operation: developer claim. https://lakehawkeyedata.com/closed-loop-cooling (verified 2026-10-03). Glycol is described there as food-grade and non-toxic. The page does not say propylene. Do not add that word.

DEC withdrawal 1,008,000 gallons/day, Cayuga Operating Company LLC, letter April 13, 2026, uses limited to maintenance, sump pumping, and dust control. https://dec.ny.gov/sites/default/files/2026-04/cayugaoperatingwwpermit.pdf (verified 2026-10-03).

Deep Green, Lansing, Michigan, not New York. Announced November 5, 2025; withdrawn April 6, 2026. https://www.lbwl.com/community/newsroom/2025-11-05-deep-green-proposes-120-million-sustainable-data-center-investment and https://www.wkar.org/michigans-data-center-divide/2026-04-06/proposed-data-center-wont-move-forward-in-lansing-as-deep-green-withdraws (verified 2026-10-03).

Capacity. Project site language of about 150 MW for phase 1 has an unstated basis. TeraWulf Q2 2026 release, August 5, 2026: about 400 MW gross, about 320 MW critical IT. https://www.sec.gov/Archives/edgar/data/1083301/000108330126000162/a_wulfearningsreleaseq22026.htm (verified 2026-10-03).

No designated disadvantaged community nearby. Organizer site pack, page 24: `resources/text/2026_10_01_Hackathon_NYU_-_Suburban_Site_-_Lake_Hawkeye.txt`.

Federal credits excluded from the base case: `outputs/site2.json` `extras.funding.note`, pointing at `research/verification.md` section 9d-i.

Explore slider label "Cost of money (discount rate)", base 7 percent (`LCOH_ANCHOR_PCT[1]`), KPI labels, and town-ring checkbox: `web/components/Explore.tsx` and `web/lib/model.ts`.

## Word count

Spoken deck paragraphs only (stage directions excluded; hyphenated numbers count as one word). Demo lines are separate.

| Slide | Words |
| --- | ---: |
| 1 | 48 |
| 2 | 60 |
| 3 | 61 |
| 4 | 59 |
| 5 | 97 |
| 6 | 72 |
| 7 | 49 |
| 8 | 37 |
| 9 | 43 |
| **Deck total** | **526** |

At about 130 words a minute that is about 4.0 minutes of speech inside the 5:00 slot, matching the "about 520 words" target above.

## Lane status

**Done**

- Deck v2: cold open on slide 1, ring map on slide 4, SVG system schematic on slide 5, $735 hero on slide 6, ERF and "scenario estimate" labels on slide 8, three-beat conditions of approval and team strip on slide 9.
- Script trimmed to about 520 spoken words, demo cut to 40 seconds with the town-ring tick as the wow beat.

**Missing**

- A live click-through of Explore was not run in this lane. Harsh must reset the page once before the session and read the integer it shows at 7%.
- Site WUE was not added to slide 8: it appears in neither `research/verification.md` nor `outputs/site2.json`.

**Open questions**

- Public URL for the demo machine was not set. Use whatever is already loaded offline if the network fails.
- 2026 status of the NYSEG moratorium is still [unverified] past the July 14, 2025 filing.

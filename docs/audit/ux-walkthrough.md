# Cognitive walkthrough: unattended Grundfos VP

Audience: a 65-year-old Grundfos vice president, opening the public URL alone, with no presenter. They know pumps, closed loops, heat pumps, and district energy. They do not know this team's information architecture. Success is whether they can leave with one site, one heat path, one number they will repeat, and the ask (a binding heat-reuse covenant for Lansing, New York).

Judging map used while walking: HDR regenerative lenses (Community, Ecology, Health; human health, community, air, carbon, water, biodiversity, nutrients) and Grundfos as the company that would pump the loop. Equity is rural energy burden. The Lake Hawkeye pack says there is no designated disadvantaged community nearby; the impact slide already says that, and this walk does not add an equity claim.

## How this was looked at

Read on 2026-10-04, in this order: `PLAN.md` (brief, lenses, three rings), `web/app/**/page.tsx`, `web/components/ui.tsx`, `web/components/story/Story.tsx`, `web/components/story/steps.tsx`, `web/components/Explore.tsx`, `web/components/Compare.tsx`, `web/components/HowItWorks.tsx`, `web/components/PrintSheet.tsx`, `web/components/viz/Sankey.tsx`, `web/components/viz/Misc.tsx`, `web/components/viz/Charts.tsx`, `web/lib/config.ts`, `web/lib/model.ts`, `web/public/data/site2.json`, and the PNGs in `web/screenshots/`.

No live browser was driven in this pass. The PNG set is not one build:

- `story-01` through `story-06` (saved 12:53–12:54) show four nav items, footer "Step n of 11", and a control labeled "5-minute path".
- `story-07` through `story-11`, plus Explore, Compare, and One-pager (saved just after), show five nav items including **How it works**, and the short-path counter ("Step n of 9", button **Show deep dive**). `story-07` is the exception: the capture script opens `/#7`, and that hash turns the long path back on (`Story.tsx` sets `short` to false when the hashed step is a deep dive).

The walk below follows **current source**. Where a PNG disagrees with current source, the file says so. `explore-1366.png` is a blank "Loading data..." frame (6,672 bytes) and is not treated as a product failure. There is no screenshot of `/how/`.

`PUBLIC_URL` in `web/lib/config.ts` is `https://github.com/harshagarwalnyu/Data-Center-Heat-Reuse`, with the comment that the live demo runs locally. This walk is of the app a reviewer sees at that deployment, not of the GitHub file tree.

## What they are trying to do

1. Confirm this is Lake Hawkeye / Lansing, New York, a real heat source, and a real offtake.
2. See where pumps and heat pumps sit, and that server cooling does not depend on the offtake.
3. Judge whether the community-benefit covenant is the condition of approval, and whether the money survives a question.
4. Leave with one number and one action.

## Route they actually walk

Cold open is `/` with no hash. `short` starts `true` (`Story.tsx`). Two of eleven story steps are marked `deepDive` and are skipped: the temperature ladder and the household calculator. Footer count and on-slide numbers diverge. Confirmed on the later PNGs: kicker "8" with "Step 6 of 9" (`story-08-1920.png`), kicker "9" with "Step 7 of 9" (`story-09-1920.png`), kicker "10" with "Step 8 of 9" (`story-10-1920.png`), kicker "11" with "Step 9 of 9" (`story-11-1920.png`).

| Clicks of Next | Footer | Kicker still printed on the slide | What they get |
|---|---|---|---|
| 0 | Step 1 of 9 | 1 · Lansing today | The ban, the gas moratorium, $136/MWh propane |
| 1 | Step 2 of 9 | 2 · The insight | 15× / 6.5% supply versus use |
| 2 | Step 3 of 9 | 3 · The plan | 10 ha, 500 homes, three rings |
| 3 | Step 4 of 9 | 4 · How heat flows | Side-stream Sankey |
| 4 | Step 5 of 9 | **6** · Matching through the year | Five match tests and two charts |
| 5 | Step 6 of 9 | **8** · Who pays, who owns | Co-op, ring costs, $26M gap |
| 6 | Step 7 of 9 | **9** · If the data center leaves | Hours, days, months, year 10 |
| 7 | Step 8 of 9 | **10** · Impact | CO₂, jobs, food, seven HDR petals |
| 8 | Step 9 of 9 | **11** · The ask | Three asks, QR code |

Skipped unless they press **Show deep dive** (or open `/#5` or `/#7`): temperature ladder, household bill. Those are the two slides this reader is equipped to judge.

Nav, always visible: Story, Explore, Compare sites, How it works, One-pager, plus Dark. A nav click to Story loads `/` with no hash, so the story remounts at step 1. Speaker notes, the timer, and the keys P, F, and S are presenter tools sitting in the public footer.

## Step-by-step

### Arrival

They see a cream page, a serif wordmark **Thermal Commons** and the tagline **Heat for Lansing**, a thin orange progress bar, and a full-viewport slide. Body type is 18px and headlines scale from 36px to 64px (`web/app/globals.css`). Buttons are at least 44px tall. For this reader the type is large enough. There is no title page, no "start", and no sentence that says "you are in a nine-step story; press Next." Next is visible and labeled. Back is disabled. That is enough to move, once they look at the footer. The keyboard line ("Arrows, space or PageDown…") is `hidden` below the `xl` breakpoint (1280px), so a laptop at 125–150% zoom (an assumed test condition, not a sourced prevalence figure) does not show it.

Space, PageDown, and ArrowDown call `preventDefault` and advance a step (`Story.tsx`). They do not scroll the slide. The shell is `h-dvh` and `overflow-hidden`. A mouse can scroll inside the slide. A keyboard cannot. At a zoom where the ownership chart or the impact grid clips, the key they expect to use to see the rest of the page turns the page instead.

**Notes (P)** opens a presenter script ("Open with the fight…") over the bottom of the slide and starts a timer. The label reads like "more explanation." It is the speaker crib.

### Step 1 of 9 — Lansing today

Seen in `story-01-1920.png` and `story-01-1366.png`. Headline: Lansing is about to ban data centers, and most of its heat still comes from delivered fuel. Three cards: Sept 29 (Town Board directed its attorney to draft a ban; $500,000 proposed for next year's legal budget, not an existing reserve), 2015 (NYSEG gas moratorium; "Rural Lansing has no gas pipe"), $136 per MWh propane, heating oil $156, with a parenthetical that propane was $2.74 to $3.46 per gallon (NYSERDA Central NY).

What they understand: a town is moving to ban data centers, and heat is expensive because there is no gas. Both fit the brief. $ per MWh is a unit this reader uses.

Where they get lost: the first body sentence is about **Lansing, Michigan** (a data center that offered free heat, then withdrew, then a moratorium). Lansing, New York is the second place named. Nothing on the slide says Lake Hawkeye, TeraWulf, the former Cayuga plant, or 150 MW. Those names exist only in speaker notes (`steps.tsx` notes for steps 2, 3, and 11). A reader who skims the lede can spend the next four slides unsure which Lansing the proposal is for. The screen's moratorium year, 2015, is correct (February 2015, `research/verification.md` row 6a). `PLAN.md` reality-check table says about 2014, and that is the discrepancy. The slide's 2026 status is unverified (row 6c).

$136/MWh is not yet compared with the project's price. That comparison arrives at footer step 6.

### Step 2 of 9 — The insight

Seen in `story-02-1920.png`. Headline rounds to **15×** and **6.5%**. The chart beside it says **15.4×**, **778 GWh** produced, **51 GWh** used (6.5%), split On-site campus 37.1 GWh and Corridor homes 13.5 GWh. Lede: 150 MW first phase, about 75% captured as 50 °C heat. Supply is not the constraint.

What they understand: this is the thesis, and the base case is 150 MW, the model's base-case assumption (not a confirmed phase size; the filing says about 400 MW gross and 320 MW critical IT). The tiny second bar is the right picture. 50 °C is a temperature they can use.

Where they get lost: the headline and the chart disagree by 0.4× because the headline uses `dec(ratio, 0)` and the chart uses `dec(ratio, 1)` (`steps.tsx`, `Misc.tsx` `RatioBars`). They will assume one of them is wrong. The town ring is absent from the bar, which is correct (it is conditional) and unexplained on this slide.

### Step 3 of 9 — The plan

Seen in `story-03-1920.png`. Headline: a 10-hectare year-round farm campus and 500 homes. Lede: bring users to the heat; town center only if the numbers pass. Map labels Data center, Cayuga Lake, Corridor homes, Town center, a 5 km scale. Cards: Phase 1 on-site 37.1 GWh/yr · 16 MW peak; Phase 2 corridor 13.5 GWh/yr · 7 MW peak; Phase 3 town center (if it pays) 3.6 GWh/yr · 3 MW peak. Those match `site2.json` rings (37,076 MWh, 16.36 MW; 13,500 MWh, 6.84 MW; 3,577 MWh, 2.96 MW) after rounding.

What they understand: three phases, town is conditional, users are supposed to come to the plant. The "if it pays" label is plain.

Where they get lost: the farm campus is in the headline and not on the map. Extra dots have no labels (SVG `<title>` only, so they appear on hover). The map aria-label says the town center is about nine kilometres south-east (`RingMap.tsx`); the scale bar says 5 km; the cards do not say 5–7 miles. A reader cannot tell the former coal plant from a generic lakeshore dot. TeraWulf is still unnamed.

### Step 4 of 9 — How heat flows

Seen in `story-04-1920.png`. Headline: heat export is a side-stream; the data center never depends on us to stay cool. Sankey, from the capture and from `Sankey.tsx` using `site2.json`: IT power in 120 MW avg (150 × 0.8), heat captured 89 MW at 50 °C, 31 MW not captured, heat pumps 5.8 MW delivered including 0.3 MW grid, on-site campus 4.2 MW avg, corridor homes 1.5 MW avg, dry coolers 115 MW avg, dashed box "Always on. Can reject 100% of the heat alone."

What they understand: cooling reliability is protected. The arithmetic 120 = 89 + 31 roughly closes, which is what this reader checks first. Dry coolers as the rejection path matches the closed-loop / fan-cooler fact. This slide does not claim lake-water savings.

Where they get lost: every delivered megawatt is drawn through a column labeled **Heat pumps**, including the on-site campus, which the model marks `direct_heat_exchange: true` at 45 °C (`site2.json` ring onsite). A greenhouse that needs no lift is pictured as a heat-pump load. The 0.3 MW amber "grid" sliver is the only electrical input, and it is easy to miss. Circulation pumps, the actual Grundfos seat, are a $0.93M capex line inside `site2.json` (`"Circulation pumps + plant"`) and do not appear on the slide. "Sealed cooling loop" is as close as the visible copy gets to the glycol loop; the glycol sentence is in speaker notes only. There is no side-stream exchanger called out as equipment.

### Hidden — Temperature ladder (kicker 5)

Not on the default path. `story-05-1920.png` is from the earlier build (footer "Step 5 of 11"). It shows a ladder: air-cooled 30 °C, liquid-cooled 50 °C, direct use up to about 45 °C, town buildings at 70 °C. Names are cut at 30 characters in current `TempLadder` (`o.name.slice(0, 29)`): "On-site greenhouse campus (10…", "Lansing Central School Distri…", "Lansing Community Library + C…". This reader cannot tell which building is which without a hover target the SVG does not expose as text.

The earlier PNG prints row labels **COP 6.6** next to a footer **Liquid-cooled COP 6.0**. Current `cop()` clips to 6 (`web/lib/model.ts`, `COP_MAX = 6`). The same 70 °C sink and 50 °C source is 0.5 × 343.15 / 26 = 6.60 before the clip, so today's code would print COP 6.0 and the 6.6 on that PNG is the pre-clip build. The contradiction may already be fixed in code. The truncation is not. The headline still says buildings get "a small boost" for a 20 K lift. For this reader that phrase is the one they will argue with, and it is on a slide the default path never shows.

### Step 5 of 9 — Matching (kicker still says 6)

`story-06-1920.png` and `story-06-1366.png` show the layout. Headline from that capture: even in the leanest month, supply is 7.3× demand. January in `site2.json` is 65,250 / 8,954 = 7.3, so the headline matches January. Five pills: temperature (50 °C, COP 4.7), capacity (15×, 51 GWh/yr), timing, seasonality (summer demand 8% of January), continuity (0 unmet hours, backup 0.7% of heat). Backup share 373 / 50,576 = 0.74%, which displays as 0.7%. Average COP 4.71 displays as 4.7. Both widths fit the five pills and both charts.

What they understand: the five-axis match the brief asked for, in one glance, and summer does not empty the load because something on site stays on. Zero unmet hours plus a small backup share is a continuity claim they know how to test.

Where they get lost: the footer says step 5 and the kicker says 6, so they think a slide was skipped. It was: the ladder. The timing pill on the earlier PNG says "about 11 h of peak." Current code uses one `storageHours` for this pill and for the exit slide: (5,558 m³ × 1.163 kWh/m³/K × 20 K) / 23.2 MW peak = 5.6 h, displayed as **6 hours**. The later exit PNG says 6 hours. Do not quote 11 hours from `story-06`. The week chart plots MW and outdoor °C on one panel (`Charts.tsx` has two Y axes). The only plain sentence is the caption under the chart. The supply line sits near 65 GWh while the demand bars are a few GWh, so the monthly demand is almost illegible, which restates step 2 rather than showing the shape of demand.

`totals.unmet_note` in `site2.json` says unmet hours are 0 by construction because backup is sized to 100% of peak. The pill states 0 unmet hours as a result. This reader will ask whether that was an outcome or a sizing choice. The answer is on the exit slide, not here.

### Hidden — Your household (kicker 7)

Not on the default path. `story-07-1920.png` was forced on by the hash, so its footer says "Step 7 of 11" and "Back to 5-minute path", while the nav already includes How it works. The slide itself is the clearest money slide in the app: "A typical propane home saves about **$735** a year." Fuel choice (propane, heating oil, natural gas, electric baseboard) and size (small / typical / large). Card: $735 per year, 6.0 t CO₂, propane today $3,675, community heat $2,940, 27.0 MWh, tariff $109/MWh, low-income $89/MWh. Those match `site2.json` `finance.household` and the tariffs (108.9 and 88.5, rounded).

What they understand, if they ever see it: the gas moratorium is the reason the product exists, and gas customers are told they do not save (the headline switches when savings are negative; `HouseholdCalc`). This is the affordability hook, in household dollars, which $136/MWh on step 1 never became.

Where they get lost: they do not see it. **Show deep dive** does not say that a household bill is behind the button.

### Step 6 of 9 — Who pays (kicker 8)

Seen in `story-08-1920.png` with footer "Step 6 of 9" and **Show deep dive**. Flow: Data center sells heat → **Thermal Commons co-op** owns pipes and heat pumps, **$39M** capex, "public finance" → homes, farms, school pay **$109** per MWh, low-income **$89**. Chart title: cost to make heat by ring, **7% finance**. Bars from current `RingLcoh` and `site2.json`: on-site about **$41** "pays for itself" (40.6), corridor **$286** "needs a benefit fund" (285.8), town **$734** "not yet" (734.2), air-source heat pump about **$97** (96.9), propane reference **$136**. Side card: gap **$26.0M** ($13.3M incentive scenario only, unverified: it applies to potentially qualifying ground-source assets, not the waste-heat network itself, and needs tax counsel); Community Benefit Agreement about **2.0%** of the build, **$2.44M** a year at 7% over 30 years. Capex 38.76 displays as $39M. Funding gap 26.01 and incentive gap 13.28 match the card. `cba.as_pct_of_dc_capex` is 2.02 and `per_year_annuitized_7pct_musd` is 2.443.

What they understand: a co-op, not a gift of free heat. The town pipe fails a cost test. On-site heat is the cheap sink. Someone has to fill a $26M gap. This is the covenant, and it is the first time the co-op is named in the story.

Where they get lost: three prices sit on one slide without a single sentence that ties them. Customers pay $109/MWh. The corridor costs $286/MWh to make. The card said "public finance" and the chart is titled 7% finance. Explore, if they open it, shows a blended **$90/MWh** at 4% co-op finance (`story` does not show $90). The same JSON also stores `headline_as_pct_of_dc_capex` 1.73 and `headline_basis` text that says to quote the whole-project figure (`site2.json` `extras.cba`). The slide quotes 2.0% and $2.44M. A reader who later finds 1.73% will think the ask moved. The kicker number (8) and the footer (6 of 9) disagree, so they also think they missed the ownership slide's setup. They did: the household bill.

### Step 7 of 9 — If the data center leaves (kicker 9)

Seen in `story-09-1920.png`. Headline: if the data center leaves in year 10, the heat keeps flowing and the town is not left holding the bill. Four cards: storage 5,558 m³ holds about 6 hours of peak; backup boilers sized for 100% of 23 MW peak, today 0.7% of annual heat; step-in, corridor heat about **$93** more per MWh, replacement source about **$10M**; year-10 reserve covers about **$6M**. Footnote: the data center's cooling never depended on this network. Figures match `finance.dc_exit` (year 10, stranded 5.71, replacement 10.35, uplift 93.2) and peak 16.36 + 6.84 = 23.2 MW.

What they understand: the shutdown question is answered before they ask it, in time order, and cooling independence is repeated. That is the right structure for this reader.

Where they get lost: the headline says the town is not left holding the bill. The third card says heat costs $93/MWh more and a replacement source is about $10M. The reserve on the fourth card is about $6M. $6M does not fund a $10M source. Who writes the check for the difference is not on the slide. "Step-in rights" is contract language with no gloss.

### Step 8 of 9 — Impact (kicker 10)

Seen in `story-10-1920.png`. Headline: 11,456 t CO₂, 126 jobs, 5,500 t local food. Tiles repeat CO₂ (about 2,490 cars), 500 homes, 126 jobs, 5,500 t food. Then eight cards: Community / Community, Community / Human Health, Ecology / Carbon, Ecology / Nutrients, Ecology / Water, Ecology / Biodiversity, Health / Air, and a Lansing-context note. Water copy: "Closed-loop dry cooling stays; no lake-water claim." Context note: no designated disadvantaged community; equity means older residents and propane and oil households; ERF 0.046; ERE 1.15; up to 69 days above 90 °F by 2050 (19 today). Numbers match `impact` in `site2.json` (11,456 t, 2,490 cars, 500 homes, 126 jobs, 5,500 t, erf 0.0462, ere 1.154).

What they understand: this is the HDR page. Water is stated as a non-claim, which is the correct reading of the closed loop. The disadvantaged-community sentence does not overreach. Jobs and food give the covenant something other than carbon.

Where they get lost: the first petal chip and the petal title are the same word, so the card reads "Community Community." Carbon says "HP" with no expansion. ERF and ERE are unexplained on a slide whose reader is a pump executive, not an energy-reuse specialist. `hdr_scorecard[].metric` is in the JSON ($735/yr, 10 ha, 0 gal/yr, 11,455 t) and is not rendered; the card shows `claim` only (`steps.tsx`). Biodiversity is a sentence with no figure, even though the metric in the file is "10 ha greenhouse on former coal site." The seven domains are present. The metrics that would make them believable are one field away and not on screen.

### Step 9 of 9 — The ask (kicker 11)

Seen in `story-11-1920.png`. Headline: say yes with conditions; a Community Benefit Agreement worth **2.0%** of the build. Three numbered asks: Town of Lansing (CBA plus Heat Supply Agreement as a condition of approval), the data center (sell heat, keep cooling independent, keep the lake permit unused for cooling, fund the exit reserve), funders and the state (feasibility and Phase 1; NYSERDA; federal credits only if structured to qualify). QR and the line "Try the model yourself. Move the sliders in Explore mode." The URL printed under the QR is the GitHub repository. Credits name the four authors and "HDR x Grundfos" in about 15px type. Next is disabled.

What they understand: the proposal is a condition of approval, not a brochure. Three parties, three jobs. Grundfos appears here for the first time, in the credit line, after the decision.

Where they get lost: the QR does not open Explore. `QrCode` encodes `PUBLIC_URL`, the GitHub repo (`config.ts`). The sentence under it tells them to move sliders. Scanning the code leaves the model. There is no link to How it works, where the formulas are. There is no "you are done" other than a disabled Next. The 2.0% is the same figure as step 6, with the same unspoken 1.73% sibling in the JSON.

### If they leave the story

**Explore** (`explore-1920.png`). Headline is plain: change the assumptions and watch the answer move. Sliders: electricity price $108/MWh, air 30 °C vs liquid 50 °C (liquid selected), corridor sign-up 100%, discount rate 4.0%, IT load 150 MW, a checkbox "Add the town-center ring (Phase 3; fails the cost test today)", and Reset. Results: 778 GWh/yr produced, 727 left over, 51 GWh delivered, COP 4.7, cost **$90 per MWh**, propane-home saving about **$734** a year, 11,456 t CO₂. The bar chart puts community co-op (4%) at $90 against propane $136, oil $156, gas $64 "no new hookups", electric baseboard $245. Footnote defines $ per MWh and says base sliders match the hourly model. Town ring shows 0.0 GWh and "off".

This is the page they can operate without a presenter. Labels are in words. The town checkbox says the cost test already failed. The trap is the $90. It is real (`lcoh_usd_mwh.coop_4pct` 89.5) and it is a different number from the $286 corridor bar on the story. Nothing on Explore says "this $90 is a blend; the corridor alone is $286 and needs the fund." A reader who trusts Explore and then reads the one-pager will repeat $90. A reader who trusts the story chart will repeat $286. Both are in the model. The screen never says they answer different questions.

`explore-1366.png` never finished loading. Treat that as a bad capture, not as evidence, unless someone reproduces it.

**Compare sites** (`compare-1920.png`). Headline: "Lansing wins." Toggle defaults to Site 2, Lake Hawkeye. Four bullets: liquid cooling at 50 °C, cleaner upstate grid, the live fight and the gas moratorium, unused acreage. Table from the capture: IT 150 vs 30 MW, capture 50 °C vs 32 °C, heat 778 vs 107 GWh/yr, COP 6.0 vs 5.1, cost $90 vs $257 per MWh, CO₂ 11,456 vs 11,502 t/yr. Checks mark the higher heat, the higher COP, the lower cost, and the **higher CO₂, which is Site 1**. A 16px footnote says Site 1 includes its town-ring heat pump and Lansing totals are phases 1–2 only.

What they understand: why not Manhattan, in one table, and 50 °C versus about 30 °C is the technical reason they came for.

Where they get lost: the headline says Lansing wins and the carbon row, the HDR row, awards the check to New York City. The reason is in the footnote. Column titles in the capture read as run together ("Site 2 LansingSite 1 NYC"). "Heat available" gives the check to whichever site has more waste heat, which is not a win this reader automatically accepts. The page does not say Site 1 is a commissioned carrier hotel.

**How it works** (no PNG; source `HowItWorks.tsx`). H1: every number comes from an hour-by-hour model you can rerun. Four boxes (weather, supply, dispatch, finance), a live COP slider with the formula `0.5 × T_sink / (T_sink − T_source + 2 × 3 K)` clipped to 2–6, the LCOH formula, CRF at 4% and 7%, and the three results $90 / $106 / $125 per MWh (89.5, 106.1, 124.6). It states the tariff is policy (0.8 × propane), not cost, so the gap is a funding question. Honest limits are on the page: one 30-year life, capture fraction is an assumption, map geometry is approximate. Sources are the `site2.json` source list, truncated at 150 characters, with links.

This is the page that would make this reader trust the file. It is a nav item with no pointer from the story, and it was not in the screenshot set. The test counts ("15 Python tests", "20 web tests") are sentences on the page. This walk did not run them.

**One-pager** (`print-1920.png`). A letter sheet on screen, with **Print this page**. Headline matches the plan slide (10 ha, 500 homes). Four numbers: 778 GWh/yr, **15.4×**, **$735** saved per propane home, 11,456 t CO₂. Map, three phases, and a cost chart: community-owned **$90**, propane $136, oil $156. Safeguard line: dry coolers, 0 unmet hours. The ask repeats 2.0% and the GitHub URL. The town-center label on the map is cut off at the bottom of the map frame.

Phase energy on this sheet uses `int()`, which rounds: corridor 13.5 GWh prints as **14**, town 3.6 GWh prints as **4**. The story cards say 13.5 and 3.6. The multiple is 15.4× here and 15× on the story headline.

What they keep: a sheet that shows $90 beating $136, and no $286, no $26M gap, no "town ring fails." If this is the paper they put in a folder, the number they defend is the one the story's own chart says is not the corridor's cost.

## Where they get lost

Ordered by whether it changes the decision, not by slide number.

1. **The default path hides the two slides this reader is qualified to judge.** Temperature match and the household bill are `deepDive`. Nine clicks of Next never show COP by user or $735 against a fuel they chose. The button that reveals them says **Show deep dive**, which does not name either slide.
2. **Three "cost of heat" numbers, and the leave-behind keeps the friendliest one.** Story rings at 7%: $41 / $286 / $734. Explore and the one-pager: $90 blended at 4%. Tariff they pay: $109. The one-pager omits the gap. They will repeat whichever number they saw last.
3. **The Sankey calls the whole delivery path "Heat pumps."** Direct 45 °C campus heat and a 0.02 pumping fraction (`DIRECT_PUMP_FRACTION` in `model.ts`) are drawn as a heat-pump node. Circulation pumps never appear. Grundfos is a credit line on the last slide.
4. **Two numbering systems.** Kickers 1–11, footer 1–9, and the missing numbers are 5 and 7. After step 4 the kicker jumps to 6 while the footer says 5. It looks broken. It is the short path working as coded.
5. **Opening sentence is the other Lansing.** Michigan is the precedent. It is the first place the body names.
6. **The QR leaves the model.** The ask says to try the sliders. The code opens GitHub (`config.ts`).
7. **The exit headline is stronger than the cards.** "Not left holding the bill" sits above a $93/MWh uplift, a $10M replacement, and a $6M reserve.
8. **Keyboard advances instead of scrolling.** Space and PageDown cannot reveal a clipped slide. At the zoom this reader uses, that is how slides get skipped half-read.
9. **Notes looks like help and shows a script.**
10. **Impact petals drop the metric field and print "Community" twice.** ERF and ERE are unexplained. The water non-claim is the sentence that is already right.
11. **Compare awards carbon to Site 1 under a "Lansing wins" headline.** The reason is a footnote.
12. **The map never names the plant, the company, or the farm.** TeraWulf and Lake Hawkeye LLC are in speaker notes only.

## Fixes ranked by impact

Impact means: would this reader still be able to defend the proposal after ten minutes alone.

1. **Put the ladder and the household bill on the default path.** Keep a shorter path as an explicit cut ("Hide the temperature ladder and the household bill"), not as the thing a stranger gets. The deep-dive button should name those two slides.
2. **One money sentence, repeated on the story, Explore, the ask, and the one-pager.** Customers pay about $109/MWh. Blended cost at 4% community finance is about $90/MWh. The corridor alone costs about $286/MWh at 7% and does not pay for itself. The fund to hold the tariff is about $26M. The town main fails ($734/MWh) and stays off. The one-pager must show the $26M and the failed town main, or it will be the number that gets quoted.
3. **Redraw the Sankey so direct campus heat does not pass through a box called Heat pumps.** Label three pieces of equipment: side-stream exchanger on the sealed loop, heat pumps only where there is a lift, circulation pumps on the loop. One line on Grundfos's role belongs on this slide, not in the credits.
4. **One step counter.** Either number the short path 1–9 in the kickers, or show "Step 5 of 9 (slide 6 of 11)". Jumping from kicker 4 to kicker 6 is what makes the path feel broken.
5. **Rewrite the first body sentence so Lansing, New York is the subject.** Put Michigan in a single labeled precedent line. Put "Lake Hawkeye, former Cayuga plant, 150 MW first phase" on slide 1 or in the wordmark tagline.
6. **Point the QR and the "try the model" line at `/explore/` on this origin.** Keep the GitHub link in How it works, with the word "source code".
7. **Match the exit headline to the cards.** Say the reserve covers the stranded asset (about $6M) and name who pays the replacement source (about $10M) and the $93/MWh uplift. Cooling independence can stay as the footnote; it is already clear.
8. **Stop stealing Space, PageDown, and ArrowDown from scrolling.** Next stays a button. Arrow keys scroll the slide when it overflows, and move steps only from the ends.
9. **Rename Notes to "Speaker script"** so a lone reader does not open it looking for definitions. Or hide it until P is pressed, and do not give it a footer button on the public URL.
10. **On the impact grid, print each petal once and show `metric`.** Spell energy reuse factor and energy reuse effectiveness, or drop the acronyms to How it works. Keep the water non-claim and the disadvantaged-community sentence as they are.
11. **On Compare, put the carbon caveat in the headline area.** "Lansing wins on temperature, cost, and a live decision. Site 1 avoids slightly more CO₂ because its total includes a town ring Lansing does not build." Separate the column headers. Do not mark "more waste heat" as a check without a reason.
12. **Label the map.** Former Cayuga plant, on-site farm campus, town center about 5–7 miles / the kilometres the geometry actually uses. Drop unlabeled dots or name them.
13. **Round once.** 15.4× in the headline and on the one-pager. 13.5 and 3.6 GWh on the one-pager, not 14 and 4. Quote one CBA percent. The file's own `headline_basis` says the whole-project figure is the one to quote (1.73%, about $2.1M a year). The slides quote 2.0% and $2.44M. Pick the one the data file tells the team to quote, and use it everywhere.

## What already works for this reader

- Type size and button size are in the range a 65-year-old can read on a laptop (`globals.css`, 44px nav targets). The 1366px matching slide still fits.
- The side-stream / dry-cooler sentence is the right reliability claim, and the water card refuses a lake-water saving. That matches the closed-loop fact and the HDR water lens without overclaiming.
- 150 MW is the base case on the insight slide, not 400 MW.
- The town ring is labeled conditional on the plan slide and "fails the cost test today" on Explore.
- The exit slide answers shutdown in time order, before the ask.
- The impact slide uses the seven HDR petals and states that Lansing has no designated disadvantaged community.
- Explore is operable alone: named sliders, a reset, a base-case delta, and a footnote that says what a dollar per MWh means.
- How it works, once found, shows the COP formula, the clip at 2–6, the funding-gap logic, and limits (30-year life, capture fraction, approximate map).

## Sources

Page copy and behavior: `web/components/story/Story.tsx`, `web/components/story/steps.tsx`, `web/components/ui.tsx`, `web/components/Explore.tsx`, `web/components/Compare.tsx`, `web/components/HowItWorks.tsx`, `web/components/PrintSheet.tsx`, `web/components/viz/Sankey.tsx`, `web/components/viz/Misc.tsx`, `web/components/viz/Charts.tsx`, `web/components/viz/RingMap.tsx`, `web/lib/config.ts`, `web/lib/model.ts`, `web/lib/format.ts`, `web/app/globals.css`. Read 2026-10-04.

Numbers on screen come from `web/public/data/site2.json` (`meta.generated` 2026-10-04). Displayed figures in this note were checked against that file and the formatters (`int` rounds, `dec` fixes one decimal). Screenshot pixels: `web/screenshots/story-01` through `story-11`, `explore-1920.png`, `compare-1920.png`, `print-1920.png`. `explore-1366.png` did not render the page.

`PLAN.md` reality-check table (draft 2026-10-03) is the source for the "~2014" moratorium year (a discrepancy: the verified date is February 2015) and for the instruction not to treat Deep Green in Lansing, Michigan as this site. This walk did not re-fetch the news URLs. Claims about Michigan, the Sept 29 board action (an attorney was directed to draft a ban; no vote adopted one), and the $500,000 (proposed for next year's legal budget) are quoted as what the interface says.

No public live URL was opened. `PUBLIC_URL` is the GitHub repository, not a deployed app.

## Lane status

- Done: cold-open path from current `Story.tsx` (short path, nine steps, ladder and household skipped); step-by-step of what a lone Grundfos VP sees, understands, and where the path breaks; nav pages Explore, Compare, How it works (source only), and the one-pager; ranked fixes; HDR petal slide and the water non-claim checked against `site2.json`.
- Missing: a live click-through in a browser, including 150% zoom and a real keyboard pass (space versus scroll). No PNG of `/how/`. `explore-1366.png` is a loading frame, so the narrow Explore layout is unseen. Story PNGs 1–6 are an earlier build (footer "of 11", no How it works); behavior for those steps is taken from current source plus the later PNGs where they overlap. Did not re-run Python or `bun` tests, so the "15" and "20" test counts are page copy. Did not re-verify Michigan, the 2014-versus-2015 moratorium year, or the Sept 29 news URLs.
- Open questions: what the public URL will be at submission, and whether the deployed build still defaults `short` to true. Whether the team wants the quoted CBA at 2.0% ($2.44M/yr) or the file's whole-project 1.73% ($2.10M/yr); the slides and `headline_basis` disagree, and this lane does not own the model. Whether speaker notes should exist at all on the unattended URL.

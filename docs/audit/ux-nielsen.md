# Nielsen 10-heuristic review — Thermal Commons pitch app

**Interface:** Thermal Commons story / explore / compare / one-pager. Site 2 is Lake Hawkeye, Lansing NY. Site 1 (111 8th Ave) is the comparison.
**Audience:** 50–70-year-old executives, watching a projector. Success is one sentence they can repeat: the ask, the site, the heat path, and one number they trust.
**Date:** 2026-10-04
**Method:** Expert review of all 28 PNGs in `web/screenshots/` against Nielsen’s 10 heuristics. Severity 0–4 as in Nielsen Norman Group practice (0 none, 1 cosmetic, 2 minor, 3 major, 4 catastrophic). Heuristic names follow “10 Usability Heuristics for User Interface Design,” https://www.nngroup.com/articles/ten-usability-heuristics/ — page not re-fetched this run [unverified fetch].
**How the pixels were read:** Each PNG was inspected visually. Where a claim is also in the component that draws that screen, the file is named. Strings that appear only in a PNG are marked as seen on that file. No live click-through was run (dark mode, speaker notes open, fuel toggles, print-to-PDF).

## Audience and task

Judges from HDR and Grundfos sit through Story, then may be handed Explore, Compare, or the one-pager. The room is far from the screen. Type that is fine on a laptop fails. Jargon (COP, MWh, ERF, step-in rights) fails. Two different numbers for the same idea fail, because this audience checks arithmetic.

What the screens already do well for that room: large serif headlines, a lot of empty cream space, a persistent nav with the current section filled in navy, “Step N of 11,” dollar savings per year on the household slide, and a town-center control that says the phase fails its cost test.

## Heuristic legend

| ID | Heuristic |
|----|-----------|
| H1 | Visibility of system status |
| H2 | Match between system and the real world |
| H3 | User control and freedom |
| H4 | Consistency and standards |
| H5 | Error prevention |
| H6 | Recognition rather than recall |
| H7 | Flexibility and efficiency of use |
| H8 | Aesthetic and minimalist design |
| H9 | Help users recognize, diagnose, and recover from errors |
| H10 | Help and documentation |

Severity: 0 not a problem · 1 cosmetic · 2 minor · 3 major · 4 catastrophic (the pitch cannot survive the question).

## Screenshot inventory

Captured by `web/scripts/shots.mjs` at 1920×1080 and 1366×768. All 28 files were opened on 2026-10-04.

| Pair | What it is |
|------|------------|
| story-01-1920.png, story-01-1366.png | Lansing today |
| story-02-1920.png, story-02-1366.png | Supply versus use |
| story-03-1920.png, story-03-1366.png | Map and phases |
| story-04-1920.png, story-04-1366.png | Heat-flow diagram |
| story-05-1920.png, story-05-1366.png | Temperature ladder |
| story-06-1920.png, story-06-1366.png | Year and week match |
| story-07-1920.png, story-07-1366.png | Household savings |
| story-08-1920.png, story-08-1366.png | Who pays |
| story-09-1920.png, story-09-1366.png | If the data center leaves |
| story-10-1920.png, story-10-1366.png | Impact / HDR lenses |
| story-11-1920.png, story-11-1366.png | The ask |
| explore-1920.png, explore-1366.png | Sliders. **1366 file is a loading screen, not the tool.** |
| compare-1920.png, compare-1366.png | Site 2 vs Site 1 |
| print-1920.png, print-1366.png | Letter one-pager. 1366 shows the top of the sheet only (viewport shorter than 11 in). |

1920 and 1366 tell the same story except where a finding says otherwise. 1366 does not hide the nav or clip the story headlines.

## Executive summary

**Issues logged:** 16 (plus passes).
**Severity 4:** 0. **Severity 3:** 8. **Severity 2:** 6. **Severity 1:** 2.

The pitch structure fits this audience. The risk is arithmetic the room can see without help: three COP figures on one slide, three different dollar-per-MWh ideas across slides, and a Compare page whose check marks disagree with its headline. No single bug blocks clicking through. Any one of those three will stop a finance question.

Overall: **6 / 10** for a projector pitch to this audience. Strong frame, unsafe numbers.

## Findings

### F1 — Three COP figures on the temperature ladder

- **Severity:** 3 (major)
- **Heuristics:** H4, H2, H6
- **Screenshots:** `story-05-1920.png`, `story-05-1366.png`
- **What the room sees:** The sentence under the headline says average heat-pump COP is **4.7** and glosses it (“one unit of electricity moves about 4.7 units of heat”). The legend under the chart says air-cooled COP **4.7** and liquid-cooled COP **6.0**. The dots for the school, library, and town hall say **70 °C boost, COP 6.6**. Same width at 1366 and 1920.
- **Why it matters:** This is the slide that explains liquid cooling. A reviewer who can subtract will ask which COP is the model. Later slides that say 4.7 inherit the doubt.
- **Fix:** One number in the headline, the same number in the legend, the same number on the dots. Put the plain gloss in the headline (“one unit of electricity moves about N units of heat”) and delete the second and third figures, or label them as three different things in words a non-engineer already knows: “network average,” “if the source is 50 °C,” “lift to 70 °C for the school.” Do not use the bare acronym until that gloss has appeared.
- **Also in code:** `web/components/story/steps.tsx` (lede uses average COP; legend maps `cop_compare`) and `web/components/viz/Misc.tsx` (`TempLadder` prints `cop()` on each dot when the value is under 8).

### F2 — The ladder cuts off the names that are the point

- **Severity:** 3 (major)
- **Heuristics:** H6, H8
- **Screenshots:** `story-05-1920.png`, `story-05-1366.png`
- **What the room sees:** Labels end in ellipses: “On-site greenhouse campus (10…”, “McKissick Farms / Cayuga Land…”, “Lansing Central School Distri…”, “Lansing Community Library + C…”. Both widths. The headline claims greenhouses and buildings; the chart will not say which greenhouse or which building.
- **Fix:** Allow two lines per name, or drop “(10 ha)” and “campus” so the proper noun fits. The 30-character cut is in `TempLadder` (`o.name.slice(0, 29)` in `web/components/viz/Misc.tsx`). Full names live in `web/public/data/offtakers.json` (for example “Lansing Central School District campus”, “McKissick Farms / Cayuga Landscape greenhouses”).
- **Do not:** Shrink the type further to fit. The back row already loses 17px SVG text.

### F3 — $38, $83, and $109 are all “the cost of heat”

- **Severity:** 3 (major)
- **Heuristics:** H4, H2, H6
- **Screenshots:** `story-07-1920.png`, `story-07-1366.png`, `story-08-1920.png`, `story-08-1366.png`, `explore-1920.png`, `print-1920.png`, `print-1366.png`
- **What the room sees:**
  - Story 7: community heat **priced at $109 per MWh** (low-income $89). Savings **$735** a year.
  - Story 8: on-site campus **$38 per MWh**, homes “pay **$109** per MWh,” corridor **$272**, town center **$718**, co-op node “**$39M** capex,” side card “gap **$22.3M** ($10.7M if federal credits qualify).”
  - Explore: “Cost to make heat **$83** per MWh,” propane-home saving **$734** per year (one dollar off Story 7).
  - One-pager: “Our heat (community-owned) **$83**.”
- **Why it matters:** Each figure can be a different idea (campus cost, co-op cost, tariff). The slides never put those three words on one line. The room will ask “is it 38, 83, or 109?” and the answer is split across four screens. $39M versus $22.3M on Story 8 is the same kind of collision inside one slide; the side card does explain the gap, in the smallest paragraph on the slide.
- **Fix:** A single spoken line, repeated wherever a dollar-per-MWh appears: “Homes pay $109. It costs the co-op about $83 to make. The on-site farm is $38 because the pipe is short.” Round $734 and $735 with the same function. On Story 8, make the headline the $38 versus $136 comparison and move $22.3M / $39M / 1.9% into speaker notes, or give each money figure a four-word name in 24px type.

### F4 — Compare says Lansing wins the carbon argument; the check marks do not

- **Severity:** 3 (major)
- **Heuristics:** H4, H2, H5
- **Screenshots:** `compare-1920.png`, `compare-1366.png` (same table at both widths)
- **What the room sees:** Headline: “Lansing wins: hotter heat, a cleaner grid, and a community that needs an answer.” Left card: “Cleaner upstate grid, so heat pumps save more carbon.” Table: IT load 150 vs 30 (no check), capture temperature 50 ✓ vs 32, heat available 778 ✓ vs 107, average heat pump COP 4.7 vs **5.2 ✓** (check on Site 1), cost of heat 83 ✓ vs 238, CO₂ avoided **11,456 vs 11,502 ✓** (check on Site 1). Footnote on the PNG: “A check mark shows the better value on that row.”
- **Why it matters:** Absolute tonnes make a 150 MW proposal look tied with a 30 MW building, then the check awards the tie to New York. The headline has already claimed the carbon win. There is no “these are totals, not per megawatt” on the PNG.
- **Fix:** Change the headline to the rows Lansing actually wins (hotter heat, much more heat, much cheaper heat, a town that has to decide). Either drop CO₂ from this table or show it per MW and say “totals.” If Site 1’s COP check is real, do not call 4.7 a win anywhere on this page.
- **Note:** A read of `web/components/Compare.tsx` during this audit shows a longer COP label (“capped at 6”) and an extra footnote about phases. Those words are **not** on the PNGs. Recapture before treating that footnote as what the room saw.

### F5 — The heat-flow diagram looks like it violates conservation

- **Severity:** 3 (major)
- **Heuristics:** H2, H6, H10
- **Screenshots:** `story-04-1920.png`, `story-04-1366.png`
- **What the room sees:** IT power in **120 MW avg**. Heat captured **89 MW at 50 °C**. **31 MW not captured**. Heat pumps **5.8 MW delivered**, with a small note “incl. 0.3 MW grid.” On-site campus **4.2 MW avg**. Corridor homes **1.5 MW avg**. Dry coolers **115 MW avg here**. Both widths show the full figure, including the dashed teal box around the dry coolers. The headline (“the data center never depends on us to stay cool”) is the right sentence and is large enough.
- **Why it matters:** 115 is larger than 89, and 115 + 5.8 is not 120. The diagram is explainable (31 never captured, plus captured heat nobody took, plus a little grid electricity inside the 5.8). The explanation is not on the slide. White dashes through the ribbons read as a second encoding; in code they are a motion stroke (`web/components/viz/Sankey.tsx`).
- **Fix:** One line under the figure, 20px or larger: “115 at the coolers = 31 never captured + the captured heat we do not sell. 4.2 + 1.5 is the 5.8 delivered, and 0.3 of that is grid electricity.” Keep the dry-cooler sentence.

### F6 — Lansing, Michigan is a paragraph under a New York headline

- **Severity:** 3 (major)
- **Heuristics:** H5, H2, H6
- **Screenshots:** `story-01-1920.png`, `story-01-1366.png`
- **What the room sees:** Headline is about banning data centers and delivered fuel. It does not say New York. The paragraph begins “Free heat was not enough in Lansing, Michigan” and ends “Lansing, New York needs ownership…” Both state names are present. They are body size, under a headline that only says Lansing.
- **Why it matters:** This audience will flatten the two towns into one story. The team’s own constraint is that Deep Green’s project is Lansing, Michigan, and must not be mixed with this site. The copy tries. The layout does not.
- **Fix:** A labeled chip above that paragraph, larger than the body: “Different city — precedent is Lansing, Michigan.” Keep the New York facts in the three cards. Also rewrite the 2015 card. It now reads “2015 / year the NYSEG gas moratorium began” (`steps.tsx` tile label starts with the word “year”). Make the card body “NYSEG stopped new gas hookups. Rural Lansing has no gas pipe.”
- **Related, severity 2, same screenshots:** The fuel card leads with **$136 per MWh**. The gallon range ($2.74 to $3.46) and heating oil **$156** are the smaller line. For this audience, dollars per year (already on Story 7) or dollars per gallon should be the big type. MWh can sit underneath.

### F7 — The impact slide is a dashboard, and the equity card is the densest one

- **Severity:** 3 (major)
- **Heuristics:** H8, H2, H10
- **Screenshots:** `story-10-1920.png`, `story-10-1366.png`
- **What the room sees:** Headline already holds three takeaways (11,456 tonnes CO₂, 126 jobs, 5,500 tonnes of food), then four more big numbers, then eight small cards. The first card prints the word Community twice (lens chip “Community” plus petal “Community”). Confirmed in `web/public/data/site2.json` `hdr_scorecard[0]`. Carbon card says “Clean upstate grid lifts HP carbon benefit” (HP undefined on this slide). The Lansing-context card is the right equity sentence — no designated disadvantaged community; equity means older residents and propane and oil households — and then, in the same small block: “Energy reuse factor (ERF) 0.046, ERE 1.15” plus a 2050 heat-day line. Both widths show this. Nothing is clipped.
- **Why it matters:** HDR’s lenses are why the cards exist. At projector distance the lenses are the text that disappears, and the one careful equity line is paired with unexplained indices. Water is handled correctly (“no lake-water claim”). That card should stay.
- **Fix:** Keep the four big numbers. Replace the eight cards with four lines at 24px: Community, Health, Ecology, and the equity sentence alone. Move ERF, ERE, and the 2050 degree-days into speaker notes. Delete the duplicate “Community” by not repeating the lens when it equals the petal.

### F8 — “Year 10” is drawn as the step after “months”

- **Severity:** 3 (major)
- **Heuristics:** H2, H1
- **Screenshots:** `story-09-1920.png`, `story-09-1366.png`
- **What the room sees:** Four cards in a row with arrows: First hours → Days → Months → **Year 10**. The headline is “If the data center leaves in year 10.” The fourth card is a contract scenario, not the next hour of an outage. “Step-in rights” is undefined. “5,558 m³” is the storage unit. The closing line (cooling never depended on this network) is clear and should stay.
- **Fix:** Arrow only the first three cards. Set Year 10 beside them with its own label, “If they leave in year 10,” not as step four. Replace “Step-in rights” with “The utility can keep the pipes.” Put gallons next to cubic meters, or drop the cubic meters and keep “about 11 hours of peak.”

### F9 — 15× and 15.4× on one slide; the one-pager overclaims “Lansing”

- **Severity:** 2 (minor) for the rounding; treat the one-pager wording as the part to fix before handout
- **Heuristics:** H4, H2
- **Screenshots:** `story-02-1920.png`, `story-02-1366.png`, `print-1920.png`, `print-1366.png`
- **What the room sees:** Story 2 headline says **15×**. The giant figure says **15.4×** “more heat than the network uses.” Bars: 778 GWh produced, 51 GWh used (6.5%), split 37.1 on-site and 13.5 corridor. The one-pager’s second tile says **15.4× “more than Lansing can use.”** That is a different claim from “more than the network we sized.”
- **Fix:** Use 15.4 in the headline (`steps.tsx` rounds the headline with `dec(ratio, 0)` and `RatioBars` uses `dec(ratio, 1)`). On the one-pager, repeat “more than the network uses,” not “more than Lansing can use.”
- **Same class, severity 1:** One-pager phase lines round 37.1 / 13.5 / 3.6 GWh to 37 / 14 / 4, and show phase temperatures 45 °C / 20 °C / 65 °C while Story 4’s capture temperature is 50 °C. Name them (“greenhouse loop,” “home loop”) so 45 and 50 are not read as a contradiction.

### F10 — Natural gas is a peer button on the household slide, with no moratorium on the control

- **Severity:** 2 (minor)
- **Heuristics:** H5, H4
- **Screenshots:** `story-07-1920.png`, `story-07-1366.png` (default is Propane, selected). Contrast: `explore-1920.png` chart label “Natural gas (no new hookups).”
- **What the room sees:** Four fuels — Propane, Heating oil, Natural gas, Electric baseboard — and three sizes. Story 1 has already said rural Lansing has no gas pipe. The gas button does not repeat that. At 1366, “Large · about 2,800 sq ft” wraps onto its own row; Small and Typical stay together.
- **Fix:** Button label “Natural gas (no new hookups).” The component already changes the headline when gas does not save (`HouseholdCalc` in `Misc.tsx`); that state is not in these PNGs, so it was not reviewed. Keep the $735 / $3,675 / $2,940 bars; they are the clearest money picture in the deck. The proof line under the bars (27.0 MWh, $109, $89) is the smallest type on the slide — move “priced at $109” up next to “Community heat.”

### F11 — Map uses kilometers, unnamed dots, and “10-hectare”

- **Severity:** 2 (minor)
- **Heuristics:** H2, H6
- **Screenshots:** `story-03-1920.png`, `story-03-1366.png`, and the same map on `print-1920.png` / `print-1366.png`
- **What the room sees:** Cayuga Lake, data center, a dashed line, “Corridor homes,” a purple “Town center,” a **5 km** scale bar, and several open circles with no names. Phase cards are readable: Phase 1 on-site 37.1 GWh/yr · 16 MW peak; Phase 2 corridor 13.5 GWh/yr · 7 MW peak; Phase 3 town center “(if it pays)” 3.6 GWh/yr · 3 MW peak. The lede says start next to the data center and reach town only if the numbers pass. It does not say miles. Headline says **10-hectare**. At 1366 the phase titles wrap inside the cards; the numbers still show.
- **Fix:** Scale bar in miles. One caption: “Town center is several miles of pipe — Phase 3 only if it beats propane.” Speaker notes already say 5–7 miles (`steps.tsx` plan notes); the picture should say it. Delete dots that have no label, or label the two that matter. Say “about 25 acres” beside 10 hectares, or drop hectares.

### F12 — Story 6 asks the room to read five cards and two charts

- **Severity:** 2 (minor)
- **Heuristics:** H8, H2
- **Screenshots:** `story-06-1920.png`, `story-06-1366.png`
- **What the room sees:** Headline is strong: “Even in the leanest month, the data center makes **7.3×** the heat the network needs.” Under it, five cards (temperature, capacity, timing, seasonality, continuity) and two charts. Left axis is **GWh** by month. Right axis is **MW** across a “Cold winter week,” with a second line in °C. “Cold winter week” is the filled toggle; “Summer week” is not. “0 unmet hours” and “5,558 m³” sit in the cards. Both widths fit without scroll. Backup is in the legend; on the monthly chart the visible marks are the amber supply line and the small delivery bars.
- **Fix:** Keep the headline and the two charts. Move the five cards to notes. Title the right chart “A cold week” in the same size as the toggle, and say the gray notch is backup. “No hour runs short” instead of “0 unmet hours.”

### F13 — Empty explore capture, and a loading state with no spinner

- **Severity:** 2 (minor) for the product empty state. The 1366 layout of Explore was **not** reviewed.
- **Heuristics:** H1, H9
- **Screenshots:** `explore-1366.png` is only the words “Loading data…” on a blank cream page, no nav. `explore-1920.png` is the full tool.
- **What works on the 1920 file:** Sliders show their values (electricity 140 $/MWh, sign-up 100%, discount 4.0%, IT load 150 MW). Liquid-cooled 50 °C is the selected cooling type. Checkbox copy is excellent: “Add the town-center ring (Phase 3; fails the cost test today).” “Reset to the base case” is present. Results region is labeled. Chart includes propane $136, heating oil $156, electric baseboard $245, and natural gas with the hookup caveat.
- **Fix:** Keep the nav and a visible spinner inside the loading state (`web/components/ui.tsx` returns only “Loading data…”). Recapture 1366 after load before judging that breakpoint. Unit order “140 $/MWh” should read “$140 per MWh.”
- **Image-reading caveat:** The reading of `explore-1920.png` included a By-ring column headed COP with **8.0** on corridor homes and town center, next to average COP **4.7**, and a footnote about 50 °C source heat. A later read of `web/components/Explore.tsx` shows columns “GWh/yr” and “Share of heat,” and a footnote that COP is clipped to 2–6. Those are not the same screen. **Recapture Explore before anyone edits a COP column.** If the fresh shot still shows 8.0 beside 4.7, that is a severity 3 H4 bug: delete the 8.0 or label it as a different COP.

### F14 — Last-step Next and first-step Back look pressable

- **Severity:** 2 (minor)
- **Heuristics:** H1, H3
- **Screenshots:** every story PNG. Clearest on `story-01-*.png` (Back) and `story-11-*.png` (Next).
- **What the room sees:** Back, Next, “Step N of 11,” a path button read as “5-minute path,” a one-line shortcut hint, and “Notes (P).” On step 11, Next is still drawn like the other buttons. `Story.tsx` disables Back at the start and Next at the end, but `web/app/globals.css` has no `.btn:disabled` rule, so the disabled control does not change color.
- **Fix:** Gray the disabled button and drop its border contrast. On step 11, change Next to “Handout” linking to the one-pager, so the deck has an end.
- **Path control:** `Story.tsx` defaults to a short path and skips steps marked `deepDive` (the ladder and the household calculator). The PNGs show those steps and a counter of 11, so the captured deck is the long path. The path button does not show the navy pressed style (`.btn[aria-pressed="true"]`) in these shots, so a presenter cannot see which path is live. Label it “Showing all 11” / “Showing the short cut” in the button itself, not only in a tooltip.
- **Shortcut line:** Present on both widths, smaller and grayer than everything else. Fine for the laptop operator. Useless to the room. Leave it off the projected display (presenter notes already exist). Severity 1.

### F15 — QR code is a laptop feature shown at room scale

- **Severity:** 1 (cosmetic for the live pitch; keep it on the paper)
- **Heuristics:** H7, H6
- **Screenshots:** `story-11-1920.png`, `story-11-1366.png`, `print-1920.png`
- **What the room sees:** Three numbered asks (Town of Lansing, the data center, funders and state) are the right close. A QR sits beside “Try the model yourself” and the URL `https://lansing-heat.vercel.app`. On the 1920 one-pager the ask and QR are on the sheet; the credit line is at the bottom edge. `print-1366.png` stops around the cost bars because the viewport is 768px tall and the sheet is a fixed 11 in (`globals.css` `.letter`), not because the ask is absent. The sheet uses `overflow-hidden` (`PrintSheet.tsx`). Whether the credit line survives a real print is **[not verified on paper]**.
- **Fix:** On Story 11, set the URL in the same size as the ask body and leave the QR for the one-pager. Print once to PDF before the handout. If the credits clip, cut the 8.5pt line rather than the ask.

### F16 — Thin story progress

- **Severity:** 1 (cosmetic)
- **Heuristics:** H1
- **Screenshots:** all story PNGs (a short orange rule at the left of the header)
- **What it is:** `Story.tsx` draws a 6px progress bar. “Step N of 11” already does the job. The bar is easy to miss and easy to read as a brand underline.
- **Fix:** No change required for the deadline. If touched, make the filled portion obvious or remove the bar.

## What passes

These are in the PNGs, not wishes.

- **H1.** Nav marks the current section (Story, Explore, Compare sites, One-pager) with a navy pill. Story says “Step N of 11.” Household fuel and size show a filled selected state. Explore shows each slider’s current value. Explore cooling type shows which option is on. Week chart shows “Cold winter week” selected.
- **H2.** Headlines are sentences, not labels. Story 2, 4, 7, 9, and 11 each have one idea a person can repeat. “Bring the users to the heat” matches the plan. Dry coolers “can reject 100% of the heat alone” is the right reassurance. The water card refuses a lake-water claim. The equity card does not invent a disadvantaged-community designation.
- **H3.** Back and Next exist on every story step. Explore has “Reset to the base case.” Household and Compare let the room change the case without leaving the page.
- **H5.** Phase 3 is labeled “if it pays” on the map and “fails the cost test today” on Explore. The one-pager marks Phase 3 “conditional.”
- **H6.** The three asks on Story 11 are numbered and named (town, data center, funders). The URL is text, not only a QR.
- **H7.** A presenter can move with the keyboard, open notes, and toggle a shorter path (controls exist in the footer and in `Story.tsx`). Explore is the right place for a hostile assumption. Dark mode is offered; it was not screenshotted.
- **H8.** Story 1, 2, 4, 9, and 11 have enough empty space for a projector. Type on headlines is the largest thing in the frame.
- **H10.** “Notes (P)” is on every story step. The COP gloss on Story 5 (“one unit of electricity moves…”) is the right kind of help; it is undermined by F1, not missing.

## Top 10 fixes

Ranked for a projector hour with this audience. Do 1–4 before anything visual.

| Rank | Sev | Fix | Where |
|------|-----|-----|--------|
| 1 | 3 | Make COP one number on the ladder, or name the three COPs in plain words. Ship the gloss once. | `story-05-1920.png`, `story-05-1366.png` |
| 2 | 3 | Stop truncating offtaker names. Two lines, or a shorter proper noun. | same slides; `Misc.tsx` `TempLadder` |
| 3 | 3 | One glossary line everywhere a $/MWh appears: homes pay $109, co-op cost about $83, on-site farm $38. Same rounding for $735 and $734. | Story 7, Story 8, Explore, one-pager |
| 4 | 3 | Rewrite the Compare headline so it only claims rows Lansing’s check marks win. Say totals vs per MW, or drop the CO₂ row. | `compare-1920.png`, `compare-1366.png` |
| 5 | 3 | One reconciliation line on the heat-flow diagram so 120, 89, 31, 5.8, and 115 can sit in one sentence. | `story-04-*.png` |
| 6 | 3 | Chip “Different city — Lansing, Michigan” on slide 1. Fix the “2015 year the…” fragment. Lead with $/year or $/gallon, not $/MWh. | `story-01-*.png` |
| 7 | 3 | Impact slide: four big numbers, four short lens lines, equity sentence alone. Remove the doubled “Community.” ERF/ERE go to notes. | `story-10-*.png` |
| 8 | 3 | Unhook Year 10 from the hours → days → months arrows. Replace “step-in rights.” | `story-09-*.png` |
| 9 | 2 | Headline 15.4×, not 15×. One-pager: “more than the network uses,” not “more than Lansing can use.” | `story-02-*.png`, `print-*.png` |
| 10 | 2 | Map scale in miles, town-center distance in the caption, delete unlabeled dots. Gas button: “no new hookups.” | `story-03-*.png`, `story-07-*.png` |

If only an hour remains: do ranks 1, 3, and 4. Those are the questions a 60-year-old CFO asks out loud.

## Counts

| Severity | Count | IDs |
|----------|------:|-----|
| 4 Catastrophic | 0 | — |
| 3 Major | 8 | F1 F2 F3 F4 F5 F6 F7 F8 |
| 2 Minor | 6 | F9 F10 F11 F12 F13 F14 |
| 1 Cosmetic | 2 | F15 F16 |
| 0 Logged as pass | see What passes | — |

F9 is filed as 2; the one-pager wording inside it should still ship with the top 10.

## Heuristic coverage

| Heuristic | Result on these PNGs |
|-----------|----------------------|
| H1 Status | Step counter and selected pills work. Disabled Back/Next do not look disabled. Progress bar is a hairline. Explore’s empty state is a sentence in the corner. |
| H2 Real world | Headlines match the room. Failures are Michigan vs New York, MWh/hectares/km/m³, “step-in rights,” “HP,” ERF/ERE, and Year 10 as a timeline step. |
| H3 Control | Back, Next, reset, and toggles exist. End of story has no labeled exit. |
| H4 Consistency | Worst heuristic. COP, $/MWh, 15 vs 15.4, $735 vs $734, Compare checks vs headline. |
| H5 Prevention | Phase 3 and the lake-water refusal are good. Michigan and natural gas are under-labeled. |
| H6 Recognition | Truncated ladder names, unlabeled map dots, price ideas split across slides. |
| H7 Flexibility | Explore sliders, household toggles, notes, keyboard. QR is the wrong tool on a projector. |
| H8 Minimal | Slides 1, 2, 4, 9, 11 pass. Slides 6, 8, and 10 are dashboards. |
| H9 Errors | No error screenshot except “Loading data…”. No retry, no cause. Fuel and slider mistakes are not shown. |
| H10 Help | Notes button exists (closed in every shot). COP gloss exists and is then contradicted. ERF is unexplained. |

## Lane status

- **Done:** All 28 PNGs opened. Findings F1–F16 written with severity, screenshot name, and a concrete fix. Top 10 ranked. Passes recorded. 1920 vs 1366 compared. Cross-check against `Story.tsx`, `steps.tsx`, `Misc.tsx` `TempLadder`, `Sankey.tsx`, `Explore.tsx`, `Compare.tsx`, `PrintSheet.tsx`, `globals.css`, `offtakers.json`, and `site2.json` `hdr_scorecard` where a finding needed a file, not a guess.
- **Missing:** No live browser pass. Not opened: dark mode, speaker notes, the natural-gas household result, the summer-week toggle, the short path after pressing S, a real print-to-PDF, and Explore at 1366 after data loads. No contrast ratios measured (so no WCAG pass/fail). `explore-1920.png`’s possible COP 8.0 column was not re-shot after `Explore.tsx` was read.
- **Open questions:** Does a fresh Explore capture still show COP 8.0, or has that column already become “Share of heat”? Does the footer button literally say “5-minute path,” or “Back to 5-minute path” / “Show deep dive”? Does the letter sheet clip the credit line on paper, or only in the 1080px viewport? None of those three were settled from the files alone.

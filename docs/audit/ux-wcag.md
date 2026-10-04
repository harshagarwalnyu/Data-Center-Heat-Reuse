# WCAG 2.2 AA review — Thermal Commons web

Review date: 2026-10-04. Product: Thermal Commons co-op (Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev). Working site in the UI: Lake Hawkeye / Lansing, NY. Comparison site: 111 8th Ave, NYC.

This is a static review of `web/app/globals.css`, the Tailwind v4 setup, the components that paint those screens, and all 28 PNGs in `web/screenshots/`. It is not a browser pass. No keyboard walkthrough, screen reader, axe run, 320px reflow check, or 200% zoom check was executed. Contrast ratios are computed from the authored hex colors, not eyedropped from the PNGs.

Criterion numbers follow WCAG 2.2 (https://www.w3.org/TR/WCAG22/). That URL was not re-fetched in this lane.

## How to read this file

Each finding is one row: **Issue | Criterion | Where | Fix**. AA only. AAA items are named when the same control happens to meet them; they are not scored as failures.

## Tailwind config

There is no `tailwind.config.js` / `tailwind.config.ts`. Tailwind is v4 (`web/package.json`: `tailwindcss` ^4.3.3). `web/postcss.config.mjs` loads `@tailwindcss/postcss` only. Color and font tokens are declared in `web/app/globals.css` inside `@theme inline` (lines 42–58), which maps the `:root` variables to utilities such as `text-ink`, `bg-surface`, and `text-ember-text`.

`@theme` registers `ember-text` and `teal-text`. It does not register `--color-violet-text` or `--color-good`. Screens that look purple or green use inline `var(--violet-text)` and `var(--good)` (`web/components/ui.tsx` `ringText`, `web/components/story/steps.tsx` `Tile`, `web/components/Explore.tsx` KPI delta). A Tailwind class `text-violet-text` or `text-good` would not be generated. That is a wiring gap, not a current contrast failure.

## Color tokens used for contrast

Source: `web/app/globals.css` lines 3–40, read 2026-10-04. Method: WCAG 2 relative luminance (sRGB channel linearized with the 0.03928 threshold), ratio `(Lighter + 0.05) / (Darker + 0.05)`, rounded to two decimals.

**Pass rules used:** normal text ≥ 4.5:1 (1.4.3). Large text (24px regular, or ≥ 18.67px bold) and user-interface graphics ≥ 3:1 (1.4.3 large / 1.4.11).

### Light theme (`html[data-theme="light"]`, the theme in every screenshot)

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `--ink #13202b` on `--bg #fbf7f0` | 15.49:1 | Passes normal text |
| `--ink` on `--surface #ffffff` | 16.55:1 | Passes normal text |
| `--ink2 #3a4856` on `--bg` | 8.77:1 | Passes normal text |
| `--ink2` on `--surface` | 9.37:1 | Passes normal text |
| `--ink2` on `--surface2 #f4ede1` | 8.05:1 | Passes normal text |
| `--ember-text #9a3412` on `--bg` / `--surface` | 6.84:1 / 7.31:1 | Passes normal text |
| `--ember #c2410c` on `--bg` / `--surface` | 4.85:1 / 5.18:1 | Passes normal text and graphics |
| `--teal-text #0a5a6b` on `--bg` / `--surface` | 7.32:1 / 7.81:1 | Passes normal text |
| `--violet-text #5b34a8` on `--bg` / `--surface` | 7.86:1 / 8.40:1 | Passes normal text |
| `--violet #7c4dcc` on `--bg` / `--surface` | 5.19:1 / 5.54:1 | Passes graphics and normal text |
| `--good #17703f` on `--bg` / `--surface` | 5.74:1 / 6.13:1 | Passes normal text |
| `--teal #0b8ca6` on `--bg` / `--surface` | 3.70:1 / 3.95:1 | Passes UI graphics and large text. Fails normal-size text |
| Pressed control: `--bg` on `--navy #0f2a3f` | 13.82:1 | Passes |
| Focus outline `--teal` on `--bg` | 3.70:1 | Passes 1.4.11 (3:1) |
| `--amber #e39b1b` on `--bg` | 2.19:1 | Fails graphics and text |
| `--amber` on `--surface` | 2.34:1 | Fails graphics and text |
| `--amber` on `--surface2` | 2.01:1 | Fails graphics and text |
| `--line #d8ccba` on `--bg` | 1.48:1 | Fails UI boundary |
| `--line` on `--surface` | 1.58:1 | Fails UI boundary |
| `--surface` on `--bg` | 1.07:1 | Fill does not separate a white control from the page |
| Print sheet `--line #cfc3b0` on white (`.sheet-light`) | 1.74:1 | Fails UI boundary |

### Dark theme (CSS only; no dark PNG)

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `--ink #f4efe6` on `--bg #0b1620` | 15.95:1 | Passes normal text |
| `--ink2 #bccad4` on `--bg` / `--surface #12212e` | 10.90:1 / 9.77:1 | Passes normal text |
| `--ember-text #ffa070`, `--teal-text #62cde3`, `--violet-text #c2adf5`, `--good #5fd397` on `--bg` | 9.14:1, 9.88:1, 9.21:1, 9.78:1 | Pass normal text |
| `--amber #f0b14a` on `--bg` / `--surface` | 9.65:1 / 8.65:1 | Passes (light-theme amber does not) |
| Focus `--teal #1e9db8` on `--bg` | 5.71:1 | Passes 1.4.11 |
| Pressed control: `--bg` on `--navy #dbe7ee` | 14.50:1 | Passes |
| `--line #2c4050` on `--bg` / `--surface` | 1.70:1 / 1.53:1 | Fails UI boundary |
| `--surface` on `--bg` | 1.12:1 | Fill does not separate the card from the page |

`--teal` is not used as body copy. Text that must be teal uses `--teal-text`. The same split exists for ember and violet. That pattern is why the words pass 1.4.3 and the amber graphics do not.

## Findings

| Issue | Criterion | Where | Fix |
| --- | --- | --- | --- |
| Light-theme amber is 2.01–2.34:1 against the page, cards, and `#f4ede1`. It is the supply bar on story step 2, the “Heat the data center produces” line on step 6, and the heat-pump electricity slice on the Sankey. Those marks are part of the graphic a viewer has to see. Dark-theme amber passes (8.65:1 and above). | 1.4.11 Non-text Contrast (AA). Would also fail 1.4.3 if amber were used as text. | `web/app/globals.css` `--amber: #e39b1b`. Drawn in `web/components/viz/Misc.tsx` (supply bar), `web/components/viz/Charts.tsx` (monthly area stroke), `web/components/viz/Sankey.tsx` (electricity rect). Visible on `story-02-1366.png`, `story-02-1920.png`, `story-06-1366.png`, `story-06-1920.png`, `story-04-1366.png`, `story-04-1920.png`. | Darken light-theme `--amber` until it is at least 3:1 on both `#fbf7f0` and `#ffffff`. Keep it distinct from `--ember #c2410c` (4.85:1, already passing) so “supply” and “delivered” stay two hues. Leave dark-theme `--amber` as it is. |
| Unselected buttons and cards are white (`#ffffff`) on the page (`#fbf7f0`) at 1.07:1, so the 1px `--line` border is the only edge. That border is 1.48:1 on the page and 1.58:1 on white. Dark theme repeats the pattern (1.53:1 and 1.70:1). The print sheet border is 1.74:1. Shadows are 6–7% black and do not make up the gap. | 1.4.11 Non-text Contrast (AA). Inactive (disabled) controls are exempt; the Back button on step 1 is disabled and is not part of this row. | `.btn`, `.card`, `border-line` in `web/app/globals.css`. Every story, explore, compare, and print PNG shows these controls. | Set `--line` to at least 3:1 against both `--bg` and `--surface`, in both themes. A faster button-only fix is a fill that itself clears 3:1 against the page, such as `--navy` (already used for the selected state) or a darker neutral, so the border no longer has to carry the edge. |
| The three rings change hue between screens. Steps 2 and 3 use on-site = ember, corridor = teal, town = violet (`ringColor` in `web/components/ui.tsx`). Step 8’s cost chart uses on-site = teal, corridor = ember, town = violet (`RING_COLOR` in `web/components/viz/Charts.tsx`). On step 8 the corridor bar is the same ember family as the dashed “Propane today” line. Each bar also has a text name, so color is not the only label on that one chart. The hue still means the opposite ring from the map the viewer just saw. | 1.4.1 Use of Color (AA). The swapped code is `RING_COLOR` vs `ringColor`. | `story-02-*.png` and `story-03-*.png` (on-site orange, corridor teal) vs `story-08-1366.png` and `story-08-1920.png` (on-site teal, corridor orange). Chart mounted from `web/components/story/steps.tsx` (`RingLcoh`). | Delete the local `RING_COLOR` map and color the cells with `ringColor()`. Keep the propane reference as a dashed line plus its text label. |
| Story mode takes Arrow keys, Space, Page Up/Down, Home, and End at the window, and calls `preventDefault`. The handler ignores real text fields and `role="slider"`. It does not ignore buttons, radios, or the scrolling step pane. A step that is taller than the pane cannot be scrolled with the keyboard. Space does not scroll either. | 2.1.1 Keyboard (AA). Becomes a 1.4.4 failure in practice at 200% zoom, which was not run. | `web/components/story/Story.tsx` keydown effect (the `isTyping` guard and the `switch` on arrows, space, page, home, end). | Handle those keys only when the event target is not inside `main` and the step pane does not overflow. If the pane overflows, let Arrow and Space scroll it. |
| Opening speaker notes drops a full-width panel over the footer (`fixed bottom-0`, `z-30`) without moving focus into the panel. Back, Next, and Notes stay focused underneath it. | 2.4.11 Focus Not Obscured, Minimum (AA, new in 2.2). | `web/components/story/Story.tsx` notes `<aside>`. Not open in any PNG. | Pin the notes above the footer, or move focus to the notes close/reset control and keep footer controls outside the overlay. Add Escape to close. |
| There is no skip link. Keyboard users tab through the logo, four nav links, and the theme button on every page before the step or the sliders. | 2.4.1 Bypass Blocks (AA). | `web/app/layout.tsx` has `lang="en"` and no skip control. `web/components/ui.tsx` `NavBar`. | Add a “Skip to content” link as the first focusable element, pointing at `<main>`. |
| Sankey flow dashes animate forever (`flow` 1.6s linear infinite). The only off switch is the operating-system reduced-motion setting. WCAG 2.2.2 requires a pause, stop, or hide control for any user when motion starts by itself, lasts more than 5 seconds, and sits beside other content. | 2.2.2 Pause, Stop, Hide (AA). | `web/app/globals.css` `.flow-anim`. Applied in `web/components/viz/Sankey.tsx`. Static PNGs cannot show the motion. `.pulse` has the same reduced-motion guard and is not used by a component. | Keep the `prefers-reduced-motion` block. Add a visible “Pause motion” control that sets a class removing `.flow-anim`, or drop the infinite dash and leave the ribbons static. |
| The temperature ladder is one `role="img"` with a one-sentence `aria-label`. That role hides the text inside the SVG from assistive technology. Names longer than 30 characters are also sliced in the SVG itself, at both screenshot widths: “On-site greenhouse campus (10…”, “McKissick Farms / Cayuga Land…”, “Lansing Central School Distri…”, “Lansing Community Library + C…”. The headline next to the chart states the COP, not those names or temperatures. | 1.1.1 Non-text Content (AA). The slice is in source, so it is not a viewport accident. | `web/components/viz/Misc.tsx` `TempLadder` (`role="img"`, `o.name.slice(0, 29)`). `story-05-1366.png`, `story-05-1920.png`. | Render the ladder as HTML rows (name, temperature, direct or COP), and use the SVG as a visual with `aria-hidden` if the HTML table is complete. Stop slicing names. |
| The Sankey is also `role="img"`. Its label covers IT power, captured heat, delivered heat, and dry coolers. It does not include the on-site vs corridor split or the electricity slice, which exist only as SVG text. | 1.1.1 Non-text Content (AA). | `web/components/viz/Sankey.tsx`. `story-04-*.png`. On `story-04-1366.png` the “incl. 0.3 MW grid” label sits on the ribbon. | Put the same MW figures in an HTML list under the figure, or expand the accessible name to include each terminal. Give the electricity slice a text label that is not painted on the ribbon. |
| Month and week charts put exact values in a Recharts tooltip. The tooltip is the library default (hover). There is no focus trigger and no Escape-to-dismiss in `Charts.tsx`. Axis ticks show the scale; they are not the point values. Bar charts that print `$83` beside the bar (`LcohBars`, `RingLcoh`) are in better shape because the number is text. | 1.4.13 Content on Hover or Focus (AA). Exact values are also missing from the keyboard path (2.1.1). | `web/components/viz/Charts.tsx` `<Tooltip>`. `story-06-*.png`. | Print the value as a label, or provide a data table. If a tooltip remains, it has to be dismissable, hoverable, and available on keyboard focus. |
| Cooling, fuel, home size, and site pickers are `role="radio"` buttons inside `role="radiogroup"`. They are real `<button>`s, so Tab and Enter operate them (2.1.1 is met). Arrow keys do not move the selection. On Story, Arrow keys change the slide instead, including while a household radio is focused. | 4.1.2 Name, Role, Value (AA), because the radio role is only half implemented. Related: 2.1.1 on Story, where arrows are stolen. | `web/components/Explore.tsx`, `web/components/Compare.tsx`, `web/components/viz/Misc.tsx` `HouseholdCalc`. Visible selected state on `story-07-*.png`, `explore-1920.png`, `compare-*.png`. | Either use native `<input type="radio">`, or implement the radio keyboard pattern (one tab stop, arrows change selection, `stopPropagation` so Story does not turn the page). |
| When the MapLibre map finishes loading it covers the schematic (`opacity: 1`, `pointer-events: auto`) and the covering node is `role="img"`. Pan is a drag. Zoom buttons come from `NavigationControl`. There are no on-screen pan buttons. The story-03 PNGs still show the SVG (5 km scale bar), so the live map was not up during the capture. | 2.5.7 Dragging Movements (AA) for pan, once the map is ready. 4.1.2 for `role="img"` on an interactive surface. | `web/components/viz/RingMap.tsx` `RingMap`. Not the state in `story-03-*.png`. | Keep the schematic as the default. If the street map is on, use `role="region"` with a name, and add pan buttons. Keyboard pan on the canvas was not verified. |
| The one-pager is a fixed 8.5in × 11in sheet with `overflow-hidden`. The page wrapper scrolls horizontally (`overflow-x-auto`) rather than reflowing the sheet. Credits are set at 8.5pt. `print-1920.png` shows the ask and QR; the credits line is at the bottom edge of the sheet. `print-1366.png` is a viewport crop that ends before the ask; the page itself can still scroll because the crop is the screenshot, not `overflow: hidden` on the body. | 1.4.10 Reflow (AA) for a phone-width window, predicted from the fixed inch size, not observed below 1366. 1.4.4 if the clipped credits cannot be reached inside the sheet. | `web/app/globals.css` `.letter`. `web/components/PrintSheet.tsx` (`overflow-hidden`, `fontSize: "8.5pt"` on credits). `print-1366.png`, `print-1920.png`. | Let the on-screen sheet grow with its content (`overflow: visible`, height auto). Keep the 8.5×11 box for `@media print` only. Raise credits to at least the 11pt body size of the sheet. |
| The header is a single non-wrapping row: logo (`whitespace-nowrap`), four links, theme button. Both 1366 and 1920 PNGs fit. A 320px window (the 1.4.10 test width) was not captured and will overflow. The footer hint “Arrows, space or PageDown…” is `hidden xl:inline`, so it is visible at 1366 and 1920 (xl starts at 1280px) and gone below that. | 1.4.10 Reflow (AA), code-backed, not seen in the PNGs. | `web/components/ui.tsx` `NavBar`. `web/components/story/Story.tsx` footer. | Allow the nav to wrap. Put the shortcut hint in the accessibility tree at every width, or rely on the buttons alone. |
| `/how` is a real route (`web/app/how/page.tsx`) and is not in `web/screenshots/`. It has two range inputs and links with `target="_blank"`. New-tab links are an advisory warning (the visible word is “link”), not an AA failure by itself. | Not scored. Listed so the gap is explicit. | `web/components/HowItWorks.tsx`. | Screenshot `/how` before calling the audit complete. Add “opens in a new tab” on those links. |

## Contrast

Authored text colors pass 1.4.3 in both themes. That includes body `--ink`, secondary `--ink2` (the 15px chart ticks and the 0.55em `.unit` suffix), `--ember-text` kickers, `--teal-text`, `--violet-text`, `--good` deltas, and `--ember` arrows. Pressed nav and pressed buttons (cream on navy, or near-black on light navy) pass.

The AA contrast failures are non-text:

- Light `--amber` at about 2.2:1. This is the one to fix before a projector demo. It is the hero bar on step 2 and the supply line on step 6.
- `--line` at about 1.5:1 in both themes, which is the edge of every unselected button and card.
- Light `--teal #0b8ca6` at 3.70:1 is legal for the focus ring, slider accent, and chart strokes. It is not legal for a sentence. The code already uses `--teal-text` for sentences. Keep it that way.

Map attribution is forced to 12px in `globals.css` (`.maplibregl-ctrl-attrib`) and the color is left to MapLibre. That ratio was not measured. The story-03 PNGs show the SVG fallback, not the OpenStreetMap control. Give the attribution an opaque background and a 4.5:1 color if the street map ships.

Ratios were not sampled from PNG pixels. A projector or a browser color-profile shift could move a 3.70:1 teal ring by a few tenths. It will not move a 2.19:1 amber bar over 3:1.

## Text size

`html` is 16px. `body` is `1.125rem` (18px) with line-height 1.5. Headlines use `clamp(2.25rem, 3.7vw + 0.4rem, 4rem)` (36–64px). Buttons are `1.0625rem` with a 44px minimum box. The lede minimum is 18px. Viewport does not set `maximum-scale`, so pinch zoom is not blocked in CSS.

Sizes below the 18px body floor, all of which still use a passing text color (`--ink` or `--ink2`) unless noted:

| Size | Where | AA note |
| --- | --- | --- |
| 15px | `.recharts-text`, chart axis ticks (`Charts.tsx` `axisTick`) | Contrast passes. Not an AA size failure. |
| 16px (`1rem`) | `.kicker` in `--ember-text`, `.chip` | Contrast passes (kicker 6.84:1). |
| 15px (`0.9375rem`) | Story credits, lens chips (`steps.tsx`) | Contrast passes. |
| 0.55em of the parent number | `.unit` in `--ink2` | Parent numbers are 32px and up, so the unit is about 18px or larger. Contrast passes. |
| 12px | MapLibre attribution | Contrast [unverified]. |
| 8.5pt credits, 10pt labels | `PrintSheet.tsx` on the on-screen sheet | `--ink2` on white is 9.37:1, so contrast passes. 8.5pt is about 11px on screen and is the line most likely to be clipped by the 11in box. |

The temperature-ladder ellipsis is a hard 30-character cut, present at 1366 and 1920. Widening the window does not restore the name.

## Focus visibility

`globals.css` line 80: `:focus-visible { outline: 3px solid var(--teal); outline-offset: 3px; border-radius: 6px; }`. Against the light page that outline is 3.70:1. Against the dark page it is 5.71:1. Both clear the 3:1 UI threshold (1.4.11). The indicator is not `outline: none`.

2.4.7 Focus Visible (AA) is met in CSS. No PNG shows a focused control, and this lane did not press Tab, so the live ring is [unverified]. 2.4.13 Focus Appearance is AAA and was not scored. The 3px ring with a 3px offset is in the right direction for that AAA criterion.

Selected state does not depend on the focus ring. Selected buttons and the current nav link use a navy fill with `--bg` text (13.82:1 light, 14.50:1 dark) plus `aria-pressed`, `aria-checked`, or `aria-current`.

## Keyboard navigation

What is in good shape in the source:

- `lang="en"` on `<html>` (`web/app/layout.tsx`).
- Slider `<label htmlFor>` wired to `<input type="range">` (`Explore.tsx`, `HowItWorks.tsx`). Range boxes are 44px tall.
- Checkbox is `w-6 h-6` (24px), which meets 2.5.8 Target Size Minimum (24×24 CSS pixels). Buttons and nav links use a 44px minimum and exceed it.
- Explore results sit in `aria-live="polite"`. Story progress is a `progressbar` with min, max, now, and a visible “Step N of 11”.
- Decorative arrows and legend swatches are `aria-hidden`. The compare check mark has visible text “✓” plus `aria-label="better"` and a caption (“A check mark shows the better value on that row.”). Seen on `compare-1366.png` and `compare-1920.png`.

What fails or is unfinished is in the findings table: no skip link, story keys swallow scroll keys, notes cover the footer, radios do not implement arrow selection, chart values live in hover tooltips, and the interactive map (when it loads) is exposed as an image.

`explore-1366.png` never left “Loading data…”. The loading node is `role="status"` (`web/components/ui.tsx` `DataGate`), which is the right live-region role. That PNG cannot be used as evidence of the Explore layout at 1366. `explore-1920.png` shows the sliders, radios, chart, and ring table.

## Motion

| Motion | Reduced motion | Pause control for everyone | Verdict |
| --- | --- | --- | --- |
| `.flow-anim` infinite dash on the Sankey | `animation: none` under `prefers-reduced-motion: reduce` | None | Fails 2.2.2 |
| `.pulse` | Same media query | None. Class is unused | Latent |
| Story step transition and progress-bar width (`framer-motion` `useReducedMotion` in `Story.tsx`) | `initial={false}`, duration 0, progress transition `none` | Not required (under 5 seconds, and it stops) | Meets the reduced-motion practice |
| Supply bar grow (`Misc.tsx` `RatioBars`) | `useReducedMotion` skips the intro | One-shot 0.9s, not an infinite loop | OK for 2.2.2 |
| Recharts series | `isAnimationActive={false}` | n/a | OK |
| `scroll-behavior` | Forced to `auto` when reduced motion is set | n/a | OK |

Nothing flashes three times a second. 2.3.1 Three Flashes is met. 2.3.3 Animation from Interactions is AAA and was not scored; the reduced-motion hooks already cover the step change and the bar intro.

## Color-only meaning

Passed, with the ring-hue swap as the exception:

- Phase cards on step 3 put the ring name in text next to the dot (`story-03-*.png`). Dot colors match `ringColor` (on-site ember, corridor teal, town violet) and those three hues clear 3:1 as graphics.
- Monthly and week charts have a text legend (`story-06-*.png`). The supply series is the amber that fails 1.4.11; the failure is contrast, and the legend still has words.
- Household bars are labeled “Propane today” and “Community heat” with dollar amounts (`story-07-*.png`).
- Explore KPI deltas use green or ember-red and a signed sentence (“+N vs base” or “same as base case”). Both colors pass 4.5:1. Color is redundant with the sign and the words.
- Lens chips on step 10 print the lens word (Community, Ecology, Health). The border color repeats that word. It is not the only means. `story-10-1366.png` and `story-10-1920.png` show the first card as “Community” on the chip and “Community” again as the petal title. That is duplicate text from `s.lens` and `s.petal`, not a contrast bug.
- The Lansing-context card on that step says there is no designated disadvantaged community and that equity here means older residents and propane and oil households. The UI does not paint a DAC claim.

## Screenshot notes

All 28 files, light theme (the Dark control is visible). `explore-1366.png` is the only frame that is not a finished screen.

| File | What it shows for this review |
| --- | --- |
| `story-01-1366.png`, `story-01-1920.png` | Step 1. Large headline, ember kicker, three cards. Nav and footer fit at both widths, including the shortcut line. No focus ring (nothing focused). |
| `story-02-1366.png`, `story-02-1920.png` | Amber supply bar (1.4.11 failure) and a small on-site/corridor split with text legend. On-site is orange, corridor is teal. |
| `story-03-1366.png`, `story-03-1920.png` | Schematic map plus three phase cards. Same hue order as step 2. 5 km scale means this is `RingMapSvg`, not the street map. Streets button not shown. |
| `story-04-1366.png`, `story-04-1920.png` | Sankey. At 1366, “incl. 0.3 MW grid” collides with the ribbon. Dry-cooler copy is text, not color-only. |
| `story-05-1366.png`, `story-05-1920.png` | Temperature ladder. Name ellipsis at both widths. |
| `story-06-1366.png`, `story-06-1920.png` | Five match cards, monthly chart with amber supply line, week toggle (filled vs outline). Legends include words. |
| `story-07-1366.png`, `story-07-1920.png` | Household radios. At 1366, “Large” wraps onto its own row and still reads as a full button. Bars are labeled in text. |
| `story-08-1366.png`, `story-08-1920.png` | Ring hue swap. On-site bar is teal, corridor bar is orange, town bar is violet. Propane line is orange and dashed. Y-axis label “Air-source heat pump per home” wraps at 1366. |
| `story-09-1366.png`, `story-09-1920.png` | Four exit cards and text arrows. Fits at both widths. |
| `story-10-1366.png`, `story-10-1920.png` | Impact tiles and HDR scorecard. Lens name is written out. Context card refuses a disadvantaged-community claim. |
| `story-11-1366.png`, `story-11-1920.png` | Three asks and QR, with the URL in text. Credits line is visible under the QR at 1920. The 1366 frame’s visible area ends at the QR card; treat the credits line as easy to lose under the footer on a short pane. |
| `compare-1366.png`, `compare-1920.png` | Site radios and the check-mark table. Check plus caption. Fits at 1366. |
| `explore-1920.png` | Sliders, cooling radios, labeled cost chart, ring names in `ringText` colors (those colors pass 4.5:1). |
| `explore-1366.png` | Only “Loading data…”. Do not treat this as the 1366 explore layout. |
| `print-1920.png` | Full sheet through the ask and QR. Credits sit on the bottom edge of the fixed sheet. |
| `print-1366.png` | Viewport ends during the cost bars, before the ask. The sheet is still 8.5 inches wide; this crop does not prove the ask is unreachable if the page scrolls. |

## What already meets AA

Recorded so a later pass does not undo it:

- Body text 18px, buttons and nav targets 44px, checkbox 24px, zoom not locked.
- Text tokens listed in the contrast table, including the “better” teal numbers and the green/ember deltas.
- Global `:focus-visible` ring at 3.70:1 (light) and 5.71:1 (dark).
- `prefers-reduced-motion` for CSS animation, story transitions, and the ratio-bar intro. Chart series animation is off.
- Legends and check marks that repeat color with words.
- `lang="en"`, labeled sliders, `aria-live` on explore results, `aria-current` on the active nav link.

## HDR lenses (accessibility only)

Judges are HDR and Grundfos. HDR’s regenerative frame in this product is Community, Ecology, and Health (human health, community, air, carbon, water, biodiversity, nutrients), as printed on story step 10.

This review does not add an equity claim. The site pack and the on-screen Lansing-context card both say there is no designated disadvantaged community nearby. The audience the interface has to serve is a town meeting plus older residents and households on propane and oil, which is the affordability story already on steps 1 and 7.

- **Community / Health.** The 18px body and 44px controls are the right baseline for that room. The failures that hurt them are the amber supply graphic (step 2 and step 6), the faint button edges, and the ring colors that swap on the cost chart (step 8), because those are the screens where someone decides whether the heat is real and who it is for.
- **Health.** Infinite Sankey motion and hover-only chart values are the health-of-reading issues: a vestibular preference is honored only if the operating system is already set, and a keyboard user cannot read a monthly point value.
- **Ecology, air, carbon, water, biodiversity, nutrients.** Those domains are copy on step 10, not separate accessibility mechanics. The scorecard text passes contrast. No change to those claims comes from this lane.

## Lane status

- **Done:** `docs/audit/ux-wcag.md` written. All 28 PNGs in `web/screenshots/` opened. `web/app/globals.css` and `web/postcss.config.mjs` read. Confirmed there is no Tailwind config file; tokens live in `@theme inline`. Contrast ratios computed from those hex values for light and dark. Findings cover contrast, text size, focus, keyboard, motion, and color-only meaning, each with criterion, location, and a fix. Components read only to explain what the screenshots show (`Story.tsx`, `ui.tsx`, `Explore.tsx`, `Compare.tsx`, `Charts.tsx`, `Sankey.tsx`, `Misc.tsx`, `RingMap.tsx`, `PrintSheet.tsx`, `steps.tsx`, `layout.tsx`).
- **Missing:** Live keyboard pass, screen reader, axe or Lighthouse, 200% zoom, 320px reflow, dark-theme screenshots, a finished Explore capture at 1366, pixel sampling of the PNGs, and any screenshot of `/how`. MapLibre canvas focus and pan-button behavior were not exercised because the captured story map is the SVG fallback.
- **Open questions:** Will the stage demo stay on the light theme? Light amber fails; dark amber passes. Are the print credits actually clipped by `overflow: hidden`, or only sitting on the edge? `print-1920.png` shows them at the edge and this lane did not measure the sheet overflow in a browser. Should `/how` stay in the build? It is unreachable from the nav and was not in the screenshot set.

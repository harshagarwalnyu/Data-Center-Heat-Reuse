# Projector and senior-reader audit

Audience: live stage demo (projector) and senior corporate reviewers. Bar from the product brief and the official rubric Execution row: big type (>=18px), one takeaway per screen, keyboard navigation, and no information that disappears when a pointer is not hovering.

Scope: read-only pass of `web/` (app shell, story, explore, charts, print). Findings ranked by severity. Each finding has a file:line and a concrete fix. Colour contrast is computed from the Tailwind / CSS tokens in this repo, not from a screenshot.

Checked 2026-10-04. WCAG 2.2 reference used for the math: [Understanding Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) (verified 2026-10-03). Normal text AA is 4.5:1; large text (18pt / 24px regular, or 14pt / ~18.67px bold) is 3:1. UI components and graphical objects (1.4.11) are 3:1. This audit uses 18px as the product floor even when WCAG would allow smaller text.

## Method

1. Grepped all `web/app/**` and `web/components/**` source (not `web/out/`) for: Tailwind size classes and inline `fontSize`, `title=`, Recharts `Tooltip`, `hover:`, `onClick`, `role=`, `tabIndex`, `:focus`, `transition`, `animation`, framer-motion usage, `useReducedMotion`.
2. Computed WCAG relative-luminance contrast for every colour token pair in `web/app/globals.css` (light and dark theme) with a throwaway Python script (sRGB formula from the WCAG link above). Numbers below are that script's output, rounded to 2 dp.
3. Read `Story.tsx` keyboard handler, `RingMap.tsx` map setup and the chart components line by line.
4. Not done: no live browser run, no screen reader, no real projector. Anything that depends on rendering is marked [unverified] or ASSUMPTION.

## Tokens

Root font size is 16px (`globals.css:61`); body is 18px (`globals.css:71`). So `text-[1rem]` = 16px, `text-[1.0625rem]` = 17px, `text-[0.9375rem]` = 15px.

Text contrast (light theme / dark theme). AA needs 4.5:1 for text under 24px.

| Foreground on background | Light | Dark | Verdict |
|---|---|---|---|
| ink on bg / surface / surface2 | 15.49 / 16.55 / 14.22 | 15.95 / 14.29 / 12.68 | pass |
| ink on warn-bg (placeholder chip) | 14.82 | 11.85 | pass |
| ink2 on bg / surface / surface2 | 8.77 / 9.37 / 8.05 | 10.90 / 9.77 / 8.67 | pass |
| ember-text on bg / surface / surface2 | 6.84 / 7.31 / 6.28 | 9.14 / 8.20 / 7.27 | pass |
| teal-text on bg / surface / surface2 | 7.32 / 7.81 / 6.71 | 9.88 / 8.86 / 7.86 | pass |
| violet-text on bg / surface / surface2 | 7.86 / 8.40 / 7.21 | 9.21 / 8.26 / 7.33 | pass |
| good on bg / surface / surface2 | 5.74 / 6.13 / 5.27 | 9.78 / 8.77 / 7.78 | pass |
| bg on navy (pressed button, active nav) | 13.82 | 14.50 | pass |
| bg at 80% opacity on navy (`Misc.tsx:135` detail text in a pressed button) | 9.33 | 8.42 | pass |
| amber on bg / surface (if ever used as text) | 2.19 / 2.34 | 9.65 / 8.65 | FAIL light (not currently used as text) |
| teal (raw) on bg / surface | 3.70 / 3.95 | 5.71 / 5.12 | text fail light; fine for 3:1 graphics |

Non-text contrast (1.4.11, needs 3:1).

| Graphic vs background | Light | Dark | Verdict |
|---|---|---|---|
| teal focus ring vs bg / surface / surface2 | 3.70 / 3.95 / 3.39 | 5.71 / 5.12 / 4.55 | pass |
| amber data mark vs bg / surface / surface2 | 2.19 / 2.34 / 2.01 | 9.65 / 8.65 / 7.67 | FAIL light |
| ember / violet / ink2 data marks vs surface | 5.18 / 5.54 / 9.37 | 4.57 / 5.06 / 9.77 | pass |
| `--line` (button and card borders) vs bg / surface / surface2 | 1.48 / 1.58 / 1.36 | 1.70 / 1.53 / 1.35 | FAIL (see M4) |
| print sheet line `#cfc3b0` vs white | 1.74 | n/a | FAIL (decorative only) |

Headline: every text colour token already passes AA in both themes. The contrast problems are graphical (amber data marks, hairline borders), not text.

## Findings (ranked)

Severity key. HIGH: a judge in the back row loses information during the demo. MEDIUM: keyboard or senior-reader friction, visible if someone tries. LOW: polish or edge cases.

### HIGH

**H1. Lots of body copy sits at 15-17px, under the 18px floor.**
The body default is 18px, but components override it downward in many places:
- 17px (`text-[1.0625rem]`): `story/steps.tsx:32, 41, 116, 117, 146, 202, 237, 262, 266, 270`; `HowItWorks.tsx:15, 79, 87`; `ui.tsx:47` (nav links), `ui.tsx:78` (every `Stat` label); `Explore.tsx:24, 87`; `viz/Charts.tsx:14` (every chart legend); `viz/Misc.tsx:52, 155`; `Story.tsx:160`; `.btn` itself at `globals.css:113` (1.0625rem).
- 16px (`text-[1rem]`): `story/steps.tsx:193, 195, 197, 271, 297`; `Compare.tsx:58, 65`; `HowItWorks.tsx:52, 53, 66`; `Explore.tsx:14, 26, 95`; `viz/Charts.tsx:90, 127` (chart captions); `viz/Misc.tsx:22, 135, 160`; `ui.tsx:39` (tagline); `RingMap.tsx:145`; `Story.tsx:144` (footer, including the keyboard hint); `.kicker` and `.chip` at `globals.css:91, 107`.
- 15px: `story/steps.tsx:263` (lens chips, `!text-[0.9375rem]`), `story/steps.tsx:299` (credits); Recharts axis ticks `viz/Charts.tsx:9` and `globals.css:138` (15px).
- 16px Recharts tooltip `viz/Charts.tsx:8`.

Fix (lowest-risk order): (a) bump `.btn`, `.chip`, `.kicker` to `1.125rem` in `globals.css:91, 107, 113`; (b) global replace `text-[1.0625rem]` with `text-[1.125rem]` and `text-[1rem]` with `text-[1.125rem]` for captions/labels (keep `text-[1rem]` only for the URL lines that `break-all`); (c) `axisTick.fontSize` 15 to 18 and `.recharts-text` 15px to 18px; widen `YAxis width` 64 to 80 so tick labels do not clip; (d) lens chip and credits to 1.0625rem minimum. Execution risk: the story slides are fixed-height (`h-dvh`, `Story.tsx:100`); a 1-2px bump can push cards on `steps.tsx` 190-300 into scroll at 1280x720. Re-screenshot every step at 1280x720 after the change, or skip (b) for the densest slides.

**H2. SVG chart text shrinks with the viewBox, so 17px labels render around 13px.**
`viz/Misc.tsx:78, 85, 86, 96` (temperature ladder) use `fontSize="17"` inside `viewBox="0 0 1000 ..."` (`Misc.tsx:72`); the SVG is `w-full`, so text scales with the rendered width. `viz/Sankey.tsx:77-104` uses 21-25 inside a 1000-wide viewBox (`Sankey.tsx:64`).
ASSUMPTION (not measured in a browser): on a 1280px-wide projector, the split layout gives the visual about 8/12 of the width after padding (`Story.tsx:122`), roughly 760px. That puts the ladder labels at about 17 x 0.76 = 13px and the Sankey sub-labels (21-22) at about 16-17px.
Fix: raise ladder text to `fontSize="24"` and Sankey 21/22 to 26 (adjust `x`/`y` offsets), or render labels as HTML overlays. Verify by screenshot at 1280x720.

**H3. Amber data marks are 2.0-2.3:1 on the light theme, which fails 1.4.11 and washes out on a projector.**
- Monthly chart "Heat the data center produces": `viz/Charts.tsx:35` (legend), `Charts.tsx:43` (`stroke="var(--amber)"`, fill at 22% opacity, which is lower still).
- Big supply bar: `viz/Misc.tsx:43` (`background: var(--amber)`).
- Progress bar gradient `Story.tsx:103` (decorative, fine).
Fix: add `--amber-strong: #b45309` to `:root` (computed 4.70 on bg, 5.02 on surface, 4.32 on surface2) and use it for strokes and solid bars in light mode; keep dark-mode amber (`#f0b14a`, 8.65+). Alternatively give the amber area a 2px `var(--ember-text)` outline. Projectors lower contrast further, so treat 3:1 as the minimum, not the goal.

**H4. Exact values live only in hover tooltips on three charts.**
- Tornado `viz/Charts.tsx:144-146`: low/high dollar values appear only in the `Tooltip`; the bars have no `LabelList`. On stage nobody hovers, so the sensitivity range is read off a 15px axis.
- Monthly chart `Charts.tsx:42` and winter/summer week chart `Charts.tsx:73, 85`: values only on hover. The shape still reads, but the "backup is small" claim depends on reading the stack.
- Compare: `LcohBars` (`Charts.tsx:122`) and the propane chart (`Charts.tsx:173, 182`) already print values: good pattern to copy.
Fix: add `<LabelList dataKey="low" position="left" formatter={(_, i) => ...lo} />` and the same for `high` on the tornado (or print "$lo to $hi" next to each driver name in the `YAxis` tick); add one sentence of numbers under the monthly and week charts (peak month delivered GWh, backup share), read from `d.monthly` / `d.weeks` so nothing is hand-typed.

### MEDIUM

**M1. Arrow keys inside radio groups advance the slide instead of changing the choice.**
`Story.tsx:68-93` binds ArrowLeft/Right/Up/Down on `window` and only skips text inputs and `role="slider"` (`Story.tsx:8-13`). The heating-bill picker (`viz/Misc.tsx:125-135`) and other `role="radio"` buttons (`Compare.tsx:32-34`, `Explore.tsx:59-60`) promise the ARIA radio pattern (arrows move selection) but arrows jump to the next step. Space on a button is correctly skipped (`Story.tsx:76-77`).
Fix: in `isTyping`, also return true when `el.closest('[role="radiogroup"], .maplibregl-map')`; or drop `role="radio"`/`aria-checked` and use `aria-pressed` toggle buttons like `WeekChart` does (`Charts.tsx:61-63`). The second option is zero-risk for the presenter's arrow-key flow.

**M2. The live map container is `role="img"` but contains focusable controls.**
`RingMap.tsx:144` puts `role="img"` on the MapLibre container, which also holds the focusable canvas and the zoom buttons from `NavigationControl` (`RingMap.tsx:115`). `role="img"` makes children presentational, so screen readers hear an image while Tab lands on unnamed controls. Hypothesis (not tested): with the canvas focused, arrow keys both pan the map (MapLibre keyboard handler is on by default) and advance the slide via the window listener.
Fix: move the label to an `aria-label` on a wrapping `figure`, drop `role="img"` from the map div, and pass `keyboard: false` to `new ml.Map({...})` (the static SVG fallback `RingMapSvg` already carries a full text description, `RingMap.tsx:30`). MapLibre zoom buttons are about 29px [unverified size], below the 44px target the rest of the app uses.

**M3. Disabled Back/Next look identical to enabled ones.**
`Story.tsx:145-146` set `disabled`, but `.btn` (`globals.css:109-118`) has no `:disabled` style, so on step 1 "Back" looks clickable and does nothing.
Fix: `.btn:disabled { opacity: .45; cursor: not-allowed; }` (disabled controls are exempt from contrast rules).

**M4. Button and card borders are hairlines (1.4-1.7:1).**
`--line` `#d8ccba` (`globals.css:8`) and dark `#2c4050` (`globals.css:28`) draw every `.btn` border (`globals.css:112`) and `.card` border (`globals.css:100`). Unpressed buttons have text, so this is not a strict WCAG fail, but on a projector unpressed choice buttons read as plain text next to the dark pressed one.
Fix: add `--line-strong: #8a7a63` (3.90 on bg, 4.16 on surface) and dark `#6b8396` (4.62 on bg, 4.14 on surface), and use it only for `.btn` borders. Keep `--line` for cards and grid lines.

**M5. Some instructions only appear on hover or on wide screens.**
- `Story.tsx:148`: the "key S" shortcut is in a `title` tooltip.
- `Story.tsx:149`: the full keyboard hint is `hidden xl:inline`, so it disappears below 1280px wide (common projector width 1024 or 1280 x 720/768).
- `ui.tsx:12`: the "Illustrative data" chip explains itself only in `title` (only shown when `data.placeholder` is true, so it should be absent in the final build: confirm).
Fix: change `xl:inline` to `lg:inline` and shorten the hint ("Arrows move · P notes · F fullscreen · S deep dive"); put the placeholder explanation in visible text or remove the chip once real data ships.

**M6. One animation ignores prefers-reduced-motion.**
`viz/Misc.tsx:156` sets `transition: "width .4s"` on bill bars unconditionally. Everything else is gated: framer-motion via `useReducedMotion` (`Story.tsx:17, 103, 111-114`; `Misc.tsx:43, 49`), CSS `.flow-anim` / `.pulse` via the media query (`globals.css:128-131`), and Recharts uses `isAnimationActive={false}` everywhere.
Fix: `transition: calm ? "none" : "width .4s"` using the hook already imported in `Misc.tsx:4`, or add `*, *::before, *::after { transition-duration: 0s !important; }` inside the existing reduced-motion block. MapLibre zoom/pan easing from the zoom buttons: whether it honours reduced motion is [unverified].

### LOW

**L1. Step changes are announced only as "Step n of m".**
`Story.tsx:147` is the only live region; the new headline (`id="step-h"`, `Story.tsx:124, 134`) is not announced and focus stays on the footer. Fix: add a visually hidden `aria-live="polite"` span containing `s.kicker + ": " + s.headline`. Do not move focus automatically: it would break the presenter's repeated Next presses.

**L2. No skip link.** Keyboard users tab through 5 nav links and 1-3 buttons (`ui.tsx:37-58`) before content. Fix: an `sr-only focus:not-sr-only` "Skip to content" link targeting `main`.

**L3. Map attribution at 12px** (`globals.css:135`). It is legal credit text, so leave it, but it is the smallest on-screen text.

**L4. Print one-pager uses 10.5pt and 8.5pt** (`PrintSheet.tsx:75, 78`). Fine on paper; on screen the letter-size preview renders the credits around 11px. Fix only if the one-pager is projected: show the QR/URL larger, credits are fine.

**L5. Range sliders show values but do not expose units to assistive tech.** `Explore.tsx:16` and `HowItWorks.tsx:47, 50` are labelled correctly (label wraps or `htmlFor`), but have no `aria-valuetext`, so a screen reader hears "45" not "45 °C". Fix: `aria-valuetext={`${value} ${unit}`}`.

## What already passes

- All text colour tokens pass AA in both themes (table above); lowest text pair in use is `good` on surface2, 5.27:1.
- Global `:focus-visible` ring: 3px teal with 3px offset (`globals.css:80`), 3.39-5.71:1 against every background, so it passes 1.4.11 and is visible on a projector. No `outline-none` or `focus:outline-0` anywhere in source.
- Body text is 18px (`globals.css:71`); headlines 36-64px (`globals.css:86`); lede 18-24px (`globals.css:97`); story stat numbers 32-96px (`ui.tsx:74`).
- Targets: `.btn` min 44x44 (`globals.css:111`), nav links min-height 44 (`ui.tsx:47`), range inputs 44px tall (`globals.css:122`).
- Story is fully keyboard-driven: arrows, Space/Shift+Space, PageUp/Down, Home/End, P, S, F (`Story.tsx:68-93`), with modifier keys and text inputs excluded.
- Reduced motion respected for slide transitions, progress bar, ring bars, CSS flow/pulse animations; Recharts animation disabled.
- Semantics: radiogroups and toggle buttons carry `aria-checked`/`aria-pressed`; progress bar has `role="progressbar"` with values; every SVG chart has `role="img"` with a numeric `aria-label` (`Sankey.tsx:64`, `Misc.tsx:72`, `RingMap.tsx:30`); legends and swatches are `aria-hidden` with visible text labels.
- Colour is never the only cue in the main charts: every series has a text legend, and ring cards repeat the ring name in text (`steps.tsx:116`).

## Lane status

Done:
- Contrast computed for all token pairs, light and dark, text and non-text.
- Sub-18px text inventory with file:line.
- Hover-only information, keyboard, focus and reduced-motion review with file:line and fixes.
- Ranked findings: 4 HIGH, 6 MEDIUM, 5 LOW.

Missing:
- No live render: SVG effective font sizes (H2) are estimates from layout math, not measured. Projector washout not tested.
- No screen-reader pass (NVDA/VoiceOver).
- MapLibre keyboard/arrow conflict (M2) and reduced-motion behaviour (M6) are untested hypotheses.
- `web/app/*/page.tsx` were only checked by grep (they are thin wrappers per the grep results); `Charts.tsx` lines 151-191 and `steps.tsx` were checked by grep, not read in full.

Open questions:
- Will the demo run in light or dark theme? H3 (amber) only fails in light; dark mode avoids it with zero code change.
- Projector resolution? If it is 1024x768, H1/H2 get worse and the keyboard hint (M5) is hidden.
- Recommended pre-11:00 changes with near-zero Execution risk: M3 (one CSS rule), M6 (one line), H3 (one token + two props), M1 option 2. H1 needs a screenshot pass at 1280x720 before shipping.

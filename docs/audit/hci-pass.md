# HCI pass on the public site (feat/ui-polish, 2026-10-04)

Method: rendered pages checked in Chrome Beta (Playwright) at 1920x1080, 1280x720 and 375x812, plus a build with `NEXT_PUBLIC_BASE_PATH=/Data-Center-Heat-Reuse` served under that prefix (all routes load, every nav and CTA link carries the prefix, 0 failed requests, 0 console errors). Frameworks from the design-audit skill references. Screenshots: `web/screenshots/v2-*.png`.

## Cognitive walkthrough (first-time visitor)

| Task | Steps on the new site | Result |
|---|---|---|
| Find what this costs a Lansing homeowner | Land on Home. The first card says $735 a year saved by a typical propane home and the price of community heat per MWh. "Try the model" opens Explore, whose saving card says the saving is unchanged because the tariff is fixed at 80% of propane. | Pass in 0 clicks. Before: the visitor landed on Story slide 1 (a town-board fight) and needed 6 key presses to reach the household step. |
| See why the town ring is not built | Home, "Three rings" section: Ring 3 says "Fails the cost test: not built" with $734 vs $136 per MWh and 14 km of pipe. In Explore, ticking the town ring strikes through the old cost, shows the new one and a red "fails the cost test" badge. | Pass in 0 clicks. Before: answer was in Story step 3 lede text or a hidden Explore delta. |

## Findings

| Framework | Finding | Location | Severity | Status |
|---|---|---|---|---|
| Nielsen H8 / Krug | Landing page was the 11-step stepper that duplicates the deck; no one-line answer | `app/page.tsx` | High | Fixed: new `components/Home.tsx` (answer, rings, map, two CTAs, How-we-know row) |
| Nielsen H4 | Nav had 6 items incl. Story and One-pager; labels did not match page purpose | `components/ui.tsx` NAV | High | Fixed: Home · Explore · Compare · How it works · Sources |
| Nielsen H8 | Public visitors saw presenter chrome: Notes, Presenter window, Deep dive, key hints, step counter | `components/story/Story.tsx` footer | High | Fixed: shown only with `/story/?present=1`; P/O/S keys also gated |
| Nielsen H1/H4 | Kicker number used the 11-step index while the counter used the 9-step path ("9 ·" vs "Step 7 of 9") | `Story.tsx`, `steps.tsx` | High | Fixed: kicker numbered from the active path |
| Norman signifier | Deep-dive toggle rendered navy (pressed) while deep dive was off | `Story.tsx` footer | Medium | Fixed: plain button, label carries state |
| Norman feedback | Ticking the town ring changed the cost by a small grey delta only | `components/Explore.tsx` cost card | High | Fixed: struck-through before value, ember after value, red badge |
| Nielsen H4 (consistency with deck) | Explore showed $108 at 7% and $734/yr saving; deck says $106.1 and $735 | `lib/model.ts` `scenario` | High | Fixed: LCOH anchored to 4/7/10% published values; saving uses published figure; Explore opens at 7% (LCOH and savings figures read from `outputs/site2.json`) |
| UI review: type scale | Each page set its own headline clamp; KPI numbers up to 3rem in small cards | Explore, Compare, How, Sources | Medium | Fixed: shared `t-h1/t-h2/t-h3/t-stat/t-caption` in `globals.css`; stats capped at 2.5rem |
| UI review: sections | No section headers or dividers on the entry page | Home | Medium | Fixed: `t-h2` headers with a rule, cards per item |
| WCAG 1.4.11 | Light amber data marks 2.19:1 | `globals.css --amber` | High | Fixed: #a8690a, 3.85:1 on surface2, 4.19:1 on bg |
| WCAG 1.4.10 reflow | Nav did not fit at 375px | `ui.tsx` NavBar | Medium | Partly fixed: nav gets its own row below md, tighter padding, scrolls horizontally; no scroll signifier yet (deferred) |
| WCAG 1.4.4 / projector | Chart ticks 15px, tooltip 16px, kicker and chip 16px | `Charts.tsx`, `globals.css` | Medium | Fixed: 17px |
| WCAG 2.4.7 focus visible | Global 3px teal focus ring | `globals.css` | n/a | Passes, unchanged |
| WCAG 2.5.8 target size | Buttons and nav links min 44px | `globals.css .btn`, `ui.tsx` | n/a | Passes, unchanged |
| Hover-only values | Monthly chart and week backup values only in tooltips | `viz/Charts.tsx` | High | Fixed: monthly delivered GWh labels; backup peak MW in the week legend |
| Projector fit | 8 of 11 Story steps scrolled at 1280x720 | `Story.tsx`, `steps.tsx` | Critical | Fixed: 0 of 11 at 1280x720, 1600x900, 1920x1080 (short and deep paths) |
| Nielsen H2 | Explore LCOH chart labels wrap at 1280 ("Community co-op (4% / finance)"); By-ring header "GWh/yrShare" jammed | `Charts.tsx LcohBars`, `Explore.tsx` | Low | Deferred |
| Nielsen H4 | Compare table last column "11,408 11,888 ✓" has no gap | `Compare.tsx` | Low | Deferred |
| Map | MapLibre container is `role="img"` but holds focusable controls | `viz/RingMap.tsx` | Medium | Deferred (no time to test keyboard behaviour safely) |
| Tornado note | Requested note under the uptake bar | `viz/Charts.tsx Tornado` | n/a | Not applicable: the Tornado component is not rendered on any page |

# Visual design review — Thermal Commons

**Interface:** Thermal Commons story, Explore, Compare, and one-pager. Audience is a senior HDR / Grundfos reviewer on a projector: one takeaway per screen, big type.
**Review date:** 2026-10-04.
**Method:** Visual framework (typography, color, spacing, hierarchy, consistency, chart craft). Evidence is the PNG set in `web/screenshots/` plus the classes that paint those frames. This lane did not run a browser and did not measure contrast with a picker. WCAG numbers belong in `docs/audit/ux-wcag.md`.
**Benchmark (judgment, not a measured score):** NYT climate graphics (one annotated idea, labels on the marks) and Stripe (one accent, a real typeface, numbers that sit in a clear frame).
**Severity:** Critical / High / Medium / Low. Items marked *judgment* are taste. Items marked *fact* are visible in a named PNG or in the cited source line.

Screenshot set is two captures about a minute apart (file timestamps 2026-10-04 12:53–12:55). `story-06-1366.png` shows nav item "How it works", footer "Step 5 of 9", and "Show deep dive". The 1920 story frames read as "Step N of 11" and "5-minute path". Critique both. Current nav source is `web/components/ui.tsx` (five links, including How it works).

## Scope and method

| File | What it shows |
|---|---|
| `story-01` … `story-11` at 1920 and 1366 | Story path, light theme |
| `explore-1920.png` | Explore, base case, light theme |
| `explore-1366.png` | Blank "Loading data…" only (6.7 KB). Explore at 1366 was not captured |
| `compare-1920.png`, `compare-1366.png` | Site comparison |
| `print-1920.png`, `print-1366.png` | Letter one-pager inside the app chrome |
| Not in the folder | Dark theme, `/how/`, a viewport under 1366, hover or focus |

## First impression

*Judgment.* The story looks like a serious editorial, not a dashboard template. Warm paper (`--bg: #fbf7f0`), a serif headline, and one sentence per step are the right register for this room. Trust is high on steps 1, 7, and 11, where a sentence and a few numbers fill the frame.

The graphics that should carry the pitch are quieter than the headlines. The Sankey (`story-04`), the map (`story-03`), and the year chart (`story-06`) sit in a large cream field with no figure frame. A judge in the third row gets the sentence and misses the chart. First-impression score: **7/10**. Competitive standing versus the named benchmarks: behind on annotation and on color discipline, level with a well-set hackathon app on type scale and spacing.

## Scorecard

Each dimension is 0–10. Overall is the average, times 10, rounded.

| Dimension | Score | Status | Why |
|---|---|---|---|
| Visual hierarchy | 7 | Pass with gaps | Headlines dominate. Explore's six KPIs and the impact tiles do not. |
| Typography | 7 | Pass with gaps | 18px body, clamp headlines, tabular numbers. SVG labels truncate. System fonts. |
| Color | 4 | Fail | One hue means three things. Phase 1 and Phase 2 swap colors between the map and the cost chart. |
| Spacing | 7 | Pass | 8-ish padding scale, cards breathe. Story charts leave a dead lower third. |
| Consistency | 4 | Fail | Ring colors disagree across components. Story and Explore feel like two products. |
| Imagery and graphics | 6 | Mixed | Custom SVG, no stock art. Sankey and map are low-contrast. |
| Layout and grid | 7 | Pass | Split story grid is repeatable. One-pager clips its last line. |
| Components | 6 | Mixed | Buttons and cards match. Sliders, loading, and the dry-cooler callout do not. |
| Brand | 7 | Pass | Triangle mark, ember kicker, paper ground. Memorable enough for a 15-minute pitch. |
| Modern standards | 7 | Pass | No gloss, no rainbow chrome. Annotation craft is the gap, not trendiness. |

**Visual design score: 62/100.** Adequate editorial system. The color bugs are what a judge will feel as "sloppy" even if they cannot name them.

## What already works

- *Fact.* Body is 18px / 1.5, headlines use `clamp(2.25rem, 3.7vw + 0.4rem, 4rem)` with `text-wrap: balance` (`web/app/globals.css` `.headline`, `body`). That is the right size for a projector.
- *Fact.* Ink is `#13202b`, not pure black, on `#fbf7f0`. Kickers are one treatment everywhere: 1rem, 700, 0.12em, uppercase, `--ember-text`.
- *Fact.* Buttons share `.btn` (min 44px, radius 12px). The active nav pill is navy on paper (`ui.tsx` inline style). Focus is a 3px teal ring.
- *Fact.* `.num` is tabular. Units are `.55em` and `--ink2`, so "$136" reads as the number and "per MWh" reads as the unit (`story-01-1920.png`).
- *Fact.* `prefers-reduced-motion` stops `.flow-anim` and `.pulse`.
- *Judgment.* Step 7 (household) and step 11 (the ask) are the closest to Stripe: one claim, one comparison, no extra chart types.

## Fifteen improvements

Ranked by what changes the pitch if fixed before the demo. CSS below is the suggested patch, not a claim that it is already in the repo.

### 1. Phase colors flip between the map and the cost chart

- **Severity:** Critical. *Fact.*
- **Where:** `story-03-1920.png` versus `story-08-1920.png`. `ringColor` in `web/components/ui.tsx` sets on-site to `--ember` and corridor to `--teal`. `RING_COLOR` in `web/components/viz/Charts.tsx` (`RingLcoh`) sets on-site to `--teal` and corridor to `--ember`. The Sankey and the step-2 ratio bars follow `ringColor`. The step-8 bars follow `RING_COLOR`.
- **Why it matters:** After the map, orange means the farm campus. On the money slide, orange means the corridor, and it is also the color of the "Propane today" dashed line. A reviewer cannot keep one legend.
- **Fix:** Delete the local map. Use one token.

```css
/* globals.css :root — add, then use these everywhere instead of ad-hoc hex */
--ring-onsite: var(--ember);
--ring-corridor: var(--teal);
--ring-town: var(--violet);
--fuel: #6b3a2a; /* propane and oil only */
```

```tsx
/* Charts.tsx — replace RING_COLOR */
const RING_COLOR = {
  onsite: "var(--ring-onsite)",
  corridor: "var(--ring-corridor)",
  town: "var(--ring-town)",
  ashp: "var(--ink2)",
};
/* ReferenceLine for propane: stroke="var(--fuel)" not var(--ember) */
```

- **Effort:** Low (one constant plus the reference-line stroke).

### 2. Ember is the kicker, the captured heat, and the fuel being beaten

- **Severity:** High. *Fact* for the collisions; the split below is *judgment*.
- **Where:** Kicker color `--ember-text` on every step. Step 2 supply bar is `--amber`, on-site segment is `--ember` (`Misc.tsx` `RatioBars`). Step 7 propane bar is ember, community bar is teal (`story-07-1920.png`). Step 4 heat-captured node is ember (`Sankey.tsx`). Print bars paint propane and heating oil with the same `--ember` (`PrintSheet.tsx` `bars`).
- **Why it matters:** Orange sometimes means "us" and sometimes means "the bill we replace." Stripe uses one accent. NYT uses a second hue only for the thing being compared.
- **Fix:** Keep ember for the on-site ring and the kicker. Paint every incumbent fuel with `--fuel`. Paint "heat available" only with `--amber`.

```tsx
/* PrintSheet.tsx bars */
{ n: "Propane", v: f.incumbent_usd_mwh.propane, c: "var(--fuel)" },
{ n: "Heating oil", v: f.incumbent_usd_mwh.heating_oil, c: "var(--ink2)" },
```

```css
/* household comparison bars in the step-7 card: propane track */
.bar-fuel { background: var(--fuel); height: 1.25rem; border-radius: 6px; }
.bar-ours { background: var(--teal); height: 1.25rem; border-radius: 6px; }
```

- **Effort:** Low.

### 3. The Sankey highlights the dry coolers in the "good" color

- **Severity:** High. *Fact.*
- **Where:** `story-04-1920.png`. `Sankey.tsx` draws the dry-cooler outline `stroke="var(--teal)"` `strokeDasharray="9 7"` around a gray node, while the delivered campus and homes are thin ribbons. White dashed `.flow-anim` strokes run across both the salmon captured stream and the gray rejected stream.
- **Why it matters:** Teal elsewhere means recovered heat, savings, and the corridor. Here the loudest teal object is the heat that is thrown away. The side-stream, which is the product, is the thin ribbon.
- **Fix:**

```tsx
/* Sankey.tsx dry-cooler rect: ink, not teal */
stroke="var(--ink)" strokeWidth="2" strokeDasharray="0"
/* flow-anim only on the delivered ribbons, not on the gray reject path */
```

```css
/* globals.css — slower, shorter dash so it reads as flow, not noise */
.flow-anim { stroke-dasharray: 6 10; animation: flow 2.4s linear infinite; }
```

Add a 20px serif annotation on the thin delivered ribbon: "This is the product." Leave the gray mass unlabeled except "Not captured."

- **Effort:** Low for the stroke. Medium if the ribbon thickness is redrawn so delivered heat is at least 28px tall regardless of MW (a minimum height already exists at 4–6px; raise the delivered nodes only).

### 4. The "6.5% is used" bar is a sliver, and `minWidth: 90` lies about the scale

- **Severity:** High. *Fact.*
- **Where:** `story-02-1920.png`. `RatioBars` sets the demand track to `` width: `${pct}%` `` with `minWidth: 90`, then stacks two ring colors inside that stub (`Misc.tsx`). The supply bar is full width and `--amber`. The headline says "15×" while the giant number says "15.4×".
- **Why it matters:** The small bar is the whole insight, and the two segments cannot be told apart. The minimum width makes 6.5% look wider than 6.5%. NYT would annotate "51 of 778" on a full-width track.
- **Fix:** One full-width track. Fill the used share. Put the ring split in the legend, not inside a 90px stack.

```tsx
<div className="relative h-14 rounded-xl bg-surface2 overflow-hidden">
  <div className="absolute inset-y-0 left-0 bg-amber" style={{ width: "100%" }} />
  <div className="absolute inset-y-0 left-0 bg-ember" style={{ width: `${pct}%`, minWidth: 0 }} />
</div>
<p className="mt-2 text-[1.25rem]">
  <b className="num">{dec(demand / 1000, 0)} GWh</b> used · {int(d.supply.heat_available_GWh)} GWh produced
</p>
```

Use the same ratio string in the headline and the giant number (`dec(ratio, 1)`), so the slide does not show both 15× and 15.4×.

- **Effort:** Low.

### 5. Temperature ladder cuts names and encodes two things with color

- **Severity:** High. *Fact* for truncation. Encoding split is *fact*; the recommended encoding is *judgment*.
- **Where:** `story-05-1366.png` and `story-05-1920.png`. `TempLadder` slices names at 29 characters (`Misc.tsx`: `o.name.slice(0, 29) + "…"`). Visible stubs include the school district, the greenhouse campus, and the library. Dots and stems use `ringColor` (orange / teal / violet). Background bands use teal wash left of 50 °C and ember wash to the right. Those are different questions (which ring, vs. direct heat vs. boost).
- **Fix:**

```tsx
/* stop slicing; give the name column width */
const x0 = 460; /* was 360 */
<text fontSize="16" /* 18px was colliding */ >
  {/* full o.name; if still long, tspans of 22 chars, two lines, rowH 48 */}
</text>
/* dot fill stays ring color; add a 8px swatch in the name column */
/* background bands: teal wash = direct, surface2 = needs a boost. Do not reuse ember for the boost band. */
<rect fill="var(--surface2)" /> /* right of 50 °C */
```

```css
/* axis labels */
.temp-axis { font-size: 15px; fill: var(--ink2); font-variant-numeric: tabular-nums; }
```

- **Effort:** Medium (SVG layout). High value on the technical slide.

### 6. The year chart draws the headline and then hides it

- **Severity:** High. *Fact.*
- **Where:** `story-06-1920.png`, `story-06-1366.png`. `YearChart` in `Charts.tsx`: amber area "heat produced" near the top of a 0–80 GWh axis; delivered heat is a short ember bar on the baseline. Summer months read as empty. The headline says the leanest month is still 7.3× demand. The chart does not say that.
- **Fix:** Drop the shared 80 GWh scale for this slide. Draw demand as the full bar (index = 1) and supply as a label, not a second series on the same axis.

```tsx
<Bar dataKey="delivered" fill="var(--ember)" maxBarSize={28} radius={[4, 4, 0, 0]} />
<LabelList dataKey="delivered" position="top" formatter={(v) => `${dec(Number(v), 0)}`} fill="var(--ink)" fontSize={14} />
/* caption under the plot, 1.125rem */
/* "January demand is the tallest bar. Supply that month is still 7.3× this bar." */
```

If both series must stay, put supply on a right axis and do not fill it at 22% opacity across the whole plot. The fill is what makes the demand bars look like noise.

- **Effort:** Medium.

### 7. The winter-week backup is the event, and it has no label

- **Severity:** Medium. *Fact* that the gray notch is unlabeled in `story-06-1920.png`. The caption under the strip is 1rem `--ink2` ("Outdoor temperature (°C) for the same week."), easy to miss from the back row.
- **Where:** `WeekChart`. Heat is an  ember area; backup is `--ink2` stacked. Temperature is a second chart at `h-[84px]` with a °C axis crammed into that strip.
- **Fix:**

```tsx
<div className="h-32"> {/* was h-[84px] */}
/* ReferenceLine or a custom label at the backup hour: */
<Label value="Backup covers this notch" position="top" fill="var(--ink)" fontSize={16} fontWeight={700} />
</div>
<p className="text-[1.125rem] text-ink m-0 mt-1">Outdoor temperature, same week, degrees Celsius.</p>
```

```css
.recharts-text { fill: var(--ink2); font-size: 16px; } /* was 15px in globals.css */
```

- **Effort:** Low.

### 8. Impact slide says "Community Community", and the equity caveat is the small type

- **Severity:** High. *Fact.*
- **Where:** `story-10-1920.png`. `steps.tsx` prints a lens chip and then `s.petal`. In `web/public/data/site2.json` the first scorecard row is `"lens": "Community", "petal": "Community"`, so the card reads "Community Community". The four hero numbers use teal, default ink/ember, violet, and ember again (`Tile` tones), which does not match the chip colors under them. The "Lansing context" card (no designated disadvantaged community) is `text-[1rem]` on `--surface2`, smaller than the claims around it.
- **Why it matters:** This is the HDR regenerative slide. A duplicated word looks unfinished. Burying the equity limit under the job and food numbers overclaims by layout, even though the sentence itself is careful.
- **Fix:**

```tsx
<div className="font-bold text-[1.125rem] flex items-center gap-2">
  <span className="w-2 h-6 rounded-sm" style={{ background: lensColor(s.lens) }} aria-hidden />
  {s.petal === s.lens ? s.petal : s.petal}
  {s.petal !== s.lens && <span className="font-semibold text-ink2 text-[1rem]">{s.lens}</span>}
</div>
```

```tsx
/* context card — same title size as the petals, not a footnote */
<div className="card p-3 border-l-4 border-ink" style={{ background: "var(--surface2)" }}>
  <div className="font-bold text-[1.125rem]">Lansing context</div>
  <p className="text-[1.0625rem] leading-snug text-ink m-0 mt-1">No designated disadvantaged community. Equity here means older residents and propane and oil households.</p>
</div>
```

Hero tiles: one color (`--ink`) for all four numbers. Color belongs on the petal rules, not on the counts.

- **Effort:** Low.

### 9. Explore has six equal numbers and no hero

- **Severity:** Medium. *Judgment* on which number leads. *Fact* that the six cards share one style (`Explore.tsx` `Kpi`, `clamp(2rem, 3.2vw, 3rem)`).
- **Where:** `explore-1920.png`. "Cost to make heat $83" and "Saving for a propane home $734" sit in the same frame as GWh and COP. The LCOH chart underneath is the best chart in the app (direct labels, teal vs. ember). It is visually subordinate to the card grid.
- **Fix:**

```tsx
<div className="grid gap-4 xl:grid-cols-4">
  <Kpi className="xl:col-span-2" hero label="Cost to make heat" /* fontSize clamp(3rem, 5vw, 4.5rem) */ />
  <Kpi label="Saving for a propane home" />
  <Kpi label="CO₂ avoided" />
</div>
/* demote GWh, share, and COP into a single line of .text-[1.125rem].text-ink2 under the hero */
```

```css
.kpi-hero { background: var(--navy); color: var(--bg); }
.kpi-hero .unit, .kpi-hero .text-ink2 { color: var(--line); }
```

- **Effort:** Low. This is the Stripe move: one number, then the evidence.

### 10. Compare checks make a small CO₂ edge look like the heat-available win

- **Severity:** Medium. *Fact* that every "better" cell is the same teal check (`Compare.tsx` `r.better` renders `✓` and `color: var(--teal-text)`). Magnitude is *judgment*.
- **Where:** `compare-1920.png`. 150 MW vs 30 MW and a CO₂ pair that differs by tens of tonnes on an ~11,000 tonne base both get one check. The left card is four equal sentences. The table has no bars. Below the fold is empty cream.
- **Fix:**

```tsx
<td className="num text-right font-bold py-3">
  <span className={r.better === "2" ? "text-teal-text" : "text-ink"}>{r.v2}</span>
  <span className="block text-[1rem] font-semibold text-ink2">{r.delta}</span>
</td>
```

```css
/* a 4px bar under the winning cell, width = share of the row max */
.cmp-bar { height: 4px; border-radius: 999px; background: var(--teal); margin-top: 4px; margin-left: auto; }
```

Left card: one sentence in `.lede`, then three chips (`50 °C`, `upstate grid`, `gas moratorium`), not a paragraph stack.

- **Effort:** Medium.

### 11. The one-pager clips its last line, and the QR is a postage stamp

- **Severity:** High. *Fact* for the CSS. The 1920 screenshot shows the credits line cut at the sheet edge; that matches the CSS below. Pixel-perfect overflow was not measured with a ruler.
- **Where:** `print-1920.png`, `print-1366.png` (1366 frame ends above the ask because the letter is taller than the viewport). `globals.css`: `.letter { width: 8.5in; height: 11in; }`. `PrintSheet.tsx` article is `letter … overflow-hidden` at 11pt, with an 84px QR (`<QrCode size={84} />`). Propane and oil share `--ember` (see item 2).
- **Fix:**

```css
.letter { width: 8.5in; min-height: 11in; height: auto; }
@media print {
  .letter { height: 11in; overflow: hidden; }
}
```

```tsx
<article className="letter sheet-light shadow-xl p-[0.45in] flex flex-col gap-3">
  <QrCode url={PUBLIC_URL} size={120} hideCaption />
  <p className="m-0 text-[12pt] break-all">{PUBLIC_URL}</p>
</article>
```

Screen preview should scroll rather than eat the URL. Print stays one page only after the map block is `max-h-[4.2in]`.

- **Effort:** Low to stop the clip. Medium to rebalance the letter so print still fits 11 inches.

### 12. Type is a system stack, so the stage laptop changes the brand

- **Severity:** Medium. *Fact* for the stack. The "wow" gap is *judgment*.
- **Where:** `globals.css` `--font-serif: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, …` and `--font-sans: "Segoe UI", system-ui, …`. Iowan is an Apple face. Palatino Linotype is the Windows face. Segoe UI will not be on a Mac projector. NYT and Stripe do not leave the display face to the OS.
- **Fix:** Self-host Source Serif 4 and Source Sans 3 (OFL). Then:

```css
@font-face {
  font-family: "Source Serif 4";
  src: url("/fonts/SourceSerif4-Semibold.woff2") format("woff2");
  font-weight: 600;
  font-display: swap;
}
@font-face {
  font-family: "Source Sans 3";
  src: url("/fonts/SourceSans3-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
:root {
  --font-serif: "Source Serif 4", Georgia, serif;
  --font-sans: "Source Sans 3", "Segoe UI", sans-serif;
}
h1, .headline { font-weight: 600; letter-spacing: -0.02em; }
```

Until the files exist, set an explicit fallback order and do not claim a custom face. QR SVG in `Misc.tsx` hardcodes `dark: "#000000"`; use `#13202b` so the mark matches `--ink`.

- **Effort:** Medium (two woff2 files). Highest "wow per hour" after the color fix.

### 13. Story graphics float in cream with no frame, under a 62dvh cap

- **Severity:** Medium. *Fact* for the cap. "Looks unfinished from the back row" is *judgment*.
- **Where:** `Story.tsx`: visual column is `lg:h-[min(62dvh,640px)]` inside a vertically centered grid. Steps 2, 3, 4, and 9 show a wide empty band under the content at 1920.
- **Fix:**

```tsx
<div className="min-w-0 lg:h-[min(74dvh,780px)] rounded-2xl bg-surface border border-line shadow-sm p-4 lg:p-6">
  {s.visual}
</div>
```

```css
.card, .graphic-frame { border-radius: 12px; } /* 18px on .card reads as a consumer app; 12px is closer to an editorial figure */
```

Do not frame step 1's three fact cards twice; they are already `.card`. Frame only `s.visual` when it is a chart or map.

- **Effort:** Low.

### 14. At 1366 the nav is one crowded row, and the progress mark is 6px

- **Severity:** Medium. *Fact.*
- **Where:** `story-06-1366.png` shows wordmark, tagline, Story, Explore, Compare sites, How it works, One-pager, and Dark on one line. `Story.tsx` progress is `h-1.5` (6px) with an ember-to-amber gradient. Footer hints are `hidden xl:inline`, so at 1366 the keyboard line disappears and the buttons remain, which is correct; the progress bar does not get any thicker.
- **Fix:**

```tsx
/* ui.tsx Link */
className="min-h-11 inline-flex items-center px-2.5 xl:px-3 rounded-lg font-semibold text-[1rem] xl:text-[1.0625rem]"
/* Story.tsx progress */
<div className="h-2 bg-line">
  <div className="h-full bg-ember" style={{ width: `${((pos + 1) / path.length) * 100}%` }} />
</div>
```

Drop the gradient. One solid ember bar is readable from the back row. Shorten the tagline with `hidden xl:inline` (it is `md:inline` today, so it still eats 1366).

- **Effort:** Low.

### 15. Explore at laptop width is a blank loading line, and the sliders are the browser default

- **Severity:** Medium. *Fact.*
- **Where:** `explore-1366.png` is only the sentence "Loading data…" on cream, top-left, no nav, no skeleton (`ui.tsx` returns that node before `NavBar` when `!data`). `explore-1920.png` sliders are native controls (`globals.css`: `input[type="range"] { height: 44px; accent-color: var(--teal); }`). The reset control is a full-width `.btn` at the bottom of the assumptions card, same chrome as "Liquid-cooled", so it looks like another choice.
- **Fix:**

```tsx
if (!data) return (
  <div className="min-h-dvh flex flex-col">
    <NavBar active="/explore/" />
    <p className="p-10 text-[1.25rem] text-ink2" role="status">Loading data…</p>
    <div className="px-10 grid gap-4 grid-cols-3">{[0,1,2].map((i) => <div key={i} className="card h-28 animate-pulse bg-surface2" />)}</div>
  </div>
);
```

```css
input[type="range"] {
  appearance: none;
  height: 28px;
  background: transparent;
}
input[type="range"]::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 999px;
  background: var(--line);
}
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 22px;
  height: 22px;
  margin-top: -8px;
  border-radius: 999px;
  background: var(--teal);
  border: 2px solid var(--surface);
}
```

```tsx
<button className="btn border-transparent bg-transparent justify-self-start px-0" onClick={() => setP(base)}>Reset to the base case</button>
```

- **Effort:** Low. Do not demo Explore until this loading frame is gone; `explore-1366.png` is what a cold load looks like if the fetch is slow.

## Chart clarity

| Graphic | Screen | Reads at a glance? | Main craft gap |
|---|---|---|---|
| Ratio bars | story-02 | The 15.4× does. The bar does not. | Item 4 |
| Ring map | story-03 | The three phases do. | Lake is `fill: var(--teal)` at `opacity: 0.22` (`RingMap.tsx`). Dots of unnamed users are 10px rings with no label. Raise lake to `opacity: 0.35` and `stroke: var(--teal-text)`. Add a north-free scale that is already there (5 km); add one label for the largest off-corridor dot or none. Do not label all of them. |
| Sankey | story-04 | The sentence does. The drawing fights it. | Item 3 |
| Temperature ladder | story-05 | The 50 °C line does. Names do not. | Item 5 |
| Year + week | story-06 | "Supply is a band, demand is a stub." Backup notch is unlabeled. | Items 6 and 7 |
| Household bars | story-07 | Yes. Best comparison chart. | Keep. Align the dollar labels outside the bar, which they already are. |
| Ring LCOH | story-08 | The $718 town bar reads. The colors contradict the map. | Item 1. Long end labels ("needs a benefit fund") collide with the plot edge at 1366; allow `margin.right` of 160 or wrap the verdict under the bar in `text-[1rem] text-ink2`. |
| Exit timeline | story-09 | Four equal cards. | *Judgment:* the year-10 card is the objection. Give it `border-2 border-navy` and leave the others at `border-line`. |
| LCOH vs fuels | Explore | Yes. | Natural-gas bar is `--ink2` on a white card; the end label `$64` must stay outside the bar (`LabelList position="right"` already). Do not move labels inside dark bars. |
| Compare table | compare | Checks, not magnitudes. | Item 10 |
| Print map + bars | print | Cramped but ordered. | Item 11. Town-center label sits on the violet ring in the small map; nudge the label below the circle in the print size only. |

## Consistency

Tokens that already match across story steps: paper ground, kicker, headline clamp, `.card` radius 18px, `.btn`, navy active pill, ember/teal/violet as the three phase hues **when the component calls `ringColor`**.

Breaks:

- `RING_COLOR` in `RingLcoh` inverts phase 1 and phase 2 (item 1).
- Ember means kicker, captured heat, and incumbent fuel (item 2).
- Teal means savings, corridor, lake, outdoor temperature, and the dry-cooler box (items 2 and 3).
- Story is a centered split layout. Explore and Compare are top-aligned dashboards with a smaller headline (`!text-[clamp(2rem,3vw,3rem)]`). That difference is acceptable if Explore is clearly a tool. It is a problem when the LCOH chart style (direct labels, 16px ticks) never appears in the story year chart (15px ticks, no direct labels).
- `story-06-1366.png` footer copy does not match the 1920 story footers. Do not treat the screenshot folder as one build.

## Wow vs. best-in-class

*Judgment.* What would make a reviewer remember a frame:

1. Fix item 1 before anything decorative. A swapped legend is the opposite of wow.
2. Step 4 should be the poster: a Sankey where the thin colored ribbon is the only saturated object, with one sentence in the graphic ("Cooling never depends on this ribbon"). That is the NYT move.
3. Step 2 should be a single annotated bar, not a hero number plus a chart that repeats it badly.
4. A real display face (item 12) is the difference between "well set system fonts" and "this team designed it."
5. Do not add illustrations, gradients, or a second accent. The paper-and-serif system is already more specific than a default shadcn theme. Restraint is the brand. The missing piece is annotation, not decoration.

Closest frames to that bar today: story-07 and story-11. Furthest: story-04, story-06, story-10.

## Component notes

| Component | Rating | Note |
|---|---|---|
| Primary nav | 3/5 | Consistent pill. Crowded at 1366 once "How it works" is present. |
| Story footer buttons | 4/5 | Same `.btn`. Back stays visible on step 1 (disabled). |
| Cards | 4/5 | One shadow, one radius. 18px is slightly soft for this content (item 13). |
| Sliders | 2/5 | Native. Item 15. |
| Segmented controls | 4/5 | `aria-pressed` navy state matches nav. Good. |
| Charts | 3/5 | LCOH horizontal bars are strong. Year, ratio, and Sankey are not. |
| Map | 3/5 | Clear phases, pale water, unlabeled minor dots. |
| Loading | 1/5 | `explore-1366.png`. |
| One-pager | 3/5 | Right content, clipped footer, 84px QR. |
| Dark theme | n/a | Tokens exist in `globals.css`. No screenshot. Not scored. |

## Sources

Visual claims cite repo files captured or read on 2026-10-04, not an external dataset. No product fact (MW, dollars, tonnes) is asserted here as verified; numbers appear only as what a named screenshot displays.

- Screenshots: `web/screenshots/*.png` (timestamps 2026-10-04 12:53–12:55, local).
- Tokens and type: `web/app/globals.css`.
- Ring colors: `web/components/ui.tsx` `ringColor`; `web/components/viz/Charts.tsx` `RING_COLOR`.
- Sankey strokes: `web/components/viz/Sankey.tsx`.
- Ladder truncation and ratio `minWidth`: `web/components/viz/Misc.tsx`.
- Map opacity: `web/components/viz/RingMap.tsx`.
- Impact chip: `web/components/story/steps.tsx`; petal text `web/public/data/site2.json` (`lens` / `petal` "Community").
- Letter clip: `web/components/PrintSheet.tsx` with `.letter` in `globals.css`.
- Loading branch: `web/components/ui.tsx`.
- NYT climate graphics and Stripe are the benchmarks named in the task. No page was fetched for this review, so no quotation from either is claimed. [unverified] as a measured comparison; the gap notes are judgment against that standard.

## Lane status

**Done**

- Skeleton written first, then filled from the PNG set and the components that render it.
- 15 ranked improvements, each with a file or screenshot location and a CSS or Tailwind-level patch.
- Scorecard, what already works, chart table, consistency breaks, wow gap.
- Screenshot gaps called out (dark, `/how/`, Explore at 1366, two capture generations).

**Missing**

- No live browser pass. Spacing in px was not measured with a ruler; sizes are from CSS and from what is readable in the PNG.
- No dark-theme screenshots, so dark contrast and dark chart ink are unscored.
- No `/how/` screenshot, so that route is unscored.
- `explore-1366.png` is a loading frame, so Explore layout below 1920 is unscored.
- Contrast ratios were not computed. Do not treat this file as a WCAG result.
- Hover, focus, and reduced-motion were read in CSS and not seen in a screenshot.

**Open questions**

- Which capture should the team treat as current: the 1920 set (step N of 11, "5-minute path") or `story-06-1366.png` (step 5 of 9, "Show deep dive", "How it works")? The nav source now includes How it works.
- Is the demo machine Windows (Palatino Linotype + Segoe UI) or Mac (Iowan + Helvetica Neue)? Item 12 matters more if the laptop is not the machine this UI was screenshotted on.
- Should the one-pager stay a fixed 11in clip, or is a scrolling screen preview allowed until print CSS locks the page? Item 11 assumes scrolling on screen and clipping only in `@media print`.

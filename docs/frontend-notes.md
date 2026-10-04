# Frontend notes (web/)

Brand: **Thermal Commons**, tagline "Heat for Lansing". Credits string lives in `web/lib/config.ts` (`CREDITS`), shown on the final story step, `/print`, and page metadata. QR target is `PUBLIC_URL` in the same file (placeholder, replace at deploy).

## Run
```
cd web
bun install
bun run test            # vitest, 20 tests on lib/model.ts
bun run build           # prebuild copies the maplibre worker and writes placeholder JSON only if data files are missing/placeholder; output in web/out
node scripts/serve.mjs  # static server on :4173 (or: bunx serve out -l 4173)
CHROME=<path to chrome.exe> node scripts/shots.mjs   # screenshots into web/screenshots/
bash scripts/rebuild.sh # build + serve + screenshots in one go
```
Playwright: the global browsers are revision 1234, so `shots.mjs` takes `CHROME` (path to `chromium-1234/chrome-win64/chrome.exe`) instead of letting the npm package look for its own revision.

## Stack (installed versions, verified 2026-10-04)
next 16.3, react 19.3, tailwindcss 4.3, framer-motion 14, recharts 3.10, maplibre-gl 6.12, qrcode 1.5, vitest 5, typescript 7. Static export (`output: "export"`), data fetched client-side from `/data/*.json` so the Python model can overwrite files after a build.

## Routes
- `/` story mode: 11 steps, hash deep-link `#N`, keys: arrows / Space / PageUp / PageDown, Home/End, `P` speaker notes (with timer), `F` fullscreen, `S` 5-minute path (skips steps 5 and 7). Footer buttons duplicate every key.
- `/explore/` sliders: electricity price, cooling type, corridor sign-up, discount rate, IT load, town-ring toggle.
- `/compare/` Site 2 vs Site 1 toggle + table + why-not text (`why_not_chosen` may be a string or an array).
- `/print/` US Letter one-pager with print CSS and client-generated QR.

## Data handling
- Reads `site2.json`, `site1.json`, `offtakers.json` (array or `{offtakers: []}`). "Illustrative data" badge shows only when a file has `"placeholder": true`.
- Optional fields used when present: `extras.*` (top-level `extras` in site2.json: ring LCOH, funding, cba, with_town, greenhouse_check), `rings[].lcoh_usd_mwh_7pct`, `finance.dc_exit.*`, `impact.ere`, `assumptions.*`.
- Every number in the UI comes from these files. Hardcoded constants are only model physics and UI choices in `lib/model.ts`: eta 0.5, approach 3 K, 30-yr life, COP cap 8, capture temperatures air 30 / liquid 50 C, home-size multipliers (0.7 / 1 / 1.5), default sink temperatures per ring (45 / 55 / 65 C) used only when a ring has no `sink_temp_C`, fuel mix for blended emission factor.
- Explore mode computes a first-principles scenario and scales the data file's headline numbers by scenario/base, so base sliders reproduce the model exactly. Base case = Phases 1-2 (town ring off), matching how the model scopes `totals`.

## Story copy decisions (from coordinator + verification)
- No "36 of 38" claim; Town Board directed attorney to draft ban (Sept 29, 2026), $500,000 in next year's proposed budget for legal costs.
- Gas moratorium since 2015. Deep Green Lansing MI beat in step 1. No EO 62. Federal credits: "may apply if structured to qualify".
- On-site campus framed as proposed, on adjacent affiliate land.
- Step 3/8/11 numbers (homes, hectares, ring LCOH, CBA %) are computed from JSON.

## Known gaps / TODO
- `PUBLIC_URL` is a placeholder.
- MapLibre overlay is tile-free (GeoJSON shapes); inline SVG is always rendered underneath and is what shows if WebGL or the worker fails. Street tiles need internet and are off by default.
- Map geometry (lake outline, corridor route) is approximate and hand-placed.
- No dark-mode validation pass beyond the validated 3-color ring palette (light: #C2410C/#0B8CA6/#7C4DCC, dark: #DB6428/#1E9DB8/#9C7DE6).

## Update 2026-10-04 (priority change)
- Story opens on the ~5-minute path (9 of 11 steps). Key S or the footer button toggles the full deep dive (steps 5 and 7); a deep link like `#5` switches it on.
- New `/how/` page (How it works): pipeline, live COP calculator, LCOH formula, tests (15 Python, 20 web, verified 2026-10-04), honest limits, sources from JSON.
- model.ts fixes from docs/audit/code-review-pr2.md: COP clip [2,6]; tariff fixed at the data value (0.8x propane, never scales with cost); electricity price read from `finance.elec_price_usd_mwh` (number or {industrial,residential}) else `extras.electricity_rates_usd_kwh` industrial else 108, and electricity is re-priced inside opex (counted once); storage uses a 20 K swing; CBA shows the annuitized $/yr; Explore ring table shows share of heat instead of a mismatched COP.
- Compare: COP row uses `cop_compare` (like-for-like, capped at 6); Site 1 text drops the two claims the data contradicts and generates cost/CO2 clauses from numbers.
- `PUBLIC_URL` = https://github.com/harshagarwalnyu/Data-Center-Heat-Reuse (QR on step 11 and /print). No deploy: demo runs locally.
- Console errors: zero at 1366 and 1920 (nav prefetch 404s removed with `prefetch={false}`; favicon added).
- Judge quick start: `cd web && bun install && bun run build && node scripts/serve.mjs`, open http://localhost:4173 (or `bun run dev`).

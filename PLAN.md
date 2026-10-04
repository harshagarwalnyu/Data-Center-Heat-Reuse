# Build Plan: Lansing Heat Reuse

Status: draft 2026-10-03. Facts marked **[verify]** were not checked; check them in Phase 0 before any slide uses them.

## Challenge brief (NYU Hackathon, HDR / Grundfos)

Pick ONE site, justify it for local context, and deliver an evidence-based system proposal: network architecture, heat source, most suitable users, infrastructure, operating approach, environmental and community impact. Must show matching by **temperature, capacity, timing, seasonality, continuity**; protection of **cooling reliability** and **heat continuity**; **quantified value** for the DC, heat users and community; **cost/risk/ownership sharing**.

Judging lenses (every slide maps to one):
| Lens | Items |
|---|---|
| Technical | capture point, temperature, capacity; heat pumps/upgrading; reliability, timing, continuity |
| Economic + delivery | capex/opex; revenue/connection models; ownership, risks, responsibilities |
| Environmental | carbon reduction; energy efficiency; resource optimization |
| Social + regenerative | measurable stakeholder value; equity, public acceptance; local-context fit |

Sites: **Site 1** 111 8th Ave, NYC (commissioned, urban, multi-tenant carrier hotel). **Site 2** Lake Hawkeye / former Cayuga plant, Lansing NY (proposed, TeraWulf). Working pick: Site 2 (new build lets us specify liquid cooling; live community fight makes heat reuse a real answer). Site 1 gets a short comparison table so the choice is justified, not assumed.

## Decisions (user, 2026-10-03)

- **Track:** HDR/Grundfos "Data Center Heat Reuse" challenge. **Site 2 Lansing is the committed proposal**; Site 1 appears as a toggle in the app for comparison only.
- **Hero deliverable:** a deployed web app with a guided **Story mode** (15+ min pitch) and an **Explore mode** (live what-if sliders). Audience = senior corporate reviewers, so it needs big type, one takeaway per screen, plain English.
- **Delivery:** live demo on stage (presenter mode + offline fallback), public URL (Vercel), 2-3 min video walkthrough, printed 1-page leave-behind with QR code.
- **Timeline:** more than a week. **Team:** solo + agents.
- No organizer files on hand; use public versions.

## 12-hour sprint (deadline ~2026-10-04 11:00 ET)

| By | Done |
|---|---|
| +2h (01:00) | Model v1 → outputs/site2.json; organizer digest; deal/risk/stakeholder docs; greenhouse + cooling docs |
| +4h (03:00) | Web app v1 on real model data; story copy pass |
| +6h (05:00) | Red-team pass on numbers; fix contradictions; design-audit (wcag, visual, walkthrough) |
| +8h (07:00) | Polish; /print one-pager; proposal PDF |
| +9h (08:00) | **Freeze.** User deploys to Vercel (needs their login), records 2-3 min video |
| +10-12h | Rehearse, buffer, submit |

Lanes now: in-session subagents (model, web app, organizer digest), Windows Claude CLI (deal/risk/stakeholders, scoped permissions), Cursor ×2 (greenhouse, cooling). agy Windows out of credits; agy WSL Opus out, Gemini left.

## Reality check and reframe (verified 2026-10-03)

| Fact | Source | Consequence |
|---|---|---|
| Lansing Town Board (2026-09-29) told its attorney to draft a local law **banning data centers**; 36/38 speakers opposed; $500k legal reserve | [Ithaca Voice](https://ithacavoice.org/2026/09/lansing-board-data-center-ban/), [FingerLakes1](https://www.fingerlakes1.com/2026/10/02/lansing-moves-toward-data-center-ban-as-terawulf-debate-reaches-turning-point/), [607 News Now](https://607newsnow.com/news/258852-town-of-lansing-moving-forward-with-drafting-a-data-center-ban/) | Pitch = **"the conditions under which Lansing could say yes"**: heat reuse written into a binding Community Benefit + Heat Supply Agreement. Not a green add-on. |
| Current proposal ~**150 MW** (phase 1), not 400 | same | Base case 150 MW (~1 TWh/yr heat at 80% load). 300-400 MW as a build-out scenario. Supply still ≫ local demand. |
| TeraWulf: **sealed closed-loop glycol** cooling, fan (dry) coolers, no consumptive water in operation; DEC renewed 1.008 MGD withdrawal permit Apr 2026 | [Inside Climate News](https://insideclimatenews.org/news/08112025/lansing-new-york-data-center-development/), research/facts-site2.md | Our side-stream HX on the glycol loop fits their design exactly. Water claim = heat that would go to fans/air, plus a covenant to keep the 1 MGD permit unused for cooling. No 1:1 lake-water claim. |
| Town-center anchors (school, town hall, library) are **~5-7 mi** from the site | research/facts-site2.md | Long transmission main. **Bring users to the heat:** a heat-anchored agri/food/rec campus on the ~250 unleased acres comes first. The town-center main only runs if its LCOH passes. |
| NYSEG **gas moratorium** in Lansing since ~2014; many homes on propane/oil (propane $2.85/gal, oil $5.19/gal, Sept 2026) | research/facts-site2.md | The affordability hook: heat for a town that can't get gas. |
| No designated disadvantaged communities nearby (HDR site pack) | resources/text site pack | Equity = rural energy burden + older residents, not EJ status. |
| Deep Green 24 MW heat-reuse DC + BWL is in **Lansing, Michigan** | search results | Precedent only; never conflate with Lansing NY. |

**Organizer guidance applied (research/digest-organizer.md):** no rubric exists; score against the 4 lenses + the 5-axis match (temperature, capacity, timing, seasonality, continuity) + HDR's 7 domains. Hot loop base 55-65 °C (organizer 4G target; 70 °C is a sensitivity). COP bounded 2-6. Heat recovery fraction reported as a range (0.4-0.85). Greenhouse benchmark ~1 MWth/ha, ~2 acres per DC MW (RII). Distance >2 km rated "poor" (CBS), which backs the conditional town ring. DCs rarely contract past 10 yr, so the HSA uses a 10-yr term + renewals + step-in. The land for the on-site ring is unverified (HDR frames ~46 acres; 434-acre site, 183 leased); being checked.

**Revised concept (three rings):**
1. **On-site ring (Phase 1):** greenhouse + aquaculture + food processing + community rec center/pool on the unleased acreage. Year-round sink, local jobs, and a nutrients story for HDR (phosphorus-impaired Cayuga Lake: closed-loop aquaponics captures nutrients instead of runoff).
2. **Corridor ring (Phase 2):** homes and farms along the route to the town center on an ambient loop, gated by sign-up density.
3. **Town-center ring (Phase 3, conditional):** school campus + town buildings via a transmission main, only if LCOH beats propane/oil by the target margin.

## Product: the web app

Python model (`src/heatreuse`) → JSON/CSV in `outputs/` → export script → `web/public/data/` → Next.js app (TS, Tailwind, shadcn/ui, MapLibre, charts, Framer Motion; bun; static export so it runs offline).

Story mode steps: the fight → the insight (supply ≫ demand) → site map → heat-flow Sankey → temperature ladder → seasonality (winter/summer week) → "your household savings" calculator → who pays / ownership → "what if the data center leaves" → carbon and water → the ask.
Explore mode: sliders for electricity price, air vs liquid cooling (COP), uptake %, discount rate, DC load. Headline numbers recompute client-side.
Specs come from `research/ux-for-executives.md`, `docs/frontend-spec.md`, `docs/design-system.md`.
Skill gates: `frontend` + `dataviz` while building; `design-audit` (nielsen, wcag, visual, walkthrough) before freeze; `plan-review` on the spec; `council` (attack-defend) on the pitch; `code-review` + `verification-before-completion` before each push.

## Agent lanes (2026-10-03)

| Lane | Tool | Owns (write only these) |
|---|---|---|
| C01-C20 | Cursor `grok-4.7-xhigh-fast`, queue of 4 concurrent | research/, docs/, scoring/finance/impact/gis modules, offtakers.csv (one file set per task) |
| C21-C23 | Cursor, queue of 1 | UX research, frontend spec, design system |
| B | agy WSL `claude-opus-4-6-thinking` | `research/facts-site2.md` |
| C | agy Windows `claude-opus-4-6-thinking` | `research/facts-site1.md`, `research/site-selection.md` |
| C30 | Cursor, batch 3 (first) | engineering model: `pyproject.toml`, `config/engineering.yaml`, `src/heatreuse/{__init__,supply,demand,heatpump,storage,dispatch}.py`, tests |
| C24-C29 | Cursor, batch 3 | organizer-doc digests (HDR, Grundfos, DATA HEAT, iGRID, white papers, NYS) |
| C31 | Cursor, batch 3 (last) | `web/` frontend build + `scripts/export_web_data.py` |

Claude CLI lanes are unavailable (user, 2026-10-03), so all build work goes to Cursor and agy. After C30 lands, rerun C07 finance + C10 impact against real engineering outputs (they start on placeholders).

Rules for every lane: write the output file skeleton first and append as you go; no git commits; never touch another lane's files; every fact carries source URL + `(verified 2026-10-03)`; unverifiable = `[unverified]`.

## 0. Frame (Karpathy gate)

**Problem.** Design a community heat-reuse system for TeraWulf's planned ~400 MW campus at the former Cayuga plant site (Lansing, NY), plus an ownership model, a financial case and a risk allocation that a skeptical town would accept.

**Hard constraints**
- Data center cooling never depends on offtakers. Heat recovery is a sidestream only.
- Every number traces to a source or a stated assumption in `assumptions.yaml`.
- Heat price must beat what Lansing households pay today, per delivered kWh, after heat pump electricity.

**Soft preferences**
- Demand-side design (start from who needs heat), not supply-side.
- Reuse the config-driven scoring engine pattern from earlier work.

**Success criteria (measurable)**
1. 8,760-hour model runs end to end from one config; outputs annual heat delivered, HP electricity, backup fuel, unmet hours (target: 0 unmet hours with backup).
2. Levelized cost of heat (LCOH) with a sensitivity tornado on the top 5 drivers.
3. Ranked offtaker list with map, at least 10 candidates scored.
4. CO2 avoided (t/yr) and water impact (gal/yr) with method shown.
5. Risk matrix: every risk has an owner, a mitigation and a residual rating.
6. Deck that answers "what if the data center shuts down?" before Q&A does.

**Open unknowns (need from team):** hackathon length, judging rubric, deliverable format (deck only, or deck + notebook + report), team size and names.

## 1. Pushback on the source pitch (fix before building)

1. **The water argument is weaker than it reads.** The design keeps dry coolers as the primary rejection path, so in that design the lake isn't the heat sink. And heat demand peaks in winter, which is when cooling water use is already lowest. Summer, when the lake draw matters most, is when heat reuse displaces the least. Honest framing: heat reuse cuts winter rejection load. The water win comes from the cooling design (closed-loop / dry coolers), and that's a separate recommendation. Quantify both. Never claim "every MW delivered = MW not dumped in the lake" unless the base case is lake cooling. **[verify TeraWulf's actual cooling design and permit request]**
2. **The ambient loop for dispersed housing is the riskiest economic bet.** 5th-gen pipe is cheap per metre, but rural Lansing has low linear heat density (MWh per trench-metre per year). Gate the residential loop on density: model it as an option serving only clusters above a threshold (start at ~1.5 MWh/m/yr, tune it), not the whole town.
3. **COP numbers.** The 0.5 × Carnot rule is fine as a screen. Add exchanger approach temperatures (about 3-5 K per HX) or COP will be overstated. Show the 30°C vs 50°C source comparison as a range, not a point.
4. **3.5 TWh/yr** assumes 400 MW IT load at 100% utilization for every hour. Use a phased ramp plus a load factor (0.7-0.9). The conclusion holds either way; the number should be defensible.
5. **Policy hooks are volatile.** NY UTENJA (2022), NYSERDA programs and federal credits (25C/25D/48 changed in 2025) all need checking against current sources. **[verify all]**
6. **Project status itself.** Lawsuits, DEC permit and county positions move fast. Re-verify the week of submission.

## 2. Phase 0: fact base (first 2-3 h, everyone)

Output: `research/facts.md`, one row per claim: claim, value, source URL, date checked.

| Claim | Owner |
|---|---|
| Site: acreage leased/developed, MW phases, timeline | Story |
| Cooling design + DEC water permit request (gal/day) | Eng |
| Seneca/Tompkins positions, lawsuit status | Story |
| Lansing households, heating fuel mix (ACS B25040), utility (NYSEG?) | Data |
| Local prices: propane, heating oil, NYSEG gas + electric $/kWh (NYSERDA / EIA weekly) | Finance |
| UTENJA status and any NYSEG thermal pilot | Finance |
| NYSERDA incentives, current federal credit status | Finance |
| Candidate anchors: school district campus, town facilities, farms/greenhouses, Cornell-adjacent loads | Data |
| Grid emission factor (NYISO zone C / eGRID NYUP) | Eng |

## 3. Repo layout

```
assumptions.yaml        # single source for every input (prices, COP params, costs, emission factors)
data/raw/               # gitignored downloads (ResStock, ComStock, TMY, parcels)
data/processed/         # small committed CSVs
src/heatreuse/
  supply.py             # DC heat available per hour (ramp, load factor, IT->heat)
  demand.py             # hourly loads per offtaker from ResStock/ComStock + scaling
  heatpump.py           # COP(T_source, T_sink, approach) and electricity draw
  storage.py            # tank state of charge, charge/discharge rules
  dispatch.py           # 8,760 loop: supply -> HP -> storage -> demand -> backup
  finance.py            # capex, opex, LCOH, NPV, tariff vs incumbent fuels
  impact.py             # CO2 and water accounting
  scoring.py            # config-driven offtaker scoring
notebooks/              # thin: call src, make charts
tests/                  # energy balance, COP bounds, LCOH hand-check
deck/
```
Stack: Python + uv, pandas, numpy, geopandas, matplotlib/plotly, pytest.

## 4. Workstreams

### 4.1 Engineering: hourly model (critical path, start first)

1. **v0 annual average (by hour 4).** Spreadsheet-level math in `dispatch.py`: annual demand per anchor, average COP, annual HP kWh. Unblocks Finance immediately.
2. **Weather.** TMY3/TMYx for Ithaca (Tompkins Co. airport) from NREL/Climate.OneBuilding. Hourly dry-bulb.
3. **Supply.** `heat_th(t) = IT_load(t) × capture_fraction`. Capture fraction ~0.7-0.8 for DLC (rest is air-side). Phases: 2027-2030 ramp. **[verify]**
4. **Heat pump.** `COP = η × T_sink / (T_sink − T_source)` in K, η 0.45-0.55, with HX approach added to the lift. Sinks: 70°C anchor loop; ambient loop is near source temp, so central HP is off and building HPs (water-to-water, COP ~4-5) do the lift.
5. **Storage.** Hot water tanks sized for 4-12 h of anchor peak. Optional stretch: borehole seasonal store, shown as scenario only.
6. **Dispatch rules.** Serve demand from HP, charge storage when surplus, discharge on shortfall, backup boiler covers the rest. Log unmet hours.
7. **Outputs.** Peak winter week plot, summer week plot, annual load duration curve, sizing table (HP MW_th, tank m³, pipe DN).
8. **Tests.** Energy balance closes every hour within 0.1%; COP within [2, 10]; zero negative storage.

### 4.2 Data / GIS: offtakers and loads

1. **Buildings.** Tompkins County parcel GIS + Microsoft/OSM building footprints within 5 mi of the site. Classify by land use code.
2. **Loads.** ResStock (residential) and ComStock (commercial) county-level hourly end-use profiles for Tompkins, matched by building type. Scale by floor area.
3. **Scoring engine** (config weights in `assumptions.yaml`):
   - temperature need (low-temp friendly scores higher)
   - annual MWh and peak MW
   - trench distance to nearest loop → $ connection cost
   - incumbent fuel (propane/oil > gas > electric resistance > heat pump)
   - community value (school, low-income housing, public building)
   - linear heat density for clusters
4. **Outputs.** Ranked table, map with anchor loop and ambient cluster routes, sensitivity of the ranking to the weights.
5. **Greenhouse/aquaculture concept** on unused site acreage: size it to soak summer surplus. Use published greenhouse heat intensity for the climate zone, cited.

### 4.3 Finance: LCOH, tariff, deal

1. **Capex lines.** Plate HX, central HP ($/kW_th), building HPs, pipe $/m (insulated vs uninsulated HDPE, rural trench), tanks, backup, soft costs plus contingency. Cite each unit cost (NREL, Danish Energy Agency technology catalogue, recent NY projects).
2. **Opex.** HP electricity at hourly COP × NYSEG rate, O&M % of capex, heat purchase (near zero).
3. **LCOH** over 30 years at 2-3 discount rates (muni/co-op vs utility vs private). Compare $/MWh delivered vs propane, oil, gas and resistive electric, each at appliance efficiency.
4. **Tariff design.** Fixed discount vs incumbent (e.g. 20% under the propane-equivalent), with a low-income tier.
5. **Incentives** layered as a separate scenario so the base case stands without them.
6. **Sensitivity tornado.** Pipe cost, electricity price, COP, uptake rate, discount rate, DC load factor.
7. **Shutdown scenario.** If the DC exits in year N: anchor loop falls back to backup boilers or an air-source/lake-source HP; stranded-asset exposure in $ and who carries it.

### 4.4 Story / community: stakeholders, risk, impact

1. **Stakeholder map.** Residents, Town of Lansing, Tompkins and Seneca counties, school district, NYSEG, DEC, NYSERDA, TeraWulf, environmental plaintiffs, Cornell. Power/interest grid with what each wants and fears.
2. **Risk matrix.** Likelihood × impact, owner = whoever controls it:
   - DC uptime → TeraWulf
   - network/backup → thermal utility
   - DC exit/tenant change → heat supply agreement with step-in, decommissioning reserve fund
   - low uptake → anchor-first phasing, ambient loop only after sign-ups hit threshold
   - price/electricity → indexed tariff with cap
   - regulatory/permit → PSC/UTENJA pathway
3. **Impact.** CO2: displaced fuel × emission factor minus HP electricity × grid factor. Water: winter rejection load avoided, plus the cooling-design recommendation shown separately (see §1.1).
4. **Equity.** Share of benefit going to propane/oil and low-income households.
5. **Deck** (target 12-15 slides): hook (the fight) → insight (supply unlimited, demand is the constraint) → design → COP slide → hourly matching → map → economics → ownership → risk/exit → impact → ask.

## 5. Schedule (assumes ~48 h; rescale once length known)

| Block | Eng | Data | Finance | Story |
|---|---|---|---|---|
| H0-3 | Facts, TMY | Facts, parcels | Prices, policy | Site status |
| H3-8 | v0 annual model | Loads mapping | Capex sheet on v0 | Stakeholder map |
| H8-20 | Hourly dispatch | Scoring + map | LCOH v1 | Risk matrix v1 |
| H20-30 | Storage, sizing, tests | Cluster density gate | Sensitivity, shutdown | Impact calc, deck skeleton |
| H30-40 | Freeze numbers | Final map | Freeze LCOH | Deck build |
| H40-48 | Q&A prep, rehearsal, buffer | | | |

**Number freeze at H30.** After that, only bug fixes. Every slide number gets regenerated from `assumptions.yaml` with one command.

## 6. Interfaces (to avoid blocking)

- Data → Eng: `data/processed/offtakers.csv` (id, type, lat, lon, annual_MWh, peak_MW, supply_temp_C, fuel).
- Eng → Finance: `outputs/annual_summary.json` (heat_MWh, hp_elec_MWh, backup_MWh, peak_MW, tank_m3).
- Eng/Finance → Story: `outputs/charts/*.png` plus `outputs/headline_numbers.json`.

## 7. Q&A prep (answer before asked)

- DC shuts down or moves to a new tenant?
- Who pays if uptake is low?
- Why not just have TeraWulf fix the water draw?
- Is this a bitcoin/AI subsidy?
- Why not air-source heat pumps in every house instead? (Show the comparison: lower COP in cold snaps, peak grid impact.)
- How does Lansing's grid handle the added HP load?

# Organizer digest (HDR / Grundfos heat-reuse hackathon)

Built 2026-10-03 from resources/text/*.txt. Page refs = PDF page (or slide) numbers in the text dumps. "[IMG]" = image/map-only content, viewed by rendering where noted, otherwise unreadable.

## 1. What the organizers want (challenge brief + opening slides)

Source: NYU_Hackathon_Data_Center_Heat_Reuse_Challenge_R1.docx (no page numbers, single doc); opening slides (slide n).

- Challenge text: "technically feasible, economically viable and community-centered system that captures, upgrades and delivers data-center heat to the community most suitable users." Must "share costs, risks and responsibilities across stakeholders". (Challenge R1; slide 10)
- Deliverable: concise evidence-based proposal with: network architecture, heat source + most suitable users, required infrastructure, operating approach, environmental + community impact. Select ONE setting and justify why it fits local context. (R1)
- Must demonstrate: supply/demand matched by **temperature, capacity, timing, seasonality, continuity**; how **cooling reliability** and **continuity of heat supply** are protected; **quantified measurable value** for DC, heat users, community; how **costs, risks, ownership, responsibilities** are shared. (R1)
- Slide 10 four verbs: CAPTURE (define heat source) / UPGRADE + DELIVER (equipment + interfaces) / PROTECT RELIABILITY (cooling and heat continuity) / CREATE VALUE (quantify benefits and responsibilities).
- Slide 11: Site 2 design focus = "Plan heat pumps and a new network for hot water and space heating." Key tradeoff = "Build a feasible network with affordability and community acceptance." "Both sites need justified heat users, dependable delivery and backup heat."
- Site 2 "Consider" list (R1): identify + justify most suitable offtakers; match by temp/capacity/timing/seasonality/continuity; **domestic hot water, building heating and community facilities**; **heat-pump needs, distribution and backup heat**; **affordability, community acceptance, continuity of heat supply**.
- Site 1 "Consider" list (R1): offtakers; matching; heat upgrading/distribution/building interfaces; backup heat without compromising DC cooling reliability; costs/risks/ownership.
- Challenge track title: "Regenerative Design Data Centers" (R1). Resources promised to students include "HDR regenerative design framework materials", public GIS/data-source list, OCP heat re-use whitepaper (R1); of these only the site data packs were provided to us.
- Slides 7-8 hooks: "As much as 98% of the energy used by data centers converts to heat [Alfa Laval]"; "~95-100% of energy supplied into a Data Center becomes heat; Up to 85% is recoverable!" Slide 12: "Its only waste heat if we choose to waste it. REUSE IT! DON'T LOOSE IT!" Slide 9: "NY Leading in the right way: Heat Reuse" (image only).
- Slide 5-6 market context: 373 GW active+construction+pipeline (71 active, 22 under construction, 280 pipeline); $3T+ AI investment by 2030 (slide 6). Mobile traffic 72 EB/mo (2021) -> >220 EB/mo (Q2 2026) (slide 5).
- Slides 2-4 (support team, Grundfos intro) image-only / unreadable.

### Judge scorecard (derived checklist from the four R1 lenses; NO numeric rubric or weights exist in any organizer doc)

TECHNICAL
- [ ] Capture point named (e.g. D2C CDU secondary return) with temp (F/C) and MW(th).
- [ ] Heat pump / upgrading stage sized, COP shown, source+sink temps stated.
- [ ] Supply-demand match table across the FIVE axes: temperature, capacity, timing (daily), seasonality, continuity.
- [ ] Cooling reliability protected: DC rejects heat independently (dry coolers stay primary); heat export is a sidestream; no DC dependency on offtakers.
- [ ] Heat-supply continuity: backup heat (boiler / HP / thermal storage) and what happens if DC load drops or shuts.
- [ ] Interfaces: building HX / DHW / space-heating temperature levels.

SITE 2 SPECIFIC
- [ ] Offtakers include domestic hot water + building heating + community facilities.
- [ ] Heat pump needs, distribution and backup explicit.
- [ ] Affordability (vs propane/oil/electric) and community acceptance addressed explicitly.

ECONOMIC + DELIVERY
- [ ] Capex and opex; revenue / connection models; ownership structure; risk register with owners.
- [ ] Costs, risks and responsibilities split across DC / utility / community / offtakers.

ENVIRONMENTAL
- [ ] Carbon reduction (t CO2e/yr, method); energy efficiency (use HDR's own metrics ERF / ERE); resource optimization (water, land, nutrients).

SOCIAL + REGENERATIVE
- [ ] Measurable stakeholder value (per household $, jobs, tax base).
- [ ] Equity + public acceptance; local-context fit (use site-pack indicators in 1.2).
- [ ] Regenerative framing: net-positive across HUMAN HEALTH, COMMUNITY, AIR, CARBON, WATER, BIODIVERSITY, NUTRIENTS (site pack p5).

HDR-FLAVOURED EXTRAS (cheap, HDR cares)
- [ ] ERE/ERF computed for our case.
- [ ] Water-energy nexus line (WUE; closed-loop zero evaporation = "ZERO Water Use" category, HDR p55).
- [ ] Thermal Energy Network with source+sink balancing (borefield, wastewater recovery) (HDR p47).
- [ ] Industrial symbiosis framing (HDR p44).

### 1.1 HDR resource deck (NYU_BAC_Hackathon_HDR_Waste_Heat_Reuse_2026.1002, 69 pp, updated 10/02/2026)

Mostly orientation. Usable items:
- Metrics: PUE 1.1<PUE<1.4 hyperscale, PUE<1.5 colocation (Uptime); industry avg site-WUE 1.8 L/kWh (p15). ERE = (Total facility energy - Reuse energy)/IT energy; ERF = Reuse energy/IT energy; CUE = facility carbon/IT energy (p17-18). Worked example p18: IT 1000 kWh, facility 1300 (PUE 1.3), 200 kWh reused -> ERE 1.1. (Deck's p17 text says "ERE always >= 1.0"; fine.)
- HDR "new holistic metrics" (concept only): DCRE, WUI (Water Usage Impact), WS (Water Stress), EUI, ITWC (p19-25) [IMG, definitions not in text].
- Cooling taxonomy: air (CRAC/CRAH, HAC/CAC, in-row, RDHx up to 60 kW/rack p33); single-phase D2C with CDU (p34); immersion single/two-phase (p35); two-phase D2C needs 4-9x less fluid flow than single-phase water, >2000 W/chip (p36).
- Water: evaporative cooling 0.4-0.6 gal/kWh (the slide's own parenthetical says L/kWh; inconsistent) (p53); US power-generation consumptive ~2 gal/kWh, withdrawn ~12 gal/kWh (p53). Cooling tower split: evaporation 67%, blowdown 32%, drift <1% (p56). p55 water-use spectrum lists "Closed-Loop Zero Evaporation" and "Data Center Heat Export" among ZERO-water items (read from layout).
- Heat export / TEN (p41,47): Equinix Heat Export program (p41). HDR p47: TENs let "numerous buildings ... be both the 'source' and the 'sink'", with "centralized Geothermal/GeoExchange borefield, Wastewater Energy Recovery, and centralized heat pump chillers"; "a constant source of thermal waste during all hours".
- p42 temperature ladder (rendered, deg F, approximate from chart): immersion liquid return ~120-155F; D2C return ~100-115F; cooling-tower return ~85-95F; chiller CHWS 36-44F; air-cooled HP HWS standard ~120-155F, "Empire Tech" (high-temp) ~140-175F; water-cooled HP HWS standard ~120-155F, Empire Tech ~155-175F; condensing gas boiler HWS ~120-190F; AHU coil HWS ~120-175F; radiant heating HWS ~85-115F; GeoExchange heating supply ~44-54F, cooling supply ~54-68F. Use as the temperature-ladder visual: D2C return (100-115F = 38-46C) lifted to AHU/radiant via HP.
- p60-61 fuel-cell CHP + absorption chiller (725F exhaust; 86.5% total efficiency Seattle example): irrelevant to our scheme.
- p68-69 hyperscaler goals (e.g. Microsoft carbon negative by 2030): context.
- Unreadable / image-only: p4-7, 22-27, 38-40, 43-46, 48-51, 57-59, 62-66.
- NO regenerative KPI list or scoring rubric inside this deck. HDR's regenerative KPIs = the site data packs.

### 1.2 Site data packs (HDR "Regenerative Design Site Data", 39 pp each)

Framework (both packs, p2-7): Regenerative design "emulates natural systems for the continuous renewal of social and ecological functions" (p2). Spectrum DEGENERATIVE (net harmful) -> REGENERATIVE (net positive) across Community / Ecology / Health (p4). Seven domains (p5): HUMAN HEALTH, COMMUNITY, AIR, CARBON, WATER, BIODIVERSITY, NUTRIENTS. Action list: eliminate GHG; sequester more carbon in materials than emitted; better serve community; equity of access to design process; re-establish biodiversity; improve human health; conserve community water; maintain water quality; manage stormwater; avoid soil contamination; protect species at risk (p5). Service lines (p6): Resiliency, Ecosystem Restoration, Net Zero Buildings, Campus Decarbonization, Renewables, Waste, Air Quality, Water Quality, Post-occupancy Evaluation & Measurement, Sustainable Value Assessment, Energy Efficiency Modeling. The metrics are percentile-based place indicators ("Place Profile Review", p7).

**Site 2 Lake Hawkeye pack (Lansing NY), every number with page:**

| Indicator | Value | Page |
|---|---|---|
| Coordinates | 42.602456, -76.633433 | 9 [IMG render] |
| HDR tool inputs | site area 2,000,000 SF (~45.9 ac), impervious 100,000 SF, building footprint 400,000 SF, 50 FTE occupants, typology "Laboratory", lifecycle 50 yr, occupation 2030, pop density 88/sq mi, transect T2 Rural | 9 [IMG render] |
| Biodiversity | cumulative threat low; agriculture = greatest threat | 11-12 |
| Noise | 41.9 dB sustained vs 40.6 at ecological baseline (Taughannock Falls SP) | 10, 13 |
| Mental health | 27th percentile | 14 |
| Water risk | baseline stress, drought, groundwater decline all Low-Medium | 15-17 |
| Direct discharge to water | 44th percentile; runoff reaches Cayuga Lake | 18 |
| Impaired waterways | 2 downstream (Cayuga Lake + an inlet); lake impaired with **phosphorus** | 19 |
| Flood | FEMA maps "oddly drop off", more investigation needed; no apparent risk | 20 |
| Precipitation | +3 in within 10 years | 21 |
| FEMA NRI | biggest risk tornado; 1st percentile nationally | 22 |
| Social vulnerability | population "easily able to avoid and or bounce back" | 23 |
| Carbon intensity | nearby plant rates not listed; **no disadvantaged communities nearby** | 24 |
| Carbon lifecycle | cumulative ~260k t by ~2080; 2030 annual ~24k t: embodied materials ~62%, electric ~21%, non-electric ~16% (approximate, read from render) | 25 [IMG] |
| Temperature | +3F by 2050, up to 69 days >90F vs 19 today; +12F by 2080 | 26-27 |
| Air quality | 0% of days worse than "Good" (10-yr and 5-yr) | 28-29 |
| NY air-quality burden | >1,900 early deaths, $5.6B | 30 |
| Ozone / PM2.5 | 20th / 4th percentile | 31-32 |
| Asthma / heart disease / stroke | 51st / 42nd / 34th pct | 33-35 |
| Cancer | high/very high across lake (90th pct), older population | 36, 39 |
| Minority / below poverty / age 65+ | 24th / 28th / 56th percentile | 37-39 |

**Site 1 (111 8th Ave) pack:** noise 56 dB vs 43.9 baseline (13); water stress Low-Med, groundwater decline Medium (15-17); direct discharge 79th pct to Hudson (18); Hudson impaired IR 5 (dioxins, mercury, pesticides, PCBs) (19); 500-yr floodplain one block away (20); precip +5 in in 5 yr (21); NRI 1st pct, hurricane top risk (22); social vulnerability 79th pct (23); nearby cogen plants 654 lb CO2/MWh, one next to a disadvantaged community (24); air: 5% (10-yr) / 10% (5-yr) days worse than Good, "getting worse" (28-29); ozone 37th pct (83rd block west), PM2.5 52nd (92nd block west), suspected diesel backup gens/combustion (31-32); asthma/heart/stroke very low, cancer low (33-36); minority 49th (79th west), poverty 43rd (83rd west), 65+ 42nd (37-39).

**Implication for Lansing:** HDR will read the regenerative KPIs where Lansing has real hooks: phosphorus-impaired Cayuga Lake (nutrients -> closed-loop aquaponics/greenhouse), +3F / 69 hot days by 2050 (resilience), very quiet baseline (41.9 dB; fan coolers matter), agriculture the top biodiversity threat (heat-fed controlled-environment agriculture), older rural population, no EJ-designated community (equity = energy burden/age, not EJ status).


## 2. Engineering parameters

Docs: **T5** = Topic_5 Heat reuse, Connecting DC to DE systems_v5 (slides + speaker notes; slide n). **AG** = Grundfos District Energy Application Guide 2018 (PDF page n of 29; printed page numbers are about 2x that). **OCP** = Data Centers Heat Reuse 101 (OCP/Alfa Laval/Cloud&Heat/NREL, 2023; page n). **HDR** = HDR deck. Checked against the text dumps 2026-10-03.

### 2.1 Capture temperatures by cooling type

| Parameter | Value | Doc | Page |
|---|---|---|---|
| Air cooling heat quality | low grade ~25-35 C | T5 | s14 |
| Liquid cooling | ~35-60 C | T5 | s14 |
| Immersion | potentially higher and more stable, >60 C | T5 | s14 |
| Air-cooled return water | 27-28 C (vs 45-65 C with direct liquid) | OCP | p6 |
| Fig 3 operating ranges | air ~15-28 C; rear-door HX ~28-40 C; cold plate and immersion ~40-65 C | OCP | p6 (figure labels 15C/28C/40C/65C) |
| Direct liquid cooling return | 45-65 C ("higher heat quality") | OCP | p6 |
| D2C return (HDR ladder) | ~100-115 F (38-46 C) | HDR | p42 (rendered, approx) |
| Immersion liquid return (HDR ladder) | ~120-155 F (49-68 C) | HDR | p42 (rendered, approx) |
| Cooling-tower return | ~85-95 F (29-35 C) | HDR | p42 (rendered, approx) |
| Danish hyperscaler case, DC side | 30 C supply / 15 C return | T5 | s41 |
| UK campus case evaporator | 25 -> 16 C | T5 | s40 |
| Share of energy that becomes heat | ~95-100%; up to 85% recoverable; "as much as 98%" | T5 s11; opening deck s7-8 | |
| Rack density trend | 10 -> 150 -> 250 -> 600 -> >1,500 kW/rack | T5 | s8 |

### 2.2 Network supply/return temperatures by generation

| Parameter | Value | Doc | Page |
|---|---|---|---|
| 1G steam | up to ~200 C, 1880-1930 | T5 | s19 notes |
| 2G | pressurized water >100 C (AG: >120 C), 1930-1980 | T5 s19; AG p5 | |
| 3G | <100 C (AG: <120 C); typical flow ~80 C, return ~40 C | T5 s19; AG p5 | |
| 4G | ultra-low flow 50-60 C (T5); AG: 55 C in newest low-temp systems | T5 s19; AG p14 | |
| Contemporary DH | 75/35 C flow/return; low-temp 60/30 or 55/25 C | AG | p4 |
| DH flow range | 55 C (newest) to 80-90 C+ | AG | p14 |
| Weather compensation example | -20 C outdoor = 75 C flow; +10 C outdoor = 61 C flow | AG | p12-13 |
| 5G ambient loop | 20-40 C shared loop; buildings use local HPs; simultaneous heat/cool | T5 | s33 notes |
| District cooling | flow ~10 C / return ~20 C contemporary; older 4/12 C; flow 4-10 C | AG | p4, p14 |
| Indirect connection penalty | needs flow ~10 C higher and return ~10 C higher than direct | AG | p7 |
| Direct connection limit | max ~6 bar; moderate hills / low buildings only | AG | p7 |
| HX temperature adjustment | up to 20% heating saving by tempering supply at the building HX | AG | p8 |

### 2.3 Heat pump configurations, COP, case results

| Parameter | Value | Doc | Page |
|---|---|---|---|
| HP COP range | 2-5 typical; "no heat reuse project without heat pumps" (speaker note) | T5 | s26, s28 |
| HP principle | most delivered heat comes from the source, not the electricity | T5 | s25 |
| HP types | air-air, air-water, water-water (large-scale DH) | T5 | s24 |
| Five reuse configurations | Ambient / Centralised / Hybrid ambient+centralised / Chip heating / Indirect | T5 | s32 |
| Ambient | 20-40 C loop, distributed HPs; "ideal for 5th generation" | T5 | s33 notes |
| Centralised | transport to central plant, large HPs lift to DH temp; easier control, economies of scale | T5 | s34 notes |
| Hybrid | part on ambient loop, part boosted centrally; "most adaptable solution" | T5 | s35 notes |
| Chip heating | higher temps, needs advanced cooling and integration | T5 | s36 notes |
| Indirect | intermediate loop/HX for separation; easy retrofit | T5 | s37 notes |
| UK university case | evaporator 25-16 C, condenser 60-75 C, COP 2.95, 300 kW HP, 86% pump efficiency, campus peak ~11,000 kW, shunt pump + booster injection | T5 | s40 |
| Hoeje Taastrup (DK) case | DC 30/15 C, HX + large HP + 33,000 MWh pit storage; 6,000 homes, 310 GWh network demand, 25% from DC | T5 | s41 |
| HDR HP tiers (ladder) | standard water-cooled HP HWS ~120-155 F; high-temp "Empire Tech" ~155-175 F | HDR | p42 (approx) |
| HP bridge | "Heat pumps may be a necessary link in order to raise the temperature" | AG | p28 |
| Delta-T and flow | +1.5 C delta-T -> ~20% less flow | AG | p13 |

### 2.4 Pumps, hydraulics, substations, storage, economics rules

| Parameter | Value | Doc | Page |
|---|---|---|---|
| Design pressure loss | ~100 Pa per metre of pipe | AG | p15 |
| Diversity | main sized below sum of peaks; factors as low as 0.65, "calculate with caution" | AG | p15 |
| Affinity laws | flow -50% -> head 25% -> power 12.5% | AG | p14 |
| Delta-T vs pumping | +2.7 C delta-T cuts needed differential pressure 2.2x; +1 C (cooling) / +3 C (heating) cuts hydraulic power 27% | AG | p15 |
| Tariff lever | incentive/penalty on high return temperature | AG | p12 |
| Return-temp policing | in some DC systems the operator may shut a consumer off if agreed return temp is missed | AG | p16 |
| Heat exchangers | brazed PHE max ~2 MW (no repair); gasketed 30-50 MW (openable) | AG | p8 |
| Pipe | twin pipe, PE casing, PE foam, leak-detection wires, steel/copper/PEX | AG | p6 |
| Temperature optimization software | cuts network heat loss typically 10%, up to 2% of heat cost | AG | p16 |
| Hot-water storage tank | N2/steam blanket, stratified, diffusers | AG | p23 |
| Pit storage | lifts solar share to ~50% of annual demand; summer demand ~25% of winter peak | AG | p24 |
| Aquifer + HP case (Grundfos Bjerringbro 2013) | surplus heat piped 750 m to aquifer; ~80% of summer-stored heat still available in autumn; HP lifts to DH temp; capex EUR 4.7M split 50/50; saves EUR 0.4M/yr; payback 12-13 yr; 3,700 t CO2/yr; up to 90% less cooling-tower power | AG | p25 |
| Cost split rule | extraction costs split DC + host; transformation costs (storage, lift, heat-to-cool) paid by host | OCP | p7-8 |
| Price rule | heat must be cheaper than host's alternative (gas, electricity, air-source HP); best case free | OCP | p7 |
| DC reliability for host | uptime >99.8%/yr = max ~20 h downtime | OCP | p7 |
| DC keeps redundant cooling | "almost always" if host fails | OCP | p7 |
| Capex vs opex | heat reuse "rarely reduce the investment costs but the operational costs" | OCP | p7 |
| Ideal host | 24/7 consistent: water pre-heat, laundries, ethanol, F&B, breweries, hospitals, desalination, pharma | OCP | p8 |
| Seasonal hosts | DH, biomass drying, greenhouses, fish farming | OCP | p9 |
| Low-density area hosts | pools, hospitals/hotels, wastewater treatment, agriculture, biomass drying, greenhouses, aquifer storage, ethanol, lake/river fish farming | OCP | p9 (Table 1) |
| CO2 credit | goes to the heat host (avoided alternative); DC only by agreement | OCP | p9-10 |
| Water | heat reuse reduces chiller/cooling-tower evaporation; avoided water counts as positive | OCP | p10 |
| Pushback | $150B of projects blocked/delayed in 2025 by local opposition | T5 | s7 |
| Carbon claim | each MWth recovered avoids ~1,770 t CO2/yr (notes: "1,700+") | T5 | s15 |
| ROI claim | typically 1.5-4.0 years; site specific | T5 | s15 |
| DC revenue | up to EUR 1M/yr in cases | T5 | s38 |
| Regulation | 10-20% heat-reuse requirements by 2026-2028 (Europe) | T5 | s38 |
| Waste-heat potential | ~10% of DH heat demand; >10 Mt CO2/yr avoided in Europe | T5 | s38 |
| Fossil share of DH | ~90% (IEA) | T5 | s18 |

CAUTION: T5's "~1,770 t CO2 per MWth per year" is an unqualified vendor claim (implies ~0.2 t/MWh fossil displacement over 8,760 h); our carbon method should use explicit NY factors. The 1.5-4 yr ROI is from the same slide with no basis; the only costed case in the organizer pack (Bjerringbro) is 12-13 yr.

## 3. Greenhouses: Colocating Data Centers & Greenhouses (RII / GO Virginia, June 2025; "GH" = PDF page)

| Item | Value | Page |
|---|---|---|
| Core finding | colocating a DC with ONE greenhouse "is not functional due to a significant mismatch of heatloads"; works with multiple large greenhouses + complementary industry ("Farm Park") | 3 |
| Mismatch quote | "If you put a 10-hectare greenhouse next to it, then we need 10 megawatts. They have 50, so from the 50, we only use 10." (30-50 MW DC) | 7 |
| Heat intensity | ~1 MWth per hectare (10 MW per 10 ha, expert quote); a 326 MW Virginia DC could heat 673 acres = ~2 acres per MW | 7, 34 |
| Flat vs variable load | "A data center is a very flat load profile versus a greenhouse has wild variability" | 7 |
| Reliability stance | DCs prioritise "five nines (99.999%)" and "will reject any integration that might compromise system reliability" | 7 |
| Motivation | DCs colocate for "public image and community acceptance rather than direct economic benefits" | 7 |
| DC outlet temp by type | legacy air 30-40 C; standard water-cooled 45-55 C (needs supplemental heat on coldest days); AI/HPC direct liquid/immersion 55-70 C; two-phase up to 90 C | 10, 37 (Table 1/3) |
| Direct use share | "direct use of DC surplus heat at 45-50 C ... will normally cover 70 to 90% of the total power requirement" of a greenhouse | 37 |
| Greenhouse setpoints | day ~18-24 C, night not below ~12-15 C; conventional hydronic 60-80 C boiler water; frigid days need ~75 C | 36, 10 |
| Low-temp greenhouse | 45 C water needs ~3x the heating pipe vs 75 C; trials report ~45 C pipes without productivity loss (to be confirmed) | 39 |
| Heat pump stage | substation HX takes 45-55 C DC loop; water-to-water HP boosts to ~60 C; multiple HPs to ~75 C for frigid regions; HP cost high, efficiency low | 38, 40 |
| Substation geometry | HX substation 100-500 m from DC, up to 500 m from greenhouse, max 1,000 m (0.62 mi) separation, for DC security | 38 |
| Storage | insulated tanks for diurnal shift (8-12 h storage in Virginia); aquifer for surplus; oversizing greenhouse or adding co-users smooths | 40 |
| CO2 enrichment | DC emits no CO2; enrichment to 700-1000 ppm lifts yields 18-100%; Farm Park uses CHP/biogas/ethanol CO2 | 36, 12-13, 20 |
| Chilled water from heat | absorption chillers need 65-90 C hot water; DC loops too cool, adsorption chillers could make ~15 C chilled water from ~50-60 C heat | 40-41 |
| Jobs per 65-acre greenhouse | 140-270 total jobs (table: 143 estimated, 271 reported by Oasthouse Ventures; 13 FTE est. vs 43 reported) | 4, 23 (Table 2) |
| Jobs per 10 acres | 41.5 all jobs (6.5 FTE + 35 part-time) est.; per 1 acre 6; per 100 acres 245 | 23 |
| DC vs greenhouse jobs | 20 MW DC ~50 IT jobs; adjacent 10-acre greenhouse 40+ ag jobs | 22 |
| Land cost | NoVA DC land $1-2M/acre vs rural ~$45,000/acre | 9 |
| Fuel offset | 3-4 GW of VA DC heat could offset 370-495 million m3 gas/yr (3.5-4.8 trillion BTU) | 34 |
| Heat share of power | 33-42% of consumed power becomes waste heat (note: contradicts HDR/T5 "95-100%"; this paper means the recoverable liquid-loop fraction, so quote with care) | 10, 33 |
| Liquid cooling adoption | ~80% of existing DCs air-cooled; 38.3% of enterprises planning liquid by 2026 (20.1% early 2024) | 36 |
| Agriport A7 (NL) | the model Farm Park: 1,557 acres, 7 companies; heat mix CHP 71% / geothermal 17% / biomass 8% / boiler 4%; 20 years of governance | 21, 48 |
| Governance lesson | "shared long-term vision" + governance framework for shared infrastructure; clear contracts with financial/operating responsibilities and contingencies; early public-sector involvement | 21, 9 |
| Design lesson | greatest efficiencies come from projects designed for colocation "from inception" (applies to Lansing: new build) | 9 |
| Economics gap | no capex/opex $ for the heat link itself; says Farm Park needs "substantial investment and regulatory support from the public sector"; CHP revenue via PPAs shortens ROI | 17 |
| Appendix C table | per-acre energy costs ($1.65-$8.79/..., $459-$780 per acre) on p54: unlabelled in text dump [IMG, unreadable] | 54 |

Sizing rule for the pitch: **~2 acres of high-tech greenhouse per MW of DC load (673 acres per 326 MW), equivalently ~1 MWth per hectare (expert quote)**. At 150 MW that is ~300 acres at full-year peak-winter duty; the paper's warning is that the demand is seasonal (near zero in summer) and diurnal, so greenhouse alone cannot be the only sink. For Lansing: the ~250 unleased acres (PLAN.md figure, not from organizer docs) could in principle absorb the winter heat of ~125 MW of DC, but only in winter; summer surplus must go to year-round sinks (aquaculture, food processing, pool) or storage. Do not claim the greenhouse takes all 150 MW year round.

## 4. Business and contract models (DATA HEAT guide Feb/Mar 2026; CBS white paper; Danfoss)

Docs: **DH** = DATA HEAT Market Development Guide + Appendices (Reshape Strategies for Danish Energy Agency / IDEA / NYSERDA; PDF page n of 159). **CBS** = CBS "Data center white paper: district heating" (page n of 22). **DAN** = Danfoss Waste Heat paper (page n of 15). (DH p4-8, 26-34 and many Appendix B pages are image-heavy; numbers below are from readable text only.)

### 4.1 Who wants what (the incentive structure judges will probe)

| Point | Value / quote | Doc | Page |
|---|---|---|---|
| Stakeholders | data center, DE utility, building owner | DH | 19 |
| DC interests | time to market, reliability, low OPEX, low CAPEX, tenant retention | DH | 19 |
| DE utility / building interests | return from utility ops, customer retention, reliable low-cost low-GHG heat | DH | 19 |
| Asymmetry | value of heat is larger to the utility/building than to the DC; DC priority is "time to market" so projects fail without a willing DC partner or a policy push | DH | 19, 24 |
| Avoided DC capex | thermal equipment <5% of DC capex; avoided capex from reuse "<<5%" (App B: <2-3%) | DH | 20; 130 |
| Avoided DC opex | >>50% of DC opex is IT power (unchanged); high bookend <25% if ALL cooling+water saved; realistic <5% | DH | 21 |
| Free-cooling conflict | heat has most value when cold, which is when DCs use free cooling (power can rise to make heat available) | DH 21; CBS 15 | |
| Why DC does it anyway | "social license to operate"; regulatory compliance; "even though the avoided costs ... are quite small, data center heat re-use is of large importance, because without it, the project may not happen at all" | DH | 22 |
| Local acceptance | heat recovery can improve local acceptance "possibly more than additional tax revenues" or remote green PPAs; ESG/Scope 3 "unique, quantifiable community benefit" | DH | 44 (App A p1) |
| Utility-side advantages | DC heat is dense (small footprint vs sewer/lake/air sources) and warm (higher HP COP, direct use possible) | DH | 23 |
| Supply-risk barrier | many DCs have a 10-year planning horizon and "often are not willing to enter into contracts for longer than 10 years or to guarantee waste heat availability"; offtakers won't invest in a single uncertain source; "available waste heat may far exceed current or future demands, but off-takers may be unwilling to rely on a single heat source" | DH | 77 (App A p34) |
| Remedies | diversified backup sources, public guarantees, insurance scheme, capital/contingent grants | DH | 74, 77 |
| GHG sharing | contracts may allocate some GHG benefit to the heat producer; not double counted; a building with zero-emission mandate cannot buy heat with positive emission factor | DH | 52 |
| Standard contracts | confidential contracts; Danish Data Center Association developing "copy-paste" contract models | DH | 65 (App A p22) |
| Zoning levers | require DCs to study heat recovery, be designed to connect to TENs, and "make heat available free of charge if or when thermal energy networks or other potential users are available" | DH | 65 |
| Mandates | EU EED: DCs >1 MW must use waste heat unless infeasible; Germany EnEfG: 10% (service after 1 Jul 2026), 15% (2027), 20% (2028); France: >1 MW must set up recovery (effective 30 Apr 2025); NL: new DCs may be required to be TEN-connectable and supply heat free on request | DH | 70-71 |
| Danish price-cap lesson | regulator's surplus-heat price cap removed early 2025 to allow market negotiation | DH | 58 |
| Neighbourhood TEN pilots | CA SB1221 (up to 30 zones); MA, NY, CO, MD, WA, IL; require utility commission approval, prioritise low-income, address obligation to serve (gas) | DH | 66 |
| NY hooks | NYS all-electric building code; NYC LL97 40% GHG cut by 2030, allows TEN offsets; 2022 UTENJA (S9422) lets gas AND electric utilities build TENs; 13 utility TEN pilots proposed 2023 (1 withdrawn); NYSERDA data-center efficiency programs | DH | 137-141, 151 |
| US federal | 26% ITC exists only for waste-heat-to-POWER, not heat supply (2021 Consolidated Appropriations Act) | DH | 72 |
| Electric tariff lever | tariffs could reward heat recovery (e.g. lower electricity tariff); AEP Ohio data-center tariff = 85% upfront payment | DH | 76-77 |
| Grant structure ideas | capital grants up to 75% of study cost (Alberta stream); CDN$125/t CO2e + $8/GJ over 20 years; contingent profit-linked repayment avoids windfalls | DH | 73-74 |
| Roadmap | DC strategy first (welcome? size limits? environmental priorities) then segment market, heat planning, DC zoning, then targeted heat-reuse policy | DH | 36 |
| Seasonal storage | inject summer surplus into borehole field, extract in winter; "optimization strategy ... if the fundamental economics ... are sound to begin with" | DH | 125 (App B p43) |

### 4.2 Commercial structure and numbers (CBS 10 MW use case, 2024-ish European averages)

| Item | Value | Page |
|---|---|---|
| Preferred project leader | heat network operators; ESCOs second (agility + capital) | CBS p2 |
| Normal model | DC delivers waste heat to a heating plant owned/operated by the heat supplier working with the network operator; local DHN operator builds the upgrade plant, provides cooling to DC and heat to network | CBS p2, 15 |
| Greenfield variant | DC development team coordinates the upgrade plant + connection points during planning/land acquisition | CBS p15 |
| ESCO / EaaS role | third-party funding + operation of heat plant | CBS p14-15 |
| Co-funding precedent | Open District Heating Stockholm 2014: DC operator co-funded a significant share of the upgrade plant | CBS p15 |
| Meta Odense | DC exchanges waste heat for cooling services free of charge instead of free cooling | CBS p15 |
| Use case | 10 MW IT DC + network of 10,000-20,000 households (100-200 MW heat); 1:10 ratio gives 100% reuse | CBS p17 |
| Capex 10 MW HP plant | EUR 5-10M (Europe); up to 70% of investment may attract public funding; case uses EUR 6M | CBS p17, 19 |
| Connection types (Fig 5/Table 2) | Classic return-to-feed 60->80 C: COP 4.5, heat price EUR 35/MWh; COP-efficient return-to-return 60->65 C: COP 5.5, EUR 28/MWh; Booster feed-to-feed 77->82 C: COP 3.5, EUR 40/MWh; DC side 26->18 C; elec price EUR 100/MWh | CBS p11, 19 |
| Annual heat | classic 73,209 MWh; efficient 69,593; booster 79,716 (10 MW cooling cap, 8,760 h) | CBS p19 |
| Revenue / elec cost (EUR k/yr) | classic 2,562 / 1,709; efficient 1,949 / 1,329; booster 3,189 / 2,393 | CBS p19 |
| Marginal heat cost | EUR 19/MWh (efficient), 23 (classic), 30 (booster) vs 39 for gas (gas 25 + CO2 60/t); 20-33% cheaper than lake/river-source HP | CBS p19 |
| Savings | classic ~EUR 0.5M/yr vs standalone HP; simple payback ~9 yr at EUR 6M with no subsidy; ambient-source HP >30 yr | CBS p2, 19 |
| Key insight | "the most efficient solutions may not always be the most beneficial in terms of economic outcomes": the booster has the biggest cash flow | CBS p2, 19 |
| HP COP range | 3.0-6.0 in heat reuse | CBS p9 |
| Waste heat temp | "most waste heat is in the 20-26 C range"; limited uses (pools, aquaculture) without HP | CBS p9 |
| Network temps | 1G ~200 C; 2G 100-120 C; 3G 80-100 C; 4G ~(50)60-80 C; 5G/ambient 10-25 C base load | CBS p10 |
| Distance | connection cost rises from 3% to 50% of total capex as distance goes 50 m -> 4,000 m; civil works >half of pipeline cost | CBS p13 |
| Pipe loss | well-insulated 70-80 C pipe loses 0.5-1.5% of heat per km; upgrading at the DHN end (Option B) cuts losses 3-4x and allows cheaper PE pipe | CBS p13 |
| Demand profile | summer demand = 5% of winter (Helsinki), 20% (London/Madrid), up to 30% (Denmark with DHW by DH); networks carry 30-60% reserve over peak | CBS p12 |
| Siting scorecard | great: network <70 C, DC<100 m from substation, fossil heat-only network, network >20x DC capacity, DC >5 MWe, chilled-water cooling | CBS p16 |
| Operator context | regulated, thin margins, subsidy-reliant; DC operators "not accustomed to providing long-term services" to DHN market | CBS p14 |

### 4.3 Danfoss (case numbers usable as support)

| Item | Value | Page |
|---|---|---|
| DC heat supply potential | enough to supply 33% of US combined residential+commercial heating demand; up to 10% of Europe's space heating | DAN p8-9 |
| Heat pump vs network temps | DC heat 30-60 C vs DH networks 70-100 C; networks went ~100 C 3G to ~70 C 4G | DAN p10 |
| Chinese microgrid (Wuqing) | 2 DCs; saves 1.1 million kWh/yr, 1,659 t CO2/yr; heat cost ~60% below local; payback <3 yr on incremental investment | DAN p4, 9 |
| Payback range | waste-heat projects 3-7 yr, DC projects "often shortest" | DAN p8 |
| Industrial HP cases | 4.9 COP (16 C -> 60 C) and 3.8 COP booster to 90 C | DAN p7 |
| Policy asks | contractual, predictable heat supply agreements; flexible tariffs that reward waste heat; fix electricity-to-gas price ratio | DAN p12 |
| Germany | >3,000 DCs, 90 with >50 MW; over 30% of German DH demand coverable by existing industrial waste heat | DAN p4, 13 |

## 5. Directly usable items from the remaining docs

| Doc (page) | Item |
|---|---|
| IDEA/CB&I Thermal Energy Storage for Data Centers (p5, 12) | "Hot TES can balance heat rejection with demand"; HW TES listed as a DC application "to balance heat rejection with demand for heat"; CHW TES gives emergency cooling back-up (reliability story). |
| IDEA/CB&I (p9) | Installed cost: thermal energy storage $200-500/kWh (large CHW TES) vs Li-ion $500/kWh, LFP $600/kWh, pumped hydro $611/kWh, CAES $244/kWh. Note this is cooling-TES era cost; for hot-water tanks in our model use our own cited unit costs. |
| IDEA/CB&I (p10) | TES vs batteries: round-trip ~near-100% vs 68-86%; life 40+ yr vs 3-15 yr; no fire risk, no toxic disposal. |
| IDEA/CB&I (p11) | TES "often reducing net capital cost by reducing required chiller or boiler capacity". |
| IDEA/CB&I (p13, 17) | State Farm: two 4M-gal tanks, shifts ~10 MW peak, 3% kWh/ton-hr gain. Princeton (p17): 4 TES systems; 30 min emergency DC cooling; reduced geo-bores 3,100 -> 2,100, saving $25M capex net; 7 MW peak cut. |
| Williams College/urbs (p8, 10) | Same firm as FPCJ. "Decentralized energy nodes"; capture waste "as close to the consumption as possible"; 120-150 boreholes ~800 ft deep store summer condenser heat; dry coolers + HP supply heat above 32 F outdoor, boreholes below 32 F; thermal storage tank to cover 4-6 h of peak heating; size boreholes to captured heat, "not a 1-to-1 energy production infrastructure". Usable as the template for a seasonal-store scenario (optional, not base case). Rest of the doc [IMG/unreadable percentages]. |
| FPCJ meeting summary (p3-7) | NYSERDA-funded urbs study for First Presbyterian Church Jamaica next to a Verizon switchgear facility rejecting heat via dry coolers: "A small fraction of the heat currently rejected ... could be captured, with proven technology, and used to provide most of the heating needs of the Magill Building ... with no additional operating costs to Verizon" (p4). Verizon: "redundancy measures would be critical" so heating "would not solely rely on Verizon's waste heat" (p5). As a for-profit Verizon "would have to understand the cost-benefit" (p6). NYC EDC willing to navigate regulatory issues of "transferring heat from one property to another"; NYSERDA interested in barriers (p6). Next steps: heat-recovery-ready low-temperature hydronic distribution (p7). Useful as NY precedent: heat transfer across property lines is itself a regulatory issue. |
| Every Drop Counts (Grundfos water paper, p13 = printed p11) | "An evaporatively cooled facility can use 18,000 to 550,000 gallons a day [= 60 to 1,800 US households]; a closed-loop facility of comparable scale uses almost no water after its initial fill." Data centers' direct draw "less than one percent of the nation's water"; larger share is indirect via electricity (p12). Water-energy nexus: a cooling system that uses no water often uses more energy, shifting the draw to the power plant (p12). "Water ... is increasingly what decides whether a region can say yes to new investment" (p13). Policy ideas: tie permitting to water-smart design, bring DCs into state water planning, disclosure (p17). |
| Resource Efficient Decarbonization (NYSERDA/urbs tall-building cases, 69 pp) | Building-retrofit case studies (Empire State, affordable multifamily, district-steam reduction, waterside heat recovery from condenser loops, p46-49) with phased decarbonization. Not DC-specific. Only reusable idea: phase-in logic and "take enabling steps first" (p2): e.g. low-temperature hydronic readiness at each connected building before the network arrives. |
| CenTrio / Thornton Tomasetti slides (p3-7, 9-14) | "25+ projects cancelled nationally due to community backlash" (p3). "Communities are no longer accepting these [incremental property tax, monetization of non-productive land, job creation] as rationale for new developments" (p4). District plant cools the DC and captures heat for the rest of the development; DC revenue "makes the entire development viable/investable" (p7). Integration approach: maximize server exit temperature, add compressor lift, DHW needs high temp but low quantity, secondary heating lower temp but higher quantity, as low a temp as possible before the cooling tower/fin-fan loop, pick delta-T per system (p9-14). Community meetings + local alderman support listed as status (p15). Metropolis Pointe, Chicago Bronzeville (p5). |
| Gardiner & Associates US policy (p4, 6, 7) | Policy menu: tax credits, grants/low-interest loans, prioritized permitting/interconnection for heat-reusing DCs; matching platforms; local planning to co-locate DCs and offtakers; require heat-reuse plans in DC permits; district TENs (p4). 2026: Virginia DOE study law, Illinois POWER Act chance, California utility-TEN bill (p6). US precedents: Syracuse University (DC -> adjacent office building), Notre Dame (DC -> greenhouse), Westbank San Jose (4,000-unit residential DH), Microsoft Amsterdam greenhouses (p7). Syracuse is in NY, 60 mi from Lansing: usable as a regional precedent. |
| iGRID Playbook (Grundfos DE sales playbook, 243 pp) | Marketing/sales content, almost nothing citable. Only generic: "Industries and data centers will play a larger role in district heating" (p9); 4G <70 C (p9). 5GDHC lists "data centre waste heat" as a source (p35). Skip. |
| driving_sustainable_data_centres (July 2025 ESG paper, not on your list) | ESG framing, waste heat recovery listed as emissions lever (p9, 13). Skip unless an ESG slide needs a citation. |

## 6. Top 15 facts / quotes for the pitch (quotes <15 words; every one attributed)

1. Backlash is the context, not a footnote: "$64 billion in U.S. data centre projects have been blocked or delayed" in two years; 142 groups across 24 states. (DATA HEAT App B p101; Data Centre Watch). Alt figure in T5 s7: "$150B ... blocked or delayed in 2025": pick one and cite it, they conflict.
2. Heat reuse as social licence: "data center heat re-use is of large importance, because without it, the project may not happen." (DATA HEAT p22)
3. Tax, land and jobs are not enough anymore: "Communities are no longer accepting these as rationale." (CenTrio/Thornton Tomasetti p4)
4. Acceptance beats tax revenue: heat recovery can enhance local acceptance "possibly more than additional tax revenues." (DATA HEAT App A p1 = PDF p44)
5. The real constraint is demand not supply: "Large data centers generate more heat than many district heating networks could distribute." (CBS p12). RII p7: "from the 50, we only use 10."
6. Reliability is the DC's red line: DCs "will reject any integration that might compromise system reliability"; five nines. (RII p7); DCs keep redundant cooling "if something were to happen to the heat host." (OCP p7)
7. Heat host must not depend on one source: urbs/Verizon, heating "would not solely rely on Verizon's waste heat." (FPCJ p5). Pair with DC's 10-year horizon and unwillingness to guarantee availability (DATA HEAT p77) so the design needs backup + contract step-in.
8. Who pays what: extraction costs split between DC and host; "transformation of the heat ... should be invested by the heat host." (OCP p7-8). CBS p15: heat-network operator is "the preferred project leader", ESCO second.
9. Business case benchmark: 10 MW HP plant EUR 6M, ~9-year simple payback unsubsidised; ">30 years" with ambient-source HP. Up to 70% of capex may attract public funding. (CBS p17, 19) Use instead of vendor "1.5-4 years" (T5 s15).
10. Efficient is not always best: "the most efficient solutions may not always be the most beneficial." (CBS p19) Booster EUR 40/MWh heat vs efficient EUR 28/MWh.
11. Distance kills economics: connection costs rise from 3% to 50% of capex from 50 m to 4,000 m. (CBS p13) Also heat loss 0.5-1.5% per km. Justifies "bring users to the heat."
12. Water: evaporative cooling uses 18,000-550,000 gal/day; closed loop "uses almost no water after its initial fill." (Grundfos Every Drop Counts p13)
13. Liquid cooling raises heat quality: returns 45-65 C vs 27-28 C for air (OCP p6); AI/HPC 55-70 C (RII p10). Direct use covers 70-90% of greenhouse demand at 45-50 C (RII p37).
14. Greenhouse jobs: one 65-acre greenhouse = 140-270 jobs vs a 20 MW DC ~50 IT jobs. (RII p4, 22-23). Plus "colocating a data center with one greenhouse is not functional" alone, so build multiple sinks. (RII p3)
15. Regulators are heading here: Germany requires 10% (2026), 15% (2027), 20% (2028) heat recovery for new DCs (DATA HEAT p70); NY's 2022 UTENJA lets utilities own thermal networks (DATA HEAT p141). A Lansing zoning rule could "require data centers to make heat available" (DATA HEAT p65).

Also strong, short: "It's only waste heat if we choose to waste it." (opening slides s12). HDR's own closing idea: "bring together an observed waste with a planned need" (HDR p47).

## 7. Things in our plan (PLAN.md) that contradict, strain against, or are missing from organizer guidance

CONTRADICTIONS / STRAIN
1. **"No organizer files on hand; use public versions" (PLAN Decisions)** is stale. We now have the organizer pack: cite it, and mirror its terms (CAPTURE / UPGRADE+DELIVER / PROTECT RELIABILITY / CREATE VALUE; temperature, capacity, timing, seasonality, continuity).
2. **Ambient loop for dispersed existing rural homes (PLAN ring 2).** Organizer guidance: "ambient systems may be more prevalent in smaller systems with new construction" while large systems connecting existing buildings are centralized (DATA HEAT p17). RII/CBS also stress density. Existing Lansing homes mostly need 50-70 C heat; ambient (10-25 C, CBS p10; 20-40 C, T5 s33) needs a building HP in every home. Not wrong, but gate it as the plan already does, and say why: new-build / high-density clusters only.
3. **70 C anchor loop (PLAN 4.1.4).** Organizer 4G target is 50-60 C flow, 55 C in newest systems (T5 s19; AG p14); lift from ~40 C D2C return to 70 C costs COP. CBS shows classic 60->80 C COP 4.5 from a 26->18 C source. Offer 55-65 C as base with 70 C as sensitivity, and design buildings for low-temp hydronic (FPCJ p7; RII p39 on 45 C pipes).
4. **COP bound [2,10] in tests.** Organizer ranges: 2-5 (T5 s26), 3.0-6.0 (CBS p9), 2.95 measured case (T5 s40), 3.5-5.5 in the CBS table. Tighten test bound to about [2,7] or document why >7.
5. **Town-center main to school/town hall at 5-7 mi.** CBS p16 siting scorecard grades DC-to-network distance "great" under 100 m and "poor" above 2 km, and network size "great" when more than 20x the DC capacity but "poor" when under 10x. Lansing is the opposite on both counts: demand is far smaller than 150 MW of DC heat and the town centre is miles away. This supports the PLAN reframe (on-site ring first, main conditional) but means the town-center ring needs the explicit LCOH gate PLAN already has. Cite CBS p16 for it.
5b. **"1 TWh/yr heat at 80% load".** Organizer figures: 95-100% of power becomes heat, up to 85% recoverable (T5 s11); RII says 33-42% of consumed power becomes recoverable liquid-loop waste heat (RII p10, 33). State the capture fraction explicitly and show it as a range, not a single point; HDR's ERF uses reuse energy / IT energy (HDR p17-18).
6. **Heat-price/payback story.** T5 s15 claims 1.5-4 yr ROI and 1,770 t CO2 per MWth; CBS gives ~9 yr and Grundfos' own Bjerringbro case 12-13 yr (AG p25). Do not import the vendor figure; PLAN's LCOH/NPV approach is the right one. Use CBS 9-yr as the sanity benchmark.
7. **Greenhouse as main on-site sink.** RII: one greenhouse alone "is not functional" (p3); demand is seasonal/diurnal; needs storage or several co-users; 2 acres per MW. PLAN's mixed on-site campus (greenhouse + aquaculture + processing + rec) is consistent, but the sizing must show the summer surplus going somewhere (storage / pool / aquaculture / processing) rather than claiming all heat used. Also RII: keep the greenhouse behind a substation (HX 100-500 m from DC, <=1,000 m total) for DC security (p38).
8. **Site acreage.** PLAN uses "~250 unleased acres" (not an organizer fact). HDR's tool inputs for the site use 2,000,000 SF (~46 ac), 400,000 SF building footprint, 50 FTE, 100,000 SF impervious, year of occupation 2030 (Lake Hawkeye pack p9). Reconcile the two and cite both; judges' regenerative tool already holds the 46-acre / 50-job frame, so pitch jobs as incremental (greenhouse/food/rec) not DC jobs.
9. **Deck length / format.** Organizer deliverable is "concise, evidence-based" and "select one setting"; PLAN targets a 15+ min story-mode web app. Keep the web app but make sure a 5-minute path hits every scorecard line, and keep the one-page leave-behind as the "concise" artifact.
10. **Equity claim.** HDR pack: no disadvantaged communities nearby (p24); poverty 28th percentile, 65+ at 56th, minority 24th (p37-39). PLAN's "low-income tier" is fine, but the strong angle is older residents + propane/oil + no gas, not poverty. Avoid overclaiming EJ.
11. **Water framing.** PLAN is appropriately skeptical (heat reuse does not equal lake water saved). Organizer material actually supports a narrower version: closed-loop zero-evaporation is the water win (HDR p55; Grundfos p13; T5 s8), heat reuse avoids chillers/towers (OCP p10). Keep PLAN's wording; add the Grundfos 18,000-550,000 gal/day contrast as the "why closed-loop must be conditioned in the ordinance."
12. **Backlash numbers.** Organizer pack gives two non-matching figures ($150B in 2025 in T5 s7; $64B over two years in DATA HEAT p101). Pick DATA HEAT (it names the source: Data Centre Watch) or cite both.

GAPS (organizer cares, PLAN silent)
- **ERE / ERF / PUE / WUE / CUE** reporting for the proposal: HDR deck p15-18 gives formulas and an ERE worked example; add an "Energy Reuse Factor" line in impact (ERF = reused kWh / IT kWh).
- **Regenerative KPIs (HDR 7 domains: health, community, air, carbon, water, biodiversity, nutrients)** are the HDR frame; PLAN's impact section covers carbon/water/equity but not **biodiversity**, **air** (diesel backup gens), **noise** (41.9 dB vs 40.6 baseline, p13), **flood/stormwater** (precip +3 in, p21), **nutrients** (phosphorus-impaired Cayuga Lake, p19). Add one line each.
- **Climate resilience**: +3 F by 2050, 69 days >90 F vs 19 today (p26); matters for dry-cooler capacity and for the cooling-reliability argument.
- **Equipment responsibility split / who owns the HX vs HP vs network**: OCP p7-8 gives the clean rule; use it for the ownership slide.
- **Heat supply agreement terms**: DATA HEAT p77 (10-yr horizon, no availability guarantee, insurance/guarantee ideas, diversification) and p65 ("copy-paste" Danish contracts). PLAN's step-in + decommissioning reserve is aligned; add backup-source diversification and a supply-risk insurance/guarantee line.
- **Local zoning as the vehicle**: DATA HEAT p65 lists zoning conditions (study heat recovery, design to connect to TENs, supply heat free of charge when users exist). Lansing is drafting a law now, so the "yes, if" conditions can be written in that exact language.

## 8. Unreadable / not extracted (be honest in Q&A)
- HDR deck: p4-7, 22-27 (maps, charts), 38-40, 43-46, 48-51, 57-59, 62-66 are image-only. p42 ladder and Lake Hawkeye p9, p25 were rendered and read approximately by eye (values flagged approximate).
- Site packs: percentile maps are images; only caption text extracted. Page 25 carbon chart read from a low-res render.
- DATA HEAT: slides p4-8 and large parts of Appendix B (p86-160) are charts; NY section p139-141 partially text. No $ capex tables for NY found.
- RII greenhouse: Appendix C table p54 ($/acre columns) unlabelled in text dump.
- Opening slides s2-s4, s9 image only. iGRID Playbook (243 pp) skimmed, not read.
- Williams College / urbs: most figures (percentages p5, 12-13) unlabelled.

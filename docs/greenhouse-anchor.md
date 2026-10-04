# On-site heat sink: greenhouses, RAS aquaculture, and community recreation

Site: Lake Hawkeye / former Cayuga coal plant, Lansing, NY (TeraWulf). Phase 1 in the applicant’s environmental form is three 50 MW buildings (150 MW), with a later 150 MW stage inside an approximately 300 MW program; the company’s 2025 release also describes rights to develop up to 400 MW. This file sizes the year-round on-site heat users that come to the heat. Town-center transmission is out of scope except as a contrast.

Status: drafted 2026-10-03. Every factual claim below has a source. Figures marked **ASSUMPTION** are calculated here from those sources. Anything this lane could not open is marked **[unverified]**.

**Recommendation, in one paragraph.** Build a 4 hectare (about 10 acre) heated greenhouse on already-industrial land at the plant site, with a small trout RAS and an indoor community pool beside it. At the planning heat intensity used below, that house is about 4–7 MW of design heat and about 12 GWh of heat per year. A 150 MW computing phase is far larger than that. The greenhouse is the community covenant and the winter fuel displacement. It is not a sink for the whole campus, and it is a weak summer sink. Dry coolers remain the summer rejection path.

## 1. Design intent and covenant role

The on-site campus is the condition that makes a data center discussable: a binding heat-supply and community-benefit agreement, with users on the plant property so the town does not have to trench 5–7 miles to the school and town hall before anything is built (distance: project reality check, verified 2026-10-03).

What the agreement has to lock:

- Heat recovery is a side stream. The data center’s own coolers keep full capacity if the greenhouse, the fish tanks, or the pool stop taking heat. RII’s interviews record the same rule from operators: data centers will reject any integration that threatens “five nines” uptime, and the practical interface is a heat exchanger in its own substation, with a bypass, and no mixing of the two fluids (Resource Innovation Institute, *Colocating Data Centers & Greenhouses*, June 2025, pp. 7 and 38; https://resourceinnovation.org/wp-content/uploads/2026/02/Colocating-Data-Centers_Greenhouses-RII-Virginia.pdf, verified 2026-10-03).
- The grower, a co-op, or a public recreation operator takes the heat under a meter. Temperature boosting, storage, and backup heat sit on the heat user’s side of the exchanger. The organizer heat-reuse primer states that transformation cost (storage, temperature lift, heat-to-cooling) belongs to the heat host (Open Compute / heat-reuse primer, local extract `resources/text/20230623_Data_Centers_HeatReuse_101_3.2.docx.txt`, pp. 7–8, verified 2026-10-03).
- A new greenhouse in Lansing cannot count on a new natural-gas hookup. The project reality check records a NYSEG moratorium on new or expanded gas service since February 2015 (2026 status unverified), with many homes on propane or oil (verified 2026-10-03 as a project constraint; this lane did not re-open the NYSEG order). That is the grower’s fuel alternative as well as the household one: propane, oil, or electric heat, unless the data-center loop is the supply.
- HDR’s site pack says there are no designated disadvantaged communities nearby (`resources/text/2026_10_01_Hackathon_NYU_-_Suburban_Site_-_Lake_Hawkeye.txt`, p. 24, verified 2026-10-03). The public case is local food, a modest number of jobs, a pool, and a closed nutrient loop. It is not an environmental-justice claim.

## 2. What the organizer sources already say

From the RII Virginia feasibility report (June 2025, URL above), which outranks secondary web roundups:

- A heat-exchange-only link between one data center and one greenhouse is technically possible and economically limited. The report’s preferred pattern is a “farm park”: several agricultural users sharing hot water, chilled water, and CO2, with the data center thermally decoupled (pp. 7, 38).
- Scale mismatch, in an interviewee’s words: “If you put a 10-hectare greenhouse next to it, then we need 10 megawatts. They have 50, so from the 50, we only use 10.” Medium data centers of 30–50 MW already outrun a large greenhouse (p. 7). That is the 1 MWth per hectare rule of thumb. It is an industry comment, not a measured Ithaca load.
- A separate literature figure in the same report: one 326 MW Virginia center “could heat 673 acres of greenhouse, a ratio of about 2 acres/MW” (p. 34). 673 / 326 = 2.06 acres per MW of data-center electric capacity. That ratio is not the same thing as 1 MWth per hectare of greenhouse. Both are reported; neither is an Ithaca energy model.
- Seasonal mismatch: data-center heat is flat; greenhouse heat is highest in winter and near zero in summer, and even a sunny winter day may need little heat. Multiple industries or storage are what smooth it (pp. 7, 40).
- Temperatures. Legacy air-cooled outlets 30–40 °C are a poor match. Modern water-cooled outlets 45–55 °C suit much of a greenhouse heating season. AI/HPC liquid cooling is described at 55–70 °C. The report says direct use of 45–50 °C “will normally, dependent on the piping system, cover 70 to 90% of the total power requirement.” Coldest-day hydronic design is described as about 75 °C, and one study cited there says 45 °C water needs about three times the pipe surface of 75 °C water. Trials at about 45 °C “will need to be repeated” before the industry adopts them (pp. 10, 36–39).
- Crop air setpoints in temperate commercial houses: about 18–24 °C by day and no lower than about 12–15 °C at night, varying by crop (p. 36).
- CO2. Enrichment to roughly 700–1,000 ppm is described as boosting yields 18–100% for most vegetables and flowers. High-tech houses often get that CO2 from the same gas boiler that makes the heat (p. 36). A waste-heat house loses that combined product unless it buys CO2.
- Dehumidification is called out as a real load, and absorption chillers “typically” want 65–90 °C hot water. Adsorption machines “may operate on 50–60 °C” with limited capacity (pp. 40–41).
- Jobs (Table 2, p. 23), RII estimates unless noted: a 10-acre house, about 6.5 full-time-equivalent skilled/admin staff plus 35 part-time-equivalent hourly and seasonal workers (about 40 jobs, matching the narrative “40+” for a 10-acre house next to a 20 MW data center). A 65-acre house, RII’s own estimate about 13 FTE plus 130 part-time-equivalent; the same row cites Oasthouse Ventures’ 28 Feb 2025 press estimate of 43 FTE and 228 part-time-equivalent. The executive summary’s “140–270 total jobs” per 65-acre siting is that range (pp. 3, 22–23). This lane did not open the Oasthouse press release; the 43 / 228 figures are RII’s citation.
- Aquaculture is listed as a 24/7 colocated load (pumping, filtration, aeration, heating or cooling to hold species temperature), and a packhouse is listed as the user whose load stays up when the greenhouse’s heat demand falls (pp. 19–20).
- Security separation: greenhouse up to about 0.6 miles away, exchanger substation 100–500 m from the data center and up to 500 m from the greenhouse (p. 38). On this site that distance is available inside the industrial property. It does not justify a pipeline to the town center.

Agriport A7 (Middenmeer, Netherlands), from the same report’s case study, is a colocation campus, and its greenhouse heat is not data-center heat. The case study gives 2,500 hectares for the hub, 1,557 acres (630 hectares) of greenhouse across seven companies, 185 acres (75 hectares) of data center, and a greenhouse heat mix of CHP 71%, geothermal 17%, biomass 8%, boiler 4%. Irrigation water productivity is given as 4 L per kg of tomato. CO2 is purchased liquid CO2 plus CHP CO2 (case-study pages in the same PDF). Noord-Holland’s establishment guideline says a data center “must make waste heat available to a (heat) company if requested,” and must be technically prepared for a full heat supply if nobody asks during permitting (Province of Noord-Holland, English guideline, measure I; https://www.noord-holland.nl/bestanden/pdf/Richtlijn%20vestigingsvoorwaarden%20engelse%20vertaling.pdf, verified 2026-10-03). The municipality of Hollands Kroon states that data-center residual heat at Agriport “is not yet used,” while new data-center buildings must include a residual-heat connection (https://www.hollandskroon.nl/ontwikkelingen/datacenters/, verified 2026-10-03). A Dutch trade article reports that a minister described Microsoft heat into Agriport glasshouses as an example project, and that the parties did not confirm delivery was underway; the same article quotes the heat as low-grade “rest warmth” from air cooling (https://www.gfactueel.nl/minister-warmte-datacenter-kassen-agriport-voorbeeld/, verified 2026-10-03). Use Agriport as the land-use and permitting precedent. Do not cite it as an operating data-center-to-tomato heat pipe. A 2 January 2014 trade report on Microsoft’s 37 hectare purchase at Agriport describes the energy flow the other way: the data center “will run on electricity from glasshouse CHPs” (https://www.hortidaily.com/article/6005366/dutch-greenhouse-chp-s-to-provide-microsoft-data-center-with-electricity/, verified 2026-10-04). A 23 December 2025 scoping note for a Microsoft expansion at Middenmeer says the company intends to offer residual heat to ECW for a possible link to local glasshouses, at about 25 °C, with one existing greenhouse’s maximum offtake given as 10 MWth and later demand “ca. 20 MWth” (https://edataloket.odnzkg.nl/preview/OD2025-0043382_D2025-506635, verified 2026-10-04). That note is an expansion still in scoping.

The Dutch project that is actually delivering heat is smaller and is not a food greenhouse. NorthC’s Aalsmeer site (14 MW installed electrical capacity) states that residual heat warms a daycare, a swimming pool, and a potted-plant exporter (https://www.northcdatacenters.com/en/northc-datacenters/aalsmeer/, verified 2026-10-04). The 2019 announcement for that ring put the heat at about 22 °C, with heat pumps raising it, and named Integraal Kindcentrum Triade, Sportcentrum De Waterlelie, and Fertiplant (https://www.telecompaper.com/news/nldc-datacenters-neemt-deel-aan-warmte-koude-uitwisseling-in-aalsmeer--1305091, verified 2026-10-04). A study with Royal FloraHolland and Greenport Aalsmeer treats greenhouse use of 20–30 °C residual heat as a further exploration, not an operating supply (https://www.blueterra.nl/project/restwarmte-van-datacenter-northc-voor-royal-floraholland, verified 2026-10-04).

The organizer sector-coupling guide (DATA HEAT, March 2026 extract) lists QScale’s Lévis campus as a Québec example with provincial equity and “waste-heat recovery to greenhouses,” and separately states that Q01 is being developed with Énergir to recover up to 96 MW, “enough to heat more than 15,000 homes” (`resources/text/DATA_HEAT_-_Sector_Couling_Data_Centeres_and_District_Energy_-_Market_Development_Guide_and_Appendicies_-_3MAR26.txt`, Québec slides). Primary pages refine the status: the 96 MW and 15,000-home figure is QScale and Énergir’s 16 March 2023 target, with first recovered heat then hoped for early 2024 (https://www.qscale.com/news/energir-vrt-waste-heat-recovery, verified 2026-10-03). On 9 February 2026 Le Soleil wrote that the data center is operating and the greenhouse project “n’a pas encore vu le jour” (https://www.lesoleil.com/affaires/2026/02/09/quebec-prete-a-debourser-10-m-pour-le-projet-de-serres-voisines-a-qscale-TTH5V55BBBFZNBOG2JR2QQ3GWU/, verified 2026-10-04). The Québec government’s 13 July 2021 announcement of C$90 million for the Lévis computing center is a C$60 million loan plus C$30 million in shares, and it names future greenhouses only as a possible heat user (https://www.quebec.ca/nouvelles/actualites/details/investissement-de-pres-de-870-m-en-chaudiere-appalaches-quebec-accorde-90-m-pour-soutenir-limplantation-dun-centre-de-traitement-de-donnees-a-levis-33383, verified 2026-10-04). QScale’s same-day note projects “2,800 tonnes of small fruit and more than 80,000 tonnes of tomatoes per year” as what the heat could help produce (https://www.qscale.com/news/from-data-processing-to-food-self-sufficiency-financing, verified 2026-10-04). Those tonnages are a projection. See section 13.

The heat-reuse primer’s temperature figure shows air cooling near the bottom of the range, rear-door heat exchangers, and cold-plate/immersion associated with roughly 45–65 °C return temperatures versus 27–28 °C (same primer, p. 6). Swimming pools and agriculture are both listed as heat hosts in low-density places; greenhouses and fish farming are listed as seasonal (pp. 8–9).

HDR’s Lake Hawkeye site pack, used as the regenerative-design baseline:

- Downstream impaired waters: Cayuga Lake and an inlet; “the lake is impaired with phosphorous” (p. 19).
- No designated disadvantaged communities nearby (p. 24).
- Agriculture mapped as the greatest biodiversity threat (p. 12). Direct runoff pathway toward the lake is acknowledged (p. 18, EJ Screen direct-discharge 44th percentile).
- Water stress, drought, and groundwater decline all “low-medium” (pp. 15–17).
- Future climate on the pack: precipitation “3 inches” higher within 10 years (p. 21); “3 degrees hotter by 2050 on average with up to 69 days above 90 degrees compared with 19 days today” (p. 26); “12 degrees warmer by 2080” and a comparison to Cherry Hill, VA (p. 27).
- Local air quality described as good (pp. 28–29). Site census indicators in the pack: mental health 27th percentile, asthma 51st, heart disease 42nd, stroke 34th, minority population 24th, poverty 28th, age 65+ 56th (pp. 14, 33–39). Cancer “90th percentile” is described for communities across the lake, not for this site (p. 36).

## 3. Place constraints (acreage, distance, climate, lake, equity)

**Lease and land.** TeraWulf’s 14 August 2025 release: an 80-year ground lease for approximately 183 acres at the Cayuga site, with exclusive rights to develop up to 400 MW, and 138 MW “expected to be ready for service in 2026” (https://investors.terawulf.com/news-events/press-releases/detail/113/terawulf-secures-long-term-ground-lease-at-cayuga-site-to-expand-high-performance-computing-infrastructure, verified 2026-10-03). The Full Environmental Assessment Form Part 1 for “Lake Hawkeye Data Campus,” sponsor TeraWulf, location 228 Cayuga Drive, states a staged program of approximately 300 MW: Phase I three 50 MW buildings, Phase II an additional 150 MW. The same form states total acreage of the site ±434 acres, acreage to be physically disturbed ±125 acres, and acreage owned or controlled by the applicant ±434 acres (Town of Lansing meeting file, https://mccmeetingspublic.blob.core.usgovcloudapi.net/lansingny-meet-31cae87722a349cf9947532226835936/ITEM-Attachment-001-78dcf4833efb4ed695a76cddf01566c4.pdf, verified 2026-10-03). A November 2025 zoning appeal by the applicants says the former Cayuga coal station permanently retired in 2019 and describes the proposed campus as “a fully closed-loop cooling system with no lake withdrawals or thermal discharge” (https://mccmeetingspublic.blob.core.usgovcloudapi.net/lansingny-meet-4c84f6223a774dd5ae8446cfe8566f81/ITEM-Attachment-001-3ea75824119d4920aefd7569b3dc87fc.pdf, verified 2026-10-03).

**ASSUMPTION on where the greenhouse sits.** 434 minus 183 is about 251 acres, but this lane did not find a survey that labels those acres “unleased and buildable.” A 4 hectare house plus tanks, a pool, parking, and a packhouse is on the order of 8–12 hectares (20–30 acres) of pad and yard. That fits inside either unused industrial land inside the 183-acre lease or other land the FEAF says the applicant controls. It does not require the disputed remainder. Siting stays on the former plant’s already-disturbed industrial ground, because the HDR pack identifies agriculture as the main biodiversity pressure and notes a runoff path to the lake.

**Water permit, kept separate from heat reuse.** The 29 October 2025 Environmental Notice Bulletin for Cayuga Operating Company, LLC: the facility was historically a 322.5 MW coal station; boilers are removed; it “currently withdraws approximately 1.44 MGD” from Cayuga Lake as non-contact cooling water for equipment; a renewal was pending at a proposed 1.008 MGD (DEC ID 7-5032-00019/00024) (https://dec.ny.gov/news/environmental-notice-bulletin/2025-10-29/completed-application/town-of-lansing-cayuga-operating-company-llc, verified 2026-10-03). The project reality check says DEC renewed a 1.008 MGD withdrawal in April 2026. This lane did not open that renewal document, so the April 2026 issuance is **[unverified]** here. Either way, delivering heat to a greenhouse does not retire that permit and is not a gallon-for-gallon saving of lake water. The water commitment in the covenant is the closed loop the applicant already describes, plus a promise not to use lake water as the data-center heat sink.

**Climate used for the monthly table.** Northeast Regional Climate Center, Ithaca station, 1991–2020 normals (https://www.nrcc.cornell.edu/wxstation/ithaca/normal.html, verified 2026-10-03). Heating degree days are base 65 °F.

| Month | Avg °F | Avg °C (converted) | HDD base 65 °F | Share of annual HDD |
|---|---:|---:|---:|---:|
| Jan | 22.8 | −5.1 | 1,308 | 18.1% |
| Feb | 24.1 | −4.4 | 1,145 | 15.9% |
| Mar | 31.3 | −0.4 | 1,045 | 14.5% |
| Apr | 43.7 | 6.5 | 642 | 8.9% |
| May | 55.6 | 13.1 | 314 | 4.4% |
| Jun | 64.6 | 18.1 | 95 | 1.3% |
| Jul | 68.9 | 20.5 | 27 | 0.4% |
| Aug | 67.4 | 19.7 | 42 | 0.6% |
| Sep | 60.2 | 15.7 | 184 | 2.6% |
| Oct | 49.0 | 9.4 | 501 | 7.0% |
| Nov | 38.6 | 3.7 | 792 | 11.0% |
| Dec | 29.1 | −1.6 | 1,113 | 15.4% |
| Year | 46.3 | 7.9 | 7,208 | 100% |

Annual precipitation 38.29 inches; snowfall 62.9 inches (same page). June–August together are 164 HDD, 2.3% of the year. NCEI’s monthly normals for station USC00304174 (Ithaca Cornell Univ) show the same annual HDD base 65 °F of 7,207 and the same monthly mean temperatures (https://www.ncei.noaa.gov/access/services/data/v1?dataset=normals-monthly-1991-2020&stations=USC00304174&format=pdf, verified 2026-10-03). NRCC’s 7,208 is the rounding used below.

**Equity.** No designated disadvantaged community on the HDR pack. Poverty and minority percentiles on that pack are in the 20s. The affordability story that is actually on the record is the gas moratorium and propane/oil heat, not a disadvantaged-community designation.

## 4. Supply temperatures the crops, fish, and pool actually need

Expected source, from the organizer primer and from RII, if the campus is built with liquid cooling: about 45–65 °C at the cooling loop. TeraWulf’s public cooling description is a sealed glycol loop rejected by dry coolers (project reality check and the applicant’s zoning appeal, above). This lane did not open the company’s cooling webpage, so the propylene-glycol wording and the fan-cooler detail beyond the appeal’s “fully closed-loop” sentence stay with that reality check (verified 2026-10-03 as a project constraint).

| User | Setpoint this lane could verify | Water temperature the heating system wants | Match to a 45–55 °C loop |
|---|---|---|---|
| Tomato / fruiting vegetables | Day about 18–24 °C; night not below about 12–15 °C (RII p. 36) | Standard hydronic practice in the German measurements below is a high curve of 75/55 °C supply/return at −15 °C outdoors, falling to 40 °C when outdoors is 20 °C and heating stops. A medium curve of 55/40 °C at −15 °C outdoors is described as achievable with more pipe or finned pipe. RII: 45–50 °C direct use covers 70–90% of greenhouse heating power; coldest days want about 75 °C, or about 3× the pipe area at 45 °C | Direct through most of the Ithaca heating season. A water-to-water heat pump, owned by the greenhouse, covers the coldest hours. Backup boiler or electric boiler on the greenhouse side, not on the data-center side |
| Leafy greens | Cooler than tomato. Cornell’s CEA program is built around hydroponic lettuce, but this lane did not open a Cornell page that states the Ithaca night setpoint. **[unverified]** exact °C | Lower than the tomato high curve, so more of the year is inside 45 °C water | Best direct-use bay in the house |
| Rainbow trout RAS | FAO: growth and spawning in a narrower band of 9–14 °C; “optimum water temperature for rainbow trout culture is below 21 °C”; the species can survive a much wider range (0–27 °C) but that is not the culture target (https://www.fao.org/fishery/docs/DOCUMENT/aquaculture/CulturedSpecies/file/en/en_rainbowtrout.htm, verified 2026-10-03) | A heat exchanger into the water loop. This is not a 75 °C greenhouse pipe | Direct. In a cold makeup-water winter the load is heating. In a hot greenhouse-coupled summer the load can flip to cooling. A vendor page states commercial RAS trout often held at 15–17 °C (https://aquafarmer-ras.com/technology/trout-farming/, verified 2026-10-03); treat that as industry practice, not a regulator’s standard |
| Indoor pool and showers | Exact pool setpoint **[unverified]** this session. Pools are heated far below greenhouse pipe temperature | Low-temperature water | Direct from 45 °C through a pool heat exchanger. Organizer primer lists swimming pools as a low-density heat host |

Fraunhofer ISE measurements on a 25,000 m² flower and houseplant greenhouse in Straelen, northwest Germany (mild: “negative temperatures only occur 7% of the year”): annual heat 5,000 MWh, so 200 kWh per m² per year, or 2,000 MWh per hectare per year; design heat load 4.5 MW, which is 1.8 MW per hectare; specific installed capacity “up to 2 MW/ha”; usual flow temperature “around 60 °C”; dehumidification estimated at 20–30% of total heat consumption (Chaigneau and Nienborg, ISEC 2024, https://doi.org/10.52825/isec.v1i.1162, verified 2026-10-03). Straelen is milder than Ithaca (Ithaca annual HDD base 65 °F is 7,208, and January averages 22.8 °F). Use 2,000 MWh/ha/year as a floor for Ithaca, not as the planning value. Use 1–2 MW/ha as the design-capacity band (RII’s 1 MW/ha comment at the low end, Straelen’s measured 1.8 MW/ha inside a mild climate at the high end).

## 5. Monthly heat demand per hectare (Ithaca climate)

**ASSUMPTION, planning intensity: 3,000 MWh of heat per hectare per year (300 kWh/m²/year).**

Reasoning, and nothing beyond it:

- Straelen, milder than Ithaca, measured 2,000 MWh/ha/year including dehumidification (source above).
- A Saskatchewan modeling study reports tomato heating of 1,486 MJ/m²/year, which converts to 413 kWh/m²/year or about 4,130 MWh/ha/year, with cucumber 1,657 MJ/m²/year and pepper 1,754 MJ/m²/year (Ahamed, Guo, and Tanino; abstract text as returned in search on 2026-10-03). This lane did not open the publisher PDF, so that prairie figure is supporting context, not a number to slide into the model without the paper. Saskatoon is colder than Ithaca. The Ithaca planning value is set between the German measurement and that prairie model, at 3,000 MWh/ha/year.
- Monthly shape follows Ithaca HDD base 65 °F. That base is close to a tomato night setpoint and warmer than a lettuce night setpoint. The shape ignores solar gain, so it overstates daytime winter heat and slightly overstates June–August. RII’s qualitative finding (summer greenhouse heat near zero) agrees with the arithmetic: June–August are only 2.3% of annual HDD. A second column zeros those three months and leaves the other months unchanged, which drops the annual total to 2,932 MWh/ha. Dehumidification, which Straelen found to be 20–30% of annual heat, can put real summer and shoulder load back. The zeroed column is the space-heat view. The HDD column is the one to use until an hourly greenhouse model exists.

Degree-day shares are 1,308/7,208 and so on, from the NRCC table. Average MW is monthly MWh divided by hours in that month (January 744, February 672, April 720, and so on).

| Month | HDD share | MWh/ha (HDD shape) | Average MW/ha | MWh/ha if Jun–Aug space heat is 0 |
|---|---:|---:|---:|---:|
| Jan | 18.1% | 544 | 0.73 | 544 |
| Feb | 15.9% | 477 | 0.71 | 477 |
| Mar | 14.5% | 435 | 0.58 | 435 |
| Apr | 8.9% | 267 | 0.37 | 267 |
| May | 4.4% | 131 | 0.18 | 131 |
| Jun | 1.3% | 40 | 0.05 | 0 |
| Jul | 0.4% | 11 | 0.02 | 0 |
| Aug | 0.6% | 17 | 0.02 | 0 |
| Sep | 2.6% | 77 | 0.11 | 77 |
| Oct | 7.0% | 209 | 0.28 | 209 |
| Nov | 11.0% | 330 | 0.46 | 330 |
| Dec | 15.4% | 463 | 0.62 | 463 |
| Year | 100% | 3,000 | — | 2,932 |

Sensitivity on the annual total, same monthly shape: 2,000 MWh/ha (Straelen floor, too mild for Ithaca) and 4,130 MWh/ha (prairie tomato model, likely high for Ithaca). January would then be about 363 or about 750 MWh/ha instead of 544. Do not treat 3,000 as a measured Ithaca load. It is the placeholder an hourly model should replace, using Ithaca TMY and a stated U-value, energy screen, and setpoint.

Design peak for pipe sizing is not the January average. The January average at this assumption is 0.73 MW/ha. The RII/Straelen band is 1–2 MW/ha. **ASSUMPTION for interface sizing: 1.5 MW/ha** until the hourly model is run. Coldest-hour outdoor design temperature for Ithaca was not pulled from ASHRAE 169 in this lane **[unverified]**.

## 6. Summer sink value

June–August greenhouse space heat, under the table above, is about 68 MWh per hectare, 2.3% of the annual total. Relative to a 150 MW computing phase, that is a rounding error. RII’s own conclusion is the same: without other users or storage, much of the year’s data-center heat has nowhere to go, and summer greenhouse heating is near zero.

What can still take heat from June through August:

- **Dehumidification and cooling of the house.** Real, and already inside the Straelen 20–30% share, but turning data-center heat into cooling wants absorption hardware at roughly 65–90 °C, or adsorption at 50–60 °C with limited capacity (RII). At a 45–55 °C glycol loop this is a sensitivity case, not the base design. At 55–65 °C it becomes more plausible and should be priced as greenhouse-side equipment.
- **Trout RAS.** If makeup water is cold, tanks still need heat in summer to hold 9–18 °C. If the hall overheats, the fish need cooling instead, and the data-center loop is no longer a sink. A California trout-and-lettuce trial notes summer overheating of RAS tanks inside a greenhouse as a reason to site tanks in shade (https://www.mdpi.com/2410-3888/10/2/85, verified 2026-10-03). That paper is not an energy-intensity source.
- **Indoor pool, showers, and a packhouse** (wash water, crate wash). Steady and small. This lane did not verify a kWh-per-square-metre pool benchmark, so no pool MWh figure is stated.
- **Dry coolers.** They remain the summer heat sink for the computing load. The covenant should say that in plain language.

HDR’s own future-climate slides make summer harder, not easier: more days above 90 °F by 2050. A greenhouse designed only as a winter radiator will spend more of its life ventilating and dehumidifying. That is a reason to keep the house at a size the market can support, and to put the summer public benefit in the pool and the food operation rather than in a claim that the glass absorbs July heat.

## 7. Crops that can sell from this site

Ithaca’s January mean is 22.8 °F and annual snowfall is 62.9 inches (NRCC, above). Outdoor vegetable production does not run through winter. The crops that use low-grade heat and have a local winter market:

- **Tomatoes** as the main heated bay. They want the higher night temperature and they are the crop RII uses for its Virginia demand comparison. The Saskatchewan study’s abstract pairs a tomato yield of 55.0 kg/m² and a price of C$3.50/kg with a net return of C$69.2/m². Those are prairie modeled economics in Canadian dollars, not Finger Lakes prices. US wholesale prices for this site are **[unverified]** this session.
- **Leafy greens** (lettuce, herbs) in a cooler bay. Cornell CALS already has the local technical base: the CEA program’s 1999 Ithaca prototype was sized for 1,245 heads of lettuce per day, and current work sits in Horticulture under Neil Mattson, including the GLASE lighting consortium with Rensselaer and NYSERDA (https://cea.cals.cornell.edu/about-cea/, verified 2026-10-03). A 2003 NCR-101 report says that demonstration house was an 8,064 square-foot glasshouse with production in 6,384 square feet of ponds (https://www.controlledenvironments.org/wp-content/uploads/sites/6/2017/06/corncea_2003.pdf, verified 2026-10-03). Whether that house still produces at that rate is **[unverified]**.
- **Cucumber**, as a second fruiting crop, only if a buyer is named. The same prairie abstract gives 65.0 kg/m² and C$2.70/kg. Not used in the size recommendation.

Cornell’s CEA page also warns that lighting in a cloudy climate “can be as much as one hundred kilowatt-hours per square foot” of lighted area per year. That is 1,076 kWh/m²/year of electricity, larger than the 300 kWh/m²/year heat assumption, if a bay is fully lighted. Heat from the data center does not pay the light bill. Québec’s unbuilt QScale greenhouse stalled in part on a 12 MW lighting allocation (section 13). Any Lansing term sheet needs a separate electric plan for lights.

CO2 is the other purchased input. Burning propane would have supplied both heat and flue-gas CO2. Waste heat supplies only the heat. Budget liquid CO2, as Agriport does, or accept the yield loss RII associates with staying near ambient CO2.

## 8. Aquaculture (RAS) and the phosphorus story

**Species.** Rainbow trout, not a warm-water species. FAO’s culture window (below 21 °C, growth band 9–14 °C) sits close to a cold makeup-water loop and does not ask for 28 °C tilapia water. Tilapia would be a larger, year-round heat sink and a worse biological fit for a lake-trout region; this lane did not find a local market source, so tilapia is not recommended.

**Heat.** RII describes RAS as a 24/7 pumping, aeration, and temperature-control load, not as a greenhouse-scale heater. A modeled Atlantic-salmon RAS reported 9.59 kWh of electricity per kg of fish for a full grow-out, “almost one third” of it for heating makeup water from 5 °C to 12 °C in that simulation (https://www.sciencedirect.com/science/article/pii/S0144860923000171, verified 2026-10-03). That is one case study, salmon rather than trout, and the thermal share is of electric-equivalent energy in the model. It supports a qualitative point: temperature control is a large fraction of RAS energy, and it is still small next to hectares of glass. No Lansing RAS megawatt figure is invented here. Size the first tanks as a pilot the operator can sell (tens to low hundreds of tonnes per year is **[unverified]** as a recommendation and is not used). The Green Mountain / Hima Seafood project in Rjukan, now operating, started heat delivery at up to 1.75 MW with an 8 MW second phase under study (section 13). That is a credible industrial ceiling for a later phase, not the opening bid.

**Phosphorus, stated at the strength the sources support.**

- HDR’s pack: Cayuga Lake is impaired for phosphorus, and runoff from the site can reach the lake.
- DEC, 9 September 2024: EPA had approved a Cayuga Lake phosphorus TMDL. The TMDL “recommends a 30 percent reduction of phosphorus from the watershed.” Nonpoint sources, “including runoff from agricultural and developed lands,” contribute more than 90 percent. Point sources are about 10 percent. Agriculture “was found to be the largest contributor.” Progress already counted by DEC is about 39,000 pounds of phosphorus per year removed through existing grant programs (https://dec.ny.gov/news/press-releases/2024/9/dec-announces-epa-approved-pollution-prevention-plan-for-cayuga-lake-watershed, verified 2026-10-03). The southern-end segment (0705-0040) is listed impaired for total phosphorus for primary and secondary contact recreation, 303(d) year 2002 (https://extapps.dec.ny.gov/data/WQP/PWL/0705-0040.html, verified 2026-10-03).
- A closed RAS with a settler or drum filter holds solids in the building. Plants in an aquaponic bed can take up dissolved nutrients. The California trial cited above removes solids at a radial-flow settler and then irrigates lettuce with effluent. That is a mechanism, demonstrated at tank scale, not a lake cleanup.

The covenant language that matches those facts: no process discharge from the fish system or the greenhouse fertilizer loop to Cayuga Lake or to a ditch that reaches it; solids leave as a managed byproduct under a nutrient plan, and are not stockpiled on the lakeshore. That is a “do not add a new phosphorus source” design, in a watershed that has been told to cut phosphorus 30 percent, and where agriculture is already the largest source. It is not a claim that the greenhouse restores the lake, and it is not a TMDL credit unless DEC says so. HDR also flags agriculture as the biodiversity pressure, so the houses go on the old industrial pad, with stormwater kept out of the lake.

## 9. Community recreation center and pool

Put one indoor pool and a small recreation room on the same pad as the greenhouse, on the public side of the fence, with the data halls on the other side of the heat-exchanger substation (RII’s separation rule). The organizer primer already lists pools as the heat host that still makes sense in a low-density place.

The pool’s value is public and political: a year-round amenity the town can use, heated by the loop, at a scale of hundreds of kilowatts rather than megawatts. NorthC Aalsmeer already does this with a swimming pool, a daycare, and a potted-plant exporter, from a ring at about 22 °C that then needs heat pumps (section 13). A 45–55 °C Lansing loop is warmer than that ring, so the pool exchanger is a better temperature match than Aalsmeer’s. This lane did not verify an annual Btu-per-square-foot figure, so the pool is not given an MWh budget here. It should be metered, on the community side of the agreement, with a published rate and with backup heat that does not depend on the data center (the same step-in logic as the greenhouse).

Do not describe the pool as the summer sink for a 150 MW campus. An indoor pool’s heating peak is still in winter. Its summer load is real and small.

Staffing (lifeguards, desk) is additional to the greenhouse jobs in section 11 and is **[unverified]** as a headcount.

## 10. Recommended size

**Phase 1: 4 hectares of greenhouse floor (about 10 acres), plus a pilot trout RAS, plus one indoor community pool and a packhouse, all on the former plant’s industrial land.**

| Item | Phase 1 | How it was set |
|---|---|---|
| Greenhouse floor | 4 ha (10 acres) | RII’s job and heat benchmarks are published at 10 acres and at 10 hectares. Ten acres is the smaller figure and matches a first grower. Ten hectares (the interviewee’s “10 megawatts”) is a later phase |
| Planning heat, annual | 12,000 MWh/year at 3,000 MWh/ha | **ASSUMPTION.** Range if the annual intensity is 2,000–4,130 MWh/ha: about 8,000–16,500 MWh/year |
| January, planning | about 2,180 MWh; average about 2.9 MW | 4 × 544 MWh/ha |
| Design heat at the interface | 6 MW at the 1.5 MW/ha assumption; band 4–8 MW using 1–2 MW/ha | Greenhouse-side heat pump and backup sized to the top of the band for the coldest hours. Data-center coolers unchanged |
| Share of a 150 MW IT phase | A few percent of the electric load, and a small fraction of available heat | RII’s mismatch finding, applied here. The rest of the heat stays on dry coolers until later rings exist |
| Land | About 20–30 acres including tanks, pool, packhouse, parking, and setbacks | **ASSUMPTION** on the yard area. Floor of the house itself is 10 acres. Does not depend on resolving 183 vs 434 |
| Later phase, only with a buyer | Up to about 10–12 ha of glass | 10 ha is RII’s “10 megawatts.” 12 ha is the size Innoserres has proposed next to QScale, still unbuilt. Still far below 150–400 MW |

Why not a 65-acre (26 ha) house in phase 1: that is the Virginia job headline (140–270 jobs in RII), and it wants a named regional buyer, a lighting power allocation, and a settled land survey. Leading with it overclaims both the market and the unleased acreage.

Why not a greenhouse sized to the 150 MW phase: at 1–2 MW/ha that is on the order of 75–150 hectares of glass. RII’s own interviews say a 50 MW data center already swamps a 10 MW greenhouse. The town-center pipe is the wrong substitute. It is 5–7 miles, and this file does not test its cost. The right next heat users after the 4 ha campus are whatever the corridor study can sign up, not a larger empty greenhouse.

Backup and continuity: greenhouse boiler or electric boiler sized for the design peak, so a data-center outage does not freeze the crop. RII and the organizer primer both put that equipment on the heat user. Storage of “more than 100 m³” is common on houses the size of the Straelen example (4 litres per m² there). **ASSUMPTION:** a 4 ha house would want on the order of 160 m³ if it copied that 4 L/m² rule. That is diurnal storage, not seasonal storage. Seasonal storage is out of scope for this note.

## 11. Jobs and revenue

**Jobs, phase 1, from RII Table 2 at 10 acres.** About 6.5 FTE (front office, growers, technicians) and about 35 part-time-equivalent hourly and seasonal workers. Order of magnitude: about 40 agriculture jobs, RII’s own comparison figure. These are RII’s interpolations from USDA employment data, and RII says they came out conservative next to Oasthouse’s 65-acre press estimate. They are not a Lansing payroll study.

A 65-acre build-out, if it ever happened, is the 140–270 total-job range in RII’s summary. It is not the recommendation.

RAS and pool jobs are extra and **[unverified]** as counts. A commercial trout RAS and a municipal pool each have a small permanent staff. They should be counted only after an operator is named.

**Revenue.** No Finger Lakes wholesale price was verified this session. The only full revenue stack opened in any form is the Saskatchewan abstract: tomato net return C$69.2/m² at C$3.50/kg and 55 kg/m², before anyone should convert currency or assume the yield in a lighted versus unlighted Ithaca house. At that yield, 4 ha would be 2,200 tonnes of tomatoes per year (55 kg/m² × 40,000 m²). **ASSUMPTION** that the yield transfers; the price does not. Treat revenue as “high enough in a cold-climate model that the authors found a benefit-cost ratio of 1.38,” and rerun it with a New York price before anyone puts a dollar in the term sheet.

The grower’s real energy saving on this site is the avoided propane or oil for heat, plus whatever the heat-supply agreement charges (including zero). Lighting electricity and purchased CO2 remain. Cornell’s “as much as 100 kWh per square foot per year” lighting figure, applied to the whole 4 ha, would be about 43 GWh per year of electricity. That is an upper bound for a fully lighted lettuce house, not a tomato requirement. It is large enough that the electric bill can matter more than the heat bill. The agreement has to show both.

## 12. Operator models

Three models, all compatible with the same heat interface. None is an existing Lansing contract.

**1. Lease to a commercial grower (preferred operating model).** The landlord or the town leases a pad. A grower builds and runs the house, buys or receives heat at the substation meter, and holds the lighting account, the CO2 contract, and the crop risk. This is the QScale pattern: the computing company offered heat; a separate agricultural group (André Gosselin / Innoserres) took the greenhouse, on land about one kilometre away, and still needed its own power allocation (section 13). RII’s contractual finding fits: financial and operating responsibilities written down, data center built first with a “CEA-ready” stub, greenhouse not allowed to delay the halls.

**2. Agricultural co-op.** Members (local farms, a school food program, a buyers’ club) own the house and hire a head grower. Heat is a utility service. This matches the politics of a community-benefit covenant better than a single private lessee, and it needs a champion this lane did not find. No existing Lansing greenhouse co-op was verified **[unverified]**.

**3. Cornell CALS as technical partner, not as the presumed owner.** The partnership that exists on paper is a research and extension relationship: CEA in Cornell CALS, GLASE with NYSERDA, a demonstrated lettuce system in Ithaca (URLs in section 7). The useful ask is a paid scope: low-temperature pipe trials at 45–55 °C under Ithaca light, a nutrient-management plan for the RAS solids, and a workforce module with SUNY or the local BOCES. An assumption that Cornell will operate 4 hectares commercially is not supported by anything opened here.

Public piece, in all three models: the town or a recreation district operates the pool, with heat contracted on the same meter standard and a backup heater the town controls. The data center does not run the pool.

Ownership of the pipes between the substation and the houses should sit with whoever holds the heat-supply agreement for the pad (grower, co-op, or a small thermal utility). The data center owns the stub up to the exchanger and the bypass. That split is the one RII’s operators described and the one the organizer primer assigns.

## 13. Precedents

| Precedent | What was verified | What not to claim |
|---|---|---|
| QScale Q01, Lévis, Québec | 16 March 2023: QScale will provide waste heat at no charge; Énergir implements projects; up to 96 MW, “enough energy to heat more than 15,000 Québec households”; first heat then anticipated by early 2024 (https://www.qscale.com/news/energir-vrt-waste-heat-recovery). Campus page markets waste-heat recovery “such as greenhouse agriculture” (https://www.qscale.com/q01-campus). 13 July 2021: Québec announced C$90 million for the computing center as a C$60 million loan and C$30 million in shares, and said recovered heat could serve new nearby greenhouses (Québec news release, URL in section 2). QScale the same day projected 2,800 tonnes of small fruit and more than 80,000 tonnes of tomatoes a year, and an agreement to use 140 MW (https://www.qscale.com/news/from-data-processing-to-food-self-sufficiency-financing). November 2024: preliminary geotechnical work on a bit more than 40 hectares of lots about 1 km away; Innoserres / André Gosselin; 12 MW of Hydro-Québec power for lights not yet approved (https://www.lavoixdelest.ca/affaires/2024/11/19/qscale-a-trouve-son-exploitant-agricole-pour-les-futures-serres-25LNKV4MIJFPBHHBYUE63RZZYI/). 9 February 2026: the data center is operating and the greenhouses have not been built; Québec prepared to cover 40% of the greenhouse electricity bill, capped at C$10 million through 2032–33, if the project is built; Innoserres’ complex described as 12 hectares (https://www.lesoleil.com/affaires/2026/02/09/quebec-prete-a-debourser-10-m-pour-le-projet-de-serres-voisines-a-qscale-TTH5V55BBBFZNBOG2JR2QQ3GWU/) | The computing center can be described as operating. The greenhouses, the 96 MW, the 15,000 homes, and the 80,000 tonnes of tomatoes cannot. Énergir’s French release says the project is supported by investors “tels qu’Investissement Québec”; that sentence does not say Investissement Québec wrote the C$90 million (https://energir.com/fr/a-propos/medias/nouvelles/valorisation-des-rejets-thermiques, verified 2026-10-04) |
| Agriport A7 and Microsoft, Netherlands | Colocation of a large greenhouse cluster and data centers; greenhouse heat mix in RII is CHP, geothermal, biomass, and boilers; provincial rule requires heat to be offered; municipality says residual heat is not yet used. 2014: greenhouse CHP electricity toward the data center. December 2025 scoping: about 25 °C residual heat, 10 MWth at one greenhouse, about 20 MWth later (URLs in section 2) | Not an operating proof that Microsoft or Google heat the tomato houses |
| NorthC Aalsmeer, Netherlands | Operating residual-heat delivery from a 14 MW site to a daycare, Sportcentrum De Waterlelie (a pool), and potted-plant exporter Fertiplant. Ring temperature about 22 °C, then heat pumps. A FloraHolland greenhouse study at 20–30 °C is still a study (URLs in section 2) | Do not call this a food-greenhouse district. The pool is the part that transfers to Lansing |
| Blockheating, Venlo, Netherlands | 9 May 2019: a container “placed with a grower in Venlo” to heat tomatoes, “maximum of 60 kilowatt of IT,” water “about sixty degrees Celsius” into the buffer tank. The stated focus was “supplying heat to more than 10 hectares of tomatoes,” which is an aim, not a measured delivery (https://www.hortidaily.com/article/9100979/data-center-next-to-tomato-greenhouse/, verified 2026-10-04). 22 September 2023: Blockheating B.V. was declared bankrupt on 12 September 2023 (https://www.hortidaily.com/article/9560853/developer-of-mobile-data-centers-next-to-greenhouse-declared-bankrupt/, verified 2026-10-04) | A 60 kW pilot is not a campus. The bankruptcy is why the grower, not the computing company, should own the Lansing house |
| Boden, Sweden, 300 m² greenhouse | Municipality: construction of a 300 m² house using excess heat from a Genesis Digital Assets data center of half a megawatt, with Systemair, RISE, and Luleå University of Technology involved (https://boden.se/en/community-and-development/community-development/bodenxt/bodenxt-news/2021-11-03-a-300-square-meter-smart-greenhouse). Systemair: waste heat “half a megawatt” for that 300 m² house, design down to −30 °C outdoors (https://www.systemair.com/en/expertise/case-studies/boden-greenhouse-sweden). GDA: heat source is a 600 kW air-cooled container; their calculation assumes about 35 °C air-side output and says a 55 °C liquid loop would heat much more area; the demo’s aim is training and crop trials, not a large commercial house (https://genesisdigitalassets.com/greenhouse-project/) | This lane did not verify that the operator is Hydro66. Hydro66 as the heat source is **[unverified]** here. The verified project is a pilot of a few hundred square metres on air-cooled heat, which is the temperature class RII says is hard to reuse |
| EcoDataCenter and WA3RM, Sweden | October 2022 announcement: excess heat from new EcoDataCenter sites would be studied for industrial-scale fish and greenhouse production with WA3RM; “on the drawing board”; first joint project “planned to launch.” EcoDataCenter’s Falun site was already sending waste heat to Falu Energi och Vatten for district heat and wood pellets (https://ecodatacenter.tech/press/a-new-circular-data-center-model-creates-sustainable-and-large-scale-food-production-3229148). Data Center Dynamics reported the same announcement and noted that further details were not shared (https://www.datacenterdynamics.com/en/news/ecodatacenter-to-reuse-heat-in-fish-farms-and-greenhouses/) | The fish farm and greenhouse were a plan in that announcement, not a counted operating load. Falun’s operating reuse was pellets and district heat |
| Green Mountain and Hima Seafood, Rjukan, Norway | System operating since autumn 2025. About 800 m between the data center and a land-based trout farm. Closed water loop: warm water to the farm, cooled water back to the data center. First phase tested at up to 1.75 MW; phase two aimed at 8 MW, still a feasibility study. Opening marked 4 February 2026 (https://press-en.greenmountain.no/pressreleases/green-mountain-and-hima-seafood-launch-groundbreaking-heat-reuse-project-3430566 and https://greenmountain.no/sustainability/heat-reuse/, verified 2026-10-03). RII’s literature review also notes an earlier Green Mountain trout pilot; the Rjukan project is the one with dates and megawatts on the company’s own pages | Trout, not tilapia. 1.75 MW now, not tens of MW. Norway power prices and a purpose-built fish company do not transfer as a Lansing cash flow |
| Deep Green and Lansing Board of Water & Light | **Lansing, Michigan.** BWL page: a proposed 24 MW data center, “$120+ million,” free heat into BWL’s hot-water system, closed-loop cooling, “negligible” water use, construction “expected to begin in the spring of 2026” if approvals are secured (https://www.lbwl.com/community/newsroom/2025-11-05-deep-green-proposes-120-million-sustainable-data-center-investment, verified 2026-10-03). WKAR, 29 January 2026: BWL’s general manager describing talks toward a 20-year contract, heat “for free,” a 25% cut in natural gas on the heating side of the utility, and $1.1 million a year of savings to hot-water customers (https://www.wkar.org/wkar-news/2026-01-29/bwl-in-talks-for-20-year-contract-with-company-behind-proposed-lansing-data-center, verified 2026-10-03) | Not Lansing, New York. Not an operating plant on the pages opened. The 25% and $1.1 million figures are the utility manager’s description of a proposal |

RII also records a 2010 TeleCity (now Equinix) nursery link near Paris, and Nordic district-heating connections (Bahnhof, Telia, and others) that heat cities rather than greenhouses. Those were not re-opened as primary pages this session; they remain RII’s citations. They do not change the Lansing sizing.

## 14. HDR regenerative-design mapping

HDR’s frame in the site pack is Community, Ecology, and Health, with the domains human health, community, air, carbon, water, biodiversity, and nutrients.

| Domain | What this campus can honestly say |
|---|---|
| Community | About 40 greenhouse jobs at 10 acres (RII estimate), a public pool, and winter vegetables on a site the town already knows as a power plant. No designated disadvantaged community (HDR pack). Poverty percentile on the pack is 28th. Do not add an equity percentage |
| Human health | Winter food and a place to swim. The pack’s own health percentiles for the site are mixed and mostly middling; they are not a reason to claim a health outcome from the greenhouse |
| Air | Pack: local AQI described as good, PM2.5 at the 4th percentile. A greenhouse that does not burn propane on site avoids a new combustion source at the house. Backup boilers will still exist for outages |
| Carbon | Heat that would have been propane or oil at the greenhouse is displaced, then the grower may buy liquid CO2, and lights can add a large electric load. Net carbon is a calculation for the impact model, not a claim in this note. HDR’s future-climate slides (more days above 90 °F) raise the summer cooling load over the life of the glass |
| Water | Closed-loop cooling is the applicant’s design. The 1.44 MGD current withdrawal and the 1.008 MGD renewal request belong to the existing industrial site (ENB, 29 Oct 2025). Heat reuse does not get to count those gallons as saved |
| Biodiversity | Build on the disturbed industrial pad. The pack says agriculture is the greatest biodiversity threat in the area. A new greenhouse on intact habitat would cut against that finding |
| Nutrients | Closed RAS and fertigation, no new discharge toward a phosphorus-impaired lake, solids under a nutrient plan. Aligns with the TMDL’s 30% watershed reduction goal only as “do not add load.” Not a restoration credit |
| Ecology, summed | The campus is a small biological system (crop, fish, captured nutrients) next to a large computing load. Its ecological case is containment and a winter use of heat, plus the dry coolers continuing to carry summer |

## 15. Assumptions log

| ID | Assumption | Why |
|---|---|---|
| A1 | 3,000 MWh/ha/year greenhouse heat | Between Straelen measured 2,000 (milder climate) and a prairie tomato model near 4,130 whose PDF was not opened |
| A2 | Monthly shape = Ithaca HDD base 65 °F | Setpoint-adjacent and fully sourced. Ignores solar gain, so winter days are high and summer is slightly high |
| A3 | Design interface 1.5 MW/ha, band 1–2 | RII comment 1 MW/ha; Straelen measurement 1.8 MW/ha |
| A4 | Phase-1 floor area 4 ha | Smallest RII benchmark that still has a job estimate; land and market do not support leading with 26 ha |
| A5 | Yard area 20–30 acres | Pad plus RAS, pool, packhouse, parking. Not from a site plan |
| A6 | Buffer tank about 4 L per m² (about 160 m³ at 4 ha) | Copied from the Straelen houses’ reported common practice |
| A7 | Trout, pilot scale, no MW claim | FAO temperature window verified; a Lansing production tonnage was not |
| A8 | Greenhouse sited on land already in industrial use | Resolves the 183-versus-434 conflict by not needing the disputed remainder |
| A9 | Cornell is a technical partner | CEA and GLASE exist. No operating agreement exists in the sources |
| A10 | Lighting electricity can exceed heat | Cornell’s “as much as 100 kWh/ft²/year” is an upper bound, not the tomato design |

## 16. Lane status

**Done**

- Organizer RII report read for temperatures, the 1 MW/ha comment, the 2 acres/MW literature ratio, jobs Table 2, summer mismatch, absorption-chiller limits, aquaculture and packhouse roles, and the Agriport case study.
- HDR site pack read for phosphorus impairment, no disadvantaged community, biodiversity, and the future-climate lines.
- DATA HEAT and the heat-reuse primer read for QScale, 45–65 °C liquid-cooling returns, and pools as a low-density host.
- Ithaca 1991–2020 monthly normals and HDD taken from NRCC and checked against NCEI.
- Monthly MWh-per-hectare table produced, labeled as an assumption, with a summer-zeroed column.
- Recommended size: 4 ha now, optional 10–12 ha later, with the megawatt comparison to 150 MW stated.
- Land: 183-acre lease and FEAF ±434 / ±125 disturbed, and the conflict left unresolved.
- Water: ENB withdrawal facts separated from any heat-reuse water claim.
- Phosphorus: DEC TMDL (30%, agriculture the largest source) and a no-new-discharge design, without a lake-restoration claim.
- Precedents opened: QScale/Énergir, Innoserres status through February 2026, Agriport rules and the “not yet used” municipal statement, Boden/GDA pilot, EcoDataCenter/WA3RM announcement, Green Mountain/Hima at 1.75 MW, Deep Green in Lansing, Michigan.
- Operator models: lessee grower, co-op, Cornell as technical partner, town as pool operator.
- HDR domain table written to the strength of those sources.

**Missing**

- An hourly Ithaca greenhouse model (TMY, cover U-value, energy screen, tomato versus lettuce setpoint). The 3,000 MWh/ha figure should be replaced by that model before it is used as an engineering input.
- ASHRAE 99% design temperature for the site, so the 1.5 MW/ha peak is still a band.
- Publisher PDF for the Saskatchewan tomato heating paper; US wholesale prices; a verified pool energy intensity; a RAS megawatt estimate grounded in a sized tank.
- April 2026 status of the 1.008 MGD withdrawal (this lane’s newest DEC page is the 29 October 2025 notice, still pending).
- A parcel map that shows which acres are inside the 183-acre lease, which are disturbed, and which could hold a 4 ha house without new habitat conversion.
- Confirmation that Hydro66, as a company, operated the Boden greenhouse. The pages opened name Genesis Digital Assets.
- A named grower, co-op, or pool district. The models are structures, not partners.
- NYSEG moratorium docket. Used as a project constraint, not re-read here.
- Oasthouse Ventures press release behind RII’s 65-acre job counts.

**Open questions**

- Will the heat loop actually be 45–55 °C or 55–65 °C? The coldest-day heat pump, the pipe area, and whether adsorption cooling is even worth pricing all move with that choice.
- Is the lighting design a lit winter tomato house or a lettuce house? The electric load can dwarf the heat load.
- Who holds crop risk if the data center is delayed or cancelled after the house is built? Backup heat has to be priced in the grower’s pro forma, not assumed away by the covenant.
- Does any of the FEAF’s ±434 acres sit outside wetlands, the coal-pile cap, and the transmission yard in a shape that fits a 10-acre glass roof?
- Should the packhouse’s summer refrigeration be left electric, given that absorption cooling wants hotter water than a 45–55 °C loop reliably supplies?

## Sources (opened 2026-10-03)

- RII, *Colocating Data Centers & Greenhouses*, June 2025: https://resourceinnovation.org/wp-content/uploads/2026/02/Colocating-Data-Centers_Greenhouses-RII-Virginia.pdf
- Organizer extracts (local, outrank web where they conflict): `resources/text/2026_10_01_Hackathon_NYU_-_Suburban_Site_-_Lake_Hawkeye.txt`; `resources/text/DATA_HEAT_-_Sector_Couling_Data_Centeres_and_District_Energy_-_Market_Development_Guide_and_Appendicies_-_3MAR26.txt`; `resources/text/20230623_Data_Centers_HeatReuse_101_3.2.docx.txt`
- NRCC Ithaca normals: https://www.nrcc.cornell.edu/wxstation/ithaca/normal.html
- NCEI station USC00304174 monthly normals: https://www.ncei.noaa.gov/access/services/data/v1?dataset=normals-monthly-1991-2020&stations=USC00304174&format=pdf
- Chaigneau and Nienborg, ISEC 2024: https://doi.org/10.52825/isec.v1i.1162
- TeraWulf Cayuga lease release, 14 Aug 2025: https://investors.terawulf.com/news-events/press-releases/detail/113/terawulf-secures-long-term-ground-lease-at-cayuga-site-to-expand-high-performance-computing-infrastructure
- Lake Hawkeye FEAF Part 1 (Town of Lansing file): https://mccmeetingspublic.blob.core.usgovcloudapi.net/lansingny-meet-31cae87722a349cf9947532226835936/ITEM-Attachment-001-78dcf4833efb4ed695a76cddf01566c4.pdf
- Applicants’ zoning appeal, 5 Nov 2025: https://mccmeetingspublic.blob.core.usgovcloudapi.net/lansingny-meet-4c84f6223a774dd5ae8446cfe8566f81/ITEM-Attachment-001-3ea75824119d4920aefd7569b3dc87fc.pdf
- DEC ENB, 29 Oct 2025, Cayuga Operating Company: https://dec.ny.gov/news/environmental-notice-bulletin/2025-10-29/completed-application/town-of-lansing-cayuga-operating-company-llc
- DEC Cayuga Lake TMDL press release, 9 Sep 2024: https://dec.ny.gov/news/press-releases/2024/9/dec-announces-epa-approved-pollution-prevention-plan-for-cayuga-lake-watershed
- DEC PWL segment 0705-0040: https://extapps.dec.ny.gov/data/WQP/PWL/0705-0040.html
- FAO rainbow trout culture sheet: https://www.fao.org/fishery/docs/DOCUMENT/aquaculture/CulturedSpecies/file/en/en_rainbowtrout.htm
- Cornell CEA: https://cea.cals.cornell.edu/about-cea/
- QScale / Énergir, 16 Mar 2023: https://www.qscale.com/news/energir-vrt-waste-heat-recovery
- La Voix de l’Est, 19 Nov 2024: https://www.lavoixdelest.ca/affaires/2024/11/19/qscale-a-trouve-son-exploitant-agricole-pour-les-futures-serres-25LNKV4MIJFPBHHBYUE63RZZYI/
- Le Soleil, 9 Feb 2026: https://www.lesoleil.com/affaires/2026/02/09/quebec-prete-a-debourser-10-m-pour-le-projet-de-serres-voisines-a-qscale-TTH5V55BBBFZNBOG2JR2QQ3GWU/
- Noord-Holland data-center guideline (English PDF): https://www.noord-holland.nl/bestanden/pdf/Richtlijn%20vestigingsvoorwaarden%20engelse%20vertaling.pdf
- Gemeente Hollands Kroon, datacenters: https://www.hollandskroon.nl/ontwikkelingen/datacenters/
- Groenten & Fruit, minister and Agriport heat: https://www.gfactueel.nl/minister-warmte-datacenter-kassen-agriport-voorbeeld/
- Boden municipality greenhouse note: https://boden.se/en/community-and-development/community-development/bodenxt/bodenxt-news/2021-11-03-a-300-square-meter-smart-greenhouse
- Genesis Digital Assets greenhouse project: https://genesisdigitalassets.com/greenhouse-project/
- EcoDataCenter / WA3RM, 2022: https://ecodatacenter.tech/press/a-new-circular-data-center-model-creates-sustainable-and-large-scale-food-production-3229148
- Green Mountain and Hima Seafood, 4 Feb 2026: https://press-en.greenmountain.no/pressreleases/green-mountain-and-hima-seafood-launch-groundbreaking-heat-reuse-project-3430566
- BWL on Deep Green, Lansing, Michigan: https://www.lbwl.com/community/newsroom/2025-11-05-deep-green-proposes-120-million-sustainable-data-center-investment
- WKAR, 29 Jan 2026, Lansing, Michigan: https://www.wkar.org/wkar-news/2026-01-29/bwl-in-talks-for-20-year-contract-with-company-behind-proposed-lansing-data-center

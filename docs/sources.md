# Thermal Commons: consolidated bibliography

Team Thermal Commons (Harsh Agarwal, Linson Lee, Philip Matchev). Proposal: the Thermal Commons co-op, a binding heat-reuse covenant for Lake Hawkeye (TeraWulf, former Cayuga coal plant, Lansing NY); Site 1 (111 8th Ave, NYC) is the comparison.

**How this list was built.** We ran a script over every `.md/.yaml/.json/.txt/.csv` file in `docs/`, `research/`, `config/` and over `outputs/site2.json`. It found 332 unique URLs. Every external one is listed below exactly once. Excluded: `localhost` demo links, and our own repo (`github.com/harshagarwalnyu/Data-Center-Heat-Reuse`).

**Conventions.**
- *Year* is the publication year when the URL or `research/verification.md` dates the document. `n.d.` means the year was not captured. We did not guess.
- *Title* is the document title where our notes recorded it. Otherwise it is a short descriptive title taken from the URL slug, marked with `~`.
- *Used for* is what the citing repo file uses the source for. *Cited in* lists the main repo files that cite it.
- Rows marked **V** were checked in `research/verification.md` (verified 2026-10-03). Other rows were collected by research lanes and are cited as-is. `research/verification.md` overrides any older file it contradicts.
- Rows marked **M** feed the model's numbers directly: they are in `outputs/site2.json` `sources` or in `config/*.yaml`.

---

## Organizer materials (outrank web sources)

Originals are in `resources/raw/`; text extracts are in `resources/text/`. The publisher is the organizer pack: NYU Business Analytics Club, HDR and Grundfos.

| Title (file) | Publisher / author | Year | Used for |
|---|---|---|---|
| NYU Hackathon Data Center Heat Reuse Challenge R1 | NYU BAC / HDR / Grundfos | 2026 | Brief, deliverables |
| NYU BAC Hackathon HDR Waste Heat Reuse 2026.1002 | HDR | 2026 | Regenerative design lenses; ERF/ERE definitions (HDR p17-18, per `research/digest-organizer.md`) |
| NYU Data Center Heat Reuse Hackathon Deck: Challenge and Workshop opening slides | Organizers | 2026 | Brief, judging context |
| 2026_10_01 Hackathon NYU: Suburban Site: Lake Hawkeye | Organizers | 2026 | Site 2 pack. It notes no designated disadvantaged communities nearby |
| 2026_10_01 Hackathon NYU: Urban Site: 111 8th Ave | Organizers | 2026 | Site 1 comparison pack |
| Topic 5: Heat reuse, Connecting DC to DE systems v5 | Organizers | n.d. | **M** Heat pump COP 2-5; 4th-generation networks at 50-60 C |
| Data Centers Heat Reuse 101 (20230623, v3.2) | Open Compute Project | 2023 | **M** Direct-liquid-cooling return 45-65 C (p6); cost split (p7-8) |
| CBS Data center white paper: District Heating | CBS | n.d. | **M** 10 MW heat pump ~EUR 6M; ~9-year payback; connection cost vs distance (p13, 17, 19) |
| Colocating Data Centers and Greenhouses (Virginia) | Resource Innovation Institute (RII) | 2025 | **M** 1 MWth/ha; 2 acres/MW; jobs (Table 2). Web PDF: https://resourceinnovation.org/wp-content/uploads/2026/02/Colocating-Data-Centers_Greenhouses-RII-Virginia.pdf |
| DATA HEAT: Sector Coupling Data Centers and District Energy, Market Development Guide (3 Mar 2026) | NYSERDA | 2026 | NY program context. Web PDF: https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/Programs/Large-Scale-Thermal/DATA-HEAT---Sector-Coupling-Data-Centers-and-District-Energy.pdf |
| US Policy Landscape: Data Center Heat Reuse | David Gardener & Associates | n.d. | Policy background |
| Every Drop Counts (Water Scarcity Paper 2026) | Grundfos | 2026 | Water lens framing |
| Developing Community and Data Center Synergies With District Energy | CenTrio | n.d. | District-energy precedent |
| Danfoss White Paper Sample; Danfoss Waste Heat | Danfoss | n.d. | Heat-recovery engineering background |
| Driving sustainable data centres | n.d. [unverified publisher] | n.d. | Background |
| IDEA: Thermal Energy Storage for Data Centers | IDEA / CB&I | n.d. | Storage background |
| iGRID Playbook | n.d. [unverified publisher] | n.d. | Background |
| Resource Efficient Decarbonization | n.d. [unverified publisher] | n.d. | Background |
| Williams College Energy Transition Strategy v1.0 | urbs | n.d. | Campus thermal-network precedent |
| June 10th FPCJ Meeting Summary (compiled) | n.d. [unverified publisher] | n.d. | Background |
| District Energy Application Guide (2018) | n.d. [unverified publisher] | 2018 | Engineering background |
| Organizer video playlist (lectures and panels) | Organizers (YouTube) | 2026 | Expert quotes (`docs/research/video-quotes.md`); index in `research/videos.md`. https://www.youtube.com/playlist?list=PLrZMAz7fZps09Vy9XfEzJNIg8mIudPjKk |

The individual videos cited in `research/videos.md` and `docs/research/video-quotes.md` are listed in the appendix at the end of this file. Their titles are in `research/videos.md`.

---

## Site

### Lake Hawkeye project (TeraWulf / Cayuga site)

| Title | Publisher | Year | URL | Used for |
|---|---|---|---|---|
| TeraWulf Q2 2026 earnings release | TeraWulf (SEC EDGAR) | 2026 | https://www.sec.gov/Archives/edgar/data/1083301/000108330126000162/a_wulfearningsreleaseq22026.htm | **V M** ~400 MW gross / ~320 MW critical IT; operations ~2029 (rows 3a, 3b) |
| TeraWulf Form 8-K (Cayuga ground lease) | TeraWulf (SEC EDGAR) | 2025 | https://www.sec.gov/Archives/edgar/data/1083301/000110465925078086/tm2523008d1_8k.htm | **V** Lease and project facts |
| TeraWulf 8-K Exhibit 99.1 (press release) | TeraWulf (SEC EDGAR) | 2025 | https://www.sec.gov/Archives/edgar/data/1083301/000110465925078086/tm2523008d1_ex99-1.htm | Stakeholder context |
| TeraWulf secures long-term ground lease at Cayuga site | TeraWulf investor relations | 2025 | https://investors.terawulf.com/news-events/press-releases/detail/113/terawulf-secures-long-term-ground-lease-at-cayuga-site-to-expand-high-performance-computing-infrastructure | **V** 138 MW phase-1 figure (stale; row 3a) |
| TeraWulf investor site; corporate site | TeraWulf | n.d. | https://investors.terawulf.com ; https://www.terawulf.com | Developer background |
| Lake Hawkeye Data project site (home, overview) | Lake Hawkeye Data (TeraWulf) | n.d. | https://lakehawkeyedata.com ; https://www.lakehawkeyedata.com/project-overview | 3 buildings, ~150 MW phase 1 (basis not stated) |
| Closed-loop cooling | Lake Hawkeye Data | n.d. | https://lakehawkeyedata.com/closed-loop-cooling (also www.) | **V** Sealed glycol loop with dry coolers; no consumptive water during operation; fluid renewal every 7-15 years (developer claim) |
| FAQ | Lake Hawkeye Data | n.d. | https://www.lakehawkeyedata.com/faq | Cooling details, judge Q&A |
| Attachment C: Independent Assessment of the Proposed Cayuga Data Campus | Clean Cayuga Lake | 2025 | https://cleancayugalake.org/wp-content/uploads/2025/12/Attachment_C_Independent_Assessment_of_the_Proposed_Cayuga_Data_Campus-_2.pdf | Opposition's technical review of cooling |
| Clean Cayuga Lake (home) | Clean Cayuga Lake | n.d. | https://www.cleancayugalake.org | Stakeholder |
| Cayuga Operating water withdrawal permit | NYS DEC | 2026 | https://dec.ny.gov/sites/default/files/2026-04/cayugaoperatingwwpermit.pdf | **V** 1.008 MGD renewal; holder Cayuga Operating Company LLC; effective 4/13/2026 to 4/30/2031; water-withdrawal permit only, not SPDES (rows 5a-5c) |
| ENB: completed application, Cayuga Operating Company LLC | NYS DEC | 2025 | https://dec.ny.gov/news/environmental-notice-bulletin/2025-10-29/completed-application/town-of-lansing-cayuga-operating-company-llc | Site permitting (greenhouse anchor) |
| ENB: completed application, Cayuga Salt Mine | NYS DEC | 2024 | https://dec.ny.gov/news/environmental-notice-bulletin/2024-11-20/completed-application/towns-of-covert-lansing-and-ulysses-cayuga-salt-mine | Nearby industrial offtaker |
| Cayuga power station | Global Energy Monitor (gem.wiki) | n.d. | https://www.gem.wiki/Cayuga_power_station_(New_York) | Coal units retired 2019 (secondary source; row 9f-ii) |
| ~Cayuga Power Plant location | TopoQuest | n.d. | https://topoquest.com/place/new-york/building/cayuga-power-plant/2514600 | Site coordinates |
| ~Place record | Mapcarta | n.d. | https://mapcarta.com/26816200 | Offtaker distances |
| Energy Community map | DOE / NETL | n.d. | https://arcgis.netl.doe.gov/portal/apps/experiencebuilder/experience/?id=a2ec4f42a4434600b660c874c4381199 | Energy-community check (UNVERIFIABLE; row 9f-ii) |
| Geocoding | OpenStreetMap Nominatim | n.d. | https://nominatim.openstreetmap.org | Offtaker distances |

### Lansing community, demand and offtakers

| Title | Publisher | Year | URL | Used for |
|---|---|---|---|---|
| ACS 5-yr 2023 B25040: House heating fuel | US Census Bureau | 2023 | https://data.census.gov/table/ACSDT5Y2023.B25040 | **M** Share of homes on propane/oil (`config/impact.yaml`) |
| ACS 5-yr 2023 B25001 (housing units), B25002 (occupancy) | US Census Bureau | 2023 | https://data.census.gov/table/ACSDT5Y2023.B25001 ; https://data.census.gov/table/ACSDT5Y2023.B25002 | Household counts |
| Lansing town / Lansing village profiles; data.census.gov | US Census Bureau | n.d. | https://data.census.gov/profile/Lansing_town ; https://data.census.gov/profile/Lansing_village ; https://data.census.gov | Demographics |
| Lansing (NY) place profile | Data Commons | n.d. | https://datacommons.org/place/wikidataId/Q5055417 | Demographics cross-check |
| Town of Lansing; Lansing Community Library; Lansing Central Schools; Lansing Recreation | Respective owners | n.d. | https://www.lansingtownny.gov ; https://www.lansinglibrary.org ; https://www.lansingschools.org ; https://www.lansingrec.com | Town-center anchors, ~5-7 miles from the plant |
| School list, Lansing CSD | NCES Common Core of Data | n.d. | https://nces.ed.gov/ccd/schoolsearch/school_list.asp?DistrictID=3616710&Search=1 | School anchor loads |
| Town of Lansing meeting packet | Town of Lansing (MCC Meetings) | n.d. | https://mccmeetings.blob.core.usgovcloudapi.net/lansingny-pubu/MEET-Packet-c61776381c3241a19bb2188b87a66323.pdf | Offtakers |
| Town of Lansing meeting attachments (3 PDFs) | Town of Lansing (MCC Meetings) | n.d. | https://mccmeetingspublic.blob.core.usgovcloudapi.net/lansingny-meet-31cae87722a349cf9947532226835936/ITEM-Attachment-001-78dcf4833efb4ed695a76cddf01566c4.pdf ; https://mccmeetingspublic.blob.core.usgovcloudapi.net/lansingny-meet-4c84f6223a774dd5ae8446cfe8566f81/ITEM-Attachment-001-3ea75824119d4920aefd7569b3dc87fc.pdf ; https://mccmeetingspublic.blob.core.usgovcloudapi.net/lansingny-meet-bea10836c3b84b16965c2d23450ae349/ITEM-Attachment-001-18802fdf921e47179751d6bc4d6039dc.pdf | Greenhouse anchor and offtakers |
| Cargill Lansing NY careers; Cargill | Cargill | n.d. | https://careers.cargill.com/en/lansing-ny ; https://www.cargill.com | Salt-mine industrial offtaker |
| Cayuga Landscape; Dutch Harvest Farm | Respective owners | n.d. | https://www.cayugalandscape.com ; https://www.dutchharvestfarm.com | Local agriculture/horticulture offtakers |
| Cornell Business & Technology Park; Ithaca Tompkins Airport | Respective owners | n.d. | https://cornellbtp.com ; https://flyithaca.com | Nearby loads |
| Cornell Energy & Sustainability | Cornell University | n.d. | https://energyandsustainability.cornell.edu | Regional thermal context (lake source cooling) |
| Tompkins County Planning | Tompkins County | n.d. | https://www.tompkinscountyny.gov/planning | Planning context |
| CCE Tompkins Open Farm Days; CCE Tompkins energy update | Cornell Cooperative Extension Tompkins | n.d. | https://ccetompkins.org/agriculture/ag-events/open-farm-days/saturday-open-farms ; https://energy.ccetompkins.org/general-updates/aarons-test-post/ | Stakeholder engagement |

### Site 1: 111 8th Ave, NYC (comparison)

| Title | Publisher | Year | URL | Used for |
|---|---|---|---|---|
| 111 Eighth Avenue | Wikipedia | n.d. | https://en.wikipedia.org/wiki/111_Eighth_Avenue | Building facts |
| Chelsea Market; Elliott-Chelsea Houses; Fulton Houses; Bayard Rustin Educational Complex; High Line; London Terrace | Wikipedia | n.d. | https://en.wikipedia.org/wiki/Chelsea_Market ; https://en.wikipedia.org/wiki/Elliott-Chelsea_Houses ; https://en.wikipedia.org/wiki/Fulton_Houses ; https://en.wikipedia.org/wiki/Bayard_Rustin_Educational_Complex ; https://en.wikipedia.org/wiki/High_Line ; https://en.wikipedia.org/wiki/London_Terrace | Neighbor offtakers (NYCHA units) |
| Fulton/Elliott-Chelsea redevelopment | fultonelliottchelsea.com | n.d. | https://fultonelliottchelsea.com/ | NYCHA redevelopment context |
| Steam rates and tariffs | Con Edison | n.d. | https://www.coned.com/en/business-partners/business-opportunities/steam-rates-tariffs | **M** Steam $41.53/Mlb (`research/facts-site1.md`) |
| Local Law 97 | NYC Buildings | n.d. | https://www.nyc.gov/site/buildings/codes/ll97-greenhouse-gas-emissions-reductions.page | Site 1 compliance driver |
| General homepages cited without a specific page: accelerator.nyc, buildingstudio.com, callen-lorde.org, coned.com, databank.com, datacenterknowledge.com, datacentermap.com, datacenters.com, edf.org, epri.com, hudsonyardsnewyork.com, missiongeo.org, mountsinai.org/locations/chelsea, myschools.nyc, newyorkyimby.com, northwell.edu, ny.gov, nyc.gov, nycgovparks.org, schools.nyc.gov, sec.gov, sustainabilitymag.com, utilitydive.com, weforum.org, ymcanyc.org | Various | n.d. | (domains as listed) | Site 1 background in `research/facts-site1.md`. These are homepage-level references; no specific claim can be traced to them |

---

## Climate (and lake ecology)

| Title | Publisher | Year | URL | Used for |
|---|---|---|---|---|
| TMYx 2009-2023, Ithaca Tompkins Rgnl AP 725155 | Climate.OneBuilding.Org | 2023 | https://climate.onebuilding.org/WMO_Region_4_North_and_Central_America/USA_United_States_of_America/NY_New_York/USA_NY_Ithaca.Tompkins.Rgnl.AP.725155_TMYx.2009-2023.zip | **M** Hourly weather driving the 8,760-hour heat-demand model |
| TMYx 2009-2023, Ithaca-Tompkins County AP 725270 (alternative station) | Climate.OneBuilding.Org | 2023 | https://climate.onebuilding.org/WMO_Region_4_North_and_Central_America/USA_United_States_of_America/NY_New_York/NY_Ithaca-Tompkins.County.AP.725270_TMYx.2009-2023.zip | Station cross-check (`research/facts-site2.md`) |
| Climate.OneBuilding (home) | Climate.OneBuilding.Org | n.d. | https://climate.onebuilding.org | Weather data portal |
| Ithaca climate normals | Northeast Regional Climate Center (Cornell) | n.d. | https://www.nrcc.cornell.edu/wxstation/ithaca/normal.html ; https://www.nrcc.cornell.edu | Degree-day / demand checks |
| Monthly normals 1991-2020, station USC00304174 | NOAA NCEI | n.d. | https://www.ncei.noaa.gov/access/services/data/v1?dataset=normals-monthly-1991-2020&stations=USC00304174&format=pdf | Greenhouse heating-load climate |
| Priority Waterbodies List segment 0705-0040 (Cayuga Lake) | NYS DEC | n.d. | https://extapps.dec.ny.gov/data/WQP/PWL/0705-0040.html | Water and ecology lens (regenerative scorecard) |
| DEC announces EPA-approved pollution prevention plan for Cayuga Lake watershed | NYS DEC | 2024 | https://dec.ny.gov/news/press-releases/2024/9/dec-announces-epa-approved-pollution-prevention-plan-for-cayuga-lake-watershed | Nutrient (phosphorus) lens for greenhouse/aquaculture design |
| ~Ecological impacts of a data center on Cayuga Lake | The Cornell Daily Sun | 2026 | https://www.cornellsun.com/article/2026/09/ecological-impacts-of-a-data-center-on-cayuga-lake | Stakeholder ecology concerns |
| ~Data centers' water use | Water Footprint Calculator | n.d. | https://www.watercalculator.org/footprint/data-centers-water-use/ | Water red-team context |

---

## Prices

| Title | Publisher | Year | URL | Used for |
|---|---|---|---|---|
| Average Home Heating Oil (and propane) Prices | NYSERDA | 2026 | https://www.nyserda.ny.gov/Energy-Prices/Home-Heating-Oil/Average-Home-Heating-Oil-Prices | **V M** Central NY propane base $3.10/gal (season range 2.74-3.46) (rows 7a-7c) |
| Monthly Average Home Heating Oil Prices | NYSERDA | 2026 | https://www.nyserda.ny.gov/Energy-Prices/Home-Heating-Oil/Monthly-Average-Home-Heating-Oil-Prices | **V M** Oil $5.186/gal Central NY monthly average |
| Weekly Energy and Fuels Report, 2026-09-25 | NYSERDA | 2026 | https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/EDPPP/Energy-Prices/Weekly-Report/WeeklyEnergyandFuelsReport_20260925.pdf | **V** Price cross-check |
| Heating fuels (energy prices) | NYSERDA | n.d. | https://www.nyserda.ny.gov/Researchers-and-Policymakers/Energy-Prices/Heating-Fuels | Price background |
| Electric Power Monthly Table 5.6.A | US EIA | 2026 | https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a | **M** NY industrial 10.81 c/kWh, July 2026 (central heat-pump electricity rate) |
| Natural gas prices summary | US EIA | n.d. | https://www.eia.gov/dnav/ng/ng_pri_sum_a_EPG0_PRS_DMcf_m.htm | Gas price reference (not available in Lansing; see moratorium) |
| ~Electricity cost, Ithaca, Tompkins County | EnergySage | n.d. | https://www.energysage.com/local-data/electricity-cost/ny/tompkins-county/ithaca/ | Residential rate cross-check |
| Data Centre Construction Cost Index 2025 | Turner & Townsend | 2025 | https://reports.turnerandtownsend.com/data-centre-construction-cost-index-2025/ | **M** US$6.6-13.3 per W; benchmark for the community-benefit share (`config/finance.yaml`) |
| MIT OCW RES.ENV-007 Geothermal Energy Networks, lecture 7 (and course page) | MIT OpenCourseWare | 2025 | https://ocw.mit.edu/courses/res-env-007-geothermal-energy-networks-transforming-our-thermal-energy-system-january-iap-2025/mitres_env_007_lec07_3.pdf ; https://ocw.mit.edu/courses/res-env-007-geothermal-energy-networks-transforming-our-thermal-energy-system-january-iap-2025/ | **M** Networked geothermal ~$50k per residence, ~1/3 of it in-home |

---

## Emissions

| Title | Publisher | Year | URL | Used for |
|---|---|---|---|---|
| GHG Emission Factors Hub (2025) | US EPA | 2025 | https://www.epa.gov/climateleadership/ghg-emission-factors-hub ; https://www.epa.gov/system/files/documents/2025-01/ghg-emission-factors-hub-2025.pdf | **V M** Propane 62.87, oil 73.96, gas 53.06 kg CO2/MMBtu (propane corrected; row 10d) |
| eGRID2023 (Rev 2) summary tables | US EPA | 2025 | https://www.epa.gov/egrid ; https://www.epa.gov/egrid/summary-data ; https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.pdf | **V M** NYUP 242.8 and NYCW 865.7 lb CO2e/MWh (row 10a) |
| 40 CFR Part 98 Subpart C, Appendix C | GovInfo (eCFR) | 2020 | https://www.govinfo.gov/content/pkg/CFR-2020-title40-vol23/xml/CFR-2020-title40-vol23-part98-subpartC-appC.xml | **V** Fuel emission-factor cross-check |
| Greenhouse Gas Equivalencies Calculator: calculations and references | US EPA | n.d. | https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references | **M** Car / home equivalents (`config/impact.yaml`) |
| Greenhouse gas emissions from a typical passenger vehicle | US EPA | n.d. | https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle | Car-equivalent check |
| NYISO | New York ISO | n.d. | https://www.nyiso.com | **M** Grid context for heat-pump electricity (`config/impact.yaml`) |

---

## Engineering

| Title | Publisher | Year | URL | Used for |
|---|---|---|---|---|
| ~Blackwell platform water efficiency and liquid cooling | NVIDIA blog | n.d. | https://blogs.nvidia.com/blog/blackwell-platform-water-efficiency-liquid-cooling-data-centers-ai-factories/ | Liquid-cooling supply temperatures |
| ~Liquid cooling for AI factories | NVIDIA blog | n.d. | https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/ | Same |
| ~NVIDIA Vera Rubin POD | NVIDIA Developer blog | n.d. | https://developer.nvidia.com/blog/nvidia-vera-rubin-pod-seven-chips-five-rack-scale-systems-one-ai-supercomputer/ | Next-generation rack thermal envelope |
| DGX GB200 user guide: hardware | NVIDIA Docs | n.d. | https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html | Coolant temperature specs |
| Lenovo NVIDIA GB300 NVL72 rack-scale AI (LP2357) | Lenovo Press | n.d. | https://lenovopress.lenovo.com/lp2357-lenovo-nvidia-gb300-nvl72-rack-scale-ai | Rack heat and coolant specs |
| Thermal Guidelines 5th ed., reference card | ASHRAE | n.d. | https://www.ashrae.org/File%20Library/Technical%20Resources/Bookstore/Supplemental%20Files/Therm-Gdlns-5th-R-E-RefCard.pdf | Liquid-cooling classes (W-classes) |
| About CEA | Cornell CALS Controlled Environment Agriculture | n.d. | https://cea.cals.cornell.edu/about-cea/ | Greenhouse anchor partner |
| ~Cornell CEA 2003 | Controlled Environments (USDA NCERA-101) | 2003 | https://www.controlledenvironments.org/wp-content/uploads/sites/6/2017/06/corncea_2003.pdf | Greenhouse energy intensity |
| ISEC conference paper (doi 10.52825/isec.v1i.1162) | TIB Open Publishing | n.d. | https://doi.org/10.52825/isec.v1i.1162 | Greenhouse heat use |
| Aquacultural Engineering article S0144860923000171 | Elsevier (ScienceDirect) | 2023 | https://www.sciencedirect.com/science/article/pii/S0144860923000171 | Aquaculture (RAS) heat demand |
| Fishes 10(2):85 | MDPI | n.d. | https://www.mdpi.com/2410-3888/10/2/85 | Aquaculture design |
| Cultured species fact sheet: rainbow trout | FAO | n.d. | https://www.fao.org/fishery/docs/DOCUMENT/aquaculture/CulturedSpecies/file/en/en_rainbowtrout.htm | Trout temperature range |
| ~Trout farming RAS technology | Aquafarmer | n.d. | https://aquafarmer-ras.com/technology/trout-farming/ | RAS configuration |
| Renewable and Sustainable Energy Reviews article S1364032122000466 | Elsevier (ScienceDirect) | 2022 | https://www.sciencedirect.com/science/article/pii/S1364032122000466 | District-heating ownership models |
| ~Cooling from the depths (Cornell lake source cooling) | ACHR News | n.d. | https://www.achrnews.com/articles/91017-cooling-from-the-depths | Local lake-thermal precedent |
| ~Cayuga Lake lake source cooling | Toxics Targeting | n.d. | https://www.toxicstargeting.com/news/clean-ithaca/cayuga-lake-lake-source-cooling | Local skepticism of lake thermal uses |

---

## Case studies

### Pools and small heat-reuse operators

| Title | Publisher | Year | URL | Used for |
|---|---|---|---|---|
| Deep Green (home; CEO news; site DG01 Manchester) | Deep Green | n.d. | https://deepgreen.energy/ ; https://deepgreen.energy/news/deep-green-mark-lee-ceo ; https://deepgreen.energy/sites/site-details-dg01-manchester | UK pool-heating precedent |
| ~UK data center startup offers to heat Britain's swimming pools | DatacenterDynamics | n.d. | https://www.datacenterdynamics.com/en/news/uk-data-center-startup-offers-to-heat-britains-swimming-pools-with-waste-heat/ | Deep Green model |
| ~Deep Green uses data center heat to warm pools | Channel Vision | n.d. | https://channelvisionmag.com/deep-green-uses-data-center-heat-to-warm-pools/ | Same |
| BBC technology 64939558 (Exmouth pool) | BBC | 2023 | https://www.bbc.co.uk/news/technology-64939558 | Pool precedent, risk matrix |
| Exmouth Leisure Centre | LED Leisure | n.d. | https://ledleisure.co.uk/locations/exmouth-leisure-centre/ | Host pool |
| Qarnot Computing insolvency notices (2) | Le Figaro annonces légales | n.d. | https://annonces-legales.lefigaro.fr/annonces-legales/qarnot-computing-procedures-collectives-2/ ; https://annonces-legales.lefigaro.fr/annonces-legales/qarnot-computing-procedures-collectives-3/ | Failure case (distributed heaters) |
| Scaleway acquires Qarnot | Qarnot | n.d. | https://qarnot.com/en/news/scaleway-acquires-qarnot | Same |
| Qarnot Computing company record | Societe.com | n.d. | https://www.societe.com/societe/qarnot-computing-528593817.html | Same |
| Nerdalize bankruptcy | CEES | n.d. | https://cees.nl/persbericht-faillissement-nerdalize-b-v-information-bankruptcy-nerdalize-b-v/ | Failure case |
| ~Nerdalize restart (Catena) | RTL Nieuws | n.d. | https://www.rtl.nl/tech/artikel/4624726/doorstart-startup-nerdalize-investeerder-catena | Same |
| ~The computer that crunches cloud data to heat your home | New Scientist | n.d. | https://www.newscientist.com/article/2016420-the-computer-that-crunches-cloud-data-to-heat-your-home/ | Nerdalize background |
| Stimergy company record | Le Figaro Entreprises | n.d. | https://entreprises.lefigaro.fr/stimergy-38/entreprise-793625351 | Pool precedent (France) |
| ~Stimergy heats a Paris pool | GreenIT.fr | 2017 | https://www.greenit.fr/2017/07/25/stimergy-chauffe-piscine-parisienne/ | Same |
| ~Stimergy's edge platform used to heat French public pool | DatacenterDynamics | n.d. | https://www.datacenterdynamics.com/en/news/stimergys-edge-platform-used-to-heat-french-public-pool/ | Same |
| Cloud&Heat news (2 articles) | Cloud&Heat | n.d. | https://www.cloudandheat.com/en/news-press/once-upon-a-time-there-was-a-cloud-that-heated-homes-worldwide/ ; https://www.cloudandheat.com/en/news-press/dresden-cloud-provider-receives-sovereign-cloud-stack-certification-saxony-strengthens-digital-location/ | Pivot away from home heating |
| ~Exergy project kickstarts cloud heating in US | DatacenterDynamics | n.d. | https://www.datacenterdynamics.com/en/news/exergy-project-kickstarts-cloud-heating-in-us/ | US precedent |
| ~There's more than one way to heat with the cloud | DatacenterDynamics | n.d. | https://www.datacenterdynamics.com/en/opinions/theres-more-than-one-way-to-heat-with-the-cloud/ | Model comparison |
| ~The hidden benefit of data centers: warming communities | Equinix blog | 2025 | https://blog.equinix.com/blog/2025/04/24/the-hidden-benefit-of-data-centers-warming-communities-not-just-servers/ | Operator-led heat export |

### Lansing, MICHIGAN precedent (not Lansing, NY)

| Title | Publisher | Year | URL | Used for |
|---|---|---|---|---|
| Deep Green proposes $120 million sustainable data center investment | Lansing Board of Water & Light | 2025 | https://www.lbwl.com/community/newsroom/2025-11-05-deep-green-proposes-120-million-sustainable-data-center-investment | **V** Utility-partnered heat-reuse precedent |
| ~BWL in talks for 20-year contract with company behind proposed Lansing data center | WKAR | 2026 | https://www.wkar.org/wkar-news/2026-01-29/bwl-in-talks-for-20-year-contract-with-company-behind-proposed-lansing-data-center | Contract structure |
| ~Proposed data center won't move forward in Lansing as Deep Green withdraws | WKAR | 2026 | https://www.wkar.org/michigans-data-center-divide/2026-04-06/proposed-data-center-wont-move-forward-in-lansing-as-deep-green-withdraws | **V** Project WITHDRAWN 2026-04-06 (row 12). Cite only as a cautionary precedent |

### Greenhouses, aquaculture and industrial co-location

| Title | Publisher | Year | URL | Used for |
|---|---|---|---|---|
| Heat reuse; Green Mountain and Hima Seafood heat-reuse project | Green Mountain | n.d. | https://greenmountain.no/sustainability/heat-reuse/ ; https://press-en.greenmountain.no/pressreleases/green-mountain-and-hima-seafood-launch-groundbreaking-heat-reuse-project-3430566 | Trout aquaculture on data-center heat (Norway) |
| A new circular data center model creates sustainable, large-scale food production | EcoDataCenter | n.d. | https://ecodatacenter.tech/press/a-new-circular-data-center-model-creates-sustainable-and-large-scale-food-production-3229148 | Fish/greenhouse co-location (Sweden) |
| ~EcoDataCenter to reuse heat in fish farms and greenhouses | DatacenterDynamics | n.d. | https://www.datacenterdynamics.com/en/news/ecodatacenter-to-reuse-heat-in-fish-farms-and-greenhouses/ | Same |
| ~A 300 m2 smart greenhouse (BodenXT) | Boden Municipality | 2021 | https://boden.se/en/community-and-development/community-development/bodenxt/bodenxt-news/2021-11-03-a-300-square-meter-smart-greenhouse | Small greenhouse pilot |
| ~Boden greenhouse, Sweden | Systemair | n.d. | https://www.systemair.com/en/expertise/case-studies/boden-greenhouse-sweden | Same |
| Q01 campus; Énergir/VRT waste heat recovery; financing for food self-sufficiency | QScale | n.d. | https://www.qscale.com/q01-campus ; https://www.qscale.com/news/energir-vrt-waste-heat-recovery ; https://www.qscale.com/news/from-data-processing-to-food-self-sufficiency-financing | Data center + greenhouse campus (Quebec) |
| ~Valorisation des rejets thermiques | Énergir | n.d. | https://energir.com/fr/a-propos/medias/nouvelles/valorisation-des-rejets-thermiques | QScale heat utility partner |
| ~QScale finds its greenhouse operator | La Voix de l'Est | 2024 | https://www.lavoixdelest.ca/affaires/2024/11/19/qscale-a-trouve-son-exploitant-agricole-pour-les-futures-serres-25LNKV4MIJFPBHHBYUE63RZZYI/ | Same |
| ~Quebec ready to pay $10M for greenhouses next to QScale | Le Soleil | 2026 | https://www.lesoleil.com/affaires/2026/02/09/quebec-prete-a-debourser-10-m-pour-le-projet-de-serres-voisines-a-qscale-TTH5V55BBBFZNBOG2JR2QQ3GWU/ | Public co-funding |
| ~Quebec grants $90M for a data center in Lévis | Gouvernement du Québec | n.d. | https://www.quebec.ca/nouvelles/actualites/details/investissement-de-pres-de-870-m-en-chaudiere-appalaches-quebec-accorde-90-m-pour-soutenir-limplantation-dun-centre-de-traitement-de-donnees-a-levis-33383 | Same |
| Greenhouse project | Genesis Digital Assets | n.d. | https://genesisdigitalassets.com/greenhouse-project/ | Crypto-mining greenhouse precedent |
| Datacenters (Agriport) | Gemeente Hollands Kroon | n.d. | https://www.hollandskroon.nl/ontwikkelingen/datacenters/ | Dutch Agriport A7 cluster |
| ~Minister: data-center heat for greenhouses, Agriport as example | G-Fact (gfactueel.nl) | n.d. | https://www.gfactueel.nl/minister-warmte-datacenter-kassen-agriport-voorbeeld/ | Same |
| Hortidaily (3 articles: Microsoft CHP; data center next to tomato greenhouse; mobile data-center developer bankrupt) | Hortidaily | n.d. | https://www.hortidaily.com/article/6005366/dutch-greenhouse-chp-s-to-provide-microsoft-data-center-with-electricity/ ; https://www.hortidaily.com/article/9100979/data-center-next-to-tomato-greenhouse/ ; https://www.hortidaily.com/article/9560853/developer-of-mobile-data-centers-next-to-greenhouse-declared-bankrupt/ | Greenhouse successes and a failure |
| ~NorthC data center waste heat for Royal FloraHolland | Blueterra | n.d. | https://www.blueterra.nl/project/restwarmte-van-datacenter-northc-voor-royal-floraholland | Aalsmeer horticulture heat |
| NorthC Aalsmeer | NorthC Datacenters | n.d. | https://www.northcdatacenters.com/en/northc-datacenters/aalsmeer/ | Same |
| ~NLDC joins heat/cold exchange in Aalsmeer | Telecompaper | n.d. | https://www.telecompaper.com/news/nldc-datacenters-neemt-deel-aan-warmte-koude-uitwisseling-in-aalsmeer--1305091 | Same |
| Permit document OD2025-0043382 | Omgevingsdienst Noordzeekanaalgebied (eDataloket) | 2025 | https://edataloket.odnzkg.nl/preview/OD2025-0043382_D2025-506635 | Dutch heat-delivery permit condition |

### District-heating utilities

| Title | Publisher | Year | URL | Used for |
|---|---|---|---|---|
| District Heat | Jamestown Board of Public Utilities | n.d. | https://www.jamestownnybpu.gov/260/District-Heat | **V** NY municipal-utility district-heat precedent (row 11f) |
| Reliable Power | Jamestown BPU | n.d. | https://www.jamestownnybpu.gov/351/Reliable-Power | Ownership model |
| Featured case study: City of Jamestown | NYSERDA | n.d. | https://www.nyserda.ny.gov/About/Publications/Featured-Case-Studies/City-of-Jamestown | Same |
| The Danish model | Danish District Heating Association (Dansk Fjernvarme) | n.d. | https://danskfjernvarme.dk/english/english/the-danish-model | Consumer-owned co-op model behind the Thermal Commons co-op |

---

## Policy

### State and federal law, tax and regulation

| Title | Publisher | Year | URL | Used for |
|---|---|---|---|---|
| Executive Order 62: temporary moratorium on data centers in New York | NY Governor | 2026 | https://www.governor.ny.gov/executive-order/no-62-establishing-temporary-moratorium-data-centers-new-york-while-state-develops | **V** Pauses DEC discretionary permits for data centers of 50 MW or more until the final GEIS; coverage of Lake Hawkeye UNVERIFIABLE (rows 2a, 2b) |
| ~First statewide moratorium on new hyperscale data centers | NY Governor (news) | 2026 | https://www.governor.ny.gov/news/first-statewide-moratorium-new-hyperscale-data-centers-launched-governor-kathy-hochul | Risk matrix |
| ~PSC proceeding so data centers pay their fair share | NY Governor (news) | n.d. | https://www.governor.ny.gov/news/governor-hochul-announces-psc-proceeding-her-plan-ensure-data-centers-pay-their-fair-share | Stakeholder/policy context |
| ~Executive order pauses DEC permits for data centers in New York | DLA Piper | 2026 | https://www.dlapiper.com/en-us/insights/publications/2026/07/executive-order-pauses-dec-permits-for-data-centers-in-new-york | Law-firm reading of EO 62 ("up to one year" is gloss) |
| NY Public Service Law §2, §66-t, §81 | NY Senate | n.d. | https://www.nysenate.gov/legislation/laws/PBS/2 ; https://www.nysenate.gov/legislation/laws/PBS/66-T ; https://www.nysenate.gov/legislation/laws/PBS/81 | **V** UTENJA covers only gas/electric corporations; a municipality selling steam needs a PSC certificate (rows 11a, 11b) |
| S9422 (2021-22): Utility Thermal Energy Network and Jobs Act | NY Senate | 2022 | https://www.nysenate.gov/legislation/bills/2021/S9422 | **V** Same (row 11a) |
| NY Town Law §190 | NY Senate | n.d. | https://www.nysenate.gov/legislation/laws/TWN/190 | **V** Improvement districts; no heating-district type found (row 11d) |
| PSC Case 20-G-0131 order (5/12/2022) | NYS DPS | 2022 | https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BE068C615-B8EE-4CB9-AF92-3153A49BE4E4%7D | **V** Lansing gas moratorium since Feb 2015 (row 6a) |
| NYSEG/RG&E Gas LTP 2025 Annual Update (Case 23-G-0437) | NYS DPS | 2025 | https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7B30700A98-0000-CE30-9B40-1D15BBA44B68%7D | **V** Lansing still constrained as of 7/14/2025 (row 6c-update) |
| PSC filing on municipal thermal energy networks | NYS DPS | n.d. | https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7B50D2C690-0000-C71B-83BC-A2C6504F3AFC%7D | **V** UNVERIFIABLE; primary text not read; do not cite (row 11e) |
| NYSEG-RG&E UTEN Monthly Status Report | NYS DPS | n.d. | https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7B8025E89C-0000-C94C-BD5F-051864C357DC%7D | NYSEG thermal-network pilot status |
| NYSEG Non-Pipe Alternatives Quarterly Report Q1 | NYS DPS | n.d. | https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BC09A5D8F-0000-CE32-81A0-BA75B7347FC2%7D | Utility path for funding gas alternatives in Lansing |
| NYSEG Ithaca UTEN Pilot Stage 2 Filing (22-M-0429) | NYS DPS | 2025 | https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BD0C5F097-0000-CD58-8606-053FB4284E6A%7D | Nearby utility thermal-network precedent |
| Non-pipe alternatives; NYSEG | NYSEG | n.d. | https://www.nyseg.com/non-pipe-alternatives ; https://www.nyseg.com | Same |
| NYS DPS; NYS Clean Heat | NYS DPS; NY Clean Heat | n.d. | https://dps.ny.gov ; https://cleanheat.ny.gov | Heat-pump incentives |
| NYSERDA Large-Scale Thermal; FlexTech | NYSERDA | n.d. | https://www.nyserda.ny.gov/All-Programs/Large-Scale-Thermal-Program ; https://www.nyserda.ny.gov/All-Programs/FlexTech-Program | Feasibility and design grants |
| NYSERDA portal document | NYSERDA | n.d. | https://portal.nyserda.ny.gov/servlet/servlet.FileDownload?file=00Pcr00000EWmcbEAD | Program solicitation (stakeholders) |
| ~New York data centers offered $2 million grants for heat reuse projects | DatacenterDynamics | n.d. | https://www.datacenterdynamics.com/en/news/new-york-data-centers-offered-2-million-grants-for-heat-reuse-projects/ | NY heat-reuse grants |
| 26 USC §48; 26 USC §6417 | Cornell LII | n.d. | https://www.law.cornell.edu/uscode/text/26/48 ; https://www.law.cornell.edu/uscode/text/26/6417 | **V** Investment credit and elective (direct) pay |
| Final regulations 2024-28190 (reg. 1.48-9) | Federal Register (GovInfo) | 2024 | https://www.govinfo.gov/content/pkg/FR-2024-12-12/html/2024-28190.htm | **V M** Waste-heat networks NOT eligible as geothermal heat pump property, so the base case has no credit (row 9d-i) |
| Section 6417 elective payment final rule | Federal Register | 2023 | https://www.federalregister.gov/documents/2023/06/21/2023-12798/section-6417-elective-payment-of-applicable-credits | Direct pay for co-ops and municipalities |
| Public Law 119-21 (One Big Beautiful Bill Act) | GovInfo | 2025 | https://www.govinfo.gov/content/pkg/PLAW-119publ21/html/PLAW-119publ21.htm | **V** 25C ends 12/31/2025; 48E changes (rows 9a-i, 9c) |
| IRS Notice 2026-39 | IRS | 2026 | https://www.irs.gov/pub/irs-drop/n-26-39.pdf | **V** Energy-community adder +10 percentage points (row 9f-i) |
| Energy-communities data sets; EC_CC_V5.xlsx | US Treasury | 2026 | https://home.treasury.gov/policy-issues/tax-policy/data-transparency/all-treasury-generated-energy-communities-data-sets ; https://home.treasury.gov/system/files/131/EC_CC_V5.xlsx | **V** Tract 36109002300 coal-closure check: UNVERIFIABLE (row 9f-ii) |
| IRS: IRA business incentives; energy-efficient home improvement credit; residential clean energy credit | IRS | n.d. | https://www.irs.gov/affordable-care-act/energy-incentives-for-businesses-in-the-inflation-reduction-act ; https://www.irs.gov/credits-deductions/energy-efficient-home-improvement-credit ; https://www.irs.gov/credits-deductions/residential-clean-energy-credit | Incentive background (25C now expired) |
| ~OBBB energy credits | Eide Bailly | 2025 | https://www.eidebailly.com/insights/alerts/2025/obbb-energy-credits | Secondary summary |
| ~Can district and campus geothermal projects qualify for the federal ITC? | Walker Blue | n.d. | https://walker-blue.com/can-district-and-campus-geothermal-projects-qualify-for-the-federal-itc/ | Secondary ITC reading |
| Building energy code determinations | US DOE (energycodes.gov) | n.d. | https://www.energycodes.gov/determinations | Building load assumptions |
| ~Guideline on establishment conditions (English translation) | Province of Noord-Holland | n.d. | https://www.noord-holland.nl/bestanden/pdf/Richtlijn%20vestigingsvoorwaarden%20engelse%20vertaling.pdf | Precedent for requiring heat reuse as a condition of siting, the model for our covenant |

### County, town and litigation records

| Title | Publisher | Year | URL | Used for |
|---|---|---|---|---|
| Tompkins County Resolution 2026-3 (adopted 2026-01-20, 14-1) | Tompkins County Legislature (iqm2) | 2026 | https://tompkinscountyny.iqm2.com/Citizens/Detail_LegiFile.aspx?ID=13804&MeetingID=4213 | **V** County asked DEC to require a NEW permit application (row 5d) |
| Seneca County Board meeting minutes, March 10 2026 | Seneca County | 2026 | https://www.senecacountyny.gov/wp-content/uploads/2026/04/March-10-2026-Board-Meeting-Minutes-final.pdf | Res. 63-26 (row 5e) |
| ~Seneca County Board of Supervisors to DEC: reject TeraWulf's modified permit request | Finger Lakes Times | 2026 | https://www.fltimes.com/news/seneca-county-board-of-supervisors-to-dec-reject-terawulfs-modified-permit-request/article_cce901b6-e44d-41b6-ae0c-e0f9bf79e1d7.html | **V** Row 5e |

### News and community coverage (Lansing, NY)

| Title | Publisher | Year | URL | Used for |
|---|---|---|---|---|
| ~Lansing board moves toward data center ban | The Ithaca Voice | 2026 | https://ithacavoice.org/2026/09/lansing-board-data-center-ban/ | **V** 9/29 direction to draft a ban; $500k in NEXT year's proposed budget for legal costs (row 1c) |
| ~Lansing moves toward data center ban as TeraWulf debate reaches turning point | FingerLakes1 | 2026 | https://www.fingerlakes1.com/2026/10/02/lansing-moves-toward-data-center-ban-as-terawulf-debate-reaches-turning-point/ | **V** Correct URL for the ban story (row 1a) |
| ~Town of Lansing moving forward with drafting a data center ban | 607 News Now | 2026 | https://607newsnow.com/news/258852-town-of-lansing-moving-forward-with-drafting-a-data-center-ban/ | **V** "36 of 38 speakers opposed" comes ONLY from this source; cite with attribution (row 1b) |
| ~Court rules lawsuit against TeraWulf, Lansing ZBA can move forward | 607 News Now | n.d. | https://607newsnow.com/news/258852-court-rules-lawsuit-against-terawulf-lansing-zba-can-move-forward/ | Litigation risk |
| ~Environmentalists sound alarm as plan to convert Cayuga power plant to data center advances | The Ithaca Voice | 2025 | https://ithacavoice.org/2025/09/environmentalists-sound-alarm-as-plan-to-convert-cayuga-power-plant-to-data-center-advances/ | **V** Project history; Riesling bought "the plant and the surrounding 183 acres" |
| Ithaca Voice: TeraWulf threatens legal action (2025-11); ZBA grants appeal (2025-12); county calls on state to reject permit (2026-02); school board implodes (2026-04); state greenlights water permit (2026-04); planning board looks at 401-page plan (2026-04) | The Ithaca Voice | 2025-2026 | https://ithacavoice.org/2025/11/data-center-company-terawulf-threatens-legal-action-against-lansing-town-board/ ; https://ithacavoice.org/2025/12/lansing-zoning-board-grants-appeal-to-terawulf/ ; https://ithacavoice.org/2026/02/county-calls-on-state-to-reject-water-permit-for-ai-data-center/ ; https://ithacavoice.org/2026/04/how-the-lansing-school-board-imploded/ ; https://ithacavoice.org/2026/04/state-greenlights-water-permit-for-lansing-power-plant-amid-data-center-backlash/ ; https://ithacavoice.org/2026/04/theres-just-a-lot-missing-lansing-planning-board-takes-first-look-at-401-page-data-center-plan/ | Stakeholder map, risk matrix, cooling |
| Ithaca Times (ithaca.com): lawsuit against ZBA/TeraWulf; ZBA finds permitted use; Reclaim NY on gas moratorium; residents' petition; county urges denial of water permit | Ithaca Times | n.d. | https://www.ithaca.com/news/lansing/flx-strong-clean-file-lawsuit-against-lansing-zba-terawulf-to-block-data-center/article_97b45f0f-c849-497c-9daa-6040f1f1710b.html ; https://www.ithaca.com/news/lansing/lansing-zoning-board-of-appeals-finds-data-center-proposal-fits-permitted-land-use/article_b6797756-40d8-4cde-85b1-d610cb0d0310.html ; https://www.ithaca.com/news/lansing/state-government-nonprofit-reclaim-ny-calls-out-local-gas-moratorium/article_4b22a9f8-5c1e-11e7-911b-334be72f1cc3.html ; https://www.ithaca.com/news/regional_news/cayuga-lake-residents-deliver-petition-against-proposed-terawulf-data-center/article_be2ce31f-0ea9-4f1c-aff2-d695d3c7ad15.html ; https://www.ithaca.com/news/regional_news/tompkins-county-legislature-urges-state-to-deny-water-permit-for-lansing-data-center/article_1d89f22d-fcd0-43b3-97e2-173e08a483ea.html | Stakeholders; gas-moratorium history |
| ~Opponents deliver 17,000-signature petition | FingerLakes1 | 2026 | https://www.fingerlakes1.com/2026/06/18/opponents-deliver-17000-signature-petition-against-proposed-lansing-data-center/ | Opposition scale |
| Cornell Sun: board withdraws ordinance (2025-12); TeraWulf affiliate approved to draw 1 million gallons per day (2026-04) | The Cornell Daily Sun | 2025-2026 | https://www.cornellsun.com/article/2025/12/lansing-board-withdraws-ordinance-that-would-have-stalled-terawulf-data-center ; https://www.cornellsun.com/article/2026/04/terawulf-affiliate-approved-to-draw-1-million-gallons-per-day-from-cayuga-lake | Stakeholders, risk |
| ~Judge allows lawsuit challenging Lansing data center zoning to proceed | The Cornell Daily Sun | 2026 | https://cornellsun.com/2026/04/22/judge-allows-lawsuit-challenging-lansing-data-center-zoning-to-proceed/ | Not re-checked in verification; re-verify before citing |
| ~TeraWulf outlines plans for Lansing AI data center | Tompkins Weekly | n.d. | https://www.tompkinsweekly.com/news/terawulf-outlines-plans-for-lansing-ai-data-center-as-residents-seek-more-answers-c1ad6eca/ | Developer claims, residents' questions |
| Issue spotlight: data center in Lansing; Sustainable Finger Lakes | Sustainable Finger Lakes | n.d. | https://sustainablefingerlakes.org/issue-spotlight-data-center-in-lansing/ ; https://www.sustainablefingerlakes.org | ~40 speakers / ~200 attendees count (row 1b) |
| Data center page | Cayuga Lake Watershed Network | n.d. | https://www.cayugalake.org/datacenter/ | Stakeholder |
| No Data Center FLX: our friends; judge-ruling post | No Data Center FLX | n.d. | https://www.nodatacenterflx.com/our-friends ; https://www.nodatacenterflx.com/resources-and-news/flx-strong-and-clean-celebrate-after-judge-rules-lawsuit-can-continue-against-data-center-approval-in-lansing | Opposition coalition map |
| Home pages: Cornell Sun, DEC, datacenters.com | Various | n.d. | https://cornellsun.com ; https://www.dec.ny.gov ; https://www.datacenters.com | Homepage-level references in `research/facts-site2.md` |

### Design and accessibility references (used to audit the web app, not the proposal)

| Title | Publisher | Year | URL | Used for |
|---|---|---|---|---|
| 10 Usability Heuristics | Nielsen Norman Group | n.d. | https://www.nngroup.com/articles/ten-usability-heuristics/ | `docs/audit/ux-nielsen.md` |
| WCAG 2.2; Understanding contrast (minimum) | W3C | 2023 | https://www.w3.org/TR/WCAG22/ ; https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html | Accessibility audits |

---

## Known-broken URLs

`research/verification.md` flags these as **404**. They are still in older files, so do not cite them.

| Broken URL | Where it still appears | Replacement (verified 2026-10-03) |
|---|---|---|
| https://fingerlakes1.com/2026/10/01/lansing-town-board-moves-to-ban-data-centers/ | `research/facts-site2.md` | https://www.fingerlakes1.com/2026/10/02/lansing-moves-toward-data-center-ban-as-terawulf-debate-reaches-turning-point/ (rows 1a, 1d) |
| https://cornellsun.com/2026/04/16/dec-renews-water-permit-cayuga-power-plant/ | `docs/ownership-deal.md`, `docs/risk-matrix.md`, `research/facts-site2.md` | DEC permit PDF https://dec.ny.gov/sites/default/files/2026-04/cayugaoperatingwwpermit.pdf (row 5g) |
| https://cornellsun.com/2026/01/21/tompkins-county-legislature-opposes-data-center-water-permit/ | `research/facts-site2.md` | Tompkins Res. 2026-3: https://tompkinscountyny.iqm2.com/Citizens/Detail_LegiFile.aspx?ID=13804&MeetingID=4213 (row 5g) |

Note: the brief mentions "two known 404s". Verification row 5g covers the **two** cornellsun URLs; row 1d adds the fingerlakes1 slug. All three are flagged above.

---

## Appendix: individual organizer videos

Titles are in `research/videos.md`. Timestamped quotes are in `docs/research/video-quotes.md`. Publisher: YouTube (organizer playlist).

2sdUduqfOPQ, 3L2KNYtSDfc, 739-OUKhT_c, 7rpWZ1fBGaI, ERoY9XpmVH4, EXgUZKngVNQ, FrkhPPq92pg, GUJDltEzAzg, IHIt66rNJr8, INx5pNOi99A, J2Juo0WPjhg, JGytn9SLl2E, JXVETMn0P0s, LWxf6Ts7wqw, M8NPAZmBAxY, NoQ2SkVycm0, PWxo6wT1dNE, PfMFzrGx8LU, Toy3NUrmTNY, Uyr6F08uc74, _O1Qv2iTbFE, _lh-vTAqc-I, cCC5G8SmbCs, dWSxZwLn0nQ, eUfg6eYOutE, i4rv0Bm2lQM, iaz62BeW37o, kIDILvlODkc, kt2YDthYJqA, kxr5wkDYcKE, l6jmd2lNW10, m_kyhCD0J5w, n8WzghPE4oM, nNWbgyKsV4s, oDhqrOKSdPI, oVsqZHZIrto, p76HnVro6RE, q2WJaKtexU0, re0heTaNsAA, u-6cqitc8GE, vfUD8FKB93g, vqe-QmSoj3I, vwrKqhCsLHA, yqtzOebHf1k. The URL form is `https://www.youtube.com/watch?v=<id>`.

---

## Lane status

**Done**
- Scripted URL harvest over `docs/`, `research/`, `config/` and `outputs/site2.json` (332 unique URLs). Every external URL is placed in one topic group: organizer, site, climate, prices, emissions, engineering, case studies, policy.
- Model-input sources (`outputs/site2.json` `sources` plus `config/*.yaml`) are tagged **M**. Sources checked in `research/verification.md` are tagged **V**, with row numbers.
- The 404 URLs (fingerlakes1 slug, two cornellsun URLs) are flagged, with replacements and the files where they still appear.
- The Lansing, MI (Deep Green / BWL) precedent is separated out and marked WITHDRAWN, so it cannot be confused with Lansing, NY.

**Missing / gaps**
- Titles marked `~` come from URL slugs, not opened pages. Years marked `n.d.` were not captured in repo notes. We did not re-fetch pages under the deadline.
- Several organizer documents have no publisher recorded in the repo (marked [unverified publisher]).
- Individual YouTube video titles are not repeated here; they are in `research/videos.md`.
- Cornell Sun 2026/04/22 (judge allows lawsuit) was never re-checked by verification.

**Open questions**
- Should the stale 404 URLs be removed from `docs/ownership-deal.md`, `docs/risk-matrix.md` and `research/facts-site2.md`? Those files belong to other lanes, so they are not edited here.
- The brief counts "two" known 404s, but verification lists three URLs across two rows. Flagging all three is the conservative choice.

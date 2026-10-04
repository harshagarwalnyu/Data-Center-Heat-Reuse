# Heat offtakers near the former Cayuga plant (Lansing, NY)

*Lane C04 | Generated 2026-10-03 | Companion table: `data/processed/offtakers.csv`*

Working site: former Cayuga / Milliken Station area, Lake Hawkeye / TeraWulf proposal, Lansing NY. Comparison site (111 8th Ave, NYC) is out of scope for this file.

Every factual claim below carries a source URL and `(verified 2026-10-03)`. Unverified items are marked `[unverified]`. Load estimates are marked `ASSUMPTION`.

## Method

Skeleton written before lookups. Rows are appended only after a coordinate or published figure is retrieved in this session.

Search radius: about 5 miles (8.05 km) from the plant coordinate fixed in the next section. Great-circle distance uses the haversine formula with Earth radius 6371 km.

Load rule (applied after intensity sources are fetched): `annual_MWh = floor_area_m2 × heating_kWh_per_m2 / 1000`, climate zone 5A/6A published intensity, flagged ASSUMPTION. Peak MW is an assumption from annual energy and a stated full-load hours figure, also flagged.

## Site coordinate

Origin for all distances: former Cayuga power station, also known as Milliken Station, Lansing, Tompkins County, New York.

- WGS 84: **42.602544, -76.635978**, labeled “exact” by Global Energy Monitor for the plant and for Unit 1 and Unit 2. (https://www.gem.wiki/Cayuga_power_station_(New_York), verified 2026-10-03)
- Same page: both units retired in 2019; fuels were coal; nameplate 160 MW (Unit 1) and 167.2 MW (Unit 2). (https://www.gem.wiki/Cayuga_power_station_(New_York), verified 2026-10-03)
- Cross-check, different datum: USGS GNIS-style listing “Cayuga Power Plant” at N42.60194°, W76.63472° (NAD83), elevation 393 ft, Tompkins County, USGS 24K map Trumansburg, NY. (https://topoquest.com/place/new-york/building/cayuga-power-plant/2514600, verified 2026-10-03)
- Mapcarta lists 42.60294, -76.63339 and OSM way 389629671. (https://mapcarta.com/26816200, verified 2026-10-03)

ASSUMPTION: distances use the GEM WGS84 point (42.602544, -76.635978). The USGS point is about 120 m away; that shift does not change which buildings fall inside a 5-mile screen. Haversine radius = 6371 km.

Search radius: 5.0 miles = 8.047 km. A few named facilities just outside that ring (airport, if so) are kept only if the straight-line distance is reported and flagged.

## Climate zone and heating intensity

Pending lookup.

## Candidate offtakers

OSM Nominatim (queried 2026-10-03, user-agent hackathon-2026-offtakers/1.0) places the main civic cluster **south** of the plant, beyond a strict 5.0 mi / 8.05 km ring. Distances below are haversine from 42.602544, -76.635978.

| Place | OSM object | Lat, lon | km from plant |
|---|---|---|---|
| Cayuga Power Plant landuse | way/389629671 | 42.6031533, -76.6333145 | 0.228 |
| Lansing High School building | relation/11291689 | 42.5441796, -76.533892 | 10.583 |
| Lansing Middle School | node/2396817989 | 42.5432245, -76.5370655 | 10.446 |
| Lansing Community Library, 27 Auburn Road | node/2395664192 | 42.5377303, -76.5031253 | 13.050 |
| Lansing Community Center, 25 Auburn Road | node/13095101428 | 42.5377546, -76.5035996 | 13.016 |
| Ithaca Tompkins International Airport | way/1133936379 | 42.4918021, -76.4606946 | 18.916 |

Source of these six geocodes: https://nominatim.openstreetmap.org (verified 2026-10-03). R.C. Buckley Elementary and the Cargill mine did not return a Nominatim hit on the first query; addresses are being geocoded separately.

ASSUMPTION: the task names the school campus, town hall, library, community center, airport, and Cargill even though several sit past 5 miles. Those rows are kept and `dist_km` is the measured value. A second pass lists whatever OSM shows inside 8.05 km (lakeshore housing, farms, halls).

Town of Lansing capital plan (preliminary 2026–2030): town incorporated 1817; “60.5 square miles of land”; population “11,565 in 2020”; Town Hall “built in 1999” and “approximately 8,200 square feet”; heat is “a 220,000 btu natural gas fired condensing boiler with radiant floor distribution”; domestic hot water is “a 40,000 btu gas fired power vented tank heater”. (https://mccmeetingspublic.blob.core.usgovcloudapi.net/lansingny-meet-bea10836c3b84b16965c2d23450ae349/ITEM-Attachment-001-18802fdf921e47179751d6bc4d6039dc.pdf, verified 2026-10-03). Population and land area in that PDF are the town’s own figures; Census is the check, still pending in this file.

Town Hall street address used on the 15 July 2026 town board notice: “Lansing Town Hall, 29 Auburn Road, Lansing, New York”. (https://mccmeetings.blob.core.usgovcloudapi.net/lansingny-pubu/MEET-Packet-c61776381c3241a19bb2188b87a66323.pdf, verified 2026-10-03).

NCES CCD 2024–25 school list for district 3616710, three schools (https://nces.ed.gov/ccd/schoolsearch/school_list.asp?DistrictID=3616710&Search=1, verified 2026-10-03):

- Lansing High School, 300 Ridge Rd, Lansing, NY 14882, 371 students, grades 9–12
- Lansing Middle School, 6 Ludlowville Rd, Lansing, NY 14882, 355 students, grades 5–8
- Raymond C Buckley Elementary School, 284 Ridge Rd, Lansing, NY 14882, 392 students, grades PK–4

Cargill Cayuga Salt Mine application address: 191 Portland Point Rd, South Lansing, NY 14882. (https://dec.ny.gov/news/environmental-notice-bulletin/2024-11-20/completed-application/towns-of-covert-lansing-and-ulysses-cayuga-salt-mine, verified 2026-10-03). Same street address on Cargill’s careers page. (https://careers.cargill.com/en/lansing-ny, verified 2026-10-03).

Rows still to add after footprint areas, Census fuel, and heating intensity are in hand.

## Counter-arguments and limits

Pending.

## Sources

Pending.

## Lane status

- Done: file skeleton created.
- Missing: plant coordinate, offtaker inventory, floor areas, intensities, CSV rows.
- Open questions: none yet beyond the missing list.

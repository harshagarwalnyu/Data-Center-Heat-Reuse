# Audit: site1.json and offtakers.json

Lane C45. Owned file: `docs/audit/numbers-site1-offtakers.md`.
Checked 2026-10-04 against `web/public/data/site1.json`, `web/public/data/offtakers.json`, `research/facts-site1.md`, `research/offtakers.md`, and `research/verification.md` (overrides older files). `research/facts-site2.md` section 3 is used only where `offtakers.md` has no coordinate. Haversine uses Earth radius 6371 km, same as `src/heatreuse/scoring.py`.

Plant origin for every `offtakers.json` distance: GEM WGS84 **42.602544, -76.635978** (`config/engineering.yaml`, matching `research/offtakers.md`). Source: https://www.gem.wiki/Cayuga_power_station_(New_York) (verified 2026-10-03).

`facts-site2.md` uses a different origin, **42.6028, -76.6336** (about 0.20 km from GEM). Mile labels in that file are not comparable to JSON `dist_km` until that shift is applied.

Strict box in the task: lat 42.5–42.7, lon −76.7 to −76.4.

## Coordinate check

`site1.json` has **no lat/lon**. `meta.site` is `111 8th Ave, New York NY`, which matches the Site 1 address in `research/facts-site1.md` (https://en.wikipedia.org/wiki/111_Eighth_Avenue, verified 2026-10-03). It is not a Lansing pin. **OK** for “this file is not Lansing.” Gap: the published comparison file cannot be mapped. The config pin `40.7425, -74.0033` lives in `config/site1.yaml`, not in this JSON, and is outside the Lansing box (Manhattan). That pin was **not** re-geocoded this pass [unverified against a geocoder].

`offtakers.json` is the Lansing / Site 2 list. `research/offtakers.md` says 111 8th Ave is out of scope for that file. Chelsea offtakers (NYCHA, Chelsea Market, pools) are correctly absent here. They are rolled into Site 1 loads, not pins.

| id | lat, lon | Strict box | Verdict |
|---|---|---|---|
| gh_onsite | 42.6028, −76.6336 | in | **OK** on-site. 0.20 km from GEM (JSON 0.2). Pin equals the facts-site2 origin, not a separate building. |
| corridor_homes | 42.585, −76.600 | in | **OK** box. Not a surveyed address in `offtakers.md` or facts-site2. ASSUMPTION cluster pin. Distance 3.53 km matches haversine (3.533). |
| rec_onsite | 42.602, −76.633 | in | **OK** on-site. 0.25 km. Name can be misread as Chelsea Recreation Center; the pin is the Cayuga parcel. |
| aqua_onsite | 42.6025, −76.634 | in | **OK** on-site. 0.16 km. |
| mckissick | 42.592, −76.538 | in | **OK** vs facts-site2 coords (42.592° N, 76.538° W). https://www.cayugalandscape.com (verified 2026-10-03). Not in `offtakers.md`. Not re-geocoded this pass. |
| myers_park | 42.548, −76.549 | in | **OK** coords vs facts-site2. https://www.lansingrec.com (verified 2026-10-03). Homepage, not a geocoder. |
| lansing_csd | 42.5442, −76.5339 | in | **OK** vs Nominatim high-school relation/11291689: 42.5441796, −76.533892, 10.583 km. https://nominatim.openstreetmap.org (verified 2026-10-03). Pin is the high school, not a three-school centroid. |
| dutch_harvest | 42.618, −76.530 | in | **OK** coords vs facts-site2. https://www.dutchharvestfarm.com (verified 2026-10-03). Not re-geocoded this pass. |
| woodsedge | 42.538, −76.500 | in | **CONFLICT.** See below. Do not treat as confirmed. |
| cargill | 42.5325, −76.5258 | in | **OK** coords vs facts-site2. Address 191 Portland Point Rd is in `offtakers.md`; that file says the mine did **not** return a Nominatim hit. https://dec.ny.gov/news/environmental-notice-bulletin/2024-11-20/completed-application/towns-of-covert-lansing-and-ulysses-cayuga-salt-mine (verified 2026-10-03). |
| library | 42.5377, −76.5031 | in | **OK** vs Nominatim node/2395664192: 42.5377303, −76.5031253, 13.050 km. https://nominatim.openstreetmap.org (verified 2026-10-03). |
| town_hall | 42.5378, −76.5036 | in | **OK** vs Nominatim community-center node/13095101428: 42.5377546, −76.5035996, 13.016 km. Town Hall street address in `offtakers.md` is 29 Auburn Road; the pin is the community center at 25 Auburn Road (same cluster). https://nominatim.openstreetmap.org (verified 2026-10-03). |
| airport | 42.4918, −76.4607 | **lat below 42.5** | **OK vs research, outside the strict box.** Matches Nominatim way/1133936379: 42.4918021, −76.4606946, 18.916 km. https://nominatim.openstreetmap.org (verified 2026-10-03). |
| cbtp | 42.488, −76.462 | **lat below 42.5** | **OK vs facts-site2, outside the strict box.** 42.488° N, 76.462° W. https://cornellbtp.com (verified 2026-10-03). |

All 14 longitudes are inside −76.7 to −76.4. No pin is in New York City. No sign error (none are +76).

### Outside the strict box — do not “fix” by sliding them north

- **airport** and **cbtp** sit near lat 42.49 because Ithaca Tompkins airport and the business park are in southern Lansing / the Ithaca line, not because they were geocoded to the wrong state.
- **Fix:** leave the pins. If the box is only a sanity check against NYC (about 40.74, −74.00), both pass. If a hard clip at 42.5 is required, drop them from a “town” map or widen the box to about **42.47–42.63**. Both already have `ring: "none"`.

### Town hall, library, school: JSON follows Nominatim; facts-site2 pins do not

`facts-site2.md` places Town Hall and the Library on the **same** point, 42.566° N, 76.532° W, and calls both **5.7 mi**. Haversine of that point from GEM is 9.43 km (5.86 mi), so the mile label matches *that* pin. The pin is **3.90 km** from the Nominatim community-center / library pair that `offtakers.md` recorded.

`facts-site2.md` places the school campus at 42.5457° N, 76.5186° W (**7.0 mi**). That point is **1.26 km east** of the Nominatim high school. Haversine of the facts-site2 pin is 7.15 mi; haversine of the JSON/OSM pin is **6.57 mi (10.58 km)**.

**Verdict:** JSON school, library, and town hall are **OK**. Do not edit them to the facts-site2 cluster. The 5.7 mi town-hall/library figure in facts-site2 and in `research/site-selection.md` is the short figure from the non-OSM pins.

Recomputed from GEM (2026-10-04):

| Place | JSON | OSM / this audit | facts-site2 label |
|---|---:|---:|---:|
| High school | 10.58 km / 6.57 mi | 10.583 km | 7.0 mi (different pin) |
| Library | 13.05 km / 8.11 mi | 13.050 km | 5.7 mi (different pin) |
| Town hall / community center | 13.01 km / 8.09 mi | 13.016 km | 5.7 mi (different pin) |
| Airport | 18.92 km / 11.75 mi | 18.916 km | 11.7 mi (pin 0.18 km away) |

School-to-town-hall separation is about **2.6 km**, which matches the model note of a ~2.5 km spur. The town-center main is about **8.1 miles**, longer than the “5–7 miles” brief. The school campus is inside that brief (6.6 mi). Economics for a town main should use **13.0 km**, not 5.7 mi.

### Woodsedge — CONFLICT, exact pin [unverified]

| Source | Pin | Distance from GEM |
|---|---|---|
| `offtakers.json` | 42.538, −76.500 | 13.25 km / 8.23 mi (haversine 13.248) |
| `facts-site2.md` | 42.567° N, 76.530° W | 9.53 km / 5.92 mi; file says **5.8 mi** |

The two pins are **4.05 km apart**. `offtakers.md` never geocoded 100 Woodsedge Drive. The facts-site2 URL is https://www.lansingtownny.gov (verified 2026-10-03), which is not a coordinate source. That 42.567 pin sits in the same cluster as the town-hall/library coordinates that fail Nominatim.

The JSON pin sits on the Auburn Road cluster that Nominatim did confirm (library 42.538, −76.503). That is the more consistent choice, but it is still an assumption until 100 Woodsedge Drive is geocoded.

**Fix:** do **not** move the JSON pin to 42.567, −76.530. Geocode “100 Woodsedge Drive, Lansing, NY 14882” and then replace both the JSON and the facts-site2 row. Until then mark the Woodsedge coordinate [unverified].

### Distance labels in facts-site2 that should not be copied over the JSON

JSON `dist_km` matches haversine from GEM within 0.005 km on all 14 rows. **Distances in the JSON are OK.**

facts-site2 mile labels that disagree with haversine even from *its own* origin (42.6028, −76.6336):

| Place | facts-site2 | Haversine from that origin | JSON from GEM |
|---|---:|---:|---:|
| McKissick | 4.9 mi | 4.92 mi | 5.04 mi / 8.11 km |
| Dutch Harvest | 5.4 mi | 5.37 mi | 5.49 mi / 8.84 km |
| Myers Park | 5.6 mi | 5.73 mi | 5.81 mi / 9.35 km |
| Cargill | **6.5 mi** | **7.33 mi** | **7.41 mi / 11.92 km** |
| CBTP | 11.5 mi | 11.80 mi | 11.88 mi / 19.11 km |

**Cargill 6.5 mi is WRONG** relative to the coordinates in the same facts-site2 row. **Fix the prose mile, not the JSON.** McKissick and Dutch Harvest labels are close enough. Myers and CBTP labels are short by about 0.1–0.3 mi.

McKissick at 8.11 km is just outside the 8.05 km / 5.0 mi screen in `offtakers.md`. Myers (9.35 km) and Dutch Harvest (8.84 km) are outside it too. They are still inside the lat/lon box. `ring: "corridor"` is a model phase, not that screen.

## Field-by-field: site1.json

Identity and supply. Capture temperature and the 30 MW case match the fact sheet’s assumption range. The simple product 30 × 0.75 × 0.55 = **12.375 MW** and **108.4 GWh**. The JSON reports hourly-mean **12.2 MW** and **107.0 GWh** (12.2 × 8760 / 1000 = 106.87, rounded to 107.0). **OK** as a rounded hourly result, not as that product. `load_factor` 0.75 is not in `facts-site1.md` (ASSUMPTION in `config/site1.yaml`).

| Field | JSON | Check | Verdict |
|---|---:|---|---|
| `meta.site` | 111 8th Ave, New York NY | facts-site1 address | **OK** |
| `meta.scenario` | comparison | PLAN: Site 1 is the comparison | **OK** |
| `meta.weather` | Central Park TMYx EPW | Right city for Site 1. Filename not opened this pass. | **OK** city. File bytes [unverified] |
| `it_load_MW` | 30 | facts-site1: named tenants ~22–28 MW; total **ASSUMPTION 30–40 MW** | **OK** as the low end of that assumption, not a metered load |
| `capture_fraction` | 0.55 | facts-site1: ~40–60% for air-cooled capture | **OK** inside the stated range |
| `capture_temp_C` | 32 | facts-site1 ASSUMPTION 29–35°C condenser return | **OK** |
| `heat_available_MW_avg` | 12.2 | Hourly mean, not 12.375 | **OK** with the note above |
| `heat_available_GWh` | 107.0 | Consistent with 12.2 MW | **OK** |
| `share_of_available_pct` | 30.47 | 32595 / 107000 × 100 = 30.46 | **OK** |
| `homes_served` | 2056 | facts-site1: **2,056 apartments** (Fulton + Elliott-Chelsea), not a Census household count. https://fultonelliottchelsea.com/ (verified 2026-10-03) | **OK count.** Key name says homes. 100% uptake is ASSUMPTION (`uptake: 1.0`) |
| `cop_compare` | 5.13 | Narrative rounds to 5.1 | **OK** model COP. See wording note |
| `totals.avg_cop` | 5.23 | Different definition (heat-pump heat / electricity, on-site excluded in `report._totals`) | **OK** that it is not 5.13. Do not quote them as the same number |
| `tariff_usd_mwh` | 95.0 | 0.80 × 118.7 = 94.96 | **OK** (20% under steam, because steam is the reference) |
| `lcoh` utility 7% | 287.9 | Narrative “$288/MWh” | **OK** rounding. Capex $72.01M, opex $3.58M, ring LCOHs, storage 3597 m³, backup 556 MWh, unmet 0: model outputs, not in facts-site1. Not rebuilt from the cash-flow formula this pass |
| `co2_cars_equiv` | 2500 | 11502 × 1000 / 4600 = 2500.4 | **OK** arithmetic vs 4.6 t/car. The 4.6 t figure was not re-fetched from EPA this pass |

### Steam $118.7/MWh — OK only with the enthalpy assumption

facts-site1: **$41.53/Mlb** 2025 average revenue, and “~$35–42/MMBtu equivalent.” https://www.sec.gov/ (ConEd 10-K) (verified 2026-10-03). The SEC URL in the fact sheet is the domain, not a filing path.

`config/site1.yaml` sets `steam_usd_mwh: 118.7` with the comment: $41.53/Mlb ÷ 1.194 MMBtu/Mlb = $34.78/MMBtu, × 3.412 MMBtu/MWh = **$118.68/MWh**. Hand check: **118.68**, JSON **118.7**. **OK** against that assumption. 1.194 MMBtu per thousand pounds is an enthalpy assumption (about 1,194 Btu/lb). It is not a line in facts-site1.

If 1 Mlb is treated as 1 MMBtu, the same $41.53 is **$141.7/MWh**. The fact sheet’s “$35–42/MMBtu” band covers both readings. **Fix if the team rejects the enthalpy adjustment:** set `incumbent_usd_mwh.steam` to **141.7** and the narrative “$119/MWh” to **$142/MWh**. Tariff at an 20% discount would become **$113.4/MWh**, not $95.

2023’s $34.84/Mlb × 3.412 = $118.9, which is almost the same dollar by coincidence. Do not describe $118.7 as the 2023 price. It is the 2025 price after dividing by 1.194.

### Incumbent fuels that are not Manhattan prices

| Fuel | JSON | Hand formula | Verdict |
|---|---:|---:|---|
| Propane | 136.1 | 3.10 / 26.8 / 0.85 × 1000 = **136.08** | Arithmetic **OK**. Price is the Central NY base used for Lansing, not a ConEd NYC propane tariff. Not in facts-site1. verification.md row 7b does **not** confirm a Central propane print (verified 2026-10-03). |
| Heating oil | 155.8 | 5.186 / 40.6 / 0.82 × 1000 = **155.77** | Arithmetic **OK**. $5.186 is the Central **monthly** average, not a NYC price. verification.md row 7a (verified 2026-10-03). https://www.nyserda.ny.gov/Energy-Prices/Home-Heating-Oil/Monthly-Average-Home-Heating-Oil-Prices |
| Natural gas | 88.3 | 2.20 / 29.307 / 0.85 × 1000 = **88.31** | Arithmetic **OK** vs `site1.yaml` `gas_usd_therm: 2.2`. That $2.20 is marked ASSUMPTION. Not in facts-site1. Site 2’s gas incumbent is $64.2 from $1.60/therm. |
| Electric resistance | 250.0 | $0.25/kWh × 1000 | **OK** vs site1.yaml ASSUMPTION. Not in facts-site1. |
| Air-source HP | 88.8 | 250 / seasonal COP → COP ≈ **2.82** | Model hourly COP. Not recomputed hour by hour. |
| Steam | 118.7 | see above | **OK** with the 1.194 assumption |

`reference` is `steam`. Propane and oil in this file must not be read as the Site 1 price test. The price test in the narrative is steam.

### why_not_chosen

| Claim in the JSON sentence | Check | Verdict |
|---|---|---|
| Chelsea UTEN at 85 10th Ave serves NYCHA Fulton Houses | facts-site1 (verified 2026-10-03) https://www.coned.com/ | **OK** |
| Capture ~32°C, legacy air / chilled water | facts-site1 29–35°C; JSON `capture_temp_C` 32 | **OK** |
| COP 5.1 vs 6.0 at Lansing | Site 1 `cop_compare` 5.13 rounds to 5.1. Site 2 liquid-cooled COP in `site2.json` is **6.0**, which is the model cap `cop_max: 6.0`, not a measured COP | **OK** as model vs model. Do not cite 6.0 as a field measurement |
| Blended LCOH $288/MWh vs steam $119/MWh | 287.9 and 118.7 | Numbers **OK**. The words **“a thin margin” are WRONG**. $288 is about **2.4×** steam. The project loses on price by about $169/MWh. **Fix:** replace “a thin margin” with the gap (about 2.4× steam; heat does not beat Con Ed steam). |
| Lansing blended phase 1–2 $100/MWh vs propane $136/MWh | `site2.json` utility LCOH **100.2**, propane **136.1** | **OK** rounding |
| 30 MW and NYCW 0.39 kg/kWh | 30 MW is the assumption above. eGRID2023 NYCW **865.7 lb/MWh** = **0.393 kg/kWh**. verification.md row 10a (verified 2026-10-03) https://www.epa.gov/egrid/summary-data . facts-site2 prints 0.3927 | **OK** rounded |
| Lansing ban makes heat reuse a condition of approval | verification.md row 1a: Town Board 2026-09-29 directed counsel to draft a ban (verified 2026-10-03). https://www.fingerlakes1.com/2026/10/02/lansing-moves-toward-data-center-ban-as-terawulf-debate-reaches-turning-point/ | **OK** as a qualitative line. This sentence does not use the 36/38 or $500k figures |

### fossil_displaced_MWh 55,254 — does not match the Site 1 loads

Configured annual loads that sum to the JSON delivered heat:

- Corridor: 2,056 × 10 MWh = **20,560**
- Town: schools 25,000 m² × 90 kWh/m² = 2,250, plus Mount Sinai/Callen-Lorde 2,500 and Chelsea Market 6,000 → **10,750**
- On-site rec: pool 900 + 3,500 m² × 110 kWh/m² = **1,285**
- Total **32,595 MWh**, equal to `heat_delivered_MWh`. **OK**, the delivered total matches `config/site1.yaml` annual loads (unmet hours are 0).

`src/heatreuse/impact.py` then divides by boiler efficiency. With Site 1 mixes (corridor and town 70% gas / 30% oil, on-site 100% gas; gas eff 0.85, oil eff 0.82):

20,560 × (0.70/0.85 + 0.30/0.82) + 10,750 × (0.70/0.85 + 0.30/0.82) + 1,285/0.85 ≈ **38,750 MWh** fuel.

JSON `fossil_displaced_MWh` is **55,254**. Gap about **16,500 MWh** (~42% high). **WRONG** against that formula and these loads.

**Fix:** rerun impact and replace 55,254 with the recomputed fuel total (hand estimate **~38,800 MWh**). Do not quote 55,254. `co2_avoided_t_yr` **11,502** comes from the same function, so treat **11,502 t and the 2,500-car line as not confirmed** until that rerun. The car count is only the CO2 figure divided by 4.6 t.

`erf` 0.1343 is a different ratio (source-side heat / IT). 0.1343 × (30 MW × 0.75 × 8,760 h) ≈ 26,470 MWh source heat. 26,470 + heat-pump electricity 5,920 ≈ 32,390, close to delivered 32,595. **Plausible, not exact.** Not marked wrong. IT × load factor ignores the outage model, so a small gap is expected.

### Source list inside site1.json

| id | Verdict |
|---|---|
| `tmy` | **WRONG file for this JSON.** Label and URL are Ithaca Tompkins AP 725155. `meta.weather` is Central Park. **Fix:** point `tmy` at the Central Park TMYx the meta string names, or change meta if the run actually used Ithaca (that would be the wrong climate for 111 8th Ave). |
| `nyserda_prop` | **WRONG URL** for the $5.186 figure. JSON points at the weekly “Average” page. verification.md row 7a: $5.186 is the Central **monthly** average. **Fix URL:** https://www.nyserda.ny.gov/Energy-Prices/Home-Heating-Oil/Monthly-Average-Home-Heating-Oil-Prices (verified 2026-10-03). The $/MWh oil number is still the Central figure, not a NYC price. |
| `egrid` | NYCW 865.7 and NYUP 242.8 match verification.md row 10a. **OK** |
| `f1` | Points at facts-site1. **OK** |
| `ver_proj` | Label states TeraWulf **400 MW gross / 320 MW critical IT**. That matches verification.md rows 3a/3b as the **full-build filing**, not Site 1 and not the 150 MW phase-1 case (verified 2026-10-03). It does not leak into `it_load_MW` (that stays 30). **OK as a Site 2 citation parked in a shared list.** Do not read it as the Site 1 load. |
| `ver_itc`, `ver_ef`, `f2`, organizer text ids | Shared bibliography. Not re-audited line by line. No Deep Green / Lansing, Michigan mix-up in this file. |

HDR site-pack figures in facts-site1 (noise, EJ percentiles, Hudson River IR 5, LL97 caps, $41.53 path, UTEN) are **not fields in site1.json**. That is a coverage gap, not a contradicted number. Equity language for Lansing does not belong on this NYC file; Fulton Houses are the Site 1 disparity the fact sheet actually states.

## Field-by-field: offtakers.json

Fourteen rows. Scores and peaks were recomputed with `scoring.py`: weights temp 0.20, size 0.25, proximity 0.25, fuel 0.15, community 0.15; fuel scores propane/oil 1.0, gas 0.2; full-load hours greenhouse 2,800, constant 7,000, building 1,800; proximity = 1 − dist/15 from the **GEM** origin.

**All 14 `score` values match to 0.1. All 14 `peak_MW` values match annual_MWh / full-load hours after rounding. All 14 `dist_km` values match haversine.** Internal math **OK**.

Loads are not in `offtakers.md` (that file still says loads are pending). `data/processed/offtakers.csv` has a header and **no data rows**, so it cannot confirm the JSON.

| id | annual_MWh | peak_MW | What the number is | Verdict |
|---|---:|---:|---|---|
| gh_onsite | 31416 | 11.22 | Model. 11.22 MW on 10 ha is near the RII order of ~1 MWth/ha (10 MW). Peak = 31416/2800. | **OK** as model output. Annual MWh not in offtakers.md |
| aqua_onsite | 4500 | 0.64 | Model. 4500/7000 = 0.643 → 0.64 | **OK** model. Fuel propane is ASSUMPTION |
| rec_onsite | 1160 | 0.64 | Model. 1160/1800 = 0.644 → 0.64 | **OK** model |
| corridor_homes | 13500 | 7.5 | Model corridor, not a named subdivision. 13500/1800 = 7.5 | **OK** model. Pin [unverified] as a real place |
| mckissick | 2500 | 0.89 | ASSUMPTION in `offtakers.yaml`. 2500/2800 = 0.893 → 0.89 | Load **[unverified]**. Coords OK as above |
| myers_park | 250 | 0.14 | ASSUMPTION. 250/1800 = 0.139 → 0.14 | Load **[unverified]** |
| lansing_csd | 2057 | 1.14 | 18,700 m² × 110 kWh/m² / 1000 = **2057**. Peak 2057/1800 = 1.143 → 1.14 | Area is ASSUMPTION. Student count behind the area comment is **OK**: NCES 371+355+392 = **1,118**. https://nces.ed.gov/ccd/schoolsearch/school_list.asp?DistrictID=3616710&Search=1 (verified 2026-10-03). Fuel **oil** is not in offtakers.md **[unverified]** |
| dutch_harvest | 300 | 0.17 | ASSUMPTION. 300/1800 = 0.167 → 0.17 | Load **[unverified]** |
| woodsedge | 1200 | 0.67 | ASSUMPTION. 1200/1800 = 0.667 → 0.67. Fuel gas [unverified] | Load **[unverified]**. Coordinate **CONFLICT** (above) |
| cargill | 8000 | 4.44 | Name already says load unverified. 8000/1800 = 4.444 → 4.44. Fuel gas [unverified] | Load **[unverified]** by the file’s own label. Coords OK vs facts-site2; **do not** change dist to 6.5 mi |
| library | 180 | 0.1 | ASSUMPTION. 180/1800 = 0.10. Fuel gas not stated in offtakers.md | Load **[unverified]** |
| town_hall | 140 | 0.08 | 140/1800 = 0.078 → 0.08. Capital plan: Town Hall ~**8,200 sq ft**, **220,000 Btu** gas condensing boiler. https://mccmeetingspublic.blob.core.usgovcloudapi.net/lansingny-meet-bea10836c3b84b16965c2d23450ae349/ITEM-Attachment-001-18802fdf921e47179751d6bc4d6039dc.pdf (verified 2026-10-03) | Fuel **gas OK**. 140 MWh is about 2,170 full-fire hours on a 220,000 Btu/h boiler (140 MWh × 3.412 MMBtu/MWh × 1e6 / 220,000 ≈ 2,171 h). **OK as an assumption consistent with that boiler, not a metered load** |
| airport | 5000 | 2.78 | ASSUMPTION. 5000/1800 = 2.778 → 2.78. Fuel gas [unverified] | Load **[unverified]**. Coords OK. Outside strict lat box |
| cbtp | 6000 | 3.33 | ASSUMPTION. 6000/1800 = 3.333 → 3.33. Fuel gas [unverified] | Load **[unverified]**. Coords OK. Outside strict lat box |

Town-hall and library **fuel: gas** is the right incumbent for buildings that already have gas. The NYSEG moratorium (verification.md row 6a: **February 2015**, not 2014; verified 2026-10-03) limits **new or expanded** service. It does not mean these existing boilers are propane. https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BE068C615-B8EE-4CB9-AF92-3153A49BE4E4%7D

No row is Deep Green or Lansing, Michigan.

`ring: "town"` on the school, town hall, library, and Woodsedge is a phase label. It does not mean the town main clears a cost test. Site 2’s town-ring LCOH in `site2.json` is $717.6/MWh (7%), far above propane $136/MWh. That figure is outside this file; it is why these rows should stay conditional.

## Cross-file conflicts

1. **Town hall / library distance.** JSON and Nominatim: **~13.0 km (8.1 mi)**. facts-site2 and site-selection prose: **5.7 mi**. Use the JSON. The 5.7 mi pin fails Nominatim by 3.9 km.
2. **School distance.** JSON: **10.58 km (6.57 mi)** at the high school. facts-site2: **7.0 mi** at a pin 1.26 km further east. Use the JSON for the high-school building. A true campus centroid of the three NCES schools was not computed (elementary was not geocoded in offtakers.md).
3. **Woodsedge.** JSON 8.23 mi next to the Auburn Road cluster vs facts-site2 5.8 mi at 42.567, −76.530. Unresolved. Do not silently pick 5.8 mi.
4. **Cargill miles.** Coordinates agree. **6.5 mi does not.** JSON **11.92 km (7.41 mi)** is the haversine.
5. **Two plant origins.** GEM 42.602544, −76.635978 (JSON distances) vs 42.6028, −76.6336 (facts-site2 miles). About 200 m. Enough to move a mile label by ~0.1 mi, not enough to explain the town-hall gap.
6. **Site 1 fossil vs delivered heat.** 55,254 vs a formula result near 38,800. See above.
7. **Site 1 weather citation vs meta.** Ithaca TMYx in `sources` vs Central Park in `meta.weather`.
8. **Site 1 “thin margin”.** $288 vs $119 is a wide loss, not a thin margin.
9. **Empty `data/processed/offtakers.csv`.** Research file points at it. It has no body. JSON is the only populated offtaker table.
10. **Steam unit.** $118.7/MWh is $41.53/Mlb after ÷1.194. The unadjusted conversion is $141.7/MWh. Say which one the slide uses.

## Fixes

Apply in the model configs and regenerate JSON. This audit does not edit `web/`, `config/`, or `src/`.

1. **site1.json `why_not_chosen`:** delete “a thin margin.” State blended LCOH **$288/MWh** versus steam **$119/MWh** (about 2.4×), so Site 1 does not beat Con Ed steam.
2. **site1.json `impact.fossil_displaced_MWh`:** replace **55254** after a rerun. Hand estimate from the published loads and Site 1 gas/oil mixes is **~38,800 MWh**. Hold **11,502 t CO2** until the same rerun.
3. **site1.json `sources` id `tmy`:** cite the Central Park EPW named in `meta.weather`, not Ithaca 725155.
4. **site1.json `sources` id `nyserda_prop`:** monthly oil URL above. Keep propane/oil labeled as Central NY comparison prices, not NYC tariffs.
5. **Steam, only if the team drops the 1.194 factor:** steam **141.7**, narrative **$142/MWh**, 20% tariff **113.4**.
6. **Woodsedge:** geocode 100 Woodsedge Drive before either pin is treated as fact. Do not move the JSON to 42.567, −76.530 just to match facts-site2.
7. **Do not change** school, library, or town-hall coordinates or their 10.58 / 13.05 / 13.01 km distances. Update any slide that still says town hall and library are 5.7 miles away.
8. **Do not change** Cargill, airport, or CBTP coordinates. Do not clip airport or CBTP to lat 42.5. Quote Cargill as **7.4 mi / 11.9 km**, not 6.5 mi.
9. **rec_onsite name:** add “on-site at Cayuga / Lake Hawkeye” so it is not read as Chelsea Recreation Center.
10. **corridor_homes:** keep the score math; label the coordinate as a representative corridor point, not a surveyed building.

## Lane status

- **Done:**
  - Headings-first audit file written and filled in this pass.
  - All 14 offtaker coordinates tested against lat 42.5–42.7 and lon −76.7 to −76.4.
  - All 14 distances, peaks, and scores recomputed from GEM 42.602544, −76.635978 and `scoring.py`.
  - School, library, town hall, and airport checked against the Nominatim rows in `research/offtakers.md`.
  - facts-site2 mile labels checked against haversine from both origins.
  - Site 1 identity, 30 MW assumption, 32°C, 55% capture, 107 GWh vs 12.2 MW, 2,056 units, steam arithmetic, tariff, LCOH rounding, NYCW 0.39 kg/kWh, and the $100 vs $136 Lansing line checked.
  - Fossil-fuel hand check against Site 1 annual loads.
  - Confirmed these two JSON files do not cite Deep Green or Lansing, Michigan, and do not claim heat reuse saves Cayuga Lake water.
- **Missing:**
  - No live geocode this pass for Woodsedge, McKissick, Myers Park, Dutch Harvest, Cargill, CBTP, or 111 8th Avenue. Those verdicts rest on `offtakers.md` and `facts-site2.md`.
  - Hourly model was not rerun, so capex, the three LCOHs, storage, backup, `avg_cop` 5.23, `cop_compare` 5.13, and CO2 tonnes were not rebuilt. Only the fossil total and the load sum were hand-checked.
  - ConEd 10-K, EPA eGRID, and NYSERDA pages were not re-downloaded. Stamps are the research file’s (verified 2026-10-03).
  - `offtakers.csv` is empty, so there is no CSV cross-check.
  - Elementary-school coordinate still missing in `offtakers.md`, so the campus pin stays the high school only.
  - Central propane $3.10/gal remains unverified in verification.md (row 7b).
- **Open questions:**
  - What is the Nominatim (or county parcel) coordinate for 100 Woodsedge Drive?
  - Was `fossil_displaced_MWh` 55,254 produced by an older impact mix? A clean rerun should land near 38,800 MWh if current `site1.yaml` mixes are applied to the 32,595 MWh.
  - Does the team want steam at $118.7/MWh (enthalpy-adjusted) or $141.7/MWh (1 Mlb = 1 MMBtu)?
  - Should airport and CBTP stay on the map with `ring: "none"`, given they fail a hard 42.5°N clip but match the research coordinates?

# Model notes: assumption log (quant model, lane C30/model)

Started 2026-10-03. Every config input has a source (URL or resources/text file) or `ASSUMPTION: reason`. Organizer docs outrank web sources.

## Source discrepancies found
- Town hall / library / school coordinates: facts-site2.md lists Town Hall at 42.566,-76.532 (5.7 mi). research/offtakers.md OSM Nominatim geocodes put Town Hall/Library near 42.5377,-76.5031 (13 km) and Lansing schools at 10.4-10.6 km. Model uses Nominatim (geocoded) distances; school ~10.5 km, town hall ~13 km; this matches the "6-7 mi" brief for the school.

# Lansing Heat Reuse

Business Analytics Club Hackathon 2026. Community heat reuse proposal for the TeraWulf data center campus at the former Cayuga coal plant site, Lansing, NY.

## Approach

Design from the demand side: who needs heat, when, at what temperature, and what they can afford. Treat the data center as an abundant, cheap heat source.

- **Capture:** direct liquid cooling (45-60°C return) feeding a sidestream plate heat exchanger; dry coolers stay the primary rejection path.
- **Network:** hot anchor loop (65-70°C) for school, community facilities, greenhouses; ambient 5th-gen loop (15-25°C) for homes with local heat pumps.
- **Reliability:** thermal storage plus existing backup boilers at anchor customers.
- **Ownership:** community thermal utility with a long-term heat supply agreement and step-in clause.

## Workstreams

| Area | Output |
|---|---|
| Engineering | 8,760-hour supply/demand model, COP, sizing, storage |
| Data / GIS | Offtaker scoring, maps, ResStock/ComStock loads |
| Finance | Capex/opex, levelized cost of heat, deal structure |
| Story / community | Stakeholders, risk matrix, carbon and water impact, slides |

## Run the model

```bash
uv sync
uv run python -m heatreuse      # writes outputs/site2.json, annual_summary.json, headline_numbers.json
uv run pytest                   # energy balance, COP bounds, storage, LCOH hand-check, contract shape
```

Every input lives in `assumptions.yaml`, tagged `[fact:<id>]`, `[assumption]` or `[unverified]`. Drop an 8,760-row `data/raw/tmy_ithaca.csv` with a `temp_C` column to replace the synthetic weather year.

## Web app

`web/` is a static Next.js app with a guided Story mode and an Explore mode. See `web/README.md`. Rebuild data with `python3 scripts/export_web_data.py` after any model run.

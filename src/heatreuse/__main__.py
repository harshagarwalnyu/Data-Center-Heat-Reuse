"""Run the model end to end: `uv run python -m heatreuse [--config PATH] [--out DIR] [--no-tornado]`."""

from __future__ import annotations

import argparse
from pathlib import Path

from . import model, report


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--config", default=model.ROOT / "assumptions.yaml")
    ap.add_argument("--out", default=model.ROOT / "outputs")
    ap.add_argument("--no-tornado", action="store_true")
    args = ap.parse_args()

    out, res = report.build(model.load_config(args.config), with_tornado=not args.no_tornado)
    report.write(out, res, Path(args.out))

    t, f, i = out["totals"], out["finance"], out["impact"]
    print(f"Weather: {out['meta']['weather']}")
    print(f"Heat available: {out['supply']['heat_available_GWh']:,} GWh/yr")
    for r in out["rings"]:
        g = r["gate"]
        status = "BUILT" if r["built"] else "gated"
        print(f"  {r['id']:9s} {status:6s} {r['annual_MWh']:>8,} MWh  peak {r['peak_MW']:>6} MW  "
              f"LCOH ${g['lcoh_usd_mwh']:>6}/MWh vs {g['benchmark']} ${g['benchmark_usd_mwh']}  "
              f"breakeven grant {g['breakeven_capex_grant_frac']}")
    print(f"Delivered {t['heat_delivered_MWh']:,} MWh ({t['share_of_available_pct']}% of available), "
          f"backup {t['backup_MWh']:,} MWh, unmet hours {t['unmet_hours']}")
    print(f"System LCOH {f['lcoh_usd_mwh']}  capex ${f['capex_musd']['total']}M  CO2 avoided {i['co2_avoided_t_yr']:,} t/yr")
    print(f"Wrote {args.out}/site2.json, annual_summary.json, headline_numbers.json, hourly_site2.csv")


if __name__ == "__main__":
    main()

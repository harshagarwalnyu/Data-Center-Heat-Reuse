"""Input register + one-at-a-time swing test.

`uv run python -m heatreuse.verify` lists every numeric input in assumptions.yaml with its tag
([fact:<id>], [assumption], [unverified]) and swings each assumption and unverified input
(x0.7 / x1.3, or +/-3 K for temperatures). It flags inputs that flip a ring gate or move a
headline number by more than the threshold, and writes outputs/verify_report.md.
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

import yaml

from . import model, report

TAG = re.compile(r"\[(fact:[\w-]+|assumption|unverified)")
# Inputs that are identifiers, calendar positions or bounds, not quantities to swing.
SKIP = {"year_hours", "seed", "lat_deg", "phase", "start_doy", "start_hour", "center_doy", "days", "hours", "year",
        "years", "cop_min", "cop_max", "eta_carnot"}
HEADLINES = {
    "onsite_lcoh": lambda o: _ring(o, "onsite")["gate"]["lcoh_usd_mwh"],
    "corridor_lcoh": lambda o: _ring(o, "corridor")["gate"]["lcoh_usd_mwh"],
    "town_lcoh": lambda o: _ring(o, "town")["gate"]["lcoh_usd_mwh"],
    "heat_delivered": lambda o: o["totals"]["heat_delivered_MWh"],
    "capex": lambda o: o["finance"]["capex_musd"]["total"],
    "co2": lambda o: o["impact"]["co2_avoided_t_yr"],
    "household_savings": lambda o: o["finance"]["household"]["savings_vs_propane_usd"],
}


def _ring(out: dict, rid: str) -> dict:
    return next(r for r in out["rings"] if r["id"] == rid)


def register(path: Path) -> list[dict]:
    """Every numeric leaf with its dotted path, value and tag (read from the line's comment)."""
    rows: list[dict] = []
    stack: list[tuple[int, str, str]] = []  # (indent, key, tag inherited by children)
    pending = ""  # tag on a comment-only line applies to the next key and its children
    for line in path.read_text().splitlines():
        if line.strip().startswith("#"):
            m = TAG.search(line)
            pending = m.group(1) if m else pending
            continue
        body = line.split("#", 1)[0].rstrip()
        if not body.strip() or body.strip().startswith("-"):
            continue
        indent = len(line) - len(line.lstrip())
        key, _, rest = body.strip().partition(":")
        while stack and stack[-1][0] >= indent:
            stack.pop()
        prefix = ".".join(k for _, k, _ in stack)
        full = f"{prefix}.{key}" if prefix else key
        m = TAG.search(line)
        tag = (m.group(1) if m else "") or pending or next((t for _, _, t in reversed(stack) if t), "")
        pending = ""
        rest = rest.strip()
        if not rest:
            stack.append((indent, key, tag))
            continue
        try:
            value = yaml.safe_load(rest)
        except yaml.YAMLError:  # continuation line of a multi-line flow mapping (gate_path steps)
            continue
        if isinstance(value, dict):
            for k, v in value.items():
                if isinstance(v, (int, float)) and not isinstance(v, bool):
                    rows.append({"path": f"{full}.{k}", "value": v, "tag": tag})
        elif isinstance(value, (int, float)) and not isinstance(value, bool):
            rows.append({"path": full, "value": value, "tag": tag})
    return rows


def _swing_values(row: dict) -> list[float]:
    v = row["value"]
    if row["path"].endswith("_C"):
        return [v - 3, v + 3]
    lo, hi = v * 0.7, v * 1.3
    if isinstance(v, int):  # counts and hour windows stay integers
        lo, hi = round(lo), round(hi)
    return [lo, hi]


def swing(cfg: dict, rows: list[dict], threshold: float) -> tuple[dict, list[dict]]:
    base, _ = report.build(cfg, with_tornado=False)
    base_vals = {k: f(base) for k, f in HEADLINES.items()}
    base_built = set(base["meta"]["built_rings"])
    results = []
    for row in rows:
        leaf = row["path"].rsplit(".", 1)[-1]
        if not row["tag"] or row["tag"].startswith("fact") or leaf in SKIP:
            continue
        if row["path"].startswith(("tornado", "context", "rings.corridor.gate_path")):
            continue
        worst, flips, detail = 0.0, set(), dict.fromkeys(HEADLINES, 0.0)
        for val in _swing_values(row):
            out, _ = report.build(model.with_overrides(cfg, {row["path"]: val}), with_tornado=False)
            flips |= set(out["meta"]["built_rings"]) ^ base_built
            for k, f in HEADLINES.items():
                b = base_vals[k]
                change = (f(out) - b) / b if b else 0.0
                if abs(change) > abs(detail.get(k, 0.0)):
                    detail[k] = change
                worst = max(worst, abs(change))
        top = max(detail, key=lambda k: abs(detail[k]))
        results.append({**row, "flips": sorted(flips), "worst": worst, "top_metric": top, "top_change": detail[top],
                        "flag": bool(flips) or worst > threshold})
    results.sort(key=lambda r: (not r["flips"], -r["worst"]))
    return base_vals, results


def write_report(rows: list[dict], results: list[dict], base_vals: dict, threshold: float, out: Path) -> None:
    n = {t: sum(1 for r in rows if r["tag"].startswith(t)) for t in ("fact", "assumption", "unverified")}
    untagged = [r["path"] for r in rows if not r["tag"] and r["path"].rsplit(".", 1)[-1] not in SKIP]
    lines = [
        "# Input verification report",
        "",
        "Generated by `uv run python -m heatreuse.verify`. Each assumption and unverified input is swung "
        "one at a time (x0.7 and x1.3, or +/-3 K for temperatures) with everything else at base.",
        "",
        f"Inputs: {n['fact']} fact, {n['assumption']} assumption, {n['unverified']} unverified, {len(untagged)} untagged.",
        "",
        "Base: " + ", ".join(f"{k} {v:,.1f}" for k, v in base_vals.items()),
        "",
        f"## Flagged: flips a ring gate or moves a headline number by more than {threshold:.0%}",
        "",
        "| Input | Value | Tag | Flips gate | Biggest move |",
        "|---|---|---|---|---|",
    ]
    for r in (r for r in results if r["flag"]):
        lines.append(f"| `{r['path']}` | {r['value']} | {r['tag']} | {', '.join(r['flips']) or '-'} | "
                     f"{r['top_metric']} {r['top_change']:+.0%} |")
    lines += ["", "## Not flagged (safe to leave as an assumption for now)", "",
              "| Input | Value | Tag | Biggest move |", "|---|---|---|---|"]
    for r in (r for r in results if not r["flag"]):
        lines.append(f"| `{r['path']}` | {r['value']} | {r['tag']} | {r['top_metric']} {r['top_change']:+.1%} |")
    if untagged:
        lines += ["", "## Untagged numeric inputs", ""] + [f"- `{p}`" for p in untagged]
    out.write_text("\n".join(lines) + "\n")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--config", default=model.ROOT / "assumptions.yaml")
    ap.add_argument("--threshold", type=float, default=0.10)
    ap.add_argument("--out", default=model.ROOT / "outputs" / "verify_report.md")
    args = ap.parse_args()
    path = Path(args.config)
    rows = register(path)
    base_vals, results = swing(model.load_config(path), rows, args.threshold)
    write_report(rows, results, base_vals, args.threshold, Path(args.out))
    flagged = [r for r in results if r["flag"]]
    print(f"{len(rows)} numeric inputs; swung {len(results)}; flagged {len(flagged)}")
    for r in flagged:
        print(f"  {r['path']:55s} {r['tag']:11s} flips={','.join(r['flips']) or '-':9s} {r['top_metric']} {r['top_change']:+.0%}")
    print(f"Wrote {args.out}")


if __name__ == "__main__":
    main()

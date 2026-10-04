"""Self-check: input register, sane-bounds checks and energy balance.

    uv run python -m heatreuse.verify

Reads config/*.yaml and outputs/site2.json (docs/data-contract.md), writes
outputs/verify_report.md and outputs/input_register.json (the register shown on the web
Data & Sources page). Exit code 1 if any check FAILs.

Ported in spirit from Linson Lee's PR #1 verify.py (input register with source tags),
adapted to this repo's config layout and verified facts (research/verification.md).
The one-at-a-time swing test was not ported: the tornado in site2.json already covers it.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
CONFIG = ROOT / "config"
OUT = ROOT / "outputs"
CONFIG_FILES = ("engineering.yaml", "finance.yaml", "impact.yaml", "offtakers.yaml")

# Unit by key suffix / name (first match wins).
UNITS = [
    ("_usd_gal_range", "$/gal"), ("_m_s", "m/s"), ("_pa_m", "Pa/m"), ("_mm", "mm"), ("_head_m", "m"), ("_dn", "DN"),
    ("_usd_kwh", "$/kWh"), ("_usd_mwh", "$/MWh"), ("_usd_gal", "$/gal"), ("_usd_therm", "$/therm"),
    ("_usd_kw", "$/kW"), ("_usd_m3", "$/m3"), ("_usd_m", "$/m"), ("_usd_home", "$/home"), ("_usd_yr", "$/yr"),
    ("usd_per_mw_it", "$/MW IT"), ("_usd", "$"), ("_mw", "MW"), ("_c", "C"), ("_k", "K"), ("_km", "km"),
    ("_ha", "ha"), ("_m2", "m2"), ("kwh_m2", "kWh/m2"), ("_mwh", "MWh"), ("mwh_per_home", "MWh/home"),
    ("_t_yr", "t/yr"), ("_kg_kwh", "kg CO2/kWh"), ("_kwh_gal", "kWh/gal"), ("_w_m2k", "W/m2K"), ("_w_m", "W/m"),
    ("_pct", "fraction"), ("_share", "fraction"), ("_hours", "h"), ("_h", "h"), ("share", "fraction"),
    ("fraction", "fraction"), ("uptake", "fraction"), ("eta", "fraction"), ("efficiency", "fraction"),
    ("lat", "deg"), ("lon", "deg"), ("seed", "seed"), ("community", "fraction"), ("mwh", "MWh"),
    ("years", "years"), ("year", "year"), ("homes", "homes"),
]
TAG_LEGEND = re.compile(r"\[(\w+)\]=([\w./-]+)")
ASSUMPTION = re.compile(r"\[A\]|ASSUMPTION", re.I)
UNVERIFIED = re.compile(r"unverified|unverifiable|not checked", re.I)


def unit_for(path: str) -> str:
    leaf = re.sub(r"\[\d+\]$", "", path.rsplit(".", 1)[-1].lower())
    for frag, unit in UNITS:
        if leaf.endswith(frag) or leaf == frag:
            return unit
    return "-"


def _legend(lines: list[str]) -> dict[str, str]:
    leg: dict[str, str] = {}
    for ln in lines:
        if ln.startswith("#"):
            leg.update(TAG_LEGEND.findall(ln))
    return leg


def _split_comment(line: str) -> tuple[str, str]:
    body, sep, cm = line.partition(" #")
    return body.rstrip(), cm.strip() if sep else ""


def _emit(rows: list[dict], path: Path, legend: dict[str, str], full: str, val, note: str) -> None:
    """Append one row per numeric leaf of a parsed YAML value (scalar, flow mapping or list)."""
    if isinstance(val, dict):
        items = list(val.items())
    elif isinstance(val, list):
        items = [(i, v) for i, v in enumerate(val)]
    else:
        items = [(None, val)]
    for k, v in items:
        if isinstance(v, bool) or not isinstance(v, (int, float)):
            continue
        p = full if k is None else f"{full}[{k}]" if isinstance(k, int) else f"{full}.{k}"
        src = note
        for tag, where in legend.items():
            if tag != "A":
                src = src.replace(f"[{tag}]", f"[{tag}: {where}]")
        conf = "unverified" if UNVERIFIED.search(src) else "assumption" if ASSUMPTION.search(src) else "sourced" if src else "untagged"
        rows.append({"input": f"{path.stem}.{p}", "value": v, "unit": unit_for(p), "source": src, "confidence": conf})


def register(path: Path) -> list[dict]:
    """Every numeric leaf: dotted path, value, unit, source text, confidence.

    The source is the line's own comment, else a preceding comment-only line, else the nearest
    enclosing key's comment. Empty source means the input is untagged (a FAIL).
    """
    lines = path.read_text(encoding="utf-8").splitlines()
    legend = _legend(lines)
    rows: list[dict] = []
    stack: list[tuple[int, str, str]] = []  # (indent, key, comment inherited by children)
    pending = ""
    counters: dict[str, int] = {}
    for raw in lines:
        s = raw.strip()
        if not s:
            pending = ""
            continue
        if s.startswith("#"):
            if not TAG_LEGEND.search(s):
                pending = s.lstrip("# ").strip()
            continue
        body, cm = _split_comment(raw)
        indent = len(raw) - len(raw.lstrip())
        stripped = body.strip()
        if stripped.startswith("- "):  # list item: belongs to the nearest enclosing key
            while stack and stack[-1][0] >= indent:
                stack.pop()
            parent = ".".join(k for _, k, _ in stack)
            n = counters.get(parent, 0)
            counters[parent] = n + 1
            try:
                val = yaml.safe_load(stripped[2:])
            except yaml.YAMLError:
                continue
            tag = str(val.get("id") or val.get("name") or n) if isinstance(val, dict) else str(n)
            inherited = next((c for _, _, c in reversed(stack) if c), "")
            note = cm or pending or inherited
            pending = ""
            _emit(rows, path, legend, f"{parent}[{tag}]", val, note)
            continue
        if ":" not in body:
            continue
        key, _, rest = stripped.partition(":")
        while stack and stack[-1][0] >= indent:
            stack.pop()
        full = ".".join([k for _, k, _ in stack] + [key.strip()])
        inherited = next((c for _, _, c in reversed(stack) if c), "")
        note = cm or pending or inherited
        pending = ""
        rest = rest.strip()
        if not rest:
            stack.append((indent, key.strip(), note))
            continue
        try:
            val = yaml.safe_load(rest)
        except yaml.YAMLError:  # continuation of a multi-line flow mapping
            continue
        _emit(rows, path, legend, full, val, note)
    return rows


# --- checks ---------------------------------------------------------------------------------
Check = tuple[str, str, str]  # (status, name, detail)


def _near(a: float, b: float, rel: float = 0.005, absol: float = 1.0) -> bool:
    return abs(a - b) <= max(absol, rel * max(abs(a), abs(b)))


def check_register(rows: list[dict]) -> list[Check]:
    bad = [r["input"] for r in rows if r["confidence"] == "untagged"]
    n = {c: sum(1 for r in rows if r["confidence"] == c) for c in ("sourced", "assumption", "unverified")}
    return [("FAIL" if bad else "PASS", "Every config input has a source or ASSUMPTION note",
             f"{len(rows)} numeric inputs: {n['sourced']} sourced, {n['assumption']} assumption, {n['unverified']} unverified; "
             f"untagged: {', '.join(bad) if bad else 'none'}")]


def check_facts(cfg: dict, s2: dict) -> list[Check]:
    out: list[Check] = []
    price = cfg["finance"]["prices"]["propane_usd_gal"]
    out.append(("PASS" if price == 3.10 else "FAIL", "Propane base price is $3.10/gal (verification.md 7b)", f"config = {price}"))
    labels = " ".join(x["label"] for x in s2["sources"])
    out.append(("PASS" if "3.10" in labels else "FAIL", "site2.json sources cite the $3.10 propane base", "NYSERDA entry"))
    blob = json.dumps(s2)
    stale = re.search(r"moratorium[^\"]{0,60}2014|2014[^\"]{0,60}moratorium", blob, re.I)
    ok15 = "moratorium Feb 2015" in blob
    out.append(("PASS" if ok15 and not stale else "FAIL", "Gas moratorium dated Feb 2015, not 2014 (verification.md 6a)",
                "stale 2014 wording found" if stale else "Feb 2015 cited in sources" if ok15 else "moratorium date missing from site2.json"))
    lc = s2["finance"]["lcoh_usd_mwh"]["utility_7pct"]
    inc = s2["extras"].get("lcoh_incentive_scenario_if_qualifies_usd_mwh")
    lines = " ".join(x["item"].lower() for x in s2["finance"]["capex_musd"]["lines"])
    no_itc = s2["meta"].get("scenario") == "base" and (inc is None or inc < lc) and not re.search(r"\bitc\b|\bgrant\b", lines)
    out.append(("PASS" if no_itc else "FAIL", "No federal ITC in the base case (incentive case reported separately)",
                f"base LCOH {lc} vs incentive-if-qualifies {inc}; ITC kept in extras only"))
    return out


def check_bounds(s2: dict, cfg: dict) -> list[Check]:
    T, F, I, S = s2["totals"], s2["finance"], s2["impact"], s2["supply"]
    inc = F["incumbent_usd_mwh"]
    avail_frac = cfg["engineering"]["supply"]["capture_availability"]
    oil_ef = cfg["impact"]["ef_kg_kwh"]["oil"]  # t/MWh == kg/kWh; oil is the highest-emitting displaced fuel
    cases = [
        ("avg COP within the organizer 2-6 range", 2.0 <= T["avg_cop"] <= 6.0, T["avg_cop"]),
        ("share of available heat used in 0-100%", 0 < T["share_of_available_pct"] < 100, T["share_of_available_pct"]),
        ("unmet hours >= 0", T["unmet_hours"] >= 0, T["unmet_hours"]),
        ("backup share of annual heat below 10%", T["backup_MWh"] / T["heat_delivered_MWh"] < 0.10, round(T["backup_MWh"] / T["heat_delivered_MWh"], 4)),
        ("LCOH (all three rates) between $20 and $300/MWh", all(20 <= v <= 300 for v in F["lcoh_usd_mwh"].values()), F["lcoh_usd_mwh"]),
        ("LCOH rises with discount rate", F["lcoh_usd_mwh"]["coop_4pct"] < F["lcoh_usd_mwh"]["utility_7pct"] < F["lcoh_usd_mwh"]["private_10pct"], ""),
        ("capex total between $5M and $200M", 5 <= F["capex_musd"]["total"] <= 200, F["capex_musd"]["total"]),
        ("capex lines sum to total", _near(sum(x["musd"] for x in F["capex_musd"]["lines"]), F["capex_musd"]["total"], 0.005, 0.05), ""),
        ("propane incumbent within $100-$180/MWh (propane $2.74-$3.46/gal)", 100 <= inc["propane"] <= 180, inc["propane"]),
        ("tariff below propane-equivalent", F["tariff_usd_mwh"] < inc["propane"], F["tariff_usd_mwh"]),
        ("low-income tariff below standard tariff", F["low_income_tariff_usd_mwh"] < F["tariff_usd_mwh"], F["low_income_tariff_usd_mwh"]),
        (f"CO2 avoided positive and under fossil displaced x {oil_ef} t/MWh", 0 < I["co2_avoided_t_yr"] < I["fossil_displaced_MWh"] * oil_ef, I["co2_avoided_t_yr"]),
        ("ERF within 0-1", 0 <= I["erf"] <= 1, I["erf"]),
        ("heat available = IT x load factor x capture x availability x 8760 h",
         _near(S["heat_available_GWh"], S["it_load_MW"] * S["load_factor"] * S["capture_fraction"] * 8.76 * avail_frac, 0.01, 0.5), S["heat_available_GWh"]),
        ("greenhouse area stays in hectares (<= 50 ha)", 0 < I["greenhouse_ha"] <= 50, I["greenhouse_ha"]),
    ]
    return [("PASS" if ok else "FAIL", n, str(v)) for n, ok, v in cases]


def check_balance(s2: dict) -> list[Check]:
    T = s2["totals"]
    ring_sum = sum(r["annual_MWh"] for r in s2["rings"] if not r.get("conditional"))
    m = s2["monthly"]
    hours = s2["weeks"]["winter"] + s2["weeks"]["summer"]
    worst_h = max(abs(h["demand_MW"] - h["delivered_MW"] - h["backup_MW"]) for h in hours)
    hp, cop, deliv = T["hp_elec_MWh"], T["avg_cop"], T["heat_delivered_MWh"]
    corr = next(r["annual_MWh"] for r in s2["rings"] if r["id"] == "corridor")
    avail = s2["supply"]["heat_available_GWh"] * 1000
    m_deliv = sum(x["delivered_MWh"] + x["backup_MWh"] for x in m)
    cases = [
        ("built rings' annual MWh = heat delivered", _near(ring_sum, deliv), f"{ring_sum:.0f} vs {deliv:.0f}"),
        ("monthly delivered + backup = heat delivered", _near(m_deliv, deliv), f"{m_deliv:.0f} vs {deliv:.0f}"),
        ("monthly backup = annual backup", _near(sum(x["backup_MWh"] for x in m), T["backup_MWh"]), ""),
        ("monthly demand = heat delivered (nothing unmet)", _near(sum(x["demand_MWh"] for x in m), deliv), f"{sum(x['demand_MWh'] for x in m):.0f}"),
        ("hourly: demand = delivered + backup (sample weeks)", worst_h < 0.01, f"worst gap {worst_h:.4f} MW"),
        ("heat-pump electricity = corridor heat / avg COP (within 3%; on-site is direct exchange)", _near(hp, corr / cop, 0.03, 1.0), f"{hp:.0f} vs {corr / cop:.0f}"),
        ("heat drawn from the data center fits within available supply", 0 < deliv - hp <= avail, f"{deliv - hp:.0f} MWh of {avail:.0f}"),
        ("share of available = delivered / available", _near(T["share_of_available_pct"], 100 * deliv / avail, 0.02, 0.1), T["share_of_available_pct"]),
    ]
    return [("PASS" if ok else "FAIL", n, str(v)) for n, ok, v in cases]


def run(site_json: Path | None = None, write: bool = True) -> tuple[list[Check], list[dict]]:
    cfg = {Path(f).stem: yaml.safe_load((CONFIG / f).read_text(encoding="utf-8")) for f in CONFIG_FILES}
    s2 = json.loads((site_json or OUT / "site2.json").read_text(encoding="utf-8"))
    rows = [r for f in CONFIG_FILES for r in register(CONFIG / f)]
    checks = check_register(rows) + check_facts(cfg, s2) + check_bounds(s2, cfg) + check_balance(s2)
    if write:
        OUT.mkdir(exist_ok=True)
        (OUT / "input_register.json").write_text(json.dumps(rows, indent=2), encoding="utf-8")
        (OUT / "verify_report.md").write_text(render(checks, rows, s2), encoding="utf-8")
    return checks, rows


def render(checks: list[Check], rows: list[dict], s2: dict) -> str:
    n = {k: sum(1 for c in checks if c[0] == k) for k in ("PASS", "WARN", "FAIL")}
    L = ["# Verification report", "",
         f"Generated by `uv run python -m heatreuse.verify` from `config/*.yaml` and `outputs/site2.json` ({s2['meta']['generated']}, scenario {s2['meta']['scenario']}).", "",
         f"**{n['PASS']} PASS, {n['WARN']} WARN, {n['FAIL']} FAIL.**", "",
         "| Status | Check | Detail |", "|---|---|---|"]
    L += [f"| {s} | {name} | {detail.replace('|', '/')} |" for s, name, detail in checks]
    L += ["", "## Input register", "", "| Input | Value | Unit | Confidence | Source |", "|---|---|---|---|---|"]
    L += [f"| `{r['input']}` | {r['value']} | {r['unit']} | {r['confidence']} | {r['source'].replace('|', '/')[:160]} |" for r in rows]
    return "\n".join(L) + "\n"


def main() -> int:
    checks, rows = run()
    for s, name, detail in checks:
        print(f"{s:4s} {name}: {detail}")
    fails = sum(1 for c in checks if c[0] == "FAIL")
    print(f"{len(rows)} inputs; {fails} FAIL. Wrote {OUT / 'verify_report.md'}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())

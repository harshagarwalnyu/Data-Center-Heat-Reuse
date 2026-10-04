"""Build outputs/site2.json (docs/data-contract.md) plus summary files."""

from __future__ import annotations

import csv
import datetime as dt
import json
from pathlib import Path

import numpy as np

from . import finance, heatpump, impact, model, weather
from .model import Results

RING_ORDER = ["onsite", "corridor", "town"]
USER_LABELS = {
    "greenhouse": "greenhouse", "aquaculture": "aquaculture (RAS)", "rec_center_pool": "rec center + pool",
    "homes": "homes", "school_campus": "school campus", "woodsedge_apts": "Woodsedge senior apartments",
    "town_hall": "town hall", "library_center": "library + community center",
}


def _r(x: float, nd: int = 1) -> float:
    return round(float(x), nd)


def breakeven_grant(f: finance.RingFinance, cfg: dict) -> float | None:
    """Capex grant share that brings LCOH down to the ring's benchmark; None if no grant suffices."""
    fin = cfg["finance"]
    annuity = f.capex * finance.crf(fin["discount_rates"][fin["gate_rate"]], fin["years"])
    g = 1 - (f.benchmark_usd_mwh * f.heat_MWh - f.opex_fixed - f.energy_cost) / annuity
    if g > 1:
        return None
    return max(g, 0.0)


def corridor_gate_path(cfg: dict) -> list[dict]:
    """LCOH of the corridor ring at each step toward passing its gate (docs: Phase 2 has to earn its way in)."""
    fin = cfg["finance"]
    rate = fin["discount_rates"][fin["gate_rate"]]
    tariff = finance.tariff_usd_mwh(cfg)
    rows = []
    for step in cfg["rings"]["corridor"]["gate_path"]:
        c = model.with_overrides(cfg, step["overrides"])
        f = finance.ring_finance(model.run(c), "corridor")
        annuity = f.capex * finance.crf(rate, fin["years"])
        lcoh = (annuity * (1 - step["grant_frac"]) + f.opex_fixed + f.energy_cost) / f.heat_MWh
        rows.append({"label": step["label"], "grant_frac": step["grant_frac"],
                     "capex_per_home_usd": round(f.capex / c["rings"]["corridor"]["homes"]),
                     "lcoh_usd_mwh": _r(lcoh), "passes": bool(lcoh <= tariff)})
    return rows


def first_in(cfg: dict, path: list[dict]) -> list[dict]:
    """Which households the corridor already beats, step by step: their current fuel vs ring LCOH."""
    inc = cfg["finance"]["incumbent_usd_per_MWh"]
    mix = cfg["rings"]["corridor"]["counterfactual_mix"]
    out = []
    for fuel in sorted(mix, key=lambda k: -inc[k]):
        beat_at = next((p["label"] for p in path if p["lcoh_usd_mwh"] <= inc[fuel]), None)
        out.append({"fuel": fuel, "share_of_homes": mix[fuel], "incumbent_usd_mwh": inc[fuel], "beaten_at_step": beat_at})
    return out


def _week_start(temp: np.ndarray, coldest: bool) -> int:
    daily = temp.reshape(365, 24).mean(axis=1)
    weekly = np.convolve(daily, np.ones(7) / 7, mode="valid")
    return int(np.argmin(weekly) if coldest else 196) * 24


def _week_rows(res: Results, built: list[str], start: int) -> list[dict]:
    rows = []
    for h in range(168):
        t = start + h
        rs = [res.rings[b] for b in built]
        rows.append({
            "h": h,
            "demand_MW": _r(sum(r.customer[t] for r in rs), 2),
            "delivered_MW": _r(sum(r.recovered[t] for r in rs), 2),
            "storage_MWh": _r(sum(r.flows["soc"][t] for r in rs), 2),
            "backup_MW": _r(sum(r.flows["backup"][t] for r in rs), 2),
            "dc_available_MW": _r(res.available[t], 1),
            "outdoor_C": _r(res.temp[t], 1),
        })
    return rows


def _monthly(res: Results, built: list[str]) -> list[dict]:
    out = []
    for m in range(12):
        sel = weather.MONTH_OF_HOUR == m
        rs = [res.rings[b] for b in built]
        out.append({
            "month": m + 1,
            "supply_MWh": round(float(res.available[sel].sum())),
            "demand_MWh": round(float(sum(r.customer[sel].sum() for r in rs))),
            "delivered_MWh": round(float(sum(r.recovered[sel].sum() for r in rs))),
            "backup_MWh": round(float(sum(r.flows["backup"][sel].sum() for r in rs))),
        })
    return out


def _avg_cop(r) -> float | None:
    if np.isinf(r.cop).all():
        return None
    w = r.flows["plant_out"]
    return _r((r.cop * w).sum() / w.sum(), 2) if w.sum() else None


def tornado(cfg: dict) -> list[dict]:
    """LCOH at the gate rate for the configured ring set, low and high for each driver."""
    rate = cfg["finance"]["gate_rate"]
    scope = cfg["tornado"]["rings"]

    def lcoh(c: dict) -> float:
        res = model.run(c)
        return finance.system_lcoh([finance.ring_finance(res, b) for b in scope], c, rate)

    base = lcoh(cfg)
    rows = []
    for driver, spec in cfg["tornado"]["drivers"].items():
        vals = []
        for i in (0, 1):
            ov = {}
            for p in spec["paths"]:
                node = cfg
                for k in p.split("."):
                    node = node[k]
                ov[p] = node * spec["mult"][i] if "mult" in spec else spec["value"][i]
            vals.append(lcoh(model.with_overrides(cfg, ov)))
        rows.append({"driver": driver, "base": _r(base), "low": _r(min(vals)), "high": _r(max(vals)),
                     "scope": scope,
                     "range": spec.get("mult", spec.get("value"))})
    rows.sort(key=lambda r: r["high"] - r["low"], reverse=True)
    return rows


def build(cfg: dict | None = None, with_tornado: bool = True) -> tuple[dict, Results]:
    cfg = cfg or model.load_config()
    res = model.run(cfg)
    fin_cfg = cfg["finance"]
    gate_rate = fin_cfg["gate_rate"]
    sup = cfg["supply"]

    fins = {rid: finance.ring_finance(res, rid) for rid in RING_ORDER}
    built = [rid for rid in RING_ORDER if fins[rid].built]
    bfins = [fins[b] for b in built]
    imp = impact.system_impact(res, built)
    tariff = finance.tariff_usd_mwh(cfg)
    propane = fin_cfg["incumbent_usd_per_MWh"]["propane"]
    oil = fin_cfg["incumbent_usd_per_MWh"]["heating_oil"]
    hh = fin_cfg["household_MWh_yr"]

    rings_out = []
    for rid in RING_ORDER:
        r, f, rc = res.rings[rid], fins[rid], cfg["rings"][rid]
        temp_C = rc.get("supply_temp_C") or rc.get("loop_temp_C") or rc.get("sink_max_C")
        entry = {
            "id": rid, "name": rc["name"], "phase": rc["phase"],
            "users": [USER_LABELS[u] for u in r.users],
            "users_MWh": {USER_LABELS[u]: round(float(v.sum())) for u, v in r.users.items()},
            "annual_MWh": round(float(r.customer.sum())),
            "peak_MW": _r(r.customer.max(), 2),
            "supply_temp_C": temp_C,
            "pipe_km": _r(r.pipe_m / 1000, 2),
            "conditional": rc["conditional"],
            "built": f.built,
            "network_loss_MWh": round(r.loss_MW * 8760),
            "storage_m3": round(r.store_m3),
            "avg_cop": _avg_cop(r),
            "capex_musd": _r(f.capex / 1e6, 2),
            "gate": {
                "lcoh_usd_mwh": _r(f.lcoh[gate_rate]),
                "benchmark_usd_mwh": _r(f.benchmark_usd_mwh),
                "benchmark": f.benchmark_label,
                "passes": f.built,
                "linear_density_MWh_per_m": _r(f.density_MWh_per_m, 2) if rid != "onsite" else None,
                "density_gate_MWh_per_m": rc.get("density_gate_MWh_per_m"),
                "breakeven_capex_grant_frac": (None if (g := breakeven_grant(f, cfg)) is None else _r(g, 2)),
            },
        }
        if rid == "onsite":
            entry["greenhouse_ha"] = rc["users"]["greenhouse"]["area_ha"]
        if rid == "corridor":
            entry["homes"] = rc["homes"]
            entry["gate"]["path"] = corridor_gate_path(cfg)
            entry["gate"]["first_in"] = first_in(cfg, entry["gate"]["path"])
        rings_out.append(entry)

    delivered = sum(float(res.rings[b].recovered.sum()) for b in built)
    dc_draw = sum(float(res.rings[b].dc_draw.sum()) for b in built)
    hp_elec = sum(float(res.rings[b].hp_elec.sum()) for b in built)
    hp_out = sum(float(res.rings[b].flows["plant_out"].sum()) for b in built
                 if not np.isinf(res.rings[b].cop).all())
    avail_MWh = float(res.available.sum())

    hp = cfg["heat_pump"]
    town_sink = cfg["rings"]["town"]["sink_max_C"]
    cop_compare = []
    for label, src in (("Air-cooled (30 °C)", 30.0), ("Liquid-cooled (50 °C)", float(sup["capture_temp_C"]))):
        raw = heatpump.cop_unclipped(src, town_sink, hp["eta_carnot"], hp["approach_K"])
        cop_compare.append({"source": label, "sink_C": town_sink, "cop": _r(min(max(raw, hp["cop_min"]), hp["cop_max"]), 2),
                            "cop_unclipped": _r(raw, 2)})

    lines = []
    for b in built:
        for line in fins[b].lines:
            lines.append({"item": f"{line['item']} ({b})", "musd": _r(line["usd"] / 1e6, 2), "source": line["source"]})
    markup_musd = sum(f.capex for f in bfins) / 1e6 - sum(line["musd"] for line in lines)
    lines.append({"item": "Soft costs + contingency", "musd": _r(markup_musd, 2), "source": "assumption"})

    tor = tornado(cfg) if with_tornado else []
    exit_ = finance.dc_exit(res, bfins, gate_rate)

    onsite = res.rings["onsite"]
    summer_share = float(onsite.customer[weather.MONTH_OF_HOUR == 6].sum() / onsite.customer.sum() * 12)

    out = {
        "meta": {
            "site": cfg["meta"]["site"], "generated": dt.date.today().isoformat(), "scenario": cfg["meta"]["scenario"],
            "weather": res.weather_source, "built_rings": built,
            "notes": "Totals, finance and impact cover built rings only. Gated rings report their gate result.",
        },
        "supply": {
            "it_load_MW": sup["it_load_MW"], "load_factor": sup["load_factor"],
            "capture_fraction": sup["capture_fraction"], "capture_temp_C": sup["capture_temp_C"],
            "heat_available_GWh": _r(avail_MWh / 1000), "heat_available_MW_avg": _r(avail_MWh / 8760),
            "outages": sup["outages"],
        },
        "rings": rings_out,
        "totals": {
            "heat_delivered_MWh": round(delivered),
            "share_of_available_pct": _r(dc_draw / avail_MWh * 100, 2),
            "hp_elec_MWh": round(hp_elec),
            "backup_MWh": round(sum(float(res.rings[b].flows["backup"].sum()) for b in built)),
            "unmet_hours": int(sum((res.rings[b].flows["unmet"] > 1e-9) for b in built).astype(bool).sum()),
            "avg_cop": _r(hp_out / hp_elec, 2) if hp_elec else None,
            "storage_m3": round(sum(res.rings[b].store_m3 for b in built)),
        },
        "monthly": _monthly(res, built),
        "weeks": {
            "winter": _week_rows(res, built, _week_start(res.temp, True)),
            "summer": _week_rows(res, built, _week_start(res.temp, False)),
        },
        "cop_compare": cop_compare,
        "finance": {
            "capex_musd": {"total": _r(sum(f.capex for f in bfins) / 1e6, 2), "lines": lines},
            "opex_musd_yr": _r(sum(f.opex_fixed + f.energy_cost for f in bfins) / 1e6, 2),
            "lcoh_usd_mwh": {k: _r(finance.system_lcoh(bfins, cfg, k)) for k in fin_cfg["discount_rates"]},
            "incumbent_usd_mwh": fin_cfg["incumbent_usd_per_MWh"],
            "tariff_usd_mwh": _r(tariff),
            "tariff_k_of_propane": fin_cfg["tariff_k_of_propane"],
            "low_income_tariff_usd_mwh": _r(fin_cfg["low_income_k_of_propane"] * propane),
            "household": {
                "typical_MWh_yr": hh,
                "savings_vs_propane_usd": round(hh * (propane - tariff)),
                "savings_vs_oil_usd": round(hh * (oil - tariff)),
            },
            "tornado": tor,
            "dc_exit": {k: (_r(v, 2) if isinstance(v, float) else v) for k, v in exit_.items()},
        },
        "impact": {
            **{k: (_r(v) if isinstance(v, float) else v) for k, v in imp.items() if k not in ("water", "by_ring", "erf")},
            "erf": _r(imp["erf"], 4),
            "water": {"note": imp["water"]["note"], "fan_energy_saved_MWh": round(imp["water"]["fan_energy_saved_MWh"])},
        },
        "value_by_stakeholder": _stakeholders(cfg, fins, imp, tariff, propane, hh, exit_),
        "hdr_scorecard": _hdr(imp, onsite, summer_share),
        "context": cfg["context"],
        "explore": _explore(cfg, res, fins),
        "sources": cfg["sources"],
    }
    return out, res


def _explore(cfg: dict, res: Results, fins: dict) -> dict:
    """Per-ring cost building blocks so the app can recompute LCOH client-side (Explore sliders)."""
    fin = cfg["finance"]
    rings = {}
    for rid, f in fins.items():
        r = res.rings[rid]
        rings[rid] = {
            "capex_usd": round(f.capex), "om_frac": fin["om_frac_of_capex"], "heat_MWh": round(f.heat_MWh),
            "hp_elec_MWh": round(float(r.hp_elec.sum())), "pump_elec_MWh": round(float(r.pump_elec.sum())),
            "elec_tariff": "residential" if r.cfg["kind"] == "building_hp" else "commercial",
            "backup_MWh": round(float(r.flows["backup"].sum())),
            "backup_usd_mwh": fin["incumbent_usd_per_MWh"][r.cfg["backup_fuel"]],
            "peak_MW": _r(r.customer.max(), 2), "per_home": rid == "corridor",
        }
    hp = cfg["heat_pump"]
    return {
        "rings": rings, "years": fin["years"],
        "elec_commercial_usd_per_kWh": fin["elec_commercial_usd_per_kWh"],
        "elec_residential_usd_per_kWh": fin["elec_residential_usd_per_kWh"],
        "homes": cfg["rings"]["corridor"]["homes"],
        "heat_pump": {k: hp[k] for k in ("eta_carnot", "approach_K", "cop_min", "cop_max")},
        "onsite_supply_C": cfg["rings"]["onsite"]["supply_temp_C"],
        "air_cooled_capture_C": 30, "central_hp_usd_per_kW": fin["unit_costs"]["central_hp_usd_per_kW"],
        "markup": (1 + fin["soft_cost_frac"]) * (1 + fin["contingency_frac"]),
        "supply": {k: cfg["supply"][k] for k in ("it_load_MW", "capture_fraction")},
        "outage_hours": int(res.outage.sum()),
    }


def _stakeholders(cfg, fins, imp, tariff, propane, hh, exit_) -> list[dict]:
    corr = fins["corridor"]
    g = breakeven_grant(corr, cfg)
    corr_metric = (f"Ambient-loop heat at ${tariff:.0f}/MWh vs ${propane:.0f} propane: ${hh * (propane - tariff):,.0f}/yr "
                   f"per typical home. Corridor LCOH ${corr.lcoh[cfg['finance']['gate_rate']]:.0f}/MWh "
                   + ("passes." if corr.built else
                      f"needs a {g:.0%} capex grant first." if g is not None else "does not pass at any grant level."))
    return [
        {"who": "Residents", "value": "A heat price below propane for a town under a gas moratorium", "metric": corr_metric},
        {"who": "Town of Lansing", "value": "Binding heat covenant and a community-owned utility",
         "metric": f"{imp['jobs']} on-site jobs; {imp['local_food_t_yr']:,} t/yr local food"},
        {"who": "TeraWulf", "value": "Social license with no cooling risk: heat is a sidestream, dry coolers stay at 100%",
         "metric": f"ERF {imp['erf']:.1%}; DC-specific stranded asset ${exit_['stranded_musd']:.1f}M if it exits in year {exit_['year']}"},
        {"who": "Greenhouse / aquaculture operators", "value": "Near-free low-temperature heat year round",
         "metric": f"On-site LCOH ${fins['onsite'].lcoh[cfg['finance']['gate_rate']]:.0f}/MWh vs ${propane:.0f} propane"},
        {"who": "Cayuga Lake", "value": "No lake water for cooling; closed-loop aquaponics captures nutrients",
         "metric": f"{round(imp['co2_avoided_t_yr'], -2):,.0f} t CO2/yr avoided"},
    ]


def _hdr(imp, onsite, summer_share) -> list[dict]:
    return [
        {"lens": "Community", "petal": "Equity", "claim": "Heat tariff pegged below propane, low-income tier",
         "metric": "tariff = 75% of propane; low-income 60%"},
        {"lens": "Community", "petal": "Place", "claim": "Brownfield coal site becomes an agri-food campus",
         "metric": f"{imp['jobs']} jobs, {imp['local_food_t_yr']:,} t/yr food"},
        {"lens": "Ecology", "petal": "Energy", "claim": "Recovered DC heat replaces propane boilers",
         "metric": f"{round(imp['co2_avoided_t_yr'], -2):,.0f} t CO2/yr; ERF {imp['erf']:.1%}"},
        {"lens": "Ecology", "petal": "Water", "claim": "No lake water for cooling; heat reuse cuts dry-cooler fan energy",
         "metric": f"{imp['water']['fan_energy_saved_MWh']:,.0f} MWh/yr fan energy"},
        {"lens": "Health", "petal": "Air", "claim": "Less propane and oil burned locally",
         "metric": f"{imp['fossil_displaced_MWh']:,.0f} MWh/yr fossil heat displaced"},
        {"lens": "Ecology", "petal": "Resilience", "claim": "Year-round sink: July demand vs annual average",
         "metric": f"July = {summer_share:.0%} of average month"},
    ]


def write(out: dict, res: Results, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "site2.json").write_text(json.dumps(out, indent=2) + "\n")
    t = out["totals"]
    peak = sum(float(res.rings[b].customer.max()) for b in out["meta"]["built_rings"])
    summary = {
        "heat_MWh": t["heat_delivered_MWh"], "hp_elec_MWh": t["hp_elec_MWh"], "backup_MWh": t["backup_MWh"],
        "peak_MW": round(peak, 2), "tank_m3": t["storage_m3"], "unmet_hours": t["unmet_hours"],
        "built_rings": out["meta"]["built_rings"],
    }
    (out_dir / "annual_summary.json").write_text(json.dumps(summary, indent=2) + "\n")
    f, i = out["finance"], out["impact"]
    headline = {
        "heat_available_GWh": out["supply"]["heat_available_GWh"],
        "heat_delivered_GWh": round(t["heat_delivered_MWh"] / 1000, 1),
        "share_of_available_pct": t["share_of_available_pct"],
        "lcoh_usd_mwh_coop": f["lcoh_usd_mwh"]["coop_4pct"],
        "tariff_usd_mwh": f["tariff_usd_mwh"],
        "household_savings_vs_propane_usd": f["household"]["savings_vs_propane_usd"],
        "co2_avoided_t_yr": i["co2_avoided_t_yr"],
        "unmet_hours": t["unmet_hours"],
        "capex_musd": f["capex_musd"]["total"],
        "jobs": i["jobs"],
        "rings": {r["id"]: {"built": r["built"], "lcoh_usd_mwh": r["gate"]["lcoh_usd_mwh"],
                            "benchmark_usd_mwh": r["gate"]["benchmark_usd_mwh"]} for r in out["rings"]},
    }
    (out_dir / "headline_numbers.json").write_text(json.dumps(headline, indent=2) + "\n")

    with (out_dir / "hourly_site2.csv").open("w", newline="") as fh:
        w = csv.writer(fh)
        cols = ["need", "direct", "charge", "discharge", "backup", "unmet", "soc"]
        w.writerow(["hour", "outdoor_C", "dc_available_MW"] + [f"{rid}_{c}" for rid in RING_ORDER for c in cols]
                   + [f"{rid}_cop" for rid in RING_ORDER])
        for h in range(8760):
            row = [h, _r(res.temp[h], 2), _r(res.available[h], 2)]
            row += [_r(res.rings[rid].flows[c][h], 4) for rid in RING_ORDER for c in cols]
            row += [("" if np.isinf(c := res.rings[rid].cop[h]) else _r(c, 3)) for rid in RING_ORDER]
            w.writerow(row)

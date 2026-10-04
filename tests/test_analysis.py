"""Tests for heatreuse.analysis: determinism, percentile order, headline reproduction, monthly closure."""
import json

import pytest

from heatreuse import analysis, config as C, model
from heatreuse.run import OUT


@pytest.fixture(scope="module")
def base():
    cfg = C.load("site2")
    return cfg, model.full(cfg)


@pytest.fixture(scope="module")
def site2():
    return json.loads((OUT / "site2.json").read_text(encoding="utf-8"))


@pytest.fixture(scope="module")
def mc(base):
    cfg, b = base
    return analysis.monte_carlo(cfg, b["sim"]["T"], n=60, seed=analysis.SEED)


def test_monte_carlo_deterministic_with_seed(base, mc):
    cfg, b = base
    again = analysis.monte_carlo(cfg, b["sim"]["T"], n=60, seed=analysis.SEED)
    assert again == mc
    other = analysis.monte_carlo(cfg, b["sim"]["T"], n=60, seed=analysis.SEED + 1)
    assert other["stats"] != mc["stats"]


def test_samples_within_declared_ranges(base):
    cfg, _ = base
    specs = {s["key"]: s for s in analysis.input_specs(cfg)}
    for x in analysis.sample_inputs(cfg, 200):
        for k, v in x.items():
            assert specs[k]["low"] <= v <= specs[k]["high"], (k, v)


def test_percentile_order(mc):
    for k, s in mc["stats"].items():
        assert s["min"] <= s["P10"] <= s["P50"] <= s["P90"] <= s["max"], k
    assert 0.0 <= mc["prob_blended_lcoh_below_propane_7pct"] <= 1.0


def test_base_case_reproduces_site2_headline(base, site2):
    _, b = base
    hc = analysis.headline_check(b, site2)
    tol = {"lcoh_blended_7pct": 0.1, "lcoh_corridor_7pct": 0.1, "funding_gap_7pct_musd": 0.01,
           "co2_avoided_t_yr": 1.0, "delivered_MWh": 1.0, "propane_usd_mwh": 0.1}
    for k, t in tol.items():
        assert hc[k]["model"] == pytest.approx(hc[k]["site2_json"], abs=t), k


def test_mode_draw_equals_headline(base):
    """A draw at every mode (discount rate 7%) must reproduce the base model exactly."""
    cfg, b = base
    x = {s["key"]: s.get("mode", 0.07) for s in analysis.input_specs(cfg)}
    x["discount_rate"] = 0.07
    r = analysis._evaluate_draw(cfg, x, b["sim"]["T"])
    assert r["lcoh_blended_7pct"] == pytest.approx(b["fin"]["lcoh"]["utility_7pct"], rel=1e-9)
    assert r["lcoh_blended_sampled_rate"] == pytest.approx(b["fin"]["lcoh"]["utility_7pct"], rel=1e-9)
    assert r["funding_gap_7pct_musd"] == pytest.approx(b["fin"]["funding_gap_musd"], rel=1e-9)
    assert r["co2_avoided_t_yr"] == pytest.approx(b["imp"]["co2_avoided_t_yr"], rel=1e-9)


def test_monthly_sums_equal_annual(base, site2):
    _, b = base
    m = analysis.monthly_detail(b)
    for k in ("demand_MWh", "delivered_MWh", "backup_MWh", "hp_elec_MWh"):
        assert sum(r[k] for r in m["months"]) == pytest.approx(m["annual"][k], abs=1.0), k
        assert sum(r[k] for r in m["seasons"].values()) == pytest.approx(m["annual"][k], abs=1.0), k
    t = site2["totals"]
    assert m["annual"]["demand_MWh"] == pytest.approx(t["heat_delivered_MWh"], abs=1.0)
    assert m["annual"]["backup_MWh"] == pytest.approx(t["backup_MWh"], abs=1.0)
    assert m["annual"]["hp_elec_MWh"] == pytest.approx(t["hp_elec_MWh"], abs=1.0)
    assert m["annual"]["avg_cop"] == pytest.approx(t["avg_cop"], abs=0.01)
    assert m["annual"]["delivered_MWh"] + m["annual"]["backup_MWh"] == pytest.approx(m["annual"]["demand_MWh"], abs=1.0)
    assert sum(m["storage_soc"]["histogram_hours"].values()) == 8760


def test_ring_breakdown_closes(base, site2):
    cfg, b = base
    rb = analysis.ring_breakdown(cfg, b)
    rings = rb["rings"]
    assert sum(r["capex_share_pct"] for r in rings.values()) == pytest.approx(100, abs=0.2)
    assert sum(r["co2_share_pct"] for r in rings.values()) == pytest.approx(100, abs=0.2)
    assert rb["co2_sum_t_yr"] == pytest.approx(site2["impact"]["co2_avoided_t_yr"], abs=1.0)
    assert sum(r["capex_musd"] for r in rings.values()) == pytest.approx(site2["finance"]["capex_musd"]["total"], abs=0.05)
    for k, v in site2["extras"]["ring_lcoh_usd_mwh"].items():
        assert rings[k]["lcoh_7pct_usd_mwh"] == pytest.approx(v, abs=0.1)


def test_load_duration(base):
    _, b = base
    ld = analysis.load_duration(b)
    assert ld["hours_above_80pct_peak"] <= ld["hours_above_50pct_peak"] <= 8760
    assert ld["duration_curve_MW"]["h1"] == ld["peak_MW"]
    assert b["sim"]["disp"]["D"][ld["peak_hour_index"]] == pytest.approx(ld["peak_MW"], abs=0.01)

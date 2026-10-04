import json
import numpy as np
import pytest
from heatreuse import config as C, model, dispatch as dm, heatpump as hp, finance, weather
from heatreuse.run import OUT


@pytest.fixture(scope="module")
def base():
    return model.full(C.load("site2"))


def test_8760_rows(base):
    s = base["sim"]
    assert len(s["T"]) == 8760 and len(s["A"]) == 8760 and len(s["disp"]["D"]) == 8760 and len(s["disp"]["soc"]) == 8760


def test_energy_balance_closes(base):
    assert abs(dm.balance_residual(base["sim"]["disp"])) < 1e-3  # 0.1%


def test_energy_balance_closes_with_town():
    r = model.full(C.load("site2"), include_town=True)
    assert abs(dm.balance_residual(r["sim"]["disp"])) < 1e-3


def test_hourly_balance(base):
    d = base["sim"]["disp"]
    lhs = d["direct"] + d["disch"] + d["e_served"] + d["backup_gate"]
    assert np.allclose(lhs, d["D"] + d["L"], rtol=1e-6, atol=1e-9)


def test_soc_nonnegative_and_bounded(base):
    d = base["sim"]["disp"]
    assert d["soc"].min() >= -1e-9 and d["soc"].max() <= d["cap_mwh"] + 1e-6


def test_unmet_is_zero_by_construction_only_when_backup_full(base):
    # unmet=0 is a design identity (backup 100% of peak), so test it can fail: shrink backup and it must go positive
    assert (base["sim"]["disp"]["unmet"] > 1e-6).sum() == 0
    small = model.full(C.override(C.load("site2"), "eng", "backup.capacity_share", 0.2))
    assert (small["sim"]["disp"]["unmet"] > 1e-6).sum() > 0


def test_peak_share_served_by_dc_route(base):
    from heatreuse import report
    t = report._totals(base)
    assert t["peak_share_dc_pct"] >= 90.0       # DC/heat-pump route carries the coldest-hour peak
    assert t["peak_share_backup_pct"] <= 10.0
    assert t["backup_share_annual_pct"] < 10.0
    bad = model.full(C.override(C.load("site2"), "eng", "supply.capture_fraction", 0.05))
    assert report._totals(bad)["peak_share_backup_pct"] > t["peak_share_backup_pct"] + 5


def test_tornado_uptake_scales_customers():
    cfg = C.load("site2")
    c0 = cfg["eng"]["corridor"]
    pot = c0["homes"] / c0["uptake"]
    T, _ = weather.load_temps(cfg)
    u = [t for t in model.tornado(cfg, T) if t["driver"].startswith("Uptake")][0]
    assert u["low_input"] != u["high_input"] and u["low"] != u["high"]
    assert pot == pytest.approx(500 / 0.70)


def test_cop_bounds():
    c = hp.cop(np.linspace(30, 90, 50), 20, 0.5, 3, 2, 6)
    assert c.min() >= 2 and c.max() <= 6
    r = base_cop = model.full(C.load("site2"), include_town=True)["sim"]["rings"]
    assert 2 <= (r["town"]["D"] + r["town"]["L"]).sum() / r["town"]["E"].sum() <= 6 + 1e-9


def test_cop_formula_hand_check():
    # sink 60 C, source 50 C: 0.5*333.15/(10+6)=10.4 -> clipped to 6
    assert hp.cop(60, 50, 0.5, 3, 2, 6) == 6
    # sink 45 C, source 18 C: 0.5*318.15/(27+6)=4.82
    assert hp.cop(45, 18, 0.5, 3, 2, 6) == pytest.approx(0.5 * 318.15 / 33, rel=1e-6)


def test_lcoh_hand_check():
    # crf(7%,30)=0.080586; capex 10M, opex fixed 0.2M, var 0.3M, 50 GWh -> (0.80586+0.5)/50000 MWh
    assert finance.crf(0.07, 30) == pytest.approx(0.0805864, rel=1e-5)
    lcoh = (10e6 * finance.crf(0.07, 30) + 0.2e6 + 0.3e6) / 50000
    assert lcoh == pytest.approx(26.117, abs=0.01)


def test_lcoh_matches_components(base):
    f = base["fin"]
    life = C.load("site2")["fin"]["life_years"]
    ann = sum(usd * finance.crf(0.07, life[c]) for v in f["ring"].values() for c, usd in v["cls"].items())
    tot = (ann + sum(v["fixed"] + v["var"] for v in f["ring"].values())) / f["D"]
    assert tot == pytest.approx(f["lcoh"]["utility_7pct"])
    assert f["lcoh"]["coop_4pct"] < f["lcoh"]["utility_7pct"] < f["lcoh"]["private_10pct"]


def test_weather_is_real_and_plausible(base):
    T = base["sim"]["T"]
    assert -30 < T.min() < -10 and 28 < T.max() < 40
    assert 6000 < weather.hdd_f(T) < 7500


def _keys(d, keys):
    for k in keys:
        assert k in d, k


def test_json_contract_site2():
    j = json.loads((OUT / "site2.json").read_text())
    _keys(j, ["meta", "supply", "rings", "totals", "monthly", "weeks", "cop_compare", "finance", "impact", "value_by_stakeholder", "hdr_scorecard", "sources"])
    _keys(j["supply"], ["it_load_MW", "load_factor", "capture_fraction", "capture_temp_C", "heat_available_GWh", "heat_available_MW_avg"])
    assert [r["id"] for r in j["rings"]] == ["onsite", "corridor", "town"]
    for r in j["rings"]:
        _keys(r, ["id", "name", "phase", "annual_MWh", "peak_MW", "supply_temp_C", "pipe_km"])
    _keys(j["totals"], ["heat_delivered_MWh", "share_of_available_pct", "hp_elec_MWh", "backup_MWh", "unmet_hours", "avg_cop", "storage_m3"])
    assert len(j["monthly"]) == 12
    assert len(j["weeks"]["winter"]) == 168 and len(j["weeks"]["summer"]) == 168
    _keys(j["weeks"]["winter"][0], ["h", "demand_MW", "delivered_MW", "storage_MWh", "backup_MW", "outdoor_C"])
    _keys(j["finance"], ["capex_musd", "opex_musd_yr", "lcoh_usd_mwh", "incumbent_usd_mwh", "tariff_usd_mwh", "low_income_tariff_usd_mwh", "household", "tornado", "dc_exit"])
    _keys(j["finance"]["lcoh_usd_mwh"], ["coop_4pct", "utility_7pct", "private_10pct"])
    _keys(j["finance"]["incumbent_usd_mwh"], ["propane", "heating_oil", "natural_gas", "electric_resistance", "air_source_hp"])
    _keys(j["finance"]["household"], ["typical_MWh_yr", "savings_vs_propane_usd", "savings_vs_oil_usd"])
    _keys(j["finance"]["dc_exit"], ["year", "stranded_musd", "fallback"])
    _keys(j["impact"], ["co2_avoided_t_yr", "co2_cars_equiv", "homes_served", "fossil_displaced_MWh", "erf", "water", "jobs", "local_food_t_yr"])
    _keys(j["impact"]["water"], ["note", "fan_energy_saved_MWh"])
    assert j["totals"]["unmet_hours"] == 0
    assert abs(sum(x["musd"] for x in j["finance"]["capex_musd"]["lines"]) - j["finance"]["capex_musd"]["total"]) < 0.1


def test_json_contract_offtakers():
    o = json.loads((OUT / "offtakers.json").read_text())
    assert len(o) >= 10
    for row in o:
        _keys(row, ["id", "name", "type", "lat", "lon", "dist_km", "annual_MWh", "peak_MW", "supply_temp_C", "fuel", "score", "ring"])
        assert row["ring"] in ("onsite", "corridor", "town", "none") and row["annual_MWh"] > 0 and row["dist_km"] >= 0


def test_json_contract_site1():
    s1 = json.loads((OUT / "site1.json").read_text())
    _keys(s1, ["meta", "supply", "totals", "finance", "impact", "why_not_chosen", "sources"])
    _keys(s1["supply"], ["it_load_MW", "load_factor", "capture_fraction", "capture_temp_C", "heat_available_GWh", "heat_available_MW_avg"])
    _keys(s1["totals"], ["heat_delivered_MWh", "share_of_available_pct", "hp_elec_MWh", "backup_MWh", "unmet_hours", "avg_cop", "storage_m3"])
    _keys(s1["finance"]["lcoh_usd_mwh"], ["coop_4pct", "utility_7pct", "private_10pct"])
    _keys(s1["impact"], ["co2_avoided_t_yr", "co2_cars_equiv", "homes_served", "fossil_displaced_MWh", "erf"])
    assert isinstance(s1["why_not_chosen"], str) and len(s1["why_not_chosen"]) > 50


def test_site2_v2_additions():
    j = json.loads((OUT / "site2.json").read_text())
    _keys(j["extras"]["cba"], ["corridor_gap_musd", "per_year_musd", "as_pct_of_dc_capex"])
    _keys(j["extras"]["electricity_rates_usd_kwh"], ["central_hp_and_pumping_industrial", "corridor_building_hps_residential"])
    _keys(j["impact"], ["homes_served", "greenhouse_ha", "local_food_t_yr", "jobs", "headline"])
    assert len(j["sources"]) >= 10 and all({"id", "label", "url"} <= set(x) for x in j["sources"])

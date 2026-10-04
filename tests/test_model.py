import numpy as np
import pytest

from heatreuse import dispatch, finance, heatpump, model, report, weather


@pytest.fixture(scope="module")
def cfg():
    return model.load_config()


@pytest.fixture(scope="module")
def res(cfg):
    return model.run(cfg)


@pytest.fixture(scope="module")
def site2(cfg):
    out, _ = report.build(cfg, with_tornado=False)
    return out


def test_weather_matches_normals_and_design(cfg, res):
    w = cfg["weather"]
    assert res.temp.size == 8760
    assert res.temp.min() == pytest.approx(w["design_C"], abs=0.05)
    for m, normal in enumerate(w["monthly_mean_C"]):
        tol = 1.0 if m == 0 else 0.01  # the January cold snap pulls that month down
        assert res.temp[weather.MONTH_OF_HOUR == m].mean() == pytest.approx(normal, abs=tol)
    assert 3500 < weather.heating_degree_days(res.temp) < 4300  # Ithaca ~3,900 HDD18


@pytest.mark.parametrize("rid", ["onsite", "corridor", "town"])
def test_energy_balance_every_hour(res, rid):
    f = res.rings[rid].flows
    lhs = f["need"]
    rhs = f["direct"] + f["discharge"] + f["backup"] + f["unmet"]
    assert np.allclose(lhs, rhs, rtol=1e-3, atol=1e-9)


@pytest.mark.parametrize("rid", ["onsite", "corridor", "town"])
def test_storage_bounds_and_no_unmet(res, rid):
    r = res.rings[rid]
    assert (r.flows["soc"] >= -1e-9).all()
    assert (r.flows["soc"] <= r.store_MWh + 1e-9).all()
    assert r.flows["unmet"].sum() == pytest.approx(0, abs=1e-6)


def test_dc_heat_never_exceeds_available(res):
    drawn = sum(r.dc_draw for r in res.rings.values())
    assert (drawn <= res.available + 1e-9).all()
    assert (drawn[res.outage] == 0).all()


def test_backup_carries_outages(res):
    onsite = res.rings["onsite"]
    assert onsite.flows["backup"][res.outage].sum() > 0
    assert onsite.flows["backup"][~res.outage].sum() == pytest.approx(0, abs=1e-6)


def test_cop_bounds(cfg, res):
    hp = cfg["heat_pump"]
    for r in res.rings.values():
        c = r.cop[~np.isinf(r.cop)]
        assert ((c >= hp["cop_min"]) & (c <= hp["cop_max"])).all()


def test_cop_formula_hand_check():
    # 0.5 * 338.15 / (65 - 30 + 6) = 4.124
    assert heatpump.cop(30, 65, 0.5, 3, 2, 10) == pytest.approx(4.124, abs=1e-3)
    assert heatpump.cop(50, 65, 0.5, 3, 2, 6) == 6  # clipped


def test_dispatch_small_case():
    need = np.array([1.0, 3.0, 3.0, 0.0])
    cap = np.array([2.0, 2.0, 0.0, 2.0])
    f = dispatch.dispatch(need, cap, store_MWh=1.0, store_rate_MW=5.0, backup_MW=2.0, loss_frac_per_h=0.0)
    assert f["discharge"].tolist() == [0.0, 1.0, 0.0, 0.0]
    assert f["backup"].tolist() == [0.0, 0.0, 2.0, 0.0]
    assert f["unmet"].tolist() == [0.0, 0.0, 1.0, 0.0]
    assert f["charge"].tolist() == [0.0, 0.0, 0.0, 1.0]


def test_lcoh_hand_check(cfg, res):
    fin = cfg["finance"]
    f = finance.ring_finance(res, "onsite")
    r = fin["discount_rates"]["coop_4pct"]
    expected = (f.capex * r * 1.04**30 / (1.04**30 - 1) + f.opex_fixed + f.energy_cost) / f.heat_MWh
    assert f.lcoh["coop_4pct"] == pytest.approx(expected)
    assert finance.crf(0.04, 30) == pytest.approx(0.05783, abs=1e-5)


def test_site2_contract_shape(site2):
    for key in ["meta", "supply", "rings", "totals", "monthly", "weeks", "cop_compare", "finance",
                "impact", "value_by_stakeholder", "hdr_scorecard", "sources"]:
        assert key in site2
    assert [r["id"] for r in site2["rings"]] == ["onsite", "corridor", "town"]
    assert len(site2["monthly"]) == 12
    assert len(site2["weeks"]["winter"]) == 168 and len(site2["weeks"]["summer"]) == 168
    assert site2["totals"]["unmet_hours"] == 0
    assert set(site2["finance"]["lcoh_usd_mwh"]) == {"coop_4pct", "utility_7pct", "private_10pct"}


def test_onsite_ring_always_built(site2):
    assert "onsite" in site2["meta"]["built_rings"]
    assert site2["meta"]["built_rings"] == [r["id"] for r in site2["rings"] if r["built"]]


def test_supply_far_exceeds_demand(site2):
    assert site2["totals"]["share_of_available_pct"] < 25

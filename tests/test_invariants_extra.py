import json
import pytest
from heatreuse.run import OUT

WEB = OUT.parent / "web" / "public" / "data"


@pytest.fixture(scope="module")
def j():
    return json.loads((OUT / "site2.json").read_text())


def test_lcoh_monotonic_in_discount_rate(j):
    l = j["finance"]["lcoh_usd_mwh"]
    assert l["coop_4pct"] < l["utility_7pct"] < l["private_10pct"]
    w = j["extras"]["with_town"]["lcoh_usd_mwh"]
    assert w["coop_4pct"] < w["utility_7pct"] < w["private_10pct"]


def test_ring_lcoh_order(j):
    r = {x["id"]: x["lcoh_usd_mwh_7pct"] for x in j["rings"]}
    assert r["onsite"] < r["corridor"] < r["town"]
    e = j["extras"]["ring_lcoh_usd_mwh"]
    assert e["onsite"] == pytest.approx(r["onsite"], abs=0.1)
    assert e["corridor"] == pytest.approx(r["corridor"], abs=0.1)
    assert j["extras"]["with_town"]["town_ring_lcoh_usd_mwh"] == pytest.approx(r["town"], abs=0.1)


def test_co2_avoided_positive_and_matches_rings(j):
    total = j["impact"]["co2_avoided_t_yr"]
    assert total > 0
    per_ring = [v for x in j["rings"] if x.get("phase") in (1, 2) for k, v in x.items() if k.startswith("co2")]
    if per_ring:
        assert sum(per_ring) == pytest.approx(total, rel=0.01)


def test_heat_delivered_not_above_available(j):
    avail_mwh = j["supply"]["heat_available_GWh"] * 1000
    assert 0 < j["totals"]["heat_delivered_MWh"] <= avail_mwh
    assert j["extras"]["with_town"]["totals"]["heat_delivered_MWh"] <= avail_mwh
    for name, s in j["extras"]["scenarios"].items():
        if "delivered_GWh" in s and "heat_available_GWh" in s:
            assert s["delivered_GWh"] <= s["heat_available_GWh"], name


def test_tariff_is_080_propane(j):
    f = j["finance"]
    assert f["tariff_usd_mwh"] == pytest.approx(0.8 * f["incumbent_usd_mwh"]["propane"], abs=0.5)
    s = j["extras"]["scenarios"]["propane_2.85_low_sensitivity"]
    assert s["tariff_usd_mwh"] == pytest.approx(0.8 * s["propane_usd_mwh"], abs=0.5)


@pytest.mark.parametrize("name", ["site2.json", "site1.json", "offtakers.json"])
def test_web_data_byte_identical_to_outputs(name):
    assert (OUT / name).read_bytes() == (WEB / name).read_bytes(), name

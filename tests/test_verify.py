import json

import pytest

from heatreuse import verify

BASE = json.loads((verify.OUT / "site2.json").read_text(encoding="utf-8"))


def _run(tmp_path, mutate=None, text=None):
    s2 = json.loads(json.dumps(BASE))
    if mutate:
        mutate(s2)
    blob = json.dumps(s2)
    if text:
        blob = text(blob)
    f = tmp_path / "site2.json"
    f.write_text(blob, encoding="utf-8")
    return verify.run(site_json=f, write=False)[0]


def _status(checks, fragment):
    return [c[0] for c in checks if fragment in c[1]]


def test_verify_clean_on_committed_data():
    checks, rows = verify.run(write=False)
    bad = [c for c in checks if c[0] != "PASS"]
    assert not bad, bad
    assert len(rows) > 200


def test_register_rows_complete():
    _, rows = verify.run(write=False)
    for r in rows:
        assert set(r) == {"input", "value", "unit", "source", "confidence"}
        assert r["confidence"] in {"sourced", "assumption", "unverified"}
        assert r["source"]


def test_register_covers_list_leaves():
    _, rows = verify.run(write=False)
    names = {r["input"] for r in rows}
    assert "finance.tornado.pipe_cost[0]" in names
    assert "finance.tariff_scenarios_discount[2]" in names
    assert any(n.startswith("offtakers.rows[") and n.endswith(".lat") for n in names)
    assert any(n.startswith("engineering.town.others[") and n.endswith(".mwh") for n in names)
    assert {r["unit"] for r in rows if r["input"].endswith(".lat")} == {"deg"}
    assert any(r["confidence"] == "unverified" for r in rows)


def test_ring_and_monthly_balance_fail_when_heat_inflated(tmp_path):
    def m(s2):
        s2["totals"]["heat_delivered_MWh"] *= 1.2
    checks = _run(tmp_path, m)
    assert "FAIL" in _status(checks, "built rings' annual MWh")
    assert "FAIL" in _status(checks, "monthly delivered + backup")


def test_heat_pump_electricity_drift_fails(tmp_path):
    def m(s2):
        s2["totals"]["hp_elec_MWh"] *= 1.05
    assert "FAIL" in _status(_run(tmp_path, m), "heat-pump electricity")


def test_stale_moratorium_year_fails(tmp_path):
    checks = _run(tmp_path, text=lambda b: b.replace("moratorium Feb 2015", "moratorium Feb 2014"))
    assert "FAIL" in _status(checks, "Gas moratorium")


def test_missing_moratorium_date_fails_not_warns(tmp_path):
    checks = _run(tmp_path, text=lambda b: b.replace("moratorium Feb 2015", "gas pause"))
    assert _status(checks, "Gas moratorium") == ["FAIL"]


def test_incentive_scenario_fails_base_case_check(tmp_path):
    def m(s2):
        s2["meta"]["scenario"] = "incentive"
    assert "FAIL" in _status(_run(tmp_path, m), "No federal ITC")


def test_itc_check_is_word_match(tmp_path):
    def m(s2):
        s2["finance"]["capex_musd"]["lines"][0]["item"] = "Switchgear"
    assert _status(_run(tmp_path, m), "No federal ITC") == ["PASS"]

    def m2(s2):
        s2["finance"]["capex_musd"]["lines"][0]["item"] = "ITC credit"
    assert _status(_run(tmp_path, m2), "No federal ITC") == ["FAIL"]


def test_missing_greenhouse_key_raises(tmp_path):
    def m(s2):
        del s2["impact"]["greenhouse_ha"]
    with pytest.raises(KeyError):
        _run(tmp_path, m)

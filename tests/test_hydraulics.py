"""Tests for heatreuse.hydraulics: hand-calc flow, velocity limits, VS < CS, small share of heat, determinism."""
import json

import pytest

from heatreuse import hydraulics as H
from heatreuse.run import OUT


@pytest.fixture(scope="module")
def h():
    return H.build()


def test_hand_calc_flow_onsite(h):
    site2 = json.loads((OUT / "site2.json").read_text(encoding="utf-8"))
    peak = next(r for r in site2["rings"] if r["id"] == "onsite")["peak_MW"]
    # 45/25 C -> mean 35 C: rho ~993.95, cp ~4178.5 (table interpolation 30-40 C)
    q = peak * 1e6 / (993.95 * 4178.5 * 20.0)
    assert h["rings"]["onsite"]["design_flow_m3_s"] == pytest.approx(q, rel=1e-3)
    assert h["rings"]["onsite"]["design_flow_m3_h"] == pytest.approx(q * 3600, rel=1e-3)


def test_swamee_jain_reference():
    # Re 1e5, eps/D 1e-4: Moody / Colebrook ~0.0185
    assert H.swamee_jain(1e5, 0.1, 1e-5) == pytest.approx(0.0185, abs=0.0005)


def test_velocity_within_limit(h):
    for r in h["rings"].values():
        for s in r["segments"]:
            vmax = H.V_MAX_SMALL if s["DN"] <= H.SMALL_DN else H.V_MAX_LARGE
            assert 0 < s["velocity_m_s"] <= vmax
            assert s["R_pa_m"] <= H.R_MAX_PA_M


def test_variable_speed_below_constant_speed(h):
    for r in h["rings"].values():
        a = r["annual"]
        assert a["variable_speed_affinity_MWh"] <= a["variable_speed_end_pressure_MWh"] < a["constant_speed_MWh"]


def test_pumping_small_share_of_heat(h):
    for r in h["rings"].values():
        assert r["pumping_pct_of_heat_variable_speed"] < 5.0
    assert h["phases_1_2"]["implied_pump_share"] < 0.03


def test_sweep_monotonic_and_base_matches(h):
    rows = h["pump_share_sweep"]["rows"]
    lc = [r["lcoh_blended_7pct"] for r in rows]
    assert lc == sorted(lc)
    base = next(r for r in rows if r["pump_share"] == 0.015)
    assert base["delta_vs_base_usd_mwh"] == pytest.approx(0, abs=1e-9)


def test_deterministic(h):
    assert H.build() == h
    assert H.render_md(h) == H.render_md(H.build())

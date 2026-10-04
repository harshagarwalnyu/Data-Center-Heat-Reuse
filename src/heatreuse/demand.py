"""Hourly demand for the three rings. Returns per-ring dicts with D (customer MW), L (pipe loss MW), E (HP elec MW), S (DC-side draw MW)."""
from __future__ import annotations
import numpy as np
from . import heatpump as hp
from .weather import months


def hd(t: np.ndarray, tb: float) -> np.ndarray:
    """Hourly heating degrees below base temperature tb (K, floored at 0)."""
    return np.maximum(0.0, tb - np.asarray(t))


def norm(raw: np.ndarray, annual_mwh: float) -> np.ndarray:
    """Scale an hourly shape so it sums to ``annual_mwh`` (zeros if the shape is empty)."""
    s = raw.sum()
    return raw / s * annual_mwh if s > 0 else np.zeros_like(raw)


def _calendar(n=8760):
    h = np.arange(n)
    return h % 24, (h // 24) % 7, months()


def onsite(cfg: dict, T: np.ndarray) -> dict:
    """On-site ring: greenhouse, aquaculture and rec/pool demand served by direct exchange."""
    e = cfg["eng"]["onsite"]
    n = len(T)
    comp = {}
    g = e["greenhouse"]
    area_m2 = g["area_ha"] * 1e4
    comp["greenhouse"] = g["u_eff_w_m2k"] * area_m2 * hd(T, g["setpoint_c"]) / 1e6
    a = e["aquaculture"]
    aq_annual = a["fish_t_yr"] * 1000 * a["kwh_per_kg"] / 1000.0  # MWh
    comp["aquaculture"] = (np.full(n, aq_annual * a["const_share"] / n)
                           + norm(hd(T, a["t_base_c"]), aq_annual * (1 - a["const_share"])))
    r = e["rec"]
    b_annual = r["building_m2"] * r["kwh_m2"] / 1000.0
    comp["rec_pool"] = (np.full(n, r["pool_mwh"] / n) + np.full(n, b_annual * r["dhw_share"] / n)
                        + norm(hd(T, r["t_base_c"]), b_annual * (1 - r["dhw_share"])))
    D = sum(comp.values())
    L = np.full(n, e["pipe_km"] * 1000 * e["loss_w_per_m"] / 1e6)
    pipe_km = e["pipe_km"]
    return dict(id="onsite", D=D, L=L, E=np.zeros(n), S=D + L, comp=comp, pipe_km=pipe_km,
                cop=np.full(n, np.inf), supply_temp_c=e["supply_temp_c"], units=None)


def corridor(cfg: dict, T: np.ndarray) -> dict:
    """Corridor ring: ambient loop with building heat pumps (space heat + DHW)."""
    c = cfg["eng"]["corridor"]
    h = cfg["eng"]["hp"]
    n = len(T)
    homes = c["homes"]
    d_dhw_year = homes * c["dhw_mwh_per_home"]
    d_space_year = homes * (c["mwh_per_home"] - c["dhw_mwh_per_home"])
    hod = np.arange(n) % 24
    shape = 1 + 0.5 * np.sin(2 * np.pi * (hod - 3) / 24.0)  # morning/evening-ish DHW swing
    Dd = norm(shape, d_dhw_year)
    Ds = norm(hd(T, c["t_balance_c"]), d_space_year)
    sink_s = hp.weather_comp(T, c["space_sink"])
    cop_s = hp.cop(sink_s, c["loop_temp_c"], h["eta"], h["approach_k"], h["cop_min"], h["cop_max"])
    cop_d = hp.cop(c["dhw_temp_c"], c["loop_temp_c"], h["eta"], h["approach_k"], h["cop_min"], h["cop_max"])
    E = Ds / cop_s + Dd / cop_d
    D = Ds + Dd
    potential = homes / c["uptake"]
    pipe_km = c["trunk_km"] + potential * c["frontage_m_per_home"] / 1000.0
    L = np.full(n, pipe_km * 1000 * c["loop_loss_w_per_m"] / 1e6)
    S = D - E + L
    cop_eff = np.where(E > 0, D / np.maximum(E, 1e-9), np.nan)
    return dict(id="corridor", D=D, L=L, E=E, S=S, comp={"space": Ds, "dhw": Dd}, pipe_km=pipe_km,
                cop=cop_eff, supply_temp_c=c["supply_temp_c"], units=homes, potential=potential)


def town(cfg: dict, T: np.ndarray) -> dict:
    """Town ring: transmission main and central heat pump (or direct HX when hot enough)."""
    t = cfg["eng"]["town"]
    h = cfg["eng"]["hp"]
    n = len(T)
    hod, dow, mon = _calendar(n)
    s = t["schools"]
    school_year = s["floor_m2"] * s["kwh_m2"] / 1000.0
    other_year = sum(o["mwh"] for o in t["others"])
    total = school_year + other_year
    dhw = total * t["dhw_share"]
    occ = np.where((dow < 5) & (hod >= 6) & (hod < 17), 1.0, 0.45)
    summer = np.where((mon == 7) | (mon == 8), 0.1, 1.0)
    space_raw = hd(T, 15.5) * occ * summer
    D = norm(space_raw, total - dhw) + np.full(n, dhw / n)
    pipe_km = t["trunk_km"] + t["spur_km"]
    L = np.full(n, pipe_km * 1000 * t["loss_w_per_m"] / 1e6)
    G = D + L
    sink = hp.weather_comp(T, t["sink"])
    cop = hp.cop(sink, cfg["eng"]["supply"]["capture_temp_c"], h["eta"], h["approach_k"], h["cop_min"], h["cop_max"])
    # direct heat exchange when the captured stream is hot enough to feed the sink without lift
    direct = (cfg["eng"]["supply"]["capture_temp_c"] - 2 * h["approach_k"]) >= sink
    E = np.where(direct, 0.0, G / cop)
    S = G - E
    return dict(id="town", direct_hx_share=float(np.mean(direct)), D=D, L=L, E=E, S=S, comp={"schools": D * 0 + 0}, pipe_km=pipe_km, cop=cop,
                supply_temp_c=t["supply_temp_c"], units=None, annual_design=total)


def build(cfg: dict, T: np.ndarray) -> dict:
    """Build all three rings for the weather year T."""
    return {"onsite": onsite(cfg, T), "corridor": corridor(cfg, T), "town": town(cfg, T)}

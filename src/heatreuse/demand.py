"""Hourly heat demand (MW) for each user type."""

from __future__ import annotations

import numpy as np

from .weather import HOURS, rolling_mean

# Domestic hot water shape: morning and evening peaks, normalised to mean 1.
_DHW_DAY = np.array([0.3, 0.2, 0.2, 0.2, 0.3, 0.8, 1.8, 2.0, 1.5, 1.0, 0.8, 0.8,
                     0.9, 0.8, 0.7, 0.8, 1.0, 1.4, 1.8, 1.7, 1.4, 1.1, 0.8, 0.5])
DHW_SHAPE = np.tile(_DHW_DAY / _DHW_DAY.mean(), 365)


def greenhouse(temp: np.ndarray, ghi: np.ndarray, design_C: float, cfg: dict) -> np.ndarray:
    area_m2 = cfg["area_ha"] * 1e4
    day = (np.arange(HOURS) % 24 >= 6) & (np.arange(HOURS) % 24 < 18)
    t_set = np.where(day, cfg["set_day_C"], cfg["set_night_C"])
    u = cfg["peak_W_per_m2"] / (cfg["set_night_C"] - design_C)
    q = u * (t_set - temp) - cfg["solar_gain_frac"] * ghi
    q = np.maximum(q, cfg["base_W_per_m2"])
    return q * area_m2 / 1e6


def base_plus_degree(temp: np.ndarray, cfg: dict) -> np.ndarray:
    return cfg["base_MW"] + cfg["per_K_MW"] * np.clip(cfg["balance_C"] - temp, 0, None)


def degree_shape(temp: np.ndarray, balance_C: float, lag_h: int) -> np.ndarray:
    """Space-heating shape normalised to sum 1 over the year."""
    dh = np.clip(balance_C - rolling_mean(temp, lag_h), 0, None)
    return dh / dh.sum()


def homes(temp: np.ndarray, cfg: dict) -> np.ndarray:
    space = (cfg["home_annual_MWh"] - cfg["home_dhw_MWh"]) * degree_shape(temp, cfg["balance_C"], cfg["thermal_lag_h"])
    dhw = cfg["home_dhw_MWh"] * DHW_SHAPE / HOURS
    return cfg["homes"] * (space + dhw)


def commercial(temp: np.ndarray, annual_MWh: float, balance_C: float, lag_h: int, dhw_frac: float = 0.08) -> np.ndarray:
    space = annual_MWh * (1 - dhw_frac) * degree_shape(temp, balance_C, lag_h)
    dhw = annual_MWh * dhw_frac * DHW_SHAPE / HOURS
    return space + dhw


def ring_demand(ring_id: str, ring: dict, temp: np.ndarray, ghi: np.ndarray, design_C: float) -> dict[str, np.ndarray]:
    """Customer heat demand per user, MW."""
    if ring_id == "onsite":
        u = ring["users"]
        return {
            "greenhouse": greenhouse(temp, ghi, design_C, u["greenhouse"]),
            "aquaculture": base_plus_degree(temp, u["aquaculture"]),
            "rec_center_pool": base_plus_degree(temp, u["rec_center_pool"]),
        }
    if ring_id == "corridor":
        return {"homes": homes(temp, ring)}
    if ring_id == "town":
        return {
            name: commercial(temp, b["annual_MWh"], ring["balance_C"], ring["thermal_lag_h"])
            for name, b in ring["buildings"].items()
        }
    raise KeyError(ring_id)

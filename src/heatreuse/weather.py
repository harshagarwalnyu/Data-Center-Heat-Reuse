"""Hourly outdoor temperature and a solar proxy for Lansing, NY.

Uses a real TMY file when one is present; otherwise builds a synthetic year
whose monthly means match the configured normals and whose coldest hour hits
the heating design temperature.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np

HOURS = 8760
DAYS = 365
MONTH_DAYS = np.array([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31])
MONTH_OF_HOUR = np.repeat(np.arange(12), MONTH_DAYS * 24)
MONTH_MID_DOY = np.cumsum(MONTH_DAYS) - MONTH_DAYS / 2.0


def _fourier_basis(doy: np.ndarray, harmonics: int = 3) -> np.ndarray:
    w = 2 * np.pi / DAYS
    cols = [np.ones_like(doy)]
    for k in range(1, harmonics + 1):
        cols += [np.cos(k * w * doy), np.sin(k * w * doy)]
    return np.column_stack(cols)


def _smooth_annual(monthly: np.ndarray, doy: np.ndarray) -> np.ndarray:
    coef, *_ = np.linalg.lstsq(_fourier_basis(MONTH_MID_DOY), monthly, rcond=None)
    return _fourier_basis(doy) @ coef


def synthetic_temperature(cfg: dict) -> np.ndarray:
    rng = np.random.default_rng(cfg["seed"])
    normals = np.asarray(cfg["monthly_mean_C"], dtype=float)
    hour = np.arange(HOURS)
    doy = hour / 24.0

    base = _smooth_annual(normals, doy)

    # Day-to-day weather: AR(1) anomalies, wider in winter.
    sd = cfg["daily_anomaly_sd_C"]
    day_mid = np.arange(DAYS) + 0.5
    winterness = 0.5 + 0.5 * np.cos(2 * np.pi * (day_mid - 20) / DAYS)
    sd_day = sd["summer"] + (sd["winter"] - sd["summer"]) * winterness
    phi = cfg["daily_anomaly_ar1"]
    anom = np.zeros(DAYS)
    for d in range(DAYS):
        prev = anom[d - 1] if d else 0.0
        anom[d] = phi * prev + np.sqrt(1 - phi**2) * sd_day[d] * rng.standard_normal()
    anom_h = np.interp(doy, day_mid, anom, period=DAYS)

    diurnal = cfg["diurnal_half_range_C"] * np.cos(2 * np.pi * ((hour % 24) - 15) / 24)
    temp = base + anom_h + diurnal

    # Pin monthly means to the normals.
    for m in range(12):
        sel = MONTH_OF_HOUR == m
        temp[sel] += normals[m] - temp[sel].mean()

    # Cold snap: raised-cosine dip, depth solved so the year reaches the design temperature.
    snap = cfg["cold_snap"]
    half = snap["days"] / 2.0
    x = (doy - snap["center_doy"]) / half
    shape = np.where(np.abs(x) < 1, 0.5 * (1 + np.cos(np.pi * x)), 0.0)
    lo, hi = 0.0, 40.0
    for _ in range(60):
        mid = (lo + hi) / 2
        if (temp - mid * shape).min() > cfg["design_C"]:
            lo = mid
        else:
            hi = mid
    return temp - hi * shape


def load_temperature(cfg: dict, root: Path) -> tuple[np.ndarray, str]:
    path = root / cfg.get("tmy_csv", "")
    if cfg.get("tmy_csv") and path.is_file():
        import csv

        with path.open() as f:
            temp = np.array([float(r["temp_C"]) for r in csv.DictReader(f)])
        if temp.size != HOURS:
            raise ValueError(f"{path} has {temp.size} rows, expected {HOURS}")
        return temp, f"TMY file {cfg['tmy_csv']}"
    return synthetic_temperature(cfg), "synthetic year calibrated to NOAA 1991-2020 Ithaca normals"


def solar_ghi(cfg: dict) -> np.ndarray:
    """Global horizontal irradiance proxy, W/m2: geometric clear sky times monthly clearness."""
    hour = np.arange(HOURS)
    n = hour // 24 + 1
    lat = np.radians(cfg["lat_deg"])
    decl = np.radians(23.45) * np.sin(2 * np.pi * (284 + n) / 365)
    omega = np.radians(15.0 * ((hour % 24) + 0.5 - 12))
    sin_alt = np.sin(lat) * np.sin(decl) + np.cos(lat) * np.cos(decl) * np.cos(omega)
    kt = np.asarray(cfg["clearness"])[MONTH_OF_HOUR]
    return 1367.0 * np.clip(sin_alt, 0, None) * kt


def rolling_mean(x: np.ndarray, window_h: int) -> np.ndarray:
    """Trailing mean with wrap-around (building thermal mass)."""
    if window_h <= 1:
        return x.copy()
    kernel = np.ones(window_h) / window_h
    padded = np.concatenate([x[-(window_h - 1):], x])
    return np.convolve(padded, kernel, mode="valid")


def heating_degree_days(temp: np.ndarray, base_C: float = 18.0) -> float:
    return float(np.clip(base_C - temp, 0, None).sum() / 24.0)

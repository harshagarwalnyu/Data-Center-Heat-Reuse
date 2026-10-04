"""Hourly dry-bulb temperature. TMYx EPW preferred, cached CSV, synthetic fallback."""
from __future__ import annotations
import glob
import numpy as np
import pandas as pd
from .config import ROOT

RAW = ROOT / "data" / "raw"
PROC = ROOT / "data" / "processed"


def _read_epw(path: str) -> np.ndarray:
    vals = []
    with open(path, encoding="latin-1") as f:
        for i, line in enumerate(f):
            if i < 8:
                continue
            parts = line.split(",")
            if len(parts) > 6:
                vals.append(float(parts[6]))
    a = np.array(vals)
    if len(a) == 8784:
        a = np.concatenate([a[:1416], a[1440:]])  # drop Feb 29
    return a[:8760]


def synthetic(jan_mean=-5.0, jul_mean=21.0, seed: int = 3) -> np.ndarray:
    """Sinusoidal annual + diurnal profile with weather-like noise (fallback only)."""
    h = np.arange(8760)
    day = h / 24.0
    mean, amp = (jan_mean + jul_mean) / 2, (jul_mean - jan_mean) / 2
    annual = mean - amp * np.cos(2 * np.pi * (day - 15) / 365.0)
    diurnal = 4.0 * np.sin(2 * np.pi * ((h % 24) - 9) / 24.0)
    rng = np.random.default_rng(seed)
    noise = np.repeat(rng.normal(0, 4.0, 365), 24)
    return annual + diurnal + noise


def load_temps(cfg: dict) -> tuple[np.ndarray, str]:
    key = cfg["key"]
    cache = PROC / f"weather_{key}.csv"
    files = glob.glob(str(RAW / cfg["eng"]["site"]["epw_glob"]))
    if files:
        t = _read_epw(files[0])
        if len(t) == 8760:
            PROC.mkdir(parents=True, exist_ok=True)
            pd.DataFrame({"dry_bulb_C": t}).to_csv(cache, index_label="hour")
            return t, "TMYx EPW " + files[0].split("\\")[-1].split("/")[-1]
    if cache.exists():
        return pd.read_csv(cache)["dry_bulb_C"].to_numpy(), "cached TMYx " + cache.name
    return synthetic(), "SYNTHETIC sinusoid (fallback)"


def months() -> np.ndarray:
    idx = pd.date_range("2023-01-01", periods=8760, freq="h")
    return idx.month.to_numpy()


def hdd_f(t: np.ndarray, base_f: float = 65.0) -> float:
    tf = t * 9 / 5 + 32
    return float(np.maximum(0, base_f - tf).sum() / 24)

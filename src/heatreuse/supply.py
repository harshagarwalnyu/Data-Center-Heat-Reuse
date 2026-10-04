"""Hourly DC heat supply (MW thermal at the capture point)."""
from __future__ import annotations
import numpy as np


def availability_mask(cfg: dict, n: int = 8760) -> np.ndarray:
    """Seeded 0/1 mask of capture outages sized to (1 - capture_availability) of the year."""
    s = cfg["eng"]["supply"]
    lost_target = (1 - s["capture_availability"]) * n
    rng = np.random.default_rng(s["outage_seed"])
    mask = np.ones(n)
    lost = 0.0
    while lost < lost_target:
        dur = max(2, int(rng.exponential(s["outage_mean_h"])))
        start = int(rng.integers(0, n - dur))
        mask[start:start + dur] = 0.0
        lost = n - mask.sum()
    return mask


def it_load_mw(cfg: dict, n: int = 8760) -> np.ndarray:
    """Hourly IT load (MW) with a diurnal swing, capped at nameplate."""
    s = cfg["eng"]["supply"]
    h = np.arange(n)
    load = s["it_load_mw"] * s["load_factor"] * (1 + s["diurnal_amp"] * np.sin(2 * np.pi * ((h % 24) - 14) / 24))
    return np.minimum(load, s["it_load_mw"])


def heat_available_mw(cfg: dict, n: int = 8760) -> np.ndarray:
    """Hourly capturable heat (MW_th) = IT load x capture fraction x availability."""
    s = cfg["eng"]["supply"]
    return it_load_mw(cfg, n) * s["capture_fraction"] * availability_mask(cfg, n)

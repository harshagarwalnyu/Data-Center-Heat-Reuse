"""COP = eta * T_sink_K / (T_sink_K - T_source_K + 2*approach), clipped."""
from __future__ import annotations
import numpy as np


def cop(t_sink_c: float | np.ndarray, t_source_c: float | np.ndarray, eta: float = 0.5, approach_k: float = 3.0,
        lo: float = 2.0, hi: float = 6.0) -> np.ndarray:
    """Carnot-fraction COP with heat-exchanger approach on both sides, clipped to [lo, hi]."""
    ts = np.asarray(t_sink_c, dtype=float) + 273.15
    tsrc = np.asarray(t_source_c, dtype=float) + 273.15
    lift = np.maximum(ts - tsrc + 2 * approach_k, 1e-6)
    return np.clip(eta * ts / lift, lo, hi)


def weather_comp(t_out: float | np.ndarray, sc: dict) -> np.ndarray:
    """Weather-compensated sink temperature (heating curve)."""
    return np.clip(sc["t_min"] + sc["slope"] * (sc["t_ref"] - np.asarray(t_out)), sc["t_min"], sc["t_max"])

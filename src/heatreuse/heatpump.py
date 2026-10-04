"""COP = eta * T_sink_K / (T_sink_K - T_source_K + 2*approach), clipped."""
from __future__ import annotations
import numpy as np


def cop(t_sink_c, t_source_c, eta=0.5, approach_k=3.0, lo=2.0, hi=6.0):
    ts = np.asarray(t_sink_c, dtype=float) + 273.15
    tsrc = np.asarray(t_source_c, dtype=float) + 273.15
    lift = np.maximum(ts - tsrc + 2 * approach_k, 1e-6)
    return np.clip(eta * ts / lift, lo, hi)


def weather_comp(t_out, sc: dict):
    """Weather-compensated sink temperature (heating curve)."""
    return np.clip(sc["t_min"] + sc["slope"] * (sc["t_ref"] - np.asarray(t_out)), sc["t_min"], sc["t_max"])

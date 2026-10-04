"""Heat pump COP screen: eta x Carnot with heat exchanger approach on both sides."""

from __future__ import annotations

import numpy as np

KELVIN = 273.15


def cop(t_source_C, t_sink_C, eta: float, approach_K: float, cop_min: float, cop_max: float):
    """COP = eta * T_sink_K / (T_sink - T_source + 2 * approach), clipped to [cop_min, cop_max]."""
    t_source_C = np.asarray(t_source_C, dtype=float)
    t_sink_C = np.asarray(t_sink_C, dtype=float)
    lift = np.maximum(t_sink_C - t_source_C + 2 * approach_K, 1e-6)
    return np.clip(eta * (t_sink_C + KELVIN) / lift, cop_min, cop_max)


def cop_unclipped(t_source_C: float, t_sink_C: float, eta: float, approach_K: float) -> float:
    return float(eta * (t_sink_C + KELVIN) / (t_sink_C - t_source_C + 2 * approach_K))


def supply_temp_reset(t_out: np.ndarray, t_max: float, t_min: float, design_C: float, mild_C: float = 15.0):
    """Outdoor reset curve: t_max at the design temperature, t_min at mild_C and above."""
    frac = np.clip((mild_C - t_out) / (mild_C - design_C), 0, 1)
    return t_min + (t_max - t_min) * frac

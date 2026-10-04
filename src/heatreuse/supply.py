"""Recoverable data-center heat per hour."""

from __future__ import annotations

import numpy as np

from .weather import HOURS


def outage_mask(outages: list[dict]) -> np.ndarray:
    mask = np.zeros(HOURS, dtype=bool)
    for o in outages:
        start = (o["start_doy"] - 1) * 24 + o.get("start_hour", 0)
        mask[start:start + o["hours"]] = True
    return mask


def heat_available(cfg: dict) -> tuple[np.ndarray, np.ndarray]:
    """MW of liquid-loop heat at capture temperature, and the outage mask.

    Cooling never depends on offtakers: during an outage the heat is simply not
    offered to the network (DC trips, or sidestream valved off for maintenance).
    """
    mw = cfg["it_load_MW"] * cfg["load_factor"] * cfg["capture_fraction"]
    avail = np.full(HOURS, mw)
    mask = outage_mask(cfg.get("outages", []))
    avail[mask] = 0.0
    return avail, mask

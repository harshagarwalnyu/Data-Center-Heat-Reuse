"""Hourly dispatch for one ring: plant -> storage -> backup -> unmet.

All flows are MW on the network side (equal to MWh per hour).
Balance every hour: need = direct + discharge + backup + unmet.
"""

from __future__ import annotations

import numpy as np


def dispatch(need: np.ndarray, plant_cap: np.ndarray, store_MWh: float, store_rate_MW: float,
             backup_MW: float, loss_frac_per_h: float) -> dict[str, np.ndarray]:
    n = need.size
    direct = np.minimum(need, plant_cap)
    spare = plant_cap - direct
    charge = np.zeros(n)
    discharge = np.zeros(n)
    soc = np.zeros(n)
    backup = np.zeros(n)
    unmet = np.zeros(n)
    s = store_MWh  # start full
    for t in range(n):
        s *= 1 - loss_frac_per_h
        short = need[t] - direct[t]
        if short > 0:
            d = min(short, s, store_rate_MW)
            s -= d
            discharge[t] = d
            short -= d
            b = min(short, backup_MW)
            backup[t] = b
            unmet[t] = short - b
        else:
            c = min(spare[t], store_rate_MW, store_MWh - s)
            s += c
            charge[t] = c
        soc[t] = s
    return {
        "need": need, "direct": direct, "charge": charge, "discharge": discharge,
        "backup": backup, "unmet": unmet, "soc": soc, "plant_out": direct + charge,
    }

"""Hot water tank sizing."""

from __future__ import annotations

RHO_CP_MWH_PER_M3K = 1000 * 4.18 / 3.6e6  # 1 m3 water, 1 K -> MWh


def tank_m3(capacity_MWh: float, dT_K: float) -> float:
    return capacity_MWh / (RHO_CP_MWH_PER_M3K * dT_K) if capacity_MWh > 0 else 0.0

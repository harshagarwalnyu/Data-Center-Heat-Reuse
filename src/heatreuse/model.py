"""8,760-hour engineering run: supply, three rings, dispatch."""

from __future__ import annotations

import copy
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
import yaml

from . import demand, heatpump, storage, supply, weather
from . import dispatch as dispatch_mod

ROOT = Path(__file__).resolve().parents[2]
# DC heat goes to the highest-value sink first. Supply far exceeds demand, so order rarely binds.
RING_PRIORITY = ["town", "corridor", "onsite"]


def load_config(path: Path | str | None = None) -> dict:
    with open(path or ROOT / "assumptions.yaml") as f:
        return yaml.safe_load(f)


def with_overrides(cfg: dict, overrides: dict[str, float]) -> dict:
    """Copy of cfg with dotted-path values replaced, e.g. {"supply.load_factor": 0.6}."""
    out = copy.deepcopy(cfg)
    for path, value in overrides.items():
        node = out
        *parents, leaf = path.split(".")
        for key in parents:
            node = node[key]
        node[leaf] = value
    return out


@dataclass
class RingResult:
    id: str
    cfg: dict
    users: dict[str, np.ndarray]
    customer: np.ndarray          # MW customer heat demand
    loss_MW: float                # constant network heat loss
    cop: np.ndarray               # hourly COP (inf for direct HX)
    flows: dict[str, np.ndarray]  # dispatch output
    hp_elec: np.ndarray
    pump_elec: np.ndarray
    dc_draw: np.ndarray
    plant_MW: float
    store_MWh: float
    store_m3: float
    backup_MW: float
    pipe_m: float

    @property
    def recovered(self) -> np.ndarray:
        """Customer heat met by recovered DC heat (direct or via storage), MW."""
        return np.clip(self.customer - self.flows["backup"] - self.flows["unmet"], 0, None)


@dataclass
class Results:
    cfg: dict
    temp: np.ndarray
    ghi: np.ndarray
    weather_source: str
    available: np.ndarray
    outage: np.ndarray
    rings: dict[str, RingResult] = field(default_factory=dict)


def _ring_cop(ring_id: str, ring: dict, temp: np.ndarray, cfg: dict) -> np.ndarray:
    hp = cfg["heat_pump"]
    design = cfg["weather"]["design_C"]
    if ring["kind"] == "direct":
        return np.full(temp.size, np.inf)
    if ring["kind"] == "building_hp":
        source = ring["loop_temp_C"]
    else:
        source = cfg["supply"]["capture_temp_C"]
    sink = heatpump.supply_temp_reset(temp, ring["sink_max_C"], ring["sink_min_C"], design)
    return heatpump.cop(source, sink, hp["eta_carnot"], hp["approach_K"], hp["cop_min"], hp["cop_max"])


def _pipe_m(ring_id: str, ring: dict) -> float:
    if ring_id == "corridor":
        return ring["homes"] * ring["trench_m_per_home"]
    if ring_id == "town":
        return (ring["transmission_km"] + ring["local_km"]) * 1000
    return ring["pipe_km"] * 1000


def run(cfg: dict | None = None) -> Results:
    cfg = cfg or load_config()
    temp, src = weather.load_temperature(cfg["weather"], ROOT)
    ghi = weather.solar_ghi(cfg["weather"])
    avail, outage = supply.heat_available(cfg["supply"])
    res = Results(cfg, temp, ghi, src, avail, outage)

    remaining = avail.copy()
    design = cfg["weather"]["design_C"]
    st = cfg["storage"]
    for rid in RING_PRIORITY:
        ring = cfg["rings"][rid]
        users = demand.ring_demand(rid, ring, temp, ghi, design)
        customer = sum(users.values())
        pipe_m = _pipe_m(rid, ring)
        loss = pipe_m * ring["pipe_loss_W_per_m"] / 1e6
        need = customer + loss
        peak = float(need.max())

        cop = _ring_cop(rid, ring, temp, cfg)
        dc_per_out = 1 - 1 / cop  # MW of DC heat per MW plant output (1 for direct HX)
        plant_MW = ring["plant_size_frac_of_peak"] * peak
        store_MWh = ring["storage_hours_of_peak"] * peak
        backup_MW = ring["backup_size_frac_of_peak"] * peak
        plant_cap = np.minimum(plant_MW, remaining / dc_per_out)

        flows = dispatch_mod.dispatch(need, plant_cap, store_MWh, peak, backup_MW, st["loss_frac_per_h"])
        out = flows["plant_out"]
        hp_elec = out / cop
        dc_draw = out * dc_per_out
        remaining = remaining - dc_draw
        res.rings[rid] = RingResult(
            id=rid, cfg=ring, users=users, customer=customer, loss_MW=loss, cop=cop, flows=flows,
            hp_elec=hp_elec, pump_elec=out * cfg["heat_pump"]["pump_elec_frac"], dc_draw=dc_draw,
            plant_MW=plant_MW, store_MWh=store_MWh, store_m3=storage.tank_m3(store_MWh, st["water_dT_K"]),
            backup_MW=backup_MW, pipe_m=pipe_m,
        )
    return res


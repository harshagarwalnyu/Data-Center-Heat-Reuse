"""Config-driven offtaker scoring and offtakers.json rows."""
from __future__ import annotations
import math
import yaml
from .config import CONFIG

R_KM = 6371.0


def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance in km."""
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dl, dp = math.radians(lon2 - lon1), p2 - p1
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R_KM * math.asin(math.sqrt(a))


def build(cfg, model_mwh: dict) -> list[dict]:
    y = yaml.safe_load((CONFIG / "offtakers.yaml").read_text(encoding="utf-8"))
    w, flh = y["weights"], y["flh"]
    lat0, lon0 = cfg["eng"]["site"]["lat"], cfg["eng"]["site"]["lon"]
    rows = []
    fuel_score = {"propane": 1.0, "oil": 1.0, "electric": 0.6, "gas": 0.2}
    for r in y["rows"]:
        mwh = model_mwh[r["id"]] if r["annual_MWh"] == "model" else r["annual_MWh"]
        dist = haversine(lat0, lon0, r["lat"], r["lon"])
        peak = mwh / flh[r["flh"]]
        temp_fit = max(0.0, 1 - max(0, r["supply_temp_C"] - 50) / 40)
        size = min(1.0, math.log10(max(mwh, 1)) / 4.5)
        prox = max(0.0, 1 - dist / 15)
        s = (w["temp_fit"] * temp_fit + w["size"] * size + w["proximity"] * prox
             + w["fuel"] * fuel_score[r["fuel"]] + w["community"] * r["community"])
        rows.append(dict(id=r["id"], name=r["name"], type=r["type"], lat=r["lat"], lon=r["lon"], dist_km=round(dist, 2),
                         annual_MWh=round(mwh, 0), peak_MW=round(peak, 2), supply_temp_C=r["supply_temp_C"], fuel=r["fuel"],
                         score=round(100 * s, 1), ring=r["ring"]))
    return sorted(rows, key=lambda x: -x["score"])

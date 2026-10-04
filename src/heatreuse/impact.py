"""Carbon, fossil displacement, water/fan energy, ERF, jobs and food."""

from __future__ import annotations

from .model import Results


def _kg_per_MWh_heat(fuel: str, imp: dict) -> float:
    eff = imp["appliance_eff"][fuel]
    if fuel == "electric_resistance":
        return imp["grid_kg_per_MWh"] / eff
    return imp["ef_kg_per_MWh_fuel"][fuel] / eff


def ring_impact(res: Results, rid: str) -> dict:
    imp = res.cfg["impact"]
    r = res.rings[rid]
    heat = float(r.customer.sum())
    mix = r.cfg.get("counterfactual_mix") or {r.cfg["counterfactual_fuel"]: 1.0}
    cf_kg = heat * sum(share * _kg_per_MWh_heat(f, imp) for f, share in mix.items())
    elec = float(r.hp_elec.sum() + r.pump_elec.sum())
    backup = float(r.flows["backup"].sum())
    sys_kg = elec * imp["grid_kg_per_MWh"] + backup * _kg_per_MWh_heat(r.cfg["backup_fuel"], imp)
    fossil_share = sum(s for f, s in mix.items() if f != "electric_resistance")
    return {
        "co2_avoided_t": (cf_kg - sys_kg) / 1000,
        "fossil_displaced_MWh": float(r.recovered.sum()) * fossil_share,
        "new_load": rid == "onsite",
    }


def system_impact(res: Results, built: list[str]) -> dict:
    cfg = res.cfg
    imp = cfg["impact"]
    sup = cfg["supply"]
    per = {rid: ring_impact(res, rid) for rid in built}
    co2 = sum(p["co2_avoided_t"] for p in per.values())
    co2_existing = sum(p["co2_avoided_t"] for p in per.values() if not p["new_load"])
    dc_draw = sum(float(res.rings[rid].dc_draw.sum()) for rid in built)
    facility_MWh = sup["it_load_MW"] * sup["load_factor"] * 8760 * sup["pue"]

    jobs, food = 0.0, 0.0
    if "onsite" in built:
        u = cfg["rings"]["onsite"]["users"]
        gh = u["greenhouse"]
        jobs = gh["area_ha"] * gh["jobs_per_ha"] + u["aquaculture"]["jobs"] + u["rec_center_pool"]["jobs"]
        food = gh["area_ha"] * 1e4 * gh["yield_kg_per_m2"] / 1000 + u["aquaculture"]["output_t_yr"]
    homes = cfg["rings"]["corridor"]["homes"] if "corridor" in built else 0

    return {
        "co2_avoided_t_yr": co2,
        "co2_avoided_existing_loads_t_yr": co2_existing,
        "co2_avoided_new_loads_t_yr": co2 - co2_existing,
        "co2_cars_equiv": co2 / imp["car_t_per_yr"],
        "homes_served": homes,
        "fossil_displaced_MWh": sum(p["fossil_displaced_MWh"] for p in per.values()),
        "erf": dc_draw / facility_MWh,
        "water": {
            "note": ("TeraWulf's sealed glycol loop with dry coolers uses no lake water for cooling, so heat reuse "
                     "does not cut lake withdrawals. It cuts dry-cooler fan energy, and the HSA covenant keeps the "
                     "1.008 MGD permit unused for cooling."),
            "fan_energy_saved_MWh": dc_draw * imp["dry_cooler_fan_kWe_per_kWth"],
        },
        "jobs": round(jobs),
        "local_food_t_yr": round(food),
        "by_ring": per,
    }

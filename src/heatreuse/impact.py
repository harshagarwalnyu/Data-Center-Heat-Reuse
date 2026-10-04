"""CO2, ERF/ERE (HDR deck p17-18), jobs, food, fan energy."""
from __future__ import annotations


def evaluate(cfg, sim, fin_res) -> dict:
    im, e = cfg["imp"], cfg["eng"]
    ef = im["ef_kg_kwh"]
    eff = cfg["fin"]["prices"]["eff"]
    effs = {"propane": eff["propane"], "oil": eff["oil"], "gas": eff["gas"]}
    d, R = sim["disp"], sim["rings"]
    f = d["f"]
    mixes = {"onsite": im["mix_onsite"], "corridor": im["mix_corridor"], "town": im["mix_town"]}
    displaced_kg = 0.0
    fossil_mwh = 0.0
    for r in d["active"]:
        served = float((R[r]["D"] * f).sum())
        for fuel, sh in mixes[r].items():
            if fuel in effs:
                fuel_mwh = served * sh / effs[fuel]
                fossil_mwh += fuel_mwh
                displaced_kg += fuel_mwh * 1000 * ef[fuel]
            elif fuel == "electric":
                displaced_kg += served * sh * 1000 * ef["grid"]
    elec = float(d["e_served"].sum())
    pump = e["network"]["pump_share"] * float(d["D"].sum())
    backup_fuel = float(d["backup_gate"].sum()) / e["backup"]["efficiency"]
    added_kg = (elec + pump) * 1000 * ef["grid"] + backup_fuel * 1000 * ef["propane"]
    added_marg = (elec + pump) * 1000 * ef["grid_marginal"] + backup_fuel * 1000 * ef["propane"]
    net_t = (displaced_kg - added_kg) / 1000
    net_t_marg = (displaced_kg - added_marg) / 1000
    it_mwh = float(sim["it"].sum())
    reuse = float((d["S"] * f).sum())
    facility = it_mwh * e["supply"]["pue"]
    j = im["jobs"]
    ac = e["onsite"]["greenhouse"]["area_ha"] * 2.471
    if ac > 0:
        fte = j["gh_fte_10ac"] + (ac - 10) / 55 * (j["gh_fte_65ac"] - j["gh_fte_10ac"])
        pte = j["gh_pte_10ac"] + (ac - 10) / 55 * (j["gh_pte_65ac"] - j["gh_pte_10ac"])
        gh_jobs = max(fte + pte, 0)
    else:
        gh_jobs = 0
    aq = e["onsite"]["aquaculture"]["fish_t_yr"] / j["aqua_t_per_job"]
    rec = j["rec_jobs"] if e["onsite"]["rec"]["pool_mwh"] > 0 else 0
    jobs = gh_jobs + aq + rec + j["network_ops_jobs"]
    gh = e["onsite"]["greenhouse"]
    food = gh["area_ha"] * 1e4 * gh["yield_kg_m2"] / 1000 + e["onsite"]["aquaculture"]["fish_t_yr"]
    return dict(co2_avoided_t_yr=net_t, co2_avoided_marginal_grid_t_yr=net_t_marg, co2_gross_displaced_t=displaced_kg / 1000,
                co2_added_t=added_kg / 1000, cars=net_t * 1000 / im["kg_co2_per_car_yr"], fossil_displaced_MWh=fossil_mwh,
                erf=reuse / it_mwh, ere=(facility - reuse) / it_mwh, it_mwh=it_mwh, reuse_mwh=reuse, jobs=jobs,
                gh_jobs=gh_jobs, food_t=food, fan_saved_mwh=reuse * im["fan_kwh_per_kwh_rejected"], elec_mwh=elec + pump)

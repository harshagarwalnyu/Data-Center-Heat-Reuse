"""Orchestration: simulate -> finance -> impact, scenarios and tornado."""
from __future__ import annotations
import numpy as np
from . import config as C, weather, supply, demand, dispatch as disp_mod, finance, impact, heatpump as hp


def simulate(cfg: dict, include_town: bool | None = None, T=None) -> dict:
    src = None
    if T is None:
        T, src = weather.load_temps(cfg)
    A = supply.heat_available_mw(cfg)
    it = supply.it_load_mw(cfg)
    rings = demand.build(cfg, T)
    if include_town is None:
        include_town = cfg["eng"]["town"]["include_in_base"]
    active = ["onsite", "corridor"] + (["town"] if include_town else [])
    d = disp_mod.dispatch(cfg, A, rings, active)
    return dict(T=T, A=A, it=it, rings=rings, disp=d, weather_src=src)


def full(cfg: dict, include_town: bool | None = None, T=None) -> dict:
    sim = simulate(cfg, include_town, T)
    fin = finance.evaluate(cfg, sim)
    imp = impact.evaluate(cfg, sim, fin)
    return dict(cfg=cfg, sim=sim, fin=fin, imp=imp)


def lcoh7(cfg, T=None) -> float:
    return full(cfg, T=T)["fin"]["lcoh"]["utility_7pct"]


def scale_capex(cfg, keys, mult):
    c = cfg
    for k in keys:
        c = C.override(c, "fin", "capex.%s" % k, cfg["fin"]["capex"][k] * mult)
    return c


def tornado(cfg, T) -> list[dict]:
    t = cfg["fin"]["tornado"]
    base = lcoh7(cfg, T)
    out = []

    def run(label, lo_cfg, hi_cfg, lo_v, hi_v, unit):
        lo, hi = lcoh7(lo_cfg, T), lcoh7(hi_cfg, T)
        out.append(dict(driver=label, low=lo, high=hi, low_input=lo_v, high_input=hi_v, unit=unit))

    pk = ["loop_pipe_usd_m", "onsite_pipe_usd_m", "trunk_usd_m"]
    run("Pipe cost", scale_capex(cfg, pk, t["pipe_cost"][0]), scale_capex(cfg, pk, t["pipe_cost"][1]),
        t["pipe_cost"][0], t["pipe_cost"][1], "x base")
    def ep(v):
        c = C.override(cfg, "fin", "elec_price_usd_kwh", v)
        return C.override(c, "fin", "elec_price_central_usd_kwh", cfg["fin"]["elec_price_central_usd_kwh"] * v / cfg["fin"]["elec_price_usd_kwh"])

    run("Electricity price (both rates scaled)", ep(t["elec_price"][0]), ep(t["elec_price"][1]), t["elec_price"][0], t["elec_price"][1], "$/kWh")
    run("Heat pump efficiency (COP via eta)", C.override(cfg, "eng", "hp.eta", t["eta"][1]),
        C.override(cfg, "eng", "hp.eta", t["eta"][0]), t["eta"][1], t["eta"][0], "fraction of Carnot")
    # uptake scales CUSTOMERS: potential homes (pipe length basis) held fixed, homes = potential * uptake
    c0 = cfg["eng"]["corridor"]
    potential = c0["homes"] / c0["uptake"]

    def up(u):
        c = C.override(cfg, "eng", "corridor.uptake", u)
        return C.override(c, "eng", "corridor.homes", potential * u)

    run("Uptake (signed share of potential corridor homes)", up(t["uptake"][1]), up(t["uptake"][0]),
        t["uptake"][1], t["uptake"][0], "share")
    # discount rate: LCOH at 4% vs 10% (same sim)
    base_full = full(cfg, T=T)
    out.append(dict(driver="Discount rate", low=base_full["fin"]["lcoh"]["coop_4pct"], high=base_full["fin"]["lcoh"]["private_10pct"],
                    low_input=0.04, high_input=0.10, unit="rate"))
    run("Data-center IT load (MW)", C.override(cfg, "eng", "supply.it_load_mw", t["dc_it_mw"][1]),
        C.override(cfg, "eng", "supply.it_load_mw", t["dc_it_mw"][0]), t["dc_it_mw"][1], t["dc_it_mw"][0], "MW")
    for o in out:
        o["base"] = base
    return sorted(out, key=lambda o: -abs(o["high"] - o["low"]))


def cop_compare(cfg, T) -> dict:
    h, s = cfg["eng"]["hp"], cfg["eng"]["supply"]
    t = cfg["eng"]["town"]
    sink = hp.weather_comp(T, t["sink"])
    D = demand.town(cfg, T)
    G = D["D"] + D["L"]
    res = {}
    for name, ts in (("air", s["air_capture_temp_c"]), ("liquid", s["capture_temp_c"])):
        c = hp.cop(sink, ts, h["eta"], h["approach_k"], h["cop_min"], h["cop_max"])
        res[name] = float(G.sum() / (G / c).sum())
    # design point COP at 60 C sink
    res["air_design"] = float(hp.cop(60, s["air_capture_temp_c"], h["eta"], h["approach_k"], h["cop_min"], h["cop_max"]))
    res["liquid_design"] = float(hp.cop(60, s["capture_temp_c"], h["eta"], h["approach_k"], h["cop_min"], h["cop_max"]))
    return res


def scenarios(cfg, T) -> dict:
    out = {}
    for name, cf in (("recovery_low_0.40", 0.40), ("recovery_base_0.75", 0.75), ("recovery_high_0.85", 0.85)):
        r = full(C.override(cfg, "eng", "supply.capture_fraction", cf), T=T)
        out[name] = dict(heat_available_GWh=float(r["sim"]["A"].sum() / 1000), delivered_GWh=r["fin"]["D"] / 1000,
                         unmet_hours=int((r["sim"]["disp"]["unmet"] > 1e-6).sum()),
                         backup_MWh=float(((r["sim"]["disp"]["D"]) * (1 - r["sim"]["disp"]["f"])).sum()),
                         lcoh7=r["fin"]["lcoh"]["utility_7pct"])
    r400 = full(C.override(cfg, "eng", "supply.it_load_mw", 320), T=T)
    out["dc_320MW_full_build"] = dict(heat_available_GWh=float(r400["sim"]["A"].sum() / 1000), delivered_GWh=r400["fin"]["D"] / 1000,
                           share_of_available_pct=100 * r400["fin"]["D"] / float(r400["sim"]["A"].sum()),
                           unmet_hours=int((r400["sim"]["disp"]["unmet"] > 1e-6).sum()), lcoh7=r400["fin"]["lcoh"]["utility_7pct"])
    r70 = full(C.override(cfg, "eng", "town.sink", {"t_min": 70, "t_max": 70, "slope": 0.0, "t_ref": 10}), include_town=True, T=T)
    r65 = full(cfg, include_town=True, T=T)
    out["town_hot_loop"] = dict(lcoh7_ring_65C=r65["fin"]["lcoh_ring"]["town"], lcoh7_ring_70C_sensitivity=r70["fin"]["lcoh_ring"]["town"])
    # 65 C capture (liquid cooling at the chip / hot-water-cooled racks, videos.md #39): town ring with direct HX when stream >= sink + 2*approach
    def _town_case(cf):
        r = full(cf, include_town=True, T=T)
        tw = r["sim"]["rings"]["town"]
        G = tw["D"] + tw["L"]
        return dict(lcoh7_ring=r["fin"]["lcoh_ring"]["town"], hp_elec_MWh=r["fin"]["ring"]["town"]["elec_mwh"],
                    avg_cop_if_hp=float(G.sum() / max((tw["E"]).sum(), 1e-9)) if tw["E"].sum() > 0 else None,
                    direct_hx_share_of_hours=tw.get("direct_hx_share", 0.0))
    c65 = C.override(cfg, "eng", "supply.capture_temp_c", 65)
    out["capture_65C_town"] = dict(base_50C=_town_case(cfg), capture_65C=_town_case(c65),
                                  note="65 C capture feeds the 55-65 C town sink directly in mild hours; HP lift only when sink > 59 C")
    # low-electricity-price (industrial rate) scenario
    r12 = full(C.override(cfg, "fin", "elec_price_central_usd_kwh", cfg["fin"]["elec_price_usd_kwh"]), T=T)
    out["central_at_residential_rate"] = dict(lcoh7=r12["fin"]["lcoh"]["utility_7pct"], note="central HP + pumping at residential 0.245 instead of industrial")
    rp = full(C.override(cfg, "fin", "prices.propane_usd_gal", 2.85), T=T)
    out["propane_2.85_low_sensitivity"] = dict(propane_usd_mwh=rp["fin"]["incumbents"]["propane"], tariff_usd_mwh=rp["fin"]["tariff"],
                                               household_savings_vs_propane_usd=rp["fin"]["household"]["savings_vs_propane_usd"],
                                               lcoh7=rp["fin"]["lcoh"]["utility_7pct"])
    return out


def _scan(cfg, T):
    r = None
    for n in range(50, 2001, 50):
        r = full(C.override(cfg, "eng", "corridor.homes", n), T=T)["fin"]
        if r["lcoh_ring"]["corridor"] <= r["blend_tariff"]:
            return dict(min_homes=n, lcoh_ring=round(r["lcoh_ring"]["corridor"], 1), blend_tariff=round(r["blend_tariff"], 1))
    return dict(min_homes=None, lcoh_ring_at_2000_homes=round(r["lcoh_ring"]["corridor"], 1), blend_tariff=round(r["blend_tariff"], 1))


def breakeven_homes(cfg, T) -> dict:
    """Homes at which corridor ring LCOH(7%) <= blended tariff under different capex-payer assumptions."""
    c_pipe = C.override(C.override(cfg, "fin", "capex.loop_pipe_usd_m", 0.0), "fin", "capex.lateral_usd", 0.0)
    c_hp = C.override(c_pipe, "fin", "capex.building_hp_usd", cfg["fin"]["capex"]["building_hp_usd"] * 0.5)
    c_all = C.override(c_pipe, "fin", "capex.building_hp_usd", 0.0)
    return dict(cba_pays_pipe_and_laterals=_scan(c_pipe, T), cba_pays_pipe_plus_half_of_building_hps=_scan(c_hp, T),
                cba_pays_pipe_and_all_building_hps=_scan(c_all, T),
                finding="Pipe alone is not enough: the building heat pumps (~$16k each) must also be funded (NYSEG NPA / NYSERDA Clean Heat / CBA) for 0.8x-propane tariffs to cover cost.")

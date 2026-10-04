"""Capex, opex, LCOH, tariff, incumbents, NPV/funding gap, DC-exit exposure."""
from __future__ import annotations
import numpy as np
from . import heatpump as hp


def crf(r: float, n: int) -> float:
    return r * (1 + r) ** n / ((1 + r) ** n - 1)


def annuity(r: float, n: int) -> float:
    return (1 - (1 + r) ** -n) / r


def incumbents(cfg, T, corridor_D) -> dict:
    p = cfg["fin"]["prices"]
    ef = p["eff"]
    el = cfg["fin"]["elec_price_usd_kwh"] * 1000
    out = {
        "propane": p["propane_usd_gal"] / p["propane_kwh_gal"] / ef["propane"] * 1000,
        "heating_oil": p["oil_usd_gal"] / p["oil_kwh_gal"] / ef["oil"] * 1000,
        "natural_gas": p["gas_usd_therm"] / 29.307 / ef["gas"] * 1000,
        "electric_resistance": el,
    }
    a = cfg["eng"]["air_source"]
    c = hp.cop(a["sink_c"], T, a["eta"], a["approach_k"], 1.3, 6.0)
    seasonal = float(corridor_D.sum() / (corridor_D / c).sum())
    out["air_source_hp"] = el / seasonal
    if p.get("steam_usd_mwh"):
        out["steam"] = p["steam_usd_mwh"]
    out["_ashp_seasonal_cop"] = seasonal
    return out


def capex_lines(cfg, sim) -> list[dict]:
    c = cfg["fin"]["capex"]
    e = cfg["eng"]
    R, d = sim["rings"], sim["disp"]
    act = d["active"]
    L = []

    def add(item, usd, source, ring, payer="host"):
        L.append(dict(item=item, usd=float(usd), source=source, ring=ring, payer=payer))

    peakS = float(d["S"].max())
    add("DC-side sidestream interface (plate HX, isolation, N+1, controls)", peakS * 1000 * c["dc_interface_usd_kw"],
        "ASSUMPTION $/kW; OCP p7-8 extraction cost split DC/host", "shared", "dc50/host50")
    add("Source-side hot-water tank (%.0f m3, %d h of peak)" % (d["vol_m3"], e["storage"]["hours_of_peak"]),
        d["vol_m3"] * c["tank_usd_m3"], "ASSUMPTION $/m3; Danish pit stores 33-38 EUR/m3 (iea-shc.org) are the floor", "shared")
    on = R["onsite"]
    add("On-site distribution pipe (%.1f km)" % on["pipe_km"], on["pipe_km"] * 1000 * c["onsite_pipe_usd_m"],
        "ASSUMPTION pre-insulated rural pipe", "onsite")
    add("On-site customer substations", float(on["D"].max()) * 1000 * c["substation_usd_kw"], "ASSUMPTION $/kW", "onsite")
    co = R["corridor"]
    add("Corridor ambient loop pipe (%.1f km)" % co["pipe_km"], co["pipe_km"] * 1000 * c["loop_pipe_usd_m"],
        "ASSUMPTION; MIT OCW 2025 res-env-007 lec07 (circulation ~1/3 of ~$50k/residence)", "corridor")
    add("Building heat pumps (%d units)" % co["units"], co["units"] * c["building_hp_usd"],
        "ASSUMPTION; MIT OCW 2025 (in-home ~1/3 of ~$50k/residence)", "corridor")
    add("Service laterals + meters", co["units"] * c["lateral_usd"], "ASSUMPTION", "corridor")
    if "town" in act:
        t = R["town"]
        add("Town transmission + spur pipe (%.1f km)" % t["pipe_km"], t["pipe_km"] * 1000 * c["trunk_usd_m"],
            "ASSUMPTION; CBS p13: connection cost 3% to 50% of capex as distance grows 50 m to 4 km", "town")
        add("Central heat pump (50 to 65 C)", float((t["D"] + t["L"]).max()) * 1000 * c["central_hp_usd_kw"],
            "ASSUMPTION $/kW; CBS p17,19: 10 MW HP plant ~EUR 6M", "town")
        add("Town customer substations", float(t["D"].max()) * 1000 * c["substation_usd_kw"], "ASSUMPTION $/kW", "town")
    add("Circulation pumps + plant", float(d["G"].max()) * 1000 * c["pump_plant_usd_kw"], "ASSUMPTION $/kW", "shared")
    add("Backup boilers (100% of peak)", d["backup_cap_mw"] * 1000 * c["backup_usd_kw"], "ASSUMPTION $/kW", "shared")
    sub = sum(x["usd"] for x in L)
    add("Soft costs (design, permitting, owner)", sub * c["soft_cost_pct"], "ASSUMPTION %", "pro_rata")
    add("Contingency", sub * c["contingency_pct"], "ASSUMPTION %", "pro_rata")
    return L


def allocate(lines, sim):
    d = sim["disp"]
    act = d["active"]
    w = {r: float((sim["rings"][r]["D"] + sim["rings"][r]["L"]).sum()) for r in act}
    tot = sum(w.values())
    share = {r: w[r] / tot for r in act}
    own = {r: 0.0 for r in act}
    shared = 0.0
    for x in lines:
        if x["ring"] in act:
            own[x["ring"]] += x["usd"]
        elif x["ring"] == "shared":
            shared += x["usd"]
    base = {r: own[r] + shared * share[r] for r in act}
    sub = sum(base.values())
    pro = sum(x["usd"] for x in lines if x["ring"] == "pro_rata")
    return {r: base[r] + pro * base[r] / sub for r in act}, share


def evaluate(cfg, sim) -> dict:
    fin, e = cfg["fin"], cfg["eng"]
    d, R, T = sim["disp"], sim["rings"], sim["T"]
    act = d["active"]
    n_years = fin["years"]
    price = fin["elec_price_usd_kwh"] * 1000  # residential $/MWh (building HPs)
    price_c = fin["elec_price_central_usd_kwh"] * 1000  # large-industrial $/MWh (central HP, pumping)
    lines = capex_lines(cfg, sim)
    capex_total = sum(x["usd"] for x in lines)
    capex_ring, share = allocate(lines, sim)
    f = d["f"]
    p = fin["prices"]
    backup_cost_mwh = p["propane_usd_gal"] / p["propane_kwh_gal"] * 1000 / e["backup"]["efficiency"]
    o = fin["opex"]
    ring = {}
    for r in act:
        Dr = float(R[r]["D"].sum())
        Er = float((R[r]["E"] * f).sum())
        pump = e["network"]["pump_share"] * Dr
        bk = float(((R[r]["D"] + R[r]["L"]) * (1 - f)).sum())
        fixed = o["om_pct_capex"] * capex_ring[r]
        if r == "corridor":
            fixed += R[r]["units"] * (o["hp_service_usd_home"] + o["customer_usd_home"])
        fixed += o["program_usd_yr"] * share[r]
        p_hp = price if r == "corridor" else price_c
        var = Er * p_hp + pump * price_c + bk * backup_cost_mwh + o["heat_purchase_usd_mwh"] * Dr
        ring[r] = dict(D=Dr, capex=capex_ring[r], fixed=fixed, var=var, elec_mwh=Er + pump, backup_mwh=bk)
    D = sum(v["D"] for v in ring.values())
    capex = sum(v["capex"] for v in ring.values())
    fixed = sum(v["fixed"] for v in ring.values())
    var = sum(v["var"] for v in ring.values())

    def lcoh(r_, parts=None):
        pr = parts or list(ring.values())
        return sum(v["capex"] * crf(r_, n_years) + v["fixed"] + v["var"] for v in pr) / sum(v["D"] for v in pr)

    rates = fin["discount_rates"]
    lcoh_tot = {k: lcoh(v) for k, v in rates.items()}
    lcoh_ring = {r: lcoh(rates["utility_7pct"], [ring[r]]) for r in act}
    itc = fin["incentives"]["itc_pct"]

    def lcoh_itc(parts):
        return sum(v["capex"] * (1 - itc) * crf(rates["utility_7pct"], n_years) + v["fixed"] + v["var"] for v in parts) / sum(v["D"] for v in parts)

    lcoh_itc_tot = lcoh_itc(list(ring.values()))
    lcoh_itc_ring = {r: lcoh_itc([ring[r]]) for r in act}
    inc = incumbents(cfg, T, R["corridor"]["D"])
    ref = inc.get("steam", inc["propane"])
    ref_name = "steam" if "steam" in inc else "propane"
    ti = fin["tariff"]
    tariff = (1 - ti["discount_vs_propane"]) * ref
    li = (1 - ti["low_income_discount"]) * ref
    blend = (1 - ti["low_income_share"]) * tariff + ti["low_income_share"] * li
    typ = cfg["eng"]["corridor"]["mwh_per_home"]
    hh = dict(typical_MWh_yr=typ, savings_vs_propane_usd=typ * (inc["propane"] - tariff),
              savings_vs_oil_usd=typ * (inc["heating_oil"] - tariff), savings_vs_ref_usd=typ * (ref - tariff),
              savings_low_income_vs_propane_usd=typ * (inc["propane"] - li))
    rev = 0.0
    for r in act:
        rev += ring[r]["D"] * (ti["onsite_tariff_usd_mwh"] if r == "onsite" else blend)
    opex_tot = fixed + var
    af = annuity(rates["utility_7pct"], n_years)
    npv = rev * af - opex_tot * af - capex
    npv_itc = rev * af - opex_tot * af - capex * (1 - fin["incentives"]["itc_pct"])
    cor_cop = R["corridor"]["D"].sum() / max(R["corridor"]["E"].sum(), 1e-9)
    scen = []
    for dsc in fin["tariff_scenarios_discount"]:
        tf = (1 - dsc) * ref
        b = (1 - ti["low_income_share"]) * tf + ti["low_income_share"] * (1 - ti["low_income_discount"]) * ref
        rv = sum(ring[r]["D"] * (ti["onsite_tariff_usd_mwh"] if r == "onsite" else b) for r in act)
        scen.append(dict(multiple_of_ref=round(1 - dsc, 2), tariff_usd_mwh=tf,
                         margin_vs_lcoh7_usd_mwh=tf - lcoh_tot["utility_7pct"],
                         margin_over_hp_elec_usd_mwh=tf - price / cor_cop,
                         npv7_musd=(rv * af - opex_tot * af - capex) / 1e6,
                         npv7_itc_musd=(rv * af - opex_tot * af - capex * (1 - fin["incentives"]["itc_pct"])) / 1e6,
                         household_savings_vs_propane_usd=typ * (inc["propane"] - tf)))
    rc = ring["corridor"]
    npv_cor = (rc["D"] * blend - rc["fixed"] - rc["var"]) * af - rc["capex"]
    mult = 1 + fin["capex"]["soft_cost_pct"] + fin["capex"]["contingency_pct"]
    dc_specific = sum(x["usd"] for x in lines if x["item"].startswith(("DC-side", "Source-side", "On-site"))) * mult
    yr = fin["dc_exit"]["year"]
    stranded = dc_specific * (1 - yr / n_years)
    peakS_cor = float(R["corridor"]["S"].max())
    repl = peakS_cor * 1000 * fin["dc_exit"]["replacement_source_usd_kw"]
    S_cor = float(R["corridor"]["S"].sum())
    uplift = (repl * crf(rates["utility_7pct"], n_years - yr) + S_cor / 4.5 * price_c) / max(ring["corridor"]["D"], 1)
    out = dict(lines=lines, capex_total=capex_total, ring=ring, opex_fixed=fixed, opex_var=var, opex_total=opex_tot, D=D,
               lcoh=lcoh_tot, lcoh_ring=lcoh_ring, lcoh_itc7=lcoh_itc_tot, lcoh_itc_ring=lcoh_itc_ring, incumbents=inc, tariff=tariff, li_tariff=li, blend_tariff=blend,
               ref=ref, ref_name=ref_name, household=hh, revenue=rev, npv7=npv, npv7_itc=npv_itc,
               funding_gap_musd=max(0, -npv) / 1e6, funding_gap_itc_musd=max(0, -npv_itc) / 1e6,
               tariff_scenarios=scen, share=share, corridor_npv7=npv_cor, corridor_gap_musd=max(0, -npv_cor) / 1e6, capex_ring=capex_ring,
               dc_exit=dict(year=yr, stranded_musd=stranded / 1e6, replacement_source_musd=repl / 1e6,
                            corridor_cost_uplift_usd_mwh=uplift))
    tr = [x for x in lines if x["item"].startswith("Town transmission")]
    if tr:
        out["town_pipe_share_of_ring_capex"] = tr[0]["usd"] * mult / max(capex_ring.get("town", 1), 1)
    return out

"""Capex, opex, levelized cost of heat (LCOH), tariff, gates, DC-exit exposure."""

from __future__ import annotations

from dataclasses import dataclass

from .model import Results, RingResult


def crf(r: float, n: int) -> float:
    return r * (1 + r) ** n / ((1 + r) ** n - 1)


@dataclass
class RingFinance:
    id: str
    lines: list[dict]          # raw capex lines, USD
    capex: float               # incl. soft costs and contingency, USD
    dc_specific_capex: float   # assets stranded if the DC leaves, USD
    opex_fixed: float          # USD/yr
    energy_cost: float         # electricity + backup fuel + heat purchase, USD/yr
    heat_MWh: float            # all customer heat delivered (recovered + backup)
    lcoh: dict[str, float]     # USD/MWh by discount-rate case
    benchmark_usd_mwh: float   # what this ring must beat
    benchmark_label: str
    built: bool
    density_MWh_per_m: float


def _capex_lines(r: RingResult, fin: dict) -> list[dict]:
    uc = fin["unit_costs"]
    peak_dc_kW = float(r.dc_draw.max()) * 1000
    lines = [{"item": "Sidestream plate HX + pumps at DC", "usd": peak_dc_kW * uc["sidestream_hx_usd_per_kW"],
              "source": "assumption", "dc_specific": True}]
    kind = r.cfg["kind"]
    if kind == "direct":
        lines += [
            {"item": "Campus pre-insulated pipe", "usd": r.pipe_m * uc["pipe_insulated_usd_per_m"], "source": "assumption"},
            {"item": "Backup boiler (new campus)", "usd": r.backup_MW * 1000 * uc["backup_boiler_usd_per_kW"], "source": "assumption"},
        ]
    elif kind == "building_hp":
        homes = r.cfg["homes"]
        lines += [
            {"item": "Ambient loop pipe (HDPE)", "usd": r.pipe_m * uc["pipe_ambient_usd_per_m"], "source": "assumption"},
            {"item": "Building heat pumps", "usd": homes * uc["building_hp_usd_per_home"], "source": "assumption"},
            {"item": "Service lines + energy transfer stations", "usd": homes * uc["service_usd_per_home"], "source": "assumption"},
        ]
    else:
        lines += [
            {"item": "Central heat pump plant", "usd": r.plant_MW * 1000 * uc["central_hp_usd_per_kW"], "source": "cbs"},
            {"item": "Transmission + local pre-insulated pipe", "usd": r.pipe_m * uc["pipe_insulated_usd_per_m"], "source": "assumption"},
        ]
    if r.store_m3 > 0:
        lines.append({"item": "Thermal storage tank", "usd": r.store_m3 * uc["tank_usd_per_m3"], "source": "assumption"})
    return lines


def ring_finance(res: Results, rid: str) -> RingFinance:
    cfg = res.cfg
    fin = cfg["finance"]
    r = res.rings[rid]
    lines = _capex_lines(r, fin)
    markup = (1 + fin["soft_cost_frac"]) * (1 + fin["contingency_frac"])
    raw = sum(line["usd"] for line in lines)
    capex = raw * markup
    dc_specific = sum(line["usd"] for line in lines if line.get("dc_specific")) * markup

    elec_rate = fin["elec_residential_usd_per_kWh"] if r.cfg["kind"] == "building_hp" else fin["elec_commercial_usd_per_kWh"]
    hp_cost = r.hp_elec.sum() * 1000 * elec_rate
    pump_cost = r.pump_elec.sum() * 1000 * fin["elec_commercial_usd_per_kWh"]
    backup_cost = r.flows["backup"].sum() * fin["incumbent_usd_per_MWh"][r.cfg["backup_fuel"]]
    purchase = r.dc_draw.sum() * fin["heat_purchase_usd_per_MWh"]
    energy = hp_cost + pump_cost + backup_cost + purchase
    opex_fixed = capex * fin["om_frac_of_capex"]
    heat = float(r.customer.sum())

    lcoh = {k: (capex * crf(rate, fin["years"]) + opex_fixed + energy) / heat
            for k, rate in fin["discount_rates"].items()}

    tariff = tariff_usd_mwh(cfg)
    if rid == "town":
        fuel = r.cfg["counterfactual_fuel"]
        bench, label = fin["incumbent_usd_per_MWh"][fuel], f"{fuel.replace('_', ' ')} today"
    else:
        bench, label = tariff, "heat tariff"
    built = bool((not r.cfg["conditional"]) or lcoh[fin["gate_rate"]] <= bench * (1 - fin["gate_margin"]))

    return RingFinance(
        id=rid, lines=lines, capex=capex, dc_specific_capex=dc_specific, opex_fixed=opex_fixed,
        energy_cost=energy, heat_MWh=heat, lcoh=lcoh, benchmark_usd_mwh=bench, benchmark_label=label,
        built=built, density_MWh_per_m=heat / r.pipe_m if r.pipe_m else float("inf"),
    )


def tariff_usd_mwh(cfg: dict) -> float:
    fin = cfg["finance"]
    return fin["tariff_k_of_propane"] * fin["incumbent_usd_per_MWh"]["propane"]


def system_lcoh(fins: list[RingFinance], cfg: dict, rate_key: str) -> float:
    fin = cfg["finance"]
    rate = fin["discount_rates"][rate_key]
    cost = sum(f.capex * crf(rate, fin["years"]) + f.opex_fixed + f.energy_cost for f in fins)
    return cost / sum(f.heat_MWh for f in fins)


def dc_exit(res: Results, fins: list[RingFinance], rate_key: str) -> dict:
    """DC leaves in year N: stranded DC-side assets, and LCOH with an air-source fallback plant."""
    cfg = res.cfg
    fin = cfg["finance"]
    ex = fin["dc_exit"]
    remaining = 1 - ex["year"] / fin["years"]
    stranded = sum(f.dc_specific_capex for f in fins) * remaining
    rate = fin["discount_rates"][rate_key]
    peak_dc_kW = sum(float(res.rings[f.id].dc_draw.max()) for f in fins) * 1000
    dc_heat_MWh = sum(float(res.rings[f.id].dc_draw.sum()) for f in fins)
    extra = (peak_dc_kW * ex["fallback_hp_usd_per_kW"] * crf(rate, fin["years"])
             + dc_heat_MWh / ex["fallback_cop"] * 1000 * fin["elec_commercial_usd_per_kWh"])
    base = system_lcoh(fins, cfg, rate_key)
    return {
        "year": ex["year"],
        "stranded_musd": stranded / 1e6,
        "fallback_lcoh_usd_mwh": base + extra / sum(f.heat_MWh for f in fins),
        "fallback": ("Pipes, tanks, building heat pumps and backup boilers keep working. The sidestream HX is the only "
                     "DC-specific asset; an air-source central heat pump on the same pad replaces the DC heat, and the "
                     "HSA decommissioning reserve pays for it."),
    }

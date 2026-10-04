"""Screening hydraulics per ring: design flow, pipe DN, head, pump power and annual pumping energy.

CLI: ``uv run python -m heatreuse.hydraulics`` -> outputs/hydraulics.json + docs/hydraulics.md

The base model books circulation electricity as a flat ``network.pump_share`` (1.5% of delivered heat,
finance.evaluate / impact.evaluate). This module checks that flat share bottom-up. It reads site2.json and
the model's own hourly ring profiles, writes NEW files only, and never changes config or site2.json.
Screening, not design: see the Limits section of docs/hydraulics.md.
"""
from __future__ import annotations

import json
import math
from typing import Any

import numpy as np

from . import config as C, model
from .config import ROOT

OUT = ROOT / "outputs"
DOC = ROOT / "docs" / "hydraulics.md"
G = 9.81

# ---------------------------------------------------------------- assumptions (all ASSUMPTION / design intent)
DELTA_T = {  # supply/return design intent, K
    "onsite": dict(supply_c=45.0, return_c=25.0, basis="ASSUMPTION design intent 45/25 C low-temperature campus loop"),
    "corridor": dict(supply_c=20.0, return_c=15.0, basis="ASSUMPTION design intent 20/15 C ambient loop (building HP evaporators)"),
    "town": dict(supply_c=65.0, return_c=35.0, basis="ASSUMPTION design intent 65/35 C hot loop"),
}
PUMP_ETA = 0.70          # ASSUMPTION pump hydraulic efficiency at duty point (shaft power = rho g Q H / eta)
MOTOR_DRIVE_ETA = 0.93   # ASSUMPTION motor + variable-speed drive efficiency (electrical = shaft / this)
FITTINGS = 0.30          # ASSUMPTION +30% on straight-pipe friction for bends, valves, tees
END_HEAD_M = 10.0        # ASSUMPTION plant heat exchanger + critical-customer substation / evaporator allowance (~1 bar)
MIN_FLOW = 0.20          # ASSUMPTION variable-speed minimum-flow floor (share of design flow)
V_MAX_SMALL, V_MAX_LARGE, SMALL_DN = 1.5, 2.0, 150   # m/s; "small" = DN <= 150
R_MAX_PA_M = 100.0       # ASSUMPTION max specific friction loss, typical district-heating sizing guide
ROUGHNESS_MM = {"steel": 0.05, "hdpe": 0.007}  # ASSUMPTION absolute roughness
PIPE_MATERIAL = {"onsite": "steel", "corridor": "hdpe", "town": "steel"}
# DN -> inner diameter (m), EN 253 pre-insulated steel service pipe (EN 10220 standard wall). Used for HDPE too (screening).
DN_ID = {50: 0.0545, 65: 0.0703, 80: 0.0825, 100: 0.1071, 125: 0.1325, 150: 0.1603, 200: 0.2101, 250: 0.2630,
         300: 0.3127, 350: 0.3444, 400: 0.3938, 450: 0.4446, 500: 0.4954, 600: 0.5958, 700: 0.6950, 800: 0.7954}
# water properties: T C -> (rho kg/m3, cp J/kg K, kinematic viscosity m2/s)
WATER = [(10, 999.7, 4192, 1.306e-6), (20, 998.2, 4182, 1.004e-6), (30, 995.7, 4178, 0.801e-6),
         (40, 992.2, 4179, 0.658e-6), (50, 988.0, 4181, 0.553e-6), (60, 983.2, 4185, 0.474e-6)]
PUMP_SHARE_SWEEP = (0.005, 0.015, 0.03, 0.06)


def water(t_c: float) -> tuple[float, float, float]:
    """Linear-interpolated (rho, cp, nu) of water at t_c (10-60 C table)."""
    ts = [w[0] for w in WATER]
    return tuple(float(np.interp(t_c, ts, [w[i] for w in WATER])) for i in (1, 2, 3))  # type: ignore[return-value]


def design_flow_m3s(p_mw: float, dt_k: float, rho: float, cp: float) -> float:
    """Q = P / (rho cp dT), m3/s."""
    return p_mw * 1e6 / (rho * cp * dt_k)


def swamee_jain(re: float, d_m: float, eps_m: float) -> float:
    """Darcy friction factor, Swamee-Jain explicit approximation of Colebrook (turbulent); 64/Re if laminar."""
    if re < 2300:
        return 64.0 / re
    return 0.25 / math.log10(eps_m / (3.7 * d_m) + 5.74 / re ** 0.9) ** 2


def friction_pa_m(q: float, d_m: float, rho: float, nu: float, eps_m: float) -> tuple[float, float, float, float]:
    """Darcy-Weisbach specific loss. Returns (Pa/m, velocity m/s, Re, f)."""
    v = q / (math.pi * d_m ** 2 / 4)
    re = v * d_m / nu
    f = swamee_jain(re, d_m, eps_m)
    return f / d_m * rho * v ** 2 / 2, v, re, f


def select_dn(q: float, rho: float, nu: float, eps_m: float) -> dict[str, float]:
    """Smallest standard DN with velocity <= 1.5 m/s (DN<=150) or 2.0 m/s (larger) AND friction <= R_MAX_PA_M."""
    for dn, d in DN_ID.items():
        r, v, re, f = friction_pa_m(q, d, rho, nu, eps_m)
        vmax = V_MAX_SMALL if dn <= SMALL_DN else V_MAX_LARGE
        if v <= vmax and r <= R_MAX_PA_M:
            return dict(DN=dn, inner_d_m=d, velocity_m_s=v, v_limit_m_s=vmax, R_pa_m=r, Re=re, f=f)
    raise ValueError("flow %.3f m3/s exceeds largest DN in table" % q)


def critical_path(cfg: dict, ring: str, pipe_km: float) -> list[dict[str, Any]]:
    """One-way critical-path segments: (length_km, flow fraction, equivalent-length factor, note).

    Equivalent-length factor 1/3: along a branch whose flow falls linearly to zero (homes tapping off evenly)
    with constant diameter, integrated friction ~ L/3 x loss at entry flow (dp ~ Q^2).
    """
    if ring == "onsite":
        return [dict(km=pipe_km, flow_frac=1.0, eq_factor=1.0, note="whole on-site main at full flow (conservative)")]
    if ring == "corridor":
        trunk = cfg["eng"]["corridor"]["trunk_km"]
        dist = pipe_km - trunk
        return [dict(km=trunk, flow_frac=1.0, eq_factor=1.0, note="trunk plant -> first cluster at full flow"),
                dict(km=dist / 2, flow_frac=0.5, eq_factor=1 / 3,
                     note="ASSUMPTION distribution split into 2 branches; flow tapers linearly to 0 (eq. length L/3)")]
    t = cfg["eng"]["town"]
    return [dict(km=t["trunk_km"], flow_frac=1.0, eq_factor=1.0, note="transmission main at full flow"),
            dict(km=t["spur_km"], flow_frac=1.0, eq_factor=1.0, note="spur to Town Hall cluster at full flow (conservative)")]


def hourly_profiles(cfg: dict) -> dict[str, np.ndarray]:
    """Hourly customer heat (MW) per ring from the model (town ring included in the run)."""
    r = model.full(cfg, include_town=True)
    return {k: np.asarray(v["D"], dtype=float) for k, v in r["sim"]["rings"].items()}


def annual_energy(p_el_design_kw: float, x: np.ndarray, end_frac: float) -> dict[str, float]:
    """Annual pump electricity (MWh) for constant speed vs variable speed.

    x = hourly flow / design flow (flow follows load at constant delta-T).
    constant speed: design power all 8,760 h (throttled / bypassed; screening upper bound).
    variable speed, affinity: P = P_d * max(x, floor)^3 (pure cube law, zero control head; lower bound).
    variable speed, end-pressure control: H = H_end + (H_d - H_end) x^2, P = P_d * x * H / H_d (more realistic).
    """
    xf = np.maximum(x, MIN_FLOW)
    cs = p_el_design_kw * len(x) / 1000
    vs_cube = float((p_el_design_kw * xf ** 3).sum() / 1000)
    vs_ctrl = float((p_el_design_kw * xf * (end_frac + (1 - end_frac) * xf ** 2)).sum() / 1000)
    return dict(constant_speed_MWh=cs, variable_speed_affinity_MWh=vs_cube, variable_speed_end_pressure_MWh=vs_ctrl)


def ring_hydraulics(cfg: dict, ring: dict, profile: np.ndarray) -> dict[str, Any]:
    """Full screening calculation for one site2.json ring."""
    rid = ring["id"]
    dt = DELTA_T[rid]
    dT = dt["supply_c"] - dt["return_c"]
    rho, cp, nu = water((dt["supply_c"] + dt["return_c"]) / 2)
    q = design_flow_m3s(ring["peak_MW"], dT, rho, cp)
    eps = ROUGHNESS_MM[PIPE_MATERIAL[rid]] / 1000
    segs, friction_pa = [], 0.0
    for s in critical_path(cfg, rid, ring["pipe_km"]):
        qs = q * s["flow_frac"]
        sel = select_dn(qs, rho, nu, eps)
        dp = sel["R_pa_m"] * s["km"] * 1000 * s["eq_factor"]
        friction_pa += dp
        segs.append(dict(**s, flow_m3h=qs * 3600, **sel, dp_one_way_kPa=dp / 1000))
    total_pa = 2 * friction_pa * (1 + FITTINGS) + END_HEAD_M * rho * G   # supply + return
    head_m = total_pa / (rho * G)
    shaft_kw = rho * G * q * head_m / PUMP_ETA / 1000
    el_kw = shaft_kw / MOTOR_DRIVE_ETA
    x = profile / profile.max()
    en = annual_energy(el_kw, x, END_HEAD_M / head_m)
    flat = cfg["eng"]["network"]["pump_share"] * ring["annual_MWh"]
    vs = en["variable_speed_end_pressure_MWh"]
    q_m3h = q * 3600
    if head_m > 80:
        cls = "variable-speed multistage centrifugal, or end-suction sets with intermediate booster station(s) to split the head; duty/standby"
    elif q_m3h > 500:
        cls = "variable-speed split-case (double-suction) or parallel end-suction sets, N+1"
    else:
        cls = "variable-speed end-suction / inline, duty/standby"
    return dict(
        id=rid, peak_MW=ring["peak_MW"], annual_MWh=ring["annual_MWh"], pipe_km=ring["pipe_km"],
        supply_C=dt["supply_c"], return_C=dt["return_c"], delta_T_K=dT, delta_T_basis=dt["basis"],
        water=dict(mean_C=(dt["supply_c"] + dt["return_c"]) / 2, rho=rho, cp=cp, nu=nu),
        design_flow_m3_s=q, design_flow_m3_h=q_m3h, design_flow_L_s=q * 1000,
        pipe_material=PIPE_MATERIAL[rid], roughness_mm=ROUGHNESS_MM[PIPE_MATERIAL[rid]], segments=segs,
        head_m=head_m, head_friction_m=head_m - END_HEAD_M, shaft_kW=shaft_kw, electrical_kW=el_kw,
        duty_point=dict(flow_m3_h=q_m3h, head_m=head_m, product_class=cls),
        annual=dict(**en, profile_source="model hourly ring demand D (8,760 h), flow proportional to load at constant delta-T",
                    full_load_equivalent_hours=float(x.sum())),
        flat_pump_share_MWh=flat,
        computed_vs_flat_ratio=vs / flat if flat else None,
        pumping_pct_of_heat_variable_speed=100 * vs / ring["annual_MWh"],
        pumping_pct_of_heat_constant_speed=100 * en["constant_speed_MWh"] / ring["annual_MWh"],
        pumping_pct_of_heat_affinity=100 * en["variable_speed_affinity_MWh"] / ring["annual_MWh"],
    )


def pump_share_sweep(cfg: dict) -> dict[str, Any]:
    """Blended LCOH(7%) at alternative pump_share values (in-memory override; config untouched)."""
    base = model.full(cfg)
    T = base["sim"]["T"]
    b = base["fin"]["lcoh"]["utility_7pct"]
    rows = []
    for v in PUMP_SHARE_SWEEP:
        r = model.full(C.override(cfg, "eng", "network.pump_share", v), T=T)["fin"]
        rows.append(dict(pump_share=v, lcoh_blended_7pct=r["lcoh"]["utility_7pct"], delta_vs_base_usd_mwh=r["lcoh"]["utility_7pct"] - b,
                         lcoh_corridor_7pct=r["lcoh_ring"]["corridor"]))
    return dict(base_pump_share=cfg["eng"]["network"]["pump_share"], base_lcoh_blended_7pct=b, rows=rows,
                note="phases 1-2 base case; pump electricity priced at the central (industrial) rate, as in finance.evaluate")


def _rnd(o: Any) -> Any:
    if isinstance(o, float):
        return round(o, 4) if abs(o) < 10 else round(o, 2)
    if isinstance(o, dict):
        return {k: _rnd(v) for k, v in o.items()}
    if isinstance(o, list):
        return [_rnd(v) for v in o]
    return o


def build() -> dict[str, Any]:
    """Assemble the hydraulics dict (pure; no files written)."""
    cfg = C.load("site2")
    site2 = json.loads((OUT / "site2.json").read_text(encoding="utf-8"))
    prof = hourly_profiles(cfg)
    rings = {r["id"]: ring_hydraulics(cfg, r, prof[r["id"]]) for r in site2["rings"]}
    p12 = [rings[k] for k in ("onsite", "corridor")]
    heat12 = sum(r["annual_MWh"] for r in p12)
    vs12 = sum(r["annual"]["variable_speed_end_pressure_MWh"] for r in p12)
    sweep = pump_share_sweep(cfg)
    implied = vs12 / heat12
    lcoh_implied = model.full(C.override(cfg, "eng", "network.pump_share", implied))["fin"]["lcoh"]["utility_7pct"]
    return _rnd(dict(
        meta=dict(source="heatreuse.hydraulics", base_json="outputs/site2.json (not modified)", status="SCREENING, not design"),
        assumptions=dict(delta_T=DELTA_T, pump_eta=PUMP_ETA, motor_drive_eta=MOTOR_DRIVE_ETA, fittings_allowance=FITTINGS,
                         end_head_m=END_HEAD_M, min_flow_floor=MIN_FLOW, velocity_limits_m_s={"DN<=150": V_MAX_SMALL, "DN>150": V_MAX_LARGE},
                         max_friction_pa_m=R_MAX_PA_M, roughness_mm=ROUGHNESS_MM, pipe_material=PIPE_MATERIAL),
        rings=rings,
        phases_1_2=dict(heat_MWh=heat12, pumping_variable_speed_MWh=vs12, implied_pump_share=implied,
                        flat_pump_share=cfg["eng"]["network"]["pump_share"], lcoh_blended_7pct_at_implied_share=lcoh_implied,
                        lcoh_blended_7pct_base=sweep["base_lcoh_blended_7pct"]),
        pump_share_sweep=sweep,
    ))


def _f(v: float, nd: int = 1) -> str:
    return f"{v:,.{nd}f}"


def render_md(h: dict) -> str:
    """docs/hydraulics.md from the hydraulics dict; numbers cite outputs/hydraulics.json keys."""
    R, a, p = h["rings"], h["assumptions"], h["phases_1_2"]
    L = ["# Hydraulics screening: flows, pipe sizes, pump duty and pumping energy", "",
         "Generated by `uv run python -m heatreuse.hydraulics` from `outputs/site2.json` and the model's hourly ring profiles. "
         "Machine-readable twin: `outputs/hydraulics.json` (keys in backticks). Nothing here changes `site2.json` or `config/`.", "",
         "## What about the pumps? (judge Q&A)", "",
         "> **Q: Your model books pumping as a flat 1.5% of heat. What about the pumps?**",
         ">",
         f"> A: We checked it bottom-up. Sizing each ring for its peak flow and pricing 8,760 hours of variable-speed operation gives "
         f"{_f(p['pumping_variable_speed_MWh'], 0)} MWh/yr for phases 1-2, which is {_f(100 * p['implied_pump_share'], 2)}% of delivered heat "
         f"against the flat {_f(100 * p['flat_pump_share'], 1)}% (`phases_1_2.implied_pump_share`). "
         f"At that share blended LCOH moves from ${_f(p['lcoh_blended_7pct_base'])} to ${_f(p['lcoh_blended_7pct_at_implied_share'])}/MWh. "
         f"The corridor's 5 K ambient loop moves {_f(R['corridor']['design_flow_m3_h'], 0)} m3/h at peak, "
         f"{_f(R['corridor']['computed_vs_flat_ratio'], 2)}x its flat allowance (`rings.corridor.computed_vs_flat_ratio`). "
         f"Even at 4x the flat figure (6%), blended LCOH rises by only ${h['pump_share_sweep']['rows'][-1]['delta_vs_base_usd_mwh']:.2f}/MWh (`pump_share_sweep`). "
         "Pumps are a small cost but a large controls lever: variable speed and a held delta-T are what keep them small.", "",
         "## Formulas", "",
         "- Design flow: `Q = P_peak / (rho * cp * dT)` (m3/s); water properties at the mean of supply and return.",
         "- Friction: Darcy-Weisbach `dp/L = f/D * rho * v^2 / 2`, `f` from Swamee-Jain `f = 0.25 / [log10(eps/(3.7 D) + 5.74/Re^0.9)]^2`, `Re = v D / nu`.",
         f"- Pipe size: smallest standard DN with `v <= {a['velocity_limits_m_s']['DN<=150']}` m/s (DN<=150) or `<= {a['velocity_limits_m_s']['DN>150']}` m/s (larger) and friction `<= {_f(a['max_friction_pa_m'], 0)}` Pa/m.",
         f"- Head: `H = 2 * sum(dp_seg) * (1 + {a['fittings_allowance']}) / (rho g) + H_end`; factor 2 = supply + return over the critical path; `H_end = {a['end_head_m']}` m.",
         f"- Tapered branch: flow falls linearly to zero as homes tap off, so friction integrates to `L/3` at entry flow (dp ~ Q^2).",
         f"- Shaft power: `P_shaft = rho g Q H / eta_pump`, `eta_pump = {a['pump_eta']}`; electrical `= P_shaft / {a['motor_drive_eta']}` (motor + drive).",
         f"- Annual energy, hourly from the model (`x_t = load_t / peak`, flow follows load at constant dT, floor {a['min_flow_floor']}):",
         "  - constant speed: `P_el,design * 8760` (throttled or bypassed; upper bound);",
         "  - variable speed, pure affinity: `sum P_el,design * max(x,0.2)^3` (lower bound, assumes zero control head);",
         "  - variable speed, end-pressure control (**reported value**): `sum P_el,design * x * (h_end + (1 - h_end) x^2)`, `h_end = H_end / H_design`.", "",
         "## Assumptions (all ASSUMPTION unless stated)", "",
         "| Item | Value |", "|---|---|"]
    for k, v in a["delta_T"].items():
        L.append(f"| Delta-T `{k}` | {v['supply_c']:g}/{v['return_c']:g} C: {v['basis']} |")
    L += [f"| Pump efficiency | {a['pump_eta']} |", f"| Motor + VSD efficiency | {a['motor_drive_eta']} |",
          f"| Fittings allowance | +{int(100 * a['fittings_allowance'])}% on straight-pipe friction |",
          f"| Plant HX + critical customer allowance | {a['end_head_m']} m |", f"| Variable-speed minimum flow | {int(100 * a['min_flow_floor'])}% of design |",
          f"| Roughness | steel {a['roughness_mm']['steel']} mm, HDPE {a['roughness_mm']['hdpe']} mm |",
          "| Pipe inner diameters | EN 253 pre-insulated steel service pipe, standard wall (used for the HDPE loop too) |",
          f"| Max friction gradient | {_f(a['max_friction_pa_m'], 0)} Pa/m (common district-heating sizing guide) |",
          "| Critical path | on-site: whole 0.5 km main; corridor: 3 km trunk + one of 2 tapered distribution branches; town: 11 km main + 3 km spur at full flow |",
          "| Design load | ring `peak_MW` from site2.json (customer heat). For the corridor this is conservative: the loop carries source heat, ~(1 - 1/COP) of it |", "",
          "## Results per ring (`rings.<id>`)", "",
          "| Ring | dT K | Flow m3/h | Flow L/s | Critical-path DN (v m/s) | Head m | Shaft kW | Const. speed MWh/yr | Var. speed MWh/yr | Flat 1.5% MWh/yr | Computed / flat | % of heat (VS) |",
          "|---|---|---|---|---|---|---|---|---|---|---|---|"]
    for k, r in R.items():
        dn = ", ".join(f"DN{s['DN']} ({s['velocity_m_s']:.2f})" for s in r["segments"])
        an = r["annual"]
        L.append(f"| `{k}` | {r['delta_T_K']:g} | {_f(r['design_flow_m3_h'], 0)} | {_f(r['design_flow_L_s'], 1)} | {dn} | {_f(r['head_m'])} | {_f(r['shaft_kW'])} | "
                 f"{_f(an['constant_speed_MWh'], 0)} | {_f(an['variable_speed_end_pressure_MWh'], 0)} | {_f(r['flat_pump_share_MWh'], 0)} | "
                 f"{_f(r['computed_vs_flat_ratio'], 2)} | {_f(r['pumping_pct_of_heat_variable_speed'], 2)}% |")
    L += ["", "Variable-speed pure-affinity lower bound (`rings.<id>.annual.variable_speed_affinity_MWh`): "
          + ", ".join(f"{k} {_f(r['annual']['variable_speed_affinity_MWh'], 0)} MWh" for k, r in R.items()) + ".", "",
          "**Duty points** (`rings.<id>.duty_point`, product class only):", ""]
    for k, r in R.items():
        d = r["duty_point"]
        L.append(f"- `{k}`: {_f(d['flow_m3_h'], 0)} m3/h at {_f(d['head_m'])} m. {d['product_class']}.")
    c = R["corridor"]
    L += ["", "### Is the corridor's low-delta-T loop under-counted?", "",
          f"The 5 K ambient loop needs {_f(c['design_flow_m3_h'] / R['onsite']['design_flow_m3_h'] * R['onsite']['peak_MW'] / c['peak_MW'], 1)}x the flow per MW of the 20 K campus loop. "
          f"Computed variable-speed pumping is {_f(c['annual']['variable_speed_end_pressure_MWh'], 0)} MWh/yr vs the flat {_f(c['flat_pump_share_MWh'], 0)} MWh/yr "
          f"(ratio {_f(c['computed_vs_flat_ratio'], 2)}); at constant speed it would be {_f(c['annual']['constant_speed_MWh'], 0)} MWh/yr "
          f"({_f(c['pumping_pct_of_heat_constant_speed'], 1)}% of corridor heat). "
          + ("So yes: under constant-speed operation the flat 1.5% under-counts the corridor; with variable speed it is within the allowance. "
             if c["computed_vs_flat_ratio"] <= 1 < c["pumping_pct_of_heat_constant_speed"] / 1.5 else
             "So the flat 1.5% under-counts the corridor at the design-intent delta-T. " if c["computed_vs_flat_ratio"] > 1 else
             "So the flat 1.5% is not under-counted for the corridor, even at 5 K. ")
          + "Per-home circulators on the building heat pumps are not in this count (they sit in the building HP electricity).", "",
          "## Pump-share sensitivity (`pump_share_sweep`)", "",
          "Config is untouched; each row re-runs the full model with `network.pump_share` overridden in memory.", "",
          "| pump_share | Blended LCOH 7% $/MWh | Delta vs base | Corridor LCOH 7% |", "|---|---|---|---|"]
    for r in h["pump_share_sweep"]["rows"]:
        L.append(f"| {r['pump_share'] * 100:g}% | {_f(r['lcoh_blended_7pct'], 2)} | {r['delta_vs_base_usd_mwh']:+.2f} | {_f(r['lcoh_corridor_7pct'], 1)} |")
    L += ["", "## The Grundfos angle", "",
          "Pumping is cheap here only if it is run well, and that is a controls problem more than a hardware one. "
          "(1) **Variable speed** on every circulation duty: the hourly profile shows constant-speed pumping costs several times the variable-speed figure, because average flow is only about a quarter of design flow (full-load-equivalent hours: " + ", ".join(f"{k} {_f(r['annual']['full_load_equivalent_hours'], 0)} h" for k, r in R.items()) + " of 8,760). "
          "(2) **Delta-T management**: flow, and so pump power (~cube of flow), rises fast when delta-T collapses; the 5 K corridor loop is the most exposed, since losing 1 K of a 5 K delta-T is a 25% flow increase and ~95% more pump power. "
          "(3) **Low return temperature** on the campus and town loops widens delta-T, cuts flow and lets the DC-side exchanger recover more heat. "
          "(4) **The 8,760-h model as commissioning baseline**: the hourly flows and heads in this file are the expected trajectory; metered flow, delta-T and kWh per MWh delivered should be trended against it from day one. "
          "(5) **Delta-T drift clause** in the Heat Supply Agreement: if the seasonal average delta-T at a customer falls more than an agreed margin below design intent, the operator may require remediation (substation tuning, valve replacement) or apply a pumping surcharge.", "",
          "## Limits: screening, not design", "",
          "- Single critical path per ring with assumed branch topology; no network solver, no looped-network flow split, no elevation (Lansing's lakeshore to ridge relief will add static head on the town main).",
          "- Peak flow from customer heat at a fixed design delta-T; real delta-T varies hour to hour.",
          "- DN chosen by velocity and Pa/m rules on steel inner diameters; HDPE SDR wall thickness, insulation class and pressure rating not checked. A 14 km town main with this head needs booster stations and a pressure-class check.",
          "- Constant pump and drive efficiency; real part-load efficiency falls at low speed, so the affinity value is a lower bound.",
          "- Building-side circulators and the DC-side cooling loop are outside this scope.",
          "- Pump capex is already in the model's `pump_plant_usd_kw` line; this file checks only energy and duty.", ""]
    return "\n".join(L)


def main() -> None:
    """Write outputs/hydraulics.json and docs/hydraulics.md."""
    h = build()
    OUT.mkdir(exist_ok=True)
    (OUT / "hydraulics.json").write_text(json.dumps(h, indent=2), encoding="utf-8")
    DOC.write_text(render_md(h), encoding="utf-8")
    for k, r in h["rings"].items():
        print("%-9s Q %7.1f m3/h  H %6.1f m  shaft %6.1f kW  CS %7.0f  VS %6.0f  flat %5.0f MWh  ratio %.2f  %.2f%% of heat"
              % (k, r["design_flow_m3_h"], r["head_m"], r["shaft_kW"], r["annual"]["constant_speed_MWh"],
                 r["annual"]["variable_speed_end_pressure_MWh"], r["flat_pump_share_MWh"], r["computed_vs_flat_ratio"], r["pumping_pct_of_heat_variable_speed"]))
    p = h["phases_1_2"]
    print("phases 1-2 implied pump_share %.4f -> LCOH7 %.2f (base %.2f)" % (p["implied_pump_share"], p["lcoh_blended_7pct_at_implied_share"], p["lcoh_blended_7pct_base"]))
    print("Wrote", OUT / "hydraulics.json", "and", DOC)


if __name__ == "__main__":
    main()

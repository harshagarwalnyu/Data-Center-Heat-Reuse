"""Independent re-check of headline numbers. Reads config/*.yaml and outputs/*.json only (no model import).
Run from repo root: python docs/reverify_check.py
Flags any mismatch greater than 1 percent."""
import json
import math
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
eng = yaml.safe_load((ROOT / "config/engineering.yaml").read_text(encoding="utf-8"))
fin = yaml.safe_load((ROOT / "config/finance.yaml").read_text(encoding="utf-8"))
imp = yaml.safe_load((ROOT / "config/impact.yaml").read_text(encoding="utf-8"))
S = json.loads((ROOT / "outputs/site2.json").read_text(encoding="utf-8"))
A = json.loads((ROOT / "outputs/analysis_detail.json").read_text(encoding="utf-8"))
H = json.loads((ROOT / "outputs/hydraulics.json").read_text(encoding="utf-8"))

bad = []


def chk(name, mine, theirs, tol=0.01):
    rel = abs(mine - theirs) / max(abs(theirs), 1e-12)
    flag = "OK  " if rel <= tol else "FLAG"
    if rel > tol:
        bad.append(name)
    print(f"{flag} {name:58s} recomputed={mine:14.4f} json={theirs:14.4f} rel={rel*100:6.3f}%")


def crf(r, n):
    return r * (1 + r) ** n / ((1 + r) ** n - 1)


sup = eng["supply"]
# 1. heat available (simple product 780.5 vs hourly model 777.6: 0.4%, hourly-model difference, not an error)
gwh = sup["it_load_mw"] * sup["load_factor"] * sup["capture_fraction"] * sup["capture_availability"] * 8760 / 1000
chk("heat available GWh (150x0.8x0.75x0.99x8760)", gwh, S["supply"]["heat_available_GWh"])
chk("heat available MW avg", gwh * 1000 / 8760, S["supply"]["heat_available_MW_avg"])

# 2. demand
ring = {r["id"]: r for r in S["rings"]}
dem = ring["onsite"]["annual_MWh"] + ring["corridor"]["annual_MWh"]
chk("demand on-site+corridor MWh", dem, S["totals"]["heat_delivered_MWh"])
chk("demand share of available %", dem / (gwh * 1000) * 100, S["totals"]["share_of_available_pct"])
chk("corridor demand = 500 homes x 27 MWh", eng["corridor"]["homes"] * eng["corridor"]["mwh_per_home"] * 1.0,
    ring["corridor"]["annual_MWh"], 0.0001)  # model nets nothing; uptake applies to signed homes, see report

# 3. propane, tariff, savings
p = fin["prices"]
prop = p["propane_usd_gal"] / p["propane_kwh_gal"] / p["eff"]["propane"] * 1000
chk("propane $/MWh", prop, S["finance"]["incumbent_usd_mwh"]["propane"])
tariff = (1 - fin["tariff"]["discount_vs_propane"]) * prop
chk("tariff 0.8 x propane", tariff, S["finance"]["tariff_usd_mwh"])
chk("household savings 27 x (propane - tariff)", 27 * (prop - tariff), S["finance"]["household"]["savings_vs_propane_usd"])
oil = p["oil_usd_gal"] / p["oil_kwh_gal"] / p["eff"]["oil"] * 1000
chk("oil $/MWh", oil, S["finance"]["incumbent_usd_mwh"]["heating_oil"])
gas = p["gas_usd_therm"] / 29.307 / p["eff"]["gas"] * 1000
chk("gas $/MWh", gas, S["finance"]["incumbent_usd_mwh"]["natural_gas"])
chk("low-income tariff 0.65 x propane", 0.65 * prop, S["finance"]["low_income_tariff_usd_mwh"])
chk("oil household savings", 27 * (oil - tariff), S["finance"]["household"]["savings_vs_oil_usd"])

# 4. COP formula (Carnot fraction, 3K approach each side, clip 2..6), spot checks only
hp = eng["hp"]


def cop(sink, src):
    lift = (sink + 273.15) - (src + 273.15) + 2 * hp["approach_k"]
    return min(max(hp["eta"] * (sink + 273.15) / lift, hp["cop_min"]), hp["cop_max"])


print("INFO COP spot: sink 45 src 20 ->", round(cop(45, 20), 2), "| sink 35 src 15 ->", round(cop(35, 15), 2),
      "| sink 55 src 15 ->", round(cop(55, 15), 2), "| sink 65 src 50 ->", round(cop(65, 50), 2))
print("INFO avg COP in JSON (hourly weighted, not re-derivable without weather):", S["totals"]["avg_cop"])
chk("hp_elec MWh ~ corridor MWh / avg COP (corridor-only HPs)", ring["corridor"]["annual_MWh"] / S["totals"]["avg_cop"],
    S["totals"]["hp_elec_MWh"], 0.02)

# 5. capex
lines = S["finance"]["capex_musd"]["lines"]
chk("capex lines sum = total", sum(x["musd"] for x in lines), S["finance"]["capex_musd"]["total"])
sub = sum(x["musd"] for x in lines if "Soft" not in x["item"] and "Contingency" not in x["item"])
chk("soft cost = 15% of subtotal", sub * fin["capex"]["soft_cost_pct"], [x for x in lines if "Soft" in x["item"]][0]["musd"])
chk("contingency = 20% of subtotal", sub * fin["capex"]["contingency_pct"], [x for x in lines if "Contingency" in x["item"]][0]["musd"])
c = fin["capex"]
chk("corridor pipe 20.9 km x $450/m", 20.9 * 1000 * c["loop_pipe_usd_m"] / 1e6, [x for x in lines if "Corridor" in x["item"]][0]["musd"])
chk("building HPs 500 x $16k", 500 * c["building_hp_usd"] / 1e6, [x for x in lines if "Building" in x["item"]][0]["musd"])
chk("laterals 500 x $2.5k", 500 * c["lateral_usd"] / 1e6, [x for x in lines if "laterals" in x["item"]][0]["musd"])
chk("on-site pipe 0.5 km x $900/m", 0.5 * 1000 * c["onsite_pipe_usd_m"] / 1e6, [x for x in lines if "On-site distribution" in x["item"]][0]["musd"])
chk("tank 5558 m3 x $300", S["totals"]["storage_m3"] * c["tank_usd_m3"] / 1e6, [x for x in lines if "tank" in x["item"]][0]["musd"])

# 6. LCOH with separate asset lives (pipe 30, tank 30, equip 20), shared lines split by energy share
life = fin["life_years"]
rb = A["ring_breakdown"]["rings"]
esh = {k: v["energy_share_pct"] / 100 for k, v in rb.items()}


def cls(item):
    i = item.lower()
    if "pipe" in i or "lateral" in i:
        return "pipe"
    if "tank" in i:
        return "tank"
    return "equip"


def ring_of(item):
    i = item.lower()
    if i.startswith("on-site"):
        return "onsite"
    if i.startswith(("corridor", "building", "service")):
        return "corridor"
    return "shared"


mult = 1 + fin["capex"]["soft_cost_pct"] + fin["capex"]["contingency_pct"]
base = {r: {"pipe": 0.0, "tank": 0.0, "equip": 0.0} for r in esh}
for x in lines:
    if "Soft" in x["item"] or "Contingency" in x["item"]:
        continue
    r = ring_of(x["item"])
    for rr in esh:
        if r == "shared":
            base[rr][cls(x["item"])] += x["musd"] * 1e6 * esh[rr]
        elif r == rr:
            base[rr][cls(x["item"])] += x["musd"] * 1e6
for r in base:
    for k in base[r]:
        base[r][k] *= mult
    chk(f"ring capex {r} $M (shared split by energy share)", sum(base[r].values()) / 1e6, rb[r]["capex_musd"], 0.03)

D = {r: ring[r]["annual_MWh"] for r in esh}
for key, rate in fin["discount_rates"].items():
    ann = {r: sum(v * crf(rate, life[k]) for k, v in base[r].items()) for r in base}
    # JSON gives total opex only; blended LCOH check
    tot = (sum(ann.values()) + S["finance"]["opex_musd_yr"] * 1e6) / sum(D.values())
    chk(f"blended LCOH {key} (separate lives)", tot, S["finance"]["lcoh_usd_mwh"][key], 0.01)
    if key == "utility_7pct":
        ann7 = ann
# per-ring LCOH: back out ring opex from reported ring LCOH and compare sum with total opex
imp_opex = sum(S["extras"]["ring_lcoh_usd_mwh"][r] * D[r] - ann7[r] for r in esh) / 1e6
chk("sum of implied ring opex = total opex $M", imp_opex, S["finance"]["opex_musd_yr"], 0.02)
single = (S["finance"]["capex_musd"]["total"] * 1e6 * crf(0.07, 30) + S["finance"]["opex_musd_yr"] * 1e6) / sum(D.values())
print(f"INFO naive single-life 30yr LCOH 7% = {single:.1f} (differs from model {S['finance']['lcoh_usd_mwh']['utility_7pct']}; "
      f"equipment 20yr CRF {crf(0.07,20):.4f} vs 30yr {crf(0.07,30):.4f})")
print(f"INFO CRF 7%/30 = {crf(0.07,30):.4f}, 7%/20 = {crf(0.07,20):.4f}")

# 7. funding gap, annuitised, % of DC capex
f = S["extras"]["cba"]
chk("whole gap = corridor gap - onsite surplus", f["corridor_standalone_gap_musd"] - 4.3, S["extras"]["funding"]["npv7_musd"] * -1, 0.01)
ann_gap = 26.01 * 1e6 * crf(0.07, 30) / 1e6
chk("annuitised gap 26.01M at 7%/30yr", ann_gap, f["headline_annuitized_7pct_musd_per_yr"])
dcc = eng["supply"]["it_load_mw"] * fin["cba"]["dc_capex_usd_per_mw_it"] / 1e6
chk("DC capex $M = 150 x 10", dcc, f["dc_capex_musd"] if "dc_capex_musd" in f else 1500)
chk("PV gap 26.01 / 1500 = 1.73% (JSON label as_pct_of_dc_capex)", 26.01 / dcc * 100, f["whole_project_as_pct_of_dc_capex"])
print(f"INFO annuitised 2.096M/yr is {2.096/dcc*100:.2f}% of $1,500M, NOT 1.73%. 1.73% is the PV gap (26.01M) over DC capex. Text pairing per-year with 1.7% is mislabelled.")

# 8. CO2 / cars
chk("cars = CO2 / 4.29", S["impact"]["co2_avoided_t_yr"] / (imp["kg_co2_per_car_yr"] / 1000), S["impact"]["co2_cars_equiv"])
chk("ring CO2 sum = headline", sum(v["co2_avoided_t_yr"] for v in rb.values()), S["impact"]["co2_avoided_t_yr"], 0.001)

# 9. Monte Carlo + headline_check
st = A["monte_carlo"]["stats"]["lcoh_blended_7pct"]
print("INFO MC P10/P50/P90 =", st["P10"], st["P50"], st["P90"])
chk("MC P50 within 2% of deterministic 106.1", st["P50"], S["finance"]["lcoh_usd_mwh"]["utility_7pct"], 0.02)
for k, v in A["headline_check"].items():
    chk(f"analysis_detail.headline_check.{k}", v["model"], v["site2_json"], 0.01)

# 10. tornado
for t in S["finance"]["tornado"]:
    ok = min(t["low"], t["high"]) <= t["base"] <= max(t["low"], t["high"])
    print(("OK  " if ok else "FLAG"), "tornado", t["driver"], t["low"], t["base"], t["high"])
    if not ok:
        bad.append("tornado " + t["driver"])
print("INFO tornado dc_it_mw swing is zero (LCOH insensitive to IT MW by design):", S["finance"]["tornado"][-1])

# 11. monthly sums
m = S["monthly"]
chk("monthly demand sum = totals", sum(x["demand_MWh"] for x in m), S["totals"]["heat_delivered_MWh"], 0.01)
chk("monthly delivered+backup ~ demand", sum(x["delivered_MWh"] for x in m), A["monthly"]["annual"]["delivered_MWh"], 0.01)
chk("monthly supply sum ~ available MWh", sum(x["supply_MWh"] for x in m), gwh * 1000, 0.01)
chk("monthly backup sum", sum(x["backup_MWh"] for x in m), S["totals"]["backup_MWh"], 0.01)

# 12. hydraulics
hp12 = H["phases_1_2"]
chk("hydraulics implied pump share = MWh/heat", hp12["pumping_variable_speed_MWh"] / hp12["heat_MWh"], hp12["implied_pump_share"], 0.01)
print("INFO implied pump share %:", round(hp12["implied_pump_share"] * 100, 2))

# 13. dc exit
print("INFO dc_exit", S["finance"]["dc_exit"]["stranded_musd"], S["finance"]["dc_exit"]["replacement_source_musd"],
      S["finance"]["dc_exit"]["corridor_cost_uplift_usd_mwh"])
# town
print("INFO town ring LCOH", ring["town"]["lcoh_usd_mwh_7pct"], "| with_town blended", S["extras"]["with_town"]["lcoh_usd_mwh"])
print("\nFLAGGED:", bad if bad else "none")

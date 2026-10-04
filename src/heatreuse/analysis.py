"""Detailed analysis on top of the base model (does NOT touch site2.json).

CLI: ``uv run python -m heatreuse.analysis`` -> outputs/analysis_detail.json + docs/analysis-detail.md

Sections
--------
* ``monte_carlo``: seeded uncertainty propagation through the FULL 8,760-hour model
  (simulate -> dispatch -> finance -> impact re-run for every draw, no surrogate).
* ``monthly`` / ``seasonal``: delivered heat, backup, heat-pump electricity, COP, storage state of charge.
* ``rings``: per-ring energy, peak, capex share, LCOH and CO2 share.
* ``load_duration``: hours above 50% / 80% of peak and the peak hour.

Every input change is an in-memory ``config.override``; config/*.yaml is never written.
"""
from __future__ import annotations

import json
from typing import Any

import numpy as np
import pandas as pd

from . import config as C, finance, model, weather
from .config import ROOT

OUT = ROOT / "outputs"
DOC = ROOT / "docs" / "analysis-detail.md"

SEED = 20261004
N_DRAWS = 500
PCTS = (10, 50, 90)


# ----------------------------------------------------------------------------- input distributions
def input_specs(cfg: dict) -> list[dict[str, Any]]:
    """Uncertain inputs sampled in the Monte Carlo, with distribution and provenance of the range.

    All triangular distributions use the config base value as the mode, so the P50 should sit near
    the deterministic headline. The discount rate is uniform (no preferred rate inside 4-10%).
    """
    f, e = cfg["fin"], cfg["eng"]
    t = f["tornado"]
    pipe_lo, pipe_hi = t["pipe_cost"]
    p_lo, p_hi = f["prices"]["propane_usd_gal_range"]  # finance.yaml, NYSERDA season range
    return [
        dict(key="capture_fraction", dist="triangular", low=0.40, mode=e["supply"]["capture_fraction"], high=0.85,
             unit="share", basis="engineering.yaml supply.capture_fraction [A]: base 0.75, scenarios 0.40 and 0.85"),
        dict(key="elec_price_usd_kwh", dist="triangular", low=t["elec_price"][0], mode=f["elec_price_usd_kwh"], high=t["elec_price"][1],
             unit="$/kWh residential", basis="finance.yaml tornado.elec_price; central (industrial) rate scaled by the same ratio, as in the tornado"),
        dict(key="building_hp_usd", dist="triangular", low=f["capex"]["building_hp_usd"] * pipe_lo, mode=f["capex"]["building_hp_usd"],
             high=f["capex"]["building_hp_usd"] * pipe_hi, unit="$/home",
             basis="finance.yaml capex.building_hp_usd [A]; no range in config, so the tornado capex multiplier %.1fx-%.1fx is reused" % (pipe_lo, pipe_hi)),
        dict(key="loop_pipe_usd_m", dist="triangular", low=f["capex"]["loop_pipe_usd_m"] * pipe_lo, mode=f["capex"]["loop_pipe_usd_m"],
             high=f["capex"]["loop_pipe_usd_m"] * pipe_hi, unit="$/m", basis="finance.yaml capex.loop_pipe_usd_m [A] x tornado.pipe_cost"),
        dict(key="uptake", dist="triangular", low=t["uptake"][0], mode=e["corridor"]["uptake"], high=t["uptake"][1], unit="share",
             basis="engineering.yaml corridor.uptake [A] x tornado.uptake; homes = potential x uptake, pipe held at potential (as the tornado)"),
        dict(key="discount_rate", dist="uniform", low=t["discount_rate"][0], high=t["discount_rate"][1], unit="rate",
             basis="finance.yaml tornado.discount_rate (4% co-op to 10% private)"),
        dict(key="propane_usd_gal", dist="triangular", low=p_lo, mode=f["prices"]["propane_usd_gal"], high=p_hi, unit="$/gal",
             basis="finance.yaml prices.propane_usd_gal: NYSERDA Central NY 2025-26 season range %g-%g, base %.2f" % (p_lo, p_hi, f["prices"]["propane_usd_gal"])),
    ]


def sample_inputs(cfg: dict, n: int = N_DRAWS, seed: int = SEED) -> list[dict[str, float]]:
    """Draw ``n`` input vectors with a fixed seed (one Generator, specs sampled in a fixed order)."""
    rng = np.random.default_rng(seed)
    cols = {}
    for s in input_specs(cfg):
        if s["dist"] == "triangular":
            cols[s["key"]] = rng.triangular(s["low"], s["mode"], s["high"], n)
        else:
            cols[s["key"]] = rng.uniform(s["low"], s["high"], n)
    return [{k: float(v[i]) for k, v in cols.items()} for i in range(n)]


def apply_draw(cfg: dict, x: dict[str, float]) -> dict:
    """Return a config copy with one draw's physical/cost inputs applied (discount rate handled in finance)."""
    c = C.override(cfg, "eng", "supply.capture_fraction", x["capture_fraction"])
    ratio = x["elec_price_usd_kwh"] / cfg["fin"]["elec_price_usd_kwh"]
    c = C.override(c, "fin", "elec_price_usd_kwh", x["elec_price_usd_kwh"])
    c = C.override(c, "fin", "elec_price_central_usd_kwh", cfg["fin"]["elec_price_central_usd_kwh"] * ratio)
    c = C.override(c, "fin", "capex.building_hp_usd", x["building_hp_usd"])
    c = C.override(c, "fin", "capex.loop_pipe_usd_m", x["loop_pipe_usd_m"])
    potential = cfg["eng"]["corridor"]["homes"] / cfg["eng"]["corridor"]["uptake"]
    c = C.override(c, "eng", "corridor.uptake", x["uptake"])
    c = C.override(c, "eng", "corridor.homes", potential * x["uptake"])
    c = C.override(c, "fin", "prices.propane_usd_gal", x["propane_usd_gal"])
    return c


def _evaluate_draw(cfg: dict, x: dict[str, float], T: np.ndarray) -> dict[str, float]:
    """Full 8,760 h run for one draw at 7%, plus a finance-only re-evaluation at the sampled rate.

    The discount rate does not enter simulate/dispatch, so re-running finance.evaluate on the same
    ``sim`` with ``utility_7pct`` replaced by the sampled rate is exact, not an approximation.
    """
    c = apply_draw(cfg, x)
    r = model.full(c, T=T)
    fin, imp = r["fin"], r["imp"]
    c_r = C.override(c, "fin", "discount_rates.utility_7pct", x["discount_rate"])
    fin_r = finance.evaluate(c_r, r["sim"])
    propane = fin["incumbents"]["propane"]
    return dict(
        lcoh_blended_7pct=fin["lcoh"]["utility_7pct"],
        lcoh_corridor_7pct=fin["lcoh_ring"]["corridor"],
        funding_gap_7pct_musd=fin["funding_gap_musd"],
        npv_7pct_musd=fin["npv7"] / 1e6,
        lcoh_blended_sampled_rate=fin_r["lcoh"]["utility_7pct"],
        lcoh_corridor_sampled_rate=fin_r["lcoh_ring"]["corridor"],
        funding_gap_sampled_rate_musd=fin_r["funding_gap_musd"],
        co2_avoided_t_yr=imp["co2_avoided_t_yr"],
        delivered_MWh=fin["D"],
        propane_usd_mwh=propane,
    )


def _pct(v: np.ndarray) -> dict[str, float]:
    p = np.percentile(v, PCTS)
    return dict(P10=round(float(p[0]), 2), P50=round(float(p[1]), 2), P90=round(float(p[2]), 2),
                mean=round(float(v.mean()), 2), min=round(float(v.min()), 2), max=round(float(v.max()), 2))


def monte_carlo(cfg: dict, T: np.ndarray, n: int = N_DRAWS, seed: int = SEED) -> dict:
    """Seeded Monte Carlo through the full hourly model. Returns percentiles and probabilities."""
    draws = sample_inputs(cfg, n, seed)
    rows = [_evaluate_draw(cfg, x, T) for x in draws]
    df = pd.DataFrame(rows)
    stats = {k: _pct(df[k].to_numpy()) for k in df.columns}
    below = df["lcoh_blended_7pct"] < df["propane_usd_mwh"]
    below_r = df["lcoh_blended_sampled_rate"] < df["propane_usd_mwh"]
    xin = pd.DataFrame(draws)
    # Spearman rank correlation of each input with blended LCOH at the sampled rate (which input drives spread)
    rank_y = df["lcoh_blended_sampled_rate"].rank()
    drivers = {k: round(float(np.corrcoef(xin[k].rank(), rank_y)[0, 1]), 3) for k in xin.columns}
    return dict(
        n_draws=n, seed=seed, method="full_8760h_model_per_draw",
        method_note=("Every draw re-runs simulate -> dispatch -> finance -> impact on the TMYx weather year; "
                     "'_7pct' metrics hold the discount rate at the 7% headline basis, '_sampled_rate' metrics re-run "
                     "finance on the same dispatch with the draw's discount rate (exact: the rate does not enter dispatch)."),
        inputs=input_specs(cfg),
        stats=stats,
        prob_blended_lcoh_below_propane_7pct=round(float(below.mean()), 3),
        prob_blended_lcoh_below_propane_sampled_rate=round(float(below_r.mean()), 3),
        prob_funding_gap_zero_7pct=round(float((df["funding_gap_7pct_musd"] <= 0).mean()), 3),
        spearman_vs_lcoh_blended_sampled_rate=dict(sorted(drivers.items(), key=lambda kv: -abs(kv[1]))),
    )


# ----------------------------------------------------------------------------- hourly detail
SEASONS = {"winter_DJF": (12, 1, 2), "spring_MAM": (3, 4, 5), "summer_JJA": (6, 7, 8), "fall_SON": (9, 10, 11)}


def _hourly_series(base: dict) -> dict[str, np.ndarray]:
    """Per-hour series used by monthly/seasonal tables, with the same definitions as report._totals."""
    d, R = base["sim"]["disp"], base["sim"]["rings"]
    delivered = d["D"] * d["f"]
    backup = d["D"] * (1 - d["f"])
    hp_heat = sum(((R[r]["D"] if r == "corridor" else R[r]["D"] + R[r]["L"]) * d["f"]) for r in d["active"] if r != "onsite")
    return dict(demand=d["D"], delivered=delivered, backup=backup, hp_elec=d["e_served"], hp_heat=hp_heat,
                soc_pct=100 * d["soc"] / d["cap_mwh"])


def _period_row(h: dict[str, np.ndarray], i: np.ndarray) -> dict[str, float]:
    el = float(h["hp_elec"][i].sum())
    soc = h["soc_pct"][i]
    return dict(demand_MWh=round(float(h["demand"][i].sum()), 1), delivered_MWh=round(float(h["delivered"][i].sum()), 1),
                backup_MWh=round(float(h["backup"][i].sum()), 1), hp_elec_MWh=round(el, 1),
                avg_cop=round(float(h["hp_heat"][i].sum()) / el, 2) if el > 0 else None,
                soc_mean_pct=round(float(soc.mean()), 1), soc_min_pct=round(float(soc.min()), 1),
                hours_storage_below_50pct=int((soc < 50).sum()))


def monthly_detail(base: dict) -> dict:
    """Monthly and seasonal rows plus annual totals (monthly rows sum to the annual totals)."""
    h = _hourly_series(base)
    m = weather.months()
    months = [dict(month=k, **_period_row(h, m == k)) for k in range(1, 13)]
    seasons = {name: _period_row(h, np.isin(m, ms)) for name, ms in SEASONS.items()}
    annual = _period_row(h, np.ones(len(m), dtype=bool))
    soc = h["soc_pct"]
    soc_dist = dict(percentiles_pct={f"P{p}": round(float(np.percentile(soc, p)), 1) for p in (1, 5, 10, 25, 50, 75, 90)},
                    hours_full_ge_99pct=int((soc >= 99).sum()), hours_below_50pct=int((soc < 50).sum()),
                    hours_empty_le_1pct=int((soc <= 1).sum()),
                    histogram_hours={f"{lo}-{lo + 10}%": int(((soc >= lo) & ((soc < lo + 10) if lo < 90 else (soc <= 100.0001))).sum())
                                     for lo in range(0, 100, 10)},
                    capacity_MWh=round(float(base["sim"]["disp"]["cap_mwh"]), 1))
    return dict(months=months, seasons=seasons, annual=annual, storage_soc=soc_dist,
                note="delivered = customer demand x DC-served fraction f; backup = demand x (1-f) (same as site2.json monthly/totals); "
                     "hp_elec = building heat-pump electricity actually served; avg_cop = HP heat served / HP electricity (on-site ring is direct exchange, excluded). "
                     "demand here equals site2.json totals.heat_delivered_MWh (all customer heat, DC plus backup); delivered is the DC-served part.")


def ring_breakdown(cfg: dict, base: dict) -> dict:
    """Per-ring energy, peak, capex share, LCOH(7%) and CO2 share; ring CO2 sums to the impact headline."""
    sim, fin = base["sim"], base["fin"]
    d, R = sim["disp"], sim["rings"]
    im, e = cfg["imp"], cfg["eng"]
    ef = im["ef_kg_kwh"]
    eff = cfg["fin"]["prices"]["eff"]
    effs = {"propane": eff["propane"], "oil": eff["oil"], "gas": eff["gas"]}
    mixes = {"onsite": im["mix_onsite"], "corridor": im["mix_corridor"], "town": im["mix_town"]}
    f = d["f"]
    co2 = {}
    for r in d["active"]:
        total = float(R[r]["D"].sum())
        disp_kg = 0.0
        for fuel, sh in mixes[r].items():
            if fuel in effs:
                disp_kg += total * sh / effs[fuel] * 1000 * ef[fuel]
            elif fuel == "electric":
                disp_kg += total * sh * 1000 * ef["grid"]
        elec = float((R[r]["E"] * f).sum()) + e["network"]["pump_share"] * total
        bk_fuel = float(((R[r]["D"] + R[r]["L"]) * (1 - f)).sum()) / e["backup"]["efficiency"]
        co2[r] = (disp_kg - elec * 1000 * ef["grid"] - bk_fuel * 1000 * ef["propane"]) / 1000
    co2_tot = sum(co2.values())
    capex_tot = sum(fin["capex_ring"].values())
    rings = {}
    for r in d["active"]:
        D = R[r]["D"]
        rings[r] = dict(delivered_MWh=round(float((D * f).sum()), 1), demand_MWh=round(float(D.sum()), 1),
                        peak_MW=round(float(D.max()), 2), peak_dc_draw_MW=round(float(R[r]["S"].max()), 2),
                        capex_musd=round(fin["capex_ring"][r] / 1e6, 2), capex_share_pct=round(100 * fin["capex_ring"][r] / capex_tot, 1),
                        energy_share_pct=round(100 * fin["share"][r], 1), lcoh_7pct_usd_mwh=round(fin["lcoh_ring"][r], 1),
                        co2_avoided_t_yr=round(co2[r], 0), co2_share_pct=round(100 * co2[r] / co2_tot, 1),
                        backup_MWh=round(fin["ring"][r]["backup_mwh"], 1))
    return dict(rings=rings, co2_sum_t_yr=round(co2_tot, 0), co2_headline_t_yr=round(base["imp"]["co2_avoided_t_yr"], 0),
                note="capex includes shared items (tank, DC interface, pumps, backup) split by energy share, then soft cost and contingency pro rata (finance.allocate). "
                     "CO2 per ring = displaced counterfactual fuel - (served HP electricity + pumping) x grid factor - backup propane, the same terms as impact.evaluate.")


def load_duration(base: dict) -> dict:
    """Load-duration statistics on aggregate customer heat demand (MW)."""
    D = base["sim"]["disp"]["D"]
    peak = float(D.max())
    k = int(np.argmax(D))
    ts = pd.Timestamp("2023-01-01") + pd.Timedelta(hours=k)
    srt = np.sort(D)[::-1]
    return dict(peak_MW=round(peak, 2), peak_hour_index=k, peak_hour_calendar=ts.strftime("%b %d %H:00"),
                peak_outdoor_C=round(float(base["sim"]["T"][k]), 1),
                hours_above_50pct_peak=int((D > 0.5 * peak).sum()), hours_above_80pct_peak=int((D > 0.8 * peak).sum()),
                mean_MW=round(float(D.mean()), 2), load_factor=round(float(D.mean() / peak), 3),
                duration_curve_MW={f"h{h}": round(float(srt[h - 1]), 2) for h in (1, 10, 100, 500, 1000, 2000, 4380, 8760)},
                note="Demand is customer heat (on-site + corridor), before pipe losses; the calendar is the 2023 non-leap TMY index.")


def headline_check(base: dict, site2: dict) -> dict:
    """Recompute headline values from the in-memory base run and diff them against site2.json."""
    fin, imp = base["fin"], base["imp"]
    pairs = {
        "lcoh_blended_7pct": (fin["lcoh"]["utility_7pct"], site2["finance"]["lcoh_usd_mwh"]["utility_7pct"]),
        "lcoh_corridor_7pct": (fin["lcoh_ring"]["corridor"], site2["extras"]["ring_lcoh_usd_mwh"]["corridor"]),
        "funding_gap_7pct_musd": (fin["funding_gap_musd"], site2["extras"]["cba"]["headline_gap_musd"]),
        "co2_avoided_t_yr": (imp["co2_avoided_t_yr"], site2["impact"]["co2_avoided_t_yr"]),
        "delivered_MWh": (fin["D"], site2["totals"]["heat_delivered_MWh"]),
        "propane_usd_mwh": (fin["incumbents"]["propane"], site2["finance"]["incumbent_usd_mwh"]["propane"]),
    }
    return {k: dict(model=round(float(a), 2), site2_json=b) for k, (a, b) in pairs.items()}


def build(n: int = N_DRAWS, seed: int = SEED) -> dict:
    """Assemble the full analysis dict (pure: no files written)."""
    cfg = C.load("site2")
    base = model.full(cfg)
    T = base["sim"]["T"]
    site2 = json.loads((OUT / "site2.json").read_text(encoding="utf-8"))
    mc = monte_carlo(cfg, T, n, seed)
    hc = headline_check(base, site2)
    for k, v in hc.items():
        if k in mc["stats"]:
            v["mc_P50"] = mc["stats"][k]["P50"]
    return dict(meta=dict(site=site2["meta"]["site"], source="heatreuse.analysis", base_json="outputs/site2.json (not modified)",
                          weather=base["sim"]["weather_src"]),
                headline_check=hc, monte_carlo=mc, monthly=monthly_detail(base), ring_breakdown=ring_breakdown(cfg, base),
                load_duration=load_duration(base))


# ----------------------------------------------------------------------------- markdown
def _f(v: Any, nd: int = 1) -> str:
    return "n/a" if v is None else (f"{v:,.{nd}f}" if isinstance(v, float) else f"{v:,}" if isinstance(v, int) else str(v))


def render_md(a: dict) -> str:
    """Render docs/analysis-detail.md from the analysis dict; every number cites its JSON key."""
    mc, st = a["monte_carlo"], a["monte_carlo"]["stats"]
    L = ["# Detailed analysis: uncertainty, seasonality, rings, load duration", "",
         "Generated by `uv run python -m heatreuse.analysis` from the same model that writes `outputs/site2.json`. "
         "Machine-readable twin: `outputs/analysis_detail.json`; every number below gives its JSON key. "
         "Nothing here changes the headline numbers in `site2.json`.", "",
         "## 1. Monte Carlo uncertainty (`monte_carlo`)", "",
         f"**Method.** {mc['n_draws']} draws, seed {mc['seed']} (`monte_carlo.seed`). {mc['method_note']} "
         f"No surrogate or held-fixed dispatch was needed: all {mc['n_draws']} draws are exact full-model runs.", "",
         "| Input | Distribution | Low | Mode | High | Basis |", "|---|---|---|---|---|---|"]
    for s in mc["inputs"]:
        L.append(f"| `{s['key']}` ({s['unit']}) | {s['dist']} | {s['low']:g} | {s.get('mode', '-') if s['dist'] == 'uniform' else format(s['mode'], 'g')} | {s['high']:g} | {s['basis']} |")
    L += ["", "Inputs are sampled independently (no correlation assumed).", "",
          "| Metric | P10 | P50 | P90 | Headline (site2.json) | JSON key |", "|---|---|---|---|---|---|"]
    hc = a["headline_check"]
    names = [("lcoh_blended_7pct", "Blended LCOH, 7% ($/MWh)"), ("lcoh_corridor_7pct", "Corridor-ring LCOH, 7% ($/MWh)"),
             ("funding_gap_7pct_musd", "Whole-project funding gap, 7% ($M PV)"), ("co2_avoided_t_yr", "CO2 avoided (t/yr)"),
             ("lcoh_blended_sampled_rate", "Blended LCOH, sampled 4-10% rate ($/MWh)"),
             ("lcoh_corridor_sampled_rate", "Corridor LCOH, sampled rate ($/MWh)"),
             ("funding_gap_sampled_rate_musd", "Funding gap, sampled rate ($M PV)"), ("delivered_MWh", "Heat delivered (MWh/yr)"),
             ("propane_usd_mwh", "Propane-equivalent ($/MWh)")]
    for k, label in names:
        s = st[k]
        h = _f(hc[k]["site2_json"]) if k in hc else "-"
        L.append(f"| {label} | {_f(s['P10'])} | {_f(s['P50'])} | {_f(s['P90'])} | {h} | `monte_carlo.stats.{k}` |")
    L += ["", f"- Probability blended LCOH (7%) is below the draw's propane-equivalent price: **{mc['prob_blended_lcoh_below_propane_7pct']:.1%}** "
              "(`monte_carlo.prob_blended_lcoh_below_propane_7pct`).",
          f"- Same, with the discount rate also uncertain: **{mc['prob_blended_lcoh_below_propane_sampled_rate']:.1%}** "
          "(`monte_carlo.prob_blended_lcoh_below_propane_sampled_rate`).",
          f"- Probability the whole-project funding gap (7%) is zero: {mc['prob_funding_gap_zero_7pct']:.1%} (`monte_carlo.prob_funding_gap_zero_7pct`).",
          "- Rank correlation of each input with blended LCOH at the sampled rate (`monte_carlo.spearman_vs_lcoh_blended_sampled_rate`): "
          + ", ".join(f"`{k}` {v:+.2f}" for k, v in mc["spearman_vs_lcoh_blended_sampled_rate"].items()) + ".", ""]
    L += ["**Tie to the headline.** The P50 and the deterministic headline are listed side by side (`headline_check`). "
          "They need not be equal: the headline is the model at the modal input values, while the P50 is the median of outputs. "
          "Two asymmetries move the P50: (1) the capture-fraction triangle (0.40-0.75-0.85) and the capex triangles (0.7x-1x-1.4x) are skewed, "
          "so the mean input sits away from the mode (capture mean ~0.67, capex mean ~1.03x); "
          "(2) LCOH is convex in uptake (fixed pipe cost spread over fewer homes), so low-uptake draws pull the upper tail out further than high-uptake draws pull it in. "
          "Capture fraction barely matters for cost because heat is oversupplied ~15x (see `monthly`).", ""]
    L += ["| Headline value | Model (recomputed) | site2.json | MC P50 |", "|---|---|---|---|"]
    for k, v in hc.items():
        L.append(f"| `{k}` | {_f(v['model'], 2)} | {_f(v['site2_json'])} | {_f(v.get('mc_P50'))} |")
    m = a["monthly"]
    L += ["", "## 2. Monthly and seasonal detail (`monthly`)", "", m["note"], "",
          "| Month | Demand MWh | Delivered MWh | Backup MWh | HP elec MWh | Avg COP | Storage mean % | Storage min % |",
          "|---|---|---|---|---|---|---|---|"]
    for r in m["months"]:
        L.append(f"| {r['month']} | {_f(r['demand_MWh'], 0)} | {_f(r['delivered_MWh'], 0)} | {_f(r['backup_MWh'], 0)} | {_f(r['hp_elec_MWh'], 0)} | "
                 f"{_f(r['avg_cop'], 2)} | {_f(r['soc_mean_pct'])} | {_f(r['soc_min_pct'])} |")
    an = m["annual"]
    L.append(f"| **Year** (`monthly.annual`) | {_f(an['demand_MWh'], 0)} | {_f(an['delivered_MWh'], 0)} | {_f(an['backup_MWh'], 0)} | "
             f"{_f(an['hp_elec_MWh'], 0)} | {_f(an['avg_cop'], 2)} | {_f(an['soc_mean_pct'])} | {_f(an['soc_min_pct'])} |")
    L += ["", "Rows are `monthly.months[i]`; seasons are `monthly.seasons.<name>`:", "",
          "| Season | Delivered MWh | Backup MWh | HP elec MWh | Avg COP |", "|---|---|---|---|---|"]
    for k, r in m["seasons"].items():
        L.append(f"| `{k}` | {_f(r['delivered_MWh'], 0)} | {_f(r['backup_MWh'], 0)} | {_f(r['hp_elec_MWh'], 0)} | {_f(r['avg_cop'], 2)} |")
    sd = m["storage_soc"]
    L += ["", f"**Storage state of charge** (`monthly.storage_soc`, tank {_f(sd['capacity_MWh'])} MWh): "
              f"full (>=99%) {sd['hours_full_ge_99pct']:,} h, below 50% {sd['hours_below_50pct']:,} h, empty (<=1%) {sd['hours_empty_le_1pct']:,} h. "
              "Percentiles: " + ", ".join(f"{k} {v}%" for k, v in sd["percentiles_pct"].items()) + ". "
              "The tank refills from a ~15x oversupplied source, so it sits full most of the year and only drains during DC outages.", ""]
    rb = a["ring_breakdown"]
    L += ["## 3. Per-ring breakdown (`ring_breakdown.rings.<ring>`)", "", rb["note"], "",
          "| Ring | Delivered MWh | Peak MW | Capex $M | Capex share | Energy share | LCOH 7% $/MWh | CO2 t/yr | CO2 share |",
          "|---|---|---|---|---|---|---|---|---|"]
    for k, r in rb["rings"].items():
        L.append(f"| `{k}` | {_f(r['delivered_MWh'], 0)} | {_f(r['peak_MW'], 2)} | {_f(r['capex_musd'], 2)} | {_f(r['capex_share_pct'])}% | "
                 f"{_f(r['energy_share_pct'])}% | {_f(r['lcoh_7pct_usd_mwh'])} | {_f(r['co2_avoided_t_yr'], 0)} | {_f(r['co2_share_pct'])}% |")
    L += ["", f"Ring CO2 sums to {_f(rb['co2_sum_t_yr'], 0)} t/yr (`ring_breakdown.co2_sum_t_yr`) against the headline "
              f"{_f(rb['co2_headline_t_yr'], 0)} t/yr (`ring_breakdown.co2_headline_t_yr`).", ""]
    ld = a["load_duration"]
    L += ["## 4. Load-duration curve (`load_duration`)", "", ld["note"], "",
          f"- Peak {ld['peak_MW']} MW (`load_duration.peak_MW`) at hour {ld['peak_hour_index']} ({ld['peak_hour_calendar']}, {ld['peak_outdoor_C']} C outdoor; `load_duration.peak_hour_index`).",
          f"- Hours above 50% of peak: {ld['hours_above_50pct_peak']:,} (`load_duration.hours_above_50pct_peak`); above 80%: {ld['hours_above_80pct_peak']:,} (`load_duration.hours_above_80pct_peak`).",
          f"- Mean {ld['mean_MW']} MW, load factor {ld['load_factor']} (`load_duration.load_factor`).",
          "- Duration curve (`load_duration.duration_curve_MW`): " + ", ".join(f"{k} {v} MW" for k, v in ld["duration_curve_MW"].items()) + ".", "",
          "## Limits", "",
          "- One weather year (TMYx); no inter-annual weather variance is sampled.",
          "- Inputs are independent; in reality electricity and propane prices are positively correlated, which would narrow the LCOH-vs-propane spread.",
          "- Ranges come from config scenario and tornado bounds tagged [A]; they are judgement, not fitted distributions.", ""]
    return "\n".join(L)


def main() -> None:
    """Write outputs/analysis_detail.json and docs/analysis-detail.md."""
    a = build()
    OUT.mkdir(exist_ok=True)
    (OUT / "analysis_detail.json").write_text(json.dumps(a, indent=2, default=float), encoding="utf-8")
    DOC.write_text(render_md(a), encoding="utf-8")
    st, mc = a["monte_carlo"]["stats"], a["monte_carlo"]
    for k in ("lcoh_blended_7pct", "lcoh_corridor_7pct", "funding_gap_7pct_musd", "co2_avoided_t_yr", "lcoh_blended_sampled_rate"):
        print("%-30s P10 %10.2f  P50 %10.2f  P90 %10.2f" % (k, st[k]["P10"], st[k]["P50"], st[k]["P90"]))
    print("P(blended LCOH < propane): 7%% %.3f | sampled rate %.3f" % (mc["prob_blended_lcoh_below_propane_7pct"], mc["prob_blended_lcoh_below_propane_sampled_rate"]))
    print("Wrote", OUT / "analysis_detail.json", "and", DOC)


if __name__ == "__main__":
    main()

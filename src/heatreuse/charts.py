"""PNG charts for the deck/app."""
from __future__ import annotations
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from . import report, weather


def _save(fig, path, name):
    path.mkdir(parents=True, exist_ok=True)
    fig.tight_layout()
    fig.savefig(path / name, dpi=140)
    plt.close(fig)


def make(base, with_town, tor, cop, out):
    for which in ("winter", "summer"):
        rows = report._week(base, which)
        h = [r["h"] for r in rows]
        fig, ax = plt.subplots(figsize=(9, 4))
        ax.stackplot(h, [r["delivered_MW"] for r in rows], [r["backup_MW"] for r in rows], labels=["Delivered from data center", "Backup boiler"],
                     colors=["#1b7f5c", "#c8553d"])
        ax.plot(h, [r["demand_MW"] for r in rows], "k--", lw=1, label="Demand")
        ax.set_ylabel("MW"); ax.set_xlabel("Hour of week"); ax.set_title("%s week: heat demand and supply" % which.capitalize())
        ax2 = ax.twinx(); ax2.plot(h, [r["outdoor_C"] for r in rows], color="#2d6cdf", lw=1); ax2.set_ylabel("Outdoor C", color="#2d6cdf")
        ax.legend(loc="upper left", fontsize=8)
        _save(fig, out, "week_%s.png" % which)
    m = report._monthly(base)
    fig, ax = plt.subplots(figsize=(9, 4))
    x = np.arange(12)
    ax.bar(x - 0.2, [r["demand_MWh"] / 1000 for r in m], 0.4, label="Demand (GWh)", color="#1b7f5c")
    ax.bar(x + 0.2, [r["supply_MWh"] / 1000 for r in m], 0.4, label="Data-center heat available (GWh)", color="#bbbbbb")
    ax.set_xticks(x, ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]); ax.set_yscale("log"); ax.legend(); ax.set_title("Supply far exceeds demand every month")
    _save(fig, out, "monthly.png")
    fin = base["fin"]
    inc = {k: v for k, v in fin["incumbents"].items() if not k.startswith("_")}
    fig, ax = plt.subplots(figsize=(9, 4))
    names = ["Heat network (LCOH 7%)", "Network tariff"] + list(inc.keys())
    vals = [fin["lcoh"]["utility_7pct"], fin["tariff"]] + list(inc.values())
    ax.barh(names[::-1], vals[::-1], color=["#999"] * len(inc) + ["#e0a030", "#1b7f5c"])
    ax.set_xlabel("$/MWh of delivered heat"); ax.set_title("Cost of heat vs incumbents")
    _save(fig, out, "lcoh_vs_incumbents.png")
    fig, ax = plt.subplots(figsize=(5, 4))
    ax.bar(["Air-cooled 30 C", "Liquid-cooled 50 C"], [cop["air"], cop["liquid"]], color=["#999", "#1b7f5c"])
    ax.set_ylabel("Annual central heat pump COP (65 C loop)"); ax.set_title("Liquid cooling lifts COP")
    _save(fig, out, "cop_compare.png")
    fig, ax = plt.subplots(figsize=(8, 4))
    base_v = tor[0]["base"]
    for i, t in enumerate(tor[::-1]):
        ax.barh(i, t["high"] - t["low"], left=t["low"], color="#1b7f5c")
    ax.set_yticks(range(len(tor)), [t["driver"] for t in tor[::-1]]); ax.axvline(base_v, color="k", lw=1)
    ax.set_xlabel("LCOH at 7% ($/MWh)"); ax.set_title("Sensitivity tornado")
    _save(fig, out, "tornado.png")
    d = base["sim"]["disp"]
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.plot(np.sort(d["D"])[::-1]); ax.set_xlabel("Hours ranked"); ax.set_ylabel("Demand MW"); ax.set_title("Load duration curve (phases 1-2)")
    _save(fig, out, "load_duration.png")

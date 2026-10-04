"""Hourly dispatch: DC heat -> (direct HX | HPs) -> source-side hot-water tank -> customers; backup covers shortfall."""
from __future__ import annotations
import numpy as np

KWH_PER_M3_K = 1.163  # water, kWh per m3 per K


def dispatch(cfg: dict, A: np.ndarray, rings: dict, active: list[str]) -> dict:
    st, bk = cfg["eng"]["storage"], cfg["eng"]["backup"]
    n = len(A)
    S = sum(rings[r]["S"] for r in active)
    E = sum(rings[r]["E"] for r in active)
    D = sum(rings[r]["D"] for r in active)
    L = sum(rings[r]["L"] for r in active)
    G = D + L
    cap = st["hours_of_peak"] * float(S.max())            # MWh_th
    vol_m3 = cap * 1000.0 / (KWH_PER_M3_K * st["delta_t_k"])
    loss_h = st["loss_per_day"] / 24.0
    max_charge = cap / st["charge_hours"]
    soc = np.zeros(n)
    direct = np.zeros(n); disch = np.zeros(n); charge = np.zeros(n); tloss = np.zeros(n)
    f = np.ones(n)
    s_prev = cap
    for t in range(n):
        lo = s_prev * loss_h
        s = s_prev - lo
        tloss[t] = lo
        d = min(A[t], S[t])
        need = S[t] - d
        dc = min(need, s)
        s -= dc
        f[t] = (d + dc) / S[t] if S[t] > 0 else 1.0
        ch = min(max(A[t] - d, 0.0), max_charge, cap - s)
        s += ch
        direct[t], disch[t], charge[t], soc[t] = d, dc, ch, s
        s_prev = s
    backup_gate = (1 - f) * G                              # MWh_th at plant gate
    backup_cap = bk["capacity_share"] * float(G.max())
    unmet = np.maximum(backup_gate - backup_cap, 0.0)
    return dict(S=S, E=E, D=D, L=L, G=G, f=f, direct=direct, disch=disch, charge=charge, tank_loss=tloss, soc=soc,
                cap_mwh=cap, vol_m3=vol_m3, backup_gate=backup_gate, backup_cap_mw=backup_cap, unmet=unmet,
                soc0=cap, e_served=E * f, active=active)


def balance_residual(res: dict) -> float:
    """(DC draw + HP elec served + backup) - (D + L + tank loss + dSOC), as a fraction of D+L. Should be ~0."""
    lhs = (res["direct"] + res["charge"]).sum() + res["e_served"].sum() + res["backup_gate"].sum()
    rhs = (res["D"] + res["L"]).sum() + res["tank_loss"].sum() + (res["soc"][-1] - res["soc0"])
    return float((lhs - rhs) / (res["D"] + res["L"]).sum())

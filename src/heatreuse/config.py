"""Config loading with deep-merge site overrides."""
from __future__ import annotations
import copy
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parents[2]
CONFIG = ROOT / "config"


def _read(name: str) -> dict:
    return yaml.safe_load((CONFIG / name).read_text(encoding="utf-8"))


def deep_merge(base: dict, over: dict) -> dict:
    out = copy.deepcopy(base)
    for k, v in (over or {}).items():
        if isinstance(v, dict) and isinstance(out.get(k), dict):
            out[k] = deep_merge(out[k], v)
        else:
            out[k] = copy.deepcopy(v)
    return out


def load(site: str = "site2") -> dict:
    """Return {'eng','fin','imp','key'} for site2 (base) or site1 (overrides merged)."""
    eng, fin, imp = _read("engineering.yaml"), _read("finance.yaml"), _read("impact.yaml")
    if site == "site1":
        o = _read("site1.yaml")
        eng = deep_merge(eng, o.get("engineering", {}))
        fin = deep_merge(fin, o.get("finance", {}))
        imp = deep_merge(imp, o.get("impact", {}))
    return {"eng": eng, "fin": fin, "imp": imp, "key": site}


def override(cfg: dict, section: str, path: str, value) -> dict:
    """Return a copy of cfg with cfg[section][a][b]... = value (dotted path)."""
    c = copy.deepcopy(cfg)
    d = c[section]
    parts = path.split(".")
    for p in parts[:-1]:
        d = d[p]
    d[parts[-1]] = value
    return c

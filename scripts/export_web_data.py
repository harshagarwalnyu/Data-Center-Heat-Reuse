"""Copy model outputs the web app reads into web/public/data/ (docs/data-contract.md)."""

from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = ["site2.json", "headline_numbers.json"]


def main() -> None:
    dest = ROOT / "web" / "public" / "data"
    dest.mkdir(parents=True, exist_ok=True)
    for name in FILES:
        shutil.copy2(ROOT / "outputs" / name, dest / name)
        print(f"copied outputs/{name} -> web/public/data/{name}")


if __name__ == "__main__":
    main()

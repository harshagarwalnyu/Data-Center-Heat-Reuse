"""Copy model outputs to web/public/data/ (run after `uv run python -m heatreuse.run`)."""
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "web" / "public" / "data"
DEST.mkdir(parents=True, exist_ok=True)
for name in ("site2.json", "site1.json", "offtakers.json", "input_register.json"):
    src = ROOT / "outputs" / name
    shutil.copy2(src, DEST / name)
    print("copied", name, "->", DEST)

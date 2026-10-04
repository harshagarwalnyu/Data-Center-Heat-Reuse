"""One-command pipeline: ``uv run python -m heatreuse [--no-export]``.

Runs, in order: model (heatreuse.run) -> self-verification (heatreuse.verify, stops on any FAIL)
-> detailed analysis (heatreuse.analysis) -> hydraulics screening (heatreuse.hydraulics) -> copy outputs to web/public/data (scripts/export_web_data.py).
"""
from __future__ import annotations

import runpy
import sys

from . import analysis, hydraulics, run, verify
from .config import ROOT


def main(argv: list[str] | None = None) -> int:
    """Run the full pipeline; return a process exit code (1 if verification fails)."""
    args = sys.argv[1:] if argv is None else argv
    run.main()
    code = verify.main()
    if code:
        print("verify reported FAIL; stopping before analysis/export")
        return code
    analysis.main()
    hydraulics.main()
    if "--no-export" not in args:
        runpy.run_path(str(ROOT / "scripts" / "export_web_data.py"), run_name="__main__")
    return 0


if __name__ == "__main__":
    sys.exit(main())

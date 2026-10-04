"""Writes src/audio.json: narration lines + measured WAV durations (seconds)."""
import json, pathlib
import soundfile as sf
root = pathlib.Path(__file__).parent.parent
lines = [l.strip() for l in (root / "narration.md").read_text(encoding="utf-8").splitlines() if l.strip()]
durs = [round(sf.info(root / "public" / "vo" / f"s{i}.wav").duration, 3) for i in range(1, len(lines) + 1)]
(root / "src" / "audio.json").write_text(json.dumps({"lines": lines, "durations": durs}, indent=1), encoding="utf-8")
print(durs, sum(durs))

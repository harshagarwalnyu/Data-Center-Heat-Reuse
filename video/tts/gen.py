import pathlib, soundfile as sf
from kokoro_onnx import Kokoro
here = pathlib.Path(__file__).parent
lines = [l.strip() for l in (here.parent / "narration.md").read_text(encoding="utf-8").splitlines() if l.strip()]
k = Kokoro(str(here / "models/kokoro-v1.0.onnx"), str(here / "models/voices-v1.0.bin"))
out = here.parent / "public" / "vo"
out.mkdir(parents=True, exist_ok=True)
for i, t in enumerate(lines, 1):
    s, sr = k.create(t, voice="af_heart", speed=0.92, lang="en-us")
    sf.write(out / f"s{i}.wav", s, sr)
    print(i, round(len(s) / sr, 2))

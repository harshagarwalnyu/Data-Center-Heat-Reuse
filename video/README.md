# Thermal Commons explainer / product demo video

Remotion (React to MP4) project. 1920x1080, 30 fps, about 77 s, with calm synthetic narration, a generated music bed,
generated SFX (whooshes, key clicks, thud, ticks) and burned-in subtitles.

Arc: hook (motion graphics) > problem > product in action (Screen Studio style: floating browser frame, cursor-following
zoom, click ripples, callouts) > result > call to action.

## Run

```
cd video
bun install
bun run sync                       # copies outputs/site2.json, verifies every key the video reads
node capture/capture.mjs           # (optional) re-capture the site; needs the site served on PORT=4190
bun run studio                     # preview
bun x remotion render src/index.ts Explainer out/explainer.mp4 --codec=h264 --crf=23 --browser-executable="<chrome>"
```

Every number on screen comes from `outputs/site2.json` (via `src/site2.json`). Nothing is hardcoded.

## Capture

`capture/capture.mjs` drives Chrome Beta with Playwright at 1920x1080, deviceScaleFactor 2, against the CURRENT main build
(`bun run build` then `node scripts/serve.mjs` with `PORT=4190` in `web/`). The real cursor is hidden; the cursor in the
video is drawn in Remotion. The slider thumb x positions used for the cursor path are recorded in
`public/captures/manifest.json`, so the overlay lines up with the capture. Captures are JPEGs, committed (see size in the
final report).

## Audio

- Narration: synthetic voice (Kokoro via kokoro-onnx, af_heart, speed 0.92). Model files are downloaded into `tts/models`
  (git-ignored). Script: `narration.md` (one line per voice clip). Regenerate: `cd tts && uv run python gen.py && uv run python meta.py`.
- SFX and music are synthesized with numpy/scipy (`tts/sfx.py`); nothing is downloaded or copyrighted.
- Mix: voice on top, SFX about 10 dB under the voice, music bed ducked a further 6 dB while the voice speaks, then a
  `loudnorm` post-pass to about -16 LUFS, AAC 160k.

## License

Remotion is free for individuals, for-profit organizations with up to 3 employees, and non-profits
(https://github.com/remotion-dev/remotion/blob/main/LICENSE.md, checked 2026-10-04; remotion.dev/license redirects there).
This hackathon team project qualifies as individuals / a small team; check the license before any larger commercial use.

# Demo runbook: Thermal Commons (judging room)

Live demo for Kimmel 905, 60 Washington Sq S, 1-5PM. Harsh Agarwal runs the demo on his laptop. The slides and the demo use the same numbers, from `outputs/site2.json` (model v3.1). The spoken lines are in [`presentation-script.md`](presentation-script.md).

## Setup commands (run at home; the room needs no network)

From the repo root:

```bash
uv sync
uv run pytest -q
```

Then build and serve the site from `web/`:

```bash
cd web
bun install
bun run build
node scripts/serve.mjs
```

`serve.mjs` serves the static export in `web/out/` at http://localhost:4173. It needs no internet. Keep that terminal open. If port 4173 is taken, set `PORT=4174` first.

## Tabs to pre-open (in this order)

1. http://localhost:4173/ (Story, for the slides if the PDF fails)
2. http://localhost:4173/explore/ (the live demo)
3. http://localhost:4173/compare/ (Site 2 vs Site 1, if a judge asks "why not Manhattan")
4. http://localhost:4173/how/ (method, if a judge asks how the model works)
5. The deck PDF, `Thermal Commons Heat for Lansing.pdf`, full screen

## Browser zoom and resolution

- Projector is likely 1920x1080 or 1280x720. Set browser zoom to 100% first. If text is small from the back row, go to 110% to 125% (Ctrl +).
- Turn off notifications (Windows Focus) and close chat apps.
- Hide the bookmarks bar (Ctrl+Shift+B).

## Explore page: before you walk up

1. Click **Reset to the base case**.
2. Cooling reads **Liquid-cooled (50 °C)**.
3. The box **Add the town-center ring (Phase 3; fails the cost test today)** is unticked.
4. Touch nothing else.

The 60-second demo itself is scripted in `presentation-script.md` under "Live demo handoff". Move only **Cost of money (discount rate)** from 4.0% to 7.0%. The page may show about 108; say 106 (the hourly model figure). The saving for a propane home stays at $735.

## Keyboard shortcuts (Story page)

| Key | Action |
| --- | --- |
| Right / Down / PageDown / Space | Next step |
| Left / Up / PageUp | Previous step |
| Home / End | First / last step |
| P | Show or hide speaker notes |
| S | Switch between the short path and the deep dive |
| F | Full screen |

## Offline fallback

- **Site will not load:** check the `serve.mjs` terminal is still running. Restart it with `node scripts/serve.mjs` from `web/`.
- **`web/out/` missing:** run `bun run build` (about a minute). If that fails, present from the PDF and describe the slider result: 106 dollars per MWh at 7%, $735 a year saved, unchanged.
- **Laptop dies:** a teammate opens the PDF on their laptop. Talk through the screenshots in `web/screenshots/`.

## Top 5 failure modes

1. **Slider overshoot.** Press Reset, move only cost of money again, and say "Resetting so you see one change."
2. **Projector shows the wrong display.** Win+P, choose Duplicate.
3. **A judge asks for the town ring.** Tick the town-ring box after the minute, show the cost jump, then untick it.
4. **Numbers on the screen differ from the slide by a dollar or two.** Explore rescales in the browser. Quote the file number and say so.
5. **Asked about a fact not on the card.** Say it is not verified. See [`judge-qa.md`](judge-qa.md) and `research/verification.md`.

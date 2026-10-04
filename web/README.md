# Lansing Heat Reuse: web app

Static Next.js app (Story, Explore, Data & sources). It reads only `public/data/site2.json`, copied from the model.

```bash
# from the repo root: regenerate model outputs and copy them in
uv run python -m heatreuse && python3 scripts/export_web_data.py

cd web
bun install
bun run dev        # http://localhost:3000
bun run build      # static export to web/out/ (runs offline from any file server)
```

Story mode: arrow keys, Page Up/Down or space to move; `#N` in the URL jumps to step N.
Charts are hand-built SVG (no chart library) with hover tooltips and a "Show as table" twin.

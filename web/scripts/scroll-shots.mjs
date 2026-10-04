// Scroll-story screenshots: node scripts/scroll-shots.mjs  (BASE, CHROME, REDUCE=1, OUT env vars)
import { chromium } from "playwright";
import fs from "node:fs";
const base = process.env.BASE || "http://localhost:4178";
const out = process.env.OUT || "screenshots/scroll";
const reduce = process.env.REDUCE === "1";
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
for (const [w, h] of [[1920, 1080], [375, 812]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: reduce ? "reduce" : "no-preference" });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto(`${base}/`);
  await p.waitForSelector("h1", { timeout: 15000 });
  await p.waitForTimeout(1200);
  const max = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const stops = Number(process.env.STOPS || 8);
  for (let i = 0; i <= stops; i++) {
    // scroll in small steps so in-view observers fire like a real scroll
    const y = Math.round((max * i) / stops);
    const cur = await p.evaluate(() => scrollY);
    for (let s = 1; s <= 6; s++) { await p.evaluate((v) => scrollTo(0, v), cur + ((y - cur) * s) / 6); await p.waitForTimeout(60); }
    await p.waitForTimeout(1000);
    await p.screenshot({ path: `${out}/${reduce ? "reduce-" : ""}${w}-${String(i).padStart(2, "0")}.png` });
  }
  console.log(w, "height", max + h, "errors:", [...new Set(errs)].slice(0, 6));
  await ctx.close();
}
await b.close();

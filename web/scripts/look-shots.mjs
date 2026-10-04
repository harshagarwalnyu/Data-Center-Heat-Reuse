import { chromium } from "playwright";
import fs from "node:fs";
const base = process.env.BASE || "http://localhost:4185";
const out = process.env.OUT || "screenshots/look";
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
for (const [w, h, tag] of [[1440, 900, "desk"], [390, 844, "mob"]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto(`${base}/`); await p.waitForSelector("h1"); await p.waitForTimeout(1500);
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  let i = 0;
  for (let y = 0; y < total && i < 14; y += h * 0.9, i++) {
    await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(900);
    await p.screenshot({ path: `${out}/home-${tag}-${String(i).padStart(2, "0")}.png` });
  }
  for (const r of ["explore", "compare", "how", "sources"]) {
    await p.goto(`${base}/${r}/`); await p.waitForTimeout(1800);
    await p.screenshot({ path: `${out}/${r}-${tag}.png` });
  }
  console.log(tag, "errors:", [...new Set(errs)].slice(0, 6));
  await ctx.close();
}
await b.close();

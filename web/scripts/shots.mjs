import { chromium } from "playwright";
import fs from "node:fs";
const base = process.env.BASE || "http://localhost:4173";
const sizes = (process.env.SIZES || "1920x1080,1366x768").split(",").map((s) => s.split("x").map(Number));
fs.mkdirSync("screenshots", { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
for (const [w, h] of sizes) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  for (let i = 1; i <= 11; i++) {
    await p.goto(`${base}/#${i}`);
    await p.reload();
    await p.waitForSelector("h1", { timeout: 15000 }); await p.waitForTimeout(2200);
    await p.screenshot({ path: `screenshots/story-${String(i).padStart(2, "0")}-${w}.png` });
  }
  for (const r of ["explore", "compare", "how", "print"]) {
    await p.goto(`${base}/${r}/`);
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `screenshots/${r}-${w}.png`, fullPage: r !== "print" });
  }
  console.log(w, "errors:", [...new Set(errs)].slice(0, 8));
  await ctx.close();
}
await b.close();

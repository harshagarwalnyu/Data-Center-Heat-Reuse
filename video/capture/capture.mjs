// Captures clean product screenshots of the live site (served on PORT 4190) with Playwright + Chrome Beta.
// Writes public/captures/*.jpg and manifest.json (slider thumb x positions, viewport size) used by src/beats.ts.
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire("C:/Users/007ha/Desktop/Business-Analytics-Club/main-wt/web/package.json");
const { chromium } = require("playwright");
const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../public/captures");
mkdirSync(out, { recursive: true });
const BASE = process.env.BASE || "http://localhost:4190";
const CHROME = "C:\\Program Files\\Google\\Chrome Beta\\Application\\chrome.exe";
const b = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.addInitScript(() => localStorage.setItem("theme", "light"));
const manifest = { w: 1920, h: 1080, shots: {} };
const shot = async (name, extra = {}) => {
  await p.screenshot({ path: `${out}/${name}.jpg`, type: "jpeg", quality: 82 });
  manifest.shots[name] = { file: `captures/${name}.jpg`, ...extra };
  console.log("shot", name);
};
const hideCursor = () => p.addStyleTag({ content: "*{cursor:none!important}" });
const scrollToText = async (sel, text, block = "center") => {
  await p.evaluate(([s, t, bl]) => {
    const el = [...document.querySelectorAll(s)].find((e) => (e.textContent.includes(t) || (e.getAttribute("aria-label")||"").includes(t)));
    if (!el) throw new Error("no element " + s + " " + t);
    el.scrollIntoView({ block: bl });
  }, [sel, text, block]);
  await p.waitForTimeout(1400);
};

// 1. home
await p.goto(BASE + "/", { waitUntil: "networkidle" });
await hideCursor();
await p.waitForTimeout(5000); // let the hero stat odometers finish
await shot("hero");
// 2. rings: on-site, corridor, town (map steps follow scroll)
await scrollToText("h3", "Build first", "center");
await shot("ring-1");
await scrollToText("h3", "Build where homes", "center");
await shot("ring-2");
await scrollToText("h3", "Fails the cost test", "center");
await p.waitForTimeout(1200);
await shot("ring-3");

// 4. explore: slider 7 -> 4 in 0.5 steps
await p.goto(BASE + "/explore/", { waitUntil: "networkidle" });
await hideCursor();
await p.waitForTimeout(1200);
const sl = p.locator("#disc");
const bb = await sl.boundingBox();
const min = 1, max = 12, thumb = 14; // chrome range thumb ~28px wide, travel = width - thumb*2
const xOf = (v) => bb.x + thumb + ((v - min) / (max - min)) * (bb.width - thumb * 2);
const y = bb.y + bb.height / 2;
manifest.slider = { y, steps: [] };
await p.mouse.move(xOf(7), y);
await p.mouse.down();
let i = 0;
for (let v = 7; v >= 4; v -= 0.5) {
  await p.mouse.move(xOf(v), y, { steps: 6 });
  await p.waitForTimeout(450);
  await shot(`explore-${i}`);
  manifest.slider.steps.push({ v, x: xOf(v), file: `captures/explore-${i}.jpg` });
  i++;
}
await p.mouse.up();
await p.mouse.move(1500, 150);
await p.waitForTimeout(400);
await shot("explore-end");
// click the 4% co-op bar (position read from the aria/text label)
const bar = p.getByText("Community co-op", { exact: false }).first();
const bbx = await bar.boundingBox();
manifest.bar = { x: bbx.x + bbx.width + 90, y: bbx.y + bbx.height / 2 };
await p.mouse.click(manifest.bar.x, manifest.bar.y);
await p.waitForTimeout(900);
await p.mouse.move(1700, 60);
await shot("explore-bar");

// 5. compare, 6. how it works
await p.goto(BASE + "/compare/", { waitUntil: "networkidle" });
await hideCursor();
await p.waitForTimeout(1500);
await shot("compare");
await p.goto(BASE + "/how/", { waitUntil: "networkidle" });
await hideCursor();
await p.waitForTimeout(1500);
await shot("how");
writeFileSync(`${out}/manifest.json`, JSON.stringify(manifest, null, 1));
await b.close();
console.log("done");

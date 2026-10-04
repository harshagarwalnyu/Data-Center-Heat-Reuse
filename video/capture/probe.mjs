import { createRequire } from "node:module";
const require = createRequire("C:/Users/007ha/Desktop/Business-Analytics-Club/main-wt/web/package.json");
const { chromium } = require("playwright");
const b = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome Beta\\Application\\chrome.exe", headless: true });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto("http://localhost:4190/", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
console.log("home height", H);
const heads = await p.evaluate(() => [...document.querySelectorAll("h1,h2,h3,section,svg[role=img],[role=region],canvas")].map((e) => ({ t: e.tagName, txt: (e.getAttribute("aria-label") || e.textContent || "").slice(0, 60), y: Math.round(e.getBoundingClientRect().top + scrollY), h: Math.round(e.getBoundingClientRect().height), w: Math.round(e.getBoundingClientRect().width) })));
console.log(JSON.stringify(heads, null, 0));
for (let i = 0; i * 900 < H && i < 12; i++) {
  await p.evaluate((y) => window.scrollTo(0, y), i * 900);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `out/probe-home-${i}.png` });
}
await b.close();

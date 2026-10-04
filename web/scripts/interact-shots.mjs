// Interaction screenshots + assertions: node scripts/interact-shots.mjs  (BASE, CHROME, OUT env vars)
import { chromium } from "playwright";
import fs from "node:fs";
const base = process.env.BASE || "http://localhost:4180";
const out = process.env.OUT || "screenshots/interact";
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
let failed = 0;
const check = (name, ok, extra = "") => { console.log(ok ? "PASS" : "FAIL", name, extra); if (!ok) failed++; };

for (const [w, h, tag] of [[1920, 1080, "desktop"], [375, 812, "mobile"]]) {
  const mobile = w < 600;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: mobile, isMobile: mobile });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto(`${base}/`);
  await p.waitForSelector("h1", { timeout: 15000 });
  await p.waitForTimeout(800);

  // stat info icon
  const stat = p.locator('section[aria-label="The numbers"] button[aria-label="How we got this"]').first();
  await stat.scrollIntoViewIfNeeded();
  await p.waitForTimeout(600);
  if (mobile) await stat.tap(); else await stat.hover();
  await p.waitForTimeout(400);
  check(`${tag} stat tooltip`, (await p.locator('[role="tooltip"]').count()) === 1, await p.locator('[role="tooltip"]').first().innerText());
  await p.screenshot({ path: `${out}/${tag}-stat-tip.png` });
  await p.keyboard.press("Escape");
  check(`${tag} Esc closes stat tooltip`, (await p.locator('[role="tooltip"]').count()) === 0);
  if (mobile) await p.mouse.click(5, 5);

  // reach the map and let all rings build
  const mapSel = '[aria-label^="Interactive ring map"]';
  const map = p.locator(mapSel);
  await p.locator("#rings-h").scrollIntoViewIfNeeded();
  const max = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const top = await p.evaluate(() => document.querySelector("#rings-h").getBoundingClientRect().top + scrollY);
  const end = mobile ? top + 700 : top + 1500;
  const from = await p.evaluate(() => scrollY);
  for (let s = 1; s <= 14; s++) { await p.evaluate((v) => scrollTo(0, v), Math.min(max, from + ((end - from) * s) / 14)); await p.waitForTimeout(90); }
  if (mobile) { await map.scrollIntoViewIfNeeded(); }
  await p.waitForTimeout(1800);
  const ring = (name) => p.locator(`${mapSel} [role="button"][aria-label^="${name}"]`);

  // hover (desktop) or tap (touch) the on-site ring
  const on = ring("On-site");
  const bb = await on.boundingBox();
  // upper part of the ring: the data-center marker sits at its exact centre
  if (mobile) await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height * 0.2);
  else await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height * 0.2);
  await p.waitForTimeout(450);
  const tipText = await map.locator('[role="tooltip"]').first().innerText().catch(() => "");
  check(`${tag} ring tooltip`, /GWh a year/.test(tipText) && /Build first/.test(tipText), JSON.stringify(tipText));
  await map.screenshot({ path: `${out}/${tag}-ring-hover.png` });

  // click to pin
  if (!mobile) await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height * 0.2);
  await p.waitForTimeout(900);
  check(`${tag} ring pinned`, (await on.getAttribute("aria-pressed")) === "true");
  await p.screenshot({ path: `${out}/${tag}-ring-pinned.png` });
  await p.keyboard.press("Escape");
  await p.waitForTimeout(200);
  check(`${tag} Esc unpins`, (await on.getAttribute("aria-pressed")) === "false");

  // zoom + drag
  const zin = p.locator('button[aria-label="Zoom in"]');
  await zin.click(); await zin.click();
  await p.waitForTimeout(200);
  const tr0 = await map.locator("svg > g").first().getAttribute("transform");
  const mb = await map.boundingBox();
  if (mobile) {
    // arrow keys cover pan on touch; a vertical swipe must leave the map alone
    await map.focus();
    await p.keyboard.press("ArrowLeft");
  } else {
    await p.mouse.move(mb.x + mb.width * 0.6, mb.y + mb.height * 0.5);
    await p.mouse.down();
    await p.mouse.move(mb.x + mb.width * 0.3, mb.y + mb.height * 0.4, { steps: 8 });
    await p.mouse.up();
  }
  await p.waitForTimeout(250);
  const tr1 = await map.locator("svg > g").first().getAttribute("transform");
  check(`${tag} map panned`, tr0 !== tr1, `${tr0} -> ${tr1}`);
  await map.screenshot({ path: `${out}/${tag}-map-dragged.png` });
  await p.locator('button[aria-label="Reset the map view"]').click();
  check(`${tag} reset`, (await map.locator("svg > g").first().getAttribute("transform")).startsWith("translate(0 0) scale(1)"));

  // data center marker
  const dcg = p.locator(`${mapSel} [aria-label^="Data center:"]`);
  if (!mobile) { const d = await dcg.boundingBox(); await p.mouse.move(d.x + d.width / 2, d.y + d.height / 2); await p.waitForTimeout(350); check(`${tag} dc tooltip`, /IT load/.test(await map.locator('[role="tooltip"]').first().innerText().catch(() => ""))); await map.screenshot({ path: `${out}/${tag}-dc-tip.png` }); }
  check(`${tag} home errors`, errs.length === 0, JSON.stringify(errs.slice(0, 3)));

  // Explore
  await p.goto(`${base}/explore/`);
  await p.waitForSelector("#disc");
  await p.waitForTimeout(800);
  const bar = p.locator(".lcoh-pick").first();
  await bar.waitFor({ timeout: 8000 }).catch(async () => { await p.screenshot({ path: `${out}/${tag}-explore-FAIL.png`, fullPage: true }); });
  await bar.scrollIntoViewIfNeeded();
  await p.waitForTimeout(300);
  if (!mobile) { await bar.hover(); await p.waitForTimeout(350); await p.screenshot({ path: `${out}/${tag}-explore-bar-hover.png` }); }
  if (mobile) await bar.tap(); else await bar.click();
  await p.waitForTimeout(500);
  const disc = await p.locator("#disc").inputValue();
  const lbl = await p.locator('label[for="disc"]').innerText();
  check(`${tag} 4% bar sets slider`, disc === "4" && /4\.0/.test(lbl), `${disc} | ${lbl.replace(/\n/g, " ")}`);
  await p.screenshot({ path: `${out}/${tag}-explore-after-click.png` });
  const kpi = p.locator('[aria-label="Results"] button[aria-label="How we got this"]').first();
  await kpi.scrollIntoViewIfNeeded();
  if (mobile) await kpi.tap(); else await kpi.hover();
  await p.waitForTimeout(350);
  await p.screenshot({ path: `${out}/${tag}-explore-kpi-tip.png` });
  await p.goto(`${base}/how/`);
  await p.waitForSelector("h1");
  const term = p.locator(".term").first();
  await term.scrollIntoViewIfNeeded();
  if (mobile) await term.tap(); else await term.hover();
  await p.waitForTimeout(350);
  check(`${tag} term tooltip`, (await p.locator('[role="tooltip"]').count()) === 1);
  await p.screenshot({ path: `${out}/${tag}-how-term.png` });
  await ctx.close();
}
await b.close();
console.log(failed ? `${failed} FAILED` : "ALL PASS");
process.exit(failed ? 1 : 0);

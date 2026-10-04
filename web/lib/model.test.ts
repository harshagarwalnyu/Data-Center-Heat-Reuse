import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { baseParams, co2Avoided, cop, crf, household, householdSavings, hpElec, isDirect, lcoh, scenario } from "./model";
import type { Site2Data } from "./types";

const d: Site2Data = JSON.parse(readFileSync(path.join(__dirname, "../public/data/site2.json"), "utf8"));

describe("formulas", () => {
  it("cop matches the contract formula (hand check)", () => {
    // sink 70C = 343.15 K, source 30C = 303.15 K, approach 3 -> 0.5*343.15/(40+6)
    expect(cop(70, 30)).toBeCloseTo((0.5 * 343.15) / 46, 6);
  });
  it("cop rises as source warms", () => {
    expect(cop(70, 50)).toBeGreaterThan(cop(70, 30));
  });
  it("cop is capped for tiny lift", () => {
    expect(cop(53, 50)).toBe(6);
    expect(cop(40, 60)).toBeGreaterThanOrEqual(2);
  });
  it("direct use needs source above sink plus one approach", () => {
    expect(isDirect(40, 50)).toBe(true);
    expect(isDirect(48, 50)).toBe(false);
  });
  it("crf hand check: 4%, 30 yr = 0.05783", () => {
    expect(crf(0.04, 30)).toBeCloseTo(0.057830, 5);
  });
  it("crf at zero rate is 1/n", () => {
    expect(crf(0, 30)).toBeCloseTo(1 / 30, 9);
  });
  it("hp_elec = heat / cop", () => {
    expect(hpElec(100, 4)).toBe(25);
  });
  it("lcoh hand check", () => {
    // capex 10M @ 5% 30y: crf=0.065051 -> 650,514; opex 100k; elec 50 $/MWh * 1000 MWh=50k; heat 4000 MWh
    const v = lcoh(10e6, 1e5, 50, 1000, 4000, 0.05);
    expect(v).toBeCloseTo((10e6 * crf(0.05) + 1e5 + 50000) / 4000, 6);
    expect(v).toBeGreaterThan(200);
  });
  it("household savings = MWh * (incumbent - tariff)", () => {
    expect(householdSavings(18, 125, 100)).toBe(450);
    expect(householdSavings(18, 64, 100)).toBeLessThan(0);
  });
  it("co2 hand check", () => {
    // 1000 MWh propane at 210 kg/MWh, eff .85; hp 200 MWh * 110 kg
    expect(co2Avoided(1000, 210, 0.85, 200, 110)).toBeCloseTo((1000 * (210 / 0.85) - 200 * 110) / 1000, 6);
  });
});

describe("scenario (calibrated to the data file)", () => {
  const base = baseParams(d);
  const s0 = scenario(d, base);
  it("equals file headline numbers at base sliders", () => {
    expect(s0.heatDeliveredMWh).toBeCloseTo(d.totals.heat_delivered_MWh, 3);
    expect(s0.lcohUsdMWh).toBeCloseTo(d.finance.lcoh_usd_mwh.coop_4pct, 6);
    expect(s0.avgCop).toBeCloseTo(d.totals.avg_cop, 6);
    expect(s0.co2TYr).toBeCloseTo(d.impact.co2_avoided_t_yr, 3);
    expect(s0.heatAvailableGWh).toBeCloseTo(d.supply.heat_available_GWh, 3);
  });
  it("higher electricity price raises LCOH", () => {
    expect(scenario(d, { ...base, elecPrice: base.elecPrice * 2 }).lcohUsdMWh).toBeGreaterThan(s0.lcohUsdMWh);
  });
  it("air cooling lowers COP and raises LCOH vs liquid", () => {
    const air = scenario(d, { ...base, cooling: "air" });
    expect(air.avgCop).toBeLessThan(s0.avgCop);
    expect(air.lcohUsdMWh).toBeGreaterThan(s0.lcohUsdMWh);
  });
  it("lower uptake lowers delivered heat and raises LCOH (stranded pipe)", () => {
    const low = scenario(d, { ...base, uptakePct: 40 });
    expect(low.heatDeliveredMWh).toBeLessThan(s0.heatDeliveredMWh);
    expect(low.lcohUsdMWh).toBeGreaterThan(s0.lcohUsdMWh);
  });
  it("higher discount rate raises LCOH", () => {
    expect(scenario(d, { ...base, discountPct: 10 }).lcohUsdMWh).toBeGreaterThan(s0.lcohUsdMWh);
  });
  it("DC load scales available heat linearly", () => {
    const s = scenario(d, { ...base, loadMW: base.loadMW * 2 });
    expect(s.heatAvailableGWh).toBeCloseTo(s0.heatAvailableGWh * 2, 3);
  });
  it("a very small data center becomes supply-limited", () => {
    const s = scenario(d, { ...base, loadMW: 5 });
    expect(s.supplyLimited).toBe(true);
    expect(s.heatDeliveredMWh).toBeLessThan(s0.heatDeliveredMWh);
  });
  it("adding the town ring raises delivered heat", () => {
    expect(scenario(d, { ...base, includeTown: true }).heatDeliveredMWh).toBeGreaterThan(s0.heatDeliveredMWh);
  });
});

describe("household calculator", () => {
  it("propane savings match the formula", () => {
    const h = household(d, "propane", 1);
    expect(h.savingsUsd).toBeCloseTo(d.finance.household.savings_vs_propane_usd, 6);
    expect(h.savingsUsd).toBeCloseTo(d.finance.household.typical_MWh_yr * (d.finance.incumbent_usd_mwh.propane - d.finance.tariff_usd_mwh), -1);
    expect(h.co2KgSaved).toBeGreaterThan(0);
  });
  it("larger homes scale linearly", () => {
    expect(household(d, "heating_oil", 1.5).savingsUsd).toBeCloseTo(household(d, "heating_oil", 1).savingsUsd * 1.5, 6);
  });
});

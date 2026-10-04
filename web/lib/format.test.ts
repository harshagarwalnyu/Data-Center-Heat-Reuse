import { describe, expect, it } from "vitest";
import { barToPsi, cToF, dCToF, haToAcres, kgToLb, kmToMi, m3ToGal, mToFt, tonnesToTons } from "./format";

describe("imperial helpers", () => {
  it("cToF", () => {
    expect(cToF(70)).toBeCloseTo(158, 6);
    expect(cToF(50)).toBeCloseTo(122, 6);
    expect(cToF(0)).toBe(32);
    expect(cToF(-40)).toBeCloseTo(-40, 6);
  });
  it("dCToF scales without offset", () => {
    expect(dCToF(10)).toBeCloseTo(18, 6);
    expect(dCToF(0)).toBe(0);
  });
  it("length", () => {
    expect(kmToMi(10)).toBeCloseTo(6.21371, 5);
    expect(mToFt(1)).toBeCloseTo(3.28084, 5);
  });
  it("volume, area, mass, pressure", () => {
    expect(m3ToGal(1)).toBeCloseTo(264.172, 3);
    expect(haToAcres(1)).toBeCloseTo(2.47105, 5);
    expect(tonnesToTons(1000)).toBeCloseTo(1102.31, 2);
    expect(kgToLb(1)).toBeCloseTo(2.20462, 5);
    expect(barToPsi(1)).toBeCloseTo(14.5038, 4);
  });
});

import { imperialInput, imperialText, imperialize } from "./format";

describe("imperialText", () => {
  it("converts temperatures, distances, areas, mass", () => {
    expect(imperialText("70 °C supply")).toBe("158 °F supply");
    expect(imperialText("Corridor pipe (20.9 km)")).toBe("Corridor pipe (13 mi)");
    expect(imperialText("(10 ha)")).toBe("(25 acres)");
    expect(imperialText("A year-round 10-hectare farm")).toBe("A year-round 25-acre farm");
    expect(imperialText("1,500 tonnes")).toBe("1,653 tons");
    expect(imperialText("10.4-10.6 km")).toBe("6.5-6.6 mi");
    expect(imperialText("0.5 km")).toBe("0.3 mi");
  });
  it("leaves ids, paths and rates alone", () => {
    expect(imperialText("$300/m3 tank")).toBe("$300/m3 tank");
    expect(imperialText("research/offtakers.md")).toBe("research/offtakers.md");
    expect(imperialText("co2_avoided_t_yr")).toBe("co2_avoided_t_yr");
  });
  it("imperialize only touches string values", () => {
    expect(imperialize({ a: 70, b: "70 °C", c: ["5 km"], "10 km": 1 })).toEqual({ a: 70, b: "158 °F", c: ["3.1 mi"], "10 km": 1 });
  });
});

describe("imperialInput", () => {
  it("converts by unit and key suffix", () => {
    expect(imperialInput("x.supply_temp_c", 50, "C")).toEqual({ value: 122, unit: "°F" });
    expect(imperialInput("x.approach_k", 3, "K")).toEqual({ value: 5.4, unit: "°F (difference)" });
    expect(imperialInput("x.trunk_km", 11, "km").unit).toBe("mi");
    expect(imperialInput("x.building_m2", 4000, "m2").unit).toBe("ft²");
    expect(imperialInput("x.yield_kg_m2", 40, "m2").unit).toBe("lb/ft²");
    expect(imperialInput("x.lat", 42.6, "deg")).toEqual({ value: 42.6, unit: "deg" });
    expect(imperialInput("x.s", "text", "C")).toEqual({ value: "text", unit: "C" });
  });
});

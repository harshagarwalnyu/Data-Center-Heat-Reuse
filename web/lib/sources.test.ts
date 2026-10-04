import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { InputRow, Site2Data } from "./types";

const dir = path.join(__dirname, "../public/data");
const rows: InputRow[] = JSON.parse(readFileSync(path.join(dir, "input_register.json"), "utf8"));
const site: Site2Data = JSON.parse(readFileSync(path.join(dir, "site2.json"), "utf8"));

describe("data and sources page inputs", () => {
  it("every register row has input, unit, source and a known confidence", () => {
    expect(rows.length).toBeGreaterThan(100);
    for (const r of rows) {
      expect(r.input).toBeTruthy();
      expect(r.unit).toBeTruthy();
      expect(r.source.length).toBeGreaterThan(0);
      expect(["sourced", "assumption", "unverified"]).toContain(r.confidence);
      expect(Number.isFinite(r.value)).toBe(true);
    }
  });
  it("register inputs are unique", () => {
    expect(new Set(rows.map((r) => r.input)).size).toBe(rows.length);
  });
  it("site2 sources have unique ids, labels and links", () => {
    expect(site.sources.length).toBeGreaterThan(0);
    expect(new Set(site.sources.map((s) => s.id)).size).toBe(site.sources.length);
    for (const s of site.sources) {
      expect(s.label).toBeTruthy();
      expect(s.url).toBeTruthy();
    }
  });
});

import { describe, expect, it } from "vitest";
import { HOME_VIEW, MAX_ZOOM, MIN_ZOOM, clamp, clampView, panBy, placeTip, wheelFactor, zoomAt } from "./interact";

const W = 900, H = 600;

describe("clamp", () => {
  it("limits to the range", () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
    expect(clamp(2, 0, 3)).toBe(2);
  });
});

describe("clampView", () => {
  it("limits zoom to 1x..3x", () => {
    expect(clampView({ k: 9, x: 0, y: 0 }, W, H).k).toBe(MAX_ZOOM);
    expect(clampView({ k: 0.2, x: 0, y: 0 }, W, H).k).toBe(MIN_ZOOM);
  });
  it("cannot pan at 1x", () => {
    expect(clampView({ k: 1, x: -50, y: 40 }, W, H)).toEqual({ k: 1, x: 0, y: 0 });
  });
  it("keeps content covering the box when zoomed", () => {
    expect(clampView({ k: 2, x: -5000, y: 5000 }, W, H)).toEqual({ k: 2, x: -W, y: 0 });
  });
});

describe("zoomAt", () => {
  it("keeps the point under the cursor fixed", () => {
    const v = zoomAt(HOME_VIEW, 2, 300, 200, W, H);
    // content point under (300,200) before is (300,200); after it must still map to (300,200)
    expect(v.x + 300 * v.k).toBeCloseTo(300);
    expect(v.y + 200 * v.k).toBeCloseTo(200);
  });
  it("zooming out to 1x returns home", () => {
    const z = zoomAt(HOME_VIEW, 3, 450, 300, W, H);
    expect(zoomAt(z, 1, 450, 300, W, H)).toEqual(HOME_VIEW);
  });
  it("never exceeds 3x", () => {
    expect(zoomAt(HOME_VIEW, 10, 0, 0, W, H).k).toBe(3);
  });
});

describe("panBy", () => {
  it("is a no-op at 1x and clamps at 2x", () => {
    expect(panBy(HOME_VIEW, 100, 100, W, H)).toEqual(HOME_VIEW);
    const v = panBy({ k: 2, x: -10, y: -10 }, -5000, 5000, W, H);
    expect(v).toEqual({ k: 2, x: -W, y: 0 });
  });
});

describe("wheelFactor", () => {
  it("is symmetric and zooms in on scroll up", () => {
    expect(wheelFactor(-100)).toBeGreaterThan(1);
    expect(wheelFactor(100) * wheelFactor(-100)).toBeCloseTo(1);
  });
});

describe("placeTip", () => {
  const size = { w: 280, h: 100 };
  const bounds = { w: 1000, h: 700 };
  it("goes above the anchor when there is room", () => {
    const p = placeTip({ x: 500, y: 300, w: 0, h: 0 }, size, bounds);
    expect(p.side).toBe("above");
    expect(p.top).toBe(300 - 10 - 100);
    expect(p.left).toBe(360);
  });
  it("flips below near the top edge", () => {
    const p = placeTip({ x: 500, y: 40, w: 20, h: 20 }, size, bounds);
    expect(p.side).toBe("below");
    expect(p.top).toBe(70);
  });
  it("stays inside the box at both sides", () => {
    expect(placeTip({ x: 2, y: 300, w: 0, h: 0 }, size, bounds).left).toBe(8);
    expect(placeTip({ x: 999, y: 300, w: 0, h: 0 }, size, bounds).left).toBe(1000 - 280 - 8);
  });
  it("copes with a box narrower than the tip", () => {
    expect(placeTip({ x: 100, y: 300, w: 0, h: 0 }, size, { w: 200, h: 700 }).left).toBe(8);
  });
});

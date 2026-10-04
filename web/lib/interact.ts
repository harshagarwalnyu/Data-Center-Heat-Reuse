// Pure helpers for the tooltip and the draggable ring map. No DOM access, so they are unit-tested.

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Map view in viewBox units: content is drawn as translate(x y) scale(k). */
export interface View { k: number; x: number; y: number }
export const HOME_VIEW: View = { k: 1, x: 0, y: 0 };

/** Keep the scaled content covering the whole viewBox, so the map can never be dragged off into empty space. */
export function clampView(v: View, w: number, h: number): View {
  const k = clamp(v.k, MIN_ZOOM, MAX_ZOOM);
  return { k, x: clamp(v.x, w * (1 - k), 0), y: clamp(v.y, h * (1 - k), 0) };
}

/** Zoom to `k2`, keeping the content point under (cx, cy) (viewBox units) fixed. */
export function zoomAt(v: View, k2: number, cx: number, cy: number, w: number, h: number): View {
  const k = clamp(k2, MIN_ZOOM, MAX_ZOOM);
  const wx = (cx - v.x) / v.k;
  const wy = (cy - v.y) / v.k;
  return clampView({ k, x: cx - wx * k, y: cy - wy * k }, w, h);
}

export const panBy = (v: View, dx: number, dy: number, w: number, h: number): View => clampView({ ...v, x: v.x + dx, y: v.y + dy }, w, h);

/** Wheel delta to a zoom factor; exponential so zooming in and out are symmetric. */
export const wheelFactor = (deltaY: number) => Math.exp(-deltaY * 0.0025);

export interface Box { x: number; y: number; w: number; h: number }

/**
 * Place a tooltip of `size` next to `anchor`, inside `bounds` (0,0 to bw,bh), with a margin to the edge.
 * Prefers above the anchor, flips below when there is no room, and slides sideways to stay inside.
 */
export function placeTip(anchor: Box, size: { w: number; h: number }, bounds: { w: number; h: number }, gap = 10, margin = 8): { left: number; top: number; side: "above" | "below" } {
  const above = anchor.y - gap - size.h >= margin;
  const top = above ? anchor.y - gap - size.h : Math.min(anchor.y + anchor.h + gap, Math.max(margin, bounds.h - size.h - margin));
  const left = clamp(anchor.x + anchor.w / 2 - size.w / 2, margin, Math.max(margin, bounds.w - size.w - margin));
  return { left, top, side: above ? "above" : "below" };
}

// Approximate geometry for the illustrative map (hand-placed from coordinates in research/facts-site2.md).
export type LonLat = [number, number];
export const PLANT: LonLat = [-76.6336, 42.6028];
export const TOWN: LonLat = [-76.532, 42.566];
export const ROUTE: LonLat[] = [PLANT, [-76.612, 42.598], [-76.59, 42.592], [-76.568, 42.58], [-76.55, 42.572], TOWN];
export const LAKE: LonLat[] = [
  [-76.7, 42.65], [-76.638, 42.65], [-76.636, 42.62], [-76.629, 42.6], [-76.616, 42.582], [-76.597, 42.566], [-76.576, 42.546], [-76.562, 42.52], [-76.7, 42.52], [-76.7, 42.65],
];
export const BOUNDS: [LonLat, LonLat] = [[-76.675, 42.525], [-76.505, 42.64]];

export function circle(center: LonLat, radiusKm: number, n = 72): LonLat[] {
  const pts: LonLat[] = [];
  const latKm = 110.57;
  const lonKm = 111.32 * Math.cos((center[1] * Math.PI) / 180);
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * 2 * Math.PI;
    pts.push([center[0] + (Math.cos(a) * radiusKm) / lonKm, center[1] + (Math.sin(a) * radiusKm) / latKm]);
  }
  return pts;
}
export const ONSITE_R_KM = 1.0;
export const TOWN_R_KM = 1.5;

/** Equirectangular projection to pixel space for the SVG fallback. */
export function makeProjector(width: number) {
  const lat0 = (BOUNDS[0][1] + BOUNDS[1][1]) / 2;
  const kx = Math.cos((lat0 * Math.PI) / 180);
  const spanX = (BOUNDS[1][0] - BOUNDS[0][0]) * kx;
  const spanY = BOUNDS[1][1] - BOUNDS[0][1];
  const scale = width / spanX;
  const height = spanY * scale;
  const project = ([lon, lat]: LonLat): [number, number] => [(lon - BOUNDS[0][0]) * kx * scale, (BOUNDS[1][1] - lat) * scale];
  const kmToPx = scale / (111.32 * kx / kx) / 1; // px per degree-lat unit is `scale`; 1 deg lat = 110.57 km
  return { project, width, height, pxPerKm: scale / 110.57, kmToPx };
}

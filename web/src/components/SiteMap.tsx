// Schematic site map drawn from verified coordinates (research/offtakers.md). Works offline: no tiles.
// The lake outline is approximate and labelled as such.

const W = 720, H = 520;
const BOUNDS = { latMin: 42.515, latMax: 42.64, lonMin: -76.69, lonMax: -76.47 };
const KM_PER_DEG_LAT = 111.0;
const KM_PER_DEG_LON = 111.0 * Math.cos((42.57 * Math.PI) / 180);

const kmW = (BOUNDS.lonMax - BOUNDS.lonMin) * KM_PER_DEG_LON;
const kmH = (BOUNDS.latMax - BOUNDS.latMin) * KM_PER_DEG_LAT;
const scale = Math.min((W - 40) / kmW, (H - 40) / kmH); // px per km, equal on both axes
const px = (lat: number, lon: number): [number, number] => [
  20 + (lon - BOUNDS.lonMin) * KM_PER_DEG_LON * scale,
  20 + (BOUNDS.latMax - lat) * KM_PER_DEG_LAT * scale,
];

const PLANT: [number, number] = [42.602544, -76.635978];
const SCHOOL: [number, number] = [42.5437, -76.5355];
const LIBRARY: [number, number] = [42.5377, -76.5034];
// Approximate east shore of Cayuga Lake (plant sits on it) and a ~3 km wide lake body.
const SHORE: [number, number][] = [
  [42.64, -76.652], [42.603, -76.641], [42.585, -76.627], [42.565, -76.598], [42.548, -76.556], [42.53, -76.535], [42.515, -76.522],
];

export function SiteMap() {
  const shore = SHORE.map(([a, b]) => px(a, b));
  const west = SHORE.map(([a, b]) => px(a, b - 0.034)).reverse();
  const lake = [...shore, ...west].map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("") + "Z";
  const [pX, pY] = px(...PLANT);
  const [sX, sY] = px(...SCHOOL);
  const [lX, lY] = px(...LIBRARY);
  const kmPx = scale;

  return (
    <figure className="w-full" style={{ maxWidth: `calc(60vh * ${W / H})` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg border border-line bg-surface" role="img"
        aria-label="Schematic map: the plant on Cayuga Lake's east shore, the on-site campus beside it, a 3 km corridor of homes, and the town center 10 to 13 km southeast.">
        <path d={lake} fill="var(--wash-1)" stroke="var(--axis)" />
        <text {...xy(px(42.566, -76.64))} fontSize={14} textAnchor="end" fill="var(--ink-2)">
          Cayuga Lake (approx.)
        </text>

        {/* Ring 2: corridor clusters within ~3 km */}
        <circle cx={pX} cy={pY} r={3 * kmPx} fill="var(--wash-2)" stroke="var(--s2)" strokeWidth={2} />
        <text x={pX + 3 * kmPx + 10} y={pY - 2 * kmPx} fontSize={14} fill="var(--ink)">
          Ring 2 · corridor homes, ≤3 km
        </text>

        {/* Ring 3: transmission main to town center */}
        <path d={`M${pX},${pY} L${sX},${sY} L${lX},${lY}`} fill="none" stroke="var(--s3)" strokeWidth={3} strokeLinecap="round" />
        <circle cx={sX} cy={sY} r={7} fill="var(--s3)" stroke="var(--surface)" strokeWidth={2} />
        <circle cx={lX} cy={lY} r={7} fill="var(--s3)" stroke="var(--surface)" strokeWidth={2} />
        <text x={sX - 10} y={sY - 14} fontSize={14} textAnchor="end" fill="var(--ink)">School campus · 10.5 km</text>
        <text x={lX} y={lY + 26} fontSize={14} textAnchor="end" fill="var(--ink)">Town hall, library · 13 km</text>
        <text {...xy(px(42.575, -76.565))} fontSize={14} fill="var(--ink-2)">Ring 3 · 14 km of pipe</text>

        {/* Ring 1: on-site campus */}
        <circle cx={pX} cy={pY} r={0.6 * kmPx} fill="var(--s1)" stroke="var(--surface)" strokeWidth={2} />
        <rect x={pX - 7} y={pY - 7} width={14} height={14} fill="var(--ink)" />
        <text x={pX + 3 * kmPx + 10} y={pY - 2} fontSize={15} fontWeight={600} fill="var(--ink)">Ring 1 · on-site campus</text>
        <text x={pX + 3 * kmPx + 10} y={pY + 18} fontSize={13} fill="var(--ink-2)">Data center on the former Cayuga coal plant</text>

        {/* Scale bar + north */}
        <g transform={`translate(${W - 20 - 5 * kmPx}, ${H - 40})`}>
          <line x1={0} x2={5 * kmPx} y1={0} y2={0} stroke="var(--ink)" strokeWidth={2} />
          <line x1={0} x2={0} y1={-5} y2={5} stroke="var(--ink)" />
          <line x1={5 * kmPx} x2={5 * kmPx} y1={-5} y2={5} stroke="var(--ink)" />
          <text x={2.5 * kmPx} y={20} fontSize={13} textAnchor="middle" fill="var(--ink-2)">5 km</text>
        </g>
        <g transform={`translate(${W - 36}, 40)`}>
          <path d="M0,-16 L7,6 L0,1 L-7,6 Z" fill="var(--ink)" />
          <text y={24} fontSize={13} textAnchor="middle" fill="var(--ink-2)">N</text>
        </g>
      </svg>
      <figcaption className="mt-2 text-sm text-ink-2">
        Schematic. Plant and building points from OSM / Global Energy Monitor; lake outline approximate. Distances straight-line.
      </figcaption>
    </figure>
  );
}

function xy([x, y]: [number, number]) {
  return { x, y };
}

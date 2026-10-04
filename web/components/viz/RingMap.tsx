"use client";
import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Offtaker } from "@/lib/types";
import { BASE_PATH } from "@/lib/config";
import { kmToMi } from "@/lib/format";
import { BOUNDS, LAKE, ONSITE_R_KM, PLANT, ROUTE, TOWN, TOWN_R_KM, circle, makeProjector, type LonLat } from "@/lib/geo";
import { ringColor } from "../ui";

const LABELS: { at: LonLat; text: string; ring: string; dx: number; dy: number }[] = [
  { at: PLANT, text: "Data center", ring: "dc", dx: -120, dy: -44 },
  { at: [-76.59, 42.592], text: "Corridor homes", ring: "corridor", dx: -40, dy: -34 },
  { at: TOWN, text: "Town center", ring: "town", dx: -40, dy: 74 },
];

function cssVar(name: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

/** Pure-SVG map. Works fully offline and with no WebGL; also the fallback for the MapLibre view. */
export function RingMapSvg({ offtakers, townPipeKm }: { offtakers: Offtaker[]; townPipeKm?: number }) {
  const pipeText = townPipeKm !== undefined ? ` (${Math.round(kmToMi(townPipeKm))} miles by pipe route)` : "";
  const W = 900;
  const { project, height: H, pxPerKm, pxPerMi } = makeProjector(W);
  const path = (pts: LonLat[]) => pts.map((p, i) => `${i ? "L" : "M"}${project(p)[0].toFixed(1)},${project(p)[1].toFixed(1)}`).join(" ") + " Z";
  const line = (pts: LonLat[]) => pts.map((p, i) => `${i ? "L" : "M"}${project(p)[0].toFixed(1)},${project(p)[1].toFixed(1)}`).join(" ");
  const [px, py] = project(PLANT);
  const [tx, ty] = project(TOWN);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Schematic map: data center on Cayuga Lake's east shore, an on-site campus ring, a corridor of homes along the road, and the town center ring about six miles south-east in a straight line${pipeText}.`} className="w-full h-full block rounded-2xl" style={{ background: "var(--surface2)" }}>
      <path d={path(LAKE)} fill="var(--lake)" opacity="0.55" />
      <text x={60} y={H * 0.45} fontSize="34" fill="var(--lake-text)" fontStyle="italic" fontWeight="600">Cayuga Lake</text>
      <path d={line(ROUTE)} stroke="var(--ember)" strokeWidth={ONSITE_R_KM * pxPerKm * 0.9} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.28" />
      <path d={line(ROUTE)} stroke="var(--ember)" strokeWidth="3.5" strokeDasharray="2 9" strokeLinecap="round" fill="none" />
      <circle cx={px} cy={py} r={ONSITE_R_KM * pxPerKm} fill="var(--teal)" opacity="0.28" />
      <circle cx={px} cy={py} r={ONSITE_R_KM * pxPerKm} fill="none" stroke="var(--teal)" strokeWidth="3" />
      <circle cx={tx} cy={ty} r={TOWN_R_KM * pxPerKm} fill="var(--violet)" opacity="0.25" />
      <circle cx={tx} cy={ty} r={TOWN_R_KM * pxPerKm} fill="none" stroke="var(--violet)" strokeWidth="3" strokeDasharray="10 7" />
      {offtakers.map((o) => {
        const [x, y] = project([o.lon, o.lat]);
        return <circle key={o.id} cx={x} cy={y} r="10" fill="var(--bg)" stroke={ringColor(o.ring)} strokeWidth="5"><title>{o.name}</title></circle>;
      })}
      <path d={`M${px},${py - 12} l11,19 h-22 z`} fill="var(--navy)" />
      {LABELS.map((l) => {
        const [x, y] = project(l.at);
        const w = l.text.length * 18.5 + 24;
        return (
          <g key={l.text} transform={`translate(${x + l.dx},${y + l.dy})`}>
            <rect x={-10} y={-32} width={w} height={46} rx={10} fill="var(--bg)" opacity="0.92" />
            <text x={0} y={0} fontSize="32" fontWeight="700" fill="var(--ink)">{l.text}</text>
          </g>
        );
      })}
      <g transform={`translate(${W - 190},${H - 30})`}>
        <line x1="0" x2={3 * pxPerMi} y1="0" y2="0" stroke="var(--ink)" strokeWidth="3" />
        <text x={3 * pxPerMi + 8} y="8" fontSize="26" fill="var(--ink)">3 mi</text>
      </g>
    </svg>
  );
}

/** MapLibre view with an offline-safe, tile-free vector style. Falls back to SVG if WebGL/MapLibre fails. */
export function RingMap({ offtakers: all, townPipeKm }: { offtakers: Offtaker[]; townPipeKm?: number }) {
  const offtakers = all.filter((o) => o.lon >= BOUNDS[0][0] && o.lon <= BOUNDS[1][0] && o.lat >= BOUNDS[0][1] && o.lat <= BOUNDS[1][1]);
  const el = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [streets, setStreets] = useState(false);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    (async () => {
      try {
        const ml = await import("maplibre-gl");
        ml.setWorkerUrl(`${BASE_PATH}/maplibre/maplibre-gl-worker.mjs`);
        if (cancelled || !el.current) return;
        const poly = (c: LonLat[]) => ({ type: "Feature" as const, properties: {}, geometry: { type: "Polygon" as const, coordinates: [c] } });
        const map = new ml.Map({
          container: el.current,
          bounds: BOUNDS,
          fitBoundsOptions: { padding: 10 },
          attributionControl: { compact: true, customAttribution: "Schematic geometry, illustrative" },
          style: {
            version: 8,
            sources: {
              lake: { type: "geojson", data: poly(LAKE) },
              onsite: { type: "geojson", data: poly(circle(PLANT, ONSITE_R_KM)) },
              town: { type: "geojson", data: poly(circle(TOWN, TOWN_R_KM)) },
              route: { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: ROUTE } } },
              pts: { type: "geojson", data: { type: "FeatureCollection", features: offtakers.map((o) => ({ type: "Feature" as const, properties: { ring: o.ring, name: o.name }, geometry: { type: "Point" as const, coordinates: [o.lon, o.lat] } })) } },
              osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, maxzoom: 17, attribution: "© OpenStreetMap contributors" },
            },
            layers: [
              { id: "bg", type: "background", paint: { "background-color": cssVar("--surface2", "#f4ede1") } },
              { id: "osm", type: "raster", source: "osm", layout: { visibility: "none" }, paint: { "raster-opacity": 0.75 } },
              { id: "lake", type: "fill", source: "lake", paint: { "fill-color": cssVar("--lake", "#a9c6d3"), "fill-opacity": 0.55 } },
              { id: "route-w", type: "line", source: "route", paint: { "line-color": cssVar("--ember", "#c4572a"), "line-width": 26, "line-opacity": 0.25 } },
              { id: "route", type: "line", source: "route", paint: { "line-color": cssVar("--ember", "#c4572a"), "line-width": 3, "line-dasharray": [1, 3] } },
              { id: "onsite", type: "fill", source: "onsite", paint: { "fill-color": cssVar("--teal", "#2a8a84"), "fill-opacity": 0.3 } },
              { id: "onsite-l", type: "line", source: "onsite", paint: { "line-color": cssVar("--teal", "#2a8a84"), "line-width": 3 } },
              { id: "town", type: "fill", source: "town", paint: { "fill-color": cssVar("--violet", "#7c4dcc"), "fill-opacity": 0.28 } },
              { id: "town-l", type: "line", source: "town", paint: { "line-color": cssVar("--violet", "#7c4dcc"), "line-width": 3, "line-dasharray": [3, 2] } },
              {
                id: "pts", type: "circle", source: "pts",
                paint: {
                  "circle-radius": 7, "circle-color": cssVar("--bg", "#fbf7f0"), "circle-stroke-width": 4,
                  "circle-stroke-color": ["match", ["get", "ring"], "onsite", cssVar("--teal", "#2a8a84"), "corridor", cssVar("--ember", "#c4572a"), "town", cssVar("--violet", "#7c4dcc"), cssVar("--ink2", "#3a4856")],
                },
              },
            ],
          },
        });
        mapRef.current = map;
        map.addControl(new ml.NavigationControl({ showCompass: false }), "top-right");
        for (const l of LABELS) {
          const d = document.createElement("div");
          d.textContent = l.text;
          d.style.cssText = "font:700 17px var(--font-sans);color:var(--ink);background:color-mix(in srgb,var(--bg) 90%,transparent);padding:3px 9px;border-radius:8px;white-space:nowrap;pointer-events:none";
          new ml.Marker({ element: d, offset: [l.dx + 20, l.dy + 10] }).setLngLat(l.at).addTo(map);
        }
        map.on("load", () => { if (!cancelled) setReady(true); });
        map.on("error", (e) => {
          // Tile errors are expected offline; only a style/WebGL failure is fatal.
          const msg = String(e.error?.message ?? "");
          if (/webgl/i.test(msg)) setReady(false);
        });
        cleanup = () => { map.remove(); mapRef.current = null; };
      } catch {
        if (!cancelled) setReady(false);
      }
    })();
    return () => { cancelled = true; cleanup(); };
  }, [offtakers]);

  useEffect(() => {
    const m = mapRef.current;
    if (m && m.getLayer("osm")) m.setLayoutProperty("osm", "visibility", streets ? "visible" : "none");
  }, [streets]);

  return (
    <div className="relative w-full h-full min-h-[260px]">
      <div className="absolute inset-0" aria-hidden={ready || undefined}><RingMapSvg offtakers={offtakers} townPipeKm={townPipeKm} /></div>
      <div ref={el} className="absolute inset-0 rounded-2xl overflow-hidden" style={{ opacity: ready ? 1 : 0, pointerEvents: ready ? "auto" : "none" }} role="region" aria-label="Interactive map of the three heat rings around the Lansing data center." />
      {ready && <button className="btn absolute bottom-3 left-3 z-10 !min-h-[44px] text-[1rem]" aria-pressed={streets} onClick={() => setStreets((s) => !s)}>
        Streets (needs internet)
      </button>}
    </div>
  );
}

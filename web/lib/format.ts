export const int = (n: number) => Math.round(n).toLocaleString("en-US");
export const dec = (n: number, d = 1) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
export const usd = (n: number) => `${n < 0 ? "-" : ""}$${Math.round(Math.abs(n)).toLocaleString("en-US")}`;
export const gwh = (mwh: number) => `${dec(mwh / 1000, mwh >= 100000 ? 0 : 1)} GWh`;
/** 24,500 -> "24,500"; 1,000,000 -> "1.0 million" for headline use */
export const compact = (n: number) => (n >= 1e6 ? `${dec(n / 1e6, 1)} million` : int(n));
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Imperial display helpers. Model data stays metric; convert only when rendering.
export const cToF = (c: number) => c * 1.8 + 32;
/** Temperature difference (lift, delta T): scale only, no +32. */
export const dCToF = (dc: number) => dc * 1.8;
export const kmToMi = (km: number) => km * 0.621371;
export const mToFt = (m: number) => m * 3.28084;
export const m3ToGal = (m3: number) => m3 * 264.172;
export const haToAcres = (ha: number) => ha * 2.47105;
/** Metric tonnes to US short tons. */
export const tonnesToTons = (t: number) => t * 1.10231;
export const barToPsi = (bar: number) => bar * 14.5038;
export const kgToLb = (kg: number) => kg * 2.20462;

const numStr = (n: number, digits = n < 10 ? 1 : 0) => dec(n, digits);
const num = (s: string) => parseFloat(s.replace(/,/g, ""));
const UNIT_RE = /(\d[\d,]*(?:\.\d+)?)(?:\s?(-|–|to)\s?(\d[\d,]*(?:\.\d+)?))?\s?(°C|km|ha|tonnes?|m³|m3)(?![\w/])/g;
const HECT_RE = /(\d[\d,]*(?:\.\d+)?)([- ])hectares?\b/g;

/** Rewrite metric quantities inside a prose string to US units. Numbers need a digit directly before the unit, so ids, paths and "$/m3" rates are untouched. */
export function imperialText(s: string): string {
  return s
    .replace(HECT_RE, (_m, a: string, sep: string) => {
      const ac = haToAcres(num(a));
      return `${numStr(ac, ac < 10 ? 1 : 0)}${sep}acre${sep === " " && Math.round(ac) !== 1 ? "s" : ""}`;
    })
    .replace(UNIT_RE, (_m, a: string, sep: string | undefined, b: string | undefined, unit: string) => {
      const f: (x: number) => string =
        unit === "°C" ? (x) => String(Math.round(cToF(x)))
        : unit === "km" ? (x) => numStr(kmToMi(x))
        : unit === "ha" ? (x) => numStr(haToAcres(x), haToAcres(x) < 10 ? 1 : 0)
        : unit.startsWith("tonne") ? (x) => int(tonnesToTons(x))
        : (x) => int(m3ToGal(x));
      const u = unit === "°C" ? "°F" : unit === "km" ? "mi" : unit === "ha" ? "acres" : unit.startsWith("tonne") ? "tons" : "gal";
      const first = f(num(a));
      return b !== undefined ? `${first}${sep === "to" ? " to " : sep}${f(num(b))} ${u}` : `${first} ${u}`;
    });
}

/** Deep-copy a JSON value, converting metric quantities inside string values. Numbers and keys are untouched. */
export function imperialize<T>(v: T): T {
  if (typeof v === "string") return imperialText(v) as unknown as T;
  if (Array.isArray(v)) return v.map(imperialize) as unknown as T;
  if (v && typeof v === "object") {
    const o: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) o[k] = imperialize(x);
    return o as T;
  }
  return v;
}

const sig = (n: number) => Number(n.toPrecision(3));
/** One input-register row in US units. `input` is the config key; its suffix disambiguates units like "m2". */
export function imperialInput(input: string, value: unknown, unit: string): { value: string | number; unit: string } {
  const same = { value: value as string | number, unit };
  if (typeof value !== "number") return same;
  const k = input.toLowerCase();
  const o = (n: number, u: string) => ({ value: sig(n), unit: u });
  if (k.endsWith("yield_kg_m2")) return o(kgToLb(value) / 10.7639, "lb/ft²");
  if (k.endsWith("kwh_m2")) return o(value / 10.7639, "kWh/ft²");
  if (unit === "C") return o(cToF(value), "°F");
  if (unit === "K") return o(dCToF(value), "°F (difference)");
  if (unit === "km") return o(kmToMi(value), "mi");
  if (unit === "ha") return o(haToAcres(value), "acres");
  if (unit === "m2") return o(value * 10.7639, "ft²");
  if (unit === "m") return o(mToFt(value), "ft");
  if (unit === "m/s") return o(mToFt(value), "ft/s");
  if (unit === "t/yr") return o(tonnesToTons(value), "tons/yr");
  if (unit === "W/m2K") return o(value * 0.17611, "BTU/h·ft²·°F");
  if (unit === "$/m3") return o(value / m3ToGal(1), "$/gal");
  if (unit === "$/m") return o(value / mToFt(1), "$/ft");
  if (unit === "Pa/m") return o(value * 0.0442, "psi per 100 ft");
  return same;
}

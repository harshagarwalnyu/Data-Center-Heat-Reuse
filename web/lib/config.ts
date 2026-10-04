// Configurable constants (copy/links, not data).
export const PUBLIC_URL = "https://github.com/harshagarwalnyu/Data-Center-Heat-Reuse"; // public repo; the live demo runs locally
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
// CBA annuity basis shown in the Story; must match extras.cba (7%, 30 yr) in outputs/site2.json.
export const CBA_ANNUITY = { ratePct: 7, years: 30 } as const;
export const PROJECT_TITLE = "Thermal Commons";
export const PROJECT_TAGLINE = "Heat for Lansing";
export const CREDITS = "Thermal Commons: Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev. NYU Hackathon 2026, HDR x Grundfos Data Center Heat Reuse Challenge.";
export const PROJECT_SUB = "Turning a data center's waste heat into a community utility";

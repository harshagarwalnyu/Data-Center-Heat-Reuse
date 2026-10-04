const fs=require("fs");
function edit(f,R){let s=fs.readFileSync(f,"utf8");for(const [a,b] of R){if(!s.includes(a)){console.log("MISSING",f,a.slice(0,60));continue;}s=s.split(a).join(b);}fs.writeFileSync(f,s);}
edit("lib/config.ts",[['export const PUBLIC_URL = "https://lansing-heat.vercel.app"; // TODO: replace with the deployed URL','export const PUBLIC_URL = "https://github.com/harshagarwalnyu/Data-Center-Heat-Reuse"; // public repo; the live demo runs locally']]);
edit("components/ui.tsx",[['  { href: "/compare/", label: "Compare sites" },','  { href: "/compare/", label: "Compare sites" },\n  { href: "/how/", label: "How it works" },']]);
edit("components/story/Story.tsx",[
["const [short, setShort] = useState(false);","const [short, setShort] = useState(true); // default = ~5-minute path; S toggles the deep dive"],
['title="Skip the deep-dive steps (key S)">5-minute path</button>','title="Switch between the 5-minute path and the full deep dive (key S)">{short ? "Show deep dive" : "Back to 5-minute path"}</button>'],
["S short path</span>","S deep dive on/off</span>"],
['const h = parseInt(window.location.hash.replace("#", ""), 10);\n    if (h >= 1 && h <= steps.length) setI(h - 1);','const h = parseInt(window.location.hash.replace("#", ""), 10);\n    if (h >= 1 && h <= steps.length) { setI(h - 1); if (steps[h - 1].deepDive) setShort(false); }'],
]);
edit("components/Compare.tsx",[
['{ k: "Average heat pump COP", unit: "", v2: dec(a.totals.avg_cop, 1), v1: dec(b.totals.avg_cop, 1), better: a.totals.avg_cop >= b.totals.avg_cop ? "2" : "1" },',
 '{ k: "Heat pump COP at capture temperature (capped at 6)", unit: "", v2: dec(copA, 1), v1: dec(copB, 1), better: copA >= copB ? "2" : "1" },'],
["  const sel = site === 2 ? a : b;","  const sel = site === 2 ? a : b;\n  const s1pts = typeof b.why_not_chosen === \"string\" ? b.why_not_chosen.split(/\\(\\d\\)\\s*/).filter(Boolean).map((t) => t.trim()).filter((t) => !/LCOH|CO2 benefit/i.test(t)) : [];\n  const gen: string[] = [\n    `Cost of heat is $${int(b.finance.lcoh_usd_mwh.coop_4pct)} per MWh at Site 1 versus $${int(a.finance.lcoh_usd_mwh.coop_4pct)} at Lansing under community finance.`,\n    b.impact.co2_avoided_t_yr > a.impact.co2_avoided_t_yr ? `Site 1 avoids slightly more CO₂ in total (${int(b.impact.co2_avoided_t_yr)} versus ${int(a.impact.co2_avoided_t_yr)} t per year); the Lansing edge is delivered heat, cost and a decision that is live now.` : `Lansing avoids more CO₂ (${int(a.impact.co2_avoided_t_yr)} versus ${int(b.impact.co2_avoided_t_yr)} t per year).`,\n  ];"],
["  const a = data.site2, b = data.site1;","  const a = data.site2, b = data.site1;\n  const copA = a.cop_compare[a.cop_compare.length - 1]?.cop ?? a.totals.avg_cop;\n  const copB = b.cop_compare[0]?.cop ?? b.totals.avg_cop;"],
['{typeof b.why_not_chosen === "string" ? b.why_not_chosen.split(/\\(\\d\\)\\s*/).filter(Boolean).map((t, i) => <li key={i}>{t.trim()}</li>) :','{typeof b.why_not_chosen === "string" ? [...s1pts, ...gen].map((t, i) => <li key={i}>{t}</li>) :'],
['A check mark shows the better value on that row.','A check mark shows the better value on that row. Site 1 totals include its central town-ring heat pump; Lansing totals cover Phases 1-2 only, so the COP row compares like-for-like capture temperatures.'],
]);

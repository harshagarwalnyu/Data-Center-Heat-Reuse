const fs=require("fs");
const f="components/PrintSheet.tsx";let s=fs.readFileSync(f,"utf8");
const R=[
["  const demand = d.rings.reduce((s, r) => s + r.annual_MWh, 0);","  const demand = d.totals.heat_delivered_MWh;\n  const ha = d.extras?.greenhouse_check?.area_ha;\n  const cbaPct = d.extras?.cba?.pct_of_build;"],
["One data center could heat {int(homes)} homes and a year-round farm","A data center&rsquo;s heat could warm a {ha ? `${int(ha)}-hectare ` : \"\"}year-round farm and {int(homes)} homes"],
["p-[0.5in] flex flex-col gap-3","p-[0.4in] flex flex-col gap-2"],
['fontSize: "25pt"','fontSize: "23pt"'],
["<QrCode url={PUBLIC_URL} size={96} />","<QrCode url={PUBLIC_URL} size={84} hideCaption />"],
["scan for the live model.</div>","scan for the live model: {PUBLIC_URL}</div>"],
];
for(const [a,b] of R){if(!s.includes(a))console.log("MISSING",a.slice(0,50));s=s.split(a).join(b);}
fs.writeFileSync(f,s);

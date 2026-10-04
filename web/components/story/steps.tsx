"use client";
import type { ReactNode } from "react";
import type { AppData } from "@/lib/types";
import { dec, int, usd } from "@/lib/format";
import { RingMap } from "../viz/RingMap";
import { Sankey } from "../viz/Sankey";
import { HouseholdCalc, QrCode, RatioBars, TempLadder } from "../viz/Misc";
import { LcohBars, MonthlyChart, WeekChart } from "../viz/Charts";
import { RingDot, ringColor, ringText, ringShort } from "../ui";
import { PUBLIC_URL } from "@/lib/config";

export interface Step {
  id: string;
  kicker: string;
  headline: ReactNode;
  lede?: ReactNode;
  layout: "split" | "wide";
  visual?: ReactNode;
  /** Replaces the whole screen (own headline). */
  full?: ReactNode;
  notes: string;
  /** Deep-dive steps are skipped on the 5-minute path. */
  deepDive?: boolean;
}

function Tile({ big, unit, label, tone }: { big: string; unit?: string; label: ReactNode; tone?: "ember" | "teal" | "violet" }) {
  const c = tone === "teal" ? "var(--teal-text)" : tone === "violet" ? "var(--violet-text)" : "var(--ember-text)";
  return (
    <div className="card p-5">
      <div className="serif num font-bold leading-none" style={{ color: c, fontSize: "clamp(2.25rem,4vw,3.75rem)" }}>{big}{unit && <span className="unit">{unit}</span>}</div>
      <div className="mt-2 text-[1.125rem] text-ink">{label}</div>
    </div>
  );
}

function Pill({ n, title, children, tone }: { n?: string; title: string; children: ReactNode; tone?: string }) {
  return (
    <div className="card p-4 h-full">
      <div className="font-bold text-[1.125rem]" style={{ color: tone ?? "var(--ink)" }}>{n && <span className="num mr-1">{n}</span>}{title}</div>
      <div className="text-[1.0625rem] text-ink2 leading-snug mt-1">{children}</div>
    </div>
  );
}

export function buildSteps(data: AppData): Step[] {
  const d = data.site2;
  const f = d.finance;
  const T = d.totals;
  const availMWh = d.supply.heat_available_GWh * 1000;
  const demandAll = d.rings.reduce((s, r) => s + r.annual_MWh, 0);
  const ratio = availMWh / demandAll;
  const corridor = d.rings.find((r) => r.id === "corridor");
  const homes = corridor?.homes ?? d.impact.homes_served;
  const minMonthRatio = Math.min(...d.monthly.map((m) => m.supply_MWh / m.demand_MWh));
  const peakMonth = Math.max(...d.monthly.map((m) => m.demand_MWh));
  const lowMonth = Math.min(...d.monthly.map((m) => m.demand_MWh));
  const totalPeak = d.rings.reduce((s, r) => s + r.peak_MW, 0);
  const storageMWh = (d.totals.storage_m3 * 1.163 * 40) / 1000; // water: 1.163 kWh/m3/K, 40 K swing
  const storageHours = storageMWh / totalPeak;
  const allBeatOil = f.lcoh_usd_mwh.private_10pct < Math.min(f.incumbent_usd_mwh.propane, f.incumbent_usd_mwh.heating_oil);
  const backupPct = (T.backup_MWh / T.heat_delivered_MWh) * 100;
  const cleanCarbonCars = d.impact.co2_cars_equiv;

  return [
    {
      id: "fight",
      kicker: "1 · Lansing today",
      headline: "Lansing is about to ban data centers, and most of its heat still comes from delivered fuel",
      lede: "Communities no longer accept jobs and taxes alone as the reason to say yes. The town needs something it can feel in its own bills.",
      layout: "split",
      notes: "Open with the fight, not the technology. On Sept 29 the Town Board told its attorney to draft a ban; 36 of 38 speakers opposed; $500,000 legal reserve. Meanwhile NYSEG has had a gas moratorium here since 2014, so many homes burn propane or oil. Frame: we are not defending the project, we are offering the conditions under which Lansing could say yes.",
      visual: (
        <div className="grid gap-4">
          <Tile big="36 of 38" label="public speakers opposed the data center at the Sept 29 Town Board meeting; a ban is being drafted" />
          <Tile tone="teal" big="2014" label="year NYSEG stopped new gas hookups. Rural Lansing has no gas pipe." />
          <Tile big={`$${int(f.incumbent_usd_mwh.propane)}`} unit="per MWh" label={<>what a propane home pays for each MWh of heat. Heating oil: <b className="num">${int(f.incumbent_usd_mwh.heating_oil)}</b>.</>} />
        </div>
      ),
    },
    {
      id: "insight",
      kicker: "2 · The insight",
      headline: <>The data center throws away <span className="text-ember-text num">{dec(ratio, 1)}&times;</span> more heat than Lansing can use</>,
      lede: <>About {int(d.supply.capture_fraction * 100)}% of a {int(d.supply.it_load_MW)} MW campus&rsquo;s power can be captured as {d.supply.capture_temp_C} °C heat. Supply is not the constraint. Matching it to users is.</>,
      layout: "split",
      notes: "This is the whole thesis. Supply is effectively unlimited: demand is the constraint, so we design from the user side. The data center is a 150 MW phase 1; 300-400 MW is a build-out scenario that only widens the gap. Heat is only waste if we choose to waste it.",
      visual: <RatioBars d={d} />,
    },
    {
      id: "plan",
      kicker: "3 · The plan",
      headline: `One data center could heat ${int(homes)} homes and a year-round farm`,
      lede: "Bring the users to the heat. Start next to the data center, then follow the road toward town, and reach the town center only if the numbers pass.",
      layout: "split",
      notes: "Three rings. Ring 1, Phase 1: on-site greenhouse, aquaculture and a community rec center with pool on the unleased acreage; a year-round sink with no public trenching. Ring 2: homes and farms along the road on an ambient loop, gated by sign-up density. Ring 3: school campus and town buildings, 5-7 miles away, built only if its cost of heat beats propane and oil.",
      visual: (
        <div className="grid gap-4 grid-rows-[minmax(0,1fr)_auto] h-full min-h-0">
          <div className="min-h-[260px]"><RingMap offtakers={data.offtakers} /></div>
          <ul className="grid gap-2 list-none p-0 m-0 sm:grid-cols-3">
            {d.rings.map((r) => (
              <li key={r.id} className="card p-3">
                <div className="font-bold text-[1.0625rem]" style={{ color: ringText(r.id) }}><RingDot ring={r.id} />Phase {r.phase}: {ringShort(r.id)}{r.conditional ? " (if it pays)" : ""}</div>
                <div className="num text-[1.0625rem]">{int(r.annual_MWh / 1000)} GWh/yr · {dec(r.peak_MW, 0)} MW peak</div>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: "flow",
      kicker: "4 · How heat flows",
      headline: "Heat export is a side-stream. The data center never depends on Lansing to stay cool",
      lede: <>A heat exchanger takes heat from the sealed cooling loop; heat pumps lift it where needed. The dry coolers keep working exactly as designed.</>,
      layout: "split",
      notes: "Cooling reliability is the hard constraint. The data center rejects 100% of its heat through its own dry coolers whether or not anyone takes heat. We tap a side-stream off the closed glycol loop, so a failure on our side cannot starve the servers. Heat pumps are the only extra electricity: shown in amber.",
      visual: <div className="h-full min-h-[300px]"><Sankey d={d} /></div>,
    },
    {
      id: "ladder",
      kicker: "5 · Temperature ladder",
      headline: `Liquid cooling hands over ${d.supply.capture_temp_C} °C heat: greenhouses take it directly, buildings get a small boost`,
      lede: <>Average heat-pump COP across the network is <b className="num">{dec(T.avg_cop, 1)}</b>: one unit of electricity moves about {dec(T.avg_cop, 1)} units of heat.</>,
      layout: "split",
      deepDive: true,
      notes: "Temperature match. Air-cooled data centers hand over about 30 °C heat, which needs a big lift. Direct liquid cooling returns about 50 °C, so the greenhouse and aquaculture sit at or below source temperature and need no heat pump. Homes need the loop plus a building heat pump; town buildings need a 55-65 °C hot loop. Show the COP comparison between air and liquid.",
      visual: (
        <div className="grid gap-3 h-full min-h-0">
          <div className="min-h-[360px]"><TempLadder data={data} /></div>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 list-none p-0 m-0 text-[1.0625rem]">
            {d.cop_compare.map((c) => (<li key={c.source}><b>{c.source}</b>: heat pump COP <b className="num text-teal-text">{dec(c.cop, 1)}</b></li>))}
          </ul>
        </div>
      ),
    },
    {
      id: "match",
      kicker: "6 · Matching through the year",
      headline: `Even in the leanest month, the data center makes ${dec(minMonthRatio, 1)}× the heat the network needs`,
      layout: "wide",
      notes: "Five axes of the match, left to right. Temperature: direct or lifted. Capacity: supply is many times demand. Timing: the winter week chart shows daily peaks smoothed by storage. Seasonality: monthly bars show demand falling in summer while the on-site greenhouse, aquaculture and pool keep a year-round base. Continuity: backup covers the remainder, zero unmet hours.",
      visual: (
        <div className="grid gap-4 h-full min-h-0 grid-rows-[auto_minmax(0,1fr)]">
          <ul className="grid gap-3 grid-cols-2 lg:grid-cols-5 list-none p-0 m-0">
            <li><Pill n="1" title="Temperature" tone="var(--ember-text)">{d.supply.capture_temp_C} °C capture. On-site direct; homes and town via heat pumps, COP {dec(T.avg_cop, 1)}.</Pill></li>
            <li><Pill n="2" title="Capacity" tone="var(--ember-text)">{dec(ratio, 1)}× more heat than the {int(demandAll / 1000)} GWh/yr demand.</Pill></li>
            <li><Pill n="3" title="Timing" tone="var(--ember-text)">Storage ({int(T.storage_m3)} m³, about {dec(storageHours, 0)} h of peak) smooths daily peaks.</Pill></li>
            <li><Pill n="4" title="Seasonality" tone="var(--ember-text)">Summer demand is {int((lowMonth / peakMonth) * 100)}% of January; on-site users keep the base load.</Pill></li>
            <li><Pill n="5" title="Continuity" tone="var(--ember-text)">{int(T.unmet_hours)} unmet hours; backup supplies {dec(backupPct, 1)}% of heat.</Pill></li>
          </ul>
          <div className="grid gap-5 lg:grid-cols-2 min-h-0">
            <div className="min-h-[280px]"><MonthlyChart d={d} /></div>
            <div className="min-h-[280px]"><WeekChart d={d} /></div>
          </div>
        </div>
      ),
    },
    {
      id: "household",
      kicker: "7 · Your household",
      headline: "",
      layout: "wide",
      deepDive: true,
      notes: "Let someone in the room pick their own fuel. Propane and oil homes save the most; natural gas homes would not save, which is why this is aimed at the homes gas never reached. The tariff is set about 20% below propane; there is a low-income tier. Be honest about gas.",
      full: <HouseholdCalc d={d} />,
    },
    {
      id: "own",
      kicker: "8 · Who pays, who owns",
      headline: allBeatOil ? "Heat from the data center beats propane and oil under every ownership model; community ownership is cheapest" : `Community ownership cuts the cost of heat from $${int(f.lcoh_usd_mwh.private_10pct)} to $${int(f.lcoh_usd_mwh.coop_4pct)} per MWh`,
      layout: "split",
      notes: "A community thermal utility (co-op or municipal) owns the pipes and heat pumps; the data center sells heat under a Heat Supply Agreement. Cheaper money is the biggest lever: public 4% finance vs private 10%. Be transparent that natural gas elsewhere is cheaper, but there are no new gas hookups in Lansing. Federal commercial credit (Sec. 48, with energy-community bonus) and NYSERDA programs sit on top and are not in the base case.",
      visual: (
        <div className="grid gap-4 h-full min-h-0 grid-rows-[auto_minmax(0,1fr)]">
          <div className="grid grid-cols-[1fr_auto_1.2fr_auto_1fr] items-stretch gap-2 text-center">
            <div className="card p-3"><b>Data center</b><div className="text-[1rem] text-ink2">sells heat, keeps cooling independent</div></div>
            <div aria-hidden className="self-center text-[1.75rem] text-ember">&rarr;</div>
            <div className="card p-3" style={{ borderColor: "var(--teal)", borderWidth: 2 }}><b>Community thermal utility</b><div className="text-[1rem] text-ink2">owns pipes + heat pumps · ${int(f.capex_musd.total)}M capex · public finance</div></div>
            <div aria-hidden className="self-center text-[1.75rem] text-ember">&rarr;</div>
            <div className="card p-3"><b>Homes, farms, school</b><div className="text-[1rem] text-ink2">pay ${int(f.tariff_usd_mwh)} per MWh · low-income ${int(f.low_income_tariff_usd_mwh)}</div></div>
          </div>
          <div className="min-h-[300px]"><LcohBars d={d} /></div>
        </div>
      ),
    },
    {
      id: "exit",
      kicker: "9 · What if the data center leaves?",
      headline: `If the data center leaves in year ${f.dc_exit.year}, the heat keeps flowing and the town is not left holding the bill`,
      layout: "wide",
      notes: "Data centers rarely sign beyond about 10 years, so we answer this before the Q&A does. Three layers: thermal storage rides through the first hours; backup boilers sized to 100% of peak cover days; step-in rights let the utility keep the loop. The stranded-asset exposure is covered by a decommissioning reserve funded from the Heat Supply Agreement, so the risk sits with the party that controls it.",
      visual: (
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { t: "First hours", h: "Storage carries the load", b: `${int(d.totals.storage_m3)} m³ of hot water holds about ${dec(storageHours, 0)} hours of peak demand.` },
            { t: "Days", h: "Backup boilers take over", b: `Sized for 100% of ${dec(totalPeak, 0)} MW peak. Today they cover ${dec(backupPct, 1)}% of annual heat.` },
            { t: "Months", h: "Step-in rights", b: "The utility can keep running the loop. Fallback: " + f.dc_exit.fallback },
            { t: `Year ${f.dc_exit.year}`, h: "Reserve covers the stranded asset", b: `Exposure of about $${dec(f.dc_exit.stranded_musd, 0)}M is covered by a decommissioning reserve in the Heat Supply Agreement.` },
          ].map((s, i) => (
            <div key={s.t} className="card p-5 relative">
              <div className="kicker">{s.t}</div>
              <div className="serif font-bold text-[1.5rem] leading-tight mt-1">{s.h}</div>
              <p className="text-ink2 mt-2 mb-0 text-[1.0625rem]">{s.b}</p>
              {i < 3 && <span aria-hidden className="hidden md:block absolute -right-4 top-1/2 text-[1.75rem] text-ember z-10">&rarr;</span>}
            </div>
          ))}
          <p className="md:col-span-4 m-0 text-[1.125rem] text-ink2">The data center&rsquo;s own cooling never depended on this network, so its exit is a heat-supply problem, not a safety problem.</p>
        </div>
      ),
    },
    {
      id: "impact",
      kicker: "10 · Impact",
      headline: `Every year: ${int(d.impact.co2_avoided_t_yr)} tonnes of CO₂ avoided, ${int(d.impact.jobs)} local jobs, ${int(d.impact.local_food_t_yr)} tonnes of local food`,
      layout: "wide",
      notes: "Map it to the four judging lenses and HDR's seven regenerative domains. Technical and economic were covered in steps 4 to 8. Environmental: CO2 avoided is displaced fuel minus heat-pump electricity at the upstate grid factor. Social and regenerative: Lansing has no designated disadvantaged community, so equity here means older residents and propane and oil households. Lake: closed-loop aquaponics keeps phosphorus out of an already phosphorus-impaired Cayuga Lake.",
      visual: (
        <div className="grid gap-4 min-h-0">
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <Tile tone="teal" big={int(d.impact.co2_avoided_t_yr)} unit="t CO₂/yr" label={<>about {int(cleanCarbonCars)} cars off the road</>} />
            <Tile big={int(d.impact.homes_served)} unit="homes" label="on recovered heat" />
            <Tile tone="violet" big={int(d.impact.jobs)} unit="jobs" label="on the on-site campus" />
            <Tile big={int(d.impact.local_food_t_yr)} unit="t food/yr" label="grown with heat, in winter too" />
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {d.hdr_scorecard.map((s) => (
              <div key={s.petal} className="card p-3">
                <div className="flex items-center gap-2 font-bold text-[1.0625rem]">
                  <span className="chip !py-0.5 !px-2.5 !text-[0.9375rem]" style={{ borderColor: s.lens === "Community" ? "var(--violet)" : s.lens === "Health" ? "var(--ember)" : "var(--teal)" }}>{s.lens}</span>
                  {s.petal}
                </div>
                <div className="text-[1rem] text-ink2 leading-snug mt-1">{s.claim}</div>
              </div>
            ))}
            <div className="card p-3" style={{ background: "var(--surface2)" }}>
              <div className="font-bold text-[1.0625rem]">Lansing context</div>
              <div className="text-[1rem] text-ink2 leading-snug mt-1">No designated disadvantaged community: equity here means older residents and propane and oil households. Up to 69 days above 90 °F by 2050 (19 today).</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "ask",
      kicker: "11 · The ask",
      headline: "Say yes with conditions: write heat reuse into a binding Community Benefit and Heat Supply Agreement",
      layout: "split",
      notes: "Close on three asks. Town: make heat reuse a condition of any approval. TeraWulf: sign the Heat Supply Agreement, keep cooling independent, keep the 1 MGD lake permit unused for cooling. Funders: NYSERDA FlexTech and large-scale thermal programs to pay for the feasibility work. Point to the QR code for the live model.",
      visual: (
        <div className="grid gap-4">
          {[
            { who: "Town of Lansing", what: "Make a Heat Supply Agreement a condition of any approval, instead of a flat ban." },
            { who: "The data center", what: "Sign it: sell heat, keep cooling independent, keep the lake permit unused for cooling, fund the exit reserve." },
            { who: "Funders and state", what: "Co-fund the feasibility study and the Phase 1 on-site campus (NYSERDA programs, federal commercial credit)." },
          ].map((a, i) => (
            <div key={a.who} className="card p-4 flex gap-4 items-start">
              <div className="serif num font-bold text-[2.5rem] leading-none text-ember-text">{i + 1}</div>
              <div><div className="font-bold text-[1.25rem]">{a.who}</div><div className="text-ink2 text-[1.125rem] leading-snug">{a.what}</div></div>
            </div>
          ))}
          <div className="flex items-center gap-5 card p-4">
            <QrCode url={PUBLIC_URL} size={120} />
            <div className="text-[1.125rem]"><b>Try the model yourself.</b><div className="text-ink2">Move the sliders in Explore mode and watch the cost of heat change.</div></div>
          </div>
        </div>
      ),
    },
  ];
}

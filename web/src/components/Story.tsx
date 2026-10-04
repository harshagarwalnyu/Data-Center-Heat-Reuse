"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site, ringById, RING_COLOR, FUEL_LABEL } from "@/lib/data";
import { gwh, musd, num, pct, perMWh, round, usd } from "@/lib/fmt";
import { HBars, MonthlyColumns, WeekChart } from "./charts";
import { SiteMap } from "./SiteMap";
import { Hero, Ladder, Stat, Status } from "./ui";

const onsite = ringById("onsite");
const corridor = ringById("corridor");
const town = ringById("town");
const fin = site.finance;
const imp = site.impact;
const tariff = fin.tariff_usd_mwh;
const propane = fin.incumbent_usd_mwh.propane;
const homesAllMWh = site.context.town_households * fin.household.typical_MWh_yr;
const availMWh = site.supply.heat_available_GWh * 1000;
const liquid = site.cop_compare.find((c) => c.source.startsWith("Liquid"))!;
const air = site.cop_compare.find((c) => c.source.startsWith("Air"))!;
const exit = fin.dc_exit;
const winterOutage = site.supply.outages[0];
const gatePath = corridor.gate.path!;
const firstIn = corridor.gate.first_in!;
const lastStep = gatePath[gatePath.length - 1];
const cheaperStep = gatePath.find((p) => p.label.includes("cheaper build"))!;
const baseboard = firstIn.find((f) => f.fuel === "electric_resistance")!;
const townLossShare = town.network_loss_MWh / (town.network_loss_MWh + town.annual_MWh);
const julyShare = site.monthly[6].demand_MWh / (site.monthly.reduce((a, m) => a + m.demand_MWh, 0) / 12);

type Slide = { kicker: string; title: string; lens?: string; body: React.ReactNode; visual: React.ReactNode };

export const slides: Slide[] = [
  {
    kicker: "Lansing, NY · October 2026",
    title: "Lansing is moving to ban data centers.",
    lens: "Social",
    body: (
      <>
        <p>
          On September 29 the Town Board told its attorney to draft a ban on data centers. {site.context.ban_speakers_opposed} speakers
          opposed TeraWulf&apos;s Lake Hawkeye campus on the former Cayuga coal plant site, and the town set aside{" "}
          {usd(site.context.ban_legal_reserve_usd)} for a legal fight.
        </p>
        <p className="font-semibold">This proposal asks one question: under what conditions could Lansing say yes?</p>
      </>
    ),
    visual: (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Phase 1 data center" value={`${site.supply.it_load_MW} MW`} sub="TeraWulf, Lake Hawkeye" />
        <Stat label="Speakers opposed" value={site.context.ban_speakers_opposed.replace(" of ", " / ")} sub="Town Board hearing, Sept 29" />
        <Stat label="New gas hookups" value="None" sub="NYSEG moratorium since 2014" />
      </div>
    ),
  },
  {
    kicker: "The insight",
    title: "The data center makes far more heat than Lansing could ever use.",
    lens: "Technical",
    body: (
      <>
        <p>
          With direct liquid cooling, {pct(site.supply.capture_fraction)} of the server heat leaves in water at {site.supply.capture_temp_C} °C. That
          is {gwh(availMWh)} a year, about {num(availMWh / homesAllMWh, 0)} times what every home in the town needs.
        </p>
        <p className="font-semibold">Supply is not the constraint. Demand is. So we design from the demand side.</p>
      </>
    ),
    visual: (
      <div className="space-y-6">
        <Hero value={gwh(availMWh)} label="Recoverable heat per year, Phase 1" />
        <HBars
          title="Heat per year, GWh"
          unit="GWh"
          rows={[
            { label: "Recoverable from the data center", value: availMWh / 1000, valueLabel: gwh(availMWh) },
            { label: `All ${num(site.context.town_households)} Lansing households`, value: homesAllMWh / 1000, valueLabel: gwh(homesAllMWh) },
            { label: "Phase 1 campus uses", value: onsite.annual_MWh / 1000, valueLabel: gwh(onsite.annual_MWh) },
          ]}
        />
      </div>
    ),
  },
  {
    kicker: "Where the heat goes",
    title: "Bring users to the heat, not heat to the users.",
    lens: "Technical",
    body: (
      <>
        <p>Three rings, each built only if it pays its way.</p>
        <ul className="space-y-2">
          <li><RingDot id="onsite" /> <strong>Ring 1:</strong> an agri-food and community campus on the plant site.</li>
          <li><RingDot id="corridor" /> <strong>Ring 2:</strong> homes and farms within about 3 km, on a low-temperature loop.</li>
          <li><RingDot id="town" /> <strong>Ring 3:</strong> the school campus and town buildings, 10 to 13 km away.</li>
        </ul>
      </>
    ),
    visual: <SiteMap />,
  },
  {
    kicker: "Temperature",
    title: "Liquid cooling makes the heat usable without a heat pump.",
    lens: "Technical",
    body: (
      <>
        <p>
          Greenhouses and fish tanks need about {onsite.supply_temp_C} °C. Liquid-cooled racks return water at {site.supply.capture_temp_C} °C, so the campus
          takes heat straight through a heat exchanger.
        </p>
        <p>
          Where hotter water is needed, the lift is small: a heat pump runs at a COP of {num(liquid.cop, 1)} from liquid-cooled heat, against{" "}
          {num(air.cop, 1)} from air-cooled heat.
        </p>
      </>
    ),
    visual: (
      <Ladder
        rows={[
          { temp: 65, label: "Town buildings", detail: `heat pump, COP ${num(liquid.cop, 1)}`, color: "var(--s3)" },
          { temp: 50, label: "Liquid-cooled racks", detail: "captured heat", color: "var(--ink)" },
          { temp: 45, label: "Greenhouse, aquaculture, pool", detail: "direct, no heat pump", color: "var(--s1)" },
          { temp: 30, label: "Air-cooled racks", detail: "too cool to use directly", color: "var(--muted)" },
          { temp: 20, label: "Ambient loop to homes", detail: "heat pump in each home", color: "var(--s2)" },
        ]}
      />
    ),
  },
  {
    kicker: "Phase 1",
    title: `A campus that turns waste heat into food and jobs, at ${perMWh(onsite.gate.lcoh_usd_mwh)}.`,
    lens: "Economic",
    body: (
      <>
        <p>
          A {num(onsite.greenhouse_ha!)} hectare greenhouse, a recirculating fish farm, and a community rec center with a pool, all on the plant site. They use heat
          year round, so the pipes earn their keep in summer too.
        </p>
        <p>
          Heat costs {perMWh(onsite.gate.lcoh_usd_mwh)} to deliver, against {perMWh(propane)} for propane. Capital cost is{" "}
          {musd(onsite.capex_musd)}.
        </p>
      </>
    ),
    visual: (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <Stat label="Heat delivered" value={gwh(onsite.annual_MWh)} sub="per year" />
          <Stat label="Jobs" value={num(imp.jobs)} sub="on-site, ongoing" />
          <Stat label="Local food" value={`${num(imp.local_food_t_yr)} t`} sub="per year" />
        </div>
        <HBars
          title="Who uses the heat, GWh per year"
          unit="GWh"
          rows={Object.entries(onsite.users_MWh).map(([k, v]) => ({
            label: k[0].toUpperCase() + k.slice(1),
            value: v / 1000,
            valueLabel: gwh(v),
          }))}
        />
      </div>
    ),
  },
  {
    kicker: "Reliability",
    title: "When the data center stops, the heat keeps flowing.",
    lens: "Technical",
    body: (
      <>
        <p>
          The model knocks out all data-center heat for {winterOutage.hours} hours during the coldest week of the year, at −19 °C. The storage tank
          carries the first hours, then the backup boiler takes over.
        </p>
        <p>
          Over all 8,760 hours of the year: <strong>{site.totals.unmet_hours} hours without heat.</strong> Data-center cooling never depends on
          the heat users; the dry coolers stay sized for 100%.
        </p>
      </>
    ),
    visual: <WeekChart rows={site.weeks.winter} title="Coldest week, on-site campus, hourly MW" />,
  },
  {
    kicker: "Seasons",
    title: "The campus still takes heat in July.",
    lens: "Technical",
    body: (
      <>
        <p>
          Homes need heat in winter only. Greenhouses, fish tanks and a pool need it all year. July demand is {pct(julyShare)} of an average
          month, which keeps the heat exchanger and pipes busy.
        </p>
        <p>Backup fuel is {num(site.totals.backup_MWh)} MWh a year, used only during the two modelled outages.</p>
      </>
    ),
    visual: <MonthlyColumns rows={site.monthly} />,
  },
  {
    kicker: "The gate",
    title: "Every phase has to earn its way in.",
    lens: "Economic",
    body: (
      <>
        <p>A ring is built only when its cost of heat beats what its users pay today. We ran the test on all three.</p>
        <ul className="space-y-2">
          <li><Status pass={true}>Ring 1 passes</Status> at {perMWh(onsite.gate.lcoh_usd_mwh)} against a {perMWh(tariff)} tariff.</li>
          <li><Status pass={null}>Ring 2 is not there yet</Status>; the next slide shows what it takes.</li>
          <li><Status pass={false}>Ring 3 fails</Status> and we say no to it.</li>
        </ul>
      </>
    ),
    visual: (
      <HBars
        title="Cost of heat vs what users pay today, $/MWh (co-op financing at 4%)"
        unit="$/MWh"
        max={260}
        rows={[onsite, corridor, town].map((r) => ({
          label: r.name,
          value: r.gate.lcoh_usd_mwh,
          valueLabel: perMWh(r.gate.lcoh_usd_mwh),
          color: RING_COLOR[r.id],
          marker: { value: r.gate.benchmark_usd_mwh, label: r.gate.benchmark },
        }))}
      />
    ),
  },
  {
    kicker: "Phase 2",
    title: "What has to be true before homes connect.",
    lens: "Economic",
    body: (
      <>
        <p>
          Today it costs about {usd(round(gatePath[0].capex_per_home_usd, 500))} per home to build the loop and connect a house. Grants alone
          don&apos;t close the gap. With grants and a cheaper build, heat costs {perMWh(cheaperStep.lcoh_usd_mwh)}, less than the{" "}
          {perMWh(propane)} every propane home pays today.
        </p>
        <p>
          {lastStep.passes
            ? <>Lower upkeep on top brings it to {perMWh(lastStep.lcoh_usd_mwh)}, under the {perMWh(tariff)} tariff, so the 25% discount is funded.</>
            : <>Lower upkeep on top gets within {usd(lastStep.lcoh_usd_mwh - tariff, 2)}/MWh of the {perMWh(tariff)} tariff. Funding the full
              25% discount is the last step still to prove.</>}
        </p>
        <p className="font-semibold">
          {FUEL_LABEL[baseboard.fuel]} homes ({pct(baseboard.share_of_homes)} of the corridor, paying {perMWh(baseboard.incumbent_usd_mwh)}) come out
          ahead at today&apos;s cost. They connect first.
        </p>
      </>
    ),
    visual: (
      <HBars
        title={`Corridor cost of heat, step by step, $/MWh (tariff ${perMWh(tariff)})`}
        unit="$/MWh"
        max={220}
        rows={gatePath.map((p) => ({
          label: p.label,
          value: p.lcoh_usd_mwh,
          valueLabel: perMWh(p.lcoh_usd_mwh),
          color: "var(--s2)",
          note: p.passes ? "✓ passes" : undefined,
          marker: { value: tariff, label: "tariff" },
        }))}
      />
    ),
  },
  {
    kicker: "Phase 3",
    title: "We tested a pipe to the town center. It fails, so we say no.",
    lens: "Economic",
    body: (
      <>
        <p>
          The school and town buildings sit {num(town.pipe_km)} km of pipe away. Over that distance {pct(townLossShare)} of the heat sent is lost
          from the pipe, and no grant level closes the gap.
        </p>
        <p>They keep their existing gas boilers. A future, closer heat user could reopen the case.</p>
      </>
    ),
    visual: (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Pipe length" value={`${num(town.pipe_km)} km`} />
        <Stat label="Heat lost in the pipe" value={pct(townLossShare)} />
        <Stat label="Cost of heat" value={perMWh(town.gate.lcoh_usd_mwh)} sub={`vs ${perMWh(town.gate.benchmark_usd_mwh)} gas today`} />
      </div>
    ),
  },
  {
    kicker: "Who owns it",
    title: "The town owns the pipes. TeraWulf supplies the heat.",
    lens: "Economic",
    body: (
      <>
        <p>
          A town-chartered thermal utility owns the network and sets prices at cost. TeraWulf signs a 10-year Heat Supply Agreement with
          renewals: heat at no charge, a step-in right, and a decommissioning reserve.
        </p>
        <p>
          Heat is sold at {pct(fin.tariff_k_of_propane)} of the propane price ({perMWh(tariff)}), with a low-income rate of{" "}
          {perMWh(fin.low_income_tariff_usd_mwh)}.
        </p>
      </>
    ),
    visual: (
      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full text-left text-base">
          <thead>
            <tr className="border-b border-line">
              <th className="px-4 py-2">Who</th>
              <th className="px-4 py-2">What they get</th>
              <th className="px-4 py-2">Measured by</th>
            </tr>
          </thead>
          <tbody>
            {site.value_by_stakeholder.map((v) => (
              <tr key={v.who} className="border-b border-line align-top last:border-0">
                <td className="px-4 py-2 font-semibold">{v.who}</td>
                <td className="px-4 py-2">{v.value}</td>
                <td className="px-4 py-2 text-ink-2">{v.metric}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    kicker: "Risk",
    title: "What if the data center leaves?",
    lens: "Economic",
    body: (
      <>
        <p>
          Data centers rarely sign heat contracts past 10 years. So the only data-center-specific equipment is a heat exchanger. If TeraWulf exits in
          year {exit.year}, {musd(exit.stranded_musd)} is stranded.
        </p>
        <p>
          An air-source heat pump on the same pad takes over. Heat then costs {perMWh(exit.fallback_lcoh_usd_mwh)}, still below propane at{" "}
          {perMWh(propane)}.
        </p>
      </>
    ),
    visual: (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Stranded if DC exits" value={musd(exit.stranded_musd)} sub={`year ${exit.year}`} />
        <Stat label="Cost of heat after exit" value={perMWh(exit.fallback_lcoh_usd_mwh)} sub="air-source fallback" />
        <Stat label="Propane today" value={perMWh(propane)} />
      </div>
    ),
  },
  {
    kicker: "Impact",
    title: `About ${num(round(imp.co2_avoided_t_yr, 100))} tonnes of CO₂ a year, and no lake water.`,
    lens: "Environmental",
    body: (
      <>
        <p>
          The campus is a new heat user, so we count its carbon against a propane-heated greenhouse of the same size. That is like taking{" "}
          {num(round(imp.co2_cars_equiv, 100))} cars off the road.
        </p>
        <p>{imp.water.note}</p>
      </>
    ),
    visual: (
      <div className="grid grid-cols-2 gap-4">
        <Stat label="CO₂ avoided" value={`${num(round(imp.co2_avoided_t_yr, 100))} t`} sub="per year, vs propane" />
        <Stat label="Fan energy saved" value={`${num(imp.water.fan_energy_saved_MWh)} MWh`} sub="per year" />
        <Stat label="Heat reused" value={pct(imp.erf, 1)} sub="of all data-center energy (ERF)" />
        <Stat label="Unmet hours" value={num(site.totals.unmet_hours)} sub="of 8,760" />
      </div>
    ),
  },
  {
    kicker: "The ask",
    title: "Write the heat into the deal.",
    lens: "Social",
    body: <p>Heat reuse only counts if it is binding. Three signatures make it real.</p>,
    visual: (
      <ol className="space-y-4 text-lg">
        <li className="rounded-lg border border-line bg-surface p-4">
          <strong>Town of Lansing:</strong> make a Community Benefit and Heat Supply Agreement a condition of any approval, and charter the thermal
          utility.
        </li>
        <li className="rounded-lg border border-line bg-surface p-4">
          <strong>TeraWulf:</strong> liquid cooling, a sidestream heat exchanger, heat at no charge, and a decommissioning reserve.
        </li>
        <li className="rounded-lg border border-line bg-surface p-4">
          <strong>NYSERDA and NYSEG:</strong> fund a Phase 2 pilot that tests the gate with baseboard-heated homes first.
        </li>
      </ol>
    ),
  },
];

function RingDot({ id }: { id: string }) {
  return <span aria-hidden className="mr-1 inline-block h-3 w-3 rounded-full align-middle" style={{ background: RING_COLOR[id] }} />;
}

export default function Story() {
  const [i, setI] = useState(0);
  // Presenter view (/notes/) in another window stays in step through a BroadcastChannel.
  const channel = useRef<BroadcastChannel | null>(null);
  const go = useCallback((d: number) => setI((x) => Math.min(Math.max(x + d, 0), slides.length - 1)), []);

  useEffect(() => {
    const fromHash = parseInt(window.location.hash.slice(1), 10);
    if (fromHash >= 1 && fromHash <= slides.length) setI(fromHash - 1);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", `#${i + 1}`);
    channel.current?.postMessage({ step: i });
  }, [i]);
  useEffect(() => {
    if (!("BroadcastChannel" in window)) return;
    const c = new BroadcastChannel("lansing-story");
    c.onmessage = (e) => typeof e.data?.step === "number" && setI(e.data.step);
    channel.current = c;
    return () => c.close();
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea, select, [role=img]")) return;
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(1); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(-1); }
      if (e.key === "Home") setI(0);
      if (e.key === "End") setI(slides.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const s = slides[i];
  return (
    <div className="mx-auto flex max-w-6xl flex-col px-4 py-6 lg:py-5">
      <div className="no-print mb-6 flex items-center gap-3 lg:mb-4" aria-label="Progress">
        {slides.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            aria-label={`Go to step ${k + 1}: ${slides[k].title}`}
            aria-current={k === i ? "step" : undefined}
            className="h-2 flex-1 rounded-full"
            style={{ background: k <= i ? "var(--s1)" : "var(--grid)" }}
          />
        ))}
      </div>
      <article key={i} className="fade-in grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        <div className="space-y-4 text-lg leading-relaxed">
          <div className="flex items-center gap-3 text-base text-ink-2">
            <span>{s.kicker}</span>
            {s.lens && <span className="rounded-full border border-line px-2 py-0.5 text-sm">{s.lens}</span>}
          </div>
          <h1 className="text-3xl font-semibold leading-tight lg:text-[2.6rem]">{s.title}</h1>
          <div className="space-y-4">{s.body}</div>
        </div>
        <div className="min-w-0">{s.visual}</div>
      </article>
      <div className="no-print mt-8 flex items-center justify-between lg:mt-5">
        <button onClick={() => go(-1)} disabled={i === 0} className="rounded-lg border border-line px-5 py-3 text-lg disabled:opacity-40">
          ← Back
        </button>
        <span className="flex items-center gap-4 text-ink-2 tnum">
          {i + 1} / {slides.length}
          <a href="/notes/" target="lansing-notes" className="text-sm underline decoration-[var(--axis)] underline-offset-4">
            Presenter notes
          </a>
        </span>
        <button
          onClick={() => go(1)}
          disabled={i === slides.length - 1}
          className="rounded-lg bg-[var(--accent-strong)] px-5 py-3 text-lg font-semibold text-white disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { site, ringById } from "@/lib/data";
import { gwh, musd, num, perMWh, round } from "@/lib/fmt";
import { SiteQR } from "@/components/QR";
import { Status } from "@/components/ui";

export const metadata: Metadata = { title: "One-pager · Lansing Heat Reuse" };

const onsite = ringById("onsite");
const corridor = ringById("corridor");
const town = ringById("town");
const fin = site.finance;
const imp = site.impact;
const propane = fin.incumbent_usd_mwh.propane;
const timesHomes = (site.supply.heat_available_GWh * 1000) / (site.context.town_households * fin.household.typical_MWh_yr);
const cheaper = corridor.gate.path!.find((p) => p.label.includes("cheaper build"))!;

export default function Page() {
  return (
    <div className="onepager mx-auto max-w-[8.5in] bg-surface px-8 py-8 text-[13px] leading-snug text-ink print:px-0 print:py-0">
      <p className="no-print mb-4 rounded border border-line p-3 text-sm text-ink-2">
        One-page leave-behind. Print with your browser (Letter, default margins). The QR code points to this site&apos;s address.
      </p>
      <header className="border-b border-line pb-3">
        <div className="text-sm text-ink-2">Lake Hawkeye data center · Lansing, NY · HDR / Grundfos heat reuse challenge</div>
        <h1 className="mt-1 text-[26px] font-semibold leading-tight">The conditions under which Lansing could say yes</h1>
        <p className="mt-2 text-[14px]">
          Lansing is drafting a ban on data centers. A {site.supply.it_load_MW} MW liquid-cooled campus would make{" "}
          {gwh(site.supply.heat_available_GWh * 1000)} of usable heat a year, about {num(timesHomes)} times what every home in town needs. We propose writing
          that heat into a binding agreement, and building each phase of a town-owned heat network only when it beats what users pay today.
        </p>
      </header>

      <section className="mt-4 grid grid-cols-5 gap-3" aria-label="Key numbers">
        {[
          [perMWh(onsite.gate.lcoh_usd_mwh), `Phase 1 heat cost, vs ${perMWh(propane)} propane`],
          [gwh(onsite.annual_MWh), "heat used each year by the campus"],
          [num(site.totals.unmet_hours), "hours without heat, incl. a 36 h outage at −19 °C"],
          [num(imp.jobs), "on-site jobs, plus " + num(imp.local_food_t_yr) + " t food/yr"],
          [`${num(round(imp.co2_avoided_t_yr, 100))} t`, "CO₂ avoided per year"],
        ].map(([v, l]) => (
          <div key={l} className="rounded border border-line p-2">
            <div className="text-[20px] font-semibold leading-tight">{v}</div>
            <div className="mt-0.5 text-[11px] text-ink-2">{l}</div>
          </div>
        ))}
      </section>

      <section className="mt-4">
        <h2 className="text-[15px] font-semibold">Three rings, each with a public gate</h2>
        <table className="mt-1 w-full text-left">
          <thead>
            <tr className="border-b border-line text-ink-2">
              <th className="py-1 pr-2 font-semibold">Ring</th>
              <th className="py-1 pr-2 font-semibold">Who</th>
              <th className="py-1 pr-2 font-semibold">Cost of heat</th>
              <th className="py-1 font-semibold">Gate</th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-b border-line">
              <td className="py-1 pr-2 font-semibold">1 · Build now</td>
              <td className="py-1 pr-2">Greenhouse, fish farm, rec center and pool on the plant site ({musd(onsite.capex_musd)})</td>
              <td className="py-1 pr-2 tnum">{perMWh(onsite.gate.lcoh_usd_mwh)}</td>
              <td className="py-1"><Status pass={true}>Passes</Status></td>
            </tr>
            <tr className="border-b border-line">
              <td className="py-1 pr-2 font-semibold">2 · Earn its way</td>
              <td className="py-1 pr-2">
                {num(corridor.homes!)} homes within 3 km on a low-temperature loop. Grants plus a cheaper build bring heat to{" "}
                {perMWh(cheaper.lcoh_usd_mwh)}, below propane. Baseboard-heated homes connect first.
              </td>
              <td className="py-1 pr-2 tnum">{perMWh(corridor.gate.lcoh_usd_mwh)} today</td>
              <td className="py-1"><Status pass={null}>Not yet</Status></td>
            </tr>
            <tr>
              <td className="py-1 pr-2 font-semibold">3 · Said no</td>
              <td className="py-1 pr-2">School and town buildings, {num(town.pipe_km)} km of pipe away; too much heat lost on the way</td>
              <td className="py-1 pr-2 tnum">{perMWh(town.gate.lcoh_usd_mwh)}</td>
              <td className="py-1"><Status pass={false}>Fails</Status></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-5">
        <div>
          <h2 className="text-[15px] font-semibold">How the risk is shared</h2>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>A town-chartered thermal utility owns the pipes and prices heat at cost: {perMWh(fin.tariff_usd_mwh)}, with a low-income rate of {perMWh(fin.low_income_tariff_usd_mwh)}.</li>
            <li>TeraWulf supplies heat at no charge under a 10-year Heat Supply Agreement with renewals and a step-in right.</li>
            <li>Cooling never depends on heat users: recovery is a sidestream and the dry coolers stay at 100%.</li>
            <li>If TeraWulf leaves in year {fin.dc_exit.year}: {musd(fin.dc_exit.stranded_musd)} stranded; an air-source heat pump keeps heat at {perMWh(fin.dc_exit.fallback_lcoh_usd_mwh)}, still below propane.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-[15px] font-semibold">The ask</h2>
          <ol className="mt-1 list-decimal space-y-1 pl-4">
            <li><strong>Town of Lansing:</strong> make a Community Benefit and Heat Supply Agreement a condition of any approval; charter the thermal utility.</li>
            <li><strong>TeraWulf:</strong> liquid cooling, a sidestream heat exchanger, heat at no charge, and a decommissioning reserve.</li>
            <li><strong>NYSERDA and NYSEG:</strong> fund a Phase 2 pilot that tests the gate with baseboard-heated homes first.</li>
          </ol>
        </div>
      </section>

      <footer className="mt-5 flex items-end justify-between gap-6 border-t border-line pt-3">
        <p className="max-w-[60%] text-[11px] text-ink-2">
          Numbers from an 8,760-hour model with every input sourced or flagged in one file. Known limits: synthetic weather year, campus land not yet
          confirmed, planning-level unit costs. Co-op financing at 4% over 30 years. Water: no lake water is used for cooling, so heat reuse cuts fan
          energy, not lake withdrawals.
        </p>
        <SiteQR />
      </footer>
    </div>
  );
}

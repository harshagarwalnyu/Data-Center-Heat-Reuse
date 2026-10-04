import type { Metadata } from "next";
import { site } from "@/lib/data";
import { num } from "@/lib/fmt";

export const metadata: Metadata = { title: "Data & sources · Lansing Heat Reuse" };

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-6 text-lg lg:py-10">
      <h1 className="text-3xl font-semibold lg:text-5xl">Data &amp; sources</h1>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">How the numbers are made</h2>
        <p>
          Every number in this app comes from one Python model that simulates all 8,760 hours of a year: data-center heat, the demand of each
          user, heat pumps, a storage tank, and backup boilers. All inputs live in one file, <code>assumptions.yaml</code>, each tagged as a
          sourced fact, an assumption, or unverified.
        </p>
        <p className="text-ink-2">
          Generated {site.meta.generated}. Weather: {site.meta.weather}. Rings built in this scenario: {site.meta.built_rings.join(", ")}.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Limits we know about</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Weather is a synthetic year matched to Ithaca&apos;s monthly normals until a measured weather file is added.</li>
          <li>Land for the on-site campus is not yet confirmed.</li>
          <li>Unit costs for pipe, heat pumps and connections are planning estimates, shown in the sensitivity chart.</li>
          <li>The campus is new heat demand, so its carbon is counted against a propane-heated greenhouse, not against today&apos;s emissions.</li>
          <li>The cost of heat ({num(site.finance.lcoh_usd_mwh.coop_4pct)} $/MWh) covers capital, upkeep and energy; the greenhouse buildings themselves are not included.</li>
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Sources</h2>
        <ul className="space-y-2">
          {site.sources.map((s) => (
            <li key={s.id}>
              {s.url.startsWith("http") ? (
                <a href={s.url} className="underline decoration-[var(--axis)] underline-offset-4 hover:decoration-[var(--ink)]" target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ) : (
                <span>
                  {s.label} <span className="text-ink-2">({s.url}, in the project repository)</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

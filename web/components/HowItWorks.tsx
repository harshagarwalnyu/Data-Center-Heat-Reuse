"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import type { AppData } from "@/lib/types";
import { dec, int } from "@/lib/format";
import { NavBar } from "./ui";
import { MathSteps } from "./MathSteps";

function Flow({ n, bg, temp, title, children }: { n: number; bg: string; temp?: string; title: string; children: ReactNode }) {
  return (
    <li className="rounded-[22px] p-5 sm:p-6" style={{ background: bg }}>
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className="kicker">Step {n}</span>
        {temp && <span className="t-stat num" style={{ fontSize: "var(--text-h2)" }}>{temp}</span>}
      </div>
      <h3 className="t-h3 m-0 mt-1">{title}</h3>
      <p className="m-0 mt-1.5 text-ink2">{children}</p>
    </li>
  );
}

const Arrow = () => <li aria-hidden className="text-center text-ink2 text-[1.5rem] leading-none py-1">↓</li>;

export function HowItWorks({ data }: { data: AppData }) {
  const d = data.site2;
  const on = d.rings.find((r) => r.id === "onsite"), co = d.rings.find((r) => r.id === "corridor");
  return (
    <div className="min-h-dvh flex flex-col">
      <NavBar active="/how/" />
      <main className="flex-1 px-4 sm:px-6 pt-8 pb-20 w-full max-w-[860px] mx-auto">
        <p className="kicker m-0 mb-2">How it works</p>
        <h1 className="t-h1 m-0">Server heat, to a farm and to homes</h1>
        <p className="lede m-0 mt-4">Every number on this site comes from an hour-by-hour model you can rerun. Below: how the heat moves, then how each headline number is built from its inputs.</p>

        <h2 className="t-h2 m-0 mt-14">How the heat moves</h2>
        <ol className="list-none m-0 mt-5 p-0 grid gap-1" aria-label="How the heat moves">
          <Flow n={1} bg="var(--peach)" temp={`${d.supply.capture_temp_C} °C`} title="Servers heat a liquid loop">
            The data center cools its chips with liquid. That loop comes back warm, about {d.supply.capture_temp_C} °C.
          </Flow>
          <Arrow />
          <Flow n={2} bg="var(--butter)" title="A plate heat exchanger takes the heat">
            It sits on a side loop. Cooling always wins: if we take too little or nothing, dry coolers carry the full load.
          </Flow>
          <Arrow />
          <Flow n={3} bg="var(--sage)" temp={`${on?.supply_temp_C ?? 45} °C / ${co?.supply_temp_C ?? 20} °C`} title="Farm and homes use it">
            The farm campus is fed directly at {on?.supply_temp_C ?? 45} °C. The {int(co?.homes ?? 0)} homes sit on a {co?.supply_temp_C ?? 20} °C loop and each has its own small heat pump.
          </Flow>
          <Arrow />
          <Flow n={4} bg="var(--sky)" temp={`${int(d.totals.storage_m3)} m³`} title="A tank and backup boilers cover the gaps">
            The tank holds about 6 hours of peak heat. Backup boilers are sized for 100% of peak, so no home goes cold.
          </Flow>
        </ol>

        <h2 className="t-h2 m-0 mt-16">How every number checks out</h2>
        <p className="m-0 mt-3 mb-8 text-ink2">Each step shows the formula, the inputs with their values, and a link to where each input comes from. Values are read from the model output files. Where a value only lives in a config file, the chip names that file.</p>
        <MathSteps d={d} />

        <h2 className="t-h2 m-0 mt-6">Honest limits</h2>
        <ul className="m-0 mt-3 pl-6 grid gap-2">
          <li>Pipe and tank last 30 years, equipment (heat pumps, exchangers, boilers, pumps) 20 years, over a 30-year horizon.</li>
          <li>The 75% capture share is our assumption (range 40% to 85%). Cost of heat barely moves with it, because supply is far larger than demand ({dec(d.totals.share_of_available_pct, 1)}% used).</li>
          <li>The ${int(d.extras?.cba?.dc_capex_musd ?? 0)}M data center build cost is our assumption, not a quote.</li>
          <li>Map geometry is approximate. The town ring is conditional and fails the cost gate.</li>
        </ul>

        <h2 className="t-h2 m-0 mt-12">Rerun it yourself</h2>
        <p className="m-0 mt-3">Python model and tests: <code>uv run pytest</code>. Web tests: <code>bun run test</code> in <code>web/</code>. The JSON the model writes is the same JSON this site loads.</p>

        <p className="m-0 mt-12">
          <Link prefetch={false} href="/sources/" className="btn btn-primary no-underline">See all inputs and sources &rarr;</Link>
        </p>
      </main>
    </div>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";
import type { AppData, InputRow } from "@/lib/types";
import { BASE_PATH } from "@/lib/config";
import { int } from "@/lib/format";
import { NavBar } from "./ui";

type Filter = "all" | InputRow["confidence"];
const FILTERS: Filter[] = ["all", "sourced", "assumption", "unverified"];

export function isUrl(s: string) {
  return /^https?:\/\//.test(s);
}

export function Sources({ data }: { data: AppData }) {
  const d = data.site2;
  const [rows, setRows] = useState<InputRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let live = true;
    fetch(`${BASE_PATH}/data/input_register.json`, { cache: "no-cache" })
      .then((r) => (r.ok ? (r.json() as Promise<InputRow[]>) : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((j) => live && setRows(j))
      .catch((e: unknown) => live && setErr(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, []);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: rows?.length ?? 0, sourced: 0, assumption: 0, unverified: 0 };
    for (const r of rows ?? []) c[r.confidence] += 1;
    return c;
  }, [rows]);
  const shown = useMemo(() => (rows ?? []).filter((r) => filter === "all" || r.confidence === filter), [rows, filter]);

  return (
    <div className="min-h-dvh flex flex-col">
      <NavBar active="/sources/" />
      <main className="flex-1 px-[clamp(1.25rem,3vw,3rem)] py-6 max-w-[1500px] w-full mx-auto text-[1.125rem]">
        <p className="kicker m-0 mb-2">Data &amp; sources</p>
        <h1 className="headline m-0 !text-[clamp(2rem,3.2vw,3.25rem)] max-w-[30ch]">Every input is either sourced or labeled as our assumption</h1>
        <p className="mt-3 text-ink2 max-w-[70ch]">
          Generated {d.meta.generated} ({d.meta.scenario} case). The model reads these inputs from <code>config/*.yaml</code>; a self-check (<code>python -m heatreuse.verify</code>) fails if any input has no source note. Assumptions are marked as assumptions, not presented as facts.
        </p>

        <section className="card p-5 mt-5" aria-labelledby="src-h">
          <h2 id="src-h" className="m-0 text-[1.5rem] serif">Sources ({d.sources.length})</h2>
          <ul className="m-0 mt-3 pl-5 grid gap-2 leading-snug">
            {d.sources.map((s) => (
              <li key={s.id}>
                {s.label}{" "}
                {isUrl(s.url) ? (
                  <a href={s.url} target="_blank" rel="noreferrer" className="underline">link</a>
                ) : (
                  <span className="text-ink2">({s.url}, in the project repository)</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5 mt-5" aria-labelledby="reg-h">
          <h2 id="reg-h" className="m-0 text-[1.5rem] serif">Input register{rows ? ` (${int(rows.length)} inputs)` : ""}</h2>
          {err && <p role="alert">Could not load the input register: {err}. Run <code>python scripts/export_web_data.py</code>.</p>}
          {!rows && !err && <p>Loading the input register.</p>}
          {rows && (
            <>
              <div role="group" aria-label="Filter by confidence" className="flex flex-wrap gap-2 mt-3">
                {FILTERS.map((f) => (
                  <button key={f} className="btn" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                    {f === "all" ? "All" : f[0].toUpperCase() + f.slice(1)} ({counts[f]})
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto mt-3" tabIndex={0} role="region" aria-label="Input register table">
                <table className="w-full text-left border-collapse">
                  <caption className="sr-only">Every model input with value, unit, source and confidence</caption>
                  <thead>
                    <tr className="border-b border-line">
                      <th scope="col" className="py-2 pr-3">Input</th>
                      <th scope="col" className="py-2 pr-3">Value</th>
                      <th scope="col" className="py-2 pr-3">Unit</th>
                      <th scope="col" className="py-2 pr-3">Source</th>
                      <th scope="col" className="py-2">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((r) => (
                      <tr key={r.input} className="border-b border-line align-top">
                        <th scope="row" className="py-2 pr-3 font-semibold break-all"><code>{r.input}</code></th>
                        <td className="py-2 pr-3 num">{r.value}</td>
                        <td className="py-2 pr-3">{r.unit}</td>
                        <td className="py-2 pr-3 leading-snug">{r.source}</td>
                        <td className="py-2 font-semibold">{r.confidence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

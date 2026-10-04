// Small presentational pieces: stat tiles, status badges, temperature ladder.

export function Stat({ label, value, sub, compact }: { label: string; value: string; sub?: string; compact?: boolean }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="text-sm text-ink-2">{label}</div>
      <div className={`mt-1 font-semibold leading-tight ${compact ? "text-2xl xl:text-3xl" : "text-3xl lg:text-4xl"}`}>{value}</div>
      {sub && <div className="mt-1 text-sm text-ink-2">{sub}</div>}
    </div>
  );
}

export function Hero({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-6xl font-semibold leading-none lg:text-7xl">{value}</div>
      <div className="mt-2 text-lg text-ink-2">{label}</div>
    </div>
  );
}

export function Status({ pass, children }: { pass: boolean | null; children: React.ReactNode }) {
  const icon = pass === null ? "◐" : pass ? "✓" : "✕";
  const tone = pass === null ? "text-ink-2" : pass ? "text-good" : "text-bad";
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold ${tone}`}>
      <span aria-hidden className="text-lg leading-none">{icon}</span>
      {children}
    </span>
  );
}

export function Ladder({ rows }: { rows: { temp: number; label: string; detail: string; color: string }[] }) {
  const max = 70, min = 10;
  return (
    <div className="relative rounded-lg border border-line bg-surface p-4" role="list" aria-label="Temperature ladder">
      <div className="relative h-[min(380px,48vh)]">
        <div className="absolute left-[64px] top-0 bottom-0 w-px bg-[var(--axis)]" />
        {rows.map((r) => {
          const top = ((max - r.temp) / (max - min)) * 100;
          return (
            <div key={r.label} role="listitem" className="absolute left-0 right-0 flex items-center gap-4" style={{ top: `calc(${top}% - 14px)` }}>
              <span className="w-[52px] text-right text-lg font-semibold tnum">{r.temp}°C</span>
              <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[var(--surface)]" style={{ background: r.color, marginLeft: 0 }} />
              <span>
                <span className="font-semibold">{r.label}</span>
                <span className="text-ink-2"> · {r.detail}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

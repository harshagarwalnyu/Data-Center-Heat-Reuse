"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NavBar } from "../ui";
import type { AppData } from "@/lib/types";
import { buildSteps } from "./steps";

/** Same-origin sync between the audience window and the presenter window. */
const CHANNEL = "thermal-commons-story";
type SyncMsg = { type: "state"; step: number; short: boolean } | { type: "hello" };

function isTyping(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || el.getAttribute?.("role") === "slider" || el.isContentEditable;
}

export function Story({ data }: { data: AppData }) {
  const steps = useMemo(() => buildSteps(data), [data]);
  const calm = useReducedMotion();
  const hash0 = useMemo(() => {
    if (typeof window === "undefined") return null;
    const h = parseInt(window.location.hash.replace("#", ""), 10);
    return h >= 1 && h <= steps.length ? h - 1 : null;
  }, [steps.length]);
  const [i, setI] = useState(hash0 ?? 0);
  const [dir, setDir] = useState(1);
  const [notes, setNotes] = useState(false);
  const [short, setShort] = useState(() => (hash0 !== null ? !steps[hash0].deepDive : true)); // default = ~5-minute path; S toggles the deep dive
  const [secs, setSecs] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [presenter] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("presenter") === "1"); // ?presenter=1 window: notes + next slide, no audience slide
  const chan = useRef<BroadcastChannel | null>(null);
  const applyingRemote = useRef(false); // set when a state change came from the other window; consumed by the publish effect
  const mounted = useRef(false); // first render never publishes; the hello reply is adopted instead
  const cur = useRef({ step: 0, short: true });

  const path = useMemo(() => steps.map((s, idx) => idx).filter((idx) => !short || !steps[idx].deepDive), [steps, short]);
  const pos = Math.max(0, path.indexOf(i));

  const go = useCallback(
    (to: number) => {
      const t = Math.min(steps.length - 1, Math.max(0, to));
      setI((cur) => {
        setDir(t >= cur ? 1 : -1);
        return t;
      });
    },
    [steps.length],
  );
  const move = useCallback(
    (delta: number) => {
      const cur = path.indexOf(i);
      if (cur === -1) {
        // current step is skipped on the short path: jump to nearest
        const nxt = delta > 0 ? path.find((p) => p > i) : [...path].reverse().find((p) => p < i);
        if (nxt !== undefined) go(nxt);
        return;
      }
      const n = path[Math.min(path.length - 1, Math.max(0, cur + delta))];
      go(n);
    },
    [path, i, go],
  );

  // hash sync (#3 = step 3): initial value is read in the lazy useState initialisers above
  useEffect(() => {
    history.replaceState(null, "", `#${i + 1}`);
  }, [i]);

  // presenter <-> audience sync over BroadcastChannel; the remote value is recorded so it is never echoed back
  useEffect(() => {
    cur.current = { step: i, short };
  }, [i, short]);
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const c = new BroadcastChannel(CHANNEL);
    chan.current = c;
    c.onmessage = (e: MessageEvent<SyncMsg>) => {
      const m = e.data;
      if (m?.type === "hello") {
        c.postMessage({ type: "state", ...cur.current } satisfies SyncMsg);
      } else if (m?.type === "state" && Number.isInteger(m.step) && m.step >= 0 && m.step < steps.length && typeof m.short === "boolean") {
        if (m.step === cur.current.step && m.short === cur.current.short) return; // nothing changes, so no effect will consume a flag
        applyingRemote.current = true;
        setDir(m.step >= cur.current.step ? 1 : -1);
        cur.current = { step: m.step, short: m.short };
        setI(m.step);
        setShort(m.short);
      }
    };
    c.postMessage({ type: "hello" } satisfies SyncMsg);
    return () => { c.close(); chan.current = null; };
  }, [steps.length]);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (applyingRemote.current) { applyingRemote.current = false; return; } // came from the other window
    chan.current?.postMessage({ type: "state", step: i, short } satisfies SyncMsg);
  }, [i, short]);

  // presenter timer
  useEffect(() => {
    if (notes || presenter) timer.current = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [notes, presenter]);

  const openPresenter = useCallback(() => {
    window.open(`${window.location.pathname}?presenter=1${window.location.hash}`, "thermal-commons-presenter", "popup,width=1100,height=800");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTyping(e.target)) return;
      const onButton = (e.target as HTMLElement | null)?.tagName === "BUTTON";
      switch (e.key) {
        case "ArrowRight": case "ArrowDown": case "PageDown":
          e.preventDefault(); move(1); break;
        case " ":
          if (onButton) return;
          e.preventDefault(); move(e.shiftKey ? -1 : 1); break;
        case "ArrowLeft": case "ArrowUp": case "PageUp":
          e.preventDefault(); move(-1); break;
        case "Home": e.preventDefault(); go(0); break;
        case "End": e.preventDefault(); go(steps.length - 1); break;
        case "p": case "P": setNotes((n) => !n); break;
        case "o": case "O": openPresenter(); break;
        case "s": case "S": setShort((s) => !s); break;
        case "f": case "F":
          if (document.fullscreenElement) void document.exitFullscreen();
          else void document.documentElement.requestFullscreen?.().catch(() => {});
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, go, steps.length, openPresenter]);

  const s = steps[i];
  // Kicker number = position on the active path, so it always matches the "Step N of M" counter.
  const numbered = (idx: number, k: string) => { const p = path.indexOf(idx); return p === -1 ? k : `${p + 1} · ${k}`; };
  const kicker = numbered(i, s.kicker);
  const nextIdx = path[Math.min(path.length - 1, pos + 1)];
  const next = pos < path.length - 1 ? steps[nextIdx] : null;
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  if (presenter) {
    return (
      <div className="min-h-dvh bg-bg text-ink p-5 grid gap-5 content-start" role="main" aria-label="Presenter view">
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn" onClick={() => move(-1)} disabled={pos === 0} aria-label="Previous step">&larr; Back</button>
          <button className="btn" onClick={() => move(1)} disabled={pos === path.length - 1} aria-label="Next step">Next &rarr;</button>
          <span className="num font-bold text-[1.25rem]" aria-live="polite">Step {pos + 1} of {path.length}</span>
          <span className="num font-bold text-[2rem] ml-auto" role="timer" aria-label="Elapsed time">{mm}:{ss}</span>
          <button className="btn" onClick={() => setSecs(0)}>Reset timer</button>
        </div>
        <section aria-label="Current step" className="card p-5">
          <div className="kicker mb-1">{kicker}</div>
          <h1 className="serif m-0 text-[1.75rem] leading-tight">{s.headline}</h1>
          <h2 className="m-0 mt-4 text-[1.125rem] font-bold text-ink2">Speaker notes</h2>
          <p className="m-0 mt-1 text-[1.5rem] leading-snug">{s.notes}</p>
        </section>
        <section aria-label="Next step" className="card p-5">
          <h2 className="m-0 text-[1.125rem] font-bold text-ink2">Next slide</h2>
          {next ? (
            <>
              <div className="kicker mt-1">{numbered(nextIdx, next.kicker)}</div>
              <p className="serif m-0 text-[1.5rem] leading-tight">{next.headline}</p>
            </>
          ) : (
            <p className="m-0 mt-1 text-[1.25rem]">This is the last step.</p>
          )}
        </section>
        <p className="m-0 text-[1.125rem] text-ink2">Arrow keys, space or PageDown move this window and the audience window together. Open the story in another window of this browser.</p>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col bg-bg overflow-hidden">
      <NavBar active="/" />
      <div className="h-1.5 bg-line no-print" role="progressbar" aria-valuemin={1} aria-valuemax={path.length} aria-valuenow={pos + 1} aria-label="Story progress">
        <div className="h-full" style={{ width: `${((pos + 1) / path.length) * 100}%`, background: "linear-gradient(90deg,var(--ember),var(--amber))", transition: calm ? "none" : "width .4s" }} />
      </div>

      <main className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={s.id}
            custom={dir}
            initial={calm ? false : { opacity: 0, x: 40 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={calm ? { opacity: 0 } : { opacity: 0, x: -40 * dir }}
            transition={{ duration: calm ? 0 : 0.32, ease: "easeOut" }}
            className="absolute inset-0 overflow-y-auto"
            aria-labelledby="step-h"
          >
            <div className="min-h-full flex items-center px-[clamp(1.25rem,4vw,4.5rem)] py-[clamp(0.5rem,1.6dvh,1.5rem)]">
              {s.full ? (
                <div className="w-full max-w-[1500px] mx-auto">{s.full(kicker)}</div>
              ) : s.layout === "split" ? (
                <div className={`w-full max-w-[1600px] mx-auto grid gap-[clamp(1.5rem,3vw,3.5rem)]  items-center ${s.visualWide ? "lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]" : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"}`}>
                  <div>
                    <p className="kicker m-0 mb-3">{kicker}</p>
                    <h1 id="step-h" className="headline m-0">{s.headline}</h1>
                    {s.lede && <p className="lede mt-5 mb-0 max-w-[34ch] sm:max-w-[40ch]">{s.lede}</p>}
                  </div>
                  <div className="min-w-0 lg:h-[min(62dvh,640px)]">{s.visual}</div>
                </div>
              ) : (
                <div className="w-full max-w-[1600px] mx-auto grid gap-[clamp(0.75rem,1.6dvh,1rem)] content-center">
                  <div className={s.lede ? "grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-end" : undefined}>
                    <div>
                      <p className="kicker m-0 mb-2">{kicker}</p>
                      <h1 id="step-h" className="headline m-0 max-w-[44ch] !text-[clamp(2rem,2.6vw,3.25rem)]">{s.headline}</h1>
                    </div>
                    {s.lede && <p className="m-0 text-[1.0625rem] text-ink2 leading-snug">{s.lede}</p>}
                  </div>
                  <div className="min-w-0">{s.visual}</div>
                </div>
              )}
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      <footer className="no-print flex items-center gap-3 px-5 py-2 border-t border-line bg-bg text-[1rem] text-ink2 whitespace-nowrap">
        <button className="btn shrink-0 whitespace-nowrap" onClick={() => move(-1)} aria-label="Previous step" disabled={pos === 0}>&larr; Back</button>
        <button className="btn shrink-0 whitespace-nowrap" onClick={() => move(1)} aria-label="Next step" disabled={pos === path.length - 1}>Next &rarr;</button>
        <span className="num font-bold text-ink text-[1.125rem] shrink-0 whitespace-nowrap" aria-live="polite">Step {pos + 1} of {path.length}</span>
        <button className="btn shrink-0 whitespace-nowrap" onClick={() => setShort((v) => !v)} title="Switch between the 5-minute path and the full deep dive (key S)">{short ? "Show deep dive" : "Back to 5-minute path"}</button>
        <span className="ml-auto min-w-0 truncate hidden min-[1440px]:inline" title="Arrows, space or PageDown move · P notes · O presenter window · F fullscreen · S deep dive on/off">Arrows move · P notes · O presenter · F fullscreen · S deep dive</span>
        <button className="btn shrink-0 whitespace-nowrap ml-auto min-[1440px]:ml-0" aria-pressed={notes} onClick={() => setNotes((n) => !n)}>Notes (P)</button>
        <button className="btn shrink-0 whitespace-nowrap" onClick={openPresenter} title="Open notes and the next slide in a second window that stays in sync (key O)">Presenter (O)</button>
      </footer>

      {notes && (
        <aside className="no-print fixed bottom-0 left-0 right-0 z-30 border-t-4 border-teal bg-surface p-5 shadow-2xl max-h-[46dvh] overflow-y-auto" role="complementary" aria-label="Speaker notes">
          <div className="max-w-[1500px] mx-auto grid gap-4 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="kicker mb-1">Speaker notes · {kicker}</div>
              <p className="m-0 text-[1.25rem] leading-snug">{s.notes}</p>
            </div>
            <div className="text-[1.0625rem] text-ink2">
              <div className="num font-bold text-ink text-[1.75rem]" aria-label="Elapsed time">{mm}:{ss}</div>
              <div>Next: {next ? numbered(nextIdx, next.kicker) : "last step"}</div>
              <button className="btn mt-2" onClick={() => setSecs(0)}>Reset timer</button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

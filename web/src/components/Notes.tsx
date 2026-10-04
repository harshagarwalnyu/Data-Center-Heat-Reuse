"use client";

import { useEffect, useRef, useState } from "react";
import { slides } from "./Story";
import { NOTES } from "@/lib/notes";

/** Presenter view: open on the laptop while the story runs on the projector. Arrow keys drive both. */
export default function Notes() {
  const [i, setI] = useState(0);
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const channel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const c = new BroadcastChannel("lansing-story");
    c.onmessage = (e) => typeof e.data?.step === "number" && setI(e.data.step);
    channel.current = c;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { c.close(); clearInterval(t); };
  }, []);

  useEffect(() => {
    const send = (n: number) => { setI(n); channel.current?.postMessage({ step: n }); };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); send(Math.min(i + 1, slides.length - 1)); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); send(Math.max(i - 1, 0)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i]);

  const secs = Math.floor((now - start) / 1000);
  const n = NOTES[i];
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <div className="flex items-baseline justify-between text-ink-2">
        <span className="tnum">Step {i + 1} / {slides.length}</span>
        <span className="tnum text-2xl text-ink">{String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}</span>
      </div>
      <h1 className="text-3xl font-semibold leading-tight">{slides[i].title}</h1>
      <ul className="list-disc space-y-3 pl-6 text-2xl leading-snug">
        {n.say.map((s) => <li key={s}>{s}</li>)}
      </ul>
      {n.ask && (
        <p className="rounded-lg border border-line bg-surface p-4 text-lg">
          <strong>If asked:</strong> {n.ask}
        </p>
      )}
      {i < slides.length - 1 && <p className="text-ink-2">Next: {slides[i + 1].title}</p>}
      <p className="text-sm text-ink-2">
        Open the Story in another window of this browser; arrow keys here or there move both. Target about one minute per step.
      </p>
    </div>
  );
}

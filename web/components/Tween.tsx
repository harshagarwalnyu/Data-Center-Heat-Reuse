"use client";
import { useEffect, useRef, useState } from "react";

const easeOut = (p: number) => 1 - (1 - p) ** 3;

/**
 * Eases a number toward `target` over `ms` (ease-out). While `instant` is true (slider drag, arrow keys) or the
 * user prefers reduced motion, it follows the target with no animation. Starts at `target`, so the first render
 * (and the static export) shows the real figure.
 */
export function useTween(target: number, instant: boolean, ms = 250): number {
  const [shown, setShown] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    const snap = () => { cur.current = target; setShown(target); };
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (instant || reduce || !Number.isFinite(target) || !Number.isFinite(cur.current) || cur.current === target) { snap(); return; }
    const from = cur.current;
    const t0 = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const p = Math.min(1, (now - t0) / ms);
      cur.current = p >= 1 ? target : from + (target - from) * easeOut(p);
      setShown(cur.current);
      if (p < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [target, instant, ms]);
  return shown;
}

/** A live figure: tweens on committed changes, announces only its final text to screen readers. */
export function Tween({ value, format, instant }: { value: number; format: (n: number) => string; instant: boolean }) {
  const v = useTween(value, instant);
  const [said, setSaid] = useState(value);
  useEffect(() => { if (!instant) setSaid(value); }, [value, instant]);
  return (
    <>
      <span aria-hidden className="num">{format(v)}</span>
      <span className="sr-only">{format(said)}</span>
    </>
  );
}

"use client";
import { useEffect, useState } from "react";

/**
 * Reduced-motion preference that is false on the server AND on the first client render,
 * so static-export hydration always matches; the real value lands in an effect.
 * The brief motion-ready first paint is covered by the [data-rise] CSS rule in globals.css.
 */
export function useStill(): boolean {
  const [still, setStill] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setStill(q.matches);
    set();
    q.addEventListener("change", set);
    return () => q.removeEventListener("change", set);
  }, []);
  return still;
}

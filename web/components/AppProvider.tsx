"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppData, Offtaker, Site1Data, Site2Data } from "@/lib/types";
import { BASE_PATH } from "@/lib/config";

type Theme = "light" | "dark";
interface Ctx {
  data: AppData | null;
  error: string | null;
  theme: Theme;
  toggleTheme: () => void;
}
const C = createContext<Ctx>({ data: null, error: null, theme: "light", toggleTheme: () => {} });
export const useApp = () => useContext(C);

async function getJson<T>(name: string): Promise<T> {
  const res = await fetch(`${BASE_PATH}/data/${name}`, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  return (await res.json()) as T;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    try {
      // The paper-and-paint look is light-only and has no toggle; clear any older saved "dark".
      localStorage.removeItem("theme");
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const n = t === "light" ? "dark" : "light";
      try { localStorage.setItem("theme", n); } catch {}
      return n;
    });
  }, []);

  useEffect(() => {
    let live = true;
    Promise.all([getJson<Site2Data>("site2.json"), getJson<Site1Data>("site1.json"), getJson<Offtaker[] | { placeholder?: boolean; offtakers: Offtaker[] }>("offtakers.json")])
      .then(([site2, site1, off]) => {
        if (!live) return;
        const offtakers = Array.isArray(off) ? off : off.offtakers;
        const ph = site2.placeholder === true || site1.placeholder === true || (!Array.isArray(off) && off.placeholder === true);
        setData({ site2, site1, offtakers, placeholder: ph });
      })
      .catch((e: unknown) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, []);

  const value = useMemo(() => ({ data, error, theme, toggleTheme }), [data, error, theme, toggleTheme]);
  return <C.Provider value={value}>{children}</C.Provider>;
}

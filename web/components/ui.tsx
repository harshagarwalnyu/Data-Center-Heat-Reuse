"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { useApp } from "./AppProvider";
import type { AppData } from "@/lib/types";
import { PROJECT_TAGLINE, PROJECT_TITLE } from "@/lib/config";

export function PlaceholderBadge() {
  const { data } = useApp();
  if (!data?.placeholder) return null;
  return (
    <span className="chip" style={{ background: "var(--warn-bg)", borderColor: "var(--amber)" }} title="These numbers come from a stand-in dataset until the final model run is exported.">
      <span aria-hidden>●</span> Illustrative data
    </span>
  );
}

export function ThemeButton() {
  const { theme, toggleTheme } = useApp();
  return (
    <button className="btn" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}

const NAV = [
  { href: "/", label: "Home" },
  { href: "/explore/", label: "Explore" },
  { href: "/compare/", label: "Compare" },
  { href: "/how/", label: "How it works" },
  { href: "/sources/", label: "Sources" },
];

/** Clean top bar: wordmark left, links right, outlined pill. `overlay` floats it over the home hero. */
export function NavBar({ active, extra, overlay = false }: { active: string; extra?: ReactNode; overlay?: boolean }) {
  return (
    <header className={`no-print z-30 flex flex-wrap items-center gap-x-4 gap-y-1 px-[clamp(1rem,4vw,4.5rem)] py-3 ${overlay ? "absolute inset-x-0 top-0 bg-transparent" : "bg-bg border-b border-line/70"}`}>
      <Link prefetch={false} href="/" className="serif text-ink no-underline whitespace-nowrap mr-auto md:mr-4" style={{ fontSize: "clamp(1.5rem, 1.2rem + 0.8vw, 1.9rem)", fontWeight: 500, letterSpacing: "-0.02em" }}>
        {PROJECT_TITLE}<span className="sr-only">: {PROJECT_TAGLINE}</span>
      </Link>
      <nav aria-label="Primary" className="order-last w-full md:order-none md:w-auto md:ml-auto flex gap-1 overflow-x-auto -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-md:[mask-image:linear-gradient(to_right,#000_calc(100%-1.75rem),transparent)]">
        {NAV.map((n) => (
          <Link prefetch={false}
            key={n.href}
            href={n.href}
            aria-current={active === n.href ? "page" : undefined}
            className="min-h-[44px] inline-flex items-center px-2.5 sm:px-3 font-bold text-caption no-underline whitespace-nowrap text-ink underline-offset-[6px] decoration-2 hover:underline aria-[current=page]:underline"
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        {extra}
        <PlaceholderBadge />
        <Link prefetch={false} href="/explore/" className="pill-outline text-caption text-ink hover:bg-ink hover:text-bg transition-colors">Try the model</Link>
      </div>
    </header>
  );
}

export function DataGate({ children }: { children: (d: AppData) => ReactNode }) {
  const { data, error } = useApp();
  if (error) return <div className="p-8 text-h3">Could not load data files: {error}. Run the app from a web server (for example <code>bunx serve out</code>).</div>;
  if (!data) return <div className="p-8 text-h3 text-ink2" role="status">Loading data...</div>;
  return <>{children(data)}</>;
}

export function Stat({ value, unit, label, tone = "ink", big = false }: { value: string; unit?: string; label: string; tone?: "ink" | "ember" | "teal"; big?: boolean }) {
  const color = tone === "ember" ? "var(--ember-text)" : tone === "teal" ? "var(--teal-text)" : "var(--ink)";
  return (
    <div>
      <div className="serif num font-bold leading-none" style={{ color, fontSize: big ? "clamp(3rem,6vw,6rem)" : "clamp(2rem,3.2vw,3rem)" }}>
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
      <div className="text-ink2 mt-1 text-caption">{label}</div>
    </div>
  );
}

export function RingDot({ ring }: { ring: string }) {
  return <span aria-hidden className="inline-block w-3.5 h-3.5 rounded-full mr-2 align-middle" style={{ background: ringColor(ring) }} />;
}
export const ringColor = (id: string) => (id === "onsite" ? "var(--teal)" : id === "corridor" ? "var(--ember)" : id === "town" ? "var(--violet)" : "var(--ink2)");
export const ringText = (id: string) => (id === "onsite" ? "var(--teal-text)" : id === "corridor" ? "var(--ember-text)" : "var(--violet-text)");
export const ringShort = (id: string) => (id === "onsite" ? "On-site campus" : id === "corridor" ? "Corridor homes" : "Town center");

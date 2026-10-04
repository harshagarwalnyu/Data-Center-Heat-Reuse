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

export function NavBar({ active, extra }: { active: string; extra?: ReactNode }) {
  return (
    <header className="no-print flex flex-wrap items-center gap-x-3 gap-y-1 px-[clamp(0.75rem,2vw,1.25rem)] py-2 border-b border-line bg-bg">
      <Link prefetch={false} href="/" className="serif font-bold text-[1.25rem] mr-3 whitespace-nowrap text-ink no-underline">
        <span className="text-ember">&#9650;</span> {PROJECT_TITLE}<span className="hidden lg:inline font-sans font-semibold text-[1rem] text-ink2 ml-2">{PROJECT_TAGLINE}</span>
      </Link>
      <nav aria-label="Primary" className="order-last w-full md:order-none md:w-auto flex gap-1 overflow-x-auto -mx-1 px-1">
        {NAV.map((n) => (
          <Link prefetch={false}
            key={n.href}
            href={n.href}
            aria-current={active === n.href ? "page" : undefined}
            className="min-h-[44px] inline-flex items-center px-2 sm:px-3 rounded-lg font-semibold text-[1rem] sm:text-[1.0625rem] no-underline whitespace-nowrap"
            style={active === n.href ? { background: "var(--navy)", color: "var(--bg)" } : { color: "var(--ink)" }}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-3">
        {extra}
        <PlaceholderBadge />
        <ThemeButton />
      </div>
    </header>
  );
}

export function DataGate({ children }: { children: (d: AppData) => ReactNode }) {
  const { data, error } = useApp();
  if (error) return <div className="p-10 text-[1.25rem]">Could not load data files: {error}. Run the app from a web server (for example <code>bunx serve out</code>).</div>;
  if (!data) return <div className="p-10 text-[1.25rem] text-ink2" role="status">Loading data...</div>;
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
      <div className="text-ink2 mt-1 text-[1.0625rem]">{label}</div>
    </div>
  );
}

export function RingDot({ ring }: { ring: string }) {
  return <span aria-hidden className="inline-block w-3.5 h-3.5 rounded-full mr-2 align-middle" style={{ background: ringColor(ring) }} />;
}
export const ringColor = (id: string) => (id === "onsite" ? "var(--ember)" : id === "corridor" ? "var(--teal)" : id === "town" ? "var(--violet)" : "var(--ink2)");
export const ringText = (id: string) => (id === "onsite" ? "var(--ember-text)" : id === "corridor" ? "var(--teal-text)" : "var(--violet-text)");
export const ringShort = (id: string) => (id === "onsite" ? "On-site campus" : id === "corridor" ? "Corridor homes" : "Town center");

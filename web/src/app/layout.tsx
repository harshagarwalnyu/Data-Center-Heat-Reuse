import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lansing Heat Reuse",
  description:
    "Data-center heat for Lansing, NY: an 8,760-hour model of what the Lake Hawkeye campus could heat, at what cost, and on what conditions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col">
        <header className="no-print border-b border-line bg-surface">
          <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 text-base">
            <Link href="/" className="hidden font-semibold sm:inline">
              Lansing Heat Reuse
            </Link>
            <Link href="/" className="text-ink-2 hover:text-ink">
              Story
            </Link>
            <Link href="/explore/" className="text-ink-2 hover:text-ink">
              Explore
            </Link>
            <Link href="/data/" className="text-ink-2 hover:text-ink">
              Data &amp; sources
            </Link>
            <Link href="/print/" className="text-ink-2 hover:text-ink">
              One-pager
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

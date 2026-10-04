import type { Metadata, Viewport } from "next";
import { Fraunces, Mulish } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";

const serif = Fraunces({ subsets: ["latin"], axes: ["SOFT", "opsz"], variable: "--font-fraunces", display: "swap" });
const sans = Mulish({ subsets: ["latin"], variable: "--font-mulish", display: "swap" });

export const metadata: Metadata = {
  title: "Thermal Commons: Heat for Lansing",
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.svg` },
  description: "Turning a data center's waste heat into a community heat utility for Lansing, NY.",
  authors: [{ name: "Harsh Agarwal" }, { name: "Linson Lee" }, { name: "Aryaman Bhaskar" }, { name: "Philip Matchev" }],
  other: { credits: "Thermal Commons: Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev. NYU Hackathon 2026, HDR x Grundfos Data Center Heat Reuse Challenge." },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

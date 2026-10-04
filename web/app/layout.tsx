import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";

export const metadata: Metadata = {
  title: "Thermal Commons: Heat for Lansing",
  icons: { icon: "/favicon.svg" },
  description: "Turning a data center's waste heat into a community heat utility for Lansing, NY.",
  authors: [{ name: "Harsh Agarwal" }, { name: "Linson Lee" }, { name: "Aryaman Bhaskar" }, { name: "Philip Matchev" }],
  other: { credits: "Thermal Commons: Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev. NYU Hackathon 2026, HDR x Grundfos Data Center Heat Reuse Challenge." },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

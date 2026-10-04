import type { Metadata } from "next";
import Notes from "@/components/Notes";

export const metadata: Metadata = { title: "Presenter notes · Lansing Heat Reuse", robots: { index: false } };

export default function Page() {
  return <Notes />;
}

"use client";
import { DataGate } from "@/components/ui";
import { Story } from "@/components/story/Story";

export default function Home() {
  return <DataGate>{(d) => <Story data={d} />}</DataGate>;
}

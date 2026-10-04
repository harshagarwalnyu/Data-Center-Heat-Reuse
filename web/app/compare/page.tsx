"use client";
import { DataGate } from "@/components/ui";
import { Compare } from "@/components/Compare";

export default function Page() {
  return <DataGate>{(d) => <Compare data={d} />}</DataGate>;
}

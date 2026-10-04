"use client";
import { DataGate } from "@/components/ui";
import { Explore } from "@/components/Explore";

export default function Page() {
  return <DataGate>{(d) => <Explore data={d} />}</DataGate>;
}

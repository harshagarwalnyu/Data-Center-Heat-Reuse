"use client";
import { DataGate } from "@/components/ui";
import { Home } from "@/components/Home";

export default function Page() {
  return <DataGate>{(d) => <Home data={d} />}</DataGate>;
}

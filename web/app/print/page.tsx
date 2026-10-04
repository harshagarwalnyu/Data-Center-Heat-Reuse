"use client";
import { DataGate } from "@/components/ui";
import { PrintSheet } from "@/components/PrintSheet";

export default function Page() {
  return <DataGate>{(d) => <PrintSheet data={d} />}</DataGate>;
}

"use client";
import { DataGate } from "@/components/ui";
import { HowItWorks } from "@/components/HowItWorks";

export default function Page() {
  return <DataGate>{(d) => <HowItWorks data={d} />}</DataGate>;
}

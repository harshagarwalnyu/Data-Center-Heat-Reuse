"use client";
import { DataGate } from "@/components/ui";
import { Sources } from "@/components/Sources";

export default function Page() {
  return <DataGate>{(d) => <Sources data={d} />}</DataGate>;
}

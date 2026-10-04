"use client";
import { DataGate } from "@/components/ui";
import { Story } from "@/components/story/Story";

/** The presentation stepper. Not in the nav; add ?present=1 for notes, presenter window and step counter. */
export default function StoryPage() {
  return <DataGate>{(d) => <Story data={d} />}</DataGate>;
}

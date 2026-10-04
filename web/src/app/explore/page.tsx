import type { Metadata } from "next";
import Explore from "@/components/Explore";

export const metadata: Metadata = { title: "Explore · Lansing Heat Reuse" };

export default function Page() {
  return <Explore />;
}

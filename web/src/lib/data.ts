// The app reads only the model outputs copied by scripts/export_web_data.py (docs/data-contract.md).
import raw from "../../public/data/site2.json";

export type Site = typeof raw;
export type Ring = Site["rings"][number];
export type WeekRow = Site["weeks"]["winter"][number];

export const site: Site = raw;
export const ringById = (id: string): Ring => site.rings.find((r) => r.id === id)!;

export const RING_COLOR: Record<string, string> = {
  onsite: "var(--s1)",
  corridor: "var(--s2)",
  town: "var(--s3)",
};

export const FUEL_LABEL: Record<string, string> = {
  propane: "Propane",
  heating_oil: "Heating oil",
  natural_gas: "Natural gas",
  electric_resistance: "Electric baseboard",
  air_source_hp: "Air-source heat pump",
};

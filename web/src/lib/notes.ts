// Speaker notes per story step: what to say (about one minute each) and the question it should pre-empt.
import { site, ringById } from "./data";
import { compute, DEFAULTS } from "./explore";
import { gwh, musd, num, perMWh, round, usd } from "./fmt";

const onsite = ringById("onsite");
const corridor = ringById("corridor");
const town = ringById("town");
const fin = site.finance;
const imp = site.impact;
const path = corridor.gate.path!;
const airCooled = compute({ ...DEFAULTS, liquidCooling: false });
const cheaper = path.find((p) => p.label.includes("cheaper build"))!;

export type Note = { say: string[]; ask?: string };

export const NOTES: Note[] = [
  {
    say: [
      "Open on the fight, not the technology. The town is drafting a ban; 36 of 38 speakers were against.",
      "Our question is not 'is heat reuse possible'. It is 'what would Lansing need in writing to say yes'.",
    ],
    ask: "Is this a subsidy for a bitcoin/AI company? No: TeraWulf gives the heat free and pays the decommissioning reserve.",
  },
  {
    say: [
      `${gwh(site.supply.heat_available_GWh * 1000)} recoverable a year from Phase 1 alone.`,
      "That is several times what every home in Lansing uses. So supply is never the constraint; finding users is.",
      "That is why we designed from the demand side.",
    ],
  },
  {
    say: [
      "Distance kills district heat. The town center is 10 to 13 km away.",
      "So we bring users to the heat: a campus on the site first, nearby homes second, the town only if it pays.",
    ],
  },
  {
    say: [
      "Liquid-cooled racks give 50 °C water. Greenhouses and fish tanks need about 45 °C, so no heat pump at all.",
      `Air-cooled heat at 30 °C would need a heat pump everywhere; in Explore that raises campus heat from about ${perMWh(onsite.gate.lcoh_usd_mwh)} to ${perMWh(airCooled.onsite)}.`,
    ],
    ask: "Why require liquid cooling? It makes the heat directly usable, and the new chips need it anyway.",
  },
  {
    say: [
      `Phase 1: ${onsite.greenhouse_ha} ha greenhouse, a fish farm, a rec center and pool. ${musd(onsite.capex_musd)} of capital.`,
      `Heat costs ${perMWh(onsite.gate.lcoh_usd_mwh)} to deliver, against ${perMWh(fin.incumbent_usd_mwh.propane)} for propane.`,
      `${num(imp.jobs)} jobs and about ${num(imp.local_food_t_yr)} t of food a year.`,
    ],
    ask: "Is the land available? Not yet confirmed; that is our first open item.",
  },
  {
    say: [
      "We knock out all data-center heat for 36 hours in the coldest week, at −19 °C.",
      "The tank carries the first hours, then the backup boiler. Zero hours without heat all year.",
      "And the reverse: cooling never depends on the greenhouse. Dry coolers stay sized for 100%.",
    ],
    ask: "What if the heat users stop taking heat? Nothing happens to the data center; the sidestream valve closes.",
  },
  {
    say: [
      "Homes need heat in winter. Greenhouses, fish and a pool need it all year.",
      "That keeps the pipes earning in summer, which is what makes Phase 1 cheap.",
    ],
  },
  {
    say: [
      "This is the core idea: every phase has to beat what its users pay today, in public.",
      "Ring 1 passes easily, Ring 2 is not there yet, Ring 3 fails and we say no.",
    ],
  },
  {
    say: [
      `Homes cost about ${perMWh(corridor.gate.lcoh_usd_mwh)} today: about ${usd(round(path[0].capex_per_home_usd, 500))} a house to build the loop and connect.`,
      `Grants and a cheaper build bring it to ${perMWh(cheaper.lcoh_usd_mwh)}, below propane for every home.`,
      "Baseboard-heated homes already win today, so they connect first.",
    ],
    ask: "Why not air-source heat pumps in every house? Fine for many homes; the loop wins where homes cluster and in cold snaps.",
  },
  {
    say: [
      `The school is ${num(town.pipe_km)} km of pipe away. Too much heat is lost on the way; ${perMWh(town.gate.lcoh_usd_mwh)} against ${perMWh(town.gate.benchmark_usd_mwh)} for gas.`,
      "Saying no to our own idea is the point: the gate is real.",
    ],
  },
  {
    say: [
      "The town owns the pipes and prices at cost. TeraWulf supplies heat free under a 10-year agreement with renewals and step-in.",
      `Tariff ${perMWh(fin.tariff_usd_mwh)}, 75% of propane, with a low-income rate.`,
    ],
    ask: "Why not NYSEG? It can join later under the state thermal network law, but the town is the party that has to trust it.",
  },
  {
    say: [
      `If TeraWulf leaves in year ${fin.dc_exit.year}, only the heat exchanger is stranded: ${musd(fin.dc_exit.stranded_musd)}.`,
      `An air-source heat pump takes over; heat then costs ${perMWh(fin.dc_exit.fallback_lcoh_usd_mwh)}, still under propane.`,
    ],
  },
  {
    say: [
      `About ${num(round(imp.co2_avoided_t_yr, 100))} t CO₂ a year, counted against a propane-heated greenhouse because the campus is new demand.`,
      "Be straight about water: the design already uses no lake water for cooling. Heat reuse saves fan energy, not lake water.",
    ],
    ask: "Doesn't heat reuse protect the lake? Only indirectly. We say so rather than overclaim.",
  },
  {
    say: [
      "Three signatures: the town makes the agreement a condition of approval, TeraWulf commits liquid cooling and free heat, NYSERDA/NYSEG fund the Phase 2 pilot.",
      "Close: this is how Lansing gets to say yes on its own terms.",
    ],
  },
];

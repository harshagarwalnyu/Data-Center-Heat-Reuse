# Data Center Heat Reuse: Verified Precedents

*Generated: 2026-10-03 | Working site: Lake Hawkeye / TeraWulf, Lansing NY (proposed ~400 MW) | Comparison site: 111 8th Ave, NYC | Sources: in progress | Confidence: in progress*

Scope: real precedents of data-center waste heat delivered to communities, weighted toward cold-climate suburban and rural offtakers (homes, schools, pools, greenhouses, aquaculture). Every factual claim below carries a source URL and `(verified 2026-10-03)`, or is marked `[unverified]`. Assumptions are marked **ASSUMPTION**.

## Method

Sub-questions:

1. Deep Green: source size, temperatures, offtaker, who pays whom, published numbers.
2. What are 10–12 verified operating (or contracted) precedents, with location, DC MW, capture temperature, heat-pump use and output temperature, offtaker, energy delivered, ownership and commercial model, public capex, and lessons?
3. Which DC heat-reuse projects failed or were cancelled, and why?
4. Which patterns transfer to a proposed ~400 MW campus on a former coal site in Lansing, NY (cold, low housing density, school and greenhouse candidates)?

Search log and source list grow as pages are read in full. Snippet-only claims stay out of the case writeups.

## Deep Green (starting case)

**Status of this writeup:** primary trade article read in full. Operator-interview numbers (kW, kWh, pool temperature, later sites) are being checked against BBC and Data Center Dynamics before they are added. Conflicting pound-savings figures are kept as a conflict, not averaged.

### What Channel Vision reports

Source: Bruce Christian, “Deep Green Uses Data Center Heat to Warm Pools,” Channel Vision Magazine, 16 March 2023. https://channelvisionmag.com/deep-green-uses-data-center-heat-to-warm-pools/ (verified 2026-10-03).

| Field | What this source says |
|---|---|
| Operator | Deep Green, described as a British start-up. |
| Product | A “digital boiler”: a cloud data center installed on the heat user’s site, not a remote hyperscale campus. |
| Cooling / capture | Immersion cooling. Heat from the servers is transferred into the site’s existing hot-water system. “Around 96 percent of the heat generated” by a digital boiler “is recycled.” Capture temperature in °C is **not stated** on this page. |
| Output temperature | **Not stated** on this page. |
| Heat pump | **Not mentioned** on this page. The described path is immersion oil to the existing hot-water system. |
| First offtaker | Exmouth Leisure Centre, Devon, England. Called the first site in the country to benefit. |
| Other offtaker types named | Swimming pools, and businesses with steady heat needs: bakeries, distilleries, laundrettes, and blocks of flats. |
| Energy delivered | **Not stated** in kWh or MW on this page. |
| Gas displacement | “The surplus heat donated by Deep Green’s unit will reduce the pool’s gas requirements by 62 percent.” |
| Money | “saving them more than £20,000 a year.” Heat is supplied “for free.” Who pays the server electricity is **not stated** on this page. |
| Carbon | “reducing their carbon emissions by 25.8 tons.” |
| Scale claim | “There are more than 1,500 pools in England that could benefit.” CEO Mark Bjornsgaard: “around 30 percent of all industrial and commercial heat needs could be provided by this technology.” |
| Context for the pool | “Energy costs for leisure facilities have increased 150 percent since 2019 and an estimated 79 percent face closure.” |

### BBC and Data Center Dynamics (same launch week)

BBC, Zoe Kleinman, 14 March 2023. https://www.bbc.co.uk/news/technology-64939558 (verified 2026-10-03).

- The computer is “washing-machine-sized.” Computers are “surrounded by oil.” Hot oil is “pumped into a heat exchanger to warm the water in the pool.”
- Heat is “enough to heat the pool to about 30C 60% of the time.”
- The data centre “is provided to the council-run centre free of charge.”
- Deep Green “charges clients to use its computing power for artificial intelligence and machine learning.”
- Founder Mark Bjornsgaard “said the company would also refund the leisure centre's electricity costs” for running the digital boiler, “and seven other England pools had signed up.”
- Sean Day, who runs the leisure centre, “had been expecting its energy bills to rise by £100,000 this year.” The BBC does not give the £20,000 savings figure.
- BBC News had previously reported that “65 swimming pools had closed since 2019.”

Data Center Dynamics, Peter Judge, 14 March 2023. https://www.datacenterdynamics.com/en/news/uk-data-center-startup-offers-to-heat-britains-swimming-pools-with-waste-heat/ (verified 2026-10-03).

| Field | DCD |
|---|---|
| IT size | “a 28kW system” running an HPC cluster for cloud customers. Tubs “could reach a capacity of 40kW.” |
| Capture | Deep Green’s own immersion tubs. Oil removes heat; a heat exchanger heats the pool. No heat pump is described. |
| Output | Pool water. Temperature in °C is not in this article (BBC states about 30°C). |
| Who pays | “Deep Green pays for the electricity it uses and gives the heat free.” The site offer is to “supply, install, and maintain digital boilers for free, including the costs of connecting pipework.” “The electricity they use is paid for upfront, based on the hourly charge currently paid by the customer.” |
| Compute revenue | Bjornsgaard: “we're renting the compute bare metal to AI/machine learning people through the aggregators.” |
| Expected delivery | CTO Matt Craggs: the 25 m pool plus a children’s pool “needs around 222,000 kWh per year to heat.” “Our expected heat transfer from the kit is 139,284 kWh a year, equivalent to 62 percent of the pool’s heat needs.” Extra servers “could extend this to 70 or 80 percent.” These are expected figures, not a metered year. |
| Money and carbon | “cut the pool’s gas requirements by 62 percent and save £20,000 ($24,000) per year” and “25.8 tonnes.” |
| Operator named | Peter Gilpin, CEO of LED Community Leisure, “the center's operator.” |
| Pipeline (March 2023) | Target “upgraded” from seven pools in 2023 to 20. “Further projects signed in Bristol and Manchester.” |
| Hardware (Craggs, by email to DCD) | AMD Epyc Dell servers, “each configured with four A100 80Gb PCIe GPUs and 4TB of SSD,” open chassis. Bjornsgaard: the Exmouth cluster “has 12 four-CPU cards.” |

### Conflicts inside the Deep Green launch coverage

- Savings: Channel Vision says “more than £20,000 a year.” DCD says “£20,000 ($24,000) per year.” A third outlet’s “over £30,000” figure is not used here until that page is read in full.
- Electricity: BBC says Deep Green refunds the leisure centre. DCD says Deep Green pays the electricity, upfront, at the customer’s hourly rate. Read together, the pool does not pay for server power and does not pay for the heat. Neither page is a contract.
- Scale: 28 kW is 0.028 MW. **ASSUMPTION:** at the stated 139,284 kWh/year, average heat output is about 16 kW (139,284 / 8,760). That is below the 28 kW nameplate, which is consistent with a load factor under 1, but the articles do not state the load factor.

### Commercial model, combined

Compute customers pay Deep Green. Deep Green pays for the tub, the pipework, and the electricity, and gives the heat away. The pool’s remaining gas boiler still covers the hours the tub cannot hold ~30°C (BBC: 40% of the time the pool is not held by this heat alone). No public capex figure for the Exmouth install was on these three pages.

### Adjacent firms named by DCD (not Deep Green results)

DCD (same URL, verified 2026-10-03) says Qarnot (France, founded 2010) still offers digital boilers; Stimergy “heated a swimming pool in Paris in 2017 but does not appear to be currently active”; Cloud&Heat “has moved away from digital boilers”; “Nerdalize of the Netherlands disappeared, as did Exergy of New York.” Those four are leads for the failure section. They are single-source until each firm is checked.

### Why it matters for Lansing

This is a **small, on-site, low-temperature** model (a pool), not a 400 MW campus feeding a town. It shows a buyer who already wants ~30°C water and will take heat at zero price. It does not show how to move heat miles to dispersed houses. **ASSUMPTION:** a Lansing school pool could copy the temperature match, but not the “move the data center into the boiler room” siting, because the working site is a proposed campus at the former Cayuga plant, not a server tub under the pool.

## Case catalogue

*Status: cases added one at a time after a primary page is read. Target 10–12.*

## Comparison table

*Status: filled after the catalogue has verified rows. Empty cells stay blank rather than estimated.*

## Patterns for Lansing

*Status: written only from rows already in the catalogue.*

## Failed or cancelled projects

*Status: searching. No project is listed as failed until a source says so.*

## Counter-arguments and risks

*Status: pending.*

## Sources

*Status: numbered list filled as URLs are read.*

## Lane status

- **Done:** file skeleton created (2026-10-03).
- **In progress:** Deep Green primary article; precedent search.
- **Missing:** verified case rows, comparison table, Lansing patterns, failed-project list.
- **Open questions:** see end of file once research closes. Do not treat this section as final.

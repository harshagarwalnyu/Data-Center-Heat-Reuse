# Judge drill: every number, three levels deep

Every question a judge is likely to ask, with the answer and the two follow-ups after it. Each number comes from `outputs/site2.json`, `outputs/hydraulics.json`, `outputs/analysis_detail.json`, `config/*.yaml` or `docs/term-sheet.md` (checked 2026-10-04). Where an input is our own assumption, it says so. Say "assumption" out loud when a judge pushes on one; it is a strength, not a weakness.

How to read this: **Q** is the judge's first question, **→** is the follow-up, **→→** is the follow-up to that.

---

## 1. "Where does 778 GWh of heat come from?"

**Q. How much heat does the data center give off?**
About 778 GWh a year (`supply.heat_available_GWh` = 777.6). That is the heat we could capture, not the total the building makes.

**→ How did you get 778?**
150 MW of IT load (TeraWulf's first phase, from news reports) × 80% average load × 75% of the heat captured in liquid at about 50 °C × 99% uptime of our heat connection, summed hour by hour over a year. Roughly: 150 × 0.8 × 0.75 × 0.99 × 8,760 h ≈ 780 GWh; the hourly model gives 777.6.

**→→ Why 75% captured? Why 50 °C?**
75% is our base assumption ([A] in `config/engineering.yaml`). We test 40% and 85% as scenarios: the low end is the share of heat in liquid in a Virginia greenhouse study (33-42% of power), and the high end is the organizers' "up to 85% recoverable". 50 °C is a direct-to-chip liquid-cooling return temperature (45-55 °C in the same Virginia study, 45-65 °C in the Open Compute heat-reuse paper). **It does not matter for the answer:** at 40% capture the cost of heat is still $106 per MWh, because we only use 6.5% of the heat anyway.

---

## 2. "Why do you only use 6.5% of the heat?"

**Q. You have 778 GWh and deliver 51 GWh. Why so little?**
Because Lansing is small and spread out. Our customers need 50.6 GWh a year (`totals.heat_delivered_MWh` = 50,576), which is 6.5% of what is available.

**→ Isn't that a weak result?**
It is the honest result, and it is the industry's known problem. A speaker from the Open Compute heat-reuse group described a 300 MW campus whose neighbors need about half a megawatt. Supply is never the limit; nearby demand is. We scaled to the demand that pays, rather than drawing pipes to customers who don't.

**→→ What would raise it?**
A bigger anchor customer near the plant. The model notes one candidate (the Cargill salt mine) as something that could change the town-center verdict, but we have not modeled it. If TeraWulf builds out to 320 MW, the share drops to 3% because supply doubles and demand doesn't.

---

## 3. "What does propane cost?"

**Q. You say propane heat costs $136 per MWh. Where is that from?**
$3.10 a gallon (NYSERDA's Central New York 2025-26 heating season; range $2.74-3.46) ÷ 26.8 kWh of energy per gallon ÷ 85% furnace efficiency = $136.1 per MWh of heat delivered in the home.

**→ Propane prices move. What if it's cheaper?**
At $2.85 a gallon (our low case) propane heat is $125 per MWh, our price falls with it to $100, and a home still saves about $676 a year. Our price is tied to propane, so customers always save 20%.

**→→ Then the co-op earns less. Does it still work?**
The co-op's cost doesn't change; its revenue drops. That widens the funding gap the data center covers. In the uncertainty run, the gap ranges from $21M to $32M (10th to 90th percentile).

---

## 4. "What does a home pay and save?"

**Q. What does a household pay?**
$108.90 per MWh: 80% of propane's $136.10 (`finance.tariff_rule` = "0.8 x propane, fixed").

**→ Where does $735 a year come from?**
A typical home uses 27 MWh of heat a year. 27 × ($136.10 − $108.90) = $735. Against heating oil ($155.80 per MWh) the saving is $1,266.

**→→ What about low-income households?**
20% of homes get a deeper discount: 35% below propane, $88.50 per MWh, saving $1,286 a year. Both the 20% share and the 35% discount are our assumptions.

---

## 5. "What does it cost to make the heat?"

**Q. What is your cost of heat?**
$106 per MWh at 7% financing (`finance.lcoh_usd_mwh.utility_7pct` = 106.1). It is $90 at 4% (co-op or public finance) and $125 at 10% (private finance).

**→ How is that calculated?**
Levelized cost of heat: each year's payment on the build cost, plus the yearly running cost, divided by the heat delivered. Build cost is spread with separate lifetimes (pipe and tank 30 years, equipment 20 years). Running cost is $1.94M a year, including heat-pump and pumping electricity. The heat itself is free: we pay the data center $0.

**→→ Why is it cheaper than propane?**
It is an average. The farm campus costs $41 per MWh and the homes cost $286. Weighted by how much heat each uses (37.1 GWh and 13.5 GWh), the average is $106. **The homes alone are not cheaper than propane. Say this before they do.**

---

## 6. "Why are the three rings so different?"

**Q. On-site $41, corridor $286, town $734. Why?**
Pipe per unit of heat.

| Ring | Heat a year | Pipe | Cost per MWh at 7% |
|---|---|---|---|
| On-site farm campus | 37.1 GWh | 0.5 km | $41 |
| Corridor homes | 13.5 GWh | 20.9 km | $286 |
| Town center | 3.6 GWh | 14 km | $734 |

**→ Why is the corridor so expensive?**
21 km of pipe and 500 home heat pumps for 13.5 GWh. That is 0.65 MWh per metre of pipe a year, about 0.33 kW per metre at peak, well under the 1.2 kW per metre usually cited for a traditional heat network (`docs/evidence.md`). It is a thin load.

**→→ Then why build it at all?**
Because these homes have no gas line (Lansing has had a gas moratorium since February 2015) and burn propane, oil or electric heat. They are who the town wants helped. We build it one cluster at a time, only where homes sign up and heat pumps are funded (checkpoint G6 in the term sheet), and the data center covers the gap.

---

## 7. "What does it cost to build and run?"

**Q. Total build cost?**
$38.8M for the farm campus and corridor (`finance.capex_musd.total` = 38.76).

**→ What's in it?**
- **Corridor pipe:** $9.4M
- **Home heat pumps:** $8.0M (500 at about $16k each)
- **Contingency:** $5.7M (20%)
- **Soft costs:** $4.3M (15%: design, permits, owner)
- **Backup boilers:** $2.8M (sized to 100% of peak)
- **Data-center connection:** $2.6M (plate heat exchanger, isolation, spare unit, controls)
- **Storage tank:** $1.7M
- **On-site substations:** $1.6M
- **Service lines and meters:** $1.25M
- **Pumps and plant:** $0.9M
- **On-site pipe:** $0.45M

**→→ Where do those unit costs come from?**
Mostly assumptions, and we label them. Pipe at $450 per metre and heat pumps at $16k each come from an MIT course that puts a networked geothermal connection at about $50k per home, roughly one third in-home. Our research doc flags both as possibly optimistic: insulated heat pipe in Ireland ran €782-869 per metre in 2020. Ours is uninsulated plastic pipe, but we have no direct source. If pipe costs 40% more, the cost of heat rises to $116; if it costs 30% less, it falls to $98.

---

## 8. "The $26M gap and the 1.7%"

**Q. What is the $26M?**
The funding gap: over 30 years, in today's money at 7%, the project's costs exceed its heat sales by $26.0M (`extras.cba.headline_gap_musd` = 26.01).

**→ How is it made up?**
The corridor homes lose $30.3M on their own (they cost $286 per MWh and pay about $109). The farm campus pays $50 per MWh against a cost of $41 and earns a $4.3M surplus. $30.3M − $4.3M = $26.0M. As a yearly payment over 30 years at 7%, that is $2.1M a year. (Dividing by 30 with no interest gives $0.87M, but that understates it.)

**→→ And 1.7% of $1.5B?**
$26M ÷ $1.5B = 1.73%. **$1.5B is our estimate, not TeraWulf's number:** 150 MW × $10M per MW, the rough midpoint of the Turner & Townsend 2025 construction cost index ($6.6-13.3M per MW). If the build costs $6.6M per MW, the share is about 2.6%. Either way it is a small slice of the project. The point of the number is scale, not precision.

---

## 9. "Why would the data center pay?"

**Q. Why would TeraWulf pay $2.1M a year?**
Because without a deal, the town is drafting a ban. $2.1M a year is the price of permission to operate.

**→ Isn't that just a bribe?**
It is a community benefit agreement, a standard tool, written into permit conditions. The money goes to a specific, audited use (closing the heat network's gap), with an annual public report.

**→→ What does TeraWulf get besides permission?**
- **Fan energy:** heat we take doesn't need its dry-cooler fans, saving about 970 MWh of fan electricity a year.
- **Heat reuse on record:** an energy reuse factor of 4.6% it can report.
- **Zero operational risk:** the cooling-priority clause, below.

Europe already requires reuse: Germany requires new data centers to reuse 10% of their energy from July 2026, rising to 20% by 2028. New York doesn't yet, so getting ahead of it has value.

---

## 10. "How do you connect to the data center without risking it?"

**Q. How do you take the heat?**
A side loop. A plate heat exchanger is tapped into the data center's warm-water cooling loop. Our water never touches theirs.

**→ What if your side fails?**
Cooling always wins (term sheet section 2.3). The data center's own dry coolers stay in place and carry the full load. If our loop trips, valves isolate it and the data center doesn't notice. The connection has a spare (N+1) heat exchanger.

**→→ Why does that matter so much?**
In the industry videos, an Open Compute speaker said the reason most heat deals die is that data centers' legal teams won't depend on an outside heat operator. Jon Summers (RISE) said heat reuse can disrupt reliability, so "we need to do this in a sensible way." Our design makes the data center depend on no one.

---

## 11. "Heat pumps: what COP and why?"

**Q. What is your heat-pump efficiency?**
Average 4.7 (`totals.avg_cop` = 4.71): each unit of electricity delivers 4.7 units of heat. It is calculated every hour from the actual temperatures, as a fraction of the theoretical maximum, and capped between 2 and 6.

**→ Isn't 4.7 high?**
It is at the top of the measured range. A survey of 24 low-temperature networks found 3 to 5, with 17 of 24 at 4 or above (Buffa et al. 2019, in `docs/evidence.md`). Our home heat pumps lift from a 20 °C loop, which is easy.

**→→ What if it's worse?**
The model barely moves: heat-pump efficiency is the smallest driver in our sensitivity chart, $104 to $109 per MWh. Pipe cost and financing matter far more.

---

## 12. "What happens on the coldest day?"

**Q. Will people be cold?**
Zero hours without heat in the model. But that is because we size backup boilers to cover 100% of peak, and the model says so (`totals.unmet_note`).

**→ So how much do you rely on backup?**
At peak, the data center covers 95.3% and backup 4.7%. Over the year, backup supplies 0.73% of the heat. Across 88 peak hours, the data center does almost all the work.

**→→ What buffers the swings?**
A 5,558 m³ hot-water tank at the data center: 6 hours of peak demand. The weather is a real hourly year for Ithaca (TMYx 2009-2023), so cold snaps are in the model, not averaged out.

---

## 13. "What if the data center leaves?"

**Q. What if TeraWulf shuts down in 10 years?**
We modeled it. At year 10, $5.7M of assets would be stranded if nothing replaced the heat. A replacement heat source (air-source or borehole plant) costs about $10.4M and adds about $93 per MWh to the corridor's cost.

**→ Who pays that?**
The term sheet (sections 2.4-2.6):
- **What stays:** the pipes and home heat pumps.
- **Interim supply:** backup boilers cover the hours until the new source is running.
- **Funding:** a decommissioning reserve and a transition fund pay for the switch.
- **Control:** the co-op has step-in rights on the site exchanger.
- **Price:** members' price stays at 0.8 × propane; the switch cost is not passed to them.

**→→ How big is the reserve?**
Left open on purpose (term sheet 8.3). $5.7M is the starting reference. Whether it should also cover the $10.4M replacement is a negotiating question for counsel and an engineer. We say it is open rather than invent a number.

---

## 14. "Why did you reject the town center?"

**Q. Why not serve the town center?**
It costs $734 per MWh, more than five times propane.

**→ Why so high?**
14 km of pipe to deliver 3.6 GWh. The town's buildings need 65 °C water, so the long main runs hot and loses 1,840 MWh a year, about half as much as it delivers. Pipe is 82% of that ring's cost.

**→→ Would hotter data-center water fix it?**
Not really. Even with 65 °C capture, which lets the main run without a heat pump 71% of the time, the cost only drops to $721. Adding the town would push the average for everything to $147, worse than propane. So it fails our gate. It is only worth building with grant money or a big new anchor customer.

---

## 15. "Pumps and hydraulics" (the Grundfos question)

**Q. How much energy does pumping take?**
We assumed 1.5% of delivered heat, a common rule of thumb. Then we checked it bottom-up, pipe by pipe, with variable-speed pumps: 0.74% (`outputs/hydraulics.json`). Our assumption was conservative.

**→ How did you check it?**
For each ring: design flow from heat load and temperature drop, pipe size from velocity and friction limits, pressure loss with a 30% allowance for fittings, then pump power at 70% pump and 93% motor-drive efficiency, run hourly with a 20% minimum flow.

**→→ What matters most for pumping?**
Temperature difference. The corridor loop runs only 5 °C between supply and return, so it moves four times as much water as a 20 °C loop for the same heat. If that drops by 1 °C, flow rises 25% and pump power rises about 95%. Keeping delta-T up is the main operating target, which is exactly where variable-speed pumps and controls earn their keep.

---

## 16. "Carbon"

**Q. How much CO2 do you avoid?**
11,408 tonnes a year, about 2,659 cars off the road (EPA's 4.29 t per car).

**→ How?**
- **Fuel displaced:** 52,016 MWh a year of propane, oil and electric heat, by the mix from the Census survey of Lansing's non-gas homes.
- **Emissions emitted:** subtract the electricity for heat pumps and pumps (upstate New York grid, 0.11 kg per kWh) and the backup fuel.
- **The rest is net avoided.**

**→→ What if you use the dirtier marginal grid?**
10,670 tonnes, still positive. In the uncertainty run, the range is 10,900 to 11,800 tonnes.

---

## 17. "Water"

**Q. Does this save lake water?**
We don't claim it does. The data center's design is closed-loop dry cooling, which already uses little water, and that is TeraWulf's own choice, not ours.

**→ So what is the water benefit?**
Heat we take doesn't need to be rejected by fans: about 970 MWh a year of fan electricity saved. And a permit covenant can keep the 1.008 million-gallon-a-day water permit unused (no misting or evaporative add-ons).

**→→ Why not claim more?**
Because it isn't true, and a judge from HDR or Grundfos would know. Honesty here protects the rest of our numbers.

---

## 18. "How sure are you?"

**Q. How confident are these numbers?**
We ran 500 full re-runs of the hourly model, each with randomly drawn inputs:
- capture share
- electricity price
- pipe cost
- heat-pump cost
- propane price
- and others

The cost of heat lands between $98 and $115 per MWh (10th to 90th percentile), centered on $107. The funding gap lands between $21M and $32M.

**→ What drives the answer most?**
In order: financing rate ($90-125), pipe cost ($98-116), how many corridor homes sign up ($98-112), electricity price ($100-111), heat-pump efficiency ($104-109). Data-center size doesn't matter at all, because supply is never the limit.

**→→ Can someone check your work?**
Yes. The model is open and runs with one command. There are 48 automated tests. Every input is listed with a source or an "assumption" label, and a verification report checks every one.

---

## 19. "Everyone has a co-op. What's different?"

**Q. Other teams also proposed a co-op for Lansing. Why is yours different?**
The co-op is just who owns the pipes; 350 of about 400 Danish heat utilities are co-ops. Our contribution is the deal around it, which answers three questions a co-op alone doesn't:
1. **Who pays the shortfall?** The data center, about $2.1M a year, through the community benefit agreement.
2. **What if the data center leaves?** The exit plan, reserve and step-in rights above.
3. **What stops a bad build?** Dated checkpoints, and we killed our own town ring.

**→ Isn't "cheaper heat" the point?**
Not for Lansing. The town isn't asking for cheap heat; it is drafting a ban. The question is whether it can say yes safely. Cheap heat is one term of the deal.

**→→ What if the town just says no anyway?**
Then nothing is built and nobody loses money. Checkpoint G0 (31 March 2027) is the town's choice. If a ban is enacted and final, we stop: no design spending, no co-op assets.

---

## 20. "Is this legal? Who runs it?"

**Q. Can a town do this?**
We do not claim legal authority. That is the first item on our list for a New York lawyer (term sheet 8.1). We propose a checkpoint (G0.5) for a legal opinion before any spending.

**→ Can't the town just create a heating district?**
Possibly not. Our check of New York Town Law section 190 suggests it doesn't list heating districts, but we rate that unconfirmed. That is one reason the co-op, not the town, owns and runs the network.

**→→ Who governs the co-op?**
A member-elected board, with one seat for the town. The town is a counterparty, not the operator or guarantor, unless the term sheet's fallback is used and a town-chartered body takes over the agreements.

---

## 21. "What's the timeline?"

**Q. When does this happen?**
Dated checkpoints in the term sheet:
- **G0, 31 March 2027:** the town chooses to negotiate instead of banning.
- **G1, 31 March 2028:** lawful data-center approval with these agreements attached.
- **G2, 30 June 2027:** legal form memo.
- **G6, by 31 March 2031:** the corridor go or no-go, cluster by cluster.

TeraWulf's operations start around 2029.

**→ Why so slow?**
Because nothing gets built before the town has agreed and the data center is approved. We don't spend money ahead of consent.

**→→ What gets built first?**
The farm campus: short pipe, cheapest heat, and it earns a surplus. Homes follow only where they pass the test.

---

## 22. "The farm, fish and jobs"

**Q. What is on the farm campus?**
A 10-hectare greenhouse, fish farming and a rec center with a pool, all fed directly with 45 °C water, no heat pump.

**→ How do you size the greenhouse?**
About 1 MW of heat per hectare (Virginia greenhouse study). The campus uses 37.1 GWh a year with a 16.4 MW peak. The greenhouse figure (310 kWh per m² a year) matches a Dutch benchmark (`docs/evidence.md`).

**→→ And 126 jobs, 5,500 tonnes of food?**
Jobs come from a greenhouse jobs benchmark plus our assumptions for the fish farm (one job per 40 tonnes), rec center (12) and network operations (8). Food is 5,500 tonnes a year, 1,500 of it fish. **These are indicative, not commitments.** Say so if asked.

---

## 23. "Isn't a home heat pump cheaper?"

**Q. You list an air-source heat pump at $97 per MWh. That's cheaper than your $109. Why not just give people heat pumps?**
The $97 counts only electricity: residential power at $245 per MWh ÷ a seasonal efficiency of about 2.5 in Lansing's climate. It leaves out buying and installing the unit.

**→ So which is actually cheaper?**
For a single scattered home, a standalone heat pump with rebates may well be the right tool, and we say so. Our network wins where homes are close enough together: the ground loop makes the home heat pump far more efficient (4.7 against 2.5), and the co-op carries the equipment cost.

**→→ So should the corridor be air-source instead?**
For some of it, maybe. That is exactly why the corridor is built cluster by cluster: where homes are too spread out, rebates for standalone heat pumps beat pipe.

---

## 24. "Natural gas homes?"

**Q. Gas is $64 per MWh. Those homes won't save.**
Right. That is why we target homes gas never reached. Lansing has had a gas moratorium since 2015, so most corridor homes burn propane, oil or electric heat (62% of the town's non-gas households, Census survey).

**→ Do you serve any gas homes?**
Not in the base case. The town ring's mix includes some gas, which is one more reason it fails.

**→→ What about the low-income tier?**
It is for propane and oil homes. Those pay the most today, so they gain the most.

---

## 25. "What about incentives and tax credits?"

**Q. Did you count federal tax credits?**
No. Our base case has none. A 30% credit would roughly halve the funding gap, from $26M to $13M, but waste-heat networks are probably not eligible for the federal geothermal credit, so we show it only as an "if counsel says yes" scenario.

**→ Other funding?**
Possible sources for the home heat pumps: the NYSERDA Clean Heat program and a NYSEG non-pipe alternative. These are not in our numbers.

**→→ Why not include them?**
Because they are not committed. Our headline uses only money the deal itself provides.

---

## 26. "Why Site 2 and not Site 1?"

**Q. Why Lansing and not 111 8th Avenue in Manhattan?**
Lansing is a new build, so heat capture can be designed in from day one. 111 8th Avenue would be a retrofit onto someone else's existing cooling system. And Lansing has a live decision: the town is moving toward a ban, so heat reuse has a real job to do.

**→ Isn't Manhattan denser, with more heat customers?**
Yes. Our Compare page shows Site 1 side by side. But Manhattan already has the Con Edison steam system ($41.53 per thousand pounds), and the building is a multi-tenant carrier hotel we don't control.

**→→ Did you model Site 1?**
Yes, with rougher inputs, as a comparison only. Its results are indicative.

---

## 27. "Did you use AI?"

**Q. Did you use AI tools?**
Yes, to write and check code, research sources, review documents and build the website and video. Every number comes from our own open model and sourced inputs, and we ran automated reviews and tests on every change.

**→ How do we know the numbers aren't made up?**
- **Traceable inputs:** every input traces to a source or an "assumption" label.
- **Fact checks:** we corrected our own errors against primary sources, for example the propane emission factor (EPA 62.87, not 61.46) and the propane price.
- **Reproducible:** the model reruns from scratch with one command.

**→→ What did you do yourselves?**
The framing (consent, not cheap heat), the deal structure, the decision to kill the town ring, and judging which numbers to trust.

---

## Numbers card (memorize these)

| Number | What it is | How |
|---|---|---|
| 778 GWh | heat available a year | 150 MW × 80% load × 75% captured, hourly |
| 6.5% | share we use | 50.6 GWh of demand ÷ 778 |
| $136 | propane heat per MWh | $3.10/gal ÷ 26.8 kWh/gal ÷ 85% |
| $109 | our heat price | 0.8 × propane |
| $735 | yearly saving per home | 27 MWh × ($136 − $109) |
| $106 | average cost to make heat (7%) | farm $41 and homes $286, weighted by heat |
| $90 / $125 | same at 4% / 10% finance | financing rate |
| $38.8M | build cost | biggest items: pipe $9.4M, home heat pumps $8.0M |
| $1.94M/yr | running cost | paid from heat sales |
| $26M | funding gap (30 yr, today's money) | homes −$30.3M, farm +$4.3M |
| $2.1M/yr | what the data center pays | $26M as a 30-year payment at 7% |
| 1.7% | gap ÷ estimated build cost | $26M ÷ $1.5B (our estimate: 150 MW × $10M/MW) |
| $734 | town ring cost per MWh | 14 km for 3.6 GWh; rejected |
| 4.7 | heat-pump efficiency | hourly, capped 2-6 |
| 0.74% | pumping energy, checked bottom-up | vs 1.5% assumed |
| $98-115 | cost range (500 runs) | 10th to 90th percentile |
| 11,408 t | CO2 avoided a year | fuel displaced minus electricity used |
| $5.7M | stranded if the DC leaves at year 10 | covered by reserve and step-in |

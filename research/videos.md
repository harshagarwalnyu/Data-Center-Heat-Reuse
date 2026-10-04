# Playlist research: data center heat reuse (digest of 44 videos)

Playlist: https://www.youtube.com/playlist?list=PLrZMAz7fZps09Vy9XfEzJNIg8mIudPjKk (all 44 from the Infrastructure Masons channel). Built 2026-10-04 from auto-subtitles in `research/transcripts/clean/NN-<id>.txt`, `.heat.txt`, `.numbers.txt`. Speaker names and numbers are from subtitle text and the auto-captions are noisy; treat figures as indicative, not citable without re-checking the video.

**Headline: this playlist is mostly an industry-association feed (power, AI, careers, ESG, construction). Only ~14 of 44 videos mention heat reuse at all, and only 3 carry usable heat-reuse substance: #39 (heat reuse + liquid cooling), #41 (energy reuse metrics, reliability), #28 (immersion, district heating, pools). It is NOT a source of project-level numbers (no $/MWh, payback, COP or CO2 case studies). Use the organizer docs in `resources/text/` and `research/digest-organizer.md` for hard numbers.**

Format per video: title, URL, bullets, hard numbers, projects, "Use in our project".

---

## Videos with heat-reuse content

### 39. Decarbonization and Heat Re-Use in Data Centers
https://www.youtube.com/watch?v=IHIt66rNJr8 (29:10; consultant David G., OCP heat-reuse workstream)
- Heat-reuse projects are mostly in Europe, driven by the gas price crisis; few in the US.
- Swimming-pool project (city of "Mudon" in captions, likely a European municipality; name unverified): add one 100 kW boiler in place of three 900 kW gas boilers and gas use halves; summer server load dips so a pool is "not a perfect match" for constant data-center heat.
- Liquid cooling is "a perfect match" for reuse: facility water 34 C in / 44 C out for air-side doors; on-chip cooling can reach up to ~70 C outlet water, so a district at 70 C needs no heat pump.
- Higher-grade heat is more likely to be paid for; OCP white paper has a table of temperature ranges (20-40 C vs 40-70 C) mapped to hosts (food, pharma, etc.).
- Biggest bottleneck: capacity mismatch. A 300 MW greenfield campus whose nearest users are villages with ~500 kW of demand; also legal departments and liability make data centers refuse dependence on a heat operator.
- Same-building reuse of a small server room is the easy case (two pipes).
Hard numbers: 34/44 C air-side loop; ~70 C on-chip outlet; 900 kW x3 boilers; 300 MW vs 500 kW mismatch; rack 100 kW liquid vs 15 kW air; up to 35% of new-server power is fans (removed by liquid); 1.8 MW vs 3 MW input for the same compute (~40% more IT in the same grid limit).
Projects: Open Compute Project heat-reuse workstream white paper; open-source underground modular data center concept (3,000 racks, 'fish farming and greenhouses' as heat users).
**Use in our project:** quote the "supply >> demand, matching is the bottleneck" point for the insight slide and cite as a second source for 45-70 C liquid-cooling outlets; supports a 'capture temperature' sensitivity above our 50 C base.

### 41. The Research Side of Data Centers with Jon Summers
https://www.youtube.com/watch?v=dWSxZwLn0nQ (35:01)
- Data centers produce low-grade heat; the idea of "borrowing electricity" and passing heat into a heat network is attractive but hard because uptime culture resists touching the infrastructure.
- Heat reuse can be disruptive to reliability, "so we need to do this in a sensible way" (our sidestream-only design addresses this).
- A heat pump in the loop upgrades DC heat to network grade; PUE alone does not capture it. Energy Reuse Factor (ERF) and Energy Reuse Effectiveness (ERE) explained: if half of input energy is reused, ERE is half of PUE; PUE cannot be < 1.
- Colocation clients may reject a site with PUE 1.3 even if the extra is heat pumps feeding a network, a case for reporting ERE not PUE.
Hard numbers: none beyond the PUE/ERE definitions (consistent with HDR deck p17-18).
**Use in our project:** report ERE next to ERF (our site2.json: ERF 4.6%, ERE 1.15); add one sentence on why we do not hurt "PUE" when the heat pump sits on the heat-user side.

### 28. Liquid Cooling: Deep Dive on Immersion Cooling with Scott Sickmiller
https://www.youtube.com/watch?v=kxr5wkDYcKE (42:41)
- Immersion removes server fans and raises heat quality; speaker says reuse is mainly northern (Minnesota, Canada, UK), "very little" in Texas.
- US pilot using immersion heat for hotel-style pool heating (a typical pool spends ~18 kW to heat).
- District heating from immersion is still "relatively low grade" at 40-50 C but closer to the ~95 C network target (older networks).
- Single-phase immersion runs ~25-27 C incoming fluid.
Hard numbers: 40-50 C reuse temperature; 18 kW pool; 25-27 C incoming.
**Use in our project:** supports that 45-50 C liquid-loop heat is "low grade, needs a lift for old networks but fine for greenhouses, pools and ambient loops" (our on-site ring runs direct at 45 C).

### 07. Optimise or Transform: two novel approaches to datacentres cooling efficiency
https://www.youtube.com/watch?v=eUfg6eYOutE (50:54)
- Heat reuse "a little in Europe, not much in the United States".
- Data centers built "in the middle of nowhere" in the US; all input energy could be captured as heat and displace natural gas at the point of use, but not for power generation (temperature too low).
- Cooling optimization (AI setpoints) improves PUE but can lower heat quality; a CO2 two-phase pilot can feed a heat pump directly.
- Community pushback on new sites is a driver to explore district heating.
Hard numbers: PUE 1.5 to 1.1-1.2 unlocks capacity.
**Use in our project:** the "middle of nowhere" quote frames Lansing's problem (no dense heat load) and the community-benefit angle.

### 11. From Power to Water: Start-ups Taking on Data Center Bottlenecks
https://www.youtube.com/watch?v=vfUD8FKB93g (48:24)
- A start-up uses data-center waste heat to drive a desiccant water generator (water from air), integrable with air chillers.
- Notes that European district heating is the main existing waste-heat use.
Hard numbers: none.
**Use in our project:** only as a water-nexus aside; we do not claim lake-water savings, so skip.

### 17. The Next Generation Data Centre: Innovation, Energy, and Optimism with Yuval Bachar
https://www.youtube.com/watch?v=oVsqZHZIrto (46:29)
- Mixed-cooling racks: ~110 kW direct-on-chip plus ~35 kW air per rack (so ~75% of heat in liquid), racks heading from 150-250 kW toward very high densities.
Hard numbers: 110 kW liquid + 35 kW air; 150-250 kW per rack now.
**Use in our project:** independent support for `capture_fraction` 0.75 (110/(110+35) = 0.76).

### 05. The Next Data Centers: Ocean Floor, Job Site, Space
https://www.youtube.com/watch?v=J2Juo0WPjhg (53:08)
- Next-generation GPU architecture moved to a 45 C coolant loop; speaker wants to push higher.
- Subsea pods at 50-100 MW scale reject heat to seawater, not a reuse case.
Hard numbers: 45 C coolant loop; 50-100 MW pods.
**Use in our project:** cite the 45 C coolant-loop trend as the floor for our 50 C capture assumption.

### 26. Transform Basic Compliance into Performance Management (Maximilian Weidl)
https://www.youtube.com/watch?v=vqe-QmSoj3I (42:00)
- Heat reuse is "increasingly clear" as a key sustainability KPI; Germany already has regulation on it (Energy Efficiency Act style requirement).
Hard numbers: none.
**Use in our project:** one line on regulatory direction (Europe 10-20% reuse requirements are in Topic 5 slide 38).

### 38. Optimizing the IT Stack and Upcoming Legislation (Rich Kenny)
https://www.youtube.com/watch?v=NoQ2SkVycm0 (29:18)
- Moving to liquid cooling and heat distribution (pools, schools, communities) improves ERF and WUE; example: replace 800 racks with 50 racks at 5x density.
**Use in our project:** schools and pools named as hosts, consistent with our rings.

### 37. The Practical Side of Data Center Training (John Booth)
https://www.youtube.com/watch?v=n8WzghPE4oM (38:54)
- UK Midlands district heat push; waste heat from data centers is "flavor of the month"; UK government net-zero department waste-heat project mentioned.
**Use in our project:** none beyond UK policy context.

### 12. Emissions Rising, Rules Tightening: Are Data Centres Compliance Ready?
https://www.youtube.com/watch?v=p76HnVro6RE (1:01:34)
- Smaller European operators innovate on heat-reuse metrics; metric rigor is a trust signal.
**Use in our project:** none.

### 40, 10, 08, 32 (passing mentions)
- #40 Wind Engineering (https://www.youtube.com/watch?v=re0heTaNsAA): heat must go to the atmosphere unless district heating is available.
- #10 Innovation Unwrapped Behind the Scenes (https://www.youtube.com/watch?v=kIDILvlODkc): "waste heat reuse ... giving back to the community" listed among trends.
- #08 Power, Scale & AI (https://www.youtube.com/watch?v=FrkhPPq92pg): campus as ecosystem with power generation, waste heat recovery, water recycling.
- #32 Practical Perspective on Liquid and Immersion Cooling (https://www.youtube.com/watch?v=2sdUduqfOPQ): heat reuse needs flow/pressure/temperature monitoring of bath water.
**Use in our project:** none; background only.

---

## Videos with no heat-reuse content (checked excerpts and keyword search)

Each row: title, URL, what it is, any number worth knowing. "Use in our project: skip" unless stated.

- 01. Data Centers Under the Sea? Plus Tracking the Real Cost of AI | Meet the Startups. https://www.youtube.com/watch?v=JGytn9SLl2E. Subsea pods; modeled PUE 1.05-1.1. Skip.
- 02. Power Is the New Bottleneck: Inside the AI Data Center Energy Crunch. https://www.youtube.com/watch?v=_O1Qv2iTbFE. Utilities cannot serve 100-200 MW loads in suburban and rural areas. Use: one supporting line that rural grid interconnection is the real constraint (relevant to HP load at Lansing).
- 03. Why AI Isn't ChatGPT: The Physical AI Cutting Data Center Cooling Costs. https://www.youtube.com/watch?v=i4rv0Bm2lQM. AI cooling control; claimed 30-40% cooling-energy saving, realistically ~30%. Skip.
- 04. Innovation Unwrapped: Q3 2026 Update. https://www.youtube.com/watch?v=cCC5G8SmbCs. Committee update; no numbers. Skip.
- 06. Rethinking Data Center Supply Chains. https://www.youtube.com/watch?v=q2WJaKtexU0. Procurement. Skip.
- 09. Design for Success: Rethinking Risk, Speed & Sustainability. https://www.youtube.com/watch?v=oDhqrOKSdPI. Low-carbon construction. Skip.
- 13. Driving Operational Efficiency and Resilience. https://www.youtube.com/watch?v=m_kyhCD0J5w. UPS eco mode ~30% energy-cost cut. Skip.
- 14. Innovation... Supplier Engagement Model (Legrand). https://www.youtube.com/watch?v=EXgUZKngVNQ. Racks at 150-200 kW. Skip.
- 15. Innovation You Can Join: The iMasons 2026 System. https://www.youtube.com/watch?v=LWxf6Ts7wqw. Association overview. Skip.
- 16. Powering the Future: Renewables, Resilience, and the New Data Center Playbook. https://www.youtube.com/watch?v=ERoY9XpmVH4. 24/7 carbon-free energy; grid not firm 5-7% of the year. Skip.
- 18. Can ESG Outweigh Profit? (Southwire). https://www.youtube.com/watch?v=INx5pNOi99A. Embodied carbon. Skip.
- 19. Innovation Unwrapped: Inside the iMasons Innovation Committee. https://www.youtube.com/watch?v=l6jmd2lNW10. Green concrete; facilities with <50% potable water. Skip.
- 20. Shaping the Next Generation (Nabeel Mahmood). https://www.youtube.com/watch?v=Toy3NUrmTNY. Talent. Skip.
- 21. From Cost Center to Catalyst (John Cowan). https://www.youtube.com/watch?v=nNWbgyKsV4s. Investment framing. Skip.
- 22. A Fresh Lens on Recruitment (Teksan). https://www.youtube.com/watch?v=yqtzOebHf1k. Skip.
- 23. Digitizing Data Center Construction with AR. https://www.youtube.com/watch?v=_lh-vTAqc-I. Rework ~30% of project time. Skip.
- 24. Agentic AI in the Data Center Sector. https://www.youtube.com/watch?v=739-OUKhT_c. Skip.
- 25. Greenwashed or Green-Proof? Energy Procurement. https://www.youtube.com/watch?v=PfMFzrGx8LU. Private wire covers ~10-20% of load. Skip.
- 27. Liquid Cooling: Optimizing Capital Investment. https://www.youtube.com/watch?v=kt2YDthYJqA. Racks 40-130 kW (NVL72 ~130 kW) need liquid. Use: density context only.
- 29. Smarter Recruitment. https://www.youtube.com/watch?v=vwrKqhCsLHA. Skip.
- 30. Liquid Cooling: Designing, Building, and Commissioning. https://www.youtube.com/watch?v=PWxo6wT1dNE. Commissioning needs temporary load banks; largest skid-mounted 500 kW vs CDUs ~800 kW. Use: the "heat load to commission liquid loops" point could be a (trivial) synergy: the heat network can serve as load bank. Low value.
- 31. Liquid Cooling: Overview of Technologies and Use Cases. https://www.youtube.com/watch?v=u-6cqitc8GE. Taxonomy (cold plate, single/two-phase immersion, 30-35 C boiling fluids). Skip.
- 33. Liquid Cooling: Key Drivers of Density Requirements (Duncan Ng). https://www.youtube.com/watch?v=JXVETMn0P0s. 135 kW racks require liquid. Skip.
- 34. Practical use cases for AI in Data Centres. https://www.youtube.com/watch?v=iaz62BeW37o. ~40% cooling-energy cut via ML (Google 2016). Skip.
- 35. Social Good as a Service (Jay Frank). https://www.youtube.com/watch?v=7rpWZ1fBGaI. Social-impact commission model. Skip.
- 36. The impact of AI on Data Centre Optimization. https://www.youtube.com/watch?v=M8NPAZmBAxY. Clogged chilled-water filters wasted 75 MWh per month. Skip.
- 42. The Methodology of Carbon Accounting for Batteries. https://www.youtube.com/watch?v=Uyr6F08uc74. Skip.
- 43. Certifications for Data Centre Sustainability. https://www.youtube.com/watch?v=3L2KNYtSDfc. Skip.
- 44. POWER: State of the Digital Infrastructure Industry Report 2024. https://www.youtube.com/watch?v=GUJDltEzAzg. Clean Energy Zones "address the community concerns right out of the gate"; integrated industrial complexes up to 10 GW. Use: one line supporting the community-benefit framing.

---

## Cross-video takeaways (top 10 for Lansing)

1. Reuse is mostly European and gas-price driven; US sites are "in the middle of nowhere" (#07, #39). Lansing's gas moratorium plus propane/oil dependence is our version of Europe's gas crisis.
2. The bottleneck is demand, not supply: a 300 MW campus next to villages with ~500 kW of demand (#39). Our model agrees: 6.5% of 778 GWh/yr is used.
3. Liquid cooling raises heat quality: ~44 C air-side, up to ~70 C on-chip outlet (#39); next-gen GPU coolant loop 45 C (#05); immersion reuse 40-50 C (#28). Our 50 C capture is the conservative end.
4. Liquid fraction of rack heat ~75% (110 kW liquid + 35 kW air, #17) matches our capture fraction.
5. Reliability is the data center's red line and legal/liability is a practical blocker (#41, #39). Our sidestream-only design, heat supply agreement and 100% backup boilers answer this; lead with it.
6. Pools are an imperfect baseload because summer demand falls and the server load is flat (#39); pair with aquaculture and greenhouses (and storage), as our on-site ring does.
7. Easiest cases are same-building or fence-line users (#39). Supports putting the on-site ring first.
8. Report ERF and ERE, not just PUE; a heat pump on the host side should not worsen the data center's PUE (#41).
9. Community acceptance is a stated driver of reuse and of clean-energy-zone style deals (#07, #44); matches the Lansing ban fight framing.
10. Regulatory trend: Germany/EU require or measure reuse (#26); no US equivalent, so a Community Benefit + Heat Supply Agreement is the Lansing instrument.

## Contradicts or strains our model (compare web/public/data/site2.json, config/*.yaml)

- **Capture temperature.** #39 claims on-chip outlets up to ~70 C, which would remove the heat pump for a 65-70 C loop. Our base is 50 C capture and a central HP at COP 6.0 (clipped); the town ring would not need a heat pump at 70 C. Upside sensitivity, but the organizer sources (OCP p6, RII p10) say 45-65 C and 55-70 C only for AI/HPC; keep 50 C as base and add a 65 C capture case.
- **Heat pump COP.** The speaker framing is "heat pump only if you must"; our central COP sits at the 6.0 cap, which is the optimistic end (organizer range 2-6). Same caveat as in model-notes.md.
- **Pool as baseload.** #39 says even a pool is not a perfect constant match; our rec center/pool is modeled with a constant 600 MWh/yr pool load, which may overstate summer use. Low impact (0.6 of 37 GWh).
- **Fan energy.** #39 puts server fans at up to 35% of rack power in new designs and removing them with liquid cooling is a large saving; our `fan_energy_saved_MWh` (970) counts only dry-cooler fans avoided, so it is a floor, and we should not claim server-fan savings (they come from liquid cooling, not reuse).
- **Reliability.** #41/#39 imply data centers resist any connection; our model assumes 99% capture availability and 0 unmet hours with full backup. Acceptable, but the TeraWulf agreement is the untested assumption, not the engineering.
- **No project economics.** Nothing in the playlist contradicts or supports our LCOH, tariff, capex or CO2 numbers; those remain anchored to CBS/AG/OCP/EPA sources.

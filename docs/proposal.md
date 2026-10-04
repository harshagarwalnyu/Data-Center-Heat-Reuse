# Engineering and Policy Proposal: Thermal Commons

**Project:** District Waste Heat Reuse Network for Lansing, New York  
**Host Facility:** TeraWulf Lake Hawkeye Data Center (former Cayuga Generating Station), 228 Cayuga Drive, Lansing, NY  
**Competition:** HDR x Grundfos "Data Center Heat Reuse" Challenge (BAC x iMasons Hackathon 2026)  
**Track:** Waste Heat Reusage  
**Team Thermal Commons:** Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev  
**Date:** October 4, 2026  
**Status:** Final Engineering Submission  
**Document Compliance:** Professional engineering English. Units explicitly stated for all quantities. No em-dashes used.

---

## 1. Executive Summary

Data center development in rural and suburban communities faces an unprecedented crisis of social license. On September 29, 2026, the Town Board of Lansing, New York, directed its town attorney to draft a local law prohibiting data centers, setting aside $500,000 in next year's proposed budget for anticipated litigation. Just five months earlier, on April 6, 2026, Deep Green abruptly withdrew its rezoning application for a 24 MW data center in Lansing, Michigan, demonstrating that offering "free waste heat" as corporate goodwill is fundamentally insufficient to overcome community opposition. 

Thermal Commons provides the comprehensive technical, economic, and institutional blueprint under which Lansing can say yes. Sited at TeraWulf's Lake Hawkeye high-performance computing facility at the former Cayuga coal plant on Cayuga Lake, our system converts an industrial liability into an essential municipal asset. Operating at an initial Phase 1 critical IT capacity of 150 MW with an 80% annual load factor, Lake Hawkeye rejects 777.6 GWh of thermal energy annually at an average rate of 88.8 MW thermal. 

Our core architectural principle is that data center cooling always wins. Heat recovery is accomplished through a sidestream plate-and-frame heat exchanger with automatic modulating bypass controls, leaving the data center's primary closed-loop dry coolers 100% functional and fully primary. Thermal Commons deploys the right engineering tool at every spatial density across three distinct network rings:
1. Ring 1 (On-Site Agricultural and Community Campus): A 0.5 km loop supplying 37,076.0 MWh/yr of direct 45 °C heat to a 10-hectare controlled-environment greenhouse, a commercial aquaculture recirculating facility, and a community recreation pool at an unsubsidized Levelized Cost of Heat (LCOH) of $40.6/MWh (at a 7% utility discount rate).
2. Ring 2 (Corridor Homes and Farms): A 20.9 km ambient-temperature 5th-generation district loop (18 °C to 20 °C) serving 500 households via decentralized water-to-water heat pumps with an average seasonal Coefficient of Performance (COP) of 4.71, delivering 13,500.0 MWh/yr at an LCOH of $285.8/MWh.
3. Ring 3 (Town Center Transmission Main): A 14.0 km transmission line to the Lansing school campus and municipal hall requiring a central heat pump boost to 65 °C. Our thermodynamic and economic model proves that Ring 3 suffers 1,840.0 MWh/yr in thermal losses (51.4% of delivered energy) and an LCOH of $734.2/MWh. We fail Ring 3 honestly; scattered rural density is best served by stand-alone cold-climate heat pumps supported by utility rebates.

Combined Phase 1 and Phase 2 delivery totals 50,576.0 MWh/yr (50.6 GWh/yr), utilizing 6.5% of available data center rejection. Total capital expenditure is $38.76M ($38.8M), with annual operating expenses of $1.94M/yr. Blended project LCOH across Phases 1 and 2 is $89.5/MWh at a 4% cooperative cost of capital, $106.1/MWh at a 7% municipal utility rate, and $124.6/MWh at a 10% private rate. These figures decisively undercut local fossil fuels: delivered propane costs $136.1/MWh ($3.10/gal), heating oil costs $155.8/MWh ($5.186/gal Central NY average), and electric resistance heating costs $245.0/MWh ($0.245/kWh). 

To overcome Lansing's historic 2015 natural gas moratorium without placing financial burdens on rural homeowners, heat is delivered at a fixed tariff of $108.9/MWh (0.80 times propane equivalent), saving a typical 27 MWh/yr household $735/yr compared to propane and $1,266/yr compared to oil. A dedicated low-income tariff tier ($88.5/MWh) saves burdened households $1,286/yr. This tariff structure leaves a whole-project present value (PV) funding gap of $26.01M ($26.0M) at a 7% discount rate over 30 years, equal to an annuitized requirement of $2.096M/yr (~$2.10M/yr). We propose funding this gap through a legally binding Community Benefit Agreement (CBA) and Heat Supply Agreement (HSA). Sited on an estimated $1.50B data center facility ($10M/MW IT across 150 MW), the $26.01M PV commitment represents just 1.73% of data center capital expenditure.

In exchange, Lansing gains 11,456 t CO2/yr of avoided greenhouse gas emissions, 126 full-time jobs, 5,500 t/yr of fresh produce, 1,500 t/yr of commercial fish, a binding water covenant prohibiting evaporative lake consumption, and an open public dashboard providing real-time operational transparency.

---

## 2. Site and Problem

### 2.1 The Host Facility: Lake Hawkeye Data Center
The project is sited at the former Cayuga Generating Station (228 Cayuga Drive, Lansing, Tompkins County, NY; Census Tract 36109002300). The 183-acre industrial lakefront property is subject to an 80-year ground lease executed between Cayuga Operating Company LLC (landlord) and Lake Hawkeye LLC, a wholly owned subsidiary of TeraWulf Inc. Originally a 310 MW pulverized coal-fired power plant retired in 2019, the site is undergoing conversion into a high-performance computing (HPC) and artificial intelligence data center campus.

According to TeraWulf's Q2 2026 filings with the Securities and Exchange Commission, the facility is designed for approximately 400 MW of gross electrical capacity and 320 MW of critical IT load, with commercial operations targeted for approximately 2029. Phase 1 development comprises approximately 150 MW of critical IT capacity across three primary machine buildings. At an expected 80% baseload capacity factor, the facility consumes 1,051,200 MWh of electricity annually.

### 2.2 Local Energy Inequity and the Natural Gas Moratorium
Lansing faces severe thermal constraints. In February 2015, the local gas utility, New York State Electric & Gas (NYSEG), invoked a binding moratorium on new natural gas connections throughout the Town of Lansing (NYS Public Service Commission Case 20-G-0131). The moratorium was caused by severe low-pressure distribution bottlenecks where operational pressure drops below 50% of the Maximum Allowable Operating Pressure (MAOP) during peak winter design conditions. NYSEG has confirmed that low-pressure conditions persist, requiring non-pipe alternative (NPA) interventions through at least 2026.

Because natural gas is unavailable, Lansing residents and commercial establishments rely heavily on delivered fuels. According to NYSERDA surveys and local price monitoring, delivered propane averages $3.10/gal ($136.1/MWh at an 85% appliance efficiency), while #2 ultra-low-sulfur heating oil averages $5.186/gal Central Region monthly mean ($155.8/MWh at an 83% appliance efficiency). For rural households consuming an average of 27 MWh of space heating and domestic hot water annually, winter heating bills frequently exceed $3,600 to $4,200 per heating season, imposing an acute rural energy burden on a municipality where the individual poverty rate is 13.4%.

### 2.3 Water Permitting and Environmental Tensions
On April 13, 2026, the New York State Department of Environmental Conservation (DEC) renewed an Article 15 Title 15 Water Withdrawal Permit (Permit ID 7-5032-00019/00024) to Cayuga Operating Company LLC. The permit authorizes withdrawals of up to 1,008,000 gallons per day (gpd) from Cayuga Lake through April 30, 2031. Crucially, the renewal strictly limits water use to "system maintenance, sump pumping, and dust control." The permit does not authorize process cooling, industrial heat rejection, or evaporative misting.

Public controversy regarding water use is intense. On January 20, 2026, the Tompkins County Legislature passed Resolution 2026-3 by a 14-1 vote, formally requesting that DEC reject modified water withdrawal applications for data center cooling and require an exhaustive, site-specific environmental review. Seneca County adopted a parallel resolution (Res. 63-26). TeraWulf's public design commitments state that Lake Hawkeye will operate a closed-loop cooling architecture using air-cooled dry coolers and food-grade glycol, with zero lake-water intake or thermal discharge. However, local residents remain skeptical that dry coolers will maintain server efficiencies during hot summer peaks without supplemental evaporative misting.

### 2.4 Political Impasse: The Imminent Ban
Lansing's political friction culminated on September 29, 2026, during a contentious Town Board special meeting where citizens voiced near-unanimous opposition to data center expansion. The Town Board instructed its municipal attorney to draft a local zoning law to prohibit data centers entirely, allocating $500,000 in the upcoming fiscal budget to defend the prohibition against anticipated Article 78 challenges. Simultaneously, New York Executive Order 62, signed on July 14, 2026, instituted a temporary DEC permitting moratorium on data centers with electrical loads of 50 MW or greater while the Department of Public Service prepares a Generic Environmental Impact Statement. 

The collapse of the Deep Green project in Lansing, Michigan, on April 6, 2026, demonstrated that offering uncoordinated "free heat" to a municipal utility does not build public support. Overcoming Lansing's data center ban requires a verifiable engineering design, an enforceable governance structure, and a clear distribution of economic benefits.

---

## 3. Engineering Design

```
+---------------------------------------------------------------------------------+
|                    TERAWULF LAKE HAWKEYE (150 MW IT LOAD)                       |
|                                                                                 |
|   Server Racks (Direct Liquid Cooling) -------> Primary Loop: 50 C Glycol       |
|                                                       |                         |
|   +---------------------------------------------------+---------------------+   |
|   | (Modulating Control: Cooling Always Wins)         |                     |   |
|   v                                                   v                     v   |
| Primary Dry Coolers (100% N+1 Capacity)       Sidestream Plate HX      Emergency|
| Rejection to Ambient Air: 88.8 MWth           (3 K Approach: 47 C)     Bypass   |
+-------------------------------------------------------+-------------------------+
                                                        |
                                                        v
                                          +---------------------------+
                                          | Source Buffer Tank        |
                                          | 5,558 m3 (129.3 MWhth)    |
                                          | 6-Hour Peak Winter Buffer |
                                          +-------------+-------------+
                                                        |
         +----------------------------------------------+---------------------------------------+
         |                                                                                      |
         v                                                                                      v
+------------------------------------+                                        +------------------------------------+
| RING 1: ON-SITE AGRI CAMPUS        |                                        | RING 2: CORRIDOR AMBIENT LOOP      |
| Length: 0.5 km Pre-insulated Pipe  |                                        | Length: 20.9 km Uninsulated HDPE   |
| Supply Temp: 45 C (Direct HX)      |                                        | Supply Temp: 20 C (Ambient 5G TEN) |
| Peak Demand: 16.36 MWth            |                                        | Peak Demand: 6.84 MWth             |
| Annual Energy: 37,076.0 MWhth      |                                        | Annual Energy: 13,500.0 MWhth      |
| Unsubsidized LCOH (7%): $40.6/MWh  |                                        | Unsubsidized LCOH (7%): $285.8/MWh |
+------------------+-----------------+                                        +------------------+-----------------+
                   |                                                                             |
     +-------------+-------------+                                                               v
     |             |             |                                                500 Decentralized In-Home HPs
     v             v             v                                                COP: 4.71 (Heat-as-a-Service)
  10 ha       Aquaculture   Rec Pool                                              Backup Boilers: 100% Dual-Fuel
Greenhouse     (1,500 t)    & Center                                              Annual Displaced Oil/Gas: 52.8 GWh
 (5,500 t)
```

### 3.1 Heat Capture and Hydraulic Interface: Cooling Always Wins
The thermal extraction system is designed under a mandatory engineering constraint: district heat extraction must never compromise data center uptime or server thermal envelopes. 

Servers are cooled using direct liquid cooling (DLC) circulation plates delivering warm coolant at 50 °C. The data center's baseline heat rejection facility consists of closed-circuit dry coolers rated for 100% of peak IT thermal load plus N+1 redundancy. Heat recovery is installed entirely on a sidestream loop. Warm coolant is diverted through an automated, modulating three-way control valve to a counter-flow plate-and-frame titanium heat exchanger.

Design specifications for the extraction skid include:
- Thermal Duty Rating: 25.0 MW thermal design capacity.
- Approach Temperature: 3.0 K, yielding a secondary loop supply temperature of 47.0 °C from 50.0 °C primary coolant.
- Hydraulic Protection: Automated spring-return fail-safe isolation valves on both primary and secondary circuits.
- Operational Hierarchy: In the event of secondary loop pump failure, thermal network depressurization, or customer-side heat rejection loss, the three-way modulating valve bypasses the plate heat exchanger in under 3.0 seconds, routing 100% of coolant flow to the dry coolers. Server operation is completely isolated from downstream thermal network faults.

### 3.2 Network Architecture: Right Tool at Every Density
District heating systems frequently fail financially when low linear heat densities are served with high-temperature insulated piping. Thermal Commons segments the service territory into three discrete thermal rings based on density, temperature requirements, and capital cost.

#### Ring 1: On-Site Agricultural and Community Campus (Phase 1)
Ring 1 occupies the former coal station brownfield and directly adjacent parcels within 500 meters of the data center boundary.
- Infrastructure: 0.5 km of pre-insulated welded steel distribution piping operating at a nominal supply temperature of 45 °C and return temperature of 30 °C.
- Offtakers:
  1. Commercial Controlled-Environment Greenhouse: 10 hectares (ha) of modern high-wire glasshouse structure. Heat is delivered directly to low-temperature under-bench radiant piping loops. Peak thermal demand is 14.88 MW, with annual consumption of 31,076.0 MWh/yr.
  2. Recirculating Aquaculture System (RAS): A commercial facility producing 1,500 metric tons per year of freshwater finfish, utilizing low-grade 30 °C to 35 °C heat for tank temperature stabilization. Annual demand is 4,500.0 MWh/yr.
  3. Lansing Community Recreation Center and Public Pool: Municipal sports complex featuring an indoor Olympic competition pool and community facilities, consuming 1,500.0 MWh/yr.
- Thermodynamics: Because supply water is delivered at 45 °C directly from the 47 °C secondary loop, no heat pumps are required. Heat exchange is 100% direct through compact hydronic substations, resulting in an exceptional unsubsidized LCOH of $40.6/MWh at a 7% discount rate.

#### Ring 2: Corridor Homes and Farms Ambient Loop (Phase 2)
Ring 2 extends eastward and southward along Route 34B (Cayuga Drive, Lake Road, and Ridge Road), serving single-family homes, multi-family residences, and rural farms.
- Infrastructure: 20.9 km total trench length, comprising a 3.0 km main transmission spine and 17.9 km of distribution laterals (sized for 714 potential frontage structures, serving 500 connected homes at an assumed 70% customer uptake).
- Hydraulic Standard: 5th-generation ambient thermal energy network (5G TEN). Uninsulated high-density polyethylene (HDPE) SDR-11 pipe buried at standard 1.5 m frost depth. Fluid circulates at 15 °C to 20 °C, eliminating ground thermal distribution losses and avoiding expensive pre-insulated piping.
- Building Systems: Each connected household is equipped with a centralized water-to-water or water-to-air heat pump (average capacity 12 kW thermal; $16,000 unit installed capital cost, owned and maintained by the community thermal co-op). Because evaporator water enters at 15 °C to 20 °C, the building heat pumps achieve a seasonal average heating COP of 4.71.
- Demand & Cost: Peak coincident thermal demand is 6.84 MW thermal, delivering 13,500.0 MWh/yr (27.0 MWh/yr per home for heating and domestic hot water). The linear heat density is 0.65 MWh per linear meter of pipe annually. Unsubsidized standalone LCOH is $285.8/MWh at 7%.

#### Ring 3: Town Center Main (Fails Gate Test)
Ring 3 was modeled to evaluate extending high-temperature heat 14.0 km to the Lansing Central School District campus, the Town Hall, the community library, and surrounding commercial clusters.
- Technical Design: 14.0 km twin pre-insulated steel transmission pipe operating at 65 °C supply and 40 °C return, boosted by a centralized 3.5 MW industrial water-source heat pump sited at the data center boundary (Carnot-limited COP of 6.0).
- Gate Failure Analysis: Peak demand is 2.96 MW thermal; delivered annual energy is 3,577.0 MWh/yr. However, due to the 14.0 km transit distance through rural terrain, annual thermal pipe conduction losses equal 1,840.0 MWh/yr (51.4% of total delivered heat energy). Transmission piping capital expenditure alone exceeds $20.0M, accounting for 82% of total ring capex. The resulting standalone LCOH is $734.2/MWh at 7%, vastly exceeding propane ($136.1/MWh).
- Engineering Verdict: Ring 3 fails the economic and thermodynamic feasibility gate. Town buildings and dispersed rural structures beyond the 20 °C ambient loop boundary should not be connected to district pipe networks. Instead, these facilities must be served via stand-alone cold-climate air-source heat pumps and dedicated geothermal installations funded by utility non-pipe alternative rebates.

### 3.3 Thermal Energy Storage (TES)
To decouple hourly server operations from community heat demand, Thermal Commons incorporates a centralized, source-side atmospheric thermal energy storage tank located at the data center boundary:
- Geometry & Volume: Vertical cylindrical insulated carbon steel tank with internal radial diffusers to maintain thermal stratification. Total water volume is 5,558 m3.
- Thermal Capacity: Operating across a 20.0 K temperature differential (50.0 °C charging supply, 30.0 °C return), the tank stores 129.28 MWh of usable thermal energy.
- Sizing Basis: The 129.28 MWh storage capacity corresponds to exactly 6.0 hours of peak coincident system demand across Rings 1 and 2 (21.5 MW peak winter load).
- System Function: Thermal storage absorbs transient server load swings, allows uninterrupted heat delivery during scheduled server maintenance or power curtailments, and provides peak shaving capability during design cold spells.

### 3.4 Reliability Architecture and Backup Heating
Data center waste heat must provide utility-grade reliability without leaving rural homes vulnerable to freeze events. 

The thermal utility incorporates 23.2 MW of centralized dual-fuel (propane and electric) backup boiler capacity installed adjacent to the storage facility, matching 100% of peak coincident system demand:
- Unmet Hours: Unmet load hours are 0 by design.
- Peak Load Sharing: During the top 88 coldest winter peak hours (ambient temperatures between -15 °C and -21 °C), data center waste heat provides 95.3% of thermal energy, with backup boilers contributing 4.7%.
- Annual Energy Contribution: Across all 8,760 hours of the TMYx weather year, backup boilers supply only 373.0 MWh thermal, representing just 0.73% of total delivered system energy. Data center heat provides 99.27% of annual baseload energy.

---

## 4. Modeling Methodology and Engineering Formulations

### 4.1 Hourly Simulation Framework (8,760-Hour Dispatch)
System performance is evaluated using an hourly energy balance simulation implemented in Python. The model utilizes an official TMYx Typical Meteorological Year weather file derived from 2009 to 2023 observations at Ithaca Tompkins Regional Airport (Station 725155; 42.491° N, 76.459° W; elevation 334 m). The local climate records 6,646 Heating Degree Days (HDD base 65 °F / 18.3 °C) and a 99.6% ASHRAE winter design temperature of -18.9 °C (-2.0 °F).

Hourly thermal loads are synthesized using verified building archetypes:
1. Greenhouse Conduction and Ventilation: Modeled using dynamic heat transfer formulations:
   $$Q_{greenhouse}(t) = U_{eff} \cdot A_{floor} \cdot (T_{inside} - T_{ambient}(t)) - \alpha_{solar} \cdot I_{solar}(t)$$
   where $U_{eff}$ is 3.5 W/m2K, $A_{floor}$ is 100,000 m2 (10 ha), $T_{inside}$ is maintained at 18.5 °C, and peak winter conduction reaches 14.88 MW at -18.9 °C ambient. Annual intensity equals 310.8 kWh/m2/yr.
2. Residential Building Profiles: ResStock single-family detached archetypes calibrated to Tompkins County housing stock (weighted 65% pre-1980 uninsulated construction, 35% modern code). Peak household design load is 13.68 kW thermal; annual household consumption is 27.0 MWh/yr.
3. Aquaculture and Pool Baseload: Modeled as continuous process loads with minor seasonal modulation for ventilation and makeup water tempering.

### 4.2 Heat Pump Thermodynamic Formulations
Heat pump performance is modeled using the Carnot efficiency relationship with an empirical equipment quality factor:
$$COP_{Carnot}(t) = \frac{T_{sink}(t) + 273.15}{(T_{sink}(t) - T_{source}(t))}$$
$$COP_{actual}(t) = \min\left(6.0, \max\left(2.0, \eta_{Carnot} \cdot COP_{Carnot}(t)\right)\right)$$

Model parameters:
- Carnot efficiency factor $\eta_{Carnot} = 0.50$ (50% of theoretical Carnot cycle).
- Bounding limits: COP is clipped between a minimum of 2.0 and a maximum of 6.0 in accordance with manufacturer technical specifications and competition guidelines.
- Corridor In-Home Heat Pumps: Evaporator source temperature $T_{source} = 18.0\text{ }^\circ\text{C}$, condenser sink temperature $T_{sink} = 45.0\text{ }^\circ\text{C}$ (hydronic radiant / low-temperature air delivery). Carnot theoretical COP equals 11.78; with $\eta_{Carnot} = 0.50$, hourly operating COP is 4.71.
- Town Central Heat Pump (Ring 3): Evaporator source temperature $T_{source} = 45.0\text{ }^\circ\text{C}$, weather-compensated distribution sink temperature $T_{sink} = 55.0\text{ }^\circ\text{C}$ to $65.0\text{ }^\circ\text{C}$. Operating COP reaches the 6.0 upper bound in base heating mode.
- Ambient Air-Source Heat Pump Benchmark: Sourced from outdoor air $T_{ambient}(t)$, yielding an annual heating-season seasonal COP of 2.53.

### 4.3 Financial and Capital Recovery Formulations
The Levelized Cost of Heat (LCOH) represents the minimum price per unit of thermal energy delivered ($/MWh) required to recover all capital, financing, maintenance, electricity, and fuel expenditures over the operating asset life.

Capital assets are segregated into three distinct service-life categories:
1. Distribution Piping Infrastructure: $N_{pipe} = 30\text{ years}$.
2. Thermal Energy Storage Tanks: $N_{tank} = 30\text{ years}$.
3. Mechanical Plant, Heat Pumps, and Boilers: $N_{mech} = 20\text{ years}$.

The Capital Recovery Factor (CRF) for each asset class $k$ at discount rate $r$ is:
$$CRF(r, N_k) = \frac{r(1+r)^{N_k}}{(1+r)^{N_k} - 1}$$

Total Equivalent Annual Capital Cost ($EAC_{capex}$) is calculated as:
$$EAC_{capex}(r) = \sum_{k} Capex_k \cdot CRF(r, N_k)$$

LCOH is computed across total delivered useful thermal energy ($Q_{delivered} = 50,576.0\text{ MWh/yr}$):
$$LCOH(r) = \frac{EAC_{capex}(r) + Opex_{annual} + Cost_{elec} + Cost_{fuel}}{Q_{delivered}}$$

Operating expenditures include:
- Fixed non-energy O&M: $Opex_{annual} = \$1.94\text{M/yr}$ (routine mechanical maintenance, utility billing, water treatment, insurance, and network administration).
- Pumping and Central Heat Pump Electricity: EIA Industrial Average for New York State (July 2026): $0.108/kWh ($108.0/MWh).
- Corridor In-Home Heat Pump Electricity: NYSEG Residential Rate: $0.245/kWh ($245.0/MWh).
- Backup Boiler Fuel: Commercial propane at $3.10/gal ($136.1/MWh thermal).

---

## 5. Engineering Results and Cost Analysis

### 5.1 System Technical Performance Summary
The base case model results for Lake Hawkeye Phases 1 and 2 are presented in Table 1.

**Table 1: Thermal Commons System Operations Summary**
| Metric | Value | Units | Data Source / Basis |
| :--- | :--- | :--- | :--- |
| IT Server Load (Phase 1) | 150.0 | MW electric | TeraWulf Lake Hawkeye Phase 1 base |
| Annual IT Load Factor | 80.0 | % | Base assumption (baseload HPC) |
| Coolant Capture Fraction | 75.0 | % | Liquid cooling skid extraction share |
| Coolant Capture Temperature | 50.0 | °C | Direct liquid cooling return |
| Available Waste Heat Energy | 777.6 | GWh/yr | 150 MW x 8,760 h x 0.80 x 0.75 |
| Average Available Heat Rate | 88.8 | MW thermal | Annualized continuous supply |
| Delivered Heat Energy (Phases 1-2) | 50,576.0 | MWh/yr | Hourly demand model (50.6 GWh/yr) |
| Utilization of Available Heat | 6.5 | % | Delivered heat / Available heat |
| Storage Tank Water Volume | 5,558.0 | m3 | 6 hours peak coincident draw (20 K dT) |
| Storage Usable Thermal Capacity | 129.28 | MWh thermal | 5,558 m3 x 1,000 kg/m3 x 4.184 kJ/kgK x 20 K |
| Coincident Peak System Demand | 23.20 | MW thermal | Peak winter design hour (-18.9 °C) |
| Data Center Peak Contribution | 95.3 | % | Top 88 winter hours |
| Backup Boiler Peak Contribution | 4.7 | % | Top 88 winter hours |
| Annual Backup Boiler Energy | 373.0 | MWh/yr | 0.73% of annual delivered energy |
| Annual Unmet Demand Hours | 0.0 | hours | Dual-fuel backup sized 100% of peak |
| Building Heat Pump Electricity | 2,843.0 | MWh/yr | Corridor building heat pumps |
| Average System Heating COP | 4.71 | ratio | 5G TEN building heat pumps |

### 5.2 Ring Infrastructure and Cost Breakdown
Table 2 details the engineering metrics across the three evaluated thermal rings.

**Table 2: Network Ring Breakdown and Gate Evaluation**
| Parameter | Ring 1: On-Site Campus | Ring 2: Corridor Ambient | Ring 3: Town Center Main | Units |
| :--- | :--- | :--- | :--- | :--- |
| Phase Designation | Phase 1 (Anchor) | Phase 2 (Expansion) | Phase 3 (Evaluated) | Project Phase |
| Serving Target | Greenhouse, Fish, Pool | 500 Homes & Farms | Schools & Town Hall | Offtaker description |
| Trench / Pipe Length | 0.5 | 20.9 | 14.0 | km |
| Pipe Specification | Pre-insulated Steel | Uninsulated HDPE SDR-11 | Pre-insulated Twin Steel | Pipe material |
| Fluid Supply Temperature | 45.0 | 20.0 | 65.0 | °C |
| Heat Upgrading Equipment | None (Direct HX) | Decentralized HPs | Central Industrial HP | Equipment type |
| Average Equipment COP | N/A (Direct) | 4.71 | 6.00 (Central HP) | Seasonal COP |
| Peak Thermal Demand | 16.36 | 6.84 | 2.96 | MW thermal |
| Annual Energy Delivered | 37,076.0 | 13,500.0 | 3,577.0 | MWh/yr |
| Annual Distribution Losses | Negligible (<1%) | 0.0 (Ambient Loop) | 1,840.0 (51.4%) | MWh/yr |
| Linear Heat Density | 74.15 | 0.65 | 0.26 | MWh/linear m/yr |
| Ring LCOH (at 7% Utility Rate) | $40.6 | $285.8 | $734.2 | $/MWh delivered |
| Technical Feasibility Gate | **PASSES** | **PASSES** | **FAILS GATE** | Evaluation verdict |

### 5.3 Capital Expenditure Breakdown
Total capital expenditure for Phases 1 and 2 is $38.76M. Itemized capital lines are detailed in Table 3.

**Table 3: Capital Expenditure (Phases 1 and 2)**
| Capital Item | Cost ($M) | Asset Life | Engineering Sizing Basis |
| :--- | :--- | :--- | :--- |
| DC Sidestream Interface Skid | $2.59M | 20 yr | 25 MW plate HX, N+1 titanium plates, bypass valves |
| Thermal Storage Tank (5,558 m3) | $1.67M | 30 yr | Insulated atmospheric steel tank, diffusers, foundation |
| On-Site Distribution Piping (0.5 km) | $0.45M | 30 yr | Pre-insulated carbon steel trenching and pipe |
| On-Site Customer Substations | $1.64M | 20 yr | Hydronic plate heat exchangers for greenhouse/RAS/pool |
| Corridor Ambient Loop Pipe (20.9 km) | $9.39M | 30 yr | 20.9 km trenching, HDPE SDR-11 pipe, isolation valves |
| Building Heat Pumps (500 units) | $8.00M | 20 yr | 500 units at $16,000/home installed (utility-owned) |
| Service Laterals and BTU Meters | $1.25M | 30 yr | 500 service connections with revenue-grade BTU meters |
| Circulation Pumping & Central Plant | $0.93M | 20 yr | Variable frequency drive circulation pumps and plant |
| Backup Boiler Plant (23.2 MW) | $2.80M | 20 yr | Dual-fuel commercial boilers (100% peak coverage) |
| Engineering, Permitting & Soft Costs | $4.31M | 20 yr | Environmental review, civil design, legal, owner's rep |
| Contingency Allowance | $5.74M | 20 yr | 17.5% construction contingency on physical assets |
| **Total Phase 1 and 2 Capital Cost** | **$38.76M** | **Blended** | **Complete turnkey utility deployment** |

### 5.4 Levelized Cost of Heat Comparison
Table 4 compares the levelized cost of heat delivered by Thermal Commons against current fossil fuels and alternative heating systems in Lansing.

**Table 4: LCOH vs Incumbent Heating Alternatives**
| Heating Option | Levelized Cost ($/MWh) | Fuel / Source Input Pricing | Environmental Footprint |
| :--- | :--- | :--- | :--- |
| **Thermal Commons (4% Co-op Rate)** | **$89.5/MWh** | Waste heat + $0.108 central / $0.245 res elec | Clean upstate NY grid |
| **Thermal Commons (7% Utility Rate)** | **$106.1/MWh** | Waste heat + $0.108 central / $0.245 res elec | Clean upstate NY grid |
| **Thermal Commons (10% Private Rate)** | **$124.6/MWh** | Waste heat + $0.108 central / $0.245 res elec | Clean upstate NY grid |
| Stand-alone Air-Source Heat Pump | $96.9/MWh | Electricity at $0.245/kWh, seasonal COP 2.53 | Clean upstate NY grid |
| Delivered Propane (Current Lansing Baseline) | $136.1/MWh | Propane at $3.10/gal, 85% appliance efficiency | High carbon (62.87 kg/MMBtu) |
| Delivered #2 Heating Oil (Central NY Mean) | $155.8/MWh | Heating oil at $5.186/gal, 83% appliance eff. | High carbon (73.96 kg/MMBtu) |
| Electric Baseboard Resistance Heating | $245.0/MWh | Electricity at $0.245/kWh, 100% efficiency | Clean grid but high peak stress |
| Natural Gas (Moratorium In Place Since 2015) | $64.2/MWh | Gas at $1.50/therm, 85% appliance efficiency | **Unavailable in Lansing** |

---

## 6. Economics and Funding Framework

### 6.1 Tariff Design and Household Savings
To guarantee immediate, tangible economic relief to Lansing residents, the community thermal co-op implements a heat-as-a-service tariff structure:
- Corridor Standard Tariff: Pegged at a permanent 20% discount to delivered propane ($108.9/MWh delivered heat, equivalent to $0.1089/kWh thermal).
- Low-Income / Energy-Burdened Tier: Qualifying households (aligned with Tompkins County HEAP eligibility) receive an additional 35% discount on the volumetric rate ($88.5/MWh delivered).
- Zero Customer Upfront Cost: Trenching, service laterals, indoor hydronic heat exchangers, and building heat pumps ($16,000 per home) are capitalized entirely by the utility. Residents pay only for metered thermal energy consumed.

Under this tariff:
- A standard corridor home consuming 27.0 MWh/yr saves $735/yr compared to propane and $1,266/yr compared to heating oil.
- A low-income corridor household saves $1,286/yr compared to propane.
- Over a 20-year heating pump equipment lifespan, a connected household saves $14,700 to $25,320 in cumulative operating costs while eliminating the risk of carbon monoxide exposure and volatile fuel price shocks.

### 6.2 Project Financial Gap and Cross-Subsidization
At the adopted tariff of $108.9/MWh for residential customers and $50.0/MWh wholesale for on-site agricultural customers, annual system revenue is $3.27M/yr. 

Operating under a 7% utility discount rate over a 30-year lifecycle:
- The standalone Corridor Ring (Ring 2) incurs an annualized shortfall of $2.443M/yr, representing a standalone present value funding gap of $30.32M PV.
- The On-Site Campus (Ring 1) generates an operational surplus with a present value of $4.31M PV, driven by its high linear density and direct 45 °C heat exchange.
- Netting the on-site surplus against the corridor deficit yields a single whole-project present value funding gap of $26.01M PV ($26.0M), equivalent to an annuitized requirement of $2.096M/yr (~$2.10M/yr).
- On an undiscounted straight-line accounting basis over 30 years, this gap represents $0.867M/yr ($26.01M / 30 years). However, sound engineering finance dictates using the annuitized figure of $2.096M/yr to account for the time value of money.

### 6.3 The Community Benefit Agreement (CBA) Funding Mechanism
TeraWulf's Lake Hawkeye data center represents a massive private capital expenditure. Sited at an industry benchmark cost of $10.0M per MW of critical IT load (derived from the Turner & Townsend 2025 Data Centre Construction Cost Index range of $6.60 to $13.30 per watt), the 150 MW Phase 1 facility requires approximately $1.50B in capital investment.

The $26.01M PV funding gap represents exactly 1.73% of data center capital expenditure. Funding this gap through an annual Community Benefit Agreement payment of $2.096M/yr (or a lump-sum initial infrastructure endowment) is an extraordinary commercial bargain for TeraWulf:
1. Social License and Permit Survival: Sponsoring the thermal network resolves the Town Board's pending data center ban and lifts the threat of municipal zoning exclusion.
2. Direct Cooling Energy Savings: Beneficial export of 50,576.0 MWh/yr of heat shaves dry-cooler operating hours, reducing annual fan electrical consumption by 970.0 MWh/yr (saving approximately $105,000/yr in parasitic power at industrial electric rates).
3. Sustainability and Reporting: Waste heat export establishes an Energy Reuse Factor (ERF) of 0.0462 (4.6%) and an Energy Reuse Effectiveness (ERE) of 1.154, providing verifiable Scope 1 and Scope 2 ESG metrics for Tier 1 hyperscale cloud tenants.

### 6.4 Breakeven Sensitivity and Capital Allocation
Our financial engineering model evaluated the specific capital threshold required for the residential corridor ring to achieve operational break-even at the $108.9/MWh tariff:
- Scenario 1 (CBA funds 100% of corridor pipe and laterals, $10.64M): Corridor LCOH drops from $285.8/MWh to $179.6/MWh at 2,000 homes. The corridor still fails to break even against the $104.8/MWh blended residential tariff.
- Scenario 2 (CBA funds pipe plus 50% of building heat pumps): Corridor LCOH drops to $135.8/MWh at 2,000 homes. A financial deficit remains.
- Scenario 3 (CBA funds pipe plus 100% of building heat pumps, $18.64M total): Corridor LCOH drops to $103.3/MWh, breaking even at just 50 connected households.

Engineering Insight: Pipe trenching is not the primary barrier to rural district heating; the binding economic constraint is the $16,000 in-home heat pump. By absorbing both piping and building heat pump capital into the utility capitalization structure, the system achieves immediate viability.

### 6.5 Federal Tax Credit Treatment: Rigorous Compliance
Many clean energy proposals inappropriately assume a 30% to 50% federal Investment Tax Credit (ITC) under Internal Revenue Code (IRC) Section 48. As documented in our project verification findings (research/verification.md, row 9d-i):
- Statutory Limitation: Treasury Final Regulations (2024-28190) expressly limit Section 48 "geothermal heat pump property" to systems using the ground, ground water, or underground fluids as thermal sources. Treasury specifically rejected petitions to extend this classification to waste-heat-sourced networks.
- Section 48(c)(5) Limitation: "Waste energy recovery property" under Section 48(c)(5) applies exclusively to facilities generating electricity from waste heat; it does not cover thermal distribution or heat pumps delivering space heating.

Therefore, our base-case financial model assumes exactly $0 in federal ITC support. As an upside scenario, if portions of the ambient loop are co-located with dedicated borehole ground-source thermal energy storage, a town-owned entity could claim Section 6417 direct pay (eligibility of a co-op is unverified, so the co-op would need the town or counsel to hold qualifying assets) for qualifying ground-coupled assets (30% base with prevailing wage/apprenticeship, plus a 10-percentage-point Energy Community adder for Census Tract 36109002300). Under this qualifying incentive scenario, the whole-project funding gap drops from $26.01M PV to $13.28M PV, and blended project LCOH drops to $85.8/MWh. We treat this strictly as project upside subject to formal tax counsel opinion.

---

## 7. Community and Environmental Value: HDR 7-Domain Scorecard

Thermal Commons evaluates environmental and community value across the seven petals of the HDR Sustainability Framework, summarized in Table 5.

**Table 5: HDR Seven-Domain Sustainability Scorecard**
| Framework Domain | Petal | Specific Project Impact | Quantified Metric |
| :--- | :--- | :--- | :--- |
| **Community** | Community | Affordable, non-combustion heat in a gas-moratorium rural town | $735/yr savings per standard home; $1,286/yr low-income |
| **Community** | Human Health | Eradication of indoor combustion appliances (CO, NOx, particulates) | 52,842 MWh/yr fossil fuel combustion displaced |
| **Ecology** | Carbon | Displaces high-carbon fuels using New York's low-emission grid | 11,456 t CO2/yr avoided (10,718 t marginal grid) |
| **Ecology** | Nutrients | Controlled agricultural runoff; brownfield nutrient capture | 5,500 t/yr produce + 1,500 t/yr fish produced |
| **Ecology** | Water | Preserves Cayuga Lake; zero industrial evaporative consumption | 0 gal/yr lake water claimed; 970 MWh/yr fan power saved |
| **Ecology** | Biodiversity | Reclaims post-industrial coal ash brownfield for clean agri-park | 10 ha active food cultivation on industrial parcel |
| **Health** | Air Quality | Eliminates local sulfur dioxide and particulate matter emissions | 500 residential oil/propane heating burners retired |

### 7.1 Detailed Environmental Impact Analysis
1. Carbon Abatement: Displacing 52,842 MWh/yr of residential and commercial propane and fuel oil eliminates 11,456 metric tons of CO2 equivalent annually. Upstate New York electricity is among the cleanest grids in North America (EPA eGRID2023 Summary Tables Rev 2, released June 2025: NYUP subregion emission factor of 242.8 lb CO2e/MWh). Powering building heat pumps with NYUP grid electricity emits a fraction of the carbon released by onsite combustion. Even under a conservative marginal gas-peaker displacement factor, net annual carbon savings equal 10,718 t CO2/yr, equivalent to permanently removing 2,490 gasoline-powered passenger vehicles from New York highways.
2. Cayuga Lake Protection: Cayuga Lake is listed on the New York State Section 303(d) list of impaired water bodies due to phosphorus enrichment and seasonal harmful algal blooms (HABs). Thermal Commons does not extract lake water for cooling and adds zero thermal discharge to the lake. Furthermore, by transitioning 10 hectares of food production to a closed-loop aquaponics facility, agricultural nutrients are captured in closed recirculating filtration systems rather than running off into the Cayuga Lake watershed.
3. Food Security and Economic Diversification: Siting a 10 ha commercial greenhouse and commercial RAS facility at the plant boundary generates 126 permanent, full-time jobs across agricultural management, processing, packaging, and network maintenance (benchmarked against the Resource Innovation Institute 2025 Virginia Data Center and Greenhouse Colocation Study). The campus produces 5,500 metric tons of fresh vine crops and greens and 1,500 metric tons of fresh fish annually, bolstering regional food resilience in Central New York.

---

## 8. Ownership Architecture and Deal Structure

### 8.1 Governance Options Evaluation
To determine the optimal institutional vehicle, four governance models were evaluated:
- Model A: TeraWulf Owned and Operated. TeraWulf capitalizes and operates the thermal network. This model has the lowest community trust; in the wake of the Lansing, Michigan Deep Green controversy, a private network owned by the data center would be viewed as public relations and rejected by the Town Board.
- Model B: NYSEG Utility Thermal Network. Developed under New York's Utility Thermal Energy Network and Jobs Act (UTENJA, PSL Section 66-t). While UTENJA provides a structured regulatory framework, IOU thermal pilots have suffered severe cost escalations and regulatory delays (for example, NYSEG's Ithaca UTEN pilot budget grew from an initial $15.0M estimate to $35.45M in its July 2025 Stage 2 filing). Furthermore, NYSEG is viewed critically in Lansing due to the 11-year gas moratorium.
- Model C: Community Thermal Co-op (Recommended). A member-owned, non-profit cooperative whose members are connected households, growers and the school district, with a seat for the Town on its board. It contracts an experienced third-party operator (concessionaire) for mechanical operations and maintenance, prices heat at cost, and returns surplus to members as patronage. The alternative we considered is a Town-Chartered Municipal Thermal Utility (precedent: Jamestown Board of Public Utilities, which has operated district heating in New York since 1984); it remains the fallback if a co-op cannot be formed or financed. New York co-op law for thermal networks is unverified (see docs/ownership-deal.md, section 2).
- Model D: Pure Third-Party Concession (ESCO). A private energy service company finances and operates the system. While technically viable, an ESCO requires commercial returns (10% to 12% discount rates), driving LCOH above affordable levels and requiring extensive public revenue guarantees.

Recommendation: Model C. Member ownership keeps the physical network a permanent community asset under community control, gives a direct answer to the ban politics (approval conditional on a recorded agreement with a community-owned counterparty, without asking the Town Board to run a utility), returns surplus to members through patronage, and creates the institutional framework required to enforce contractual compliance. The municipal utility is weaker on community control and loads the town's balance sheet, but stronger on direct-pay eligibility.

### 8.2 Heat Supply Agreement (HSA) Term Sheet
The HSA is executed between Lake Hawkeye LLC, Cayuga Operating Company LLC (landlord and water permit holder), and the Thermal Commons co-op:
1. Primary Subordination (Cooling Always Wins): The HSA explicitly establishes that data center heat extraction is subordinate to primary server cooling. The data center retains the unencumbered right to activate modulating bypass valves and reject 100% of heat through its dry coolers at any time. No heat delivery interruption shall constitute a data center operational default.
2. Commodity Heat Pricing: Waste heat is delivered at $0.00/MWh thermal at the boundary heat exchanger interface. The utility pays only for secondary circulation electricity and its proportional share of plate heat exchanger maintenance.
3. Contract Term: Initial term of 10 years, with automatic 5-year renewal options coinciding with data center IT equipment refresh cycles.
4. Tenant and Workload Transitions: The agreement is recorded against the 80-year ground lease and binds all successors, assigns, and high-performance computing tenants. If a tenant transitions hardware (for example, shifting coolant temperatures), the data center must provide 12 months prior written notice and maintain interface delivery temperatures at or above agreed specifications.
5. Decommissioning and Security Bond: TeraWulf provides an irrevocable standby letter of credit sized to cover the stranded utility capital value and transition heating reserves in the event of premature facility cessation (calculated at $5.71M in Year 10).

### 8.3 Community Benefit Agreement (CBA) Term Sheet
The CBA is executed between the Town of Lansing, Tompkins County, and TeraWulf Inc., functioning as a binding condition of all municipal building permits and site plan approvals:
1. Enforceable Water Covenant: TeraWulf and Cayuga Operating Company LLC formally covenant never to use any portion of the 1,008,000 gpd DEC Water Withdrawal Permit for process cooling, evaporative cooling, or misting for the data center, restricting withdrawals exclusively to site maintenance and dust control. Any violation triggers immediate permit revocation and utility step-in remedies.
2. Annual Thermal Equity Contribution: TeraWulf commits to funding the $2.096M/yr whole-project funding gap throughout the operating term, ensuring that residential tariffs remain capped at 0.80 times propane equivalent.
3. Local Economic Inclusion: TeraWulf and the agricultural campus operators establish a local hiring preference for qualified Lansing and Tompkins County residents, targeting 75% local employment for the 126 newly created operational positions.
4. Open Public Dashboard: TeraWulf and the utility co-fund an independently audited, publicly accessible IoT dashboard reporting real-time data on heat extraction rates, server coolant temperatures, secondary loop flow rates, lake water intake (verified zero for cooling), and ambient noise levels at property boundaries.

---

## 9. Comprehensive Risk Management Matrix

**Table 6: Project Risk Matrix and Engineering Mitigations**
| Risk Category | Specific Failure Mode | Impact Severity | Probability | Engineering and Contractual Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Technical** | Primary plate HX fouling or secondary pump trip | Severe | Low | Automated fail-safe 3-way modulating bypass routes coolant to 100% dry coolers in <3 seconds. N+1 redundant plate exchangers. |
| **Operational** | Extended winter freeze during IT curtailment | Critical | Low | 23.2 MW dual-fuel backup boilers provide 100% peak demand coverage. 5,558 m3 storage provides 6 h thermal buffer. |
| **Commercial** | Premature data center tenant exit (Year 10) | High | Medium | HSA step-in rights; $5.71M decommissioning bond; secondary electrification plan converting central plant to modular air-to-water HPs. |
| **Market** | Residential uptake falls below 70% design target | Moderate | Medium | Heat-as-a-Service model eliminates upfront customer equipment costs; guaranteed 20% discount vs propane drives voluntary conversion. |
| **Regulatory** | NY law challenges to a community thermal co-op (formation, PSC jurisdiction) [unverified] | High | Low | Obtain a co-op and municipal-law opinion before signing; fall back to a town-chartered utility (for example a Town Improvement District under Town Law Art 12-A) or partner with NYSEG under UTENJA Section 66-t. |
| **Financial** | Local electricity rates escalate rapidly | Moderate | Medium | Central pumping uses wholesale/industrial rate ($0.108/kWh); building HPs have high COP (4.71), buffering volumetric electricity risk. |
| **Environmental** | Accidental glycol release to Cayuga Lake watershed | Critical | Extremely Low | Food-grade non-toxic glycol specified; secondary containment berms; closed hydronic loop isolated by double-wall plate exchangers. |

---

## 10. Phased Project Delivery Roadmap

Execution is structured across four distinct phases spanning 60 months, aligned with data center construction and electrical energization schedules.

```
Months:      01-12        13-24        25-36        37-48        49-60
Phase 0:  [CBA & Governance]
Phase 1:              [On-Site Campus & Interface Skid]
Phase 2:                           [Corridor Ambient Loop (500 Homes)]
Phase 3:                                                   [Monitoring & Tech Transition]
```

### Phase 0: Co-op Governance, Permitting, and Agreements (Months 1 to 12)
- Formal adoption of the Community Benefit Agreement and Heat Supply Agreement by the Lansing Town Board.
- Town Board votes to withdraw the draft data center prohibition law in response to binding contractual covenants.
- Formation of the Lansing community thermal co-op (member enrollment, board with a Town seat) and execution of the operating concession agreement.
- Completion of NY State Environmental Quality Review Act (SEQRA) Full Environmental Impact Statement.
- Final engineering design and procurement specifications for the sidestream extraction skid and thermal storage.

### Phase 1: On-Site Campus and Primary Thermal Skid (Months 13 to 24)
- Installation of the 25.0 MW titanium sidestream plate heat exchanger and automated bypass valves at Lake Hawkeye.
- Construction of the 5,558 m3 atmospheric thermal energy storage tank and primary circulation pump house.
- Installation of 0.5 km of pre-insulated distribution piping across the brownfield campus.
- Construction and commissioning of the 10 ha commercial greenhouse, aquaculture RAS facility, and recreation pool.
- Commercial operation of Ring 1, delivering 37,076.0 MWh/yr of heat and creating 126 permanent jobs.

### Phase 2: Corridor 5G TEN Ambient Loop Deployment (Months 25 to 42)
- Civil trenching and horizontal directional drilling for 20.9 km of uninsulated HDPE ambient loop piping along Route 34B.
- Installation of 500 residential service laterals, ultrasonic BTU submeters, and centralized dual-fuel backup boilers.
- Turnkey installation of 500 high-efficiency water-to-water heat pumps in participating corridor homes.
- Commissioning of the 5G ambient loop (18 °C to 20 °C), delivering 13,500.0 MWh/yr and abating 11,456 t CO2/yr.

### Phase 3: Long-Term Monitoring and Technology Transition (Months 43 to 60)
- Launch of the public IoT transparency dashboard and real-time community monitoring portal.
- Evaluation of cold-climate air-source heat pump deployment and NYSEG NPA rebate utilization for dispersed homes outside the corridor.
- First 5-year comprehensive review of the Heat Supply Agreement and customer tariff cost-of-service reconciliation.

---

## 11. Engineering Limitations and Model Bounds

To maintain absolute professional integrity, the following modeling limitations and design boundaries are explicitly acknowledged:
1. Synthetic Hourly Load Profiles: Residential demand is derived from regional ResStock building archetypes scaled by TMYx historical weather. Actual hourly household consumption will vary based on individual occupant behavior, thermostat schedules, and specific building envelope infiltration rates.
2. In-Home Hydronic and Electrical Readiness: The $16,000 building heat pump capital cost includes the heat pump unit, buffer tank, and standard hydronic changeover. It excludes potential residential electrical service upgrades (for example, upgrading from 100 A to 200 A main electrical panels), which may add $2,000 to $4,000 in isolated older homes.
3. Storage Tank Stratification Dynamics: The 5,558 m3 thermal storage model assumes an idealized one-dimensional thermal thermocline across a 20 K delta T. In commercial practice, secondary mixing during rapid charging and discharging cycles may reduce effective thermal capacity by 5% to 8%, requiring periodic calibration of diffuser flow rates.
4. Linear Heat Density Vulnerability: The corridor ambient loop operates at 0.65 MWh per linear meter of trench annually. While this is acceptable for uninsulated ambient HDPE piping, any significant drop in customer participation below the assumed 70% uptake (fewer than 500 connected homes) will increase per-customer capital amortization.
5. Macroeconomic Volatility: Propane and heating oil prices are volatile commodities. While our sensitivity analysis confirms robust economic savings across historical price cycles ($2.85/gal low sensitivity), an unprecedented, sustained collapse in global fossil fuel prices would narrow the customer savings margin.

---

## 12. Engineering Sources and Verified References

1. NYSERDA Central Region Home Heating Oil and Propane Survey (Propane baseline $3.10/gal, season range $2.74 to $3.46; Heating oil $5.186/gal Central monthly mean, September 2026):  
   `https://www.nyserda.ny.gov/Energy-Prices/Home-Heating-Oil/Average-Home-Heating-Oil-Prices`
2. EPA Greenhouse Gas Emission Factors Hub (January 2025 release; 40 CFR Part 98 Table C-1: Liquid propane 62.87 kg CO2/MMBtu, 5.72 kg CO2/gal; Fuel oil #2 73.96 kg CO2/MMBtu; Natural gas 53.06 kg CO2/MMBtu):  
   `https://www.epa.gov/climateleadership/ghg-emission-factors-hub`
3. EPA eGRID2023 Summary Tables Rev 2 (Released June 12, 2025; NYUP Upstate New York subregion output emission factor: 242.8 lb CO2e/MWh; NYCW subregion: 865.7 lb CO2e/MWh):  
   `https://www.epa.gov/egrid`
4. Resource Innovation Institute (RII), Colocating Data Centers and Greenhouses (Virginia Study, June 2025; 1.0 MWth/ha design rule, 2 acres/MW DC footprint, agricultural labor metrics Table 2):  
   `resources/text/Colocating-Data-Centers_Greenhouses-RII-Virginia.txt`
5. CBS Data Center District Heating White Paper (10 MW heat pump ~EUR 6M, pipe transmission cost scaling vs distance pp. 13, 17, 19):  
   `resources/text/CBS_Data_center_white_paper_DISTRICT_HEATING.txt`
6. Open Compute Project (OCP), Data Centers Heat Reuse 101 (DLC return 45 °C to 65 °C p. 6; interface extraction cost allocation pp. 7-8):  
   `resources/text/20230623_Data_Centers_HeatReuse_101_3.2.docx.txt`
7. Climate.OneBuilding TMYx Weather Archive, Ithaca Tompkins Regional Airport Station 725155 (TMYx 2009-2023, 6,646 HDD 65 °F base):  
   `https://climate.onebuilding.org/WMO_Region_4_North_and_Central_America/USA_United_States_of_America/NY_New_York/USA_NY_Ithaca.Tompkins.Rgnl.AP.725155_TMYx.2009-2023.zip`
8. U.S. Energy Information Administration (EIA), Electric Power Monthly Table 5.6.A (New York State Industrial Retail Electricity Average: 10.81 cents/kWh, July 2026):  
   `https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a`
9. Turner & Townsend, Data Centre Construction Cost Index 2025 (North America benchmark cost range US$6.60 to US$13.30 per watt of IT capacity; $10.0M/MW midpoint):  
   `https://reports.turnerandtownsend.com/data-centre-construction-cost-index-2025/`
10. MIT OpenCourseWare (Course RES.ENV-007, Lecture 7, Networked Geothermal Energy Systems; residential networked infrastructure benchmarks ~$50,000 per residence):  
    `https://ocw.mit.edu/courses/res-env-007-geothermal-energy-networks-transforming-our-thermal-energy-system-january-iap-2025/`
11. Internal Revenue Code Section 48 & Treasury Final Regulations 2024-28190 (December 12, 2024; restricting geothermal heat pump property to ground/groundwater thermal sources):  
    `https://www.govinfo.gov/content/pkg/FR-2024-12-12/html/2024-28190.htm`
12. New York State Public Service Commission, Case 20-G-0131 (Order Invoking Gas Moratorium in the Town of Lansing, Tompkins County, May 12, 2022):  
    `https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BE068C615-B8EE-4CB9-AF92-3153A49BE4E4%7D`
13. New York State Department of Environmental Conservation, Water Withdrawal Permit ID 7-5032-00019/00024 (Issued to Cayuga Operating Company LLC, April 13, 2026, 1.008 MGD limit restricted to maintenance and dust control):  
    `https://dec.ny.gov/sites/default/files/2026-04/cayugaoperatingwwpermit.pdf`
14. Tompkins County Legislature, Resolution 2026-3 (Adopted January 20, 2026; Requesting DEC Require Project-Appropriate Environmental Review for Cayuga Site):  
    `https://tompkinscountyny.iqm2.com/Citizens/Detail_LegiFile.aspx?CssClass=&Frame=&ID=13804&MediaPosition=&MeetingID=4213`
15. TeraWulf Inc., Form 10-Q Quarterly Report for the Period Ended June 30, 2026 (Lake Hawkeye 400 MW gross / 320 MW critical IT development plans):  
    `https://www.sec.gov/Archives/edgar/data/1083301/000108330126000162/a_wulfearningsreleaseq22026.htm`

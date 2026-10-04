# Video Presentation Script: Thermal Commons (Heat for Lansing)

**Challenge:** HDR x Grundfos "Data Center Heat Reuse" (BAC x iMasons Hackathon 2026)  
**Track:** Waste Heat Reusage  
**Team:** Thermal Commons (Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev)  
**Site:** TeraWulf Lake Hawkeye Data Center (former Cayuga Coal Plant), Lansing, NY  
**Target Duration:** 2:30 (hard maximum 3:00)  
**Total Spoken Word Count:** 330 words (timed for a measured 132 words per minute pace)  
**Notice:** No em-dashes are used in this document per engineering guidelines.

---

## 1. Recording Setup and Technical Checklist

Before starting screen capture, verify all recording parameters:

- **Display Resolution:** 1920x1080 native (1080p, 16:9 aspect ratio). Set Windows display scaling to 100%.
- **Browser Zoom:** Google Chrome or Edge set to 100% zoom (press `Ctrl+0`). Ensure browser bookmarks bar is hidden (`Ctrl+Shift+B`).
- **Capture Software:** Windows Game Bar (`Win+Alt+R` to start/stop recording) or OBS Studio (configured for 1080p60, 6000 kbps CBR, audio bitrate 192 kbps).
- **Audio Verification:** Test external microphone gain. Keep background ambient noise below -40 dB.
- **Pre-Opened Browser Tabs (in display order):**
  1. Tab 1: `http://localhost:3000/` (Story Mode, loaded on Step 1: Context and Site).
  2. Tab 2: `http://localhost:3000/explore` (Interactive Scenario Sliders, loaded on Base Case).
  3. Tab 3: `http://localhost:3000/compare` (Site 1 NYC vs Site 2 Lansing comparison view).
  4. Tab 4: `http://localhost:3000/print` (One-page executive tear sheet with QR code).
  5. Tab 5: `https://github.com/harshagarwalnyu/Data-Center-Heat-Reuse` (Public repository with commit history and test badges).

---

## 2. Timed Script Table

| Time | Narration (Spoken Words) | On Screen (App Screen, Route, and Visual Action) |
| :--- | :--- | :--- |
| **0:00 - 0:15** | On September 29th, the Town of Lansing directed its attorney to draft a data center ban, with 500,000 dollars proposed in next year's budget for 500,000 dollars legal costs. Free heat is not enough. Lansing Michigan proved that when Deep Green withdrew. | **Route: `/` (Story Step 1: The Lansing Dilemma)**<br>Show satellite map of the Cayuga coal site on Cayuga Lake. Highlight the news banner: Town Board drafting local law prohibition, $500,000 proposed in next year's budget for legal costs. |
| **0:15 - 0:40** | We are Team Thermal Commons. Our proposal defines the exact conditions under which Lansing can say yes: a binding Community Benefit Agreement, a community thermal co-op, and the right engineering tool at every density. At the former Cayuga coal plant, TeraWulf Lake Hawkeye, in our modeled 150 megawatt first phase, makes 778 gigawatt-hours of heat available annually. | **Route: `/` (Story Step 2 & Step 3: Site & Governance Framework)**<br>Advance through story cards. Show the modeled 150 MW first-phase data center diagram, the 777.6 GWh available heat arrow, and the co-op governance diagram (member-elected board, one Town seat). |
| **0:40 - 1:10** | Our rule is cooling always wins. A sidestream plate heat exchanger extracts 50-degree Celsius coolant without touching primary dry coolers. We dispatch heat across two viable rings: Ring 1 delivers 37 gigawatt-hours directly to a 10-hectare greenhouse campus at 40 dollars per megawatt-hour. Ring 2 connects 500 homes along an ambient 20-degree loop with local heat pumps. | **Route: `/` (Story Step 4 & Step 5: Engineering Architecture & Network Rings)**<br>Show the hydraulic P&ID schematic: sidestream plate heat exchanger failing safe to primary dry coolers. Pan across the interactive GIS map displaying Ring 1 (greenhouse campus) and Ring 2 (corridor ambient loop). |
| **1:10 - 1:35** | Senior engineers test assumptions. Ring 3, a 14-kilometer transmission pipe to town hall, costs 734 dollars per megawatt-hour with 51 percent pipe heat loss. We fail it honestly. Density matters. For scattered homes, heat pump rebates are the right tool. Our 8,760-hour dispatch with thermal storage achieves zero unmet hours. | **Route: `/` (Story Step 6 & Step 7: The Honest Gate Test & Hourly Dispatch)**<br>Click on Ring 3: show red "Fails Gate" badge ($734.2/MWh, 1,840 MWh thermal losses). Transition to the 8,760-hour annual dispatch chart showing winter design week, 5,558 m3 storage buffer, and 100% backup boiler coverage. |
| **1:35 - 2:05** | Watch our live Explore tab recompute in real time. Sliding data center load shows supply never binds. Sliding the discount rate reveals blended cost of heat: 89 dollars at 4 percent, 106 dollars at 7 percent, beating 136-dollar propane. The project has a 26-million-dollar present value funding gap, or 2.1 million dollars annuitized. That is under two percent of data center capex. | **Route: `/explore` (Interactive Sensitivity & Cost Sliders)**<br>Grab the data center IT load slider and move it from 150 MW to 320 MW: show the tornado chart remaining flat (supply never binds). Move the discount rate slider (4% to 7% to 10%): highlight LCOH changing from $89.5 to $106.1 to $124.6/MWh vs $136.1 propane. Highlight the CBA funding gap callout ($26.01M PV, $2.10M/yr). |
| **2:05 - 2:30** | This unlocks 126 jobs, 5,500 tons of local food, and 11,408 tons of avoided carbon, saving households 735 dollars yearly. We urge the Town Board and TeraWulf to adopt this framework. Explore our open-source code and full model at github.com/harshagarwalnyu/Data-Center-Heat-Reuse. | **Route: `/compare` then `/print`**<br>Quickly show the HDR 7-domain scorecard on `/compare`. Switch to `/print` displaying the clean one-page PDF sheet with QR code, then bring up the final slide showing the team names and repository link: `https://github.com/harshagarwalnyu/Data-Center-Heat-Reuse`. |

---

## 3. Verbal Word Count Verification

- Section 1 (0:00 - 0:15): 35 words
- Section 2 (0:15 - 0:40): 55 words
- Section 3 (0:40 - 1:10): 70 words
- Section 4 (1:10 - 1:35): 60 words
- Section 5 (1:35 - 2:05): 65 words
- Section 6 (2:05 - 2:30): 45 words
- **Total Spoken Word Count:** 330 words

# Video quotes for slides

Fifteen slide lines, each under 15 words, taken from auto-captions in `research/transcripts/clean/*.heat.txt`, `*.numbers.txt`, and the matching `*.txt`. Playlist digest: `research/videos.md`. Playlist: https://www.youtube.com/playlist?list=PLrZMAz7fZps09Vy9XfEzJNIg8mIudPjKk (checked 2026-10-04).

These lines were read from the caption files on 2026-10-04. They were not re-watched. `research/videos.md` says the auto-captions are noisy and figures are indicative. Spoken audio is **[unverified]** until someone plays the timestamp. Do not smooth a line on a slide unless the gloss below is labeled as a caption repair.

Team: Thermal Commons (Harsh Agarwal, Linson Lee, Philip Matchev). The community heat co-op is the Thermal Commons co-op. Site: Lake Hawkeye / TeraWulf, Lansing, NY. None of these videos are about that site.

## How to cite

Each entry: verbatim span, word count, speaker as named in the caption or digest, video, URL with `t=` at the cue start, transcript file. A gloss is an **ASSUMPTION** (caption repair only). It is not a second quote.

## Quotes

### 1. Do not touch cooling reliability

> "we need to do this in a sensible way"

9 words. Dr John Summers, scientific lead in data centers at RISE (caption "Dr John Summers"; `research/videos.md` spells Jon Summers). Cue is his answer on heat recovery versus uptime.

- Video 41, *The Research Side of Data Centers with Jon Summers*
- https://www.youtube.com/watch?v=dWSxZwLn0nQ&t=1452s at 00:24:12
- `research/transcripts/clean/41-dWSxZwLn0nQ.txt`
- Slide: sidestream only. Cooling never depends on the Thermal Commons co-op.
- Same cue, not part of the 9-word line: "trying to reuse the heat could actually be disruptive".

### 2. Report reuse beside PUE

> "your ER would be half your pu"

7 words. Dr John Summers. He has just defined energy reuse effectiveness (ERE) as PUE combined with the energy reuse factor.

- Video 41, same URL, https://www.youtube.com/watch?v=dWSxZwLn0nQ&t=1660s at 00:27:40
- `research/transcripts/clean/41-dWSxZwLn0nQ.heat.txt`
- **ASSUMPTION:** "ER" is his ERE and "pu" is PUE. The next words in the same cue are "if your pu was 1.2 your ER would be6". The caption drops a decimal. Do not print "0.6" on a slide. **[unverified]** spoken value.
- Slide: show ERE next to PUE. A heat pump on the co-op side is not the data center's PUE.

### 3. Almost all input power becomes heat

> "out as heat so they're only 0.3% efficient"

8 words. Dr John Summers, on compute versus an incandescent bulb.

- Video 41, https://www.youtube.com/watch?v=dWSxZwLn0nQ&t=683s at 00:11:23
- `research/transcripts/clean/41-dWSxZwLn0nQ.numbers.txt`
- Prior cue 00:11:03 says "99.97% of the electrical energy going into" the computer "is coming out as heat". That clause is a different timestamp. Do not merge the two cues into one quote.
- Slide: the product is heat. Reuse is the point of the co-op, not a side claim.

### 4. US sites sit far from heat users

> "these data centers in the middle of nowhere"

8 words. Matt Strad, co-founder, IceBox Energy (caption spelling "Strad"; full surname **[unverified]**).

- Video 07, *Optimise or Transform*
- https://www.youtube.com/watch?v=eUfg6eYOutE&t=2241s at 00:37:21
- `research/transcripts/clean/07-eUfg6eYOutE.txt`
- **ASSUMPTION:** this answer is Matt's, not George Hancock (Octipe). The host asks a heat question, this answer runs 00:37:10–00:38:13, then the host turns to George at 00:38:23. Turn-taking only. **[unverified]** if the edit hides a speaker change.
- Slide: Lansing's town center is miles away. Bring users to the heat.

### 5. Heat can displace fuel at the user

> "displaced natural gas at the point of use"

8 words. Same speaker and answer as quote 4 (Matt Strad, turn-taking **ASSUMPTION**).

- Video 07, https://www.youtube.com/watch?v=eUfg6eYOutE&t=2284s at 00:38:04
- `research/transcripts/clean/07-eUfg6eYOutE.txt`
- Full cue: "all the energy that we're putting into these data centers could just be captured as heat and displaced for um displaced natural gas at the point of use."
- He says this about Europe in the prior cue ("more pressure there to reutilize the heat"), not about Lansing. Lansing's gas moratorium is not in this video.
- Slide: affordability hook only as an analogy. Homes on propane and oil are a separate sourced fact.

### 6. A pool is not a flat heat sink

> "even swimming pool it's not perfect mat for the constant Heat"

11 words. David G, independent consultant (caption gives no surname; company rendered "impon", **[unverified]**).

- Video 39, *Decarbonization and Heat Re-Use in Data Centers*
- https://www.youtube.com/watch?v=IHIt66rNJr8&t=280s at 00:04:40
- `research/transcripts/clean/39-IHIt66rNJr8.heat.txt`
- **ASSUMPTION:** "mat" is "match". Do not print the repaired sentence as his words.
- Same talk, 00:03:53: pool project with "mudon city". City name **[unverified]**.
- Slide: rec-center pool is not the baseload. Pair it with greenhouses and aquaculture.

### 7. Supply is huge next to a village load

> "500 kilow capacity and you have 300 megawatt"

8 words. David G. Greenfield campus versus nearby villages.

- Video 39, https://www.youtube.com/watch?v=IHIt66rNJr8&t=1423s at 00:23:43
- `research/transcripts/clean/39-IHIt66rNJr8.heat.txt`
- Prior cue 00:23:21: "300 megaw which is in a green field" and "closest users is just some villages".
- Caption uses "kilow" and "megawatt" with no "W" expanded. Do not invent MWh.
- Slide: matching is the bottleneck. This is not a Lake Hawkeye megawatt figure.

### 8. Air-side loop temperatures

> "34° Inlet water 44 Outlet"

5 words. David G, describing an air-cooling slide. He says "ocp servers" in the same cue.

- Video 39, https://www.youtube.com/watch?v=IHIt66rNJr8&t=1070s at 00:17:50
- `research/transcripts/clean/39-IHIt66rNJr8.numbers.txt`
- Next cue 00:18:09 reads "up to 7 ° Outlet hot water" for on-chip. Cue 00:18:32 says "to achieve 70° we need to heat pump" and then "liquid cooling we can achieve that without additional energy." The "7 °" versus "70°" conflict is **[unverified]**. Do not put "70°C on-chip, no heat pump" on a slide from this caption.
- Slide: 34/44°C is the air-side number he actually states. Our 50°C capture case stays the conservative base.

### 9. The data center will not depend on the heat buyer

> "don't want to be dependent from the distic operator"

9 words. David G, on why legal teams block a heat connection.

- Video 39, https://www.youtube.com/watch?v=IHIt66rNJr8&t=1361s at 00:22:41
- `research/transcripts/clean/39-IHIt66rNJr8.txt`
- **ASSUMPTION:** "distic" is "district". Same answer at 00:21:57: "one main reason of that is uh legal departments".
- Slide: the heat-supply agreement must leave TeraWulf independent. Dry coolers stay the rejection path.

### 10. Immersion heat is still low grade

> "relatively low grade Heat at 40 45 or 50° C"

10 words. Scott, CEO, Midas Immersion Cooling. `research/videos.md` titles him Scott Sickmiller. This caption says "Scott sigilla" (00:00:52). Surname **[unverified]** between those two spellings.

- Video 28, *Liquid Cooling: Deep Dive on Immersion Cooling*
- https://www.youtube.com/watch?v=kxr5wkDYcKE&t=1249s at 00:20:49
- `research/transcripts/clean/28-kxr5wkDYcKE.heat.txt`
- Same cue: that range "gets us closer to that 95 degre C". He is talking about older district networks, not a greenhouse loop.
- Slide: 40–50°C is fine for on-site greenhouses, pools, and an ambient loop. A town-center main that needs ~95°C is a lift, and it is conditional.

### 11. About one megawatt heats about one acre of greenhouse

> "one megawatt of of heat rejection in that environment Heats about one acre"

13 words. Same speaker as quote 10. Norway crypto-mining example, tomatoes. He repeats "one megawatt of heat rejection about one acre of of greenhouse" at 00:20:21.

- Video 28, https://www.youtube.com/watch?v=kxr5wkDYcKE&t=1187s at 00:19:47
- `research/transcripts/clean/28-kxr5wkDYcKE.txt`
- Not a Lansing yield. Not a data-center case. Stutter "of of" is in the caption.
- Slide: order-of-magnitude only for an on-site greenhouse. Do not treat it as our model.

### 12. Address community concerns before the project proceeds

> "address the community concerns right out of the gate"

9 words. Colby Cox, managing director, Americas, DC Byte (intro: "Colby Cox from DC bytes"; later caption "DC bite"). He is answering Dean Nelson, who asked for his view of clean energy zones. Dean Nelson is founder and chairman of Infrastructure Masons (00:00:46).

- Video 44, *POWER: State of the Digital Infrastructure Industry Report 2024*
- https://www.youtube.com/watch?v=GUJDltEzAzg&t=2171s at 00:36:11
- `research/transcripts/clean/44-GUJDltEzAzg.heat.txt`
- Slide: the binding heat-reuse covenant is the condition for a yes. This line is about clean-energy zones in that report, not about Lansing's 2026-09-29 board vote.

### 13. Coolant loops are already at 45°C

> "Reuben architecture moved to the 45 degree coolant loop"

9 words. Riley McAdams, co-founder and CEO, Seabase (caption "Seabbase" / "CBase").

- Video 05, *The Next Data Centers: Ocean Floor, Job Site, Space*
- https://www.youtube.com/watch?v=J2Juo0WPjhg&t=411s at 00:06:51
- `research/transcripts/clean/05-J2Juo0WPjhg.txt`
- **ASSUMPTION:** "Reuben" is a caption error for a GPU architecture name. `research/videos.md` reads it as next-generation GPU architecture. The name is **[unverified]**. The "45 degree" words are in the cue. His pods reject heat to seawater. That is not our reuse case.
- Slide: 45°C is an industry floor under our 50°C capture assumption. Say the degree claim, not the garbled product name.

### 14. Most of a dense rack's heat can be in liquid

> "35 kilowatt of air plus 110 of director on chip"

10 words. Yuval, founder and CEO of ECL (caption "Yuval Bashar"; `research/videos.md` spells Bachar). Surname **[unverified]** between those spellings.

- Video 17, *The Next Generation Data Centre*
- https://www.youtube.com/watch?v=oVsqZHZIrto&t=345s at 00:05:45
- `research/transcripts/clean/17-oVsqZHZIrto.heat.txt`
- "110" has no unit in this cue. Prior cue 00:05:17 says "over a 100 kilowatts of direct on chip" and 00:05:34 says "about 35 to 40 kilowatt of air". **ASSUMPTION:** "110" means kilowatts and "director" means "direct". `research/videos.md` states 110 kW liquid + 35 kW air. Do not print 75% or 0.76 as his words. That ratio is the digest's arithmetic.
- Slide: liquid carries most of the heat on a dense rack. Capture fraction stays a model assumption.

### 15. Rural utilities cannot serve a large new load

> "not able to service that much of a load"

9 words. Rafi Balian, CFO and head of strategy, Network Environments (intro spells Balian; he says "my name is Rafi").

- Video 02, *Power Is the New Bottleneck*
- https://www.youtube.com/watch?v=_O1Qv2iTbFE&t=265s at 00:04:25
- `research/transcripts/clean/02-_O1Qv2iTbFE.heat.txt`
- Same sentence: "100 megawatts 200 megawatts" and "suburban and rural areas". The 9-word line is the load clause only, so a slide can pair it with those numbers from the same cue without merging two timestamps.
- Slide: interconnection is the constraint. Heat-pump electricity is a real grid load. This is not a NYSEG quote.

## Lines checked and left out

Kept under the cap of 15. Still in the captions if a slide needs a spare:

- Video 39, 00:04:17, David G: "three gas boilers each 900 kilowatt" and "cut by half gas consumption". Pool project, not Lansing.
- Video 39, 00:09:38, David G: "up to 35%" of "r power" goes to fans. "r power" is **[unverified]** as "rack power". Do not claim the co-op saves server-fan energy.
- Video 28, 00:18:53, Scott: "spinning 18 kilowatts to heat that pool is not uncommon". **ASSUMPTION:** "spinning" is "spending". Hotel pool, not our rec center.
- Video 38, 00:21:01, Rich Kenny (managing director, Interact DC; caption "inter DC" / "interact"): "swimming pool schools local communities" (12 words inside a longer cue). https://www.youtube.com/watch?v=NoQ2SkVycm0&t=1261s
- Video 26, 00:26:29, Maximilian Weidl (caption "Maximan Widel" / "Maximillian", CEO, Clear Decisions): "heat reuse for instance is a very very important aspect" (9 words). Germany line at 00:32:47 is "fundamental in in Germany". https://www.youtube.com/watch?v=vqe-QmSoj3I&t=1589s

## Lane status

- **Done:** `docs/research/video-quotes.md` created first, then filled with 15 caption lines. Each line is under 15 words, named to a speaker, and tied to a YouTube URL plus cue timestamp. Word counts were taken from the verbatim spans above. Sources are the clean transcript files and `research/videos.md`.
- **Missing:** no line was confirmed by playing the video. Spoken wording, the "7 °" versus "70°" slip, and the surnames flagged above stay **[unverified]**. No organizer-doc quote was added. This lane did not use `resources/text/` because the task is the playlist captions.
- **Open questions:** Is the 00:37:21 speaker Matt Strad or George Hancock? What was actually said at 00:18:09, "7" or "70"? Which spelling is right for Sickmiller/sigilla, Bachar/Bashar, and Reuben? Is "Mudon" a real city? Should a slide use the spare Rich Kenny "pools, schools, communities" line instead of quote 15?

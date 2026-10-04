# Documentation index

Start with the root [README](../README.md). This index is a selected list of documents in `docs/` and `research/`, not an exhaustive one. Files in `docs/` are the proposal and its supporting design material; files in `research/` are the fact base and working notes behind the numbers. Where two files disagree, `research/verification.md` overrides older research files, and the model outputs in `outputs/` override any number quoted in prose.

## Read these first

| File | What it is |
|---|---|
| [proposal.md](proposal.md) | The engineering and policy proposal for Thermal Commons. |
| [results.md](results.md) | Base-case results, ring-by-ring LCOH, sensitivity, Site 1 versus Site 2, limitations, next steps. |
| [methodology.md](methodology.md) | The 8,760-hour pipeline, step by step, with formulas and code references. |
| [assumptions.md](assumptions.md) | Every key input with value, unit, source and confidence. |
| [architecture.md](architecture.md) | Model, JSON contract and Next.js app, with a diagram and regeneration steps. |
| [analysis-detail.md](analysis-detail.md) | Monte Carlo uncertainty (P10/P50/P90), monthly and seasonal detail, per-ring breakdown, load-duration curve. |
| [hydraulics.md](hydraulics.md) | Screening hydraulics: design flows, pipe DN, pump head and duty, variable- vs constant-speed pumping energy against the flat 1.5% share. |
| [rubric.md](rubric.md) | The five judging categories and how the project addresses each. |

## docs/ : model, app and contract

| File | What it is |
|---|---|
| [data-contract.md](data-contract.md) | The JSON shape the Python model writes and the web app reads. |
| [frontend-notes.md](frontend-notes.md) | Web app routes, stack, run commands, data handling and known gaps. |

## docs/ : design and deal

| File | What it is |
|---|---|
| [cooling-integration.md](cooling-integration.md) | How heat is captured from the Lake Hawkeye cooling system: capture points, temperatures, sidestream interface. |
| [greenhouse-anchor.md](greenhouse-anchor.md) | The on-site heat sink: greenhouses, aquaculture and recreation, with demand per hectare and temperature needs. |
| [ownership-deal.md](ownership-deal.md) | Ownership models, recommendation, and term sheets for the Heat Supply Agreement and Community Benefit Agreement. |
| [term-sheet.md](term-sheet.md) | Plain-language draft term sheet (not legal advice): Heat Supply Agreement, Community Benefit Agreement, permit conditions, tariffs, governance, gates and open items for counsel. |
| [risk-matrix.md](risk-matrix.md) | Scored risk register, heat-continuity cascade and cooling independence statement. |
| [stakeholders.md](stakeholders.md) | Power and interest map and profiles of the people and institutions involved. |

## docs/proposal/, presentation and live judging

| File | What it is |
|---|---|
| [proposal/12-implementation-timeline.md](proposal/12-implementation-timeline.md) | 2026 to 2032 schedule, decision gates and phasing by ring. |
| [proposal/13-regenerative-scorecard.md](proposal/13-regenerative-scorecard.md) | Audit table for HDR's seven regenerative domains, judging lenses and supply-demand matching axes. |
| [deck/Thermal-Commons-Heat-for-Lansing.pdf](deck/Thermal-Commons-Heat-for-Lansing.pdf) | The 9-slide presentation deck (PDF; a PPTX with speaker notes sits beside it). |
| [team-brief.md](team-brief.md) | One-page brief: video demo vs live presentation, who says what. |
| [video-script.md](video-script.md) | Script for the video presentation. |
| [presentation-script.md](presentation-script.md) | Five-minute live presentation script: nine slides, speaker handoffs and clicker cues, then a 60-second demo. |
| [demo-runbook.md](demo-runbook.md) | Judging-room demo runbook: setup commands, offline build and the demo path, using the same `outputs/site2.json` numbers as the slides. |
| [judge-qa.md](judge-qa.md) | Twenty-five anticipated judge questions with answers, each tied to a key in `outputs/site2.json` or a verification row. |

## docs/audit/ : independent reviews

Read-only reviews of the numbers, copy and interface. Findings were fed back into the model and app; the model outputs remain the source of truth.

| File | What it is |
|---|---|
| [audit/numbers-v3.md](audit/numbers-v3.md) | Numbers audit v3: every judge-facing figure checked against `site2.json` (model v3.1). |
| [audit/numbers-supply.md](audit/numbers-supply.md) | Supply-side numbers against config and physics. |
| [audit/numbers-demand.md](audit/numbers-demand.md) | Ring demand, greenhouse intensity, homes and seasonality. |
| [audit/numbers-finance.md](audit/numbers-finance.md) | Capex, LCOH, incumbents, tariff, household savings. |
| [audit/numbers-impact.md](audit/numbers-impact.md) | CO2, ERF, jobs, food and water claims. |
| [audit/numbers-site1-offtakers.md](audit/numbers-site1-offtakers.md) | Site 1 outputs, offtaker coordinates and distances. |
| [audit/code-review-pr2.md](audit/code-review-pr2.md) | Correctness review of the model and app code on the feature branch. |
| [audit/copy-vs-facts.md](audit/copy-vs-facts.md) | User-facing copy checked against verified facts. |
| [audit/ux-nielsen.md](audit/ux-nielsen.md) | Nielsen ten-heuristic usability review. |
| [audit/ux-walkthrough.md](audit/ux-walkthrough.md) | Cognitive walkthrough for a first-time executive reader. |
| [audit/ux-wcag.md](audit/ux-wcag.md) | WCAG 2.2 AA accessibility review. |
| [audit/ux-visual.md](audit/ux-visual.md) | Visual design review. |
| [audit/a11y-projector.md](audit/a11y-projector.md) | Projector and senior-reader audit: type size, one takeaway per screen, keyboard navigation, no hover-only information. |

## docs/research/

| File | What it is |
|---|---|
| [research/case-fact-check.md](research/case-fact-check.md) | Fact check of every precedent case and firm in the case studies, including Deep Green in Lansing, Michigan. |

## research/ : fact base and working notes

| File | What it is |
|---|---|
| [../research/verification.md](../research/verification.md) | Primary-source verification of facts, with corrections that override older files. |
| [../research/model-notes.md](../research/model-notes.md) | Model assumption log, source discrepancies, run records and version changes. |
| [../research/facts-site2.md](../research/facts-site2.md) | Fact base for Lake Hawkeye: project, Lansing context, offtakers, prices, climate. |
| [../research/facts-site1.md](../research/facts-site1.md) | Fact base for 111 8th Ave: building, tenants, nearby offtakers, Con Edison steam. |
| [../research/site-selection.md](../research/site-selection.md) | Why Site 2 is the committed site and Site 1 the comparison, with a lens-by-lens scoring matrix. |
| [../research/offtakers.md](../research/offtakers.md) | Candidate heat customers near the plant, with coordinates and method. |
| [../research/case-studies.md](../research/case-studies.md) | Verified precedents of data-center heat reuse, starting with Deep Green. |
| [../research/digest-organizer.md](../research/digest-organizer.md) | Digest of the organizer documents: brief, HDR deck, site packs, engineering parameter ranges. |
| [../research/reference-materials.md](../research/reference-materials.md) | Heat reuse standards, reference architectures and the HDR framework. |
| [../research/videos.md](../research/videos.md) | Digest of the 44-video organizer playlist, with the few that carry heat-reuse substance. |
| [../research/ux-for-executives.md](../research/ux-for-executives.md) | Evidence on readability and executive dashboards behind the interface choices. |

The raw video transcripts in `research/transcripts/` are git-ignored; the source documents in `resources/` are organizer materials kept as extracted text and pages.

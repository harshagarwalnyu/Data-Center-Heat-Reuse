# Copy vs facts — user-facing strings in `web/`

Audit of factual claims in user-facing copy under `web/app`, `web/components`, `web/lib`, and `web/content` against `research/verification.md` (overrides older files). Model numbers cross-checked to `web/public/data/*.json` where the claim is a modeled output.

Scope: Cursor task C46. Owner file only. Read-only on `web/`. Team: Thermal Commons (Harsh Agarwal, Linson Lee, Aryaman Bhaskar, Philip Matchev).

Checked (verified 2026-10-03 unless a row says otherwise):

- "36 of 38" speakers opposed at the 2026-09-29 Lansing Town Board meeting
- "2014" NYSEG natural-gas moratorium
- "40-50%" heat-recovery fraction
- Executive Order 62 (EO 62)
- 400 MW stated as the current Lake Hawkeye proposal (reality: ~150 MW phase 1; 300–400 MW is a build-out scenario)
- Deep Green / Lansing, Michigan mixed up with Lansing, New York
- Unsourced numbers in user-facing strings

Columns: `file:line | claim | problem | corrected text`

## Method

Grep of `.tsx`, `.ts`, and `.json` under `web/app`, `web/components`, `web/lib`, and `web/content`. Each flagged claim is checked against `research/verification.md` and, for model outputs, `web/public/data/*.json`. Organizer text in `resources/text/` outranks web sources. Unverified claims are marked `[unverified]`. Assumptions are marked ASSUMPTION.

## Flags

_Findings appended as verified. Empty until the first pass completes._

## Pass log

_Running notes. Not a substitute for the Flags table._

## Lane status

### Done

- File created with headings before the string pass.

### Missing

- Full string pass against `research/verification.md`.
- Flag table rows.

### Open questions

- None yet.

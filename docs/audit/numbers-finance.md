# Finance numbers audit — Site 2 (Lake Hawkeye)

Audit of `web/public/data/site2.json` finance fields against `config/finance.yaml` and `research/verification.md`. Hand-check of levelized cost of heat (LCOH) uses the capital recovery factor (CRF).

Scope: capex lines, LCOH at three discount rates, incumbent $/MWh, tariff, household savings, tornado, data-center exit. Base case is 150 MW phase 1. No federal tax credit in the base case.

Checked: 2026-10-04. Source-of-truth precedence: `research/verification.md` overrides older files. Organizer text in `resources/text/` outranks web sources.

## Method

CRF at discount rate \(r\) and life \(n\) years:

\[
\mathrm{CRF} = \frac{r(1+r)^n}{(1+r)^n - 1}
\]

When \(r = 0\), CRF = \(1/n\).

Annual capital charge = capex × CRF. LCOH ($/MWh) = (annual capital + annual opex) / annual heat delivered (MWh), unless the model states a different formula. Each line below is marked OK or WRONG after the hand check.

## Capex lines

Pending.

## LCOH at three rates

Pending.

## Incumbent fuel $/MWh

Pending.

## Tariff

Pending.

## Household savings

Pending.

## Tornado

Pending.

## Data-center exit

Pending.

## Fixes

Pending.

## Lane status

- Done: file created; audit in progress.
- Missing: all checks.
- Open questions: none yet.

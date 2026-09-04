# Live Shift Command V10 — Integration Contract

## Core rule

**V9 becomes V10.**

V8/V9 modules are not an untouchable product beside V10; they are the working production foundation that V10 evolves. Do not rewrite working workflows, but do let V10 override the specific writer/UI behavior that must change.

Read these with this file:

- `../CONTINUE_HERE.md`
- `RELEASE_BASELINE.md`
- `V10_LOAD_MATRIX.md`
- `WEB_MOBILE_AUTHORITY.md`
- `AI_INTEGRATION.md`
- `PREVIEW_GATE.md`

## Existing systems V10 reuses

V10 does **not** create replacements for:

- `/api/state` shared revisioned state
- `/api/archive` permanent Plant Memory
- `/api/intelligence` existing live AI bridge
- V8 downtime / voice / photo / type capture
- canonical downtime codes and 4M classification
- V8 quality flow
- responders / recovery / verification
- Shift Recall
- V9 schedule versions / detached schedules
- V9 cross-midnight ownership
- V9 hot memory / Live Now / Calendar Memory
- existing manager ratings / response / quality / solution memory / evidence ledger
- existing Morning Meeting Brief button

## V10 shared-state evolution

V10 upgrades the existing web `update()` and mobile `mutate()` writer so confirmed writes use:

`schema = live-shift-command/v10`

while preserving the same GET → revision → POST → HTTP 409 retry workflow.

Existing `state.config` is retained. V10 adds only scoped capability metadata under `config.v10`.

Existing shift production remains:

`current.production[]`

V10 adds explicit process/run/hour Good Actual:

`current.processProduction[]`

No shift Actual is inferred or redistributed into process Actual.

The same process + run + plant hour is an upsert key. A correction replaces the active value and preserves the prior value in `corrections[]` instead of double-counting production.

Scrap / Rework remains in the existing event workflow and is never duplicated into Process Actual totals.

## Web V10

Manager web keeps the existing V9 Live Now area table. V10 enhances it in place with:

- compact Process Actual action
- one-line process/run evidence context

New manager detail surfaces are limited to genuinely new intelligence:

- Calendar Day Reconstruction
- process run → hour → evidence drilldown
- Rate / Capacity Intelligence
- weak-shift constraint and D/Q/R loss mix
- 4M / optional 6M cause Pareto
- incident → action → verification drill-through

The existing `MORNING MEETING BRIEF` button is upgraded in place with V10 process/capacity evidence.

## Mobile V10

Mobile remains floor-focused. It adds:

- compact Process / Run card
- Process Actual capture
- Process Actual in Shift Detail

It retains the existing V8/V9 downtime, quality, evidence, response, Copilot and closeout workflows.

Company Goal is manager-controlled:

- mobile edit control is removed
- Start Shift displays the shared goal read-only
- mobile uses the manager value but cannot change it

Mobile does not load Capacity Intelligence, manager Calendar Reconstruction, manager brief, schedule configuration or optional 6M refinement.

## 4M / optional 6M

Canonical downtime-code mapping remains 4M.

Manager can optionally refine an event to:

- Measurement
- Environment

when evidence supports the 6M extension. The canonical 4M value is retained for auditability. The V10 cause Pareto uses the 6M refinement when present.

## Existing AI integration

The live V8 `/api/intelligence` path is retained.

V10 only augments existing request context:

- Copilot receives `process_run_hourly`
- classification receives `process_run_hourly`

There is no second AI provider or model path.

AI remains advisory and cannot write Company Goal, MES rate, schedules, Process Actual, downtime resolution, quality disposition or capacity configuration.

## Calendar / operating day

Plant timezone: `America/Chicago`.

Plant operating day: **07:00 → 06:59:59**.

Third Shift and detached process schedules retain their existing cross-midnight work-date rules. V10 reconstruction uses the event's captured operating / plant-shift / process-schedule work-date evidence.

## Capacity decision

Only three advisory states exist:

- `HOLD`
- `INVESTIGATE`
- `TRIAL HIGHER RATE`

A higher-rate trial remains blocked until all three shifts have repeated trustworthy production evidence. Missing Actual and untouched legacy zeros do not qualify.

Capacity intelligence never writes `config.mesRate` or `shiftGoal`.

Current sparse real archive expectation remains:

`HOLD / BUILDING`

## Permanent archive finding

A read-only probe of the current production archive on 2026-09-03 showed that `include=shifts` returns the full completed shift object, including fields introduced well after the original archive schema such as:

- nested `intelligence.classification`
- `intelligenceUsage`
- `scheduleVersionId`
- `plantShiftId`
- `productionTracking`
- notes
- full responder objects
- event schedule/context fields

This strongly indicates the server persists whole shift JSON rather than an old field whitelist. Therefore `processProduction[]` should survive archive without a server schema rewrite.

A real V10 test shift must still prove End Shift → archive → Day Reconstruction before production promotion.

## Acceptance

Run:

```bash
node tests/run-v10-acceptance.js
```

The suite covers:

- missing-vs-zero production truth
- Chicago/cross-midnight attribution
- process Actual correction safety
- config preservation
- existing AI-path context augmentation
- capacity HOLD / INVESTIGATE / TRIAL decisions
- optional 6M cause refinement
- nine-section brief
- non-overlap architecture contracts

Draft integration PR: **#1**. It is a test/review checkpoint and must remain unmerged until `PREVIEW_GATE.md` passes.

## Production rule

Never deploy stale GitHub `main` over the live CLI/prebuilt applications. Re-check both live deployment heads immediately before preview/promotion, preserve rollback IDs, and promote web + mobile as one coordinated V10 shared-schema release.

Shift Roster remains untouched.
# Live Shift Command V10 — Integration Gate

## Source of truth

Production is currently a Vercel CLI/prebuilt deployment and is newer than GitHub `main`. Do not deploy `main` over production.

Protected continuation work lives on:

`live-shift-command-v10-recovery`

Production baseline at recovery:

- Project: `live-shift-command-v74`
- Production URL: `https://live-shift-command-v74.vercel.app`
- Baseline deployment: `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`
- Deployment source: CLI / prebuilt output, not Git-linked

## V10 production load order

V10 is additive to the recovered V8/V9 manager build. When integrating into a recovered copy of the production deployment workspace, load these after the existing V9 assets:

```html
<link rel="stylesheet" href="/lsc-command-v10.css">
<link rel="stylesheet" href="/lsc-v10-capacity.css">
<link rel="stylesheet" href="/lsc-v10-brief.css">

<script src="/lsc-v10-core.js"></script>
<script src="/lsc-v10-ui.js"></script>
<script src="/lsc-v10-capacity.js"></script>
<script src="/lsc-v10-capacity-ui.js"></script>
<script src="/lsc-v10-brief.js"></script>
```

Required ordering:

1. existing `app1.js`, `app2.js`, `app3.js`
2. existing `lsc-intelligence.js`
3. existing `lsc-v8.js`
4. existing `manager-intelligence.js`
5. existing `lsc-command-v9.js`
6. `lsc-v10-core.js`
7. `lsc-v10-ui.js`
8. `lsc-v10-capacity.js`
9. `lsc-v10-capacity-ui.js`
10. `lsc-v10-brief.js`

The old monolithic V10 prototype was removed after the safer modular rewrite.

## V10 data contract

V10 never reallocates generic shift production into a process. Existing `current.production[]` remains the shift-level source of truth.

Process-level Good Actual is supplemental and is stored in:

`current.processProduction[]`

Each process-production record includes run identity, plant shift context, schedule version, work date, Chicago plant-hour timestamp, source, and evidence note.

Scrap/Rework stays in the existing quality-event workflow. V10 does not add process-production scrap/rework into quality totals, preventing double counting.

Missing `good` values remain missing. `null` and blank values must never be coerced to zero. A real numeric zero remains a valid known zero when it has evidence that the hour was actually recorded.

## Calendar / operating-day contract

Plant timezone: `America/Chicago`.

Plant operating day: 07:00 through 06:59:59 the next calendar day.

A post-midnight event can reconstruct into the prior production day when any of these prove ownership:

- `operatingDate`
- `plantShiftWorkDate`
- `processScheduleWorkDate`

Detached process schedule identity remains authoritative when a `processScheduleInstanceId` exists.

## Rate / capacity intelligence contract

The company target is compared against demonstrated production evidence. The engine returns only:

- `HOLD`
- `INVESTIGATE`
- `TRIAL HIGHER RATE`

A higher-rate trial is blocked unless all three plant shifts satisfy the evidence gate. Each shift must have at least two qualifying completed shift samples and at least six trustworthy hourly production records in the 30-day window.

A completed shift does not qualify unless it contains at least three trustworthy hourly records. Null/blank Actual is excluded. Legacy/default zero rows with no `updatedAt` evidence are excluded. A deliberate zero with a recorded timestamp remains valid evidence.

The controlled higher-rate path also requires:

- all three shifts to have established evidence
- the weakest shift to remain at or above 90% median attainment
- cross-shift rate spread below the investigation threshold
- the weakest shift's demonstrated median rate to clear the current company rate by at least 5%

The engine never changes the company target automatically. A `TRIAL HIGHER RATE` result is advisory and provides a conservative trial rate only.

Loss decomposition remains deterministic and evidence-linked:

- downtime loss
- quality loss
- remaining rate loss
- 4M downtime Pareto
- weak-shift identification
- incident / action / verification drill-through

## V10 operating brief contract

The V10 Operating Brief is deterministic. It composes the existing manager evidence, V10 process-run/hourly evidence and the V10 rate/capacity decision into this fixed management structure:

1. STATUS
2. WHAT HAPPENED
3. WHAT CHANGED
4. WHAT REPEATED
5. WHAT WORKED
6. OPPORTUNITY
7. RESPONSE
8. MANAGEMENT ATTENTION
9. PROOF

The brief must explicitly surface evidence gaps. Missing current Actual must be described as missing and must never appear as zero. A `HOLD / BUILDING` capacity result must tell management to close production evidence gaps before judging capacity. A `TRIAL HIGHER RATE` result remains advisory and cannot modify configuration.

## Current real-data behavior at recovery

The recovered archive does **not** currently contain enough trustworthy cross-shift production evidence to justify a rate increase.

Observed 30-day archive state at recovery:

- legacy First Shift record contains untouched zero rows without `updatedAt` evidence — excluded
- archived Third Shift has only two trustworthy hourly Actual entries — below the qualifying-shift minimum
- newer First Shift record has missing (`null`) Actual — excluded
- active Second Shift had missing (`null`) Actual at the recovery check and is incomplete

Therefore the intended current V10 rate/capacity state is `HOLD / BUILDING`. This is a data-quality safeguard, not a negative performance judgment.

## Acceptance tests

Run from `live-shift-command-beta/continuation-v10`:

```bash
node tests/v10-core-acceptance.js
node tests/v10-capacity-acceptance.js
node tests/v10-brief-acceptance.js
```

Core acceptance verifies:

- null/blank Actual remains missing
- real zero remains a known zero
- Chicago plant-time conversion
- 2:00 AM maps into the prior operating day
- post-midnight Third Shift evidence reconstructs correctly
- detached Opal Assembly Night keeps its run identity
- explicit process Actual is counted only as process Actual
- supplemental process-production fields do not double-count quality totals
- downtime is attached to the correct process/run

Capacity acceptance verifies:

- strong repeated evidence across all three shifts can produce `TRIAL HIGHER RATE`
- a materially weak shift produces `INVESTIGATE`
- incomplete evidence produces `HOLD / BUILDING`
- null production does not qualify
- untouched default zero rows do not qualify

Brief acceptance verifies:

- all nine management sections are present and ordered correctly
- `HOLD / BUILDING` is carried into Opportunity
- missing Actual appears in Management Attention and Proof
- process-run evidence appears in What Happened

## Production safety gate

Do not replace the current production deployment until all of the following are true:

- V10 core syntax passes
- V10 UI syntax passes
- V10 capacity engine/UI syntax passes
- V10 brief syntax passes
- all V10 acceptance tests pass
- recovered V8/V9 assets are present in the deployment workspace
- manager page boots with no console exception
- V9 Live Now still renders
- V9 Calendar Memory still opens
- V10 Day Reconstruction opens today and an archived date
- Process Actual can be saved without changing shift Actual
- existing Scrap/Rework workflow still behaves unchanged
- Rate Opportunity renders `HOLD / BUILDING` on the current sparse archive rather than inventing capacity
- V10 Operating Brief reflects the same capacity decision and evidence gaps
- rate/capacity decisions never write to `config.mesRate` or `shiftGoal`
- Shift Roster repository remains untouched

Production should be promoted only from a recovered copy of the current CLI/prebuilt manager deployment, never from stale GitHub `main`.
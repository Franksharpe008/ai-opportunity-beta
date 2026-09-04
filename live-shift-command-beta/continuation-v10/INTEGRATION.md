# Live Shift Command V10 — Integration Gate

## Source of truth

Production is currently a Vercel CLI/prebuilt deployment and is newer than GitHub `main`. Do not deploy `main` over production.

Protected work lives on:

`live-shift-command-v10-recovery`

## V10 production load order

V10 is additive to the recovered V8/V9 manager build. When integrating into the recovered deployment workspace, load these after the existing V9 assets:

```html
<link rel="stylesheet" href="/lsc-command-v10.css">
<script src="/lsc-v10-core.js"></script>
<script src="/lsc-v10-ui.js"></script>
```

Required ordering:

1. existing `app1.js`, `app2.js`, `app3.js`
2. existing `lsc-intelligence.js`
3. existing `lsc-v8.js`
4. existing `manager-intelligence.js`
5. existing `lsc-command-v9.js`
6. `lsc-v10-core.js`
7. `lsc-v10-ui.js`

The old monolithic V10 prototype was removed from the branch after the safer modular rewrite.

## V10 data contract

V10 never reallocates generic shift production into a process. Existing `current.production[]` remains the shift-level source of truth.

Process-level Good Actual is supplemental and is stored in:

`current.processProduction[]`

Each process-production record includes run identity, plant shift context, schedule version, work date, plant-hour timestamp, source, and evidence note.

Scrap/Rework stays in the existing quality-event workflow. V10 does not add processProduction scrap/rework to quality totals, preventing double counting.

Missing `good` values remain missing. `null` and blank values must never be coerced to zero. A real numeric zero remains a valid known zero.

## Calendar / operating-day contract

Plant timezone: `America/Chicago`.

Plant operating day: 07:00 through 06:59:59 the next calendar day.

A post-midnight event can reconstruct into the prior production day when any of these prove ownership:

- `operatingDate`
- `plantShiftWorkDate`
- `processScheduleWorkDate`

Detached process schedule identity remains authoritative when a `processScheduleInstanceId` exists.

## Acceptance test

Run from `live-shift-command-beta/continuation-v10`:

```bash
node tests/v10-core-acceptance.js
```

The test verifies:

- null/blank Actual remains missing
- real zero remains a known zero
- Chicago plant-time conversion
- 2:00 AM maps into the prior operating day
- post-midnight Third Shift evidence reconstructs correctly
- detached Opal Assembly Night keeps its run identity
- explicit process Actual is counted only as process Actual
- supplemental process-production quality fields do not double-count quality totals
- downtime is attached to the correct process/run

## Production safety gate

Do not replace the current production deployment until all of the following are true:

- V10 core syntax passes
- V10 UI syntax passes
- acceptance test passes
- recovered V8/V9 assets are present in the deployment workspace
- manager page boots with no console exception
- V9 Live Now still renders
- V9 Calendar Memory still opens
- V10 Day Reconstruction opens today and an archived date
- Process Actual can be saved without changing shift Actual
- existing Scrap/Rework workflow still behaves unchanged
- Shift Roster repository remains untouched

Production should be promoted only from a recovered copy of the current CLI/prebuilt manager deployment, never from stale GitHub `main`.
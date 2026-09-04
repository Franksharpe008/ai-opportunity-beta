# Live Shift Command — V10 Continuation Status

Checkpoint date: 2026-09-03 / 2026-09-04 America/Chicago

## Repository safety

- Repository: `Franksharpe008/ai-opportunity-beta`
- Working branch: `live-shift-command-v10-recovery`
- Base: `main`
- Branch comparison at checkpoint: 20 commits ahead, 0 behind
- All V10 changes are additive under `live-shift-command-beta/continuation-v10/`
- No existing V7/V8/V9 source file was overwritten by this continuation
- Shift Roster was not modified
- Production Vercel deployment was not replaced

## Recovered production baseline

The real production manager application is newer than GitHub `main` and is deployed from a Vercel CLI/prebuilt bundle. Recovery baseline:

- `https://live-shift-command-v74.vercel.app`
- deployment `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`

Production V9 behavior remains the protected behavioral baseline.

## Implemented in V10

### Calendar-first process evidence

- Chicago plant-time handling
- 07:00 → 06:59:59 operating-day reconstruction
- post-midnight Third Shift attribution
- detached process-schedule run identity
- Calendar Day Reconstruction
- shift → process run → hour → evidence drilldown
- supplemental process-level Good Actual
- generic shift Actual is never redistributed into processes
- null / blank Actual remains missing instead of becoming zero
- Scrap / Rework remains in the established quality workflow to prevent double counting

### Live process context

- Current area / process-run strip inside Live Now
- active stop and quality context by area
- manual Process Actual capture with Chicago plant-hour timestamp and evidence note
- process-run snapshot exposed for manager/coprocessor context

### Rate / capacity intelligence

Deterministic 30-day decision engine with only three outputs:

- HOLD
- INVESTIGATE
- TRIAL HIGHER RATE

The engine compares company target against demonstrated performance across all three shifts and blocks a higher-rate recommendation until all three shifts meet the evidence gate.

It includes:

- trustworthy hourly production filtering
- weak-shift identification
- demonstrated median rate by shift
- cross-shift spread check
- target attainment gate
- downtime / quality / remaining rate loss decomposition
- 4M Pareto
- incident/action/verification drill-through
- controlled trial-rate suggestion when evidence is established
- no automatic writes to company rate or shift goal

### V10 Operating Brief

Deterministic manager brief structure:

1. STATUS
2. WHAT HAPPENED
3. WHAT CHANGED
4. WHAT REPEATED
5. WHAT WORKED
6. OPPORTUNITY
7. RESPONSE
8. MANAGEMENT ATTENTION
9. PROOF

The brief combines V9 manager evidence, V10 process-run evidence, and the V10 capacity decision while explicitly surfacing missing production data.

## Current real archive interpretation

At this checkpoint, the production archive does not contain enough trustworthy cross-shift hourly Actual evidence to support a higher-rate trial.

The correct current decision is:

`HOLD / BUILDING`

Reason: legacy untouched zero rows are excluded, one archived Third Shift sample has only two trustworthy Actual hours, newer First Shift Actual is missing, and the active Second Shift was incomplete with missing Actual when checked.

This is an evidence-quality guardrail, not a negative shift-performance judgment.

## Acceptance assets

- `tests/v10-core-acceptance.js`
- `tests/v10-capacity-acceptance.js`
- `tests/v10-brief-acceptance.js`
- `tests/run-v10-acceptance.js`

Single-command gate:

```bash
node tests/run-v10-acceptance.js
```

## Remaining production gate

V10 is not promoted over the current production URL until a recovered copy of the current CLI/prebuilt deployment workspace is available for preview integration.

Preview must verify:

- all existing V9 features still boot and operate
- V10 assets load after V9 in the documented order
- Calendar Day Reconstruction works on live and archived dates
- Process Actual saves without changing shift Actual
- `processProduction[]` survives End Shift server-side archival and reconstructs from Calendar Memory
- Scrap / Rework stays single-counted
- Rate Opportunity shows HOLD / BUILDING on current sparse data
- V10 Operating Brief matches the same evidence and decision
- no V10 capacity path writes to `config.mesRate` or `shiftGoal`

Do not deploy stale GitHub `main` over the current production manager application.
# LIVE SHIFT COMMAND — CONTINUE HERE FIRST

> This file is the continuity contract for future chats and implementation sessions.
> Do **not** ask Frank to retrain the project from scratch. Read this file, inspect the current branch/deployments, then continue from the exact next step.

## Current version direction

**V9 becomes V10.**

Do not treat V10 as a separate sidecar product. The working V9 workflow is the foundation of the V10 release. V10 must preserve the simple UI and all working V9 behavior while adding the new shared process-run/hourly evidence model and manager intelligence.

## Repository / branch

- Repo: `Franksharpe008/ai-opportunity-beta`
- Active implementation branch: `live-shift-command-v10-recovery`
- Never deploy stale `main` over the live apps.
- Commit continuously as implementation progresses.

## Current live deployments

### Manager web
- Project: `live-shift-command-v74`
- URL: `https://live-shift-command-v74.vercel.app`
- Existing V9 behavior is the functional base being evolved into V10.

### Mobile operator cockpit
- Project: `live-shift-command-v741-mobile`
- URL: `https://live-shift-command-v741-mobile.vercel.app`
- Existing V9 mobile behavior is the functional base being evolved into V10.

### Shift Roster
- Separate project/repository surface.
- **Do not modify Shift Roster during this phase.**

## V9 capabilities that V10 must retain

- Live Now manager view
- Shared manager/mobile state
- three-shift hot memory / 24-hour continuity
- permanent Calendar Memory
- plant operating day 07:00 → 06:59:59 America/Chicago
- correct Third Shift cross-midnight attribution
- effective-dated plant shift schedules
- detached process schedules, especially Opal Assembly Day / Night
- schedule context stamped onto events
- cause / 4M separated from originating function
- recovery ownership separated from cause/origin
- hybrid / multi-team responders
- response timestamps and recovery stages
- scrap / rework quality evidence
- Shift Recall
- previous-shift continuity
- immediate End Shift archive behavior
- evidence-first manager intelligence
- meeting / operating brief workflow
- existing downtime code dictionaries
- mobile floor workflow and simple UI
- web manager workflow and simple UI

## V10 additions being integrated into the same workflow

### Shared web + mobile data model
- `processProduction[]` on the shift record
- process/run identity
- plant shift context
- schedule version context
- operating/work date
- Chicago plant-hour timestamp
- evidence note/source
- missing Actual remains missing, never silently becomes zero
- generic shift Actual is never redistributed into process Actual
- Scrap / Rework remains in the existing quality workflow so it is not double counted

### Mobile V10 responsibilities
Keep the phone simple and floor-focused:
- show current process/run context
- capture process-level Good Actual
- downtime / quality / evidence workflow stays intact
- responders / verification stay intact
- Shift Recall / continuity stays intact
- mobile events update the same shared state the web reads
- mobile does **not** get the full plant-wide capacity dashboard
- mobile does **not** get authority to change manager configuration/rules

### Manager web V10 responsibilities
- Calendar Day Reconstruction
- shift → process run → hour → evidence
- process Actual visibility
- cross-shift demonstrated rate comparison
- weak-shift identification
- downtime / quality / remaining rate loss decomposition
- 4M Pareto, with optional 6M extension when useful
- drilldown: rate opportunity → shift comparison → loss/4M Pareto → incidents/evidence/actions/verification
- capacity decision states: `HOLD`, `INVESTIGATE`, `TRIAL HIGHER RATE`
- higher-rate recommendation requires trustworthy evidence across all three shifts
- no automatic write to company target/rate

## Manager Operating Brief structure

Always preserve this order:

1. STATUS
2. WHAT HAPPENED
3. WHAT CHANGED
4. WHAT REPEATED
5. WHAT WORKED
6. OPPORTUNITY
7. RESPONSE
8. MANAGEMENT ATTENTION
9. PROOF

## AI contract

- cloud / edge only
- advisory only
- never delegate deterministic shift math to AI
- never let AI directly change production state, schedules, company goal or rate
- retrieve authoritative downtime codes from state/config
- classify informal plant language and downtime codes
- support negation
- structured extraction / JSON
- summarize recurrence and maintenance actions
- distinguish temporary recovery from verified resolution
- insufficient-evidence handling
- confidence calibration
- human approval before consequential operational changes
- Cloudflare Workers AI connectivity was already verified with `@cf/qwen/qwen3.8-27b`; full Live Shift integration/acceptance remains to be completed

## Current V10 implementation assets

Under `live-shift-command-beta/continuation-v10/`:
- `lsc-v10-core.js`
- `lsc-v10-ui.js`
- `lsc-v10-capacity.js`
- `lsc-v10-capacity-ui.js`
- `lsc-v10-brief.js`
- V10 CSS files
- acceptance tests
- `STATUS.md`
- `INTEGRATION.md`

These are implementation pieces to be merged into the actual V10 release built from the live V9 web/mobile source.

## Current real-data capacity interpretation

At the last verified archive check the correct state was:

`HOLD / BUILDING`

Reason: not enough trustworthy cross-shift hourly Actual exists yet. Legacy untouched zero rows and missing Actual are intentionally excluded. This is an evidence-quality guardrail, not a negative performance judgment.

## Exact continuation step

**Build the actual V10 release from the live V9 manager + mobile deployments.**

1. Recover the current live V9 web and mobile assets.
2. Change the release schema/version to V10 while preserving backward-compatible state.
3. Merge V9 schedule/accountability/memory behavior and V10 shared process-run/hourly logic into the actual V10 command layer.
4. Wire the simple mobile process/run context + Process Actual capture into the existing mobile cockpit.
5. Wire Calendar Reconstruction + capacity intelligence + Operating Brief into the existing manager web UI.
6. Verify manager configuration still propagates through shared state and mobile cannot edit manager-only configuration.
7. Verify mobile events and Process Actual propagate back to web.
8. Verify `processProduction[]` survives End Shift → server archive → Calendar reconstruction.
9. Run all V10 acceptance tests and regression-check V9 behaviors.
10. Create a preview deployment first; only promote when the complete integrated V10 passes.

## Non-negotiable rules

- No clean-slate rewrite.
- No fake simulation data/language.
- No invented Actual.
- No silent null→zero conversion.
- No duplicated Scrap/Rework totals.
- Do not simplify by deleting working intelligence.
- Keep UI simple even as intelligence grows.
- One source of truth between mobile and web.
- Manager rules flow down; floor evidence flows up.
- Shift Roster stays untouched until the later integration phase.
- Every meaningful implementation checkpoint gets committed and this file gets updated before a long chat ends.
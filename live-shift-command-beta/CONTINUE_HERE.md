# LIVE SHIFT COMMAND — CONTINUE HERE FIRST

> This is the continuity contract. Do **not** ask Frank to retrain the project. Read this file, inspect the branch and live deployments, then continue from the exact next step.

## Direction

**V9 becomes V10.** V9 is the working foundation, not a frozen sidecar. Preserve its production behavior while extending the same shared architecture.

Repo: `Franksharpe008/ai-opportunity-beta`
Branch: `live-shift-command-v10-recovery`
Draft PR: `#1`
Never deploy stale `main` over the live CLI/prebuilt apps.

## Live / beta surfaces

### Existing manager production / rollback point
- `https://live-shift-command-v74.vercel.app`
- project `live-shift-command-v74`
- V9 functional baseline

### Existing mobile production / rollback point
- `https://live-shift-command-v741-mobile.vercel.app`
- project `live-shift-command-v741-mobile`
- V9 functional baseline

### V10 mobile beta — LIVE
- `https://live-shift-command-v10-mobile-beta.vercel.app`
- project `live-shift-command-v10-mobile-beta`
- first deployment `dpl_Eeda7oAZGMRFWou2Qrz1fgA8vfFn`
- exact existing mobile V8/V9 assets + recovery-branch V10 modules
- server-side proxies `/api/state`, `/api/archive`, `/api/intelligence` to existing shared services
- reads/writes real shared plant state; not a mock
- smoke verified: READY, root 200, state proxy 200, V10 floor-ops asset 200 JS, no Vercel runtime errors

### V10 manager beta — LIVE
- `https://live-shift-command-v10-manager-beta.vercel.app`
- project `live-shift-command-v10-manager-beta`
- first deployment `dpl_42aMBsxieiSuGg7ABYCe1P25fX9J`
- exact existing manager V8/V9 assets + recovery-branch V10 manager modules
- proxies the same shared `/api/state`, `/api/archive`, `/api/intelligence`
- smoke verified: READY, root 200, state proxy 200 at same revision, no Vercel runtime errors

The two V10 betas are deliberately separate from the old production URLs so production remains an immediate rollback point.

## Shared plant truth

Timezone: `America/Chicago`
Operating day: 07:00 → 06:59:59 next calendar day
Plant shifts:
- First 07:00–15:00
- Second 15:00–23:00
- Third 23:00–07:00

Detached process schedules include:
- Opal Assembly Day 07:00–15:40
- Opal Assembly Night 19:00–03:40

A process run may cross a plant-shift boundary. The run remains continuous while every event/hour keeps the plant-shift accountability that owned that moment.

## V9 behavior V10 must preserve

- shared manager/mobile `/api/state`
- Live Now
- three-shift hot memory
- permanent Calendar Memory/archive
- effective-dated schedules
- Third Shift cross-midnight attribution
- detached process schedule identity
- all downtime codes
- 4M cause model
- originating function / recovery ownership separation
- multi-team responders and timing
- voice/photo/type evidence
- existing `/api/intelligence` classify/enrich/vision/quality/copilot/transcribe path
- Scrap/Rework quality workflow
- Resolve + Verify
- Shift Recall / prior-shift continuity
- End Shift archive
- manager operating intelligence

## V10 data / floor additions now implemented

### `processProduction[]`
Supplemental process/run/hour evidence. Generic shift Actual is never redistributed into it. Missing Actual remains missing. Same process/run/hour is upserted with correction history instead of double-counted.

### Time Truth
Floor layer: `continuation-v10/lsc-v10-floor-ops.js`

Downtime supports:
- Started Now
- Started Earlier
- Correct Start Time
- Restored Now through existing V8 Resolve + Verify
- Restored Earlier, then existing Resolve + Verify

Stored/audited fields include as applicable:
- `startedAt` / `occurredAt`
- `endedAt` / `restoredAt`
- `recordedAt` / `reportedAt`
- `closedRecordedAt`
- `timeSource.start/end`
- `retroactive.start/end`
- process-run / plant-shift / schedule context based on actual event time

Event duration is based on actual equipment stop/restoration time, not when the supervisor opened the app.

### Change attribution
Do not clutter floor UI with user identity yet.

Beta mutations write hidden actor metadata using plant shift:
- First Shift
- Second Shift
- Third Shift

Shape:
`{ mode:'shift_beta', shift:'Third Shift', actorId:'third_shift', userId:null }`

Events/process records can carry `changedBy`, `changedAt`, `audit[]`; current shift carries hidden audit history. Later authentication can populate person/user ID without replacing this schema.

### Hour Truth
Mobile has **VERIFY LAST HOUR** for the selected process.

Verified hourly record includes:
- process/run/hour
- hourly goal
- Good Actual
- Scrap
- Rework
- linked downtime events overlapping that hour
- verified status/time
- beta shift actor
- correction history

`current.hourVerification[]` is also written.

Hourly Scrap/Rework is production accounting evidence only. Existing quality events remain authoritative for defect/root-cause/containment intelligence so quality is not double-counted.

### Multi-line mobile navigation
Mobile Process / Run card lets the supervisor move among:
- Opal Lamination
- Opal Edge Wrap
- Opal Assembly
- Wetline
- E41
- Injection Molding

Selecting a line does **not** change plant shift. Each line shows run identity, DOWN/RUN/DETACHED status, line downtime/manage, Process Actual, Verify Last Hour, and AI Command.

Detached Opal Assembly Night remains one continuous process run while Second/Third ownership is stamped by event/hour time.

### Manager-controlled Company Goal
Mobile removes goal editing. `state.config.shiftGoal` is authoritative on the mobile KPI and Start Shift form. Historical shift objects are not silently rewritten just for display.

At the latest smoke check config Company Goal was `400`, while the already-active Third Shift record had a stale legacy `shiftGoal:265` from the old workflow. V10 displays 400 from manager config.

## Bounded AI operational control

The old broad rule “AI never changes production state” is superseded by this precise contract:

**AI may execute bounded operational evidence mutations when an authorized supervisor gives an explicit instruction and deterministic V10 validates the mutation.**

AI interprets language. Deterministic code owns plant time, operating day, plant shift, process run, schedule version, duration, record key/upsert, audit attribution, and validation.

Current executable commands:
- record/backdate downtime
- restore/backdate downtime end
- verify completed process hour Good/Scrap/Rework

Examples:
- “Wetline stopped at 1:17 and was back up at 1:46. RB08.”
- “Wetline did 29 good last hour, one scrap and two rework.”

If a downtime code is omitted, reuse existing `/api/intelligence` classify. Voice command reuses existing transcribe. No second AI provider.

The UI shows the interpreted operation before `EXECUTE VERIFIED COMMAND`.

AI still cannot autonomously change:
- company goal/rate
- schedules/effective schedule versions
- authority roles
- permanent archive deletion
- capacity recommendation into configuration

## Manager V10

Implemented on branch and loaded in manager beta:
- Calendar Day Reconstruction
- shift → process run → hour → evidence
- process Actual
- cross-shift rate/capacity intelligence
- weak-shift detection
- downtime / quality / rate loss
- 4M Pareto + optional manager-only Measurement/Environment refinement
- opportunity → shift → loss/Pareto → incident/action/verification drilldown
- `HOLD`, `INVESTIGATE`, `TRIAL HIGHER RATE`
- existing Morning Meeting Brief upgraded in place

Brief order remains:
STATUS → WHAT HAPPENED → WHAT CHANGED → WHAT REPEATED → WHAT WORKED → OPPORTUNITY → RESPONSE → MANAGEMENT ATTENTION → PROOF.

## Current real data / capacity

Correct capacity interpretation remains `HOLD / BUILDING` because trustworthy cross-shift hourly Actual is sparse. Untouched legacy zero rows and missing Actual are excluded.

At both beta smoke checks shared state was revision `96`, schema still `live-shift-command/v7.9`. Merely opening V10 does not migrate/write state. A confirmed V10 mutation performs the schema upgrade.

## Tests / release safety

GitHub Actions `Live Shift V10 Acceptance` covers:
- syntax for all V10 modules
- core process/run behavior
- capacity decisions
- operating brief
- non-overlap/authority contract
- floor-ops retro start/end + hourly verification + Third Shift audit
- idempotent V10 release builder
- guard against manager intelligence writing rate/goal

**Latest code run #76 passed on head `fe8fd90723667b7865dde6760813303e488a809a`.**

## Exact next step

1. Frank/Emilio smoke the V10 mobile beta on an actual phone without inventing plant data.
2. Frank can inspect the manager beta simultaneously.
3. On the next real downtime/hour, prove end-to-end: actual/retro time or verified hour → shared state V10 mutation → hidden shift audit → manager V10 reconstruction.
4. Verify Process Actual / verified hour appears in manager Day Reconstruction and manager intelligence.
5. On a real completed V10 shift, prove `processProduction[]`, `hourVerification[]`, and audit fields survive End Shift → permanent archive → Calendar reconstruction.
6. Fix any real floor UX issues found by Frank/Emilio.
7. Only then coordinate production promotion, keeping old manager/mobile deployments available for immediate rollback.

## Non-negotiables

- No clean-slate rewrite.
- No fake plant data to populate dashboards.
- No silent null→zero.
- No double-counted quality.
- No duplicate downtime/AI/provider/config systems.
- Manager rules flow down; floor evidence flows up.
- Keep mobile simple even as ledger intelligence grows.
- Shift Roster stays separate and untouched.
- Update this handoff at every meaningful checkpoint.
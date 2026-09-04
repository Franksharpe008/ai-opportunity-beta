# LIVE SHIFT COMMAND — CONTINUE HERE FIRST

> This is the continuity contract. Do **not** ask Frank to retrain the project. Read this file, inspect the branch and live deployments, then continue from the exact next step.

## Direction

**V9 becomes V10.** V9 is the working foundation, not a frozen sidecar. Preserve its production behavior while extending the same shared architecture.

Repo: `Franksharpe008/ai-opportunity-beta`
Branch: `live-shift-command-v10-recovery`
Draft PR: `#1`
Never deploy stale `main` over the live CLI/prebuilt apps.

## Live / beta surfaces

### Existing manager production
- `https://live-shift-command-v74.vercel.app`
- project `live-shift-command-v74`
- V9 functional baseline

### Existing mobile production / rollback point
- `https://live-shift-command-v741-mobile.vercel.app`
- project `live-shift-command-v741-mobile`
- current V9 functional baseline

### V10 mobile beta — LIVE
- `https://live-shift-command-v10-mobile-beta.vercel.app`
- project `live-shift-command-v10-mobile-beta`
- first deployment `dpl_Eeda7oAZGMRFWou2Qrz1fgA8vfFn`
- uses the exact existing mobile V8/V9 assets plus the recovery-branch V10 modules
- server-side proxies `/api/state`, `/api/archive`, `/api/intelligence` to the existing shared production services
- therefore this beta reads/writes the real shared plant state; it is not a mock
- original mobile production URL remains untouched as rollback
- smoke verified: deployment READY, root 200, state proxy 200, V10 floor-ops asset 200 JS, no Vercel runtime errors

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
New floor layer: `continuation-v10/lsc-v10-floor-ops.js`

Downtime now supports actual-vs-recorded time:
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
- process-run / plant-shift / schedule context based on the actual event time

The event duration is based on actual equipment stop/restoration time, not when the supervisor happened to open the app.

### Change attribution
Do not clutter the floor UI with user identity yet.

Beta mutations write hidden audit metadata using plant shift as actor:
- `First Shift`
- `Second Shift`
- `Third Shift`

Shape:
`{ mode:'shift_beta', shift:'Third Shift', actorId:'third_shift', userId:null }`

Events/process records can carry `changedBy`, `changedAt`, `audit[]`; current shift carries hidden audit history. Later authenticated users can fill `userId` / person identity without changing historical schema.

### Hour Truth
Mobile now has **VERIFY LAST HOUR** for the selected process.

Verified hourly record includes:
- process/run/hour
- hourly goal
- Good Actual
- Scrap
- Rework
- linked downtime events overlapping that hour
- `verified:true`
- verification timestamp
- shift-level beta actor
- correction history

`current.hourVerification[]` is also written.

Hourly Scrap/Rework is production accounting evidence only. Existing quality events remain authoritative for defect/root-cause/containment intelligence so quality is not double-counted.

### Multi-line mobile navigation
Mobile Process / Run card now lets the supervisor move among:
- Opal Lamination
- Opal Edge Wrap
- Opal Assembly
- Wetline
- E41
- Injection Molding

Selecting a line does **not** change plant shift. Each selected line shows its run identity, DOWN/RUN/DETACHED status, line downtime/manage action, Process Actual, Verify Last Hour, and AI Command.

Detached Opal Assembly Night remains one continuous process run while Second/Third ownership is stamped by event/hour time.

### Manager-controlled Company Goal
Mobile removes goal editing. Manager config is authoritative. The beta mobile KPI/start form displays `state.config.shiftGoal` even if an older active shift record contains a stale legacy shiftGoal. Historical raw shift values are not silently rewritten.

## Bounded AI operational control

The prior rule “AI never directly changes production state” is superseded by this more precise contract:

**AI may execute bounded operational evidence mutations only when an authorized supervisor gives an explicit instruction and the deterministic V10 command layer validates the mutation.**

AI interprets language. Deterministic code owns:
- plant time conversion
- operating day
- plant shift
- process run
- schedule version
- duration
- record key/upsert behavior
- audit attribution
- validation

Current executable commands include:
- record/backdate downtime
- restore/backdate downtime end
- verify completed process hour Good/Scrap/Rework

Examples:
- “Wetline stopped at 1:17 and was back up at 1:46. RB08.”
- “Wetline did 29 good last hour, one scrap and two rework.”

If a downtime code is omitted, the existing `/api/intelligence` classify task is reused. Voice command uses the existing transcribe task. No second AI provider exists.

The UI shows the interpreted command before `EXECUTE VERIFIED COMMAND`.

AI still cannot autonomously change:
- company goal/rate
- schedules/effective schedule versions
- authority roles
- permanent archive deletion
- capacity recommendation into configuration

## Manager V10

Manager additions already implemented on branch:
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

At last verified check the correct capacity state is `HOLD / BUILDING` because cross-shift trustworthy hourly Actual is still sparse. Untouched legacy zero rows and missing Actual are excluded.

At the V10 mobile beta smoke check, shared state was revision `96`, schema still `live-shift-command/v7.9` because simply opening V10 does not migrate/write state. A confirmed V10 operational mutation performs the schema upgrade.

Config Company Goal is `400`; the current Third Shift record was previously created with legacy `shiftGoal:265`. V10 mobile displays manager config 400 and does not rewrite historical raw records just for display.

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

Run #74 on head `c69d620f8fc4ff0115cd40606604719de34561d1` passed every step before the manager-goal display-only patch; rerun CI after any subsequent branch update.

## Exact next step

1. Re-run acceptance on latest head.
2. Open V10 mobile beta on an actual phone and smoke the UI without fabricating plant data.
3. Use a real event/hour when available to prove: retrofit start/end → shared state → hidden shift audit → manager reconstruction.
4. Stand up manager V10 beta against the same shared APIs, keeping manager production untouched.
5. Verify mobile Process Actual / verified hour appears in manager Day Reconstruction and capacity context.
6. On a real completed V10 shift, prove `processProduction[]` and audit fields survive End Shift → permanent archive → Calendar reconstruction.
7. Only then coordinate production promotion. Keep old mobile/manager deployments available for immediate rollback.

## Non-negotiables

- No clean-slate rewrite.
- No fake plant data just to make dashboards look populated.
- No silent null→zero.
- No double-counted quality.
- No duplicate downtime/AI/provider/config systems.
- Manager rules flow down; floor evidence flows up.
- Keep mobile simple even as ledger intelligence grows.
- Shift Roster stays separate and untouched.
- Update this handoff at every meaningful checkpoint.
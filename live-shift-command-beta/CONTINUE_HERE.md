# LIVE SHIFT COMMAND — CONTINUE HERE FIRST

> Canonical current-state handoff. Read this before changing Live Shift Command. Do not ask Frank to retrain the project from scratch.

## Mandatory continuity protocol
Every meaningful modification must update this file **and** append `live-shift-command-beta/BUILD_HANDOFF_LOG.md`. `.github/workflows/live-shift-handoff-guard.yml` enforces this.

# CURRENT PRODUCT TRUTH — 2026-09-04

**V8 → V9 → V10 is one evolving application.** No parallel beta product, no clean-slate rewrite, no replacement state/archive/AI stack.

Repo: `Franksharpe008/ai-opportunity-beta`
Branch: `live-shift-command-v10-recovery`
Draft PR: `#1`

## Only production surfaces
Manager:
- `https://live-shift-command-v74.vercel.app`
- project ID `prj_ETPejWyItkL7iE586cO4CbGlZWk6`
- production before hourly-performance promotion: `dpl_HZiAhAaH1uSG8b5f7nCMu2ZCJ54g`
- pre-V10 rollback: `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`

Mobile:
- `https://live-shift-command-v741-mobile.vercel.app`
- project ID `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`
- production before hourly-performance promotion: `dpl_moo8RzN8KEZoNK82CnwXEbMgpJ7D`
- pre-V10 rollback: `dpl_GsxQqw4seGRvtXqE1uupksyUKba9`

Deprecated side projects are smoke-test scaffolding only.

## Last verified production health
- manager/mobile `/api/state` 200 and same ledger, last verified revision 98
- manager/mobile `/api/archive` 200
- original `/api/intelligence` preserved; GET health probe returns expected 405 because production uses POST
- no state reset/data wipe
- manager no runtime failures in final recovery pass
- mobile no 401/403/5xx after archive repair

# ARCHITECTURE TO PRESERVE
Preserve V8/V9 shared state, Plant Memory/archive, original intelligence, voice/photo/type capture, classify/enrich/vision/quality/copilot/transcribe, usage accounting, downtime codes/lifecycle, responders/timing, quality workflow, containment/action/result/verification, Shift Recall, Live Now, Calendar Memory, schedules, Third Shift cross-midnight attribution, detached process runs, End Shift archive, manager intelligence, and current visual language.

Shared brain:
`Manager Web + Mobile Floor → same state/archive/intelligence → V10 adds process/hour truth and context.`

Manager rules flow down; floor evidence flows up.

# COMPANY GOAL AUTHORITY
Manager config is the only Company Goal authority. Last verified `state.config.shiftGoal=400`. A legacy active shift still has `current.shiftGoal=265`; do not rewrite raw history for display.

The 265↔400 bounce is caused by V9 mobile render painting the legacy shift value before V10 repaints config. `lsc-v10-hourly-performance.js` now wraps render and adds a DOM guard so the visible mobile goal remains manager config only. Mobile goal edit remains removed/read-only.

# ACTUAL / GOOD HOURLY PERFORMANCE
Implemented in commit `7d844deb648f488146ab1fe859d978edf897ff40`.

Files:
- `continuation-v10/lsc-v10-hourly-performance.js`
- `continuation-v10/lsc-v10-hourly-performance.css`

Behavior:
- existing Actual / Good KPI becomes tappable
- slick Hourly Performance sheet
- Company Goal, Actual, accrued target, progress/gap, Scrap/Rework
- eight hourly rows with goal/actual/%
- deterministic green >=100%, amber >=90%, red <90%; missing/future distinct
- current hour compares to time-adjusted expectation
- enter/correct Good Actual + Scrap total + Rework total + note per available hour
- writes existing `current.production[]`; no second backend/table
- future hours disabled; missing never becomes fake zero
- hourly Scrap/Rework are totals, not duplicate defect events
- structured quality workflow remains authoritative for root cause/evidence/verification
- corrections + hidden shift actor audit preserved

# AI WORLD / COST POLICY
Implemented in `continuation-v10/lsc-v10-ai-world.js` in commit `7d844deb648f488146ab1fe859d978edf897ff40`.

**Zero autonomous/background model calls. No hourly polling.**

Routine performance bands, gaps, recovery math, downtime overlap and status are deterministic/free. AI spends only when somebody deliberately uses existing Copilot/AI functionality.

When a deliberate Copilot request occurs, AI World attaches the current architecture snapshot: manager goal, current shift, hourly Actual/Good/Scrap/Rework, targets/status, deterministic recovery math, selected process/run, V10 process-run/hour evidence, active downtime, previous shift, handoff overlap codes; existing V8 Plant Memory/recurrence context remains intact.

This supports broad questions such as “How does the shift look?”, “Can we recover?”, “What is hurting us?”, and “Are yesterday’s handoff issues repeating?” without background neuron burn.

# CI STATUS
For commit `7d844deb648f488146ab1fe859d978edf897ff40`:
- Live Shift V10 Acceptance push run `33846668681` → PASS
- Live Shift Handoff Guard push run `33846668715` → PASS
- stale PR promotion run `33846670941` failed safely at missing Vercel credential before any deployment step; production was untouched

# DEPLOYMENT SAFETY — CURRENT
The obsolete `.github/workflows/promote-live-shift-v10.yml` is now intentionally manual-only and refuses deployment. It previously contained the protected-origin rewrite pattern that caused the archive problem and must never be used again.

Safe path:
- `.github/workflows/live-shift-v10-production.yml`
- `continuation-v10/tools/prepare-inplace-production.mjs`

Safe topology generated for deployment:
- current public V9/V10 shell is recovered, old V10 tags removed, current tested V10 assets injected locally
- protected V9 static assets remain behind `/api/base` with Vercel OIDC
- manager `/api/state`, `/api/archive`, `/api/intelligence` proxy to preserved original manager V9 backend with production OIDC
- mobile `/api/state`, `/api/archive`, `/api/intelligence` proxy to the **live manager authority**, not the protected old mobile backend
- manager deploys first; its state/archive health is checked before mobile deploys
- `.vercel/project.json` pins exact existing project IDs
- smoke test requires new AI World + hourly-performance assets, shared revision parity, archive health, and expected intelligence 405 GET behavior

# PLANT TRUTH
Timezone `America/Chicago`; operating day 07:00→06:59:59.
Shifts: First 07–15, Second 15–23, Third 23–07.
Detached Opal Assembly: Day 07:00–15:40; Night 19:00–03:40.

Truth model:
`Calendar Day → Plant Shift → Process Run → Hour → Production + Downtime + Quality + Response + Evidence + Verification`

# NEXT STEP
The next tagged deployment commit should run acceptance, build the safe exact-project payload, request Vercel device approval only if no repo token exists, deploy manager first then mobile, and smoke the regular URLs. After it completes, update both handoff files with the new deployment IDs and final verification.

Then use real plant data only to prove hourly write → shared state → manager reconstruction → End Shift archive → Calendar Memory. Do not create fake production data.

# NON-NEGOTIABLES
Same product/projects/URLs. No fake data. No null→zero. No double-count quality. Manager goal authoritative. AI explicit-use only. No duplicate providers/state/archive/config. Preserve rollback IDs. Shift Roster untouched. Verify regular URLs after deploy. Update both handoff files after every meaningful change.

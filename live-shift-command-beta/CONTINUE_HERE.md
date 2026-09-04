# LIVE SHIFT COMMAND — CONTINUE HERE FIRST

> Canonical current-state handoff. Read this before changing Live Shift Command. Do not ask Frank to retrain the project from scratch.

## Mandatory continuity protocol
Every meaningful modification must update this file **and** append `live-shift-command-beta/BUILD_HANDOFF_LOG.md`. `.github/workflows/live-shift-handoff-guard.yml` enforces this.

## Live approval workflow — binding
Any time-sensitive approval must be handled **live in the same session**.
1. Generate the approval only when Frank is present and the workflow is actually waiting for it.
2. Send the fresh link/code immediately.
3. Frank approves immediately.
4. Check approval status immediately after approval and continue the blocked action in the same live loop.
5. Never send approval codes speculatively and leave them sitting to expire.
6. If one expires, regenerate immediately and stay on that step until it succeeds.

# CURRENT PRODUCT TRUTH — 2026-09-04

**V8 → V9 → V10 is one evolving Live Shift Command application.** No parallel beta product, no clean-slate rewrite, no replacement state/archive/AI stack.

Repo: `Franksharpe008/ai-opportunity-beta`
Branch: `live-shift-command-v10-recovery`
Draft PR: `#1`
Current release commit: `32c428ffc39823273c794f9bdd068b2835920584`

## Production surfaces — these are the product
Manager:
- URL: `https://live-shift-command-v74.vercel.app`
- project ID: `prj_ETPejWyItkL7iE586cO4CbGlZWk6`
- current production deployment: `dpl_7BTWfSwY6rsLv5U1nc2TSaifcka2`
- previous working V10 rollback: `dpl_HZiAhAaH1uSG8b5f7nCMu2ZCJ54g`
- preserved pre-V10 rollback: `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`

Mobile:
- URL: `https://live-shift-command-v741-mobile.vercel.app`
- project ID: `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`
- current production deployment: `dpl_HAH4qUszWYVc3q2NtLWRf3n5RVUL`
- previous working V10 rollback: `dpl_moo8RzN8KEZoNK82CnwXEbMgpJ7D`
- preserved pre-V10 rollback: `dpl_GsxQqw4seGRvtXqE1uupksyUKba9`

Deprecated V10 side projects are smoke-test scaffolding only. Do not extend them.

## Production health verified after current promotion
- manager page 200 and V10 manager modules loaded after V8/V9
- mobile page 200 and V10 mobile modules loaded after V8/V9
- manager `/api/state` 200
- mobile `/api/state` 200
- same shared ledger revision `99`
- authoritative `state.config.shiftGoal = 400`
- raw active Third Shift still contains legacy `current.shiftGoal = 265`; do not rewrite raw history just for display
- mobile `/api/archive` 200 and returns same Plant Memory records
- `/api/intelligence` preserved; GET returns expected `405 method_not_allowed` because production intelligence uses POST
- manager: no runtime error/fatal logs in final pass
- mobile: no failed app requests; only non-fatal Node `DEP0169 url.parse()` deprecation warnings on `/api/base` 304 asset responses
- no state reset or data wipe occurred

# ARCHITECTURE TO PRESERVE
Preserve the accumulated V8/V9 foundation:
- one shared `/api/state`
- permanent `/api/archive` Plant Memory
- original `/api/intelligence`
- voice/photo/type capture
- classify/enrich/vision/quality/copilot/transcribe tasks
- AI usage accounting
- all downtime codes and lifecycle
- responder timing / response ownership
- Scrap/Rework structured quality workflow
- containment/action/result/verification history
- Shift Recall, Live Now, Calendar Memory
- effective-dated schedules
- Third Shift cross-midnight attribution
- detached process-run identity
- End Shift archive
- manager intelligence
- current visual language and simple mobile cockpit

Shared brain:
`Manager Web + Mobile Floor → same state/archive/intelligence → V10 adds process/hour truth and richer context.`

Manager rules/config flow down. Floor evidence flows up.

# COMPANY GOAL AUTHORITY
Manager config is the only Company Goal authority. Mobile cannot edit it.

The visible 265↔400 bounce came from V9 painting `current.shiftGoal=265` before V10 painted config 400. `lsc-v10-hourly-performance.js` now guards the visible goal so manager config remains the display authority without mutating the raw shift record.

# ACTUAL / GOOD HOURLY PERFORMANCE — LIVE
Files:
- `continuation-v10/lsc-v10-hourly-performance.js`
- `continuation-v10/lsc-v10-hourly-performance.css`

Behavior:
- existing Actual / Good KPI is tappable
- opens a slick Hourly Performance sheet
- Good Actual + Scrap total + Rework total + optional note can be entered/corrected per available hour
- writes existing `current.production[]`; no second production backend
- Company Goal, accrued target, progress/gap and hourly goal/actual/% shown
- deterministic green >=100%, amber >=90%, red <90%; current hour uses time-adjusted expectation
- future hours unavailable; missing remains missing, never fake zero
- Scrap/Rework here are hourly totals only, not duplicate quality events
- structured quality events remain authoritative for root cause, evidence, containment and verification
- correction history and hidden shift actor attribution remain preserved

# AI WORLD / COST POLICY — LIVE
Module: `continuation-v10/lsc-v10-ai-world.js`

**Zero autonomous/background model calls. No hourly AI polling.**

Routine performance, recovery math, status, gaps and downtime overlap are deterministic/free. AI cost occurs only when a person deliberately uses existing Copilot/AI functionality.

On an intentional request, AI World attaches the current architecture snapshot: Company Goal, current shift, hourly Actual/Good/Scrap/Rework, targets/status, recovery math, selected process/run, V10 hour/run evidence, active downtime, previous shift and handoff overlap. Existing V8 Plant Memory/recurrence context remains intact.

This supports questions like “How does the shift look?”, “Can we recover?”, “What is hurting us?”, and “Are yesterday’s handoff issues repeating?” without background neuron burn.

# SAFE DEPLOYMENT PATH
Use only:
- `.github/workflows/live-shift-v10-production.yml`
- `continuation-v10/tools/prepare-inplace-production.mjs`

The obsolete `.github/workflows/promote-live-shift-v10.yml` is manual-only and intentionally refuses deployment.

Safe sequence:
1. V10 acceptance gate.
2. Build exact existing-project payload.
3. If Vercel approval is needed, use the **live approval workflow** above.
4. Deploy manager existing project first.
5. Verify manager state/archive authority.
6. Deploy mobile existing project second.
7. Smoke regular URLs, shared revision, archive and POST-only intelligence behavior.
8. Update both handoff files with deployment IDs and verification.

# PLANT TRUTH
Timezone: `America/Chicago`; operating day: `07:00 → 06:59:59`.
Shifts: First 07–15, Second 15–23, Third 23–07.
Detached Opal Assembly: Day 07:00–15:40; Night 19:00–03:40.

Truth model:
`Calendar Day → Plant Shift → Process Run → Hour → Production + Downtime + Quality + Response + Evidence + Verification`

# NEXT STEP
Use real plant data only to prove the full path:
`mobile hourly write → shared state → manager reconstruction → End Shift archive → Calendar Memory reconstruction`.

Do not create fake production data for this proof.

# NON-NEGOTIABLES
Same product/projects/URLs. No fake data. No null→zero. No double-counted quality. Manager goal authoritative. AI explicit-use only. No duplicate providers/state/archive/config. Preserve rollback IDs. Shift Roster untouched. Verify regular URLs after every deployment. Update both handoff files after every meaningful modification. Handle approvals live.
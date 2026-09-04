# LIVE SHIFT COMMAND — CONTINUE HERE FIRST

> Canonical current-state handoff. Read this before changing Live Shift Command. Do not ask Frank to retrain the project from scratch.

## Mandatory continuity protocol
Every meaningful modification must update this file **and** append `live-shift-command-beta/BUILD_HANDOFF_LOG.md`. `.github/workflows/live-shift-handoff-guard.yml` enforces this.

## Live approval workflow — binding
Any approval must be handled live in the same session: generate only while Frank is present and the job is waiting, send immediately, Frank approves immediately, verify immediately, and continue the same workflow without letting the code sit and expire.

# CURRENT PRODUCT TRUTH — 2026-09-04

**V8 → V9 → V10 is one evolving Live Shift Command application.** No parallel beta product, no clean-slate rewrite, no replacement state/archive/AI stack.

Repo: `Franksharpe008/ai-opportunity-beta`
Branch: `live-shift-command-v10-recovery`
Draft PR: `#1`

## Production surfaces — these are the product
Manager:
- `https://live-shift-command-v74.vercel.app`
- project `prj_ETPejWyItkL7iE586cO4CbGlZWk6`
- production before Safari static-asset repair: `dpl_7BTWfSwY6rsLv5U1nc2TSaifcka2`
- rollback: `dpl_HZiAhAaH1uSG8b5f7nCMu2ZCJ54g`
- pre-V10 rollback: `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`

Mobile:
- `https://live-shift-command-v741-mobile.vercel.app`
- project `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`
- production before Safari static-asset repair: `dpl_HAH4qUszWYVc3q2NtLWRf3n5RVUL`
- rollback: `dpl_moo8RzN8KEZoNK82CnwXEbMgpJ7D`
- pre-V10 rollback: `dpl_GsxQqw4seGRvtXqE1uupksyUKba9`

Deprecated V10 side projects are scaffolding only. Do not extend them.

## Last verified shared brain
- manager/mobile `/api/state` 200, same revision `99`
- authoritative `state.config.shiftGoal=400`
- raw current Third Shift still contains legacy `current.shiftGoal=265`; do not rewrite historical truth merely for display
- mobile `/api/archive` 200
- `/api/intelligence` preserved; GET returns expected 405 because AI is POST-only
- no state reset/data wipe
- AI World explicit-use only; zero background/hourly model calls

# SAFARI / MOBILE RENDER INCIDENT — CURRENT FIX
Frank opened the regular mobile URL in iPhone Safari and saw browser-default unstyled HTML. Screenshot confirmed the HTML page loaded but the CSS/JS browser asset layer did not reliably apply. Direct checks showed `/api/base?file=style.css` and V9 JS were healthy at inspection time, so this is treated as an intermittent browser/serverless asset-delivery problem, not a product/state/AI failure.

Repair rule:
- **Do not change the product, state, archive, intelligence, or V10 behavior.**
- During release build, fetch the exact existing V9 CSS/JS once from the current public production `/api/base` endpoint.
- Materialize those V9 CSS/JS files as normal static files in the same manager/mobile deployment.
- Rewrite browser HTML references from `/api/base?file=...` to local `/style.css`, `/lsc-v8.js`, `/lsc-command-v9.js`, etc.
- `/api/base` is removed from browser-facing HTML.
- Backend `/api/state`, `/api/archive`, `/api/intelligence` topology remains unchanged.
- Smoke test must fail if `/api/base?file=` remains in manager/mobile HTML.

Files for this repair:
- `continuation-v10/tools/prepare-inplace-production.mjs`
- `continuation-v10/tests/v10-deployment-contract.js`
- `.github/workflows/live-shift-v10-production.yml`

# ARCHITECTURE TO PRESERVE
One shared brain:
`Manager Web + Mobile Floor → same state/archive/intelligence → V10 adds process/hour truth and richer context.`

Preserve V8/V9 state, Plant Memory/archive, original intelligence, voice/photo/type capture, classify/enrich/vision/quality/copilot/transcribe, usage accounting, all downtime codes/lifecycle, responders/timing, quality containment/action/result/verification, Shift Recall, Live Now, Calendar Memory, schedules, cross-midnight attribution, detached process runs, End Shift archive, manager intelligence, and current visual language.

Manager config flows down. Floor evidence flows up. Shift Roster remains untouched.

# COMPANY GOAL AUTHORITY
Manager config is the only Company Goal authority. Mobile cannot edit it. `lsc-v10-hourly-performance.js` guards the visible mobile goal so V9's legacy `current.shiftGoal=265` cannot visibly bounce against config 400.

# ACTUAL / GOOD HOURLY PERFORMANCE
Mobile Actual / Good is tappable. It opens the Hourly Performance sheet with Good, Scrap total, Rework total, optional note, progress/gap and green/amber/red hourly status. It writes existing `current.production[]`; no duplicate production backend. Missing stays missing; future hours are unavailable. Hourly Scrap/Rework totals do not create duplicate quality incidents.

# AI WORLD / COST POLICY
`lsc-v10-ai-world.js` attaches the live architecture snapshot only when a person intentionally asks Copilot/AI. No hourly polling and no autonomous model calls. Deterministic performance/recovery math is free. Existing Plant Memory/recurrence remains available to intentional AI questions.

# SAFE DEPLOYMENT PATH
Use only `.github/workflows/live-shift-v10-production.yml` with `continuation-v10/tools/prepare-inplace-production.mjs`.

Sequence: acceptance → build exact existing-project payload → live Vercel approval if needed → manager existing project → verify authority → mobile existing project → smoke regular URLs/shared revision/archive/intelligence/static asset delivery → update both handoffs with new deployment IDs.

# PLANT TRUTH
Timezone `America/Chicago`; operating day `07:00 → 06:59:59`.
First 07–15, Second 15–23, Third 23–07.
Opal Assembly detached Day 07:00–15:40; Night 19:00–03:40.
Truth model: `Calendar Day → Plant Shift → Process Run → Hour → Production + Downtime + Quality + Response + Evidence + Verification`.

# NEXT STEP
Deploy and verify the Safari/static-browser-asset repair without touching the shared brain. Then use real plant data only to prove `mobile hourly write → shared state → manager reconstruction → End Shift archive → Calendar Memory`.

# NON-NEGOTIABLES
Same projects/URLs. No fake data. No null→zero. No double-counted quality. Manager goal authoritative. AI explicit-use only. No duplicate providers/state/archive/config. Preserve rollbacks. Shift Roster untouched. Verify regular URLs after every deployment. Update both handoff files after every meaningful modification. Handle approvals live.

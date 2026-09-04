# LIVE SHIFT COMMAND — CONTINUE HERE FIRST

> Canonical current-state handoff. Read this before changing Live Shift Command. Do not ask Frank to retrain the project from scratch.

## Mandatory continuity protocol
Every meaningful modification must update this file **and** append `live-shift-command-beta/BUILD_HANDOFF_LOG.md`. `.github/workflows/live-shift-handoff-guard.yml` enforces this.

## Live approval workflow — binding
Any approval must be handled live in the same session. Generate only while Frank is present and the job is actively waiting; send immediately; then remain in the checking loop until approval clears. Frank should not have to return and tell the assistant that approval succeeded. Continue the same workflow immediately when the job flips approved.

# CURRENT PRODUCT TRUTH — 2026-09-04

**V8 → V9 → V10 is one evolving Live Shift Command application.** No parallel beta product, no clean-slate rewrite, no replacement state/archive/AI stack.

Repo: `Franksharpe008/ai-opportunity-beta`
Branch: `live-shift-command-v10-recovery`
Draft PR: `#1`
Current release marker commit: `c94fee2c002c1f3cac23dd778cb1ddb2300e1287`

## Production surfaces — these are the product
Manager:
- regular URL: `https://live-shift-command-v74.vercel.app`
- project: `prj_ETPejWyItkL7iE586cO4CbGlZWk6`
- current production deployment: `dpl_ALaP1FtaCyBjxPRTf8e8HNg3K94y`
- immutable deployment URL: `https://live-shift-command-v74-rnihgr5fi-franksharpe008s-projects.vercel.app`
- rollback: `dpl_9ygz671ciZGXTfoDh6go9r7My77f`
- pre-V10 rollback: `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`

Mobile:
- regular URL: `https://live-shift-command-v741-mobile.vercel.app`
- project: `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`
- current production deployment: `dpl_4pg2tkmUSiEC9qWFKqwgdDn6yyHa`
- immutable deployment URL: `https://live-shift-command-v741-mobile-clje5dhr2.vercel.app`
- rollback: `dpl_DDgcJomaSKVfi7tAF6apJsVJgLQg`
- pre-V10 rollback: `dpl_GsxQqw4seGRvtXqE1uupksyUKba9`

Deprecated V10 side projects are scaffolding only. Do not extend them.

## Last verified shared brain — production proof after queue promotion
GitHub Actions production run `33852945984`, rerun job `100962551695`: **SUCCESS**.

Verified after manager + mobile deployment:
- manager/mobile `/api/state` both 200 and same shared revision `107`;
- authoritative `state.config.shiftGoal=400` remains manager-controlled;
- manager `/api/archive` healthy;
- mobile `/api/archive` healthy;
- manager/mobile `/api/intelligence` preserve existing POST-only backend; GET returns expected 405;
- browser-facing V9 CSS/JS are normal static files, not `/api/base` requests;
- `lsc-v10-ai-world.js` loaded on manager + mobile;
- `lsc-v10-hourly-performance.js` + CSS loaded on mobile;
- `lsc-v10-verification-queue.js` loaded on manager + mobile;
- no state reset/data wipe;
- AI World remains explicit-use only; zero background/hourly model calls.

Smoke result emitted by CI:
`SAFE V10 PROMOTION VERIFIED · shared revision 107 · browser assets static · verification queue loaded`

# SAFARI / STATIC-ASSET ARCHITECTURE — RESOLVED AND BINDING
Exact V9 CSS/JS are normal static files in the same production deployment. Browser-facing HTML must not depend on `/api/base`.

Release builder harvests the existing V9 shell from normal static paths (`/${name}`), not `/api/base?file=...`. The manager backend state/archive/intelligence proxy remains the preserved protected V9 authority via OIDC; mobile state/archive/intelligence use the live manager authority.

The old `curl | grep -q` smoke pattern can falsely cause curl exit 23 after a successful match. Production workflow downloads files first and greps the downloaded files.

# SHIFT VERIFICATION QUEUE — LIVE IN PRODUCTION
The old `VERIFY LAST HOUR` mental model is retired. Real operations may be too busy for one-hour punctual entry, a whole shift/day can be chaotic, and connectivity can fail.

Feature commit: `265f15bf1525d872fb37216ad9f2814103a68500`.
Builder correction commit: `d593302429f5abd6952d258cf0e4ac9aae65b6d5`.
Production release marker: `c94fee2c002c1f3cac23dd778cb1ddb2300e1287`.
Production run: `33852945984` → SUCCESS after live Vercel approval.

Live behavior from the V10 pilot shift forward:
- every completed production hour remains recoverable until verified;
- applies to First, Second, Third, overtime/rough days — not just nights;
- queue identity is `shift id + original hour`;
- catch-up can happen hours later or after closeout while the shift remains in shared history;
- rapid oldest-first `Good / Scrap / Rework / note → SAVE + NEXT`;
- missing remains missing and is never converted to zero;
- entered-but-not-verified and verified are distinct states;
- later edits make old verification stale (`updatedAt > verifiedAt`) and return the hour as `REVERIFY`;
- mobile offline outbox `lsc-v10-verification-outbox-v1` stores entries as `PENDING SYNC`;
- manager cannot see an offline local entry as verified until shared-state sync succeeds;
- reconnect sync preserves original shift/hour, human verification time, and later sync time;
- same shared `production[]`, `hourVerification[]`, audit and archive lifecycle — no second production backend;
- zero AI calls for queueing, math, saving or syncing;
- AI World gets verification trust/status only when a human intentionally asks Copilot/AI;
- manager Live Now gets a verification-completeness indicator.

Migration cutoff: `2026-09-04T04:00:00.000Z`. Do not create backlog for older pre-feature shifts.

Module: `continuation-v10/lsc-v10-verification-queue.js`.

# SAFE-STOP HISTORY
First queue-promotion marker `03310f94b91e87f380f6962658a76d1674faf427` triggered run `33852395169` and stopped safely before Vercel auth/deploy because the old builder requested retired `/api/base?file=app1.js` and received 404. Healthy production was untouched.

Correction commit `d593302429f5abd6952d258cf0e4ac9aae65b6d5` switched browser-shell harvesting to current normal static paths and added a contract rejecting `/api/base?file=` harvesting. The final promotion used that corrected path successfully.

# ARCHITECTURE TO PRESERVE
One shared brain:
`Manager Web + Mobile Floor → same state/archive/intelligence → V10 adds process/hour truth and richer context.`

Preserve V8/V9 state, Plant Memory/archive, original intelligence, voice/photo/type capture, classify/enrich/vision/quality/copilot/transcribe, usage accounting, all downtime codes/lifecycle, responders/timing, quality containment/action/result/verification, Shift Recall, Live Now, Calendar Memory, schedules, cross-midnight attribution, detached process runs, End Shift archive, manager intelligence, and current visual language.

Manager config flows down. Floor evidence flows up. Shift Roster remains untouched.

# COMPANY GOAL AUTHORITY
Manager config is the only Company Goal authority. Mobile cannot edit it. `lsc-v10-hourly-performance.js` guards visible mobile goal so legacy `current.shiftGoal=265` cannot visually bounce against config 400.

# ACTUAL / GOOD HOURLY PERFORMANCE
Mobile Actual / Good is tappable. It opens Hourly Performance with Good, Scrap total, Rework total, optional note, progress/gap and green/amber/red status. It writes existing `production[]`; no duplicate production backend. Missing stays missing; future hours are unavailable. Hourly Scrap/Rework totals do not create duplicate quality incidents.

# AI WORLD / COST POLICY
`lsc-v10-ai-world.js` attaches live architecture context only when a person intentionally asks Copilot/AI. No hourly polling and no autonomous model calls. Deterministic performance/recovery/verification math is free.

# SAFE DEPLOYMENT PATH
Use only `.github/workflows/live-shift-v10-production.yml` with `continuation-v10/tools/prepare-inplace-production.mjs`.

Sequence: acceptance → build exact existing-project payload from current static production shell → live Vercel approval if needed → manager existing project → verify authority → mobile existing project → smoke regular URLs/shared revision/archive/intelligence/static assets/verification queue → update both handoffs with new deployment IDs.

# PLANT TRUTH
Timezone `America/Chicago`; operating day `07:00 → 06:59:59`.
First 07–15, Second 15–23, Third 23–07.
Opal Assembly detached Day 07:00–15:40; Night 19:00–03:40.
Truth model: `Calendar Day → Plant Shift → Process Run → Hour → Production + Downtime + Quality + Response + Evidence + Verification`.

# NEXT STEP
Do not rebuild or redeploy just to inspect. Use the live app with real plant data and validate the new Shift Verification Queue behavior in normal operations: missed completed hours → catch-up → manager visibility → optional offline pending/sync → closeout/archive. Any next modification must preserve the current production deployments as rollback candidates and update both handoffs before the work is considered finished.

# NON-NEGOTIABLES
Same projects/URLs. No fake data. No null→zero. No double-counted quality. Manager goal authoritative. AI explicit-use only. No duplicate providers/state/archive/config. Preserve rollbacks. Shift Roster untouched. Verify regular URLs after every deployment. Update both handoff files after every meaningful modification. Handle approvals live and keep checking until they clear.

# LATEST WORK IN PROGRESS — RESOLUTION CLOSEOUT + VERIFICATION LABEL HARDENING
Production test on 2026-09-04 exposed two issues that must be fixed before the next manager demo:
- mobile verification CTA visually fought between legacy `VERIFY LAST HOUR` and the V10 backlog count;
- `Resolve + Verify` successfully classified/transcribed the RB10 Vision Test incident but resolution `enrich` attempts returned HTTP 422 and the UI showed `Resolution interpretation could not complete`.

Exact runtime proof from manager production deployment `dpl_9ygz671ciZGXTfoDh6go9r7My77f`: `/api/intelligence` POST returned 422 at `08:19:31`, `08:21:07`, and `08:21:32` UTC while earlier classify/transcribe calls returned 200. Shared state revision 107 still contains the open RB10 event and was not damaged.

Implementation commit: `71ff4f2cb049c8eb8aad3a52c19e127f85e09bac`.
Validation on that commit:
- Live Shift V10 Acceptance push run `33855407932`: SUCCESS.
- Live Shift V10 Acceptance PR run `33855412983`: SUCCESS.
- Live Shift Handoff Guard push run `33855407861`: SUCCESS.
- Live Shift Handoff Guard PR run `33855412962`: SUCCESS.
- Production workflow correctly skipped because the commit had no `[deploy-v10-production]` marker.

Implemented repair:
- `lsc-v10-verification-ui.js`: the verification CTA only appears when action is required; labels are `1 HOUR NEEDS VERIFICATION`, `N HOURS NEED VERIFICATION`, or pending-sync; no indicator when everything is complete. A MutationObserver immediately corrects legacy rerenders so no visible bounce remains.
- `lsc-v10-resolution-guard.js`: keeps the exact existing `/api/intelligence` `enrich` call as primary. If that one call returns 422/network/invalid structured output during the Resolve + Verify screen, it performs a zero-model-call source-grounded fallback using only the operator statement, then feeds the result into the existing V8 human-confirmation/save workflow. No second provider, no second AI call, no new database.
- Exact regression phrase is tested: `They reset the vision system and we ran the four parts back through. They just reset it. It usually happens like this around midnight after midnight.` Safe interpretation: action = reset vision system; verification evidence = four parts rerun; recurrence signal = around/after midnight; root cause remains not established; verification remains recovered-not-permanent unless stronger evidence is stated.

Production smoke contract is being hardened before promotion so deployment must prove:
- manager + mobile HTML load `lsc-v10-resolution-guard.js`;
- mobile HTML loads `lsc-v10-verification-ui.js`;
- both guard files are directly fetchable from the regular production URLs and contain their expected version/behavior markers;
- normal state/archive/intelligence/static-asset/shared-revision checks still pass.

Next step: commit the smoke-contract hardening together with both handoffs, rerun Acceptance + Handoff Guard, then create a fresh `[deploy-v10-production]` release marker. Stay live through Vercel approval, deploy manager first then mobile, and verify the exact regular URLs. Do not call the RB10 closeout production-fixed before that deployment and smoke pass.

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

## Production surfaces — these are the product
Manager:
- `https://live-shift-command-v74.vercel.app`
- project `prj_ETPejWyItkL7iE586cO4CbGlZWk6`
- current production before verification-queue promotion: `dpl_9ygz671ciZGXTfoDh6go9r7My77f`
- rollback: `dpl_7BTWfSwY6rsLv5U1nc2TSaifcka2`
- pre-V10 rollback: `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`

Mobile:
- `https://live-shift-command-v741-mobile.vercel.app`
- project `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`
- current production before verification-queue promotion: `dpl_DDgcJomaSKVfi7tAF6apJsVJgLQg`
- rollback: `dpl_HAH4qUszWYVc3q2NtLWRf3n5RVUL`
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

# SAFARI / STATIC-ASSET ARCHITECTURE — RESOLVED AND BINDING
Exact V9 CSS/JS are normal static files in the same production deployment. Browser-facing HTML must not depend on `/api/base`. Direct production proof after repair: mobile root 200, `/style.css` 200 `text/css`, V9 JS 200 JavaScript, state 200 revision 99, archive 200, intelligence expected GET 405.

Release builder must harvest the existing V9 shell from normal static paths (`/${name}`), not `/api/base?file=...`. The manager backend state/archive/intelligence proxy remains the preserved protected V9 authority via OIDC; mobile state/archive/intelligence use the live manager authority.

The old `curl | grep -q` smoke pattern can falsely cause curl exit 23 after a successful match. Production workflow downloads files first and greps the downloaded files.

# SHIFT VERIFICATION QUEUE — VALIDATED FOR PRODUCTION PROMOTION
The old `VERIFY LAST HOUR` mental model is retired. Real operations may be too busy for one-hour punctual entry, a whole shift/day can be chaotic, and connectivity can fail.

Feature commit: `265f15bf1525d872fb37216ad9f2814103a68500`.
Builder correction commit: `d593302429f5abd6952d258cf0e4ac9aae65b6d5`.
Latest acceptance run `33852771609`: SUCCESS.
Latest Handoff Guard run `33852771439`: SUCCESS.

Implemented behavior from the V10 pilot shift forward:
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

Migration cutoff: `2026-09-04T04:00:00.000Z` (start of active V10 pilot Third Shift). Do not create backlog for older pre-feature shifts.

Module: `continuation-v10/lsc-v10-verification-queue.js`.

# SAFE-STOP HISTORY FOR THIS PROMOTION
First deployment marker `03310f94b91e87f380f6962658a76d1674faf427` triggered production run `33852395169`.

It **stopped safely before Vercel auth/deploy** because the old builder requested retired `/api/base?file=app1.js` and received 404. Acceptance had passed; Vercel install/auth/deployment steps were skipped; healthy production was untouched.

Correction commit `d593302429f5abd6952d258cf0e4ac9aae65b6d5` changed browser-shell harvesting to current normal static paths. Direct manager checks `/app1.js` and `/manager-intelligence.js` returned 200. Deployment contract now explicitly rejects `/api/base?file=` harvesting. Acceptance and handoff guard are green.

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
Trigger the fresh `[deploy-v10-production]` verification-queue promotion using the validated static-shell builder. Stay live through Vercel approval. After successful manager + mobile deploy and smoke, independently verify the regular URLs, capture new deployment IDs/shared revision, and update both handoffs without another deploy trigger.

# NON-NEGOTIABLES
Same projects/URLs. No fake data. No null→zero. No double-counted quality. Manager goal authoritative. AI explicit-use only. No duplicate providers/state/archive/config. Preserve rollbacks. Shift Roster untouched. Verify regular URLs after every deployment. Update both handoff files after every meaningful modification. Handle approvals live and keep checking until they clear.

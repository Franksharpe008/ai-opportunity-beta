# LIVE SHIFT COMMAND — CONTINUE HERE FIRST

> Canonical current-state handoff. Read this before changing Live Shift Command. Do not ask Frank to retrain the project from scratch.

## Mandatory continuity protocol
Every meaningful modification updates this file **and** appends `live-shift-command-beta/BUILD_HANDOFF_LOG.md`. `.github/workflows/live-shift-handoff-guard.yml` enforces continuity.

## Live approval workflow — binding
When Vercel approval is required, generate the device code only while the active job is waiting, send it immediately, then remain in the polling loop until approval clears. Frank should not have to return and tell the assistant approval succeeded; continue automatically when it flips.

# CURRENT PRODUCT TRUTH — 2026-09-04

**V8 → V9 → V10 is one evolving Live Shift Command application.** Never create a parallel product, new state service, new archive, or replacement AI stack.

Repo: `Franksharpe008/ai-opportunity-beta`
Branch: `live-shift-command-v10-recovery`
Draft PR: `#1`

## Production surfaces — these are the product
Manager:
- `https://live-shift-command-v74.vercel.app`
- project `prj_ETPejWyItkL7iE586cO4CbGlZWk6`
- current production `dpl_GjQVF6dPZCAksy4gBED5tAej3uxd`
- previous rollback `dpl_ALaP1FtaCyBjxPRTf8e8HNg3K94y`
- pre-V10 rollback `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`

Mobile:
- `https://live-shift-command-v741-mobile.vercel.app`
- project `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`
- current production `dpl_AVy8Pt7UVk1oeUM5NAXq8DBEsjem`
- previous rollback `dpl_4pg2tkmUSiEC9qWFKqwgdDn6yyHa`
- pre-V10 rollback `dpl_GsxQqw4seGRvtXqE1uupksyUKba9`

Team: `team_QlAarwuD75fLVrZQEi7r3OOh`
Deprecated V10 side projects are scaffolding only. Do not extend them.

## Last verified production proof
Release marker `39085568b63b96cf215407d570d19676c8b4c27a`.
GitHub Actions production run `33855942209`, rerun job `100977915662`: **SUCCESS**.

Final smoke emitted:
`SAFE V10 PROMOTION VERIFIED · shared revision 110 · browser assets static · verification queue + resolution guard loaded`

Verified:
- manager/mobile `/api/state` healthy and same shared revision `110`;
- manager Company Goal authority preserved (`state.config.shiftGoal=400` unless manager changes it);
- manager/mobile `/api/archive` healthy;
- original POST-only `/api/intelligence` preserved; GET health probe returns expected 405;
- V9 browser CSS/JS are normal same-deployment static files, never `/api/base` browser dependencies;
- `lsc-v10-ai-world.js` loaded on manager + mobile;
- `lsc-v10-hourly-performance.js` + CSS loaded on mobile;
- `lsc-v10-verification-queue.js` loaded manager + mobile;
- `lsc-v10-verification-ui.js` loaded mobile;
- `lsc-v10-resolution-guard.js` loaded manager + mobile;
- no state reset/data wipe;
- zero autonomous/hourly AI calls.

# ARCHITECTURE TO PRESERVE
One shared brain:
`Manager Web + Mobile Floor → same state/archive/intelligence → V10 adds process/hour truth and richer context.`

Preserve V8/V9 state, Plant Memory/archive, original intelligence, voice/photo/type capture, classify/enrich/vision/quality/copilot/transcribe, AI usage accounting, all downtime codes/lifecycle, responders/timing, quality containment/action/result/verification, Shift Recall, Live Now, Calendar Memory, schedules, cross-midnight attribution, detached process runs, End Shift archive, manager intelligence and current visual language.

Manager config flows down. Floor evidence flows up. Shift Roster remains separate and untouched.

# COMPANY GOAL AUTHORITY
Manager config is the only Company Goal authority. Mobile cannot edit it. Never let legacy `current.shiftGoal` repaint the visible company target against `state.config.shiftGoal`.

# ACTUAL / GOOD + SHIFT VERIFICATION QUEUE
Mobile Actual / Good opens Hourly Performance with Good, Scrap, Rework, note, goal attainment and green/amber/red status. It uses the existing shared production ledger; no duplicate production backend.

From migration cutoff `2026-09-04T04:00:00.000Z` forward:
- every completed hour remains recoverable until verified;
- applies to First, Second, Third, overtime, bad days, busy shifts and connectivity outages;
- queue identity is original shift + original hour;
- rapid oldest-first Good/Scrap/Rework/note → Save + Next;
- missing remains missing, never zero-filled;
- later edits reopen stale verification;
- offline entries are `PENDING SYNC` locally and are not shown to management as verified until sync succeeds;
- zero model calls for queue math/save/sync.

# RESOLVE + VERIFY INTELLIGENCE — LIVE
Production test exposed resolution `/api/intelligence` 422 while classify/transcribe worked. Repair `lsc-v10-resolution-guard.js` keeps the original intentional `enrich` call as primary. If that one call returns 422/network/invalid structure, it makes **no second AI call** and builds a source-grounded fallback from only the operator statement, feeding the result into the existing V8 human-confirmation/save path.

Regression statement:
`They reset the vision system and we ran the four parts back through. They just reset it. It usually happens like this around midnight after midnight.`

Safe interpretation:
- action: reset vision system;
- verification evidence: four parts rerun;
- recurrence signal: around/after midnight;
- root cause: not established;
- do not claim permanent fix without evidence.

# AI WORLD / COST POLICY
AI is available across the architecture but sleeps until a person intentionally asks. `lsc-v10-ai-world.js` attaches live architecture context only on deliberate Copilot/AI requests. No hourly polling, no background GLM/Cloudflare neuron burn, no second provider/router.

# SAFARI / STATIC ASSET RULE
Exact V9 CSS/JS are static files in the same production deployment. Browser-facing HTML must not depend on `/api/base`. Backend state/archive/intelligence topology stays preserved.

# CURRENT WORK IN PROGRESS — PREMIUM VERIFICATION CTA, NO FLICKER
Frank observed the mobile CTA still flashing every few seconds between legacy `VERIFY LAST HOUR` and the correct backlog count such as `5 HOURS NEED VERIFICATION`.

Root cause: `lsc-v10-mobile.js` rebuilt `#v10mVerifyHour` every 4 seconds with legacy last-hour text, then `lsc-v10-verification-ui.js` corrected it after paint.

Staged repair:
- `lsc-v10-mobile.js` version `1.3.1` renders the verification slot hidden + empty before paint;
- mobile renderer contains no `VERIFY LAST HOUR` and no `LAST HOUR VERIFIED` strings;
- V10 verification UI is the sole owner of visibility/text/click behavior;
- `renderInline()` calls `LSC_V10_VERIFICATION_UI.sync()` synchronously after rebuilding the inline area;
- visible states are only actionable truth: `1 HOUR NEEDS VERIFICATION`, `N HOURS NEED VERIFICATION`, `N HOURS PENDING SYNC`, or no CTA when clear;
- regression tests fail if legacy wording returns or hidden-before-paint ownership is removed.

Implementation:
- source fix `9d45dc82fb2299291c706f02e41a18c08805e27d`
- verification UI regression test `a5f05bad9173d9a474a65a2ede28ac1dd465688c`
- canonical handoff `5421db5e2f4bf690183302157a6eb651249f20e2`
- build log `8707c9e23565e27d51329037452367f30eeb25e6`

Gate history:
- Handoff Guard on `8707c9e...`: SUCCESS.
- V10 Acceptance initially failed only because `tests/v10-integration-contract.js` still asserted that mobile **must contain** `VERIFY LAST HOUR`.
- This was an outdated test contract, not a runtime code failure.
- Integration contract corrected in `44675694b433f3c8957a24e4fc37fc6c07f07460` to require the premium behavior: no legacy last-hour wording, hidden-before-paint queue slot, synchronous V10 verification sync.

**Not production yet.** Next step: update both handoffs for the contract correction, rerun full V10 Acceptance + Handoff Guard, then promote only through `.github/workflows/live-shift-v10-production.yml` with live approval and final regular-URL smoke. Do not call the flicker fixed in production until that passes.

# SAFE DEPLOYMENT PATH
Use only `.github/workflows/live-shift-v10-production.yml` with `continuation-v10/tools/prepare-inplace-production.mjs`.

Sequence:
acceptance → current static-shell build → live Vercel approval → existing manager project → manager authority check → existing mobile project → smoke regular URLs/shared revision/archive/intelligence/static assets/new modules → update both handoffs.

# PLANT TRUTH
Timezone `America/Chicago`; operating day `07:00 → 06:59:59`.
First 07–15, Second 15–23, Third 23–07.
Opal Assembly detached Day 07:00–15:40; Night 19:00–03:40.
Truth model: `Calendar Day → Plant Shift → Process Run → Hour → Production + Downtime + Quality + Response + Evidence + Verification`.

# NON-NEGOTIABLES
Same projects/URLs. No fake data. No null→zero. No double-counted quality. Manager goal authoritative. AI explicit-use only. No duplicate providers/state/archive/config. Preserve rollback candidates. Shift Roster untouched. Verify regular URLs after every deployment. Update both handoff files after every meaningful modification. Handle approvals live and keep polling until they clear. Premium UI means one visual owner per control—never observer-based visible label fighting.

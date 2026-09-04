# LIVE SHIFT COMMAND — CONTINUE HERE FIRST

> Canonical current-state handoff. Read this before changing Live Shift Command. Do not ask Frank to retrain the project from scratch.

## Mandatory continuity protocol
Every meaningful modification updates this file **and** appends `live-shift-command-beta/BUILD_HANDOFF_LOG.md`. `.github/workflows/live-shift-handoff-guard.yml` enforces continuity.

## Live approval workflow — binding
When Vercel approval is required, generate the device code only while the active job is waiting, send it immediately, then remain in the polling loop until approval clears. Frank should not have to return and tell the assistant approval succeeded; continue automatically when it flips.

## AI-cost / live-test rule — binding
Do **not** fire real `/api/intelligence` POSTs merely to prove a build. Acceptance/regression tests must be local/mock unless Frank intentionally chooses to test AI in the app. Production smoke may use GET `/api/intelligence` expecting 405 to verify routing, but must not spend Cloudflare/GLM/model neurons. After deployment, Frank performs the real AI Brief/Copilot live test himself.

# CURRENT PRODUCT TRUTH — 2026-09-04

**V8 → V9 → V10 is one evolving Live Shift Command application.** Never create a parallel product, new state service, new archive, or replacement AI stack.

Repo: `Franksharpe008/ai-opportunity-beta`
Branch: `live-shift-command-v10-recovery`
Draft PR: `#1`

## Production surfaces — these are the product
Manager:
- `https://live-shift-command-v74.vercel.app`
- project `prj_ETPejWyItkL7iE586cO4CbGlZWk6`
- current verified production `dpl_GjQVF6dPZCAksy4gBED5tAej3uxd`
- previous rollback `dpl_ALaP1FtaCyBjxPRTf8e8HNg3K94y`
- pre-V10 rollback `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`

Mobile:
- `https://live-shift-command-v741-mobile.vercel.app`
- project `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`
- current verified production `dpl_AVy8Pt7UVk1oeUM5NAXq8DBEsjem`
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

Live revision `110` proves RB10 closeout was ultimately saved with human confirmation, reset action, four-part rerun result and `recovered_not_verified_permanent` status.

# AI WORLD / COST POLICY
AI is available across the architecture but sleeps until a person intentionally asks. No hourly polling, no background GLM/Cloudflare neuron burn, no second provider/router.

`lsc-v10-ai-world.js` version `1.2.0` now attaches the existing live world to deliberate **Copilot and AI Brief (`summary`)** requests, including:
- authoritative manager goal;
- hourly performance + verification trust;
- process-run hourly context;
- previous shift + handoff overlap codes;
- recovery math;
- recent resolution memory/action/result/verification.

# AI BRIEF / COPILOT RELIABILITY — STAGED, REAL AI STILL PRIMARY
Frank's live test exposed three manager `summary` POST failures at 09:34:05, 09:34:42 and 09:35:17 UTC. The preserved V9 backend logged HTTP 502 with:
`cloudflare_gateway_output_missing`.
Earlier intelligence calls were 200, shared state remained revision `110`, and RB10 evidence remained intact. Therefore the failure is provider/gateway output reliability, not missing plant data or a broken shared brain.

New additive file: `lsc-v10-ai-reliability.js` version `1.0.1`.
Contract:
- real existing `/api/intelligence` request always gets first chance;
- only `summary` and `copilot` receive this reliability treatment;
- on non-2xx / gateway-empty / timeout / network failure, **no second model call** is made;
- instead it returns a normal source-grounded response from live shared state + V10 AI World;
- fallback audit uses `usageUnits: 0` and `gatewayFallback: true`;
- recovery answers refuse to pretend when Good Actual is missing;
- the fallback surfaces goal, Actual/missing truth, downtime, Scrap/Rework, verification backlog, latest confirmed resolution, prior-shift overlap and management attention;
- a UI watchdog on `#v8Ask` also supplies live evidence if the legacy Copilot click path fails before sending a request;
- no new AI provider, router, database or autonomous call.

Minimal mocked/local acceptance only:
- V10 Acceptance run `33860204477`: **SUCCESS**.
- No real AI POST was fired by assistant to validate the reliability layer. Frank will test AI Brief/Copilot live after deployment.

# PREMIUM VERIFICATION CTA — STAGED WITH SAME NEXT RELEASE
Frank observed mobile flashing every few seconds between legacy `VERIFY LAST HOUR` and correct backlog count.

Root cause: `lsc-v10-mobile.js` rebuilt the button every 4 seconds with legacy text and `lsc-v10-verification-ui.js` corrected it after paint.

Repair:
- `lsc-v10-mobile.js` `1.3.1` creates the verification slot hidden + empty before paint;
- mobile contains no `VERIFY LAST HOUR` or `LAST HOUR VERIFIED` text;
- V10 verification UI is sole owner of label/visibility/click;
- only actionable states appear: `1 HOUR NEEDS VERIFICATION`, `N HOURS NEED VERIFICATION`, pending sync, or nothing when clear.

Earlier premium-only production marker `63fdf0e7ec30313ab82ef284fb71c5e76b6cd6fc` created run `33859375212`, but it was **cancelled at Vercel Authenticate** by later work. Manager/mobile deploy steps were skipped, so it did not partially change production.

The next production release must ship the premium CTA fix and AI reliability together exactly once.

# SAFARI / STATIC ASSET RULE
Exact V9 CSS/JS are static files in the same production deployment. Browser-facing HTML must not depend on `/api/base`. Backend state/archive/intelligence topology stays preserved.

# SAFE DEPLOYMENT PATH
Use only `.github/workflows/live-shift-v10-production.yml` with `continuation-v10/tools/prepare-inplace-production.mjs`.

Current smoke contract explicitly does **not** POST AI. It checks:
- manager/mobile roots and static assets;
- AI World + AI Reliability + resolution guard loaded;
- mobile `1.3.1` and no legacy last-hour strings;
- shared state revisions match;
- archive healthy;
- GET `/api/intelligence` remains expected 405;
- no `/api/base` browser dependencies.

Sequence:
mock/local acceptance → current static-shell build → live Vercel approval → existing manager project → manager authority check → existing mobile project → non-paid smoke → Frank performs live AI Brief/Copilot test → update both handoffs with exact deployment IDs/results.

# PLANT TRUTH
Timezone `America/Chicago`; operating day `07:00 → 06:59:59`.
First 07–15, Second 15–23, Third 23–07.
Opal Assembly detached Day 07:00–15:40; Night 19:00–03:40.
Truth model: `Calendar Day → Plant Shift → Process Run → Hour → Production + Downtime + Quality + Response + Evidence + Verification`.

# NON-NEGOTIABLES
Same projects/URLs. No fake data. No null→zero. No double-counted quality. Manager goal authoritative. AI explicit-use only. No duplicate providers/state/archive/config. Preserve rollback candidates. Shift Roster untouched. Verify regular URLs after every deployment. Update both handoff files after every meaningful modification. Handle approvals live and keep polling until they clear. Premium UI means one visual owner per control. Do not burn real model usage for deployment verification; Frank tests intentional AI live.

# LIVE SHIFT COMMAND — CONTINUE HERE FIRST

> Canonical current-state handoff. Read this before changing Live Shift Command. Do not ask Frank to retrain the project from scratch.

## Mandatory continuity protocol
Every meaningful modification updates this file **and** appends `live-shift-command-beta/BUILD_HANDOFF_LOG.md`. `.github/workflows/live-shift-handoff-guard.yml` enforces continuity.

## Live approval workflow — binding
When Vercel approval is required, generate the device code only while the active job is waiting, send it immediately, then remain in the polling loop until approval clears. Frank should not have to return and tell the assistant approval succeeded; continue automatically when it flips.

## AI-cost / live-test rule — binding
Do not fire repeated real `/api/intelligence` POSTs for build verification. Acceptance/regression tests are local/mock. If Frank authorizes a real check, make the minimum number of calls, stop on the first useful failure, diagnose from logs, then let Frank test the app live.

## ECC — ERROR CORRECTION — BINDING ARCHITECTURE RULE
ECC is first-class across AI, state, archive, sync, UI and deployment. Every critical path should follow:
`detect → isolate → preserve state → degrade gracefully → recover → verify → log`.

ECC rules:
- never wipe or recreate shared state to recover from a feature failure;
- isolate failures to the smallest layer possible;
- keep deterministic facts available when AI/provider output fails;
- real AI remains primary, but malformed/empty/timeout responses must not make the UI go blank;
- no runaway retries or repeated paid inference loops;
- failed writes/sync stay pending and recoverable, never silently claimed successful;
- one visual owner per control to prevent flicker/races;
- deployment must fail closed before aliasing if authority/state/static-shell checks fail;
- every recovery records what failed and what fallback/recovery path was used.

# CURRENT PRODUCT TRUTH — 2026-09-04

**V8 → V9 → V10 is one evolving Live Shift Command application.** Never create a parallel product, new state service, new archive, or replacement AI stack.

Repo: `Franksharpe008/ai-opportunity-beta`
Branch: `live-shift-command-v10-recovery`
Draft PR: `#1`
Team: `team_QlAarwuD75fLVrZQEi7r3OOh`

## Production surfaces — these are the product
Manager:
- `https://live-shift-command-v74.vercel.app`
- project `prj_ETPejWyItkL7iE586cO4CbGlZWk6`
- current observed production deployment: `dpl_6Q2BRSj2WMPCX6eKmk3tnXrZeYWB`
- preserved original V9 backend deployment: `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`

Mobile:
- `https://live-shift-command-v741-mobile.vercel.app`
- project `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`
- current observed production deployment: `dpl_3mGHSEtN4ZBt5q1UC1qAzTZKo8yu`
- preserved original V9 backend deployment: `dpl_GsxQqw4seGRvtXqE1uupksyUKba9`

Deprecated side projects remain scaffolding only. Do not extend them.

## Shared truth
Latest verified shared state remains revision `110`.
- schema `live-shift-command/v10`
- `state.config.shiftGoal = 400` is authoritative manager Company Goal
- current Third Shift record is preserved
- RB10 Vision Test event is resolved and human-confirmed with reset action, four-part rerun result, and `recovered_not_verified_permanent`
- state/archive remained healthy during the AI failure investigation

# ARCHITECTURE TO PRESERVE
One shared brain:
`Manager Web + Mobile Floor → same state/archive/intelligence → V10 adds process/hour truth and richer context.`

Preserve V8/V9 state, Plant Memory/archive, original intelligence, voice/photo/type capture, classify/enrich/vision/quality/copilot/transcribe, AI usage accounting, all downtime codes/lifecycle, responders/timing, quality containment/action/result/verification, Shift Recall, Live Now, Calendar Memory, schedules, cross-midnight attribution, detached process runs, End Shift archive, manager intelligence and current visual language.

Manager config flows down. Floor evidence flows up. Shift Roster remains separate and untouched.

# COMPANY GOAL AUTHORITY
Manager config is the only Company Goal authority. Mobile cannot edit it. Never let legacy `current.shiftGoal` repaint the visible company target against `state.config.shiftGoal`.

# ACTUAL / GOOD + SHIFT VERIFICATION QUEUE
From migration cutoff `2026-09-04T04:00:00.000Z` forward:
- every completed hour remains recoverable until verified;
- applies to First, Second, Third, overtime, bad days, busy shifts and connectivity outages;
- queue identity is original shift + original hour;
- rapid oldest-first Good/Scrap/Rework/note → Save + Next;
- missing remains missing, never zero-filled;
- later edits reopen stale verification;
- offline entries are `PENDING SYNC` locally and are not shown to management as verified until sync succeeds;
- zero model calls for queue math/save/sync.

Premium CTA rule:
- no legacy `VERIFY LAST HOUR` / `LAST HOUR VERIFIED` rendering;
- verification CTA is hidden when clear;
- only actionable states render: `1 HOUR NEEDS VERIFICATION`, `N HOURS NEED VERIFICATION`, or pending sync;
- V10 verification UI is sole owner of label/visibility/click.

# RESOLVE + VERIFY INTELLIGENCE
`lsc-v10-resolution-guard.js` keeps the original intentional `enrich` call primary. If that call returns 422/network/invalid structured output, no second model call is made. A source-grounded fallback converts only operator words into the existing V8 human-confirmation/save shape.

Safe interpretation rules:
- action taken must come from operator evidence;
- result/verification evidence must be distinct from permanent root cause;
- recurrence signal may be captured without inventing root cause;
- do not claim permanent fix without evidence.

# AI WORLD
`lsc-v10-ai-world.js` is explicit-use only and adds live world context to intentional AI requests.
Current staged version: `1.3.0`.
It supports both legacy/current task aliases:
- `summary`
- `shift_summary`
- `copilot`
- `shift_copilot`

World context includes authoritative manager goal, hourly performance, verification trust, process runs, previous shift, handoff overlap, recovery math, active downtime and recent resolution memory.

# AI BRIEF / COPILOT ECC
Live manager tests exposed real backend failures while state/archive stayed healthy:
- 09:34:05 / 09:34:42 / 09:35:17 UTC: `summary` → 502 `cloudflare_gateway_output_missing`
- one authorized real check at 10:00:13 UTC: `summary` → 500 `malformed_model_json`

The authorized real check was exactly one POST. No retry loop followed.

Interpretation: provider/model path is reachable, but the preserved V9 backend can receive empty or malformed structured output and reject it. That is an AI response/parser reliability failure, not shared-state loss.

`lsc-v10-ai-reliability.js` staged version `1.1.0` implements ECC:
- original `/api/intelligence` always gets first chance;
- guards `summary`, `shift_summary`, `copilot`, and `shift_copilot`;
- on non-2xx, malformed JSON, gateway-empty, timeout or network failure, **no second model call** is made;
- it returns the legacy-compatible response shape from live shared state + AI World;
- fallback audit has `usageUnits: 0`, `eccFallback: true`;
- missing Actual stays missing;
- recovery is not guessed;
- fallback includes goal, Actual/missing truth, downtime, Scrap/Rework, verification backlog, latest confirmed resolution, prior-shift overlap and management attention;
- `#v8Ask` watchdog covers UI cases where the legacy handler fails before starting the request.

This is ECC, not a second AI stack. Real AI remains primary and the fallback exists only to keep the workflow useful when the provider response is unusable.

# SAFARI / STATIC ASSET RULE
Exact V9 CSS/JS are static files in the same production deployment. Browser-facing HTML must not depend on `/api/base`. Backend state/archive/intelligence topology stays preserved.

# SAFE DEPLOYMENT PATH
Use only `.github/workflows/live-shift-v10-production.yml` with `continuation-v10/tools/prepare-inplace-production.mjs`.

Sequence:
local/mock acceptance → current static-shell build → live Vercel approval → existing manager project → manager authority check → existing mobile project → non-paid smoke → minimum intentional real AI check only if Frank asks → update both handoffs with exact deployment IDs/results.

Production smoke must not spend AI. It verifies roots/static assets, state revision match, archive, V10 modules, no `/api/base` browser dependency, and GET `/api/intelligence` expected 405.

# PLANT TRUTH
Timezone `America/Chicago`; operating day `07:00 → 06:59:59`.
First 07–15, Second 15–23, Third 23–07.
Opal Assembly detached Day 07:00–15:40; Night 19:00–03:40.
Truth model: `Calendar Day → Plant Shift → Process Run → Hour → Production + Downtime + Quality + Response + Evidence + Verification`.

# NON-NEGOTIABLES
Same projects/URLs. No fake data. No null→zero. No double-counted quality. Manager goal authoritative. AI explicit-use only. No duplicate providers/state/archive/config. Preserve rollback candidates. Shift Roster untouched. Verify regular URLs after every deployment. Update both handoff files after every meaningful modification. Handle approvals live and keep polling until they clear. Premium UI means one visual owner per control. ECC is mandatory. No runaway paid AI testing.

# LIVE SHIFT COMMAND — BUILD HANDOFF LOG

> Append-only engineering handoff history. Every meaningful modification must also update `CONTINUE_HERE.md`. V8 → V9 → V10 is one evolving application.

## 2026-09-04 — V10 production recovery + architecture preservation
Manager recovered on `https://live-shift-command-v74.vercel.app`, project `prj_ETPejWyItkL7iE586cO4CbGlZWk6`, deployment `dpl_HZiAhAaH1uSG8b5f7nCMu2ZCJ54g`, rollback `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`.

Mobile recovered on `https://live-shift-command-v741-mobile.vercel.app`, project `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`, deployment `dpl_moo8RzN8KEZoNK82CnwXEbMgpJ7D`, rollback `dpl_GsxQqw4seGRvtXqE1uupksyUKba9`.

Verified manager/mobile state 200 same revision 98, archive 200, intelligence preserved (GET expected 405), no data reset. V8/V9 remains foundation and V10 additive.

## 2026-09-04 — Repository continuity system enforced
Created canonical `CONTINUE_HERE.md`, append-only `BUILD_HANDOFF_LOG.md`, and `.github/workflows/live-shift-handoff-guard.yml`. Key commits: `dbbeae800839062a69b2c2ada8e8d097801458cf`, `c76efd4fcba7dbbc5fa0ed1cc154444660aa57a8`, `bb7bb6240e7c21742ffc52789879475d5c6c7e4b`, `c11e842bdcfed0c8372e60f465869ca1b5eb87d6`.

## 2026-09-04 — Actual / Good hourly performance + explicit-use AI World
Implementation commit: `7d844deb648f488146ab1fe859d978edf897ff40`.

Added:
- `continuation-v10/lsc-v10-hourly-performance.js/.css`
- `continuation-v10/lsc-v10-ai-world.js`

Hourly panel makes Actual/Good tappable and writes existing `current.production[]` with Good, Scrap total, Rework total, note, corrections and shift audit. No duplicate quality events. Green/amber/red is deterministic; missing stays missing.

AI World makes zero background/hourly model calls. It only attaches full live world context when an existing intentional AI request is made, including goal, hourly performance, recovery math, process/run evidence, downtime, previous shift and handoff overlap. Existing V8 Plant Memory remains intact.

Company Goal bounce root cause: V9 renders legacy `current.shiftGoal=265` then V10 paints config 400. New module enforces manager config display without mutating the raw historical shift record.

CI for this commit:
- acceptance run `33846668681` PASS
- handoff guard `33846668715` PASS
- obsolete promotion run `33846670941` stopped before deployment because credential absent; production untouched

## 2026-09-04 — Deployment path hardened before hourly-performance promotion
The old `.github/workflows/promote-live-shift-v10.yml` was identified as dangerous because it rewrote production APIs directly to protected immutable deployment origins. It is now manual-only and deliberately refuses deployment.

Safe deployment files:
- `.github/workflows/live-shift-v10-production.yml`
- `continuation-v10/tools/prepare-inplace-production.mjs`
- `continuation-v10/tests/v10-deployment-contract.js`
- `continuation-v10/tests/run-v10-acceptance.js`

Safe generator behavior:
- fetch current public production shell
- remove old V10 injection tags
- inject current tested V10 assets locally
- `/api/base` retains protected V9 assets using `@vercel/oidc`
- manager state/archive/intelligence retain original protected manager V9 authority through OIDC
- mobile state/archive/intelligence proxy to live manager production authority
- exact manager/mobile project IDs written to `.vercel/project.json`
- manager deploys first, then manager authority is checked, then mobile deploys
- smoke requires AI World + hourly performance assets, same shared state revision, archive health, and expected POST-only intelligence route behavior

Deployment commit: `32c428ffc39823273c794f9bdd068b2835920584`.

## 2026-09-04 — Hourly Performance + AI World promoted to the real production projects
GitHub Actions run: `33847158062`.

The successful attempt completed every step:
- V10 acceptance PASS
- safe in-place release build PASS
- Vercel authentication PASS
- manager existing-project deployment PASS
- manager authority verification PASS
- mobile existing-project deployment PASS
- shared-brain smoke test PASS

Manager production:
- URL: `https://live-shift-command-v74.vercel.app`
- project: `prj_ETPejWyItkL7iE586cO4CbGlZWk6`
- new deployment: `dpl_7BTWfSwY6rsLv5U1nc2TSaifcka2`
- previous working V10 rollback: `dpl_HZiAhAaH1uSG8b5f7nCMu2ZCJ54g`
- preserved pre-V10 rollback: `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`

Mobile production:
- URL: `https://live-shift-command-v741-mobile.vercel.app`
- project: `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`
- new deployment: `dpl_HAH4qUszWYVc3q2NtLWRf3n5RVUL`
- previous working V10 rollback: `dpl_moo8RzN8KEZoNK82CnwXEbMgpJ7D`
- preserved pre-V10 rollback: `dpl_GsxQqw4seGRvtXqE1uupksyUKba9`

Independent post-deploy verification:
- manager regular URL 200
- mobile regular URL 200
- manager loads V8/V9 assets first, then `lsc-v10-core.js`, `lsc-v10-ai-world.js`, floor ops, UI/capacity/brief modules
- mobile loads V8/V9 assets first, then V10 core, AI World, mobile, floor ops, `lsc-v10-hourly-performance.js` and CSS
- manager `/api/state` 200
- mobile `/api/state` 200
- manager/mobile shared revision `99`
- authoritative manager config `shiftGoal=400`
- active Third Shift raw record still contains legacy `current.shiftGoal=265`; raw history was not rewritten
- mobile `/api/archive` 200 and returned Plant Memory for First/Second Shift
- mobile `/api/intelligence` GET returned expected `405 method_not_allowed`, proving route is alive and still POST-only
- manager deployment had no error/fatal runtime logs in final check
- mobile showed only non-fatal Node `DEP0169 url.parse()` deprecation warnings on `/api/base` 304 asset responses; no failed application request was observed
- no state reset or data wipe

## 2026-09-04 — Live approval workflow made binding
Frank established the approval workflow for this project: approvals happen live, not asynchronously.

Required future behavior:
1. Generate an approval only when Frank is present and the job is actually waiting for it.
2. Send the fresh link/code immediately.
3. Frank approves immediately.
4. Check approval status immediately and continue the blocked workflow in the same live session.
5. Never send a time-sensitive approval early and let it expire.
6. If a code expires, regenerate immediately and remain on that step until approval succeeds.

This rule applies to Vercel device authorization and any similar deployment/account approval flow used by Live Shift Command.
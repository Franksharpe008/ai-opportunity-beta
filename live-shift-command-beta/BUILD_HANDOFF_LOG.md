# LIVE SHIFT COMMAND — BUILD HANDOFF LOG

> Append-only engineering handoff history. Every meaningful modification must also update `CONTINUE_HERE.md`. V8 → V9 → V10 is one evolving application.

## 2026-09-04 — V10 production recovery + architecture preservation
Manager recovered on `https://live-shift-command-v74.vercel.app`, project `prj_ETPejWyItkL7iE586cO4CbGlZWk6`, deployment `dpl_HZiAhAaH1uSG8b5f7nCMu2ZCJ54g`, rollback `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`.

Mobile recovered on `https://live-shift-command-v741-mobile.vercel.app`, project `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`, deployment `dpl_moo8RzN8KEZoNK82CnwXEbMgpJ7D`, rollback `dpl_GsxQqw4seGRvtXqE1uupksyUKba9`.

Verified shared state and original state/archive/intelligence architecture remained intact. V8/V9 stays the foundation; V10 is additive.

## 2026-09-04 — Repository continuity system enforced
Created canonical `CONTINUE_HERE.md`, append-only `BUILD_HANDOFF_LOG.md`, and `.github/workflows/live-shift-handoff-guard.yml` so every meaningful change carries its own continuity handoff.

## 2026-09-04 — Actual / Good hourly performance + explicit-use AI World
Implementation commit: `7d844deb648f488146ab1fe859d978edf897ff40`.

Added mobile Hourly Performance with Good Actual, Scrap total, Rework total, optional note, deterministic green/amber/red performance, corrections/audit, and manager-only Company Goal display authority. Added AI World context with zero autonomous/hourly model calls; live world context is attached only when a person intentionally asks Copilot/AI.

## 2026-09-04 — Deployment path hardened
The obsolete promotion workflow that rewrote APIs toward protected immutable origins was disabled. Safe production path became `.github/workflows/live-shift-v10-production.yml` plus `continuation-v10/tools/prepare-inplace-production.mjs`, exact project IDs, manager first, manager authority check, mobile second, then shared-brain smoke test.

Deployment commit: `32c428ffc39823273c794f9bdd068b2835920584`.

## 2026-09-04 — Hourly Performance + AI World promoted to real production
GitHub Actions run `33847158062` completed acceptance, Vercel authentication, manager deployment, manager authority verification, mobile deployment, and full shared-brain smoke successfully.

Manager deployment: `dpl_7BTWfSwY6rsLv5U1nc2TSaifcka2`.
Mobile deployment: `dpl_HAH4qUszWYVc3q2NtLWRf3n5RVUL`.
Shared revision verified `99`; manager config goal `400`; mobile archive 200; intelligence preserved with expected GET 405; no state reset.

## 2026-09-04 — Live approval workflow made binding
Approvals are handled synchronously: generate while Frank is present and the job is waiting, send immediately, Frank approves immediately, verify immediately, and continue in the same live loop. Never let time-sensitive approval links sit until expiration.

## 2026-09-04 — Safari unstyled-page incident isolated to browser asset delivery
Frank opened `https://live-shift-command-v741-mobile.vercel.app` in iPhone Safari and the page rendered as browser-default unstyled HTML. Screenshot confirmed HTML loaded but CSS/JS styling did not reliably apply. Direct checks at incident time returned 200 with correct `text/css` for `/api/base?file=style.css` and 200 JavaScript for V9/V10 scripts, indicating intermittent delivery/caching around the serverless browser asset bridge rather than a state/archive/intelligence failure.

Repair decision:
- do **not** change product behavior or backend architecture;
- during build, fetch the exact working V9 browser CSS/JS once from the current public production `/api/base` endpoint;
- copy them into the same deployment as normal static files;
- rewrite HTML from `/api/base?file=style.css` / `/api/base?file=lsc-v8.js` / etc. to `/style.css`, `/lsc-v8.js`, `/lsc-command-v9.js`, etc.;
- remove `/api/base` from browser-facing HTML completely;
- preserve manager protected state/archive/intelligence OIDC proxy and mobile shared manager authority exactly as before;
- add deployment-contract assertions and production smoke checks that fail if `/api/base?file=` remains in browser HTML;
- verify static `style.css` and `lsc-command-v9.js` directly after deployment.

Files modified for this repair:
- `live-shift-command-beta/continuation-v10/tools/prepare-inplace-production.mjs`
- `live-shift-command-beta/continuation-v10/tests/v10-deployment-contract.js`
- `.github/workflows/live-shift-v10-production.yml`
- both handoff files

This repair is intentionally limited to browser asset delivery. Shared state, Plant Memory/archive, original intelligence, AI provider routing, cost policy, schedules, downtime lifecycle, quality workflows, and V10 feature logic are not being replaced.

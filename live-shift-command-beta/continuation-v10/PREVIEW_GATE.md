# V10 Preview / Promotion Gate

The branch is implementation-ready for an integrated preview only when this checklist is satisfied. Production promotion requires every preview item plus the production-safe checks below.

## Automated acceptance

- [ ] `node --check` passes for every V10 JavaScript module
- [ ] `v10-core-acceptance.js` passes
- [ ] `v10-capacity-acceptance.js` passes
- [ ] `v10-brief-acceptance.js` passes
- [ ] `v10-integration-contract.js` passes

## Web regression

- [ ] Existing Live Now renders once, not twice
- [ ] Existing V9 six-area table remains the primary live floor view
- [ ] Process Actual appears as a compact action in existing Live Now
- [ ] Calendar Memory still opens and loads archived dates
- [ ] Day Reconstruction opens today and an archived date
- [ ] Existing Manager Operating Intelligence remains intact
- [ ] Capacity Intelligence adds the rate decision without replacing existing shift ratings
- [ ] Existing Morning Meeting Brief button opens the V10-enhanced nine-section brief
- [ ] Company Goal and schedule configuration remain manager editable

## Mobile regression

- [ ] Existing Start Shift / Downtime / Scrap / Rework / Shift Detail / Copilot / Closeout all still work
- [ ] Voice/photo/type and AI issue identification remain the existing V8 workflow
- [ ] Company Goal edit pill is absent
- [ ] Start Shift shows Company Goal read-only and uses manager-controlled value
- [ ] Process / Run card is compact and does not push primary controls out of the first mobile workflow
- [ ] Process Actual writes Good Actual only
- [ ] Same process/run/hour correction replaces the prior value rather than summing it
- [ ] Shift Detail shows Process Actual evidence and correction count

## Shared-state verification

- [ ] Web and mobile observe the same state revision
- [ ] First confirmed V10 mutation changes schema to `live-shift-command/v10`
- [ ] Existing config keys survive byte-for-byte semantic round-trip
- [ ] `config.v10` is additive only
- [ ] `current.production[]` is unchanged by Process Actual
- [ ] Scrap/Rework totals remain single-counted through existing event workflow
- [ ] Mobile Process Actual appears on manager Live Now / Day Reconstruction after sync
- [ ] Manager Process Actual appears on mobile Shift Detail after sync

## AI verification

- [ ] Existing `/api/intelligence` endpoint remains the only application AI path
- [ ] Copilot receives `process_run_hourly` context
- [ ] Classification receives `process_run_hourly` context
- [ ] Deterministic production math is not delegated to AI
- [ ] AI does not write Company Goal, schedule or capacity decision into production config

## Archive verification — blocking production promotion

- [ ] Complete a test shift containing `processProduction[]`
- [ ] End Shift
- [ ] `/api/archive` archives the completed shift
- [ ] reopen the date from permanent Calendar Memory / Day Reconstruction
- [ ] archived shift still contains the same process Actual records and correction history

If archive persistence fails, do not promote. Fix the server archive snapshot to preserve the complete shift object before production V10 deployment.

## Capacity verification

- [ ] Sparse/current real archive returns `HOLD / BUILDING`
- [ ] synthetic acceptance fixture with three strong shifts returns `TRIAL HIGHER RATE`
- [ ] weak-shift fixture returns `INVESTIGATE`
- [ ] rate/capacity engine never writes `config.mesRate` or `shiftGoal`

## Production promotion

- [ ] Re-check latest Vercel deployment heads against `RELEASE_BASELINE.md`
- [ ] Confirm no newer live hotfix would be overwritten
- [ ] Preserve rollback deployment IDs for web and mobile
- [ ] Promote web and mobile V10 as one coordinated shared-schema release
- [ ] Confirm `/api/state` and `/api/archive` immediately after promotion
- [ ] Confirm Shift Roster has no changed files
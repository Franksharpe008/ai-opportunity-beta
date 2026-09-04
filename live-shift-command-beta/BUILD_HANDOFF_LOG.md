# LIVE SHIFT COMMAND — BUILD HANDOFF LOG

> Append-only engineering handoff history. Every meaningful code, architecture, deployment, or production-behavior change must add an entry here before the work is considered complete.

## Required handoff rule

For every meaningful modification:
1. Update `CONTINUE_HERE.md` with the new current truth.
2. Append an entry to this file.
3. Record exact files/modules changed.
4. Record Git commit/branch when applicable.
5. Record Vercel project + deployment IDs when production changes.
6. Record what was actually verified on the regular production URLs.
7. Record known warnings/open issues separately from confirmed failures.
8. Preserve rollback deployment IDs.
9. Never declare the modification complete until this handoff is written.

Do not create a parallel Live Shift Command product just to avoid updating the existing architecture. V8 → V9 → V10 is one evolving application.

---

## 2026-09-04 — V10 production recovery + architecture preservation

### Why this entry matters
A V10 deployment attempt briefly drifted toward separate beta/shell architecture. Frank restated the binding rule: V10 must evolve the existing Live Shift Command paths because the accumulated V8/V9 intelligence, archive, shared state, schedules, responders, quality flows and manager intelligence are valuable infrastructure and must not be replaced.

### Product surfaces
Manager production:
- URL: `https://live-shift-command-v74.vercel.app`
- project: `live-shift-command-v74`
- project ID: `prj_ETPejWyItkL7iE586cO4CbGlZWk6`
- current V10 production deployment: `dpl_HZiAhAaH1uSG8b5f7nCMu2ZCJ54g`
- preserved pre-V10 rollback deployment: `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`

Mobile production:
- URL: `https://live-shift-command-v741-mobile.vercel.app`
- project: `live-shift-command-v741-mobile`
- project ID: `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`
- current repaired V10 production deployment: `dpl_moo8RzN8KEZoNK82CnwXEbMgpJ7D`
- preserved pre-V10 rollback deployment: `dpl_GsxQqw4seGRvtXqE1uupksyUKba9`

### Architecture restored/preserved
- Existing V8/V9 page/assets remain the foundation.
- V10 loads after V9 as an additive layer.
- One shared plant state remains authoritative.
- Manager remains the shared authority for permanent archive / Plant Memory and intelligence routing.
- Mobile is a second surface on the same shared brain; it does not own a second archive/intelligence system.
- Original `/api/intelligence` implementation was not deleted or replaced.
- Original `/api/archive` Plant Memory implementation was not replaced.
- Original schedule/accountability, downtime, quality, responder, Shift Recall and manager intelligence behaviors remain underneath V10.

### Production health verified after repair
Shared state:
- manager `/api/state`: `200`
- mobile `/api/state`: `200`
- both observed the same state ledger
- latest verified revision: `98`
- no data reset occurred

Plant Memory/archive:
- manager `/api/archive?...`: `200`
- mobile `/api/archive?...`: `200`
- mobile now returns the same permanent archived First/Second Shift records through the shared authority
- previous mobile `401` archive failure was repaired

Intelligence:
- manager `/api/intelligence`: reaches preserved backend
- mobile `/api/intelligence`: reaches preserved backend
- health check intentionally used `GET`, which correctly returns `405 method_not_allowed`
- do not mistake this `405` for failure; the application calls intelligence with `POST`
- avoid paid test POST calls solely for health checking unless specifically needed

Runtime:
- manager: no current runtime failures observed in final health pass
- mobile: no 401/403/5xx application failures after repair
- mobile may show a Node `DEP0169 url.parse()` deprecation warning on `/api/base`; this is a warning, not a failed request and should not justify destabilizing the working architecture

### V10 behavior loaded on top
Mobile simplified V10:
- keep existing hero/KPI/Current Hour cockpit
- compact LINE selector
- RUNNING / DOWN / DETACHED context
- `VERIFY LAST HOUR`
- `MORE`
- secondary Process Actual / line downtime / bounded AI command
- manager-controlled company goal remains read-only on mobile

Manager V10:
- Calendar Day Reconstruction
- process/run/hour evidence
- capacity/rate intelligence
- weak-shift/loss analysis
- 4M with optional manager 6M refinement
- drilldowns to evidence/actions/verification
- upgraded Morning Meeting Brief

### Code source
Repo: `Franksharpe008/ai-opportunity-beta`
Branch: `live-shift-command-v10-recovery`
V10 modules live under:
`live-shift-command-beta/continuation-v10/`

Latest known tested mobile V10 integration version:
`lsc-v10-mobile-1.3.0`

Acceptance suite last known green before production recovery work:
GitHub Actions `Live Shift V10 Acceptance`, run `#85` on commit `2c2fe26eb821066c40b64548a2e060b7070b342b`.

### Binding rule moving forward
Every change must preserve this topology unless Frank explicitly changes product direction:

`Manager Web + Mobile Floor → same shared state / archive / intelligence architecture → V10 adds intelligence/evidence without replacing the foundation.`

Never create another V10 beta/profile/project as the product. Never treat a new version number as permission for a clean-slate rewrite.

### Next engineering proof
Use real plant data only to prove:
mobile V10 write → shared state → manager reconstruction → End Shift archive → Calendar Memory reconstruction, including `processProduction[]`, `hourVerification[]`, and hidden shift audit attribution.

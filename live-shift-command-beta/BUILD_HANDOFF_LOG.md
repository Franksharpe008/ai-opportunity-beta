# LIVE SHIFT COMMAND — BUILD HANDOFF LOG

> Append-only engineering handoff history. Every meaningful code, architecture, deployment, or production-behavior change must be recorded here before the work is considered complete.

## Required handoff rule

For every meaningful modification:
1. Update `CONTINUE_HERE.md` with current truth.
2. Append an entry here.
3. Record files/modules changed.
4. Record commit/branch.
5. Record Vercel project/deployment IDs when production changes.
6. Record what was actually verified on regular production URLs.
7. Separate warnings/open items from confirmed failures.
8. Preserve rollback IDs.
9. Never call the modification complete until this handoff exists.

V8 → V9 → V10 is one evolving Live Shift Command application.

---

## 2026-09-04 — V10 production recovery + architecture preservation

### Why
A V10 deployment attempt drifted toward a separate shell/beta architecture. Frank restated the binding rule: V10 must evolve the existing Live Shift Command paths because the accumulated V8/V9 intelligence, archive, state, schedules, responders, quality flows and manager intelligence are core infrastructure.

### Production surfaces restored
Manager:
- URL: `https://live-shift-command-v74.vercel.app`
- project ID: `prj_ETPejWyItkL7iE586cO4CbGlZWk6`
- recovered V10 deployment: `dpl_HZiAhAaH1uSG8b5f7nCMu2ZCJ54g`
- pre-V10 rollback: `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`

Mobile:
- URL: `https://live-shift-command-v741-mobile.vercel.app`
- project ID: `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`
- repaired V10 deployment: `dpl_moo8RzN8KEZoNK82CnwXEbMgpJ7D`
- pre-V10 rollback: `dpl_GsxQqw4seGRvtXqE1uupksyUKba9`

### Preserved architecture
- exact existing V8/V9 page/assets remain foundation
- V10 is additive after V9
- one shared state ledger
- manager authority for permanent Plant Memory/archive and intelligence routing
- original `/api/intelligence` not deleted/replaced
- original `/api/archive` not deleted/replaced
- schedule/accountability, downtime, quality, responder, Shift Recall and manager intelligence retained

### Health verified
- manager `/api/state` 200
- mobile `/api/state` 200
- shared ledger revision 98
- manager `/api/archive` 200
- mobile `/api/archive` 200 after repairing prior 401
- both `/api/intelligence` routes reached preserved backend
- intentional GET health probe returned expected 405 because AI route is POST-only
- manager no runtime failures in final pass
- mobile no 401/403/5xx failures after repair
- one possible Node `url.parse()` deprecation warning on `/api/base`, non-fatal

### Binding rule
Never treat a new version number as permission for a clean-slate rewrite or parallel product.

---

## 2026-09-04 — Repository continuity system enforced

### Files
- `live-shift-command-beta/CONTINUE_HERE.md`
- `live-shift-command-beta/BUILD_HANDOFF_LOG.md`
- `.github/workflows/live-shift-handoff-guard.yml`

### Commits
- handoff log introduced: `dbbeae800839062a69b2c2ada8e8d097801458cf`
- canonical handoff refreshed: `c76efd4fcba7dbbc5fa0ed1cc154444660aa57a8`
- CI handoff guard introduced: `bb7bb6240e7c21742ffc52789879475d5c6c7e4b`
- guard recorded in canonical state: `c11e842bdcfed0c8372e60f465869ca1b5eb87d6`

### Rule
A meaningful Live Shift Command change must update both canonical handoff files. The guard fails continuity when that does not happen.

### Production impact
None. Repository/process protection only.

---

## 2026-09-04 — Actual / Good hourly performance + explicit-use AI World — implementation before production promotion

### User intent
Frank wants the main mobile **Actual / Good** KPI to become the fastest production-entry surface, while keeping the cockpit clean. He also wants AI to understand the entire Live Shift world when asked broad questions, but he does **not** want background/hourly GLM/Cloudflare neuron burn.

### New files
- `live-shift-command-beta/continuation-v10/lsc-v10-hourly-performance.js`
- `live-shift-command-beta/continuation-v10/lsc-v10-hourly-performance.css`
- `live-shift-command-beta/continuation-v10/lsc-v10-ai-world.js`

### Updated files in the same change
- `continuation-v10/tools/build-v10-release.mjs`
- `continuation-v10/tests/v10-integration-contract.js`
- `continuation-v10/tests/v10-release-builder-acceptance.js`
- `.github/workflows/live-shift-v10-acceptance.yml`
- `live-shift-command-beta/CONTINUE_HERE.md`
- `live-shift-command-beta/BUILD_HANDOFF_LOG.md`

### Company Goal bounce fix
Root cause found in the existing V9 mobile render:
- old cockpit paints `current.shiftGoal` (legacy active record can be 265)
- V10 then repaints authoritative `state.config.shiftGoal` (400)
- user sees 265 ↔ 400 bounce

New hourly-performance module:
- preserves raw legacy shift record
- does not rewrite history just for display
- synchronously enforces manager config after render
- adds a MutationObserver guard on the visible Company Goal element
- mobile goal edit remains removed/read-only

### Actual / Good performance panel
The existing KPI becomes tappable.

Panel behavior:
- Company Goal (manager-controlled)
- Actual / Good
- accrued hourly target
- progress / variance
- Scrap / Rework totals
- eight hourly rows using configured shift hourly targets
- green = at/above time-adjusted standard
- amber = >=90% and below standard
- red = below 90%
- missing stays missing
- future hours unavailable
- current hour compares against time-adjusted expectation
- completed hours compare against full hourly target

Hour entry:
- Good Actual
- Scrap total
- Rework total
- optional note
- writes to existing `current.production[]` ledger so the original cockpit immediately reflects the same truth
- correction history and shift actor attribution included
- no second production backend/table

### Scrap/Rework semantics
The panel values are **hourly totals**, not additive defect events.

It does not create `scrap`/`rework` events. Existing structured quality workflow remains authoritative for defect category, 4M, containment, evidence, intelligence and verification. This avoids automatically double-counting quality.

### AI World architecture
`lsc-v10-ai-world.js` wraps the existing intentional `/api/intelligence` request path.

It makes **zero model calls by itself**:
- no interval
- no polling
- no hourly call
- no call when the panel opens
- no call when a production number is saved

On an intentional Copilot request, it attaches a live snapshot including:
- manager Company Goal
- current shift summary
- hourly Actual/Good/Scrap/Rework + targets/status
- deterministic recovery math
- current selected process/run
- V10 process-run/hour evidence
- active downtime
- previous shift summary
- handoff overlap codes

Existing V8 Plant Memory and recurrence context remains intact. The new module supplements it rather than replacing it.

Broad questions this is meant to support:
- current overall shift health
- whether recovery looks possible
- what is hurting the shift
- whether yesterday/previous-shift handoff issues are repeating
- other out-of-box Copilot questions grounded in current architecture

### Cost policy
AI is **explicit-use only**. Deterministic code should answer/display routine operational math for free. Model cost occurs only when a person deliberately asks Copilot or uses an existing explicit AI function.

### Release integration
Release builder now loads `lsc-v10-ai-world.js` on both manager and mobile.
Mobile additionally loads `lsc-v10-hourly-performance.js` and CSS after V10 floor ops so the hourly save uses the established audited state writer.

### Test updates
Acceptance contracts now guard:
- AI World explicit-use-only policy
- no background interval/model call
- manager goal authority
- tap-to-enter Actual / Good
- Good/Scrap/Rework hourly entry
- no duplicate quality event creation in hourly module
- new release asset order on both surfaces
- syntax checks for new modules

### Production status at time of this entry
Implementation is being committed to `live-shift-command-v10-recovery` first. Production remains on:
- manager `dpl_HZiAhAaH1uSG8b5f7nCMu2ZCJ54g`
- mobile `dpl_moo8RzN8KEZoNK82CnwXEbMgpJ7D`

Do not update these deployment IDs in this entry. Add a new handoff entry after CI passes and the same existing projects are promoted/verified.

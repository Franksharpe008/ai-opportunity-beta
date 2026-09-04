# LIVE SHIFT COMMAND — CONTINUE HERE FIRST

> Canonical current-state handoff. A new chat, Codex session, or engineer must read this file **before changing Live Shift Command**. Do not ask Frank to retrain the project from scratch.

## Mandatory continuity protocol

Every meaningful modification to Live Shift Command must finish with BOTH of these repo updates:

1. Update this file so it reflects the new **current truth**.
2. Append a dated entry to `live-shift-command-beta/BUILD_HANDOFF_LOG.md` recording what changed, deployment IDs, verification, rollback points, and any open issue.

A modification is **not complete** until the handoff is updated.

This protocol exists specifically to prevent future chats from losing architectural context and accidentally rebuilding, replacing, or bypassing working systems.

---

# CURRENT PRODUCT TRUTH — 2026-09-04

## One evolving application

**V8 → V9 → V10 is one Live Shift Command application.**

V10 evolves the existing product in place. It is not a parallel beta product, not a clean-slate rebuild, and not a replacement intelligence stack.

Do not create another product/profile/project for the working application unless Frank explicitly changes direction.

Repo: `Franksharpe008/ai-opportunity-beta`
Working branch: `live-shift-command-v10-recovery`
Draft PR: `#1`

Do not deploy stale `main` over the working production applications.

---

# THE ONLY TWO PRODUCTION SURFACES THAT MATTER

## Manager — existing production project
- URL: `https://live-shift-command-v74.vercel.app`
- project: `live-shift-command-v74`
- project ID: `prj_ETPejWyItkL7iE586cO4CbGlZWk6`
- current V10 production deployment: `dpl_HZiAhAaH1uSG8b5f7nCMu2ZCJ54g`
- preserved pre-V10 rollback deployment: `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`

## Mobile — existing production project
- URL: `https://live-shift-command-v741-mobile.vercel.app`
- project: `live-shift-command-v741-mobile`
- project ID: `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`
- current repaired V10 production deployment: `dpl_moo8RzN8KEZoNK82CnwXEbMgpJ7D`
- preserved pre-V10 rollback deployment: `dpl_GsxQqw4seGRvtXqE1uupksyUKba9`

## Deprecated side projects
`live-shift-command-v10-mobile-beta` and `live-shift-command-v10-manager-beta` are not the product. Treat them only as old smoke-test scaffolding. Do not extend architecture around them and do not send Frank/Emilio there as the main app.

---

# CURRENT PRODUCTION HEALTH

The recovery completed after a deployment-path mistake briefly disrupted mobile archive routing.

Verified after repair:

### Shared state
- manager `/api/state` → `200`
- mobile `/api/state` → `200`
- both surfaces read the same shared ledger
- latest verified revision: `98`
- no state reset/data wipe occurred

### Permanent Plant Memory/archive
- manager `/api/archive` → `200`
- mobile `/api/archive` → `200`
- mobile now returns the same permanent archived shift records through the shared authority
- the temporary mobile archive `401` was repaired

### Intelligence
- original `/api/intelligence` implementation is preserved
- manager route reaches the preserved intelligence backend
- mobile route reaches the preserved intelligence backend
- health probes using `GET` correctly return `405 method_not_allowed`; this is expected because production intelligence calls use `POST`
- do not waste paid AI calls just to prove a route exists unless a real POST test is necessary

### Runtime
- manager final health pass: no current application runtime failures
- mobile final health pass: no current 401/403/5xx application failures
- possible Node `DEP0169 url.parse()` warning on `/api/base` is a warning, not a failed application request; do not destabilize architecture solely to silence it

---

# ARCHITECTURE THAT MUST BE PRESERVED

The accumulated V8/V9 system is infrastructure, not disposable legacy code.

V10 must continue to sit **after and on top of** the existing V8/V9 architecture.

Preserve:
- shared manager/mobile state
- `/api/state`
- `/api/archive`
- `/api/intelligence`
- voice capture
- photo/vision capture
- typed issue capture
- classify/enrich/vision/quality/copilot/transcribe intelligence tasks
- AI usage accounting
- downtime codes
- downtime lifecycle
- evidence
- responder timing
- response ownership
- Scrap/Rework quality workflow
- containment/solution/recovery/permanent verification flow
- Shift Recall
- Live Now / hot memory
- permanent Calendar Memory
- effective-dated schedules
- Third Shift cross-midnight logic
- detached process schedule identity
- End Shift archive behavior
- manager intelligence
- current visual language and simple mobile cockpit

Do not create a second AI provider, second state system, second archive system, or second manager-configuration authority.

### Shared-brain rule
Conceptually:

`Manager Web + Mobile Floor → same shared state / archive / intelligence architecture → V10 adds process/hour truth and intelligence without replacing the foundation.`

Manager remains the authority for rules/configuration/intelligence view.
Mobile remains the floor evidence surface.

---

# UX RULE FRANK RESTATED

**Keep the shine. Keep it simple. Intelligence grows underneath the cockpit.**

Mobile must not become a giant dashboard.

Existing mobile structure stays:
- hero
- KPI cards
- Current Hour card
- active downtime
- Shift Copilot
- Scrap/Rework/Shift Detail
- bottom navigation

V10 integrates compactly inside the existing flow:
- one LINE selector
- RUNNING / DOWN / DETACHED state
- `VERIFY LAST HOUR`
- `MORE`
- Process Actual inside secondary tools
- line-specific downtime/manage inside secondary tools
- bounded AI command inside secondary tools / aligned with Shift Copilot

Manager goal remains read-only on mobile.

Latest known mobile V10 integration version:
`lsc-v10-mobile-1.3.0`

---

# SHARED PLANT TRUTH

Timezone: `America/Chicago`
Operating day: `07:00 → 06:59:59` next calendar day

Plant shifts:
- First Shift `07:00–15:00`
- Second Shift `15:00–23:00`
- Third Shift `23:00–07:00`

Detached process schedules:
- Opal Assembly Day `07:00–15:40`
- Opal Assembly Night `19:00–03:40`

A detached process run may cross plant-shift ownership. Preserve one continuous process run while stamping every event/hour with the plant shift responsible at that moment.

Plant truth model:

`Calendar Day → Plant Shift → Process Run → Hour → Production + Downtime + Quality + Response + Evidence + Verification`

---

# V10 IMPLEMENTED CAPABILITIES

V10 modules live under:
`live-shift-command-beta/continuation-v10/`

## Shared process/hour evidence
`current.processProduction[]`

Rules:
- explicit process/run/hour identity
- Good Actual remains explicit
- missing Actual stays missing
- never redistribute generic shift Actual into process Actual
- same process/run/hour uses correction/upsert behavior
- quality workflow is not double-counted

## Time Truth
`continuation-v10/lsc-v10-floor-ops.js`

Downtime supports:
- Started Now
- Started Earlier
- Correct Start Time
- Restored Now through existing Resolve + Verify
- Restored Earlier then existing Resolve + Verify

Actual equipment time is separate from record-entry time. Duration uses actual stop/restoration time.

## Hidden change attribution
For beta, changes can be stamped by shift rather than individual user.

Example:
`{ mode:'shift_beta', shift:'Third Shift', actorId:'third_shift', userId:null }`

Writes can carry:
- `changedBy`
- `changedAt`
- `audit[]`

Later authenticated identity can populate `userId` without changing the historical schema.

Actor attribution means **who made the edit**, not necessarily who owned the event when it occurred.

## Hour Truth
`VERIFY LAST HOUR` records:
- selected process/run/hour
- hourly goal
- Good Actual
- Scrap
- Rework
- overlapping downtime event links
- verified state/time
- shift actor
- correction history
- `current.hourVerification[]`

## Bounded AI operational commands
AI may interpret supervisor language, but deterministic V10 code owns:
- Chicago time
- operating date
- plant shift
- process run
- validation
- upsert/correction
- audit

Allowed bounded mutations:
- backdate/start downtime
- backdate/end downtime
- verify completed process hour

AI may not autonomously change:
- company target/rate
- schedule config
- authority roles
- permanent archive deletion
- capacity recommendation into config

---

# MANAGER V10 CAPABILITIES

Preserve existing manager intelligence and extend it with:
- Calendar Day Reconstruction
- shift → process run → hour → evidence
- process Actual
- cross-shift capacity/rate intelligence
- weak-shift detection
- downtime / quality / rate-loss decomposition
- 4M Pareto
- optional manager-only 6M refinement: Measurement + Environment
- drilldown to incidents/evidence/actions/verification
- decisions: `HOLD`, `INVESTIGATE`, `TRIAL HIGHER RATE`
- Morning Meeting Brief upgraded in place

Morning Meeting Brief section order must remain exactly:
1. STATUS
2. WHAT HAPPENED
3. WHAT CHANGED
4. WHAT REPEATED
5. WHAT WORKED
6. OPPORTUNITY
7. RESPONSE
8. MANAGEMENT ATTENTION
9. PROOF

Current correct capacity conclusion remains `HOLD / BUILDING` until trustworthy cross-shift hourly Actual is dense enough.

Missing Actual must not be treated as zero.

---

# COMPANY GOAL AUTHORITY

Manager configuration is authoritative.
Mobile cannot edit company goal.

Last verified shared config:
- `state.config.shiftGoal = 400`

An older active shift object may still contain legacy `shiftGoal:265`. Do not silently rewrite historical raw shift values just for display. Mobile should display authoritative manager config 400.

---

# TESTS / QUALITY GATE

GitHub Actions workflow:
`Live Shift V10 Acceptance`

Guards include:
- V10 syntax
- process/run logic
- retro start/end
- Third Shift audit attribution
- verified hourly truth
- capacity decision guardrails
- operating brief
- no manager intelligence auto-writing rate/goal
- integration/release contracts

Last known green acceptance before production recovery:
- run `#85`
- commit `2c2fe26eb821066c40b64548a2e060b7070b342b`

Every meaningful code change should rerun this suite before production promotion when the changed files are covered by the workflow.

---

# EXACT NEXT ENGINEERING PROOF

Do not redesign the product next. Prove the architecture with **real plant data only**.

Next proof chain:

1. Use the existing regular mobile URL.
2. Create one real V10 floor write during actual production.
3. Verify write reaches the shared `/api/state` ledger.
4. Verify hidden shift attribution is present.
5. Verify manager regular URL reconstructs the same process/run/hour truth.
6. Complete End Shift through the existing workflow.
7. Verify permanent `/api/archive` contains the same V10 fields.
8. Open Calendar Memory / reconstruction and prove those fields survived archive.

Specifically prove persistence of:
- `processProduction[]`
- `hourVerification[]`
- time-truth corrections
- hidden audit attribution
- process-run identity across detached schedules

Do not create fake production data to make this test pass.

---

# NON-NEGOTIABLE BUILD RULES

- Same product, same existing projects, same regular URLs.
- No clean-slate rewrite.
- No parallel beta as the product.
- No fake plant data.
- No silent null → zero.
- No double-counted quality.
- No duplicate AI/provider/config/state/archive systems.
- Manager rules flow down; floor evidence flows up.
- Mobile simplicity wins over exposing every capability.
- Preserve all downtime codes.
- Canonical 4M remains Man/People, Machine, Material, Method.
- Optional 6M is manager-only refinement when useful.
- Shift Roster stays separate and untouched.
- Preserve rollback deployment IDs before production changes.
- Verify regular production URLs after every deployment.
- Update `CONTINUE_HERE.md` + append `BUILD_HANDOFF_LOG.md` after every meaningful modification.

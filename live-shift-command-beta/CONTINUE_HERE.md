# LIVE SHIFT COMMAND — CONTINUE HERE FIRST

> Canonical current-state handoff. A new chat, Codex session, or engineer must read this file **before changing Live Shift Command**. Do not ask Frank to retrain the project from scratch.

## Mandatory continuity protocol

Every meaningful Live Shift Command modification must finish with BOTH repo updates:

1. Update this file with the new **current truth**.
2. Append the modification to `live-shift-command-beta/BUILD_HANDOFF_LOG.md` with files changed, commit, deployment IDs, verification, rollback points, and open issues.

A meaningful modification is not complete until the handoff is updated. `.github/workflows/live-shift-handoff-guard.yml` enforces this on the recovery branch so continuity does not depend on chat memory alone.

---

# CURRENT PRODUCT TRUTH — 2026-09-04

## One evolving application

**V8 → V9 → V10 is one Live Shift Command application.**

V10 evolves the existing product in place. It is not a parallel beta product, clean-slate rewrite, replacement state system, replacement archive, or replacement AI stack.

Repo: `Franksharpe008/ai-opportunity-beta`
Working branch: `live-shift-command-v10-recovery`
Draft PR: `#1`

Never deploy stale `main` over the working production applications.

## Only production surfaces that matter

### Manager — existing project
- URL: `https://live-shift-command-v74.vercel.app`
- project: `live-shift-command-v74`
- project ID: `prj_ETPejWyItkL7iE586cO4CbGlZWk6`
- current production deployment before the next hourly-performance promotion: `dpl_HZiAhAaH1uSG8b5f7nCMu2ZCJ54g`
- preserved pre-V10 rollback: `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`

### Mobile — existing project
- URL: `https://live-shift-command-v741-mobile.vercel.app`
- project: `live-shift-command-v741-mobile`
- project ID: `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`
- current production deployment before the next hourly-performance promotion: `dpl_moo8RzN8KEZoNK82CnwXEbMgpJ7D`
- preserved pre-V10 rollback: `dpl_GsxQqw4seGRvtXqE1uupksyUKba9`

`live-shift-command-v10-mobile-beta` and `live-shift-command-v10-manager-beta` are deprecated smoke-test scaffolding, not the product. Do not extend architecture around them.

---

# CURRENT PRODUCTION HEALTH

Last verified after V10 recovery:

- manager `/api/state` → `200`
- mobile `/api/state` → `200`
- same shared ledger; last verified revision `98`
- manager `/api/archive` → `200`
- mobile `/api/archive` → `200`
- original `/api/intelligence` implementation preserved on both surfaces
- `GET /api/intelligence` health probes correctly return `405 method_not_allowed`; production intelligence uses `POST`
- manager had no application runtime failures in final health pass
- mobile had no 401/403/5xx application failures after repair
- possible Node `DEP0169 url.parse()` warning on `/api/base` is non-fatal; do not destabilize working architecture just to silence it

No data reset occurred during recovery.

---

# ARCHITECTURE THAT MUST BE PRESERVED

The accumulated V8/V9 system is infrastructure, not disposable legacy code.

Preserve:
- shared manager/mobile `/api/state`
- permanent `/api/archive` Plant Memory
- original `/api/intelligence`
- voice/photo/type capture
- classify/enrich/vision/quality/copilot/transcribe intelligence tasks
- AI usage accounting
- all downtime codes
- downtime lifecycle + actual-vs-recorded time
- evidence, responders, response ownership and timing
- Scrap/Rework quality workflow
- containment / action / result / verification history
- Shift Recall
- Live Now / hot memory
- Calendar Memory
- effective-dated schedules
- Third Shift cross-midnight attribution
- detached process-run identity
- End Shift archive
- manager intelligence
- current visual language and simple mobile cockpit

Shared-brain rule:

`Manager Web + Mobile Floor → same state / archive / intelligence architecture → V10 adds process/hour truth and better context without replacing the foundation.`

Manager rules/configuration flow down. Floor evidence flows up.

---

# MANAGER COMPANY GOAL AUTHORITY

Manager configuration is the only authority for Company Goal.

Last verified config:
- `state.config.shiftGoal = 400`

A legacy active shift can still contain `current.shiftGoal = 265`. That raw historical/current record must not be silently rewritten just for display.

Mobile must always **display manager config** and cannot edit Company Goal. The visible 265 ↔ 400 bounce is a UI-source conflict: old V9 render paints the legacy shift value, then V10 repaints manager config. The new hourly-performance module fixes this synchronously after render and with a DOM guard so the phone should never visibly settle on 265.

---

# MOBILE UX RULE

**Keep the shine. Keep it simple. Intelligence grows underneath the cockpit.**

Existing hero, KPIs, Current Hour, active downtime, Shift Copilot, quality actions, Shift Detail and bottom navigation stay.

V10 compact controls remain:
- LINE selector
- RUNNING / DOWN / DETACHED context
- `VERIFY LAST HOUR`
- `MORE`
- Process Actual / line downtime / bounded AI command behind secondary tools

## New branch implementation — Actual / Good hourly performance

Files:
- `continuation-v10/lsc-v10-hourly-performance.js`
- `continuation-v10/lsc-v10-hourly-performance.css`

Behavior:
- the existing **Actual / Good** KPI becomes tappable
- opens a slick Hourly Performance sheet rather than adding another dashboard to the main screen
- shows Company Goal, Actual / Good, accrued hourly target, progress, gap, Scrap, Rework
- all configured shift hours appear with goal / actual / percentage
- status is deterministic green / amber / red, with missing and future states
- current hour uses time-adjusted expectation; completed hours use full hourly target
- tap an available hour to enter/correct Good Actual, Scrap total, Rework total, and optional note
- future hours are not editable
- missing Actual stays missing; never auto-zero
- hourly Scrap/Rework in this panel are **totals**, not new defect events
- structured Scrap/Rework workflow remains the place for root cause, containment, evidence and verification
- corrections and shift-level change attribution are preserved in audit history
- the main Actual / Good KPI immediately reflects the same existing `current.production[]` ledger the cockpit already uses

This implementation is on the recovery branch and must pass CI before promotion to the existing mobile project.

---

# AI COST + WORLD CONTEXT RULE

Frank explicitly does **not** want hourly/background model calls burning Cloudflare/GLM neurons.

New shared module:
- `continuation-v10/lsc-v10-ai-world.js`

Policy:
- **zero autonomous/background model calls**
- no hourly AI polling
- no model call just because the performance panel opens or data changes
- deterministic code handles goals, performance bands, gaps, recovery math, downtime overlap, status and normal UI guidance
- existing Copilot/AI is called only when a person intentionally asks or requests an AI action already supported by the product

When an intentional Copilot request occurs, AI World attaches the live architecture snapshot at that moment, including:
- authoritative manager Company Goal
- current shift and production totals
- all hourly Actual / Good / Scrap / Rework values
- hourly targets and time-adjusted status
- deterministic recovery math: gap, time remaining, required hourly rate to Company Goal
- current selected process/run context
- V10 process-run/hour evidence
- active downtime
- previous shift summary
- handoff overlap codes
- existing V8 Plant Memory / recurrence context remains intact

This is designed so questions such as these can be answered from real evidence without adding a new provider or background spending:
- “How does the shift look overall?”
- “Do you think we can recover?”
- “What is hurting us right now?”
- “Are we seeing yesterday’s handoff problems again?”
- other out-of-box Copilot questions about the live plant state

The AI should see the world **when asked**, not continuously spend tokens watching it.

---

# SHARED PLANT TRUTH

Timezone: `America/Chicago`
Operating day: `07:00 → 06:59:59`

Plant shifts:
- First Shift `07:00–15:00`
- Second Shift `15:00–23:00`
- Third Shift `23:00–07:00`

Detached process schedules:
- Opal Assembly Day `07:00–15:40`
- Opal Assembly Night `19:00–03:40`

A detached run can cross plant-shift ownership. Preserve one continuous process run while stamping every event/hour with the plant shift responsible at that moment.

Plant truth:

`Calendar Day → Plant Shift → Process Run → Hour → Production + Downtime + Quality + Response + Evidence + Verification`

---

# V10 CORE CAPABILITIES ALREADY IMPLEMENTED

Modules live under `live-shift-command-beta/continuation-v10/`.

- `current.processProduction[]`
- process/run/hour identity
- missing Actual stays missing
- no redistribution of generic shift Actual into process Actual
- correction/upsert history
- Started Now / Started Earlier / Correct Start Time
- Restored Now / Restored Earlier
- actual equipment time separate from record-entry time
- hidden shift actor attribution: First / Second / Third Shift
- `current.hourVerification[]`
- bounded AI operational commands with deterministic write ownership
- manager Calendar Day Reconstruction
- capacity/rate intelligence: HOLD / INVESTIGATE / TRIAL HIGHER RATE
- downtime / quality / residual rate-loss decomposition
- canonical 4M + optional manager 6M refinement
- Morning Meeting Brief upgraded in place with exact 1–9 section order

AI cannot autonomously change Company Goal, schedule config, authority, archive deletion, or capacity recommendation into configuration.

---

# TESTS / QUALITY GATES

Existing workflow:
- `Live Shift V10 Acceptance`

New modules must be syntax checked and covered by integration/release-builder contracts.

Last known green before this new hourly-performance change:
- acceptance run `#85`
- commit `2c2fe26eb821066c40b64548a2e060b7070b342b`

Continuity workflow:
- `Live Shift Handoff Guard`
- `.github/workflows/live-shift-handoff-guard.yml`

---

# EXACT NEXT STEPS

1. Commit hourly-performance + AI World + release/test changes atomically with this handoff.
2. Wait for `Live Shift V10 Acceptance` to pass.
3. Promote the new V10 assets to the **same existing manager/mobile Vercel projects only**.
4. Verify on the regular mobile URL:
   - Company Goal remains visually 400 with no 265 bounce
   - goal edit control remains absent/read-only
   - Actual / Good is tappable
   - Hourly Performance opens cleanly
   - current/completed hour can save Good/Scrap/Rework without creating duplicate quality events
   - green/amber/red status updates from deterministic math
   - opening panel causes no `/api/intelligence` call
5. Verify manager/mobile state + archive + intelligence health again after deployment.
6. Update both handoff files with the new production deployment IDs and verification.
7. During real production, prove mobile write → shared state → manager reconstruction → End Shift archive → Calendar Memory reconstruction.

Do not create fake plant data for the proof.

---

# NON-NEGOTIABLE BUILD RULES

- Same product, same existing projects, same regular URLs.
- No clean-slate rewrite.
- No parallel beta as the product.
- No fake plant data.
- No silent null → zero.
- No double-counted quality.
- No duplicate AI/provider/config/state/archive systems.
- Manager Company Goal is authoritative and mobile read-only.
- Mobile simplicity wins over exposing every capability.
- AI is explicit-use only; no background neuron burn.
- Preserve all downtime codes and canonical 4M.
- Shift Roster stays separate and untouched.
- Preserve rollback deployment IDs before production changes.
- Verify regular production URLs after every deployment.
- Update `CONTINUE_HERE.md` + append `BUILD_HANDOFF_LOG.md` after every meaningful modification.

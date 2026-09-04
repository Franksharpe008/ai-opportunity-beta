# LIVE SHIFT COMMAND — CONTINUE HERE FIRST

> Continuity contract. Do **not** ask Frank to retrain the project. Read this file, inspect the recovery branch and the existing live projects, then continue from the exact next step.

## Product direction

**V9 becomes V10 on the same Live Shift Command product and the same existing URLs/projects.**

Do not create another product/profile/project for the working application. The separate V10 beta projects created during recovery were a deployment mistake and are **not** the target architecture. Do not send Frank or Emilio to them as the main app.

Repo: `Franksharpe008/ai-opportunity-beta`
Branch: `live-shift-command-v10-recovery`
Draft PR: `#1`
Never deploy stale `main` over the live CLI/prebuilt apps.

## The two app surfaces that matter

### Manager — SAME EXISTING PROJECT
- URL: `https://live-shift-command-v74.vercel.app`
- project: `live-shift-command-v74`
- project id: `prj_ETPejWyItkL7iE586cO4CbGlZWk6`
- V9 working behavior is the foundation that must be evolved in place to V10.

### Mobile — SAME EXISTING PROJECT
- URL: `https://live-shift-command-v741-mobile.vercel.app`
- project: `live-shift-command-v741-mobile`
- project id: `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`
- latest known V9 production deployment before V10 promotion: `dpl_GsxQqw4seGRvtXqE1uupksyUKba9`
- this same mobile cockpit is where V10 belongs.

### Separate beta projects
`live-shift-command-v10-mobile-beta` and `live-shift-command-v10-manager-beta` were useful only as recovery smoke-test environments. Treat them as deprecated test scaffolding, not the product. Do not extend the architecture around them.

## UX rule Frank restated

**Keep the shine. Keep it simple. Intelligence should grow underneath the cockpit, not turn the phone into a dashboard.**

Latest mobile simplification commit removes the large V10 process card / six line tiles / four-button control block.

V10 mobile now belongs inside the existing cockpit like this:
- existing hero stays
- existing KPI cards stay
- existing Current Hour card stays
- inside Current Hour: one compact LINE selector + RUN/DOWN/DETACHED status
- two compact actions: `VERIFY LAST HOUR` and `MORE`
- `MORE` contains secondary tools such as Process Actual, line-specific downtime/manage, and bounded AI command
- existing main Downtime workflow remains the primary downtime entry
- AI should primarily feel like the existing Shift Copilot, not a second AI interface
- no giant manager intelligence on mobile

## Shared plant truth

Timezone: `America/Chicago`
Operating day: 07:00 → 06:59:59 next calendar day

Plant shifts:
- First Shift 07:00–15:00
- Second Shift 15:00–23:00
- Third Shift 23:00–07:00

Detached process schedules:
- Opal Assembly Day 07:00–15:40
- Opal Assembly Night 19:00–03:40

A detached process run may cross plant-shift ownership. Preserve one continuous process run while stamping every event/hour with the plant shift that owned that moment.

## V9 capabilities V10 must preserve

- shared manager/mobile `/api/state`
- all existing downtime codes
- voice/photo/type evidence
- current `/api/intelligence` classify/enrich/vision/quality/copilot/transcribe path
- 4M cause model and responder ownership
- response timing / responders
- Scrap/Rework quality workflow
- Resolve + Verify
- Live Now / hot memory
- Calendar Memory / archive
- effective-dated schedules
- Third Shift cross-midnight attribution
- detached process schedule identity
- Shift Recall / prior-shift continuity
- End Shift archive
- manager intelligence
- current visual design language and simple floor flow

## V10 additions already implemented on recovery branch

### Shared process/hour evidence
`current.processProduction[]`
- process/run/hour identity
- Good Actual remains explicit
- missing Actual stays missing
- generic shift Actual is never redistributed to process Actual
- same process/run/hour uses upsert + correction history
- Scrap/Rework root-cause workflow is not double counted

### Time Truth
`continuation-v10/lsc-v10-floor-ops.js`

Downtime supports:
- Started Now
- Started Earlier
- Correct Start Time
- Restored Now through existing Resolve + Verify
- Restored Earlier then existing Resolve + Verify

Actual equipment time is separate from record-entry time. Duration uses actual stop/restoration time.

### Hidden change attribution
Do not clutter the profile/UI yet.

Beta actor schema:
`{ mode:'shift_beta', shift:'Third Shift', actorId:'third_shift', userId:null }`

Writes can carry `changedBy`, `changedAt`, `audit[]`; current shift carries hidden audit history. For now attribution is First/Second/Third Shift. Later authenticated person identity fills `userId` without changing the historical model.

### Hour Truth
`VERIFY LAST HOUR` writes:
- selected process/run/hour
- hourly goal
- Good Actual
- Scrap
- Rework
- overlapping downtime event links
- verified status/time
- shift actor
- correction history
- `current.hourVerification[]`

### Bounded AI operational commands
AI may interpret explicit supervisor instructions, but deterministic V10 owns time conversion, operating date, plant shift, process run, validation, upsert and audit.

Supported bounded mutations:
- backdate/start downtime
- backdate/end downtime
- verify a completed process hour

AI still cannot autonomously alter company goal/rate, schedules, authority, archive deletion, or convert a capacity recommendation into configuration.

## Manager V10 branch modules

- Calendar Day Reconstruction
- shift → process run → hour → evidence
- process Actual
- cross-shift capacity/rate intelligence
- weak-shift detection
- downtime / quality / rate-loss decomposition
- 4M Pareto + optional manager-only 6M refinement
- drilldown to incidents/actions/evidence/verification
- `HOLD`, `INVESTIGATE`, `TRIAL HIGHER RATE`
- existing Morning Meeting Brief upgraded in place

Brief order:
STATUS → WHAT HAPPENED → WHAT CHANGED → WHAT REPEATED → WHAT WORKED → OPPORTUNITY → RESPONSE → MANAGEMENT ATTENTION → PROOF.

## Company Goal authority

Manager config is authoritative. Mobile cannot edit the company goal.

At last verified shared state:
- `state.config.shiftGoal = 400`
- an older active Third Shift record contained legacy `shiftGoal:265`

V10 mobile should display manager config 400 without silently rewriting historical raw shift values just for appearance.

## Capacity truth

Current correct manager conclusion remains `HOLD / BUILDING` because trustworthy cross-shift hourly Actual is still sparse. Untouched legacy zero rows and missing Actual are excluded.

## Tests

GitHub Actions `Live Shift V10 Acceptance` guards:
- V10 syntax
- process/run logic
- retro start/end
- Third Shift audit attribution
- verified hourly truth
- capacity decision guardrails
- operating brief
- no manager intelligence auto-writing rate/goal
- release integration contract

After every mobile simplification or deployment change, rerun this acceptance suite before production promotion.

## Exact next step

1. Keep simplifying around the existing mobile cockpit; do not create more V10 projects.
2. Promote the tested V10 files to **the existing mobile Vercel project** `live-shift-command-v741-mobile`, preserving the same URL.
3. Promote manager V10 modules to **the existing manager Vercel project** `live-shift-command-v74`, preserving the same URL.
4. Verify existing visual behavior first, then V10 line selector / time truth / hourly verification.
5. Use real plant data only to prove mobile write → shared state → manager reconstruction.
6. Prove `processProduction[]`, `hourVerification[]`, and hidden audits survive End Shift → permanent archive → Calendar reconstruction.
7. Keep the last known V9 deployments available as rollback points during promotion.

## Non-negotiables

- Same product, same existing projects/URLs.
- No clean-slate rewrite.
- No fake plant data.
- No silent null→zero.
- No double-counted quality.
- No duplicate AI/provider/config systems.
- Manager rules flow down; floor evidence flows up.
- Mobile simplicity wins over showing every capability at once.
- Shift Roster remains separate and untouched.

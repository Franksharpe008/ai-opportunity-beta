# Live Shift Command — V10 Recovery Checkpoint

Recovered on 2026-09-03 (America/Chicago) before continuing implementation.

## Protected baseline

- Production manager URL: `https://live-shift-command-v74.vercel.app`
- Latest verified production deployment at recovery: `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`
- Deployment source: Vercel CLI / prebuilt output (not Git-linked)
- GitHub repository: `Franksharpe008/ai-opportunity-beta`
- Protected continuation branch: `live-shift-command-v10-recovery`
- `main` is intentionally not overwritten because its latest Live Shift commit is older than the production build.

## Live production modules observed

The recovered production page loads the established V7/V8/V9 stack, including:

- `app1.js`
- `app2.js`
- `app3.js`
- `lsc-intelligence.js`
- `lsc-v8.js`
- `manager-intelligence.js`
- `lsc-command-v9.js`
- `lsc-v8.css`
- `manager-intelligence.css`
- `lsc-command-v9.css`

The production title still says V7.9, but the active code includes the later V8/V9 operational-intelligence layers.

## Behavior that must not regress

- Shared live manager/mobile state.
- Plant operating day: 07:00 → 06:59:59 America/Chicago.
- First / Second / Third plant shift windows.
- Detached process schedules, including Opal Assembly Day and Opal Assembly Night.
- Effective-dated schedule versions.
- Cross-midnight event attribution.
- Cause / 4M separated from originating function and recovery ownership.
- Hybrid/multi-team response tracking.
- Scrap/rework process evidence.
- Shift Recall and previous-shift continuity.
- Permanent archive / Calendar Memory.
- Immediate archive behavior for completed shifts.
- Evidence-first Manager Operating Intelligence and Morning Meeting Brief.
- AI remains advisory and human-confirmed; deterministic shift math is not delegated to AI.
- Shift Roster remains completely separate and must not be modified in this phase.

## V10 continuation target

V10 continues additively from the recovered production behavior. The immediate implementation lane is:

1. Calendar-first day reconstruction.
2. Process-run identity and hourly production evidence.
3. Current process/run visibility in Live Now.
4. Process-level actual capture without contaminating shift totals.
5. Downtime, quality, response, 4M and evidence tied back to the exact run/hour.
6. A stable data surface for later rate/capacity intelligence and drill-downs.

No production deployment should replace the protected live URL until the continuation has been validated against the recovered behavior.
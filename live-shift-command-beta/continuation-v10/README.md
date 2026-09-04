# Live Shift Command V10

Start with `../CONTINUE_HERE.md`, then `CURRENT_IMPLEMENTATION.md`.

Implementation files:

- `lsc-v10-core.js` — shared V10 schema/writer, process-run/hourly evidence, existing AI context bridge
- `lsc-v10-mobile.js` — compact mobile process Actual + manager-config read-only enforcement
- `lsc-v10-ui.js` — manager Live Now enhancement + Calendar Day Reconstruction
- `lsc-v10-capacity.js` — deterministic rate/capacity decision engine
- `lsc-v10-capacity-ui.js` — manager capacity decision/drill-through UI
- `lsc-v10-brief.js` — upgrades the existing Morning Meeting Brief in place
- `lsc-command-v10.css` — manager process/calendar UI
- `lsc-v10-mobile.css` — mobile V10 UI
- `lsc-v10-capacity.css` — capacity UI
- `lsc-v10-brief.css` — brief UI

Contracts/checkpoints:

- `RELEASE_BASELINE.md`
- `V10_LOAD_MATRIX.md`
- `WEB_MOBILE_AUTHORITY.md`
- `AI_INTEGRATION.md`
- `PREVIEW_GATE.md`
- `STATUS.md`
- `INTEGRATION.md`

Acceptance:

```bash
node tests/run-v10-acceptance.js
```

Production is not promoted until archive persistence for `processProduction[]` is verified.
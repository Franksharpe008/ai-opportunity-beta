# Live Shift Command V10 — Integrated Load Matrix

V10 evolves the existing V9 runtime. The base V8/V9 modules remain because they contain working production functionality; V10 loads after them and overrides only the specific shared writer/UI behaviors that must evolve.

## Manager web V10

```html
<link rel="stylesheet" href="/style.css">
<link rel="stylesheet" href="/lsc-v8.css">
<link rel="stylesheet" href="/lsc-command-v9.css">
<link rel="stylesheet" href="/manager-intelligence.css">
<link rel="stylesheet" href="/lsc-command-v10.css">
<link rel="stylesheet" href="/lsc-v10-capacity.css">
<link rel="stylesheet" href="/lsc-v10-brief.css">

<script src="/app1.js"></script>
<script src="/app2.js"></script>
<script src="/app3.js"></script>
<script src="/lsc-intelligence.js"></script>
<script src="/lsc-v8.js"></script>
<script src="/manager-intelligence.js"></script>
<script src="/lsc-command-v9.js"></script>

<!-- V10 evolution layer -->
<script src="/lsc-v10-core.js"></script>
<script src="/lsc-v10-ui.js"></script>
<script src="/lsc-v10-capacity.js"></script>
<script src="/lsc-v10-capacity-ui.js"></script>
<script src="/lsc-v10-brief.js"></script>
```

V10 core deliberately loads after V9 so it can upgrade the existing `update()` shared-state writer from the hardcoded V7.9 schema to the V10 schema while retaining the same `/api/state`, revision and 409 conflict behavior.

The manager V10 UI does not create a second Live Now area grid. It inserts a compact Process Actual action and process/run evidence line into the existing V9 Live Now surface. Calendar Day Reconstruction and Capacity Intelligence are the only new full manager sections.

The existing `MORNING MEETING BRIEF` button is upgraded in place by V10; there is no second V10 brief button.

## Mobile V10

```html
<link rel="stylesheet" href="/style.css">
<link rel="stylesheet" href="/lsc-v8.css">
<link rel="stylesheet" href="/lsc-command-v9.css">
<link rel="stylesheet" href="/lsc-v10-mobile.css">

<script src="/app1.js"></script>
<script src="/app2.js"></script>
<script src="/app3.js"></script>
<script src="/lsc-intelligence.js"></script>
<script src="/lsc-v8.js"></script>
<script src="/lsc-command-v9.js"></script>

<!-- V10 evolution layer -->
<script src="/lsc-v10-core.js"></script>
<script src="/lsc-v10-mobile.js"></script>
```

Mobile does not load manager capacity, Calendar Reconstruction or manager brief modules.

Mobile V10 adds only:

- compact Process / Run card
- process-level Good Actual capture
- Process Actual evidence in Shift Detail
- manager-controlled Company Goal displayed read-only
- V10 shared writer/schema
- process-run context passed through the existing V8 AI path

Existing V8/V9 downtime, quality, voice/photo, responders, resolution and Shift Recall remain the only workflows for those functions.

## Shared data evolution

Existing shift production remains:

`current.production[]`

V10 adds:

`current.processProduction[]`

Each process Actual is keyed by:

`runInstanceId | plantHour | area`

Re-saving that same key updates the existing record and appends correction history instead of adding the values together.

V10 writes:

`schema = live-shift-command/v10`

only during a confirmed state mutation. Merely opening a V10 preview must not migrate or mutate the shared production state.

## Authority boundary

Manager web:
- may edit company goal / schedules / manager configuration
- receives mobile/floor evidence
- sees plant-wide capacity intelligence

Mobile:
- reads manager configuration
- records production/process/downtime/quality/evidence
- cannot edit manager-owned Company Goal or schedule configuration

## AI boundary

V10 does not create a new model/provider endpoint. It augments the already-working `/api/intelligence` requests with `process_run_hourly` context for Copilot and classification. Existing human-confirmation and source-grounding behavior stays authoritative.
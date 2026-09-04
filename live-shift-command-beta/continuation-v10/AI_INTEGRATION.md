# V10 AI Integration — Reuse Existing Path

V10 does not add a second AI provider, endpoint, billing path or model router.

The live V8 workflow already uses `/api/intelligence` for plant-language classification, enrichment, vision/quality and Shift Copilot. V10 keeps that workflow and human-confirmation model.

## V10 context enhancement

`lsc-v10-core.js` wraps `window.fetch` narrowly for requests whose URL is `/api/intelligence`.

Only two existing request shapes are enhanced:

### Copilot

Existing `shift` payload receives:

- `process_run_hourly`
- `v10_schema`

### Downtime classification

Existing `context` payload receives:

- `process_run_hourly`
- `v10_schema`

Every non-intelligence request is passed directly to the original `fetch` implementation unchanged.

## What V10 does not change

- `/api/state`
- `/api/archive`
- model/provider selection
- existing AI task names
- existing candidate confirmation
- existing AI usage accounting
- existing evidence source labels
- deterministic rate/shift math

## Safety / authority

AI may explain, classify, summarize and recommend. It does not directly write:

- Company Goal
- MES rate
- schedules
- Process Actual
- downtime resolution
- quality disposition
- capacity target

Operational writes continue through explicit user actions and the shared state writer.
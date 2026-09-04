# V10 Production Release Marker

Combined release: premium verification CTA + AI Brief / Shift Copilot reliability.

Validated before promotion:
- V10 mocked/local acceptance run `33860204477`: SUCCESS
- no real `/api/intelligence` POST was fired by assistant for this validation
- earlier premium-only production run `33859375212` was cancelled at Vercel Authenticate; manager/mobile deploy steps were skipped

Release scope:
- eliminate visible flashing between legacy `VERIFY LAST HOUR` / `LAST HOUR VERIFIED` and V10 backlog counts;
- `lsc-v10-mobile.js` `1.3.1` renders the verification CTA slot hidden + empty before paint;
- V10 verification UI is sole owner of backlog visibility/text;
- add `lsc-v10-ai-reliability.js` `1.0.1` to manager + mobile;
- real existing `/api/intelligence` remains primary;
- `summary` / `copilot` gateway failure falls back to live shared evidence with `usageUnits: 0` and **zero second model call**;
- `lsc-v10-ai-world.js` `1.2.0` supplies deliberate AI Brief/Copilot requests with hourly truth, verification trust, process-run context, previous shift, recovery math, handoff overlap and resolution memory;
- preserve existing state/archive/intelligence, resolution guard, verification queue, static browser assets, Company Goal authority and all V8/V9 architecture;
- production smoke must not POST to AI; Frank performs the real AI test live after deployment.

Deployment target remains ONLY the existing projects and regular URLs:
- Manager `prj_ETPejWyItkL7iE586cO4CbGlZWk6` → `https://live-shift-command-v74.vercel.app`
- Mobile `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON` → `https://live-shift-command-v741-mobile.vercel.app`

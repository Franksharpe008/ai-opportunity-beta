# V10 Production Release Marker

Repair feature commit: `71ff4f2cb049c8eb8aad3a52c19e127f85e09bac`
Production smoke-hardening commit: `5cc4d68db6add03c247302b6bf0faf471197b8f0`

Validated before promotion:
- Live Shift V10 Acceptance push run `33855407932`: SUCCESS
- Live Shift V10 Acceptance PR run `33855412983`: SUCCESS
- Live Shift Handoff Guard push run `33855407861`: SUCCESS
- Live Shift Handoff Guard PR run `33855412962`: SUCCESS
- Current-head smoke-hardening Acceptance PR run `33855797385`: SUCCESS
- Current-head Handoff Guard PR run `33855797425`: SUCCESS

Release scope:
- eliminate visible legacy `VERIFY LAST HOUR` / V10 backlog-label bounce;
- show verification CTA only when completed hours actually require verification or pending sync;
- preserve existing intentional `/api/intelligence` resolution enrich call as primary;
- on resolution 422/network/invalid structured response, use a zero-model-call source-grounded fallback that feeds the existing V8 Confirm Resolution + save/Plant Memory workflow;
- no second AI provider, no second model call, no new state/archive/database;
- exact RB10 Vision Test regression sentence is covered by acceptance tests;
- production smoke must prove both regular surfaces load `lsc-v10-resolution-guard.js` and mobile loads `lsc-v10-verification-ui.js`.

Deployment target remains ONLY the existing projects and regular URLs:
- Manager `prj_ETPejWyItkL7iE586cO4CbGlZWk6` → `https://live-shift-command-v74.vercel.app`
- Mobile `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON` → `https://live-shift-command-v741-mobile.vercel.app`

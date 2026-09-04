# V10 Production Relaunch Marker

Purpose: restore premium Live Shift Command behavior on the existing manager/mobile production projects with ECC (Error Correction Code) around AI Brief / Shift Copilot and the premium verification CTA.

Validated before promotion:
- Live Shift V10 Acceptance run `33862245275`: SUCCESS
- Live Shift Handoff Guard run `33862245273`: SUCCESS
- no repeated live AI verification calls were used for this gate

Release scope:
- preserve the same V8 → V9 → V10 application, shared state, Plant Memory/archive and original intelligence backend;
- keep manager Company Goal authoritative at `state.config.shiftGoal`;
- keep premium verification CTA single-owner and eliminate legacy last-hour flicker;
- `lsc-v10-ai-world.js` `1.3.0` attaches live world context to `summary`, `shift_summary`, `copilot`, and `shift_copilot`;
- `lsc-v10-ai-reliability.js` `1.1.0` provides ECC around malformed/empty/non-2xx/timeout/network AI output;
- real `/api/intelligence` remains primary;
- ECC fallback makes no second model call and uses live shared evidence with `usageUnits: 0`;
- no new provider, no new state service, no new archive, no new product;
- production smoke must not spend AI.

Deployment targets ONLY:
- Manager `prj_ETPejWyItkL7iE586cO4CbGlZWk6` → `https://live-shift-command-v74.vercel.app`
- Mobile `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON` → `https://live-shift-command-v741-mobile.vercel.app`

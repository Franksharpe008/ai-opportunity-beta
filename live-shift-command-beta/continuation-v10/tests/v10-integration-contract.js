const fs=require('fs'),path=require('path'),assert=require('assert');
const read=n=>fs.readFileSync(path.join(__dirname,'..',n),'utf8');
const core=read('lsc-v10-core.js'),mobile=read('lsc-v10-mobile.js'),ops=read('lsc-v10-floor-ops.js'),ui=read('lsc-v10-ui.js'),cause=read('lsc-v10-cause-extension.js'),capacity=read('lsc-v10-capacity.js'),capacityUi=read('lsc-v10-capacity-ui.js'),brief=read('lsc-v10-brief.js');
// V10 evolves the existing shared state writer instead of adding a second backend/sync path.
assert(core.includes("SCHEMA='live-shift-command/v10'"));assert(core.includes("fetch('/api/state"));assert(!core.includes('supabase'));assert(!core.includes('firebase'));
// Existing AI provider path is reused; V10 only augments the existing /api/intelligence request context.
assert(core.includes('__lscV10AiContextBridge'));assert(core.includes('api\\/intelligence'));assert(core.includes('process_run_hourly'));for(const src of [core,ops]){assert(!src.includes('workers.ai'));assert(!src.includes('openrouter'));assert(!src.includes('api.openai.com'));}
// Mobile stays floor-focused and manager configuration is read-only. V10 is embedded into Current Hour instead of adding a second dashboard.
assert(mobile.includes("document.querySelector('[data-action=\"goal\"]')?.remove()"));assert(mobile.includes('goal.disabled=true'));assert(mobile.includes('managerGoal()'));assert(mobile.includes('PROCESS ACTUAL'));assert(mobile.includes('VERIFY LAST HOUR'));assert(mobile.includes('AI COMMAND'));assert(mobile.includes('v10mAreaSelect'));assert(mobile.includes('v10m-inline-actions'));assert(mobile.includes('MORE'));assert(!mobile.includes('data-v10-area'));assert(!mobile.includes('v10m-lines'));assert(!mobile.includes('TRIAL HIGHER RATE'));assert(!mobile.includes('CAPACITY INTELLIGENCE'));assert(!mobile.includes('scheduleVersions.push'));assert(!mobile.includes('Measurement'));assert(!mobile.includes('Environment'));
// Existing V8 downtime/quality workflow remains underneath; the new floor layer adds time truth and line targeting rather than a second code library.
assert(!ops.includes('const CODES='));assert(ops.includes('setPendingStart'));assert(ops.includes('setPendingEnd'));assert(ops.includes('recordedAt'));assert(ops.includes('closedRecordedAt'));assert(ops.includes('supervisor_retroactive'));assert(ops.includes("mode:'shift_beta'"));assert(ops.includes('changedBy'));assert(ops.includes('hourVerification'));assert(ops.includes('verified_process_hours'));assert(ops.includes("task:'classify'"));assert(ops.includes("task:'transcribe'"));
// Manager Live Now is enhanced in place, not duplicated with a second six-area grid.
assert(ui.includes('v9-live-actions'));assert(ui.includes('v10-live-inline'));assert(!ui.includes('v10-live-grid'));
// Optional 6M stays an additive manager-only refinement and preserves canonical 4M.
assert(cause.includes("EXT=['Measurement','Environment']"));assert(cause.includes("causeFramework=dimension?'6M':'4M'"));assert(cause.includes('e.fourM||e.causeDimension'));assert(capacity.includes('causeDimensionExtension'));
// Existing Morning Meeting Brief is upgraded in place.
assert(brief.includes("document.getElementById('miBrief')"));assert(!brief.includes('id=\"v10OperatingBrief\"'));
// Capacity intelligence is advisory only.
for(const src of [capacity,capacityUi,brief]){assert(!/config\.mesRate\s*=/.test(src));assert(!/shiftGoal\s*=/.test(src));}
assert(capacity.includes("decision:'HOLD'"));assert(capacity.includes("decision:'INVESTIGATE'"));assert(capacity.includes("decision:'TRIAL HIGHER RATE'"));
console.log('V10 INTEGRATION CONTRACT: PASS');
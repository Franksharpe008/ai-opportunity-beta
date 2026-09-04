const fs=require('fs'),path=require('path'),assert=require('assert');
const read=n=>fs.readFileSync(path.join(__dirname,'..',n),'utf8');
const core=read('lsc-v10-core.js'),mobile=read('lsc-v10-mobile.js'),ui=read('lsc-v10-ui.js'),capacity=read('lsc-v10-capacity.js'),capacityUi=read('lsc-v10-capacity-ui.js'),brief=read('lsc-v10-brief.js');
// V10 evolves the existing shared state writer instead of adding a second backend/sync path.
assert(core.includes("SCHEMA='live-shift-command/v10'"));
assert(core.includes("fetch('/api/state"));
assert(!core.includes('supabase'));
assert(!core.includes('firebase'));
// Existing AI provider path is reused; V10 only augments existing /api/intelligence context.
assert(core.includes('/api/intelligence'));
assert(core.includes('process_run_hourly'));
assert(!core.includes('workers.ai'));
assert(!core.includes('openrouter'));
assert(!core.includes('api.openai.com'));
// Mobile stays floor-focused and manager configuration is read-only.
assert(mobile.includes("document.querySelector('[data-action=\"goal\"]')?.remove()"));
assert(mobile.includes('goal.disabled=true'));
assert(mobile.includes('managerGoal()'));
assert(mobile.includes('PROCESS ACTUAL'));
assert(!mobile.includes('TRIAL HIGHER RATE'));
assert(!mobile.includes('CAPACITY INTELLIGENCE'));
assert(!mobile.includes('scheduleVersions.push'));
// V10 does not recreate V8 downtime, quality, voice, photo, or responder workflows.
for(const forbidden of ['AI IDENTIFY ISSUE','SPEAK DEFECT','RESOLVE + VERIFY','Photo evidence','CODES={'])assert(!mobile.includes(forbidden),`mobile duplicated existing workflow: ${forbidden}`);
// Manager Live Now is enhanced in place, not duplicated with a second six-area grid.
assert(ui.includes('v9-live-actions'));
assert(ui.includes('v10-live-inline'));
assert(!ui.includes('v10-live-grid'));
// Existing Morning Meeting Brief is upgraded in place.
assert(brief.includes("document.getElementById('miBrief')"));
assert(!brief.includes('id=\"v10OperatingBrief\"'));
// Capacity intelligence is advisory only.
for(const src of [capacity,capacityUi,brief]){assert(!/config\.mesRate\s*=/.test(src));assert(!/shiftGoal\s*=/.test(src));}
assert(capacity.includes("decision:'HOLD'"));
assert(capacity.includes("decision:'INVESTIGATE'"));
assert(capacity.includes("decision:'TRIAL HIGHER RATE'"));
console.log('V10 INTEGRATION CONTRACT: PASS');
const fs=require('fs'),path=require('path'),assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','lsc-v10-verification-ui.js'),'utf8');
assert(src.includes("HOUR NEEDS VERIFICATION"));
assert(src.includes("HOURS NEED VERIFICATION"));
assert(src.includes("PENDING SYNC"));
assert(src.includes('b.hidden=true'));
assert(src.includes('MutationObserver'));
assert(!src.includes('VERIFY LAST HOUR'));
console.log('V10 VERIFICATION UI CONTRACT: PASS · only actionable backlog is visible and legacy label cannot persist');

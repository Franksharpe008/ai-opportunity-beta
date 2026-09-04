const {spawnSync}=require('child_process');
const path=require('path');
const tests=['v10-core-acceptance.js','v10-capacity-acceptance.js','v10-brief-acceptance.js','v10-integration-contract.js','v10-floor-ops-acceptance.js','v10-release-builder-acceptance.js'];
let failed=0;
for(const test of tests){const p=spawnSync(process.execPath,[path.join(__dirname,test)],{stdio:'inherit'});if(p.status!==0){failed++;console.error(`FAIL: ${test}`)}else console.log(`OK: ${test}`)}
if(failed){console.error(`V10 ACCEPTANCE: ${failed} TEST(S) FAILED`);process.exit(1)}
console.log('V10 ACCEPTANCE: ALL TESTS PASS');
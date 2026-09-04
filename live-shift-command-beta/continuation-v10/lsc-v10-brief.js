/* Live Shift Command V10.3 — deterministic operating brief */
(()=>{'use strict';
if(!document.getElementById('events'))return;
const V='lsc-v10-brief-1.0.1';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const round=(n,d=1)=>Number.isFinite(+n)?Math.round(+n*10**d)/10**d:null;
const current=()=>state?.current||null;
function activeStops(){return(current()?.events||[]).filter(e=>e.type==='downtime'&&!e.endedAt)}
function currentActual(){const p=current()?.production||[],v=p.filter(x=>x?.good!=null&&x?.good!==''&&Number.isFinite(+x.good));return{known:v.length>0,good:v.reduce((n,x)=>n+(+x.good||0),0)}}
function manager(){try{return window.LSC_MANAGER_SNAPSHOT?.()||null}catch{return null}}
async function capacity(){try{return window.LSC_V10_LAST_CAPACITY||await window.LSC_V10_CAPACITY_SNAPSHOT?.()||null}catch{return null}}
function processRuns(){try{return window.LSC_V10_PROCESS_RUNS?.()||[]}catch{return[]}}
function topIssue(m){return m?.issues?.[0]||null}
function topResponse(m){return m?.responses?.find(x=>x.sample>=3)||m?.responses?.[0]||null}
function topQuality(m){return m?.quality?.[0]||null}
function latestWorked(m){return m?.milestones?.[0]||null}
function capacityText(c){if(!c)return'Rate / capacity intelligence is unavailable.';const d=c.decision||{};let t=`${d.decision||'HOLD'} (${d.confidence||'BUILDING'}). ${d.reason||''}`;if(d.suggestedRate!=null)t+=` Controlled trial rate: ${d.suggestedRate}/hr; current company target: ${c.targetRate}/hr.`;return t}
function processText(runs){const active=runs.filter(r=>r.downtime_minutes>0||r.process_actual!=null||r.scrap||r.rework);if(!active.length)return'Process-run evidence is building; no process-attributed Actual or captured loss is established on the current shift.';return active.slice(0,4).map(r=>`${r.area}: Actual ${r.process_actual??'not attributed'} · ${r.downtime_minutes||0}m downtime · ${r.scrap||0}/${r.rework||0} scrap/rework${r.top_code?` · top ${r.top_code}`:''}`).join(' | ')}
function block(title,text){return{title,text:String(text||'No evidence available.')}}
function build(m,c,runs){const a=activeStops(),act=currentActual(),issue=topIssue(m),resp=topResponse(m),q=topQuality(m),workedPoint=latestWorked(m),tot=m?.totals||{},trend=m?.trend||{},proof=[];
 proof.push(`${m?.days||30}-day manager evidence: ${tot.shifts||0} shift record(s), ${tot.downtime||0}m downtime, ${tot.loss||0} opportunity units lost.`);
 if(c)proof.push(`Capacity gate: ${c.qualifyingShifts||0} qualifying completed shift sample(s); higher-rate trial requires established evidence across all three shifts.`);
 proof.push(act.known?`Current shift Actual is known: ${act.good}.`:'Current shift Actual is missing and is not treated as zero.');
 const status=a.length?`STOPPED / RESPONSE ACTIVE — ${a.map(e=>`${e.affectedProcess||e.area||'Process'} ${e.issueCode||e.reason||'downtime'}`).join(' · ')}`:`${c?.decision?.decision||'STABLE / BUILDING'} — no active downtime is captured on the current shift.`;
 const happened=[`${tot.shifts||0} recorded shift(s) in the selected manager window`,`${tot.downtime||0}m unique downtime`,`${tot.scrap||0} scrap`,`${tot.rework||0} rework`,`${tot.verified||0} permanent verification(s)`,processText(runs)].join(' · ');
 const changed=[trend.downtime==null?'Downtime comparison building':`Downtime ${Math.abs(trend.downtime)}% ${trend.downtime<0?'lower':'higher'} vs prior 7 days`,trend.loss==null?'Opportunity-loss comparison building':`Opportunity loss ${Math.abs(trend.loss)}% ${trend.loss<0?'lower':'higher'} vs prior 7 days`,trend.scrap==null?'Scrap comparison building':`Scrap ${Math.abs(trend.scrap)}% ${trend.scrap<0?'lower':'higher'} vs prior 7 days`,trend.rework==null?'Rework comparison building':`Rework ${Math.abs(trend.rework)}% ${trend.rework<0?'lower':'higher'} vs prior 7 days`].join(' · ');
 const repeated=issue?`${issue.code} ${issue.name} · ${issue.occurrences} occurrence(s) · ${round(issue.minutes,1)} event-minutes across ${issue.shifts} shift(s)${issue.verified?` · ${issue.verified} permanent verification(s)`:' · no permanent verification captured'}.`:'No coded recurring downtime family is established in the selected window.';
 const workedText=workedPoint?`${workedPoint.code||'EVENT'} ${workedPoint.name||''} · ${workedPoint.verification||workedPoint.result||workedPoint.action||'verified recovery point'} · ${workedPoint.shift||''} ${workedPoint.area||''}.`:'No verified improvement / solution point is established yet.';
 const opportunity=`${capacityText(c)} Captured loss mix: downtime ${c?.lossTotals?.downtime||0} units · quality ${c?.lossTotals?.quality||0} units · rate ${c?.lossTotals?.rate||0} units.${q?` Highest captured quality burden: ${q.shift} / ${q.area} · ${q.qty} pieces.`:''}`;
 const response=resp?`${resp.team} / ${resp.shift} · ${resp.sampleLabel||'BUILDING'} · ${resp.sample} qualifying response(s) · median call-to-arrival ${round(resp.arrival,1)??'—'}m · work-to-restore ${round(resp.recovery,1)??'—'}m · 24-hour hold ${resp.hold==null?'building':resp.hold+'%'}.`:'Response timing evidence is still building.';
 const attention=[];if(a.length)attention.push('Drive active recovery through verified production restart.');if(c?.decision?.decision==='INVESTIGATE'&&c.decision.weakShift)attention.push(`Investigate ${c.decision.weakShift} constraint and its loss mix before raising rate.`);if(c?.decision?.decision==='HOLD'&&c.decision.confidence==='BUILDING')attention.push('Close production Actual evidence gaps before judging plant capacity.');if(issue&&!issue.verified)attention.push(`Establish durable verification for ${issue.code}.`);if(q?.open)attention.push('Close open quality containment / disposition.');if(!attention.length)attention.push('Maintain controls and watch recurrence, quality, rate, and verification.');
 return{version:V,generatedAt:new Date().toISOString(),blocks:[block('STATUS',status),block('WHAT HAPPENED',happened),block('WHAT CHANGED',changed),block('WHAT REPEATED',repeated),block('WHAT WORKED',workedText),block('OPPORTUNITY',opportunity),block('RESPONSE',response),block('MANAGEMENT ATTENTION',attention.slice(0,4).join(' ')),block('PROOF',proof.join(' '))],capacity:c,processRuns:runs}}
function text(b){return b.blocks.map(x=>`${x.title}\n${x.text}`).join('\n\n')}
function html(b){return`<div class="v10-brief">${b.blocks.map(x=>`<section><b>${esc(x.title)}</b><p>${esc(x.text)}</p></section>`).join('')}</div><div class="v10-brief-actions"><button id="v10BriefCopy">COPY BRIEF</button><button id="v10BriefPrint">PRINT / PDF</button></div>`}
async function get(){return build(manager(),await capacity(),processRuns())}
async function open(){const b=await get(),t=text(b);show('V10 Operating Brief',html(b),'MANAGER · EVIDENCE-FIRST · CAPACITY-GATED');document.getElementById('v10BriefCopy').onclick=async()=>{try{await navigator.clipboard.writeText(t);document.getElementById('v10BriefCopy').textContent='COPIED ✓'}catch{}};document.getElementById('v10BriefPrint').onclick=()=>{const w=window.open('','_blank');if(!w)return;w.document.write(`<title>Live Shift Command · V10 Operating Brief</title><style>body{font:15px system-ui;padding:32px;max-width:900px;margin:auto}h1{font-size:24px}.b{border:1px solid #bbb;border-radius:12px;padding:13px;margin:10px 0}.b b{font-size:11px;letter-spacing:.09em}.b p{line-height:1.55;margin:6px 0 0}</style><h1>Live Shift Command · V10 Operating Brief</h1>${b.blocks.map(x=>`<div class="b"><b>${esc(x.title)}</b><p>${esc(x.text)}</p></div>`).join('')}`);w.document.close();w.focus();w.print()}}
function install(){const h=document.querySelector('#v10Capacity .cap-head');if(!h||document.getElementById('v10OperatingBrief'))return;h.insertAdjacentHTML('beforeend','<button class="v10-brief-main" id="v10OperatingBrief">V10 OPERATING BRIEF</button>');document.getElementById('v10OperatingBrief').onclick=open}
window.LSC_V10_BRIEF_BUILD=build;
window.LSC_V10_OPERATING_BRIEF=async()=>{const b=await get();return{text:text(b),data:b}};
install();setInterval(install,2000);
console.info(`[LSC] ${V} active · status→proof brief with capacity gate`);
})();
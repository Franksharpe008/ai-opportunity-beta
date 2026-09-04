/* Live Shift Command V10 — verification backlog indicator guard */
(()=>{'use strict';
const mobile=!!document.querySelector('[data-action="start-stop"]');if(!mobile)return;
if(window.__lscV10VerificationUi)return;window.__lscV10VerificationUi=true;
const V='lsc-v10-verification-ui-1.1.0';
function setText(el,text){if(el.textContent!==text)el.textContent=text}
function setHidden(el,hidden){if(el.hidden!==hidden)el.hidden=hidden;const a=hidden?'true':'false';if(el.getAttribute('aria-hidden')!==a)el.setAttribute('aria-hidden',a)}
function setPrimary(el,on){if(on){if(!el.classList.contains('primary'))el.classList.add('primary')}else if(el.classList.contains('primary'))el.classList.remove('primary')}
function sync(){try{const b=document.getElementById('v10mVerifyHour'),q=window.LSC_V10_VERIFICATION_QUEUE;if(!b||!q?.summary)return;const s=q.summary();if(b.dataset.v10Queue!=='1')b.dataset.v10Queue='1';b.onclick=()=>q.open();if(s.to_verify>0){setHidden(b,false);setPrimary(b,true);setText(b,s.to_verify===1?'1 HOUR NEEDS VERIFICATION':`${s.to_verify} HOURS NEED VERIFICATION`);return}if(s.pending_sync>0){setHidden(b,false);setPrimary(b,false);setText(b,s.pending_sync===1?'1 HOUR PENDING SYNC':`${s.pending_sync} HOURS PENDING SYNC`);return}setHidden(b,true);setPrimary(b,false);setText(b,'')}catch(e){console.warn('[LSC Verification UI] isolated; shared-state sync unaffected',e?.message||e)}}
setTimeout(sync,0);setInterval(sync,1000);
window.LSC_V10_VERIFICATION_UI={version:V,sync};
console.info(`[LSC] ${V} active · no self-observing mutation loop · backlog indicator only when action is required`);
})();

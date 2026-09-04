/* Live Shift Command V10 — verification backlog indicator guard */
(()=>{'use strict';
const mobile=!!document.querySelector('[data-action="start-stop"]');if(!mobile)return;
if(window.__lscV10VerificationUi)return;window.__lscV10VerificationUi=true;
const V='lsc-v10-verification-ui-1.0.0';
let observer=null;
function setText(el,text){if(el.textContent!==text)el.textContent=text}
function sync(){const b=document.getElementById('v10mVerifyHour'),q=window.LSC_V10_VERIFICATION_QUEUE;if(!b||!q?.summary)return;const s=q.summary();b.dataset.v10Queue='1';b.onclick=()=>q.open();if(s.to_verify>0){b.hidden=false;b.setAttribute('aria-hidden','false');b.classList.add('primary');setText(b,s.to_verify===1?'1 HOUR NEEDS VERIFICATION':`${s.to_verify} HOURS NEED VERIFICATION`);return}if(s.pending_sync>0){b.hidden=false;b.setAttribute('aria-hidden','false');b.classList.remove('primary');setText(b,s.pending_sync===1?'1 HOUR PENDING SYNC':`${s.pending_sync} HOURS PENDING SYNC`);return}b.hidden=true;b.setAttribute('aria-hidden','true');b.classList.remove('primary');setText(b,'')}
function install(){if(observer)return;const host=document.getElementById('v10mInline');if(!host)return;observer=new MutationObserver(()=>queueMicrotask(sync));observer.observe(host,{subtree:true,childList:true,characterData:true,attributes:true});sync()}
setTimeout(install,0);setInterval(()=>{install();sync()},1000);
window.LSC_V10_VERIFICATION_UI={version:V,sync};
console.info(`[LSC] ${V} active · backlog indicator only when action is required`);
})();

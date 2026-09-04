import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(process.cwd());
const out=path.resolve(root,'dist-inplace');
const mobileOut=path.join(out,'mobile');
const managerOut=path.join(out,'manager');

const MOBILE_LIVE='https://live-shift-command-v741-mobile.vercel.app';
const MANAGER_LIVE='https://live-shift-command-v74.vercel.app';
const MANAGER_V9='https://live-shift-command-v74-jd65bh7ol-franksharpe008s-projects.vercel.app';
const ORG='team_QlAarwuD75fLVrZQEi7r3OOh';
const MOBILE_PROJECT='prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON';
const MANAGER_PROJECT='prj_ETPejWyItkL7iE586cO4CbGlZWk6';

const MOBILE_V10_CSS=['lsc-v10-mobile.css','lsc-v10-hourly-performance.css'];
const MOBILE_V10_JS=['lsc-v10-core.js','lsc-v10-ai-world.js','lsc-v10-ai-reliability.js','lsc-v10-resolution-guard.js','lsc-v10-mobile.js','lsc-v10-floor-ops.js','lsc-v10-hourly-performance.js','lsc-v10-verification-queue.js','lsc-v10-verification-ui.js'];
const MANAGER_V10_CSS=['lsc-command-v10.css','lsc-v10-capacity.css','lsc-v10-brief.css'];
const MANAGER_V10_JS=['lsc-v10-core.js','lsc-v10-ai-world.js','lsc-v10-ai-reliability.js','lsc-v10-resolution-guard.js','lsc-v10-floor-ops.js','lsc-v10-ui.js','lsc-v10-verification-queue.js','lsc-v10-cause-extension.js','lsc-v10-capacity.js','lsc-v10-capacity-ui.js','lsc-v10-brief.js'];
const BASE_MOBILE=['app1.js','app2.js','app3.js','lsc-intelligence.js','lsc-v8.js','lsc-command-v9.js','style.css','lsc-v8.css','lsc-command-v9.css'];
const BASE_MANAGER=[...BASE_MOBILE,'manager-intelligence.js','manager-intelligence.css'];

fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(mobileOut,{recursive:true});
fs.mkdirSync(managerOut,{recursive:true});

async function text(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${url} -> ${r.status}`);return r.text()}
function copy(name,dir){const src=path.join(root,name);if(!fs.existsSync(src))throw new Error(`missing V10 asset ${name}`);fs.copyFileSync(src,path.join(dir,name))}
function writeProject(dir,projectId){fs.mkdirSync(path.join(dir,'.vercel'),{recursive:true});fs.writeFileSync(path.join(dir,'.vercel','project.json'),JSON.stringify({orgId:ORG,projectId},null,2)+'\n')}
function stripExistingV10(html){return html
  .replace(/<!--\s*LSC V10[^>]*-->/gi,'')
  .replace(/<link\b[^>]*href="[^"]*(?:continuation-v10\/|\/lsc-(?:v10|command-v10)[^"]*)[^"]*"[^>]*>/gi,'')
  .replace(/<script\b[^>]*src="[^"]*(?:continuation-v10\/|\/lsc-(?:v10|command-v10)[^"]*)[^"]*"[^>]*><\/script>/gi,'')}
function localizeBaseRefs(html,allowed){return html.replace(/(href|src)="\/api\/base\?file=([^"&]+)"/gi,(m,a,f)=>{let name='';try{name=decodeURIComponent(f)}catch{name=f}return allowed.includes(name)?`${a}="/${name}"`:m})}
function injectBefore(html,needle,marker,block){if(html.includes(marker))return html;const i=html.lastIndexOf(needle);if(i<0)throw new Error(`missing ${needle}`);return html.slice(0,i)+block+html.slice(i)}
function prepareHtml(html,{surface,css,js,base}){html=localizeBaseRefs(stripExistingV10(html),base);const cssBlock=`\n<!-- LSC V10 SAFE ${surface} CSS -->\n${css.map(f=>`<link rel="stylesheet" href="/${f}">`).join('\n')}\n`;const jsBlock=`\n<!-- LSC V10 SAFE ${surface} JS -->\n${js.map(f=>`<script src="/${f}"></script>`).join('\n')}\n`;html=injectBefore(html,'</head>',`LSC V10 SAFE ${surface} CSS`,cssBlock);return injectBefore(html,'</body>',`LSC V10 SAFE ${surface} JS`,jsBlock)}
async function materializeBase(live,dir,allowed){for(const name of allowed){const body=await text(`${live}/${encodeURIComponent(name)}`);fs.writeFileSync(path.join(dir,name),body)}}
function proxyHelper(){return `import {getVercelOidcToken} from '@vercel/oidc';\nexport async function protectedProxy(req,res,origin,path){try{const token=await getVercelOidcToken();if(!token)return res.status(500).json({error:'missing_oidc'});const headers={'x-vercel-trusted-oidc-idp-token':token};if(req.headers['content-type'])headers['content-type']=req.headers['content-type'];let body;if(!['GET','HEAD'].includes(req.method)&&req.body!=null)body=typeof req.body==='string'?req.body:JSON.stringify(req.body);const r=await fetch(origin+path,{method:req.method,headers,body,cache:'no-store'});const data=Buffer.from(await r.arrayBuffer());res.status(r.status);res.setHeader('content-type',r.headers.get('content-type')||'application/octet-stream');res.setHeader('cache-control','no-store');return res.send(data)}catch(e){return res.status(502).json({error:'protected_proxy_failed'})}}\nexport async function publicProxy(req,res,origin,path){try{const headers={};if(req.headers['content-type'])headers['content-type']=req.headers['content-type'];let body;if(!['GET','HEAD'].includes(req.method)&&req.body!=null)body=typeof req.body==='string'?req.body:JSON.stringify(req.body);const r=await fetch(origin+path,{method:req.method,headers,body,cache:'no-store'});const data=Buffer.from(await r.arrayBuffer());res.status(r.status);res.setHeader('content-type',r.headers.get('content-type')||'application/octet-stream');res.setHeader('cache-control','no-store');return res.send(data)}catch(e){return res.status(502).json({error:'public_proxy_failed'})}}\n`}
function apiFunction(kind,origin,protectedMode){const fn=protectedMode?'protectedProxy':'publicProxy';return `import {${fn}} from './_proxy.js';\nconst ORIGIN='${origin}';\nexport default function handler(req,res){const u=new URL(req.url,'http://local');return ${fn}(req,res,ORIGIN,'/api/${kind}'+u.search)}\n`}
function writeProtectedManagerApi(dir){const api=path.join(dir,'api');fs.mkdirSync(api,{recursive:true});fs.writeFileSync(path.join(api,'_proxy.js'),proxyHelper());for(const n of ['state','archive','intelligence'])fs.writeFileSync(path.join(api,`${n}.js`),apiFunction(n,MANAGER_V9,true))}
function writeMobileApi(dir){const api=path.join(dir,'api');fs.mkdirSync(api,{recursive:true});fs.writeFileSync(path.join(api,'_proxy.js'),proxyHelper());for(const n of ['state','archive','intelligence'])fs.writeFileSync(path.join(api,`${n}.js`),apiFunction(n,MANAGER_LIVE,false))}
function writeRuntimeFiles(dir){fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({private:true,type:'module',dependencies:{'@vercel/oidc':'latest'}},null,2)+'\n');fs.writeFileSync(path.join(dir,'vercel.json'),JSON.stringify({cleanUrls:true,headers:[{source:'/api/(.*)',headers:[{key:'Cache-Control',value:'no-store'}]},{source:'/(.*).css',headers:[{key:'Cache-Control',value:'public, max-age=0, must-revalidate'}]},{source:'/(.*).js',headers:[{key:'Cache-Control',value:'public, max-age=0, must-revalidate'}]}]},null,2)+'\n')}

let manager=prepareHtml(await text(MANAGER_LIVE+'/'),{surface:'MANAGER',css:MANAGER_V10_CSS,js:MANAGER_V10_JS,base:BASE_MANAGER});
await materializeBase(MANAGER_LIVE,managerOut,BASE_MANAGER);fs.writeFileSync(path.join(managerOut,'index.html'),manager);for(const n of [...MANAGER_V10_CSS,...MANAGER_V10_JS])copy(n,managerOut);writeProtectedManagerApi(managerOut);writeRuntimeFiles(managerOut);writeProject(managerOut,MANAGER_PROJECT);

let mobile=prepareHtml(await text(MOBILE_LIVE+'/'),{surface:'MOBILE',css:MOBILE_V10_CSS,js:MOBILE_V10_JS,base:BASE_MOBILE});
await materializeBase(MOBILE_LIVE,mobileOut,BASE_MOBILE);fs.writeFileSync(path.join(mobileOut,'index.html'),mobile);for(const n of [...MOBILE_V10_CSS,...MOBILE_V10_JS])copy(n,mobileOut);writeMobileApi(mobileOut);writeRuntimeFiles(mobileOut);writeProject(mobileOut,MOBILE_PROJECT);

for(const [label,dir] of [['manager',managerOut],['mobile',mobileOut]])console.log(`${label}: ${dir}`);
console.log('SAFE IN-PLACE TOPOLOGY: V9 browser assets are harvested from current static production paths; manager protects original V9 APIs with OIDC; mobile uses live manager authority; V10 remains additive.');

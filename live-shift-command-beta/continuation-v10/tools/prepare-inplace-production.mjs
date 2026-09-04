import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(process.cwd());
const out=path.resolve(root,'dist-inplace');
const mobileOut=path.join(out,'mobile');
const managerOut=path.join(out,'manager');
const MOBILE_BASE='https://live-shift-command-v741-mobile-5xuo8fp2t.vercel.app';
const MANAGER_BASE='https://live-shift-command-v74-jd65bh7ol-franksharpe008s-projects.vercel.app';
const ORG='team_QlAarwuD75fLVrZQEi7r3OOh';
const MOBILE_PROJECT='prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON';
const MANAGER_PROJECT='prj_ETPejWyItkL7iE586cO4CbGlZWk6';

fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(mobileOut,{recursive:true});
fs.mkdirSync(managerOut,{recursive:true});

async function text(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${url} -> ${r.status}`);return r.text()}
function absolutize(html,base){return html.replace(/(href|src)="\/(?!\/)/g,`$1="${base}/`)}
function injectBefore(html,needle,marker,block){if(html.includes(marker))return html;const i=html.lastIndexOf(needle);if(i<0)throw new Error(`missing ${needle}`);return html.slice(0,i)+block+html.slice(i)}
function copy(name,dir){fs.copyFileSync(path.join(root,name),path.join(dir,name))}
function writeProject(dir,projectId){fs.mkdirSync(path.join(dir,'.vercel'),{recursive:true});fs.writeFileSync(path.join(dir,'.vercel','project.json'),JSON.stringify({orgId:ORG,projectId},null,2)+'\n')}
function proxyCode(base){return `export default async function handler(req,res){\n  const u=new URL(req.url,'http://local');\n  const target='${base}'+u.pathname+u.search;\n  const headers={'content-type':req.headers['content-type']||'application/json'};\n  const body=(req.method==='GET'||req.method==='HEAD')?undefined:(typeof req.body==='string'?req.body:JSON.stringify(req.body??{}));\n  const r=await fetch(target,{method:req.method,headers,body,redirect:'manual'});\n  res.statusCode=r.status;\n  const ct=r.headers.get('content-type'); if(ct)res.setHeader('content-type',ct);\n  res.setHeader('cache-control','no-store');\n  const b=Buffer.from(await r.arrayBuffer());\n  res.end(b);\n}\n`}
function writeApi(dir,base){const api=path.join(dir,'api');fs.mkdirSync(api,{recursive:true});for(const n of ['state','archive','intelligence'])fs.writeFileSync(path.join(api,`${n}.js`),proxyCode(base))}

let mobile=absolutize(await text(MOBILE_BASE+'/'),MOBILE_BASE);
mobile=injectBefore(mobile,'</head>','LSC V10 INPLACE MOBILE CSS','\n<!-- LSC V10 INPLACE MOBILE CSS -->\n<link rel="stylesheet" href="/lsc-v10-mobile.css">\n');
mobile=injectBefore(mobile,'</body>','LSC V10 INPLACE MOBILE JS','\n<!-- LSC V10 INPLACE MOBILE JS -->\n<script src="/lsc-v10-core.js"></script>\n<script src="/lsc-v10-mobile.js"></script>\n<script src="/lsc-v10-floor-ops.js"></script>\n');
fs.writeFileSync(path.join(mobileOut,'index.html'),mobile);
for(const n of ['lsc-v10-mobile.css','lsc-v10-core.js','lsc-v10-mobile.js','lsc-v10-floor-ops.js'])copy(n,mobileOut);
writeApi(mobileOut,MOBILE_BASE);
writeProject(mobileOut,MOBILE_PROJECT);

let manager=absolutize(await text(MANAGER_BASE+'/'),MANAGER_BASE);
manager=injectBefore(manager,'</head>','LSC V10 INPLACE MANAGER CSS','\n<!-- LSC V10 INPLACE MANAGER CSS -->\n<link rel="stylesheet" href="/lsc-command-v10.css">\n<link rel="stylesheet" href="/lsc-v10-capacity.css">\n<link rel="stylesheet" href="/lsc-v10-brief.css">\n');
manager=injectBefore(manager,'</body>','LSC V10 INPLACE MANAGER JS','\n<!-- LSC V10 INPLACE MANAGER JS -->\n<script src="/lsc-v10-core.js"></script>\n<script src="/lsc-v10-floor-ops.js"></script>\n<script src="/lsc-v10-ui.js"></script>\n<script src="/lsc-v10-cause-extension.js"></script>\n<script src="/lsc-v10-capacity.js"></script>\n<script src="/lsc-v10-capacity-ui.js"></script>\n<script src="/lsc-v10-brief.js"></script>\n');
fs.writeFileSync(path.join(managerOut,'index.html'),manager);
for(const n of ['lsc-command-v10.css','lsc-v10-capacity.css','lsc-v10-brief.css','lsc-v10-core.js','lsc-v10-floor-ops.js','lsc-v10-ui.js','lsc-v10-cause-extension.js','lsc-v10-capacity.js','lsc-v10-capacity-ui.js','lsc-v10-brief.js'])copy(n,managerOut);
writeApi(managerOut,MANAGER_BASE);
writeProject(managerOut,MANAGER_PROJECT);

for(const [label,dir] of [['mobile',mobileOut],['manager',managerOut]]){
  fs.writeFileSync(path.join(dir,'vercel.json'),JSON.stringify({cleanUrls:true,headers:[{source:'/api/(.*)',headers:[{key:'Cache-Control',value:'no-store'}]}]},null,2)+'\n');
  console.log(`${label}: ${dir}`);
}

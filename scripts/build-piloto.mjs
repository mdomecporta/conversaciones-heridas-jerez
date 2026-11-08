import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {Script} from 'node:vm';
import {extractPilot} from './guion-piloto.mjs';
const root=new URL('../',import.meta.url),dir='prototipos/piloto-capitulo/';
const read=p=>readFile(new URL(p,root),'utf8');
const base64=async p=>(await readFile(new URL(p,root))).toString('base64');
const data=extractPilot(await read('guion/GUION_CONSOLIDADO_22_CAPITULOS.md'));
const base='../recorrido/';
data.assets=JSON.parse(await read('resources.json')).assets;
for(const a of Object.values(data.assets))a.src=base+'imagenes/'+a.file;
data.recommendations=JSON.parse(await read('guion/mapa-47-consolidado.json'));
if(data.recommendations.items.length!==47||data.recommendations.items.filter(r=>r.illuminate).length!==13)throw Error('La apertura necesita 47 recomendaciones y 13 seleccionadas.');
const matrix=await read('docs/matriz-consolidacion-06-nov.md');
data.sources=[...matrix.matchAll(/^\*\*B\d+ · ([\s\S]+?)(?=\n\n|$)/gm)].map(m=>({text:m[0].split(/Original local:|Cotejad|Consultad|Revisad|El resumen|Denominación|Fuente de|Referencia de la original|, consultada/)[0].trim().replace(/\*/g,'').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'$1').replace(/`/g,''),url:m[0].match(/\]\((https:\/\/[^)]+)\)/)?.[1]}));
const pdfs=['gneaupp.dt14.nohacer-2020.pdf','gneaupp.dt08.antimicrobianos-1.pdf','gneaupp.dt17.limpieza.pdf','Antimicrobials-and-Non-healing_230922_online_20221209.pdf','EWMA_Wound_Infection_Fact_Sheets_1-7_JWM_suppl_vol_27_no_1.pdf','IWII_2025_Wound-cleansing-web-2.pdf'];
pdfs.forEach((file,i)=>data.sources[i].url=base+'guias/'+file);
data.institutional={open:base+'institutional-open.jpg',close:base+'institutional-close.jpg'};
data.brands=JSON.parse(await read(dir+'iconos/fuentes.json'));for(const b of Object.values(data.brands))b.src=base+'iconos/'+b.file;
data.sourceBrands={B1:'gneaupp',B2:'gneaupp',B3:'gneaupp',B4:'ewma',B5:'ewma',B6:'iwii',B7:'ewma',B8:'ewma',B9:'gneaupp',B10:'jwc',B11:'reben',B12:'ewma',B13:'gerokomos'};
data.sources.forEach((source,i)=>{source.id='B'+(i+1);source.brand=data.sourceBrands[source.id];});
for(const chapter of data.chapters)chapter.avatar=chapter.avatar.map(path=>base+'rutina/'+path.replace('personajes/rutina/',''));
const out=new URL('dist/recorrido/',root);
await mkdir(out,{recursive:true});
async function copy(from,to){const dest=new URL(to,out);await mkdir(new URL('./',dest),{recursive:true});await cp(new URL(from,root),dest);}
for(const b of Object.values(data.brands))await copy(dir+'iconos/'+b.file,'iconos/'+b.file);
for(const a of Object.values(data.assets))await copy('assets/resources/'+a.file,'imagenes/'+a.file);
for(const file of pdfs)await copy('../bibliography/'+file,'guias/'+file).catch(()=>console.warn('Recorrido: no está la guía '+file+' (bibliography/ queda fuera del repositorio).'));
// Derivados ligeros versionados: mismo tamaño y mismas rutas en macOS y Netlify.
const copiedAvatars=new Set();
for(const chapter of data.chapters){
 const avatars=[];
 for(const path of chapter.avatar){
  const relative=path.split('rutina/')[1].replace(/\.png$/,'.jpg');
  const from='personajes/rutina/web/'+relative;
  if(!copiedAvatars.has(relative)){
   try{await copy(from,'rutina/'+relative);}catch(cause){throw Error('No se puede copiar el derivado de Rutina: '+from,{cause});}
   copiedAvatars.add(relative);
  }
  avatars.push(base+'rutina/'+relative);
 }
 chapter.avatar=avatars;
}
for(const name of ['open','close'])await copy('assets/institutional-'+name+'.jpg','institutional-'+name+'.jpg');
// Arquitectura original + adaptación de cinco segundos. Los prototipos de portada se conservan.
await mkdir(new URL('claustro/',out),{recursive:true});
const cloisterHtml='<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Claustro · Inmersión</title><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#f6f0e8}canvas{display:block;width:100%;height:100%}#wound-guide{position:fixed;pointer-events:none;transform:translate(-50%,-50%);z-index:2;overflow:visible}#wound-guide canvas{width:100%;height:100%}</style><script type="importmap">{"imports":{"three":"./vendor/three/build/three.module.js","three/addons/":"./vendor/three/examples/jsm/"}}</script><body><div id="wound-guide" class="orb-zone" data-renderer="liquid" data-variant="3" data-ink="1" data-eyes="false" data-face-reveal="0" data-quality="presentation" data-voice="principal" data-state="idle"></div><script src="presence.js"></script><script src="liquid.js"></script><script type="module" src="scene.js"></script></body></html>';
await writeFile(new URL('claustro/index.html',out),cloisterHtml);
await copy('entity.js','claustro/presence.js');
await copy(dir+'entity-liquid-piloto.js','claustro/liquid.js');
const originalCloister=await read('prototipos/claustro-3d/scene.js'),cut=originalCloister.indexOf('// ── The immersion');
if(cut<0)throw Error('No encuentro el final de la arquitectura del Claustro.');
const architecture=originalCloister.slice(0,cut).replace('Math.min(devicePixelRatio,1.6)','Math.min(devicePixelRatio,1.2)').replace('set(4096,4096)','set(1024,1024)');
const immersion=(await read('prototipos/claustro-3d/recorrido-inmersion.js')).replace('const DIVE_MS=4600,',`const DIVE_MS=${data.chapters[0].structure.travelMs},`);
await writeFile(new URL('claustro/scene.js',out),architecture+'\n'+immersion);
for(const file of ['comision-blanco.png','mapa-ags-luz.svg'])await copy('prototipos/claustro-3d/'+file,'claustro/'+file);
data.cloisterAssets={commission:base+'claustro/comision-blanco.png',map:base+'claustro/mapa-ags-luz.svg'};
const vendored=new Set();async function vendor(rel){if(vendored.has(rel))return;vendored.add(rel);const code=await read('node_modules/three/'+rel);await copy('node_modules/three/'+rel,'claustro/vendor/three/'+rel);for(const [,dep] of code.matchAll(/from\s*['"](\.{1,2}\/[^'"]+)['"]/g))await vendor(new URL(dep,new URL(rel,'https://local/')).pathname.slice(1));}
await vendor('build/three.module.js');await vendor('examples/jsm/controls/OrbitControls.js');
let html=await read(dir+'revision.html'),css=await read(dir+'revision.css');
for(const file of ['fraunces-latin-wght-normal.woff2','fraunces-latin-wght-italic.woff2','figtree-latin-wght-normal.woff2'])css=css.replaceAll('../../assets/fonts/'+file,'data:font/woff2;base64,'+await base64('assets/fonts/'+file));
const inline=(tag,text)=>`<${tag}>${text.replace(/<\/(script|style)/gi,'<\\/$1')}</${tag}>`;
for(const [from,to] of [
 ['<link rel="stylesheet" href="../../tokens.css">',inline('style',await read('tokens.css'))],
 ['<link rel="stylesheet" href="revision.css">',inline('style',css)],
 ['<script src="entity-liquid-piloto.js"></script>',inline('script',await read(dir+'entity-liquid-piloto.js'))],
 ['<script src="../../entity.js"></script>',inline('script',await read('entity.js'))],
 ['<script src="ponente.js"></script>',inline('script',await read(dir+'ponente.js'))],
 ['<script src="recorrido-recursos.js"></script>',inline('script',await read(dir+'recorrido-recursos.js'))],
 ['<script src="revision.js"></script>',inline('script',await read(dir+'revision.js'))],
 ['<script id="pilot-data" type="application/json">null</script>',`<script id="pilot-data" type="application/json">${JSON.stringify(data).replaceAll('<','\\u003c')}</script>`],
 ['../../personajes/rutina/frames-escenas-02-04-v1/escena-03/01-como-siempre.png',data.chapters[9].avatar[0]],
 ['../../personajes/rutina/frames-escenas-02-04-v1/escena-03/02-reconoce-omision.png',data.chapters[9].avatar[1]]
 ]){if(!html.includes(from))throw Error('Recorrido: no encuentro '+from);html=html.replaceAll(from,()=>to);}
for(const [,attributes,code] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g))if(!attributes.includes('application/json'))new Script(code);
for(const route of ['piloto','recorrido']){
 const dest=new URL('dist/'+route+'/',root);await mkdir(dest,{recursive:true});
 await writeFile(new URL('index.html',dest),route==='recorrido'?html.replace('data-initial-chapter="10"','data-initial-chapter="1"'):html);
 for(const file of ['recursos/piel-base-v1.png','recursos/granulacion-v1.png','iconos/gneaupp.png','iconos/iwii.png']){await mkdir(new URL(file.replace(/[^/]+$/,''),dest),{recursive:true});await cp(new URL(dir+file,root),new URL(file,dest));}
}
// Hoja de revisión para María del Mar: lo que hay que validar en cada capítulo, enlazado con su escena.
{
 const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const tags={V:'Tuya, validada',O:'De la original',N:'Propuesta nueva'};
 const pending=data.recommendations.items.filter(r=>/pendiente/.test(r.review)).length;
 const sections=data.chapters.map(c=>{
  const lines=[...c.script.matchAll(/\*\*(Herida|Rutina|Vecinas|Evidencia|María del Mar)(?: en la entrada)?\s*\[([VON])[^\]]*\]:\*\*\s*«([^»]+)»/g)];
  return `<section><h2><span>${c.number}</span> ${esc(c.title)}</h2><p class="meta">${esc(c.act)} · ${c.structure.sequence.map((step,i)=>`<a href="../?poses#capitulo-${c.number}/${step===3?2:step}">${esc(c.structure.kind==='chapter'?['Entrada','Desarrollo','Decisión'][i]:c.structure.titles[step])}</a>`).join(' · ')}</p><p class="learn"><b>Nos llevamos:</b> ${esc(c.takeaway)}</p><ul>${lines.map(m=>`<li class="t${m[2]}"><label><input type="checkbox"> <small>${tags[m[2]]} · ${esc(m[1])}</small> ${esc(m[3])}</label></li>`).join('')}</ul><p class="ev"><b>Evidencia:</b> ${esc(c.citation)} — ${esc(c.condition)}</p><details><summary>Textos del recurso que también se revisan</summary><p>${(c.titles||[c.resource.title,c.question,c.takeaway]).map(esc).join(' · ')}</p><ul>${c.resource.items.map(it=>`<li><b>${esc(it.title)}</b> ${esc(it.text)}</li>`).join('')}${c.options.map(it=>`<li><b>${esc(it.title)}</b> ${esc(it.text)}</li>`).join('')}</ul></details><p class="meta">Doña Rutina: ${esc(c.actorPlan.assetStatus)}</p></section>`;
 }).join('');
 const css=(await read('tokens.css'))+'body{max-width:880px;margin:0 auto;padding:40px 24px 80px;background:var(--paper);color:var(--ink);font:400 17px/1.5 var(--sans)}h1{font:430 40px/1.1 var(--display);letter-spacing:-.03em}section{border-top:1px solid var(--line);padding:24px 0}h2{font:450 26px/1.2 var(--display);margin:0}h2 span{color:var(--blood-deep)}.meta{color:var(--muted);font-size:14px;margin:6px 0}a{color:var(--blood-deep)}ul{list-style:none;padding:0}li{padding:8px 12px;margin:6px 0;border-left:3px solid var(--line)}li.tN{border-color:var(--coral);background:var(--blush)}li small{display:block;color:var(--muted);font-size:12px}.ev{background:var(--olive-soft);color:var(--olive-ink);padding:12px;border-radius:10px;font-size:15px}.learn{margin:10px 0}@media print{input{display:inline}}';
 const review=`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Revisión del recorrido</title><style>${css}</style><body><h1>Revisión del recorrido</h1><p>María del Mar: en cada capítulo están las frases, lo que se dice que respalda cada decisión y el estado de la imagen. Las marcadas en rosa son <b>propuestas nuevas</b> y son las que más necesitan tu mirada: clínica, tono y si las dirías así.</p><p><a href="../">Abrir la presentación</a>. → o espacio pasan a la siguiente escena; los capítulos clínicos tienen tres escenas y dos avances. R abre fuentes; P, tus notas; V, la ventana de ponente.</p><p class="ev">Del DT XIV, 13 recomendaciones están cotejadas con el documento y ${pending} siguen con un resumen pendiente de cotejo final (se ven con R).</p>${sections}</body></html>`;
 await mkdir(new URL('revision/',out),{recursive:true});await writeFile(new URL('revision/index.html',out),review);
}
console.log('Recorrido consolidado: 20 capítulos clínicos · apertura y cierre con estructura propia · /recorrido/ y /piloto/.');

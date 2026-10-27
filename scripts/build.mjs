import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import vm from 'node:vm';
const root = new URL('../',import.meta.url);
const read = name => readFile(new URL(name,root),'utf8');
const [template,baseCss,presenceCss,portalCss,resourceCss,stepsCss,stageCss,data,pilot,edition,entity,resourceViewer,engine] = await Promise.all(['template.html','styles.css','presence.css','portal.css','resources.css','steps.css','stage.css','content.js','pilot.js','edition.js','entity.js','resource-viewer.js','app.js'].map(read));
// Fonts are embedded so the presentation stays self-contained (SIL OFL, see assets/fonts).
const font = async name => 'data:font/woff2;base64,'+(await readFile(new URL('assets/fonts/'+name+'.woff2',root))).toString('base64');
const fonts = {FRAUNCES:await font('fraunces-latin-wght-normal'),FRAUNCES_ITALIC:await font('fraunces-latin-wght-italic'),FIGTREE:await font('figtree-latin-wght-normal')};
const css = baseCss+'\n'+presenceCss.replace(/__FONT_(\w+)__/g,(_,k)=>fonts[k])+'\n'+portalCss+'\n'+resourceCss+'\n'+stepsCss+'\n'+stageCss;
// Optional concept illustration for the entity (see README). Without it, the procedural 3D entity is used.
const artFile=['entity-cutout.png','entity-concept.png','entity-concept.jpg','entity-concept.webp'].find(f=>existsSync(new URL('assets/'+f,root)));
const artConfig=artFile?JSON.parse(await read('assets/entity-concept.json').catch(()=>'{}')):null;
const artSeed=artFile?`globalThis.ENTITY_ART=${JSON.stringify({crop:[0,0,1,1],core:[.5,.45],...artConfig,src:'data:image/'+(artFile.endsWith('jpg')?'jpeg':artFile.split('.').pop())+';base64,'+(await readFile(new URL('assets/'+artFile,root))).toString('base64')})};\n`:'';
const app = artSeed+entity+'\n'+resourceViewer+'\n'+engine;
const manifest=JSON.parse(await read('resources.json'));
const resourceCatalog=Object.fromEntries(await Promise.all(Object.entries(manifest.assets).map(async ([id,asset])=>{
 const bytes=await readFile(new URL('assets/resources/'+asset.file,root));
 return [id,{...asset,src:'data:image/jpeg;base64,'+bytes.toString('base64')}];
})));
const resourceSeed=`\nINITIAL_DECK.resourceCatalog=${JSON.stringify(resourceCatalog)};\nfor(const [id,ids] of Object.entries(${JSON.stringify(manifest.scenes)})){const s=INITIAL_DECK.slides.find(s=>s.id===id);if(s)s.resourceIds=ids;}\n`;
const institutional = await Promise.all(['institutional-open','institutional-close'].map(async name=>'data:image/jpeg;base64,'+(await readFile(new URL('assets/'+name+'.jpg',root))).toString('base64')));
const frames = `\nINITIAL_DECK.slides.unshift({...slide('institucional-apertura','Institucional','¿Es posible cicatrizar todas las heridas?','principal','Qué no hacer en heridas crónicas','institutional',[],[],null),institutional:${JSON.stringify(institutional[0])},institutionalKind:'open'});\nINITIAL_DECK.slides.push({...slide('institucional-cierre','Institucional','Gracias por compartir el criterio.','principal','Cinco preguntas para revisar nuestras decisiones.','institutional',[],[],null),institutional:${JSON.stringify(institutional[1])},institutionalKind:'close'});`;
await mkdir(new URL('dist/',root),{recursive:true});
// Videos are not embedded: each asset.video (e.g. "videos/limpieza.mp4") is copied from
// assets/resources/ next to the HTML, and the embedded image is its poster.
for(const asset of Object.values(manifest.assets).filter(a=>a.video)){
 if(!/^[\w-]+(\/[\w.-]+)*\.(mp4|webm)$/.test(asset.video)||asset.video.includes('..'))throw Error('Ruta de vídeo no válida: '+asset.video);
 const target=new URL('dist/'+asset.video,root);await mkdir(new URL('./',target),{recursive:true});
 await writeFile(target,await readFile(new URL('assets/resources/'+asset.video,root)));
}
const fullSeed=data+'\n'+pilot+'\n'+edition+resourceSeed+frames;
const page=seed=>template.replace('/* STYLES */',()=>css).replace('/* CONTENT */',()=>seed).replace('/* APP */',()=>app);
await writeFile(new URL('dist/index.html',root),page(fullSeed));
// A ready-to-open review copy with no private notes or authoring controls.
const context=vm.createContext({});
vm.runInContext(fullSeed+';globalThis.reviewDeck=INITIAL_DECK;globalThis.reviewRefs=REFERENCES;globalThis.reviewQuestions=QUESTIONS;',context);
const reviewDeck=JSON.parse(JSON.stringify(context.reviewDeck));
reviewDeck.slides.forEach(s=>{delete s.notes;if(s.media?.rights!=='authorized')s.media=null;});
reviewDeck.resourceCatalog=Object.fromEntries(Object.entries(reviewDeck.resourceCatalog||{}).filter(([,a])=>a.rights==='authorized'));
const safe=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const reviewSeed=`const REFERENCES=${safe(context.reviewRefs)};const QUESTIONS=${safe(context.reviewQuestions)};const INITIAL_DECK=${safe(reviewDeck)};const BOOT={mode:'review',readOnly:true,deck:INITIAL_DECK};`;
await writeFile(new URL('dist/revision.html',root),page(reviewSeed));
// Entity preview: the four states side by side, to review the animation outside the deck.
const states=[['idle','','En reposo'],['listening','','Escuchando'],['idle','think','Pensando'],['responding','speak','Hablando'],['remembering','','Recordando'],['showing','','Mostrando'],['discomfort','','Incomodidad'],['relief','','Alivio']];
const voices=[['principal','La herida'],['isquemica','Otra herida · vascular'],['paliativa','Otra herida · objetivos'],['persona','Voz de la persona']];
const cell=(r,v,st,f,l)=>`<div><div class="cell"><div class="orb-zone" data-renderer="${r}" data-voice="${v}" data-state="${st}" data-force="${f}"></div></div><p>${l}</p></div>`;
const block=(r,title,note)=>`<section><h1>${title}</h1><p class="note">${note}</p><div class="big"><div class="orb-zone" data-renderer="${r}" data-voice="principal" data-state="idle"></div></div><h2>Estados</h2><div class="row">${states.map(([st,f,l])=>cell(r,'principal',st,f,l)).join('')}</div>${r==='membrane'?`<h2>Brote de la invitada · secuencia</h2><div class="row">${[['0','Una sola herida'],['0.35','Empieza a brotar'],['0.65','Se estrangula'],['1','Se separa']].map(([b,l])=>cell(r,'principal','idle','bud:'+b,l)).join('')}</div><h2>Brote en movimiento</h2><div class="row wide">${cell(r,'principal','idle','bud','Ciclo completo: brota, se separa y se vuelve a fundir')}${cell(r,'isquemica','idle','bud','En el tono del contrapunto vascular')}</div>`:''}<h2>Voces</h2><div class="row">${voices.map(([v,l])=>cell(r,v,'idle','',l)).join('')}</div></section>`;
const entityPage=(body)=>`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Entidad · comparación</title><style>body{margin:0;background:#f6ede3;font-family:system-ui,sans-serif;color:#5b4a42}section{padding:2vh 0 4vh}section+section{border-top:1px solid #e5d6c8}h1{font:500 28px Georgia,serif;margin:.6em 3vw 0;color:#3b2a22}.note{margin:.3em 3vw 0;font-size:15px;text-align:left}.big{position:relative;height:50vh}.row{display:grid;grid-template-columns:repeat(4,1fr);gap:2vw;padding:0 3vw}.row.wide{grid-template-columns:repeat(2,1fr)}.cell{position:relative;height:22vh}.orb-zone{position:absolute;inset:0}.orb-canvas{width:100%;height:100%;display:block}p{text-align:center;margin:.4em 0 1.6em;font-size:16px}h2{font:600 13px system-ui;margin:1.2em 3vw .2em;color:#9a7b6c;text-transform:uppercase;letter-spacing:.08em}</style></head><body>${body}<script>${artSeed}${entity}\nPresence.mount([...document.querySelectorAll('.orb-zone')]);<\/script></body></html>`;
// Browsers cap WebGL contexts per page (~16), so the comparison is split into two linked pages.
await writeFile(new URL('dist/entidad.html',root),entityPage(block('membrane','Nueva entidad · prototipo generado por código','Forma viva, lecho líquido que fluye siempre, membranas en capas, luz de borde blanca y dorada, brote real de la invitada. Paleta de tu lámina. <a href="entidad-actual.html">Ver la entidad actual →</a>')));
await writeFile(new URL('dist/entidad-actual.html',root),entityPage(block('art','Entidad actual · ilustración animada','Tu lámina recortada y deformada por el sombreador. <a href="entidad.html">← Ver la nueva entidad</a>')));
console.log('Edición y copia de revisión generadas en dist/index.html y dist/revision.html');

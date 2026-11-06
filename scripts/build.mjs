// Genera dist/index.html: la presentación proyectada a partir del guion para María del Mar.
// Autónoma (fuentes, imágenes y entidad incluidas). El guion es la fuente de los textos.
import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {parseGuion,validate} from './guion.mjs';
const root=new URL('../',import.meta.url);
const read=name=>readFile(new URL(name,root),'utf8');
const b64=async (name,type)=>`data:${type};base64,`+(await readFile(new URL(name,root))).toString('base64');

const guion=parseGuion(await read('guion/GUION_PARA_MARIA_DEL_MAR.md'));
const errors=validate(guion);
if(errors.length){console.error('El guion no encaja con la escena:\n- '+errors.join('\n- '));process.exit(1);}

const [template,tokens,css,recursos,engine,entity,liquid]=await Promise.all(['template.html','tokens.css','escena.css','escena-recursos.js','escena.js','entity.js','entity-liquid.js'].map(read));
const fonts=`@font-face{font-family:"Fraunces";src:url(${await b64('assets/fonts/fraunces-latin-wght-normal.woff2','font/woff2')}) format("woff2");font-weight:100 900;font-style:normal;font-display:block}
@font-face{font-family:"Fraunces";src:url(${await b64('assets/fonts/fraunces-latin-wght-italic.woff2','font/woff2')}) format("woff2");font-weight:100 900;font-style:italic;font-display:block}
@font-face{font-family:"Figtree";src:url(${await b64('assets/fonts/figtree-latin-wght-normal.woff2','font/woff2')}) format("woff2");font-weight:300 900;font-style:normal;font-display:block}`;

// Solo las imágenes que usa la escena, con su identificación y créditos.
const manifest=JSON.parse(await read('resources.json'));
const used=new Set();
for(const m of recursos.matchAll(/asset:'([\w-]+)'/g))used.add(m[1]);
const assets={};
for(const id of used){
 const a=manifest.assets[id];if(!a)throw Error('Recurso desconocido en escena-recursos.js: '+id);
 assets[id]={title:a.title,label:a.label,alt:a.alt,caption:a.caption,credit:a.credit,walkthrough:a.walkthrough||null,src:await b64('assets/resources/'+a.file,'image/jpeg')};
}
const institutional={open:await b64('assets/institutional-open.jpg','image/jpeg'),close:await b64('assets/institutional-close.jpg','image/jpeg')};
const safe=v=>JSON.stringify(v).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const data=`const ESCENA=${safe({guion,assets,institutional})};\n${recursos}`;
const page=template.replace('/* STYLES */',()=>fonts+'\n'+tokens+'\n'+css).replace('/* DATA */',()=>data).replace('/* ENGINE */',()=>'globalThis.ENTITY_RENDERER="liquid";globalThis.ENTITY_VARIANT=3;globalThis.ENTITY_INK=1;\n'+liquid+'\n'+entity+'\n'+engine);
await mkdir(new URL('dist/ver/',root),{recursive:true});
await writeFile(new URL('dist/index.html',root),page);
// Enlace para compartir (/ver/): la misma presentación sin guía, ponente ni notas, y sin las palabras
// que María del Mar dice fuera de pantalla. En Netlify es la única ruta que no pide contraseña.
const publicGuion=JSON.parse(JSON.stringify(guion),(k,v)=>['spoken','develop','notes','recuerda','close','screen','after'].includes(k)?undefined:v);
const publicData=`const ESCENA=${safe({guion:publicGuion,assets,institutional,publico:true})};\n${recursos}`;
await writeFile(new URL('dist/ver/index.html',root),page.replace(data,()=>publicData).replace('<title>Conversaciones con una herida · Escena</title>','<title>Conversaciones con una herida</title>'));
// El carro 3D (carro/) se publica aparte, en /carro/, con la parte de Three.js que usa: solo los módulos
// a los que llega desde sus importaciones, para que funcione sin conexión.
await cp(new URL('carro/',root),new URL('dist/carro/',root),{recursive:true});
// El visor se reutiliza entre escenas: una versión de módulo evita conservar un modelo antiguo en caché.
const carroVersion=createHash('sha256').update(await read('carro/carro.js')).digest('hex').slice(0,12);
await writeFile(new URL('dist/carro/index.html',root),(await read('carro/index.html')).replace('src="./carro.js"',`src="./carro.js?v=${carroVersion}"`));
const three=new URL('node_modules/three/',root);
const copied=new Set();
async function vendor(rel){
 if(copied.has(rel))return;copied.add(rel);
 const code=await readFile(new URL(rel,three),'utf8');
 await mkdir(new URL('dist/carro/vendor/three/'+rel.replace(/[^/]+$/,''),root),{recursive:true});
 await writeFile(new URL('dist/carro/vendor/three/'+rel,root),code);
 for(const [,dep] of code.matchAll(/from\s*['"](\.{1,2}\/[^'"]+)['"]/g))await vendor(new URL(dep,new URL(rel,'https://x/')).pathname.slice(1));
}
await vendor('build/three.module.min.js');
for(const [,mod] of (await read('carro/carro.js')).matchAll(/from\s*'three\/addons\/([^']+)'/g))await vendor('examples/jsm/'+mod);
// «Confesiones de una úlcera» (/confesiones/): la presentación original adaptada, aparte de la principal, con su
// editor lateral (E) guardando en /api/confesiones/. Una sola página con todo dentro salvo los modelos 3D y sus imágenes.
{
 const dir='prototipos/original-adaptada/';
 const inline=async(name,tag)=>`<${tag}>${(await read(name)).replace(/<\/(script|style)/gi,'<\\/$1')}</${tag}>`;
 const fuente=async f=>b64('assets/fonts/'+f,'font/woff2');
 let html=await read(dir+'index.html');
 const cambios=[
  ['<link rel="stylesheet" href="../../tokens.css">',await inline('tokens.css','style')],
  ['<link rel="stylesheet" href="editor.css">',await inline(dir+'editor.css','style')],
  ['<script src="../herida-amable/entity-liquid-amable.js"></script>',await inline('prototipos/herida-amable/entity-liquid-amable.js','script')],
  ['<script src="../../entity.js"></script>',await inline('entity.js','script')],
  ['<script src="editor.js"></script>',await inline(dir+'editor.js','script')],
  ['../../assets/fonts/fraunces-latin-wght-normal.woff2',await fuente('fraunces-latin-wght-normal.woff2')],
  ['../../assets/fonts/fraunces-latin-wght-italic.woff2',await fuente('fraunces-latin-wght-italic.woff2')],
  ['../../assets/fonts/figtree-latin-wght-normal.woff2',await fuente('figtree-latin-wght-normal.woff2')],
  ['../../personajes/rutina/render/reposo.png','rutina.png'],
  ['../../personajes/evidencia/render/reposo.png','evidencia.png'],
  ['`../../personajes/${nombre}/${nombre}.glb`','`${nombre}.glb`']
 ];
 for(const [de,a] of cambios){if(!html.includes(de))throw Error('Confesiones: no encuentro '+de);html=html.split(de).join(a);}
 if(/(src|href)="\.\.\/|url\(\.\.\//.test(html))throw Error('Confesiones: queda una ruta relativa sin resolver.');
 await mkdir(new URL('dist/confesiones/',root),{recursive:true});
 await writeFile(new URL('dist/confesiones/index.html',root),html);
 for(const [de,a] of [['personajes/rutina/render/reposo.png','rutina.png'],['personajes/evidencia/render/reposo.png','evidencia.png'],['personajes/rutina/rutina.glb','rutina.glb'],['personajes/evidencia/evidencia.glb','evidencia.glb']])
  await cp(new URL(de,root),new URL('dist/confesiones/'+a,root));
}
const steps=guion.scenes.reduce((n,s)=>n+s.steps.length,0);
console.log(`Presentación generada en dist/index.html · ${guion.scenes.length} escenas, ${steps} pasos del guion, ${used.size} imágenes.`);

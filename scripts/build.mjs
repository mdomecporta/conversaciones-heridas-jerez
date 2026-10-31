// Genera dist/index.html: la presentación proyectada a partir del guion para María del Mar.
// Autónoma (fuentes, imágenes y entidad incluidas). El guion es la fuente de los textos.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
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
const steps=guion.scenes.reduce((n,s)=>n+s.steps.length,0);
console.log(`Presentación generada en dist/index.html · ${guion.scenes.length} escenas, ${steps} pasos del guion, ${used.size} imágenes.`);

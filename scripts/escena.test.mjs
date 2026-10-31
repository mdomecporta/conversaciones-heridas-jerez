// La escena proyectada sale del guion para María del Mar: estas pruebas avisan si un cambio
// en el guion o en las composiciones deja una escena sin hilo, sin evidencia o sin recurso.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {parseGuion,validate,quote} from './guion.mjs';
const root=new URL('../',import.meta.url);
const guion=parseGuion(await readFile(new URL('guion/GUION_PARA_MARIA_DEL_MAR.md',root),'utf8'));
const ctx=vm.createContext({});
vm.runInContext(await readFile(new URL('escena-recursos.js',root),'utf8')+';globalThis.R=ESCENA_RECURSOS;globalThis.REC=ESCENA_RECOPILACION;',ctx);
const manifest=JSON.parse(await readFile(new URL('resources.json',root),'utf8'));

test('el guion encaja con la escena',()=>{assert.deepEqual(validate(guion),[]);});
test('las comillas anidadas se conservan',()=>{assert.equal(quote('«A veces nos ponen “crónica”». Sigue'),'A veces nos ponen “crónica”');assert.equal(quote('«Dar «crónica» por hecho»'),'Dar «crónica» por hecho');});
test('cada actuación tiene hilo completo y evidencia con fuente',()=>{
 const practice=guion.scenes.filter(s=>s.kind==='practice');
 assert.equal(practice.length,21);
 for(const s of practice){
  const ev=s.steps.find(x=>x.kind==='evidence').evidence;
  assert.ok(ev.title&&ev.idea&&ev.source,`Escena ${s.n}`);
  // El orden del guion: actuación, recurso, pregunta, evidencia, aprendizaje y enlace.
  const order=['open','resource','ask','evidence','take','bridge'].map(k=>s.steps.findIndex(x=>x.kind===k));
  assert.deepEqual([...order].sort((a,b)=>a-b),order,`Escena ${s.n}`);
 }
});
test('las explicaciones largas de María del Mar no se proyectan',()=>{
 for(const s of guion.scenes)for(const st of s.steps)for(const l of st.lines||[])if(l.who==='mdm')assert.ok(l.text.split(/\s+/).length<=32||st.kind==='blockclose',`Escena ${s.n}: ${l.text.slice(0,40)}`);
 for(const s of guion.scenes.filter(s=>s.kind==='practice'))assert.ok(!s.steps.find(x=>x.kind==='evidence').lines,`Escena ${s.n}`);
});
test('cada actuación tiene recurso y sus imágenes están en el catálogo',()=>{
 for(let n=1;n<=21;n++){
  const r=ctx.R[n];assert.ok(r,`Escena ${n} sin recurso`);assert.ok(r.parts>=1);
  for(const id of [r.asset,r.side?.asset,...(r.items||[]).map(i=>i.asset)].filter(Boolean))assert.ok(manifest.assets[id],`${n}: ${id}`);
 }
});
test('la recopilación recorre las 21 actuaciones una sola vez',()=>{
 const seen=[...ctx.REC].flatMap(([a,z])=>Array.from({length:z-a+1},(_,i)=>a+i));
 assert.deepEqual([...seen],Array.from({length:21},(_,i)=>i+1));
});

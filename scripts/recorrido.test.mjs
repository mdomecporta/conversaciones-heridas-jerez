import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {extractPilot} from './guion-piloto.mjs';
const md=await readFile(new URL('../guion/GUION_CONSOLIDADO_22_CAPITULOS.md',import.meta.url),'utf8');
const deck=extractPilot(md);
test('el recorrido conserva todos los capítulos, sus voces y el respaldo',()=>{
 assert.equal(deck.chapters.length,22);
 const spoken=[...md.matchAll(/\*\*María del Mar(?:\s*\[[^\]]*\])?:\*\*\s*«([^»]+)»/g)].map(m=>m[1]);
 assert.deepEqual(deck.chapters.flatMap(c=>c.steps.flatMap(s=>s.speaker)),spoken);
 for(const c of deck.chapters){assert.ok(c.source,`Respaldo del capítulo ${c.number}`);assert.ok(c.takeaway,`Aprendizaje del capítulo ${c.number}`);assert.equal(c.options.length,2);assert.ok(c.citation);}
});
test('las frases validadas no se acortan al extraer los intercambios',()=>{
 for(const c of deck.chapters){for(const m of c.script.matchAll(/\*\*(Herida|Rutina) \[V\]:\*\* «([^»]+)»/g))assert.ok(c.steps.some(s=>s.turns.some(t=>t.who===m[1]&&t.text===m[2])));}
});
test('cada variante de Rutina procede de un archivo real del avatar aprobado',async()=>{
 for(const c of deck.chapters)for(const path of c.avatar){assert.match(path,/^personajes\/rutina\//);assert.doesNotMatch(path,/\.glb$/);await access(new URL('../'+path,import.meta.url));}
});
test('los 13 puntos se vinculan a capítulos que explican sus condiciones',async()=>{
 const map=JSON.parse(await readFile(new URL('../guion/mapa-47-consolidado.json',import.meta.url),'utf8'));
 assert.equal(map.items.length,47);assert.equal(map.items.filter(r=>r.illuminate).length,13);
 for(const r of map.items.filter(r=>r.illuminate))for(const n of r.chapters)assert.ok(deck.chapters[n-1]?.condition);
});
test('las vecinas hablan como heridas y mantienen separada la procedencia de la voz bacteriana',()=>{
 const c=deck.chapters[5];assert.ok(c.introWound.includes('nosotras viven bacterias'));
 assert.ok(c.steps.flatMap(s=>s.turns).some(t=>t.who==='Vecinas'));
 assert.ok(!c.steps.flatMap(s=>s.turns).some(t=>t.who==='Herida'));
 assert.ok(!c.steps.flatMap(s=>s.turns).some(t=>t.text.includes('Nosotras solo vivimos aquí')));
 assert.ok(c.script.includes('Procedencia de la réplica original'));
});
test('las imágenes provisionales no muestran objetos de otra escena como si fueran variantes terminadas',()=>{
 for(const c of deck.chapters){
  assert.ok(c.actorPlan.resource);
  if(c.actorPlan.status==='placeholder'){
   assert.ok(c.avatar.every(path=>path.endsWith('/00-reposo.png')));
   assert.ok(c.actorPlan.offerPrompt&&c.actorPlan.reactionPrompt);
  }
  if(c.steps.some(s=>s.routine.length))assert.ok(c.actorPlan.openingLine&&c.actorPlan.reactionTrigger);
 }
 assert.equal(deck.chapters[18].actorPlan.status,'not-used');
});
test('el viaje de la apertura tiene presupuesto inferior a cinco segundos y margen de finalización',()=>{
 const intro=deck.chapters[0].structure;
 assert.equal(intro.kind,'opening');assert.ok(intro.travelMs>0&&intro.travelMs<5000);
 assert.ok(intro.travelDeadlineMs>=intro.travelMs&&intro.travelDeadlineMs<=5000);
 assert.equal(deck.chapters[21].structure.kind,'closing');
 for(const chapter of deck.chapters.slice(1,21))assert.equal(chapter.structure.kind,'chapter');
});

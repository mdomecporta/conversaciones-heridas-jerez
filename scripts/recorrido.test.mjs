import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
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
test('dos pulsaciones recorren las tres escenas aunque haya un turno en marcha',async()=>{
 const js=await readFile(new URL('../prototipos/piloto-capitulo/revision.js',import.meta.url),'utf8');
 const next=js.slice(js.indexOf(' function next(){'),js.indexOf(' function previous(){'));
 for(const number of Array.from({length:20},(_,i)=>i+2)){
  const seen=[],ctx={unlockAudio(){},data:deck.chapters[number-1],preludeStage:'done',step:0,chainRunning:true,journeyExited:false,$:()=>({hidden:true}),render(n){ctx.step=n;seen.push(n);},selectChapter(n){seen.push('chapter-'+n);}};
  vm.createContext(ctx);vm.runInContext(next+'next();next();',ctx);assert.deepEqual(seen,[1,3],`Capítulo ${number}`);
 }
 assert.ok(js.includes('turn.text.split(/\\s+/).length*400'),'conserva la espera de la ponente');
 assert.ok(!/later\(30000/.test(js),'el cierre no sale solo');
});
test('todo tipo de recurso clínico tiene composición propia y las condiciones llegan a la pantalla',async()=>{
 const js=await readFile(new URL('../prototipos/piloto-capitulo/recorrido-recursos.js',import.meta.url),'utf8');
 for(const c of deck.chapters.slice(1,21))if(!['measurement','swab','zones'].includes(c.resource.kind))assert.match(js,new RegExp('\\b'+c.resource.kind+'\\('),`Capítulo ${c.number}: ${c.resource.kind}`);
 assert.ok(js.includes('c.options.map'));
});
test('las variantes propuestas se distinguen de las aprobadas',()=>{
 for(const c of deck.chapters.filter(c=>c.actorPlan.status==='proposal')){assert.ok(c.avatar.every(p=>p.includes('propuestas-revision-13')));assert.match(c.actorPlan.assetStatus,/pendiente de aprobar/);}
});

test('las propuestas de Rutina están aprobadas y conservan sus archivos',()=>{
 for(const n of [2,3,4,5,6,11,14,15,16]){const c=deck.chapters[n-1];assert.equal(c.actorPlan.status,'approved');assert.ok(c.avatar.every(p=>p.includes('propuestas-revision-13')));}
});
test('el build usa derivados portables para todas las poses, sin volver a PNG pesados',async()=>{
 for(const c of deck.chapters)for(const path of c.avatar)await access(new URL('../'+path.replace('personajes/rutina/','personajes/rutina/web/').replace(/\.png$/,'.jpg'),import.meta.url));
 const build=await readFile(new URL('./build-piloto.mjs',import.meta.url),'utf8');assert.ok(!build.includes('execFileSync'));assert.ok(!build.includes('sips'));
});

test('los focos de cautela no se convierten en una condición favorable por el vocabulario',async()=>{
 const js=await readFile(new URL('../prototipos/piloto-capitulo/recorrido-recursos.js',import.meta.url),'utf8');
 const active=new Set(),items=[0,1,2].map(i=>({dataset:{item:String(i)},classList:{remove(){active.delete(i);},toggle(_,on){if(on)active.add(i);else active.delete(i);}}}));
 const host={dataset:{},querySelectorAll(){return items;}},stage={dataset:{}};
 const ctx={window:{},document:{querySelector:s=>s==='#resource-content'?host:stage,querySelectorAll:()=>[]},matchMedia:()=>({matches:false}),setTimeout:()=>0,clearTimeout(){}};
 vm.createContext(ctx);vm.runInContext(js,ctx);
 const c=deck.chapters[12],turn=c.steps.flatMap(b=>b.turns).find(t=>t.id==='c13-b3-t2');ctx.window.RecorridoResources.cue(c,3,turn);
 assert.deepEqual([...active],[1,2]);
 const c6=deck.chapters[5];ctx.window.RecorridoResources.cue(c6,1,c6.steps[0].turns.at(-1));assert.equal(active.size,0,'una mención de infección no clasifica una lesión');
});

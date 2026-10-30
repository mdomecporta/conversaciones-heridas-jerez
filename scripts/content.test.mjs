import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
const seed=html.match(/<script id="seed">([\s\S]*?)<\/script>/)[1];
const engine=html.match(/<script id="engine">([\s\S]*?)<\/script>/)[1];
function setup(data=seed,globals={}){
 const handlers={},store=new Map(),blobs=[];
 const elements={};
 const element=id=>elements[id]??=( {innerHTML:'',textContent:'',open:false,dataset:{},style:{},setAttribute(){},classList:{add(){},remove(){}},addEventListener(name,fn){handlers[id+':'+name]=fn;},showModal(){this.open=true;},close(){this.open=false;},click(){},remove(){}} );
 element('engine').textContent=engine;
 const document={hidden:false,querySelector(q){if(q==='style')return {textContent:'body{}'};if(q==='.scene-item.active')return null;return element(q.replace(/^#/,''));},querySelectorAll(){return [];},addEventListener(n,f){handlers['document:'+n]=f;},createElement(){return {click(){},remove(){}};},body:{append(){}}};
 const ctx=vm.createContext({document,window:{addEventListener(){}},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},setTimeout:(fn,ms)=>{const t=setTimeout(fn,ms);t.unref();return t;},clearTimeout,cancelAnimationFrame(){},requestAnimationFrame(){},performance,crypto:webcrypto,Blob,URL:{createObjectURL(blob){blobs.push(blob);return 'blob:test';},revokeObjectURL(){}},matchMedia:()=>({matches:true}),console,...globals});
 vm.runInContext(data,ctx);vm.runInContext(engine,ctx);
 const click=dataset=>handlers['app:click']({target:{closest:()=>({dataset})}});
 const input=(dataset,value,attr='')=>handlers['app:input']({target:{dataset,value,hasAttribute:a=>a===attr}});
 const dialogClick=dataset=>handlers['dialog:click']({target:{closest:()=>({dataset})}});
 return {ctx,store,blobs,elements,handlers,click,dialogClick,input,view:()=>element('stage').innerHTML||element('app').innerHTML,app:()=>element('app').innerHTML};
}
test('28 pantallas (dos institucionales, dos de introducción y 24 escenas), identificadores únicos, fuentes y preguntas válidas',()=>{const c=vm.createContext({});vm.runInContext(seed+';globalThis.deck=INITIAL_DECK;globalThis.refs=REFERENCES;',c);assert.equal(c.deck.slides.length,28);assert.equal(new Set(c.deck.slides.map(s=>s.id)).size,28);assert.equal(c.deck.slides.slice(1,3).map(s=>s.intro.kind).join(),'tema,herida');for(const s of c.deck.slides){assert.ok(s.refs.every(r=>c.refs[r]));assert.ok(s.q===null||s.q>=0&&s.q<5);}assert.ok(c.deck.slides.filter(s=>s.study).every(s=>s.study.steps?.length>=3&&s.study.avoid&&s.study.propose&&s.study.bridge));});
test('el borrador no cambia Presentar hasta guardar y las notas no se muestran',()=>{const h=setup();h.input({field:'title'},'Título modificado');assert.match(h.view(),/Título modificado/);h.click({mode:'present'});assert.doesNotMatch(h.app(),/Título modificado/);h.click({mode:'prepare'});assert.match(h.app(),/Título modificado/);h.input({},'NOTA_PRIVADA_UNICA','data-notes');h.click({action:'save'});h.click({mode:'present'});assert.match(h.app(),/Título modificado/);assert.doesNotMatch(h.app(),/NOTA_PRIVADA_UNICA/);});
test('HTML autónomo excluye notas privadas y puede ejecutarse como copia de revisión',async()=>{const h=setup();h.input({},'SECRETO_DE_LA_PONENTE','data-notes');h.click({action:'save'});h.click({action:'export-html'});const output=await h.blobs[0].text();assert.doesNotMatch(output,/SECRETO_DE_LA_PONENTE/);assert.equal((output.match(/<\/script>/g)||[]).length,2);const exportedSeed=output.match(/<script id="seed">([\s\S]*?)<\/script>/)[1];const reader=setup(exportedSeed);assert.equal(reader.ctx.window.JerezPresentation.mode,'review');assert.doesNotMatch(reader.app(),/Guardar para presentar/);assert.doesNotMatch(reader.app(),/Preparar la escena/);});
test('duplicar, reordenar y eliminar conservan identidad y se pueden deshacer',()=>{const h=setup();const initial=h.ctx.window.JerezPresentation.sceneCount;h.click({action:'duplicate'});const duplicate=h.ctx.window.JerezPresentation.slideId;assert.equal(h.ctx.window.JerezPresentation.sceneCount,initial+1);h.click({action:'move-down'});assert.equal(h.ctx.window.JerezPresentation.slideId,duplicate);h.click({action:'delete'});assert.equal(h.ctx.window.JerezPresentation.sceneCount,initial);h.click({action:'undo'});assert.equal(h.ctx.window.JerezPresentation.slideId,duplicate);assert.equal(h.ctx.window.JerezPresentation.sceneCount,initial+1);});
test('las decisiones conservan la exploración y solo reinician con una acción explícita',()=>{const h=setup();h.click({slide:'infeccion'});h.click({turnEvent:'2'});assert.doesNotMatch(h.view(),/class="resource-detail reasoning"/);h.click({resourceIndex:'1'});h.click({action:'resource-reveal'});assert.match(h.view(),/Razonamiento clínico · Completar la valoración/);h.click({action:'next'});h.click({action:'previous'});assert.match(h.app(),/Razonamiento clínico · Completar la valoración/);h.click({action:'reset-conversation'});assert.doesNotMatch(h.view(),/resource-detail reasoning/);assert.match(h.view(),/Avanza para seguir la conversación/);});
test('la historia se conserva sin sustituir la explicación y se puede reiniciar',()=>{const h=setup();assert.equal(h.ctx.window.JerezPresentation.slideId,'intro-tema');h.click({slide:'registro'});h.click({turnEvent:'0'});assert.match(h.view(),/Registro de intervenciones/);assert.match(h.view(),/Un registro de curas cuenta/);assert.match(h.view(),/data-state="remembering"/);h.click({action:'next'});assert.equal(h.ctx.window.JerezPresentation.slideId,'historia');h.click({action:'previous'});assert.match(h.app(),/Registro de intervenciones/);h.click({action:'reset-conversation'});assert.doesNotMatch(h.view(),/class="prepared-answer"/);assert.match(h.view(),/Avanza para seguir la conversación/);});
test('texto clínico, respuesta y guion privado conservan funciones independientes en la exportación',async()=>{const h=setup();h.click({slide:'apertura'});h.input({study:'explanation'},'EXPLICACIÓN_CLÍNICA_EDITADA');h.input({turn:'0',turnField:'reply'},'RESPUESTA_PREPARADA_EDITADA');h.input({},'GUIÓN_ORAL_PRIVADO','data-notes');h.click({action:'save'});h.click({action:'export-html'});const output=await h.blobs[0].text();assert.match(output,/EXPLICACIÓN_CLÍNICA_EDITADA/);assert.match(output,/RESPUESTA_PREPARADA_EDITADA/);assert.doesNotMatch(output,/GUIÓN_ORAL_PRIVADO/);const reader=setup(output.match(/<script id="seed">([\s\S]*?)<\/script>/)[1]);reader.click({slide:'apertura'});reader.click({turnEvent:'0'});assert.match(reader.view(),/RESPUESTA_PREPARADA_EDITADA/);assert.match(reader.view(),/EXPLICACIÓN_CLÍNICA_EDITADA/);});
test('los cuatro momentos navegan a contenido asociado',()=>{const h=setup();h.click({mode:'present'});h.click({question:'1'});assert.equal(h.ctx.window.JerezPresentation.slideId,'medicion');h.click({question:'3'});assert.equal(h.ctx.window.JerezPresentation.slideId,'continuidad');assert.match(h.app(),/Los cuatro momentos del recorrido/);});

test('importación inválida no sobrescribe y paquete válido recupera medios y notas',async()=>{const h=setup();h.click({slide:'apertura'});h.input({},'Nota conservada','data-notes');h.click({action:'export-project'});const raw=await h.blobs[0].text();const pack=JSON.parse(raw);pack.draft.slides[1].media={src:'data:image/png;base64,aGVsbG8=',rights:'pending',alt:'Ejemplo',caption:'Recurso de prueba',credit:'Prueba'};const fresh=setup();await fresh.handlers['import-file:change']({target:{files:[{size:raw.length,text:async()=>JSON.stringify(pack)}],value:'test'}});assert.equal(fresh.ctx.window.JerezPresentation.sceneCount,28);fresh.click({action:'export-project'});const recovered=JSON.parse(await fresh.blobs[0].text());assert.equal(recovered.notes['apertura'],'Nota conservada');assert.equal(recovered.draft.slides[1].media.caption,'Recurso de prueba');const before=fresh.ctx.window.JerezPresentation.sceneCount;await fresh.handlers['import-file:change']({target:{files:[{size:3,text:async()=>'{}'}],value:'bad'}});assert.equal(fresh.ctx.window.JerezPresentation.sceneCount,before);});

test('las 24 escenas contienen concepto, evidencia, límites y tres intercambios completos',()=>{
 const c=vm.createContext({});vm.runInContext(seed+';globalThis.deck=INITIAL_DECK;',c);
 const scenes=c.deck.slides.filter(s=>s.study);assert.equal(scenes.length,24);
 for(const s of scenes){assert.ok(s.study.explanation.length>40,s.id);assert.ok(s.study.sourceNote.length>20,s.id);assert.ok(s.study.evidenceType,s.id);assert.ok(s.study.limitation,s.id);assert.equal(s.study.turns.length,3,s.id);assert.ok(s.points.length>=2,s.id);}
 const h=setup();for(const s of scenes){h.click({slide:s.id});for(let i=0;i<s.study.turns.length;i++){h.click({turnEvent:String(i)});assert.ok(h.view().includes(s.study.explanation),s.id);assert.ok(h.view().includes(s.study.turns[i].resourceTitle),s.id);assert.match(h.view(),/La herida|La persona|Las dos heridas|Otra herida/);}}
});
test('los recursos permiten explorar datos y conservan la selección por escena y turno',()=>{
 const h=setup();h.click({slide:'registro'});h.click({turnEvent:'0'});h.click({resourceIndex:'2'});assert.match(h.view(),/<li class=""><span>Momento 1 \/ 4<\/span>/);assert.match(h.view(),/<li class="now"><span>Momento 3 \/ 4<\/span>/);assert.match(h.view(),/data-resource-index="1">\+ Visita 2/);h.click({turnEvent:'2'});h.click({resourceIndex:'1'});h.click({turnEvent:'0'});assert.match(h.view(),/Momento 3/);h.click({action:'journey'});assert.match(h.elements.dialog.innerHTML,/Enséñame las notas/);h.click({action:'reset-journey'});assert.match(h.app(),/Avanza para seguir la conversación/);
});
test('la fotografía autorizada convive con el recurso y la pendiente no se expone',async()=>{
 const h=setup();h.click({action:'export-project'});const pack=JSON.parse(await h.blobs[0].text());const target=pack.draft.slides.find(s=>s.id==='zonas');target.media={src:'data:image/png;base64,aGVsbG8=',alt:'Imagen de prueba',caption:'Recurso autorizado',credit:'Prueba',rights:'pending'};
 const reader=setup();const importPack=async()=>reader.handlers['import-file:change']({target:{files:[{size:100,text:async()=>JSON.stringify(pack)}],value:'test'}});
 await importPack();reader.click({slide:'zonas'});reader.click({turnEvent:'0'});assert.doesNotMatch(reader.view(),/data-action="photo-open"/);assert.match(reader.view(),/Esquema conceptual/);
 target.media.rights='authorized';await importPack();reader.click({slide:'zonas'});reader.click({turnEvent:'0'});assert.match(reader.view(),/data-action="photo-open"/);assert.match(reader.view(),/Lecho/);reader.click({action:'photo-open'});assert.match(reader.elements.dialog.innerHTML,/Recurso autorizado/);
 reader.click({action:'save'});reader.click({action:'export-html'});const out=await reader.blobs[0].text();const exported=setup(out.match(/<script id="seed">([\s\S]*?)<\/script>/)[1]);exported.click({slide:'zonas'});exported.click({turnEvent:'0'});assert.match(exported.view(),/data-action="photo-open"/);assert.match(exported.view(),/Mirar y preguntar/);
});
test('la herida es la única interlocutora y las interacciones no ensucian la edición',()=>{
 const c=vm.createContext({});vm.runInContext(seed+';globalThis.deck=INITIAL_DECK;',c);
 for(const s of c.deck.slides.filter(s=>s.study)){assert.equal(s.voice,'principal');for(const t of s.study.turns){assert.equal(t.voice,'principal');assert.notEqual(t.kind,'person');}}
 const h=setup();h.click({slide:'persona'});h.click({turnEvent:'0'});assert.match(h.view(),/<strong>La herida<\/strong>/);assert.doesNotMatch(h.view(),/persona-aura|voz recreada|cast-slot role-front-b/);assert.match(h.elements['saved-status'].textContent,/Versión guardada/);
});

test('la copia lista para revisión excluye notas y funciona sin el editor',async()=>{
 const html=await readFile(new URL('../dist/revision.html',import.meta.url),'utf8');const readSeed=html.match(/<script id="seed">([\s\S]*?)<\/script>/)[1];const parsed=vm.createContext({});vm.runInContext(readSeed+';globalThis.deck=INITIAL_DECK;',parsed);assert.ok(parsed.deck.slides.every(s=>!Object.hasOwn(s,'notes')));
 const h=setup(readSeed);assert.equal(h.ctx.window.JerezPresentation.mode,'review');assert.doesNotMatch(h.app(),/Preparar la escena/);h.click({mode:'prepare'});assert.equal(h.ctx.window.JerezPresentation.mode,'review');h.click({mode:'present'});assert.equal(h.ctx.window.JerezPresentation.mode,'present');h.click({slide:'limpieza'});h.click({turnEvent:'0'});h.click({resourceIndex:'3'});assert.match(h.view(),/Piel circundante/);assert.match(h.view(),/class="zone-surround zone-selected"/);
});
test('un recurso importado sin elementos se rechaza sin perder el proyecto',async()=>{
 const h=setup();h.click({action:'export-project'});const pack=JSON.parse(await h.blobs[0].text());pack.draft.slides.find(s=>s.study).study.turns[0].items=[];const before=h.app();await h.handlers['import-file:change']({target:{files:[{size:100,text:async()=>JSON.stringify(pack)}],value:'test'}});assert.equal(h.app(),before);assert.match(h.elements.toast.textContent,/No se ha importado/);
});

test('biblioteca: 11 recursos incrustados, procedencia, relaciones y 3 recorridos válidos',()=>{
 const c=vm.createContext({});vm.runInContext(seed+';globalThis.deck=INITIAL_DECK;',c);
 const d=c.deck,assets=Object.values(d.resourceCatalog);assert.equal(assets.length,11);assert.equal(assets.filter(a=>a.walkthrough).length,3);
 assert.equal(assets.filter(a=>a.kind==='clinical').length,3);
 for(const a of assets){assert.match(a.src,/^data:image\/jpeg;base64,/);assert.ok(a.alt&&a.caption&&a.credit&&a.label);if(a.sourceUrl)assert.match(a.licenseUrl,/^https:\/\/creativecommons.org\//);}
 for(const s of d.slides)for(const id of s.resourceIds||[])assert.ok(d.resourceCatalog[id],s.id);
 const h=setup();assert.doesNotThrow(()=>h.ctx.window.JerezPresentation.validateDeck(d));
});
test('ampliación y pasos manuales funcionan con movimiento reducido y sin modificar la edición',()=>{
 const h=setup();h.click({slide:'biofilm'});assert.match(h.app(),/Ilustración 3D · generada con IA/);
 h.click({action:'scene-resources'});assert.match(h.elements.dialog.innerHTML,/Explorar el modelo de biofilm/);assert.match(h.elements['walkthrough-body'].innerHTML,/Superficie del tejido/);assert.equal(h.elements['walkthrough-toggle'].disabled,true);
 h.dialogClick({assetStep:'2'});assert.match(h.elements['walkthrough-body'].innerHTML,/Microorganismos/);assert.match(h.elements['saved-status'].textContent,/Versión guardada/);
 h.dialogClick({assetAction:'restart'});assert.match(h.elements['walkthrough-body'].innerHTML,/Superficie del tejido/);
 h.click({slide:'parecidas'});h.click({action:'scene-resources'});assert.match(h.elements.dialog.innerHTML,/Jonathan Moore/);h.dialogClick({assetSelect:'1'});assert.match(h.elements.dialog.innerHTML,/otra localización/);
});
test('HTML exportado conserva imágenes y recorridos, excluye recursos con permiso pendiente',async()=>{
 const h=setup();h.click({action:'export-project'});const pack=JSON.parse(await h.blobs[0].text());pack.draft.resourceCatalog.atypical.rights='pending';
 const r=setup();await r.handlers['import-file:change']({target:{files:[{size:100,text:async()=>JSON.stringify(pack)}],value:'test'}});r.click({action:'save'});r.click({action:'export-html'});
 const out=await r.blobs[0].text(),data=out.match(/<script id="seed">([\s\S]*?)<\/script>/)[1];const c=vm.createContext({});vm.runInContext(data+';globalThis.deck=INITIAL_DECK;',c);assert.equal(Object.keys(c.deck.resourceCatalog).length,10);assert.equal(c.deck.resourceCatalog.atypical,undefined);assert.equal(c.deck.slides.find(s=>s.id==='atipica').resourceIds.length,0);
 const exported=setup(data);exported.click({slide:'limpieza'});exported.click({action:'scene-resources'});exported.dialogClick({assetStep:'3'});assert.match(exported.elements['walkthrough-body'].innerHTML,/Piel circundante/);
});
test('guardado local referencia los originales sin duplicar bitmaps; recarga restaura imágenes',()=>{
 const h=setup();h.click({action:'save'});const raw=h.store.get('jerez-conversations-v6');assert.ok(raw.length<2000000);const p=JSON.parse(raw);assert.equal(p.saved.resourceCatalog.biofilm.src,undefined);
 const packed=seed+`;localStorage.setItem('jerez-conversations-v6',${JSON.stringify(raw)});`;
 const reloaded=setup(packed);reloaded.click({slide:'biofilm'});assert.match(reloaded.app(),/src="data:image\/jpeg;base64,/);
});
test('una biblioteca importada con origen remoto o recorridos inválidos se rechaza',async()=>{
 const h=setup();h.click({action:'export-project'});const pack=JSON.parse(await h.blobs[0].text());pack.draft.resourceCatalog.biofilm.src='https://example.org/tracker.jpg';
 assert.throws(()=>h.ctx.window.JerezPresentation.validateDeck(pack.draft),/Imagen de biblioteca inválida/);
 pack.draft.resourceCatalog.biofilm=pack.saved.resourceCatalog.biofilm;pack.draft.resourceCatalog.biofilm.walkthrough.stepMs=0;
 assert.throws(()=>h.ctx.window.JerezPresentation.validateDeck(pack.draft),/Recorrido visual inválido/);
});

test('el hilo avanza, muestra imágenes y cruza al siguiente intercambio',()=>{
 const h=setup();h.click({mode:'present'});h.click({slide:'registro'});h.click({action:'route-here'});const P=h.ctx.window.JerezPresentation;const key=k=>h.handlers['document:keydown']({key:k,code:k,target:{matches:()=>false,closest:()=>null},preventDefault(){}});
 key('ArrowRight');assert.equal(P.step,1);assert.match(h.view(),/Registro de intervenciones/);assert.match(h.view(),/has-media/);
 key('ArrowRight');assert.equal(P.step,2);assert.doesNotMatch(h.view(),/has-media/);assert.match(h.view().replace(/<[^>]*>/g,' ').replace(/\s+/g,' '),/Estas notas no permiten comparar/);
 key('ArrowRight');assert.equal(P.step,3);assert.match(h.view(),/Para seguir/);assert.match(h.view(),/<small>María del Mar<\/small>/);
 key('ArrowLeft');assert.equal(P.step,2);key('ArrowRight');key('ArrowRight');assert.equal(P.slideId,'historia');assert.equal(P.step,0);
});

test('cada paso usa acciones válidas sobre preguntas, recursos y puntos existentes',()=>{
 const c=vm.createContext({});vm.runInContext(seed+';globalThis.deck=INITIAL_DECK;',c);
 for(const s of c.deck.slides.filter(s=>s.study)){let active=null,media=null;for(const [a,cue] of s.study.steps){assert.ok(cue.length>3,s.id);for(const t of a.split(/\s+/)){const n=Number(t.slice(1));
  if(/^t\d+$/.test(t)){assert.ok(s.study.turns[n-1],s.id+' '+t);active=s.study.turns[n-1];if(!/(^|\s)m\d+/.test(a))media=null;}
  else if(/^i\d+$/.test(t))assert.ok(active?.items[n-1],s.id+' '+t);
  else if(/^p\d+$/.test(t))assert.ok(s.points[n-1],s.id+' '+t);
  else if(t==='razon')assert.equal(active?.kind,'decision',s.id);
  else if(/^m\d+$/.test(t)){media=c.deck.resourceCatalog[s.resourceIds?.[n-1]];assert.ok(media,s.id+' '+t);}
  else if(/^h\d+$/.test(t))assert.ok(media?.walkthrough?.steps[n-1],s.id+' '+t);
  else if(t==='cerrar'){assert.ok(media,s.id);media=null;}
  else assert.match(t,/^(p|practica|enlace|muro)$/,s.id);}}
  assert.ok(s.study.habit&&s.study.ask,s.id+' sin costumbre y pregunta');}
 const withImages=c.deck.slides.filter(s=>s.resourceIds?.length);
 assert.ok(withImages.every(s=>s.study.steps.some(p=>/(^|\s)m\d+/.test(p[0]))),'toda escena con imágenes las abre desde el hilo');
});
test('un desvío vuelve al recorrido en el mismo punto',()=>{
 const h=setup();h.click({mode:'present'});h.click({slide:'registro'});h.click({action:'route-here'});const P=h.ctx.window.JerezPresentation;const key=k=>h.handlers['document:keydown']({key:k,code:k,target:{matches:()=>false,closest:()=>null},preventDefault(){}});
 key('ArrowRight');h.click({slide:'zonas'});assert.equal(P.slideId,'zonas');assert.deepEqual({...P.thread},{id:'registro',k:1});key('ArrowRight');assert.equal(P.slideId,'registro');assert.equal(P.step,1);key('ArrowRight');assert.equal(P.step,2);
});

test('el guion se activa y las transiciones pertenecen a María del Mar',()=>{
 const h=setup();h.click({mode:'present'});assert.doesNotMatch(h.app(),/id="guide"/);h.click({action:'prompter'});assert.match(h.app(),/guide-bar prompter/);h.click({action:'prompter'});assert.doesNotMatch(h.app(),/id="guide"/);
 h.click({slide:'cierre'});h.click({action:'route-here'});const key=k=>h.handlers['document:keydown']({key:k,code:k,target:{matches:()=>false,closest:()=>null},preventDefault(){}});
 for(let i=0;i<3;i++)key('ArrowRight');assert.match(h.view(),/Para seguir/);assert.match(h.view(),/<small>María del Mar<\/small>/);assert.doesNotMatch(h.view(),/habit-tally|<s>/);
});

test('los contrastes conservan una sola herida sin brotes ni personaje invitado',()=>{
 const h=setup();h.click({slide:'parecidas'});for(let i=0;i<3;i++){h.click({turnEvent:String(i)});assert.doesNotMatch(h.view(),/is-budded|role-front-b|persona-aura/);assert.equal((h.view().match(/class="orb-zone"/g)||[]).length,1);}
});

test('la ilustración también conserva una interlocutora en los contrastes',()=>{
 const h=setup(seed,{ENTITY_RENDERER:'art'});h.click({slide:'parecidas'});h.click({turnEvent:'1'});assert.match(h.view(),/data-voice="principal"/);assert.doesNotMatch(h.view(),/role-front-b|data-voice="isquemica"/);
});

test('la imagen sube al escenario desde el hilo, recorre sus puntos y la herida mira desde la esquina',()=>{
 const h=setup();h.click({mode:'present'});h.click({slide:'zonas'});h.click({action:'route-here'});const P=h.ctx.window.JerezPresentation;const key=k=>h.handlers['document:keydown']({key:k,code:k,target:{matches:()=>false,closest:()=>null},preventDefault(){}});
 key('ArrowRight');assert.match(h.view(),/has-media/);assert.match(h.view(),/class="stage-media/);assert.match(h.view(),/media-hot on" data-hot="0"/);assert.match(h.view(),/data-state="showing"/);
 key('ArrowRight');assert.match(h.view(),/media-hot on" data-hot="1"/);assert.match(h.view(),/media-note/);
 key('ArrowLeft');key('ArrowLeft');assert.doesNotMatch(h.view(),/has-media/);
 for(let i=0;i<5;i++)key('ArrowRight');assert.doesNotMatch(h.view(),/has-media/);assert.equal(P.step,5);
 h.click({action:'stage-media'});assert.match(h.view(),/has-media/);h.click({hot:'3'});assert.match(h.view(),/Piel circundante/);h.click({action:'media-close'});assert.doesNotMatch(h.view(),/has-media/);
});
test('un recurso de vídeo se presenta en el escenario con su portada y rechaza rutas inseguras',async()=>{
 const h=setup();h.click({action:'export-project'});const pack=JSON.parse(await h.blobs[0].text());
 for(const d of [pack.draft,pack.saved])d.resourceCatalog['wound-zones'].video='videos/zonas.mp4';
 const reader=setup();const load=async p=>reader.handlers['import-file:change']({target:{files:[{size:100,text:async()=>JSON.stringify(p)}],value:'x'}});
 await load(pack);reader.click({slide:'zonas'});reader.click({action:'stage-media'});assert.match(reader.view(),/<video class="media-video" src="videos\/zonas.mp4" poster="data:image\/jpeg;base64,/);assert.match(reader.view(),/data-action="media-play"/);
 const bad=JSON.parse(JSON.stringify(pack));bad.draft.resourceCatalog['wound-zones'].video='../secreto.mp4';const before=reader.ctx.window.JerezPresentation.sceneCount;await load(bad);assert.match(reader.elements.toast.textContent,/No se ha importado/);
});

test('la introducción breve presenta tema y herida antes de la primera decisión',()=>{
 const h=setup();h.click({mode:'present'});const P=h.ctx.window.JerezPresentation;const key=k=>h.handlers['document:keydown']({key:k,code:k,target:{matches:()=>false,closest:()=>null},preventDefault(){}});
 assert.equal(P.slideId,'intro-tema');assert.match(h.view(),/intro-lead "/);key('ArrowRight');assert.match(h.view(),/intro-lead is-on/);key('ArrowRight');assert.match(h.view(),/intro-note is-on/);
 key('ArrowRight');assert.equal(P.slideId,'intro-herida');assert.doesNotMatch(h.view(),/<small>La herida<\/small>/);key('ArrowRight');assert.match(h.view().replace(/<[^>]*>/g,' ').replace(/\s+/g,' '),/María del Mar y yo nos conocemos/);
 for(let i=0;i<3;i++)key('ArrowRight');assert.equal(P.slideId,'apertura');
});
test('cada paso mueve la conversación con la herida: detalle, imagen o su propia voz',()=>{
 const h=setup();h.click({mode:'present'});const P=h.ctx.window.JerezPresentation;const key=k=>h.handlers['document:keydown']({key:k,code:k,target:{matches:()=>false,closest:()=>null},preventDefault(){}});
 const right=()=>{const v=h.view();return v.slice(v.indexOf('<aside class="conversation-panel'));};
 const c=vm.createContext({});vm.runInContext(seed+';globalThis.deck=INITIAL_DECK;',c);
 for(const s of c.deck.slides.filter(s=>s.study)){h.click({slide:s.id});h.click({action:'route-here'});let before=right();
  for(let k=1;k<=s.study.steps.length;k++){key('ArrowRight');assert.equal(P.step,k);const now=right();assert.notEqual(now,before,s.id+' paso '+k+' no cambia la conversación');before=now;}}

});

test('Ampliar abre preguntas y el avance recupera el hilo',()=>{
 const h=setup();h.click({mode:'present'});h.click({slide:'registro'});h.click({action:'route-here'});const key=k=>h.handlers['document:keydown']({key:k,code:k,target:{matches:()=>false,closest:()=>null},preventDefault(){}});
 key('ArrowRight');h.click({action:'expand'});assert.match(h.elements.dialog.innerHTML,/¿repetimos o revisamos/);h.dialogClick({turnEvent:'2'});assert.equal(h.elements.dialog.open,false);assert.match(h.view(),/Repetir o revisar/);key('ArrowRight');assert.doesNotMatch(h.view(),/Repetir o revisar/);assert.equal(h.ctx.window.JerezPresentation.step,2);
});

test('en presentación se pueden recuperar también los detalles ya explorados',()=>{
 const h=setup();h.click({mode:'present'});h.click({slide:'registro'});h.click({turnEvent:'0'});
 h.click({resourceIndex:'3'});assert.match(h.view(),/class="resource-choices"/);
 for(let i=0;i<4;i++)assert.ok(h.view().includes('data-resource-index="'+i+'"'),String(i));
 h.click({resourceIndex:'0'});assert.match(h.view(),/<li class="now"><span>Momento 1 \/ 4/);
});

test('las fuentes de las 24 escenas se localizan en los documentos aportados y conservan su alcance',()=>{
 const c=vm.createContext({});vm.runInContext(seed+';globalThis.deck=INITIAL_DECK;',c);
 const attached=new Set(['G14','G8','G17','E22','E26','I25']);
 const h=setup();
 for(const s of c.deck.slides.filter(s=>s.study)){
  assert.ok(s.refs.every(r=>attached.has(r)),s.id);
  assert.ok(s.study.sourceLabel,s.id);assert.ok(s.study.sourceNote,s.id);
  h.click({slide:s.id});h.click({action:'sources'});
  assert.ok(h.elements.dialog.innerHTML.includes(s.study.sourceNote),s.id);
 }
 assert.match(c.deck.slides.find(s=>s.id==='revision-antimicrobiano').study.limitation,/no se extrapolan/);
 assert.match(c.deck.slides.find(s=>s.id==='capacidad').study.limitation,/No se clasifica el pronóstico/);
 assert.ok(c.deck.slides.filter(s=>s.study).every(s=>!s.study.steps.some(([a])=>a.split(' ').includes('muro'))));
});

test('el recorrido completo puede desandarse y conserva la identidad de cada paso',()=>{
 const c=vm.createContext({});vm.runInContext(seed+';globalThis.deck=INITIAL_DECK;',c);
 const scenes=c.deck.slides.filter(s=>s.study),h=setup();h.click({mode:'present'});h.click({slide:scenes[0].id});h.click({action:'route-here'});
 const P=h.ctx.window.JerezPresentation;
 const key=k=>h.handlers['document:keydown']({key:k,code:k,target:{matches:()=>false,closest:()=>null},preventDefault(){}});
 for(const s of scenes){assert.equal(P.slideId,s.id);for(let k=1;k<=s.study.steps.length;k++){key('ArrowRight');assert.equal(P.step,k,s.id);}if(s!==scenes.at(-1))key('ArrowRight');}
 for(let i=scenes.length-1;i>=0;i--){const s=scenes[i];assert.equal(P.slideId,s.id);for(let k=s.study.steps.length-1;k>=0;k--){key('ArrowLeft');assert.equal(P.step,k,s.id);}if(i)key('ArrowLeft');}
 assert.equal(P.slideId,'apertura');assert.equal(P.step,0);
});

test('el borrador anterior sigue recuperable y no sustituye la revisión editorial nueva',async()=>{
 const h=setup();h.click({action:'export-project'});const pack=JSON.parse(await h.blobs[0].text());
 pack.draft.slides.find(s=>s.id==='registro').title='TÍTULO ANTERIOR PERSONALIZADO';pack.notes.registro='NOTA ANTERIOR CONSERVADA';
 const old={draft:pack.draft,saved:pack.saved,notes:pack.notes};
 const r=setup(seed+`;localStorage.setItem('jerez-conversations-v4',${JSON.stringify(JSON.stringify(old))});`);
 r.click({slide:'registro'});assert.doesNotMatch(r.view(),/TÍTULO ANTERIOR PERSONALIZADO/);
 r.click({action:'legacy'});const recovered=JSON.parse(await r.blobs[0].text());
 assert.equal(recovered.notes.registro,'NOTA ANTERIOR CONSERVADA');
 assert.equal(recovered.draft.slides.find(s=>s.id==='registro').title,'TÍTULO ANTERIOR PERSONALIZADO');
 assert.equal(r.store.get('jerez-conversations-v4'),JSON.stringify(old));
});


test('el estudio líquido es autónomo y la copia conserva una sola interlocutora',async()=>{
 const study=await readFile(new URL('../dist/entidad-motion.html',import.meta.url),'utf8');const alternate=await readFile(new URL('../dist/revision-liquid.html',import.meta.url),'utf8');assert.doesNotMatch(study,/\/\* ENTITY \*\/|__FIGTREE__|__FRAUNCES__/);assert.match(alternate,/globalThis.ENTITY_RENDERER="liquid"/);
 const h=setup(seed,{ENTITY_RENDERER:'liquid'});h.click({slide:'parecidas'});h.click({turnEvent:'1'});assert.match(h.view(),/data-voice="principal"/);assert.doesNotMatch(h.view(),/role-front-b/);
});

test('la escena de prueba conserva las preguntas y recursos reales sin modificar la edición guardada',async()=>{
 const page=await readFile(new URL('../dist/escena-entidad.html',import.meta.url),'utf8');
 const sceneSeed=page.match(/<script id="seed">([\s\S]*?)<\/script>/)[1];
 const c=vm.createContext({});vm.runInContext(sceneSeed+';globalThis.deck=INITIAL_DECK;',c);
 assert.equal(c.deck.slides.length,1);assert.equal(c.deck.slides[0].id,'limpieza');
 assert.ok(!('notes' in c.deck.slides[0]));
 const calls=[];const h=setup(sceneSeed,{EntitySceneLab:{prepare(){calls.push('prepare');},bind(){calls.push('bind');}}});
 assert.equal(h.ctx.window.JerezPresentation.slideId,'limpieza');
 assert.deepEqual(calls.slice(-2),['prepare','bind']);
 h.click({turnEvent:'0'});assert.ok(h.view().replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').includes('El lecho, el borde y la piel de alrededor.'));
 h.click({action:'stage-media'});assert.match(h.view(),/data-hot="2"/);
 h.click({hot:'2'});assert.match(h.view(),/Piel perilesional/);
 h.click({action:'media-close'});assert.match(h.view(),/data-action="expand"/);
 assert.equal(h.store.size,0);assert.doesNotMatch(h.app(),/Guardar para presentar/);
});

test('la exposición ofrece una entrada principal y reserva las ramas para Ampliar',()=>{
 const h=setup();h.click({mode:'present'});h.click({slide:'apertura'});h.click({action:'route-here'});assert.match(h.view(),/data-action="step-forward"/);assert.doesNotMatch(h.view(),/class="orbit-chips"|data-turn-event/);h.click({action:'step-forward'});assert.equal(h.ctx.window.JerezPresentation.step,1);assert.doesNotMatch(h.view(),/class="resource-choices"/);h.click({action:'expand'});for(let i=0;i<3;i++)assert.ok(h.elements.dialog.innerHTML.includes('data-turn-event="'+i+'"'));
});
test('la nueva edición deja intacto el borrador v5 para recuperarlo',async()=>{
 const h=setup();h.click({action:'export-project'});const pack=JSON.parse(await h.blobs[0].text());pack.notes.registro='NOTA V5';const raw=JSON.stringify(pack);const r=setup(seed+`;localStorage.setItem('jerez-conversations-v5',${JSON.stringify(raw)});`);r.click({action:'legacy'});assert.equal(r.store.get('jerez-conversations-v5'),raw);assert.equal(JSON.parse(await r.blobs[0].text()).notes.registro,'NOTA V5');
});

test('el personaje es abstracto y presenta historias sin localización ni paciente fijas',()=>{
 const c=vm.createContext({});vm.runInContext(seed+';globalThis.deck=INITIAL_DECK;',c);
 for(const s of c.deck.slides.filter(s=>s.study)){assert.equal(s.study.caseLabel,'Personaje abstracto · historias docentes');assert.equal(s.voice,'principal');assert.ok(s.study.turns.every(t=>t.voice==='principal'));}
 assert.ok(c.deck.slides.find(s=>s.id==='intro-herida').intro.lines.every(l=>!l.includes('Soy una herida de pierna')));
});

test('la presentación activa usa Campo vivo y Sangre y piel en sus 24 escenas y al exportar',async()=>{
 const h=setup();
 assert.equal(h.ctx.ENTITY_RENDERER,'liquid');assert.equal(h.ctx.ENTITY_VARIANT,3);assert.equal(h.ctx.ENTITY_INK,1);
 assert.doesNotMatch(engine,/globalThis\.ENTITY_ART\s*=/);
 const c=vm.createContext({});vm.runInContext(seed+';globalThis.scenes=INITIAL_DECK.slides.filter(s=>s.study);',c);
 assert.equal(c.scenes.length,24);
 for(const s of c.scenes){
  h.click({slide:s.id});assert.equal((h.view().match(/class="orb-zone"/g)||[]).length,1,s.id);
  h.click({turnEvent:'0'});assert.match(h.view(),/data-voice="principal"/,s.id);
 }
 h.click({action:'export-html'});const output=await h.blobs.at(-1).text();
 const exported=output.match(/<script id="seed">([\s\S]*?)<\/script>/)[1];
 const r=setup(exported);assert.equal(r.ctx.ENTITY_RENDERER,'liquid');assert.equal(r.ctx.ENTITY_INK,1);
 const explicit=setup(seed,{ENTITY_RENDERER:'liquid',ENTITY_VARIANT:3,ENTITY_INK:2});assert.equal(explicit.ctx.ENTITY_INK,2);
});

test('las 24 escenas componen el escenario por contenido, conservan anclas y recuperan el encuadre al retroceder',()=>{
 const c=vm.createContext({});vm.runInContext(seed+';globalThis.deck=INITIAL_DECK;',c);
 const h=setup();h.click({mode:'present'});const views=new Set();
 const view=()=>h.view().match(/data-composition="([^"]+)"/)[1];
 for(const s of c.deck.slides.filter(s=>s.study)){
  h.click({slide:s.id});h.click({action:'route-here'});assert.equal(view(),'dialogue',s.id);
  const states=[view()];
  for(let k=0;k<s.study.steps.length;k++){
   h.click({action:'step-forward'});states.push(view());views.add(view());
   assert.match(h.view(),new RegExp('aria-label="Etapa '+(s.mov+1)+' de 4:'),s.id);
   assert.ok(h.view().includes(s.study.habit.replace(/&/g,'&amp;').replace(/</g,'&lt;')),s.id+' actuación conservada');
   assert.match(h.view(),/Por costumbre/);assert.match(h.view(),/Nos preguntamos/);
   assert.equal((h.view().match(/class="orb-zone"/g)||[]).length,1,s.id);
  }
  assert.equal(view(),'closing',s.id);assert.match(h.view(),/class="scene-learning"/);
  for(let k=states.length-2;k>=0;k--){h.click({action:'step-back'});assert.equal(view(),states[k],s.id+' retroceso '+k);}
 }
 for(const name of ['concept','closing','media','resource','decision'])assert.ok(views.has(name),name);
});

test('el HTML exportado conserva composiciones, paleta y marcadores dentro del plano de imagen',async()=>{
 const h=setup();h.click({action:'export-html'});const output=await h.blobs.at(-1).text();
 assert.match(html,/--paper:#f5f1eb/);assert.match(html,/\.move-veil\[data-movement="3"\]/);
 const reader=setup(output.match(/<script id="seed">([\s\S]*?)<\/script>/)[1]);
 reader.click({mode:'present'});reader.click({slide:'zonas'});reader.click({action:'route-here'});reader.click({action:'step-forward'});
 assert.match(reader.view(),/data-composition="media"/);
 assert.match(reader.view(),/class="media-picture">[\s\S]+class="media-hot on"[\s\S]+<\/div><div class="media-note"/);
 reader.click({action:'media-close'});assert.doesNotMatch(reader.view(),/data-composition="media"/);
 h.click({mode:'prepare'});h.click({slide:'zonas'});assert.match(h.view(),/data-composition="prepare"/);
});

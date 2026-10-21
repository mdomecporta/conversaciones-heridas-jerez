'use strict';
(() => {
 const $ = q => document.querySelector(q);
 const clone = x => JSON.parse(JSON.stringify(x));
 const esc = x => String(x ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const KEY='jerez-conversations-v1a';
 const layouts={cover:'Apertura',conversation:'Conversación',three:'Tres situaciones',map:'Entidad y esquema',comparison:'Contrapunto',path:'Secuencia',measure:'Observación',timeline:'Seguimiento',decision:'Decisión con revelado',contrast:'Evitar / hacer',zones:'Zonas de limpieza',outcomes:'Resultados',questions:'Cinco preguntas',closing:'Cierre',institutional:'Institucional'};
 const voiceNames={principal:'Herida · historia principal',isquemica:'Herida · contrapunto vascular',paliativa:'Herida · cambio de objetivo',persona:'Voz de la persona',dual:'Dos historias'};
 const cleanDeck = deck => ({...clone(deck),slides:deck.slides.map(s=>{const {notes,...publicSlide}=clone(s);return publicSlide;})});
 let storageError='', stored=null;
 if(!BOOT.readOnly){try{stored=JSON.parse(localStorage.getItem(KEY)||'null');}catch{storageError='No se pudo recuperar el guardado local.';}}
 let draft=stored?.draft || clone(BOOT.deck||INITIAL_DECK);
 let saved=stored?.saved || cleanDeck(draft);
 let notes=stored?.notes || Object.fromEntries(draft.slides.map(s=>[s.id,s.notes||'']));
 draft.slides.forEach(s=>delete s.notes);
 let mode=BOOT.readOnly?'review':BOOT.mode, current=draft.slides.find(s=>s.id==='apertura')?.id||draft.slides[0].id, tab='content', inspectorOpen=false, dirty=!!stored?.dirty;
 let choices={}, revealed={}, undo=[], pendingTimer=null, lastSave=stored?.lastSave||null, motion=true, orbFrames=[];
 const deck=()=>mode==='prepare'?draft:saved;
 const currentSlide=()=>deck().slides.find(s=>s.id===current)||deck().slides[0];
 const index=()=>deck().slides.findIndex(s=>s.id===currentSlide().id);
 function persist(){if(BOOT.readOnly)return;try{lastSave=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify({draft,saved,notes,dirty,lastSave}));storageError='';}catch{storageError='No se ha podido guardar. Exporta una copia para conservar el trabajo.';toast(storageError);}updateStatus();}
 function updateStatus(){const el=$('#saved-status');if(el)el.textContent=storageError || (dirty?'Borrador guardado · cambios pendientes':'Versión guardada');}
 function markDirty(){dirty=true;clearTimeout(pendingTimer);pendingTimer=setTimeout(persist,250);updateStatus();}
 function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('visible'),3800);}
 function remember(){undo.push({draft:clone(draft),saved:clone(saved),notes:clone(notes),dirty,current});if(undo.length>25)undo.shift();}
 const orb = (voice='principal') => `<div class="orb-zone" aria-hidden="true"><canvas class="orb-canvas" data-voice="${esc(voice)}"></canvas></div>`;
 function points(items,cls=''){return `<div class="points ${cls}">${items.map((p,i)=>`<div class="point" data-number="${String(i+1).padStart(2,'0')}"><h3>${esc(p[0])}</h3><p class="point-text">${esc(p[1])}</p></div>`).join('')}</div>`;}
 const voiceLine=s=>`<div class="voice-line"><span class="signal" aria-hidden="true"><i></i><i></i><i></i><i></i></span>${esc(voiceNames[s.voice]||'Herida')}<span>· caso docente</span></div>`;
 function renderSlide(s,pos,total,{print=false}={}){
  let layout=s.layout, body='', show=print||revealed[s.id];
  const title=`<h2>${esc(s.title)}</h2>`, lead=`<p class="lead">${esc(s.message)}</p>`;
  if(s.media && s.media.rights==='authorized'){
   body=`${title}${lead}<div class="photo-layout"><figure><img src="${esc(s.media.src)}" alt="${esc(s.media.alt||s.media.caption||'Recurso visual docente')}"><figcaption>${esc(s.media.caption)}${s.media.credit?' · '+esc(s.media.credit):''}</figcaption></figure>${points(s.points)}</div>`;
  }else if(layout==='institutional' && s.institutional){body=`<img class="institutional" src="${esc(s.institutional)}" alt="Marco institucional aportado por la organización"><div class="institutional-copy ${s.institutionalKind==='open'?'institutional-open':'institutional-close'}"><h2>${esc(s.title)}</h2><p>${esc(s.message)}</p>${s.institutionalKind==='open'?`<strong>${esc(deck().author)}</strong><p>EPA-HCC · AGS Campo de Gibraltar Este</p>`:''}</div>`;}
  else if(layout==='cover')body=`${orb()}<h1>${esc(s.title)}</h1>${lead}<div class="cover-info"><strong>${esc(deck().author)}</strong><br>EPA-HCC · AGS Campo de Gibraltar Este<br><br>Mesa 2 · ¿Es posible cicatrizar todas las heridas?<br>19 noviembre 2026 · Jerez de la Frontera</div>`;
  else if(layout==='conversation')body=`${orb(s.voice)}${voiceLine(s)}${title}${lead}${points(s.points)}`;
  else if(layout==='comparison')body=`${title}${lead}<div class="comparison-layout">${s.points.map((p,i)=>`<div class="case">${orb(i?'isquemica':'principal')}<div><h3>${esc(p[0])}</h3><p class="point-text">${esc(p[1])}</p></div></div>`).join('')}</div>`;
  else if(layout==='map')body=`${title}${lead}<div class="map-layout">${orb(s.voice)}${points(s.points)}</div>`;
  else if(layout==='measure')body=`${title}${lead}<div class="measure-layout"><div class="measure-visual">${orb(s.voice)}</div>${points(s.points)}</div>`;
  else if(layout==='zones')body=`${title}${lead}<div class="zone-layout">${orb(s.voice)}${points(s.points)}</div>`;
  else if(layout==='decision')body=`${title}${lead}<div class="decision-grid"><div><p class="question">${esc(s.question||'¿Qué información necesitas para decidir?')}</p><div class="options">${(s.choices||['Revisar los datos','Plantear una alternativa']).map((c,i)=>`<button class="option ${choices[s.id]===i?'selected':''}" data-choice="${i}" aria-pressed="${choices[s.id]===i}"><span>${String.fromCharCode(65+i)}</span>${esc(c)}</button>`).join('')}</div>${!print?`<button class="reveal-button primary" data-action="reveal">${show?'Ocultar razonamiento':'Mostrar razonamiento'}</button>`:''}</div><div>${show?`<div class="reveal-answer"><strong>Razonamiento clínico</strong>${esc(s.answer||'Completar el razonamiento con la ponente.')}${points(s.reveal||s.points)}</div>`:`<div class="case-data">${s.points.map(p=>`<h3>${esc(p[0])}</h3><p>${esc(p[1])}</p><br>`).join('')}</div><p class="awaiting">Primero, contrastamos las propuestas.<br>Después, revisamos el razonamiento.</p>`}</div></div>`;
  else if(layout==='closing')body=`${orb(s.voice)}${title}${lead}${points(s.points)}`;
  else body=`${title}${lead}${points(s.points)}`;
  if(s.takeaway && layout!=='cover' && layout!=='decision')body+=`<p class="takeaway">${esc(s.takeaway)}</p>`;
  return `<article class="slide ${esc(layout)} ${layout==='institutional'?'institutional-slide':''}" aria-label="Diapositiva ${pos+1}: ${esc(s.title)}"><div class="slide-head"><span>${esc(s.chapter)}</span><span class="deck-label">Conversaciones con una herida</span></div><div class="slide-body">${body}</div><footer class="slide-footer"><span>${s.refs.map(r=>esc(r)).join(' · ')}${s.refs.length?' · ':''}Síntesis docente${s.review==='validated'?'':' · revisión clínica pendiente'}</span><span>${String(pos+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</span></footer></article>`;
 }
 function render(){
  stopOrbs(); const s=currentSlide(),i=index(); current=s.id;
  $('#app').innerHTML=`<header class="topbar"><div class="brand"><span class="brandmark" aria-hidden="true"></span><div>Conversaciones con una herida<small>María del Mar Candil Ramón · Jerez 2026</small></div></div>${!BOOT.readOnly?`<nav class="mode-switch" aria-label="Modo de trabajo">${[['prepare','Preparar'],['review','Revisar'],['present','Presentar']].map(([id,label])=>`<button class="${mode===id?'active':''}" data-mode="${id}" aria-pressed="${mode===id}">${label}</button>`).join('')}</nav>`:`<span class="muted" style="font-size:12px">Copia de revisión</span>`}<div class="top-actions"><span class="saved-status" id="saved-status"></span>${mode==='prepare'?'<button data-action="export">Compartir / copia</button><button class="primary" data-action="save">Guardar para presentar</button>':'<button data-action="overview">Escenas</button><button data-action="fullscreen">Pantalla completa</button>'}</div></header><div class="workspace ${mode}">${mode==='prepare'?sidebar():''}<main class="workarea">${mode==='review'?'<div class="review-banner">Versión de trabajo · pendiente de validación clínica por la ponente. Casos docentes sintéticos.</div>':''}<div class="work-meta"><strong>Escena ${String(i+1).padStart(2,'0')} <span class="muted">/ ${esc(s.chapter)}</span></strong><span class="status-badge ${s.review==='validated'?'validated':''}">${s.review==='validated'?'Revisada por la ponente':'Pendiente de revisión clínica'}</span></div><div class="stage-holder"><div class="stage-shell" id="stage">${renderSlide(s,i,deck().slides.length)}</div></div><div class="bottom-nav"><div class="nav-cluster"><button data-action="previous" aria-label="Escena anterior" ${i===0?'disabled':''}>←</button><span class="slide-count">${String(i+1).padStart(2,'0')} / ${deck().slides.length}</span><button data-action="next" aria-label="Escena siguiente" ${i===deck().slides.length-1?'disabled':''}>→</button></div><div class="nav-cluster">${mode==='prepare'?'<button class="mobile-editor" data-action="editor">Editar</button>':''}<button data-action="sources">Fuentes</button><button data-action="questions">5 preguntas</button><button data-action="motion" aria-pressed="${motion}">${motion?'Pausar movimiento':'Activar movimiento'}</button><button data-action="help" aria-label="Ayuda de navegación">?</button></div></div><div class="learning-bar"><span class="learning-index">${s.q===null?'↗':String(s.q+1).padStart(2,'0')}</span><div class="learning-text"><small>${s.q===null?'El recorrido':'Aprendizaje que construimos'}</small>${s.q===null?'Comprender · Acordar · Decidir · Comprobar · Reevaluar':esc(QUESTIONS[s.q].text)}</div></div></main>${mode==='prepare'?inspector(s):''}</div>`;
  updateStatus();startOrbs();
  const active=$('.scene-item.active');if(active)active.scrollIntoView({block:'nearest'});
 }
 function sidebar(){return `<aside class="sidebar"><div class="sidebar-header"><h2>El recorrido</h2><p>${draft.slides.length} pantallas · aprox. 25 minutos<br>Guion y casos en revisión</p></div><nav class="scene-list" aria-label="Secuencia de diapositivas">${draft.slides.map((s,i)=>`<button class="scene-item ${s.id===current?'active':''}" data-slide="${esc(s.id)}" ${s.id===current?'aria-current="step"':''}><span class="number">${String(i+1).padStart(2,'0')}</span><span class="scene-title">${esc(s.title)}<small><span class="review-dot ${s.review}"></span>${esc(s.chapter)}</small></span></button>`).join('')}</nav><div class="sidebar-tools"><button data-action="overview">Vista general</button><button data-action="undo" ${!undo.length?'disabled':''}>Deshacer</button></div></aside>`;}
 function inspector(s){
  let fields='';
  if(tab==='content')fields=`<label for="title">Título / mensaje de apertura</label><textarea id="title" data-field="title" rows="3">${esc(s.title)}</textarea><label for="message">Idea principal</label><textarea id="message" data-field="message" rows="3">${esc(s.message)}</textarea><label for="points">Esquema o conceptos</label><textarea id="points" data-field="points" rows="7">${esc(s.points.map(p=>p.join(' | ')).join('\n'))}</textarea><div class="field-help">Un concepto por línea: título | explicación</div><label for="takeaway">Aprendizaje visible</label><textarea id="takeaway" data-field="takeaway" rows="2">${esc(s.takeaway||'')}</textarea>${s.layout==='decision'?`<label for="question">Pregunta al público</label><textarea id="question" data-field="question" rows="2">${esc(s.question||'')}</textarea><label for="choices">Opciones, una por línea</label><textarea id="choices" data-field="choices" rows="3">${esc((s.choices||[]).join('\n'))}</textarea><label for="answer">Razonamiento revelable</label><textarea id="answer" data-field="answer" rows="5">${esc(s.answer||'')}</textarea><label for="reveal">Datos del revelado</label><textarea id="reveal" data-field="reveal" rows="5">${esc((s.reveal||[]).map(p=>p.join(' | ')).join('\n'))}</textarea>`:''}`;
  if(tab==='design')fields=`<label for="layout">Composición</label><select id="layout" data-field="layout">${Object.entries(layouts).filter(([k])=>k!=='institutional'||s.institutional).map(([k,v])=>`<option value="${k}" ${s.layout===k?'selected':''}>${v}</option>`).join('')}</select><label for="voice">Voz / entidad</label><select id="voice" data-field="voice">${Object.entries(voiceNames).map(([k,v])=>`<option value="${k}" ${s.voice===k?'selected':''}>${v}</option>`).join('')}</select><label for="chapter">Bloque</label><input id="chapter" data-field="chapter" value="${esc(s.chapter)}"><label for="learning">Pregunta del recorrido</label><select id="learning" data-field="q"><option value="" ${s.q===null?'selected':''}>Sin pregunta asociada</option>${QUESTIONS.map((q,i)=>`<option value="${i}" ${s.q===i?'selected':''}>${i+1}. ${q.short}</option>`).join('')}</select><label for="media-file">Imagen de la escena</label><input id="media-file" type="file" accept="image/png,image/jpeg,image/webp"><p class="field-help">Imagen local · PNG, JPG o WebP · hasta 4 MB. Se incluye en las copias exportadas; no se envía a un servidor.</p>${s.media?`<label for="media-caption">Pie de imagen</label><textarea id="media-caption" data-media="caption" rows="2">${esc(s.media.caption)}</textarea><label for="media-alt">Descripción accesible</label><textarea id="media-alt" data-media="alt" rows="2">${esc(s.media.alt)}</textarea><label for="media-credit">Procedencia y crédito</label><input id="media-credit" data-media="credit" value="${esc(s.media.credit)}"><label for="media-rights">Permiso para esta versión compartible</label><select id="media-rights" data-media="rights"><option value="pending" ${s.media.rights!=='authorized'?'selected':''}>Pendiente: no mostrar en el lienzo</option><option value="authorized" ${s.media.rights==='authorized'?'selected':''}>Uso autorizado y sin datos identificativos</option></select><button class="panel-action" data-action="remove-media">Quitar imagen</button>`:''}<div class="scene-tools"><button data-action="duplicate">Duplicar</button><button data-action="move-up">Subir</button><button data-action="move-down">Bajar</button><button class="danger" data-action="delete">Eliminar</button></div>`;
  if(tab==='notes')fields=`<label for="notes">Notas privadas de la ponente</label><textarea id="notes" data-notes rows="8">${esc(notes[s.id]||'')}</textarea><p class="field-help">Solo en Preparar. No se incluyen en la copia HTML para revisar o presentar.</p><label for="review-status">Revisión clínica</label><select id="review-status" data-field="review"><option value="pending" ${s.review!=='validated'?'selected':''}>Pendiente de revisión por la ponente</option><option value="validated" ${s.review==='validated'?'selected':''}>Revisada por la ponente</option></select><label for="refs">Fuentes de esta escena</label><input id="refs" data-field="refs" value="${esc(s.refs.join(', '))}"><p class="field-help">Identificadores: ${Object.keys(REFERENCES).join(', ')}. Guardar no equivale a validar.</p><div class="review-note">Casos e ilustraciones conceptuales. Revisar formulación, ámbito de las recomendaciones y circuitos locales antes de la exposición.</div><button class="panel-action" data-action="restore">Recuperar esta escena guardada</button>`;
  return `<aside class="inspector ${inspectorOpen?'open':''}"><div style="display:flex;justify-content:space-between"><h2>Preparar la escena</h2>${inspectorOpen?'<button data-action="editor" style="padding:0 5px">×</button>':''}</div><p>Los cambios se ven en el lienzo.<br>El guardado local depende de este navegador.</p><nav class="inspector-tabs" aria-label="Panel de edición">${[['content','Contenido'],['design','Diseño'],['notes','Notas y revisión']].map(([k,v])=>`<button data-tab="${k}" class="${tab===k?'active':''}">${v}</button>`).join('')}</nav>${fields}</aside>`;
 }
 function refreshStage(){const s=currentSlide();$('#stage').innerHTML=renderSlide(s,index(),deck().slides.length);stopOrbs();startOrbs();}
 function navigate(delta){const next=index()+delta;if(next<0||next>=deck().slides.length)return;current=deck().slides[next].id;revealed[current]=false;delete choices[current];render();}
 function setMode(next){if(next===mode)return;persist();mode=next;if(!deck().slides.some(s=>s.id===current))current=deck().slides[0].id;revealed={};choices={};render();}
 function savePresentation(){saved=cleanDeck(draft);dirty=false;persist();toast('Versión completa guardada para presentar. Notas privadas separadas.');}
 function showDialog(title,body){const d=$('#dialog');d.innerHTML=`<div class="modal-head"><h2>${esc(title)}</h2><button data-action="close-dialog" aria-label="Cerrar">×</button></div>${body}`;d.showModal();}
 function showSources(all=false){const ids=all?Object.keys(REFERENCES):currentSlide().refs;showDialog(all?'Bibliografía del recorrido':'Fuentes de esta escena',`<p class="modal-copy">Referencias del guion. Revisión clínica pendiente. Las citas no autorizan la reproducción de imágenes de terceros.</p><div class="reference-list">${ids.map(id=>{const r=REFERENCES[id];return r?`<article><span class="reference-tag">${esc(id)} · ${esc(r.year)}</span><h3>${esc(r.title)}</h3><p>${esc(r.detail)}</p>${r.url?`<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Consultar publicación ↗</a>`:'<p>PDF aportado en la carpeta bibliography del proyecto.</p>'}</article>`:`<article><h3>${esc(id)}</h3><p>Referencia pendiente de completar.</p></article>`;}).join('')}</div><button data-action="all-sources">Ver toda la bibliografía</button>`);}
 function download(name,text,type='application/json'){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([text],{type}));a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
 function jsonSafe(v){return JSON.stringify(v).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');}
 function exportHTML(){
  const publicDeck=cleanDeck(saved);publicDeck.slides.forEach(s=>{if(s.media?.rights!=='authorized')s.media=null;});
  const css=$('style').textContent;
  const engine=$('#engine').textContent;
  const data=`const REFERENCES=${jsonSafe(REFERENCES)};const QUESTIONS=${jsonSafe(QUESTIONS)};const INITIAL_DECK=${jsonSafe(publicDeck)};const BOOT={mode:'review',readOnly:true,deck:INITIAL_DECK};`;
  const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(publicDeck.title)} · Revisión</title><style>${css}</style></head><body><div id="app"></div><div id="toast" role="status" aria-live="polite"></div><dialog id="dialog"></dialog><input id="import-file" type="file" accept="application/json,.json" hidden><script id="seed">${data}<\/script><script id="engine">${engine}<\/script></body></html>`;
  download('conversaciones-heridas-revision.html',html,'text/html');toast('HTML de la versión guardada exportado. No incluye notas privadas.');
 }
 function exportProject(){persist();download('conversaciones-heridas-proyecto.json',JSON.stringify({format:'jerez-presentation',schemaVersion:1,draft,saved,notes,dirty,exportedAt:new Date().toISOString()},null,2));toast('Copia editable exportada con recursos y notas privadas.');}
 function validateDeck(d){
  if(!d||d.schemaVersion!==1||!Array.isArray(d.slides)||d.slides.length<1||d.slides.length>100||typeof d.title!=='string'||typeof d.author!=='string')throw Error('Formato de presentación no compatible.');
  const ids=new Set();
  for(const s of d.slides){if(typeof s.id!=='string'||!s.id||ids.has(s.id)||typeof s.title!=='string'||typeof s.message!=='string'||typeof s.chapter!=='string'||!Object.hasOwn(layouts,s.layout)||!Array.isArray(s.points)||!s.points.every(p=>Array.isArray(p)&&p.length===2&&p.every(x=>typeof x==='string'))||!Array.isArray(s.refs)||!s.refs.every(x=>typeof x==='string')||!(s.q===null||Number.isInteger(s.q)&&s.q>=0&&s.q<5))throw Error('Hay una escena inválida o identificadores repetidos.');ids.add(s.id);
   if(s.media&&(!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s.media.src)||s.media.src.length>6e6))throw Error('Recurso de imagen inválido.');
   if(s.institutional&&!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s.institutional))throw Error('Imagen institucional inválida.');
   if(s.choices&&(!Array.isArray(s.choices)||!s.choices.every(x=>typeof x==='string')))throw Error('Opciones inválidas.');
   if(s.reveal&&(!Array.isArray(s.reveal)||!s.reveal.every(p=>Array.isArray(p)&&p.length===2&&p.every(x=>typeof x==='string'))))throw Error('Revelado inválido.');
  }
  return d;
 }
 function showExport(){showDialog('Compartir y conservar',`<p class="modal-copy">La edición se guarda en este navegador. Para trasladar el trabajo, conserva una copia del proyecto. Para revisar o presentar, exporta un HTML autónomo de la versión guardada.</p><div class="modal-buttons"><button class="primary" data-action="export-html">HTML para revisar y presentar</button><button data-action="export-project">Copia editable del proyecto</button><button data-action="import">Importar proyecto</button></div><div class="export-note">${dirty?'Hay cambios de borrador sin pasar a la versión de presentación. El HTML usará la última versión guardada.':'El HTML usará la versión guardada.'}<br>El HTML excluye notas privadas e imágenes con permiso pendiente. La copia editable incluye notas y todos los recursos.</div><p class="modal-copy">Para compartir por enlace hay que alojar el HTML. Este prototipo no sincroniza modificaciones entre equipos.</p>`);}
 $('#app').addEventListener('click',e=>{
  const button=e.target.closest('button');if(!button)return;
  if(button.dataset.slide){current=button.dataset.slide;revealed[current]=false;render();return;}
  if(button.dataset.mode){setMode(button.dataset.mode);return;}
  if(button.dataset.tab){tab=button.dataset.tab;render();return;}
  if(button.dataset.choice!==undefined){choices[current]=Number(button.dataset.choice);refreshStage();return;}
  action(button.dataset.action);
 });
 $('#dialog').addEventListener('click',e=>{const b=e.target.closest('button');if(b?.dataset.slide){current=b.dataset.slide;revealed[current]=false;$('#dialog').close();render();}else if(b)action(b.dataset.action);});
 function action(a){switch(a){
  case 'previous':navigate(-1);break;case 'next':navigate(1);break;
  case 'save':savePresentation();break;
  case 'reveal':revealed[current]=!revealed[current];refreshStage();break;
  case 'sources':showSources();break;case 'all-sources':$('#dialog').close();showSources(true);break;
  case 'questions':showDialog('Cinco preguntas para la práctica',`<p class="modal-copy">Síntesis docente del recorrido. No es una escala ni una herramienta validada.</p><div class="reference-list">${QUESTIONS.map((q,i)=>`<article><span class="reference-tag">${String(i+1).padStart(2,'0')} · ${q.short}</span><h3>${esc(q.text)}</h3></article>`).join('')}</div>`);break;
  case 'fullscreen':if(document.fullscreenElement)document.exitFullscreen().catch(()=>toast('No se pudo salir de pantalla completa.'));else document.documentElement.requestFullscreen?.().catch(()=>toast('El navegador no permite pantalla completa en esta vista.'));break;
  case 'motion':motion=!motion;render();break;
  case 'editor':inspectorOpen=!inspectorOpen;render();break;
  case 'overview':showDialog('El recorrido completo',`<div class="overview-grid">${deck().slides.map((s,i)=>`<button data-slide="${esc(s.id)}"><small>${String(i+1).padStart(2,'0')} · ${esc(s.chapter)}</small>${esc(s.title)}</button>`).join('')}</div>`);break;
  case 'help':showDialog('Presentar con tranquilidad',`<p class="modal-copy">Las interacciones están preparadas. Esta interfaz no es una IA clínica y no genera respuestas.</p>${[['← / →','Cambiar de escena'],['Espacio','Revelar razonamiento o avanzar'],['Inicio / Fin','Primera o última escena'],['F','Pantalla completa'],['Esc','Cerrar ventana o salir de pantalla completa']].map(([k,v])=>`<div class="help-key"><span>${v}</span><kbd>${k}</kbd></div>`).join('')}<p class="modal-copy">La navegación conserva la versión guardada. Al regresar a una escena, la interacción vuelve al estado inicial.</p>`);break;
  case 'export':showExport();break;case 'export-html':exportHTML();break;case 'export-project':exportProject();break;
  case 'import':$('#dialog').close();$('#import-file').click();break;
  case 'close-dialog':$('#dialog').close();break;
  case 'duplicate':{remember();const s=clone(currentSlide());s.id='scene-'+crypto.randomUUID();s.title+=' (copia)';draft.slides.splice(index()+1,0,s);notes[s.id]=notes[current]||'';current=s.id;markDirty();render();break;}
  case 'move-up':case 'move-down':{const i=index(),j=i+(a==='move-up'?-1:1);if(j<0||j>=draft.slides.length)break;remember();[draft.slides[i],draft.slides[j]]=[draft.slides[j],draft.slides[i]];markDirty();render();break;}
  case 'delete':if(draft.slides.length===1){toast('La presentación necesita al menos una escena.');break;}remember();{const i=index();draft.slides.splice(i,1);current=draft.slides[Math.min(i,draft.slides.length-1)].id;markDirty();render();toast('Escena eliminada. Puedes recuperarla con Deshacer.');}break;
  case 'undo':{const old=undo.pop();if(old){draft=old.draft;saved=old.saved;notes=old.notes;dirty=old.dirty;current=old.current;persist();render();toast('Cambio deshecho.');}break;}
  case 'restore':{const original=saved.slides.find(s=>s.id===current);if(!original){toast('Esta escena aún no tiene versión guardada.');break;}remember();draft.slides[index()]=clone(original);markDirty();render();toast('Escena recuperada. Las notas privadas se conservan.');break;}
  case 'remove-media':remember();currentSlide().media=null;markDirty();render();break;
  }
 }
 $('#app').addEventListener('input',e=>{
  if(mode!=='prepare')return;const el=e.target,s=currentSlide();
  if(el.hasAttribute('data-notes')){notes[s.id]=el.value;persist();return;}
  if(el.dataset.media){s.media[el.dataset.media]=el.value;markDirty();refreshStage();return;}
  const f=el.dataset.field;if(!f)return;let value=el.value;
  if(f==='points'||f==='reveal')value=value.split('\n').filter(x=>x.trim()).map(line=>{const [h,...rest]=line.split('|');return [h.trim(),rest.join('|').trim()];});
  if(f==='choices')value=value.split('\n').filter(x=>x.trim());
  if(f==='refs')value=value.split(',').map(x=>x.trim()).filter(Boolean);
  if(f==='q')value=value===''?null:Number(value);
  s[f]=value;markDirty();refreshStage();
  if(['review','q','chapter'].includes(f)){const bar=$('.learning-bar');if(bar&&f==='q')bar.innerHTML=`<span class="learning-index">${s.q===null?'↗':String(s.q+1).padStart(2,'0')}</span><div class="learning-text">${s.q===null?'El recorrido':esc(QUESTIONS[s.q].text)}</div>`;}
 });
 $('#app').addEventListener('change',async e=>{
  if(e.target.id!=='media-file')return;const f=e.target.files?.[0];if(!f)return;
  if(!['image/png','image/jpeg','image/webp'].includes(f.type)||f.size>4e6){toast('Usa PNG, JPG o WebP de menos de 4 MB.');return;}
  const id=current;const src=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(f);});
  const target=draft.slides.find(s=>s.id===id);if(!target)return;remember();target.media={src,caption:'',alt:'',credit:'',rights:'pending'};markDirty();render();toast('Imagen incorporada. Completa procedencia y permiso para mostrarla.');
 });
 $('#import-file').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{if(f.size>40e6)throw Error('El archivo supera 40 MB.');const p=JSON.parse(await f.text());if(p.format!=='jerez-presentation'||p.schemaVersion!==1)throw Error('No es una copia compatible del proyecto.');validateDeck(p.draft);validateDeck(p.saved);if(!p.notes||typeof p.notes!=='object'||Array.isArray(p.notes)||!Object.values(p.notes).every(x=>typeof x==='string'))throw Error('Notas inválidas.');remember();draft=clone(p.draft);saved=cleanDeck(p.saved);notes=clone(p.notes);dirty=!!p.dirty;current=draft.slides[0].id;mode='prepare';persist();render();toast('Proyecto importado con sus recursos. Puedes deshacer la importación.');}catch(err){toast('No se ha importado: '+err.message);}e.target.value='';});
 document.addEventListener('keydown',e=>{if($('#dialog').open||e.target.matches('input,textarea,select,[contenteditable]')||e.metaKey||e.ctrlKey||e.altKey)return;if(e.key==='ArrowRight'){e.preventDefault();navigate(1);}if(e.key==='ArrowLeft'){e.preventDefault();navigate(-1);}if(e.code==='Space'){e.preventDefault();if(currentSlide().layout==='decision'&&!revealed[current]){revealed[current]=true;refreshStage();}else navigate(1);}if(e.key==='Home'){e.preventDefault();current=deck().slides[0].id;revealed[current]=false;render();}if(e.key==='End'){e.preventDefault();current=deck().slides.at(-1).id;revealed[current]=false;render();}if(e.key.toLowerCase()==='f')action('fullscreen');});
 window.addEventListener('beforeunload',()=>{if(!BOOT.readOnly)persist();});
 function stopOrbs(){orbFrames.forEach(cancelAnimationFrame);orbFrames=[];}
 function startOrbs(){document.querySelectorAll('.orb-canvas').forEach(canvas=>paintOrb(canvas));}
 function paintOrb(canvas){
  const ctx=canvas.getContext('2d');if(!ctx)return;const size=650;canvas.width=size;canvas.height=size;
  const kind=canvas.dataset.voice;
  const colors=kind==='isquemica'?['#cad3db','#779c9c','#b5b0b8','#ded6c8']:kind==='paliativa'?['#dbcdc3','#b4b59d','#bf9f96','#d8c1b2']:kind==='persona'?['#dfc5b5','#c5b597','#d3aa99','#9bb29f']:['#b5cdb6','#74a999','#d8c5b7','#d9aaa2'];
  const started=performance.now(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function draw(now){
   const t=motion&&!reduced?Math.min((now-started)/1200,6):1;
   ctx.clearRect(0,0,size,size);ctx.save();ctx.translate(325,325);ctx.rotate(-.25);
   const glow=ctx.createRadialGradient(0,10,80,0,0,295);glow.addColorStop(0,colors[2]+'88');glow.addColorStop(.55,colors[0]+'44');glow.addColorStop(1,colors[0]+'00');ctx.fillStyle=glow;ctx.fillRect(-325,-325,650,650);
   for(let layer=0;layer<100;layer++){
    const r=238-layer*1.6;ctx.beginPath();
    for(let k=0;k<=120;k++){const a=k/120*Math.PI*2;const wobble=Math.sin(a*3+t*.12)*13+Math.cos(a*2-t*.09)*12+Math.sin(a*5+layer*.019)*4;const radius=r+wobble;const x=Math.cos(a)*radius*(.87+layer*.0007),y=Math.sin(a)*radius*1.04;const twist=layer*.009;const xx=x*Math.cos(twist)-y*Math.sin(twist),yy=x*Math.sin(twist)+y*Math.cos(twist);if(k===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}
    ctx.closePath();const gradient=ctx.createLinearGradient(-220,-210,220,200);gradient.addColorStop(0,colors[0]);gradient.addColorStop(.38,colors[1]);gradient.addColorStop(.65,colors[2]);gradient.addColorStop(1,colors[3]);ctx.globalAlpha=.035;ctx.fillStyle=gradient;ctx.fill();ctx.globalAlpha=.15;ctx.lineWidth=.7;ctx.strokeStyle=gradient;ctx.stroke();
   }
   const light=ctx.createRadialGradient(-80,-90,10,-40,-50,220);light.addColorStop(0,'#fffefcdd');light.addColorStop(.5,'#fffdf64a');light.addColorStop(1,'#fffefc00');ctx.globalAlpha=.6;ctx.fillStyle=light;ctx.fillRect(-300,-300,600,600);ctx.restore();ctx.globalAlpha=1;
   // Deterministic fine grain gives the conceptual entity a material surface.
   ctx.fillStyle='#314e3d';ctx.globalAlpha=.055;let seed=173;
   for(let i=0;i<7000;i++){seed=(seed*16807)%2147483647;const x=seed%650;seed=(seed*16807)%2147483647;const y=seed%650;if((x-325)**2+(y-325)**2<65000)ctx.fillRect(x,y,.7,.7);}
   ctx.globalAlpha=1;
   if(motion&&!reduced&&now-started<7200&&!document.hidden)orbFrames.push(requestAnimationFrame(draw));
  }
  draw(performance.now());
 }
 // Expose only a narrow read-only diagnostic surface for local verification.
 window.JerezPresentation={get mode(){return mode;},get slideId(){return current;},get sceneCount(){return deck().slides.length;},validateDeck};
 render();
 if(storageError)toast(storageError);
})();

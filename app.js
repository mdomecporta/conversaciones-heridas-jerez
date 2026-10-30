'use strict';
// The presentation uses the procedural wound throughout; explicit study overrides remain available.
globalThis.ENTITY_RENDERER??='liquid';
globalThis.ENTITY_VARIANT??=3;
globalThis.ENTITY_INK??=1;
(() => {
 const $ = q => document.querySelector(q);
 const clone = x => JSON.parse(JSON.stringify(x));
 const esc = x => String(x ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const KEY='jerez-conversations-v6';
 const layouts={cover:'Apertura',conversation:'Conversación',three:'Tres situaciones',map:'Entidad y esquema',comparison:'Contrapunto',path:'Secuencia',measure:'Observación',timeline:'Seguimiento',decision:'Decisión con revelado',contrast:'Evitar / hacer',zones:'Zonas de limpieza',outcomes:'Resultados',questions:'Cinco preguntas',closing:'Cierre',institutional:'Institucional',intro:'Introducción'};
 const voiceNames={principal:'La herida · compañera de conversación'};
 const cleanDeck = deck => ({...clone(deck),slides:deck.slides.map(s=>{const {notes,...publicSlide}=clone(s);return publicSlide;})});
 let storageError='', stored=null,legacy=null;
 if(!BOOT.readOnly){try{stored=JSON.parse(localStorage.getItem(KEY)||'null');legacy=JSON.parse(localStorage.getItem('jerez-conversations-v5')||localStorage.getItem('jerez-conversations-v4')||localStorage.getItem('jerez-conversations-v3')||localStorage.getItem('jerez-conversations-v2')||localStorage.getItem('jerez-conversations-v1a')||'null');}catch{storageError='No se pudo recuperar el guardado local.';}}
 // Reattach shipped images without storing two copies of every bitmap in localStorage.
 const shipped=INITIAL_DECK.resourceCatalog||{};
 function hydrateResources(d){
  const oldCatalog=d.resourceCatalog;
  d.resourceCatalog=Object.fromEntries(Object.entries({...shipped,...oldCatalog}).map(([id,a])=>[id,{...a,src:a.src||shipped[id]?.src}]));
  if(!oldCatalog)for(const s of d.slides){const base=INITIAL_DECK.slides.find(x=>x.id===s.id);if(s.resourceIds===undefined&&base?.resourceIds)s.resourceIds=[...base.resourceIds];}
  return d;
 }
 const storageDeck=d=>({...d,resourceCatalog:Object.fromEntries(Object.entries(d.resourceCatalog||{}).map(([id,a])=>{if(shipped[id]?.src===a.src){const {src,...metadata}=a;return [id,metadata];}return [id,a];}))});
 let draft=hydrateResources(stored?.draft || clone(BOOT.deck||INITIAL_DECK));
 let saved=hydrateResources(stored?.saved || cleanDeck(draft));
 let notes=stored?.notes || Object.fromEntries(draft.slides.map(s=>[s.id,s.notes||'']));
 draft.slides.forEach(s=>delete s.notes);
 // A new edition of the thread replaces steps and habits in stored drafts; the previous state stays as a local backup.
 const upgraded=!!stored&&stored.draft?.edition!==INITIAL_DECK.edition;
 if(upgraded){try{localStorage.setItem(KEY+'-anterior',JSON.stringify(stored));}catch{}for(const d of [draft,saved]){d.edition=INITIAL_DECK.edition;for(const s of d.slides){const base=INITIAL_DECK.slides.find(x=>x.id===s.id)?.study;if(s.study&&base)Object.assign(s.study,{steps:clone(base.steps),habit:base.habit,ask:base.ask});}
  INITIAL_DECK.slides.forEach((base,i)=>{if(base.intro&&!d.slides.some(s=>s.id===base.id)){const {notes,...publicSlide}=clone(base);d.slides.splice(Math.min(i,d.slides.length),0,publicSlide);}});}}
 let mode=BOOT.readOnly?'review':BOOT.mode, current=(draft.slides.find(s=>s.id==='intro-tema')||draft.slides.find(s=>s.id==='apertura'))?.id||draft.slides[0].id, tab='content', inspectorOpen=false, dirty=!!stored?.dirty;
 let choices={}, revealed={}, manualTurns={}, conversations={}, resourceStates={}, steps={}, thread=null, scriptOn={review:true,present:false}, mediaView={}, freshMedia=false, undo=[], pendingTimer=null, lastSave=stored?.lastSave||null, motion=true, freshTurn=false, chromeTimer=null;
 const reducedMotion=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch{return false;}};
 const deck=()=>mode==='prepare'?draft:saved;
 const currentSlide=()=>deck().slides.find(s=>s.id===current)||deck().slides[0];
 const index=()=>deck().slides.findIndex(s=>s.id===currentSlide().id);
 const visualResources=window.createWoundResourceViewer({getDeck:deck,esc,showDialog,motionAllowed:()=>motion&&!reducedMotion()});
 function persist(){if(BOOT.readOnly)return;try{lastSave=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify({draft:storageDeck(draft),saved:storageDeck(saved),notes,dirty,lastSave}));storageError='';}catch{storageError='No se ha podido guardar. Exporta una copia para conservar el trabajo.';toast(storageError);}updateStatus();}
 function updateStatus(){const el=$('#saved-status');if(el)el.textContent=storageError || (dirty?'Borrador guardado · cambios pendientes':'Versión guardada');}
 function markDirty(){dirty=true;clearTimeout(pendingTimer);pendingTimer=setTimeout(persist,250);updateStatus();}
 function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('visible'),3800);}
 function remember(){undo.push({draft:clone(draft),saved:clone(saved),notes:clone(notes),dirty,current});if(undo.length>25)undo.shift();}
 const orb = (voice='principal',state='idle',lean=1) => `<div class="orb-zone" aria-hidden="true" data-voice="${esc(voice)}" data-state="${esc(state)}" data-lean="${lean}"></div>`;
 // The cast of a scene: the wound that leads it, an optional guest wound and the person.
 // The guest buds from the lead the first time she speaks; whoever speaks comes forward.
 function castOf(s){
  const voices=new Set([s.voice,...s.study.turns.map(t=>t.voice)]);if(voices.has('dual'))['principal','isquemica'].forEach(v=>voices.add(v));
  const wounds=['principal','isquemica','paliativa'].filter(v=>voices.has(v));
  const lead=wounds.includes('principal')?'principal':wounds[0]||'principal';
  return {lead,guest:wounds.find(v=>v!==lead)||null,person:voices.has('persona')};
 }
 function castRoles(s,history){
  const c=castOf(s),t=history.length?s.study.turns[history.at(-1)]:null,who=t?.voice==='dual'?'dual':t?.voice||c.lead;
  const met=history.some(i=>[c.guest,'dual'].includes(s.study.turns[i].voice)),heard=history.some(i=>s.study.turns[i].voice==='persona');
  if(who==='dual')return {lead:'compare-a',guest:'compare-b',person:heard?'aside':'hidden',speaker:'all'};
  if(who==='persona')return {lead:'recede',guest:met?'recede-b':'hidden',person:'front',speaker:-1};
  if(c.guest&&who===c.guest)return {lead:'back-a',guest:'front-b',person:heard?'aside':'hidden',speaker:1};
  return {lead:met?'front-a':'solo',guest:met?'back-b':'hidden',person:heard?'aside':'hidden',speaker:0};
 }
 // With the generated membrane both wounds are one body: the guest really buds from the lead
 // (data-bud) and whoever speaks grows a little (data-focus); the illustration keeps two figures.
 const budding=()=>!['art','liquid'].includes(globalThis.ENTITY_RENDERER);
 function castView(s,history,fresh,compareFocus,showing){
  const c=castOf(s),now=castRoles(s,history),before=castRoles(s,history.slice(0,-1)),t=history.length?s.study.turns[history.at(-1)]:null;
  if(c.guest&&budding())return budView(s,c,now,before,t,fresh,compareFocus,showing);
  const move=k=>fresh&&before[k]!==now[k]?` data-from="${before[k]}"`:'';
  const state=(v,role)=>showing&&v===c.lead?'showing':t&&((now.speaker===0&&v===c.lead)||(now.speaker===1&&v===c.guest)||now.speaker==='all')?t.state:/^(back|recede|compare)/.test(role)||(t&&role!=='solo')?'listening':'idle';
  const lean=role=>/-a$|recede$/.test(role)&&now.speaker!==0?-1:1;
  const slot=(v,role,i)=>`<div class="cast-slot role-${role}"${move(i?'guest':'lead')} data-who="${i?'guest':'lead'}">${orb(v,state(v,role),lean(role))}<span class="cast-name">${esc(speaker(v))}</span></div>`;
  return `<div class="cast ${now.speaker==='all'?'is-compare':''} ${compareFocus?'focus-'+compareFocus:''}" data-speaker="${now.speaker}">${now.speaker==='all'?'<i class="cast-link" aria-hidden="true"></i>':''}${slot(c.lead,now.lead,0)}${c.guest?slot(c.guest,now.guest,1):''}${c.person?`<div class="persona-aura role-${now.person}"${move('person')} aria-hidden="true"><i></i><i></i><i></i><b></b></div>`:''}</div>`;
 }
 function budView(s,c,now,before,t,fresh,compareFocus,showing){
  const apart=now.guest!=='hidden',role=now.lead==='recede'?'recede':apart?'pair':'solo',was=before.lead==='recede'?'recede':before.guest!=='hidden'?'pair':'solo';
  const focus=compareFocus==='a'?-1:compareFocus==='b'?1:now.speaker===1?1:now.speaker===0&&apart?-1:0;
  const voice=now.speaker===1?c.guest:c.lead,state=showing?'showing':t&&now.speaker!==-1?t.state:t?'listening':'idle';
  const from=fresh&&was!==role&&role!=='pair'&&was!=='pair'?` data-from="${was}"`:'';
  const name=(v,k)=>`<span class="cast-name name-${k}">${esc(speaker(v))}</span>`;
  return `<div class="cast is-budded ${now.speaker==='all'?'is-compare':''}" data-speaker="${now.speaker}"><div class="cast-slot role-${role}"${from} data-who="pair"><div class="orb-zone" aria-hidden="true" data-voice="${esc(c.lead)}" data-guest="${esc(c.guest)}" data-scene="${esc(s.id)}" data-bud="${apart?1:0}" data-focus="${focus}" data-state="${esc(state)}" data-lean="${now.speaker===1?-1:1}"></div>${apart?name(c.lead,'a')+name(c.guest,'b'):''}</div>${c.person?`<div class="persona-aura role-${now.person}"${fresh&&before.person!==now.person?` data-from="${before.person}"`:''} aria-hidden="true"><i></i><i></i><i></i><b></b></div>`:''}</div>`;
 }
 const speakerIndex=(s,history)=>{const w=castRoles(s,history).speaker;return budding()&&w===1?0:w;};
 // Pictures and videos take the stage: they are born from the bed and the wound watches from the corner.
 // Videos are files next to the HTML (asset.video); the embedded image is their poster.
 function sceneAssets(s){const cat=deck().resourceCatalog||{};return (s.resourceIds||[]).filter(id=>cat[id]?.rights==='authorized').map(id=>({id,...cat[id]}));}
 function stageMedia(s){
  const m=mediaView[s.id],list=sceneAssets(s),a=m&&list[m.n];if(!a)return '';
  const pts=a.walkthrough?.steps||[],h=pts[m.hot];
  const media=a.video?`<video class="media-video" src="${esc(a.video)}" poster="${esc(a.src)}" muted playsinline loop autoplay preload="metadata" aria-label="${esc(a.alt)}"></video>`:`<img src="${esc(a.src)}" alt="${esc(a.alt)}">`;
  return `<section class="stage-media ${freshMedia&&motion&&!reducedMotion()?'is-born':''}" aria-label="${esc(a.title)}"><div class="media-frame"><div class="media-picture">${media}${pts.map((p,i)=>p.x==null?'':`<button class="media-hot ${i===m.hot?'on':''}" data-hot="${i}" style="left:${Number(p.x)}%;top:${Number(p.y)}%" aria-label="${esc(p.title)}">${i+1}</button>`).join('')}</div>${h?`<div class="media-note"><span>${pad(m.hot+1)} / ${pad(pts.length)}</span><strong>${esc(h.title)}</strong><p>${esc(h.text)}</p></div>`:''}</div><div class="media-meta"><div class="media-title"><strong>${esc(a.title)}</strong><small>${esc(a.label)}</small></div>${list.length>1?`<div class="media-thumbs">${list.map((x,i)=>`<button data-media-n="${i}" class="${i===m.n?'on':''}" aria-label="${esc(x.title)}"><img src="${esc(x.src)}" alt=""></button>`).join('')}</div>`:''}${a.video?'<button data-action="media-play">Pausa / reproducir</button>':''}<button data-action="scene-resources">Ampliar ↗</button><button class="media-close" data-action="media-close" aria-label="Cerrar">×</button></div></section>`;
 }
 const pad = n => String(n).padStart(2,'0');
 // Words are revealed one by one; --i drives the stagger in CSS.
 const words = (text,start=0) => String(text??'').split(/\s+/).filter(Boolean).map((w,i)=>`<span class="w" style="--i:${i+start}">${esc(w)}</span>`).join(' ');
 const wordCount = text => String(text??'').split(/\s+/).filter(Boolean).length;
 const speech = text => `<p class="speech" data-words="${wordCount(text)}">${words(text)}</p>`;
 const route = s => `<div class="route" aria-hidden="true">${QUESTIONS.map((q,i)=>`<span class="${s.q===i?'on':''}" style="--c:var(--q${i})"><i></i>${s.q===i?esc(q.short):''}</span>`).join('')}</div>`;
 function questionRail(s){const moves=deck().movements;if(moves)return `<nav class="question-rail" aria-label="Los cuatro momentos del recorrido">${moves.map((m,i)=>`<button data-question="${i}" class="question-step ${s.mov===i?'active':''}" ${s.mov===i?'aria-current="step"':''}><span class="step-number">${['I','II','III','IV','V'][i]||i+1}</span><span>${esc(m.short)}<small>${esc(m.sub||'')}</small></span></button>`).join('')}</nav><div class="question-context">${s.q===null||s.q===undefined?'Una conversación, cuatro momentos':'Una conversación, cuatro momentos'}</div>`;return `<nav class="question-rail" aria-label="Las cinco preguntas del recorrido">${QUESTIONS.map((q,i)=>`<button data-question="${i}" class="question-step ${s.q===i?'active':''}" ${s.q===i?'aria-current="step"':''}><span class="step-number">${String(i+1).padStart(2,'0')}</span><span>${esc(q.short)}<small>${['Causa y factores','Posibilidad de cierre','Beneficio y seguridad','Resultados relevantes','Seguimiento y consulta'][i]}</small></span></button>`).join('')}</nav><div class="question-context">${s.q===null?'Cinco preguntas para construir y revisar el plan':esc(QUESTIONS[s.q].text)}</div>`;}
 const speaker = voice => ({principal:'La herida',isquemica:'Otra herida · contrapunto vascular',paliativa:'Otra herida · objetivos de alivio',persona:'La persona · voz recreada',dual:'Las dos heridas'}[voice]||'La herida');
 const resourceKey = () => current+':'+(conversations[current]?.at(-1)??'opening');
 const resourceState = () => resourceStates[resourceKey()]||{index:0,reveal:false};
 function woundDiagram(selected=0){
  return `<svg class="wound-diagram" viewBox="0 0 420 155" role="img" aria-label="Esquema conceptual de lecho, borde y piel; no es una fotografía ni permite diagnóstico"><rect x="4" y="4" width="412" height="147" rx="25" class="zone-surround ${selected===3?'zone-selected':''}"/><ellipse cx="210" cy="77" rx="157" ry="59" class="zone-skin ${selected===2?'zone-selected':''}"/><path d="M112 63C130 20 193 23 225 32C268 20 327 54 304 95C279 136 205 113 181 124C128 129 95 99 112 63Z" class="zone-edge ${selected===1?'zone-selected':''}"/><path d="M130 67C147 42 193 42 224 48C258 37 297 61 282 88C261 111 204 97 180 108C147 112 117 90 130 67Z" class="zone-bed ${selected===0?'zone-selected':''}"/><path d="M155 75Q181 60 201 72T255 75M152 87Q181 76 204 88T260 85" fill="none" stroke="currentColor" opacity=".22" stroke-width="2"/></svg>`;
 }
 function renderResource(turn,s){
  const r=resourceState(),idx=Math.min(r.index,Math.max(0,turn.items.length-1)),item=turn.items[idx];
  if(!item)return '';
  const tabs=`<div class="resource-tabs" aria-label="Explorar ${esc(turn.resourceTitle)}">${turn.items.map((p,i)=>`<button data-resource-index="${i}" aria-pressed="${i===idx}" class="${i===idx?'selected':''}"><span>${pad(i+1)}</span>${esc(p[0])}</button>`).join('')}</div>`;
  // The details the wound has told so far stay in the chat, the newest highlighted; the rest wait as chips.
  const seen=[...new Set([...(r.seen||[]),idx])].sort((a,b)=>a-b),rest=turn.items.map((_,i)=>i).filter(i=>!seen.includes(i)),label=turn.kind==='memory'?'Momento':turn.kind==='path'?'Paso':'';
  const thread=`<ol class="resource-thread thread-${esc(turn.kind)}">${seen.map(i=>`<li class="${i===idx?'now':''}">${label?`<span>${label} ${i+1} / ${turn.items.length}</span>`:''}<strong>${esc(turn.items[i][0])}</strong><p>${esc(turn.items[i][1])}</p></li>`).join('')}</ol>${rest.length&&mode==='prepare'?`<div class="resource-more" aria-label="Más detalles de ${esc(turn.resourceTitle)}">${rest.map(i=>`<button data-resource-index="${i}">+ ${esc(turn.items[i][0])}</button>`).join('')}</div>`:''}${mode!=='prepare'&&!!manualTurns[s.id]&&turn.items.length>1?`<details class="resource-choices"><summary>Ver otros detalles</summary>${tabs}</details>`:''}`;
  let body='';
  if(turn.kind==='decision'&&mode!=='prepare'&&!manualTurns[s.id])body=`<p class="resource-prompt">${esc(item[0])}</p>${r.reveal?`<div class="resource-detail reasoning"><strong>Razonamiento clínico · ${esc(item[0])}</strong><p>${esc(item[1])}</p></div>`:''}`;
  else if(turn.kind==='decision')body=`<p class="resource-prompt">¿Por dónde empezarías? Elige una posibilidad y abre su razonamiento.</p>${tabs}<button class="reason-toggle" data-action="resource-reveal" aria-expanded="${r.reveal}">${r.reveal?'Ocultar razonamiento':'Abrir razonamiento'}</button>${r.reveal?`<div class="resource-detail reasoning" role="status"><strong>Razonamiento clínico · ${esc(item[0])}</strong><p>${esc(item[1])}</p></div>`:''}`;
  else if(turn.kind==='photo'&&mode!=='prepare'&&!manualTurns[s.id])body=thread;
  else if(turn.kind==='photo')body=`<div class="image-explorer">${woundDiagram(turn.items.some(p=>/lecho/i.test(p[0]))?idx:-1)}<span>Esquema conceptual · no es fotografía clínica</span></div>${thread}${visualResources.has(s)?'<button class="photo-link" data-action="scene-resources">Explorar imágenes de esta escena ↗</button>':''}${s.media?.rights==='authorized'?`<button class="photo-open" data-action="photo-open"><img src="${esc(s.media.src)}" alt="${esc(s.media.alt||s.media.caption||'Imagen autorizada de la escena')}"><span>Ver fotografía o imagen aportada ↗</span></button>`:visualResources.has(s)?'':'<p class="photo-unavailable">Fotografía clínica sin incorporar. El esquema permite revisar la dinámica.</p>'}`;
  else if(turn.kind==='compare')body=`${tabs}<div class="comparison-resource"><div><small>Seleccionado</small><strong>${esc(item[0])}</strong><p>${esc(item[1])}</p></div><div><small>Contrastar con</small><strong>${esc(turn.items[(idx+1)%turn.items.length][0])}</strong><p>${esc(turn.items[(idx+1)%turn.items.length][1])}</p></div></div>`;
  else body=thread;
  return `<section class="conversation-resource resource-${esc(turn.kind)}" aria-label="${esc(turn.resourceTitle)}"><div class="resource-heading"><span>${({memory:'Historia de cuidados',decision:'Pausa para discutir',person:'Escuchar la experiencia',photo:'Portal de imagen',compare:'Contrastar historias',path:'Recorrer el plan',outcomes:'Explorar resultados',layers:'Abrir capas de información',facts:'Datos preparados'})[turn.kind]||'Recurso de la conversación'}</span><strong>${esc(turn.resourceTitle)}</strong></div>${body}<small>Caso y recursos docentes preparados · no son datos de una persona real</small></section>`;
 }
 // Before the scenes: topic, map, the path of every scene and the wound. Each step reveals one more piece.
 function renderIntro(s){const it=s.intro,k=stepView(s).k,on=i=>k>i?'is-on':'',dots=`<div class="step-dots">${it.steps.map((_,i)=>`<i class="${i<k?'done':''} ${i===k-1?'now':''}"></i>`).join('')}</div>`;
  if(it.kind==='tema')return `<div class="intro intro-tema">${dots}<p class="intro-kicker">IV Jornadas Comisión Heridas Jerez · Mesa redonda</p><h1>${esc(s.title)}</h1><p class="intro-lead ${on(0)}">${esc(s.message)}</p><p class="intro-note ${on(1)}">Una costumbre. Una historia. Una pregunta para la próxima cura.</p></div>`;
  if(it.kind==='mapa')return `<div class="intro intro-mapa">${dots}<h2>${esc(s.title)}</h2><p class="intro-sub">${esc(s.message)}</p><ol>${(deck().movements||[]).map((m,i)=>`<li class="${on(i)} ${k===i+1?'is-now':''}" style="--c:var(--q${i})"><span>${['I','II','III','IV','V'][i]}</span><div><strong>${esc(m.short)}</strong><small>${esc(m.sub||'')}</small></div><em>↻ ${esc(it.examples?.[i]||'')}</em></li>`).join('')}</ol></div>`;
  if(it.kind==='dinamica'){const x=it.example||{};return `<div class="intro intro-dinamica">${dots}<h2>${esc(s.title)}</h2><p class="intro-sub">${esc(s.message)}</p><div class="intro-flow ${k>=4?'is-crossed':''}"><div class="flow-habit ${on(0)}"><small>1 · Lo habitual</small><p>${esc(x.habit)}</p></div><div class="flow-wound ${on(1)}"><small>2 · La herida lo cuenta</small><p>«${esc(x.wound)}»</p></div><div class="flow-evidence ${on(2)}"><small>3 · La evidencia</small><p>${esc(x.evidence)}</p><span>${esc(x.source)}</span></div><div class="flow-ask ${on(3)}"><small>4 · La pregunta</small><p>${esc(x.ask)}</p></div></div></div>`;}
  const lines=it.lines||[];
  return `<div class="intro intro-herida">${dots}<section><h2>${esc(s.title)}</h2><p class="intro-sub">${esc(s.message)}</p><ol class="intro-legend">${it.steps.slice(0,4).map(([,cue],i)=>`<li class="${on(i)}">${esc(cue)}</li>`).join('')}</ol></section><aside class="intro-chat-panel"><div class="intro-entity">${orb('principal',k?'responding':'idle')}</div><div class="intro-chat" aria-live="polite">${lines.slice(0,k).map((l,i)=>`<p class="${i===k-1?'now':''}"><small>La herida</small>${i===k-1?words(l):esc(l)}</p>`).join('')}</div></aside></div>`;}
 // The closing wall: every habit questioned along the route, crossed out together.
 function wall(crossed){return `<div class="habit-wall ${crossed?'is-crossed':''}">${deck().slides.filter(x=>x.study?.habit&&!['cinco-preguntas','cierre'].includes(x.id)).map((x,i)=>`<span style="--i:${i}"><small>${pad(x.study.number)}</small>${esc(x.study.habit)}</span>`).join('')}</div>`;}
 // Content, rather than slide number, determines how much room the conversation needs.
 function sceneComposition(s,g,active){
  if(mode==='prepare')return 'prepare';
  if(g.lastHas('enlace'))return 'closing';
  if(mediaView[s.id]&&sceneAssets(s)[mediaView[s.id].n])return 'media';
  if(g.lastHas('practica'))return 'question';
  if(g.focus.size||s.id==='cinco-preguntas'&&g.seen.size)return 'concept';
  if(active?.items?.length)return active.kind==='decision'||active.kind==='compare'?'decision':'resource';
  return 'dialogue';
 }
 function sceneChapter(s){const m=deck().movements?.[s.mov];if(!m)return '';
  return `<div class="scene-chapter" aria-label="Etapa ${s.mov+1} de 4: ${esc(m.short)}"><span>${['I','II','III','IV'][s.mov]} <b>${esc(m.short)}</b></span><div aria-hidden="true">${deck().movements.map((_,i)=>`<i class="${i<s.mov?'done':i===s.mov?'current':''}"></i>`).join('')}</div><small>${esc(m.sub)}</small></div>`;
 }
 // The thread: María del Mar's lines, which she says aloud to trigger each step, and the wound's replies.
 // Three turns stay in view; older ones fade. In a fresh step her line arrives first and the wound thinks before answering.
 function hilo(s,history,line,fresh){const st=s.study,e=[{who:'herida',name:speaker(s.voice),text:st.opening}];
  history.forEach(n=>{const t=st.turns[n];e.push({who:'ponente',text:t.label},{who:'herida',name:speaker(t.voice),text:t.reply});});
  if(line)e.push(line.voice==='ponente'?{who:'ponente',tag:line.label,text:line.text,bridge:true}:{who:'herida',name:speaker(s.voice),tag:line.habit?'La pregunta':'',text:line.text});
  const shown=e.slice(-3),asked=fresh&&history.length&&!line;
  return `<ol class="hilo">${shown.map((x,i)=>{const now=i===shown.length-1,arriving=asked&&i>=shown.length-2;
   return `${arriving&&now?'<li class="hilo-piensa" aria-hidden="true"><i></i><i></i><i></i></li>':''}<li class="hilo-turn is-${x.who} ${now?'is-now':'is-past'} ${i<shown.length-2?'is-older':''} ${x.bridge?'is-bridge':''} ${arriving?'is-arriving':''}"><small>${esc(x.who==='ponente'?'María del Mar':x.name)}${x.tag?' · '+esc(x.tag):''}</small><p>${now&&x.who==='herida'?words(x.text):esc(x.text)}</p></li>`;}).join('')}</ol>`;}
 function renderLesson(s){
  const st=s.study,history=conversations[s.id]||[],active=history.length?st.turns[history.at(-1)]:null;
  const activeVoice=active?.voice||s.voice, fresh=freshTurn&&active&&motion&&!reducedMotion();
  const g=stepView(s),line=woundLine(s),resolving=!manualTurns[s.id]&&mode!=='prepare'&&(g.lastHas('practica')||g.lastHas('enlace'));
  const composition=sceneComposition(s,g,active);
  const diagram=g.wall&&!g.seen.size?wall(g.practice):`<div class="clinical-concepts ${s.points.length>3?'compact':''} ${g.guided?'guided':''}">${s.points.map((p,i)=>`<div class="${g.focus.has(i)?'is-focus':g.seen.has(i)?'is-seen':g.guided?'is-pending':''}"><span>${pad(i+1)}</span><div><strong>${esc(p[0])}</strong><p>${esc(p[1])}</p></div></div>`).join('')}</div>`;
  // The habit opens the scene with its tag; a line leads to the question. At the close, the tag turns into what we take away.
  const habit=st.habit?`<div class="habit-card conversation-focus ${!g.k&&!history.length?'is-opening':''}"><div class="habit-was"><span class="habit-tag">Por costumbre</span><p>${esc(st.habit)}</p></div><div class="habit-ask"><span>Nos preguntamos</span><p>${esc(st.ask||'')}</p></div></div>`:'';
  const previous=history.length>1?st.turns[history.at(-2)]:null;
  const past=previous?`<details class="previous-exchange"><summary>Antes · ${esc(previous.label)}</summary><p><strong>${esc(speaker(previous.voice))}:</strong> ${esc(previous.reply)}</p></details>`:'';
  return `<div class="clinical-layout ${resolving?'is-resolving':''} ${s.id==='cinco-preguntas'?'is-synthesis':''}" data-composition="${composition}" data-movement="${s.mov??0}">${sceneChapter(s)}<section class="clinical-explanation" aria-label="Explicación clínica"><div class="lesson-label"><span>Escena ${pad(st.number)}</span><span>${esc(st.label)}</span>${route(s)}</div>${g.guided?`<div class="step-dots" aria-label="Paso ${g.k} de ${g.n}">${Array.from({length:g.n},(_,i)=>`<i class="${i<g.k?'done':''} ${i===g.k-1?'now':''}"></i>`).join('')}</div>`:''}<h2>${esc(s.title)}</h2>${s.id==='apertura'?`<p class="edition-author">${esc(deck().author)} <span>EPA-HCC · Jerez · 19 noviembre 2026</span></p>`:''}<p class="clinical-paragraph">${esc(st.explanation)}</p>${habit}${diagram}${composition==='closing'?`<div class="scene-learning"><span class="habit-tag is-turning"${st.habit?'':' data-plain'}><b aria-hidden="true">Por costumbre</b><b>Nos llevamos</b></span><p>${esc(s.takeaway||st.propose||s.message)}</p></div>`:''}${st.habit?'':st.avoid?`<div class="practice-pair ${g.practice?'is-open':''} ${g.lastHas('practica')?'is-focus':''}"><div class="avoid"><span>Qué evitamos</span><p>${esc(st.avoid)}</p></div><div class="propose"><span>Qué proponemos</span><p>${esc(st.propose||s.takeaway||'')}</p></div></div>`:`<div class="clinical-takeaway"><span>Para la práctica</span><p>${esc(s.takeaway||s.message)}</p></div>`}<div class="clinical-foundation"><span class="evidence-kind">${esc(st.evidenceType||'Fundamento del concepto')}</span><button class="inline-source" data-action="sources">${esc(st.sourceLabel||st.sourceNote)} <span aria-hidden="true">↗</span></button>${st.limitation?`<p class="clinical-limit"><strong>Alcance</strong> ${esc(st.limitation)}</p>`:''}</div><button class="clinical-bridge ${g.bridge?'is-on':''}" data-action="step-forward"><span>Seguimos conversando</span>${esc(st.bridge)} <b aria-hidden="true">→</b></button></section><aside class="conversation-panel stage-v2 ${active?'has-response':''} ${fresh?'fresh':''} ${mediaView[s.id]?'has-media':''}" data-speaker="${esc(activeVoice)}" data-words="${active?0:wordCount(st.opening)}" style="--n:${active?wordCount(active.reply):wordCount(st.opening)}" aria-label="Conversación con la herida"><header class="conversation-header"><div><span class="presence-dot" aria-hidden="true"></span><strong>${esc(speaker(activeVoice))}</strong><small>${esc(st.caseLabel)}</small></div>${visualResources.chip(s)}<span class="presence-status">En calma</span><button class="restart-conversation" data-action="reset-conversation" aria-label="Reiniciar esta conversación">↺</button></header><div class="stage-core"><div class="entity-stage entity-${esc(active?.state||'idle')}"><div class="presence-rings" aria-hidden="true"><i></i><i></i><i></i></div>${castView(s,history,fresh,active?.kind==='compare'&&activeVoice==='dual'?['a','b','both'][resourceState().index]||'both':'',!!mediaView[s.id])}${mode==='prepare'?`<div class="orbit-chips" aria-label="Preguntas preparadas">${st.turns.map((t,i)=>`<button data-turn-event="${i}" class="orbit-chip pos-${i} ${history.at(-1)===i?'active':''}" aria-pressed="${history.at(-1)===i}"><span>${esc(t.label)}</span></button>`).join('')}</div>`:!g.k&&!active?`<div class="main-question"><button data-action="step-forward">${esc(st.turns[Number((st.steps[0][0].match(/\bt(\d+)/)||[])[1]||1)-1]?.label||'Empezar')} <span aria-hidden="true">→</span></button></div>`:''}</div><div class="subtitle" aria-live="polite">${hilo(s,history,line,fresh)}${!active&&!line?`<p class="stage-hint">Avanza para seguir la conversación${s.media?.rights==='authorized'?' · <button class="photo-link" data-action="photo-open">imagen aportada ↗</button>':''}</p>`:''}</div></div>${stageMedia(s)}${active&&!resolving?`<div class="portal-scroll" tabindex="0" aria-label="Recurso de la conversación">${renderResource(active,s)}</div>`:''}<footer class="conversation-foot"><div class="thread" aria-hidden="true">${history.map((n,i)=>`<i class="${i===history.length-1?'now':''}"></i>`).join('')}</div><span>Personaje e historias docentes · diálogo preparado · <i class="entity-note">${activeVoice==='persona'?'vivencia recreada':'representación conceptual'}</i></span><button data-action="expand">Ampliar</button></footer></aside></div>`;
 }
 function points(items,cls=''){return `<div class="points ${cls}">${items.map((p,i)=>`<div class="point" data-number="${String(i+1).padStart(2,'0')}"><h3>${esc(p[0])}</h3><p class="point-text">${esc(p[1])}</p></div>`).join('')}</div>`;}
 const voiceLine=s=>`<div class="voice-line"><span class="signal" aria-hidden="true"><i></i><i></i><i></i><i></i></span>${esc(voiceNames[s.voice]||'Herida')}<span>· caso docente</span></div>`;
 function renderSlide(s,pos,total,{print=false}={}){
  let layout=s.layout, body='', show=print||revealed[s.id];
  const title=`<h2>${esc(s.title)}</h2>`, lead=`<p class="lead">${esc(s.message)}</p>`;
  if(s.study){layout='lesson';body=renderLesson(s);}
  else if(layout==='intro'&&s.intro)body=renderIntro(s);
  else if(s.media && s.media.rights==='authorized'){
   body=`${title}${lead}<div class="photo-layout"><figure><img src="${esc(s.media.src)}" alt="${esc(s.media.alt||s.media.caption||'Recurso visual docente')}"><figcaption>${esc(s.media.caption)}${s.media.credit?' · '+esc(s.media.credit):''}</figcaption></figure>${points(s.points)}</div>`;
  }else if(layout==='institutional' && s.institutional){body=`<img class="institutional" src="${esc(s.institutional)}" alt="Marco institucional aportado por la organización"><div class="institutional-copy ${s.institutionalKind==='open'?'institutional-open':'institutional-close'}"><h2>${esc(s.title)}</h2><p>${esc(s.message)}</p>${s.institutionalKind==='open'?`<strong>${esc(deck().author)}</strong><p>EPA-HCC · AGS Campo de Gibraltar Este</p>`:''}</div>`;}
  else if(layout==='cover')body=`<div class="cover-grid"><div class="cover-copy"><span class="pill">Mesa 2 · ¿Es posible cicatrizar todas las heridas?</span><h1>${esc(s.title)}</h1><div class="cover-route" aria-label="Cinco preguntas del recorrido">${QUESTIONS.map((q,i)=>`<span style="--c:var(--q${i});--k:${i}"><i aria-hidden="true"></i>${esc(q.short)}</span>`).join('')}</div><div class="cover-info"><strong>${esc(deck().author)}</strong><span>EPA-HCC · AGS Campo de Gibraltar Este</span><span>19 noviembre 2026 · Jerez de la Frontera</span></div></div><div class="cover-voice">${orb(s.voice)}${speech(s.message)}</div></div>`;
  else if(layout==='three')body=`<div class="three-top"><div>${title}</div><div class="three-voice">${orb(s.voice,'exploring')}${speech(s.message)}</div></div><div class="three-cards">${s.points.map((p,i)=>`<article class="tone-${i%3}" style="--k:${i}"><span class="seed" aria-hidden="true"></span><span class="num">${pad(i+1)}</span><h3>${esc(p[0])}</h3><p>${esc(p[1])}</p></article>`).join('')}</div>`;
  else if(layout==='conversation')body=`${orb(s.voice)}${voiceLine(s)}${title}${lead}${points(s.points)}`;
  else if(layout==='comparison')body=`${title}${lead}<div class="comparison-layout">${s.points.map((p,i)=>`<div class="case">${orb(i?'isquemica':'principal')}<div><h3>${esc(p[0])}</h3><p class="point-text">${esc(p[1])}</p></div></div>`).join('')}</div>`;
  else if(layout==='map')body=`${title}${lead}<div class="map-layout">${orb(s.voice)}${points(s.points)}</div>`;
  else if(layout==='measure')body=`${title}${lead}<div class="measure-layout"><div class="measure-visual">${orb(s.voice)}</div>${points(s.points)}</div>`;
  else if(layout==='zones')body=`${title}${lead}<div class="zone-layout">${orb(s.voice)}${points(s.points)}</div>`;
  else if(layout==='decision')body=`${title}${lead}<div class="decision-grid"><div><p class="question">${esc(s.question||'¿Qué información necesitas para decidir?')}</p><div class="options">${(s.choices||['Revisar los datos','Plantear una alternativa']).map((c,i)=>`<button class="option ${choices[s.id]===i?'selected':''}" data-choice="${i}" aria-pressed="${choices[s.id]===i}"><span>${String.fromCharCode(65+i)}</span>${esc(c)}</button>`).join('')}</div>${!print?`<button class="reveal-button primary" data-action="reveal">${show?'Ocultar razonamiento':'Mostrar razonamiento'}</button>`:''}</div><div>${show?`<div class="reveal-answer"><strong>Razonamiento clínico</strong>${esc(s.answer||'Completar el razonamiento con la ponente.')}${points(s.reveal||s.points)}</div>`:`<div class="case-data">${s.points.map(p=>`<h3>${esc(p[0])}</h3><p>${esc(p[1])}</p><br>`).join('')}</div><p class="awaiting">Primero, contrastamos las propuestas.<br>Después, revisamos el razonamiento.</p>`}</div></div>`;
  else if(layout==='closing')body=`${orb(s.voice)}${title}${lead}${points(s.points)}`;
  else body=`${title}${lead}${points(s.points)}`;
  if(s.takeaway && !['cover','decision','lesson'].includes(layout))body+=`<p class="takeaway">${esc(s.takeaway)}</p>`;
  return `<article class="slide ${esc(layout)} ${layout==='institutional'?'institutional-slide':''}" data-q="${s.q??'none'}" data-movement="${s.mov??'intro'}" aria-label="Diapositiva ${pos+1}: ${esc(s.title)}"><div class="slide-head"><span>${esc(s.chapter)}</span>${s.q===null?'<span class="deck-label">Conversaciones con una herida</span>':route(s)}</div><div class="slide-body">${body}</div><footer class="slide-footer"><span>${s.refs.map(r=>esc(r)).join(' · ')}${s.refs.length?' · ':''}Síntesis docente${s.review==='validated'?'':' · revisión clínica pendiente'}</span><span>${String(pos+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</span></footer></article>`;
 }
 function render(){
  const from=Presence.rect(),previous=$('#app').dataset.slide; const s=currentSlide(),i=index(); current=s.id;if(tab==='conversation'&&!s.study)tab='content';
  const app=$('#app');app.dataset.mode=mode;app.dataset.q=s.q??'none';app.dataset.slide=s.id;app.classList[motion?'remove':'add']('motion-off');
  $('#app').innerHTML=`<header class="topbar"><div class="brand"><span class="brandmark" aria-hidden="true"></span><div>Conversaciones con una herida<small>María del Mar Candil Ramón · Jerez 2026</small></div></div>${!BOOT.readOnly?`<nav class="mode-switch" aria-label="Modo de trabajo">${[['prepare','Preparar'],['review','Revisar'],['present','Presentar']].map(([id,label])=>`<button class="${mode===id?'active':''}" data-mode="${id}" aria-pressed="${mode===id}">${label}</button>`).join('')}</nav>`:`<nav class="mode-switch" aria-label="Modo de lectura">${[['review','Revisar'],['present','Presentar']].map(([id,label])=>`<button class="${mode===id?'active':''}" data-mode="${id}" aria-pressed="${mode===id}">${label}</button>`).join('')}</nav>`}<div class="top-actions"><span class="saved-status" id="saved-status"></span>${mode==='prepare'?'<button data-action="export">Compartir / copia</button><button class="primary" data-action="save">Guardar para presentar</button>':`<button data-action="prompter" aria-pressed="${!!scriptOn[mode]}" title="Mostrar u ocultar el guion (G)">Guion</button><button data-action="presenter" title="Abrir el guion en otra ventana (V)">Ventana de ponente</button><button data-action="script">Guion completo</button><button data-action="overview">Escenas</button><button data-action="fullscreen">Pantalla completa</button>`}</div></header><div class="workspace ${mode}">${mode==='prepare'?sidebar():''}<main class="workarea">${questionRail(s)}${mode==='review'?'<div class="review-banner">Versión de trabajo · pendiente de validación clínica por la ponente. Casos docentes sintéticos.</div>':''}<div class="work-meta"><strong>${s.study?'Escena '+pad(s.study.number):'Pantalla '+pad(i+1)} <span class="muted">/ ${esc(s.chapter)}</span></strong><span class="status-badge ${s.review==='validated'?'validated':''}">${s.review==='validated'?'Revisada por la ponente':'Pendiente de revisión clínica'}</span></div><div class="stage-holder"><div class="stage-shell" id="stage">${renderSlide(s,i,deck().slides.length)}</div></div>${mode!=='prepare'&&offRoute()?`<div class="route-return"><button data-action="route-return">↩ Volver al recorrido · ${esc(routeLabel())} <kbd>→</kbd></button><button data-action="route-here">Seguir desde aquí</button></div>`:''}${mode==='prepare'||scriptOn[mode]?`<div class="guide-bar ${mode==='present'?'prompter':''}" id="guide" aria-live="polite">${guide(s)}</div>`:''}<div class="bottom-nav"><div class="nav-cluster"><button data-action="${mode==='prepare'?'previous':'step-back'}" aria-label="${mode==='prepare'?'Escena anterior':'Paso anterior'}" ${i===0?'disabled':''}>←</button><span class="slide-count">${String(i+1).padStart(2,'0')} / ${deck().slides.length}</span><button data-action="${mode==='prepare'?'next':'step-forward'}" aria-label="${mode==='prepare'?'Escena siguiente':'Paso siguiente'}" ${i===deck().slides.length-1?'disabled':''}>→</button></div>${mode==='present'?'<div class="nav-cluster"><button data-action="expand">Ampliar</button></div>':`<div class="nav-cluster">${mode==='prepare'?'<button class="mobile-editor" data-action="editor">Editar</button><button data-action="speaker">Guion oral</button>':''}<button data-action="scene-resources">Imágenes y recursos</button><button data-action="sources">Fuentes</button><button data-action="questions">5 preguntas</button><button data-action="mic" aria-pressed="${!!mic}" title="Solo mide el volumen en este equipo; no graba ni transcribe">${mic?'Escucha de sala: activa':'Escuchar la sala'}</button><button data-action="motion" aria-pressed="${motion}">${motion?'Pausar movimiento':'Activar movimiento'}</button><button data-action="help" aria-label="Ayuda de navegación">?</button></div>`}</div><div class="learning-bar"><span class="learning-index">${s.q===null?'↗':String(s.q+1).padStart(2,'0')}</span><div class="learning-text"><small>${s.q===null?'El recorrido':'Aprendizaje que construimos'}</small>${s.study?esc(s.study.ask):'Historias y decisiones que revisar'}</div></div></main>${mode==='prepare'?inspector(s):''}</div>`;
  updateStatus();
  // Entering animations only when the scene changes, not when a conversation re-renders it.
  if(previous!==s.id){$('#stage .slide')?.classList.add('is-entering');Presence.reset();}
  const before=deck().slides.findIndex(x=>x.id===previous),was=deck().slides[before];
  if(previous&&previous!==s.id&&s.mov!==undefined&&was?.mov!==s.mov&&motion&&!reducedMotion()&&mode!=='prepare')movementVeil(s,from);
  startOrbs();if(previous!==s.id)Presence.glide(from);
  const said=$('#stage .speech')||$('#stage [data-words]:not([data-words="0"])');if(previous!==s.id&&said?.dataset.words)Presence.cue(null,{delay:1100,think:500,speak:Number(said.dataset.words)*90+300});
  const active=$('.scene-item.active');if(active)active.scrollIntoView({block:'nearest'});
  syncScript();
 }
 function sidebar(){return `<aside class="sidebar"><div class="sidebar-header"><h2>El recorrido</h2><p>${draft.slides.length} pantallas · aprox. 25 minutos<br>Guion y casos en revisión</p></div><nav class="scene-list" aria-label="Secuencia de diapositivas">${draft.slides.map((s,i)=>`<button class="scene-item ${s.id===current?'active':''}" data-slide="${esc(s.id)}" ${s.id===current?'aria-current="step"':''}><span class="number">${String(i+1).padStart(2,'0')}</span><span class="scene-title">${esc(s.title)}<small><span class="review-dot ${s.review}"></span>${s.study?'Concepto + conversación · ':''}${esc(s.chapter)}</small></span></button>`).join('')}</nav><div class="sidebar-tools"><button data-action="overview">Vista general</button><button data-action="undo" ${!undo.length?'disabled':''}>Deshacer</button></div></aside>`;}
 function inspector(s){
  let fields='';
  if(tab==='content')fields=`<label for="title">Título / mensaje de apertura</label><textarea id="title" data-field="title" rows="3">${esc(s.title)}</textarea><label for="message">Idea principal</label><textarea id="message" data-field="message" rows="3">${esc(s.message)}</textarea><label for="points">Esquema o conceptos</label><textarea id="points" data-field="points" rows="7">${esc(s.points.map(p=>p.join(' | ')).join('\n'))}</textarea><div class="field-help">Un concepto por línea: título | explicación</div><label for="takeaway">Aprendizaje visible</label><textarea id="takeaway" data-field="takeaway" rows="2">${esc(s.takeaway||'')}</textarea>${s.layout==='decision'?`<label for="question">Pregunta al público</label><textarea id="question" data-field="question" rows="2">${esc(s.question||'')}</textarea><label for="choices">Opciones, una por línea</label><textarea id="choices" data-field="choices" rows="3">${esc((s.choices||[]).join('\n'))}</textarea><label for="answer">Razonamiento revelable</label><textarea id="answer" data-field="answer" rows="5">${esc(s.answer||'')}</textarea><label for="reveal">Datos del revelado</label><textarea id="reveal" data-field="reveal" rows="5">${esc((s.reveal||[]).map(p=>p.join(' | ')).join('\n'))}</textarea>`:''}`;
  if(tab==='content'&&s.study)fields=`<label for="clinical-title">Título del concepto</label><textarea id="clinical-title" data-field="title" rows="3">${esc(s.title)}</textarea><label for="explanation">Explicación clínica</label><textarea id="explanation" data-study="explanation" rows="7">${esc(s.study.explanation)}</textarea><label for="clinical-points">Esquema del concepto</label><textarea id="clinical-points" data-field="points" rows="6">${esc(s.points.map(p=>p.join(' | ')).join('\n'))}</textarea><label for="habit">Lo habitual (qué no hacer, en pocas palabras)</label><textarea id="habit" data-study="habit" rows="2">${esc(s.study.habit||'')}</textarea><label for="ask">La pregunta que lo frena</label><textarea id="ask" data-study="ask" rows="2">${esc(s.study.ask||'')}</textarea><label for="avoid">Qué evitamos</label><textarea id="avoid" data-study="avoid" rows="2">${esc(s.study.avoid||'')}</textarea><label for="propose">Qué proponemos</label><textarea id="propose" data-study="propose" rows="2">${esc(s.study.propose||'')}</textarea><label for="bridge">Enlace con la siguiente escena</label><textarea id="bridge" data-study="bridge" rows="2">${esc(s.study.bridge)}</textarea><label for="source-note">Fundamento visible</label><textarea id="source-note" data-study="sourceNote" rows="3">${esc(s.study.sourceNote)}</textarea><label for="evidence-type">Tipo de respaldo</label><input id="evidence-type" data-study="evidenceType" value="${esc(s.study.evidenceType||'')}"><label for="clinical-limit">Alcance y límites</label><textarea id="clinical-limit" data-study="limitation" rows="3">${esc(s.study.limitation||'')}</textarea>`;
  if(tab==='conversation'&&s.study)fields=`<label for="steps">Hilo de María del Mar · pasos</label><textarea id="steps" data-steps rows="9">${esc((s.study.steps||[]).map(p=>p.join(' | ')).join('\n'))}</textarea><div class="field-help">Un paso por línea: acciones | guía. Acciones: t1–t3 pregunta, i2 dato del recurso, p1 punto (p: todos), razon, practica (tacha lo habitual y deja la pregunta), enlace, muro (costumbres de todo el recorrido); m1 abre la imagen o vídeo 1 de la escena, h2 su punto guía 2, cerrar la retira. Se pueden combinar: «t2 p1 | …».</div><label for="opening-message">Mensaje de apertura de la herida</label><textarea id="opening-message" data-study="opening" rows="4">${esc(s.study.opening)}</textarea>${s.study.turns.map((t,i)=>`<fieldset class="turn-editor"><legend>Pregunta ${i+1}</legend><label for="turn-label-${i}">Botón de la conversación</label><input id="turn-label-${i}" data-turn="${i}" data-turn-field="label" value="${esc(t.label)}"><label for="turn-kind-${i}">Tipo de recurso</label><select id="turn-kind-${i}" data-turn="${i}" data-turn-field="kind">${[['facts','Datos'],['memory','Historia temporal'],['layers','Capas de información'],['path','Recorrido'],['compare','Comparación'],['decision','Decisión con razonamiento'],['photo','Imagen y zonas'],['outcomes','Resultados']].map(([k,v])=>`<option value="${k}" ${t.kind===k?'selected':''}>${v}</option>`).join('')}</select><label for="turn-voice-${i}">Quién responde</label><select id="turn-voice-${i}" data-turn="${i}" data-turn-field="voice">${Object.entries(voiceNames).map(([k,v])=>`<option value="${k}" ${t.voice===k?'selected':''}>${v}</option>`).join('')}</select><label for="turn-state-${i}">Estado de la entidad</label><select id="turn-state-${i}" data-turn="${i}" data-turn-field="state">${[['listening','Escucha'],['remembering','Recuerdo'],['exploring','Exploración'],['responding','Respuesta'],['comparing','Comparación'],['vascular','Contrapunto'],['showing','Muestra'],['discomfort','Incomodidad'],['relief','Alivio']].map(([k,v])=>`<option value="${k}" ${t.state===k?'selected':''}>${v}</option>`).join('')}</select><label for="turn-reply-${i}">Respuesta preparada</label><textarea id="turn-reply-${i}" data-turn="${i}" data-turn-field="reply" rows="5">${esc(t.reply)}</textarea><label for="turn-resource-${i}">Título del recurso</label><input id="turn-resource-${i}" data-turn="${i}" data-turn-field="resourceTitle" value="${esc(t.resourceTitle)}"><label for="turn-items-${i}">Datos del recurso</label><textarea id="turn-items-${i}" data-turn="${i}" data-turn-field="items" rows="5">${esc(t.items.map(p=>p.join(' | ')).join('\n'))}</textarea></fieldset>`).join('')}<p class="field-help">Los datos se exploran uno a uno; en decisiones, cada línea es una posibilidad y su razonamiento. Textos preparados y editables. La conversación se conserva durante el recorrido. Las interacciones no modifican la versión guardada.</p>`;
  if(tab==='design')fields=`<p class="field-help">Biblioteca incorporada: fotografías externas e ilustraciones identificadas.</p><button class="panel-action" data-action="scene-resources">Ver imágenes de esta escena</button><button class="panel-action" data-action="all-resources">Explorar toda la biblioteca</button><label for="layout">Composición</label><select id="layout" data-field="layout">${Object.entries(layouts).filter(([k])=>k!=='institutional'||s.institutional).map(([k,v])=>`<option value="${k}" ${s.layout===k?'selected':''}>${v}</option>`).join('')}</select><label for="voice">Voz / entidad</label><select id="voice" data-field="voice">${Object.entries(voiceNames).map(([k,v])=>`<option value="${k}" ${s.voice===k?'selected':''}>${v}</option>`).join('')}</select><label for="chapter">Bloque</label><input id="chapter" data-field="chapter" value="${esc(s.chapter)}"><label for="learning">Pregunta del recorrido</label><select id="learning" data-field="q"><option value="" ${s.q===null?'selected':''}>Sin pregunta asociada</option>${QUESTIONS.map((q,i)=>`<option value="${i}" ${s.q===i?'selected':''}>${i+1}. ${q.short}</option>`).join('')}</select><label for="media-file">Imagen de la escena</label><input id="media-file" type="file" accept="image/png,image/jpeg,image/webp"><p class="field-help">Imagen local · PNG, JPG o WebP · hasta 4 MB. Se incluye en las copias exportadas; no se envía a un servidor.</p>${s.media?`<label for="media-caption">Pie de imagen</label><textarea id="media-caption" data-media="caption" rows="2">${esc(s.media.caption)}</textarea><label for="media-alt">Descripción accesible</label><textarea id="media-alt" data-media="alt" rows="2">${esc(s.media.alt)}</textarea><label for="media-credit">Procedencia y crédito</label><input id="media-credit" data-media="credit" value="${esc(s.media.credit)}"><label for="media-rights">Permiso para esta versión compartible</label><select id="media-rights" data-media="rights"><option value="pending" ${s.media.rights!=='authorized'?'selected':''}>Pendiente: no mostrar en el lienzo</option><option value="authorized" ${s.media.rights==='authorized'?'selected':''}>Uso autorizado y sin datos identificativos</option></select><button class="panel-action" data-action="remove-media">Quitar imagen</button>`:''}<div class="scene-tools"><button data-action="duplicate">Duplicar</button><button data-action="move-up">Subir</button><button data-action="move-down">Bajar</button><button class="danger" data-action="delete">Eliminar</button></div>`;
  if(tab==='design'&&s.study)fields=fields.replace(/<label for="layout">[\s\S]*?<\/select>/,'<div class="review-note">Dos lados completos: concepto científico y portal de la herida. La imagen autorizada se abre sin sustituir los recursos.</div>');
  if(tab==='notes')fields=`<label for="notes">Guion oral privado de la ponente</label><textarea id="notes" data-notes rows="18">${esc(notes[s.id]||'')}</textarea><p class="field-help">Solo en Preparar. No se incluyen en la copia HTML para revisar o presentar.</p><label for="review-status">Revisión clínica</label><select id="review-status" data-field="review"><option value="pending" ${s.review!=='validated'?'selected':''}>Pendiente de revisión por la ponente</option><option value="validated" ${s.review==='validated'?'selected':''}>Revisada por la ponente</option></select><label for="refs">Fuentes de esta escena</label><input id="refs" data-field="refs" value="${esc(s.refs.join(', '))}"><p class="field-help">Identificadores: ${Object.keys(REFERENCES).join(', ')}. Guardar no equivale a validar.</p><div class="review-note">Casos e ilustraciones conceptuales. Revisar formulación, ámbito de las recomendaciones y circuitos locales antes de la exposición.</div><button class="panel-action" data-action="restore">Recuperar esta escena guardada</button>`;
  return `<aside class="inspector ${inspectorOpen?'open':''}"><div style="display:flex;justify-content:space-between"><h2>Preparar la escena</h2>${inspectorOpen?'<button data-action="editor" style="padding:0 5px">×</button>':''}</div><p>Los cambios se ven en el lienzo.<br>El guardado local depende de este navegador.</p><nav class="inspector-tabs" aria-label="Panel de edición">${[['content','Contenido'],...(s.study?[['conversation','Conversación']]:[]),['design','Diseño'],['notes','Guion y revisión']].map(([k,v])=>`<button data-tab="${k}" class="${tab===k?'active':''}">${v}</button>`).join('')}</nav>${fields}</aside>`;
 }
 function refreshStage(){const from=Presence.rect(),before=$('#stage .clinical-layout')?.dataset?.composition;const focused=document.activeElement;const focusKey=focused?.dataset?.resourceIndex,focusAction=focused?.dataset?.action;const scroll=$('.portal-scroll')?.scrollTop||0;const s=currentSlide();$('#stage').innerHTML=renderSlide(s,index(),deck().slides.length);syncScript();freshTurn=false;startOrbs();if(before!==$('#stage .clinical-layout')?.dataset?.composition)Presence.glide(from);const pane=$('.portal-scroll');if(pane)pane.scrollTop=scroll;if(focusKey!==undefined)document.querySelector(`[data-resource-index="${focusKey}"]`)?.focus?.({preventScroll:true});else if(focusAction==='resource-reveal')document.querySelector('[data-action="resource-reveal"]')?.focus?.({preventScroll:true});}
 // Ask the entity a prepared question: it thinks, answers word by word, then settles in the turn's state.
 function askTurn(n){
  const s=currentSlide(),turn=s.study?.turns[n];if(!turn)return;
  (conversations[current]??=[]).push(n);manualTurns[current]=true;freshTurn=true;Presence.reset();refreshStage();const pane=$('.portal-scroll');if(pane)pane.scrollTop=0;
  Presence.cue(turn.state,{think:900,speak:wordCount(turn.reply)*25+350,who:speakerIndex(s,conversations[current])});
 }
 // Guided steps: the thread María del Mar follows. Space, arrows, clicker and click advance one step.
 const stepsOf=s=>s.study?.steps||s.intro?.steps||[];
 function stepView(s){const list=stepsOf(s),k=Math.min(steps[s.id]||0,list.length),acts=list.slice(0,k).flatMap(p=>p[0].split(/\s+/)),last=k?list[k-1][0].split(/\s+/):[];
  const idx=a=>a==='p'?s.points.map((_,i)=>i):/^p\d+$/.test(a)?[Number(a.slice(1))-1]:[];
  return {guided:list.length>0,k,n:list.length,seen:new Set(acts.flatMap(idx)),focus:new Set(last.flatMap(idx)),practice:!list.some(p=>/\bpractica\b/.test(p[0]))||acts.includes('practica'),bridge:acts.includes('enlace'),wall:acts.includes('muro'),lastHas:a=>last.includes(a)};}
 // When a step asks nothing, the wound still speaks: the question that replaces the habit, the wall, the bridge.
 // Intro scenes speak their own lines.
 function woundLine(s){const g=stepView(s);if(!g.k||manualTurns[s.id])return null;
  if(s.intro)return s.intro.lines?.[g.k-1]?{text:s.intro.lines[g.k-1]}:null;
  const st=s.study;if(!st)return null;
  if(g.lastHas('enlace'))return {label:'Para seguir',text:st.bridge,voice:'ponente'};
  if(g.lastHas('practica'))return {habit:st.habit,text:st.ask};
  if(g.lastHas('muro'))return {label:'Lo habitual',text:'Todo esto me lo habéis hecho alguna vez. Casi siempre, con buena intención.'};
  return null;}
 function applyStep(s,action){const acts=action.split(/\s+/);
  // A new question puts the picture away unless the same step opens one.
  if(acts.some(a=>/^t\d+$/.test(a))&&!acts.some(a=>/^m\d+$/.test(a)))delete mediaView[s.id];
  for(const a of acts){const n=Number(a.slice(1))-1;
  if(/^t\d+$/.test(a)&&s.study.turns[n])(conversations[s.id]??=[]).push(n);
  const key=s.id+':'+(conversations[s.id]?.at(-1)??'opening'),r=resourceStates[key]||{index:0,reveal:false,seen:[0]};
  if(/^t\d+$/.test(a))resourceStates[key]=r;
  if(/^i\d+$/.test(a))resourceStates[key]={...r,index:n,seen:[...(r.seen||[r.index]),n]};
  if(a==='razon')resourceStates[key]={...r,reveal:true};
  if(/^m\d+$/.test(a))mediaView[s.id]={n,hot:-1};
  if(/^h\d+$/.test(a)&&mediaView[s.id])mediaView[s.id]={...mediaView[s.id],hot:n};
  if(a==='cerrar')delete mediaView[s.id];}}
 function stepTo(k,animate){const s=currentSlide(),list=stepsOf(s);k=Math.max(0,Math.min(k,list.length));
  delete manualTurns[s.id];delete conversations[s.id];delete mediaView[s.id];for(const key of Object.keys(resourceStates))if(key.startsWith(s.id+':'))delete resourceStates[key];
  if(s.study)list.slice(0,k).forEach(p=>applyStep(s,p[0]));steps[s.id]=k;
  const asked=animate&&k?list[k-1][0].split(/\s+/).find(a=>/^t\d+$/.test(a)):null,turn=asked&&s.study.turns[Number(asked.slice(1))-1];
  freshMedia=!!(animate&&k&&/(^|\s)m\d+/.test(list[k-1][0]));
  Presence.reset();freshTurn=!!turn;refreshStage();freshMedia=false;
  const said=animate&&!turn&&k?woundLine(s)?.text:null;
  if(turn){const pane=$('.portal-scroll');if(pane)pane.scrollTop=0;Presence.cue(turn.state,{think:900,speak:wordCount(turn.reply)*25+350,who:speakerIndex(s,conversations[s.id]||[])});}
  else if(said&&woundLine(s)?.voice!=='ponente')Presence.cue(null,{think:300,speak:wordCount(said)*25+300,who:0});
  if(animate)$('#stage .resource-thread .now')?.scrollIntoView?.({block:'nearest',behavior:'smooth'});
  if(animate&&!turn)$('#stage .is-focus, #stage .clinical-bridge.is-on, #stage .practice-pair.is-focus')?.scrollIntoView?.({block:'nearest',behavior:'smooth'});}
 // The route is where the thread is. Stepping moves it; jumping from the overview, the rail or the
 // scene list is a detour, and the next step forward goes back to the route exactly as it was.
 const offRoute=()=>!!thread&&thread.id!==current&&deck().slides.some(s=>s.id===thread.id);
 function track(){if(!offRoute())thread={id:current,k:steps[current]||0};syncScript();}
 function backToRoute(){current=thread.id;render();stepTo(thread.k,false);syncScript();}
 function advance(dir){if(dir>0&&offRoute())return backToRoute();
  const s=currentSlide(),n=stepsOf(s).length,k=Math.min(steps[s.id]||0,n),wasOn=!offRoute();
  if(dir>0&&k<n){stepTo(k+1,true);return track();}if(dir<0&&k>0){stepTo(k-1,false);return track();}
  const next=index()+dir;if(next<0||next>=deck().slides.length)return;
  current=deck().slides[next].id;delete manualTurns[current];if(!wasOn&&current===thread.id)return backToRoute();const t=currentSlide();delete conversations[t.id];delete mediaView[t.id];for(const key of Object.keys(resourceStates))if(key.startsWith(t.id+':'))delete resourceStates[key];
  steps[t.id]=0;if(wasOn)thread=null;render();if(dir<0&&stepsOf(t).length)stepTo(stepsOf(t).length,false);
  track();}
 // María del Mar's script: what she says at each step (line 0 opens the scene) and what the screen does by itself.
 function cues(s){if(s.intro)return [{cue:s.intro.open,screen:[]},...s.intro.steps.map(([,cue],i)=>({cue,screen:s.intro.lines?.[i]?[['voz','La herida: «'+s.intro.lines[i]+'»']]:[]}))];
  const st=s.study;if(!st)return [];const assets=sceneAssets(s),ctx={};
  const lines=[{cue:st.habit?'Lo habitual: «'+st.habit+'»':'Abre la escena.',screen:[['voz','La herida: «'+st.opening+'»']]}];
  for(const [action,cue] of st.steps||[]){const screen=[];
   for(const a of action.split(/\s+/)){const n=Number(a.slice(1))-1,t=st.turns[n];
    if(/^t\d+$/.test(a)&&t){ctx.turn=t;screen.push(['voz',speaker(t.voice)+': «'+t.reply+'»']);}
    else if(/^i\d+$/.test(a)&&ctx.turn?.items[n])screen.push(['dato',ctx.turn.items[n][0]]);
    else if(a==='razon'&&ctx.turn)screen.push(['dato','Se abre el razonamiento']);
    else if(/^m\d+$/.test(a)&&assets[n]){ctx.media=assets[n];screen.push(['imagen',assets[n].title]);}
    else if(/^h\d+$/.test(a)&&ctx.media?.walkthrough?.steps[n])screen.push(['imagen',(n+1)+' · '+ctx.media.walkthrough.steps[n].title]);
    else if(a==='cerrar')screen.push(['imagen','Se retira la imagen']);
    else if(a==='p')screen.push(['ciencia',s.points.map(p=>p[0]).join(' · ')]);
    else if(/^p\d+$/.test(a)&&s.points[n])screen.push(['ciencia',s.points[n][0]]);
    else if(a==='muro')screen.push(['pregunta','Las costumbres de todo el recorrido']);
    else if(a==='practica')screen.push(['pregunta',st.ask||st.propose||''],['evidencia','Evitar: '+(st.avoid||'')+' Proponer: '+(st.propose||'')]);
    else if(a==='enlace')screen.push(['enlace','«'+st.bridge+'»']);}
   lines.push({cue,screen});}
  return lines;}
 const routeLabel=()=>{const r=deck().slides.find(s=>s.id===thread?.id);return r?`escena ${r.study?pad(r.study.number):pad(deck().slides.indexOf(r)+1)}, paso ${thread.k}`:'';};
 function guide(s){const lines=cues(s);if(!lines.length)return `<span class="guide-count">Sin pasos</span><p>Avanza a la siguiente escena.</p>`;
  const k=Math.min(steps[s.id]||0,lines.length-1),next=lines[k+1];
  return `<span class="guide-count">Guion · paso ${k} / ${lines.length-1}</span><p>${esc(lines[k].cue)}</p><small>Siguiente → ${esc(next?next.cue:'escena nueva · «'+(s.study?.bridge||deck().slides[index()+1]?.title||'fin')+'»')}</small>`;}
 // The script can live on the slide (G) or in its own window on the speaker's screen (V), synced step by step.
 let presenter=null,clock=null,started=0;
 const elapsed=()=>{const t=Math.floor((Date.now()-started)/1000);return pad(Math.floor(t/60))+':'+pad(t%60);};
 function speakerNote(id){const block=(notes[id]||'').split(/\n\n/).find(b=>b.startsWith('MARÍA DEL MAR'));return block?block.replace(/^MARÍA DEL MAR\n/,''):'';}
 function presenterView(){const s=currentSlide(),i=index(),st=s.study,lines=cues(s),k=Math.min(steps[s.id]||0,Math.max(0,lines.length-1)),after=deck().slides[i+1];
  const kinds={voz:'En pantalla',dato:'Recurso',imagen:'Imagen',ciencia:'Se destaca',pregunta:'La pregunta',enlace:'Enlace',evidencia:'Evidencia'};
  const note=BOOT.readOnly?'':speakerNote(s.id);
  return `<header><div><small>${st?'Escena '+pad(st.number):'Pantalla '+pad(i+1)} · ${esc(s.chapter)}</small><h1>${esc(s.title)}</h1></div><div class="meta"><span>${lines.length?`Paso ${k} / ${lines.length-1}`:''}</span><button data-go="clock" title="Reiniciar el tiempo"><b id="clock">${elapsed()}</b></button></div></header>${offRoute()?`<button class="detour" data-go="route">Fuera del recorrido · → vuelve a la ${esc(routeLabel())}</button>`:''}<div class="cols"><ol class="script">${lines.map((l,n)=>`<li class="${n<k?'done':n===k?'now':''}"><span class="n">${n}</span><div><p class="cue">${esc(l.cue)}</p>${l.screen.map(([kind,t])=>`<p class="screen" data-kind="${kind}"><small>${kinds[kind]}</small>${esc(t)}</p>`).join('')}</div></li>`).join('')||`<li class="now"><span class="n">·</span><div><p class="cue">${esc(s.message||s.title)}</p></div></li>`}</ol><aside>${st?`<section class="habit"><small>Lo habitual</small><p class="was">${esc(st.habit||st.avoid||'')}</p><small>La pregunta</small><p class="ask">${esc(st.ask||st.propose||'')}</p></section>${note?`<section><small>Tu nota</small><p>${esc(note)}</p></section>`:''}<section><small>Idea clave</small><p>${esc(st.explanation)}</p></section><section><small>Fuente y tipo de respaldo</small><p>${esc(st.sourceNote)}</p><p>${esc(st.evidenceType||'')}</p></section><section><small>Alcance</small><p>${esc(st.limitation||'')}</p></section>`:''}<section><small>Después</small><p>${after?esc(after.title):'Fin del recorrido'}</p></section></aside></div><footer><button data-go="prev">← Paso anterior</button><button data-go="next" class="primary">Paso siguiente →</button></footer>`;}
 function openPresenter(){
  if(presenter&&!presenter.closed){presenter.focus();return syncScript();}
  const w=window.open('','guion-ponente','popup,width=1100,height=760');
  if(!w)return toast('El navegador ha bloqueado la ventana de ponente. Pulsa G para ver el guion en esta pantalla.');
  w.document.open();w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Guion de la ponente</title><style>${PRESENTER_CSS}</style></head><body><main id="p"></main></body></html>`);w.document.close();
  w.addEventListener('keydown',e=>{if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();advance(e.shiftKey&&e.key===' '?-1:1);}else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();advance(-1);}else if(e.key==='ArrowDown'){e.preventDefault();navigate(1);}else if(e.key==='ArrowUp'){e.preventDefault();navigate(-1);}});
  w.document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.go==='next')advance(1);else if(b.dataset.go==='prev')advance(-1);else if(b.dataset.go==='route')backToRoute();else if(b.dataset.go==='clock'){started=Date.now();syncScript();}});
  presenter=w;started||=Date.now();clearInterval(clock);clock=setInterval(()=>{if(!presenter||presenter.closed)return clearInterval(clock);const el=presenter.document.getElementById('clock');if(el)el.textContent=elapsed();},1000);syncScript();}
 function syncScript(){const gb=$('#guide');if(gb)gb.innerHTML=guide(currentSlide());if(!presenter||presenter.closed)return;const p=presenter.document.getElementById('p');if(!p)return;p.innerHTML=presenterView();p.querySelector('.now')?.scrollIntoView({block:'center'});}
 const PRESENTER_CSS=`*{box-sizing:border-box}body{margin:0;background:#1f1714;color:#f4e9df;font:16px/1.45 system-ui,-apple-system,sans-serif}main{display:flex;flex-direction:column;height:100vh}
header{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;padding:16px 24px 12px;border-bottom:1px solid #3e302a}header small,aside small,.screen small{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#c79a7e}h1{margin:2px 0 0;font:500 24px/1.2 Georgia,serif}
.meta{display:flex;align-items:center;gap:16px;color:#cdb8a9;white-space:nowrap}.meta button{all:unset;cursor:pointer;font:600 26px ui-monospace,monospace;color:#fff}
.detour{margin:10px 24px 0;padding:10px 14px;border:0;border-radius:10px;background:#f0b44c;color:#2a1a0e;font:600 15px system-ui;cursor:pointer;text-align:left}
.cols{flex:1;min-height:0;display:grid;grid-template-columns:1fr 320px}.script{margin:0;padding:16px 24px 40vh;overflow:auto;list-style:none}aside{overflow:auto;padding:16px 20px;border-left:1px solid #3e302a;display:grid;align-content:start;gap:18px}aside p{margin:2px 0 8px;color:#e6d6ca;font-size:14px}
.script li{display:grid;grid-template-columns:34px 1fr;gap:10px;padding:10px 12px;border-radius:12px;opacity:.55;transition:opacity .3s,background .3s}.script li.done{opacity:.3}.script li.now{opacity:1;background:#3a2a23;box-shadow:inset 4px 0 0 #f0b44c}
.n{font:600 13px ui-monospace,monospace;color:#c79a7e;padding-top:4px}.cue{margin:0;font-size:19px;color:#fff}.now .cue{font-size:26px;line-height:1.3}.screen{margin:6px 0 0;font-size:14px;color:#d9c4b6}.screen[data-kind=voz]{font-style:italic}.screen[data-kind=pregunta]{color:#ffd58a;font-weight:600}.screen[data-kind=evidencia]{font-size:13px;color:#b9a395}
.habit .was{text-decoration:line-through;text-decoration-color:#e07a5f;color:#e9b7a6}.habit .ask{color:#ffd58a;font-weight:600;font-size:16px}
footer{display:flex;justify-content:flex-end;gap:10px;padding:12px 24px;border-top:1px solid #3e302a}footer button{border:1px solid #5a463c;background:transparent;color:#f4e9df;border-radius:10px;padding:10px 18px;font:600 15px system-ui;cursor:pointer}footer .primary{background:#f0b44c;border-color:#f0b44c;color:#2a1a0e}`;
 // Room listening: the wound reacts to the loudness of the room. Audio never leaves the analyser:
 // no recording, no transcription, nothing stored.
 let mic=null;
 async function toggleMic(){
  const lvl=x=>{Presence.level(x);document.documentElement?.style?.setProperty('--lvl',x.toFixed(3));};
  if(mic){mic.stream.getTracks().forEach(t=>t.stop());mic.ctx.close();cancelAnimationFrame(mic.raf);mic=null;lvl(0);toast('Escucha de sala desactivada.');render();return;}
  try{const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});
   const ctx=new AudioContext(),an=ctx.createAnalyser();an.fftSize=1024;ctx.createMediaStreamSource(stream).connect(an);
   const buf=new Float32Array(an.fftSize);let smooth=0;mic={stream,ctx,raf:0};
   const loop=()=>{if(!mic)return;an.getFloatTimeDomainData(buf);let sum=0;for(const x of buf)sum+=x*x;const rms=Math.sqrt(sum/buf.length);smooth+=(Math.min(1,Math.max(0,(rms-.008)*14))-smooth)*.25;lvl(smooth);mic.raf=requestAnimationFrame(loop);};
   loop();toast('Escucha de sala activa: solo se mide el volumen en este equipo; no se graba nada.');render();
  }catch{mic=null;toast('No se pudo usar el micrófono. Abre la presentación desde localhost o https y permite el acceso.');}
 }
 // Between movements the wound's colour fills the screen from where it was, names the movement and opens.
 function movementVeil(s,from){
  const m=deck().movements?.[s.mov];if(!m||!document.body)return;const v=document.createElement('div');v.className='move-veil';v.setAttribute('aria-hidden','true');v.dataset.movement=s.mov;
  const r=from&&from.width?from:{left:innerWidth*.72,top:innerHeight*.4,width:0,height:0};
  v.style.setProperty('--cx',Math.round(r.left+r.width/2)+'px');v.style.setProperty('--cy',Math.round(r.top+r.height/2)+'px');
  v.innerHTML=`<div><span>ETAPA ${['I','II','III','IV'][s.mov]} · DE IV</span><strong>${esc(m.short)}</strong><small>${esc(m.sub||'')}</small></div>`;
  document.querySelectorAll('.move-veil').forEach(x=>x.remove());document.body.append(v);setTimeout(()=>v.remove(),2400);
 }
 function navigate(delta){const next=index()+delta;if(next<0||next>=deck().slides.length)return;current=deck().slides[next].id;revealed[current]=false;delete choices[current];thread=null;render();track();}
 function setMode(next){if(BOOT.readOnly&&next==='prepare')return;if(next===mode)return;persist();mode=next;if(!deck().slides.some(s=>s.id===current))current=deck().slides[0].id;revealed={};choices={};manualTurns={};conversations={};resourceStates={};steps={};mediaView={};thread={id:current,k:0};Presence.reset();render();}
 function savePresentation(){saved=cleanDeck(draft);dirty=false;persist();toast('Versión completa guardada para presentar. Notas privadas separadas.');}
 function showDialog(title,body){visualResources.stop();const d=$('#dialog');d.classList.remove('resource-dialog');d.innerHTML=`<div class="modal-head"><h2 id="dialog-title">${esc(title)}</h2><button data-action="close-dialog" aria-label="Cerrar">×</button></div>${body}`;if(!d.open)d.showModal();}
 function showSources(all=false){const ids=all?Object.keys(REFERENCES):currentSlide().refs;showDialog(all?'Bibliografía del recorrido':'Fuentes de esta escena',`<p class="modal-copy">${!all&&currentSlide().study?esc(currentSlide().study.sourceNote)+'<br><br>':''}Referencias del guion. Revisión clínica pendiente. Las citas no autorizan la reproducción de imágenes de terceros.</p><div class="reference-list">${ids.map(id=>{const r=REFERENCES[id];return r?`<article><span class="reference-tag">${esc(id)} · ${esc(r.year)}</span><h3>${esc(r.title)}</h3><p>${esc(r.detail)}</p>${r.url?`<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Consultar publicación ↗</a>`:'<p>PDF aportado en la carpeta bibliography del proyecto.</p>'}</article>`:`<article><h3>${esc(id)}</h3><p>Referencia pendiente de completar.</p></article>`;}).join('')}</div><button data-action="all-sources">Ver toda la bibliografía</button>`);}
 function download(name,text,type='application/json'){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([text],{type}));a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
 function jsonSafe(v){return JSON.stringify(v).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');}
 function exportHTML(){
  const publicDeck=cleanDeck(saved);publicDeck.slides.forEach(s=>{if(s.media?.rights!=='authorized')s.media=null;});
  publicDeck.resourceCatalog=Object.fromEntries(Object.entries(publicDeck.resourceCatalog||{}).filter(([,a])=>a.rights==='authorized'));
  publicDeck.slides.forEach(s=>{if(s.resourceIds)s.resourceIds=s.resourceIds.filter(id=>Object.hasOwn(publicDeck.resourceCatalog,id));});
  const css=$('style').textContent;
  const engine=$('#engine').textContent;
  const data=`const REFERENCES=${jsonSafe(REFERENCES)};const QUESTIONS=${jsonSafe(QUESTIONS)};const INITIAL_DECK=${jsonSafe(publicDeck)};const BOOT={mode:'review',readOnly:true,deck:INITIAL_DECK};`;
  const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(publicDeck.title)} · Revisión</title><style>${css}</style></head><body><div id="app"></div><div id="toast" role="status" aria-live="polite"></div><dialog id="dialog" aria-labelledby="dialog-title"></dialog><input id="import-file" type="file" accept="application/json,.json" hidden><script id="seed">${data}<\/script><script id="engine">${engine}<\/script></body></html>`;
  download('conversaciones-heridas-revision.html',html,'text/html');toast('HTML de la versión guardada exportado. No incluye notas privadas.');
 }
 function exportProject(){persist();download('conversaciones-heridas-proyecto.json',JSON.stringify({format:'jerez-presentation',schemaVersion:1,draft,saved,notes,dirty,exportedAt:new Date().toISOString()},null,2));toast('Copia editable exportada con recursos y notas privadas.');}
 function validateDeck(d){
  if(!d||d.schemaVersion!==1||!Array.isArray(d.slides)||d.slides.length<1||d.slides.length>100||typeof d.title!=='string'||typeof d.author!=='string')throw Error('Formato de presentación no compatible.');
  if(d.resourceCatalog!==undefined){
   if(!d.resourceCatalog||typeof d.resourceCatalog!=='object'||Array.isArray(d.resourceCatalog)||Object.keys(d.resourceCatalog).length>60)throw Error('Biblioteca de imágenes inválida.');
   for(const [id,a] of Object.entries(d.resourceCatalog)){
    if(!/^[a-z0-9][a-z0-9-]{0,79}$/.test(id)||!a||typeof a!=='object'||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(a.src)||a.src.length>6e6||!['title','alt','caption','credit','label'].every(k=>typeof a[k]==='string')||!['pending','authorized'].includes(a.rights))throw Error('Imagen de biblioteca inválida.');if(a.video!==undefined&&!(typeof a.video==='string'&&/^[\w-]+(\/[\w.-]+)*\.(mp4|webm)$/.test(a.video)&&!a.video.includes('..')))throw Error('Vídeo de biblioteca inválido.');
    const w=a.walkthrough;if(w&&(!Array.isArray(w.steps)||w.steps.length<1||w.steps.length>8||typeof w.title!=='string'||!Number.isFinite(w.stepMs)||w.stepMs<1000||w.stepMs>10000||!w.steps.every(s=>typeof s.title==='string'&&typeof s.text==='string'&&['x','y'].every(k=>s[k]===undefined||Number.isFinite(s[k])&&s[k]>=0&&s[k]<=100))))throw Error('Recorrido visual inválido.');
   }
  }
  const ids=new Set();
  for(const s of d.slides){if(typeof s.id!=='string'||!s.id||ids.has(s.id)||typeof s.title!=='string'||typeof s.message!=='string'||typeof s.chapter!=='string'||!Object.hasOwn(layouts,s.layout)||!Array.isArray(s.points)||!s.points.every(p=>Array.isArray(p)&&p.length===2&&p.every(x=>typeof x==='string'))||!Array.isArray(s.refs)||!s.refs.every(x=>typeof x==='string')||!(s.q===null||Number.isInteger(s.q)&&s.q>=0&&s.q<5))throw Error('Hay una escena inválida o identificadores repetidos.');ids.add(s.id);
   if(s.media&&(!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s.media.src)||s.media.src.length>6e6))throw Error('Recurso de imagen inválido.');
   if(s.intro!==undefined&&!(s.intro&&typeof s.intro.kind==='string'&&typeof s.intro.open==='string'&&Array.isArray(s.intro.steps)&&s.intro.steps.length<=20&&s.intro.steps.every(p=>Array.isArray(p)&&p.length===2&&p.every(x=>typeof x==='string'))&&(s.intro.lines===undefined||Array.isArray(s.intro.lines)&&s.intro.lines.every(x=>typeof x==='string'))))throw Error('Introducción inválida.');
   if(s.resourceIds&&(!Array.isArray(s.resourceIds)||s.resourceIds.length>20||!s.resourceIds.every(id=>typeof id==='string'&&Object.hasOwn(d.resourceCatalog||{},id))))throw Error('Asociación de imágenes inválida.');
   if(s.institutional&&!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s.institutional))throw Error('Imagen institucional inválida.');
   if(s.choices&&(!Array.isArray(s.choices)||!s.choices.every(x=>typeof x==='string')))throw Error('Opciones inválidas.');
   if(s.reveal&&(!Array.isArray(s.reveal)||!s.reveal.every(p=>Array.isArray(p)&&p.length===2&&p.every(x=>typeof x==='string'))))throw Error('Revelado inválido.');
   if(s.mov!==undefined&&!(Number.isInteger(s.mov)&&s.mov>=0&&s.mov<5))throw Error('Movimiento inválido.');if(s.study){const t=s.study;if(['avoid','propose','habit','ask'].some(k=>t[k]!==undefined&&typeof t[k]!=='string')||t.steps!==undefined&&!(Array.isArray(t.steps)&&t.steps.length<=40&&t.steps.every(p=>Array.isArray(p)&&p.length===2&&p.every(x=>typeof x==='string')&&/^(t\d+|i\d+|p\d*|razon|practica|enlace|muro|m\d+|h\d+|cerrar)(\s+(t\d+|i\d+|p\d*|razon|practica|enlace|muro|m\d+|h\d+|cerrar))*$/.test(p[0]))))throw Error('Pasos del recorrido inválidos.');if(['evidenceType','limitation'].some(k=>t[k]!==undefined&&typeof t[k]!=='string'))throw Error('Fundamento clínico inválido.');if(!Number.isInteger(t.number)||!['label','explanation','sourceNote','opening','caseLabel','bridge'].every(k=>typeof t[k]==='string')||!Array.isArray(t.turns)||t.turns.length<1||t.turns.length>8||!t.turns.every(v=>['label','reply','kind','state','voice','resourceTitle'].every(k=>typeof v[k]==='string')&&Array.isArray(v.items)&&v.items.length>0&&v.items.length<=20&&Object.hasOwn(voiceNames,v.voice)&&v.items.every(p=>Array.isArray(p)&&p.length===2&&p.every(x=>typeof x==='string'))))throw Error('Conversación preparada inválida.');}
  }
  return d;
 }
 function showExport(){showDialog('Compartir y conservar',`<p class="modal-copy">La edición se guarda en este navegador. Para trasladar el trabajo, conserva una copia del proyecto. Para revisar o presentar, exporta un HTML autónomo de la versión guardada.</p><div class="modal-buttons"><button class="primary" data-action="export-html">HTML para revisar y presentar</button><button data-action="export-project">Copia editable del proyecto</button><button data-action="import">Importar proyecto</button>${legacy?'<button data-action="legacy">Descargar borrador anterior</button>':''}</div><div class="export-note">${dirty?'Hay cambios de borrador sin pasar a la versión de presentación. El HTML usará la última versión guardada.':'El HTML usará la versión guardada.'}<br>El HTML excluye notas privadas e imágenes con permiso pendiente. La copia editable incluye notas y todos los recursos.</div><p class="modal-copy">Para compartir por enlace hay que alojar el HTML. Este prototipo no sincroniza modificaciones entre equipos.</p>`);}
 $('#app').addEventListener('click',e=>{
  const button=e.target.closest('button');if(!button){if(mode!=='prepare'&&e.target.closest?.('#stage')&&!e.target.closest('a,summary,details,input,textarea,select,.resource-tabs')&&!String(globalThis.getSelection?.()||''))advance(1);return;}
  if(visualResources.handle(button.dataset))return;
  if(button.dataset.slide){current=button.dataset.slide;revealed[current]=false;render();return;}
  if(button.dataset.question!==undefined){const q=Number(button.dataset.question);const target=deck().slides.find(x=>deck().movements?x.mov===q:x.q===q);if(target){current=target.id;render();}return;}
  if(button.dataset.hot!==undefined&&mediaView[current]){mediaView[current]={...mediaView[current],hot:Number(button.dataset.hot)};refreshStage();return;}
  if(button.dataset.mediaN!==undefined){mediaView[current]={n:Number(button.dataset.mediaN),hot:-1};freshMedia=true;refreshStage();freshMedia=false;return;}
  if(button.dataset.resourceIndex!==undefined){const n=Number(button.dataset.resourceIndex),t=currentSlide().study?.turns[conversations[current]?.at(-1)];if(t&&Number.isInteger(n)&&n>=0&&n<t.items.length){const r=resourceState();resourceStates[resourceKey()]={index:n,reveal:false,seen:[...(r.seen||[r.index]),n]};refreshStage();}return;}
  if(button.dataset.turnEvent!==undefined&&currentSlide().study){const n=Number(button.dataset.turnEvent);if(Number.isInteger(n))askTurn(n);return;}
  if(button.dataset.mode){setMode(button.dataset.mode);return;}
  if(button.dataset.tab){tab=button.dataset.tab;render();return;}
  if(button.dataset.choice!==undefined){choices[current]=Number(button.dataset.choice);refreshStage();return;}
  action(button.dataset.action);
 });
 $('#dialog').addEventListener('click',e=>{const b=e.target.closest('button');if(b&&visualResources.handle(b.dataset))return;if(b?.dataset.turnEvent!==undefined){askTurn(Number(b.dataset.turnEvent));$('#dialog').close();return;}if(b?.dataset.slide){current=b.dataset.slide;revealed[current]=false;$('#dialog').close();render();}else if(b)action(b.dataset.action);});
 function action(a){switch(a){
  case 'previous':navigate(-1);break;case 'next':navigate(1);break;
  case 'step-forward':advance(1);break;
  case 'step-back':advance(-1);break;
  case 'expand':{const s=currentSlide();showDialog('Ampliar esta escena',`${s.study?`<div class="reference-list">${s.study.turns.map((t,i)=>`<article><button data-turn-event="${i}">${esc(t.label)}</button></article>`).join('')}</div>`:''}<div class="modal-buttons"><button data-action="scene-resources">Imágenes</button><button data-action="sources">Fuentes</button><button data-action="journey">Conversación completa</button><button data-action="questions">Cinco preguntas finales</button><button data-action="overview">Escenas</button><button data-action="mic">Escuchar la sala</button><button data-action="motion">${motion?'Pausar movimiento':'Activar movimiento'}</button><button data-action="help">Ayuda</button></div>`);break;}
  case 'route-return':if(offRoute())backToRoute();break;
  case 'route-here':thread={id:current,k:steps[current]||0};render();break;
  case 'prompter':scriptOn[mode]=!scriptOn[mode];render();break;
  case 'presenter':openPresenter();break;
  case 'save':savePresentation();break;
  case 'speaker':if(mode==='prepare'&&!BOOT.readOnly)showDialog('Guion oral de esta escena',`<p class="modal-copy" style="white-space:pre-line">${esc(notes[current]||'Guion oral pendiente de desarrollar para esta escena.')}</p>`);break;
  case 'reset-conversation':delete manualTurns[current];delete conversations[current];for(const key of Object.keys(resourceStates))if(key.startsWith(current+':'))delete resourceStates[key];Presence.reset();refreshStage();break;
  case 'history':{const s=currentSlide();showDialog('Historial de la conversación',`<p class="modal-copy">Incluye las preguntas activadas durante el recorrido por esta escena.</p><div class="reference-list">${(conversations[current]||[]).map(i=>`<article><h3>${esc(s.study.turns[i].label)}</h3><p>${esc(s.study.turns[i].reply)}</p></article>`).join('')}</div>`);break;}
  case 'resource-reveal':resourceStates[resourceKey()]={...resourceState(),reveal:!resourceState().reveal};refreshStage();break;
  case 'scene-resources':if(visualResources.has(currentSlide()))visualResources.open(currentSlide());else visualResources.all();break;
  case 'all-resources':visualResources.all();break;
  case 'photo-open':{const m=currentSlide().media;if(m?.rights==='authorized')showDialog('Imagen de la conversación',`<figure class="photo-dialog"><img src="${esc(m.src)}" alt="${esc(m.alt||m.caption||'Imagen autorizada')}"><figcaption>${esc(m.caption)} · ${esc(m.credit)}</figcaption></figure>`);break;}
  case 'journey':showDialog('Nuestra conversación',`<p class="modal-copy">Lo hablado se conserva durante esta sesión. Los casos y las vivencias son recreaciones docentes.</p><div class="reference-list">${deck().slides.filter(s=>conversations[s.id]?.length).map(s=>`<article><h3>${esc(s.title)}</h3>${conversations[s.id].map(i=>{const t=s.study?.turns[i];return t?`<p><strong>María del Mar: ${esc(t.label)}</strong><br>${esc(speaker(t.voice))}: ${esc(t.reply)}</p>`:'';}).join('')}</article>`).join('')||'<p>Aún no se han abierto preguntas. Elige una para empezar.</p>'}</div><button data-action="reset-journey">Empezar una conversación nueva</button>`);break;
  case 'reset-journey':manualTurns={};conversations={};resourceStates={};Presence.reset();$('#dialog').close();render();break;
  case 'legacy':if(legacy)download('conversaciones-heridas-version-anterior.json',JSON.stringify({format:'jerez-presentation',schemaVersion:1,...legacy},null,2));break;
  case 'reveal':revealed[current]=!revealed[current];refreshStage();break;
  case 'sources':showSources();break;case 'all-sources':$('#dialog').close();showSources(true);break;
  case 'questions':showDialog('Cinco preguntas para la práctica',`<p class="modal-copy">Síntesis docente del recorrido. No es una escala ni una herramienta validada.</p><div class="reference-list">${QUESTIONS.map((q,i)=>`<article><span class="reference-tag">${String(i+1).padStart(2,'0')} · ${q.short}</span><h3>${esc(q.text)}</h3></article>`).join('')}</div>`);break;
  case 'fullscreen':if(document.fullscreenElement)document.exitFullscreen().catch(()=>toast('No se pudo salir de pantalla completa.'));else document.documentElement.requestFullscreen?.().catch(()=>toast('El navegador no permite pantalla completa en esta vista.'));break;
  case 'motion':motion=!motion;render();break;
   case 'mic':toggleMic();break;
   case 'stage-media':if(mediaView[current])delete mediaView[current];else{mediaView[current]={n:0,hot:-1};freshMedia=true;}refreshStage();freshMedia=false;break;
   case 'media-close':delete mediaView[current];refreshStage();break;
   case 'media-play':{const v=$('.media-video');if(v)v.paused?v.play():v.pause();break;}
  case 'editor':inspectorOpen=!inspectorOpen;render();break;
  case 'script':showDialog('Guion de pasos · hilo de María del Mar',`<p class="modal-copy">Cada pulsación (→, espacio, clic o mando) avanza un paso. Lo que dice la herida y los recursos se activan solos; aquí está lo que conduce María del Mar.</p><div class="script-list">${deck().slides.filter(s=>s.study).map(s=>`<article><button data-slide="${esc(s.id)}"><small>${pad(s.study.number)} · ${esc(s.chapter)}</small>«${esc(s.study.opening)}»</button><ol>${(s.study.steps||[]).map(p=>`<li>${esc(p[1])}</li>`).join('')}</ol><p class="script-bridge">Enlace → «${esc(s.study.bridge)}»</p></article>`).join('')}</div>`);break;
   case 'overview':showDialog('El recorrido completo',`<div class="overview-grid">${deck().slides.map((s,i)=>`<button data-slide="${esc(s.id)}"><small>${String(i+1).padStart(2,'0')} · ${esc(s.chapter)}</small>${esc(s.title)}</button>`).join('')}</div>`);break;
  case 'help':showDialog('Presentar con tranquilidad',`<p class="modal-copy">Las interacciones están preparadas. Esta interfaz no es una IA clínica y no genera respuestas.</p>${[['→ · Espacio · clic','Siguiente paso del hilo (al terminar, escena siguiente)'],['← · Mayús+Espacio','Paso anterior'],['↓ / ↑','Saltar a la escena siguiente o anterior'],['Av Pág / Re Pág','Mando de presentación: paso siguiente o anterior'],['1 · 2 · 3','Hacer una pregunta preparada a la herida'],['0','Reiniciar la conversación de esta escena'],['Inicio / Fin','Primera o última escena'],['F','Pantalla completa'],['G','Mostrar u ocultar el guion en pantalla'],['V','Abrir el guion en otra ventana (pantalla de la ponente)'],['M','Escuchar la sala (solo volumen, nada se graba)'],['Esc','Cerrar ventana o salir de pantalla completa']].map(([k,v])=>`<div class="help-key"><span>${v}</span><kbd>${k}</kbd></div>`).join('')}<p class="modal-copy">La navegación conserva la versión guardada. Al regresar se conserva lo hablado. 0 reinicia la escena; Recorrido permite reiniciar la sesión completa.</p>`);break;
  case 'export':showExport();break;case 'export-html':exportHTML();break;case 'export-project':exportProject();break;
  case 'import':$('#dialog').close();$('#import-file').click();break;
  case 'close-dialog':visualResources.stop();$('#dialog').close();break;
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
  if(el.hasAttribute('data-steps')&&s.study){const parsed=el.value.split('\n').filter(x=>x.trim()).map(x=>{const [a,...b]=x.split('|');return [a.trim().toLowerCase(),b.join('|').trim()];});if(parsed.every(p=>/^(t\d+|i\d+|p\d*|razon|practica|enlace|muro|m\d+|h\d+|cerrar)(\s+(t\d+|i\d+|p\d*|razon|practica|enlace|muro|m\d+|h\d+|cerrar))*$/.test(p[0]))){s.study.steps=parsed;steps[s.id]=0;markDirty();refreshStage();}return;}if(el.dataset.study&&s.study){s.study[el.dataset.study]=el.value;if(el.dataset.study==='sourceNote')delete s.study.sourceLabel;markDirty();refreshStage();return;}
  if(el.dataset.turn!==undefined&&s.study){const t=s.study.turns[Number(el.dataset.turn)];if(!t)return;t[el.dataset.turnField]=el.dataset.turnField==='items'?el.value.split('\n').filter(x=>x.trim()).map(x=>{const [a,...b]=x.split('|');return [a.trim(),b.join('|').trim()];}):el.value;markDirty();refreshStage();return;}
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
 document.addEventListener('keydown',e=>{if($('#dialog').open||e.target.matches('input,textarea,select,[contenteditable]')||e.metaKey||e.ctrlKey||e.altKey)return;if(['ArrowRight','PageDown'].includes(e.key)||(e.code==='Space'&&!e.shiftKey)){if(e.code==='Space'&&e.target.closest?.('button,summary'))return;e.preventDefault();if(!currentSlide().study&&currentSlide().layout==='decision'&&!revealed[current]){revealed[current]=true;refreshStage();}else advance(1);}if(['ArrowLeft','PageUp'].includes(e.key)||(e.code==='Space'&&e.shiftKey)){e.preventDefault();advance(-1);}if(e.key==='ArrowDown'){e.preventDefault();navigate(1);}if(e.key==='ArrowUp'){e.preventDefault();navigate(-1);}if(e.key==='Home'){e.preventDefault();current=deck().slides[0].id;revealed[current]=false;render();}if(e.key==='End'){e.preventDefault();current=deck().slides.at(-1).id;revealed[current]=false;render();}if(e.key.toLowerCase()==='f')action('fullscreen');if(e.key.toLowerCase()==='g'&&mode!=='prepare')action('prompter');if(e.key.toLowerCase()==='v'&&mode!=='prepare')openPresenter();if(e.key.toLowerCase()==='m')toggleMic();if(currentSlide().study&&/^[1-9]$/.test(e.key)){e.preventDefault();askTurn(Number(e.key)-1);}if(currentSlide().study&&e.key==='0'){e.preventDefault();action('reset-conversation');}});
 $('#app').addEventListener('pointerover',e=>Presence.listen(!!e.target.closest?.('[data-turn-event]')));
 // In Presentar the controls stay out of the way and return when the pointer moves.
 document.addEventListener('pointermove',()=>{if(mode!=='present')return;const app=$('#app');app.classList.add('chrome-on');clearTimeout(chromeTimer);chromeTimer=setTimeout(()=>app.classList.remove('chrome-on'),2600);});
 window.addEventListener('beforeunload',()=>{if(!BOOT.readOnly)persist();});
 function startOrbs(){
  globalThis.EntitySceneLab?.prepare($('#stage'));
  const profile=currentSlide().entity||{},zones=[...document.querySelectorAll('#stage .orb-zone'),...(globalThis.EntitySceneLab?.zones?.()||[])];
  zones.forEach(zone=>{zone.dataset.renderer=globalThis.ENTITY_RENDERER;zone.dataset.variant=profile.variant??globalThis.ENTITY_VARIANT;zone.dataset.ink=profile.ink??globalThis.ENTITY_INK;});
  Presence.mount(zones,{motion});globalThis.EntitySceneLab?.bind($('#stage'));
 }
 // Expose only a narrow read-only diagnostic surface for local verification.
 window.JerezPresentation={get mode(){return mode;},get slideId(){return current;},get step(){return steps[current]||0;},get thread(){return thread&&{...thread};},get sceneCount(){return deck().slides.length;},validateDeck};
 thread={id:current,k:0};
 render();
 if(storageError)toast(storageError);
 if(upgraded)toast('Edición actualizada: hilo de pasos y costumbres renovados. La versión anterior queda como copia local.');
})();

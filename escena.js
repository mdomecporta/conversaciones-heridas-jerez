// Escena: la presentación proyectada a partir del guion para María del Mar.
// Cada diapositiva se construye una vez y cada paso solo cambia su estado (data-*), así
// las transiciones son de CSS y la herida (lienzo WebGL de entity.js) nunca se congela.
(()=>{
const {guion:G,assets:A,institutional:INST}=ESCENA;
const R=ESCENA_RECURSOS;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const end=t=>/[.?!…»”]$/.test(t)?t:t+'.';
const words=t=>t.split(/\s+/).filter(Boolean).length;
const pad=n=>String(n).padStart(2,'0');
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const ROMAN=['','I','II','III','IV'];
const presenter=!(ESCENA.publico===true)&&new URLSearchParams(location.search).has('ponente');
const PUBLICO=ESCENA.publico===true;
if(PUBLICO)document.documentElement.classList.add('is-public');
const params=new URLSearchParams(location.search);
const guia=!PUBLICO&&params.has('guia'),notasView=!PUBLICO&&params.has('notas');
// ?espejo=0 refleja la diapositiva actual en la ventana de ponente; ?espejo=1, el paso siguiente, ya quieto.
const ESPEJO=params.has('espejo'),QUIETO=params.get('espejo')==='1';
if(ESPEJO)document.documentElement.classList.add('is-mirror');

// ───────────── Línea de tiempo ─────────────
// Cada actuación son tres pasos (A revisar, Nos preguntamos, Nos llevamos) y entre escena y escena hay una
// transición en la que la herida, en grande, abre la siguiente. La entrada de bloque hace de transición para la primera.
const slides=[];
slides.push({id:'apertura',type:'institutional',src:INST.open,steps:[{kind:'still',label:'Portada institucional'}]});
// En la apertura cada pantalla es un paso: lo que se dice después se queda en ella.
slides.push({id:'portada',type:'intro',steps:G.intro.steps.reduce((out,st)=>{
 const prev=out.at(-1);
 if(st.kind==='say'&&prev){for(const key of ['lines','spoken','develop','notes'])if(st[key])prev[key]=[...(prev[key]||[]),...st[key]];}
 else out.push({...st});
 return out;
},[])});
for(const b of G.blocks){
 slides.push({id:'bloque-'+b.n,type:'block',block:b,steps:[{kind:'title',label:'Entrada de bloque'},...(b.open?[{kind:'say',lines:[{who:'mdm',text:b.open}],spoken:[b.open]}]:[])]});
 b.scenes.forEach((n,i)=>{
  const s=G.scenes[n-1];
  if(s.kind==='practice'){
   // El «Para seguir» de la actuación anterior (también la del bloque anterior) da pie a la herida.
   const prev=G.scenes.find(x=>x.n===n-1),bridge=prev?.steps.find(x=>x.kind==='bridge');
   slides.push({id:'paso-'+n,type:'transition',scene:s,block:b,steps:[{kind:'transition',lines:[...(bridge?[{who:'mdm',text:bridge.lines[0].text}]:[]),openingLine(s)],spoken:bridge?.spoken}]});
  }
  slides.push({id:'escena-'+n,type:s.kind,scene:s,block:b,steps:expand(s)});
 });
 // La frase de cierre del bloque se dice al terminar su última actuación.
 const last=slides.at(-1);
 if(b.close&&last.type==='practice'){const st=last.steps.at(-1);st.lines=[...(st.lines||[]),{who:'mdm',text:b.close}];st.spoken=[...(st.spoken||[]),b.close];st.blockclose=b.close;}
}
slides.push({id:'cierre',type:'institutional',src:INST.close,steps:[{kind:'still',label:'Cierre institucional'}]});

// La primera frase de la herida en una actuación: abre la transición y encabeza la conversación de la escena.
function openingLine(s){return s.steps.find(x=>x.kind==='open')?.lines?.find(l=>l.who==='herida');}
function expand(s){
 if(s.kind==='practice'){
  // Agrupa los pasos del guion en tres: lo que traemos y revisamos; la pregunta y la evidencia; el aprendizaje.
  const group={open:'habit',resource:'habit',ask:'ask',evidence:'ask',reply:'ask',say:null,sala:null,take:'take'};
  const out=[{kind:'habit'},{kind:'ask'},{kind:'take'}];let cur=out[0];
  for(const st of s.steps){
   if(st.kind==='bridge')continue;
   const g=group[st.kind];if(g)cur=out.find(x=>x.kind===g);
   for(const key of ['lines','spoken','develop','notes'])if(st[key])cur[key]=[...(cur[key]||[]),...st[key]];
   if(st.close){cur.lines=[...(cur.lines||[]),{who:'mdm',text:st.close}];cur.close=st.close;}
   if(st.evidence)cur.evidence=st.evidence;
   if(st.kind==='sala'){cur.sala=st.sala;cur.after=st.after;}
  }
  return out;
 }
 // Regreso y cierre: cada pantalla es un paso y lo que se dice después se queda en ella. Lo que se dice
 // antes de la primera pantalla pasa a esa pantalla; en el cierre, el agradecimiento queda como último paso.
 const out=[],merge=(a,b)=>{for(const key of ['lines','spoken','develop','notes','recuerda','deeper'])if(b[key])a[key]=[...(a[key]||[]),...b[key]];if(b.sala){a.sala=b.sala;a.after=b.after;}return a;};
 let pending=null;
 s.steps.forEach((st,i)=>{
  const last=i===s.steps.length-1;
  if(st.kind==='say'&&!(s.kind==='farewell'&&last)){if(out.length)merge(out.at(-1),st);else pending=merge(pending||{},st);return;}
  // La pregunta a la sala tiene paso propio en el regreso; en el cierre acompaña a la pregunta final.
  if(st.kind==='sala'){if(s.kind==='farewell'&&out.length)merge(out.at(-1),st);else out.push({...st});return;}
  const start={...st};
  if(pending){for(const key of ['lines','spoken','develop','notes'])if(pending[key])start[key]=[...pending[key],...(st[key]||[])];pending=null;}
  if(st.what==='recopilación')ESCENA_RECOPILACION.forEach((range,j)=>out.push(j?{...st,kind:'page',page:j,lines:undefined,spoken:undefined,develop:undefined}:{...start,kind:'page',page:0}));
  else if(st.what==='lo que recogemos')out.push({...start,kind:'chips',part:ESCENA_REGRESO.length});
  else out.push(start);
 });
 return out;
}

// ───────────── Componentes ─────────────
const wordsHtml=(t,offset=0)=>end(t).split(/(\s+)/).map(w=>/^\s+$/.test(w)?w:`<span class="w" style="--i:${offset++}">${esc(w)}</span>`).join('');
// Un intercambio: frases en orden, con tiempos para escribirse y para que la herida «piense».
function exchange(lines,k,{size='',where=''}={}){
 if(!lines?.length)return '';
 let t=.15;const parts=[];
 lines.forEach((l,i)=>{
  const n=words(end(l.text));
  if(l.who==='herida'){
   const think=i===0?.75:.6;const t0=t+(i?.35:0);
   parts.push(`<div class="line herida" style="--think-at:${t0}s;--think:${think}s;--t0:${t0+think}s" data-words="${n}" data-at="${t0}" data-think="${think}"><span class="who"><i class="spark"></i>La herida</span><div class="bubble"><span class="think" aria-hidden="true"><i></i><i></i><i></i></span><span class="txt">${wordsHtml(l.text)}</span></div></div>`);
   t=t0+think+n*.06+.2;
  }else{
   const t0=t+(i?.45:0);
   parts.push(`<div class="line mdm" style="--t0:${t0}s"><span class="who"><i class="av">MM</i>María del Mar</span><div class="bubble"><span class="txt">${wordsHtml(l.text)}</span></div></div>`);
   t=t0+n*.045+.15;
  }
 });
 return `<div class="say ${size}" data-k="${k}" data-where="${where}">${parts.join('')}</div>`;
}
// La conversación de una actuación: todas sus frases, con el paso al que pertenecen; se ven las del paso actual
// y las anteriores (atenuadas), ya escritas, para que la ponente vea de un vistazo dónde está.
function chat(slide){return `<div class="chat">${slide.steps.map((st,k)=>exchange(st.lines,k)).join('')}</div>`;}
const asset=id=>A[id]||{};
function figure(id,{cls='',hot=null}={}){
 const a=asset(id);
 return `<figure class="fig ${cls}"><div class="fig-frame"><img src="${a.src}" alt="${esc(a.alt||a.title)}" draggable="false">${hot||''}<span class="spot" aria-hidden="true"></span></div><figcaption><span class="fig-label">${esc(a.label||'')}</span><span class="fig-credit">${esc(a.credit||'')}</span></figcaption></figure>`;
}
const fieldRow=(label,{part=1,state='empty',value=''}={})=>`<li class="field is-${state}" data-part="${part}"><span class="field-k">${esc(label)}</span><span class="field-v">${value?esc(value):'<i class="blank"></i>'}</span></li>`;

// Lo que trae la herida. Los elementos con data-part aparecen al llegar a ese avance.
function resource(n){
 const r=R[n];if(!r)return '';
 const head=(label,title)=>`<header class="res-head"><span class="res-from"><i class="spark"></i>La herida trae</span><span class="res-label">${esc(label)}</span>${title?`<h3 class="res-title">${esc(title)}</h3>`:''}</header>`;
 let body='';
 switch(r.type){
  case 'carro':
   // El carro 3D se coloca encima de la marca (ver Carro); la tarjeta dice qué trae la herida.
   return carroCard(r,n);
  case 'esquema':
   body=`<div class="scheme">${r.cols.map((c,i)=>`<div class="scheme-col ${c.empty?'is-empty':''}" data-part="${i+1}"><h4>${esc(c.head)}</h4><ul>${c.items?c.items.map(x=>`<li>${esc(x)}</li>`).join(''):Array.from({length:c.empty},()=>'<li class="blank-row"><i class="blank"></i></li>').join('')}</ul></div>${i<r.cols.length-1?`<div class="scheme-link" data-part="2"><span>${esc(r.link||'')}</span></div>`:''}`).join('')}</div>${r.side?`<div class="res-side" data-part="2">${figure(r.side.asset,{cls:'fig-mini'})}</div>`:''}`;
   break;
  case 'registro':
   body=`<ol class="log">${r.rows.map(([a,b],i)=>`<li data-part="1" style="--d:${i*.14}s"><span>${esc(a)}</span><b>${esc(b)}</b></li>`).join('')}</ol><div class="absence" data-part="2"><span>${esc(r.absence[0])}</span><b>${esc(r.absence[1])}</b></div>`;
   break;
  case 'huecos':
   body=`<div class="gaps"><div class="gaps-col" data-part="1"><h4>${esc(r.known.head)}</h4><ul>${r.known.items.map(x=>`<li class="known">${esc(x)}</li>`).join('')}</ul></div><div class="gaps-col is-missing" data-part="2"><h4>${esc(r.missing.head)}</h4><ul>${r.missing.items.map((x,i)=>`<li class="hole" style="--d:${i*.16}s">${esc(x)}</li>`).join('')}</ul></div></div>`;
   break;
  case 'imagen':{
   const a=asset(r.asset),walk=r.walk?a.walkthrough?.steps.filter(s=>s.x!=null)||[]:[];
   const hot=walk.map((s,i)=>`<span class="hot ${s.x>58?'flip':''}" data-part="${r.auto?1:i+1}" data-hot="${i}" style="--x:${s.x}%;--y:${s.y}%"><i></i><span class="hot-card"><b>${esc(s.title)}</b><small>${esc(s.text)}</small></span></span>`).join('');
   body=`<div class="res-image ${r.walk?'has-walk':''}" data-walk="${walk.length}" ${r.auto?'data-auto="1"':''}>${figure(r.asset,{hot})}${r.ask?`<p class="res-ask" data-part="${r.auto?1:2}">${esc(r.ask)}</p>`:''}${r.tag?`<p class="res-tag" data-part="${r.walk?1:2}">${esc(r.tag)}</p>`:''}</div>${r.open?`<div class="res-open" data-part="${r.parts}"><h4>${esc(r.open.head)}</h4><ul>${r.open.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}${r.then?`<div class="res-then" data-part="2"><h4>${esc(r.then.head)}</h4><ol>${r.then.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div>`:''}`;
   return `<div class="res res-imagen ${r.then?'has-then':''} ${r.open?'has-open':''}" data-type="imagen" data-n="${n}">${body}</div>`;
  }
  case 'comparar':
   body=`<div class="pair">${r.items.map((it,i)=>`<div class="pair-item" data-part="${i+1}">${figure(it.asset)}<p class="pair-tag">${esc(it.tag)}</p></div>`).join('')}</div>`;
   return `<div class="res res-comparar" data-type="comparar" data-n="${n}">${head(r.label)}${body}</div>`;
  case 'campos':
   body=`<ul class="fields">${r.fields.map((f,i)=>fieldRow(f).replace('data-part="1"',`data-part="1" style="--d:${i*.14}s"`)).join('')}</ul>${r.banner?`<p class="banner" data-part="2">${esc(r.banner)}</p><ol class="qs">${r.questions.map((q,i)=>`<li data-part="3" style="--d:${i*.18}s">${esc(q)}</li>`).join('')}</ol>`:''}`;
   break;
  case 'imagen-campos':
   body=`<div class="split">${figure(r.asset)}<div class="split-side">${r.title?`<h4>${esc(r.title)}</h4>`:''}${r.datum?`<p class="datum" data-part="1">${esc(r.datum)}</p>`:''}<ul class="fields">${r.fields.map((f,i)=>fieldRow(f,{part:2,state:r.datum?'pending':'empty'}).replace('data-part="2"',`data-part="2" style="--d:${i*.16}s"`)).join('')}</ul></div></div>`;
   return `<div class="res res-split" data-type="split" data-n="${n}">${body}</div>`;
  case 'informe':
   body=`<div class="report"><div class="report-doc" data-part="1"><span class="report-k">Resultado</span><p class="report-v">${esc(r.result)}</p><span class="report-lines"><i></i><i></i><i></i></span></div><ul class="fields" >${r.pending.map((f,i)=>fieldRow(f,{part:2,state:'pending'}).replace('data-part="2"',`data-part="2" style="--d:${i*.16}s"`)).join('')}</ul></div>`;
   break;
  case 'opciones':
   body=`${r.ask?`<p class="res-ask is-block" data-part="1">${esc(r.ask)}</p>`:''}<ul class="options">${r.items.map((x,i)=>`<li data-part="${r.ask?2:1}" style="--d:${i*.14}s">${esc(x)}</li>`).join('')}</ul>${r.supuesto?`<p class="supuesto" data-part="2"><span>Supuesto</span>${esc(r.supuesto)}</p>`:''}`;
   break;
  case 'pauta':
   body=`<ul class="fields">${r.fields.map(([f,done])=>fieldRow(f,{state:done?'done':'due'})).join('')}</ul><ol class="qs is-row">${r.questions.map((q,i)=>`<li data-part="2" style="--d:${i*.16}s">${esc(q)}</li>`).join('')}</ol>`;
   break;
  case 'momentos':
   body=`<ol class="moments">${r.items.map(([k,v],i)=>`<li data-part="1" style="--d:${i*.25}s" ${i===0?'class="is-first"':''}><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join('')}</ol>`;
   break;
  case 'imagen-lista':
   body=`<div class="split">${figure(r.asset)}<div class="split-side"><h4 data-part="2">${esc(r.head)}</h4><ul class="chips">${r.items.map((x,i)=>`<li data-part="2" style="--d:${i*.12}s">${esc(x)}</li>`).join('')}</ul><p class="res-note" data-part="2">${esc(r.note)}</p></div></div>`;
   return `<div class="res res-split" data-type="split" data-n="${n}">${body}</div>`;
  case 'relevo':
   body=`<ul class="fields is-grid">${r.fields.map((f,i)=>fieldRow(f).replace('data-part="1"',`data-part="1" style="--d:${i*.1}s"`)).join('')}</ul><div class="handover" data-part="2"><p>${esc(r.split[0])}</p><p class="is-alert">${esc(r.split[1])}</p></div>`;
   break;
 }
 return `<div class="res res-card ${r.calm?'is-calm':''}" data-type="${r.type}" data-n="${n}">${head(r.label,r.title)}${body}</div>`;
}
function carroCard(r,n){
 return `<div class="res res-carro" data-type="carro" data-n="${n}"><div class="carro-marca" data-carro></div><div class="res-carro-card"><header class="res-head"><span class="res-from"><i class="spark"></i>La herida trae</span><span class="res-label">${esc(r.label)}</span><h3 class="res-title">${esc(r.title)}</h3></header>${r.text?`<p class="res-carro-text">${esc(r.text)}</p>`:''}</div></div>`;
}
// Lo que queda del recurso mientras habla la evidencia.
function residue(n){
 const r=R[n];if(!r)return '';
 const id=r.asset||r.items?.[0]?.asset;
 if(r.thumb&&id){
  const second=r.type==='comparar'?r.items[1].asset:null;
  return `<div class="residue is-image">${second?`<span class="residue-pair"><img src="${asset(id).src}" alt=""><img src="${asset(second).src}" alt=""></span>`:`<img src="${asset(id).src}" alt="">`}<span>${esc(r.type==='comparar'?'Dos ejemplos publicados':asset(id).title)}</span></div>`;
 }
 return `<div class="residue"><i></i><span>${esc(r.title||asset(id).title||'Recurso')}</span></div>`;
}

function rail(slide){
 const sceneN=slide.scene?.n||0,blockN=slide.block?.n||0;
 return `<header class="rail"><div class="rail-where"><span class="rail-roman">${ROMAN[blockN]}</span><span class="rail-name">${esc(slide.block?.name||'')}</span></div><ol class="rail-track">${G.blocks.map(b=>`<li class="rail-group ${b.n===blockN?'is-now':''} ${b.n<blockN?'is-past':''}" data-q="${b.n}">${b.scenes.map(n=>`<i class="tick ${n<sceneN?'is-done':''} ${n===sceneN?'is-now':''}" title="${n}"></i>`).join('')}</li>`).join('')}</ol></header>`;
}
const side=(slide,inner)=>`<aside class="side">${rail(slide)}${inner}<footer class="side-foot">Conversaciones con una herida</footer></aside>`;
// La guía de partida: una marca por recomendación del DT XIV, agrupadas por apartado; se iluminan las que salen en la charla.
const RES=G.reserve.groups,RES_ITEMS=RES.flatMap(g=>g.items),RES_IN=RES_ITEMS.filter(x=>x.tag==='charla').length;
function dt14(){
 const marks=g=>g.items.map((x,i)=>`<i class="${x.tag==='charla'?'is-in':''}" style="--d:${i*.03}s"></i>`).join('');
 return `<div class="dt14"><span class="dt14-k">El punto de partida</span><h2 class="dt14-title">Qué no hacer en heridas crónicas</h2><p class="dt14-ref">GNEAUPP · Documento Técnico XIV · 2.ª ed. · 2020</p><p class="dt14-count"><b>${RES_ITEMS.length}</b> recomendaciones · <span><b>${RES_IN}</b> para cualquier cura</span></p><ol class="dt14-groups">${RES.map((g,i)=>`<li style="--g:${i}"><span class="dt14-name">${esc(g.name)}</span><span class="dt14-marks">${marks(g)}</span></li>`).join('')}</ol><div class="dt14-bring"><ol class="dt14-moments">${G.blocks.map(b=>`<li data-q="${b.n}"><b>${b.roman}</b>${esc(b.name)}</li>`).join('')}</ol><p class="dt14-kept"><i></i>Guardadas, por si preguntáis · ${RES_ITEMS.length-RES_IN}</p></div></div>`;
}
const strength=x=>`p. ${x.page} · fuerza ${x.strength.toLowerCase()}`;
const tagText=x=>x.tag==='charla'?`En la charla · escena ${pad(x.scene)}`:x.tag==='relacionada'?`Relacionada · escena ${pad(x.scene)}`:x.tag==='curiosidad'?'Curiosidad':'';
const anchors=places=>places.map(p=>`<i class="anchor" data-place="${p}" aria-hidden="true"></i>`).join('');
function threadHtml(s,{label=''}={}){
 // Al volver a una escena anterior, su hilo conserva el pigmento de su momento.
 return `<section class="thread" data-q="${s.block}"><div class="scene-head"><span class="scene-n">${label||'Escena '+pad(s.n)}</span><h2 class="scene-title">${esc(s.title)}</h2></div><ol class="hilo"><li class="node node-habit on"><i class="mark"></i><i class="seg"></i><span class="node-label">A revisar</span><p class="node-text"><span class="strike">${esc(s.habit)}</span></p></li><li class="node node-ask"><i class="mark"></i><i class="seg"></i><span class="node-label">Nos preguntamos</span><i class="ph"></i><p class="node-text">${esc(s.ask)}</p></li><li class="node node-take"><i class="mark"></i><span class="node-label">Nos llevamos</span><i class="ph"></i><p class="node-text">${esc(s.take)}</p></li></ol></section>`;
}

// ───────────── Diapositivas ─────────────
function build(slide){
 const el=document.createElement('article');
 el.className='slide slide-'+slide.type;el.dataset.id=slide.id;
 if(slide.block)el.dataset.q=slide.block.n;
 const says=slide.steps.map((st,k)=>exchange(st.lines,k)).join('');
 switch(slide.type){
  case 'institutional':
   el.innerHTML=`<img class="inst" src="${slide.src}" alt="">`;break;
  case 'intro':
   el.innerHTML=`<div class="cover"><p class="cover-meta">IV Jornadas Comisión Heridas Jerez · Mesa redonda</p><h1 class="cover-title">¿Es posible cicatrizar todas las heridas?</h1><div class="cover-foot"><p class="cover-sub">Qué no hacer en heridas crónicas</p><p class="cover-author">María del Mar Candil Ramón<span>19 de noviembre de 2026</span></p></div></div><div class="meet"><span class="meet-eyebrow">Antes de acercar el carro</span><h2 class="meet-title">Os presento a la herida</h2></div>${dt14()}<div class="intro-carro"><span class="intro-carro-k">El punto de partida</span><h2 class="intro-carro-title">Una visita de cura cualquiera</h2><div class="carro-marca" data-carro></div></div><div class="speech">${says}</div>${anchors(['intro'])}`;
   break;
  case 'block':{
   const b=slide.block;
   el.innerHTML=`<div class="block-numeral" aria-hidden="true">${b.roman}</div><div class="block-copy"><span class="block-eyebrow">Momento ${b.roman} de IV</span><h1 class="block-name">${esc(b.name)}</h1><p class="block-q">${esc(b.question)}</p></div><ol class="block-scenes">${b.scenes.map((n,i)=>`<li style="--d:${.5+i*.07}s"><span>${pad(n)}</span>${esc(G.scenes[n-1].title)}</li>`).join('')}</ol><div class="speech">${says}</div>${anchors(['block'])}`;
   break;
  }
  case 'practice':{
   // Tres pasos: el recurso (A revisar), la evidencia (Nos preguntamos) y el aprendizaje en el hilo (Nos llevamos).
   // A la derecha, la herida y la conversación de la escena, ya escrita, que crece paso a paso.
   const s=slide.scene,ev=slide.steps.find(x=>x.evidence)?.evidence||{};
   el.innerHTML=`${side(slide,threadHtml(s))}<section class="space"><div class="res-wrap">${resource(s.n)}</div><div class="evidence"><header class="ev-head"><span class="ev-eyebrow"><i class="ev-icon"></i>Evidencia científica</span><span class="ev-source">${esc(ev.source)}</span></header><h3 class="ev-title">${esc(ev.title)}</h3><p class="ev-idea">${esc(end(ev.idea||''))}</p>${ev.condition?`<div class="ev-cond"><span>Condición</span><p>${esc(end(ev.condition))}</p></div>`:''}<footer class="ev-foot">Síntesis del documento citado · no es cita literal</footer></div></section>${chat(slide)}${anchors(['talk'])}`;
   break;
  }
  case 'transition':{
   // Entre escena y escena: la herida, en grande, abre la siguiente.
   const s=slide.scene;
   el.innerHTML=`<div class="tr-head"><span class="tr-k">Escena ${pad(s.n)} · ${esc(slide.block.name)}</span><h2 class="tr-title">${esc(s.title)}</h2></div><div class="speech">${says}</div>${anchors(['big'])}`;
   break;
  }
  case 'return':{
   const s1=G.scenes[0];
   el.innerHTML=`${side(slide,`<div class="return-title"><span class="scene-n">Escena ${pad(slide.scene.n)}</span><h2 class="scene-title">${esc(slide.scene.title)}</h2></div>${threadHtml(s1,{label:'Volvemos a la escena 01'})}`)}<section class="space"><div class="res-wrap">${carroCard({label:'El carro de curas',title:'El carro sigue aquí',text:'El mismo material del principio. ¿Empezaríamos igual?'},slide.scene.n)}</div><div class="sala"><span class="sala-k">A la sala</span><p class="sala-q">${esc(slide.steps.find(x=>x.kind==='sala').sala)}</p><span class="sala-after">${esc(slide.steps.find(x=>x.kind==='sala').notes?.[0]||'')}</span></div><div class="gather"><span class="gather-k">Lo que recogemos</span><ol>${ESCENA_REGRESO.map((c,i)=>`<li data-part="${i+1}"><i></i>${esc(c)}</li>`).join('')}</ol></div></section><div class="speech">${says}</div>${anchors(['talk','dock','close'])}`;
   break;
  }
  case 'farewell':{
   // Cierre: recopilación (noche), para seguir profundizando, la pregunta de la mesa, la pregunta final y gracias.
   const scenes=G.scenes.filter(x=>x.kind==='practice');
   const pages=ESCENA_RECOPILACION.map(([a,z],i)=>{const rows=scenes.filter(x=>x.n>=a&&x.n<=z),bs=G.blocks.filter(b=>b.scenes.some(n=>n>=a&&n<=z));return `<div class="page" data-page="${i}" data-q="${bs[0].n}"><header class="page-head">${bs.map(b=>`<span class="page-block" data-q="${b.n}"><span class="rail-roman">${b.roman}</span><span>${esc(b.name)}</span></span>`).join('')}<span class="page-n">${i+1} / ${ESCENA_RECOPILACION.length}</span></header><div class="table"><div class="trow thead"><span></span><span>A revisar</span><span>Nos preguntamos</span><span>Nos llevamos</span></div>${rows.map((x,j)=>`<div class="trow" data-q="${x.block}" style="--d:${.08+j*.09}s"><span class="tn">${pad(x.n)}</span><span class="th"><s>${esc(x.habit)}</s></span><span class="ta">${esc(x.ask)}</span><span class="tt">${esc(x.take)}</span></div>`).join('')}</div></div>`;}).join('');
   const deeper=slide.steps.find(x=>x.deeper)?.deeper||[];
   const deep=`<div class="deeper"><section class="deeper-guide"><span class="deeper-k">Qué no hacer en heridas crónicas · GNEAUPP DT XIV</span><h3>${RES_ITEMS.length} recomendaciones; hoy, ${RES_IN}</h3><ol>${RES.map(g=>{const n=g.items.filter(x=>x.tag==='charla').length;return `<li><span class="deeper-n">${esc(g.n)}</span><span class="deeper-name">${esc(g.name)}</span><span class="deeper-marks">${g.items.map(x=>`<i class="${x.tag==='charla'?'is-in':''}"></i>`).join('')}</span><span class="deeper-c">${n?`${n} hoy · `:''}${g.items.length-n} en la reserva</span></li>`;}).join('')}</ol></section><section class="deeper-where"><span class="deeper-k">Dónde seguir</span><ol>${deeper.map(d=>`<li><b>${esc(d.name)}</b><span>${esc(end(d.text))}</span></li>`).join('')}</ol></section></div>`;
   const src=[...new Set(scenes.slice(-2).flatMap(x=>x.steps.find(y=>y.kind==='evidence').evidence.source.split(' / ')))].join(' · ');
   el.innerHTML=`<div class="night" aria-hidden="true"></div>${rail(slide)}<div class="recap-intro"><span class="scene-n">Escena ${pad(slide.scene.n)}</span><h2 class="recap-title">Lo que nos llevamos</h2><p class="recap-count"><b>${scenes.length}</b> actuaciones revisadas · <b>4</b> momentos de la visita</p><div class="recap-stitches" aria-hidden="true">${scenes.map((x,i)=>`<i style="--d:${.3+i*.06}s"></i>`).join('')}</div></div><div class="pages">${pages}</div>${deep}<div class="mesa"><span class="mesa-k">La pregunta de la mesa</span><h1 class="mesa-q">¿Es posible cicatrizar todas las heridas?</h1><p class="mesa-a">Valorar cada situación y acordar objetivos revisables.</p><p class="mesa-src">Escenas ${scenes.slice(-2).map(x=>x.n).join(' y ')} · ${esc(src)}</p></div><div class="final"><h1 class="final-q">En la próxima cura, ¿qué revisarías antes de repetir?</h1></div><div class="thanks"><p>Gracias por acompañarnos</p><span>María del Mar Candil Ramón · IV Jornadas Comisión Heridas Jerez</span><small>${esc(ESCENA_CARRO_CREDITO)}</small></div><div class="speech">${says}</div>${anchors(['talk','corner','close'])}`;
   break;
  }
 }
 return el;
}

// Estado de cada paso: qué plano ocupa el espacio, qué nodos del hilo se ven y dónde está la herida.
function view(slide,k){
 const v={plane:'',part:0,habit:'on',ask:false,take:false,place:'none',state:'idle',page:0};
 const steps=slide.steps;
 if(slide.type==='intro'){
  // Portada, la herida y, cuando trae el carro, la guía de la que partimos.
  const planes={'portada':'cover','presentación de la herida':'meet','la guía de partida':'guide','lo que traemos':'bring','el carro':'carro'};
  v.plane='cover';for(let i=0;i<=k;i++)if(steps[i].kind==='screen')v.plane=planes[steps[i].what]||v.plane;
  v.place=v.plane==='cover'?'none':'intro';return v;
 }
 if(slide.type==='block'){v.plane='block';v.place='block';return v;}
 if(slide.type==='institutional'){v.plane='inst';return v;}
 for(let i=0;i<=k;i++){
  const st=steps[i];
  switch(st.kind){
   case 'habit':v.plane='habit';v.place='talk';v.part=99;v.state='showing';break;
   case 'ask':v.plane='ask';v.ask=true;v.habit='struck';v.part=99;v.place='talk';v.state='listening';break;
   case 'take':v.plane='take';v.ask=true;v.habit='struck';v.take=true;v.part=99;v.place='talk';v.state='relief';break;
   case 'transition':v.plane='transition';v.place='big';v.state='responding';break;
   case 'open':v.plane='talk';v.place='talk';break;
   case 'resource':v.plane='resource';v.place='dock';v.part=st.part;v.state='showing';break;
   case 'sala':v.plane='sala';v.state='listening';if(slide.type==='farewell'){v.place='corner';}break;
   case 'evidence':v.plane='evidence';v.place='corner';v.state='listening';break;
   case 'reply':v.plane='evidence';v.place='corner';break;
   case 'bridge':v.plane='close';v.place='talk';v.state='idle';v.bridge=true;break;
   case 'blockclose':v.plane='blockclose';v.place='close';v.state='idle';break;
   case 'page':v.plane='pages';v.page=st.page;v.place='none';break;
   case 'chips':v.plane='gather';v.part=st.part;v.place='dock';break;
   case 'screen':
    if(st.what==='lo que recuperamos'){v.plane='resource';v.part=99;v.habit='struck';v.ask=true;v.take=true;v.place='dock';}
    if(st.what==='para seguir profundizando'){v.plane='deeper';v.place='corner';}
    if(st.what==='regreso a la pregunta de la mesa'){v.plane='mesa';v.place='corner';}
    if(st.what==='pregunta final'){v.plane='final';v.place='corner';v.state='idle';}
    break;
   case 'say':
    if(!v.plane){v.plane=slide.type==='farewell'?'recap':'talk';v.place='talk';}
    if(slide.type==='farewell'&&i===steps.length-1){v.plane='thanks';v.place='close';}
    break;
  }
 }
 if(slide.type==='return'&&v.plane!=='talk'){v.ask=true;v.take=true;v.habit='struck';}
 if(slide.type==='practice'&&v.plane==='take'&&slide.scene.n===8)v.state='idle';
 return v;
}

// ───────────── Estado y navegación ─────────────
let si=0,k=0,el=null,last=null;
const stage=$('#stage');
const herida=$('#herida'),zone=$('#herida .orb-zone');
const channel='BroadcastChannel' in window?new BroadcastChannel('herida-escena'):null;

// ───────────── El carro 3D ─────────────
// Un solo visor (carro/, en un iframe) que se crea la primera vez que hace falta y se coloca sobre la marca
// [data-carro] de la diapositiva. Solo dibuja mientras se ve. El modelo se mejora en carro/carro.js.
const Carro={
 el:null,frame:null,cargado:false,ultimo:'',
 want(slide,v){
  if(slide.type==='intro'&&v.plane==='carro')return {vista:'carro'};
  if(slide.type==='return'&&['resource','sala'].includes(v.plane))return {vista:'carro'};
  const r=slide.scene&&R[slide.scene.n];
  if(slide.type==='practice'&&r?.type==='carro'&&v.plane==='habit')return {ids:r.ids};
  return null;
 },
 send(m){if(this.cargado)this.frame.contentWindow.postMessage({carro:m},'*');},
 crear(){
  this.el=document.createElement('div');this.el.id='carro';this.el.setAttribute('aria-hidden','true');
  this.frame=document.createElement('iframe');this.frame.title='Carro de curas';this.frame.src=(PUBLICO?'../carro/':'carro/')+'?transparente';
  this.frame.addEventListener('load',()=>{this.cargado=true;this.ultimo='';this.colocar();});
  addEventListener('message',e=>{if(e.source===this.frame.contentWindow&&e.data?.carroFallo)stage.classList.add('sin-3d');});
  this.el.append(this.frame);stage.append(this.el);
 },
 colocar(slide=slides[si],v=view(slides[si],k)){
  const want=this.want(slide,v),marca=want&&$('[data-carro]',el);
  if(!want||!marca){if(this.el){this.el.classList.remove('is-on');clearTimeout(this.pausa);this.pausa=setTimeout(()=>this.send({activo:false}),900);this.ultimo='';}return;}
  if(!this.el)this.crear();
  clearTimeout(this.pausa);
  // La marca puede estar todavía entrando (con desplazamiento): se mide al llegar y otra vez cuando se asienta.
  const medir=()=>{const sr=stage.getBoundingClientRect(),r=marca.getBoundingClientRect();Object.assign(this.el.style,{left:(r.left-sr.left)/sr.width*100+'%',top:(r.top-sr.top)/sr.height*100+'%',width:r.width/sr.width*100+'%',height:r.height/sr.height*100+'%'});};
  medir();clearTimeout(this.ajuste);this.ajuste=setTimeout(medir,1000);
  this.el.classList.add('is-on');
  const clave=JSON.stringify(want);
  if(clave!==this.ultimo){this.send({activo:true});this.send(want);if(this.cargado)this.ultimo=clave;}
 }
};

function apply(dir=1,newSlide=false){
 const slide=slides[si],v=view(slide,k);
 el.dataset.plane=v.plane;el.dataset.k=k;el.dataset.habit=v.habit;el.dataset.ask=v.ask?'on':'';el.dataset.take=v.take?'on':'';el.dataset.page=v.page;
 el.dataset.focus=v.take?'take':v.ask&&['resource','sala'].includes(v.plane)&&slide.steps[k].kind!=='resource'?'ask':v.plane==='talk'||(v.plane==='resource'&&!v.ask)?'habit':'';
 el.classList.toggle('has-bridge',!!v.bridge);
 $('.node-ask',el)?.classList.toggle('on',v.ask);$('.node-take',el)?.classList.toggle('on',v.take);
 // Avances del recurso.
 $$('[data-part]',el).forEach(n=>{const p=Number(n.dataset.part);n.classList.toggle('shown',p<=v.part);n.classList.toggle('current',p===v.part);});
 const walk=$('.res-image.has-walk',el);
 if(walk)spot(walk,v);
 $$('.page',el).forEach(p=>p.classList.toggle('is-on',Number(p.dataset.page)===v.page&&v.plane==='pages'));
 // Intercambio actual: se escribe solo al avanzar; al retroceder aparece entero.
 const live=dir>0&&!reduced()&&!QUIETO;
 $$('.say',el).forEach(s=>{const on=Number(s.dataset.k)===k;s.classList.toggle('is-on',on);s.classList.toggle('live',on&&live);s.classList.toggle('static',on&&!live);});
 $$('.chat .say',el).forEach(s=>s.classList.toggle('is-past',Number(s.dataset.k)<k));
 const current=$(`.say[data-k="${k}"]`,el);
 const speech=current?.closest('.speech');if(speech)speech.dataset.plane=v.plane;
 place(v,dir,newSlide);
 Carro.colocar(slide,v);
 // La herida piensa y habla al ritmo de su frase.
 Presence.reset();
 zone.dataset.state=v.state;Presence.mount([zone],{motion:!reduced()});
 const h=current?.querySelector('.line.herida');
 if(h&&live)Presence.cue(v.state==='idle'?'responding':v.state,{delay:Number(h.dataset.at)*1000,think:Number(h.dataset.think)*1000,speak:Number(h.dataset.words)*60+400});
 document.documentElement.dataset.speaking=h?'1':'';
 hud();
 if(ESPEJO)return;
 location.replace('#'+slide.id+(k?'/'+(k+1):''));
 channel?.postMessage({si,k});
 Editor.follow();
}

// La herida no se desliza: se disuelve donde estaba y se condensa en su nuevo sitio.
let lastPlace=null,moveTimer=null;
function place(v,dir,newSlide){
 const target=v.place==='none'?null:$(`.anchor[data-place="${v.place}"]`,el);
 const sr=stage.getBoundingClientRect();
 const rectOf=a=>{const r=a.getBoundingClientRect();return {x:(r.left-sr.left)/sr.width*100,y:(r.top-sr.top)/sr.height*100,w:r.width/sr.width*100,h:r.height/sr.height*100};};
 const set=r=>{herida.style.left=r.x+'%';herida.style.top=r.y+'%';herida.style.width=r.w+'%';herida.style.height=r.h+'%';};
 const key=target?v.place+'@'+slides[si].id:null;
 clearTimeout(moveTimer);
 herida.getAnimations().forEach(a=>a.cancel());
 herida.dataset.place=v.place;
 if(!target){herida.classList.add('is-away');lastPlace=null;return;}
 const r=rectOf(target);
 const was=lastPlace;lastPlace=key;
 const wasAway=herida.classList.contains('is-away');
 herida.classList.remove('is-away');
 if(reduced()||QUIETO){set(r);return;}
 if(was===key){set(r);return;}
 const sameSize=was&&Math.abs(parseFloat(herida.style.width)-r.w)<.5;
 if(newSlide&&!wasAway&&was){
  // Cambio de escena: sale por un lado y entra por el contrario.
  const out=dir>0?-7:7;
  const gone=herida.animate([{transform:'translateX(0)',opacity:1,filter:'blur(0)'},{transform:`translateX(${out}cqw)`,opacity:0,filter:'blur(10px)'}],{duration:420,easing:'cubic-bezier(.55,0,.8,.2)',fill:'forwards'});
  moveTimer=setTimeout(()=>{gone.cancel();set(r);herida.animate([{transform:`translateX(${-out}cqw) scale(.94)`,opacity:0,filter:'blur(12px)'},{transform:'none',opacity:1,filter:'blur(0)'}],{duration:900,easing:'cubic-bezier(.22,1,.36,1)'});},520);
  return;
 }
 if(!was||wasAway){set(r);herida.animate([{opacity:0,transform:'scale(.82)',filter:'blur(16px)'},{opacity:1,transform:'none',filter:'blur(0)'}],{duration:1100,delay:200,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});return;}
 // Se diluye: se expande, se difumina y desaparece; reaparece condensándose.
 const gone=herida.animate([{opacity:1,transform:'none',filter:'blur(0)'},{opacity:0,transform:'scale(.94)',filter:'blur(12px)'}],{duration:260,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
 moveTimer=setTimeout(()=>{gone.cancel();set(r);herida.animate([{opacity:0,transform:'scale(.86)',filter:'blur(14px)'},{opacity:1,transform:'none',filter:'blur(0)'}],{duration:sameSize?700:850,delay:60,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});},280);
}

// Foco de la imagen: un claro que recorre las zonas señaladas.
let autoTimer=null;
function spot(walk,v){
 clearInterval(autoTimer);
 const hots=$$('.hot',walk),frame=$('.fig-frame',walk);
 const show=i=>{hots.forEach((h,j)=>h.classList.toggle('is-lit',j===i));const h=hots[i];if(h){frame.style.setProperty('--sx',h.style.getPropertyValue('--x'));frame.style.setProperty('--sy',h.style.getPropertyValue('--y'));frame.classList.add('is-spot');}else frame.classList.remove('is-spot');};
 if(!['resource','habit'].includes(v.plane)){show(-1);return;}
 if(walk.dataset.auto||v.plane==='habit'){
  if(v.plane==='resource'&&v.part!==1){show(-1);return;}
  let i=0;show(0);if(!reduced())autoTimer=setInterval(()=>{i=(i+1)%hots.length;show(i);},3200);
  return;
 }
 show(v.part<=hots.length?v.part-1:-1);
}

function go(nsi,nk,dir){
 nsi=Math.max(0,Math.min(slides.length-1,nsi));
 const steps=slides[nsi].steps.length;nk=nk<0?steps-1:Math.max(0,Math.min(steps-1,nk));
 const changed=nsi!==si||!el;
 const d=dir??(nsi>si||(nsi===si&&nk>k)?1:-1);
 si=nsi;k=nk;
 if(changed){
  const old=el;el=build(slides[si]);if(old)el.classList.add('is-entering');el.dataset.dir=d>0?'fwd':'back';
  stage.append(el);
  // La anterior se retira cuando la nueva ya la cubre del todo.
  $$('.slide.is-leaving',stage).forEach(n=>n.remove());
  if(old){old.classList.add('is-leaving');old.dataset.dir=d>0?'fwd':'back';setTimeout(()=>old.remove(),reduced()?0:1100);}
  const fresh=el;void fresh.offsetWidth;setTimeout(()=>fresh.classList.remove('is-entering'),30);
  stage.dataset.type=slides[si].type;
 }
 apply(d,changed);
}
const next=()=>{if(k<slides[si].steps.length-1)go(si,k+1,1);else if(si<slides.length-1)go(si+1,0,1);};
const prev=()=>{if(k>0)go(si,k-1,-1);else if(si>0)go(si-1,-1,-1);};

// ───────────── Controles ─────────────
function hud(){
 const s=slides[si];
 $('#hud-where').textContent=s.scene?`Escena ${pad(s.scene.n)} · ${s.scene.title}`:s.type==='block'?`Momento ${s.block.roman} · ${s.block.name}`:s.type==='intro'?'Apertura':s.id==='apertura'?'Portada':'Cierre';
 $('#hud-step').textContent=`${k+1} / ${s.steps.length}`;
 $('#hud-bar').style.setProperty('--p',(si+(k+1)/s.steps.length)/slides.length);
}
function overview(open){
 const o=$('#overview');
 if(open===undefined)open=o.hidden;
 o.hidden=!open;
 if(open){
  o.innerHTML=`<div class="ov-inner"><header><h2>Recorrido</h2><p>Elige una escena · Esc para volver</p></header><div class="ov-grid">${[{name:'Apertura',items:slides.filter(s=>['institutional','intro'].includes(s.type)&&s.id!=='cierre')},...G.blocks.map(b=>({name:`${b.roman} · ${b.name}`,q:b.n,items:slides.filter(s=>s.block?.n===b.n&&s.type!=='transition')})),{name:'Cierre',items:[slides.at(-1)]}].map(g=>`<section ${g.q?`data-q="${g.q}"`:''}><h3>${esc(g.name)}</h3><ol>${g.items.map(s=>`<li><button data-go="${slides.indexOf(s)}" class="${slides.indexOf(s)===si?'is-now':''}"><span>${s.scene?pad(s.scene.n):s.type==='block'?s.block.roman:'·'}</span>${esc(s.scene?.title||(s.type==='block'?'Entrada de bloque':s.type==='intro'?'Os presento a la herida':s.id==='apertura'?'Portada institucional':'Cierre institucional'))}</button></li>`).join('')}</ol></section>`).join('')}</div></div>`;
  $('[data-go].is-now',o)?.focus();
 }
}
// ───────────── Reserva (R) ─────────────
// Las 47 recomendaciones del DT XIV, por apartados, encima de la charla. No cambia el paso en el que estamos:
// al cerrarla (Esc o R) seguimos donde lo dejamos. La ventana de ponente la abre y la recorre por el canal.
const Reserva={
 open:false,g:0,el:null,
 item:x=>`<li class="rv-item ${x.tag?'is-'+x.tag:''}"><p>${esc(x.text)}</p><footer><span>${esc(strength(x))}</span>${tagText(x)?`<b>${esc(tagText(x))}</b>`:''}</footer></li>`,
 render(){
  if(!this.el){this.el=document.createElement('div');this.el.id='reserva';this.el.hidden=true;stage.append(this.el);
   this.el.addEventListener('click',e=>{const b=e.target.closest('[data-rv]');if(b)this.show(Number(b.dataset.rv));else if(e.target.closest('[data-rv-close]'))this.close();});}
  const g=RES[this.g];
  this.el.innerHTML=`<div class="rv"><header class="rv-head"><div><span class="rv-k">Reserva · ${esc(G.reserve.title)}</span><h2>Qué no hacer en heridas crónicas</h2><p>GNEAUPP · Documento Técnico XIV · 2.ª ed. · 2020 · ${RES_ITEMS.length} recomendaciones</p></div><button type="button" data-rv-close aria-label="Volver a la charla (Esc)">Volver a la charla</button></header><nav class="rv-tabs">${RES.map((x,i)=>`<button type="button" data-rv="${i}" class="${i===this.g?'is-on':''}"><b>${esc(x.n)}</b>${esc(x.name)}<span>${x.items.length}</span></button>`).join('')}</nav><section class="rv-group"><h3><b>${esc(g.n)}</b>${esc(g.name)} <span>pp. ${g.items[0].page}–${g.items.at(-1).page}</span></h3><ol class="rv-list ${g.items.length>8?'is-dense':''}">${g.items.map(this.item).join('')}</ol></section><footer class="rv-foot">← → apartado · 1–6 para saltar · Esc o R para volver a la charla · Síntesis de cada recomendación; el «¿Por qué no?» está en la página indicada</footer></div>`;
 },
 show(g=this.g){this.g=Math.max(0,Math.min(RES.length-1,g));this.render();this.open=true;this.el.hidden=false;this.sync();},
 close(){if(!this.open)return;this.open=false;this.el.hidden=true;this.sync();},
 toggle(){this.open?this.close():this.show();},
 move(d){this.show(this.g+d);},
 sync(){if(!ESPEJO)channel?.postMessage({reserva:{open:this.open,g:this.g}});},
 // Órdenes de la ventana de ponente o del teclado mientras está abierta.
 act(a){if(a==='toggle')this.toggle();else if(a==='close')this.close();else if(a==='next')this.move(1);else if(a==='prev')this.move(-1);else if(typeof a==='number')this.show(a);}
};
function reserveKey(e){
 const map={ArrowRight:'next',PageDown:'next',' ':'next',Enter:'next',ArrowDown:'next',ArrowLeft:'prev',PageUp:'prev',ArrowUp:'prev',Backspace:'prev',Escape:'close',r:'close',R:'close'};
 if(/^[1-6]$/.test(e.key)){e.preventDefault();Reserva.act(Number(e.key)-1);return;}
 if(map[e.key]){e.preventDefault();Reserva.act(map[e.key]);}
}
function fullscreen(){if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen?.();}
function openPresenter(){window.open(location.pathname+'?ponente'+location.hash,'ponente','width=1100,height=760');}

function key(e){
 if(e.metaKey||e.ctrlKey||e.altKey||e.target.closest?.('input,textarea,select'))return;
 const ov=!$('#overview').hidden;
 if(Reserva.open)return reserveKey(e);
 switch(e.key){
  case 'ArrowRight':case ' ':case 'PageDown':case 'Enter':if(ov&&e.key==='Enter')return;e.preventDefault();next();break;
  case 'ArrowLeft':case 'PageUp':case 'Backspace':e.preventDefault();prev();break;
  case 'ArrowDown':e.preventDefault();go(si+1,0,1);break;
  case 'ArrowUp':e.preventDefault();go(si-1,0,-1);break;
  case 'Home':go(0,0,-1);break;
  case 'End':go(slides.length-1,0,1);break;
  case 'g':case 'G':overview();break;
  case 'Escape':if(ov)overview(false);else Editor.close();break;
  case 'f':case 'F':fullscreen();break;
  case 'p':case 'P':if(!presenter&&!PUBLICO)openPresenter();break;
  case 'n':case 'N':if(!PUBLICO)Editor.toggle();break;
  case 'r':case 'R':overview(false);Editor.close();Reserva.show();break;
  default:return;
 }
}

// ───────────── Ventana de ponente ─────────────
// La diapositiva en vivo y el paso siguiente (dos espejos de la misma página), con lo que se dice ahora.
const slideTitle=s=>s.type==='transition'?`Transición · escena ${pad(s.scene.n)}`:s.scene?`Escena ${pad(s.scene.n)} · ${s.scene.title}`:s.type==='block'?`Momento ${s.block.roman} · ${s.block.name}`:s.type==='intro'?'Apertura · Os presento a la herida':s.id==='apertura'?'Portada institucional':'Cierre institucional';
const STEP_KIND={habit:'A revisar · lo que trae la herida',transition:'Transición · la herida abre la escena',open:'Apertura de escena',resource:'La herida trae su recurso',ask:'Nos preguntamos · la evidencia',sala:'A la sala',evidence:'Evidencia científica',reply:'Réplica',take:'Nos llevamos',bridge:'Para seguir',blockclose:'Cierre del momento',page:'Recopilación',chips:'Lo que recogemos',say:'Conversación',screen:'Pantalla',title:'Entrada del momento',still:'Pantalla institucional'};
const nextOf=(a,b)=>slides[a].steps[b+1]?[a,b+1]:slides[a+1]?[a+1,0]:[a,b];
// Tarjeta de la ponente para cada paso: la idea en grande, lo que se ve, la condición que no debe olvidarse,
// a qué reacciona de la herida y su pie. Lo que se desarrolla con sus palabras queda plegado.
const cap=t=>t.replace(/^./,c=>c.toUpperCase());
function cue(slide,st){
 const s=slide.scene,r=s&&R[s.n],out=[];
 const big=(k,t,cls='')=>out.push(`<section class="cu-big ${cls}"><b>${k}</b><p>${esc(end(t))}</p></section>`);
 const row=(k,t,cls='')=>out.push(`<section class="cu-row ${cls}"><b>${k}</b><p>${t}</p></section>`);
 // La conversación del paso, en orden: lo que dice la herida y el pie de la ponente.
 const talk=(st.lines||[]).filter(l=>l.text!==st.close&&l.text!==st.blockclose).map(l=>`<span class="cu-${l.who}"><i>${l.who==='herida'?'La herida':'Tú'}</i>«${esc(end(l.text))}»</span>`);
 if(slide.type==='practice'&&st.kind==='habit'){
  big('La idea',cap(s.purpose));
  row('Revisamos',`<s>${esc(s.habit)}</s>`);
  if(r)row('La herida trae',brings(s.n));
 }else if(slide.type==='practice'&&st.kind==='ask'){
  big('La pregunta',s.ask,'is-ask');
  const ev=st.evidence;
  if(ev)row('La evidencia',`<strong>${esc(ev.title)}.</strong> ${esc(end(ev.idea))} <span class="cu-src">${esc(ev.source)}</span>`);
  if(ev?.condition)row('No olvides',esc(end(ev.condition)),'is-cond');
 }else if(slide.type==='practice'&&st.kind==='take'){
  big('Nos llevamos',s.take,'is-take');
  if(st.close)row('Cierras',`«${esc(end(st.close))}»`);
  if(st.blockclose)row('Cierras el momento',`«${esc(end(st.blockclose))}»`);
 }else if(slide.type==='transition'){
  big('Presentas',`Escena ${pad(s.n)}: ${s.title}`);
  row('De qué va',esc(end(cap(s.purpose))));
 }else if(slide.type==='block'){
  big(`Momento ${slide.block.roman}`,slide.block.question);
 }else if(slide.type==='intro'&&INTRO_IDEA[st.what]){
  big(...INTRO_IDEA[st.what]);
 }
 if(st.sala)row('A la sala',esc(st.sala),'is-sala');
 if(talk.length)row('La conversación',talk.join(''),'is-talk');
 // Fuera de las actuaciones (apertura, regreso, cierre) se mantiene lo que se dice tal cual.
 if(!['practice','transition','block'].includes(slide.type)){
  const onScreen=new Set((st.lines||[]).map(l=>l.text));
  const extra=(st.spoken||[]).filter(t=>!onScreen.has(t)&&t!==st.sala);
  if(extra.length)row('Lo dices tú',extra.map(t=>`«${esc(end(t))}»`).join('<br>'));
 }
 if(st.develop?.length)out.push(`<details class="cu-more"><summary>Si quieres ampliar</summary>${st.develop.map(t=>`<p>${esc(cap(t))}</p>`).join('')}</details>`);
 return out.join('')||'<p class="pv-quiet">En este paso no dices nada: deja que se vea.</p>';
}
// La idea de cada pantalla de la apertura.
const INTRO_IDEA={'portada':['La pregunta de la mesa','¿Es posible cicatrizar todas las heridas? La miramos desde una visita de cura cualquiera'],'presentación de la herida':['Presentas a la herida','Un personaje que reúne historias docentes; no es un caso clínico'],'la guía de partida':['La guía de partida','Qué no hacer en heridas crónicas (GNEAUPP): 47 recomendaciones'],'lo que traemos':['Hoy',`Las ${RES_IN} que aparecen en cualquier cura, en los cuatro momentos de la visita; el resto, en la reserva`],'el carro':['El punto de partida','Una visita de cura cualquiera, con el carro preparado']};
// Lo siguiente, en una línea.
function cueNext(slide,st){
 const s=slide.scene;
 if(slide.type==='practice')return st.kind==='habit'?`Escena ${pad(s.n)} · A revisar: «${esc(s.habit)}»`:st.kind==='ask'?`Nos preguntamos: «${esc(s.ask)}»`:`Nos llevamos: «${esc(s.take)}»`;
 if(slide.type==='transition')return `Escena ${pad(s.n)} · ${esc(s.title)}`;
 if(slide.type==='block')return `Momento ${slide.block.roman} · ${esc(slide.block.name)}`;
 const l=(st.lines||[])[0];
 return l?`${l.who==='herida'?'La herida':'Tú'}: «${esc(end(l.text))}»`:esc(STEP_KIND[st.kind]||slideTitle(slide));
}
// Ritmo: minutos previstos por diapositiva, escalados a 25 minutos y repartidos entre sus pasos.
const PESO={institutional:.25,intro:2.5,block:.4,transition:.3,practice:1.5,return:1.5,farewell:3};
const DURACION=25;
const previsto=(()=>{
 const w=slides.map(x=>x.id==='cierre'?0:PESO[x.type]||.5),total=w.reduce((a,b)=>a+b,0),f=DURACION*60/total;
 let t=0;return slides.map((x,i)=>{const start=t;t+=w[i]*f;return x.steps.map((_,j)=>start+w[i]*f*j/x.steps.length);});
})();
const mmss=t=>`${pad(Math.floor(Math.abs(t)/60))}:${pad(Math.floor(Math.abs(t)%60))}`;
const presenterReserve={open:false,g:0};
function presenterView(){
 document.documentElement.classList.add('is-presenter');
 const hash=location.hash;
 $('#presenter').innerHTML=`<div class="pv"><header class="pv-head"><div><span class="pv-kicker" id="pv-where"></span><h1 id="pv-kind"></h1></div><button class="pv-clock" id="pv-clock" type="button" title="Pulsa (o T) para poner el reloj a cero"><b id="pv-timer">00:00</b><span id="pv-pace"></span><span id="pv-step"></span></button></header><main class="pv-grid"><section class="pv-card" id="pv-now"></section><aside class="pv-side"><h2>En pantalla</h2><div class="pv-frame"><iframe title="Diapositiva actual" src="?espejo=0${hash}"></iframe></div><h2>Siguiente</h2><div class="pv-frame is-small"><iframe title="Paso siguiente" src="?espejo=1${hash}"></iframe></div><p class="pv-next" id="pv-next"></p><p class="pv-support" id="pv-support"></p></aside></main><footer class="pv-keys">→ avanzar · ← retroceder · ↑ ↓ escena · R reserva (← → apartado, Esc volver) · T reloj a cero · las dos ventanas avanzan juntas</footer></div>`;
 let started=Date.now();
 const tick=()=>{const t=(Date.now()-started)/1000,plan=previsto[si]?.[k]??0,d=t-plan;$('#pv-timer').textContent=mmss(t);
  const pace=$('#pv-pace');pace.textContent=`previsto ${mmss(plan)} · ${Math.abs(d)<45?'a tiempo':d>0?`vas ${mmss(d)} tarde`:`vas ${mmss(d)} antes`}`;pace.dataset.state=Math.abs(d)<45?'ok':d>0?'late':'early';};
 const reset=()=>{started=Date.now();tick();};
 $('#pv-clock').addEventListener('click',reset);
 document.addEventListener('keydown',e=>{if((e.key==='t'||e.key==='T')&&!e.target.closest?.('input,textarea'))reset();});
 setInterval(tick,1000);
 return ()=>{
  const s=slides[si],st=s.steps[k],[na,nb]=nextOf(si,k),ns=slides[na],nst=ns.steps[nb];
  $('#pv-where').textContent=slideTitle(s);
  $('#pv-kind').textContent=(s.type==='practice'?`Paso ${k+1} de 3 · `:'')+(st.kind==='screen'&&st.what?cap(st.what):STEP_KIND[st.kind]||'')+(st.kind==='page'?` · página ${st.page+1} de ${ESCENA_RECOPILACION.length}`:'');
  $('#pv-step').textContent=`paso ${k+1} de ${s.steps.length}`;
  $('#pv-now').innerHTML=cue(s,st);
  $('#pv-next').innerHTML=na===si&&nb===k?'Fin.':cueNext(ns,nst);
  $('#pv-support').innerHTML=s.scene?.support?`<b>Respaldo</b> ${esc(s.scene.support)}`:'';
  tick();
  document.documentElement.classList.toggle('is-reserve',presenterReserve.open);
  if(presenterReserve.open){
   const g=RES[presenterReserve.g];
   $('#pv-kind').textContent=`Reserva abierta · ${g.n} ${g.name}`;
   $('#pv-now').innerHTML=`<p class="pv-quiet">En la pantalla está la reserva. Esc vuelve a la charla, en este mismo paso.</p>${g.items.map(x=>`<section class="cu-row"><b>${esc(strength(x))}${tagText(x)?' · '+esc(tagText(x)):''}</b><p>${esc(x.text)}</p></section>`).join('')}`;
  }
 };
}

// ───────────── Notas de preparación ─────────────
// Por escena y sección, con imágenes adjuntas. Se guardan en Netlify (/api/notas) tras entrar con la
// contraseña; en local sin servidor o en el enlace público no hay notas y el cuadro lo explica.
const SECCIONES=[['hilo','La pregunta y el hilo'],['herida','Conversación con la herida'],['recursos','Imágenes y recursos'],['evidencia','Evidencia'],['otros','Otros']];
const seccion=id=>SECCIONES.find(x=>x[0]===id)?.[1]||'Otros';
// Hasta el recorte a 13 escenas (1 de noviembre de 2026) las notas y los cambios se guardaban con la numeración
// de 24 escenas: no se cuelgan de las diapositivas actuales y ?notas los muestra aparte para pasarlos al guion.
const RECORTE=Date.parse('2026-11-01T19:15:00+01:00');
const antiguo=x=>Date.parse(x.date)<RECORTE;
const store={get:k=>{try{return localStorage.getItem(k)||'';}catch{return '';}},set:(k,v)=>{try{localStorage.setItem(k,v);}catch{}}};
const api=async (url,opts={})=>{const r=await fetch(url,{credentials:'same-origin',...opts,headers:{accept:'application/json',...(opts.headers||{})}});const data=/json/.test(r.headers.get('content-type')||'')?await r.json():null;if(!r.ok||!data)throw Error(data?.error||'No se ha podido conectar.');return data;};
const Notas={
 ok:null,list:[],listeners:new Set(),
 notify(){this.listeners.forEach(f=>f());},
 async load(){
  if(PUBLICO){this.ok=false;return this.list;}
  try{this.list=await api('/api/notas');this.ok=true;}catch{this.ok=false;}
  this.notify();return this.list;
 },
 async upload(file){
  const blob=await shrink(file);
  return api('/api/adjuntos',{method:'POST',headers:{'content-type':blob.type,'x-nombre':encodeURIComponent(file.name)},body:blob});
 },
 async add(note){const data=await api('/api/notas',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(note)});this.list.push(data);this.notify();return data;},
 async remove(id){await api('/api/notas?id='+encodeURIComponent(id),{method:'DELETE'});this.list=this.list.filter(n=>n.id!==id);this.notify();},
 of:slide=>Notas.list.filter(n=>n.slide===slide&&!antiguo(n))
};
// Las fotos grandes se reducen antes de subir (lado mayor de 2400 px), para que quepan y carguen rápido.
async function shrink(file){
 if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size<1.5e6)return file;
 try{
  const img=await createImageBitmap(file),f=Math.min(1,2400/Math.max(img.width,img.height));
  const c=document.createElement('canvas');c.width=Math.round(img.width*f);c.height=Math.round(img.height*f);c.getContext('2d').drawImage(img,0,0,c.width,c.height);
  return await new Promise(r=>c.toBlob(b=>r(b||file),'image/jpeg',.86));
 }catch{return file;}
}
const when=d=>new Date(d).toLocaleString('es-ES',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
function noteItem(n){
 return `<li class="note" data-id="${esc(n.id)}"><header><span class="note-sec s-${esc(n.section)}">${esc(seccion(n.section))}</span>${n.step!=null?`<span class="note-step">paso ${n.step+1}</span>`:''}<span class="note-who">${esc(n.author)} · ${esc(when(n.date))}</span><button class="note-del" data-del="${esc(n.id)}" title="Borrar nota" aria-label="Borrar nota">×</button></header>${n.text?`<p>${esc(n.text).replace(/\n/g,'<br>')}</p>`:''}${n.files?.length?`<div class="note-files">${n.files.map(f=>`<a href="/api/adjuntos?id=${esc(f.id)}" target="_blank" rel="noopener"><img src="/api/adjuntos?id=${esc(f.id)}" alt="${esc(f.name)}" loading="lazy"></a>`).join('')}</div>`:''}</li>`;
}
function noteBox(slide,step){
 return `<section class="notes" data-slide="${esc(slide.id)}" data-step="${step}"><form class="notes-form"><div class="notes-secs" role="radiogroup" aria-label="Sobre qué es la nota">${SECCIONES.map(([v,l],i)=>`<label><input type="radio" name="section" value="${v}" ${i===0?'checked':''}><span>${esc(l)}</span></label>`).join('')}</div><textarea name="text" rows="4" placeholder="Qué cambiarías aquí: la pregunta, lo que dice la herida, una imagen, la evidencia…"></textarea><div class="notes-row"><label class="notes-file"><input type="file" name="files" accept="image/jpeg,image/png,image/webp,image/gif" multiple><span>Adjuntar imágenes</span></label><button type="submit">Guardar nota</button></div><p class="notes-status" role="status"></p></form><header class="notes-head"><h3>Notas de esta escena</h3><span class="notes-count"></span></header><ol class="notes-list"></ol></section>`;
}
function bindNotes(root){
 const paint=()=>{
  root.querySelectorAll('.notes').forEach(box=>{
   const list=Notas.of(box.dataset.slide).slice().reverse();
   box.querySelector('.notes-list').innerHTML=list.map(noteItem).join('');
   box.querySelector('.notes-count').textContent=list.length?`${list.length}`:'ninguna todavía';
   box.classList.toggle('is-off',Notas.ok===false);
   if(Notas.ok===false)box.querySelector('.notes-status').textContent='Las notas se guardan en la versión publicada, después de entrar con la contraseña.';
  });
 };
 Notas.listeners.add(paint);paint();
 root.addEventListener('change',e=>{
  if(e.target.matches('.ed-author'))store.set('herida-autor',e.target.value.trim());
  if(e.target.matches('.notes-file input')){const n=e.target.files.length;e.target.nextElementSibling.textContent=n?`${n} ${n===1?'imagen':'imágenes'}`:'Adjuntar imágenes';}
 });
 root.addEventListener('click',async e=>{
  const del=e.target.closest('[data-del]');if(!del)return;
  if(!confirm('¿Borrar esta nota? No se puede deshacer.'))return;
  try{await Notas.remove(del.dataset.del);}catch(err){alert(err.message);}
 });
 root.addEventListener('submit',async e=>{
  const form=e.target.closest('.notes-form');if(!form)return;e.preventDefault();
  const box=form.closest('.notes'),status=form.querySelector('.notes-status'),button=form.querySelector('button');
  if(Notas.ok===false)return;
  const text=form.text.value.trim(),picked=[...form.files.files];
  if(!text&&!picked.length){status.textContent='Escribe algo o adjunta una imagen.';return;}
  button.disabled=true;status.textContent=picked.length?'Subiendo imágenes…':'Guardando…';
  try{
   const files=[];for(const f of picked)files.push(await Notas.upload(f));
   await Notas.add({slide:box.dataset.slide,step:Number(box.dataset.step),section:form.section.value,text,author:author(),files});
   form.text.value='';form.files.value='';form.querySelector('.notes-file span').textContent='Adjuntar imágenes';status.textContent='Guardada. Puedes seguir o cerrar.';
  }catch(err){status.textContent=err.message;}
  button.disabled=false;
 });
}
const author=()=>$('.ed-author')?.value.trim()||store.get('herida-autor');

// ───────────── Cambios de texto ─────────────
// Correcciones puntuales sin esperar a recompilar: se guardan como «original → nuevo» y se aplican al
// cargar, también en /ver/. El guion sigue siendo la fuente: los cambios se recogen en ?notas y se pasan a él.
const Textos={
 list:[],ok:false,
 async load(){
  try{this.list=await api('/api/textos');this.ok=true;}catch{this.list=[];this.ok=false;}
  this.list.filter(t=>!antiguo(t)).forEach(t=>swap(t.slide,t.original,t.text));
  return this.list;
 },
 origin(slide,text){return this.list.find(t=>t.slide===slide&&t.text===text&&!antiguo(t))?.original??text;},
 changed(slide,text){return this.list.some(t=>t.slide===slide&&t.text===text&&!antiguo(t));},
 async save(slide,current,text){
  const original=this.origin(slide,current);
  const data=await api('/api/textos',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({slide,original,text,author:author()})});
  this.list=this.list.filter(t=>!(t.slide===slide&&t.original===original));
  if(!data.removed)this.list.push(data);
  swap(slide,current,data.removed?original:text);
 }
};
// Sustituye un texto exacto en los datos de una diapositiva (escena, pasos, momento y su recurso).
function swap(slideId,from,to){
 const slide=slides.find(x=>x.id===slideId);if(!slide||from===to)return;
 const seen=new Set();
 const walk=o=>{
  if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);
  for(const key of Object.keys(o)){if(key==='src'||key==='walkthrough')continue;const v=o[key];if(typeof v==='string'){if(v===from)o[key]=to;}else walk(v);}
 };
 walk(slide.scene);walk(slide.steps);walk(slide.block);if(slide.scene)walk(R[slide.scene.n]);
}
// Rehace la diapositiva actual con los textos nuevos, sin animación.
function refresh(){if(!el)return;const old=el;el=build(slides[si]);old.replaceWith(el);apply(0,false);}
// Los textos que se ven en este paso y se pueden corregir.
function editable(slide,k){
 const s=slide.scene,st=slide.steps[k],v=view(slide,k),out=[];
 const add=(label,text)=>{if(text&&!out.some(f=>f.text===text))out.push({label,text});};
 if(s?.habit){add('A revisar',s.habit);if(v.ask)add('Nos preguntamos',s.ask);if(v.take)add('Nos llevamos',s.take);}
 if(slide.type==='block'){add('Nombre del momento',slide.block.name);add('Pregunta del momento',slide.block.question);}
 (st.lines||[]).forEach(l=>add(l.who==='herida'?'Lo que dice la herida':'Lo que dice María del Mar',l.text));
 if(st.kind==='sala')add('Pregunta a la sala',st.sala);
 if(['evidence','ask','take'].includes(v.plane)&&slide.type==='practice'){const ev=slide.steps.find(x=>x.evidence).evidence;add('Evidencia · titular',ev.title);add('Evidencia · idea',ev.idea);add('Evidencia · condición',ev.condition);}
 if(st.kind==='habit'&&R[s?.n]?.title)add('Título de lo que trae la herida',R[s.n].title);
 return out;
}

// ───────────── Panel flotante de preparación ─────────────
// Sobre la diapositiva, se abre con N o con el botón «Notas» y se cierra con Esc: una nota sobre lo que
// se está viendo, o un cambio de texto que se aplica al momento.
const Editor={
 el:null,open:false,tab:'nota',slide:null,
 mount(){
  if(PUBLICO||ESPEJO)return;
  const fab=document.createElement('button');fab.id='ed-fab';fab.type='button';fab.innerHTML='<i></i><span>Notas</span><b></b>';fab.title='Notas y cambios (N)';
  fab.addEventListener('click',()=>this.toggle());document.body.append(fab);
  this.el=document.createElement('aside');this.el.id='editor';this.el.hidden=true;this.el.setAttribute('aria-label','Notas y cambios de esta diapositiva');
  this.el.innerHTML=`<header class="ed-head"><div><span class="ed-k">Preparar</span><h2 class="ed-title"></h2><p class="ed-step"></p></div><button class="ed-close" type="button" aria-label="Cerrar (Esc)">×</button></header><nav class="ed-tabs"><button type="button" data-tab="nota">Nota</button><button type="button" data-tab="textos">Cambiar textos</button></nav><div class="ed-body"></div><footer class="ed-foot"><input class="ed-author" placeholder="Tu nombre" autocomplete="name" aria-label="Tu nombre"><a href="?notas" target="_blank">Ver todas las notas y cambios</a></footer>`;
  document.body.append(this.el);
  this.el.querySelector('.ed-author').value=store.get('herida-autor');
  this.el.querySelector('.ed-close').addEventListener('click',()=>this.close());
  this.el.querySelector('.ed-tabs').addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(t){this.tab=t.dataset.tab;this.render(true);}});
  this.el.addEventListener('click',e=>this.textClick(e));
  bindNotes(this.el);
  Notas.listeners.add(()=>this.count());
  Notas.load();
 },
 toggle(){this.open?this.close():this.show();},
 show(){if(!this.el)return;this.open=true;this.el.hidden=false;document.body.classList.add('is-editing');this.render(true);setTimeout(()=>this.el.querySelector('textarea')?.focus(),60);},
 close(){if(!this.el||!this.open)return;this.open=false;this.el.hidden=true;document.body.classList.remove('is-editing');},
 count(){const b=$('#ed-fab b');if(b){const n=Notas.of(slides[si]?.id).length;b.textContent=n||'';}},
 // Al avanzar con el panel abierto, sigue a la diapositiva sin perder lo que se está escribiendo.
 follow(){this.count();if(!this.open)return;const s=slides[si];const draft=this.el.querySelector('.notes textarea')?.value||this.el.querySelector('.ed-field.is-dirty');if(this.slide===s.id&&draft){this.header();const box=this.el.querySelector('.notes');if(box)box.dataset.step=k;return;}this.render(this.slide!==s.id);},
 header(){const s=slides[si];this.el.querySelector('.ed-title').textContent=slideTitle(s);this.el.querySelector('.ed-step').textContent=`Paso ${k+1} de ${s.steps.length} · ${STEP_KIND[s.steps[k].kind]||''}`;this.el.querySelectorAll('.ed-tabs button').forEach(b=>b.classList.toggle('is-on',b.dataset.tab===this.tab));},
 render(){
  const s=slides[si];this.slide=s.id;this.header();
  const body=this.el.querySelector('.ed-body');
  if(this.tab==='nota'){body.innerHTML=noteBox(s,k);Notas.notify();return;}
  const fields=editable(s,k);
  body.innerHTML=Notas.ok===false&&!Textos.ok?'<p class="ed-off">Los cambios de texto se guardan en la versión publicada, después de entrar con la contraseña.</p>':fields.length?`<p class="ed-hint">Corrige palabras o frases de lo que se ve en este paso. El cambio se aplica al momento en la presentación y queda anotado para pasarlo al guion.</p>${fields.map((f,i)=>`<div class="ed-field ${Textos.changed(s.id,f.text)?'is-changed':''}" data-i="${i}"><label for="ed-t${i}">${esc(f.label)}${Textos.changed(s.id,f.text)?'<span>cambiado</span>':''}</label><textarea id="ed-t${i}" rows="${Math.min(5,Math.ceil(f.text.length/46)+1)}">${esc(f.text)}</textarea><div class="ed-row"><button type="button" data-save>Guardar cambio</button>${Textos.changed(s.id,f.text)?'<button type="button" data-revert class="is-quiet">Volver al original</button>':''}<small class="ed-status"></small></div></div>`).join('')}`:'<p class="ed-off">En este paso no hay textos que cambiar.</p>';
  body.dataset.fields=JSON.stringify(fields.map(f=>f.text));
  body.querySelectorAll('.ed-field textarea').forEach(t=>t.addEventListener('input',()=>t.closest('.ed-field').classList.add('is-dirty')));
 },
 async textClick(e){
  const btn=e.target.closest('[data-save],[data-revert]');if(!btn)return;
  const field=btn.closest('.ed-field'),status=field.querySelector('.ed-status');
  const current=JSON.parse(this.el.querySelector('.ed-body').dataset.fields)[Number(field.dataset.i)];
  const s=slides[si],text=btn.matches('[data-revert]')?Textos.origin(s.id,current):field.querySelector('textarea').value.trim();
  if(!text){status.textContent='El texto no puede quedar vacío.';return;}
  if(text===current){status.textContent='No hay cambios.';return;}
  btn.disabled=true;status.textContent='Guardando…';
  try{await Textos.save(s.id,current,text);refresh();this.render();}catch(err){status.textContent=err.message;btn.disabled=false;}
 }
};

// ───────────── Notas y cambios juntos (?notas) ─────────────
function notesView(){
 document.documentElement.classList.add('is-guide');
 const render=()=>{
  const groups=slides.map(s=>({s,list:Notas.of(s.id),texts:Textos.list.filter(t=>t.slide===s.id&&!antiguo(t))})).filter(g=>g.list.length||g.texts.length);
  const oldIds=[...new Set([...Notas.list,...Textos.list].filter(antiguo).map(x=>x.slide))];
  const old=oldIds.map(id=>({id,label:/^escena-\d+$/.test(id)?`Escena ${pad(id.split('-')[1])} de la numeración anterior (24 escenas)`:id,list:Notas.list.filter(n=>n.slide===id&&antiguo(n)),texts:Textos.list.filter(t=>t.slide===id&&antiguo(t))}));
  const total=Notas.list.length,changes=Textos.list.length;
  $('#guia').innerHTML=`<article class="g g-notes"><header class="g-top"><span class="g-kicker">Conversaciones con una herida</span><h1>Notas y cambios</h1><p>${Notas.ok===false?'Las notas solo están disponibles en la versión publicada, después de entrar con la contraseña.':total||changes?`${total} ${total===1?'nota':'notas'} y ${changes} ${changes===1?'cambio de texto':'cambios de texto'}, por orden del recorrido.`:'Todavía no hay notas ni cambios.'}</p><p class="g-actions"><a href="./">Abrir la presentación</a><a href="?guia">Abrir la guía</a>${total||changes?'<button data-export>Descargar todo (.md)</button>':''}</p></header>${groups.map(({s,list,texts})=>`<section class="g-sec"><header><span class="g-kicker">${esc(s.block?`Momento ${s.block.roman}`:'Apertura y cierre')}</span><h2><a href="./#${esc(s.id)}">${esc(slideTitle(s))}</a></h2></header>${texts.length?`<h3 class="g-h3">Cambios de texto</h3><ol class="changes">${texts.map(t=>`<li><del>${esc(t.original)}</del><ins>${esc(t.text)}</ins><small>${esc(t.author)} · ${esc(when(t.date))}</small></li>`).join('')}</ol>`:''}${SECCIONES.map(([v,l])=>{const xs=list.filter(n=>n.section===v);return xs.length?`<h3 class="g-h3">${esc(l)}</h3><ol class="notes-list">${xs.map(noteItem).join('')}</ol>`:'';}).join('')}</section>`).join('')}${old.length?`<section class="g-sec"><header><span class="g-kicker">Antes del recorte a 13 escenas</span><h2>Notas y cambios de la edición anterior</h2></header><p class="g-note">Se guardaron con la numeración de 24 escenas y ya no se aplican a la presentación. Revísalos y pasa al guion lo que siga valiendo.</p>${old.map(o=>`<h3 class="g-h3">${esc(o.label)}</h3>${o.texts.length?`<ol class="changes">${o.texts.map(t=>`<li><del>${esc(t.original)}</del><ins>${esc(t.text)}</ins><small>${esc(t.author)} · ${esc(when(t.date))}</small></li>`).join('')}</ol>`:''}${o.list.length?`<ol class="notes-list">${o.list.map(noteItem).join('')}</ol>`:''}`).join('')}</section>`:''}</article>`;
 };
 Notas.listeners.add(render);render();
 $('#guia').addEventListener('click',async e=>{
  if(e.target.closest('[data-export]')){
   const oldMd=[...Notas.list,...Textos.list].filter(antiguo).map(x=>`- ${x.slide} (numeración de 24 escenas) · ${x.original?`«${x.original}» → «${x.text}»`:x.text.replace(/\n/g,' ')} (${x.author}, ${when(x.date)})`).join('\n');
   const md='# Notas y cambios · Conversaciones con una herida\n\n'+(oldMd?`## Antes del recorte a 13 escenas\n\n${oldMd}\n\n`:'')+slides.map(s=>({s,list:Notas.of(s.id),texts:Textos.list.filter(t=>t.slide===s.id&&!antiguo(t))})).filter(g=>g.list.length||g.texts.length).map(({s,list,texts})=>`## ${slideTitle(s)}\n\n`+(texts.length?'### Cambios de texto\n\n'+texts.map(t=>`- «${t.original}» → «${t.text}» (${t.author}, ${when(t.date)})`).join('\n')+'\n\n':'')+SECCIONES.map(([v,l])=>{const xs=list.filter(n=>n.section===v);return xs.length?`### ${l}\n\n`+xs.map(n=>`- **${n.author}** (${when(n.date)}${n.step!=null?`, paso ${n.step+1}`:''}): ${n.text.replace(/\n/g,'\n  ')}${n.files?.length?'\n  '+n.files.map(f=>`[${f.name}](${location.origin}/api/adjuntos?id=${f.id})`).join(' · '):''}`).join('\n')+'\n':'';}).join('\n')).join('\n');
   const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([md],{type:'text/markdown'}));a.download='notas-y-cambios-conversaciones-herida.md';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);
  }
  const del=e.target.closest('[data-del]');if(del&&confirm('¿Borrar esta nota? No se puede deshacer.')){try{await Notas.remove(del.dataset.del);}catch(err){alert(err.message);}}
 });
 document.title='Notas y cambios · Conversaciones con una herida';
 Notas.load();
}

// ───────────── Guía de la ponente (?guia) ─────────────
// Por diapositiva: de qué va y, después, el paso a paso. Se escribe con los mismos pasos que se proyectan
// (y con los cambios de texto guardados), así refleja cada cambio del guion.
const q=t=>`«${esc(end(t))}»`;
function partText(n,p){
 const r=R[n];if(!r)return 'Avanza lo que trae la herida.';
 const walk=r.walk?asset(r.asset).walkthrough?.steps.filter(x=>x.x!=null)||[]:[];
 if(r.type==='imagen'&&r.walk&&!r.auto&&p<=walk.length)return `Se ilumina «${esc(walk[p-1].title)}».`;
 if(r.type==='imagen'&&r.open&&p===r.parts)return `Aparece lo que sigue abierto: ${r.open.items.map(esc).join(', ')}.`;
 if(r.type==='imagen'&&r.then)return `Aparece el esquema: ${r.then.items.map(esc).join(' · ')}.`;
 if(r.type==='imagen')return `Aparece «${esc(r.ask||r.tag)}».`;
 if(r.type==='comparar')return `Aparece el segundo ejemplo: «${esc(r.items[1].tag)}».`;
 if(r.type==='esquema')return `Aparece «${esc(r.cols[1].head)}».`;
 if(r.type==='registro')return `Se marca lo que falta: «${esc(r.absence[0])}: ${esc(r.absence[1].toLowerCase())}».`;
 if(r.type==='huecos')return `Aparecen los huecos: ${r.missing.items.map(x=>esc(x.toLowerCase())).join(', ')}.`;
 if(r.type==='campos')return p===2?`Aparece «${esc(r.banner)}».`:'Aparecen las tres preguntas para revisar.';
 if(r.type==='imagen-campos'||r.type==='informe')return `Aparecen los datos que faltan: ${(r.fields||r.pending).map(x=>esc(x.toLowerCase())).join(', ')}.`;
 if(r.type==='opciones')return r.supuesto?`Aparece el supuesto: «${esc(r.supuesto)}».`:`Aparecen las opciones: ${r.items.map(esc).join(', ')}.`;
 if(r.type==='pauta')return `Aparecen: ${r.questions.map(x=>esc(x.toLowerCase())).join(', ')}.`;
 if(r.type==='imagen-lista')return `Aparecen los aspectos que preguntar: ${r.items.map(x=>esc(x.toLowerCase())).join(', ')}.`;
 if(r.type==='relevo')return `Se distingue «${esc(r.split[0])}» de «${esc(r.split[1])}».`;
 return 'Avanza lo que trae la herida.';
}
function brings(n){
 const r=R[n];if(!r)return 'su recurso';
 if(r.type==='comparar')return 'dos ejemplos publicados';
 if(r.type==='carro')return `el carro de curas: «${esc(r.title)}»`;
 if(r.asset)return `la imagen «${esc(asset(r.asset).title)}»`;
 return `${/esquema/i.test(r.label)?'un esquema':'una ficha'}: «${esc(r.title)}»`;
}
function whatHappens(slide,st){
 const s=slide.scene,n=s?.n;
 switch(st.kind){
  case 'still':return slide.id==='apertura'?'Portada institucional de las jornadas.':'Contraportada institucional.';
  case 'title':return `Entra el momento ${slide.block.roman}: «${esc(slide.block.name)}».`;
  case 'open':return `Empieza la escena. En el panel se ve lo que revisamos: «${esc(s.habit)}»`;
  case 'resource':return st.part===1?`La herida trae ${brings(n)}.${R[n]?.walk&&!R[n].auto?' '+partText(n,1):''}`:partText(n,st.part);
  case 'habit':return `Empieza la escena. En el panel, lo que revisamos: «${esc(s.habit)}». La herida trae ${brings(n)}.`;
  case 'transition':return `Transición: la herida, en grande, abre la escena ${pad(n)}.`;
  case 'ask':{const ev=st.evidence;return `Se tacha lo que revisamos y aparece la pregunta: <strong>«${esc(s.ask)}»</strong>${ev?`. Entra la evidencia: <strong>«${esc(ev.title)}»</strong> (${esc(ev.source)}).${ev.condition?` Recuerda la condición: «${esc(end(ev.condition))}»`:''}`:''}`;}
  case 'sala':return 'Preguntas a la sala y escuchas un par de respuestas.';
  case 'evidence':{const ev=st.evidence;return `Entra la evidencia: <strong>«${esc(ev.title)}»</strong> (${esc(ev.source)}).${ev.condition?` Recuerda la condición: «${esc(end(ev.condition))}»`:''}`;}
  case 'reply':return 'La herida responde.';
  case 'take':return `Entra lo que nos llevamos: <strong>«${esc(s.take)}»</strong>`;
  case 'bridge':{const nx=slides[slides.indexOf(slide)+1];return `Frase para pasar a ${nx?.scene?`la escena ${pad(nx.scene.n)}`:nx?.type==='block'?`el momento ${nx.block.roman}`:'lo siguiente'}.`;}
  case 'blockclose':return `Cierras el momento «${esc(slide.block.name)}».`;
  case 'page':{const [a,z]=ESCENA_RECOPILACION[st.page];return `Recopilación, página ${st.page+1} de ${ESCENA_RECOPILACION.length}: escenas ${a}${z>a?'–'+z:''}.`;}
  case 'chips':return `Aparecen ${ESCENA_REGRESO.map(x=>`«${esc(x)}»`).join(', ')}.`;
  case 'screen':return st.what==='portada'?'La pregunta de la mesa, en grande.':st.what==='presentación de la herida'?'Aparece la herida: «Os presento a la herida».':st.what==='lo que recuperamos'?'Vuelve el hilo de la escena 1 y el esquema del carro.':st.what==='la guía de partida'?`Aparece la guía de partida: «Qué no hacer en heridas crónicas», con sus ${RES_ITEMS.length} recomendaciones por apartados.`:st.what==='lo que traemos'?`Se iluminan las ${RES_IN} que salen en la charla y entran los cuatro momentos; el resto queda guardado.`:st.what==='para seguir profundizando'?'Para seguir profundizando: los apartados de la guía con lo que queda en la reserva y dónde seguir en cada guía.':st.what==='regreso a la pregunta de la mesa'?'Vuelve la pregunta de la mesa con su respuesta.':st.what==='pregunta final'?'Queda la pregunta final para la sala.':'';
  default:return '';
 }
}
function guideStep(slide,st,k){
 const lines=[];
 if(st.sala)lines.push(`<p class="g-say"><b>Tú, a la sala</b> ${q(st.sala)}</p>`);
 if(!(st.kind==='resource'&&!st.fresh))(st.lines||[]).forEach(l=>lines.push(`<p class="g-say ${l.who==='herida'?'is-herida':''}"><b>${l.who==='herida'?'La herida':'Tú'}</b> ${q(l.text)}</p>`));
 const onScreen=new Set((st.lines||[]).filter(l=>l.who==='mdm').map(l=>l.text));
 if(!(st.kind==='resource'&&!st.fresh))(st.spoken||[]).filter(t=>!onScreen.has(t)&&t!==st.sala).forEach(t=>lines.push(`<p class="g-say is-off"><b>${t===st.close?'Cierras':'Lo explicas tú'}</b> ${q(t)}</p>`));
 if(!(st.kind==='resource'&&!st.fresh))(st.develop||[]).forEach(t=>lines.push(`<p class="g-say is-off"><b>Con tus palabras</b> ${esc(t.replace(/^./,c=>c.toUpperCase()))}</p>`));
 const what=whatHappens(slide,st);
 return `<li><span class="g-n">${k+1}</span><div>${what?`<p class="g-what">${what}</p>`:''}${lines.join('')}</div></li>`;
}
function about(slide){
 const s=slide.scene,b=slide.block;
 if(slide.type==='transition')return `<p>La herida abre la escena ${pad(s.n)}.</p>`;
 if(s?.habit){const ev=slide.steps.find(x=>x.evidence).evidence;return `<p>${esc(s.purpose.replace(/^./,c=>c.toUpperCase()))}</p><p>Partimos de algo que se hace a menudo: <em>«${esc(s.habit)}»</em>. La conversación con la herida lleva a la pregunta <strong>«${esc(s.ask)}»</strong>, la evidencia (${esc(ev.source)}) ayuda a responderla y nos llevamos: <strong>«${esc(s.take)}»</strong></p>`;}
 if(slide.type==='block')return `<p>${esc(b.purpose.replace(/^./,c=>c.toUpperCase()))}</p><p>La pregunta de este momento: <strong>«${esc(b.question)}»</strong></p>`;
 if(slide.type==='intro')return `<p>${esc(G.intro.purpose.replace(/^./,c=>c.toUpperCase()))}</p><p>Presentas la pregunta de la mesa y a la herida, que os acompañará toda la charla.</p>`;
 if(s)return `<p>${esc(s.purpose.replace(/^./,c=>c.toUpperCase()))}</p>`;
 return '';
}
function guideView(){
 document.documentElement.classList.add('is-guide');
 const sec=slide=>{
  const s=slide.scene,b=slide.block;
  const kicker=s?`${b?`Momento ${b.roman} · `:''}Escena ${pad(s.n)}`:slide.type==='block'?`Momento ${b.roman} de IV`:slide.type==='intro'?'Apertura':'Institucional';
  const title=s?s.title:slide.type==='block'?b.name:slide.type==='intro'?'Antes de acercar el carro':slide.id==='apertura'?'Portada':'Contraportada';
  return `<section class="g-sec" id="g-${slide.id}" ${b?`data-q="${b.n}"`:''}><header><span class="g-kicker">${esc(kicker)}</span><h2>${esc(title)}</h2></header>${about(slide)?`<div class="g-about"><h3>De qué va</h3>${about(slide)}</div>`:''}<h3 class="g-h3">Paso a paso</h3><ol class="g-steps">${slide.steps.map((st,k)=>guideStep(slide,st,k)).join('')}</ol></section>`;
 };
 const reserve=`<section class="g-sec g-reserve" id="g-reserva"><header><span class="g-kicker">Por si preguntan · tecla R</span><h2>${esc(G.reserve.title)}</h2></header><div class="g-about"><p>${esc(G.reserve.intro.replace(/\*/g,''))}</p></div>${RES.map(g=>`<h3 class="g-h3">${esc(g.n)} · ${esc(g.name)}</h3><ol class="g-rv">${g.items.map(x=>`<li class="${x.tag?'is-'+x.tag:''}"><p>${esc(x.text)}</p><small>${esc(strength(x))}${tagText(x)?' · <b>'+esc(tagText(x))+'</b>':''}</small></li>`).join('')}</ol>`).join('')}</section>`;
 const map=G.blocks.map(b=>`<li data-q="${b.n}"><a href="#g-bloque-${b.n}"><b>${b.roman}</b> ${esc(b.name)}</a><span>${b.scenes.map(n=>`<a href="#g-escena-${n}">${pad(n)} ${esc(G.scenes[n-1].title)}</a>`).join('')}</span></li>`).join('');
 $('#guia').innerHTML=`<article class="g"><header class="g-top"><span class="g-kicker">Conversaciones con una herida · IV Jornadas Comisión Heridas Jerez</span><h1>Tu guion, María del Mar</h1><p>Diapositiva a diapositiva: primero de qué va y luego qué pasa en cada clic. No hace falta aprenderlo; dilo con tus palabras. Lo importante de cada escena es la pregunta, la condición de la evidencia y lo que nos llevamos.</p><p class="g-actions"><a href="./" target="_blank">Abrir la presentación</a><a href="?notas">Notas y cambios</a><a href="/salir">Salir</a></p><p class="g-hint">Para anotar o corregir algo, abre la presentación y pulsa <b>N</b> (o el botón «Notas»): verás la diapositiva mientras escribes.</p></header><nav class="g-map"><h2>El recorrido</h2><ol>${map}<li><a href="#g-reserva"><b>R</b> Reserva · por si preguntan</a></li></ol></nav>${slides.map(sec).join('')}${reserve}<footer class="g-end">Lo que dice la herida son réplicas preparadas; los ejemplos son docentes. La revisión clínica final y la duración se cierran contigo.</footer></article>`;
 document.title='Tu guion · Conversaciones con una herida';
 if(location.hash)setTimeout(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView(),50);
}

// ───────────── Arranque ─────────────
const fromHash=()=>{const [id,step]=decodeURIComponent(location.hash.slice(1)).split('/');const i=slides.findIndex(s=>s.id===id);return i<0?[0,0]:[i,Math.max(0,(Number(step)||1)-1)];};
(async()=>{
 // Los cambios de texto guardados se aplican antes de pintar nada (con un límite, por si no hay red).
 await Promise.race([Textos.load(),new Promise(r=>setTimeout(r,2500))]);
 if(notasView)return notesView();
 if(guia)return guideView();
 if(presenter){
  const render=presenterView();
  const sync=(a,b)=>{si=a;k=b;render();};
  channel?.addEventListener('message',e=>{if(e.data.reserva&&typeof e.data.reserva==='object'){Object.assign(presenterReserve,e.data.reserva);render();return;}if(e.data.si!=null)sync(e.data.si,e.data.k);});
  const toReserve=a=>channel?.postMessage({from:'ponente',reserva:a});
  const send=(a,b)=>{a=Math.max(0,Math.min(slides.length-1,a));const n=slides[a].steps.length;b=b<0?n-1:Math.min(n-1,Math.max(0,b));sync(a,b);channel?.postMessage({si:a,k:b,from:'ponente'});location.replace('#'+slides[a].id+(b?'/'+(b+1):''));};
  document.addEventListener('keydown',e=>{
   if(e.target.closest?.('input,textarea,select'))return;
   if(e.key==='r'||e.key==='R'){toReserve('toggle');return;}
   if(presenterReserve.open){
    e.preventDefault();
    if(/^[1-6]$/.test(e.key))toReserve(Number(e.key)-1);
    else if(['ArrowRight',' ','PageDown','ArrowDown'].includes(e.key))toReserve('next');
    else if(['ArrowLeft','PageUp','ArrowUp'].includes(e.key))toReserve('prev');
    else if(e.key==='Escape')toReserve('close');
    return;
   }
   if(['ArrowRight',' ','PageDown'].includes(e.key)){e.preventDefault();if(k<slides[si].steps.length-1)send(si,k+1);else send(si+1,0);}
   if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();if(k>0)send(si,k-1);else send(si-1,-1);}
   if(e.key==='ArrowDown')send(si+1,0);if(e.key==='ArrowUp')send(si-1,0);
  });
  const [a,b]=fromHash();sync(a,b);
  return;
 }
 const [a,b]=fromHash();
 if(ESPEJO){
  // Sigue a la presentación y a la ponente; el espejo de «siguiente» va un paso por delante.
  const follow=(x,y)=>{const [p,q2]=QUIETO?nextOf(x,y):[x,y];go(p,q2,QUIETO?0:undefined);};
  channel?.addEventListener('message',e=>{if(e.data.si!=null)follow(e.data.si,e.data.k);});
  await document.fonts.ready;follow(a,b);
  return;
 }
 document.addEventListener('keydown',key);
 channel?.addEventListener('message',e=>{if(e.data.from!=='ponente')return;if(e.data.reserva!==undefined)Reserva.act(e.data.reserva);else go(e.data.si,e.data.k);});
 $('#hud').addEventListener('click',e=>{const act=e.target.closest('[data-act]')?.dataset.act;if(act==='prev')prev();if(act==='next')next();if(act==='overview')overview();if(act==='fullscreen')fullscreen();if(act==='presenter')openPresenter();if(act==='reserve')Reserva.show();if(act==='guide')window.open(location.pathname+'?guia','guia');});
 $('#overview').addEventListener('click',e=>{const btn=e.target.closest('[data-go]');if(btn){overview(false);go(Number(btn.dataset.go),0);}else if(e.target.id==='overview')overview(false);});
 stage.addEventListener('click',e=>{if(e.target.closest('a,button,#reserva'))return;const r=stage.getBoundingClientRect();(e.clientX-r.left<r.width*.18?prev:next)();});
 let idle;document.addEventListener('pointermove',()=>{document.body.classList.add('show-hud');clearTimeout(idle);idle=setTimeout(()=>document.body.classList.remove('show-hud'),2200);});
 addEventListener('resize',()=>{lastPlace=null;apply(0);});
 Editor.mount();
 await document.fonts.ready;go(a,b,1);
 // El carro (unos 9 MB la primera vez) se carga ya, en pausa, para que aparezca al instante cuando toque.
 if(!Carro.el)Carro.crear();
 globalThis.Escena={slides,go,next,prev,reserva:Reserva,state:()=>({si,k,id:slides[si].id,view:view(slides[si],k),reserva:Reserva.open?RES[Reserva.g].n:null})};
})();
})();

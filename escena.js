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
const presenter=new URLSearchParams(location.search).has('ponente');
const guia=new URLSearchParams(location.search).has('guia');

// ───────────── Línea de tiempo ─────────────
const slides=[];
slides.push({id:'apertura',type:'institutional',src:INST.open,steps:[{kind:'still',label:'Portada institucional'}]});
slides.push({id:'portada',type:'intro',steps:G.intro.steps});
for(const b of G.blocks){
 slides.push({id:'bloque-'+b.n,type:'block',block:b,steps:[{kind:'title',label:'Entrada de bloque'},...(b.open?[{kind:'say',lines:[{who:'mdm',text:b.open}],spoken:[b.open]}]:[])]});
 for(const n of b.scenes){
  const s=G.scenes[n-1];
  slides.push({id:'escena-'+n,type:s.kind,scene:s,block:b,steps:expand(s)});
 }
 if(b.close)slides.at(-1).steps.push({kind:'blockclose',lines:[{who:'mdm',text:b.close}],spoken:[b.close]});
}
slides.push({id:'cierre',type:'institutional',src:INST.close,steps:[{kind:'still',label:'Cierre institucional'}]});

function expand(s){
 const out=[];
 for(const st of s.steps){
  if(s.kind==='practice'&&st.kind==='resource'){
   const parts=R[s.n]?.parts||1;
   for(let p=1;p<=parts;p++)out.push({...st,part:p,lines:p===1?st.lines:st.lines,fresh:p===1});
  }else if(s.kind==='recap'&&st.what==='recopilación'){
   ESCENA_RECOPILACION.forEach((range,i)=>out.push({...st,kind:'page',page:i,notes:i?undefined:st.notes,recuerda:st.recuerda}));
  }else if(s.kind==='return'&&st.what==='lo que recogemos'){
   ESCENA_REGRESO.forEach((c,i)=>out.push({...st,kind:'chips',part:i+1,spoken:i===ESCENA_REGRESO.length-1?st.spoken:undefined}));
  }else out.push(st);
 }
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
   el.innerHTML=`<div class="cover"><p class="cover-meta">IV Jornadas Comisión Heridas Jerez · Mesa redonda</p><h1 class="cover-title">¿Es posible cicatrizar todas las heridas?</h1><div class="cover-foot"><p class="cover-sub">Qué no hacer en heridas crónicas</p><p class="cover-author">María del Mar Candil Ramón<span>19 de noviembre de 2026</span></p></div></div><div class="meet"><span class="meet-eyebrow">Antes de acercar el carro</span><h2 class="meet-title">Os presento a la herida</h2><p class="meet-id">Personaje abstracto que reúne historias docentes. No es un caso clínico: su forma y su color no se diagnostican.</p></div><div class="speech">${says}</div>${anchors(['intro'])}`;
   break;
  case 'block':{
   const b=slide.block;
   el.innerHTML=`<div class="block-numeral" aria-hidden="true">${b.roman}</div><div class="block-copy"><span class="block-eyebrow">Momento ${b.roman} de IV</span><h1 class="block-name">${esc(b.name)}</h1><p class="block-q">${esc(b.question)}</p></div><ol class="block-scenes">${b.scenes.map((n,i)=>`<li style="--d:${.5+i*.07}s"><span>${pad(n)}</span>${esc(G.scenes[n-1].title)}</li>`).join('')}</ol><div class="speech">${says}</div>${anchors(['block'])}`;
   break;
  }
  case 'practice':{
   const s=slide.scene,st=slide.steps,ev=st.find(x=>x.kind==='evidence')?.evidence||{};
   const sala=st.find(x=>x.kind==='sala');
   const b=slide.block,blockScenes=b.scenes.map(n=>G.scenes[n-1]);
   el.innerHTML=`${side(slide,threadHtml(s))}<section class="space"><div class="res-wrap">${resource(s.n)}</div><div class="residue-wrap">${residue(s.n)}</div><div class="evidence"><header class="ev-head"><span class="ev-eyebrow"><i class="ev-icon"></i>Evidencia científica</span><span class="ev-source">${esc(ev.source)}</span></header><h3 class="ev-title">${esc(ev.title)}</h3><p class="ev-idea">${esc(end(ev.idea||''))}</p>${ev.condition?`<div class="ev-cond"><span>Condición</span><p>${esc(end(ev.condition))}</p></div>`:''}<footer class="ev-foot">Síntesis del documento citado · no es cita literal</footer></div>${sala?`<div class="sala"><span class="sala-k">A la sala</span><p class="sala-q">${esc(sala.sala)}</p>${sala.after?`<span class="sala-after">${esc(sala.after)}</span>`:''}</div>`:''}<div class="blockclose"><span class="bc-k">${esc(b.name)} · hasta aquí</span><ol>${blockScenes.map((x,i)=>`<li style="--i:${i}"><i></i><span>${pad(x.n)}</span>${esc(x.title)}</li>`).join('')}</ol></div></section><div class="speech">${slide.steps.map((x,k)=>exchange(x.lines,k,{size:x.kind==='bridge'?'is-bridge':''})).join('')}</div>${anchors(['talk','dock','corner','close'])}`;
   break;
  }
  case 'return':{
   const s1=G.scenes[0];
   el.innerHTML=`${side(slide,`<div class="return-title"><span class="scene-n">Escena 22</span><h2 class="scene-title">${esc(slide.scene.title)}</h2></div>${threadHtml(s1,{label:'Volvemos a la escena 01'})}`)}<section class="space"><div class="res-wrap">${resource(1)}</div><div class="sala"><span class="sala-k">A la sala</span><p class="sala-q">${esc(slide.steps.find(x=>x.kind==='sala').sala)}</p><span class="sala-after">${esc(slide.steps.find(x=>x.kind==='sala').notes?.[0]||'')}</span></div><div class="gather"><span class="gather-k">Lo que recogemos</span><ol>${ESCENA_REGRESO.map((c,i)=>`<li data-part="${i+1}"><i></i>${esc(c)}</li>`).join('')}</ol></div></section><div class="speech">${says}</div>${anchors(['talk','dock','close'])}`;
   break;
  }
  case 'recap':{
   const scenes=G.scenes.filter(x=>x.kind==='practice');
   const pages=ESCENA_RECOPILACION.map(([a,z],i)=>{const rows=scenes.filter(x=>x.n>=a&&x.n<=z),b=G.blocks.find(b=>b.scenes.includes(a));return `<div class="page" data-page="${i}" data-q="${b.n}"><header class="page-head"><span class="rail-roman">${b.roman}</span><span>${esc(b.name)}</span><span class="page-n">${i+1} / ${ESCENA_RECOPILACION.length}</span></header><div class="table"><div class="trow thead"><span></span><span>A revisar</span><span>Nos preguntamos</span><span>Nos llevamos</span></div>${rows.map((x,j)=>`<div class="trow" style="--d:${.08+j*.09}s"><span class="tn">${pad(x.n)}</span><span class="th"><s>${esc(x.habit)}</s></span><span class="ta">${esc(x.ask)}</span><span class="tt">${esc(x.take)}</span></div>`).join('')}</div></div>`;}).join('');
   el.innerHTML=`${rail(slide)}<div class="recap-intro"><span class="scene-n">Escena 23</span><h2 class="recap-title">${esc(slide.scene.title)}</h2><p class="recap-count"><b>21</b> actuaciones revisadas · <b>4</b> momentos de la visita</p><div class="recap-stitches" aria-hidden="true">${scenes.map((x,i)=>`<i style="--d:${.3+i*.035}s"></i>`).join('')}</div></div><div class="pages">${pages}</div><div class="recap-end"><p>Una actuación para revisar en la próxima cura</p></div><div class="speech">${says}</div>${anchors(['talk','corner','close'])}`;
   break;
  }
  case 'farewell':{
   const src=[...new Set([19,20,21].flatMap(n=>G.scenes[n-1].steps.find(x=>x.kind==='evidence').evidence.source.split(' / ')))].join(' · ');
   el.innerHTML=`<div class="mesa"><span class="mesa-k">La pregunta de la mesa</span><h1 class="mesa-q">¿Es posible cicatrizar todas las heridas?</h1><p class="mesa-a">Valorar cada situación y acordar objetivos revisables.</p><p class="mesa-src">Escenas 19–21 · ${esc(src)}</p></div><div class="final"><h1 class="final-q">En la próxima cura, ¿qué revisarías antes de repetir?</h1></div><div class="thanks"><p>Gracias por acompañarnos</p><span>María del Mar Candil Ramón · IV Jornadas Comisión Heridas Jerez</span></div><div class="speech">${says}</div>${anchors(['talk','corner','close'])}`;
   break;
  }
 }
 return el;
}

// Estado de cada paso: qué plano ocupa el espacio, qué nodos del hilo se ven y dónde está la herida.
function view(slide,k){
 const v={plane:'',part:0,habit:'on',ask:false,take:false,place:'none',state:'idle',page:0};
 const steps=slide.steps;
 if(slide.type==='intro'){v.plane=k===0?'cover':'meet';v.place=k===0?'none':'intro';return v;}
 if(slide.type==='block'){v.plane='block';v.place='block';return v;}
 if(slide.type==='institutional'){v.plane='inst';return v;}
 for(let i=0;i<=k;i++){
  const st=steps[i];
  switch(st.kind){
   case 'open':v.plane='talk';v.place='talk';break;
   case 'resource':v.plane='resource';v.place='dock';v.part=st.part;v.state='showing';break;
   case 'ask':v.ask=true;v.habit='struck';v.plane='resource';v.part=99;v.place='dock';v.state='listening';break;
   case 'sala':v.plane='sala';v.state='listening';if(slide.type==='farewell'){v.place='corner';}break;
   case 'evidence':v.plane='evidence';v.place='corner';v.state='listening';break;
   case 'reply':v.plane='evidence';v.place='corner';break;
   case 'take':v.take=true;v.plane='close';v.place='talk';v.state='relief';break;
   case 'bridge':v.plane='close';v.place='talk';v.state='idle';v.bridge=true;break;
   case 'blockclose':v.plane='blockclose';v.place='close';v.state='idle';break;
   case 'page':v.plane='pages';v.page=st.page;v.place='none';break;
   case 'chips':v.plane='gather';v.part=st.part;v.place='dock';break;
   case 'screen':
    if(st.what==='lo que recuperamos'){v.plane='resource';v.part=99;v.habit='struck';v.ask=true;v.take=true;v.place='dock';}
    if(st.what==='al terminar el repaso'){v.plane='end';v.place='close';}
    if(st.what==='regreso a la pregunta de la mesa'){v.plane='mesa';v.place='corner';}
    if(st.what==='pregunta final'){v.plane='final';v.place='corner';v.state='idle';}
    break;
   case 'say':
    if(!v.plane){v.plane=slide.type==='recap'?'recap':'talk';v.place='talk';}
    if(slide.type==='farewell'&&i===steps.length-1){v.plane='thanks';v.place='close';}
    if(slide.type==='recap'&&v.plane==='end')v.place='close';
    break;
  }
 }
 if(slide.type==='return'&&v.plane!=='talk'){v.ask=true;v.take=true;v.habit='struck';}
 if(slide.type==='practice'&&v.plane==='close'&&v.state==='relief'&&slide.scene.n===16)v.state='idle';
 return v;
}

// ───────────── Estado y navegación ─────────────
let si=0,k=0,el=null,last=null;
const stage=$('#stage');
const herida=$('#herida'),zone=$('#herida .orb-zone');
const channel='BroadcastChannel' in window?new BroadcastChannel('herida-escena'):null;

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
 const live=dir>0&&!reduced();
 $$('.say',el).forEach(s=>{const on=Number(s.dataset.k)===k;s.classList.toggle('is-on',on);s.classList.toggle('live',on&&live);s.classList.toggle('static',on&&!live);});
 const current=$(`.say[data-k="${k}"]`,el);
 if(current)current.closest('.speech').dataset.plane=v.plane;
 place(v,dir,newSlide);
 // La herida piensa y habla al ritmo de su frase.
 Presence.reset();
 zone.dataset.state=v.state;Presence.mount([zone],{motion:!reduced()});
 const h=current?.querySelector('.line.herida');
 if(h&&live)Presence.cue(v.state==='idle'?'responding':v.state,{delay:Number(h.dataset.at)*1000,think:Number(h.dataset.think)*1000,speak:Number(h.dataset.words)*60+400});
 document.documentElement.dataset.speaking=h?'1':'';
 location.replace('#'+slide.id+(k?'/'+(k+1):''));
 hud();
 channel?.postMessage({si,k});
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
 if(reduced()){set(r);return;}
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
 if(v.plane!=='resource'){show(-1);return;}
 if(walk.dataset.auto){
  if(v.part!==1){show(-1);return;}
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
  o.innerHTML=`<div class="ov-inner"><header><h2>Recorrido</h2><p>Elige una escena · Esc para volver</p></header><div class="ov-grid">${[{name:'Apertura',items:slides.filter(s=>['institutional','intro'].includes(s.type)&&s.id!=='cierre')},...G.blocks.map(b=>({name:`${b.roman} · ${b.name}`,q:b.n,items:slides.filter(s=>s.block?.n===b.n)})),{name:'Cierre',items:[slides.at(-1)]}].map(g=>`<section ${g.q?`data-q="${g.q}"`:''}><h3>${esc(g.name)}</h3><ol>${g.items.map(s=>`<li><button data-go="${slides.indexOf(s)}" class="${slides.indexOf(s)===si?'is-now':''}"><span>${s.scene?pad(s.scene.n):s.type==='block'?s.block.roman:'·'}</span>${esc(s.scene?.title||(s.type==='block'?'Entrada de bloque':s.type==='intro'?'Os presento a la herida':s.id==='apertura'?'Portada institucional':'Cierre institucional'))}</button></li>`).join('')}</ol></section>`).join('')}</div></div>`;
  $('[data-go].is-now',o)?.focus();
 }
}
function fullscreen(){if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen?.();}
function openPresenter(){window.open(location.pathname+'?ponente'+location.hash,'ponente','width=1100,height=760');}

function key(e){
 if(e.metaKey||e.ctrlKey||e.altKey)return;
 const ov=!$('#overview').hidden;
 switch(e.key){
  case 'ArrowRight':case ' ':case 'PageDown':case 'Enter':if(ov&&e.key==='Enter')return;e.preventDefault();next();break;
  case 'ArrowLeft':case 'PageUp':case 'Backspace':e.preventDefault();prev();break;
  case 'ArrowDown':e.preventDefault();go(si+1,0,1);break;
  case 'ArrowUp':e.preventDefault();go(si-1,0,-1);break;
  case 'Home':go(0,0,-1);break;
  case 'End':go(slides.length-1,0,1);break;
  case 'g':case 'G':overview();break;
  case 'Escape':if(ov)overview(false);break;
  case 'f':case 'F':fullscreen();break;
  case 'p':case 'P':if(!presenter)openPresenter();break;
  default:return;
 }
}

// ───────────── Ventana de ponente ─────────────
function presenterView(){
 document.documentElement.classList.add('is-presenter');
 const started=Date.now();
 const render=()=>{
  const s=slides[si],st=s.steps[k],nx=s.steps[k+1]?{s,st:s.steps[k+1],k:k+1}:slides[si+1]?{s:slides[si+1],st:slides[si+1].steps[0],k:0}:null;
  // En el orden en que se dice: el intercambio proyectado y, después, lo que María del Mar explica sin proyectar.
  const lines=st=>{
   const shown=(st.lines||[]).map(l=>l.who==='herida'?`<p class="pv-herida"><b>La herida</b> ${esc(end(l.text))}</p>`:`<p class="pv-mdm">${esc(end(l.text))}</p>`);
   const said=new Set((st.lines||[]).filter(l=>l.who==='mdm').map(l=>l.text));
   const extra=(st.spoken||[]).filter(t=>!said.has(t)&&t!==st.sala).map(t=>`<p class="pv-mdm">${t===st.close?'<b>Cierras</b> ':''}${esc(end(t))}</p>`);
   return [st.sala?`<p class="pv-sala"><b>A la sala</b> ${esc(st.sala)}</p>`:'',...shown,...extra].join('');
  };
  const title=s=>s.scene?`Escena ${pad(s.scene.n)} · ${s.scene.title}`:s.type==='block'?`Momento ${s.block.roman} · ${s.block.name}`:s.type==='intro'?'Apertura · Os presento a la herida':s.id==='apertura'?'Portada institucional':'Cierre institucional';
  const kind={open:'Apertura de escena',resource:'Recurso de la herida',ask:'La pregunta',sala:'A la sala',evidence:'Evidencia científica',reply:'Réplica',take:'El aprendizaje',bridge:'Para seguir',blockclose:'Cierre de bloque',page:'Recopilación',chips:'Lo que recogemos',say:'Conversación',screen:'Pantalla',title:'Entrada de bloque',still:'Pantalla institucional'}[st.kind]||st.kind;
  $('#presenter').innerHTML=`<header class="pv-head"><div><span class="pv-kicker">${esc(title(s))}</span><h1>${esc(kind)}${st.part&&st.kind==='resource'?` · ${st.part}/${R[s.scene.n].parts}`:''}${st.kind==='page'?` · ${st.page+1}/7`:''}</h1></div><div class="pv-clock"><b id="pv-timer">00:00</b><span>paso ${k+1} de ${s.steps.length}</span></div></header><main class="pv-main"><section class="pv-now"><h2>Ahora</h2>${lines(st)||'<p class="pv-quiet">Sin texto hablado en este paso.</p>'}${(st.recuerda||[]).filter((r,i)=>st.kind!=='page'||i===['Antes de empezar','Durante la cura','Cuando algo no encaja','Antes de irnos'].indexOf(G.blocks.find(b=>b.scenes.includes(ESCENA_RECOPILACION[st.page][0])).name)).map(r=>`<p class="pv-mdm"><b>${esc(r.block)}</b> ${esc(end(r.text))}</p>`).join('')}${(st.notes||[]).map(n=>`<p class="pv-note">${esc(n)}</p>`).join('')}${st.screen?`<details open><summary>En pantalla</summary><p>${esc(st.screen)}</p></details>`:''}${s.scene&&s.scene.purpose&&k===0?`<p class="pv-note"><b>Qué queremos explicar</b> ${esc(s.scene.purpose)}</p>`:''}</section><aside class="pv-next"><h2>Siguiente</h2>${nx?`<span class="pv-kicker">${esc(title(nx.s))}</span>${lines(nx.st)||'<p class="pv-quiet">Cambio de pantalla.</p>'}`:'<p class="pv-quiet">Final.</p>'}${s.scene?.support?`<p class="pv-support"><b>Respaldo</b> ${esc(s.scene.support)}</p>`:''}</aside></main><footer class="pv-keys">→ avanzar · ← retroceder · ↑↓ escena · G recorrido · F pantalla completa</footer>`;
 };
 setInterval(()=>{const t=Math.floor((Date.now()-started)/1000),m=$('#pv-timer');if(m)m.textContent=pad(Math.floor(t/60))+':'+pad(t%60);},1000);
 return render;
}


// ───────────── Guía de la ponente (?guia) ─────────────
// Un recorrido informal, paso a paso, con lo que sale en pantalla y lo que dice cada una.
// Se escribe a partir de los mismos pasos que se proyectan, así nunca se separa del guion.
const q=t=>`«${esc(end(t))}»`;
function partText(n,p){
 const r=R[n];if(!r)return 'Avanza el recurso.';
 const walk=r.walk?asset(r.asset).walkthrough?.steps.filter(x=>x.x!=null)||[]:[];
 if(r.type==='imagen'&&r.walk&&!r.auto&&p<=walk.length)return `Se ilumina «${esc(walk[p-1].title)}».`;
 if(r.type==='imagen'&&r.open&&p===r.parts)return `Aparece lo que sigue abierto: ${r.open.items.map(esc).join(', ')}.`;
 if(r.type==='imagen'&&r.then)return `Aparece el esquema: ${r.then.items.map(esc).join(' · ')}.`;
 if(r.type==='imagen')return `Aparece «${esc(r.ask||r.tag)}».`;
 if(r.type==='comparar')return `Aparece el segundo ejemplo: «${esc(r.items[1].tag)}».`;
 if(r.type==='esquema')return `Aparece «${esc(r.cols[1].head)}»${r.link?`, unida por «${esc(r.link)}»`:''}.`;
 if(r.type==='registro')return `Se marca lo que falta: «${esc(r.absence[0])}: ${esc(r.absence[1].toLowerCase())}».`;
 if(r.type==='huecos')return `Aparecen los huecos: ${r.missing.items.map(x=>esc(x.toLowerCase())).join(', ')}.`;
 if(r.type==='campos')return p===2?`Aparece «${esc(r.banner)}».`:`Y las tres preguntas: ${r.questions.map(esc).join(' ')}`;
 if(r.type==='imagen-campos'||r.type==='informe')return `Se abren los datos que faltan: ${(r.fields||r.pending).map(x=>esc(x.toLowerCase())).join(', ')}.`;
 if(r.type==='opciones')return r.supuesto?`Aparece el supuesto: «${esc(r.supuesto)}».`:`Aparecen las opciones: ${r.items.map(esc).join(', ')}.`;
 if(r.type==='pauta')return `Se abren: ${r.questions.map(x=>esc(x.toLowerCase())).join(', ')}.`;
 if(r.type==='imagen-lista')return `Aparecen los aspectos que preguntar: ${r.items.map(x=>esc(x.toLowerCase())).join(', ')}.`;
 if(r.type==='relevo')return `Se distingue «${esc(r.split[0])}» de «${esc(r.split[1])}».`;
 return 'Avanza el recurso.';
}
function brings(n){
 const r=R[n];if(!r)return 'su recurso';
 if(r.type==='comparar')return 'dos ejemplos publicados';
 if(r.asset)return `la imagen «${esc(asset(r.asset).title)}»`;
 return `${/esquema/i.test(r.label)?'el esquema':'la ficha'} «${esc(r.title)}»`;
}
const said=st=>{
 const shown=(st.lines||[]).map(l=>l.who==='herida'?`<p class="g-herida"><b>La herida</b> ${q(l.text)}</p>`:`<p class="g-tu"><b>Tú</b> ${q(l.text)}</p>`);
 const onScreen=new Set((st.lines||[]).filter(l=>l.who==='mdm').map(l=>l.text));
 const extra=(st.spoken||[]).filter(t=>!onScreen.has(t)&&t!==st.sala&&t!==st.close).map(t=>`<p class="g-tu is-off"><b>Tú, sin que salga en pantalla</b> ${q(t)}</p>`);
 return [...shown,...extra].join('');
};
function guideStep(slide,st,k){
 const s=slide.scene,n=s?.n;
 let what='';
 switch(st.kind){
  case 'still':what=slide.id==='apertura'?'Empezamos con la portada institucional de las jornadas.':'Terminamos con la contraportada institucional.';break;
  case 'title':what=`Entra el momento ${slide.block.roman}, «${esc(slide.block.name)}», con su pregunta: «${esc(slide.block.question)}».`;break;
  case 'open':what=`La herida abre la escena. En tu panel se lee lo que vamos a revisar: «${esc(s.habit)}»`;break;
  case 'resource':what=st.part===1?`La herida trae ${brings(n)}.${R[n]?.walk&&!R[n].auto?' '+partText(n,1):''}`:partText(n,st.part);break;
  case 'ask':what=`Se tacha «${esc(s.habit)}» y aparece la pregunta: <strong>«${esc(s.ask)}»</strong>`;break;
  case 'sala':what=`Preguntas a la sala: «${esc(st.sala)}» Deja un par de respuestas, sin abrir debate.`;break;
  case 'evidence':{const ev=st.evidence;what=`Entra la evidencia: <strong>«${esc(ev.title)}»</strong> (${esc(ev.source)}). La cuentas tú, con tus palabras.${ev.condition?` Que no se te pase la condición: «${esc(end(ev.condition))}»`:''}`;break;}
  case 'reply':what='La herida contesta a lo que acabas de explicar.';break;
  case 'take':what=`El aprendizaje entra en tu panel: <strong>«${esc(s.take)}»</strong> Respondes a la pregunta y cierras: ${q(st.close||'')}`;break;
  case 'bridge':{const nx=slides[slides.indexOf(slide)+1];what=`Sale tu frase para seguir. Con el siguiente clic pasamos a ${nx?.scene?`la escena ${pad(nx.scene.n)}, «${esc(nx.scene.title)}»`:nx?.type==='block'?`el momento ${nx.block.roman}`:'lo siguiente'}.`;break;}
  case 'blockclose':what=`Cierras el momento «${esc(slide.block.name)}» con las escenas que hemos recorrido a la vista.`;break;
  case 'page':{const [a,z]=ESCENA_RECOPILACION[st.page];const b=G.blocks.find(b=>b.scenes.includes(a));const rec=(st.recuerda||[]).find(r=>r.block===b.name);const first=ESCENA_RECOPILACION.findIndex(([x])=>G.blocks.find(bb=>bb.scenes.includes(x))===b)===st.page;what=`Recopilación, página ${st.page+1} de ${ESCENA_RECOPILACION.length}: «${esc(b.name)}», escenas ${a}${z>a?'–'+z:''}.${first&&rec?` Lo resumes así: ${q(rec.text)}`:''}`;break;}
  case 'chips':what=`Aparece «${esc(ESCENA_REGRESO[st.part-1])}», una de las cosas que recoges de la sala.`;break;
  case 'screen':what=st.what==='portada'?'Arranca con la pregunta de la mesa en grande.':st.what==='presentación de la herida'?'La portada se recoge y aparece la herida: «Os presento a la herida».':`En pantalla: ${esc(st.screen.replace(/^./,c=>c.toUpperCase()))}`;break;
  case 'say':what='';break;
 }
 return `<li class="g-step k-${st.kind}"><span class="g-n">${k+1}</span><div>${what?`<p class="g-what">${what}</p>`:''}${st.kind==='resource'&&!st.fresh?'':said(st)}${(st.notes||[]).map(x=>`<p class="g-note">${esc(x)}</p>`).join('')}</div></li>`;
}
function guideView(){
 document.documentElement.classList.add('is-guide');
 const sec=slide=>{
  const s=slide.scene,b=slide.block;
  const head=s?`<span class="g-kicker">${b?`Momento ${b.roman} · `:''}Escena ${pad(s.n)} de 24</span><h2>${esc(s.title)}</h2>`:slide.type==='block'?`<span class="g-kicker">Momento ${b.roman} de IV</span><h2>${esc(b.name)}</h2>`:slide.type==='intro'?`<span class="g-kicker">Apertura</span><h2>Antes de acercar el carro</h2>`:`<span class="g-kicker">Institucional</span><h2>${slide.id==='apertura'?'Portada':'Contraportada'}</h2>`;
  const idea=s?.purpose||(slide.type==='block'?b.purpose:slide.type==='intro'?G.intro.purpose:'');
  const thread=s?.habit?`<dl class="g-thread"><dt>Revisamos</dt><dd><s>${esc(s.habit)}</s></dd><dt>Nos preguntamos</dt><dd>${esc(s.ask)}</dd><dt>Nos llevamos</dt><dd>${esc(s.take)}</dd></dl>`:'';
  return `<section class="g-sec" id="g-${slide.id}" ${b?`data-q="${b.n}"`:''}><header>${head}${idea?`<p class="g-idea"><b>La idea</b> ${esc(idea.replace(/^./,c=>c.toUpperCase()))}</p>`:''}</header>${thread}<ol class="g-steps">${slide.steps.map((st,k)=>guideStep(slide,st,k)).join('')}</ol>${s?.support?`<p class="g-support"><b>Respaldo</b> ${esc(s.support)}</p>`:''}</section>`;
 };
 const map=G.blocks.map(b=>`<li data-q="${b.n}"><a href="#g-bloque-${b.n}"><b>${b.roman}</b> ${esc(b.name)}</a><span>${b.scenes.map(n=>`<a href="#g-escena-${n}">${pad(n)} ${esc(G.scenes[n-1].title)}</a>`).join('')}</span></li>`).join('');
 $('#guia').innerHTML=`<article class="g"><header class="g-top"><span class="g-kicker">Conversaciones con una herida · IV Jornadas Comisión Heridas Jerez</span><h1>Tu guion, María del Mar</h1><p>Aquí tienes lo que va pasando en pantalla y lo que decís tú y la herida, clic a clic. Cada número es una pulsación. No hace falta aprenderlo ni leerlo en voz alta: es para que sepas siempre dónde estás y qué viene después. Puedes decirlo con tus palabras; lo que conviene no perder son la pregunta, la condición y el aprendizaje de cada escena.</p><ul class="g-keys"><li><b>→</b> o espacio: avanzar</li><li><b>←</b> retroceder</li><li><b>P</b> ventana de ponente</li><li><b>G</b> saltar a una escena</li><li><b>F</b> pantalla completa</li></ul></header><nav class="g-map"><h2>El recorrido</h2><ol>${map}</ol></nav>${slides.map(sec).join('')}<footer class="g-end">Lo que dice la herida son réplicas preparadas; los ejemplos son docentes. La revisión clínica final y la duración se cierran contigo.</footer></article>`;
 document.title='Tu guion · Conversaciones con una herida';
}

// ───────────── Arranque ─────────────
const fromHash=()=>{const [id,step]=decodeURIComponent(location.hash.slice(1)).split('/');const i=slides.findIndex(s=>s.id===id);return i<0?[0,0]:[i,Math.max(0,(Number(step)||1)-1)];};
document.addEventListener('keydown',key);
let renderPresenter=null;
if(guia){
 document.removeEventListener('keydown',key);guideView();
}else if(presenter){
 renderPresenter=presenterView();
 const sync=(a,b)=>{si=a;k=b;renderPresenter();};
 channel?.addEventListener('message',e=>sync(e.data.si,e.data.k));
 const send=(a,b)=>{a=Math.max(0,Math.min(slides.length-1,a));const n=slides[a].steps.length;b=b<0?n-1:Math.min(n-1,Math.max(0,b));sync(a,b);channel?.postMessage({si:a,k:b,from:'ponente'});location.replace('#'+slides[a].id+(b?'/'+(b+1):''));};
 document.removeEventListener('keydown',key);
 document.addEventListener('keydown',e=>{
  if(['ArrowRight',' ','PageDown'].includes(e.key)){e.preventDefault();if(k<slides[si].steps.length-1)send(si,k+1);else send(si+1,0);}
  if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();if(k>0)send(si,k-1);else send(si-1,-1);}
  if(e.key==='ArrowDown')send(si+1,0);if(e.key==='ArrowUp')send(si-1,0);
 });
 const [a,b]=fromHash();sync(a,b);
}else{
 channel?.addEventListener('message',e=>{if(e.data.from==='ponente')go(e.data.si,e.data.k);});
 $('#hud').addEventListener('click',e=>{const a=e.target.closest('[data-act]')?.dataset.act;if(a==='prev')prev();if(a==='next')next();if(a==='overview')overview();if(a==='fullscreen')fullscreen();if(a==='presenter')openPresenter();if(a==='guide')window.open(location.pathname+'?guia','guia');});
 $('#overview').addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){overview(false);go(Number(b.dataset.go),0);}else if(e.target.id==='overview')overview(false);});
 stage.addEventListener('click',e=>{if(e.target.closest('a,button'))return;const r=stage.getBoundingClientRect();(e.clientX-r.left<r.width*.18?prev:next)();});
 let idle;document.addEventListener('pointermove',()=>{document.body.classList.add('show-hud');clearTimeout(idle);idle=setTimeout(()=>document.body.classList.remove('show-hud'),2200);});
 addEventListener('resize',()=>{lastPlace=null;apply(0);});
 const [a,b]=fromHash();
 document.fonts.ready.then(()=>go(a,b,1));
 globalThis.Escena={slides,go,next,prev,state:()=>({si,k,id:slides[si].id,view:view(slides[si],k)})};
}
})();

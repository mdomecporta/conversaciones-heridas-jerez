// Recursos propios de cada capítulo. Diagramas docentes, sin simular resultados clínicos.
(()=>{
 const node=(tag,className,text)=>{const e=document.createElement(tag);if(className)e.className=className;if(text)e.textContent=text;return e;};
 const asset=(id,data)=>{const a=data.assets[id],f=node('figure','resource-photo');if(!a)throw Error('Recurso no disponible: '+id);const img=node('img');img.src=a.src;img.alt=a.alt;f.append(img,node('figcaption','photo-label',id==='venous'?'Venosa · caso publicado':id==='arterial'?'Arterial · caso publicado':a.label));return f;};
 function tiles(items,kind='tiles'){const list=node(kind==='pact'?'ol':'div','visual-list '+kind);items.forEach((item,i)=>{const e=node(kind==='pact'?'li':'div','visual-item');e.dataset.item=i;e.append(node('span','item-number',String(i+1).padStart(2,'0')),node('strong','',item.title));if(item.text)e.append(node('p','',item.text));list.append(e);});return list;}
 function wounds(){const row=node('div','conceptual-wounds');for(let i=0;i<3;i++){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 160 65');svg.setAttribute('aria-hidden','true');svg.innerHTML='<path d="M8 23 C35 10 46 14 57 26 S100 52 116 26 S142 19 152 23 L152 60 L8 60Z" fill="var(--skin)"/><path d="M10 23 C35 12 46 16 58 28 S100 50 115 28 S141 21 150 23" fill="none" stroke="var(--coral)" stroke-width="5"/>';row.append(svg);}return row;}
 function constellation(data){const host=node('div','constellation');const title=node('div','constellation-title');title.append(node('strong','','47'),node('span','','recomendaciones del GNEAUPP XIV'),node('small','','13 vinculadas expresamente a las situaciones de hoy'));host.append(title);const groups=[...new Set(data.recommendations.items.map(r=>r.group))];const grid=node('div','constellation-groups');for(const group of groups){const items=data.recommendations.items.filter(r=>r.group===group),g=node('div','point-group');g.append(node('span','',items[0].groupTitle));const dots=node('div','point-dots');for(const r of items){const dot=node('i',r.illuminate?'selected':'');dot.title=r.summary;dot.setAttribute('aria-label',r.summary);dots.append(dot);}g.append(dots);grid.append(g);}host.append(grid);const more=node('div','complementary');['Infección y antimicrobianos','Limpieza y dolor','Persona y objetivos'].forEach(t=>more.append(node('span','',t)));host.append(more);return host;}

 let resourceMotion=[],resourceTimers=[];
 function stop(){resourceMotion.forEach(a=>a.cancel());resourceMotion=[];resourceTimers.forEach(clearTimeout);resourceTimers=[];delete document.querySelector('#stage')?.dataset.attention;const scene=document.querySelector('.measurement-scene');if(scene)delete scene.dataset.lit;}
 function attention(value){document.querySelector('#stage').dataset.attention=value;}
 function lightMeasurement(scene,index){scene.dataset.lit=String(index);attention('resource');}
 function measurement(chapter,phase,host){
  let scene=host.querySelector('.measurement-scene');
  if(!scene){
   scene=node('div','measurement-scene');
   scene.append(node('p','measurement-context','Ejemplo simulado · tres maneras de describir una herida'));
   const strips=node('div','measurement-strips');
   chapter.resource.items.forEach((item,i)=>{const card=node('article','measurement-slip');card.dataset.measure=String(i);card.append(node('span','measurement-time',item.title),node('strong','measurement-value',item.text),node('span','measurement-unit',['Una medida en centímetros','Una referencia corporal','Una comparación con un objeto'][i]));strips.append(card);});
   scene.append(strips,node('p','measurement-gap','¿Qué ha cambiado: la herida o la forma de medir?'));
   const record=node('section','measurement-register');record.setAttribute('aria-label','Ficha docente de valoración, sin datos de paciente');
   const heading=node('div','measurement-register-heading');heading.append(node('span','','Registro comparable'),node('small','','Un método consistente'));
   record.append(heading);
   const fields=node('div','measurement-fields');
   for(const [id,title,detail] of [['dimensions','Medidas','Longitud · anchura · profundidad'],['bed','Lecho','Tejido · exudado'],['skin','Entorno','Borde · piel perilesional'],['person','Persona','Dolor y situación']]){const field=node('div','measurement-field');field.dataset.field=id;field.append(node('strong','',title),node('p','',detail));fields.append(field);}
   const follow=node('div','measurement-follow');follow.append(node('span','','Fecha de valoración · —'),node('span','','Plan de revisión · —'));
   record.append(fields,follow,node('p','measurement-scope','Ficha general: no reproduce ni puntúa RESVECH 2.0.'));
   scene.append(record);host.append(scene);
  }
  scene.dataset.phase=String(phase);scene.dataset.thread=phase===3?'record':'descriptions';
  scene.querySelector('.measurement-gap').textContent=phase===1?'Tres descripciones. Ninguna comparación fiable.':'¿Qué ha cambiado: la herida o la forma de medir?';
  scene.querySelector('.measurement-register').hidden=phase!==3;
  scene.querySelector('.measurement-gap').hidden=phase===3;
  scene.querySelectorAll('.measurement-field').forEach(e=>e.classList.remove('is-active'));
  return scene;
 }
 function cueMeasurement(host,phase,turn){
  const scene=host.querySelector('.measurement-scene');if(!scene)return;
  if(turn.who==='Entrada'){attention(phase===3?'record':'resource');return;}
  if(phase===1&&turn.who==='Herida'){
   scene.dataset.thread='descriptions';attention('resource');
   if(matchMedia('(prefers-reduced-motion: reduce)').matches){scene.dataset.lit='all';return;}
   for(let i=0;i<3;i++)resourceTimers.push(setTimeout(()=>lightMeasurement(scene,i),720+i*1500));
   resourceTimers.push(setTimeout(()=>{scene.dataset.lit='all';},5500));
  }
  if(phase===1&&turn.who==='Rutina'){resourceTimers.forEach(clearTimeout);resourceTimers=[];delete scene.dataset.lit;attention('routine');}
  if(phase===1&&turn.who==='María del Mar'){stop();scene.dataset.thread='aligned';scene.dataset.lit='all';attention('compare');}
  if(phase===3){
   if(turn.who==='Herida'){const closing=turn.text.includes('sigo igual');scene.dataset.thread=closing?'review':'handover';attention(closing?'review':'record');if(closing)resourceTimers.push(setTimeout(()=>attention('conclusion'),1800));}
   if(turn.who==='Evidencia'){scene.dataset.thread='instrument';attention('evidence');}
   if(turn.who==='María del Mar'){const review=turn.text.includes('punto de partida');scene.dataset.thread=review?'review':'record';attention(review?'review':'record');}
  }
 }

 function photographicResource(chapter,phase,host,data){
  const swab=chapter.number===7,kind=swab?'swab':'zones';let scene=host.querySelector('.'+kind+'-scene');
  if(!scene){
   scene=node('div',kind+'-scene');
   if(swab){
    const image=node('div','swab-material');image.append(asset('swab',data));scene.append(image);
    const request=node('section','swab-request');request.append(node('p','request-label','Solicitud docente · microbiología'),node('h3','request-heading','Motivo clínico'));
    const empty=node('div','request-empty');empty.append(node('strong','','—'),node('p','','¿Qué necesitamos resolver?'));request.append(empty);
    const questions=node('div','request-questions');chapter.resource.items.forEach((item,i)=>{const q=node('div','request-question');q.dataset.question=String(i);q.append(node('strong','',item.title),node('p','',item.text));questions.append(q);});
    request.append(questions,node('p','request-condition','Valoración conjunta: un «sí» aislado no basta.'));
    const route=node('div','request-route');['Pregunta clínica','Muestra adecuada','Interpretación'].forEach((text,i)=>{const part=node('span','',text);part.dataset.route=String(i);route.append(part);});
    request.append(route,node('p','request-result','Un positivo no sustituye el diagnóstico ni decide por sí solo el antibiótico.'));scene.append(request);
   }else{
    const map=node('div','zones-map');const image=data.assets['wound-zones'];const img=node('img');img.src=image.src;img.alt=image.alt;map.append(img);
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 100 66.667');svg.setAttribute('aria-hidden','true');
    image.walkthrough.steps.forEach((zone,i)=>{const g=document.createElementNS(svg.namespaceURI,'g');g.dataset.zone=String(i);const x=zone.x,y=zone.y*2/3;g.innerHTML='<circle class="zone-target" cx="'+x+'" cy="'+y+'" r="1.7"/><path d="M'+x+' '+y+'L96 '+(10+i*13)+'H100"/><circle class="zone-node" cx="96" cy="'+(10+i*13)+'" r="2.7"/><text x="96" y="'+(10+i*13+1)+'">'+(i+1)+'</text>';svg.append(g);});map.append(svg);scene.append(map);
    const legend=node('ol','zones-legend');chapter.resource.items.forEach((item,i)=>{const row=node('li','zone-key');row.dataset.zone=String(i);row.append(node('span','zone-number',String(i+1)),node('strong','',item.title),node('p','',item.text));legend.append(row);});scene.append(legend);
    scene.append(node('p','zones-purpose','Observar qué retirar y qué proteger en cada zona.'));
   }
   host.append(scene);
  }
  scene.dataset.phase=String(phase);scene.dataset.active=swab?(phase===3?'questions':'material'):(phase===3?'all':'0');
  if(swab){scene.querySelector('.request-heading').textContent=phase===3?'Antes de solicitar, preguntar':'Motivo clínico';scene.querySelector('.request-empty').hidden=phase===3;scene.querySelector('.request-questions').hidden=phase!==3;scene.querySelector('.request-condition').hidden=phase!==3;scene.querySelector('.request-route').hidden=phase!==3;scene.querySelector('.request-result').hidden=phase!==3;}
 }
 function cuePhotographic(chapter,phase,turn,host){
  const swab=chapter.number===7,scene=host.querySelector(swab?'.swab-scene':'.zones-scene');if(!scene)return;
  const clear=()=>{resourceTimers.forEach(clearTimeout);resourceTimers=[];};
  const set=value=>{scene.dataset.active=value;};
  const sequence=(values,delay,interval)=>{clear();if(matchMedia('(prefers-reduced-motion: reduce)').matches){set(swab?'questions':'all');return;}values.forEach((v,i)=>resourceTimers.push(setTimeout(()=>set(v),delay+i*interval)));};
  if(turn.who==='Entrada'){attention('resource');return;}
  if(phase===1){
   if(turn.who==='Rutina'){clear();attention('routine');if(!swab)set('0');}
   if(turn.who==='Herida'){attention('resource');if(swab)set('material');else sequence(['1','2','3'],720,700);}
   if(turn.who==='María del Mar'){clear();attention('resource');set(swab?'request':'all');}
  }
  if(phase===3){
   if(turn.who==='María del Mar'){attention('record');set(swab?'questions':'all');}
   if(turn.who==='Evidencia'){clear();attention('evidence');set(swab?'interpretation':'all');}
   if(turn.who==='Herida'){
    const last=swab?turn.text.includes('pomada'):turn.text.includes('suero frío');
    attention(last?'review':'record');
    if(last){clear();set(swab?'interpretation':'all');resourceTimers.push(setTimeout(()=>attention('conclusion'),1800));}
    else sequence(swab?['01','23','questions']:['0','1','2','3','all'],swab?500:300,swab?1000:550);
   }
  }
 }
 function render(chapter,phase,data){
  const resource=document.querySelector('#resource'),host=document.querySelector('#resource-content'),tissue=document.querySelector('#tissue');
  const kind=chapter.resource.kind;resource.dataset.kind=kind;resource.dataset.phase=phase;tissue.hidden=kind!=='tissue';host.hidden=kind==='tissue';stop();const persistent={measurement:'.measurement-scene',swab:'.swab-scene',zones:'.zones-scene'}[kind];if(!persistent||!host.querySelector(persistent))host.replaceChildren();
  let caption='Esquema docente · no representa una paciente ni un resultado clínico';
  if(kind==='tissue')caption='Modelo conceptual generado · no representa una paciente ni una evolución clínica';
  else if(kind==='welcome'){
   if(phase===1)host.append(constellation(data));
   else if(phase===3){host.append(tiles([{title:'Doña Rutina',text:'Variabilidad · coste · dolor · resistencias'},{title:'Doña Evidencia',text:'Seguridad · reevaluación · respaldo documental'}],'balance'));host.append(node('p','visual-mantra','Identificar → Cuestionar → Sustituir'));}
   else {host.append(node('div','welcome-question','¿Es posible cicatrizar todas las heridas?'));host.append(tiles(chapter.resource.items,'welcome-steps'));}
  }else if(kind==='cases'){
   const photos=node('div','case-pair');photos.append(...chapter.resource.media.map(id=>asset(id,data)));host.append(photos);host.append(node('p','case-etiologies','Venosa · Arterial · Pie diabético · Presión · Humedad · Tumoral · Quirúrgica · Quemaduras de evolución tórpida · Atípicas'));
   caption='Casos publicados independientes · Jonathan Moore / FAOJ · Wikimedia Commons · CC BY 3.0';
  }else if(kind==='continuum'){
   host.append(wounds(),tiles(chapter.resource.items,'continuum-track'));
   caption='Heridas y personalidades ficticias · colores sin significado clínico';
   host.append(node('p','visual-note','El biofilm es un concepto distinto: no se confirma por el aspecto o el color.'));
  }else if(kind==='swab'||kind==='zones'){
   photographicResource(chapter,phase,host,data);caption=kind==='swab'?'Material: Whispyhistory · CC BY-SA 4.0 · ejemplo, no demostración de técnica. Selección según laboratorio.':data.assets['wound-zones'].caption;
  }else if(['triage','priorities','shared'].includes(kind)){
   const ids={zones:'wound-zones',triage:'heel',priorities:'daily-life',shared:'shared-care'};
   const layout=node('div','photo-and-list'),media=node('div','media-stack');media.append(...(chapter.resource.media.length?chapter.resource.media:[ids[kind]]).map(id=>asset(id,data)));layout.append(media,tiles(chapter.resource.items,kind==='triage'?'traffic':'photo-points'));host.append(layout);caption=data.assets[ids[kind]].caption;
  }else if(kind==='closing'){
   if(phase===0)host.append(tiles(chapter.resource.items,'decalogue'));
   else if(phase===3){host.append(node('p','farewell-mantra','Menos rutina. Más preguntas. Más escucha.'));host.append(node('p','farewell-note','En la próxima cura, escuchamos.'));}
   else host.append(tiles([{title:'¿Qué sabemos?',text:'La causa y lo que mantiene la herida'},{title:'¿Qué necesita?',text:'La persona, sus prioridades y objetivos'},{title:'¿Cuándo revisamos?',text:'La decisión, su respuesta y la escucha'}],'final-questions'));
  }else if(kind==='timeline'){
   const track=tiles(phase===3?[{title:'Valoración',text:'Revisar causa y condiciones'},{title:'Revisión planificada',text:'Comparar y escuchar la respuesta'},{title:'Decisión',text:'Mantener, reformular o consultar'}]:chapter.resource.items,'timeline-track');host.append(track,node('p','visual-note',phase===3?'Valoración → revisión planificada → decisión':'Simulación docente: tres contornos iguales, sin evolución atribuida a una paciente.'));
   if(phase!==3)track.querySelectorAll('.visual-item').forEach(e=>e.prepend(node('span','wound-contour')));
  }else if(kind==='measurement'){
   measurement(chapter,phase,host);caption='Ejemplo simulado · sin datos de paciente ni conversión entre las tres descripciones';
  }else if(kind==='prescription'){
   host.append(tiles(chapter.resource.items.map(i=>({...i,text:phase===3?i.text:'— Por justificar'})),'prescription'));
  }else if(kind==='agreement'&&phase!==3){
   host.append(node('blockquote','assumed-plan','«Usted no se preocupe, que yo ya sé lo que le conviene»'));
   host.append(node('p','visual-note','Un plan explicado puede seguir dejando preguntas sin expresar.'));
  }else{
   if(kind==='network'){const roles=node('div','network-roles');['Primaria','Hospital','Vascular','Dermatología','Cirugía','Comisión de heridas'].forEach(t=>roles.append(node('span','',t)));host.append(roles);}
   if(kind==='participation')host.append(node('div','participation-seat','Experiencia de la persona → decisiones que podamos cambiar'));
   host.append(tiles(chapter.resource.items,kind));
  }
  resource.querySelector(':scope > figcaption').textContent=caption;
 }
 const normalize=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function cue(chapter,phase,turn){
  const host=document.querySelector('#resource-content'),items=[...host.querySelectorAll('[data-item]')];
  host.dataset.voice=turn.who;
  if(chapter.resource.kind==='measurement')cueMeasurement(host,phase,turn);
  if([7,11].includes(chapter.number))cuePhotographic(chapter,phase,turn,host);
  const text=normalize(turn.text||'');
  const matches=items.filter(el=>normalize(el.querySelector('strong')?.textContent||'').split(/[^a-z]+/).filter(w=>w.length>4).some(w=>text.includes(w)));
  if(matches.length){items.forEach(el=>el.classList.toggle('is-focus',matches.includes(el)));}
  else if(turn.who==='Entrada'){items.forEach(el=>el.classList.remove('is-focus'));if(phase===1&&![6,12].includes(chapter.number))items[0]?.classList.add('is-focus');}
  const options=[...document.querySelectorAll('#explanation .option')];
  options.forEach(el=>{const words=normalize(el.querySelector('h3').textContent).split(/[^a-z]+/).filter(w=>w.length>5);el.classList.toggle('is-mentioned',words.some(w=>text.includes(w)));});
 }
 window.RecorridoResources={render,cue,stop};
})();

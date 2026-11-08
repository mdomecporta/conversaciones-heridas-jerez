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
   if(turn.who==='María del Mar'){
    clear();attention('record');
    if(turn.id===(swab?'c7-b2-t1':'c11-b2-t1')){
     // Hitos editoriales dentro de la intervención que explica el recurso (150 palabras/min).
     const cues=swab?[[0,'01'],[11,'23'],[18,'questions']]:[[0,'0'],[9,'1'],[16,'2'],[24,'3'],[37,'all']];
     if(matchMedia('(prefers-reduced-motion: reduce)').matches)set(swab?'questions':'all');
     else cues.forEach(([word,value])=>{if(word===0)set(value);else resourceTimers.push(setTimeout(()=>set(value),word*400));});
    }else set(swab?'interpretation':'all');
   }
   if(turn.who==='Evidencia'){clear();attention('evidence');set(swab?'interpretation':'all');}
   if(turn.who==='Herida'){
    const last=swab?turn.text.includes('pomada'):turn.text.includes('suero frío');
    attention(last?'review':'record');
    if(last){clear();set(swab?'interpretation':'all');resourceTimers.push(setTimeout(()=>attention('conclusion'),1800));}
    else {clear();set(swab?'questions':'all');}
   }
  }
 }

 // Composiciones por tipo de recurso. Un solo DOM por capítulo: las tres escenas se revelan con data-phase, sin sustituir lo que ya se ve.
 const svgNS='http://www.w3.org/2000/svg';
 const art=(markup,cls,box='0 0 100 100',ratio)=>{const e=document.createElementNS(svgNS,'svg');e.setAttribute('viewBox',box);e.setAttribute('aria-hidden','true');e.setAttribute('class','art '+(cls||''));if(ratio)e.setAttribute('preserveAspectRatio',ratio);e.innerHTML=markup;return e;};
 const card=(item,i,detailClass='',cls='')=>{const e=node('div','visual-item '+cls);e.dataset.item=i;e.append(node('strong','',item.title));if(item.text)e.append(node('p',detailClass,item.text));return e;};
 const row=(cls,children)=>{const e=node('div',cls);e.append(...children);return e;};
 const decision=c=>row('decision only-3',c.options.map((o,i)=>row('decision-way',[...(c.number===10?[node('span','decision-condition',i===0?'Sin indicación antimicrobiana':'Con indicación antimicrobiana')]:[]),node('strong','',o.title),node('p','',o.text)])));
 const contour='<path class="contour" d="M18 50c-4-18 12-34 32-33s36 13 33 33-20 33-37 32-24-14-28-32Z"/>';
 const media=(c,data,fallback)=>{const m=node('div','scene-media');m.append(...(c.resource.media.length?c.resource.media:[fallback]).map(id=>asset(id,data)));return m;};
 const scenes={
  tissue(){},
  cases(c,s,data){const photos=node('div','case-pair art');photos.append(...c.resource.media.map(id=>asset(id,data)));s.append(photos,node('p','case-etiologies from-1','Venosa · Arterial · Pie diabético · Presión · Humedad · Tumoral · Quirúrgica · Quemaduras de evolución tórpida · Atípicas'));},
  timeline(c,s){
   s.append(row('visits until-1',c.resource.items.map((it,i)=>{const v=card(it,i,'','visit');v.prepend(art(contour,'visit-contour'));return v;})));
   s.append(row('review-line only-3',[['Valoración','Revisar causa y condiciones'],['Revisión planificada','Comparar y escuchar la respuesta'],['Decisión','Mantener, reformular o consultar']].map(([title,text],i)=>card({title,text},i))));
   s.append(node('p','visual-note until-1','Simulación docente: tres contornos iguales, sin evolución atribuida a una paciente.'));
  },
  causes(c,s){
   const hub=node('div','hub art'),n=c.resource.items.length,half=n/2;
   let lines='';for(let i=0;i<n;i++){const y=100*((i%half)+.5)/half,x=i<half?30:70;lines+='<path d="M50 50C'+(i<half?40:60)+' 50 '+(i<half?40:60)+' '+y+' '+x+' '+y+'" pathLength="1"/>';}
   hub.append(art(lines,'hub-lines','0 0 100 100','none'));
   const col=part=>row('hub-col',part.map(([it,i])=>card(it,i,'from-1')));const all=c.resource.items.map((it,i)=>[it,i]);
   hub.append(col(all.slice(0,half)),row('hub-core',[node('span','only-0','Una respuesta'),node('span','from-1','La causa')]),col(all.slice(half)));s.append(hub);
  },
  continuum(c,s){const track=row('continuum-track art',c.resource.items.map((it,i)=>{const e=card(it,i,'','stage-point');e.prepend(node('i','stage-dot'));return e;}));s.append(wounds(),track,node('p','visual-note','El biofilm es un concepto distinto: no se confirma por el aspecto o el color.'));},
  risks(c,s){
   const tube=art('<path class="tube-body" d="M30 18h100l12 12v40l-12 12H30Z"/><path class="tube-cap" d="M142 36h26a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4h-26Z"/><path class="tube-fold" d="M30 18v64M40 18v64"/>','tube','0 0 200 100');
   s.append(row('tube-stage art',[row('tube-slot from-1',[node('strong','','Causa pendiente')]),tube]),row('risk-row from-1',c.resource.items.map((it,i)=>card(it,i))));
  },
  prescription(c,s){s.append(row('rx art',c.resource.items.map((it,i)=>{const e=node('div','visual-item rx-line');e.dataset.item=i;e.append(node('strong','',it.title),node('p','rx-blank until-1','Por justificar'),node('p','only-3',it.text));return e;})));},
  pressure(c,s){s.append(row('forces art',c.resource.items.map((it,i)=>{const e=card(it,i,'','force');e.prepend(art('<path d="M8 20C30 20 34 44 60 44" style="stroke-width:'+[2,5,11][i]+'"/><circle cx="60" cy="44" r="'+[3,7,14][i]+'"/>','force-art','0 0 80 60'));return e;})));},
  triage(c,s,data){s.append(row('photo-and-list art',[media(c,data,'heel'),row('visual-list traffic',c.resource.items.map((it,i)=>card(it,i,'from-1')))]));},
  paths(c,s){s.append(art('<path d="M100 2C100 16 40 12 40 28"/><path d="M100 2C100 16 160 12 160 28"/>','fork','0 0 200 30'),row('path-pair art',c.resource.items.map((it,i)=>card(it,i,'from-1'))));},
  network(c,s){
   s.append(row('network-roles',['Primaria','Hospital','Vascular','Dermatología','Cirugía','Comisión de heridas'].map(t=>node('span','',t))));
   s.append(row('circuit art',[art('<path class="circuit-go" d="M12 20H88" pathLength="1"/><path class="circuit-back" d="M88 20C88 36 12 36 12 20" pathLength="1"/>','circuit-line','0 0 100 40','none'),row('stations',c.resource.items.map((it,i)=>{const e=card(it,i,'from-1','station');e.dataset.station=i;e.prepend(node('i','station-dot'));return e;}))]));
   s.append(node('p','visual-note only-3','Esquema docente: no es el circuito oficial del centro.'));
  },
  priorities(c,s,data){s.append(row('photo-and-list art',[media(c,data,'daily-life'),row('windows',c.resource.items.map((it,i)=>card(it,i,'from-1','life-window')))]));},
  pact(c,s){s.append(row('pact-layout art',[art('<path d="M18 62V30a5 5 0 0 1 10 0v20V16a5 5 0 0 1 10 0v34V12a5 5 0 0 1 10 0v38V18a5 5 0 0 1 10 0v44l9-11a5.500 5.500 0 0 1 8 7L60 86c-4 6-9 9-18 9-16 0-24-10-24-33Z"/>','hand'),tiles(c.resource.items,'pact')]));},
  agreement(c,s){
   s.append(node('blockquote','assumed-plan until-1','«Usted no se preocupe, que yo ya sé lo que le conviene»'),node('p','visual-note until-1','Un plan explicado puede seguir dejando preguntas sin expresar.'));
   s.append(art('<path d="M4 4C50 4 60 26 100 26"/><path d="M196 4C150 4 140 26 100 26"/><circle cx="100" cy="26" r="4"/>','meet only-3','0 0 200 32'),row('agree-steps only-3',c.resource.items.map((it,i)=>card(it,i))));
  },
  shared(c,s,data){s.append(row('photo-and-list art',[media(c,data,'shared-care'),row('return-loop',[art('<path d="M10 8V92" pathLength="1"/><path d="M4 86l6 8 6-8"/>','loop-line','0 0 20 100','none'),row('visual-list',c.resource.items.map((it,i)=>card(it,i,'from-1')))])]));},
  symptoms(c,s){const icons=['<circle cx="30" cy="30" r="6"/><circle cx="30" cy="30" r="14"/><circle cx="30" cy="30" r="22"/>','<path d="M30 8C20 24 14 30 14 38a16 16 0 0 0 32 0c0-8-6-14-16-30Z"/>','<path d="M8 38l9-14 9 14 9-14 9 14 8-12"/>','<path d="M22 12c-6 10-9 13-9 18a9 9 0 0 0 18 0c0-5-3-8-9-18ZM42 34c-3 5-5 7-5 10a5 5 0 0 0 10 0c0-3-2-5-5-10Z"/>'];s.append(row('signals art',c.resource.items.map((it,i)=>{const e=card(it,i,'from-1','signal');e.prepend(art(icons[i],'signal-art','0 0 60 60'));return e;})));},
  participation(c,s){
   let seats='';for(let i=0;i<6;i++){const a=i*Math.PI/3-Math.PI/2,x=50+34*Math.cos(a),y=50+34*Math.sin(a);seats+='<circle class="seat'+(i===0?' seat-open':'')+'" cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="9"/>';}
   s.append(row('seat-layout art',[art('<circle class="table" cx="50" cy="50" r="20"/>'+seats,'seats'),row('visual-list',c.resource.items.map((it,i)=>card(it,i,'from-1')))]),node('div','participation-seat only-1','Experiencia de la persona → decisiones que podamos cambiar'));
  }
 };
 function settle(chapter,phase){
  resourceTimers.forEach(clearTimeout);resourceTimers=[];attention(phase===3?'conclusion':'resource');
  const scene=document.querySelector('.swab-scene,.zones-scene');if(scene)scene.dataset.active=chapter.number===7?(phase===3?'interpretation':'request'):'all';
 }
 function cueScene(chapter,phase,turn){
  if(turn.who==='Entrada'){attention('resource');return;}
  attention({Rutina:'routine',Evidencia:'evidence','María del Mar':'record'}[turn.who]||'resource');
  const last=chapter.steps.flatMap(s=>s.turns).at(-1);
  if(phase===3&&turn.id===last?.id)resourceTimers.push(setTimeout(()=>attention('conclusion'),1800));
 }
 function render(chapter,phase,data){
  const resource=document.querySelector('#resource'),host=document.querySelector('#resource-content'),tissue=document.querySelector('#tissue');
  const kind=chapter.resource.kind;resource.dataset.kind=kind;resource.dataset.phase=phase;tissue.hidden=kind!=='tissue';host.hidden=false;stop();const persistent={measurement:'.measurement-scene',swab:'.swab-scene',zones:'.zones-scene'}[kind],builder=scenes[kind];
  if(builder){let scene=host.querySelector(':scope > .scene');if(!scene||scene.dataset.chapter!==String(chapter.number)){host.replaceChildren();scene=node('div','scene scene-'+kind);scene.dataset.chapter=String(chapter.number);builder(chapter,scene,data);scene.append(decision(chapter));host.append(scene);}scene.dataset.phase=String(phase);}
  else if(!persistent||!host.querySelector(persistent))host.replaceChildren();
  let caption='Esquema docente · no representa una paciente ni un resultado clínico';
  if(kind==='tissue')caption='Modelo conceptual generado · no representa una paciente ni una evolución clínica';
  else if(kind==='welcome'){
   if(phase===1)host.append(constellation(data));
   else if(phase===3){host.append(tiles([{title:'Doña Rutina',text:'Variabilidad · coste · dolor · resistencias'},{title:'Doña Evidencia',text:'Seguridad · reevaluación · respaldo documental'}],'balance'));host.append(node('p','visual-mantra','Identificar → Cuestionar → Sustituir'));}
   else {host.append(node('div','welcome-question','¿Es posible cicatrizar todas las heridas?'));host.append(tiles(chapter.resource.items,'welcome-steps'));}
  }else if(kind==='cases'){
   caption='Casos publicados independientes · Jonathan Moore / FAOJ · Wikimedia Commons · CC BY 3.0';
  }else if(kind==='continuum'){
   caption='Heridas y personalidades ficticias · colores sin significado clínico';
  }else if(kind==='swab'||kind==='zones'){
   photographicResource(chapter,phase,host,data);caption=kind==='swab'?'Material: Whispyhistory · CC BY-SA 4.0 · ejemplo, no demostración de técnica. Selección según laboratorio.':data.assets['wound-zones'].caption;
  }else if(['triage','priorities','shared'].includes(kind)){
   caption=data.assets[{triage:'heel',priorities:'daily-life',shared:'shared-care'}[kind]].caption;
  }else if(kind==='closing'){
   if(phase===0)host.append(tiles(chapter.resource.items,'decalogue'));
   else if(phase===3){host.append(node('p','farewell-mantra','Menos rutina. Más preguntas. Más escucha.'));host.append(node('p','farewell-note','En la próxima cura, escuchamos.'));}
   else host.append(tiles([{title:'¿Qué sabemos?',text:'La causa y lo que mantiene la herida'},{title:'¿Qué necesita?',text:'La persona, sus prioridades y objetivos'},{title:'¿Cuándo revisamos?',text:'La decisión, su respuesta y la escucha'}],'final-questions'));
  }else if(kind==='measurement'){
   measurement(chapter,phase,host);caption='Ejemplo simulado · sin datos de paciente ni conversión entre las tres descripciones';
  }
  resource.querySelector(':scope > figcaption').textContent=caption;
 }
 // Focos editoriales por intervención. Nunca se deduce una clasificación clínica de palabras sueltas.
 // Cada hito indica palabras transcurridas del turno de María y los índices del recurso a iluminar.
 const FOCUS_CUES={
  'c4-b1-t1':[[0,[0,1,2]]], 'c4-b2-t1':[[0,[0]],[18,[1]],[46,[2]]],
  'c5-b2-t1':[[0,[0]],[5,[1]],[19,[2]],[28,[3]],[38,[6]],[46,[5]],[54,[4]],[63,[7]]],
  'c8-b1-t2':[[0,[0,1,2]]], 'c8-b1-t3':[[0,[0,1,2]]],
  'c9-b1-t3':[[0,[0,1,2,3]]], 'c9-b2-t1':[[0,[0]],[16,[1]],[25,[2]],[43,[3]]],
  'c12-b1-t3':[[0,[0]],[19,[2]]], 'c12-b3-t2':[[0,[1]]],
  'c13-b1-t3':[[0,[0,1,2]]], 'c13-b2-t1':[[0,[2]],[40,[1,2]]], 'c13-b3-t2':[[0,[1,2]]],
  'c14-b2-t1':[[0,[0]],[17,[1]]],
  'c15-b2-t1':[[0,[0,1]]], 'c15-b3-t2':[[0,[2]],[13,[3]]],
  'c16-b1-t1':[[0,[0,1,2,3]]], 'c16-b2-t1':[[0,[0,1,2,3]]],
  'c17-b1-t3':[[0,[0,3]]], 'c17-b2-t1':[[0,[1]],[7,[2]],[20,[3]],[24,[4]],[36,[5]]],
  'c18-b2-t1':[[0,[0,1]]], 'c18-b3-t2':[[0,[2]],[19,[3]]],
  'c19-b2-t1':[[0,[0]],[25,[1]],[43,[2]]], 'c19-b3-t2':[[0,[3]]],
  'c20-b2-t1':[[0,[0]],[33,[1]],[43,[2]],[49,[3]]],
  'c21-b2-t1':[[0,[0]],[16,[1]]], 'c21-b3-t2':[[0,[2,3]]]
 };
 function cue(chapter,phase,turn){
  const host=document.querySelector('#resource-content'),items=[...host.querySelectorAll('[data-item]')];
  resourceTimers.forEach(clearTimeout);resourceTimers=[];
  host.dataset.voice=turn.who;
  items.forEach(el=>el.classList.remove('is-focus'));
  document.querySelectorAll('#explanation .option').forEach(el=>el.classList.remove('is-mentioned'));
  if(chapter.resource.kind==='measurement')cueMeasurement(host,phase,turn);
  if([7,11].includes(chapter.number))cuePhotographic(chapter,phase,turn,host);
  if(scenes[chapter.resource.kind])cueScene(chapter,phase,turn);
  const apply=indices=>items.forEach(el=>el.classList.toggle('is-focus',indices.includes(Number(el.dataset.item))));
  const cues=FOCUS_CUES[turn.id]||[];
  if(reducedMotion()&&cues.length){apply([...new Set(cues.flatMap(([,indices])=>indices))]);return;}
  cues.forEach(([word,indices])=>{if(word===0)apply(indices);else resourceTimers.push(setTimeout(()=>apply(indices),word*400));});
 }
 function reducedMotion(){return matchMedia('(prefers-reduced-motion: reduce)').matches;}
 window.RecorridoResources={render,cue,stop,settle};
})();

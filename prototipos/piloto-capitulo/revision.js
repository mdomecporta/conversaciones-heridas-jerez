/* Dos avances en el piloto; la entrada coreografiada y los turnos se encadenan sin clics adicionales. */
(()=>{
 if(globalThis.RECORRIDO_PONENTE)return;
 const $=s=>document.querySelector(s),stage=$('#stage'),zone=$('.orb-zone');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const acts=['Apertura','Diagnóstico','Infección','Limpieza','Circuitos','Humanización','Cierre'];
 const EASE='cubic-bezier(.45,0,.2,1)',ENTER='cubic-bezier(.22,1,.36,1)';
 const ENTRY={hold:2000,fold:1800,resourceDelay:1100,resourceDuration:1100,chatDelay:1850,chatDuration:850,voiceDelay:500};
 let activeNeighbor=-1,step=0,data=null,deck=null,animations=[],timers=[],epoch=0,mounted=false,callConnected=false;
 const sessionId=crypto.randomUUID();
 let chainRunning=false;const channel='BroadcastChannel' in globalThis?new BroadcastChannel('recorrido-ponente:'+sessionId):null;
 let audio=null,voices=[],ringtone=[],soundCount=0,pendingTyping=null,playedTypingKey=null,typingSerial=0;
 const hero=$('#chapter').cloneNode(true);hero.id='chapter-hero';hero.querySelector('#act-toggle')?.replaceWith(document.createTextNode('Infección'));hero.setAttribute('aria-hidden','true');stage.append(hero);
 function stopVoices(nodes){nodes.forEach(o=>{try{o.stop();}catch{}});}
 function cancel(){RecorridoResources.stop?.();chainRunning=false;epoch++;pendingTyping=null;playedTypingKey=null;timers.forEach(clearTimeout);timers=[];animations.forEach(a=>a.cancel());animations=[];stopVoices(voices);voices=[];ringtone=[];}
 function later(ms,fn){const revision=epoch;timers.push(setTimeout(()=>{if(revision===epoch)fn();},reduced.matches?Math.min(ms,120):ms));}
 function animate(el,frames,options){if(reduced.matches)return null;const a=el.animate(frames,options);animations.push(a);return a;}
 function mode(value){stage.dataset.mode=value;}
 function rect(el){const r=el.getBoundingClientRect(),s=stage.getBoundingClientRect();return {left:r.left-s.left,top:r.top-s.top,width:r.width,height:r.height};}
 const box=r=>Object.fromEntries(Object.entries(r).map(([k,v])=>[k,v+'px']));
 function resize(el,from,to,duration=1450){animate(el,[box(from),box(to)],{duration,easing:EASE});}
 function presence(state,words=''){
  Presence.reset();
  const zones=data?.number===6?$$('.neighbor-zone'):[zone];
  zones.forEach((z,i)=>{z.dataset.state=data?.number===6&&i!==activeNeighbor?'listening':state;});
  Presence.mount(zones,{motion:!reduced.matches});mounted=true;
  if(words)Presence.cue(state,{who:data?.number===6?Math.max(0,activeNeighbor):0,think:0,speak:Math.min(5200,Math.max(1100,words.split(/\s+/).length*115))});
 }
 function announce(){if(channel&&data)channel.postMessage({state:{chapter:data.number,step,turn:stage.dataset.turn||'',running:chainRunning}});}
 function cueTurn(turn){
  stage.dataset.turn=turn.id||'';
  RecorridoResources.cue(data,step,turn);
  if(callConnected&&turn.text===data.actorPlan.reactionTrigger)stage.dataset.routinePose='reaction';
  announce();
 }
 function unlockAudio(){try{audio??=new AudioContext();if(audio.state==='suspended')audio.resume().then(flushTyping).catch(()=>{});else flushTyping();}catch{}}
 function tones(notes,volume=.055,timbre='sine'){
  const nodes=[];if(!audio||audio.state!=='running')return nodes;
  try{const now=audio.currentTime+.02;notes.forEach(([frequency,delay,duration=.65,endFrequency])=>{
   const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.type=timbre;oscillator.frequency.setValueAtTime(frequency,now+delay);
   if(endFrequency)oscillator.frequency.exponentialRampToValueAtTime(endFrequency,now+delay+duration);
   gain.gain.setValueAtTime(0,now+delay);gain.gain.linearRampToValueAtTime(volume,now+delay+Math.min(.012,duration*.25));gain.gain.exponentialRampToValueAtTime(.0001,now+delay+duration);
   oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(now+delay);oscillator.stop(now+delay+duration+.02);voices.push(oscillator);nodes.push(oscillator);
   oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();voices=voices.filter(o=>o!==oscillator);};
  });}catch{}return nodes;
 }
 function flushTyping(){
  if(!pendingTyping||!audio||audio.state!=='running')return;
  const {revision,who,key}=pendingTyping;
  if(revision!==epoch||stage.dataset[who]!=='typing'){pendingTyping=null;return;}
  if(playedTypingKey===key)return;
  // Un grupo por entrada real en escritura; reanudar audio no duplica ni pierde el turno.
  const nodes=tones([[920,0,.035],[1160,.12,.028],[980,.26,.032]],.019,'triangle');
  if(nodes.length){playedTypingKey=key;pendingTyping=null;}
 }
 function typingSound(who){pendingTyping={revision:epoch,who,key:epoch+':'+who+':'+(++typingSerial)};flushTyping();}
 function messageSound(who){
  if(who==='routine')tones([[580,0,.075,720],[840,.075,.11]],.027);
  else tones([[720,0,.12,1040]],.032);
 }
 function notification(){tones([[880,0],[1318.5,.11]],.065);soundCount++;stage.dataset.notifications=String(soundCount);}
 function callState(state){stage.dataset.call=state;$('#routine').setAttribute('aria-hidden',String(state!=='connected'));$('#incoming-call').setAttribute('aria-hidden',String(!['ringing','connecting'].includes(state)));$('#call-status').textContent=state==='connecting'?'Conectando…':'Llamando…';}
 function woundState(state){stage.dataset.wound=state;$('#wound-status').textContent={waiting:'Escuchando',typing:'Escribiendo…',speaking:'Hablando',listening:'Escuchando'}[state];if(state==='typing')typingSound('wound');}
 function routineState(state){stage.dataset.routine=state;$('#video-status').textContent=({waiting:'Escuchando',typing:'Escribiendo…',speaking:'Hablando',listening:'Escuchando'}[state]);if(state==='typing')typingSound('routine');}
 function sayWound(text,state,{instant=false,onDone=()=>{}}={}){
  if(data.number===6){activeNeighbor=(activeNeighbor+1)%3;stage.dataset.neighborSpeaker=String(activeNeighbor);}
  $('#voice-name').textContent=data.number===6?'Vecinas':'Úrsula';$('#wound-text').textContent=text;
  stage.dataset.longMessage=String(text.length>170);
  const duration=Math.min(12000,Math.max(2300,text.split(/\s+/).length*210));
  if(instant||reduced.matches){woundState('speaking');presence(state,text);if(!instant)messageSound('wound');onDone();return;}
  woundState('typing');presence('listening');
  later(720,()=>{woundState('speaking');presence(state,text);messageSound('wound');later(duration,()=>{woundState('listening');presence(state);onDone();});});
 }
 function sayRoutine(text,onDone,{instant=false}={}){
  if(!text){routineState('listening');onDone();return;}
  $('#routine-text').textContent=text;routineState(instant||reduced.matches?'speaking':'typing');woundState('waiting');presence('listening');
  const reveal=()=>{routineState('speaking');messageSound('routine');later(Math.min(12000,Math.max(2200,text.split(/\s+/).length*210)),()=>{routineState('listening');onDone();});};
  if(instant||reduced.matches){routineState('listening');onDone();}else later(650,reveal);
 }
 function showEvidence({notify=true}={}){
  if(data.structure.kind==='chapter')stage.dataset.uiEvidence='true';
  const ev=$('#evidence');ev.hidden=false;if(callConnected)stage.dataset.routinePose='reaction';
  // La carpeta se activa, marca su respaldo y despliega la ficha; el estado final es siempre el mismo.
  if(!notify||reduced.matches||data.structure.kind!=='chapter'){ev.dataset.phase='open';if(notify)notification();if(data.structure.kind!=='chapter')animate(ev,[{opacity:0,transform:'translateY(2cqh) scale(.96)'},{opacity:1,transform:'none'}],{duration:650,easing:ENTER});return;}
  ev.dataset.phase='idle';later(250,()=>{ev.dataset.phase='active';});later(850,()=>{ev.dataset.phase='checked';notification();});later(1250,()=>{ev.dataset.phase='open';});
 }
 function playTurns(turns,{instant=false,onDone=()=>{}}={}){
  chainRunning=!instant&&!reduced.matches;
  const visible=data.number===1&&step===0&&arrivalPresented?turns.map(t=>t.who==='Herida'&&t.text.startsWith('Hola, soy Úrsula. ')?{...t,text:t.text.replace('Hola, soy Úrsula. ','')}:t):turns;
  let index=0;
  const nextTurn=()=>{
   const turn=visible[index++];if(!turn){chainRunning=false;if(instant||reduced.matches)RecorridoResources.settle?.(data,step);announce();onDone();return;}
   cueTurn(turn);
   // La conversación espera a la ponente (150 palabras/minuto); avanzar siempre cambia de escena.
   if(turn.who==='María del Mar'){if(instant||reduced.matches)nextTurn();else{woundState('listening');presence('listening');later(Math.max(1500,turn.text.split(/\s+/).length*400),nextTurn);}return;}
   if(turn.who==='Evidencia'){showEvidence({notify:!instant});if(instant||reduced.matches)nextTurn();else later(2200,nextTurn);return;}
   if(turn.who==='Rutina'){
    const speak=()=>sayRoutine(turn.text,nextTurn,{instant});
    if(callConnected)speak();else ensureCall(speak,{instant});
   }else{
    const mood=data.structure.kind==='chapter'?(step===3?'relief':step===1?'discomfort':'idle'):data.structure.kind==='closing'?'relief':step===1?'listening':'idle';
    sayWound(turn.text,mood,{instant,onDone:nextTurn});
    if(turn.who==='Vecinas')$('#voice-name').textContent='Vecinas';
   }
  };nextTurn();
 }
 function ensureCall(onReady,{instant=false}={}){
  if(callConnected){callState('connected');onReady();return;}
  if(instant){callConnected=true;callState('connected');stage.dataset.routinePose=step===3&&data.number!==1?'reaction':'offer';onReady();return;}
  stage.dataset.routinePose='offer';callState('ringing');woundState('waiting');presence('listening');
  ringtone=tones([[523.25,0,.18],[659.25,.18,.18],[783.99,.36,.23],[523.25,.85,.18],[659.25,1.03,.18],[783.99,1.21,.23]],.038);
  later(1050,()=>callState('connecting'));
  later(1750,()=>{stopVoices(ringtone);ringtone=[];callConnected=true;callState('connected');if(step===3&&data.number!==1)stage.dataset.routinePose='reaction';tones([[660,0,.09],[880,.1,.22]],.045);animate($('#routine'),[{opacity:0,transform:'translateY(2cqh) scale(.96)'},{opacity:1,transform:'none'}],{duration:650,easing:ENTER});later(instant?0:300,onReady);});
 }
 function setStep(n){
  delete stage.dataset.uiEvidence;
  step=n;stage.dataset.step=String(n);announce();
  const hash=stage.dataset.initialChapter==='10'&&data.number===10?(n?'#'+n:''):'#capitulo-'+data.number+'/'+(n===3?2:n);
  history.replaceState(null,'',location.pathname+location.search+hash);
  $('#position').textContent=data.structure.kind==='chapter'?`Capítulo ${data.number} de 22 · escena ${n===3?3:n+1} de 3`:data.act+' · '+data.structure.titles[n];
 }
 function setLabels(n){
  const titles=data.titles||[data.resource.title,data.question,data.resource.title];
  $('#resource-title').textContent=data.number===1&&n===1?'47 puntos de partida. Más fuentes para decidir.':data.number===1&&n===3?'Úrsula presenta a Doña Rutina':titles[n===3?2:n];
  $('#focus-title').textContent=data.question;
  $('#focus-detail').textContent=n===3?data.condition:n===1?data.question:'Observar · preguntar · decidir';
  $('#explanation-label').textContent=n===3?'Nos llevamos':'Nos preguntamos';
  $('#question').textContent=n===3?data.takeaway:data.question;
  const labels=data.number===10?['Sin indicación antimicrobiana','Con indicación']:['Valorar','Actuar con criterio'];
  ['#option-clean','#option-indication'].forEach((sel,i)=>{const el=$(sel),option=data.options[i];el.querySelector('span').textContent=labels[i];el.querySelector('h3').textContent=option.title;el.querySelector('p').textContent=option.text;});
  RecorridoResources.render(data,n,deck);
  RecorridoResources.cue(data,n,{who:'Entrada',text:data.introWound});
 }
 function finishEntrance({instant=false}={}){
  if(instant)stage.dataset.entryInstant='true';
  mode('opening');$('#chapter-hero').style.visibility='hidden';$('#evidence').hidden=true;
  if(data.number===1)playTurns(data.steps[0].turns,{instant});else sayWound(data.introWound,'idle',{instant});
 }
 function entrance({animateEntry=true}={}){
  cancel();setStep(0);delete stage.dataset.entryInstant;callConnected=false;stage.dataset.routinePose='offer';callState('off');$('#evidence').hidden=true;
  delete stage.dataset.titleDocked;$('#chapter-hero').style.visibility='';setLabels(0);$('#wound-text').textContent='';woundState('waiting');routineState('waiting');mode('intro');presence('idle');
  if(data.number===1&&!journeySeen&&animateEntry){beginJourney();return;}
  if(data.structure.kind!=='chapter'){renderFrame(0,{instant:!animateEntry});return;}
  if(!animateEntry||reduced.matches){finishEntrance({instant:true});return;}
  // El título grande permanece como una pieza independiente: viaja por transform sin reflujo de tipografía.
  later(ENTRY.hold-450,()=>animate($('#entity'),[{opacity:1},{opacity:0,transform:'translateY(-.7cqh)'}],{duration:450,easing:ENTER,fill:'forwards'}));
  later(ENTRY.hold,()=>{
   const plane=rect($('#splash'));
   const fromTitle=rect($('#chapter-hero h1')),fromAct=rect($('#chapter-hero .eyebrow'));
   mode('resource');
   animate($('#splash'),[box(plane),box(rect($('#splash')))],{duration:ENTRY.fold,easing:EASE});
   for(const [selector,from,target] of [['#chapter-hero h1',fromTitle,'#chapter h1'],['#chapter-hero .eyebrow',fromAct,'#chapter .eyebrow']]){
    const to=rect($(target));animate($(selector),[{transform:'none',transformOrigin:'0 0'},{transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(${to.height/from.height})`,transformOrigin:'0 0'}],{duration:ENTRY.fold,easing:EASE,fill:'forwards'});
   }
   animate($('#chapter-hero .chapter-note'),[{opacity:1},{opacity:0}],{duration:400,fill:'forwards'});
   animate($('#resource'),[{opacity:0,transform:'translateY(6cqh) scale(.96)'},{opacity:1,transform:'none'}],{duration:ENTRY.resourceDuration,delay:ENTRY.resourceDelay,easing:ENTER,fill:'backwards'});
   later(ENTRY.fold,()=>{stage.dataset.titleDocked='true';$('#chapter-hero').style.visibility='hidden';});
   // Primera vista: el recurso permanece desplegado y el chat introduce la escena, sin información de avance.
   later(ENTRY.chatDelay,()=>{
    mode('opening');
    animate($('#entity'),[{opacity:0,transform:'translateY(1.8cqh) scale(.97)'},{opacity:1,transform:'translateY(-.4cqh) scale(1.01)',offset:.76},{opacity:1,transform:'none'}],{duration:1150,delay:150,easing:ENTER,fill:'both'});
    animate($('#conversation'),[{opacity:0},{opacity:1}],{duration:ENTRY.chatDuration,easing:ENTER});
    later(ENTRY.voiceDelay,()=>finishEntrance());
   });
  });
 }
 function turns(n,{instant=false}={}){
  const turnList=n===1?data.steps[0].turns:[...data.steps[1].turns.filter(t=>!(data.number===10&&t.who==='Herida')),...data.steps[2].turns];
  playTurns(turnList,{instant});
 }
 function render(n,{instant=false}={}){
  if(!data)return;
  if(instant)stage.dataset.entryInstant='true';
  if(data.structure.kind!=='chapter'){
   n=data.structure.sequence.includes(n)?n:data.structure.sequence[0];
   if(n===0)entrance({animateEntry:!instant});else renderFrame(n,{instant});return;
  }
  n=Math.max(0,Math.min(3,n));if(n===2)n=3; // Compatibilidad con enlaces del avance retirado.
  if(n===0){entrance({animateEntry:!instant});return;}
  const dock=step===0&&stage.dataset.mode==='opening',resource=dock?rect($('#resource')):null;
  cancel();setStep(n);mode('conversation');stage.dataset.titleDocked='true';$('#chapter-hero').style.visibility='hidden';setLabels(n);$('#evidence').hidden=true;
  const currentBlocks=data.number===1?[data.steps[n===1?1:2]]:data.number===22?(n===1?data.steps.slice(0,2):[data.steps[2]]):(n===1?[data.steps[0]]:data.steps.slice(1));
  $('.routine-bubble').hidden=!currentBlocks.some(block=>block.routine.length);if(!callConnected&&!currentBlocks.some(block=>block.routine.length))callState('off');
  if(n!==1)$('#routine-text').textContent=data.steps.flatMap(s=>s.routine).at(-1)||'';
  $('#wound-text').textContent='';woundState('waiting');
  if(dock&&!instant&&!reduced.matches){
   resize($('#resource'),resource,rect($('#resource')),1700);
   animate($('#explanation'),[{opacity:0},{opacity:0,offset:.5},{opacity:1}],{duration:1700,easing:EASE});
   chainRunning=true;later(1250,()=>turns(n,{instant}));
  }else turns(n,{instant});
  if($('#speaker-dialog').open)updateSpeaker();
 }
 function renderFrame(n,{instant=false,entityFrom=null}={}){
  const from=entityFrom||((getComputedStyle($('#entity')).visibility!=='hidden'&&getComputedStyle($('#entity')).opacity!=='0')?rect($('#entity')):null);
  cancel();setStep(n);mode(n===0?'opening':'conversation');stage.dataset.titleDocked='true';$('#chapter-hero').style.visibility='hidden';
  setLabels(n);$('#chapter h1').textContent=data.structure.titles[n];$('#resource-title').textContent=data.structure.resources[n];
  $('#evidence').hidden=true;$('#wound-text').textContent='';woundState('waiting');
  const block=data.steps[data.structure.blocks[n]];$('.routine-bubble').hidden=!block.routine.length;if(!callConnected&&!block.routine.length)callState('off');
  if(!instant&&!reduced.matches){
   animate($('#chapter'),[{opacity:0,transform:'translateY(.8cqh)'},{opacity:1,transform:'none'}],{duration:1000,delay:250,easing:ENTER,fill:'backwards'});
   animate($('#resource'),[{opacity:0,transform:'translateY(1.5cqh)'},{opacity:1,transform:'none'}],{duration:1300,easing:EASE});
   moveEntity(from);
   animate($('#conversation'),[{opacity:0},{opacity:1}],{duration:1000,delay:200,easing:ENTER,fill:'backwards'});
  }
  if(data.structure.kind==='closing'&&n===3)showEvidence({notify:false});
  playTurns(block.turns,{instant});
  if($('#speaker-dialog').open)updateSpeaker();
 }
 function moveEntity(from){
  const el=$('#entity'),to=rect(el);if(!from){animate(el,[{opacity:0,transform:'translateY(1cqh)'},{opacity:1,transform:'none'}],{duration:1400,easing:ENTER});return;}
  const dx=from.left+from.width/2-to.left-to.width/2,dy=from.top+from.height/2-to.top-to.height/2,scale=Math.min(from.width,from.height)/Math.min(to.width,to.height),origin=`translate(${dx}px,${dy}px) scale(${scale})`;
  const far=Math.hypot(dx,dy)>stage.clientWidth*.4;
  const frames=far?[{opacity:1,transform:origin},{opacity:0,transform:origin,offset:.3},{opacity:0,transform:'translateY(1cqh) scale(.97)',offset:.48},{opacity:1,transform:'none'}]:[{opacity:1,transform:origin},{opacity:1,transform:'none'}];
  animate(el,frames,{duration:1700,easing:EASE,fill:'backwards'});
 }
 function next(){
  unlockAudio();
  if(data.number===1&&preludeStage!=='done'){advancePrelude();return;}
  if(!$('#journey').hidden){finishJourney();return;}
  const sequence=data.structure.sequence,index=sequence.indexOf(step);
  if(index<sequence.length-1)render(sequence[index+1]);else if(data.number<22)selectChapter(data.number+1);else if(!journeyExited)endJourney();
 }
 function previous(){
  if(data.number===1&&preludeStage!=='done'){backPrelude();return;}
  if(data.number===1&&step===0&&arrivalPresented){showArrival({instant:true});return;}
  if(!$('#journey').hidden){$('#journey').hidden=true;sendCloister('pause');}
  if(step===0&&data.number>1)selectChapter(data.number-1,{scene:3,instant:true});else {const sequence=data.structure.sequence;render(sequence[Math.max(0,sequence.indexOf(step)-1)],{instant:true});}
 }
 function updateSpeaker(){
  if(data.number===1&&preludeStage!=='done'){
   const notes={cover:['Portada institucional obligatoria','Mantenerla visible. Primer avance: retirar la portada y mostrar los paneles de las jornadas sobre el Claustro.'],panels:['Jornadas, comisión y área sanitaria','El giro de cámara acompaña los paneles. Segundo avance: retirarlos y seguir a la gota al agua.'],diving:['Viaje al mundo de la herida','La gota no tiene rostro. El viaje termina automáticamente antes de cinco segundos; el siguiente avance permite completarlo.'],arrival:['Úrsula toma consciencia','La entidad se detiene, abre los ojos y se presenta; aparece la portada de la charla. Tercer avance: continuar la presentación de Úrsula.']};
   $('#speaker-heading').textContent='Apertura · '+notes[preludeStage][0];const p=document.createElement('p');p.textContent=notes[preludeStage][1];$('#speaker-lines').replaceChildren(p);$('#speaker-script > div').textContent=data.script;return;
  }
  const frame=data.structure.kind!=='chapter';
  const blocks=frame?[data.steps[data.structure.blocks[step]]]:step===0?[]:step===1?[data.steps[0]]:data.steps.slice(1);
  const lines=!frame&&step===0?['El recurso permanece desplegado junto al chat. Úrsula: '+data.introWound]:blocks.flatMap(t=>t.speaker);
  $('#speaker-heading').textContent=data.number+' · '+data.title+' · '+(data.structure.kind!=='chapter'?data.structure.titles[step]:step===0?'Entrada':step===1?'Desarrollo':'Decisión');
  $('#speaker-lines').replaceChildren(...lines.map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));
  const source=document.createElement('p');source.className='source-condition';source.textContent=data.citation+' — '+data.condition;$('#speaker-lines').append(source);
  const plan=document.createElement('section');plan.className='actor-plan';
  const heading=document.createElement('h3');heading.textContent='Preparación de Rutina · '+data.actorPlan.assetStatus;plan.append(heading);
  const notes=[['Recurso y desarrollo',data.actorPlan.resource],['Entrada',data.actorPlan.offer],['Frase de entrada',data.actorPlan.openingLine||'No hay intervención hablada'],['Reacción',data.actorPlan.reaction],['Activada por',data.actorPlan.reactionTrigger||'No corresponde'],['Prompt de entrada',data.actorPlan.offerPrompt],['Prompt de reacción',data.actorPlan.reactionPrompt]];
  notes.forEach(([label,text])=>{const p=document.createElement('p'),b=document.createElement('strong');b.textContent=label+': ';p.append(b,document.createTextNode(text));plan.append(p);});$('#speaker-lines').append(plan);
  $('#speaker-script > div').textContent=data.script;
 }
 function showSpeaker(){updateSpeaker();$('#speaker-dialog').showModal();}
 let selectedAct='Infección';
 function closeMenu({focus=false}={}){$('#act-menu').hidden=true;$('#act-toggle').setAttribute('aria-expanded','false');if(focus)$('#act-toggle').focus();}
 function toggleMenu(){const open=$('#act-menu').hidden;$('#act-menu').hidden=!open;$('#act-toggle').setAttribute('aria-expanded',String(open));if(open)$('#act-menu [aria-current]')?.focus();}
 function openChapter(chapter){$('#acts-dialog').close();selectChapter(chapter.number,{instant:true});}
 function showAct(act){
  selectedAct=act;closeMenu();$('#act-heading').textContent=act;
  $('#book-acts').replaceChildren(...acts.map(name=>{const b=document.createElement('button');b.type='button';b.textContent=name;if(name===act)b.setAttribute('aria-current','true');b.onclick=()=>showAct(name);return b;}));
  $('#chapter-list').replaceChildren(...deck.chapters.filter(c=>c.act===act).map(c=>{const li=document.createElement('li'),button=document.createElement('button');li.value=c.number;button.textContent=c.title;if(c.number===data.number){button.className='current';button.setAttribute('aria-current','page');}else button.setAttribute('aria-label','Abrir capítulo '+c.number+': '+c.title);button.onclick=()=>openChapter(c);li.append(button);return li;}));
  if(!$('#acts-dialog').open)$('#acts-dialog').showModal();
 }
 $('#act-toggle').onclick=toggleMenu;
 $('#routine-placeholder').onclick=showSpeaker;
 $('#return-to-act').onclick=()=>{$('#chapter-dialog').close();showAct(selectedAct);};
 $('#open-sources').onclick=()=>{$('#acts-dialog').close();showSources();};
 $('#act-menu').replaceChildren(...acts.map(act=>{const b=document.createElement('button');b.type='button';b.setAttribute('role','menuitem');b.textContent=act;if(act===data?.act)b.setAttribute('aria-current','true');b.onclick=()=>showAct(act);return b;}));
 $('#act-menu').addEventListener('keydown',e=>{const items=[...$('#act-menu').querySelectorAll('button')],i=items.indexOf(document.activeElement);if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?items.length-1:(i+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;items[next].focus();}else if(e.key==='Escape'){e.preventDefault();closeMenu({focus:true});}e.stopPropagation();});
 document.addEventListener('click',e=>{if(!$('#act-menu').hidden&&!e.target.closest('#act-menu,#act-toggle'))closeMenu();});
 // Suspensión ocasional: un único panel, sin transformar la tipografía ni alterar el encuadre.
 let driftTimer,drifts=[],lastDrift='';
 function stopDrift(){clearTimeout(driftTimer);drifts.forEach(a=>a.cancel());drifts=[];delete stage.dataset.drifting;}
 function planDrift(delay=4500+Math.random()*4500){
  clearTimeout(driftTimer);if(reduced.matches||document.hidden)return;
  driftTimer=setTimeout(()=>{
   const busy=animations.some(a=>a.playState==='running');
   if(busy||!['opening','conversation'].includes(stage.dataset.mode)||$('dialog[open]')||!$('#act-menu').hidden){planDrift(2500);return;}
   const candidates=['#splash','#conversation',...(!$('#evidence').hidden&&stage.dataset.frame!=='chapter'?['#evidence']:[])].filter(s=>s!==lastDrift&&getComputedStyle($(s)).display!=='none'&&getComputedStyle($(s)).visibility!=='hidden');
   if(!candidates.length){planDrift(2500);return;}
   const selector=candidates[Math.floor(Math.random()*candidates.length)],el=$(selector),sign=Math.random()<.5?-1:1;
   lastDrift=selector;stage.dataset.drifting=selector.slice(1);
   const duration=10000+Math.random()*4000,frames=[
    {translate:'0px 0px',rotate:'0deg'},
    {translate:`${sign*5}px -7px`,rotate:`${sign*.38}deg`,offset:.36},
    {translate:`${-sign*3}px 4px`,rotate:`${-sign*.22}deg`,offset:.73},
    {translate:'0px 0px',rotate:'0deg'}
   ];
   const motion=el.animate(frames,{duration,easing:'cubic-bezier(.45,0,.55,1)'});drifts=[motion];
   // Solo la superficie se ablanda; los hijos conservan su geometría.
   if(selector==='#splash')drifts.push(el.animate([
    {borderRadius:'2cqw'},
    {borderRadius:'2.8cqw 1.5cqw 2.6cqw 1.65cqw',offset:.5},
    {borderRadius:'2cqw'}
   ],{duration,easing:'ease-in-out'}));
   motion.finished.then(()=>{drifts=[];delete stage.dataset.drifting;planDrift();}).catch(()=>{});
  },delay);
 }
 reduced.addEventListener('change',()=>{stopDrift();planDrift();});
 document.addEventListener('visibilitychange',()=>{stopDrift();if(!document.hidden)planDrift();});
 addEventListener('pagehide',stopDrift);planDrift();
 const particleColors=['var(--coral)','var(--skin)','var(--ochre)','var(--olive)','var(--pilot-depth-mauve)','var(--pilot-particle-near)'];
 const particleShapes=['round','round','oval','ring','seed'];
 for(let i=0;i<72;i++){
  const p=document.createElement('i'),near=i%9===0,mid=i%3===0;
  p.className='particle '+(near?'particle-near':mid?'particle-mid':'particle-far')+' particle-'+particleShapes[i%5];
  p.style.cssText=`left:${(i*37.9)%100}%;top:${(i*23.7)%100}%;--particle-color:${particleColors[i%6]};--particle-size:${near?.64+i%3*.08:mid?.28+i%2*.08:.1+i%3*.035}cqw;--particle-duration:${28+i%23}s;--particle-delay:-${i%37}s;--flow-x:${(i%2?-1:1)*(3+i%6)}cqw;--flow-y:${-4-i%7}cqh;--particle-turn:${i%2?35:-40}deg`;
  $('#ambient').append(p);
 }
 for(let i=0;i<32;i++){const x=510+(i*83%520),q=(x-768)/270,y=632-14*(1-q*q)+(i*17%24)-12,r=document.createElementNS('http://www.w3.org/2000/svg','rect');for(const [k,v] of Object.entries({x,y,width:18,height:6,rx:3,class:'microbe',transform:`rotate(${i*41%180} ${x} ${y})`}))r.setAttribute(k,v);$('#microbes').append(r);}
 document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
 // Activar el audio con cualquier interacción, también durante una escritura ya iniciada.
 addEventListener('pointerdown',unlockAudio,{capture:true});
 addEventListener('keydown',unlockAudio,{capture:true});
 document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
 addEventListener('keydown',e=>{
  if(!data||!$('#act-menu').hidden||$('dialog[open]')||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select'))return;
  if(e.key===' '&&e.target.closest('button,a'))return;
  if(['ArrowRight',' ','PageDown'].includes(e.key)){e.preventDefault();next();}
  else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();previous();}
  else if(e.key==='Home'){e.preventDefault();unlockAudio();if(data.number===1){journeySeen=false;beginJourney();}else entrance();}
  else if(e.key==='End'){e.preventDefault();unlockAudio();render(data.structure.sequence.at(-1),{instant:true});}
  else if(e.key.toLowerCase()==='p')showSpeaker();
  else if(e.key.toLowerCase()==='v')window.open(location.pathname+'?ponente&sesion='+encodeURIComponent(sessionId),'ponente-'+sessionId,'width=1100,height=760');
  else if(e.key.toLowerCase()==='r')showSources();
  else if(e.key.toLowerCase()==='f')document.documentElement.requestFullscreen?.();
 });
 stage.addEventListener('click',e=>{if(!data||e.target.closest('button,a,nav,dialog'))return;if(!$('#act-menu').hidden){closeMenu();return;}unlockAudio();const r=stage.getBoundingClientRect();if(e.clientX<r.left+r.width*.15)previous();else next();});
 reduced.addEventListener('change',()=>{if(data?.number===1&&preludeStage!=='done'){if(preludeStage==='cover')sendCloister('cover');else if(preludeStage==='panels')sendCloister('panels');else showArrival({instant:true});return;}if(mounted)step?render(step,{instant:true}):entrance({animateEntry:false});});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancel();Presence.stop();sendCloister('pause');}else if(data){if(data.number===1&&preludeStage!=='done'){if(preludeStage==='cover')sendCloister('cover');else if(preludeStage==='panels')sendCloister('panels');else showArrival({instant:true});}else if(!$('#journey').hidden)finishJourney();else if(step)render(step,{instant:true});else entrance({animateEntry:false});}});
 function parseLocation(){
  const m=location.hash.match(/^#capitulo-(\d+)(?:\/(\d+))?$/);return m?{number:Number(m[1]),scene:Number(m[2])===2?3:Number(m[2])||0}:{number:Number(stage.dataset.initialChapter)||10,scene:Number(location.hash.slice(1))||0};
 }
 function selectChapter(number,{scene=0,instant=false}={}){
  cancel();stopDrift();planDrift();data=deck.chapters.find(c=>c.number===number);if(!data)throw Error('No existe el capítulo '+number);
  resetPrelude();
  if(number===1&&!scene)journeySeen=false;
  callConnected=false;activeNeighbor=-1;stage.dataset.routinePose='offer';callState('off');$('#routine-text').textContent='';$('#evidence').hidden=true;$('#journey').hidden=true;sendCloister('pause');journeyExited=false;
  stage.dataset.chapter=String(number);stage.dataset.frame=data.structure.kind;stage.setAttribute('aria-label','Capítulo '+number+': '+data.title);stage.classList.toggle('long-title',data.title.length>33);
  const act=$('#act-toggle');act.replaceChildren(document.createTextNode(data.act+' '),Object.assign(document.createElement('i'),{className:'act-chevron'}));
  $('#chapter .eyebrow > span').textContent='· Capítulo '+String(number).padStart(2,'0');
  $('#chapter h1').textContent=data.title;
  if(number===10)$('#chapter h1').innerHTML='El antiséptico<br><em>no es champú</em>';
  hero.querySelector('.eyebrow').textContent=data.act+' · Capítulo '+String(number).padStart(2,'0');hero.querySelector('h1').innerHTML=$('#chapter h1').innerHTML;
  $('#routine .proposes').src=data.avatar[0];$('#routine .reconsiders').src=data.avatar[1];
  $('#evidence-summary').textContent=data.steps.flatMap(s=>s.turns).find(t=>t.who==='Evidencia')?.text||data.takeaway;
  $('#evidence .citation').textContent=data.citation;$('#evidence .ev-condition').textContent=data.condition;
  const placeholder=$('#routine-placeholder');placeholder.hidden=!new URLSearchParams(location.search).has('poses')||!['placeholder','reuse','proposal'].includes(data.actorPlan.status);placeholder.textContent=data.actorPlan.status==='reuse'?'Adaptación pendiente · P':data.actorPlan.status==='proposal'?'Pose propuesta · P':'Pose pendiente · P';placeholder.title=data.actorPlan.offer+' Reacción: '+data.actorPlan.reaction;
  const icons=$('.source-icons');icons.hidden=false;
  const names=[...new Set(data.evidenceSources.map(id=>deck.sourceBrands[id]))];
  icons.replaceChildren(...names.map(name=>{const brand=deck.brands[name],img=document.createElement('img');img.src=brand.src;img.alt=brand.name;img.title=brand.name;img.dataset.brand=name;return img;}));
  $$('#act-menu button').forEach(b=>{if(b.textContent===data.act)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
  selectedAct=data.act;document.title=data.title+' · Conversaciones con una herida';
  preload(number+1);
  if(scene){setStep(0);render(scene,{instant});}else entrance({animateEntry:!instant});
 }
 // Deja decodificado lo que viene: la videollamada y las fotografías no deben llegar a medias.
 function preload(number){const c=deck.chapters.find(x=>x.number===number);if(!c)return;for(const src of [...c.avatar,...c.resource.media.map(id=>deck.assets[id]?.src).filter(Boolean)]){const img=new Image();img.src=src;img.decode?.().catch(()=>{});}}
 function $$(selector){return [...document.querySelectorAll(selector)];}
 function showSources(){
  $('#chapter-source').textContent='Capítulo '+data.number+' · '+data.citation+' — '+data.condition+' '+data.source;
  const shown=new Set($$('#resource-content img').map(img=>img.getAttribute('src')));
  $('#resource-credits').replaceChildren(...Object.values(deck.assets).filter(a=>shown.has(a.src)).map(a=>{
   const p=document.createElement('p');p.textContent=a.title+' · '+a.credit+'. '+a.modifications;
   for(const [href,label] of [[a.sourceUrl,'Fuente de la imagen'],[a.licenseUrl,'Licencia']])if(href){const link=document.createElement('a');link.href=href;link.target='_blank';link.rel='noopener';link.textContent=' '+label;p.append(link);}return p;
  }));
  if(!$('#source-list').childElementCount){
   deck.sources.forEach(source=>{const p=document.createElement('p');p.textContent=source.text;if(source.brand){const img=document.createElement('img');img.className='bibliography-logo';img.src=deck.brands[source.brand].src;img.alt=deck.brands[source.brand].name;p.prepend(img);}if(source.url){const a=document.createElement('a');a.href=source.url;a.target='_blank';a.rel='noopener';a.textContent=' Abrir documento';p.append(a);}$('#source-list').append(p);});
   const groups=[...new Set(deck.recommendations.items.map(r=>r.groupTitle))];
   for(const group of groups){const h=document.createElement('h3');h.textContent=group;$('#recommendation-list').append(h);for(const r of deck.recommendations.items.filter(r=>r.groupTitle===group)){const p=document.createElement('p');p.className=r.illuminate?'selected-recommendation':'';p.textContent=(r.illuminate?'● ':'')+r.summary+' · DT XIV p. '+r.page+' · Fuerza: '+r.strength;$('#recommendation-list').append(p);}}
  }
  $('#sources-dialog').showModal();
 }
 let journeySeen=false,journeyExited=false,journeyKind='',cloisterReady=false,pendingCloister=null;
 let preludeStage='done',arrivalPresented=false,bodyPrepared=false,awakeningRaf=0,diveStartedAt=0,awakeningToken=0;
 function sendCloister(action){
  if(!cloisterReady){pendingCloister=action;return;}
  $('#cloister').contentWindow?.postMessage({cloister:action},location.origin);
 }
 function loadCloister(){if(!$('#cloister').getAttribute('src'))$('#cloister').src='../recorrido/claustro/index.html';}
 function resetPrelude(){
  awakeningToken++;cancelAnimationFrame(awakeningRaf);preludeStage='done';bodyPrepared=false;delete stage.dataset.prelude;delete stage.dataset.titleReady;
  $('#awakening-title').hidden=true;$('#entity').style.removeProperty('opacity');$('#journey').style.removeProperty('opacity');zone.dataset.faceReveal='1';
 }
 function setPrelude(value){preludeStage=value;stage.dataset.prelude=value;stage.dataset.introState=value;$('#position').textContent='Apertura · '+({cover:'Portada obligatoria',panels:'Jornadas y Claustro',diving:'Inmersión',arrival:'Úrsula despierta'}[value]||value);}
 function beginJourney(){
  cancel();resetPrelude();journeySeen=true;journeyKind='entry';arrivalPresented=false;
  setStep(0);mode('intro');setPrelude('cover');$('#journey').dataset.kind='entry';$('#journey').dataset.phase='institutional';$('#journey').hidden=false;$('#institutional').src=deck.institutional.open;$('#institutional').alt='Portada institucional de las IV Jornadas Comisión Heridas Jerez';
  $('#cloister-commission-logo').src=deck.cloisterAssets.commission;$('#cloister-area-map').src=deck.cloisterAssets.map;loadCloister();sendCloister('cover');
 }
 function showCloisterPanels(){
  cancel();resetPrelude();setPrelude('panels');$('#journey').dataset.kind='entry';$('#journey').dataset.phase='panels';$('#journey').hidden=false;sendCloister('panels');
 }
 function prepareLiquidBody(){
  if(bodyPrepared)return;bodyPrepared=true;zone.dataset.faceReveal='0';presence('idle');$('#entity').style.opacity='0';
 }
 function startImmersion(){
  cancel();awakeningToken++;setPrelude('diving');$('#journey').dataset.phase='diving';$('#journey').style.opacity='1';prepareLiquidBody();diveStartedAt=performance.now();stage.dataset.diveProgress='0';delete stage.dataset.renderedDiveMs;stage.dataset.diveDuration=String(data.structure.travelMs);
  if(reduced.matches){showArrival({instant:true});return;}
  sendCloister('dive');
  const revision=epoch;timers.push(setTimeout(()=>{if(epoch===revision&&preludeStage==='diving')showArrival();},data.structure.travelDeadlineMs));
 }
 function immersionProgress(progress){
  if(preludeStage!=='diving')return;prepareLiquidBody();const t=Math.max(0,Math.min(1,(progress-.7)/.3)),blend=t*t*(3-2*t);
  $('#journey').style.opacity=String(1-blend);$('#entity').style.opacity=String(blend);stage.dataset.diveProgress=progress.toFixed(3);
 }
 function showArrival({instant=false}={}){
  if(data.number!==1)return;
  const fromDive=preludeStage==='diving';
  cancel();const token=++awakeningToken;cancelAnimationFrame(awakeningRaf);prepareLiquidBody();sendCloister('pause');$('#journey').hidden=true;$('#journey').style.removeProperty('opacity');setPrelude('arrival');mode('awakening');$('#entity').style.opacity='1';$('#awakening-title').hidden=false;arrivalPresented=true;
  if(fromDive&&diveStartedAt)stage.dataset.lastDiveMs=String(Math.round(performance.now()-diveStartedAt));
  if(instant||reduced.matches){zone.dataset.faceReveal='1';stage.dataset.titleReady='true';presence('idle');return;}
  delete stage.dataset.titleReady;zone.dataset.faceReveal='0';const start=performance.now();
  animate($('#entity'),[{transform:'scale(.9,1.06)'},{transform:'scale(1.015,.99)',offset:.75},{transform:'none'}],{duration:1500,easing:EASE});
  const openEyes=now=>{if(token!==awakeningToken||preludeStage!=='arrival')return;const t=Math.max(0,Math.min(1,(now-start-150)/1250));zone.dataset.faceReveal=String(t*t*(3-2*t));if(t<1)awakeningRaf=requestAnimationFrame(openEyes);};awakeningRaf=requestAnimationFrame(openEyes);
  later(1450,()=>{if(preludeStage!=='arrival')return;stage.dataset.titleReady='true';presence('idle','Hola, soy Úrsula.');messageSound('wound');});
 }
 function continueFromArrival(){
  const from=rect($('#entity'));resetPrelude();$('#journey').hidden=true;sendCloister('pause');renderFrame(0,{entityFrom:from});
 }
 function advancePrelude(){
  if(preludeStage==='cover')showCloisterPanels();
  else if(preludeStage==='panels')startImmersion();
  else if(preludeStage==='diving')showArrival({instant:true});
  else if(preludeStage==='arrival')continueFromArrival();
 }
 function backPrelude(){
  if(preludeStage==='cover')return;
  if(preludeStage==='panels'){beginJourney();return;}
  cancel();resetPrelude();sendCloister('reset');showCloisterPanels();
 }
 function endJourney(){
  resetPrelude();journeyKind='exit';journeyExited=true;$('#journey').dataset.kind='exit';
  if(reduced.matches){$('#journey').hidden=false;finishJourney();return;}
  loadCloister();$('#journey').hidden=false;$('#journey').dataset.phase='cloister';$('#journey-copy h2').textContent='En la próxima cura, escuchamos';sendCloister('reset');
  animate($('#journey'),[{opacity:0},{opacity:1}],{duration:1900,easing:EASE});later(6500,()=>finishJourney());
 }
 function finishJourney(){
  if(journeyKind==='exit'){$('#institutional').src=deck.institutional.close;$('#institutional').alt='Contraportada institucional de las IV Jornadas Comisión Heridas Jerez';$('#journey').dataset.phase='institutional';sendCloister('pause');}
  else advancePrelude();
 }
 addEventListener('message',e=>{
  if(e.origin!==location.origin||e.source!==$('#cloister').contentWindow)return;
  if(e.data?.cloister==='ready'){cloisterReady=true;if(pendingCloister){const action=pendingCloister;pendingCloister=null;sendCloister(action);}}
  else if(e.data?.cloister==='progress')immersionProgress(e.data.progress);
  else if(e.data?.cloister==='arrived'&&preludeStage==='diving'){stage.dataset.renderedDiveMs=String(Math.round(e.data.elapsed));showArrival();}
 });
 channel?.addEventListener('message',e=>{const m=e.data||{};if(m.hello)announce();if(!data)return;if(m.cmd==='next')next();if(m.cmd==='prev')previous();if(m.cmd==='go')selectChapter(m.chapter,{instant:true});});
 addEventListener('hashchange',()=>{if(deck){const {number,scene}=parseLocation();selectChapter(number,{scene});}});
 async function start(){try{
  deck=JSON.parse($('#pilot-data').textContent);if(!deck){const {extractPilot}=await import('../../scripts/guion-piloto.mjs');const response=await fetch('../../guion/GUION_CONSOLIDADO_22_CAPITULOS.md');if(!response.ok)throw Error('No se encuentra el guion consolidado.');deck=extractPilot(await response.text());throw Error('Compila el recorrido con npm run build:piloto para resolver sus recursos.');}
  const initial=parseLocation();selectChapter(initial.number,{scene:initial.scene});
 }catch(error){$('#load-error').hidden=false;$('#load-error').textContent='No se ha podido cargar el recorrido: '+error.message;}}
 start();
})();

// Lee el guion para María del Mar (guion/GUION_PARA_MARIA_DEL_MAR.md) y lo convierte
// en la secuencia de pasos de la escena. El guion es la única fuente de textos: hilo,
// diálogo, evidencia y notas de pantalla. Las composiciones de recursos viven en escena-recursos.js.

// Primer «…» equilibrado de una línea (admite comillas anidadas).
export function quote(line){
 const i=line.indexOf('«');if(i<0)return null;
 let depth=0;
 for(let j=i;j<line.length;j++){
  if(line[j]==='«')depth++;
  else if(line[j]==='»'&&--depth===0)return line.slice(i+1,j);
 }
 return line.slice(i+1);
}
const all=line=>{const out=[];let rest=line;for(let q;(q=quote(rest))!==null;){out.push(q);rest=rest.slice(rest.indexOf('«')+q.length+2);}return out;};
const words=t=>t.split(/\s+/).filter(Boolean).length;
const roman={I:1,II:2,III:3,IV:4};

// Cada párrafo en negrita inicial («**Etiqueta:** texto») pasa a ser un «beat».
function beats(lines){
 const out=[];
 for(const raw of lines){
  const line=raw.trim();if(!line||line==='---')continue;
  const m=line.match(/^\*\*(.+?):\*\*\s*(.*)$/);
  if(!m){out.push({kind:'note',text:line});continue;}
  const [,label,rest]=m;
  const screen=label.match(/^En pantalla · (.+)$/);
  if(screen){out.push({kind:'screen',what:screen[1],text:rest});continue;}
  if(/^La herida/.test(label)){out.push({kind:'herida',text:quote(rest)});continue;}
  if(/^María del Mar, a la sala/.test(label)){out.push({kind:'sala',text:quote(rest),after:rest.slice(rest.lastIndexOf('»')+1).replace(/^\.\s*/,'').trim()});continue;}
  if(/^María del Mar cierra el bloque/.test(label)){out.push({kind:'blockclose',text:quote(rest)});continue;}
  if(/^María del Mar abre el bloque/.test(label)){out.push({kind:'blockopen',text:quote(rest)});continue;}
  if(/^María del Mar cierra/.test(label)){out.push({kind:'cierra',text:quote(rest)});continue;}
  if(/^María del Mar/.test(label)){out.push({kind:'mdm',text:quote(rest)});continue;}
  if(label==='Para seguir'){out.push({kind:'seguir',text:quote(rest)});continue;}
  if(/^(Antes de empezar|Durante la cura|Cuando algo no encaja|Antes de irnos)(, María del Mar recuerda)?$/.test(label)){out.push({kind:'recuerda',block:label.replace(/, María.*/,''),text:quote(rest)});continue;}
  out.push({kind:'field',label,text:rest.replace(/\s+$/,'')});
 }
 return out;
}

function evidence(text){
 const title=text.match(/Aparece «(.+?)»/)?.[1];
 const idea=text.match(/con esta idea: «(.+?)»\./)?.[1];
 const source=text.match(/Fuente visible: (.+?)\.(?= (?:También|María))/)?.[1];
 const condition=text.match(/la condición: «(.+?)»\./)?.[1]||null;
 return {title,idea,source,condition};
}

// Agrupa los beats de una actuación en pasos. Cada paso muestra como mucho un intercambio;
// las explicaciones largas de María del Mar quedan para la ventana de ponente.
function practiceSteps(bs){
 const steps=[];let phase='open',step=null;
 const push=s=>{steps.push(s);step=s;return s;};
 const say=(s,who,text)=>{(s.lines??=[]).push({who,text});};
 const spoken=(s,text)=>{(s.spoken??=[]).push(text);};
 for(const b of bs){
  if(b.kind==='screen'){
   const w=b.what;
   if(/recurso/.test(w)){phase='resource';push({kind:'resource',screen:b.text});}
   else if(/pregunta/.test(w)){phase='ask';push({kind:'ask',screen:b.text});}
   else if(/evidencia/.test(w)){phase='evidence';push({kind:'evidence',screen:b.text,evidence:evidence(b.text)});}
   else if(/aprendizaje/.test(w)){phase='take';push({kind:'take',screen:b.text});}
   continue;
  }
  if(b.kind==='herida'){
   if(phase==='open'){push({kind:'open'});say(step,'herida',b.text);}
   else if(phase==='evidence'||phase==='reply'){phase='reply';push({kind:'reply'});say(step,'herida',b.text);}
   else if(step.lines?.some(l=>l.who==='herida')){push({kind:'say'});say(step,'herida',b.text);}
   else say(step,'herida',b.text);
   continue;
  }
  if(b.kind==='mdm'){
   spoken(step,b.text);
   if(phase==='evidence')continue; // Explica el fundamento: no se proyecta.
   if(words(b.text)>32)continue;
   say(step,'mdm',b.text);
   continue;
  }
  if(b.kind==='sala'){push({kind:'sala',sala:b.text,after:b.after});spoken(step,b.text);continue;}
  if(b.kind==='cierra'){spoken(step,b.text);step.close=b.text;continue;}
  if(b.kind==='seguir'){push({kind:'bridge',lines:[{who:'mdm',text:b.text}],spoken:[b.text]});continue;}
  if(b.kind==='note'&&step){(step.notes??=[]).push(b.text);continue;}
 }
 return steps;
}

// Diálogo genérico (apertura y escenas finales): cada frase de María del Mar abre un paso;
// la herida responde dentro del mismo. Las pantallas también abren paso.
function dialogueSteps(bs){
 const steps=[];let step=null;
 const push=s=>{steps.push(s);step=s;return s;};
 for(const b of bs){
  if(b.kind==='screen'){push({kind:'screen',what:b.what,screen:b.text});continue;}
  if(b.kind==='mdm'||b.kind==='cierra'){
   const long=words(b.text)>32;
   if(!step||step.lines?.length||(step.kind==='screen'&&step.spoken)||step.kind==='sala')push({kind:'say'});
   (step.spoken??=[]).push(b.text);if(!long)(step.lines??=[]).push({who:'mdm',text:b.text});
   continue;
  }
  if(b.kind==='herida'){
   // Responde a la frase visible de María del Mar o a una pantalla; tras una explicación o la sala, abre paso.
   const attach=step&&step.kind!=='sala'&&!step.lines?.some(l=>l.who==='herida')&&(step.lines?.some(l=>l.who==='mdm')||!step.spoken);
   if(!attach)push({kind:'say'});(step.lines??=[]).push({who:'herida',text:b.text});continue;
  }
  if(b.kind==='sala'){push({kind:'sala',sala:b.text,after:b.after,spoken:[b.text]});continue;}
  if(b.kind==="recuerda"&&step){(step.recuerda??=[]).push({block:b.block,text:b.text});continue;}
  if(b.kind==='note'&&step){(step.notes??=[]).push(b.text);continue;}
 }
 return steps;
}

export function parseGuion(md){
 const lines=md.split('\n');
 const sections=[];let cur=null;
 for(const line of lines){
  const h2=line.match(/^## (.+)$/),h3=line.match(/^### (.+)$/);
  if(h2){cur={level:2,title:h2[1],lines:[]};sections.push(cur);continue;}
  if(h3){cur={level:3,title:h3[1],lines:[]};sections.push(cur);continue;}
  cur?.lines.push(line);
 }
 const out={blocks:[],scenes:[],intro:null,references:[]};
 let block=null;
 for(const sec of sections){
  const bs=beats(sec.lines);
  const field=l=>bs.find(b=>b.kind==='field'&&b.label===l)?.text;
  if(sec.level===2&&/^Apertura/.test(sec.title)){
   out.intro={title:sec.title.replace(/^Apertura · /,''),purpose:field('Qué queremos explicar'),steps:dialogueSteps(bs)};
   continue;
  }
  const bm=sec.level===2&&sec.title.match(/^Bloque (I{1,3}|IV) · (.+)$/);
  if(bm){
   const entry=bs.find(b=>b.kind==='screen'&&/entrada de bloque/.test(b.what));
   block={n:roman[bm[1]],roman:bm[1],name:bm[2],purpose:field('Qué queremos explicar en este bloque'),question:entry?all(entry.text)[0]:'',open:bs.find(b=>b.kind==='blockopen')?.text,close:null,scenes:[]};
   out.blocks.push(block);continue;
  }
  if(sec.level===2&&/^Bibliografía/.test(sec.title)){
   out.references=sec.lines.filter(l=>/^\*\*\[\d\]\*\*/.test(l)).map(l=>{const m=l.match(/^\*\*\[(\d)\]\*\*\s*(.+)$/);return {n:Number(m[1]),text:m[2].replace(/\s*\[(Publicación|PDF|DOI)\]\((.+?)\)\.?/g,'').replace(/\*/g,'').replace(/`/g,'').trim(),url:m[2].match(/\]\((https?:.+?)\)/)?.[1]||null};});
   continue;
  }
  const sm=sec.level===3&&sec.title.match(/^Escena (\d+) · (.+)$/);
  if(sm){
   const n=Number(sm[1]);
   const close=bs.find(b=>b.kind==='blockclose');if(close&&block)block.close=close.text;
   const scene={n,title:sm[2],block:block.n,purpose:field('Qué queremos explicar'),habit:field('A revisar'),ask:field('Nos preguntamos'),take:field('Nos llevamos'),support:field('Respaldo')};
   const own=bs.filter(b=>b.kind!=='blockclose');
   scene.kind=scene.habit?'practice':n===22?'return':n===23?'recap':'farewell';
   scene.steps=scene.kind==='practice'?practiceSteps(own):dialogueSteps(own);
   block.scenes.push(n);out.scenes.push(scene);
  }
 }
 return out;
}

// Comprobaciones mínimas para que un cambio en el guion no rompa la escena en silencio.
export function validate(g){
 const errors=[];
 if(g.scenes.length!==24)errors.push(`Se esperaban 24 escenas y hay ${g.scenes.length}.`);
 if(g.blocks.length!==4)errors.push(`Se esperaban 4 bloques y hay ${g.blocks.length}.`);
 for(const s of g.scenes.filter(s=>s.kind==='practice')){
  for(const k of ['habit','ask','take'])if(!s[k])errors.push(`Escena ${s.n}: falta ${k}.`);
  const kinds=s.steps.map(x=>x.kind);
  for(const k of ['open','resource','ask','evidence','take','bridge'])if(!kinds.includes(k))errors.push(`Escena ${s.n}: falta el paso ${k}.`);
  const ev=s.steps.find(x=>x.kind==='evidence')?.evidence;
  if(ev&&(!ev.title||!ev.idea||!ev.source))errors.push(`Escena ${s.n}: evidencia incompleta.`);
 }
 return errors;
}

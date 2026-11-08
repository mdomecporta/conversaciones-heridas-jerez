import {montaje} from '../guion/montaje-capitulos.mjs';
import {realization,evidenceSources,mediaByChapter} from '../guion/plan-escenas.mjs';
// Texto hablado, orden de intervenciones y respaldo proceden del guion, no de las plantillas visuales.
const quotes=(text)=>[...text.matchAll(/\*\*(Herida|Rutina|Vecinas|Evidencia|María del Mar)(?:\s*\[[^\]]*\])?:\*\*\s*«([^»]+)»/g)].map(m=>({who:m[1],text:m[2]}));
export function extractPilot(md){
 const headings=[...md.matchAll(/^## Capítulo (\d+) · (.+?) · (.+)$/gm)];
 const ending=md.indexOf('## Preparación del montaje');
 const chapters=headings.map((m,i)=>{
  const number=Number(m[1]),script=md.slice(m.index,headings[i+1]?.index??(ending<0?md.length:ending)).trim();
  const steps=script.split(/^### Avance /m).slice(1).map((t,block)=>{
   const turns=quotes(t).map((turn,index)=>({...turn,id:`c${number}-b${block+1}-t${index+1}`,block:block+1}));
   return {title:t.split('\n')[0].replace(/^\d+ · /,''),turns,speaker:turns.filter(t=>t.who==='María del Mar').map(t=>t.text),wound:turns.filter(t=>['Herida','Vecinas'].includes(t.who)).map(t=>t.text),routine:turns.filter(t=>t.who==='Rutina').map(t=>t.text),script:t};
  });
  if(!montaje[number]||steps.length!==3||steps.some(s=>!s.speaker.length))throw Error('Capítulo '+number+': faltan montaje o tres bloques narrativos completos.');
  const source=script.match(/\*\*Respaldo:\*\* ([^\n]+)/g)?.at(-1)?.replace('**Respaldo:** ','')||'';
  const takeaway=script.match(/\*\*Nos llevamos:\*\* «([^»]+)»/)?.[1]||'';
  const chapter={number,act:m[2],title:m[3],script,steps,source,takeaway,...montaje[number],introWound:script.match(/\*\*(?:Herida|Vecinas) en la entrada[^\n]*?\*\* «([^»]+)»/)?.[1]||montaje[number].intro};
  chapter.actorPlan=realization(chapter);chapter.evidenceSources=evidenceSources[number];chapter.resource={...chapter.resource,media:mediaByChapter[number]||[]};
  if(chapter.actorPlan.status==='placeholder')chapter.avatar=['personajes/rutina/frames-escena-01-v1/00-reposo.png','personajes/rutina/frames-escena-01-v1/00-reposo.png'];
  return chapter;
 });
 if(chapters.length!==22||chapters.some((c,i)=>c.number!==i+1))throw Error('Se requieren los 22 capítulos completos y ordenados.');
 const pilot=chapters[9];
 return {chapters,steps:pilot.steps,introWound:pilot.introWound};
}

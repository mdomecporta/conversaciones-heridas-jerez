// The library is embedded in the deck. No image request or patient data leaves the file.
window.createWoundResourceViewer = ({getDeck,esc,showDialog,motionAllowed}) => {
 let activeIds=[],selected=0,step=0,timer=null,playing=false;
 const $=q=>document.querySelector(q);
 const assets=()=>getDeck().resourceCatalog||{};
 const authorized=id=>assets()[id]?.rights==='authorized';
 const sceneIds=s=>(s.resourceIds||[]).filter(authorized);
 const current=()=>assets()[activeIds[selected]];
 const safeUrl=url=>typeof url==='string'&&/^https:\/\//i.test(url)?url:'';
 const link=(url,label)=>safeUrl(url)?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`:'';
 function stop(){clearTimeout(timer);timer=null;playing=false;}
 function teaser(s){
  const ids=sceneIds(s);if(!ids.length)return '';
  const pair=s.id==='parecidas';const a=assets()[ids[0]];
  return `<section class="scene-resource" aria-label="Imágenes de esta escena"><button class="scene-image ${pair?'scene-image-pair':''}" data-action="scene-resources" aria-label="Ampliar imágenes de esta escena">${(pair?ids:ids.slice(0,1)).map(id=>`<img src="${esc(assets()[id].src)}" alt="${esc(assets()[id].alt)}" decoding="async">`).join('')}<span>${pair?'Comparar dos ejemplos publicados':esc(a.label)} <b>↗</b></span></button><div class="scene-resource-caption"><strong>${esc(pair?'Causas documentadas, distintas prioridades':a.title)}</strong><button data-action="scene-resources">${ids.length>1?ids.length+' imágenes':'Ampliar'}${ids.some(id=>assets()[id].walkthrough)?' · recorrido visual':''}</button></div></section>`;
 }
 // Compact entry point for the stage header: thumbnails and count, opens the viewer.
 function chip(s){const ids=sceneIds(s);if(!ids.length)return '';return `<button class="scene-chip" data-action="stage-media" aria-label="Imágenes de esta escena (${ids.length}): ${esc(ids.map(id=>assets()[id].label).join(' · '))}">${ids.slice(0,2).map(id=>`<img src="${esc(assets()[id].src)}" alt="" decoding="async">`).join('')}<span>${ids.length===1?'1 imagen':ids.length+' imágenes'}</span></button>`;}
 function credits(a){return `<p class="asset-caption">${esc(a.caption)}</p><p class="asset-credit">${esc(a.credit)}</p><div class="asset-source-links">${link(a.sourceUrl,'Procedencia')}${link(a.licenseUrl,a.license||'Licencia')}</div><p class="asset-modifications">${esc(a.modifications||'')}</p>`;}
 function player(){
  const a=current(),w=a?.walkthrough;if(!w)return '';
  const total=Math.round(w.steps.length*w.stepMs/1000);
  return `<section class="walkthrough" aria-label="Recorrido visual"><h3>${esc(w.title)}</h3><p class="walkthrough-description">Secuencia docente · ${total} s · avance manual o reproducción</p><div class="walkthrough-steps">${w.steps.map((s,i)=>`<button data-asset-step="${i}" aria-pressed="${i===step}">${i+1}. ${esc(s.title)}</button>`).join('')}</div><div id="walkthrough-body" aria-live="polite"></div><div class="walkthrough-controls"><button id="walkthrough-toggle" data-asset-action="play">Reproducir recorrido</button><button data-asset-action="restart">Volver al inicio</button></div><p class="walkthrough-note">${motionAllowed()?'La reproducción se detiene al terminar.':'Movimiento desactivado: usa los pasos para explorar.'}</p></section>`;
 }
 function render(){
  const a=current();if(!a)return;
  const d=$('#dialog');
  d.innerHTML=`<div class="modal-head"><h2 id="dialog-title">Imágenes y recursos</h2><button data-action="close-dialog" aria-label="Cerrar">×</button></div><nav class="asset-navigation" aria-label="Elegir recurso">${activeIds.map((id,i)=>`<button data-asset-select="${i}" aria-pressed="${i===selected}">${esc(assets()[id].title)}</button>`).join('')}</nav><div class="asset-dialog-layout"><figure class="asset-figure"><div class="asset-picture"><img src="${esc(a.src)}" alt="${esc(a.alt)}"><span id="asset-pointer" class="asset-pointer" hidden aria-hidden="true"></span></div><figcaption>${esc(a.label)}</figcaption></figure><div class="asset-information"><h3>${esc(a.title)}</h3>${credits(a)}${player()}</div></div>`;
  d.classList.add('resource-dialog');updateStep();
 }
 function updateStep(){
  const a=current(),w=a?.walkthrough;if(!w)return;const s=w.steps[step];
  $('#walkthrough-body').innerHTML=`<span class="walkthrough-position">${step+1} / ${w.steps.length}</span><h4>${esc(s.title)}</h4><p>${esc(s.text)}</p>`;
  const point=$('#asset-pointer');point.hidden=!(Number.isFinite(s.x)&&Number.isFinite(s.y));
  if(!point.hidden){point.style.left=s.x+'%';point.style.top=s.y+'%';}
  for(const b of document.querySelectorAll('[data-asset-step]'))b.setAttribute('aria-pressed',String(Number(b.dataset.assetStep)===step));
  const toggle=$('#walkthrough-toggle');toggle.textContent=playing?'Pausar':step===w.steps.length-1?'Repetir recorrido':'Reproducir recorrido';toggle.disabled=!motionAllowed();
 }
 function schedule(){
  clearTimeout(timer);const w=current()?.walkthrough;
  if(!playing||!w)return;
  timer=setTimeout(()=>{
   if(!$('#dialog').open||document.hidden||!motionAllowed()){stop();updateStep();return;}
   if(step===w.steps.length-1){stop();updateStep();return;}
   step++;updateStep();schedule();
  },w.stepMs);
 }
 function openIds(ids,index=0){
  stop();activeIds=ids.filter(authorized);if(!activeIds.length)return;
  selected=Math.min(Math.max(index,0),activeIds.length-1);step=0;
  showDialog('Imágenes y recursos','');render();
 }
 function handle(data){
  if(data.assetSelect!==undefined){const i=Number(data.assetSelect);if(Number.isInteger(i)&&i>=0&&i<activeIds.length){stop();selected=i;step=0;render();}return true;}
  if(data.assetStep!==undefined){const i=Number(data.assetStep),w=current()?.walkthrough;if(w&&Number.isInteger(i)&&i>=0&&i<w.steps.length){stop();step=i;updateStep();}return true;}
  if(data.assetAction){const w=current()?.walkthrough;if(!w)return true;
   if(data.assetAction==='restart'){stop();step=0;updateStep();}
   if(data.assetAction==='play'){if(playing){stop();}else if(motionAllowed()){if(step===w.steps.length-1)step=0;playing=true;schedule();}updateStep();}return true;
  }
  return false;
 }
 $('#dialog').addEventListener('close',stop);
 $('#dialog').addEventListener('cancel',stop);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();if(current()?.walkthrough&&$('#dialog').open)updateStep();}});
 return {teaser,chip,handle,stop,has:s=>sceneIds(s).length>0,open:s=>openIds(sceneIds(s)),all:()=>openIds(Object.keys(assets()))};
};

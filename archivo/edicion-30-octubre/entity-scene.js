// One-scene interaction study. The presentation still owns questions, answers and resources.
globalThis.EntitySceneLab=(()=>{
 document.documentElement.classList.add('entity-scene-lab');
 let opened=false,lastScene='',wasMedia=false,closing=false,bypass=false,closeTimer=null;
 const bodyZone=document.createElement('div');bodyZone.className='orb-zone lab-living-body';
 Object.assign(bodyZone.dataset,{renderer:'liquid',variant:'3',voice:'principal',state:'idle'});document.body.append(bodyZone);
 let unfold=0,unfoldVelocity=0,age=0,last=0,core=null,velocity=[0,0],lastPortal=null,lastFocus=[0,0],frameMedia=false;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const enabled=()=>!document.querySelector('#app.motion-off')&&!document.querySelector('#app .motion-off')&&!reduced();
 const rect=node=>{if(!node)return null;const r=node.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height};};
 const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
 function frame(now){
  const dt=Math.min(.05,Math.max(0,(now-(last||now))/1000));last=now;
  const panel=document.querySelector('.conversation-panel'),dock=rect(panel?.querySelector('.lab-entity')),image=rect(panel?.querySelector('.lab-image-plane img,.lab-image-plane video'));
  if(dock){
   const hasMedia=!!image;if(hasMedia!==frameMedia){age=0;frameMedia=hasMedia;}
   if(hasMedia)lastPortal=image;
   if(enabled())age+=dt;
   const target=hasMedia&&!closing?smooth((age-.22)/1.1):0;
   if(enabled()){
    for(let i=0;i<3;i++){const h=dt/3;unfoldVelocity+=(20*(target-unfold)-8.5*unfoldVelocity)*h;unfold+=unfoldVelocity*h;}
   }else if(reduced()){unfold=hasMedia&&!closing?1:0;unfoldVelocity=0;}
   unfold=Math.max(0,Math.min(1,unfold));
   const destination=hasMedia?{x:image.x-image.w/2-10,y:image.y-image.h/2+46}:dock;
   const reach=hasMedia&&!closing?smooth(age/.65):0;
   const targetCore=hasMedia?{x:dock.x+(destination.x-dock.x)*reach,y:dock.y+(destination.y-dock.y)*reach}:dock;
   core??={x:dock.x,y:dock.y};
   if(enabled())for(let i=0;i<3;i++)for(let j=0;j<2;j++){const key=j?'y':'x',h=dt/3;velocity[j]+=(42*(targetCore[key]-core[key])-12*velocity[j])*h;core[key]+=velocity[j]*h;}
   else if(reduced())core={x:targetCore.x,y:targetCore.y};
   const w=innerWidth,h=innerHeight,unit=Math.min(w,h)/2;
   const xy=p=>[(p.x-w/2)/unit,-(p.y-h/2)/unit];
   const portal=lastPortal||dock,note=rect(panel?.querySelector('.media-note'));
   const active=panel?.querySelector('.media-hot.on');if(active){const p=rect(active);lastFocus=xy(p);}
   Presence.body(bodyZone,{core:[...xy(core),64/unit,1],portal:[...xy(portal),portal.w/2/unit,portal.h/2/unit],note:note?[...xy(note),note.w/2/unit,note.h/2/unit]:[0,0,0,0],focus:lastFocus,progress:unfold});
   panel?.style.setProperty('--unfold',String(unfold));
   panel?.classList.toggle('body-closing',closing);
  }
  requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);
 function intercept(event){
  const b=event.target.closest?.('[data-action="media-close"],[data-action="stage-media"]');
  if(!b||bypass||!document.querySelector('.conversation-panel.has-media')||!enabled())return;
  event.preventDefault();event.stopImmediatePropagation();if(closing)return;
  closing=true;clearTimeout(closeTimer);
  const finish=()=>{if((!enabled()&&!reduced())||unfold>.06){closeTimer=setTimeout(finish,100);return;}bypass=true;document.querySelector('[data-action="'+b.dataset.action+'"]')?.click();bypass=false;closing=false;age=0;};
  closeTimer=setTimeout(finish,900);
 }
 document.addEventListener('click',intercept,true);
 const point=(event,node)=>{const r=node.getBoundingClientRect(),s=Math.min(r.width,r.height)/2;return [(event.clientX-r.left-r.width/2)/s*1.12,-(event.clientY-r.top-r.height/2)/s*1.12];};
 function prepare(stage){
  const panel=stage.querySelector('.conversation-panel');if(!panel)return;
  const scene=document.querySelector('#app').dataset.slide;
  if(scene!==lastScene){opened=false;wasMedia=false;lastScene=scene;unfold=0;age=0;}
  const original=panel.querySelector('.cast .orb-zone');
  const voice=original?.dataset.voice||'principal',state=original?.dataset.state||'idle';
  panel.querySelectorAll('.cast .orb-zone').forEach(z=>z.remove());
  const frame=panel.querySelector('.media-frame');
  if(frame&&!frame.querySelector('.lab-image-plane')){
   const plane=frame.querySelector('.media-picture')||document.createElement('div');plane.classList.add('lab-image-plane');
   [...frame.children].filter(n=>n.matches('img,video,.media-hot')).forEach(n=>plane.append(n));frame.prepend(plane);
  }
  const hasMedia=panel.classList.contains('has-media');if(hasMedia&&!wasMedia){opened=true;age=0;}if(!hasMedia&&wasMedia){closing=false;clearTimeout(closeTimer);age=0;}wasMedia=hasMedia;
  panel.classList.toggle('lab-open',opened);
  let bar=panel.querySelector('.lab-presence-bar');
  if(!bar){
   bar=document.createElement('div');bar.className='lab-presence-bar';
   bar.innerHTML='<div class="lab-invitation"><span>Conversamos</span><p>Toca la herida para abrir las preguntas.</p><small>Respuestas docentes preparadas</small></div><button class="lab-entity" type="button" aria-controls="lab-conversation" aria-expanded="false" aria-label="Abrir conversación con la herida"><span class="orb-zone" data-renderer="liquid" data-variant="3" aria-hidden="true"></span></button>';
   panel.querySelector('.conversation-header').after(bar);
  }
  const core=panel.querySelector('.stage-core');core.id='lab-conversation';
  const subtitle=core.querySelector('.subtitle');if(subtitle)core.prepend(subtitle);
  const placeholder=bar.querySelector('.orb-zone');if(placeholder)placeholder.remove();
  const zone=bodyZone;zone.dataset.voice=voice;zone.dataset.state=panel.classList.contains('has-media')?'showing':state;
  zone.dataset.attention=panel.classList.contains('has-media')?'right':'left';
  const button=bar.querySelector('button');button.setAttribute('aria-expanded',String(opened));button.setAttribute('aria-label',(opened?'Cerrar':'Abrir')+' conversación con la herida');
  bar.querySelector('p').textContent=panel.classList.contains('has-media')?'La imagen se abre entre mis membranas.':opened?'Elige una pregunta o explora la imagen.':'Toca la herida para abrir las preguntas.';
  const brand=document.querySelector('.brand small');if(brand)brand.textContent='Estudio de interacciones · escena de limpieza';
  if(!stage.querySelector('.lab-context')){
   const note=document.createElement('div');note.className='lab-context';
   note.innerHTML='<span>Una escena para probar cómo nos acompaña.</span><a href="entidad-motion.html#size-study">Volver al estudio ↗</a>';
   stage.prepend(note);
  }
 }
 function bind(stage){
  const panel=stage.querySelector('.conversation-panel'),button=panel?.querySelector('.lab-entity');if(!button||button.dataset.bound)return;
  button.dataset.bound='true';const zone=bodyZone;
  button.addEventListener('pointermove',event=>{if(event.pointerType!=='touch')Presence.interact(zone,point(event,button));});
  const release=()=>Presence.interact(zone,null);
  button.addEventListener('pointerleave',release);button.addEventListener('pointercancel',release);button.addEventListener('blur',release);
  button.addEventListener('click',event=>{
   Presence.interact(zone,event.detail===0?[0,0]:point(event,button),true);
   if(event.pointerType==='touch')release();
   opened=!opened;panel.classList.toggle('lab-open',opened);
   button.setAttribute('aria-expanded',String(opened));button.setAttribute('aria-label',(opened?'Cerrar':'Abrir')+' conversación con la herida');
   panel.querySelector('.lab-invitation p').textContent=opened?'Elige una pregunta o explora la imagen.':'Toca la herida para abrir las preguntas.';
  });
  panel.addEventListener('pointerover',event=>{
   const hot=event.target.closest('.media-hot,[data-resource-index]');if(!hot)return;
   const x=parseFloat(hot.style.left),y=parseFloat(hot.style.top);
   Presence.interact(zone,Number.isFinite(x)?[(x-50)/50,(50-y)/50]:[.7,-.2]);
  });
  panel.addEventListener('pointerout',event=>{if(event.target.closest('.media-hot,[data-resource-index]'))release();});
  panel.addEventListener('focusin',event=>{if(event.target.closest('.media-hot,[data-resource-index]'))Presence.interact(zone,[.7,-.2]);});
  panel.addEventListener('focusout',release);
  panel.addEventListener('click',event=>{if(event.target.closest('[data-turn-event],[data-resource-index]'))opened=true;},true);
 }
 return {prepare,bind,zones:()=>[bodyZone]};
})();

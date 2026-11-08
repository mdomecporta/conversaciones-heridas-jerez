/* Ventana de ponente del recorrido (?ponente): sigue a la proyección y la controla. No carga la herida ni el 3D. */
(()=>{
 if(!new URLSearchParams(location.search).has('ponente'))return;
 globalThis.RECORRIDO_PONENTE=true;
 const budget={Apertura:150,Diagnóstico:240,Infección:300,Limpieza:130,Circuitos:180,Humanización:360,Cierre:140};
 const fmt=s=>{const a=Math.abs(Math.round(s));return (s<0?'−':'')+Math.floor(a/60)+':'+String(a%60).padStart(2,'0');};
 const esc=t=>t.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
 addEventListener('DOMContentLoaded',()=>{
  const deck=JSON.parse(document.querySelector('#pilot-data').textContent),ch=new BroadcastChannel('recorrido-ponente');
  document.title='Ponente · Conversaciones con una herida';
  document.body.className='speaker-window';
  document.body.innerHTML='<header><div><p id="sp-pos"></p><h1 id="sp-title"></h1></div><div class="sp-clock"><strong id="sp-time">0:00</strong><span id="sp-plan"></span><button id="sp-reset" type="button">T · reiniciar</button></div></header><main><section id="sp-lines" aria-live="polite"></section><aside><h2>Después</h2><p id="sp-next"></p><h2>Respaldo</h2><p id="sp-source"></p><h2>Teclas</h2><p>→ o espacio: avanzar (si la secuencia está en marcha, la completa) · ← atrás</p></aside></main><p id="sp-wait">Abre la proyección y pulsa V, o deja esta ventana abierta: se conecta sola.</p>';
  const $=s=>document.querySelector(s);let started=performance.now(),state=null;
  const blocks=(c,step)=>{const f=c.structure.blocks;return f?[c.steps[f[step]]]:step===0?[]:step===1?[c.steps[0]]:c.steps.slice(1);};
  const planFor=n=>{const c=deck.chapters[n-1],same=deck.chapters.filter(x=>x.act===c.act),before=deck.chapters.slice(0,n-1).reduce((t,x)=>t+budget[x.act]/deck.chapters.filter(y=>y.act===x.act).length,0);return before+budget[c.act]/same.length;};
  function draw(){
   if(!state)return;$('#sp-wait').hidden=true;
   const c=deck.chapters[state.chapter-1],list=blocks(c,state.step).flatMap(b=>b.turns);
   $('#sp-pos').textContent=c.act+' · capítulo '+c.number+' de 22 · '+(state.step===0?'entrada':state.step===1?'desarrollo':'decisión');
   $('#sp-title').textContent=c.title;
   const shown=state.step===0&&c.structure.kind==='chapter'?[{who:'Herida',text:c.introWound,id:'intro'}]:list;
   $('#sp-lines').innerHTML=shown.map(t=>'<p class="'+(t.who==='María del Mar'?'mine':'other')+(t.id===state.turn?' now':'')+'"><b>'+esc(t.who==='María del Mar'?'Tú':t.who==='Herida'?'Úrsula':t.who)+'</b>'+esc(t.text)+'</p>').join('');
   $('#sp-lines .now')?.scrollIntoView({block:'center',behavior:'smooth'});
   const seq=c.structure.sequence,i=seq.indexOf(state.step),after=i<seq.length-1?'Misma historia: '+(i===0?'desarrollo':'decisión'):deck.chapters[c.number]?deck.chapters[c.number].title:'Salida al Claustro y contraportada';
   $('#sp-next').textContent=after;$('#sp-source').textContent=c.citation+' — '+c.condition;
   $('#sp-plan').textContent='previsto al acabar este capítulo: '+fmt(planFor(c.number));
  }
  ch.onmessage=e=>{if(e.data?.state){state=e.data.state;draw();}};ch.postMessage({hello:true});
  setInterval(()=>{$('#sp-time').textContent=fmt((performance.now()-started)/1000);},500);
  const reset=()=>{started=performance.now();};$('#sp-reset').onclick=reset;
  addEventListener('keydown',e=>{if(['ArrowRight',' ','PageDown'].includes(e.key)){e.preventDefault();ch.postMessage({cmd:'next'});}else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();ch.postMessage({cmd:'prev'});}else if(e.key.toLowerCase()==='t')reset();});
 });
})();

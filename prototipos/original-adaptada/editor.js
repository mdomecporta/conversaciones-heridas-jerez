// ───────────── Editor lateral (E) ─────────────
// Como el panel de preparación de la presentación principal: una nota sobre la diapositiva o un cambio de
// texto que se aplica al momento. Guarda en Netlify (/api/confesiones/…, con la contraseña del sitio) o,
// publicado como artifact de Claude, en la base de datos del artifact.
(()=>{
 const ORIG=JSON.parse(JSON.stringify(S));
 const ETQ={acto:'Rótulo del acto',t:'Título',quien:'Quién habla',q:'Frase principal',re:'Réplica de Úrsula',ev:'Doña Evidencia · recomendación',f:'Fuente'};
 const getP=(o,p)=>p.split('.').reduce((x,k)=>x?.[k],o);
 const setP=(o,p,v)=>{const ks=p.split('.'),last=ks.pop();const t=ks.reduce((x,k)=>x?.[k],o);if(t&&typeof t[last]==='string')t[last]=v;};
 function campos(i){
  const s=ORIG[i],out=[];
  for(const p of Object.keys(ETQ))if(typeof s[p]==='string'&&s[p])out.push({p,l:p==='q'?(s.who==='r'?'Frase de Doña Rutina':'Frase de Úrsula'):ETQ[p]});
  const walk=(o,p)=>{if(typeof o==='string'){if(o)out.push({p,l:'Contenido · '+p.replace(/^b\.(\d+)/,(m,a)=>'bloque '+(+a+1)).replace(/\.items\.(\d+)/g,(m,a)=>' · elemento '+(+a+1)).replace(/\.(h|t)$/,' · encabezado').replace(/\.l\b/,' · izquierda').replace(/\.r\b/,' · derecha')});return;}
   if(o&&typeof o==='object')for(const k of Object.keys(o))if(k!=='k'&&k!=='e')walk(o[k],p+'.'+k);};
  walk(s.b,'b');
  return out;
 }

 // ── Almacenes. Los dos entregan notas [{id,slide,paso,text,author,date}] y textos [{slide,path,text,author,date}].
 // Netlify: las rutas de API de la presentación principal, con «c<n>» como diapositiva y la ruta del campo en guiones.
 function netlify(onNotas,onTextos,onEstado){
  const api='/api/confesiones/';
  const pedir=async(path,opt)=>{const r=await fetch(api+path,{credentials:'same-origin',...opt,headers:{'content-type':'application/json',...opt?.headers}});const d=await r.json().catch(()=>({}));if(!r.ok)throw Object.assign(Error(d.error||'No se ha podido guardar.'),{status:r.status});return d;};
  const ms=d=>typeof d==='number'?d:Date.parse(d)||0;
  async function cargar(){
   try{
    const [ns,ts]=await Promise.all([pedir('notas'),pedir('textos')]);
    onNotas(ns.map(x=>({id:x.id,slide:+String(x.slide).slice(1),paso:x.step??0,text:x.text,author:x.author==='Sin firmar'?'':x.author,date:ms(x.date)})).filter(x=>Number.isInteger(x.slide)));
    onTextos(ts.map(t=>{const m=/^c(\d+)-([\w-]+)$/.exec(t.slide);return m&&{slide:+m[1],path:m[2].replace(/-/g,'.'),text:t.text,author:t.author==='Sin firmar'?'':t.author,date:ms(t.date)};}).filter(Boolean));
    onEstado(true);
   }catch(err){onEstado(false,err.status===401?'Tu sesión ha caducado. Recarga la página y entra con la contraseña.':'No se han podido cargar las notas.');}
  }
  cargar();setInterval(()=>{if(!document.hidden)cargar();},15000);addEventListener('focus',cargar);
  return {
   async nota(slide,paso,text,author){await pedir('notas',{method:'POST',body:JSON.stringify({slide:'c'+slide,step:paso,section:'otros',text,author})});await cargar();},
   async borrar(id){await pedir('notas?id='+encodeURIComponent(id),{method:'DELETE'});await cargar();},
   async texto(slide,path,original,text,author){await pedir('textos',{method:'POST',body:JSON.stringify({slide:`c${slide}-${path.replace(/\./g,'-')}`,original,text,author})});await cargar();}
  };
 }
 // Artifact de Claude: la base de datos del artifact, en vivo.
 function artifact(db,onNotas,onTextos,onEstado){
  const lim=setTimeout(()=>onEstado(false,'No se han podido cargar las notas.'),10000);
  const listo=q=>{if(!q.metadata.fromCache){clearTimeout(lim);onEstado(true);}};
  db.collection('notas').onSnapshot(q=>{onNotas(q.docs.map(d=>({id:d.id,...d.data()})));listo(q);},()=>{clearTimeout(lim);onEstado(false,'No se pueden guardar notas en esta vista.');});
  db.collection('textos').onSnapshot(q=>{onTextos(q.docs.map(d=>d.data()).filter(t=>t&&typeof t.path==='string'&&Number.isInteger(t.slide)));listo(q);},()=>{});
  return {
   nota:(slide,paso,text,author)=>db.collection('notas').add({slide,paso,text,author,date:Date.now()}),
   borrar:id=>db.doc('notas/'+id).delete(),
   texto:(slide,path,original,text,author)=>{const ref=db.doc(`textos/${slide}~${path}`);return text===original?ref.delete():ref.set({slide,path,original,text,author,date:Date.now()});}
  };
 }

 let almacen=null,ok=null,motivo='',notas=[],textos=[],abierto=false,tab='nota';
 const autor=()=>{try{return localStorage.getItem('herida-autor')||''}catch{return ''}};
 const fecha=d=>new Date(d).toLocaleString('es-ES',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
 function aplicar(){
  const prev=JSON.stringify(S);
  for(let i=0;i<S.length;i++)for(const {p} of campos(i))setP(S[i],p,getP(ORIG[i],p));
  for(const t of textos)if(S[t.slide]&&typeof t.text==='string')setP(S[t.slide],t.path,t.text);
  if(JSON.stringify(S)!==prev){const i=n,kk=k;n=-1;show(i,kk);}
 }
 const fab=document.createElement('button');fab.id='ed-fab';fab.type='button';fab.title='Notas y cambios (E)';fab.innerHTML='<span>Notas</span><b></b>';
 const el=document.createElement('aside');el.id='editor';el.hidden=true;el.setAttribute('aria-label','Notas y cambios de esta diapositiva');
 el.innerHTML=`<header class="ed-head"><div><span class="ed-k">Preparar</span><h2 class="ed-title"></h2><p class="ed-step"></p></div><button class="ed-close" type="button" aria-label="Cerrar (Esc)">×</button></header><nav class="ed-tabs"><button type="button" data-tab="nota">Nota</button><button type="button" data-tab="textos">Cambiar textos</button></nav><div class="ed-body"></div><footer class="ed-foot"><label>Tu nombre <input class="ed-author" type="text" placeholder="Para firmar notas y cambios"></label><button type="button" class="ed-export">Exportar todo</button></footer>`;
 document.body.append(fab,el);
 el.querySelector('.ed-author').value=autor();
 el.querySelector('.ed-author').addEventListener('change',e=>{try{localStorage.setItem('herida-autor',e.target.value.trim())}catch{}});
 const abrir=()=>{abierto=true;el.hidden=false;document.body.classList.add('is-editing');render();setTimeout(()=>el.querySelector('.ed-body textarea')?.focus(),60);};
 const cerrar=()=>{abierto=false;el.hidden=true;document.body.classList.remove('is-editing');};
 fab.addEventListener('click',()=>abierto?cerrar():abrir());
 el.querySelector('.ed-close').addEventListener('click',cerrar);
 el.querySelector('.ed-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b){tab=b.dataset.tab;render();}});
 addEventListener('keydown',e=>{
  if(e.target.closest?.('input,textarea')){if(e.key==='Escape'){e.target.blur();cerrar();}e.stopImmediatePropagation();return;}
  if(e.metaKey||e.ctrlKey||e.altKey)return;
  if(e.key==='e'||e.key==='E'){e.preventDefault();e.stopImmediatePropagation();abierto?cerrar():abrir();}
  else if(e.key==='Escape'&&abierto)cerrar();
 },true);
 const aviso=()=>ok===false?`<p class="ed-off">${esc(motivo||'No se pueden guardar notas ni cambios en esta vista.')}</p>`:ok===null?'<p class="ed-off">Conectando con las notas guardadas…</p>':'';
 let vista='';
 function render(){
  fab.querySelector('b').textContent=notas.filter(x=>x.slide===n).length||'';
  if(!abierto)return;
  const s=S[n];
  el.querySelector('.ed-title').textContent=`${String(n+1).padStart(2,'0')} · ${s.t}`;
  el.querySelector('.ed-step').textContent=`Paso ${k+1} de ${pasos(s).length}`;
  el.querySelectorAll('.ed-tabs button').forEach(b=>b.classList.toggle('is-on',b.dataset.tab===tab));
  const body=el.querySelector('.ed-body');
  // No pisar lo que se está escribiendo.
  const clave=tab+n+JSON.stringify(notas.filter(x=>x.slide===n))+JSON.stringify(textos.filter(x=>x.slide===n))+ok+motivo;
  if(clave===vista)return;
  if(body.querySelector('textarea.is-dirty')&&vista.startsWith(tab+n))return;
  vista=clave;
  const off=ok?'':'disabled';
  if(tab==='nota'){
   const mias=notas.filter(x=>x.slide===n).sort((a,b)=>a.date-b.date);
   body.innerHTML=aviso()+`<div class="notes"><textarea placeholder="Una nota sobre esta diapositiva: qué cambiar, qué decir, qué falta…" ${off}></textarea><div class="ed-row"><span class="ed-status"></span><button type="button" data-nota ${off}>Guardar nota</button></div><ul class="ed-list">${mias.map(x=>`<li><p>${esc(x.text)}</p><small>${esc(x.author||'Sin firma')} · ${fecha(x.date)} · paso ${x.paso+1}${ok?` · <button type="button" data-del="${esc(x.id)}">Borrar</button>`:''}</small></li>`).join('')||'<li class="vacio">Aún no hay notas en esta diapositiva.</li>'}</ul></div>`;
  }else{
   body.innerHTML=aviso()+`<p class="ed-hint">Corrige palabras o frases de esta diapositiva. El cambio se aplica al momento y queda anotado con el texto original.</p>`+campos(n).map(f=>{const t=textos.find(x=>x.slide===n&&x.path===f.p);return `<div class="ed-field${t?' is-changed':''}" data-p="${esc(f.p)}"><label>${esc(f.l)}</label><textarea rows="${Math.min(5,Math.ceil(getP(S[n],f.p).length/38)+1)}" ${off}>${esc(getP(S[n],f.p))}</textarea>${t?`<small class="ed-orig">Original: «${esc(getP(ORIG[n],f.p))}» · ${esc(t.author||'Sin firma')}, ${fecha(t.date)}</small>`:''}<div class="ed-row"><span class="ed-status"></span>${t&&ok?'<button type="button" class="ed-sec" data-revert>Volver al original</button>':''}<button type="button" data-save ${off}>Guardar</button></div></div>`}).join('');
  }
  body.querySelectorAll('textarea').forEach(t=>t.addEventListener('input',()=>t.classList.add('is-dirty')));
 }
 el.addEventListener('click',async e=>{
  const b=e.target.closest('[data-nota],[data-del],[data-save],[data-revert],.ed-export');if(!b)return;
  if(b.matches('.ed-export'))return exportar();
  const st=b.closest('.ed-row,.notes,.ed-field')?.querySelector('.ed-status');
  try{
   if(b.matches('[data-nota]')){const ta=b.closest('.notes').querySelector('textarea'),text=ta.value.trim();if(!text){st.textContent='Escribe algo primero.';return;}b.disabled=true;st.textContent='Guardando…';ta.classList.remove('is-dirty');await almacen.nota(n,k,text,autor());}
   else if(b.matches('[data-del]')){if(!confirm('¿Borrar esta nota? No se puede deshacer.'))return;await almacen.borrar(b.dataset.del);}
   else{
    const f=b.closest('.ed-field'),p=f.dataset.p,original=getP(ORIG[n],p);
    if(b.matches('[data-revert]')){b.disabled=true;await almacen.texto(n,p,original,original,autor());}
    else{const text=f.querySelector('textarea').value.trim();if(!text){st.textContent='El texto no puede quedar vacío.';return;}
     if(text===getP(S[n],p)){st.textContent='No hay cambios.';return;}
     b.disabled=true;st.textContent='Guardando…';f.querySelector('textarea').classList.remove('is-dirty');
     await almacen.texto(n,p,original,text,autor());}
   }
  }catch(err){if(st)st.textContent=err?.code==='invalid_argument'?'No tienes permiso para guardar aquí.':err?.message||'No se ha podido guardar. Prueba otra vez.';b.disabled=false;}
 });
 function exportar(){
  const md='# Notas y cambios · Confesiones de una úlcera\n\n'+S.map((s,i)=>{const ns=notas.filter(x=>x.slide===i),ts=textos.filter(x=>x.slide===i);if(!ns.length&&!ts.length)return '';
   return `## ${String(i+1).padStart(2,'0')} · ${ORIG[i].t}\n\n`+(ts.length?'### Cambios de texto\n\n'+ts.map(t=>`- «${getP(ORIG[i],t.path)}» → «${t.text}» (${t.author||'sin firma'}, ${fecha(t.date)})`).join('\n')+'\n\n':'')+(ns.length?'### Notas\n\n'+ns.map(x=>`- ${x.text.replace(/\n/g,' ')} (paso ${x.paso+1}; ${x.author||'sin firma'}, ${fecha(x.date)})`).join('\n')+'\n\n':'');}).join('');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([md],{type:'text/markdown'}));a.download='notas-y-cambios-confesiones.md';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);
 }
 // Sigue a la diapositiva al avanzar.
 new MutationObserver(render).observe($('#nav'),{childList:true,characterData:true,subtree:true});
 const alNotas=v=>{notas=v;render();},alTextos=v=>{textos=v;aplicar();render();},alEstado=(v,m='')=>{ok=v;motivo=m;render();};
 (async()=>{
  if(window.claude?.use){let db=null;try{db=await window.claude.use('db');}catch{}
   if(db)almacen=artifact(db,alNotas,alTextos,alEstado);else alEstado(false,'No se pueden guardar notas ni cambios en esta vista. Ábrela con tu cuenta de Claude.');}
  else if(location.protocol.startsWith('http'))almacen=netlify(alNotas,alTextos,alEstado);
  else alEstado(false,'Para guardar notas, abre la versión publicada en Netlify.');
 })();
 render();
})();

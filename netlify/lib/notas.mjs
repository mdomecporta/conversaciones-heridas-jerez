// Notas de preparación por escena y sección, con imágenes adjuntas. Cada nota es un documento propio
// en Netlify Blobs (así dos personas escribiendo a la vez no se pisan). Los almacenes se inyectan para
// poder probarlo sin Netlify.
import {valid,readCookie} from './acceso.mjs';

export const SECCIONES=['hilo','herida','recursos','evidencia','otros'];
const MAX_TEXT=6000,MAX_FILES=6,MAX_BYTES=5.5*1024*1024;
const IMAGES=['image/jpeg','image/png','image/webp','image/gif'];
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const id=()=>Date.now().toString(36)+'-'+crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
const clean=(s,n)=>String(s??'').replace(/\r\n?/g,'\n').trim().slice(0,n);

export async function handle(req,{notes,files,secret}){
 if(!await valid(secret,readCookie(req)))return json({error:'Hace falta entrar con la contraseña.'},401);
 const url=new URL(req.url);
 if(url.pathname.endsWith('/adjuntos'))return attachments(req,url,files);
 if(req.method==='GET'){
  const {blobs}=await notes.list();
  const all=(await Promise.all(blobs.map(b=>notes.get(b.key,{type:'json'})))).filter(Boolean);
  return json(all.sort((a,b)=>a.date.localeCompare(b.date)));
 }
 if(req.method==='POST'){
  let body;try{body=await req.json();}catch{return json({error:'Nota no válida.'},400);}
  const slide=clean(body.slide,40),section=SECCIONES.includes(body.section)?body.section:'otros';
  const text=clean(body.text,MAX_TEXT),author=clean(body.author,60)||'Sin firmar';
  const step=Number.isInteger(body.step)&&body.step>=0&&body.step<200?body.step:null;
  const attached=(Array.isArray(body.files)?body.files:[]).slice(0,MAX_FILES).filter(f=>f&&/^[\w-]{4,40}$/.test(f.id)).map(f=>({id:f.id,name:clean(f.name,120),type:IMAGES.includes(f.type)?f.type:'image/jpeg',size:Number(f.size)||0}));
  if(!/^[\w-]{1,40}$/.test(slide))return json({error:'Escena no válida.'},400);
  if(!text&&!attached.length)return json({error:'La nota está vacía.'},400);
  const note={id:id(),slide,step,section,text,author,files:attached,date:new Date().toISOString()};
  await notes.setJSON(note.id,note);
  return json(note,201);
 }
 if(req.method==='DELETE'){
  const key=url.searchParams.get('id')||'';
  if(!/^[\w-]{4,40}$/.test(key))return json({error:'Nota no válida.'},400);
  const note=await notes.get(key,{type:'json'});
  if(note){await Promise.all((note.files||[]).map(f=>files.delete(f.id)));await notes.delete(key);}
  return json({ok:true});
 }
 return json({error:'Método no admitido.'},405);
}

async function attachments(req,url,files){
 if(req.method==='POST'){
  const type=(req.headers.get('content-type')||'').split(';')[0];
  if(!IMAGES.includes(type))return json({error:'Solo se pueden adjuntar imágenes (JPG, PNG, WebP o GIF).'},415);
  const data=await req.arrayBuffer();
  if(!data.byteLength)return json({error:'La imagen está vacía.'},400);
  if(data.byteLength>MAX_BYTES)return json({error:'La imagen es demasiado grande.'},413);
  const name=clean(decodeURIComponent(req.headers.get('x-nombre')||'imagen'),120);
  const key=id();
  await files.set(key,data,{metadata:{type,name}});
  return json({id:key,name,type,size:data.byteLength},201);
 }
 if(req.method==='GET'){
  const key=url.searchParams.get('id')||'';
  if(!/^[\w-]{4,40}$/.test(key))return json({error:'Imagen no válida.'},400);
  const found=await files.getWithMetadata(key,{type:'arrayBuffer'});
  if(!found)return json({error:'No existe.'},404);
  return new Response(found.data,{headers:{'content-type':found.metadata?.type||'image/jpeg','cache-control':'private, max-age=31536000, immutable'}});
 }
 return json({error:'Método no admitido.'},405);
}

// Servidor local que imita el sitio publicado: pide contraseña salvo en /ver/ y guarda las notas
// en memoria (se pierden al cerrarlo). Uso: SITE_PASSWORD=loquesea npm run local
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {issue,valid,readCookie,samePassword,sessionCookie,clearCookie,safeNext} from '../netlify/lib/acceso.mjs';
import {loginPage} from '../netlify/lib/entrada.mjs';
import {handle} from '../netlify/lib/notas.mjs';

const PASSWORD=process.env.SITE_PASSWORD||'prueba',SECRET=process.env.SESSION_SECRET||PASSWORD,PORT=Number(process.env.PORT||8888);
const memory=()=>{const m=new Map();return {async list(){return {blobs:[...m.keys()].map(key=>({key}))};},async get(k){return m.get(k)?.data??null;},async setJSON(k,v){m.set(k,{data:v});},async set(k,data,{metadata}={}){m.set(k,{data,metadata});},async getWithMetadata(k){return m.get(k)||null;},async delete(k){m.delete(k);}};};
const stores={notes:memory(),files:memory(),texts:memory(),secret:SECRET};
const dist=new URL('../dist/',import.meta.url);
// Las cookies Secure no viajan por http://localhost en todos los navegadores: en local se quita Secure.
const local=c=>c.replace('; Secure','');

http.createServer(async (req,res)=>{
 const url=new URL(req.url,`http://${req.headers.host}`),path=url.pathname;
 const chunks=[];for await(const c of req)chunks.push(c);
 const request=new Request(url,{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)});
 const send=async response=>{res.writeHead(response.status,Object.fromEntries([...response.headers].map(([k,v])=>[k,k==='set-cookie'?local(v):v])));res.end(Buffer.from(await response.arrayBuffer()));};
 const file=async name=>{try{return send(new Response(await readFile(new URL(name,dist)),{headers:{'content-type':'text/html; charset=utf-8'}}));}catch{return send(new Response('No encontrado',{status:404}));}};
 if(path==='/ver'||path.startsWith('/ver/'))return file('ver/index.html');
 if(path==='/api/textos'&&req.method==='GET')return send(await handle(request,stores));
 if(path==='/salir')return send(new Response(null,{status:303,headers:{location:'/','set-cookie':clearCookie()}}));
 if(path==='/entrar'&&req.method==='POST'){
  const form=await request.formData(),volver=safeNext(form.get('volver'));
  if(await samePassword(form.get('clave'),PASSWORD))return send(new Response(null,{status:303,headers:{location:volver,'set-cookie':sessionCookie(await issue(SECRET))}}));
  return send(new Response(loginPage({error:true,volver}),{status:401,headers:{'content-type':'text/html; charset=utf-8'}}));
 }
 if(!await valid(SECRET,readCookie(request))){
  if(path.startsWith('/api/'))return send(new Response('{"error":"Sin sesión"}',{status:401,headers:{'content-type':'application/json'}}));
  return send(new Response(loginPage({volver:path+url.search}),{status:401,headers:{'content-type':'text/html; charset=utf-8'}}));
 }
 if(['/api/notas','/api/adjuntos','/api/textos'].includes(path))return send(await handle(request,stores));
 return file('index.html');
}).listen(PORT,'127.0.0.1',()=>console.log(`Sitio local en http://127.0.0.1:${PORT}/ (contraseña: la de SITE_PASSWORD; público en /ver/)`));

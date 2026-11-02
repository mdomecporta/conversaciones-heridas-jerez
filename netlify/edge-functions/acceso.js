// Protege todo el sitio con la contraseña de SITE_PASSWORD, salvo el enlace para compartir (/ver/),
// que es público mientras COMPARTIR no valga "no", y el carro 3D (/carro/), que no tiene nada privado y lo usa /ver/.
import {issue,valid,readCookie,samePassword,secretOf,sessionCookie,clearCookie,safeNext} from '../lib/acceso.mjs';
import {loginPage} from '../lib/entrada.mjs';

const env=k=>Netlify.env.get(k);
const html=(body,status=200,extra={})=>new Response(body,{status,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-robots-tag':'noindex',...extra}});

export default async (req,context)=>{
 const url=new URL(req.url),path=url.pathname;
 if((path==='/ver'||path.startsWith('/ver/'))&&env('COMPARTIR')!=='no')return context.next();
 if(path.startsWith('/carro/'))return context.next();
 // Los cambios de texto se aplican también en el enlace público: leerlos no pide contraseña.
 if(path==='/api/textos'&&req.method==='GET')return context.next();
 const password=env('SITE_PASSWORD'),secret=secretOf(env);
 if(!password)return new Response('Falta configurar SITE_PASSWORD en Netlify (Configuración del sitio → Variables de entorno).',{status:503,headers:{'content-type':'text/plain; charset=utf-8'}});
 if(path==='/salir')return new Response(null,{status:303,headers:{location:'/','set-cookie':clearCookie()}});
 if(path==='/entrar'&&req.method==='POST'){
  const form=await req.formData();
  const volver=safeNext(form.get('volver'));
  if(await samePassword(form.get('clave'),password))return new Response(null,{status:303,headers:{location:volver,'set-cookie':sessionCookie(await issue(secret))}});
  await new Promise(r=>setTimeout(r,900));
  return html(loginPage({error:true,volver}),401);
 }
 if(await valid(secret,readCookie(req)))return context.next();
 if(path.startsWith('/api/'))return new Response(JSON.stringify({error:'Hace falta entrar con la contraseña.'}),{status:401,headers:{'content-type':'application/json'}});
 return html(loginPage({volver:path+url.search}),401);
};

export const config={path:'/*'};

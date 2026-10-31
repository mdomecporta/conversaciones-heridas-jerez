// Acceso con una contraseña compartida. La sesión es una cookie firmada (HMAC-SHA256) que caduca
// a los 30 días; el servidor no guarda nada. Funciona igual en la función de borde (Deno) y en Node.
// La contraseña nunca está en el código: viene de la variable de entorno SITE_PASSWORD de Netlify.
const enc=new TextEncoder();
const hex=buf=>[...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
async function hmac(secret,data){
 const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 return hex(await crypto.subtle.sign('HMAC',key,enc.encode(data)));
}
const same=(a,b)=>{if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0;};

export const COOKIE='herida_sesion';
export const DAYS=30;
// Con SESSION_SECRET las sesiones no dependen de la contraseña; sin ella, cambiar la contraseña las cierra todas.
export const secretOf=env=>env('SESSION_SECRET')||env('SITE_PASSWORD')||'';

export async function issue(secret,now=Date.now()){
 const exp=now+DAYS*864e5;
 return `${exp}.${await hmac(secret,'sesion.'+exp)}`;
}
export async function valid(secret,token,now=Date.now()){
 if(!secret||!token)return false;
 const [exp,mac]=String(token).split('.');
 if(!exp||!mac||!(Number(exp)>now))return false;
 return same(await hmac(secret,'sesion.'+exp),mac);
}
// Compara a través de HMAC para que el tiempo de respuesta no dependa de cuántos caracteres coinciden.
export async function samePassword(given,expected){
 if(!expected)return false;
 return same(await hmac('clave',String(given||'')),await hmac('clave',expected));
}
export function readCookie(req,name=COOKIE){
 for(const part of (req.headers.get('cookie')||'').split(/;\s*/)){const i=part.indexOf('=');if(i>0&&part.slice(0,i)===name)return part.slice(i+1);}
 return null;
}
export const sessionCookie=token=>`${COOKIE}=${token}; Path=/; Max-Age=${DAYS*86400}; HttpOnly; Secure; SameSite=Lax`;
export const clearCookie=()=>`${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
// Solo se vuelve a rutas propias, nunca a otra web.
export const safeNext=v=>{const s=String(v||'/');return s.startsWith('/')&&!s.startsWith('//')&&!s.includes('\\')?s:'/';};

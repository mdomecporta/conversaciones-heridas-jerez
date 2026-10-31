// Acceso con contraseña y notas de preparación, probados con almacenes en memoria (sin Netlify).
import test from 'node:test';
import assert from 'node:assert/strict';
import {issue,valid,samePassword,readCookie,safeNext,COOKIE} from '../netlify/lib/acceso.mjs';
import {handle} from '../netlify/lib/notas.mjs';

const memory=()=>{const m=new Map();return {
 async list(){return {blobs:[...m.keys()].map(key=>({key}))};},
 async get(k){return m.has(k)?structuredClone(m.get(k).data):null;},
 async setJSON(k,v){m.set(k,{data:v});},
 async set(k,data,{metadata}={}){m.set(k,{data,metadata});},
 async getWithMetadata(k){return m.get(k)||null;},
 async delete(k){m.delete(k);},
 size:()=>m.size
};};
const SECRET='secreto-de-prueba';
const req=async (path,{method='GET',body,headers={},auth=true}={})=>new Request('https://herida.test'+path,{method,body,headers:{...headers,...(auth?{cookie:`${COOKIE}=${await issue(SECRET)}`}:{})}});

test('la sesión firmada caduca y no se puede falsificar',async()=>{
 const t=await issue(SECRET,Date.now());
 assert.ok(await valid(SECRET,t));
 assert.equal(await valid('otro',t),false);
 assert.equal(await valid(SECRET,t.replace(/.$/,c=>c==='0'?'1':'0')),false);
 assert.equal(await valid(SECRET,t,Date.now()+31*864e5),false);
 assert.equal(await valid(SECRET,null),false);
});
test('la contraseña se compara entera',async()=>{
 assert.ok(await samePassword('correcta','correcta'));
 assert.equal(await samePassword('correct','correcta'),false);
 assert.equal(await samePassword('','correcta'),false);
 assert.equal(await samePassword('x',''),false);
});
test('solo se vuelve a rutas de la propia web',()=>{
 assert.equal(safeNext('/?guia'),'/?guia');
 assert.equal(safeNext('//malo.com'),'/');
 assert.equal(safeNext('https://malo.com'),'/');
 assert.equal(readCookie(new Request('https://x',{headers:{cookie:`a=1; ${COOKIE}=abc.def`}})),'abc.def');
});
test('sin sesión no se leen ni se escriben notas',async()=>{
 const r=await handle(await req('/api/notas',{auth:false}),{notes:memory(),files:memory(),secret:SECRET});
 assert.equal(r.status,401);
});
test('una nota se guarda con su escena, sección e imágenes, y se borra con ellas',async()=>{
 const notes=memory(),files=memory(),ctx={notes,files,secret:SECRET};
 const up=await handle(await req('/api/adjuntos',{method:'POST',body:new Uint8Array([1,2,3]),headers:{'content-type':'image/png','x-nombre':encodeURIComponent('mi foto.png')}}),ctx);
 assert.equal(up.status,201);const file=await up.json();
 assert.equal(file.name,'mi foto.png');
 const made=await handle(await req('/api/notas',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({slide:'escena-4',step:2,section:'recursos',text:'Usaría mi foto',author:'María del Mar',files:[file]})}),ctx);
 assert.equal(made.status,201);const note=await made.json();
 assert.equal(note.section,'recursos');assert.equal(note.step,2);assert.equal(note.files.length,1);
 const list=await (await handle(await req('/api/notas'),ctx)).json();
 assert.equal(list.length,1);
 const img=await handle(await req('/api/adjuntos?id='+file.id),ctx);
 assert.equal(img.headers.get('content-type'),'image/png');
 await handle(await req('/api/notas?id='+note.id,{method:'DELETE'}),ctx);
 assert.equal(notes.size(),0);assert.equal(files.size(),0);
});
test('se rechazan notas vacías, escenas raras y archivos que no son imágenes',async()=>{
 const ctx={notes:memory(),files:memory(),secret:SECRET};
 const post=b=>req('/api/notas',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
 assert.equal((await handle(await post({slide:'escena-1',text:'  '}),ctx)).status,400);
 assert.equal((await handle(await post({slide:'../x',text:'hola'}),ctx)).status,400);
 const odd=await handle(await post({slide:'escena-1',text:'hola',section:'inventada'}),ctx);
 assert.equal((await odd.json()).section,'otros');
 assert.equal((await handle(await req('/api/adjuntos',{method:'POST',body:'x',headers:{'content-type':'application/pdf'}}),ctx)).status,415);
});

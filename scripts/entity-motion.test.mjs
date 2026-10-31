import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const src=await readFile(new URL('../entity-liquid.js',import.meta.url),'utf8');
const ctx=vm.createContext({console});vm.runInContext(src+';globalThis.renderer=LiquidEntity;',ctx);
function entity(){
 const values={};const gl={viewport(){},clearColor(){},clear(){},uniform1f(k,v){values[k]=v;},uniform2f(){},uniform2fv(){},uniform3fv(){},uniform4fv(k,v){values[k]=[...v];},drawArrays(){}};
 const u=new Proxy({},{get:(_,k)=>k});
 return {values,canvas:{width:500,height:300},liquid:{gl,u},gaze:[0,0],colors:[[.9,.5,.4],[1,.9,.8]],cur:{listen:0,think:0,speak:0,remember:0,show:0,tense:0,relief:0}};
}
test('cambiar de estado tras una sesión larga no hace saltar la fase del flujo',()=>{
 const e=entity();ctx.renderer.draw(e,100000,0,0,1/30,true);const start=e.values.flowTime;
 e.cur.think=1;ctx.renderer.draw(e,100000+1/30,0,0,1/30,true);
 assert.ok(e.values.flowTime-start>0&&e.values.flowTime-start<.05);
});
test('las membranas externas siguen al núcleo con retraso y la pausa conserva su estado',()=>{
 const e=entity();e.cur.listen=1;
 for(let i=0;i<12;i++)ctx.renderer.draw(e,i/30,0,0,1/30,true);
 assert.ok(Math.abs(e.values.layer3[0])>Math.abs(e.values.layer0[0]));
 assert.ok(e.values.layer3[0]<0);
 const before=JSON.stringify({layers:e.liquid.motion.layers,flow:e.values.flowTime});
 ctx.renderer.draw(e,10,0,0,1,false);
 assert.equal(JSON.stringify({layers:e.liquid.motion.layers,flow:e.values.flowTime}),before);
});
test('la atención cambia de lado suavemente sin reiniciar las membranas',()=>{
 const e=entity();e.cur.listen=1;e.attention='left';
 for(let i=0;i<90;i++)ctx.renderer.draw(e,i/30,0,0,1/30,true);
 const before=e.values.layer3[0];e.attention='right';ctx.renderer.draw(e,3,0,0,1/30,true);
 assert.ok(e.values.layer3[0]<0);assert.ok(Math.abs(e.values.layer3[0]-before)<.02);
 for(let i=0;i<120;i++)ctx.renderer.draw(e,3+i/30,0,0,1/30,true);
 assert.ok(e.values.layer3[0]>0);
});

test('los pigmentos atraviesan las paletas con continuidad y conservan su mezcla en pausa',()=>{
 const e=entity();e.chromatic=1;e.palette=0;
 ctx.renderer.draw(e,0,0,0,1/30,true);const initial=e.liquid.motion.pigments.slice();
 e.palette=2;ctx.renderer.draw(e,1/30,0,0,1/30,true);
 assert.ok(e.liquid.motion.pigments[2]-initial[2]<.02);
 for(let i=0;i<240;i++)ctx.renderer.draw(e,i/30,0,0,1/30,true);
 assert.ok(e.liquid.motion.pigments[2]>.8);
 const frozen=JSON.stringify(e.liquid.motion.pigments);e.cur.think=1;
 ctx.renderer.draw(e,100,0,0,1,false);assert.equal(JSON.stringify(e.liquid.motion.pigments),frozen);
});
test('el pensamiento alcanza una familia distinta sin perder una mezcla cromática normalizada',()=>{
 const e=entity();e.chromatic=1;e.palette=0;e.cur.think=1;
 for(let i=0;i<240;i++)ctx.renderer.draw(e,i/30,0,0,1/30,true);
 const w=e.liquid.motion.pigments;
 assert.ok(w[1]>.8);assert.ok(w.every(n=>n>=0&&n<=1));
 assert.ok(Math.abs(w.reduce((a,b)=>a+b,0)-1)<1e-6);
});

test('el gesto de atención adelanta el núcleo antes de envolverlo y se asienta sin repetirse',()=>{
 const e=entity();e.cur.listen=1;
 for(let i=0;i<9;i++)ctx.renderer.draw(e,i/30,0,0,1/30,true);
 const g=e.liquid.motion.gesture;
 assert.ok(g.reach>.9&&g.wrap<.2);
 for(let i=9;i<29;i++)ctx.renderer.draw(e,i/30,0,0,1/30,true);
 assert.ok(g.wrap>.95&&g.reach<.1);
 const frozen=JSON.stringify(g);ctx.renderer.draw(e,20,0,0,1,false);
 assert.equal(JSON.stringify(g),frozen);
 for(let i=29;i<150;i++)ctx.renderer.draw(e,i/30,0,0,1/30,true);
 assert.ok(Math.abs(g.reach)<.001&&g.wrap<.001);
 e.cur.listen=0;ctx.renderer.draw(e,5,0,0,1/30,true);
 e.cur.listen=1;ctx.renderer.draw(e,5+1/30,0,0,1/30,true);
 assert.ok(g.age<.1);
});

test('el habla se recoge antes de abrirse y vuelve con continuidad al reposo',()=>{
 const e=entity();e.cur.speak=1;
 for(let i=0;i<8;i++)ctx.renderer.draw(e,i/30,0,0,1/30,true);
 const d=e.liquid.motion.delivery;
 assert.ok(d.shape<-.01&&d.gate<.4);
 for(let i=8;i<28;i++)ctx.renderer.draw(e,i/30,0,0,1/30,true);
 assert.ok(d.shape>.025&&d.gate===1);
 const before=d.shape;e.cur.speak=0;ctx.renderer.draw(e,1,0,0,1/30,true);
 assert.ok(Math.abs(d.shape-before)<.02);
 const frozen=JSON.stringify(e.liquid.motion);ctx.renderer.draw(e,100,0,0,1,false);
 assert.equal(JSON.stringify(e.liquid.motion),frozen);
 for(let i=0;i<90;i++)ctx.renderer.draw(e,1+i/30,0,0,1/30,true);
 assert.ok(Math.abs(d.shape)<.001&&Math.abs(d.velocity)<.001);
});

test('el reposo alterna actividad y quietud sin detener ni invertir el flujo',()=>{
 const e=entity(),speeds=[];
 for(let i=0;i<300;i++){
  const before=e.liquid.motion?.flow??0;
  ctx.renderer.draw(e,i/30,0,0,1/30,true);
  speeds.push((e.liquid.motion.flow-before)*30);
 }
 assert.ok(Math.min(...speeds)>.2);
 assert.ok(Math.max(...speeds)>Math.min(...speeds)*3);
 assert.ok(speeds.every((v,i)=>i===0||Math.abs(v-speeds[i-1])<.03));
});

test('la atención al cursor tiene inercia y vuelve al centro al alejarse',()=>{
 const e=entity();e.interaction={point:[.8,.3],proximity:1,tapId:0,tapPoint:[0,0]};
 ctx.renderer.draw(e,0,0,0,1/30,true);
 assert.ok(e.liquid.motion.touch.p[0]>0&&e.liquid.motion.touch.p[0]<.01);
 for(let i=0;i<60;i++)ctx.renderer.draw(e,i/30,0,0,1/30,true);
 assert.ok(e.liquid.motion.touch.p[0]>.08);
 const before=e.liquid.motion.touch.p[0];e.interaction.proximity=0;
 ctx.renderer.draw(e,2,0,0,1/30,true);
 assert.ok(Math.abs(e.liquid.motion.touch.p[0]-before)<.01);
 for(let i=0;i<120;i++)ctx.renderer.draw(e,2+i/30,0,0,1/30,true);
 assert.ok(Math.abs(e.liquid.motion.touch.p[0])<.001);
});

test('el toque conserva el punto de contacto, se disipa y no envejece en pausa',()=>{
 const e=entity();e.interaction={point:[.2,-.3],proximity:1,tapId:1,tapPoint:[.2,-.3]};
 ctx.renderer.draw(e,0,0,0,1/30,true);
 const touch=e.liquid.motion.touch;
 assert.equal(JSON.stringify(touch.point),'[0.2,-0.3]');assert.equal(touch.age,0);
 e.interaction.point=[-.8,.4];
 for(let i=0;i<30;i++)ctx.renderer.draw(e,i/30,0,0,1/30,true);
 assert.equal(JSON.stringify(touch.point),'[0.2,-0.3]');assert.ok(touch.age>.9);
 const frozen=JSON.stringify(touch);ctx.renderer.draw(e,10,0,0,1,false);
 assert.equal(JSON.stringify(touch),frozen);
 for(let i=0;i<150;i++)ctx.renderer.draw(e,i/30,0,0,1/30,true);
 assert.ok(Math.exp(-touch.age*3.6)<.00001);
});

test('la definición se adapta al tamaño visual independientemente de la densidad de pantalla',()=>{
 const small=entity();small.canvas.clientWidth=80;small.canvas.clientHeight=80;
 small.canvas.width=160;small.canvas.height=160;
 ctx.renderer.draw(small,0,0,0,1/30,true);
 const profile=small.values.compactness;assert.ok(profile>.8);
 small.canvas.width=240;small.canvas.height=240;
 ctx.renderer.draw(small,0,0,0,1/30,true);assert.equal(small.values.compactness,profile);
 const large=entity();large.canvas.clientWidth=192;large.canvas.clientHeight=192;
 ctx.renderer.draw(large,0,0,0,1/30,true);assert.equal(large.values.compactness,0);
});

test('la presencia se refuerza sobre fotografía y recupera su transparencia al cambiar de fondo',()=>{
 const e=entity();e.canvas.parentElement={dataset:{surface:'photo'}};
 ctx.renderer.draw(e,0,0,0,1/30,true);assert.equal(e.values.backdrop,1);
 e.canvas.parentElement.dataset.surface='dark';
 ctx.renderer.draw(e,0,0,0,1/30,true);assert.equal(e.values.backdrop,0);
});

test('las paletas artísticas cambian sin saltos y conservan sus pigmentos en pausa',()=>{
 const e=entity();e.ink=1;ctx.renderer.draw(e,0,0,0,1/30,true);
 const before=e.liquid.motion.inkColors.slice();e.ink=2;
 ctx.renderer.draw(e,1/30,0,0,1/30,true);
 assert.ok(e.liquid.motion.inkColors.every((v,i)=>Math.abs(v-before[i])<.025));
 for(let i=0;i<180;i++)ctx.renderer.draw(e,i/30,0,0,1/30,true);
 const colors=e.liquid.motion.inkColors;
 assert.ok(colors[9]>.7&&colors[10]>.8&&colors[11]<.4);
 const frozen=JSON.stringify(e.liquid.motion);e.ink=4;
 ctx.renderer.draw(e,100,0,0,1,false);assert.equal(JSON.stringify(e.liquid.motion),frozen);
});

test('la familia serosa conserva un núcleo rojo y usa menos densidad que la familia carmín',()=>{
 const clear=entity(),red=entity();clear.ink=3;red.ink=1;clear.cur.think=1;
 for(let i=0;i<120;i++){ctx.renderer.draw(clear,i/30,0,0,1/30,true);ctx.renderer.draw(red,i/30,0,0,1/30,true);}
 assert.ok(clear.liquid.motion.inkColors[0]>clear.liquid.motion.inkColors[2]);
 assert.ok(clear.liquid.motion.inkStyle[1]<red.liquid.motion.inkStyle[1]*.6);
 clear.ink=0;ctx.renderer.draw(clear,5,0,0,1/30,true);
 assert.ok(clear.liquid.motion.ink>0&&clear.liquid.motion.ink<1);
 for(let i=0;i<180;i++)ctx.renderer.draw(clear,5+i/30,0,0,1/30,true);
 assert.ok(clear.liquid.motion.ink<.001);
});

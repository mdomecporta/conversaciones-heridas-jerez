import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../entity-scene.js',import.meta.url),'utf8');
function setup(){
 const state={image:false,paused:false,reduced:false,time:0,geometry:null,next:null};
 const dock={getBoundingClientRect:()=>({left:500,top:200,width:128,height:128})};
 const image={getBoundingClientRect:()=>({left:180,top:380,width:400,height:260})};
 const panel={querySelector:s=>s==='.lab-entity'?dock:s.includes('.lab-image-plane')&&state.image?image:null,style:{setProperty(){}},classList:{toggle(){}}};
 const document={documentElement:{classList:{add(){}}},createElement:()=>({dataset:{}}),body:{append(){}},addEventListener(){},querySelector:s=>s==='.conversation-panel'?panel:s.includes('motion-off')&&state.paused?{}:null};
 const ctx=vm.createContext({document,innerWidth:1000,innerHeight:800,matchMedia:()=>({matches:state.reduced}),requestAnimationFrame:f=>state.next=f,setTimeout,clearTimeout,Presence:{body:(_z,g)=>state.geometry=JSON.parse(JSON.stringify(g))}});
 vm.runInContext(source,ctx);
 const advance=n=>{for(let i=0;i<n;i++){state.time+=1000/60;state.next(state.time);}return state.geometry;};
 advance(1);return {state,advance};
}
test('el núcleo se adelanta antes de abrir la membrana y el cuerpo vuelve a su lugar',()=>{
 const {state,advance}=setup(),initial=advance(60);
 state.image=true;const beginning=advance(12);
 assert.ok(beginning.progress<.01);assert.ok(beginning.core[0]<initial.core[0]);
 const open=advance(180);assert.ok(open.progress>.98);
 assert.equal(open.portal[2],.5);assert.equal(open.portal[3],.325);
 state.image=false;const closing=advance(1);
 assert.ok(closing.progress>.9);
 const restored=advance(240);assert.ok(restored.progress<.001);
 assert.ok(Math.abs(restored.core[0]-initial.core[0])<.001);
});
test('la pausa conserva el despliegue y el movimiento reducido abre el recurso sin recorrido',()=>{
 const {state,advance}=setup();advance(30);state.image=true;advance(50);
 state.paused=true;const frozen=JSON.stringify(state.geometry);advance(120);
 assert.equal(JSON.stringify(state.geometry),frozen);
 state.paused=false;assert.ok(advance(120).progress>.98);
 state.reduced=true;state.image=false;assert.equal(advance(1).progress,0);
 state.image=true;assert.equal(advance(1).progress,1);
});

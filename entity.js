// Presence: the living entity that speaks in the conversation scenes.
// Canvases are pooled and re-attached after each render, so the same entity survives
// re-renders, morphs its colour between voices and glides from one scene to the next.
// Colours identify the voice; they never represent a clinical sign.
const Presence = (() => {
 const hex = h => [1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
 const VOICES = {
  principal:['#19b3a6','#9ae6d9','#b8b0f5'],
  persona:['#ff9e78','#ffd6a0','#f7a8c4'],
  isquemica:['#5b5bd6','#9aa8ff','#cfe0ff'],
  paliativa:['#c39bf0','#f4b6cf','#fde7d4']
 };
 const STATES = {
  idle:{energy:.25,ring:0},listening:{energy:.3,ring:.3},exploring:{energy:.45,ring:1},remembering:{energy:.3,ring:.65},
  responding:{energy:.6,ring:0},comparing:{energy:.5,ring:.35},vascular:{energy:.35,ring:.2}
 };
 const LABELS = {calm:'En calma',listening:'Escuchando',thinking:'Pensando…',speaking:'Respondiendo'};
 const VERT = 'attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
 const FRAG = `precision highp float;varying vec2 v;
uniform vec2 uRes;uniform float uT,uEnergy,uRing,uListen,uThink,uSpeak,uBreath,uSeed;uniform vec3 uA,uB,uC;uniform vec2 uGaze;
vec3 m3(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 m4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 perm(vec4 x){return m4(((x*34.)+1.)*x);}vec4 tis(vec4 r){return 1.79284291400159-.85373472095314*r;}
float sn(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
 vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
 vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=m3(i);
 vec4 p=perm(perm(perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
 vec3 ns=.142857142857*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
 vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
 vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
 vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
 vec4 n=tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=n.x;p1*=n.y;p2*=n.z;p3*=n.w;
 vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
 return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
 float s=min(uRes.x,uRes.y);vec2 p=(v*uRes-.5*uRes)/s;float t=uT+uSeed*17.;
 vec2 g=uGaze*.035;vec2 q=p-g;float ang=atan(q.y,q.x);float flow=t*(.12+.3*uThink);
 float r0=.31*(1.+.035*uBreath+.04*uSpeak-.035*uListen);
 float wob=sn(vec3(q*1.7,flow))*(.045+.03*uEnergy)+sn(vec3(q*3.4+3.,flow*1.6))*(.016+.014*uEnergy)+sin(ang*3.+t*.7)*.009*uSpeak;
 float d=length(q*vec2(1.,1.05))-(r0+wob);float body=1.-smoothstep(-.007,.007,d);
 vec2 w=q*2.+vec2(sn(vec3(q*1.4,flow+5.)),sn(vec3(q*1.4+9.,flow+2.)))*.55;float f=sn(vec3(w,flow*.8))*.5+.5;
 vec3 col=mix(uA,uB,smoothstep(.15,.85,f));col=mix(col,uC,smoothstep(.1,.9,q.y/r0*.5+.5)*.6);
 col*=1.-.16*smoothstep(-.05,-.32,q.y);
 col=mix(col,mix(uC,vec3(1.),.4),smoothstep(-.07,0.,d)*.55);
 vec2 lp=q-vec2(-.09,.11)-g*1.4;col+=vec3(1.)*exp(-dot(lp,lp)*28.)*.5;
 col+=vec3(1.)*exp(-dot(q,q)*32.)*(.1+.35*uSpeak);
 col+=vec3(1.)*uThink*.22*smoothstep(.6,1.,sin(ang*2.-t*3.2));
 float glow=exp(-max(d,0.)*7.)*(.34+.14*uEnergy+.22*uListen);
 float ring=exp(-pow((d-(.075+.02*sin(t*1.3)))*55.,2.))*uRing*.38;
 float a=body+(1.-body)*(glow*.55+ring);
 vec3 c=mix(mix(uB,uC,.5),col,body)+(hash(v*uRes+fract(t)*91.)-.5)*.07*body;
 gl_FragColor=vec4(clamp(c,0.,1.)*a,a);}`;
 const pool=[]; let active=[], raf=0, last=0, clock=0, pointer=null, motion=true, statusEl=null, phase='calm', timers=[];
 const reduced = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
 const lerp = (a,b,k) => a+(b-a)*k;

 function create(){
  const canvas=document.createElement('canvas');canvas.className='orb-canvas';
  const e={canvas,voice:null,state:'idle',seed:Math.random(),cur:{energy:.25,ring:0,listen:0,think:0,speak:0},target:{energy:.25,ring:0,listen:0,think:0,speak:0},colors:null,targetColors:null,gaze:[0,0],talking:0,thinking:0};
  const gl=canvas.getContext('webgl',{premultipliedAlpha:true,antialias:false,alpha:true});
  if(gl){
   const sh=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null;};
   const vs=sh(gl.VERTEX_SHADER,VERT),fs=sh(gl.FRAGMENT_SHADER,FRAG);
   if(vs&&fs){
    const prog=gl.createProgram();gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.linkProgram(prog);
    if(gl.getProgramParameter(prog,gl.LINK_STATUS)){
     gl.useProgram(prog);gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
     gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
     const loc=gl.getAttribLocation(prog,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
     e.gl=gl;e.u=Object.fromEntries(['uRes','uT','uEnergy','uRing','uListen','uThink','uSpeak','uBreath','uSeed','uA','uB','uC','uGaze'].map(n=>[n,gl.getUniformLocation(prog,n)]));
    }
   }
  }
  if(!e.gl)e.ctx=canvas.getContext('2d');
  return e;
 }
 function setVoice(e,voice){
  const v=VOICES[voice]?voice:'principal';if(e.voice===v)return;
  e.voice=v;e.targetColors=VOICES[v].map(hex);if(!e.colors)e.colors=e.targetColors.map(c=>c.slice());
 }
 function setState(e,state){e.state=STATES[state]?state:'idle';Object.assign(e.target,STATES[e.state]);}
 function size(e){
  const r=e.canvas.getBoundingClientRect();if(!r.width||!r.height)return null;
  const k=Math.min(1,640/Math.max(r.width,r.height))*Math.min(globalThis.devicePixelRatio||1,1.25);
  const w=Math.max(2,Math.round(r.width*k)),h=Math.max(2,Math.round(r.height*k));
  if(e.canvas.width!==w||e.canvas.height!==h){e.canvas.width=w;e.canvas.height=h;}
  return r;
 }
 function draw(e,dt){
  const r=size(e);if(!r)return;
  const k=Math.min(1,dt*3.2);
  for(const key in e.cur)e.cur[key]=lerp(e.cur[key],e.target[key],k);
  e.colors.forEach((c,i)=>c.forEach((x,j)=>c[j]=lerp(x,e.targetColors[i][j],Math.min(1,dt*1.6))));
  const now=performance.now();
  e.target.think=now<e.thinking?1:0;
  e.target.speak=now<e.talking&&now>=e.thinking?.35+.45*Math.abs(Math.sin(clock*8.3))*(.6+.4*Math.sin(clock*2.1)):0;
  let gx=0,gy=0;
  if(pointer){gx=(pointer[0]-(r.left+r.width/2))/r.width;gy=-(pointer[1]-(r.top+r.height/2))/r.height;const len=Math.hypot(gx,gy);if(len>1){gx/=len;gy/=len;}}
  e.gaze[0]=lerp(e.gaze[0],gx,Math.min(1,dt*1.5));e.gaze[1]=lerp(e.gaze[1],gy,Math.min(1,dt*1.5));
  const breath=Math.sin(clock*Math.PI*2/5.5);
  if(e.gl){
   const {gl,u}=e;gl.viewport(0,0,e.canvas.width,e.canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
   gl.uniform2f(u.uRes,e.canvas.width,e.canvas.height);gl.uniform1f(u.uT,clock);gl.uniform1f(u.uSeed,e.seed);gl.uniform1f(u.uBreath,breath);
   gl.uniform1f(u.uEnergy,e.cur.energy);gl.uniform1f(u.uRing,e.cur.ring);gl.uniform1f(u.uListen,e.cur.listen);gl.uniform1f(u.uThink,e.cur.think);gl.uniform1f(u.uSpeak,e.cur.speak);
   gl.uniform3fv(u.uA,e.colors[0]);gl.uniform3fv(u.uB,e.colors[1]);gl.uniform3fv(u.uC,e.colors[2]);gl.uniform2f(u.uGaze,e.gaze[0],e.gaze[1]);
   gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  }else if(e.ctx){
   // Without WebGL: a soft breathing gradient keeps the same identity.
   const {ctx}=e,w=e.canvas.width,h=e.canvas.height,s=Math.min(w,h),rad=s*.29*(1+.035*breath+.04*e.cur.speak);
   const css=c=>`rgb(${c.map(x=>Math.round(x*255)).join(',')})`;
   ctx.clearRect(0,0,w,h);const cx=w/2+e.gaze[0]*s*.03,cy=h/2-e.gaze[1]*s*.03;
   const halo=ctx.createRadialGradient(cx,cy,rad*.8,cx,cy,rad*1.6);halo.addColorStop(0,css(e.colors[1]).replace('rgb','rgba').replace(')',',.35)'));halo.addColorStop(1,'rgba(255,255,255,0)');
   ctx.fillStyle=halo;ctx.fillRect(0,0,w,h);
   const g=ctx.createRadialGradient(cx-rad*.3,cy-rad*.35,rad*.1,cx,cy,rad);g.addColorStop(0,'#fff');g.addColorStop(.35,css(e.colors[1]));g.addColorStop(1,css(e.colors[0]));
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);ctx.fill();
  }
 }
 function frame(now){
  raf=requestAnimationFrame(frame);
  if(document.hidden||now-last<33)return;
  const dt=last?Math.min(.1,(now-last)/1000):1/30;last=now;
  if(motion&&!reduced())clock+=dt;
  active.forEach(e=>draw(e,motion&&!reduced()?dt:1));
 }
 function setPhase(next){phase=next;if(statusEl&&statusEl.isConnected)statusEl.textContent=LABELS[next];}
 // Attach pooled canvases to the .orb-zone placeholders of the current render.
 function mount(zones,{motion:on=true}={}){
  motion=on;statusEl=document.querySelector('.presence-status');setPhase(phase);
  active=[];
  zones.forEach((zone,i)=>{const e=pool[i]||(pool[i]=create());setVoice(e,zone.dataset.voice);setState(e,zone.dataset.state);zone.append(e.canvas);active.push(e);});
  pool.slice(zones.length).forEach(e=>e.canvas.remove());
  if(active.length&&!raf){last=0;raf=requestAnimationFrame(frame);}
  if(!active.length&&raf){cancelAnimationFrame(raf);raf=0;}
  active.forEach(e=>draw(e,1/30));
 }
 function rect(){const e=pool[0];return e&&e.canvas.isConnected?e.canvas.getBoundingClientRect():null;}
 // FLIP: start the main entity where it was in the previous scene and let it travel.
 function glide(from){
  const e=pool[0];if(!e||!e.canvas.isConnected||!motion||reduced())return;
  const to=e.canvas.getBoundingClientRect();if(!to.width)return;
  const c=e.canvas;c.style.transition='none';
  if(!from||!from.width){c.style.opacity='0';c.style.transform='scale(.86)';}
  else{const s=from.width/to.width;c.style.transformOrigin='0 0';c.style.transform=`translate(${from.left-to.left}px,${from.top-to.top}px) scale(${s},${from.height/to.height})`;}
  c.getBoundingClientRect();
  c.style.transition='transform 1.15s cubic-bezier(.22,1,.36,1), opacity .9s ease';c.style.transform='';c.style.opacity='';
 }
 // A conversational cue: think, then speak, then settle into the turn's state.
 function cue(state,{delay=0,think=0,speak=0}={}){
  const e=pool[0];if(!e)return;timers.forEach(clearTimeout);timers=[];
  const now=performance.now();
  if(!motion||reduced()){if(state)setState(e,state);setPhase('calm');return;}
  e.thinking=now+delay+think;e.talking=now+delay+think+speak;
  const at=(ms,fn)=>timers.push(setTimeout(fn,ms));
  if(think)at(delay,()=>setPhase('thinking'));
  at(delay+think,()=>{setPhase('speaking');if(state)setState(e,state);});
  at(delay+think+speak,()=>setPhase('calm'));
 }
 function listen(on){
  const e=pool[0];if(!e)return;e.target.listen=on?1:0;
  if(phase==='calm'||phase==='listening')setPhase(on?'listening':'calm');
 }
 function reset(){timers.forEach(clearTimeout);timers=[];phase='calm';pool.forEach(e=>{e.thinking=e.talking=0;});}
 document.addEventListener('pointermove',e=>{pointer=[e.clientX,e.clientY];});
 return {mount,rect,glide,cue,listen,reset,stop(){if(raf)cancelAnimationFrame(raf);raf=0;active=[];}};
})();

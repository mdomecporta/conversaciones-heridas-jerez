// Presence: a coral tissue island with pearlescent folds, inspired by the concept art.
// Canvases are pooled and re-attached after each render, so the same entity survives
// re-renders, morphs its colour between voices and glides from one scene to the next.
// Colours identify the voice; they never represent a clinical sign.
const Presence = (() => {
 const hex = h => [1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
 const VOICES = {
  principal:['#e88e82','#fff0df','#efc4ca'],
  persona:['#dc9a80','#fff0db','#f0c8b8'],
  isquemica:['#bf8fa6','#f9e9e4','#d5c5e7'],
  paliativa:['#d697ab','#fff0e3','#e5cce5']
 };
 // Each state sets the targets the body eases toward. Colours never encode clinical signs.
 const BASE={energy:.25,ring:0,remember:0,show:0,tense:0,relief:0};
 const STATES = Object.fromEntries(Object.entries({
  idle:{},listening:{energy:.3,ring:.3},exploring:{energy:.45,ring:1},remembering:{energy:.3,ring:.65,remember:1},
  responding:{energy:.6},comparing:{energy:.5,ring:.35},vascular:{energy:.35,ring:.2,tense:.25},
  showing:{energy:.45,show:1},discomfort:{energy:.4,tense:1},relief:{energy:.25,relief:1}
 }).map(([k,v])=>[k,{...BASE,...v}]));
 const LABELS = {calm:'En reposo',listening:'Escuchando',thinking:'Pensando…',speaking:'Hablando'};
 // Parametric closed surfaces, not a painted height map. Every membrane has
 // its own volume, normal, transparency and depth, and deforms in the vertex shader.
 const VERT = `precision highp float;
attribute vec2 a;
uniform vec2 uRes,uGaze;
uniform float uT,uSeed,uLayer,uListen,uThink,uSpeak,uBreath,uEnergy,uRing;
varying vec3 vPos,vNormal;varying float vLayer;
const float PI=3.14159265359;
vec3 surface(vec2 uv){
 float t=uT+uSeed*6.;float angle=uv.x*2.*PI;
 float twist=uThink*.16*sin(t*.8)+.045*sin(t*.3);
 float th=angle+twist;
 float l=uLayer;
 float irregular=1.+.045*sin(th*3.+.4)+.025*cos(th*5.-.3);
 float breath=1.+.018*uBreath;
 float talking=uSpeak*(.025*sin(th*4.-t*3.)+.017*cos(th*3.+t*4.));
 vec3 p;
 if(l<.5){
  float phi=uv.y*PI;float r=sin(phi);float c=cos(phi);
  float y=c>=0.?.025+.105*r*r+.008*sin(th*5.)*r*r:.13+.38*c;
  p=vec3(.70*r*cos(th)*irregular,y,.57*r*sin(th)*irregular);
 }else{
  float crossAngle=uv.y*2.*PI;
  float radius,thickness,height,wave;
  if(l<1.5){radius=.73;thickness=.255;height=-.10;wave=.035;}
  else if(l<2.5){radius=.83;thickness=.20;height=-.005;wave=.055;}
  else if(l<3.5){radius=.76;thickness=.23;height=.075;wave=.085;}
  else{radius=.64;thickness=.21;height=.14;wave=.095;}
  float fold=sin(th*3.+l*1.9+t*.15)+.24*cos(th*5.-l);
  float lift=wave*fold;
  float curl=sin(crossAngle);
  float rr=(radius+thickness*cos(crossAngle))*irregular;
  rr+=uListen*.045+talking;
  p=vec3(rr*cos(th),height+lift+thickness*.48*curl,rr*.78*sin(th));
  p.y+=uSpeak*.045*sin(th*4.-t*3.+l*.6);
  p.y+=uListen*.07*(.5+.5*sin(th));
 }
 p.xz*=breath;
 // Gentle yaw shows the thickness and separation between the membranes.
 float yaw=.18+uGaze.x*.13+.055*sin(t*.35);
 p.xz=mat2(cos(yaw),-sin(yaw),sin(yaw),cos(yaw))*p.xz;
 p.y+=.025*sin(t*.85);
 return p;
}
void main(){
 vec3 p=surface(a);
 float e=.0007;
 vec3 du=surface(a+vec2(e,0.))-surface(a-vec2(e,0.));
 vec3 dv=surface(a+vec2(0.,e))-surface(a-vec2(0.,e));
 vec3 normal=normalize(uLayer<.5?cross(du,dv):cross(dv,du));
 vPos=p;vNormal=normal;vLayer=uLayer;
 float elevation=.59+uGaze.y*.04;
 float c=cos(elevation),s=sin(elevation);
 vec3 view=vec3(p.x,p.y*c-p.z*s,p.y*s+p.z*c);
 float distance=4.4-view.z;
 float size=min(uRes.x*.62,uRes.y*1.23);
 vec2 screen=view.xy*4.7*vec2(size/uRes.x,size/uRes.y);
 gl_Position=vec4(screen,(distance-3.)/3.*distance,distance);
}`;
 const FRAG = `precision highp float;
uniform vec3 uA,uB,uC;
uniform float uT,uThink,uLayer;
varying vec3 vPos,vNormal;varying float vLayer;
void main(){
 vec3 n=normalize(vNormal);if(!gl_FrontFacing)n=-n;
 vec3 eye=normalize(vec3(0.,2.45,3.7)-vPos);
 vec3 key=normalize(vec3(-2.5,4.,3.));
 vec3 rim=normalize(vec3(2.6,1.8,-2.8));
 float ndv=max(dot(n,eye),0.);
 float fresnel=pow(1.-ndv,4.);
 float isCore=1.-step(.5,vLayer);
 float isBase=1.-step(1.5,vLayer);
 vec3 warm=mix(uB,uA,.12);
 vec3 material=mix(warm,uA,isBase*.70);
 material=mix(material,mix(uA,vec3(1.,.49,.36),.24),isCore);
 float diffuse=max(dot(n,key),0.);
 float back=max(dot(-n,key),0.);
 // Light through thin membranes gives warm transmission, not opaque grey shadows.
 vec3 col=material*(.76+.26*diffuse)+uA*back*.16;
 vec3 halfKey=normalize(key+eye);
 float broad=pow(max(dot(n,halfKey),0.),18.);
 float sharp=pow(max(dot(n,halfKey),0.),125.);
 float edge=pow(max(dot(n,normalize(rim+eye)),0.),38.);
 col+=vec3(1.,.93,.85)*(broad*.20+sharp*.72)+vec3(.87,.91,1.)*edge*.32;
 // Restrained opalescence changes with surface angle and the moving folds.
 vec3 pearl=.5+.5*cos(vec3(0.,2.1,4.2)+ndv*9.+vPos.y*2.);
 col=mix(col,mix(uB,pearl,.34),fresnel*.35*(1.-isCore));
 col+=uB*fresnel*.20;
 float sweep=pow(max(0.,sin(atan(vPos.z,vPos.x)-uT*2.)),14.)*uThink;
 col+=uC*sweep*.16;
 float alpha=mix(.64+.32*fresnel,.98,isBase);
 // The coral core stays visible through the thin pearlescent upper membranes.
 col=pow(max(col,vec3(0.)),vec3(.93));
 gl_FragColor=vec4(col*alpha,alpha);
}`;
 let autoListen=false,level=0;
 const mark=p=>{const root=document.documentElement;if(root)root.dataset.presence=p;};
 const pool=[]; let active=[], raf=0, last=0, clock=0, pointer=null, motion=true, statusEl=null, phase='calm', timers=[];
 const reduced = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
 const lerp = (a,b,k) => a+(b-a)*k;


 // Art mode: when the concept illustration is provided (assets/entity-concept.*), the entity IS
 // that painting, brought to life by a warp shader: it breathes, its membranes lift when listening,
 // fold when thinking and ripple from the bed when speaking. The cream background is keyed out.
 const ART_VERT='attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
 const ART_FRAG=`precision mediump float;
uniform sampler2D uImg;uniform vec3 uBg,uTint;uniform vec2 uCore,uGaze,uFit,uLight;
uniform float uT,uBreath,uListen,uThink,uSpeak,uAspect,uTintK,uKey,uRemember,uShow,uTense,uRelief,uLevel,uLean;varying vec2 v;
vec4 img(vec2 p){vec4 c=texture2D(uImg,clamp(p,0.,1.));float a=mix(c.a,smoothstep(.035,.11,distance(c.rgb,uBg)),uKey);return vec4(c.rgb,a*step(0.,p.x)*step(p.x,1.)*step(0.,p.y)*step(p.y,1.));}
void main(){
 vec2 p=(v-.5)*uFit+.5;p.y=1.-p.y;
 // Whole body: breathing, growth while speaking, opening while listening, contraction or release.
 float scale=1.+.026*uBreath*(1.-.45*uRelief)+.065*uSpeak+.045*uListen+.05*uLevel-.06*uTense+.035*uRelief;
 p=uCore+(p-uCore)/scale;
 // Lean: toward the speaker (left) when listening, toward the resource (right, down) when showing.
 float top=clamp(uCore.y-p.y+.3,0.,1.);
 p.x+=(.03*uListen*uLean-.035*uShow)*top;p.y-=.02*uShow*top;
 p.x+=uTense*.004*sin(uT*31.);
 vec2 d=p-uCore;d.x*=uAspect;float r=length(d);
 float edge=smoothstep(.12,.55,r),core=1.-smoothstep(0.,.7,r);
 // Membranes drift; slower and wider when relieved.
 float drift=1.+uListen*.8+uRelief*.6;
 p+=vec2(.008*sin(p.y*9.+uT*.9*(1.-.4*uRelief)),.009*sin(p.x*7.-uT*.7))*edge*drift;
 // Listening lifts the upper membranes.
 p.y+=uListen*.05*edge*smoothstep(uCore.y+.15,uCore.y-.35,p.y)*(.85+.15*sin(uT*1.6));
 // Thinking twists the folds back and forth around the bed.
 float ang=uThink*.26*core*sin(uT*1.2);
 vec2 q=p-uCore;q.x*=uAspect;q=mat2(cos(ang),-sin(ang),sin(ang),cos(ang))*q;q.x/=uAspect;p=uCore+q;
 // Speaking flares the rim and sends ripples out of the bed.
 p.x=uCore.x+(p.x-uCore.x)/(1.+.05*uSpeak*edge);
 p+=normalize(d+1e-4)*uSpeak*.02*sin(r*30.-uT*9.)*(1.-smoothstep(.05,.7,r));
 p+=uGaze*.006*vec2(1.,-1.);
 // The bed is its own layer: it drifts against the membranes and flows from within, always.
 vec4 c0=img(p);
 float bed=smoothstep(.16,.36,c0.r-c0.g)*(1.-smoothstep(.16,.42,r));
 float speed=1.+uThink*1.2+uSpeak*1.5-uRelief*.4;
 vec2 flow=vec2(sin(p.y*14.+uT*1.3*speed)+sin((p.x+p.y)*9.-uT*.9*speed),cos(p.x*12.-uT*1.1*speed)+sin((p.x-p.y)*10.+uT*.7*speed))*.0055;
 vec2 pb=p+flow*bed-uGaze*.012*bed+vec2(.012*uListen*uLean,-.006*uShow)*bed;
 vec4 c=mix(c0,img(pb),bed);
 float a=c.a;
 float lum=dot(c.rgb,vec3(.3,.59,.11));
 vec3 col=mix(c.rgb,clamp(lum*uTint/max(dot(uTint,vec3(.3,.59,.11)),.01),0.,1.),uTintK);
 // Remembering: quieter and slightly faded, as if looking back.
 col=mix(col,vec3(lum)*1.02,.32*uRemember);col*=1.-.06*uRemember;
 // A moving light: where it sits tells what the wound attends to.
 vec2 l=(p-uLight)*vec2(uAspect,1.);
 float spot=exp(-dot(l,l)*(14.-6.*uRelief));
 col+=vec3(1.,.95,.93)*spot*(.16+.1*uListen+.08*uSpeak)*(1.-.5*bed);
 float sweep=pow(max(0.,sin((p.x+p.y)*3.-uT*.8)),24.);
 col+=vec3(1.,.95,.97)*sweep*.08*(.5+uThink);
 // Inner glow of the bed pulses while speaking.
 col+=vec3(.12,.03,.02)*bed*uSpeak*(.5+.5*sin(uT*8.));
 gl_FragColor=vec4(col*a,a);
}`;
 let artImage=null;
 function loadArt(){const A=globalThis.ENTITY_ART;if(!A||artImage)return artImage;const img=new Image();artImage={img,ready:false,crop:A.crop||[0,0,1,1],core:A.core||[.5,.45]};
  img.onload=()=>{const [x0,y0,x1,y1]=artImage.crop,c=document.createElement('canvas');c.width=Math.round(img.width*(x1-x0));c.height=Math.round(img.height*(y1-y0));const k=c.getContext('2d');k.drawImage(img,-img.width*x0,-img.height*y0);
   const px=k.getImageData(2,2,1,1).data;artImage.bg=[px[0]/255,px[1]/255,px[2]/255];artImage.key=px[3]===255?1:0;artImage.canvas=c;artImage.ready=true;pool.forEach(e=>e.art&&(e.art.dirty=true));};
  img.src=A.src;return artImage;}
 function createArt(e){const art=loadArt();if(!art)return false;const gl=e.canvas.getContext('webgl',{premultipliedAlpha:true,alpha:true});if(!gl)return false;
  const sh=(t,src)=>{const s=gl.createShader(t);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null;};
  const vs=sh(gl.VERTEX_SHADER,ART_VERT),fs=sh(gl.FRAGMENT_SHADER,ART_FRAG);if(!vs||!fs)return false;
  const prog=gl.createProgram();gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))return false;gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(prog,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  e.art={gl,tex:gl.createTexture(),dirty:true,u:Object.fromEntries(['uImg','uBg','uTint','uCore','uGaze','uT','uBreath','uListen','uThink','uSpeak','uAspect','uTintK','uFit','uKey','uRemember','uShow','uTense','uRelief','uLevel','uLight','uLean'].map(n=>[n,gl.getUniformLocation(prog,n)]))};
  e.canvas.dataset.renderer='art';return true;}
 function drawArt(e,breath){const {gl,u}=e.art,art=artImage;gl.viewport(0,0,e.canvas.width,e.canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);if(!art?.ready)return;
  if(e.art.dirty){gl.bindTexture(gl.TEXTURE_2D,e.art.tex);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,art.canvas);[gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(f=>gl.texParameteri(gl.TEXTURE_2D,f,gl.LINEAR));[gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(w=>gl.texParameteri(gl.TEXTURE_2D,w,gl.CLAMP_TO_EDGE));e.art.dirty=false;}
  const tint={principal:0,persona:.3,isquemica:.62,paliativa:.5}[e.voice]||0;
  gl.uniform1i(u.uImg,0);gl.uniform1f(u.uKey,art.key);gl.uniform3fv(u.uBg,art.bg);gl.uniform3fv(u.uTint,e.colors[0]);gl.uniform1f(u.uTintK,tint);gl.uniform2fv(u.uCore,art.core);gl.uniform2f(u.uGaze,e.gaze[0],e.gaze[1]);
  gl.uniform1f(u.uT,clock);gl.uniform1f(u.uBreath,breath);gl.uniform1f(u.uListen,e.cur.listen);gl.uniform1f(u.uThink,e.cur.think);gl.uniform1f(u.uSpeak,e.cur.speak);const ia=art.canvas.width/art.canvas.height,ca=e.canvas.width/e.canvas.height;gl.uniform1f(u.uAspect,ia);gl.uniform2f(u.uFit,ca>ia?ca/ia:1,ca>ia?1:ia/ca);
  gl.uniform1f(u.uRemember,e.cur.remember);gl.uniform1f(u.uShow,e.cur.show);gl.uniform1f(u.uTense,e.cur.tense);gl.uniform1f(u.uRelief,e.cur.relief);gl.uniform1f(u.uLevel,e.cur.listen*level);gl.uniform1f(u.uLean,e.lean??1);
  // Light target per attention: speaker (left), resource (right), orbiting while thinking, centre while speaking.
  const [cx,cy]=art.core,t=clock,L=e.light||(e.light=[cx,cy-.2]);
  const target=e.cur.think>.4?[cx+.22*Math.cos(t*1.3),cy-.05+.14*Math.sin(t*1.3)]:e.cur.speak>.2?[cx,cy]:e.cur.show>.4?[.82,.62]:e.cur.listen>.4?[(e.lean??1)>0?.18:.82,.22]:e.cur.remember>.4?[.5,.12]:[cx+.2*Math.sin(t*.23),cy-.18+.06*Math.cos(t*.31)];
  L[0]+=(target[0]-L[0])*.06;L[1]+=(target[1]-L[1])*.06;gl.uniform2f(u.uLight,L[0],L[1]);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}

 // Membrane mode (prototype): a generated wound, not a picture. A living asymmetric body whose outline
 // is shaped by noise, a liquid coral bed that always flows, pearly membranes that drift at their own
 // pace, a white-gold rim light and a guest that buds from the same mass (smooth union of two bodies).
 // Palette from the concept sheet. Colours express the conversation, never clinical signs.
 const MEM_FRAG=`precision highp float;
varying vec2 v;
uniform vec2 uRes,uLight;uniform vec3 uTint,uTintG;
uniform float uT,uBreath,uListen,uThink,uSpeak,uRemember,uShow,uTense,uRelief,uLevel,uLean,uBud,uFocus,uSeed,uTintK,uTintGK;
float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float ns(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*ns(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float grow(){return 1.+.022*uBreath*(1.-.4*uRelief)+.07*uSpeak+.05*uListen+.06*uLevel-.07*uTense+.05*uRelief;}
// Signed distance of one body: an egg-shaped lens, wider on the left, outline moved by noise.
float body(vec2 p,float t,float ph){
 float an=-.1+.04*sin(t*.3+ph);p=mat2(cos(an),-sin(an),sin(an),cos(an))*p;
 vec2 r=vec2(1.08,.56)*grow();
 p.x*=1.+.1*p.y;p.y*=1.-.13*p.x;
 float a=atan(p.y,p.x);
 float w=.16*(fbm(vec2(cos(a),sin(a))*1.4+vec2(t*.12+ph,ph))-.5)+.05*sin(a*2.+t*.35+ph*1.7)+.035*sin(a*3.+t*.6+ph)+uSpeak*.028*sin(a*6.-t*7.)+uTense*.012*sin(a*15.+t*30.);
 return (length(p/r)-1.-w)*min(r.x,r.y);
}
vec3 tone(vec3 c,float g){vec3 tn=mix(uTint,uTintG,g);float l=dot(c,vec3(.3,.59,.11));c=mix(c,clamp(l*tn/max(dot(tn,vec3(.3,.59,.11)),.01),0.,1.),mix(uTintK,uTintGK,g));return mix(c,vec3(l*1.02),.34*uRemember)*(1.-.07*uRemember);}
// Four stacked membranes: each a smaller, higher copy of the body with its own noise, so their
// edges drape over one another. Listening lifts the upper ones; the guest buds in every layer.
// Once apart, whoever speaks grows a little (uFocus: -1 lead, 1 guest, 0 both).
float leadK(){return 1.+uBud*(.05*max(-uFocus,0.)-.1*max(uFocus,0.));}
float guestK(){return (.55+.2*uBud)*(1.+uBud*(.24*max(uFocus,0.)-.08*max(-uFocus,0.)));}
float shell(vec2 p,float k,float t){
 float s=1.-.085*k;vec2 o=vec2(.08*k*sin(k*2.1+uSeed*4.)+.04*sin(t*.2+k*1.3),.06*k+.035*k*uListen+.02*k*uRelief-.015*k*uTense);
 vec2 q=(p-o)/s;
 float lk=leadK();float lead=body((q+vec2(.5*uBud,0.))/lk,t+k*1.3,uSeed*6.+k*1.7)*lk*s;
 if(uBud<.002)return lead;
 float kk=guestK();vec2 g=(q-vec2(1.75*uBud-.05,.03-.05*uBud))/kk;
 return smin(lead,body(g,t+3.+k*1.3,uSeed*6.+2.+k*1.7)*kk*s,.5*(1.-uBud)+.02);
}
void main(){
 float asp=uRes.x/uRes.y,sc=1.95*max(1.,1.95/asp)*(1.+.42*uBud);
 vec2 p=(v-.5)*vec2(asp,1.)*sc;
 p.x+=.6*uBud;
 float t=uT;
 p.y-=.035*sin(t*.85);
 p.x+=(-.16*uListen*uLean+.14*uShow)*(p.y+.7)*.45;
 p.x+=uTense*.006*sin(t*33.);
 float px=sc/uRes.y,e=.01;
 vec3 L=normalize(vec3((uLight-.5)*vec2(2.4,-2.),.85));
 float d0=shell(p,0.,t);
 float sh=exp(-pow((p.x+.05)/1.15,2.)*2.2-pow((p.y+.82+.03*sin(t*.85))/.08,2.))*.22*(1.-.4*uBud);
 vec4 acc=vec4(vec3(.42,.27,.24)*sh,sh);
 for(int i=0;i<4;i++){
  float k=float(i);
  // Shadow this membrane casts on what lies below it.
  float dsh=shell(p+vec2(.015,.07),k,t);
  float shade=smoothstep(.02,-.1,dsh);
  float d=shell(p,k,t);
  float a=smoothstep(px*1.5,-px*1.5,d);
  acc.rgb*=1.-.28*shade*(1.-a)*step(.5,k+.5)*(k>0.?1.:0.);
  if(a<.001)continue;
  float dx=shell(p+vec2(e,0.),k,t)-d,dy=shell(p+vec2(0.,e),k,t)-d;
  float h=clamp(-d/.28,0.,1.);
  vec3 n=normalize(vec3(vec2(dx,dy)/e*(1.-h)*1.5,.55+h*.9));
  float dif=dot(n,L)*.5+.5,spec=pow(max(dot(reflect(-L,n),vec3(0,0,1)),0.),44.)*1.3+pow(max(dot(reflect(-L,n),vec3(0,0,1)),0.),8.)*.12;
  vec3 base=mix(vec3(.78,.43,.46),vec3(.97,.84,.8),.12+.24*k+.22*h);
  vec3 col=base*(.66+.42*dif);
  col+=vec3(1.,.96,.94)*spec*(.28+.08*k+.2*uListen);
  float lip=exp(-pow(d/.035,2.))*(.55+.45*clamp(n.y+.4,0.,1.))*(i==3?.45:1.);
  vec3 film=vec3(.97,.86,.86)+vec3(.03,.1,.12)*cos(6.2832*(vec3(0.,.2,.38)+n.x*1.4+n.y*.8+k*.17+t*.04));
  col+=mix(vec3(1.,.96,.94),film,.4)*lip*.3;
  col=mix(col,film,.12);
  float ta=a*(i==0?1.:.74+.05*k);
  acc=vec4(col*ta,ta)+acc*(1.-ta);
 }
 // The liquid bed inside the top membrane: a graded basin that flows, swirls and ripples.
 vec2 pm=p+vec2(.5*uBud,0.)-vec2(.24*sin(6.3+uSeed*4.)+.12*sin(t*.2+3.9),.18+.105*uListen);
 vec2 c=vec2(.08+.05*sin(t*.21),.06+.02*cos(t*.27));
 vec2 rb=vec2(.5,.21)*(1.+.16*uListen+.1*uSpeak-.1*uTense+.06*uRelief+.08*uLevel)*grow();
 vec2 bq=(pm-c)/rb;float ba=atan(bq.y,bq.x),br=length(bq);
 float bedD=br-1.-.1*(fbm(vec2(cos(ba),sin(ba))*1.6+t*.1)-.5);
 float bed=smoothstep(.16,-.38,bedD)*smoothstep(px,-px,shell(p,3.,t));
 float sw=uThink*1.6*sin(t*1.1)*(1.-br*.5)+t*.05;
 vec2 q=mat2(cos(sw),-sin(sw),sin(sw),cos(sw))*bq*1.4;
 float sp2=1.+uThink+uSpeak*1.6-uRelief*.4;
 vec2 w=vec2(fbm(q*1.3+t*.16*sp2),fbm(q*1.3+vec2(5.2,1.3)-t*.13*sp2));
 float f=fbm(q*1.6+1.8*w+t*.07*sp2);
 vec3 bedCol=mix(vec3(.91,.33,.28),vec3(.97,.62,.54),smoothstep(.0,1.,br)*.75+(f-.5)*.5);
 bedCol+=vec3(.06,.02,.02)*(fbm(q*7.+w*2.)-.5);
 bedCol+=vec3(.1,.035,.03)*uSpeak*sin(br*10.-t*8.)*(1.-br);
 bedCol*=1.-.18*smoothstep(.45,1.,br)*smoothstep(-.2,.7,bq.y);
 bedCol+=vec3(.1,.06,.05)*smoothstep(.5,1.,br)*smoothstep(.1,-.7,bq.y);
 acc.rgb=mix(acc.rgb,bedCol*acc.a,bed*.96);
 float bedLip=exp(-pow(bedD/.09,2.))*smoothstep(px,-px,shell(p,3.,t));
 acc.rgb+=vec3(1.,.95,.93)*bedLip*.1*clamp(.4-bq.y,0.,1.)*acc.a;
 // White-gold light along the outline, alternating slowly as in the liquid planet.
 vec3 rimc=mix(vec3(1.,.98,.96),vec3(1.,.83,.58),.5+.5*sin(t*.7+p.x*1.5));
 float outer=exp(-pow(d0/.05,2.))*smoothstep(px,-px*3.,d0);
 acc.rgb+=rimc*outer*.24;
 // Each figure keeps its own voice tint once the guest has budded.
 float gk=guestK(),gw=uBud<.002?0.:smoothstep(.12,-.12,body((p-vec2(1.75*uBud-.05,.03-.05*uBud))/gk,t+3.,uSeed*6.+2.)*gk-body((p+vec2(.5*uBud,0.))/leadK(),t,uSeed*6.)*leadK());
 acc.rgb=tone(acc.rgb/max(acc.a,1e-3),gw)*acc.a;
 gl_FragColor=acc;
}`;
 function createMembrane(e){const gl=e.canvas.getContext('webgl',{premultipliedAlpha:true,alpha:true,antialias:true});if(!gl)return false;
  const sh=(t,src)=>{const s=gl.createShader(t);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(s));return null;}return s;};
  const vs=sh(gl.VERTEX_SHADER,ART_VERT),fs=sh(gl.FRAGMENT_SHADER,MEM_FRAG);if(!vs||!fs)return false;
  const prog=gl.createProgram();gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))return false;gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(prog,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  e.mem={gl,u:Object.fromEntries(['uRes','uLight','uTint','uT','uBreath','uListen','uThink','uSpeak','uRemember','uShow','uTense','uRelief','uLevel','uLean','uBud','uFocus','uSeed','uTintK','uTintG','uTintGK'].map(n=>[n,gl.getUniformLocation(prog,n)]))};
  e.canvas.dataset.renderer='membrane';return true;}
 function drawMembrane(e,breath){const {gl,u}=e.mem;gl.viewport(0,0,e.canvas.width,e.canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  const t=clock,c=e.cur,lean=e.lean??1;
  const target=c.think>.4?[.5+.25*Math.cos(t*1.3),.35+.15*Math.sin(t*1.3)]:c.speak>.2?[.5,.42]:c.show>.4?[.8,.6]:c.listen>.4?[lean>0?.2:.8,.25]:c.remember>.4?[.5,.15]:[.38+.12*Math.sin(t*.23),.28+.05*Math.cos(t*.31)];
  const L=e.light||(e.light=target.slice());L[0]+=(target[0]-L[0])*.06;L[1]+=(target[1]-L[1])*.06;
  const bud=e.force==='bud'?.5-.5*Math.cos(t*.7):/^bud:/.test(e.force||'')?Number(e.force.slice(4)):c.bud;
  const tints={principal:0,persona:.3,isquemica:.62,paliativa:.5},guest=VOICES[e.guest]?e.guest:e.voice;
  gl.uniform2f(u.uRes,e.canvas.width,e.canvas.height);gl.uniform2f(u.uLight,L[0],L[1]);gl.uniform3fv(u.uTint,e.colors[0]);gl.uniform1f(u.uTintK,tints[e.voice]||0);
  gl.uniform3fv(u.uTintG,e.guestColor||(e.guestColor=hex(VOICES[guest][0])));gl.uniform1f(u.uTintGK,tints[guest]||0);
  [['uT',t],['uBreath',breath],['uListen',c.listen],['uThink',c.think],['uSpeak',c.speak],['uRemember',c.remember],['uShow',c.show],['uTense',c.tense],['uRelief',c.relief],['uLevel',c.listen*level],['uLean',lean],['uBud',bud],['uFocus',c.focus],['uSeed',e.seed]].forEach(([k,x])=>gl.uniform1f(u[k],x));
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}
 // The code-generated membrane is the wound's voice; ENTITY_RENDERER='art' brings back the illustration.
 const renderer=()=>globalThis.ENTITY_RENDERER==='liquid'?'liquid':globalThis.ENTITY_RENDERER==='art'?'art':'membrane';
 function create(kind){
  const canvas=document.createElement('canvas');canvas.className='orb-canvas';canvas.setAttribute('aria-hidden','true');
  const e={canvas,voice:null,state:'idle',seed:Math.random(),cur:{...BASE,listen:0,think:0,speak:0,bud:0,focus:0},target:{...BASE,listen:0,think:0,speak:0,bud:0,focus:0},colors:null,targetColors:null,gaze:[0,0],hoverListen:false,talking:0,thinking:0};
  e.kind=kind||renderer();
  if(e.kind==='liquid'&&typeof LiquidEntity!=='undefined'&&LiquidEntity.create(e))return e;
  if(e.kind==='membrane'&&createMembrane(e))return e;
  if(createArt(e))return e;
  const gl=canvas.getContext('webgl',{premultipliedAlpha:true,antialias:true,alpha:true});
  if(gl){
   const sh=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null;};
   const vs=sh(gl.VERTEX_SHADER,VERT),fs=sh(gl.FRAGMENT_SHADER,FRAG);
   if(vs&&fs){
    const prog=gl.createProgram();gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.linkProgram(prog);
    if(gl.getProgramParameter(prog,gl.LINK_STATUS)){
     gl.useProgram(prog);
     // Shared indexed grid: five independently shaded, closed 3D volumes.
     const vertices=[],indices=[],around=144,across=40;
     for(let i=0;i<=around;i++)for(let j=0;j<=across;j++)vertices.push(i/around,j/across);
     for(let i=0;i<around;i++)for(let j=0;j<across;j++){
      const k=i*(across+1)+j;
      indices.push(k,k+across+1,k+1,k+1,k+across+1,k+across+2);
     }
     gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
     gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer());
     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
     const loc=gl.getAttribLocation(prog,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
     gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
     e.gl=gl;e.indexCount=indices.length;canvas.dataset.renderer='webgl-3d';
     e.u=Object.fromEntries(['uRes','uT','uEnergy','uRing','uListen','uThink','uSpeak','uBreath','uSeed','uA','uB','uC','uGaze','uLayer'].map(n=>[n,gl.getUniformLocation(prog,n)]));
    }
   }
  }
  if(!e.gl){const fallback=document.createElement('canvas');fallback.className='orb-canvas';fallback.setAttribute('aria-hidden','true');e.canvas=fallback;e.canvas.dataset.renderer='canvas-2d';e.ctx=fallback.getContext('2d');}
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
  e.target.listen=e.hoverListen||autoListen||e.state==='listening'?1:0;
  const k=Math.min(1,dt*3.2);
  for(const key in e.cur)e.cur[key]=lerp(e.cur[key],e.target[key],key==='bud'?k*.35:k);
  e.colors.forEach((c,i)=>c.forEach((x,j)=>c[j]=lerp(x,e.targetColors[i][j],Math.min(1,dt*1.6))));
  const now=performance.now();
  const animated=motion&&!reduced();
  e.target.think=animated&&now<e.thinking?1:0;
  if(e.force==='think')e.target.think=animated?1:0;
  e.target.speak=(animated&&now<e.talking&&now>=e.thinking)||(animated&&e.force==='speak')?.35+.45*Math.abs(Math.sin(clock*8.3))*(.6+.4*Math.sin(clock*2.1)):0;
  let gx=0,gy=0;
  if(pointer&&animated&&!e.interaction){gx=(pointer[0]-(r.left+r.width/2))/r.width;gy=-(pointer[1]-(r.top+r.height/2))/r.height;const len=Math.hypot(gx,gy);if(len>1){gx/=len;gy/=len;}}
  if(animated||!e.liquid){e.gaze[0]=lerp(e.gaze[0],gx,Math.min(1,dt*1.5));e.gaze[1]=lerp(e.gaze[1],gy,Math.min(1,dt*1.5));}
  const breath=Math.sin(clock*Math.PI*2/5.5);
  if(e.liquid){LiquidEntity.draw(e,clock,breath,level,dt,animated);return;}
  if(e.mem){drawMembrane(e,breath);return;}
  if(e.art){drawArt(e,breath);return;}
  if(e.gl){
   const {gl,u}=e;gl.viewport(0,0,e.canvas.width,e.canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   gl.uniform2f(u.uRes,e.canvas.width,e.canvas.height);gl.uniform1f(u.uT,clock);gl.uniform1f(u.uSeed,e.seed);gl.uniform1f(u.uBreath,breath);
   gl.uniform1f(u.uEnergy,e.cur.energy);gl.uniform1f(u.uRing,e.cur.ring);gl.uniform1f(u.uListen,e.cur.listen);gl.uniform1f(u.uThink,e.cur.think);gl.uniform1f(u.uSpeak,e.cur.speak);
   gl.uniform3fv(u.uA,e.colors[0]);gl.uniform3fv(u.uB,e.colors[1]);gl.uniform3fv(u.uC,e.colors[2]);gl.uniform2f(u.uGaze,e.gaze[0],e.gaze[1]);
   // Opaque core first, then back and front faces of the translucent shells.
   gl.frontFace(gl.CCW);gl.uniform1f(u.uLayer,0);gl.depthMask(true);gl.disable(gl.CULL_FACE);
   gl.drawElements(gl.TRIANGLES,e.indexCount,gl.UNSIGNED_SHORT,0);
   gl.enable(gl.CULL_FACE);gl.frontFace(gl.CW);
   for(let layer=1;layer<=4;layer++){
    gl.uniform1f(u.uLayer,layer);
    gl.depthMask(false);gl.cullFace(gl.FRONT);gl.drawElements(gl.TRIANGLES,e.indexCount,gl.UNSIGNED_SHORT,0);
    gl.depthMask(true);gl.cullFace(gl.BACK);gl.drawElements(gl.TRIANGLES,e.indexCount,gl.UNSIGNED_SHORT,0);
   }
   gl.disable(gl.CULL_FACE);
  }else if(e.ctx){
   // Canvas fallback keeps the basin, pearl layers and the same state cues.
   const {ctx}=e,w=e.canvas.width,h=e.canvas.height,s=Math.min(w*.7,h*1.55);
   const css=c=>`rgb(${c.map(x=>Math.round(x*255)).join(',')})`;
   ctx.clearRect(0,0,w,h);
   ctx.save();ctx.translate(w/2+e.gaze[0]*s*.012,h/2-e.gaze[1]*s*.012-Math.sin(clock*.85)*s*.017);
   ctx.scale(1.18,.69);
   const rad=s*.335*(1+.022*breath+.035*e.cur.listen);
   const contour=(radius,layer)=>{
    ctx.beginPath();
    for(let i=0;i<=128;i++){
     const a=i/128*Math.PI*2+e.cur.think*Math.sin(clock*.5)*.3;
     const r=radius*(1+.04*Math.sin(a*3+clock*.2+layer*.8)+(.02+.03*e.cur.speak)*Math.cos(a*5-clock*.4));
     const x=Math.cos(a)*r,y=Math.sin(a)*r;
     if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);
    }ctx.closePath();
   };
   ctx.shadowColor='rgba(110,65,55,.16)';ctx.shadowBlur=s*.035;ctx.shadowOffsetY=s*.025;
   for(let layer=0;layer<5;layer++){
    contour(rad*(1-layer*.145),layer);
    const g=ctx.createLinearGradient(-rad,-rad,rad,rad);
    g.addColorStop(0,css(e.colors[1]));g.addColorStop(.35,css(e.colors[2]));g.addColorStop(.62,css(e.colors[1]));g.addColorStop(1,css(e.colors[0]));
    ctx.fillStyle=g;ctx.fill();ctx.shadowBlur=s*.012;ctx.shadowOffsetY=s*.006;
   }
   contour(rad*(.39+.045*e.cur.listen),5);
   const basin=ctx.createRadialGradient(0,rad*.07,0,0,0,rad*.46);
   basin.addColorStop(0,css(e.colors[0]));basin.addColorStop(.7,'#efaa98');basin.addColorStop(1,css(e.colors[1]));
   ctx.fillStyle=basin;ctx.fill();ctx.restore();
  }
 }
 function frame(now){
  raf=requestAnimationFrame(frame);
  if(document.hidden||now-last<33)return;
  const dt=last?Math.min(.1,(now-last)/1000):1/30;last=now;
  if(motion&&!reduced())clock+=dt;
  active.forEach(e=>draw(e,motion&&!reduced()?dt:1));
 }
 function setPhase(next){phase=next;mark(next);if(statusEl&&statusEl.isConnected)statusEl.textContent=LABELS[next];active.forEach(e=>{e.canvas.dataset.phase=next;});}
 // Attach pooled canvases to the .orb-zone placeholders of the current render.
 function mount(zones,{motion:on=true}={}){
  motion=on;statusEl=document.querySelector('.presence-status');setPhase(phase);
  active=[];
  zones.forEach((zone,i)=>{const want=zone.dataset.renderer||renderer();if(pool[i]&&pool[i].kind!==want){pool[i].canvas.remove();pool[i]=null;}const e=pool[i]||(pool[i]=create(want));setVoice(e,zone.dataset.voice);setState(e,zone.dataset.state);e.force=zone.dataset.force||null;e.variant=Number(zone.dataset.variant??globalThis.ENTITY_VARIANT??0);e.palette=Number(zone.dataset.palette??globalThis.ENTITY_PALETTE??0);e.ink=Number(zone.dataset.ink??globalThis.ENTITY_INK??0);e.chromatic=Number(zone.dataset.chromatic??globalThis.ENTITY_CHROMATIC??.85);e.attention=zone.dataset.attention||'auto';e.eyes=(zone.dataset.eyes??String(globalThis.ENTITY_EYES||false))==='true';e.lean=Number(zone.dataset.lean||1);
   // The guest buds from the same body: data-bud eases between one and two figures, except on a new scene.
   e.target.bud=Number(zone.dataset.bud||0);e.target.focus=Number(zone.dataset.focus||0);if(e.guest!==zone.dataset.guest){e.guest=zone.dataset.guest;e.guestColor=null;}
   if(e.scene!==zone.dataset.scene||!motion||reduced()){e.scene=zone.dataset.scene;e.cur.bud=e.target.bud;e.cur.focus=e.target.focus;}e.canvas.dataset.phase=phase;zone.append(e.canvas);active.push(e);});
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
 // who: index of the speaking figure, 'all' (both speak together) or -1 (someone else speaks: the person).
 function cue(state,{delay=0,think=0,speak=0,who=0}={}){
  const speakers=who==='all'?active.slice():who<0?[]:[active[who]||pool[0]].filter(Boolean);timers.forEach(clearTimeout);timers=[];
  const now=performance.now();
  if(!motion||reduced()){if(state)speakers.forEach(e=>setState(e,state));setPhase('calm');return;}
  speakers.forEach(e=>{e.thinking=now+delay+think;e.talking=now+delay+think+speak;});
  const at=(ms,fn)=>timers.push(setTimeout(fn,ms));
  if(think)at(delay,()=>setPhase('thinking'));
  at(delay+think,()=>{setPhase('speaking');if(state)speakers.forEach(e=>setState(e,state));});
  at(delay+think+speak,()=>setPhase('calm'));
  // After speaking, the wound keeps listening while the room talks, until the next step.
  at(delay+think+speak+2200,()=>{autoListen=true;setPhase('listening');});
 }
 // Room voice level (0–1), measured locally from the microphone when enabled. Nothing is recorded.
 function setLevel(x){level=Math.max(0,Math.min(1,x));if(level>.18&&phase==='calm'){autoListen=true;setPhase('listening');}}
 function listen(on){
  const e=pool[0];if(!e)return;e.hoverListen=on;
  if(phase==='calm'||phase==='listening')setPhase(on?'listening':'calm');
 }
 function reset(){timers.forEach(clearTimeout);timers=[];phase='calm';autoListen=false;mark('calm');pool.forEach(e=>{e.thinking=e.talking=0;e.hoverListen=false;e.target.listen=e.target.think=e.target.speak=0;});}
 document.addEventListener('pointermove',e=>{pointer=[e.clientX,e.clientY];});
 function interact(zone,point=null,tap=false){
  if(!motion||reduced())return;
  const e=active.find(e=>e.canvas.parentElement===zone);if(!e||!e.liquid)return;
  const input=e.interaction??={point:[0,0],proximity:0,tapId:0,tapPoint:[0,0]};
  if(!point){input.proximity=0;return;}
  const x=Number(point[0]),y=Number(point[1]);if(!Number.isFinite(x)||!Number.isFinite(y))return;
  const distance=Math.hypot(x,y),limit=Math.max(1,distance/1.3);
  input.point=[x/limit,y/limit];input.proximity=Math.max(0,Math.min(1,(1.45-distance)/.65));
  if(tap&&distance<1.05){input.tapPoint=input.point.slice();input.tapId++;}
 }
 function body(zone,geometry){const e=active.find(e=>e.canvas.parentElement===zone);if(e?.liquid)e.bodyGeometry=geometry;}
 return {mount,rect,glide,cue,listen,reset,interact,body,level:setLevel,stop(){if(raf)cancelAnimationFrame(raf);raf=0;active=[];}};
})();

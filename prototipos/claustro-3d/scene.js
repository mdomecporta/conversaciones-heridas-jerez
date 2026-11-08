import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Independent study. No changes to the presentation or its liquid entity.
const renderer = new THREE.WebGLRenderer({antialias:true});
const pixelRatio=Math.min(devicePixelRatio,1.6);
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(pixelRatio);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
document.body.prepend(renderer.domElement);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.05,130);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,2,0);controls.maxDistance=38;controls.minDistance=.3;controls.maxPolarAngle=Math.PI*.49;controls.enableDamping=true;controls.enabled=false;
let seed=128;function rand(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}

// Sky and light: low, warm afternoon sun raking across the ostionera stone, as in the photographs.
function canvasTex(size,draw,srgb=true){const c=document.createElement('canvas');c.width=c.height=size;draw(c.getContext('2d'),size);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=renderer.capabilities.getMaxAnisotropy();if(srgb)t.colorSpace=THREE.SRGBColorSpace;return t;}
const sky=canvasTex(256,(x,s)=>{const g=x.createLinearGradient(0,0,0,s);g.addColorStop(0,'#7fa3c4');g.addColorStop(.55,'#bccfdb');g.addColorStop(1,'#eadfca');x.fillStyle=g;x.fillRect(0,0,s,s);});
sky.wrapS=sky.wrapT=THREE.ClampToEdgeWrapping;
// Reflections come from the courtyard's own sky over warm stone, so water and marble mirror the place.
const envTex=canvasTex(256,(x,s)=>{const g=x.createLinearGradient(0,0,0,s);g.addColorStop(0,'#6f96bb');g.addColorStop(.42,'#c3d4df');g.addColorStop(.5,'#e6d6b6');g.addColorStop(.56,'#bfa77f');g.addColorStop(1,'#6e6250');x.fillStyle=g;x.fillRect(0,0,s,s);});
const envScene=new THREE.Scene();envScene.add(new THREE.Mesh(new THREE.SphereGeometry(10,48,24),new THREE.MeshBasicMaterial({map:envTex,side:THREE.BackSide})));
const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(envScene,0).texture;scene.environmentIntensity=.5;
scene.fog=new THREE.Fog('#ded5c3',40,95);
scene.add(new THREE.HemisphereLight('#c9dcef','#8a7350',1.15));
const sun=new THREE.DirectionalLight('#ffd9a6',4.2);sun.position.set(-17,12.5,9);sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);Object.assign(sun.shadow.camera,{left:-18,right:18,top:18,bottom:-18,far:60});sun.shadow.bias=-.0002;sun.shadow.normalBias=.03;sun.shadow.radius=3;scene.add(sun);

// Ashlar of porous ostionera: courses of uneven blocks, shell pores and thin joints.
const ashlar=(()=>{const S=1024,rows=6,h=S/rows,blocks=[];for(let r=0;r<rows;r++){const start=rand()*S;let x=start;while(x<start+S-1){let w=230+rand()*270;if(x+w>start+S-120)w=start+S-x;blocks.push({x,y:r*h,w,h,tone:.84+rand()*.22,warm:rand()});x+=w;}}return blocks;})();
function eachWrapped(S,b,fn){const x=((b.x%S)+S)%S;fn(x,b.y,b.w,b.h);if(x+b.w>S)fn(x-S,b.y,b.w,b.h);}
function stoneMaps(){const S=1024;const pores=[];for(let i=0;i<7000;i++)pores.push([rand()*S,rand()*S,.5+rand()*rand()*2.4]);
const map=canvasTex(S,x=>{for(const b of ashlar)eachWrapped(S,b,(bx,by,bw,bh)=>{const t=b.tone,r=Math.round((204+b.warm*10)*t),g=Math.round((181+b.warm*4)*t),bl=Math.round((139-b.warm*8)*t);x.fillStyle=`rgb(${r},${g},${bl})`;x.fillRect(bx,by,bw,bh);const gr=x.createLinearGradient(0,by,0,by+bh);gr.addColorStop(0,'rgba(255,248,230,.07)');gr.addColorStop(1,'rgba(70,50,25,.10)');x.fillStyle=gr;x.fillRect(bx,by,bw,bh);});
for(let i=0;i<90000;i++){const v=rand();x.fillStyle=v>.5?`rgba(255,245,222,${.05+rand()*.07})`:`rgba(92,72,44,${.05+rand()*.08})`;x.fillRect(rand()*S,rand()*S,1+rand()*3,1+rand()*2);}
for(const [px,py,pr] of pores){x.fillStyle=`rgba(86,68,44,${.25+rand()*.3})`;x.beginPath();x.arc(px,py,pr,0,Math.PI*2);x.fill();}
x.strokeStyle='rgba(118,98,68,.6)';x.lineWidth=3;for(const b of ashlar)eachWrapped(S,b,(bx,by,bw,bh)=>x.strokeRect(bx+1.5,by+1.5,bw-3,bh-3));});
const bump=canvasTex(S,x=>{x.fillStyle='#b4b4b4';x.fillRect(0,0,S,S);for(const b of ashlar)eachWrapped(S,b,(bx,by,bw,bh)=>{const v=Math.round(165+rand()*30);x.fillStyle=`rgb(${v},${v},${v})`;x.fillRect(bx,by,bw,bh);});for(let i=0;i<40000;i++){const v=rand()>.5?220:120;x.fillStyle=`rgba(${v},${v},${v},.18)`;x.fillRect(rand()*S,rand()*S,2+rand()*4,2+rand()*3);}for(const [px,py,pr] of pores){x.fillStyle='rgba(40,40,40,.7)';x.beginPath();x.arc(px,py,pr+.4,0,Math.PI*2);x.fill();}x.strokeStyle='#4a4a4a';x.lineWidth=6;for(const b of ashlar)eachWrapped(S,b,(bx,by,bw,bh)=>x.strokeRect(bx+1.5,by+1.5,bw-3,bh-3));},false);
return {map,bump};}
const stoneTex=stoneMaps();
// Weathering: stone darkens towards the ground and in the damp base course.
function weathered(mat){mat.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying float vWorldY;').replace('#include <begin_vertex>','#include <begin_vertex>\nvWorldY=(modelMatrix*vec4(transformed,1.)).y;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying float vWorldY;').replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.rgb*=mix(.7,1.,smoothstep(.05,1.5,vWorldY))*mix(1.,.93,smoothstep(6.,9.5,vWorldY));');};return mat;}
const stone=weathered(new THREE.MeshStandardMaterial({color:'#ffffff',map:stoneTex.map,bumpMap:stoneTex.bump,bumpScale:2.2,roughness:.92}));stone.userData.uvScale=2;
// Carved pieces (tracery, columns, mouldings) are finer and slightly paler than the walls.
const carved=weathered(new THREE.MeshStandardMaterial({color:'#efe6d6',map:stoneTex.map,bumpMap:stoneTex.bump,bumpScale:.8,roughness:.86}));carved.userData.uvScale=3.2;
const gallery=new THREE.MeshStandardMaterial({color:'#8d7c62',map:stoneTex.map,roughness:.95});gallery.userData.uvScale=2;
const marble=new THREE.MeshStandardMaterial({color:'#efe9dc',roughness:.34,map:canvasTex(512,(x,s)=>{x.fillStyle='#f4f0e7';x.fillRect(0,0,s,s);x.lineCap='round';for(let i=0;i<26;i++){x.strokeStyle=`rgba(150,140,125,${.05+rand()*.08})`;x.lineWidth=.6+rand()*1.8;x.beginPath();let px=rand()*s,py=rand()*s;x.moveTo(px,py);for(let k=0;k<8;k++){px+=(rand()-.3)*70;py+=(rand()-.5)*50;x.lineTo(px,py);}x.stroke();}for(let i=0;i<20000;i++){x.fillStyle=`rgba(120,110,95,${rand()*.05})`;x.fillRect(rand()*s,rand()*s,2,2);}})});marble.userData.uvScale=1.2;
const roof=new THREE.MeshStandardMaterial({color:'#8a6a52',roughness:.95});
const iron=new THREE.MeshStandardMaterial({color:'#3b3a36',roughness:.55,metalness:.6});
function mesh(geo,mat,parent=scene){const o=new THREE.Mesh(geo,mat);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function box(w,h,d,x,y,z,mat=stone,parent=scene){const o=mesh(new THREE.BoxGeometry(w,h,d),mat,parent);o.position.set(x,y,z);return o;}
function cyl(r1,r2,h,x,y,z,mat=stone,parent=scene,n=16){const o=mesh(new THREE.CylinderGeometry(r1,r2,h,n),mat,parent);o.position.set(x,y,z);return o;}
// Every textured surface is mapped in world metres, so joints run continuously across pieces.
function worldUV(o,scale){const g=o.geometry,p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv;if(!uv)return;const nm=new THREE.Matrix3().getNormalMatrix(o.matrixWorld),v=new THREE.Vector3(),w=new THREE.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);w.fromBufferAttribute(n,i).applyMatrix3(nm);const ax=Math.abs(w.x),ay=Math.abs(w.y),az=Math.abs(w.z);if(ay>=ax&&ay>=az)uv.setXY(i,v.x/scale,v.z/scale);else if(ax>=az)uv.setXY(i,v.z/scale,v.y/scale);else uv.setXY(i,v.x/scale,v.y/scale);}uv.needsUpdate=true;}

// Gothic bay, after the photographs: pierced tracery plate of quatrefoils over four lancets.
function pointed(p,x0,x1,spring,top){const k=(top-spring)*.68,mid=(x0+x1)/2;p.quadraticCurveTo(x0,spring+k,mid,top);p.quadraticCurveTo(x1,spring+k,x1,spring);}
function archPath(w,bottom,spring,top){const p=new THREE.Path();p.moveTo(-w/2,bottom);p.lineTo(-w/2,spring);pointed(p,-w/2,w/2,spring,top);p.lineTo(w/2,bottom);p.closePath();return p;}
function archOutline(w,spring,top,z,parent,r=.065){const k=(top-spring)*.68,p=new THREE.CurvePath();p.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(-w/2,spring,z),new THREE.Vector3(-w/2,spring+k,z),new THREE.Vector3(0,top,z)));p.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,top,z),new THREE.Vector3(w/2,spring+k,z),new THREE.Vector3(w/2,spring,z)));return mesh(new THREE.TubeGeometry(p,40,r,8,false),carved,parent);}
function lobed(cx,cy,R,f){const p=new THREE.Path();for(let i=0;i<=72;i++){const a=i/72*Math.PI*2,r=R*f(a),px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r;i?p.lineTo(px,py):p.moveTo(px,py);}return p;}
function segDist(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy)));return Math.hypot(px-ax-t*dx,py-ay-t*dy);}
function fits(poly,x,y,clear){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)inside=!inside;if(segDist(x,y,a.x,a.y,b.x,b.y)<clear)return false;}return inside;}
const SPRING=3.1,TOP=5.45,HALF=1.9,SILL=.95,LANCET=3.55;
const traceryGeo=(()=>{const s=new THREE.Shape();s.moveTo(-HALF,SPRING);for(let i=0;i<4;i++){const x0=-HALF+i*.95;pointed(s,x0,x0+.95,SPRING,LANCET);}pointed(s,HALF,-HALF,SPRING,TOP);
const poly=s.getPoints(20);const quatrefoil=a=>.52+.48*Math.pow(Math.abs(Math.cos(2*a)),1.6),star=a=>.3+.7*Math.pow(Math.abs(Math.cos(2*(a+Math.PI/4))),5);
for(let y=3.92;y<5.4;y+=.38)for(let x=-1.71;x<1.75;x+=.38){if(fits(poly,x,y,.205))s.holes.push(lobed(x,y,.158,quatrefoil));const sx=x+.19,sy=y+.19;if(fits(poly,sx,sy,.1))s.holes.push(lobed(sx,sy,.075,star));}
// Trefoil eyes in the lancet heads.
for(let i=0;i<4;i++)s.holes.push(lobed(-HALF+.475+i*.95,3.36,.075,a=>.6+.4*Math.abs(Math.cos(1.5*a+Math.PI/2))));
return new THREE.ExtrudeGeometry(s,{depth:.2,curveSegments:14,bevelEnabled:true,bevelThickness:.018,bevelSize:.014,bevelSegments:1});})();
const wallGeo=(()=>{const s=new THREE.Shape();s.moveTo(-2.4,0);s.lineTo(2.4,0);s.lineTo(2.4,6.2);s.lineTo(-2.4,6.2);s.closePath();s.holes.push(archPath(HALF*2,SILL,SPRING,TOP));return new THREE.ExtrudeGeometry(s,{depth:.38,bevelEnabled:false,curveSegments:20});})();
function prism(w,h,d,x,y,z,mat,parent){const s=new THREE.Shape();s.moveTo(0,0);s.lineTo(d,0);s.lineTo(0,h);s.closePath();const o=mesh(new THREE.ExtrudeGeometry(s,{depth:w,bevelEnabled:false}),mat,parent);o.rotation.y=-Math.PI/2;o.position.set(x+w/2,y,z);return o;}
function bay(buttress=true){const g=new THREE.Group();mesh(wallGeo.clone(),stone,g);
const t=mesh(traceryGeo.clone(),carved,g);t.position.z=.08;
archOutline(HALF*2+.04,SPRING,TOP+.03,.42,g,.085);archOutline(HALF*2+.3,SPRING+.02,TOP+.22,.4,g,.05);
for(let i=0;i<4;i++){const x0=-HALF+i*.95;const p=new THREE.CurvePath(),k=(LANCET-SPRING)*.68;p.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(x0,SPRING,.3),new THREE.Vector3(x0,SPRING+k,.3),new THREE.Vector3(x0+.475,LANCET,.3)));p.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(x0+.475,LANCET,.3),new THREE.Vector3(x0+.95,SPRING+k,.3),new THREE.Vector3(x0+.95,SPRING,.3)));mesh(new THREE.TubeGeometry(p,20,.035,6,false),carved,g);}
// Parapet, sill and slender columns with capitals.
box(HALF*2,.09,.62,0,SILL+.045,.2,carved,g);box(4.8,.28,.5,0,.14,.23,stone,g);
for(let x=-HALF;x<=HALF+.01;x+=.95){cyl(.068,.078,1.82,x,SILL+.09+.91+.05,.19,carved,g,14);cyl(.12,.14,.1,x,SILL+.14,.19,carved,g,14);cyl(.15,.08,.17,x,SPRING-.16,.19,carved,g,14);box(.29,.06,.29,x,SPRING-.045,.19,carved,g);}
// Buttress between bays, stepped with sloping caps, and its iron rain spout.
if(buttress){box(.82,4.9,.72,-2.4,2.45,.38+.36,stone,g);prism(.82,.5,.72,-2.4,4.9,.38,stone,g);box(.82,.5,.28,-2.4,5.15,.52,stone,g);
box(.7,1.5,.4,-2.4,6.4+.55,.58,stone,g);prism(.7,.42,.4,-2.4,7.7,.38,stone,g);
const spout=cyl(.035,.05,.7,-2.4,7.55,.95,iron,g,8);spout.rotation.x=Math.PI/2.4;}
// Stringcourse, plain ashlar upper storey and cornice.
box(4.8,.2,.62,0,6.3,.21,carved,g);box(4.8,3.3,.38,0,8.05,.19,stone,g);box(4.8,.24,.66,0,9.78,.22,carved,g);
const tiles=box(4.8,.12,1.6,0,10.05,-.35,roof,g);tiles.rotation.x=-.28;
for(let i=0,n=2+Math.floor(rand()*3);i<n;i++)streak(-1.8+rand()*3.6,9.66,.25+rand()*.5,.8+rand()*1.6,.386,g);
for(let i=0,n=1+Math.floor(rand()*3);i<n;i++)streak(-1.6+rand()*3.2,.9,.2+rand()*.5,.3+rand()*.4,.386,g);
return g;}
// Groin vault over each bay of the walk: two crossing barrels with ribs along the creases.
const GX=2.4,GZ=1.3,GC=-13.3,VSPRING=4.3,VRISE=1.8;const vf=t=>Math.pow(Math.max(0,1-t*t),.6),vaultH=(u,v)=>VSPRING+VRISE*Math.max(vf(Math.min(u,1)),vf(Math.min(v,1)));
const vaultGeo=(()=>{const g=new THREE.PlaneGeometry(GX*2,GZ*2,40,22),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getY(i);p.setXYZ(i,x,vaultH(Math.abs(x)/GX,Math.abs(z)/GZ),z);}g.computeVertexNormals();return g;})();
function rib(points,parent){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,.065,6,false),gallery,parent);}
function vault(xc,parent){const v=mesh(vaultGeo.clone(),gallery,parent);v.position.set(xc,0,GC);
for(const sz of [1,-1]){const pts=[];for(let i=0;i<=16;i++){const t=i/8-1;pts.push(new THREE.Vector3(xc+t*GX,vaultH(Math.abs(t),Math.abs(t))-.04,GC+sz*t*GZ));}rib(pts,parent);}
const tr=[];for(let i=0;i<=12;i++){const t=i/6-1;tr.push(new THREE.Vector3(xc-GX,vaultH(1,Math.abs(t))-.04,GC+t*GZ));}rib(tr,parent);
cyl(.13,.13,.08,xc,VSPRING+VRISE-.06,GC,gallery,parent,16);
// Engaged shaft on the back wall and corbel on the arcade side, where the ribs spring.
cyl(.11,.11,VSPRING,xc-GX,VSPRING/2,-14.5,gallery,parent,12);box(.3,.25,.3,xc-GX,VSPRING-.05,-12.12,gallery,parent);}
// Diagonal buttress closing each corner of the courtyard.
function cornerButtress(parent){const g=new THREE.Group();g.position.set(-11.62,0,-11.62);g.rotation.y=Math.PI/4;parent.add(g);
box(.9,4.9,.8,0,2.45,.4,stone,g);prism(.9,.5,.8,0,4.9,0,stone,g);box(.9,.5,.3,0,5.15,.15,stone,g);box(.76,1.6,.45,0,6.95,.22,stone,g);prism(.76,.45,.45,0,7.75,0,stone,g);
const sp=cyl(.035,.05,.7,0,7.6,.62,iron,g,8);sp.rotation.x=Math.PI/2.4;}
// Damp streaks: dark runs below the cornice and the sills, as on the cloister's real stone.
const streakTex=canvasTex(128,(x,s)=>{x.fillStyle='#000';x.fillRect(0,0,s,s);for(let i=0;i<14;i++){const cx=s*(.15+rand()*.7),w=2+rand()*9,len=s*(.35+rand()*.65),g=x.createLinearGradient(0,0,0,len);g.addColorStop(0,`rgba(255,255,255,${.5+rand()*.5})`);g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(cx-w/2,0,w,len);}x.filter='blur(3px)';x.drawImage(x.canvas,0,0);},false);
const streakMat=new THREE.MeshStandardMaterial({color:'#3a2e1e',alphaMap:streakTex,transparent:true,opacity:.5,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,roughness:1});
const streakGeo=new THREE.PlaneGeometry(1,1);
function streak(x,top,w,h,z,parent){const o=new THREE.Mesh(streakGeo,streakMat);o.scale.set(w,h,1);o.position.set(x,top-h/2,z);o.receiveShadow=true;parent.add(o);}
const architecture=new THREE.Group();scene.add(architecture);
for(let side=0;side<4;side++){const wall=new THREE.Group();for(let i=0;i<5;i++){const b=bay(i>0);b.position.set((i-2)*4.8,0,0);wall.add(b);}wall.position.set(0,0,-12);const holder=new THREE.Group();holder.rotation.y=side*Math.PI/2;holder.add(wall);architecture.add(holder);
// Covered walk behind the openings: back wall, ceiling and floor, lit only by what enters the arches.
box(24.8,6.3,.3,0,3.15,-14.75,gallery,holder);box(24.8,.25,3,0,6.32,-13.3,gallery,holder);box(24.8,.05,3,0,.025,-13.3,gallery,holder);
const pitchedRoof=box(25,.16,3.4,0,10.1,-13.4,roof,holder);pitchedRoof.rotation.x=-.3;
for(let i=0;i<5;i++)vault((i-2)*4.8,holder);cornerButtress(holder);
// Corner square where two walks meet: walls, floor, ceiling and a square vault.
box(2.9,6.3,.3,-13.55,3.15,-14.75,gallery,holder);box(.3,6.3,2.9,-14.75,3.15,-13.55,gallery,holder);box(3,.05,3,-13.5,.025,-13.5,gallery,holder);box(3,.25,3,-13.5,6.32,-13.5,gallery,holder);
const cv=mesh(vaultGeo.clone(),gallery,holder);cv.scale.x=GZ/GX;cv.position.set(-13.3,0,-13.3);}

// Pavement: diagonal chequer of slate grey and limestone, as in the cloister walks.
const paving=canvasTex(1024,(x,S)=>{const k=8,a=S/k,img=x.createImageData(S,S),d=img.data,tone=[];for(let i=0;i<k*k;i++)tone.push(.86+rand()*.24);for(let py=0;py<S;py++)for(let px=0;px<S;px++){const u=(px+py)/a,v=(px-py+S)/a,iu=Math.floor(u),iv=Math.floor(v),dark=(iu+iv)%2===0,t=tone[((iu%k+k)%k)*k+((iv%k+k)%k)],fu=u-iu,fv=v-iv,edge=Math.min(fu,1-fu,fv,1-fv)<.018;let c=dark?[92,98,106]:[184,179,168];if(edge)c=[70,68,62];const n=.94+Math.random()*.1,i=(py*S+px)*4;d[i]=c[0]*t*n;d[i+1]=c[1]*t*n;d[i+2]=c[2]*t*n;d[i+3]=255;}x.putImageData(img,0,0);});
const ground=mesh(new THREE.PlaneGeometry(24,24),new THREE.MeshStandardMaterial({map:paving,roughness:.82}));ground.rotation.x=-Math.PI/2;ground.material.userData.uvScale=2.4;
const grassTex=canvasTex(512,(x,s)=>{x.fillStyle='#5b6440';x.fillRect(0,0,s,s);for(let i=0;i<60;i++){x.fillStyle=`rgba(${120+rand()*40},${105+rand()*30},${60},${.06+rand()*.08})`;x.beginPath();x.arc(rand()*s,rand()*s,20+rand()*60,0,Math.PI*2);x.fill();}for(let i=0;i<70000;i++){const v=rand();x.fillStyle=v>.5?`rgba(150,160,95,${rand()*.25})`:`rgba(40,48,25,${rand()*.25})`;x.fillRect(rand()*s,rand()*s,1,1+rand()*3);}});
const grass=new THREE.MeshStandardMaterial({map:grassTex,roughness:1});grass.userData.uvScale=3;
const kerb=new THREE.MeshStandardMaterial({color:'#d9d0bd',roughness:.85});
function lawnShape(near,far,cut){const s=new THREE.Shape();s.moveTo(near+cut,-near);s.lineTo(far,-near);s.lineTo(far,-far);s.lineTo(near,-far);s.lineTo(near,-near-cut);s.closePath();return s;}
for(let k=0;k<4;k++){const g=new THREE.Group();g.rotation.y=k*Math.PI/2;scene.add(g);const c=mesh(new THREE.ExtrudeGeometry(lawnShape(2.3,10.5,2.3),{depth:.06,bevelEnabled:false}),kerb,g);c.rotation.x=-Math.PI/2;const l=mesh(new THREE.ExtrudeGeometry(lawnShape(2.45,10.35,2.25),{depth:.085,bevelEnabled:false}),grass,g);l.rotation.x=-Math.PI/2;l.position.y=.005;}

// Fountain: chamfered square pool on an octagonal step, and two turned marble bowls, based on the supplied views.
function squarePath(r,c=.27){const p=new THREE.Shape();p.moveTo(-r+c,-r);p.lineTo(r-c,-r);p.lineTo(r,-r+c);p.lineTo(r,r-c);p.lineTo(r-c,r);p.lineTo(-r+c,r);p.lineTo(-r,r-c);p.lineTo(-r,-r+c);p.closePath();return p;}
function slab(shape,height,y){const o=mesh(new THREE.ExtrudeGeometry(shape,{depth:height,bevelEnabled:true,bevelSize:.03,bevelThickness:.02,bevelSegments:2}),marble);o.rotation.x=-Math.PI/2;o.position.y=y;return o;}
function poolRing(outer,inner,height,y){const s=squarePath(outer);s.holes.push(squarePath(inner));return slab(s,height,y);}
slab(squarePath(2.05,.62),.16,.02);poolRing(1.68,1.48,.48,.22);poolRing(1.75,1.43,.10,.71);poolRing(1.71,1.46,.08,.29);slab(squarePath(1.5,.2),.06,.2);
box(.47,.95,.47,0,.81,0,marble);box(.59,.12,.59,0,1.32,0,marble);
function lathe(profile,y){const o=mesh(new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),64),marble);o.position.y=y;return o;}
lathe([[.15,0],[.18,.08],[.12,.18],[.14,.28],[.35,.32],[.60,.43],[.76,.58],[.79,.64],[.73,.65],[.64,.53],[.38,.43],[.16,.42]],1.37);
lathe([[.12,0],[.17,.08],[.10,.28],[.12,.48],[.24,.52],[.40,.60],[.50,.72],[.51,.77],[.45,.78],[.35,.67],[.12,.62]],2.02);
lathe([[0,0],[.07,0],[.09,.05],[.05,.1],[.06,.16],[0,.2]],2.78);
const waterMat=new THREE.MeshPhysicalMaterial({color:'#6a9a92',roughness:.08,metalness:0,transparent:true,opacity:.78,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:1.6,side:THREE.DoubleSide});
// Fine ripples: a procedural normal map that drifts, so the surface glints like water rather than glass.
const rippleNormal=(()=>{const N=256,h=new Float32Array(N*N);for(let k=0;k<26;k++){const fx=1+Math.floor(rand()*6),fy=1+Math.floor(rand()*6),ph=rand()*6,a=1/(fx+fy);for(let y=0;y<N;y++)for(let x=0;x<N;x++)h[y*N+x]+=a*Math.sin((x*fx+y*fy)/N*Math.PI*2+ph);}
const c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d'),img=g.createImageData(N,N);for(let y=0;y<N;y++)for(let x=0;x<N;x++){const dx=h[y*N+(x+1)%N]-h[y*N+(x+N-1)%N],dy=h[((y+1)%N)*N+x]-h[((y+N-1)%N)*N+x],i=(y*N+x)*4;img.data[i]=128+dx*90;img.data[i+1]=128+dy*90;img.data[i+2]=255;img.data[i+3]=255;}g.putImageData(img,0,0);
const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);return t;})();
waterMat.normalMap=rippleNormal;waterMat.normalScale.set(.35,.35);waterMat.opacity=.5;waterMat.color.set('#5f9f97');
const water=mesh(new THREE.PlaneGeometry(2.9,2.9,128,128),waterMat);water.rotation.x=-Math.PI/2;water.position.y=.63;water.castShadow=false;
// Caustics dancing on the pool floor.
const caustic=canvasTex(256,(x,s)=>{x.fillStyle='#000';x.fillRect(0,0,s,s);x.strokeStyle='rgba(255,255,255,.55)';x.lineCap='round';for(let i=0;i<70;i++){const cx=rand()*s,cy=rand()*s,r=10+rand()*26;x.lineWidth=1+rand()*2.5;x.beginPath();for(let k=0;k<=7;k++){const a=k/7*Math.PI*2,rr=r*(.75+rand()*.5);for(const ox of [-s,0,s])for(const oy of [-s,0,s]){}k?x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr):x.moveTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}x.stroke();}x.filter='blur(1.2px)';x.drawImage(x.canvas,0,0);},false);
caustic.repeat.set(2.4,2.4);
const causticMat=new THREE.MeshBasicMaterial({color:'#e9fff7',alphaMap:caustic,transparent:true,opacity:.28,blending:THREE.AdditiveBlending,depthWrite:false});
const causticFloor=new THREE.Mesh(new THREE.PlaneGeometry(2.9,2.9),causticMat);causticFloor.rotation.x=-Math.PI/2;causticFloor.position.y=.275;scene.add(causticFloor);
for(const [r,y] of [[.66,1.94],[.41,2.74]]){const o=mesh(new THREE.CircleGeometry(r,48),waterMat);o.rotation.x=-Math.PI/2;o.position.y=y;o.castShadow=false;}
const streamMat=new THREE.MeshPhysicalMaterial({color:'#d6efe9',transparent:true,opacity:.42,roughness:.05,depthWrite:false});cyl(.016,.026,.26,0,3.08,0,streamMat,scene,12).castShadow=false;
// Thin falls from the rims of both bowls.
const falls=[];for(const [n,r,y,h] of [[10,.79,1.72,.9],[8,.51,2.4,.5]])for(let i=0;i<n;i++){const a=i/n*Math.PI*2+.2;const o=cyl(.006,.014,h,Math.cos(a)*r,y,Math.sin(a)*r,streamMat,scene,6);o.castShadow=false;falls.push(o);}


scene.updateMatrixWorld(true);scene.traverse(o=>{if(o.isMesh&&o.material.userData.uvScale)worldUV(o,o.material.userData.uvScale);});

// ── The immersion, in tour progress (0–1 over DURATION seconds) ──
// Cloister → a drop of the wound's ink falls into the fountain → we follow it under the water →
// the ink opens into the wound's world → fibres knit (healing) → the light becomes the paper of the first slide.
const DURATION=34,COVER_END=.12,WALK_END=.38,DROP_START=.405,IMPACT_AT=.425,ENTRY=.465,ARRIVE=.93;
const S=THREE.MathUtils.smoothstep,clamp=THREE.MathUtils.clamp,lerp=THREE.MathUtils.lerp;
const span=(p,a,b)=>clamp((p-a)/(b-a),0,1),ease=t=>t*t*(3-2*t);
const tmpC=new THREE.Color(),tmpV=new THREE.Vector3(),tmpM=new THREE.Matrix4(),tmpQ=new THREE.Quaternion(),tmpE=new THREE.Euler(),tmpS=new THREE.Vector3();

// The drop: the wound's ink entering clear water, with its stain spreading below the surface.
const IMPACT=new THREE.Vector3(1.0,.63,.85);
const drop=mesh(new THREE.SphereGeometry(.045,20,14),new THREE.MeshPhysicalMaterial({color:'#a81d2b',roughness:.06,clearcoat:1,envMapIntensity:1.5}));drop.castShadow=false;drop.visible=false;
const softTex=canvasTex(128,(x,s)=>{const g=x.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.45,'rgba(255,255,255,.5)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,s,s);},false);
softTex.wrapS=softTex.wrapT=THREE.ClampToEdgeWrapping;
// Under the surface the ink opens into a small cloud that sinks and curls.
const PLUME=90,plumeGeo=new THREE.BufferGeometry(),plumePos=new Float32Array(PLUME*3),plumeSeed=[];for(let i=0;i<PLUME;i++)plumeSeed.push([rand()*Math.PI*2,rand(),rand(),rand()]);
plumeGeo.setAttribute('position',new THREE.BufferAttribute(plumePos,3));
const plume=new THREE.Points(plumeGeo,new THREE.PointsMaterial({color:'#9a1626',map:softTex,size:.16,transparent:true,opacity:0,depthWrite:false}));plume.frustumCulled=false;scene.add(plume);

// ── Beneath: its own scene, with no floor or horizon ──
const deep=new THREE.Scene();deep.background=new THREE.Color('#2f6f6c');deep.fog=new THREE.FogExp2('#2f6f6c',.07);
const deepPath=new THREE.CatmullRomCurve3([[0,0,0],[0,-12,-1],[0,-28,-6],[.6,-42,-20],[0,-50,-42],[-.6,-54,-70],[0,-56,-100],[0,-56.5,-128],[0,-56.5,-160]].map(v=>new THREE.Vector3(...v)));
const deepLen=deepPath.getLength(),DEEP_END=128/160;
// Colour arc along the descent: water, wound, healing skin, paper.
const ARC=[[0,'#3b7d77'],[.16,'#22504e'],[.3,'#4a1c26'],[.5,'#5e222c'],[.66,'#b9776a'],[.8,'#ead0c1'],[.92,'#f6f0e8'],[1,'#f6f0e8']];
function arcColor(u,out){let i=1;while(i<ARC.length-1&&u>ARC[i][0])i++;const [a,ca]=ARC[i-1],[b,cb]=ARC[i];return out.set(ca).lerp(tmpC.set(cb),clamp((u-a)/(b-a),0,1));}
const deepHemi=new THREE.HemisphereLight('#c8f3ea','#0c2423',1.6);deep.add(deepHemi);
const deepSun=new THREE.DirectionalLight('#f2fff9',2.2);deepSun.position.set(.4,1,.2);deep.add(deepSun);
const lamp=new THREE.PointLight('#ff9b84',0,26,1.6);deep.add(lamp);
// Frame around the path, to place things beside it.
function around(t,r,a,out=new THREE.Vector3()){const p=deepPath.getPointAt(t),tg=deepPath.getTangentAt(t),n=new THREE.Vector3().crossVectors(tg,new THREE.Vector3(1,0,0)).normalize(),b=new THREE.Vector3().crossVectors(tg,n);return out.copy(p).addScaledVector(n,Math.cos(a)*r).addScaledVector(b,Math.sin(a)*r);}

// Rim-lit translucent material for bubbles, membranes and cells.
function rimMaterial(color,{power=2.4,core=.05,opacity=1,wobble=0,additive=false}={}){return new THREE.ShaderMaterial({transparent:true,depthWrite:false,fog:true,blending:additive?THREE.AdditiveBlending:THREE.NormalBlending,
uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{uColor:{value:new THREE.Color(color)},uPower:{value:power},uCore:{value:core},uOpacity:{value:opacity},uTime:{value:0},uWobble:{value:wobble}}]),
vertexShader:`uniform float uTime,uWobble;varying vec3 vN;varying vec3 vV;
#include <common>
#include <fog_pars_vertex>
void main(){vec3 p=position+normal*uWobble*sin(position.x*2.1+uTime*1.1)*sin(position.y*1.7+uTime*.8)*sin(position.z*1.9+uTime*.9);
mat4 m=modelMatrix;
#ifdef USE_INSTANCING
m=modelMatrix*instanceMatrix;
#endif
vec4 w=m*vec4(p,1.);vN=normalize(mat3(m)*normal);vV=cameraPosition-w.xyz;vec4 mvPosition=viewMatrix*w;gl_Position=projectionMatrix*mvPosition;
#include <fog_vertex>
}`,
fragmentShader:`uniform vec3 uColor;uniform float uPower,uCore,uOpacity;varying vec3 vN;varying vec3 vV;
#include <common>
#include <fog_pars_fragment>
void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),uPower);gl_FragColor=vec4(uColor*(.55+f*.9),(uCore+f)*uOpacity);
#include <tonemapping_fragment>
#include <colorspace_fragment>
#include <fog_fragment>
}`});}

// Light shafts from the surface, swaying, only in the clear water.
const shaftTex=canvasTex(64,(x,s)=>{const g=x.createLinearGradient(0,0,0,s);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,s,s);},false);
const shaftMat=new THREE.MeshBasicMaterial({color:'#d9fff4',alphaMap:shaftTex,transparent:true,opacity:.07,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
const shafts=[];for(let i=0;i<11;i++){const o=new THREE.Mesh(new THREE.CylinderGeometry(.15+rand()*.25,.7+rand()*1.1,40,40,1,true),shaftMat);const a=rand()*Math.PI*2,r=4+rand()*7;o.position.set(Math.cos(a)*r,-18,Math.sin(a)*r-2);o.rotation.set((rand()-.5)*.25,0,(rand()-.5)*.25);o.userData.phase=rand()*6;deep.add(o);shafts.push(o);}

// Bubbles left by our entry: they rise slowly while we sink fast, so they rush past.
const BUB=260,bubbles=new THREE.InstancedMesh(new THREE.SphereGeometry(1,14,10),rimMaterial('#e9fffb',{power:1.6,core:.02,opacity:.9,additive:true}),BUB);deep.add(bubbles);
const bubbleData=[];for(let i=0;i<BUB;i++){const y=-rand()*30,a=rand()*Math.PI*2,r=.3+rand()*rand()*3.2;bubbleData.push({x:Math.cos(a)*r,y,z:Math.sin(a)*r-1.2*(-y/30),s:.015+rand()*rand()*.09,rise:.6+rand()*1.6,ph:rand()*6});}

// The ink: a cloud that blooms from the drop and leads the way down.
const INK=900,inkGeo=new THREE.BufferGeometry(),inkPos=new Float32Array(INK*3),inkSeed=[];for(let i=0;i<INK;i++){const t=rand();inkSeed.push({t,a:rand()*Math.PI*2,r:rand(),w:rand()*6,sp:.4+rand()});}
inkGeo.setAttribute('position',new THREE.BufferAttribute(inkPos,3));
const inkMat=new THREE.PointsMaterial({color:'#9c1c2c',map:softTex,size:1.1,sizeAttenuation:true,transparent:true,opacity:.3,depthWrite:false,fog:true});const ink=new THREE.Points(inkGeo,inkMat);deep.add(ink);
function updateInk(u,time){const grow=S(u,0,.3);for(let i=0;i<INK;i++){const k=inkSeed[i],tt=clamp(.012+k.t*.32*grow,0,1);around(tt,(.2+k.r*k.r*3.4)*grow*(1+Math.sin(time*.3*k.sp+k.w)*.15),k.a+time*.05*k.sp+tt*9,tmpV);inkPos[i*3]=tmpV.x;inkPos[i*3+1]=tmpV.y;inkPos[i*3+2]=tmpV.z;}inkGeo.attributes.position.needsUpdate=true;}

// Motes in suspension: plankton in the water, serum and cells in the wound.
const MOTES=1800,moteGeo=new THREE.BufferGeometry(),motePos=new Float32Array(MOTES*3);for(let i=0;i<MOTES;i++){around(rand()*.97,1+rand()*11,rand()*Math.PI*2,tmpV);motePos.set([tmpV.x,tmpV.y,tmpV.z],i*3);}
moteGeo.setAttribute('position',new THREE.BufferAttribute(motePos,3));const moteMat=new THREE.PointsMaterial({color:'#dff7f0',map:softTex,size:.09,transparent:true,opacity:.7,depthWrite:false,fog:true});const motes=new THREE.Points(moteGeo,moteMat);deep.add(motes);

// The wound: drifting red cells and membrane-like cells.
const discGeo=new THREE.LatheGeometry([[.001,.1],[.35,.13],[.68,.27],[.9,.27],[1,.12],[1,-.12],[.9,-.27],[.68,-.27],[.35,-.13],[.001,-.1]].map(p=>new THREE.Vector2(...p)),28);
const RBC=190,redCells=new THREE.InstancedMesh(discGeo,new THREE.MeshStandardMaterial({color:'#b52a37',roughness:.42,emissive:'#3d0710',emissiveIntensity:.6}),RBC);deep.add(redCells);
const cellData=[];for(let i=0;i<RBC;i++)cellData.push({t:.18+rand()*.34,r:1.4+rand()*8,a:rand()*Math.PI*2,s:.22+rand()*.28,spin:new THREE.Vector3(rand(),rand(),rand()),drift:.004+rand()*.01,ph:rand()*6});
const membranes=[];for(let i=0;i<34;i++){const t=.22+rand()*.5,warm=t>.5;const m=new THREE.Mesh(new THREE.IcosahedronGeometry(1,5),rimMaterial(warm?'#f0b49b':'#e46a5a',{power:2+rand(),core:.04,opacity:.55,wobble:.12}));around(t,3+rand()*9,rand()*Math.PI*2,m.position);m.scale.setScalar(1.2+rand()*3.4);m.userData.ph=rand()*6;deep.add(m);membranes.push(m);
const nucleus=new THREE.Mesh(new THREE.SphereGeometry(.28,16,12),rimMaterial(warm?'#c97d68':'#9c2f3b',{power:1.4,core:.25,opacity:.6}));nucleus.position.set((rand()-.5)*.4,(rand()-.5)*.4,(rand()-.5)*.4);m.add(nucleus);}

// Healing: collagen fibres knitting a crossed mesh around the way, gently wavy, as the light opens.
const fibreMats=[];const fibres=[];for(let i=0;i<64;i++){const t0=.48+rand()*.26,len=.1+rand()*.16,a0=rand()*Math.PI*2,drift=(i%2?1:-1)*(.9+rand()*1.3),r0=1.2+rand()*6,wave=.15+rand()*.35,ph=rand()*6;const pts=[];for(let k=0;k<=40;k++){const f=k/40;pts.push(around(Math.min(t0+f*len,.97),r0*(1-f*.35)+Math.sin(f*9+ph)*wave,a0+f*drift));}
const g=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),160,.012+rand()*.028,5,false);const o=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:rand()>.45?'#f1c4a8':'#fff0d6',roughness:.55,emissive:'#e9b696',emissiveIntensity:.45,transparent:true}));fibreMats.push(o.material);o.userData={t0,len,count:g.index.count};g.setDrawRange(0,0);deep.add(o);fibres.push(o);}
// The light at the end: it grows until it becomes the paper of the first slide.
const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex,color:'#fff8ee',transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));glow.position.copy(deepPath.getPointAt(.99));deep.add(glow);

const paper=new THREE.Color('#f6f0e8');
function updateDeep(u,time){arcColor(u,deep.background);deep.fog.color.copy(deep.background);
deep.fog.density=u<.3?lerp(.075,.05,u/.3):u<.62?.05:lerp(.05,.004,S(u,.62,.95));
deepHemi.color.copy(deep.background).lerp(tmpC.set('#ffffff'),.55);deepHemi.groundColor.copy(deep.background).multiplyScalar(.35);deepHemi.intensity=lerp(1.6,1.1,S(u,.2,.4))+S(u,.6,.9)*.8;
deepSun.intensity=2.2*(1-S(u,.15,.35))+S(u,.6,.9)*1.5;
shaftMat.opacity=.07*(1-S(u,.12,.3));for(const o of shafts){o.visible=shaftMat.opacity>.002;o.rotation.z=Math.sin(time*.25+o.userData.phase)*.06;o.scale.x=o.scale.z=1+Math.sin(time*.4+o.userData.phase)*.12;}
const tE=Math.max(0,(u)*DURATION*(1-ENTRY));
for(let i=0;i<BUB;i++){const b=bubbleData[i];tmpV.set(b.x+Math.sin(time*2+b.ph)*.05,b.y+tE*b.rise,b.z+Math.cos(time*1.7+b.ph)*.05);const vis=u<.35?1:0;tmpM.compose(tmpV,tmpQ.identity(),tmpS.setScalar(b.s*vis));bubbles.setMatrixAt(i,tmpM);}bubbles.instanceMatrix.needsUpdate=true;
updateInk(u,time);inkMat.opacity=.3*S(u,0,.04)*(1-S(u,.42,.6));
moteMat.color.copy(deep.background).lerp(tmpC.set(u<.3?'#e6fff9':'#ffd9c9'),.75);moteMat.opacity=.7*(1-S(u,.85,.95));
for(let i=0;i<RBC;i++){const c=cellData[i];around(clamp(c.t+Math.sin(time*c.drift*6+c.ph)*.004,0,1),c.r,c.a+time*c.drift,tmpV);tmpE.set(time*.3*c.spin.x+c.ph,time*.25*c.spin.y,time*.2*c.spin.z);tmpQ.setFromEuler(tmpE);tmpM.compose(tmpV,tmpQ,tmpS.setScalar(c.s));redCells.setMatrixAt(i,tmpM);}redCells.instanceMatrix.needsUpdate=true;
for(const m of membranes){m.material.uniforms.uTime.value=time+m.userData.ph;m.rotation.y=time*.05+m.userData.ph;}
const fo=1-S(u,.86,.97);for(const m of fibreMats)m.opacity=fo;for(const f of fibres){const {t0,len,count}=f.userData;const g=S(u,t0-.12,t0+len*.6);f.geometry.setDrawRange(0,Math.floor(count*g/3)*3);}
lamp.position.copy(camera.position);lamp.intensity=S(u,.25,.4)*(1-S(u,.7,.85))*40;
const gl=S(u,.55,1);glow.scale.setScalar(lerp(6,160,gl*gl));glow.material.opacity=gl;}

// ── Camera ──
const path=new THREE.CatmullRomCurve3([[0,2.15,11],[1.2,2.3,7.4],[1.8,2.15,4.4],[1.7,1.85,2.6],[1.35,1.6,1.75],[1.12,1.5,1.32]].map(v=>new THREE.Vector3(...v)),false,'catmullrom',.3);
const lookPath=new THREE.CatmullRomCurve3([[0,3.15,-12],[0,2.2,-2],[.4,1.3,.1],[.8,.75,.6],[.98,.63,.82],[1.0,.6,.84]].map(v=>new THREE.Vector3(...v)));
const hover=path.getPoint(1),below=new THREE.Vector3(1.0,0,.76);
let active=scene;
function placeCamera(p,time){
 if(p<WALK_END){const t=ease(span(p,0,WALK_END));camera.position.copy(path.getPoint(t));camera.lookAt(lookPath.getPoint(t));camera.fov=lerp(36,50,S(p,0,WALK_END));return scene;}
 if(p<ENTRY){const k=span(p,IMPACT_AT,ENTRY);camera.position.copy(hover).lerp(IMPACT,k*k*(1.6-.6*k));camera.position.y+=.01;camera.lookAt(1.0,lerp(.6,0,k),lerp(.84,.78,k));camera.fov=lerp(50,56,k);return scene;}
 const u=deepU(p);camera.position.copy(deepPath.getPointAt(u*DEEP_END));camera.lookAt(deepPath.getPointAt(Math.min(u*DEEP_END+.025,1)));camera.rotateZ(Math.sin(time*.15)*.05);camera.fov=lerp(58,52,S(u,.6,1));return deep;}
// The descent starts fast (the plunge) and settles; it ends gently as the light opens.
const deepU=p=>{const x=span(p,ENTRY,ARRIVE+.04);return 1-Math.pow(1-x,1.55);};

// ── Water surface: idle swell plus the ring from the drop ──
function updateWater(p,now){const pos=water.geometry.attributes.position,rt=Math.max(0,(p-IMPACT_AT)*DURATION),amp=p>IMPACT_AT?.03*Math.exp(-rt*.8):0;
for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);let z=Math.sin(x*7+now*.0014)*Math.cos(y*6+now*.001)*.012;if(amp>0){const r=Math.hypot(x-IMPACT.x,y+IMPACT.z),front=r-rt*.55;z+=amp*Math.sin(front*38)*Math.exp(-front*front*14)*(front<0?1:.3);}pos.setZ(i,z);}
pos.needsUpdate=true;water.geometry.computeVertexNormals();rippleNormal.offset.set(now*.000018,now*.000011);caustic.offset.set(Math.sin(now*.0002)*.08,now*.00003);
const d=span(p,DROP_START,IMPACT_AT);drop.visible=p>DROP_START&&p<IMPACT_AT;drop.position.set(IMPACT.x,1.75-1.12*d*d,IMPACT.z);drop.scale.set(1,1+d*.5,1);
const st=span(p,IMPACT_AT,ENTRY+.02);for(let i=0;i<PLUME;i++){const [a,r,dz,w]=plumeSeed[i],rr=(.02+r*r*.28)*Math.sqrt(st)*(1+Math.sin(now*.001+w*6)*.1),aa=a+st*(1.5+w*2);plumePos[i*3]=IMPACT.x+Math.cos(aa)*rr;plumePos[i*3+1]=.58-st*(.06+dz*.22)-r*.03;plumePos[i*3+2]=IMPACT.z+Math.sin(aa)*rr;}plumeGeo.attributes.position.needsUpdate=true;plume.material.opacity=p>IMPACT_AT?.9:0;plume.material.size=.05+st*.22;}

// ── Crossing the surface: refraction through an SVG displacement filter on the canvas ──
document.body.insertAdjacentHTML('beforeend','<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="agua" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence id="agua-n" type="fractalNoise" baseFrequency=".006 .018" numOctaves="2" seed="4"/><feDisplacementMap id="agua-d" in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></svg>');
const aguaN=document.querySelector('#agua-n'),aguaD=document.querySelector('#agua-d');let filterOn=false;
function updateCrossing(p,time){const k=S(p,ENTRY-.025,ENTRY)*(1-S(p,ENTRY,ENTRY+.07));const sc=k*90;if(sc>.5){aguaD.setAttribute('scale',sc.toFixed(1));aguaN.setAttribute('baseFrequency',`${(.006+Math.sin(time*1.3)*.0015).toFixed(4)} ${(.018+Math.cos(time)*.003).toFixed(4)}`);if(!filterOn){renderer.domElement.style.filter='url(#agua)';renderer.domElement.style.transform='scale(1.08)';filterOn=true;}}else if(filterOn){renderer.domElement.style.filter='';renderer.domElement.style.transform='';filterOn=false;}}

// ── Arrival: the first slide of the presentation, typeset as in escena.css ──
const arrival=document.querySelector('#arrival');const parts=arrival?[...arrival.querySelectorAll('[data-in]')]:[];
const PRESENTATION=new URLSearchParams(location.search).get('destino')||'../../dist/index.html#portada/1';
function updateArrival(p){if(!arrival)return;const a=span(p,ARRIVE,ARRIVE+.035);arrival.style.opacity=String(ease(a));arrival.style.visibility=a>0?'visible':'hidden';
for(const el of parts){const [s0,s1]=el.dataset.in.split(',').map(Number),k=ease(span(p,s0,s1));el.style.opacity=String(k);el.style.transform=k<1?`translateY(${((1-k)*1.2).toFixed(3)}cqh)`:'';el.style.filter=k<1?`blur(${((1-k)*6).toFixed(2)}px)`:'';}
document.body.classList.toggle('at-end',p>ARRIVE);}

const play=document.querySelector('#play'),free=document.querySelector('#free'),bar=document.querySelector('#progress'),stage=document.querySelector('#stage'),hint=document.querySelector('#hint');let progress=0,playing=false,freeMode=false,clock=0;
const HINT=`Recorrido de ${DURATION} segundos · arrastra la barra para explorar · → avanza`;
function setTour(p){progress=clamp(p,0,1);bar.value=progress;document.body.style.setProperty('--cover-opacity',String(1-S(progress,0,COVER_END)));const cover=document.querySelector('.cover');if(cover)cover.inert=progress>COVER_END;
stage.textContent=progress<WALK_END?'El claustro':progress<IMPACT_AT?'La fuente':progress<ENTRY+.03?'Atravesar el agua':progress<ARRIVE?(deepU(progress)<.3?'Bajo el agua':deepU(progress)<.62?'El mundo de la herida':'Cicatrizar'):'Primera diapositiva';}
play.onclick=()=>{freeMode=false;controls.enabled=false;if(progress>=1)setTour(0);playing=!playing;play.textContent=playing?'Pausar':'Continuar recorrido';hint.textContent=HINT;};
free.onclick=()=>{playing=false;freeMode=true;controls.enabled=true;active=scene;camera.fov=48;camera.updateProjectionMatrix();if(progress>WALK_END)camera.position.set(4,3,5);controls.target.set(0,1.4,0);controls.update();setTour(0);play.textContent='Iniciar recorrido';stage.textContent='Cámara libre';hint.textContent='Arrastra para girar · rueda para acercarte · botón derecho para desplazar';};
document.querySelector('#reset').onclick=()=>{playing=false;freeMode=false;controls.enabled=false;setTour(0);play.textContent='Iniciar recorrido';hint.textContent=HINT;};
bar.oninput=()=>{playing=false;freeMode=false;controls.enabled=false;setTour(Number(bar.value));play.textContent='Continuar recorrido';};
// A presenter's clicker sends → / PageDown / Space: start the dive, and at the end hand over to the presentation.
addEventListener('keydown',e=>{if(!['ArrowRight','PageDown',' ','Enter'].includes(e.key)||e.target===bar)return;e.preventDefault();if(progress>=1)location.href=PRESENTATION;else if(!playing)play.click();});
arrival?.addEventListener('click',()=>{if(progress>=1)location.href=PRESENTATION;});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();const el=document.querySelector('#error');el.style.display='block';el.textContent='La vista 3D se ha interrumpido. Recarga la página para recuperarla.';});
const still=matchMedia('(prefers-reduced-motion: reduce)').matches,autoHandOver=new URLSearchParams(location.search).has('presentar');
setTour(0);hint.textContent=HINT;let last=performance.now(),handOver=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;clock+=dt;
if(playing){setTour(progress+dt/DURATION);if(progress>=1){playing=false;play.textContent='Repetir recorrido';if(autoHandOver)handOver=now+1500;}}
if(handOver&&now>handOver)location.href=PRESENTATION;
if(freeMode){controls.update();active=scene;}
else{active=placeCamera(progress,clock);
 // While the cover waits, the camera breathes very slightly so the cloister reads as a place, not a still.
 if(progress===0&&!still){camera.position.x+=Math.sin(now*.00013)*.45;camera.position.y+=Math.sin(now*.00019)*.08;camera.lookAt(lookPath.getPoint(0));}
 camera.updateProjectionMatrix();}
if(active===scene){updateWater(freeMode?0:progress,now);for(let i=0;i<falls.length;i++)falls[i].scale.x=falls[i].scale.z=1+Math.sin(now*.02+i*1.7)*.25;}
else updateDeep(deepU(progress),clock);
updateCrossing(freeMode?0:progress,clock);updateArrival(freeMode?0:progress);
renderer.render(active,camera);}
requestAnimationFrame(frame);

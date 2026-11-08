// Adaptador del recorrido: utiliza la arquitectura original, sin el antiguo túnel de cicatrización.
// El tiempo se mide por reloj monotónico: la inmersión dura 4600 ms, aunque caiga la frecuencia de cuadros.
scene.background=sky;
// La misma Úrsula líquida, sin rostro, proyectada desde su posición en el espacio 3D.
const woundGuide=document.querySelector('#wound-guide');
Presence.mount([woundGuide]);
leadGuidePlaceholder();
function leadGuidePlaceholder(){woundGuide.style.visibility='hidden';}
stone.bumpScale=.22;carved.bumpScale=.12;marble.roughness=.25;
// Sustituir los cilindros rígidos por hilos curvos y gotas en caída real.
falls.forEach(o=>o.visible=false);
const flowingWater=new THREE.Group();scene.add(flowingWater);
const streamTexture=canvasTex(64,(c,n)=>{const g=c.createLinearGradient(0,0,n,0);g.addColorStop(0,'#ffffff00');g.addColorStop(.45,'#dfffffbb');g.addColorStop(.6,'#ffffffee');g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.fillRect(0,0,n,n);},false);
const cascadeMat=new THREE.MeshPhysicalMaterial({color:'#d6efe9',map:streamTexture,transparent:true,opacity:.6,roughness:.08,clearcoat:1,depthWrite:false,side:THREE.DoubleSide});
for(const [n,r,top,bottom] of [[12,.77,2.0,.65],[10,.5,2.79,2.01]])for(let i=0;i<n;i++){
 const a=i/n*Math.PI*2+.2,points=[];
 for(let j=0;j<=12;j++){const u=j/12,rr=r+.13*u;points.push(new THREE.Vector3(Math.cos(a)*rr,THREE.MathUtils.lerp(top,bottom,u*u),Math.sin(a)*rr));}
 const thread=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),20,.012,5,false),cascadeMat);flowingWater.add(thread);
}
const sprayGeometry=new THREE.BufferGeometry(),sprayData=new Float32Array(180*3);sprayGeometry.setAttribute('position',new THREE.BufferAttribute(sprayData,3));
const sprayTex=canvasTex(32,(c,n)=>{const g=c.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);g.addColorStop(0,'#ffffff');g.addColorStop(.45,'#dbffffbb');g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.fillRect(0,0,n,n);},false);
const spray=new THREE.Points(sprayGeometry,new THREE.PointsMaterial({color:'#e5fff9',size:.035,map:sprayTex,transparent:true,opacity:.7,depthWrite:false}));flowingWater.add(spray);
function animateFountain(t){streamTexture.offset.y=-t*.65;for(let i=0;i<180;i++){const upper=i%2,top=upper?2.79:2.0,bottom=upper?2.01:.65,r=upper?.5:.77,u=(t*(upper?.9:.65)+i*.618)%1,a=i*2.399;const rr=r+.13*u;sprayData[i*3]=Math.cos(a)*rr;sprayData[i*3+1]=top-(top-bottom)*u*u;sprayData[i*3+2]=Math.sin(a)*rr;}sprayGeometry.attributes.position.needsUpdate=true;}
function projectWound(stretch=1){
 if(!lead.visible){leadGuidePlaceholder();return;}
 const p=lead.position.clone().project(camera),depth=-lead.position.clone().applyMatrix4(camera.matrixWorldInverse).z;
 const size=.18*lead.scale.x*2.8*innerHeight/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*Math.max(.15,depth));
 woundGuide.style.visibility='visible';woundGuide.style.left=((p.x+1)*innerWidth/2)+'px';woundGuide.style.top=((-p.y+1)*innerHeight/2)+'px';woundGuide.style.width=size+'px';woundGuide.style.height=size+'px';woundGuide.style.transform=`translate(-50%,-50%) scale(${1/Math.sqrt(stretch)},${stretch})`;
}
const DIVE_MS=4600,clamp01=t=>THREE.MathUtils.clamp(t,0,1),smooth=t=>{t=clamp01(t);return t*t*(3-2*t);};
const diveWorld=new THREE.Scene();diveWorld.background=new THREE.Color('#5f9f97');diveWorld.fog=new THREE.FogExp2('#5f9f97',.13);
diveWorld.environment=scene.environment;diveWorld.add(new THREE.HemisphereLight('#fff2df','#733e49',2.4));
const diveLight=new THREE.PointLight('#ffe4cf',5,18);diveWorld.add(diveLight);
const leadGeometry=new THREE.SphereGeometry(.18,32,24),leadBase=leadGeometry.attributes.position.array.slice();
const lead=new THREE.Mesh(leadGeometry,new THREE.MeshPhysicalMaterial({color:'#c6323e',roughness:.14,metalness:.02,clearcoat:1,clearcoatRoughness:.08,transparent:true,opacity:0,depthWrite:false,envMapIntensity:1.4}));
lead.position.set(1.0,2.2,.45);lead.visible=false;scene.add(lead);
const wake=new THREE.Mesh(new THREE.RingGeometry(.18,.205,64),new THREE.MeshBasicMaterial({color:'#ffebd4',transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));wake.rotation.x=-Math.PI/2;wake.position.set(1.0,.641,.45);scene.add(wake);
const descent=new THREE.CatmullRomCurve3([[1.0,-.5,.45],[1.1,-3,-1],[.3,-8,-6],[-.5,-11,-16],[0,-12,-26]].map(p=>new THREE.Vector3(...p)),false,'catmullrom',.4);
const palette=['#c68b72','#e9b696','#d4c570','#aa8b9d','#a1ae96'];
function moteTexture(shape){return canvasTex(64,(ctx,s)=>{ctx.clearRect(0,0,s,s);ctx.fillStyle='#fff';ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.beginPath();if(shape===2){ctx.arc(s/2,s/2,19,0,Math.PI*2);ctx.stroke();}else{ctx.ellipse(s/2,s/2,shape?10:18,20,shape?.4:0,0,Math.PI*2);ctx.fill();}},false);}
const motes=[];
for(let layer=0;layer<3;layer++){
 const positions=[],colors=[];for(let i=0;i<190;i++){const p=descent.getPointAt(rand());positions.push(p.x+(rand()-.5)*10,p.y+(rand()-.5)*8,p.z+(rand()-.5)*8);const c=new THREE.Color(palette[i%palette.length]);colors.push(c.r,c.g,c.b);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
 const material=new THREE.PointsMaterial({size:[.04,.08,.14][layer],map:moteTexture(layer),vertexColors:true,transparent:true,opacity:.7,depthWrite:false,fog:true});const points=new THREE.Points(geo,material);diveWorld.add(points);motes.push(points);
}
const mistGeometry=new THREE.BufferGeometry(),mistPositions=[],mistColors=[];
for(let i=0;i<110;i++){const p=descent.getPointAt(rand());mistPositions.push(p.x+(rand()-.5)*6,p.y+(rand()-.5)*6,p.z+(rand()-.5)*6);const c=new THREE.Color(palette[i%palette.length]);mistColors.push(c.r,c.g,c.b);}
mistGeometry.setAttribute('position',new THREE.Float32BufferAttribute(mistPositions,3));mistGeometry.setAttribute('color',new THREE.Float32BufferAttribute(mistColors,3));
const mistTex=canvasTex(64,(ctx,s)=>{const g=ctx.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#ffffff00');ctx.fillStyle=g;ctx.fillRect(0,0,s,s);},false);
const mist=new THREE.Points(mistGeometry,new THREE.PointsMaterial({size:3,map:mistTex,vertexColors:true,transparent:true,opacity:.1,depthWrite:false}));diveWorld.add(mist);
document.body.insertAdjacentHTML('beforeend','<svg width="0" height="0" aria-hidden="true" style="position:absolute"><filter id="immersion-water" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency=".008 .016" numOctaves="2" seed="4"/><feDisplacementMap id="immersion-displace" in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></svg>');
const displacement=document.querySelector('#immersion-displace'),startCamera=new THREE.Vector3(0,2.15,11),targetLook=new THREE.Vector3(0,2.8,-5),diveCamera=new THREE.Vector3(),lookStart=new THREE.Quaternion(),lookEnd=new THREE.Quaternion();
const lessMotion=matchMedia('(prefers-reduced-motion: reduce)');
let sceneMode='cover',paused=false,orbitStart=0,orbitAngle=0,orbitFrom=0,diveStart=0,lastProgress=-1,arrived=false,frameTime=performance.now(),clockTime=0;
function send(type,extra={}){parent.postMessage({cloister:type,...extra},location.origin);}
function setMode(value){sceneMode=value;document.body.dataset.mode=value;}
function orbitCamera(angle){camera.position.set(Math.sin(angle)*11,2.15+Math.sin(angle)*.1,Math.cos(angle)*11);camera.lookAt(targetLook);camera.fov=40;}
orbitCamera(0);
function reset(){leadGuidePlaceholder();Presence.mount([woundGuide]);setMode('cover');paused=false;orbitAngle=0;lead.visible=false;lead.scale.setScalar(1);leadGeometry.attributes.position.copyArray(leadBase);leadGeometry.attributes.position.needsUpdate=true;leadGeometry.computeVertexNormals();wake.material.opacity=0;renderer.domElement.style.filter='';renderer.domElement.style.transform='';orbitCamera(0);}
function startDive(){
 if(sceneMode==='dive')return;diveStart=performance.now();diveCamera.copy(camera.position);lookStart.copy(camera.quaternion);arrived=false;lastProgress=-1;lead.visible=true;scene.add(lead);setMode('dive');paused=false;
 Presence.mount([woundGuide]);send('dive-start',{duration:DIVE_MS});
}
function drawDive(p,now){
 const underwater=p>=.5,u=clamp01((p-.5)/.5);animateFountain(clockTime);
 if(!underwater){
  // Ganar altura antes de acercarse al borde; bajar verticalmente dentro del vaso.
  const descend=smooth((p-.22)/.28);
  lead.position.set(1.0,THREE.MathUtils.lerp(2.2,-.5,descend),.45);
  if(p<.22){const t=smooth(p/.22),overhead=new THREE.Vector3(1,3.2,.55),control=new THREE.Vector3(diveCamera.x*.4,5.5,4.5);camera.position.copy(diveCamera).multiplyScalar((1-t)*(1-t)).addScaledVector(control,2*(1-t)*t).addScaledVector(overhead,t*t);}
  else camera.position.set(1,THREE.MathUtils.lerp(3.2,.42,descend),.55);
  camera.lookAt(lead.position);lookEnd.copy(camera.quaternion);camera.quaternion.copy(lookStart).slerp(lookEnd,smooth(p/.22));
  document.body.dataset.entryHeight=camera.position.y.toFixed(3);document.body.dataset.entryX=camera.position.x.toFixed(3);document.body.dataset.entryZ=camera.position.z.toFixed(3);
 }else{
  if(lead.parent!==diveWorld)diveWorld.add(lead);
  lead.position.copy(descent.getPointAt(smooth(u)));camera.position.copy(lead.position).add(new THREE.Vector3(Math.sin(u*Math.PI)*.12,THREE.MathUtils.lerp(.92,.18,smooth(u)),THREE.MathUtils.lerp(.1,1.7,smooth(u))));camera.lookAt(lead.position);
  const stops=[[0,'#5f9f97'],[.25,'#6f575a'],[.5,'#bb837d'],[.8,'#ead3c5'],[1,'#f6f0e8']];let i=1;while(i<stops.length-1&&u>stops[i][0])i++;const [a,ca]=stops[i-1],[b,cb]=stops[i];diveWorld.background.set(ca).lerp(new THREE.Color(cb),smooth((u-a)/(b-a)));diveWorld.fog.color.copy(diveWorld.background);diveWorld.fog.density=.12+.15*Math.sin(u*Math.PI);
  mist.material.opacity=.06+.13*Math.sin(u*Math.PI);motes.forEach((m,j)=>{m.rotation.y=Math.sin(clockTime*.1+j)*.012;m.material.opacity=.55+.12*Math.sin(clockTime+j);});diveLight.position.copy(camera.position);
 }
 const settle=smooth((p-.65)/.35),r=THREE.MathUtils.lerp(1,1.6,settle);
 lead.scale.setScalar(r);
 const splash=Math.max(0,1-Math.abs((p-.475)/.075));displacement.setAttribute('scale',String(splash*65));renderer.domElement.style.filter=splash>.01?'url(#immersion-water)':'';renderer.domElement.style.transform=splash>.01?`scale(${1+splash*.035})`:'';camera.fov=THREE.MathUtils.lerp(40,55,smooth(p/.32))+splash*5;camera.updateProjectionMatrix();
 const ring=clamp01((p-.37)/.15);wake.scale.setScalar(1+ring*2);wake.material.opacity=(1-ring)*Math.sin(ring*Math.PI)*.8;
 renderer.render(underwater?diveWorld:scene,camera);projectWound(1+Math.sin(p*Math.PI)*.3);
 if(now-lastProgress>40||p===1){lastProgress=now;send('progress',{progress:p,elapsed:now-diveStart,splash});}
 if(p>=1&&!arrived){arrived=true;setMode('arrived');send('arrived',{elapsed:now-diveStart});}
}
addEventListener('message',e=>{
 if(e.origin!==location.origin||e.source!==parent)return;const action=e.data?.cloister;
 if(action==='pause'){paused=true;Presence.stop();}
 else if(action==='reset'||action==='cover')reset();
 else if(action==='panels'){Presence.mount([woundGuide]);paused=false;orbitFrom=orbitAngle;orbitStart=performance.now();setMode('panels');lead.visible=true;scene.add(lead);}
 else if(action==='dive'||action==='play')startDive();
});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
function liveFrame(now){requestAnimationFrame(liveFrame);if(document.hidden||paused)return;if(!lessMotion.matches)clockTime+=Math.min((now-frameTime)/1000,.05);frameTime=now;
 if(sceneMode==='dive'){camera.aspect=innerWidth/innerHeight;drawDive(clamp01((now-diveStart)/DIVE_MS),now);camera.updateProjectionMatrix();return;}
 if(sceneMode==='arrived')return;
 if(sceneMode==='panels'){const elapsed=(now-orbitStart)/1000;orbitAngle=lessMotion.matches?-.28:THREE.MathUtils.lerp(orbitFrom,-.28,smooth(elapsed/1.8))+.10*Math.sin(Math.max(0,elapsed-1.8)*.16);lead.position.set(1,2.2+Math.sin(clockTime)*.07,.45);}
 orbitCamera(orbitAngle);camera.updateProjectionMatrix();
 const waveTime=lessMotion.matches?0:now;const position=water.geometry.attributes.position;for(let i=0;i<position.count;i++){const x=position.getX(i),y=position.getY(i);position.setZ(i,Math.sin(x*7+waveTime*.0014)*Math.cos(y*6+waveTime*.001)*.01);}position.needsUpdate=true;rippleNormal.offset.set(waveTime*.000018,waveTime*.000011);caustic.offset.set(0,waveTime*.00003);animateFountain(clockTime);renderer.render(scene,camera);projectWound();
}
requestAnimationFrame(liveFrame);send('ready');

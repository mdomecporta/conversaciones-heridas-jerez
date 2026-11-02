// El carro de curas en 3D, tal como se ve en la presentación (carro/index.html lo monta en un iframe).
// Procede del prototipo prototipos/carro-3d.html: el modelo (estructura, objetos y modelos descargados)
// se mejora aquí; la presentación solo le pide qué mirar con postMessage: {carro:{ids:[...], vista:'carro'}}.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

// Medidas en metros, tomadas a ojo de la foto del carro del centro de salud:
// dos bandejas embutidas, asa lateral continua y soporte lateral de varilla.
const ANCHO=.74, FONDO=.44, ALTO_SUP=.80, ALTO_INF=.30, R_TUBO=.0115;
const PAPEL=new THREE.Color(0xf6f0e8),CORAL=new THREE.Color(0xe46a5a);

const canvas=document.getElementById('escena');
// ?transparente: sin papel de fondo, para fundirse con la diapositiva que lo contiene (lo pide la presentación).
const parametros=new URLSearchParams(location.search);
const TRANSPARENTE=parametros.has('transparente');
// Vista de revisión de una pieza; la presentación sigue usando la API habitual.
const PRODUCTO=parametros.get('producto');
if(TRANSPARENTE)document.documentElement.classList.add('transparente');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:TRANSPARENTE});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
renderer.toneMapping=THREE.NeutralToneMapping;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;

const scene=new THREE.Scene();
scene.background=TRANSPARENTE?null:PAPEL.clone();
scene.environment=new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(),.04).texture;
scene.environmentIntensity=.85;

const camera=new THREE.PerspectiveCamera(26,1,.05,20);
const mira=new THREE.Vector3(); // punto al que mira la cámara

// Oclusión ambiental: oscurece donde las piezas se tocan, para que nada parezca flotar.
const composer=new EffectComposer(renderer);
// El suavizado del lienzo no llega a los destinos del compositor: MSAA también en ellos.
composer.renderTarget1.samples=4;composer.renderTarget2.samples=4;
composer.addPass(new RenderPass(scene,camera));
const ao=new GTAOPass(scene,camera,innerWidth,innerHeight);
// Espesor en metros: solo oclusión entre superficies próximas, no entre bandejas y suelo.
ao.updateGtaoMaterial({radius:.035,distanceExponent:1.5,thickness:.06,scale:1,samples:16});
ao.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:6,rings:2,samples:16});
ao.blendIntensity=.7;
composer.addPass(ao);
composer.addPass(new OutputPass());

// Luz cálida de consulta: una principal con sombra suave y un relleno desde el otro lado.
scene.add(new THREE.HemisphereLight(0xfff6ec,0xd9cdc5,.9));
const sol=new THREE.DirectionalLight(0xfff1e2,1.5);
sol.position.set(-.65,3.8,1.1);sol.target.position.set(0,.45,0);scene.add(sol.target);sol.castShadow=true;
sol.shadow.mapSize.set(2048,2048);sol.shadow.bias=-.0003;sol.shadow.normalBias=.002;
// El volumen incluye el carro y toda su sombra, con margen alrededor de las ruedas.
Object.assign(sol.shadow.camera,{left:-1,right:1,top:1,bottom:-1,near:.5,far:6});
scene.add(sol);
const relleno=new THREE.DirectionalLight(0xffe9dc,.45);relleno.position.set(-2,1.2,-.6);scene.add(relleno);

// Solo la sombra sobre el papel: sin suelo ni horizonte.
const sombra=new THREE.Mesh(new THREE.PlaneGeometry(6,6),new THREE.ShadowMaterial({color:0x554842,opacity:.10}));
sombra.rotation.x=-Math.PI/2;sombra.receiveShadow=true;scene.add(sombra);

// ---- Texturas dibujadas: acero cepillado, trama de gasa, sellado de sobre, rejilla y etiquetas sin marca ----
function lienzo(w,h,dibujar,repetir){
 const c=document.createElement('canvas');c.width=w;c.height=h;dibujar(c.getContext('2d'),w,h);
 const t=new THREE.CanvasTexture(c);t.anisotropy=8;
 if(repetir){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(...repetir);}
 return t;
}
const CEPILLADO=lienzo(512,512,(x,w,h)=>{x.fillStyle='#c8c8c8';x.fillRect(0,0,w,h);
 for(let i=0;i<2600;i++){const y=Math.random()*h,v=170+Math.random()*85|0;x.strokeStyle=`rgba(${v},${v},${v},.35)`;x.lineWidth=Math.random()*1.4+.3;
  x.beginPath();const a=Math.random()*w;x.moveTo(a,y);x.lineTo(a+60+Math.random()*260,y+Math.random()*.6);x.stroke();}},[2,2]);
const TRAMA=lienzo(128,128,(x,w,h)=>{x.fillStyle='#808080';x.fillRect(0,0,w,h);x.fillStyle='#d0d0d0';
 for(let i=0;i<w;i+=4){x.fillRect(i,0,2,h);x.fillRect(0,i,w,2);}},[6,6]);
const SELLADO=lienzo(64,16,(x,w,h)=>{x.fillStyle='#808080';x.fillRect(0,0,w,h);x.fillStyle='#e0e0e0';
 for(let i=0;i<w;i+=4)x.fillRect(i,0,2,h);},[24,24]);
function etiqueta(color,lineas=3){return lienzo(256,128,(x,w,h)=>{x.fillStyle='#fbf8f3';x.fillRect(0,0,w,h);
 x.fillStyle=color;x.fillRect(0,0,w,34);x.fillStyle='rgba(48,43,42,.35)';
 for(let i=0;i<lineas;i++)x.fillRect(18,52+i*20,i==lineas-1?w*.4:w*.72,8);});}
const ET={azul:etiqueta('#6f93b5'),verde:etiqueta('#7fae9e'),coral:etiqueta('#e46a5a',2),plata:etiqueta('#a9acb0',2),ocre:etiqueta('#d4c570')};
// Rotulación genérica: las marcas de la fotografía no son legibles. No se atribuye un producto concreto.
function etiquetaProducto(titulo,detalle,color='#6f93b5'){
 const t=lienzo(512,256,(x,w,h)=>{
  x.fillStyle='#fbf8f3';x.fillRect(0,0,w,h);x.fillStyle=color;x.fillRect(0,0,22,h);
  x.fillRect(38,30,w-65,12);x.fillStyle='#302b2a';x.font='600 38px Arial';x.fillText(titulo,40,108);
  x.font='24px Arial';x.fillText(detalle,40,151);x.fillStyle=color;x.fillRect(40,176,200,5);
  x.fillStyle='#a9acb0';for(let i=0;i<3;i++)x.fillRect(40,198+i*12,250-i*25,3);
  for(let i=0;i<38;i++)x.fillRect(358+i*3,185,i%3===0?2:1,48);
 });t.colorSpace=THREE.SRGBColorSpace;return t;
}
const ENVASES={guantes:etiquetaProducto('GUANTES','EXAMEN · 100 uds'),
 guantesVerdes:etiquetaProducto('GUANTES','EXAMEN · 100 uds','#7fae9e'),
 gasas:etiquetaProducto('COMPRESAS','10 × 10 cm · ESTÉRIL','#7fae9e'),
 sobres:etiquetaProducto('APÓSITOS','MATERIAL DE CURA','#7fae9e'),
 suero:etiquetaProducto('SUERO','FISIOLÓGICO'),solucion:etiquetaProducto('SOLUCIÓN','USO EXTERNO','#7fae9e')};
const REFERENCIAS={flex:etiquetaProducto('Mepilex Border Flex','10 × 10 cm · REFERENCIA VISUAL','#7fae9e'),
 ag:etiquetaProducto('Mepilex Ag','10 × 10 cm · ESPUMA CON PLATA','#7fae9e'),
 amies:etiquetaProducto('deltalab · AMIES','300287 · SIN CARBÓN')};
const FILM_FLEX=lienzo(512,512,(x,w,h)=>{
 x.fillStyle='#eadfcd';x.fillRect(0,0,w,h);x.strokeStyle='rgba(120,110,100,.12)';x.lineWidth=1;
 for(let i=32;i<w;i+=48)for(let j=32;j<h;j+=48){x.beginPath();x.moveTo(i-3,j);x.lineTo(i+3,j);x.moveTo(i,j-3);x.lineTo(i,j+3);x.stroke();}
});FILM_FLEX.colorSpace=THREE.SRGBColorSpace;
const AVISO_PUNZANTES=lienzo(512,512,(x,w,h)=>{
 x.fillStyle='#e8c341';x.fillRect(0,0,w,h);x.fillStyle='#302b2a';x.textAlign='center';
 x.font='700 28px Arial';x.fillText('RESIDUOS PUNZANTES',w/2,48);
 x.fillRect(25,65,w-50,5);x.font='700 52px Arial';x.fillText('10 L',w/2,128);
 x.save();x.translate(w/2,255);x.rotate(Math.PI/4);x.lineWidth=6;x.strokeRect(-70,-70,140,140);x.restore();
 x.font='100px Arial';x.fillText('☣',w/2,290);x.font='20px Arial';x.fillText('RIESGO BIOLÓGICO',w/2,395);
 x.font='18px Arial';x.fillText('NO SUPERAR EL NIVEL DE LLENADO',w/2,438);
});AVISO_PUNZANTES.colorSpace=THREE.SRGBColorSpace;

// ---- Materiales: acero pulido de la referencia y envases de consulta ----
const PAL={
 acero:{color:0xd2ccc6,metalness:1,roughness:.26,roughnessMap:CEPILLADO,bumpMap:CEPILLADO,bumpScale:.00006},
 tubo:{color:0xd6d0ca,metalness:1,roughness:.16},
 rueda:{color:0x77736f,roughness:.72},
 horquilla:{color:0xd6d0ca,metalness:.9,roughness:.22},
 blanco:{color:0xf7f3ee,roughness:.6},
 papel:{color:0xfffdf6,roughness:.9},
 gasa:{color:0xf4f2ed,roughness:.95,bumpMap:TRAMA,bumpScale:.00035},
 sobre:{color:0xf6f3ee,roughness:.65,bumpMap:SELLADO,bumpScale:.00012},
 azulClaro:{color:0xd6e3ec,roughness:.6},
 azul:{color:0x6f93b5,roughness:.45},
 amarillo:{color:0xe8c341,roughness:.5},
 amarilloTapa:{color:0xd9ad2c,roughness:.45},
 beige:{color:0xeadfcd,roughness:.92,bumpMap:TRAMA,bumpScale:.0004},
 piel:{color:0xf0d2bf,roughness:.85,bumpMap:TRAMA,bumpScale:.0003},
 plata:{color:0xc9cbce,metalness:.65,roughness:.38,bumpMap:SELLADO,bumpScale:.0001},
 verdeAgua:{color:0xcfe3dc,roughness:.35},
 transparente:{color:0xf4f8fb,roughness:.12,transparent:true,opacity:.5,depthWrite:false},
 gel:{color:0xe9dcc0,roughness:.4},
 tinta:{color:0x302b2a,roughness:.6},
 goma:{color:0x5d5a57,roughness:.6},
 hoja:{color:0xd8d2c8,metalness:.95,roughness:.2},
 etiqueta:{color:0xffffff,roughness:.7},
};
function mat(nombre,extra){const m=new THREE.MeshStandardMaterial({...PAL[nombre],...extra});m.userData.base=m.color.clone();return m;}

function malla(geo,nombre,padre,pos=[0,0,0],rot=[0,0,0],extra){
 const m=new THREE.Mesh(geo,mat(nombre,extra));m.position.set(...pos);m.rotation.set(...rot);
 m.castShadow=true;m.receiveShadow=true;padre.add(m);return m;
}
function caja(padre,nombre,[w,h,d],pos,rot,r=.006){return malla(new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/2,h/2,d/2)),nombre,padre,pos,rot);}
function cilindro(padre,nombre,r,h,pos,rot,seg=32){return malla(new THREE.CylinderGeometry(r,r,h,seg),nombre,padre,pos,rot);}
// Pieza torneada a partir de su perfil [radio, altura], de abajo arriba.
function torno(padre,nombre,perfil,pos,rot,seg=48){return malla(new THREE.LatheGeometry(perfil.map(([r,y])=>new THREE.Vector2(r,y)),seg),nombre,padre,pos,rot);}
// Rollo con agujero central (venda, esparadrapo), con los cantos redondeados.
function rollo(padre,nombre,ri,ro,h,pos,rot){const c=.003;
 return torno(padre,nombre,[[ri,0],[ro-c,0],[ro,c],[ro,h-c],[ro-c,h],[ri,h],[ri,0]],pos,rot);}
function tubo(padre,a,b,r=R_TUBO,nombre='tubo'){
 const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),largo=A.distanceTo(B);
 const m=malla(new THREE.CylinderGeometry(r,r,largo,24),nombre,padre);
 m.position.copy(A).add(B).multiplyScalar(.5);
 m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),B.clone().sub(A).normalize());return m;
}
function rectanguloRedondo(w,h,r,cx=0,cy=0,Tipo=THREE.Shape){
 const s=new Tipo(),a=cx-w/2,b=cy-h/2;
 s.moveTo(a+r,b);s.lineTo(a+w-r,b);s.quadraticCurveTo(a+w,b,a+w,b+r);
 s.lineTo(a+w,b+h-r);s.quadraticCurveTo(a+w,b+h,a+w-r,b+h);
 s.lineTo(a+r,b+h);s.quadraticCurveTo(a,b+h,a,b+h-r);
 s.lineTo(a,b+r);s.quadraticCurveTo(a,b,a+r,b);return s;
}
// Esquinas de radio real incluso en láminas finas; una caja 3D las limita al espesor.
function lamina(padre,nombre,w,d,h,r,pos,extra){
 const geo=new THREE.ExtrudeGeometry(rectanguloRedondo(w,d,r),{depth:h,bevelEnabled:true,
  bevelThickness:.00015,bevelSize:.00015,bevelSegments:2,curveSegments:10,steps:1});
 const uv=geo.attributes.uv,p=geo.attributes.position;
 for(let i=0;i<uv.count;i++)uv.setXY(i,(p.getX(i)+w/2)/w,(p.getY(i)+d/2)/d);
 return malla(geo,nombre,padre,pos,[-Math.PI/2,0,0],extra);
}
// Cestas con agujeros reales y espesor: mantienen el volumen y la sombra al acercar la cámara.
function cestillo(padre,[w,h,d],nombre='blanco'){
 const g=new THREE.Group();padre.add(g);
 caja(g,nombre,[w,.003,d],[0,.0015,0],[0,0,0],.001);
 function pared(ancho,pos,rot){
  const s=rectanguloRedondo(ancho,h,.004),nx=Math.floor((ancho-.016)/.018),ny=Math.floor((h-.016)/.015);
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++)
   s.holes.push(rectanguloRedondo(.010,.006,.0015,(i-(nx-1)/2)*.018,(j-(ny-1)/2)*.015,THREE.Path));
  malla(new THREE.ExtrudeGeometry(s,{depth:.0015,bevelEnabled:false,curveSegments:3}),nombre,g,pos,rot);
 }
 for(const s of [-1,1]){
  pared(w,[0,h/2,s*d/2],[0,s<0?Math.PI:0,0]);
  pared(d,[s*w/2,h/2,0],[0,s*Math.PI/2,0]);
  caja(g,nombre,[w+.004,.005,.005],[0,h,s*d/2],[0,0,0],.002);
  caja(g,nombre,[.005,.005,d],[s*w/2,h,0],[0,0,0],.002);
 }
 return g;
}
// Etiqueta impresa pegada a una cara: un plano fino con la textura, sin texto legible ni marcas.
function rotulo(padre,tex,w,h,pos,rot){const m=malla(new THREE.PlaneGeometry(w,h),'etiqueta',padre,pos,rot,{map:tex});m.castShadow=false;return m;}
// Sobre estéril: borde sellado y plano, centro abombado y, si se pide, una etiqueta.
function sobre(padre,[w,d],pos,rot,{nombre='sobre',centro=nombre,tex,relieve=.007}={}){
 const g=new THREE.Group();g.position.set(...pos);g.rotation.set(...rot);padre.add(g);
 caja(g,nombre,[w,.0016,d],[0,.0008,0],[0,0,0],.0008);
 caja(g,centro,[w-.018,relieve,d-.018],[0,relieve/2+.0016,0],[0,0,0],Math.min(.0032,relieve/2));
 if(tex)rotulo(g,tex,(w-.03),(w-.03)*.5,[0,relieve+.0018,-(d-.03)/4],[-Math.PI/2,0,0]);
 return g;
}

// Cada objeto que la herida puede traer es un grupo con nombre; el resto es el carro.
const carro=new THREE.Group();scene.add(carro);
const objetos={};
function objeto(id){const g=new THREE.Group();g.userData.id=id;carro.add(g);objetos[id]=g;return g;}

// ---- Estructura ----
const ex=ANCHO/2,ez=FONDO/2,Y0=.108;
function rueda(x,z,freno){
 const g=new THREE.Group();g.position.set(x,0,z);carro.add(g);
 g.rotation.y=x<0?(z<0?-.3:.18):(z<0?.25:-.18);
 cilindro(g,'tubo',.022,.009,[0,Y0-.002,0]);                    // collarín del montante
 cilindro(g,'tubo',.012,.016,[0,Y0-.014,0]);                    // pivote de acero
 caja(g,'horquilla',[.044,.006,.03],[0,Y0-.024,.012],[0,0,0],.002); // puente de la horquilla
 for(const s of [-1,1])caja(g,'horquilla',[.004,.062,.034],[s*.02,Y0-.056,.02],[0,0,0],.0015);
 const r=new THREE.Group();r.position.set(0,.04,.024);r.rotation.z=Math.PI/2;g.add(r);
 torno(r,'rueda',[[.023,-.014],[.035,-.014],[.04,-.008],[.04,.008],[.035,.014],[.023,.014]],[0,0,0]);
 cilindro(r,'horquilla',.032,.024,[0,0,0]);cilindro(r,'tubo',.006,.044,[0,0,0]);
 // Tapas del eje y aros del cubo: separan la goma de la horquilla sin recargar la rueda.
 for(const s of [-1,1]){
  cilindro(r,'horquilla',.019,.002,[0,s*.013,0]);
  cilindro(r,'tubo',.007,.0025,[0,s*.023,0]);
 }
 if(freno)caja(g,'goma',[.026,.008,.03],[0,Y0-.03,-.028],[.35,0,0],.003);
}
for(const [x,z] of [[-ex,-ez],[ex,-ez],[-ex,ez],[ex,ez]]){
 tubo(carro,[x,Y0,z],[x,ALTO_SUP+.035,z]);
 if(x>0)torno(carro,'goma',[[0,0],[R_TUBO*1.08,0],[R_TUBO*1.1,.008],[R_TUBO*.9,.014],[0,.015]],[x,ALTO_SUP+.033,z]);
 for(const y of [ALTO_SUP,ALTO_INF])cilindro(carro,'tubo',R_TUBO*1.4,.03,[x,y+.006,z]); // abrazadera de la bandeja
 rueda(x,z,z>0);
}
function bandeja(y){
 const w=ANCHO-.006,d=FONDO-.006;
 // Fondo plano y transición cóncava a las paredes inclinadas de la chapa embutida.
 const fondo=new THREE.ExtrudeGeometry(rectanguloRedondo(w-.035,d-.035,.022),{depth:.004,bevelEnabled:false,curveSegments:8});
 malla(fondo,'acero',carro,[0,y-.002,0],[-Math.PI/2,0,0]);
 const perfiles=[[w-.035,d-.035,.022,0],[w-.025,d-.025,.025,.004],
  [w-.012,d-.012,.030,.025],[w-.004,d-.004,.034,.033],[w,d,.035,.035]];
 const puntos=perfiles.map(([a,b,r])=>rectanguloRedondo(a,b,r).getPoints(8)),n=puntos[0].length-1;
 const vertices=[],indices=[],uv=[];
 for(let j=0;j<perfiles.length;j++)for(let i=0;i<n;i++){
  vertices.push(puntos[j][i].x,perfiles[j][3],-puntos[j][i].y);uv.push(i/n,j/(perfiles.length-1));
 }
 for(let j=0;j<perfiles.length-1;j++)for(let i=0;i<n;i++){
  const a=j*n+i,b=j*n+(i+1)%n,c=(j+1)*n+i,d=(j+1)*n+(i+1)%n;
  indices.push(a,b,c,b,d,c);
 }
 const pared=new THREE.BufferGeometry();pared.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
 pared.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
 pared.setIndex(indices);pared.computeVertexNormals();
 malla(pared,'acero',carro,[0,y,0],[0,0,0],{side:THREE.DoubleSide});
 // Labio enrollado continuo, con esquinas suaves, y aro de apoyo bajo la bandeja.
 for(const [ancho,fondo,radio,alto,grosor] of [[w,d,.035,y+.035,.003],[w-.008,d-.008,.03,y-.008,.006]]){
  const contorno=rectanguloRedondo(ancho,fondo,radio).getPoints(12);
  const curva=new THREE.CurvePath();
  for(let i=0;i<contorno.length-1;i++){
   const a=contorno[i],b=contorno[i+1];
   curva.add(new THREE.LineCurve3(new THREE.Vector3(a.x,alto,-a.y),new THREE.Vector3(b.x,alto,-b.y)));
  }
  malla(new THREE.TubeGeometry(curva,160,grosor,8,true),'tubo',carro);
 }
 // Soportes bajo la chapa, soldados a los montantes.
 for(const z of [-ez+.025,ez-.025])tubo(carro,[-ex,y-.014,z],[ex,y-.014,z],.008);
}
bandeja(ALTO_SUP);bandeja(ALTO_INF);

// Asa de empuje doblada de una sola pieza, en el lado izquierdo de la fotografía.
{const x=-ex,r=.035,y=ALTO_SUP+.10,p=new THREE.CurvePath(),v=(a,b)=>new THREE.Vector3(x,a,b);
 p.add(new THREE.LineCurve3(v(ALTO_SUP+.035,-ez),v(y-r,-ez)));
 p.add(new THREE.QuadraticBezierCurve3(v(y-r,-ez),v(y,-ez),v(y,-ez+r)));
 p.add(new THREE.LineCurve3(v(y,-ez+r),v(y,ez-r)));
 p.add(new THREE.QuadraticBezierCurve3(v(y,ez-r),v(y,ez),v(y-r,ez)));
 p.add(new THREE.LineCurve3(v(y-r,ez),v(ALTO_SUP+.035,ez)));
 malla(new THREE.TubeGeometry(p,48,R_TUBO,16,false),'tubo',carro);
}

// Soporte de varilla del carro vacío: prolonga la barandilla frontal hacia el lado derecho.
{const y=ALTO_SUP-.045,z=ez+.018,x=ex+.24,r=.04,p=new THREE.CurvePath();
 const v=(a,b)=>new THREE.Vector3(a,y,b);
 p.add(new THREE.LineCurve3(v(-ex-.012,z),v(x-r,z)));
 p.add(new THREE.QuadraticBezierCurve3(v(x-r,z),v(x,z),v(x,z-r)));
 p.add(new THREE.LineCurve3(v(x,z-r),v(x,-z+r)));
 p.add(new THREE.QuadraticBezierCurve3(v(x,-z+r),v(x,-z),v(x-r,-z)));
 p.add(new THREE.LineCurve3(v(x-r,-z),v(ex,-z)));
 malla(new THREE.TubeGeometry(p,80,.009,12,false),'tubo',carro);
 for(const x of [ex+.065,ex+.17]){
  const a=[x,y,-z+.012],b=[x,y-.075,-z+.065],c=[x,y-.075,z-.065],d=[x,y,z-.012];
  tubo(carro,a,b,.0035);tubo(carro,b,c,.0035);tubo(carro,c,d,.0035);
 }
}

// Cesta blanca de rejilla colgada en el lateral derecho, con rollos de esparadrapo.
const cesta=cestillo(carro,[.10,.065,.26]);cesta.position.set(ex+.06,ALTO_SUP-.065,.015);
for(const s of [-1,1]){
 caja(cesta,'blanco',[.018,.035,.012],[-.054,.065,s*.085],[0,0,0],.003);
 caja(cesta,'blanco',[.035,.008,.012],[-.064,.08,s*.085],[0,0,0],.003);
}
for(let i=0;i<4;i++){
 const z=-.091+i*.060;
 rollo(cesta,'papel',.013,.026,.025,[-.012,.029,z],[0,0,Math.PI/2]);
 rollo(cesta,'beige',.010,.013,.026,[.001,.029,z],[0,0,Math.PI/2]);
}

// ---- Bandeja superior ----
const YS=ALTO_SUP+.004;
// Contenedor de 10 L: cuerpo troncopiramidal, tapa amarilla y boca abatible, como en la foto.
const contenedor=new THREE.Group();carro.add(contenedor);contenedor.position.set(-.232,YS,-.10);
{const g=new THREE.Group();contenedor.add(g);
 const cuerpo=caja(g,'amarillo',[.225,.255,.205],[0,.1275,0],[0,0,0],.018);
 const a=cuerpo.geometry.attributes.position;
 for(let i=0;i<a.count;i++){
  const f=.90+.10*(a.getY(i)/.255+.5);a.setX(i,a.getX(i)*f);a.setZ(i,a.getZ(i)*f);
 }a.needsUpdate=true;cuerpo.geometry.computeVertexNormals();
 caja(g,'amarillo',[.232,.024,.212],[0,.254,0],[0,0,0],.01);
 caja(g,'amarillo',[.236,.013,.216],[0,.272,0],[0,0,0],.006);
 caja(g,'amarilloTapa',[.122,.004,.074],[.01,.280,-.012],[0,0,0],.002);
 caja(g,'amarilloTapa',[.047,.005,.006],[.01,.284,.023],[0,0,0],.002);
 for(const x of [-.053,.073])cilindro(g,'amarilloTapa',.003,.014,[x,.281,-.05],[0,0,Math.PI/2]);
 for(const s of [-1,1])caja(g,'amarilloTapa',[.008,.016,.065],[s*.116,.234,0],[0,0,0],.003);
 // La cara está ligeramente inclinada; la etiqueta sigue su pendiente.
 rotulo(g,AVISO_PUNZANTES,.135,.155,[0,.135,.098],[-.04,0,0]);
 for(let i=0;i<15;i++)caja(g,'tinta',[.009,.001,.0006],[-.095+i*.0135,.229,.103],[0,0,0],.0002);
}

// Gasas: sobres apilados, cada uno con la gasa doblada dentro (escena 15).
{const g=objeto('gasas');g.position.set(-.015,YS,-.105);
 for(let i=0;i<9;i++)sobre(g,[.13,.105],[(i%2)*.003,.0005+i*.0085,(i%3)*.002],[0,(i%2?.025:-.02),0],{centro:'gasa',tex:i===8?ENVASES.gasas:null});
 for(let i=0;i<6;i++)sobre(g,[.105,.10],[.125,.0005+i*.0085,.002],[0,(i%2?-.03:.02),0],{centro:'gasa',tex:i===5?ENVASES.gasas:null});}

// Suero fisiológico: frasco con hombro y tapón estriado, y una tira de monodosis (escena 15).
{const g=objeto('suero');g.position.set(.215,YS,-.12);
 torno(g,'blanco',[[0,0],[.031,0],[.034,.004],[.034,.112],[.031,.128],[.02,.142],[.012,.148],[.012,.16],[0,.16]],[0,0,0]);
 torno(g,'azul',[[0,0],[.0135,0],[.0135,.022],[.011,.025],[0,.025]],[0,.158,0]);
 for(let i=0;i<18;i++){const a=i/18*Math.PI*2;caja(g,'azul',[.0025,.018,.003],[Math.cos(a)*.0136,.169,Math.sin(a)*.0136],[0,-a,0],.0008);}
 rotulo(g,ENVASES.suero,.049,.047,[0,.065,.0342],[0,0,0]);
 for(let i=0;i<4;i++){const x=-.065+i*.022;
  caja(g,'transparente',[.018,.06,.011],[x,.03,.085],[0,0,0],.0052);
  cilindro(g,'transparente',.0035,.008,[x,.064,.085]);
  caja(g,'transparente',[.014,.012,.003],[x,.074,.085],[0,0,0],.0012);}}

// Frasco de antiséptico con dosificador (escena 13).
const piezaAntiseptico=new THREE.Group();
{const g=objeto('antiseptico');g.position.set(.30,YS,-.115);g.add(piezaAntiseptico);
 const p=piezaAntiseptico;
 torno(p,'verdeAgua',[[0,0],[.026,0],[.028,.004],[.028,.1],[.024,.116],[.012,.124],[.012,.13],[0,.13]],[0,0,0]);
 torno(p,'blanco',[[0,0],[.015,0],[.015,.014],[.006,.016],[.006,.04],[0,.04]],[0,.128,0]);
 caja(p,'blanco',[.04,.012,.016],[.008,.17,0],[0,0,0],.005);
 cilindro(p,'blanco',.003,.016,[.034,.168,0],[0,0,Math.PI/2]);
 rotulo(p,ENVASES.solucion,.042,.045,[0,.055,.0282],[0,0,0]);}

// Dos frascos auxiliares pequeños, reconocibles por su silueta, sin atribuirles un contenido.
{const g=new THREE.Group();g.position.set(.29,YS,-.025);carro.add(g);
 for(const [x,z,h,nombre] of [[-.04,0,.085,'blanco'],[.025,.015,.105,'transparente']]){
  torno(g,nombre,[[0,0],[.014,0],[.016,.004],[.016,h-.02],[.009,h-.008],[.009,h],[0,h]],[x,0,z]);
  cilindro(g,'azul',.010,.017,[x,h+.008,z]);
  rotulo(g,ET.azul,.023,.025,[x,h*.45,z+.0162],[0,0,0]);
 }
}

// Dos dispensadores bajos, blancos, como los de la fotografía; no la caja de guantes azules del GLTF.
const guantes=new THREE.Group();carro.add(guantes);guantes.position.set(-.23,YS,.122);guantes.rotation.y=.025;
function dispensador(g,tex,w=.21){
 caja(g,'papel',[w,.052,.097],[0,.026,0],[0,0,0],.002);
 rotulo(g,tex,w-.008,.045,[0,.026,.049],[0,0,0]);
 rotulo(g,tex,.075,.036,[w/2+.0006,.026,0],[0,Math.PI/2,0]);
 malla(new THREE.CircleGeometry(.022,40),'goma',g,[0,.0523,0],[-Math.PI/2,0,0]).scale.set(1.7,.60,1);
 // Un pliegue blanco queda dentro de la abertura, sin dedos sobresaliendo.
 caja(g,'blanco',[.038,.004,.014],[-.009,.054,-.004],[.1,0,.08],.002);
}
dispensador(guantes,ENVASES.guantes);
{const g=new THREE.Group();carro.add(g);g.position.set(-.005,YS,.047);g.rotation.y=-.025;dispensador(g,ENVASES.guantesVerdes,.19);}

// Hoja de registro con unas líneas de notas (escenas 2 y 21).
{const g=objeto('notas');g.position.set(-.045,YS,.150);g.rotation.y=-.12;
 caja(g,'papel',[.15,.003,.11],[0,.0015,0],[0,0,0],.001);
 caja(g,'papel',[.15,.003,.11],[.004,.0045,-.002],[0,.03,0],.001);
 for(let i=0;i<4;i++)caja(g,'tinta',[i==3?.06:.11,.0006,.003],[-.01-(i==3?.025:0),.0063,-.035+i*.022],[0,0,0],.0003);}

// Referencia Mepilex Border Flex: borde fino de silicona, espuma central y película exterior beige.
// Muestra docente fuera del sobre, sin representar una técnica de aplicación.
{const g=objeto('aposito-elegido');g.position.set(.082,YS,.142);g.rotation.y=.08;
 sobre(g,[.12,.125],[.002,0,-.012],[0,-.10,0],{tex:REFERENCIAS.flex,relieve:.0012});
 lamina(g,'blanco',.10,.10,.0006,.011,[0,.0032,0],{roughness:.50});
 lamina(g,'beige',.068,.068,.0036,.008,[0,.0039,0],{roughness:.88,bumpScale:.00008});
 lamina(g,'beige',.067,.067,.00025,.008,[0,.0076,0],{map:FILM_FLEX,bumpMap:null,roughness:.62});
 // Identificación discreta sobre el borde, visible al acercar la pieza.
 const t=lienzo(512,64,(x)=>{x.fillStyle='#f7f3ee';x.fillRect(0,0,512,64);x.fillStyle='#77736f';x.font='26px Arial';x.fillText('Mepilex Border Flex',16,43);});
 t.colorSpace=THREE.SRGBColorSpace;rotulo(g,t,.063,.007,[0,.0041,.043],[-Math.PI/2,0,0]);
}

// Referencia Mepilex Ag: espuma gris sin borde adhesivo; la plata no es una lámina metálica.
{const g=objeto('aposito-plata');g.position.set(.213,YS,.145);g.rotation.y=-.07;
 sobre(g,[.115,.145],[0,0,-.025],[0,0,0],{relieve:.0012});
 rotulo(g,REFERENCIAS.ag,.092,.036,[0,.003,-.075],[-Math.PI/2,0,0]);
 lamina(g,'rueda',.10,.10,.0038,.004,[0,.0033,0],{color:0x77736f,roughness:.94,metalness:0,bumpMap:TRAMA,bumpScale:.00012});
 // Cara de contacto apenas visible en el canto; película superior mate y flexible.
 lamina(g,'beige',.099,.099,.0003,.004,[0,.0030,0],{roughness:.6,bumpMap:null});
}

// Jeringa de irrigación sin aguja (escena 15).
{const g=objeto('jeringa');g.position.set(.30,YS+.0125,.09);g.rotation.y=Math.PI/2;
 const p=new THREE.Group();p.rotation.z=-Math.PI/2;g.add(p); // el eje y del torno pasa a ser el largo de la jeringa
 torno(p,'transparente',[[.0035,-.07],[.004,-.062],[.011,-.055],[.0115,.05],[.011,.052],[.0,.052]],[0,0,0]);
 caja(p,'transparente',[.034,.012,.003],[0,.05,0],[Math.PI/2,0,0],.0015); // aletas
 cilindro(p,'blanco',.0035,.06,[0,.075,0]);torno(p,'goma',[[0,0],[.0105,0],[.0105,.006],[0,.006]],[0,.018,0]);
 cilindro(p,'blanco',.012,.003,[0,.106,0]);
 for(let i=0;i<8;i++)caja(p,'tinta',[.0006,.0006,i%2?.005:.008],[.0115,-.04+i*.011,0],[0,0,0],.0002);}

// Regla de papel para medir (escena 8).
{const g=objeto('regla');g.position.set(-.04,YS,.195);g.rotation.y=.03;
 caja(g,'papel',[.18,.002,.03],[0,.001,0],[0,0,0],.0008);
 for(let i=0;i<=18;i++)caja(g,'tinta',[.0009,.0005,i%2?.006:.011],[-.08+i*.0089,.0023,-.009],[0,0,0],.0002);}

// Deltalab Amies 300287: tubo estrecho de fondo redondo, gel claro sin carbón y tapón azul estriado.
{const g=objeto('torunda');g.position.set(.175,YS+.0105,.015);g.rotation.y=-.05;
 const p=new THREE.Group();p.rotation.z=-Math.PI/2;g.add(p);
 const fondo=[...Array(9)].map((_,i)=>{const a=i/8*Math.PI/2;return [Math.sin(a)*.0065,-.085+.0065*(1-Math.cos(a))];});
 torno(p,'transparente',[...fondo,[.0065,.062],[.0059,.062],[.0059,-.078],[0,-.084]],[0,0,0],undefined,64);
 const medio=torno(p,'gel',[[0,-.083],[.0055,-.079],[.0057,-.051],[0,-.051]],[0,0,0]);
 Object.assign(medio.material,{transparent:true,opacity:.55,depthWrite:false});
 medio.material.color.set(PAL.transparente.color);medio.material.userData.base.copy(medio.material.color);
 cilindro(p,'blanco',.0009,.125,[0,-.002,0]);
 malla(new THREE.SphereGeometry(.0025,20,14),'gasa',p,[0,-.066,0]).scale.set(1,2.7,1);
 torno(p,'azul',[[0,0],[.0075,0],[.008,.002],[.008,.021],[.0065,.024],[0,.024]],[0,.061,0]);
 for(let i=0;i<28;i++){
  const a=i/28*Math.PI*2;cilindro(p,'azul',.00035,.018,[Math.cos(a)*.008,.073,Math.sin(a)*.008],undefined,6);
 }
 // Etiqueta curva; el fondo del tubo queda transparente para ver el medio.
 const etiquette=new THREE.CylinderGeometry(.00665,.00665,.055,48,1,true,-Math.PI*.72,Math.PI*1.44);
 const textoTubo=REFERENCIAS.amies.clone();textoTubo.center.set(.5,.5);textoTubo.rotation=Math.PI/2;textoTubo.needsUpdate=true;
 malla(etiquette,'etiqueta',p,[0,.018,0],[0,0,0],{map:textoTubo,side:THREE.DoubleSide});
 // Sobre bajo el tubo, sin tapar el escobillón ni simular una toma de muestra.
 const paquet=sobre(g,[.195,.031],[0,-.0105,0],[0,0,0],{nombre:'sobre',centro:'transparente',relieve:.0007});
 rotulo(paquet,REFERENCIAS.amies,.075,.018,[.015,.0026,0],[-Math.PI/2,0,0]);
}

// Bisturí desechable dentro de su funda, sin sacar (escena 17). Si está el modelo descargado, lo sustituye.
const piezaBisturi=new THREE.Group();
{const g=objeto('bisturi');g.position.set(.21,YS+.005,.058);g.rotation.y=.1;
 g.add(piezaBisturi);
 caja(piezaBisturi,'azulClaro',[.10,.008,.014],[-.02,0,0],[0,0,0],.0035);
 caja(piezaBisturi,'hoja',[.032,.0015,.009],[.048,0,0],[0,0,0],.0007);
 sobre(g,[.17,.035],[.002,-.0055,0],[0,0,0],{nombre:'transparente',centro:'transparente'});}

// ---- Bandeja inferior ----
const YI=ALTO_INF+.004;
// Rollos blancos al fondo y dos vendas de compresión, con el mandril hueco y los bordes del tejido.
const rollosVenda=new THREE.Group();
{const g=objeto('compresion');g.position.set(-.015,YI,-.125);g.add(rollosVenda);
 for(let i=0;i<6;i++){
  const x=-.18+i*.067,h=.075+(i%3)*.015;
  rollo(rollosVenda,i<2?'beige':'gasa',.012,.029,h,[x,0,0]);
  rollo(rollosVenda,'papel',.010,.012,h,[x,0,0]);
  for(let j=1;j<4;j++)rollo(rollosVenda,i<2?'beige':'gasa',.012+j*.004,.013+j*.004,.0007,[x,h+.0002,0]);
 }
 rollo(g,'piel',.013,.034,.075,[-.285,0,.04]);
 caja(g,'piel',[.035,.0015,.055],[-.28,.0008,.09],[0,.15,0],.0007);
}

// Cesta blanca de rejilla con apósitos variados en sus sobres (escena 6).
const cestaInf=cestillo(carro,[.25,.08,.22]);cestaInf.position.set(-.16,YI,.075);
{const g=objeto('apositos');g.position.copy(cestaInf.position);
 const tex=[ENVASES.sobres,null,ET.coral,ENVASES.sobres,null,ET.azul];
 tex.forEach((t,i)=>sobre(g,[.205,.13],[(i%2)*.003,.07,-.082+i*.029],[Math.PI/2-.12,0,(i%2?.02:-.02)],{tex:t}));}
// Apósito antimicrobiano, el último sobre de la cesta, con su etiqueta verde (escena 13).
{const g=objeto('aposito-antimicrobiano');g.position.copy(cestaInf.position);
 sobre(g,[.205,.13],[0,.07,.09],[Math.PI/2-.12,0,0],{centro:'verdeAgua',tex:ET.verde});}

// La segunda cesta es oscura, como en la foto, y contiene cajas blancas con bandas de color.
const cestaOscura=cestillo(carro,[.28,.075,.22],'goma');cestaOscura.position.set(.145,YI,.075);
for(const [x,z,h,tex] of [[.075,.04,.12,ENVASES.gasas],[.215,.065,.095,ENVASES.sobres]]){
 caja(carro,'papel',[.115,h,.12],[x,YI+.006+h/2,z],[0,0,0],.002);
 rotulo(carro,tex,.105,h-.012,[x,YI+.006+h/2,z+.0605],[0,0,0]);
 rotulo(carro,tex,.105,.065,[x,YI+.006+h+.0005,z],[-Math.PI/2,0,0]);
}
// Un estuche vertical en el extremo izquierdo completa el almacenaje de la bandeja inferior.
{const g=new THREE.Group();carro.add(g);g.position.set(-.315,YI,.045);
 caja(g,'papel',[.055,.20,.13],[0,.1,0],[0,0,0],.002);
 rotulo(g,ENVASES.sobres,.12,.12,[.028,.115,0],[0,Math.PI/2,0]);
}

// ---- Modelos descargados de Sketchfab (CC-BY, créditos al pie) ----
// Si están en carro/modelos/, sustituyen la pieza dibujada; si no, se queda la nuestra.
// Conservan sus texturas: es el material real de la consulta, con sus etiquetas.
// Caja de las piezas visibles (Box3.setFromObject cuenta también las ocultas).
function cajaVisible(obj){obj.updateMatrixWorld(true);const b=new THREE.Box3();obj.traverse(o=>{if(o.isMesh&&o.visible)b.expandByObject(o);});return b;}
function tumbar(obj){
 // Deja la dimensión más larga en x y la más delgada en y.
 const tam=()=>cajaVisible(obj).getSize(new THREE.Vector3());
 const giro=(eje)=>obj.rotateOnWorldAxis(new THREE.Vector3(...eje),Math.PI/2); // ejes del mundo, no los del objeto ya girado
 let s=tam();if(s.y>s.x&&s.y>=s.z)giro([0,0,1]);else if(s.z>s.x&&s.z>s.y)giro([0,1,0]);
 s=tam();if(s.y>s.z)giro([1,0,0]);
}
// Algunos modelos vienen inclinados en su propia malla: se busca el giro que deja la caja más ajustada.
function enderezar(obj){
 obj.updateMatrixWorld(true);const pts=[],v=new THREE.Vector3();
 obj.traverse(o=>{if(!o.isMesh||!o.visible)return;const a=o.geometry.attributes.position;
  for(let i=0;i<a.count;i+=Math.max(1,a.count/400|0))pts.push(v.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld).clone());});
 const q=new THREE.Quaternion(),e=new THREE.Euler(),b=new THREE.Box3(),t=new THREE.Vector3();
 const volumen=(x,y,z)=>{q.setFromEuler(e.set(x,y,z));b.makeEmpty();for(const p of pts)b.expandByPoint(t.copy(p).applyQuaternion(q));const s=b.getSize(t);return s.x*s.y*s.z;};
 let mejor=[0,0,0],min=volumen(0,0,0);
 for(const paso of [6,2,.5]){const r=paso*3*Math.PI/180,d=paso*Math.PI/180,[x0,y0,z0]=mejor;
  for(let x=x0-r;x<=x0+r;x+=d)for(let y=y0-r;y<=y0+r;y+=d)for(let z=z0-r;z<=z0+r;z+=d){const w=volumen(x,y,z);if(w<min){min=w;mejor=[x,y,z];}}}
 obj.quaternion.premultiply(q.setFromEuler(e.set(...mejor)));
}
async function cargar(ruta){try{return (await new GLTFLoader().loadAsync(ruta)).scene;}catch{return null;}}
// medida: [eje, metros] que debe ocupar el modelo; apoyar: base en y=0 (si no, centrado); giro: vuelta en y.
async function sustituir(destino,ruta,{id,medida,tumbado,recto,apoyar=true,giro=0,materiales}={}){
 const obj=await cargar(ruta);if(!obj)return false;
 const piezas=[];obj.traverse(o=>{if(o.isMesh)piezas.push(o);});
 for(const p of piezas){
  p.material=p.material.clone();
  // Conserva las etiquetas y el color del original, con el acabado mate de la consulta.
  if(!p.material.metalness)p.material.roughness=Math.max(p.material.roughness,.58);
  p.material.userData.base=p.material.color.clone();
 }
 materiales?.(piezas);
 if(recto)enderezar(obj);
 if(tumbado)tumbar(obj);
 const envoltorio=new THREE.Group();envoltorio.add(obj);envoltorio.rotation.y=giro;
 const caja=()=>cajaVisible(envoltorio);
 let b=caja();const [eje,m]=medida;
 envoltorio.scale.multiplyScalar(m/b.getSize(new THREE.Vector3())[eje]);
 b=caja();const c=b.getCenter(new THREE.Vector3());
 envoltorio.position.set(-c.x,apoyar?-b.min.y:-c.y,-c.z);
 destino.clear();destino.add(envoltorio);
 envoltorio.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;if(id)o.userData.grupo=id;}});
 if(id)ponerHalo(objetos[id]);
 return true;
}
// Contenedor, dispensadores, frascos y vendas se modelan arriba a partir de la referencia.
// Los GLTF anteriores se conservan en disco, pero no sustituyen estas piezas más fieles a la foto.
sustituir(piezaBisturi,'modelos/bisturi/scene.gltf',{id:'bisturi',medida:['x',.15],tumbado:true,materiales:piezas=>{
 // El modelo trae el mango con su hoja montada (piezas sin número y 10) y tres hojas de recambio sueltas.
 // Su textura es casi blanca y se pierde sobre el carro: acero como el resto, con su relieve.
 for(const p of piezas){if(/^(11|12|15)_/.test(p.name))p.visible=false;p.material=mat('hoja',{normalMap:p.material.normalMap,side:THREE.DoubleSide});} // es una lámina: dos caras
}}).then(ok=>{if(ok)piezaBisturi.position.y=.002;}); // encima del sobre, que si no lo tapa
const piezaJeringa=objetos.jeringa.children[0];
sustituir(piezaJeringa,'modelos/jeringa/scene.gltf',{id:'jeringa',medida:['x',.17],tumbado:true,apoyar:false,materiales:piezas=>{
 for(const p of piezas){
  p.geometry.computeBoundingBox();const s=p.geometry.boundingBox.getSize(new THREE.Vector3()),d=[s.x,s.y,s.z].sort((a,b)=>a-b);
  if(d[2]/Math.max(d[0],1e-6)>30){p.visible=false;continue;} // la aguja: larga y finísima
  p.material=mat(p.material?.transparent||p.material?.opacity<1?'transparente':'blanco');
 }
}}).then(ok=>{if(ok)piezaJeringa.rotation.set(0,0,0);}); // el modelo ya llega tumbado

// Un halo coral sobre la bandeja, bajo cada objeto que se puede traer, para señalarlo sin flechas.
const halo=lienzo(128,128,(x)=>{const g=x.createRadialGradient(64,64,0,64,64,64);
 g.addColorStop(0,'rgba(228,106,90,.75)');g.addColorStop(.55,'rgba(228,106,90,.3)');g.addColorStop(1,'rgba(228,106,90,0)');x.fillStyle=g;x.fillRect(0,0,128,128);});
function ponerHalo(g){
 carro.updateMatrixWorld(true);
 const b=new THREE.Box3().setFromObject(g),s=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3());
 const alzado=g.position.y-(g.userData.y??g.position.y); // si ya está elevado, el halo va a la bandeja
 let m=g.userData.halo;
 if(!m){m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:halo,transparent:true,opacity:0,depthWrite:false}));
  m.rotation.x=-Math.PI/2;scene.add(m);g.userData.halo=m;}
 m.scale.set(s.x*2.2+.1,s.z*2.2+.1,1);m.position.set(c.x,b.min.y-alzado+.0015,c.z);
}
for(const g of Object.values(objetos))ponerHalo(g);
function marcarGrupos(){carro.traverse(o=>{if(o.isMesh&&!o.userData.grupo)o.userData.grupo=(()=>{let p=o;while(p&&!p.userData.id)p=p.parent;return p?.userData.id;})();});}
marcarGrupos();
const piezaRevisada=objetos[PRODUCTO]?PRODUCTO:null;
if(piezaRevisada)for(const g of carro.children)g.visible=g===objetos[piezaRevisada];

// ---- Lo que pide la presentación ----
// vista 'carro': el carro entero. ids: los objetos que trae la herida, elevados y con halo; el resto se retira.
const VISTA_CARRO={pos:[1.85,1.60,2.65],mira:[.07,.52,0]};
const destino={pos:new THREE.Vector3(),mira:new THREE.Vector3()};
let ids=[],enVuelo=0,activo=true,vistaGeneral=true;
function mostrar({ids:nuevos=[],vista}={}){
 ids=nuevos.filter(id=>objetos[id]);
 vistaGeneral=vista==='carro'||!ids.length;
 if(vistaGeneral){
  destino.mira.set(...VISTA_CARRO.mira);
  // El soporte sobresale a la derecha: en un panel vertical hace falta más distancia.
  destino.pos.set(...VISTA_CARRO.pos).sub(destino.mira).multiplyScalar(Math.max(1,1/camera.aspect)).add(destino.mira);
 }
 else{
  // Mirar al centro de lo que se trae, desde delante y algo por encima.
  const caja3=new THREE.Box3();ids.forEach(id=>caja3.expandByObject(objetos[id]));
  const c=caja3.getCenter(new THREE.Vector3()),t=caja3.getSize(new THREE.Vector3()).length();
  const d=piezaRevisada?Math.max(.30,t*1.65,t*2.1/camera.aspect):Math.max(1.3,t*3);
  destino.pos.set(c.x+d*.42,c.y+d*.62,c.z+d*.78);destino.mira.copy(c);
 }
 enVuelo=1;
}
addEventListener('message',e=>{
 const m=e.data?.carro;if(!m)return;
 if('activo' in m){activo=m.activo;renderer.setAnimationLoop(activo?bucle:null);}
 if(m.ids||m.vista)mostrar(m);
});

function ajustar(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);composer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();if(vistaGeneral)mostrar({ids,vista:'carro'});else if(piezaRevisada)mostrar({ids});}
addEventListener('resize',ajustar);ajustar();
camera.position.set(...VISTA_CARRO.pos).multiplyScalar(1.25);mira.set(...VISTA_CARRO.mira);camera.lookAt(mira);
mostrar(piezaRevisada?{ids:[piezaRevisada]}:{vista:'carro'});
if(piezaRevisada){camera.position.copy(destino.pos);mira.copy(destino.mira);}

// El papel sale del render con su tono: se lee una vez y la página toma ese mismo color.
let fondoLeido=0;
function leerFondo(){
 const gl=renderer.getContext(),px=new Uint8Array(4);
 gl.readPixels(2,gl.drawingBufferHeight-3,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px);
 document.documentElement.style.setProperty('--fondo',`rgb(${px[0]},${px[1]},${px[2]})`);
}

const reloj=new THREE.Clock();
let t=0;
const luzPapel=new THREE.Color();
function cuadro(dt){
 t+=dt;const k=1-Math.exp(-dt*2.6);
 if(enVuelo){camera.position.lerp(destino.pos,k);mira.lerp(destino.mira,k);if(camera.position.distanceTo(destino.pos)<.002)enVuelo=0;}
 camera.lookAt(mira);
 // Lo que se trae se eleva un poco y respira; lo demás se retira hacia el papel.
 for(const [id,g] of Object.entries(objetos)){
  const on=ids.includes(id);
  g.userData.y??=g.position.y;
  const meta=g.userData.y+(on&&!piezaRevisada?.05+Math.sin(t*1.6)*.005:0);
  g.position.y+=(meta-g.position.y)*k;
  const h=g.userData.halo.material;h.opacity+=((on&&!piezaRevisada?.9:0)-h.opacity)*k;
 }
 carro.traverse(o=>{
  if(!o.isMesh)return;const m=o.material,on=!ids.length||ids.includes(o.userData.grupo);
  if(!m.userData.base)m.userData.base=m.color.clone();
  const fondo=on?0:.72,f=m.userData.f=(m.userData.f??0)+(fondo-(m.userData.f??0))*k;
  // Con textura, teñir el color no basta (multiplica): se oscurece y se le suma papel como luz propia.
  if(m.map)m.color.copy(m.userData.base).multiplyScalar(1-f);else m.color.copy(m.userData.base).lerp(PAPEL,f);
  m.envMapIntensity=(m.metalness>.7?1.35:1)*(1-f*.7);
  // Lo que se trae se tiñe levemente de coral, para que lo blanco no se pierda sobre el carro.
  const brillo=ids.length&&on&&!piezaRevisada?.2+Math.sin(t*1.6)*.05:0;
  m.userData.e=(m.userData.e??0)+(brillo-(m.userData.e??0))*k;
  m.emissive.copy(CORAL).multiplyScalar(m.userData.e);
  if(m.map)m.emissive.add(luzPapel.copy(PAPEL).multiplyScalar(f*.8));
 });
 composer.render(dt);
 if(++fondoLeido===3){if(!TRANSPARENTE)leerFondo();parent.postMessage({carroListo:true},'*');}
}
const bucle=()=>cuadro(Math.min(reloj.getDelta(),.05));
renderer.setAnimationLoop(bucle);
// Para comprobar sin pantalla visible: avanza n cuadros de golpe.
window.avanzar=(n=120)=>{for(let i=0;i<n;i++)cuadro(1/60);};
window.carro={mostrar,objetos,estado:()=>({ids,activo,enVuelo})};

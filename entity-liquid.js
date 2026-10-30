// Procedural motion study. All geometry, colour and light are evaluated in WebGL;
// no image, video, network dependency or pre-rendered frame is used.
const WoundColorStudies=[
 {name:'Sangre y piel',description:'Carmín vivo, coral y piel cálida. El contraste nace del rojo, con un acento ocre discreto.',colors:['#C6323E','#E9B696','#743536','#D4C570','#FFF2D4'],accent:.45,density:.98},
 {name:'Coral y lima',description:'Rojo cálido y coral con una corriente lima localizada. La propuesta más contrastada.',colors:['#D34437','#F2AA82','#8B4334','#C5D85B','#FAF1CE'],accent:1,density:.95},
 {name:'Serosa',description:'Rojo frambuesa entre membranas de marfil y ámbar transparente. Más aire y menos masa de color.',colors:['#D1484E','#EFC0A0','#984735','#DCC56A','#FFF5DF'],accent:.35,density:.50},
 {name:'Tierra y carmín',description:'Carmín, terracota y piel tostada, con un acento oliva-lima. Más profunda y terrosa.',colors:['#B53142','#C88E6F','#623D30','#A8B861','#F2D9B6'],accent:.65,density:1}
];
const LiquidEntity = (() => {
 const vertex='attribute vec2 a;varying vec2 v;void main(){v=a;gl_Position=vec4(a,0.,1.);}';
 const fragment=`precision highp float;
 varying vec2 v;
 uniform vec2 resolution,gaze;
 uniform vec2 gesture,delivery;
 uniform vec4 contact;
 uniform vec4 bodyCore,bodyPortal,bodyNote;
 uniform vec2 bodyFocus;
 uniform float bodyProgress;
 uniform float vitality,compactness,backdrop;
 uniform float ink;
 uniform vec3 inkHeart,inkSkin,inkShadow,inkAccent,inkSerum;
 uniform vec2 inkStyle;
 uniform vec4 layer0,layer1,layer2,layer3;
 uniform float flowTime,chromatic,ack;
 uniform vec3 paletteMix;
 uniform vec3 coral,pearl;
 uniform float time,listen,think,speak,breath,variant,palette,eyes,remember,show,tense,relief,level;
 float hash(vec3 p){p=fract(p*.3183099+vec3(.13,.17,.23));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
 float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float fbm(vec3 p){return noise(p)*.57+noise(p*2.03+4.)*.28+noise(p*4.01+7.)*.15;}
 float shape(vec3 p){
  float t=time*.35;
  float a=atan(p.y,p.x),r=length(p);
  float angular=smoothstep(.12,.65,length(p.xy));
  float ripple=sin(a*4.+time*5.+p.z*3.)*.032*speak*angular;
  float form=sin(p.x*2.2+t)*cos(p.y*2.4-t*.8)*sin(p.z*2.1+t*.6);
  float radius=.76+.045*form+.018*sin(a*3.+t)*angular+ripple+.012*breath;
  return r-radius;
 }
 vec3 colour(vec3 p,vec3 n){
  float t=time*(.16+.24*think+.16*speak);
  vec3 warp=vec3(fbm(p*1.45+vec3(t,-t*.4,0)),fbm(p*1.6+vec3(4.,t*.5,-t)),fbm(p*1.4+vec3(-t,5.,t*.7)));
  float flow=fbm(p*1.8+warp*1.8+vec3(t*.3,-t*.5,t*.6));
  float band=sin(p.y*3.8+p.x*1.8+flow*5.-t*1.3)*.5+.5;
  vec3 lavender=vec3(.68,.62,.91),blush=mix(coral,vec3(.99,.43,.34),.27);
  vec3 col=mix(blush,lavender,smoothstep(.28,.82,band));
  float milk=smoothstep(.60,.90,flow+p.z*.15);
  col=mix(col,pearl,milk*.83);
  // An internal warm nucleus provides the wound's identity without literal tissue.
  float core=exp(-dot(p.xy-vec2(.04,-.04),p.xy-vec2(.04,-.04))*5.);
  col=mix(col,blush,core*.26);
  if(variant>1.5)col=mix(col,vec3(.76,.54,.88),smoothstep(.25,.85,flow)*.30);
  return mix(col,vec3(dot(col,vec3(.3,.59,.11))),remember*.24);
 }
 float capsule(vec2 p,vec2 halfSize){vec2 q=abs(p)-halfSize;return length(max(q,0.))+min(max(q.x,q.y),0.)-.018;}

 // Alien Sphere direction: translucent colour fields, not an opaque shaded ball.
 // Every membrane has its own centre, breathing phase and drifting outline.
 float phrase(float t){
  // Short groups of syllables separated by a breath, rather than a metronome.
  float envelope=smoothstep(-.45,.05,sin(t*1.65+.45*sin(t*.71)));
  return envelope*(.56*sin(t*8.3)+.28*sin(t*12.7+.7)+.16*sin(t*5.1));
 }
 float membrane(vec2 p,float layer,float t){
  vec4 lag=layer0;if(layer>.5)lag=layer1;if(layer>1.5)lag=layer2;if(layer>2.5)lag=layer3;
  float delayed=t-(3.-layer)*.18;
  vec2 center=vec2(.078*sin(delayed*.67+layer*1.2),.058*cos(delayed*.51+layer*.9));
  center+=lag.xy;
  center+=vec2(.11-.075*layer,.018*layer-.025);
  vec2 q=p-center;
  float turn=.19*sin(delayed*.49+layer*.8)+lag.w;
  q=mat2(cos(turn),-sin(turn),sin(turn),cos(turn))*q;
  q/=vec2(1.015+.075*sin(t*.57+layer),.96+.065*cos(t*.61+layer));
  // A travelling fold locally displaces the membrane; each layer has its own phase.
  q+=vec2(sin(q.y*3.7-t*.93+layer),cos(q.x*3.2+t*.72-layer))*(.022+.025*think);
  float angle=atan(q.y,q.x);
  float radius=(.84-layer*.105)*(1.+lag.z+ack*(.45+.18*layer)+.009*sin(time*.98-(3.-layer)*.23));
  radius*=1.+vitality*(.068*sin(angle*3.+t*.62+layer*.8)+.064*cos(angle*2.-t*.47+layer));
  radius*=1.+delivery.x*(.65+.12*layer);
  float opening=pow(.5+.5*sin(t*.83-layer*.68),3.);
  radius+=.036*opening*cos(angle-t*.51+layer*.75);
  radius+=gesture.y*.040*sin(angle*2.-layer*.75+t*.25);
  radius+=speak*delivery.y*(1.+.30*compactness)*(.027*phrase(time-layer*.12)+.020*sin(angle*4.-t*4.+layer*.8));
  float distanceToTouch=length(p-contact.xy);
  float touchAge=contact.z-(3.-layer)*.085;
  float compression=0.;
  if(touchAge>=0.)compression=contact.w*.065*cos(distanceToTouch*10.-touchAge*9.)*exp(-touchAge*3.6)*exp(-distanceToTouch*distanceToTouch*5.);
  return length(q)-radius+compression;
 }
 vec4 field(vec2 p){
  float t=flowTime;
  vec2 touchDelta=p-contact.xy;
  float touchFade=contact.w*exp(-contact.z*3.6);
  p+=touchDelta*.22*touchFade*exp(-dot(touchDelta,touchDelta)*5.)*cos(contact.z*9.);
  float softBreath=.74*sin(time*.98)+.18*sin(time*.61+1.3)+.08*sin(time*1.67+.6);
  p*=1.-.018*softBreath-.026*listen-.020*relief+.025*tense-.012*level*listen;
  p.x+=.025*show;
  // Related palette families now blend continuously, rather than switching uniforms.
  vec3 w=paletteMix/max(dot(paletteMix,vec3(1.)),.001);
  vec3 peach=vec3(.96,.73,.64)*w.x+vec3(.96,.70,.77)*w.y+vec3(.99,.77,.53)*w.z;
  vec3 mauve=vec3(.70,.51,.65)*w.x+vec3(.64,.43,.65)*w.y+vec3(.80,.55,.58)*w.z;
  vec3 rose=vec3(.88,.45,.49)*w.x+vec3(.88,.52,.70)*w.y+vec3(.96,.57,.40)*w.z;
  // The coral centre stays anchored even as the surrounding pigments circulate.
  vec3 heart=mix(vec3(.96,.52,.45),vec3(.97,.57,.48),w.z*.40);
  vec3 ivory=vec3(1.,.91,.82)*w.x+vec3(1.,.90,.92)*w.y+vec3(1.,.94,.79)*w.z;
  vec3 petal=vec3(.96,.65,.76),mineral=vec3(.62,.42,.64),apricot=vec3(.99,.73,.46);
  float thinking=think*chromatic,attending=listen*chromatic,talking=speak*chromatic;
  peach=mix(peach,petal,.46*attending);
  mauve=mix(mauve,mineral,.70*thinking+.36*remember*chromatic);
  rose=mix(rose,petal,.52*attending+.22*relief*chromatic);
  peach=mix(peach,apricot,.58*relief*chromatic+.58*show*chromatic);
  ivory=mix(ivory,vec3(1.,.95,.90),.40*attending);
  // Voice tints stay subtle so all figures belong to the same harmonised palette.
  mauve=mix(mauve,mix(coral,pearl,.5),.11);
  // Artistic translations: red remains the identity; umber replaces violet depth.
  heart=mix(heart,mix(inkHeart,inkSkin,(.07*listen+.06*relief)*chromatic),ink);
  peach=mix(peach,mix(inkSkin,inkSerum,.1*listen*chromatic),ink);
  mauve=mix(mauve,mix(inkShadow,inkHeart,.18*speak*chromatic),ink);rose=mix(rose,mix(inkHeart,inkSkin,.24),ink);
  ivory=mix(ivory,inkSerum,ink);
  vec2 coreCenter=vec2(-.045+.065*sin(t*.32),-.035+.045*cos(t*.41))+layer3.xy;
  float protectedCore=1.-smoothstep(.14,.43,length(p-coreCenter));
  // Broad tongues of pigment cross membrane boundaries, independently of breathing.
  vec2 currents=p+vec2(.19*sin(t*.72+p.y*2.),.16*cos(t*.58-p.x*2.));
  float stream=.5+.5*sin(currents.x*4.6+currents.y*3.1+t*1.28+noise(vec3(currents*2.,t*.25))*3.);
  float eddy=.5+.5*cos(currents.y*5.2-currents.x*2.4-t*.96+stream*2.);
  float outer=membrane(p,0.,t);
  float haze=exp(-pow(max(outer,0.)*7.,2.))*.13*(1.-ink*.65);
  vec4 acc=vec4(mix(peach,mauve,.3)*haze,haze);
  for(int i=0;i<4;i++){
   float k=float(i),d=membrane(p,k,t);
   float feather=(.055+(3.-k)*.018)*(1.-.24*compactness)*(1.-.42*ink);
   float a=(1.-smoothstep(-feather,feather,d))*(.44+.115*k);
   a*=.78+.22*sin(stream*2.1+eddy*1.8+k*.8)*sin(stream*2.1+eddy*1.8+k*.8);
   a=min(.96,a+(compactness*.12+backdrop*.10)*(1.-smoothstep(-feather,feather,d)));
   vec3 col=peach;
   if(i==1)col=mauve;
   if(i==2)col=rose;
   if(i==0)col=mix(peach,petal,stream*chromatic*.65);
   if(i==1)col=mix(mauve,rose,stream*chromatic*.68);
   if(i==2)col=mix(rose,mix(peach,ivory,.18),stream*chromatic*.62);
   if(i==3){
    vec3 movingPigment=mix(rose,mauve,thinking*.60+remember*chromatic*.24);
    movingPigment=mix(movingPigment,peach,stream*chromatic*.42);
    col=mix(movingPigment,heart,protectedCore);
   }
   vec3 pigment=peach;
   if(i==1)pigment=mix(mauve,heart,smoothstep(.42,.60,stream)*.65);
   if(i==2)pigment=mix(heart,peach,smoothstep(.55,.72,eddy)*.46);
   if(i==3)pigment=mix(mix(heart,peach,.24),heart,protectedCore);
   vec2 vein=(p-vec2(.37,.13))/vec2(.22,.48);
   float accentIsland=exp(-dot(vein,vein)*1.4)*smoothstep(.28,.58,stream)*(1.-protectedCore);
   if(i>0&&i<3)pigment=mix(pigment,inkAccent,accentIsland*inkStyle.x);
   col=mix(col,pigment,ink);
   a*=mix(1.,mix(inkStyle.y,1.,protectedCore),ink);
   // Uneven broad washes, not hard concentric stripes.
   float wash=noise(vec3(p*2.0+vec2(k*.9,-t*.07),t*.12+k));
   col=mix(col,ivory,(.04+.17*wash)*smoothstep(-.7,.7,p.x+p.y*.45)*(1.-.55*ink));
   // Broad translucent folds give overlapping pigment depth without surface texture.
   float fold=smoothstep(.52,.91,eddy)*smoothstep(.25,.82,stream);
   col=mix(col,mix(ivory,peach,.25),fold*(.26+.15*think)*(1.-protectedCore*.85));
   // A narrow transmitted-light edge and a soft inner shadow reveal thickness.
   float edge=exp(-pow((d+.018)/.055,2.));
   float underside=exp(-pow((d+.10)/.11,2.));
   float facing=.5+.5*sin(atan(p.y,p.x)+t*.32+k*.9);
   vec3 shadow=mix(mauve,rose,.28)*.79;
   col=mix(col,shadow,underside*(1.-facing)*.36*(1.-protectedCore*.8));
   col=mix(col,mix(ivory,peach,.28),edge*facing*.37);
   col*=.91+.09*sin(p.x*2.+p.y*1.5+k*.4);
   col=mix(col,col*.94,compactness*.45);
   acc=vec4(col*a,a)+acc*(1.-a);
  }
  // Off-centre coral light flows softly through the nucleus.
  vec2 c=vec2(-.045+.065*sin(t*.32),-.035+.045*cos(t*.41))+layer3.xy;
  vec2 q=p-c;
  vec2 separation=vec2(.085+.045*sin(t*.61),.045*cos(t*.53));
  vec2 qa=q-separation,qb=q+separation;
  float coreA=exp(-dot(qa,qa)*15.),coreB=exp(-dot(qb,qb)*18.);
  float nucleus=1.-(1.-coreA)*(1.-coreB);
  float flow=noise(vec3(q*2.5+vec2(t*.10,-t*.08),t*.13));
  vec3 coreCol=mix(heart,ivory,(.08+.15*flow+.12*coreB)*(1.-.6*ink));
  acc.rgb=mix(acc.rgb,coreCol*acc.a,nucleus*.44);
  // Two moving, broad light pockets reveal the folds like light through silk.
  vec2 pocket=q-vec2(.24*cos(t*.81),.19*sin(t*.67));
  float lightPocket=exp(-dot(pocket,pocket)*28.)*(1.-protectedCore*.65);
  acc.rgb=mix(acc.rgb,mix(ivory,peach,.35)*acc.a,lightPocket*.27*(1.-.6*ink));
  // An inner translucent lip sweeps around the core after its attention gesture.
  float lipDistance=membrane(p,1.65,t+.65);
  float lipFacing=smoothstep(-.1,.85,sin(atan(q.y,q.x)-t*.43));
  float lip=exp(-pow((lipDistance+.035)/.034,2.))*lipFacing;
  float lipShadow=exp(-pow((lipDistance+.094)/.065,2.))*lipFacing;
  acc.rgb=mix(acc.rgb,mix(mauve,rose,.28)*acc.a,lipShadow*.14);
  acc.rgb=mix(acc.rgb,mix(ivory,peach,.23)*acc.a,lip*(.16+.15*gesture.y));
  // Nested silk contours open, cross and disappear behind the coloured washes.
  float px=2.0/min(resolution.x,resolution.y);
  for(int i=0;i<5;i++){
   if(i>2&&compactness>.55)continue;
   float k=float(i);
   vec2 shift=vec2(.027*sin(t*.36+k*1.7),.025*cos(t*.29+k));
   float d=membrane(p+shift,k*.62+.10,t+.54*k);
   float angle=atan(p.y,p.x);
   float reveal=.36+.64*smoothstep(-.6,.5,sin(angle*1.7-t*.74+k*1.6));
   float line=(1.-smoothstep(px*.15,px*(.95+.35*compactness),abs(d)))*(.38+.10*sin(t*.64+k))*reveal;
   line*=1.+.36*compactness+.22*backdrop;
   line*=1.+.60*think*pow(max(0.,cos(atan(p.y,p.x)-time*1.4)),12.);
   line*=smoothstep(-.92,-.62,outer)* (1.-smoothstep(.0,.05,outer));
   vec3 silk=mix(ivory,peach,.17);
   acc=vec4(silk*line,line)+acc*(1.-line);
  }
  float lum=dot(acc.rgb,vec3(.3,.59,.11));
  acc.rgb=mix(acc.rgb,vec3(lum),remember*.22);
  return acc;
 }
 // The same procedural body stretches into a porous, open membrane around a resource.
 float smoothUnion(float a,float b,float k){float h=max(k-abs(a-b),0.)/k;return min(a,b)-h*h*k*.25;}
 float boxDistance(vec2 p,vec2 halfSize){vec2 q=abs(p)-halfSize;return length(max(q,0.))+min(max(q.x,q.y),0.);}
 vec4 unfoldedBody(vec2 p){
  float progress=bodyProgress,t=flowTime;
  float unit=max(bodyCore.z,.025);
  vec2 center=mix(bodyCore.xy,bodyPortal.xy,progress);
  vec2 extent=mix(vec2(unit*.82),bodyPortal.zw+vec2(unit*.48,unit*.55),progress);
  vec3 w=paletteMix/max(dot(paletteMix,vec3(1.)),.001);
  vec3 warm=vec3(.96,.54,.46),pink=vec3(.91,.62,.70),mauve=vec3(.66,.46,.63),ivory=vec3(1.,.91,.82);
  warm=mix(warm,inkHeart,ink);pink=mix(pink,inkSkin,ink);mauve=mix(mauve,inkShadow,ink);ivory=mix(ivory,inkSerum,ink);
  vec4 acc=vec4(0.);
  float imageCut=1.-smoothstep(-.008,.025,boxDistance(p-bodyPortal.xy,bodyPortal.zw));
  float noteCut=1.-smoothstep(-.005,.02,boxDistance(p-bodyNote.xy,bodyNote.zw));
  for(int i=0;i<4;i++){
   float k=float(i),lag=(3.-k)*.13;
   vec2 drift=vec2(sin(t*.7+k),cos(t*.59-k))*(.035+.025*k)*unit;
   vec2 q=(p-center-drift)/(extent*(1.-k*.055));
   float a=atan(q.y,q.x);
   float radius=1.+.055*sin(a*3.+t*.65+k*.9)+.032*cos(a*2.-t*.5+k);
   float folded=pow(pow(abs(q.x),3.4)+pow(abs(q.y),3.4),1./3.4);
   float d=(mix(length(q),folded,progress)-radius)*min(extent.x,extent.y);
   float core=length((p-bodyCore.xy)/vec2(1.,1.08))-unit*(.72-.04*k);
   d=smoothUnion(d,core,unit*.6);
   // A lobe reaches towards the selected point and carries its explanation outward.
   vec2 foldCenter=mix(bodyFocus,bodyNote.xy, .91)+drift;
   float fold=(length((p-foldCenter)/vec2(max(bodyNote.z*.95,unit),unit*.68))-1.)*unit*.68;
   if(bodyNote.z>.001)d=smoothUnion(d,fold,unit*.9);
   float feather=unit*(.13+.035*(3.-k));
   float opacity=(1.-smoothstep(-feather,feather,d))*(.23+.09*k);
   opacity*=1.-progress*imageCut;opacity*=1.-progress*noteCut*.65;
   float arc=.5+.5*sin(a*1.7-t*.43+k);
   float opening=.07+.93*smoothstep(.10,.78,arc);
   opacity*=mix(1.,opening,progress);
   vec3 col=mix(mix(pink,mauve,k/3.),mix(warm,ivory,.24),w.z*.45);
   col=mix(col,ivory,(.10+.18*arc)*sin(a+t*.4+k)*sin(a+t*.4+k));
   float light=(1.-smoothstep(.001,unit*.018,abs(d)))*(.22+.18*arc);
   light*=1.-progress*imageCut;light*=1.-progress*noteCut;
   light*=mix(1.,.12+.88*smoothstep(.2,.8,arc),progress);
   acc=vec4(col*opacity,opacity)+acc*(1.-opacity);
   acc=vec4(ivory*light,light)+acc*(1.-light);
  }
  // The recognizable coral core stays attached to the deforming silhouette.
  vec4 nucleus=field((p-bodyCore.xy)/unit*1.12);
  float coreMask=exp(-dot(p-bodyCore.xy,p-bodyCore.xy)/(unit*unit)*2.8);
  nucleus*=1.-progress*imageCut;
  acc=mix(acc,nucleus,coreMask*.90);
  return acc;
 }
 void main(){
  float scale=min(resolution.x,resolution.y)*.50;
  vec2 p=v*resolution/(2.*scale);
  if(bodyCore.w>.5){gl_FragColor=unfoldedBody(p);return;}
  // Slight lean and squash are continuous across states.
  p-=gaze*.016;
  p.y-=.024*sin(time*.9);
  float lean=variant>2.5?0.:-.10*listen+.06*show;
  p=mat2(cos(lean),-sin(lean),sin(lean),cos(lean))*p;
  p/=vec2(1.-.045*listen+.04*speak-.035*tense+.025*relief,1.+.075*listen-.03*speak-.035*tense);
  float t=time;
  // Leave room for the translucent rim at maximum listening expansion.
  if(variant>2.5){
   float margin=(1.-smoothstep(.88,1.,abs(v.y)))*(1.-smoothstep(.96,1.,abs(v.x)));
   gl_FragColor=field(p*1.12)*margin;return;
  }
  vec3 origin=vec3(p,2.4),dir=vec3(0,0,-1);
  float travel=1.3,d=1.;vec3 hit=origin;
  for(int i=0;i<36;i++){hit=origin+dir*travel;d=shape(hit);if(d<.0015||travel>3.5)break;travel+=max(d*.85,.002);}
  float r=length(p);
  float halo=exp(-pow(max(r-.73,0.)*6.,2.))*.10;
  halo*=smoothstep(.59,.80,r);
  vec3 glow=mix(vec3(.96,.60,.38),vec3(.68,.64,.91),.5+.5*sin(atan(p.y,p.x)+t*.3));
  float alpha=halo;vec3 rgb=glow*halo;
  if(travel<3.5&&d<.006){
   float ep=.004;
   vec3 n=normalize(vec3(shape(hit+vec3(ep,0,0))-shape(hit-vec3(ep,0,0)),shape(hit+vec3(0,ep,0))-shape(hit-vec3(0,ep,0)),shape(hit+vec3(0,0,ep))-shape(hit-vec3(0,0,ep))));
   vec3 light=normalize(vec3(-.6,.8,1.4));
   float fresnel=pow(1.-max(n.z,0.),2.5);
   vec3 col=colour(hit,n);
   col*=.67+.33*max(dot(n,light),0.);
   col+=vec3(1.,.94,.86)*pow(max(dot(n,normalize(light+vec3(0,0,1))),0.),38.)*.33;
   float back=pow(max(0.,dot(n,normalize(vec3(.6,-.3,.3)))),4.);
   col+=vec3(.21,.045,.015)*back*.25;
   // Amber rim, cool reflected light and a narrow highlight give readable volume.
   vec3 rim=mix(vec3(1.,.69,.32),vec3(.91,.88,1.),smoothstep(-.7,.5,n.x+n.y));
   col=mix(col,rim,fresnel*.82);
   col+=rim*pow(1.-max(n.z,0.),9.)*.24;
   float edgeAlpha=smoothstep(0.,.065,n.z);
   float a=edgeAlpha;
   if(variant>.5&&variant<1.5){
    // The field version dissolves outward like the gradient / IBM references.
    float field=1.-smoothstep(.05,.82,r);
    col=mix(col,pearl,(1.-field)*.55);
    a*=.34+.66*field;
   }
   if(eyes>.5){
    // Two simple luminous marks, entirely procedural and legible at small sizes.
    vec2 eyeP=p-vec2(gaze.x*.025,-.025+gaze.y*.018);
    float blink=1.-.94*pow(max(0.,cos(time*1.13)),64.);
    float eyeY=(.030+.012*listen)*blink;
    float left=capsule(eyeP+vec2(.113,0.),vec2(.010,eyeY));
    float right=capsule(eyeP-vec2(.113,.014*think),vec2(.010,eyeY));
    float e=1.-smoothstep(.0,.009,min(left,right));
    col=mix(col,vec3(1.,.98,.94),e*.95);
   }
   // During thinking a highlight travels; speaking sends restrained internal waves.
   float sweep=pow(max(0.,cos(atan(hit.y,hit.x)-time*2.1)),20.);
   col+=pearl*sweep*fresnel*think*.32;
   col+=vec3(.06,.025,.015)*speak*sin(length(hit.xy)*20.-time*9.);
   rgb=col*a+rgb*(1.-a);alpha=a+alpha*(1.-a);
  }
  // Thin transparent contour echoes the concentric contours in Alien Sphere.
  if(variant>.5&&variant<1.5){
   float ring=exp(-pow((r-(.79+.012*sin(t*.6)))*200.,2.))*.24;
   rgb=pearl*ring+rgb*(1.-ring);alpha=ring+alpha*(1.-ring);
  }
  gl_FragColor=vec4(clamp(rgb,0.,1.),clamp(alpha,0.,1.));
 }`;
 function create(e){
  const gl=e.canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false});if(!gl)return false;
  const shader=(kind,src)=>{const sh=gl.createShader(kind);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(sh));return null;}return sh;};
  const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);if(!vs||!fs)return false;
  const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return false;
  gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const a=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  e.liquid={gl,u:Object.fromEntries(['resolution','gaze','gesture','delivery','contact','bodyCore','bodyPortal','bodyNote','bodyFocus','bodyProgress','vitality','compactness','backdrop','ink','inkHeart','inkSkin','inkShadow','inkAccent','inkSerum','inkStyle','layer0','layer1','layer2','layer3','flowTime','chromatic','ack','paletteMix','coral','pearl','time','listen','think','speak','breath','variant','palette','eyes','remember','show','tense','relief','level'].map(k=>[k,gl.getUniformLocation(program,k)]))};
  e.canvas.dataset.renderer='liquid';return true;
 }
 // A damped spring per membrane gives the core initiative and the rim inertia.
 // The phase is integrated, never multiplied by elapsed time on a state change.
 function advance(e,time,dt,moving){
  const m=e.liquid,c=e.cur;
  m.motion??={flow:0,layers:Array.from({length:4},()=>({p:[0,0,0,0],v:[0,0,0,0]})),ack:0,lastThink:0,lastSpeak:0};
  const a=m.motion;
  const index=Math.max(0,Math.min(2,e.palette||0));
  const base=[0,0,0];base[index]=1;
  a.pigments??=base.slice();a.pigmentVelocity??=[0,0,0];a.chroma??=e.chromatic??.85;
  a.gesture??={age:10,lastEngaged:0,reach:0,wrap:0,direction:1};
  a.cadence??=0;a.vitality??=1;
  a.delivery??={age:10,lastSpeak:0,shape:0,velocity:0,gate:0};
  a.touch??={p:[0,0],v:[0,0],point:[0,0],age:10,lastId:0,strength:0};
  const study=WoundColorStudies[Math.max(0,Math.min(3,(e.ink||1)-1))];
  const pigments=study.colors.flatMap(hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255));
  a.ink??=e.ink?1:0;a.inkColors??=pigments.slice();a.inkStyle??=[study.accent,study.density];
  if(!moving)return a;
  dt=Math.max(0,Math.min(.1,dt));
  const inkEase=1.-Math.exp(-dt*3.2);a.ink+=((e.ink?1:0)-a.ink)*inkEase;
  for(let i=0;i<15;i++)a.inkColors[i]+=(pigments[i]-a.inkColors[i])*inkEase;
  [study.accent,study.density].forEach((v,i)=>a.inkStyle[i]+=(v-a.inkStyle[i])*inkEase);
  const touch=a.touch,input=e.interaction;
  touch.age+=dt;
  if(input&&input.tapId!==touch.lastId){
   touch.point=input.tapPoint.slice();touch.lastId=input.tapId;touch.age=0;touch.strength=1;
  }
  a.cadence+=dt;
  const burst=Math.pow(.5+.5*Math.cos(a.cadence*.88),4);
  const engagement=Math.max(c.listen,c.think,c.speak,c.show);
  // A continuous phase speeds up for gestures and eases into short resting intervals.
  const pace=.28+.37*engagement+(.82-.37*engagement)*burst;
  a.flow+=dt*(.86+.42*c.think+.24*c.speak)*pace;
  a.vitality+=((.65+.50*burst+.10*engagement)-a.vitality)*(1.-Math.exp(-dt*2.6));
  const delivery=a.delivery;
  if(c.speak>.15&&delivery.lastSpeak<=.15)delivery.age=0;
  delivery.lastSpeak=c.speak;delivery.age+=dt;
  const preparation=-.060*Math.exp(-Math.pow((delivery.age-.18)/.12,2));
  const opening=.075*Math.exp(-Math.pow((delivery.age-.68)/.30,2));
  const shapeTarget=c.speak*(preparation+opening);
  delivery.gate=Math.min(1,delivery.age/.48)**2;
  if(c.think>.15&&a.lastThink<=.15)a.ack=.027;
  if(c.speak<.12&&a.lastSpeak>=.12)a.ack=Math.max(a.ack,.015);
  a.lastThink=c.think;a.lastSpeak=c.speak;a.ack*=Math.exp(-dt*3.8);
  const lean=e.attention==='right'?-1:e.attention==='left'?1:(e.lean??1);
  const g=a.gesture,engaged=Math.max(c.listen,c.speak);
  if(engaged>.15&&g.lastEngaged<=.15){g.age=0;g.direction=lean;}
  g.lastEngaged=engaged;g.age+=dt;
  // Advance, hold briefly, then gather. Both envelopes finish at rest.
  g.reach=Math.exp(-Math.pow((g.age-.32)/.22,2))-.22*Math.exp(-Math.pow((g.age-1.05)/.34,2));
  g.wrap=Math.exp(-Math.pow((g.age-.95)/.44,2));
  const gx=e.gaze[0],gy=e.gaze[1];
  const tx=-.14*c.listen*lean+.14*c.show+gx*.025;
  const ty=.025*c.listen-.045*c.show+gy*.018;
  a.chroma+=((e.chromatic??.85)-a.chroma)*(1.-Math.exp(-dt*2.8));
  const profiles=[
   [c.listen,[.10,.85,.05]],[c.think,[.06,.91,.03]],
   [c.speak,[.76,.05,.19]],[c.remember,[.06,.90,.04]],
   [c.show,[.10,.08,.82]],[c.relief,[.15,.30,.55]]
  ];
  const sum=profiles.reduce((n,[amount])=>n+amount,0);
  const target=base.slice();
  if(sum>.001){
   const strength=Math.min(1,sum)*a.chroma*.92;
   for(let j=0;j<3;j++)target[j]=base[j]*(1.-strength)+profiles.reduce((n,[amount,profile])=>n+amount*profile[j],0)/sum*strength;
  }else{
   // A small warm/petal drift keeps rest alive without changing the coral identity.
   const drift=.10*a.chroma*(.5+.5*Math.sin(a.flow*.42));
   for(let j=0;j<3;j++)target[j]=base[j]*(1.-drift)+[.35,.38,.27][j]*drift;
  }
  const steps=Math.max(1,Math.ceil(dt/(1/60))),h=dt/steps;
  for(let step=0;step<steps;step++)for(let j=0;j<2;j++){
   const target=(input?.point[j]??0)*(input?.proximity??0)*.11;
   touch.v[j]+=(48*(target-touch.p[j])-12*touch.v[j])*h;
   touch.p[j]+=touch.v[j]*h;
  }
  for(let step=0;step<steps;step++){
   delivery.velocity+=(95*(shapeTarget-delivery.shape)-16*delivery.velocity)*h;
   delivery.shape+=delivery.velocity*h;
  }
  for(let step=0;step<steps;step++)for(let j=0;j<3;j++){
   a.pigmentVelocity[j]+=(4.8*(target[j]-a.pigments[j])-4.5*a.pigmentVelocity[j])*h;
   a.pigments[j]+=a.pigmentVelocity[j]*h;
  }
  for(let step=0;step<steps;step++)for(let i=3;i>=0;i--){
   const layer=a.layers[i],leader=a.layers[i+1];
   const driftX=.018*Math.sin(a.flow*1.1-i*.8),driftY=.012*Math.cos(a.flow*.87-i*.7);
   const dest=[leader?leader.p[0]*.82+tx*.08:tx+driftX-.085*g.reach*g.direction+touch.p[0],
    leader?leader.p[1]*.82+ty*.08:ty+driftY+.025*g.reach+touch.p[1],
    .025*c.listen+.018*c.relief-.012*c.tense+.016*c.think*Math.sin(a.flow*2.1-i*.8)+.025*g.wrap*(3-i)/3,
    -.055*c.listen*lean+.045*c.show+c.think*.055*Math.sin(a.flow*.9-i*.22)-.06*g.wrap*g.direction*(3-i)/3];
   const stiffness=20+i*12,damping=2*Math.sqrt(stiffness)*.94;
   for(let j=0;j<4;j++){layer.v[j]+=(stiffness*(dest[j]-layer.p[j])-damping*layer.v[j])*h;layer.p[j]+=layer.v[j]*h;}
  }
  return a;
 }
 function draw(e,time,breath,level,dt=1/30,moving=true){
  const {gl,u}=e.liquid;
  if(moving)e.liquid.frozen={...e.cur};
  const c=moving?e.cur:(e.liquid.frozen||e.cur);
  const motion=advance(e,time,dt,moving);
  motion.layers.forEach((l,i)=>gl.uniform4fv(u['layer'+i],l.p));
  gl.uniform2f(u.gesture,motion.gesture.reach,motion.gesture.wrap);
  gl.uniform4fv(u.contact,[...motion.touch.point,motion.touch.age,motion.touch.strength]);
  const body=e.bodyGeometry;
  gl.uniform4fv(u.bodyCore,body?.core||[0,0,0,0]);gl.uniform4fv(u.bodyPortal,body?.portal||[0,0,0,0]);
  gl.uniform4fv(u.bodyNote,body?.note||[0,0,0,0]);gl.uniform2fv(u.bodyFocus,body?.focus||[0,0]);gl.uniform1f(u.bodyProgress,body?.progress||0);
  gl.uniform2f(u.delivery,motion.delivery.shape,motion.delivery.gate);gl.uniform1f(u.vitality,motion.vitality);
  gl.uniform1f(u.ink,motion.ink);gl.uniform2fv(u.inkStyle,motion.inkStyle);
  ['inkHeart','inkSkin','inkShadow','inkAccent','inkSerum'].forEach((name,i)=>gl.uniform3fv(u[name],motion.inkColors.slice(i*3,i*3+3)));
  const cssSize=Math.min(e.canvas.clientWidth||e.canvas.width,e.canvas.clientHeight||e.canvas.height);
  gl.uniform1f(u.compactness,Math.max(0,Math.min(1,(176-cssSize)/112)));
  gl.uniform1f(u.backdrop,e.canvas.parentElement?.dataset.surface==='photo'?1:0);
  gl.uniform1f(u.flowTime,motion.flow);gl.uniform1f(u.chromatic,motion.chroma);gl.uniform3fv(u.paletteMix,motion.pigments);gl.uniform1f(u.ack,motion.ack);
  gl.viewport(0,0,e.canvas.width,e.canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform2f(u.resolution,e.canvas.width,e.canvas.height);gl.uniform2fv(u.gaze,e.gaze);
  gl.uniform3fv(u.coral,e.colors[0]);gl.uniform3fv(u.pearl,e.colors[1]);
  const values={time,breath,level,listen:c.listen,think:c.think,speak:c.speak,remember:c.remember,show:c.show,tense:c.tense,relief:c.relief,variant:e.variant||0,palette:e.palette||0,eyes:e.eyes?1:0};
  for(const [k,v] of Object.entries(values))gl.uniform1f(u[k],v);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
 }
 return {create,draw};
})();

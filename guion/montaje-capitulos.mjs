// Dirección de escena. Las intervenciones y las notas se extraen del guion consolidado.
const item=(title,text='')=>({title,text});
const base=(intro,kind,title,items,question,options,citation,condition)=>({intro,resource:{kind,title,items},question,options,citation,condition});
export const montaje={
1:base('Hola, soy Úrsula. Hoy me toca hablar.','welcome','Una conversación que empieza escuchando',[
 item('Conocer','Antes de elegir qué poner'),item('Preguntar','Antes de repetir una cura'),item('Escuchar','Antes de dar por hecho')
],'¿Cómo hemos preparado esta conversación?',[item('Punto de partida','47 recomendaciones del GNEAUPP; 13 vinculadas al recorrido.'),item('Contraste y ampliación','Infección, limpieza, dolor, persona y objetivos.')],'GNEAUPP XIV · 2020 · EWMA · IWII','Selección documental para esta charla; las fuentes tienen alcances distintos.'),
2:base('Antes de elegir qué ponerme, necesitamos saber de dónde vengo.','cases','La duración no explica la causa',[item('Caso publicado: venoso','La etiología procede de la publicación.'),item('Caso publicado: arterial','Otro caso, otra localización.')],'¿Qué necesitamos conocer?',[item('La lesión y su causa','Etiología, perfusión, presión, infección y dolor.'),item('La persona y sus objetivos','Situación, apoyos y lo que se quiere conseguir.')],'GNEAUPP XIV · 2020 · p. 15 · EWMA 2026 · ficha 1','Diagnóstico previo al tratamiento tópico; consultar cuando no encaja.'),
3:base('Que medir sirva para saber si estoy cambiando.','measurement','Comparar exige hablar el mismo lenguaje',[item('Por la mañana','4 cm'),item('Por la tarde','Media palma'),item('Por la noche','Como una moneda de dos euros')],'¿Cambia la herida o la forma de medir?',[item('Registro consistente','Longitud, anchura, profundidad, tejido y exudado.'),item('Valoración completa','Borde, piel y dolor. Instrumento adecuado al contexto.')],'GNEAUPP XIV · 2020 · p. 15 · RESVECH 2.0','RESVECH se menciona para seguimiento en su ámbito; esta ficha no calcula su puntuación.'),
4:base('Si sigo igual, eso también debería cambiar el plan.','timeline','Tres visitas no son tres avances',[item('Visita 1','La misma cura'),item('Visita 2','El mismo apósito'),item('Visita 3','El mismo tamaño')],'¿Qué decisión acompaña a la revisión?',[item('Revisar el razonamiento','Causa, perfusión, presión, dolor, infección y viabilidad del plan.'),item('Reformular o consultar','Revisar antes si empeora o aparecen señales de alarma.')],'GNEAUPP XIV · 2020 · p. 15 · EWMA 2022','La revisión depende de lesión y objetivo; 2–4 semanas es un ejemplo, no una espera universal.'),
5:base('Compartir un método no significa necesitar el mismo tratamiento.','causes','Un método común. Un plan individual.',[
 item('Presión','Descarga'),item('Venosa','Compresión tras valoración vascular'),item('Arterial','Valoración vascular'),item('Pie diabético','Descarga, infección e isquemia'),item('Tumoral','Objetivos y confort'),item('Quirúrgica','Vigilancia de la evolución'),item('Humedad','Control y protección'),item('Quemadura tórpida / atípica','Reevaluación y consulta')
],'¿Qué cambia con la causa?',[item('Tratar la causa','El apósito forma parte de un plan.'),item('Comprobar la seguridad','Isquemia, objetivos y contexto cambian lo que podemos hacer.')],'GNEAUPP XIV · 2020 · pp. 15 y 21 · EWMA 2026','Escara seca o gangrena en úlcera isquémica: no cura húmeda mientras no esté revascularizada.'),
6:base('También en nosotras viven bacterias. La pregunta es qué está pasando en cada una.','continuum','Presencia no significa infección',[
 item('Contaminación',''),item('Colonización',''),item('Infección local',''),item('Extendida',''),item('Sistémica','')
],'¿Qué está cambiando en la herida y en la persona?',[item('Signos y evolución','Dolor nuevo, exudado, olor, eritema/calor, edema y deterioro.'),item('Extensión y estado general','Cambian la urgencia. El biofilm no se confirma a simple vista.')],'GNEAUPP VIII · 2021 · EWMA 2022 y fichas 2026','Valoración clínica y riesgo; ningún signo aislado da toda la respuesta.'),
7:base('Si pedimos un resultado, que sepamos para qué lo necesitamos.','swab','Una muestra empieza con una pregunta',[
 item('Infección clínica','¿Qué necesitamos resolver?'),item('Respuesta insuficiente','¿No mejora con el tratamiento?'),item('Deterioro','¿Está empeorando?'),item('Resistencias','¿Cambiaría la decisión?')
],'¿Qué haremos distinto con el resultado?',[item('Antes de recoger','Indicación conjunta; técnica, lugar y momento adecuados.'),item('Al interpretar','Relacionar resultado, signos y evolución; positivo no equivale a antibiótico.')],'GNEAUPP XIV · 2020 · p. 30 · VIII · 2021 · p. 23','Evitar el cultivo rutinario sin justificación; seguir laboratorio y protocolo.'),
8:base('La causa sigue pendiente aunque repitamos la pomada.','risks','Un envase no sustituye una explicación',[
 item('Resistencias','Un riesgo que considerar'),item('Sensibilización','También importa la piel'),item('Falsa sensación de tratamiento','La causa puede seguir sin abordarse')
],'¿Qué problema concreto estamos tratando?',[item('Revisar la causa','Diagnóstico y objetivo antes de añadir otro producto.'),item('Justificar la indicación','Si existe una indicación específica, debe quedar definida y revisarse.')],'GNEAUPP XIV · 2020 · p. 29 · GNEAUPP VIII · EWMA 2022','No pomada antibiótica como primera elección ante falta de progreso; no equiparar todos los tópicos.'),
9:base('Una pauta necesita saber por qué empieza y cuándo se revisa.','prescription','Cuatro preguntas antes de tratar',[
 item('¿Por qué?','Objetivo clínico'),item('¿Cuál?','Producto y vía adecuados'),item('¿Durante cuánto?','Duración prevista'),item('¿Cuándo reevaluar?','Fecha y criterio de revisión')
],'¿Podemos completar la pauta?',[item('Justificar','Indicación, producto y vía de administración.'),item('Revisar','Plata: revaloración crítica tras un máximo inicial de 14 días; antes si empeora.')],'GNEAUPP XIV · 2020 · p. 29 · VIII · 2021 · p. 38','Los 14 días no autorizan uso preventivo general ni renovación automática.'),
10:base('Hoy también toca limpieza. ¿Como siempre?','tissue','Limpiar también es cuidar la piel',[], '¿Cada vez que me ves?',[item('Limpieza adaptada','La herida, la piel y lo que necesita la persona.'),item('Elegir y revisar','Infección o riesgo, tejido, dolor, alergias y objetivo.')],'GNEAUPP XIV · p. 26 · IWII 2025 · pp. 21–22','Sin infección ni riesgo que lo justifique, el antiséptico generalmente no es necesario.'),
11:base('La cura no termina donde acaba el lecho.','zones','Ampliar la mirada a todo el territorio',[
 item('Lecho','Tejido, restos y exudado'),item('Borde','Avance epitelial y evolución'),item('Piel perilesional','Maceración, humedad o dermatitis'),item('Piel circundante','Integridad de la piel cubierta')
],'¿Qué retirar y qué proteger en cada zona?',[item('Observar','Recorrer lecho, borde, piel próxima y circundante.'),item('Adaptar','Elegir limpieza y protección según lo encontrado y el objetivo.')],'GNEAUPP XVII · 2023 · p. 41 · IWII 2025 · rec. 1, 3 y 11','La limpieza se adapta a la valoración; el arrastre no significa esterilización.'),
12:base('La eficacia y cómo lo tolero se preparan juntas.','pressure','La fuerza también se elige',[
 item('Insuficiente','Puede no retirar lo necesario'),item('Adaptada','Según lesión y objetivo'),item('Excesiva','Puede lesionar')
],'¿Cómo lo preparamos y comprobamos?',[item('Técnica según lesión','LPP y úlcera venosa: 4–15 psi; traumáticas: bajas presiones, según DT XVII.'),item('Antes, durante y después','Valorar dolor, anticipar y reevaluar. 33–42 °C: recomendación general DT XVII; revisar producto y protocolo.')],'GNEAUPP XVII · 2023 · pp. 41–42 · IWII 2025 · p. 31','No extender presiones ni temperatura a cualquier herida o producto.'),
13:base('Antes de tocar, faltan preguntas que cambian la seguridad.','triage','El color no autoriza una técnica',[
 item('Condiciones adecuadas','Indicación, perfusión, competencia, analgesia y beneficio esperado'),item('Detenerse y valorar','Anticoagulación, dolor no controlado o duda etiológica'),item('No actuar por reflejo','Isquemia; escara seca estable de talón en su contexto; lesión tumoral sangrante; sospecha de pioderma')
],'¿Qué falta antes de actuar?',[item('Valorar seguridad','Perfusión, estabilidad, persona y objetivos.'),item('Consultar si hace falta','El esquema recuerda preguntas; no da permiso para desbridar.')],'GNEAUPP XIV · 2020 · pp. 24 y 28 · EWMA 2026 · ficha 1','Escara estable de talón: supuesto concreto; cambios o complicaciones requieren nueva valoración.'),
14:base('No poder cerrar y no encajar en el diagnóstico son preguntas diferentes.','paths','Dos caminos, dos necesidades',[
 item('Objetivo posible','Confort, dolor, exudado, olor, sangrado y calidad de vida'),item('Diagnóstico pendiente','Dolor desproporcionado, borde violáceo, localización inusual, empeoramiento o evolución tórpida')
],'¿Qué buscamos y qué falta aclarar?',[item('Acordar alivio','Objetivos realistas y carga de cuidados asumible.'),item('Investigar y consultar','Documentar la sospecha y buscar valoración especializada.')],'EWMA · Cuidados paliativos · 2025 · Fichas de infección · 2026 · ficha 1','Las señales no diagnostican una lesión atípica; paliación no se limita al final de la vida.'),
15:base('Que pedir ayuda abra un camino y que la respuesta vuelva.','network','La consulta también tiene un recorrido',[
 item('Motivo','Isquemia, infección profunda/osteomielitis, pie diabético complicado, tumoral/atípica o falta de progreso'),item('Prioridad','Según sospecha y situación; no todas admiten la misma espera'),item('Datos','Evolución, actuaciones, respuesta y pregunta clínica'),item('Retorno','Quién revisa y cómo se incorpora la respuesta')
],'¿Qué necesitamos que resuelva la consulta?',[item('Red profesional','Primaria, hospital, vascular, dermatología, cirugía y comisión de heridas.'),item('Continuidad','Plan mientras se resuelve y circuito correspondiente al centro.')],'EWMA · Fichas de infección · 2026 · fichas 1, 2 y 6','Síntesis docente de coordinación; no es un circuito oficial de Jerez.'),
16:base('Además de mirar la lesión, preguntad qué me impide vivir.','priorities','Lo que provoca. Lo que importa.',[
 item('Dormir','Sin dolor'),item('Ducharse','Con un plan posible'),item('Salir','Sin miedo al olor'),item('Una boda','Poder ir con zapatos')
],'¿Qué es lo que más le importa ahora?',[item('Impacto','Dolor, sueño, movilidad, exudado, vida social, ánimo e intimidad.'),item('Prioridades y apoyos','Valores, proyectos, situación y lo que puede asumir el cuidador.')],'EWMA · Atención centrada en la persona · 2020 · S4–S7 y S17–S18','Ejemplos docentes; la recreación no acredita síntomas ni preferencias de una paciente real.'),
17:base('La señal de parar se acuerda antes de empezar.','pact','Si levanto la mano, paráis',[
 item('Explicar','Qué vamos a hacer'),item('Preparar','Entorno y postura'),item('Analgesia a tiempo','Según tratamiento prescrito y persona'),item('Pactar pausas','Y respetarlas'),item('Preguntar','Con un método de valoración adecuado'),item('Cuidar el gesto','Confort y mínimo traumatismo')
],'¿Cómo anticipamos y respetamos el dolor?',[item('Antes y durante','Consentimiento, prevención y una señal compartida.'),item('Después','Parar si duele, valorar, ajustar y registrar la respuesta.')],'GNEAUPP VI · 2021 · pp. 61–62 · XIV · p. 28 · IWII 2025','Los tiempos de analgesia dependen del tratamiento y la persona; no hay una cifra única.'),
18:base('Antes de decidir por mí, dejad espacio para mis preguntas.','agreement','Un acuerdo empieza dejando hablar',[
 item('Opciones','Explicar consecuencias'),item('Preferencias','Preguntar qué preocupa'),item('Acuerdo','Participación y apoyos que desee'),item('Revisión','Comprensión y plan por escrito')
],'¿Qué más le preocupa?',[item('Escuchar','Parte de las preocupaciones no llegó a expresarse en un estudio pequeño británico.'),item('Comprobar','Green et al., 2013: cinco pacientes y trece enfermeras; no extrapolar a todas las consultas.')],'EWMA 2020 · S17 · Green et al. · 2013','El 38 % se refiere a preocupaciones no expresadas en ese estudio, no al porcentaje de pacientes.'),
19:base('El plan también tiene que entenderse cuando volvemos a casa.','shared','El cuidado continúa entre visitas',[
 item('Explicar','De palabra, por escrito o con dibujos'),item('Comprobar','Que nos cuenten cómo lo harán'),item('Adaptar','Momento, discapacidad, domicilio o residencia'),item('Dar continuidad','Evitar la variabilidad de la práctica clínica')
],'¿La información permite actuar y preguntar?',[item('Apoyos elegidos','Contar con la familia y cuidadores que quiera implicar la persona.'),item('Plan compartido','Qué vigilar, cómo se tolera y qué hay que revisar.')],'EWMA · Atención centrada en la persona · 2020 · S17–S18','Información comprensible y continuidad; la escena es una recreación.'),
20:base('Necesito alivio y respeto, también cuando nombramos los síntomas.','symptoms','Síntomas que restan dignidad',[
 item('Olor','Alivio sin juicio'),item('Exudado','Absorción y protección de piel'),item('Picor','Revisar la causa'),item('Sangrado','Cuidado y plan según riesgo')
],'¿Qué alivia con la menor carga posible?',[item('Individualizar','Valorar la causa y revisar qué funciona; evidencia limitada para varias medidas del olor.'),item('Evitar traumatismo','Apósitos cómodos; no adherentes en lesión neoplásica, adhesivos suaves en piel frágil.')],'EWMA · Cuidados paliativos · 2025 · GNEAUPP XIV · pp. 24 y 31','Opciones según indicación; no una receta automática para cualquier síntoma.'),
21:base('Mi experiencia también puede cambiar cómo organizamos el cuidado.','participation','Un sitio con capacidad de influir',[
 item('Experiencia de la cura','Preguntar qué importa'),item('Materiales y protocolos','Revisarlos con quienes los usan'),item('Resultados relevantes','Medir lo que cambia la vida'),item('Devolución','Explicar qué hemos cambiado')
],'¿Qué decisión puede cambiar su participación?',[item('Una función concreta','Pacientes y cuidadores que quieran participar, con apoyos y un cometido claro.'),item('Una propuesta local','EWMA Patient Voices como ejemplo institucional, no como ensayo de eficacia.')],'EWMA 2020 · S18 · EWMA Patient Voices','Propuesta de mejora; no obligación normativa ni garantía de cicatrización.'),
22:base('Antes de salir, ¿qué cambiaremos en la próxima cura?','closing','Lo que nos llevamos a la próxima cura',[
 item('Conocer','No tratar sin diagnóstico · medir con instrumentos adecuados · no normalizar el estancamiento'),item('Justificar','No confundir colonización e infección · no cultivar por rutina · no repetir antibióticos tópicos sin indicación · no usar siempre antiséptico'),item('Revisar','No limpiar como ritual · no olvidar borde y piel · no mantener un tratamiento sin revisarlo')
],'Las preguntas que vuelven con nosotras',[item('Qué sabemos y qué necesita','La causa de la herida y los objetivos de la persona.'),item('Cuándo revisaremos','Una decisión con fecha, criterio y escucha.')],'Síntesis del recorrido · fuentes de cada capítulo','No siempre es posible el cierre; permanecen conocer, aliviar y acordar objetivos.')
};
// Títulos del recurso por escena cuando la composición los necesita propios. El resto usa título → pregunta → título.
const titles={
 3:['Una herida. Tres maneras de describirla.','¿Cambia la herida o la forma de medir?','Un registro que sirve a quien viene después'],
 7:['Una muestra empieza con una pregunta','¿Para qué necesitamos este resultado?','Preguntar antes. Interpretar después.'],
 10:['Limpiar también es cuidar la piel','Limpiar tiene un objetivo','Una decisión con respaldo'],
 11:['La cura no termina en el centro','¿Y el borde y la piel de alrededor?','Cuatro zonas. Una limpieza adaptada.']
};
for(const [n,list] of Object.entries(titles))montaje[n].titles=list;
const proposal=n=>['propuestas-revision-13/capitulo-'+String(n).padStart(2,'0')+'-propuesta.png','propuestas-revision-13/capitulo-'+String(n).padStart(2,'0')+'-reaccion.png'];
const avatars={
 default:['frames-escena-01-v1/01-presenta-aposito.png','frames-escena-01-v1/02-escucha.png'],
 7:['frames-escenas-05-07-v1/escena-06/01-propone-cultivo.png','frames-escenas-05-07-v1/escena-06/02-busca-la-pregunta.png'],
 8:['frames-escenas-05-07-v1/escena-05/01-propone-pomada.png','frames-escenas-05-07-v1/escena-05/02-reconsidera-pomada.png'],
 9:['frames-escenas-05-07-v1/escena-07/01-mantiene-plata.png','frames-escenas-05-07-v1/escena-07/02-revisa-la-pauta.png'],
 10:['frames-escenas-02-04-v1/escena-03/01-como-siempre.png','frames-escenas-02-04-v1/escena-03/02-reconoce-omision.png'],
 12:['frames-escenas-02-04-v1/escena-02/01-preparada.png','frames-escenas-02-04-v1/escena-02/02-escucha-dolor.png'],
 13:['escena-04-cureta-v2/01-propone-cureta.png','escena-04-cureta-v2/02-frena-y-valora.png'],
 17:['frames-escenas-02-04-v1/escena-02/01-preparada.png','frames-escenas-02-04-v1/escena-02/02-escucha-dolor.png'],
 22:['frames-escena-01-v1/00-reposo.png','frames-escena-01-v1/03-deja-aposito.png'],
 ...Object.fromEntries([2,3,4,5,6,11,14,15,16].map(n=>[n,proposal(n)]))
};
for(const [n,scene] of Object.entries(montaje))scene.avatar=(avatars[n]||avatars.default).map(p=>'personajes/rutina/'+p);
// Apertura y cierre tienen secuencias propias. El patrón de tres escenas solo es el contrato de los capítulos clínicos.
for(const [n,scene] of Object.entries(montaje))scene.structure=Number(n)===1?{
 kind:'opening',travelMs:4600,travelDeadlineMs:4750,sequence:[0,1,3],blocks:{0:0,1:1,3:2},titles:{0:'Hoy me toca hablar',1:'Cómo hemos preparado esta conversación',3:'Doña Rutina y Doña Evidencia'},resources:{0:'Escuchar antes de actuar',1:'47 puntos de partida. Más fuentes para decidir.',3:'Identificar, cuestionar y sustituir'}
}:Number(n)===22?{
 kind:'closing',sequence:[0,1,3],blocks:{0:0,1:1,3:2},titles:{0:'Doña Rutina se jubila',1:'Evidencia se queda',3:'Antes de repetir, escuchar'},resources:{0:'Diez recordatorios para la próxima cura',1:'Tres preguntas que vuelven con nosotras',3:'Menos rutina. Más preguntas. Más escucha.'}
}:{kind:'chapter',sequence:[0,1,3]};

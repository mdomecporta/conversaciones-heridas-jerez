// Lo que trae la herida en cada escena, compuesto a partir de las notas «En pantalla · recurso de la herida»
// del guion. Son fichas y esquemas docentes: no se presentan como documentos de pacientes ni como capturas.
// parts: cuántos avances tiene el recurso antes de la pregunta. thumb: queda en miniatura durante la evidencia.
// auto: las zonas de la imagen se recorren solas en lugar de una por avance.
// historia: lo que se ve en «Nos preguntamos», la historia, anécdota o curiosidad que hace necesaria la pregunta.
const ESCENA_RECURSOS={
 // El carro 3D (carro/): ids son los objetos que la herida trae del carro. La escena 12 vuelve a él entero.
 1:{type:'carro',ids:['aposito-elegido'],parts:1,label:'El carro de curas',title:'El apósito ya está elegido',text:'Material preparado. La historia, todavía por conocer.',
  historia:{type:'huecos',label:'Ficha docente',title:'La historia y sus huecos',known:{head:'Lo que sabemos',items:['Lleva tiempo abierta','Se han hecho curas','El apósito ya está elegido']},missing:{head:'Lo que falta',items:['Causa','Antecedentes relevantes','Factores que la mantienen','Cómo vive la persona con ella']}}},
 2:{type:'comparar',parts:2,thumb:true,label:'Dos ejemplos publicados · la etiología viene con la historia',
  items:[{asset:'venous',tag:'Causa venosa conocida'},{asset:'arterial',tag:'Compromiso arterial conocido'}],
  historia:{type:'esquema',label:'Esquema docente · ejemplos delimitados',title:'Misma pauta, dos historias',cols:[{head:'Úlcera venosa',items:['Cura húmeda','Junto a la compresión indicada']},{head:'Isquemia sin revascularizar',items:['Escara seca o gangrena','La cura húmeda no está indicada','Antes, valoración vascular']}],link:'¿La misma pauta?'}},
 3:{type:'imagen',asset:'shared-care',parts:2,ask:'¿Cómo se organiza el cuidado fuera de la consulta?',
  historia:{type:'momentos',label:'Ficha docente · supuesto',title:'Un día entre cura y cura',items:[['Por la mañana','El apósito y la ducha'],['Durante el día','Quién ayuda y cómo se mueve'],['Por la noche','El dolor y el descanso']]}},
 4:{type:'registro',label:'Notas ficticias · propuesta docente',title:'Notas de las últimas curas',parts:2,
  rows:[['Visita 1','Limpieza · apósito · próxima cita'],['Visita 2','Limpieza · apósito · próxima cita'],['Visita 3','Limpieza · apósito · próxima cita']],absence:['Cómo ha respondido la herida','No consta'],
  historia:{type:'opciones',label:'Supuesto docente',title:'La misma herida, tres notas',items:['«Parece que va mejor»','«Yo la veo igual»','«Ha mejorado algo»'],supuesto:'Ninguna dice respecto a qué'}},
 5:{type:'campos',label:'Ficha de seguimiento · supuesto',title:'Una referencia para volver',parts:3,
  fields:['Situación inicial','Qué queremos comparar','Con qué método'],banner:'No vemos el cambio esperado',
  questions:['¿La explicación sigue siendo suficiente?','¿Hay complicaciones?','¿Cómo se pudo realizar y tolerar el plan?'],
  historia:{type:'imagen',asset:'biofilm',walk:true,auto:true,tag:'Modelo conceptual, no hallazgo de esta herida',open:{head:'Siguen abiertas',items:['Perfusión','Carga','Respuesta al plan']}}},
 6:{type:'imagen-campos',asset:'swab',producto:'torunda',productoNombre:'Torunda y medio de transporte',productoReferencia:'Inspirada en Deltalab Amies',parts:2,title:'Antes de pedir la muestra',
  fields:['Qué sospechamos','Qué necesitamos aclarar','Qué decisión podría cambiar'],
  historia:{type:'informe',label:'Informe docente · supuesto',title:'Microbiología',result:'Cultivo positivo',pending:['Signos','Evolución','Situación de la persona']}},
 7:{type:'pauta',producto:'aposito-plata',productoNombre:'Apósito de espuma con plata',productoReferencia:'Inspirado en Mepilex Ag',label:'Pauta docente · supuesto',title:'Pauta con apósito de plata',parts:2,
  fields:[['Inicio',true],['Indicación',false],['Revisión',false]],questions:['Qué problema tratamos','Qué esperamos que cambie','Qué justifica continuar'],
  historia:{type:'opciones',label:'Esquema docente · sin orden de potencia',title:'Lo que cabe en «antimicrobiano»',ask:'¿Está indicada una intervención antimicrobiana?',items:['Antibiótico','Antiséptico','Apósito antimicrobiano']}},
 8:{type:'imagen',asset:'wound-zones',parts:2,walk:true,auto:true,thumb:true,ask:'¿Qué necesita la limpieza hoy?',
  then:{head:'Según valoración y tolerancia',items:['Con qué','Cómo','Con qué fuerza']},
  historia:{type:'momentos',label:'Ficha docente',title:'El dolor en la cura',calm:true,items:[['Antes','Cómo fue la cura anterior y qué dolor hay hoy'],['Durante','Qué está ocurriendo y si hay que parar'],['Después','Qué ajustamos para la próxima']]}},
 9:{type:'imagen-campos',asset:'heel',parts:2,thumb:true,title:'Antes de decidir',datum:'Escara seca y propuesta de desbridamiento cortante',
  fields:['Perfusión','Estabilidad y complicaciones','Situación y objetivos'],
  historia:{type:'esquema',label:'Esquema docente · supuesto del GNEAUPP',title:'Una escara que a veces se deja',cols:[{head:'Sin signos de complicación',items:['Escara seca y estable','No es preciso el desbridamiento cortante']},{head:'Con signos',items:['Infección, edema, eritema, fluctuación o drenaje','Cambia la prioridad: valorar antes de actuar']}],link:'¿Qué vemos?'}},
 10:{type:'imagen-lista',asset:'daily-life',parts:2,head:'Aspectos que preguntar',items:['Dolor','Fugas','Olor','Carga de cuidados'],
  note:'Posibilidades de conversación, no síntomas atribuidos a una paciente.',
  historia:{type:'opciones',label:'Esquema docente',title:'Tres objetivos posibles',ask:'¿Qué podemos conseguir hoy?',items:['Cicatrizar','Prevenir la infección','Aliviar'],supuesto:'Hoy buscamos aliviar'}},
 11:{type:'registro',label:'Notas ficticias · propuesta docente',title:'Notas de relevo',parts:2,
  rows:[['Visita 1','Seguir igual'],['Visita 2','Seguir igual']],absence:['Por qué seguimos así','No consta'],
  historia:{type:'relevo',label:'Ficha de relevo · propuesta docente',title:'Para quien venga mañana',
   fields:['Objetivo','Qué hacemos y por qué','Respuesta','Próxima revisión','Vía de consulta'],split:['Revisión prevista','Cambios que requieren valorar antes']}}
};
// Créditos de los modelos 3D del carro (licencia CC BY 4.0, se citan donde se ve el carro).
const ESCENA_CARRO_CREDITO='Carro modelado para la presentación · modelos CC BY 4.0 de Sketchfab: Miguel Adão, cig3d, Medicz, Stakler';
// Escena 12: lo que María del Mar recoge de la sala al volver al carro.
const ESCENA_REGRESO=['Historia y causa','Evolución','Persona','Motivo de la intervención'];
// Escena 13: tres páginas de recopilación de las 11 actuaciones.
const ESCENA_RECOPILACION=[[1,4],[5,8],[9,11]];

// Lo que trae la herida en cada escena, compuesto a partir de las notas «En pantalla · recurso de la herida»
// del guion. Son fichas y esquemas docentes: no se presentan como documentos de pacientes ni como capturas.
// parts: cuántos avances tiene el recurso antes de la pregunta. thumb: queda en miniatura durante la evidencia.
// auto: las zonas de la imagen se recorren solas en lugar de una por avance.
const ESCENA_RECURSOS={
 1:{type:'esquema',label:'Esquema docente',title:'Antes de acercar el carro',parts:2,
  cols:[{head:'Material preparado',items:['El carro está listo','El apósito ya está elegido']},{head:'Historia por conocer',empty:3}],link:'¿Y antes?'},
 2:{type:'registro',label:'Registro ficticio · propuesta docente',title:'Registro de intervenciones',parts:2,
  rows:[['Visita 1','Cura local'],['Visita 2','Se repite'],['Visita 3','Se repite']],absence:['Respuesta de la herida','Sin datos comparables']},
 3:{type:'huecos',label:'Ficha docente',title:'La historia y sus huecos',parts:2,
  known:{head:'Lo que sabemos',items:['Lleva tiempo abierta','Se han hecho curas']},missing:{head:'Lo que falta',items:['Causa','Antecedentes relevantes','Factores que la mantienen']}},
 4:{type:'imagen',asset:'wound-zones',parts:4,walk:true,thumb:true},
 5:{type:'comparar',parts:2,thumb:true,label:'Dos ejemplos publicados · la etiología viene con la historia',
  items:[{asset:'venous',tag:'Causa venosa conocida'},{asset:'arterial',tag:'Compromiso arterial conocido'}]},
 6:{type:'esquema',label:'Esquema docente · ejemplos delimitados',title:'El plan junto al apósito',parts:2,
  cols:[{head:'Intervención local',items:['Cobertura']},{head:'Causa o factor mantenedor',items:['Causa venosa','Presión o carga']}],link:'¿Se relacionan?',side:{asset:'compression',note:'Material identificado. No enseña ni prescribe una técnica.'}},
 7:{type:'imagen',asset:'shared-care',parts:2,ask:'¿Cómo se organiza el cuidado fuera de la consulta?'},
 8:{type:'campos',label:'Ficha de seguimiento · sin valores',title:'Una referencia para volver',parts:1,
  fields:['Situación inicial','Qué queremos comparar','Con qué método']},
 9:{type:'campos',label:'Ficha de seguimiento · recuperada de la escena 8',title:'Una referencia para volver',parts:3,
  fields:['Situación inicial','Qué queremos comparar','Con qué método'],banner:'No vemos el cambio esperado',
  questions:['¿La explicación sigue siendo suficiente?','¿Hay complicaciones?','¿Cómo se pudo realizar y tolerar el plan?']},
 10:{type:'imagen-campos',asset:'swab',parts:2,title:'Antes de pedir la muestra',
  fields:['Qué sospechamos','Qué necesitamos aclarar','Qué decisión podría cambiar']},
 11:{type:'informe',label:'Informe docente · supuesto',title:'Microbiología',parts:2,result:'Cultivo positivo',
  pending:['Signos','Evolución','Situación de la persona']},
 12:{type:'imagen',asset:'biofilm',parts:4,walk:true,thumb:true,tag:'Modelo conceptual, no hallazgo de esta herida',
  open:{head:'Siguen abiertas',items:['Perfusión','Carga','Respuesta al plan']}},
 13:{type:'opciones',label:'Esquema docente · sin orden de potencia',title:'Lo que cabe en «antimicrobiano»',parts:2,
  ask:'¿Está indicada una intervención antimicrobiana?',items:['Antibiótico','Antiséptico','Apósito antimicrobiano']},
 14:{type:'pauta',label:'Pauta docente',title:'Pauta antimicrobiana',parts:2,
  fields:[['Inicio',true],['Objetivo',true],['Revisión',false]],questions:['Qué esperábamos','Qué ha cambiado','Qué justifica continuar']},
 15:{type:'imagen',asset:'wound-zones',parts:2,walk:true,auto:true,thumb:true,ask:'¿Qué necesita la limpieza hoy?',
  then:{head:'Según valoración y tolerancia',items:['Con qué','Cómo','Con qué fuerza']}},
 16:{type:'momentos',label:'Ficha docente',title:'El dolor en la cura',parts:1,calm:true,
  items:[['Antes','Cómo fue la cura anterior y qué dolor hay hoy'],['Durante','Qué está ocurriendo'],['Después','Qué necesitamos ajustar']]},
 17:{type:'imagen-campos',asset:'heel',parts:2,thumb:true,title:'Antes de decidir',datum:'Escara seca y propuesta de desbridamiento cortante',
  fields:['Perfusión','Estabilidad y complicaciones','Situación y objetivos']},
 18:{type:'imagen',asset:'atypical',parts:2,thumb:true,tag:'La explicación o la evolución no encaja',showCredit:true},
 19:{type:'opciones',label:'Esquema docente',title:'Lo que podemos conseguir',parts:2,
  items:['Qué sabemos','Qué puede cambiar','Qué acordamos hoy'],supuesto:'Hoy buscamos aliviar'},
 20:{type:'imagen-lista',asset:'daily-life',parts:2,head:'Aspectos que preguntar',items:['Dolor','Fugas','Olor','Carga de cuidados'],
  note:'Posibilidades de conversación, no síntomas atribuidos a una paciente.'},
 21:{type:'relevo',label:'Ficha de relevo · propuesta docente',title:'Para quien venga mañana',parts:2,
  fields:['Objetivo','Qué hacemos y por qué','Respuesta','Próxima revisión','Vía de consulta'],split:['Revisión prevista','Cambios que requieren valorar antes']}
};
// Escena 22: lo que María del Mar recoge de la sala al volver al carro.
const ESCENA_REGRESO=['Historia y causa','Evolución','Persona','Motivo de la intervención'];
// Escena 23: siete páginas de recopilación agrupadas por los cuatro momentos de la visita.
const ESCENA_RECOPILACION=[[1,4],[5,7],[8,10],[11,13],[14,16],[17,20],[21,21]];

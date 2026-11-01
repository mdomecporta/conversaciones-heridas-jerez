// Lo que trae la herida en cada escena, compuesto a partir de las notas «En pantalla · recurso de la herida»
// del guion. Son fichas y esquemas docentes: no se presentan como documentos de pacientes ni como capturas.
// parts: cuántos avances tiene el recurso antes de la pregunta. thumb: queda en miniatura durante la evidencia.
// auto: las zonas de la imagen se recorren solas en lugar de una por avance.
const ESCENA_RECURSOS={
 // Foto del carro: al añadirla a resources.json como 'carro', añadir aquí side con ese asset. La escena 12 reutiliza este recurso.
 1:{type:'esquema',label:'Esquema docente',title:'Antes de acercar el carro',parts:2,
  cols:[{head:'Material preparado',items:['El carro está listo','El apósito ya está elegido']},{head:'Historia por conocer',empty:3}],link:'¿Y antes?'},
 2:{type:'comparar',parts:2,thumb:true,label:'Dos ejemplos publicados · la etiología viene con la historia',
  items:[{asset:'venous',tag:'Causa venosa conocida'},{asset:'arterial',tag:'Compromiso arterial conocido'}]},
 3:{type:'imagen',asset:'shared-care',parts:2,ask:'¿Cómo se organiza el cuidado fuera de la consulta?'},
 4:{type:'registro',label:'Notas ficticias · propuesta docente',title:'Notas de las últimas curas',parts:2,
  rows:[['Visita 1','Limpieza · apósito · próxima cita'],['Visita 2','Limpieza · apósito · próxima cita'],['Visita 3','Limpieza · apósito · próxima cita']],absence:['Cómo ha respondido la herida','No consta']},
 5:{type:'campos',label:'Ficha de seguimiento · supuesto',title:'Una referencia para volver',parts:3,
  fields:['Situación inicial','Qué queremos comparar','Con qué método'],banner:'No vemos el cambio esperado',
  questions:['¿La explicación sigue siendo suficiente?','¿Hay complicaciones?','¿Cómo se pudo realizar y tolerar el plan?']},
 6:{type:'imagen-campos',asset:'swab',parts:2,title:'Antes de pedir la muestra',
  fields:['Qué sospechamos','Qué necesitamos aclarar','Qué decisión podría cambiar']},
 7:{type:'pauta',label:'Pauta docente · supuesto',title:'Pauta con apósito de plata',parts:2,
  fields:[['Inicio',true],['Indicación',false],['Revisión',false]],questions:['Qué problema tratamos','Qué esperamos que cambie','Qué justifica continuar']},
 8:{type:'imagen',asset:'wound-zones',parts:2,walk:true,auto:true,thumb:true,ask:'¿Qué necesita la limpieza hoy?',
  then:{head:'Según valoración y tolerancia',items:['Con qué','Cómo','Con qué fuerza']}},
 9:{type:'imagen-campos',asset:'heel',parts:2,thumb:true,title:'Antes de decidir',datum:'Escara seca y propuesta de desbridamiento cortante',
  fields:['Perfusión','Estabilidad y complicaciones','Situación y objetivos']},
 10:{type:'imagen-lista',asset:'daily-life',parts:2,head:'Aspectos que preguntar',items:['Dolor','Fugas','Olor','Carga de cuidados'],
  note:'Posibilidades de conversación, no síntomas atribuidos a una paciente.'},
 11:{type:'relevo',label:'Ficha de relevo · propuesta docente',title:'Para quien venga mañana',parts:2,
  fields:['Objetivo','Qué hacemos y por qué','Respuesta','Próxima revisión','Vía de consulta'],split:['Revisión prevista','Cambios que requieren valorar antes']}
};
// Escena 12: lo que María del Mar recoge de la sala al volver al carro.
const ESCENA_REGRESO=['Historia y causa','Evolución','Persona','Motivo de la intervención'];
// Escena 13: tres páginas de recopilación de las 11 actuaciones.
const ESCENA_RECOPILACION=[[1,4],[5,8],[9,11]];

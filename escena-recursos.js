// Lo que trae la herida en cada escena, compuesto a partir de las notas «En pantalla · recurso de la herida»
// del guion. Son fichas y esquemas docentes: no se presentan como documentos de pacientes ni como capturas.
// parts: cuántos avances tiene el recurso antes de la pregunta. thumb: queda en miniatura durante la evidencia.
// auto: las zonas de la imagen se recorren solas en lugar de una por avance.
// historia: lo que se ve en «Nos preguntamos», la historia, anécdota o curiosidad que hace necesaria la pregunta.
const ESCENA_RECURSOS={
 // El carro 3D (carro/): ids son los objetos que la herida trae del carro. La escena 11 vuelve a él entero.
 1:{type:'carro',ids:['aposito-elegido'],parts:1,label:'El carro de María del Mar',title:'El apósito ya está elegido',text:'Material preparado. La historia, todavía por conocer.',
  historia:{type:'comparar',parts:2,label:'Dos ejemplos publicados · la etiología viene con la historia',
   items:[{asset:'venous',tag:'Venosa: cura húmeda, junto a la compresión indicada'},{asset:'arterial',tag:'Isquemia sin revascularizar: la cura húmeda no está indicada'}]}},
 2:{type:'imagen',asset:'shared-care',parts:2,ask:'¿Cómo se organiza el cuidado fuera de la consulta?',
  historia:{type:'momentos',label:'Ficha docente · supuesto',title:'Un día entre cura y cura',items:[['Por la mañana','El apósito y la ducha'],['Durante el día','Quién ayuda y cómo se mueve'],['Por la noche','El dolor y el descanso']]}},
 3:{type:'registro',label:'Pauta ficticia · supuesto',title:'Pauta de cura',parts:2,
  rows:[['Limpieza','Como siempre'],['Retirar tejido','Si hace falta'],['Analgesia','No consta']],absence:['Dolor en la última cura','No consta'],
  historia:{type:'momentos',label:'Ficha docente',title:'El pacto de la cura',calm:true,items:[['Antes','Cómo fue la anterior, qué dolor hay hoy y qué preparamos'],['Durante','Una señal acordada para parar'],['Después','Qué ajustamos para la próxima']]}},
 4:{type:'registro',label:'Seguimiento · datos ficticios',title:'Cuatro semanas igual',parts:2,
  rows:[['Inicio','5 × 4 cm'],['Semana 2','5 × 4 cm'],['Semana 4','5 × 4 cm']],absence:['Propuesta para la próxima cura','Añadir pomada con antibiótico'],
  historia:{type:'imagen',asset:'biofilm',walk:true,auto:true,tag:'«Será biofilm» · modelo conceptual, no hallazgo de esta herida',open:{head:'Sin comprobar todavía',items:['Causa y diagnóstico','Perfusión','Signos de infección','Si el plan se ha podido seguir']}}},
 5:{type:'imagen-campos',asset:'swab',producto:'torunda',productoNombre:'Torunda y medio de transporte',productoReferencia:'Inspirada en Deltalab Amies',parts:2,title:'Antes de pedir la muestra',
  datum:'Propuesta: pedir cultivo porque no avanza',
  fields:[['Evolución','Cuatro semanas igual'],['Signos de infección','No constan',true],['Para qué el cultivo','No consta',true]],
  historia:{type:'informe',label:'Informe docente · supuesto',title:'Microbiología',result:'Cultivo positivo',pending:['Signos','Evolución','Situación de la persona']}},
 6:{type:'pauta',producto:'aposito-plata',productoNombre:'Apósito de espuma con plata',productoReferencia:'Inspirado en Mepilex Ag',label:'Pauta docente · supuesto',title:'Pauta con apósito de plata',parts:2,
  fields:[['Inicio',true,'Hace 5 semanas'],['Motivo',false,'Por si acaso'],['Revisión',false,'No consta']],questions:['Qué tratamos','Qué esperamos que cambie','Cuándo lo revisamos'],
  historia:{type:'registro',label:'GNEAUPP DT VIII · plata en heridas infectadas',title:'La referencia de la guía',parts:2,rows:[['Plata','Hasta 14 días'],['Después','Revaloración crítica']],absence:['Esta pauta','5 semanas, sin revisar']}},
 7:{type:'registro',label:'Pauta ficticia · supuesto',title:'Pauta de limpieza',parts:2,
  rows:[['Con qué','Lo de siempre'],['Dónde','El lecho'],['Cuándo','En cada cura']],absence:['Borde y piel perilesional','No constan'],
  historia:{type:'imagen',asset:'wound-zones',walk:true,auto:true,parts:2,tag:'Modelo conceptual',then:{head:'Según valoración y tolerancia',items:['Con qué','Cómo','Con qué fuerza']}}},
 8:{type:'imagen-campos',asset:'heel',parts:2,thumb:true,title:'Antes de decidir',datum:'Escara seca y propuesta de desbridamiento cortante',
  fields:['Perfusión','Estabilidad y complicaciones','Situación y objetivos'],
  historia:{type:'esquema',label:'Esquema docente · supuesto del GNEAUPP',title:'Una escara que a veces se deja',cols:[{head:'Sin signos de complicación',items:['Escara seca y estable','No es preciso el desbridamiento cortante']},{head:'Con signos',items:['Infección, edema, eritema, fluctuación o drenaje','Cambia la prioridad: valorar antes de actuar']}],link:'¿Qué vemos?'}},
 9:{type:'imagen-lista',asset:'daily-life',parts:2,head:'Aspectos que preguntar',items:['Dolor','Fugas','Olor','Carga de cuidados'],
  note:'Posibilidades de conversación, no síntomas atribuidos a una paciente.',
  historia:{type:'opciones',label:'Esquema docente',title:'Objetivos que pueden convivir',items:['Cicatrizar','Prevenir la infección','Aliviar lo que más pesa'],supuesto:'Lo que más le pesa: no poder dormir'}},
 // Las notas de las últimas curas, con la nota de relevo; en «Nos preguntamos», la misma herida en Diraya.
 10:{type:'registro',label:'Notas ficticias · propuesta docente',title:'Notas de las últimas curas',parts:2,
  rows:[['Plan','Limpieza y apósito · 3 veces por semana'],['Visita 1','Limpieza · apósito · próxima cita'],['Visita 2','Limpieza · apósito · próxima cita'],['Visita 3','Limpieza · apósito · próxima cita'],['Para mañana','Seguir igual']],absence:['Cómo ha respondido y por qué seguimos','No consta'],
  // La misma herida en el módulo Heridas de Diraya: campos y pestañas tomados del material de formación del SAS
  // (DIRAYAbierto, 2026). La descripción es obligatoria en cada evolución; el porqué va en Observaciones.
  historia:{type:'diraya',label:'Recreación docente basada en Diraya · módulo Heridas · datos ficticios',title:'La misma herida, en el módulo Heridas',
   tabs:['Clasificación','Descripción','Intervenciones','Derivación / Alta'],
   cols:['Evolución','Alto × ancho · tejido · exudado','Resvech'],
   rows:[['1','5 × 4 cm · granulación · moderado','14'],['2','4,5 × 3,5 cm · granulación · moderado','12'],['3','4 × 3 cm · granulación · escaso','10']],
   intervenciones:'Limpieza · apósito de lecho · pauta',
   obs:{head:'Observaciones',antes:'Seguir igual',items:['Objetivo','Motivo del plan','Respuesta','Próxima revisión','Vía de consulta']},
   foot:'El informe de Heridas se puede adjuntar al Informe de Continuidad de Cuidados'}}
};
// Créditos de los modelos 3D del carro (licencia CC BY 4.0, se citan donde se ve el carro).
const ESCENA_CARRO_CREDITO='Carro modelado para la presentación · modelos CC BY 4.0 de Sketchfab: Miguel Adão, cig3d, Medicz, Stakler';
// Escena 11: lo que María del Mar recoge de la sala al volver al carro.
const ESCENA_REGRESO=['Historia y causa','Evolución','Persona','Motivo de la intervención'];
// Escena 12: tres páginas de recopilación de las 10 actuaciones.
const ESCENA_RECOPILACION=[[1,3],[4,7],[8,10]];

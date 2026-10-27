// Narrative edition (27/10/2026): the 24 scenes of RECORRIDO_NARRATIVO_24_ESCENAS.md.
// Three voices: science on the left, the wound on the right, María del Mar through the steps.
// Each step is "action | cue". Actions (space separated): tN ask turn N, iN select item N,
// pN highlight point N (p alone: all), razon reveal reasoning, practica avoid/propose, enlace bridge.
(() => {
 const turn=(label,reply,kind,resourceTitle,items,voice='principal',state='exploring')=>({label,reply,kind,resourceTitle,items,voice,state});
 const person=(label,reply,items)=>turn(label,reply,'person','Una voz recreada',items,'persona','listening');
 // Only documents attached to the project support the scientific side in this edition.
 delete REFERENCES.W21;
 delete REFERENCES.P25;
 const MOVES=[
  {short:'Conocer la historia',sub:'Registro, causa, entorno y persona'},
  {short:'Comprobar qué pasa',sub:'Medir, reevaluar, interpretar'},
  {short:'Justificar lo que hacemos',sub:'Antimicrobianos, limpieza, dolor, escara'},
  {short:'Cambiar de camino',sub:'Diagnóstico y objetivos'},
  {short:'Preparar la próxima visita',sub:'Continuidad y cinco preguntas'}
 ];
 // The five closing questions (scene 23) are the learning thread of every scene.
 [["Comprender", "¿Qué explica esta herida y qué la mantiene abierta?"], ["Acordar", "¿Qué queremos conseguir con la persona y qué es posible hoy?"], ["Decidir", "¿Por qué hacemos esta intervención?"], ["Comprobar", "¿Qué ha cambiado y con qué lo comparamos?"], ["Reevaluar", "¿Cuándo revisamos el plan o pedimos ayuda antes?"]].forEach(([short,text],i)=>Object.assign(QUESTIONS[i],{short,text}));
 const S=[
  {
    "id": "apertura",
    "mov": 0,
    "q": null,
    "title": "Valorar antes de elegir.",
    "label": "Valorar antes de elegir",
    "exp": "Antes de elegir el tratamiento tópico, diagnosticar y valorar. Hoy lo recorremos con una herida que nos enseña sus curas y con las preguntas que pueden cambiarlas.",
    "points": [
      [
        "Diagnosticar",
        "Causa y factores antes del tratamiento tópico."
      ],
      [
        "Valorar",
        "Lesión, entorno y persona."
      ],
      [
        "Sin demorar",
        "Lo necesario y lo urgente no esperan."
      ]
    ],
    "avoid": "Empezar la cura eligiendo el producto.",
    "propose": "Empezar por qué sabemos y qué información falta, sin demorar cuidados necesarios.",
    "refs": [
      "G14"
    ],
    "src": "GNEAUPP · DT XIV (2020), p. 15: diagnóstico y valoración antes del tratamiento tópico. Apertura y participación: recursos docentes.",
    "type": "Recomendación de práctica · GNEAUPP",
    "limit": "Caso docente sintético. No representa a una persona real.",
    "open": "Hola. Veo que ya está todo preparado. ¿Por dónde empezamos?",
    "turns": [
      {
        "label": "¿Qué necesitaríais saber?",
        "reply": "Antes del apósito, ¿qué os gustaría saber de mí?",
        "kind": "layers",
        "resourceTitle": "Antes de empezar",
        "items": [
          [
            "Sobre la herida",
            "¿Desde cuándo? ¿Por qué apareció?"
          ],
          [
            "Sobre las curas",
            "¿Qué se ha hecho y cómo ha respondido?"
          ],
          [
            "Sobre la persona",
            "¿Qué le preocupa? ¿Qué le duele?"
          ]
        ],
        "voice": "principal",
        "state": "listening"
      },
      {
        "label": "¿Qué llevas vivido?",
        "reply": "Llevo tiempo aquí. Podemos mirar qué me han hecho y cómo me ha ido.",
        "kind": "path",
        "resourceTitle": "Lo que vamos a conocer",
        "items": [
          [
            "Mi historia",
            "Cómo empezó todo."
          ],
          [
            "Mis curas",
            "Qué se ha probado."
          ],
          [
            "Mi evolución",
            "Qué ha cambiado."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "Mirar el material",
        "reply": "Hay de todo en ese carro. Solo falta saber qué necesito yo.",
        "kind": "facts",
        "resourceTitle": "La cura preparada",
        "items": [
          [
            "Preparado",
            "El material de la cura."
          ],
          [
            "Pendiente",
            "Saber qué necesito."
          ],
          [
            "Primero",
            "Conocer un poco mi historia."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Os enseño mis últimas curas. A ver qué nos cuentan.",
    "md": "Recoge dos preguntas, sin resolverlas todas. El caso es sintético: aprenderemos a formular mejores decisiones, sin inventar datos ni un desenlace.",
    "steps": [
      [
        "t3",
        "Deja que la herida mire el carro. No expliques todavía todo el recorrido."
      ],
      [
        "t1 p1",
        "Primera pausa con la sala: recoge dos preguntas antes de elegir el producto."
      ],
      [
        "i3 p2",
        "Incluye a la persona. G14, p. 15: diagnóstico y valoración; lo urgente no espera."
      ],
      [
        "practica",
        "Tacha elegir antes de valorar. Deja leer la pregunta, sin repetirla entera."
      ],
      [
        "enlace",
        "Guarda las preguntas de la sala para recuperarlas en la escena 22."
      ]
    ]
  },
  {
    "id": "registro",
    "mov": 0,
    "q": 3,
    "title": "Registrar la cura y su respuesta.",
    "label": "Registro y evolución",
    "exp": "Un registro de curas cuenta qué se ha hecho. Para decidir también necesitamos saber cómo ha respondido la herida. La reevaluación permite ajustar el plan y detectar complicaciones.",
    "points": [
      [
        "Intervención",
        "Qué se hizo y cuándo."
      ],
      [
        "Respuesta",
        "Cómo ha evolucionado desde entonces."
      ],
      [
        "Reevaluación",
        "Ajustar el plan y detectar complicaciones."
      ]
    ],
    "avoid": "Interpretar la repetición de cuidados como prueba de que el plan sigue siendo adecuado.",
    "propose": "Relacionar lo realizado con la evolución observada.",
    "refs": [
      "G14"
    ],
    "src": "GNEAUPP · DT XIV (2020), p. 15: seguimiento, reevaluación y ajuste del plan. Registro mostrado: recurso docente.",
    "type": "Recomendación de práctica · GNEAUPP",
    "limit": "Registro conceptual: sin fechas, medidas ni resultados reales.",
    "open": "Mis curas están apuntadas. ¿Les echamos un vistazo?",
    "turns": [
      {
        "label": "Enséñanos tu registro",
        "reply": "Limpieza, apósito, próxima cita… Mi agenda está completísima. ¿Pero voy mejor?",
        "kind": "memory",
        "resourceTitle": "Registro de intervenciones",
        "items": [
          [
            "Visita 1",
            "Cura local."
          ],
          [
            "Visita 2",
            "Se repite la cura."
          ],
          [
            "Visita 3",
            "Se repite la cura."
          ],
          [
            "¿Y la herida?",
            "Sin datos de evolución comparables."
          ]
        ],
        "voice": "principal",
        "state": "remembering"
      },
      {
        "label": "¿Qué echas en falta?",
        "reply": "Me falta saber cómo estaba en cada visita. Así podríamos comparar.",
        "kind": "layers",
        "resourceTitle": "Lo que el registro no cuenta",
        "items": [
          [
            "Cómo estaba",
            "Qué veíamos en cada visita."
          ],
          [
            "Cómo me fue",
            "Qué cambió después."
          ],
          [
            "Qué decidimos",
            "Por qué seguimos o cambiamos."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Seguimos igual?",
        "reply": "Antes de repetir, ¿sabemos si la última cura me ayudó?",
        "kind": "decision",
        "resourceTitle": "Repetir o revisar",
        "items": [
          [
            "Repetir la cura",
            "Sin datos de respuesta no sabemos si ayuda."
          ],
          [
            "Revisar el registro",
            "Relaciona intervención y evolución."
          ],
          [
            "Reevaluar",
            "Ajusta el plan y busca complicaciones."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Vemos las curas. Nos falta saber qué estamos tratando.",
    "md": "Señala que un registro puede contener muchas actuaciones y seguir dejando preguntas importantes sin responder.",
    "steps": [
      [
        "t1 m1 p1",
        "Muestra el registro y el material. Muchas actuaciones no explican por sí solas la evolución."
      ],
      [
        "cerrar i4 p2",
        "Señala el dato ausente: cómo ha respondido."
      ],
      [
        "t2 p3",
        "G14, p. 15: reevaluar permite ajustar el plan y detectar complicaciones."
      ],
      [
        "practica",
        "La pregunta sustituye a repetir sin comprobar."
      ],
      [
        "enlace",
        "Pasamos de lo que hicimos a lo que estamos tratando."
      ]
    ]
  },
  {
    "id": "historia",
    "mov": 0,
    "q": 0,
    "title": "Una causa que necesitamos conocer.",
    "label": "Etiología y diagnóstico",
    "exp": "El diagnóstico debe identificar la causa de la lesión, las enfermedades concomitantes y las complicaciones que contribuyen a ella o retrasan la cicatrización. «Herida crónica» describe la evolución; no la explica.",
    "points": [
      [
        "Causa",
        "Qué originó la lesión."
      ],
      [
        "Enfermedades concomitantes",
        "Qué condiciona la reparación."
      ],
      [
        "Complicaciones",
        "Qué la mantiene o retrasa la cicatrización."
      ]
    ],
    "avoid": "Que «herida crónica» funcione como explicación suficiente.",
    "propose": "Precisar la etiología y los factores relevantes para el plan.",
    "refs": [
      "G14"
    ],
    "src": "GNEAUPP · DT XIV (2020), p. 15: causa, enfermedades concomitantes y complicaciones.",
    "type": "Recomendación de práctica · GNEAUPP",
    "limit": "La valoración no debe demorar medidas urgentes ni cuidados necesarios.",
    "open": "En la historia pone «crónica». ¿Y por qué salí?",
    "turns": [
      {
        "label": "Cuéntanos cómo empezó",
        "reply": "Aquí pone desde cuándo estoy. El porqué sigue pendiente.",
        "kind": "memory",
        "resourceTitle": "Mi historia",
        "items": [
          [
            "Inicio",
            "Llevo mucho tiempo en esta pierna."
          ],
          [
            "Antecedentes",
            "Nos falta revisarlos."
          ],
          [
            "Curas anteriores",
            "Se han repetido curas locales."
          ],
          [
            "Sin respuesta",
            "¿Por qué aparecí?"
          ]
        ],
        "voice": "principal",
        "state": "remembering"
      },
      {
        "label": "¿Qué nos falta saber?",
        "reply": "Hay huecos en mi historia. Mejor señalarlos que rellenarlos a ojo.",
        "kind": "layers",
        "resourceTitle": "Lo que sabemos y lo que falta",
        "items": [
          [
            "Lo que sabemos",
            "Dónde estoy y desde cuándo."
          ],
          [
            "Lo que sospechamos",
            "Hay posibles causas."
          ],
          [
            "Lo que falta",
            "Comprobar la causa y cómo llega la sangre."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "Escuchar a la persona",
        "reply": "«Sé que tarda en cerrar. Lo que no entiendo es por qué me salió.»",
        "kind": "person",
        "resourceTitle": "Una voz recreada",
        "items": [
          [
            "Preguntar",
            "Qué sabe y qué le han explicado."
          ],
          [
            "Explicar",
            "Qué estamos valorando y por qué."
          ],
          [
            "Registrar",
            "Dudas y datos que aporta."
          ]
        ],
        "voice": "persona",
        "state": "listening"
      }
    ],
    "bridge": "Con la historia en mente, miradme también por fuera. Y alrededor.",
    "md": "Distingue lo documentado, lo que sospechamos y lo que necesitamos comprobar.",
    "steps": [
      [
        "t1 p1",
        "Causa: distinguir lo que consta de lo que falta. G14, p. 15."
      ],
      [
        "i4",
        "La causa pendiente se deja visible. No se inventa."
      ],
      [
        "t2 p2",
        "Revisar enfermedades concomitantes y datos que necesitamos comprobar."
      ],
      [
        "t3 m1 p3",
        "Escucha la duda de la persona y relaciona historia, comorbilidad y complicaciones."
      ],
      [
        "cerrar practica",
        "Tacha usar «crónica» como explicación suficiente."
      ],
      [
        "enlace",
        "La historia orienta la observación."
      ]
    ]
  },
  {
    "id": "zonas",
    "mov": 0,
    "q": 0,
    "title": "La valoración incluye la piel de alrededor.",
    "label": "Lecho, borde y piel",
    "exp": "La valoración incluye la lesión y su entorno: lecho, borde, piel perilesional y piel circundante. Observar y describir aporta información; una imagen aislada no sustituye la valoración clínica.",
    "points": [
      [
        "Lecho",
        "Tejido, restos y exudado."
      ],
      [
        "Borde",
        "Integridad y progresión."
      ],
      [
        "Piel perilesional",
        "Humedad e integridad."
      ],
      [
        "Piel circundante",
        "Cambios en el entorno."
      ]
    ],
    "avoid": "Reducir la valoración al aspecto del lecho.",
    "propose": "Ampliar la observación y relacionarla con la historia.",
    "refs": [
      "G14",
      "I25"
    ],
    "src": "GNEAUPP · DT XIV (2020), p. 15 · IWII 2025, recomendación 3: herida, borde y piel.",
    "type": "Recomendación y consenso internacional",
    "limit": "Esquema e imagen conceptuales: no permiten diagnosticar por color o aspecto.",
    "open": "El centro sale en todas las fotos. Los bordes también tienen cosas que contar.",
    "turns": [
      {
        "label": "Recorrer las zonas",
        "reply": "Mirad el centro, sí. Y luego seguimos hacia fuera.",
        "kind": "photo",
        "resourceTitle": "Mirar y preguntar",
        "items": [
          [
            "Lecho",
            "¿Qué describirías aquí? Tejido, restos, exudado."
          ],
          [
            "Borde",
            "¿Cómo es? ¿Ha cambiado?"
          ],
          [
            "Piel perilesional",
            "¿Está íntegra? ¿Húmeda?"
          ],
          [
            "Piel circundante",
            "¿Qué pasa más allá de la lesión?"
          ]
        ],
        "voice": "principal",
        "state": "showing"
      },
      {
        "label": "¿Qué ves y qué interpretas?",
        "reply": "Podemos contar lo que vemos y después pensar qué significa.",
        "kind": "compare",
        "resourceTitle": "Describir e interpretar",
        "items": [
          [
            "Lo que vemos",
            "Lo describimos."
          ],
          [
            "Lo que pensamos",
            "Buscamos una explicación."
          ],
          [
            "Lo que falta",
            "Lo juntamos con la historia."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Basta una foto?",
        "reply": "En la foto salgo bastante bien. Mi historia, en cambio, no cabe ahí.",
        "kind": "facts",
        "resourceTitle": "Lo que aporta una imagen",
        "items": [
          [
            "La foto ayuda",
            "A recordar y comparar."
          ],
          [
            "Se queda fuera",
            "Lo que duele y lo que ha pasado."
          ],
          [
            "Para usarla",
            "Con permiso y con su historia."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Y si otra herida se me parece, ¿necesitará lo mismo?",
    "md": "Separa descripción e interpretación: «Una cosa es lo que vemos y otra la explicación que le damos».",
    "steps": [
      [
        "t1 m1 h1 p1",
        "Recorre la imagen sin pedir un diagnóstico: lecho."
      ],
      [
        "h2 p2",
        "Borde: describir lo observado."
      ],
      [
        "h3 p3",
        "Piel perilesional."
      ],
      [
        "h4 p4",
        "Piel circundante. IWII 2025, rec. 3."
      ],
      [
        "cerrar t2",
        "Distingue observación e interpretación con una frase."
      ],
      [
        "practica",
        "La pregunta amplía la mirada."
      ],
      [
        "enlace",
        "Un aspecto parecido puede ocultar historias distintas."
      ]
    ]
  },
  {
    "id": "parecidas",
    "mov": 0,
    "q": 0,
    "voice": "dual",
    "title": "La causa y la perfusión cambian el plan.",
    "label": "Etiología y situación vascular",
    "exp": "Dos lesiones de pierna pueden parecerse y necesitar planes distintos. La etiología y la situación vascular condicionan las prioridades y la seguridad del tratamiento. No se trata de diagnosticar por la fotografía.",
    "points": [
      [
        "Historia A · venosa",
        "Integrar la cura local con el abordaje de la causa."
      ],
      [
        "Historia B · compromiso arterial",
        "Valorar perfusión y atención vascular antes de cualquier pauta automática."
      ],
      [
        "Ambas",
        "Decide la información, no el parecido."
      ]
    ],
    "avoid": "Trasladar una pauta por semejanza visual o localización.",
    "propose": "Identificar qué información cambia la decisión en cada caso.",
    "refs": [
      "G14",
      "E26"
    ],
    "src": "GNEAUPP · DT XIV (2020), pp. 20–21 · EWMA (2026), fichas de úlcera venosa e isquemia amenazante.",
    "type": "Recomendaciones y fichas clínicas",
    "limit": "Ejemplos con etiología ya establecida. No toda lesión isquémica es irreversible.",
    "open": "He venido con otra herida. Tenemos un aire, pero no la misma historia.",
    "turns": [
      {
        "label": "Escuchar la historia A",
        "reply": "En mi caso sabemos que el problema es venoso. Cambiar lo que me cubre no lo resuelve todo.",
        "kind": "facts",
        "resourceTitle": "Historia A · etiología venosa",
        "items": [
          [
            "Lo que sabemos",
            "La causa es venosa."
          ],
          [
            "Lo que preguntamos",
            "¿Se está tratando esa causa?"
          ],
          [
            "Para ampliar",
            "La mesa de compresión de las jornadas."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "Escuchar la historia B",
        "reply": "A mí me llega poca sangre. Antes de hacerme nada, hay que tener eso en cuenta.",
        "kind": "facts",
        "resourceTitle": "Historia B · perfusión comprometida",
        "items": [
          [
            "Lo que sabemos",
            "Llega poca sangre."
          ],
          [
            "Lo que preguntamos",
            "¿Qué valoración vascular hace falta?"
          ],
          [
            "Ojo",
            "Esto no decide por sí solo si podré cerrar."
          ]
        ],
        "voice": "isquemica",
        "state": "vascular"
      },
      {
        "label": "Comparar las historias",
        "reply": "Parecidas, sí. Para copiar la pauta de una a otra, mejor saber un poco más.",
        "kind": "compare",
        "resourceTitle": "Dos historias, distintas prioridades",
        "items": [
          [
            "Historia A",
            "¿Qué hacemos con la causa venosa?"
          ],
          [
            "Historia B",
            "¿Cómo llega la sangre?"
          ],
          [
            "Ambas",
            "¿Qué necesita cada persona?"
          ]
        ],
        "voice": "dual",
        "state": "comparing"
      }
    ],
    "bridge": "Volvamos a mí: además de cubrirme, ¿qué está cambiando?",
    "md": "Compara una diferencia decisiva, sin abrir dos clases completas de tratamiento vascular. No pedir que diagnostiquen por la fotografía.",
    "steps": [
      [
        "t1 m1 p1",
        "Ejemplo A con causa venosa establecida. No pedir diagnóstico por imagen."
      ],
      [
        "i2",
        "Relaciona el tratamiento local con el abordaje causal."
      ],
      [
        "t2 m2 p2",
        "Ejemplo B: la perfusión cambia prioridades y seguridad. G14, pp. 20–21."
      ],
      [
        "t3 p3",
        "Contrasta solo la diferencia que cambia el plan."
      ],
      [
        "practica",
        "Tacha copiar una pauta por parecido."
      ],
      [
        "enlace",
        "Regresa al caso principal."
      ]
    ]
  },
  {
    "id": "causa",
    "mov": 0,
    "q": 0,
    "title": "El cuidado local forma parte de un plan.",
    "label": "Factores mantenedores",
    "exp": "Cambiar la cobertura no resuelve por sí solo lo que mantiene la lesión. La intervención local se integra con el abordaje de la causa; edema y carga mecánica son ejemplos que requieren valoración e indicación específicas.",
    "points": [
      [
        "Intervención local",
        "Limpieza, cobertura, protección."
      ],
      [
        "Causa o factor mantenedor",
        "Etiología venosa, presión o carga, edema, perfusión."
      ],
      [
        "Plan integrado",
        "Cada intervención encaja con la causa."
      ]
    ],
    "avoid": "Que un cambio de cobertura sustituya la revisión de la causa.",
    "propose": "Comprobar cómo encaja cada intervención en el plan.",
    "refs": [
      "G14",
      "E22"
    ],
    "src": "GNEAUPP · DT XIV (2020), pp. 20–22: etiología venosa, situación arterial y descarga en pie diabético · EWMA 2022, §6.2.",
    "type": "Recomendaciones y revisión",
    "limit": "Compresión y descarga requieren indicación específica. No se proponen técnicas universales.",
    "open": "Hoy estreno apósito. ¿Qué esperamos que cambie?",
    "turns": [
      {
        "label": "Conectar las dos columnas",
        "reply": "Aquí está lo que me ponéis. Y aquí, lo que me mantiene abierta. ¿Lo estamos atendiendo también?",
        "kind": "compare",
        "resourceTitle": "Intervención local y causa",
        "items": [
          [
            "Cobertura nueva",
            "¿Qué esperamos que mejore?"
          ],
          [
            "Edema o causa venosa",
            "¿Se está atendiendo?"
          ],
          [
            "Presión o carga",
            "¿Se ha valorado aliviarla?"
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Qué sigue actuando?",
        "reply": "He probado varios apósitos. Me gustaría saber qué queremos conseguir con el siguiente.",
        "kind": "layers",
        "resourceTitle": "La pregunta causal",
        "items": [
          [
            "Cómo empezó",
            "La causa que conocemos."
          ],
          [
            "Qué sigue pasando",
            "Lo que puede mantenerme abierta."
          ],
          [
            "Qué hacemos",
            "Cómo responde el plan."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "Antes de otra cobertura",
        "reply": "Si cambiamos de cobertura, ¿qué esperamos que pase esta vez?",
        "kind": "decision",
        "resourceTitle": "Conversar antes de elegir",
        "items": [
          [
            "Otro producto",
            "Puede ser pertinente; no aborda por sí solo la causa."
          ],
          [
            "Revisar qué me mantiene abierta",
            "Relaciona la decisión local con la valoración."
          ],
          [
            "Completar datos",
            "Explicitar lo que aún falta."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "El plan tiene buena pinta. Vamos a ver cómo encaja en su día a día.",
    "md": "Introduce la primera búsqueda de otro camino: quizá la siguiente decisión necesaria esté fuera del apósito.",
    "steps": [
      [
        "t1 p1",
        "Relaciona intervención local y causa, sin explicar todos los tratamientos."
      ],
      [
        "i2 m1 p2",
        "Ejemplo venoso: abordaje causal con indicación. G14, pp. 20–22."
      ],
      [
        "cerrar i3",
        "Presión o carga: otra posible necesidad del plan."
      ],
      [
        "t3 m2",
        "Pregunta para pensar: ¿qué cambio esperamos de otra cobertura?"
      ],
      [
        "cerrar razon",
        "El producto puede ser pertinente, pero no sustituye a la valoración causal."
      ],
      [
        "i2 p3",
        "Conecta la decisión local con los factores mantenedores."
      ],
      [
        "practica",
        "Deja la pregunta como criterio para el próximo cambio."
      ],
      [
        "enlace",
        "El siguiente paso incluye a quien vive con la herida."
      ]
    ]
  },
  {
    "id": "persona",
    "mov": 0,
    "q": 1,
    "title": "Un plan que la persona pueda llevar.",
    "label": "Persona y plan viable",
    "exp": "La perspectiva de la persona forma parte de la valoración y de las decisiones. Un plan explicado no es necesariamente un plan comprendido y viable: dolor, comprensión, apoyo y dificultades cotidianas lo condicionan.",
    "points": [
      [
        "Comprensión",
        "¿Qué ha entendido y qué necesita aclarar?"
      ],
      [
        "Vida cotidiana",
        "Dolor, apoyo, tiempo y dificultades."
      ],
      [
        "Acuerdo",
        "Un plan que pueda sostener."
      ]
    ],
    "avoid": "Dar por hecho que un plan explicado es un plan comprendido y viable.",
    "propose": "Preguntar qué dificultades encuentra la persona y qué necesita aclarar.",
    "refs": [
      "E22",
      "I25"
    ],
    "src": "EWMA 2022, §4, pp. S15–S16: perspectiva y participación de la persona · IWII 2025, rec. 11: factores individuales.",
    "type": "Revisión y consenso",
    "limit": "Voz recreada con fines docentes; no atribuye preferencias a todas las personas.",
    "open": "Yo estoy en su pierna. El plan también tiene que caber en su vida.",
    "turns": [
      {
        "label": "Escuchar a la persona",
        "reply": "«En la consulta lo entendí. En casa me surgieron unas cuantas dudas.»",
        "kind": "person",
        "resourceTitle": "Una voz recreada",
        "items": [
          [
            "Comprender",
            "¿Qué ha quedado claro?"
          ],
          [
            "Organizar",
            "¿Quién ayuda en casa?"
          ],
          [
            "Preocupar",
            "¿Qué le inquieta más?"
          ]
        ],
        "voice": "persona",
        "state": "listening"
      },
      {
        "label": "¿Qué le cuesta más?",
        "reply": "«Por la noche me cuesta dormir. Y para las curas necesito que venga alguien.»",
        "kind": "person",
        "resourceTitle": "Una voz recreada",
        "items": [
          [
            "Dolor",
            "Cuándo aparece y cómo lo vive."
          ],
          [
            "Apoyo",
            "Quién está disponible."
          ],
          [
            "Rutina",
            "Qué cambia en su día."
          ]
        ],
        "voice": "persona",
        "state": "listening"
      },
      {
        "label": "¿Cómo lo acordamos?",
        "reply": "Antes de darlo por hecho, preguntémosle cómo se va a organizar.",
        "kind": "path",
        "resourceTitle": "Del plan al acuerdo",
        "items": [
          [
            "Escuchar",
            "Qué le cuesta."
          ],
          [
            "Explicar",
            "Qué proponemos y por qué."
          ],
          [
            "Acordar",
            "Cómo llevarlo a casa."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Ya sabemos qué le preocupa. ¿Cómo veremos si el plan ayuda?",
    "md": "Escucha antes de explicar soluciones; no atribuye preferencias concretas a todas las personas.",
    "steps": [
      [
        "t1 m1 p1",
        "Escucha la voz recreada. Comprueba comprensión sin examinar a la persona."
      ],
      [
        "t2 m2 p2",
        "Dolor, apoyos y organización: EWMA 2022, §4."
      ],
      [
        "t3 p3",
        "Acordar una propuesta viable con ella."
      ],
      [
        "practica",
        "La pregunta abre espacio para dudas y dificultades."
      ],
      [
        "enlace",
        "Del acuerdo pasamos a cómo comprobarlo."
      ]
    ]
  },
  {
    "id": "medicion",
    "mov": 1,
    "q": 3,
    "title": "Una referencia para comparar.",
    "label": "Medición y seguimiento",
    "exp": "Evaluar la evolución requiere una referencia comparable: medición y descripción con instrumentos válidos, fiables y apropiados para el tipo de lesión y el contexto. Una impresión aislada no demuestra mejora ni empeoramiento.",
    "points": [
      [
        "Referencia",
        "Situación inicial documentada."
      ],
      [
        "Instrumento",
        "Válido, fiable y apropiado para la lesión."
      ],
      [
        "Comparación",
        "El mismo método en cada revisión."
      ]
    ],
    "avoid": "Valorar la evolución solo con impresiones o usar una escala fuera de su ámbito.",
    "propose": "Establecer una referencia comparable y pertinente.",
    "refs": [
      "G14"
    ],
    "src": "GNEAUPP · DT XIV (2020), p. 15: instrumentos válidos, fiables y adecuados al contexto. Ficha de seguimiento: propuesta docente.",
    "type": "Recomendación sobre valoración y medición",
    "limit": "No se presentan medidas ni mejorías ficticias.",
    "open": "La próxima vez, ¿cómo sabremos si voy mejor?",
    "turns": [
      {
        "label": "Abrir la ficha de seguimiento",
        "reply": "La ficha está vacía. ¿Qué apuntamos hoy para poder comparar después?",
        "kind": "facts",
        "resourceTitle": "Ficha de seguimiento",
        "items": [
          [
            "Lesión",
            "Tamaño, profundidad, tejido y bordes."
          ],
          [
            "Alrededor",
            "Exudado y estado de la piel."
          ],
          [
            "Persona",
            "Dolor y cómo le va con el plan."
          ],
          [
            "Cómo medimos",
            "El método que vamos a usar."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "Dos formas de registrar",
        "reply": "«Parece mejor» suena estupendo. ¿Mejor que cuándo?",
        "kind": "compare",
        "resourceTitle": "De la impresión al registro",
        "items": [
          [
            "Registro A",
            "«Parece mejor»: sin método ni referencia."
          ],
          [
            "Registro B",
            "Mismos campos y método en cada visita."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Sirve esta herramienta?",
        "reply": "¿Esa herramienta sirve para una herida como yo?",
        "kind": "facts",
        "resourceTitle": "Cómo vamos a medir",
        "items": [
          [
            "Qué mide",
            "Lo que queremos conocer."
          ],
          [
            "Cómo mide",
            "De forma consistente."
          ],
          [
            "Para quién sirve",
            "Para este tipo de herida y situación."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Guardamos esa referencia. Si al volver sigo igual, ¿qué revisamos?",
    "md": "Pregunta: «Cuando volvamos, ¿qué datos necesitaremos para sostener que está mejor, igual o peor?».",
    "steps": [
      [
        "t1 m1 p1",
        "Establece la referencia inicial: lesión, entorno y persona."
      ],
      [
        "t2",
        "La impresión necesita una comparación."
      ],
      [
        "t3 p2",
        "G14, p. 15: instrumentos válidos, fiables y adecuados al contexto."
      ],
      [
        "i3 p3",
        "Mantener un método comparable en las revisiones."
      ],
      [
        "practica",
        "No inventes medidas ni una mejoría para el caso."
      ],
      [
        "enlace",
        "La comparación nos lleva a la siguiente revisión."
      ]
    ]
  },
  {
    "id": "reevaluacion",
    "mov": 1,
    "q": 4,
    "title": "La falta de progreso pide una revisión.",
    "label": "Reevaluación",
    "exp": "Cuando la evolución no es la esperada, se reevalúan el diagnóstico, las complicaciones, la intervención y los factores que pueden dificultar la cicatrización. Repetir o intensificar automáticamente no responde a esa pregunta.",
    "points": [
      [
        "Diagnóstico",
        "¿Sigue siendo suficiente la explicación?"
      ],
      [
        "Complicaciones",
        "Infección, perfusión u otros factores."
      ],
      [
        "Intervención",
        "Indicación, aplicación y tolerancia."
      ]
    ],
    "avoid": "Repetir o intensificar automáticamente el tratamiento.",
    "propose": "Reabrir la valoración para justificar el siguiente paso.",
    "refs": [
      "G14",
      "E22"
    ],
    "src": "GNEAUPP · DT XIV (2020), p. 15: reevaluación y ajuste del plan · EWMA 2022, §§3 y 6.",
    "type": "Recomendación de reevaluación",
    "limit": "Situación hipotética de progreso insuficiente; no se atribuye una causa única al estancamiento.",
    "open": "Otra visita. No vemos el avance que esperábamos. ¿Qué revisamos?",
    "turns": [
      {
        "label": "¿Qué revisarías primero?",
        "reply": "Antes de probar algo nuevo, ¿por dónde empezaríais a mirar?",
        "kind": "decision",
        "resourceTitle": "Antes de añadir tratamiento",
        "items": [
          [
            "Diagnóstico",
            "¿Sabemos qué me pasa?"
          ],
          [
            "Complicaciones",
            "¿Ha aparecido algo nuevo?"
          ],
          [
            "Intervención",
            "¿Se puede seguir y se tolera?"
          ],
          [
            "Persona y contexto",
            "¿Ha cambiado algo en casa?"
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Qué podría estar pasando?",
        "reply": "Tenemos varias pistas. Ahora toca ver cuáles encajan.",
        "kind": "layers",
        "resourceTitle": "Las pistas que vamos a comprobar",
        "items": [
          [
            "Una posibilidad",
            "Lo que podría estar pasando."
          ],
          [
            "Una pista",
            "Qué dato necesitamos."
          ],
          [
            "Un cambio",
            "Qué haríamos si se confirma."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "Comparar con la ficha",
        "reply": "Saquemos la ficha de la última vez. A ver qué ha cambiado de verdad.",
        "kind": "memory",
        "resourceTitle": "Una revisión con referencia",
        "items": [
          [
            "Inicio",
            "Referencia documentada."
          ],
          [
            "Ahora",
            "Misma medición, mismo método."
          ],
          [
            "Diferencia",
            "Qué ha cambiado y qué no."
          ]
        ],
        "voice": "principal",
        "state": "remembering"
      }
    ],
    "bridge": "Una posibilidad es la infección. Veamos qué datos tenemos.",
    "md": "Ordena las propuestas como hipótesis que requieren comprobación. No ofrece una única causa para cualquier estancamiento.",
    "steps": [
      [
        "t1",
        "Segunda pausa con la sala: pide dos posibilidades ante la falta de progreso."
      ],
      [
        "razon p1",
        "Reabrir el diagnóstico, sin dar una causa por confirmada."
      ],
      [
        "i2 p2",
        "Comprobar complicaciones y situación vascular."
      ],
      [
        "i3 p3",
        "Revisar aplicación y tolerancia del plan. G14, p. 15."
      ],
      [
        "t3 m1",
        "Vuelve a la referencia registrada. Ordena las aportaciones como hipótesis."
      ],
      [
        "cerrar practica",
        "Tacha intensificar automáticamente."
      ],
      [
        "enlace",
        "La infección es una posibilidad que necesita contexto."
      ]
    ]
  },
  {
    "id": "infeccion",
    "mov": 1,
    "q": 0,
    "title": "El cultivo se interpreta con la clínica.",
    "label": "Colonización e infección",
    "exp": "La presencia de microorganismos o un cultivo positivo no establecen por sí solos infección clínica. El resultado se interpreta junto con los signos, la evolución y la situación de la persona, teniendo en cuenta que en algunos contextos los signos pueden estar atenuados.",
    "points": [
      [
        "Microbiología",
        "Un dato que necesita interpretación."
      ],
      [
        "Clínica",
        "Signos locales, evolución y estado general."
      ],
      [
        "Contexto",
        "Situaciones con signos atenuados."
      ]
    ],
    "avoid": "Convertir un resultado aislado en diagnóstico y tratamiento automático.",
    "propose": "Completar la valoración clínica antes de decidir.",
    "refs": [
      "G8",
      "E22"
    ],
    "src": "GNEAUPP · DT VIII (2021), pp. 17 y 23–24: diagnóstico clínico y muestras · EWMA 2022, §3.",
    "type": "Revisión y recomendaciones sobre infección",
    "limit": "Supuesto docente: sin microorganismos ni antibiograma inventados.",
    "open": "El papel dice que tengo bacterias. Vale. ¿Qué más sabemos?",
    "turns": [
      {
        "label": "Abrir el resultado",
        "reply": "«Cultivo positivo». Hasta ahí llega el papel. ¿Cómo estoy yo?",
        "kind": "facts",
        "resourceTitle": "Un resultado",
        "items": [
          [
            "Resultado",
            "El cultivo es positivo."
          ],
          [
            "Qué sabemos",
            "Hay microorganismos en la muestra."
          ],
          [
            "Qué falta",
            "Saber si hay infección y su gravedad."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Qué falta para interpretarlo?",
        "reply": "Miremos qué ha cambiado. Y cómo se encuentra la persona.",
        "kind": "layers",
        "resourceTitle": "Completar el contexto",
        "items": [
          [
            "En la herida",
            "Dolor nuevo, cambios, exudado o extensión."
          ],
          [
            "Desde la última visita",
            "Qué ha cambiado."
          ],
          [
            "En la persona",
            "Cómo se encuentra."
          ],
          [
            "A veces",
            "Los signos se notan menos."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Qué harías con ese dato?",
        "reply": "Con este resultado solo, ¿ya tenemos bastante para decidir?",
        "kind": "decision",
        "resourceTitle": "Un resultado que necesita contexto",
        "items": [
          [
            "Tratar por el resultado",
            "El resultado aislado no establece infección ni gravedad."
          ],
          [
            "Completar la valoración",
            "Permite interpretar el hallazgo y justificar la actuación."
          ],
          [
            "Valorar la gravedad",
            "Si hay signos de gravedad, la atención no espera."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Retrocedamos un momento: ¿para qué pedimos esa muestra?",
    "md": "Hace visible la información que falta para interpretar el resultado.",
    "steps": [
      [
        "t1 m1 p1",
        "Separa el resultado microbiológico del diagnóstico clínico. G8, p. 17."
      ],
      [
        "t2 p2",
        "Relaciona signos, evolución y situación de la persona."
      ],
      [
        "i4 p3",
        "Recuerda que en algunos contextos los signos pueden estar atenuados."
      ],
      [
        "t3 razon",
        "Una decisión breve para pensar, sin abrir otro debate completo."
      ],
      [
        "i3",
        "Si hay gravedad, la atención no espera."
      ],
      [
        "practica",
        "El tachado afecta a la conclusión automática."
      ],
      [
        "enlace",
        "Haz explícito el retroceso al momento de pedir la muestra."
      ]
    ]
  },
  {
    "id": "cultivo",
    "mov": 1,
    "q": 2,
    "title": "Una muestra con una pregunta clínica.",
    "label": "Indicación de la muestra",
    "exp": "La muestra necesita una indicación, una preparación y una técnica adecuadas, y un resultado que pueda modificar la decisión. Las fuentes desaconsejan el muestreo rutinario de todas las heridas.",
    "points": [
      [
        "Indicación",
        "¿Qué sospechamos y qué necesitamos aclarar?"
      ],
      [
        "Técnica",
        "Preparación y obtención apropiadas."
      ],
      [
        "Utilidad",
        "¿Qué decisión podría cambiar el resultado?"
      ]
    ],
    "avoid": "Cultivar por costumbre o interpretar sin saber cómo se obtuvo la muestra.",
    "propose": "Explicitar la pregunta clínica y obtener información adecuada para responderla.",
    "refs": [
      "G8",
      "E26"
    ],
    "src": "GNEAUPP · DT VIII, pp. 23–24 · EWMA (2026), ficha de úlcera venosa, muestras.",
    "type": "Recomendaciones sobre toma de muestras",
    "limit": "Una evolución desfavorable exige valoración; no impone por sí sola el cultivo. No se detallan técnicas.",
    "open": "Volvamos al día de la torunda. ¿Qué queríamos averiguar?",
    "turns": [
      {
        "label": "Tres preguntas antes de la torunda",
        "reply": "¿Qué sospechamos? ¿Y qué haríamos distinto según lo que salga?",
        "kind": "path",
        "resourceTitle": "La pregunta de la muestra",
        "items": [
          [
            "¿Qué sospechamos?",
            "La duda que queremos aclarar."
          ],
          [
            "¿Qué falta saber?",
            "El dato que buscamos."
          ],
          [
            "¿Qué cambiaría?",
            "Lo que haríamos con el resultado."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Importa cómo se tomó?",
        "reply": "Cómo y de dónde se toma también importa. El bote no lo arregla después.",
        "kind": "layers",
        "resourceTitle": "Calidad de la información",
        "items": [
          [
            "Antes",
            "Preparar la zona."
          ],
          [
            "Al tomarla",
            "Elegir la muestra y la técnica adecuadas."
          ],
          [
            "Después",
            "Juntar el resultado con lo que me pasa."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "Revisar la petición",
        "reply": "¿Había una duda que resolver o era la torunda de siempre?",
        "kind": "decision",
        "resourceTitle": "Revisar el motivo",
        "items": [
          [
            "Por rutina",
            "No justifica por sí sola la utilidad clínica."
          ],
          [
            "Pregunta definida",
            "Explicita qué información cambiaría el plan."
          ],
          [
            "Evolución desfavorable",
            "Exige valorar; no impone automáticamente el cultivo."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Cuando no avanzo, también suele aparecer otra palabra: biofilm.",
    "md": "Aclara que una evolución desfavorable exige valoración; no convierte por sí sola el cultivo en obligatorio.",
    "steps": [
      [
        "t1 m1 p1",
        "Plantea el motivo antes de la muestra. G8, pp. 23–24."
      ],
      [
        "i3 p3",
        "Conecta el resultado esperado con una decisión que podría cambiar."
      ],
      [
        "t2 p2",
        "La preparación y la técnica condicionan la calidad."
      ],
      [
        "t3 razon",
        "Revisa el motivo: la costumbre no es indicación."
      ],
      [
        "i3",
        "La mala evolución exige valorar; no impone automáticamente cultivar."
      ],
      [
        "practica",
        "Deja visible una sola pregunta de utilidad clínica."
      ],
      [
        "enlace",
        "Pasamos a otra explicación que conviene examinar."
      ]
    ]
  },
  {
    "id": "biofilm",
    "mov": 1,
    "q": 0,
    "title": "Biofilm: una posibilidad que necesita contexto.",
    "label": "Biofilm y heridas de difícil cicatrización",
    "exp": "El biofilm tiene un papel en las heridas de difícil cicatrización, y su evaluación tiene límites. Conocer el mecanismo no demuestra que explique esta lesión: la hipótesis convive con la revisión de perfusión, carga, intervención y contexto.",
    "points": [
      [
        "Mecanismo",
        "Papel descrito en heridas de difícil cicatrización."
      ],
      [
        "Límites",
        "No se confirma por color o brillo de una imagen."
      ],
      [
        "Otras hipótesis",
        "Perfusión, carga, intervención y contexto."
      ]
    ],
    "avoid": "Que una hipótesis cierre prematuramente el razonamiento.",
    "propose": "Mantener la revisión de perfusión, carga, intervención y contexto.",
    "refs": [
      "E22",
      "E26"
    ],
    "src": "EWMA 2022, §§2–3: biofilm, biocarga y límites de evaluación. Comparación de hipótesis: síntesis docente.",
    "type": "Revisión y fichas de práctica",
    "limit": "El modelo ilustra el concepto; no representa biofilm observado en el caso.",
    "open": "«Será biofilm». Lo he oído más de una vez. ¿Qué significa?",
    "turns": [
      {
        "label": "¿Qué es el biofilm?",
        "reply": "Antes de ponerme otro nombre, contadme qué es.",
        "kind": "facts",
        "resourceTitle": "El concepto",
        "items": [
          [
            "Qué es",
            "Microorganismos que viven juntos, dentro de una matriz."
          ],
          [
            "Por qué importa",
            "Puede dificultar que una herida avance."
          ],
          [
            "Qué no sabemos",
            "Una foto no basta para confirmarlo."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Qué más puede influir?",
        "reply": "Puede ser una pista. ¿Y las otras cosas que estábamos mirando?",
        "kind": "layers",
        "resourceTitle": "Otras cosas que mirar",
        "items": [
          [
            "Sangre y causa",
            "¿Lo tenemos claro?"
          ],
          [
            "Carga",
            "¿Sigue habiendo presión o edema?"
          ],
          [
            "Curas",
            "¿Cómo están funcionando?"
          ],
          [
            "Vida cotidiana",
            "¿Ha cambiado algo?"
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Qué nos aclara?",
        "reply": "¿Qué nos ayuda a entender y qué sigue sin respuesta?",
        "kind": "compare",
        "resourceTitle": "Lo que sabemos y lo que falta",
        "items": [
          [
            "Una posibilidad",
            "Puede ayudar a explicar la falta de avance."
          ],
          [
            "Queda por mirar",
            "La causa y el resto del plan."
          ],
          [
            "Siguiente paso",
            "Buscar los datos que faltan."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Si pensamos en un antimicrobiano, aclaremos qué queremos tratar.",
    "md": "Pregunta: «¿Qué nos ayuda a explicar esta hipótesis y qué sigue pendiente?».",
    "steps": [
      [
        "t1 m1 h1 p1",
        "Presenta el concepto con el modelo, sin atribuirlo al caso. EWMA 2022, §2."
      ],
      [
        "h2",
        "Matriz: una explicación breve."
      ],
      [
        "h3 p2",
        "Microorganismos. El modelo no demuestra biofilm en esta herida."
      ],
      [
        "cerrar t2 p3",
        "Mantén abiertas las demás hipótesis."
      ],
      [
        "practica",
        "La palabra no cierra el razonamiento."
      ],
      [
        "enlace",
        "Del posible problema pasamos a justificar la intervención."
      ]
    ]
  },
  {
    "id": "antimicrobianos",
    "mov": 2,
    "q": 2,
    "title": "El antimicrobiano necesita una indicación.",
    "label": "Uso responsable de antimicrobianos",
    "exp": "Antibiótico, antiséptico y apósito antimicrobiano tienen funciones y alcances distintos; no se ordenan por potencia. Primero se decide si hace falta una intervención antimicrobiana y después cuál, valorando la gravedad.",
    "points": [
      [
        "Antibiótico",
        "Indicación y vía según infección y gravedad."
      ],
      [
        "Antiséptico",
        "Agente local según indicación y tolerancia."
      ],
      [
        "Apósito antimicrobiano",
        "Producto local con objetivo y revisión."
      ]
    ],
    "avoid": "El antibiótico tópico empírico rutinario y la elección «por si acaso».",
    "propose": "Seleccionar según el problema identificado, sin retrasar la atención sistémica cuando esté indicada.",
    "refs": [
      "G8",
      "E22"
    ],
    "src": "GNEAUPP · DT VIII, pp. 27–30 · EWMA 2022, §6.2.",
    "type": "Revisión y recomendaciones de uso responsable",
    "limit": "Existen indicaciones específicas. No retrasar la atención ante infección extendida o grave.",
    "open": "¿Un antimicrobiano? ¿Qué queremos tratar?",
    "turns": [
      {
        "label": "Comparar las tres",
        "reply": "Suenan parecidos, pero no hacen todos lo mismo.",
        "kind": "compare",
        "resourceTitle": "Intervenciones diferentes",
        "items": [
          [
            "Antibiótico",
            "Tiene indicaciones concretas."
          ],
          [
            "Antiséptico",
            "Se elige para el cuidado local cuando corresponde."
          ],
          [
            "Apósito antimicrobiano",
            "También necesita un motivo y una revisión."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Hace falta?",
        "reply": "Primero veamos si hace falta. Luego elegimos cuál.",
        "kind": "decision",
        "resourceTitle": "¿Hace falta una intervención antimicrobiana?",
        "items": [
          [
            "Por el resultado del cultivo",
            "Un resultado aislado no lo justifica."
          ],
          [
            "Según la valoración clínica",
            "La infección identificada y su gravedad orientan la decisión."
          ],
          [
            "Por si acaso",
            "No es una indicación; favorece el uso innecesario."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Y si empeoro?",
        "reply": "Si la cosa empeora y ella se encuentra mal, hay que pedir ayuda. No esperar al próximo apósito.",
        "kind": "facts",
        "resourceTitle": "Límites del cuidado local",
        "items": [
          [
            "Mirar",
            "Qué está cambiando y cómo se encuentra."
          ],
          [
            "Actuar",
            "Según la gravedad."
          ],
          [
            "Pedir ayuda",
            "Por la vía asistencial prevista."
          ]
        ],
        "voice": "principal",
        "state": "vascular"
      }
    ],
    "bridge": "Y si lo empezamos, dejemos pensada la revisión.",
    "md": "Primero resuelve si hace falta una intervención antimicrobiana; después, cuál puede corresponder.",
    "steps": [
      [
        "t2 razon",
        "Primero la indicación. G8, pp. 27–30: el resultado aislado no decide."
      ],
      [
        "i2",
        "La valoración clínica orienta la actuación."
      ],
      [
        "t1 m1 p1",
        "Distingue antibiótico de las intervenciones locales. No son una escalera."
      ],
      [
        "i2 p2",
        "Antiséptico: indicación y tolerancia."
      ],
      [
        "i3 p3",
        "Apósito antimicrobiano: objetivo y revisión."
      ],
      [
        "t3",
        "No retrasar atención sistémica si está indicada."
      ],
      [
        "practica",
        "Cuestiona el uso por si acaso, sin formular prohibiciones universales."
      ],
      [
        "enlace",
        "Inicio y revisión forman parte del mismo plan."
      ]
    ]
  },
  {
    "id": "revision-antimicrobiano",
    "mov": 2,
    "q": 4,
    "title": "La revisión se prepara desde el inicio.",
    "label": "Revisión del antimicrobiano · plata",
    "exp": "Iniciar un antimicrobiano incluye dejar preparada su revisión. GNEAUPP aconseja con plata en heridas infectadas un periodo inicial máximo de 14 días, seguido de una revaloración crítica de su utilidad, y no recomienda su uso extensivo, prolongado o preventivo.",
    "points": [
      [
        "Inicio",
        "Indicación y respuesta esperada."
      ],
      [
        "Revisión",
        "Plata: revaloración crítica tras un máximo inicial de 14 días."
      ],
      [
        "Decisión",
        "Continuar, retirar o cambiar con justificación."
      ]
    ],
    "avoid": "Renovar por inercia.",
    "propose": "Revisar respuesta e indicación, sin trasladar el plazo de la plata a todos los antimicrobianos.",
    "refs": [
      "G8",
      "E22"
    ],
    "src": "GNEAUPP · DT VIII, p. 38 · EWMA 2022, §6.",
    "type": "Recomendación específica sobre plata",
    "limit": "Los 14 días se refieren a la plata en heridas infectadas; no se extrapolan.",
    "open": "Recuerdo cuándo empezamos. ¿Cuándo miramos si sigue haciendo falta?",
    "turns": [
      {
        "label": "¿Cuándo volvemos a mirarlo?",
        "reply": "Este tratamiento y yo ya tenemos confianza. ¿Seguimos necesitándonos?",
        "kind": "memory",
        "resourceTitle": "Desde el inicio hasta la revisión",
        "items": [
          [
            "Al empezar",
            "Para qué se usa y qué esperamos."
          ],
          [
            "Al revisar",
            "Qué ha cambiado y cómo ha ido."
          ],
          [
            "Al decidir",
            "Seguir, retirar o cambiar."
          ]
        ],
        "voice": "principal",
        "state": "remembering"
      },
      {
        "label": "¿Qué significa «14 días»?",
        "reply": "Con la plata hay una revisión que no conviene despistar. María del Mar os cuenta el detalle.",
        "kind": "facts",
        "resourceTitle": "Alcance de la recomendación",
        "items": [
          [
            "Fuente",
            "GNEAUPP DT VIII, p. 38."
          ],
          [
            "Se refiere a",
            "Plata en heridas infectadas."
          ],
          [
            "Qué pide",
            "Revisar críticamente su utilidad tras un máximo inicial de 14 días."
          ],
          [
            "Qué desaconseja",
            "Usarla de forma extensa, prolongada o preventiva."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "Preparar la revisión",
        "reply": "¿Qué dejamos apuntado para que la próxima vez podamos decidir?",
        "kind": "decision",
        "resourceTitle": "Justificar la continuidad",
        "items": [
          [
            "Respuesta favorable",
            "Relacionar con objetivo e indicación."
          ],
          [
            "Respuesta insuficiente",
            "Revisar diagnóstico y plan; no prorrogar por inercia."
          ],
          [
            "Deterioro",
            "Revalorar antes si la situación lo requiere."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Además de lo que ponemos, revisemos algo de cada cura: la limpieza.",
    "md": "Relaciona la continuidad con una justificación clínica, no únicamente con el calendario.",
    "steps": [
      [
        "t1 p1",
        "Deja claro el objetivo y la respuesta esperada."
      ],
      [
        "t2 m1 p2",
        "G8, p. 38: plata en heridas infectadas, máximo inicial de 14 días y revaloración crítica."
      ],
      [
        "i4",
        "No recomienda uso extensivo, prolongado o preventivo. No extrapoles el plazo."
      ],
      [
        "t3 razon p3",
        "Continuar, retirar o cambiar requiere justificación."
      ],
      [
        "i2",
        "Respuesta insuficiente: revisar el diagnóstico y el plan."
      ],
      [
        "practica",
        "El calendario ayuda a revisar; no decide por sí solo."
      ],
      [
        "enlace",
        "Ahora la limpieza, otro gesto que necesita un objetivo."
      ]
    ]
  },
  {
    "id": "limpieza",
    "mov": 2,
    "q": 2,
    "title": "La limpieza se adapta a la herida.",
    "label": "Limpieza de herida y piel",
    "exp": "La limpieza terapéutica abarca la herida y la piel. Solución, técnica y fuerza se seleccionan según la valoración, los objetivos y las características de cada zona. No es un ritual idéntico en todas las lesiones.",
    "points": [
      [
        "Zonas",
        "Lecho, borde, piel perilesional y circundante."
      ],
      [
        "Selección",
        "Solución, técnica y fuerza según valoración."
      ],
      [
        "Objetivo",
        "Qué pretende la limpieza en esta herida."
      ]
    ],
    "avoid": "Una receta idéntica para todas las lesiones o atender solo al lecho.",
    "propose": "Individualizar la limpieza según zonas, objetivo y tolerancia.",
    "refs": [
      "G17",
      "I25"
    ],
    "src": "GNEAUPP · DT XVII (2023) · IWII 2025, recomendación 3 y 11, p. 31: zonas y selección de técnica.",
    "type": "Documento técnico y consenso internacional",
    "limit": "Limpieza y desbridamiento no son equivalentes. Presión y temperatura requieren contexto.",
    "open": "Esto lo hacemos en cada cura. ¿Hoy qué necesitamos limpiar?",
    "turns": [
      {
        "label": "Volver a las zonas",
        "reply": "¿Os acordáis de mis bordes y de la piel? También están invitados a la limpieza.",
        "kind": "photo",
        "resourceTitle": "Limpiar por zonas",
        "items": [
          [
            "Lecho",
            "Restos y exudado, según lo que necesite."
          ],
          [
            "Borde",
            "Limpiar sin dañarlo."
          ],
          [
            "Piel perilesional",
            "Limpiar y proteger la piel cercana."
          ],
          [
            "Piel circundante",
            "También cuenta la piel de alrededor."
          ]
        ],
        "voice": "principal",
        "state": "showing"
      },
      {
        "label": "¿Siempre igual?",
        "reply": "Si algo ha cambiado, quizá hoy necesite otra forma de limpiar.",
        "kind": "path",
        "resourceTitle": "Elegir con un objetivo",
        "items": [
          [
            "Mirar",
            "Qué necesita cada zona."
          ],
          [
            "Elegir",
            "Con qué y cómo limpiar."
          ],
          [
            "Comprobar",
            "Cómo lo tolera y cómo responde."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Con qué y con cuánta fuerza?",
        "reply": "Que limpie lo que hace falta y que me siente bien. Veamos cómo hacerlo.",
        "kind": "facts",
        "resourceTitle": "Solución, técnica y fuerza",
        "items": [
          [
            "Con qué",
            "La solución que corresponde."
          ],
          [
            "Cómo",
            "La técnica para cada zona."
          ],
          [
            "Con cuánta fuerza",
            "La necesaria, cuidando la tolerancia."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Mientras limpiamos, hay otra cosa que escuchar: cómo lo está viviendo ella.",
    "md": "Recupera el vínculo con la observación inicial: lo que miramos también debe orientar cómo actuamos.",
    "steps": [
      [
        "t1 m1 h1 p1",
        "Recupera la imagen conocida: ahora la miramos para decidir cómo limpiar. Lecho."
      ],
      [
        "h2",
        "Borde. No repitas toda la valoración de la escena 4."
      ],
      [
        "h3",
        "Piel perilesional."
      ],
      [
        "h4",
        "Piel circundante."
      ],
      [
        "t2 m2 p2",
        "IWII 2025, rec. 11: selección según herida, piel, objetivos y persona."
      ],
      [
        "cerrar i3 p3",
        "Comprobar tolerancia y respuesta. Limpieza y desbridamiento no son equivalentes."
      ],
      [
        "practica",
        "Retira los detalles para dejar la pregunta."
      ],
      [
        "enlace",
        "Da paso a la experiencia de la persona."
      ]
    ]
  },
  {
    "id": "dolor",
    "mov": 2,
    "q": 3,
    "title": "El dolor se anticipa y se revisa.",
    "label": "Dolor durante la cura",
    "exp": "El dolor se valora antes, se anticipa su manejo, se adapta la técnica durante el procedimiento y se evalúa después. Normalizarlo o mantener una técnica sin revisar su tolerancia no forma parte de un cuidado justificado.",
    "points": [
      [
        "Antes",
        "Valorar, explicar y planificar el manejo."
      ],
      [
        "Durante",
        "Adaptar técnica y fuerza; atender la tolerancia."
      ],
      [
        "Después",
        "Evaluar la respuesta y ajustar."
      ]
    ],
    "avoid": "Normalizar el dolor del procedimiento o mantener una técnica sin revisar su tolerancia.",
    "propose": "Ajustar el cuidado según la experiencia individual.",
    "refs": [
      "I25",
      "G14"
    ],
    "src": "IWII 2025, recomendación 13, pp. 39–40 · GNEAUPP · DT XIV, p. 28.",
    "type": "Consenso y recomendación de práctica",
    "limit": "No se establecen tiempos analgésicos universales.",
    "open": "La última cura le dolió. Mejor que os lo cuente ella.",
    "turns": [
      {
        "label": "Escuchar a la persona",
        "reply": "«La última vez me dolió. ¿Podemos hablarlo antes de empezar?»",
        "kind": "person",
        "resourceTitle": "Una voz recreada",
        "items": [
          [
            "Preguntar",
            "Cómo estoy y qué pasó la última vez."
          ],
          [
            "Explicar",
            "Qué vamos a hacer."
          ],
          [
            "Preparar",
            "Cómo vamos a manejar el dolor."
          ]
        ],
        "voice": "persona",
        "state": "discomfort"
      },
      {
        "label": "Durante la cura",
        "reply": "«Si me duele, os aviso. Paramos un momento y vemos cómo seguir.»",
        "kind": "person",
        "resourceTitle": "Una voz recreada",
        "items": [
          [
            "Escuchar",
            "Lo que siento durante la cura."
          ],
          [
            "Adaptar",
            "Cómo se hace y con cuánta fuerza."
          ],
          [
            "Revisar",
            "Si necesitamos cambiar algo."
          ]
        ],
        "voice": "persona",
        "state": "discomfort"
      },
      {
        "label": "¿Qué cambiamos la próxima vez?",
        "reply": "Antes de irnos, ¿qué dejamos preparado para que la próxima vaya mejor?",
        "kind": "outcomes",
        "resourceTitle": "Reevaluar la experiencia",
        "items": [
          [
            "Cómo fue",
            "Qué dolió y cómo lo toleró."
          ],
          [
            "Qué apuntamos",
            "Lo que hicimos y su respuesta."
          ],
          [
            "Para la próxima",
            "Qué mantener y qué ajustar."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Hemos hablado de cómo hacerlo. A veces toca preguntar si conviene hacerlo ahora.",
    "md": "Pregunta qué cambiaríamos en la siguiente cura y cómo comprobaríamos el efecto. No introduce tiempos analgésicos universales.",
    "steps": [
      [
        "t1 m2 p1",
        "Antes: valorar y planificar el manejo del dolor."
      ],
      [
        "t2 p2",
        "Durante: escuchar y adaptar la técnica. IWII 2025, rec. 13."
      ],
      [
        "t3 m1 p3",
        "Después: evaluar y registrar qué ajustar. Sin prometer un resultado."
      ],
      [
        "practica",
        "Deja la experiencia de la persona como foco, sin humor en este momento."
      ],
      [
        "enlace",
        "De cómo intervenir pasamos a si corresponde intervenir."
      ]
    ]
  },
  {
    "id": "escaras",
    "mov": 2,
    "q": 2,
    "voice": "isquemica",
    "title": "La seguridad antes del desbridamiento.",
    "label": "Escara seca y desbridamiento",
    "exp": "La presencia de tejido necrótico no basta para decidir. Perfusión, estabilidad y signos de complicación condicionan el desbridamiento cortante. En lesiones isquémicas con escara seca sin revascularizar no se recomienda aplicar ambiente húmedo de forma automática.",
    "points": [
      [
        "Perfusión",
        "Situación vascular y posibilidad de revascularización."
      ],
      [
        "Estabilidad y complicaciones",
        "Estado de la escara y cambios que alteran la prioridad."
      ],
      [
        "Persona y objetivos",
        "Dolor, situación clínica y beneficio esperado."
      ]
    ],
    "avoid": "Decidir únicamente por la presencia de tejido necrótico.",
    "propose": "Valorar seguridad y contexto antes de intervenir.",
    "refs": [
      "G14",
      "E26"
    ],
    "src": "GNEAUPP · DT XIV, pp. 21 y 28 · EWMA (2026), ficha de isquemia amenazante.",
    "type": "Recomendaciones con condiciones específicas",
    "limit": "No es una prohibición universal de todos los métodos. La gravedad requiere atención oportuna.",
    "open": "Soy otra herida, en un talón. Antes de quitar esa escara, ¿qué falta saber?",
    "turns": [
      {
        "label": "Abrir la situación",
        "reply": "Han propuesto quitarme la escara. Aún no sabemos cómo me llega la sangre.",
        "kind": "facts",
        "resourceTitle": "Punto de partida",
        "items": [
          [
            "Dónde estoy",
            "En el talón."
          ],
          [
            "Qué vemos",
            "Una escara seca."
          ],
          [
            "Qué se propone",
            "Retirarla con desbridamiento cortante."
          ]
        ],
        "voice": "isquemica",
        "state": "listening"
      },
      {
        "label": "¿Qué dato cambia la decisión?",
        "reply": "Primero reunamos lo que falta. Luego decidimos.",
        "kind": "layers",
        "resourceTitle": "Información de seguridad",
        "items": [
          [
            "La sangre",
            "Cómo llega y qué valoración hace falta."
          ],
          [
            "La escara",
            "Si está estable o hay cambios."
          ],
          [
            "La persona",
            "Cómo está y qué queremos conseguir."
          ]
        ],
        "voice": "isquemica",
        "state": "vascular"
      },
      {
        "label": "Contrastar posibilidades",
        "reply": "Ver algo que quitar no nos dice todavía si es seguro hacerlo.",
        "kind": "decision",
        "resourceTitle": "Antes de actuar",
        "items": [
          [
            "Actuar por el aspecto",
            "No incorpora perfusión ni estabilidad."
          ],
          [
            "Completar la valoración",
            "Permite justificar técnica, objetivo y seguridad."
          ],
          [
            "Escalar por complicación",
            "Ante gravedad, no esperar al control ordinario."
          ]
        ],
        "voice": "isquemica",
        "state": "vascular"
      }
    ],
    "bridge": "A veces falta información para actuar. Otras, la historia necesita otra explicación.",
    "md": "Explica por qué una regla general no resuelve todos los casos.",
    "steps": [
      [
        "t1 m1",
        "Contrapunto: talón con escara seca y propuesta de desbridamiento cortante."
      ],
      [
        "h1 p1",
        "Primer dato: perfusión. G14, pp. 21 y 28."
      ],
      [
        "h2 p2",
        "Estabilidad, drenaje y otros signos de complicación."
      ],
      [
        "h3 p3",
        "Integra a la persona, sus objetivos y la gravedad."
      ],
      [
        "cerrar t3 razon",
        "Contrasta actuar por el aspecto con completar la valoración."
      ],
      [
        "i2",
        "No generalices la recomendación a todos los métodos o situaciones."
      ],
      [
        "practica",
        "Tacha decidir solo por la necrosis."
      ],
      [
        "enlace",
        "El siguiente contraste nos hace revisar la explicación."
      ]
    ]
  },
  {
    "id": "atipica",
    "mov": 3,
    "q": 0,
    "title": "Cuando no encaja, revisar el diagnóstico.",
    "label": "Heridas atípicas e inflamatorias",
    "exp": "Algunas lesiones inflamatorias pueden parecer infecciosas. Cuando la evolución no encaja, el diagnóstico preciso y la valoración especializada ayudan a evitar tanto el sobretratamiento como el infratratamiento de la infección.",
    "points": [
      [
        "Reconocer",
        "Hallazgos o evolución que no encajan."
      ],
      [
        "Reconsiderar",
        "Una lesión inflamatoria puede parecer infecciosa."
      ],
      [
        "Consultar",
        "Documentar y solicitar valoración especializada."
      ]
    ],
    "avoid": "Acumular intervenciones sobre la misma explicación cuando la evolución no encaja.",
    "propose": "Reconsiderar el diagnóstico y consultar.",
    "refs": [
      "E26"
    ],
    "src": "EWMA (2026), ficha 1, pp. 3–6.",
    "type": "Ficha clínica sobre lesiones atípicas",
    "limit": "No se propone diagnosticar por imagen ni reconocer una enfermedad concreta.",
    "open": "¿Y si estamos tratando otra cosa?",
    "turns": [
      {
        "label": "¿Qué no encaja?",
        "reply": "Hemos probado varias cosas y no va como esperábamos. ¿Nos falta alguna pieza?",
        "kind": "layers",
        "resourceTitle": "Explicitar la incertidumbre",
        "items": [
          [
            "Evolución",
            "No avanza como esperábamos."
          ],
          [
            "Lo que vemos",
            "Hay cosas que no encajan."
          ],
          [
            "Lo que hacemos",
            "La respuesta tampoco es la esperada."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "Mirar un contraste",
        "reply": "Esta es otra herida, un ejemplo. No hace falta adivinar su nombre: veamos qué no encaja.",
        "kind": "facts",
        "resourceTitle": "Un contraste breve",
        "items": [
          [
            "Mirar",
            "Describir lo que llama la atención."
          ],
          [
            "Relacionar",
            "Juntarlo con la historia."
          ],
          [
            "Consultar",
            "Pedir otra valoración si no encaja."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Qué decisión revisamos?",
        "reply": "Antes de subir la intensidad, ¿seguimos pensando que me pasa lo mismo?",
        "kind": "decision",
        "resourceTitle": "De la incertidumbre a la consulta",
        "items": [
          [
            "Intensificar sin revisar",
            "Mantiene una explicación posiblemente insuficiente."
          ],
          [
            "Reconsiderar y documentar",
            "Aclara la incertidumbre y el motivo de consulta."
          ],
          [
            "Consultar",
            "Valoración especializada según evolución y gravedad."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Si cambia lo que entendemos, también puede cambiar lo que esperamos conseguir.",
    "md": "Recupera la pregunta de la escena 3: «¿Seguimos teniendo una explicación suficiente?».",
    "steps": [
      [
        "t1 p1",
        "Recupera la pregunta sobre la causa, sin repetir el bloque inicial."
      ],
      [
        "t2 m1 p2",
        "EWMA, ficha 1, pp. 3–6: algunas lesiones inflamatorias parecen infecciosas."
      ],
      [
        "cerrar t3 razon",
        "Contrasta intensificar con revisar la explicación."
      ],
      [
        "i2 p3",
        "Documentar la incertidumbre y solicitar valoración especializada."
      ],
      [
        "practica",
        "La consulta forma parte del cuidado."
      ],
      [
        "enlace",
        "De revisar el diagnóstico pasamos a ajustar expectativas."
      ]
    ]
  },
  {
    "id": "capacidad",
    "mov": 3,
    "q": 1,
    "title": "Objetivos posibles y revisables.",
    "label": "Posibilidad de cicatrización y objetivos",
    "exp": "La valoración de la herida y de la persona orienta los objetivos. El consenso IWII contempla objetivos de cicatrización, prevención de infección o manejo paliativo. Las prioridades y la viabilidad del cuidado se acuerdan con la persona y se revisan.",
    "points": [
      [
        "Valorar",
        "Causa, estado de la lesión y situación de la persona."
      ],
      [
        "Acordar",
        "Prioridades, posibilidades y viabilidad del cuidado."
      ],
      [
        "Revisar",
        "Qué beneficio buscamos y cuándo reconsiderarlo."
      ]
    ],
    "avoid": "Prometer el cierre o descartarlo solo por antigüedad o etiqueta diagnóstica.",
    "propose": "Valorar las posibilidades actuales y acordar objetivos.",
    "refs": [
      "G14",
      "E22",
      "I25"
    ],
    "src": "GNEAUPP · DT XIV, p. 15 · EWMA 2022, §4, pp. S15–S16 · IWII 2025, p. 26. Organización de objetivos: síntesis docente.",
    "type": "Recomendación, revisión y consenso · síntesis docente",
    "limit": "Los objetivos se individualizan. No se clasifica el pronóstico ni se atribuye imposibilidad de cierre a una etiología. El contrapunto es hipotético.",
    "open": "Con lo que sabemos ahora, ¿qué podemos conseguir?",
    "turns": [
      {
        "label": "¿Qué podemos conseguir?",
        "reply": "Me gustaría cerrar. Veamos qué es posible hoy y qué falta para acercarnos.",
        "kind": "compare",
        "resourceTitle": "Qué es posible hoy",
        "items": [
          [
            "Qué sabemos",
            "La causa y cómo estoy hoy."
          ],
          [
            "Qué falta",
            "Las barreras y lo que podemos cambiar."
          ],
          [
            "Qué acordamos",
            "Un objetivo que podamos revisar."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "Escuchar a otra herida",
        "reply": "Yo soy otra historia. Hoy buscamos aliviar lo que más molesta. También hay mucho que hacer.",
        "kind": "facts",
        "resourceTitle": "Otra situación",
        "items": [
          [
            "Hoy",
            "Buscamos aliviar en este ejemplo."
          ],
          [
            "La pregunta",
            "¿Qué nos ayudaría más?"
          ],
          [
            "Cada historia",
            "No todas las heridas del mismo tipo son iguales."
          ]
        ],
        "voice": "paliativa",
        "state": "listening"
      },
      {
        "label": "¿Qué cambia y qué continúa?",
        "reply": "Cambia lo que buscamos. Seguimos cuidando y viendo cómo va.",
        "kind": "compare",
        "resourceTitle": "Un cambio de objetivo",
        "items": [
          [
            "Cambia",
            "Lo que queremos mejorar."
          ],
          [
            "Continúa",
            "El cuidado y el seguimiento."
          ],
          [
            "Revisamos",
            "Cómo va y si el objetivo sigue teniendo sentido."
          ]
        ],
        "voice": "paliativa",
        "state": "relief"
      }
    ],
    "bridge": "Si buscamos aliviar, pongámosle nombre a la mejora que le importa.",
    "md": "Vuelve a la pregunta de la mesa con los datos disponibles. Diferencia las opciones contempladas por IWII de esta organización docente. No uses una clasificación pronóstica ni atribuyas una frase del caso a una guía.",
    "steps": [
      [
        "t1 p1",
        "Recupera la pregunta de la mesa. La valoración orienta el objetivo."
      ],
      [
        "i2 p2",
        "Explora las barreras y la viabilidad del plan, sin culpabilizar."
      ],
      [
        "t2 p3",
        "Contrapunto docente: objetivo de alivio. IWII 2025, p. 26; EWMA 2022, §4."
      ],
      [
        "t3 m1",
        "Explica que cambiar el objetivo conserva el cuidado y la revisión."
      ],
      [
        "practica",
        "No prometer ni descartar el cierre por una etiqueta."
      ],
      [
        "enlace",
        "Aterriza el objetivo en una mejora concreta."
      ]
    ]
  },
  {
    "id": "otros-resultados",
    "mov": 3,
    "q": 3,
    "title": "Una mejora que importe a la persona.",
    "label": "Síntomas y calidad de vida",
    "exp": "Dolor, fugas, olor, sangrado y carga de cuidados pueden ser resultados relevantes. Se acuerdan con la persona, de forma individualizada, y se evalúan respecto al objetivo pactado.",
    "points": [
      [
        "Síntomas",
        "Dolor, fugas, olor, sangrado."
      ],
      [
        "Carga",
        "Esfuerzo y tiempo de los cuidados."
      ],
      [
        "Evaluación",
        "Cómo comprobaremos la mejora acordada."
      ]
    ],
    "avoid": "Medir el beneficio únicamente por el cierre.",
    "propose": "Acordar qué mejora se busca y cómo comprobarla.",
    "refs": [
      "E22",
      "I25",
      "G14"
    ],
    "src": "EWMA 2022, §4, pp. S15–S16 · IWII 2025, rec. 13, pp. 39–40 · GNEAUPP DT XIV, p. 24: trauma y sangrado en lesiones neoplásicas. Seguimiento: síntesis docente.",
    "type": "Revisión, consenso y recomendaciones con ámbito específico",
    "limit": "El sangrado y la retirada atraumática se apoyan aquí en recomendaciones sobre heridas neoplásicas. Las prioridades del caso son recreadas; no se prometen resultados.",
    "open": "Antes de hacer la lista, preguntémosle qué le gustaría mejorar.",
    "turns": [
      {
        "label": "Escuchar a la persona",
        "reply": "«Me gustaría dormir mejor. Y que las curas me ocuparan menos el día.»",
        "kind": "person",
        "resourceTitle": "Una voz recreada",
        "items": [
          [
            "Escuchar",
            "Qué le gustaría que cambiara."
          ],
          [
            "Priorizar",
            "Por dónde quiere empezar."
          ],
          [
            "Concretar",
            "Cómo notaría esa mejora."
          ]
        ],
        "voice": "persona",
        "state": "listening"
      },
      {
        "label": "Elegir prioridades",
        "reply": "Hay varias cosas que pueden mejorar. ¿Cuál le importa más ahora?",
        "kind": "outcomes",
        "resourceTitle": "Dimensiones que explorar",
        "items": [
          [
            "Dolor",
            "Durante las curas y entre ellas."
          ],
          [
            "Fugas",
            "Cuándo ocurren y qué le dificultan."
          ],
          [
            "Olor",
            "Cómo afecta a su día a día."
          ],
          [
            "Sangrado",
            "Si aparece al retirar o durante la cura."
          ],
          [
            "Carga de cuidados",
            "Tiempo, esfuerzo y ayuda que necesita."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "Conectar prioridad y registro",
        "reply": "Si elegimos una mejora, dejemos apuntado cómo vamos a reconocerla.",
        "kind": "path",
        "resourceTitle": "Una mejora que podamos revisar",
        "items": [
          [
            "Acordar",
            "Qué queremos mejorar."
          ],
          [
            "Apuntar",
            "Cómo estamos hoy."
          ],
          [
            "Volver a mirar",
            "Qué ha mejorado y qué cuesta el cuidado."
          ]
        ],
        "voice": "principal",
        "state": "relief"
      }
    ],
    "bridge": "Y que quien venga mañana sepa qué hemos acordado.",
    "md": "Conecta cada prioridad elegida con una evaluación posterior.",
    "steps": [
      [
        "t1 m1",
        "Escucha la prioridad de la persona, sin asumir que todas elegirán lo mismo."
      ],
      [
        "t2 p1",
        "EWMA 2022, §4: impacto de síntomas y cuidado en la vida cotidiana."
      ],
      [
        "i5 m2 p2",
        "Incluye tiempo, esfuerzo y apoyo en la carga del cuidado."
      ],
      [
        "t3 p3",
        "Conecta una prioridad con una referencia que permita revisarla."
      ],
      [
        "practica",
        "El cierre no agota los resultados relevantes."
      ],
      [
        "enlace",
        "El acuerdo necesita continuidad entre profesionales."
      ]
    ]
  },
  {
    "id": "continuidad",
    "mov": 4,
    "q": 4,
    "title": "Un plan que continúe en la próxima visita.",
    "label": "Continuidad asistencial",
    "exp": "La continuidad requiere documentar objetivo, intervención, respuesta y próxima revisión, y compartir una vía de consulta. Hay que distinguir el seguimiento programado de los cambios que exigen valorar antes.",
    "points": [
      [
        "Documentar",
        "Objetivo, intervención, respuesta y próxima revisión."
      ],
      [
        "Coordinar",
        "Responsable y vía de consulta."
      ],
      [
        "Anticipar",
        "Qué cambios requieren valoración antes."
      ]
    ],
    "avoid": "Reconstruir o repetir el plan sin conocer su razonamiento.",
    "propose": "Compartir información útil y una vía asistencial de consulta.",
    "refs": [
      "E22",
      "E26"
    ],
    "src": "EWMA 2022, §§4–6: participación, comunicación y coordinación · EWMA, fichas de infección e isquemia. Relevo propuesto: síntesis docente.",
    "type": "Recomendaciones sobre continuidad y escalada",
    "limit": "El circuito concreto se adapta al área asistencial; no se inventan contactos ni plazos locales.",
    "open": "Mañana viene otra compañera. ¿Le dejamos claro por dónde vamos?",
    "turns": [
      {
        "label": "Preparar el relevo",
        "reply": "Que no tenga que empezar mi historia desde cero. ¿Qué le contamos?",
        "kind": "path",
        "resourceTitle": "Un relevo en un minuto",
        "items": [
          [
            "Objetivo",
            "Qué queremos conseguir con ella."
          ],
          [
            "Intervención",
            "Qué hacemos y por qué."
          ],
          [
            "Respuesta",
            "Cómo le ha ido."
          ],
          [
            "Próxima revisión",
            "Cuándo y qué vamos a mirar."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Y si algo cambia antes?",
        "reply": "Y si algo cambia antes de la cita, ¿qué hacemos?",
        "kind": "layers",
        "resourceTitle": "Programado y no demorable",
        "items": [
          [
            "La próxima cita",
            "El control que hemos previsto."
          ],
          [
            "Si cambia antes",
            "Volver a valorar sin esperar."
          ],
          [
            "Si hay gravedad",
            "Pedir atención a tiempo por la vía prevista."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "Escuchar a la persona",
        "reply": "«En casa, si algo cambia, ¿a quién llamo?»",
        "kind": "person",
        "resourceTitle": "Una voz recreada",
        "items": [
          [
            "Quién",
            "La persona o el equipo de referencia."
          ],
          [
            "Cómo",
            "La vía de consulta que corresponda."
          ],
          [
            "En casa",
            "Que quede claro qué hacer."
          ]
        ],
        "voice": "persona",
        "state": "listening"
      }
    ],
    "bridge": "Ya podemos volver al carro del principio. ¿Empezaríamos igual?",
    "md": "Vincula el circuito con su contexto real, sin inventar contactos ni plazos locales.",
    "steps": [
      [
        "t1 p1",
        "EWMA 2022, §§4–6: información compartida y coordinación. El relevo es una síntesis docente."
      ],
      [
        "i4",
        "Deja prevista la próxima revisión."
      ],
      [
        "t2 p3",
        "Distingue revisión programada y deterioro que requiere atención antes."
      ],
      [
        "t3 m1 p2",
        "María del Mar explica la vía real de consulta de su área. No inventes contactos."
      ],
      [
        "practica",
        "El plan incluye su motivo, la respuesta y cómo pedir ayuda."
      ],
      [
        "enlace",
        "Regresa al inicio con otra forma de decidir."
      ]
    ]
  },
  {
    "id": "regreso",
    "mov": 4,
    "q": 2,
    "title": "La primera decisión, revisada.",
    "label": "Reconstruir la decisión",
    "exp": "Reconstruimos la secuencia: información disponible, datos pendientes, objetivo, intervención y evaluación. El final no es elegir otro producto, sino explicar qué pregunta modificaría la siguiente decisión y por qué.",
    "points": [
      [
        "Información",
        "Lo que sabemos y lo que falta."
      ],
      [
        "Objetivo",
        "Lo que buscamos con la persona."
      ],
      [
        "Intervención y evaluación",
        "Por qué y cómo lo comprobaremos."
      ]
    ],
    "avoid": "Convertir el final en «ahora elegimos otro producto».",
    "propose": "Explicar qué pregunta modificaría la siguiente decisión y por qué.",
    "refs": [
      "G14",
      "G8",
      "E22",
      "I25"
    ],
    "src": "Integración docente de GNEAUPP DT XIV, p. 15; DT VIII, pp. 23–30; EWMA 2022, §4; IWII 2025, rec. 11 y 13. Sin algoritmo ni resultado clínico validado.",
    "type": "Integración docente",
    "limit": "No se presenta una cicatrización ficticia como demostración.",
    "open": "El mismo carro y yo otra vez. ¿Por dónde empezaríais ahora?",
    "turns": [
      {
        "label": "Recuperar vuestras preguntas",
        "reply": "Al principio salieron varias preguntas. ¿Cuál haríais primero ahora?",
        "kind": "memory",
        "resourceTitle": "Las preguntas del principio",
        "items": [
          [
            "Al empezar",
            "Lo que queríamos saber."
          ],
          [
            "Ahora",
            "Qué preguntaríamos primero."
          ],
          [
            "Pendiente",
            "Lo que todavía falta comprobar."
          ]
        ],
        "voice": "principal",
        "state": "remembering"
      },
      {
        "label": "¿Por dónde empezamos?",
        "reply": "Contadme por dónde empezaríamos. El apósito puede esperar un momento.",
        "kind": "path",
        "resourceTitle": "La primera decisión, paso a paso",
        "items": [
          [
            "Información",
            "Lo que sabemos."
          ],
          [
            "Pendiente",
            "Lo que falta."
          ],
          [
            "Objetivo",
            "Lo que queremos conseguir con ella."
          ],
          [
            "Intervención",
            "Qué hacemos y cómo veremos si ayuda."
          ],
          [
            "Evaluación",
            "Cuándo volvemos a mirarlo."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Qué harías distinto?",
        "reply": "Elegid una cosa que haríais distinta. Con una tenemos para empezar.",
        "kind": "decision",
        "resourceTitle": "Una cosa para cambiar",
        "items": [
          [
            "Revisar la cura",
            "Qué cambiaríamos y por qué."
          ],
          [
            "Completar datos",
            "Qué nos falta saber."
          ],
          [
            "Preparar la revisión",
            "Qué mirar y cuándo pedir ayuda."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Vamos a quedarnos con cinco preguntas para la próxima cura.",
    "md": "Pide al público que justifique un cambio concreto. No presenta una cicatrización ficticia como demostración del método.",
    "steps": [
      [
        "t1 m1",
        "Breve regreso a la sala: recupera las preguntas iniciales. Una o dos aportaciones."
      ],
      [
        "cerrar t2 p1",
        "Reconstruye lo que sabemos y lo que falta."
      ],
      [
        "i3 p2",
        "Recupera el objetivo acordado."
      ],
      [
        "i4 p3",
        "Relaciona intervención y evaluación, sin volver a explicar toda la ponencia."
      ],
      [
        "t3",
        "Pide un cambio concreto y su motivo."
      ],
      [
        "practica",
        "El resultado docente es una decisión mejor justificada, sin desenlace clínico inventado."
      ],
      [
        "enlace",
        "Presenta las preguntas como recuerdo del recorrido."
      ]
    ]
  },
  {
    "id": "cinco-preguntas",
    "mov": 4,
    "q": null,
    "title": "Cinco preguntas para la próxima cura.",
    "label": "Síntesis",
    "exp": "Cada pregunta recoge un fundamento trabajado en la conversación. Sirven para ordenar y comunicar el razonamiento; no son una escala ni etapas rígidas.",
    "points": [
      [
        "Comprender",
        "¿Qué explica esta herida y qué la mantiene abierta?"
      ],
      [
        "Acordar",
        "¿Qué queremos conseguir con la persona y qué es posible hoy?"
      ],
      [
        "Decidir",
        "¿Por qué hacemos esta intervención?"
      ],
      [
        "Comprobar",
        "¿Qué ha cambiado y con qué lo comparamos?"
      ],
      [
        "Reevaluar",
        "¿Cuándo revisamos el plan o pedimos ayuda antes?"
      ]
    ],
    "avoid": "Presentar las preguntas como una nueva escala o como etapas rígidas.",
    "propose": "Usarlas para ordenar y comunicar el razonamiento.",
    "refs": [
      "G14",
      "G8",
      "E22",
      "I25"
    ],
    "src": "Síntesis docente propia a partir de GNEAUPP DT XIV, p. 15; DT VIII, pp. 23–30 y 38; EWMA 2022, §§4–6; IWII 2025, rec. 11 y 13.",
    "type": "Propuesta docente no validada como instrumento",
    "limit": "No atribuir literalmente las preguntas a una guía ni utilizarlas como escala.",
    "open": "No hace falta llevarse toda mi historia. Estas preguntas caben mejor.",
    "turns": [
      {
        "label": "Vamos una a una",
        "reply": "Vamos una a una. Ya han ido saliendo en la conversación.",
        "kind": "layers",
        "resourceTitle": "Las preguntas que nos llevamos",
        "items": [
          [
            "Comprender",
            "¿Qué explica esta herida?"
          ],
          [
            "Acordar",
            "¿Qué queremos conseguir con la persona?"
          ],
          [
            "Decidir",
            "¿Por qué hacemos esta intervención?"
          ],
          [
            "Comprobar",
            "¿Qué ha cambiado?"
          ],
          [
            "Reevaluar",
            "¿Cuándo revisamos o pedimos ayuda?"
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Hay que seguir ese orden?",
        "reply": "Podemos volver a ellas cuando haga falta. No hay que pasar un examen.",
        "kind": "facts",
        "resourceTitle": "Para volver a ellas",
        "items": [
          [
            "Sin puntuaciones",
            "No hay nota ni clasificación."
          ],
          [
            "Sin orden fijo",
            "Volvemos a ellas cuando hace falta."
          ],
          [
            "Para conversar",
            "Nos ayudan a explicar el plan."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "¿Qué te llevas tú?",
        "reply": "Con que alguna os ayude a parar un momento antes de repetir, me doy por escuchada.",
        "kind": "outcomes",
        "resourceTitle": "Lo que aporta la conversación",
        "items": [
          [
            "Lo que sabemos",
            "Y lo que aún falta."
          ],
          [
            "Lo que le importa",
            "A quien vive con la herida."
          ],
          [
            "La próxima visita",
            "Qué necesitamos revisar."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Y ahora, pensad en vuestra próxima cura.",
    "md": "Deja leer las preguntas una a una. No repitas las explicaciones ni enumeres las escenas de origen. Es un recordatorio docente, no un instrumento validado.",
    "steps": [
      [
        "t1 p1",
        "Comprender: ¿qué explica la herida? Deja tiempo para leer."
      ],
      [
        "i2 p2",
        "Acordar: objetivo con la persona."
      ],
      [
        "i3 p3",
        "Decidir: motivo de la intervención."
      ],
      [
        "i4 p4",
        "Comprobar: cambio observado."
      ],
      [
        "i5 p5",
        "Reevaluar: cuándo revisar o pedir ayuda. Las cinco quedan reunidas."
      ],
      [
        "practica",
        "Una sola aclaración oral: son un recordatorio docente, no una escala ni un orden rígido."
      ],
      [
        "enlace",
        "No vuelvas a resumir las escenas. Prepara la última pregunta."
      ]
    ]
  },
  {
    "id": "cierre",
    "mov": 4,
    "q": null,
    "title": "En la próxima cura, ¿qué revisarías?",
    "label": "Cierre",
    "exp": "El cierre invita a trasladar el razonamiento a una situación cotidiana. La valoración, la indicación y la reevaluación trabajadas durante la presentación sustentan esa reflexión. La pregunta final es una propuesta docente propia.",
    "points": [
      [
        "Una actuación",
        "Elegir algo habitual de la práctica."
      ],
      [
        "Una pregunta",
        "Qué necesitamos saber antes de repetirlo."
      ]
    ],
    "avoid": "Terminar con una lista de prohibiciones sin contexto.",
    "propose": "Llevar las preguntas a una situación concreta de la práctica.",
    "refs": [
      "G14",
      "G8",
      "G17",
      "E22",
      "E26",
      "I25"
    ],
    "src": "Cierre docente propio. Respaldo del recorrido: documentos aportados de GNEAUPP, EWMA e IWII. Fuentes por escena y bibliografía completa disponibles.",
    "type": "Síntesis y cierre docente",
    "limit": "Pendiente de validación clínica y adaptación de circuitos por la ponente.",
    "open": "Yo ya os he contado mi historia. Ahora os toca pensar en una de las vuestras.",
    "turns": [
      {
        "label": "Piensa en una cura",
        "reply": "Pensad en una cosa que soléis hacer igual. Solo una.",
        "kind": "layers",
        "resourceTitle": "Una pausa antes de repetir",
        "items": [
          [
            "Una actuación",
            "Algo que hacemos a menudo."
          ],
          [
            "Una pausa",
            "Antes de repetirlo."
          ],
          [
            "Una pregunta",
            "Lo que nos ayudaría a decidir."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "Una idea final",
        "reply": "¿Qué os gustaría saber antes de repetirla?",
        "kind": "outcomes",
        "resourceTitle": "Una idea para llevar",
        "items": [
          [
            "La próxima cura",
            "Una ocasión para revisar."
          ],
          [
            "Con el equipo",
            "Una pregunta que compartir."
          ],
          [
            "Con la persona",
            "Escuchar qué necesita."
          ]
        ],
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "Despedirse",
        "reply": "Gracias por escucharme. Nos vemos en la próxima cura… con alguna pregunta más.",
        "kind": "memory",
        "resourceTitle": "Después de hoy",
        "items": [
          [
            "Hoy",
            "Hemos escuchado una historia."
          ],
          [
            "Mañana",
            "Habrá otra herida."
          ],
          [
            "Para empezar",
            "Una pregunta antes de repetir."
          ]
        ],
        "voice": "principal",
        "state": "listening"
      }
    ],
    "bridge": "Gracias por acompañarnos.",
    "md": "Una pregunta y una despedida. Deja unos segundos de silencio. No leas una lista de hábitos ni añadas un nuevo resumen. La última voz es la de la herida.",
    "steps": [
      [
        "t1",
        "Invita a elegir una actuación habitual. Pausa breve, sin pedir otra ronda de respuestas."
      ],
      [
        "practica",
        "Tacha repetir sin revisar. Una sola pregunta final, sin muro ni otro resumen."
      ],
      [
        "t3",
        "Deja que la herida se despida."
      ],
      [
        "enlace",
        "Agradece y pasa al cierre institucional."
      ]
    ]
  }
];
 // Expressive states: discomfort while talking about procedural pain, relief when the goal is agreed,
 // showing when a picture opens. They express the conversation, not clinical findings.
 const moods={dolor:{0:'discomfort',1:'discomfort'},capacidad:{2:'relief'},'otros-resultados':{2:'relief'}};
 S.forEach(d=>d.turns.forEach((t,i)=>{if(moods[d.id]?.[i])t.state=moods[d.id][i];else if(t.kind==='photo')t.state='showing';}));
 // The theme of the talk: what we usually do (the «qué no hacer») and the question that stops the habit.
 // Each scene opens on the habit; the «practica» step crosses it out and leaves the question.
 const HABITS={
  "apertura": [
    "Elegir el apósito antes de valorar.",
    "¿Qué sabemos de esta herida y qué nos falta?"
  ],
  "registro": [
    "Repetir la cura sin comprobar la respuesta.",
    "¿Qué ha cambiado desde la última visita?"
  ],
  "historia": [
    "Decir «es crónica» y dar la causa por explicada.",
    "¿Qué la causó y qué la mantiene abierta?"
  ],
  "zonas": [
    "Valorar solo el centro de la herida.",
    "¿Qué pasa en el borde y en la piel de alrededor?"
  ],
  "parecidas": [
    "Copiar la pauta porque se parecen.",
    "¿Qué dato cambia el plan en cada una?"
  ],
  "causa": [
    "Cambiar de apósito sin revisar la causa.",
    "¿Qué esperamos que cambie con esta cobertura?"
  ],
  "persona": [
    "Explicar el plan y darlo por entendido.",
    "¿Qué le cuesta y qué necesita aclarar?"
  ],
  "medicion": [
    "Quedarnos con «parece que va mejor».",
    "¿Qué ha cambiado y cómo lo hemos medido?"
  ],
  "reevaluacion": [
    "Intensificar sin revisar por qué no avanza.",
    "¿Qué revisamos antes de añadir tratamiento?"
  ],
  "infeccion": [
    "Dar por segura la infección por un cultivo positivo.",
    "¿Qué signos tienen la herida y la persona?"
  ],
  "cultivo": [
    "Pedir un cultivo solo porque toca.",
    "¿Qué decisión podría cambiar con el resultado?"
  ],
  "biofilm": [
    "Decir «será biofilm» y dejar de buscar.",
    "¿Qué explica esta posibilidad y qué nos falta?"
  ],
  "antimicrobianos": [
    "Añadir un antimicrobiano «por si acaso».",
    "¿Hace falta y qué problema queremos tratar?"
  ],
  "revision-antimicrobiano": [
    "Renovar la plata sin revisar su indicación.",
    "¿Cuándo revisamos si todavía hace falta?"
  ],
  "limpieza": [
    "Limpiar siempre igual sin revisar la herida.",
    "¿Qué necesita la limpieza hoy, en cada zona?"
  ],
  "dolor": [
    "Dar por inevitable el dolor de la cura.",
    "¿Cómo lo está viviendo y qué podemos ajustar ahora?"
  ],
  "escaras": [
    "Decidir desbridar solo por ver necrosis.",
    "¿Cómo llega la sangre y es seguro intervenir ahora?"
  ],
  "atipica": [
    "Insistir en la misma explicación aunque no encaje.",
    "¿Y si necesitamos revisar el diagnóstico?"
  ],
  "capacidad": [
    "Prometer el cierre o darlo por perdido sin valorar.",
    "¿Qué podemos conseguir hoy con la persona?"
  ],
  "otros-resultados": [
    "Valorar el beneficio solo por el cierre.",
    "¿Qué mejora le importa ahora a la persona?"
  ],
  "continuidad": [
    "Repetir el plan sin conocer por qué se indicó.",
    "¿Qué necesita saber quien venga mañana?"
  ],
  "regreso": [
    "Buscar otro producto antes de revisar la decisión.",
    "¿Qué preguntaríamos antes de elegir ahora?"
  ],
  "cinco-preguntas": [
    "Repetir sin revisar las preguntas del plan.",
    "¿Qué pregunta necesitamos recuperar?"
  ],
  "cierre": [
    "Repetir sin revisar si sigue teniendo sentido.",
    "En la próxima cura, ¿qué revisarías antes de repetir?"
  ]
};
 const SOURCE_LABELS={
  apertura:'GNEAUPP DT XIV · p. 15',registro:'GNEAUPP DT XIV · p. 15',historia:'GNEAUPP DT XIV · p. 15',
  zonas:'GNEAUPP DT XIV · p. 15 / IWII · rec. 3',parecidas:'GNEAUPP DT XIV · pp. 20–21 / EWMA · fichas',
  causa:'GNEAUPP DT XIV · pp. 20–22 / EWMA 2022 · §6.2',persona:'EWMA 2022 · §4 / IWII · rec. 11',
  medicion:'GNEAUPP DT XIV · p. 15',reevaluacion:'GNEAUPP DT XIV · p. 15 / EWMA 2022',
  infeccion:'GNEAUPP DT VIII · pp. 17, 23–24 / EWMA · §3',cultivo:'GNEAUPP DT VIII · pp. 23–24',
  biofilm:'EWMA 2022 · §§2–3',antimicrobianos:'GNEAUPP DT VIII · pp. 27–30 / EWMA 2022',
  'revision-antimicrobiano':'GNEAUPP DT VIII · p. 38',limpieza:'GNEAUPP DT XVII / IWII · rec. 11',
  dolor:'IWII · rec. 13, pp. 39–40 / GNEAUPP DT XIV · p. 28',escaras:'GNEAUPP DT XIV · pp. 21, 28 / EWMA · fichas',
  atipica:'EWMA · ficha 1, pp. 3–6',capacidad:'IWII · p. 26 / EWMA 2022 · §4 / síntesis docente',
  'otros-resultados':'EWMA · §4 / IWII · rec. 13 / GNEAUPP · p. 24',continuidad:'EWMA 2022 · §§4–6 / fichas clínicas',
  regreso:'Integración docente · GNEAUPP / EWMA / IWII',
  'cinco-preguntas':'Síntesis docente propia · fuentes del recorrido',cierre:'Cierre docente propio · bibliografía en Fuentes'
 };
 const kinds={dual:'Contrapunto · historias A y B',isquemica:'Contrapunto · seguridad vascular'};
 INITIAL_DECK.movements=MOVES;
 // Stored drafts from an older edition get the new thread (steps, habits) when they load.
 INITIAL_DECK.edition='2026-10-27-narrativa-humana';
 INITIAL_DECK.slides=S.map((d,i)=>{
  const s=slide(d.id,MOVES[d.mov].short,d.title,d.voice||'principal',d.open,d.turns.some(t=>t.kind==='decision')?'decision':'conversation',d.points,d.refs,d.q,{mov:d.mov,takeaway:d.propose});
  s.study={number:i+1,label:d.label,explanation:d.exp,sourceNote:d.src,sourceLabel:SOURCE_LABELS[d.id],evidenceType:d.type,limitation:d.limit,opening:d.open,avoid:d.avoid,propose:d.propose,habit:HABITS[d.id][0],ask:HABITS[d.id][1],
   caseLabel:kinds[d.voice]||(d.id==='capacidad'?'Caso principal y contrapunto de objetivos':'Caso principal · una lesión de pierna'),bridge:d.bridge,turns:d.turns,steps:d.steps};
  s.notes='FUENTE Y RESPALDO\n'+d.src+'\n'+d.type+'\n\nESCENA '+(i+1)+' · '+MOVES[d.mov].short+'\nLo habitual: «'+HABITS[d.id][0]+'» → '+HABITS[d.id][1]+'\nLa herida abre: «'+d.open+'»\n\nMARÍA DEL MAR\n'+d.md+'\n\nPASOS\n'+d.steps.map((p,n)=>(n+1)+'. '+p[1]).join('\n')+'\n\nENLACE\n«'+d.bridge+'»\n\nREVISIÓN\n'+d.limit;
  return s;
 });
 // Two short introductions. The first scene demonstrates the interaction itself.
 const intro=(id,title,message,kind,open,steps,extra={})=>({...slide(id,'Introducción',title,'principal',message,'intro',[],[],null),intro:{kind,open,steps,...extra}});
 INITIAL_DECK.slides.unshift(
  intro('intro-tema','¿Es posible cicatrizar todas las heridas?','Qué no hacer en heridas crónicas.','tema','Bienvenida. Presenta la pregunta de la mesa y tu aportación.',
   [['r','Vamos a revisar decisiones que repetimos en las curas y las preguntas que nos ayudan a justificarlas.'],
    ['r','Una costumbre reconocible, la historia de una herida y una pregunta para la próxima cura. La evidencia nos acompaña.']]),
  intro('intro-herida','Os presento a la herida','Un caso docente para conversar sobre nuestra práctica.','herida','Presenta el caso en una frase. La dinámica se entenderá al empezar.',
   [['r','La herida cuenta su historia. Es un caso docente con respuestas preparadas.'],
    ['r','María del Mar aporta la evidencia de los documentos citados.'],
    ['r','Empezamos por la primera decisión.']],
   {lines:['Hola. Soy una herida de pierna y llevo tiempo abierta.','Mi historia está preparada para hoy. Las preguntas os las podéis llevar a las vuestras.','Veo que el carro ya está listo. ¿Empezamos?']})
 );
})();

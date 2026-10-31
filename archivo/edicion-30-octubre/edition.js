// Editorial edition (30/10/2026): 21 practices, return, full summary and farewell.
// Two interlocutors; science has its own moment, source and conditions.
// Each step is "action | cue". Actions (space separated): tN ask turn N, iN select item N,
// pN highlight point N (p alone: all), razon reveal reasoning, practica avoid/propose, enlace bridge.
(() => {
 // Only documents attached to the project support the scientific side in this edition.
 delete REFERENCES.W21;
 delete REFERENCES.P25;
 const MOVES=[
  {short:'Antes de empezar',sub:'¿Qué necesitamos saber antes de elegir?'},
  {short:'Durante la cura',sub:'¿Por qué lo hacemos y cómo sabremos si ayuda?'},
  {short:'Cuando algo no encaja',sub:'¿Qué nos hace cambiar de camino o de objetivo?'},
  {short:'Antes de irnos',sub:'¿Qué dejamos acordado para la próxima visita?'}
 ];
 // The five closing questions (scene 23) are the learning thread of every scene.
 [["Comprender", "¿Qué explica esta herida y qué la mantiene abierta?"], ["Acordar", "¿Qué queremos conseguir con la persona y qué es posible hoy?"], ["Decidir", "¿Por qué hacemos esta intervención?"], ["Comprobar", "¿Qué ha cambiado y con qué lo comparamos?"], ["Reevaluar", "¿Cuándo revisamos el plan o pedimos ayuda antes?"]].forEach(([short,text],i)=>Object.assign(QUESTIONS[i],{short,text}));
 const S=[
  {
    "id": "apertura",
    "mov": 0,
    "q": null,
    "title": "Antes de elegir",
    "label": "Valorar antes de elegir",
    "exp": "Antes de elegir el tratamiento tópico, diagnosticar y valorar. Hoy lo recorremos conversando con un personaje que reúne historias de heridas y nos ayuda a revisar las decisiones de cuidado.",
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
    "propose": "Valorar y orientar el diagnóstico antes de elegir, sin demorar cuidados necesarios.",
    "refs": [
      "G14"
    ],
    "src": "GNEAUPP · DT XIV (2020), p. 15: diagnóstico y valoración antes del tratamiento tópico. Apertura y participación: recursos docentes.",
    "type": "Recomendación de práctica · GNEAUPP",
    "limit": "Personaje abstracto e historias sintéticas con fines docentes. No es una lesión ni una paciente concreta.",
    "open": "María del Mar, tú y yo nos conocemos. ¿Empiezo por la historia o ya has elegido apósito?",
    "turns": [
      {
        "label": "Hoy te voy a pedir que nos enseñes unas cuantas cosas.",
        "reply": "Eso se me da bien. Traigo historias, alguna foto y unas cuantas preguntas para ti.",
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
        "label": "Vamos a empezar por una historia.",
        "reply": "Te he guardado unas notas de curas. Mira cuánto se puede escribir sin contar cómo va la cosa.",
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
        "label": "No me mires así. Todavía no hemos empezado.",
        "reply": "Yo no he dicho nada. Pero el carro ya estaba listo.",
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
    "bridge": "Enséñame esas notas. Vamos a ver qué cuentan.",
    "md": "«Hoy viene conmigo alguien a quien conocéis, aunque no la hayáis oído hablar así. La herida y yo tenemos unas cuantas conversaciones pendientes». Deja entrar su réplica sin leerla encima. A la sala: «Antes de empezar, ¿qué dos cosas querríais saber?». No prometas datos reales ni un desenlace.\n\nRECORRIDO EDITORIAL\nActuación: Elegir el apósito antes de valorar.\nPregunta: ¿Qué sabemos y qué nos falta?\nAprendizaje: Valorar y orientar el diagnóstico antes de elegir, sin demorar cuidados necesarios.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué sabemos y qué nos falta?». No abrir una ronda en cada escena."
      ],
      [
        "t1",
        "«Antes de tocar el carro, ¿qué necesitaríais saber?». Recoge dos preguntas de la sala."
      ],
      [
        "t2",
        "«Vamos a mirar lo que se ha hecho y lo que falta». La valoración no demora lo urgente."
      ],
      [
        "p1",
        "Explica el fundamento: Antes de elegir el tratamiento tópico, diagnosticar y valorar. Hoy lo recorremos conversando con un personaje que reúne historias de heridas y nos ayuda a revisar las decisiones de cuidado. Fuente: GNEAUPP · DT XIV (2020), p. 15: diagnóstico y valoración antes del tratamiento tópico. Apertura y participación: recursos docentes. Condición que debe decirse: La valoración no demora cuidados necesarios ni medidas urgentes."
      ],
      [
        "enlace",
        "Responde la pregunta: «Valorar y orientar el diagnóstico antes de elegir, sin demorar cuidados necesarios.». Haz una pausa. Después enlaza: «Enséñame esas notas. Vamos a ver qué cuentan.»"
      ]
    ],
    "voice": "principal",
    "habit": "Elegir el apósito antes de valorar.",
    "ask": "¿Qué sabemos y qué nos falta?",
    "role": "practice",
    "safety": "La valoración no demora cuidados necesarios ni medidas urgentes.",
    "scienceTitle": "La valoración orienta la elección",
    "scienceText": "El diagnóstico identifica la causa, las enfermedades concomitantes y las complicaciones que condicionan el tratamiento."
  },
  {
    "id": "registro",
    "mov": 0,
    "q": 3,
    "title": "Las notas de la última cura",
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
    "propose": "Registrar la intervención y la respuesta para poder revisar el plan.",
    "refs": [
      "G14"
    ],
    "src": "GNEAUPP · DT XIV (2020), p. 15: seguimiento, reevaluación y ajuste del plan. Registro mostrado: recurso docente.",
    "type": "Recomendación de práctica · GNEAUPP",
    "limit": "Registro conceptual: sin fechas, medidas ni resultados reales.",
    "open": "Aquí tienes: limpieza, apósito, próxima cita. Y vuelta a empezar.",
    "turns": [
      {
        "label": "Enséñame las notas.",
        "reply": "Mira: en cada visita hay una cura anotada. La evolución tiene bastante menos sitio.",
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
        "label": "Hay trabajo hecho. Lo que busco es la respuesta.",
        "reply": "En eso estamos de acuerdo. Estas notas no permiten comparar cómo iba la herida.",
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
        "label": "Entonces, ¿repetimos o revisamos?",
        "reply": "Repetir es fácil. El motivo, con este registro, te lo debo.",
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
    "bridge": "Antes de juzgar esa pauta, aclaremos qué estaban tratando.",
    "md": "«Aquí hay cuidados registrados. No estamos poniendo eso en duda. Buscamos qué respuesta tuvieron». La herida pone la ironía; tú reconoces el trabajo y señalas la información ausente. «Enséñame ahora qué sabemos de la causa». Registro conceptual, no historia de una paciente real.\n\nRECORRIDO EDITORIAL\nActuación: Registrar la cura sin comprobar su respuesta.\nPregunta: ¿Qué ha cambiado desde la última visita?\nAprendizaje: Registrar la intervención y la respuesta para poder revisar el plan.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué ha cambiado desde la última visita?». No abrir una ronda en cada escena."
      ],
      [
        "t1 m1",
        "«Enséñame las notas». Muestra el registro conceptual; no lo atribuyas al personaje."
      ],
      [
        "cerrar t2 i3",
        "«Hay trabajo hecho. Lo que busco es la respuesta». Señala la ausencia de datos comparables, sin reproche."
      ],
      [
        "p2",
        "Explica el fundamento: Un registro de curas cuenta qué se ha hecho. Para decidir también necesitamos saber cómo ha respondido la herida. La reevaluación permite ajustar el plan y detectar complicaciones. Fuente: GNEAUPP · DT XIV (2020), p. 15: seguimiento, reevaluación y ajuste del plan. Registro mostrado: recurso docente. "
      ],
      [
        "enlace",
        "Responde la pregunta: «Registrar la intervención y la respuesta para poder revisar el plan.». Haz una pausa. Después enlaza: «Antes de juzgar esa pauta, aclaremos qué estaban tratando.»"
      ]
    ],
    "voice": "principal",
    "habit": "Registrar la cura sin comprobar su respuesta.",
    "ask": "¿Qué ha cambiado desde la última visita?",
    "role": "practice",
    "safety": "",
    "scienceTitle": "Registrar permite reevaluar",
    "scienceText": "Repetir elementos de la valoración permite comparar la evolución, detectar complicaciones y ajustar el plan."
  },
  {
    "id": "historia",
    "mov": 0,
    "q": 0,
    "title": "La historia y sus huecos",
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
    "propose": "Precisar la causa y los factores que condicionan el plan.",
    "refs": [
      "G14"
    ],
    "src": "GNEAUPP · DT XIV (2020), p. 15: causa, enfermedades concomitantes y complicaciones.",
    "type": "Recomendación de práctica · GNEAUPP",
    "limit": "La valoración no debe demorar medidas urgentes ni cuidados necesarios.",
    "open": "A veces nos ponen «crónica» y parece que ya nos han presentado.",
    "turns": [
      {
        "label": "No me lo vas a poner tan fácil. ¿Qué cuenta esta historia?",
        "reply": "Cuenta desde cuándo está abierta. El porqué sigue pendiente.",
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
        "label": "¿Qué sabemos y qué estamos suponiendo?",
        "reply": "Sabemos que lleva tiempo y que se han hecho curas. Los huecos siguen siendo huecos.",
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
        "label": "Pues esos huecos los dejamos a la vista.",
        "reply": "Mejor. Lo de rellenarlos a ojo no suele mejorar la historia.",
        "kind": "facts",
        "resourceTitle": "Lo que falta preguntar",
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
        "voice": "principal",
        "state": "listening"
      }
    ],
    "bridge": "Ahora enséñame la imagen. Pero vamos a mirar también alrededor.",
    "md": "«Crónica nos dice algo del tiempo. La causa es otra pregunta». Recoge su réplica sin competir por el remate. Distingue lo documentado, la hipótesis y lo pendiente. No atribuyas una etiología a esta historia incompleta.\n\nRECORRIDO EDITORIAL\nActuación: Dar la causa por explicada al decir «crónica».\nPregunta: ¿Qué la causó y qué la mantiene abierta?\nAprendizaje: Precisar la causa y los factores que condicionan el plan.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué la causó y qué la mantiene abierta?». No abrir una ronda en cada escena."
      ],
      [
        "t1",
        "«No me lo vas a poner tan fácil. ¿Qué cuenta esta historia?». Distingue tiempo y causa."
      ],
      [
        "t2 m1",
        "«Distingamos lo que consta de lo que falta comprobar». La imagen ilustra valoración, no confirma un diagnóstico."
      ],
      [
        "cerrar p1",
        "Explica el fundamento: El diagnóstico debe identificar la causa de la lesión, las enfermedades concomitantes y las complicaciones que contribuyen a ella o retrasan la cicatrización. «Herida crónica» describe la evolución; no la explica. Fuente: GNEAUPP · DT XIV (2020), p. 15: causa, enfermedades concomitantes y complicaciones. "
      ],
      [
        "enlace",
        "Responde la pregunta: «Precisar la causa y los factores que condicionan el plan.». Haz una pausa. Después enlaza: «Ahora enséñame la imagen. Pero vamos a mirar también alrededor.»"
      ]
    ],
    "voice": "principal",
    "habit": "Dar la causa por explicada al decir «crónica».",
    "ask": "¿Qué la causó y qué la mantiene abierta?",
    "role": "practice",
    "safety": "",
    "scienceTitle": "La duración deja preguntas abiertas",
    "scienceText": "El diagnóstico debe explicar la causa y los factores que contribuyen a la lesión o retrasan su cicatrización."
  },
  {
    "id": "zonas",
    "mov": 0,
    "q": 0,
    "title": "También alrededor",
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
    "propose": "Incorporar la lesión, su entorno y la historia a la valoración.",
    "refs": [
      "G14",
      "I25"
    ],
    "src": "GNEAUPP · DT XIV (2020), p. 15 · IWII 2025, recomendación 3: herida, borde y piel.",
    "type": "Recomendación y consenso internacional",
    "limit": "Esquema e imagen conceptuales: no permiten diagnosticar por color o aspecto.",
    "open": "Te he traído una imagen. Esta vez no me recortes los bordes.",
    "turns": [
      {
        "label": "A ver, enséñamela entera.",
        "reply": "El centro se lleva todas las miradas. Hoy también salen el borde y la piel de alrededor.",
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
        "label": "La imagen ayuda. Pero no me lo cuenta todo.",
        "reply": "Ya sabía yo que ibas a pedir la historia. Una foto sola me sale más rápida.",
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
        "label": "¿Ves? Para esto nos conocemos.",
        "reply": "Sí. Yo pongo la imagen y tú preguntas por lo que queda fuera.",
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
    "bridge": "Guarda esa idea. Vamos a comparar dos historias que se parecen.",
    "md": "«Primero describimos lo que vemos. Luego lo relacionamos con la historia». La réplica sobre la foto expresa complicidad; no sustituye la explicación. Recorre la imagen conceptual sin pedir un diagnóstico por reconocimiento.\n\nRECORRIDO EDITORIAL\nActuación: Valorar solo el centro.\nPregunta: ¿Qué pasa en el borde y en la piel de alrededor?\nAprendizaje: Incorporar la lesión, su entorno y la historia a la valoración.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué pasa en el borde y en la piel de alrededor?». No abrir una ronda en cada escena."
      ],
      [
        "t1 m1 h1",
        "Recorre la imagen sin pedir un diagnóstico: lecho."
      ],
      [
        "h2",
        "Borde: describir lo observado."
      ],
      [
        "h3",
        "Piel perilesional."
      ],
      [
        "h4",
        "Piel circundante. IWII 2025, rec. 3."
      ],
      [
        "cerrar t2",
        "Distingue observación e interpretación con una frase."
      ],
      [
        "p4",
        "Explica el fundamento: La valoración incluye la lesión y su entorno: lecho, borde, piel perilesional y piel circundante. Observar y describir aporta información; una imagen aislada no sustituye la valoración clínica. Fuente: GNEAUPP · DT XIV (2020), p. 15 · IWII 2025, recomendación 3: herida, borde y piel. "
      ],
      [
        "enlace",
        "Responde la pregunta: «Incorporar la lesión, su entorno y la historia a la valoración.». Haz una pausa. Después enlaza: «Guarda esa idea. Vamos a comparar dos historias que se parecen.»"
      ]
    ],
    "voice": "principal",
    "habit": "Valorar solo el centro.",
    "ask": "¿Qué pasa en el borde y en la piel de alrededor?",
    "role": "practice",
    "safety": "",
    "scienceTitle": "Cuatro zonas que forman parte del cuidado",
    "scienceText": "La valoración y la limpieza contemplan lecho, borde, piel perilesional y piel circundante. Lo observado se interpreta junto con la historia."
  },
  {
    "id": "parecidas",
    "mov": 0,
    "q": 0,
    "voice": "principal",
    "title": "Dos historias parecidas",
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
    "propose": "Relacionar las prioridades y la seguridad con la etiología y la perfusión.",
    "refs": [
      "G14",
      "E26"
    ],
    "src": "GNEAUPP · DT XIV (2020), pp. 20–21 · EWMA (2026), fichas de úlcera venosa e isquemia amenazante.",
    "type": "Recomendaciones y fichas clínicas",
    "limit": "Ejemplos con etiología ya establecida. No toda lesión isquémica es irreversible.",
    "open": "Estas dos se parecen. No te he traído las historias iguales, que te conozco.",
    "turns": [
      {
        "label": "Empieza por la primera. ¿Qué sabemos?",
        "reply": "En el primer ejemplo la causa venosa ya está establecida. Esa información viene con la historia.",
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
        "label": "¿Y qué cambia en la segunda?",
        "reply": "Aquí hay un problema de llegada de sangre. El parecido de la foto se queda corto.",
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
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "O sea, que no puedo copiarte la pauta.",
        "reply": "Puedes abrir las dos historias. Copiar es otra conversación.",
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
        "voice": "principal",
        "state": "comparing"
      }
    ],
    "bridge": "Volvamos al cambio de apósito. ¿Qué esperamos conseguir con él?",
    "md": "«La etiología y la perfusión cambian las prioridades y la seguridad». Se trata de dos ejemplos docentes con datos establecidos. Tú explicas la implicación clínica. La herida presenta y compara; no diagnostica ni interpreta una fotografía como prueba.\n\nRECORRIDO EDITORIAL\nActuación: Copiar la pauta por el parecido.\nPregunta: ¿Qué dato cambia el plan en cada una?\nAprendizaje: Relacionar las prioridades y la seguridad con la etiología y la perfusión.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué dato cambia el plan en cada una?». No abrir una ronda en cada escena."
      ],
      [
        "t1 m1 i2",
        "Ejemplo A con causa venosa establecida. No pedir diagnóstico por imagen. Relaciona el tratamiento local con el abordaje causal."
      ],
      [
        "t2 m2",
        "Ejemplo B: la perfusión cambia prioridades y seguridad. G14, pp. 20–21."
      ],
      [
        "t3",
        "Contrasta solo la diferencia que cambia el plan."
      ],
      [
        "p3",
        "Explica el fundamento: Dos lesiones de pierna pueden parecerse y necesitar planes distintos. La etiología y la situación vascular condicionan las prioridades y la seguridad del tratamiento. No se trata de diagnosticar por la fotografía. Fuente: GNEAUPP · DT XIV (2020), pp. 20–21 · EWMA (2026), fichas de úlcera venosa e isquemia amenazante. Condición que debe decirse: La etiología viene establecida en estos ejemplos. La imagen no permite diagnosticar."
      ],
      [
        "enlace",
        "Responde la pregunta: «Relacionar las prioridades y la seguridad con la etiología y la perfusión.». Haz una pausa. Después enlaza: «Volvamos al cambio de apósito. ¿Qué esperamos conseguir con él?»"
      ]
    ],
    "habit": "Copiar la pauta por el parecido.",
    "ask": "¿Qué dato cambia el plan en cada una?",
    "role": "practice",
    "safety": "La etiología viene establecida en estos ejemplos. La imagen no permite diagnosticar.",
    "scienceTitle": "La etiología cambia las prioridades",
    "scienceText": "El abordaje causal y la situación vascular condicionan el plan. Dos lesiones parecidas pueden requerir decisiones diferentes."
  },
  {
    "id": "causa",
    "mov": 0,
    "q": 0,
    "title": "El plan junto al apósito",
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
    "propose": "Relacionar el cuidado local con la causa y los factores mantenedores.",
    "refs": [
      "G14",
      "E22"
    ],
    "src": "GNEAUPP · DT XIV (2020), pp. 20–22: etiología venosa, situación arterial y descarga en pie diabético · EWMA 2022, §6.2.",
    "type": "Recomendaciones y revisión",
    "limit": "Compresión y descarga requieren indicación específica. No se proponen técnicas universales.",
    "open": "Tengo una colección de nombres de apósitos. Para una charla entera.",
    "turns": [
      {
        "label": "Hoy te voy a ahorrar el catálogo. Enséñame el plan.",
        "reply": "Aquí están las coberturas. Al lado he dejado lo que puede mantener una herida abierta.",
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
        "label": "Cambiar de producto puede tener sentido.",
        "reply": "Claro. Lo que quiero saber es qué esperamos de ese cambio.",
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
        "label": "Entonces no discutimos por el apósito.",
        "reply": "No. Discutimos un poco por empezar siempre por él.",
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
    "bridge": "Y el plan que proponemos, ¿se puede llevar a cabo fuera de la consulta?",
    "md": "«Un cambio de cobertura puede tener sentido. Hay que explicar para qué y cómo encaja en el abordaje de la causa». Acepta su contrapunto: no se trata de desacreditar productos. «Ahora enséñame qué hemos preguntado sobre el día a día». No representes la respuesta de la paciente.\n\nRECORRIDO EDITORIAL\nActuación: Cambiar de apósito sin revisar la causa.\nPregunta: ¿Qué esperamos que cambie con esta cobertura?\nAprendizaje: Relacionar el cuidado local con la causa y los factores mantenedores.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué esperamos que cambie con esta cobertura?». No abrir una ronda en cada escena."
      ],
      [
        "t1",
        "Relaciona intervención local y causa, sin explicar todos los tratamientos."
      ],
      [
        "i2 m1",
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
        "cerrar razon i2",
        "El producto puede ser pertinente, pero no sustituye a la valoración causal. Conecta la decisión local con los factores mantenedores."
      ],
      [
        "p3",
        "Explica el fundamento: Cambiar la cobertura no resuelve por sí solo lo que mantiene la lesión. La intervención local se integra con el abordaje de la causa; edema y carga mecánica son ejemplos que requieren valoración e indicación específicas. Fuente: GNEAUPP · DT XIV (2020), pp. 20–22: etiología venosa, situación arterial y descarga en pie diabético · EWMA 2022, §6.2. Condición que debe decirse: La compresión y la descarga requieren valoración e indicación específicas."
      ],
      [
        "enlace",
        "Responde la pregunta: «Relacionar el cuidado local con la causa y los factores mantenedores.». Haz una pausa. Después enlaza: «Y el plan que proponemos, ¿se puede llevar a cabo fuera de la consulta?»"
      ]
    ],
    "voice": "principal",
    "habit": "Cambiar de apósito sin revisar la causa.",
    "ask": "¿Qué esperamos que cambie con esta cobertura?",
    "role": "practice",
    "safety": "La compresión y la descarga requieren valoración e indicación específicas.",
    "scienceTitle": "La cobertura forma parte del plan",
    "scienceText": "La intervención local debe relacionarse con el abordaje de la causa y los factores mantenedores, con indicaciones específicas para cada situación."
  },
  {
    "id": "persona",
    "mov": 0,
    "q": 1,
    "title": "El cuidado en casa",
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
    "propose": "Comprobar comprensión y acordar un plan viable con la persona.",
    "refs": [
      "E22",
      "I25"
    ],
    "src": "EWMA 2022, §4, pp. S15–S16: perspectiva y participación de la persona · IWII 2025, rec. 11: factores individuales.",
    "type": "Revisión y consenso",
    "limit": "Las preguntas sobre vida cotidiana son propuestas docentes. El personaje no expresa las preferencias de ninguna paciente.",
    "open": "Tú ves la consulta. Yo también conozco lo que pasa entre una visita y otra.",
    "turns": [
      {
        "label": "Pues ayúdame a mirar esa parte.",
        "reply": "En estas notas solo aparece lo que hicimos durante la cura. Fuera de ahí hay bastante por preguntar.",
        "kind": "facts",
        "resourceTitle": "Lo que falta preguntar",
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
        "voice": "principal",
        "state": "listening"
      },
      {
        "label": "¿Sabemos cómo se organiza el cuidado en casa?",
        "reply": "Todavía no. El plan está escrito; esa conversación no.",
        "kind": "facts",
        "resourceTitle": "Lo que falta preguntar",
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
        "voice": "principal",
        "state": "listening"
      },
      {
        "label": "Eso tenemos que preguntárselo a la persona.",
        "reply": "Ahí no te llevo la contraria. Yo puedo recordártelo, no contestar por ella.",
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
    "bridge": "Dejemos también previsto cómo comprobar si el plan está ayudando.",
    "md": "«¿Qué entiende la persona, qué le cuesta y con qué apoyo cuenta?». Tú desarrollas las preguntas sobre dolor, ayuda, comprensión y vida cotidiana. La herida recuerda esa dimensión sin apropiarse de preferencias ni representar a una paciente.\n\nRECORRIDO EDITORIAL\nActuación: Dar por comprendido y viable el plan explicado.\nPregunta: ¿Qué le cuesta y qué necesita aclarar?\nAprendizaje: Comprobar comprensión y acordar un plan viable con la persona.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué le cuesta y qué necesita aclarar?». No abrir una ronda en cada escena."
      ],
      [
        "t1 m1",
        "«Pues ayúdame a mirar esa parte». Pregunta por el cuidado fuera de la consulta sin representar una respuesta de paciente."
      ],
      [
        "t2 m2",
        "«Hay que preguntar por comprensión, ayuda, dificultades y dolor». EWMA 2022, §4."
      ],
      [
        "cerrar p3",
        "Explica el fundamento: La perspectiva de la persona forma parte de la valoración y de las decisiones. Un plan explicado no es necesariamente un plan comprendido y viable: dolor, comprensión, apoyo y dificultades cotidianas lo condicionan. Fuente: EWMA 2022, §4, pp. S15–S16: perspectiva y participación de la persona · IWII 2025, rec. 11: factores individuales. Condición que debe decirse: Las preferencias y dificultades se preguntan a la persona."
      ],
      [
        "enlace",
        "Responde la pregunta: «Comprobar comprensión y acordar un plan viable con la persona.». Haz una pausa. Después enlaza: «Dejemos también previsto cómo comprobar si el plan está ayudando.»"
      ]
    ],
    "voice": "principal",
    "habit": "Dar por comprendido y viable el plan explicado.",
    "ask": "¿Qué le cuesta y qué necesita aclarar?",
    "role": "practice",
    "safety": "Las preferencias y dificultades se preguntan a la persona.",
    "scienceTitle": "El plan se acuerda con la persona",
    "scienceText": "Comprensión, preferencias, dolor, apoyo y dificultades cotidianas forman parte de las decisiones y de la viabilidad del cuidado."
  },
  {
    "id": "medicion",
    "mov": 1,
    "q": 3,
    "title": "Una referencia para volver",
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
    "propose": "Comparar con herramientas apropiadas y mediciones reproducibles.",
    "refs": [
      "G14"
    ],
    "src": "GNEAUPP · DT XIV (2020), p. 15: instrumentos válidos, fiables y adecuados al contexto. Ficha de seguimiento: propuesta docente.",
    "type": "Recomendación sobre valoración y medición",
    "limit": "No se presentan medidas ni mejorías ficticias.",
    "open": "«Parece que va mejor». Esa frase la tengo muy oída.",
    "turns": [
      {
        "label": "¿Me vas a pedir una referencia?",
        "reply": "Sí. Ya ves, a veces la que pregunta soy yo. La ficha de partida sigue vacía.",
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
        "label": "Podemos tener una impresión y luego comprobarla.",
        "reply": "Eso me vale. Porque «mejor» puede estar hablando del tamaño, del dolor o de otra cosa.",
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
        "label": "Te enseño cómo dejarlo registrado.",
        "reply": "Y la próxima vez sabremos qué estábamos comparando. Ya es un avance en la conversación.",
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
    "bridge": "Probemos ahora una situación: ¿y si no vemos el cambio esperado?",
    "md": "«La impresión tiene que poder contrastarse». Explica qué registrar y con qué herramienta apropiada. No inventes medidas ni resultados. Presenta la escena siguiente como supuesto, no como seguimiento real de una paciente.\n\nRECORRIDO EDITORIAL\nActuación: Quedarnos con «parece que va mejor».\nPregunta: ¿Qué ha cambiado y cómo lo medimos?\nAprendizaje: Comparar con herramientas apropiadas y mediciones reproducibles.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué ha cambiado y cómo lo medimos?». No abrir una ronda en cada escena."
      ],
      [
        "t1 m1",
        "Establece la referencia inicial: lesión, entorno y persona."
      ],
      [
        "t2",
        "La impresión necesita una comparación."
      ],
      [
        "t3 i3",
        "G14, p. 15: instrumentos válidos, fiables y adecuados al contexto. Mantener un método comparable en las revisiones."
      ],
      [
        "p2",
        "Explica el fundamento: Evaluar la evolución requiere una referencia comparable: medición y descripción con instrumentos válidos, fiables y apropiados para el tipo de lesión y el contexto. Una impresión aislada no demuestra mejora ni empeoramiento. Fuente: GNEAUPP · DT XIV (2020), p. 15: instrumentos válidos, fiables y adecuados al contexto. Ficha de seguimiento: propuesta docente. "
      ],
      [
        "enlace",
        "Responde la pregunta: «Comparar con herramientas apropiadas y mediciones reproducibles.». Haz una pausa. Después enlaza: «Probemos ahora una situación: ¿y si no vemos el cambio esperado?»"
      ]
    ],
    "voice": "principal",
    "habit": "Quedarnos con «parece que va mejor».",
    "ask": "¿Qué ha cambiado y cómo lo medimos?",
    "role": "practice",
    "safety": "",
    "scienceTitle": "Comparar requiere una medida apropiada",
    "scienceText": "Los instrumentos deben ser válidos, fiables e indicados para el contexto y el tipo de lesión. Su validez no se presupone al cambiar de ámbito."
  },
  {
    "id": "reevaluacion",
    "mov": 1,
    "q": 4,
    "title": "Cuando no vemos el cambio",
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
    "propose": "Reabrir la valoración y justificar el siguiente paso.",
    "refs": [
      "G14",
      "E22"
    ],
    "src": "GNEAUPP · DT XIV (2020), p. 15: reevaluación y ajuste del plan · EWMA 2022, §§3 y 6.",
    "type": "Recomendación de reevaluación",
    "limit": "Situación hipotética de progreso insuficiente; no se atribuye una causa única al estancamiento.",
    "open": "Te propongo una de las difíciles: seguimos curando y no vemos el avance esperado.",
    "turns": [
      {
        "label": "¿Qué información me has traído esta vez?",
        "reply": "La referencia anterior y lo que queríamos comprobar. Esta vez no empezamos de cero.",
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
        "label": "Todavía puede haber varias explicaciones.",
        "reply": "Sí. He traído posibilidades, no una culpable elegida de antemano.",
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
        "label": "También revisaré si el plan se pudo hacer.",
        "reply": "Y cómo se toleró. Eso también pertenece a la historia.",
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
    "bridge": "Ha salido la infección. Antes de pedir una muestra, aclaremos para qué.",
    "md": "A la sala: «¿Qué dos posibilidades revisaríais antes de añadir tratamiento?». Ordena las respuestas como hipótesis. La herida puede pinchar la inercia, no atribuir por sí sola una causa al estancamiento. Es la segunda pausa de participación.\n\nRECORRIDO EDITORIAL\nActuación: Intensificar sin revisar por qué no avanza.\nPregunta: ¿Qué revisamos antes de añadir tratamiento?\nAprendizaje: Reabrir la valoración y justificar el siguiente paso.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué revisamos antes de añadir tratamiento?». No abrir una ronda en cada escena."
      ],
      [
        "t1",
        "Segunda pausa con la sala: pide dos posibilidades ante la falta de progreso."
      ],
      [
        "razon i2 i3",
        "Reabrir el diagnóstico, sin dar una causa por confirmada. Comprobar complicaciones y situación vascular. Revisar aplicación y tolerancia del plan. G14, p. 15."
      ],
      [
        "t3 m1",
        "Vuelve a la referencia registrada. Ordena las aportaciones como hipótesis."
      ],
      [
        "cerrar p1",
        "Explica el fundamento: Cuando la evolución no es la esperada, se reevalúan el diagnóstico, las complicaciones, la intervención y los factores que pueden dificultar la cicatrización. Repetir o intensificar automáticamente no responde a esa pregunta. Fuente: GNEAUPP · DT XIV (2020), p. 15: reevaluación y ajuste del plan · EWMA 2022, §§3 y 6. "
      ],
      [
        "enlace",
        "Responde la pregunta: «Reabrir la valoración y justificar el siguiente paso.». Haz una pausa. Después enlaza: «Ha salido la infección. Antes de pedir una muestra, aclaremos para qué.»"
      ]
    ],
    "voice": "principal",
    "habit": "Intensificar sin revisar por qué no avanza.",
    "ask": "¿Qué revisamos antes de añadir tratamiento?",
    "role": "practice",
    "safety": "",
    "scienceTitle": "La falta de progreso reabre la valoración",
    "scienceText": "Reevaluar permite revisar la explicación, detectar complicaciones y decidir si hacen falta otras pruebas o un ajuste del plan."
  },
  {
    "id": "cultivo",
    "mov": 1,
    "q": 2,
    "title": "Antes de pedir la muestra",
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
    "propose": "Formular la pregunta clínica y justificar la muestra y su técnica.",
    "refs": [
      "G8",
      "E26"
    ],
    "src": "GNEAUPP · DT VIII, pp. 23–24 · EWMA (2026), ficha de úlcera venosa, muestras.",
    "type": "Recomendaciones sobre toma de muestras",
    "limit": "Una evolución desfavorable exige valoración; no impone por sí sola el cultivo. No se detallan técnicas.",
    "open": "He traído una torunda. Para que no digas que vengo sin recursos.",
    "turns": [
      {
        "label": "Muy bien. Ahora dime para qué la vamos a usar.",
        "reply": "Ahí quería llegar. El material ya lo tenemos; falta concretar la duda.",
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
        "label": "Y también importa cómo tomamos la muestra.",
        "reply": "Sí. El bote tiene sus límites: no arregla lo que haya pasado antes.",
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
        "label": "El resultado tiene que ayudarnos a decidir algo.",
        "reply": "Pues dejemos dicho qué decisión podría cambiar. Así lo retomamos cuando llegue.",
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
    "bridge": "Vamos a imaginar que llega el informe: cultivo positivo.",
    "md": "«¿Qué sospechamos y qué haríamos distinto con el resultado?». Explica la indicación y la calidad de la muestra. Mala evolución exige valoración, no cultivo automático. El informe siguiente es un supuesto docente.\n\nRECORRIDO EDITORIAL\nActuación: Pedir un cultivo porque toca.\nPregunta: ¿Qué decisión podría cambiar con el resultado?\nAprendizaje: Formular la pregunta clínica y justificar la muestra y su técnica.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué decisión podría cambiar con el resultado?». No abrir una ronda en cada escena."
      ],
      [
        "t1 m1 i3",
        "Plantea el motivo antes de la muestra. G8, pp. 23–24. Conecta el resultado esperado con una decisión que podría cambiar."
      ],
      [
        "t2",
        "La preparación y la técnica condicionan la calidad."
      ],
      [
        "t3 razon i3",
        "Revisa el motivo: la costumbre no es indicación. La mala evolución exige valorar; no impone automáticamente cultivar."
      ],
      [
        "p3",
        "Explica el fundamento: La muestra necesita una indicación, una preparación y una técnica adecuadas, y un resultado que pueda modificar la decisión. Las fuentes desaconsejan el muestreo rutinario de todas las heridas. Fuente: GNEAUPP · DT VIII, pp. 23–24 · EWMA (2026), ficha de úlcera venosa, muestras. Condición que debe decirse: La falta de progreso aislada no obliga a cultivar."
      ],
      [
        "enlace",
        "Responde la pregunta: «Formular la pregunta clínica y justificar la muestra y su técnica.». Haz una pausa. Después enlaza: «Vamos a imaginar que llega el informe: cultivo positivo.»"
      ]
    ],
    "voice": "principal",
    "habit": "Pedir un cultivo porque toca.",
    "ask": "¿Qué decisión podría cambiar con el resultado?",
    "role": "practice",
    "safety": "La falta de progreso aislada no obliga a cultivar.",
    "scienceTitle": "La muestra responde una pregunta clínica",
    "scienceText": "La indicación, la preparación y la técnica condicionan la utilidad de la muestra. Su resultado debe poder orientar una decisión."
  },
  {
    "id": "infeccion",
    "mov": 1,
    "q": 0,
    "title": "Cuando llega el informe",
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
    "propose": "Interpretar el resultado junto con la clínica y la evolución.",
    "refs": [
      "G8",
      "E22"
    ],
    "src": "GNEAUPP · DT VIII (2021), pp. 17 y 23–24: diagnóstico clínico y muestras · EWMA 2022, §3.",
    "type": "Revisión y recomendaciones sobre infección",
    "limit": "Supuesto docente: sin microorganismos ni antibiograma inventados.",
    "open": "Aquí está el supuesto informe: «cultivo positivo». Sé lo que me vas a preguntar.",
    "turns": [
      {
        "label": "¿Cómo está la herida y cómo está la persona?",
        "reply": "Lo sabía. Han crecido microorganismos en la muestra; esa línea no cuenta lo demás.",
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
        "label": "Necesito signos, evolución y contexto.",
        "reply": "Te pongo el informe al lado de la historia. Separados daban una conversación demasiado corta.",
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
        "label": "¿Ves por qué no quiero decidir solo con el papel?",
        "reply": "Lo veo. El resultado aporta un dato, no termina la visita.",
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
    "bridge": "Y cuando no avanza, a veces aparece otra palabra: biofilm.",
    "md": "«El diagnóstico necesita interpretar el resultado con la clínica». Explica signos, evolución y sus límites. La complicidad se construye al anticipar la pregunta, no bromeando con la infección. Si hay gravedad, la atención no espera.\n\nRECORRIDO EDITORIAL\nActuación: Dar por segura la infección por un cultivo positivo.\nPregunta: ¿Qué signos tienen la herida y la persona?\nAprendizaje: Interpretar el resultado junto con la clínica y la evolución.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué signos tienen la herida y la persona?». No abrir una ronda en cada escena."
      ],
      [
        "t1 m1",
        "Separa el resultado microbiológico del diagnóstico clínico. G8, p. 17."
      ],
      [
        "t2 i4",
        "Relaciona signos, evolución y situación de la persona. Recuerda que en algunos contextos los signos pueden estar atenuados."
      ],
      [
        "t3 razon i3",
        "Una decisión breve para pensar, sin abrir otro debate completo. Si hay gravedad, la atención no espera."
      ],
      [
        "p2",
        "Explica el fundamento: La presencia de microorganismos o un cultivo positivo no establecen por sí solos infección clínica. El resultado se interpreta junto con los signos, la evolución y la situación de la persona, teniendo en cuenta que en algunos contextos los signos pueden estar atenuados. Fuente: GNEAUPP · DT VIII (2021), pp. 17 y 23–24: diagnóstico clínico y muestras · EWMA 2022, §3. Condición que debe decirse: Ante infección extendida o grave, no demorar la atención indicada."
      ],
      [
        "enlace",
        "Responde la pregunta: «Interpretar el resultado junto con la clínica y la evolución.». Haz una pausa. Después enlaza: «Y cuando no avanza, a veces aparece otra palabra: biofilm.»"
      ]
    ],
    "voice": "principal",
    "habit": "Dar por segura la infección por un cultivo positivo.",
    "ask": "¿Qué signos tienen la herida y la persona?",
    "role": "practice",
    "safety": "Ante infección extendida o grave, no demorar la atención indicada.",
    "scienceTitle": "El resultado necesita contexto clínico",
    "scienceText": "La presencia de microorganismos no demuestra por sí sola infección. Se interpreta junto con signos, evolución y situación de la persona."
  },
  {
    "id": "biofilm",
    "mov": 1,
    "q": 0,
    "title": "La hipótesis del biofilm",
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
    "propose": "Mantener el razonamiento y revisar las demás causas posibles.",
    "refs": [
      "E22",
      "E26"
    ],
    "src": "EWMA 2022, §§2–3: biofilm, biocarga y límites de evaluación. Comparación de hipótesis: síntesis docente.",
    "type": "Revisión y fichas de práctica",
    "limit": "El modelo ilustra el concepto; no representa biofilm observado en el caso.",
    "open": "«Será biofilm». También me han presentado así. Sin apellido ni más preguntas.",
    "turns": [
      {
        "label": "Enséñame el modelo antes de seguir.",
        "reply": "Aquí lo tienes. Es una ilustración del concepto, no biofilm que hayamos visto en esta historia.",
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
        "label": "No me cierres las otras posibilidades.",
        "reply": "No las he quitado de la mesa. Las dejé donde estábamos mirando antes.",
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
        "label": "Entonces, ¿qué nos aporta llamarlo así?",
        "reply": "Una posibilidad que estudiar. Si quieres una respuesta cerrada, hoy te voy a decepcionar.",
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
    "bridge": "Pasemos del nombre del problema al motivo del tratamiento.",
    "md": "«El concepto puede ayudarnos a entender una posibilidad; no demuestra que explique esta herida». Define desde EWMA y vuelve al razonamiento. La herida no adquiere autoridad científica por acumular experiencias.\n\nRECORRIDO EDITORIAL\nActuación: Decir «será biofilm» y dejar de buscar.\nPregunta: ¿Qué explica esta hipótesis y qué sigue pendiente?\nAprendizaje: Mantener el razonamiento y revisar las demás causas posibles.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué explica esta hipótesis y qué sigue pendiente?». No abrir una ronda en cada escena."
      ],
      [
        "t1 m1 h1",
        "Presenta el concepto con el modelo, sin atribuirlo al caso. EWMA 2022, §2."
      ],
      [
        "h2",
        "Matriz: una explicación breve."
      ],
      [
        "h3",
        "Microorganismos. El modelo no demuestra biofilm en esta herida."
      ],
      [
        "cerrar t2",
        "Mantén abiertas las demás hipótesis."
      ],
      [
        "p3",
        "Explica el fundamento: El biofilm tiene un papel en las heridas de difícil cicatrización, y su evaluación tiene límites. Conocer el mecanismo no demuestra que explique esta lesión: la hipótesis convive con la revisión de perfusión, carga, intervención y contexto. Fuente: EWMA 2022, §§2–3: biofilm, biocarga y límites de evaluación. Comparación de hipótesis: síntesis docente. Condición que debe decirse: El modelo no demuestra biofilm en una herida concreta."
      ],
      [
        "enlace",
        "Responde la pregunta: «Mantener el razonamiento y revisar las demás causas posibles.». Haz una pausa. Después enlaza: «Pasemos del nombre del problema al motivo del tratamiento.»"
      ]
    ],
    "voice": "principal",
    "habit": "Decir «será biofilm» y dejar de buscar.",
    "ask": "¿Qué explica esta hipótesis y qué sigue pendiente?",
    "role": "practice",
    "safety": "El modelo no demuestra biofilm en una herida concreta.",
    "scienceTitle": "Una hipótesis que no cierra el razonamiento",
    "scienceText": "El biofilm puede contribuir a la dificultad de cicatrización. Un modelo o el aspecto de una imagen no demuestran que explique esta lesión."
  },
  {
    "id": "antimicrobianos",
    "mov": 1,
    "q": 2,
    "title": "El motivo del antimicrobiano",
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
    "propose": "Vincular la elección a la indicación y a la gravedad.",
    "refs": [
      "G8",
      "E22"
    ],
    "src": "GNEAUPP · DT VIII, pp. 27–30 · EWMA 2022, §6.2.",
    "type": "Revisión y recomendaciones de uso responsable",
    "limit": "Existen indicaciones específicas. No retrasar la atención ante infección extendida o grave.",
    "open": "Mira cuánto cabe en la palabra «antimicrobiano».",
    "turns": [
      {
        "label": "Sepárame las opciones, que no son lo mismo.",
        "reply": "Te las pongo juntas para comparar. La explicación de qué hace cada una te la dejo a ti.",
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
        "label": "Primero quiero saber si hace falta.",
        "reply": "Ya vamos coincidiendo. «Por si acaso» deja bastante sin explicar.",
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
        "label": "Y si hay gravedad, cambia la prioridad.",
        "reply": "Entonces dejamos el catálogo. Lo que está pasando necesita otra atención.",
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
        "state": "exploring"
      }
    ],
    "bridge": "Si lo indicamos, dejemos preparada también la revisión.",
    "md": "«Primero la indicación. Después, la elección». Distingue antibiótico, antiséptico y apósito antimicrobiano. Tú explicas alcance, excepciones y actuación ante gravedad. El personaje presenta los recursos; la recomendación se apoya en las fuentes.\n\nRECORRIDO EDITORIAL\nActuación: Añadir un antimicrobiano «por si acaso».\nPregunta: ¿Hace falta y qué problema queremos tratar?\nAprendizaje: Vincular la elección a la indicación y a la gravedad.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Hace falta y qué problema queremos tratar?». No abrir una ronda en cada escena."
      ],
      [
        "t2 razon i2",
        "Primero la indicación. G8, pp. 27–30: el resultado aislado no decide. La valoración clínica orienta la actuación."
      ],
      [
        "t1 m1 i2 i3",
        "Distingue antibiótico de las intervenciones locales. No son una escalera. Antiséptico: indicación y tolerancia. Apósito antimicrobiano: objetivo y revisión."
      ],
      [
        "t3",
        "No retrasar atención sistémica si está indicada."
      ],
      [
        "p1",
        "Explica el fundamento: Antibiótico, antiséptico y apósito antimicrobiano tienen funciones y alcances distintos; no se ordenan por potencia. Primero se decide si hace falta una intervención antimicrobiana y después cuál, valorando la gravedad. Fuente: GNEAUPP · DT VIII, pp. 27–30 · EWMA 2022, §6.2. Condición que debe decirse: Ante infección extendida o grave, no retrasar la atención indicada."
      ],
      [
        "enlace",
        "Responde la pregunta: «Vincular la elección a la indicación y a la gravedad.». Haz una pausa. Después enlaza: «Si lo indicamos, dejemos preparada también la revisión.»"
      ]
    ],
    "voice": "principal",
    "habit": "Añadir un antimicrobiano «por si acaso».",
    "ask": "¿Hace falta y qué problema queremos tratar?",
    "role": "practice",
    "safety": "Ante infección extendida o grave, no retrasar la atención indicada.",
    "scienceTitle": "La indicación precede a la elección",
    "scienceText": "Antibiótico, antiséptico y apósito antimicrobiano tienen funciones y alcances diferentes. La elección requiere valoración clínica y de la gravedad."
  },
  {
    "id": "revision-antimicrobiano",
    "mov": 1,
    "q": 4,
    "title": "La revisión pendiente",
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
    "propose": "Preparar la revisión de respuesta e indicación, respetando el ámbito de la recomendación.",
    "refs": [
      "G8",
      "E22"
    ],
    "src": "GNEAUPP · DT VIII, p. 38 · EWMA 2022, §6.",
    "type": "Recomendación específica sobre plata",
    "limit": "Los 14 días se refieren a la plata en heridas infectadas; no se extrapolan.",
    "open": "Esta pauta tiene fecha de inicio. La revisión se ha quedado sin casilla.",
    "turns": [
      {
        "label": "Pues vamos a ponerla. ¿Qué dejamos previsto?",
        "reply": "Cuándo mirar la respuesta y qué esperábamos conseguir. Yo te guardo la pauta; tú deja el motivo.",
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
        "label": "Cuidado, que los catorce días tienen un contexto.",
        "reply": "Te lo iba a preguntar. Esa cifra sale de la recomendación sobre plata, no de todo lo que hay en el carro.",
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
        "label": "Y el calendario no va a decidir por nosotras.",
        "reply": "Mejor. Bastante trabajo tiene con recordar la cita.",
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
    "bridge": "Ahora enséñame algo que hacemos en cada cura: la limpieza.",
    "md": "Explica el ámbito concreto de G8 sobre plata y revaloración a los 14 días. «Necesitamos la respuesta para justificar si continuamos, retiramos o cambiamos». Una réplica ligera sobre el calendario basta; no conviertas la indicación en un chiste.\n\nRECORRIDO EDITORIAL\nActuación: Renovar la plata sin revisar su indicación.\nPregunta: ¿Cuándo comprobamos si todavía hace falta?\nAprendizaje: Preparar la revisión de respuesta e indicación, respetando el ámbito de la recomendación.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Cuándo comprobamos si todavía hace falta?». No abrir una ronda en cada escena."
      ],
      [
        "t1",
        "Deja claro el objetivo y la respuesta esperada."
      ],
      [
        "t2 m1 i4",
        "G8, p. 38: plata en heridas infectadas, máximo inicial de 14 días y revaloración crítica. No recomienda uso extensivo, prolongado o preventivo. No extrapoles el plazo."
      ],
      [
        "t3 razon i2",
        "Continuar, retirar o cambiar requiere justificación. Respuesta insuficiente: revisar el diagnóstico y el plan."
      ],
      [
        "p2",
        "Explica el fundamento: Iniciar un antimicrobiano incluye dejar preparada su revisión. GNEAUPP aconseja con plata en heridas infectadas un periodo inicial máximo de 14 días, seguido de una revaloración crítica de su utilidad, y no recomienda su uso extensivo, prolongado o preventivo. Fuente: GNEAUPP · DT VIII, p. 38 · EWMA 2022, §6. Condición que debe decirse: Plata en heridas infectadas: máximo inicial de 14 días y revaloración crítica. El plazo no se extrapola."
      ],
      [
        "enlace",
        "Responde la pregunta: «Preparar la revisión de respuesta e indicación, respetando el ámbito de la recomendación.». Haz una pausa. Después enlaza: «Ahora enséñame algo que hacemos en cada cura: la limpieza.»"
      ]
    ],
    "voice": "principal",
    "habit": "Renovar la plata sin revisar su indicación.",
    "ask": "¿Cuándo comprobamos si todavía hace falta?",
    "role": "practice",
    "safety": "Plata en heridas infectadas: máximo inicial de 14 días y revaloración crítica. El plazo no se extrapola.",
    "scienceTitle": "La indicación también se revisa",
    "scienceText": "La plata requiere revalorar críticamente su utilidad tras el periodo inicial indicado por GNEAUPP. Renovarla exige revisar la respuesta y el motivo."
  },
  {
    "id": "limpieza",
    "mov": 1,
    "q": 2,
    "title": "La limpieza de hoy",
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
    "propose": "Adaptar la limpieza a la valoración y al objetivo.",
    "refs": [
      "G17",
      "I25"
    ],
    "src": "GNEAUPP · DT XVII (2023) · IWII 2025, recomendación 3 y 11, p. 31: zonas y selección de técnica.",
    "type": "Documento técnico y consenso internacional",
    "limit": "Limpieza y desbridamiento no son equivalentes. Presión y temperatura requieren contexto.",
    "open": "Te vuelvo a sacar la imagen de antes. Ahora vamos a usarla para otra cosa.",
    "turns": [
      {
        "label": "Enséñame qué zonas tenemos que considerar.",
        "reply": "El lecho, el borde y la piel de alrededor. Esta ya la conoces; no te hago otra visita guiada completa.",
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
        "label": "Lo que cambia es la pregunta: ¿qué necesita hoy?",
        "reply": "Exacto. La imagen es la misma. La técnica necesita la valoración y el objetivo de esta cura.",
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
        "label": "También quiero saber cómo se tolera.",
        "reply": "Eso no viene dibujado. Habrá que preguntarlo y observar qué ocurre mientras se hace.",
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
    "bridge": "Vamos a detenernos en el dolor antes de seguir.",
    "md": "«Recuperamos una imagen conocida con una pregunta distinta». No repitas la explicación por zonas. Relaciona solución, técnica, objetivo y tolerancia. Conserva la diferencia entre limpieza y desbridamiento.\n\nRECORRIDO EDITORIAL\nActuación: Limpiar siempre igual.\nPregunta: ¿Qué necesita la limpieza hoy, en cada zona?\nAprendizaje: Adaptar la limpieza a la valoración y al objetivo.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué necesita la limpieza hoy, en cada zona?». No abrir una ronda en cada escena."
      ],
      [
        "t1 m1 h1",
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
        "t2 m2",
        "IWII 2025, rec. 11: selección según herida, piel, objetivos y persona."
      ],
      [
        "cerrar i3",
        "Comprobar tolerancia y respuesta. Limpieza y desbridamiento no son equivalentes."
      ],
      [
        "p2",
        "Explica el fundamento: La limpieza terapéutica abarca la herida y la piel. Solución, técnica y fuerza se seleccionan según la valoración, los objetivos y las características de cada zona. No es un ritual idéntico en todas las lesiones. Fuente: GNEAUPP · DT XVII (2023) · IWII 2025, recomendación 3 y 11, p. 31: zonas y selección de técnica. Condición que debe decirse: Limpieza y desbridamiento son intervenciones diferentes."
      ],
      [
        "enlace",
        "Responde la pregunta: «Adaptar la limpieza a la valoración y al objetivo.». Haz una pausa. Después enlaza: «Vamos a detenernos en el dolor antes de seguir.»"
      ]
    ],
    "voice": "principal",
    "habit": "Limpiar siempre igual.",
    "ask": "¿Qué necesita la limpieza hoy, en cada zona?",
    "role": "practice",
    "safety": "Limpieza y desbridamiento son intervenciones diferentes.",
    "scienceTitle": "La técnica depende de la valoración",
    "scienceText": "IWII relaciona la selección con la herida y sus bordes, la piel, los objetivos, los factores individuales y los recursos disponibles."
  },
  {
    "id": "dolor",
    "mov": 1,
    "q": 3,
    "title": "El dolor en la cura",
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
    "propose": "Anticipar, valorar y revisar el dolor y la tolerancia.",
    "refs": [
      "I25",
      "G14"
    ],
    "src": "IWII 2025, recomendación 13, pp. 39–40 · GNEAUPP · DT XIV, p. 28.",
    "type": "Consenso y recomendación de práctica",
    "limit": "No se establecen tiempos analgésicos universales.",
    "open": "De esta parte prefiero que hablemos despacio: la cura puede doler.",
    "turns": [
      {
        "label": "¿Qué necesitamos saber antes de empezar?",
        "reply": "Cómo fue la cura anterior y qué dolor hay hoy. En el registro que vimos, eso no aparecía.",
        "kind": "facts",
        "resourceTitle": "Lo que falta preguntar",
        "items": [
          [
            "Preguntar",
            "Cómo se encuentra la persona y qué ocurrió en la cura anterior."
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
        "voice": "principal",
        "state": "discomfort"
      },
      {
        "label": "Y no basta con preguntarlo al principio.",
        "reply": "Durante la cura también cambia lo que está pasando.",
        "kind": "facts",
        "resourceTitle": "Lo que falta preguntar",
        "items": [
          [
            "Escuchar",
            "El dolor que refiere durante la cura."
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
        "voice": "principal",
        "state": "discomfort"
      },
      {
        "label": "Dejaremos registrado qué necesita ajustarse.",
        "reply": "Para que esa conversación llegue a quien haga la siguiente cura.",
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
    "bridge": "Te voy a pedir ahora el ejemplo del talón con escara.",
    "md": "«¿Hemos valorado el dolor y planificado cómo abordarlo?». Desarrolla anticipación, escucha, adaptación y reevaluación desde las fuentes. Sin humor en dolor, sin voz de paciente recreada y sin prometer una cura indolora.\n\nRECORRIDO EDITORIAL\nActuación: Dar por inevitable el dolor de la cura.\nPregunta: ¿Cómo lo vive y qué podemos ajustar?\nAprendizaje: Anticipar, valorar y revisar el dolor y la tolerancia.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Cómo lo vive y qué podemos ajustar?». No abrir una ronda en cada escena."
      ],
      [
        "t1 m2",
        "«Antes de empezar, ¿hemos valorado el dolor y cómo abordarlo?»."
      ],
      [
        "t2",
        "«También durante la cura». Explica escucha y adaptación desde IWII, rec. 13."
      ],
      [
        "t3 m1",
        "«Y para la siguiente visita, ¿qué necesita quedar registrado?». Sin tiempos universales."
      ],
      [
        "cerrar p2",
        "Explica el fundamento: El dolor se valora antes, se anticipa su manejo, se adapta la técnica durante el procedimiento y se evalúa después. Normalizarlo o mantener una técnica sin revisar su tolerancia no forma parte de un cuidado justificado. Fuente: IWII 2025, recomendación 13, pp. 39–40 · GNEAUPP · DT XIV, p. 28. "
      ],
      [
        "enlace",
        "Responde la pregunta: «Anticipar, valorar y revisar el dolor y la tolerancia.». Haz una pausa. Después enlaza: «Te voy a pedir ahora el ejemplo del talón con escara.»"
      ]
    ],
    "voice": "principal",
    "habit": "Dar por inevitable el dolor de la cura.",
    "ask": "¿Cómo lo vive y qué podemos ajustar?",
    "role": "practice",
    "safety": "",
    "scienceTitle": "La experiencia de dolor cambia el cuidado",
    "scienceText": "IWII recomienda adaptar la técnica de limpieza e incorporar estrategias de manejo según la experiencia de dolor de la persona."
  },
  {
    "id": "escaras",
    "mov": 2,
    "q": 2,
    "voice": "principal",
    "title": "El talón con escara",
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
    "propose": "Comprobar la seguridad y el contexto antes de decidir la intervención.",
    "refs": [
      "G14",
      "E26"
    ],
    "src": "GNEAUPP · DT XIV, pp. 21 y 28 · EWMA (2026), ficha de isquemia amenazante.",
    "type": "Recomendaciones con condiciones específicas",
    "limit": "No es una prohibición universal de todos los métodos. La gravedad requiere atención oportuna.",
    "open": "Aquí está el talón que me pediste. Hay una propuesta de retirar la escara.",
    "turns": [
      {
        "label": "Antes de decidir, enséñame los datos.",
        "reply": "Escara seca y propuesta de desbridamiento cortante. La valoración que permitiría decidir está incompleta.",
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
        "voice": "principal",
        "state": "listening"
      },
      {
        "label": "¿Qué nos falta comprobar?",
        "reply": "Cómo llega la sangre, la estabilidad y los posibles signos de complicación.",
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
        "voice": "principal",
        "state": "exploring"
      },
      {
        "label": "Ver algo que retirar no basta para retirarlo.",
        "reply": "Por eso te he traído el ejemplo. El aspecto llamaba la atención; la decisión necesitaba más.",
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
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Vamos con otra historia: una en la que la explicación deja de encajar.",
    "md": "«En este supuesto, ¿qué cambia la seguridad de intervenir?». Integra perfusión, estabilidad, complicaciones, objetivos y gravedad. No generalices la recomendación a todos los métodos ni presentes el ejemplo como evolución de una misma lesión.\n\nRECORRIDO EDITORIAL\nActuación: Decidir desbridar solo por ver necrosis.\nPregunta: ¿Qué sabemos de la perfusión, la estabilidad y las complicaciones?\nAprendizaje: Comprobar la seguridad y el contexto antes de decidir la intervención.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué sabemos de la perfusión, la estabilidad y las complicaciones?». No abrir una ronda en cada escena."
      ],
      [
        "t1 m1",
        "Contrapunto: talón con escara seca y propuesta de desbridamiento cortante."
      ],
      [
        "h1",
        "Primer dato: perfusión. G14, pp. 21 y 28."
      ],
      [
        "h2",
        "Estabilidad, drenaje y otros signos de complicación."
      ],
      [
        "h3",
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
        "p2",
        "Explica el fundamento: La presencia de tejido necrótico no basta para decidir. Perfusión, estabilidad y signos de complicación condicionan el desbridamiento cortante. En lesiones isquémicas con escara seca sin revascularizar no se recomienda aplicar ambiente húmedo de forma automática. Fuente: GNEAUPP · DT XIV, pp. 21 y 28 · EWMA (2026), ficha de isquemia amenazante. Condición que debe decirse: En el talón con escara seca, valorar perfusión, estabilidad y complicaciones. No es una prohibición universal."
      ],
      [
        "enlace",
        "Responde la pregunta: «Comprobar la seguridad y el contexto antes de decidir la intervención.». Haz una pausa. Después enlaza: «Vamos con otra historia: una en la que la explicación deja de encajar.»"
      ]
    ],
    "habit": "Decidir desbridar solo por ver necrosis.",
    "ask": "¿Qué sabemos de la perfusión, la estabilidad y las complicaciones?",
    "role": "practice",
    "safety": "Antes del desbridamiento cortante en extremidades inferiores se necesita valoración vascular. Los signos de complicación cambian la prioridad.",
    "scienceTitle": "La escara necesita contexto",
    "scienceText": "GNEAUPP no considera preciso el desbridamiento cortante de la escara seca de talón sin infección, edema, eritema, fluctuación ni drenaje."
  },
  {
    "id": "atipica",
    "mov": 2,
    "q": 0,
    "title": "La explicación que no encaja",
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
    "propose": "Documentar la incertidumbre y solicitar la valoración necesaria.",
    "refs": [
      "E26"
    ],
    "src": "EWMA (2026), ficha 1, pp. 3–6.",
    "type": "Ficha clínica sobre lesiones atípicas",
    "limit": "No se propone diagnosticar por imagen ni reconocer una enfermedad concreta.",
    "open": "Esta historia no encaja bien con la explicación que traíamos.",
    "turns": [
      {
        "label": "¿Me estás pidiendo que vuelva al diagnóstico?",
        "reply": "Sí. Ya hemos hablado de cambiar la cura. Aquí toca mirar también la explicación.",
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
        "label": "Enséñame el contraste, pero sin hacer adivinanzas.",
        "reply": "Hecho. Es otra lesión, otro ejemplo. La foto abre una duda, no resuelve su nombre.",
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
        "label": "A veces la siguiente decisión será consultar.",
        "reply": "También es una forma de seguir la historia. No hace falta tener la respuesta para plantear bien la duda.",
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
    "bridge": "Volvamos a la pregunta de la mesa: qué podemos esperar conseguir.",
    "md": "«Si los datos no encajan, reabrimos el diagnóstico y valoramos la consulta». Explica desde la ficha clínica. Evita un concurso de reconocimiento por imagen y la atribución de un diagnóstico al personaje abstracto.\n\nRECORRIDO EDITORIAL\nActuación: Insistir en una explicación que no encaja.\nPregunta: ¿Necesitamos revisar el diagnóstico?\nAprendizaje: Documentar la incertidumbre y solicitar la valoración necesaria.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Necesitamos revisar el diagnóstico?». No abrir una ronda en cada escena."
      ],
      [
        "t1",
        "Recupera la pregunta sobre la causa, sin repetir el bloque inicial."
      ],
      [
        "t2 m1",
        "EWMA, ficha 1, pp. 3–6: algunas lesiones inflamatorias parecen infecciosas."
      ],
      [
        "cerrar t3 razon i2",
        "Contrasta intensificar con revisar la explicación. Documentar la incertidumbre y solicitar valoración especializada."
      ],
      [
        "p3",
        "Explica el fundamento: Algunas lesiones inflamatorias pueden parecer infecciosas. Cuando la evolución no encaja, el diagnóstico preciso y la valoración especializada ayudan a evitar tanto el sobretratamiento como el infratratamiento de la infección. Fuente: EWMA (2026), ficha 1, pp. 3–6. Condición que debe decirse: La fotografía ilustra el ejemplo; el diagnóstico requiere valoración."
      ],
      [
        "enlace",
        "Responde la pregunta: «Documentar la incertidumbre y solicitar la valoración necesaria.». Haz una pausa. Después enlaza: «Volvamos a la pregunta de la mesa: qué podemos esperar conseguir.»"
      ]
    ],
    "voice": "principal",
    "habit": "Insistir en una explicación que no encaja.",
    "ask": "¿Necesitamos revisar el diagnóstico?",
    "role": "practice",
    "safety": "La fotografía ilustra el ejemplo; el diagnóstico requiere valoración.",
    "scienceTitle": "La discordancia exige reconsiderar",
    "scienceText": "Algunas heridas inflamatorias pueden parecer infecciosas. La evolución y los hallazgos que no encajan requieren reconsiderar el diagnóstico y la valoración especializada."
  },
  {
    "id": "capacidad",
    "mov": 2,
    "q": 1,
    "title": "Lo que podemos conseguir",
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
    "propose": "Valorar las posibilidades y acordar objetivos revisables.",
    "refs": [
      "G14",
      "E22",
      "I25"
    ],
    "src": "GNEAUPP · DT XIV, p. 15 · EWMA 2022, §4, pp. S15–S16 · IWII 2025, p. 26. Organización de objetivos: síntesis docente.",
    "type": "Recomendación, revisión y consenso · síntesis docente",
    "limit": "Los objetivos se individualizan. No se clasifica el pronóstico ni se atribuye imposibilidad de cierre a una etiología. El contrapunto es hipotético.",
    "open": "Llevamos un rato juntas y todavía no me has prometido que todas vayamos a cerrar.",
    "turns": [
      {
        "label": "Tú tampoco me has dado datos para prometerlo.",
        "reply": "Por eso nos entendemos. Hay que valorar cada situación y lo que puede cambiar.",
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
        "label": "Muéstrame una historia con otro objetivo.",
        "reply": "En este supuesto buscamos aliviar. Te lo traigo para hablar de lo que se puede cuidar y revisar.",
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
        "voice": "principal",
        "state": "listening"
      },
      {
        "label": "Cambiar el objetivo también exige un plan.",
        "reply": "Sí. No he traído esta historia para dejarla sin seguimiento.",
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
        "voice": "principal",
        "state": "exploring"
      }
    ],
    "bridge": "Concretemos ahora qué mejora importa a quien vive con la herida.",
    "md": "«La posibilidad de cierre se valora. Los objetivos se acuerdan y se revisan». Presenta alivio como otro supuesto docente; no atribuyas imposibilidad de cierre por etiología. La herida no expresa los deseos de la persona.\n\nRECORRIDO EDITORIAL\nActuación: Prometer el cierre o descartarlo sin valorar.\nPregunta: ¿Qué podemos conseguir hoy con la persona?\nAprendizaje: Valorar las posibilidades y acordar objetivos revisables.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué podemos conseguir hoy con la persona?». No abrir una ronda en cada escena."
      ],
      [
        "t1 i2",
        "Recupera la pregunta de la mesa. La valoración orienta el objetivo. Explora las barreras y la viabilidad del plan, sin culpabilizar."
      ],
      [
        "t2",
        "Contrapunto docente: objetivo de alivio. IWII 2025, p. 26; EWMA 2022, §4."
      ],
      [
        "t3 m1",
        "Explica que cambiar el objetivo conserva el cuidado y la revisión."
      ],
      [
        "cerrar p2",
        "Explica el fundamento: La valoración de la herida y de la persona orienta los objetivos. El consenso IWII contempla objetivos de cicatrización, prevención de infección o manejo paliativo. Las prioridades y la viabilidad del cuidado se acuerdan con la persona y se revisan. Fuente: GNEAUPP · DT XIV, p. 15 · EWMA 2022, §4, pp. S15–S16 · IWII 2025, p. 26. Organización de objetivos: síntesis docente. Condición que debe decirse: Los objetivos se revisan. Una etiqueta diagnóstica no determina por sí sola la posibilidad de cierre."
      ],
      [
        "enlace",
        "Responde la pregunta: «Valorar las posibilidades y acordar objetivos revisables.». Haz una pausa. Después enlaza: «Concretemos ahora qué mejora importa a quien vive con la herida.»"
      ]
    ],
    "voice": "principal",
    "habit": "Prometer el cierre o descartarlo sin valorar.",
    "ask": "¿Qué podemos conseguir hoy con la persona?",
    "role": "practice",
    "safety": "Los objetivos se revisan. Una etiqueta diagnóstica no determina por sí sola la posibilidad de cierre.",
    "scienceTitle": "Los objetivos se valoran y se acuerdan",
    "scienceText": "IWII contempla objetivos de cicatrización, prevención de infección o manejo paliativo. La organización de estos objetivos en el recorrido es una síntesis docente."
  },
  {
    "id": "otros-resultados",
    "mov": 2,
    "q": 3,
    "title": "La mejora que importa",
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
    "propose": "Acordar y evaluar resultados relevantes, incluidos síntomas y vida cotidiana.",
    "refs": [
      "E22",
      "I25",
      "G14"
    ],
    "src": "EWMA 2022, §4, pp. S15–S16 · IWII 2025, rec. 13, pp. 39–40 · GNEAUPP DT XIV, p. 24: trauma y sangrado en lesiones neoplásicas. Seguimiento: síntesis docente.",
    "type": "Revisión, consenso y recomendaciones con ámbito específico",
    "limit": "El sangrado y la retirada atraumática se apoyan aquí en recomendaciones sobre heridas neoplásicas. Las prioridades se exploran mediante preguntas, sin atribuir respuestas a una paciente ni prometer resultados.",
    "open": "En nuestras historias hay más cosas que el día en que cerramos.",
    "turns": [
      {
        "label": "¿Qué no debería quedarse fuera?",
        "reply": "Lo que supone convivir con la herida. Eso no cabe en una medida del tamaño.",
        "kind": "facts",
        "resourceTitle": "Lo que falta preguntar",
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
        "voice": "principal",
        "state": "listening"
      },
      {
        "label": "La prioridad tendremos que preguntarla.",
        "reply": "Sí. Yo traigo historias; cuál es su prioridad tiene que decirlo la persona.",
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
        "label": "¿Y cómo retomaremos lo que acordemos?",
        "reply": "Dejándolo escrito con una referencia para revisarlo. Esa parte ya la hemos hablado tú y yo.",
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
        "state": "exploring"
      }
    ],
    "bridge": "Dejemos ese acuerdo preparado para quien continúe el cuidado.",
    "md": "«¿Qué mejora importa ahora a esta persona?». Explora dolor, descanso o carga de curas sin fingir respuestas ni elegir por ella. Relaciona prioridad y seguimiento, conservando el ámbito específico de las recomendaciones sobre sangrado y trauma.\n\nRECORRIDO EDITORIAL\nActuación: Valorar el beneficio solo por el cierre.\nPregunta: ¿Qué mejora le importa ahora a la persona?\nAprendizaje: Acordar y evaluar resultados relevantes, incluidos síntomas y vida cotidiana.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué mejora le importa ahora a la persona?». No abrir una ronda en cada escena."
      ],
      [
        "t1 m1",
        "Explica cómo preguntar por la prioridad de la persona; no representes una respuesta ni supongas que todas elegirán lo mismo."
      ],
      [
        "t2",
        "EWMA 2022, §4: impacto de síntomas y cuidado en la vida cotidiana."
      ],
      [
        "i5 m2",
        "Incluye tiempo, esfuerzo y apoyo en la carga del cuidado."
      ],
      [
        "t3",
        "Conecta una prioridad con una referencia que permita revisarla."
      ],
      [
        "p3",
        "Explica el fundamento: Dolor, fugas, olor, sangrado y carga de cuidados pueden ser resultados relevantes. Se acuerdan con la persona, de forma individualizada, y se evalúan respecto al objetivo pactado. Fuente: EWMA 2022, §4, pp. S15–S16 · IWII 2025, rec. 13, pp. 39–40 · GNEAUPP DT XIV, p. 24: trauma y sangrado en lesiones neoplásicas. Seguimiento: síntesis docente. Condición que debe decirse: Explorar la prioridad con la persona. La recomendación sobre sangrado citada se refiere a heridas neoplásicas."
      ],
      [
        "enlace",
        "Responde la pregunta: «Acordar y evaluar resultados relevantes, incluidos síntomas y vida cotidiana.». Haz una pausa. Después enlaza: «Dejemos ese acuerdo preparado para quien continúe el cuidado.»"
      ]
    ],
    "voice": "principal",
    "habit": "Valorar el beneficio solo por el cierre.",
    "ask": "¿Qué mejora le importa ahora a la persona?",
    "role": "practice",
    "safety": "Explorar la prioridad con la persona. La recomendación sobre sangrado citada se refiere a heridas neoplásicas.",
    "scienceTitle": "El beneficio se define con la persona",
    "scienceText": "Los síntomas y la carga del cuidado afectan a la vida cotidiana. Las prioridades se preguntan y se acuerda cómo evaluar el resultado buscado."
  },
  {
    "id": "continuidad",
    "mov": 3,
    "q": 4,
    "title": "Quien venga mañana",
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
    "propose": "Compartir objetivo, motivo, respuesta, revisión y vía de consulta.",
    "refs": [
      "E22",
      "E26"
    ],
    "src": "EWMA 2022, §§4–6: participación, comunicación y coordinación · EWMA, fichas de infección e isquemia. Relevo propuesto: síntesis docente.",
    "type": "Recomendaciones sobre continuidad y escalada",
    "limit": "El circuito concreto se adapta al área asistencial; no se inventan contactos ni plazos locales.",
    "open": "Yo me quedo. En la próxima visita puede venir otra compañera tuya.",
    "turns": [
      {
        "label": "No quiero que tenga que reconstruirlo todo.",
        "reply": "Entonces déjale el plan y el motivo. La lista de productos ya la encontrará.",
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
        "label": "Y qué hacer si algo cambia antes de la cita.",
        "reply": "Eso también. La historia no se para porque la siguiente casilla del calendario esté más lejos.",
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
        "label": "Fuera de la consulta también tiene que quedar claro.",
        "reply": "La información para pedir ayuda no puede quedarse solo entre tú y yo.",
        "kind": "facts",
        "resourceTitle": "Lo que falta preguntar",
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
        "voice": "principal",
        "state": "listening"
      }
    ],
    "bridge": "Volvamos al carro del principio. A ver si ahora empezaríamos igual.",
    "md": "«¿Podría otra compañera entender qué buscamos, por qué y cuándo revisarlo?». Añade la vía real de consulta del área. Distingue seguimiento programado y deterioro que requiere atención antes, sin inventar contactos ni plazos.\n\nRECORRIDO EDITORIAL\nActuación: Repetir el plan sin conocer su motivo.\nPregunta: ¿Qué necesita saber quien venga mañana?\nAprendizaje: Compartir objetivo, motivo, respuesta, revisión y vía de consulta.\nEn el paso científico, la herida escucha y el concepto toma el foco. La fuente y las condiciones acompañan la explicación.",
    "steps": [
      [
        "practica",
        "Pregunta a la sala para orientar la escucha: «¿Qué necesita saber quien venga mañana?». No abrir una ronda en cada escena."
      ],
      [
        "t1 i4",
        "EWMA 2022, §§4–6: información compartida y coordinación. El relevo es una síntesis docente. Deja prevista la próxima revisión."
      ],
      [
        "t2",
        "Distingue revisión programada y deterioro que requiere atención antes."
      ],
      [
        "t3 m1",
        "María del Mar explica la vía real de consulta de su área. No inventes contactos."
      ],
      [
        "cerrar p1",
        "Explica el fundamento: La continuidad requiere documentar objetivo, intervención, respuesta y próxima revisión, y compartir una vía de consulta. Hay que distinguir el seguimiento programado de los cambios que exigen valorar antes. Fuente: EWMA 2022, §§4–6: participación, comunicación y coordinación · EWMA, fichas de infección e isquemia. Relevo propuesto: síntesis docente. Condición que debe decirse: Adaptar la vía de consulta al circuito real del área. El deterioro puede exigir valorar antes."
      ],
      [
        "enlace",
        "Responde la pregunta: «Compartir objetivo, motivo, respuesta, revisión y vía de consulta.». Haz una pausa. Después enlaza: «Volvamos al carro del principio. A ver si ahora empezaríamos igual.»"
      ]
    ],
    "voice": "principal",
    "habit": "Repetir el plan sin conocer su motivo.",
    "ask": "¿Qué necesita saber quien venga mañana?",
    "role": "practice",
    "safety": "Adaptar la vía de consulta al circuito real del área. El deterioro puede exigir valorar antes.",
    "scienceTitle": "Compartir el razonamiento permite continuar",
    "scienceText": "La comunicación y la coordinación sostienen el seguimiento. El formato de relevo que proponemos reúne objetivo, intervención, respuesta, revisión y consulta."
  },
  {
    "id": "regreso",
    "mov": 3,
    "q": 2,
    "title": "Volvemos al carro",
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
    "propose": "Volver a una decisión conocida y explicar qué preguntaríamos ahora.",
    "refs": [
      "G14",
      "G8",
      "E22",
      "I25"
    ],
    "src": "Integración docente de GNEAUPP DT XIV, p. 15; DT VIII, pp. 23–30; EWMA 2022, §4; IWII 2025, rec. 11 y 13. Sin algoritmo ni resultado clínico validado.",
    "type": "Integración docente",
    "limit": "No se presenta una cicatrización ficticia como demostración.",
    "open": "El carro sigue aquí. ¿Empezaríamos igual?",
    "turns": [
      {
        "label": "¿Te acuerdas de las preguntas del principio?",
        "reply": "Te las he guardado. Para que no digas que soy yo la que se va por las ramas.",
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
        "label": "¿Vamos a empezar otra vez desde cero?",
        "reply": "Desde cero, no. Ahora sabemos qué preguntas necesitamos antes de elegir.",
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
        "label": "A la sala le voy a pedir un cambio concreto.",
        "reply": "Y su motivo. Mira, esa ya te la he aprendido.",
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
    "bridge": "Recojamos lo que hemos revisado antes de irnos.",
    "md": "Recupera una o dos preguntas de apertura. Pregunta qué información pediríamos ahora antes de elegir. La diferencia muestra aprendizaje en el razonamiento, sin representar una evolución clínica ficticia. Abre después la recopilación completa.",
    "steps": [
      [
        "t1 m1",
        "Recupera las dos preguntas de apertura. Pide una o dos aportaciones: ¿qué preguntaríamos ahora antes de elegir?"
      ],
      [
        "cerrar t2",
        "Reconoce el cambio en el razonamiento. La comparación es docente, no una mejoría clínica demostrada."
      ],
      [
        "enlace",
        "Cierra el regreso: «Ahora tenemos más claro qué necesitamos saber». Abre la recopilación completa."
      ]
    ],
    "voice": "principal",
    "habit": "",
    "ask": "",
    "safety": "",
    "role": "reflection"
  },
  {
    "id": "cinco-preguntas",
    "mov": 3,
    "q": null,
    "title": "Lo que nos llevamos",
    "label": "Síntesis",
    "exp": "Recopilación de las 21 actuaciones revisadas, agrupadas por los cuatro momentos. Los textos proceden de cada escena y conservan su fuente. Las cinco preguntas quedan disponibles como recordatorio complementario.",
    "points": [
      [
        "Antes de empezar · 1/2",
        "Actuaciones 1–4"
      ],
      [
        "Antes de empezar · 2/2",
        "Actuaciones 5–7"
      ],
      [
        "Durante la cura · 1/3",
        "Actuaciones 8–10"
      ],
      [
        "Durante la cura · 2/3",
        "Actuaciones 11–13"
      ],
      [
        "Durante la cura · 3/3",
        "Actuaciones 14–16"
      ],
      [
        "Cuando algo no encaja",
        "Actuaciones 17–20"
      ],
      [
        "Antes de irnos",
        "Actuación 21"
      ]
    ],
    "avoid": "Presentar las preguntas como una nueva escala o como etapas rígidas.",
    "propose": "Recuperar las 21 actuaciones con las mismas preguntas y aprendizajes del recorrido.",
    "refs": [
      "G14",
      "G8",
      "G17",
      "E22",
      "E26",
      "I25"
    ],
    "src": "Recopilación docente de las 21 actuaciones. Cada fila conserva el respaldo y el alcance de su escena. Bibliografía completa y localizadores en el resumen para llevar.",
    "type": "Propuesta docente no validada como instrumento",
    "limit": "Síntesis docente. No es un algoritmo ni una escala validada. Las condiciones de cada decisión se conservan en la escena y en el resumen.",
    "open": "Hemos ido dejando preguntas. Ahora vamos a recoger también lo que cambia cada una.",
    "turns": [
      {
        "label": "Enséñamelas una vez más.",
        "reply": "Aquí están. Han ido saliendo mientras mirábamos las historias.",
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
        "label": "No hace falta convertirlas en una escalera.",
        "reply": "Menos mal. Hemos vuelto atrás unas cuantas veces y no se ha roto la conversación.",
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
        "label": "¿Cuál llevaríamos a la próxima cura?",
        "reply": "La que haga falta para justificar la decisión que tengáis delante.",
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
    "bridge": "Elige ahora una actuación de tu práctica para revisar.",
    "md": "Recorre las siete páginas de resumen. Son las mismas 21 actuaciones, preguntas y aprendizajes vistos durante la charla. Recuerda cada relación en pocas palabras. Las cinco preguntas transversales quedan como apoyo en Ampliar y en el documento para llevar.",
    "steps": [
      [
        "p1",
        "Recupera antes de empezar · 1/2: actuaciones 1–4. Lee la relación entre actuación, pregunta y aprendizaje sin reabrir la explicación."
      ],
      [
        "p2",
        "Recupera antes de empezar · 2/2: actuaciones 5–7. Lee la relación entre actuación, pregunta y aprendizaje sin reabrir la explicación."
      ],
      [
        "p3",
        "Recupera durante la cura · 1/3: actuaciones 8–10. Lee la relación entre actuación, pregunta y aprendizaje sin reabrir la explicación."
      ],
      [
        "p4",
        "Recupera durante la cura · 2/3: actuaciones 11–13. Lee la relación entre actuación, pregunta y aprendizaje sin reabrir la explicación."
      ],
      [
        "p5",
        "Recupera durante la cura · 3/3: actuaciones 14–16. Lee la relación entre actuación, pregunta y aprendizaje sin reabrir la explicación."
      ],
      [
        "p6",
        "Recupera cuando algo no encaja: actuaciones 17–20. Lee la relación entre actuación, pregunta y aprendizaje sin reabrir la explicación."
      ],
      [
        "p7",
        "Recupera antes de irnos: actuación 21. Lee la relación entre actuación, pregunta y aprendizaje sin reabrir la explicación."
      ],
      [
        "enlace",
        "La tabla completa conserva las fuentes en el resumen para llevar. Pide elegir una actuación para la próxima cura."
      ]
    ],
    "voice": "principal",
    "habit": "",
    "ask": "",
    "safety": "",
    "role": "summary"
  },
  {
    "id": "cierre",
    "mov": 3,
    "q": null,
    "title": "En la próxima cura…",
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
    "propose": "Elegir una actuación y una pregunta para la próxima cura.",
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
    "open": "El carro estaba preparado desde el principio.",
    "turns": [
      {
        "label": "Y ahora llevamos unas cuantas preguntas para cuando lo acerquemos.",
        "reply": "Entonces tenemos conversación para la próxima visita.",
        "kind": "layers",
        "resourceTitle": "Para la próxima visita",
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
        "label": "¿Una última cosa para quienes nos han acompañado?",
        "reply": "Que piensen en una actuación que repiten y en el motivo para mantenerla hoy.",
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
        "label": "Gracias por enseñarnos tus historias.",
        "reply": "Tú guarda las preguntas. Yo ya te iré trayendo historias.",
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
    "md": "Recupera el carro del comienzo con la herida. Invita a elegir una actuación para la próxima cura y deja silencio. Cierra la pregunta de la mesa desde la valoración individual y los objetivos acordados y revisables. No prometer desenlaces. Despedida breve.",
    "steps": [
      [
        "t1",
        "Recupera con naturalidad el carro de la apertura. «Y ahora llevamos unas cuantas preguntas para cuando lo acerquemos»."
      ],
      [
        "practica",
        "A la sala: «En la próxima cura, ¿qué revisarías antes de repetir?». Deja unos segundos de silencio. No pedir otra ronda de respuestas."
      ],
      [
        "enlace",
        "Responde a la pregunta de la mesa: la posibilidad de cierre requiere valoración individual y objetivos acordados y revisables. Cierra sin prometer resultados. Gracias por acompañarnos."
      ]
    ],
    "voice": "principal",
    "habit": "",
    "ask": "En la próxima cura, ¿qué revisarías antes de repetir?",
    "safety": "",
    "role": "farewell"
  }
];
 // Expressive states: discomfort while talking about procedural pain, relief when the goal is agreed,
 // showing when a picture opens. They express the conversation, not clinical findings.
 const moods={dolor:{0:'discomfort',1:'discomfort'},capacidad:{2:'relief'},'otros-resultados':{2:'relief'}};
 S.forEach(d=>d.turns.forEach((t,i)=>{if(moods[d.id]?.[i])t.state=moods[d.id][i];else if(t.kind==='photo')t.state='showing';}));
 // The editable triplet lives in S; the summary reads the resulting slides.
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
  'cinco-preguntas':'21 actuaciones · fuentes por escena',cierre:'Cierre docente propio · bibliografía en Fuentes'
 };
 // The wound remains the same companion while the teaching examples change.
 INITIAL_DECK.movements=MOVES;
 // Stored drafts from an older edition get the new thread (steps, habits) when they load.
 INITIAL_DECK.edition='2026-10-30-recorrido-editorial';
 INITIAL_DECK.slides=S.map((d,i)=>{
  const s=slide(d.id,MOVES[d.mov].short,d.title,d.voice||'principal',d.open,d.turns.some(t=>t.kind==='decision')?'decision':'conversation',d.points,d.refs,d.q,{mov:d.mov,takeaway:d.propose});
  s.study={number:i+1,label:d.label,explanation:d.exp,sourceNote:d.src,sourceLabel:SOURCE_LABELS[d.id],evidenceType:d.type,limitation:d.limit,opening:d.open,avoid:d.avoid,propose:d.propose,role:d.role,habit:d.habit,ask:d.ask,safety:d.safety,scienceTitle:d.scienceTitle||'',scienceText:d.scienceText||'',
   caseLabel:'Personaje abstracto · historias docentes',bridge:d.bridge,turns:d.turns,steps:d.steps};
  s.notes='FUENTE Y RESPALDO\n'+d.src+'\n'+d.type+'\n\nESCENA '+(i+1)+' · '+MOVES[d.mov].short+'\nRevisamos: «'+d.habit+'» → '+d.ask+'\nLa herida abre: «'+d.open+'»\n\nMARÍA DEL MAR\n'+d.md+'\n\nPASOS\n'+d.steps.map((p,n)=>(n+1)+'. '+p[1]).join('\n')+'\n\nENLACE\n«'+d.bridge+'»\n\nREVISIÓN\n'+d.limit;
  return s;
 });
 // Two short introductions. The first scene demonstrates the interaction itself.
 const intro=(id,title,message,kind,open,steps,extra={})=>({...slide(id,'Introducción',title,'principal',message,'intro',[],[],null),intro:{kind,open,steps,...extra}});
 INITIAL_DECK.slides.unshift(
  intro('intro-tema','¿Es posible cicatrizar todas las heridas?','Qué no hacer en heridas crónicas.','tema','Bienvenida. Presenta la pregunta de la mesa y tu aportación.',
   [['r','Vamos a revisar decisiones que repetimos en las curas y las preguntas que nos ayudan a justificarlas.'],
    ['r','Revisamos una actuación, nos hacemos una pregunta y nos llevamos un aprendizaje. Las historias y la evidencia nos ayudan a decidir.']]),
  intro('intro-herida','Os presento a la herida','Una compañera de conversación para revisar nuestra práctica.','herida','Presenta el caso en una frase. La dinámica se entenderá al empezar.',
   [['r','La herida es un personaje abstracto que reúne historias; no representa a una paciente.'],
    ['r','María del Mar aporta la evidencia de los documentos citados.'],
    ['r','Empezamos por la primera decisión.']],
   {lines:['María del Mar y yo nos conocemos. Tenemos unas cuantas conversaciones pendientes.','He traído historias para enseñaros. Algunas se parecen; otras nos van a llevar la contraria.','María del Mar, tú pregunta. Yo te voy enseñando.']})
 );
})();

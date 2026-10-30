// Narrative edition (27/10/2026): the 24 scenes of RECORRIDO_NARRATIVO_24_ESCENAS.md.
// Three voices: science on the left, the wound on the right, María del Mar through the steps.
// Each step is "action | cue". Actions (space separated): tN ask turn N, iN select item N,
// pN highlight point N (p alone: all), razon reveal reasoning, practica avoid/propose, enlace bridge.
(() => {
 // Only documents attached to the project support the scientific side in this edition.
 delete REFERENCES.W21;
 delete REFERENCES.P25;
 const MOVES=[
  {short:'Antes de empezar',sub:'Historia, causa y valoración'},
  {short:'Durante la cura',sub:'Respuesta, indicación y tolerancia'},
  {short:'Cuando algo no encaja',sub:'Seguridad, diagnóstico y objetivos'},
  {short:'Antes de irnos',sub:'Acuerdos, revisión y continuidad'}
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
    "propose": "Empezar por qué sabemos y qué información falta, sin demorar cuidados necesarios.",
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
    "md": "«Hoy viene conmigo alguien a quien conocéis, aunque no la hayáis oído hablar así. La herida y yo tenemos unas cuantas conversaciones pendientes». Deja entrar su réplica sin leerla encima. A la sala: «Antes de empezar, ¿qué dos cosas querríais saber?». No prometas datos reales ni un desenlace.",
    "steps": [
      [
        "t1 p1",
        "«Antes de tocar el carro, ¿qué necesitaríais saber?». Recoge dos preguntas de la sala."
      ],
      [
        "t2 p2 p3",
        "«Vamos a mirar lo que se ha hecho y lo que falta». La valoración no demora lo urgente."
      ],
      [
        "enlace",
        "Enséñame esas notas. Vamos a ver qué cuentan."
      ]
    ],
    "voice": "principal"
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
    "md": "«Aquí hay cuidados registrados. No estamos poniendo eso en duda. Buscamos qué respuesta tuvieron». La herida pone la ironía; tú reconoces el trabajo y señalas la información ausente. «Enséñame ahora qué sabemos de la causa». Registro conceptual, no historia de una paciente real.",
    "steps": [
      [
        "t1 m1 p1",
        "«Enséñame las notas». Muestra el registro conceptual; no lo atribuyas al personaje."
      ],
      [
        "cerrar t2 i3 p2 p3",
        "«Hay trabajo hecho. Lo que busco es la respuesta». Señala la ausencia de datos comparables, sin reproche."
      ],
      [
        "enlace",
        "Antes de juzgar esa pauta, aclaremos qué estaban tratando."
      ]
    ],
    "voice": "principal"
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
    "md": "«Crónica nos dice algo del tiempo. La causa es otra pregunta». Recoge su réplica sin competir por el remate. Distingue lo documentado, la hipótesis y lo pendiente. No atribuyas una etiología a esta historia incompleta.",
    "steps": [
      [
        "t1 p1",
        "«No me lo vas a poner tan fácil. ¿Qué cuenta esta historia?». Distingue tiempo y causa."
      ],
      [
        "t2 m1 p2 p3",
        "«Distingamos lo que consta de lo que falta comprobar». La imagen ilustra valoración, no confirma un diagnóstico."
      ],
      [
        "cerrar enlace",
        "Ahora enséñame la imagen. Pero vamos a mirar también alrededor."
      ]
    ],
    "voice": "principal"
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
    "md": "«Primero describimos lo que vemos. Luego lo relacionamos con la historia». La réplica sobre la foto expresa complicidad; no sustituye la explicación. Recorre la imagen conceptual sin pedir un diagnóstico por reconocimiento.",
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
        "enlace",
        "Guarda esa idea. Vamos a comparar dos historias que se parecen."
      ]
    ],
    "voice": "principal"
  },
  {
    "id": "parecidas",
    "mov": 0,
    "q": 0,
    "voice": "principal",
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
    "md": "«La etiología y la perfusión cambian las prioridades y la seguridad». Se trata de dos ejemplos docentes con datos establecidos. Tú explicas la implicación clínica. La herida presenta y compara; no diagnostica ni interpreta una fotografía como prueba.",
    "steps": [
      [
        "t1 m1 p1 i2",
        "Ejemplo A con causa venosa establecida. No pedir diagnóstico por imagen. Relaciona el tratamiento local con el abordaje causal."
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
        "enlace",
        "Volvamos al cambio de apósito. ¿Qué esperamos conseguir con él?"
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
    "md": "«Un cambio de cobertura puede tener sentido. Hay que explicar para qué y cómo encaja en el abordaje de la causa». Acepta su contrapunto: no se trata de desacreditar productos. «Ahora enséñame qué hemos preguntado sobre el día a día». No representes la respuesta de la paciente.",
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
        "cerrar razon i2 p3",
        "El producto puede ser pertinente, pero no sustituye a la valoración causal. Conecta la decisión local con los factores mantenedores."
      ],
      [
        "enlace",
        "Y el plan que proponemos, ¿se puede llevar a cabo fuera de la consulta?"
      ]
    ],
    "voice": "principal"
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
    "md": "«¿Qué entiende la persona, qué le cuesta y con qué apoyo cuenta?». Tú desarrollas las preguntas sobre dolor, ayuda, comprensión y vida cotidiana. La herida recuerda esa dimensión sin apropiarse de preferencias ni representar a una paciente.",
    "steps": [
      [
        "t1 m1 p1",
        "«Pues ayúdame a mirar esa parte». Pregunta por el cuidado fuera de la consulta sin representar una respuesta de paciente."
      ],
      [
        "t2 m2 p2 p3",
        "«Hay que preguntar por comprensión, ayuda, dificultades y dolor». EWMA 2022, §4."
      ],
      [
        "cerrar enlace",
        "Dejemos también previsto cómo comprobar si el plan está ayudando."
      ]
    ],
    "voice": "principal"
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
    "md": "«La impresión tiene que poder contrastarse». Explica qué registrar y con qué herramienta apropiada. No inventes medidas ni resultados. Presenta la escena siguiente como supuesto, no como seguimiento real de una paciente.",
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
        "t3 p2 i3 p3",
        "G14, p. 15: instrumentos válidos, fiables y adecuados al contexto. Mantener un método comparable en las revisiones."
      ],
      [
        "enlace",
        "Probemos ahora una situación: ¿y si no vemos el cambio esperado?"
      ]
    ],
    "voice": "principal"
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
    "md": "A la sala: «¿Qué dos posibilidades revisaríais antes de añadir tratamiento?». Ordena las respuestas como hipótesis. La herida puede pinchar la inercia, no atribuir por sí sola una causa al estancamiento. Es la segunda pausa de participación.",
    "steps": [
      [
        "t1",
        "Segunda pausa con la sala: pide dos posibilidades ante la falta de progreso."
      ],
      [
        "razon p1 i2 p2 i3 p3",
        "Reabrir el diagnóstico, sin dar una causa por confirmada. Comprobar complicaciones y situación vascular. Revisar aplicación y tolerancia del plan. G14, p. 15."
      ],
      [
        "t3 m1",
        "Vuelve a la referencia registrada. Ordena las aportaciones como hipótesis."
      ],
      [
        "cerrar",
        "Revisa intensificar automáticamente."
      ],
      [
        "enlace",
        "Ha salido la infección. Antes de pedir una muestra, aclaremos para qué."
      ]
    ],
    "voice": "principal"
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
    "md": "«¿Qué sospechamos y qué haríamos distinto con el resultado?». Explica la indicación y la calidad de la muestra. Mala evolución exige valoración, no cultivo automático. El informe siguiente es un supuesto docente.",
    "steps": [
      [
        "t1 m1 p1 i3 p3",
        "Plantea el motivo antes de la muestra. G8, pp. 23–24. Conecta el resultado esperado con una decisión que podría cambiar."
      ],
      [
        "t2 p2",
        "La preparación y la técnica condicionan la calidad."
      ],
      [
        "t3 razon i3",
        "Revisa el motivo: la costumbre no es indicación. La mala evolución exige valorar; no impone automáticamente cultivar."
      ],
      [
        "enlace",
        "Vamos a imaginar que llega el informe: cultivo positivo."
      ]
    ],
    "voice": "principal"
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
    "md": "«El diagnóstico necesita interpretar el resultado con la clínica». Explica signos, evolución y sus límites. La complicidad se construye al anticipar la pregunta, no bromeando con la infección. Si hay gravedad, la atención no espera.",
    "steps": [
      [
        "t1 m1 p1",
        "Separa el resultado microbiológico del diagnóstico clínico. G8, p. 17."
      ],
      [
        "t2 p2 i4 p3",
        "Relaciona signos, evolución y situación de la persona. Recuerda que en algunos contextos los signos pueden estar atenuados."
      ],
      [
        "t3 razon i3",
        "Una decisión breve para pensar, sin abrir otro debate completo. Si hay gravedad, la atención no espera."
      ],
      [
        "enlace",
        "Y cuando no avanza, a veces aparece otra palabra: biofilm."
      ]
    ],
    "voice": "principal"
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
    "md": "«El concepto puede ayudarnos a entender una posibilidad; no demuestra que explique esta herida». Define desde EWMA y vuelve al razonamiento. La herida no adquiere autoridad científica por acumular experiencias.",
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
        "enlace",
        "Pasemos del nombre del problema al motivo del tratamiento."
      ]
    ],
    "voice": "principal"
  },
  {
    "id": "antimicrobianos",
    "mov": 1,
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
    "md": "«Primero la indicación. Después, la elección». Distingue antibiótico, antiséptico y apósito antimicrobiano. Tú explicas alcance, excepciones y actuación ante gravedad. El personaje presenta los recursos; la recomendación se apoya en las fuentes.",
    "steps": [
      [
        "t2 razon i2",
        "Primero la indicación. G8, pp. 27–30: el resultado aislado no decide. La valoración clínica orienta la actuación."
      ],
      [
        "t1 m1 p1 i2 p2 i3 p3",
        "Distingue antibiótico de las intervenciones locales. No son una escalera. Antiséptico: indicación y tolerancia. Apósito antimicrobiano: objetivo y revisión."
      ],
      [
        "t3",
        "No retrasar atención sistémica si está indicada."
      ],
      [
        "enlace",
        "Si lo indicamos, dejemos preparada también la revisión."
      ]
    ],
    "voice": "principal"
  },
  {
    "id": "revision-antimicrobiano",
    "mov": 1,
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
    "md": "Explica el ámbito concreto de G8 sobre plata y revaloración a los 14 días. «Necesitamos la respuesta para justificar si continuamos, retiramos o cambiamos». Una réplica ligera sobre el calendario basta; no conviertas la indicación en un chiste.",
    "steps": [
      [
        "t1 p1",
        "Deja claro el objetivo y la respuesta esperada."
      ],
      [
        "t2 m1 p2 i4",
        "G8, p. 38: plata en heridas infectadas, máximo inicial de 14 días y revaloración crítica. No recomienda uso extensivo, prolongado o preventivo. No extrapoles el plazo."
      ],
      [
        "t3 razon p3 i2",
        "Continuar, retirar o cambiar requiere justificación. Respuesta insuficiente: revisar el diagnóstico y el plan."
      ],
      [
        "enlace",
        "Ahora enséñame algo que hacemos en cada cura: la limpieza."
      ]
    ],
    "voice": "principal"
  },
  {
    "id": "limpieza",
    "mov": 1,
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
    "md": "«Recuperamos una imagen conocida con una pregunta distinta». No repitas la explicación por zonas. Relaciona solución, técnica, objetivo y tolerancia. Conserva la diferencia entre limpieza y desbridamiento.",
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
        "enlace",
        "Vamos a detenernos en el dolor antes de seguir."
      ]
    ],
    "voice": "principal"
  },
  {
    "id": "dolor",
    "mov": 1,
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
    "md": "«¿Hemos valorado el dolor y planificado cómo abordarlo?». Desarrolla anticipación, escucha, adaptación y reevaluación desde las fuentes. Sin humor en dolor, sin voz de paciente recreada y sin prometer una cura indolora.",
    "steps": [
      [
        "t1 m2 p1",
        "«Antes de empezar, ¿hemos valorado el dolor y cómo abordarlo?»."
      ],
      [
        "t2 p2",
        "«También durante la cura». Explica escucha y adaptación desde IWII, rec. 13."
      ],
      [
        "t3 m1 p3",
        "«Y para la siguiente visita, ¿qué necesita quedar registrado?». Sin tiempos universales."
      ],
      [
        "cerrar enlace",
        "Te voy a pedir ahora el ejemplo del talón con escara."
      ]
    ],
    "voice": "principal"
  },
  {
    "id": "escaras",
    "mov": 2,
    "q": 2,
    "voice": "principal",
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
    "md": "«En este supuesto, ¿qué cambia la seguridad de intervenir?». Integra perfusión, estabilidad, complicaciones, objetivos y gravedad. No generalices la recomendación a todos los métodos ni presentes el ejemplo como evolución de una misma lesión.",
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
        "enlace",
        "Vamos con otra historia: una en la que la explicación deja de encajar."
      ]
    ]
  },
  {
    "id": "atipica",
    "mov": 2,
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
    "md": "«Si los datos no encajan, reabrimos el diagnóstico y valoramos la consulta». Explica desde la ficha clínica. Evita un concurso de reconocimiento por imagen y la atribución de un diagnóstico al personaje abstracto.",
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
        "cerrar t3 razon i2 p3",
        "Contrasta intensificar con revisar la explicación. Documentar la incertidumbre y solicitar valoración especializada."
      ],
      [
        "enlace",
        "Volvamos a la pregunta de la mesa: qué podemos esperar conseguir."
      ]
    ],
    "voice": "principal"
  },
  {
    "id": "capacidad",
    "mov": 2,
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
    "md": "«La posibilidad de cierre se valora. Los objetivos se acuerdan y se revisan». Presenta alivio como otro supuesto docente; no atribuyas imposibilidad de cierre por etiología. La herida no expresa los deseos de la persona.",
    "steps": [
      [
        "t1 p1 i2 p2",
        "Recupera la pregunta de la mesa. La valoración orienta el objetivo. Explora las barreras y la viabilidad del plan, sin culpabilizar."
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
        "enlace",
        "Concretemos ahora qué mejora importa a quien vive con la herida."
      ]
    ],
    "voice": "principal"
  },
  {
    "id": "otros-resultados",
    "mov": 2,
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
    "md": "«¿Qué mejora importa ahora a esta persona?». Explora dolor, descanso o carga de curas sin fingir respuestas ni elegir por ella. Relaciona prioridad y seguimiento, conservando el ámbito específico de las recomendaciones sobre sangrado y trauma.",
    "steps": [
      [
        "t1 m1",
        "Explica cómo preguntar por la prioridad de la persona; no representes una respuesta ni supongas que todas elegirán lo mismo."
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
        "enlace",
        "Dejemos ese acuerdo preparado para quien continúe el cuidado."
      ]
    ],
    "voice": "principal"
  },
  {
    "id": "continuidad",
    "mov": 3,
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
    "md": "«¿Podría otra compañera entender qué buscamos, por qué y cuándo revisarlo?». Añade la vía real de consulta del área. Distingue seguimiento programado y deterioro que requiere atención antes, sin inventar contactos ni plazos.",
    "steps": [
      [
        "t1 p1 i4",
        "EWMA 2022, §§4–6: información compartida y coordinación. El relevo es una síntesis docente. Deja prevista la próxima revisión."
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
        "enlace",
        "Volvamos al carro del principio. A ver si ahora empezaríamos igual."
      ]
    ],
    "voice": "principal"
  },
  {
    "id": "regreso",
    "mov": 3,
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
    "open": "El carro sigue ahí. Nosotras hemos dado unas cuantas vueltas.",
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
    "bridge": "Vamos a dejar las preguntas juntas antes de despedirnos.",
    "md": "A la sala: «De las preguntas del principio, ¿cuál os ayudaría a cambiar una decisión y por qué?». Una o dos aportaciones. La vuelta al inicio muestra aprendizaje, no una cicatrización ficticia. La última réplica reconoce la complicidad sin dar una moraleja.",
    "steps": [
      [
        "t1 m1",
        "Breve regreso a la sala: recupera las preguntas iniciales. Una o dos aportaciones."
      ],
      [
        "cerrar t2 p1 i3 p2 i4 p3",
        "Reconstruye lo que sabemos y lo que falta. Recupera el objetivo acordado. Relaciona intervención y evaluación, sin volver a explicar toda la ponencia."
      ],
      [
        "t3",
        "Pide un cambio concreto y su motivo."
      ],
      [
        "enlace",
        "Vamos a dejar las preguntas juntas antes de despedirnos."
      ]
    ],
    "voice": "principal"
  },
  {
    "id": "cinco-preguntas",
    "mov": 3,
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
    "open": "Estas ya las conocemos. Te las he dejado juntas.",
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
    "bridge": "Dejemos unos segundos para pensar en la próxima cura.",
    "md": "«Son preguntas para revisar un plan, no una escala». Muéstralas sin volver a leer la charla. Una sola réplica ligera; después deja tiempo para que cada cual elija.",
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
        "enlace",
        "Dejemos unos segundos para pensar en la próxima cura."
      ]
    ],
    "voice": "principal"
  },
  {
    "id": "cierre",
    "mov": 3,
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
    "open": "Bueno, María del Mar. ¿Me guardas un sitio para la próxima conversación?",
    "turns": [
      {
        "label": "Mientras no me vuelvas a esconder los datos.",
        "reply": "Trato hecho. Tú deja una pregunta antes de dar la cura por decidida.",
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
        "label": "Gracias por venir. Ya seguiremos hablando.",
        "reply": "Eso seguro. Historias no nos van a faltar.",
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
    "md": "A la sala: «En la próxima cura, ¿qué revisarías antes de repetir?». Pausa. Después, despídete del personaje como de alguien conocido. No añadas una lista ni otra moraleja.",
    "steps": [
      [
        "t1",
        "Invita a elegir una actuación habitual. Pausa breve, sin pedir otra ronda de respuestas."
      ],
      [
        "t3",
        "Deja que la herida se despida."
      ],
      [
        "enlace",
        "Gracias por acompañarnos."
      ]
    ],
    "voice": "principal"
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
 // The wound remains the same companion while the teaching examples change.
 INITIAL_DECK.movements=MOVES;
 // Stored drafts from an older edition get the new thread (steps, habits) when they load.
 INITIAL_DECK.edition='2026-10-29-herida-companera';
 INITIAL_DECK.slides=S.map((d,i)=>{
  const s=slide(d.id,MOVES[d.mov].short,d.title,d.voice||'principal',d.open,d.turns.some(t=>t.kind==='decision')?'decision':'conversation',d.points,d.refs,d.q,{mov:d.mov,takeaway:d.propose});
  s.study={number:i+1,label:d.label,explanation:d.exp,sourceNote:d.src,sourceLabel:SOURCE_LABELS[d.id],evidenceType:d.type,limitation:d.limit,opening:d.open,avoid:d.avoid,propose:d.propose,habit:HABITS[d.id][0],ask:HABITS[d.id][1],
   caseLabel:'Personaje abstracto · historias docentes',bridge:d.bridge,turns:d.turns,steps:d.steps};
  s.notes='FUENTE Y RESPALDO\n'+d.src+'\n'+d.type+'\n\nESCENA '+(i+1)+' · '+MOVES[d.mov].short+'\nLo habitual: «'+HABITS[d.id][0]+'» → '+HABITS[d.id][1]+'\nLa herida abre: «'+d.open+'»\n\nMARÍA DEL MAR\n'+d.md+'\n\nPASOS\n'+d.steps.map((p,n)=>(n+1)+'. '+p[1]).join('\n')+'\n\nENLACE\n«'+d.bridge+'»\n\nREVISIÓN\n'+d.limit;
  return s;
 });
 // Two short introductions. The first scene demonstrates the interaction itself.
 const intro=(id,title,message,kind,open,steps,extra={})=>({...slide(id,'Introducción',title,'principal',message,'intro',[],[],null),intro:{kind,open,steps,...extra}});
 INITIAL_DECK.slides.unshift(
  intro('intro-tema','¿Es posible cicatrizar todas las heridas?','Qué no hacer en heridas crónicas.','tema','Bienvenida. Presenta la pregunta de la mesa y tu aportación.',
   [['r','Vamos a revisar decisiones que repetimos en las curas y las preguntas que nos ayudan a justificarlas.'],
    ['r','Una costumbre reconocible, la historia de una herida y una pregunta para la próxima cura. La evidencia nos acompaña.']]),
  intro('intro-herida','Os presento a la herida','Una compañera de conversación para revisar nuestra práctica.','herida','Presenta el caso en una frase. La dinámica se entenderá al empezar.',
   [['r','La herida es un personaje abstracto que reúne historias; no representa a una paciente.'],
    ['r','María del Mar aporta la evidencia de los documentos citados.'],
    ['r','Empezamos por la primera decisión.']],
   {lines:['María del Mar y yo nos conocemos. Tenemos unas cuantas conversaciones pendientes.','He traído historias para enseñaros. Algunas se parecen; otras nos van a llevar la contraria.','María del Mar, tú pregunta. Yo te voy enseñando.']})
 );
})();

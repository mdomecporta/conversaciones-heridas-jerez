# Conversaciones con una herida

Presentación de María del Mar Candil Ramón para las IV Jornadas Comisión Heridas Jerez (19 de noviembre de 2026): «¿Es posible cicatrizar todas las heridas?» · «Qué no hacer en heridas crónicas». Una herida (personaje abstracto) conversa con la ponente a lo largo de 12 escenas: 10 actuaciones, el regreso al carro y el cierre. La charla dura unos 25 minutos.

El punto de partida son las 47 recomendaciones de *Qué no hacer en heridas crónicas* (GNEAUPP, DT XIV): la charla trae las rutinas que aparecen en cualquier visita de cura, ordenadas en los cuatro momentos de la visita, y las completa con las otras cinco guías. Las 47 están en la reserva «Por si preguntan», al final del guion.

Este repositorio contiene todo lo vigente. `AGENTS.md` es un enlace a este archivo.

## Mapa

```
guion/GUION_PARA_MARIA_DEL_MAR.md   fuente de todos los textos
docs/diseno.md                      dirección de diseño vigente
template.html                       esqueleto de la página
tokens.css                          paleta, tipografía y movimiento (única fuente)
escena.css                          composiciones de los tres mundos
escena.js                           motor: pasos, herida, ponente (?ponente), guía (?guia), notas (?notas), panel de preparación (N)
escena-recursos.js                  lo que trae la herida en cada escena
entity.js                           API Presence (su renderizador de membrana no se usa)
entity-liquid.js                    cuerpo de la herida: líquida, tinta «Sangre y piel»
carro/                              carro de curas 3D (carro.js: objetos y API; estructura.glb: el carro vacío, generado con blender/carro.py; modelos/: GLTF de Sketchfab, CC BY 4.0)
resources.json, assets/             imágenes con créditos y zonas, fuentes, portadas institucionales
scripts/guion.mjs, scripts/build.mjs  lector del guion y compilación a dist/index.html y dist/ver/ (pública)
netlify/                            contraseña (función de borde), API de notas, adjuntos y cambios de texto (Netlify Blobs)
scripts/servidor-local.mjs          imita el sitio publicado en local (npm run local)
archivo/edicion-30-octubre/         edición anterior; no usar como referencia
```

Fuera del repositorio, en la carpeta del proyecto: `bibliography/` (las seis guías en PDF y enlaces al guion), `referencias/` (portadas obligatorias y presentación de partida) y `archivo/` (material antiguo; no usar como referencia).

## Trabajo habitual

- `npm run build` genera `dist/index.html`, autónomo. Si el guion deja una escena sin hilo, sin evidencia o sin enlace, se detiene y lo dice. `npm test` comprueba guion, recursos y entidad. `npm run dev` sirve en http://127.0.0.1:4173/.
- Los textos se cambian en el guion y se recompila. La composición de los recursos está en `escena-recursos.js`; los colores, solo en `tokens.css`.
- En la presentación, **R** abre la reserva con las 47 recomendaciones por apartados (← → apartado, 1–6, Esc vuelve al mismo paso); también desde la ventana de ponente. Sus textos están en la sección «Reserva» del guion; las marcadas «En la charla: escena N» deben citarse en el respaldo de esa escena (`npm test` lo comprueba).
- Cada actuación tiene tres pasos (A revisar con su recurso; Nos preguntamos con su historia, `historia` en `escena-recursos.js`; Nos llevamos con la evidencia y el aprendizaje) y, a la derecha bajo la herida, solo el intercambio del paso actual (el historial completo está en la ponente y la guía). Antes de cada actuación, también la primera de cada bloque, una transición (`#paso-N`) con la herida en grande. La conversación de cada paso habla de lo que se ve en ese paso. La primera frase de la herida se dice en la transición y no se repite en la actuación: el intercambio del paso 1 sigue desde ahí. En pantalla solo habla la herida, en tono impersonal dirigido a enfermería; María del Mar dice sus frases en voz alta (las tiene en la ventana de ponente) y la herida espera su turno.
- El carro 3D se mejora en `carro/carro.js` (el prototipo de `prototipos/` ya no es la fuente). La presentación le pide qué mirar con `postMessage` (`{carro:{ids,vista}}`); los objetos que trae cada escena se indican con `type:'carro', ids:[…]` en `escena-recursos.js`. Three.js va copiado desde `node_modules` al compilar; `/carro/` es público en Netlify.
- La dirección admite `#escena-6/3` (escena 6, paso 3). `?ponente` abre la ventana de ponente: una tarjeta por paso hecha con el guion (la idea, lo que se ve, la condición de la evidencia, la conversación en orden y, plegado, lo que se desarrolla con sus palabras), la diapositiva en vivo y la siguiente, y el reloj con el tiempo previsto para 25 minutos (T lo pone a cero); `?guia`, la guía de María del Mar; `?notas`, todas las notas y cambios de texto.
- En la presentación, **N** abre el panel flotante de preparación: notas por sección con imágenes y «Cambiar textos», que guarda «original → nuevo» y lo aplica al cargar (también en `/ver/`). Para consolidar: descargar desde `?notas`, aplicar los cambios al guion y borrarlos.
- `/confesiones/` es «Confesiones de una úlcera» (la presentación original adaptada, `prototipos/original-adaptada/`), aparte de la principal: **E** abre su editor lateral (`editor.js`), con notas y cambios de texto guardados en `/api/confesiones/` (almacenes propios en Netlify Blobs). La compilación la copia a `dist/confesiones/` con los modelos de `personajes/`. Pide la misma contraseña.
- Publicado: `/` pide la contraseña de `SITE_PASSWORD` (variable de entorno de Netlify, nunca en el código); `/ver/` es el enlace público sin notas ni guion privado. Detalles en el README.

## La herida

- Es la entidad **líquida «Sangre y piel»**: `ENTITY_RENDERER="liquid"`, `ENTITY_VARIANT=3`, `ENTITY_INK=1`. Lo fijan `scripts/build.mjs` y la zona de `template.html`. El valor por defecto de `entity.js` es la membrana antigua: no usarlo.
- No modificar `entity.js` ni `entity-liquid.js` salvo que se pida expresamente.
- Cambia de sitio disolviéndose y condensándose (o saliendo y entrando por los lados), sin horizonte, suelo ni rebotes.

## Diseño en tres mundos

- **El carro:** es la rutina, un personaje mudo frente a la herida: «sabe lo que solemos hacer; la herida, lo que necesita». En cada actuación está abajo a la izquierda (`.carro-sitio`), en diagonal con la herida: en «A revisar» propone el objeto de la rutina (`carro:[ids]` en `escena-recursos.js`; `insiste:true` cuando la herida no avanza), en «Nos preguntamos» espera y en «Nos llevamos» lo devuelve a la bandeja; sin objeto, queda quieto («Esto no está en el carro»). `carro/carro.js` lo hace con `{personaje:true,ids,estado}` (propone, insiste, espera, retira, reposo); `?personaje&ids=…&estado=…` muestra un estado suelto. Si el 3D falla, se ven las imágenes de `carro/respaldo/` (se regeneran con el carro servido en local: una por escena con objeto y `reposo.png`). Donde el carro trae el objeto, el recurso lleva `from:'El carro propone'`. Cada escena tacha una rutina en «A revisar», la pregunta la rompe y «Nos llevamos» da la vuelta a la misma frase.
- **Composición:** hilo flotante a la izquierda (25 % del ancho), lo que acompaña al paso en el centro (48 %) y la herida con la conversación a la derecha (21 %). El regreso al carro usa las mismas zonas. Decisiones del 2 de noviembre en `docs/decisiones-02-nov.md`; criterio de cada escena (una idea, una fuente clara, una pantalla) en `docs/revision-escenas-02-nov.md`.
- **Progreso:** panel nocturno flotante con el recorrido y el hilo A revisar → Nos preguntamos → Nos llevamos. La actuación se tacha al aparecer la pregunta. El aprendizaje entra en el hilo y no se repite en el espacio principal. Cada momento tiene su pigmento (coral, ámbar, malva, salvia).
- **Conversación:** burbujas en Figtree, en piel y coral, solo de la herida. Habla a enfermería en impersonal («¿se escucha mi historia…?»), sin tutear a la ponente. Las frases de María del Mar no se proyectan: están en la ventana de ponente y en la guía.
- **Evidencia:** hoja ocre y oliva con titular en Fraunces, fuente y condición.

## Consolidación y piloto · indicaciones de la usuaria, 6 de noviembre

- Doña Rutina es el avatar generado y sus variantes en `personajes/rutina/frames-*/`. Usar ese personaje en el piloto y el recorrido consolidado; no usar su modelo GLB ni otro avatar. Sus variantes pendientes se prepararán a partir de esta misma identidad.
- La fuente editorial del recorrido nuevo es `guion/GUION_CONSOLIDADO_22_CAPITULOS.md`; aún no sustituye al guion que alimenta la presentación principal.
- El piloto vigente está en `prototipos/piloto-capitulo/revision.html`, compilado a `/piloto/`. Debe encadenar capítulo → recurso grande → recurso contenido y conversación, manteniendo la herida aprobada. Doña Rutina entra por llamada antes de mostrar la ventana de vídeo.
- Seguimiento de actos discreto, sin barra grande, flechas ni aviso inicial visible. Bocadillos propios de Herida y Rutina con espera, escritura y turno de habla. Notificación compacta con sonido; sin botón «Ver respaldo».
- La justificación bibliográfica está en `docs/origen-de-evidencia-06-nov.md`: los 47 puntos pertenecen al DT XIV; las otras fuentes tienen atribución propia.

- Ajuste posterior del piloto: la superficie del capítulo termina en el título, sin panel duplicado. La herida se desvanece y reaparece flotando al entrar el chat. Sin notas auxiliares bajo los mensajes. Colores de mensajes, llamada y evidencia reforzados para proyección; transparencias y texturas distintas según superficie.

- Revisión del 7 de noviembre: compartir reflejo, borde y sombra en todos los materiales. Chat exterior mucho más transparente; pigmento coral/ámbar/ocre en los bocadillos con texto oscuro. Acentos más fuertes solo en estados activos. Sonido por cada entrada en escritura tras activar audio. Los efectos sobre el recurso se diseñan por escena; no imponer las gotas del piloto a todo el recorrido.

- Apertura del piloto: tras la transición del título, mantener el recurso desplegado junto al chat y la primera frase de Herida. La explicación («A revisar», pregunta y opciones) aparece al primer avance, cuando el recurso se contiene. El texto inicial del recurso complementa el diálogo, sin repetirlo. La navegación de actos vive en el nombre del acto con chevron dentro del título; no hay índice inferior. Elegir acto abre sus capítulos. La revisión 9 extiende este montaje a los 22 capítulos: el selector abre cada capítulo visual directamente.

- Mundo de la herida: transiciones lentas y solapadas; flotación ocasional de un único panel, de amplitud mínima y con retorno a su posición. Deformar suavemente la superficie, sin distorsionar textos ni imágenes clínicas. Fondo con profundidad malva/salvia y partículas de formas y tonos de la paleta. Desactivar el movimiento decorativo con movimiento reducido y al ocultar la pestaña.

- Simplificación posterior: el capítulo 10 del piloto tiene dos avances manuales tras la entrada. Se omite la parada independiente «¿Qué necesita hoy esta herida?»; sus criterios y notas se integran con Evidencia. En la videollamada, cara despejada: punto verde con pulso y «Escuchando», sustituido por ondas verdes al hablar; sin rótulo visible «En llamada / Hablando».

- Recorrido completo, revisión 9: `npm run build:piloto` genera `/recorrido/` (capítulo 1) y `/piloto/` (capítulo 10), con el mismo motor y los 22 capítulos montados. Tres escenas y dos avances por capítulo; los tres bloques editoriales originales se agrupan sin perder las intervenciones ni las notas. Apertura: Úrsula → preparación con las fuentes → llamada de Rutina. Cierre: decálogo, tres preguntas, salida al Claustro y contraportada. El recurso es propio de cada capítulo, definido en `guion/montaje-capitulos.mjs` y compuesto por `prototipos/piloto-capitulo/recorrido-recursos.js`. P muestra todas las frases correspondientes y el guion completo; R abre 13 referencias y las 47 síntesis. No se ha sustituido `/`, ni publicado este recorrido.

- Revisión 10: los recursos admiten varias imágenes y composiciones nativas dentro del panel. El plan de recurso, pose, reacción y frase de activación está en `guion/plan-escenas.mjs`; inventario y prompts en `personajes/rutina/PENDIENTES-RECORRIDO-22.md` y en P. Solo 7, 8, 9, 10 y 12 tienen variantes específicas disponibles; 1 y 5 reutilizan imágenes por revisar; los otros catorce usan retrato neutro con etiqueta de pose pendiente. En 19 no se fuerza una llamada de Rutina. No dar una variante por generada porque exista un respaldo.
- En el capítulo 6 Úrsula desaparece y hablan tres heridas vecinas líquidas (gafas, pestañas y dientes; ámbar, salvia y malva). Sus colores no tienen significado clínico. La frase original de bacterias se conserva como procedencia y se adapta la voz a heridas. No modificar la cara aprobada de Úrsula en el resto de capítulos.
- Las marcas de Evidencia se eligen por documentos citados: GNEAUPP, IWII, EWMA; para los estudios, su revista (JWC, REBEn y Gerokomos en la reserva). Archivos y procedencia oficial en `prototipos/piloto-capitulo/iconos/fuentes.json`. No inventar logos de escalas o autores ni atribuir un aval a la charla.

- Al cambiar de escena, retirar el bocadillo anterior de Rutina cuando no tenga una réplica en la escena actual. Puede permanecer escuchando en vídeo, pero no dejar una propuesta incorrecta como si fuera la conclusión junto a Evidencia.

- Aclaración de la usuaria, revisión 11: aplicar el patrón de tres escenas/dos avances solo a los capítulos clínicos (2–21). Apertura y cierre tienen estructura propia, conservando continuidad visual con el mundo de la herida. La apertura introduce a Úrsula y la preparación con evidencia antes de Rutina; el cierre recoge jubilación, decálogo, preguntas y escucha, sale al Claustro y termina en la contraportada. No reutilizar ahí la cuadrícula de pregunta y dos opciones. Su secuencia se define por separado en `structure` dentro del montaje, sin una cuota obligatoria de escenas.

- Apertura, revisión 12: prólogo manual con tres avances. Estado inicial: portada obligatoria, completa y con padding/radio en glass sobre el Claustro. Primer avance: paneles del aniversario, marca de comisión y mapa AGS, con giro suave de cámara. Segundo: inmersión de 4600 ms, máximo cinco segundos; seguir una gota sin ojos ni boca, splash y agua que se vuelve pigmento/partículas. Llegada: Úrsula toma forma en el centro, abre los ojos y entra la portada de la charla. Tercer avance: presentación de Úrsula; siguen fuentes y Doña Rutina/Doña Evidencia. No sustituir Evidencia por «Criterio». Implementación y pruebas: `docs/apertura-claustro-07-nov.md`. No retirar ni regenerar las marcas existentes de `prototipos/claustro-3d/`.

- Revisión 13: en el Claustro la guía es la misma Úrsula líquida sin rostro, proyectada desde una posición 3D. La cámara gana altura y desciende dentro del vaso antes de atravesar el agua; no entrar por el lateral. Mantener giro lento durante la espera. Mapa y texto blanco sin panel; fondo verde solo para la comisión. Índice como libro con actos persistentes y salto directo sin repetir entradas. Retirar el triángulo del bocadillo de Úrsula; flotación ocasional más perceptible (hasta 7 px/0,38°), sin deformar texto. Dirección propuesta para recursos y alternativas de identidad de Evidencia: `docs/direccion-recursos-y-evidencia-07-nov.md`; todavía no implementar una nueva identidad de Evidencia sin elegirla.

- Evidencia, ajuste posterior: la usuaria descarta lente/pliego/constelación y pide una carpeta como objeto-herramienta con volumen y hojas, activación, check con sonido y mensaje desplegado (frase y fuentes). Paleta propia azul/verde armonizada; no repetir salvia/ocre/marfil como identidad dominante. Prototipo aislado para validar en `prototipos/evidencia-carpeta/`, documentado en `docs/evidencia-carpeta-07-nov.md`; aún no integrado en el recorrido.

- Ajuste de la carpeta de Evidencia: azul/cian más vivo y acabado moderno cercano a la referencia. Recta en reposo; solo giros breves que vuelvan al origen. Mantenerla anclada a la esquina inferior y desplegar la ficha hacia arriba desde su interior. Prototipo `evidencia-carpeta/?revision=3`, aún pendiente de integración.

- Preferencia del 8 de noviembre: no usar cards giradas o torcidas para las tres descripciones del capítulo 3. Diferenciar el contenido del recurso de los demás paneles mediante composición y jerarquía propias. Mantener intactos el movimiento, la oscilación y la flotación general aprobados. Revisión 15: columnas tipográficas sin cajas sobre superficie de observación; ficha final como hoja de registro. No convertir este tratamiento en una plantilla idéntica para todos los recursos.

- UI integrada, ensayo revisión 16 acotado al capítulo 3: tres escenas/dos avances y personajes intactos. Simplificar el marco exterior del chat, ocultar bocadillos vacíos y retirar repeticiones entre recurso y conclusión. Una única conclusión entra con Evidencia, sin avance extra. Mantener paleta y flotación aprobadas. Documento `docs/ui-integrada-08-nov.md`; validar en esta muestra antes de extender a recursos fotográficos y por zonas.

- Revisión 17: la usuaria pide liquid glass para el recurso, con fondo abstracto que lo realce; descarta el panel oscuro de medición. Usar material translúcido y focos explícitos por intervención: acento/luz en la pieza relevante y atenuación reversible de lo secundario. Mantener tres escenas/dos avances, personajes y flotación general. Ensayo en capítulo 3 con `data-attention` y focos de medición; cancelar temporizadores al navegar. Detalles y verificación en `docs/ui-integrada-08-nov.md`.

- Revisión 18: portada clínica con más presencia de pigmento coral/malva, manteniendo el mismo vidrio base durante la transformación a título. No interpolar `backgroundColor` de la superficie ni solapar pronto el recurso con la portada grande. Pigmento en capa propia que se retira gradualmente; tiempos de entrada agrupados en `ENTRY`. Veta de fondo tenue con la paleta y ciclo profundo existentes, sin sumar partículas ni cambiar flotación. Guía de consolidación en `docs/sistema-visual-y-movimiento-08-nov.md`.

- Revisión 19: UI integrada y focos extendidos a capítulos 7 y 11, con composiciones propias. 7: foto de material + solicitud vacía → preguntas por pares → interpretación; sin automatismo “sí = muestra”. 11: modelo conceptual íntegro con cuatro marcadores y anotaciones, recorrido del lecho a la piel; sin filtros de color ni evolución simulada. Tres escenas/dos avances. Plan y verificación en `docs/capitulos-07-11-realizacion-08-nov.md`. La variante de Rutina 11 sigue pendiente de aprobación.

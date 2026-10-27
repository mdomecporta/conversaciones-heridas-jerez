# Conversaciones con una Herida

Edición de revisión para María del Mar Candil Ramón. Mesa «¿Es posible cicatrizar todas las heridas?», IV Jornadas Comisión Heridas Jerez, 19 de noviembre de 2026.

## La experiencia completa

Las 24 escenas de contenido tienen dos lados independientes y preparados; se conservan además dos pantallas institucionales.

- **Izquierda · concepto y ciencia:** explicación, conceptos clave, aplicación práctica, tipo de respaldo, fuente y límites. Se mantiene al explorar el lado derecho.
- **Derecha · la herida:** apertura, tres preguntas preparadas por escena, respuestas, cambios de interlocutor y recursos interactivos. Hay 72 intercambios disponibles, no una obligación de activarlos todos en la exposición.

Los recursos permiten recorrer una historia temporal, abrir capas de información, comparar historias, recorrer un plan, explorar resultados, escuchar una vivencia recreada, seleccionar posibilidades y revelar su razonamiento, o explorar zonas de un esquema. Las decisiones no puntúan ni producen diagnósticos.

La herida, otra herida y la voz recreada de la persona tienen identificación textual y visual. La entidad es una escultura 3D de tejido coral con una depresión central y cuatro membranas volumétricas superpuestas, transparencia, iluminación y reflejos nacarados calculados en tiempo real: respira en reposo, se abre al escuchar, desplaza sus pliegues al pensar y ondula al hablar. Conserva una alternativa de dibujo 2D cuando WebGL no está disponible, sin recursos externos. La entidad cambia de estado según la interacción; su color y forma no representan signos clínicos. Las respuestas no se generan en directo. La biblioteca incluye seis imágenes creadas previamente con IA e identificadas como tales; no hay voz grabada ni vídeos de procedimientos.

El historial y la selección de recursos se conservan al avanzar y retroceder durante la sesión. «Lo hablado» recoge la escena; «Recorrido» reúne la conversación entre escenas y permite empezar una sesión nueva. Cambiar entre Preparar, Revisar y Presentar inicia una exploración nueva. Nada de esto modifica el contenido guardado.

## Escenario de la conversación

El lado derecho es un escenario: la herida en el centro, las tres preguntas preparadas flotando a su alrededor (el chip elegido viaja hasta ella), lo que dice en subtítulos grandes y lo hablado plegado en un hilo de puntos («Lo hablado» lo despliega). Las imágenes de la escena se abren desde la miniatura de la cabecera. Estilos en `stage.css`.

**Reparto.** Cada escena tiene una herida protagonista y, si la hay, una invitada (contrapunto vascular u objetivos de alivio). La invitada no está al principio: **brota de la protagonista** la primera vez que habla y se separa. Quien habla pasa al frente; quien escucha se retira, se difumina y se inclina hacia quien habla. En «Comparar las historias» las dos se alinean, respiran a la vez y se unen con una línea; el dato que se abre resalta la historia A, la B o ambas. **La persona** no es una herida: aparece como un aura cálida y luminosa, y la herida se retira al fondo mientras ella habla.

Después de hablar, la herida pasa sola a **Escuchando** mientras no se avance, con anillos alrededor. «Escuchar la sala» (o la tecla M) activa el micrófono: los anillos y la apertura responden al volumen de la sala. Solo se mide el volumen en el propio equipo; no se graba, transcribe ni envía nada. Requiere abrir la presentación desde localhost o https.

**Recursos.** Las tarjetas de cada respuesta nacen del lecho de la herida, con un borde iridiscente que se desvanece. Las imágenes de la escena suben al escenario desde la miniatura de la cabecera o desde el hilo: nacen de la herida, que se retira a la esquina a mirarlas, y sus puntos guía se recorren con los pasos (`m1` abre la imagen 1, `h2` su punto 2, `cerrar` la retira; se usa en las escenas 4, 12, 17 y 18). Los subtítulos siguen visibles debajo.

**Vídeo.** Un recurso de `resources.json` puede declarar `"video": "videos/nombre.mp4"` (o .webm): el archivo se coloca en `assets/resources/videos/`, la construcción lo copia junto al HTML en `dist/videos/` y su imagen hace de portada. Se reproduce silenciado y en bucle dentro del escenario. Los vídeos no se incrustan: al compartir la copia de revisión hay que enviar también la carpeta `videos/`.

**Transición entre movimientos.** Al entrar en un movimiento nuevo, el color de la herida llena la pantalla desde donde estaba, muestra su nombre y se abre a la escena. No aparece con movimiento reducido ni en Preparar.

## La entidad (voz de la herida)

La entidad es la ilustración conceptual (`assets/entity-concept.png`, lámina original) animada en WebGL. Se usa `assets/entity-cutout.png`, la figura principal recortada con transparencia y una sombra limpia, generada con `python3 scripts/entity-cutout.py assets/entity-concept.png assets/entity-cutout.png` (requiere Pillow y numpy; solo para desarrollo). `assets/entity-concept.json` fija el centro del lecho (`core`), desde donde parten las ondas.

Estados: en reposo respira y el lecho fluye por dentro; escuchando se abre, crece y se inclina hacia la ponente; pensando pliega las membranas en torsión y la luz orbita; hablando crece, ensancha el borde y emite ondas desde el lecho; recordando se apaga y pierde color; mostrando se inclina hacia el recurso; incomodidad (escena del dolor) se contrae con un leve temblor; alivio (objetivos) se expande y respira más despacio. El lecho es una capa propia que se desplaza respecto a las membranas, y un foco de luz indica a qué atiende. Cada voz recolorea la figura conservando sus luces (otra herida vascular, malva; objetivos de alivio, rosa lila; persona, melocotón). `dist/entidad.html` muestra todos los estados y voces para revisarlos. Sin imagen se usa la escultura 3D procedimental anterior.

### Entidad generada por código

La voz de la herida es una entidad generada por código, sin imagen (renderizador `membrane` en `entity.js`): cuatro membranas apiladas con volumen, borde nacarado y sombra entre capas; un lecho líquido coral que fluye siempre; luz de borde blanca y dorada; los ocho estados y el tono de cada voz. Cuando la escena tiene invitada, las dos heridas son un solo cuerpo: la primera vez que habla la invitada brota de la protagonista, se estrangula y se separa (`data-bud`), y quien habla crece un poco (`data-focus`); cada figura conserva su tono y su nombre. En la comparación crece la historia que se está mirando. Al cambiar de escena el brote no se repite. `dist/entidad.html` muestra estados, voces y la secuencia del brote; `dist/entidad-actual.html`, la ilustración anterior, que se recupera con `globalThis.ENTITY_RENDERER='art'` (entonces la invitada vuelve a ser una segunda figura).

## Abrir para revisar

`dist/revision.html` es una copia autónoma lista para abrir o compartir como archivo. Incluye todo el contenido y las interacciones, permite Revisar y Presentar y no contiene notas privadas ni editor. Funciona sin conexión; consultar publicaciones externas sí requiere conexión.

`dist/index.html` contiene además Preparar, el editor de contenido, recursos, imágenes, guion privado y estado de revisión. Para una dirección local estable: `npm run dev` y abrir http://127.0.0.1:4173. La copia de revisión está en http://127.0.0.1:4173/revision.html.

Se abre la portada conceptual. Inicio permite llegar a la portada institucional.

## Fotografías y recursos visuales

La edición incorpora **11 imágenes**: tres fotografías clínicas externas (ejemplos venoso, arterial y atípico), dos fotografías de material o dispositivo (torunda y compresión) y seis imágenes generadas con IA (zonas de la herida, biofilm, talón con escara, conversación, vida cotidiana y material genérico). Los ejemplos clínicos conservan su procedencia y no se presentan como imágenes del caso sintético.

Las imágenes aparecen en 21 escenas, se amplían desde la propia imagen o «Imágenes y recursos» y conservan proporciones, descripción, crédito, licencia y modificaciones. Hay tres recorridos visuales de 12–14 segundos: zonas, componentes del biofilm y preguntas antes de actuar sobre la escara. Son secuencias docentes sobre imágenes fijas, no vídeos de técnicas ni simulaciones biológicas. Permiten pausar, reiniciar o avanzar por pasos y respetan la preferencia de movimiento reducido.

`resources.json` conserva el catálogo y las asociaciones por escena; `assets/resources/` contiene originales y copias optimizadas, además de `generation-prompts.json`. La procedencia y los pendientes están resumidos en `RECURSOS_VISUALES.md`. Los modelos conceptuales no representan hallazgos clínicos ni escalas de medida.

En Preparar → Diseño se puede incorporar una imagen PNG/JPG/WebP de hasta 4 MB y completar descripción, pie, procedencia y permiso. Una imagen con permiso pendiente no se expone. La autorizada se puede abrir y ampliar en el portal sin sustituir sus recursos. En escenas sin pregunta de imagen también se puede abrir desde el estado inicial de la conversación.

La copia exportada desde Compartir incluye las imágenes autorizadas y los recorridos de la versión guardada. La copia editable JSON conserva todos los medios y notas. El catálogo se incrusta una sola vez por HTML. El guardado local referencia las imágenes incluidas en el archivo para no duplicarlas en el almacenamiento del navegador. Los borradores anteriores recuperan la biblioteca sin sustituir textos, notas ni imágenes aportadas. No incorporar datos identificativos. El prototipo no sube las imágenes a un servidor.

## Preparar y conservar el trabajo

El contenido científico, las respuestas y el guion privado son editables por separado. La conversación permite modificar tipo de recurso, interlocutor, estado de la entidad, título y elementos de exploración. Cada línea del recurso tiene la forma `título | contenido`; en una decisión representa una posibilidad y su razonamiento.

El borrador se guarda en el navegador. «Guardar para presentar» captura contenido, composición y medios autorizados; guardar no equivale a validar clínicamente. Compartir permite descargar HTML de lectura sin notas, o JSON editable con notas y medios. No hay sincronización entre navegadores ni equipos.

Esta edición usa la clave local `jerez-conversations-v5`. Las versiones anteriores se conservan en su almacenamiento original y pueden descargarse desde Compartir. Importar permite recuperar un proyecto completo con posibilidad de Deshacer.

## Introducción

Dos pantallas breves llevan a la primera decisión:
1. **Tema:** la pregunta de la mesa y la invitación a revisar decisiones habituales.
2. **La herida:** presenta su historia como caso docente. La dinámica se descubre al empezar la escena 1.

Son cinco pasos introductorios en total. El mapa sigue disponible en la barra de movimientos, sin una pantalla adicional para explicarlo.

## El hilo de María del Mar (pasos)

Las 24 escenas siguen `../bibliography/RECORRIDO_NARRATIVO_24_ESCENAS.md`, agrupadas en cinco movimientos (barra superior): conocer la historia → comprobar qué pasa → justificar lo que hacemos → cambiar de camino → preparar la próxima visita. Cada escena tiene un hilo de 4–8 pasos (`study.steps` en `edition.js`, editable en Preparar → Conversación). Cada pulsación avanza un paso y activa por sí sola lo que toque: una pregunta a la herida y su respuesta, una imagen y sus puntos guía (en las 21 escenas con imágenes), un dato o un razonamiento, un punto de la izquierda y, al final, el enlace con la siguiente escena. Tras el último paso se pasa a la escena siguiente.

**Lo habitual → la pregunta.** Es el tema de la ponencia («qué no hacer»). Cada escena abre con una costumbre (`study.habit`) y el paso `practica` la tacha y deja en su lugar la pregunta que la frena (`study.ask`). El cierre invita a elegir una actuación y termina con una sola pregunta. El muro de 22 frases deja de formar parte del recorrido, aunque la acción `muro` sigue disponible en el editor para recuperar versiones anteriores. Las formulaciones «Qué evitamos / Qué proponemos» siguen en el editor y en el guion.

**La conversación avanza en cada paso.** Cada paso cambia algo en el lado de la herida. Los detalles que cuenta se acumulan en el chat (el último, resaltado), y los que aún no ha contado esperan como «+ …» para abrirlos a mano. Cuando el paso no lleva pregunta, la herida habla igualmente: en `practica` dice la pregunta bajo la costumbre tachada, en `enlace` dice el enlace con la escena siguiente y en `muro` presenta el muro. Una prueba recorre las 24 escenas y falla si algún paso deja la conversación igual. La costumbre lleva un marcador de costumbres cuestionadas (n / 22) y se tacha con una raya que se dibuja.

**Una idea a la vez.** Fuera de Preparar, la izquierda muestra título, costumbre y solo los puntos alcanzados (el actual con su explicación). La fuente breve permanece visible; el detalle y el tipo de respaldo están en Fuentes y en la ventana de ponente. El párrafo explicativo y el alcance pasan al guion de la ponente. Al llegar a la pregunta o al enlace se retira el recurso anterior. Las cinco preguntas de síntesis son la excepción: se van reuniendo y permanecen legibles. Las preguntas manuales siguen funcionando al terminar la escena y el siguiente paso devuelve al hilo.

**Desvíos.** Si se salta a otra escena desde Escenas, el índice o los movimientos, aparece «Volver al recorrido» y la siguiente pulsación (→, clic o mando) devuelve la presentación al punto exacto del hilo. «Seguir desde aquí» convierte la escena actual en el nuevo punto del recorrido. Las preguntas o imágenes abiertas a mano dentro de una escena se recolocan en el siguiente paso. ↓ / ↑ saltan de escena moviendo el recorrido.

**Guion.** En Revisar se ve siempre abajo. En Presentar se activa y desactiva con **G** o el botón «Guion». **V** («Ventana de ponente») abre el guion en otra ventana para la pantalla de la ponente: todos los pasos de la escena con el actual resaltado, lo que dirá la herida y lo que hará la pantalla, la nota privada, la idea clave, el alcance, la escena siguiente y un cronómetro (clic para reiniciar). Desde esa ventana también se avanza y se retrocede. Si el navegador bloquea ventanas emergentes, se usa G. «Guion completo» reúne todo el recorrido.

La revisión narrativa usa `jerez-conversations-v5`: inicia la edición nueva completa sin sobrescribir el borrador v4. Compartir → Descargar borrador anterior permite recuperar el v4 con sus notas y medios. Las modificaciones locales anteriores no se mezclan automáticamente con estos textos. Las copias JSON siguen siendo importables.

## Navegación

- → · Espacio · clic en la diapositiva · Av Pág (mando): paso siguiente. ← · Mayús+Espacio · Re Pág: paso anterior.
- ↓ / ↑: saltar de escena sin recorrer los pasos. Inicio/Fin: extremos del recorrido.
- 1–3: preguntas preparadas fuera del hilo; 0: reiniciar la conversación de la escena actual.
- F: pantalla completa. G: guion en pantalla. V: ventana de ponente. Escape: cerrar ventanas o salir de pantalla completa.
- Pausar movimiento y la preferencia de movimiento reducido eliminan las animaciones.

Los recursos son utilizables con teclado. En Presentar, los controles generales reaparecen al mover el puntero o enfocar los controles.

## Respaldo y revisión clínica

Cada concepto tiene fuente, tipo de apoyo y alcance. Esta revisión utiliza los seis documentos aportados de GNEAUPP, EWMA e IWII. El marco WBP 2021 y el documento de paliación EWMA 2025 de propuestas previas no se emplean como respaldo en esta edición. La escena 19 se apoya en la valoración de GNEAUPP, la perspectiva de la persona de EWMA 2022 y los objetivos contemplados por IWII 2025, p. 26; su organización es una síntesis docente. Hay recomendaciones, consensos y síntesis docentes; no se equiparan a un mismo grado de certeza. El pendiente de metadatos de EWMA 2026 permanece identificado.

La edición está montada para revisión, **no certificada clínicamente**. María del Mar debe revisar formulaciones, casos, fuentes, circuito asistencial y tiempos. Los contrapuntos no establecen pronósticos universales. La exposición aproximada de 25 minutos debe ensayarse eligiendo recursos; recorrer los 72 intercambios completos requiere más tiempo.

## Desarrollo y comprobación

Sin dependencias de ejecución. `npm run build` genera la edición y la copia de revisión con fuentes e imágenes incrustadas. `npm test` ejecuta 35 comprobaciones de estructura, cobertura de las 24 escenas, continuidad, recursos, fotografías y permisos, importación, guardado, separación de notas, biblioteca, recorridos y ejecución de las copias exportadas.

Contenido base en `content.js`, piloto histórico en `pilot.js` y desarrollo completo en `edition.js`; este último fija la secuencia y los dos lados de cada escena. `app.js` proporciona el editor y las interacciones; `entity.js`, la entidad; `portal.css`, la composición y los recursos de esta edición, sobre los estilos previos. No editar directamente los HTML de `dist/`.

La copia de revisión generada al construir usa los archivos fuente. Para compartir cambios hechos en el editor, guardar y exportar desde Compartir; los cambios del navegador no modifican los archivos fuente.

Comprobación visual realizada en navegador a 1280 × 720, con recorrido de las 24 escenas y los 72 intercambios. Las pruebas de estado usan DOM simulado y no sustituyen el ensayo en proyector ni la revisión clínica.

## Revisión de tono y estructura · 27 de octubre de 2026

Las 24 escenas y sus 72 respuestas se han revisado para separar una explicación científica localizable en los PDF de una conversación sencilla. La herida pregunta y cuenta lo que le pasa; la persona expresa su experiencia; María del Mar interpreta las fuentes. El humor se limita a las rutinas cotidianas y se evita en dolor, gravedad y alivio.

Se conservan los identificadores de las 24 escenas, las tres preguntas explorables de cada una, las imágenes y los tres recorridos visuales. El recorrido principal incluye dos pausas con la sala y una breve vuelta a las preguntas iniciales. Los detalles siguen disponibles para ampliar, sin requerir recorrerlos todos.

[Guía de las 24 escenas y sus fuentes](../bibliography/REVISION_NARRATIVA_24_ESCENAS.md). Las 35 pruebas incluyen el recorrido completo en ambos sentidos, la recuperación del hilo después de explorar, las fuentes y la conservación del borrador anterior. La duración final requiere ensayo con María del Mar.

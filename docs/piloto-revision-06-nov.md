# Piloto consolidado · revisión del 6 de noviembre

Fuente: `prototipos/piloto-capitulo/revision.html`. `npm run build:piloto` genera `dist/piloto/`; también se incorpora con `npm run build`. No desplegado en esta sesión. Esta revisión incorpora las observaciones de la usuaria sobre la coreografía, el avatar y la conversación.

## Identidad y recursos

Doña Rutina usa exclusivamente el avatar generado y sus variantes de `personajes/rutina/frames-*/`. No se carga ningún modelo 3D del personaje. La herida mantiene el cuerpo, la cara y el perfil de definición aprobados en la revisión anterior. El tejido y las imágenes son recursos existentes; no se han encargado nuevas generaciones.

## Coreografía de entrada

La entrada se encadena sola, sin instrucción visible para empezar:

1. Capítulo y herida grandes sobre la superficie con margen y radio desde el principio.
2. Tras 1,8 s, la misma superficie se transforma en el panel del título en 1,45 s; el título grande viaja por transformación hasta el título contenido, sin cambiar de tipografía a mitad del recorrido. El color de la misma superficie se interpola junto con su tamaño.
3. La herida se desvanece antes del traslado del título. El recurso entra como protagonista en un encuadre grande y tiene un momento propio antes de recogerse.
4. El recurso se coloca en 1,35 s y se revelan conversación, explicación y seguimiento. La herida reaparece sobre el chat con una elevación suave y desvanecida, sin desplazarse por la pantalla. Úrsula escribe su pregunta de entrada.

Una pulsación durante la entrada la completa. Después, tres avances: rutina, pregunta y decisión. Los avances rápidos y el retroceso cancelan temporizadores, sonidos y animaciones anteriores. El enlace con `#1`, `#2` o `#3` reconstruye el avance; si la llamada aún no ha ocurrido, muestra su llegada antes del vídeo.

## Revisión visual y de interacción

| Before | After | Por qué |
|---|---|---|
| Composición final mostrada casi de golpe | Capítulo → recurso protagonista → recurso contenido y conversación | Recuperar los momentos y la coordinación del piloto original. |
| Tamaño tipográfico recalculado al encoger | Título grande independiente que viaja a su destino | Evitar el destello y el reflujo de líneas durante la transición. |
| Cambio instantáneo del color del panel | Interpolación del color y dimensiones de la misma superficie | Mantener continuidad material. |
| Rutina visible directamente | Llamando → conectando → ventana de videollamada | Respetar su entrada narrativa en cada escena. |
| Frases sin estados intermedios | Espera, escritura con puntos, turno de habla y escucha | Ordenar la conversación y las reacciones. |
| Mensajes con tratamiento parecido | Herida en piel/coral con cola izquierda; Rutina en crema con cola derecha | Reconocer quién interviene por forma y color. |
| Barra grande de actos | Seguimiento tipográfico pequeño con acto activo subrayado | Mostrar recorrido sin competir con el recurso. |
| Flechas, controles e indicación inicial | Sin controles flotantes ni aviso inicial visible | Dejar limpia la proyección; se mantienen teclado y clic. |
| Notificación de 19 cqh con botón | Notificación compacta con fuente y sonido, sin «Ver respaldo» | Encajar el aviso en el lateral y reducir acciones innecesarias. |
| Fondo casi estático y paneles más opacos | Dos campos suaves de pigmento, 64 micropartículas en tres planos y materiales con distinta textura y transparencia | Dar profundidad y continuidad sin competir con la lectura. |

La llamada tiene aviso y dos ráfagas de tono; al abrirse el vídeo suena una conexión breve, usando el mismo avatar. La notificación conserva las notas 880 Hz y 1318,5 Hz del piloto original. Los sonidos se sintetizan localmente, sin archivos ni servicios externos. El contexto de audio se activa con una interacción; no se simula una comprobación documental en directo.

## Navegación

Espacio y → avanzan; ← retrocede; Inicio repite la entrada; Fin muestra decisión; P abre las frases de María del Mar; Esc vuelve desde un diálogo. Un clic avanza y el extremo izquierdo retrocede. El seguimiento de actos permite consultar los capítulos escritos; el montaje de esta prueba corresponde solo al capítulo 10.

## Comprobaciones

- `npm test`: las 30 pruebas existentes pasan.
- `npm run build` y `npm run build:piloto`: correctos. El texto de los tres avances y la pregunta de entrada se extraen del guion consolidado.
- Navegador a 1280 × 720 y 1920 × 1080: sin desbordamientos en conversación, evidencia ni información del recurso.
- Recorrido automático: observados capítulo, transición, recurso protagonista y composición conversacional.
- Llamada: el estado «ringing» precede al vídeo; observados conexión y escritura de Rutina.
- Interrupción con varias pulsaciones y retroceso: se reconstruye el avance correcto sin mensajes atrasados.
- Movimiento reducido: contenido, llamada y navegación disponibles sin desplazamientos.
- Notificación: una llegada en el recorrido normal; altura de 92 px a 1280 × 720, frente a 137 px de la revisión anterior.
- No hay `#controls`, `#intro-hint` ni `#sources-button` en la versión compilada.
- Sin errores JavaScript durante la revisión automatizada. Sintaxis y `git diff --check` correctos.

Capturas de esta revisión en `output/playwright/piloto-fluido-*.png`, incluidas llamada, escritura, encuadre grande y estado final. La entrada y salida completas del Claustro y el resto del recorrido siguen pendientes de montaje; esta prueba no sustituye todavía la presentación completa.

## Sonido de conversación · ampliación

Se distinguen llamada entrante, conexión del vídeo, escritura y lanzamiento de respuestas. La escritura usa un único grupo de tres toques suaves por turno, con limitación de frecuencia; no reproduce un sonido por letra ni un bucle continuo. Las respuestas de Rutina y Úrsula tienen matices sonoros distintos. La notificación de Evidencia conserva su firma anterior.

Al conectar se detiene cualquier tono de llamada pendiente. Avanzar, retroceder o abandonar la pestaña cancela los sonidos en curso junto con la coreografía. Los osciladores y sus ganancias se desconectan al terminar. Todo se sintetiza localmente; no se añaden archivos de audio ni llamadas a servicios de generación.

## Ajuste para proyección · histórico de la revisión 4

Retiradas las notas auxiliares bajo el chat («La pregunta que abre la escena», «Con la mejor intención» y las equivalentes). La superficie inicial termina únicamente en el título: se ha eliminado `#chapter-frame` y el chat tiene su propia aparición posterior.

| Elemento | Texto | Fondo opaco | Contraste calculado | Mezcla de ambos colores con blanco al 20 % |
|---|---|---|---|---|
| Mensaje de Herida | `#fff8f0` | `#962c43` | 7,28:1 | 4,72:1 |
| Mensaje de Rutina | `#fff6dc` | `#714417` | 7,66:1 | 4,64:1 |
| Evidencia | `#36351e` | `#e5cf77` | 8,03:1 | 4,69:1 |
| Llamada entrante | `#f6f9ee` | `#354d3e` | 8,63:1 | 4,99:1 |

Ratios calculados con luminancia relativa sRGB. El velo blanco es una prueba orientativa de pérdida de contraste, mezclando los canales RGB antes de calcular la luminancia; no modela ni calibra un proyector concreto. La prueba en la sala sigue pendiente. Los fondos opacos de los mensajes evitan que el contraste dependa de las partículas o del desenfoque. La letra de Rutina aumenta a 1,22 cqw (23,4 px a 1920 px de ancho); Herida conserva 1,29 cqw (24,8 px).

El título utiliza cristal cálido al 82 % con una trama fina; el chat, cristal al 47 % con grano y menor desenfoque; Evidencia, papel ocre con textura y borde oliva. Mensajes activos con elevación leve y contorno propio. Las partículas tienen cinco tamaños efectivos distribuidos en tres planos; se mantiene el fondo en movimiento lento.

Comprobado en navegador: ningún panel de título duplicado, entidad invisible durante el encuadre protagonista y visible al volver al chat; 64 partículas; sin notas auxiliares ni desbordamientos.

## Cohesión de materiales · 7 de noviembre

Esta revisión sustituye los rellenos sólidos anteriores por una misma familia de cristal teñido. Conserva composición, coreografía, avatar y herida.

| Before | After | Por qué |
|---|---|---|
| Chat exterior al 47 % | Cristal al 14 %, sin sombra exterior dominante | El bocadillo sostiene la lectura; el panel deja ver el mundo y las partículas. |
| Coral sólido y letra clara | Cristal coral con texto oscuro | Mantener voz propia dentro del mismo material. |
| Ámbar marrón y letra clara | Cristal ámbar con texto oscuro y cola derecha | Diferenciar a Rutina sin introducir un bloque de otra estética. |
| Aviso de llamada verde dominante | Cristal cálido con acento ámbar | Integrar llamada y videollamada en la misma familia. |
| Evidencia en papel mostaza sólido | Cristal ocre más opaco, borde oliva fino | Conservar identidad científica y formato compacto. |
| Tramas distintas más evidentes | Reflejo compartido, grano mínimo, diferente opacidad | Variar la materialidad sin fragmentar el diseño. |
| Sonido invocado en parte de las secuencias | Sonido vinculado al estado de escritura | Cubrir cada turno, incluida activación demorada del audio. |

Los acentos fuertes quedan en bordes, puntos de escritura y realce del turno activo. Los bocadillos conservan opacidad suficiente detrás del texto; la transparencia mayor se reserva al panel exterior. Textos y colores definidos en tokens, con la misma escala y radios existentes.

El sonido de escritura no utiliza una ventana temporal que pueda suprimir otro turno. Cada entrada en escritura tiene un identificador propio; si el audio está reanudándose, se reproduce cuando queda listo, siempre que el mismo turno siga escribiendo. La primera interacción puede activar el sonido de una escritura que ya haya comenzado. Cambiar de avance cancela el aviso pendiente para evitar reproducirlo tarde. No se intenta reproducir audio antes de que el navegador lo permita.

Los efectos del recurso (gotas, focos, capas, reacciones) son específicos de cada escena. Esta revisión no recupera las gotas del piloto anterior ni impone una animación común: se conserva el encuadre protagonista y la posterior colocación como base para desarrollar cada recurso.

Capturas: `output/playwright/piloto-cristal-mensajes.png`, `piloto-cristal-final.png` y `piloto-cristal-1920.png`. La validación visual de pantalla no sustituye al ensayo en el proyector.

Validación de la revisión 5: en una sesión limpia se observaron seis entradas reales en escritura y seis grupos de sonido, incluyendo la primera escritura al activar el audio con una reanudación demorada 60 ms. Comprobadas ambas resoluciones sin desbordamientos ni errores JavaScript. Las 30 pruebas existentes y la compilación completa pasan.

## Apertura limpia e índice integrado · revisión 6

| Antes | Ahora | Motivo |
|---|---|---|
| El recurso se contiene automáticamente y aparece «A revisar» | La entrada termina con recurso grande, chat y primera frase; la explicación entra al primer avance | Dar espacio a la observación antes del desarrollo. |
| El texto de presentación repite la pregunta de Herida | «Limpiar también es cuidar la piel», con lecho, borde y piel de alrededor | Introducir el alcance de la escena sin duplicar el diálogo. |
| Seguimiento inferior de actos | Nombre del acto con chevron en el panel de capítulo | Concentrar navegación y contexto en una sola zona. |
| Capítulos sin montaje solo enumerados | Cada capítulo permite leer su guion completo; el 10 abre el piloto visual | Hacer consultable el contenido disponible sin presentar otros capítulos como montados. |

El selector abre los siete actos (incluidos Apertura y Cierre); elegir uno abre la ventana de capítulos correspondiente. Admite flechas, Inicio, Fin y Escape. Los diálogos detienen el avance por teclado. Volver al capítulo 10 repite su entrada; retroceder desde el primer avance recupera el recurso desplegado sin explicación. Se mantienen llamada, sonidos, tres avances, avatar y herida.

Comprobado en navegador: recurso inicial de 634 px de alto en pantalla de 1280 × 720, explicación oculta, un único selector y ausencia de índice inferior. Probados selector de actos, lectura de guion y regreso al montaje. Capturas a 1280 × 720 y 1920 × 1080 en `output/playwright/piloto-apertura-limpia*.png`; selector y capítulos en `piloto-selector-*.png`. Las 30 pruebas existentes y la compilación completa pasan.

## Suspensión y profundidad · revisión 7

| Before | After | Why |
|---|---|---|
| Transformación del título de 1450 ms y espera posterior | Transformación de 1900 ms; el recurso entra durante el movimiento y el chat toma el relevo al terminar | Encadenar la atención sin carreras ni pausas vacías. |
| Recurso se contiene en 1350 ms | 1700 ms, explicación durante la segunda mitad y llamada al completar el encuadre | Compartir el ritmo de la apertura. |
| Paneles inmóviles en reposo | Un panel elegido al azar oscila 10–14 segundos, con pausas de 7,5–14 segundos | Sugerir suspensión sin mover todos los elementos a la vez. |
| Fondo cálido en dos velos | Tercer plano malva/salvia, movimiento de 43 segundos y profundidad periférica | Dar volumen al mundo manteniendo la luminosidad. |
| 64 puntos circulares | 72 partículas: puntos, óvalos, anillos y semillas; seis tonos de la paleta y tres planos | Introducir variedad orgánica sutil. |

La oscilación usa `translate` y `rotate` independientes de las transformaciones de entrada: máximo 2,5 px y 0,075 grados, con retorno exacto. Solo el cristal del título modifica ligeramente sus radios; los textos mantienen su geometría. Las nuevas oscilaciones esperan a que terminen las entradas principales, no repiten el panel anterior y no arrancan con diálogos o selector abiertos. Movimiento reducido cancela flotación y animación ambiental; la pestaña oculta cancela la oscilación y su temporizador.

Comprobada una oscilación real de la superficie del título, con duración de 11,9 segundos y un único panel activo, además del paso a conversación y conexión de Rutina sin errores JavaScript. Capturas en `output/playwright/piloto-mundo-herida*.png`.

## Dos avances y presencia de Rutina · revisión 8

| Before | After | Why |
|---|---|---|
| Parada independiente con «¿Qué necesita hoy esta herida?» | Del intercambio con Rutina se pasa directamente a decisión y Evidencia | Eliminar un avance sin un cambio relevante del recurso. |
| Criterios de elección en el avance intermedio | Criterios visibles junto a la decisión y notas de ponente unidas a Evidencia | Conservar la información clínica al simplificar la coreografía. |
| Rótulo superior «En llamada · Hablando/Escuchando» | Indicador inferior con punto verde y pulso; «Escuchando» alterna con ondas al hablar | Despejar la cara del avatar. |

Recorrido visual: entrada → Revisar → Decidir. Flechas, espacio y clic siguen este orden en ambos sentidos. El antiguo enlace `#2` abre la decisión; se mantiene `#3` para compatibilidad. Los tres bloques editoriales del guion se conservan, con indicación explícita de montaje conjunto de los dos últimos. No cambia el resto de capítulos.

## Extensión a todos los capítulos · revisión 9

El contrato de tres escenas y dos avances se aplica a los 22 capítulos, con apertura y cierre narrativos. El estado vigente, los recursos y la validación están en `docs/recorrido-22-capitulos-07-nov.md`. Las entradas son `/recorrido/` (apertura) y `/piloto/` (capítulo 10), compartiendo motor y selector visual. Las limitaciones de capítulos solo consultables como guion que se describen en las revisiones anteriores quedan superadas por este montaje. No se ha publicado ni sustituido la presentación anterior.

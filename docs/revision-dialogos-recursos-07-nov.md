# Revisión de personajes, recursos y fuentes · revisión 10

Se mantiene el diseño aprobado y el contrato de tres escenas con dos avances. Esta revisión coteja el recurso con el diálogo y distingue variantes existentes de imágenes pendientes. Los textos validados de María del Mar permanecen; las modificaciones narrativas nuevas están identificadas como propuestas.

## Ajustes concretos

| Before | After | Why |
|---|---|---|
| La ficha de valoración sustituía a las medidas al comenzar el primer intercambio | Las tres medidas incompatibles siguen visibles hasta la decisión; entonces aparece el registro | Rutina no describe un recurso que ya ha desaparecido. |
| La pauta mostraba los campos completos mientras nadie sabía por qué se había indicado | Preguntas sin justificar al principio, campos completos en la decisión | La réplica validada sobre la plata se corresponde con lo que se ve. |
| La torunda aparecía junto a preguntas ya formuladas | Solicitud con motivo vacío antes de resolver las cuatro preguntas | Hacer visible el automatismo del cultivo por si acaso. |
| Los contornos repetidos permanecían en la decisión | Dan paso a valoración, revisión y decisión | La reevaluación cambia el recurso, además del texto. |
| Los elementos se destacaban por un temporizador independiente | Se relacionan con las palabras y el turno del guion | Evitar señalar partes sin relación con quien está hablando. |
| Todas las poses se trataban como terminadas y cambiaban al llegar a la tercera escena | Estados disponible/reutilizada/pendiente; reacción vinculada a una frase concreta o a Evidencia | Distinguir una imagen de respaldo de la variante específica que falta. |
| Úrsula seguía en el capítulo de vecinas y se conservaba una voz de bacterias | Tres heridas vecinas con voces adaptadas; Úrsula no aparece | Responder a la petición sin confundir heridas y microorganismos. |
| La propuesta inicial de Rutina persistía al mostrar Evidencia, aunque no hubiera réplica nueva | Se retira el bocadillo anterior y se conserva la escucha | Evitar que un automatismo cuestionado parezca la decisión final. |
| Solo dos iconos fijos, ocultos fuera del piloto | Marcas según las fuentes citadas; deduplicadas por institución o revista | Representar el respaldo real de cada escena. |

La referencia del mapa de causas en el capítulo 8 se corrige del capítulo 4 al 5. En el capítulo 19 no se fuerza una llamada: el guion no tiene una intervención hablada de Rutina. En el 13 no se presenta la cureta de un frame existente como si fuera el bisturí del diálogo: queda previsto un retrato neutro y su variante pendiente.

## Recurso contenedor

El panel es un espacio de composición, no un marco obligado de imagen. Puede reunir dos fotografías completas, una imagen con esquema, una ficha, una línea de seguimiento, un mapa, un continuo, una lista vertical, una cita o una composición mixta. `resource.media` admite una colección; los módulos visuales y las imágenes se componen dentro del mismo contenedor. Las composiciones con imagen y esquema admiten también varias imágenes en su columna. Los pies mantienen procedencia y contexto; R ofrece créditos y licencias.

La red profesional del capítulo 15 identifica las disciplinas junto al recorrido de consulta. La participación del 21 incorpora un lugar explícito para la experiencia de la persona. El 18 parte de la presuposición de Rutina y pasa al proceso de acuerdo. Se conservan las condiciones de las cifras, los límites del estudio británico y las alternativas de las fotografías aportadas sin contexto.

## Doña Rutina

El inventario completo, las frases de activación y los prompts están en `personajes/rutina/PENDIENTES-RECORRIDO-22.md`. Fuente editable: `guion/plan-escenas.mjs`.

- Cinco capítulos tienen variantes específicas disponibles: 7, 8, 9, 10 y 12.
- Dos reutilizan imágenes cuya adaptación se debe revisar: 1 y 5.
- Catorce tienen imágenes específicas pendientes; muestran el retrato neutro del mismo avatar, con la etiqueta «Pose pendiente · P».
- En el 19 no se requiere una nueva imagen de Rutina.

P —o la etiqueta del placeholder— abre las notas de preparación: recurso, entrada, reacción, frase exacta que la activa y prompts completos. La expresión no pasa de sonrisa a sorpresa de forma genérica. Se conserva la llamada entrante, conexión y estados; no aparece directamente la ventana de vídeo. No se ha generado ninguna imagen nueva de Rutina en esta revisión.

Para incorporar un archivo nuevo: mantener la identidad aprobada, asignar los dos ficheros en `guion/montaje-capitulos.mjs` y cambiar el estado del plan a `available` cuando corresponda. El respaldo neutro no se considera un archivo terminado de la escena.

## Vecinas

En todo el capítulo 6 se sustituyen los cuerpos de Úrsula por tres instancias del renderizador líquido: ámbar con gafas, salvia con pestañas y malva con dientes. Las caras se dibujan de forma procedural y mantienen definición al cambiar de tamaño. La cara de Úrsula no cambia en el resto del recorrido. Las vecinas se alternan al hablar; las otras escuchan.

Los colores y personalidades son ficción expresiva, sin correspondencia con diagnósticos, microorganismos ni gravedad. La primera frase lo aclara: «También en nosotras viven bacterias. La pregunta es qué está pasando en cada una». La réplica original «Nosotras solo vivimos aquí…» queda en la procedencia del guion: estaba escrita desde el punto de vista de bacterias. La adaptación nueva habla como varias heridas y conserva la distinción presencia/infección, contexto, evolución y riesgo. No se han alterado réplicas marcadas [V].

## Marcas de las fuentes

Se conservan GNEAUPP e IWII y se añaden las marcas de [EWMA](https://ewma.org/news/new-ewma-logo/), [Journal of Wound Care](https://www.journalofwoundcare.com/), [REBEn](https://reben.com.br/) y [Gerokomos](https://gerokomos.com/). Procedencia de cada archivo: `prototipos/piloto-capitulo/iconos/fuentes.json`.

Las notificaciones muestran solo las instituciones o revistas correspondientes a los documentos citados en ese capítulo, deduplicadas: dos documentos de EWMA no producen dos logos iguales. R representa las 13 referencias con su marca y enlace. JWC identifica la revista del estudio de Green; REBEn, la del estudio de Menegon: no se inventan logos de autores ni se presenta el logo editorial como marca del instrumento RESVECH. La marca de Gerokomos acompaña a su referencia en la reserva, no se añade como respaldo de capítulos ajenos. Se conservan proporciones y colores oficiales; los logos identifican procedencia, no aval de la charla.

## Revisión de los 22 capítulos

El detalle por capítulo está en el inventario de Rutina, bajo «Recurso y desarrollo», junto a las frases reales del personaje y el desencadenante de su reacción. En todos se mantiene causa → problema que se cuestiona → criterio de decisión → enlace al siguiente capítulo. No se recuperan Cardiff, el rótulo de NICE, «Quién cura», Endocrino como nodo, la carta de productos ni la votación de la sala. Las notas de María del Mar y la matriz clínica siguen siendo la referencia editorial; esta revisión de montaje no sustituye los cotejos clínicos pendientes ni el ensayo de duración.

Validación: las 36 pruebas pasan, incluida conservación de frases validadas y notas de María del Mar, voz de las vecinas y distinción de imágenes provisionales. Recorridas las 66 escenas a 1280 × 720: sin desbordamientos, logos ausentes ni errores JavaScript de la aplicación. Comprobado que la pauta permanece sin justificar en las dos primeras escenas y se completa en la decisión; las 13 referencias de la reserva tienen marca editorial. Capturas en `output/playwright/revision10-*.png`. No se ha publicado esta revisión.

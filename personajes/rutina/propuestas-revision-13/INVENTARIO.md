# Doña Rutina · Propuestas para revisión 13

7 de noviembre de 2026. **Seis variantes nuevas para revisión, todavía no aprobadas ni integradas.** Solo capítulos 2, 3 y 4 del recorrido de 22 capítulos; no corresponden a las antiguas escenas 2–4.

Fuentes leídas: `CLAUDE.md`, `personajes/rutina/PENDIENTES-RECORRIDO-22.md`, `guion/plan-escenas.mjs` y los diálogos de `guion/GUION_CONSOLIDADO_22_CAPITULOS.md`.

Referencias aprobadas inspeccionadas antes de generar:

- **A**: `personajes/rutina/frames-escena-01-v1/00-reposo.png`: identidad, rostro, gafas, peinado, uniforme, estilo de imagen, luz, fondo, encuadre y escala.
- **B**: `personajes/rutina/frames-escena-01-v1/01-presenta-aposito.png`: misma identidad y diseño del apósito genérico cerrado.
- **C**: `personajes/rutina/frames-escena-01-v1/02-escucha.png`: lectura visual de una reacción aprobada; inspeccionada, no enviada como objetivo de edición.

## Inventario

| Capítulo | Pose | Referencia usada en generación | Archivo |
| --- | --- | --- | --- |
| 2 · Tengo apellido | Propuesta: apósito elegido, bajo, cara despejada; seguridad serena. | A + B | [capitulo-02-propuesta.png](capitulo-02-propuesta.png) |
| 2 · Tengo apellido | Reacción: material apartado del primer plano sobre la mesa; mirada atenta y cejas suavemente recogidas. | capitulo-02-propuesta.png como objetivo + A como referencia aprobada | [capitulo-02-reaccion.png](capitulo-02-reaccion.png) |
| 3 · Cada uno me mide como quiere | Propuesta: estimación «más o menos» con una mano; sin regla ni cifras. | A | [capitulo-03-propuesta.png](capitulo-03-propuesta.png) |
| 3 · Cada uno me mide como quiere | Reacción: deja de estimar y mira una ficha genérica. | capitulo-03-propuesta.png como objetivo + A como referencia aprobada | [capitulo-03-reaccion.png](capitulo-03-reaccion.png) |
| 4 · El día de la marmota | Propuesta: apósito y gasas cerrados preparados de nuevo; eficiente y convencida. | A + B | [capitulo-04-propuesta.png](capitulo-04-propuesta.png) |
| 4 · El día de la marmota | Reacción: deja de preparar y consulta un registro de evolución; duda reflexiva. | capitulo-04-propuesta.png como objetivo + A como referencia aprobada | [capitulo-04-reaccion.png](capitulo-04-reaccion.png) |

Las fichas se ven por su reverso vacío, sin datos, resultados ni texto añadido. El material del capítulo 4 concreta «lo de siempre» con un apósito y gasas cerrados; no añade un tratamiento nuevo.

## Diálogo y activación

### Capítulo 2 · Tengo apellido

**Propuesta — Rutina:** «Yo ya tenía el apósito elegido».

**Activa la reacción — María del Mar:** «Decir crónica cuenta cuánto lleva aquí, pero todavía necesitamos saber qué la causó y qué la mantiene abierta. Estas dos fotografías pertenecen a casos distintos; conocemos su etiología por la publicación, no porque podamos diagnosticarla mirando una imagen».

La reacción atiende a los datos; no añade fotografías clínicas al plano del avatar.

### Capítulo 3 · Cada uno me mide como quiere

**Propuesta — Rutina:** «Pero se entiende más o menos, ¿no?».

**Activa la reacción — María del Mar:** «Tenemos tres formas de describirla y ninguna comparación fiable entre ellas. No sabemos si cambia la herida o cambia la manera de medir. El registro tiene que servir a quien venga después».

La ficha es genérica; no reproduce ítems ni puntuaciones de RESVECH.

### Capítulo 4 · El día de la marmota

**Propuesta — Rutina:** «Ya tengo preparado lo de siempre».

**Activa la reacción — María del Mar:** «Repetir una pauta no demuestra que funcione. Primero necesitamos la comparación que acabamos de ver. Cuando el resultado esperado no llega, ese dato tiene que cambiar nuestra conversación».

El material sigue a un lado mientras consulta el registro; sin una sorpresa teatral ni resultados clínicos inventados.

## Producción y revisión

- Seis llamadas independientes a la herramienta integrada de generación de imágenes, una por archivo; sin CLI ni herramientas de vídeo.
- Edición de las imágenes raster aprobadas; no se ha utilizado, abierto ni renderizado el personaje GLB/Blender.
- PNG RGB, 1448 × 1086, proporción 4:3. Cada imagen es independiente, sin collage ni interfaz.
- Se han inspeccionado visualmente los seis resultados: rostro y rasgos característicos, gafas, peinado, uniforme, iluminación cálida, fondo y encuadre coherentes con las referencias. Las variaciones se limitan a la pose, expresión y objetos previstos. La aprobación final queda pendiente de revisión de la usuaria; son generaciones separadas, no fotogramas con coincidencia píxel a píxel.
- Los prompts completos y sus referencias están en `prompts.json`.
- Los archivos aprobados no se sobrescriben. No se ha ejecutado compilación ni modificado guion, motor o CSS.


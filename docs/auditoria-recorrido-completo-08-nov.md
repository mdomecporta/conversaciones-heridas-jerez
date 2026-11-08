# Auditoría del recorrido completo · 8 de noviembre de 2026

Revisión de la rama `recorrido-completo`, commit `1514617`, comparada con la etiqueta `codex-revision-19` (`250c646`). Se ha leído el texto pegado de Claude como descripción de su trabajo, no como una orden de publicar. No se ha modificado el motor, el guion, el CSS ni los personajes; este informe y el inventario son los únicos entregables de la revisión. No se ha publicado.

**Dictamen:** hay una base aprovechable y las imágenes cargan, pero corregiría los cuatro P1 antes de entregarlo como recorrido listo para revisar. Los tres estados siguen existiendo; lo que se ha alterado es la interacción para recorrerlos y la correspondencia entre discurso, revelado y focos.

## Método y límites

- Compilación correcta y 40 tests correctos.
- Capturadas las 66 vistas de los 22 capítulos a 1280×720. Para separar aspecto de duración se usó movimiento reducido; se comprobó que cada captura intermedia estuviera realmente en el estado 1, sin sustituirla por el final.
- Sin errores de carga HTTP ni imágenes sin cargar en el pase de carga. Sin desbordamientos inferiores de los elementos de contenido medidos. Eso **no** descarta solapes entre paneles, focos semánticamente incorrectos o mala sincronización.
- Reproducidos en modo normal el número de pulsaciones y el desfase temporal del capítulo 7. Reproducidos el foco del capítulo 13, los solapes de apertura/cierre y el control compartido de dos presentaciones.
- No es un ensayo cronometrado de la charla ni una validación clínica nueva de las fuentes. Se compara el montaje con el guion y las decisiones aprobadas.
- Evidencias en `output/auditoria-recorrido-20/`: 66 capturas, `browser.json`, `reproducciones.json`, `timing.json` y tres contactos visuales.

## P1 · corregir antes de entregar

### 1. Dos avances ya no equivalen a dos pulsaciones cuando hay conversación en marcha

**Reproducción:** capítulo 3, primera vista estable; avanzar y pulsar de nuevo mientras la secuencia está en marcha. El registro observado fue `1 → 1 → 3 → 3`. La segunda pulsación se queda en el mismo estado; completa todo su diálogo. La siguiente abre la decisión; otra vuelve a completar esa misma escena.

Los estados lógicos siguen siendo `[0,1,3]`, pero el control ahora alterna dos funciones según el reloj. Para quien pulsa al ritmo de su discurso, unas veces avanza y otras salta al final de un intercambio. La presentación puede necesitar cuatro pulsaciones para llegar al desenlace en lugar de dos.

Además, completar la escena con `instant:true` llama a `ensureCall` en modo instantáneo: conecta directamente el vídeo, saltándose la entrada de llamada. Es una consecuencia del mismo mecanismo, contraria a la regla de que Rutina siempre entra llamando.

**Código:** `prototipos/piloto-capitulo/revision.js:215` (`next`), línea 219 (completa el mismo paso), y `ensureCall` (rama `instant`). El test nuevo comprueba por expresión regular que ese comportamiento existe; no comprueba el contrato de dos avances.

**Corrección propuesta:** reservar flecha/espacio para cambiar de escena, con cancelación segura de la anterior. Separar de esa acción la opción de completar una animación para revisión. No imponer otra pulsación ni un tiempo de espera para acceder a la siguiente escena. Definir explícitamente qué conserva una navegación directa y qué conserva una actuación en vivo de la llamada.

### 2. El foco por coincidencia de palabras puede afirmar visualmente lo contrario del discurso

**Caso confirmado:** capítulo 13, decisión. El último párrafo de María del Mar dice «El DT XIV diferencia estas condiciones…» y explica la necesidad de revisar la situación. El detector encuentra «condiciones» y deja activa **Condiciones adecuadas**; las cautelas quedan atenuadas. La ilustración no ha aportado esos datos. No se debería interpretar ese foco como un verde obtenido.

El motor compara palabras de más de cuatro letras del título con el texto del turno; no distingue negación, pregunta o sentido de la frase. En otros capítulos hay coincidencias amplias como «tratamiento», «infección» o «tiempo», que tampoco describen por sí solas un foco válido.

**Código:** `prototipos/piloto-capitulo/recorrido-recursos.js:198`. Confirmado por DOM: `.visual-item.is-focus` termina en «Condiciones adecuadas…». Captura: `output/auditoria-recorrido-20/c13-s3.png`.

**Corrección propuesta:** asignar focos por identificador de turno y objetivo visual explícito. Para 13, usar el conjunto de datos que faltan o las cautelas; no activar una categoría de seguridad por una palabra suelta. Limpiar el foco anterior cuando no corresponda, en lugar de conservar la última coincidencia.

### 3. Evidencia tapa contenido en apertura y cierre

- **Apertura, preparación con fuentes:** Evidencia ocupa aproximadamente x=102–806, y=469–538. La fila de fuentes complementarias ocupa y=477–504. El panel tapa buena parte de esa fila, justo donde se debía explicar que GNEAUPP no es la única fuente. Intersección medida: 19.079 px².
- **Cierre, tres preguntas:** Evidencia ocupa aproximadamente x=934–1203, y=367–462. La tercera pregunta ocupa x=834–1189, y=354–431. Queda tapado parte de «¿Cuándo revisamos?» y su explicación. Intersección medida: 16.298 px².

No son desbordamientos: ambos elementos están dentro del escenario. Por eso una prueba que solo compara contenido con el contenedor no los encuentra.

**Código:** `prototipos/piloto-capitulo/revision.css:176` y `:203`. Capturas `c01-s1.png` y `c22-s1.png`; rectángulos en `reproducciones.json`.

**Corrección propuesta:** reservar un espacio propio para el respaldo en esos dos marcos narrativos o integrarlo como pie fuera de la zona de lectura; no reaplicar automáticamente la colocación clínica. Comprobar también la llegada de la notificación, no solo su estado final.

### 4. Las esperas nuevas y los focos antiguos no están sincronizados

**Caso medido:** capítulo 7, decisión. Durante el turno `c7-b2-t1` de María del Mar están las cuatro preguntas a la vez (`active="questions"`). Los pares empiezan a encenderse **unos 17,9 segundos después**, al entrar `c7-b2-t2` de Herida. La explicación concreta de signos, respuesta y resistencias ya ha terminado; el foco acompaña una pregunta distinta.

El capítulo 11 usa el mismo patrón: durante la explicación de María del Mar se muestra el conjunto y el recorrido de zonas se dispara en la réplica posterior de Herida. La animación existe, pero no necesariamente acompaña la frase que describe cada zona.

**Código:** `revision.js:94` reserva tiempo por palabras; `recorrido-recursos.js:91` y `:97` disparan estados diferentes para María del Mar y Herida. Traza en `timing.json`.

**Corrección propuesta:** rehacer las señales de revelado y foco junto con la nueva temporalización. Relacionar cada foco con el turno que lo explica; definir hitos internos si el turno es largo. Los puntos importantes no deben depender de una demora heredada de la versión que omitía la espera de la ponente.

## P2 · corregir o dejar explícito para la revisión

### 5. La ventana de ponente no está vinculada a una proyección concreta

Se usa el nombre fijo `recorrido-ponente` sin un identificador de presentación. En un contexto de navegador aislado abrí capítulos 3 y 7 en dos pestañas del mismo sitio: **una sola orden `next` movió las dos al estado 1**. La ventana de ponente también puede recibir el estado de cualquiera de las dos.

**Código:** `revision.js:10`, `:442`, y `ponente.js:9`. Reproducción en `reproducciones.json`.

**Propuesta:** emparejar la ventana con una instancia mediante un identificador de sesión, o imponer de forma explícita una única proyección activa. Es relevante al revisar con varias pestañas, `/piloto/` y `/recorrido/`, o abriendo capítulos desde la hoja.

### 6. Capítulo 10: las dos vías han perdido sus encabezados condicionales

El motor sigue construyendo «Sin indicación antimicrobiana / Con indicación» en las opciones antiguas, pero esas opciones están ocultas. Las nuevas `.decision-way` solo copian título y texto: quedan «Limpieza adaptada» y «Elegir y revisar», sin los encabezados que distinguían las dos situaciones. La condición se conserva en el respaldo, que llega después.

**Código:** `recorrido-recursos.js:107` (`decision`) y el bloque de etiquetas de `revision.js`. Captura `c10-s3.png`.

**Propuesta:** trasladar también las condiciones de las vías al recurso nuevo, sin recuperar la cuadrícula duplicada exterior. Así no dependemos de que el público infiera la condición desde un párrafo posterior.

### 7. El apagado genérico afecta también a fotografías clínicas

El díptico del capítulo 2 es `.art`; las reglas globales de atención bajan la opacidad de toda esa pieza al hablar Rutina y al concluir. Aunque las imágenes no tienen filtros, el resultado compuesto se aclara contra el fondo. No es lo mismo que apagar una etiqueta exterior.

**Código:** `revision.css:407` y `:482`. La imagen original y sus licencias están presentes; no hay un archivo roto.

**Propuesta:** conservar las fotografías clínicas con intensidad estable y llevar el foco a marcos, anotaciones o texto. Diferenciar ese comportamiento de las fotos de material y recreaciones.

### 8. El peso optimizado depende de una utilidad local de macOS

El build invoca `sips`; si falla, copia los PNG originales y devuelve esas rutas. En esta compilación local los 31 archivos únicos de avatar ocupan aproximadamente **3,28 MiB**; sus originales suman **59,72 MiB**. Por tanto, el peso local no garantiza el peso de una compilación en un entorno que no tenga `sips`.

**Código:** `scripts/build-piloto.mjs:30`.

**Propuesta:** usar una conversión portable o preparar los derivados antes de publicar, y comprobar en la compilación final qué rutas y tamaños se sirven. Es un riesgo de carga, no un fallo de imagen ya observado en local.

### 9. El inventario y la hoja de revisión no cubren lo mismo que se afirma

- `personajes/rutina/PENDIENTES-RECORRIDO-22.md:5` sigue describiendo catorce retratos provisionales y dos reutilizaciones. El estado real es seis provisionales, nueve capítulos con propuestas y una reutilización.
- La hoja tiene **173 entradas `[N]`**: 65 de Herida, 68 de María del Mar, 22 de Evidencia, 14 de Rutina y 4 de Vecinas. El recuento «106 frases» del resumen no coincide con el conjunto de propuestas que se entrega para revisar.
- La hoja extrae diálogo, aprendizaje y respaldo, pero no lista todas las cabeceras, opciones ni anotaciones nuevas de los recursos. Hay texto de montaje que también debe revisar María del Mar.
- Hay un enlace por capítulo al estado 0; no un enlace a cada escena.
- Las etiquetas de poses pendientes se ocultan en proyección salvo con `?poses`. Para una entrega de revisión conviene que el carácter provisional sea visible o que el enlace incluya ese parámetro. Las casillas no guardan, como ya se había advertido; no sirven como registro de aprobación.

**Código:** `scripts/build-piloto.mjs:79` y `:80`; `revision.js` al configurar `#routine-placeholder`.

**Propuesta:** entregar un inventario actualizado y una hoja que diferencie aprobación de texto, recurso y pose, sin presentar una casilla transitoria como aprobación persistente.

## Imágenes: estado real

Ver `docs/inventario-imagenes-auditoria-08-nov.md`. Hay doce poses específicas por generar en seis capítulos, dieciocho propuestas generadas por aprobar en nueve capítulos, cinco capítulos con variantes disponibles y una reutilización de apertura por revisar. No se necesita imagen de Rutina en el capítulo 19.

Las fotografías y modelos usados por los recursos cargan. No he encontrado una imagen ausente que obligue a regenerar todos los recursos. Los dibujos nativos de tubo, mano, red o asiento son composiciones implementadas; se pueden pulir, pero no deben contarse automáticamente como generaciones raster pendientes.

## Matriz de repaso por capítulo

| Capítulo | Resultado principal |
| --- | --- |
| 1 | Prólogo y entrada se conservan; corregir solape de Evidencia sobre fuentes complementarias. Rutina reutilizada. |
| 2 | Dos casos independientes cargan y conservan procedencia. Revisar atenuación de la fotografía; poses propuestas. |
| 3 | Tres estados y recurso comparable conservados. Le afecta el cambio de pulsaciones y la sincronía común. |
| 4 | Bucle, revisión y decisión implementados. No hay una imagen nueva pendiente. |
| 5 | Distribuidor de causas implementado. Condición vascular presente en la decisión; pose propuesta. |
| 6 | Vecinas y continuo presentes; revisar focos por palabra para no confundir mención de infección con clasificación de una herida. |
| 7 | Material y solicitud cargan. Corregir foco tardío de las preguntas; mantener advertencia sobre interpretación. |
| 8 | Tubo y causa pendiente implementados. El dibujo es esquemático, no un asset perdido. |
| 9 | Pauta permanece por justificar en 0/1 y se completa en 3. Las condiciones de la plata permanecen. |
| 10 | Modelo de piel presente. Recuperar encabezados de las dos vías en el recurso nuevo. |
| 11 | Modelo íntegro y marcadores presentes. Alinear recorrido con discurso de la ponente; poses propuestas. |
| 12 | Comparación de fuerzas y condiciones presentes. Revisar foco explícito, no solo palabras coincidentes. |
| 13 | Corregir foco verde/condiciones adecuadas. La ilustración de escara existe. Dos poses pendientes. |
| 14 | Dos caminos diferenciados, sin foto que pretenda establecer pronóstico. Poses propuestas. |
| 15 | Circuito con retorno y nota de esquema docente implementados. Poses propuestas. |
| 16 | Recreación identificada; prioridades presentes. Poses propuestas. |
| 17 | Pacto y mano implementados; dos poses pendientes. |
| 18 | Presuposición → acuerdo implementados; dos poses pendientes. |
| 19 | Recreación e información adaptada presentes; no se fuerza llamada de Rutina. |
| 20 | Síntomas y objetivos presentes; dos poses pendientes. |
| 21 | Plaza e influencia representadas; dos poses pendientes. |
| 22 | Jubilación, recordatorios y salida conservados. Corregir solape sobre tercera pregunta; dos poses con maletín pendientes. |

## Duración y publicación

La suma teórica de las esperas y turnos programados ronda 23,5 minutos, sin contar entradas, lectura inicial, prólogo y pausas de exposición. No contradice una estimación de 26–28 minutos, pero no es una duración ensayada. El problema más inmediato es que una pulsación durante esa espera no tiene una función estable.

Orden recomendado: corregir P1 → verificar los tres estados y la llamada en cada capítulo → revisar con María del Mar usando estados de pose explícitos → aprobar/generar las poses que faltan → comprobar build de publicación y carga. No hace falta rehacer el diseño de los personajes ni empezar otro recorrido.

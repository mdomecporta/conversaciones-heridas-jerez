# Conversaciones con una herida

Guion de lectura más reciente: `../bibliography/GUION_PARA_MARIA_DEL_MAR.md`. Incluye las explicaciones redactadas y el criterio acumulativo solicitado después: actuación tachada, pregunta y aprendizaje permanecen visibles. La versión de lectura para compartir está en `../output/guion-maria-del-mar/guion-maria-del-mar.html`. Este ajuste está escrito en el guion y pendiente de trasladar a la interfaz.

Presentación de María del Mar Candil Ramón para las IV Jornadas Comisión Heridas Jerez, 19 de noviembre de 2026. Edición editorial del 30 de octubre. Contenido pendiente de revisión clínica final y de ensayo de duración con la ponente.

## Escena desde el guion · 31 de octubre

`dist/escena.html` es la presentación proyectada construida directamente a partir de `../bibliography/GUION_PARA_MARIA_DEL_MAR.md`. `npm run escena` la regenera (también `npm run build`). Si el guion cambia de forma que una escena pierde su hilo, su evidencia o su enlace, la compilación se detiene y dice qué falta.

- `scripts/guion.mjs` lee el guion: hilo (A revisar, Nos preguntamos, Nos llevamos), diálogo, evidencia, fuente, condición, notas de pantalla y bibliografía.
- `escena-recursos.js` compone lo que trae la herida en cada escena, según las notas «En pantalla · recurso de la herida».
- `escena.js` y `escena.css` son el motor y las composiciones. `entity.js` se usa sin cambios.
- **P** abre la ventana de ponente (lo que dice María del Mar en cada paso, incluidas las explicaciones que no se proyectan, la réplica de la herida, la nota de pantalla, el siguiente paso y el cronómetro). Las dos ventanas avanzan juntas. **G** abre el recorrido. **F** pantalla completa. Clic en el tercio izquierdo retrocede; en el resto, avanza.
- La dirección de diseño está en `../design/escena-guion.md`.

## Abrir y revisar

- `dist/revision.html`: presentación autónoma para revisar o presentar, sin notas privadas ni editor.
- `dist/index.html`: edición completa, con preparación, notas y guardado local.
- `dist/resumen.html`: documento público para llevar, imprimible, con las 21 actuaciones, preguntas, aprendizajes, condiciones y bibliografía.
- `../output/editorial-30/guion-ponente.md`: guion de ensayo con intervenciones, acciones de pantalla, fuentes y notas de conducción. Es un documento de preparación, separado de la copia pública.

`npm run build` regenera todos estos archivos desde las fuentes. No editar directamente `dist/`. `npm run dev` sirve la presentación en http://127.0.0.1:4173/revision.html.

La edición funciona sin conexión con las fuentes, imágenes y entidad incluidas. Consultar publicaciones externas requiere conexión. Los vídeos, si se incorporan, se distribuyen junto al HTML en su carpeta.

## Recorrido editorial vigente

Cuatro bloques, cada uno con una pregunta que explica su función:

1. **Antes de empezar:** ¿qué necesitamos saber antes de elegir?
2. **Durante la cura:** ¿por qué lo hacemos y cómo sabremos si ayuda?
3. **Cuando algo no encaja:** ¿qué nos hace cambiar de camino o de objetivo?
4. **Antes de irnos:** ¿qué dejamos acordado para la próxima visita?

Se mantienen 24 escenas con sus identificadores: 21 actuaciones, un regreso al carro del comienzo, la recopilación completa y la despedida. Las pantallas institucionales y las dos introducciones enmarcan el recorrido.

Cada actuación tiene una sola redacción de **Revisamos / Nos preguntamos / Nos llevamos**. El resumen proyectado y el documento para llevar leen directamente esos campos, incluido el aprendizaje que se edita en Preparar. No existe una segunda tabla de textos que haya que mantener a mano.

La apertura muestra la actuación y la réplica de la herida. El primer avance destaca la pregunta. La exploración utiliza el diálogo o un recurso. Un paso propio proyecta el fundamento científico, su fuente y las condiciones necesarias. Al cerrar, destaca el aprendizaje y María del Mar enlaza con la siguiente escena.

Solo permanece visible el intercambio actual. El resto se consulta en Ampliar. Durante la explicación científica se recoge el diálogo. Una imagen ocupa el escenario cuando es el objeto de observación; en los demás casos puede acompañar al recurso como miniatura ampliable. Los detalles anteriores del recurso se recogen durante la exposición, conservando la exploración manual.

La recopilación de las 21 actuaciones se proyecta en siete páginas, agrupadas por bloques. Las cinco preguntas transversales permanecen como apoyo en Ampliar y en el resumen para llevar. No añaden otro capítulo al cierre.

## Voces y recursos

Conversan María del Mar y la herida. La herida es una compañera abstracta que reúne historias docentes. No tiene una localización o una paciente fijas, no diagnostica y no expresa las preferencias de una persona real. María del Mar interpreta la evidencia y formula la recomendación. Los recuerdos profesionales reales se incorporan cuando ella los aporte.

El humor apunta a las rutinas y a la complicidad. Dolor, gravedad e incertidumbre requieren otro ritmo. Se conservan las réplicas alternativas para ampliar, sin obligar a recorrerlas todas.

Se mantienen los 11 recursos del catálogo: fotografías clínicas externas, material y modelos conceptuales generados con IA, identificados como tales. Ninguna fotografía clínica se presenta como imagen de una paciente del relato. La biblioteca mantiene descripción, procedencia, licencia y permisos. Las ilustraciones no permiten diagnosticar por aspecto. Esta edición no incorpora vídeos nuevos.

La entidad conserva Campo vivo, acabado líquido y Sangre y piel. Sus colores y movimientos expresan la conversación, no signos clínicos. Los estudios de movimiento y el prototipo de limpieza siguen disponibles en `dist/entidad-motion.html` y `dist/escena-entidad.html`.

## Fuentes y revisión

Se utilizan los seis PDF aportados de GNEAUPP, EWMA e IWII. Cada escena conserva fuente, localizador, tipo de respaldo y alcance. Las condiciones que cambian la seguridad acompañan al fundamento y al aprendizaje, además de quedar en notas y en el resumen para llevar.

Las referencias completas se transcribieron de los originales. Los metadatos de EWMA 2026 se cotejaron en la página 2 del PDF: 27(1 Suppl 2):S1–S31, DOI 10.35279/jowm2026.27.01.sup02. No se añaden guías externas al corpus.

El cotejo editorial de los originales no sustituye la revisión clínica por María del Mar. Sigue pendiente adaptar la vía de consulta al circuito real y ensayar la duración. No se afirma un tiempo de exposición a partir del número de escenas o pasos.

## Guardar y conservar cambios

La edición del 30 de octubre usa `jerez-conversations-v7`. Los borradores v6 y anteriores conservan su almacenamiento original y se recuperan desde Compartir. La nueva edición no sobrescribe sus notas ni sus imágenes.

Preparar modifica el borrador. Guardar para presentar actualiza la versión pública, manteniendo las notas privadas separadas. Compartir exporta HTML autónomo sin notas o JSON editable con notas y recursos. El botón Resumen para llevar descarga el documento correspondiente al modo y a la versión que se está consultando.

El almacenamiento es local a cada navegador. Los cambios hechos en el editor no reescriben los archivos fuente. Para compartirlos, guardar y exportar desde la aplicación. Conservar también una copia JSON del proyecto.

## Navegación

- Flechas izquierda/derecha, espacio y mando: paso anterior o siguiente.
- Flechas arriba/abajo: cambio de escena.
- Inicio/Fin: extremos de la presentación.
- G: guion en pantalla. V: ventana de ponente. F: pantalla completa.
- 1–3: intercambios preparados para ampliar. 0: reiniciar conversación.
- Escape: cerrar ventanas o salir de pantalla completa.

Saltar desde Escenas o desde la barra de bloques conserva el punto del recorrido. Volver al recorrido recupera ese punto; Seguir desde aquí convierte la escena elegida en el nuevo punto de partida. La indicación de desvío aparece en la parte inferior, sin cubrir los controles de modo.

## Fuentes del proyecto y comprobación

- `edition.js`: recorrido, voces, actuaciones, preguntas, aprendizajes y fundamentos.
- `editorial.js`: agrupación del resumen y generación del documento para llevar.
- `content.js`: referencias completas y contenido base.
- `app.js`: preparación, presentación, pasos, consulta y exportación.
- `tokens.css`, `app.css`, `stage.css`, `scenes.css`: identidad y composiciones, en ese orden.
- `scripts/build.mjs`: copias autónomas, resumen y guion de ensayo.

`npm test` ejecuta 64 comprobaciones, incluida la cobertura de las 21 actuaciones, la igualdad de los textos del resumen, las condiciones clínicas visibles, la recuperación del v6 y la exclusión de notas privadas. Se ejecutan sin JIT porque se observó un cierre del proceso al ejecutar el conjunto de contextos simulados con Node 24.15. El conjunto también se comprobó con Node 24.22.1.

La revisión visual recorrió 344 estados a 1280 × 720 entre Revisar y Presentar, sin desbordamientos ni desplazamiento interno en los paneles examinados. Las pruebas no sustituyen el ensayo en proyector con María del Mar.

La propuesta de referencia está en `../bibliography/PLAN_EDITORIAL_Y_NARRATIVO_30_OCTUBRE.md`. Los guiones de fechas anteriores se conservan como antecedentes y quedan sustituidos por esta edición donde difieran.

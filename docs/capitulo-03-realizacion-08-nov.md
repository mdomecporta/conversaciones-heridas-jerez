# Capítulo 3 · montaje desarrollado · 8 de noviembre

Vista local: `/dist/recorrido/?revision=14#capitulo-3/0`.

Se desarrolla el recurso del capítulo 3 dentro del recorrido de 22 capítulos. No se cambian las intervenciones del guion consolidado, sus fuentes ni los capítulos restantes. La nueva carpeta de Evidencia sigue en su prototipo; el capítulo utiliza la ficha existente.

## Secuencia

| Escena | Recurso y activación | Conversación |
| --- | --- | --- |
| Inicial · estado 0 | Tres notas independientes y ligeramente desalineadas: “4 cm”, “Media palma” y “Como una moneda de dos euros”. Se identifica como ejemplo simulado. | Úrsula: “Que medir sirva para saber si estoy cambiando”. El recurso permanece grande junto al chat. |
| Primer avance · estado 1 | El recurso se contiene. Las tres notas se iluminan sucesivamente durante el turno de Úrsula. Tras la propuesta de Rutina y al entrar la explicación de María del Mar se alinean sobre una misma base; las expresiones siguen siendo incompatibles. Las opciones de la conclusión aún no se muestran. | Se conserva la frase original de las tres descripciones y la réplica “Pero se entiende más o menos, ¿no?”. Rutina entra por llamada. La explicación establece que no podemos saber si cambia la herida o la manera de medir. |
| Segundo avance · estado 3 | Las mismas notas se recogen como antecedente atenuado y se despliega la ficha general: medidas, lecho, entorno y persona. Fecha de valoración y plan de revisión quedan sin datos inventados. La mención de RESVECH se mantiene separada y no puntúa. | Se agrupan los bloques editoriales 2 y 3 del guion. Se mantiene la frase sobre la siguiente enfermera, aparece Evidencia y se cierra con “Porque si sigo igual, hay que darse cuenta”. |

Los encabezados, pies y rótulos del recurso son propuestas editoriales nuevas para revisión de María del Mar. No se presentan como frases validadas. El guion completo y las condiciones permanecen en P, con las fuentes en R.

## Implementación

`recorrido-recursos.js` conserva el mismo elemento de las notas al cambiar entre las escenas del capítulo. La alineación se activa desde el turno real de María del Mar. La iluminación temporal pertenece al recurso y se cancela al navegar; no existe un temporizador permanente que pueda afectar al siguiente capítulo. Al retroceder se recupera cada estado y se oculta la ficha cuando aún no corresponde.

El avatar sigue siendo el retrato neutro aprobado con su etiqueta de pose pendiente. Las variantes nuevas de `personajes/rutina/propuestas-revision-13/` se han localizado, pero su inventario dice que aún no están aprobadas; no se integran por existir archivos. No se han generado imágenes, vídeos ni nuevos datos clínicos.

| Before | After | Why |
| --- | --- | --- |
| Tres textos en una cuadrícula genérica | Tres notas que conservan su identidad y se alinean durante el razonamiento | Mostrar por qué entender cada descripción no basta para comparar |
| La ficha sustituye todo el recurso | Las notas quedan como antecedente y aparece el registro | Mantener continuidad entre problema y decisión |
| Campos de ficha pequeños | Texto ampliado y campos agrupados en cuatro áreas | Mejorar lectura en proyección |
| Opciones anticipadas durante la pregunta | Opciones reservadas al desenlace | Evitar revelar la respuesta antes de la discusión |

## Verificación

- Compilación completa y 37 tests correctos.
- Pase real con animación: entrada, llamada, réplica de Rutina, alineación y decisión, sin errores de página.
- Comprobación a 1280×720 y 1920×1080; ficha dentro del recurso y sin solapar el pie.
- Tres estados con dos avances comprobados: 0 → 1 → 3.
- Navegación al capítulo 4 elimina el recurso de medida; volver recupera la decisión y Home restablece la entrada con la ficha oculta.
- Movimiento reducido y saltos rápidos comprobados.

Capturas: `output/playwright/capitulo03-entrada.png`, `capitulo03-pregunta.png`, `capitulo03-registro.png`.

Pendiente de revisión de montaje por la usuaria y de aprobación de las poses de Rutina. No publicado en Netlify.

## Revisión 15 · recurso con identidad propia

Ajuste solicitado: retirar expresamente las tarjetas giradas y diferenciar más el contenido del recurso de los paneles de conversación. La flotación, oscilación y movimiento ambiental se conservan: no se cambia su motor ni sus amplitudes.

Se eliminan las cajas individuales, el relieve y la inclinación. Las descripciones se presentan como tres columnas tipográficas sobre una superficie de tinta cálida, con separadores y acento coral. El valor “4 cm” gana escala frente a las comparaciones verbales; las tres siguen sin convertirse entre sí. El turno de Úrsula destaca el texto, no el fondo de una card. La fase de falta de comparación añade una base de acento. La ficha final adopta un único formato de hoja clara con líneas de registro, sin cuatro subtarjetas coloreadas.

El cambio se limita al recurso de este capítulo. La identidad de otros recursos se resolverá por su contenido: esta superficie no es una nueva plantilla universal.

| Before | After | Why |
| --- | --- | --- |
| Tres cards con inclinación y sombra | Columnas rectas, sin caja ni sombra | Respetar la preferencia de la usuaria |
| Recurso comparte vidrio y tono con el chat | Superficie de observación con contraste y tipografía propia | Separar el recurso de la conversación |
| Cuatro áreas con aspecto de subtarjeta | Hoja de registro con líneas y jerarquía | Hacer reconocible un documento de valoración |

Compilación y sintaxis correctas; comprobación visual a 1280×720 sin errores de página. Las tres descripciones tienen transform `none` y sombra `none`. Registro sin solapamiento con el pie. Capturas `output/playwright/capitulo03-editorial-entrada.png` y `capitulo03-editorial-registro.png`. URL: `/dist/recorrido/?revision=15#capitulo-3/0`.

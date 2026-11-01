# Diseño de la presentación · vigente desde el 31 de octubre de 2026

La presentación (`dist/index.html`) se construye a partir del guion para María del Mar. Cada nota «En pantalla» del guion es un cambio de paso, y los textos del hilo, del diálogo y de la evidencia se leen del documento.

## Principio

En cada paso hay un solo foco. Hay tres mundos y cada uno tiene su propia superficie, su color y su tipografía, para que se distinga de un vistazo qué es progreso, qué es conversación y qué es evidencia. La paleta parte de la tinta «Sangre y piel» de la herida: carmín #C6323E, piel #E9B696, sombra #743536, ocre #D4C570 y suero #FFF2D4. Está entera en `tokens.css`.

## Progreso: la noche

- Un panel fijo a la izquierda (#22171A, un tercio del ancho) con el recorrido de las 13 escenas, el número y el título de la escena, y el hilo.
- **El hilo como sutura.** Las tres etiquetas (A revisar, Nos preguntamos, Nos llevamos) se ven desde el primer paso, unidas por un hilo discontinuo.
  - **A revisar** abre la escena en grande. Al aparecer la pregunta, una línea coral la tacha (también en varias líneas), el texto se reduce sin dejar de leerse y su nudo pasa a ser una puntada (×).
  - **Nos preguntamos** entra en piel; baja de tamaño durante la evidencia.
  - **Nos llevamos** entra directamente en el hilo como una ficha de la hoja científica (papel, filo oliva, nudo ocre): lo que nos llevamos se apoya en la evidencia. Es lo más claro del panel y cierra la escena. No se repite en el espacio de la derecha.
- Cada momento tiene su pigmento sobre la noche: coral (I), ámbar (II), malva (III) y salvia (IV). Las escenas terminadas son puntadas; la actual, un anillo que respira. Al volver a una escena anterior (escena 12), su hilo conserva el pigmento de su momento.
- Las entradas de bloque y la recopilación ocupan toda la pantalla en la misma noche: son la estructura de la charla.
- **La guía de partida (apertura).** Cuando la herida trae el carro, aparece *Qué no hacer en heridas crónicas* con una marca por cada una de sus 47 recomendaciones, agrupadas en sus seis apartados. Después se iluminan en carmín las que salen en la charla, entran los cuatro momentos con su pigmento y el resto queda como «Guardadas, por si preguntáis».
- **El cierre (escena 13)** empieza en la noche: «Lo que nos llevamos», tres páginas de recopilación y «Para seguir profundizando» (los apartados de la guía con lo que queda en la reserva y una línea por guía de la bibliografía). Después vuelve al marfil para la pregunta de la mesa, la pregunta final y el agradecimiento.

## Conversación: la herida

- Burbujas de mensajería en Figtree. La herida, a la izquierda, en un degradado de piel a coral con su nombre en carmín; antes de hablar aparecen tres puntos y después su frase palabra a palabra. María del Mar, en blanco, alineada a la derecha y con sus iniciales.
- Se proyectan las frases cortas de María del Mar como disparador. Las de más de 32 palabras y la explicación que acompaña a la evidencia solo aparecen en la ventana de ponente.
- «Para seguir» es la misma burbuja de María del Mar con la etiqueta «→ para seguir».
- **La sala** tiene su color, azul pizarra (`--room`): la pregunta a la sala es una burbuja azul y lo que se recoge de la sala (escena 12) lleva sus puntos azules.
- Lo que trae la herida (fichas, esquemas, imágenes) lleva la etiqueta «La herida trae» y una tarjeta en tonos de piel. Las fichas muestran huecos donde falta información, sin inventar datos. En las imágenes, un foco recorre las zonas del catálogo con una tarjeta por zona. Cada imagen conserva su identificación y su crédito.

## Evidencia: la hoja

- Una hoja de papel con un filo de oliva a ocre, un icono de documento, «Evidencia científica», la fuente en una píldora oliva, el titular en Fraunces, la síntesis y la condición en un recuadro oliva. Al pie se aclara que es una síntesis del documento citado, no una cita literal.
- Mientras habla la evidencia, el recurso queda en miniatura bajo «La herida trajo» y la herida escucha desde la columna derecha, donde dice su réplica en pequeño.

## Cambio de diapositiva

Cada diapositiva lleva su fondo opaco (marfil, noche o blanco institucional) y la nueva se funde encima de la anterior; la anterior se retira cuando ya está cubierta. El panel nocturno permanece entre escenas y solo cambia su contenido.

## Guía de la ponente

`?guia` muestra, por diapositiva, «De qué va» (la idea, lo que revisamos, la pregunta, la evidencia y lo que nos llevamos) y después el paso a paso: qué pasa en cada clic y qué decís ella y la herida. Se genera de los mismos pasos y de los cambios de texto guardados, así que refleja cada cambio. Se puede imprimir.

## Ventana de ponente y preparación

La ventana de ponente muestra la diapositiva en vivo y el paso siguiente (dos espejos de la página que siguen a la presentación), con lo que se dice ahora. Las notas no aparecen ahí: viven en un panel flotante sobre la diapositiva (N), que se abre, se escribe y se cierra.

## Tipografía

Fraunces para titulares (portada, escenas, bloques) y para la evidencia. Figtree para la conversación, el hilo, los rótulos y los recursos.

## La herida

Entidad líquida con la tinta Sangre y piel (`entity-liquid.js`, variante 3, tinta 1). Su lienzo es más ancho que su sitio y tiene los bordes difuminados, para que su forma, más ancha que alta, no se corte. Cambia de sitio disolviéndose y condensándose; al cambiar de escena sale por un lado y entra por el otro. No tiene suelo, horizonte ni rebotes.

## Pasos de una actuación

| Paso | Hilo (noche) | Espacio principal | Herida |
|---|---|---|---|
| Apertura | A revisar en foco | Su burbuja | Grande, junto a su frase |
| Recurso (1–4 avances) | Igual | Tarjeta o imagen; la frase de María del Mar arriba | Pequeña, como avatar |
| Pregunta | Tachado y pregunta | El recurso sigue; responde la herida | Igual |
| A la sala | Igual | Pregunta grande con la etiqueta «A la sala» | Escucha |
| Evidencia | Pregunta en apoyo | Hoja científica; el recurso, en miniatura | Columna derecha |
| Réplica | Igual | Su burbuja pequeña bajo la herida | Igual |
| Aprendizaje | Tarjeta «Nos llevamos» | Vacío | Descansa |
| Para seguir | Igual | Burbuja de enlace | Igual |
| Cierre de bloque | Igual | Escenas del bloque con puntadas y la frase de cierre | Abajo a la derecha |

## Reserva: la hoja completa

- La tecla **R** abre, sobre la charla y sin cambiar de paso, las 47 recomendaciones del DT XIV en el mundo de la evidencia: pestañas por apartado y una tarjeta por recomendación con su síntesis, página, fuerza y, si procede, «En la charla · escena N», «Relacionada» o «Curiosidad». Los apartados largos pasan a tres columnas para caber en una pantalla.

## Comprobación

Se recorren los 131 estados a 1280 × 720 sin errores ni burbujas fuera de la pantalla, y los seis apartados de la reserva caben sin desbordar. `npm test` comprueba que el guion encaja (11 actuaciones con hilo, evidencia y orden; la reserva con sus 47 recomendaciones, citadas en el respaldo de su escena cuando salen en la charla), que no se proyectan explicaciones largas, que cada recurso existe en el catálogo y el comportamiento de la entidad líquida.

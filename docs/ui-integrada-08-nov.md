# UI integrada · revisión 16 · prueba en capítulo 3

Aplicación del análisis de referencias, conservando paleta, tipografías, personajes, flotación y secuencia de tres escenas/dos avances. Vista: `/dist/recorrido/?revision=16#capitulo-3/0`.

## Criterio

La estructura conserva posiciones reconocibles: acto/capítulo, voz de Úrsula, recurso, llamada de Rutina y respaldo. La cantidad de elementos visibles cambia con la narración. Un recurso puede tener su propio lenguaje visual; los contenedores auxiliares no deben competir con él. Este ensayo está limitado al capítulo 3 para validarlo antes de extenderlo.

| Before | After | Why |
| --- | --- | --- |
| Marco de chat amplio y bocadillo interior | Chat exterior transparente, sin borde ni sombra; se conservan bocadillo, nombre y estados | Mostrar la voz y dejar respirar al personaje |
| Bocadillo vacío mientras habla Rutina | Se desvanece el bocadillo en espera | Evitar un contenedor sin información |
| Pregunta o argumento repetido arriba, dentro y debajo del recurso | Un encabezado principal; se retiran pies y rótulos duplicados | Concentrar la lectura |
| Registro acompañado de descripciones anteriores y dos bloques que lo repiten | Una única hoja de registro, más legible | Hacer que el desenlace tenga un centro de lectura |
| Conclusión visible antes del respaldo | Una sola conclusión entra al aparecer Evidencia | Dar ritmo al cierre, sin un avance nuevo |

## Tres escenas, dos avances

1. **Observar:** recurso grande, tres expresiones y primera frase de Úrsula. No aparece la conclusión.
2. **Cuestionar:** el recurso se contiene, recibe la llamada y destaca cada expresión. La pregunta se muestra una vez. No aparecen las opciones anticipadas ni la conclusión.
3. **Decidir:** las expresiones anteriores se retiran de la pantalla; queda la ficha con sus áreas, fecha y revisión. Al intervenir Evidencia entra la frase “Medir igual para reconocer el cambio”. Se conservan los turnos y las condiciones del guion.

Los textos que dejan de proyectarse por duplicados siguen disponibles en el guion y las notas de ponente. No se modifica ninguna intervención validada. La ficha antigua de Evidencia continúa en uso: su carpeta sigue como estudio separado.

## Límites y comprobación

No se modifica el renderer, la cara, la escala ni las posiciones de Úrsula y Doña Rutina. Tampoco se cambia el avatar, el contenido del vídeo, la mecánica de llamada, las amplitudes de flotación o el fondo ambiental. Los ajustes de transparencia afectan a la UI exterior del chat. El panel principal amplía su altura para dejar espacio al recurso; su entrada sigue utilizando la transición existente.

La conclusión se controla por `data-ui-evidence` y se limpia al cambiar de paso. Se evita que permanezca al retroceder o pasar de capítulo. Los estilos están acotados a `data-chapter="3"`.

Compilación y 37 tests correctos. Pase completo a 1280×720 sin errores de página; comprobación de conclusión oculta antes de Evidencia y visible después. Capturas `output/playwright/capitulo03-ui-entrada.png`, `capitulo03-ui-pregunta.png`, `capitulo03-ui-decision.png`.

Antes de extender: validar jerarquía y ritmo en esta muestra. Después probar la misma lógica con un recurso fotográfico (7) y uno por zonas (11), conservando sus composiciones propias; no copiar la superficie de medición a todos.

## Revisión 17 · liquid glass y atención explícita

La usuaria rechaza el recurso oscuro y pide un material liquid glass que deje trabajar al fondo abstracto, con encendidos/apagados claramente perceptibles. Se elimina la superficie de tinta: el panel usa vidrio cálido al 24 %, desenfoque de fondo, borde luminoso y reflejo. Un pigmento de fondo estático coral/malva aporta profundidad detrás del vidrio sin alterar el motor de flotación, la velocidad de las partículas ni los personajes.

La secuencia sigue teniendo tres escenas y dos avances:

- Observación: se ven las tres expresiones sobre vidrio.
- Pregunta: durante la frase de Úrsula, cada expresión toma el acento coral y una luz difusa; las otras bajan al 25 %. La iluminación sigue el orden de la frase y termina en visión conjunta. Al entrar Rutina, el conjunto baja al 38 % para dar paso a la llamada; con la explicación vuelve el contraste conjunto.
- Decisión: la ficha se realza sobre el vidrio. Evidencia recibe énfasis al entrar. Después se ilumina la fila de fecha/revisión mientras el resto de campos se atenúa, y finalmente la conclusión queda al 100 % mientras el registro baja al 50 %. Ningún avance adicional.

Los estados de foco están vinculados a las intervenciones; la frase larga de tres descripciones tiene tres acentos internos temporizados. Los temporizadores pertenecen al recurso y se cancelan al navegar. En movimiento reducido se conserva la jerarquía sin recorrido animado de acentos.

| Before | After | Why |
| --- | --- | --- |
| Recurso oscuro y opaco | Liquid glass cálido y fondo visible | Seguir la dirección material solicitada |
| Solo un cambio suave de color | Elemento activo al 100 %, secundarios al 25 %, halo coral | Hacer inequívoco el foco durante el diálogo |
| Ficha uniforme al final | Registro, revisión y conclusión reciben el foco por turnos | Dirigir la lectura sin añadir avances |
| Todo mantiene intensidad tras explicarse | Atenuación explícita y reversible | Dar espacio al siguiente argumento |

Comprobación: pase real sin errores de página, con muestra de foco `[0.25,1,0.25]`; vidrio calculado `rgba(255,253,248,0.24)` y `blur(12px) saturate(1.25)`. Cierre con registro al 50 % y conclusión al 100 %. Al cambiar al capítulo 4 desaparece el recurso y no quedan estados de atención pendientes. Pruebas a 1280×720 y 1920×1080, incluyendo movimiento reducido; 37 tests correctos.

Capturas: `output/playwright/capitulo03-glass-entrada.png`, `capitulo03-glass-foco.png`, `capitulo03-glass-registro.png`, `capitulo03-glass-cierre.png`. Vista local: `/dist/recorrido/?revision=17#capitulo-3/0`. El ensayo sigue limitado al capítulo 3; las máscaras y luces específicas de fotografías y otros diagramas se desarrollarán con sus recursos.

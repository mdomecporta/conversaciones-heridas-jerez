# Capítulos 7 y 11 · realización y consolidación · revisión 19

Se extiende el sistema ensayado en el 3 a dos recursos distintos, conservando el contenido del guion, la paleta, los personajes, la llamada de Rutina y tres escenas/dos avances. La carpeta de Evidencia no se integra: sigue el respaldo existente.

## Capítulo 7 · El cultivo por si acaso

Vista: `/dist/recorrido/?revision=19#capitulo-7/0`.

| Escena | Composición | Atención |
| --- | --- | --- |
| Inicial | Fotografía del material y solicitud docente con motivo vacío | Material y pregunta antes de obtener un resultado |
| Primer avance | Se conserva la misma fotografía y solicitud | Durante la llamada atiende a Rutina; la explicación de María del Mar desplaza el foco a la solicitud vacía |
| Segundo avance | El material se reduce; se abren cuatro preguntas y un recorrido de interpretación | Dos pares de preguntas se destacan durante la réplica de Herida; Evidencia y la última frase llevan al resultado y su interpretación |

No se rellena un motivo para una paciente inventada. Las preguntas no tienen respuestas “sí/no” ni disparan automáticamente una toma de muestra. La condición de valoración conjunta se mantiene. El resultado positivo no se representa como un informe ni se convierte en una indicación automática de antibiótico. El texto de esta condición queda legible en el último foco.

La fotografía se usa como respaldo disponible, sin modelo 3D nuevo: Whispyhistory, Wikimedia Commons, CC BY-SA 4.0. Se conserva la imagen sin recorte o filtros de color; la atenuación del material en la decisión es una operación de composición sobre una foto de equipo, no sobre una lesión. La elección del medio se remite al laboratorio; el recurso no enseña una técnica.

## Capítulo 11 · Limpiar no es regar

Vista: `/dist/recorrido/?revision=19#capitulo-11/0`.

| Escena | Composición | Atención |
| --- | --- | --- |
| Inicial | Modelo conceptual y cuatro anotaciones externas | Solo lecho y su marcador toman el primer plano |
| Primer avance | El mismo modelo; Rutina entra por llamada | El turno “¿Y el borde y la piel de alrededor?” activa borde → piel perilesional → circundante; la explicación reúne el conjunto |
| Segundo avance | Se conserva el modelo; los cuatro puntos completan un recorrido | Marcadores y leyenda acompañan la frase de Herida; al cierre queda el conjunto, Evidencia y la conclusión |

Se reutiliza el modelo conceptual de `wound-zones`, ya identificado como generado. Las posiciones proceden de su `walkthrough` en el catálogo de recursos, no de un diagnóstico ni de un seguimiento de una paciente. Los marcadores son gráficos independientes; no se modifica la textura, el color o la geometría del tejido. No hay agua que esterilice ni simulación de cierre. La última frase sobre el suero frío se conserva como enlace al capítulo siguiente.

## Base compartida

Los tres ejemplos (3, 7, 11) comparten ahora exterior de conversación simplificado, glass del recurso, fondo profundo, conclusión única al intervenir Evidencia y estados de atención. Las composiciones internas permanecen distintas: comparación tipográfica, fotografía con solicitud y modelo con anotaciones.

Los recursos mantienen sus elementos al cambiar de escena, sin intercambiar fotografías o crear figuras nuevas. Las secuencias de foco pertenecen a las intervenciones y sus temporizadores se cancelan al navegar. En movimiento reducido se ofrece la vista conjunta, sin recorrido animado de acentos.

Rutina 7 utiliza las variantes específicas ya disponibles. En 11 permanece el retrato neutro con etiqueta de pose pendiente: las propuestas del chat paralelo no se dan por aprobadas.

| Before | After | Why |
| --- | --- | --- |
| Foto de torunda junto a una lista genérica | Material y solicitud que pasa de motivo vacío a preguntas e interpretación | Relacionar la muestra con una decisión |
| Modelo con lista sin correspondencia espacial | Cuatro marcadores enlazados a sus anotaciones | Guiar la mirada por el mismo territorio |
| Mismo ritmo de cuadrícula para recursos diferentes | Gramática de atención común con composiciones propias | Consolidar el estilo sin uniformar el contenido |

## Verificación

Compilación y 37 tests correctos. Se comprobaron las seis vistas a 1280×720 y la secuencia 0 → 1 → 3. No hay desbordamiento de solicitudes o leyendas fuera del contenedor. Pase animado sin errores de página: muestra de foco de piel perilesional `[0.3,0.306,0.994,0.3]`. Salto al capítulo 12 durante el recorrido elimina el recurso anterior y sus estados. El capítulo 7 recorre preguntas por pares y termina en interpretación. Filtros de imagen: `none`.

Capturas en `output/playwright/capitulo7-19-escena*.png`, `capitulo11-19-escena*.png`, `capitulo11-19-foco-piel.png`, `capitulo7-19-foco-preguntas.png` y `capitulo7-19-interpretacion.png`.

Las nuevas cabeceras y notas de recurso son propuestas editoriales, no frases clínicas validadas. Guion y condiciones completos permanecen en P y R. Trabajo local, sin publicación.

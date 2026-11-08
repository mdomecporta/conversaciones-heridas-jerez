# Recorrido completo · revisión 9

El sistema aprobado del capítulo 10 se aplica a los 22 capítulos. `/recorrido/` empieza en la apertura; `/piloto/` mantiene la entrada directa al 10. Ambas entradas comparten el mismo motor, guion, recursos y navegación. La presentación anterior sigue en `/` y `/ver/`; esta revisión no se ha publicado.

## Contrato de capítulo

Tres escenas, dos avances: recurso desplegado y pregunta de entrada → situación y conversación → decisión con Evidencia. El siguiente avance abre el capítulo siguiente. El título se transforma en su panel, Úrsula se desvanece y reaparece sobre el chat, y Rutina siempre llega mediante llamada. Se conservan sonidos, escritura, escucha, cristal, partículas, flotación intermitente y movimiento reducido.

Los tres bloques editoriales originales del guion permanecen: los bloques 2 y 3 se encadenan dentro de la tercera escena. La apertura y el cierre tienen una agrupación propia para respetar el relato. Todas las frases de María del Mar y las réplicas validadas se extraen del guion. P muestra las notas de la escena y el texto completo del capítulo, incluidos condiciones y desarrollos. No se convierte una animación en prueba de un resultado clínico.

| Before | After | Why |
|---|---|---|
| Capítulo 10 montado y otros capítulos como texto | 22 capítulos visuales y navegables | Poder revisar el recorrido completo dentro del diseño aprobado. |
| Recurso único del piloto | Recursos propios por tema | Dar una función concreta al material de cada escena. |
| Índice que abría guiones | Selector de actos con salto a cualquier capítulo | Navegar directamente por el montaje. |
| Apertura y cierre solo redactados | Portada, Claustro, inmersión, presentación y regreso con contraportada | Dar entrada y salida al mundo de la herida. |
| Fuente del piloto fija | Respaldo y condiciones por capítulo, reserva compartida | Atribuir cada decisión a su documento sin mezclar los 47 puntos con las otras fuentes. |

## Recursos montados

| Capítulo | Recurso |
|---|---|
| 01 | Portada institucional y Claustro 3D; presentación; 47 puntos en seis apartados, 13 destacados; balanza de rutina y criterio. |
| 02 | Dos fotografías publicadas independientes, completas y con atribución; etiologías y valoración integral. |
| 03 | Descripciones incompatibles y ficha de registro comparable; RESVECH mencionado sin puntuación inventada. |
| 04 | Contornos sintéticos y línea de seguimiento, sin atribuir evolución a una paciente. |
| 05 | Ocho ramas de causa/actuación con condiciones de seguridad. |
| 06 | Tres heridas esquemáticas, continuo de infección, signos y alcance del modelo de biofilm. |
| 07 | Torunda fotografiada y cuatro preguntas; indicación e interpretación contextual. |
| 08 | Resistencias, sensibilización y causa pendiente; réplica validada conservada. |
| 09 | Pauta con cuatro preguntas y revisión condicionada de la plata. |
| 10 | Modelo de piel y bifurcación aprobados en el piloto. |
| 11 | Modelo de zonas con lecho, borde, piel perilesional y circundante. |
| 12 | Esquema de fuerza y preparación; cifras con el contexto del DT XVII. |
| 13 | Talón conceptual y semáforo de condiciones, sin autorizar técnicas por color. |
| 14 | Dos caminos: objetivos de confort y diagnóstico pendiente. |
| 15 | Motivo, prioridad, datos y retorno de la consulta; sin inventar un circuito local. |
| 16 | Recreación de vida cotidiana y cuatro prioridades docentes. |
| 17 | Pacto vertical de seis puntos, sin un tiempo universal de analgesia. |
| 18 | Opciones, preferencias, acuerdo y revisión; estudio pequeño contextualizado. |
| 19 | Recreación de cuidados compartidos, comprensión y continuidad. |
| 20 | Síntomas y objetivos de alivio; medidas condicionadas y menor traumatismo. |
| 21 | Participación con función e influencia; Patient Voices identificado como iniciativa. |
| 22 | Diez recordatorios en tres grupos, tres preguntas, regreso al Claustro y contraportada. |

Las fotografías clínicas no se recortan ni se retocan. Las recreaciones y modelos están identificados. Los créditos, procedencia y licencias de las imágenes se consultan en R, junto a las fuentes. Se reutilizan las variantes disponibles del avatar aprobado; no hay GLB de Rutina ni nuevos encargos de generación. Las variantes específicas pendientes y los efectos particulares de los recursos siguen siendo un pulido por capítulo, no condiciones para navegar por todo el montaje.

## Apertura, cierre y fuentes

La apertura presenta primero portada y Claustro, después Úrsula; la primera pulsación introduce la preparación documental y la segunda, a Rutina mediante llamada. Los 47 puntos proceden exclusivamente del GNEAUPP XIV: 13 se vinculan a las situaciones tratadas. Infección y antimicrobianos, limpieza y dolor, persona y objetivos completan el origen de la preparación. La reserva contiene 13 referencias documentales, independientes del recuento de puntos.

El Claustro reutiliza la reconstrucción existente con un puente local de reproducción y pausa. No modifica el prototipo original ni usa servicios externos. La portada y contraportada institucionales se conservan completas. El viaje se puede completar con el avance; el movimiento reducido evita la inmersión animada. Si el 3D no está listo, la portada da paso al contenido sin bloquearlo.

En el cierre, Rutina se jubila, Evidencia permanece y el recurso se recoge en tres preguntas. La última frase queda en pantalla antes de la salida automática; un avance permite salir antes. El viaje vuelve al Claustro y acaba en la contraportada. No se representa que Úrsula cicatrice por haber concluido la charla.

## Navegación y compilación

- Espacio, →, PageDown y clic: avanzar. ←, PageUp y clic en el extremo izquierdo: volver, también entre capítulos.
- Nombre del acto con chevron: elegir acto y capítulo visual.
- P: frases de María del Mar, guion completo y condiciones. R: fuentes, imágenes y 47 síntesis. Escape: volver desde un diálogo.
- Inicio: repetir la entrada del capítulo. Fin: decisión. F: pantalla completa.
- `#capitulo-13/2`: tercera escena del capítulo 13. Los antiguos `#1`, `#2` y `#3` del piloto conservan compatibilidad.
- `npm run build:piloto`: compila las dos entradas y sus dependencias. `npm run build`: incluye también la presentación anterior.

## Verificación

Recorridas las 66 escenas a 1280 × 720 y 1920 × 1080 con movimiento reducido: sin desbordamientos de conversación, recursos o explicación. Tras corregir la ruta del import map del Claustro, la segunda pasada completa no registró errores JavaScript de la aplicación. Comprobados en movimiento normal el Claustro 3D, la selección de 47/13 en seis apartados, fuentes y orden de la llamada de Rutina. La reserva ofrece las 13 referencias y las 47 síntesis.

Las 34 pruebas pasan y la compilación completa termina correctamente. Las pruebas de extracción verifican que no falten frases de María del Mar ni réplicas validadas, que existan los avatares y que los 13 puntos activos remitan a capítulos con condiciones. Capturas de capítulos, fuentes y Claustro en `output/playwright/recorrido-*.png`.

El ensayo de duración y la prueba en el proyector siguen pendientes. El estado de cotejo clínico es el de la matriz de procedencia; implementar el recorrido no transforma sus pendientes en verificaciones realizadas. No se han subido cambios a GitHub ni a Netlify en esta revisión.

# Apertura del Claustro · revisión 12

La portada institucional y los paneles del Claustro se recuperan como prólogo manual. El enlace `/recorrido/` sin fragmento inicia la secuencia; `/piloto/` sigue abriendo el capítulo 10.

1. Estado inicial: portada institucional original completa, sin retocar, dentro de un panel glass con margen, padding y radio, sobre el Claustro. No avanza sola.
2. Primer avance: se retira la portada y aparecen aniversario, fechas, marca nueva de la comisión y mapa del área sanitaria. La cámara gira suavemente unos 16 grados alrededor del patio, durante 1,8 segundos.
3. Segundo avance: se retiran los paneles y seguimos a la entidad como gota/esfera deformable, sin cara. Caída al agua, ondulación y refracción, pigmento y micropartículas. El recorrido se programa en 4600 ms, con finalización de respaldo a 4750 ms.
4. Llegada automática: la esfera se funde con el cuerpo líquido de Úrsula, flotando en el centro sobre el fondo de la presentación. Toma forma y abre los ojos gradualmente. Aparecen «Hola, soy Úrsula», la pregunta de la mesa, el tema de la charla y el nombre de María del Mar.
5. Tercer avance: Úrsula se traslada suavemente a su posición de conversación y continúa la presentación. El saludo corto no se repite en pantalla; la frase original completa sigue en el guion y en P. Después continúan preparación documental y presentación de **Doña Rutina y Doña Evidencia**. «Criterio» no aparece como personaje.

| Before | After | Why |
|---|---|---|
| La portada desaparecía por tiempo y se cargaba la vista de prueba sin sus paneles | Prólogo manual con portada y paneles recuperados | Respetar la portada obligatoria y el control de la ponente. |
| Ruta de 34 segundos con túnel, células y fibras | Ruta de 4,6 segundos que sigue una gota y cambia agua por pigmento y partículas | Entrar en el mundo de la herida sin representar un proceso de cicatrización. |
| Corte al personaje ya formado | Superposición progresiva entre esfera y entidad líquida; cara revelada gradualmente | Mantener continuidad de forma, posición y color. |
| Cambio de posición mediante desaparición genérica | Traslado de 1700 ms calculado desde el encuadre real | Evitar un salto del centro a la conversación. |
| Balanza «Rutina / Criterio» | «Doña Rutina / Doña Evidencia» | Mantener los personajes del relato. |

## Recursos conservados

- `assets/institutional-open.jpg`: portada obligatoria, copiada sin edición.
- `prototipos/claustro-3d/comision-blanco.png`: marca blanca aprobada de la comisión.
- `prototipos/claustro-3d/mapa-ags-luz.svg`: mapa del Área de Gestión Sanitaria, con sus colores y animación originales.
- Arquitectura de `prototipos/claustro-3d/scene.js`: conserva el prototipo original. El compilador utiliza únicamente su arquitectura y añade `recorrido-inmersion.js`; no modifica la portada de estudio.
- Renderizador de Úrsula: se conserva la cara aprobada cuando `faceReveal=1`. La opacidad de la cara y la apertura de ojos se controlan solo para el despertar; en el resto del recorrido se restaura su valor normal.

El giro y el viaje usan la posición real de cámara como origen. La inmersión se mide con reloj monotónico, sin prolongarla cuando baja la frecuencia de cuadros. El cambio de escena del patio al agua se produce durante la refracción; no utiliza una imagen fija de splash ni un vídeo. El personaje que guía la ruta es una esfera 3D deformable; no tiene ojos ni boca. El fondo submarino se vuelve pigmento, sin hematíes ni fibras que puedan leerse como curación.

La presentación conserva los controles existentes. Inicio repite el prólogo en la apertura. Retroceder desde la presentación permite volver a la portada de la charla y a los paneles. Si se completa antes una transición con el avance, se reconstruye el estado sin dejar una cámara activa detrás de otros capítulos. P muestra instrucciones del momento actual del prólogo. Con movimiento reducido se mantienen los pasos, evitando la persecución animada.

## Comprobación

En una carga nueva se observaron los estados `cover → cover` tras una espera, `panels` con el primer avance y `diving` con el segundo. Durante el viaje, `faceReveal=0`. Ruta 3D medida en 4601 ms; paso al fondo de la presentación en 4616 ms (4659 ms incluyendo espera del navegador de pruebas). Apertura de ojos y texto de portada posteriores a esa llegada. Tercer avance: traslado de 1700 ms y conversación sin repetir «Hola, soy Úrsula».

Logos y mapa cargados desde los archivos locales. Las imágenes de la portada se conservan completas. Capturas en `output/playwright/intro12*.png`. La revisión sigue en local; no se han generado imágenes ni publicado cambios en Netlify.

## Revisión 13 · continuidad y entrada por la superficie

La guía utiliza ahora el mismo shader líquido del recorrido con ojos desactivados, proyectado según su posición y profundidad 3D. La esfera física queda invisible y solo sirve de referencia espacial. La cámara sube en arco, se coloca sobre el vaso y desciende verticalmente en x=1, z=0,55. Se ha comprobado en navegador que, al bajar del borde, sigue dentro del vaso (muestras y=0,536 e y=0,421). Al estar dentro del agua, se conserva la continuidad de posición y mirada. La separación respecto a Úrsula evita que su cuerpo ocupe toda la pantalla durante el salto.

Giro inicial más oscilación rotatoria durante la espera; hilos curvos y gotas aceleradas en la fuente; relieve de piedra más contenido. Mapa y denominación blancos quedan libres sobre el Claustro, sin panel verde. La comisión conserva el suyo. El Claustro sigue siendo una reconstrucción aproximada, no un levantamiento arquitectónico.

Pruebas visuales a 1280×720: `output/playwright/intro13-paneles.png`, `intro13-salto.png`, `intro13b-agua.png`, `indice13-libro.png`. La primera pasada midió 4619 ms hasta llegada; presupuesto conservado en 4600 ms con finalización de respaldo a 4750 ms. Sin errores de página en las dos pasadas de la revisión. Índice probado cambiando de acto y saltando directamente al capítulo 3: llega a su primera escena sin repetir la entrada. Los 37 tests pasan.

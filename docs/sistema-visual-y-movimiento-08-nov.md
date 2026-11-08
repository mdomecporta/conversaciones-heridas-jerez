# Consolidación de estilo y movimiento · revisión 18

## Qué se consolida

Conservar identidad, paleta, personajes y tres escenas/dos avances. La aplicación de focos sigue ensayándose en el capítulo 3. La corrección de portada → título es común a los capítulos clínicos; apertura y cierre mantienen su estructura independiente.

### Materiales con función

- **Mundo:** pigmentos grandes y partículas en profundidad. El fondo debe leerse a través del vidrio; no competir con texto, fotografías o rostros.
- **Portada de capítulo:** pigmento coral/malva con presencia, sobre el mismo material base del título. Conserva padding y radio durante la transformación.
- **Orientación:** acto y título como referencia discreta. Su intensidad puede bajar durante el argumento sin desaparecer la navegación.
- **Voz:** bocadillo con contraste y estados claros; personaje libre de recortes. Evitar un panel vacío alrededor de la conversación.
- **Recurso:** vidrio contenedor con composición propia. Texto, fotografía, modelo y diagrama necesitan tratamientos internos distintos; no son una cuadrícula universal de cards.
- **Evidencia:** intervención documental con sus fuentes y condiciones. La carpeta sigue como estudio separado hasta retomarla.

### Estados de atención

Usar una intención dominante por momento: observar → preguntar → decidir. El recurso puede tener focos internos ligados a sus intervenciones. En el ensayo actual se combinan pigmento, luz local y atenuación reversible. El encendido no debe depender solo de que cambie un color muy suave.

La parte que se destaca permanece completamente legible; lo explicado pasa a segundo plano. Las condiciones necesarias para interpretar una conclusión no se retiran del respaldo. No aplicar cambios de tono, saturación o deformación a las fotografías clínicas: en ellas el foco se resolverá con marco, máscara de contexto o anotación exterior, manteniendo la imagen original.

### Movimiento con función

- Portada: lectura breve y retirada coordinada.
- Transformación: una misma superficie, sin cambios de material accidentales.
- Recurso: entra cuando el título ya ha dejado espacio.
- Conversación: aparece sobre el encuadre estable del recurso.
- Acento: se activa con el argumento y se detiene; nunca un carrusel automático permanente.
- Flotación: decorativa, ocasional y con amplitudes aprobadas; sin modificar tipografía ni personajes.
- Navegación directa: sin repetir toda la entrada; cancelar transiciones y temporizadores anteriores.
- Movimiento reducido: conservar jerarquía y contenido sin recorrido espacial.

## Corrección de la portada

Antes se interpolaba el fondo peach de la portada hasta el fondo malva del panel de título mientras cambiaban sus dimensiones. El recurso comenzaba su aparición solo 450 ms después de iniciarse esa transformación, con dos superficies glass solapadas. Esa combinación podía producir un lavado claro percibido como flash.

Ahora la base del vidrio es constante, `rgba(232,222,233,0.56)`. Un pigmento coral/malva independiente le da presencia a la portada y se desvanece gradualmente, sin animar `backgroundColor`. El reflejo blanco se reduce. El recurso espera 1100 ms desde el comienzo del pliegue y aparece cuando el título está prácticamente recogido.

Tiempos de entrada agrupados en `ENTRY`, en `revision.js`:

| Tramo | Tiempo |
| --- | --- |
| Lectura de portada | 2000 ms |
| Transformación hacia el título | 1800 ms |
| Entrada de recurso, desde el inicio de la transformación | Retraso de 1100 ms, duración de 1100 ms |
| Incorporación del chat, desde el inicio de la transformación | A los 1850 ms, fundido de 850 ms |
| Inicio de la primera intervención | 500 ms después de incorporar el chat |

No se añaden avances. Espacio/flecha durante la entrada siguen permitiendo llegar directamente a la primera escena estable.

## Fondo

Se añade una veta amplia y tenue en el plano profundo, con malva y piel de la paleta existente. Se desplaza con el velo que ya existía, sin un nuevo ciclo independiente, sin más partículas y sin cambiar la flotación de paneles. Se busca variedad de profundidad y refracción aparente en el glass, no más ruido.

## Revisión

| Before | After | Why |
| --- | --- | --- |
| Portada con contraste escaso | Pigmento propio coral/malva sobre vidrio | Dar presencia a la entrada de capítulo |
| Interpolación de dos fondos durante el pliegue | Base constante y retirada gradual de pigmento | Evitar el cambio de material y lavado blanco |
| Recurso aparece pronto sobre la portada grande | Entrada solapada solo al final del pliegue | Mantener continuidad sin superposición excesiva |
| Fondo principalmente de manchas difusas | Veta tenue en el plano profundo existente | Dar lectura material al vidrio |

Pase de navegador a 1280×720 sin errores de página. Cuatro muestras conservan exactamente la misma base del vidrio; no hay keyframes de `backgroundColor` en el panel. El pigmento pasa de 1 a 0 y el recurso de 0 a 1. Capturas `output/playwright/entrada18-portada.png`, `entrada18-pliegue.png`, `entrada18-transicion.png`, `entrada18-recurso.png`. Compilación y 37 tests correctos.

## Siguiente consolidación

1. Validar esta entrada y el recurso textual del capítulo 3 como referencia de jerarquía y movimiento.
2. Probar el lenguaje de atención en el capítulo 7 (fotografía y solicitud) y 11 (modelo por zonas), sin copiar su composición ni añadir clics.
3. Revisar los tres juntos en proyección: tamaño de lectura, contraste activo/inactivo, materiales y ritmo. Cerrar reglas compartidas antes de extender al resto.

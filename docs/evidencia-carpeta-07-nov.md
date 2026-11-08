# Evidencia · carpeta documental para validación

Prototipo: `/prototipos/evidencia-carpeta/?revision=2`.

La usuaria descarta lente, pliego y constelación. Solicita un objeto-herramienta inspirado en las dos imágenes de carpeta: volumen, hojas dentro, activación, check con sonido y despliegue de un mensaje con resumen y fuentes. Aclara que Evidencia debe tener paleta propia; azules y verdes armonizados con el resto, sin reutilizar salvia/ocre/marfil como identidad dominante.

## Propuesta ejecutada

Carpeta azul petróleo con frente translúcido verde agua, dos hojas y check menta sobre un pequeño medallón. Reflejos cálidos y sombra compartida con el mundo de la presentación. La ficha clara tiene un matiz azulado y texto petróleo: una frase principal, su condición y las marcas/citas ya existentes del capítulo 10.

El material se construye en HTML/CSS/SVG para que el movimiento pertenezca al objeto real y pueda integrarse después en el motor. No se ha generado una imagen raster de la carpeta; las capturas muestran el prototipo que se ejecuta.

Secuencia de una única entrada automática:

1. Reposo: carpeta y nombre; mensaje recogido, sin check.
2. A los 300 ms, ligera apertura del frente y elevación de hojas.
3. A los 950 ms, aparece el check trazado y suena un aviso de dos notas.
4. A los 1450 ms, la ficha sale del interior y se despliega en 900 ms. Después queda estable.

El audio se habilita al pulsar el botón de reproducción. Los botones de estados son solo controles de esta vista de validación: no son nuevos avances del capítulo. El check pertenece a la verificación documental; la condición sigue junto a la frase.

## Alcance

El iframe usa la presentación compilada como contexto y sustituye solo el DOM temporal de Evidencia; no se ha cambiado el motor ni publicado el diseño. Los archivos de las tres propuestas anteriores se conservan como estudio descartado. La paleta está aislada en `carpeta.css` y se inyecta en el contexto; al integrar se trasladará a `tokens.css`.

| Before | After | Why |
| --- | --- | --- |
| Ficha editorial con adorno | Carpeta volumétrica, hojas y bolsillo | Representar una herramienta reconocible |
| Paleta cercana a otros paneles | Petróleo, azul y verde agua, con reflejos cálidos | Distinguir Evidencia sin romper el conjunto |
| Entrada por opacidad | Activación → check/sonido → despliegue | Hacer visible la función y el origen del mensaje |

## Comprobación

La ficha desplegada cabe en el espacio de Evidencia del escenario 16:9: borde inferior del mensaje a 704,6 px frente al borde del escenario a 740,5 px en la primera pasada. Sin errores de página; estados `verified` y `open` verificados. Capturas: `output/playwright/evidencia-carpeta-reposo.png`, `evidencia-carpeta-abierta.png`, `evidencia-carpeta-contexto.png`.

Pendiente: validar objeto, paleta y secuencia antes de integrarlo y probarlo con las otras fuentes y longitudes de frase.

## Revisión 3 · azul vivo y despliegue ascendente

Nueva indicación de la usuaria: acercarse al azul vivo y acabado moderno de la referencia, mantener la carpeta recta en reposo y situarla siempre en la esquina inferior. La ficha debe salir hacia arriba desde el bolsillo. Se cambia la paleta del estudio a azul/cian, con profundidad petróleo para texto; se reduce el relieve de los bordes y el giro permanente. Una reacción de 650 ms inclina el objeto como máximo 2° y termina recta antes del check. La ficha se revela desde el borde inferior y asciende; la carpeta permanece anclada al margen inferior de 3 cqh. La flotación del panel de Evidencia se desactiva en esta vista para conservar el anclaje.

Prueba de navegador sin errores: el transform final de la carpeta es `none`, se dispara una notificación y la ficha queda por encima del objeto, sin invadir el chat. A escala de escenario 1316×740: mensaje entre y=534,9 y 676,8; carpeta entre y=656,4 y 718,3; chat termina en y=492,4. Capturas `output/playwright/evidencia-carpeta-v3.png` y `evidencia-carpeta-v3-contexto.png`. Sigue siendo un prototipo aislado. URL: `/prototipos/evidencia-carpeta/?revision=3`.

| Before | After | Why |
| --- | --- | --- |
| Petróleo apagado y bordes con mucho relieve | Azul vivo/cian y vidrio más limpio | Acercar el objeto a la referencia solicitada |
| Inclinación permanente | Reposo recto; reacción breve que vuelve al origen | Estabilidad en la esquina inferior |
| Mensaje se abre debajo del objeto | Ficha asciende desde el bolsillo; objeto fijo abajo | Dar coherencia espacial al despliegue |

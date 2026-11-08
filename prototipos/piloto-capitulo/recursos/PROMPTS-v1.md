# Recurso de la escena 3 · v1

Generado con la herramienta integrada de imágenes el 4 de noviembre de 2026.

Dos PNG de 1536 × 1024. `piel-base-v1.png` es la base; `granulacion-v1.png` tiene canal alfa real y conserva el lienzo completo para superponerlo directamente sobre la base.

Usar idéntico tamaño, `object-fit: cover` y `object-position: 50% 50%` en ambas capas. No recortar el PNG transparente a su contenido. El tejido principal queda en la franja central inferior y fuera de la llamada. La esquina superior derecha se mantiene oscura. El recorte de apertura y el encuadre ancho conservan el lecho.

`../prueba-imagenes-v1.html` es una copia de comprobación del piloto. El original `../index.html` no se ha modificado. Esta prueba sustituye visualmente el SVG por las dos capas y simula la pérdida/recuperación de color del tejido; no integra las bacterias ni las gotas animadas del SVG original. Para la integración definitiva, conservar bacterias/gotas por encima de estas dos imágenes y eliminar solo la base/tejido antiguos del SVG. La leyenda de bacterias en la prueba pertenece al piloto original.

Se comprobó visualmente la superposición en el encuadre ancho con la llamada y su bocadillo; `encuadre-llamada-v1.png` muestra el resultado.

## Prompt de la base

```text
Use case: scientific-educational.
Create one final raster illustration, landscape 3:2 canvas (1536x1024 preferred). Principal resource for a Spanish educational presentation "El antiséptico no es champú". NO text.
Ilustración editorial científica de un corte transversal de piel con una úlcera crónica, vista lateral estricta, como una maqueta seccionada. Estilo 3D suave tipo maqueta de museo, no fotorealismo quirúrgico. Arriba fondo liso berenjena casi negro #22171a, sin degradados llamativos.
Abajo, capas de piel en sección: epidermis fina color piel cálida #efc3a6 a ambos lados, interrumpida en el centro por el borde de la herida; dermis granate rosado #b9584f a #5a2328 con textura orgánica suave. En el centro un lecho cóncavo poco profundo, limpio y VACÍO: una depresión visible en el tejido, no un agujero negro ni un hueco que atraviesa la piel. NO granulación, NO células, NO esferas, NO bacterias dentro: el tejido de granulación se superpondrá como otra capa después.
Composición precisa para resistir recortes animados: fondo oscuro vacío en el 40% superior. La superficie de la piel sana está aproximadamente en y=49% a los lados; los bordes descienden suavemente hacia un lecho cóncavo con fondo aproximadamente en y=66%, entre x=30% y x=66%; centro útil del lecho x=48%, y=59%. La depresión completa ocupa x=24% a x=72%. Corte frontal de dermis continúa hacia el borde inferior del lienzo. El centro y la franja y=49%-70% contienen toda la información importante. No detalle esencial en x>73%, y<58% porque ahí se tapa con una videollamada. No detalles esenciales en el 12% superior ni inferior. Piel continua a los bordes izquierdo y derecho, sin bloque flotante ni perspectiva isométrica.
Iluminación cenital suave, materiales mate con leve humedad en el lecho, formas legibles incluso a tamaño pequeño, paleta cálida coherente y elegante, sin sangre, sin instrumentos, sin frascos, sin etiquetas, sin flechas, sin texto, sin marco.
```

## Prompt del tejido

La base generada se usó como referencia visual.

```text
Use case: scientific-educational / compositing. The previous image is the exact registration reference, not an output background. Generate ONLY a transparent PNG overlay of healthy granulation tissue to fit the shallow concave central wound bed of that image.
Output canvas must be the SAME 1536x1024 landscape 3:2 canvas as reference. Preserve absolute alignment and scale: NO crop-to-subject, NO recentering, NO zoom. Everything except the tissue must be truly alpha-transparent. No skin, no dermis, no dark backdrop, no opaque shadow backdrop, no text.
Tissue: an organic carpet of many small softly rounded irregular granules (small organic spheres/lobules), glossy and moist, coral and salmon #f08a78 and #e8735f, healthy and alive, soft museum model 3D illustration matching reference lighting. Avoid a pile of loose marbles, bubbles, grapes, or a solid anatomical organ. Tiny fused irregular lobules form a shallow cohesive crescent cushion that hugs the wound depression.
Precise location: tissue spans approximately x=26% to x=71%, with its main body at x=31%-67%, y=58%-68%, thin upward taper at both lateral ends following the concave bowl. Bottom contour follows the visible lowest curved surface of the reference bed, around y=69% at center and y=61% at either end; upper contour a few percent above it, revealing the granules. Overall shallow horizontal concave crescent, NOT a tall mound. Leave the entire upper half and most lower third completely transparent. Soft top illumination; subtle self-shading entirely within the tissue. Keep all tissue away from far right upper overlay area. This is one registered layer of a two-image animated illustration.
```

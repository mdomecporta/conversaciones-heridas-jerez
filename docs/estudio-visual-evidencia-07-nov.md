# Evidencia · estudio visual para validación

Prototipo aislado: `/prototipos/evidencia-comparativa/`.

Aclaración de la usuaria: Evidencia no debe parecer un asistente ni otra entidad como la Herida. Se compara una intervención documental con tres tratamientos materiales, sin rostro, boca, estados de escucha, mensajes de chat ni saludo. “Lente viva” se concreta como **lente documental**, integrada en la ficha y con un reflejo de entrada que se detiene.

- A: lente documental; vidrio claro con matiz salvia/malva, relieve óptico y trazos documentales. No es una lupa con mango ni una esfera animada.
- B: pliego de evidencia; hoja marfil, margen oliva y segundo plano salvia. La apertura pertenece al documento.
- C: constelación documental; marcas de las fuentes conectadas sobre la conclusión. Ocupa más altura; especialmente útil para explicar el origen plural del respaldo.

Las tres conservan conclusión, condición y referencia del capítulo 10, obtenida del recorrido compilado. Las marcas proceden del registro ya existente. Los estados de llegada/fuentes/condiciones son controles del estudio para comparar la secuencia visual; no añaden avances a los capítulos. La vista integrada carga el recorrido en un iframe y modifica solo su DOM temporal, sin escribir el motor ni cambiar la presentación publicada. Audio desactivado en esta vista de estudio.

| Before | After | Why |
| --- | --- | --- |
| “Lente viva” podía sugerir otro personaje | Pieza óptica integrada en la ficha documental | Atender la aclaración de la usuaria |
| Descripción verbal de tres alternativas | Comparativa real en la misma escena y detalle ampliado | Validar forma, material y jerarquía con contenido real |
| Dependencia de un estado animado | Secuencia reproducible y estados consultables | Revisar legibilidad durante y después de la entrada |

Capturas en `output/playwright/evidencia-a-lente.png`, `evidencia-b-pliego.png`, `evidencia-c-constelacion.png` y `evidencia-a-contexto.png`. Comprobadas las tres fichas dentro del escenario 16:9; sin desbordamiento inferior. Sin errores de página en la comprobación final; estados fuentes → condiciones verificados. No se han generado bitmaps con IA: las imágenes de revisión son capturas de HTML/CSS/SVG, que permiten validar el material y movimiento que realmente se podría integrar.

Pendiente: elección visual de la usuaria. Después, adaptar la dirección elegida a fuente única, fuentes múltiples y condiciones largas antes de extenderla al recorrido.

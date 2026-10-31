# Conversaciones con una herida · presentación

Presentación proyectada generada desde `guion/GUION_PARA_MARIA_DEL_MAR.md`. El mapa del proyecto y las reglas sobre la herida están en `CLAUDE.md`; el diseño, en `docs/diseno.md`.

## Uso

```bash
npm run build   # genera dist/index.html (autónomo: fuentes, imágenes y herida incluidas)
npm test        # guion, recursos y entidad
npm run dev     # http://127.0.0.1:4173/
```

`dist/` no se edita a mano. La compilación se detiene si el guion deja una escena sin hilo, sin evidencia o sin enlace.

## Durante la presentación

- → / espacio: avanzar · ←: retroceder · ↑ ↓: escena anterior o siguiente · Inicio / Fin.
- **P**: ventana de ponente, sincronizada. Muestra lo que dice María del Mar en cada paso (también las explicaciones que no se proyectan), la réplica de la herida, la nota de pantalla, el paso siguiente, el respaldo y un cronómetro.
- **G**: recorrido para saltar a una escena. **F**: pantalla completa.
- `?guia` (o el botón «Guion» de los controles): guía informal para María del Mar, clic a clic, imprimible.
- Clic en el tercio izquierdo retrocede; en el resto, avanza. Los controles aparecen al mover el ratón.
- La dirección recuerda el punto: `#escena-6/3` es el paso 3 de la escena 6.

## Fuentes y recursos

Cada evidencia proyecta un titular, una síntesis, la fuente con su localizador y la condición que cambia la decisión, tal como las escribe el guion. Las imágenes proceden de `resources.json`, que conserva procedencia, licencia y créditos (detalle en `RECURSOS_VISUALES.md`). Ninguna fotografía clínica representa a una paciente del relato y las ilustraciones no permiten diagnosticar por aspecto.

## Pendiente

- Revisión clínica final y ensayo de duración con la ponente.
- Documento para el público con las 21 actuaciones y la bibliografía (existía en la edición anterior a partir de otros textos).
- Publicación en Netlify con acceso protegido y guardado compartido de las notas de la ponente.
- Prueba en el proyector real.

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

## Publicación en Netlify

El sitio publicado tiene dos entradas:

- **`/`** pide contraseña. Da acceso a la presentación completa, la guía de María del Mar (`/?guia`), la ventana de ponente y las notas.
- **`/ver/`** es el enlace para compartir, sin contraseña. Muestra solo la presentación, sin guía, ponente ni notas, y sin las explicaciones que ella no proyecta.

Las notas se guardan solas en Netlify Blobs, por escena y por sección (la pregunta y el hilo, la conversación con la herida, imágenes y recursos, evidencia, otros), con imágenes adjuntas. `/?notas` las reúne todas por orden del recorrido y permite descargarlas en Markdown para aplicarlas. `/salir` cierra la sesión.

### Puesta en marcha (una vez)

1. En Netlify, **Add new site → Import an existing project** y elegir el repositorio de GitHub. La configuración ya está en `netlify.toml`: compila con `npm run build` y publica `dist/`.
2. En **Site configuration → Environment variables**, añadir:
   - `SITE_PASSWORD`: la contraseña de entrada. Solo se escribe aquí, nunca en el código.
   - `SESSION_SECRET` (recomendado): una cadena aleatoria larga, por ejemplo la que da `openssl rand -hex 32`. Firma las sesiones; si se cambia, todas las sesiones se cierran.
   - `COMPARTIR=no` (opcional): cierra también `/ver/`.
3. Volver a desplegar para que se apliquen las variables.

Las sesiones duran 30 días. Netlify Blobs no requiere configuración aparte.

### Probarlo en local

```bash
npm run build
SITE_PASSWORD=prueba npm run local   # http://127.0.0.1:8888/ · público en /ver/
```

Imita el sitio publicado (contraseña, `/ver/` y notas), pero las notas se guardan en memoria y se pierden al cerrarlo.

## Fuentes y recursos

Cada evidencia proyecta un titular, una síntesis, la fuente con su localizador y la condición que cambia la decisión, tal como las escribe el guion. Las imágenes proceden de `resources.json`, que conserva procedencia, licencia y créditos (detalle en `RECURSOS_VISUALES.md`). Ninguna fotografía clínica representa a una paciente del relato y las ilustraciones no permiten diagnosticar por aspecto.

## Pendiente

- Revisión clínica final y ensayo de duración con la ponente.
- Documento para el público con las 21 actuaciones y la bibliografía (existía en la edición anterior a partir de otros textos).
- Conectar el sitio de Netlify y definir las variables de entorno (ver «Publicación en Netlify»).
- Prueba en el proyector real.

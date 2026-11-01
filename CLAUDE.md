# Conversaciones con una herida

Presentación de María del Mar Candil Ramón para las IV Jornadas Comisión Heridas Jerez (19 de noviembre de 2026): «¿Es posible cicatrizar todas las heridas?» · «Qué no hacer en heridas crónicas». Una herida (personaje abstracto) conversa con la ponente a lo largo de 13 escenas: 11 actuaciones, el regreso al carro y el cierre. La charla dura unos 25 minutos.

El punto de partida son las 47 recomendaciones de *Qué no hacer en heridas crónicas* (GNEAUPP, DT XIV): la charla trae las rutinas que aparecen en cualquier visita de cura, ordenadas en los cuatro momentos de la visita, y las completa con las otras cinco guías. Las 47 están en la reserva «Por si preguntan», al final del guion.

Este repositorio contiene todo lo vigente. `AGENTS.md` es un enlace a este archivo.

## Mapa

```
guion/GUION_PARA_MARIA_DEL_MAR.md   fuente de todos los textos
docs/diseno.md                      dirección de diseño vigente
template.html                       esqueleto de la página
tokens.css                          paleta, tipografía y movimiento (única fuente)
escena.css                          composiciones de los tres mundos
escena.js                           motor: pasos, herida, ponente (?ponente), guía (?guia), notas (?notas), panel de preparación (N)
escena-recursos.js                  lo que trae la herida en cada escena
entity.js                           API Presence (su renderizador de membrana no se usa)
entity-liquid.js                    cuerpo de la herida: líquida, tinta «Sangre y piel»
resources.json, assets/             imágenes con créditos y zonas, fuentes, portadas institucionales
scripts/guion.mjs, scripts/build.mjs  lector del guion y compilación a dist/index.html y dist/ver/ (pública)
netlify/                            contraseña (función de borde), API de notas, adjuntos y cambios de texto (Netlify Blobs)
scripts/servidor-local.mjs          imita el sitio publicado en local (npm run local)
archivo/edicion-30-octubre/         edición anterior; no usar como referencia
```

Fuera del repositorio, en la carpeta del proyecto: `bibliography/` (las seis guías en PDF y enlaces al guion), `referencias/` (portadas obligatorias y presentación de partida) y `archivo/` (material antiguo; no usar como referencia).

## Trabajo habitual

- `npm run build` genera `dist/index.html`, autónomo. Si el guion deja una escena sin hilo, sin evidencia o sin enlace, se detiene y lo dice. `npm test` comprueba guion, recursos y entidad. `npm run dev` sirve en http://127.0.0.1:4173/.
- Los textos se cambian en el guion y se recompila. La composición de los recursos está en `escena-recursos.js`; los colores, solo en `tokens.css`.
- En la presentación, **R** abre la reserva con las 47 recomendaciones por apartados (← → apartado, 1–6, Esc vuelve al mismo paso); también desde la ventana de ponente. Sus textos están en la sección «Reserva» del guion; las marcadas «En la charla: escena N» deben citarse en el respaldo de esa escena (`npm test` lo comprueba).
- La dirección admite `#escena-6/3` (escena 6, paso 3). `?ponente` abre la ventana de ponente (diapositiva en vivo y la siguiente); `?guia`, la guía de María del Mar; `?notas`, todas las notas y cambios de texto.
- En la presentación, **N** abre el panel flotante de preparación: notas por sección con imágenes y «Cambiar textos», que guarda «original → nuevo» y lo aplica al cargar (también en `/ver/`). Para consolidar: descargar desde `?notas`, aplicar los cambios al guion y borrarlos.
- Publicado: `/` pide la contraseña de `SITE_PASSWORD` (variable de entorno de Netlify, nunca en el código); `/ver/` es el enlace público sin notas ni guion privado. Detalles en el README.

## La herida

- Es la entidad **líquida «Sangre y piel»**: `ENTITY_RENDERER="liquid"`, `ENTITY_VARIANT=3`, `ENTITY_INK=1`. Lo fijan `scripts/build.mjs` y la zona de `template.html`. El valor por defecto de `entity.js` es la membrana antigua: no usarlo.
- No modificar `entity.js` ni `entity-liquid.js` salvo que se pida expresamente.
- Cambia de sitio disolviéndose y condensándose (o saliendo y entrando por los lados), sin horizonte, suelo ni rebotes.

## Diseño en tres mundos

- **Progreso:** panel nocturno con el recorrido y el hilo A revisar → Nos preguntamos → Nos llevamos. La actuación se tacha al aparecer la pregunta. El aprendizaje entra en el hilo y no se repite en el espacio principal. Cada momento tiene su pigmento (coral, ámbar, malva, salvia).
- **Conversación:** burbujas en Figtree. La herida va a la izquierda, en piel y coral; María del Mar, a la derecha, en blanco. Sus frases cortas se proyectan como disparador; las explicaciones largas solo aparecen en la ventana de ponente.
- **Evidencia:** hoja ocre y oliva con titular en Fraunces, fuente y condición.

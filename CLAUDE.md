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
carro/                              carro de curas 3D (carro.js: modelo y API; modelos/: GLTF de Sketchfab, CC BY 4.0)
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
- Cada actuación tiene tres pasos (A revisar con su recurso; Nos preguntamos con su historia, `historia` en `escena-recursos.js`; Nos llevamos con la evidencia y el aprendizaje) y, a la derecha bajo la herida, solo el intercambio del paso actual (el historial completo está en la ponente y la guía). Antes de cada actuación, también la primera de cada bloque, una transición (`#paso-N`) con la herida en grande. La conversación de cada paso habla de lo que se ve en ese paso. La primera frase de la herida se dice en la transición y en la actuación aparece ya escrita. En pantalla solo habla la herida, en tono impersonal dirigido a enfermería; María del Mar dice sus frases en voz alta (las tiene en la ventana de ponente) y la herida espera su turno.
- El carro 3D se mejora en `carro/carro.js` (el prototipo de `prototipos/` ya no es la fuente). La presentación le pide qué mirar con `postMessage` (`{carro:{ids,vista}}`); los objetos que trae cada escena se indican con `type:'carro', ids:[…]` en `escena-recursos.js`. Three.js va copiado desde `node_modules` al compilar; `/carro/` es público en Netlify.
- La dirección admite `#escena-6/3` (escena 6, paso 3). `?ponente` abre la ventana de ponente: una tarjeta por paso hecha con el guion (la idea, lo que se ve, la condición de la evidencia, la conversación en orden y, plegado, lo que se desarrolla con sus palabras), la diapositiva en vivo y la siguiente, y el reloj con el tiempo previsto para 25 minutos (T lo pone a cero); `?guia`, la guía de María del Mar; `?notas`, todas las notas y cambios de texto.
- En la presentación, **N** abre el panel flotante de preparación: notas por sección con imágenes y «Cambiar textos», que guarda «original → nuevo» y lo aplica al cargar (también en `/ver/`). Para consolidar: descargar desde `?notas`, aplicar los cambios al guion y borrarlos.
- Publicado: `/` pide la contraseña de `SITE_PASSWORD` (variable de entorno de Netlify, nunca en el código); `/ver/` es el enlace público sin notas ni guion privado. Detalles en el README.

## La herida

- Es la entidad **líquida «Sangre y piel»**: `ENTITY_RENDERER="liquid"`, `ENTITY_VARIANT=3`, `ENTITY_INK=1`. Lo fijan `scripts/build.mjs` y la zona de `template.html`. El valor por defecto de `entity.js` es la membrana antigua: no usarlo.
- No modificar `entity.js` ni `entity-liquid.js` salvo que se pida expresamente.
- Cambia de sitio disolviéndose y condensándose (o saliendo y entrando por los lados), sin horizonte, suelo ni rebotes.

## Diseño en tres mundos

- **Composición:** hilo flotante a la izquierda (25 % del ancho), lo que acompaña al paso en el centro (48 %) y la herida con la conversación a la derecha (21 %). El regreso al carro usa las mismas zonas. Decisiones del 2 de noviembre en `docs/decisiones-02-nov.md`.
- **Progreso:** panel nocturno flotante con el recorrido y el hilo A revisar → Nos preguntamos → Nos llevamos. La actuación se tacha al aparecer la pregunta. El aprendizaje entra en el hilo y no se repite en el espacio principal. Cada momento tiene su pigmento (coral, ámbar, malva, salvia).
- **Conversación:** burbujas en Figtree, en piel y coral, solo de la herida. Habla a enfermería en impersonal («¿se escucha mi historia…?»), sin tutear a la ponente. Las frases de María del Mar no se proyectan: están en la ventana de ponente y en la guía.
- **Evidencia:** hoja ocre y oliva con titular en Fraunces, fuente y condición.

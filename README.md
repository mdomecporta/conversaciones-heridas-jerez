# Conversaciones con una herida

## Evolución del piloto: explicación y conversación

Las escenas 3, 4 y 5 desarrollan el nuevo sistema. Se abre directamente la primera de ellas: explicación clínica a la izquierda, conversación preparada con la herida a la derecha, fuentes junto al concepto y cinco preguntas en un índice persistente. El resto del guion se conserva como versión anterior de contenido; todavía no está extendido este sistema a las 24 escenas.

Los botones revelan respuestas y recursos preparados: datos iniciales, registro de intervenciones, capas de valoración, voz recreada de la persona y comparación de dos historias. El historial es temporal y se reinicia al regresar a una escena. La entidad muestra movimiento basal continuo (24 fps como máximo), cambia de estado y de voz, y respeta la preferencia de movimiento reducido y el control Pausar. Los cambios visuales son conceptuales, no signos diagnósticos. No se ha añadido voz grabada, vídeo ni fotografías clínicas.

En Preparar hay campos separados para explicación y conversación, y un acceso directo a Guion oral. Las tres escenas tienen un guion con qué decir, qué señalar, preguntas, transición y revisión pendiente. El HTML de revisión sigue excluyendo notas privadas.

Para conservar borradores anteriores sin sobrescribirlos, el piloto usa un almacenamiento local nuevo. Si existe una copia anterior en el mismo navegador y origen, Compartir / copia permite descargarla como proyecto editable. No se elimina el almacenamiento anterior. La versión nueva no sincroniza cambios entre equipos.

Primera versión de la presentación de María del Mar Candil Ramón para la mesa «¿Es posible cicatrizar todas las heridas?», IV Jornadas Comisión Heridas Jerez, 19 de noviembre de 2026.

## Abrir y trabajar

La presentación está en `dist/index.html`. Es autónoma: no requiere instalación, fuentes externas ni conexión para reproducir el contenido. Abrir el archivo directamente es posible; para un origen local estable se recomienda `npm run dev` y acceder a http://127.0.0.1:4173 .

- **Preparar:** contenido, composición, voz, notas, estado de revisión, imagen y permiso; duplicar, ordenar, eliminar y deshacer.
- **Revisar:** muestra la versión guardada con aviso de revisión clínica pendiente.
- **Presentar:** reproduce la misma versión guardada; flechas, espacio para revelados, Inicio/Fin, F para pantalla completa.
- **Guardar para presentar:** captura conjuntamente contenido, composición, medios autorizados y orden. No valida clínicamente. Las notas privadas quedan separadas.
- **Compartir / copia:** HTML autónomo de lectura sin notas privadas; paquete JSON editable con borrador, versión guardada, notas y medios; importación con validación y recuperación mediante Deshacer.

Los cambios se guardan **solo en el navegador y el origen actuales**. No hay sincronización entre equipos ni edición colaborativa. La publicación inicial contiene el guion de arranque; editarlo en un navegador no actualiza la publicación ni la de otros visitantes. Para trasladar la edición, exportar el proyecto. El HTML compartible contiene la última versión guardada, no los cambios de borrador pendientes.

Las notas están excluidas de la copia HTML, pero la copia editable JSON sí las incluye. Revisar destinatarios al compartir esa copia. Las imágenes se almacenan dentro de los datos; las autorizadas se incluyen en el HTML y todas en el paquete editable. No incorporar imágenes clínicas identificativas. El permiso pendiente evita que una imagen aparezca en el lienzo y en la copia HTML. El prototipo no sube las imágenes del usuario a un servidor.

## Contenido y diseño

24 escenas del guion y 2 pantallas institucionales. La edición se abre en la portada conceptual; Inicio permite acceder a la portada institucional. Los marcos de apertura y cierre se han extraído del PowerPoint aportado, con texto HTML superpuesto para corregir los campos del modelo y añadir el contenido de la ponencia. Los originales siguen en la carpeta raíz del proyecto.

Entidades abstractas originales generadas con canvas. No son fotografías clínicas ni representaciones diagnósticas. Las voces son textos docentes preparados; no hay una IA conectada ni generación de respuestas. Tres escenas incluyen opciones y razonamiento revelable; no son herramientas de decisión clínica.

Las cinco preguntas aparecen progresivamente y se reúnen al cierre. Su formulación es una síntesis docente no validada. Todas las escenas comienzan pendientes de revisión clínica. El corpus y el razonamiento editorial se documentan en `../PROPUESTA_CLINICA_Y_GUION.md`.

Pendiente: validación por María del Mar, coordinación de tiempos y alcance con Manuel Rodríguez Palma, fotografías autorizadas si se desean, ensayo en sala y afinado visual. La exportación PDF no se ofrece aún.

## Desarrollo y comprobación

Sin dependencias de ejecución. `npm run build` combina contenido, estilos, motor y recursos institucionales en el HTML autónomo. `npm test` comprueba referencias e identificadores, aislamiento de borrador/versión guardada, exclusión de notas en el HTML, ejecución de la copia exportada, operaciones de orden y recuperación, reinicio de interacciones e importación con medios. Las pruebas de estado usan un entorno DOM simulado; se complementan con inspección en navegador.

No editar directamente `dist/index.html`: regenerarlo desde `content.js`, `pilot.js`, `app.js`, `styles.css` y `template.html`.

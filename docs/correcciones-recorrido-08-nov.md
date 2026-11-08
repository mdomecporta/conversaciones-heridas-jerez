# Recorrido · correcciones para la revisión de María del Mar

8 de noviembre de 2026. Resuelve la auditoría de `1514617`. Las observaciones históricas están en `auditoria-recorrido-completo-08-nov.md`; el estado vigente de imágenes, en `personajes/rutina/PENDIENTES-RECORRIDO-22.md`.

| Antes | Después | Motivo |
| --- | --- | --- |
| La misma tecla completaba o avanzaba según el tiempo transcurrido | Cada pulsación avanza una escena; dos pulsaciones desde la entrada clínica llevan a la decisión | Control predecible sin paradas adicionales |
| Coincidencias de palabras activaban focos | Intervenciones identificadas con hitos explícitos; limpiar foco al cambiar de turno | No inferir una categoría favorable ni interpretar una negación como indicación |
| Focos de 7 y 11 llegaban en la réplica posterior | Se activan durante la explicación de María del Mar | Relacionar el recurso con el discurso que lo describe |
| Evidencia tapaba fuentes y la tercera pregunta | Espacio reservado bajo esos contenidos | Lectura completa de apertura y cierre |
| Las dos vías del capítulo 10 carecían de condición | «Sin indicación antimicrobiana» / «Con indicación antimicrobiana» visibles | Mantener el contexto de la decisión |
| Atenuación fuerte y acumulada sobre fotografías y texto | Fotografías a intensidad completa, atenuación suave y foco por pigmento/borde | Mejor legibilidad con proyector sin cambiar identidad |
| Todas las ventanas compartían control | Cada proyección empareja su ventana con V | Evitar mover otras presentaciones abiertas |
| Compresión dependiente de macOS con respaldo PNG pesado | JPEG ligeros versionados y build que exige su presencia | Publicación reproducible, unos 3,3 MiB para los 31 avatares únicos |
| Inventario antiguo y propuestas sin aprobar | 18 propuestas aprobadas; doce poses específicas pendientes en seis capítulos | No confundir un retrato neutro con una reacción generada |
| Hoja de revisión solo enlazaba la entrada | Enlaces a cada escena, textos del recurso y opciones, estados de imagen | Revisar también el montaje visual |

## Verificación

- Build completo correcto y pruebas automatizadas, incluida regresión de dos pulsaciones en los veinte capítulos clínicos y foco de cautela del capítulo 13.
- Las 66 vistas a 1280×720, con movimiento reducido para comprobar geometría: sin errores de carga, imágenes rotas, desbordamientos de los contenedores medidos ni los dos solapes identificados.
- Pruebas normales: navegación 0 → 1 → 3, llamada entrante → conexión antes de mostrar a Rutina, inicio de los focos de 7 y 11 en el turno explicativo, y dos proyecciones abiertas con control independiente.
- Capturas y registro en `output/playwright/revision-21/`. No sustituye el ensayo en el proyector real.

No se modifica el guion clínico, las frases validadas, la identidad de Úrsula ni la de Doña Rutina. Se aprueban las propuestas ya generadas; no se encargan imágenes nuevas. Apertura y cierre conservan sus estructuras propias.

## Publicación aditiva

Ruta acordada: `https://heridas-jerez.netlify.app/recorrido-completo/`, con revisión en `/recorrido-completo/revision/`. La rama permanece `recorrido-completo`, sin fusión en `main`. Para esta entrega se conserva el contenido original del deploy `6aee19806ecf1b28ec7205f9` fuera del prefijo nuevo; archivos comparados por SHA-1. Los artefactos internos de acceso se recompilan con Netlify CLI 27 y se comprueba la contraseña antes de activar producción.

Publicación verificada: deploy `6af0c212e4c4dd002855afdd`, activo en producción. Se conservaron los 78 archivos originales con sus mismos SHA-1, incluidos los artefactos de acceso, y se añadieron 68 archivos dentro del prefijo nuevo mediante el manifiesto de Netlify. `/recorrido-completo/`, su hoja de revisión, `/` y `/confesiones/` muestran el acceso protegido sin sesión; `/ver/` conserva su acceso público. La presentación y la hoja publicadas coinciden con el build local. Las funciones de notas y Confesiones siguen presentes con sus rutas originales. No se ha fusionado en `main`.

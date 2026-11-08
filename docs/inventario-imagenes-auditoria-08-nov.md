# Imágenes del recorrido · inventario auditado · 8 de noviembre

Estado de `recorrido-completo`, commit `1514617`. Se contrasta la configuración que realmente usa la presentación (`guion/plan-escenas.mjs` y `guion/montaje-capitulos.mjs`) con los archivos existentes y el recorrido compilado. Este inventario no aprueba las propuestas ni encarga generaciones.

## Resumen

| Estado real | Capítulos | Cantidad |
| --- | --- | --- |
| Variantes específicas disponibles | 7, 8, 9, 10, 12 | Cinco capítulos, dos poses por capítulo |
| Generadas, propuestas y pendientes de aprobación | 2, 3, 4, 5, 6, 11, 14, 15, 16 | Nueve capítulos, 18 PNG ya existentes |
| Sin variante específica; se muestra retrato neutro | 13, 17, 18, 20, 21, 22 | Seis capítulos, 12 imágenes por generar |
| Reutilización por revisar/adaptar | 1 | No falta archivo; revisar encaje de las dos poses de apertura |
| Sin imagen necesaria | 19 | No tiene intervención hablada de Rutina |

Los archivos propuestos están en `personajes/rutina/propuestas-revision-13/capitulo-NN-propuesta.png` y `capitulo-NN-reaccion.png`. Están conectados en el recorrido con estado `proposal`; existir y cargarse no equivale a estar aprobados. Las etiquetas de estado aparecen en proyección con `?poses`, y la información completa está en P.

## Doce poses pendientes

| Capítulo | Propuesta necesaria | Reacción necesaria | Recurso que acompaña |
| --- | --- | --- | --- |
| 13 · Desbridamiento | Habla de actuar por costumbre, manos bajas, sin gesto de cortar ni instrumento expuesto | Se detiene y atiende a perfusión, estabilidad, analgesia y objetivos | Ilustración del talón ya existente. No recuperar la cureta como si fuera el bisturí del diálogo |
| 17 · Pacto de parar | Preparación bienintencionada, sin dramatización ni botella protagonista | Reconoce la señal de pausa y acepta detenerse, mano abierta baja | Mano y seis puntos ya construidos como recurso nativo |
| 18 · Decidimos juntos | Seguridad amable de quien da por sabido lo que conviene | Abre espacio a la pregunta, escucha y acuerda | Composición del acuerdo ya construida |
| 20 · Dignidad | Automatismo al comentar el olor; sin gesto de asco ni taparse la nariz | Respeto y atención al alivio | Cuatro síntomas y objetivos ya construidos |
| 21 · Participación | Explica convencida de que hablar de heridas era suficiente | Cede espacio, escucha una propuesta y acepta modificar el plan | Plaza e influencia ya representadas |
| 22 · Jubilación | Anuncia la jubilación con humor suave y maletín genérico cerrado | Deja el maletín a un lado y escucha | Cierre y contraportada existentes. El retrato neutro no representa el maletín |

Los prompts de ambas poses están en los campos `offerPrompt` y `reactionPrompt` que se generan desde `guion/plan-escenas.mjs`, también visibles con P. Conservar la identidad del avatar aprobado; no usar el modelo 3D ni generar un personaje distinto.

## Recursos de escena

No se ha encontrado una fotografía o modelo ausente que bloquee la carga de los capítulos. Están presentes y cargan:

- Capítulo 2: las dos fotografías clínicas publicadas, independientes y con sus créditos.
- Capítulo 7: fotografía de torunda y transporte; no es una demostración de técnica.
- Capítulo 11: modelo de piel y sus posiciones de anotación.
- Capítulo 13: ilustración de talón con escara; no hace falta regenerarla para resolver el foco incorrecto.
- Capítulos 16 y 19: recreaciones de vida cotidiana y cuidados compartidos.
- Capítulo 10: modelo conceptual de piel del piloto.
- Portadas obligatorias, comisión y mapa del Claustro: archivos existentes.
- Herida y vecinas: renderizadores procedurales; no son PNG pendientes.

El tubo, la mano, los circuitos y el asiento son dibujos nativos implementados, no enlaces rotos. Pulir su dirección visual es una decisión separada de generar las doce poses.

## Desajustes documentales

`personajes/rutina/PENDIENTES-RECORRIDO-22.md` conserva un encabezado de revisión 10 que afirma catorce retratos neutros y dos reutilizaciones. Ese resumen ya no coincide con el montaje. Sus prompts siguen siendo una referencia útil por pose, pero el estado vigente debe salir del plan actual y de este inventario.

Antes de publicar una versión de revisión, conviene usar un enlace con `?poses` o mostrar de otra forma qué imágenes son propuestas y cuáles son provisionales. La hoja de revisión debe separar aprobación de frase, recurso y pose; una casilla sin persistencia no registra una aprobación.

## Peso de publicación

Hay 31 archivos únicos de avatar utilizados por la configuración, incluidos respaldos/reutilizaciones. En la compilación macOS auditada sus derivados suman 3,28 MiB; los originales suman 59,72 MiB. El build usa `sips` y vuelve al original si no está disponible. Comprobar el peso y las rutas en el entorno final de publicación; no asumir que la optimización local se repite allí.

# Recursos incorporados · 27 de octubre de 2026

Se han incorporado 11 imágenes al catálogo. Desde el recorte del 1 de noviembre (13 escenas), la presentación usa 7 en 6 escenas; el pioderma gangrenoso, el sistema de compresión y el modelo del biofilm siguen en el catálogo, sin uso. Las dos pantallas institucionales se mantienen.

## Carro de curas en 3D

El carro (`carro/carro.js`) está modelado para la presentación a partir de la foto del carro del centro de salud. Algunas piezas son modelos descargados de Sketchfab con licencia [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), con su licencia en `carro/modelos/*/license.txt`: guantes, espray, vendas y tiritas («Medical Supplies Collection», Miguel Adão), contenedor de punzantes (cig3d), bisturí (Medicz) y jeringa (Stakler). El crédito se ve en la pantalla final de agradecimiento.

## Fotografías externas

| Recurso | Procedencia y licencia | Aplicación |
| --- | --- | --- |
| Úlcera venosa de pierna | Jonathan Moore, The Foot and Ankle Online Journal (2008), [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Venous_ulcer_dorsal_leg.jpg), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) | Comparación de etiologías |
| Úlcera dorsal de pie con enfermedad arterial periférica | Jonathan Moore, The Foot and Ankle Online Journal (2008), [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Arterial_ulcer_peripheral_vascular_disease.jpg), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) | Comparación de etiologías; se explicita la distinta localización |
| Pioderma gangrenoso | Monopol, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pyoderma_gangrenosum_01.jpg), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | Heridas atípicas e incertidumbre |
| Torunda y tubo de transporte | Whispyhistory, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Sterile_charcoal_transport_swab.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Cultivo e interpretación de microbiología |
| Sistema de compresión aplicado | Enter, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Mehrkomponentensystem.jpg), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | Tratamiento local y abordaje causal |

Los diagnósticos se atribuyen a la fuente. No se deducen del aspecto ni se añaden datos clínicos a los publicados. Las fotografías son ejemplos externos, no pertenecen al caso sintético principal. Se conservan completas, sin recorte ni retoque clínico. La torunda y el sistema de compresión tienen una copia reducida y comprimida para proyección, bajo la misma licencia; sus originales se mantienen. La licencia autoriza reutilización de la imagen con sus condiciones, no equivale a validación clínica de la diapositiva.

## Creaciones para esta presentación

Se utilizó la herramienta integrada `image_gen.imagegen`. Cada imagen tiene su PNG original y una copia JPEG para la presentación. Los seis prompts completos están en `assets/resources/generation-prompts.json`.

| Imagen | Escenas | Función |
| --- | --- | --- |
| Modelo de lecho, borde y piel | Primer contacto, historia, limpieza, medición, reevaluación, regreso | Observar zonas sin inventar una paciente o evolución |
| Modelo conceptual del biofilm | Biofilm | Mostrar componentes con escala y colores ilustrativos |
| Talón con escara | Seguridad antes de desbridar | Abrir preguntas de perfusión, estabilidad y contexto |
| Conversación de cuidados | Historia, capacidad, objetivos, dolor, cambio de objetivo, continuidad | Situar la decisión junto a la persona |
| Descanso y vida cotidiana | Capacidad, objetivos, dolor, otros resultados | Conversar sobre prioridades y carga del cuidado |
| Material genérico | Causa, antimicrobianos, revisión, limpieza, otros resultados | Relacionar producto y objetivo sin atribuir propiedades a un envase recreado |

Las escenas de personas son recreaciones, no testimonios. Los modelos de herida, talón y biofilm son ilustraciones, no fotografías clínicas, microscopía ni evidencia diagnóstica. El material genérico no identifica fármacos o formulaciones; su regla no es una escala utilizable.

## Recorridos visuales incorporados

| Recurso | Duración | Contenido |
| --- | --- | --- |
| Zonas de la herida | 14 s | Lecho → borde → piel perilesional → piel circundante; marcador y explicación |
| Biofilm | 12 s | Tejido → matriz → microorganismos; marcador y explicación |
| Talón con escara | 12 s | Preguntas sobre perfusión → estabilidad → persona y objetivos |

Son secuencias de explicación sobre imágenes fijas, no clips de procedimientos ni una animación del crecimiento o eliminación del biofilm. Arrancan pausadas, disponen de reproducción, pausa, reinicio y selección manual; finalizan sin bucle. Se detienen al cerrar o al ocultar la pestaña. Con movimiento reducido o movimiento desactivado funcionan por pasos manuales.

## Recursos que requieren material clínico adicional

- Una serie temporal real, con registro comparable: se mantiene el seguimiento docente sin inventar un antes/después.
- Una fotografía clínica con escala métrica y condiciones de captura conocidas: el modelo actual no permite medir.
- Un vídeo de limpieza o toma de muestras validado por la ponente y autorizado para docencia: no se ha sustituido por una demostración generada con IA.
- El circuito asistencial y contactos del área: se conserva el esquema docente pendiente de adaptación local.
- Fotografías específicas de productos antimicrobianos, con formulación verificable, si se desea enseñar productos concretos. La imagen genérica no sustituye esa comparación.

La revisión clínica de la presentación permanece pendiente de la ponente. Procedencia, licencia y permisos de recursos se mantienen separados de esa revisión.

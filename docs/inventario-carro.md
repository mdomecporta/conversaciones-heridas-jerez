# Inventario del carro: objetos por escena

3 de noviembre de 2026. Lista de trabajo para modelar los objetos uno a uno en Blender (`carro/blender/`).
Sustituye como guía de modelado a `referencias-productos-carro.md`, que conserva las fuentes de la primera tanda.

## Criterio: todo neutro, sin marcas, y reconocible

Decisión de la usuaria del 3 de noviembre: ningún objeto lleva marca, ni siquiera de las casas que vienen a la jornada.

- **Por qué:** en cada escena, el carro propone la rutina que se cuestiona. Con una marca, se leería como una
  crítica a ese producto. Entre los talleres y patrocinadores de las IV Jornadas (Essity, Coloplast, Solventum,
  Smith+Nephew, B. Braun, Urgo, Mölnlycke, Hartmann, Cooper…) están los fabricantes de casi todo lo que hay en el carro.
- **Reconocible:** cada objeto reproduce lo que identifica a su categoría en una consulta: la forma y las
  proporciones del envase, los materiales, el color del tapón o de la tapa, el tipo de cierre, el sobre estéril
  y la disposición típica de la etiqueta. Basta con que una enfermera lo nombre a primera vista.
- **Etiquetas:** rótulo genérico en castellano con lo que diría un envase real («Suero fisiológico 0,9 %»,
  «Compresas de gasa 10 × 10 cm · Estéril»), con pictogramas y bandas de color, sin logotipos, nombres
  comerciales, lotes ni caducidades. Las referencias comerciales sirven solo para estudiar la forma.
- **Que no imite una marca concreta:** sin combinaciones de color o tipografías propias de un producto.
  El conjunto se parece a la categoría, no a un fabricante.

## Objetos de las escenas

| Escena | Id | Qué es en la escena | Qué lo hace reconocible | Estado |
| --- | --- | --- | --- | --- |
| 1 · Antes de elegir | `aposito-elegido` | El apósito ya elegido antes de conocer la causa | Espuma con borde adhesivo de silicona: borde fino translúcido, almohadilla central más gruesa, película exterior beige; junto a su sobre estéril abierto con pestaña | **Hecho** (`aposito.py`, 3 nov.) |
| 2 · Antes de tocar | `suero` | Limpieza «como siempre» | Suero fisiológico 0,9 % para irrigación: frasco de plástico translúcido, tapón de rosca con precinto y etiqueta envolvente; o monodosis de 10–20 ml en tira | Modelado; a rehacer |
| 2 · Antes de tocar | `gasas` | Compresas para la cura | Compresas de gasa estériles en sobre de papel y plástico con borde termosellado, una sacada y desplegada con su trama | Modelado; a rehacer |
| 3 · La limpieza de hoy | `antiseptico` | Antiséptico en el lecho en cada cura, «lo de siempre» | Povidona yodada: frasco de plástico ámbar u opaco con tapón dosificador y el líquido marrón visible | Por modelar (el frasco actual no se reconoce) |
| 4 · El talón con escara | `bisturi` | Desbridamiento cortante de una escara estable | Bisturí desechable con mango de plástico, hoja del 15 y protector, dentro de su sobre estéril | GLTF de Sketchfab; a rehacer |
| 5 · Cuando no vemos el cambio | `pomada` | Añadir pomada con antibiótico porque no avanza | Tubo de aluminio o plástico de 15–30 g, tapón estriado y pliegue del extremo, en su caja | Modelado; a rehacer |
| 6 · Antes de pedir la muestra | `torunda` | Cultivo porque no avanza | Escobillón con medio de transporte Amies: tubo con gel claro, tapón con varilla y punta de algodón o viscosa, en su envase pelable | Modelado; a rehacer |
| 7 · El motivo del antimicrobiano | `aposito-plata` | Plata durante cinco semanas «por si acaso» | Espuma gris oscura con plata, sin borde, recortable, en su sobre | Modelado; a rehacer |
| 10 · Quien venga mañana | `notas` | Notas «seguir igual» | Hoja de registro de curas con tabla y unas líneas manuscritas | Modelado; a rehacer |

## Atrezzo del carro

No lo pide ninguna escena, pero llena el carro y lo hace creíble. También sin marcas.

| Objeto | Dónde | Qué lo hace reconocible | Estado |
| --- | --- | --- | --- |
| Contenedor de punzantes de 10 L | Bandeja superior, detrás | Amarillo, tapa con boca abatible, pictograma de riesgo biológico y línea de llenado | Modelado; a rehacer |
| Caja de guantes de exploración | Bandeja superior | Caja dispensadora con abertura ovalada y un guante asomando; talla en el lateral | Modelado; a rehacer |
| Jeringa de tres cuerpos | Bandeja superior | Cilindro transparente graduado, émbolo blanco con goma, sin aguja, en sobre pelable | Modelado; a rehacer |
| Solución de limpieza para heridas | Bandeja superior | Frasco blanco con tapón abatible y su gel en tubo | Nuevo |
| Protector cutáneo | Bandeja superior | Espray pequeño o aplicador en esponja | Nuevo |
| Gel hidroalcohólico | Bandeja superior | Frasco con dosificador de bomba | Nuevo |
| Esparadrapo de papel | Cesta lateral | Rollos blancos con núcleo de plástico, de varios anchos | Modelado; a rehacer |
| Vendaje de compresión | Bandeja inferior | Rollos de venda de tono carne o blanco con clip, en kit multicapa | Modelado (`compresion`); a rehacer |
| Apósitos de reserva | Bandeja inferior, cestas | Cajas blancas con banda de color y sobres de pie | Modelados; a rehacer |
| Regla de heridas | Bandeja superior | Regla de papel en cm con círculos concéntricos | Modelada; a rehacer |
| Cestas de rejilla, blanca y oscura | Bandejas y lateral | Plástico calado con asas | Modeladas; a rehacer |

## Orden propuesto para modelar

1. Los objetos de escena, en orden de escena: 1, 2 (suero y gasas), 3, 4, 5, 6, 7 y 10.
2. El atrezzo: contenedor, guantes, jeringa, esparadrapo y compresión, y después lo nuevo.
3. Cestas y cajas de reserva.

Cada objeto se modela en su propio script de `carro/blender/` y se exporta a su `.glb`. Se revisa con
`vistas.py` y luego se coloca en el carro sin cambiar su id ni la API de la presentación.

## Al terminar

Al rehacerse los objetos, las referencias comerciales de `referencias-productos-carro.md` y las etiquetas con nombre
de producto de `carro.js` (Mepilex, Deltalab, Fresenius, Medicomp, Omnifix) se sustituyen por rótulos genéricos.
También deben revisarse las menciones del guion que dicen «inspirada visualmente en Deltalab Amies».

# Etiquetas genéricas de los objetos del carro, dibujadas con Pillow (python3 rotulos.py <objeto>).
# Sin marcas, logotipos, lotes ni caducidades: lo que diría cualquier envase de su categoría.
import os, sys
from PIL import Image, ImageDraw, ImageFont

AQUI = os.path.dirname(os.path.abspath(__file__))
SALIDA = os.path.join(AQUI, 'texturas')
FUENTE = '/System/Library/Fonts/HelveticaNeue.ttc'
TINTA, PAPEL, BANDA = (48, 45, 44), (247, 245, 240), (93, 107, 120)


def fuente(tam, negrita=False):
    return ImageFont.truetype(FUENTE, tam, index=1 if negrita else 0)


def sellado(d, x0, y0, x1, y1, paso=6):
    """Trama fina del termosellado del sobre."""
    for x in range(x0, x1, paso):
        d.line([(x, y0), (x, y1)], fill=(226, 223, 216), width=2)


def esteril(d, x, y, s=1.):
    """Símbolos de producto estéril por radiación y de un solo uso, dibujados a mano."""
    w, h = int(150 * s), int(46 * s)
    d.rectangle([x, y, x + w, y + h], outline=TINTA, width=3)
    d.line([(x + w * .7, y), (x + w * .7, y + h)], fill=TINTA, width=3)
    d.text((x + 9 * s, y + 10 * s), 'STERILE', font=fuente(int(21 * s), True), fill=TINTA)
    d.text((x + w * .78, y + 10 * s), 'R', font=fuente(int(21 * s), True), fill=TINTA)
    cx, cy, r = x + w + 50 * s, y + h / 2, 22 * s
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=TINTA, width=3)
    d.text((cx - 8 * s, cy - 16 * s), '2', font=fuente(int(28 * s), True), fill=TINTA)
    d.line([(cx - r * .7, cy + r * .7), (cx + r * .7, cy - r * .7)], fill=TINTA, width=3)


def aposito():
    # Cara impresa del sobre (la parte que queda tras abrirlo): 1200 × 1030 px para 12 × 10,3 cm.
    im = Image.new('RGB', (1200, 1030), PAPEL)
    d = ImageDraw.Draw(im)
    m = 70  # margen sellado
    sellado(d, 0, 1030 - m, 1200, 1030)
    for x0 in (0, 1200 - m):
        for y in range(0, 1030, 6):
            d.line([(x0, y), (x0 + m, y)], fill=(226, 223, 216), width=2)
    d.rectangle([m + 20, 90, 1200 - m - 20, 150], fill=BANDA)
    d.text((m + 45, 98), 'APÓSITO DE ESPUMA', font=fuente(40, True), fill=PAPEL)
    d.text((m + 45, 185), 'con borde de silicona', font=fuente(50), fill=TINTA)
    d.text((m + 45, 262), '10 × 10 cm', font=fuente(96, True), fill=TINTA)
    d.text((m + 45, 390), 'Almohadilla 6,5 × 6,5 cm · 1 unidad', font=fuente(34), fill=TINTA)
    # Pictograma: el apósito visto desde arriba.
    x, y = 860, 230
    d.rounded_rectangle([x, y, x + 200, y + 200], 26, outline=TINTA, width=4)
    d.rounded_rectangle([x + 38, y + 38, x + 162, y + 162], 16, fill=(232, 214, 196), outline=TINTA, width=3)
    d.line([(m + 45, 470), (1200 - m - 45, 470)], fill=BANDA, width=3)
    d.text((m + 45, 500), 'Uso tópico. Leer las instrucciones de uso.', font=fuente(30), fill=TINTA)
    d.text((m + 45, 545), 'No utilizar si el envase está dañado.', font=fuente(30), fill=TINTA)
    esteril(d, m + 45, 640, 1.3)
    im.save(os.path.join(SALIDA, 'aposito-impresion.png'))
    # Interior del sobre: papel liso con la huella del sellado en espiga.
    im = Image.new('RGB', (600, 680), (244, 243, 239))
    d = ImageDraw.Draw(im)
    for y in range(0, 680, 7):
        d.line([(0, y), (36, y)], fill=(229, 227, 221), width=2)
        d.line([(564, y), (600, y)], fill=(229, 227, 221), width=2)
    im.save(os.path.join(SALIDA, 'aposito-dorso.png'))


if __name__ == '__main__':
    os.makedirs(SALIDA, exist_ok=True)
    globals()[sys.argv[1]]()

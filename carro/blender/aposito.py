# Escena 1, «El apósito ya está elegido»: espuma con borde de silicona de 10 × 10 cm, recién sacada de su sobre
# estéril, que queda al lado con la solapa pelada hacia atrás. Genérico: sin marca, reconocible por su forma.
# Uso (desde presentation/):
#   /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup -P carro/blender/aposito.py
import bmesh, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comun import *

escena = empezar()
rotulos('aposito')

# ---- Sobre estéril de 12 × 13,5 cm: dorso liso, cara impresa abombada y la solapa doblada hacia atrás ----
W, H, CHAPA = .12, .135, .0003
BISAGRA = H / 2 - .032           # por donde se ha pelado la cara delantera
CX = -.05                        # el sobre queda a la izquierda del apósito
PAPEL = material('papel_sobre', (.94, .93, .90), rugosidad=.82, textura='aposito-impresion.png')
DORSO = material('dorso_sobre', (.93, .92, .89), rugosidad=.78, textura='aposito-dorso.png')
INTERIOR = material('interior_sobre', (.95, .95, .94), rugosidad=.55)

dorso = lamina(W / 2, H / 2, .003, 0, CHAPA, 'dorso', DORSO, uv=lambda x, y: (x / W + .5, y / H + .5))


def suave(t):
    t = max(0., min(1., t))
    return t * t * (3 - 2 * t)


def abombado(x, y):
    """Altura de la cara delantera: plana en el sellado de los lados y del fondo, abombada en el centro."""
    lados = suave((W / 2 - abs(x) - .006) / .014)
    fondo = suave((y + H / 2 - .006) / .014)
    return CHAPA + .00005 + .0016 * lados * fondo


def rejilla(nx, ny, punto, uv, nombre, mat, espesor=.00018):
    bm = bmesh.new()
    capa = bm.loops.layers.uv.new()
    v = [[bm.verts.new(punto(i / nx, j / ny)) for i in range(nx + 1)] for j in range(ny + 1)]
    for j in range(ny):
        for i in range(nx):
            f = bm.faces.new((v[j][i], v[j][i + 1], v[j + 1][i + 1], v[j + 1][i]))
            for l, (a, b) in zip(f.loops, ((i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1))):
                l[capa].uv = uv(a / nx, b / ny)
    obj = objeto(bm, nombre, mat, 70)
    m = obj.modifiers.new('espesor', 'SOLIDIFY')
    m.thickness, m.offset = espesor, -1
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier='espesor')
    return obj


def cara(u, v):
    x, y = (u - .5) * W, -H / 2 + v * (BISAGRA + H / 2)
    return (x, y, abombado(x, y))


delantera = rejilla(60, 44, cara, lambda u, v: (u, v), 'cara', PAPEL)

R_PLIEGUE, LARGO = .0038, H / 2 - BISAGRA


GIRO = math.radians(125)


def solapa(u, s):
    """La parte pelada: sube en un pliegue redondo desde la bisagra y queda levantada, sin tapar la etiqueta."""
    x, d = (u - .5) * W * .985, s * LARGO
    z0 = abombado(x, BISAGRA)
    arco = GIRO * R_PLIEGUE
    if d < arco:
        t = d / R_PLIEGUE
        return (x, BISAGRA + R_PLIEGUE * math.sin(t), z0 + R_PLIEGUE * (1 - math.cos(t)))
    # Sigue recta por la tangente, con una leve curva de papel hacia el borde.
    resto = d - arco
    y0, z1 = BISAGRA + R_PLIEGUE * math.sin(GIRO), z0 + R_PLIEGUE * (1 - math.cos(GIRO))
    ang = GIRO + .35 * (resto / LARGO)
    return (x, y0 + resto * math.cos(ang), z1 + resto * math.sin(ang))


plegada = rejilla(40, 30, solapa, lambda u, v: (u, v), 'solapa', INTERIOR)
for o in (dorso, delantera, plegada):
    o.location.x = CX

# ---- Apósito: lámina protectora con pestañas, borde de silicona y almohadilla de espuma ----
# Monta un poco sobre el borde del sobre, ligeramente inclinado: el lado del sobre apoya en él y el otro en la bandeja.
LAMINA = material('lamina_protectora', (.60, .76, .88), rugosidad=.25, alfa=.82)
SILICONA = material('borde_silicona', (.93, .94, .93), rugosidad=.32)
ESPUMA = material('almohadilla', (.84, .69, .56), rugosidad=.72)

piezas = [lamina(.05, .05, .012, 0, .00015, 'protectora', LAMINA)]
# Pestañas de la lámina protectora a ambos lados, para retirarla sin tocar la cara adhesiva.
for s in (-1, 1):
    p = lamina(.007, .009, .003, 0, .00015, 'pestana', LAMINA)
    p.location.x = s * .054
    piezas.append(p)
piezas.append(lamina(.05, .05, .012, .00015, .0005, 'borde', SILICONA))
zp = .00065
piezas.append(solevar([(.0328, .0328, .009, zp), (.0326, .0326, .0089, zp + .0012), (.0318, .0318, .0085, zp + .0028),
                       (.0302, .0302, .0077, zp + .0037), (.0285, .0285, .0068, zp + .0040)], 'espuma', ESPUMA, tapa_abajo=False))
centro = bpy.data.objects.new('apósito', None)
escena.collection.objects.link(centro)
for p in piezas:
    p.parent = centro
centro.location = (.022, -.018, .001)  # por debajo de la bisagra: no choca con la solapa
centro.rotation_euler = (0, math.asin(.0017 / .104), math.radians(9))
bpy.context.view_layer.update()
for p in piezas:  # se suelta del centro conservando su sitio
    mundo = p.matrix_world.copy()
    p.parent = None
    p.matrix_world = mundo
bpy.data.objects.remove(centro)

exportar('aposito-elegido')

# El carro de curas vacío, modelado en Blender a partir de las fotos de catálogo del carro de dos bandejas.
# Genera carro/estructura.glb, que carro.js carga en lugar de la estructura dibujada en Three.js.
# Uso (desde presentation/):
#   /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup -P carro/blender/carro.py
# Medidas en metros. En Blender: x ancho, -y delante, z arriba. El glTF pasa a y arriba y +z delante.
import bpy, bmesh, math, os
from mathutils import Vector, Quaternion

AQUI = os.path.dirname(os.path.abspath(__file__))
SALIDA = os.path.join(AQUI, '..', 'estructura.glb')

# Proporciones medidas en la vista frontal del catálogo (alto/ancho ≈ 1,37).
ANCHO, FONDO = .64, .42        # entre ejes de los montantes
BORDE_SUP, BORDE_INF = .87, .36  # altura del borde de cada bandeja
HONDO = .045                   # profundidad de la bandeja
ALTO_ASA = .99                 # el asa lateral, por encima de la bandeja
ALTO_BARANDA = BORDE_SUP - .065
VUELO = .25                    # lo que sobresale el soporte lateral a la derecha
R_MONTANTE, R_BARANDA, R_MARCO, R_VARILLA = .0125, .011, .008, .0035
ARRANQUE = .112                # el montante entra en el casquillo de la rueda
ex, ez = ANCHO / 2, FONDO / 2

bpy.ops.wm.read_factory_settings(use_empty=True)
escena = bpy.context.scene


def material(nombre, color, metal=0., rugosidad=.5):
    m = bpy.data.materials.new(nombre)
    n = m.node_tree.nodes['Principled BSDF']
    n.inputs['Base Color'].default_value = (*color, 1)
    n.inputs['Metallic'].default_value = metal
    n.inputs['Roughness'].default_value = rugosidad
    return m


# Los nombres los usa carro.js para retocar el acabado sin tocar la geometría.
ACERO = material('acero', (.63, .62, .60), 1, .17)
CHAPA = material('chapa', (.65, .64, .62), 1, .27)   # bandejas: acero algo más satinado
GOMA = material('goma', (.09, .09, .095), 0, .72)
BUJE = material('buje', (.45, .45, .44), 0, .42)
TAPON = material('tapon', (.10, .10, .10), 0, .6)


def suavizar(obj, angulo=40):
    for p in obj.data.polygons:
        p.use_smooth = True
    obj.data.set_sharp_from_angle(angle=math.radians(angulo))


def enlazar(obj, mat, nombre):
    obj.name = nombre
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    return obj


def acodar(puntos, radio, pasos=10):
    """Recorrido con las esquinas dobladas en arco, como un tubo curvado en frío."""
    P = [Vector(p) for p in puntos]
    salida = [P[0]]
    for i in range(1, len(P) - 1):
        a = (P[i] - P[i - 1]).normalized()
        b = (P[i + 1] - P[i]).normalized()
        giro = a.angle(b)
        if giro < 1e-4:
            salida.append(P[i]); continue
        t = radio * math.tan(giro / 2)
        S = P[i] - a * t
        n = (b - a * a.dot(b)).normalized()
        C = S + n * radio
        eje = a.cross(b).normalized()
        for k in range(pasos + 1):
            salida.append(C + Quaternion(eje, giro * k / pasos) @ (S - C))
    salida.append(P[-1])
    return salida


def tubo(puntos, radio, nombre, mat=ACERO, curva=.04, cerrado=False, tapas=True, lados=4):
    datos = bpy.data.curves.new(nombre, 'CURVE')
    datos.dimensions = '3D'
    datos.bevel_depth = radio
    datos.bevel_resolution = lados
    datos.use_fill_caps = tapas and not cerrado
    datos.twist_mode = 'MINIMUM'
    recorrido = acodar(puntos + ([puntos[0], puntos[1]] if cerrado else []), curva) if curva else [Vector(p) for p in puntos]
    if cerrado:  # se recorta lo repetido: el arco de la primera esquina cierra la vuelta
        recorrido = recorrido[1:-1]
    s = datos.splines.new('POLY')
    s.points.add(len(recorrido) - 1)
    for p, v in zip(s.points, recorrido):
        p.co = (*v, 1)
    s.use_cyclic_u = cerrado
    obj = bpy.data.objects.new(nombre, datos)
    escena.collection.objects.link(obj)
    malla = bpy.data.meshes.new_from_object(obj.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    bpy.data.objects.remove(obj)
    obj = bpy.data.objects.new(nombre, malla)
    escena.collection.objects.link(obj)
    enlazar(obj, mat, nombre)
    suavizar(obj)
    return obj


def rect_redondo(a, b, r, z, pasos=8):
    """Contorno de semiejes a, b y esquinas de radio r, siempre con el mismo número de puntos."""
    r = max(r, .0005)
    pts = []
    for cx, cy, a0 in ((a - r, b - r, 0), (-a + r, b - r, 90), (-a + r, -b + r, 180), (a - r, -b + r, 270)):
        for k in range(pasos + 1):
            t = math.radians(a0 + 90 * k / pasos)
            pts.append(Vector((cx + r * math.cos(t), cy + r * math.sin(t), z)))
    return pts


def bandeja(borde, nombre):
    """Bandeja embutida: ala plana, paredes algo inclinadas, fondo con acuerdo redondo y bordón en el canto."""
    W, D, R = ANCHO - .004, FONDO - .004, .045
    a, b, rt = W / 2 - .014, D / 2 - .014, R - .014
    caida, acuerdo = .006, .010
    anillos = [(W / 2, D / 2, R, -.0006), (a + .002, b + .002, rt + .002, 0), (a, b, rt, -.003)]
    fa, fb, fr = a - caida, b - caida, rt - caida
    for k in range(7):
        phi = math.radians(90 * k / 6)
        dentro = acuerdo * (1 - math.cos(phi))
        anillos.append((fa - dentro, fb - dentro, fr - dentro, -HONDO + acuerdo - acuerdo * math.sin(phi)))
    bm = bmesh.new()
    lazos = [[bm.verts.new(p) for p in rect_redondo(x, y, r, z)] for x, y, r, z in anillos]
    n = len(lazos[0])
    for l1, l2 in zip(lazos, lazos[1:]):
        for i in range(n):
            bm.faces.new((l1[i], l1[(i + 1) % n], l2[(i + 1) % n], l2[i]))
    fondo = bm.faces.new(list(reversed(lazos[-1])))
    bmesh.ops.triangulate(bm, faces=[fondo], quad_method='BEAUTY', ngon_method='BEAUTY')
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.normal_update()
    centro = min(bm.faces, key=lambda f: f.calc_center_median().z)
    if centro.normal.z < 0:  # las normales miran hacia dentro de la bandeja: el espesor crece hacia fuera
        bmesh.ops.reverse_faces(bm, faces=bm.faces)
    malla = bpy.data.meshes.new(nombre)
    bm.to_mesh(malla); bm.free()
    obj = bpy.data.objects.new(nombre, malla)
    escena.collection.objects.link(obj)
    obj.location.z = borde
    m = obj.modifiers.new('espesor', 'SOLIDIFY')
    m.thickness, m.offset, m.use_even_offset = .0012, -1, True
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier='espesor')
    enlazar(obj, CHAPA, nombre)
    suavizar(obj, 50)
    # Bordón enrollado en el canto del ala.
    canto = [p + Vector((0, 0, borde - .0016)) for p in rect_redondo(W / 2 - .0015, D / 2 - .0015, R - .0015, 0, 6)]
    tubo(canto, .0024, nombre + '_borde', CHAPA, curva=0, cerrado=True, lados=2)
    # Marco de tubo bajo la bandeja: une los cuatro montantes y recibe el bordón.
    z = borde - .004 - R_MARCO
    for y in (-ez, ez):
        tubo([(-ex, y, z), (ex, y, z)], R_MARCO, nombre + '_marco', curva=0, tapas=False)
    for x in (-ex, ex):
        tubo([(x, -ez, z), (x, ez, z)], R_MARCO, nombre + '_marco', curva=0, tapas=False)


def cilindro(radio, alto, centro, nombre, mat, lados=32, rot=None, bisel=0.):
    bpy.ops.mesh.primitive_cylinder_add(vertices=lados, radius=radio, depth=alto, location=centro)
    obj = bpy.context.object
    if rot:
        obj.rotation_euler = rot
    if bisel:
        m = obj.modifiers.new('bisel', 'BEVEL')
        m.width, m.segments, m.limit_method = bisel, 3, 'ANGLE'
        bpy.ops.object.modifier_apply(modifier='bisel')
    enlazar(obj, mat, nombre)
    suavizar(obj)
    return obj


def placa(medidas, centro, nombre, mat=ACERO, bisel=.0012):
    bpy.ops.mesh.primitive_cube_add(size=1, location=centro)
    obj = bpy.context.object
    obj.scale = medidas
    bpy.ops.object.transform_apply(scale=True)
    m = obj.modifiers.new('bisel', 'BEVEL')
    m.width, m.segments = bisel, 2
    bpy.ops.object.modifier_apply(modifier='bisel')
    enlazar(obj, mat, nombre)
    suavizar(obj, 35)
    return obj


def rueda(x, y, giro, nombre):
    """Rueda giratoria de 75 mm: casquillo, rodamiento, horquilla de chapa, banda de goma gris y buje claro."""
    piezas = [
        cilindro(.0165, .03, (0, 0, ARRANQUE - .004), nombre + '_casquillo', BUJE, bisel=.002),
        cilindro(.022, .006, (0, 0, .094), nombre + '_giro', ACERO, bisel=.0015),
        cilindro(.009, .012, (0, 0, .087), nombre + '_eje', ACERO),
        placa((.046, .034, .004), (0, .010, .081), nombre + '_puente'),
    ]
    for s in (-1, 1):
        piezas.append(placa((.003, .03, .046), (s * .0185, .016, .058), nombre + '_horquilla'))
    centro = (0, .02, .0385)
    piezas.append(cilindro(.0385, .022, centro, nombre + '_goma', GOMA, 48, (0, math.radians(90), 0), .0075))
    piezas.append(cilindro(.026, .0255, centro, nombre + '_buje', BUJE, 40, (0, math.radians(90), 0), .001))
    piezas.append(cilindro(.006, .041, centro, nombre + '_tornillo', ACERO, 20, (0, math.radians(90), 0), .001))
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = piezas[0]
    for p in piezas:
        p.select_set(True)
    bpy.ops.object.join()
    obj = bpy.context.object
    obj.name = nombre
    obj.rotation_euler.z = giro
    obj.location.x, obj.location.y = x, y  # el origen es el del casquillo, en el eje del montante


# ---- Montantes y asa: los dos de la izquierda son un solo tubo doblado en U ----
tubo([(-ex, -ez, ARRANQUE), (-ex, -ez, ALTO_ASA), (-ex, ez, ALTO_ASA), (-ex, ez, ARRANQUE)],
     R_MONTANTE, 'asa', curva=.05)
for y in (-ez, ez):
    tubo([(ex, y, ARRANQUE), (ex, y, BORDE_SUP + .014)], R_MONTANTE, 'montante', curva=0)
    cilindro(R_MONTANTE * 1.08, .012, (ex, y, BORDE_SUP + .02), 'tapon', TAPON, bisel=.004)

bandeja(BORDE_SUP, 'bandeja_sup')
bandeja(BORDE_INF, 'bandeja_inf')

# ---- Baranda delantera: corre por delante de los montantes y se prolonga a la derecha en un soporte ----
yb = ez + R_MONTANTE + R_BARANDA
tubo([(-ex - .022, -yb, ALTO_BARANDA), (ex + VUELO, -yb, ALTO_BARANDA),
      (ex + VUELO, yb, ALTO_BARANDA), (ex, yb, ALTO_BARANDA)], R_BARANDA, 'baranda', curva=.045)
# Dos colgadores de varilla bajo el soporte, para palangana o cesta.
for x in (ex + .075, ex + .175):
    c, f = .062, yb - .004
    tubo([(x, -f, ALTO_BARANDA), (x, -f + .03, ALTO_BARANDA - c), (x, f - .03, ALTO_BARANDA - c), (x, f, ALTO_BARANDA)],
         R_VARILLA, 'colgador', curva=.012)
# Varilla en el costado del asa, a media altura.
tubo([(-ex - .004, -ez, .62), (-ex - .004, ez, .62)], .005, 'varilla', curva=0)

# ---- Ruedas ----
for (x, y, giro) in ((-ex, -ez, .35), (ex, -ez, -.2), (-ex, ez, 2.9), (ex, ez, 3.4)):
    rueda(x, y, giro, 'rueda')

# Un solo objeto: el exportador lo parte en una malla por material, pocas llamadas de dibujo en Three.js.
bpy.ops.object.select_all(action='SELECT')
bpy.context.view_layer.objects.active = bpy.data.objects['asa']
bpy.ops.object.join()
carro = bpy.context.object
carro.name = 'carro'
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

triangulos = sum(len(p.vertices) - 2 for p in carro.data.polygons)
print(f'CARRO {triangulos} triángulos')
bpy.ops.export_scene.gltf(filepath=os.path.abspath(SALIDA), export_format='GLB', use_selection=True,
                          export_apply=True, export_yup=True)
print('CARRO exportado', os.path.abspath(SALIDA))

# Piezas comunes de los objetos del carro: materiales, contornos redondeados, láminas y exportación.
# Cada objeto tiene su script (aposito.py, …) que importa este módulo y exporta carro/objetos/<id>.glb.
# Medidas en metros. En Blender: x ancho, -y delante, z arriba; el glTF pasa a y arriba y +z delante.
import bpy, bmesh, math, os, subprocess, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
OBJETOS = os.path.join(AQUI, '..', 'objetos')
TEXTURAS = os.path.join(AQUI, 'texturas')


def empezar():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    return bpy.context.scene


def rotulos(objeto):
    """Dibuja las etiquetas del objeto con el Python del sistema (Blender no trae Pillow)."""
    subprocess.run(['/usr/bin/python3', os.path.join(AQUI, 'rotulos.py'), objeto], check=True)


def material(nombre, color, metal=0., rugosidad=.5, textura=None, alfa=1., brillo=None):
    m = bpy.data.materials.new(nombre)
    n = m.node_tree.nodes['Principled BSDF']
    n.inputs['Base Color'].default_value = (*color, 1)
    n.inputs['Metallic'].default_value = metal
    n.inputs['Roughness'].default_value = rugosidad
    if brillo is not None:
        n.inputs['Specular IOR Level'].default_value = brillo
    if textura:
        t = m.node_tree.nodes.new('ShaderNodeTexImage')
        t.image = bpy.data.images.load(os.path.join(TEXTURAS, textura))
        m.node_tree.links.new(t.outputs['Color'], n.inputs['Base Color'])
    if alfa < 1:
        n.inputs['Alpha'].default_value = alfa
        m.surface_render_method = 'BLENDED'
    return m


def suavizar(obj, angulo=40):
    for p in obj.data.polygons:
        p.use_smooth = True
    obj.data.set_sharp_from_angle(angle=math.radians(angulo))


def objeto(bm, nombre, mat, angulo=40):
    malla = bpy.data.meshes.new(nombre)
    bm.to_mesh(malla); bm.free()
    obj = bpy.data.objects.new(nombre, malla)
    bpy.context.scene.collection.objects.link(obj)
    malla.materials.append(mat)
    suavizar(obj, angulo)
    return obj


def rect_redondo(a, b, r, z=0., pasos=8):
    """Contorno de semiejes a, b y esquinas de radio r, siempre con el mismo número de puntos."""
    r = max(min(r, a, b), .0002)
    pts = []
    for cx, cy, a0 in ((a - r, b - r, 0), (-a + r, b - r, 90), (-a + r, -b + r, 180), (a - r, -b + r, 270)):
        for k in range(pasos + 1):
            t = math.radians(a0 + 90 * k / pasos)
            pts.append((cx + r * math.cos(t), cy + r * math.sin(t), z))
    return pts


def solevar(anillos, nombre, mat, tapa_abajo=True, tapa_arriba=True, angulo=40, uv=None):
    """Une contornos (a, b, r, z) de abajo arriba; cierra con tapas planas. uv(x, y) da coordenadas de textura."""
    bm = bmesh.new()
    lazos = [[bm.verts.new(p) for p in rect_redondo(*a)] for a in anillos]
    n = len(lazos[0])
    for l1, l2 in zip(lazos, lazos[1:]):
        for i in range(n):
            bm.faces.new((l1[i], l1[(i + 1) % n], l2[(i + 1) % n], l2[i]))
    tapas = []
    if tapa_abajo:
        tapas.append(bm.faces.new(list(reversed(lazos[0]))))
    if tapa_arriba:
        tapas.append(bm.faces.new(lazos[-1]))
    bmesh.ops.triangulate(bm, faces=tapas, quad_method='BEAUTY', ngon_method='BEAUTY')
    if uv:
        capa = bm.loops.layers.uv.new()
        for f in bm.faces:
            for l in f.loops:
                l[capa].uv = uv(l.vert.co.x, l.vert.co.y)
    return objeto(bm, nombre, mat, angulo)


def lamina(a, b, r, z, espesor, nombre, mat, uv=None):
    """Lámina fina de esquinas redondeadas, con el canto apenas redondeado."""
    c = min(espesor / 2, .0002)
    return solevar([(a - c, b - c, r - c, z), (a, b, r, z + c), (a, b, r, z + espesor - c), (a - c, b - c, r - c, z + espesor)],
                   nombre, mat, angulo=60, uv=uv)


def exportar(id_objeto):
    """Une todo en un objeto con el origen en el centro de la base y lo exporta a carro/objetos/<id>.glb."""
    os.makedirs(OBJETOS, exist_ok=True)
    bpy.ops.object.select_all(action='SELECT')
    bpy.context.view_layer.objects.active = bpy.context.selected_objects[0]
    bpy.ops.object.join()
    obj = bpy.context.object
    obj.name = id_objeto
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    ruta = os.path.abspath(os.path.join(OBJETOS, id_objeto + '.glb'))
    bpy.ops.export_scene.gltf(filepath=ruta, export_format='GLB', use_selection=True, export_apply=True, export_yup=True)
    triangulos = sum(len(p.vertices) - 2 for p in obj.data.polygons)
    print(f'OBJETO {id_objeto}: {triangulos} triángulos → {ruta}')

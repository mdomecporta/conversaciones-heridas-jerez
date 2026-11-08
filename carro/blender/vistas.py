# Hoja de revisión: renderiza un GLB (el carro, por omisión, o un objeto) desde cuatro cámaras y las junta.
# Uso (desde presentation/):
#   /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup -P carro/blender/vistas.py -- salida.png [objeto.glb]
import bpy, math, os, sys, subprocess, tempfile
from mathutils import Vector

AQUI = os.path.dirname(os.path.abspath(__file__))
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
SALIDA = os.path.abspath(ARGS[0] if ARGS else 'vistas.png')
GLB = os.path.abspath(ARGS[1]) if len(ARGS) > 1 else os.path.join(AQUI, '..', 'estructura.glb')

bpy.ops.wm.read_factory_settings(use_empty=True)
escena = bpy.context.scene
bpy.ops.import_scene.gltf(filepath=GLB)

# Estudio claro con el entorno de interior que trae Blender: el acero necesita algo que reflejar.
mundo = bpy.data.worlds.new('estudio'); escena.world = mundo
nodos = mundo.node_tree.nodes
hdri = nodos.new('ShaderNodeTexEnvironment')
hdri.image = bpy.data.images.load(os.path.join(bpy.utils.system_resource('DATAFILES'), 'studiolights', 'world', 'interior.exr'))
nodos['Background'].inputs['Strength'].default_value = 1.1
mundo.node_tree.links.new(hdri.outputs['Color'], nodos['Background'].inputs['Color'])
bpy.ops.object.light_add(type='AREA', location=(-1.2, -1.6, 2.6))
luz = bpy.context.object; luz.data.energy = 300; luz.data.size = 1.5
luz.rotation_euler = (Vector((.1, .1, .5)) - luz.location).to_track_quat('-Z', 'Y').to_euler()
# Suelo que solo recoge la sombra, como el papel de la presentación.
bpy.ops.mesh.primitive_plane_add(size=8)
bpy.context.object.is_shadow_catcher = True

escena.render.engine = 'CYCLES'
escena.cycles.device = 'GPU'
prefs = bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type = 'METAL'; prefs.get_devices()
for dispositivo in prefs.devices: dispositivo.use = True
escena.cycles.samples = 24
escena.cycles.use_denoising = True
escena.render.film_transparent = True
escena.render.resolution_x = escena.render.resolution_y = 900
escena.view_settings.view_transform = 'Khronos PBR Neutral'  # como el NeutralToneMapping de carro.js

# Las cámaras se colocan según el tamaño de lo importado: sirven para el carro y para cada objeto.
caja = [o.matrix_world @ Vector(v) for o in escena.objects if o.type == 'MESH' and not o.is_shadow_catcher for v in o.bound_box]
lo = Vector([min(v[i] for v in caja) for i in range(3)]); hi = Vector([max(v[i] for v in caja) for i in range(3)])
c, d = (lo + hi) / 2, (hi - lo).length
if d < .5:  # un objeto pequeño: luz más cerca y menos dura
    luz.location = c + Vector((-.6, -.8, 1.3)) * d * 2; luz.data.energy = 60 * d * d; luz.data.size = d
    nodos['Background'].inputs['Strength'].default_value = .55
    luz.rotation_euler = (c - luz.location).to_track_quat('-Z', 'Y').to_euler()
# Tres cuartos, frontal, desde arriba y rasante (para ver espesores y apoyos).
VISTAS = [
    ('tres_cuartos', c + Vector((-.55, -.85, .75)) * d * 1.6, c, 58),
    ('frontal', c + Vector((0, -1, .32)) * d * 1.9, c, 58),
    ('planta', c + Vector((0, -.02, 1)) * d * 1.7, c, 58),
    ('rasante', c + Vector((.7, -.7, .12)) * d * .9, c, 58),
]
ficheros = []
tmp = tempfile.mkdtemp()
for nombre, pos, mira, lente in VISTAS:
    cam = bpy.data.objects.new(nombre, bpy.data.cameras.new(nombre))
    escena.collection.objects.link(cam)
    cam.location = pos; cam.data.lens = lente; cam.data.clip_start = d / 100
    cam.rotation_euler = (Vector(mira) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
    escena.camera = cam
    escena.render.filepath = os.path.join(tmp, nombre + '.png')
    bpy.ops.render.render(write_still=True)
    ficheros.append(escena.render.filepath)

# Hoja 2 × 2 sobre papel, con el Python del sistema (Blender no trae Pillow).
codigo = ('import sys;from PIL import Image;f=sys.argv[2:];h=Image.new("RGB",(1800,1800),(246,240,232))\n'
          'for i,p in enumerate(f):im=Image.open(p).convert("RGBA");h.paste(im,((i%2)*900,(i//2)*900),im)\n'
          'h.save(sys.argv[1])')
subprocess.run(['/usr/bin/python3', '-c', codigo, SALIDA, *ficheros], check=True)
print('VISTAS', SALIDA)

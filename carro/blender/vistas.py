# Hoja de revisión del carro: renderiza estructura.glb desde varias cámaras y las junta en una imagen.
# Uso (desde presentation/):
#   /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup -P carro/blender/vistas.py -- salida.png
import bpy, math, os, sys, subprocess, tempfile
from mathutils import Vector

AQUI = os.path.dirname(os.path.abspath(__file__))
GLB = os.path.join(AQUI, '..', 'estructura.glb')
SALIDA = os.path.abspath(sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else 'vistas.png')

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
for d in prefs.devices: d.use = True
escena.cycles.samples = 24
escena.cycles.use_denoising = True
escena.render.film_transparent = True
escena.render.resolution_x = escena.render.resolution_y = 900
escena.view_settings.view_transform = 'AgX'

# Tres cuartos como la primera foto del catálogo, frontal como la segunda, costado, y detalle de rueda y esquina.
VISTAS = [
    ('tres_cuartos', (-1.55, -2.35, 1.75), (.08, 0, .5), 58),
    ('frontal', (0, -3.4, 1.1), (.12, 0, .5), 58),
    ('costado', (-3.2, 0, .9), (0, 0, .5), 58),
    ('detalle', (.62, -.62, .42), (.3, -.2, .18), 45),
]
ficheros = []
tmp = tempfile.mkdtemp()
for nombre, pos, mira, lente in VISTAS:
    cam = bpy.data.objects.new(nombre, bpy.data.cameras.new(nombre))
    escena.collection.objects.link(cam)
    cam.location = pos; cam.data.lens = lente
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

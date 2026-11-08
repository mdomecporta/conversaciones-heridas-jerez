# Doña Evidencia: enfermera joven de pijama verde, con tableta; trae las evidencias.
# Uso: Blender -b -P evidencia.py -- [render|export|all]
import bpy, math, sys, os
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
MODE = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "all"

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.fps = 30

# ---------- materiales ----------
def mat(name, color, rough=0.55):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    return m

def srgb(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)

M = {
    "pijama": mat("pijama", srgb("#2F9C8C"), 0.75),
    "camiseta": mat("camiseta", srgb("#1F3B3A"), 0.7),
    "piel": mat("piel", srgb("#F1C3A6"), 0.6),
    "pelo": mat("pelo", srgb("#B8653A"), 0.5),
    "ojo": mat("ojo", srgb("#1B1717"), 0.2),
    "boca": mat("boca", srgb("#7A2A2E"), 0.5),
    "mejilla": mat("mejilla", srgb("#EE9C8E"), 0.7),
    "zueco": mat("zueco", srgb("#F4F3EF"), 0.5),
    "tableta": mat("tableta", srgb("#A9ADB3"), 0.35),
    "pantalla": mat("pantalla", srgb("#E8F4F1"), 0.3),
    "fonendo": mat("fonendo", srgb("#2A2C33"), 0.4),
    "metal": mat("metal", srgb("#C8CCD2"), 0.25),
}

# ---------- utilidades ----------
def finish(o, material, sub=2, smooth=True):
    o.data.materials.append(M[material])
    if smooth:
        for p in o.data.polygons:
            p.use_smooth = True
    if sub:
        o.modifiers.new("sub", "SUBSURF").levels = sub
    return o

def sphere(name, loc, scale, material, sub=2):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, location=loc)
    o = bpy.context.object; o.name = name; o.scale = scale
    return finish(o, material, sub)

def torus(name, loc, major, minor, material, scale=(1, 1, 1), rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor,
                                     major_segments=40, minor_segments=10, location=loc, rotation=rot)
    o = bpy.context.object; o.name = name; o.scale = scale
    return finish(o, material, 1)

def limb(name, a, b, r, material):
    a, b = Vector(a), Vector(b)
    d = b - a
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=r, depth=d.length, location=(a + b) / 2)
    o = bpy.context.object; o.name = name
    o.rotation_mode = "QUATERNION"
    o.rotation_quaternion = d.to_track_quat("Z", "Y")
    finish(o, material, 0)
    for end in (a, b):  # extremos redondeados: cápsula
        bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=r, location=end)
        e = bpy.context.object; finish(e, material, 0)
        e.select_set(True); o.select_set(True)
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.join()
    o.name = name
    return o

def box(name, loc, size, material, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot)
    o = bpy.context.object; o.name = name; o.scale = [s / 2 for s in size]
    o.modifiers.new("bevel", "BEVEL").width = 0.006
    return finish(o, material, 0, smooth=False)

# ---------- cuerpo (frente hacia -Y): cabeza grande, cuerpo esbelto ----------
parts = {}  # objeto -> hueso
def P(o, bone): parts[o] = bone; return o

HIP = 0.78
bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0.97))
blusa = bpy.context.object; blusa.name = "blusa"; blusa.scale = (0.19, 0.125, 0.27)
P(finish(blusa, "pijama", 2), "spine")
P(sphere("escote", (0, -0.112, 1.17), (0.045, 0.012, 0.045), "camiseta", 1), "spine")
for s in (-1, 1):
    side = "L" if s > 0 else "R"
    P(limb(f"pernera{side}", (s * 0.075, 0, HIP), (s * 0.08, 0, 0.1), 0.062, "pijama"), f"leg.{side}")
    P(sphere(f"zueco{side}", (s * 0.08, -0.035, 0.045), (0.065, 0.11, 0.05), "zueco"), f"leg.{side}")

# fonendo al cuello
P(torus("fonendo_cuello", (0, 0.01, 1.215), 0.075, 0.009, "fonendo", scale=(1, 0.9, 1), rot=(-0.35, 0, 0)), "spine")
for s in (-1, 1):
    P(limb(f"fonendo{s}", (s * 0.065, -0.06, 1.2), (s * 0.075, -0.13, 1.0), 0.008, "fonendo"), "spine")
P(torus("campana", (0.075, -0.135, 0.97), 0.022, 0.008, "metal", rot=(math.pi / 2, 0, 0)), "spine")
P(sphere("campana_c", (0.075, -0.135, 0.97), (0.02, 0.008, 0.02), "metal", 1), "spine")

# cabeza
HZ = 1.45
P(limb("cuello", (0, 0, 1.18), (0, 0, 1.3), 0.045, "piel"), "head")
P(sphere("cabeza", (0, 0, HZ), (0.2, 0.19, 0.21), "piel"), "head")
P(sphere("pelo", (0, 0.035, HZ + 0.035), (0.222, 0.21, 0.215), "pelo"), "head")
P(sphere("flequillo", (0, -0.12, HZ + 0.12), (0.19, 0.08, 0.085), "pelo"), "head")
for s in (-1, 1):
    P(sphere(f"melena{s}", (s * 0.17, -0.02, HZ - 0.03), (0.07, 0.13, 0.15), "pelo"), "head")
P(torus("coletero", (0.13, 0.17, HZ + 0.0), 0.03, 0.012, "pijama", rot=(0, math.pi / 2, 0.6)), "head")
P(sphere("coleta", (0.17, 0.2, HZ - 0.1), (0.055, 0.06, 0.13), "pelo"), "head")
fy = -0.185
for s in (-1, 1):
    x = s * 0.075
    P(sphere(f"ojo{s}", (x, fy + 0.01, HZ + 0.015), (0.025, 0.012, 0.03), "ojo", 1), "head")
    P(sphere(f"brillo{s}", (x - 0.008, fy, HZ + 0.03), (0.007, 0.004, 0.007), "pantalla", 0), "head")
    P(limb(f"ceja{s}", (s * 0.045, fy - 0.005, HZ + 0.075), (s * 0.105, fy + 0.005, HZ + 0.07), 0.007, "pelo"), "head")
    P(sphere(f"mejilla{s}", (s * 0.12, fy + 0.035, HZ - 0.05), (0.038, 0.012, 0.025), "mejilla", 1), "head")
P(sphere("nariz", (0, fy - 0.01, HZ - 0.03), (0.02, 0.02, 0.02), "piel"), "head")
P(sphere("sonrisa", (0, fy + 0.012, HZ - 0.095), (0.045, 0.012, 0.025), "boca", 1), "head")
P(sphere("dientes", (0, fy + 0.004, HZ - 0.083), (0.035, 0.008, 0.009), "zueco", 1), "head")

# brazos: hombro, codo, muñeca
ARM = {s: [(s * 0.19, 0, 1.17), (s * 0.235, -0.01, 0.94), (s * 0.245, -0.04, 0.72)] for s in (-1, 1)}
for s in (-1, 1):
    sh, el, wr = ARM[s]
    side = "L" if s > 0 else "R"
    P(sphere(f"manga{side}", Vector(sh).lerp(Vector(el), 0.2), (0.065, 0.065, 0.075), "pijama"), f"upper.{side}")
    P(limb(f"brazo{side}", sh, el, 0.034, "piel"), f"upper.{side}")
    P(limb(f"antebrazo{side}", el, wr, 0.031, "piel"), f"fore.{side}")
    P(sphere(f"mano{side}", (wr[0], wr[1], wr[2] - 0.035), (0.037, 0.032, 0.048), "piel"), f"fore.{side}")

# tableta en la mano derecha (lado -X), pantalla hacia fuera
tx, ty, tz = -0.275, -0.07, 0.69
P(box("tableta", (tx, ty, tz), (0.014, 0.17, 0.23), "tableta", rot=(0, 0, 0.3)), "fore.R")
P(box("pantalla", (tx - 0.008, ty, tz), (0.002, 0.15, 0.21), "pantalla", rot=(0, 0, 0.3)), "fore.R")

# ---------- esqueleto ----------
bpy.ops.object.armature_add(location=(0, 0, 0))
rig = bpy.context.object; rig.name = "Evidencia"
bpy.ops.object.mode_set(mode="EDIT")
eb = rig.data.edit_bones
eb.remove(eb[0])
def bone(name, head, tail, parent=None):
    b = eb.new(name); b.head, b.tail = head, tail
    b.align_roll(Vector((0, -1, 0)))
    if parent: b.parent = eb[parent]
    return b
bone("root", (0, 0, 0), (0, 0.2, 0))
bone("spine", (0, 0, HIP), (0, 0, 1.18), "root")
bone("head", (0, 0, 1.2), (0, 0, 1.68), "spine")
for s in (-1, 1):
    side = "L" if s > 0 else "R"
    sh, el, wr = ARM[s]
    bone(f"upper.{side}", sh, el, "spine")
    bone(f"fore.{side}", el, wr, f"upper.{side}")
    bone(f"leg.{side}", (s * 0.075, 0, HIP), (s * 0.08, 0, 0.06), "root")
bpy.ops.object.mode_set(mode="OBJECT")

bpy.context.view_layer.update()
for o, b in parts.items():
    mw = o.matrix_world.copy()
    o.parent = rig; o.parent_type = "BONE"; o.parent_bone = b
    bpy.context.view_layer.update()
    o.matrix_world = mw

# ---------- gestos ----------
pb = rig.pose.bones
for p in pb: p.rotation_mode = "XYZ"

def gesto(name, frames, keys):
    """keys: {frame: {bone: (rx, ry, rz) en grados | ('loc', x, y, z)}}"""
    act = bpy.data.actions.new(name)
    rig.animation_data_create()
    rig.animation_data.action = act
    for p in pb:
        p.rotation_euler = (0, 0, 0); p.location = (0, 0, 0)
    used = [p.name for p in pb if p.name != "root"]  # todos: cada gesto parte de una pose completa
    for f in sorted(keys):
        for b in used:
            v = keys[f].get(b)
            if v is None:  # mantener el último valor conocido
                prev = [keys[g][b] for g in sorted(keys) if g < f and b in keys[g]]
                v = prev[-1] if prev else (0, 0, 0)
            if v[0] == "loc":
                pb[b].location = v[1:]; pb[b].keyframe_insert("location", frame=f)
            else:
                pb[b].rotation_euler = [math.radians(a) for a in v]
                pb[b].keyframe_insert("rotation_euler", frame=f)
    act.use_fake_user = True
    tr = rig.animation_data.nla_tracks.new(); tr.name = name
    tr.strips.new(name, 1, act).mute = False
    rig.animation_data.action = None
    return act

# Ejes (Z local hacia delante): rx+ adelanta el hueso (cabeza: mira abajo; brazo: sube por delante),
# ry gira sobre su eje (cabeza: niega), rz+ lleva el hueso hacia +X (fuera en .L, dentro en .R).
Z = (0, 0, 0)
def brazos(uL=Z, fL=Z, uR=Z, fR=Z):
    return {"upper.L": uL, "fore.L": fL, "upper.R": uR, "fore.R": fR}
REPOSO = brazos(fL=(10, 0, 0), uR=(8, 0, 6), fR=(55, 0, 0))   # la tableta, a medio pecho

gesto("reposo", 60, {
    1:  {"spine": Z, "head": Z, **REPOSO},
    30: {"spine": (-1.5, 0, 0), "head": (-3, 0, -3), **brazos(fL=(13, 0, 0), uR=(9, 0, 6), fR=(58, 0, 0))},
    60: {"spine": Z, "head": Z, **REPOSO},
})
PRESENTA = {"head": (-4, 0, 8), "spine": (-2, 0, 0),
            **brazos(uL=(45, 0, -12), fL=(40, 0, 0), uR=(40, 0, -25), fR=(45, 0, 0))}
gesto("presenta", 60, {  # gira la tableta hacia la sala y la señala
    1: {"head": Z, "spine": Z, **REPOSO}, 14: PRESENTA,
    24: {"fore.L": (48, 0, 0)}, 32: {"fore.L": (38, 0, 0)}, 46: PRESENTA,
    60: {"head": Z, "spine": Z, **REPOSO},
})
CONSULTA = {"head": (18, 0, -6), **brazos(uL=(30, 0, -18), fL=(70, 0, 0), uR=(20, 0, 15), fR=(80, 0, 0))}
gesto("consulta", 60, {  # mira la tableta y toca la pantalla
    1: {"head": Z, **REPOSO}, 12: CONSULTA,
    20: {"fore.L": (78, 0, 0)}, 26: {"fore.L": (70, 0, 0)}, 34: {"fore.L": (78, 0, 0)}, 40: {"fore.L": (70, 0, 0)},
    48: CONSULTA, 60: {"head": Z, **REPOSO},
})
gesto("asiente", 40, {
    1: {"head": Z, **REPOSO}, 10: {"head": (14, 0, 0)}, 18: {"head": (-3, 0, 0)},
    26: {"head": (12, 0, 0)}, 40: {"head": Z},
})
SALUDO = brazos(uL=(10, 0, 150), fL=(20, 0, 0), uR=(8, 0, 6), fR=(55, 0, 0))
gesto("saluda", 50, {
    1: {"head": Z, **REPOSO}, 10: {"head": (0, 0, 8), **SALUDO},
    18: {"fore.L": (20, 0, 25)}, 26: {"fore.L": (20, 0, -15)}, 34: {"fore.L": (20, 0, 25)},
    40: {"head": (0, 0, 8), **SALUDO}, 50: {"head": Z, **REPOSO},
})

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "evidencia.blend"))

# ---------- render de prueba ----------
def render(path, action=None, frame=1, cam_x=1.4):
    for t in rig.animation_data.nla_tracks: t.mute = True
    rig.animation_data.action = bpy.data.actions[action] if action else None
    scene.frame_set(frame)
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)

if MODE in ("render", "all"):
    try: scene.render.engine = "BLENDER_EEVEE"
    except TypeError: scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.render.resolution_x, scene.render.resolution_y = 700, 900
    scene.render.film_transparent = True
    w = bpy.data.worlds.new("w"); scene.world = w; w.use_nodes = True
    w.node_tree.nodes["Background"].inputs[0].default_value = (*srgb("#9A9CA3"), 1)
    w.node_tree.nodes["Background"].inputs[1].default_value = 0.9
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); scene.collection.objects.link(cam)
    cam.data.lens = 70
    cam.location = (1.6, -3.6, 1.05)
    cam.rotation_euler = (Vector((0, 0, 0.85)) - cam.location).to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam
    for loc, e in (((2, -2, 3), 600), ((-3, -1, 2), 200), ((0, 3, 2.5), 300)):
        l = bpy.data.objects.new("l", bpy.data.lights.new("l", "AREA"))
        l.data.energy = e; l.data.size = 3; l.location = loc
        l.rotation_euler = (Vector((0, 0, 0.9)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        scene.collection.objects.link(l)
    out = os.path.join(HERE, "render")
    os.makedirs(out, exist_ok=True)
    render(os.path.join(out, "reposo.png"), "reposo", 1)
    for g, f in (("presenta", 20), ("consulta", 22), ("saluda", 22)):
        render(os.path.join(out, f"{g}.png"), g, f)
    for t in rig.animation_data.nla_tracks: t.mute = False
    rig.animation_data.action = None

if MODE in ("export", "all"):
    bpy.ops.export_scene.gltf(filepath=os.path.join(HERE, "evidencia.glb"), export_format="GLB",
                              export_apply=True, export_animation_mode="NLA_TRACKS",
                              use_selection=False, export_cameras=False, export_lights=False)

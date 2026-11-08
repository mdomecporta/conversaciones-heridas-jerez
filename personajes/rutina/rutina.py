# La Rutina: enfermera veterana, estilizada, rígida y de protocolo.
# Uso: Blender -b -P rutina.py -- [render|export|all]
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
    "uniforme": mat("uniforme", srgb("#ECEBE6"), 0.7),
    "menta": mat("menta", srgb("#4FAE98"), 0.5),
    "piel": mat("piel", srgb("#E9B497"), 0.6),
    "pelo": mat("pelo", srgb("#3A3433"), 0.45),
    "gafas": mat("gafas", srgb("#7A2238"), 0.3),
    "ojo": mat("ojo", srgb("#1B1717"), 0.2),
    "mejilla": mat("mejilla", srgb("#E58C8C"), 0.7),
    "papel": mat("papel", srgb("#F7F4EA"), 0.8),
    "metal": mat("metal", srgb("#C9A55A"), 0.3),
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

# ---------- cuerpo (frente hacia -Y) ----------
EGG_C, EGG = 0.80, (0.33, 0.29, 0.46)       # centro y radios del vestido
def egg_r(z, axis=0):
    k = 1 - ((z - EGG_C) / EGG[2]) ** 2
    return EGG[axis] * math.sqrt(max(k, 0))

parts = {}  # objeto -> hueso
def P(o, bone): parts[o] = bone; return o

P(sphere("vestido", (0, 0, EGG_C), EGG, "uniforme"), "spine")
zb = 1.02
P(torus("cinturon", (0, 0, zb), 1, 0.018, "uniforme",
        scale=(egg_r(zb) + 0.005, egg_r(zb, 1) + 0.005, 1)), "spine")
P(box("hebilla", (0, -egg_r(zb, 1) - 0.012, zb), (0.05, 0.012, 0.04), "metal"), "spine")
zh = 0.40
P(torus("bajo", (0, 0, zh), 1, 0.014, "menta",
        scale=(egg_r(zh) + 0.004, egg_r(zh, 1) + 0.004, 1)), "spine")
for i, z in enumerate((1.17, 1.10, 1.03 + 0.0)):
    if z < 1.05: continue
    P(sphere(f"boton{i}", (0, -egg_r(z, 1) - 0.004, z), (0.016, 0.01, 0.016), "menta", 1), "spine")
P(torus("cuello_camisa", (0, -0.02, 1.235), 1, 0.03, "uniforme", scale=(0.11, 0.09, 1)), "spine")

# cabeza
HZ = 1.47
P(limb("cuello", (0, 0, 1.2), (0, 0, 1.33), 0.06, "piel"), "head")
P(sphere("cabeza", (0, 0, HZ), (0.19, 0.18, 0.2), "piel"), "head")
P(sphere("pelo", (0, 0.03, HZ + 0.0), (0.212, 0.2, 0.2), "pelo"), "head")
P(sphere("flequillo", (0, -0.1, HZ + 0.11), (0.16, 0.09, 0.06), "pelo"), "head")
for s in (-1, 1):
    P(sphere(f"melena{s}", (s * 0.17, 0.02, HZ - 0.08), (0.08, 0.13, 0.11), "pelo"), "head")
# cofia
bpy.ops.mesh.primitive_cube_add(location=(0, -0.02, HZ + 0.2), rotation=(-0.25, 0, 0))
cof = bpy.context.object; cof.name = "cofia"; cof.scale = (0.17, 0.1, 0.085)
P(finish(cof, "uniforme", 2), "head")
P(box("cofia_banda", (0, -0.118, HZ + 0.17), (0.27, 0.008, 0.024), "menta", rot=(-0.25, 0, 0)), "head")
# cara
fy = -0.175
for s in (-1, 1):
    x = s * 0.075
    P(torus(f"lente{s}", (x, fy - 0.03, HZ + 0.01), 0.064, 0.011, "gafas",
            scale=(1, 0.75, 1), rot=(math.pi / 2, s * 0.22, 0)), "head")
    P(sphere(f"punta{s}", (s * 0.128, fy - 0.022, HZ + 0.04), (0.016, 0.01, 0.011), "gafas", 1), "head")
    P(limb(f"ceja{s}", (s * 0.03, fy - 0.035, HZ + 0.075), (s * 0.11, fy - 0.025, HZ + 0.095), 0.009, "pelo"), "head")
    P(sphere(f"ojo{s}", (x, fy + 0.005, HZ + 0.005), (0.022, 0.012, 0.026), "ojo", 1), "head")
    P(sphere(f"mejilla{s}", (s * 0.12, fy + 0.03, HZ - 0.06), (0.04, 0.012, 0.028), "mejilla", 1), "head")
    P(limb(f"patilla{s}", (s * 0.135, fy - 0.02, HZ + 0.02), (s * 0.19, 0.0, HZ + 0.03), 0.007, "gafas"), "head")
P(limb("puente", (-0.015, fy - 0.03, HZ + 0.02), (0.015, fy - 0.03, HZ + 0.02), 0.008, "gafas"), "head")
P(sphere("nariz", (0, fy - 0.02, HZ - 0.04), (0.028, 0.03, 0.03), "piel"), "head")
P(sphere("boca", (0, fy + 0.012, HZ - 0.1), (0.035, 0.008, 0.009), "mejilla", 1), "head")

# brazos: hombro, codo, muñeca
ARM = {s: [(s * 0.26, 0, 1.14), (s * 0.36, -0.01, 0.88), (s * 0.37, -0.05, 0.64)] for s in (-1, 1)}
for s in (-1, 1):
    sh, el, wr = ARM[s]
    side = "L" if s > 0 else "R"
    P(sphere(f"manga{side}", sh, (0.075, 0.07, 0.075), "uniforme"), f"upper.{side}")
    P(limb(f"brazo{side}", sh, el, 0.045, "piel"), f"upper.{side}")
    c = torus(f"puno{side}", Vector(sh).lerp(Vector(el), 0.28), 0.052, 0.016, "menta")
    c.rotation_mode = "QUATERNION"; c.rotation_quaternion = (Vector(el) - Vector(sh)).to_track_quat("Z", "Y")
    P(c, f"upper.{side}")
    P(limb(f"antebrazo{side}", el, wr, 0.04, "piel"), f"fore.{side}")
    P(sphere(f"mano{side}", (wr[0], wr[1], wr[2] - 0.04), (0.045, 0.04, 0.06), "piel"), f"fore.{side}")

# carpeta en la mano derecha (lado -X), boli en la izquierda
cx, cy, cz = -0.40, -0.09, 0.58
P(box("carpeta", (cx, cy, cz), (0.02, 0.22, 0.3), "menta", rot=(0, 0, 0.25)), "fore.R")
P(box("hoja", (cx + 0.012, cy, cz - 0.01), (0.004, 0.19, 0.26), "papel", rot=(0, 0, 0.25)), "fore.R")
P(box("pinza", (cx + 0.016, cy - 0.02, cz + 0.13), (0.01, 0.07, 0.035), "metal", rot=(0, 0, 0.25)), "fore.R")
P(limb("boli", (0.37, -0.12, 0.6), (0.38, 0.03, 0.56), 0.008, "metal"), "fore.L")

# piernas y zapatos
for s in (-1, 1):
    side = "L" if s > 0 else "R"
    P(limb(f"pierna{side}", (s * 0.09, 0, 0.5), (s * 0.085, 0, 0.06), 0.045, "piel"), f"leg.{side}")
    P(sphere(f"zapato{side}", (s * 0.085, -0.035, 0.035), (0.05, 0.09, 0.035), "uniforme"), f"leg.{side}")

# ---------- esqueleto ----------
bpy.ops.object.armature_add(location=(0, 0, 0))
rig = bpy.context.object; rig.name = "Rutina"
bpy.ops.object.mode_set(mode="EDIT")
eb = rig.data.edit_bones
eb.remove(eb[0])
def bone(name, head, tail, parent=None):
    b = eb.new(name); b.head, b.tail = head, tail
    b.align_roll(Vector((0, -1, 0)))
    if parent: b.parent = eb[parent]
    return b
bone("root", (0, 0, 0), (0, 0.2, 0))
bone("spine", (0, 0, 0.5), (0, 0, 1.2), "root")
bone("head", (0, 0, 1.22), (0, 0, 1.7), "spine")
for s in (-1, 1):
    side = "L" if s > 0 else "R"
    sh, el, wr = ARM[s]
    bone(f"upper.{side}", sh, el, "spine")
    bone(f"fore.{side}", el, wr, f"upper.{side}")
    bone(f"leg.{side}", (s * 0.09, 0, 0.5), (s * 0.085, 0, 0.06), "root")
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
REPOSO = brazos(fL=(8, 0, 0), fR=(8, 0, 0))

gesto("reposo", 60, {
    1:  {"spine": Z, "head": Z, **REPOSO},
    30: {"spine": (-1.5, 0, 0), "head": (-2, 0, 3), **brazos(fL=(11, 0, 0), fR=(11, 0, 0))},
    60: {"spine": Z, "head": Z, **REPOSO},
})
gesto("asiente", 40, {
    1: {"head": Z}, 10: {"head": (14, 0, 0)}, 18: {"head": (-3, 0, 0)},
    26: {"head": (12, 0, 0)}, 40: {"head": Z},
})
gesto("niega", 48, {  # con desaprobación: niega despacio con la cabeza algo baja
    1: {"head": Z}, 10: {"head": (6, 22, 0)}, 22: {"head": (6, -22, 0)},
    34: {"head": (6, 16, 0)}, 48: {"head": Z},
})
ESCRIBE = {"head": (16, 0, -6), "spine": (4, 0, 0),
           **brazos(uL=(25, 0, -8), fL=(78, 0, 0), uR=(28, 0, 10), fR=(70, 0, 0))}
gesto("apunta", 60, {  # levanta la carpeta y escribe con el boli
    1: {"head": Z, "spine": Z, **REPOSO},
    14: ESCRIBE,
    22: {"fore.L": (82, 0, 8)}, 28: {"fore.L": (76, 0, -6)}, 34: {"fore.L": (82, 0, 8)}, 40: {"fore.L": (76, 0, -4)},
    48: ESCRIBE,
    60: {"head": Z, "spine": Z, **REPOSO},
})
gesto("impaciente", 40, {  # golpea el suelo con el pie, brazos en jarras
    1: {"leg.L": Z, "spine": Z, **REPOSO},
    8: {"leg.L": (10, 0, 0), "spine": (0, 2, 0), **brazos(uL=(0, 0, 30), fL=(60, 0, -30), uR=(0, 0, -30), fR=(60, 0, 30))},
    14: {"leg.L": Z}, 20: {"leg.L": (10, 0, 0)}, 26: {"leg.L": Z},
    32: {"spine": (0, 2, 0), **brazos(uL=(0, 0, 30), fL=(60, 0, -30), uR=(0, 0, -30), fR=(60, 0, 30))},
    40: {"spine": Z, **REPOSO},
})
gesto("sorpresa", 40, {
    1:  {"spine": Z, "head": Z, **REPOSO},
    6:  {"spine": (-7, 0, 0), "head": (-12, 0, 0), **brazos(uL=(10, 0, 42), fL=(35, 0, 0), uR=(10, 0, -42), fR=(35, 0, 0))},
    28: {"spine": (-5, 0, 0), "head": (-9, 0, 0), **brazos(uL=(8, 0, 38), fL=(30, 0, 0), uR=(8, 0, -38), fR=(30, 0, 0))},
    40: {"spine": Z, "head": Z, **REPOSO},
})
DUDA = {"head": (4, 0, -9), **brazos(uL=(48, 0, -14), fL=(125, 0, -10), uR=(28, 0, 30), fR=(96, 0, 0))}
gesto("duda", 60, {  # mano a la barbilla, cabeza ladeada
    1: {"head": Z, **REPOSO}, 14: DUDA, 30: {"head": (4, 0, -12)}, 46: DUDA,
    60: {"head": Z, **REPOSO},
})

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "rutina.blend"))

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
    for g, f in (("apunta", 22), ("sorpresa", 12), ("niega", 10), ("duda", 20), ("impaciente", 8)):
        render(os.path.join(out, f"{g}.png"), g, f)
    for t in rig.animation_data.nla_tracks: t.mute = False
    rig.animation_data.action = None

if MODE in ("export", "all"):
    bpy.ops.export_scene.gltf(filepath=os.path.join(HERE, "rutina.glb"), export_format="GLB",
                              export_apply=True, export_animation_mode="NLA_TRACKS",
                              use_selection=False, export_cameras=False, export_lights=False)

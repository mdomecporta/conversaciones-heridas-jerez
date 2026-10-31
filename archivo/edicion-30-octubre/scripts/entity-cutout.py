# Dev-only helper (Pillow + numpy): cuts the main figure out of assets/entity-concept.png.
# Usage: python3 scripts/entity-cutout.py assets/entity-concept.png assets/entity-cutout.png
import sys, numpy as np
from PIL import Image, ImageFilter, ImageDraw
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
box = (190, 20, 1330, 672)            # main figure + its shadow, from the concept sheet
im = im.crop(box)
a = np.asarray(im).astype(float)
corner = np.median(np.concatenate([a[:8].reshape(-1,3), a[:, :8].reshape(-1,3), a[:, -8:].reshape(-1,3)]), 0)
d0 = np.sqrt(((a-corner)**2).sum(2))
known = (d0 < 22).astype(float)       # pixels that look like background
# Background model by normalized convolution (fills under the figure, keeps the vignette).
def box(x, r, axis):
    c = np.cumsum(np.pad(x, [(r+1, r) if i == axis else (0, 0) for i in range(2)], mode='edge'), axis)
    return (np.take(c, range(2*r+1, c.shape[axis]), axis) - np.take(c, range(0, c.shape[axis]-2*r-1), axis))/(2*r+1)
def blur(x, r):
    r = max(1, int(r/1.7))
    for _ in range(3): x = box(box(x, r, 0), r, 1)
    return x
num = np.stack([blur(a[..., c]*known, 70) for c in range(3)], -1); den = blur(known, 70)[..., None]
bg = num/np.maximum(den, 1e-3)
d = np.sqrt(((a-bg)**2).sum(2))
lum = a @ [.3, .59, .11]; lumbg = bg @ [.3, .59, .11]
redness = a[..., 0]-a[..., 1]
rows = np.arange(a.shape[0])[:, None]
shadow = (lum < lumbg-2) & (redness < 38) & (rows > .70*a.shape[0])
low = rows > .70*a.shape[0]
fig = (d > 22) & ~shadow & ~(low & (redness < 30))
# Close gaps along the pale rim, then fill everything enclosed by the silhouette.
m = Image.fromarray((fig*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(17)).filter(ImageFilter.MinFilter(17))
w, h = m.size; canvas = Image.new('L', (w+2, h+2), 0); canvas.paste(m, (1, 1)); ImageDraw.floodfill(canvas, (0, 0), 128)
inside = (np.asarray(canvas)[1:-1, 1:-1] != 128)
# The body is a horizontal lens: fill each middle row between its outer edges.
for y in range(int(.12*h), int(.70*h)):
    xs = np.where(inside[y])[0]
    if len(xs) > 2: inside[y, xs[0]:xs[-1]+1] = True
inside = inside.astype(float)
inside = np.asarray(Image.fromarray((inside*255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.5)))/255
alpha = np.maximum(np.clip((d-8)/24, 0, 1)*(~shadow)*(~(low & (redness < 30))), inside)
A = alpha[..., None]
fg = np.where(A > .02, (a - bg*(1-A))/np.maximum(A, .02), a)
# Cut along the lower silhouette (pink body) and replace the painted shadow with a clean one.
H, W = alpha.shape
pink = (redness >= 40) & (d > 22)
bottom = np.array([np.max(np.where(pink[:int(.97*H), x])[0], initial=-1) for x in range(W)])
bottom = np.array([np.median(bottom[max(0, x-12):x+13]) for x in range(W)])
alpha = np.where(rows > (bottom[None, :]+1), 0, alpha)
alpha = np.where(rows > .70*H, alpha*(rows <= bottom[None, :]+1), alpha)
alpha = np.asarray(Image.fromarray((alpha*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.8)))/255
cols = np.where(bottom > 0)[0]; cx = (cols[0]+cols[-1])/2; rx = (cols[-1]-cols[0])*.42
yy, xx = np.mgrid[0:H, 0:W]
sh = .30*np.exp(-(((xx-cx)/rx)**2 + ((yy-.955*H)/(.035*H))**2)*1.6)
out_a = alpha + sh*(1-alpha)
col = fg*alpha[..., None] + np.array([95, 62, 55])*(sh*(1-alpha))[..., None]
col = col/np.maximum(out_a[..., None], 1e-3)
rgba = np.dstack([np.clip(col, 0, 255), out_a*255]).astype(np.uint8)
res = Image.fromarray(rgba, 'RGBA')
res = res.resize((960, round(960*res.height/res.width)), Image.LANCZOS)
res.save(out, optimize=True)
print(res.size)

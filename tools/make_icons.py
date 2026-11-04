import os
from PIL import Image, ImageDraw
R = 'android/app/src/main/res'
D = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}
TEAL = (47, 208, 184, 255)
BG = (13, 20, 25, 255)

def art(s, bg=None, shape='sq'):
    S = s * 4
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if bg:
        if shape == 'round':
            d.ellipse([0, 0, S - 1, S - 1], fill=bg)
        else:
            d.rounded_rectangle([0, 0, S - 1, S - 1], radius=S // 5, fill=bg)
    c, r, w = S / 2, S * 0.26, max(2, int(S * 0.04))
    d.ellipse([c - r, c - r, c + r, c + r], outline=TEAL, width=w)
    d.rounded_rectangle([c - w, c - r * 0.65, c + w, c + r * 0.7], radius=w, fill=TEAL)
    d.rounded_rectangle([c - r * 0.42, c - r * 0.3, c + r * 0.42, c - r * 0.3 + 2 * w], radius=w, fill=TEAL)
    return im.resize((s, s), Image.LANCZOS)

for k, m in D.items():
    p = f'{R}/mipmap-{k}'
    os.makedirs(p, exist_ok=True)
    art(int(48 * m), BG).save(f'{p}/ic_launcher.png')
    art(int(48 * m), BG, 'round').save(f'{p}/ic_launcher_round.png')
    art(int(108 * m)).save(f'{p}/ic_launcher_foreground.png')
os.makedirs(f'{R}/values', exist_ok=True)
open(f'{R}/values/ic_launcher_background.xml', 'w').write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n  <color name="ic_launcher_background">#0D1419</color>\n</resources>\n')
print('icons written')

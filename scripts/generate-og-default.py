"""
SNS 共有用の既定サムネイル（1200×630）を生成する。

  python3 -I scripts/generate-og-default.py

macOS の標準フォント（Helvetica Neue / ヒラギノ角ゴシック）を使うので、macOS で実行する。
出力: public/images/og/default.jpg
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'public/images/museums/main_museum.jpg'
OUT = ROOT / 'public/images/og/default.jpg'
W, H = 1200, 630

HELV = '/System/Library/Fonts/HelveticaNeue.ttc'
HIRA_W3 = '/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc'
HIRA_W6 = '/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc'

# デザイントークン（src/styles/global.css と合わせる）
BG = (5, 11, 10)
MAIN = (52, 178, 170)
ACCENT = (252, 250, 10)
TEXT = (223, 240, 238)
MUTED = (140, 190, 185)


def font(path, size, index=0):
    return ImageFont.truetype(path, size, index=index)


def tracked(draw, xy, text, fnt, fill, tracking):
    """字間を空けて描く（Pillow には letter-spacing が無い）。描いた右端を返す。"""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking
    return x - tracking


# ---- 背景: VR 在廊ツアーの写真を 1200×630 に切り出して少し落とす ----
photo = Image.open(SRC).convert('RGB')
scale = W / photo.width
photo = photo.resize((W, round(photo.height * scale)), Image.LANCZOS)
top = (photo.height - H) // 2
photo = photo.crop((0, top, W, top + H))
photo = ImageEnhance.Brightness(photo).enhance(0.8)

# ---- 左から右へ暗幕をかけ、文字の背面を沈める ----
shade = Image.new('L', (W, H))
for x in range(W):
    if x < 460:
        a = 240
    elif x < 900:
        a = round(240 * (1 - (x - 460) / 440) ** 1.6)
    else:
        a = 0
    for y in range(H):
        shade.putpixel((x, y), a)
img = Image.composite(Image.new('RGB', (W, H), BG), photo, shade)

d = ImageDraw.Draw(img)
X = 72

# 小見出し
tracked(d, (X, 128), 'VIRTUAL REALITY ART MUSEUM', font(HELV, 18, 10), MAIN, 4)

# ロゴ（W だけテール色）
title = font(HELV, 108, 7)
x = tracked(d, (X, 168), 'W', title, MAIN, 10)
tracked(d, (x + 10, 168), 'ESON', title, TEXT, 10)
tracked(d, (X, 286), 'MUSEUM', title, TEXT, 10)

# アクセントライン
d.rectangle((X, 438, X + 48, 440), fill=ACCENT)

# 説明
d.text((X, 462), 'VRChat に開かれた VR 美術館', font=font(HIRA_W6, 32), fill=TEXT)
d.text((X, 512), '常設4館と、作家と鑑賞者をつなぐ企画展 ARTLINK', font=font(HIRA_W3, 21), fill=MUTED)

# URL
tracked(d, (X, 568), 'weson-museum.com', font(HELV, 18, 0), MUTED, 2)

img.save(OUT, 'JPEG', quality=88, optimize=True, progressive=True)
print(OUT.relative_to(ROOT), img.size, f'{OUT.stat().st_size // 1024}KB')

import numpy as np
from PIL import Image
from collections import deque
import os

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, "ch_rac.jpg")
COLS, ROWS = 5, 2
WHITE_THRESH = 232

print("BASE =", BASE)
print("SRC exists:", os.path.exists(SRC))

im = Image.open(SRC).convert("RGBA")
W, H = im.size
arr = np.array(im)
rgb = arr[:, :, :3].astype(np.int16)
near_white = np.all(rgb >= WHITE_THRESH, axis=2)

bg = np.zeros((H, W), dtype=bool)
dq = deque()
for x in range(W):
    if near_white[0, x]: bg[0, x] = True; dq.append((0, x))
    if near_white[H-1, x]: bg[H-1, x] = True; dq.append((H-1, x))
for y in range(H):
    if near_white[y, 0]: bg[y, 0] = True; dq.append((y, 0))
    if near_white[y, W-1]: bg[y, W-1] = True; dq.append((y, W-1))
while dq:
    y, x = dq.popleft()
    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
        ny, nx = y+dy, x+dx
        if 0 <= ny < H and 0 <= nx < W and near_white[ny, nx] and not bg[ny, nx]:
            bg[ny, nx] = True; dq.append((ny, nx))

arr[:, :, 3] = np.where(bg, 0, 255).astype(np.uint8)
clean = Image.fromarray(arr, "RGBA")

cw, ch = W // COLS, H // ROWS
idx = 0
for r in range(ROWS):
    for c in range(COLS):
        cell = clean.crop((c*cw, r*ch, (c+1)*cw, (r+1)*ch))
        bbox = cell.getbbox()
        if bbox: cell = cell.crop(bbox)
        out = os.path.join(BASE, f"char_{idx}.png")
        cell.save(out)
        with open(out, "rb") as fh:
            os.fsync(fh.fileno()) if False else None
        idx += 1

print("Files now in BASE:", sorted(f for f in os.listdir(BASE) if f.endswith(".png")))

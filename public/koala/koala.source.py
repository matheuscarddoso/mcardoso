"""
Draws the koala from shapes rather than hand-typed rows, then finds the
outline. Typing a circle character by character is how the first two attempts
came out square; an ellipse test does not have that problem.
"""

import zlib, struct

K = "/private/tmp/claude-501/-Users-matheuscardoso-Projects-mcardoso/8d06488e-3334-484f-a2c4-f24f639199c5/scratchpad/koala/"

W = H = 24

FUR = (0xA9, 0xAF, 0xB6, 255)
SHADE = (0x8A, 0x90, 0x98, 255)
INNER = (0xD9, 0xA2, 0xA8, 255)
DARK = (0x33, 0x2C, 0x2B, 255)
CLEAR = (0, 0, 0, 0)


def blank():
    return [[CLEAR for _ in range(W)] for _ in range(H)]


def ellipse(px, cx, cy, rx, ry, colour):
    for y in range(H):
        for x in range(W):
            if ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1:
                px[y][x] = colour


def rect(px, x0, y0, x1, y1, colour):
    for y in range(max(0, y0), min(H, y1 + 1)):
        for x in range(max(0, x0), min(W, x1 + 1)):
            px[y][x] = colour


def outline(px):
    """Any filled pixel touching a transparent one becomes the outline."""
    out = [row[:] for row in px]
    for y in range(H):
        for x in range(W):
            if px[y][x] == CLEAR:
                continue
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if nx < 0 or ny < 0 or nx >= W or ny >= H or px[ny][nx] == CLEAR:
                    out[y][x] = DARK
                    break
    return out


def koala(bob=0):
    """`bob` shifts the whole animal down a pixel, which is the breathing."""
    px = blank()

    # Ears first, so the head paints over where they meet it.
    for cx in (4.2, 19.8):
        ellipse(px, cx, 6.4 + bob, 4.0, 4.2, FUR)
    body_top = outline(px)  # ears get their own outline before the head lands

    px = [row[:] for row in body_top]
    for cx in (4.2, 19.8):
        ellipse(px, cx, 6.6 + bob, 2.2, 2.4, INNER)

    # Body, then head on top of it, so the join needs no drawing.
    ellipse(px, 12.0, 18.6 + bob, 5.6, 4.2, FUR)
    ellipse(px, 12.0, 11.6 + bob, 6.4, 6.2, FUR)

    px = outline(px)

    # Face, painted after the outline so nothing traces around the eyes.
    rect(px, 8, int(9 + bob), 9, int(10 + bob), DARK)
    rect(px, 14, int(9 + bob), 15, int(10 + bob), DARK)
    ellipse(px, 12.0, 14.4 + bob, 2.7, 2.3, DARK)

    # A band of shade across the belly, so the body is not one flat mass.
    for y in range(H):
        for x in range(W):
            if px[y][x] == FUR and 19 + bob <= y <= 20 + bob and 8 <= x <= 15:
                px[y][x] = SHADE
    return px


def chunk(tag, data):
    c = tag + data
    return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)


def write_png(path, w, h, rows):
    raw = b"".join(b"\x00" + bytes(r) for r in rows)
    open(path, "wb").write(
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )


def flatten(px):
    return [bytearray(b"".join(bytes(c) for c in row)) for row in px]


def preview(path, px, scale, bg):
    rows = []
    for y in range(H * scale):
        row = bytearray()
        for x in range(W * scale):
            r, g, b, a = px[y // scale][x // scale]
            f = a / 255
            row += bytes(
                (
                    round(r * f + bg[0] * (1 - f)),
                    round(g * f + bg[1] * (1 - f)),
                    round(b * f + bg[2] * (1 - f)),
                    255,
                )
            )
        rows.append(row)
    write_png(path, W * scale, H * scale, rows)


if __name__ == "__main__":
    frames = [koala(0), koala(1)]

    # One sheet, frames side by side, which is what a stepped
    # `background-position` sweep wants.
    sheet = []
    for y in range(H):
        row = bytearray()
        for f in frames:
            for x in range(W):
                row += bytes(f[y][x])
        sheet.append(row)
    write_png(K + "koala.png", W * len(frames), H, sheet)

    for name, bg in (("light", (0xFC, 0xFC, 0xFC)), ("dark", (0x11, 0x11, 0x11))):
        preview(K + f"look-{name}.png", frames[0], 8, bg)
        preview(K + f"bob-{name}.png", frames[1], 8, bg)
    print("folha:", W * len(frames), "x", H)

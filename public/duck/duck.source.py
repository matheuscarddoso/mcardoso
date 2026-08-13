"""Rubber duck, drawn by hand. One frame, no animation."""

import zlib, struct

OUT = "/private/tmp/claude-501/-Users-matheuscardoso-Projects-mcardoso/8d06488e-3334-484f-a2c4-f24f639199c5/scratchpad/"

# .  nothing      #  outline     y  body      w  highlight
# o  beak         e  eye
PALETTE = {
    ".": (0, 0, 0, 0),
    "#": (0x4A, 0x35, 0x12, 255),
    "y": (0xF7, 0xC5, 0x3B, 255),
    "w": (0xFF, 0xE2, 0x8A, 255),
    "o": (0xEE, 0x8B, 0x2C, 255),
    "e": (0x2A, 0x22, 0x14, 255),
}

DUCK = [
    "....###.....",
    "...#wyy#....",
    "...#weyy#...",
    "...#wyyyooo#",
    "...#wyyyooo#",
    "...#wyyy#...",
    "..#wyyyyy#..",
    ".#wyyyyyyy#.",
    "#wyyyyyyyyy#",
    "#wyyyyyyyyy#",
    ".#yyyyyyyy#.",
    "..########..",
]

W = len(DUCK[0])
H = len(DUCK)


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


def sprite():
    return [
        bytearray(b"".join(bytes(PALETTE[c]) for c in row))
        for row in DUCK
    ]


def preview(path, scale, bg):
    rows = []
    for y in range(H * scale):
        row = bytearray()
        for x in range(W * scale):
            r, g, b, a = PALETTE[DUCK[y // scale][x // scale]]
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
    assert len({len(r) for r in DUCK}) == 1, "linhas de larguras diferentes"
    write_png(OUT + "duck.png", W, H, sprite())
    preview(OUT + "duck-light.png", 10, (0xFC, 0xFC, 0xFC))
    preview(OUT + "duck-dark.png", 10, (0x11, 0x11, 0x11))
    print(f"{W}x{H}, a 2x fica {W*2}x{H*2}px")

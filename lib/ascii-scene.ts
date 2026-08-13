/**
 * Scenes for the ASCII strip at the foot of the page.
 *
 * A scene fills a grid with indices into its own character ramp, and knows
 * nothing about the DOM, the theme or the clock. That is the whole contract:
 * swapping the illustration is swapping one object, and a new one is a single
 * `draw` away from working.
 *
 * The reference this was built against renders a .glb through three.js and a
 * GLSL shader, which is roughly 600 KB of JavaScript. Nothing here needs a
 * mesh: a torus is two angles and a dot product, and the character ramp is
 * already the only shading there is.
 */

export type Scene = {
  /**
   * Characters from dimmest to brightest. Index 0 has to be a space: it is
   * what every cell the scene does not reach stays as.
   */
  ramp: string
  /**
   * How tall the scene wants to be, in rows, for a grid this many columns
   * wide. The strip asks before it allocates, so a scene sets its own
   * proportions instead of being handed a box and stretched into it.
   */
  rows(cols: number, cellAspect: number): number
  /**
   * Fills `cells` with one ramp index per cell, row-major.
   *
   * `cellAspect` is the character box's height over its width, near 1.7 for a
   * monospace face at a line height of one. Without it every scene comes out
   * stretched sideways, because a grid of characters is not a grid of squares.
   *
   * `time` is in seconds.
   */
  draw(
    cells: Uint8Array,
    cols: number,
    rows: number,
    cellAspect: number,
    time: number
  ): void
}

type Ring = { cos: Float32Array; sin: Float32Array }

/**
 * Precomputed cosine and sine around a full turn.
 *
 * The torus samples two angles tens of thousands of times a frame and the
 * angles never change, only the rotation applied to them. Computing the pair
 * once turns the inner loop into multiply-adds.
 */
function ring(steps: number): Ring {
  const cos = new Float32Array(steps)
  const sin = new Float32Array(steps)
  for (let i = 0; i < steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2
    cos[i] = Math.cos(angle)
    sin[i] = Math.sin(angle)
  }
  return { cos, sin }
}

/**
 * How finely the surface is sampled depends on how large it is drawn, so the
 * rings are built on demand and kept. Step counts are rounded to a multiple of
 * 32 first: a resize should reuse a ring, not mint one per pixel of width.
 */
const rings = new Map<number, Ring>()

function ringOf(steps: number): Ring {
  const key = Math.min(4096, Math.max(64, Math.round(steps / 32) * 32))
  let cached = rings.get(key)
  if (!cached) {
    cached = ring(key)
    rings.set(key, cached)
  }
  return cached
}

/** Tube radius and ring radius. The torus's axis points at the viewer. */
const R1 = 1
const R2 = 2

/**
 * Face-on diameter as a share of the strip's width, and so of the viewport.
 *
 * The visible arc comes out narrower than this: the ring only reaches its full
 * width at the middle, which is three quarters of the way down and off the
 * grid. A ring the width of the viewport shows an arc about nine tenths of it,
 * which is what leaves the ends dissolving into the mask at either edge rather
 * than stopping short of it.
 *
 * Raising this widens the arc and deepens the strip together. They are the
 * same number: a quarter of a circle is as tall as it is wide, in proportion.
 */
const SPAN = 1.05

/**
 * How much of the torus is on screen, measured down from its top edge. The
 * other three quarters are below the fold of the page and never drawn.
 */
const REVEAL = 0.25

/**
 * Samples per cell along each of the two surface directions. Tuned by counting
 * unpainted cells inside the silhouette across a full cycle: below this the
 * surface shows pinholes, above it the count stops moving.
 */
const DENSITY = 1.8

/**
 * How far the ring leans away from the viewer, and how much that lean drifts.
 *
 * The lean is what stops the arc reading as a flat band: it foreshortens the
 * ring so the far side rides higher than the near one. The drift is slow
 * enough to notice only if you stop and look at it.
 */
const LEAN = 0.42
const DRIFT = 0.13
const DRIFT_RATE = 0.21

/**
 * The light circles the scene once every twenty-odd seconds.
 *
 * This is the whole animation. A torus turned about its own axis maps onto
 * itself, so spinning one in place is indistinguishable from leaving it alone;
 * the illustration has to move the light instead. It also means the arc itself
 * never shifts by a pixel, which is the point of pinning it to the foot of the
 * page.
 */
const LIGHT_RATE = 0.3
/** Kept above the horizon, so the arc is never lit entirely from behind. */
const LIGHT_HEIGHT = 0.42

/**
 * Floor under the lighting, so a surface facing away from the light still
 * draws at the faintest character instead of dropping out.
 *
 * Without it the arc is only as long as the lit part of it, and the ends
 * appear and disappear as the light comes round: what should read as light
 * moving across a fixed shape reads as the shape itself growing and
 * shrinking.
 */
const AMBIENT = 0.14

/** The torus's full face-on diameter, in rows. */
function diameter(cols: number, cellAspect: number): number {
  return (SPAN * cols) / cellAspect
}

/**
 * Depth per cell, reused across frames. A fresh array every frame would be
 * about a megabyte a second of garbage for a decoration.
 */
let depth = new Float32Array(0)

/**
 * The rotating torus, cropped to its top quarter.
 *
 * This is the 1980s donut, kept honest: the same two rotations, the same
 * surface normal for lighting, the same painter's fix of a depth buffer, with
 * the light coming from behind the viewer's shoulder. What changed is where it
 * sits. The whole shape is wider than the viewport and centred well below the
 * last line of the page, so the strip catches the top of it and the rest never
 * reaches the grid. It reads as an arc; it is a torus that mostly missed.
 */
export const TORUS: Scene = {
  ramp: " .,-~:;=!*#$@",

  rows(cols, cellAspect) {
    return Math.max(1, Math.round(diameter(cols, cellAspect) * REVEAL))
  },

  draw(cells, cols, rows, cellAspect, time) {
    cells.fill(0)

    const count = cols * rows
    if (depth.length < count) depth = new Float32Array(count)
    depth.fill(-Infinity, 0, count)

    const lean = LEAN + Math.sin(time * DRIFT_RATE) * DRIFT
    const cosL = Math.cos(lean)
    const sinL = Math.sin(lean)

    /* Circling the scene at a fixed height above it. */
    const angle = time * LIGHT_RATE
    const flat = Math.sqrt(1 - LIGHT_HEIGHT * LIGHT_HEIGHT)
    const lx = Math.cos(angle) * flat
    const ly = LIGHT_HEIGHT
    const lz = Math.sin(angle) * flat

    const span = diameter(cols, cellAspect)
    /* Rows per scene unit. Orthographic on purpose: under perspective the far
       side of a leaning ring projects smaller than the near one, and the arc
       stops being symmetric about the middle of the page. */
    const unit = span / (2 * (R1 + R2))
    /*
     * The highest point the surface reaches at this lean, so the top of the
     * arc sits on row zero however far it leans. Solved rather than measured:
     * down the top of the ring the height is R2·cos(lean) + R1·cos(t + lean),
     * which peaks at R2·cos(lean) + R1.
     */
    const top = R2 * cosL + R1

    /* Around the ring the surface spans the full width; across the tube it
       spans a third of that, and rows are the taller axis. Each direction gets
       the density its own projected size needs. */
    const sweep = ringOf(Math.PI * SPAN * cols * DENSITY)
    const tube = ringOf(Math.PI * (span / 3) * cellAspect * DENSITY)
    const shades = this.ramp.length - 1

    for (let i = 0; i < tube.cos.length; i += 1) {
      const cosT = tube.cos[i]
      const sinT = tube.sin[i]
      /* How far this point on the tube sits from the ring's axis, and how far
         along that axis. The normal is the tube's own outward direction, which
         is why it costs a multiply rather than a cross product. */
      const radius = R2 + R1 * cosT
      const alongAxis = R1 * sinT

      for (let j = 0; j < sweep.cos.length; j += 1) {
        const cosP = sweep.cos[j]
        const sinP = sweep.sin[j]

        /* Point and normal both lean back by the same rotation about the
           horizontal axis, which is the one rotation that leaves the ring's
           width, and so the arc's, exactly where it was. */
        const flatY = radius * sinP
        const y = flatY * cosL - alongAxis * sinL
        const row = (unit * (top - y)) | 0
        /* Rejected first and cheapest: at this crop three quarters of the
           surface is below the strip, and a sample that cannot land is not
           worth projecting sideways or lighting. */
        if (row < 0 || row >= rows) continue

        const col = (cols / 2 + unit * radius * cosP * cellAspect) | 0
        if (col < 0 || col >= cols) continue

        const cell = row * cols + col
        const z = flatY * sinL + alongAxis * cosL
        /* Nearest wins, and it wins before it is lit: whether this patch faces
           the light has no bearing on whether it is the one in front. */
        if (z <= depth[cell]) continue
        depth[cell] = z

        const flatNy = cosT * sinP
        const lum =
          cosT * cosP * lx +
          (flatNy * cosL - sinT * sinL) * ly +
          (flatNy * sinL + sinT * cosL) * lz

        /* Both the normal and the light are unit length, so this runs to one
           and the last ramp character is reached exactly head-on. */
        const shade = lum > 0 ? AMBIENT + (1 - AMBIENT) * lum : AMBIENT
        const step = 1 + ((shade * shades) | 0)
        cells[cell] = step > shades ? shades : step
      }
    }
  },
}

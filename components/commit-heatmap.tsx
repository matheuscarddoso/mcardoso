const HEATMAP_COLUMNS = 140
const HEATMAP_ROWS = 7
/** Share of cells that light up. */
const HEATMAP_DENSITY = 0.18

/** Cell edge and gutter, in px — the lattice every coordinate below falls on. */
const CELL = 11
const GAP = 4
const RADIUS = 3

const STEP = CELL + GAP
const WIDTH = HEATMAP_COLUMNS * CELL + (HEATMAP_COLUMNS - 1) * GAP
const HEIGHT = HEATMAP_ROWS * CELL + (HEATMAP_ROWS - 1) * GAP

const LEVELS = [0, 1, 2, 3, 4] as const

/**
 * Seeded LCG — the grid must be identical on the server and the client,
 * so `Math.random` is off the table (it would mismatch on hydration).
 */
function buildHeatmap(): number[][] {
  let state = 20260728
  const next = () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    return state / 0x7fffffff
  }

  return Array.from({ length: HEATMAP_COLUMNS }, () =>
    Array.from({ length: HEATMAP_ROWS }, () =>
      next() < HEATMAP_DENSITY ? 1 + Math.floor(next() * 4) : 0
    )
  )
}

/**
 * One path per level, holding every cell at that level.
 *
 * The rounded corner comes from the stroke, not from `rx`: a 5×5 square
 * stroked at width 6 with a round join paints exactly an 11×11 square with a
 * 3px radius, and costs `M{x} {y}h5v5h-5z` instead of four arc commands. Nine
 * hundred and eighty `<div>`s collapse into five nodes and a third of the
 * bytes, which is most of this page's DOM and most of its style-recalc cost.
 */
function buildPaths(): string[] {
  const grid = buildHeatmap()
  const paths = LEVELS.map(() => "")

  for (let column = 0; column < HEATMAP_COLUMNS; column++) {
    const x = column * STEP + RADIUS
    for (let row = 0; row < HEATMAP_ROWS; row++) {
      const y = row * STEP + RADIUS
      const inner = CELL - RADIUS * 2
      paths[grid[column][row]] += `M${x} ${y}h${inner}v${inner}h-${inner}z`
    }
  }

  return paths
}

const PATHS = buildPaths()

export function CommitHeatmap() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 -z-10 h-[600px] w-full overflow-hidden"
    >
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="absolute top-[-40px] right-0 opacity-50"
        role="presentation"
      >
        {PATHS.map((d, level) => (
          <path
            key={level}
            d={d}
            className={`heatmap-level-${level}`}
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={RADIUS * 2}
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
    </div>
  )
}

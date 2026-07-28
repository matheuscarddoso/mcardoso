const HEATMAP_COLUMNS = 140
const HEATMAP_ROWS = 7
/** Share of cells that light up. */
const HEATMAP_DENSITY = 0.18

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

const HEATMAP = buildHeatmap()

export function CommitHeatmap() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 -z-10 h-[600px] w-full overflow-hidden"
    >
      <div className="absolute top-[-40px] right-0 flex w-max gap-1 opacity-50">
        {HEATMAP.map((column, columnIndex) => (
          <div key={columnIndex} className="flex shrink-0 flex-col gap-1">
            {column.map((level, rowIndex) => (
              <div key={rowIndex} className={`heatmap-cell level-${level}`} />
            ))}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
    </div>
  )
}

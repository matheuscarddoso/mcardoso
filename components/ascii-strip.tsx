"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"
import { TORUS, type Scene } from "@/lib/ascii-scene"

/**
 * The ASCII illustration across the bottom of the page.
 *
 * To change the illustration, change this line. Everything below measures a
 * grid, runs a clock and prints characters; it has no idea what it is drawing.
 */
const SCENE: Scene = TORUS

/**
 * The character box, in pixels. Both are fixed rather than read back from CSS
 * so the grid arithmetic has no dependency on how `line-height: 1` happens to
 * resolve, which is the one computed value browsers disagree about.
 */
const FONT_SIZE = 11
const LINE_HEIGHT = 11

/**
 * Redraws a second. A torus at 24 reads as motion and leaves the frame budget
 * alone; at 60 it looks the same and costs two and a half times as much, which
 * is a bad trade for something nobody came here to watch.
 */
const FPS = 24
const FRAME_MS = 1000 / FPS

/**
 * Width of one character, measured rather than assumed: it is a property of
 * the loaded face, and the usual 0.6em guess is wrong often enough to skew the
 * whole grid a few columns.
 */
function measureCell(fontFamily: string): number {
  const context = document.createElement("canvas").getContext("2d")
  if (!context) return FONT_SIZE * 0.6

  context.font = `${FONT_SIZE}px ${fontFamily}`
  const sample = "0".repeat(32)
  const width = context.measureText(sample).width / sample.length
  return width > 0 ? width : FONT_SIZE * 0.6
}

export function AsciiStrip() {
  const ref = React.useRef<HTMLPreElement>(null)
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    const pre = ref.current
    if (!pre) return

    let cells = new Uint8Array(0)
    let cols = 0
    let rows = 0
    /* Height over width of one character. Without it the torus comes out
       stretched, because a grid of characters is not a grid of squares. */
    let cellAspect = LINE_HEIGHT / (FONT_SIZE * 0.6)
    /* Not zero: at zero the torus is edge-on and paints as a flat bar, which
       is the one frame nobody should arrive to. A turn and a bit in, it is
       unmistakably a torus. */
    let clock = 1.4
    let onScreen = true
    let frame = 0
    let live = true

    const paint = () => {
      if (cols < 1) return
      SCENE.draw(cells, cols, rows, cellAspect, clock)

      const ramp = SCENE.ramp
      let out = ""
      for (let y = 0; y < rows; y += 1) {
        if (y > 0) out += "\n"
        const start = y * cols
        for (let x = 0; x < cols; x += 1) out += ramp[cells[start + x]]
      }
      pre.textContent = out
    }

    /**
     * Reads the grid out of the box CSS already gave the element, and never
     * writes a size back. The strip's height comes from an aspect ratio in the
     * stylesheet, so it is correct on the first paint and nothing here can
     * move the page under a reader who is already on it.
     */
    const measure = () => {
      const charWidth = measureCell(getComputedStyle(pre).fontFamily)
      const nextCols = Math.max(1, Math.floor(pre.clientWidth / charWidth))
      const nextRows = Math.max(1, Math.floor(pre.clientHeight / LINE_HEIGHT))
      if (nextCols === cols && nextRows === rows) return false

      cols = nextCols
      rows = nextRows
      cellAspect = LINE_HEIGHT / charWidth
      cells = new Uint8Array(cols * rows)
      return true
    }

    measure()

    /* Reduced motion gets one frame and no loop. The illustration is still
       there, it just does not move, which is the whole request. */
    if (reduceMotion) {
      paint()
      return
    }

    let last = 0
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (!onScreen) return
      if (now - last < FRAME_MS) return
      last = now
      /* A fixed step rather than the elapsed time: a dropped frame should slow
         the tumble by one frame, never teleport it. */
      clock += FRAME_MS / 1000
      paint()
    }

    frame = requestAnimationFrame(tick)

    /* Nothing to draw while the footer is below the fold, which on this site
       is most of the visit. */
    const seen = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
      },
      { rootMargin: "120px" }
    )
    seen.observe(pre)

    const resized = new ResizeObserver(() => {
      if (measure()) paint()
    })
    resized.observe(pre)

    /* The grid is measured off a font that may not have arrived yet, and the
       fallback face is a different width. */
    document.fonts?.ready.then(() => {
      if (!live) return
      if (measure()) paint()
    })

    return () => {
      live = false
      cancelAnimationFrame(frame)
      seen.disconnect()
      resized.disconnect()
    }
  }, [reduceMotion])

  return (
    <pre
      ref={ref}
      aria-hidden
      /*
       * Dissolves into the page at both ends rather than stopping at a hard
       * edge, so the strip reads as something the page fades into rather than
       * a panel bolted to the bottom of it.
       */
      style={{
        fontSize: FONT_SIZE,
        lineHeight: `${LINE_HEIGHT}px`,
        /* The scene's own proportion, held from the first paint so the page is
           its final height before the browser restores a scroll position. */
        aspectRatio: 1 / SCENE.ratio,
        color: "var(--color-gray-900)",
        maskImage:
          "linear-gradient(to right, transparent, black 14%, black 86%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 14%, black 86%, transparent)",
      }}
      className="w-full overflow-hidden font-mono whitespace-pre select-none"
    />
  )
}

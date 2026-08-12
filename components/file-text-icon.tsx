"use client"

import * as React from "react"
import { motion, useAnimation, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export interface FileTextIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface FileTextIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
  /**
   * Redraw the three lines forever instead of only while hovered. The button
   * on the home page uses this; a control that has to earn a glance in a page
   * of static type is the case that justifies perpetual motion.
   */
  loop?: boolean
}

/** One line's sweep. */
const DRAW_DURATION = 0.7

/** Rest between sweeps, so the loop reads as a recurring gesture, not a strobe. */
const LOOP_REST = 1.4

/**
 * Each line starts a fifth of a second after the one above it. `delay` applies
 * to the first pass only — every repeat after that is spaced by `repeatDelay`
 * — so all three share one period and keep the stagger they opened with.
 */
const LINE_DELAYS = [0.3, 0.5, 0.7] as const

const LINES = ["M10 9H8", "M16 13H8", "M16 17H8"] as const

function lineVariants(delay: number, loop: boolean) {
  return {
    normal: { pathLength: 1 },
    animate: {
      pathLength: [1, 0, 1],
      transition: {
        duration: DRAW_DURATION,
        delay,
        ...(loop ? { repeat: Infinity, repeatDelay: LOOP_REST } : {}),
      },
    },
  }
}

const FileTextIcon = React.forwardRef<FileTextIconHandle, FileTextIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, loop = false, ...props }, ref) => {
    const controls = useAnimation()
    const isControlledRef = React.useRef(false)
    const shouldReduceMotion = useReducedMotion()

    React.useImperativeHandle(ref, () => {
      isControlledRef.current = true

      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      }
    })

    /*
     * A perpetual animation is exactly what the reduced-motion setting is
     * asking about, so the loop is the one thing that never starts under it —
     * the icon still reads as a document, it just holds still.
     */
    React.useEffect(() => {
      if (!loop || shouldReduceMotion) return
      controls.start("animate")
    }, [loop, shouldReduceMotion, controls])

    const handleMouseEnter = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) onMouseEnter?.(event)
        // Already running — restarting mid-sweep would jump the line.
        else if (!loop) controls.start("animate")
      },
      [controls, loop, onMouseEnter]
    )

    const handleMouseLeave = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) onMouseLeave?.(event)
        else if (!loop) controls.start("normal")
      },
      [controls, loop, onMouseLeave]
    )

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.svg
          animate={controls}
          fill="none"
          height={size}
          width={size}
          initial="normal"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          /*
           * The page's own hover already scales the button, so the sheet holds
           * its size — two scales on one press read as a wobble.
           */
          variants={{ normal: { scale: 1 }, animate: { scale: 1 } }}
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          {LINES.map((d, index) => (
            <motion.path key={d} d={d} variants={lineVariants(LINE_DELAYS[index], loop)} />
          ))}
        </motion.svg>
      </div>
    )
  }
)

FileTextIcon.displayName = "FileTextIcon"

export { FileTextIcon }

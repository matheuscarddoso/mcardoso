"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion, useSpring } from "motion/react"
import type { ContributionYear } from "@/lib/github"
import { MONTH_NAMES_LONG, type Language } from "@/lib/locale"

const LEVELS = [0, 1, 2, 3, 4] as const

/**
 * The travel between squares. Apple's duration/bounce form rather than
 * stiffness/damping: the distance changes with every move — one square across,
 * or half the year — and a spring is the only thing that stays in character
 * over both. A little bounce keeps it alive; more than this and it wobbles
 * under a pointer that is still moving.
 */
const TRAVEL_SPRING = { duration: 0.32, bounce: 0.12 } as const

/** The fade on either end. Short enough to read as instant against the travel. */
const TOOLTIP_IN = { duration: 0.14, ease: [0.23, 1, 0.32, 1] } as const

/**
 * The tooltip sets the count apart from the date, so the number reads first.
 * They stay separate strings rather than one sentence with markup in it,
 * because where the date sits in that sentence is a per-language decision.
 */
type DayLabel = { count: string; date: string }

type GraphCopy = {
  /** Takes the total already grouped, so the separator travels with the language. */
  total: (formatted: string) => string
  groupSeparator: string
  less: string
  more: string
  day: (count: number, month: number, dayOfMonth: number, year: number) => DayLabel
}

const copy: Record<Language, GraphCopy> = {
  PT: {
    total: (n) => `${n} contribuições no último ano`,
    groupSeparator: ".",
    less: "Menos",
    more: "Mais",
    day: (count, month, dayOfMonth, year) => ({
      count:
        count === 0
          ? "Nenhuma contribuição"
          : `${count} ${count === 1 ? "contribuição" : "contribuições"}`,
      date: `em ${dayOfMonth} de ${MONTH_NAMES_LONG.PT[month]} de ${year}`,
    }),
  },
  EN: {
    total: (n) => `${n} contributions in the last year`,
    groupSeparator: ",",
    less: "Less",
    more: "More",
    day: (count, month, dayOfMonth, year) => ({
      count:
        count === 0
          ? "No contributions"
          : `${count} ${count === 1 ? "contribution" : "contributions"}`,
      date: `on ${MONTH_NAMES_LONG.EN[month]} ${dayOfMonth}, ${year}`,
    }),
  },
  ES: {
    total: (n) => `${n} contribuciones en el último año`,
    groupSeparator: ".",
    less: "Menos",
    more: "Más",
    day: (count, month, dayOfMonth, year) => ({
      count:
        count === 0
          ? "Sin contribuciones"
          : `${count} ${count === 1 ? "contribución" : "contribuciones"}`,
      date: `el ${dayOfMonth} de ${MONTH_NAMES_LONG.ES[month]} de ${year}`,
    }),
  },
}

/**
 * Grouped by hand rather than through `toLocaleString`: this number renders on
 * the server and again in the browser, and the two only agree if they carry
 * the same ICU data.
 */
function groupDigits(value: number, separator: string): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

/**
 * The cell the tooltip is describing, in coordinates relative to the grid
 * wrapper. Where the tooltip actually sits is derived from this once its own
 * size is known — see the layout effect.
 */
type Tip = DayLabel & { cellX: number; cellY: number }

/** Gap between the tooltip's underside and the square it points at. */
const TOOLTIP_OFFSET = 8

export function ContributionGraph({
  data,
  language,
}: {
  data: ContributionYear
  language: Language
}) {
  const t = copy[language]
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const tipRef = React.useRef<HTMLDivElement>(null)
  const [tip, setTip] = React.useState<Tip | null>(null)
  const shouldReduceMotion = useReducedMotion()

  /*
   * Position lives in motion values rather than state, which is what makes the
   * travel between squares free: setting one retargets the running spring and
   * drives the transform directly, without a React render behind it. Only the
   * label is state, and only the label re-renders.
   */
  const x = useSpring(0, TRAVEL_SPRING)
  const y = useSpring(0, TRAVEL_SPRING)

  /*
   * The first square of a hover is arrived at, not travelled to — springing in
   * from wherever the last hover ended would have the tooltip fly across the
   * card before it says anything.
   */
  const arriving = React.useRef(true)

  /*
   * The tooltip is centred over its square and sits above it, so both offsets
   * need its own measurements — and the text, which is what sets its width,
   * only exists after the render. `useLayoutEffect` puts the correction in the
   * same frame, so it is never seen at the wrong place.
   */
  React.useLayoutEffect(() => {
    const wrap = wrapRef.current
    const tooltip = tipRef.current
    if (!tip || !wrap || !tooltip) return

    // Clamped to the card, so a square near either end doesn't push the
    // tooltip out over the edge.
    const width = tooltip.offsetWidth
    const left = Math.min(Math.max(tip.cellX - width / 2, 0), wrap.offsetWidth - width)
    const top = tip.cellY - tooltip.offsetHeight - TOOLTIP_OFFSET

    if (arriving.current || shouldReduceMotion) {
      x.jump(left)
      y.jump(top)
      arriving.current = false
    } else {
      x.set(left)
      y.set(top)
    }
  }, [tip, x, y, shouldReduceMotion])

  /*
   * One listener on the grid rather than 371 on the cells. Empty slots in the
   * trailing week carry no `data-date`, so they fall out here for free.
   */
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-date]")
    const date = cell?.dataset.date
    if (!wrap || !cell || !date) return

    const [year, month, dayOfMonth] = date.split("-").map(Number)
    const box = wrap.getBoundingClientRect()
    const rect = cell.getBoundingClientRect()

    setTip({
      ...t.day(Number(cell.dataset.count), month - 1, dayOfMonth, year),
      cellX: rect.left - box.left + rect.width / 2,
      cellY: rect.top - box.top,
    })
  }

  const handlePointerLeave = () => {
    setTip(null)
    arriving.current = true
  }

  /*
   * Three hundred and seventy-one cells, held still across every tooltip
   * render — without this, moving the pointer one square over rebuilds the
   * whole grid.
   */
  const grid = React.useMemo(
    () =>
      data.weeks.map((week, column) => (
        <div key={column} className="contrib-week">
          {week.map((day, row) =>
            day ? (
              <span
                key={day.date}
                data-date={day.date}
                data-count={day.count}
                className={`contrib-cell level-${day.level}`}
              />
            ) : (
              // Days past today keep their slot, so every row stays the
              // weekday it started as.
              <span key={`empty-${row}`} className="contrib-cell invisible" />
            )
          )}
        </div>
      )),
    [data]
  )

  return (
    <div className="rounded-xl bg-preview-bg p-2.5 shadow-custom">
      <div ref={wrapRef} className="relative">
        {/*
          The squares are decoration and the sentence below carries the meaning,
          so the grid stays out of the accessibility tree rather than offering a
          screen reader 371 unlabelled stops.
        */}
        <div
          aria-hidden
          className="contrib-year"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          {grid}
        </div>
        <AnimatePresence>
          {tip && (
            <motion.div
              key="contribution-tip"
              aria-hidden
              /*
               * Travel lives on this node and the fade on the one inside.
               * `x`/`y` are the springs, so Motion writes this transform on
               * every frame — nothing else may be written here.
               */
              style={{ x, y }}
              className="pointer-events-none absolute top-0 left-0 z-20"
            >
              <motion.div
                ref={tipRef}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={shouldReduceMotion ? { duration: 0.1 } : TOOLTIP_IN}
                // Grows out of the square it describes, not out of thin air.
                style={{ transformOrigin: "50% 100%" }}
                className="rounded-lg bg-preview-bg px-2.5 py-1.5 text-xs leading-4 whitespace-nowrap shadow-card-lift"
              >
                <span className="font-medium text-gray-1200">{tip.count}</span>{" "}
                <span className="text-gray-1000">{tip.date}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-xs text-gray-1100 transition-colors duration-200 hover:text-gray-1200"
        >
          {t.total(groupDigits(data.total, t.groupSeparator))}
        </a>
        <div
          aria-hidden
          className="flex shrink-0 items-center gap-1 text-[11px] leading-none text-gray-1000"
        >
          <span>{t.less}</span>
          {LEVELS.map((level) => (
            <span key={level} className={`contrib-cell level-${level} size-2.5`} />
          ))}
          <span>{t.more}</span>
        </div>
      </div>
    </div>
  )
}

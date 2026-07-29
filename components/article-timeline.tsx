"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"
import type { Language } from "@/lib/locale"

const LABEL = {
  PT: "Seções deste texto",
  EN: "Sections in this piece",
  ES: "Secciones de este texto",
} as const

/** The article's own headings, in document order. */
const SELECTOR = "article :is(h1, h2)[id]"

/** Fraction of the viewport height that counts as the reading line. */
const READING_LINE = 0.25

type Section = { id: string; label: string }

/**
 * A dash per heading, fixed to the left edge, with the section you're reading
 * marked. Hovering or focusing a dash scrolls to that section, so the strip
 * doubles as a scrubber.
 *
 * Desktop only (`lg` and up). On a narrow screen there is no gutter to put it
 * in, and a 2px hover target is meaningless on touch.
 *
 * The sections are read out of the rendered DOM rather than passed in per
 * article. A parallel list would be one more thing to keep in sync with the
 * prose, and it would drift silently the first time a section was added.
 */
export function ArticleTimeline({ language }: { language: Language }) {
  const [sections, setSections] = React.useState<Section[]>([])
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR))
    if (headings.length === 0) return

    setSections(
      headings.map((heading) => ({
        id: heading.id,
        label: heading.textContent?.trim() ?? heading.id,
      }))
    )

    /*
     * The last heading whose top has passed the reading line. A plain scan
     * rather than an IntersectionObserver: observers tell you what is
     * intersecting, which leaves gaps where a long section fills the viewport
     * and nothing is marked. This always resolves to exactly one section.
     *
     * Reads only, batched into a frame, so it can't thrash layout — and
     * `setActiveId` with an unchanged id is a no-op in React, so the common
     * case of scrolling within one section re-renders nothing.
     */
    let frame = 0

    const update = () => {
      frame = 0
      const line = window.innerHeight * READING_LINE
      let current = headings[0].id
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > line) break
        current = heading.id
      }
      setActiveId(current)
    }

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame !== 0) cancelAnimationFrame(frame)
    }
  }, [])

  const goTo = React.useCallback(
    (id: string) => {
      // `scroll-mt-20` on the headings supplies the headroom.
      document.getElementById(id)?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      })
    },
    [reduceMotion]
  )

  if (sections.length === 0) return null

  return (
    <nav
      aria-label={LABEL[language]}
      className="fixed top-1/2 left-6 z-20 hidden -translate-y-1/2 lg:block"
    >
      {/* No gap between items: the buttons' own padding does the spacing, which
          leaves the strip continuous so dragging down it never hits a dead zone. */}
      <ul className="flex flex-col">
        {sections.map((section) => {
          const active = section.id === activeId
          return (
            <li key={section.id} className="flex">
              <button
                type="button"
                onMouseEnter={() => goTo(section.id)}
                onFocus={() => goTo(section.id)}
                onClick={() => goTo(section.id)}
                aria-label={section.label}
                aria-current={active ? "true" : undefined}
                className="group cursor-pointer px-2 py-[5px] focus-visible:outline-none"
              >
                <span
                  className={`block h-[2px] rounded-full transition-[width,opacity] duration-300 ease-[var(--ease-out-strong)] group-focus-visible:opacity-100 ${
                    active
                      ? "w-6 bg-foreground opacity-100"
                      : "w-3.5 bg-foreground opacity-25 group-hover:opacity-60"
                  }`}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

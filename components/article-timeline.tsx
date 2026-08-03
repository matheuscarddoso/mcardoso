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

/**
 * The label column, and with it the width of the open panel. Tied to the
 * viewport so the labels always stop short of the prose instead of covering it:
 * the article is 40rem wide and centred, so the gutter is `50vw - 20rem`, less
 * the 1.5rem inset, the 2.5rem dash column and a little air. It reaches its
 * full width around 1170px, and every section heading fits inside it from
 * there — at the narrow end only the article's own title is cut.
 */
const LABEL_WIDTH = "clamp(6.5rem, calc(50vw - 24rem), 12.5rem)"

/**
 * What's cut fades out rather than ending in an ellipsis — the same amount of
 * information, without the notch a row of "…" would put in the ragged edge.
 */
const FADE = "linear-gradient(to right, #000 calc(100% - 1.25rem), transparent)"

/** Between each label as the panel opens. Ten sections, so 150ms at the tail. */
const STAGGER_MS = 15

type Section = { id: string; label: string }

/**
 * A dash per heading, fixed to the left edge, with the section you're reading
 * marked. At rest it is only the strip of dashes; pointing at it unfolds the
 * headings, and clicking one jumps there.
 *
 * Unfolding is all the pointer does. The strip used to scroll to whichever dash
 * it touched, which meant crossing the gutter on the way somewhere else threw
 * you out of the paragraph you were reading. Now hovering shows you the
 * sections and the click picks one.
 *
 * Nothing labels the strip, and it has no button to open it. Both would be
 * permanent furniture in the margin of a page whose whole job is to hold one
 * column of prose, and neither says anything the dashes and the headings don't
 * already say the moment you go near them.
 *
 * Desktop only (`lg` and up). On a narrow screen there is no gutter to put it
 * in, and a 2px dash is meaningless on touch.
 *
 * The sections are read out of the rendered DOM rather than passed in per
 * article. A parallel list would be one more thing to keep in sync with the
 * prose, and it would drift silently the first time a section was added.
 */
export function ArticleTimeline({ language }: { language: Language }) {
  const [sections, setSections] = React.useState<Section[]>([])
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const navRef = React.useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const open = hovered || focused

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

  /*
   * Tabbing into a closed strip lands on a dash with no text next to it, so
   * keyboard focus unfolds it as well. Only real keyboard focus:
   * `:focus-visible` is what separates it from the focus a click leaves behind,
   * which would otherwise hold the panel open after every jump.
   */
  const onFocus = React.useCallback((event: React.FocusEvent) => {
    if (event.target instanceof HTMLElement && event.target.matches(":focus-visible")) {
      setFocused(true)
    }
  }, [])

  const onBlur = React.useCallback((event: React.FocusEvent) => {
    if (!navRef.current?.contains(event.relatedTarget)) setFocused(false)
  }, [])

  if (sections.length === 0) return null

  const label =
    "absolute top-1/2 left-7 w-[calc(var(--toc-label)+0.75rem)] -translate-y-1/2 overflow-hidden py-1 pl-3 text-left text-[13px] leading-5 whitespace-nowrap transition-[opacity,translate] duration-300 ease-[var(--ease-out-strong)] motion-reduce:transition-none"
  const labelState = open
    ? "pointer-events-auto translate-x-0 opacity-100"
    : "pointer-events-none -translate-x-1 opacity-0"

  return (
    <nav
      ref={navRef}
      aria-label={LABEL[language]}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={onFocus}
      onBlur={onBlur}
      /*
       * The labels are positioned out of flow, so the box would otherwise be
       * the 28px of the dashes and the pointer would fall out of it the moment
       * it reached a label. Open, the box is the whole panel; closed, it is a
       * forgiving strip — wider than the dashes, narrow enough that reaching
       * for the edge of the window doesn't unfold it. No transition on the
       * width: it has to be there before the pointer is, not after.
       */
      style={
        {
          "--toc-label": LABEL_WIDTH,
          width: open ? "calc(1.75rem + 0.75rem + var(--toc-label))" : "4rem",
        } as React.CSSProperties
      }
      className="fixed top-1/2 left-6 z-20 hidden -translate-y-1/2 select-none lg:block"
    >
      {/* No gap between rows: each row's own height does the spacing, which
          leaves the strip continuous so running down it never hits a dead zone. */}
      <ul className="flex flex-col">
        {sections.map((section, index) => {
          const active = section.id === activeId
          return (
            <li key={section.id} className="flex">
              <button
                type="button"
                onClick={() => goTo(section.id)}
                aria-label={section.label}
                aria-current={active ? "true" : undefined}
                className={`group relative flex w-7 cursor-pointer items-center transition-[height] duration-300 ease-[var(--ease-out-strong)] focus-visible:outline-none motion-reduce:transition-none ${
                  open ? "h-7" : "h-3"
                }`}
              >
                <span
                  className={`block h-[2px] rounded-full bg-foreground transition-[width,opacity] duration-300 ease-[var(--ease-out-strong)] group-focus-visible:opacity-100 motion-reduce:transition-none ${
                    active ? "w-7 opacity-100" : "w-3.5 opacity-25 group-hover:opacity-60"
                  }`}
                />
                {/* Two spans: the outer one carries the staggered reveal, the
                    inner one the colour. Sharing a transition would put the
                    row's stagger delay on its hover colour as well, and the
                    last row would take 150ms to answer the pointer. */}
                <span
                  style={{
                    maskImage: FADE,
                    WebkitMaskImage: FADE,
                    transitionDelay: open && !reduceMotion ? `${index * STAGGER_MS}ms` : "0ms",
                  }}
                  className={`${label} ${labelState}`}
                >
                  <span
                    className={`transition-colors duration-200 ease-out ${
                      active
                        ? "font-[450] text-gray-1200"
                        : "text-gray-1000 group-hover:text-gray-1200 group-focus-visible:text-gray-1200"
                    }`}
                  >
                    {section.label}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

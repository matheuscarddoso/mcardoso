"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Download, Maximize2, Minimize2, X } from "lucide-react"
import type { Language } from "@/lib/locale"

/**
 * The side panel the résumé opens into, rather than a new tab.
 *
 * Two things decide its shape. It is not modal in `side` mode: the page beside
 * it stays readable and clickable, so it gets no backdrop, no focus trap and
 * no scroll lock. It becomes modal only when expanded, because then it covers
 * everything and leaving the page reachable underneath would be a lie.
 *
 * And it is progressive enhancement, not a replacement for the link. The
 * trigger stays an `<a href>` pointing at the real file; this only intercepts
 * the plain left click, and only when there is room. Middle click, "open in
 * new tab" and a failed hydration all still get the PDF.
 */

export type PanelDocument = {
  /** Shown in the chrome. */
  title: string
  /** The muted type label beside it, e.g. "PDF". */
  label: string
  /** What the viewer loads and what the download button points at. */
  src: string
  /** Filename suggested on download. */
  filename: string
}

type PanelCopy = {
  close: string
  expand: string
  collapse: string
  download: string
  /** Accessible name for the viewer frame. */
  viewer: (title: string) => string
}

const copy: Record<Language, PanelCopy> = {
  PT: {
    close: "Fechar",
    expand: "Expandir",
    collapse: "Recolher",
    download: "Baixar",
    viewer: (title) => `${title}, visualização em PDF`,
  },
  EN: {
    close: "Close",
    expand: "Expand",
    collapse: "Collapse",
    download: "Download",
    viewer: (title) => `${title}, PDF preview`,
  },
  ES: {
    close: "Cerrar",
    expand: "Expandir",
    collapse: "Contraer",
    download: "Descargar",
    viewer: (title) => `${title}, vista previa en PDF`,
  },
}

/**
 * Below this the split is not worth having, and the number is arithmetic
 * rather than taste. The panel takes `40vw` plus two insets, so the column
 * keeps `0.6vw - 16px`, and it needs 640px to hold its measure. That balances
 * at 1094px, and 1200 leaves 64px of slack instead of running to the wire.
 *
 * It is also, conveniently, well above the line where a PDF in an iframe stops
 * being dependable. Mobile Safari renders only the first page and Android
 * Chrome frequently offers a download instead of rendering at all.
 */
const SPLIT_QUERY = "(min-width: 1200px)"

type PanelState = { doc: PanelDocument; expanded: boolean } | null

/** The panel's element id, so a trigger can point `aria-controls` at it. */
export const DOCUMENT_PANEL_ID = "document-panel"

type PanelApi = {
  /** False when the viewport can't host the split, so callers can fall back. */
  canOpen: boolean
  /** `src` of the document on screen, so a trigger can show its own state. */
  openSrc: string | null
  /** Opens the document, or closes it when it is the one already showing. */
  toggle: (doc: PanelDocument) => void
}

const PanelContext = React.createContext<PanelApi | null>(null)

export function useDocumentPanel(): PanelApi {
  const api = React.useContext(PanelContext)
  if (!api) throw new Error("useDocumentPanel must be used inside DocumentPanelProvider")
  return api
}

function useMediaQuery(query: string): boolean {
  // `false` on the server and on the first client render, so hydration agrees.
  // The trigger is a working link either way, so the pessimistic start costs
  // nothing but a frame.
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const list = window.matchMedia(query)
    const sync = () => setMatches(list.matches)
    sync()
    list.addEventListener("change", sync)
    return () => list.removeEventListener("change", sync)
  }, [query])

  return matches
}

const SPRING = { type: "spring" as const, duration: 0.5, bounce: 0 }

export function DocumentPanelProvider({
  language,
  children,
}: {
  language: Language
  children: React.ReactNode
}) {
  const [state, setState] = React.useState<PanelState>(null)
  const canOpen = useMediaQuery(SPLIT_QUERY)
  const shouldReduceMotion = useReducedMotion()
  const t = copy[language]

  const panelRef = React.useRef<HTMLElement>(null)
  // Where focus came from, so closing puts it back rather than dropping it to
  // the top of the document.
  const returnFocusRef = React.useRef<HTMLElement | null>(null)

  const close = React.useCallback(() => {
    setState(null)
    returnFocusRef.current?.focus()
  }, [])

  /*
   * The trigger is a toggle, so the same button that opened the panel shuts
   * it. Keyed on `src` rather than a boolean: with more than one document the
   * useful behaviour is that a second trigger swaps the panel's contents
   * rather than closing it.
   */
  const toggle = React.useCallback(
    (doc: PanelDocument) => {
      if (state?.doc.src === doc.src) {
        close()
        return
      }
      returnFocusRef.current = document.activeElement as HTMLElement | null
      setState({ doc, expanded: false })
    },
    [state, close]
  )

  /* The viewport shrinking past the split takes the panel with it, or the
     page would be left with an unusable sliver of column beside it. */
  React.useEffect(() => {
    if (!canOpen && state) setState(null)
  }, [canOpen, state])

  /* Escape steps back one level rather than dismissing everything: expanded
     returns to the side, and the side closes. */
  React.useEffect(() => {
    if (!state) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      event.stopPropagation()
      if (state.expanded) setState({ ...state, expanded: false })
      else close()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [state, close])

  /* Scroll is locked only while expanded, which is the only mode that covers
     the page. Locking it in side mode would break the half still on show. */
  React.useEffect(() => {
    if (!state?.expanded) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [state?.expanded])

  React.useEffect(() => {
    if (state) panelRef.current?.focus()
  }, [state])

  const isSide = Boolean(state && !state.expanded)

  return (
    <PanelContext.Provider value={{ canOpen, openSrc: state?.doc.src ?? null, toggle }}>
      {/*
        The shift is `margin-right`, not a transform. A transform would slide
        the column left without narrowing it, so its right half would sit under
        the panel; the margin makes the available width smaller and the
        centred column re-centres itself inside what is left. It reflows, but
        once per open rather than per frame of a hover.

        Twice the inset: once for the gap between the panel and the viewport
        edge, once for the gap between the panel and this column.
      */}
      <div
        className="transition-[margin-right] duration-500 ease-[var(--ease-out-strong)] motion-reduce:transition-none"
        style={{
          marginRight: isSide
            ? "calc(var(--doc-panel-width) + var(--doc-panel-inset) * 2)"
            : 0,
        }}
      >
        {children}
      </div>

      <AnimatePresence>
        {state && (
          <>
            {/* Only expanded is modal, so only expanded gets a scrim. */}
            {state.expanded && (
              <motion.div
                key="doc-scrim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/40"
                onClick={close}
              />
            )}

            <motion.aside
              key="doc-panel"
              id={DOCUMENT_PANEL_ID}
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal={state.expanded}
              aria-label={state.doc.title}
              /* 105%, not 100%: the panel sits an inset in from the edge, so
                 travelling exactly its own width leaves a sliver on screen. */
              initial={shouldReduceMotion ? { opacity: 0 } : { x: "105%" }}
              animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: "105%" }}
              transition={shouldReduceMotion ? { duration: 0.15 } : SPRING}
              /*
               * Both modes float off every edge by the same inset, so the only
               * thing expanding changes is the width. Geometry moves on a CSS
               * transition rather than through Motion: Motion's layout
               * animation fakes a size change with a transform, and an iframe
               * scaled mid-flight makes the PDF viewer redraw at the wrong
               * size. A plain width transition lets it reflow once, at the end.
               */
              style={{
                top: "var(--doc-panel-inset)",
                bottom: "var(--doc-panel-inset)",
                right: "var(--doc-panel-inset)",
                width: state.expanded
                  ? "calc(100vw - var(--doc-panel-inset) * 2)"
                  : "var(--doc-panel-width)",
              }}
              /*
               * The surface is a class, not a custom property. `background:
               * var(--x)` fails to *transparent* when `--x` is missing, so a
               * stale stylesheet doesn't make the panel slightly wrong, it
               * makes it see-through and the page reads straight through the
               * header. A utility either exists or the element has no
               * background rule at all, which is a failure you can see coming.
               */
              className="fixed z-50 flex flex-col overflow-hidden rounded-xl bg-white shadow-card-lift transition-[width] duration-300 ease-[var(--ease-out-strong)] outline-none motion-reduce:transition-none dark:bg-[#202020]"
            >
              <header className="flex shrink-0 items-center gap-3 border-b border-black/5 px-3 py-2.5 dark:border-white/10">
                <p className="flex min-w-0 flex-1 items-baseline gap-1.5">
                  <span className="truncate text-sm font-medium text-gray-1200">
                    {state.doc.title}
                  </span>
                  <span className="shrink-0 text-xs text-gray-1000">· {state.doc.label}</span>
                </p>

                <a
                  href={state.doc.src}
                  download={state.doc.filename}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-gray-1200 shadow-custom transition-[box-shadow,transform] duration-200 ease-[var(--ease-out-strong)] hover:shadow-custom-hover active:scale-[0.97] motion-reduce:active:scale-100"
                >
                  <Download aria-hidden className="size-3.5" strokeWidth={1.75} />
                  {t.download}
                </a>

                <PanelButton
                  label={state.expanded ? t.collapse : t.expand}
                  onClick={() => setState({ ...state, expanded: !state.expanded })}
                >
                  {state.expanded ? (
                    <Minimize2 aria-hidden className="size-4" strokeWidth={1.75} />
                  ) : (
                    <Maximize2 aria-hidden className="size-4" strokeWidth={1.75} />
                  )}
                </PanelButton>

                <PanelButton label={t.close} onClick={close}>
                  <X aria-hidden className="size-4" strokeWidth={1.75} />
                </PanelButton>
              </header>

              {/*
                The viewer is centred in a column rather than stretched to the
                panel. `#view=FitH` scales the page to whatever width it is
                given, so a full-bleed frame renders A4 at 1700px and the
                résumé's lines run three times longer than they were set to.
                The cap is a little over a sheet's natural width, so expanding
                buys height and legibility instead of stretch.

                In side mode the panel is never wider than the cap, which makes
                this a no-op there: one rule covers both states.

                A plain iframe on the browser's own PDF viewer, not a bundled
                one. pdf.js is most of a megabyte to render a document the
                platform already renders, and every viewport this panel opens
                on has a competent built-in.
              */}
              {/*
                Black in both themes, unlike the chrome above it. This is the
                surround a document viewer puts behind a page, and it does the
                job the earlier 3% wash was failing at: a white sheet needs
                something to sit against, and in the light theme it had been
                sitting on white.
              */}
              <div className="flex min-h-0 flex-1 justify-center bg-black">
                <iframe
                  key={state.doc.src}
                  src={`${state.doc.src}#view=FitH&toolbar=0`}
                  title={t.viewer(state.doc.title)}
                  className="h-full w-full max-w-(--doc-page-width) border-0"
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </PanelContext.Provider>
  )
}

function PanelButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-1 text-gray-1100 transition-[color,background-color,transform] duration-200 ease-[var(--ease-out-strong)] hover:bg-black/5 hover:text-gray-1200 active:scale-[0.94] motion-reduce:active:scale-100 dark:hover:bg-white/10"
    >
      {children}
    </button>
  )
}

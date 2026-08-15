"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import type { Language } from "@/lib/locale"

export type PanelFile = {
  name: string
  /** Highlighted on the server; this only decides which one is on screen. */
  html: string
  /** The plain text, which is what the copy button puts on the clipboard. */
  code: string
}

const copyLabel: Record<Language, { copy: string; copied: string }> = {
  PT: { copy: "Copiar", copied: "Copiado" },
  EN: { copy: "Copy", copied: "Copied" },
  ES: { copy: "Copiar", copied: "Copiado" },
}

/* The same spring the email button swaps its glyph on. */
const SWAP = { type: "spring" as const, duration: 0.35, bounce: 0.15 }

export function CodePanelTabs({
  files,
  language,
}: {
  files: PanelFile[]
  language: Language
}) {
  const [active, setActive] = React.useState(0)
  const [copied, setCopied] = React.useState(false)
  const timeout = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const reduceMotion = useReducedMotion()
  const t = copyLabel[language]

  React.useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current)
    },
    []
  )

  const file = files[active]

  const copy = async () => {
    await navigator.clipboard.writeText(file.code)
    setCopied(true)
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setCopied(false), 2000)
  }

  const hidden = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.6, filter: "blur(4px)" }

  return (
    <figure className="my-8 w-full overflow-hidden rounded-xl bg-preview-bg shadow-custom">
      <div className="flex items-center gap-2 border-b border-border px-2.5 py-2">
        {/*
          A tablist, not a row of buttons: these are alternative views of one
          listing, and the pattern buys arrow-key movement between them for
          free from the browser's own semantics.
        */}
        <div role="tablist" aria-label="Files" className="flex min-w-0 items-center gap-1">
          {files.map((entry, index) => (
            <button
              key={entry.name}
              type="button"
              role="tab"
              id={`code-tab-${index}`}
              aria-selected={index === active}
              aria-controls={`code-panel-${index}`}
              /* Only the selected tab is in the tab order; the arrow keys move
                 between them once you are inside. */
              tabIndex={index === active ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
                event.preventDefault()
                const step = event.key === "ArrowRight" ? 1 : -1
                const next = (index + step + files.length) % files.length
                setActive(next)
                document.getElementById(`code-tab-${next}`)?.focus()
              }}
              className={`shrink-0 cursor-pointer rounded-md px-2 py-1 font-mono text-[13px] transition-colors duration-150 ease-[var(--ease-out-strong)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-black/40 dark:focus-visible:outline-white/40 ${
                index === active
                  ? "bg-secondary text-gray-1200"
                  : "text-gray-1000 hover:text-gray-1200"
              }`}
            >
              {entry.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={copy}
          aria-label={copied ? t.copied : t.copy}
          className="ml-auto inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-[13px] text-gray-1000 transition-colors duration-150 ease-[var(--ease-out-strong)] hover:text-gray-1200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-black/40 dark:focus-visible:outline-white/40"
        >
          <span className="relative grid size-3.5 shrink-0 place-items-center">
            <AnimatePresence initial={false}>
              <motion.span
                key={copied ? "done" : "copy"}
                initial={hidden}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={hidden}
                transition={reduceMotion ? { duration: 0.12 } : SWAP}
                className="absolute inset-0 grid place-items-center"
              >
                {copied ? (
                  <span className="grid size-3.5 place-items-center rounded-full bg-[#22c55e]">
                    <Check className="size-2 text-white" strokeWidth={3.5} />
                  </span>
                ) : (
                  <Copy className="size-3.5" strokeWidth={1.75} />
                )}
              </motion.span>
            </AnimatePresence>
          </span>
          {copied ? t.copied : t.copy}
        </button>
      </div>

      {files.map((entry, index) => (
        <div
          key={entry.name}
          role="tabpanel"
          id={`code-panel-${index}`}
          aria-labelledby={`code-tab-${index}`}
          hidden={index !== active}
          /* `preview-code` carries the shiki theme; the surface and the corners
             belong to the figure, which already has them. */
          className="preview-code max-h-[32rem] w-full overflow-auto p-4 shadow-none! [&_*]:font-mono"
          dangerouslySetInnerHTML={{ __html: entry.html }}
        />
      ))}
    </figure>
  )
}

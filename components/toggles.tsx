"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import type { Language } from "@/lib/locale"
import { switchLocale } from "@/lib/switch-locale"

const languageAction = {
  PT: "Mudar idioma",
  EN: "Change language",
  ES: "Cambiar idioma",
} as const

/** `any` is the label before mount, when the server cannot know the theme. */
const themeAction: Record<Language, Record<"light" | "dark" | "any", string>> = {
  PT: { light: "Mudar para o tema claro", dark: "Mudar para o tema escuro", any: "Mudar tema" },
  EN: { light: "Switch to light theme", dark: "Switch to dark theme", any: "Change theme" },
  ES: { light: "Cambiar al tema claro", dark: "Cambiar al tema oscuro", any: "Cambiar tema" },
}

/**
 * The article's back control, verbatim: same disc, same fill, same press. The
 * three round controls on the site read as one family instead of the toggles
 * being the odd ones out.
 */
const discClass =
  "group relative grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-secondary transition-[scale,background-color] duration-200 ease-out select-none hover:bg-gray-300 active:scale-[0.96] motion-reduce:active:scale-100"

const inkClass =
  "text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground"

export function LanguageToggle({
  language,
  onLanguageChange,
}: {
  language: Language
  onLanguageChange?: (lang: Language) => void
}) {
  const next: Language = language === "PT" ? "EN" : language === "EN" ? "ES" : "PT"

  return (
    <button
      type="button"
      onClick={() => onLanguageChange?.(next)}
      className={discClass}
      aria-label={languageAction[language]}
    >
      <span className={`text-[11px] font-medium tracking-wide ${inkClass}`}>{language}</span>
    </button>
  )
}

/**
 * Two states, one press. The glyph is the theme you are in, not the one you
 * would go to: a sun on a light page agrees with what you see.
 *
 * Toggling from "system" resolves it first, so the press always visibly flips
 * the page instead of sometimes landing on the theme already showing.
 */
export function ThemeToggle({ language }: { language: Language }) {
  const { resolvedTheme, setTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  // `resolvedTheme` is only known on the client. Until then the glyph comes
  // from the `.dark` class next-themes has already set, so the first paint is
  // right and matches the server's markup.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"
  const icon = `size-4 ${inkClass}`

  // The copy-email glyph swap, so every icon change on the site moves alike.
  const transition = shouldReduceMotion
    ? { duration: 0.12 }
    : { type: "spring" as const, duration: 0.35, bounce: 0.15 }
  const hidden = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.6, filter: "blur(4px)" }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={discClass}
      // Anything derived from `resolvedTheme` waits for mount, or the server's
      // attribute sticks: React does not patch attribute mismatches.
      aria-label={themeAction[language][!mounted ? "any" : isDark ? "light" : "dark"]}
    >
      {mounted ? (
        <AnimatePresence initial={false}>
          <motion.span
            key={isDark ? "dark" : "light"}
            initial={hidden}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={hidden}
            transition={transition}
            className="absolute inset-0 grid place-items-center"
          >
            {isDark ? (
              <Moon className={icon} strokeWidth={1.5} />
            ) : (
              <Sun className={icon} strokeWidth={1.5} />
            )}
          </motion.span>
        </AnimatePresence>
      ) : (
        <>
          <Sun className={`${icon} dark:hidden`} strokeWidth={1.5} />
          <Moon className={`${icon} hidden dark:block`} strokeWidth={1.5} />
        </>
      )}
    </button>
  )
}

/**
 * Pinned to the viewport rather than to any page's header, so it sits in the
 * same place on every route and stays in reach however far down you are.
 *
 * Below the document panel and its scrim (z-40/50): opening a document covers
 * it instead of leaving it floating over the reading surface.
 */
export function FloatingToggles({ language }: { language: Language }) {
  return (
    <div className="fixed top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] z-30 flex items-center gap-2 print:hidden sm:top-6 sm:right-6">
      <LanguageToggle language={language} onLanguageChange={switchLocale} />
      <ThemeToggle language={language} />
    </div>
  )
}

"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import type { Language } from "@/lib/locale"

const themeAction = {
  PT: "Mudar tema",
  EN: "Change theme",
  ES: "Cambiar tema",
} as const

const languageAction = {
  PT: "Mudar idioma",
  EN: "Change language",
  ES: "Cambiar idioma",
} as const

const themeIcons = { system: Monitor, dark: Moon, light: Sun } as const

const toggleClass =
  "relative flex h-[28px] cursor-pointer items-center rounded-xl px-2 py-1.5 text-xs font-medium select-none transition-[color,background-color,transform] duration-150 ease-[var(--ease-out-strong)] hover:bg-zinc-50 active:scale-[0.97] motion-reduce:active:scale-100 dark:hover:bg-zinc-800"

export function ToggleSeparator() {
  return <div aria-hidden className="mx-1 h-4 w-px bg-gray-200 dark:bg-white/10" />
}

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
      className={toggleClass}
      aria-label={languageAction[language]}
    >
      {language}
    </button>
  )
}

export function ThemeToggle({ language }: { language: Language }) {
  const { theme, setTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  // `theme` is only known on the client, so nothing is drawn until mount —
  // that keeps the first client render identical to the server's and avoids
  // flashing the wrong icon.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const current = theme === "dark" ? "dark" : theme === "light" ? "light" : "system"
  const Icon = themeIcons[current]

  const toggleTheme = () => {
    if (theme === "system") setTheme("dark")
    else if (theme === "dark") setTheme("light")
    else setTheme("system")
  }

  const transition = shouldReduceMotion
    ? { duration: 0.12 }
    : { type: "spring" as const, duration: 0.35, bounce: 0.15 }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={toggleClass}
      aria-label={themeAction[language]}
    >
      <span className="relative grid size-4 place-items-center">
        <AnimatePresence initial={false}>
          {mounted && (
            <motion.span
              key={current}
              initial={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
              transition={transition}
              className="absolute inset-0 grid place-items-center"
            >
              <Icon className="size-4" strokeWidth={1.75} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  )
}

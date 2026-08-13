"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
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

/** In the order they sit in the tray, dimmest to brightest. */
const THEMES = [
  { value: "system", Icon: Monitor },
  { value: "light", Icon: Sun },
  { value: "dark", Icon: Moon },
] as const

type ThemeValue = (typeof THEMES)[number]["value"]

const themeName: Record<Language, Record<ThemeValue, string>> = {
  PT: { system: "Sistema", light: "Claro", dark: "Escuro" },
  EN: { system: "System", light: "Light", dark: "Dark" },
  ES: { system: "Sistema", light: "Claro", dark: "Oscuro" },
}

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

/**
 * A tray of three rather than one button that cycles.
 *
 * Cycling hid two things: which theme was set, and how many presses it would
 * take to reach the one you wanted. Three targets say both at a glance, and
 * "system" stops being a state you can only reach by going around.
 */
export function ThemeToggle({ language }: { language: Language }) {
  const { theme, setTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  // `theme` is only known on the client, so the highlight is not drawn until
  // mount. That keeps the first client render identical to the server's and
  // avoids marking the wrong one for a frame.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const current: ThemeValue = theme === "dark" ? "dark" : theme === "light" ? "light" : "system"

  const transition = shouldReduceMotion
    ? { duration: 0.12 }
    : { type: "spring" as const, duration: 0.35, bounce: 0.15 }

  return (
    <div
      role="radiogroup"
      aria-label={themeAction[language]}
      className="flex items-center gap-0.5 rounded-xl p-0.5 shadow-custom"
    >
      {THEMES.map(({ value, Icon }) => {
        const active = mounted && current === value

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={themeName[language][value]}
            title={themeName[language][value]}
            onClick={() => setTheme(value)}
            className="relative grid size-6 cursor-pointer place-items-center rounded-[10px] transition-[color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.92] motion-reduce:active:scale-100"
          >
            {/*
              One shared `layoutId`, so the pill travels between the three
              instead of fading out here and in there. Sitting behind the glyph
              rather than around it keeps the icon on top of its own highlight.
            */}
            {active && (
              <motion.span
                layoutId="theme-tray-active"
                transition={transition}
                className="absolute inset-0 rounded-[10px] bg-zinc-100 dark:bg-zinc-800"
              />
            )}
            <Icon
              className={`relative size-3.5 transition-colors duration-150 ${
                active ? "text-gray-1200" : "text-gray-1000"
              }`}
              strokeWidth={1.75}
            />
          </button>
        )
      })}
    </div>
  )
}

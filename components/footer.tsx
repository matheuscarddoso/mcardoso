"use client"

import * as React from "react"
import { useTheme } from "next-themes"

const themeLabels = {
  PT: { system: "Sistema", dark: "Escuro", light: "Claro" },
  EN: { system: "System", dark: "Dark", light: "Light" },
  ES: { system: "Sistema", dark: "Oscuro", light: "Claro" },
} as const

export type Language = "PT" | "EN" | "ES"

type FooterProps = {
  language?: Language
  onLanguageChange?: (lang: Language) => void
}

export function Footer({ language = "EN", onLanguageChange }: FooterProps) {
  const { theme, setTheme } = useTheme()
  const t = themeLabels[language]

  const toggleTheme = () => {
    if (theme === "system") setTheme("dark")
    else if (theme === "dark") setTheme("light")
    else setTheme("system")
  }

  const toggleLanguage = () => {
    const next: Language = language === "PT" ? "EN" : language === "EN" ? "ES" : "PT"
    onLanguageChange?.(next)
  }

  return (
    <footer className="dark:border-primary-dark-4 mx-auto mt-auto w-full max-w-(--breakpoint-sm) px-4 pt-20">
      <div className="flex items-center justify-between px-0 py-12 md:px-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="hover:bg-zinc-50 dark:hover:bg-zinc-800 relative flex h-[28px] items-center gap-2 rounded-lg px-2 py-1.5 transition-[colors,transform] duration-200 active:scale-98"
          >
            <span className="text-primary-light-11 dark:text-primary-dark-11 text-xs font-medium select-none">
              {language}
            </span>
          </button>
          <button
            type="button"
            className="h-[28px] cursor-default select-none text-xs text-primary-light-11 dark:text-primary-dark-11"
          >
            © {new Date().getFullYear()} Matheus Cardoso
          </button>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="hover:bg-zinc-50 dark:hover:bg-zinc-800 relative flex h-[28px] items-center gap-2 rounded-lg px-2 py-1.5 transition-[colors,transform] duration-200 active:scale-98"
        >
          <span className="text-primary-light-11 dark:text-primary-dark-11 text-xs font-medium select-none">
            {theme === "system" ? t.system : theme === "dark" ? t.dark : t.light}
          </span>
        </button>
      </div>
    </footer>
  )
}

"use client"

import { LanguageToggle, ThemeToggle } from "@/components/toggles"
import { LocalTime } from "@/components/local-time"
import type { Language } from "@/lib/locale"

export type { Language }

type FooterProps = {
  language?: Language
  onLanguageChange?: (lang: Language) => void
  /** Off when the page already exposes the toggles somewhere else, like the home header. */
  showToggles?: boolean
}

export function Footer({
  language = "EN",
  onLanguageChange,
  showToggles = true,
}: FooterProps) {
  return (
    <footer className="dark:border-primary-dark-4 mx-auto mt-auto w-full max-w-(--breakpoint-sm) px-4 pt-20">
      <div className="flex items-center justify-between px-0 py-12 md:px-0">
        <div className="flex items-center gap-2">
          {showToggles && (
            <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
          )}
          <LocalTime language={language} />
        </div>
        {showToggles && <ThemeToggle language={language} />}
      </div>
    </footer>
  )
}

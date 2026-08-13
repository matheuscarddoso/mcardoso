"use client"

import { LanguageToggle, ThemeToggle } from "@/components/toggles"
import { LocalTime } from "@/components/local-time"
import { PixelKoala } from "@/components/pixel-koala"
import type { Language } from "@/lib/locale"

export type { Language }

/**
 * The two toggles are controlled independently rather than by one flag: the
 * articles surface language in their own header, beside the copy-link button,
 * but keep theme down here.
 */
type FooterProps = {
  language?: Language
  onLanguageChange?: (lang: Language) => void
  showLanguageToggle?: boolean
  showThemeToggle?: boolean
}

export function Footer({
  language = "EN",
  onLanguageChange,
  showLanguageToggle = true,
  showThemeToggle = true,
}: FooterProps) {
  return (
    <footer className="dark:border-primary-dark-4 mx-auto mt-auto w-full max-w-(--breakpoint-sm) px-4 pt-20">
      {/* Wraps rather than squeezes: on a 320px phone the Spanish clock line
          and the icon row together clear the column by half a pixel, which is
          no margin at all once font metrics vary. */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-6 px-0 py-12 md:px-0">
        <div className="flex items-center gap-2">
          {showLanguageToggle && (
            <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
          )}
          <LocalTime language={language} />
          <PixelKoala />
        </div>
        <div className="flex items-center gap-4">
          {showThemeToggle && <ThemeToggle language={language} />}
        </div>
      </div>
    </footer>
  )
}

"use client"

import { LanguageToggle, ThemeToggle } from "@/components/toggles"
import { LocalTime } from "@/components/local-time"
import { SocialLinks } from "@/components/social-links"
import { FOOTER_SOCIAL } from "@/lib/site"
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
      {/* Wraps rather than squeezes: on a 320px phone the Spanish clock line
          and the icon row together clear the column by half a pixel, which is
          no margin at all once font metrics vary. */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-6 px-0 py-12 md:px-0">
        <div className="flex items-center gap-2">
          {showToggles && (
            <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
          )}
          <LocalTime language={language} />
        </div>
        {/* The profiles the header has no room for. Same -m-2/p-2 targets. */}
        <div className="flex items-center gap-4">
          <SocialLinks include={FOOTER_SOCIAL} />
          {showToggles && <ThemeToggle language={language} />}
        </div>
      </div>
    </footer>
  )
}

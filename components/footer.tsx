"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { LanguageToggle, ThemeToggle } from "@/components/toggles"
import { LocalTime } from "@/components/local-time"
import { PixelCat } from "@/components/pixel-cat"
import { SocialLinks } from "@/components/social-links"
import { FOOTER_SOCIAL } from "@/lib/site"
import type { Language } from "@/lib/locale"

const PLAYLISTS_PATH = "/monthly-playlists"

const playlistsLabel = {
  PT: "Playlists",
  EN: "Playlists",
  ES: "Playlists",
} as const

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
  const params = useParams()
  const pathname = usePathname()
  const locale = (params.locale as string) ?? "en"
  // Reachable from every page except itself. It used to hang off a single
  // sentence in the home page bio, which left it with one inbound link.
  const showPlaylists = !pathname?.endsWith(PLAYLISTS_PATH)

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
          <PixelCat />
        </div>
        {/* The profiles the header has no room for. Same -m-2/p-2 targets. */}
        <div className="flex items-center gap-4">
          {showPlaylists && (
            <Link
              href={`/${locale}${PLAYLISTS_PATH}`}
              className="text-xs text-gray-1000 transition-colors duration-200 hover:text-gray-1200"
            >
              {playlistsLabel[language]}
            </Link>
          )}
          <SocialLinks include={FOOTER_SOCIAL} />
          {showThemeToggle && <ThemeToggle language={language} />}
        </div>
      </div>
    </footer>
  )
}

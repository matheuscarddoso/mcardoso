"use client"

import { LocalTime } from "@/components/local-time"
import { AsciiStrip } from "@/components/ascii-strip"
import type { Language } from "@/lib/locale"

export type { Language }

type FooterProps = {
  language?: Language
}

export function Footer({ language = "EN" }: FooterProps) {
  /*
   * Full width, unlike everything above it. The strip is sized off the
   * viewport rather than off the reading column, so the footer stops
   * constraining and the row inside it carries the measure instead. The page
   * shell already clips horizontally, so nothing here can raise a scrollbar.
   */
  return (
    <footer className="mt-auto w-full">
      <div className="dark:border-primary-dark-4 mx-auto w-full max-w-(--breakpoint-sm) px-4 pt-20">
        <div className="flex items-center py-12">
          <LocalTime language={language} />
        </div>
      </div>

      {/* Last thing on the page, under everything, running on its own. */}
      <AsciiStrip />
    </footer>
  )
}

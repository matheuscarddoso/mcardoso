"use client"

import * as React from "react"
import { Undo2 } from "lucide-react"
import { HomeLink } from "@/components/home-link"
import { LanguageToggle, ThemeToggle } from "@/components/toggles"
import { switchLocale } from "@/lib/switch-locale"
import type { Language } from "@/lib/locale"

/**
 * The page around one craft: the same column, header and back control the
 * articles use, so a component study and a piece of writing read as two things
 * on one site rather than two sites.
 *
 * `children` is the code listing, which is rendered on the server and handed
 * down through here. Highlighting runs at build time and its markup never
 * enters the client bundle, which it would if this component produced it.
 */
export function CraftShell({
  locale,
  language,
  title,
  description,
  credit,
  demo,
  children,
}: {
  locale: string
  language: Language
  title: string
  description: string
  credit?: string
  demo: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden">
      <main className="mx-auto w-full max-w-(--breakpoint-sm) flex-1 px-4 py-12 leading-relaxed sm:py-20">
        <header>
          <div className="mb-16 flex min-h-9 w-full items-center justify-between gap-2 select-none">
            <HomeLink
              locale={locale}
              className="group flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary transition-[scale,background-color] duration-200 ease-out hover:bg-gray-300 active:scale-[0.96]"
              aria-label="Home"
            >
              <Undo2
                className="mr-0.5 size-4 text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground"
                strokeWidth={1.5}
              />
            </HomeLink>
            <div className="flex items-center gap-2">
              <LanguageToggle language={language} onLanguageChange={switchLocale} />
              <ThemeToggle language={language} />
            </div>
          </div>
        </header>

        <h1 className="mb-1 w-fit text-balance font-medium text-gray-1200">{title}</h1>
        <p className="mb-6 w-full text-pretty text-gray-1100">{description}</p>

        {demo}

        {credit ? (
          /* Under the demo rather than in the prose: it is a note about the
             material, and the reader only needs it once they have heard it. */
          <p className="mt-3 text-xs text-gray-1000">{credit}</p>
        ) : null}

        {children}
      </main>
    </div>
  )
}

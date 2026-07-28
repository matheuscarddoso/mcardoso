"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Undo2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Footer, type Language } from "@/components/footer"
import { localeToLanguage, languageToLocale } from "@/lib/locale"

const titleByLang = {
  PT: "Playlists mensais",
  EN: "Monthly playlists",
  ES: "Playlists mensuales",
}

const introByLang = {
  PT: "Todo mês, crio uma playlist com minhas músicas favoritas do momento.",
  EN: "Every month, I create a playlist with my favorite songs of the moment.",
  ES: "Cada mes, creo una playlist con mis canciones favoritas del momento.",
}

/** Says what the ritual actually is — the one-liner above didn't. */
const aboutByLang = {
  PT: "Não é retrospectiva nem lista de melhores: é o que realmente tocou enquanto eu programava, corria e viajava naquele mês. Fecho no último dia e não mexo mais, então cada uma vira um registro honesto do período. Costuma dar entre trinta e quarenta minutos.",
  EN: "It isn't a retrospective or a best-of: it's what actually played while I was coding, running and travelling that month. I close it on the last day and never touch it again, so each one ends up an honest record of the period. They usually run thirty to forty minutes.",
  ES: "No es una retrospectiva ni una lista de lo mejor: es lo que realmente sonó mientras programaba, corría y viajaba ese mes. La cierro el último día y no la toco más, así que cada una queda como un registro honesto del período. Suelen durar entre treinta y cuarenta minutos.",
}

const backToWritingByLang = {
  PT: "Se veio pela música, a escrita fica",
  EN: "If the music brought you here, the writing lives",
  ES: "Si te trajo la música, la escritura está",
}

const hereByLang = { PT: "aqui", EN: "here", ES: "aquí" }

const spotifyFeb2026 = "https://open.spotify.com/playlist/7taNw0eVv4qK5QPb2G4mtn?si=qNSyjXcUSWezUSoUsjM5Uw"

const playlists = [
  { month: "February", year: 2026, url: spotifyFeb2026, image: "/playlist-feb-2026.png" },
]

const monthLabels: Record<string, { PT: string; EN: string; ES: string }> = {
  January:   { PT: "Janeiro",   EN: "January",   ES: "Enero" },
  February:  { PT: "Fevereiro", EN: "February",  ES: "Febrero" },
  March:     { PT: "Março",     EN: "March",     ES: "Marzo" },
  April:     { PT: "Abril",     EN: "April",     ES: "Abril" },
  May:       { PT: "Maio",      EN: "May",       ES: "Mayo" },
  June:      { PT: "Junho",     EN: "June",      ES: "Junio" },
  July:      { PT: "Julho",     EN: "July",      ES: "Julio" },
  August:    { PT: "Agosto",    EN: "August",    ES: "Agosto" },
  September: { PT: "Setembro",  EN: "September", ES: "Septiembre" },
  October:   { PT: "Outubro",   EN: "October",   ES: "Octubre" },
  November:  { PT: "Novembro",  EN: "November",  ES: "Noviembre" },
  December:  { PT: "Dezembro",  EN: "December",  ES: "Diciembre" },
}

export function MonthlyPlaylistsContent() {
  const params = useParams()
  const router = useRouter()
  const locale = (params.locale as string) ?? 'en'
  const language: Language = localeToLanguage(locale)

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-hidden">
      <div
        className="pointer-events-none fixed top-0 left-0 z-50 h-12 w-full bg-neutral-100 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-neutral-900"
        aria-hidden
      />
      <main className="mx-auto flex w-full max-w-(--breakpoint-sm) flex-1 flex-col px-4 pt-20 pb-4 dark:text-[#b4b4b4] text-gray-600">
        <div className="mb-16 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="inline-flex h-8 w-8 cursor-pointer select-none items-center justify-center rounded-full bg-[#F0F0F0] dark:bg-[#222] text-primary-light-12 outline-none transition-all duration-150 hover:bg-primary-light-4 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 dark:bg-primary-dark-3 dark:text-primary-dark-1 dark:hover:bg-primary-dark-4 [&_svg]:text-primary-light-12 dark:[&_svg]:text-primary-dark-12"
            aria-label={language === "PT" ? "Voltar" : language === "ES" ? "Volver" : "Back"}
          >
            <Undo2 className="size-4" strokeWidth={1.5} />
          </Link>
        </div>
        {/* The page shipped with no heading at all — nothing for a crawler or a
            screen reader to hang the page's subject on. */}
        <h1 className="mb-2 text-balance font-[550] article-heading">{titleByLang[language]}</h1>
        <p className="paragraph mb-3">{introByLang[language]}</p>
        <p className="paragraph mb-10">{aboutByLang[language]}</p>
        <ul className="grid grid-cols-2 gap-x-8 gap-y-8 pb-20 sm:grid-cols-3">
          {playlists.map((pl) => {
            const label = `${monthLabels[pl.month]?.[language] ?? pl.month} ${pl.year}`
            return (
              <li key={`${pl.month}-${pl.year}`}>
              <a
                href={pl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
              >
                <div className="aspect-square w-full overflow-hidden rounded-[20px] corner-squircle outline outline-1 outline-black/5 outline-offset-2 dark:outline-white/5">
                  <Image
                    src={pl.image}
                    alt={label}
                    width={320}
                    height={320}
                    className="aspect-square w-full object-cover"
                  />
                </div>
                <span className="text-sm font-[450] text-zinc-700 dark:text-zinc-300">{label}</span>
              </a>
              </li>
            )
          })}
        </ul>
        {/* This page was a dead end: every link on it pointed off-site to
            Spotify. One route back into the writing keeps it part of the site. */}
        <p className="paragraph pb-20">
          {backToWritingByLang[language]}{" "}
          <Link className="article-underline" href={`/${locale}`}>
            {hereByLang[language]}
          </Link>
          .
        </p>
      </main>
      <Footer
        language={language}
        onLanguageChange={(lang) => {
          const path = window.location.pathname.replace(/^\/(en|pt-br|es)/, '') || '/'
          router.push(`/${languageToLocale[lang]}${path}`, { scroll: false })
        }}
      />
    </div>
  )
}

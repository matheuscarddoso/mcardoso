"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { ArrowUpRight } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import type { Language } from "@/lib/locale"
import type { GithubCardData } from "@/lib/github"

type Preview = {
  src: string
  alt: string
  width: number
  height: number
}

/**
 * Keyed by href — a link with no entry here just renders as a plain anchor,
 * so adding a preview is a one-line change.
 */
const PREVIEWS: Record<string, Preview> = {
  "https://4selet.com.br": {
    src: "/previews/4selet.webp",
    alt: "4Selet",
    width: 640,
    height: 320,
  },
  "https://zero7.com.br/home": {
    src: "/previews/zero7.webp",
    alt: "Zero7",
    width: 640,
    height: 360,
  },
  "https://www.abacatepay.com/": {
    src: "/projects/abacate-pay.webp",
    alt: "Abacate Pay",
    width: 640,
    height: 363,
  },
  "https://www.goiasec.com.br/": {
    src: "/previews/goias-fc.webp",
    alt: "Goiás F.C.",
    width: 400,
    height: 250,
  },
}

/**
 * Radix hover card wired to Motion instead of the CSS keyframes shadcn ships —
 * keyframes can animate neither a spring nor blur on the way out.
 */
function HoverPreview({
  width,
  trigger,
  children,
}: {
  width: number
  trigger: React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const shouldReduceMotion = useReducedMotion()

  const enter = shouldReduceMotion
    ? { duration: 0.12 }
    : { type: "spring" as const, duration: 0.4, bounce: 0.22 }

  // Leaves faster than it arrives, and without the overshoot.
  const leave = shouldReduceMotion
    ? { duration: 0.1 }
    : { type: "spring" as const, duration: 0.26, bounce: 0 }

  const hidden = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.92, y: 8, filter: "blur(10px)" }

  return (
    <HoverCardPrimitive.Root open={open} onOpenChange={setOpen} openDelay={120} closeDelay={80}>
      <HoverCardPrimitive.Trigger asChild>{trigger}</HoverCardPrimitive.Trigger>
      <AnimatePresence>
        {open && (
          <HoverCardPrimitive.Portal forceMount>
            <HoverCardPrimitive.Content asChild forceMount side="top" align="center" sideOffset={10}>
              <motion.div
                initial={hidden}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: enter,
                }}
                exit={{ ...hidden, transition: leave }}
                style={{
                  width,
                  // Scales out of the edge nearest the link, not the middle.
                  transformOrigin: "var(--radix-hover-card-content-transform-origin)",
                }}
                className="z-50 outline-hidden"
              >
                {children}
              </motion.div>
            </HoverCardPrimitive.Content>
          </HoverCardPrimitive.Portal>
        )}
      </AnimatePresence>
    </HoverCardPrimitive.Root>
  )
}

export function BioLink({ href, className, children, ...props }: React.ComponentProps<"a">) {
  const anchor = (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  )

  const preview = href ? PREVIEWS[href] : undefined
  if (!preview) return anchor

  return (
    <HoverPreview width={248} trigger={anchor}>
      <div className="overflow-hidden rounded-xl bg-preview-bg p-1 shadow-card-lift">
        <Image
          src={preview.src}
          alt={preview.alt}
          width={preview.width}
          height={preview.height}
          sizes="248px"
          className="h-auto w-full rounded-lg"
        />
      </div>
    </HoverPreview>
  )
}

/** Mocked for now — swap for the real "last played" feed when it exists. */
const NOW_PLAYING = {
  url: "https://www.youtube.com/watch?v=eEQMtIX61LA",
  title: "Love's Train",
  artist: "Silk Sonic",
  thumbnail: "/previews/now-playing.webp",
}

const lastPlayedLabel = {
  PT: "Ouvida há 3 horas",
  EN: "Last played 3 hours ago",
  ES: "Escuchada hace 3 horas",
} as const

export function PlaylistLink({
  language,
  href,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"a">, "href"> & { language: Language; href: string }) {
  // Internal route, so `Link` — a plain anchor here threw away the client
  // navigation and reloaded the whole document to move one page across.
  const anchor = (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  )

  return (
    <HoverPreview width={244} trigger={anchor}>
      {/* Both surfaces are fully opaque — the card sits over body copy. */}
      <div className="rounded-xl bg-[#f4f4f5] p-1 shadow-card-lift dark:bg-[#171717]">
        <a
          href={NOW_PLAYING.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-white p-1.5 shadow-custom transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] motion-reduce:active:scale-100 dark:bg-[#222]"
        >
          {/* Record turning behind the sleeve, its label cut from the cover art. */}
          <span className="relative h-10 w-[58px] shrink-0">
            <span className="absolute top-1/2 left-[22px] size-9 -translate-y-1/2">
              {/* Rotation lives on its own node — the spin would clobber the centring transform. */}
              <span className="vinyl-spin block size-full rounded-full bg-[radial-gradient(circle,#3a3a3a_0%,#0e0e0e_58%,#1c1c1c_100%)] shadow-sm ring-1 ring-black/40">
                <span className="absolute inset-[3px] rounded-full ring-1 ring-white/10" />
                <span className="absolute inset-[6px] rounded-full ring-1 ring-white/[0.07]" />
                <span className="absolute inset-[10px] overflow-hidden rounded-full">
                  <Image
                    src={NOW_PLAYING.thumbnail}
                    alt=""
                    fill
                    sizes="16px"
                    className="object-cover"
                  />
                </span>
                <span className="absolute top-1/2 left-1/2 size-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f4f4f5] ring-1 ring-black/40" />
              </span>
            </span>
            <span className="absolute top-0 left-0 size-10 overflow-hidden rounded-md shadow-custom">
              {/* The sleeve is the one that carries the meaning; the record
                  behind it is the same art, spinning, and stays decorative. */}
              <Image
                src={NOW_PLAYING.thumbnail}
                alt={`${NOW_PLAYING.title} · ${NOW_PLAYING.artist}`}
                fill
                sizes="40px"
                className="object-cover"
              />
            </span>
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex items-start gap-1">
              <span className="truncate text-xs font-medium text-gray-1200">
                {NOW_PLAYING.title}
              </span>
              <ArrowUpRight aria-hidden className="mt-px size-3 shrink-0 text-gray-1000" />
            </span>
            <span className="truncate text-xs text-gray-1100">{NOW_PLAYING.artist}</span>
          </span>
        </a>
        <p className="px-1.5 py-1 text-[10px] text-gray-1000">{lastPlayedLabel[language]}</p>
      </div>
    </HoverPreview>
  )
}

/** Cell edge and gutter, in px — the card's width falls out of these. */
const CELL = 10
const CELL_GAP = 3
/** Vertical room for the month row. */
const MONTH_ROW = 14
/** Inner panel padding (`p-2`) plus the outer card's `p-1`, doubled. */
const CARD_CHROME = 8 * 2 + 4 * 2

const columnStep = CELL + CELL_GAP
const gridWidth = (columns: number) => columns * CELL + Math.max(columns - 1, 0) * CELL_GAP

/** Short month names, held locally so server and client never disagree. */
const MONTH_NAMES: Record<Language, readonly string[]> = {
  PT: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  EN: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ES: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
}

const contributionsLabel = {
  PT: (total: number) => `${total} contribuições no último ano`,
  EN: (total: number) => `${total} contributions in the last year`,
  ES: (total: number) => `${total} contribuciones en el último año`,
} as const

function ContributionGraph({
  data,
  language,
}: {
  data: GithubCardData
  language: Language
}) {
  const width = gridWidth(data.weeks.length)

  return (
    <div className="rounded-lg bg-white p-2 shadow-custom dark:bg-[#222]">
      {/* The graph is decoration; the sentence below it carries the meaning. */}
      <div aria-hidden style={{ width }} className="mx-auto">
        <div className="relative" style={{ height: MONTH_ROW }}>
          {data.months.map(({ column, month }) => (
            <span
              key={`${column}-${month}`}
              // Left-aligned to the month's first column, like GitHub's own.
              style={{ left: column * columnStep }}
              className="absolute top-0 text-[9px] leading-none whitespace-nowrap text-gray-1000"
            >
              {MONTH_NAMES[language][month]}
            </span>
          ))}
        </div>
        <div className="flex" style={{ gap: CELL_GAP }}>
          {data.weeks.map((week, columnIndex) => (
            <div key={columnIndex} className="flex flex-col" style={{ gap: CELL_GAP }}>
              {week.map((day, rowIndex) => (
                <span
                  key={day?.date ?? `empty-${rowIndex}`}
                  style={{ width: CELL, height: CELL }}
                  // Days past today keep their slot, so the rows stay aligned
                  // to the weekday they belong to.
                  className={`contrib-cell ${day ? `level-${day.level}` : "invisible"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">{contributionsLabel[language](data.total)}</span>
    </div>
  )
}

export function GithubLink({
  data,
  language,
  href,
  className,
  children,
  ...props
}: React.ComponentProps<"a"> & { data: GithubCardData | null; language: Language }) {
  const anchor = (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  )

  // No data (offline build, rate limit) — the link stands on its own.
  if (!data) return anchor

  const hasGraph = data.weeks.length > 0
  const width = hasGraph ? gridWidth(data.weeks.length) + CARD_CHROME : 244

  return (
    <HoverPreview width={width} trigger={anchor}>
      {/* Same two-surface build as the playlist card — both fully opaque. */}
      <div className="rounded-xl bg-[#f4f4f5] p-1 shadow-card-lift dark:bg-[#171717]">
        {hasGraph && <ContributionGraph data={data} language={language} />}
        <div className={`flex gap-2 px-1 pb-0.5 ${hasGraph ? "pt-2" : "pt-1"}`}>
          <Image
            src={data.avatarUrl}
            alt={`${data.name} on GitHub`}
            // Fixed size, so Next emits the 1x/2x pair and nothing larger.
            width={32}
            height={32}
            className="mt-0.5 size-8 shrink-0 rounded-full bg-gray-300 object-cover shadow-custom"
          />
          <div className="min-w-0 flex-1">
            <p className="flex items-baseline gap-1.5">
              <span className="truncate text-xs font-medium text-gray-1200">{data.name}</span>
              <span className="truncate text-xs text-gray-1000">{data.login}</span>
            </p>
            {data.bio && (
              <p className="mt-0.5 text-xs leading-[1.35] text-gray-1100">{data.bio}</p>
            )}
          </div>
        </div>
      </div>
    </HoverPreview>
  )
}

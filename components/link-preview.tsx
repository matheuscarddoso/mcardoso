"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { ArrowUpRight } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { MONTH_NAMES, type Language } from "@/lib/locale"
import type { GithubCardData } from "@/lib/github"
import type { NowPlaying } from "@/lib/spotify"

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
  "https://kubofood.app": {
    src: "/projects/kubofood.webp",
    alt: "KuboFood",
    width: 640,
    height: 318,
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

/**
 * One request per page, shared by every card that asks and kept for the life
 * of the visit. The promise itself is the cache, so two hovers in quick
 * succession wait on the same fetch rather than starting a second one.
 */
let nowPlayingRequest: Promise<NowPlaying | null> | null = null

function fetchNowPlaying(): Promise<NowPlaying | null> {
  nowPlayingRequest ??= fetch("/api/now-playing")
    .then((response) => (response.status === 204 ? null : response.json()))
    .catch(() => null)
  return nowPlayingRequest
}

/**
 * Loads on the first hover rather than on page load. The card is the only
 * thing that needs this, and most visits never open it.
 */
function useNowPlaying(enabled: boolean) {
  const [track, setTrack] = React.useState<NowPlaying | null>(null)
  const [settled, setSettled] = React.useState(false)

  React.useEffect(() => {
    if (!enabled || settled) return
    let alive = true
    fetchNowPlaying().then((result) => {
      if (!alive) return
      setTrack(result)
      setSettled(true)
    })
    return () => {
      alive = false
    }
  }, [enabled, settled])

  return { track, settled }
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

type PlaybackCopy = {
  playing: string
  /** Already-formatted count and unit, so plurals stay with the language. */
  ago: (value: number, unit: "minute" | "hour" | "day") => string
  justNow: string
  /** Shown while the request is still in flight. */
  loading: string
}

const playback: Record<Language, PlaybackCopy> = {
  PT: {
    playing: "Tocando agora",
    justNow: "Ouvida agora há pouco",
    loading: "Procurando...",
    ago: (value, unit) => {
      const word = { minute: "minuto", hour: "hora", day: "dia" }[unit]
      return `Ouvida há ${value} ${word}${value === 1 ? "" : "s"}`
    },
  },
  EN: {
    playing: "Now playing",
    justNow: "Played just now",
    loading: "Checking...",
    ago: (value, unit) => `Last played ${value} ${unit}${value === 1 ? "" : "s"} ago`,
  },
  ES: {
    playing: "Sonando ahora",
    justNow: "Escuchada hace un momento",
    loading: "Buscando...",
    ago: (value, unit) => {
      const word = { minute: "minuto", hour: "hora", day: "día" }[unit]
      return `Escuchada hace ${value} ${word}${value === 1 ? "" : "s"}`
    },
  },
}

/**
 * Relative time, rounded down to the largest whole unit. Computed on the
 * client and only after the fetch resolves, so there is no server render of it
 * to disagree with.
 */
function playedLabel(track: NowPlaying, language: Language): string {
  const t = playback[language]
  if (track.playing || !track.playedAt) return t.playing

  const elapsed = Date.now() - new Date(track.playedAt).getTime()
  if (elapsed < MINUTE) return t.justNow
  if (elapsed < HOUR) return t.ago(Math.floor(elapsed / MINUTE), "minute")
  if (elapsed < DAY) return t.ago(Math.floor(elapsed / HOUR), "hour")
  return t.ago(Math.floor(elapsed / DAY), "day")
}

export function PlaylistLink({
  language,
  href,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"a">, "href"> & { language: Language; href: string }) {
  const [open, setOpen] = React.useState(false)
  const { track, settled } = useNowPlaying(open)

  // Internal route, so `Link` — a plain anchor here threw away the client
  // navigation and reloaded the whole document to move one page across.
  const anchor = (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  )

  /*
   * Warms the request on pointer intent, before the card is asked to open.
   * The hover card waits 120ms and then springs in over 400ms, so by the time
   * there is anything to look at the track has usually arrived and the reader
   * never sees the placeholder.
   */
  const warm = () => setOpen(true)

  /*
   * No track and the request already finished means Spotify is unreachable,
   * the account has never played anything, or the keys are missing. All three
   * come to the same thing here: nothing worth opening a card for, so the link
   * stands on its own the way an unconfigured GitHub card does.
   */
  if (settled && !track) return <span onPointerEnter={warm}>{anchor}</span>

  return (
    <span onPointerEnter={warm} onFocusCapture={warm}>
      <HoverPreview width={244} trigger={anchor}>
        {/* Both surfaces are fully opaque — the card sits over body copy. */}
        <div className="rounded-xl bg-[#f4f4f5] p-1 shadow-card-lift dark:bg-[#171717]">
          <a
            href={track?.url ?? "https://open.spotify.com"}
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
                    {track?.cover && (
                      <Image src={track.cover} alt="" fill sizes="16px" className="object-cover" />
                    )}
                  </span>
                  <span className="absolute top-1/2 left-1/2 size-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f4f4f5] ring-1 ring-black/40" />
                </span>
              </span>
              <span className="absolute top-0 left-0 size-10 overflow-hidden rounded-md bg-gray-300 shadow-custom">
                {/* The sleeve is the one that carries the meaning; the record
                    behind it is the same art, spinning, and stays decorative. */}
                {track?.cover && (
                  <Image
                    src={track.cover}
                    alt={`${track.title} · ${track.artist}`}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                )}
              </span>
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="flex items-start gap-1">
                <span className="truncate text-xs font-medium text-gray-1200">
                  {track?.title ?? "\u00a0"}
                </span>
                <ArrowUpRight aria-hidden className="mt-px size-3 shrink-0 text-gray-1000" />
              </span>
              {/* Non-breaking space rather than nothing, so the two rows hold
                  their height and the card doesn't resize when the track lands. */}
              <span className="truncate text-xs text-gray-1100">{track?.artist ?? "\u00a0"}</span>
            </span>
          </a>
          <p className="px-1.5 py-1 text-[10px] text-gray-1000">
            {track ? playedLabel(track, language) : playback[language].loading}
          </p>
        </div>
      </HoverPreview>
    </span>
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

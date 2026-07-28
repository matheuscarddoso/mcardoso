"use client"

import * as React from "react"
import Image from "next/image"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { ArrowUpRight } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import type { Language } from "@/lib/locale"

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
  "https://app.4selet.com": {
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
}: React.ComponentProps<"a"> & { language: Language }) {
  const anchor = (
    <a href={href} className={className} {...props}>
      {children}
    </a>
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
              <Image
                src={NOW_PLAYING.thumbnail}
                alt=""
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

"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CassettePlayer } from "@/components/crafts/cassette-player"
import { LoadingState } from "@/components/crafts/loading-state"
import { crafts, type Craft } from "@/lib/crafts"
import type { Language } from "@/lib/locale"

/**
 * The crafts on the home page.
 *
 * Each card shows the real component, not a screenshot. A picture of a
 * component goes stale the first time the component changes and nobody
 * notices for a month.
 *
 * What hovering does is the craft's own business, because what is worth
 * showing differs: the cassette has something to play, and the loader is
 * already an animation and only needs permission to run.
 */

type Preview = {
  node: React.ReactNode
  /** Applied to the wrapper the card hovers. */
  motion?: string
}

const PREVIEWS: Record<string, Preview> = {
  "cassette-audio-player": {
    node: (
      /* Anchored left rather than centred: the crop has to fall on the empty
         right of the label, because centring takes the same bite out of both
         ends and the title is on one of them. */
      <div className="absolute top-6 left-4 w-[420px]">
        {/* `preload="none"`: a card should not cost an audio download for a
            player nobody has asked to hear. Hovering is the asking. */}
        <CassettePlayer preload="none" className="bg-transparent p-0" />
      </div>
    ),
    motion:
      "motion-safe:group-hover:-translate-x-1.5 motion-safe:group-hover:-translate-y-2",
  },
  "loading-state": {
    node: (
      /* Centred rather than cropped: small enough to show whole, and a loader
         with its edges cut off reads as broken rather than framed. */
      <div className="absolute inset-0 grid place-items-center">
        <LoadingState />
      </div>
    ),
    /*
     * Held still until the card is hovered. `animation-play-state` rather than
     * a prop on the component: whether a loader is animating is a question the
     * page is asking, not one the component should have an opinion about, and
     * a `paused` loading state is a contradiction to put in an API.
     *
     * Important, and it has to be. The component sets the `animation`
     * shorthand inline, the shorthand resets play state to running, and an
     * inline declaration outranks a stylesheet one every time but this.
     */
    motion:
      "[&_*]:[animation-play-state:paused]! group-hover:[&_*]:[animation-play-state:running]!",
  },
}

/**
 * Starts the cassette on hover, silently.
 *
 * Reaching into the DOM for the `audio` element rather than adding a prop: the
 * component's job is to play what someone asked it to play, and "start when a
 * card two levels up is hovered" is the card's idea. It stays here.
 *
 * Muted, always. A page that makes noise because a pointer crossed it is a
 * page people close, and muted playback is also the only kind browsers allow
 * without a click.
 */
function useHoverPlayback() {
  const ref = React.useRef<HTMLDivElement>(null)

  const audio = () => ref.current?.querySelector("audio") ?? null

  const start = () => {
    const element = audio()
    if (!element) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    element.muted = true
    element.currentTime = 0
    /* Rejected when the file has not arrived yet, which is not an error worth
       reporting for a decoration. */
    void element.play().catch(() => {})
  }

  const stop = () => {
    const element = audio()
    if (!element) return
    element.pause()
    /* Back to the start, so the next hover plays the same opening. */
    element.currentTime = 0
  }

  return { ref, start, stop }
}

function CraftCard({
  craft,
  locale,
  language,
}: {
  craft: Craft
  locale: string
  language: Language
}) {
  const preview = PREVIEWS[craft.slug]
  const { ref, start, stop } = useHoverPlayback()
  const plays = craft.slug === "cassette-audio-player"

  return (
    <li className="flex">
      <Link
        href={`/${locale}/crafts/${craft.slug}`}
        onPointerEnter={plays ? start : undefined}
        onPointerLeave={plays ? stop : undefined}
        onFocus={plays ? start : undefined}
        onBlur={plays ? stop : undefined}
        /* No scale on hover: the card holds still and the component inside it
           moves instead, which is the thing worth looking at. */
        className="group flex w-full flex-col overflow-hidden rounded-xl bg-preview-bg px-3.5 pt-3.5 pb-3.5 shadow-custom transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-strong)] hover:shadow-card-lift active:scale-[0.985] motion-reduce:active:scale-100"
      >
        {/*
          `inert` rather than `aria-hidden`: the preview can be a whole player
          with its own buttons, and hiding it from a screen reader while
          leaving those buttons in the tab order is worse than not hiding it.
        */}
        <div inert className="relative h-40 w-full overflow-hidden rounded-lg bg-secondary">
          <div
            ref={ref}
            className={`absolute inset-0 transition-transform duration-500 ease-[var(--ease-out-strong)] ${preview?.motion ?? ""}`}
          >
            {preview?.node}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <h3 className="text-base font-medium tracking-[-0.01em] text-gray-1200">
            {craft.title}
          </h3>
          <ArrowRight
            aria-hidden
            className="ml-auto size-4 shrink-0 text-gray-1100 transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-0.5"
          />
        </div>
        <p className="mt-1 text-sm leading-5 text-gray-1100">{craft.description[language]}</p>
      </Link>
    </li>
  )
}

export function CraftList({ locale, language }: { locale: string; language: Language }) {
  return (
    <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
      {crafts.map((craft) => (
        <CraftCard key={craft.slug} craft={craft} locale={locale} language={language} />
      ))}
    </ul>
  )
}

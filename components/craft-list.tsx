"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CassettePlayer } from "@/components/crafts/cassette-player"
import { crafts } from "@/lib/crafts"
import type { Language } from "@/lib/locale"

/**
 * The crafts on the home page.
 *
 * Each card shows the real component, cropped, rather than a screenshot. A
 * picture of a component is a thing that goes stale the first time the
 * component changes and nobody notices for a month.
 */

/**
 * Drawn wider than the card and clipped, so the card shows a detail at a
 * readable size instead of the whole thing shrunk to a thumbnail.
 *
 * Anchored to the left rather than centred: the crop has to fall on the empty
 * right of the label, because centring it takes the same bite out of both ends
 * and the title is on one of them.
 */
const PREVIEWS: Record<string, React.ReactNode> = {
  "cassette-audio-player": (
    <div className="absolute top-6 left-4 w-[420px]">
      {/* `preload="none"`: the card should never cost an audio download for a
          player nobody has asked to hear. */}
      <CassettePlayer preload="none" className="bg-transparent p-0" />
    </div>
  ),
}

export function CraftList({ locale, language }: { locale: string; language: Language }) {
  return (
    <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
      {crafts.map((craft) => (
        <li key={craft.slug} className="flex">
          <Link
            href={`/${locale}/crafts/${craft.slug}`}
            className="group flex w-full flex-col overflow-hidden rounded-xl bg-preview-bg px-3.5 pt-3.5 pb-3.5 shadow-custom transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-strong)] hover:scale-[1.015] hover:shadow-card-lift active:scale-[0.985] motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
          >
            {/*
              `inert` rather than `aria-hidden`: the preview is a whole player
              with its own buttons, and hiding it from a screen reader while
              leaving those buttons in the tab order is worse than not hiding
              it at all.
            */}
            <div
              inert
              className="relative h-40 w-full overflow-hidden rounded-lg bg-secondary"
            >
              {PREVIEWS[craft.slug]}
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
            <p className="mt-1 text-sm leading-5 text-gray-1100">
              {craft.description[language]}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}

"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

/** Blank cards fanned out to the right, behind the preview. */
const DECK_LAYERS = 5
/** Sliver of each trailing card left visible, in px — also its hover target. */
const DECK_STEP_X = 12
/** Each trailing card starts slightly lower, in px. */
const DECK_STEP_Y = 5
/** Extra spread per trailing card on hover, in px. */
const DECK_FAN = 3

/** Front and trailing cards share a width — they're the same card, offset. */
const DECK_WIDTH = "58%"

function PreviewDeck({ children }: { children: React.ReactNode }) {
  return (
    // No clipping here: the cards fan and lift outside these bounds on hover.
    <div className="relative w-full">
      {Array.from({ length: DECK_LAYERS }, (_, index) => {
        // Farthest card first so nearer ones paint over it.
        const layer = DECK_LAYERS - index
        return (
          <div
            key={layer}
            aria-hidden
            // Each card answers for itself: hovering its exposed sliver lifts
            // only that one. The deck-wide fan still rides on the card hover.
            className="absolute bottom-0 w-(--deck-width) rounded-lg bg-preview-bg shadow-custom transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-(--fan) hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            style={
              {
                left: layer * DECK_STEP_X,
                top: layer * DECK_STEP_Y,
                "--deck-width": DECK_WIDTH,
                "--fan": `${layer * DECK_FAN}px`,
              } as React.CSSProperties
            }
          />
        )
      })}
      {/* Front card drives the deck's height, so the screenshot sets the aspect ratio. */}
      <div
        className="relative aspect-16/9 w-(--deck-width) overflow-hidden rounded-lg bg-preview-bg shadow-custom"
        style={{ "--deck-width": DECK_WIDTH } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  )
}

export function ProjectCard({
  href,
  title,
  meta,
  description,
  ariaLabel,
  preview,
}: {
  href: string
  title: string
  meta: string
  description: string
  ariaLabel: string
  preview: React.ReactNode
}) {
  return (
    <a
      aria-label={ariaLabel}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      // `w-full`: the card is now a grid item's only child, so it has to fill
      // the cell rather than shrink-wrap its content.
      className="group flex w-full flex-col overflow-hidden rounded-xl bg-preview-bg px-3.5 pt-5 pb-3.5 shadow-custom transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-strong)] hover:scale-[1.015] hover:shadow-card-lift active:scale-[0.985] motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
    >
      <PreviewDeck>{preview}</PreviewDeck>
      <div className="mt-3 flex items-center gap-2">
        <h3 className="text-base font-medium tracking-[-0.01em] text-gray-1200">{title}</h3>
        <span className="shrink-0 rounded-full px-1.5 py-0.5 text-xs leading-5 text-gray-1100 shadow-custom">
          {meta}
        </span>
        <ArrowRight
          aria-hidden
          className="ml-auto size-4 shrink-0 text-gray-1100 transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-0.5"
        />
      </div>
      <p className="mt-1 text-sm leading-5 text-gray-1100">{description}</p>
    </a>
  )
}

/** Real product screenshot, cropped to the deck's front card. */
function Screenshot({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="220px"
      className="object-contain"
    />
  )
}

/* Described rather than left decorative: the card's link label says where it
   goes, not what the product looks like, so the screenshot carries meaning of
   its own that a non-sighted reader would otherwise lose. */
export function KuboPreview() {
  return <Screenshot src="/projects/kubofood.webp" alt="KuboFood order screen" />
}

export function AbacatePreview() {
  return <Screenshot src="/projects/abacate-pay.webp" alt="Abacate Pay checkout screen" />
}

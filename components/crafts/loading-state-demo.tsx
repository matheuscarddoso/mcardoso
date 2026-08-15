"use client"

import * as React from "react"
import { motion } from "motion/react"
import { LoadingState, type LoadingVariant } from "@/components/crafts/loading-state"

/**
 * The stage around the loader: somewhere to stand it, and a way to see all
 * three patterns without reading the source.
 *
 * Deliberately not part of the component. A variant picker is something a demo
 * needs and a loading state never does, and shipping it inside would have
 * everyone who copies this file delete it first.
 */

const VARIANTS: { value: LoadingVariant; label: string }[] = [
  { value: "drive", label: "Drive" },
  { value: "dots", label: "Dots" },
  { value: "orbit", label: "Orbit" },
]

/* The register the theme tray uses, so the two behave the same way. */
const SPRING = { type: "spring" as const, duration: 0.4, bounce: 0.15 }

export function LoadingStateDemo() {
  const [variant, setVariant] = React.useState<LoadingVariant>("drive")

  return (
    <div className="grid w-full place-items-center gap-10 rounded-xl bg-preview-bg px-6 py-16">
      {/*
        Remounted per variant. The patterns start their cycles from the moment
        the cells mount, and switching without a remount would drop the new
        wavefront into the middle of the old one's phase.
      */}
      <LoadingState key={variant} variant={variant} />

      <div
        role="radiogroup"
        aria-label="Pattern"
        className="flex items-center gap-0.5 rounded-full bg-secondary p-1"
      >
        {VARIANTS.map((entry) => {
          const active = entry.value === variant

          return (
            <button
              key={entry.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setVariant(entry.value)}
              className="relative cursor-pointer rounded-full px-3 py-1 text-[13px] transition-[color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] motion-reduce:active:scale-100"
            >
              {/* One shared `layoutId`, so the pill travels between the three
                  rather than fading out here and in there. */}
              {active && (
                <motion.span
                  layoutId="craft-variant-active"
                  transition={SPRING}
                  className="absolute inset-0 rounded-full bg-preview-bg shadow-custom"
                />
              )}
              <span
                className={`relative ${active ? "text-gray-1200" : "text-gray-1000"}`}
              >
                {entry.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

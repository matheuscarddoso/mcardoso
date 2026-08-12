"use client"

import * as React from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { MARK_CENTER } from "@/components/brand-marks"

/**
 * The overlapping faces beside the Abacate Pay headcount.
 *
 * Decorative on purpose: `alt=""` and `aria-hidden`, because the sentence
 * already says how many people there are. Three unlabelled faces would only
 * add three stops to a screen reader without adding a fact, and naming them
 * would mean naming real people this file has no way to identify.
 */
const FACES = ["/people/abacate-1.png", "/people/abacate-2.png", "/people/abacate-3.png"]

/* Geometry in `em`, so the stack tracks the paragraph rather than a fixed size. */
const FACE = 1.15

/**
 * The gap between one face and the next, at rest and hovered. Negative is an
 * overlap, so the pile at rest is each face sitting on top of half the one
 * before it, and hovering opens it to a hair of daylight.
 */
const STACKED_GAP = -0.53
const OPEN_GAP = 0.1

/**
 * A touch of bounce: the spread is a flourish, not a state change, and this is
 * one of the few places on the page where that is the right register.
 */
const SPRING = { type: "spring" as const, duration: 0.4, bounce: 0.22 }

export function AvatarStack() {
  const [open, setOpen] = React.useState(false)
  const shouldReduceMotion = useReducedMotion()

  const transition = shouldReduceMotion ? { duration: 0.15 } : SPRING

  return (
    /*
     * No width of its own. The faces sit in normal flow and the gap between
     * them is what animates, so the box is only ever as wide as they are and
     * the sentence re-spaces around it the way it would around any word that
     * grew. An earlier version pinned the width and spread the faces with
     * transforms to stop the line reflowing; this is the opposite trade, and
     * it is the one that reads as the pile actually opening.
     */
    <span
      aria-hidden
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      // Same centre as the brand marks, from the same constant, so the faces
      // and the logos in the paragraph above sit on one line.
      style={{ verticalAlign: `${(MARK_CENTER - FACE / 2).toFixed(3)}em` }}
      className="inline-flex"
    >
      {FACES.map((src, index) => (
        <motion.span
          key={src}
          // The first face has nothing to overlap, so only the rest move.
          animate={{
            marginLeft: index === 0 ? 0 : `${open ? OPEN_GAP : STACKED_GAP}em`,
          }}
          initial={false}
          transition={transition}
          // Later faces paint over earlier ones, so the stack reads as a pile
          // leaning right rather than a row of discs of ambiguous order.
          style={{ zIndex: index }}
          /*
           * The ring is the page's own background, not the card surface: these
           * sit in a paragraph, and it is what cuts each face away from the one
           * beneath so the pile reads as separate discs.
           */
          className="relative block shrink-0 overflow-hidden rounded-full bg-background ring-2 ring-background"
        >
          {/* Fixed size and no `sizes`, so Next emits the 1x/2x pair rather
              than a full-width srcSet: with `sizes` it wrote sixteen candidate
              URLs per face for something that paints at eighteen pixels. */}
          <Image
            src={src}
            alt=""
            width={48}
            height={48}
            className="block object-cover"
            style={{ width: `${FACE}em`, height: `${FACE}em` }}
          />
        </motion.span>
      ))}
    </span>
  )
}

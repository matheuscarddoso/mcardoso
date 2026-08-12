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
/** Each face sits this far right of the one before it. */
const STACKED = 0.62

/**
 * How far the outermost faces travel on hover, in em, and the reason this
 * component takes up no more room when they do.
 *
 * The spread runs *outward from the middle face*, not rightward off the end:
 * the left face goes left, the right face goes right, the middle one holds.
 * So the extra width is split between the two sides, and each side only has to
 * borrow half of it from the word space already sitting there.
 */
const SPREAD = 0.4

/** Middle index, which is the face that stays put. */
const PIVOT = (FACES.length - 1) / 2

/**
 * A hair of room on each side, so the borrowed space on hover is space this
 * component already owns. At rest it just reads as slightly loose word
 * spacing, which is what an inline avatar pile wants anyway.
 */
const BREATHING = 0.15

/** Rounded, or the inline style prints `2.3899999999999997em`. */
const STACK_WIDTH = `${Math.round((FACE + STACKED * (FACES.length - 1)) * 1000) / 1000}em`

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
     * Fixed width, always. The first version animated it so the number after
     * the stack would be carried along, and that reflowed the paragraph: on
     * hover the last words of the line were pushed onto the next one and the
     * whole block jumped. Nothing about a hover flourish is worth moving the
     * text a reader is in the middle of. So the footprint never changes and
     * the faces move by transform alone, spreading into the margins below.
     */
    <span
      aria-hidden
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      // Same centre as the brand marks, from the same constant, so the faces
      // and the logos in the paragraph above sit on one line.
      style={{
        height: `${FACE}em`,
        width: STACK_WIDTH,
        marginInline: `${BREATHING}em`,
        verticalAlign: `${(MARK_CENTER - FACE / 2).toFixed(3)}em`,
      }}
      className="relative inline-block shrink-0"
    >
      {FACES.map((src, index) => (
        <motion.span
          key={src}
          animate={{ x: `${STACKED * index + (open ? (index - PIVOT) * SPREAD : 0)}em` }}
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
          className="absolute top-0 left-0 block overflow-hidden rounded-full bg-background ring-2 ring-background"
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

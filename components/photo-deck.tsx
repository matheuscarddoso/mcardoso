"use client"

import * as React from "react"
import Image from "next/image"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import type { Language } from "@/lib/locale"

/**
 * The fanned pile of photographs above the footer.
 *
 * Every card is the same size and the images behind them are not, so each one
 * is cropped to a shared portrait ratio rather than laid out to its own. A
 * deck whose cards are different shapes is a stack of paper, not a deck.
 */

type Localized = Record<Language, string>

type Photo = {
  src: string
  /**
   * The file's own pixel dimensions. They are here so the open photograph can
   * be sized from arithmetic instead of from the image having loaded, which is
   * what the morph needs: Motion measures the target box on the frame the
   * dialog mounts, and an element sized by its content is still zero then.
   */
  w: number
  h: number
  /** Sits under the photograph once it is open. */
  caption: Localized
}

const PHOTOS: readonly Photo[] = [
  {
    src: "/elsewhere/run.webp",
    w: 787,
    h: 1400,
    caption: {
      PT: "3 km antes de dormir",
      EN: "3 km before bed",
      ES: "3 km antes de dormir",
    },
  },
  {
    src: "/elsewhere/gem.webp",
    w: 787,
    h: 1400,
    caption: {
      PT: "a 0.1.0 do SDK Ruby indo pro ar",
      EN: "the Ruby SDK's 0.1.0 going live",
      ES: "la 0.1.0 del SDK Ruby saliendo",
    },
  },
  {
    src: "/elsewhere/coffee.webp",
    w: 1400,
    h: 1400,
    caption: {
      PT: "o café, no fim da tarde",
      EN: "the coffee shop, late afternoon",
      ES: "el café, al atardecer",
    },
  },
  {
    src: "/elsewhere/walk.webp",
    w: 1400,
    h: 1400,
    caption: {
      PT: "o passeio é dele, eu só sigo",
      EN: "his walk, I just follow",
      ES: "su paseo, yo solo sigo",
    },
  },
  {
    src: "/elsewhere/panettone.webp",
    w: 1400,
    h: 1400,
    caption: {
      PT: "dezembro chega primeiro no mercado",
      EN: "December reaches the market first",
      ES: "diciembre llega antes al mercado",
    },
  },
  {
    src: "/elsewhere/produce.webp",
    w: 1400,
    h: 1400,
    caption: {
      PT: "o corredor dos verdes",
      EN: "the produce aisle",
      ES: "el pasillo de verduras",
    },
  },
  {
    src: "/elsewhere/acai.webp",
    w: 1400,
    h: 1050,
    caption: {
      PT: "açaí depois da corrida",
      EN: "açaí after the run",
      ES: "açaí después de correr",
    },
  },
]

const open = {
  PT: (caption: string) => `Ampliar: ${caption}`,
  EN: (caption: string) => `Expand: ${caption}`,
  ES: (caption: string) => `Ampliar: ${caption}`,
} as const

const close = { PT: "Fechar a foto", EN: "Close photo", ES: "Cerrar la foto" } as const

/**
 * Card size and overlap live in CSS, as clamps against the viewport, because
 * the fan has to fit the prose column at every width and seven fixed cards do
 * not. See `--deck-card-w` in `globals.css` for the arithmetic.
 */
const CARD_W = "var(--deck-card-w)"
const CARD_H = "var(--deck-card-h)"
const OVERLAP = "calc(var(--deck-overlap) * -1)"

/**
 * Intrinsic size handed to Next, not the rendered one. Twice the widest the
 * card ever gets, so the 2x variant is sharp and nothing larger is fetched
 * for something that paints at 144px.
 */
const SOURCE_W = 288
const SOURCE_H = 342

/** Degrees between one card and the next, so the pile reads as a fan. */
const TILT = 5.5

/* Apple-style spring, same register as the avatar lightbox. */
const SPRING_IN = { type: "spring" as const, duration: 0.55, bounce: 0.18 }
const SPRING_OUT = { type: "spring" as const, duration: 0.4, bounce: 0 }
const LIFT = { type: "spring" as const, duration: 0.4, bounce: 0.3 }

export function PhotoDeck({ language }: { language: Language }) {
  const [active, setActive] = React.useState<Photo | null>(null)
  const [lifted, setLifted] = React.useState<number | null>(null)
  const reduceMotion = useReducedMotion()

  /* Reduced motion keeps the crossfade and drops the morph, same trade the
     avatar lightbox makes: the change is still explained, nothing travels. */
  const layoutId = (src: string) => (reduceMotion ? undefined : `photo-${src}`)

  return (
    <>
      {/*
        The fan leans on negative margins rather than absolute positioning, so
        the row is as wide as its cards and stays centred without arithmetic.
        `pt-6` is headroom for the lift: a card rising out of the pile would
        otherwise be clipped by the section above it.
      */}
      <div className="flex justify-center overflow-visible pt-6 pb-2">
        {PHOTOS.map((photo, index) => {
          // The fan is centred, so the middle card is upright and the ones
          // either side rotate away from it.
          const tilt = (index - (PHOTOS.length - 1) / 2) * TILT
          const isLifted = lifted === index

          return (
            <motion.button
              key={photo.src}
              type="button"
              aria-label={open[language](photo.caption[language])}
              onClick={() => setActive(photo)}
              onHoverStart={() => setLifted(index)}
              onHoverEnd={() => setLifted((current) => (current === index ? null : current))}
              onFocus={() => setLifted(index)}
              onBlur={() => setLifted((current) => (current === index ? null : current))}
              animate={{
                rotate: isLifted ? 0 : tilt,
                y: isLifted ? -18 : 0,
                scale: isLifted ? 1.08 : 1,
              }}
              transition={reduceMotion ? { duration: 0.12 } : LIFT}
              style={{
                width: CARD_W,
                height: CARD_H,
                marginLeft: index === 0 ? 0 : OVERLAP,
                // Raised above its neighbours only while lifted, so the card
                // comes forward out of the pile rather than under the next one.
                zIndex: isLifted ? PHOTOS.length : index,
              }}
              className="relative shrink-0 cursor-zoom-in rounded-xl bg-white p-1 shadow-card-lift outline-offset-2 focus-visible:outline-2 focus-visible:outline-black/40 dark:bg-[#2a2a2a] dark:focus-visible:outline-white/40"
            >
              <motion.span
                layoutId={layoutId(photo.src)}
                transition={SPRING_OUT}
                className="block h-full w-full overflow-hidden rounded-lg"
              >
                {/*
                  Decorative here and described in the dialog: the button
                  already announces the caption, so an alt repeating it would
                  read the same sentence twice in a row.
                */}
                <Image
                  src={photo.src}
                  alt=""
                  width={SOURCE_W}
                  height={SOURCE_H}
                  className="h-full w-full object-cover grayscale"
                />
              </motion.span>
            </motion.button>
          )
        })}
      </div>

      <DialogPrimitive.Root open={Boolean(active)} onOpenChange={(next) => !next && setActive(null)}>
        <AnimatePresence>
          {active && (
            <DialogPrimitive.Portal forceMount>
              <DialogPrimitive.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                  className="fixed inset-0 z-50 bg-background/90 backdrop-blur-[3px]"
                />
              </DialogPrimitive.Overlay>

              <DialogPrimitive.Content
                asChild
                aria-describedby={undefined}
                className="fixed inset-0 z-50 grid cursor-zoom-out place-items-center p-6 focus:outline-none"
              >
                <motion.div
                  onClick={(event) => {
                    if (event.target === event.currentTarget) setActive(null)
                  }}
                >
                  <DialogPrimitive.Title className="sr-only">
                    {active.caption[language]}
                  </DialogPrimitive.Title>

                  <DialogPrimitive.Close aria-label={close[language]} asChild>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.12 } }}
                      transition={{ duration: 0.28, delay: 0.08 }}
                      className="fixed top-4 right-4 inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-gray-1100 transition-[color,background-color,transform] duration-150 ease-[var(--ease-out-strong)] hover:bg-black/5 hover:text-gray-1200 active:scale-[0.97] motion-reduce:active:scale-100 dark:hover:bg-white/10"
                    >
                      <X className="size-5" strokeWidth={2} />
                    </motion.button>
                  </DialogPrimitive.Close>

                  {/* Cursor stays default over the photo itself: only the
                      surround dismisses, so only the surround says it does. */}
                  <figure className="flex cursor-default flex-col items-center gap-3">
                    {/*
                      Sized from the photograph's own ratio rather than from
                      the loaded bitmap. `min(86vw, 76vh * ratio)` is the
                      largest box that fits both axes, and it resolves on the
                      first frame, which is the frame Motion measures to build
                      the morph. Sizing this by content instead left the target
                      at zero and the animation had nothing to travel to.
                    */}
                    <motion.div
                      layoutId={layoutId(active.src)}
                      transition={SPRING_IN}
                      initial={reduceMotion ? { opacity: 0 } : undefined}
                      animate={reduceMotion ? { opacity: 1 } : undefined}
                      exit={reduceMotion ? { opacity: 0 } : undefined}
                      style={{
                        width: `min(86vw, calc(76vh * ${(active.w / active.h).toFixed(4)}))`,
                        aspectRatio: `${active.w} / ${active.h}`,
                      }}
                      className="overflow-hidden rounded-xl shadow-card-lift"
                    >
                      <Image
                        src={active.src}
                        alt={active.caption[language]}
                        width={active.w}
                        height={active.h}
                        priority
                        className="h-full w-full object-cover grayscale"
                      />
                    </motion.div>
                    <motion.figcaption
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      transition={{ duration: 0.3, delay: 0.12 }}
                      className="text-sm text-gray-1100"
                    >
                      {active.caption[language]}
                    </motion.figcaption>
                  </figure>
                </motion.div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    </>
  )
}

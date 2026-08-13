"use client"

import * as React from "react"
import Image from "next/image"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "motion/react"

const LAYOUT_ID = "avatar-photo"

/* Apple-style spring params: easier to reason about than mass/stiffness/damping.
   Exit is faster and bounce-free — the user already decided, so get out of the way. */
const SPRING_IN = { type: "spring", duration: 0.55, bounce: 0.18 } as const
const SPRING_OUT = { type: "spring", duration: 0.4, bounce: 0 } as const

const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const
const SCRIM_IN = { duration: 0.28, ease: EASE_OUT_STRONG } as const
/* Kept close to the morph-back duration so the scrim clears *with* the photo, not before it. */
const SCRIM_OUT = { duration: 0.3, ease: EASE_OUT_STRONG } as const

/* Flick-to-dismiss: distance OR velocity, so a quick flick works without travelling far. */
const DISMISS_DISTANCE = 110
const DISMISS_VELOCITY = 520

/* Intrinsic source is 299×299. Anything larger upscales and goes soft. */
const SOURCE_SIZE = 299

type AvatarLightboxProps = {
  src: string
  alt: string
  /** Accessible label for the trigger, e.g. "Open profile photo". */
  triggerLabel: string
  /** Accessible label for the close button. */
  closeLabel: string
  size?: number
}

export function AvatarLightbox({
  src,
  alt,
  triggerLabel,
  closeLabel,
  size = 44,
}: AvatarLightboxProps) {
  const [open, setOpen] = React.useState(false)
  const [warm, setWarm] = React.useState(false)
  const reduceMotion = useReducedMotion()

  const dragY = useMotionValue(0)
  // Scrim thins out as the photo is dragged away — the gesture feels connected to the dismissal.
  const scrimOpacity = useTransform(dragY, [-320, 0, 320], [0.35, 1, 0.35])

  // Reduced motion: drop the positional morph, keep the opacity crossfade that explains the change.
  const layoutId = reduceMotion ? undefined : LAYOUT_ID

  /* Reset on the way *in*, never on the way out: closing mid-drag must morph back from
     where the finger actually left the photo, not snap to centre first. */
  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (next) dragY.set(0)
      setOpen(next)
    },
    [dragY],
  )

  const handleDragEnd = React.useCallback(
    (_event: unknown, info: PanInfo) => {
      const flicked =
        Math.abs(info.offset.y) > DISMISS_DISTANCE ||
        Math.abs(info.velocity.y) > DISMISS_VELOCITY
      if (flicked) setOpen(false)
    },
    [],
  )

  /* Only the scrim itself dismisses. The photo and close button are descendants, so their
     clicks report a different target and fall through to their own handlers. */
  const handleScrimClick = React.useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) setOpen(false)
  }, [])

  /* Warm the full-size variant on intent, not on page load. `display: none` images are
     still fetched, so by the time the click lands the bitmap is in cache. */
  const warmUp = React.useCallback(() => setWarm(true), [])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Trigger
        aria-label={triggerLabel}
        onPointerEnter={warmUp}
        onFocus={warmUp}
        style={{ width: size, height: size }}
        className="block shrink-0 cursor-zoom-in rounded-full outline-offset-2 outline-black/5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-2 focus-visible:outline-black/40 active:scale-[0.97] motion-reduce:active:scale-100 dark:outline-white/5 dark:focus-visible:outline-white/40"
      >
        <motion.span
          layoutId={layoutId}
          transition={SPRING_OUT}
          style={{ borderRadius: 9999 }}
          className="block h-full w-full overflow-hidden"
        >
          <Image
            src={src}
            alt={alt}
            width={size}
            height={size}
            className="pointer-events-none h-full w-full object-cover"
          />
        </motion.span>
      </DialogPrimitive.Trigger>

      {warm && !open && (
        <div className="hidden" aria-hidden="true">
          <Image src={src} alt="" width={SOURCE_SIZE} height={SOURCE_SIZE} quality={95} />
        </div>
      )}

      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount key="avatar-lightbox">
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: SCRIM_OUT }}
                transition={SCRIM_IN}
                className="pointer-events-none fixed inset-0 z-50"
              >
                <motion.div
                  style={{ opacity: reduceMotion ? 1 : scrimOpacity }}
                  className="h-full w-full bg-black/85 backdrop-blur-[3px]"
                />
              </motion.div>
            </DialogPrimitive.Overlay>

            {/* Content spans the viewport so the close button lives inside the focus trap.
                Radix's DismissableLayer forces `pointer-events: auto` here via inline style, so
                outside-click detection can never fire — dismiss on the scrim area directly instead. */}
            <DialogPrimitive.Content
              asChild
              aria-describedby={undefined}
              className="fixed inset-0 z-50 grid cursor-zoom-out place-items-center focus:outline-none"
            >
              <motion.div onClick={handleScrimClick}>
                <DialogPrimitive.Title className="sr-only">{alt}</DialogPrimitive.Title>

                <DialogPrimitive.Close
                  aria-label={closeLabel}
                  asChild
                >
                  <motion.button
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.12 } }}
                    transition={{ ...SCRIM_IN, delay: 0.08 }}
                    className="fixed top-4 left-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white/70 transition-[color,background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none active:scale-[0.97] motion-reduce:active:scale-100"
                  >
                    <X className="h-5 w-5" strokeWidth={2} />
                  </motion.button>
                </DialogPrimitive.Close>

                <motion.div
                  drag={reduceMotion ? false : "y"}
                  dragElastic={0.35}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragMomentum={false}
                  onDragEnd={handleDragEnd}
                  style={{ y: dragY }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <motion.div
                    layoutId={layoutId}
                    transition={SPRING_IN}
                    initial={reduceMotion ? { opacity: 0 } : undefined}
                    animate={reduceMotion ? { opacity: 1 } : undefined}
                    exit={reduceMotion ? { opacity: 0 } : undefined}
                    style={{ borderRadius: 9999 }}
                    className="aspect-square w-[min(74vw,46vh)] max-w-[340px] overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt={alt}
                      width={SOURCE_SIZE}
                      height={SOURCE_SIZE}
                      quality={95}
                      priority
                      draggable={false}
                      className="h-full w-full object-cover select-none"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

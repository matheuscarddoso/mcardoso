"use client";

import * as React from "react";
import { ArrowDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Language } from "@/lib/locale";

/**
 * A button at the foot of the viewport that walks the article one section at a
 * time, and drops to the end once there are no sections left.
 *
 * Not a jump to the bottom, which is what this shape of button usually does.
 * The bottom of a long piece is rarely where anyone wants to be; the next
 * heading almost always is, and holding the button gets you there one section
 * per press without hunting for the scrollbar.
 */

/** The same headings the gutter timeline marks, so the two agree on a section. */
const SELECTOR = "article :is(h1, h2)[id]";

/**
 * Headroom above a heading once it has been scrolled to, from the `scroll-mt-20`
 * the headings carry. A heading resting at that line is the one being read, so
 * the next one has to be found below it, not at it.
 */
const HEADROOM = 80;
const BELOW = HEADROOM + 8;

const label = {
  PT: { next: "Próxima seção", end: "Ir para o fim" },
  EN: { next: "Next section", end: "Go to the end" },
  ES: { next: "Siguiente sección", end: "Ir al final" },
} as const;

/* Apple-ish spring, the register the rest of the site moves in. */
const SPRING = { type: "spring" as const, duration: 0.42, bounce: 0.26 };

export function ArticleNextSection({ language }: { language: Language }) {
  const [visible, setVisible] = React.useState(false);
  const [atEnd, setAtEnd] = React.useState(false);
  /* Bumped on every press to replay the arrow's nudge. */
  const [nudge, setNudge] = React.useState(0);
  const reduceMotion = useReducedMotion();
  const t = label[language];

  React.useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const bottom = doc.scrollHeight - window.innerHeight - window.scrollY;
      /* Two pixels of slack: sub-pixel layout means the arithmetic rarely
         lands on zero exactly. */
      setVisible(bottom > 2);
      /* Only changes the label it announces; the press does the right thing
         either way. */
      setAtEnd(nextHeading() === null);
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, []);

  const go = () => {
    setNudge((n) => n + 1);
    const behavior = reduceMotion ? ("auto" as const) : ("smooth" as const);
    const next = nextHeading();

    if (next) {
      next.scrollIntoView({ behavior, block: "start" });
      return;
    }

    /* Past the last heading, the only thing left to reach is the end. */
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 8 }}
          transition={reduceMotion ? { duration: 0.12 } : SPRING}
          /*
           * No `filter` here, deliberately, however good a blurred entrance
           * would look. A filter on an ancestor makes that ancestor the
           * backdrop root for everything inside it, so the button's
           * `backdrop-filter` samples an empty group instead of the page and
           * the glass turns into nothing at all. Motion leaves `blur(0px)`
           * behind after the animation, so it is not even a passing problem.
           */
          /* Above the iOS home indicator, and out of the way of the gutter
             timeline, which lives on the left. */
          className="pointer-events-none fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 flex justify-center"
        >
          <button
            type="button"
            onClick={go}
            aria-label={atEnd ? t.end : t.next}
            /*
             * Glass, and only just: 88% opaque, so the arrow stays legible
             * over whatever paragraph is behind it, with enough blur that the
             * page reads as continuing underneath rather than stopping.
             *
             * `color-mix` and not `bg-preview-bg/88`. The base class is a
             * hand-written utility in globals.css, not a theme colour, so
             * Tailwind never generates an opacity variant of it and the class
             * silently does not exist. It is the same trap `bg-gray-1200` set
             * once already: with these, a class either exists or the element
             * has no rule at all.
             */
            className="pointer-events-auto grid size-9 cursor-pointer place-items-center rounded-full bg-[color-mix(in_srgb,var(--color-preview-bg)_88%,transparent)] text-gray-1100 shadow-card-lift ring-1 ring-border backdrop-blur-md backdrop-saturate-150 transition-[color,transform] duration-150 ease-[var(--ease-out-strong)] hover:bg-[var(--color-preview-bg)] hover:text-gray-1200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/40 active:scale-[0.94] motion-reduce:active:scale-100 dark:focus-visible:outline-white/40"
          >
            {/* The arrow dips and comes back on each press, so a press that
                lands on a section already in view still reads as a press. */}
            <motion.span
              key={nudge}
              initial={nudge === 0 || reduceMotion ? false : { y: 0 }}
              animate={nudge === 0 || reduceMotion ? {} : { y: [0, 5, 0] }}
              transition={{ duration: 0.34, ease: [0.23, 1, 0.32, 1] }}
              className="grid place-items-center"
            >
              <ArrowDown aria-hidden className="size-4" strokeWidth={2} />
            </motion.span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** The first heading below the reading line, or null once they are all above. */
function nextHeading(): HTMLElement | null {
  const headings = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
  return (
    headings.find((heading) => heading.getBoundingClientRect().top > BELOW) ??
    null
  );
}

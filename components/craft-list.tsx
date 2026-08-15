"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CassettePlayer } from "@/components/crafts/cassette-player";
import { CommandPaletteAutoplay } from "@/components/crafts/command-palette-autoplay";
import { LoadingState } from "@/components/crafts/loading-state";
import { crafts, type Craft } from "@/lib/crafts";
import type { Language } from "@/lib/locale";

/**
 * The crafts on the home page.
 *
 * Each card shows the real component, not a screenshot. A picture of a
 * component goes stale the first time the component changes and nobody
 * notices for a month.
 *
 * They all run on their own, and what running means is the craft's own
 * business: the cassette plays, the loader counts, the palette types. What
 * they share is when. Nothing starts until its card is on screen, because the
 * section sits near the foot of a long page and most visits never reach it.
 *
 * Hovering is left to say something else: the card lifts what is inside it.
 */

type Preview = {
  /** `active` is true while the card is on screen. */
  render: (active: boolean) => React.ReactNode;
  /** Applied to the wrapper, for what hovering the card should do to it. */
  motion?: string;
  /** Spans both columns, for a component too wide to read at half width. */
  wide?: boolean;
  /** Height of the preview box. Taller components need more of a look. */
  height?: string;
};

const PREVIEWS: Record<string, Preview> = {
  "command-palette": {
    wide: true,
    height: "h-64",
    /*
       Cropped from the top: the input and the first rows are what say what
       this is, and the footer under them says it again in words. Shown at its
       own size rather than scaled down, because the whole subject is text at
       thirteen pixels and scaling it is the one thing that would make it
       illegible.
    */
    render: () => (
      <div className="absolute top-5 left-1/2 w-full max-w-[24rem] -translate-x-1/2">
        <CommandPaletteAutoplay />
      </div>
    ),
  },
  "cassette-audio-player": {
    render: () => (
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
    /*
     * Runs while the card is on screen, through the component's own `running`
     * prop rather than by pausing its animations from outside. The prop stops
     * all three parts at once, including the clock, which CSS cannot reach;
     * and it starts the count from zero each time the card comes back, which
     * is the truth about how long this particular wait has been going.
     */
    render: (active) => (
      /* Centred rather than cropped: small enough to show whole, and a loader
         with its edges cut off reads as broken rather than framed. */
      <div className="absolute inset-0 grid place-items-center">
        <LoadingState running={active} />
      </div>
    ),
  },
};

/**
 * Observes one element, so a preview can run only while it is worth running.
 */
function useOnScreen(ref: React.RefObject<HTMLElement | null>) {
  const [onScreen, setOnScreen] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      /* A little early, so a card is already moving by the time it arrives
         rather than starting under the reader's eyes. */
      { rootMargin: "120px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return onScreen;
}

/**
 * Plays the cassette while its card is on screen, silently.
 *
 * Reaching into the DOM for the `audio` element rather than adding a prop: the
 * component's job is to play what someone asked it to play, and "play while a
 * card two levels up is visible" is the card's idea. It stays here.
 *
 * Muted, always. A page that makes noise on its own is a page people close,
 * and muted is also the only playback browsers allow without a click. Nothing
 * is fetched until the card comes into view, so a visit that stops short of
 * this section costs nothing.
 */
function useVisiblePlayback(
  ref: React.RefObject<HTMLElement | null>,
  playing: boolean,
) {
  React.useEffect(() => {
    const audio = ref.current?.querySelector("audio");
    if (!audio) return;

    if (
      !playing ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      audio.pause();
      return;
    }

    audio.muted = true;
    /* Rejected while the file is still arriving, which is not an error worth
       reporting for a decoration. */
    void audio.play().catch(() => {});
  }, [ref, playing]);
}

function CraftCard({
  craft,
  locale,
  language,
}: {
  craft: Craft;
  locale: string;
  language: Language;
}) {
  const preview = PREVIEWS[craft.slug];
  const ref = React.useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);
  useVisiblePlayback(ref, onScreen);

  return (
    <li className={`flex${preview?.wide ? " sm:col-span-2" : ""}`}>
      <Link
        href={`/${locale}/crafts/${craft.slug}`}
        /* No scale on hover: the card holds still and the component inside it
           moves instead, which is the thing worth looking at. */
        className="group flex w-full flex-col overflow-hidden rounded-xl bg-preview-bg px-3.5 pt-3.5 pb-3.5 shadow-custom transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-strong)] hover:shadow-card-lift active:scale-[0.985] motion-reduce:active:scale-100"
      >
        {/*
          `inert` rather than `aria-hidden`: the preview can be a whole player
          with its own buttons, and hiding it from a screen reader while
          leaving those buttons in the tab order is worse than not hiding it.
        */}
        {/*
          No surface of its own. The component already brings one, and a tinted
          box behind it stacked three greys where the eye wanted one: the card,
          then this, then whatever the component paints.
        */}
        <div
          inert
          className={`relative w-full overflow-hidden rounded-lg ${preview?.height ?? "h-40"}`}
        >
          <div
            ref={ref}
            className={`absolute inset-0 transition-transform duration-500 ease-[var(--ease-out-strong)] ${preview?.motion ?? ""}`}
          >
            {preview?.render(onScreen)}
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
        <p className="mt-1 text-sm leading-5 text-gray-1100">
          {craft.description[language]}
        </p>
      </Link>
    </li>
  );
}

export function CraftList({
  locale,
  language,
}: {
  locale: string;
  language: Language;
}) {
  return (
    <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
      {crafts.map((craft) => (
        <CraftCard
          key={craft.slug}
          craft={craft}
          locale={locale}
          language={language}
        />
      ))}
    </ul>
  );
}

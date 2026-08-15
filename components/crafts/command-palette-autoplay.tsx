"use client";

import * as React from "react";
import {
  CommandPalette,
  type Command,
} from "@/components/crafts/command-palette";
import { buildCommands } from "@/components/crafts/command-palette-demo";

/**
 * The palette, using itself.
 *
 * It drives the real component the way a person would: by typing into its
 * input and pressing keys. No prop was added to make this possible, and the
 * palette has no idea it is being puppeted, which is the only version of this
 * worth putting on a card. A scripted replica would be a drawing of a
 * component, and drawings go stale.
 */

type Step =
  /** Typed a character at a time, like a person. */
  | { text: string; after: number }
  | { key: string; meta?: boolean; after: number }
  /** Back to an empty palette, to run the whole thing again. */
  | { reset: true; after: number };

const SCRIPT: Step[] = [
  { text: "assi", after: 620 },
  { key: "Enter", after: 560 },
  { text: "june", after: 560 },
  { key: "Enter", after: 520 },
  { text: "urg", after: 560 },
  { key: "Enter", after: 900 },
  { text: "due", after: 560 },
  { key: "Enter", after: 520 },
  { key: "Enter", after: 1100 },
  { key: "Enter", meta: true, after: 2400 },
  { reset: true, after: 700 },
];

const TYPING_MS = 58;

/**
 * React listens for input at the root, not on the element, and it reads the
 * value off its own tracker rather than off the DOM. Assigning `input.value`
 * updates the tracker too, so React decides nothing changed. Going through the
 * prototype's setter is what leaves the tracker stale and makes the event
 * land.
 */
function setValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function press(input: HTMLInputElement, key: string, meta = false) {
  input.dispatchEvent(
    new KeyboardEvent("keydown", {
      key,
      bubbles: true,
      metaKey: meta,
      cancelable: true,
    }),
  );
}

export function CommandPaletteAutoplay() {
  const [commands, setCommands] = React.useState<Command[] | null>(null);
  /* Bumped to remount the palette, which is how the script starts over. */
  const [run, setRun] = React.useState(0);
  const hostRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setCommands(buildCommands()), []);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host || !commands) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let alive = true;
    let timer = 0;
    /* Nothing runs while the card is off screen. The home page is long and
       this is at the bottom of it. */
    let onScreen = true;

    const seen = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    seen.observe(host);

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });

    /* Parks the script rather than dropping it: coming back on screen picks up
       where it left off instead of restarting mid-command. */
    const untilVisible = async () => {
      while (alive && !onScreen) await wait(400);
    };

    const play = async () => {
      for (const step of SCRIPT) {
        await untilVisible();
        if (!alive) return;

        const input = host.querySelector("input");
        if (!input) return;

        if ("reset" in step) {
          setRun((n) => n + 1);
        } else if ("text" in step) {
          for (let i = 1; i <= step.text.length; i += 1) {
            setValue(input, step.text.slice(0, i));
            await wait(TYPING_MS);
            if (!alive) return;
          }
        } else {
          press(input, step.key, step.meta);
        }

        await wait(step.after);
        if (!alive) return;
      }

      /* Tail-recursive by intent, but through a timer, so the stack does not
         grow for as long as the page is open. */
      if (alive) timer = window.setTimeout(play, 0);
    };

    void play();

    return () => {
      alive = false;
      clearTimeout(timer);
      seen.disconnect();
    };
  }, [commands]);

  return (
    <div ref={hostRef} className="grid w-full place-items-center">
      {commands ? (
        <CommandPalette key={run} commands={commands} />
      ) : (
        /* Holds the space while the relative dates are computed. */
        <div className="h-[19.5rem] w-full max-w-[24rem]" />
      )}
    </div>
  );
}

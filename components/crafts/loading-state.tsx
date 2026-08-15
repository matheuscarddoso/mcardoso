"use client";

import * as React from "react";

/**
 * A loader for work that takes long enough to worry about.
 *
 * Three parts, and each answers a different question. The grid says something
 * is running. The shimmer on the label says it is still running, which a
 * static word cannot. The elapsed time says how long, which is the only one of
 * the three that tells you whether to keep waiting.
 *
 * Variants:
 *   drive  square cells, a chevron wavefront driving right
 *   dots   the same wavefront, round cells
 *   orbit  a single lit cell lapping the perimeter
 */

export type LoadingVariant = "drive" | "dots" | "orbit";

/**
 * A chevron pointing right: cells light in order of column plus distance from
 * the middle row, so the front arrives as a "＞" rather than a flat bar.
 */
const CHEVRON = Array.from({ length: 9 }, (_, index) => {
  const row = Math.floor(index / 3);
  const column = index % 3;
  return (column + Math.abs(row - 1)) * 90;
});

/** Clockwise from the top-left. The centre cell is never lit. */
const ORBIT_PATH = [0, 1, 2, 5, 8, 7, 6, 3];
const ORBIT = Array.from({ length: 9 }, (_, index) => {
  const step = ORBIT_PATH.indexOf(index);
  return step === -1 ? null : step * 110;
});

const PATTERNS: Record<
  LoadingVariant,
  { delays: (number | null)[]; duration: number; round: boolean }
> = {
  drive: { delays: CHEVRON, duration: 650, round: false },
  dots: { delays: CHEVRON, duration: 650, round: true },
  orbit: { delays: ORBIT, duration: 950, round: false },
};

/**
 * Local rather than imported, so this file can be lifted into another project
 * whole. It is eight lines; a dependency for it would not be.
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Elapsed time, read off the clock rather than counted.
 *
 * A counter incremented every hundred milliseconds drifts, because the
 * interval is a floor and not a promise: a busy tab misses ticks and the
 * number quietly falls behind the wait it is describing. Subtracting a
 * timestamp cannot drift, however late the tick arrives.
 *
 * Stopped, it reads zero and holds no interval. Starting again starts from
 * zero, which is the truth: this counts one wait, not the sum of every wait
 * the component has been mounted through.
 */
function useElapsed(running: boolean) {
  const startedAt = React.useRef<number | null>(null);
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    if (!running) {
      startedAt.current = null;
      setSeconds(0);
      return;
    }

    /* Set here, not in render: the server has no clock the client agrees
       with, and both have to produce "0.0s" for the first paint. */
    startedAt.current = performance.now();

    const tick = setInterval(() => {
      setSeconds((performance.now() - (startedAt.current ?? 0)) / 1000);
    }, 100);

    return () => clearInterval(tick);
  }, [running]);

  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  return `${Math.floor(seconds / 60)}m ${(seconds % 60).toFixed(1)}s`;
}

export function LoadingState({
  label = "Churning",
  variant = "drive",
  running = true,
}: {
  label?: string;
  variant?: LoadingVariant;
  /**
   * Whether work is actually in flight.
   *
   * Stopped, the grid holds its dim state and the clock neither runs nor
   * shows a number it did not measure. For a loader kept mounted so the
   * layout does not jump around it, that is the difference between resting
   * and lying about a wait nobody is waiting.
   */
  running?: boolean;
}) {
  const elapsed = useElapsed(running);
  const reduced = usePrefersReducedMotion();
  const { delays, duration, round } = PATTERNS[variant] ?? PATTERNS.drive;
  const still = reduced || !running;

  return (
    /*
     * `role="status"`: this announces itself once when it appears and then
     * stays quiet. A live region that re-read the elapsed time ten times a
     * second would make the page unusable with a screen reader on.
     */
    <div role="status" className="flex w-fit items-center gap-2.5">
      <span aria-hidden className="grid grid-cols-[repeat(3,4px)] gap-[1.5px]">
        {delays.map((delay, index) => (
          <span
            key={index}
            className={`size-[4px] bg-gray-1200 ${round ? "rounded-full" : "rounded-[1px]"}`}
            style={{
              opacity: delay === null ? 0.07 : 0.15,
              animation:
                delay === null || still
                  ? undefined
                  : `craft-pixel-on ${duration}ms ease-in-out ${delay}ms infinite`,
            }}
          />
        ))}
      </span>

      {/* Held still, the label gets flat ink rather than a frozen gradient: a
          shimmer stopped mid-sweep is a word that fades out at both ends for
          no reason. */}
      {still ? (
        <span className="text-[13px] font-medium text-gray-1200">{label}</span>
      ) : (
        <span
          className="bg-clip-text text-[13px] font-medium text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--color-gray-1000) 35%, var(--color-gray-1200) 50%, var(--color-gray-1000) 65%)",
            backgroundSize: "200% 100%",
            animation: "craft-shimmer-text 1.4s linear infinite",
          }}
        >
          {label}
        </span>
      )}

      {/* Tabular figures, or the whole line jitters sideways ten times a
          second as the digits change width. */}
      <span className="font-mono text-[12px] text-gray-1000 tabular-nums">
        {elapsed}
      </span>
    </div>
  );
}

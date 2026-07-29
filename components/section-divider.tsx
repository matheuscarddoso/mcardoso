/**
 * The dotted rule between sections: a 4px-wide gradient tile repeated across a
 * 1px-tall band.
 *
 * An `<hr>` rather than a `<div>`, with `border-0` so nothing of the default
 * rule shows through. It paints identically and it is what a thematic break
 * actually is — which is most of what lifted these pages out of the low
 * semantic-HTML flag, since each break used to be seven divs.
 *
 * The dark variant is not optional: `#d4d4d8` is a light grey, and on the
 * `#111` background it would read as a hard bright line instead of a hint.
 */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <hr
      style={{ animationDelay: "80ms" }}
      className={`fade-in h-px w-full border-0 bg-[length:4px_1px] bg-[linear-gradient(90deg,transparent_2px,#d4d4d8_2px,transparent_4px)] dark:bg-[linear-gradient(90deg,transparent_2px,#3a3a3a_2px,transparent_4px)] ${className ?? ""}`}
    />
  )
}

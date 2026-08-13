/**
 * The rubber duck beside the clock in the footer.
 *
 * Drawn for this site: 12x12, a 140-byte PNG, one frame. The script that
 * writes it lives at `public/duck/duck.source.py`, committed alongside,
 * because pixel art is easier to change as code than as a picture.
 *
 * No JavaScript and no animation. It is a bath toy.
 */
export function PixelDuck() {
  return (
    <span
      aria-hidden
      /*
       * `pixel-duck` carries the sprite; see `globals.css` for why the scale
       * has to be an integer.
       */
      className="pixel-duck shrink-0"
    />
  )
}

/**
 * The cat that sits beside the clock in the footer, washing itself.
 *
 * Sprite sheet from oneko.js by adryd (MIT, © 2022), vendored under
 * `public/oneko` with its licence. The original script has the cat chase the
 * pointer around the page; this uses three frames of the same sheet and keeps
 * it in one place, which is what a footer wants.
 *
 * No JavaScript. The whole animation is `background-position` stepped by CSS,
 * so it costs one 3KB image and nothing on the main thread.
 */
export function PixelCat() {
  return (
    <span
      aria-hidden
      /*
       * `pixel-cat` carries the sprite and the loop; see `globals.css` for the
       * frame arithmetic and for why `image-rendering` matters here.
       */
      className="pixel-cat shrink-0"
    />
  )
}

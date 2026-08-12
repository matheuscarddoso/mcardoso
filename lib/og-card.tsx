import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { articles } from "./articles"
import { LOCALES, localeToLanguage, type Locale } from "./locale"
import { OG_IMAGE, PERSON } from "./site"

/**
 * The share card, generated per article per locale.
 *
 * It keeps what the static `/og.png` established: white ground, a 100px
 * gutter, one left-aligned block sitting on the floor of the card with the
 * space above it left empty. What it adds is the article's title as the
 * subject, the name demoted to a label beneath it, and the same portrait the
 * home page uses in the top corner — a card that shouts the author and
 * whispers the piece is the wrong way round for something people meet in a
 * timeline.
 */

/** Matches the static card, which is also what every scraper expects. */
const { width: WIDTH, height: HEIGHT } = OG_IMAGE

/**
 * The site's own light-mode ink, not a value sampled off the old PNG: that
 * reads as #23221e only because the average includes the antialiased edges.
 * The darkest pixels are #000, which is exactly `--color-heading`.
 *
 * The ground stays paper white and deliberately does not track `--background`,
 * which is now #fcfcfc. A share card is composited onto Twitter's or
 * LinkedIn's own surface, never onto this page, and it has to match the static
 * `/og.png` that every other share of this site already points at.
 */
const INK = "#000"
const GROUND = "#fff"
/** `--color-gray-1000`, the same grey the article bylines use. */
const LABEL = "#838383"

/** Measured off the static card: its name starts at x=100. */
const GUTTER = 100
/** Top and bottom. Leaves the label in the band the old card's name occupied. */
const EDGE = 96

/** Small enough to read as a mark rather than a portrait. */
const AVATAR = 96

/**
 * Two things Satori does not do, both measured rather than assumed.
 *
 * It has no `text-wrap: balance` and cannot measure before it lays out, so the
 * size is picked from the title's length. The steps are tuned so every
 * registered title lands on two or three lines inside the 1000px column: at
 * 92px a Geist SemiBold line holds around 21 characters, and the ratio holds
 * roughly linearly down the scale.
 *
 * It also shapes word gaps slightly loose. Chrome sets the five gaps in "5
 * repositórios do GitHub que te" at 21/18/19/19/19px, which is exactly the
 * font's side bearings plus its 14.16px space; Satori sets 22/29/20/23/19. Not
 * kerning (Geist's pairs here are under 2px), not the flex default, and not
 * configurable — it is how Satori shapes runs. At the width a card is actually
 * seen, around 500px in a timeline, the worst gap is 4px off. Left alone
 * deliberately: the only way out is rendering these in a real browser, which
 * is not worth a build step.
 */
function titleSize(title: string): number {
  const n = title.length
  if (n <= 22) return 92
  if (n <= 34) return 80
  if (n <= 48) return 70
  return 60
}

/**
 * Read once per process rather than per card. The route is `force-static`, so
 * in practice this runs during a build and never in production — but a warm
 * cache costs one module-level promise and removes any chance of this becoming
 * per-request file I/O if the route ever stops being static.
 *
 * The portrait is inlined as a data URI because Satori resolves `src` itself
 * and would otherwise have to fetch it over the network, which during a build
 * means fetching from a server that is not listening yet.
 */
let assetCache: Promise<{ semibold: Buffer; medium: Buffer; portrait: string }> | null = null

function assets() {
  assetCache ??= (async () => {
    const file = (path: string) => readFile(join(process.cwd(), path))
    const [semibold, medium, photo] = await Promise.all([
      file("assets/fonts/Geist-SemiBold.ttf"),
      file("assets/fonts/Geist-Medium.ttf"),
      file("public" + PERSON.image),
    ])
    return {
      semibold,
      medium,
      portrait: `data:image/png;base64,${photo.toString("base64")}`,
    }
  })()
  return assetCache
}

/** One entry per article per locale, for the route's `generateStaticParams`. */
export function ogCardParams(): { locale: Locale; slug: string }[] {
  return LOCALES.flatMap((locale) => articles.map(({ slug }) => ({ locale, slug })))
}

export async function ogCard(title: string): Promise<ImageResponse> {
  const { semibold, medium, portrait } = await assets()

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          // Portrait to the ceiling, words to the floor, nothing in between.
          justifyContent: "space-between",
          backgroundColor: GROUND,
          padding: `${EDGE}px ${GUTTER}px`,
        }}
      >
        {/* Satori renders this JSX to a raster itself — it never reaches the
            DOM, so there is no LCP to slow and no `next/image` to reach for. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={portrait}
          width={AVATAR}
          height={AVATAR}
          alt=""
          style={{
            borderRadius: "50%",
            // The same hairline the site puts on every rounded image, so the
            // photo has an edge where it meets white instead of dissolving.
            border: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Geist SemiBold",
              fontSize: titleSize(title),
              // Tight, the way the article's own headings are set.
              lineHeight: 1.08,
              color: INK,
              // Satori needs the wrap width stated; the column is the card
              // less both gutters.
              maxWidth: WIDTH - GUTTER * 2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: "Geist Medium",
              fontSize: 30,
              color: LABEL,
              marginTop: 34,
            }}
          >
            {PERSON.name}
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Geist SemiBold", data: semibold, style: "normal", weight: 600 },
        { name: "Geist Medium", data: medium, style: "normal", weight: 500 },
      ],
    }
  )
}

/** The title the card should print for one article in one locale. */
export function ogCardTitle(slug: string, locale: Locale): string | null {
  const article = articles.find((a) => a.slug === slug)
  return article ? article.title[localeToLanguage(locale)] : null
}

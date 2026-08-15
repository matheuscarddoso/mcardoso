import type { Language } from "./locale"

type Localized = Record<Language, string>

export type CraftFile = {
  /** Printed on the tab. */
  name: string
  /**
   * Repository-relative path, read at build time. Reading the file rather than
   * repeating it in a string is the only way the listing cannot drift from the
   * component that actually runs on the page above it.
   */
  path?: string
  /** For a snippet with no file behind it, such as the usage example. */
  code?: string
  lang: string
}

export type Craft = {
  slug: string
  /** ISO date it went up. The sitemap reports it; nothing else reads it. */
  publishedAt: string
  /**
   * Not localized. It is the component's name, the thing you would type to
   * import it, and translating that would make the page disagree with the code
   * printed on it.
   */
  title: string
  description: Localized
  /** Search-result copy; the on-page description is written to sit under a heading. */
  seoDescription: Localized
  files: CraftFile[]
  /** Printed under the demo, when the demo leans on someone else's work. */
  credit?: Localized
}

const CASSETTE_USAGE = `import { CassettePlayer } from "@/components/crafts/cassette-player"

export function AudioPlayer() {
  return (
    <CassettePlayer
      audioSrc="/audio/one-small-step.mp3"
      trackTitle="One Small Step"
      archiveLabel="Archive 11"
      catalogueNumber="200769"
    />
  )
}
`

/** Newest first: the home page prints them in this order. */
export const crafts: Craft[] = [
  {
    slug: "cassette-audio-player",
    publishedAt: "2026-08-15",
    title: "Cassette Audio Player",
    description: {
      PT: "Um player de áudio construído dentro de uma fita cassete.",
      EN: "An audio player built into a compact cassette.",
      ES: "Un reproductor de audio construido dentro de un casete.",
    },
    seoDescription: {
      PT: "Player de áudio em React com carretéis que giram junto com a fita, rebobinar de verdade e a bobina trocando de diâmetro conforme toca.",
      EN: "A React audio player with reels that turn with the tape, a rewind that winds back, and spools that trade diameter as it plays.",
      ES: "Reproductor de audio en React con carretes que giran con la cinta, rebobinado real y bobinas que cambian de diámetro al sonar.",
    },
    files: [
      {
        name: "CassettePlayer.tsx",
        path: "components/crafts/cassette-player.tsx",
        lang: "tsx",
      },
      { name: "Usage.tsx", code: CASSETTE_USAGE, lang: "tsx" },
    ],
    credit: {
      PT: "Áudio da NASA, domínio público: Apollo 11, 20 de julho de 1969.",
      EN: "Audio courtesy of NASA, public domain: Apollo 11, 20 July 1969.",
      ES: "Audio de la NASA, dominio público: Apolo 11, 20 de julio de 1969.",
    },
  },
]

export const craftBySlug = new Map(crafts.map((craft) => [craft.slug, craft]))

export function getCraft(slug: string): Craft {
  const craft = craftBySlug.get(slug)
  if (!craft) throw new Error(`No craft named "${slug}"`)
  return craft
}

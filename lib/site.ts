import type { Metadata } from "next"
import { LOCALES, type Language, type Locale } from "./locale"

/**
 * Absolute origin. Canonicals, hreflang, the sitemap, the Open Graph image URLs
 * and every JSON-LD `@id` hang off this, so it is the single value that can
 * invalidate all of them at once — which is exactly what happened when it was
 * set to a domain that had never been registered.
 *
 * `www`, not the apex: ocardoso.com answers 308 to www.ocardoso.com, and a
 * canonical or hreflang pointing at a redirect is itself an SEO defect.
 *
 * Deliberately NOT derived from VERCEL_PROJECT_PRODUCTION_URL: that resolves to
 * whichever domain Vercel considers primary, which may be the apex, and would
 * quietly reintroduce the redirect. Override with NEXT_PUBLIC_SITE_URL.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ocardoso.com"
).replace(/\/+$/, "")

/** BCP-47 tags. The route segment is lowercase; `hreflang` is not. */
export const HREFLANG: Record<Locale, string> = {
  en: "en",
  "pt-br": "pt-BR",
  es: "es",
}

export const DEFAULT_LOCALE: Locale = "en"

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/** Falls back rather than throwing — an unknown segment is a 404 anyway. */
export function toLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : DEFAULT_LOCALE
}

export function absolute(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

/**
 * Canonical plus the full hreflang cluster for one page. Every locale has to
 * advertise every other locale *and* itself, or Google drops the cluster and
 * falls back to treating the three as duplicates of each other.
 *
 * `path` is the locale-less tail: "" for the home page, "/work/ai-bubble" for
 * an article.
 */
export function alternatesFor(locale: Locale, path = "") {
  const languages: Record<string, string> = {}
  for (const other of LOCALES) {
    languages[HREFLANG[other]] = absolute(`/${other}${path}`)
  }
  languages["x-default"] = absolute(`/${DEFAULT_LOCALE}${path}`)

  return { canonical: absolute(`/${locale}${path}`), languages }
}

/** Open Graph wants the underscored form, not the hreflang one. */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  "pt-br": "pt_BR",
  es: "es_ES",
}

export function ogLocaleAlternates(locale: Locale): string[] {
  return LOCALES.filter((other) => other !== locale).map((other) => OG_LOCALE[other])
}

/**
 * Public profiles, in the order they render. `null` means "no account yet" —
 * the header icons and the JSON-LD `sameAs` both read from here, so filling
 * one in lights it up in both places at once.
 */
export const SOCIAL = {
  github: "https://github.com/matheuscarddoso",
  x: "https://x.com/mattcrdoso",
  stackoverflow: "https://stackoverflow.com/users/18957537/matheus-cardoso",
  linkedin: "https://www.linkedin.com/in/mcarddoso/",
  instagram: "https://www.instagram.com/ocarddoso/",
  youtube: "https://www.youtube.com/@mcardosodev",
  facebook: null,
} satisfies Record<string, string | null>

export type SocialKey = keyof typeof SOCIAL

/**
 * Split across the two rows on purpose. Six brand marks plus the email button
 * and both toggles measure 332px of ink, against 288px on a 320px phone — the
 * header row would overflow. So the header keeps the working identity, and the
 * footer carries the rest. No profile appears twice, and every one is still a
 * crawlable link on the page.
 */
export const HEADER_SOCIAL: SocialKey[] = ["github", "x", "stackoverflow"]
export const FOOTER_SOCIAL: SocialKey[] = ["linkedin", "instagram", "youtube", "facebook"]

/** Only the profiles that exist — an empty `sameAs` entry is worse than none. */
export const SAME_AS: string[] = Object.values(SOCIAL).filter(
  (url): url is string => url !== null
)

export const PERSON = {
  name: "Matheus Cardoso",
  givenName: "Matheus",
  familyName: "Cardoso",
  jobTitle: {
    PT: "Engenheiro de Software",
    EN: "Software Engineer",
    ES: "Ingeniero de Software",
  } satisfies Record<Language, string>,
  image: "/profile.png",
  worksFor: [
    { name: "4Selet", url: "https://4selet.com.br" },
    { name: "Zero7", url: "https://zero7.com.br/home" },
  ],
} as const

export const SITE_NAME = "Matheus Cardoso"

/**
 * One share card for the whole site, served from /public at a stable path.
 *
 * Not the `opengraph-image` file convention: that mints a hashed URL per
 * segment, which the JSON-LD `image` field can't reference without duplicating
 * the hash. A fixed path means the card, the Open Graph tags and the
 * structured data all point at the same bytes.
 */
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Matheus Cardoso",
} as const

/**
 * The generated card for one article. Same reasoning as the fixed `/og.png`
 * path above: a URL we spell ourselves is one the Open Graph tags, the Twitter
 * tags and the JSON-LD `image` can all name, and `app/og/[locale]/[slug]`
 * prerenders every one of them at build time.
 */
export function ogCardPath(locale: Locale, slug: string): string {
  return `/og/${locale}/${slug}`
}

/** Defaults to the site-wide card; articles pass their generated one. */
function ogImages(url: string = OG_IMAGE.url, alt: string = OG_IMAGE.alt) {
  return [
    {
      url: absolute(url),
      width: OG_IMAGE.width,
      height: OG_IMAGE.height,
      alt,
    },
  ]
}

/**
 * Home page copy. Titles land in the 50-60 character window search results
 * actually render before truncating; descriptions in the 140-160 one.
 */
export const HOME_SEO = {
  PT: {
    title: "Matheus Cardoso · Engenheiro de Software e Interfaces",
    description:
      "Engenheiro de software na 4Selet e na Zero7, e contribuidor open-source na Abacate Pay. Escrevo sobre construção de interfaces, cor e IA.",
  },
  EN: {
    title: "Matheus Cardoso · Software Engineer & Interface Design",
    description:
      "Software engineer at 4Selet and Zero7, and an open-source contributor at Abacate Pay. I write about interface craft, colour and AI.",
  },
  ES: {
    title: "Matheus Cardoso · Ingeniero de Software e Interfaces",
    description:
      "Ingeniero de software en 4Selet y Zero7, y colaborador open-source en Abacate Pay. Escribo sobre construcción de interfaces, color e IA.",
  },
} satisfies Record<Language, { title: string; description: string }>

type PageMeta = {
  locale: Locale
  /** Locale-less tail, e.g. "/work/ai-bubble". */
  path?: string
  title: string
  description: string
  /** Set on the home page, whose title already ends in the site name. */
  absoluteTitle?: boolean
}

/**
 * Next merges `openGraph` and `twitter` by replacement, not deep merge — a page
 * that sets a title there drops the layout's `siteName`, `locale` and card
 * type with it. So every page builds the whole block, from here, once.
 */
export function pageMetadata({
  locale,
  path = "",
  title,
  description,
  absoluteTitle = false,
}: PageMeta): Metadata {
  const alternates = alternatesFor(locale, path)

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: ogLocaleAlternates(locale),
      url: alternates.canonical,
      title,
      description,
      images: ogImages(),
    },
    twitter: {
      card: "summary_large_image",
      creator: "@mattcrdoso",
      title,
      description,
      images: ogImages(),
    },
  }
}

/**
 * `slug` is what makes the card specific: it names the prerendered image that
 * prints this article's own title, rather than the site-wide `/og.png`. The
 * `twitter` block comes from `pageMetadata`, so it has to be rebuilt here too
 * — Next replaces rather than merges it, which is the same trap the note above
 * `pageMetadata` describes.
 */
export function articleMetadata(
  meta: PageMeta & { slug: string; publishedTime: string; modifiedTime: string }
): Metadata {
  const base = pageMetadata(meta)
  const alternates = alternatesFor(meta.locale, meta.path)
  const card = ogImages(ogCardPath(meta.locale, meta.slug), meta.title)

  return {
    ...base,
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: OG_LOCALE[meta.locale],
      alternateLocale: ogLocaleAlternates(meta.locale),
      url: alternates.canonical,
      title: meta.title,
      description: meta.description,
      images: card,
      publishedTime: meta.publishedTime,
      modifiedTime: meta.modifiedTime,
      authors: [absolute(`/${meta.locale}`)],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@mattcrdoso",
      title: meta.title,
      description: meta.description,
      images: card,
    },
  }
}

export const PLAYLISTS_SEO = {
  PT: {
    title: "Playlists mensais: o que eu andei ouvindo",
    description:
      "Todo mês eu monto uma playlist com as músicas que estiveram em repeat. O arquivo completo, mês a mês, com link direto pro Spotify.",
  },
  EN: {
    title: "Monthly Playlists: What I Listened To",
    description:
      "Every month I put together a playlist of the songs that were on repeat. The full archive, month by month, linked straight to Spotify.",
  },
  ES: {
    title: "Playlists mensuales: lo que escuché",
    description:
      "Cada mes armo una playlist con las canciones que estuvieron en repeat. El archivo completo, mes a mes, con enlace directo a Spotify.",
  },
} satisfies Record<Language, { title: string; description: string }>

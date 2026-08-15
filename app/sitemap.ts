import type { MetadataRoute } from "next"
import { articles, lastRevised } from "@/lib/articles"
import { crafts } from "@/lib/crafts"
import { LOCALES } from "@/lib/locale"
import { DEFAULT_LOCALE, HREFLANG, absolute } from "@/lib/site"

/** Locale-less routes, with the freshness signal each one deserves. */
type Route = {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority: number
  lastModified: string
}

const NEWEST_ARTICLE = articles.reduce(
  (latest, article) => (lastRevised(article) > latest ? lastRevised(article) : latest),
  lastRevised(articles[0])
)

const ROUTES: Route[] = [
  { path: "", changeFrequency: "weekly", priority: 1, lastModified: NEWEST_ARTICLE },
  {
    path: "/monthly-playlists",
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: NEWEST_ARTICLE,
  },
  ...articles.map<Route>((article) => ({
    path: `/work/${article.slug}`,
    changeFrequency: "yearly",
    priority: 0.8,
    lastModified: lastRevised(article),
  })),
  /* A craft is a live component rather than a piece of writing, so it can
     change without the prose around it changing. Monthly, and a shade below
     the articles, which are what someone searching is usually after. */
  ...crafts.map<Route>((craft) => ({
    path: `/crafts/${craft.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: craft.publishedAt,
  })),
]

/**
 * One entry per locale per route, each carrying the full `alternates.languages`
 * cluster. That is the sitemap-side half of hreflang — without it Google has to
 * discover the translations by crawling, and often decides they are duplicates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((route) => {
    const languages: Record<string, string> = {}
    for (const locale of LOCALES) {
      languages[HREFLANG[locale]] = absolute(`/${locale}${route.path}`)
    }
    languages["x-default"] = absolute(`/${DEFAULT_LOCALE}${route.path}`)

    return LOCALES.map((locale) => ({
      url: absolute(`/${locale}${route.path}`),
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages },
    }))
  })
}

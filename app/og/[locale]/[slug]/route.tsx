import { ogCard, ogCardParams, ogCardTitle } from "@/lib/og-card"
import { isLocale } from "@/lib/site"

/**
 * The generated share card for one article in one locale.
 *
 * A route rather than the `opengraph-image` file convention, for two reasons.
 * The convention injects `og:image` itself, and `lib/site.ts` deliberately
 * builds the whole `openGraph`/`twitter` block in one place — Next merges those
 * by replacement, so having two sources for one tag is how the card silently
 * went missing before. And the convention would need one file per article
 * folder; this is one file for all of them.
 *
 * `force-static` plus `generateStaticParams` prerenders all 21 cards at build
 * time, so they cost a scraper exactly what the old static PNG cost.
 */
export const dynamic = "force-static"

export function generateStaticParams() {
  return ogCardParams()
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; slug: string }> }
) {
  const { locale, slug } = await params

  // Unregistered slug or locale means someone hand-typed the URL. The article
  // pages already 404 for these; a card has nothing to draw either.
  if (!isLocale(locale)) return new Response("Not found", { status: 404 })

  const title = ogCardTitle(slug, locale)
  if (!title) return new Response("Not found", { status: 404 })

  return ogCard(title)
}

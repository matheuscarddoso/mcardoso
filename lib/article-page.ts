import type { Metadata } from "next"
import { getArticle, lastRevised } from "./articles"
import { localeToLanguage } from "./locale"
import { articleMetadata, toLocale } from "./site"

/** Every article route has the same shape; only the slug differs. */
export type ArticlePageProps = { params: Promise<{ locale: string }> }

export async function articleMeta(
  slug: string,
  params: { locale: string }
): Promise<Metadata> {
  const locale = toLocale(params.locale)
  const language = localeToLanguage(locale)
  const article = getArticle(slug)

  return articleMetadata({
    locale,
    slug,
    path: `/work/${slug}`,
    title: article.seoTitle[language],
    description: article.seoDescription[language],
    publishedTime: article.publishedAt,
    modifiedTime: lastRevised(article),
  })
}

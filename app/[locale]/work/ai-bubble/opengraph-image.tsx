import { getArticle } from "@/lib/articles"
import { localeToLanguage } from "@/lib/locale"
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og"
import { PERSON, toLocale } from "@/lib/site"

const article = getArticle("ai-bubble")

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = article.title.EN

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const language = localeToLanguage(toLocale((await params).locale))

  return ogImage({
    eyebrow: PERSON.name,
    title: article.title[language],
    footer: article.year,
  })
}

import { localeToLanguage } from "@/lib/locale"
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og"
import { PERSON, toLocale } from "@/lib/site"

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = "Matheus Cardoso — Software Engineer"

/** Inherited by every route under the locale that doesn't ship its own card. */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const language = localeToLanguage(toLocale((await params).locale))

  return ogImage({
    eyebrow: PERSON.jobTitle[language],
    title: PERSON.name,
    footer: "@mattcrdoso",
  })
}

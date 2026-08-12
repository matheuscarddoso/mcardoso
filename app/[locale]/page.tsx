import type { Metadata } from "next"
import { JsonLd } from "@/components/json-ld"
import { getContributionYear, getGithubCard } from "@/lib/github"
import { localeToLanguage } from "@/lib/locale"
import { HOME_SEO, pageMetadata, toLocale } from "@/lib/site"
import { homeGraph } from "@/lib/structured-data"
import { HomeContent } from "./home-content"

/** Matches the GitHub fetches' own cache window. */
export const revalidate = 3600

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const seo = HOME_SEO[localeToLanguage(locale)]

  // `absoluteTitle`: the home title already ends in the name, so the layout's
  // "%s — Matheus Cardoso" template would print it twice.
  return pageMetadata({ locale, title: seo.title, description: seo.description, absoluteTitle: true })
}

export default async function Page({ params }: PageProps) {
  const locale = toLocale((await params).locale)
  // Two different accounts, so two calendars — in parallel, since neither
  // needs the other and both are cached on the same one-hour window.
  const [github, contributions] = await Promise.all([getGithubCard(), getContributionYear()])

  return (
    <>
      <JsonLd data={homeGraph(locale)} />
      <HomeContent github={github} contributions={contributions} />
    </>
  )
}

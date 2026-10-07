import type { Metadata } from "next"
import { JsonLd } from "@/components/json-ld"
import { localeToLanguage } from "@/lib/locale"
import { SKILLS_SEO, pageMetadata, toLocale } from "@/lib/site"
import { skillsGraph } from "@/lib/structured-data"
import { SkillsContent } from "./content"

const PATH = "/skills"

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const seo = SKILLS_SEO[localeToLanguage(locale)]

  return pageMetadata({ locale, path: PATH, title: seo.title, description: seo.description })
}

export default async function Page({ params }: PageProps) {
  const locale = toLocale((await params).locale)

  return (
    <>
      <JsonLd data={skillsGraph(locale)} />
      <SkillsContent />
    </>
  )
}

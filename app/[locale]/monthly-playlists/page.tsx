import type { Metadata } from "next"
import { JsonLd } from "@/components/json-ld"
import { localeToLanguage } from "@/lib/locale"
import { PLAYLISTS_SEO, pageMetadata, toLocale } from "@/lib/site"
import { playlistsGraph } from "@/lib/structured-data"
import { MonthlyPlaylistsContent } from "./content"

const PATH = "/monthly-playlists"

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const seo = PLAYLISTS_SEO[localeToLanguage(locale)]

  return pageMetadata({ locale, path: PATH, title: seo.title, description: seo.description })
}

export default async function Page({ params }: PageProps) {
  const locale = toLocale((await params).locale)

  return (
    <>
      <JsonLd data={playlistsGraph(locale)} />
      <MonthlyPlaylistsContent />
    </>
  )
}

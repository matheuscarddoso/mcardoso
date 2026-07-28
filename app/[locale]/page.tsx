import { getGithubCard } from "@/lib/github"
import { HomeContent } from "./home-content"

/** Matches the GitHub fetches' own cache window. */
export const revalidate = 3600

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt-br' }, { locale: 'es' }]
}

export default async function Page() {
  const github = await getGithubCard()

  return <HomeContent github={github} />
}

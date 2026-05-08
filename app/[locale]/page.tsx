import { HomeContent } from "./home-content"

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt-br' }, { locale: 'es' }]
}

export default function Page() {
  return <HomeContent />
}

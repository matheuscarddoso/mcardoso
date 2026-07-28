import { ArticleContent } from "./article-content"

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt-br' }, { locale: 'es' }]
}

export default function AiBubblePage() {
  return <ArticleContent />
}

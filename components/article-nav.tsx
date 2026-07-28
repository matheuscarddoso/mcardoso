import Link from "next/link"
import { articles } from "@/lib/articles"
import type { Language } from "@/lib/locale"

const HEADING = {
  PT: "Continue lendo",
  EN: "Keep reading",
  ES: "Sigue leyendo",
} as const

/**
 * Two sibling essays at the foot of every article.
 *
 * Before this, each piece had exactly one inbound internal link — the writing
 * list on the home page. A page reachable by a single route reads as
 * peripheral to a crawler, and AI search in particular infers importance from
 * how densely a page is linked inside the site. This wires the five essays into
 * a ring, so each one gains two more.
 */
export function ArticleNav({
  slug,
  language,
  locale,
}: {
  slug: string
  language: Language
  locale: string
}) {
  const index = articles.findIndex((article) => article.slug === slug)
  if (index === -1) return null

  // A ring rather than prev/next, so the first and last pieces are as connected
  // as the middle ones and nothing ends up with a dead edge.
  const related = [
    articles[(index + 1) % articles.length],
    articles[(index + 2) % articles.length],
  ].filter((article) => article.slug !== slug)

  if (related.length === 0) return null

  return (
    <nav aria-labelledby="keep-reading" className="mt-16">
      <h2 id="keep-reading" className="mb-4 text-balance font-[550] article-heading">
        {HEADING[language]}
      </h2>
      <ul className="flex flex-col gap-3">
        {related.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/${locale}/work/${article.slug}`}
              className="group flex flex-col gap-0.5 transition-opacity duration-200 ease-out hover:opacity-100"
            >
              <span className="text-[15px] font-[450] text-gray-1200">
                {article.title[language]}
              </span>
              <span className="text-[15px] text-gray-1000">
                {article.description[language]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

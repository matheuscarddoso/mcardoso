import Link from "next/link"
import { articles, type Article } from "@/lib/articles"
import type { Language } from "@/lib/locale"

const LABELS = {
  PT: { nav: "Mais textos", previous: "Anterior", next: "Próximo" },
  EN: { nav: "More writing", previous: "Previous", next: "Next" },
  ES: { nav: "Más textos", previous: "Anterior", next: "Siguiente" },
} as const

function Side({
  article,
  label,
  language,
  locale,
  align,
}: {
  article: Article
  label: string
  language: Language
  locale: string
  align: "left" | "right"
}) {
  return (
    <Link
      href={`/${locale}/work/${article.slug}`}
      className={`group flex flex-col gap-1 ${align === "right" ? "items-end text-right" : "items-start"}`}
    >
      <span className="text-sm text-gray-1000">{label}</span>
      <span className="text-pretty text-base font-[450] text-gray-1200 transition-opacity duration-200 ease-out group-hover:opacity-70">
        {article.title[language]}
      </span>
    </Link>
  )
}

/**
 * Previous and next, chronologically: `articles` is newest-first, so the piece
 * published before this one sits *after* it in the array, and vice versa.
 *
 * The ends are asymmetric on purpose — the newest essay has no next and the
 * oldest has no previous. The two-column grid keeps whichever exists on its own
 * side rather than recentring it, so "previous" is always on the left.
 *
 * This is also what keeps the essays linked to each other. Before there was any
 * nav here, each one had exactly one inbound internal link — the list on the
 * home page — which reads as peripheral to a crawler, and AI search infers
 * importance from how densely a page is linked inside its own site.
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

  const previous = articles[index + 1]
  const next = articles[index - 1]
  if (!previous && !next) return null

  const t = LABELS[language]

  return (
    <nav aria-label={t.nav} className="mt-20 grid grid-cols-2 gap-6 border-t pt-8">
      {/* Empty cell rather than no cell: the grid columns are what hold each
          link to its own side when only one of the two exists. */}
      <div>
        {previous && (
          <Side
            article={previous}
            label={t.previous}
            language={language}
            locale={locale}
            align="left"
          />
        )}
      </div>
      <div className="flex justify-end">
        {next && (
          <Side
            article={next}
            label={t.next}
            language={language}
            locale={locale}
            align="right"
          />
        )}
      </div>
    </nav>
  )
}

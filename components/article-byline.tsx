import { getArticle, lastRevised } from "@/lib/articles";
import { READING_MINUTES } from "@/lib/reading-time";
import { PERSON } from "@/lib/site";
import type { Language } from "@/lib/locale";

/**
 * Month names held locally rather than via `Intl`, matching the contribution
 * graph: the article shell is a client component, and a formatter that
 * resolves differently on the server than in the browser would hydrate into a
 * mismatch.
 */
const MONTHS: Record<Language, readonly string[]> = {
  PT: [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ],
  EN: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  ES: [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ],
};

const REVISED_LABEL = {
  PT: "atualizado em",
  EN: "updated",
  ES: "actualizado el",
} as const;

/**
 * Written out per language rather than assembled from a number and a word: the
 * three do not agree on where the unit goes or whether it pluralises, and
 * "1 minutos" is the kind of thing string concatenation produces.
 */
const READING_LABEL: Record<Language, (minutes: number) => string> = {
  PT: (m) => `${m} min de leitura`,
  EN: (m) => `${m} min read`,
  ES: (m) => `${m} min de lectura`,
};

function formatDate(iso: string, language: Language): string {
  const [year, month, day] = iso.split("-").map(Number);
  const name = MONTHS[language][month - 1];
  return language === "EN"
    ? `${name} ${day}, ${year}`
    : `${day} de ${name} de ${year}`;
}

/**
 * The date and author the JSON-LD already claims. Google asks that a date in
 * structured data also be visible on the page — otherwise it discards the
 * declared one and guesses from the content, usually wrong.
 */
export function ArticleByline({
  slug,
  language,
}: {
  slug: string;
  language: Language;
}) {
  const article = getArticle(slug);
  const revised = lastRevised(article);
  const minutes = READING_MINUTES[slug]?.[language];

  return (
    <p className="mt-2 mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-1000">
      <span>{PERSON.name}</span>
      <span aria-hidden>·</span>
      <time dateTime={article.publishedAt}>
        {formatDate(article.publishedAt, language)}
      </time>
      {minutes ? (
        <>
          <span aria-hidden>·</span>
          {/* The unit is minutes, so the machine-readable form is a duration
              and not a clock reading. */}
          <span>
            <time dateTime={`PT${minutes}M`}>
              {READING_LABEL[language](minutes)}
            </time>
          </span>
        </>
      ) : null}
      {/* Only shown when the prose genuinely changed — see `revisedAt`. */}
      {revised !== article.publishedAt && (
        <>
          <span aria-hidden>·</span>
          <span>
            {REVISED_LABEL[language]}{" "}
            <time dateTime={revised}>{formatDate(revised, language)}</time>
          </span>
        </>
      )}
    </p>
  );
}

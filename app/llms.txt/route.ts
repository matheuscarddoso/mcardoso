import { articles } from "@/lib/articles"
import { HOME_SEO, PERSON, SITE_NAME, SOCIAL, absolute } from "@/lib/site"

/**
 * https://llmstxt.org — a plain-language map of the site for models that read
 * it directly instead of rendering the pages. Everything here is generated from
 * the same sources the pages use, so it can't drift out of date.
 *
 * English only, deliberately: the file is a single document at a fixed path,
 * and a model reading it wants one canonical description, not three. The
 * per-language URLs are still discoverable through the sitemap's hreflang.
 */
export const dynamic = "force-static"

function body(): string {
  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${HOME_SEO.EN.description}`,
    "",
    `${PERSON.name} is a ${PERSON.jobTitle.EN.toLowerCase()} based in Brazil, working at ` +
      PERSON.worksFor.map((o) => `${o.name} (${o.url})`).join(" and ") +
      `, and contributing to the open-source payments project Abacate Pay. This site is` +
      ` his personal notebook: essays on interface craft, colour science, AI and the` +
      ` WhatsApp platform, plus the projects he has shipped.`,
    "",
    `Every page is published in English, Brazilian Portuguese and Spanish at` +
      ` /en/, /pt-br/ and /es/ respectively. The URLs below are the English ones.`,
    "",
    "## Writing",
    "",
  ]

  for (const article of articles) {
    lines.push(
      `- [${article.title.EN}](${absolute(`/en/work/${article.slug}`)}): ` +
        `${article.seoDescription.EN} Published ${article.publishedAt}.`
    )
  }

  lines.push(
    "",
    "## Pages",
    "",
    `- [Home](${absolute("/en")}): who he is, what he's building, and the full writing index.`,
    `- [Monthly playlists](${absolute("/en/monthly-playlists")}): a playlist a month, linked to Spotify.`,
    "",
    "## Elsewhere",
    ""
  )

  const profiles: [string, string | null][] = [
    ["GitHub", SOCIAL.github],
    ["X", SOCIAL.x],
    ["LinkedIn", SOCIAL.linkedin],
    ["Stack Overflow", SOCIAL.stackoverflow],
    ["Instagram", SOCIAL.instagram],
    ["YouTube", SOCIAL.youtube],
  ]
  for (const [name, url] of profiles) {
    if (url) lines.push(`- [${name}](${url})`)
  }

  lines.push("")
  return lines.join("\n")
}

export function GET() {
  return new Response(body(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}

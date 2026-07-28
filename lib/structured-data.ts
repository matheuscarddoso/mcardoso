import { articles, lastRevised, type Article } from "./articles"
import { localeToLanguage, type Locale } from "./locale"
import {
  HOME_SEO,
  HREFLANG,
  OG_IMAGE,
  PERSON,
  PLAYLISTS_SEO,
  SAME_AS,
  SITE_NAME,
  SITE_URL,
  absolute,
} from "./site"

/**
 * One `@graph` per page, with stable `@id`s so the nodes cross-reference each
 * other instead of being repeated. Google resolves `{"@id": ...}` pointers
 * within a graph, which keeps the payload small and the entities single.
 */
const PERSON_ID = `${SITE_URL}/#person`
const WEBSITE_ID = `${SITE_URL}/#website`

type Node = Record<string, unknown>

function person(locale: Locale): Node {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: PERSON.name,
    givenName: PERSON.givenName,
    familyName: PERSON.familyName,
    url: absolute(`/${locale}`),
    image: absolute(PERSON.image),
    jobTitle: PERSON.jobTitle[localeToLanguage(locale)],
    // The only signal that ties this site to the profiles it links out to.
    sameAs: SAME_AS,
    worksFor: PERSON.worksFor.map((org) => ({
      "@type": "Organization",
      name: org.name,
      url: org.url,
    })),
    knowsLanguage: ["en", "pt-BR", "es"],
  }
}

function website(locale: Locale): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: HREFLANG[locale],
    description: HOME_SEO[localeToLanguage(locale)].description,
    publisher: { "@id": PERSON_ID },
  }
}

function breadcrumbs(locale: Locale, trail: { name: string; path: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(`/${locale}${crumb.path}`),
    })),
  }
}

export function homeGraph(locale: Locale): Node {
  const url = absolute(`/${locale}`)
  const seo = HOME_SEO[localeToLanguage(locale)]

  return {
    "@context": "https://schema.org",
    "@graph": [
      person(locale),
      website(locale),
      {
        // ProfilePage, not WebPage: the primary subject of the home page is a
        // person, and that is what earns the knowledge-panel treatment.
        "@type": "ProfilePage",
        "@id": `${url}#page`,
        url,
        name: seo.title,
        description: seo.description,
        inLanguage: HREFLANG[locale],
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": PERSON_ID },
        about: { "@id": PERSON_ID },
        // Everything published, so the list page is discoverable as a set.
        hasPart: articles.map((article) => ({
          "@type": "BlogPosting",
          "@id": `${absolute(`/${locale}/work/${article.slug}`)}#article`,
          headline: article.title[localeToLanguage(locale)],
          url: absolute(`/${locale}/work/${article.slug}`),
          datePublished: article.publishedAt,
        })),
      },
    ],
  }
}

export function articleGraph(locale: Locale, article: Article): Node {
  const language = localeToLanguage(locale)
  const url = absolute(`/${locale}/work/${article.slug}`)

  return {
    "@context": "https://schema.org",
    "@graph": [
      person(locale),
      website(locale),
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        mainEntityOfPage: url,
        headline: article.title[language],
        description: article.seoDescription[language],
        inLanguage: HREFLANG[locale],
        datePublished: article.publishedAt,
        dateModified: lastRevised(article),
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
        image: [absolute(OG_IMAGE.url)],
      },
      breadcrumbs(locale, [
        { name: PERSON.name, path: "" },
        { name: article.title[language], path: `/work/${article.slug}` },
      ]),
    ],
  }
}

export function playlistsGraph(locale: Locale): Node {
  const language = localeToLanguage(locale)
  const url = absolute(`/${locale}/monthly-playlists`)
  const seo = PLAYLISTS_SEO[language]

  return {
    "@context": "https://schema.org",
    "@graph": [
      person(locale),
      website(locale),
      {
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        url,
        name: seo.title,
        description: seo.description,
        inLanguage: HREFLANG[locale],
        isPartOf: { "@id": WEBSITE_ID },
        author: { "@id": PERSON_ID },
      },
      breadcrumbs(locale, [
        { name: PERSON.name, path: "" },
        { name: seo.title, path: "/monthly-playlists" },
      ]),
    ],
  }
}

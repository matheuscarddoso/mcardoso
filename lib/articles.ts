import type { Language } from "./locale"

type Localized = Record<Language, string>

export type Article = {
  slug: string
  /** Gutter label on the writing list. */
  year: string
  /** ISO date the piece went up. */
  publishedAt: string
  /**
   * Set this ONLY when the prose actually changed. It is deliberately not
   * derived from git: the last commit to touch these files renamed a CSS class,
   * and reporting that as a revision tells Google the article was refreshed
   * when not a word moved. Unreliable `dateModified` doesn't just waste the
   * signal — it discredits the rest of the site's structured data.
   */
  revisedAt?: string
  /** Shown on the writing list. */
  title: Localized
  /** The one-liner beside the title on the writing list. */
  description: Localized
  /**
   * Search-result copy. Deliberately separate from the on-page title: the list
   * wants something short beside a glyph, a SERP wants 50-60 characters that
   * still read as a sentence once the site name is appended.
   */
  seoTitle: Localized
  seoDescription: Localized
}

/** Newest first — the writing list prints the year gutter on each group's first row. */
export const articles: Article[] = [
  {
    slug: "agent-loops-harness-graphs",
    year: "2026",
    publishedAt: "2026-08-03",
    title: {
      PT: "Loops, harness e grafos",
      EN: "Loops, harnesses and graphs",
      ES: "Loops, harness y grafos",
    },
    description: {
      PT: "Três formas de rodar um agente",
      EN: "Three ways to run an agent",
      ES: "Tres formas de ejecutar un agente",
    },
    seoTitle: {
      PT: "Agent loop, harness e grafo: o guia simples",
      EN: "Agent loops, harnesses and graphs explained",
      ES: "Agent loop, harness y grafo: guía simple",
    },
    seoDescription: {
      PT: "Por que um agente de IA insiste no mesmo erro, e o que muda quando o plano sai do prompt e vira um grafo que o código lê. Sem matemática, com código.",
      EN: "Why an AI agent keeps repeating the same mistake, and what changes when the plan leaves the prompt and becomes a graph your code can read. No maths.",
      ES: "Por qué un agente de IA insiste en el mismo error, y qué cambia cuando el plan sale del prompt y se vuelve un grafo que el código lee. Sin matemáticas.",
    },
  },
  {
    slug: "ai-ml-github-repos",
    year: "2026",
    publishedAt: "2026-07-29",
    title: {
      PT: "5 repositórios do GitHub que te dão uma vantagem injusta em IA",
      EN: "5 GitHub repos that give you an unfair advantage in AI",
      ES: "5 repositorios de GitHub que te dan una ventaja injusta en IA",
    },
    description: {
      PT: "Cinco repos grátis, meses ganhos",
      EN: "Five free repos, months saved",
      ES: "Cinco repos gratis, meses ganados",
    },
    seoTitle: {
      PT: "5 repositórios do GitHub para aprender IA",
      EN: "5 GitHub repos for learning AI and ML",
      ES: "5 repositorios de GitHub para aprender IA",
    },
    seoDescription: {
      PT: "Da primeira linha de Python a projetos de ML de verdade: os cinco repositórios gratuitos que valem um bookmark, e a ordem para percorrê-los.",
      EN: "From your first line of Python to real ML projects: the five free GitHub repositories worth bookmarking, and the order to work through them in.",
      ES: "De tu primera línea de Python a proyectos de ML reales: los cinco repositorios gratuitos que vale marcar, y el orden para recorrerlos.",
    },
  },
  {
    slug: "ai-bubble",
    year: "2026",
    publishedAt: "2026-07-28",
    title: {
      PT: "A IA está perto de quebrar. Eis o motivo.",
      EN: "AI is close to breaking. Here's why.",
      ES: "La IA está cerca de quebrar. Este es el motivo.",
    },
    description: {
      PT: "Por que a bolha vai estourar",
      EN: "Why the bubble will burst",
      ES: "Por qué la burbuja va a estallar",
    },
    seoTitle: {
      PT: "A IA está perto de quebrar. Eis o motivo.",
      EN: "AI is close to breaking. Here's why.",
      ES: "La IA está cerca de quebrar: el motivo",
    },
    seoDescription: {
      PT: "Três trilhões em dívida, modelos chineses abertos e ganhos de produtividade que não chegaram. A conta da bolha da IA não fecha, e eis o porquê.",
      EN: "Three trillion in debt, open Chinese models, and productivity gains that never arrived. The AI bubble's maths does not add up, and here is why.",
      ES: "Tres billones en deuda, modelos chinos abiertos y ganancias de productividad que no llegaron. Las cuentas de la burbuja de la IA no cuadran.",
    },
  },
  {
    slug: "whatsapp-cloud-api",
    year: "2026",
    publishedAt: "2026-05-08",
    title: {
      PT: "Mensagens interativas com a WhatsApp Cloud API",
      EN: "Interactive messages with the WhatsApp Cloud API",
      ES: "Mensajes interactivos con la WhatsApp Cloud API",
    },
    description: {
      PT: "Botões e listas no WhatsApp",
      EN: "Buttons and lists on WhatsApp",
      ES: "Botones y listas en WhatsApp",
    },
    seoTitle: {
      PT: "Mensagens interativas na WhatsApp Cloud API",
      EN: "Interactive messages on WhatsApp Cloud API",
      ES: "Mensajes interactivos en WhatsApp Cloud API",
    },
    seoDescription: {
      PT: "Botões de resposta, listas e carrosséis na WhatsApp Cloud API: os payloads exatos, os limites de cada formato e como tratar o webhook de retorno.",
      EN: "Reply buttons, lists and carousels on the WhatsApp Cloud API: the exact payloads, the limits of each format, and how to handle the webhook back.",
      ES: "Botones de respuesta, listas y carruseles en la WhatsApp Cloud API: los payloads exactos, los límites de cada formato y cómo tratar el webhook.",
    },
  },
  {
    slug: "saving-claude-tokens",
    year: "2026",
    publishedAt: "2026-05-08",
    title: {
      PT: "Como economizar tokens do Claude Code",
      EN: "How to save Claude Code tokens",
      ES: "Cómo ahorrar tokens de Claude Code",
    },
    description: {
      PT: "Gaste menos, entregue mais",
      EN: "Spend fewer tokens, ship more",
      ES: "Gasta menos, entrega más",
    },
    seoTitle: {
      PT: "Como economizar tokens no Claude Code",
      EN: "How to save tokens in Claude Code",
      ES: "Cómo ahorrar tokens en Claude Code",
    },
    seoDescription: {
      PT: "O que realmente consome contexto no Claude Code, e as práticas que cortam o gasto por sessão sem perder qualidade na entrega.",
      EN: "What actually burns context in Claude Code, and the practices that cut spend per session without giving up any output quality.",
      ES: "Qué consume realmente el contexto en Claude Code, y las prácticas que reducen el gasto por sesión sin perder calidad en la entrega.",
    },
  },
  {
    slug: "oklch-colors",
    year: "2026",
    publishedAt: "2026-05-08",
    title: {
      PT: "O que são cores OKLCH?",
      EN: "What are OKLCH colors?",
      ES: "¿Qué son los colores OKLCH?",
    },
    description: {
      PT: "Um espaço de cor melhor",
      EN: "A better color space for UI",
      ES: "Un espacio de color mejor",
    },
    seoTitle: {
      PT: "O que são cores OKLCH? Guia de CSS",
      EN: "What are OKLCH colors? A CSS guide",
      ES: "¿Qué son los colores OKLCH? Guía CSS",
    },
    seoDescription: {
      PT: "OKLCH é um espaço de cor perceptualmente uniforme já suportado no CSS. O que muda em relação a hex e HSL, e como usar com fallback seguro.",
      EN: "OKLCH is a perceptually uniform colour space CSS already supports. What changes next to hex and HSL, and how to ship it with a safe fallback.",
      ES: "OKLCH es un espacio de color perceptualmente uniforme que CSS ya soporta. Qué cambia frente a hex y HSL, y cómo usarlo con un fallback seguro.",
    },
  },
  {
    slug: "invisible-details",
    year: "2026",
    publishedAt: "2026-05-08",
    title: {
      PT: "Detalhes invisíveis",
      EN: "Invisible details",
      ES: "Detalles invisibles",
    },
    description: {
      PT: "O que ninguém nota, mas sente",
      EN: "What nobody notices, but feels",
      ES: "Lo que nadie nota, pero siente",
    },
    seoTitle: {
      PT: "Detalhes invisíveis no design de interface",
      EN: "Invisible details in interface design",
      ES: "Detalles invisibles en diseño de interfaz",
    },
    seoDescription: {
      PT: "Raio concêntrico, sombra em vez de borda, alinhamento óptico. Os detalhes que ninguém nota conscientemente, mas que decidem se a interface parece certa.",
      EN: "Concentric radii, shadows over borders, optical alignment. The details nobody consciously notices, but that decide whether an interface feels right.",
      ES: "Radio concéntrico, sombra en lugar de borde, alineación óptica. Los detalles que nadie nota, pero que deciden si una interfaz se siente correcta.",
    },
  },
]

export const articleBySlug = new Map(articles.map((article) => [article.slug, article]))

/**
 * What `dateModified` and `<lastmod>` should say. Falls back to the publish
 * date so an untouched article never claims a revision it didn't have.
 */
export function lastRevised(article: Article): string {
  return article.revisedAt ?? article.publishedAt
}

export function getArticle(slug: string): Article {
  const article = articleBySlug.get(slug)
  // A page file naming a slug that isn't registered is a build-time authoring
  // bug, not a runtime condition — fail loudly rather than ship empty metadata.
  if (!article) throw new Error(`Unknown article slug: ${slug}`)
  return article
}

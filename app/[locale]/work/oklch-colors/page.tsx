import { CodeBlock } from "@/components/code-block"
import { JsonLd } from "@/components/json-ld"
import { articleMeta, type ArticlePageProps } from "@/lib/article-page"
import { getArticle } from "@/lib/articles"
import { toLocale } from "@/lib/site"
import { articleGraph } from "@/lib/structured-data"
import { ArticleContent } from "./article-content"

const SLUG = "oklch-colors"

export async function generateMetadata({ params }: ArticlePageProps) {
  return articleMeta(SLUG, await params)
}

export default async function OklchColorsPage({ params }: ArticlePageProps) {
  const locale = toLocale((await params).locale)

  return (
    <>
      <JsonLd data={articleGraph(locale, getArticle(SLUG))} />
      <ArticleContent
        codeStructure={
          <CodeBlock
            lang="css"
            code={`/* oklch(lightness chroma hue) */
color: oklch(0.7 0.15 280);

/* with alpha */
color: oklch(0.7 0.15 280 / 0.5);`}
          />
        }
        codeGradients={
          <CodeBlock
            lang="css"
            code={`/* Specify the color space in CSS gradients */
background: linear-gradient(in srgb, #ff00ff, #00ff00);
background: linear-gradient(in oklch, #ff00ff, #00ff00);`}
          />
        }
        codeBrowser={
          <CodeBlock
            lang="css"
            code={`/* Fallback for older browsers */
color: #7b61ff;
color: oklch(0.6 0.24 290);`}
          />
        }
      />
    </>
  )
}

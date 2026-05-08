import { CodeBlock } from "@/components/code-block"
import { ArticleContent } from "./article-content"

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt-br' }, { locale: 'es' }]
}

export default function OklchColorsPage() {
  return (
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
  )
}

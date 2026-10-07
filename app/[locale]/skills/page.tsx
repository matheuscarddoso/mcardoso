import { CodeBlock } from "@/components/code-block"
import { JsonLd } from "@/components/json-ld"
import { articleMeta, type ArticlePageProps } from "@/lib/article-page"
import { getArticle } from "@/lib/articles"
import { toLocale } from "@/lib/site"
import { articleGraph } from "@/lib/structured-data"
import { SkillsContent } from "./content"

const SLUG = "skills"

export async function generateMetadata({ params }: ArticlePageProps) {
  return articleMeta(SLUG, await params)
}

export default async function SkillsPage({ params }: ArticlePageProps) {
  const locale = toLocale((await params).locale)

  return (
    <>
      <JsonLd data={articleGraph(locale, getArticle(SLUG))} />
      <SkillsContent
        codeInstall={
          <CodeBlock
            lang="bash"
            code={`# plugin: atualiza junto com o repositório
/plugin marketplace add matheuscarddoso/skills
/plugin install mcardoso-skills@mcardoso

# ou clone, se você quer editar as skills
git clone https://github.com/matheuscarddoso/skills.git ~/Projects/skills
~/Projects/skills/scripts/install`}
          />
        }
      />
    </>
  )
}

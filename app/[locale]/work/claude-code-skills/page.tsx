import { CodeBlock } from "@/components/code-block"
import { JsonLd } from "@/components/json-ld"
import { articleMeta, type ArticlePageProps } from "@/lib/article-page"
import { getArticle } from "@/lib/articles"
import { toLocale } from "@/lib/site"
import { articleGraph } from "@/lib/structured-data"
import { ArticleContent } from "./article-content"

const SLUG = "claude-code-skills"

export async function generateMetadata({ params }: ArticlePageProps) {
  return articleMeta(SLUG, await params)
}

export default async function ClaudeCodeSkillsPage({ params }: ArticlePageProps) {
  const locale = toLocale((await params).locale)

  return (
    <>
      <JsonLd data={articleGraph(locale, getArticle(SLUG))} />
      <ArticleContent
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
        codeSkill={
          <CodeBlock
            lang="markdown"
            code={`---
name: investigate
description: Diagnóstico disciplinado de bug difícil ou regressão de
  performance, por fases com trava entre elas. Use quando algo está
  quebrado e a causa é desconhecida, quando o usuário disser "tá lento",
  "não funciona", "por que isso quebrou".
---

## Fase 3: Minimize

Corte tudo que não é necessário pro vermelho. Metade da entrada,
metade do caminho de código, uma dependência de cada vez. Continua
vermelho, o corte fica. Ficou verde, o corte tocou a causa.

**Trava:** nada mais pode ser removido sem o vermelho virar verde.`}
          />
        }
        codeBill={
          <CodeBlock
            lang="bash"
            code={`$ node scripts/skills.mjs bill

  skill         chamada     + references  refs  descrição
  --------------------------------------------------------------
  ask           571         571           0       47
  grill         946         946           0       90
  designer      833         1576          1       94
  deploy        705         1240          1       75
  engineer      1258        4613          6      105
  investigate   849         849           0       79
  kickoff       1011        3620          4       79
  qa            751         1213          1       83
  review        798         1284          1       79
  security      998         3937          4       92
  tdd           737         737           0       61
  --------------------------------------------------------------

  Sempre carregado (soma das descrições): 899 tokens de 1600
  Chamada mais cara: 1258 tokens`}
          />
        }
      />
    </>
  )
}

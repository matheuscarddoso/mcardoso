import { CodeBlock } from "@/components/code-block"
import { JsonLd } from "@/components/json-ld"
import { articleMeta, type ArticlePageProps } from "@/lib/article-page"
import { getArticle } from "@/lib/articles"
import { toLocale } from "@/lib/site"
import { articleGraph } from "@/lib/structured-data"
import { ArticleContent } from "./article-content"

const SLUG = "agent-loops-harness-graphs"

export async function generateMetadata({ params }: ArticlePageProps) {
  return articleMeta(SLUG, await params)
}

/**
 * The listings are deliberately comment-free and identifier-only: they are
 * rendered once and read in three languages, and the prose beside each one is
 * what carries the explanation. `CodeBlock` is a server component (Shiki runs
 * at build time), so the blocks are built here and passed down as nodes.
 */
export default async function AgentLoopsHarnessGraphsPage({ params }: ArticlePageProps) {
  const locale = toLocale((await params).locale)

  return (
    <>
      <JsonLd data={articleGraph(locale, getArticle(SLUG))} />
      <ArticleContent
        codeLoop={
          <CodeBlock
            lang="js"
            code={`const history = [userRequest]

while (true) {
  const answer = await model.generate({ history, tools })

  if (answer.done) return answer.text

  const result = await runTool(answer.tool, answer.input)
  history.push(answer, result)
}`}
          />
        }
        codeHarness={
          <CodeBlock
            lang="js"
            code={`const MAX_STEPS = 40
const MAX_ATTEMPTS = 3
const HISTORY_TURNS = 30

const history = [userRequest]

for (let step = 0; step < MAX_STEPS; step++) {
  const answer = await model.generate({
    history: history.slice(-HISTORY_TURNS),
    tools,
    maxTokens: 4096,
  })

  if (answer.done) return answer.text

  const result = await withAttempts(
    () => runTool(answer.tool, answer.input),
    MAX_ATTEMPTS,
  )

  history.push(answer, result)
}

throw new StepLimitReached(MAX_STEPS)`}
          />
        }
        codePlan={
          <CodeBlock
            lang="js"
            code={`const plan = [
  { id: "search_auth",  needs: [] },
  { id: "search_utils", needs: [] },
  { id: "read_auth",    needs: ["search_auth"] },
  { id: "read_utils",   needs: ["search_utils"] },
  { id: "analyze",      needs: ["read_auth", "read_utils"] },
  { id: "fix_a",        needs: ["analyze"] },
  { id: "fix_b",        needs: ["analyze"] },
  { id: "update_docs",  needs: ["analyze"] },
  { id: "run_tests",    needs: ["fix_a", "fix_b"], waitFor: "any" },
  { id: "report",       needs: ["run_tests", "update_docs"] },
]`}
          />
        }
        codeReady={
          <CodeBlock
            lang="js"
            code={`function readySteps(plan, settled) {
  return plan.filter((step) => {
    if (settled.has(step.id)) return false

    return step.waitFor === "any"
      ? step.needs.some((id) => settled.has(id))
      : step.needs.every((id) => settled.has(id))
  })
}

while (settled.size < plan.length) {
  const batch = readySteps(plan, settled)
  if (batch.length === 0) throw new NothingReady()

  await Promise.all(batch.map(run))
}`}
          />
        }
        codeLadder={
          <CodeBlock
            lang="js"
            code={`const LADDER = ["retry", "patch", "replan"]

function nextAction(stepId) {
  const rung = attempts.get(stepId) ?? 0

  if (rung >= LADDER.length) throw new GaveUp(stepId)

  attempts.set(stepId, rung + 1)
  return LADDER[rung]
}`}
          />
        }
      />
    </>
  )
}

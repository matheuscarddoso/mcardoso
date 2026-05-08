import { CodeBlock } from "@/components/code-block"
import { ArticleContent } from "./article-content"

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt-br' }, { locale: 'es' }]
}

export default function SavingClaudeTokensPage() {
  return (
    <ArticleContent
      codeInstall={
        <CodeBlock
          lang="bash"
          code={`# macOS (recommended)
brew install rtk

# Linux / macOS via curl
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh

# verify
rtk --version
rtk gain       # shows token savings stats`}
        />
      }
      codeInit={
        <CodeBlock
          lang="bash"
          code={`# configure the hook for Claude Code
rtk init -g

# restart Claude Code, then test
git status  # automatically rewritten to rtk git status`}
        />
      }
      codeCommands={
        <CodeBlock
          lang="bash"
          code={`# git — compact output for all operations
rtk git status           # grouped changed files
rtk git log -n 10        # one-line commits
rtk git diff             # condensed diff
rtk git commit -m "msg"  # returns "ok abc1234"
rtk git push             # returns "ok main"

# files — filtered and truncated
rtk ls .                 # token-optimized directory tree
rtk read file.ts         # smart file reading
rtk grep "pattern" .     # grouped search results

# tests — failures only
rtk npm test
rtk cargo test           # -90% vs raw output
rtk pytest`}
        />
      }
      codeDirect={
        <CodeBlock
          lang="bash"
          code={`# use shell commands instead of native Claude Code tools
# so the hook (and rtk) can intercept them

cat file.ts      # triggers rtk read via hook
rg "pattern" .   # triggers rtk grep via hook
find . -name "*.ts"  # triggers rtk find via hook

# or call rtk directly
rtk read file.ts
rtk grep "pattern" .
rtk find "*.ts" .`}
        />
      }
    />
  )
}

import { readFile } from "node:fs/promises"
import path from "node:path"
import { codeToHtml } from "shiki"
import { CodePanelTabs, type PanelFile } from "@/components/code-panel-tabs"
import type { CraftFile } from "@/lib/crafts"
import type { Language } from "@/lib/locale"

/**
 * The listing under a craft, highlighted at build time.
 *
 * A file with a `path` is read off disk rather than repeated in a string. The
 * component running on the page and the code printed below it are then the same
 * bytes, and they cannot drift: an edit that forgets the listing is impossible,
 * because there is no second copy to forget.
 */
async function load(file: CraftFile): Promise<PanelFile> {
  const code = file.path
    ? await readFile(path.join(process.cwd(), file.path), "utf8")
    : (file.code ?? "")

  const html = await codeToHtml(code.trim(), {
    lang: file.lang,
    themes: { light: "github-light", dark: "github-dark" },
    transformers: [
      {
        /* Shiki writes the theme's own background inline, which would sit on
           top of the surface this panel already has. */
        pre(node) {
          delete node.properties.style
        },
      },
    ],
  })

  return { name: file.name, html, code: code.trim() }
}

export async function CodePanel({
  files,
  language,
}: {
  files: CraftFile[]
  language: Language
}) {
  const loaded = await Promise.all(files.map(load))
  return <CodePanelTabs files={loaded} language={language} />
}

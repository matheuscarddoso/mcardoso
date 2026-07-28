import { codeToHtml } from "shiki"

export async function CodeBlock({
  code,
  lang = "css",
}: {
  code: string
  lang?: string
}) {
  const html = await codeToHtml(code.trim(), {
    lang,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    transformers: [
      {
        pre(node) {
          delete node.properties.style
        },
      },
    ],
  })

  // `<figure>`, not `<div>`: a code listing is self-contained content the prose
  // refers to, which is the definition of a figure. Shiki's own output is
  // already `<pre><code>`, so the wrapper was the only unsemantic part left.
  return (
    <figure
      className="preview-code my-8 w-full overflow-x-auto rounded-xl p-4 font-mono text-[13px] [&_*]:font-mono"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

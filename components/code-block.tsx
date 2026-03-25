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

  return (
    <div
      className="preview-code my-8 w-full overflow-x-auto rounded-xl p-4 font-mono text-[13px] [&_*]:font-mono"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

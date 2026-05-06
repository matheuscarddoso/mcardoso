"use client"

import * as React from "react"
import Link from "next/link"
import { Undo2, Check, LinkIcon } from "lucide-react"
import { Footer, type Language } from "@/components/footer"

function Divider() {
  return (
    <div className="my-16 flex w-full items-center justify-center gap-1" aria-hidden>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-0.5 w-4 rounded-full bg-gray-400" />
      ))}
    </div>
  )
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 className="mt-16 mb-2 scroll-mt-20 text-balance font-[550] text-foreground" id={id}>
      {children}
    </h2>
  )
}

function CopyLinkButton() {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <button
      onClick={handleCopy}
      className="group relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary transition-[scale,background-color] duration-200 ease-out hover:bg-gray-300 active:scale-[0.96]"
      aria-label="Copy link"
    >
      <span className="relative grid size-4 place-items-center">
        <Check
          className="col-start-1 row-start-1 size-4 text-muted-foreground transition-[opacity,transform,filter] duration-300 group-hover:text-foreground"
          style={{
            transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
            opacity: copied ? 1 : 0,
            transform: copied ? "scale(1)" : "scale(0.25)",
            filter: copied ? "blur(0px)" : "blur(4px)",
          }}
          strokeWidth={1.5}
        />
        <LinkIcon
          className="col-start-1 row-start-1 size-4 text-muted-foreground transition-[opacity,transform,filter] duration-300 group-hover:text-foreground"
          style={{
            transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
            opacity: copied ? 0 : 1,
            transform: copied ? "scale(0.25)" : "scale(1)",
            filter: copied ? "blur(4px)" : "blur(0px)",
          }}
          strokeWidth={1.5}
        />
      </span>
    </button>
  )
}

const c = (text: string) => <code className="code-inline">{text}</code>

const translations = {
  PT: {
    title: "Como economizar tokens do Claude Code",
    intro: <>Cada comando que o Claude Code executa no terminal consome tokens. Um {c("git status")} verboso, logs de teste com centenas de linhas, listagens de diretório completas — tudo vai direto pro contexto do modelo. O {c("rtk")} é um proxy de linha de comando que filtra e comprime esse output antes que ele chegue ao LLM, reduzindo o consumo em 60-90%.</>,

    problem: "O problema",
    problemP1: <>O Claude Code usa a ferramenta Bash para interagir com o projeto. Cada output bruto de comando — espaços, metadados, boilerplate — é contado como tokens. Em um projeto TypeScript médio, uma sessão de 30 minutos consume cerca de 118.000 tokens só em comandos de shell.</>,
    problemP2: <>Tokens desperdiçados com ruído de output são custo sem valor. O Claude não precisa ver 3.000 tokens de {c("git status")} quando 200 tokens com as informações relevantes são suficientes.</>,

    howItWorks: "Como funciona",
    howItWorksP1: <>O rtk age como um proxy transparente entre o Claude e o shell. O hook instalado reescreve automaticamente comandos Bash — {c("git status")} vira {c("rtk git status")} — antes da execução. O Claude nunca vê a reescrita, apenas recebe o output comprimido.</>,
    howItWorksP2: <>Quatro estratégias são aplicadas por tipo de comando: filtragem inteligente (remove ruído, comentários, boilerplate), agrupamento (agrega itens similares), truncamento (mantém contexto relevante) e deduplicação (colapsa linhas repetidas com contagem).</>,

    install: "Instalação",
    installP1: <>A forma mais simples é via Homebrew. Para Linux ou sem brew, existe o instalador via {c("curl")}:</>,

    setup: "Configuração",
    setupP1: <>Após instalar, execute {c("rtk init -g")} para configurar o hook no Claude Code:</>,
    setupP2: <>Reinicie o Claude Code. A partir daí, comandos como {c("git status")} são automaticamente reescritos e filtrados sem nenhuma mudança no workflow.</>,

    savings: "Economia de tokens",
    savingsP1: "Estimativas em um projeto TypeScript/Rust médio, sessão de 30 minutos:",

    commands: "Comandos principais",
    commandsP1: <>Os comandos mais usados no desenvolvimento diário — todos com output comprimido automaticamente via hook:</>,

    note: "Ferramentas nativas",
    noteP1: <>O hook funciona apenas em chamadas de ferramenta Bash. Ferramentas nativas do Claude Code como {c("Read")}, {c("Grep")} e {c("Glob")} não passam pelo hook. Para esses casos, use comandos de shell ({c("cat")}, {c("rg")}, {c("find")}) ou chame o rtk diretamente:</>,

    more: "Mais",
    moreP: <>rtk é open-source com licença MIT. Single binary Rust, sem dependências, overhead menor que 10ms. Código e documentação em</>,
  },
  EN: {
    title: "How to save Claude Code tokens",
    intro: <>Every command Claude Code runs in the terminal consumes tokens. A verbose {c("git status")}, test logs with hundreds of lines, full directory listings — all go straight into the model context. {c("rtk")} is a CLI proxy that filters and compresses command output before it reaches the LLM, reducing consumption by 60-90%.</>,

    problem: "The problem",
    problemP1: <>Claude Code uses the Bash tool to interact with your project. Every raw command output — whitespace, metadata, boilerplate — is counted as tokens. On a medium TypeScript project, a 30-minute session consumes around 118,000 tokens from shell commands alone.</>,
    problemP2: <>Tokens wasted on output noise are cost without value. Claude doesn&apos;t need 3,000 tokens of {c("git status")} when 200 tokens with the relevant information are enough.</>,

    howItWorks: "How it works",
    howItWorksP1: <>rtk acts as a transparent proxy between Claude and the shell. The installed hook automatically rewrites Bash commands — {c("git status")} becomes {c("rtk git status")} — before execution. Claude never sees the rewrite, it just gets compressed output.</>,
    howItWorksP2: <>Four strategies are applied per command type: smart filtering (removes noise, comments, boilerplate), grouping (aggregates similar items), truncation (keeps relevant context), and deduplication (collapses repeated log lines with counts).</>,

    install: "Installation",
    installP1: <>The simplest way is via Homebrew. For Linux or without brew, there&apos;s a {c("curl")} installer:</>,

    setup: "Setup",
    setupP1: <>After installing, run {c("rtk init -g")} to configure the hook in Claude Code:</>,
    setupP2: <>Restart Claude Code. From then on, commands like {c("git status")} are automatically rewritten and filtered with no changes to your workflow.</>,

    savings: "Token savings",
    savingsP1: "Estimates on a medium TypeScript/Rust project, 30-minute session:",

    commands: "Key commands",
    commandsP1: <>The most commonly used commands in daily development — all with output automatically compressed via hook:</>,

    note: "Native tools",
    noteP1: <>The hook only runs on Bash tool calls. Claude Code&apos;s native tools like {c("Read")}, {c("Grep")}, and {c("Glob")} don&apos;t pass through the hook. For those, use shell commands ({c("cat")}, {c("rg")}, {c("find")}) or call rtk directly:</>,

    more: "More",
    moreP: <>rtk is open-source under the MIT license. Single Rust binary, zero dependencies, under 10ms overhead. Code and docs at</>,
  },
  ES: {
    title: "Cómo ahorrar tokens de Claude Code",
    intro: <>Cada comando que Claude Code ejecuta en la terminal consume tokens. Un {c("git status")} verboso, logs de pruebas con cientos de líneas, listados completos de directorio — todo va directo al contexto del modelo. {c("rtk")} es un proxy de línea de comandos que filtra y comprime ese output antes de que llegue al LLM, reduciendo el consumo en 60-90%.</>,

    problem: "El problema",
    problemP1: <>Claude Code usa la herramienta Bash para interactuar con el proyecto. Cada output crudo de comando — espacios, metadatos, boilerplate — se cuenta como tokens. En un proyecto TypeScript medio, una sesión de 30 minutos consume alrededor de 118.000 tokens solo en comandos de shell.</>,
    problemP2: <>Los tokens desperdiciados en ruido de output son costo sin valor. Claude no necesita 3.000 tokens de {c("git status")} cuando 200 tokens con la información relevante son suficientes.</>,

    howItWorks: "Cómo funciona",
    howItWorksP1: <>rtk actúa como un proxy transparente entre Claude y el shell. El hook instalado reescribe automáticamente los comandos Bash — {c("git status")} se convierte en {c("rtk git status")} — antes de la ejecución. Claude nunca ve la reescritura, solo recibe el output comprimido.</>,
    howItWorksP2: <>Se aplican cuatro estrategias por tipo de comando: filtrado inteligente (elimina ruido, comentarios, boilerplate), agrupamiento (agrega elementos similares), truncamiento (mantiene contexto relevante) y deduplicación (colapsa líneas repetidas con conteo).</>,

    install: "Instalación",
    installP1: <>La forma más simple es vía Homebrew. Para Linux o sin brew, existe un instalador vía {c("curl")}:</>,

    setup: "Configuración",
    setupP1: <>Después de instalar, ejecuta {c("rtk init -g")} para configurar el hook en Claude Code:</>,
    setupP2: <>Reinicia Claude Code. A partir de ahí, comandos como {c("git status")} se reescriben y filtran automáticamente sin ningún cambio en el workflow.</>,

    savings: "Ahorro de tokens",
    savingsP1: "Estimaciones en un proyecto TypeScript/Rust medio, sesión de 30 minutos:",

    commands: "Comandos principales",
    commandsP1: <>Los comandos más usados en el desarrollo diario — todos con output comprimido automáticamente vía hook:</>,

    note: "Herramientas nativas",
    noteP1: <>El hook solo funciona en llamadas de herramienta Bash. Las herramientas nativas de Claude Code como {c("Read")}, {c("Grep")} y {c("Glob")} no pasan por el hook. Para esos casos, usa comandos de shell ({c("cat")}, {c("rg")}, {c("find")}) o llama a rtk directamente:</>,

    more: "Más",
    moreP: <>rtk es open-source con licencia MIT. Binary único en Rust, sin dependencias, overhead menor a 10ms. Código y documentación en</>,
  },
}

type ArticleContentProps = {
  codeInstall: React.ReactNode
  codeInit: React.ReactNode
  codeCommands: React.ReactNode
  codeDirect: React.ReactNode
}

export function ArticleContent({ codeInstall, codeInit, codeCommands, codeDirect }: ArticleContentProps) {
  const [language, setLanguage] = React.useState<Language>("EN")
  const t = translations[language]

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden">
      <main className="mx-auto w-full max-w-(--breakpoint-sm) flex-1 px-4 py-12 leading-relaxed sm:py-20">
        <header>
          <div className="mb-24 flex min-h-9 w-full select-none items-center justify-between gap-2">
            <Link
              href="/"
              className="group flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary transition-[scale,background-color] duration-200 ease-out hover:bg-gray-300 active:scale-[0.96]"
              aria-label="Home"
            >
              <Undo2 className="mr-0.5 size-4 text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground" strokeWidth={1.5} />
            </Link>
            <CopyLinkButton />
          </div>
        </header>

        <article>
          <h1 className="mb-2 w-fit scroll-mt-20 text-balance font-[550] text-foreground" id="saving-claude-tokens">
            {t.title}
          </h1>

          <p className="w-full text-pretty text-muted-foreground">{t.intro}</p>

          <Divider />

          <SectionHeading id="problem">{t.problem}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.problemP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.problemP2}</p>

          <div className="my-8 w-full overflow-hidden rounded-xl border">
            <div className="grid w-full grid-cols-1 sm:grid-cols-3">
              {[
                { label: "git status", tokens: "3,000", note: language === "PT" ? "output bruto" : language === "ES" ? "output crudo" : "raw output" },
                { label: "npm test", tokens: "25,000", note: language === "PT" ? "logs completos" : language === "ES" ? "logs completos" : "full logs" },
                { label: "cat file.ts", tokens: "40,000", note: language === "PT" ? "arquivo inteiro" : language === "ES" ? "archivo completo" : "entire file" },
              ].map((item, i) => (
                <div key={item.label} className={`flex flex-col gap-1 px-4 py-3 ${i < 2 ? "border-b sm:border-b-0 sm:border-r" : ""}`}>
                  <span className="font-mono text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-sm text-muted-foreground">{item.tokens} tokens</span>
                  <span className="font-mono text-xs text-muted-foreground/70">{item.note}</span>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          <SectionHeading id="how-it-works">{t.howItWorks}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.howItWorksP1}</p>

          <div className="my-8 flex w-full flex-col items-center">
            <div className="preview-card w-full p-6">
              <div className="flex w-full flex-col gap-3">
                {[
                  {
                    label: language === "PT" ? "Sem rtk" : language === "ES" ? "Sin rtk" : "Without rtk",
                    from: "git status",
                    to: language === "PT" ? "~3.000 tokens" : language === "ES" ? "~3.000 tokens" : "~3,000 tokens",
                    dim: true,
                  },
                  {
                    label: language === "PT" ? "Com rtk" : language === "ES" ? "Con rtk" : "With rtk",
                    from: "git status → rtk git status",
                    to: language === "PT" ? "~200 tokens" : language === "ES" ? "~200 tokens" : "~200 tokens",
                    dim: false,
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className={`text-xs font-medium ${row.dim ? "text-muted-foreground/60" : "text-foreground"}`}>{row.label}</span>
                      <span className={`font-mono text-xs ${row.dim ? "text-muted-foreground/50" : "text-muted-foreground"}`}>{row.from}</span>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-xs ${row.dim ? "bg-secondary text-muted-foreground/60" : "bg-foreground text-background font-medium"}`}>
                      {row.to}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.howItWorksP2}</p>

          <Divider />

          <SectionHeading id="install">{t.install}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.installP1}</p>

          {codeInstall}

          <Divider />

          <SectionHeading id="setup">{t.setup}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.setupP1}</p>

          {codeInit}

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.setupP2}</p>

          <Divider />

          <SectionHeading id="savings">{t.savings}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.savingsP1}</p>

          <div className="my-8 w-full overflow-hidden rounded-xl border">
            <div className="grid w-full grid-cols-1">
              {[
                { cmd: "git status", std: "3,000", rtk: "600", savings: "-80%" },
                { cmd: "git diff", std: "10,000", rtk: "2,500", savings: "-75%" },
                { cmd: "cat / read", std: "40,000", rtk: "12,000", savings: "-70%" },
                { cmd: "grep / rg", std: "16,000", rtk: "3,200", savings: "-80%" },
                { cmd: "npm/cargo test", std: "25,000", rtk: "2,500", savings: "-90%" },
              ].map((row, i) => (
                <div
                  key={row.cmd}
                  className={`grid grid-cols-4 items-center px-2 py-2 sm:px-4 sm:py-2.5 ${i < 4 ? "border-b" : ""}`}
                >
                  <span className="font-mono text-[11px] sm:text-sm text-foreground">{row.cmd}</span>
                  <span className="text-[11px] sm:text-sm text-muted-foreground/60">{row.std}</span>
                  <span className="text-[11px] sm:text-sm text-muted-foreground">{row.rtk}</span>
                  <span className="text-[11px] sm:text-sm font-medium text-foreground">{row.savings}</span>
                </div>
              ))}
              <div className="grid grid-cols-4 items-center border-t bg-secondary/40 px-2 py-2 sm:px-4 sm:py-2.5">
                <span className="text-[11px] sm:text-sm font-medium text-foreground">Total</span>
                <span className="text-[11px] sm:text-sm text-muted-foreground/60">~118,000</span>
                <span className="text-[11px] sm:text-sm text-muted-foreground">~23,900</span>
                <span className="text-[11px] sm:text-sm font-medium text-foreground">-80%</span>
              </div>
            </div>
          </div>

          <Divider />

          <SectionHeading id="commands">{t.commands}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.commandsP1}</p>

          {codeCommands}

          <Divider />

          <SectionHeading id="native-tools">{t.note}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.noteP1}</p>

          {codeDirect}

          <Divider />

          <h2 className="mt-16 mb-2 w-full text-balance font-[550] text-foreground">{t.more}</h2>

          <p className="mb-6 w-full text-pretty text-muted-foreground">
            {t.moreP}{" "}
            <a className="article-underline text-foreground" href="https://github.com/rtk-ai/rtk" target="_blank" rel="noopener noreferrer">github.com/rtk-ai/rtk</a>.
          </p>
        </article>
      </main>
      <Footer language={language} onLanguageChange={setLanguage} />
    </div>
  )
}

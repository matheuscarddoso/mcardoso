"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Undo2, Check, LinkIcon, ArrowUpRight } from "lucide-react"
import { Footer, type Language } from "@/components/footer"
import { LanguageToggle, ThemeToggle } from "@/components/toggles"
import { ArticleByline } from "@/components/article-byline"
import { ArticleNav } from "@/components/article-nav"
import { ArticleTimeline } from "@/components/article-timeline"
import { SectionDivider } from "@/components/section-divider"
import { localeToLanguage } from "@/lib/locale"
import { switchLocale } from "@/lib/switch-locale"

/** Same dotted rule the home page uses, at the spacing these essays had. */
function Divider() {
  return <SectionDivider className="my-16" />
}

/**
 * `n` prints the ordinal in the heading itself, so the number is part of the
 * text a search result or a screen reader gets — not a CSS counter it would
 * miss. Muted, so the repo name still reads as the heading.
 */
function SectionHeading({
  id,
  n,
  children,
}: {
  id: string
  n?: number
  children: React.ReactNode
}) {
  return (
    <h2 className="mt-16 mb-2 scroll-mt-20 text-balance font-[550] article-heading" id={id}>
      {n !== undefined && <span className="text-gray-1000 tabular-nums">{n}. </span>}
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

/**
 * The repository itself, as the one thing you're meant to click.
 *
 * The artwork is GitHub's own social card for that repo, which carries the
 * description and the star and fork counts — information the prose around it
 * doesn't repeat, which is why it gets a real `alt` rather than being treated
 * as decoration. The path stays in mono below it: it *is* the address, and
 * seeing `owner/repo` is how anyone checks they're going where they expect.
 *
 * Same one-pixel frame around a rounded image as the bio's hover previews.
 */
function Repo({ path }: { path: string }) {
  return (
    <a
      href={`https://github.com/${path}`}
      target="_blank"
      rel="noopener noreferrer"
      className="preview-card group my-6 block w-full p-1 transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-strong)] hover:scale-[1.01] hover:shadow-card-lift active:scale-[0.99] motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
    >
      <Image
        src={`https://opengraph.githubassets.com/1/${path}`}
        alt={`GitHub social card for ${path}`}
        width={1200}
        height={600}
        // The article column caps at 640px minus its 16px gutters.
        sizes="(max-width: 640px) 100vw, 608px"
        className="h-auto w-full rounded-lg"
      />
      <span className="flex items-center gap-2 px-3 pt-2.5 pb-1.5">
        <span className="min-w-0 truncate font-mono text-[13px] text-foreground">{path}</span>
        <ArrowUpRight
          aria-hidden
          className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </a>
  )
}

const REPOS = {
  python: "Asabeneh/30-Days-Of-Python",
  microsoft: "microsoft/ML-For-Beginners",
  stanford: "afshinea/stanford-cs-229-machine-learning",
  projects:
    "ashishpatel26/500-AI-Machine-learning-Deep-learning-Computer-vision-NLP-Projects-with-code",
  awesome: "josephmisiti/awesome-machine-learning",
} as const

const translations = {
  PT: {
    title: "5 repositórios do GitHub que te dão uma vantagem injusta em IA",
    intro: (
      <>
        A maioria de quem está aprendendo IA não sabe que esses repositórios existem, e eles
        economizariam meses. São os cinco que eu manteria nos favoritos se estivesse começando
        machine learning hoje: da primeira linha de Python até construir projetos de verdade.
        Todos completamente gratuitos.
      </>
    ),

    python: "30 Days of Python",
    pythonP1:
      "Antes de qualquer IA você precisa de Python sólido, e este é o caminho gratuito mais limpo pra chegar lá. É um curso de 30 dias, passo a passo, que leva de iniciante completo a genuinamente confortável, com exercícios pequenos o tempo todo.",
    pythonP2:
      "Faça um pouco por dia e você terá a base sobre a qual todo o resto é construído.",

    microsoft: "Microsoft ML-For-Beginners",
    microsoftP1:
      "Um currículo gratuito de machine learning de 12 semanas feito pela Microsoft: 26 lições recheadas de projetos práticos e reais. É provavelmente a forma mais bem estruturada de aprender ML de verdade sem pagar um centavo.",
    microsoftP2:
      "Trate como seu curso principal depois que o básico de Python estiver firme.",

    stanford: "Stanford CS229 Cheat Sheets",
    stanfordP1:
      "O lendário curso de machine learning de Stanford, condensado em algumas cheat sheets limpas. Aprendizado supervisionado, não supervisionado, deep learning e as dicas práticas, tudo em páginas que você vai revisitar constantemente.",
    stanfordP2:
      "Perfeito pra relembrar um conceito rápido sem escavar um livro inteiro.",

    projects: "500 projetos de IA e ML com código",
    projectsP1:
      "Mais de 500 projetos de machine learning, deep learning, visão computacional e NLP, cada um com código pra você estudar. Você nunca mais vai ficar sem o que construir nem sem ideia pro portfólio.",
    projectsP2: "Escolhe um que te empolgue e reconstrói do zero.",

    awesome: "Awesome Machine Learning",
    awesomeP1:
      "Uma lista curada gigante de basicamente toda biblioteca, framework e recurso de ML que existe, organizada por linguagem. É o hub que você deixa numa aba pra sempre e consulta quando precisa de uma ferramenta pra algo.",
    awesomeP2:
      "Um pouco esmagador no começo, mas incrivelmente útil quando você já sabe o que procura.",

    advice: "A ordem que eu seguiria",
    adviceP1:
      "Não abra os cinco de uma vez: é a forma mais rápida de não terminar nenhum. Comece pelo 30 Days of Python, migre pro curso da Microsoft, mantenha as cheat sheets do lado e, quando o básico estiver firme, comece a construir a partir do repositório de projetos.",
    adviceP2: "Se tiver qualquer dúvida, me chama no",
  },
  EN: {
    title: "5 GitHub repos that give you an unfair advantage in AI",
    intro: (
      <>
        Most people learning AI have no idea these exist, and they&apos;d save you months. These
        are the five GitHub repos I&apos;d keep bookmarked if I were learning machine learning
        today, going from your first line of Python all the way to building real projects. Every
        single one is completely free.
      </>
    ),

    python: "30 Days of Python",
    pythonP1:
      "Before any AI you need solid Python, and this is the cleanest free way to get there. It's a 30-day, step-by-step course that takes you from complete beginner to genuinely comfortable, with small exercises the whole way.",
    pythonP2: "Do a bit every day and you'll have the foundation everything else is built on.",

    microsoft: "Microsoft ML-For-Beginners",
    microsoftP1:
      "A free 12-week machine learning curriculum built by Microsoft: 26 lessons packed with real, hands-on projects. It's probably the best structured way to actually learn ML properly without paying a cent.",
    microsoftP2: "Treat it as your main course once your Python basics are solid.",

    stanford: "Stanford CS229 Cheat Sheets",
    stanfordP1:
      "The legendary Stanford machine learning course, condensed into a few clean cheat sheets. Supervised learning, unsupervised learning, deep learning and the practical tips, all in pages you'll come back to constantly.",
    stanfordP2: "Perfect for quickly refreshing a concept without digging through a whole textbook.",

    projects: "500 AI and ML projects with code",
    projectsP1:
      "Over 500 machine learning, deep learning, computer vision and NLP projects, every one with code you can learn from. You'll never run out of things to build or portfolio ideas again.",
    projectsP2: "Pick one that excites you and rebuild it yourself.",

    awesome: "Awesome Machine Learning",
    awesomeP1:
      "A giant curated list of basically every ML library, framework and resource out there, organized by language. It's the hub you keep open in a tab forever and go to whenever you need a tool for something.",
    awesomeP2: "A bit overwhelming at first, but incredibly useful once you know what you're looking for.",

    advice: "The order I'd go in",
    adviceP1:
      "Don't open all five at once: that's the fastest way to finish none of them. Start with 30 Days of Python, move into the Microsoft course, keep the cheat sheets next to you, and once you've got the basics start building from the projects repo.",
    adviceP2: "As always, feel free to reach out if you have any questions on",
  },
  ES: {
    title: "5 repositorios de GitHub que te dan una ventaja injusta en IA",
    intro: (
      <>
        La mayoría de quienes están aprendiendo IA no sabe que estos repositorios existen, y
        ahorrarían meses. Son los cinco que mantendría en favoritos si estuviera aprendiendo
        machine learning hoy: desde tu primera línea de Python hasta construir proyectos reales.
        Todos completamente gratuitos.
      </>
    ),

    python: "30 Days of Python",
    pythonP1:
      "Antes de cualquier IA necesitas Python sólido, y este es el camino gratuito más limpio para llegar ahí. Es un curso de 30 días, paso a paso, que te lleva de principiante absoluto a genuinamente cómodo, con ejercicios pequeños todo el tiempo.",
    pythonP2: "Haz un poco cada día y tendrás la base sobre la que se construye todo lo demás.",

    microsoft: "Microsoft ML-For-Beginners",
    microsoftP1:
      "Un currículo gratuito de machine learning de 12 semanas hecho por Microsoft: 26 lecciones llenas de proyectos prácticos y reales. Es probablemente la forma mejor estructurada de aprender ML de verdad sin pagar un centavo.",
    microsoftP2: "Trátalo como tu curso principal una vez que las bases de Python estén firmes.",

    stanford: "Stanford CS229 Cheat Sheets",
    stanfordP1:
      "El legendario curso de machine learning de Stanford, condensado en unas cheat sheets limpias. Aprendizaje supervisado, no supervisado, deep learning y los consejos prácticos, todo en páginas que vas a revisitar constantemente.",
    stanfordP2: "Perfecto para repasar un concepto rápido sin excavar un libro entero.",

    projects: "500 proyectos de IA y ML con código",
    projectsP1:
      "Más de 500 proyectos de machine learning, deep learning, visión por computadora y NLP, cada uno con código del que puedes aprender. Nunca más te vas a quedar sin qué construir ni sin ideas para el portafolio.",
    projectsP2: "Elige uno que te entusiasme y reconstrúyelo desde cero.",

    awesome: "Awesome Machine Learning",
    awesomeP1:
      "Una lista curada gigante de básicamente toda biblioteca, framework y recurso de ML que existe, organizada por lenguaje. Es el hub que dejas en una pestaña para siempre y consultas cuando necesitas una herramienta para algo.",
    awesomeP2: "Un poco abrumador al principio, pero increíblemente útil cuando ya sabes qué buscas.",

    advice: "El orden que yo seguiría",
    adviceP1:
      "No abras los cinco a la vez: es la forma más rápida de no terminar ninguno. Empieza con 30 Days of Python, pasa al curso de Microsoft, mantén las cheat sheets al lado y, cuando las bases estén firmes, empieza a construir desde el repositorio de proyectos.",
    adviceP2: "Como siempre, escríbeme si tienes cualquier duda en",
  },
}

export function ArticleContent() {
  const params = useParams()
  const locale = (params.locale as string) ?? "en"
  const language: Language = localeToLanguage(locale)
  const t = translations[language]

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden">
      <ArticleTimeline language={language} />
      <main className="mx-auto w-full max-w-(--breakpoint-sm) flex-1 px-4 py-12 leading-relaxed sm:py-20">
        <header>
          <div className="mb-24 flex min-h-9 w-full select-none items-center justify-between gap-2">
            <Link
              href={`/${locale}`}
              className="group flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary transition-[scale,background-color] duration-200 ease-out hover:bg-gray-300 active:scale-[0.96]"
              aria-label="Home"
            >
              <Undo2 className="mr-0.5 size-4 text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground" strokeWidth={1.5} />
            </Link>
            <div className="flex items-center gap-2">
              <LanguageToggle language={language} onLanguageChange={switchLocale} />
              <ThemeToggle language={language} />
              <CopyLinkButton />
            </div>
          </div>
        </header>

        <article>
          <h1 className="mb-2 w-fit scroll-mt-20 text-balance font-[550] article-heading" id="ai-ml-github-repos">
            {t.title}
          </h1>

          <ArticleByline slug="ai-ml-github-repos" language={language} />

          <p className="w-full text-pretty text-muted-foreground">{t.intro}</p>

          <Divider />

          <SectionHeading id="30-days-of-python" n={1}>{t.python}</SectionHeading>

          <Repo path={REPOS.python} />

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.pythonP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.pythonP2}</p>

          <Divider />

          <SectionHeading id="ml-for-beginners" n={2}>{t.microsoft}</SectionHeading>

          <Repo path={REPOS.microsoft} />

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.microsoftP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.microsoftP2}</p>

          <Divider />

          <SectionHeading id="cs229-cheat-sheets" n={3}>{t.stanford}</SectionHeading>

          <Repo path={REPOS.stanford} />

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.stanfordP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.stanfordP2}</p>

          <Divider />

          <SectionHeading id="500-projects" n={4}>{t.projects}</SectionHeading>

          <Repo path={REPOS.projects} />

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.projectsP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.projectsP2}</p>

          <Divider />

          <SectionHeading id="awesome-machine-learning" n={5}>{t.awesome}</SectionHeading>

          <Repo path={REPOS.awesome} />

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.awesomeP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.awesomeP2}</p>

          <Divider />

          <h2 className="mt-16 mb-2 w-full text-balance font-[550] article-heading scroll-mt-20" id="the-order">{t.advice}</h2>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.adviceP1}</p>

          <p className="mb-6 w-full text-pretty text-muted-foreground">
            {t.adviceP2}{" "}
            <a className="article-underline" href="https://x.com/mattcrdoso" target="_blank" rel="noopener noreferrer">X</a>.
          </p>

          <ArticleNav slug="ai-ml-github-repos" language={language} locale={locale} />
        </article>
      </main>
      {/* Language moved up beside the copy-link button; theme stays here. */}
      {/* Both toggles live in the article header, beside copy-link. */}
      <Footer language={language} showLanguageToggle={false} showThemeToggle={false} />
    </div>
  )
}

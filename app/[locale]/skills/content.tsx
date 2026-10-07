"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Check, Copy, Undo2 } from "lucide-react"
import { ArticleByline } from "@/components/article-byline"
import { ArticleNav } from "@/components/article-nav"
import { ArticleNextSection } from "@/components/article-next-section"
import { ArticleTimeline } from "@/components/article-timeline"
import { CopyLinkButton } from "@/components/copy-link-button"
import { Footer } from "@/components/footer"
import { HomeLink } from "@/components/home-link"
import { SectionDivider } from "@/components/section-divider"
import { getArticle } from "@/lib/articles"
import { localeToLanguage, type Language } from "@/lib/locale"
import { COPY, GROUPS, type Skill } from "./data"
import { DEMOS } from "./demos"

/*
 * The skills, in the same shell as every other piece on the site: back and
 * copy-link up top, the title with its byline, dotted rules between
 * sections, the section strip in the margin and previous and next at the
 * bottom. What it adds is the catalogue itself: each skill as a name, a
 * sentence or two and an example. Interface skills show the example as a
 * before/after you flip; engineering skills show what you type and a taste
 * of what comes back. Every prompt has a copy button, because the point is
 * to use them.
 */

const SLUG = "skills"

/** Same dotted rule the home page uses, at the spacing the essays have. */
function Divider() {
  return <SectionDivider className="my-16" />
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 className="mt-16 mb-2 scroll-mt-20 text-balance font-medium article-heading" id={id}>
      {children}
    </h2>
  )
}

const c = (text: string) => <code className="code-inline">{text}</code>

const prose = "mb-4 w-full text-pretty text-muted-foreground"

const ICON_SWAP = { type: "spring", duration: 0.3, bounce: 0 } as const

function CopyPrompt({ text, lang }: { text: string; lang: Language }) {
  const [copied, setCopied] = React.useState(false)
  const reduce = useReducedMotion()
  const timer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), 1600)
      })
      .catch((error: unknown) => console.error("[skills] copy", error))
  }

  const hidden = reduce ? { opacity: 0 } : { opacity: 0, scale: 0.25, filter: "blur(4px)" }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? COPY.copied[lang] : `${COPY.copy[lang]}: ${text}`}
      className="relative grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-muted-foreground outline-none transition-[color,background-color,scale] duration-150 ease-out hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.96]"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={copied ? "check" : "copy"}
          initial={hidden}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={hidden}
          transition={ICON_SWAP}
          className="grid place-items-center"
        >
          {copied ? <Check className="size-3.5" strokeWidth={2} /> : <Copy className="size-3.5" strokeWidth={1.5} />}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? COPY.copied[lang] : ""}
      </span>
    </button>
  )
}

function Example({ skill, lang }: { skill: Skill; lang: Language }) {
  const [after, setAfter] = React.useState(true)
  const demo = DEMOS[skill.name]

  return (
    <div className="preview-card mt-4 mb-2">
      {demo ? (
        <>
          <div className="flex min-h-56 items-center justify-center px-4 py-8">{demo({ after, lang })}</div>
          <div className="flex justify-center gap-1 border-t p-1.5" role="group" aria-label={COPY.example[lang]}>
            {[false, true].map((value) => (
              <button
                key={String(value)}
                type="button"
                aria-pressed={after === value}
                onClick={() => setAfter(value)}
                className={`h-7 cursor-pointer rounded-full px-3 text-[13px] font-medium outline-none transition-[background-color,color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.96] ${
                  after === value ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {value ? COPY.after[lang] : COPY.before[lang]}
              </button>
            ))}
          </div>
        </>
      ) : (
        skill.output && (
          <pre className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-5 whitespace-pre text-muted-foreground">{skill.output[lang]}</pre>
        )
      )}
      <div className="flex items-center gap-2 border-t py-1 pr-1 pl-4">
        <span className="font-mono text-[12px] text-muted-foreground/70" aria-hidden>
          &gt;
        </span>
        <code className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-foreground" title={skill.prompt[lang]}>
          {skill.prompt[lang]}
        </code>
        <CopyPrompt text={skill.prompt[lang]} lang={lang} />
      </div>
    </div>
  )
}

export function SkillsContent({ codeInstall }: { codeInstall: React.ReactNode }) {
  const params = useParams()
  const locale = (params.locale as string) ?? "en"
  const language = localeToLanguage(locale)
  const [p2a, p2b] = COPY.installP2[language]
  const [a1, a2, a3, a4] = COPY.adoptThree[language]

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden">
      <ArticleTimeline language={language} />
      <ArticleNextSection language={language} />
      <main className="mx-auto w-full max-w-(--breakpoint-sm) flex-1 px-4 py-12 leading-relaxed sm:py-20">
        <header>
          <div className="mb-24 flex min-h-9 w-full select-none items-center justify-between gap-2">
            <HomeLink
              locale={locale}
              className="group flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary transition-[scale,background-color] duration-200 ease-out hover:bg-gray-300 active:scale-[0.96]"
              aria-label="Home"
            >
              <Undo2
                className="mr-0.5 size-4 text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground"
                strokeWidth={1.5}
              />
            </HomeLink>
            <div className="flex items-center gap-2">
              <CopyLinkButton />
            </div>
          </div>
        </header>

        <article>
          <h1 className="mb-2 w-fit scroll-mt-20 text-balance font-medium article-heading" id={SLUG}>
            {getArticle(SLUG).title[language]}
          </h1>

          <ArticleByline slug={SLUG} language={language} />

          <p className="w-full text-pretty text-muted-foreground">{COPY.intro[language]}</p>

          <Divider />

          <SectionHeading id="install">{COPY.installTitle[language]}</SectionHeading>
          <p className={prose}>{COPY.installP1[language]}</p>
          {codeInstall}
          <p className={prose}>
            {p2a}
            {c("/ask")}
            {p2b}
          </p>
          <p className={prose}>
            {a1}
            {c("/grill")}
            {a2}
            {c("/review")}
            {a3}
            {c("/designer")}
            {a4}
          </p>

          {GROUPS.map((group) => (
            <React.Fragment key={group.id}>
              <Divider />
              <SectionHeading id={group.id}>{group.title[language]}</SectionHeading>
              <p className={prose}>{group.intro[language]}</p>

              {group.skills.map((skill) => (
                <section key={skill.name} id={skill.name} aria-labelledby={`skill-${skill.name}`} className="mt-12 scroll-mt-20">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 id={`skill-${skill.name}`} className="font-mono text-[15px] font-medium article-heading">
                      <a href={`#${skill.name}`} className="outline-none focus-visible:underline">
                        /{skill.name}
                      </a>
                    </h3>
                    <span className="text-sm text-muted-foreground/80">{skill.userInvoked ? COPY.youCall[language] : COPY.agentCalls[language]}</span>
                  </div>
                  <p className="mt-1 w-full text-pretty text-muted-foreground">{skill.description[language]}</p>
                  <Example skill={skill} lang={language} />
                </section>
              ))}
            </React.Fragment>
          ))}

          <Divider />

          <SectionHeading id="more">{COPY.moreTitle[language]}</SectionHeading>
          <p className={prose}>
            {COPY.more[language]}{" "}
            <a href={COPY.github} target="_blank" rel="noopener noreferrer" className="article-underline">
              matheuscarddoso/skills
            </a>
            . {COPY.credits[language]}
          </p>
          <p className="mb-6 w-full text-pretty text-muted-foreground">
            {COPY.courseIntro[language]}{" "}
            <a href={COPY.course} target="_blank" rel="noopener noreferrer" className="article-underline">
              craft.ocardoso.com
            </a>
            .
          </p>

          <ArticleNav slug={SLUG} language={language} locale={locale} />
        </article>
      </main>
      <Footer language={language} />
    </div>
  )
}

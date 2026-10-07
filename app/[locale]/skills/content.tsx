"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowUpRight, Check, Copy, Undo2 } from "lucide-react"
import { Footer } from "@/components/footer"
import { HomeLink } from "@/components/home-link"
import { localeToLanguage, type Language } from "@/lib/locale"
import { COPY, GROUPS, type Skill } from "./data"
import { DEMOS } from "./demos"

/*
 * The skills page, laid out the way jakub.kr/skills is: one line of intro,
 * the install command, then every skill as a name, a sentence or two and an
 * example. Interface skills show the example as a before/after you flip;
 * engineering skills show what you type and a taste of what comes back.
 *
 * Every prompt has a copy button, because the point of the page is to be
 * used, not read.
 */

const ICON_SWAP = { type: "spring", duration: 0.3, bounce: 0 } as const

function CopyButton({ text, lang, className = "" }: { text: string; lang: Language; className?: string }) {
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
      className={`relative grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-gray-1000 outline-none transition-[color,background-color,scale] duration-150 ease-out hover:bg-gray-300 hover:text-gray-1200 focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.96] ${className}`}
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
          {copied ? <Check className="size-3.5" strokeWidth={2} /> : <Copy className="size-3.5" strokeWidth={1.75} />}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? COPY.copied[lang] : ""}
      </span>
    </button>
  )
}

function Prompt({ text, lang }: { text: string; lang: Language }) {
  return (
    <div className="flex items-center gap-2 border-t border-gray-400 py-1 pr-1 pl-4">
      <span className="font-mono text-[12px] text-gray-900" aria-hidden>
        &gt;
      </span>
      <code className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-gray-1200" title={text}>
        {text}
      </code>
      <CopyButton text={text} lang={lang} />
    </div>
  )
}

function Example({ skill, lang }: { skill: Skill; lang: Language }) {
  const [after, setAfter] = React.useState(true)
  const demo = DEMOS[skill.name]

  return (
    <div className="preview-card mt-4">
      {demo ? (
        <>
          <div className="flex min-h-56 items-center justify-center px-4 py-8">{demo({ after, lang })}</div>
          <div className="flex justify-center gap-1 border-t border-gray-400 p-1.5" role="group" aria-label={COPY.example[lang]}>
            {[false, true].map((value) => (
              <button
                key={String(value)}
                type="button"
                aria-pressed={after === value}
                onClick={() => setAfter(value)}
                className={`h-7 cursor-pointer rounded-full px-3 text-[12px] font-medium outline-none transition-[background-color,color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.96] ${
                  after === value ? "bg-gray-300 text-gray-1200" : "text-gray-1000 hover:text-gray-1200"
                }`}
              >
                {value ? COPY.after[lang] : COPY.before[lang]}
              </button>
            ))}
          </div>
        </>
      ) : (
        skill.output && (
          <pre className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-5 whitespace-pre text-gray-1100">{skill.output[lang]}</pre>
        )
      )}
      <Prompt text={skill.prompt[lang]} lang={lang} />
    </div>
  )
}

export function SkillsContent() {
  const params = useParams()
  const locale = (params.locale as string) ?? "en"
  const lang = localeToLanguage(locale)

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-hidden">
      <div
        className="pointer-events-none fixed top-0 left-0 z-50 h-12 w-full bg-neutral-100 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-neutral-900"
        aria-hidden
      />
      <main className="mx-auto flex w-full max-w-(--breakpoint-sm) flex-1 flex-col px-4 pt-20 pb-4 text-gray-600 dark:text-[#b4b4b4]">
        <div className="mb-16 flex items-center justify-between">
          <HomeLink
            locale={locale}
            aria-label={COPY.back[lang]}
            className="inline-flex h-8 w-8 cursor-pointer select-none items-center justify-center rounded-full bg-[#F0F0F0] text-primary-light-12 outline-none transition-all duration-150 hover:bg-primary-light-4 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 active:scale-[0.97] dark:bg-primary-dark-3 dark:text-primary-dark-1 dark:hover:bg-primary-dark-4 [&_svg]:text-primary-light-12 dark:[&_svg]:text-primary-dark-12"
          >
            <Undo2 className="size-4" strokeWidth={1.5} />
          </HomeLink>
        </div>

        <h1 className="article-heading mb-2 font-mono font-medium">/skills</h1>
        <p className="paragraph mb-6 text-pretty">{COPY.intro[lang]}</p>

        <div className="preview-card flex items-center gap-2 py-1 pr-1 pl-4">
          <code className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-gray-1200" title={COPY.install}>{COPY.install}</code>
          <CopyButton text={COPY.install} lang={lang} />
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
          {[
            { href: COPY.github, label: "GitHub" },
            { href: COPY.course, label: COPY.courseLabel[lang] },
          ].map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="article-underline inline-flex items-center gap-0.5">
              {l.label}
              <ArrowUpRight className="size-3" aria-hidden />
              <span className="sr-only">({COPY.newTab[lang]})</span>
            </a>
          ))}
        </div>

        {GROUPS.map((group) => (
          <section key={group.id} aria-labelledby={`group-${group.id}`} className="mt-20">
            <h2 id={`group-${group.id}`} className="article-heading font-medium">
              {group.title[lang]}
            </h2>
            <p className="paragraph mt-1 text-pretty">{group.intro[lang]}</p>

            <div className="mt-10 flex flex-col gap-16">
              {group.skills.map((skill) => (
                <article key={skill.name} id={skill.name} aria-labelledby={`skill-${skill.name}`} className="scroll-mt-20">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 id={`skill-${skill.name}`} className="article-heading font-mono text-[15px] font-medium">
                      <a href={`#${skill.name}`} className="outline-none focus-visible:underline">
                        /{skill.name}
                      </a>
                    </h3>
                    <span className="text-[12px] text-gray-1000">{skill.userInvoked ? COPY.youCall[lang] : COPY.agentCalls[lang]}</span>
                  </div>
                  <p className="paragraph mt-1.5 text-pretty">{skill.description[lang]}</p>
                  <Example skill={skill} lang={lang} />
                </article>
              ))}
            </div>
          </section>
        ))}

        <p className="paragraph mt-20 pb-20 text-pretty">
          {COPY.credits[lang]}{" "}
          <a href="https://jakub.kr/skills" target="_blank" rel="noopener noreferrer" className="article-underline">
            jakub.kr/skills
          </a>
          .
        </p>
      </main>
      <Footer language={lang} />
    </div>
  )
}

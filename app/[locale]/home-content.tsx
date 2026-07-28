"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { AvatarLightbox } from "@/components/avatar-lightbox"
import { Footer, type Language } from "@/components/footer"
import { AbacatePreview, KuboPreview, ProjectCard } from "@/components/project-card"
import { WorkList } from "@/components/work-list"
import { CommitHeatmap } from "@/components/commit-heatmap"
import { LanguageToggle, ThemeToggle, ToggleSeparator } from "@/components/toggles"
import { BioLink, GithubLink, PlaylistLink } from "@/components/link-preview"
import { localeToLanguage, languageToLocale } from "@/lib/locale"
import type { GithubCardData } from "@/lib/github"
import { Check, Mail } from "lucide-react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const EMAIL = "mathuscardoso@gmail.com"

const translations = {
  PT: {
    imageAlt: "Foto de Matheus Cardoso",
    openPhoto: "Ampliar a foto de perfil",
    closePhoto: "Fechar a foto",
    title: "Engenheiro de Software",
    projects: "Projetos",
    writing: "Escrita",
    copyEmail: "Copiar e-mail",
    kuboMeta: "No ar",
    kuboDescription: "Plataforma de food service, do pedido à cozinha.",
    abacateMeta: "Open-source",
    abacateDescription: "Método de pagamento open-source para o Brasil.",
  },
  EN: {
    imageAlt: "Photo of Matheus Cardoso",
    openPhoto: "Expand profile photo",
    closePhoto: "Close photo",
    title: "Software Engineer",
    projects: "Projects",
    writing: "Writing",
    copyEmail: "Copy email",
    kuboMeta: "Live",
    kuboDescription: "Food service platform, from order to kitchen.",
    abacateMeta: "Open-source",
    abacateDescription: "Open-source payment method built for Brazil.",
  },
  ES: {
    imageAlt: "Foto de Matheus Cardoso",
    openPhoto: "Ampliar la foto de perfil",
    closePhoto: "Cerrar la foto",
    title: "Ingeniero de Software",
    projects: "Proyectos",
    writing: "Escritura",
    copyEmail: "Copiar correo",
    kuboMeta: "En vivo",
    kuboDescription: "Plataforma de food service, del pedido a la cocina.",
    abacateMeta: "Open-source",
    abacateDescription: "Método de pago open-source hecho para Brasil.",
  },
}

function CopyEmailButton({ label }: { label: string }) {
  const [open, setOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const resetTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const shouldReduceMotion = useReducedMotion()

  React.useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    }
  }, [])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
      resetTimeoutRef.current = setTimeout(() => setCopied(false), 150)
    }
  }

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setOpen(true)

    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    resetTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }, [])

  const contentTransition = shouldReduceMotion
    ? { duration: 0.12 }
    : { type: "spring" as const, duration: 0.45, bounce: 0.08 }

  return (
    <TooltipProvider delayDuration={300}>
      <TooltipPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild>
          <button
            type="button"
            id="email"
            onClick={handleCopy}
            className="cursor-pointer transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
            aria-label={label}
          >
            <Mail className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8} className="overflow-hidden px-2.5 py-1.5">
          <motion.div
            layout
            transition={contentTransition}
            className="flex items-center justify-center"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  layout
                  initial={{ opacity: 0, scale: 0.88, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.88, filter: "blur(6px)" }}
                  transition={contentTransition}
                  className="flex items-center justify-center"
                >
                  <Check className="size-3.5" strokeWidth={2.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="label"
                  layout
                  initial={{ opacity: 0, scale: 0.88, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.88, filter: "blur(6px)" }}
                  transition={contentTransition}
                  className="whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </TooltipContent>
      </TooltipPrimitive.Root>
    </TooltipProvider>
  )
}

function SectionDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      style={{ animationDelay: "80ms" }}
      className={`fade-in h-px w-full bg-[length:4px_1px] bg-[linear-gradient(90deg,transparent_2px,#d4d4d8_2px,transparent_4px)] dark:bg-[linear-gradient(90deg,transparent_2px,#3a3a3a_2px,transparent_4px)] ${className ?? ""}`}
    />
  )
}

const GITHUB_URL = "https://github.com/matheuscarddoso"

type BioParagraphs = (
  link: string,
  locale: string,
  lang: Language,
  github: GithubCardData | null
) => React.ReactNode

const bio: Record<Language, BioParagraphs> = {
  PT: (link, locale, lang, github) => (
    <>
      <p className="paragraph mb-3">
        Atualmente trabalho na <BioLink href="https://app.4selet.com" target="_blank" className={link} rel="noopener noreferrer">4Selet</BioLink> e na <BioLink href="https://zero7.com.br/home" target="_blank" className={link} rel="noopener noreferrer">Zero7</BioLink>, e meu maior projeto open-source é na <BioLink href="https://www.abacatepay.com/" target="_blank" className={link} rel="noopener noreferrer">Abacate Pay</BioLink>. Me importo com a <span className="font-display">construção</span>, <span className="font-display">detalhes</span> e em fazer interfaces <span className="font-display">parecerem corretas</span>.
      </p>
      <p className="paragraph mb-3">
        Anteriormente, colaborei com <BioLink href="https://www.goiasec.com.br/" target="_blank" className={link} rel="noopener noreferrer">Goiás F.C.</BioLink> e outros. Faço curadoria de <PlaylistLink language={lang} className={link} href={`/${locale}/monthly-playlists`}>playlists</PlaylistLink> todo mês e corro todo dia.
      </p>
      <p className="paragraph">
        Você pode me encontrar no <a href="https://x.com/mattcrdoso" target="_blank" rel="noopener noreferrer" className={link}>X</a> e por <a href="mailto:mathuscardoso@gmail.com" className={link}>email</a>, ou ver meu código no <GithubLink data={github} language={lang} href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={link}>GitHub</GithubLink>.
      </p>
    </>
  ),
  EN: (link, locale, lang, github) => (
    <>
      <p className="paragraph mb-3">
        I&apos;m currently working at <BioLink href="https://app.4selet.com" target="_blank" className={link} rel="noopener noreferrer">4Selet</BioLink> and <BioLink href="https://zero7.com.br/home" target="_blank" className={link} rel="noopener noreferrer">Zero7</BioLink>, and my biggest open-source project is at <BioLink href="https://www.abacatepay.com/" target="_blank" className={link} rel="noopener noreferrer">Abacate Pay</BioLink>. I care deeply about <span className="font-display">craft</span>, <span className="font-display">detail</span>, and making interfaces <span className="font-display">feel right</span>.
      </p>
      <p className="paragraph mb-3">
        Previously, I collaborated with <BioLink href="https://www.goiasec.com.br/" target="_blank" className={link} rel="noopener noreferrer">Goiás F.C.</BioLink> and others. I curate <PlaylistLink language={lang} className={link} href={`/${locale}/monthly-playlists`}>playlists</PlaylistLink> every month and run every day.
      </p>
      <p className="paragraph">
        You can reach me on <a href="https://x.com/mattcrdoso" target="_blank" rel="noopener noreferrer" className={link}>X</a> and via <a href="mailto:mathuscardoso@gmail.com" className={link}>email</a>, or see my code on <GithubLink data={github} language={lang} href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={link}>GitHub</GithubLink>.
      </p>
    </>
  ),
  ES: (link, locale, lang, github) => (
    <>
      <p className="paragraph mb-3">
        Actualmente trabajo en <BioLink href="https://app.4selet.com" target="_blank" className={link} rel="noopener noreferrer">4Selet</BioLink> y <BioLink href="https://zero7.com.br/home" target="_blank" className={link} rel="noopener noreferrer">Zero7</BioLink>, y mi mayor proyecto open-source es en <BioLink href="https://www.abacatepay.com/" target="_blank" className={link} rel="noopener noreferrer">Abacate Pay</BioLink>. Me importa el <span className="font-display">craft</span>, el <span className="font-display">detalle</span> y hacer que las interfaces se <span className="font-display">sientan bien</span>.
      </p>
      <p className="paragraph mb-3">
        Anteriormente, colaboré con <BioLink href="https://www.goiasec.com.br/" target="_blank" className={link} rel="noopener noreferrer">Goiás F.C.</BioLink> y otros. Hago curaduría de <PlaylistLink language={lang} className={link} href={`/${locale}/monthly-playlists`}>playlists</PlaylistLink> cada mes y corro todos los días.
      </p>
      <p className="paragraph">
        Puedes encontrarme en <a href="https://x.com/mattcrdoso" target="_blank" rel="noopener noreferrer" className={link}>X</a> y por <a href="mailto:mathuscardoso@gmail.com" className={link}>email</a>, o ver mi código en <GithubLink data={github} language={lang} href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={link}>GitHub</GithubLink>.
      </p>
    </>
  ),
}

export function HomeContent({ github }: { github: GithubCardData | null }) {
  const params = useParams()
  const router = useRouter()
  const locale = (params.locale as string) ?? 'en'
  const language: Language = localeToLanguage(locale)
  const t = translations[language]

  const linkClass = "article-underline"

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-hidden">
      <CommitHeatmap />
      <main className="mx-auto flex w-full max-w-(--breakpoint-sm) flex-1 flex-col px-4 pt-20 pb-4 dark:text-[#b4b4b4] text-gray-600">
        <div className="mb-8 mt-4 flex items-center gap-4 text-black dark:text-white">
          <a href={GITHUB_URL} id="github" target="_blank" rel="noopener noreferrer" aria-label={`GitHub`} className="inline-flex transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] motion-reduce:active:scale-100">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1024" className="w-4 h-4" height="1024" fill="none"><path fill="currentColor" fillRule="evenodd" d="M512 0C229.12 0 0 229.12 0 512c0 226.56 146.56 417.92 350.08 485.76 25.6 4.48 35.2-10.88 35.2-24.32 0-12.16-.64-52.48-.64-95.36-128.64 23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92 40.32-.64 69.12 37.12 78.72 52.48 46.08 77.44 119.68 55.68 149.12 42.24 4.48-33.28 17.92-55.68 32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8 0-55.68 19.84-101.76 52.48-137.6-5.12-12.8-23.04-65.28 5.12-135.68 0 0 42.88-13.44 140.8 52.48 40.96-11.52 84.48-17.28 128-17.28s87.04 5.76 128 17.28c97.92-66.56 140.8-52.48 140.8-52.48 28.16 70.4 10.24 122.88 5.12 135.68 32.64 35.84 52.48 81.28 52.48 137.6 0 196.48-119.68 240-233.6 252.8 18.56 16 34.56 46.72 34.56 94.72 0 68.48-.64 123.52-.64 140.8 0 13.44 9.6 29.44 35.2 24.32C877.44 929.92 1024 737.92 1024 512 1024 229.12 794.88 0 512 0" clipRule="evenodd"/></svg>
          </a>
          <a href="https://x.com/mattcrdoso" id="twitter" target="_blank" rel="noopener noreferrer" aria-label={`X`} className="inline-flex transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] motion-reduce:active:scale-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="1200" className="w-3 h-3" height="1227" fill="none" viewBox="0 0 1200 1227"><path fill="currentColor" d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"/></svg>
          </a>
          <a href="https://stackoverflow.com/users/18957537/matheus-cardoso" id="stackoverflow" target="_blank" rel="noopener noreferrer" aria-label={`Stack Overflow`} className="inline-flex transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] motion-reduce:active:scale-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 169.61 200" width="2120" className="w-4 h-4" height="2500"><path d="M140.44 178.38v-48.65h21.61V200H0v-70.27h21.61v48.65z" fill="currentColor"/><path d="M124.24 140.54l4.32-16.22-86.97-17.83-3.78 17.83zM49.7 82.16L130.72 120l7.56-16.22-81.02-37.83zm22.68-40l68.06 57.3 11.35-13.51-68.6-57.3-11.35 13.51zM116.14 0l-14.59 10.81 53.48 71.89 14.58-10.81zM37.81 162.16h86.43v-16.21H37.81z" fill="currentColor"/></svg>
          </a>
          <CopyEmailButton label={t.copyEmail} />
          <ToggleSeparator />
          <LanguageToggle
            language={language}
            onLanguageChange={(lang) => router.push(`/${languageToLocale[lang]}`, { scroll: false })}
          />
          <ThemeToggle language={language} />
        </div>
        
        <div className="relative z-10 mb-8 flex items-center">
          <div className="relative z-10">
            <AvatarLightbox
              src="/profile.png"
              alt={t.imageAlt}
              triggerLabel={t.openPhoto}
              closeLabel={t.closePhoto}
            />
          </div>
          <div className="ml-4">
            <h1 className="font-semibold text-gray-1200 leading-snug text-lg">
              <a href={`/${locale}`}>Matheus Cardoso</a>
            </h1>
            <p className="whitespace-nowrap font-medium text-gray-1100 leading-snug">
              <span>{t.title}</span>
            </p>
          </div>
        </div>

        {bio[language](linkClass, locale, language, github)}

        <SectionDivider className="my-10" />

        <div className="w-full">
          <div className="mb-5 flex w-full items-center font-medium text-gray-1200">{t.projects}</div>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <ProjectCard
              href="https://kubofood.app"
              ariaLabel="Visit KuboFood"
              title="KuboFood"
              meta={t.kuboMeta}
              description={t.kuboDescription}
              preview={<KuboPreview />}
            />
            <ProjectCard
              href="https://github.com/abacatepay"
              ariaLabel="Visit Abacate Pay on GitHub"
              title="Abacate Pay"
              meta={t.abacateMeta}
              description={t.abacateDescription}
              preview={<AbacatePreview />}
            />
          </div>
        </div>

        <SectionDivider className="my-10" />

        <div className="mb-4">
          <div className="mb-2 flex w-full items-center font-medium text-gray-1200">{t.writing}</div>
          <WorkList language={language} locale={locale} />
        </div>
      </main>
      {/* Toggles live in the header on this page. */}
      <Footer language={language} showToggles={false} />
    </div>
  )
}

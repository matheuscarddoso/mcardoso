"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { AvatarLightbox } from "@/components/avatar-lightbox"
import { Footer, type Language } from "@/components/footer"
import { AbacatePreview, KuboPreview, ProjectCard } from "@/components/project-card"
import { WorkList } from "@/components/work-list"
import { CommitHeatmap } from "@/components/commit-heatmap"
import { LanguageToggle, ThemeToggle, ToggleSeparator } from "@/components/toggles"
import { BioLink, GithubLink, PlaylistLink } from "@/components/link-preview"
import { SocialLinks } from "@/components/social-links"
import { SectionDivider } from "@/components/section-divider"
import { localeToLanguage } from "@/lib/locale"
import { switchLocale } from "@/lib/switch-locale"
import { HEADER_SOCIAL } from "@/lib/site"
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
            // Same -m-2/p-2 trick as the social row: a 32px touch target that
            // grows into the gap instead of widening the layout.
            className="-m-2 cursor-pointer p-2 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
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
        Atualmente trabalho na <BioLink href="https://4selet.com.br" target="_blank" className={link} rel="noopener noreferrer">4Selet</BioLink> e na <BioLink href="https://zero7.com.br/home" target="_blank" className={link} rel="noopener noreferrer">Zero7</BioLink>, e meu maior projeto open-source é na <BioLink href="https://www.abacatepay.com/" target="_blank" className={link} rel="noopener noreferrer">Abacate Pay</BioLink>. Me importo com a <span className="font-display">construção</span>, <span className="font-display">detalhes</span> e em fazer interfaces <span className="font-display">parecerem corretas</span>.
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
        I&apos;m currently working at <BioLink href="https://4selet.com.br" target="_blank" className={link} rel="noopener noreferrer">4Selet</BioLink> and <BioLink href="https://zero7.com.br/home" target="_blank" className={link} rel="noopener noreferrer">Zero7</BioLink>, and my biggest open-source project is at <BioLink href="https://www.abacatepay.com/" target="_blank" className={link} rel="noopener noreferrer">Abacate Pay</BioLink>. I care deeply about <span className="font-display">craft</span>, <span className="font-display">detail</span>, and making interfaces <span className="font-display">feel right</span>.
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
        Actualmente trabajo en <BioLink href="https://4selet.com.br" target="_blank" className={link} rel="noopener noreferrer">4Selet</BioLink> y <BioLink href="https://zero7.com.br/home" target="_blank" className={link} rel="noopener noreferrer">Zero7</BioLink>, y mi mayor proyecto open-source es en <BioLink href="https://www.abacatepay.com/" target="_blank" className={link} rel="noopener noreferrer">Abacate Pay</BioLink>. Me importa el <span className="font-display">craft</span>, el <span className="font-display">detalle</span> y hacer que las interfaces se <span className="font-display">sientan bien</span>.
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
  const locale = (params.locale as string) ?? 'en'
  const language: Language = localeToLanguage(locale)
  const t = translations[language]

  const linkClass = "article-underline"

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-hidden">
      <CommitHeatmap />
      <main className="mx-auto flex w-full max-w-(--breakpoint-sm) flex-1 flex-col px-4 pt-20 pb-4 dark:text-[#b4b4b4] text-gray-600">
        <div className="mb-8 mt-4 flex items-center gap-4 text-black dark:text-white">
          <SocialLinks include={HEADER_SOCIAL} />
          <CopyEmailButton label={t.copyEmail} />
          <ToggleSeparator />
          <LanguageToggle
            language={language}
            onLanguageChange={switchLocale}
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
              <Link href={`/${locale}`}>Matheus Cardoso</Link>
            </h1>
            {/* No `whitespace-nowrap`: the Portuguese and Spanish roles are
                the longest strings on the page, and a 320px viewport has to
                wrap them rather than push the column sideways. */}
            <p className="font-medium text-gray-1100 leading-snug">{t.title}</p>
          </div>
        </div>

        {bio[language](linkClass, locale, language, github)}

        <SectionDivider className="my-10" />

        {/* `section` + `ul`: two projects and five essays are lists, and saying
            so is what lets a crawler tell the page's structure from its chrome. */}
        <section aria-labelledby="projects-heading" className="w-full">
          <h2
            id="projects-heading"
            className="mb-5 flex w-full items-center font-medium text-gray-1200"
          >
            {t.projects}
          </h2>
          <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <li className="flex">
              <ProjectCard
                href="https://kubofood.app"
                ariaLabel="Visit KuboFood"
                title="KuboFood"
                meta={t.kuboMeta}
                description={t.kuboDescription}
                preview={<KuboPreview />}
              />
            </li>
            <li className="flex">
              <ProjectCard
                href="https://github.com/abacatepay"
                ariaLabel="Visit Abacate Pay on GitHub"
                title="Abacate Pay"
                meta={t.abacateMeta}
                description={t.abacateDescription}
                preview={<AbacatePreview />}
              />
            </li>
          </ul>
        </section>

        <SectionDivider className="my-10" />

        <section aria-labelledby="writing-heading" className="mb-4">
          <h2
            id="writing-heading"
            className="mb-2 flex w-full items-center font-medium text-gray-1200"
          >
            {t.writing}
          </h2>
          <WorkList language={language} locale={locale} />
        </section>
      </main>
      {/* Both toggles live in the header on this page. */}
      <Footer language={language} showLanguageToggle={false} showThemeToggle={false} />
    </div>
  )
}

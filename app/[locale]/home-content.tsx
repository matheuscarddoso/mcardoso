"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { AvatarLightbox } from "@/components/avatar-lightbox"
import { Footer, type Language } from "@/components/footer"
import { AbacatePreview, KuboPreview, ProjectCard } from "@/components/project-card"
import { WorkList } from "@/components/work-list"
import { ContributionGraph } from "@/components/contribution-graph"
import { LanguageToggle, ThemeToggle } from "@/components/toggles"
import { BioLink, GithubLink, HoverPreview, PlaylistLink } from "@/components/link-preview"
import { SocialLinks } from "@/components/social-links"
import { SectionDivider } from "@/components/section-divider"
import { localeToLanguage } from "@/lib/locale"
import { switchLocale } from "@/lib/switch-locale"
import { HEADER_SOCIAL } from "@/lib/site"
import type { ContributionYear, GithubCardData } from "@/lib/github"
import { VerifiedBadge } from "@/components/verified-badge"
import { BrandMark } from "@/components/brand-marks"
import { AvatarStack } from "@/components/avatar-stack"
import { PhotoDeck } from "@/components/photo-deck"
import { FileTextIcon } from "@/components/file-text-icon"
import { DOCUMENT_PANEL_ID, useDocumentPanel } from "@/components/document-panel"
import { Check, Copy, Mail } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

const EMAIL = "mathuscardoso@gmail.com"

const translations = {
  PT: {
    imageAlt: "Foto de Matheus Cardoso",
    openPhoto: "Ampliar a foto de perfil",
    closePhoto: "Fechar a foto",
    title: "Engenheiro de Software",
    projects: "Projetos",
    contributions: "Contribuições",
    writing: "Escrita",
    elsewhere: "Por aí",
    copyEmail: "Copiar e-mail",
    copy: "Copiar",
    copied: "Copiado!",
    verified: "Perfil verificado",
    resume: "Currículo",
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
    contributions: "Contributions",
    writing: "Writing",
    elsewhere: "Elsewhere",
    copyEmail: "Copy email",
    copy: "Copy",
    copied: "Copied!",
    verified: "Verified profile",
    resume: "Resume",
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
    contributions: "Contribuciones",
    writing: "Escritura",
    elsewhere: "Por ahí",
    copyEmail: "Copiar correo",
    copy: "Copiar",
    copied: "¡Copiado!",
    verified: "Perfil verificado",
    resume: "Currículum",
    kuboMeta: "En vivo",
    kuboDescription: "Plataforma de food service, del pedido a la cocina.",
    abacateMeta: "Open-source",
    abacateDescription: "Método de pago open-source hecho para Brasil.",
  },
}

/**
 * The same spring the theme toggle swaps its icon on, so the two controls
 * sitting a few pixels apart in the header behave identically.
 */
const ICON_SWAP = { type: "spring" as const, duration: 0.35, bounce: 0.15 }

/** Barely any bounce on the box, which is only absorbing a width change. */
const BOX = { type: "spring" as const, duration: 0.34, bounce: 0 }

function CopyEmailButton({
  ariaLabel,
  copyLabel,
  copiedLabel,
}: {
  ariaLabel: string
  copyLabel: string
  copiedLabel: string
}) {
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
    // Reset only once the card is on its way out, so the tick never flips back
    // to the copy glyph while it is still under the pointer.
    if (!next) {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
      resetTimeoutRef.current = setTimeout(() => setCopied(false), 150)
    }
  }

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    // Clicking a control that was already hovered keeps its card up; this
    // covers the tap, where there was never a hover to begin with.
    setOpen(true)

    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    resetTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }, [])

  const swap = shouldReduceMotion ? { duration: 0.12 } : ICON_SWAP
  const box = shouldReduceMotion ? { duration: 0.12 } : BOX

  // Blur bridges the two glyphs: without it the eye catches two separate marks
  // crossing over each other rather than one becoming the other.
  const hidden = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.6, filter: "blur(4px)" }

  const trigger = (
    <button
      type="button"
      id="email"
      onClick={handleCopy}
      // Same -m-2/p-2 trick as the social row: a 32px touch target that
      // grows into the gap instead of widening the layout.
      className="-m-2 cursor-pointer p-2 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] motion-reduce:active:scale-100"
      aria-label={ariaLabel}
    >
      <Mail className="h-4 w-4" />
    </button>
  )

  return (
    /*
     * Controlled, and `width="auto"` rather than a number: this is the one
     * card on the page whose contents change while it is open, so it has to
     * stay up after the click and size itself to whichever label is showing.
     */
    <HoverPreview
      width="auto"
      open={open}
      onOpenChange={handleOpenChange}
      openDelay={150}
      trigger={trigger}
    >
      <motion.div
        layout
        transition={box}
        className="flex w-fit items-center gap-1.5 rounded-lg bg-preview-bg py-1.5 pr-2.5 pl-2 shadow-card-lift"
      >
        <span className="relative grid size-4 shrink-0 place-items-center">
          <AnimatePresence initial={false}>
            <motion.span
              key={copied ? "done" : "copy"}
              initial={hidden}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={hidden}
              transition={swap}
              className="absolute inset-0 grid place-items-center"
            >
              {copied ? (
                /* Composed rather than a single lucide glyph: its tick is
                   stroked in the same colour as its ring, and this wants a
                   filled green disc with the tick knocked out in white. */
                <span className="grid size-4 place-items-center rounded-full bg-[#22c55e]">
                  <Check className="size-2.5 text-white" strokeWidth={3.5} />
                </span>
              ) : (
                <Copy className="size-3.5 text-gray-1100" strokeWidth={1.75} />
              )}
            </motion.span>
          </AnimatePresence>
        </span>
        {/* `popLayout` takes the outgoing word out of flow, so the box measures
            the incoming one and resizes with it rather than after it. */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "copied" : "copy"}
            layout
            initial={hidden}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={hidden}
            transition={swap}
            className="text-xs font-medium whitespace-nowrap text-gray-1200"
          >
            {copied ? copiedLabel : copyLabel}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </HoverPreview>
  )
}

const GITHUB_URL = "https://github.com/matheuscarddoso"

/**
 * Two documents, not one translated label: the Portuguese file is a currículo
 * written in Portuguese, and the other is the English résumé. Spanish readers
 * get the English one because a Spanish version doesn't exist yet — better a
 * document they can read than a link to one they can't.
 */
const CV: Record<Language, string> = {
  PT: "/cv/matheus-cardoso-curriculo.pdf",
  EN: "/cv/matheus-cardoso-resume.pdf",
  ES: "/cv/matheus-cardoso-resume.pdf",
}

/**
 * Opens the PDF rather than forcing a download: a résumé is read before it is
 * kept, and the browser's own viewer already offers to save it.
 *
 * Painted with the inverted pair rather than a literal black: `gray-1200` is
 * this palette's strongest ink and `preview-bg` its paper, so the button is
 * near-black on white in the light theme and flips to near-white on black in
 * the dark one. A hard-coded black would sink into a #111 page.
 */
function ResumeButton({ language, label }: { language: Language; label: string }) {
  const { canOpen, openSrc, toggle } = useDocumentPanel()
  const src = CV[language]
  const isOpen = openSrc === src

  /*
   * Intercepts the plain left click and nothing else. A modified click is the
   * reader asking for a tab or a window, and `canOpen` is false on any
   * viewport too narrow to host the split, so both fall through to the anchor.
   */
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!canOpen) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return

    event.preventDefault()
    toggle({
      title: label,
      label: "PDF",
      src,
      filename: src.split("/").pop() ?? "curriculo.pdf",
    })
  }

  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      /*
       * Announced as a toggle only where it behaves like one. Below the split
       * it is a plain link to a file, and claiming it expands a panel that
       * cannot open would be a lie to a screen reader.
       */
      aria-expanded={canOpen ? isOpen : undefined}
      aria-controls={canOpen ? DOCUMENT_PANEL_ID : undefined}
      className="inline-flex w-fit items-center gap-2 rounded-xl bg-gray-1200 py-2 pr-3.5 pl-3 text-sm font-medium text-preview-bg shadow-custom transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-strong)] hover:scale-[1.02] hover:shadow-card-lift active:scale-[0.98] motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
    >
      {/* No colour of its own — it takes the button's ink. */}
      <FileTextIcon aria-hidden loop size={18} className="shrink-0" />
      {label}
    </a>
  )
}

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
        Sou engenheiro de software na <BioLink href="https://4selet.com.br" target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="4selet" />4Selet</BioLink> e na <BioLink href="https://zero7.com.br/home" target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="zero7" />Zero7</BioLink>. Construo fluxo de pagamento: checkout, cobrança, repasse. O <span className="font-display">caminho feliz</span> é a parte fácil. O trabalho é quando falha, duplica ou chega fora de ordem.
      </p>
      <p className="paragraph mb-3">
        Meu maior open-source é a <BioLink href="https://www.abacatepay.com/" target="_blank" rel="noopener noreferrer" className={link}><span aria-hidden className="brand-mark inline-block" style={{ marginRight: "0.3em" }}>🥑</span>Abacate Pay</BioLink>, feita no Brasil por <AvatarStack /> 23 devs. Também construo o <BioLink href="https://kubofood.app" target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="kubo" />KuboFood</BioLink>, do pedido à cozinha.
      </p>
      <p className="paragraph mb-3">
        Antes, <BioLink href="https://www.goiasec.com.br/" target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="goias" />Goiás F.C.</BioLink> Monto uma <PlaylistLink language={lang} className={link} href={`/${locale}/monthly-playlists`}><BrandMark name="spotify" />playlist</PlaylistLink> por mês e corro todo dia. Me acha no <a href="https://x.com/mattcrdoso" target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="twitter" />Twitter</a>, no <a href="mailto:mathuscardoso@gmail.com" className={link}>email</a> ou no <GithubLink data={github} language={lang} href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="github" />GitHub</GithubLink>.
      </p>
    </>
  ),
  EN: (link, locale, lang, github) => (
    <>
      <p className="paragraph mb-3">
        I&apos;m a software engineer at <BioLink href="https://4selet.com.br" target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="4selet" />4Selet</BioLink> and <BioLink href="https://zero7.com.br/home" target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="zero7" />Zero7</BioLink>. I build payment flows: checkout, billing, payouts. The <span className="font-display">happy path</span> is the easy part. The work is when a charge fails, fires twice or arrives out of order.
      </p>
      <p className="paragraph mb-3">
        My biggest open source is <BioLink href="https://www.abacatepay.com/" target="_blank" rel="noopener noreferrer" className={link}><span aria-hidden className="brand-mark inline-block" style={{ marginRight: "0.3em" }}>🥑</span>Abacate Pay</BioLink>, built for Brazil by <AvatarStack /> 23 devs. I also build <BioLink href="https://kubofood.app" target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="kubo" />KuboFood</BioLink>, from the order to the kitchen.
      </p>
      <p className="paragraph mb-3">
        Before that, <BioLink href="https://www.goiasec.com.br/" target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="goias" />Goiás F.C.</BioLink> I make a <PlaylistLink language={lang} className={link} href={`/${locale}/monthly-playlists`}><BrandMark name="spotify" />playlist</PlaylistLink> a month and run every day. Find me on <a href="https://x.com/mattcrdoso" target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="twitter" />Twitter</a>, by <a href="mailto:mathuscardoso@gmail.com" className={link}>email</a> or on <GithubLink data={github} language={lang} href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="github" />GitHub</GithubLink>.
      </p>
    </>
  ),
  ES: (link, locale, lang, github) => (
    <>
      <p className="paragraph mb-3">
        Soy ingeniero de software en <BioLink href="https://4selet.com.br" target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="4selet" />4Selet</BioLink> y <BioLink href="https://zero7.com.br/home" target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="zero7" />Zero7</BioLink>. Construyo flujos de pago: checkout, cobros, pagos. El <span className="font-display">camino feliz</span> es la parte fácil. El trabajo es cuando un cobro falla, se duplica o llega fuera de orden.
      </p>
      <p className="paragraph mb-3">
        Mi mayor open source es <BioLink href="https://www.abacatepay.com/" target="_blank" rel="noopener noreferrer" className={link}><span aria-hidden className="brand-mark inline-block" style={{ marginRight: "0.3em" }}>🥑</span>Abacate Pay</BioLink>, hecha para Brasil por <AvatarStack /> 23 devs. También construyo <BioLink href="https://kubofood.app" target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="kubo" />KuboFood</BioLink>, del pedido a la cocina.
      </p>
      <p className="paragraph mb-3">
        Antes, <BioLink href="https://www.goiasec.com.br/" target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="goias" />Goiás F.C.</BioLink> Armo una <PlaylistLink language={lang} className={link} href={`/${locale}/monthly-playlists`}><BrandMark name="spotify" />playlist</PlaylistLink> al mes y corro todos los días. Encuéntrame en <a href="https://x.com/mattcrdoso" target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="twitter" />Twitter</a>, por <a href="mailto:mathuscardoso@gmail.com" className={link}>email</a> o en <GithubLink data={github} language={lang} href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={link}><BrandMark name="github" />GitHub</GithubLink>.
      </p>
    </>
  ),
}

export function HomeContent({
  github,
  contributions,
}: {
  github: GithubCardData | null
  contributions: ContributionYear | null
}) {
  const params = useParams()
  const locale = (params.locale as string) ?? 'en'
  const language: Language = localeToLanguage(locale)
  const t = translations[language]

  const linkClass = "article-underline"

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-hidden">
      <main className="mx-auto flex w-full max-w-(--breakpoint-sm) flex-1 flex-col px-4 pt-20 pb-4 dark:text-[#b4b4b4] text-gray-600">
        {/* Just the two controls now. No `ToggleSeparator`: with the profile
            links moved down there is nothing left for it to separate. */}
        <div className="mb-8 mt-4 flex items-center gap-4 text-black dark:text-white">
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
            {/* `inline-flex` on the link, not the heading: the badge belongs to
                the name, so it has to sit on the last line if the name wraps. */}
            <h1 className="font-semibold text-gray-1200 leading-snug text-lg">
              <Link href={`/${locale}`} className="inline-flex items-center gap-1">
                Matheus Cardoso
                <VerifiedBadge label={t.verified} />
              </Link>
            </h1>
            {/* No `whitespace-nowrap`: the Portuguese and Spanish roles are
                the longest strings on the page, and a 320px viewport has to
                wrap them rather than push the column sideways. */}
            <p className="font-medium text-gray-1100 leading-snug">{t.title}</p>
          </div>
        </div>

        {bio[language](linkClass, locale, language, github)}

        {/*
          `flex-wrap` with a row gap rather than a bet that it fits: the
          Spanish label is the longest, and it plus five 32px targets lands
          within about ten pixels of a 320px column. When it doesn't fit the
          links drop to their own line instead of pushing the page sideways.
        */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-4">
          <ResumeButton language={language} label={t.resume} />
          <div className="flex items-center gap-4 text-black dark:text-white">
            <SocialLinks include={HEADER_SOCIAL} />
            <CopyEmailButton ariaLabel={t.copyEmail} copyLabel={t.copy} copiedLabel={t.copied} />
          </div>
        </div>

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

        {/* Dropped entirely when the calendar can't be read — an empty grid
            would claim a year of no work rather than a failed fetch. */}
        {contributions && (
          <>
            <SectionDivider className="my-10" />
            <section aria-labelledby="contributions-heading" className="w-full">
              <h2
                id="contributions-heading"
                className="mb-5 flex w-full items-center font-medium text-gray-1200"
              >
                {t.contributions}
              </h2>
              <ContributionGraph data={contributions} language={language} />
            </section>
          </>
        )}

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

        <SectionDivider className="my-10" />

        <section aria-labelledby="elsewhere-heading" className="mb-4 w-full">
          <h2
            id="elsewhere-heading"
            className="mb-2 flex w-full items-center font-medium text-gray-1200"
          >
            {t.elsewhere}
          </h2>
          <PhotoDeck language={language} />
        </section>
      </main>
      {/* Both toggles live in the header on this page. */}
      <Footer language={language} showLanguageToggle={false} showThemeToggle={false} />
    </div>
  )
}

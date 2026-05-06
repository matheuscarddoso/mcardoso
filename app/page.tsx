"use client"
import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/footer"

const translations = {
  PT: {
    imageAlt: "Foto de Matheus Cardoso",
    title: "Engenheiro de Software",
    projects: "Projetos",
    writing: "Escrita",
  },
  EN: {
    imageAlt: "Photo of Matheus Cardoso",
    title: "Software Engineer",
    projects: "Projects",
    writing: "Writing",
  },
  ES: {
    imageAlt: "Foto de Matheus Cardoso",
    title: "Ingeniero de Software",
    projects: "Proyectos",
    writing: "Escritura",
  },
}

const bio = {
  PT: (link: string) => (
    <>
      <p className="paragraph mb-3">
        Atualmente trabalho na <a href="https://app.4selet.com" target="_blank" className={link} rel="noopener noreferrer">4Selet</a> e na <a href="https://zero7.com.br/home" target="_blank" className={link} rel="noopener noreferrer">Zero7</a>, e meu maior projeto open-source é na <a href="https://www.abacatepay.com/" target="_blank" className={link} rel="noopener noreferrer">Abacate Pay</a>. Me importo com a <span className="font-display">construção</span>, <span className="font-display">detalhes</span> e em fazer interfaces <span className="font-display">parecerem corretas</span>.
      </p>
      <p className="paragraph mb-3">
        Anteriormente, colaborei com <a href="https://www.goiasec.com.br/" target="_blank" className={link} rel="noopener noreferrer">Goiás F.C.</a> e outros. Faço curadoria de <a className={link} href="/monthly-playlists">playlists</a> todo mês e corro todo dia.
      </p>
      <p className="paragraph">
        Você pode me encontrar no <a href="https://x.com/mattcrdoso" target="_blank" rel="noopener noreferrer" className={link}>X</a> e por <a href="mailto:matheuscarddoso@icloud.com" className={link}>email</a>, ou ver meu código no <a href="https://github.com/matheuscarddoso" target="_blank" rel="noopener noreferrer" className={link}>GitHub</a>.
      </p>
    </>
  ),
  EN: (link: string) => (
    <>
      <p className="paragraph mb-3">
        I&apos;m currently working at <a href="https://app.4selet.com" target="_blank" className={link} rel="noopener noreferrer">4Selet</a> and <a href="https://zero7.com.br/home" target="_blank" className={link} rel="noopener noreferrer">Zero7</a>, and my biggest open-source project is at <a href="https://www.abacatepay.com/" target="_blank" className={link} rel="noopener noreferrer">Abacate Pay</a>. I care deeply about <span className="font-display">craft</span>, <span className="font-display">detail</span>, and making interfaces <span className="font-display">feel right</span>.
      </p>
      <p className="paragraph mb-3">
        Previously, I collaborated with <a href="https://www.goiasec.com.br/" target="_blank" className={link} rel="noopener noreferrer">Goiás F.C.</a> and others. I curate <a className={link} href="/monthly-playlists">playlists</a> every month and run every day.
      </p>
      <p className="paragraph">
        You can reach me on <a href="https://x.com/mattcrdoso" target="_blank" rel="noopener noreferrer" className={link}>X</a> and via <a href="mailto:matheuscarddoso@icloud.com" className={link}>email</a>, or see my code on <a href="https://github.com/matheuscarddoso" target="_blank" rel="noopener noreferrer" className={link}>GitHub</a>.
      </p>
    </>
  ),
  ES: (link: string) => (
    <>
      <p className="paragraph mb-3">
        Actualmente trabajo en <a href="https://app.4selet.com" target="_blank" className={link} rel="noopener noreferrer">4Selet</a> y <a href="https://zero7.com.br/home" target="_blank" className={link} rel="noopener noreferrer">Zero7</a>, y mi mayor proyecto open-source es en <a href="https://www.abacatepay.com/" target="_blank" className={link} rel="noopener noreferrer">Abacate Pay</a>. Me importa el <span className="font-display">craft</span>, el <span className="font-display">detalle</span> y hacer que las interfaces se <span className="font-display">sientan bien</span>.
      </p>
      <p className="paragraph mb-3">
        Anteriormente, colaboré con <a href="https://www.goiasec.com.br/" target="_blank" className={link} rel="noopener noreferrer">Goiás F.C.</a> y otros. Hago curaduría de <a className={link} href="/monthly-playlists">playlists</a> cada mes y corro todos los días.
      </p>
      <p className="paragraph">
        Puedes encontrarme en <a href="https://x.com/mattcrdoso" target="_blank" rel="noopener noreferrer" className={link}>X</a> y por <a href="mailto:matheuscarddoso@icloud.com" className={link}>email</a>, o ver mi código en <a href="https://github.com/matheuscarddoso" target="_blank" rel="noopener noreferrer" className={link}>GitHub</a>.
      </p>
    </>
  ),
}

export default function Home() {
  const [language, setLanguage] = React.useState<"PT" | "EN" | "ES">("EN")
  const t = translations[language]

  const linkClass = "article-underline hover:text-zinc-900 dark:hover:text-white text-inherit"

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-hidden">
      <main className="mx-auto flex w-full max-w-(--breakpoint-sm) flex-1 flex-col px-4 pt-20 pb-4 dark:text-[#b4b4b4] text-gray-600">
        <div className="relative z-10 mb-8 flex items-center">
          <div className="relative z-10">
            {/* <div className="absolute left-0 top-0 -z-10 flex h-[50px] w-[50px] items-center justify-center rounded-full border border-dashed border-primary-light-6 bg-primary-light-3 p-2 text-center text-[8px] text-primary-light-11 dark:border-primary-dark-6 dark:bg-primary-dark-3 dark:text-primary-dark-11"></div> */}
            <a href="/">
              <div className="z-10 cursor-default">
                <Image src="/profile.png" alt={t.imageAlt} width={47} height={47} className="pointer-events-none h-[47px] w-[47px] rounded-full outline-black/5 outline-offset-2 dark:outline-white/5" />
              </div>
            </a>
          </div>
          <div className="ml-4">
            <h1 className="font-medium text-gray-1200 leading-snug">
              <a href="/">Matheus Cardoso</a>
            </h1>
            <p className="whitespace-nowrap font-medium text-gray-1100 leading-snug">
              <span>{t.title}</span>
            </p>
          </div>
        </div>

        {bio[language](linkClass)}

        <div className="mt-16 w-full sm:mt-32">
          <div className="mb-5 flex w-full items-center font-medium text-gray-1200">{t.projects}</div>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <a
              aria-label="Visit KuboFood"
              className="flex flex-col items-center justify-between overflow-hidden rounded-xl bg-preview-bg shadow-custom transition-shadow duration-200 ease-out hover:shadow-custom-hover"
              target="_blank"
              rel="noopener noreferrer"
              href="https://kubofood.app"
            >
              <div className="relative flex aspect-[192/100] w-full items-center justify-center gap-2">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-preview-bg shadow-custom dark:bg-gray-100">
                <svg viewBox="0 0 567 566" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path d="M425.733 565.064H567V423.799H425.733V565.064Z" fill="currentColor"></path><path d="M0 565.064H284.468V423.799H141.267V141.267H425.733V282.532H284.468V423.799H425.733V284.468H567V0H0V565.064Z" fill="currentColor"></path></svg>
                </div>
              </div>
              <div className="flex w-full flex-col items-start justify-center px-4 pb-4 font-medium">
                <span className="text-foreground dark:text-white">KuboFood</span>
                <span className="font-normal text-gray-1100">Food service platform.</span>
              </div>
            </a>
            <a
              aria-label="Visit Abacate Pay on GitHub"
              className="flex flex-col items-center justify-between overflow-hidden rounded-xl bg-preview-bg shadow-custom transition-shadow duration-200 ease-out hover:shadow-custom-hover"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/abacatepay"
            >
              <div className="relative flex aspect-[192/100] w-full items-center justify-center gap-2">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-preview-bg shadow-custom dark:bg-gray-100">
                  <span className="text-xl">🥑</span>
                </div>
              </div>
              <div className="flex w-full flex-col items-start justify-center px-4 pb-4 font-medium">
                <span className="text-foreground dark:text-white">Abacate Pay</span>
                <span className="font-normal text-gray-1100">Open-source payment method.</span>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-16 sm:mt-32 mb-4">
          <div className="flex w-full items-center font-medium text-gray-1200 mb-2">{t.writing}</div>
          <div className="flex flex-col gap-1">
            <Link
              href="/work/invisible-details"
              className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors duration-200 ease-out hover:bg-secondary"
            >
              <div className="relative flex h-13 w-11 shrink-0 select-none items-center justify-center overflow-hidden rounded-md bg-preview-bg shadow-custom"><div className="flex h-full w-full items-center justify-center"><div className="flex flex-col items-center gap-0.5"><div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div><div className="flex gap-0.5"><div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div><div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div></div><div className="flex gap-0.5"><div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div><div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div><div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div></div></div></div></div>
              <div className="flex flex-col">
                <span className="font-[450] text-foreground">{language === "PT" ? "Detalhes invisíveis" : language === "ES" ? "Detalles invisibles" : "Invisible details"}</span>
                <span className="text-sm text-muted-foreground">Mar 2026</span>
              </div>
            </Link>
            <Link
              href="/work/oklch-colors"
              className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors duration-200 ease-out hover:bg-secondary"
            >
              <div className="relative flex h-13 w-11 shrink-0 select-none items-center justify-center overflow-hidden rounded-md bg-preview-bg shadow-custom"><div className="flex h-full w-full flex-col items-start justify-center gap-1 p-1"><div className="flex h-full w-full flex-col justify-start gap-1"><span className="mt-0.5 h-[3px] w-4 rounded-full bg-gray-400"></span><span className="mt-1 h-[3px] w-8 rounded-full bg-gray-400"></span><span className="h-[3px] w-6 rounded-full bg-gray-400"></span><span className="mt-1 h-[3px] w-5 rounded-full bg-gray-400"></span><span className="h-[3px] w-3 rounded-full bg-gray-400"></span></div></div></div>
              <div className="flex flex-col">
                <span className="font-[450] text-foreground">{language === "PT" ? "O que são cores OKLCH?" : language === "ES" ? "¿Qué son los colores OKLCH?" : "What are OKLCH colors?"}</span>
                <span className="text-sm text-muted-foreground">Mar 2026</span>
              </div>
            </Link>
            <Link
              href="/work/saving-claude-tokens"
              className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors duration-200 ease-out hover:bg-secondary"
            >
              <div className="relative flex h-13 w-11 shrink-0 select-none items-center justify-center overflow-hidden rounded-md bg-preview-bg shadow-custom"><div className="flex h-full w-full flex-col items-start justify-center gap-[3px] px-2 py-2"><div className="h-[2px] w-7 rounded-full bg-gray-400"></div><div className="h-[2px] w-6 rounded-full bg-gray-400"></div><div className="h-[2px] w-5 rounded-full bg-gray-400"></div><div className="mt-[3px] h-[2px] w-4 rounded-full bg-gray-500"></div><div className="h-[2px] w-3 rounded-full bg-gray-500"></div><div className="h-[2px] w-2 rounded-full bg-gray-500"></div></div></div>
              <div className="flex flex-col">
                <span className="font-[450] text-foreground">{language === "PT" ? "Como economizar tokens do Claude Code" : language === "ES" ? "Cómo ahorrar tokens de Claude Code" : "How to save Claude Code tokens"}</span>
                <span className="text-sm text-muted-foreground">May 2026</span>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <Footer language={language} onLanguageChange={setLanguage} />
    </div>
  );
}

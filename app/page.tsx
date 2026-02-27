"use client"
import * as React from "react"
import Image from "next/image"
import { Footer } from "@/components/footer"

const translations = {
  PT: {
    imageAlt: "Foto de Matheus Cardoso",
    title: "Engenheiro de Software",
    description: "Construindo software com foco em design, detalhe e funcionalidade.",
    currentlyWorking: "Atualmente trabalhando na",
    platformDescription: "uma plataforma para vender infoprodutos online. Colaborações recentes incluem:",
    someWork: "Alguns dos meus trabalhos:",
    shareNotes: "Compartilho notas e atualizações no",
    andOpenSource: "e código open-source no",
    curate: "Faço curadoria de",
    playlists: "playlists",
    everyMonth: "todo mês",
    and: "e",
    run: "corro",
    everyDay: "todo dia",
    forCollaborations: "Para colaborações, entre em contato em",
    santaMartaLabel: "Santa Marta (encerrada)",
    rodeRotasLabel: "Rode Rotas (encerrada)",
    system: "Sistema",
    dark: "Escuro",
    light: "Claro",
  },
  EN: {
    imageAlt: "Photo of Matheus Cardoso",
    title: "Software Engineer",
    description: "Building software with a focus on design, detail, and function.",
    currentlyWorking: "Currently working at",
    platformDescription: "a platform to sell info-products online. Recent collaborations include:",
    someWork: "Some of my work:",
    shareNotes: "I share notes and updates on",
    andOpenSource: "and open-source code on",
    curate: "I curate",
    playlists: "playlists",
    everyMonth: "every month",
    and: "and",
    run: "run",
    everyDay: "every day",
    forCollaborations: "For collaborations, reach at",
    santaMartaLabel: "Santa Marta (former, closed)",
    rodeRotasLabel: "Rode Rotas (closed)",
    system: "System",
    dark: "Dark",
    light: "Light",
  },
  ES: {
    imageAlt: "Foto de Matheus Cardoso",
    title: "Ingeniero de Software",
    description: "Construyendo software con enfoque en diseño, detalle y funcionalidad.",
    currentlyWorking: "Actualmente trabajando en",
    platformDescription: "una plataforma para vender infoproductos en línea. Colaboraciones recientes incluyen:",
    someWork: "Algunos de mis trabajos:",
    shareNotes: "Comparto notas y actualizaciones en",
    andOpenSource: "y código open-source en",
    curate: "Hago curaduría de",
    playlists: "playlists",
    everyMonth: "cada mes",
    and: "y",
    run: "corro",
    everyDay: "todos los días",
    forCollaborations: "Para colaboraciones, contacta en",
    santaMartaLabel: "Santa Marta (antigua, cerrada)",
    rodeRotasLabel: "Rode Rotas (cerrada)",
    system: "Sistema",
    dark: "Oscuro",
    light: "Claro",
  },
}

export default function Home() {
  const [language, setLanguage] = React.useState<"PT" | "EN" | "ES">("EN")
  const githubUrl = "https://github.com/matheuscarddoso"
  const xUrl = "https://x.com/mattcrdoso"
  const email = "matheuscarddoso@icloud.com"
  const zero7Url = "https://zero7.com.br/home"
  const santaMartaUrl = "https://instagram.com/drogariasantamarta"
  const rodeRotasUrl = "https://www.roderotas.com/"
  const t = translations[language]

  const linkClass =
    "underline decoration-dotted underline-offset-2 transition-colors hover:text-zinc-900 dark:hover:text-white text-inherit"

  return (
    <div className="relative flex min-h-[100dvh] w-screen flex-col">
      <main className="mx-auto flex w-full max-w-(--breakpoint-sm) flex-1 flex-col px-4 pt-20 pb-4 dark:text-[#b4b4b4] text-gray-600">
        <div className="relative z-10 mb-16 flex items-center">
          <div className="relative z-10">
            <div className="absolute left-0 top-0 -z-10 flex h-[50px] w-[50px] items-center justify-center rounded-full border border-dashed border-primary-light-6 bg-primary-light-3 p-2 text-center text-[8px] text-primary-light-11 dark:border-primary-dark-6 dark:bg-primary-dark-3 dark:text-primary-dark-11"></div>
            <a href="/">
              <div className="z-10 cursor-default">
                <Image src="/profile.png" alt={t.imageAlt} width={50} height={50} className="pointer-events-none h-[50px] w-[50px] rounded-full" />
              </div>
            </a>
          </div>
          <div className="ml-4">
            <h1 className="text-md leading-5 font-medium tracking-tight text-zinc-900 dark:text-[#b4b4b4]">
              <a href="/">Matheus Cardoso</a>
            </h1>
            <p className="leading-5 text-md group font-normal relative inline-flex items-center justify-center overflow-hidden transition text-zinc-500 dark:text-zinc-400">
              <span>{t.title}</span>
            </p>
          </div>
        </div>
        <div aria-labelledby="about-me">
          <p className="paragraph mb-3">{t.description}</p>
          <p className="paragraph mb-3 text-balance">
            {t.currentlyWorking} <a href="https://app.4selet.com" target="_blank" className={linkClass} rel="noopener noreferrer">4Selet</a>, {t.platformDescription} <a href={zero7Url} target="_blank" className={linkClass} rel="noopener noreferrer">Zero7 Mesa Proprietária</a>, <a href="https://www.abacatepay.com/" className={linkClass} rel="noopener noreferrer">Abacate Pay</a>, <a href="https://www.goiasec.com.br/" className={linkClass} rel="noopener noreferrer">Goiás F.C.</a>, <a href={santaMartaUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>{t.santaMartaLabel}</a>, {t.and} <a href={rodeRotasUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>{t.rodeRotasLabel}</a>.
          </p>
        </div>
        <p className="paragraph mb-4">{t.someWork}</p>
        <ul className="paragraph mb-4 list-inside list-disc space-y-1">
          <li>
            <a href="https://www.4selet.com/" className={linkClass} rel="noopener noreferrer">4Selet</a> - Goiânia, Brazil
          </li>
          <li>
            <a href={zero7Url} target="_blank" className={linkClass} rel="noopener noreferrer">Zero7 Mesa Proprietária</a> - Goiânia, Brazil
          </li>
          <li>
            <a href="https://www.abacatepay.com/" className={linkClass} rel="noopener noreferrer">Abacate Pay</a> - São Paulo, Brazil
          </li>
          <li>
            <a href="https://www.goiasec.com.br/" className={linkClass} rel="noopener noreferrer">Goiás F.C.</a> - Goiânia, Brazil
          </li>
          <li>
            <a href={santaMartaUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>{t.santaMartaLabel}</a> - São Paulo, Brazil
          </li>
          <li>
            <a href={rodeRotasUrl} target="_blank" className={linkClass} rel="noopener noreferrer">{t.rodeRotasLabel}</a> - Goiânia, Brazil
          </li>
        </ul>
        <p className="paragraph">{t.shareNotes} <a href={xUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>X</a>, {t.andOpenSource} <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>Github</a>.</p>
        <p className="paragraph mb-4">{t.curate} <a className={linkClass} href="/monthly-playlists">{t.playlists}</a> {t.everyMonth} {t.and} {t.run} {t.everyDay}.</p>
        <p className="paragraph mb-4 text-balance">{t.forCollaborations} <button type="button" className={`${linkClass} relative select-none cursor-pointer bg-transparent border-0 p-0 text-left font-inherit`} data-state="closed">{email}</button>.</p>
      </main>
      <Footer language={language} onLanguageChange={setLanguage} />
    </div>
  );
}

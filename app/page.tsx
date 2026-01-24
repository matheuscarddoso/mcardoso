"use client"
import * as React from "react"
import Image from "next/image";
import { useTheme } from "next-themes";

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
    system: "Sistema",
    dark: "Oscuro",
    light: "Claro",
  },
}

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = React.useState<"PT" | "EN" | "ES">("EN")
  const githubUrl = "https://github.com/matheuscarddoso";
  const xUrl = "https://x.com/cardoso_dmg";
  const email = "matheuscarddoso@icloud.com";
  const t = translations[language]

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("system")
    }
  }

  const toggleLanguage = () => {
    if (language === "PT") {
      setLanguage("EN")
    } else if (language === "EN") {
      setLanguage("ES")
    } else {
      setLanguage("PT")
    }
  }

  return (
    <div className="relative flex min-h-[100dvh] w-screen flex-col">
      <main className="mx-auto flex w-full max-w-(--breakpoint-sm) flex-1 flex-col px-4 pt-20 pb-4 dark:text-[#b4b4b4] text-gray-600">
        <div className="relative z-10 mb-16 flex items-center">
          <div className="relative z-10">
            <div className="absolute left-0 top-0 -z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-dashed border-primary-light-6 bg-primary-light-3 p-2 text-center text-[8px] text-primary-light-11 dark:border-primary-dark-6 dark:bg-primary-dark-3 dark:text-primary-dark-11"></div>
            <a href="/">
              <div className="z-10 cursor-default">
                <Image src="/profile.png" alt={t.imageAlt} width={52} height={52} className="pointer-events-none h-[52px] w-[52px] rounded-full" />
              </div>
            </a>
          </div>
          <div className="ml-4">
            <h1 className="text-lg leading-5 font-medium tracking-tight text-zinc-900 dark:text-[#b4b4b4]">
              <a href="/">Matheus Cardoso</a>
            </h1>
            <p className="leading-5 group font-normal relative inline-flex items-center justify-center overflow-hidden transition text-zinc-500 dark:text-zinc-400">
              <span>{t.title}</span>
            </p>
          </div>
        </div>
        <div aria-labelledby="about-me">
          <p className="paragraph mb-3">{t.description}</p>
          <p className="paragraph mb-3 text-balance">
            {t.currentlyWorking} <a href="https://app.4selet.com" target="_blank" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors" rel="noopener noreferrer">4Selet</a>, 
            {t.platformDescription} <a href="https://www.instagram.com/drogariasantamarta/" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors" rel="noopener noreferrer">Santa Marta</a>, <a href="https://www.goiasec.com.br/" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors" rel="noopener noreferrer">Goiás F.C.</a>, {t.and}  <a href="https://www.abacatepay.com/" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors" rel="noopener noreferrer">Abacate Pay</a>.
          </p>
        </div>
        <p className="paragraph mb-4">{t.someWork}</p>
        <ul className="paragraph mb-4 list-inside list-disc space-y-1">
          <li>
            <a href="https://www.4selet.com/" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors" rel="noopener noreferrer">4Selet</a> - Goiânia, Brazil
          </li>
          <li>
            <a href="https://www.instagram.com/drogariasantamarta/" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors" rel="noopener noreferrer">Santa Marta</a> - São Paulo, Brazil
          </li>
          <li>
            <a href="https://www.goiasec.com.br/" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors" rel="noopener noreferrer">Goiás F.C.</a> - Goiânia, Brazil
          </li>
          <li>
            <a href="https://www.abacatepay.com/" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors" rel="noopener noreferrer">Abacate Pay</a> - São Paulo, Brazil
          </li>
        </ul>
        <p className="paragraph">{t.shareNotes} <a href={xUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors">X</a>, {t.andOpenSource} <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors">Github</a>.</p>
        <p className="paragraph mb-4">{t.curate} <a className="link" href="/monthly-playlists">{t.playlists}</a> {t.everyMonth} {t.and} <a className="link" href="/run">{t.run}</a> {t.everyDay}.</p>
        <p className="paragraph mb-4 text-balance">{t.forCollaborations} <button className="link relative select-none" type="button" data-state="closed">{email}</button>.</p>
      </main>
      <footer className="dark:border-primary-dark-4 mx-auto mt-auto w-full max-w-(--breakpoint-sm) px-4 pt-20">
        <div className="flex items-center justify-between px-0 py-12 md:px-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleLanguage}
              className="hover:bg-zinc-50 dark:hover:bg-zinc-800 relative flex h-[28px] items-center gap-2 rounded-lg px-2 py-1.5 transition-[colors,transform] duration-200 active:scale-98"
            >
              <span className="text-primary-light-11 dark:text-primary-dark-11 text-xs font-medium select-none">
                {language}
              </span>
            </button>
            <button className="h-[28px] cursor-default select-none text-xs text-primary-light-11 dark:text-primary-dark-11">
            © {new Date().getFullYear()} Matheus Cardoso
            </button>
          </div>
          <button 
            onClick={toggleTheme}
            className="hover:bg-zinc-50 dark:hover:bg-zinc-800 relative flex h-[28px] items-center gap-2 rounded-lg px-2 py-1.5 transition-[colors,transform] duration-200 active:scale-98"
          >
            <span className="text-primary-light-11 dark:text-primary-dark-11 text-xs font-medium select-none">
              {theme === "system" ? t.system : theme === "dark" ? t.dark : t.light}
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}

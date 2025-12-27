"use client"
import * as React from "react"
import Image from "next/image";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme } = useTheme()
  const githubUrl = "https://github.com/matheuscarddoso";
  const xUrl = "https://x.com/cardoso_dmg";
  const email = "matheuscarddoso@icloud.com";

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("system")
    }
  }

  return (
    <div className="relative flex min-h-[100dvh] w-screen flex-col">
      <main className="mx-auto flex w-full max-w-(--breakpoint-sm) flex-1 flex-col px-4 pt-20 pb-4 dark:text-white text-gray-600">
        <div className="relative z-10 mb-16 flex items-center">
          <div className="relative z-10">
            <div className="absolute left-0 top-0 -z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-dashed border-primary-light-6 bg-primary-light-3 p-2 text-center text-[8px] text-primary-light-11 dark:border-primary-dark-6 dark:bg-primary-dark-3 dark:text-primary-dark-11"></div>
            <a href="/">
              <div className="z-10 cursor-default">
                <Image src="/profile.png" alt="Photo of Matheus Cardoso" width={52} height={52} className="pointer-events-none h-[52px] w-[52px] rounded-full" />
              </div>
            </a>
          </div>
          <div className="ml-4">
            <h1 className="text-lg leading-5 font-medium tracking-tight text-zinc-900 dark:text-white">
              <a href="/">Matheus Cardoso</a>
            </h1>
            <p className="leading-5 group font-normal relative inline-flex items-center justify-center overflow-hidden transition text-zinc-500 dark:text-zinc-400">
              <span>Software Engineer</span>
            </p>
          </div>
        </div>
        <div aria-labelledby="about-me">
          <p className="paragraph mb-3">Building software with a focus on design, detail, and function.</p>
          <p className="paragraph mb-3 text-balance">
            Currently working at <a href="https://app.4selet.com" target="_blank" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors" rel="noopener noreferrer">4Selet</a>, 
            a platform to sell info-products online. Recent collaborations include: <a href="https://www.instagram.com/drogariasantamarta/" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors" rel="noopener noreferrer">Santa Marta</a>, <a href="https://www.goiasec.com.br/" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors" rel="noopener noreferrer">Goiás F.C.</a>, and  <a href="https://www.abacatepay.com/" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors" rel="noopener noreferrer">Abacate Pay</a>.
          </p>
        </div>
        <p className="paragraph mb-4">Some of my work:</p>
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
        <p className="paragraph">I share notes and updates on <a href={xUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors">X</a>, and open-source code on <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-black transition-colors">Github</a>.</p>
        <p className="paragraph mb-4">I curate <a className="link" href="/monthly-playlists">playlists</a> every month and <a className="link" href="/run">run</a> every day.</p>
        <p className="paragraph mb-4 text-balance">For collaborations, reach at <button className="link relative select-none" type="button" data-state="closed">{email}</button>.</p>
      </main>
      <footer className="dark:border-primary-dark-4 mx-auto mt-auto w-full max-w-(--breakpoint-sm) px-4 pt-20">
        <div className="flex items-center justify-between px-0 py-12 md:px-0">
          <button className="h-[28px] cursor-default select-none text-xs text-primary-light-11 dark:text-primary-dark-11">
          © {new Date().getFullYear()} Matheus Cardoso
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="hover:bg-zinc-50 dark:hover:bg-zinc-800 relative flex h-[28px] items-center gap-2 rounded-lg px-2 py-1.5 transition-[colors,transform] duration-200 active:scale-98"
            >
              <span className="text-primary-light-11 dark:text-primary-dark-11 text-xs font-medium select-none">
                {theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light"}
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

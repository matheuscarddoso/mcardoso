"use client"

import * as React from "react"
import Link from "next/link"
import { Undo2, Link2, Check, LinkIcon } from "lucide-react"
import { Footer, type Language } from "@/components/footer"
import { ColorExplorer } from "./color-explorer"

function Divider() {
  return (
    <div className="my-16 flex w-full items-center justify-center gap-1" aria-hidden>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-0.5 w-4 rounded-full bg-gray-400" />
      ))}
    </div>
  )
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 className="mt-16 mb-2 scroll-mt-20 text-balance font-[550] text-foreground" id={id}>
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

const c = (text: string) => <code className="code-inline">{text}</code>

const HUES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]

const translations = {
  PT: {
    title: "O que são cores OKLCH?",
    intro: <>{c("oklch")} é um modelo de cor mais recente projetado para ser perceptualmente uniforme — ou seja, a forma como as cores parecem aos nossos olhos corresponde à matemática por trás delas. Diferente de modelos mais antigos como {c("rgb")} ou {c("hsl")}, o OKLCH produz resultados previsíveis ao ajustar luminosidade, croma ou matiz.</>,
    colorModels: "Modelos de cor",
    colorModelsP1: <>A maioria dos desenvolvedores conhece {c("rgb")} e {c("hsl")}. Esses modelos são baseados em como as telas emitem luz, não em como percebemos cor. Essa desconexão faz com que duas cores com o mesmo valor de &quot;luminosidade&quot; no HSL possam parecer muito diferentes aos nossos olhos.</>,
    colorModelsP2: <>O OKLCH resolve isso. Ele é construído sobre o espaço de cor OKLab — um modelo matematicamente rigoroso que mapeia diretamente a percepção humana de cor. O &quot;OK&quot; representa uma versão aprimorada do modelo Lab original.</>,
    structure: "Estrutura",
    structureP: "Uma cor OKLCH é definida por três valores:",
    lightness: "Luminosidade",
    chroma: "Croma",
    hue: "Matiz",
    consistentBrightness: "Brilho consistente",
    consistentP1: <>A maior vantagem do OKLCH: cores com o mesmo valor {c("L")} realmente parecem igualmente brilhantes. No HSL, um amarelo e um azul com a mesma luminosidade parecem completamente diferentes.</>,
    consistentP2: <>Abaixo, todo círculo tem {c("L = 0.7")} e {c("C = 0.15")}, com a matiz rotacionando de 0° a 330°. Note como todos compartilham o mesmo brilho percebido:</>,
    hslCompare: <>Agora compare com HSL — mesmo valor de &quot;luminosidade&quot; de 50%, mas brilho percebido totalmente diferente:</>,
    interactive: "Interativo",
    interactiveP: "Ajuste os controles para explorar o espaço de cor OKLCH:",
    gradients: "Gradientes",
    gradientsP1: "Gradientes CSS podem interpolar em diferentes espaços de cor. Gradientes OKLCH evitam os tons acinzentados que afetam o sRGB. Compare:",
    gradientsP2: "O gradiente sRGB passa por uma área cinza opaca. O OKLCH mantém transições vibrantes e perceptualmente suaves — da forma que nossos olhos esperam que a cor se misture.",
    browserSupport: "Suporte dos navegadores",
    browserP1: "O OKLCH é suportado em todos os navegadores modernos — Chrome 111+, Firefox 113+, Safari 15.4+. Para navegadores mais antigos, forneça um fallback em RGB ou HSL:",
    browserP2: <>O navegador ignora a segunda declaração se não entender {c("oklch")}, usando o valor hexadecimal como fallback.</>,
    more: "Mais",
    moreP: <>O OKLCH já é usado nos design tokens deste site. Para um mergulho mais profundo e ferramentas interativas, veja</>,
  },
  EN: {
    title: "What are OKLCH colors?",
    intro: <>{c("oklch")} is a newer color model designed to be perceptually uniform — meaning the way colors look to our eyes matches the math behind them. Unlike older models like {c("rgb")} or {c("hsl")}, OKLCH produces predictable results when you adjust lightness, chroma, or hue.</>,
    colorModels: "Color models",
    colorModelsP1: <>Most developers are familiar with {c("rgb")} and {c("hsl")}. These models are based on how screens emit light, not on how we perceive color. That disconnect means two colors with the same &quot;lightness&quot; value in HSL can look very different to our eyes.</>,
    colorModelsP2: <>OKLCH solves this. It&apos;s built on the OKLab color space — a mathematically rigorous model that maps directly to human color perception. The &quot;OK&quot; stands for an improved version of the original Lab model.</>,
    structure: "Structure",
    structureP: "An OKLCH color is defined by three values:",
    lightness: "Lightness",
    chroma: "Chroma",
    hue: "Hue",
    consistentBrightness: "Consistent brightness",
    consistentP1: <>The biggest advantage of OKLCH: colors with the same {c("L")} value actually look equally bright. In HSL, a yellow and a blue at the same lightness look completely different.</>,
    consistentP2: <>Below, every circle has {c("L = 0.7")} and {c("C = 0.15")}, with hue rotating from 0° to 330°. Notice how they all share the same perceived brightness:</>,
    hslCompare: <>Now compare with HSL — same &quot;lightness&quot; value of 50%, but wildly different perceived brightness:</>,
    interactive: "Interactive",
    interactiveP: "Adjust the sliders to explore the OKLCH color space:",
    gradients: "Gradients",
    gradientsP1: "CSS gradients can interpolate in different color spaces. OKLCH gradients avoid the muddy middle tones that plague sRGB. Compare:",
    gradientsP2: "The sRGB gradient goes through a dull gray area. OKLCH maintains vibrant, perceptually smooth transitions — the way our eyes expect color to blend.",
    browserSupport: "Browser support",
    browserP1: "OKLCH is supported in all modern browsers — Chrome 111+, Firefox 113+, Safari 15.4+. For older browsers, provide an RGB or HSL fallback:",
    browserP2: <>The browser ignores the second declaration if it doesn&apos;t understand {c("oklch")}, falling back to the hex value.</>,
    more: "More",
    moreP: <>OKLCH is already used in this site&apos;s own design tokens. For a deeper dive and interactive tools, check</>,
  },
  ES: {
    title: "¿Qué son los colores OKLCH?",
    intro: <>{c("oklch")} es un modelo de color más reciente diseñado para ser perceptualmente uniforme — es decir, la forma en que los colores se ven a nuestros ojos coincide con la matemática detrás de ellos. A diferencia de modelos más antiguos como {c("rgb")} o {c("hsl")}, OKLCH produce resultados predecibles al ajustar luminosidad, croma o tono.</>,
    colorModels: "Modelos de color",
    colorModelsP1: <>La mayoría de los desarrolladores conocen {c("rgb")} y {c("hsl")}. Estos modelos se basan en cómo las pantallas emiten luz, no en cómo percibimos el color. Esa desconexión significa que dos colores con el mismo valor de &quot;luminosidad&quot; en HSL pueden verse muy diferentes a nuestros ojos.</>,
    colorModelsP2: <>OKLCH resuelve esto. Está construido sobre el espacio de color OKLab — un modelo matemáticamente riguroso que mapea directamente la percepción humana del color. El &quot;OK&quot; representa una versión mejorada del modelo Lab original.</>,
    structure: "Estructura",
    structureP: "Un color OKLCH se define por tres valores:",
    lightness: "Luminosidad",
    chroma: "Croma",
    hue: "Tono",
    consistentBrightness: "Brillo consistente",
    consistentP1: <>La mayor ventaja de OKLCH: colores con el mismo valor {c("L")} realmente se ven igualmente brillantes. En HSL, un amarillo y un azul con la misma luminosidad se ven completamente diferentes.</>,
    consistentP2: <>Abajo, cada círculo tiene {c("L = 0.7")} y {c("C = 0.15")}, con el tono rotando de 0° a 330°. Note cómo todos comparten el mismo brillo percibido:</>,
    hslCompare: <>Ahora compare con HSL — mismo valor de &quot;luminosidad&quot; de 50%, pero brillo percibido totalmente diferente:</>,
    interactive: "Interactivo",
    interactiveP: "Ajuste los controles para explorar el espacio de color OKLCH:",
    gradients: "Gradientes",
    gradientsP1: "Los gradientes CSS pueden interpolar en diferentes espacios de color. Los gradientes OKLCH evitan los tonos opacos que afectan al sRGB. Compare:",
    gradientsP2: "El gradiente sRGB pasa por un área gris opaca. OKLCH mantiene transiciones vibrantes y perceptualmente suaves — como nuestros ojos esperan que el color se mezcle.",
    browserSupport: "Soporte de navegadores",
    browserP1: "OKLCH es compatible con todos los navegadores modernos — Chrome 111+, Firefox 113+, Safari 15.4+. Para navegadores más antiguos, proporcione un fallback en RGB o HSL:",
    browserP2: <>El navegador ignora la segunda declaración si no entiende {c("oklch")}, usando el valor hexadecimal como fallback.</>,
    more: "Más",
    moreP: <>OKLCH ya se usa en los design tokens de este sitio. Para una inmersión más profunda y herramientas interactivas, consulte</>,
  },
}

type ArticleContentProps = {
  codeStructure: React.ReactNode
  codeGradients: React.ReactNode
  codeBrowser: React.ReactNode
}

export function ArticleContent({ codeStructure, codeGradients, codeBrowser }: ArticleContentProps) {
  const [language, setLanguage] = React.useState<Language>("EN")
  const t = translations[language]

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden">
      <main className="mx-auto w-full max-w-(--breakpoint-sm) flex-1 px-4 py-12 leading-relaxed sm:py-20">
        <header>
          <div className="mb-24 flex min-h-9 w-full select-none items-center justify-between gap-2">
            <Link
              href="/"
              className="group flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary transition-[scale,background-color] duration-200 ease-out hover:bg-gray-300 active:scale-[0.96]"
              aria-label="Home"
            >
              <Undo2 className="mr-0.5 size-4 text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground" strokeWidth={1.5} />
            </Link>
            <CopyLinkButton />
          </div>
        </header>

        <article>
          <h1 className="mb-2 w-fit scroll-mt-20 text-balance font-[550] text-foreground" id="what-are-oklch-colors">
            {t.title}
          </h1>

          <p className="w-full text-pretty text-muted-foreground">{t.intro}</p>

          <Divider />

          <SectionHeading id="color-models">{t.colorModels}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.colorModelsP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.colorModelsP2}</p>

          <div className="my-8 flex w-full flex-col items-center">
            <div className="preview-card flex w-full flex-wrap items-center justify-center gap-2 px-4 py-12">
              {["rgb", "hsl", "hwb", "oklch"].map((model) => (
                <div
                  key={model}
                  className={`select-none rounded-full px-3 py-1 font-mono text-sm ${
                    model === "oklch"
                      ? "bg-foreground text-background font-medium"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {model}
                </div>
              ))}
            </div>
          </div>

          <Divider />

          <SectionHeading id="structure">{t.structure}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.structureP}</p>

          <div className="my-8 w-full overflow-hidden rounded-xl border">
            <div className="grid w-full grid-cols-1 sm:grid-cols-3">
              {[
                { label: "L", desc: t.lightness, range: "0 – 1" },
                { label: "C", desc: t.chroma, range: "0 – 0.4" },
                { label: "H", desc: t.hue, range: "0 – 360" },
              ].map((item, i) => (
                <div key={item.label} className={`flex flex-col gap-1 px-4 py-3 ${i < 2 ? "border-b sm:border-b-0 sm:border-r" : ""}`}>
                  <span className="font-mono font-medium text-foreground">{item.label}</span>
                  <span className="text-sm text-muted-foreground">{item.desc}</span>
                  <span className="font-mono text-xs text-muted-foreground/70">{item.range}</span>
                </div>
              ))}
            </div>
          </div>

          {codeStructure}

          <Divider />

          <SectionHeading id="consistent-brightness">{t.consistentBrightness}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.consistentP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.consistentP2}</p>

          <div className="my-8 flex w-full flex-col items-center">
            <div className="preview-card flex w-full items-center justify-center px-4 py-12">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {HUES.map((h) => (
                  <div key={h} className="flex flex-col items-center gap-1.5">
                    <div
                      className="size-10 rounded-full outline outline-1 -outline-offset-1 outline-black/5 dark:outline-white/10"
                      style={{ backgroundColor: `oklch(0.7 0.15 ${h})` }}
                    />
                    <span className="font-mono text-[10px] text-muted-foreground">{h}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.hslCompare}</p>

          <div className="my-8 flex w-full flex-col items-center">
            <div className="preview-card flex w-full items-center justify-center px-4 py-12">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {HUES.map((h) => (
                  <div key={h} className="flex flex-col items-center gap-1.5">
                    <div
                      className="size-10 rounded-full outline outline-1 -outline-offset-1 outline-black/5 dark:outline-white/10"
                      style={{ backgroundColor: `hsl(${h} 80% 50%)` }}
                    />
                    <span className="font-mono text-[10px] text-muted-foreground">{h}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Divider />

          <SectionHeading id="interactive">{t.interactive}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.interactiveP}</p>

          <ColorExplorer />

          <Divider />

          <SectionHeading id="gradients">{t.gradients}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.gradientsP1}</p>

          <div className="my-8 flex w-full flex-col items-center">
            <div className="preview-card w-full p-1">
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 sm:flex-row">
                {[
                  { label: "sRGB", gradient: "linear-gradient(in srgb, #ff00ff, #00ff00)" },
                  { label: "OKLAB", gradient: "linear-gradient(in oklab, #ff00ff, #00ff00)" },
                  { label: "OKLCH", gradient: "linear-gradient(in oklch, #ff00ff, #00ff00)" },
                ].map(({ label, gradient }) => (
                  <div key={label} className="flex h-full w-full flex-col rounded-lg">
                    <span className="px-3 py-2 font-mono text-xs text-muted-foreground">{label}</span>
                    <div className="h-16 w-full rounded-b-lg sm:h-24" style={{ background: gradient }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.gradientsP2}</p>

          {codeGradients}

          <Divider />

          <SectionHeading id="browser-support">{t.browserSupport}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.browserP1}</p>

          {codeBrowser}

          <p className="mb-8 w-full text-pretty text-muted-foreground">{t.browserP2}</p>

          <Divider />

          <h2 className="mt-16 mb-2 w-full text-balance font-[550] text-foreground">{t.more}</h2>

          <p className="mb-6 w-full text-pretty text-muted-foreground">
            {t.moreP}{" "}
            <a className="article-underline text-foreground" href="https://oklch.com" target="_blank" rel="noopener noreferrer">oklch.com</a>
            {" "}
            {language === "PT" ? "ou a" : language === "ES" ? "o la" : "or the"}{" "}
            <a className="article-underline text-foreground" href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch" target="_blank" rel="noopener noreferrer">MDN docs</a>.
          </p>
        </article>
      </main>
      <Footer language={language} onLanguageChange={setLanguage} />
    </div>
  )
}

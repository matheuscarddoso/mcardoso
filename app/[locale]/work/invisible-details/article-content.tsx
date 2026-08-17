"use client";

import * as React from "react";
import { HomeLink } from "@/components/home-link";
import { useParams } from "next/navigation";
import { Undo2, Check, LinkIcon } from "lucide-react";
import { Footer, type Language } from "@/components/footer";
import { LanguageToggle, ThemeToggle } from "@/components/toggles";
import { ArticleByline } from "@/components/article-byline";
import { ArticleNav } from "@/components/article-nav";
import { ArticleTimeline } from "@/components/article-timeline";
import { SectionDivider } from "@/components/section-divider";
import { localeToLanguage } from "@/lib/locale";
import { switchLocale } from "@/lib/switch-locale";

/** Same dotted rule the home page uses, at the spacing these essays had. */
function Divider() {
  return <SectionDivider className="my-16" />;
}

function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      className="mt-16 mb-2 scroll-mt-20 text-balance font-[550] article-heading"
      id={id}
    >
      {children}
    </h2>
  );
}

function CopyLinkButton() {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

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
  );
}

function CopyInstallButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="group flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-1.5 transition-[scale,background-color] duration-150 ease-out hover:bg-foreground/10 active:scale-[0.96]"
      aria-label="Copy install command"
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
        <svg
          className="col-start-1 row-start-1 size-4 text-muted-foreground transition-[opacity,transform,filter] duration-300 group-hover:text-foreground"
          style={{
            transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
            opacity: copied ? 0 : 1,
            transform: copied ? "scale(0.25)" : "scale(1)",
            filter: copied ? "blur(4px)" : "blur(0px)",
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      </span>
    </button>
  );
}

// --- Interactive demos ---

function ScalePressDemo() {
  return (
    <div className="my-8 flex w-full flex-col items-center">
      <div className="preview-card flex w-full items-center justify-center gap-4 px-4 py-12">
        <button className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-[scale] duration-150 ease-out active:scale-[0.96]">
          Press me
        </button>
        <button className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-[scale] duration-150 ease-out active:scale-[0.96]">
          Or me
        </button>
      </div>
    </div>
  );
}

function ConcentricRadiusDemo() {
  return (
    <div className="my-8 flex w-full flex-col items-center">
      <div className="preview-card flex w-full items-center justify-center gap-8 px-4 py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-2xl bg-foreground/10 p-2">
            <div className="h-12 w-20 rounded-lg bg-foreground/20" />
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            concentric
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl bg-foreground/10 p-2">
            <div className="h-12 w-20 rounded-xl bg-foreground/20" />
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            same radius
          </span>
        </div>
      </div>
    </div>
  );
}

function ShadowVsBorderDemo() {
  return (
    <div className="my-8 flex w-full flex-col items-center">
      <div className="preview-card flex w-full items-center justify-center gap-6 px-4 py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-24 rounded-xl shadow-custom transition-[box-shadow] duration-150 ease-out hover:shadow-custom-hover" />
          <span className="font-mono text-[10px] text-muted-foreground">
            shadow
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-24 rounded-xl border" />
          <span className="font-mono text-[10px] text-muted-foreground">
            border
          </span>
        </div>
      </div>
    </div>
  );
}

function IconSwapDemo() {
  const [active, setActive] = React.useState(false);

  return (
    <div className="my-8 flex w-full flex-col items-center">
      <div className="preview-card flex w-full flex-col items-center justify-center gap-4 px-4 py-12">
        <button
          onClick={() => setActive(!active)}
          className="flex size-10 items-center justify-center rounded-full bg-secondary transition-[scale,background-color] duration-200 ease-out hover:bg-gray-300 active:scale-[0.96]"
          aria-label="Toggle icon"
        >
          <span className="relative grid size-5 place-items-center">
            <svg
              className="col-start-1 row-start-1 size-5 text-foreground"
              style={{
                transition:
                  "opacity 300ms cubic-bezier(0.2, 0, 0, 1), transform 300ms cubic-bezier(0.2, 0, 0, 1), filter 300ms cubic-bezier(0.2, 0, 0, 1)",
                opacity: active ? 1 : 0,
                transform: active ? "scale(1)" : "scale(0.25)",
                filter: active ? "blur(0px)" : "blur(4px)",
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            <svg
              className="col-start-1 row-start-1 size-5 text-foreground"
              style={{
                transition:
                  "opacity 300ms cubic-bezier(0.2, 0, 0, 1), transform 300ms cubic-bezier(0.2, 0, 0, 1), filter 300ms cubic-bezier(0.2, 0, 0, 1)",
                opacity: active ? 0 : 1,
                transform: active ? "scale(0.25)" : "scale(1)",
                filter: active ? "blur(4px)" : "blur(0px)",
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </span>
        </button>
        <span className="text-xs text-muted-foreground">click to toggle</span>
      </div>
    </div>
  );
}

function EasingComparisonDemo() {
  const [playing, setPlaying] = React.useState(false);
  const [key, setKey] = React.useState(0);

  const play = () => {
    setKey((k) => k + 1);
    setPlaying(true);
    setTimeout(() => setPlaying(false), 800);
  };

  return (
    <div className="my-8 flex w-full flex-col items-center">
      <div className="preview-card flex w-full flex-col gap-4 px-4 py-8">
        {[
          { label: "ease-in", curve: "ease-in" },
          { label: "ease-out", curve: "ease-out" },
          { label: "custom", curve: "cubic-bezier(0.23, 1, 0.32, 1)" },
        ].map(({ label, curve }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-right font-mono text-[11px] text-muted-foreground">
              {label}
            </span>
            <div className="relative h-6 w-full rounded-full bg-secondary">
              <div
                key={key}
                className="absolute top-0.5 left-0.5 size-5 rounded-full bg-foreground"
                style={{
                  transition: `transform 600ms ${curve}`,
                  transform: playing
                    ? "translateX(calc(100cqw - 24px))"
                    : "translateX(0)",
                  containerType: "inline-size",
                }}
              />
            </div>
          </div>
        ))}
        <div className="flex justify-center pt-2">
          <button
            onClick={play}
            className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-[scale,background-color] duration-150 ease-out hover:bg-gray-300 active:scale-[0.96]"
          >
            {playing ? "Playing..." : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Translations ---

const c = (text: string) => <code className="code-inline">{text}</code>;

const translations = {
  PT: {
    title: "Detalhes invisíveis que fazem interfaces parecerem certas",
    intro: (
      <>
        Quase nada disso aqui alguém percebe. Um botão que responde do jeito que
        você esperava, uma transição que não pede atenção nenhuma: o que fica é
        só a sensação de que {c("funciona")}. Por trás são algumas centenas de
        decisões pequenas, e o prêmio por acertar todas é ninguém conseguir
        apontar uma.
      </>
    ),
    whyDetails: "Por que detalhes importam",
    whyDetailsP1: (
      <>
        Hoje quase todo software é bom o suficiente, e é justamente por isso que
        o gosto decide. As pessoas escolhem ferramenta pela sensação do
        conjunto, não pela lista de recursos. Beleza continua sendo pouco usada
        em software, o que faz dela uma vantagem barata.
      </>
    ),
    whyDetailsP2: (
      <>
        Gosto se treina. Você constrói o seu convivendo com trabalho melhor que
        o seu e perguntando, toda vez que alguma coisa parecer boa, o que
        exatamente está fazendo aquilo.
      </>
    ),
    animations: "Animações",
    animationsP1: (
      <>
        Nem tudo precisa animar. Se o usuário vê uma ação 100 vezes por dia, não
        anime. Se vê ocasionalmente (modais, drawers), anime. A regra: animações
        de UI devem ficar abaixo de {c("300ms")}.
      </>
    ),
    animationsP2: (
      <>
        Nunca use {c("ease-in")} para animações de UI: começa devagar, fazendo a
        interface parecer lenta. Use {c("ease-out")} ou curvas customizadas mais
        fortes:
      </>
    ),
    scaleOnPress: "Scale on press",
    scaleOnPressP: (
      <>
        Um sutil {c("scale(0.96)")} no clique dá aos botões feedback tátil.
        Sempre use {c("0.96")}. Nunca abaixo de {c("0.95")}, qualquer coisa
        menor parece exagerado. Experimente:
      </>
    ),
    iconTransitions: "Transições de ícones",
    iconTransitionsP1: (
      <>
        Quando ícones mudam de estado (menu → X, link → check), não apenas
        troque a visibilidade. Anime com {c("opacity")}, {c("scale")} e{" "}
        {c("blur")}: a desfocagem mascara a transição imperfeita entre duas
        formas distintas, criando a ilusão de uma transformação suave.
      </>
    ),
    iconTransitionsP2: (
      <>
        Os valores exatos: scale de {c("0.25")} para {c("1")}, blur de{" "}
        {c("4px")} para {c("0px")}, opacidade de {c("0")} para {c("1")}. Sem
        motion library, use CSS transitions com{" "}
        {c("cubic-bezier(0.2, 0, 0, 1)")}:
      </>
    ),
    stagger: "Entrada escalonada",
    staggerP: (
      <>
        Não anime um container inteiro. Quebre o conteúdo em pedaços semânticos
        e escalone cada um com ~100ms de delay. Combine {c("opacity")},{" "}
        {c("translateY")} e {c("blur")} para o efeito de entrada:
      </>
    ),
    surfaces: "Superfícies",
    concentricRadius: "Border-radius concêntrico",
    concentricP: (
      <>
        Quando elementos arredondados estão aninhados, o raio externo deve ser
        igual ao raio interno mais o padding entre eles:{" "}
        {c("outer = inner + padding")}. Raios iguais em pai e filho é a coisa
        mais comum que faz interfaces parecerem erradas.
      </>
    ),
    shadowsOverBorders: "Sombras ao invés de bordas",
    shadowsP: (
      <>
        Para cards, botões e containers, prefira {c("box-shadow")} em camadas ao
        invés de bordas sólidas. Sombras se adaptam a qualquer fundo via
        transparência. Bordas sólidas não.
      </>
    ),
    typography: "Tipografia",
    typographyP1: (
      <>
        Três regras, e cada uma é uma linha de CSS: {c("text-wrap: balance")} em
        headings, para quebras equilibradas; {c("text-wrap: pretty")} em
        parágrafos, para não sobrar órfã; e{" "}
        {c("font-variant-numeric: tabular-nums")} em qualquer número que muda,
        para o layout parar de pular.
      </>
    ),
    typographyP2: (
      <>
        Aplique {c("-webkit-font-smoothing: antialiased")} no root para texto
        mais nítido no macOS.
      </>
    ),
    performance: "Performance",
    performanceP1: (
      <>
        Anime apenas {c("transform")} e {c("opacity")}: essas propriedades pulam
        layout e pintura, rodando na GPU. Animar {c("width")}, {c("height")},{" "}
        {c("padding")} ou {c("margin")} dispara os três passos de renderização.
      </>
    ),
    performanceP2: (
      <>
        Nunca use {c("transition: all")}. Sempre especifique as propriedades
        exatas:
      </>
    ),
    more: "Skill file",
    moreP1: (
      <>
        Essas recomendações estão compiladas em um skill file para Claude Code,
        Cursor e ferramentas similares. Funciona com Laravel Blade, Livewire e
        qualquer projeto com CSS:
      </>
    ),
    moreInstall: "npx skills add matheuscarddoso/blade-ui-skill",
    moreP2: <>Baseado nos princípios de</>,
  },
  EN: {
    title: "Invisible details that make interfaces feel right",
    intro: (
      <>
        Almost none of this gets noticed. A button that answers the way you
        expected, a transition that never asks for your attention: what is left
        is the sense that it {c("works")}. Behind that are a few hundred small
        decisions, and the reward for getting them right is that nobody can
        point to one.
      </>
    ),
    whyDetails: "Why details matter",
    whyDetailsP1: (
      <>
        Almost all software is good enough now, which is exactly why taste
        decides. People pick tools on how the whole thing feels, not on the
        feature list. Beauty is still barely used in software, which makes it a
        cheap advantage.
      </>
    ),
    whyDetailsP2: (
      <>
        Taste can be trained. You build yours by spending time around work
        better than your own, and by asking, every time something feels right,
        what exactly is doing that.
      </>
    ),
    animations: "Animations",
    animationsP1: (
      <>
        Not everything needs to animate. If the user sees an action 100 times a
        day, don&apos;t animate it. If they see it occasionally (modals,
        drawers), animate. The rule: UI animations should stay under{" "}
        {c("300ms")}.
      </>
    ),
    animationsP2: (
      <>
        Never use {c("ease-in")} for UI animations: it starts slow, making the
        interface feel sluggish. Use {c("ease-out")} or stronger custom curves:
      </>
    ),
    scaleOnPress: "Scale on press",
    scaleOnPressP: (
      <>
        A subtle {c("scale(0.96)")} on click gives buttons tactile feedback.
        Always use {c("0.96")}. Never below {c("0.95")}, anything smaller feels
        exaggerated. Try it:
      </>
    ),
    iconTransitions: "Icon transitions",
    iconTransitionsP1: (
      <>
        When icons change state (menu → X, link → check), don&apos;t just toggle
        visibility. Animate with {c("opacity")}, {c("scale")}, and {c("blur")}:
        the blur masks the imperfect transition between two distinct shapes,
        creating the illusion of a smooth morph.
      </>
    ),
    iconTransitionsP2: (
      <>
        The exact values: scale from {c("0.25")} to {c("1")}, blur from{" "}
        {c("4px")} to {c("0px")}, opacity from {c("0")} to {c("1")}. Without a
        motion library, use CSS transitions with{" "}
        {c("cubic-bezier(0.2, 0, 0, 1)")}:
      </>
    ),
    stagger: "Staggered enter",
    staggerP: (
      <>
        Don&apos;t animate an entire container. Break content into semantic
        chunks and stagger each with ~100ms delay. Combine {c("opacity")},{" "}
        {c("translateY")}, and {c("blur")} for the enter effect:
      </>
    ),
    surfaces: "Surfaces",
    concentricRadius: "Concentric border-radius",
    concentricP: (
      <>
        When rounded elements are nested, the outer radius must equal the inner
        radius plus the padding between them: {c("outer = inner + padding")}.
        Same radius on parent and child is the most common thing that makes
        interfaces feel off.
      </>
    ),
    shadowsOverBorders: "Shadows over borders",
    shadowsP: (
      <>
        For cards, buttons, and containers, prefer layered {c("box-shadow")}{" "}
        over solid borders. Shadows adapt to any background via transparency.
        Solid borders don&apos;t.
      </>
    ),
    typography: "Typography",
    typographyP1: (
      <>
        Three rules, one line of CSS each: {c("text-wrap: balance")} on
        headings, for even line breaks; {c("text-wrap: pretty")} on paragraphs,
        so no word is left alone on the last line; and{" "}
        {c("font-variant-numeric: tabular-nums")} on any number that changes, so
        the layout stops jumping.
      </>
    ),
    typographyP2: (
      <>
        Apply {c("-webkit-font-smoothing: antialiased")} on the root for crisper
        text on macOS.
      </>
    ),
    performance: "Performance",
    performanceP1: (
      <>
        Only animate {c("transform")} and {c("opacity")}: these properties skip
        layout and paint, running on the GPU. Animating {c("width")},{" "}
        {c("height")}, {c("padding")}, or {c("margin")} triggers all three
        rendering steps.
      </>
    ),
    performanceP2: (
      <>
        Never use {c("transition: all")}. Always specify the exact properties:
      </>
    ),
    more: "Skill file",
    moreP1: (
      <>
        These recommendations are compiled into a skill file for Claude Code,
        Cursor, and similar tools. Works with Laravel Blade, Livewire, and any
        CSS project:
      </>
    ),
    moreInstall: "npx skills add matheuscarddoso/blade-ui-skill",
    moreP2: <>Based on the principles of</>,
  },
  ES: {
    title: "Detalles invisibles que hacen que las interfaces se sientan bien",
    intro: (
      <>
        Casi nada de esto se nota. Un botón que responde como esperabas, una
        transición que no pide atención: lo que queda es la sensación de que{" "}
        {c("funciona")}. Detrás hay unos cientos de decisiones pequeñas, y el
        premio por acertarlas todas es que nadie pueda señalar ninguna.
      </>
    ),
    whyDetails: "Por qué importan los detalles",
    whyDetailsP1: (
      <>
        Hoy casi todo el software es suficientemente bueno, y por eso mismo
        decide el gusto. La gente elige herramienta por cómo se siente el
        conjunto, no por la lista de funciones. La belleza sigue estando poco
        usada en software, lo que la vuelve una ventaja barata.
      </>
    ),
    whyDetailsP2: (
      <>
        El gusto se entrena. Construyes el tuyo pasando tiempo con trabajo mejor
        que el tuyo y preguntando, cada vez que algo se sienta bien, qué es
        exactamente lo que lo está logrando.
      </>
    ),
    animations: "Animaciones",
    animationsP1: (
      <>
        No todo necesita animarse. Si el usuario ve una acción 100 veces al día,
        no la anime. Si la ve ocasionalmente (modales, drawers), anime. La
        regla: las animaciones de UI deben estar por debajo de {c("300ms")}.
      </>
    ),
    animationsP2: (
      <>
        Nunca use {c("ease-in")} para animaciones de UI: empieza lento, haciendo
        que la interfaz se sienta perezosa. Use {c("ease-out")} o curvas
        personalizadas más fuertes:
      </>
    ),
    scaleOnPress: "Scale on press",
    scaleOnPressP: (
      <>
        Un sutil {c("scale(0.96)")} al hacer clic da a los botones feedback
        táctil. Siempre use {c("0.96")}. Nunca por debajo de {c("0.95")},
        cualquier cosa menor se siente exagerado. Pruébelo:
      </>
    ),
    iconTransitions: "Transiciones de íconos",
    iconTransitionsP1: (
      <>
        Cuando los íconos cambian de estado (menú → X, enlace → check), no solo
        cambie la visibilidad. Anime con {c("opacity")}, {c("scale")} y{" "}
        {c("blur")}: el desenfoque enmascara la transición imperfecta entre dos
        formas distintas, creando la ilusión de una transformación suave.
      </>
    ),
    iconTransitionsP2: (
      <>
        Los valores exactos: scale de {c("0.25")} a {c("1")}, blur de {c("4px")}{" "}
        a {c("0px")}, opacidad de {c("0")} a {c("1")}. Sin librería de motion,
        use transiciones CSS con {c("cubic-bezier(0.2, 0, 0, 1)")}:
      </>
    ),
    stagger: "Entrada escalonada",
    staggerP: (
      <>
        No anime un container entero. Divida el contenido en bloques semánticos
        y escalone cada uno con ~100ms de delay. Combine {c("opacity")},{" "}
        {c("translateY")} y {c("blur")} para el efecto de entrada:
      </>
    ),
    surfaces: "Superficies",
    concentricRadius: "Border-radius concéntrico",
    concentricP: (
      <>
        Cuando elementos redondeados están anidados, el radio externo debe ser
        igual al radio interno más el padding entre ellos:{" "}
        {c("outer = inner + padding")}. Radios iguales en padre e hijo es lo más
        común que hace que las interfaces se sientan mal.
      </>
    ),
    shadowsOverBorders: "Sombras en vez de bordes",
    shadowsP: (
      <>
        Para cards, botones y containers, prefiera {c("box-shadow")} en capas
        sobre bordes sólidos. Las sombras se adaptan a cualquier fondo via
        transparencia. Los bordes sólidos no.
      </>
    ),
    typography: "Tipografía",
    typographyP1: (
      <>
        Tres reglas, una línea de CSS cada una: {c("text-wrap: balance")} en
        headings, para quiebres equilibrados; {c("text-wrap: pretty")} en
        párrafos, para que no quede una palabra sola al final; y{" "}
        {c("font-variant-numeric: tabular-nums")} en cualquier número que
        cambia, para que el layout deje de saltar.
      </>
    ),
    typographyP2: (
      <>
        Aplique {c("-webkit-font-smoothing: antialiased")} en el root para texto
        más nítido en macOS.
      </>
    ),
    performance: "Rendimiento",
    performanceP1: (
      <>
        Solo anime {c("transform")} y {c("opacity")}: estas propiedades saltan
        layout y pintura, corriendo en la GPU. Animar {c("width")},{" "}
        {c("height")}, {c("padding")} o {c("margin")} dispara los tres pasos de
        renderizado.
      </>
    ),
    performanceP2: (
      <>
        Nunca use {c("transition: all")}. Siempre especifique las propiedades
        exactas:
      </>
    ),
    more: "Skill file",
    moreP1: (
      <>
        Estas recomendaciones están compiladas en un skill file para Claude
        Code, Cursor y herramientas similares. Funciona con Laravel Blade,
        Livewire y cualquier proyecto con CSS:
      </>
    ),
    moreInstall: "npx skills add matheuscarddoso/blade-ui-skill",
    moreP2: <>Basado en los principios de</>,
  },
};

type ArticleContentProps = {
  codeEasing: React.ReactNode;
  codeScalePress: React.ReactNode;
  codeIconSwap: React.ReactNode;
  codeShadow: React.ReactNode;
  codeRadius: React.ReactNode;
  codeStagger: React.ReactNode;
  codePerformance: React.ReactNode;
};

export function ArticleContent({
  codeEasing,
  codeScalePress,
  codeIconSwap,
  codeShadow,
  codeRadius,
  codeStagger,
  codePerformance,
}: ArticleContentProps) {
  const params = useParams();
  const locale = (params.locale as string) ?? "en";
  const language: Language = localeToLanguage(locale);
  const t = translations[language];

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden">
      <ArticleTimeline language={language} />
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
              <LanguageToggle
                language={language}
                onLanguageChange={switchLocale}
              />
              <ThemeToggle language={language} />
              <CopyLinkButton />
            </div>
          </div>
        </header>

        <article>
          <h1
            className="mb-2 w-fit scroll-mt-20 text-balance font-[550] article-heading"
            id="invisible-details"
          >
            {t.title}
          </h1>

          <ArticleByline slug="invisible-details" language={language} />

          <p className="w-full text-pretty text-muted-foreground">{t.intro}</p>

          <Divider />

          <SectionHeading id="why-details">{t.whyDetails}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.whyDetailsP1}
          </p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.whyDetailsP2}
          </p>

          <div className="my-8 flex w-full flex-col items-center">
            <div className="preview-card flex w-full items-center justify-center px-4 py-8">
              <blockquote className="text-pretty text-center text-sm text-muted-foreground italic">
                &ldquo;All those unseen details combine to produce something
                that&apos;s just stunning, like a thousand barely audible voices
                all singing in tune.&rdquo;
                <span className="mt-2 block text-xs not-italic text-muted-foreground/70">
                  Paul Graham
                </span>
              </blockquote>
            </div>
          </div>

          <Divider />

          <SectionHeading id="animations">{t.animations}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.animationsP1}
          </p>

          <div className="my-8 w-full overflow-hidden rounded-xl border">
            <div className="grid w-full grid-cols-1 sm:grid-cols-2">
              {[
                {
                  label: "100+/day",
                  desc:
                    language === "PT"
                      ? "Nunca anime"
                      : language === "ES"
                        ? "Nunca anime"
                        : "Never animate",
                },
                {
                  label:
                    language === "PT"
                      ? "Ocasional"
                      : language === "ES"
                        ? "Ocasional"
                        : "Occasional",
                  desc:
                    language === "PT"
                      ? "Animação padrão"
                      : language === "ES"
                        ? "Animación estándar"
                        : "Standard animation",
                },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={`flex flex-col gap-1 px-4 py-3 ${i === 0 ? "border-b sm:border-b-0 sm:border-r" : ""}`}
                >
                  <span className="font-mono text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.animationsP2}
          </p>

          {codeEasing}

          <EasingComparisonDemo />

          <Divider />

          <SectionHeading id="scale-on-press">{t.scaleOnPress}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.scaleOnPressP}
          </p>

          <ScalePressDemo />

          {codeScalePress}

          <Divider />

          <SectionHeading id="icon-transitions">
            {t.iconTransitions}
          </SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.iconTransitionsP1}
          </p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.iconTransitionsP2}
          </p>

          <IconSwapDemo />

          {codeIconSwap}

          <Divider />

          <SectionHeading id="stagger">{t.stagger}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.staggerP}
          </p>

          {codeStagger}

          <Divider />

          <SectionHeading id="surfaces">{t.surfaces}</SectionHeading>

          <h3 className="mt-8 mb-2 text-balance font-medium text-foreground">
            {t.concentricRadius}
          </h3>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.concentricP}
          </p>

          <ConcentricRadiusDemo />

          {codeRadius}

          <h3 className="mt-12 mb-2 text-balance font-medium text-foreground">
            {t.shadowsOverBorders}
          </h3>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.shadowsP}
          </p>

          <ShadowVsBorderDemo />

          {codeShadow}

          <Divider />

          <SectionHeading id="typography">{t.typography}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.typographyP1}
          </p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.typographyP2}
          </p>

          <Divider />

          <SectionHeading id="performance">{t.performance}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.performanceP1}
          </p>

          <div className="my-8 w-full overflow-hidden rounded-xl border">
            <div className="grid w-full grid-cols-1 sm:grid-cols-2">
              {[
                {
                  prop: "transform, opacity",
                  gpu: "✓",
                  note:
                    language === "PT"
                      ? "Anime livremente"
                      : language === "ES"
                        ? "Anime libremente"
                        : "Animate freely",
                },
                {
                  prop: "width, height, margin",
                  gpu: "✗",
                  note:
                    language === "PT"
                      ? "Evite"
                      : language === "ES"
                        ? "Evite"
                        : "Avoid",
                },
              ].map((item, i) => (
                <div
                  key={item.prop}
                  className={`flex flex-col gap-1 px-4 py-3 ${i === 0 ? "border-b sm:border-b-0 sm:border-r" : ""}`}
                >
                  <span className="font-mono text-sm font-medium text-foreground">
                    {item.prop}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    GPU: {item.gpu} · {item.note}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.performanceP2}
          </p>

          {codePerformance}

          <Divider />

          <h2
            className="mt-16 mb-2 w-full text-balance font-[550] article-heading scroll-mt-20"
            id="more"
          >
            {t.more}
          </h2>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.moreP1}
          </p>

          <div className="flex h-10 items-center justify-between gap-2 overflow-hidden rounded-xl bg-preview-bg pr-1.5 pl-3 shadow-custom my-8 text-sm">
            <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <code className="select-all whitespace-nowrap">
                {t.moreInstall}
              </code>
            </div>
            <CopyInstallButton text={t.moreInstall} />
          </div>

          <p className="mb-6 w-full text-pretty text-muted-foreground">
            {t.moreP2}{" "}
            <a
              className="article-underline"
              href="https://emilkowal.ski"
              target="_blank"
              rel="noopener noreferrer"
            >
              Emil Kowalski
            </a>
            ,{" "}
            <a
              className="article-underline"
              href="https://ibelick.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ibelick
            </a>{" "}
            {language === "PT" ? "e" : language === "ES" ? "y" : "and"}{" "}
            <a
              className="article-underline"
              href="https://jakub.kr"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jakub Krehel
            </a>
            .
          </p>

          <ArticleNav
            slug="invisible-details"
            language={language}
            locale={locale}
          />
        </article>
      </main>
      {/* Language moved up beside the copy-link button; theme stays here. */}
      {/* Both toggles live in the article header, beside copy-link. */}
      <Footer
        language={language}
        showLanguageToggle={false}
        showThemeToggle={false}
      />
    </div>
  );
}

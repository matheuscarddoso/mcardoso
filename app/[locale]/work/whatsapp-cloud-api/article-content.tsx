"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Undo2, Check, LinkIcon, Download } from "lucide-react"
import { Footer, type Language } from "@/components/footer"
import { localeToLanguage, languageToLocale } from "@/lib/locale"

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

const translations = {
  PT: {
    title: "Mensagens interativas com a WhatsApp Cloud API",
    intro: (
      <>
        A API oficial do WhatsApp — Cloud API da Meta — permite enviar botões, listas e carrosséis
        nativos sem BSP intermediário. Aqui vai o essencial para integrar e o padrão que mantém o
        estado da conversa fora do servidor.
      </>
    ),

    types: "Os 4 tipos de mensagem",
    typesDesc: (
      <>
        Todos usam {c('POST /messages')} com {c('"messaging_product": "whatsapp"')}. A janela de 24h
        conta a partir da última mensagem enviada pelo usuário.
      </>
    ),
    typeRows: [
      { type: "text", label: "Texto simples", note: "Suporta *negrito*, _itálico_, `código`", window: "Qualquer hora" },
      { type: "button", label: "Botões", note: "Máx 3 botões, title até 20 chars", window: "24h" },
      { type: "list", label: "Lista", note: "4-10 opções em seções com modal", window: "24h" },
      { type: "carousel", label: "Carrossel", note: "2-10 cards com imagem + botão", window: "24h, ≥ 2 cards" },
    ],

    buttons: "Botões interativos",
    buttonsDesc: (
      <>
        O campo {c("reply.id")} é retornado exato no webhook — use-o para identificar a ação sem
        estado no servidor.
      </>
    ),

    ids: "IDs como máquina de estado",
    idsDesc: (
      <>
        A forma mais limpa de gerenciar fluxo de conversa é codificar a ação direto no {c("id")} do
        botão com prefixos. No webhook, parse o prefixo e execute a ação — o botão carrega a
        intenção, o servidor não precisa guardar nada.
      </>
    ),

    checklist: "Checklist essencial",
    checklistItems: [
      <>Credenciais em variáveis de ambiente, nunca no código</>,
      <>Responder ao webhook com HTTP 200 imediatamente — a Meta retenta se não receber em 20s</>,
      <>Deduplicar por {c("message.id")} — a Meta pode entregar a mesma mensagem mais de uma vez</>,
      <>Envolver sends interativos em {c("try/catch")} com fallback para texto simples</>,
      <>Carrossel: mínimo 2 cards, todos com o mesmo número de botões, imagens JPEG 1:1</>,
    ],

    download: "Referência completa",
    downloadDesc: (
      <>
        O arquivo cobre todos os payloads com limites exatos, estrutura do webhook para cada tipo
        (incluindo a diferença do {c("carousel quick_reply")}), estratégia de fallback e regras de
        imagem para carrossel.
      </>
    ),
    downloadBtn: "Baixar referência (.md)",
  },
  EN: {
    title: "Interactive messages with the WhatsApp Cloud API",
    intro: (
      <>
        Meta&apos;s official WhatsApp API lets you send native buttons, lists, and carousels — no
        middleware BSP required. Here&apos;s what you need to integrate and the ID pattern that keeps
        conversation state off the server.
      </>
    ),

    types: "The 4 message types",
    typesDesc: (
      <>
        All types use {c('POST /messages')} with {c('"messaging_product": "whatsapp"')}. The 24h
        window starts from the user&apos;s last message.
      </>
    ),
    typeRows: [
      { type: "text", label: "Plain text", note: "Supports *bold*, _italic_, `code`", window: "Any time" },
      { type: "button", label: "Buttons", note: "Max 3 buttons, title up to 20 chars", window: "24h" },
      { type: "list", label: "List", note: "4-10 options in sections with modal", window: "24h" },
      { type: "carousel", label: "Carousel", note: "2-10 cards with image + button", window: "24h, ≥ 2 cards" },
    ],

    buttons: "Interactive buttons",
    buttonsDesc: (
      <>
        The {c("reply.id")} field is returned exactly as sent in the webhook — use it to identify
        the action without any server-side state.
      </>
    ),

    ids: "IDs as a state machine",
    idsDesc: (
      <>
        The cleanest way to manage conversation flow is to encode the action directly in the button{" "}
        {c("id")} with prefixes. In the webhook, parse the prefix and execute the action — the
        button carries the intent, no server state needed.
      </>
    ),

    checklist: "Essential checklist",
    checklistItems: [
      <>Credentials in environment variables, never in code</>,
      <>Respond to the webhook with HTTP 200 immediately — Meta retries if it doesn&apos;t receive a response in 20s</>,
      <>Deduplicate by {c("message.id")} — Meta may deliver the same message more than once</>,
      <>Wrap interactive sends in {c("try/catch")} with plain text fallback</>,
      <>Carousel: minimum 2 cards, all with the same number of buttons, JPEG 1:1 images</>,
    ],

    download: "Full reference",
    downloadDesc: (
      <>
        The file covers all payloads with exact character limits, webhook structure for each type
        (including the {c("carousel quick_reply")} difference), fallback strategy, and carousel
        image rules.
      </>
    ),
    downloadBtn: "Download reference (.md)",
  },
  ES: {
    title: "Mensajes interactivos con la WhatsApp Cloud API",
    intro: (
      <>
        La API oficial de WhatsApp — Cloud API de Meta — permite enviar botones, listas y carruseles
        nativos sin BSP intermediario. Aquí va lo esencial para integrar y el patrón que mantiene el
        estado de conversación fuera del servidor.
      </>
    ),

    types: "Los 4 tipos de mensaje",
    typesDesc: (
      <>
        Todos usan {c('POST /messages')} con {c('"messaging_product": "whatsapp"')}. La ventana de 24h
        comienza desde el último mensaje del usuario.
      </>
    ),
    typeRows: [
      { type: "text", label: "Texto simple", note: "Soporta *negrita*, _cursiva_, `código`", window: "Cualquier hora" },
      { type: "button", label: "Botones", note: "Máx 3 botones, title hasta 20 chars", window: "24h" },
      { type: "list", label: "Lista", note: "4-10 opciones en secciones con modal", window: "24h" },
      { type: "carousel", label: "Carrusel", note: "2-10 cards con imagen + botón", window: "24h, ≥ 2 cards" },
    ],

    buttons: "Botones interactivos",
    buttonsDesc: (
      <>
        El campo {c("reply.id")} se devuelve exacto en el webhook — úsalo para identificar la acción
        sin estado en el servidor.
      </>
    ),

    ids: "IDs como máquina de estado",
    idsDesc: (
      <>
        La forma más limpia de gestionar el flujo de conversación es codificar la acción
        directamente en el {c("id")} del botón con prefijos. En el webhook, parsea el prefijo y
        ejecuta la acción — el botón lleva la intención, el servidor no necesita guardar nada.
      </>
    ),

    checklist: "Checklist esencial",
    checklistItems: [
      <>Credenciales en variables de entorno, nunca en el código</>,
      <>Responder al webhook con HTTP 200 inmediatamente — Meta reintenta si no recibe respuesta en 20s</>,
      <>Deduplicar por {c("message.id")} — Meta puede entregar el mismo mensaje más de una vez</>,
      <>Envolver sends interactivos en {c("try/catch")} con fallback a texto simple</>,
      <>Carrusel: mínimo 2 cards, todos con el mismo número de botones, imágenes JPEG 1:1</>,
    ],

    download: "Referencia completa",
    downloadDesc: (
      <>
        El archivo cubre todos los payloads con límites exactos, estructura del webhook para cada
        tipo (incluida la diferencia del {c("carousel quick_reply")}), estrategia de fallback e
        imágenes para carrusel.
      </>
    ),
    downloadBtn: "Descargar referencia (.md)",
  },
}

type ArticleContentProps = {
  codeEndpoint: React.ReactNode
  codeButtons: React.ReactNode
  codeIds: React.ReactNode
}

export function ArticleContent({ codeEndpoint, codeButtons, codeIds }: ArticleContentProps) {
  const params = useParams()
  const router = useRouter()
  const locale = (params.locale as string) ?? 'en'
  const language: Language = localeToLanguage(locale)
  const t = translations[language]

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden">
      <main className="mx-auto w-full max-w-(--breakpoint-sm) flex-1 px-4 py-12 leading-relaxed sm:py-20">
        <header>
          <div className="mb-24 flex min-h-9 w-full select-none items-center justify-between gap-2">
            <Link
              href={`/${locale}`}
              className="group flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary transition-[scale,background-color] duration-200 ease-out hover:bg-gray-300 active:scale-[0.96]"
              aria-label="Home"
            >
              <Undo2 className="mr-0.5 size-4 text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground" strokeWidth={1.5} />
            </Link>
            <CopyLinkButton />
          </div>
        </header>

        <article>
          <h1 className="mb-2 w-fit scroll-mt-20 text-balance font-[550] text-foreground" id="whatsapp-cloud-api">
            {t.title}
          </h1>

          <p className="w-full text-pretty text-muted-foreground">{t.intro}</p>

          <Divider />

          <SectionHeading id="types">{t.types}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.typesDesc}</p>

          <div className="my-8 w-full overflow-hidden rounded-xl border">
            <div className="grid w-full grid-cols-1">
              {t.typeRows.map((row, i) => (
                <div
                  key={row.type}
                  className={`grid grid-cols-[auto_1fr_auto] items-start gap-3 px-4 py-3 ${i < t.typeRows.length - 1 ? "border-b" : ""}`}
                >
                  <span className="font-mono text-sm font-medium text-foreground">{row.label}</span>
                  <span className="text-sm text-muted-foreground">{row.note}</span>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    {row.window}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {codeEndpoint}

          <Divider />

          <SectionHeading id="buttons">{t.buttons}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.buttonsDesc}</p>

          {codeButtons}

          <Divider />

          <SectionHeading id="state-machine">{t.ids}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.idsDesc}</p>

          {codeIds}

          <Divider />

          <SectionHeading id="checklist">{t.checklist}</SectionHeading>

          <ul className="mt-4 flex w-full flex-col gap-2">
            {t.checklistItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                <span className="mt-[5px] size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                <span className="text-pretty">{item}</span>
              </li>
            ))}
          </ul>

          <Divider />

          <SectionHeading id="download">{t.download}</SectionHeading>

          <p className="mb-6 w-full text-pretty text-muted-foreground">{t.downloadDesc}</p>

          <a
            href="/downloads/whatsapp-cloud-api-interactive-messages.md"
            download
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-secondary"
          >
            <Download className="size-4 text-muted-foreground" strokeWidth={1.5} />
            {t.downloadBtn}
          </a>
        </article>
      </main>
      <Footer
        language={language}
        onLanguageChange={(lang) => {
          const path = window.location.pathname.replace(/^\/(en|pt-br|es)/, '') || '/'
          router.push(`/${languageToLocale[lang]}${path}`, { scroll: false })
        }}
      />
    </div>
  )
}

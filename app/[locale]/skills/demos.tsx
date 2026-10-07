"use client"

import * as React from "react"
import type { Language } from "@/lib/locale"

/*
 * One small before/after per interface skill: the same piece of interface
 * as it usually ships, then as it comes back after the skill ran. Each demo
 * is a pure function of `after` and the language, so the frame around it
 * owns the toggle and every demo stays a few lines of markup.
 *
 * Built on the site's own grays, which flip with the theme, plus one accent.
 */

type Demo = (props: { after: boolean; lang: Language }) => React.ReactNode

const tr = (lang: Language, PT: string, EN: string, ES: string) => (lang === "PT" ? PT : lang === "ES" ? ES : EN)

const mono = "font-mono text-[12px] leading-5"

/* ── designer ─────────────────────────────────────────────────────────── */

const designer: Demo = ({ after, lang }) =>
  after ? (
    <div className="w-full max-w-md overflow-x-auto">
      <table className={`w-full text-left ${mono}`}>
        <thead className="text-gray-1000">
          <tr>
            {[tr(lang, "Sev.", "Sev.", "Sev."), tr(lang, "Domínio", "Domain", "Dominio"), tr(lang, "Local", "Location", "Lugar"), "Fix"].map((h) => (
              <th key={h} className="pr-3 pb-1.5 font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-1200">
          {[
            ["ALTO", "a11y", "dialog.tsx:42", tr(lang, "Nome no botão de ícone", "Name the icon button", "Nombre en el botón de ícono")],
            ["ALTO", "layout", "checkout.tsx:86", tr(lang, "Deixar o botão encolher", "Let the button shrink", "Dejar que el botón se encoja")],
            ["MÉDIO", "type", "summary.tsx:24", tr(lang, "Quebrar nomes longos", "Wrap long names", "Ajustar nombres largos")],
          ].map((r) => (
            <tr key={r[2]} className="border-t">
              {r.map((c, i) => (
                <td key={i} className={`py-1.5 pr-3 whitespace-nowrap ${i === 0 ? (c === "ALTO" ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400") : ""}`}>
                  {lang !== "PT" && i === 0 ? (c === "ALTO" ? "HIGH" : "MEDIUM") : c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className={`w-full max-w-md text-gray-1100 ${mono}`}>
      <p className="text-gray-1200">{tr(lang, "Parece bom! Algumas sugestões:", "Looks good! A few suggestions:", "¡Se ve bien! Algunas sugerencias:")}</p>
      <p>- {tr(lang, "melhorar o contraste", "improve the contrast", "mejorar el contraste")}</p>
      <p>- {tr(lang, "ajustar alguns espaçamentos", "adjust some spacing", "ajustar algunos espacios")}</p>
      <p>- {tr(lang, "talvez revisar os textos", "maybe review the copy", "quizás revisar los textos")}</p>
    </div>
  )

/* ── polish ───────────────────────────────────────────────────────────── */

const polish: Demo = ({ after, lang }) => (
  <div
    className={`w-56 p-2 transition-[border-radius,box-shadow] duration-200 ease-out ${after ? "rounded-[20px] bg-gray-200 shadow-custom" : "rounded-[12px] border border-gray-700 bg-gray-200"}`}
  >
    <div className={`flex flex-col gap-3 bg-preview-bg p-3 transition-[border-radius] duration-200 ease-out ${after ? "rounded-[12px] shadow-custom" : "rounded-[12px] border border-gray-700"}`}>
      <div
        className={`aspect-[16/9] rounded-[6px] bg-gradient-to-br from-sky-200 to-white dark:from-sky-900 dark:to-gray-300 ${after ? "outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10" : ""}`}
      />
      <span className="text-[13px] font-medium text-gray-1200">{tr(lang, "Relatório de março", "March report", "Informe de marzo")}</span>
      <button
        type="button"
        className={`h-8 cursor-pointer rounded-[8px] bg-gray-1200 text-[12px] font-medium text-gray-100 transition-transform duration-150 ease-out ${after ? "active:scale-[0.96]" : "active:scale-[0.85]"}`}
      >
        {tr(lang, "Baixar", "Download", "Descargar")}
      </button>
    </div>
  </div>
)

/* ── typography ───────────────────────────────────────────────────────── */

const typography: Demo = ({ after, lang }) => (
  <div className="flex flex-col gap-4" style={{ width: 230 }}>
    <p
      className="text-[17px] leading-snug font-medium text-gray-1200"
      style={{ textWrap: after ? "balance" : "wrap", WebkitFontSmoothing: after ? "antialiased" : "auto" }}
    >
      {tr(lang, "Os detalhes que fazem uma interface parecer certa", "The details that make an interface feel right", "Los detalles que hacen que una interfaz se sienta bien")}
    </p>
    <div className={`flex items-baseline justify-between text-[14px] text-gray-1100 ${after ? "tabular-nums" : ""}`}>
      <span>Total</span>
      <span className="text-gray-1200">R$ 1.111,10</span>
    </div>
    <div className={`flex items-baseline justify-between text-[14px] text-gray-1100 ${after ? "tabular-nums" : ""}`}>
      <span>{tr(lang, "Imposto", "Tax", "Impuesto")}</span>
      <span className="text-gray-1200">R$ 888,80</span>
    </div>
  </div>
)

/* ── color ────────────────────────────────────────────────────────────── */

const HUES = [30, 150, 250, 320]

const color: Demo = ({ after }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="flex items-end gap-3">
      {HUES.map((h) => (
        <span key={h} className="flex flex-col items-center gap-2">
          <span
            className="h-24 w-9 rounded-full outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
            style={{ background: after ? `oklch(0.6 0.15 ${h})` : `hsl(${h} 100% 50%)` }}
          />
          <span className={`${mono} text-[10px] text-gray-1000`}>{after ? `oklch .6 .15 ${h}` : `hsl ${h} 50%`}</span>
        </span>
      ))}
    </div>
  </div>
)

/* ── a11y ─────────────────────────────────────────────────────────────── */

const a11y: Demo = ({ after, lang }) => (
  <form className="flex w-60 flex-col gap-2.5" onSubmit={(e) => e.preventDefault()}>
    {after && (
      <label htmlFor="sk-email" className="text-[12px] font-medium text-gray-1100">
        E-mail
      </label>
    )}
    <input
      id="sk-email"
      aria-label={after ? undefined : "e-mail"}
      placeholder={after ? "voce@empresa.com" : "E-mail"}
      aria-invalid={after}
      aria-describedby={after ? "sk-email-error" : undefined}
      className={`h-9 rounded-[8px] bg-preview-bg px-3 text-[16px] text-gray-1200 outline-none placeholder:text-gray-900 sm:text-[13px] ${after ? "shadow-[0_0_0_1px_var(--color-red-500)] focus-visible:shadow-[0_0_0_2px_var(--color-blue-500)]" : "shadow-custom"}`}
    />
    {after && (
      <p id="sk-email-error" className="text-[11px] text-red-600 dark:text-red-400">
        {tr(lang, "Digite um e-mail com @, como voce@empresa.com.", "Enter an email with an @, like you@company.com.", "Escribe un correo con @, como tu@empresa.com.")}
      </p>
    )}
    <button
      type="submit"
      className={`h-9 cursor-pointer rounded-[8px] text-[13px] font-medium outline-none ${after ? "bg-gray-1200 text-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" : "bg-gray-400 text-gray-800"}`}
    >
      {tr(lang, "Criar conta", "Create account", "Crear cuenta")}
    </button>
  </form>
)

/* ── layout ───────────────────────────────────────────────────────────── */

const layout: Demo = ({ after, lang }) => {
  const rows = [
    [tr(lang, "Nome", "Name", "Nombre"), "Ana Souza"],
    ["E-mail", "ana@acme.com"],
    [tr(lang, "Plano", "Plan", "Plan"), "Pro"],
    [tr(lang, "Cobrança", "Billing", "Cobro"), tr(lang, "Mensal", "Monthly", "Mensual")],
  ]
  return after ? (
    <div className="flex w-64 flex-col gap-5 text-[13px]">
      {[rows.slice(0, 2), rows.slice(2)].map((group, g) => (
        <div key={g} className="flex flex-col gap-2">
          <span className="text-[11px] font-medium tracking-[0.05em] text-gray-1000 uppercase">{g === 0 ? tr(lang, "Conta", "Account", "Cuenta") : tr(lang, "Assinatura", "Subscription", "Suscripción")}</span>
          {group.map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-gray-1100">{k}</span>
              <span className="text-gray-1200">{v}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ) : (
    <div className="flex w-64 flex-col text-[13px]">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between border-b border-gray-700 py-1">
          <span className="text-gray-1100">{k}:</span>
          <span className="text-gray-1200">{v}</span>
        </div>
      ))}
    </div>
  )
}

/* ── microcopy ────────────────────────────────────────────────────────── */

const microcopy: Demo = ({ after, lang }) => (
  <div className="flex w-64 flex-col gap-1.5 rounded-[12px] bg-preview-bg p-4 shadow-custom">
    <span className="text-[14px] font-medium text-gray-1200">
      {after ? tr(lang, "Excluir o site Marketing?", "Delete Marketing site?", "¿Eliminar el sitio Marketing?") : tr(lang, "Tem certeza?", "Are you sure?", "¿Estás seguro?")}
    </span>
    <span className="text-[12px] leading-[1.5] text-gray-1100">
      {after
        ? tr(lang, "Isso remove 24 páginas. Não dá pra desfazer.", "Deleting removes 24 pages. This can't be undone.", "Esto elimina 24 páginas. No se puede deshacer.")
        : tr(lang, "Essa ação não pode ser desfeita. Confirme para continuar.", "This action cannot be undone. Please confirm to continue.", "Esta acción no se puede deshacer. Confirma para continuar.")}
    </span>
    <div className="mt-2 flex justify-end gap-2 text-[12px] font-medium">
      <span className="rounded-[6px] px-2.5 py-1.5 text-gray-1200 shadow-custom">{after ? tr(lang, "Cancelar", "Cancel", "Cancelar") : tr(lang, "Não", "No", "No")}</span>
      <span className={`rounded-[6px] px-2.5 py-1.5 ${after ? "bg-red-600 text-white" : "bg-gray-1200 text-gray-100"}`}>
        {after ? tr(lang, "Excluir", "Delete", "Eliminar") : "OK"}
      </span>
    </div>
  </div>
)

/* ── variant ──────────────────────────────────────────────────────────── */

const VARIANTS = ["compact", "balanced", "airy"] as const

function Plan({ kind, lang }: { kind: (typeof VARIANTS)[number]; lang: Language }) {
  const pad = kind === "compact" ? "p-2.5 gap-1" : kind === "balanced" ? "p-3.5 gap-2" : "p-5 gap-3"
  return (
    <div className={`flex w-44 flex-col rounded-[12px] bg-preview-bg shadow-custom ${pad}`}>
      <span className="text-[12px] text-gray-1000">Pro</span>
      <span className={`font-medium text-gray-1200 tabular-nums ${kind === "airy" ? "text-[22px]" : "text-[17px]"}`}>R$ 49</span>
      {kind !== "compact" && <span className="text-[11px] text-gray-1100">{tr(lang, "Projetos ilimitados", "Unlimited projects", "Proyectos ilimitados")}</span>}
      <span className="mt-1 rounded-[6px] bg-gray-1200 py-1 text-center text-[11px] font-medium text-gray-100">{tr(lang, "Assinar", "Subscribe", "Suscribir")}</span>
    </div>
  )
}

function VariantDemo({ after, lang }: { after: boolean; lang: Language }) {
  const [v, setV] = React.useState(1)
  if (!after) return <Plan kind="balanced" lang={lang} />
  return (
    <div className="flex flex-col items-center gap-4">
      <Plan kind={VARIANTS[v]!} lang={lang} />
      <div className="flex gap-1 rounded-full bg-[rgb(20_20_20/0.9)] p-1 font-mono text-[11px]" role="group" aria-label="Variants">
        {VARIANTS.map((name, i) => (
          <button
            key={name}
            type="button"
            aria-pressed={i === v}
            onClick={() => setV(i)}
            className={`cursor-pointer rounded-full px-2.5 py-1 ${i === v ? "bg-white/20 text-white" : "text-white/60 hover:text-white/85"}`}
          >
            ?v={String.fromCharCode(97 + i)}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── teardown ─────────────────────────────────────────────────────────── */

const teardown: Demo = ({ after, lang }) =>
  after ? (
    <pre className={`max-w-full overflow-x-auto text-gray-1100 ${mono}`}>
      <span className="text-gray-1200">## {tr(lang, "Mecanismo", "Breakdown", "Mecanismo")}</span>
      {"\n"}
      {`${tr(lang, "sai  ", "out  ", "sale ")}  opacity 1→0   scale 1→0.25   blur 0→4px\n`}
      {`${tr(lang, "entra", "in   ", "entra")}  opacity 0→1   scale 0.25→1   blur 4px→0\n`}
      {`${tr(lang, "mola ", "curve", "curva")}  spring, bounce 0, 300ms\n\n`}
      <span className="text-gray-1000">{tr(lang, "medido no CSS computado, curva deduzida", "measured from computed CSS, curve inferred", "medido en el CSS computado, curva deducida")}</span>
    </pre>
  ) : (
    <div className="flex items-center gap-2 rounded-full bg-preview-bg px-3.5 py-2 text-[13px] font-medium text-gray-1200 shadow-custom">
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15V5a2 2 0 0 1 2-2h8" />
      </svg>
      {tr(lang, "Copiar página", "Copy page", "Copiar página")}
    </div>
  )

/* ── break ────────────────────────────────────────────────────────────── */

function Problem({ title, count, broken }: { title: string; count: string; broken?: boolean }) {
  return (
    <div className={`flex w-full items-center gap-2 rounded-[8px] bg-preview-bg px-2.5 py-1.5 shadow-custom ${broken ? "outline outline-1 outline-red-500" : ""}`}>
      <span className="font-mono text-[10px] text-gray-1000">PRB-128</span>
      <span className="min-w-0 flex-1 truncate text-[12px] text-gray-1200">{title}</span>
      <span className="text-[11px] text-gray-1100 tabular-nums">{count}</span>
    </div>
  )
}

const breakDemo: Demo = ({ after, lang }) =>
  after ? (
    <div className="flex w-64 flex-col gap-2">
      {[
        { label: tr(lang, "típico", "typical", "típico"), title: tr(lang, "Checkout falha", "Checkout fails", "Checkout falla"), count: "128" },
        { label: tr(lang, "60 caracteres", "60 characters", "60 caracteres"), title: tr(lang, "Checkout falha quando um cliente antigo aplica desconto numa assinatura", "Checkout fails when a returning customer applies a discount to a subscription", "Checkout falla cuando un cliente antiguo aplica descuento a una suscripción"), count: "128" },
        { label: tr(lang, "título vazio", "empty title", "título vacío"), title: "", count: "128", broken: true },
      ].map((s) => (
        <div key={s.label} className="flex flex-col gap-1">
          <span className="font-mono text-[10px] text-gray-1000">
            {s.label}
            {s.broken && <span className="text-red-600 dark:text-red-400"> · {tr(lang, "o card encolhe, sem texto de reserva", "the card collapses, no fallback text", "la tarjeta se encoge, sin texto de reserva")}</span>}
          </span>
          <Problem title={s.title} count={s.count} broken={s.broken} />
        </div>
      ))}
    </div>
  ) : (
    <div className="w-64">
      <Problem title={tr(lang, "Checkout falha", "Checkout fails", "Checkout falla")} count="128" />
    </div>
  )

/* ── states ───────────────────────────────────────────────────────────── */

const STATES = ["loading", "empty", "populated", "error"] as const

function StatesDemo({ after, lang }: { after: boolean; lang: Language }) {
  const [s, setS] = React.useState<(typeof STATES)[number]>("populated")
  const state = after ? s : "populated"
  const label = (x: (typeof STATES)[number]) =>
    ({
      loading: tr(lang, "Carregando", "Loading", "Cargando"),
      empty: tr(lang, "Vazio", "Empty", "Vacío"),
      populated: tr(lang, "Com dados", "Populated", "Con datos"),
      error: tr(lang, "Erro", "Error", "Error"),
    })[x]
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex h-24 w-60 flex-col justify-center gap-1.5 rounded-[12px] bg-preview-bg p-3 shadow-custom text-[12px]">
        {state === "loading" &&
          [0, 1, 2].map((i) => <span key={i} className="h-5 animate-pulse rounded-[6px] bg-gray-300 motion-reduce:animate-none" />)}
        {state === "empty" && (
          <span className="text-center text-gray-1100">
            {tr(lang, "Nenhum problema. Quando algo quebrar, aparece aqui.", "No problems. When something breaks, it shows up here.", "Sin problemas. Cuando algo se rompa, aparece aquí.")}
          </span>
        )}
        {state === "populated" &&
          [tr(lang, "Checkout falha com desconto", "Checkout fails with a discount", "Checkout falla con descuento"), tr(lang, "Busca devolve dado velho", "Search returns stale results", "La búsqueda devuelve datos viejos"), tr(lang, "Upload de avatar expira", "Avatar upload times out", "La subida del avatar expira")].map((t) => (
            <span key={t} className="truncate text-gray-1200">
              {t}
            </span>
          ))}
        {state === "error" && (
          <span className="text-center text-red-600 dark:text-red-400">
            {tr(lang, "Não deu pra carregar. Tentar de novo", "Couldn't load. Try again", "No se pudo cargar. Reintentar")}
          </span>
        )}
      </div>
      {after && (
        <div className="flex gap-0.5 rounded-full bg-[rgb(20_20_20/0.9)] p-1 text-[11px]" role="group" aria-label="States">
          {STATES.map((x) => (
            <button
              key={x}
              type="button"
              aria-pressed={x === s}
              onClick={() => setS(x)}
              className={`cursor-pointer rounded-full px-2.5 py-1 ${x === s ? "bg-white/15 text-white" : "text-white/60 hover:text-white/85"}`}
            >
              {label(x)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── handoff ──────────────────────────────────────────────────────────── */

const handoff: Demo = ({ after, lang }) =>
  after ? (
    <div className="w-full max-w-md overflow-x-auto">
      <table className={`w-full text-left ${mono}`}>
        <thead className="text-gray-1000">
          <tr>
            {[tr(lang, "Elemento", "Element", "Elemento"), "Design", tr(lang, "Construído", "Built", "Construido"), "Status"].map((h) => (
              <th key={h} className="pr-3 pb-1.5 font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-1200">
          {[
            ["Padding", "20px", "p-5", tr(lang, "bate", "matches", "coincide")],
            [tr(lang, "Título", "Title", "Título"), "15px", "text-sm", tr(lang, "arredondado", "rounded", "redondeado")],
            ["Badge", "pill", "label", tr(lang, "perguntado", "asked", "preguntado")],
          ].map((r) => (
            <tr key={r[0]} className="border-t">
              {r.map((c, i) => (
                <td key={i} className="py-1.5 pr-3 whitespace-nowrap">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="flex w-56 flex-col gap-2 rounded-[10px] border border-dashed border-gray-800 p-3">
      <span className={`${mono} text-[10px] text-gray-1000`}>Figma · node 12:345</span>
      <span className="h-3 w-28 rounded bg-gray-400" />
      <span className="h-3 w-40 rounded bg-gray-300" />
      <span className="mt-1 h-7 w-20 rounded-full bg-gray-1200" />
    </div>
  )

export const DEMOS: Record<string, (props: { after: boolean; lang: Language }) => React.ReactNode> = {
  designer,
  polish,
  typography,
  color,
  a11y,
  layout,
  microcopy,
  variant: (p) => <VariantDemo {...p} />,
  teardown,
  break: breakDemo,
  states: (p) => <StatesDemo {...p} />,
  handoff,
}

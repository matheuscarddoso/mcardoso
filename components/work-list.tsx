"use client"

import * as React from "react"
import Link from "next/link"
import type { Language } from "@/components/footer"

type Localized = Record<Language, string>

type Article = {
  slug: string
  year: string
  title: Localized
  description: Localized
  glyph: React.ReactNode
}

function GlyphDots() {
  return (
    <div className="flex flex-col items-center gap-[3px]">
      <span className="size-1 rounded-full bg-current" />
      <div className="flex gap-[3px]">
        <span className="size-1 rounded-full bg-current" />
        <span className="size-1 rounded-full bg-current" />
      </div>
      <div className="flex gap-[3px]">
        <span className="size-1 rounded-full bg-current" />
        <span className="size-1 rounded-full bg-current" />
        <span className="size-1 rounded-full bg-current" />
      </div>
    </div>
  )
}

function GlyphSwatches() {
  return (
    <div className="flex gap-[3px]">
      <span className="size-2 rounded-[3px] bg-current" />
      <span className="size-2 rounded-[3px] bg-current opacity-60" />
      <span className="size-2 rounded-[3px] bg-current opacity-30" />
    </div>
  )
}

function GlyphDescending() {
  return (
    <div className="flex w-[18px] flex-col gap-[3px]">
      <span className="h-[3px] w-full rounded-full bg-current" />
      <span className="h-[3px] w-3.5 rounded-full bg-current" />
      <span className="h-[3px] w-2.5 rounded-full bg-current opacity-60" />
      <span className="h-[3px] w-1.5 rounded-full bg-current opacity-60" />
    </div>
  )
}

function GlyphMessage() {
  return (
    <div className="flex w-[18px] flex-col gap-[3px]">
      <span className="h-2 w-full rounded-[3px] bg-current opacity-50" />
      <div className="flex gap-[3px]">
        <span className="h-[5px] flex-1 rounded-[2px] bg-current" />
        <span className="h-[5px] flex-1 rounded-[2px] bg-current" />
      </div>
    </div>
  )
}

/** Newest first — the year gutter only prints on the first row of each group. */
const articles: Article[] = [
  {
    slug: "whatsapp-cloud-api",
    year: "2026",
    title: {
      PT: "Mensagens interativas com a WhatsApp Cloud API",
      EN: "Interactive messages with the WhatsApp Cloud API",
      ES: "Mensajes interactivos con la WhatsApp Cloud API",
    },
    description: {
      PT: "Botões e listas no WhatsApp",
      EN: "Buttons and lists on WhatsApp",
      ES: "Botones y listas en WhatsApp",
    },
    glyph: <GlyphMessage />,
  },
  {
    slug: "saving-claude-tokens",
    year: "2026",
    title: {
      PT: "Como economizar tokens do Claude Code",
      EN: "How to save Claude Code tokens",
      ES: "Cómo ahorrar tokens de Claude Code",
    },
    description: {
      PT: "Gaste menos, entregue mais",
      EN: "Spend fewer tokens, ship more",
      ES: "Gasta menos, entrega más",
    },
    glyph: <GlyphDescending />,
  },
  {
    slug: "oklch-colors",
    year: "2026",
    title: {
      PT: "O que são cores OKLCH?",
      EN: "What are OKLCH colors?",
      ES: "¿Qué son los colores OKLCH?",
    },
    description: {
      PT: "Um espaço de cor melhor",
      EN: "A better color space for UI",
      ES: "Un espacio de color mejor",
    },
    glyph: <GlyphSwatches />,
  },
  {
    slug: "invisible-details",
    year: "2026",
    title: {
      PT: "Detalhes invisíveis",
      EN: "Invisible details",
      ES: "Detalles invisibles",
    },
    description: {
      PT: "O que ninguém nota, mas sente",
      EN: "What nobody notices, but feels",
      ES: "Lo que nadie nota, pero siente",
    },
    glyph: <GlyphDots />,
  },
]

export function WorkList({ language, locale }: { language: Language; locale: string }) {
  return (
    <div className="group/list flex flex-col">
      {articles.map((article, index) => {
        const startsYear = index === 0 || articles[index - 1].year !== article.year
        return (
          <div
            key={article.slug}
            className="grid grid-cols-[2.75rem_1fr] items-center gap-3 sm:grid-cols-[3.25rem_1fr]"
          >
            <span className="text-[15px] text-gray-1000 tabular-nums">
              {startsYear ? article.year : null}
            </span>
            <Link
              href={`/${locale}/work/${article.slug}`}
              // Hovering the list dims every row; the hovered one stays lit.
              className="group/row flex min-w-0 items-center gap-3 py-2.5 transition-[opacity,transform] duration-300 ease-out group-hover/list:opacity-35 group-hover/list:hover:opacity-100 active:scale-[0.99] active:duration-150 active:ease-[var(--ease-out-strong)] motion-reduce:active:scale-100"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[7px] bg-preview-bg text-gray-800 shadow-custom transition-[color,transform,box-shadow] duration-300 ease-[var(--ease-out-strong)] group-hover/row:scale-[1.06] group-hover/row:text-gray-1000 group-hover/row:shadow-custom-hover">
                {article.glyph}
              </span>
              <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="truncate text-[15px] font-[450] text-gray-1200">
                  {article.title[language]}
                </span>
                <span className="truncate text-[15px] text-gray-1000 sm:text-right">
                  {article.description[language]}
                </span>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

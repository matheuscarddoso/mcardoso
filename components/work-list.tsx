"use client"

import * as React from "react"
import Link from "next/link"
import { articles } from "@/lib/articles"
import type { Language } from "@/components/footer"

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

function GlyphBubbles() {
  return (
    <div className="flex items-end gap-[3px]">
      <span className="size-1.5 rounded-full bg-current opacity-50" />
      <span className="size-2.5 rounded-full bg-current" />
      <span className="size-1 rounded-full bg-current opacity-40" />
    </div>
  )
}

/**
 * Copy and dates live in `lib/articles` — the sitemap, page metadata and
 * JSON-LD all read the same rows, so a title can only be written once. Glyphs
 * stay here: they are JSX, and nothing on the server side needs them.
 */
const GLYPHS: Record<string, React.ReactNode> = {
  "ai-bubble": <GlyphBubbles />,
  "whatsapp-cloud-api": <GlyphMessage />,
  "saving-claude-tokens": <GlyphDescending />,
  "oklch-colors": <GlyphSwatches />,
  "invisible-details": <GlyphDots />,
}

export function WorkList({ language, locale }: { language: Language; locale: string }) {
  return (
    <ul className="group/list flex flex-col">
      {articles.map((article, index) => {
        const startsYear = index === 0 || articles[index - 1].year !== article.year
        return (
          <li
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
                {GLYPHS[article.slug]}
              </span>
              <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <h3 className="truncate text-[15px] font-[450] text-gray-1200">
                  {article.title[language]}
                </h3>
                <span className="truncate text-[15px] text-gray-1000 sm:text-right">
                  {article.description[language]}
                </span>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TECH_MARKS, type TechName } from "@/lib/tech-marks";
import type { Language } from "@/lib/locale";

/**
 * What I work with, grouped. Drawn from the résumé and from what is actually
 * in daily use, which are not the same list and both belong here.
 *
 * To change it, edit `ROWS`. A name with a brand mark goes in as a string and
 * has to exist in `scripts/build-tech-marks.mjs`; the marks file is generated,
 * so hand-editing it is undone by the next run.
 *
 * A name with no mark available goes in as `{ label }` and prints as text.
 * That escape hatch exists on purpose: simple-icons has no Java, no RxJS and
 * no AWS, and a skills list that quietly drops what nobody drew an icon for is
 * a list edited by an icon set.
 */

type Item = TechName | { label: string };

type Row = {
  /** Key into `labels`, so the heading of the row translates. */
  key: "language" | "frontend" | "backend" | "data" | "infra" | "tools";
  items: readonly Item[];
};

const ROWS: readonly Row[] = [
  {
    key: "language",
    items: [
      "typescript",
      "javascript",
      "php",
      "ruby",
      "dart",
      { label: "Java" },
      { label: "SQL" },
    ],
  },
  {
    key: "frontend",
    items: [
      "angular",
      { label: "RxJS" },
      "ngrx",
      "react",
      "nextdotjs",
      "flutter",
      "tailwindcss",
      "shadcnui",
      "alpinedotjs",
      "bootstrap",
      "jquery",
    ],
  },
  {
    key: "backend",
    items: [
      "laravel",
      "nestjs",
      "nodedotjs",
      "rubyonrails",
      "quarkus",
      "prisma",
    ],
  },
  { key: "data", items: ["postgresql", "mariadb", "redis", "firebase"] },
  {
    key: "infra",
    items: [
      "docker",
      { label: "AWS" },
      "nginx",
      "linux",
      "vercel",
      "railway",
      "keycloak",
      "jsonwebtokens",
      { label: "OAuth" },
    ],
  },
  {
    key: "tools",
    items: [
      "git",
      "github",
      "vite",
      "swagger",
      { label: "Pest" },
      "cursor",
      "claude",
      "githubcopilot",
    ],
  },
];

/** Rows shown before the list is opened. */
const COLLAPSED = 3;

const labels: Record<Language, Record<Row["key"], string>> = {
  PT: {
    language: "Linguagem",
    frontend: "Frontend",
    backend: "Backend",
    data: "Dados",
    infra: "Infraestrutura",
    tools: "Ferramentas",
  },
  EN: {
    language: "Language",
    frontend: "Frontend",
    backend: "Backend",
    data: "Data",
    infra: "Infrastructure",
    tools: "Tools",
  },
  ES: {
    language: "Lenguaje",
    frontend: "Frontend",
    backend: "Backend",
    data: "Datos",
    infra: "Infraestructura",
    tools: "Herramientas",
  },
};

const toggle: Record<Language, { more: string; less: string }> = {
  PT: { more: "Ver mais", less: "Ver menos" },
  EN: { more: "See more", less: "See less" },
  ES: { more: "Ver más", less: "Ver menos" },
};

/* Same register as the theme tray and the photo deck. */
const SPRING = { type: "spring" as const, duration: 0.42, bounce: 0.12 };

function Tech({ item }: { item: Item }) {
  const mark = typeof item === "string" ? TECH_MARKS[item] : null;
  const label = mark ? mark.label : (item as { label: string }).label;

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-gray-1100">
      {/*
        Decorative: the name is right beside it in text, so a title on the
        mark would have a screen reader read every one of these twice.

        Monochrome rather than in brand colour. Two dozen logos at full
        saturation is a sticker sheet, and the row is meant to be read.
      */}
      {mark && (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-3.5 shrink-0 text-gray-1000"
        >
          <path d={mark.path} />
        </svg>
      )}
      {label}
    </span>
  );
}

function Group({ row, language }: { row: Row; language: Language }) {
  return (
    /* `div` inside `dl` is valid and is what pairs a term with its
       description: the category is the term, the stack is the description. */
    <div className="grid gap-x-6 gap-y-1.5 py-1.5 sm:grid-cols-[8.5rem_1fr]">
      <dt className="text-sm text-gray-1000">{labels[language][row.key]}</dt>
      <dd className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {row.items.map((item) => (
          <Tech
            key={typeof item === "string" ? item : item.label}
            item={item}
          />
        ))}
      </dd>
    </div>
  );
}

export function Skills({ language }: { language: Language }) {
  const [open, setOpen] = React.useState(false);
  const reduceMotion = useReducedMotion();
  const t = toggle[language];

  const shown = ROWS.slice(0, COLLAPSED);
  const rest = ROWS.slice(COLLAPSED);

  return (
    <>
      <div className="mb-2 flex w-full items-center justify-between">
        <h2 id="skills-heading" className="font-medium text-gray-1200">
          Skills
        </h2>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          /* The rows it opens are the ones below, so point at them rather than
             at a wrapper that would also claim the heading. */
          aria-expanded={open}
          aria-controls="skills-rest"
          className="inline-flex cursor-pointer items-center gap-1 rounded-md text-sm text-gray-1000 transition-colors duration-150 ease-[var(--ease-out-strong)] hover:text-gray-1200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/40 dark:focus-visible:outline-white/40"
        >
          {open ? t.less : t.more}
          <ChevronsUpDown aria-hidden className="size-3.5" strokeWidth={1.75} />
        </button>
      </div>

      <dl className="w-full">
        {shown.map((row) => (
          <Group key={row.key} row={row} language={language} />
        ))}

        {/*
          Mounted only while open, rather than hidden with CSS. A collapsed row
          that is still in the accessibility tree is a row a screen reader
          reads out while the button beside it offers to reveal it.
        */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="skills-rest"
              key="rest"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={reduceMotion ? { duration: 0.12 } : SPRING}
              className="overflow-hidden"
            >
              {rest.map((row) => (
                <Group key={row.key} row={row} language={language} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </dl>
    </>
  );
}

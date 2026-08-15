/**
 * Writes `lib/tech-marks.ts` from simple-icons.
 *
 * The package holds some three thousand icons and the skills list uses two
 * dozen, so it stays a devDependency and only the paths that are actually
 * drawn get committed. Nothing about simple-icons reaches the browser, and
 * nobody has to trust that a bundler tree-shook it correctly.
 *
 * Run it after editing ROWS in components/skills.tsx:
 *   node scripts/build-tech-marks.mjs
 */

import { writeFileSync } from "node:fs";
import * as icons from "simple-icons";

/** Slug in simple-icons, then the label the site prints. */
const MARKS = [
  ["typescript", "TypeScript"],
  ["javascript", "JavaScript"],
  ["php", "PHP"],
  ["ruby", "Ruby"],
  ["dart", "Dart"],
  ["angular", "Angular"],
  ["ngrx", "NgRx"],
  ["react", "React"],
  ["nextdotjs", "Next.js"],
  ["flutter", "Flutter"],
  ["tailwindcss", "Tailwind CSS"],
  ["shadcnui", "shadcn/ui"],
  ["alpinedotjs", "Alpine.js"],
  ["bootstrap", "Bootstrap"],
  ["jquery", "jQuery"],
  ["laravel", "Laravel"],
  ["nestjs", "NestJS"],
  ["nodedotjs", "Node.js"],
  ["rubyonrails", "Ruby on Rails"],
  ["quarkus", "Quarkus"],
  ["prisma", "Prisma"],
  ["postgresql", "PostgreSQL"],
  ["mariadb", "MariaDB"],
  ["redis", "Redis"],
  ["firebase", "Firebase"],
  ["docker", "Docker"],
  ["nginx", "NGINX"],
  ["linux", "Linux"],
  ["vercel", "Vercel"],
  ["railway", "Railway"],
  ["keycloak", "Keycloak"],
  ["jsonwebtokens", "JWT"],
  ["git", "Git"],
  ["github", "GitHub"],
  ["vite", "Vite"],
  ["swagger", "Swagger"],
  ["cursor", "Cursor"],
  ["claude", "Claude"],
  ["githubcopilot", "GitHub Copilot"],
];

const key = (slug) => "si" + slug[0].toUpperCase() + slug.slice(1);

const entries = MARKS.map(([slug, label]) => {
  const icon = icons[key(slug)];
  if (!icon) throw new Error(`simple-icons has no "${slug}"`);
  return `  "${slug}": { label: ${JSON.stringify(label)}, path: ${JSON.stringify(icon.path)} },`;
});

writeFileSync(
  new URL("../lib/tech-marks.ts", import.meta.url),
  `/**
 * Brand marks for the skills list. Generated, do not edit by hand.
 *
 * Written by scripts/build-tech-marks.mjs out of simple-icons, which is a
 * devDependency: only the paths drawn here are committed, so the browser never
 * pays for the other three thousand icons.
 *
 * Every path is a single shape on a 24 by 24 grid, drawn in currentColor.
 */

export type TechMark = { label: string; path: string }

export const TECH_MARKS = {
${entries.join("\n")}
} as const satisfies Record<string, TechMark>

export type TechName = keyof typeof TECH_MARKS
`,
);

console.log(`lib/tech-marks.ts: ${MARKS.length} marcas`);

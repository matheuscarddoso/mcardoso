/**
 * Writes `lib/reading-time.ts` by counting the words in every article, in
 * every language.
 *
 * Counted from the source rather than typed into the registry by hand, because
 * a number typed by hand is wrong the first time a paragraph is edited and
 * nobody notices for a year. Counted at build rather than in the browser,
 * because the figure belongs in the HTML: it is there for the reader deciding
 * whether to start, and that decision happens before any JavaScript runs.
 *
 *   node scripts/build-reading-time.mjs
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const WORK = "app/[locale]/work";

/**
 * Two hundred words a minute, the ordinary figure for prose, rounded up and
 * never below one. These pieces carry code blocks that nobody reads at speed,
 * so a lower rate would be defensible; a wrong estimate that runs short is
 * kinder than one that runs long.
 */
const WPM = 200;

/** Strips the JSX so only what a reader would read is counted. */
function words(source) {
  const text = source
    .replace(/\{c\("[^"]*"\)\}/g, " ") // inline code chips
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^{}]*\}/g, " ")
    .replace(/&[a-z]+;/g, "'");
  return (text.match(/[A-Za-zÀ-ÿ0-9']+/g) ?? []).length;
}

const entries = [];

for (const slug of readdirSync(WORK).sort()) {
  const file = path.join(WORK, slug, "article-content.tsx");
  let source;
  try {
    source = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  const start = source.indexOf("const translations");
  if (start === -1) continue;
  const body = source.slice(start);

  const perLanguage = {};
  for (const language of ["PT", "EN", "ES"]) {
    const block = new RegExp(
      `\\n  ${language}: \\{\\n([\\s\\S]*?)\\n  \\},\\n`,
    ).exec(body);
    perLanguage[language] = block
      ? Math.max(1, Math.ceil(words(block[1]) / WPM))
      : 1;
  }

  entries.push(
    `  "${slug}": { PT: ${perLanguage.PT}, EN: ${perLanguage.EN}, ES: ${perLanguage.ES} },`,
  );
}

writeFileSync(
  "lib/reading-time.ts",
  `import type { Language } from "./locale"

/**
 * Minutes to read each article, per language. Generated, do not edit by hand.
 *
 * Written by scripts/build-reading-time.mjs, which counts the words in the
 * source. Re-run it after editing an article, or the number goes stale exactly
 * the way a hand-typed one would.
 */
export const READING_MINUTES: Record<string, Record<Language, number>> = {
${entries.join("\n")}
}
`,
);

console.log(`lib/reading-time.ts: ${entries.length} artigos`);

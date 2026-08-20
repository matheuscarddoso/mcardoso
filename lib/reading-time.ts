import type { Language } from "./locale"

/**
 * Minutes to read each article, per language. Generated, do not edit by hand.
 *
 * Written by scripts/build-reading-time.mjs, which counts the words in the
 * source. Re-run it after editing an article, or the number goes stale exactly
 * the way a hand-typed one would.
 */
export const READING_MINUTES: Record<string, Record<Language, number>> = {
  "agent-loops-harness-graphs": { PT: 9, EN: 9, ES: 9 },
  "ai-bubble": { PT: 7, EN: 7, ES: 7 },
  "ai-ml-github-repos": { PT: 3, EN: 3, ES: 3 },
  "claude-code-skills": { PT: 4, EN: 4, ES: 4 },
  "invisible-details": { PT: 3, EN: 3, ES: 3 },
  "oklch-colors": { PT: 2, EN: 2, ES: 2 },
  "saving-claude-tokens": { PT: 2, EN: 2, ES: 2 },
  "whatsapp-cloud-api": { PT: 2, EN: 2, ES: 2 },
}

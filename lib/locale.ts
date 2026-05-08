import type { Language } from "@/components/footer"

export const LOCALES = ['en', 'pt-br', 'es'] as const
export type Locale = typeof LOCALES[number]

export function localeToLanguage(locale: string): Language {
  if (locale === 'pt-br') return 'PT'
  if (locale === 'es') return 'ES'
  return 'EN'
}

export const languageToLocale: Record<Language, Locale> = {
  EN: 'en',
  PT: 'pt-br',
  ES: 'es',
}

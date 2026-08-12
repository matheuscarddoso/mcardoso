export type Language = "PT" | "EN" | "ES"

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

/**
 * Short month names, 0-based to match `Date`. Held here rather than read from
 * `Intl`: both contribution graphs render on the server and hydrate in the
 * browser, and the two only agree on `Intl` output if they carry the same ICU
 * data — a mismatch there is a hydration error, not a typo.
 */
export const MONTH_NAMES: Record<Language, readonly string[]> = {
  PT: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  EN: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ES: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
}

/** The same months spelled out, for prose like a tooltip's date. */
export const MONTH_NAMES_LONG: Record<Language, readonly string[]> = {
  PT: [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ],
  EN: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
  ES: [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ],
}

import { LOCALES, languageToLocale, type Language } from "./locale"

/** Matches a leading locale segment, and only a whole one — not `/english`. */
const LOCALE_PREFIX = new RegExp(`^/(?:${LOCALES.join("|")})(?=/|$)`)

/**
 * Changing language is a document-level change: `<html lang>`, the title, the
 * description and the canonical are all different.
 *
 * It has to be a real navigation, not `router.push`. The root layout lives
 * under `app/[locale]`, so a soft navigation changes the value of that dynamic
 * segment — which remounts the root layout, html and body and the theme
 * provider with it. The tree blanks for a frame and the theme re-resolves,
 * which is visible as the whole page flickering.
 *
 * A document navigation instead lets the browser paint the next page only after
 * next-themes' blocking script has already set the class, so there is no
 * unthemed frame to see. The path, query and hash carry over, so switching
 * language mid-article keeps you on that article and near your place in it.
 */
export function switchLocale(next: Language): void {
  const { pathname, search, hash } = window.location
  const tail = pathname.replace(LOCALE_PREFIX, "")
  window.location.assign(`/${languageToLocale[next]}${tail}${search}${hash}`)
}

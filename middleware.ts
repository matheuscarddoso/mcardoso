import { NextResponse, type NextRequest } from 'next/server'

const LOCALES = ['en', 'pt-br', 'es'] as const

function detectLocale(request: NextRequest): string {
  const acceptLang = request.headers.get('accept-language') ?? ''
  const lower = acceptLang.toLowerCase()
  if (lower.includes('pt')) return 'pt-br'
  if (lower.includes('es')) return 'es'
  return 'en'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )
  if (hasLocale) return NextResponse.next()

  const locale = detectLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`

  // 307, not 308: the target depends on the request, so it must never be
  // remembered by the browser. `Vary` says the same thing to shared caches —
  // without it one visitor's language decides the redirect for everyone
  // behind that CDN node.
  const response = NextResponse.redirect(url, 307)
  response.headers.set('vary', 'accept-language')
  return response
}

export const config = {
  // `og` carries its own locale segment and is an image, not a page: sending a
  // scraper a 307 on `og:image` costs a round trip at best, and the ones that
  // don't follow redirects for images just render no card. The dot rule
  // already covers `/og.png`; this covers the generated `/og/<locale>/<slug>`.
  matcher: ['/((?!_next|api|og/|.*\\..*).*)'],
}

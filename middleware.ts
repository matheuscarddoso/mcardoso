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
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}

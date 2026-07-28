import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { DEFAULT_LOCALE, SITE_NAME } from "@/lib/site"

/*
 * The root layout lives under `app/[locale]`, so a URL that never resolves to a
 * locale has no layout to render into. This is that shell: it owns its own
 * <html>, which is why the fonts are declared again here.
 */
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: `404 — ${SITE_NAME}`,
  description: "This page doesn't exist.",
  // Noindex, but still follow: the link home is the point of the page.
  robots: { index: false, follow: true },
}

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className="mx-auto flex min-h-dvh w-full max-w-(--breakpoint-sm) flex-col items-start justify-center gap-3 px-4">
            <p className="font-mono text-sm text-gray-1000">404</p>
            <h1 className="text-balance font-[550] article-heading">
              This page doesn&apos;t exist.
            </h1>
            <a href={`/${DEFAULT_LOCALE}`} className="article-underline">
              Back to {SITE_NAME}
            </a>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

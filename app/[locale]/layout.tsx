import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Libre_Baskerville } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LOCALES, localeToLanguage } from "@/lib/locale";
import {
  HOME_SEO,
  HREFLANG,
  OG_LOCALE,
  PERSON,
  SITE_NAME,
  SITE_URL,
  isLocale,
  ogLocaleAlternates,
} from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const libreBaskervilleItalic = Libre_Baskerville({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
  // If the webfont never arrives, the text still has to read as a serif —
  // next/font's default fallback is sans, which silently loses the treatment.
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/**
 * The locale segment is the root layout, so `<html lang>` can carry the
 * language the page is actually written in. A single hardcoded `lang="en"`
 * above three translations tells crawlers and screen readers the wrong thing
 * on two thirds of the site.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/** Anything outside the three known locales is a 404, not a rendered page. */
export const dynamicParams = false;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // The lightbox and the fixed header blur both run edge to edge on phones.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const seo = HOME_SEO[localeToLanguage(locale)];

  return {
    metadataBase: new URL(SITE_URL),
    // Pages set the bare subject; the site name is appended here so no page
    // has to remember to do it, and the home page opts out with `absolute`.
    title: {
      default: seo.title,
      template: `%s — ${SITE_NAME}`,
    },
    description: seo.description,
    applicationName: SITE_NAME,
    authors: [{ name: PERSON.name, url: SITE_URL }],
    creator: PERSON.name,
    publisher: PERSON.name,
    // The phone-number autolinker rewrites plain numbers in body copy on iOS.
    formatDetection: { telephone: false, address: false, email: false },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: ogLocaleAlternates(locale),
      title: seo.title,
      description: seo.description,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@mattcrdoso",
      title: seo.title,
      description: seo.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={HREFLANG[locale]} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${libreBaskervilleItalic.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

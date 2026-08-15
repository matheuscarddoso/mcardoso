import { notFound } from "next/navigation";
import { CodePanel } from "@/components/code-panel";
import { CraftShell } from "@/components/craft-shell";
import { CassettePlayer } from "@/components/crafts/cassette-player";
import { CommandPaletteDemo } from "@/components/crafts/command-palette-demo";
import { LoadingStateDemo } from "@/components/crafts/loading-state-demo";
import { craftBySlug, crafts } from "@/lib/crafts";
import { LOCALES, localeToLanguage } from "@/lib/locale";
import { pageMetadata, toLocale } from "@/lib/site";

/**
 * The demo for each craft, by slug.
 *
 * A plain map rather than a dynamic import: there are a handful of these, they
 * are all wanted at build time, and a lookup that can be read is worth more
 * here than a code split that saves nothing on a page whose whole subject is
 * the component.
 */
const DEMOS: Record<string, React.ReactNode> = {
  "cassette-audio-player": <CassettePlayer />,
  "loading-state": <LoadingStateDemo />,
  "command-palette": <CommandPaletteDemo />,
};

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    crafts.map((craft) => ({ locale, slug: craft.slug })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = toLocale(raw);
  const craft = craftBySlug.get(slug);
  if (!craft) return {};

  return pageMetadata({
    locale,
    path: `/crafts/${slug}`,
    title: craft.title,
    description: craft.seoDescription[localeToLanguage(locale)],
  });
}

export default async function CraftPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = toLocale(raw);
  const language = localeToLanguage(locale);
  const craft = craftBySlug.get(slug);

  /* A slug outside the registry is a 404, not an empty page: the route is
     prerendered from `crafts`, so anything else was never a page here. */
  if (!craft) notFound();

  return (
    <CraftShell
      locale={locale}
      language={language}
      title={craft.title}
      description={craft.description[language]}
      credit={craft.credit?.[language]}
      demo={DEMOS[slug] ?? null}
    >
      <CodePanel files={craft.files} language={language} />
    </CraftShell>
  );
}

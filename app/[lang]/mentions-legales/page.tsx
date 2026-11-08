import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale, locales } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/mentions-legales">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: getDict(lang).meta.legalTitle,
    robots: { index: false },
    alternates: { canonical: `/${lang}/mentions-legales`, languages: Object.fromEntries(locales.map((l) => [l, `/${l}/mentions-legales`])) },
  };
}

export default async function Legal({ params }: PageProps<"/[lang]/mentions-legales">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang).legal;
  const blocks = [
    [t.editor, t.editorText],
    [t.host, t.hostText],
    [t.data, t.dataText],
    [t.photos, t.photosText],
  ];
  return (
    <main id="main" className="wrap max-w-3xl py-16 md:py-24">
      <h1 className="h-section">{t.title}</h1>
      <div className="mt-10 space-y-8">
        {blocks.map(([h, p]) => (
          <section key={h}>
            <h2 className="text-[1.4rem]">{h}</h2>
            <p className="mt-2 leading-relaxed">{p}</p>
          </section>
        ))}
      </div>
      <a href={`/${lang}`} className="btn btn-line mt-12">
        {t.back}
      </a>
    </main>
  );
}

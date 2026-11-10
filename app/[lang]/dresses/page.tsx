import { notFound } from "next/navigation";
import DressBrowser from "@/components/DressBrowser";
import { dresses } from "@/lib/dresses";
import { getDictionary, isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang).meta.dresses;
  return buildMetadata(lang, "/dresses", d.title, d.description);
}

export default async function DressesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-12 md:pt-20">
      <header className="mb-10 animate-fade-up">
        <h1 className="text-4xl sm:text-5xl">{dict.dresses.title}</h1>
        <p className="mt-3 text-muted">{dict.dresses.subtitle}</p>
      </header>
      <DressBrowser dresses={dresses} lang={lang} dict={dict} />
    </div>
  );
}

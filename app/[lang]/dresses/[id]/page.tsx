import Link from "next/link";
import { notFound } from "next/navigation";
import ContactButtons from "@/components/ContactButtons";
import Gallery from "@/components/Gallery";
import StatusBadge from "@/components/StatusBadge";
import { dresses, getDress } from "@/lib/dresses";
import { formatPrice, getDictionary, isLocale, locales } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; id: string }> };

export function generateStaticParams() {
  return locales.flatMap((lang) => dresses.map((d) => ({ lang, id: d.id })));
}

export async function generateMetadata({ params }: Props) {
  const { lang, id } = await params;
  const dress = getDress(id);
  if (!isLocale(lang) || !dress) return {};
  const dict = getDictionary(lang);
  const title = `${dress.name[lang]} | ${dict.meta.siteName}`;
  const meta = buildMetadata(lang, `/dresses/${id}`, title, dress.description[lang]);
  return {
    ...meta,
    openGraph: { ...meta.openGraph, images: [{ url: dress.images[0], alt: dress.name[lang] }] },
    twitter: { ...meta.twitter, images: [dress.images[0]] },
  };
}

export default async function DressDetailPage({ params }: Props) {
  const { lang, id } = await params;
  const dress = getDress(id);
  if (!isLocale(lang) || !dress) notFound();
  const dict = getDictionary(lang);
  const m = dress.measurements;
  const colorLabel = (c: string) => (dict.colors as Record<string, string>)[c] ?? c;

  const measureRows: [string, string][] = [
    [dict.detail.height, m.height ? `${m.height} ${dict.detail.cm}` : ""],
    [dict.detail.bust, m.bust ? `${m.bust} ${dict.detail.cm}` : ""],
    [dict.detail.waist, m.waist ? `${m.waist} ${dict.detail.cm}` : ""],
    [dict.detail.hip, m.hip ? `${m.hip} ${dict.detail.cm}` : ""],
    [dict.detail.length, m.length ? `${m.length} ${dict.detail.cm}` : ""],
  ];

  const row = "flex items-baseline justify-between gap-6 border-b border-line py-3.5 text-sm";

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-8 md:pt-14">
      <Link href={`/${lang}/dresses`} className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-brand">
        <span aria-hidden="true">←</span> {dict.common.backToDresses}
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-16">
        <Gallery images={dress.images} name={dress.name[lang]} dict={dict} />

        <div className="animate-fade-up md:pt-2">
          <StatusBadge status={dress.status} dict={dict} />
          <h1 className="mt-4 text-4xl sm:text-5xl">{dress.name[lang]}</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
            {dict.detail.number} {dress.id.toUpperCase()}
          </p>
          <p className="mt-6 leading-relaxed text-ink/80">{dress.description[lang]}</p>

          <dl className="mt-8">
            <div className={row}>
              <dt className="text-muted">{dict.detail.price}</dt>
              <dd className="text-right">
                <span className="font-serif text-2xl text-brand">{formatPrice(dress.price, lang, dict)}</span>
                <span className="ml-2 text-xs text-muted">{dict.common.perRental}</span>
              </dd>
            </div>
            <div className={row}>
              <dt className="text-muted">{dict.detail.deposit}</dt>
              <dd className="text-right">
                {formatPrice(dress.deposit, lang, dict)}
                <span className="mt-0.5 block text-xs text-muted">{dict.detail.depositNote}</span>
              </dd>
            </div>
            <div className={row}>
              <dt className="text-muted">{dict.detail.size}</dt>
              <dd>{dress.size}</dd>
            </div>
            <div className={row}>
              <dt className="text-muted">{dict.detail.color}</dt>
              <dd>{dress.colors.map(colorLabel).join(", ")}</dd>
            </div>
            {measureRows
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className={row}>
                  <dt className="text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            <div className={row}>
              <dt className="text-muted">{dict.detail.status}</dt>
              <dd>{dress.status === "available" ? dict.common.available : dict.common.rented}</dd>
            </div>
          </dl>

          <div className="mt-10 bg-blush-soft/70 p-6">
            <h2 className="text-2xl">{dict.detail.inquireTitle}</h2>
            <p className="mt-2 text-sm text-muted">
              {dress.status === "rented" ? dict.detail.rentedNote : dict.detail.inquireBody}
            </p>
            <ContactButtons dict={dict} className="mt-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

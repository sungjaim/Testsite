import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactButtons from "@/components/ContactButtons";
import DressCard from "@/components/DressCard";
import Reveal from "@/components/Reveal";
import { getFeaturedDresses } from "@/lib/dresses";
import { getDictionary, isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang).meta.home;
  return buildMetadata(lang, "", d.title, d.description);
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const featured = getFeaturedDresses(4);
  const heroDress = featured[0];
  const titleLines = dict.home.title.split("<br />");

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-12 md:grid-cols-2 md:gap-16 md:pb-24 md:pt-20">
        <div className="animate-fade-up">
          <p className="text-xs uppercase tracking-[0.22em] text-brand">{dict.home.eyebrow}</p>
          <h1 className="mt-5 text-4xl leading-[1.18] sm:text-5xl lg:text-6xl">
            {titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-md text-base text-muted sm:text-lg">{dict.home.subtitle}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${lang}/dresses`}
              className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              {dict.home.ctaPrimary}
            </Link>
            <Link
              href={`/${lang}/guide`}
              className="inline-flex items-center justify-center rounded-full border border-line px-8 py-3.5 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
            >
              {dict.home.ctaSecondary}
            </Link>
          </div>
        </div>
        {heroDress && (
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md animate-fade-up md:max-w-none" style={{ animationDelay: "120ms" }}>
            <div className="absolute -bottom-3 -right-3 h-full w-full border border-blush" aria-hidden="true" />
            <Image
              src={heroDress.images[0]}
              alt={heroDress.name[lang]}
              fill
              priority
              sizes="(min-width: 768px) 560px, 92vw"
              className="object-cover"
            />
          </div>
        )}
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl">{dict.home.featuredTitle}</h2>
              <p className="mt-2 text-muted">{dict.home.featuredSubtitle}</p>
            </div>
            <Link href={`/${lang}/dresses`} className="shrink-0 text-sm text-brand underline-offset-4 hover:underline">
              {dict.common.viewAll}
            </Link>
          </div>
        </Reveal>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((d, i) => (
            <li key={d.id}>
              <Reveal delay={i * 80}>
                <DressCard dress={d} lang={lang} dict={dict} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="mt-12 bg-blush-soft/60 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <h2 className="text-center text-3xl sm:text-4xl">{dict.home.howTitle}</h2>
          </Reveal>
          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {dict.home.steps.map((step, i) => (
              <li key={step.title}>
                <Reveal delay={i * 100} className="text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-brand font-serif text-xl text-brand">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-2xl">{step.title}</h3>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-5 py-24 text-center md:py-32">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl">{dict.home.ctaTitle}</h2>
          <p className="mt-4 text-muted">{dict.home.ctaBody}</p>
          <ContactButtons dict={dict} className="mt-9 justify-center" />
        </Reveal>
      </section>
    </>
  );
}

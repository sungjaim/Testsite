import { notFound } from "next/navigation";
import ContactButtons from "@/components/ContactButtons";
import Reveal from "@/components/Reveal";
import { getDictionary, isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang).meta.guide;
  return buildMetadata(lang, "/guide", d.title, d.description);
}

export default async function GuidePage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const g = dict.guide;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-8 pt-12 md:pt-20">
      <header className="animate-fade-up">
        <h1 className="text-4xl sm:text-5xl">{g.title}</h1>
        <p className="mt-3 text-muted">{g.subtitle}</p>
      </header>

      <section className="mt-14" aria-labelledby="process">
        <h2 id="process" className="text-3xl">{g.processTitle}</h2>
        <ol className="mt-8 space-y-6">
          {g.process.map((text, i) => (
            <li key={i}>
              <Reveal className="flex gap-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-brand font-serif text-lg text-brand">{i + 1}</span>
                <p className="pt-1 leading-relaxed text-ink/85">{text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-16 divide-y divide-line border-y border-line">
        {g.sections.map((s) => (
          <section key={s.title} className="py-9">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl">{s.title}</h2>
              <div className="mt-4 space-y-3 leading-relaxed text-ink/80">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
          </section>
        ))}
      </div>

      <section className="mt-16" aria-labelledby="faq">
        <h2 id="faq" className="text-3xl">{g.faqTitle}</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {g.faq.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-medium marker:hidden [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <span aria-hidden="true" className="text-xl text-brand transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-16 text-center">
        <h2 className="text-3xl">{dict.home.ctaTitle}</h2>
        <p className="mt-3 text-muted">{dict.home.ctaBody}</p>
        <ContactButtons dict={dict} className="mt-7 justify-center" />
      </div>
    </div>
  );
}

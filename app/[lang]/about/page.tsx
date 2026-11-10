import { notFound } from "next/navigation";
import ContactButtons from "@/components/ContactButtons";
import { siteConfig, telHref } from "@/lib/config";
import { getDictionary, isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang).meta.about;
  return buildMetadata(lang, "/about", d.title, d.description);
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const a = dict.about;
  const label = "text-xs uppercase tracking-[0.18em] text-muted";

  return (
    <div className="mx-auto max-w-5xl px-5 pb-8 pt-12 md:pt-20">
      <header className="max-w-2xl animate-fade-up">
        <h1 className="text-4xl sm:text-5xl">{a.title}</h1>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/80">
          {a.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </header>

      <div className="mt-16 grid gap-12 border-t border-line pt-12 md:grid-cols-2">
        <section>
          <h2 className="text-2xl">{a.locationTitle}</h2>
          <p className="mt-4 leading-relaxed">{siteConfig.address[lang]}</p>
          <h2 className="mt-10 text-2xl">{a.hoursTitle}</h2>
          <ul className="mt-4 space-y-1">
            {siteConfig.hours[lang].map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl">{a.contactTitle}</h2>
          <p className="mt-4 text-muted">{a.contactBody}</p>
          <dl className="mt-6 space-y-4">
            <div>
              <dt className={label}>{a.instagram}</dt>
              <dd className="mt-1">
                <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-brand underline-offset-4 hover:underline">
                  {siteConfig.instagramHandle}
                </a>
              </dd>
            </div>
            <div>
              <dt className={label}>{a.phone}</dt>
              <dd className="mt-1">
                <a href={telHref} className="text-brand underline-offset-4 hover:underline">
                  {siteConfig.phone}
                </a>
              </dd>
            </div>
          </dl>
          <ContactButtons dict={dict} className="mt-8" />
        </section>
      </div>
    </div>
  );
}

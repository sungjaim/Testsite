import Link from "next/link";
import { siteConfig } from "@/lib/config";
import type { Dictionary, Locale } from "@/lib/i18n";

export default function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const b = siteConfig.business;
  const rows: [string, string][] = [
    [dict.footer.tradeName, b.tradeName[lang]],
    [dict.footer.representative, b.representative[lang]],
    [dict.footer.registrationNumber, b.registrationNumber],
    [dict.footer.mailOrderNumber, b.mailOrderNumber],
    [dict.footer.address, siteConfig.address[lang]],
    [dict.footer.phone, siteConfig.phone],
    [dict.footer.email, b.email],
  ];

  return (
    <footer className="mt-24 border-t border-line bg-white pb-28 pt-12 md:pb-16">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <p className="font-serif text-2xl">LS</p>
            <p className="mt-1 text-sm text-muted">{dict.home.eyebrow}</p>
            <div className="mt-5 flex gap-5 text-sm">
              <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                {dict.common.instagram}
              </a>
              <Link href={`/${lang}/about`} className="hover:text-brand">
                {dict.nav.about}
              </Link>
              <Link href={`/${lang}/guide`} className="hover:text-brand">
                {dict.nav.guide}
              </Link>
            </div>
          </div>
          <dl className="grid gap-x-6 gap-y-1.5 text-xs text-muted sm:grid-cols-[auto_1fr]">
            {rows
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-ink/70">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
          </dl>
        </div>
        <p className="mt-10 text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.name[lang]} (LS). {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}

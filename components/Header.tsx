"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";

const links = [
  { key: "dresses", href: "/dresses" },
  { key: "guide", href: "/guide" },
  { key: "about", href: "/about" },
] as const;

export default function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const pathname = usePathname() ?? `/${lang}`;
  const [open, setOpen] = useState(false);
  const other: Locale = lang === "ko" ? "en" : "ko";
  const rest = pathname.replace(/^\/(ko|en)/, "") || "";
  const switchHref = `/${other}${rest}`;

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname.startsWith(`/${lang}${href}`);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href={`/${lang}`} className="flex items-center gap-2.5" aria-label="LS (엘에스)">
          <Image src="/logo.jpeg" alt="" width={40} height={40} priority className="h-10 w-10 rounded-full object-cover" />
          <span className="font-serif text-xl tracking-wide text-ink">LS</span>
        </Link>

        <nav aria-label={dict.nav.main} className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.key}
              href={`/${lang}${l.href}`}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`text-sm transition-colors hover:text-brand ${isActive(l.href) ? "text-brand" : "text-ink"}`}
            >
              {dict.nav[l.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href={switchHref}
            hrefLang={other}
            lang={other}
            aria-label={dict.lang.switchTo}
            className="rounded-full px-3 py-2 text-sm font-medium text-ink transition-colors hover:text-brand"
          >
            <span className={lang === "ko" ? "text-brand" : "text-muted"}>KO</span>
            <span className="mx-1 text-line">/</span>
            <span className={lang === "en" ? "text-brand" : "text-muted"}>EN</span>
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? dict.nav.closeMenu : dict.nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-px w-5 bg-ink transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-px w-5 bg-ink transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 h-px w-5 bg-ink transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label={dict.nav.main}
        hidden={!open}
        className="border-t border-line/70 bg-white px-5 pb-5 pt-2 md:hidden"
      >
        <ul>
          {links.map((l) => (
            <li key={l.key}>
              <Link
                href={`/${lang}${l.href}`}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`block border-b border-line/60 py-4 font-serif text-xl ${isActive(l.href) ? "text-brand" : "text-ink"}`}
              >
                {dict.nav[l.key]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

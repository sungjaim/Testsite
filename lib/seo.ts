import type { Metadata } from "next";
import { locales, type Locale } from "./i18n";

/** Metadata shared by every page: canonical URL, language alternates and social preview. */
export function buildMetadata(lang: Locale, path: string, title: string, description: string): Metadata {
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, `/${l}${path}`]));
  languages["x-default"] = `/ko${path}`;
  return {
    title,
    description,
    alternates: { canonical: `/${lang}${path}`, languages },
    openGraph: {
      title,
      description,
      url: `/${lang}${path}`,
      siteName: "LS (엘에스)",
      locale: lang === "ko" ? "ko_KR" : "en_US",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "LS (엘에스)" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}

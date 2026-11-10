import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { dresses } from "@/lib/dresses";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const paths = ["", "/dresses", "/guide", "/about", ...dresses.map((d) => `/dresses/${d.id}`)];
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${base}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" || path === "/dresses" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path.startsWith("/dresses/") ? 0.6 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])) },
    })),
  );
}

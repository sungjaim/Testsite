import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/noto-serif-kr/500.css";
import "./globals.css";
import ContactFab from "@/components/ContactFab";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { siteConfig } from "@/lib/config";
import { getDictionary, isLocale, locales } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: "LS (엘에스)",
  applicationName: "LS (엘에스)",
  icons: { icon: "/logo.jpeg", apple: "/logo.jpeg" },
};

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang}>
      <body className="flex min-h-screen flex-col">
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <Header lang={lang} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} dict={dict} />
        <ContactFab dict={dict} />
      </body>
    </html>
  );
}

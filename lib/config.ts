/**
 * Business settings. Edit the values below; every page and the footer read from here.
 * Anything marked "PLACEHOLDER" must be replaced before launch.
 */

type Localized = { ko: string; en: string };

export const siteConfig = {
  /** Production URL, used for sitemap and social preview links. Can also be set with the NEXT_PUBLIC_SITE_URL env var on Vercel. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ls-skate.example.com", // PLACEHOLDER

  name: { ko: "엘에스", en: "LS" } satisfies Localized,

  /** Instagram profile. Instagram has no link that opens a DM with a preset message, so the profile opens. */
  instagramUrl: "https://www.instagram.com/your_account/", // PLACEHOLDER
  instagramHandle: "@your_account", // PLACEHOLDER

  /** Shown as written; the call link strips everything except digits and "+". */
  phone: "010-0000-0000", // PLACEHOLDER

  address: {
    ko: "서울특별시 ○○구 ○○로 00, 0층", // PLACEHOLDER
    en: "00, ○○-ro, ○○-gu, Seoul, Korea (3F)", // PLACEHOLDER
  } satisfies Localized,

  /** One entry per line on the About page. */
  hours: {
    ko: ["평일 10:00 – 19:00", "토요일 예약 방문만 가능", "일요일·공휴일 휴무"],
    en: ["Weekdays 10:00 – 19:00", "Saturday by appointment only", "Closed Sundays and public holidays"],
  } as { ko: string[]; en: string[] }, // PLACEHOLDER

  /** Footer business registration info. Leave a field as "" to hide it. */
  business: {
    tradeName: { ko: "엘에스", en: "LS" } satisfies Localized,
    representative: { ko: "홍길동", en: "Gildong Hong" } satisfies Localized, // PLACEHOLDER
    registrationNumber: "000-00-00000", // PLACEHOLDER
    mailOrderNumber: "", // 통신판매업 신고번호, if you have one
    email: "", // optional
  },
};

export const telHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;

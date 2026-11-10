import ko from "@/messages/ko.json";
import en from "@/messages/en.json";

export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export type Dictionary = typeof ko;

const dictionaries: Record<Locale, Dictionary> = { ko, en };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}

/** Replace {placeholders} in a translation string. */
export function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

export function formatPrice(amount: number, lang: Locale, dict: Dictionary) {
  const n = new Intl.NumberFormat(lang === "ko" ? "ko-KR" : "en-US").format(amount);
  return lang === "ko" ? `${n}${dict.common.currency}` : `${dict.common.currency} ${n}`;
}

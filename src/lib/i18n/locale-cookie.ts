import type { Locale } from "@/lib/i18n/messages";

export const LOCALE_COOKIE = "engsols-locale";

export function parseLocaleCookie(value: string | undefined | null): Locale {
  return value === "ar" ? "ar" : "en";
}

export function localeDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

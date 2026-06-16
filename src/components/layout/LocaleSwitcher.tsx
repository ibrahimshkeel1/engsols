"use client";

import { localeLabels, locales } from "@/lib/i18n/messages";
import { useLocale } from "@/components/providers/LocaleProvider";

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as typeof locale)}
      className="rounded-lg border border-white/20 bg-transparent px-2 py-1 text-xs text-white/70"
      aria-label="Language"
    >
      {locales.map((l) => (
        <option key={l} value={l} className="bg-background text-foreground">
          {localeLabels[l]}
        </option>
      ))}
    </select>
  );
}

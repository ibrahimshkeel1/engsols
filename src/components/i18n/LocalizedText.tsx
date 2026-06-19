"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { t, type Locale } from "@/lib/i18n/messages";

type MessageKey = keyof typeof import("@/lib/i18n/messages").messages.en;

export function LocalizedText({
  messageKey,
  as: Tag = "span",
  className,
}: {
  messageKey: MessageKey;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  className?: string;
}) {
  const { locale } = useLocale();
  return <Tag className={className}>{t(locale as Locale, messageKey)}</Tag>;
}

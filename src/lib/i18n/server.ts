import { cookies } from "next/headers";
import { LOCALE_COOKIE, parseLocaleCookie } from "@/lib/i18n/locale-cookie";
import { messages, type Locale, type Messages } from "@/lib/i18n/messages";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return parseLocaleCookie(cookieStore.get(LOCALE_COOKIE)?.value);
}

export async function serverT(key: keyof Messages): Promise<string> {
  const locale = await getServerLocale();
  return messages[locale][key];
}

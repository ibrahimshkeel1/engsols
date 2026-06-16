export type Locale = "en" | "ar";

export const locales: Locale[] = ["en", "ar"];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

type Messages = {
  findMentors: string;
  forum: string;
  live: string;
  jobs: string;
  search: string;
  settings: string;
  assist: string;
  tagline: string;
};

export const messages: Record<Locale, Messages> = {
  en: {
    findMentors: "Find mentors",
    forum: "Forum",
    live: "Live",
    jobs: "Jobs",
    search: "Search",
    settings: "Settings",
    assist: "Career assist",
    tagline: "Engineering mentorship, careers, and community",
  },
  ar: {
    findMentors: "ابحث عن مرشد",
    forum: "المنتدى",
    live: "بث مباشر",
    jobs: "وظائف",
    search: "بحث",
    settings: "الإعدادات",
    assist: "مساعدة مهنية",
    tagline: "إرشاد هندسي ووظائف ومجتمع",
  },
};

export function t(locale: Locale, key: keyof Messages) {
  return messages[locale][key];
}

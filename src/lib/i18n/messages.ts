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
  mentors: string;
  portfolios: string;
  news: string;
  more: string;
  certifications: string;
  companies: string;
  marketplace: string;
  videos: string;
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
    mentors: "Mentors",
    portfolios: "Portfolios",
    news: "News",
    more: "More",
    certifications: "Certifications",
    companies: "Companies",
    marketplace: "Marketplace",
    videos: "Videos",
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
    mentors: "المرشدون",
    portfolios: "المحافظ",
    news: "الأخبار",
    more: "المزيد",
    certifications: "الشهادات",
    companies: "الشركات",
    marketplace: "السوق",
    videos: "فيديو",
  },
};

export function t(locale: Locale, key: keyof Messages) {
  return messages[locale][key];
}

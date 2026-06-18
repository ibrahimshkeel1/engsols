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
  notifications: string;
  login: string;
  signup: string;
  tagline: string;
  mentors: string;
  portfolios: string;
  news: string;
  more: string;
  certifications: string;
  companies: string;
  marketplace: string;
  videos: string;
  welcomeBack: string;
  joinEngsols: string;
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
    notifications: "Notifications",
    login: "Log in",
    signup: "Sign up",
    tagline: "Engineering mentorship, careers, and community",
    mentors: "Mentors",
    portfolios: "Portfolios",
    news: "News",
    more: "More",
    certifications: "Certifications",
    companies: "Companies",
    marketplace: "Marketplace",
    videos: "Videos",
    welcomeBack: "Welcome back",
    joinEngsols: "Join EngSols",
  },
  ar: {
    findMentors: "ابحث عن مرشد",
    forum: "المنتدى",
    live: "بث مباشر",
    jobs: "وظائف",
    search: "بحث",
    settings: "الإعدادات",
    assist: "مساعدة مهنية",
    notifications: "الإشعارات",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    tagline: "إرشاد هندسي ووظائف ومجتمع",
    mentors: "المرشدون",
    portfolios: "المحافظ",
    news: "الأخبار",
    more: "المزيد",
    certifications: "الشهادات",
    companies: "الشركات",
    marketplace: "السوق",
    videos: "فيديو",
    welcomeBack: "مرحباً بعودتك",
    joinEngsols: "انضم إلى إنجسولز",
  },
};

export function t(locale: Locale, key: keyof Messages) {
  return messages[locale][key];
}

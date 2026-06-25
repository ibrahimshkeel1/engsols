export type Locale = "en" | "ar";

export const locales: Locale[] = ["en", "ar"];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export type Messages = {
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
  forYou: string;
  welcomeBack: string;
  joinEngsols: string;
  signInTitle: string;
  signInSubtitle: string;
  joinSubtitle: string;
  email: string;
  password: string;
  myBookings: string;
  myApplications: string;
  applyNow: string;
  footerMentorship: string;
  footerCareers: string;
  footerCommunity: string;
  becomeMentor: string;
  careerAssist: string;
  /** Outcome-oriented micro-copy */
  forumOutcome: string;
  mentorsOutcome: string;
  liveOutcome: string;
  portfoliosOutcome: string;
  communityLabel: string;
  menu: string;
  closeMenu: string;
};

export const messages: Record<Locale, Messages> = {
  en: {
    findMentors: "Get matched with a mentor",
    forum: "Ask engineers",
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
    forYou: "For you",
    welcomeBack: "Welcome back",
    joinEngsols: "Join EngSols",
    signInTitle: "Sign in to EngSols",
    signInSubtitle: "Mentorship, portfolios, and your community in one place.",
    joinSubtitle: "Students get mentorship. Professionals can apply to mentor.",
    email: "Email",
    password: "Password",
    myBookings: "My booking requests",
    myApplications: "My job applications",
    applyNow: "Apply now",
    footerMentorship: "Mentorship",
    footerCareers: "Careers",
    footerCommunity: "Community",
    becomeMentor: "Become a mentor",
    careerAssist: "Career assist",
    forumOutcome: "Ask engineers who've been there",
    mentorsOutcome: "Find your engineering mentor",
    liveOutcome: "Watch engineers live",
    portfoliosOutcome: "Discover rising talent",
    communityLabel: "Community",
    menu: "Menu",
    closeMenu: "Close menu",
  },
  ar: {
    findMentors: "تواصل مع مرشد يناسبك",
    forum: "اسأل المهندسين",
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
    forYou: "لك",
    welcomeBack: "مرحباً بعودتك",
    joinEngsols: "انضم إلى إنجسولز",
    signInTitle: "تسجيل الدخول إلى إنجسولز",
    signInSubtitle: "الإرشاد والمحافظ ومجتمعك في مكان واحد.",
    joinSubtitle: "الطلاب يحصلون على إرشاد. المحترفون يمكنهم التقديم كمرشدين.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    myBookings: "طلبات الحجز",
    myApplications: "طلبات التوظيف",
    applyNow: "قدّم الآن",
    footerMentorship: "الإرشاد",
    footerCareers: "المسارات المهنية",
    footerCommunity: "المجتمع",
    becomeMentor: "كن مرشداً",
    careerAssist: "مساعدة مهنية",
    forumOutcome: "اسأل مهندسين مروا بنفس التجربة",
    mentorsOutcome: "اعثر على مرشد هندسي",
    liveOutcome: "شاهد المهندسين مباشرة",
    portfoliosOutcome: "اكتشف المواهب الصاعدة",
    communityLabel: "المجتمع",
    menu: "القائمة",
    closeMenu: "إغلاق القائمة",
  },
};

export function t(locale: Locale, key: keyof Messages) {
  return messages[locale][key];
}

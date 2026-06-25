import type { Locale, Messages } from "@/lib/i18n/messages";
import { t } from "@/lib/i18n/messages";

function titleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function lastSegment(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

type HeadlineKey = keyof Messages;

/** Hero first-line copy per route — matches each page's h1 / PageHero title. */
const ROUTE_HEADLINES: Record<string, HeadlineKey> = {
  "/": "homeHeadline",
  "/mentors": "mentorsOutcome",
  "/forum": "forumOutcome",
  "/live": "liveOutcome",
  "/portfolios": "portfoliosOutcome",
  "/jobs": "jobsHeadline",
  "/news": "newsHeadline",
  "/certifications": "certificationsHeadline",
  "/companies": "companiesHeadline",
  "/marketplace": "marketplaceHeadline",
  "/videos": "videosHeadline",
  "/search": "searchHeadline",
  "/assist": "careerAssist",
  "/for-you": "forYouHeadline",
  "/settings": "settingsHeadline",
  "/notifications": "notificationsHeadline",
  "/apply": "becomeMentor",
  "/login": "signInTitle",
  "/signup": "joinEngsols",
};

const PREFIX_HEADLINES: Array<{ prefix: string; key: HeadlineKey }> = [
  { prefix: "/mentors/", key: "mentorsOutcome" },
  { prefix: "/forum/", key: "forumOutcome" },
  { prefix: "/live/", key: "liveOutcome" },
  { prefix: "/portfolios/", key: "portfoliosOutcome" },
  { prefix: "/jobs/", key: "jobsHeadline" },
  { prefix: "/news/", key: "newsHeadline" },
  { prefix: "/certifications/", key: "certificationsHeadline" },
  { prefix: "/companies/", key: "companiesHeadline" },
  { prefix: "/marketplace/", key: "marketplaceHeadline" },
  { prefix: "/videos/", key: "videosHeadline" },
  { prefix: "/settings/", key: "settingsHeadline" },
];

function headlineForPath(path: string, locale: Locale): string | null {
  if (path === "/mentors/compare") {
    return locale === "ar" ? "مقارنة المرشدين" : "Compare mentors";
  }
  if (path === "/forgot-password") {
    return locale === "ar" ? "إعادة تعيين كلمة المرور" : "Reset password";
  }
  if (path === "/calls") {
    return locale === "ar" ? "مكالماتي وجلساتي" : "My calls & sessions";
  }
  if (path.startsWith("/onboarding/")) {
    return locale === "ar" ? "البدء" : "Get started";
  }
  if (path.startsWith("/mentor/")) {
    return locale === "ar" ? "لوحة المرشد" : "Mentor dashboard";
  }
  if (path.startsWith("/admin/")) {
    return locale === "ar" ? "الإدارة" : "Admin";
  }
  if (path.startsWith("/disciplines/")) {
    return locale === "ar" ? "التخصص" : "Discipline";
  }

  const exactKey = ROUTE_HEADLINES[path];
  if (exactKey) return t(locale, exactKey);

  for (const { prefix, key } of PREFIX_HEADLINES) {
    if (path.startsWith(prefix)) return t(locale, key);
  }

  return null;
}

/** Human-readable page headline for route transition overlay. */
export function getPageTitleFromPath(pathname: string, locale: Locale): string {
  const path = pathname.split("?")[0].split("#")[0] || "/";
  return headlineForPath(path, locale) ?? (titleCase(lastSegment(path).replace(/-/g, " ")) || "EngSols");
}

export function pathFromHref(href: string) {
  if (href.startsWith("/")) return href.split("?")[0].split("#")[0] || "/";
  try {
    const url = new URL(href, "https://engsols.local");
    return url.pathname;
  } catch {
    return "/";
  }
}

export function shouldSkipPageTransition(pathname: string) {
  return pathname.includes("/live/") && pathname.endsWith("/room");
}

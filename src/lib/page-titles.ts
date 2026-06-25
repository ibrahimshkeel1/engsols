import type { Locale } from "@/lib/i18n/messages";
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

/** Human-readable page title for route transition overlay. */
export function getPageTitleFromPath(pathname: string, locale: Locale): string {
  const path = pathname.split("?")[0].split("#")[0] || "/";

  const exact: Record<string, string> = {
    "/": locale === "ar" ? "الرئيسية" : "Home",
    "/mentors": t(locale, "mentors"),
    "/forum": t(locale, "forum"),
    "/live": t(locale, "live"),
    "/jobs": t(locale, "jobs"),
    "/search": t(locale, "search"),
    "/settings": t(locale, "settings"),
    "/assist": t(locale, "assist"),
    "/notifications": t(locale, "notifications"),
    "/login": t(locale, "login"),
    "/signup": t(locale, "signup"),
    "/portfolios": t(locale, "portfolios"),
    "/news": t(locale, "news"),
    "/certifications": t(locale, "certifications"),
    "/companies": t(locale, "companies"),
    "/marketplace": t(locale, "marketplace"),
    "/videos": t(locale, "videos"),
    "/for-you": t(locale, "forYou"),
    "/apply": t(locale, "becomeMentor"),
    "/disciplines": locale === "ar" ? "التخصصات" : "Disciplines",
    "/calls": locale === "ar" ? "المكالمات" : "Calls",
    "/onboarding": locale === "ar" ? "البدء" : "Get started",
    "/admin": locale === "ar" ? "الإدارة" : "Admin",
  };

  if (exact[path]) return exact[path];

  if (path.startsWith("/mentors/")) return t(locale, "mentors");
  if (path.startsWith("/forum/")) return t(locale, "forum");
  if (path.startsWith("/live/")) return t(locale, "live");
  if (path.startsWith("/jobs/")) return t(locale, "jobs");
  if (path.startsWith("/news/")) return t(locale, "news");
  if (path.startsWith("/portfolios/")) return t(locale, "portfolios");
  if (path.startsWith("/certifications/")) return t(locale, "certifications");
  if (path.startsWith("/companies/")) return t(locale, "companies");
  if (path.startsWith("/marketplace/")) return t(locale, "marketplace");
  if (path.startsWith("/videos/")) return t(locale, "videos");
  if (path.startsWith("/disciplines/")) return locale === "ar" ? "التخصص" : "Discipline";
  if (path.startsWith("/settings/")) return t(locale, "settings");
  if (path.startsWith("/onboarding/")) return locale === "ar" ? "البدء" : "Get started";
  if (path.startsWith("/mentor/")) return locale === "ar" ? "لوحة المرشد" : "Mentor dashboard";
  if (path.startsWith("/admin/")) return locale === "ar" ? "الإدارة" : "Admin";

  if (path === "/forgot-password") return locale === "ar" ? "إعادة تعيين كلمة المرور" : "Reset password";
  if (path === "/mentors/compare") return locale === "ar" ? "مقارنة المرشدين" : "Compare mentors";

  return titleCase(lastSegment(path).replace(/-/g, " ")) || "EngSols";
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

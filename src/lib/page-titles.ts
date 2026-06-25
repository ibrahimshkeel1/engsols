import type { Locale, Messages } from "@/lib/i18n/messages";
import { t } from "@/lib/i18n/messages";
import { getMentorsBrowseHero } from "@/lib/mentors-browse-hero";
import { hrefKey, recallPageTitle } from "@/lib/page-title-cache";

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

function searchParamsFromHref(href: string) {
  const query = href.includes("?") ? href.slice(href.indexOf("?") + 1) : "";
  return new URLSearchParams(query);
}

type HeadlineKey = keyof Messages;

/** Hero h1 copy per route — aligned with PageHero / ListPageLayout / guest Hero. */
const ROUTE_HEADLINES: Record<string, HeadlineKey> = {
  "/": "homeHeroTitle",
  "/mentors": "mentorsPageTitle",
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
  "/bookings": "myBookings",
  "/notifications": "notificationsHeadline",
  "/apply": "becomeMentor",
  "/login": "signInTitle",
  "/signup": "joinEngsols",
  "/how-it-works": "howItWorksPageTitle",
  "/privacy": "privacyPageTitle",
  "/disciplines": "disciplinesHeadline",
  "/forum/new": "forumNewTitle",
  "/portfolios/build": "portfolioBuildTitle",
  "/mentors/compare": "mentorsCompareTitle",
  "/forgot-password": "forgotPasswordTitle",
  "/calls": "callsHeadline",
  "/jobs/post": "jobsPostTitle",
};

const SLUG_ACTION_SEGMENTS = new Set([
  "new",
  "edit",
  "build",
  "post",
  "compare",
  "room",
  "matches",
  "password",
  "seller",
  "sell",
  "inbox",
  "talent",
  "exams",
]);

function headlineForPath(path: string, locale: Locale): string | null {
  if (path.startsWith("/onboarding/")) {
    return locale === "ar" ? "البدء" : "Get started";
  }
  if (path === "/mentor" || path.startsWith("/mentor/")) {
    return locale === "ar" ? "لوحة المرشد" : "Mentor dashboard";
  }
  if (path.startsWith("/admin/")) {
    return locale === "ar" ? "الإدارة" : "Admin";
  }

  const exactKey = ROUTE_HEADLINES[path];
  if (exactKey) return t(locale, exactKey);

  return null;
}

function mentorsBrowseTitle(href: string, locale: Locale) {
  const params = searchParamsFromHref(href);
  const hero = getMentorsBrowseHero({
    goal: params.get("goal") ?? undefined,
    discipline: params.get("discipline") ?? undefined,
    search: params.get("search") ?? undefined,
  });
  return { title: hero.title, subtitle: hero.description };
}

function detailTitleFromPath(path: string): string | null {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) return null;

  const slug = segments[segments.length - 1];
  if (!slug || SLUG_ACTION_SEGMENTS.has(slug)) return null;

  return titleCase(slug.replace(/-/g, " "));
}

/** Human-readable page headline for route transition overlay. */
export function getPageTitleFromPath(pathname: string, locale: Locale): string {
  const path = pathname.split("?")[0].split("#")[0] || "/";
  return (
    headlineForPath(path, locale) ??
    detailTitleFromPath(path) ??
    (titleCase(lastSegment(path).replace(/-/g, " ")) || "EngSols")
  );
}

export function pathFromHref(href: string) {
  const withoutHash = href.split("#")[0] || href;
  if (withoutHash.startsWith("/")) return withoutHash.split("?")[0] || "/";
  try {
    const url = new URL(withoutHash, "https://engsols.local");
    return url.pathname;
  } catch {
    return "/";
  }
}

export function getTransitionLabelsFromHref(
  href: string,
  locale: Locale,
): { title: string; subtitle?: string } {
  const cached = recallPageTitle(hrefKey(href));
  if (cached) return cached;

  const path = pathFromHref(href);

  if (path === "/mentors") {
    return mentorsBrowseTitle(href, locale);
  }

  const staticTitle = headlineForPath(path, locale);
  if (staticTitle) return { title: staticTitle };

  const detail = detailTitleFromPath(path);
  if (detail) return { title: detail };

  return {
    title: titleCase(lastSegment(path).replace(/-/g, " ")) || "EngSols",
  };
}

export function shouldSkipPageTransition(pathname: string) {
  return pathname.includes("/live/") && pathname.endsWith("/room");
}

/** Labels from data attributes, session cache, or route hero copy. */
export function getTransitionLabelsFromAnchor(
  anchor: HTMLAnchorElement,
  href: string,
  locale: Locale,
): { title: string; subtitle?: string } {
  const title = anchor.dataset.transitionTitle?.trim();
  const subtitle = anchor.dataset.transitionSubtitle?.trim();
  if (title) {
    return { title, subtitle: subtitle || undefined };
  }
  return getTransitionLabelsFromHref(href, locale);
}

/** Nav/footer link headline — same copy as the destination page hero. */
export function getTransitionTitleForHref(href: string, locale: Locale) {
  return getTransitionLabelsFromHref(href, locale).title;
}

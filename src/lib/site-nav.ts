import type { Messages } from "@/lib/i18n/messages";

export type SiteNavItem = {
  href: string;
  key: keyof Messages;
  outcome?: keyof Messages;
  authOnly?: boolean;
};

export const primarySiteNav: SiteNavItem[] = [
  { href: "/mentors", key: "mentors", outcome: "mentorsOutcome" },
  { href: "/portfolios", key: "portfolios", outcome: "portfoliosOutcome" },
  { href: "/forum", key: "forum", outcome: "forumOutcome" },
  { href: "/live", key: "live", outcome: "liveOutcome" },
  { href: "/news", key: "news" },
];

export const moreSiteNav: SiteNavItem[] = [
  { href: "/for-you", key: "forYou", authOnly: true },
  { href: "/jobs", key: "jobs" },
  { href: "/certifications", key: "certifications" },
  { href: "/companies", key: "companies" },
  { href: "/marketplace", key: "marketplace" },
  { href: "/videos", key: "videos" },
  { href: "/search", key: "search" },
  { href: "/assist", key: "assist" },
];

export function getSiteNavItems(showForYou: boolean) {
  return [
    ...primarySiteNav,
    ...moreSiteNav.filter((item) => !item.authOnly || showForYou),
  ];
}

export function navZoneKey(href: string) {
  if (href === "/mentors") return "mentorship";
  if (href === "/live") return "live";
  if (href === "/news") return "news";
  if (href === "/portfolios" || href === "/forum") return "recruiter";
  return undefined;
}

/** @deprecated Use getSiteNavItems — kept for footer / legacy */
export const navLinks = [
  ...primarySiteNav.map((l) => ({ href: l.href, label: l.key })),
  ...moreSiteNav.filter((l) => !l.authOnly).map((l) => ({ href: l.href, label: l.key })),
];

import type { Messages } from "@/lib/i18n/messages";

export type SiteNavItem = {
  href: string;
  key: keyof Messages;
  /** Destination page h1 — used for route transition overlay. */
  pageTitleKey?: keyof Messages;
  outcome?: keyof Messages;
  authOnly?: boolean;
};

export const primarySiteNav: SiteNavItem[] = [
  { href: "/mentors", key: "mentors", pageTitleKey: "mentorsPageTitle", outcome: "mentorsOutcome" },
  { href: "/portfolios", key: "portfolios", pageTitleKey: "portfoliosOutcome", outcome: "portfoliosOutcome" },
  { href: "/forum", key: "forum", pageTitleKey: "forumOutcome", outcome: "forumOutcome" },
  { href: "/live", key: "live", pageTitleKey: "liveOutcome", outcome: "liveOutcome" },
  { href: "/news", key: "news", pageTitleKey: "newsHeadline" },
];

export const moreSiteNav: SiteNavItem[] = [
  { href: "/for-you", key: "forYou", pageTitleKey: "forYouHeadline", authOnly: true },
  { href: "/jobs", key: "jobs", pageTitleKey: "jobsHeadline" },
  { href: "/certifications", key: "certifications", pageTitleKey: "certificationsHeadline" },
  { href: "/companies", key: "companies", pageTitleKey: "companiesHeadline" },
  { href: "/marketplace", key: "marketplace", pageTitleKey: "marketplaceHeadline" },
  { href: "/videos", key: "videos", pageTitleKey: "videosHeadline" },
  { href: "/search", key: "search", pageTitleKey: "searchHeadline" },
  { href: "/assist", key: "assist", pageTitleKey: "careerAssist" },
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

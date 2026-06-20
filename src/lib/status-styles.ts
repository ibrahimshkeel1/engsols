/** Semantic status colors aligned with chromatic zoning tokens. */

export const statusStyles = {
  successBadge: "bg-zone-mentorship/15 text-zone-mentorship-on",
  successPill:
    "inline-flex rounded-md bg-zone-mentorship/12 px-2 py-0.5 text-xs font-medium text-zone-mentorship-on",
  successBanner: "rounded-xl bg-zone-mentorship/10 px-4 py-3 text-sm text-zone-mentorship-on",
  successText: "text-sm text-zone-mentorship",
  errorBanner: "rounded-xl bg-zone-news/10 px-4 py-3 text-sm text-zone-news-on",
  errorBannerCenter: "rounded-xl bg-zone-news/10 px-4 py-3 text-center text-sm text-zone-news-on",
  errorText: "text-sm text-zone-news",
  errorTextSm: "text-xs font-medium text-zone-news",
  errorIcon: "text-zone-news",
  errorButton: "text-zone-news hover:text-zone-news/80",
  recruiterBadge: "bg-zone-recruiter/15 text-zone-recruiter-on",
  liveBadge: "bg-zone-live/15 text-zone-live-on",
  examsBadge: "bg-zone-exams/15 text-zone-exams-on",
  pendingBadge: "bg-zone-exams/15 text-zone-exams-on",
  openFilter:
    "border-zone-mentorship-border bg-zone-mentorship/10 text-zone-mentorship-on",
  doneGoal: "border-zone-mentorship-border bg-zone-mentorship/10",
} as const;

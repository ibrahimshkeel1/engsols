export const ENGAGEMENT_EVENT = "engsols-engagement";
const STORAGE_KEY = "engsols-engagement-score";

export function recordEngagement(reason: "saved-mentor" | "forum-post") {
  if (typeof window === "undefined") return;
  const prev = parseInt(localStorage.getItem(STORAGE_KEY) ?? "0", 10);
  localStorage.setItem(STORAGE_KEY, String(prev + 1));
  localStorage.setItem(`engsols-engagement-${reason}`, "1");
  window.dispatchEvent(new CustomEvent(ENGAGEMENT_EVENT, { detail: { reason } }));
}

export function getEngagementMet(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem("engsols-engagement-saved-mentor") === "1") return true;
  if (localStorage.getItem("engsols-engagement-forum-post") === "1") return true;
  return parseInt(localStorage.getItem(STORAGE_KEY) ?? "0", 10) > 0;
}

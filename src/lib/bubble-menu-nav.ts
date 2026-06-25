import type { Locale } from "@/lib/i18n/messages";
import { t } from "@/lib/i18n/messages";
import type { BubbleMenuItem } from "@/components/motion/bubble-menu/BubbleMenu";
import {
  getSiteNavItems,
  moreSiteNav,
  primarySiteNav,
  type SiteNavItem,
} from "@/lib/site-nav";

type HoverStyle = { bgColor: string; textColor: string };

/**
 * Unique hover fill per route — no blues; O&G / earth-tone palette.
 * Each entry is a distinct hue for instant route recognition.
 */
const hrefHoverStyles: Record<string, HoverStyle> = {
  "/mentors": { bgColor: "hsl(168 55% 38%)", textColor: "#ffffff" },
  "/portfolios": { bgColor: "hsl(337 52% 42%)", textColor: "#ffffff" },
  "/forum": { bgColor: "hsl(12 58% 48%)", textColor: "#ffffff" },
  "/live": { bgColor: "hsl(278 62% 52%)", textColor: "#ffffff" },
  "/news": { bgColor: "hsl(346 72% 50%)", textColor: "#ffffff" },
  "/for-you": { bgColor: "hsl(300 58% 48%)", textColor: "#ffffff" },
  "/jobs": { bgColor: "hsl(28 48% 34%)", textColor: "#ffffff" },
  "/certifications": { bgColor: "hsl(265 38% 48%)", textColor: "#ffffff" },
  "/companies": { bgColor: "hsl(20 35% 38%)", textColor: "#ffffff" },
  "/marketplace": { bgColor: "hsl(340 45% 44%)", textColor: "#ffffff" },
  "/videos": { bgColor: "hsl(0 68% 48%)", textColor: "#ffffff" },
  "/search": { bgColor: "hsl(0 0% 28%)", textColor: "#ffffff" },
  "/assist": { bgColor: "hsl(48 72% 44%)", textColor: "#1a1208" },
};

/** Ordered palette — one unique color per menu slot (no blues) */
const menuHoverPalette: HoverStyle[] = [
  hrefHoverStyles["/mentors"],
  hrefHoverStyles["/portfolios"],
  hrefHoverStyles["/forum"],
  hrefHoverStyles["/live"],
  hrefHoverStyles["/news"],
  hrefHoverStyles["/for-you"],
  hrefHoverStyles["/jobs"],
  hrefHoverStyles["/certifications"],
  hrefHoverStyles["/companies"],
  hrefHoverStyles["/marketplace"],
  hrefHoverStyles["/videos"],
  hrefHoverStyles["/search"],
  hrefHoverStyles["/assist"],
];

export const BUBBLE_MENU_CLOSE_EVENT = "engsols:bubble-menu-close";

function toBubbleItem(
  item: SiteNavItem,
  index: number,
  locale: Locale,
): BubbleMenuItem {
  const label = t(locale, item.key);
  const displayLabel = locale === "en" ? label.toLowerCase() : label;

  return {
    label: displayLabel,
    href: item.href,
    ariaLabel: item.outcome ? t(locale, item.outcome) : label,
    rotation: index % 2 === 0 ? -8 : 8,
    hoverStyles:
      hrefHoverStyles[item.href] ?? menuHoverPalette[index % menuHoverPalette.length],
  };
}

/** Primary pills — 5 items matching the React Bits 3+2 grid layout */
export function getBubbleMenuPillItems(locale: Locale): BubbleMenuItem[] {
  return primarySiteNav.map((item, index) => toBubbleItem(item, index, locale));
}

/** Secondary links shown below the pill grid */
export function getBubbleMenuMoreItems(
  locale: Locale,
  showForYou: boolean,
): BubbleMenuItem[] {
  return moreSiteNav
    .filter((item) => !item.authOnly || showForYou)
    .map((item, index) => toBubbleItem(item, primarySiteNav.length + index, locale));
}

/** All menu pebbles — primary + more (auth-gated) */
export function getBubbleMenuItems(locale: Locale, showForYou: boolean): BubbleMenuItem[] {
  return getSiteNavItems(showForYou).map((item, index) => toBubbleItem(item, index, locale));
}

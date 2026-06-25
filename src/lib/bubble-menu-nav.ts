import type { Locale } from "@/lib/i18n/messages";
import { t } from "@/lib/i18n/messages";
import type { BubbleMenuItem } from "@/components/motion/bubble-menu/BubbleMenu";
import {
  hrefHoverStyles,
  menuHoverPalette,
  type NavHoverStyle,
} from "@/lib/nav-hover-colors";
import {
  getSiteNavItems,
  moreSiteNav,
  primarySiteNav,
  type SiteNavItem,
} from "@/lib/site-nav";

type HoverStyle = NavHoverStyle;

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
    transitionTitle: t(locale, item.pageTitleKey ?? item.outcome ?? item.key),
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

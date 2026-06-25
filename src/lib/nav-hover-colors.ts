import {
  OIL_GAS_HSL,
  OIL_GAS_HEX,
  OIL_GAS_NAV_HOVER,
  OIL_GAS_NAV_HOVER_NAVY,
} from "@/lib/oil-gas-palette";

export type NavHoverStyle = { bgColor: string; textColor: string };

/**
 * Route hovers — Oil & Gas palette only (flare orange + maritime navy).
 */
export const hrefHoverStyles: Record<string, NavHoverStyle> = {
  "/mentors": OIL_GAS_NAV_HOVER,
  "/portfolios": OIL_GAS_NAV_HOVER_NAVY,
  "/forum": OIL_GAS_NAV_HOVER,
  "/live": OIL_GAS_NAV_HOVER_NAVY,
  "/news": OIL_GAS_NAV_HOVER,
  "/for-you": OIL_GAS_NAV_HOVER,
  "/jobs": OIL_GAS_NAV_HOVER_NAVY,
  "/certifications": OIL_GAS_NAV_HOVER,
  "/companies": OIL_GAS_NAV_HOVER_NAVY,
  "/marketplace": OIL_GAS_NAV_HOVER,
  "/videos": OIL_GAS_NAV_HOVER_NAVY,
  "/search": OIL_GAS_NAV_HOVER,
  "/assist": OIL_GAS_NAV_HOVER,
};

export const menuHoverPalette: NavHoverStyle[] = [
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

const MENU_ROUTES = Object.keys(hrefHoverStyles).sort((a, b) => b.length - a.length);

export function getNavHoverStyleForPath(pathname: string): NavHoverStyle | null {
  const path = pathname.split("?")[0].split("#")[0] || "/";
  if (hrefHoverStyles[path]) return hrefHoverStyles[path];

  for (const route of MENU_ROUTES) {
    if (path === route || path.startsWith(`${route}/`)) {
      return hrefHoverStyles[route];
    }
  }

  return null;
}

/** Shared class names for route accent (menu hover color). */
export const routeAccentClasses = {
  label: "route-accent-label",
  text: "route-accent-text",
  link: "route-accent-link",
  dot: "route-accent-dot",
  hairline: "route-accent-hairline",
} as const;

/** CSS color for route accent fallbacks */
export const defaultRouteAccent = OIL_GAS_HSL.orange;
export const defaultRouteAccentOn = OIL_GAS_HEX.white;

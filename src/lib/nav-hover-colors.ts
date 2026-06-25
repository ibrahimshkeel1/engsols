export type NavHoverStyle = { bgColor: string; textColor: string };

/**
 * Bright neon hover fill per route — shared by BubbleMenu, Ballpit, and page accents.
 */
export const hrefHoverStyles: Record<string, NavHoverStyle> = {
  "/mentors": { bgColor: "hsl(158 100% 42%)", textColor: "#ffffff" },
  "/portfolios": { bgColor: "hsl(328 100% 58%)", textColor: "#ffffff" },
  "/forum": { bgColor: "hsl(24 100% 52%)", textColor: "#ffffff" },
  "/live": { bgColor: "hsl(285 100% 62%)", textColor: "#ffffff" },
  "/news": { bgColor: "hsl(348 100% 55%)", textColor: "#ffffff" },
  "/for-you": { bgColor: "hsl(305 100% 58%)", textColor: "#ffffff" },
  "/jobs": { bgColor: "hsl(88 100% 48%)", textColor: "#0a0f0a" },
  "/certifications": { bgColor: "hsl(268 100% 62%)", textColor: "#ffffff" },
  "/companies": { bgColor: "hsl(192 100% 48%)", textColor: "#0a0f12" },
  "/marketplace": { bgColor: "hsl(8 100% 55%)", textColor: "#ffffff" },
  "/videos": { bgColor: "hsl(0 100% 52%)", textColor: "#ffffff" },
  "/search": { bgColor: "hsl(220 100% 58%)", textColor: "#ffffff" },
  "/assist": { bgColor: "hsl(62 100% 48%)", textColor: "#0a0a08" },
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

function hslToHex(hsl: string): number {
  const match = hsl.match(/hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)/i);
  if (!match) return 0x888888;

  const h = parseFloat(match[1]);
  const s = parseFloat(match[2]) / 100;
  const l = parseFloat(match[3]) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  const channel = (value: number) => Math.round((value + m) * 255);
  return (channel(r) << 16) | (channel(g) << 8) | channel(b);
}

function shadeHex(hex: number, factor: number): number {
  const r = Math.min(255, Math.max(0, Math.round(((hex >> 16) & 255) * factor)));
  const g = Math.min(255, Math.max(0, Math.round(((hex >> 8) & 255) * factor)));
  const b = Math.min(255, Math.max(0, Math.round((hex & 255) * factor)));
  return (r << 16) | (g << 8) | b;
}

/** Shared class names for route accent (menu hover color). */
export const routeAccentClasses = {
  label: "route-accent-label",
  text: "route-accent-text",
  link: "route-accent-link",
  dot: "route-accent-dot",
  hairline: "route-accent-hairline",
} as const;

export function getBallpitColorsForPath(pathname: string): number[] {
  const style = getNavHoverStyleForPath(pathname);
  if (!style) {
    return [0x00ff88, 0x00e5ff, 0x39ff14];
  }

  const base = hslToHex(style.bgColor);
  return [shadeHex(base, 0.72), base, shadeHex(base, 1.12), shadeHex(base, 1.28)];
}

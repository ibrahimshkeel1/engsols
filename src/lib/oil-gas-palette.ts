/** Shared Oil & Gas industrial palette — animations, hovers, and accents. */
export const OIL_GAS_HEX = {
  white: "#ffffff",
  ice: "#f8fafc",
  navy: "#0f172a",
  navyMuted: "#334155",
  navyLight: "#475569",
  orange: "#ea580c",
  orangeHover: "#c2410c",
  orangeLight: "#fb923c",
} as const;

export const OIL_GAS_HSL = {
  navy: "hsl(222 47% 11%)",
  navyMuted: "hsl(215 25% 27%)",
  orange: "hsl(21 90% 48%)",
  orangeHover: "hsl(17 88% 40%)",
} as const;

export const OIL_GAS_NAV_HOVER = {
  bgColor: OIL_GAS_HSL.orange,
  textColor: OIL_GAS_HEX.white,
} as const;

export const OIL_GAS_NAV_HOVER_NAVY = {
  bgColor: OIL_GAS_HSL.navy,
  textColor: OIL_GAS_HEX.white,
} as const;

/** EngSols-themed dot grid — neutral base, slate-blue on hover (no green). */
export const DOT_GRID_THEME = {
  light: {
    baseColor: "#b4bcc8",
    activeColor: "#4a5f7a",
  },
  dark: {
    baseColor: "#4a5d72",
    activeColor: "#8cb4e8",
  },
} as const;

export const DOT_GRID_DEFAULTS = {
  dotSize: 9,
  gap: 14,
  proximity: 120,
  shockRadius: 220,
  shockStrength: 7,
  returnDuration: 1,
  baseOpacity: 0.65,
} as const;

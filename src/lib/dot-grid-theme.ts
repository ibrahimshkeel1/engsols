import { MOTION_COLORS } from "@/lib/motion-colors";

/** EngSols dot grid — ice base, navy + orange active dots (checkerboard). */
export const DOT_GRID_COLORS = {
  baseColor: MOTION_COLORS.dotGrid.base,
  activeColor: MOTION_COLORS.dotGrid.activeNavy,
  activeColorAlt: MOTION_COLORS.dotGrid.activeOrange,
} as const;

/** @deprecated Use DOT_GRID_COLORS — kept for callers expecting light/dark shape. */
export const DOT_GRID_THEME = {
  light: {
    baseColor: DOT_GRID_COLORS.baseColor,
    activeColor: DOT_GRID_COLORS.activeColor,
    activeColorAlt: DOT_GRID_COLORS.activeColorAlt,
  },
  dark: {
    baseColor: "#4a5d72",
    activeColor: "#8cb4e8",
    activeColorAlt: MOTION_COLORS.dotGrid.activeOrange,
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

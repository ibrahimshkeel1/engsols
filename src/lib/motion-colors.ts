import { OIL_GAS_HEX } from "@/lib/oil-gas-palette";

/** Shared motion / animation colors — ice, navy, flare orange. */
export const MOTION_COLORS = {
  dotGrid: {
    base: "#e2e8f0",
    activeNavy: OIL_GAS_HEX.navy,
    activeOrange: OIL_GAS_HEX.orange,
  },
  pixelReveal: {
    primary: OIL_GAS_HEX.navy,
    alternate: OIL_GAS_HEX.orange,
  },
  pageTransition: {
    title: OIL_GAS_HEX.navy,
    subtitle: OIL_GAS_HEX.navyMuted,
    surface: OIL_GAS_HEX.ice,
  },
} as const;

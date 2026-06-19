export type BentoVariant = "default" | "wide" | "tall" | "hero";

export const BENTO_GRID_CLASS =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:auto-rows-[minmax(11rem,auto)] lg:grid-cols-4 lg:gap-5 lg:auto-rows-[minmax(12rem,auto)]";

/** Repeating 6-card bento pattern; featured profiles get the hero cell. */
export function getBentoVariant(index: number, featured = false): BentoVariant {
  if (featured) return "hero";
  switch (index % 6) {
    case 0:
      return "hero";
    case 2:
      return "wide";
    case 4:
      return "tall";
    default:
      return "default";
  }
}

export function getBentoSpanClass(index: number, featured = false): string {
  if (featured) {
    return "sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2";
  }
  switch (index % 6) {
    case 0:
      return "sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2";
    case 2:
      return "sm:col-span-2 lg:col-span-2";
    case 4:
      return "lg:row-span-2";
    default:
      return "";
  }
}

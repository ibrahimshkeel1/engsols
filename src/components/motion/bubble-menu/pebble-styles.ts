/** Uniform fluid droplet / reservoir lens shape */
export const FLUID_DROP_PEBBLE =
  "bubble-pebble flex max-w-[calc(100vw-2.5rem)] items-center justify-center w-auto shrink-0 px-4 py-3 text-sm font-medium lowercase tracking-wide rounded-[40px_70px_50px_60px_/_50px_60px_40px_70px] shadow-sm sm:max-w-none sm:px-8 sm:py-5 sm:text-lg";

/** Light organic tilt — spacing comes from cluster gap, not negative overlap */
export const PEBBLE_WRAPPERS = [
  "relative rotate-[-2deg] translate-y-0.5",
  "relative rotate-[2deg] -translate-y-0.5",
  "relative -rotate-1 translate-y-1",
  "relative rotate-[3deg] -translate-y-1",
  "relative -rotate-[2deg] translate-y-0",
  "relative rotate-1 -translate-y-1.5",
  "relative -rotate-[3deg] translate-y-1.5",
  "relative rotate-2 translate-y-0",
  "relative -rotate-1 -translate-y-0.5",
  "relative rotate-[2deg] translate-y-1",
  "relative -rotate-2 -translate-y-1",
  "relative rotate-1 translate-y-0.5",
] as const;

export function pebbleWrapper(index: number) {
  return PEBBLE_WRAPPERS[index % PEBBLE_WRAPPERS.length];
}

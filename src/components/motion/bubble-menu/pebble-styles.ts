/** Uniform fluid droplet / reservoir lens shape */
export const FLUID_DROP_PEBBLE =
  "bubble-pebble flex items-center justify-center w-auto shrink-0 px-5 py-3.5 text-base font-medium lowercase tracking-wide rounded-[40px_70px_50px_60px_/_50px_60px_40px_70px] shadow-sm max-sm:max-w-[calc(100vw-2.5rem)] max-sm:px-4 max-sm:py-3 max-sm:text-sm sm:px-8 sm:py-5 sm:text-lg";

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

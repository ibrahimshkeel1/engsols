"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function useMediaQuery(query: string, defaultValue = false) {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => defaultValue,
  );
}

export function useIsTouchDevice() {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(pointer: coarse)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () =>
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches,
    () => false,
  );
}

export function useFontsLoaded() {
  return useSyncExternalStore(
    (callback) => {
      document.fonts.addEventListener("loadingdone", callback);
      return () => document.fonts.removeEventListener("loadingdone", callback);
    },
    () => document.fonts.status === "loaded",
    () => false,
  );
}

"use client";

import { useReducedMotion } from "framer-motion";

export function usePrefersReducedMotion() {
  const reduced = useReducedMotion();
  // Playwright/automation: skip enter animations so smoke tests see headings immediately.
  if (typeof navigator !== "undefined" && navigator.webdriver) return true;
  return reduced ?? false;
}

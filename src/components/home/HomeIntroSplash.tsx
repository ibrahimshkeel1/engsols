"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { BlurText } from "@/components/motion/BlurText";
import { useIsClient } from "@/lib/use-is-client";

const INTRO_STORAGE_KEY = "engsols-home-intro-seen";
const PAUSE_AFTER_ANIMATION_MS = 200;
const FADE_OUT_MS = 350;

const emptySubscribe = () => () => {};

function readIntroSeen() {
  try {
    return sessionStorage.getItem(INTRO_STORAGE_KEY) !== null;
  } catch {
    return true;
  }
}

export function HomeIntroSplash() {
  const isClient = useIsClient();
  const alreadySeen = useSyncExternalStore(emptySubscribe, readIntroSeen, () => true);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);

  const dismiss = useCallback(() => {
    setExiting(true);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        // ignore private browsing quota errors
      }
      setHidden(true);
    }, FADE_OUT_MS);
    return () => window.clearTimeout(timer);
  }, [exiting]);

  useEffect(() => {
    if (!isClient || alreadySeen || hidden) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [alreadySeen, hidden, isClient]);

  useEffect(() => {
    if (!isClient || alreadySeen || hidden || exiting) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [alreadySeen, dismiss, exiting, hidden, isClient]);

  const handleAnimationComplete = useCallback(() => {
    window.setTimeout(dismiss, PAUSE_AFTER_ANIMATION_MS);
  }, [dismiss]);

  if (!isClient || alreadySeen || hidden) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[600] cursor-pointer hero-dark text-text-main antialiased"
      role="dialog"
      aria-label="Welcome"
      aria-hidden={exiting}
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: FADE_OUT_MS / 1000, ease: "easeInOut" }}
      onClick={dismiss}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-70" aria-hidden />
      <div className="relative flex min-h-full items-center justify-center px-6">
        <div
          className="mx-auto max-w-3xl text-center"
          onClick={(event) => event.stopPropagation()}
        >
          <BlurText
            as="h1"
            text="One stop solution for engineers"
            animateBy="words"
            direction="top"
            delay={50}
            stepDuration={0.28}
            startOnMount
            className="text-display-xl text-balance text-text-main"
            onAnimationComplete={handleAnimationComplete}
          />
        </div>
        <button
          type="button"
          className="absolute bottom-8 end-8 text-sm text-text-muted underline-offset-4 hover:underline"
          onClick={dismiss}
        >
          Skip
        </button>
      </div>
    </motion.div>,
    document.body,
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { BlurText } from "@/components/motion/BlurText";

const INTRO_STORAGE_KEY = "engsols-home-intro-seen";
const PAUSE_AFTER_ANIMATION_MS = 600;
const FADE_OUT_MS = 500;

type Phase = "checking" | "visible" | "exiting" | "done";

export function HomeIntroSplash() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [mounted, setMounted] = useState(false);

  const dismiss = useCallback(() => {
    setPhase((current) => (current === "visible" ? "exiting" : current));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(INTRO_STORAGE_KEY)) {
        setPhase("done");
        return;
      }
    } catch {
      setPhase("done");
      return;
    }
    setPhase("visible");
  }, []);

  useEffect(() => {
    if (phase !== "visible" && phase !== "exiting") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "visible") return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, dismiss]);

  const handleAnimationComplete = useCallback(() => {
    window.setTimeout(dismiss, PAUSE_AFTER_ANIMATION_MS);
  }, [dismiss]);

  useEffect(() => {
    if (phase !== "exiting") return;
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        // ignore private browsing quota errors
      }
      setPhase("done");
    }, FADE_OUT_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (!mounted || phase === "checking" || phase === "done") return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[600] cursor-pointer hero-dark text-text-main antialiased"
      role="dialog"
      aria-label="Welcome"
      aria-hidden={phase === "exiting"}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exiting" ? 0 : 1 }}
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
            delay={80}
            stepDuration={0.4}
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

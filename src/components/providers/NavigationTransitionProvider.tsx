"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SplitText } from "@/components/motion/SplitText";
import { useLocale } from "@/components/providers/LocaleProvider";
import { usePrefersReducedMotion } from "@/lib/motion";
import { useIsClient } from "@/lib/use-is-client";
import { BUBBLE_MENU_CLOSE_EVENT } from "@/lib/bubble-menu-nav";
import {
  getTransitionLabelsFromAnchor,
  pathFromHref,
  shouldSkipPageTransition,
} from "@/lib/page-titles";
import { speckleBackgroundStyle } from "@/lib/speckle-texture";

const PAUSE_AFTER_TEXT_MS = 350;
const EXIT_MS = 450;

type TransitionPhase = "presenting" | "navigating" | "exiting";

type ActiveTransition = {
  href: string;
  title: string;
  subtitle?: string;
  phase: TransitionPhase;
};

type NavigationTransitionContextValue = {
  isTransitioning: boolean;
};

const NavigationTransitionContext = createContext<NavigationTransitionContextValue>({
  isTransitioning: false,
});

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function shouldIgnoreAnchor(anchor: HTMLAnchorElement, pathname: string, event: MouseEvent) {
  if (isModifiedClick(event)) return true;
  if (anchor.target === "_blank") return true;
  if (anchor.hasAttribute("download")) return true;
  if (anchor.dataset.noPageTransition !== undefined) return true;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return true;
  }

  if (href.startsWith("http://") || href.startsWith("https://")) {
    try {
      const url = new URL(href);
      if (url.origin !== window.location.origin) return true;
    } catch {
      return true;
    }
  }

  const targetPath = pathFromHref(href);
  if (targetPath === pathname && !href.includes("?")) return true;
  if (shouldSkipPageTransition(targetPath)) return true;

  return false;
}

export function NavigationTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const mounted = useIsClient();
  const [transition, setTransition] = useState<ActiveTransition | null>(null);
  const pendingHrefRef = useRef<string | null>(null);
  const navigateTimerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (navigateTimerRef.current !== null) {
      window.clearTimeout(navigateTimerRef.current);
      navigateTimerRef.current = null;
    }
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);

  const finishTransition = useCallback(() => {
    clearTimers();
    pendingHrefRef.current = null;
    setTransition(null);
  }, [clearTimers]);

  const startExit = useCallback(() => {
    setTransition((current) => (current ? { ...current, phase: "exiting" } : null));
    exitTimerRef.current = window.setTimeout(finishTransition, EXIT_MS);
  }, [finishTransition]);

  const handleTextAnimationComplete = useCallback(() => {
    if (!pendingHrefRef.current) return;

    navigateTimerRef.current = window.setTimeout(() => {
      const href = pendingHrefRef.current;
      if (!href) return;
      setTransition((current) =>
        current ? { ...current, phase: "navigating" } : null,
      );
      router.push(href);
    }, PAUSE_AFTER_TEXT_MS);
  }, [router]);

  useEffect(() => {
    if (!transition || transition.phase !== "navigating") return;
    const targetPath = pathFromHref(transition.href);
    if (pathname === targetPath) {
      const timer = window.setTimeout(startExit, 0);
      return () => window.clearTimeout(timer);
    }
  }, [pathname, startExit, transition]);

  useEffect(() => {
    if (!transition) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [transition]);

  useEffect(() => {
    if (reducedMotion) return;

    const onClick = (event: MouseEvent) => {
      if (transition) return;

      const anchor = (event.target as Element | null)?.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (shouldIgnoreAnchor(anchor, pathname, event)) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (anchor.closest(".bubble-menu-items")) {
        window.dispatchEvent(new CustomEvent(BUBBLE_MENU_CLOSE_EVENT));
      }

      event.preventDefault();
      event.stopPropagation();

      const targetPath = pathFromHref(href);
      const { title, subtitle } = getTransitionLabelsFromAnchor(anchor, targetPath, locale);
      pendingHrefRef.current = href;
      setTransition({ href, title, subtitle, phase: "presenting" });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [locale, pathname, reducedMotion, transition]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const showOverlay = mounted && !reducedMotion && transition !== null;
  const overlayVisible = transition?.phase !== "exiting";

  return (
    <NavigationTransitionContext.Provider value={{ isTransitioning: transition !== null }}>
      {children}
      {showOverlay &&
        createPortal(
          <AnimatePresence>
            {transition && (
              <motion.div
                key={transition.href + transition.title}
                className="fixed inset-0 z-[550] text-text-main antialiased"
                style={speckleBackgroundStyle}
                role="status"
                aria-live="polite"
                aria-busy={overlayVisible}
                initial={{ opacity: 0 }}
                animate={{ opacity: overlayVisible ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: EXIT_MS / 1000, ease: "easeInOut" }}
              >
                <div className="relative flex min-h-full flex-col items-center justify-center px-6 text-center">
                  <SplitText
                    key={`${transition.href}-${transition.title}`}
                    tag="h1"
                    text={transition.title}
                    className="hero-dot-text mx-auto max-w-4xl text-balance"
                    splitType={transition.title.length > 18 ? "words" : "chars"}
                    delay={transition.title.length > 18 ? 55 : 40}
                    duration={0.55}
                    ease="power3.out"
                    play={transition.phase === "presenting"}
                    onAnimationComplete={
                      transition.subtitle ? undefined : handleTextAnimationComplete
                    }
                  />
                  {transition.subtitle && (
                    <SplitText
                      key={`${transition.href}-${transition.subtitle}`}
                      tag="p"
                      text={transition.subtitle}
                      className="hero-dot-text-muted text-body-lg mx-auto mt-4 max-w-2xl text-balance"
                      splitType="words"
                      delay={35}
                      duration={0.45}
                      startDelay={0.35}
                      ease="power3.out"
                      play={transition.phase === "presenting"}
                      onAnimationComplete={handleTextAnimationComplete}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </NavigationTransitionContext.Provider>
  );
}

export function useNavigationTransition() {
  return useContext(NavigationTransitionContext);
}

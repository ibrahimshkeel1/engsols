"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import "./PixelTransition.css";

export type PixelTransitionProps = {
  firstContent: ReactNode;
  secondContent: ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  aspectRatio?: string;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Fill parent height instead of using aspect-ratio padding. */
  fill?: boolean;
  /** Toggle reveal on tap (disabled when nested inside links). */
  enableTouchToggle?: boolean;
  focusable?: boolean;
};

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const touch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touch);
  }, []);

  return isTouch;
}

export function PixelTransition({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = "hsl(var(--background))",
  animationStepDuration = 0.3,
  once = false,
  aspectRatio = "100%",
  className,
  style,
  fill = false,
  enableTouchToggle = false,
  focusable = false,
}: PixelTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixelGridRef = useRef<HTMLDivElement>(null);
  const defaultRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const pixelsBuiltRef = useRef(false);
  const reducedMotion = usePrefersReducedMotion();
  const isTouchDevice = useIsTouchDevice();
  const [isActive, setIsActive] = useState(false);

  const ensurePixelsBuilt = useCallback(() => {
    if (pixelsBuiltRef.current) return;

    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    pixelGridEl.innerHTML = "";

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixelated-image-card__pixel");
        pixel.style.backgroundColor = pixelColor;

        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;
        pixelGridEl.appendChild(pixel);
      }
    }

    pixelsBuiltRef.current = true;
  }, [gridSize, pixelColor]);

  useEffect(() => {
    pixelsBuiltRef.current = false;
  }, [gridSize, pixelColor]);

  const setActiveLayer = useCallback((activate: boolean) => {
    const activeEl = activeRef.current;
    const defaultEl = defaultRef.current;
    if (activeEl) {
      activeEl.style.display = activate ? "block" : "none";
      activeEl.style.pointerEvents = activate ? "none" : "";
    }
    if (defaultEl) {
      defaultEl.style.visibility = activate ? "hidden" : "visible";
    }
  }, []);

  const animatePixels = useCallback(
    (activate: boolean) => {
      setIsActive(activate);

      if (reducedMotion) {
        setActiveLayer(activate);
        return;
      }

      ensurePixelsBuilt();

      const pixelGridEl = pixelGridRef.current;
      const activeEl = activeRef.current;
      if (!pixelGridEl || !activeEl) return;

      const pixels = pixelGridEl.querySelectorAll<HTMLElement>(".pixelated-image-card__pixel");
      if (!pixels.length) return;

      gsap.killTweensOf(pixels);
      delayedCallRef.current?.kill();

      gsap.set(pixels, { display: "none" });

      const totalPixels = pixels.length;
      const staggerDuration = animationStepDuration / totalPixels;

      gsap.to(pixels, {
        display: "block",
        duration: 0,
        stagger: {
          each: staggerDuration,
          from: "random",
        },
      });

      delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
        setActiveLayer(activate);
      });

      gsap.to(pixels, {
        display: "none",
        duration: 0,
        delay: animationStepDuration,
        stagger: {
          each: staggerDuration,
          from: "random",
        },
      });
    },
    [animationStepDuration, ensurePixelsBuilt, reducedMotion, setActiveLayer],
  );

  const handleEnter = () => {
    if (!isActive) animatePixels(true);
  };

  const handleLeave = () => {
    if (isActive && !once) animatePixels(false);
  };

  const handleClick = () => {
    if (!enableTouchToggle) return;
    if (!isActive) animatePixels(true);
    else if (!once) animatePixels(false);
  };

  const useHover = !isTouchDevice || !enableTouchToggle;

  return (
    <div
      ref={containerRef}
      className={cn("pixelated-image-card", fill && "pixelated-image-card--fill", className)}
      style={style}
      onMouseEnter={useHover ? handleEnter : undefined}
      onMouseLeave={useHover ? handleLeave : undefined}
      onClick={isTouchDevice && enableTouchToggle ? handleClick : undefined}
      onFocus={useHover && focusable ? handleEnter : undefined}
      onBlur={useHover && focusable ? handleLeave : undefined}
      tabIndex={focusable ? 0 : -1}
    >
      {!fill && <div className="pixelated-image-card__aspect" style={{ paddingTop: aspectRatio }} />}
      <div
        ref={defaultRef}
        className="pixelated-image-card__default"
        aria-hidden={isActive}
      >
        {firstContent}
      </div>
      <div className="pixelated-image-card__active" ref={activeRef} aria-hidden={!isActive}>
        {secondContent}
      </div>
      <div className="pixelated-image-card__pixels" ref={pixelGridRef} />
    </div>
  );
}

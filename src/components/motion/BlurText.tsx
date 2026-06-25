"use client";

import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type AnimateBy = "words" | "letters";
type Direction = "top" | "bottom";

type AnimationSnapshot = Record<string, string | number>;

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: AnimateBy;
  direction?: Direction;
  threshold?: number;
  rootMargin?: string;
  animationFrom?: AnimationSnapshot;
  animationTo?: AnimationSnapshot[];
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
  as?: ElementType;
  /** When true, animate immediately instead of waiting for intersection. */
  startOnMount?: boolean;
};

function buildKeyframes(from: AnimationSnapshot, steps: AnimationSnapshot[]) {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))]);
  const keyframes: Record<string, (string | number)[]> = {};

  keys.forEach((k) => {
    keyframes[k] = [
      from[k],
      ...steps.map((s) => s[k]),
    ];
  });

  return keyframes;
}

export function BlurText({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
  as: Component = "p",
  startOnMount = false,
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(startOnMount);
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (startOnMount || !ref.current || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, reducedMotion, startOnMount]);

  useEffect(() => {
    if (!reducedMotion) return;
    const timer = window.setTimeout(() => onAnimationComplete?.(), 400);
    return () => window.clearTimeout(timer);
  }, [reducedMotion, onAnimationComplete]);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction],
  );

  const defaultTo = useMemo(
    () =>
      direction === "top"
        ? [
            { filter: "blur(5px)", opacity: 0.5, y: 5 },
            { filter: "blur(0px)", opacity: 1, y: 0 },
          ]
        : [
            { filter: "blur(5px)", opacity: 0.5, y: -5 },
            { filter: "blur(0px)", opacity: 1, y: 0 },
          ],
    [direction],
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;
  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1),
  );

  if (reducedMotion) {
    return (
      <div ref={ref} className={cn("text-center", className)}>
        <Component>{text}</Component>
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <Component className="flex flex-wrap justify-center" style={{ display: "flex", flexWrap: "wrap" }}>
        {elements.map((segment, index) => {
          const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);
          const spanTransition = {
            duration: totalDuration,
            times,
            delay: (index * delay) / 1000,
            ease: easing,
          };

          return (
            <motion.span
              className="inline-block will-change-[transform,filter,opacity]"
              key={`${segment}-${index}`}
              initial={fromSnapshot}
              animate={inView ? animateKeyframes : fromSnapshot}
              transition={spanTransition}
              onAnimationComplete={
                index === elements.length - 1 ? onAnimationComplete : undefined
              }
            >
              {segment === " " ? "\u00A0" : segment}
              {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
            </motion.span>
          );
        })}
      </Component>
    </div>
  );
}

export default BlurText;

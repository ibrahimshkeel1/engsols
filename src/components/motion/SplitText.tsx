"use client";

import {
  useRef,
  useEffect,
  useMemo,
  useState,
  type ElementType,
  type CSSProperties,
} from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  textAlign?: CSSProperties["textAlign"];
  tag?: ElementType;
  play?: boolean;
  /** Delay before the stagger starts (seconds). */
  startDelay?: number;
  onAnimationComplete?: () => void;
  /** React Bits API alias */
  onLetterAnimationComplete?: () => void;
};

export function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 0.6,
  ease = "power3.out",
  splitType = "words",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  textAlign = "center",
  tag: Tag = "p",
  play = true,
  startDelay = 0,
  onAnimationComplete,
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const onCompleteRef = useRef(onAnimationComplete ?? onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onAnimationComplete ?? onLetterAnimationComplete;
  }, [onAnimationComplete, onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
      return;
    }
    void document.fonts.ready.then(() => setFontsLoaded(true));
  }, []);

  const units = useMemo(() => {
    if (splitType === "chars") {
      return text.split("").map((unit, index) => ({
        key: `${unit}-${index}`,
        unit: unit === " " ? "\u00A0" : unit,
        animate: unit !== " ",
      }));
    }
    return text.split(/(\s+)/).filter(Boolean).map((unit, index) => {
      const isSpace = /^\s+$/.test(unit);
      return {
        key: `${unit}-${index}`,
        unit: isSpace ? unit.replace(/ /g, "\u00A0") : unit,
        animate: !isSpace,
      };
    });
  }, [splitType, text]);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded || !play) return;

      const targets = ref.current.querySelectorAll<HTMLElement>(".split-unit");
      if (!targets.length) return;

      gsap.killTweensOf(targets);
      gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          delay: startDelay,
          stagger: delay / 1000,
          onComplete: () => onCompleteRef.current?.(),
        },
      );
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        fontsLoaded,
        play,
        startDelay,
      ],
      scope: ref,
    },
  );

  return (
    <Tag
      ref={ref}
      className={cn("split-parent", className)}
      style={{
        textAlign,
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
        willChange: "transform, opacity",
      }}
    >
      {units.map(({ key, unit, animate }) =>
        animate ? (
          <span key={key} className="split-unit inline-block will-change-transform">
            {unit}
          </span>
        ) : (
          <span key={key} className="split-space" aria-hidden>
            {unit}
          </span>
        ),
      )}
    </Tag>
  );
}

export default SplitText;

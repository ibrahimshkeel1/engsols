"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useIsClient } from "@/lib/use-is-client";
import { BUBBLE_MENU_CLOSE_EVENT } from "@/lib/bubble-menu-nav";
import { FLUID_DROP_PEBBLE, pebbleWrapper } from "@/components/motion/bubble-menu/pebble-styles";
import "./BubbleMenu.css";

export type BubbleMenuItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  transitionTitle?: string;
  transitionSubtitle?: string;
  rotation?: number;
  hoverStyles?: { bgColor?: string; textColor?: string };
};

const DEFAULT_ITEMS: BubbleMenuItem[] = [
  {
    label: "home",
    href: "#",
    ariaLabel: "Home",
    rotation: -8,
    hoverStyles: { bgColor: "#3b82f6", textColor: "#ffffff" },
  },
  {
    label: "about",
    href: "#",
    ariaLabel: "About",
    rotation: 8,
    hoverStyles: { bgColor: "#10b981", textColor: "#ffffff" },
  },
  {
    label: "projects",
    href: "#",
    ariaLabel: "Documentation",
    rotation: 8,
    hoverStyles: { bgColor: "#f59e0b", textColor: "#ffffff" },
  },
  {
    label: "blog",
    href: "#",
    ariaLabel: "Blog",
    rotation: 8,
    hoverStyles: { bgColor: "#ef4444", textColor: "#ffffff" },
  },
  {
    label: "contact",
    href: "#",
    ariaLabel: "Contact",
    rotation: -8,
    hoverStyles: { bgColor: "#8b5cf6", textColor: "#ffffff" },
  },
];

export type BubbleMenuProps = {
  logo: ReactNode | string;
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  items?: BubbleMenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
  overlayClassName?: string;
  overlayFooter?: ReactNode;
  portalOverlay?: boolean;
  trailing?: ReactNode;
  embedInHeader?: boolean;
};

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = "Toggle menu",
  menuBg,
  menuContentColor,
  useFixedPosition = false,
  items,
  animationEase = "power3.out",
  animationDuration = 0.55,
  staggerDelay = 0.06,
  overlayClassName,
  overlayFooter,
  portalOverlay = false,
  trailing,
  embedInHeader = false,
}: BubbleMenuProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const mounted = useIsClient();

  const overlayRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLUListElement>(null);
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const skipPathCloseRef = useRef(true);

  const menuItems = items?.length ? items : DEFAULT_ITEMS;
  const menuOpenBar = embedInHeader && isMenuOpen;
  const overlayPosition = portalOverlay || useFixedPosition ? "fixed" : "absolute";

  const containerClassName = cn(
    "bubble-menu",
    menuOpenBar
      ? "bubble-menu--open-bar fixed"
      : embedInHeader
        ? "bubble-menu--inline"
        : useFixedPosition
          ? "fixed"
          : "absolute",
    className,
  );

  const chromeStyle = {
    ...style,
    ...(menuBg ? { "--bubble-chrome-bg": menuBg } : {}),
    ...(menuContentColor ? { "--bubble-chrome-fg": menuContentColor } : {}),
  } as CSSProperties;

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    onMenuClick?.(false);
  }, [onMenuClick]);

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  useEffect(() => {
    document.body.classList.toggle("bubble-menu-open", isMenuOpen);
    return () => document.body.classList.remove("bubble-menu-open");
  }, [isMenuOpen]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const cluster = clusterRef.current;
    const bubbles = bubblesRef.current.filter(Boolean) as HTMLAnchorElement[];
    const labels = labelRefs.current.filter(Boolean) as HTMLSpanElement[];

    if (!overlay || !bubbles.length) return;

    const targets = [overlay, cluster, ...bubbles, ...labels].filter(Boolean);
    gsap.killTweensOf(targets);

    if (isMenuOpen) {
      gsap.set(overlay, { display: "flex", autoAlpha: 0 });
      if (cluster) gsap.set(cluster, { y: 20, autoAlpha: 0, scale: 0.97 });
      gsap.set(bubbles, { scale: 0.88, autoAlpha: 0, transformOrigin: "50% 50%" });
      gsap.set(labels, { y: 14, autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          gsap.set(bubbles, { clearProps: "transform" });
        },
      });

      tl.to(overlay, { autoAlpha: 1, duration: 0.45, ease: "power2.inOut" }, 0);
      if (cluster) {
        tl.to(
          cluster,
          { y: 0, autoAlpha: 1, scale: 1, duration: animationDuration, ease: "power3.out" },
          0.06,
        );
      }
      tl.to(
        bubbles,
        {
          scale: 1,
          autoAlpha: 1,
          duration: animationDuration,
          ease: animationEase,
          stagger: { each: staggerDelay, from: "start" },
        },
        0.1,
      ).to(
        labels,
        {
          y: 0,
          autoAlpha: 1,
          duration: animationDuration * 0.85,
          ease: "power3.out",
          stagger: { each: staggerDelay * 0.85, from: "start" },
        },
        0.14,
      );
    } else if (showOverlay) {
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          gsap.set(overlay, { display: "none", clearProps: "opacity,visibility" });
          if (cluster) gsap.set(cluster, { clearProps: "all" });
          setShowOverlay(false);
        },
      });

      tl.to(labels, { y: 10, autoAlpha: 0, duration: 0.28, stagger: { each: 0.02, from: "end" } }, 0)
        .to(
          bubbles,
          { scale: 0.9, autoAlpha: 0, duration: 0.32, stagger: { each: 0.02, from: "end" } },
          0.02,
        );
      if (cluster) {
        tl.to(cluster, { y: 14, autoAlpha: 0, scale: 0.98, duration: 0.32 }, 0.06);
      }
      tl.to(overlay, { autoAlpha: 0, duration: 0.38 }, 0.1);
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  useEffect(() => {
    if (!isMenuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen, closeMenu]);

  useEffect(() => {
    const handleExternalClose = () => closeMenu();
    window.addEventListener(BUBBLE_MENU_CLOSE_EVENT, handleExternalClose);
    return () => window.removeEventListener(BUBBLE_MENU_CLOSE_EVENT, handleExternalClose);
  }, [closeMenu]);

  useEffect(() => {
    if (skipPathCloseRef.current) {
      skipPathCloseRef.current = false;
      return;
    }
    closeMenu();
  }, [pathname, closeMenu]);

  const toggleButton = (
    <button
      type="button"
      className={cn("bubble toggle-bubble menu-btn", isMenuOpen && "open")}
      onClick={handleToggle}
      aria-label={menuAriaLabel}
      aria-pressed={isMenuOpen}
    >
      <span className="menu-line" />
      <span className="menu-line short" />
    </button>
  );

  const overlay =
    showOverlay && mounted ? (
      <div
        ref={overlayRef}
        className={cn(
          "bubble-menu-items",
          overlayPosition,
          portalOverlay && "bubble-menu-items--portaled bubble-menu-items--themed",
          overlayClassName,
        )}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          className="bubble-menu-items__backdrop"
          onClick={closeMenu}
          aria-label="Close menu"
          tabIndex={isMenuOpen ? 0 : -1}
        />
        <div className="bubble-menu-items__body">
          <ul
            ref={clusterRef}
            className="bubble-pebble-cluster"
            role="menu"
            aria-label="Menu links"
          >
          {menuItems.map((item, idx) => (
            <li
              key={`${item.href}-${idx}`}
              role="none"
              className={cn("list-none", pebbleWrapper(idx))}
            >
              <a
                role="menuitem"
                href={item.href}
                aria-label={item.ariaLabel || item.label}
                data-transition-title={item.transitionTitle}
                data-transition-subtitle={item.transitionSubtitle}
                className={cn(FLUID_DROP_PEBBLE, "relative z-0 hover:z-10")}
                style={
                  {
                    "--hover-bg": item.hoverStyles?.bgColor || "#ea580c",
                    "--hover-color": item.hoverStyles?.textColor || "#ffffff",
                  } as CSSProperties
                }
                ref={(el) => {
                  bubblesRef.current[idx] = el;
                }}
                onClick={() => closeMenu()}
              >
                <span
                  className="pill-label"
                  ref={(el) => {
                    labelRefs.current[idx] = el;
                  }}
                >
                  {item.label}
                </span>
              </a>
            </li>
          ))}
          </ul>
        </div>
        {overlayFooter ? <div className="overlay-footer">{overlayFooter}</div> : null}
      </div>
    ) : null;

  const nav = (
    <nav className={containerClassName} style={chromeStyle} aria-label="Main navigation">
      <div className="bubble logo-bubble" aria-label="Logo">
        <span className="logo-content">
          {typeof logo === "string" ? (
            <img src={logo} alt="Logo" className="bubble-logo" />
          ) : (
            logo
          )}
        </span>
      </div>

      {trailing && !menuOpenBar ? (
        <div className="bubble-menu__right">
          <div className="bubble-menu__trailing">{trailing}</div>
          {toggleButton}
        </div>
      ) : (
        toggleButton
      )}
    </nav>
  );

  return (
    <>
      {menuOpenBar ? createPortal(nav, document.body) : nav}
      {overlay ? createPortal(overlay, document.body) : null}
    </>
  );
}

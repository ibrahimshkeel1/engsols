"use client";

import Link from "next/link";
import { useCallback, useEffect, type ReactNode } from "react";
import BubbleMenu from "@/components/motion/bubble-menu/BubbleMenu";
import { useLocale } from "@/components/providers/LocaleProvider";
import { t } from "@/lib/i18n/messages";
import { getBubbleMenuItems } from "@/lib/bubble-menu-nav";

type SiteMenuProps = {
  showForYou?: boolean;
  footer?: ReactNode;
  trailing?: ReactNode;
};

export function SiteMenu({ showForYou = false, footer, trailing }: SiteMenuProps) {
  const { locale } = useLocale();
  const items = getBubbleMenuItems(locale, showForYou);

  const onMenuClick = useCallback((open: boolean) => {
    document.body.style.overflow = open ? "hidden" : "";
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <BubbleMenu
      logo={
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-oil-gas-white transition-opacity hover:opacity-85"
        >
          <span className="text-oil-gas-white">Eng</span>
          <span className="text-oil-gas-orange">Sols</span>
        </Link>
      }
      items={items}
      menuAriaLabel={t(locale, "menu")}
      useFixedPosition={false}
      portalOverlay
      embedInHeader
      animationEase="power3.out"
      animationDuration={0.55}
      staggerDelay={0.06}
      onMenuClick={onMenuClick}
      trailing={trailing}
      className="w-full"
      overlayFooter={footer}
    />
  );
}

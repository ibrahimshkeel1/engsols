"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  const isLiveRoom = pathname.includes("/live/") && pathname.endsWith("/room");

  if (isLiveRoom || reducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

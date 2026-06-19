"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

export function MentorMobileBookBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 420);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 inset-x-0 z-[45] px-4 lg:hidden">
      <a
        href="#book-intro"
        className="mx-auto flex h-12 max-w-md items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30"
      >
        <Calendar className="h-4 w-4" />
        Book free intro
      </a>
    </div>
  );
}

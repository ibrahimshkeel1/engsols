"use client";

import { useEffect } from "react";

/** Hide site chrome during calls — reduces repaints that glitch video on desktop. */
export function LiveRoomChrome() {
  useEffect(() => {
    document.documentElement.classList.add("live-room-active");
    return () => {
      document.documentElement.classList.remove("live-room-active");
    };
  }, []);

  return null;
}

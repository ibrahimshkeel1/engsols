"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@livekit/components-react";
import type { ReceivedChatMessage } from "@livekit/components-core";
import { cn } from "@/lib/utils";

const TOAST_MS = 6000;
const MAX_VISIBLE = 5;

type ChatToast = {
  id: string;
  name: string;
  message: string;
};

function messageId(message: ReceivedChatMessage): string {
  return message.id ?? `${message.timestamp}-${message.from?.identity ?? "unknown"}`;
}

function senderLabel(message: ReceivedChatMessage): string {
  return message.from?.name || message.from?.identity || "Participant";
}

type Props = {
  className?: string;
};

export function LiveChatFloatingMessages({ className }: Props) {
  const { chatMessages } = useChat();
  const seenIdsRef = useRef(new Set<string>());
  const bootstrappedRef = useRef(false);
  const [toasts, setToasts] = useState<ChatToast[]>([]);

  useEffect(() => {
    if (!bootstrappedRef.current) {
      for (const message of chatMessages) {
        seenIdsRef.current.add(messageId(message));
      }
      bootstrappedRef.current = true;
      return;
    }

    const fresh = chatMessages.filter((message) => {
      const id = messageId(message);
      if (seenIdsRef.current.has(id)) return false;
      seenIdsRef.current.add(id);
      return true;
    });

    if (fresh.length === 0) return;

    const nextToasts = fresh
      .filter((message) => message.message.trim().length > 0)
      .map((message) => ({
        id: messageId(message),
        name: senderLabel(message),
        message: message.message.trim(),
      }));

    if (nextToasts.length === 0) return;

    setToasts((current) => [...current, ...nextToasts].slice(-MAX_VISIBLE));

    for (const toast of nextToasts) {
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, TOAST_MS);
    }
  }, [chatMessages]);

  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-[calc(var(--live-control-dock-height)+1rem)] left-4 right-4 z-30 flex flex-col items-start gap-2 sm:left-auto sm:right-4 sm:max-w-sm",
        className,
      )}
      aria-live="polite"
      aria-label="Live chat messages"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="live-chat-toast w-full rounded-xl border border-zone-live/25 bg-bg-surface/95 px-3 py-2.5 shadow-lg backdrop-blur-md"
        >
          <p className="text-xs font-semibold text-zone-live">{toast.name}</p>
          <p className="mt-0.5 text-sm leading-snug text-text-main">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}

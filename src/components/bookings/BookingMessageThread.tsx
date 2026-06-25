"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { sendBookingMessage } from "@/actions/booking-messages";
import type { BookingMessage } from "@/lib/data/booking-messages";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  bookingId: string;
  currentUserId: string;
  initialMessages: BookingMessage[];
  disabled?: boolean;
};

export function BookingMessageThread({
  bookingId,
  currentUserId,
  initialMessages,
  disabled = false,
}: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || disabled) return;

    startTransition(async () => {
      const result = await sendBookingMessage(bookingId, trimmed);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          bookingRequestId: bookingId,
          senderId: currentUserId,
          senderName: "You",
          body: trimmed,
          createdAt: new Date().toISOString(),
        },
      ]);
      setBody("");
      toast.success("Message sent");
    });
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-oil-gas-navy">Messages</h3>
      <div className="max-h-72 space-y-3 overflow-y-auto rounded-xl border border-border bg-oil-gas-ice/80 p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-oil-gas-navy-muted">
            No messages yet. Coordinate timing, goals, or follow-ups here.
          </p>
        ) : (
          messages.map((msg) => {
            const mine = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}
              >
                <p className="text-[10px] font-medium text-oil-gas-navy-muted">
                  {mine ? "You" : msg.senderName} · {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                </p>
                <p
                  className={cn(
                    "max-w-[90%] rounded-2xl px-3 py-2 text-sm",
                    mine
                      ? "bg-oil-gas-orange text-white"
                      : "border border-border bg-white text-oil-gas-navy",
                  )}
                >
                  {msg.body}
                </p>
              </div>
            );
          })
        )}
      </div>

      {!disabled && (
        <form onSubmit={handleSend} className="flex gap-2">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            placeholder="Write a message to your mentor…"
            className="min-h-0 flex-1"
          />
          <Button
            type="submit"
            variant="accent"
            disabled={pending || !body.trim()}
            className="shrink-0 self-end"
            aria-label="Send message"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      )}
    </div>
  );
}

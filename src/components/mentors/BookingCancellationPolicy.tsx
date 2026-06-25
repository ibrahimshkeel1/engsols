import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "inline" | "card";
  className?: string;
};

export function BookingCancellationPolicy({ variant = "inline", className }: Props) {
  const text =
    "Cancel anytime — no lock-in. Monthly plans bill through Stripe; manage or cancel from your account settings.";

  if (variant === "card") {
    return (
      <div
        className={cn(
          "flex gap-3 rounded-xl border border-oil-gas-orange/25 bg-oil-gas-orange/5 px-4 py-3 text-xs text-oil-gas-navy-muted",
          className,
        )}
      >
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-oil-gas-orange" aria-hidden />
        <p>{text}</p>
      </div>
    );
  }

  return (
    <p className={cn("text-xs text-oil-gas-navy-muted", className)}>
      <ShieldCheck className="me-1 inline h-3.5 w-3.5 text-oil-gas-orange" aria-hidden />
      {text}
    </p>
  );
}

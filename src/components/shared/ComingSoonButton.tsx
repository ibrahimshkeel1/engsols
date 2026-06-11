"use client";

import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";

type ComingSoonButtonProps = ButtonProps & {
  message?: string;
};

export function ComingSoonButton({
  message = "This feature is coming soon!",
  onClick,
  children,
  ...props
}: ComingSoonButtonProps) {
  return (
    <Button
      {...props}
      onClick={(e) => {
        toast.info(message);
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
}

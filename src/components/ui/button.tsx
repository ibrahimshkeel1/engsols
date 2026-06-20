import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-sm",
        secondary: "border border-border bg-surface text-foreground hover:bg-muted/60",
        ghost: "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        outline: "border border-border bg-surface text-foreground hover:bg-muted/60",
        accent: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-sm",
        zoneMentorship:
          "bg-zone-mentorship text-white hover:brightness-110 dark:text-bg-main",
        zoneExams: "bg-zone-exams text-white hover:brightness-110 dark:text-bg-main",
        zoneNews: "bg-zone-news text-white hover:brightness-110 dark:text-bg-main",
        zoneRecruiter:
          "bg-zone-recruiter text-white hover:brightness-110 dark:text-bg-main",
        zoneLive: "bg-zone-live text-white hover:brightness-110 dark:text-bg-main",
        destructive: "bg-zone-news text-white hover:brightness-110 dark:text-bg-main",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

type ButtonLinkProps = VariantProps<typeof buttonVariants> &
  React.ComponentProps<typeof Link> & {
    className?: string;
  };

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

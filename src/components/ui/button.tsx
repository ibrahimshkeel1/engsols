import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium text-oil-gas-white transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:text-oil-gas-white",
  {
    variants: {
      variant: {
        default:
          "bg-oil-gas-orange text-oil-gas-white hover:bg-oil-gas-navy",
        secondary:
          "border border-transparent bg-oil-gas-navy text-oil-gas-white hover:bg-oil-gas-orange",
        ghost:
          "border border-transparent bg-oil-gas-navy text-oil-gas-white hover:bg-oil-gas-orange",
        outline:
          "border border-transparent bg-oil-gas-navy-muted text-oil-gas-white hover:bg-oil-gas-orange",
        accent:
          "bg-oil-gas-orange text-oil-gas-white hover:bg-oil-gas-navy",
        zoneMentorship:
          "bg-oil-gas-orange text-oil-gas-white hover:bg-oil-gas-navy",
        zoneExams: "bg-oil-gas-orange text-oil-gas-white hover:bg-oil-gas-navy",
        zoneNews: "bg-oil-gas-navy text-oil-gas-white hover:bg-oil-gas-orange",
        zoneRecruiter: "bg-oil-gas-navy text-oil-gas-white hover:bg-oil-gas-orange",
        zoneLive: "bg-oil-gas-navy-muted text-oil-gas-white hover:bg-oil-gas-orange",
        destructive:
          "bg-oil-gas-orange text-oil-gas-white hover:bg-oil-gas-navy",
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

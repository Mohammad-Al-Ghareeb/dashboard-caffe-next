import * as React from "react";
import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-brand-500 text-white shadow-glow hover:bg-brand-600 focus-visible:ring-brand-500",
  secondary:
    "bg-slate-900/5 text-slate-900 hover:bg-slate-900/10 focus-visible:ring-slate-500 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-900/5 focus-visible:ring-slate-500 dark:text-slate-200 dark:hover:bg-white/10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

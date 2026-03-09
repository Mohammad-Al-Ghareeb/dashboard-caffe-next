import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-xl border border-slate-300/70 bg-white/70 px-3 text-sm text-slate-900 outline-none ring-brand-500 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

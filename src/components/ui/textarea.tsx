import * as React from "react";
import { cn } from "@/lib/cn";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-slate-300/70 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none ring-brand-500 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

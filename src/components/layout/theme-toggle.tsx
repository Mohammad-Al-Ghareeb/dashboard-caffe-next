"use client";

import { Switch } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useThemeStore } from "@/lib/stores/theme-store";

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <div className="flex items-center gap-2">
      <SunIcon className="h-4 w-4 text-amber-500" />
      <Switch
        checked={theme === "dark"}
        onChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="group relative inline-flex h-7 w-12 items-center rounded-full bg-slate-300/90 transition data-[checked]:bg-brand-500"
      >
        <span
          className="inline-block h-5 w-5 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6"
          aria-hidden="true"
        />
      </Switch>
      <MoonIcon className="h-4 w-4 text-indigo-400" />
    </div>
  );
}

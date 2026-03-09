"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useI18n } from "@/lib/use-i18n";

export function LanguageSwitcher() {
  const { locale, changeLanguage } = useI18n();

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800">
        <GlobeAltIcon className="h-4 w-4" />
        <span className="uppercase">{locale}</span>
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="z-10 mt-2 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <MenuItem>
          <button
            type="button"
            onClick={() => changeLanguage("en")}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            English
          </button>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            onClick={() => changeLanguage("ar")}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            العربية
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

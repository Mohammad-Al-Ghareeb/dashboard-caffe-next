"use client";

import {
  Bars3BottomLeftIcon,
  FolderIcon,
  HomeIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/use-i18n";
import { useUiStore } from "@/lib/stores/ui-store";

type AppShellProps = {
  children: React.ReactNode;
};

function NavItems({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();
  const { t } = useI18n();

  const navItems = [
    { href: "/", label: t("nav.dashboard"), icon: HomeIcon },
    { href: "/categories", label: t("nav.categories"), icon: FolderIcon },
    { href: "/products", label: t("nav.products"), icon: ShoppingBagIcon },
    { href: "/orders", label: t("nav.orders"), icon: Bars3BottomLeftIcon },
  ];

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-brand-500 text-white shadow-glow"
                : "text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

const titles: Record<string, string> = {
  "/": "dashboard.title",
  "/categories": "nav.categories",
  "/products": "nav.products",
  "/orders": "nav.orders",
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1500px] gap-6 p-4 sm:p-6">
      <aside className="surface hidden w-64 shrink-0 p-4 lg:block">
        <div className="mb-6 rounded-2xl bg-brand-500/95 p-4 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/80">
            Cafe Menu
          </p>
          <p className="mt-1 text-xl font-bold">Control Center</p>
        </div>
        <NavItems />
      </aside>

      <Transition show={mobileNavOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setMobileNavOpen}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-950/60" />
          </TransitionChild>
          <div className="fixed inset-0 flex">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in duration-150"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="surface m-4 w-72 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-lg font-semibold">{t("common.menu")}</p>
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen(false)}
                    className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <NavItems onClick={() => setMobileNavOpen(false)} />
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      <div className="min-w-0 flex-1 space-y-4">
        <header className="surface flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="rounded-xl border border-slate-200/70 bg-white/70 p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 lg:hidden"
            >
              <Bars3BottomLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {t(titles[pathname] ?? "dashboard.title")}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {t("dashboard.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <main className="space-y-4">{children}</main>
      </div>
    </div>
  );
}

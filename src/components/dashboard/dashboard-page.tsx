"use client";
// This is the main dashboard page that shows key metrics and recent orders. It uses various hooks to fetch data and displays it in a clean, responsive layout.
import {
  ArrowTrendingUpIcon,
  CubeIcon,
  FolderIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { useCategories } from "@/lib/hooks/use-categories";
import { useOrders } from "@/lib/hooks/use-orders";
import { useProducts } from "@/lib/hooks/use-products";
import { useI18n } from "@/lib/use-i18n";
import { formatDateTime, formatMoney } from "@/lib/format";

const metricKeys = [
  {
    titleKey: "dashboard.totalCategories",
    icon: FolderIcon,
    href: "/categories",
    key: "categories",
  },
  {
    titleKey: "dashboard.totalProducts",
    icon: ShoppingBagIcon,
    href: "/products",
    key: "products",
  },
  {
    titleKey: "dashboard.liveOrders",
    icon: CubeIcon,
    href: "/orders",
    key: "orders",
  },
  {
    titleKey: "dashboard.revenue",
    icon: ArrowTrendingUpIcon,
    href: "/orders",
    key: "revenue",
  },
] as const;

export function DashboardPage() {
  const { t } = useI18n();
  const categoriesQuery = useCategories();
  const productsQuery = useProducts();
  const ordersQuery = useOrders({ page: 1, perPage: 8 });

  if (
    categoriesQuery.isLoading ||
    productsQuery.isLoading ||
    ordersQuery.isLoading
  ) {
    return <LoadingState label={t("dashboard.loading")} />;
  }

  if (categoriesQuery.error || productsQuery.error || ordersQuery.error) {
    return (
      <ErrorState
        message={
          categoriesQuery.error?.message ||
          productsQuery.error?.message ||
          ordersQuery.error?.message ||
          t("dashboard.error")
        }
      />
    );
  }

  const orders = ordersQuery.data?.orders ?? [];

  const metrics = {
    categories: categoriesQuery.data?.count ?? 0,
    products: productsQuery.data?.count ?? 0,
    orders: orders.filter((order) => order.status !== "COMPLETED").length,
    revenue: formatMoney(
      orders
        .filter((order) => order.status !== "CANCELLED")
        .reduce((sum, order) => sum + (order.totalAmount ?? 0), 0),
    ),
  };

  return (
    <div className="space-y-4">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricKeys.map((metric, index) => (
          <Link key={metric.titleKey} href={metric.href}>
            <Card
              className="group animate-fade-up cursor-pointer border border-white/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {t(metric.titleKey)}
                </p>
                <metric.icon className="h-5 w-5 text-brand-500" />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
                {metrics[metric.key]}
              </p>
            </Card>
          </Link>
        ))}
      </section>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t("dashboard.recentOrders")}
          </h2>
          <Link
            href="/orders"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            {t("dashboard.viewAll")}
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <th className="px-3 py-2">{t("orders.customer")}</th>
                <th className="px-3 py-2">{t("orders.orderType")}</th>
                <th className="px-3 py-2">{t("orders.total")}</th>
                <th className="px-3 py-2">{t("orders.status")}</th>
                <th className="px-3 py-2">{t("orders.createdAt")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-slate-100/80 dark:border-slate-800"
                >
                  <td className="px-3 py-3">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {order.customerPhone}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-slate-700 dark:text-slate-200">
                    {order.orderType}
                  </td>
                  <td className="px-3 py-3 text-slate-700 dark:text-slate-200">
                    {formatMoney(order.totalAmount)}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                    {formatDateTime(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

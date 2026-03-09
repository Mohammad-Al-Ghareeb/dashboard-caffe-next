import type { OrderStatus, OrderType } from "@/lib/types";

export const ORDER_TYPES = ["DINE_IN", "TAKEAWAY", "DELIVERY"] as const;
export const ORDER_STATUSES = [
  "NEW",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
] as const;

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  NEW: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  PREPARING: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  READY: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  COMPLETED: "bg-green-500/15 text-green-700 dark:text-green-300",
  CANCELLED: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

import { format } from "date-fns";
import type { OrderStatus, OrderType } from "@/lib/types";

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return format(date, "MMM d, yyyy HH:mm");
}

export function labelOrderType(value: OrderType): string {
  switch (value) {
    case "DINE_IN":
      return "Dine In";
    case "TAKEAWAY":
      return "Takeaway";
    case "DELIVERY":
      return "Delivery";
    default:
      return value;
  }
}

export function labelOrderStatus(value: OrderStatus): string {
  switch (value) {
    case "NEW":
      return "New";
    case "PREPARING":
      return "Preparing";
    case "READY":
      return "Ready";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return value;
  }
}

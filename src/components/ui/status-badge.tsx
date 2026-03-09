import { ORDER_STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { labelOrderStatus } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

type StatusBadgeProps = {
  status: OrderStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        ORDER_STATUS_COLORS[status],
        className,
      )}
    >
      {labelOrderStatus(status)}
    </span>
  );
}

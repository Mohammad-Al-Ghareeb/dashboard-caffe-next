"use client";

import { Modal } from "@/components/ui/modal";
import { LoadingState } from "@/components/ui/loading-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime, formatMoney, labelOrderType } from "@/lib/format";
import { useOrder } from "@/lib/hooks/use-orders";
import { useUiStore } from "@/lib/stores/ui-store";

export function OrderDetailsModal() {
  const orderDetailsId = useUiStore((state) => state.orderDetailsId);
  const setOrderDetailsId = useUiStore((state) => state.setOrderDetailsId);
  const orderQuery = useOrder(orderDetailsId);

  const order = orderQuery.data;

  return (
    <Modal
      open={Boolean(orderDetailsId)}
      onClose={() => setOrderDetailsId(null)}
      title="Order Details"
      description="Review customer details and item snapshot at time of order."
    >
      {orderQuery.isLoading ? (
        <LoadingState label="Loading order details..." />
      ) : order ? (
        <div className="space-y-4">
          <div className="grid gap-3 rounded-xl border border-slate-200/70 p-4 dark:border-slate-700 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Customer
              </p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {order.customerName}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {order.customerPhone}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Type
              </p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {labelOrderType(order.orderType)}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {order.tableNumber || order.address || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Status
              </p>
              <StatusBadge status={order.status} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Created At
              </p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/70 dark:border-slate-700">
            <div className="border-b border-slate-200/70 px-4 py-3 dark:border-slate-700">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                Items
              </h4>
            </div>
            <ul className="divide-y divide-slate-200/70 dark:divide-slate-700">
              {order.items.map((item, idx) => (
                <li
                  key={`${item.name}-${idx}`}
                  className="flex items-start justify-between gap-4 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Qty: {item.quantity}
                    </p>
                    {item.notes ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Notes: {item.notes}
                      </p>
                    ) : null}
                  </div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    {formatMoney(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {order.notes ? (
            <div className="rounded-xl border border-slate-200/70 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <span className="font-medium">Order Notes:</span> {order.notes}
            </div>
          ) : null}

          <div className="flex justify-end">
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Total: {formatMoney(order.totalAmount)}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Order not found.
        </p>
      )}
    </Modal>
  );
}

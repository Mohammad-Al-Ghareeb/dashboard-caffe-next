"use client";

import {
  EyeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useDeferredValue, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { ORDER_STATUSES } from "@/lib/constants";
import {
  formatDateTime,
  formatMoney,
  labelOrderStatus,
  labelOrderType,
} from "@/lib/format";
import {
  useDeleteOrder,
  useOrders,
  useUpdateOrderStatus,
} from "@/lib/hooks/use-orders";
import { useProducts } from "@/lib/hooks/use-products";
import { useUiStore } from "@/lib/stores/ui-store";
import type { OrderStatus } from "@/lib/types";
import { OrderDetailsModal } from "./order-details-modal";
import { OrderFormModal } from "./order-form-modal";

function toRangeIso(
  dateString?: string,
  endOfDay?: boolean,
): string | undefined {
  if (!dateString) return undefined;
  const date = new Date(`${dateString}T${endOfDay ? "23:59:59" : "00:00:00"}`);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

export function OrdersPage() {
  const [status, setStatus] = useState<"" | OrderStatus>("");
  const [customerPhone, setCustomerPhone] = useState("");
  const deferredPhone = useDeferredValue(customerPhone);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const filters = useMemo(
    () => ({
      page,
      perPage,
      status: status || undefined,
      customerPhone: deferredPhone.trim() || undefined,
      from: toRangeIso(fromDate),
      to: toRangeIso(toDate, true),
    }),
    [page, perPage, status, deferredPhone, fromDate, toDate],
  );

  const ordersQuery = useOrders(filters);
  const productsQuery = useProducts({ isAvailable: true });
  const updateStatusMutation = useUpdateOrderStatus();
  const deleteMutation = useDeleteOrder();
  const setOrderCreateOpen = useUiStore((state) => state.setOrderCreateOpen);
  const setOrderDetailsId = useUiStore((state) => state.setOrderDetailsId);

  if (ordersQuery.isLoading || productsQuery.isLoading) {
    return <LoadingState label="Loading orders dashboard..." />;
  }

  if (ordersQuery.error || productsQuery.error) {
    return (
      <ErrorState
        message={
          ordersQuery.error?.message ||
          productsQuery.error?.message ||
          "Failed to load order dashboard"
        }
        onRetry={() => {
          ordersQuery.refetch();
          productsQuery.refetch();
        }}
      />
    );
  }

  const ordersData = ordersQuery.data;
  const orders = ordersData?.orders ?? [];
  const availableProducts = productsQuery.data?.products ?? [];
  const totalPages = Math.max(1, Math.ceil((ordersData?.count ?? 0) / perPage));

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Orders Dashboard
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Monitor, filter, and update orders in real-time for kitchen and
              service staff.
            </p>
          </div>
          <Button onClick={() => setOrderCreateOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-6">
          <div className="relative lg:col-span-2">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search by customer phone"
              value={customerPhone}
              onChange={(event) => {
                setPage(1);
                setCustomerPhone(event.target.value);
              }}
            />
          </div>

          <Select
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value as "" | OrderStatus);
            }}
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((item) => (
              <option key={item} value={item}>
                {labelOrderStatus(item)}
              </option>
            ))}
          </Select>

          <Input
            type="date"
            value={fromDate}
            onChange={(event) => {
              setPage(1);
              setFromDate(event.target.value);
            }}
          />

          <Input
            type="date"
            value={toDate}
            onChange={(event) => {
              setPage(1);
              setToDate(event.target.value);
            }}
          />

          <Select
            value={String(perPage)}
            onChange={(event) => {
              setPage(1);
              setPerPage(Number(event.target.value));
            }}
          >
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
            <option value="50">50 / page</option>
          </Select>
        </div>
      </Card>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="Try changing your filters or create a new order."
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/70 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-slate-100/80 transition hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-900/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {order.customerPhone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {order.items.length}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {labelOrderType(order.orderType)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {formatMoney(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex min-w-44 items-center gap-2">
                        <StatusBadge status={order.status} />
                        <Select
                          className="h-8 text-xs"
                          defaultValue={order.status}
                          onChange={(event) =>
                            updateStatusMutation.mutate({
                              id: order._id,
                              status: event.target.value as OrderStatus,
                            })
                          }
                        >
                          {ORDER_STATUSES.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {labelOrderStatus(statusOption)}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          className="h-8 px-2"
                          onClick={() => setOrderDetailsId(order._id)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-8 px-2 text-rose-600"
                          onClick={() =>
                            setDeleteTarget({
                              id: order._id,
                              label: `${order.customerName} (${order.customerPhone})`,
                            })
                          }
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200/70 px-4 py-3 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Page {ordersData?.page ?? page} of {totalPages} (
              {ordersData?.count ?? 0} total)
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="h-8 px-3"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                className="h-8 px-3"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}

      <OrderFormModal products={availableProducts} />
      <OrderDetailsModal />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete order"
        description={`Delete order for ${deleteTarget?.label ?? ""}? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteMutation.mutateAsync(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}

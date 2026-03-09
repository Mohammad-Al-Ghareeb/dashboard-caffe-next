"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ORDER_TYPES } from "@/lib/constants";
import { formatMoney, labelOrderType } from "@/lib/format";
import { useCreateOrder } from "@/lib/hooks/use-orders";
import { useUiStore } from "@/lib/stores/ui-store";
import { orderFormSchema, type OrderFormValues } from "@/lib/validation";
import type { Product } from "@/lib/types";

type OrderFormModalProps = {
  products: Product[];
};

function buildDefaultValues(products: Product[]): OrderFormValues {
  return {
    customerName: "",
    customerPhone: "",
    tableNumber: "",
    orderType: "DINE_IN",
    address: "",
    notes: "",
    items: [
      {
        product: products[0]?._id ?? "",
        quantity: 1,
        notes: "",
      },
    ],
  };
}

export function OrderFormModal({ products }: OrderFormModalProps) {
  const open = useUiStore((state) => state.orderCreateOpen);
  const setOpen = useUiStore((state) => state.setOrderCreateOpen);
  const createMutation = useCreateOrder();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: buildDefaultValues(products),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (!open) return;
    form.reset(buildDefaultValues(products));
  }, [open, products, form]);

  const watchedItems = form.watch("items");
  const orderType = form.watch("orderType");

  const productMap = useMemo(
    () => new Map(products.map((product) => [product._id, product])),
    [products],
  );

  const totalAmount = useMemo(() => {
    return watchedItems.reduce((sum, item) => {
      const product = productMap.get(item.product);
      const quantity = Number(item.quantity) || 0;
      return sum + (product?.price ?? 0) * quantity;
    }, 0);
  }, [watchedItems, productMap]);

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = {
      ...values,
      orderType: values.orderType as "DINE_IN" | "TAKEAWAY" | "DELIVERY",
      address: values.address?.trim() || undefined,
      tableNumber: values.tableNumber?.trim() || undefined,
      notes: values.notes?.trim() || undefined,
      items: values.items.map((item) => ({
        ...item,
        notes: item.notes?.trim() || undefined,
      })),
    };

    await createMutation.mutateAsync(payload);
    setOpen(false);
  });

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="Create New Order"
      description="Capture customer details and order items with live total calculation."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Customer Name"
            htmlFor="order-customer-name"
            error={form.formState.errors.customerName?.message}
          >
            <Input
              id="order-customer-name"
              placeholder="John Smith"
              {...form.register("customerName")}
            />
          </FormField>

          <FormField
            label="Customer Phone"
            htmlFor="order-customer-phone"
            error={form.formState.errors.customerPhone?.message}
          >
            <Input
              id="order-customer-phone"
              placeholder="+1 555 123 456"
              {...form.register("customerPhone")}
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Order Type"
            htmlFor="order-type"
            error={form.formState.errors.orderType?.message}
          >
            <Select id="order-type" {...form.register("orderType")}>
              {ORDER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {labelOrderType(type)}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Table Number"
            htmlFor="order-table"
            error={form.formState.errors.tableNumber?.message}
          >
            <Input
              id="order-table"
              placeholder="A12"
              {...form.register("tableNumber")}
            />
          </FormField>
        </div>

        {orderType === "DELIVERY" ? (
          <FormField
            label="Delivery Address"
            htmlFor="order-address"
            error={form.formState.errors.address?.message}
          >
            <Input
              id="order-address"
              placeholder="123 Main Street"
              {...form.register("address")}
            />
          </FormField>
        ) : null}

        <FormField
          label="Notes"
          htmlFor="order-notes"
          error={form.formState.errors.notes?.message}
        >
          <Textarea
            id="order-notes"
            rows={2}
            placeholder="Any extra details for kitchen/staff"
            {...form.register("notes")}
          />
        </FormField>

        <div className="rounded-2xl border border-slate-200/70 p-3 dark:border-slate-700">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Order Items
            </p>
            <Button
              type="button"
              variant="secondary"
              className="h-8 px-3"
              onClick={() =>
                append({
                  product: products[0]?._id ?? "",
                  quantity: 1,
                  notes: "",
                })
              }
            >
              <PlusIcon className="mr-1 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-3 rounded-xl border border-slate-200/70 p-3 dark:border-slate-700 sm:grid-cols-12"
              >
                <div className="sm:col-span-6">
                  <FormField
                    label="Product"
                    htmlFor={`order-item-product-${field.id}`}
                    error={
                      form.formState.errors.items?.[index]?.product?.message
                    }
                  >
                    <Select
                      id={`order-item-product-${field.id}`}
                      {...form.register(`items.${index}.product`)}
                    >
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name} ({formatMoney(product.price)})
                        </option>
                      ))}
                    </Select>
                  </FormField>
                </div>

                <div className="sm:col-span-2">
                  <FormField
                    label="Qty"
                    htmlFor={`order-item-qty-${field.id}`}
                    error={
                      form.formState.errors.items?.[index]?.quantity?.message
                    }
                  >
                    <Input
                      id={`order-item-qty-${field.id}`}
                      type="number"
                      min={1}
                      {...form.register(`items.${index}.quantity`)}
                    />
                  </FormField>
                </div>

                <div className="sm:col-span-3">
                  <FormField
                    label="Item Notes"
                    htmlFor={`order-item-notes-${field.id}`}
                    error={form.formState.errors.items?.[index]?.notes?.message}
                  >
                    <Input
                      id={`order-item-notes-${field.id}`}
                      placeholder="No sugar"
                      {...form.register(`items.${index}.notes`)}
                    />
                  </FormField>
                </div>

                <div className="sm:col-span-1 sm:pt-7">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-rose-600"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {form.formState.errors.items?.message ? (
            <p className="mt-2 text-xs text-rose-500">
              {form.formState.errors.items.message}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-100/70 px-4 py-3 dark:bg-slate-800/70">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Live Total
          </p>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {formatMoney(totalAmount)}
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || products.length === 0}
          >
            {createMutation.isPending ? "Creating..." : "Create Order"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

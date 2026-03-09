"use client";

import { Switch } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProduct, useUpdateProduct } from "@/lib/hooks/use-products";
import { useUiStore } from "@/lib/stores/ui-store";
import { productFormSchema, type ProductFormValues } from "@/lib/validation";
import type { Category, Product } from "@/lib/types";

type ProductFormModalProps = {
  product?: Product;
  categories: Category[];
};

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  image: "",
  category: "",
  preparationTime: 0,
  isAvailable: true,
};

export function ProductFormModal({
  product,
  categories,
}: ProductFormModalProps) {
  const dialog = useUiStore((state) => state.productDialog);
  const closeDialog = useUiStore((state) => state.closeProductDialog);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!dialog.open) return;

    if (dialog.mode === "edit" && product) {
      const categoryId =
        typeof product.category === "string"
          ? product.category
          : (product.category?._id ?? "");

      form.reset({
        name: product.name,
        description: product.description ?? "",
        price: product.price,
        image: product.image ?? "",
        category: categoryId,
        preparationTime: product.preparationTime ?? 0,
        isAvailable: product.isAvailable ?? true,
      });
    } else {
      form.reset({
        ...defaultValues,
        category: categories[0]?._id ?? "",
      });
    }
  }, [dialog.open, dialog.mode, product, categories, form]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = {
      ...values,
      description: values.description?.trim() || undefined,
      image: values.image?.trim() || undefined,
    };

    if (dialog.mode === "create") {
      await createMutation.mutateAsync(payload);
      closeDialog();
      return;
    }

    if (!dialog.entityId) return;
    await updateMutation.mutateAsync({ id: dialog.entityId, payload });
    closeDialog();
  });

  return (
    <Modal
      open={dialog.open}
      onClose={closeDialog}
      title={dialog.mode === "create" ? "Create Product" : "Edit Product"}
      description="Set pricing, availability, and preparation settings for each product."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Name"
            htmlFor="product-name"
            error={form.formState.errors.name?.message}
          >
            <Input
              id="product-name"
              placeholder="Cappuccino"
              {...form.register("name")}
            />
          </FormField>

          <FormField
            label="Price"
            htmlFor="product-price"
            error={form.formState.errors.price?.message}
          >
            <Input
              id="product-price"
              type="number"
              min={0}
              step="0.01"
              {...form.register("price")}
            />
          </FormField>
        </div>

        <FormField
          label="Description"
          htmlFor="product-description"
          error={form.formState.errors.description?.message}
        >
          <Textarea
            id="product-description"
            rows={3}
            placeholder="Rich espresso with steamed milk and silky foam"
            {...form.register("description")}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Image URL"
            htmlFor="product-image"
            error={form.formState.errors.image?.message}
          >
            <Input
              id="product-image"
              placeholder="https://example.com/cappuccino.jpg"
              {...form.register("image")}
            />
          </FormField>

          <FormField
            label="Category"
            htmlFor="product-category"
            error={form.formState.errors.category?.message}
          >
            <Select id="product-category" {...form.register("category")}>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Preparation Time (minutes)"
            htmlFor="product-prep-time"
            error={form.formState.errors.preparationTime?.message}
          >
            <Input
              id="product-prep-time"
              type="number"
              min={0}
              {...form.register("preparationTime")}
            />
          </FormField>

          <Controller
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Availability
                </p>
                <div className="flex items-center justify-between rounded-xl border border-slate-200/70 p-3 dark:border-slate-700">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {field.value
                      ? "Available for ordering"
                      : "Hidden from ordering"}
                  </p>
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    className="group relative inline-flex h-7 w-12 items-center rounded-full bg-slate-300 transition data-[checked]:bg-brand-500"
                  >
                    <span
                      className="inline-block h-5 w-5 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6"
                      aria-hidden="true"
                    />
                  </Switch>
                </div>
              </div>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={closeDialog}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || categories.length === 0}
          >
            {isSubmitting
              ? "Saving..."
              : dialog.mode === "create"
                ? "Create Product"
                : "Update Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

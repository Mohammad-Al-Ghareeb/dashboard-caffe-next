"use client";

import { Switch } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/forms/form-field";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/lib/hooks/use-categories";
import { useUiStore } from "@/lib/stores/ui-store";
import { categoryFormSchema, type CategoryFormValues } from "@/lib/validation";
import type { Category } from "@/lib/types";

type CategoryFormModalProps = {
  category?: Category;
};

const defaultValues: CategoryFormValues = {
  name: "",
  description: "",
  image: "",
  sortOrder: 0,
  isActive: true,
};

export function CategoryFormModal({ category }: CategoryFormModalProps) {
  const dialog = useUiStore((state) => state.categoryDialog);
  const closeDialog = useUiStore((state) => state.closeCategoryDialog);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!dialog.open) return;

    if (dialog.mode === "edit" && category) {
      form.reset({
        name: category.name,
        description: category.description ?? "",
        image: category.image ?? "",
        sortOrder: category.sortOrder ?? 0,
        isActive: category.isActive ?? true,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [dialog.open, dialog.mode, category, form]);

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
      title={dialog.mode === "create" ? "Create Category" : "Edit Category"}
      description="Organize your menu sections with smart ordering and visibility control."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <FormField
          label="Name"
          htmlFor="category-name"
          error={form.formState.errors.name?.message}
        >
          <Input
            id="category-name"
            placeholder="Coffee"
            {...form.register("name")}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="category-description"
          error={form.formState.errors.description?.message}
        >
          <Textarea
            id="category-description"
            rows={3}
            placeholder="Hot and cold coffee drinks"
            {...form.register("description")}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Image URL"
            htmlFor="category-image"
            error={form.formState.errors.image?.message}
          >
            <Input
              id="category-image"
              placeholder="https://example.com/coffee.jpg"
              {...form.register("image")}
            />
          </FormField>

          <FormField
            label="Sort Order"
            htmlFor="category-sort-order"
            error={form.formState.errors.sortOrder?.message}
          >
            <Input
              id="category-sort-order"
              type="number"
              min={0}
              {...form.register("sortOrder")}
            />
          </FormField>
        </div>

        <Controller
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <div className="flex items-center justify-between rounded-xl border border-slate-200/70 p-3 dark:border-slate-700">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  Active category
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Inactive categories can be hidden from product assignment.
                </p>
              </div>
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
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={closeDialog}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : dialog.mode === "create"
                ? "Create Category"
                : "Update Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

"use client";

import {
  EllipsisHorizontalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useMemo, useState } from "react";
import { CategoryFormModal } from "@/components/categories/category-form-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { Select } from "@/components/ui/select";
import { useCategories, useDeleteCategory } from "@/lib/hooks/use-categories";
import { useUiStore } from "@/lib/stores/ui-store";
import { formatDateTime } from "@/lib/format";

export function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "sortOrder" | "updatedAt">(
    "sortOrder",
  );
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const filters = useMemo(
    () => ({
      isActive:
        activeFilter === "all"
          ? undefined
          : activeFilter === "active"
            ? true
            : false,
    }),
    [activeFilter],
  );

  const categoriesQuery = useCategories(filters);
  const deleteMutation = useDeleteCategory();
  const categoryDialog = useUiStore((state) => state.categoryDialog);
  const openCategoryDialog = useUiStore((state) => state.openCategoryDialog);

  const filteredCategories = useMemo(() => {
    const list = categoriesQuery.data?.categories ?? [];

    const searched = list.filter((category) => {
      const q = search.toLowerCase().trim();
      if (!q) return true;
      return (
        category.name.toLowerCase().includes(q) ||
        category.description?.toLowerCase().includes(q)
      );
    });

    return searched.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "updatedAt") {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }

      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    });
  }, [categoriesQuery.data?.categories, search, sortBy]);

  const selectedCategory = useMemo(() => {
    if (!categoryDialog.entityId) return undefined;
    return (categoriesQuery.data?.categories ?? []).find(
      (category) => category._id === categoryDialog.entityId,
    );
  }, [categoryDialog.entityId, categoriesQuery.data?.categories]);

  if (categoriesQuery.isLoading) {
    return <LoadingState label="Fetching categories..." />;
  }

  if (categoriesQuery.error) {
    return (
      <ErrorState
        message={categoriesQuery.error.message}
        onRetry={() => categoriesQuery.refetch()}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Category Management
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Build clear menu sections and control visibility for staff and
              customers.
            </p>
          </div>
          <Button onClick={() => openCategoryDialog("create")}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search by category name or description"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={activeFilter}
              onChange={(event) =>
                setActiveFilter(
                  event.target.value as "all" | "active" | "inactive",
                )
              }
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
            <Select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value as "name" | "sortOrder" | "updatedAt",
                )
              }
            >
              <option value="sortOrder">Sort Order</option>
              <option value="name">Name</option>
              <option value="updatedAt">Updated At</option>
            </Select>
          </div>
        </div>
      </Card>

      {filteredCategories.length === 0 ? (
        <EmptyState
          title="No categories found"
          description="Try adjusting filters or add your first category."
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/70 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Sort</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">
                    <FunnelIcon className="ml-auto h-4 w-4" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="border-b border-slate-100/80 transition hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-900/50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {category.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {category.description || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {category.sortOrder ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          category.isActive
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                            : "bg-slate-500/15 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {formatDateTime(category.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <MenuButton className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                          <EllipsisHorizontalIcon className="h-5 w-5" />
                        </MenuButton>
                        <MenuItems
                          anchor="bottom end"
                          className="z-10 mt-2 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-900"
                        >
                          <MenuItem>
                            <button
                              type="button"
                              onClick={() =>
                                openCategoryDialog("edit", category._id)
                              }
                              className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                              Edit
                            </button>
                          </MenuItem>
                          <MenuItem>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteTarget({
                                  id: category._id,
                                  name: category.name,
                                })
                              }
                              className="w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                            >
                              Delete
                            </button>
                          </MenuItem>
                        </MenuItems>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <CategoryFormModal category={selectedCategory} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete category"
        description={`Are you sure you want to delete "${deleteTarget?.name ?? ""}"?`}
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

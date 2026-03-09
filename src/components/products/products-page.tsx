"use client";

import {
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useDeferredValue, useMemo, useState } from "react";
import { ProductFormModal } from "@/components/products/product-form-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { Select } from "@/components/ui/select";
import { useCategories } from "@/lib/hooks/use-categories";
import { useDeleteProduct, useProducts } from "@/lib/hooks/use-products";
import { formatDateTime, formatMoney } from "@/lib/format";
import { useUiStore } from "@/lib/stores/ui-store";

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "all" | "available" | "hidden"
  >("all");
  const [sortBy, setSortBy] = useState<"newest" | "name" | "price">("newest");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const categoriesQuery = useCategories();
  const productsQuery = useProducts({
    category: categoryFilter || undefined,
    isAvailable:
      availabilityFilter === "all"
        ? undefined
        : availabilityFilter === "available"
          ? true
          : false,
    search: deferredSearch.trim() || undefined,
  });

  const deleteMutation = useDeleteProduct();
  const productDialog = useUiStore((state) => state.productDialog);
  const openProductDialog = useUiStore((state) => state.openProductDialog);

  const displayedProducts = useMemo(() => {
    const list = productsQuery.data?.products ?? [];

    return [...list].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "price") {
        return a.price - b.price;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [productsQuery.data?.products, sortBy]);

  const selectedProduct = useMemo(() => {
    if (!productDialog.entityId) return undefined;
    return (productsQuery.data?.products ?? []).find(
      (product) => product._id === productDialog.entityId,
    );
  }, [productDialog.entityId, productsQuery.data?.products]);

  if (categoriesQuery.isLoading || productsQuery.isLoading) {
    return <LoadingState label="Loading products..." />;
  }

  if (categoriesQuery.error || productsQuery.error) {
    return (
      <ErrorState
        message={
          categoriesQuery.error?.message ||
          productsQuery.error?.message ||
          "Failed to load products"
        }
      />
    );
  }

  const categories = categoriesQuery.data?.categories ?? [];

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Product Management
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Price, categorize, and control product availability in one place.
            </p>
          </div>
          <Button
            onClick={() => openProductDialog("create")}
            disabled={categories.length === 0}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <Select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Select
              value={availabilityFilter}
              onChange={(event) =>
                setAvailabilityFilter(
                  event.target.value as "all" | "available" | "hidden",
                )
              }
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="hidden">Hidden</option>
            </Select>
            <Select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as "newest" | "name" | "price")
              }
            >
              <option value="newest">Newest</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </Select>
          </div>
        </div>
      </Card>

      {displayedProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try changing filters or create a new product."
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/70 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Prep</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-slate-100/80 transition hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-900/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {product.name}
                      </p>
                      <p className="line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                        {product.description || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {typeof product.category === "string"
                        ? product.category
                        : product.category?.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {formatMoney(product.price)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {product.preparationTime ?? 0} min
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          product.isAvailable
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                            : "bg-slate-500/15 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {product.isAvailable ? "Available" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {formatDateTime(product.updatedAt)}
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
                                openProductDialog("edit", product._id)
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
                                  id: product._id,
                                  name: product.name,
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

      <ProductFormModal categories={categories} product={selectedProduct} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete product"
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

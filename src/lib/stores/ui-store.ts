import { create } from "zustand";

type EditDialogState = {
  open: boolean;
  mode: "create" | "edit";
  entityId?: string;
};

type UiStore = {
  mobileNavOpen: boolean;
  categoryDialog: EditDialogState;
  productDialog: EditDialogState;
  orderCreateOpen: boolean;
  orderDetailsId: string | null;
  setMobileNavOpen: (value: boolean) => void;
  openCategoryDialog: (mode: "create" | "edit", entityId?: string) => void;
  closeCategoryDialog: () => void;
  openProductDialog: (mode: "create" | "edit", entityId?: string) => void;
  closeProductDialog: () => void;
  setOrderCreateOpen: (open: boolean) => void;
  setOrderDetailsId: (id: string | null) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  mobileNavOpen: false,
  categoryDialog: { open: false, mode: "create" },
  productDialog: { open: false, mode: "create" },
  orderCreateOpen: false,
  orderDetailsId: null,

  setMobileNavOpen: (value) => set({ mobileNavOpen: value }),

  openCategoryDialog: (mode, entityId) =>
    set({ categoryDialog: { open: true, mode, entityId } }),
  closeCategoryDialog: () =>
    set({ categoryDialog: { open: false, mode: "create" } }),

  openProductDialog: (mode, entityId) =>
    set({ productDialog: { open: true, mode, entityId } }),
  closeProductDialog: () =>
    set({ productDialog: { open: false, mode: "create" } }),

  setOrderCreateOpen: (open) => set({ orderCreateOpen: open }),
  setOrderDetailsId: (id) => set({ orderDetailsId: id }),
}));

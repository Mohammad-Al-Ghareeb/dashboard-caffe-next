export const queryKeys = {
  categories: (filters?: { isActive?: boolean }) =>
    ["categories", filters] as const,
  category: (id: string) => ["category", id] as const,
  products: (filters?: {
    category?: string;
    isAvailable?: boolean;
    search?: string;
  }) => ["products", filters] as const,
  product: (id: string) => ["product", id] as const,
  orders: (filters?: {
    page?: number;
    perPage?: number;
    status?: string;
    customerPhone?: string;
    from?: string;
    to?: string;
  }) => ["orders", filters] as const,
  order: (id: string) => ["order", id] as const,
};

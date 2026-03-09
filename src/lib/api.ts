import type {
  CategoriesResponse,
  Category,
  CategoryInput,
  MutationMessageResponse,
  Order,
  OrderCreateInput,
  OrdersResponse,
  OrderStatus,
  Product,
  ProductInput,
  ProductsResponse,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const raw = await response.text();
  const payload = raw ? (JSON.parse(raw) as unknown) : null;

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `Request failed (${response.status})`;

    throw new ApiError(message, response.status);
  }

  return payload as T;
}

export const api = {
  getCategories: (params?: { isActive?: boolean }) => {
    const query = new URLSearchParams();
    if (typeof params?.isActive === "boolean") {
      query.set("isActive", String(params.isActive));
    }

    const suffix = query.size ? `?${query.toString()}` : "";
    return request<CategoriesResponse>(`/api/categories${suffix}`);
  },

  getCategoryById: (id: string) => request<Category>(`/api/categories/${id}`),

  createCategory: (payload: CategoryInput) =>
    request<MutationMessageResponse<{ category: Category }>>(
      `/api/categories`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    ),

  updateCategory: (id: string, payload: Partial<CategoryInput>) =>
    request<MutationMessageResponse<{ category: Category }>>(
      `/api/categories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    ),

  deleteCategory: (id: string) =>
    request<MutationMessageResponse>(`/api/categories/${id}`, {
      method: "DELETE",
    }),

  getProducts: (params?: {
    category?: string;
    isAvailable?: boolean;
    search?: string;
  }) => {
    const query = new URLSearchParams();

    if (params?.category) query.set("category", params.category);
    if (typeof params?.isAvailable === "boolean") {
      query.set("isAvailable", String(params.isAvailable));
    }
    if (params?.search) query.set("search", params.search);

    const suffix = query.size ? `?${query.toString()}` : "";
    return request<ProductsResponse>(`/api/products${suffix}`);
  },

  getProductById: (id: string) => request<Product>(`/api/products/${id}`),

  createProduct: (payload: ProductInput) =>
    request<MutationMessageResponse<{ product: Product }>>(`/api/products`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateProduct: (id: string, payload: Partial<ProductInput>) =>
    request<MutationMessageResponse<{ product: Product }>>(
      `/api/products/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    ),

  deleteProduct: (id: string) =>
    request<MutationMessageResponse>(`/api/products/${id}`, {
      method: "DELETE",
    }),

  getOrders: (params?: {
    page?: number;
    perPage?: number;
    status?: OrderStatus;
    customerPhone?: string;
    from?: string;
    to?: string;
  }) => {
    const query = new URLSearchParams();

    if (params?.page) query.set("page", String(params.page));
    if (params?.perPage) query.set("perPage", String(params.perPage));
    if (params?.status) query.set("status", params.status);
    if (params?.customerPhone) query.set("customerPhone", params.customerPhone);
    if (params?.from) query.set("from", params.from);
    if (params?.to) query.set("to", params.to);

    const suffix = query.size ? `?${query.toString()}` : "";
    return request<OrdersResponse>(`/api/orders${suffix}`);
  },

  getOrderById: (id: string) => request<Order>(`/api/orders/${id}`),

  createOrder: (payload: OrderCreateInput) =>
    request<MutationMessageResponse<{ order: Order }>>(`/api/orders`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateOrderStatus: (id: string, status: OrderStatus) =>
    request<MutationMessageResponse<{ order: Order }>>(
      `/api/orders/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    ),

  deleteOrder: (id: string) =>
    request<MutationMessageResponse<{ deletedOrder?: Order }>>(
      `/api/orders/${id}`,
      {
        method: "DELETE",
      },
    ),
};

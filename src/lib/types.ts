import type { components } from "@/lib/openapi.generated";

export type ApiErrorShape = components["schemas"]["Error"];
export type Category = Required<components["schemas"]["Category"]>;
export type CategoryInput = components["schemas"]["CategoryInput"];
export type Product = Omit<
  Required<components["schemas"]["Product"]>,
  "category"
> & {
  category: string | Pick<Category, "_id" | "name">;
};
export type ProductInput = components["schemas"]["ProductInput"];
export type Order = Omit<Required<components["schemas"]["Order"]>, "items"> & {
  items: Array<{
    product: string | Product;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
  }>;
};
export type OrderItemInput = components["schemas"]["OrderItemInput"];
export type OrderCreateInput = components["schemas"]["OrderCreateInput"];
export type OrderStatus = NonNullable<components["schemas"]["Order"]["status"]>;
export type OrderType = NonNullable<
  components["schemas"]["Order"]["orderType"]
>;

export type CategoriesResponse = {
  categories: Category[];
  count: number;
};

export type ProductsResponse = {
  products: Product[];
  count: number;
};

export type OrdersResponse = {
  orders: Order[];
  count: number;
  page: number;
  perPage: number;
};

export type MutationMessageResponse<T = unknown> = {
  message: string;
} & T;

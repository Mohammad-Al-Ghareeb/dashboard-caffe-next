/* eslint-disable */
// This file mirrors the OpenAPI components in ../openapi.yaml.

export interface components {
  schemas: {
    Error: {
      message?: string;
    };
    Category: {
      _id?: string;
      name?: string;
      description?: string;
      image?: string;
      sortOrder?: number;
      isActive?: boolean;
      createdAt?: string;
      updatedAt?: string;
    };
    CategoryInput: {
      name: string;
      description?: string;
      image?: string;
      sortOrder?: number;
      isActive?: boolean;
    };
    Product: {
      _id?: string;
      name?: string;
      description?: string;
      price?: number;
      image?: string;
      category?: string | components["schemas"]["Category"];
      preparationTime?: number;
      isAvailable?: boolean;
      createdAt?: string;
      updatedAt?: string;
    };
    ProductInput: {
      name: string;
      description?: string;
      price: number;
      image?: string;
      category: string;
      preparationTime?: number;
      isAvailable?: boolean;
    };
    OrderItemInput: {
      product: string;
      quantity: number;
      notes?: string;
    };
    OrderItem: {
      product?: string | components["schemas"]["Product"];
      name?: string;
      price?: number;
      quantity?: number;
      notes?: string;
    };
    Order: {
      _id?: string;
      customerName?: string;
      customerPhone?: string;
      tableNumber?: string;
      orderType?: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
      address?: string;
      notes?: string;
      items?: components["schemas"]["OrderItem"][];
      totalAmount?: number;
      status?: "NEW" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
      createdAt?: string;
      updatedAt?: string;
    };
    OrderCreateInput: {
      customerName: string;
      customerPhone: string;
      tableNumber?: string;
      orderType?: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
      address?: string;
      notes?: string;
      items: components["schemas"]["OrderItemInput"][];
    };
    OrderStatusInput: {
      status: "NEW" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
    };
  };
}

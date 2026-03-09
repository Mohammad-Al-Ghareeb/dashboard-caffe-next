import { z } from "zod";
import { ORDER_STATUSES, ORDER_TYPES } from "@/lib/constants";

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(300).optional().or(z.literal("")),
  image: z
    .string()
    .url("Image must be a valid URL")
    .optional()
    .or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0, "Sort order cannot be negative"),
  isActive: z.boolean(),
});

export const productFormSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().max(500).optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  image: z
    .string()
    .url("Image must be a valid URL")
    .optional()
    .or(z.literal("")),
  category: z.string().regex(/^[a-f0-9]{24}$/i, "Category ID is invalid"),
  preparationTime: z.coerce.number().int().min(0),
  isAvailable: z.boolean(),
});

const orderItemSchema = z.object({
  product: z.string().regex(/^[a-f0-9]{24}$/i, "Product ID is invalid"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  notes: z.string().max(200).optional().or(z.literal("")),
});

export const orderFormSchema = z
  .object({
    customerName: z.string().trim().min(2).max(100),
    customerPhone: z.string().trim().min(6).max(30),
    tableNumber: z.string().max(20).optional().or(z.literal("")),
    orderType: z.enum(ORDER_TYPES),
    address: z.string().max(300).optional().or(z.literal("")),
    notes: z.string().max(500).optional().or(z.literal("")),
    items: z.array(orderItemSchema).min(1, "Add at least one item"),
  })
  .refine((data) => !(data.orderType === "DELIVERY" && !data.address?.trim()), {
    message: "Address is required for delivery orders",
    path: ["address"],
  });

export const orderStatusFormSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;
export type OrderFormValues = z.infer<typeof orderFormSchema>;
export type OrderStatusFormValues = z.infer<typeof orderStatusFormSchema>;

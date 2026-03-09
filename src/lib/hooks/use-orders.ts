"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { OrderCreateInput, OrderStatus } from "@/lib/types";

type OrderFilters = {
  page?: number;
  perPage?: number;
  status?: OrderStatus;
  customerPhone?: string;
  from?: string;
  to?: string;
};

export function useOrders(filters: OrderFilters) {
  return useQuery({
    queryKey: queryKeys.orders(filters),
    queryFn: () => api.getOrders(filters),
    placeholderData: (prev) => prev,
  });
}

export function useOrder(id?: string | null) {
  return useQuery({
    queryKey: id ? queryKeys.order(id) : ["order", "empty"],
    queryFn: () => api.getOrderById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OrderCreateInput) => api.createOrder(payload),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      api.updateOrderStatus(id, status),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteOrder(id),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

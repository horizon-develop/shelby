"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Service } from "@/types";

export const useServices = () => {
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["adminServices"],
    queryFn: async () => {
      const res = await fetch("/api/services?all=true");
      return res.json() as Promise<Service[]>;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      price: number;
      duration: number;
    }) => {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create service");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminServices"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      description?: string;
      price?: number;
      duration?: number;
      isActive?: boolean;
    }) => {
      const res = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update service");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminServices"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete service");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminServices"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  return {
    services,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

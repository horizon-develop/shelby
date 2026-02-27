"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Stylist } from "@/types";

export const useStylists = () => {
  const queryClient = useQueryClient();

  const { data: stylists = [], isLoading } = useQuery({
    queryKey: ["adminStylists"],
    queryFn: async () => {
      const res = await fetch("/api/stylists?all=true");
      return res.json() as Promise<Stylist[]>;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      phone?: string;
      email?: string;
      imageUrl?: string;
    }) => {
      const res = await fetch("/api/stylists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create stylist");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStylists"] });
      queryClient.invalidateQueries({ queryKey: ["stylists"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      phone?: string;
      email?: string;
      imageUrl?: string;
      isActive?: boolean;
    }) => {
      const res = await fetch(`/api/stylists/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update stylist");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStylists"] });
      queryClient.invalidateQueries({ queryKey: ["stylists"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/stylists/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete stylist");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStylists"] });
      queryClient.invalidateQueries({ queryKey: ["stylists"] });
    },
  });

  const syncServicesMutation = useMutation({
    mutationFn: async ({ id, serviceIds }: { id: string; serviceIds: string[] }) => {
      const res = await fetch(`/api/stylists/${id}/services`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceIds }),
      });
      if (!res.ok) throw new Error("Failed to sync services");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStylists"] });
      queryClient.invalidateQueries({ queryKey: ["stylists"] });
    },
  });

  return {
    stylists,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    syncServicesMutation,
  };
};

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface StylistScheduleEntry {
  id: string;
  stylistId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  stylist?: { name: string };
}

export const useStylistSchedule = (stylistId: string | null) => {
  const queryClient = useQueryClient();

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ["stylistSchedule", stylistId],
    queryFn: async () => {
      const url = stylistId
        ? `/api/stylist-schedule?stylistId=${stylistId}`
        : "/api/stylist-schedule";
      const res = await fetch(url);
      return res.json() as Promise<StylistScheduleEntry[]>;
    },
    enabled: !!stylistId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: {
      stylistId: string;
      dayOfWeek: string;
      startTime: string;
      endTime: string;
    }) => {
      const res = await fetch("/api/stylist-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create schedule");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stylistSchedule"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      stylistId: string;
      dayOfWeek: string;
      startTime: string;
      endTime: string;
    }) => {
      const res = await fetch(`/api/stylist-schedule/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update schedule");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stylistSchedule"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/stylist-schedule/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete schedule");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stylistSchedule"] });
    },
  });

  return {
    schedules,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

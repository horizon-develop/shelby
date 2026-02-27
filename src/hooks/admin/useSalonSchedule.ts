"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface SalonScheduleEntry {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export const useSalonSchedule = () => {
  const queryClient = useQueryClient();

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ["salonSchedule"],
    queryFn: async () => {
      const res = await fetch("/api/salon-schedule");
      return res.json() as Promise<SalonScheduleEntry[]>;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: {
      dayOfWeek: string;
      startTime: string;
      endTime: string;
    }) => {
      const res = await fetch("/api/salon-schedule", {
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
      queryClient.invalidateQueries({ queryKey: ["salonSchedule"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      dayOfWeek?: string;
      startTime?: string;
      endTime?: string;
      isActive?: boolean;
    }) => {
      const res = await fetch(`/api/salon-schedule/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["salonSchedule"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/salon-schedule/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete schedule");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salonSchedule"] });
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

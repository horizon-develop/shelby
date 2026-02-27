"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Booking, BookingStatus } from "@/types";
import { STATUS_BADGES, STATUS_TEXTS } from "@/constants/admin";

export const useAppointments = () => {
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await fetch("/api/appointments");
      const data: Booking[] = await res.json();
      return data.sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.startTime}`);
        const dateTimeB = new Date(`${b.date}T${b.startTime}`);
        return dateTimeA.getTime() - dateTimeB.getTime();
      });
    },
  });

  const upcomingAppointments = appointments?.filter((booking) => {
    const bookingDateTime = new Date(`${booking.date}T${booking.startTime}`);
    return bookingDateTime >= new Date();
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const deleteAppointment = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete booking");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const getStatusBadge = (status: BookingStatus) => {
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGES[status]}`;
  };

  const getStatusText = (status: BookingStatus) => {
    return STATUS_TEXTS[status];
  };

  return {
    appointments: upcomingAppointments,
    isLoading,
    updateStatus,
    deleteAppointment,
    getStatusBadge,
    getStatusText,
  };
};

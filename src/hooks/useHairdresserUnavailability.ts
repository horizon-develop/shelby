"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UnavailabilityFormData } from "@/types/admin";
import { INITIAL_UNAVAILABILITY_STATE } from "@/constants/admin";

export const useHairdresserUnavailability = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] =
    useState<UnavailabilityFormData>(INITIAL_UNAVAILABILITY_STATE);

  const mutation = useMutation({
    mutationFn: async (data: {
      stylistId: string;
      date: string;
      startTime?: string | null;
      endTime?: string | null;
      reason?: string;
    }) => {
      const res = await fetch("/api/availability/unavailable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to set unavailability");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unavailableDates"] });
      setFormData(INITIAL_UNAVAILABILITY_STATE);
      alert("Disponibilidad actualizada correctamente");
    },
    onError: (error) => {
      console.error("Error updating availability:", error);
      alert("Error al actualizar la disponibilidad");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.stylistId || !formData.date) {
      alert("Por favor seleccione un peluquero y una fecha");
      return;
    }

    if (!formData.fullDay && (!formData.startTime || !formData.endTime)) {
      alert("Por favor seleccione el horario de indisponibilidad");
      return;
    }

    if (!formData.fullDay && formData.startTime >= formData.endTime) {
      alert("La hora de inicio debe ser anterior a la hora de fin");
      return;
    }

    mutation.mutate({
      stylistId: formData.stylistId,
      date: format(formData.date, "yyyy-MM-dd"),
      startTime: !formData.fullDay ? formData.startTime : null,
      endTime: !formData.fullDay ? formData.endTime : null,
      reason: formData.reason.trim() || undefined,
    });
  };

  return {
    formData,
    setFormData,
    mutation,
    handleSubmit,
  };
};

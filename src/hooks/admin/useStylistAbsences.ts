"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { UnavailabilityFormData, StylistAbsenceResponse } from "@/types/admin";
import { INITIAL_UNAVAILABILITY_STATE } from "@/constants/admin";

interface AbsenceWithStylist extends StylistAbsenceResponse {
  stylist?: { name: string };
}

export const useStylistAbsences = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<UnavailabilityFormData>(INITIAL_UNAVAILABILITY_STATE);

  const { data: absences = [], isLoading } = useQuery({
    queryKey: ["allAbsences"],
    queryFn: async () => {
      const res = await fetch("/api/availability/unavailable");
      return res.json() as Promise<AbsenceWithStylist[]>;
    },
  });

  const createMutation = useMutation({
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
      if (!res.ok) throw new Error("Failed to create absence");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAbsences"] });
      queryClient.invalidateQueries({ queryKey: ["unavailableDates"] });
      setFormData(INITIAL_UNAVAILABILITY_STATE);
      alert("Ausencia creada correctamente");
    },
    onError: () => {
      alert("Error al crear la ausencia");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/availability/unavailable/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete absence");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAbsences"] });
      queryClient.invalidateQueries({ queryKey: ["unavailableDates"] });
    },
    onError: () => {
      alert("Error al eliminar la ausencia");
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
    createMutation.mutate({
      stylistId: formData.stylistId,
      date: format(formData.date, "yyyy-MM-dd"),
      startTime: !formData.fullDay ? formData.startTime : null,
      endTime: !formData.fullDay ? formData.endTime : null,
      reason: formData.reason.trim() || undefined,
    });
  };

  return {
    absences,
    isLoading,
    formData,
    setFormData,
    createMutation,
    deleteMutation,
    handleSubmit,
  };
};

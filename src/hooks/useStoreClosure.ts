"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StoreClosureFormData } from "@/types/admin";
import { INITIAL_STORE_CLOSURE_STATE } from "@/constants/admin";

export const useStoreClosure = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<StoreClosureFormData>(
    INITIAL_STORE_CLOSURE_STATE
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: {
      date: string;
      startTime?: string | null;
      endTime?: string | null;
      reason?: string;
    }) => {
      const res = await fetch("/api/availability/store-closure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to set store closure");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storeClosures"] });
      setFormData(INITIAL_STORE_CLOSURE_STATE);
      setIsModalOpen(false);
      alert("Local cerrado correctamente para la fecha seleccionada");
    },
    onError: (error) => {
      console.error("Error setting store closure:", error);
      alert("Error al cerrar el local para la fecha seleccionada");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date) {
      alert("Por favor seleccione una fecha");
      return;
    }

    if (!formData.fullDay && (!formData.startTime || !formData.endTime)) {
      alert("Por favor seleccione el horario de cierre");
      return;
    }

    if (!formData.fullDay && formData.startTime >= formData.endTime) {
      alert("La hora de inicio debe ser anterior a la hora de fin");
      return;
    }

    mutation.mutate({
      date: format(formData.date, "yyyy-MM-dd"),
      startTime: !formData.fullDay ? formData.startTime : null,
      endTime: !formData.fullDay ? formData.endTime : null,
      reason: formData.reason.trim() || undefined,
    });
  };

  return {
    formData,
    setFormData,
    isModalOpen,
    setIsModalOpen,
    mutation,
    handleSubmit,
  };
};

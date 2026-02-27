"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { StoreClosureFormData, SalonClosureResponse } from "@/types/admin";
import { INITIAL_STORE_CLOSURE_STATE } from "@/constants/admin";

export const useStoreClosures = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<StoreClosureFormData>(INITIAL_STORE_CLOSURE_STATE);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: closures = [], isLoading } = useQuery({
    queryKey: ["storeClosures"],
    queryFn: async () => {
      const res = await fetch("/api/availability/store-closures");
      return res.json() as Promise<SalonClosureResponse[]>;
    },
  });

  const createMutation = useMutation({
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
      if (!res.ok) throw new Error("Failed to create closure");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storeClosures"] });
      setFormData(INITIAL_STORE_CLOSURE_STATE);
      setIsModalOpen(false);
      alert("Cierre creado correctamente");
    },
    onError: () => {
      alert("Error al crear el cierre");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/availability/store-closures/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete closure");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storeClosures"] });
    },
    onError: () => {
      alert("Error al eliminar el cierre");
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
    createMutation.mutate({
      date: format(formData.date, "yyyy-MM-dd"),
      startTime: !formData.fullDay ? formData.startTime : null,
      endTime: !formData.fullDay ? formData.endTime : null,
      reason: formData.reason.trim() || undefined,
    });
  };

  return {
    closures,
    isLoading,
    formData,
    setFormData,
    isModalOpen,
    setIsModalOpen,
    createMutation,
    deleteMutation,
    handleSubmit,
  };
};

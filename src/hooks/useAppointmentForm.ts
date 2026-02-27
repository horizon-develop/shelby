"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { BookingDTO } from "@/types";

const initialFormState = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  serviceId: "",
  stylistId: "",
  date: undefined as Date | undefined,
  startTime: "",
};

export const useAppointmentForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastBookingData, setLastBookingData] = useState<BookingDTO | null>(null);
  const [originalDate, setOriginalDate] = useState<Date | undefined>(undefined);

  const mutation = useMutation({
    mutationFn: async (data: BookingDTO) => {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw { response: { data: error, status: res.status } };
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      setLastBookingData(variables);
      setShowConfirmation(true);
      setFormData(initialFormState);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: { response?: { data?: { message?: string }; status?: number } } & Record<string, any>) => {
      const errorMessage = error.response?.data?.message || "";

      if (errorMessage.includes("local está cerrado")) {
        alert("No se puede reservar un turno en esta fecha porque el local está cerrado. Por favor, seleccione otra fecha.");
      } else if (errorMessage.includes("peluquero no está disponible")) {
        alert("El peluquero seleccionado no está disponible en esta fecha y horario. Por favor, seleccione otro horario o peluquero.");
      } else if (error.response?.status === 400) {
        alert("No se puede reservar un turno en este horario. Por favor, seleccione otro horario.");
      } else {
        alert("Ocurrió un error al reservar el turno. Por favor, intente nuevamente.");
      }
    },
  });

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    validateTimeSlot: (time: string) => boolean
  ) => {
    e.preventDefault();

    if (!formData.date) {
      alert("Por favor seleccione una fecha");
      return;
    }

    if (validateTimeSlot(formData.startTime)) {
      alert("Este horario ya no está disponible. Por favor, seleccione otro horario.");
      return;
    }

    setOriginalDate(formData.date);

    const submissionData: BookingDTO = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail || undefined,
      serviceId: formData.serviceId,
      stylistId: formData.stylistId,
      date: format(formData.date, "yyyy-MM-dd"),
      startTime: formData.startTime,
    };

    mutation.mutate(submissionData);
  };

  const confirmBooking = () => {
    setShowConfirmation(false);
    setLastBookingData(null);
    setOriginalDate(undefined);
  };

  return {
    formData,
    setFormData,
    mutation,
    handleSubmit,
    showConfirmation,
    lastBookingData,
    confirmBooking,
    originalDate,
  };
};

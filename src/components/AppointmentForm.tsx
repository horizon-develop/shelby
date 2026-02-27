"use client";

import { es } from "date-fns/locale";
import { Clock, Scissors, User, DollarSign } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/src/style.css";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAvailability } from "@/hooks/useAvailability";
import { useAppointmentForm } from "@/hooks/useAppointmentForm";
import {
  generateTimeSlots,
  calendarFormatters,
  calendarDisabledDays,
  calendarHiddenDays,
} from "@/utils/timeUtils";
import { Service, Stylist } from "@/types";
import PricesModal from "./PricesModal";
import ConfirmationModal from "./ConfirmationModal";

export default function AppointmentForm() {
  const {
    formData,
    setFormData,
    mutation,
    handleSubmit,
    showConfirmation,
    lastBookingData,
    confirmBooking,
    originalDate,
  } = useAppointmentForm();
  const [isPricesModalOpen, setIsPricesModalOpen] = useState(false);

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await fetch("/api/services");
      return res.json() as Promise<Service[]>;
    },
  });

  const { data: stylists = [] } = useQuery({
    queryKey: ["stylists"],
    queryFn: async () => {
      const res = await fetch("/api/stylists");
      return res.json() as Promise<Stylist[]>;
    },
  });

  const selectedService = services.find((s) => s.id === formData.serviceId);
  const serviceDuration = selectedService?.duration || 30;

  const { isTimeSlotBooked, isDateUnavailable } = useAvailability({
    selectedDate: formData.date,
    selectedStylist: formData.stylistId,
    serviceDuration,
  });

  const handleDateSelect = (date: Date | undefined) => {
    setFormData({
      ...formData,
      date,
      startTime: "",
    });
  };

  const disabledDays = [calendarDisabledDays, isDateUnavailable];

  const availableTimeSlots = generateTimeSlots(
    serviceDuration,
    formData.date,
    formData.stylistId
  );

  // Get the service and stylist names for the confirmation modal
  const selectedStylist = stylists.find((s) => s.id === lastBookingData?.stylistId);

  return (
    <div className="p-4 sm:p-8 md:p-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 p-6 bg-[#080808] rounded-xl shadow-lg bronze-border">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#D8C3A5]">
            Reservá tu turno
          </h2>
          <h3 className="text-[#D8C3A5]/80 mt-2 font-sans">
            Programa tu próximo turno con nosotros
          </h3>
        </div>

        <form
          onSubmit={(e) => handleSubmit(e, isTimeSlotBooked)}
          className="space-y-6 font-sans"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="flex-grow w-full">
              <label className="block text-sm font-medium text-[#AE7E50]">
                Nombre
              </label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70]"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
              />
            </div>

            <div className="flex-grow w-full">
              <label className="block text-sm font-medium text-[#AE7E50]">
                Correo Electrónico
              </label>
              <input
                type="email"
                className="mt-1 w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70]"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
              />
            </div>

            <div className="flex-grow w-full">
              <label className="block text-sm font-medium text-[#AE7E50]">
                Teléfono
              </label>
              <input
                type="tel"
                required
                className="mt-1 w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70]"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
              />
            </div>

            <div className="flex-grow w-full">
              <label className="block text-sm font-medium text-[#AE7E50]">
                Servicio
              </label>
              <div className="relative w-full">
                <select
                  required
                  className="text-balance mt-1 w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70] pr-10"
                  value={formData.serviceId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      serviceId: e.target.value,
                      stylistId: "",
                    })
                  }
                >
                  <option value="">Selecciona un servicio</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                <Scissors className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#D8C3A5] pt-1 size-6" />
              </div>
            </div>

            <div className="flex-grow w-full">
              <label className="block text-sm font-medium text-[#AE7E50]">
                Peluquero
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <select
                    required
                    className="text-wrap mt-1 w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70] pr-10"
                    value={formData.stylistId}
                    onChange={(e) =>
                      setFormData({ ...formData, stylistId: e.target.value })
                    }
                  >
                    <option value="">Selecciona tu peluquero</option>
                    {stylists.map((stylist) => (
                      <option key={stylist.id} value={stylist.id}>
                        {stylist.name}
                      </option>
                    ))}
                  </select>
                  <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#D8C3A5] pointer-events-none pt-1 size-6" />
                </div>
              </div>
            </div>

            <div className="flex-grow w-full">
              <button
                type="button"
                onClick={() => setIsPricesModalOpen(true)}
                className="mt-3 px-3 py-2 bg-[#BE844B] text-black rounded-md hover:bg-[#987347] transition-colors flex items-center gap-2 w-full"
                title="Ver precios de servicios"
              >
                <DollarSign size={16} />
                <span className="text-sm font-medium">Precios</span>
              </button>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#AE7E50] mb-2">
                Fecha
              </label>
              <div className="border rounded-lg p-4 text-[#D8C3A5] bg-[#080808] border-[#D8C3A5]/20">
                <DayPicker
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateSelect}
                  className="rounded-md font-sans"
                  disabled={disabledDays}
                  hidden={calendarHiddenDays}
                  locale={es}
                  weekStartsOn={1}
                  formatters={calendarFormatters}
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#AE7E50]">
                Hora
              </label>
              <div className="relative">
                <select
                  required
                  className="mt-1 block w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70]"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                >
                  <option value="">Selecciona un horario</option>
                  {availableTimeSlots.map((time) => {
                    const isBooked = isTimeSlotBooked(time);
                    return (
                      <option key={time} value={time} disabled={isBooked}>
                        {time} {isBooked ? "(No disponible)" : ""}
                      </option>
                    );
                  })}
                </select>
                <Clock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#D8C3A5] pt-1 pb-1 size-6" />
              </div>
              {formData.stylistId && formData.date && selectedService && (
                <p className="mt-2 text-sm text-[#D8C3A5]/80">
                  Los turnos de {selectedService.name.toLowerCase()} tienen una
                  duración de {selectedService.duration} minutos
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-3 bg-[#BE844B] font-semibold text-black rounded-md hover:bg-[#987347] focus:outline-none focus:ring-2 focus:ring-[#AF9A70] focus:ring-offset-2 transition-colors disabled:opacity-50 bronze-button"
            >
              {mutation.isPending ? "RESERVANDO" : "RESERVAR TURNO"}
            </button>
          </div>
        </form>
      </div>

      <PricesModal
        isOpen={isPricesModalOpen}
        onClose={() => setIsPricesModalOpen(false)}
        services={services}
      />

      {lastBookingData && (
        <ConfirmationModal
          isOpen={showConfirmation}
          onConfirm={confirmBooking}
          appointmentData={{
            customerName: lastBookingData.customerName,
            customerEmail: lastBookingData.customerEmail || "",
            customerPhone: lastBookingData.customerPhone,
            serviceName:
              services.find((s) => s.id === lastBookingData.serviceId)?.name ||
              "",
            stylistName: selectedStylist?.name || "",
            date: originalDate || new Date(lastBookingData.date),
            startTime: lastBookingData.startTime,
          }}
        />
      )}
    </div>
  );
}

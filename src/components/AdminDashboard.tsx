"use client";

import { es } from "date-fns/locale";
import { X, Trash2, Store, CheckCircle, UserX } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { Dialog } from "@headlessui/react";
import { useAppointments } from "@/hooks/useAppointments";
import { useStoreClosure } from "@/hooks/useStoreClosure";
import { useHairdresserUnavailability } from "@/hooks/useHairdresserUnavailability";
import { format } from "date-fns";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Stylist } from "@/types";
import {
  calendarFormatters,
  calendarDisabledDays,
  calendarHiddenDays,
} from "@/utils/timeUtils";

export default function AdminDashboard() {
  const {
    appointments,
    isLoading,
    updateStatus,
    deleteAppointment,
    getStatusBadge,
    getStatusText,
  } = useAppointments();

  const {
    formData: storeClosureData,
    setFormData: setStoreClosureData,
    isModalOpen: isStoreClosureModalOpen,
    setIsModalOpen: setIsStoreClosureModalOpen,
    mutation: setStoreClosed,
    handleSubmit: handleStoreClosureSubmit,
  } = useStoreClosure();

  const {
    formData: unavailabilityData,
    setFormData: setUnavailabilityData,
    mutation: setUnavailable,
    handleSubmit: handleUnavailabilitySubmit,
  } = useHairdresserUnavailability();

  const { data: stylists = [] } = useQuery({
    queryKey: ["stylists"],
    queryFn: async () => {
      const res = await fetch("/api/stylists");
      return res.json() as Promise<Stylist[]>;
    },
  });

  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#695D4A]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#D8C3A5]">
            Panel de Turnos
          </h2>
          <p className="text-[#D8C3A5] mt-2">
            Gestioná todos los turnos del salón
          </p>
        </div>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setIsStoreClosureModalOpen(true)}
            className="flex items-center px-3 py-2 text-[#D8C3A5] rounded-md hover:text-[#987347] transition-colors"
          >
            <Store className="mr-2" size={20} />
            Cerrar Local
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 text-[#D8C3A5] rounded-md hover:text-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <Dialog
        open={isStoreClosureModalOpen}
        onClose={() => setIsStoreClosureModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-[#080808] p-6 bronze-border">
            <Dialog.Title className="text-lg font-medium text-[#D8C3A5] mb-4">
              Cerrar Local
            </Dialog.Title>

            <form onSubmit={handleStoreClosureSubmit}>
              <div className="mb-4">
                <p className="text-sm text-[#D8C3A5] mb-2">
                  Seleccioná la fecha en la que el local estará cerrado
                </p>
                <div className="border border-[#D8C3A5]/20 rounded-lg p-4 bg-[#080808] text-[#AE7E50]">
                  <DayPicker
                    mode="single"
                    selected={storeClosureData.date}
                    onSelect={(date) =>
                      setStoreClosureData({ ...storeClosureData, date })
                    }
                    className="rounded-md"
                    hidden={calendarHiddenDays}
                    formatters={calendarFormatters}
                    disabled={calendarDisabledDays}
                    locale={es}
                    weekStartsOn={1}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center text-sm font-medium text-[#D8C3A5]">
                  <input
                    type="checkbox"
                    checked={storeClosureData.fullDay}
                    onChange={(e) => {
                      setStoreClosureData({
                        ...storeClosureData,
                        fullDay: e.target.checked,
                        startTime: e.target.checked
                          ? ""
                          : storeClosureData.startTime,
                        endTime: e.target.checked
                          ? ""
                          : storeClosureData.endTime,
                      });
                    }}
                    className="rounded border-[#D8C3A5]/20 text-[#AF9A70] focus:ring-[#AF9A70] mr-2"
                  />
                  Cerrar todo el día
                </label>
              </div>

              {!storeClosureData.fullDay && (
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#D8C3A5] mb-2">
                      Desde
                    </label>
                    <input
                      type="time"
                      className="mt-1 block w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70]"
                      value={storeClosureData.startTime}
                      onChange={(e) =>
                        setStoreClosureData({
                          ...storeClosureData,
                          startTime: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D8C3A5] mb-2">
                      Hasta
                    </label>
                    <input
                      type="time"
                      className="mt-1 block w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70]"
                      value={storeClosureData.endTime}
                      onChange={(e) =>
                        setStoreClosureData({
                          ...storeClosureData,
                          endTime: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#D8C3A5] mb-2">
                  Motivo (opcional)
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70]"
                  value={storeClosureData.reason}
                  onChange={(e) =>
                    setStoreClosureData({
                      ...storeClosureData,
                      reason: e.target.value,
                    })
                  }
                  placeholder="Ej: Feriado, Mantenimiento, etc."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsStoreClosureModalOpen(false);
                    setStoreClosureData({
                      ...storeClosureData,
                      fullDay: true,
                      startTime: "",
                      endTime: "",
                      reason: "",
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-[#D8C3A5]"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={
                    !storeClosureData.date || setStoreClosed.isPending
                  }
                  className="px-8 py-2 bronze-button"
                >
                  {setStoreClosed.isPending ? "GUARDANDO" : "CONFIRMAR"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#D8C3A5]/20">
            <thead className="bg-[#2A1F1B]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                  Peluquero
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#080808] divide-y divide-[#CACABC]">
              {appointments?.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-[#D8C3A5]">
                        {booking.customerName}
                      </div>
                      {booking.customerEmail && (
                        <div className="text-sm text-[#AE7E50]">
                          {booking.customerEmail}
                        </div>
                      )}
                      <div className="text-sm text-[#AE7E50]">
                        {booking.customerPhone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                    {booking.service.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                    {booking.stylist.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                    {format(
                      new Date(`${booking.date}T${booking.startTime}`),
                      "PPpp",
                      { locale: es }
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(booking.status)}>
                      {getStatusText(booking.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {booking.status === "CONFIRMED" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatus.mutate({
                                id: booking.id,
                                status: "COMPLETED",
                              })
                            }
                            className="text-blue-500 hover:text-blue-700"
                            title="Completado"
                          >
                            <CheckCircle size={20} />
                          </button>
                          <button
                            onClick={() =>
                              updateStatus.mutate({
                                id: booking.id,
                                status: "NO_SHOW",
                              })
                            }
                            className="text-gray-500 hover:text-gray-700"
                            title="No asistió"
                          >
                            <UserX size={20} />
                          </button>
                          <button
                            onClick={() =>
                              updateStatus.mutate({
                                id: booking.id,
                                status: "CANCELLED",
                              })
                            }
                            className="text-red-600 hover:text-red-900"
                            title="Cancelar"
                          >
                            <X size={20} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "¿Estás seguro de que quieres eliminar este turno?"
                            )
                          ) {
                            deleteAppointment.mutate(booking.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold text-[#D8C3A5] mb-6">
          Gestionar Disponibilidad
        </h3>

        <div className="bg-[#080808] shadow-lg rounded-lg p-6">
          <form onSubmit={handleUnavailabilitySubmit}>
            <div className="mb-6">
              <label
                htmlFor="stylist"
                className="block text-sm font-medium text-[#D8C3A5] mb-2"
              >
                Peluquero
              </label>
              <select
                id="stylist"
                className="mt-1 block w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70]"
                value={unavailabilityData.stylistId}
                onChange={(e) =>
                  setUnavailabilityData({
                    ...unavailabilityData,
                    stylistId: e.target.value,
                  })
                }
                required
              >
                <option value="">Seleccionar peluquero</option>
                {stylists.map((stylist) => (
                  <option key={stylist.id} value={stylist.id}>
                    {stylist.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <p className="text-sm text-[#D8C3A5] mb-4">
                Seleccioná la fecha en la que el peluquero no estará disponible
              </p>
              <div className="rounded-lg p-4 text-[#D8C3A5] bg-[#080808] border border-[#D8C3A5]/20">
                <DayPicker
                  mode="single"
                  selected={unavailabilityData.date}
                  onSelect={(date) =>
                    setUnavailabilityData({ ...unavailabilityData, date })
                  }
                  className="rounded-md"
                  disabled={calendarDisabledDays}
                  hidden={calendarHiddenDays}
                  formatters={calendarFormatters}
                  locale={es}
                  weekStartsOn={1}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center text-sm font-medium text-[#D8C3A5]">
                <input
                  type="checkbox"
                  checked={unavailabilityData.fullDay}
                  onChange={(e) => {
                    setUnavailabilityData({
                      ...unavailabilityData,
                      fullDay: e.target.checked,
                      startTime: e.target.checked
                        ? ""
                        : unavailabilityData.startTime,
                      endTime: e.target.checked
                        ? ""
                        : unavailabilityData.endTime,
                    });
                  }}
                  className="rounded border-[#D8C3A5]/20 text-[#AF9A70] focus:ring-[#AF9A70] mr-2"
                />
                Todo el día
              </label>
            </div>

            {!unavailabilityData.fullDay && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#D8C3A5] mb-2">
                    Desde
                  </label>
                  <input
                    type="time"
                    className="mt-1 block w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70]"
                    value={unavailabilityData.startTime}
                    onChange={(e) =>
                      setUnavailabilityData({
                        ...unavailabilityData,
                        startTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#D8C3A5] mb-2">
                    Hasta
                  </label>
                  <input
                    type="time"
                    className="mt-1 block w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70]"
                    value={unavailabilityData.endTime}
                    onChange={(e) =>
                      setUnavailabilityData({
                        ...unavailabilityData,
                        endTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
            )}

            <div className="mt-6">
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-[#D8C3A5] mb-2"
              >
                Motivo (opcional)
              </label>
              <input
                type="text"
                id="reason"
                className="mt-1 block w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70]"
                value={unavailabilityData.reason}
                onChange={(e) =>
                  setUnavailabilityData({
                    ...unavailabilityData,
                    reason: e.target.value,
                  })
                }
                placeholder="Ej: Vacaciones, Día libre, etc."
              />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={
                  !unavailabilityData.stylistId ||
                  !unavailabilityData.date ||
                  setUnavailable.isPending
                }
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bronze-button
                  ${
                    !unavailabilityData.stylistId ||
                    !unavailabilityData.date ||
                    setUnavailable.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
              >
                {setUnavailable.isPending
                  ? "GUARDANDO"
                  : "CONFIRMAR INDISPONIBILIDAD"}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}

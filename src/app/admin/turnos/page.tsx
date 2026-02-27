"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle, UserX, X, Trash2 } from "lucide-react";
import { useAppointments } from "@/hooks/useAppointments";
import PageHeader from "@/components/admin/ui/PageHeader";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import EmptyState from "@/components/admin/ui/EmptyState";

export default function TurnosPage() {
  const {
    appointments,
    isLoading,
    updateStatus,
    deleteAppointment,
  } = useAppointments();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Turnos"
        subtitle="Gestioná todos los turnos del salón"
      />

      {!appointments?.length ? (
        <EmptyState message="No hay turnos próximos" />
      ) : (
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
                {appointments.map((booking) => (
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
                      <StatusBadge status={booking.status} />
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
      )}
    </div>
  );
}

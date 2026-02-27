"use client";

import { es } from "date-fns/locale";
import { Plus, Trash2 } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import { useStylistAbsences } from "@/hooks/admin/useStylistAbsences";
import { Stylist } from "@/types";
import PageHeader from "@/components/admin/ui/PageHeader";
import AdminModal from "@/components/admin/ui/AdminModal";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import EmptyState from "@/components/admin/ui/EmptyState";
import {
  calendarFormatters,
  calendarDisabledDays,
  calendarHiddenDays,
} from "@/utils/timeUtils";
import { useState } from "react";

export default function AusenciasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    absences,
    isLoading,
    formData,
    setFormData,
    createMutation,
    deleteMutation,
    handleSubmit,
  } = useStylistAbsences();

  const { data: stylists = [] } = useQuery({
    queryKey: ["stylists"],
    queryFn: async () => {
      const res = await fetch("/api/stylists");
      return res.json() as Promise<Stylist[]>;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Ausencias de Estilistas"
        subtitle="Gestioná las ausencias de los estilistas"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bronze-button text-sm"
          >
            <Plus size={18} className="mr-2" />
            Nueva Ausencia
          </button>
        }
      />

      {!absences.length ? (
        <EmptyState message="No hay ausencias programadas" />
      ) : (
        <div className="shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#D8C3A5]/20">
              <thead className="bg-[#2A1F1B]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                    Estilista
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                    Horario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                    Motivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#080808] divide-y divide-[#CACABC]">
                {absences.map((absence) => (
                  <tr key={absence.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                      {absence.stylist?.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                      {absence.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                      {absence.startTime && absence.endTime
                        ? `${absence.startTime} - ${absence.endTime}`
                        : "Todo el día"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                      {absence.reason || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          if (window.confirm("¿Eliminar esta ausencia?")) {
                            deleteMutation.mutate(absence.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AdminModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Ausencia"
      >
        <form onSubmit={(e) => { handleSubmit(e); setIsModalOpen(false); }}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#D8C3A5] mb-2">
              Peluquero
            </label>
            <select
              className="mt-1 block w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70] p-2"
              value={formData.stylistId}
              onChange={(e) =>
                setFormData({ ...formData, stylistId: e.target.value })
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

          <div className="mb-4">
            <p className="text-sm text-[#D8C3A5] mb-2">
              Seleccioná la fecha
            </p>
            <div className="border border-[#D8C3A5]/20 rounded-lg p-4 bg-[#080808] text-[#AE7E50]">
              <DayPicker
                mode="single"
                selected={formData.date}
                onSelect={(date) => setFormData({ ...formData, date })}
                className="rounded-md"
                disabled={calendarDisabledDays}
                hidden={calendarHiddenDays}
                formatters={calendarFormatters}
                locale={es}
                weekStartsOn={1}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-[#D8C3A5]">
              <input
                type="checkbox"
                checked={formData.fullDay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullDay: e.target.checked,
                    startTime: e.target.checked ? "" : formData.startTime,
                    endTime: e.target.checked ? "" : formData.endTime,
                  })
                }
                className="rounded border-[#D8C3A5]/20 text-[#AF9A70] focus:ring-[#AF9A70] mr-2"
              />
              Todo el día
            </label>
          </div>

          {!formData.fullDay && (
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#D8C3A5] mb-2">
                  Desde
                </label>
                <input
                  type="time"
                  className="mt-1 block w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70]"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
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
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
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
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              placeholder="Ej: Vacaciones, Día libre, etc."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-[#D8C3A5]"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={
                !formData.stylistId ||
                !formData.date ||
                createMutation.isPending
              }
              className="px-8 py-2 bronze-button"
            >
              {createMutation.isPending ? "GUARDANDO" : "CONFIRMAR"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

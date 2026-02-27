"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useStylistSchedule, StylistScheduleEntry } from "@/hooks/admin/useStylistSchedule";
import { Stylist } from "@/types";
import PageHeader from "@/components/admin/ui/PageHeader";
import AdminModal from "@/components/admin/ui/AdminModal";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import EmptyState from "@/components/admin/ui/EmptyState";

const DAYS = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

export default function HorariosEstilistasPage() {
  const [selectedStylistId, setSelectedStylistId] = useState<string | null>(null);
  const { schedules, isLoading, createMutation, deleteMutation } =
    useStylistSchedule(selectedStylistId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ dayOfWeek: "MONDAY", startTime: "", endTime: "" });

  const { data: stylists = [] } = useQuery({
    queryKey: ["stylists"],
    queryFn: async () => {
      const res = await fetch("/api/stylists");
      return res.json() as Promise<Stylist[]>;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStylistId) return;
    await createMutation.mutateAsync({
      stylistId: selectedStylistId,
      ...form,
    });
    setIsModalOpen(false);
    setForm({ dayOfWeek: "MONDAY", startTime: "", endTime: "" });
  };

  const byDay = DAYS.map((day) => ({
    ...day,
    blocks: schedules.filter((s: StylistScheduleEntry) => s.dayOfWeek === day.value),
  }));

  return (
    <div>
      <PageHeader
        title="Horarios de Estilistas"
        subtitle="Configurá los horarios semanales por estilista"
        actions={
          selectedStylistId ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bronze-button text-sm"
            >
              <Plus size={18} className="mr-2" />
              Agregar Bloque
            </button>
          ) : undefined
        }
      />

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#AE7E50] mb-2">
          Seleccionar Estilista
        </label>
        <select
          className="block w-full max-w-xs rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70] p-2"
          value={selectedStylistId || ""}
          onChange={(e) => setSelectedStylistId(e.target.value || null)}
        >
          <option value="">Seleccionar...</option>
          {stylists.map((stylist) => (
            <option key={stylist.id} value={stylist.id}>
              {stylist.name}
            </option>
          ))}
        </select>
      </div>

      {!selectedStylistId ? (
        <EmptyState message="Seleccioná un estilista para ver sus horarios" />
      ) : isLoading ? (
        <LoadingSpinner />
      ) : !schedules.length ? (
        <EmptyState message="No hay horarios configurados para este estilista" />
      ) : (
        <div className="space-y-4">
          {byDay
            .filter((day) => day.blocks.length > 0)
            .map((day) => (
              <div
                key={day.value}
                className="bg-[#080808] rounded-lg p-4 border border-[#D8C3A5]/20"
              >
                <h3 className="text-lg font-medium text-[#D8C3A5] mb-3">
                  {day.label}
                </h3>
                <div className="space-y-2">
                  {day.blocks.map((block: StylistScheduleEntry) => (
                    <div
                      key={block.id}
                      className="flex items-center justify-between bg-[#2A1F1B] rounded-md px-4 py-2"
                    >
                      <span className="text-sm text-[#D8C3A5]">
                        {block.startTime} - {block.endTime}
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm("¿Eliminar este bloque horario?")) {
                            deleteMutation.mutate(block.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      <AdminModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar Bloque Horario"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#AE7E50] mb-2">
                Día
              </label>
              <select
                className="mt-1 block w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70] p-2"
                value={form.dayOfWeek}
                onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
              >
                {DAYS.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#AE7E50] mb-2">
                  Desde
                </label>
                <input
                  type="time"
                  required
                  className="mt-1 block w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70] p-2"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#AE7E50] mb-2">
                  Hasta
                </label>
                <input
                  type="time"
                  required
                  className="mt-1 block w-full rounded-md border-[#D8C3A5]/20 bg-[#2A1F1B] text-[#D8C3A5] shadow-sm focus:border-[#AF9A70] focus:ring-[#AF9A70] p-2"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-[#D8C3A5]"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-8 py-2 bronze-button"
            >
              {createMutation.isPending ? "GUARDANDO" : "AGREGAR"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

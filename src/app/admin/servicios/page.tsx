"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useServices } from "@/hooks/admin/useServices";
import { Service } from "@/types";
import PageHeader from "@/components/admin/ui/PageHeader";
import AdminModal from "@/components/admin/ui/AdminModal";
import FormField from "@/components/admin/ui/FormField";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import EmptyState from "@/components/admin/ui/EmptyState";

interface ServiceForm {
  name: string;
  description: string;
  price: string;
  duration: string;
}

const emptyForm: ServiceForm = { name: "", description: "", price: "", duration: "" };

const formatPrice = (cents: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(cents / 100);
};

export default function ServiciosPage() {
  const { services, isLoading, createMutation, updateMutation, deleteMutation } =
    useServices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description || "",
      price: String(service.price / 100),
      duration: String(service.duration),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      description: form.description || undefined,
      price: Math.round(Number(form.price) * 100),
      duration: Number(form.duration),
    };

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsModalOpen(false);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Servicios"
        subtitle="Gestioná los servicios del salón"
        actions={
          <button onClick={openCreate} className="flex items-center px-4 py-2 bronze-button text-sm">
            <Plus size={18} className="mr-2" />
            Nuevo Servicio
          </button>
        }
      />

      {!services.length ? (
        <EmptyState message="No hay servicios" />
      ) : (
        <div className="shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#D8C3A5]/20">
              <thead className="bg-[#2A1F1B]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                    Duración
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
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                      {service.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                      {formatPrice(service.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                      {service.duration} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          updateMutation.mutate({
                            id: service.id,
                            isActive: !service.isActive,
                          })
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {service.isActive ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEdit(service)}
                          className="text-[#AE7E50] hover:text-[#D8C3A5]"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("¿Eliminar este servicio?")) {
                              deleteMutation.mutate(service.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
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

      <AdminModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Editar Servicio" : "Nuevo Servicio"}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormField
              label="Nombre"
              inputProps={{
                type: "text",
                required: true,
                value: form.name,
                onChange: (e) => setForm({ ...form, name: e.target.value }),
              }}
            />
            <FormField
              label="Descripción (opcional)"
              inputProps={{
                type: "text",
                value: form.description,
                onChange: (e) => setForm({ ...form, description: e.target.value }),
              }}
            />
            <FormField
              label="Precio (ARS)"
              inputProps={{
                type: "number",
                required: true,
                min: 0,
                step: "0.01",
                value: form.price,
                onChange: (e) => setForm({ ...form, price: e.target.value }),
              }}
            />
            <FormField
              label="Duración (minutos)"
              inputProps={{
                type: "number",
                required: true,
                min: 1,
                value: form.duration,
                onChange: (e) => setForm({ ...form, duration: e.target.value }),
              }}
            />
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
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-8 py-2 bronze-button"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "GUARDANDO"
                : "GUARDAR"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

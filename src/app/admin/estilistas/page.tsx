"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useStylists } from "@/hooks/admin/useStylists";
import { useServices } from "@/hooks/admin/useServices";
import { Stylist } from "@/types";
import PageHeader from "@/components/admin/ui/PageHeader";
import AdminModal from "@/components/admin/ui/AdminModal";
import FormField from "@/components/admin/ui/FormField";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import EmptyState from "@/components/admin/ui/EmptyState";

interface StylistForm {
  name: string;
  phone: string;
  email: string;
  imageUrl: string;
}

const emptyForm: StylistForm = { name: "", phone: "", email: "", imageUrl: "" };

export default function EstilistasPage() {
  const { stylists, isLoading, createMutation, updateMutation, deleteMutation, syncServicesMutation } =
    useStylists();
  const { services } = useServices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<StylistForm>(emptyForm);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedServiceIds([]);
    setIsModalOpen(true);
  };

  const openEdit = (stylist: Stylist) => {
    setEditingId(stylist.id);
    setForm({
      name: stylist.name,
      phone: stylist.phone || "",
      email: stylist.email || "",
      imageUrl: stylist.imageUrl || "",
    });
    setSelectedServiceIds(
      stylist.services?.map((s) => s.service.id) || []
    );
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      phone: form.phone || undefined,
      email: form.email || undefined,
      imageUrl: form.imageUrl || undefined,
    };

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, ...data });
      await syncServicesMutation.mutateAsync({ id: editingId, serviceIds: selectedServiceIds });
    } else {
      const created = await createMutation.mutateAsync(data);
      if (selectedServiceIds.length > 0) {
        await syncServicesMutation.mutateAsync({ id: created.id, serviceIds: selectedServiceIds });
      }
    }
    setIsModalOpen(false);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Estilistas"
        subtitle="Gestioná los estilistas del salón"
        actions={
          <button onClick={openCreate} className="flex items-center px-4 py-2 bronze-button text-sm">
            <Plus size={18} className="mr-2" />
            Nuevo Estilista
          </button>
        }
      />

      {!stylists.length ? (
        <EmptyState message="No hay estilistas" />
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
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                    Servicios
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
                {stylists.map((stylist) => (
                  <tr key={stylist.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                      {stylist.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                      {stylist.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                      {stylist.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                      {stylist.services?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          updateMutation.mutate({
                            id: stylist.id,
                            isActive: !stylist.isActive,
                          })
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          stylist.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {stylist.isActive ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEdit(stylist)}
                          className="text-[#AE7E50] hover:text-[#D8C3A5]"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("¿Eliminar este estilista?")) {
                              deleteMutation.mutate(stylist.id);
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
        title={editingId ? "Editar Estilista" : "Nuevo Estilista"}
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
              label="Teléfono"
              inputProps={{
                type: "text",
                value: form.phone,
                onChange: (e) => setForm({ ...form, phone: e.target.value }),
              }}
            />
            <FormField
              label="Email"
              inputProps={{
                type: "email",
                value: form.email,
                onChange: (e) => setForm({ ...form, email: e.target.value }),
              }}
            />
            <FormField
              label="URL de imagen"
              inputProps={{
                type: "url",
                value: form.imageUrl,
                onChange: (e) => setForm({ ...form, imageUrl: e.target.value }),
              }}
            />

            {services.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[#AE7E50] mb-2">
                  Servicios
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-[#D8C3A5]/20 rounded-md p-3 bg-[#2A1F1B]">
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center text-sm text-[#D8C3A5]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServiceIds.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                        className="rounded border-[#D8C3A5]/20 text-[#AF9A70] focus:ring-[#AF9A70] mr-2"
                      />
                      {service.name}
                    </label>
                  ))}
                </div>
              </div>
            )}
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

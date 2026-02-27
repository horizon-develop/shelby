"use client";

import { UserPlus, Lock } from "lucide-react";
import { useUsers } from "@/hooks/admin/useUsers";
import PageHeader from "@/components/admin/ui/PageHeader";
import AdminModal from "@/components/admin/ui/AdminModal";
import FormField from "@/components/admin/ui/FormField";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import EmptyState from "@/components/admin/ui/EmptyState";

export default function UsuariosPage() {
  const {
    users,
    isLoading,
    passwordData,
    setPasswordData,
    passwordLoading,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    handleChangePassword,
    newUserData,
    setNewUserData,
    createUserLoading,
    isCreateUserModalOpen,
    setIsCreateUserModalOpen,
    handleCreateUser,
  } = useUsers();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Usuarios"
        subtitle="Gestioná los usuarios administradores"
        actions={
          <>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center px-4 py-2 text-[#D8C3A5] hover:text-[#987347] transition-colors text-sm"
            >
              <Lock size={18} className="mr-2" />
              Cambiar Contraseña
            </button>
            <button
              onClick={() => setIsCreateUserModalOpen(true)}
              className="flex items-center px-4 py-2 bronze-button text-sm"
            >
              <UserPlus size={18} className="mr-2" />
              Crear Usuario
            </button>
          </>
        }
      />

      {!users.length ? (
        <EmptyState message="No hay usuarios" />
      ) : (
        <div className="shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#D8C3A5]/20">
              <thead className="bg-[#2A1F1B]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#AE7E50] uppercase tracking-wider">
                    Creado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#080808] divide-y divide-[#CACABC]">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                      {user.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D8C3A5]">
                      {new Date(user.createdAt).toLocaleDateString("es-AR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <AdminModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Cambiar Contraseña"
      >
        <form onSubmit={handleChangePassword}>
          <div className="space-y-4">
            <FormField
              label="Contraseña actual"
              inputProps={{
                type: "password",
                required: true,
                value: passwordData.oldPassword,
                onChange: (e) =>
                  setPasswordData({ ...passwordData, oldPassword: e.target.value }),
              }}
            />
            <FormField
              label="Nueva contraseña"
              inputProps={{
                type: "password",
                required: true,
                minLength: 6,
                value: passwordData.newPassword,
                onChange: (e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value }),
              }}
            />
            <FormField
              label="Confirmar nueva contraseña"
              inputProps={{
                type: "password",
                required: true,
                minLength: 6,
                value: passwordData.confirmPassword,
                onChange: (e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value }),
              }}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsPasswordModalOpen(false);
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
              }}
              className="px-4 py-2 text-sm font-medium text-[#D8C3A5]"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-8 py-2 bronze-button"
            >
              {passwordLoading ? "GUARDANDO" : "CAMBIAR"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Create User Modal */}
      <AdminModal
        open={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        title="Crear Usuario"
      >
        <form onSubmit={handleCreateUser}>
          <div className="space-y-4">
            <FormField
              label="Email"
              inputProps={{
                type: "email",
                required: true,
                value: newUserData.email,
                onChange: (e) =>
                  setNewUserData({ ...newUserData, email: e.target.value }),
              }}
            />
            <FormField
              label="Nombre (opcional)"
              inputProps={{
                type: "text",
                value: newUserData.name,
                onChange: (e) =>
                  setNewUserData({ ...newUserData, name: e.target.value }),
              }}
            />
            <FormField
              label="Contraseña"
              inputProps={{
                type: "password",
                required: true,
                minLength: 6,
                value: newUserData.password,
                onChange: (e) =>
                  setNewUserData({ ...newUserData, password: e.target.value }),
              }}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsCreateUserModalOpen(false);
                setNewUserData({ email: "", name: "", password: "" });
              }}
              className="px-4 py-2 text-sm font-medium text-[#D8C3A5]"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={createUserLoading}
              className="px-8 py-2 bronze-button"
            >
              {createUserLoading ? "CREANDO" : "CREAR"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

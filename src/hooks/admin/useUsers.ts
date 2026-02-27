"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export const useUsers = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      return res.json() as Promise<User[]>;
    },
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Contraseña actualizada correctamente");
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setIsPasswordModalOpen(false);
      } else {
        alert(data.message || "Error al cambiar la contraseña");
      }
    } catch {
      alert("Error al cambiar la contraseña");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Create user
  const [newUserData, setNewUserData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateUserLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserData),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Usuario ${data.email} creado correctamente`);
        setNewUserData({ email: "", name: "", password: "" });
        setIsCreateUserModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["users"] });
      } else {
        alert(data.message || "Error al crear usuario");
      }
    } catch {
      alert("Error al crear usuario");
    } finally {
      setCreateUserLoading(false);
    }
  };

  return {
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
  };
};

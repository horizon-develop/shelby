"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        onClose();
        router.push("/admin");
      } else {
        setError("Credenciales inválidas");
      }
    } catch {
      setError("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-[#080808] p-6 w-full border border-[#d8C3A5]/20 bronze-glow">
          <Dialog.Title className="text-3xl font-bold text-[#D8C3A5] text-center mb-10">
            Iniciar Sesión
          </Dialog.Title>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 text-red-500 text-sm bg-red-100 p-2 rounded">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#AE7E50] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border-[#CACABC] bg-[#2A1F1B] text-[#D8C3A5] p-2"
                required
              />
            </div>

            <div className="mb-10">
              <label className="block text-sm font-medium text-[#AE7E50] mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border-[#CACABC] bg-[#2A1F1B] text-[#D8C3A5] p-2"
                required
              />
            </div>

            <div className="flex justify-center space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-2 bg-[#BE844B] font-medium text-black rounded-md hover:bg-[#987347] disabled:opacity-50 bronze-button"
              >
                {isLoading ? "INICIANDO" : "INICIAR SESIÓN"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

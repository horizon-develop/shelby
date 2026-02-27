"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Calendar,
  Scissors,
  SprayCan,
  Clock,
  UserCog,
  Store,
  UserX,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin/turnos", label: "Turnos", icon: Calendar },
  { href: "/admin/estilistas", label: "Estilistas", icon: Scissors },
  { href: "/admin/servicios", label: "Servicios", icon: SprayCan },
  { href: "/admin/horarios-salon", label: "Horarios Salón", icon: Clock },
  { href: "/admin/horarios-estilistas", label: "Horarios Estilistas", icon: UserCog },
  { href: "/admin/cierres", label: "Cierres", icon: Store },
  { href: "/admin/ausencias", label: "Ausencias", icon: UserX },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const nav = (
    <nav className="flex flex-col h-full">
      <div className="p-6 border-b border-[#D8C3A5]/20">
        <h1 className="text-xl font-bold text-[#D8C3A5]">Admin Panel</h1>
      </div>
      <div className="flex-1 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#2A1F1B] text-[#BE844B] border-r-2 border-[#BE844B]"
                  : "text-[#D8C3A5] hover:bg-[#2A1F1B]/50 hover:text-[#BE844B]"
              }`}
            >
              <Icon size={18} className="mr-3 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-[#D8C3A5]/20">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-3 text-sm font-medium text-[#D8C3A5] hover:text-red-400 transition-colors"
        >
          <LogOut size={18} className="mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#0A0A0A] text-[#D8C3A5] lg:hidden"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - mobile slide-over */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0A0A0A] border-r border-[#D8C3A5]/20 transform transition-transform lg:translate-x-0 lg:static lg:z-auto ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {nav}
      </aside>
    </>
  );
}

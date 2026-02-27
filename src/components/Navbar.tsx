"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-[#080808] shadow bronze-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex items-center">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-primary-light flex items-center justify-center">
                  <Image
                    src="/shelby-logo.jpg"
                    alt="Shelby Logo"
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="ml-1 sm:ml-3 text-lg sm:text-2xl font-serif font-normal text-[#D8C3A5]">
                  SHELBY
                </span>
              </Link>
            </div>
            <div className="flex items-center sm:space-x-4">
              <Link
                href="/"
                className="text-xs text-center text-[#d8C3A5] hover:text-[#987347] transition-colors font-medium sm:text-sm"
              >
                RESERVAR TURNO
              </Link>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-xs text-center text-[#d8C3A5] hover:text-[#987347] transition-colors font-medium sm:text-sm"
              >
                PANEL DE ADMINISTRACIÓN
              </button>
            </div>
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}

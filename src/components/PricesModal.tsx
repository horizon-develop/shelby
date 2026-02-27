"use client";

import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { Service } from "@/types";
import { formatPrice } from "@/constants/appointments";

interface PricesModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
}

export default function PricesModal({
  isOpen,
  onClose,
  services,
}: PricesModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-[#080808] p-6 bronze-border">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium text-[#D8C3A5]">
              Precios de Servicios
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-[#D8C3A5] hover:text-[#987347] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {services.map((service) => {
              const nameLower = service.name.toLowerCase();
              const showDesde =
                nameLower.includes("brushing") ||
                nameLower.includes("hidratación");

              return (
                <div
                  key={service.id}
                  className="flex justify-between items-center py-2 px-3 rounded-md bg-[#2A1F1B] border border-[#D8C3A5]/20"
                >
                  <span className="text-[#D8C3A5] text-sm mr-2">
                    {service.name}
                    {showDesde ? " desde " : ""}
                  </span>
                  <span className="text-[#AE7E50] font-semibold text-base">
                    {formatPrice(service.price)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bronze-button">
              CERRAR
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

"use client";

import { MessageCircle, Calendar, Clock, User, Scissors } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  appointmentData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceName: string;
    stylistName: string;
    date: Date;
    startTime: string;
  };
}

export default function ConfirmationModal({
  isOpen,
  onConfirm,
  appointmentData,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const generateWhatsAppURL = (data: typeof appointmentData): string => {
    const phoneNumber = "5493794910607";
    const formattedDate = format(data.date, "dd 'de' MMMM 'de' yyyy", {
      locale: es,
    });

    const message = `¡Hola! Me llamo ${data.customerName}.

    Confirmo mi turno para:
    📅 Fecha: ${formattedDate}
    🕐 Hora: ${data.startTime}
    ✂️ Servicio: ${data.serviceName}
    👨‍💼 Peluquero: ${data.stylistName}

    📧 Mi correo: ${data.customerEmail}
    📱 Mi teléfono: ${data.customerPhone}

    ¡Gracias!`;

    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  };

  const handleWhatsAppClick = () => {
    const url = generateWhatsAppURL(appointmentData);
    window.open(url, "_blank");
    onConfirm();
  };

  const formattedDate = format(
    appointmentData.date,
    "dd 'de' MMMM 'de' yyyy",
    { locale: es }
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#080808] rounded-xl shadow-lg bronze-border max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#D8C3A5]">
            ¡Turno Reservado!
          </h2>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 text-[#D8C3A5]">
            <User size={20} className="text-[#AE7E50]" />
            <span className="font-medium">{appointmentData.customerName}</span>
          </div>

          <div className="flex items-center gap-3 text-[#D8C3A5]">
            <Calendar size={20} className="text-[#AE7E50]" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-3 text-[#D8C3A5]">
            <Clock size={20} className="text-[#AE7E50]" />
            <span>{appointmentData.startTime}</span>
          </div>

          <div className="flex items-center gap-3 text-[#D8C3A5]">
            <Scissors size={20} className="text-[#AE7E50]" />
            <span>{appointmentData.serviceName}</span>
          </div>

          <div className="flex items-center gap-3 text-[#D8C3A5]">
            <User size={20} className="text-[#AE7E50]" />
            <span>{appointmentData.stylistName}</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[#D8C3A5]/80 text-sm text-center">
            Para completar tu reserva, necesitas confirmar tu turno por WhatsApp
          </p>

          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            Confirmar por WhatsApp
          </button>

          <p className="text-[#D8C3A5]/60 text-xs text-center">
            Al hacer clic, se abrirá WhatsApp con un mensaje pre-escrito
          </p>
        </div>
      </div>
    </div>
  );
}

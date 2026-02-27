"use client";

import { Dialog } from "@headlessui/react";
import { ReactNode } from "react";

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function AdminModal({ open, onClose, title, children }: AdminModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded bg-[#080808] p-6 bronze-border max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-lg font-medium text-[#D8C3A5] mb-4">
            {title}
          </Dialog.Title>
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

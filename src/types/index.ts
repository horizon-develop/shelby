export type BookingStatus = "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  isActive: boolean;
  order: number;
}

export interface Stylist {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  imageUrl: string | null;
  isActive: boolean;
  order: number;
  services?: { service: Service }[];
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  notes: string | null;
  serviceId: string;
  stylistId: string;
  service: Service;
  stylist: Stylist;
}

export interface BookingDTO {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  stylistId: string;
  date: string;
  startTime: string;
  notes?: string;
}

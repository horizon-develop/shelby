import { BookingStatus } from "./index";

export interface StoreClosureFormData {
  date: Date | undefined;
  reason: string;
  fullDay: boolean;
  startTime: string;
  endTime: string;
}

export interface UnavailabilityFormData {
  stylistId: string;
  date: Date | undefined;
  reason: string;
  fullDay: boolean;
  startTime: string;
  endTime: string;
}

export interface StatusUpdateDTO {
  status: BookingStatus;
}

export interface StylistAbsenceDTO {
  stylistId: string;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  reason?: string;
}

export interface StylistAbsenceResponse {
  id: string;
  stylistId: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
}

export interface SalonClosureDTO {
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  reason?: string;
}

export interface SalonClosureResponse {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
}

export type StatusBadgeConfig = Record<BookingStatus, string>;
export type StatusTextConfig = Record<BookingStatus, string>;

import { StatusBadgeConfig, StatusTextConfig } from "../types/admin";

export const STATUS_BADGES: StatusBadgeConfig = {
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  NO_SHOW: "bg-gray-100 text-gray-800",
};

export const STATUS_TEXTS: StatusTextConfig = {
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
  COMPLETED: "Completado",
  NO_SHOW: "No asistió",
};

export const INITIAL_STORE_CLOSURE_STATE = {
  date: undefined,
  reason: "",
  fullDay: true,
  startTime: "",
  endTime: "",
};

export const INITIAL_UNAVAILABILITY_STATE = {
  stylistId: "",
  date: undefined,
  reason: "",
  fullDay: true,
  startTime: "",
  endTime: "",
};

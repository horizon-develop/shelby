import { z } from "zod";

const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const bookingSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  serviceId: z.string().min(1, "Service is required"),
  stylistId: z.string().min(1, "Stylist is required"),
  date: z.string().regex(datePattern, "Date must be in yyyy-MM-dd format"),
  startTime: z.string().regex(timePattern, "Invalid time format"),
  notes: z.string().optional(),
});

export const statusUpdateSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]),
});

export const stylistAbsenceSchema = z.object({
  stylistId: z.string().min(1, "Stylist ID is required"),
  date: z.string().regex(datePattern, "Date must be in yyyy-MM-dd format"),
  startTime: z.string().regex(timePattern, "Invalid time format").nullable().optional(),
  endTime: z.string().regex(timePattern, "Invalid time format").nullable().optional(),
  reason: z.string().optional(),
});

export const salonClosureSchema = z.object({
  date: z.string().regex(datePattern, "Date must be in yyyy-MM-dd format"),
  startTime: z.string().regex(timePattern, "Invalid time format").nullable().optional(),
  endTime: z.string().regex(timePattern, "Invalid time format").nullable().optional(),
  reason: z.string().optional(),
});


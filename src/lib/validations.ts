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

export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const stylistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  imageUrl: z.string().url().optional().or(z.literal("")).nullable(),
});

export const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  price: z.number().int().min(0, "Price must be positive"),
  duration: z.number().int().min(1, "Duration must be at least 1 minute"),
});

export const salonScheduleSchema = z.object({
  dayOfWeek: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
  startTime: z.string().regex(timePattern, "Invalid time format"),
  endTime: z.string().regex(timePattern, "Invalid time format"),
});

export const stylistScheduleSchema = z.object({
  stylistId: z.string().min(1, "Stylist ID is required"),
  dayOfWeek: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
  startTime: z.string().regex(timePattern, "Invalid time format"),
  endTime: z.string().regex(timePattern, "Invalid time format"),
});

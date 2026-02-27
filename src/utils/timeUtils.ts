import { Formatters } from "react-day-picker";

export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

export const addMinutesToTime = (time: string, minutes: number): string => {
  const total = timeToMinutes(time) + minutes;
  const hh = Math.floor(total / 60).toString().padStart(2, "0");
  const mm = (total % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
};

/**
 * Generate time slots based on service duration.
 * Uses 30-min base intervals. For 60-min services, only shows :00 slots.
 * Skips lunch break (12:00-13:00).
 */
export const generateTimeSlots = (
  serviceDuration: number,
  selectedDate?: Date,
  selectedStylist?: string
) => {
  if (!selectedDate || !selectedStylist) return [];

  const dayOfWeek = selectedDate.getDay();
  if (dayOfWeek === 0) return []; // Sunday closed

  const startHour = 10;
  const endHour = 22;

  const hours: number[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    if (hour === 12) continue; // lunch break
    hours.push(hour);
  }

  const slots = hours.flatMap((hour) => {
    const hh = hour.toString().padStart(2, "0");
    if (serviceDuration >= 60) {
      return [`${hh}:00`];
    }
    return [`${hh}:00`, `${hh}:30`];
  });

  return slots;
};

export const calendarFormatters: Partial<Formatters> = {
  formatWeekdayName: (date: Date) => {
    const weekdays = ["LU", "MA", "MI", "JU", "VI", "SA"];
    const index = date.getDay() - 1;
    return index >= 0 && index < weekdays.length ? weekdays[index] : "";
  },
  formatCaption: (
    date: Date,
    options?: { locale?: { code?: string } }
  ) => {
    const formatter = new Intl.DateTimeFormat(
      options?.locale?.code || "es",
      { month: "long" }
    );
    const month = formatter.format(date);
    return (
      month.charAt(0).toUpperCase() + month.slice(1) + " " + date.getFullYear()
    );
  },
};

export const calendarDisabledDays = {
  before: new Date(),
};

export const calendarHiddenDays = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0; // Hide Sunday only
};

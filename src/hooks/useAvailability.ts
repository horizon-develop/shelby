"use client";

import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { timeToMinutes, addMinutesToTime } from "@/utils/timeUtils";
import { Booking } from "@/types";
import { StylistAbsenceResponse, SalonClosureResponse } from "@/types/admin";

interface UseAvailabilityProps {
  selectedDate?: Date;
  selectedStylist: string;
  serviceDuration: number;
}

export const useAvailability = ({
  selectedDate,
  selectedStylist,
  serviceDuration,
}: UseAvailabilityProps) => {
  const { data: storeClosed = [] } = useQuery({
    queryKey: ["storeClosures"],
    queryFn: async () => {
      const res = await fetch("/api/availability/store-closures");
      return res.json() as Promise<SalonClosureResponse[]>;
    },
  });

  const { data: stylistAbsences = [] } = useQuery({
    queryKey: ["unavailableDates", selectedStylist],
    queryFn: async () => {
      if (!selectedStylist) return [];
      const res = await fetch(
        `/api/availability/${selectedStylist}/unavailable-dates`
      );
      return res.json() as Promise<StylistAbsenceResponse[]>;
    },
    enabled: !!selectedStylist,
  });

  const { data: existingAppointments = [] } = useQuery({
    queryKey: ["appointments", selectedStylist, selectedDate],
    queryFn: async () => {
      const res = await fetch("/api/appointments");
      const data: Booking[] = await res.json();
      return data.filter(
        (apt) =>
          apt.stylistId === selectedStylist &&
          apt.date ===
            (selectedDate ? format(selectedDate, "yyyy-MM-dd") : "") &&
          apt.status !== "CANCELLED"
      );
    },
    enabled: !!selectedStylist && !!selectedDate,
  });

  const isTimeSlotBooked = (time: string) => {
    const slotStart = timeToMinutes(time);
    const slotEnd = timeToMinutes(addMinutesToTime(time, serviceDuration));

    // Check existing bookings for overlap
    const isBooked = existingAppointments.some((apt) => {
      const aptStart = timeToMinutes(apt.startTime);
      const aptEnd = timeToMinutes(apt.endTime);
      return slotStart < aptEnd && slotEnd > aptStart;
    });

    if (isBooked) return true;

    // Check stylist absences
    if (selectedDate && selectedStylist) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      const absent = stylistAbsences.some((absence) => {
        if (absence.date === formattedDate) {
          if (!absence.startTime || !absence.endTime) return true; // full day
          const absStart = timeToMinutes(absence.startTime);
          const absEnd = timeToMinutes(absence.endTime);
          return slotStart < absEnd && slotEnd > absStart;
        }
        return false;
      });

      if (absent) return true;
    }

    // Check salon closures
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      return storeClosed.some((closure) => {
        if (closure.date === formattedDate) {
          if (!closure.startTime || !closure.endTime) return true; // full day
          const closureStart = timeToMinutes(closure.startTime);
          const closureEnd = timeToMinutes(closure.endTime);
          return slotStart < closureEnd && slotEnd > closureStart;
        }
        return false;
      });
    }

    return false;
  };

  const isDateUnavailable = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");

    const isStoreClosed = storeClosed.some(
      (closure) =>
        format(new Date(closure.date), "yyyy-MM-dd") === formattedDate
    );

    const isStylistAbsent =
      !!selectedStylist &&
      stylistAbsences.some(
        (absence) =>
          format(new Date(absence.date), "yyyy-MM-dd") === formattedDate
      );

    return isStoreClosed || isStylistAbsent;
  };

  return {
    isTimeSlotBooked,
    isDateUnavailable,
    storeClosed,
    stylistAbsences,
    existingAppointments,
  };
};

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60).toString().padStart(2, "0");
  const mm = (total % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: { service: true, stylist: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  const formatted = bookings.map((b) => ({
    ...b,
    date: b.date.toISOString().split("T")[0],
  }));

  return NextResponse.json(formatted);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { customerName, customerPhone, customerEmail, serviceId, stylistId, date, startTime, notes } = parsed.data;
  const bookingDate = new Date(date + "T00:00:00.000Z");

  // Get service for duration
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return NextResponse.json({ message: "Servicio no encontrado" }, { status: 400 });
  }

  const endTime = addMinutes(startTime, service.duration);

  // Check salon closures
  const closures = await prisma.salonClosure.findMany({
    where: { date: bookingDate },
  });

  for (const closure of closures) {
    if (!closure.startTime || !closure.endTime) {
      return NextResponse.json(
        { message: "El local está cerrado en esta fecha" },
        { status: 400 }
      );
    }
    // Partial closure: check overlap
    if (startTime < closure.endTime && endTime > closure.startTime) {
      return NextResponse.json(
        { message: `El local está cerrado de ${closure.startTime} a ${closure.endTime}` },
        { status: 400 }
      );
    }
  }

  // Check stylist absences
  const absences = await prisma.stylistAbsence.findMany({
    where: { date: bookingDate, stylistId },
  });

  for (const absence of absences) {
    if (!absence.startTime || !absence.endTime) {
      return NextResponse.json(
        { message: "El peluquero no está disponible en esta fecha" },
        { status: 400 }
      );
    }
    if (startTime < absence.endTime && endTime > absence.startTime) {
      return NextResponse.json(
        { message: `El peluquero no está disponible de ${absence.startTime} a ${absence.endTime}` },
        { status: 400 }
      );
    }
  }

  // Check overlapping bookings
  const conflict = await prisma.booking.findFirst({
    where: {
      date: bookingDate,
      stylistId,
      status: { not: "CANCELLED" },
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
  });

  if (conflict) {
    return NextResponse.json(
      { message: "El peluquero no está disponible en este horario" },
      { status: 400 }
    );
  }

  const booking = await prisma.booking.create({
    data: {
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      date: bookingDate,
      startTime,
      endTime,
      serviceId,
      stylistId,
      notes: notes || null,
    },
    include: { service: true, stylist: true },
  });

  return NextResponse.json({
    ...booking,
    date: booking.date.toISOString().split("T")[0],
  });
}

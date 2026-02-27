import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stylistAbsenceSchema } from "@/lib/validations";

export async function GET() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const absences = await prisma.stylistAbsence.findMany({
    where: { date: { gte: today } },
    include: { stylist: { select: { name: true } } },
    orderBy: { date: "asc" },
  });

  const formatted = absences.map((a) => ({
    ...a,
    date: a.date.toISOString().split("T")[0],
  }));

  return NextResponse.json(formatted);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = stylistAbsenceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { stylistId, date, startTime, endTime, reason } = parsed.data;
  const isFullDay = !startTime || !endTime;

  if (!isFullDay && startTime! >= endTime!) {
    return NextResponse.json(
      { message: "Start time must be before end time" },
      { status: 400 }
    );
  }

  const absence = await prisma.stylistAbsence.create({
    data: {
      stylistId,
      date: new Date(date + "T00:00:00.000Z"),
      startTime: isFullDay ? null : startTime,
      endTime: isFullDay ? null : endTime,
      reason: reason || null,
    },
  });

  return NextResponse.json({
    ...absence,
    date: absence.date.toISOString().split("T")[0],
  });
}

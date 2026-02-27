import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { salonClosureSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = salonClosureSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { date, startTime, endTime, reason } = parsed.data;
  const isFullDay = !startTime || !endTime;

  if (!isFullDay && startTime! >= endTime!) {
    return NextResponse.json(
      { message: "Start time must be before end time" },
      { status: 400 }
    );
  }

  const closure = await prisma.salonClosure.create({
    data: {
      date: new Date(date + "T00:00:00.000Z"),
      startTime: isFullDay ? null : startTime,
      endTime: isFullDay ? null : endTime,
      reason: reason || null,
    },
  });

  return NextResponse.json({
    ...closure,
    date: closure.date.toISOString().split("T")[0],
  });
}

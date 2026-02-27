import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stylistScheduleSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const stylistId = req.nextUrl.searchParams.get("stylistId");

  const schedules = await prisma.stylistSchedule.findMany({
    where: stylistId ? { stylistId } : {},
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    include: { stylist: { select: { name: true } } },
  });

  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = stylistScheduleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  if (parsed.data.startTime >= parsed.data.endTime) {
    return NextResponse.json(
      { message: "Start time must be before end time" },
      { status: 400 }
    );
  }

  const schedule = await prisma.stylistSchedule.create({
    data: parsed.data,
  });

  return NextResponse.json(schedule, { status: 201 });
}

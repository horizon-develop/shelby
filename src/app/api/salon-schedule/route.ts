import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { salonScheduleSchema } from "@/lib/validations";

export async function GET() {
  const schedules = await prisma.salonSchedule.findMany({
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = salonScheduleSchema.safeParse(body);

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

  const schedule = await prisma.salonSchedule.create({
    data: parsed.data,
  });

  return NextResponse.json(schedule, { status: 201 });
}

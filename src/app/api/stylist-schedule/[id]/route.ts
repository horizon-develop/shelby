import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stylistScheduleSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  const schedule = await prisma.stylistSchedule.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(schedule);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.stylistSchedule.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

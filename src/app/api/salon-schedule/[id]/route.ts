import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { salonScheduleSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  if (typeof body.isActive === "boolean" && Object.keys(body).length === 1) {
    const schedule = await prisma.salonSchedule.update({
      where: { id },
      data: { isActive: body.isActive },
    });
    return NextResponse.json(schedule);
  }

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

  const schedule = await prisma.salonSchedule.update({
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
  await prisma.salonSchedule.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
